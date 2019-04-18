<template>
  <div class="kms-page-one display-flex animated bounceInRight" :class="{bounceOutLeft: lever}">
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
            :fontChange="Boolean(true)"
            :runData="{num: item.num}"
          />
        </div>
      </NumberBlock>
    </div>
    <div class="map">
      <Map :mapData="mapData" :themeOption="themeOption" :cityMapData="cityMapData"/>
    </div>
    <div class="right">
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`今日在线车辆（小时）`"
        :icon="iconOnLine"
      >
        <Bar :setData="onLineData" :animation="Boolean(false)"/>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="'ISF发动机装配走势'"
        :icon="iconTrend"
      >
        <Bar :setData="isfData" :animation="Boolean(false)"/>
      </NumberBlock>
      <NumberBlock
        class="run-nums-block"
        :theme="2"
        :blockTitle="`ISG发动机装配走势`"
        :icon="iconTrend"
      >
        <Bar :setData="isgData" :animation="Boolean(false)"/>
      </NumberBlock>
    </div>
  </div>
</template>

<script>
import iconTruck from '@/assets/img/kms/all-cars.png';
import iconOnLine from '@/assets/img/kms/online-car.png';
import iconTrend from '@/assets/img/kms/trend.png';
import Map from '@/components/larger/echarts/map';
import Bar from '@/components/larger/echarts/bar';
import getKmsPage1Service from '@/services/kms/getKmsPage1';

export default {
  name: 'index',
  metaInfo: {
    title: '福田康明斯车联网云服务中心'
  },
  components: {
    Map,
    Bar
  },
  data () {
    return {
      // left
      iconTrend,
      iconOnLine,
      leftList: [
        {
          getDataFnName: 'getDistrMapData',
          title: '总接入车辆',
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
      themeOption: {
        geoItemStyleAreaColor: 'rgba(65, 119, 177, 0.25)',
        geoItemStyleBorderColor: 'rgb(65, 119, 177)',
        geoItemStyleEmphasisAreaColor: 'rgba(65, 119, 177, 0.75)'
      },
      cityMapData: {},
      // right
      onLineData: {
        yMin: true,
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
        tooltipUnitFormatter: '月',
        XshowYear: true,
        interval: 0,
        top: '18%',
        left: '5%',
        right: '6%',
        bottom: '8%',
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
        tooltipUnitFormatter: '月',
        XshowYear: true,
        interval: 0,
        top: '18%',
        left: '5%',
        right: '6%',
        bottom: '8%',
        xData: [],
        yData: [
          {
            name: '',
            data: []
          }
        ],
        barColor: ['#1e72bb', 'rgba(30, 114, 187, 0)']
      },
      lever: false,
      closeSub: null,
      cachePage: {}
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
  activated: function () {
    this.getLeft4BlockData();
  },
  deactivated: function () {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
  },
  methods: {
    getData () {
      this.getMapData();
      // this.getLeft4BlockData();
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
          _self.cachePage.cityMapData = _self.cityMapData = JSON.parse(JSON.stringify(C));
          _self.cachePage.mapData = _self.mapData = JSON.parse(JSON.stringify(P));
        } else {
          if (_self.cachePage.cityMapData) {
            _self.cityMapData = JSON.parse(JSON.stringify(_self.cachePage.cityMapData));
          }
          if (_self.cachePage.mapData) {
            _self.mapData = JSON.parse(JSON.stringify(_self.cachePage.mapData));
          }
        }
      }, err => console.warn(err));
    },
    async getLeft4BlockData () {
      let _self = this;
      let obj = await getKmsPage1Service.getLeftData();
      _self.closeSub = obj.subscribe(res => {
        if (res.data.type === 'success') {
          let d = res.data.data;
          _self.cachePage.getLeftData = d;
          _self.$set(_self.leftList[0], 'num', d.ALLNUM);
          _self.$set(_self.leftList[1], 'num', d.ONLINENUM);
          let factorys = ['', '', 'ISF', 'ISG'];
          d.FACTORY.forEach(v => {
            let i = factorys.indexOf(v.NAME);
            if (i !== -1) {
              _self.leftList[i].num = v.NUM;
            }
          });
        } else {
          if (_self.cachePage.getLeftData) {
            let d = _self.cachePage.getLeftData;
            _self.$set(_self.leftList[0], 'num', d.ALLNUM);
            _self.$set(_self.leftList[1], 'num', d.ONLINENUM);
            let factorys = ['', '', 'ISF', 'ISG'];
            d.FACTORY.forEach(v => {
              let i = factorys.indexOf(v.NAME);
              if (i !== -1) {
                _self.leftList[i].num = v.NUM;
              }
            });
          }
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
          _self.cachePage.getRightOnLineData = _self.onLineData = JSON.parse(JSON.stringify(_self.onLineData));
        } else {
          if (_self.cachePage.getRightOnLineData) {
            _self.onLineData = JSON.parse(JSON.stringify(_self.cachePage.getRightOnLineData));
          }
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
          _self.cachePage.getRightISFData = _self.isfData = JSON.parse(JSON.stringify(_self.isfData));
        } else {
          if (_self.cachePage.getRightISFData) {
            _self.isfData = JSON.parse(JSON.stringify(_self.cachePage.getRightISFData));
          }
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
          _self.cachePage.getRightISGData = _self.isgData = JSON.parse(JSON.stringify(_self.isgData));
        } else {
          if (_self.cachePage.getRightISGData) {
            _self.isgData = JSON.parse(JSON.stringify(_self.cachePage.getRightISGData));
          }
        }
      }, err => console.warn(err));
    },
    changeMapData (i) {
      this.curLeftIndex = i;
      this.getMapData();
    }
  }
};
</script>

<style scoped lang="scss">
  .kms-page-one {
    padding-top: 40px;
    .map {
      flex: 1;
      padding: 30px;
    }

    .left {
      width: 315px;
      margin-left: 2%;

      .run-nums-block {
        cursor: pointer;
        height: 180px;
        margin-bottom: 49px;
      }

      /deep/ .run-num {
        padding-top: 39px;
      }
    }

    .right {
      width: 390px;
      margin-right: 2%;

      .run-nums-block {
        height: 270px;
        margin-bottom: 30px;
      }
    }
  }
</style>
