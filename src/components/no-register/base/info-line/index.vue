<template>
  <div class="info-line-all" v-if="infoLineData.length">
    <ul class="info-line" :class="{'theme-2-li': theme === 2, 'theme-0-li': theme === 0}">
      <li class="flex justify-items-center"
          :class="{'align-center': theme !==2, marBot: theme === 2, new: i === 0 && isNew, active: i === 0 && getActived}"
          :key="i" v-for="(item, i) in infoLineData">
        <span class="title text-overflow-single" :class="{titleLine: theme === 1, 'font-lgdr runLine': (theme === 0), titleFont: theme === 2}">{{item.time}}</span>
        <span class="icon"
              :class="`${carType[item.type].type}`"
              v-if="theme === 0"
              ref="point">{{carType[item.type].name}}</span>
        <span class="icon icon2"
              :class="[carType[item.type].type, theme === 2 ? 'marTop' : '']"
              v-else
              ref="point"></span>
        <div class="flex car" :class="{'align-center' : theme !== 2 || theme === 0}">
          <span class="car-img"
                :style="`backgroundImage: url(${item.img || carPng})`"
                v-if="theme === 0"></span>
          <div class="car-con" v-if="theme !== 2">
            <p class="car-title text-overflow-single" :class="{titleCar: (theme === 1)}">{{item.title}}</p>
            <p class="car-info flex align-center" v-if="theme === 0">
              <span class="text text-overflow-single">承运商: {{item.info}}</span>
              <span v-if="item.code">运单号: {{item.code}}</span>
            </p>
          </div>
          <div class="car-con" v-else>
            <p class="car-title theme-2-car-title text-overflow-single">{{item.title}}</p>
            <p class="lpn" v-if="item.lpn">{{item.lpn}}</p>
            <p class="name text-overflow-single">故障码 - {{item.name || 0}}</p>
          </div>
        </div>
      </li>
    </ul>
    <span class="line" :class="{'line1': theme === 1, 'line2': theme === 2}"></span>
  </div>
</template>

<script>
/**
 * theme?: 0, // [0, 1, 2]3种样式
 * infoLineData: [{
 *    time: '13:21', // 时间
 *    type: 0, // 运行状态
 *    title: '福州上来看飞机离开的手机废了看时间',
 *    img？: '', // car图片
 *    info？: '福州上来看飞机离开的手机废了看时间',
 *    code？: '123213213' // 订单号
 * }]
 */
// import offsetFn from '@/lib/offset';
import carPng from '@/assets/img/car.png';
let TYPE_CAR = [
  {
    type: 'success',
    name: '正常'
  },
  {
    type: 'warn',
    name: '延迟'
  },
  {
    type: 'error',
    name: '未达'
  },
  {
    type: 'blue',
    name: ''
  }
];
export default {
  name: 'index',
  data () {
    return {
      carPng,
      carType: TYPE_CAR,
      isNew: false,
      getActived: false
    };
  },
  props: {
    infoLineData: {
      type: Array,
      default: () => []
    },
    theme: {
      type: Number,
      default: 0
    },
    isActived: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    isActived () {
      // console.log(this.isActived);
      if (this.isActived) {
        this.isNew = true;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          this.getActived = true;
        }, 100);
      }
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        this.isNew = false;
        this.getActived = false;
      }, 2000);
    }
  }
};
</script>

<style scoped lang="scss">
  .info-line-all {
    padding: 6px 0;
    position: relative;
    z-index: 1;
    .line {
      position: absolute;
      left: 89px;
      top: 0;
      height: 100%;
      border-left: 1px dashed rgba(255, 255, 255, .5);
      z-index: -1;
      &.line1 {
        left: 93px;
      }
      &.line2 {
        left: 72px;
      }
    }
  }
  .runLine {
    width: 50px;
  }
  .info-line {
    & > li {
      height: 48px;
      z-index: 1;
      &.new {
        opacity: 0;
        height: 0;
        &.active {
          opacity: 1;
          height: 48px;
          transition: height .5s, opacity 1s .3s;
        }
      }
    }
    &.theme-0-li {
      & > li {
        height: 62px;
      }
    }
    &.theme-2-li {
      & > li {
        height: 80px;
        z-index: 1;
        &.new {
          opacity: 0;
          height: 0;
          &.active {
            opacity: 1;
            height: 71px;
            transition: height .5s, opacity 1s .3s;
          }
        }
      }
    }
    .marBot {
      margin-bottom: 20px;
      &:nth-last-child(1) {
        margin-bottom: 0;
      }
    }
    .title {
      font-size: 20px;
      color: rgba(255, 255, 255, .5);
      margin-right: 20px;
    }
    .titleFont {
      font-size: 12px;
      text-align: right;
      margin-top: 3px;
    }
    .titleLine {
      color: #fff;
      width: 70px;
      text-align: right;
      font-size: 14px;
    }
    .icon {
      text-align: center;
      line-height: 42px;
      font-size: 14px;
      color: #fff;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      &.success {
        background-color: #35a871;
      }
      &.warn {
        background-color: #ed9421;
      }
      &.error {
        background-color: #ff6159;
      }
    }
    .marTop {
      margin-top: 8px;
    }
    .icon2 {
      width: 7px;
      height: 7px;
      line-height: 7px;
    }
    .car {
      padding-left: 10px;
      .car-img {
        width: 60px;
        height: 41px;
        background-size: 100% 100%;
      }
      .car-con {
        padding-left: 10px;
        .car-title {
          font-size: 16px;
          color: #fff;
          padding-bottom: 2px;
        }
        .titleCar {
          color: rgba(255, 255, 255, .6);
          font-size: 12px;
          width: 151px;
        }
        .car-info .text {
          width: 180px;
          margin-right: 10px;
        }
        .car-info > span {
          font-size: 12px;
          color: rgba(255, 255, 255, .5);
        }
        .theme-2-car-title {
          font-size: 16px;
          width: 160px;
        }
        .lpn {
          display: inline-block;
          margin: 9px 0 0;
          line-height: 1;
          color: #5b8fed;
          border: solid 2px rgba(91,143,237,.5);
          border-radius: 2px;
          font-size: 12px;
          padding: 3px 4px;
        }
        .name {
          width: 160px;
          margin-top: 9px;
          font-size: 12px;
          color: rgba(255,255,255,.5);
        }
      }
    }
  }
</style>
