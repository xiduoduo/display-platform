<template>
  <section class="global-part logistics flex">
    <div class="left">
      <div class="map-wrapper">
        <LogisticRoutesOnBaiduMap
          ref="logisticRoutesOnBaiduMapComponent"
          class="l-map"
          :class="{'animated fadeIn': sectionClass === 'enter', 'animated fadeIn fadeOut': sectionClass === 'leave'}"
          :dataRef="mapData"
        ></LogisticRoutesOnBaiduMap>
        <LogisticSummary
          :class="{'animated bounceInLeft': sectionClass === 'enter', 'animated bounceOutLeft': sectionClass === 'leave'}"
          class="l-summary"
          :dataRef="summaryData"
        ></LogisticSummary>
      </div>
      <div class="bottom flex"
           :class="{'animated bounceInUp': sectionClass === 'enter', 'animated bounceOutDown': sectionClass === 'leave'}">
        <LogisticList
          class="l-list"
          ref="runningLogisticListComponent"
          block-title="已发车运单"
          block-font="logistics-5"
          :swiperLine="runningListData"
          :isActived="isRunning"
        ></LogisticList>
        <LogisticList
          class="r-list"
          ref="arrivedLogisticListComponent"
          block-title="到达运单"
          block-font="logistics-4"
          :swiperLine="arrivedListData"
          :isActived="isArrived"
        ></LogisticList>
      </div>
    </div>
    <div class="right"
         :class="{'animated bounceInRight': sectionClass === 'enter', 'animated bounceOutRight': sectionClass === 'leave'}">
      <LogisticWarnSummary class="right-item" :dataRef="warnData"></LogisticWarnSummary>
      <LogisticGrade class="right-item" :dataRef="grade" :animation="stopAnimate"></LogisticGrade>
      <LogisticTrend class="right-item" :dataRef="trendData" :animation="stopAnimate"></LogisticTrend>
    </div>
  </section>
</template>

<script>
import LogisticGrade from '@/components/business/logistic-grade';
import LogisticList from '@/components/business/logistic-list';
import LogisticRoutesOnBaiduMap from '@/components/business/logistic-routes-on-baidu-map';
import LogisticSummary from '@/components/business/logistic-summary';
import LogisticTrend from '@/components/business/logistic-trend';
import LogisticWarnSummary from '@/components/business/logistic-warn-summary';
import LogisticsService from '@/services/display/logistics';
import { mapGetters } from 'vuex';
import ZBase from '@/lib/zbase';
import {FACTORY_MAP, BRAND_MAP} from '@/services/common';

export default {
  name: 'logistics',
  components: {
    LogisticGrade,
    LogisticList,
    LogisticRoutesOnBaiduMap,
    LogisticSummary,
    LogisticTrend,
    LogisticWarnSummary
  },
  data () {
    return {
      isRunning: false,
      isArrived: false,
      sectionClass: '',
      summaryData: {
        standbyCount: 0,
        runningCount: 0,
        arrivedCount: 0
      },
      mapData: [],
      warnData: {
        startDelayCount: 0,
        arrivedDelayCount: 0,
        noHalfWayCount: 0,
        exceptionalWayCount: 0
      },
      runningListData: [],
      runningListDataMap: {},
      arrivedListData: [],
      arrivedListDataMap: {},
      grade: {},
      trendData: {},
      startTimer: null,
      endTimer: null,
      cachePage: {} // 缓存数据
    };
  },
  computed: {
    ...mapGetters([
      'getPaths',
      'currentPageBrand',
      'getMenuList',
      'getWebsocket_vl_start',
      'getWebsocket_vl_end'
    ]),
    stopAnimate () {
      return this.getPaths.indexOf(this.$route.name) === -1 ? Boolean(true) : Boolean(false);
    }
  },
  watch: {
    getMenuList () { // 获取数据，保存token
      this.getData();
      this.token = this.currentPageBrand.token;
    },
    getWebsocket_vl_start () { // 计算已发车运单websocket
      let getWebsocketVlStart = JSON.parse(this.getWebsocket_vl_start);
      if (getWebsocketVlStart && getWebsocketVlStart.data && getWebsocketVlStart.data.length) {
        let _self = this;
        _self.isRunning = false;
        // 根据车型接受数据
        let startDatas = getWebsocketVlStart.data.map(_self.renderRunningItem).filter(ele => {
          return this.currentPageBrand.name === BRAND_MAP.ALL ? Boolean(true) : ele.carBrandName === this.currentPageBrand.name;
        });
        if (!startDatas.length) return;
        // 如果来新数据了， 那么需要清除定时器，加载新数据
        if (_self.startTimer) {
          clearInterval(this.startTimer);
          _self.startTimer = null;
        }
        let num = 0;
        _self.isRunning = true;
        _self.runningListData.unshift(startDatas[num]);
        _self.runningListData.pop();
        _self.$refs.logisticRoutesOnBaiduMapComponent.drawOverlay(startDatas[num], false);
        _self.startTimer = setInterval(() => {
          num++;
          if (num >= startDatas.length) {
            clearInterval(_self.startTimer);
            _self.startTimer = null;
          } else {
            _self.isRunning = false;
            _self.$nextTick(() => {
              _self.isRunning = true;
              _self.runningListData.unshift(startDatas[num]);
              _self.runningListData.pop();
              _self.$refs.logisticRoutesOnBaiduMapComponent.drawOverlay(startDatas[num], false);
            });
          }
        }, 8000);
      }
    },
    getWebsocket_vl_end () { // 计算已到达运单websocket
      let getWebsocketVlEnd = JSON.parse(this.getWebsocket_vl_end) || [];
      if (getWebsocketVlEnd && getWebsocketVlEnd.data && getWebsocketVlEnd.data.length) {
        let _self = this;
        _self.isArrived = false;
        // 根据车型接受数据
        let startDatas = getWebsocketVlEnd.data.map(_self.renderArrivedItem).filter(ele => {
          return this.currentPageBrand.name === BRAND_MAP.ALL ? Boolean(true) : ele.carBrandName === this.currentPageBrand.name;
        });
        if (!startDatas.length) return;
        // 如果来新数据了， 那么需要清除定时器，加载新数据
        if (_self.endTimer) {
          clearInterval(this.endTimer);
          _self.endTimer = null;
        }
        let num = 0;
        _self.isArrived = true;
        _self.arrivedListData.pop();
        _self.arrivedListData.unshift(startDatas[num]);
        _self.$refs.logisticRoutesOnBaiduMapComponent.drawOverlay(startDatas[num], true);
        _self.endTimer = setInterval(() => {
          num++;
          if (num >= startDatas.length) {
            clearInterval(this.endTimer);
            _self.endTimer = null;
          } else {
            _self.isArrived = false;
            _self.$nextTick(() => {
              _self.isArrived = true;
              _self.arrivedListData.pop();
              _self.arrivedListData.unshift(startDatas[num]);
              _self.$refs.logisticRoutesOnBaiduMapComponent.drawOverlay(startDatas[num], true);
            });
          }
        }, 8000);
      }
    }
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
  mounted () {
  },
  activated () {
    this.sectionClass = 'enter';
    console.log('logistics');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
  },
  deactivated () {
    console.log('跳出logistics');
  },
  methods: {
    getData () {
      if (!this.getMenuList) return;
      this.bindSummaryData();
      this.bindRiskWarnData();
      this.bindLatestArrivedList();
      this.bindLatestRunningList();
      this.bindGrade();
      this.bindTrend();
      this.bindMapData();
    },
    async bindSummaryData () {
      let _self = this;
      LogisticsService.getSummary().subscribe(result => {
        if (result.data.type === 'success') {
          let res = Object.assign({}, this.summaryData);
          let data = result.data.data;
          res.standbyCount = data.WAITLEAVECOUNT;
          res.runningCount = data.ONROADCOUNT;
          res.arrivedCount = data.TODAYARRIVECOUNT;
          _self.cachePage.getSummary = res;
          _self.summaryData = JSON.parse(JSON.stringify(res));
        } else {
          if (_self.cachePage.getSummary) {
            let data = _self.cachePage.getSummary;
            _self.summaryData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    bindMapData () { // 地图数据
      let _self = this;
      LogisticsService.getMapData().subscribe(result => {
        if (result.data.type === 'success') {
          _self.cachePage.getMapData = result.data.data;
          _self.mapData = result.data.data;
        } else {
          if (_self.cachePage.getMapData) {
            let data = _self.cachePage.getMapData;
            _self.mapData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    bindRiskWarnData () { // 累计风险预警
      let _self = this;
      LogisticsService.getRiskWarnData().subscribe(result => {
        if (result.data.type === 'success') {
          let res = Object.assign({}, _self.warnData);
          let data = result.data.data;
          res.startDelayCount = data.DELAYSTART;
          res.arrivedDelayCount = data.DELAYEND;
          res.noHalfWayCount = data.MILEAGEOVERHALF;
          res.exceptionalWayCount = data.DETOURABNORMAL;
          _self.cachePage.getRiskWarnData = res;
          _self.warnData = JSON.parse(JSON.stringify(res));
        } else {
          if (_self.cachePage.getRiskWarnData) {
            let data = _self.cachePage.getRiskWarnData;
            _self.warnData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    renderArrivedItem (element) { // 计算到达运单数据
      let carBrand = element.carBrand;
      let img = (FACTORY_MAP[carBrand] && FACTORY_MAP[carBrand].imgUrl) ||
        FACTORY_MAP['欧曼'].imgUrl;
      element.arriveDate = new Date((element.arriveDate || element.sapArriveDate).replace(/-/g, '/'));
      element.realArriveDate = new Date(element.endDate.replace(/-/g, '/'));
      let time = ZBase.Date.getDateByFormat(element.realArriveDate, 'HH:mm');

      let timeDiff = element.realArriveDate.getTime() - element.arriveDate.getTime();
      element.stateClz = timeDiff <= 0 ? '' : timeDiff <= 3 * 24 * 60 * 60000 ? 'delay' : 's-delay';
      element.state = element.stateClz === '' ? '正常' : '延迟';
      let type = element.stateClz === '' ? 0 : 1;
      this.arrivedListDataMap[element.orderNum] = 1;
      return {
        startLonLat: element.startLonLat,
        endLonLat: element.endLonLat,
        time,
        img,
        type,
        title: element.customerName,
        info: element.councilsName,
        code: element.orderNum
      };
    },
    bindLatestArrivedList () { // 绑定到达运单
      let _self = this;
      LogisticsService.getLastArrived().subscribe(result => {
        if (!result.data.error) {
          // 缓存-并-赋值
          let data = result.data.data.map(_self.renderArrivedItem).slice(0, 4);
          _self.cachePage.getLatestArrivedLogisticsList = data;
          _self.arrivedListData = JSON.parse(JSON.stringify(data));
        } else {
          if (_self.cachePage.getLatestArrivedLogisticsList) {
            let data = _self.cachePage.getLatestArrivedLogisticsList;
            _self.arrivedListData = JSON.parse(JSON.stringify(data));
          }
        }
        // this.arrivedListData = {
        //   loaded: true,
        //   list: list
        // };
      });
    },
    renderRunningItem (element) { // 计算已发车运单数据
      let carBrand = element.carBrand;
      let img = (FACTORY_MAP[carBrand] && FACTORY_MAP[carBrand].imgUrl) ||
        FACTORY_MAP['欧曼'].imgUrl;
      element.startDate = new Date((element.estimateBeginDate || element.sapEstimateBeginDate).replace(/-/g, '/'));
      element.realStartDate = new Date(element.beginDate.replace(/-/g, '/'));
      let time = ZBase.Date.getDateByFormat(element.realStartDate, 'HH:mm');

      let timeDiff = element.realStartDate.getTime() - element.startDate.getTime();
      element.stateClz = timeDiff <= 0 ? '' : timeDiff <= 3 * 24 * 60 * 60000 ? 'delay' : 's-delay';
      element.state = element.stateClz === '' ? '正常' : '延迟';
      let type = element.stateClz === '' ? 0 : 1;
      this.runningListDataMap[element.orderNum] = 1;
      return {
        startLonLat: element.startLonLat,
        endLonLat: element.endLonLat,
        time,
        img,
        type,
        title: element.customerName,
        info: element.councilsName,
        code: element.orderNum
      };
    },
    bindLatestRunningList () { // 已发车运单
      let _self = this;
      LogisticsService.getLastStart().subscribe(result => {
        if (!result.data.error) {
          // 缓存-并-赋值
          _self.cachePage.getLatestRunningLogisticsList = _self.runningListData = result.data.data.map(this.renderRunningItem).slice(0, 4);
        } else {
          if (_self.cachePage.getLatestRunningLogisticsList) {
            let data = _self.cachePage.getLatestRunningLogisticsList;
            _self.runningListData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    bindGrade () { // 累计运输评价
      let _self = this;
      LogisticsService.getScore().subscribe(result => {
        if (result.data.type === 'success') {
          // 缓存-并-赋值
          _self.cachePage.getTransportEvaluation = _self.grade = result.data.data;
        } else {
          if (_self.cachePage.getTransportEvaluation) {
            let data = _self.cachePage.getTransportEvaluation;
            _self.grade = JSON.parse(JSON.stringify(data));
          }
        }
      });
    },
    bindTrend () { // 累计运单走势
      let _self = this;
      LogisticsService.getTrend().subscribe(result => {
        if (result.data.type === 'success') {
          // 缓存-并-赋值
          _self.cachePage.getOrderTrend = _self.trendData = result.data.data;
        } else {
          if (_self.cachePage.getOrderTrend) {
            let data = _self.cachePage.getOrderTrend;
            _self.trendData = JSON.parse(JSON.stringify(data));
          }
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
  .logistics {
    padding-top: 30px;
    .left {
      flex: 1;
      padding-right: 30px;
    }
    .right {
      width: 374px;
      .right-item {
        margin-bottom: 30px;
        height: 275px;
      }
    }
  }
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 520px;
    .l-map {
      animation-duration: 1s;
      animation-delay: 0.5s;
      height: 100%;
      width: 100%;
    }

    .l-summary {
      position: absolute;
      z-index: 999;
      top: 30px;
      left: 29px;
    }
  }

  .bottom {
    margin-top: 30px;
    width: 100%;

    .l-list {
      height: 340px;
      margin-right: 15px;
      flex: 1;
      overflow: hidden;
    }

    .r-list {
      height: 340px;
      margin-left: 15px;
      flex: 1;
      overflow: hidden;
    }
  }
</style>
