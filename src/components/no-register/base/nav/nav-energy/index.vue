<template>
  <header class="header flex align-center">
    <div class="header-con flex align-center justify-speac-between">
      <h1 class="nav-logo"><img src="./img/logo-text.png" alt=""></h1>
      <nav class="nav-list">
        <ul class="flex align-center">
          <li v-for="(item, i) in navList" :key="i">
            <span :class="{'is-active': getActive === i}" @click="toPath(i)">{{item.name}}</span>
          </li>
        </ul>
      </nav>
      <div class="nav-time-menu flex justify-between align-center">
        <div class="nav-time flex flex-column text-center">
          <span class="font-lgdr">{{time}}</span>
          <span>{{date}}</span>
        </div>
        <div class="nav-menu-all flex justify-align-center"
             @mouseover="showInfo"
             @mouseout="hideInfo"
        >
          <div class="nav-menu flex justify-align-center">
            <span></span>
          </div>
          <span class="nav-menu-title" v-if="menuTitle.name">{{menuTitle.name}}</span>
        </div>
      </div>
    </div>
    <div class="menu-list animated"
         :class="{flipInY: showed}"
         @mouseover="showInfo"
         @mouseout="hideInfo"
         v-show="showed">
      <span v-if="menuList.length > 0" v-for="(item, i) in menuList" @click="changeCar(item)"
            :key="i">{{item.name}}</span>
    </div>
  </header>
</template>

<script>
import GetNavServices from '@/services/energy/getNav';
import { BRAND_MAP } from '@/services/common';
import Zbase from '@/lib/zbase';
// 成产环境去掉路径
let devPath = process.env.NODE_ENV === 'development' ? '/energy' : '';
export default {
  name: 'index',
  inject: ['reload'],
  data () {
    return {
      showed: false,
      timers: null,
      menuTitle: {},
      menuList: [],
      navList:
        [
          {
            path: devPath + '/index.html',
            name: '首页'
          },
          {
            path: devPath + '/product/index.html',
            name: '生产'
          },
          {
            path: devPath + '/logistics/index.html',
            name: '物流'
          },
          {
            path: devPath + '/operative/index.html',
            name: '运行'
          },
          {
            path: devPath + '/service/index.html',
            name: '服务'
          }
        ],
      dateTimer: null,
      time: '',
      date: ''
    };
  },
  computed: {
    getActive () {
      let active = 0;
      this.navList.forEach((ele, i) => {
        if (this.$route.path.indexOf(ele.path) !== -1) {
          active = i;
        }
      });
      return active;
    }
  },
  methods: {
    renderBrandInfo (item) {
      // let key = Object.keys(BRAND_MAP).find(name => BRAND_MAP[name] === this.menuList[this.menuTitle].name);
      // let name = key === undefined ? BRAND_MAP[key] : BRAND_MAP.ALL;
      this.menuTitle = item;
      this.$store.commit('UPDATE_GLOBAL_BRAND', item);
    },
    async getMenuList () {
      // 获取车型导航数据
      let _self = this;
      let obs = await GetNavServices.getEnergyNav();
      obs.subscribe(res => {
        if (res.data.result === '0') {
          let data = res.data.data;
          _self.menuList = data;
          data.forEach(ele => {
            if (ele.name === BRAND_MAP.ALL) {
              _self.menuTitle = ele;
            }
          });
          _self.$store.commit('UPDATE_NAV_MENU_LIST', data);
          _self.$store.commit('UPDATE_GLOBAL_BRAND', _self.menuTitle);
          // _self.renderBrandInfo(_self.menuTitle);
        }
      }, e => console.log(e));
    },
    toPath (index) {
      // 导航点击跳转
      this.$router.push({path: `${this.navList[index].path}`, query: this.$route.query});
    },
    changeCar (item) {
      // 隐藏车型导航列表
      this.hideInfo();
      // 修改-展示当前车型导航
      this.renderBrandInfo(item);
      // ***很重要！！！ 清理所有缓存页面，重新加载页面
      this.reload();
    },
    showInfo () {
      // 显示车型导航列表事件
      if (this.timers) {
        clearTimeout(this.timers);
      }
      this.showed = true;
    },
    hideInfo () {
      // 隐藏车型导航列表事件
      let _self = this;
      _self.timers = setTimeout(() => {
        _self.showed = false;
      }, 150);
    },
    async getDate () {
      // 对比本地时间与服务器时间
      let obj = await GetNavServices.getDate();
      obj.subscribe(v => {
        if (v.data.type === 'success') {
          let d = parseInt(v.data.data);
          this.updateCurDate(d);
        }
      });
    },
    updateCurDate (stamp) {
      this.formatCurDate(stamp);
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
      let date = formatDate[0].replace('-', '年').replace('-', '月') + '日';
      this.time = time;
      this.date = date;
    }
  },
  created: function () {
    this.getMenuList();
    this.getDate();
  }
};
</script>

<style scoped lang="scss">
  $bg: './img/g-nav-line.png';
  .header {
    position: relative;
    width: 100%;
    height: 92px;
    padding: 0 32px;
    background: url($bg) center bottom no-repeat;

    .header-con {
      width: 100%;
    }

    .nav-logo {
      width: 480px;

      & > img {
        display: block;
        width: 100%;
      }
    }

    .nav-list {
      padding-right: 225px;

      ul {
        width: 595px;
        justify-content: space-between;
      }

      li {
        text-align: center;
        margin: 0 10px;
        cursor: pointer;

        & > span {
          display: block;
          padding: 0 15px;
          height: 90px;
          line-height: 90px;
          color: rgba(255, 255, 255, .7);
          font-size: 20px;

          &:hover {
            transition: all .2s;
            @extend .is-active;
          }
        }

        .is-active {
          position: relative;
          color: rgba(255, 255, 255, 1);

          &::before {
            content: '';
            position: absolute;
            width: 100%;
            height: 4px;
            left: 0;
            bottom: 8px;
            background-image: linear-gradient(0deg, #00de98 0, #91ff00 100%);
          }
        }
      }
    }

    .nav-time-menu {
      .nav-time {
        width: 130px;
        color: #fff;
        position: relative;
        padding-right: 28px;

        &::after {
          content: '';
          position: absolute;
          right: 0;
          height: 100%;
          border-right: 1px rgba(255, 255, 255, .4) solid;
        }

        & > span:nth-of-type(1) {
          transition: all 1s;
          letter-spacing: 3px;
          padding-bottom: 5px;
          font-size: 22px;
          color: rgba(255, 255, 255, .9);
        }

        & > span:nth-of-type(2) {
          font-size: 12px;
          color: rgba(255, 255, 255, .6);
        }
      }

      .nav-menu-all {
        margin-left: 28px;
        cursor: pointer;
        transition: all .2s;

        &:hover {
          .nav-menu {
            border-color: rgba(255, 255, 255, .6);

            & > span {
              background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
              background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
              background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);

              &::before, &::after {
                background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
                background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
                background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
              }
            }
          }

          .nav-menu-title {
            color: #fff;
          }
        }
      }

      .nav-menu {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        cursor: pointer;
        border: 1px solid rgba(255, 255, 255, .4);

        &:hover {
          border-color: rgba(255, 255, 255, .6);

          & > span {
            background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
            background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
            background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);

            &::before, &::after {
              background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
              background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
              background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .9) 50%);
            }
          }
        }

        & > span {
          position: relative;
          display: block;
          width: 46%;
          height: 2px;
          background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);
          background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);
          background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);

          &::before, &::after {
            position: absolute;
            top: -5px;
            content: '';
            width: 100%;
            height: 2px;
            background: linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);
            background: -ms-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);
            background: -webkit-linear-gradient(left, rgba(255, 255, 255, .7) 10%, transparent 10%, rgba(255, 255, 255, .7) 50%);
          }

          &::after {
            top: 5px;
          }
        }
      }

      .nav-menu-title {
        padding-left: 10px;
        width: 64px;
        font-size: 18px;
        color: rgba(255, 255, 255, .7);
      }
    }

    .menu-list {
      position: absolute;
      right: 32px;
      top: 92px;
      z-index: 999;
      background: #344150;

      & > span {
        display: block;
        text-align: center;
        cursor: pointer;
        color: #fff;
        padding: 12px 50px;
        font-size: 18px;

        &:hover {
          background-color: #111;
        }
      }
    }
  }
</style>
