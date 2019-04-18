<template>
  <div class="wrapper">
    <RunNum
      class="wrapper-num"
      v-for="(item, i) in dataRefs"
      :key="i"
      :runData="item"
    />
  </div>
</template>

<script>

export default {
  name: 'operative-summary',
  data () {
    return {
      runSummaryData: [
        {
          title: '今日运行车辆：',
          num: 0,
          big: true
        }
      ]
    };
  },
  props: {
    dataRef: {
      type: Number,
      default: 0
    }
  },
  computed: {
    dataRefs () {
      let data = Object.assign({}, this.runSummaryData);
      data[0].num = this.dataRef;
      return JSON.parse(JSON.stringify(data));
    }
  }
};
</script>

<style scoped lang="scss">
  .wrapper {
    display: flex;
    flex-direction: column;

    label {
      color: white;
      font-size: 24px;
    }

    & > div {
      & > div {
        margin-top: 22px;
      }
    }
    /deep/ .run-num-title {
      text-align: left !important;
    }
  }
</style>
