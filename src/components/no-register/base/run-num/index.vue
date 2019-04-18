<template>
  <div class="run-num-content"
       :class="{line: getRunData.line, big: getRunData.big,  icon: theme === 1, theme3: theme === 3}">
    <h3 class="run-num-title" :class="{titleFont: theme === 1}"><i class="water-dot" v-show="theme === 1"></i>{{runData.title}}
    </h3>
    <div class="production" :class="{flex: theme === 1}" v-if="theme === 1 || theme === 3">
      <div class="production-item flex align-center">
        <span class="production-item-name">今日生产 :</span>
        <div class="run-num-box clearfix">
          <div class="one-num"
               :key="i"
               v-for="(ele, i) in getRunData.num">
            <p ref="fontBox" :style="pos">
              <span class="font-lgdr item">0</span>
              <span class="font-lgdr item">1</span>
              <span class="font-lgdr item">2</span>
              <span class="font-lgdr item">3</span>
              <span class="font-lgdr item">4</span>
              <span class="font-lgdr item">5</span>
              <span class="font-lgdr item">6</span>
              <span class="font-lgdr item">7</span>
              <span class="font-lgdr item">8</span>
              <span class="font-lgdr item">9</span>
            </p>
          </div>
        </div>
      </div>
      <div class="production-item flex align-center">
        <span class="production-item-name">本月生产 :</span>
        <div class="run-num-box clearfix">
          <div class="one-num"
               :key="i"
               v-for="(ele, i) in getRunData.cNum">
            <p ref="fontBoxCnum" :style="pos">
              <span class="font-lgdr item">0</span>
              <span class="font-lgdr item">1</span>
              <span class="font-lgdr item">2</span>
              <span class="font-lgdr item">3</span>
              <span class="font-lgdr item">4</span>
              <span class="font-lgdr item">5</span>
              <span class="font-lgdr item">6</span>
              <span class="font-lgdr item">7</span>
              <span class="font-lgdr item">8</span>
              <span class="font-lgdr item">9</span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="run-num-box clearfix" v-else>
      <div class="one-num"
           :key="i"
           v-for="(ele, i) in getRunData.num"
           v-if="!fontChange"
      >
        <p ref="fontBox" :style="pos">
          <span class="font-lgdr item">0</span>
          <span class="font-lgdr item">1</span>
          <span class="font-lgdr item">2</span>
          <span class="font-lgdr item">3</span>
          <span class="font-lgdr item">4</span>
          <span class="font-lgdr item">5</span>
          <span class="font-lgdr item">6</span>
          <span class="font-lgdr item">7</span>
          <span class="font-lgdr item">8</span>
          <span class="font-lgdr item">9</span>
        </p>
      </div>
      <div class="one-num"
           :key="i"
           v-for="(ele, i) in getRunData.num"
           v-if="fontChange">
        <p ref="fontBox" :style="pos">
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
          <span class="font-other item"></span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * theme?: 0 // 0/1/3
 * fontChange?: false数字样式
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

export default {
  name: 'index',
  data () {
    return {
      pos: {
        transform: `translate3d(0, 0, 0)`,
        transition: 'all 1s .5s'
      },
      getRunData: {}
    };
  },
  props: {
    runData: {
      type: Object,
      default: () => {}
    },
    fontChange: {
      type: Boolean,
      default: false
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
  watch: {
    runData () {
      this.fontBoxHeight();
    }
  },
  methods: {
    fontBoxHeight () {
      let _self = this;
      let {title = '', line = false, big = false, num = 0, cNum = 0} = this.runData;
      _self.getRunData = {
        title,
        line,
        big,
        num: (num + '').split(''),
        cNum: (cNum + '').split('')
      };
      this.$nextTick(() => {
        // let all = [];
        let $fontBox = _self.$refs.fontBox;
        if ($fontBox.length !== _self.getRunData.num.length) return;
        _self.getBox(_self.getRunData.num, $fontBox);
        // 根据theme来判断,是否执行第二个数值的运动
        if (_self.theme === 1 || _self.theme === 3) {
          let $fontBoxCnum = _self.$refs.fontBoxCnum;
          if ($fontBoxCnum.length !== _self.getRunData.cNum.length) return;
          _self.getBox(_self.getRunData.cNum, $fontBoxCnum);
        }
      });
    },
    getBox (data, dom) {
      // 获取数字位置，移动整体数据位置
      let all = [];
      let domH = dom[0].offsetHeight / 10;
      data.forEach((ele, i) => {
        if (dom[i].children) {
          // if (dom[i].children[Number(ele)] && dom[i].children[Number(ele)].offsetTop) {
          //   all.push(dom[i].children[Number(ele)].offsetTop);
          // }
          all.push(domH * ele);
        }
      });
      dom.forEach((ele, i) => {
        ele.style.transform = `translate3d(0, -${all[i]}px, 0)`;
      });
    }
  },
  mounted: function () {
    this.fontBoxHeight();
  }
};
</script>

<style scoped lang="scss">
  $num: './img/num.png';
  .run-num-content {
    margin-bottom: 15px;

    .run-num-title {
      color: #fff;
      font-size: 16px;
      margin-bottom: 20px;
    }

    .run-num-box {
      display: inline-block;
      overflow: hidden;
      height: 40px;
      border-radius: 5px;
      box-shadow: 0 0 8px 0 #4174c9;

      .one-num {
        float: left;
        border-right: 1px solid #4174c9;
        height: 100%;

        &:nth-last-child(1) {
          border-right: none;
        }

        .item {
          display: block;
          width: 28px;
          height: 40px;
          text-align: center;
          line-height: 40px;
          font-size: 30px;
          color: #ffc741;
        }

        .font-other {
          background: url($num) no-repeat;
          background-size: 100% auto;

          &:nth-of-type(1) {
            background-position: 0 -398px;
          }

          &:nth-of-type(2) {
            background-position: 0 -354px;
          }

          &:nth-of-type(3) {
            background-position: 0 -310px;
          }

          &:nth-of-type(4) {
            background-position: 0 -266px;
          }

          &:nth-of-type(5) {
            background-position: 0 -222px;
          }

          &:nth-of-type(6) {
            background-position: 0 -178px;
          }

          &:nth-of-type(7) {
            background-position: 0 -133px;
          }

          &:nth-of-type(8) {
            background-position: 0 -89px;
          }

          &:nth-of-type(9) {
            background-position: 0 -45px;
          }

          &:nth-of-type(10) {
            background-position: 0 -1px;
          }
        }
      }
    }

    .production {
      .production-item {
        min-width: 115px;

        .production-item-name {
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          padding-right: 2px;
        }

        .run-num-box {
          height: 26px;
          box-shadow: none;

          .one-num {
            float: left;
            border-right: none;

            &:nth-last-child(1) {
              border-right: none;
            }

            .item {
              width: 15px;
              height: 26px;
              line-height: 26px;
              font-size: 24px;
            }
          }
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
        font-size: 22px;
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
      margin-bottom: 25px;
      display: flex;
      align-items: center;

      .run-num-title {
        font-size: 14px;
        margin-bottom: 0;
        width: 170px;
      }

      .run-num-box {
        height: 26px;

        .one-num {
          float: left;

          &:nth-last-child(1) {
            border-right: none;
          }

          .item {
            width: 21px;
            height: 26px;
            line-height: 26px;
            font-size: 20px;
          }
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
        height: 52px;

        .one-num {
          float: left;

          &:nth-last-child(1) {
            border-right: none;
          }

          .item {
            width: 36px;
            height: 52px;
            line-height: 52px;
            font-size: 40px;
          }
        }
      }
    }
  }

  .theme3 {
    margin: 0;

    .run-num-title {
      margin-bottom: 10px;
    }

    .production {
      .production-item {
        min-width: 99px;
        margin-bottom: 3px;

        .run-num-box {
          .one-num {
            .item {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
</style>
