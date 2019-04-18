<template>
  <section class="global-part operative">
    <div class="top flex">
      <div class="left">
        <OperativePointsOnBaiduMap
          :dataRef="mapData"
          :class="{'animated fadeIn': sectionClass === 'enter', 'animated fadeIn fadeOut': sectionClass === 'leave'}"
        ></OperativePointsOnBaiduMap>
        <OperativeSummary
          class="summary-data"
          :class="{'animated bounceInLeft': sectionClass === 'enter', 'animated bounceOutLeft': sectionClass === 'leave'}"
          :dataRef="summaryData"
        ></OperativeSummary>
      </div>
      <div class="right"
           :class="{'animated bounceInRight': sectionClass === 'enter', 'animated bounceOutRight': sectionClass === 'leave'}"
      >
        <OperativeDrivingBehaviorChart
          class="right-item"
          :animation="stopAnimate"
          v-if="currentPageBrand.name !== BRAND_MAP.OUHUI"
          :dataRef="drivingBehaviorData"></OperativeDrivingBehaviorChart>
        <OperativeSpeedRangeChart
          class="right-item"
          :animation="stopAnimate"
          :speedData="speedRangeData"></OperativeSpeedRangeChart>
      </div>
    </div>
    <div
      class="bottom flex"
      :class="{'animated bounceInUp': sectionClass === 'enter', 'animated bounceOutDown': sectionClass === 'leave'}"
    >
      <OperativeMileageChart
        class="b-item"
        :animation="stopAnimate"
        :speedData="mileageData"
      ></OperativeMileageChart>
      <OperativeSpeedChart
        class="b-item"
        :animation="stopAnimate"
        :speedData="speedData"
      ></OperativeSpeedChart>
      <OperativeFuelChart
        class="b-item"
        :animation="stopAnimate"
        :speedData="fuelData"
      ></OperativeFuelChart>
    </div>
  </section>
</template>

<script>
import { BRAND_MAP } from '@/services/common';
import OperativePointsOnBaiduMap from '@/components/business/operative-points-on-baidu-map';
import OperativeSummary from '@/components/business/operative-summary';
import OperativeDrivingBehaviorChart from '@/components/business/operative-driving-behavior-chart';
import OperativeSpeedRangeChart from '@/components/business/operative-speed-range-chart';
import OperativeMileageChart from '@/components/business/operative-mileage-chart';
import OperativeSpeedChart from '@/components/business/operative-speed-chart';
import OperativeFuelChart from '@/components/business/operative-fuel-chart';
import OperativeService from '@/services/display/operative';
import { mapGetters } from 'vuex';

export default {
  name: 'operative',
  components: {
    OperativePointsOnBaiduMap,
    OperativeSummary,
    OperativeDrivingBehaviorChart,
    OperativeSpeedRangeChart,
    OperativeMileageChart,
    OperativeSpeedChart,
    OperativeFuelChart
  },
  data () {
    return {
      BRAND_MAP,
      sectionClass: '',
      summaryData: 0,
      mapData: {
        high: [],
        middle: [],
        low: []
      },
      drivingBehaviorData: {},
      speedRangeData: {
        yName: '时长（万小时）',
        left: '12%',
        right: '8%',
        top: '28%',
        bottom: '15%',
        interval: false,
        barColor: ['rgba(87,238,195,.8)', 'rgba(91,201,254,0.4)'],
        legend: {
          show: true,
          bottom: '4%',
          width: 8,
          icon: 'rect'
        },
        tooltip: false,
        xData: [],
        yData: [{
          name: '车辆各个行驶速度区间的运行时长',
          showLabel: true,
          data: []
        }]
      },
      mileageData: {
        yName: '里程（KM）',
        left: '7%',
        right: '6%',
        top: '26%',
        bottom: '15%',
        interval: false,
        barColor: ['rgb(92,150,255)', 'rgba(92,150,255,0)'],
        legend: {
          show: true,
          bottom: '4%',
          width: 8,
          icon: 'rect'
        },
        tooltip: false,
        xData: [],
        yData: [{
          name: '车辆日平均行驶里程',
          showLabel: true,
          data: []
        }]
      },
      speedData: {
        lineYName: '速度（KM/H）',
        left: '10%',
        right: '10%',
        top: '26%',
        bottom: '15%',
        legend: {
          show: true,
          bottom: '4%'
        },
        xData: [],
        lineData: [
          {
            linearGradient: ['rgba(254, 151, 10, .6)', 'rgba(254, 151, 10, .12)'],
            color: '#e7c31c',
            showLabel: true,
            data: [],
            name: '车辆日平均行驶速度'
          }],
        xBoundaryGap: false
      },
      fuelData: {
        lineYName: '油耗（L/100KM）',
        left: '10%',
        right: '10%',
        top: '26%',
        bottom: '15%',
        legend: {
          show: true,
          bottom: '4%'
        },
        xData: [],
        lineData: [
          {
            linearGradient: ['rgb(92,150,255)', 'rgba(92,150,255,0)'],
            color: 'rgb(92,150,255)',
            showLabel: true,
            data: [],
            name: '车辆日平均行驶油耗'
          }],
        xBoundaryGap: false
      },
      cachePage: {} // 缓存数据
    };
  },
  computed: {
    ...mapGetters([
      'getPaths',
      'getMenuList',
      'currentPageBrand'
    ]),
    stopAnimate () {
      return this.getPaths.indexOf(this.$route.name) === -1 ? Boolean(true) : Boolean(false);
    }
  },
  watch: {
    getMenuList () {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
  },
  mounted () {
    // this.bindData();
  },
  beforeRouteLeave (to, from, next) {
    this.sectionClass = 'leave';
    // change animate or not
    if (to.path !== from.path && this.getPaths.indexOf(this.$route.name) === -1) {
      this.$store.commit('UPDATE_RUN_NUM_BOOL', from.name);
    }
    setTimeout(() => {
      next();
    }, 80);
  },
  activated () {
    this.sectionClass = 'enter';
    console.log('operative');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
  },
  deactivated () {
    console.log('跳出operative');
  },
  methods: {
    getData () {
      if (!this.getMenuList) return;
      this.bindDrivingBehaviorData();
      this.bindSpeedRangeData();
      this.bindBottomData();
      this.bindMapData();
    },
    async bindMapData () { // 地图数据
      let _self = this;
      OperativeService.getOperativeList().subscribe(result => {
        if (result.data.type === 'success') {
          _self.cachePage.getOperativeList = result.data;
          // 今日运行车辆数
          _self.summaryData = (result.data && result.data.data && result.data.data.total) || 0;
          _self.mapData = result.data.data;
        } else {
          if (_self.cachePage.getOperativeList) {
            let data = _self.cachePage.getOperativeList;
            _self.summaryData = (data && data.data && data.data.total) || 0;
            _self.mapData = data.data;
          }
        }
      });
    },
    async bindDrivingBehaviorData () { // 驾驶行为分析（近一周）
      let _self = this;
      OperativeService.getOperativeDrivingList().subscribe(result => {
        if (result.data.type === 'success') {
          _self.cachePage.getOperativeDrivingList = _self.drivingBehaviorData = result.data.data;
        } else {
          if (_self.cachePage.getOperativeDrivingList) {
            let data = _self.cachePage.getOperativeDrivingList;
            _self.drivingBehaviorData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    async bindSpeedRangeData () { // 运行速度区间（近一周）
      let _self = this;
      OperativeService.getOperativeSpeedRangeList().subscribe(result => {
        if (result.data.type === 'success') {
          let speedRangeData = result.data.data;
          let xData = [];
          let yData = [];
          speedRangeData.forEach(ci => {
            xData.push(ci.section);
            yData.push(Math.round(ci.num / 10000));
          });
          _self.speedRangeData.xData = xData;
          _self.speedRangeData.yData[0].data = yData;
          _self.cachePage.getOperativeSpeedRangeList = _self.speedRangeData;
          _self.speedRangeData = JSON.parse(JSON.stringify(_self.speedRangeData));
        } else {
          if (_self.cachePage.getOperativeSpeedRangeList) {
            let data = _self.cachePage.getOperativeSpeedRangeList;
            _self.speedRangeData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    async bindBottomData () { // 里程、速度、油耗分析（近一周）
      let _self = this;
      OperativeService.getOperativeRecordList().subscribe(result => {
        if (result.data.type === 'success') {
          let dates = [];
          let mileages = [];
          let speeds = [];
          let fuels = [];

          result.data = result.data.data.slice(-7);
          result.data.forEach(ci => {
            dates.push(ci.data_day);
            mileages.push(Math.round(ci.avg_mileage / 1000));
            speeds.push(Math.round(ci.avg_velocity_filter || ci.avg_velocity));
            fuels.push(Math.round(ci.avg_per_fuel_consumption || ci.avg_per_fuel_consumption_filter));
          });

          // this.mileageData = {
          //   xAxisData: dates,
          //   data: mileages
          // };
          // 里程
          _self.mileageData.xData = dates;
          _self.mileageData.yData[0].data = mileages;
          _self.cachePage.mileageData = _self.mileageData;
          _self.mileageData = JSON.parse(JSON.stringify(_self.mileageData));

          // this.speedData = {
          //   xAxisData: dates,
          //   data: speeds
          // };
          // 速度
          _self.speedData.xData = dates;
          _self.speedData.lineData[0].data = speeds;
          _self.cachePage.speedData = _self.speedData;
          _self.speedData = JSON.parse(JSON.stringify(_self.speedData));
          // this.fuelData = {
          //   xAxisData: dates,
          //   data: fuels
          // };
          // 油耗
          _self.fuelData.xData = dates;
          _self.fuelData.lineData[0].data = fuels;
          _self.cachePage.fuelData = this.fuelData;
          _self.fuelData = JSON.parse(JSON.stringify(_self.fuelData));
        } else {
          if (_self.cachePage.mileageData) {
            let data1 = _self.cachePage.mileageData;
            let data2 = _self.cachePage.speedData;
            let data3 = _self.cachePage.fuelData;
            _self.mileageData = JSON.parse(JSON.stringify(data1));
            _self.speedData = JSON.parse(JSON.stringify(data2));
            _self.fuelData = JSON.parse(JSON.stringify(data3));
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .operative {
    padding-top: 30px;
  }

  .top {
    .left {
      flex: 1;
      height: 596px;
      padding-right: 30px;
      position: relative;

      .summary-data {
        position: absolute;
        z-index: 999;
        top: 37px;
        left: 29px;
      }
    }

    .right {
      width: 400px;
      .right-item {
        margin-bottom: 30px;
        height: 285px;
        &:nth-of-type(2) {
          margin: 0;
        }
      }
    }
  }

  .bottom {
    margin-top: 30px;
    .b-item {
      margin-right: 30px;
      height: 270px;
      &:nth-last-child(1) {
        margin: 0;
      }
    }
  }
</style>
