<template>
  <NumberBlock
    :blockTitle="blockTitle"
    block-font="logistics-3"
    :number-block-theme="4"
  >
    <div class="wrapper">
      <div class="chart-wrapper">
        <chart
          class="chart-item"
          ref="orderTrendChart"
          :options="orderTrendChartOption"
          :auto-resize="true"
        ></chart>
      </div>
      <div class="legend">
        <span :style="getColor.style">{{getColor.legend[0]}}</span>
        <span>{{getColor.legend[1]}}</span>
      </div>
    </div>
  </NumberBlock>
</template>

<script>
import { graphic } from 'echarts/lib/export';
const WEEKS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
export default {
  name: 'logistic-trend',
  props: {
    blockTitle: {
      type: String,
      default: '运单走势（近一周）'
    },
    themeOption: {
      type: Object,
      default: () => {}
    },
    dataRef: {
      type: Object,
      default: function () {
        return {
          'startTrend': {
          },
          'endTrend': {
          }
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
    };
  },
  computed: {
    getColor () {
      // lengend背景颜色
      let newData = Object.assign({
        legend: ['已发车', '已到达'],
        lineColor: '#20254b',
        splitLineColor: '#20254b',
        LinearGradient: ['#243973', '#071039'],
        circleColor: '#ff5736',
        seriesItemColor: '#3f74d5'
      }, this.themeOption);
      return {
        legend: newData.legend,
        style: {
          'backgroundColor': newData.seriesItemColor
        }
      };
    },
    orderTrendChartOption () {
      let result = this.dataRef;
      let option;
      let weeks = [];

      let data1 = [];
      let data2 = [];

      let startData = [];
      let endData = [];
      let newOptions = Object.assign({
        lineColor: '#20254b',
        splitLineColor: '#20254b',
        LinearGradient: ['#243973', '#071039'],
        circleColor: '#ff5736',
        seriesItemColor: '#3f74d5'
      }, this.themeOption);

      for (let k in result.startTrend) {
        startData.push({
          date: k,
          dateNumber: Number(k.replace(/-/g, '')),
          value: result.startTrend[k]
        });
        endData.push({
          date: k,
          dateNumber: Number(k.replace(/-/g, '')),
          value: result.endTrend[k]
        });
      }

      startData.sort(function (a, b) { return a.dateNumber - b.dateNumber; });
      endData.sort(function (a, b) { return a.dateNumber - b.dateNumber; });

      for (var i = 0, ci; i < startData.length; i++) {
        ci = startData[i];
        weeks.push(WEEKS[(new Date(ci.date.replace(/-/g, '/'))).getDay()]);
        data1.push(ci.value);
        data2.push(endData[i].value);
      }

      option = {
        animation: this.animation,
        tooltip: {
          trigger: 'axis',
          padding: 5
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: WEEKS,
          axisLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, .5)'
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: newOptions.splitColor
            }
          },
          axisTick: {
            lineStyle: {
              color: newOptions.lineColor
            }
          },
          axisLine: {
            lineStyle: {
              color: newOptions.lineColor,
              width: 2
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            fontSize: 12,
            color: 'rgba(255, 255, 255, .5)'
          },
          splitLine: {
            show: false
          },
          axisTick: {
            lineStyle: {
              color: newOptions.lineColor
            }
          },
          axisLine: {
            lineStyle: {
              color: newOptions.lineColor,
              width: 2
            }
          }
        },
        grid: {
          top: 20,
          left: 50,
          bottom: 30
        },
        series: [{
          symbol: 'circle',
          name: '已发车',
          data: [],
          type: 'line',
          lineStyle: {
            color: newOptions.seriesItemColor
          },
          itemStyle: {
            color: newOptions.seriesItemColor
          },
          areaStyle: {
            normal: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [{
                offset: 0,
                color: newOptions.LinearGradient[0]
              }, {
                offset: 1,
                color: newOptions.LinearGradient[1]
              }])
            }
          }
        }, {
          symbol: 'circle',
          name: '已到达',
          data: [],
          type: 'line',
          itemStyle: {
            color: newOptions.circleColor
          },
          lineStyle: {
            color: newOptions.circleColor
          },
          areaStyle: {
            opacity: 0
          }
        }]
      };

      option.xAxis.data = weeks;
      option.series[0].data = data1;
      option.series[1].data = data2;
      return option;
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 226px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 20px 16px 20px;

  div.chart-wrapper {
    width: 100%;
    flex: 1;

    .chart-item {
      width: 100%;
      height: 100%;
    }
  }

  div.legend {
    text-align: center;
    height: 24px;
    line-height: 24px;

    span {
      width: 56px;
      height: 18px;
      display: inline-block;
      margin-right: 22px;
      line-height: 18px;
      text-align: center;
      color: white;
      font-size: 12px;
      border-radius: 2px;

      &:first-child {
        background-color: #3f74d5;
      }
      &:last-child {
        background-color: #ff5736;
      }
    }
  }
}
</style>
