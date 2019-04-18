<template>
  <chart :auto-resize="true" :options="options" class="my-bar"></chart>
</template>

<script>
/**
 * setData: {
 *  title: '', // 标题
 *  legendIcon: 'circle', // legend 配置icon
 *  legendIconWidth: 20,
 *  legendIconHeight: 10,
 *  legendAlign: 'right',
 *  legendRight: 10,
 *  legendTop: '34%',
 *  legendTextColor: '#ccc',
 *  radius: '75%', // 是饼''/还是环['', '']
 *  center: ['34%', '58%'], // 位置
 *  data: [] // data: [{name: '', value: [12,11,8,9]}...]
 * }
 */
import radarImg from './img/radar-sy.png';
export default {
  name: 'index',
  data () {
    return {
      options: {}
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
      let setData = Object.assign({
        animation: this.animation,
        title: '',
        showLegend: false,
        legendIcon: 'circle',
        legendIconWidth: 20,
        legendIconHeight: 10,
        legendAlign: 'right',
        legendRight: 10,
        legendTop: '34%',
        legendTextColor: '#ccc',
        radius: '55%',
        center: ['50%', '59%'],
        shapeType: 'polygon',
        colors: ['#e78f09'],
        tooltip: false,
        data: [{}]
      }, this.setData);
      // legend的data
      let legendData = [];
      if (setData.showLegend) {
        legendData = setData.data.map(ele => {
          return {
            name: ele.name,
            icon: setData.legendIcon
          };
        });
      }
      let valueData = [];
      let indicatorData = setData.data.map(ele => {
        let data = Object.values(ele.indicator);
        valueData.push(...data);
        return {
          name: ele.name || '',
          value: data
        };
      });
      // let MaxIndicator = valueData.length ? Math.max(...valueData) : 0;
      let indicators = Object.keys(setData.data[0].indicator).map(ele => {
        return {
          name: ele
          // max: MaxIndicator + 100
        };
      });
      this.options = {
        animation: setData.animation,
        tooltip: {
          show: setData.tooltip,
          trigger: 'item',
          position: 'right',
          textStyle: {
            fontSize: 8
          }
        },
        color: setData.colors,
        legend: {
          show: setData.showLegend,
          orient: 'vertical',
          // left: 'center',
          right: setData.legendRight,
          top: setData.legendTop,
          align: setData.legendAlign,
          itemWidth: setData.legendIconWidth,
          itemHeight: setData.legendIconHeight,
          textStyle: {
            color: setData.legendTextColor,
            fontSize: 12
          },
          data: legendData
        },
        radar: {
          shape: setData.shapeType,
          radius: setData.radius,
          center: setData.center,
          splitNumber: 10,
          nameGap: 10,
          name: {
            formatter: (val) => {
              return val.length > 4 ? `${val.substr(0, 3)}\n${val.substr(3)}` : val;
            },
            textStyle: {
              color: '#ccc'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#102c6e',
              opacity: 1,
              width: 1
            }
          },
          splitArea: {
            show: false
          },
          axisLine: {
            show: false
          },
          indicator: indicators.length > 0 ? indicators : [{
            name: '',
            max: 6000
          }]
        },
        series: [
          {
            name: '',
            type: 'radar',
            symbol: `image://${radarImg}`,
            symbolSize: 10,
            // areaStyle: {normal: {}},
            data: indicatorData.length > 0 ? indicatorData : [{value: 1, name: ''}]
          }]
      };
      // console.log(this.options);
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
  .my-bar {
    width: 100%;
    height: 100%;
  }
</style>
