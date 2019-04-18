<template>
  <section class="global-part trial">
    <div class="flex trial-top">
      <div class="left animated bounceInLeft" :class="{bounceOutLeft: lever}">
        <NumberBlock class="left-block">
          <div class="run-num">
            <RunNum
              v-for="(item, i) in runSummaryData"
              :key="i"
              :runData="item"
            />
          </div>
        </NumberBlock>
      </div>
      <div class="mid animated zoomIn" :class="{zoomOut: lever}">
        <Map :mapData="mapData" :animation="stopAnimate"/>
      </div>
      <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
        <NumberBlock class="right-block"
                     :theme="2"
                     :blockTitle="`当前数据`"
                     :icon="iconData">
          <div class="run-num">
            <RunNum
              v-for="(item, i) in runCurrentData"
              :key="i"
              :runData="item"
            />
          </div>
        </NumberBlock>
        <NumberBlock class="right-block right-block2"
                     :theme="2"
                     :icon="iconRaty"
                     :blockTitle="`试制试验类型`">
          <Pie :setData="pieData" :animation="stopAnimate"/>
        </NumberBlock>
      </div>
    </div>
    <div class="flex trial-btm animated bounceInUp" :class="{bounceOutDown: lever}">
      <NumberBlock class="run-nums-block"
                   :theme="10"
                   :icon="iconCar"
                   :blockTitle="`试制试验车辆数`">
        <Bar :setData="carAnalysis" :animation="stopAnimate"/>
      </NumberBlock>
      <NumberBlock class="run-nums-block"
                   :theme="10"
                   :icon="iconCount"
                   :blockTitle="`试制试验车行驶统计`">
        <Bar :setData="runAnalysis" :animation="stopAnimate"/>
      </NumberBlock>
      <NumberBlock class="run-nums-block"
                   :icon="iconPro"
                   :theme="10"
                   :blockTitle="`试制试验进度`">
        <div class="run-num run-num-pro">
          <Progress :mapData="progressData"/>
        </div>
      </NumberBlock>
    </div>
  </section>
</template>

<script>
import GetTrialServices from '@/services/display/getTrial';
import { mapGetters } from 'vuex';
import Map from '@/components/larger/echarts/map';
import Bar from '@/components/larger/echarts/bar';
import Pie from '@/components/larger/echarts/pie';

import iconCar from '@/assets/img/trial/icon-car.png';
import iconCount from '@/assets/img/trial/icon-count.png';
import iconData from '@/assets/img/trial/icon-data.png';
import iconPro from '@/assets/img/trial/icon-pro.png';
import iconRaty from '@/assets/img/trial/icon-raty.png';

export default {
  name: 'trial',
  components: {
    Map,
    Pie,
    Bar
  },
  data () {
    return {
      iconCar,
      iconCount,
      iconData,
      iconPro,
      iconRaty,
      lever: false,
      runSummaryData: [
        {
          title: '总试制任务数',
          num: 0
        },
        {
          title: '总试制车辆数',
          num: 0
        },
        {
          title: '总试制行程里程(km)',
          num: 0
        },
        {
          title: '总试制行驶时长(h)',
          num: 0
        }
      ],
      runCurrentData: [
        {
          title: '当前任务数',
          num: 0,
          line: true
        },
        {
          title: '当前车辆数',
          num: 0,
          line: true
        },
        {
          title: '当前行驶里程(km)',
          num: 0,
          line: true
        },
        {
          title: '当前行驶时长(h)',
          num: 0,
          line: true
        }
      ],
      carAnalysis: {
        yName: '辆',
        left: '6%',
        right: '6%',
        top: '28%',
        bottom: '5%',
        interval: false,
        xRotate: 25,
        barColor: ['#5a94fb', '#071744'],
        xData: [],
        yData: [{
          name: '数量',
          data: []
        }]
      },
      runAnalysis: {
        lineYName: '时长(小时)',
        yName: '里程(公里)',
        left: '6%',
        right: '6%',
        top: '28%',
        bottom: '5%',
        xRotate: 25,
        interval: false,
        barColor: ['#5a94fb', '#071744'],
        xData: [],
        yData: [{
          name: '里程',
          data: []
        }],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '时长'
          }]
      },
      pieData: {
        tooltip: true,
        legendAlign: 'left',
        legendRight: '15%',
        legendTop: '35%',
        legendIcon: 'circle',
        radius: ['35%', '65%'],
        center: ['35%', '50%'],
        data: [],
        colors: ['#4957AF', '#6C7AE2', '#44B8F2', '#EDE272', '#D66C97']
      },
      mapData: {},
      progressData: []
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
    console.log('trial');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
  },
  deactivated: function () {
    console.log('跳出trial');
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        this.getSummaryInfo();
        this.getListSummaryGbProvince();
        this.getCurrentSummaryInfo();
        this.getListDaysTaskAnalysis();
        this.getListTaskGroupByType();
        this.getListTask();
      }
    },
    async getSummaryInfo () { // 总试制任务数
      let _self = this;
      let obs = await GetTrialServices.getSummaryInfo();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.runSummaryData[0].num = data.sumTaskNum;
          _self.runSummaryData[1].num = data.sumVehicles;
          _self.runSummaryData[2].num = parseInt(Math.round(data.sumMileage / 1000));
          _self.runSummaryData[3].num = parseInt(Math.round(data.sumRunTimeSpan / 60 / 60));
          _self.runSummaryData = JSON.parse(JSON.stringify(_self.runSummaryData));
        }
      }, e => console.log(`trial: ${e}`));
    },
    async getCurrentSummaryInfo () { // 当前数据
      let _self = this;
      let obs = await GetTrialServices.getCurrentSummaryInfo();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.runCurrentData[0].num = data.doingTaskNum;
          _self.runCurrentData[1].num = data.doingVehicles;
          _self.runCurrentData[2].num = parseInt(Math.round(data.doingMileage / 1000));
          _self.runCurrentData[3].num = parseInt(Math.round(data.doingRunTimeSpan / 60 / 60));
          _self.runCurrentData = JSON.parse(JSON.stringify(_self.runCurrentData));
        }
      }, e => console.log(`trial: ${e}`));
    },
    async getListSummaryGbProvince () { // 地图数据
      let _self = this;
      let obs = await GetTrialServices.getListSummaryGbProvince();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let maps = {};
          data.forEach(ele => {
            maps[ele.PROVINCE] = parseInt(ele.PROVINCEVEHICLES);
          });
          _self.mapData = JSON.parse(JSON.stringify(maps));
        }
      }, e => console.log(`trial: ${e}`));
    },
    async getListTaskGroupByType () { // 试制试验类型
      let _self = this;
      let obs = await GetTrialServices.getListTaskGroupByType();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.pieData.data = data.map(ele => {
            return {
              name: ele.TYPE,
              value: ele.TASKNUM
            };
          });
          _self.pieData = JSON.parse(JSON.stringify(_self.pieData));
        }
      }, e => console.log(`trial: ${e}`));
    },
    async getListDaysTaskAnalysis () { // 试制试验车-车辆数/行驶统计
      let _self = this;
      let obs = await GetTrialServices.getListDaysTaskAnalysis({
        days: 59
      });
      obs.subscribe(res => {
        let data = res.data.data;
        let xData = [];
        let yData = [];
        let carYData = [];
        let lineData = [];
        data.slice(-14).forEach(ele => {
          if (ele.dataDay.length > 5) {
            xData.push(ele.dataDay.slice(5));
            yData.push(Math.round((ele.totalMileage || 0) / 1000 * 10) / 10);
            lineData.push(Math.round((ele.totalRunTime || 0) / 60 / 60 * 10) / 10);
            carYData.push(ele.carNum);
          }
        });
        // 试验车行驶统计
        _self.runAnalysis.xData = xData;
        _self.runAnalysis.yData[0].data = yData;
        _self.runAnalysis.lineData[0].data = lineData;
        // 试验车-辆数
        _self.carAnalysis.xData = xData;
        _self.carAnalysis.yData[0].data = carYData;
        // 赋值
        _self.runAnalysis = JSON.parse(JSON.stringify(_self.runAnalysis));
        _self.carAnalysis = JSON.parse(JSON.stringify(_self.carAnalysis));
      }, e => console.log(`trial: ${e}`));
    },
    async getListTask () { // 试制试验类型
      let _self = this;
      let obs = await GetTrialServices.getListTask();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          _self.progressData = data.sort((a, b) => {
            return b.RUN_MILEAGE - a.RUN_MILEAGE;
          }).slice(0, 5).map(ele => {
            return {
              title: ele.NAME,
              value: Math.round(ele.RUN_MILEAGE * 1000) / 10
            };
          });
          _self.progressData = JSON.parse(JSON.stringify(_self.progressData));
        }
      }, e => console.log(`trial: ${e}`));
    }
  }
};
</script>

<style scoped lang="scss">
  .trial {
    .trial-top {
      .left {
        margin-top: 85px;
        width: 345px;
        .left-block {
          height: 440px;
        }
      }
      .mid {
        flex: 1;
        height: 670px;
      }
      .right {
        margin-top: 50px;
        width: 385px;
        .right-block {
          height: 280px;
        }
        .right-block2 {
          margin-top: 30px;
        }
        .run-num {
          padding-bottom: 20px;
        }
      }
    }
    .trial-btm {
      height: 270px;
      .run-nums-block {
        flex: 1;
        margin-right: 30px;
        &:nth-of-type(3) {
          margin-right: 0;
        }
      }
      .run-num-pro {
        padding: 40px 50px 0 10px;
      }
    }
  }
</style>
