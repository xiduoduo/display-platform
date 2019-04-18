<template>
  <div class="mileage flex animated bounceInRight" :class="{bounceOutLeft: lever}">
    <div class="left">
      <NumberBlock
        class="run-nums-block"
        :theme="1"
        :blockTitle="'总服务里程（KM）'"
        :icon="iconKm"
      >
        <div class="run-num">
          <RunNum
            :fontChange="Boolean(true)"
            :runData="{title: '', num: leftMilege}"
          />
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="1"
        :blockTitle="'总行驶时长（H）'"
        :icon="iconHours"
      >
        <div class="run-num">
          <RunNum
            :fontChange="Boolean(true)"
            :runData="{title: '', num: leftRunTime}"
          />
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block-top5"
        :theme="2"
        :blockTitle="'本月常见故障Top5'"
        :icon="iconFaults"
      >
        <Pie :setData="faultTop5Data" :animation="Boolean(false)"></Pie>
      </NumberBlock>
    </div>
    <div class="main">
      <div class="map-box">
        <MapLine class="map" :class="{'show': activeMapIndex === 0}" :mapData="map0"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 1}" :mapData="map1"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 2}" :mapData="map2"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 3}" :mapData="map3"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 4}" :mapData="map4"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 5}" :mapData="map5"/>
        <MapLine class="map" :class="{'show': activeMapIndex === 6}" :mapData="map6"/>
      </div>
      <div class="timeline">
        <h3
          class="trans"
          :style="{
            left: singleLeft * activeMapIndex + 'px',
            transitionDuration: durTime
          }"
        >
          {{totalsReverse[activeMapIndex]}}
        </h3>
        <div
          class="linebox"
          ref="lineBox"
        >
          <p class="line-a">
            <span
              class="split"
              v-for="(v, i) in hours"
              :key="i"
              :style="{left: singleLeft * i + 'px'}"
            >
            </span>
          </p>
          <p
            class="line-b"
            ref="lineB"
            :style="{
              width: allDataReady ? singleLeft * (activeMapIndex + 1) + 'px' : 0,
              transitionDuration: '5s'
            }"
          >
          </p>
          <div class="timebox">
            <span
              class="time-str"
              v-for="(v, i) in hours"
              :key="i"
              :style="{left: singleLeft * i + 'px'}"
              @click="changeMap(i)"
            >
              {{v}}
            </span>
          </div>
        </div>
        <p class="tip">（最近24小时数据）</p>
      </div>
    </div>
    <div class="right">
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`车辆里程分布区间`"
        :icon="iconBar"
      >
        <Bar :setData="mileageSectionData" :animation="Boolean(false)"/>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="'车辆月运营率及里程分布'"
        :icon="iconNote"
      >
        <Bar :setData="operateMileageData" :animation="Boolean(false)"/>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`车辆月平均油耗分布`"
        :icon="iconOil"
      >
        <Bar :setData="averageFuelData" :animation="Boolean(false)"/>
      </NumberBlock>
    </div>
  </div>
</template>

<script>
import iconKm from '@/assets/img/kms/all-mileage.png';
import iconHours from '@/assets/img/kms/all-runtime.png';
import iconFaults from '@/assets/img/kms/fault-top5.png';
import iconBar from '@/assets/img/kms/mileage-section.png';
import iconNote from '@/assets/img/kms/run-mileage.png';
import iconOil from '@/assets/img/kms/oil-section.png';
import Pie from '@/components/larger/echarts/pie';
import Bar from '@/components/larger/echarts/bar';
import MapLine from '@/components/larger/echarts/map-line';
import getKmsPage2Service from '@/services/kms/getKmsPage2';
import { setInterval, clearInterval, setTimeout } from 'timers';
import { KMS_WARN_NAMES } from '@/services/common';

export default {
  name: 'mileage',
  components: {
    Bar,
    Pie,
    MapLine
  },
  data () {
    return {
      iconKm,
      iconHours,
      iconFaults,
      iconBar,
      iconNote,
      iconOil,
      leftMilege: 0,
      leftRunTime: 0,
      faultTop5Data: {
        startAngle: 0,
        tooltip: true,
        legendIcon: 'rect',
        legendAlign: 'left',
        legendTop: '65%',
        legendRight: 'center',
        legendTextColor: '#fff',
        legendTextFormatter: 'normal',
        width: '100%',
        center: ['50%', '35%'],
        radius: '45%',
        colors: ['#3f536b', '#f15c13', '#ffb30f', '#28a5df', '#7e5ee5', '#fe912a', '#fec959', '#95bc11'],
        data: []
      },
      // main
      map0: {},
      map1: {},
      map2: {},
      map3: {},
      map4: {},
      map5: {},
      map6: {},
      totals: [],
      hours: [],
      singleLeft: 0, // 时间标签的间距
      lineBWidth: 0,
      activeMapIndex: 0,
      timer: null,
      durTime: '.5s',
      allDataReady: false,
      // right
      mileageSectionData: {
        tooltipUnitFormatter: '万公里',
        yName: '车辆数（辆）',
        xName: '万公里',
        interval: 0,
        top: '24%',
        left: '5%',
        right: '20%',
        bottom: '8%',
        xData: [],
        yData: [
          {
            name: '车辆数',
            data: []
          }
        ],
        barColor: ['#eb8812', 'rgba(235, 136, 18, 0)']
      },
      operateMileageData: {
        tooltipUnitFormatter: '月',
        XshowYear: true,
        left: '4%',
        right: '6%',
        bottom: '10%',
        top: '28%',
        interval: false,
        yName: '里程（KM）',
        lineYName: '运营率（%）',
        legend: {
          show: true,
          top: '5%'
        },
        xData: [],
        yData: [
          {
            name: '里程',
            data: []
          }],
        barColor: ['#1e72bb', 'rgba(30, 114, 187, 0)'],
        lineData: [
          {
            color: '#f19504',
            data: [],
            name: '运营率'
          }]
      },
      averageFuelData: {
        tooltipUnitFormatter: '月',
        XshowYear: true,
        yName: '油耗（L/100KM）',
        interval: 0,
        top: '24%',
        left: '10%',
        right: '6%',
        bottom: '8%',
        xData: [],
        yData: [
          {
            name: '百公里油耗',
            data: []
          }
        ],
        barColor: ['#eb8812', 'rgba(235, 136, 18, 0)']
      },
      lever: false
    };
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.lever = false;
    });
  },
  beforeRouteLeave (to, from, next) { // change animate or not
    this.lever = true;
    setTimeout(() => {
      next();
    }, 80);
  },
  mounted () {
    this.getData();
  },
  computed: {
    totalsReverse () {
      let arr = this.totals;
      let flag = arr.every(v => isNaN(v) === false);
      if (arr.length === 7 && flag) {
        return arr.reverse();
      }
      return arr;
    }
  },
  destroyed () {
    clearInterval(this.timer);
    this.timer = null;
  },
  methods: {
    getData () {
      this.getMileageTime();
      this.getFaultTop5();
      this.getMileageSection();
      this.getChartRunAndOil();
      this.beforeGetMapData();
    },
    async getMileageTime () { // 总服务里程、行驶时长
      let _self = this;
      let obj = await getKmsPage2Service.getMileageTime();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let mileage = res.data.data.mileage;
          let times = res.data.data.run_Time;
          _self.leftMilege = Number(mileage);
          _self.leftRunTime = Number(times);
        }
      }, err => console.warn(err));
    },
    async getFaultTop5 () { // 常见故障top5
      let _self = this;
      let obj = await getKmsPage2Service.getFaultTop20ByMonth();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          let seriesData = [];
          let namesArr = [];
          KMS_WARN_NAMES.forEach((v, i) => {
            d.forEach(x => {
              if (v.oName === x.name && !namesArr.includes(v.oName)) {
                seriesData.push({
                  name: v.nName,
                  value: x.count
                });
                namesArr.push(v.oName);
              }
            });
          });
          let arr = seriesData.sort((a, b) => parseInt(b.value) - parseInt(a.value)).slice(0, 5);
          _self.faultTop5Data.data = arr;
          _self.faultTop5Data = JSON.parse(JSON.stringify(_self.faultTop5Data));
        }
      });
    },
    async getMileageSection () { // 里程分布区间
      let _self = this;
      let obj = await getKmsPage2Service.getMileageSection();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let xData = [];
          let yData = [];
          let sumOfGt25 = 0;
          data.forEach((v, i) => {
            if (i > 4) {
              sumOfGt25 += v.num;
            } else {
              xData.push(v.section);
              yData.push(v.num);
            }
          });
          xData.push('>25');
          yData.push(sumOfGt25);
          _self.mileageSectionData.xData = xData;
          _self.mileageSectionData.yData[0].data = yData;
          _self.mileageSectionData = JSON.parse(JSON.stringify(_self.mileageSectionData));
        }
      }, err => console.warn(err));
    },
    async getChartRunAndOil () { // 里程分布
      let _self = this;
      let obj = await getKmsPage2Service.getChartRunAndOil();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          if (d.length === 13) d.pop();
          let xData = [];
          let series1 = []; // 月里程分布
          let series2 = []; // 月运营率
          let series3 = []; // 月平均油耗
          d.forEach(v => {
            let month = v.data_month.split('-')[1];
            xData.push(parseInt(month));
            series1.push(Math.round(v.avg_mileage / 1000));
            series2.push(v.attendance_Rate);
            series3.push(Math.round(v.avg_per_fuel_consumption_filter * 100) / 100);
          });
          _self.operateMileageData.xData = xData;
          _self.operateMileageData.yData[0].data = series1;
          _self.operateMileageData.lineData[0].data = series2;
          _self.operateMileageData = JSON.parse(JSON.stringify(_self.operateMileageData));
          _self.averageFuelData.xData = xData;
          _self.averageFuelData.yData[0].data = series3;
          _self.averageFuelData = JSON.parse(JSON.stringify(_self.averageFuelData));
        }
      }, err => console.warn(err));
    },
    beforeGetMapData () {
      // 划分7个时间段
      let fourHours = 1000 * 60 * 60 * 4;
      let hours = [];
      for (let i = 0; i < 7; i++) {
        let now = new Date(Date.now() - fourHours * i);
        let nowHour = now.getHours();
        let a = parseInt(nowHour / 4) * 4;
        hours[i] = (a < 10 ? '0' + a : a) + ':00';
        let stamp = Date.parse(now.toLocaleDateString() + ` ${a}:00:00`);
        this.requestMapData(stamp, i);
      }

      let w = this.$refs.lineBox.clientWidth;
      this.singleLeft = w / 6;
      this.hours = hours.reverse();
    },
    async requestMapData (timeStamp, n) {
      // 7个时间段，地图数据
      let _self = this;
      let obj = await getKmsPage2Service.getMapData({timeMillis: timeStamp});
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          _self.$set(this.totals, n, d.total);
          this.renderMap(d, n);
          let flag = this.totals.every(v => isNaN(v) === false);
          if (this.totals.length === 7 && flag) {
            this.allDataReady = true;
            this.loopMap();
          }
        }
      }, err => console.warn(err));
    },
    renderMap (data, n) {
      // 每一条地图数据
      let newData = {};
      newData.lowData = data.low;
      newData.midData = data.middle;
      newData.highData = data.high;
      setTimeout(() => {
        this['map' + n] = newData;
      }, 500);
    },
    changeMap (n) {
      clearInterval(this.timer);
      let lineB = this.$refs.lineB;
      lineB.style.transitionDuration = '0s';
      lineB.style.width = n * this.singleLeft + 'px';
      // console.log(window.document.body.clientHeight);
      lineB.style.transitionDuration = '5s';
      this.activeMapIndex = n;
      this.loopMap();
    },
    loopMap () {
      let lineB = this.$refs.lineB;
      this.timer = setInterval(() => {
        lineB.style.transitionDuration = '5s';
        this.activeMapIndex++;
        if (this.activeMapIndex > 6) {
          lineB.style.transitionDuration = '0s';
          lineB.style.width = '0';
          // console.log(window.document.body.clientWidth);
          lineB.style.transitionDuration = '5s';
          this.activeMapIndex = 0;
        }
      }, 5000);
    }
  }
};
</script>

<style scoped lang="scss">
  .mileage {
    padding-top: 20px;

    .main {
      flex: 1;

      .map-box {
        width: 100%;
        height: 80%;
        position: relative;

        .map {
          width: 100%;
          height: 100%;
          position: absolute;
          opacity: 0;
          top: 0;
          left: 0;

          &.show {
            opacity: 1;
          }
        }
      }

      .timeline {
        width: 80%;
        margin: 0 auto;
        position: relative;
        z-index: 9999;

        h3 {
          opacity: 1;
          display: inline;
          font-family: "LGDR";
          margin-left: -45px;
          position: relative;
          left: 0;
          text-align: left;
          font-size: 30px;
          line-height: 50px;
          color: #ffbc1c;
          transition: left 0.5s linear;

          &.opa {
            opacity: 1;
          }
        }

        .linebox {
          .line-a {
            height: 1px;
            background-color: rgba(255, 255, 255, 0.4);
            position: relative;

            span {
              position: absolute;
              // display: block;
              width: 2px;
              height: 5px;
              background-color: #ffbc1c;
              top: -2px;
            }
          }

          .line-b {
            max-width: 100%;
            position: relative;
            left: 1px;
            height: 1px;
            background-color: #ffbc1c;
            width: 0;
            margin-top: -1px;
            transition: width 5s linear;
            transition-duration: 0.5s;
          }

          .timebox {
            position: relative;

            span {
              position: absolute;
              top: 5px;
              margin-left: -20px;
              padding: 2px 3px;
              text-align: center;
              font-size: 16px;
              color: rgba(255, 255, 255, 0.8);
              cursor: pointer;
            }
          }
        }

        .tip {
          color: rgba(255, 255, 255, 0.3);
          font-size: 12px;
          margin-left: -21px;
          margin-top: 35px;
          letter-spacing: 1px;
        }
      }
    }

    .left {
      width: 390px;
      margin-left: 2%;

      .run-nums-block {
        height: 180px;
        margin-bottom: 50px;
      }

      .run-nums-block-top5 {
        height: 390px;
      }

      /deep/ .run-num {
        padding-top: 39px;
      }
    }

    .right {
      width: 390px;
      margin-right: 2%;

      .run-nums-block {
        margin-bottom: 40px;
        height: 260px;
      }
    }
  }
</style>
