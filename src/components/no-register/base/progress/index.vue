<template>
  <div class="progress-all" v-if="getMapData" :class="{'info-legend': legend}">
    <div class="progress-content flex justify-align-center"
         :key="i"
         v-for="(item, i) in getMapData">
      <span class="title" :style="`width: ${titleWidth}px`">{{item.title}}</span>
      <div class="progress-react">
        <span class="progress" :style="`width: ${item.value}%`"></span>
      </div>
      <span class="font-lgdr num">{{item.value}}%</span>
    </div>
    <p class="info" v-show="getMapData.length > 0" v-if="legend">
      <span class="info-item"><i></i>当月服务单</span>
      <span class="info-item"><i></i>真实服务单</span>
    </p>
  </div>
  <div class="progress-content flex justify-align-center" v-else>
    <span class="title">{{title}}</span>
    <div class="progress-react">
      <span class="progress" :style="`width: ${value}%`"></span>
    </div>
    <span class="font-lgdr num">{{value}}%</span>
  </div>
</template>

<script>
/**
 * legend: false
 * mapData: 循环数组
 *  [{
 *      title: '',
 *      value: 30
 *  }]
 * oneData: 一条数据/不循环
 *  {
 *      title: '',
 *      value: 30
 *  }
 */
export default {
  name: 'index',
  props: {
    legend: {
      type: Boolean,
      default: false
    },
    mapData: {
      type: Array,
      default: () => []
    },
    oneData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getMapData () {
      return this.mapData || [];
    },
    titleWidth () {
      let maxLen = Math.max(...this.mapData.map(ele => ele.title.length));
      if (this.mapData) {
        return maxLen * 14;
      } else {
        return this.oneData.title.length * 14;
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .progress-all {
    position: relative;
    &.info-legend {
      padding-bottom: 25px;
      .info {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 10px;
        text-align: center;
        .info-item {
          display: inline-block;
          vertical-align: middle;
          color: rgba(255,255,255,.5);
          font-size: 12px;
          margin-right: 15px;
          &:nth-of-type(2) {
            i {
              background-color: #5bc0d2;
            }
          }
          i {
            display: inline-block;
            vertical-align: middle;
            margin-top: -2px;
            width: 10px;
            height: 5px;
            margin-right: 8px;
            background-color: rgba(255,255,255,.3);
          }
        }
      }
    }
  }
  .progress-content {
    margin-bottom: 20px;
    .title {
      text-align: right;
      font-size: 12px;
      color: #fff;
      margin-right: 15px;
    }

    .progress-react {
      position: relative;
      flex: 1;
      background: #2c3352;
      height: 4px;

      .progress {
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        background-color: #5bc0d2;
      }
    }

    .num {
      font-size: 16px;
      color: rgba(255, 255, 255, .6);
      padding-left: 15px;
    }
  }
</style>
