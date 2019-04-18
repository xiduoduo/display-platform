<template>
  <section class="global-part flex part-one">
    <div class="left animated bounceInLeft" :class="{bounceOutLeft: lever}">
      <ul>
        <li v-for="(item, i) in runData"
            @click="changeMapData(item)"
            :key="i">
          <NumberBlock>
            <div class="run-num">
              <RunNum :runData="item"/>
            </div>
          </NumberBlock>
        </li>
      </ul>
    </div>
    <div class="mid animated zoomIn" :class="{zoomOut: lever}">
      <Map :mapData="mapData" :cityMapData="cityMapData"/>
    </div>
    <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
      <ul>
        <li>
          <NumberBlock :theme="2" class="right-block">
            <h3 class="global-block-title text-right">今日在线车辆</h3>
            <Bar :setData="online" :animation="stopAnimate"/>
          </NumberBlock>
        </li>
        <li>
          <NumberBlock :theme="8" class="right-block">
            <h3 class="global-block-title text-right">月注册车辆数</h3>
            <Bar :setData="monthRegister" :animation="stopAnimate"/>
          </NumberBlock>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import GetIndexServices from '@/services/display/getIndex';
import Bar from '@/components/larger/echarts/bar';
import Map from '@/components/larger/echarts/map';
import { mapGetters } from 'vuex';

export default {
  name: 'part-one',
  components: {
    Bar,
    Map
  },
  data () {
    return {
      runData: [
        {
          title: '总接入车辆',
          name: 'ALLNUM',
          num: 0
        },
        {
          title: '实时在线车辆',
          name: 'ONLINENUM',
          num: 0
        },
        {
          title: '今日注册车辆',
          name: 'dayRegCount',
          num: 0
        }
      ],
      online: {
        left: '10%',
        right: '10%',
        top: '24%',
        yMin: true,
        xData: [],
        xDataTime: true,
        lineData: [
          {
            linearGradient: ['#273b71', '#273b71'],
            color: '#0b61cd',
            data: [],
            name: '实时在线车辆'
          }],
        lLabel: false,
        markPoint: {
          show: true,
          name: '实时在线车辆'
        },
        xBoundaryGap: false,
        markLine: true
      },
      monthRegister: {
        top: '24%',
        right: '6%',
        xData: [],
        yData: [
          {
            name: '月注册车辆数',
            data: []
          }]
      },
      mapData: {},
      cityMapData: {},
      allMapData: {},
      lever: false,
      token: '',
      closeSub: null,
      cachePage: {}
    };
  },
  computed: {
    ...mapGetters([
      'getPaths',
      'currentPageBrand',
      'getMenuList'
    ]),
    stopAnimate () {
      return this.getPaths.indexOf(this.$route.name) === -1 ? Boolean(true) : Boolean(false);
    }
  },
  watch: {
    getMenuList () {
      this.getData();
      this.getAmount();
      this.token = this.currentPageBrand.token;
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.lever = false;
    });
  },
  beforeRouteLeave (to, from, next) { // change animate or not
    if (to.path !== from.path && this.getPaths.indexOf(from.name) === -1) {
      this.$store.commit('UPDATE_RUN_NUM_BOOL', from.name);
    }
    this.lever = true;
    setTimeout(() => {
      next();
    }, 80);
  },
  activated: function () {
    console.log('one');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
    if (this.getMenuList.length) {
      this.getAmount();
    }
  },
  deactivated: function () {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    console.log('跳出缓存one');
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        // this.getAmount();
        this.getOnline();
        this.getMonthRegister();
        this.getDistribute();
      }
    },
    getAmount () {
      let _self = this;
      // let obs = await GetIndexServices.getAmount();
      this.closeSub = GetIndexServices.getAmount().subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.runData[0].num = data.ALLNUM || 0;
          _self.runData[1].num = data.ONLINENUM || 0;
          _self.runData[2].num = data.dayRegTerminalCount || 0;
          // 缓存数据
          _self.cachePage.getAmount = _self.runData;
          // 赋值
          _self.runData = JSON.parse(JSON.stringify(_self.runData));
        } else {
          if (_self.cachePage.getAmount) {
            let data = _self.cachePage.getAmount;
            _self.runData = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    getOnline () {
      let _self = this;
      // let obs = await GetIndexServices.getOnline();
      GetIndexServices.getOnline().subscribe(res => {
        // console.log(res);
        if (res.data.type === 'success') {
          let data = res.data.data;
          let xData = [];
          let lineData = data.map(ele => {
            xData.push(ele.hour + ':00');
            return ele.realCount;
          });
          let minData = Math.min(...lineData);
          let minIndex = lineData.lastIndexOf(minData);
          _self.online.xData = xData.slice(minIndex);
          _self.online.lineData[0].data = lineData.slice(minIndex);
          // 缓存数据
          this.cachePage.getOnline = _self.online;
          // 赋值
          _self.online = JSON.parse(JSON.stringify(_self.online));
        } else {
          if (_self.cachePage.getOnline) {
            let data = _self.cachePage.getOnline;
            // 赋值
            _self.online = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    getMonthRegister () {
      let _self = this;
      // let obs = await GetIndexServices.getMonthRegister();
      GetIndexServices.getMonthRegister().subscribe(res => {
        // console.log(0);
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.monthRegister.xData = Object.keys(data);
          _self.monthRegister.yData[0].data = Object.values(data);
          // 缓存数据
          _self.cachePage.getMonthRegister = _self.monthRegister;
          // 赋值
          _self.monthRegister = JSON.parse(JSON.stringify(_self.monthRegister));
        } else {
          if (_self.cachePage.getMonthRegister) {
            let data = this.cachePage.getMonthRegister;
            // 赋值
            _self.monthRegister = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    getDistribute () {
      let _self = this;
      // let obs = await GetIndexServices.getDistribute();
      GetIndexServices.getDistribute().subscribe(res => {
        if (res.data.type === 'success') {
          _self.allMapData = res.data.data;
          _self.cachePage.getDistribute = res.data.data;
          _self.changeMapData({
            name: 'ALLNUM'
          });
        } else {
          if (_self.cachePage.getDistribute) {
            // 赋值
            _self.allMapData = this.cachePage.getDistribute;
            _self.changeMapData({
              name: 'ALLNUM'
            });
          }
        }
      }, e => console.log(e));
    },
    changeMapData (item) {
      let regProvinceMap = {};
      let regCityMap = {};
      switch (item.name) {
        case 'ALLNUM':
          regProvinceMap = this.allMapData.province.regProvinceMap || {};
          regCityMap = this.allMapData.city.regCityMap || {};
          break;
        case 'ONLINENUM':
          regProvinceMap = this.allMapData.province.onlineProvinceMap || {};
          regCityMap = this.allMapData.city.onlineCityMap || {};
          break;
        default:
          regProvinceMap = this.allMapData.province.regProvinceMap || {};
          regCityMap = this.allMapData.city.regCityMap || {};
          break;
      }
      this.mapData = JSON.parse(JSON.stringify(regProvinceMap));
      this.cityMapData = JSON.parse(JSON.stringify(regCityMap));
    },
    convertProvinceName (cityName) {
      // 改省份名
      return cityName.replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, '');
    }
  }
};
</script>

<style scoped lang="scss">
  .part-one {
    .left {
      li {
        cursor: pointer;
        margin-top: 60px;
        &:nth-last-of-type(1) {
          cursor: default;
        }
      }
    }

    .mid {
      flex: 1;
      padding: 30px 50px 0;
      height: 960px;
    }

    .right {
      li {
        margin-top: 60px;
      }

      .right-block {
        width: 470px;
        height: 300px;
      }
    }
  }
</style>
