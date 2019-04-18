<template>
  <section class="global-part flex part-three">
    <div class="left">
      <div class="top-map animated fadeIn" :class="{fadeOut: lever}">
        <PartBMap class="top-map-content" :dataRef="dataRef" :dealerData="dealerData"/>
        <div class="top-map-btns">
          <span :class="{'active': isActive}" @click="getDealer">经销商</span>
          <span :class="{'active': !isActive}" @click="getServicer">服务商</span>
        </div>
      </div>
      <div class="btm-analyze flex animated bounceInUp" v-if="Boolean(false)" :class="{bounceOutDown: lever}">
        <NumberBlock :theme="2" class="btm-analyze-block">
          <h3 class="global-block-title">乘用车行驶分析</h3>
          <Bar :setData="lineBarPassVehicle" :animation="stopAnimate"/>
        </NumberBlock>
        <NumberBlock :theme="2" class="btm-analyze-block" v-if="Boolean(false)">
          <h3 class="global-block-title">乘用车平均车速变化分析</h3>
          <Bar :setData="linePassVehicle" :animation="stopAnimate"/>
        </NumberBlock>
      </div>
    </div>
    <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
      <NumberBlock :theme="6" class="right-num">
        <div class="run-num">
          <RunNum :runData="mileage"/>
        </div>
      </NumberBlock>
      <NumberBlock :theme="6" class="right-num">
        <div class="run-num">
          <RunNum :runData="hours"/>
        </div>
      </NumberBlock>
      <NumberBlock :theme="9" class="right-analyze-block-one">
        <h3 class="global-block-title">车辆行驶分析</h3>
        <Bar :setData="lineBarCommVehicle" :animation="stopAnimate"/>
      </NumberBlock>
      <NumberBlock :theme="9" class="right-analyze-block-two">
        <h3 class="global-block-title">车辆平均车速变化分析</h3>
        <Bar :setData="lineCommVehicle" :animation="stopAnimate"/>
      </NumberBlock>
    </div>
  </section>
</template>

<script>
import GetIndexServices from '@/services/display/getIndex';
import Bar from '@/components/larger/echarts/bar';
import PartBMap from '@/components/business/part-three-baidu-map';
import { mapGetters } from 'vuex';

export default {
  name: 'part-three',
  components: {
    Bar,
    PartBMap
  },
  data () {
    return {
      isActive: true,
      lever: false,
      mileage: {
        title: '总服务里程(km)',
        num: 0
      },
      hours: {
        title: '总行驶时长(h)',
        num: 0
      },
      lineBarPassVehicle: { // 乘用车行驶分析
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '28%',
        xRotate: 25,
        interval: false,
        yName: '里程（公里）',
        lineYName: '时长（小时）',
        legend: {
          show: true,
          bottom: '3%'
        },
        xData: [],
        yData: [{
          name: '车辆日平均行驶里程',
          data: []
        }],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '车辆日平均行驶时长'
          }]
      },
      lineBarCommVehicle: { // 商用车行驶分析
        left: '5%',
        right: '5%',
        bottom: '10%',
        top: '32%',
        xRotate: 30,
        interval: false,
        yName: '里程（公里）',
        lineYName: '时长（小时）',
        legend: {
          show: true,
          bottom: '3%'
        },
        xData: [],
        yData: [{
          name: '车辆日平均行驶里程',
          data: []
        }],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '车辆日平均行驶时长'
          }]
      },
      linePassVehicle: { // 乘用车平均速度分析
        left: '5%',
        right: '5%',
        top: '28%',
        bottom: '12%',
        lineYName: '里程/小时',
        xDataTime: true,
        xData: [],
        yData: [],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '乘用车平均车速变化分析'
          }],
        markPoint: {
          avg: true,
          show: true,
          name: '乘用车平均车速变化分析'
        },
        xBoundaryGap: false
      },
      lineCommVehicle: { // 商用车平均速度分析
        lineYName: '里程/小时',
        left: '5%',
        right: '5%',
        top: '28%',
        bottom: '12%',
        xDataTime: true,
        xData: [],
        yData: [],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '商用车平均车速变化分析'
          }],
        markPoint: {
          avg: true,
          show: true,
          name: '商用车平均车速变化分析'
        },
        xBoundaryGap: false
      },
      dataRef: [],
      dealerData: [],
      dealer: [],
      service: [],
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
      this.getRunSummary();
      this.token = this.currentPageBrand.token;
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.lever = false;
    });
  },
  beforeRouteLeave (to, from, next) { // change animate or not
    if (to.path !== from.path && this.getPaths.indexOf(this.$route.name) === -1) {
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
    console.log('three');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
    if (this.getMenuList.length) {
      this.getRunSummary();
    }
  },
  deactivated: function () {
    console.log('跳出缓存three');
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        // this.getRunSummary();
        this.getRunAnalysis();
        this.getAvgVelocity();
        this.getLocList();
      }
    },
    getRunSummary () { // 总时长、公里数
      let _self = this;
      // let obs = await GetIndexServices.getRunSummary();
      this.closeSub = GetIndexServices.getRunSummary().subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.cachePage.getRunSummary = data;
          _self.mileage.num = data.mileage;
          _self.hours.num = data.run_Time;
          _self.mileage = JSON.parse(JSON.stringify(_self.mileage));
          _self.hours = JSON.parse(JSON.stringify(_self.hours));
        } else {
          if (_self.cachePage.getRunSummary) {
            let data = _self.cachePage.getRunSummary;
            _self.mileage.num = data.mileage;
            _self.hours.num = data.run_Time;
            _self.mileage = JSON.parse(JSON.stringify(_self.mileage));
            _self.hours = JSON.parse(JSON.stringify(_self.hours));
          }
        }
      }, e => console.log(e));
    },
    getRunAnalysis () { // 商用车行驶-数据
      let _self = this;
      // let obs = await GetIndexServices.getRunAnalysis();
      GetIndexServices.getRunAnalysis().subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let mileageCom = [];
          let runtimeCom = [];
          let xDataCom = [];
          // let mileagePass = [];
          // let runtimePass = [];
          // let xDataPass = [];
          // 商用车行驶-数据
          data.CommVehicle.forEach(ele => {
            mileageCom.push(Math.round(ele.mileage * 10) / 10);
            runtimeCom.push(Math.round(ele.runtime * 10) / 10);
            xDataCom.push(ele.today);
          });
          // 乘用车行驶-数据
          // data.PassVehicle.forEach(ele => {
          //   mileagePass.push(Math.round(ele.mileage * 10) / 10);
          //   runtimePass.push(Math.round(ele.runtime * 10) / 10);
          //   xDataPass.push(ele.today);
          // });
          // 商用车行驶-分析
          _self.lineBarCommVehicle.xData = xDataCom;
          _self.lineBarCommVehicle.yData[0].data = mileageCom;
          _self.lineBarCommVehicle.lineData[0].data = runtimeCom;
          // 乘用车行驶-分析
          // _self.lineBarPassVehicle.xData = xDataPass;
          // _self.lineBarPassVehicle.yData[0].data = mileagePass;
          // _self.lineBarPassVehicle.lineData[0].data = runtimePass;
          // 缓存
          _self.cachePage.getRunAnalysis = _self.lineBarCommVehicle;
          // 赋值
          _self.lineBarCommVehicle = JSON.parse(JSON.stringify(_self.lineBarCommVehicle));
          // _self.lineBarPassVehicle = JSON.parse(JSON.stringify(_self.lineBarPassVehicle));
        } else {
          if (_self.cachePage.getRunAnalysis) {
            let data = _self.cachePage.getRunAnalysis;
            _self.lineBarCommVehicle = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    getAvgVelocity () { // 商用车行驶-车速
      let _self = this;
      // let obs = await GetIndexServices.getAvgVelocity();
      GetIndexServices.getAvgVelocity().subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let avgSpeedCom = [];
          let xDataCom = [];
          let avgSpeedPass = [];
          let xDataPass = [];
          // 商用车行驶-数据
          data.CommVehicle.splice(-12).forEach(ele => {
            avgSpeedCom.push(ele.avgSpeed);
            xDataCom.push(ele.hour + ':00');
          });
          // 乘用车行驶-数据
          data.PassVehicle.forEach(ele => {
            avgSpeedPass.push(ele.avgSpeed);
            xDataPass.push(ele.hour + ':00');
          });
          // 商用车行驶-分析
          _self.lineCommVehicle.xData = xDataCom;
          _self.lineCommVehicle.lineData[0].data = avgSpeedCom;
          // 乘用车行驶-分析
          // _self.linePassVehicle.xData = xDataPass;
          // _self.linePassVehicle.lineData[0].data = avgSpeedPass;
          // 缓存
          _self.cachePage.getAvgVelocity = _self.lineCommVehicle;
          // 赋值
          _self.lineCommVehicle = JSON.parse(JSON.stringify(_self.lineCommVehicle));
          // _self.linePassVehicle = JSON.parse(JSON.stringify(_self.linePassVehicle));
        } else {
          if (_self.cachePage.getAvgVelocity) {
            let data = _self.cachePage.getAvgVelocity;
            _self.lineCommVehicle = JSON.parse(JSON.stringify(data));
          }
        }
      }, e => console.log(e));
    },
    getLocList () { // 地图热区
      let _self = this;
      // let obs = await GetIndexServices.getLocList();
      GetIndexServices.getLocList().subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          // 缓存
          _self.cachePage.getLocList = data;
          // 赋值
          _self.dataRef = JSON.parse(JSON.stringify(data));
        } else {
          if (_self.cachePage.getLocList) {
            let data = _self.cachePage.getLocList;
            _self.dataRef = JSON.parse(JSON.stringify(data));
          }
        }
        // 选中的是哪个按钮，初始化就加载那条数据【经销商/服务商】
        if (_self.isActive) {
          _self.getDealer();
        } else {
          _self.getServicer();
        }
      }, e => console.log(e));
    },
    getDealer () { // 经销商
      let _self = this;
      _self.isActive = true;
      if (_self.dealer.length) {
        _self.dealerData = JSON.parse(JSON.stringify(_self.dealer));
      } else {
        // let obs = await GetIndexServices.getDealer();
        GetIndexServices.getDealer().subscribe(res => {
          if (res.data.type === 'success') {
            let data = res.data.data;
            _self.dealerData = _self.dealer = JSON.parse(JSON.stringify(data));
          }
        }, e => console.log(e));
      }
    },
    getServicer () { // 服务商
      let _self = this;
      _self.isActive = false;
      if (_self.service.length) {
        _self.dealerData = JSON.parse(JSON.stringify(_self.service));
      } else {
        // let obs = await GetIndexServices.getServicer();
        GetIndexServices.getServicer().subscribe(res => {
          if (res.data.type === 'success') {
            let data = res.data.data;
            _self.dealerData = _self.service = JSON.parse(JSON.stringify(data));
          }
        }, e => console.log(e));
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .part-three {
    padding-top: 20px;
    .left {
      flex: 1;
      .top-map {
        position: relative;
        width: 100%;
        height: 885px;
        background: #030641;
        .top-map-content {
          width: 100%;
          height: 100%;
        }
        .top-map-btns {
          position: absolute;
          right: 40px;
          top: 15px;
          span {
            cursor: pointer;
            width: 100px;
            height: 50px;
            text-align: center;
            line-height: 50px;
            color: #fff;
            display: block;
            margin-bottom: 25px;
            font-size: 18px;
            background: linear-gradient(top, #3867a7, #0b1226 60%);
            background: -ms-linear-gradient(top, #3867a7, #0b1226 60%);
            background: -webkit-linear-gradient(top, #3867a7, #0b1226 60%);
            box-shadow: 0 0 4px #3867a7;
            &.active {
              color: #0af6e6;
              background: rgba(6, 17, 54, .8);
            }
          }
        }
      }
      .btm-analyze {
        width: 100%;
        padding-top: 20px;
        .btm-analyze-block {
          flex: 1;
          height: 300px;
          margin-right: 20px;
          &:nth-of-type(2) {
            margin: 0;
          }
        }
      }
    }

    .right {
      width: 637px;
      padding-left: 20px;
      .right-num {
        width: 100%;
        height: 118px;
        &:nth-of-type(2) {
          margin-top: 20px;
        }
      }
      .run-num {
        padding-top: 18px;
      }
      .right-analyze-block-one {
        width: 100%;
        margin-top: 20px;
        height: 290px;
      }
      .right-analyze-block-two {
        width: 100%;
        margin-top: 20px;
        height: 300px;
      }
    }
  }
</style>
