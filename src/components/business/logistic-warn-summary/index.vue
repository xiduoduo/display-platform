<template>
  <NumberBlock class="run-nums-block"
               :theme="2"
               :blockTitle="`累计风险预警`"
               :blockFont="`logistics-1`">
    <div class="run-num">
      <RunNum
        v-for="(item, i) in runCurrentData"
        :key="i"
        :runData="item"
      />
    </div>
  </NumberBlock>
</template>

<script>
export default {
  name: 'logistic-warn-summary',
  data () {
    return {
      runCurrentData: [
        {
          title: '未及时起运：',
          num: 0,
          line: true
        },
        {
          title: '未及时到达：',
          num: 0,
          line: true
        },
        {
          title: '里程未过半：',
          num: 0,
          line: true
        },
        {
          title: '里程异常：',
          num: 0,
          line: true
        }
      ]
    };
  },
  props: {
    dataRef: {
      type: Object,
      default: function () {
        return {
          startDelayCount: 0,
          arrivedDelayCount: 0,
          noHalfWayCount: 0,
          exceptionalWayCount: 0
        };
      }
    }
  },
  watch: {
    dataRef () {
      let data = Object.assign({}, this.runCurrentData);
      data[0].num = this.dataRef.startDelayCount;
      data[1].num = this.dataRef.arrivedDelayCount;
      data[2].num = this.dataRef.noHalfWayCount;
      data[3].num = this.dataRef.exceptionalWayCount;
      this.runCurrentData = JSON.parse(JSON.stringify(data));
    }
  }
};
</script>

<style scoped lang="scss">
  .run-nums-block {
    height: 236px;
  }
</style>
