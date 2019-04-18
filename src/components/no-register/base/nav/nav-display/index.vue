<template>
  <header class="header flex align-center">
    <div class="header-con flex align-center justify-speac-between">
      <h1 class="nav-logo"><img src="./img/logo.png" alt=""></h1>
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
    <span class="header-line"></span>
    <div class="menu-list animated"
         :class="{flipInY: showed}"
         @mouseover="showInfo"
         @mouseout="hideInfo"
         v-show="showed">
      <span v-if="menuList.length > 0" v-for="(item, i) in menuList" @click="changeCar(item)" :key="i">{{item.name}}</span>
    </div>
  </header>
</template>

<script>
import GetNavServices from '@/services/display/getNav';
import { BRAND_MAP } from '@/services/common';
import Zbase from '@/lib/zbase';
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
            path: '/index.html',
            name: '首页'
          },
          {
            path: '/trial/index.html',
            name: '试制'
          },
          {
            path: '/product/index.html',
            name: '生产'
          },
          {
            path: '/logistics/index.html',
            name: '物流'
          },
          {
            path: '/operative/index.html',
            name: '运行'
          },
          {
            path: '/service/index.html',
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
      let _self = this;
      let obs = await GetNavServices.getNav();
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
      this.$router.push({path: `${this.navList[index].path}`, query: this.$route.query});
    },
    changeCar (item) {
      this.hideInfo();
      this.renderBrandInfo(item);
      this.reload();
    },
    showInfo () {
      if (this.timers) {
        clearTimeout(this.timers);
      }
      this.showed = true;
    },
    hideInfo () {
      let _self = this;
      _self.timers = setTimeout(() => {
        _self.showed = false;
      }, 150);
    },
    async getDate () {
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
  .header {
    position: relative;
    width: 100%;
    height: 92px;
    padding: 0 32px;
    .header-con {
      width: 100%;
    }
    .nav-logo {
      width: 520px;
      & > img {
        display: block;
        width: 100%;
      }
    }
    .nav-list {
      li {
        text-align: center;
        margin: 0 10px;
        cursor: pointer;
        & > span {
          display: block;
          border: 1px solid transparent;
          padding: 5px 26px;
          color: #fff;
          font-size: 20px;
          &:hover {
            transition: all .2s;
            @extend .is-active;
          }
        }
        .is-active {
          position: relative;
          box-shadow: 0 0 5px 0 rgba(92, 114, 171, 0.3), 0 0 4px 0 rgba(57, 101, 174, 0.3);
          border-color: rgba(146, 200, 243, 0.5);
          &::before {
            content: '';
            position: absolute;
            left: -1px;
            top: -1px;
            width: 10px;
            height: 10px;
            border-left: 2px solid #4F93B6;
            border-top: 2px solid #4F93B6;
          }
          &::after {
            content: '';
            position: absolute;
            right: -1px;
            bottom: -1px;
            width: 10px;
            height: 10px;
            border-right: 2px solid #4F93B6;
            border-bottom: 2px solid #4F93B6;
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
    .header-line {
      position: absolute;
      left: 22px;
      right: 22px;
      bottom: 0;
      height: 1px;
      background: -ms-linear-gradient(left, #083261 0%, #395898 50%, #083261 100%);
      background: -webkit-linear-gradient(left, #083261 0%, #395898 50%, #083261 100%);
      background: linear-gradient(left, #083261 0%, #395898 50%, #083261 100%);
    }
    .menu-list {
      position: absolute;
      right: 32px;
      top: 92px;
      z-index: 999;
      background: #101c46;
      & > span {
        display: block;
        text-align: center;
        cursor: pointer;
        color: #fff;
        padding: 12px 50px;
        font-size: 18px;
        &:hover {
          background-color: #172E79;
        }
      }
    }
  }
</style>
