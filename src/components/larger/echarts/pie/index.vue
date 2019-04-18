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
 *  legendTextFormatter: 'normal' // normal 表示默认， 不传或者其他 则使用配置的formatter
 *  legendTop: '34%',
 *  legendTextColor: '#ccc',
 *  radius: '75%', // 是饼''/还是环['', '']
 *  center: ['34%', '58%'], // 位置
 *  colors: [], // 圆环个角度色值
 *  data: [] // data: [{name: '', value: 12}]
 * }
 */
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
        startAngle: 90,
        legendIcon: 'circle',
        legendIconWidth: 20,
        legendIconHeight: 10,
        legendAlign: 'right',
        legendRight: 10,
        legendTop: '22%',
        legendTextColor: '#ccc',
        radius: '62%',
        center: ['34%', '58%'],
        colors: [],
        data: [],
        tooltip: false
      }, this.setData);
      // legend的data
      let legendData = setData.data.map(ele => {
        return {
          name: ele.name,
          icon: setData.legendIcon
        };
      });
      this.options = {
        animation: setData.animation,
        title: {
          text: setData.title,
          x: 'center',
          textStyle: {
            color: '#fff',
            fontWeight: 'normal',
            fontSize: 10
          }
        },
        tooltip: {
          show: setData.tooltip,
          trigger: 'item',
          formatter: '{b} : <br/> {c} ({d}%)',
          position: ['45%', 10],
          textStyle: {
            fontSize: 8
          }
        },
        legend: {
          orient: 'vertical',
          // left: 'center',
          itemGap: 5,
          right: setData.legendRight,
          top: setData.legendTop,
          align: setData.legendAlign,
          itemWidth: setData.legendIconWidth,
          itemHeight: setData.legendIconHeight,
          textStyle: {
            color: setData.legendTextColor,
            fontSize: 12
          },
          formatter: (val) => {
            if (setData.legendTextFormatter === 'normal') {
              return val;
            }
            return val.length > 5 ? val.substr(0, 5) + '...' : val;
          },
          data: legendData
        },
        series: [
          {
            name: '',
            type: 'pie',
            clockwise: true,
            startAngle: setData.startAngle,
            radius: setData.radius,
            center: setData.center,
            label: {
              normal: {
                show: false,
                position: 'center'
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            color: setData.colors,
            data: setData.data
          }
        ]
      };
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
