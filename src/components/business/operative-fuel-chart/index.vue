<template>
  <NumberBlock
    class="speed-chart"
    :blockTitle="blockTitle"
    block-font="operative-3"
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
    blockTitle: {
      type: String,
      default: '行驶油耗分析（近一周）'
    },
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
