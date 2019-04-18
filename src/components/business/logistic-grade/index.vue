<template>
  <NumberBlock class="run-nums-block"
               :theme="4"
               block-font="logistics-2"
               :blockTitle="`累计运输评价`">
    <div class="wrapper">
      <div>
        <chart
          class="chart-item"
          ref="transportEvaluationAllChart"
          :options="transportEvaluationAllChartOption"
          :auto-resize="true"
        ></chart>
        <div class="legend">
          <span
            :class="classObj(i)"
            :key="i"
            v-for="(item, i) in transportEvaluationAllChartOption.series[0].data"
            :style="{ color: item.itemStyle.color }"
          >{{item.value}}%</span>
        </div>
      </div>
      <div>
        <chart
          class="chart-item"
          ref="transportEvaluationTimeChart"
          :options="transportEvaluationTimeChartOption"
          :auto-resize="true"
        ></chart>
        <div class="legend">
          <span
            :class="classObj(i)"
            :key="i"
            v-for="(item, i) in transportEvaluationTimeChartOption.series[0].data"
            :style="{ color: item.itemStyle.color }"
          >{{item.value}}%</span>
        </div>
      </div>
      <div>
        <chart
          class="chart-item"
          ref="transportEvaluationMileageChart"
          :options="transportEvaluationMileageChartOption"
          :auto-resize="true"
        ></chart>
        <div class="legend">
          <span
            :class="classObj(i)"
            :key="i"
            v-for="(item, i) in transportEvaluationMileageChartOption.series[0].data"
            :style="{ color: item.itemStyle.color }"
          >{{item.value}}%</span>
        </div>
      </div>
    </div>
  </NumberBlock>
</template>

<script>

const getOption = () => {
  return {
    title: {
      left: 'center',
      top: 13,
      textStyle: {
        color: '#ffffff',
        fontSize: 14,
        align: 'center',
        fontWeight: 'normal'
      }
    },
    tooltip: {
      show: false
    },
    legend: {
      show: true,
      orient: 'vertical',
      top: '60%',
      left: 'center',
      right: 'center',
      itemWidth: 5,
      data: [
        { name: '60分以下', icon: 'circle', textStyle: { color: '#919db5', fontSize: 10 } },
        { name: '60-80分', icon: 'circle', textStyle: { color: '#919db5', fontSize: 10 } },
        { name: '80-100分', icon: 'circle', textStyle: { color: '#919db5', fontSize: 10 } }
      ]
    },
    grid: {

    },
    series: [{
      name: '访问来源',
      type: 'pie',
      radius: ['58%', '72%'],
      center: ['50%', '39%'],
      label: {
        show: false
      },
      data: []
    }]
  };
};

export default {
  name: 'logistic-grade',
  props: {
    dataRef: {
      type: Object,
      default: function () {
        return {
          'TIMEUNDER': '0%',
          'MILEAGEUNDER': '0%',
          'MILEAGEMIDDLE': '0%',
          'MIDDLEGREATER': '0%',
          'SUMMARYUNDER': '0%',
          'SUMMARYMIDDLE': '0%',
          'TIMEGREATER': '0%',
          'SUMMARYGREATER': '0%',
          'TIMEMIDDLE': '0%'
        };
      }
    },
    animation: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {};
  },
  methods: {
    classObj (i) {
      return ['font-lgdr', i === 0 ? 'under' : i === 1 ? 'middle' : 'greater'];
    }
  },
  computed: {
    gradeData () {
      let obj = {};
      Object.keys(this.dataRef).forEach(elem => {
        obj[elem] = this.dataRef[elem].replace('%', '');
      });
      return obj;
    },
    transportEvaluationAllChartOption () {
      let option = getOption();
      option.animation = this.animation;

      option.title.text = '综合评价';
      option.series[0].data = [
        { value: this.gradeData.SUMMARYUNDER, name: option.legend.data[0].name, itemStyle: { color: '#ff6159' } },
        { value: this.gradeData.SUMMARYMIDDLE, name: option.legend.data[1].name, itemStyle: { color: '#495770' } },
        { value: this.gradeData.SUMMARYGREATER, name: option.legend.data[2].name, itemStyle: { color: '#268fff' } }
      ];

      return option;
    },
    transportEvaluationTimeChartOption () {
      let option = getOption();
      option.animation = this.animation;
      option.title.text = '运输时效性';
      option.series[0].data = [
        { value: this.gradeData.TIMEUNDER, name: option.legend.data[0].name, itemStyle: { color: '#725bef' } },
        { value: this.gradeData.TIMEMIDDLE, name: option.legend.data[1].name, itemStyle: { color: '#495770' } },
        { value: this.gradeData.TIMEGREATER, name: option.legend.data[2].name, itemStyle: { color: '#e99819' } }
      ];

      return option;
    },
    transportEvaluationMileageChartOption () {
      let option = getOption();
      option.animation = this.animation;
      option.title.text = '里程合规性';
      option.series[0].data = [
        { value: this.gradeData.MILEAGEUNDER, name: option.legend.data[0].name, itemStyle: { color: '#00a8bb' } },
        { value: this.gradeData.MILEAGEMIDDLE, name: option.legend.data[1].name, itemStyle: { color: '#495770' } },
        { value: this.gradeData.MIDDLEGREATER, name: option.legend.data[2].name, itemStyle: { color: '#4bd560' } }
      ];

      return option;
    }
  }
};
</script>

<style scoped lang="scss">
.wrapper {
  height: 235px;
  display: flex;
  flex-direction: row;
  align-items: center;
  & > div {
    position: relative;
    flex: 1;
    height: 100%;

    .chart-item {
      width: 100%;
      height: 100%;
    }

    .legend {
      position: absolute;
      top: 28%;
      left: 50%;
      transform: translateX(-50%);
      width: 58px;
      span {
        color: white;
        text-align: center;
      }
      span.under {
        font-size: 16px;
        display: inline-block;
        width: 44%;
      }

      span.middle {
        font-size: 16px;
        display: inline-block;
        width: 44%;
      }

      span.greater {
        margin-top: 6px;
        font-size: 20px;
        display: block;
        width: 100%;
      }
    }
  }
}
</style>
