<template>
  <div class="wrapper">
    <RunNum
      v-for="(item, i) in dataRefs"
      :key="i"
      :runData="item"
    />
  </div>
</template>

<script>
export default {
  name: 'logistic-summary',
  data () {
    return {
      runSummaryData: [
        {
          title: '待发车辆：',
          num: 0,
          big: true
        },
        {
          title: '已发车辆：',
          num: 0,
          big: true
        },
        {
          title: '今日到达：',
          num: 0,
          big: true
        }
      ]
    };
  },
  props: {
    dataRef: {
      type: Object,
      default: function () {
        return {
          standbyCount: 0,
          runningCount: 0,
          arrivedCount: 0
        };
      }
    }
  },
  computed: {
    dataRefs () {
      let data = Object.assign({}, this.runSummaryData);
      data[0].num = this.dataRef.standbyCount;
      data[1].num = this.dataRef.runningCount;
      data[2].num = this.dataRef.arrivedCount;
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
    &>div{
      margin-bottom: 42px;
      &>div{
        margin-top: 22px;
      }
    }
    /deep/ .run-num-title {
      text-align: left !important;
    }
  }
</style>
