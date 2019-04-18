<template>
  <div class="product-factory enter">
    <div class="factory beijing" :class="{opa1: getMapData.BJ.num !== 0, active: isAdd === 'BJ'}">
      <div class="block lb">
        <p>北京厂区</p>
        <div class="c">
          <div class="add1 font-lgdr">+ 1</div>
          <div class="gear">
            <img src="./img/gear-big.png">
            <img src="./img/gear-mini.png">
          </div>
          <div class="data">
            <span class="font-lgdr">{{getMapData.BJ.num}}</span>
            <span class="font-lgdr">辆</span>
          </div>
        </div>
        <div class="b">
          <label>生产状态：</label>
          <span>生产中</span>
        </div>
      </div>
      <div class="line v"></div>
      <div class="circle-wrapper">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
      </div>
      <div class="line r"></div>
    </div>
    <div class="factory hebei" :class="{opa1: getMapData.HB.num !== 0, active: isAdd === 'HB'}">
      <div class="block  rb">
        <p>河北厂区</p>
        <div class="c">
          <div class="add1 font-lgdr">+ 1</div>
          <div class="gear">
            <img src="./img/gear-big.png">
            <img src="./img/gear-mini.png">
          </div>
          <div class="data">
            <span class="font-lgdr">{{getMapData.HB.num}}</span>
            <span class="font-lgdr">辆</span>
          </div>
        </div>
        <div class="b">
          <label>生产状态：</label>
          <span>生产中</span>
        </div>
      </div>
      <div class="line h">
      </div>
      <div class="line r"></div>
      <div class="circle-wrapper">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
      </div>
    </div>
    <div class="factory shandong" :class="{opa1: getMapData.SD.num !== 0, active: isAdd === 'SD'}">
      <div class="block lb">
        <p>山东厂区</p>
        <div class="c">
          <div class="add1 font-lgdr">+ 1</div>
          <div class="gear">
            <img src="./img/gear-big.png">
            <img src="./img/gear-mini.png">
          </div>
          <div class="data">
            <span class="font-lgdr">{{getMapData.SD.num}}</span>
            <span class="font-lgdr">辆</span>
          </div>
        </div>
        <div class="b">
          <label>生产状态：</label>
          <span>生产中</span>
        </div>
      </div>
      <div class="line v"></div>
      <div class="circle-wrapper">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
      </div>
      <div class="line r"></div>
    </div>
    <div class="factory guangdong" :class="{opa1: getMapData.GD.num !== 0, active: isAdd === 'GD'}">
      <div class="block rb">
        <p>广东厂区</p>
        <div class="c">
          <div class="add1 font-lgdr">+ 1</div>
          <div class="gear">
            <img src="./img/gear-big.png">
            <img src="./img/gear-mini.png">
          </div>
          <div class="data">
            <span class="font-lgdr">{{getMapData.GD.num}}</span>
            <span class="font-lgdr">辆</span>
          </div>
        </div>
        <div class="b">
          <label>生产状态：</label>
          <span>生产中</span>
        </div>
      </div>
      <div class="line v">
      </div>
      <div class="circle-wrapper">
        <div class="circle c1"></div>
        <div class="circle c2"></div>
        <div class="circle c3"></div>
        <div class="circle c4"></div>
      </div>
      <div class="line r"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    mapData: {
      type: Object,
      default: () => {}
    },
    isAdd: {
      type: String,
      default: ''
    }
  },
  computed: {
    getMapData () {
      return this.mapData;
    }
  }
};
</script>

<style scoped lang="scss">

  .product-factory {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 710px;
    height: 540px;

    & > img {
      width: 100%;
    }
  }

  @keyframes gear {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(360deg)
    }
  }

  @keyframes gear-f {
    0% {
      transform: rotate(0)
    }
    100% {
      transform: rotate(-360deg)
    }
  }

  @keyframes circle-border {
    0% {
      height: 7px;
      width: 7px;
      opacity: .9;
    }
    100% {
      height: 100px;
      width: 100px;
      opacity: 0;
    }
  }

  @keyframes circle-bg {
    0% {
      height: 7px;
      width: 7px;
    }
    100% {
      height: 100px;
      width: 100px;
    }
  }

  @keyframes add1 {
    0% {
      opacity: .5;
      transform: translateX(0);
    }
    100% {
      opacity: 1;
      transform: translateY(-50px);
    }
  }

  div.factory {
    position: absolute;
    width: 186px;
    /*height: .66rem;*/
    opacity: .5;

    div.block {
      height: 100%;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.65);
      box-shadow: 3px 5px 0 0 rgba(0, 0, 0, 0.2);

      &.rb {
        border-right-width: 2px;
        border-right-style: solid;
      }

      &.lb {
        border-left-width: 2px;
        border-left-style: solid;
      }

      p {
        color: #fff;
        font-size: 16px;
        padding: 5px 0 5px 10px;
      }

      div.c {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        height: 40px;

        div.add1 {
          opacity: 0;
          color: white;
          position: absolute;
          font-size: 28px;
          top: 19px;
          right: 10px;
        }

        div.gear {
          // margin: 0 8px;
          margin-top: -8px;
          height: 100%;
          img:first-child {
            animation: gear 5s infinite linear;
            transform-origin: center center;
            position: relative;
            width: 32px;
          }

          img:last-child {
            animation: gear-f 3.35s infinite linear;
            transform-origin: center center;
            margin: -11px 0 0 15px;
            display: block;
            width: 22px;
          }
        }

        div.data {
          margin-right: 8px;
          height: 100%;
          line-height: 40px;
          width: 85px;
          text-align: right;

          span:first-child {
            font-size: 28px;
            color: #000;
            display: inline-block;
            width: 43px;
            text-align: right;
          }

          span:last-child {
            color: #000;
            font-size: 16px;
          }
        }
      }

      div.b {
        display: none;
        height: 19px;
        line-height: 19px;

        label {
          margin-left: 10px;
          color: #fff;
          font-size: 10px;
        }

        span {
          border-radius: 2px;
          font-size: 10px;
          padding: 0 3px;
          line-height: 1;
        }
      }
    }

    &.lb {
      border-left-width: 2px;
      border-left-style: solid;
    }

    div.line {
      position: absolute;
      width: 1px;

      &.v {
        height: 0;
      }

      &.h {
        height: 1px;
        left: -44px;
        top: 74px;
      }

      &.r {
        left: -23px;
        height: 0;
        transform: rotate(45deg);
      }
    }

    div.circle-wrapper {
      position: absolute;
      bottom: -7px;
      left: 50%;
      transform: translateX(-50%);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      overflow: hidden;

      div.circle {
        position: absolute;
        left: 50%;
        top: 50%;
        animation: circle-border 6s infinite ease-out;
        transform: translate(-50%, -50%);
        border-width: 2px;
        border-style: solid;
        border-radius: 50%;
        height: 7px;
        width: 7px;

        &.c1:before {
          content: '';
          position: absolute;
          left: 50%;
          top: 50%;
          animation: circle-bg 6s infinite ease-out;
          transform: translate(-50%, -50%) scale(1);
          border-radius: 50%;
          height: 7px;
          width: 7px;
        }

        &.c2, &.c3, &.c4 {
          display: none;
        }
      }
    }

    &.active {
      div.block {
        div.c {
          div.add1 {
            animation: add1 2s 1 linear 1.5s;
          }
        }
      }

      div.circle-wrapper {

        div.circle {
          &.c1 {
            opacity: 0;
            display: none;
            animation: unset !important;
          }

          &.c2, &.c3, &.c4 {
            opacity: 1;
            display: block;
          }

          $duration: 1.5s;
          $delay: .2s;

          &.c2 {
            animation-duration: $duration;
            animation-delay: 0s !important;
          }

          &.c3 {
            animation-duration: $duration;
            animation-delay: $delay !important;
          }

          &.c4 {
            animation-duration: $duration;
            animation-delay: $delay*2 !important;
          }
        }
      }
    }

    &.opa1 {
      opacity: 1;

      div.circle-wrapper {
        overflow: initial;
      }
    }

    &.beijing {
      left: 553px;
      top: 68px;

      div.block {
        opacity: 0;

        div.c {
          background-color: #51d28d;

          div.add1 {
            color: #51d28d;
          }
        }

        div.b {
          span {
            background-color: rgb(91, 233, 151);
            opacity: .4;
          }
        }

        &.lb {
          border-color: rgba(91, 233, 151, 0.8);
        }
      }

      div.line {
        background-color: rgba(91, 233, 151, 0.8);

        &.v {
          left: -43px;
          bottom: -79px;
        }

        &.r {
          left: -42px;
          top: 79px;
          width: 0;
          height: 1px;
          transform: rotate(-45deg);
          transform-origin: left bottom;
        }
      }

      div.circle-wrapper {
        left: -43px;
        bottom: -79px;
        background-color: rgba(91, 233, 151, 0.8);

        div.circle {
          animation-delay: 0s;
          border-color: rgba(91, 233, 151, 1);

          &.c1:before {
            animation-delay: 0s;
            background-color: rgba(91, 233, 151, .2);
          }

          &.c2 {
            background-color: rgba(91, 233, 151, .2);
          }
        }
      }
    }

    &.hebei {
      left: 248px;
      top: 258px;

      div.block {
        opacity: 0;
        margin-left: -60px;

        div.c {
          background-color: #77bae5;

          div.add1 {
            color: #77bae5;
          }
        }

        div.b {
          span {
            background-color: #5285a9;
            opacity: .6;
          }
        }

        &.rb {
          border-color: rgba(134, 208, 255, 0.8);
        }
      }

      div.line {
        background-color: rgba(134, 208, 255, 0.8);

        &.h {
          left: 194px;
          top: 32px;
          transform: rotate(-180deg);
          transform-origin: left bottom;
        }

        &.r {
          left: 236px;
          top: -9px;
          width: 1px;
          height: 0;
          transform: rotate(45deg);
          transform-origin: right top;
        }
      }

      div.circle-wrapper {
        background-color: #86d0ff;
        top: -15px;
        left: 238px;

        div.circle {
          animation-delay: .8s;
          border-color: #86d0ff;

          &.c1:before {
            animation-delay: .8s;
            background-color: rgba(61, 180, 255, 0.2);
          }
        }
      }

    }

    &.shandong {
      left: 562px;
      top: 354px;

      div.block {
        opacity: 0;

        div.c {
          background-color: #e1484b;

          div.add1 {
            color: #e1484b;
          }
        }

        div.b {
          span {
            background-color: #9a343b;
            opacity: .6;
          }
        }

        &.lb {
          border-color: rgba(255, 81, 81, 0.8);
        }
      }

      div.line {
        background-color: rgba(255, 81, 81, 0.8);

        &.v {
          left: -44px;
          top: -79px;
        }

        &.r {
          left: -44px;
          top: -10px;
          width: 0;
          height: 1px;
          transform: rotate(45deg);
          transform-origin: left bottom;
        }
      }

      div.circle-wrapper {
        background-color: #ff5151;
        left: -43px;
        top: -85px;

        div.circle {
          animation-delay: 1.2s;
          border-color: #ff5151;

          &.c1:before {
            animation-delay: 1.2s;
            background-color: rgba(255, 0, 0, 0.2);
          }
        }
      }

    }

    &.guangdong {
      left: 303px;
      bottom: 112px;

      div.block {
        opacity: 0;
        margin-left: -60px;

        div.c {
          background-color: #d3bd41;

          div.add1 {
            color: #d3bd41;
          }
        }

        div.b {
          span {
            background-color: #918738;
            opacity: .6;
          }
        }

        &.rb {
          border-color: rgba(239, 213, 68, 0.8);
        }
      }

      div.line {
        background-color: rgba(239, 213, 68, 0.8);

        &.v {
          left: 166px;
          bottom: -76px;
        }

        &.r {
          left: 168px;
          bottom: -7px;
          width: 0;
          height: 1px;
          transform: rotate(-135deg);
          transform-origin: left bottom;
        }
      }

      div.circle-wrapper {
        background-color: #efd544;
        top: 143px;
        left: 167px;

        div.circle {
          animation-delay: 1.8s;
          border-color: #efd544;

          &.c1:before {
            animation-delay: 1.8s;
            background-color: rgba(255, 218, 15, 0.2);
          }
        }
      }

    }
  }

  .enter {
    div.beijing, div.shandong, div.guangdong {
      $delay: .5s;

      div.circle-wrapper {
        animation: enter-circle .5s linear 1;
      }

      div.line {
        &.v {
          animation: enter-r1-line-grow .5s .5s linear;
          animation-fill-mode: forwards;
        }

        &.r {
          animation: enter-r2-line-grow .5s 1s linear;
          animation-fill-mode: forwards;
        }
      }

      div.block {
        animation: enter-block .8s 1.3s linear;
        animation-fill-mode: forwards;
      }
    }

    div.hebei {
      $delay: .5s;

      div.circle-wrapper {
        animation: enter-circle .5s linear 1;
      }

      div.line {
        &.r {
          animation: enter-hebei-r1-line-grow .5s .5s linear;
          animation-fill-mode: forwards;
        }

        &.h {
          animation: enter-hebei-r2-line-grow .5s 1s linear;
          animation-fill-mode: forwards;
        }
      }

      div.block {
        animation: enter-block .8s 1.3s linear;
        animation-fill-mode: forwards;
      }
    }
  }

  @keyframes enter-circle {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  $line60: 60px;
  $line70: 70px;

  @keyframes enter-r1-line-grow {
    0% {
      height: $line70 * 0;
    }
    20% {
      height: $line70 * .2;
    }
    40% {
      height: $line70 * .4;
    }
    60% {
      height: $line70 * .6;
    }
    80% {
      height: $line70 * .8;
    }
    100% {
      height: $line70 * 1;
    }
  }

  @keyframes enter-r2-line-grow {
    0% {
      width: $line60 * 0;
    }
    20% {
      width: $line60 * .2;
    }
    40% {
      width: $line60 * .4;
    }
    60% {
      width: $line60 * .6;
    }
    80% {
      width: $line60 * .8;
    }
    100% {
      width: $line60 * 1;
    }
  }

  @keyframes enter-block {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes enter-hebei-r1-line-grow {
    0% {
      height: $line60 * 0;
    }
    20% {
      height: $line60 * .2;
    }
    40% {
      height: $line60 * .4;
    }
    60% {
      height: $line60 * .6;
    }
    80% {
      height: $line60 * .8;
    }
    100% {
      height: $line60 * 1;
    }
  }

  @keyframes enter-hebei-r2-line-grow {
    0% {
      width: $line70 * 0;
    }
    20% {
      width: $line70 * .2;
    }
    40% {
      width: $line70 * .4;
    }
    60% {
      width: $line70 * .6;
    }
    80% {
      width: $line70 * .8;
    }
    100% {
      width: $line70 * 1;
    }
  }
</style>
