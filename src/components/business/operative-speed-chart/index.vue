<template>
  <NumberBlock
    class="speed-chart"
    block-title="行驶速度分析（近一周）"
    block-font="operative-4"
    :theme="10">
    <Bar :setData="speedData" :animation="animation"/>
  </NumberBlock>
</template>

<script>
import Bar from '@/components/larger/echarts/bar';

export default {
  name: 'operative-mileage-chart',
  components: {
    Bar
  },
  props: {
    speedData: {
      type: Object,
      default: () => {}
    },
    animation: {
      type: Boolean,
      default: true
    }
  }
};
</script>

<style scoped lang="scss">
  .speed-chart {
  }
</style>
