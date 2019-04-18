<template>
  <section class="global-part flex part-two">
    <div class="left animated bounceInLeft" :class="{bounceOutLeft: lever}">
      <ul class="left-num">
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
      <Map :mapData="mapData" :type="Boolean(true)" :animation="stopAnimate" :themeOption="themeOption"/>
    </div>
    <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
      <ul>
        <li class="right-block-btm">
          <NumberBlock :theme="5" class="right-block">
            <h3 class="global-block-title text-left">本月故障报警</h3>
            <Bar :setData="online" :animation="stopAnimate"/>
          </NumberBlock>
        </li>
        <li>
          <NumberBlock :theme="3" class="right-block">
            <h3 class="global-block-title text-left pad-l">今日报警分析</h3>
            <Pie :setData="pieData" :animation="stopAnimate"/>
          </NumberBlock>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
import GetIndexServices from '@/services/energy/getIndex';
import { BRAND_MAP, ALARM_CODE_MAP, FAULT_WARN_CODES } from '@/services/common';
import Map from '@/components/larger/echarts/map';
import Pie from '@/components/larger/echarts/pie';
import Bar from '@/components/larger/echarts/bar';
import Radar from '@/components/larger/echarts/radar';
import { mapGetters } from 'vuex';

export default {
  name: 'part-two',
  components: {
    Map,
    Pie,
    Bar,
    Radar
  },
  data () {
    return {
      BRAND_MAP,
      runData: [
        {
          title: '总采集数据量(GB)',
          num: 0
        },
        {
          title: '本月采集数据条数',
          num: 0
        },
        {
          title: '今日采集数据条数',
          num: 0
        }
      ],
      online: {
        left: '5%',
        right: '6%',
        top: '18%',
        bottom: '5%',
        xRotate: 30,
        lineColor: this.GREEN.echarts.partOneBar.lineColor,
        splitColor: this.GREEN.echarts.partOneBar.splitColor,
        xData: [],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: ''
          }],
        markPoint: {
          avg: true,
          show: true,
          name: '故障'
        },
        tooltip: false,
        xBoundaryGap: false
      },
      pieData: {
        legendTextFormatter: 'normal',
        tooltip: true,
        legendIcon: 'roundRect',
        data: [],
        colors: ['#8b103e', '#64d0da', '#34b2e4', '#065381', '#e34856', '#fe912a', '#fec959', '#95bc11']
      },
      mapData: {},
      themeOption: {
        geoItemStyleAreaColor: this.GREEN.echarts.map.geoItemStyleAreaColor,
        geoItemStyleBorderColor: this.GREEN.echarts.map.geoItemStyleBorderColor,
        geoItemStyleEmphasisAreaColor: this.GREEN.echarts.map.geoItemStyleEmphasisAreaColor
      },
      lever: false,
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
      this.getDataAmount();
      this.token = this.currentPageBrand.token;
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.lever = false;
    });
  },
  beforeRouteLeave (to, from, next) {
    // change animate or not
    if (to.path !== from.path && this.getPaths.indexOf(from.name) === -1) {
      this.$store.commit('UPDATE_RUN_NUM_BOOL', from.name);
    }
    this.lever = true;
    setTimeout(() => {
      next();
    }, 80);
  },
  mounted: function () {
    // this.getData();
  },
  activated: function () {
    console.log('two');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
    if (this.getMenuList.length) {
      this.getDataAmount();
    }
  },
  deactivated: function () {
    console.log('跳出two');
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        // this.getDataAmount();
        this.getMonthFaultWarn();
        this.getDayAlarm();
        this.getDistribute();
      }
    },
    async getDataAmount () { // 采集
      let _self = this;
      let obs = await GetIndexServices.getEnergyDataAmount();
      this.closeSub = obs.subscribe(res => {
        if (!res.data.error) {
          _self.runData[0].num = parseInt(res.data.collectionSumNum);
          _self.runData[1].num = res.data.collectionMonthNum;
          _self.runData[2].num = res.data.collectionTodayNum;
          // 缓存
          _self.cachePage.getDataAmount = _self.runData;
          // 赋值
          _self.runData = JSON.parse(JSON.stringify(_self.runData));
        } else {
          if (_self.cachePage.getDataAmount) {
            let data = _self.cachePage.getDataAmount;
            _self.runData = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    async getMonthFaultWarn () { // 本月故障报警
      let _self = this;
      let obs = await GetIndexServices.getEnergyMonthFaultWarn();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let xData = [];
          let useData = [];
          let noUseData = [];
          // 按产品需求过滤8个
          data.forEach(ele => {
            // xData.push(ele.name);
            // return ele.count;
            if (FAULT_WARN_CODES[ele.name]) {
              useData.push(ele);
            } else {
              noUseData.push(ele);
            }
          });
          // 不足8个时，补足8个
          if (useData.length < 8) {
            useData = useData.concat(noUseData.sort((a, b) => b.count - a.count).slice(0, 8 - useData.length));
          }
          // 按名称排序
          let lineData = useData.sort((a, b) => a.name.length - b.name.length).map(ele => {
            xData.push(ele.name);
            return ele.count;
          });
          _self.online.xData = xData;
          _self.online.lineData[0].data = lineData;
          // 缓存
          _self.cachePage.getMonthFaultWarn = _self.online;
          // 赋值
          _self.online = JSON.parse(JSON.stringify(_self.online));
        } else {
          if (_self.cachePage.getMonthFaultWarn) {
            let data = _self.cachePage.getMonthFaultWarn;
            _self.online = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    async getDayAlarm () { // 今日报警分析
      let _self = this;
      let obs = await GetIndexServices.getEnergyDayAlarm();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let newData = [];
          // 按产品需求筛选数据
          data.forEach(ele => {
            // 注意：返回的数据默认带有空格，要先去除空格
            let alarmName = ele.alarmName.replace(/\s/g, '');
            if (ALARM_CODE_MAP[alarmName]) {
              newData.push({
                name: ALARM_CODE_MAP[alarmName],
                value: ele.alarmCount
              });
            }
          });
          // 截取8个,按名称排序
          _self.pieData.data = newData.slice(0, 8).sort((a, b) => (b.name.length - a.name.length));
          // 缓存
          _self.cachePage.getDayAlarm = _self.pieData;
          // 赋值
          _self.pieData = JSON.parse(JSON.stringify(_self.pieData));
        } else {
          if (_self.cachePage.getDayAlarm) {
            let data = _self.cachePage.getDayAlarm;
            _self.pieData = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    async getDistribute () {
      let _self = this;
      let obs = await GetIndexServices.getEnergyDistribute();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let onlineMap = data.province.onlineProvinceMap;
          // 缓存
          _self.cachePage.getDistribute = onlineMap;
          // 赋值
          _self.mapData = JSON.parse(JSON.stringify(onlineMap));
        } else {
          if (_self.cachePage.getDistribute) {
            let data = _self.cachePage.getDistribute;
            _self.mapData = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    }
  }
};
</script>

<style scoped lang="scss">
  .part-two {
    .left {
      padding-top: 90px;
      width: 377px;
      .left-num {
        li {
          margin-bottom: 60px;
          .run-num {
            padding: 50px 30px 30px;
          }
        }
      }
    }

    .left-top {
      width: 100%;
      height: 340px;
      margin-bottom: 35px;
    }
    .left-btm {
      width: 100%;
      height: 400px;
    }

    .mid {
      flex: 1;
      padding: 0 30px;
      height: 960px;
    }

    .right {
      padding-top: 90px;
      li {
        width: 377px;
        height: 330px;
      }
      .right-block-btm {
        margin-bottom: 75px;
      }
      .pad-l {
        padding-left: 50px;
      }
    }
  }
</style>
