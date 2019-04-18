<template>
  <section class="global-part service flex">
    <div class="left animated bounceInLeft" :class="{bounceOutLeft: lever}">
      <NumberBlock
        class="left-top"
        :blockTitle="`实时车况`"
        block-font="service-1"
      >
        <div class="run-num left-top-num">
          <ServiceCar :setData="getServiceCarData" :lever="levers"/>
        </div>
      </NumberBlock>
      <NumberBlock
        class="left-btm"
        block-font="service-2"
        :blockTitle="`实时故障信息`"
      >
        <div class="run-num-line">
          <InfoLine :theme="2" :infoLineData="infoLineData" :isActived="isActived"/>
        </div>
      </NumberBlock>
    </div>
    <div class="mid animated zoomIn" :class="{zoomOut: lever}">
      <RunNum :runData="runMapData" class="mid-num"/>
      <Map :mapData="mapData" :themeOption="themeOption"/>
    </div>
    <div class="right animated bounceInRight" :class="{bounceOutRight: lever}">
      <NumberBlock
        class="right-top"
        :blockTitle="`常见故障（近30天）`"
        block-font="service-3"
        :theme="2"
      >
        <div class="right-word-cloud">
          <WordCloud :words="wordClouds" :bgColor="`#1c232b`"/>
        </div>
      </NumberBlock>
      <NumberBlock
        class="right-mid"
        :blockTitle="`报警统计Top5（近30天）`"
        block-font="service-4"
        :theme="2"
      >
        <ServiceWarn :warnData="warnData" :showNum="Boolean(true)"/>
      </NumberBlock>
      <NumberBlock
        class="right-btm"
        :blockTitle="`服务真实性分析（近30天）`"
        block-font="service-5"
        :theme="2"
      >
        <div class="run-num">
          <Progress :mapData="progressData" :legend="Boolean(true)"/>
        </div>
      </NumberBlock>
    </div>
  </section>
</template>

<script>
import {
  FACTORY_MAP,
  WARN_CODE_SERVICE,
  FAULTS_WARN,
  BRAND_MAP
} from '@/services/common';
import ZBase from '@/lib/zbase';
import { getStorage, setStorage } from '@/lib/sessionStorage';
import GetService from '@/services/energy/getService';
import { mapGetters } from 'vuex';
import Map from '@/components/larger/echarts/map';
import ServiceCar from '@/components/larger/service-car';
import WordCloud from '@/components/larger/word-cloud';
import ServiceWarn from '@/components/larger/service-warn';

export default {
  name: 'service',
  components: {
    Map,
    ServiceCar,
    WordCloud,
    ServiceWarn
  },
  data () {
    return {
      isActived: false,
      lever: false,
      runMapData: {
        title: '今日进站车辆：',
        line: true,
        num: 0,
        big: true
      },
      mapData: {},
      themeOption: {
        pointPng: this.GREEN.echarts.map.pointPng,
        geoItemStyleAreaColor: this.GREEN.echarts.map.geoItemStyleAreaColor,
        geoItemStyleBorderColor: this.GREEN.echarts.map.geoItemStyleBorderColor,
        geoItemStyleEmphasisAreaColor: this.GREEN.echarts.map.geoItemStyleEmphasisAreaColor,
        scatterLabelColor: this.GREEN.echarts.map.scatterLabelColor,
        effectLabelColor: this.GREEN.echarts.map.effectLabelColor,
        effectItemColor: this.GREEN.echarts.map.effectItemColor
      },
      wordClouds: [],
      warnData: [],
      infoLineData: [],
      levers: false,
      progressData: [],
      getServiceCarData: {}
    };
  },
  computed: {
    ...mapGetters([
      'getAnimateIndex',
      'currentPageBrand',
      'getMenuList',
      'getWebsocket_rt_fault'
    ])
  },
  watch: {
    getWebsocket_rt_fault () {
      let getWebsocketRtFault = JSON.parse(this.getWebsocket_rt_fault);
      if (!getWebsocketRtFault || !getWebsocketRtFault.data ||
        !getWebsocketRtFault.data.startTime) return;
      let _self = this;
      _self.isActived = false;
      let { startTime, carBrandName = '', carTypeName = '', lpn = '', code = 0 } = getWebsocketRtFault.data;
      // 根据车型接受数据
      if (this.currentPageBrand.name !== BRAND_MAP.ALL &&
        this.currentPageBrand.name !== carBrandName) return;
      // 渲染数据
      let time = ZBase.Date.getDateByFormat(startTime, 'HH:mm:ss');
      let newData = {
        ...getWebsocketRtFault.data,
        time,
        type: 2,
        title: carBrandName + carTypeName,
        name: code,
        lpn
      };
      // 按车型本地存储数据 -> 应用：当车型切换时，读取出来进行赋值:getInfoLineData方法
      let newStorageData = getStorage[newData.carBrandName];
      if (newStorageData) {
        newStorageData.unshift(newData);
        if (newStorageData.length > 5) {
          newStorageData.pop();
        }
        setStorage(newData.carBrandName, newStorageData);
      } else {
        let newArr = [];
        newArr.unshift(newData);
        setStorage(newData.carBrandName, newArr);
      }
      // console.log(getWebsocketRtFault.data);
      // 第一条：实时车况
      this.getServiceCarData = this.chageInfo(getWebsocketRtFault.data);
      this.levers = true;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        this.levers = false;
      }, 150);
      _self.$nextTick(() => {
        _self.isActived = true;
        this.infoLineData.unshift(newData);
        this.infoLineData.pop();
      });
    },
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
    if (to.path !== from.path && !this.getRunNumIndex) {
      this.$store.commit('UPDATE_RUN_NUM_BOOL', from.name);
    }
    this.lever = true;
    setTimeout(() => {
      next();
    }, 100);
  },
  mounted: function () {
    // this.getData();
  },
  activated: function () {
    console.log('service');
    if (this.token !== this.currentPageBrand.token) {
      this.getData();
      this.token = this.currentPageBrand.token;
    }
  },
  deactivated: function () {
    console.log('跳出service');
  },
  methods: {
    getData () {
      if (this.getMenuList.length) {
        this.getInfoLineData();
        this.getInStationCar();
        this.getFaultRanking();
        this.getAlarmRanking();
        this.getRepairByPrvRank();
      }
    },
    getInfoLineData () {
      let oneSec = 5000;
      let now = Date.now();
      let getStorageData = getStorage(this.currentPageBrand.name) || [];
      // 是否用本地存储的值
      let falseLineData = FAULTS_WARN.filter(ele => {
        // 筛选需要的数据
        if (this.currentPageBrand.name === BRAND_MAP.ALL) {
          return ele.carBrandName !== BRAND_MAP.LEISA && ele.carBrandName !== BRAND_MAP.OUMAN;
        } else {
          return this.currentPageBrand.name === ele.carBrandName;
        }
      }).sort(() => (0.5 - Math.random())).slice(0, 5).map((ele, i) => {
        // 2-3s 随机数
        let randTime = now - i * Math.floor((Math.random() * oneSec) + 1000);
        let time = ZBase.Date.getDateByFormat(randTime, 'HH:mm:ss');
        return {
          ...ele,
          time,
          type: 2,
          title: ele.carBrandName + ele.carTypeName,
          name: ele.code,
          lpn: ele.lpn
          // code: ele.code
        };
      });
      falseLineData.slice(5 - getStorageData.length || 0).concat(getStorageData);
      this.infoLineData = falseLineData;
      if (this.infoLineData[0]) {
        this.getServiceCarData = this.chageInfo(this.infoLineData[0]);
      }
    },
    chageInfo (infoLineData) {
      return { // 实时车况
        name: infoLineData.carBrandName,
        imgUrl: FACTORY_MAP[infoLineData.carBrandName].imgUrl || '',
        lpn: infoLineData.lpn || '',
        speed: infoLineData.velocity || 0,
        mileage: infoLineData.mileage || 0,
        time: infoLineData.runTimeInSeconds || 0,
        position: infoLineData.startAddress || '',
        grade: infoLineData.totalGrade || 0
      };
    },
    async getInStationCar () { // 地图数据
      let _self = this;
      let obs = await GetService.getEnergyInStationCar();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let data = res.data.data;
          let resLen = data.length;
          if (!resLen) {
            _self.runMapData = {
              title: '今日进站车辆：',
              line: true,
              num: 0,
              big: true
            };
            _self.mapData = {};
            return;
          }
          let maps = {};
          let reduce = 0;
          data.forEach(ele => {
            reduce += parseInt(ele.count);
            maps[ele.provice] = parseInt(ele.count);
          });
          _self.runMapData.num = reduce;
          _self.runMapData = JSON.parse(JSON.stringify(_self.runMapData));
          _self.mapData = JSON.parse(JSON.stringify(maps));
        }
      }, e => console.log(`service: ${e}`));
    },
    async getFaultRanking () { // 常见故障
      let _self = this;
      let obs = await GetService.getEnergyFaultRanking();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let resData = res.data.data;
          let resLen = resData.length;
          if (!resLen) {
            _self.wordClouds = [];
            return;
          }
          let getLen = Math.min(20, resLen);
          // 排序-截取部分数据-json去重
          let toHeavy = {};
          resData.sort((a, b) => b.count - a.count).slice(0, getLen + 20).forEach(ele => {
            if (!toHeavy[ele.name]) {
              toHeavy[ele.name] = ele;
            }
          });
          // 得到去重结果-截取0-20条数据
          let getHeavyData = Object.values(toHeavy).slice(0, getLen).sort((a, b) => (b.count - a.count));
          // 整理数据-赋值
          _self.wordClouds = getHeavyData.map(ele => {
            return {
              name: WARN_CODE_SERVICE[ele.code] || ele.name,
              value: ele.count || 0
            };
          });
        }
      }, e => console.log(`service: ${e}`));
    },
    async getAlarmRanking () { // 报警统计Top5
      let _self = this;
      let obs = await GetService.getEnergyAlarmRanking();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let resData = res.data.data;
          let resLen = resData.length;
          if (!resLen) {
            _self.warnData = [];
            return;
          }
          // 排序-截取部分数据
          let sliceData = resData.sort((a, b) => b.count - a.count).slice(0, 5);
          // 整理数据-赋值
          _self.warnData = sliceData.map(ele => {
            if (ele.name) {
              return {
                name: ele.name,
                value: ele.count
              };
            }
          });
        }
      }, e => console.log(`service: ${e}`));
    },
    async getRepairByPrvRank () { // 服务真实性
      let _self = this;
      let obs = await GetService.getEnergyRepairByPrvRank();
      obs.subscribe(res => {
        if (res.data.type === 'success') {
          let resData = res.data.data;
          let resLen = resData.length;
          if (!resLen) {
            _self.progressData = [];
            return;
          }
          // 排序-截取部分数据
          let sliceData = resData.sort((a, b) => Number(b.value) - Number(a.value)).slice(0, 5);
          // 整理数据-赋值
          _self.progressData = sliceData.map(ele => {
            if (ele.province) {
              let title = this.convertProvinceName(ele.province) + ' :';
              return {
                title,
                value: ele.value
              };
            }
          });
        }
      }, e => console.log(`service: ${e}`));
    },
    convertProvinceName (cityName) {
      // 改省份名
      return cityName.replace(/[省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区]/g, '');
    }
  }
};
</script>

<style scoped lang="scss">
  .service {
    .left {
      padding-top: 20px;
      width: 344px;

      .left-top {
        height: 258px;
      }

      .left-btm {
        margin-top: 15px;
        height: 590px;
      }

      .run-num-line {
        padding: 25px 0 25px 30px;
        height: 100%;
      }
    }

    .mid {
      position: relative;
      flex: 1;
      height: 960px;
      padding-top: 40px;

      .mid-num {
        position: absolute;
        left: 115px;
        top: 50px;
      }
    }

    .right {
      padding-top: 20px;
      width: 374px;

      .right-top, .right-mid, .right-btm {
        height: 280px;
      }

      .right-word-cloud {
        padding: 25px;
        height: 100%;
      }

      .right-mid {
        margin-top: 20px;
      }

      .right-btm {
        margin-top: 20px;
      }
    }
  }
</style>
