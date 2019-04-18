<template>
  <div class="info-line-all" v-if="infoLineData.length" ref="infoAll">
    <div class="info-line">
      <swiper :options="swiperOption">
        <swiper-slide class="flex justify-items-center"
                      ref="slides"
                      :key="i"
                      v-for="(item, i) in infoLineData">
          <div class="flex" :class="{'align-center': theme !==2, marBot: theme === 2}">
            <span class="title text-overflow-single"
                :class="{titleLine: theme === 1, 'font-lgdr title0': theme === 0, titleFont: theme === 2}">{{item.time}}</span>
            <span class="icon"
                  :class="[carType[item.type].type]"
                  v-if="theme === 0"
                  ref="point">{{carType[item.type].name}}</span>
            <span class="icon icon2"
                  :class="[carType[item.type].type, theme === 2 ? 'marTop' : '']"
                  v-else
                  ref="point"></span>
            <div class="flex align-center car">
              <span class="car-img"
                :style="`backgroundImage: url(${item.img || carPng})`"
                v-if="theme === 0"></span>
              <div class="car-con" v-if="theme !== 2">
                <p class="car-title text-overflow-single" :class="{titleCar: (theme === 1)}">{{item.title}}</p>
                <p class="car-info flex align-center" v-if="theme === 0">
                  <span class="text text-overflow-single">{{item.info}}</span>
                  <span v-if="item.code">订单号: {{item.code}}</span>
                </p>
              </div>
              <div class="car-con" v-else>
                <p class="car-title theme-2-car-title text-overflow-single">{{item.title}}</p>
                <p class="lpn" v-if="item.lpn">{{item.lpn}}</p>
                <p class="name text-overflow-single">故障码 - {{item.name || 0}}</p>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper>
    </div>
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
 *    lpn?: '#fesfdsf' // 车牌
 *    name?: '故障码'
 * }]
 */
import carPng from '@/assets/img/car.png';
import {addClass, removeClass} from '@/lib/className';

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
      swiperOption: {
        allowTouchMove: false, // 禁止拖拽
        direction: 'vertical', // 方向：竖
        slidesPerView: this.slidesPerView, // 显示个数
        spaceBetween: 0, // 每一个slide之间-间距
        pagination: {
          el: '.swiper-pagination',
          clickable: true
        }
      },
      carPng,
      carType: TYPE_CAR,
      move0: false
    };
  },
  props: {
    preData: { // 是否有一条新数据
      type: Object,
      default: () => {}
    },
    slidesPerView: {
      type: Number,
      default: 1
    },
    infoLineData: {
      type: Array,
      default: () => []
    },
    theme: {
      type: Number,
      default: 0
    }
  },
  watch: {
    preData () {
      let $solid = this.$refs.slides;
      if ($solid) {
        console.log(0);
        $solid.forEach(ele => {
          removeClass(ele.$el.children[0], 'animated fadeInDown fadeOut');
        });
        addClass($solid[0].$el.children[0], 'animated fadeInDown');
      }
    }
  }
};
</script>

<style scoped lang="scss">
  .info-line-all {
    height: 100%;
    padding: 6px 0;
    position: relative;
    z-index: 1;

    .line {
      position: absolute;
      left: 73px;
      top: 0;
      height: 100%;
      border-left: 1px dashed rgba(255, 255, 255, .5);
      z-index: -1;
      &.line1 {
        left: 73px;
      }
      &.line2 {
        left: 72px;
      }
    }
  }

  .info-line {
    height: 100%;
    & > li {
      padding: 6px 0;
      z-index: 1;
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
      padding-right: 20px;
    }
    .title0 {
      padding: 0;
      width: 55px;
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
      line-height: 38px;
      font-size: 12px;
      color: #fff;
      width: 38px;
      height: 38px;
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

      &.blue {
        background-color: #86d0ff;
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
          margin: 5px 0 0;
          line-height: 1;
          color: #5b8fed;
          border: solid 2px rgba(91, 143, 237, .5);
          border-radius: 2px;
          font-size: 12px;
          padding: 3px 4px;
        }

        .name {
          width: 160px;
          margin-top: 5px;
          font-size: 12px;
          color: rgba(255, 255, 255, .5);
        }
      }
    }
  }
  .swiper-container {
    height: 100%;
  }
</style>
