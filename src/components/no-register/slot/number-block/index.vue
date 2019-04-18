<template>
  <div class="number-blocks" :class="{pTop: blockTitle}">
    <BlockTitle class="block-title" v-if="blockTitle" :font="blockFont" :title="blockTitle" :icon="icon"
                :showFont="showFont"></BlockTitle>
    <div class="number-block" :class="`block-${theme}`">
      <span class="box"></span>
      <div class="content">
        <div class="con-main">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    showFont: {
      type: Boolean,
      default: true
    },
    theme: {
      type: Number,
      default: 1
    },
    blockTitle: {
      type: String,
      default: ''
    },
    blockFont: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    }
  }
};
</script>

<style scoped lang="scss">
  $blockTop01: './img/1.1.png';
  $blockBtm01: './img/1.3.png';
  $blockBg01: './img/1.2.png';
  $blockTop02: './img/2.1.png';
  $blockBtm02: './img/2.3.png';
  $blockBg02: './img/2.2.png';
  $blockTop03: './img/3.1.png';
  $blockBtm03: './img/3.3.png';
  $blockBg03: './img/3.2.png';
  $blockTop04: './img/4.1.png';
  $blockBtm04: './img/4.3.png';
  $blockBg04: './img/4.2.png';
  $blockTop05: './img/5.1.png';
  $blockBtm05: './img/5.3.png';
  $blockBg05: './img/5.2.png';
  $blockTop06: './img/6.1.png';
  $blockBtm06: './img/6.3.png';
  $blockBg06: './img/6.2.png';
  $blockTop07: './img/7.1.png';
  $blockBtm07: './img/7.3.png';
  $blockBg07: './img/7.2.png';
  $blockTop08: './img/8.1.png';
  $blockBtm08: './img/8.3.png';
  $blockBg08: './img/8.2.png';
  $blockTop09: './img/9.1.png';
  $blockBtm09: './img/9.3.png';
  $blockBg09: './img/9.2.png';
  $blockTop10: './img/10.1.png';
  $blockBtm10: './img/10.3.png';
  $blockBg10: './img/10.2.png';
  .absolute {
    position: absolute;
    left: 0;
    top: 0;
  }

  .number-blocks {
    position: relative;
    width: 100%;
    height: 100%;
    &.pTop {
      padding-top: 35px;
    }

    .block-title {
      position: absolute;
      left: 15px;
      top: 0;
    }
  }

  .number-block {
    overflow: hidden;
    height: 100%;
    position: relative;

    &:before {
      @extend .absolute;
      width: 100%;
      content: '';
    }

    &:after {
      @extend .absolute;
      content: '';
      width: 100%;
      height: 30px;
      top: auto;
      bottom: 0;
      left: 0;
    }

    .box {
      @extend .absolute;
      width: 100%;
      box-sizing: border-box;
    }

    .content {
      min-width: 250px;
      min-height: 150px;
      position: relative;
      z-index: 2;
      box-sizing: border-box;
      // padding: 15px 10px;
      height: 100%;

      .con-main {
        height: 100%;
      }
    }
  }

  .block-1 {
    &:before {
      height: 50px;
      background: url($blockTop01) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 55px;
      background: url($blockBtm01) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 50px;
      bottom: 55px;
      background: url($blockBg01) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-2 {
    &:before {
      height: 53px;
      background: url($blockTop02) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 92px;
      background: url($blockBtm02) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 53px;
      bottom: 92px;
      background: url($blockBg02) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-3 {
    &:before {
      height: 91px;
      background: url($blockTop03) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 59px;
      background: url($blockBtm03) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 91px;
      bottom: 59px;
      background: url($blockBg03) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-4 {
    &:before {
      height: 114px;
      background: url($blockTop04) -1px no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 96px;
      background: url($blockBtm04) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 114px;
      bottom: 96px;
      background: url($blockBg04) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-5 {
    &:before {
      height: 98px;
      background: url($blockTop05) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 112px;
      background: url($blockBtm05) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 98px;
      bottom: 112px;
      background: url($blockBg05) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-6 {
    &:before {
      height: 49px;
      background: url($blockTop06) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 51px;
      background: url($blockBtm06) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 49px;
      bottom: 51px;
      background: url($blockBg06) repeat-y;
      background-size: 100% 1px;
    }
  }

  .block-7 {
    &:before {
      height: 50px;
      background: url($blockTop07) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 50px;
      background: url($blockBtm07) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 50px;
      bottom: 50px;
      background: url($blockBg07) repeat-y;
      background-size: 100% 1px;
    }
  }
  .block-8 {
    &:before {
      height: 92px;
      background: url($blockTop08) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 53px;
      background: url($blockBtm08) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 92px;
      bottom: 53px;
      background: url($blockBg08) repeat-y;
      background-size: 100% 1px;
    }
  }
  .block-9 {
    &:before {
      height: 59px;
      background: url($blockTop09) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 105px;
      background: url($blockBtm09) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 59px;
      bottom: 105px;
      background: url($blockBg09) repeat-y;
      background-size: 100% 1px;
    }
  }
  .block-10 {
    &:before {
      height: 54px;
      background: url($blockTop10) no-repeat;
      background-size: 100% 100%;
    }

    &:after {
      height: 65px;
      background: url($blockBtm10) no-repeat;
      background-size: 100% 100%;
    }

    .box {
      top: 54px;
      bottom: 65px;
      background: url($blockBg10) repeat-y;
      background-size: 100% 1px;
    }
  }
</style>
