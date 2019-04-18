<template>
  <div class="box">
    <div class="left">
      <NumberBlock
        v-for="(item, i) in leftList"
        :key="i"
        class="run-nums-block"
        :theme="1"
        :blockTitle="item.title"
        :icon="item.icon"
        :data-index="i"
        v-on:click.native="changeMapData(i)"
      >
        <div class="run-num">
          <RunNum
            :runNumBool="true"
            :runData="{num: item.num}"
          />
        </div>
      </NumberBlock>
    </div>
    <div class="map">
      <Map :mapData="mapData" :cityMapData="cityMapData" :animation="Boolean(false)"/>
    </div>
    <div class="right">
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`今日在线车辆（小时）`"
        :icon="iconOnLine"
      >
        <div
          class="online-chart chart"
          id="chart1"
        >
          <Bar :setData="onLineData" :animation="Boolean(false)"/>
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="'ISF发动机装配走势'"
        :icon="iconTrend"
      >
        <div
          class="isf-chart chart"
          id="chart2"
        >
          <Bar :setData="isfData" :animation="Boolean(false)"/>
        </div>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`ISG发动机装配走势`"
        :icon="iconTrend"
      >
        <div
          class="isg-chart chart"
          id="chart3"
        >
          <Bar :setData="isgData" :animation="Boolean(false)"/>
        </div>
      </NumberBlock>
    </div>
  </div>
</template>
<script>
import iconTruck from '@/assets/kms/all-cars.png';
import iconOnLine from '@/assets/kms/online-car.png';
import iconTrend from '@/assets/kms/trend.png';
import Map from '@/components/larger/echarts/map';
import Bar from '@/components/larger/echarts/bar';
import getKmsPage1Service from '@/services/getKmsPage1';
export default {
  name: 'kms-page1',
  data () {
    return {
      // left
      iconTrend,
      iconOnLine,
      leftList: [
        {
          getDataFnName: 'getDistrMapData',
          title: '总加入车辆',
          num: 0,
          icon: iconTruck
        },
        {
          getDataFnName: 'getOnlineDistrMapData',
          title: '实时在线车辆',
          num: 0,
          icon: iconOnLine
        },
        {
          getDataFnName: 'getISFFactDistrMapData',
          title: '装配ISF发动机车辆',
          num: 0,
          icon: iconTrend
        },
        {
          getDataFnName: 'getISGFactDistrMapData',
          title: '装配ISG发动机车辆',
          num: 0,
          icon: iconTrend
        }
      ],
      curLeftIndex: 0,
      // main
      mapData: {},
      cityMapData: {},
      // right
      onLineData: {
        left: '10%',
        right: '10%',
        top: '24%',
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
      isfData: {
        top: '24%',
        right: '6%',
        xData: [],
        yData: [
          {
            name: '',
            data: []
          }
        ],
        barColor: ['#eb8812', 'rgba(235, 136, 18, 0)']
      },
      isgData: {
        top: '24%',
        right: '6%',
        xData: [],
        yData: [
          {
            name: '',
            data: []
          }
        ],
        barColor: ['#1e72bb', 'rgba(30, 114, 187, 0)']
      }
    };
  },
  components: {
    Map,
    Bar
  },
  methods: {
    getData () {
      this.getMapData();
      this.getLeft4BlockData();
      this.getRightOnLineData();
      this.getRightISFData();
      this.getRightISGData();
    },
    async getMapData () {
      let _self = this;
      let a = this.leftList[this.curLeftIndex].getDataFnName;
      let obj = await getKmsPage1Service[a]();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          const P = res.data.data.province;
          const C = res.data.data.city;
          _self.cityMapData = JSON.parse(JSON.stringify(C));
          _self.mapData = JSON.parse(JSON.stringify(P));
        }
      }, err => console.warn(err));
    },
    async getLeft4BlockData () {
      let _self = this;
      let obj = await getKmsPage1Service.getLeftData();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          this.$set(_self.leftList[0], 'num', d.ALLNUM);
          this.$set(_self.leftList[1], 'num', d.ONLINENUM);
          let factorys = ['', '', 'ISF', 'ISG'];
          d.FACTORY.forEach(v => {
            let i = factorys.indexOf(v.NAME);
            if (i !== -1) {
              _self.leftList[i].num = v.NUM;
            }
          });
        }
      });
    },
    async getRightOnLineData () {
      let _self = this;
      let obj = await getKmsPage1Service.getRightOnLineData();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          /**
          *   要求从当天的最小值开始，最小值之前的不要
          */
          let data = res.data.data;
          let beginIndex = 0;
          var min = data[0].realCount;
          data.forEach((v, i) => {
            if (v.realCount <= min) {
              min = v.realCount;
              beginIndex = i;
            }
          });
          data = data.splice(beginIndex);
          let xData = [];
          let lineData = data.map(ele => {
            xData.push(ele.hour + ':00');
            return ele.realCount;
          });
          _self.onLineData.xData = xData;
          _self.onLineData.lineData[0].data = lineData;
          _self.onLineData = JSON.parse(JSON.stringify(_self.onLineData));
        }
      }, err => console.warn(err));
    },
    async getRightISFData () {
      let _self = this;
      let obj = await getKmsPage1Service.getRightISFData();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data.ISF;
          let xData = [];
          let yData = [];
          Object.keys(d).forEach(x => {
            xData.push(parseInt(x.split('-')[1]));
            yData.push(parseInt(d[x]));
          });
          _self.isfData.xData = xData.reverse();
          _self.isfData.yData[0].data = yData.reverse();
          _self.isfData = JSON.parse(JSON.stringify(_self.isfData));
        }
      }, err => console.warn(err));
    },
    async getRightISGData () {
      let _self = this;
      let obj = await getKmsPage1Service.getRightISGData();
      obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data.ISG;
          let xData = [];
          let yData = [];
          Object.keys(d).forEach(x => {
            xData.push(parseInt(x.split('-')[1]));
            yData.push(parseInt(d[x]));
          });
          _self.isgData.xData = xData.reverse();
          _self.isgData.yData[0].data = yData.reverse();
          _self.isgData = JSON.parse(JSON.stringify(_self.isgData));
        }
      }, err => console.warn(err));
    },
    changeMapData (i) {
      this.curLeftIndex = i;
      this.getMapData();
    }
  },
  mounted () {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: calc(100% - 92px);
  overflow: hidden;
  .left,
  .right {
    width: 350px;
    height: 100%;
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    & > div {
      margin-top: 40px;
      padding-top: 30px;
      flex: 1;
    }
  }
  .map {
    flex: 1;
  }
  .left {
    margin-left: 2%;
    .run-nums-block {
      cursor: pointer;
    }
    /deep/ .run-num {
      padding-top: 39px;
    }
  }
  .right {
    margin-right: 2%;
    .chart {
      height: 220px;
    }
  }
}
</style>
