<template>
  <NumberBlock
    class="speed-chart"
    block-title="运行速度区间（近一周）"
    block-font="operative-2"
    :number-block-theme="1">
    <Bar :setData="speedData" :animation="animation"/>
  </NumberBlock>
</template>

<script>
import Bar from '@/components/larger/echarts/bar';

export default {
  name: 'operative-speed-range-chart',
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
    height: 256px;
  }
</style>
