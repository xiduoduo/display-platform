<template>
  <NumberBlock
    block-title="驾驶行为分析（近一周）"
    block-font="operative-1"
    :number-block-theme="4"
  >
    <div class="wrapper flex">
      <div class="chart-wrapper">
        <chart
          class="chart-item"
          ref="chart"
          :options="chartOptions"
          :auto-resize="true"
        ></chart>
      </div>
      <div class="legend">
        <div
          :key="item.name"
          v-for="item in legends"
        >
          <i :style="{backgroundColor:item.backgroundColor, borderColor: item.borderColor}"></i>
          <span>{{item.name}}</span>
        </div>
      </div>
    </div>
  </NumberBlock>
</template>

<script>
import { BRAND_MAP } from '@/services/common';
import { mapGetters } from 'vuex';
const DRIVING_COLOR_MAP = {
  [BRAND_MAP.OUMAN]: {
    index: 0,
    borderColor: 'rgba(176,176,255,0.6)',
    backgroundColor: 'rgba(113,113,255,0.6)'
  },
  [BRAND_MAP.OUMAKE]: {
    index: 1,
    borderColor: 'rgba(113,246,191,0.5)',
    backgroundColor: 'rgba(34,231,44,0.5)'
  },
  [BRAND_MAP.AOLING]: {
    index: 2,
    borderColor: 'rgba(75,227,255,0.6)',
    backgroundColor: 'rgba(34,221,255,0.6)'
  },
  default: {
    index: 6,
    borderColor: 'rgba(175,227,255,0.6)',
    backgroundColor: 'rgba(34,221,255,0.6)'
  }
};
const DRIVING_MAP = {
  '粘离合': 0,
  '急刹车': 1,
  '空档滑行': 2,
  '长时间离合': 3,
  '长时间刹车': 4,
  '急加速': 5
};
export default {
  name: 'operative-driving-behavior-chart',
  props: {
    dataRef: {
      type: Object,
      default: function () {
        return {
        };
      }
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      legends: [],
      chartOptions: {}
    };
  },
  computed: {
    ...mapGetters([
      'currentPageBrand'
    ])
  },
  watch: {
    dataRef () {
      this.chartOption();
    }
  },
  methods: {
    chartOption () {
      let option = {
        animation: this.animation,
        legend: {
          show: false,
          data: []
        },
        grid: {
          containLabel: true
        },
        radar: {
          radius: '60%',
          shape: 'circle',
          name: {
            show: true,
            textStyle: {
              fontSize: 12,
              color: '#fff',
              backgroundColor: 'transparent'
            }
          },
          indicator: [],
          axisLine: {
            lineStyle: {
              color: 'rgba(255, 255, 255, .1)'
            }
          },
          axisTick: {
            show: false,
            length: 3,
            alignWithLabel: true,
            lineStyle: {
              color: '#fff',
              opacity: '.4'
            }
          },
          splitLine: {
            lineStyle: {
              color: 'rgba(255,255,255,0.1)'
            }
          },
          splitArea: {
            areaStyle: {
              color: 'transparent'
            }
          }
        },
        series: [{
          type: 'radar',
          // areaStyle: {normal: {}},
          data: []
        }]
      };
      if (this.currentPageBrand) {
        // let indicatorMap = {};
        this.getLeg();
        let datas = [];
        let tempData;
        let brandColor;
        let isAllBrand = this.currentPageBrand.name === BRAND_MAP.ALL;
        let currentPageBrandName = this.currentPageBrand.name;
        Object.keys(this.dataRef).forEach(name => {
          let ci = this.dataRef[name];
          if ((isAllBrand && !DRIVING_COLOR_MAP[name]) || (!isAllBrand && name !== currentPageBrandName)) return;
          brandColor = DRIVING_COLOR_MAP[name] || DRIVING_COLOR_MAP.default;
          tempData = {
            value: Object.keys(DRIVING_MAP).map(e => 0),
            name: name,
            lineStyle: {
              color: brandColor.borderColor
            },
            areaStyle: {
              color: brandColor.backgroundColor
            },
            symbol: 'none'
          };
          ci.forEach(cj => {
            if (DRIVING_MAP[cj.name] != null) {
              tempData.value[DRIVING_MAP[cj.name]] = cj.count;
            }
          });
          if (isAllBrand) {
            datas[DRIVING_COLOR_MAP[name]['index']] = tempData;
          } else {
            datas[0] = tempData;
          }
        });
        option.series[0].data = datas;
        Object.keys(DRIVING_MAP).forEach(n => {
          option.radar.indicator[DRIVING_MAP[n]] = { name: n };
        });
      }
      // console.info(JSON.stringify(option));
      this.chartOptions = JSON.parse(JSON.stringify(option));
    },
    getLeg () {
      if (this.currentPageBrand) {
        let isAllBrand = this.currentPageBrand.name === BRAND_MAP.ALL;
        let legends = [];
        if (isAllBrand) {
          Object.keys(DRIVING_COLOR_MAP).forEach(name => {
            if (name !== 'default') {
              legends.push({
                name: name,
                borderColor: DRIVING_COLOR_MAP[name].borderColor,
                backgroundColor: DRIVING_COLOR_MAP[name].backgroundColor
              });
            }
          });
        } else {
          legends.push({
            name: this.currentPageBrand.name,
            borderColor: DRIVING_COLOR_MAP[this.currentPageBrand.name].borderColor,
            backgroundColor: DRIVING_COLOR_MAP[this.currentPageBrand.name].backgroundColor
          });
        }
        this.legends = legends;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 249px;

  div.chart-wrapper {
    flex: 1;
    height: 80%;
    margin-top: 5%;

    .chart-item {
      width: 100%;
      height: 100%;
    }
  }

  .legend {
    width: 68px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 90%;
    margin: 0 10px 0 8px;
    div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      margin-top: 9px;
      &:first-child {
        margin-top: 0;
      }
      i {
        display: block;
        width: 12px;
        height: 12px;
        margin-right: 8px;
        border-width: 2px;
        border-style: solid;
      }
      span {
        color: rgba(255, 255, 255, 0.5);
        font-size: 12px;
      }
    }
  }
}
</style>
