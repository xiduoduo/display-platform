<template>
  <chart class="my-map-line" :options="options" :auto-resize="true"></chart>
</template>

<script>
export default {
  name: 'index',
  data () {
    return {
      options: {}
    };
  },
  props: {
    mapData: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    mapData () {
      this.setOptions();
    }
  },
  methods: {
    setOptions () {
      this.options = {
        animation: false,
        color: ['#c8ca12', '#f4ffcb', '#fff'],
        legend: {
          show: false,
          data: ['弱', '中', '强'],
          top: '5%',
          left: '5%',
          bottom: '5%',
          right: '5%',
          textStyle: {
            color: 'rgba(255, 255, 255, 0.8)'
          }
        },
        geo: {
          map: 'china',
          label: {
            normal: {
              show: false,
              textStyle: {
                color: '#4ec2db',
                fontSize: 12
              },
              z: 2
            },
            emphasis: {
              show: false,
              textStyle: {
                color: '#4ec2db',
                fontSize: 12
              }
            }
          },
          itemStyle: {
            normal: {
              areaColor: 'rgba(0, 0, 0, .08)',
              borderColor: 'rgb(65, 119, 177)',
              borderWidth: 1
            },
            emphasis: {
              areaColor: 'rgba(0, 0, 0, .08)',
              label: {
                show: false
              }
            }
          }
        },
        series: [
          {
            name: '弱',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: this.mapData.lowData || []
          },
          {
            name: '中',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: this.mapData.midData || []
          },
          {
            name: '强',
            type: 'scatter',
            coordinateSystem: 'geo',
            symbolSize: 2,
            large: true,
            largeThreshold: 1000,
            progressive: 100,
            itemStyle: {
              shadowBlur: 0,
              opacity: 1,
              shadowColor: 'blue'
            },
            data: this.mapData.highData || []
          }
        ]
      };
    }
  },
  created: function () {
    this.setOptions();
  }
};
</script>

<style scoped lang="scss">
  .my-map-line {
    width: 100%;
    height: 100%;
  }
</style>
