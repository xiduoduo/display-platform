<template>
  <div class="my-bar-con">
    <chart class="my-bar" ref="barChart" :options="options" :auto-resize="true"></chart>
    <p ref="xKey" class="x-key flex justify-align-center" v-if="setData.xDataTime">
      <span v-if="barText.left">{{barText.left}}</span>
      <i class="line-dash"></i>
      <span v-if="barText.mid">{{barText.mid}}</span>
      <i class="line-dash"></i>
      <span v-if="barText.right">{{barText.right}}</span>
    </p>
  </div>
</template>

<script>
/**
 * // 是否执行动画
 * animation: true, true/false,
 * // 基础配置
 * setData: {
 *  xData: [], // x轴数据
 *  yData: [{ // y轴数据
 *      name: '',
 *      color?: '', // bar颜色
 *      data: [],
 *      showLabel: false // 是否显示数值
 *  }],
 *  yMin: false, // 是否以最小值为起点
 *  xRotate: 0, x轴文字旋转
 *  lineData: [{ // 线数据
 *      name: '',
 *      color?: '',  // 线颜色
 *      data: [{}, {}],
 *      smooth: true, // 缓冲线/折线
 *      linearGradient?: [] // 线下部覆盖渐变颜色
 *      showLabel: false // 是否显示数值
 *  }],
 *  legend: {},
 *  markPoint: {  // 是否显示最大值、最小值、平均值
 *      avg: false, // 只显示 平均值
 *      show: false,
 *      name: '实时在线车辆' // tooltip时，显示的名称
 *  }
 *  yName: '',                // y轴名称
 *  lineYName: '',             // 线y轴名称
 *  barColor: ['#3398DB'],      // bar颜色/数组/多个值就是渐变色
 *  xBoundaryGap: true  // 是否靠0点绘图
 *  interval: true // x轴-是否显示全部数据
 * }
 */
import { graphic } from 'echarts/lib/export';
import pointPng from '@/assets/img/point.png';

export default {
  name: 'index',
  data () {
    return {
      options: {},
      barText: {}
    };
  },
  props: {
    setData: {
      type: Object,
      default: () => ({})
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    setData () { // 监测数据变化，重新渲染echarts
      this.setOptions();
    },
    animation () { // 监测数据变化，重新渲染echarts
      this.setOptions();
    }
  },
  methods: {
    setOptions () {
      let position = 'auto';
      // 初始化配置项数据
      // let colors = {
      //   nameColor: '#ccc',
      //   lineColor: '#132667',
      //   textColor: '#ccc',
      //   splitColor: '#132667'
      // };
      let setData = Object.assign({
        tooltipUnitFormatter: '',
        XshowYear: false,
        animation: this.animation,
        yMin: false,
        xName: '',
        xData: [],
        xDataTime: false,
        yData: [],
        lineData: [],
        yName: '',
        lineYName: '',
        legend: {},
        barColor: ['#3398DB'],
        xRotate: 0,
        yLabel: true,
        lLabel: true,
        nameColor: '#ccc',
        lineColor: '#132667',
        textColor: '#ccc',
        textXColor: '#ccc',
        splitColor: '#132667',
        left: '3%',
        right: '3%',
        top: '6%',
        bottom: '6%',
        xBoundaryGap: true,
        tooltip: true,
        markLine: false,
        interval: true
      }, this.setData);
      if (setData.yData.length === 0) { // 如果bar无数据，那么可能是线
        position = 'left';
      }
      // bar 线性渐变颜色/颜色计算
      let barLGColorLen = setData.barColor.length;
      let barLGColor = [];
      if (barLGColorLen > 1) {
        barLGColor = setData.barColor.map((ele, i) => {
          return {
            offset: barLGColorLen === (i + 1) ? 1 : parseFloat(Math.round(1 / (barLGColorLen - 1) * 10).toFixed(1)) /
              10 * i,
            color: ele
          };
        });
        setData.barLinearGradient = new graphic.LinearGradient(0, 0, 0, 1, barLGColor);
      } else {
        setData.barLinearGradient = setData.barColor[0];
      }
      let bars = this.getData(setData.yData, 'bar', setData.barLinearGradient);
      let lines = this.getData(setData.lineData, 'line');
      let series = bars.concat(lines);
      // legend-name
      let barNames = setData.yData.map(ele => ele.name);
      let lineNames = setData.lineData.map(ele => ele.name);
      let interval = setData.interval ? 'auto' : 0;
      // let interval = 0;
      if (setData.xDataTime) {
        let len = setData.xData.length;
        let mid = setData.xData[Math.floor(len / 2)];
        if (len === 0) {
          this.barText = {};
        } else if (len === 1) {
          this.barText = {
            mid: setData.xData[0]
          };
        } else if (len === 2) {
          this.barText = {
            left: setData.xData[0],
            right: setData.xData[1]
          };
        } else {
          this.barText = {
            left: setData.xData[0],
            mid,
            right: setData.xData[len - 1]
          };
        }
        setData.textXColor = 'rgba(0, 0, 0, 0)';
        // setData.bottom = '13%';
      }
      // echarts 配置项
      this.options = {
        animation: setData.animation,
        legend: {
          data: barNames.concat(lineNames),
          show: setData.legend.show || false,
          icon: setData.legend.icon || '',
          itemWidth: setData.legend.width || 15,
          itemHeight: setData.legend.height || 8,
          itemGap: 10,
          left: setData.legend.left || 'center',
          top: setData.legend.top || 'auto',
          right: setData.legend.right || 'auto',
          bottom: setData.legend.bottom || '0',
          orient: setData.legend.orient || 'horizontal',
          textStyle: {
            fontSize: 10,
            color: '#ccc'
          }
        },
        textStyle: {
          color: setData.nameColor
        },
        tooltip: {
          show: setData.tooltip,
          trigger: 'axis',
          formatter: function (v, index) {
            let val = v[0];
            // 圆点色值
            let color = val.color && val.color.colorStops ? val.color.colorStops[0].color : val.color;
            // 圆点
            let $span = `<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color: ${color};"></span>${val.seriesName}`;
            // 返回文字
            return setData.tooltipUnitFormatter ? `${val.name}${setData.tooltipUnitFormatter}<br/>${$span}:${val.value}` : `${val.name}<br/>${$span}:${val.value}`;
          },
          textStyle: {
            fontSize: 10,
            color: '#ccc'
          }
        },
        grid: {
          left: setData.left,
          right: setData.right,
          bottom: setData.bottom,
          top: setData.top,
          containLabel: true
        },
        xAxis: [
          {
            name: setData.xName,
            type: 'category',
            boundaryGap: setData.xBoundaryGap,
            data: setData.xData,
            axisTick: {
              alignWithLabel: true
            },
            axisLine: {
              lineStyle: {
                color: setData.lineColor
              }
            },
            axisLabel: {
              interval,
              fontSize: 10,
              rotate: setData.xRotate,
              color: setData.textXColor,
              formatter: function (v, index) {
                if (index !== 0 && v === '1' && setData.XshowYear) {
                  return v + '\n' + new Date().getFullYear() + '年';
                } else {
                  return v;
                }
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            name: setData.yName,
            show: setData.yData.length > 0 ? Boolean(true) : Boolean(false),
            axisLine: {
              lineStyle: {
                color: setData.lineColor
              }
            },
            axisLabel: {
              margin: 10,
              fontSize: 10,
              color: setData.textColor,
              show: setData.yLabel
            },
            splitLine: {
              lineStyle: {
                color: setData.splitColor
              }
            }
          },
          {
            type: 'value',
            min: (value) => {
              return setData.yMin ? value.min : 0;
            },
            name: setData.lineYName,
            show: setData.lineData.length > 0 ? Boolean(true) : Boolean(false),
            axisLine: {
              lineStyle: {
                color: setData.lineColor
              }
            },
            axisLabel: {
              margin: 10,
              fontSize: 10,
              color: setData.textColor,
              show: setData.lLabel
            },
            splitLine: {
              lineStyle: {
                color: setData.splitColor
              }
            },
            position
          }
        ],
        series
      };
    },
    getData (data = {}, type = '', barColor) {
      let len = data.length;
      let newData = [];
      if (len) {
        newData = data.map(ele => {
          let markPoint = this.setData.markPoint || {};
          let markLine = {};
          if (type === 'line' && markPoint.show) {
            if (this.setData.markLine) {
              markLine = {
                name: '',
                data: [
                  {
                    type: 'average',
                    name: '平均值',
                    valueIndex: 0,
                    symbol: 'none',
                    lineStyle: {
                      color: '#fda72b',
                      type: 'dotted'
                    },
                    label: {
                      show: false
                    }
                  }
                ]
              };
            }
            let markData = [];
            if (!this.setData.markPoint.avg) {
              markData = [
                {type: 'max', name: '最大值'},
                {type: 'min', name: '最小值'},
                {type: 'average', name: '平均值'}
              ];
            } else {
              markData = [
                // {type: 'max', name: '最大值'},
                // {type: 'min', name: '最小值'},
                {type: 'average', name: '平均值'}
              ];
            }
            markPoint = {
              symbol: `image://${pointPng}`,
              symbolSize: function (val) {
                let w = (val[2] + '').length * 6;
                return [w, 28];
              },
              symbolOffset: [0, -15],
              label: {
                show: true,
                normal: {
                  formatter: function (param) {
                    return `${param.value}`;
                  },
                  color: '#fff'
                }
              },
              tooltip: {
                show: true, // 是否显示
                formatter: `${markPoint.name ? markPoint.name + '<br/>' : ''}{b}：{c}`, // 内容格式器 a（系列名称），b（类目值），c（数值）, d（无）
                trigger: 'item' // 触发类型，默认数据触发，见下图，可选为：'item' | 'axis'
              },
              data: markData
            };
          }
          if (type === 'line' && ele.linearGradient) {
            let areaStyle = {
              normal: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: ele.linearGradient[0]
                  }, {
                    offset: 1,
                    color: ele.linearGradient[1]
                  }], false)
                // shadowColor: 'rgba(0, 0, 0, 1)',
                // shadowBlur: 10
              }
            };
            return {
              name: ele.name,
              type,
              yAxisIndex: type === 'line' ? 1 : 0,
              data: ele.data,
              itemStyle: {
                normal: {
                  color: !barColor ? ele.color : barColor
                }
              },
              label: {
                normal: {
                  show: ele.showLabel || false,
                  position: 'top'
                }
              },
              markPoint,
              markLine,
              areaStyle,
              smooth: ele.smooth || true
            };
          }
          return {
            name: ele.name,
            type,
            barWidth: 16,
            label: {
              normal: {
                show: ele.showLabel || false,
                position: 'top'
              }
            },
            yAxisIndex: type === 'line' ? 1 : 0,
            data: ele.data,
            itemStyle: {
              normal: {
                color: !barColor ? ele.color : barColor
              }
            },
            markPoint,
            smooth: ele.smooth || true
          };
        });
      }
      return newData;
    }
  },
  mounted: function () {
    let _self = this;
    let timer = setTimeout(() => {
      clearTimeout(timer);
      _self.setOptions();
    }, 30);
  }
};
</script>

<style scoped lang="scss">
  .my-bar-con {
    position: relative;

    .x-key {
      position: absolute;
      left: 10%;
      bottom: 16px;
      width: 80%;

      & > span {
        font-size: 10px;
        color: #ccc;
      }

      .line-dash {
        flex: 1;
        border-bottom: 1px dashed #ccc;
      }
    }
  }

  .my-bar, .my-bar-con {
    width: 100%;
    height: 100%;
  }
</style>
