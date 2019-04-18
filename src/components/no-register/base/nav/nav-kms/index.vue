<template>
  <div class="nav-kms">
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
</template>

<script>
import Logo from '@/assets/img/kms/logo.png';
import getKmsPage1Service from '@/services/kms/getKmsPage1';
import Zbase from '@/lib/zbase';

export default {
  name: 'index',
  data () {
    return {
      logo: Logo,
      date: '',
      time: ''
    };
  },
  created () {
    this.$store.commit('UPDATE_GLOBAL_BRAND', {
      name: '康明斯',
      token: '44839dc2bb5640e685f5ee651b7a27c9'
    });
    // this.pathIndex = this.$route.path.split('page')[1] - 1;
  },
  mounted () {
    this.getDate();
  },
  methods: {
    async getDate () {
      let obj = await getKmsPage1Service.getDate();
      obj.subscribe(v => {
        if (v.data.type === 'success') {
          let d = parseInt(v.data.data);
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
      let date = formatDate[0].replace('-', '年').replace('-', '月') + '日';
      this.time = time;
      this.date = date;
    }
  }
};
</script>

<style scoped lang="scss">
  $bg: './img/title.png';
  .nav-kms {
    background-image: url($bg);
    background-size: 100% auto;
    background-repeat: no-repeat;
    height: 112px;
    position: relative;

    .logo {
      position: absolute;
      top: 30px;
      left: 2%;
      width: 10%;

      img {
        display: block;
        max-width: 100%;
      }
    }

    .time {
      position: absolute;
      top: 15px;
      right: 6%;
      color: #fff;
      text-align: center;

      p {
        font-size: 14px;
        line-height: 1.5;
        color: rgba(255, 255, 255, 0.6);

        &.font-lgdr {
          width: 105px;
          font-size: 34px;
          color: #fff;
        }
      }
    }
  }
</style>
