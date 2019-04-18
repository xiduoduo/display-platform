<template>
  <div
    class="page"
    :style="{
        backgroundImage: 'url(' + LayoutBg + ')',
      }"
  >
    <div
      class="page-box scales"
      :style="{
        backgroundImage: 'url(' + bg + ')',
        color: 'red',
        transform: trans
      }"
    >
      <div class="nav">
        <div class="logo">
          <img
            :src="logo"
            alt=""
          >
        </div>
        <div class="time">
          <p class="font-lgdr">{{time}}</p>
          <p>{{date}}</p>
        </div>
      </div>
      <div class="container">
        <transition :name="transName">
          <keep-alive>
            <router-view
              class="child-view"
              mode="out-in"
              v-if="$route.meta.keepAlive"
            ></router-view>
          </keep-alive>
          <router-view
            class="child-view"
            mode="out-in"
            v-if="!$route.meta.keepAlive"
          ></router-view>
        </transition>
      </div>
      <div class="pagination">
        <span
          v-for="(v, i) in paths"
          :key="i"
          :class="{active: pathIndex === i}"
          @click="changeRoute(i)"
        ></span>
      </div>
    </div>
  </div>
</template>
<script>
import Bg from '@/assets/kms/bg.jpg';
import LayoutBg from '@/assets/kms/layout-bg.jpg';
import Logo from '@/assets/kms/logo.png';
import apiServices from '@/services/api';
import Zbase from '@/lib/zbase';
export default {
  data () {
    return {
      bg: Bg,
      logo: Logo,
      LayoutBg,
      trans: '',
      paths: ['index.html', 'page2/index.html'],
      pathIndex: 0,
      transName: 'slide-left',
      date: '',
      time: '',
      dateTimer: null
    };
  },
  created () {
    this.$store.commit('UPDATE_GLOBAL_BRAND', {
      name: '康明斯',
      token: '44839dc2bb5640e685f5ee651b7a27c9'
    });
    this.pathIndex = this.$route.path.split('page')[1] - 1;
  },
  beforeRouteUpdate (to, from, next) {
    let toPath = to.path.split('page')[1];
    let fromPath = from.path.split('page')[1];
    this.transName = fromPath < toPath ? 'slide-left' : 'slide-right';
    next();
  },
  methods: {
    changeHight () {
      this.getHeight();
      setTimeout(() => {
        this.winResize();
      }, 100);
    },
    getHeight () {
      let w = 1920;
      let h = 1080;
      var dw = document.documentElement.offsetWidth / w;
      var dh = document.documentElement.offsetHeight / h;
      var d = Math.min(dw, dh);
      this.trans = `scale(${d}) translate(-50%, -50%)`;
    },
    winResize () {
      window.onresize = () => {
        this.getHeight();
      };
    },
    keyUp () {
      window.onkeyup = (e) => {
        e.keyCode === 37 ? this.pathIndex-- : this.pathIndex++;
        let len = this.paths.length;
        if (this.pathIndex >= len) {
          this.pathIndex = 0;
        }
        if (this.pathIndex < 0) {
          this.pathIndex = len - 1;
        }
        this.changeRoute(this.pathIndex);
      };
    },
    changeRoute (index) {
      this.pathIndex = index;
      this.$router.push('/engine/' + this.paths[index]);
    },
    async getDate () {
      let obj = await apiServices.getDate();
      obj.subscribe(v => {
        if (v.data.type === 'success') {
          let d = v.data.data;
          this.formatCurDate(d);
          this.updateCurDate(d);
        }
      });
    },
    updateCurDate (stamp) {
      if (this.dateTimer) {
        clearInterval(this.dateTimer);
        this.dateTimer = null;
      }
      let s = Number(stamp);
      this.dateTimer = setInterval(() => {
        let d = s + 1000;
        this.formatCurDate(d);
        s = d;
      }, 1000);
    },
    formatCurDate (stamp) {
      let formatDate = Zbase.Date.getDateByFormat(stamp).split(' ');
      let time = formatDate[1];
      let date = formatDate[0].replace('-', '年').replace('-', '月');
      this.time = time;
      this.date = date;
    }
  },
  mounted () {
    this.getDate();
    this.changeHight();
    this.keyUp();
  }
};
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
  position: relative;
  background: url() center center no-repeat;
  background-size: cover;
  overflow: hidden;
  .page-box {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
    background-position: center top;
    background-repeat: no-repeat;
    background-size: cover;
    position: absolute;
    top: 50%;
    left: 50%;
    transform-origin: 0 0;
    .nav {
      height: 92px;
      position: relative;
      top: 10px;
      .logo {
        position: absolute;
        top: 25px;
        left: 2%;
        width: 10%;
        img {
          display: block;
          max-width: 100%;
        }
      }
      .time {
        position: absolute;
        top: 20%;
        right: 6%;
        color: #fff;
        text-align: center;
        p {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.6);
          &.font-lgdr {
            font-size: 34px;
            color: #fff;
          }
        }
      }
    }
  }
  .pagination {
    position: absolute;
    bottom: 20px;
    width: 100px;
    height: 20px;
    left: 50%;
    transform: translateX(-50%);
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    text-align: center;
    z-index: 10;
    span {
      position: relative;
      top: -3px;
      background-color: #fff;
      opacity: 0.7;
      width: 10px;
      height: 10px;
      cursor: pointer;
      margin: 0 15px;
      display: inline-block;
      border-radius: 100%;
      &.active {
        background-color: #007aff;
        opacity: 1;
      }
    }
  }
  .child-view {
    position: relative;
    transition: all 0.2s linear;
  }
  .slide-right-leave-active,
  .slide-left-enter-active {
    opacity: 0;
    transform: translateX(500px);
  }
  .slide-right-enter-active,
  .slide-left-leave-active {
    opacity: 0;
    transform: translateX(-500px);
  }
}
</style>
