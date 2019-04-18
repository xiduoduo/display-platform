<template>
  <div class="run-num-content" :class="{line: getRunData.line, big: getRunData.big,  icon: theme === 1, theme3: theme === 3}">
    <h3 class="run-num-title" :class="{titleFont: theme === 1}"><i class="water-dot" v-show="theme === 1"></i>{{runData.title}}</h3>
    <div class="production" :class="{flex: theme === 1}" v-if="theme === 1 || theme === 3">
      <div class="production-item flex align-center">
        <span>今日生产 :</span>
        <ul class="flex">
          <li class="font-lgdr" :key="i" v-for="(item, i) in num">{{item}}</li>
        </ul>
      </div>
      <div class="production-item flex align-center">
        <span>本月生产 :</span>
        <ul class="flex">
          <li class="font-lgdr" :key="i" v-for="(item, i) in cNum">{{item}}</li>
        </ul>
      </div>
    </div>
    <ul class="run-num-box clearfix" v-else>
      <li class="font-lgdr" :key="i" v-for="(item, i) in num">{{item}}</li>
      <!--<li class="font-lgdr">2</li>-->
    </ul>
  </div>
</template>

<script>
/**
 * theme?: 0 // 0/1/3
 * props: {
 *     runData: {
 *         title: '',
 *         num: 0,
 *         big: bool-false, // 是否显示大字体
 *         line?: bool-false, // 是否显示为一行

 *         cNum?: 0, // 第二条数据的值 [PS: 与theme同时用]
 *         time?: 1200 // 动画执行时间
 *     }
 * }
 */
import runNum from '@/lib/run-num';

export default {
  name: 'index',
  data () {
    return {
      num: [0],
      cNum: [0],
      count: 0,
      cCount: 0
    };
  },
  props: {
    runData: {
      type: Object,
      default: () => {}
    },
    theme: {
      type: Number,
      default: 0
    },
    runNumBool: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    getRunData () {
      let {title = '', line = false, big = false, num = 0, cNum = 0, time = 1200} = this.runData;
      let init = {
        title,
        line,
        big,
        num,
        cNum,
        time
      };
      this.run(init);
      return init;
    }
  },
  // watch: {
  //   runData () {
  //     this.run();
  //   }
  // },
  methods: {
    run (datas) {
      let _self = this;
      runNum({
        time: datas.time,
        num: datas.num,
        count: _self.count,
        regulator: 50,
        runNumBool: _self.runNumBool
      }, (res) => {
        _self.num = res;
      });
      // 根据theme来判断,是否执行第二个数值的运动
      if (_self.theme === 1 || _self.theme === 3) {
        runNum({
          time: datas.time || 1200,
          num: datas.cNum || 0,
          count: _self.cCount,
          regulator: 50,
          runNumBool: _self.runNumBool
        }, (res) => {
          _self.cNum = res;
        });
      }
      _self.count = datas.num || 0;
      _self.cCount = datas.cNum || 0;
    }
  },
  mounted: function () {
    // this.run();
  }
};
</script>

<style scoped lang="scss">
  .run-num-content {
    margin-bottom: 15px;
    .production {
      .production-item {
        min-width: 115px;
        span:nth-of-type(1) {
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          padding-right: 2px;
        }
        ul > li {
          margin-left: 2px;
          color: #ffc741;
          font-size: 20px;
        }
      }
      .production-item:nth-of-type(1) {
        margin-right: 15px;
      }
    }
    &.icon {
      .run-num-title {
        font-size: 16px;
      }
      .titleFont {
        font-size: 18px;
      }
      .water-dot {
        position: relative;
        display: inline-block;
        vertical-align: middle;
        height: 26px;
        width: 16px;
        transform: scale(1.1, .9);
        margin-right: 10px;
      }

      .water-dot:before,
      .water-dot:after {
        content: '';
        position: absolute;
        display: inline-block;
      }

      .water-dot:before {
        left: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background-image: repeating-radial-gradient(8px 8px at 50% 8px, transparent 0%, transparent 3px, #6786a1 3px, #6786a1 100%);
        background-image: -ms-repeating-radial-gradient(8px 8px at 50% 8px, transparent 0%, transparent 3px, #6786a1 3px, #6786a1 100%);
      }

      .water-dot:after {
        bottom: 0;
        left: 50%;
        border: 14px solid #6786a1;
        border-bottom-width: 0;
        border-right-width: 7px;
        border-left-width: 7px;
        transform: translate(-50%, 0);
        border-bottom-color: transparent;
        border-right-color: transparent;
        border-left-color: transparent;
      }
    }
    &.line {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
      .run-num-title {
        font-size: 14px;
        margin-bottom: 0;
        width: 170px;
      }
      .run-num-box {
        li {
          width: 21px;
          height: 26px;
          line-height: 26px;
          font-size: 20px;
        }
      }
    }
    &.big {
      .run-num-title {
        font-size: 22px;
        text-align: right;
        padding-right: 10px;
      }
      .run-num-box {
        li {
          width: 36px;
          height: 52px;
          line-height: 52px;
          font-size: 40px;
        }
      }
    }
    .run-num-title {
      color: #fff;
      font-size: .16rem;
      margin-bottom: .2rem;
    }
    .run-num-box {
      display: inline-block;
      border-radius: 5px;
      box-shadow: 0 0 8px 0 #4174c9;
      li {
        float: left;
        width: .28rem;
        height: .4rem;
        text-align: center;
        line-height: .4rem;
        font-size: .3rem;
        color: #ffc741;
        border-right: 1px solid #4174c9;
        &:nth-last-child(1) {
          border-right: none;
        }
      }
    }
  }
  .theme3 {
    margin: 0;
    .run-num-title {
      margin-bottom: .1rem;
    }
    .production {
      .production-item {
        min-width: 99px;
        margin-bottom: 3px;

        ul > li {
          font-size: .18rem;
        }
      }
    }
  }
</style>
