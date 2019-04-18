<template>
  <div class="service-warn">
    <div class="bg">
      <p v-for="(item, i) in getWarnData" :key="i">
        <span class="t" :class="`l${i}`"><b class="t-num" v-show="showNum">{{i + 1}}</b>{{item.name}}</span>
        <span class="t" :class="`r${i}`">{{item.value}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'index',
  props: {
    showNum: {
      type: Boolean,
      default: false
    },
    warnData: {
      type: Array,
      default: () => {
        return [
          {
            name: '',
            value: 0
          }
        ];
      }
    }
  },
  computed: {
    getWarnData () {
      return this.warnData;
    }
  }
};
</script>

<style scoped lang="scss">
  $warn: './img/warn-bg.png';
  .service-warn {
    position: relative;
    padding: 25px;
    width: 100%;
    height: 100%;
    .bg {
      position: absolute;
      top: 25px;
      left: 120px;
      width: 184px;
      height: 182px;
      background: url($warn) no-repeat;
      background-size: 100% 100%;
      .t-num {
        font-weight: normal;
        font-size: 12px;
      }
      .t {
        position: absolute;
        width: 90px;
        height: 20px;
        font-size: 12px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &.l0 {
          top: 15px;
          left: -30px;
          color: rgba(249, 132, 132, 0.8);
        }

        &.r0 {
          top: 15px;
          left: 120px;
          color: rgba(249, 132, 132, 0.8);
        }

        &.l1 {
          top: 35px;
          left: -45px;
          color: rgba(238, 228, 115, 0.8);
        }

        &.r1 {
          top: 35px;
          left: 135px;
          color: rgba(238, 228, 115, 0.8);
        }

        &.l2 {
          top: 55px;
          left: -60px;
          color: rgba(102, 192, 239, 0.8);
        }

        &.r2 {
          top: 55px;
          left: 150px;
          color: rgba(102, 192, 239, 0.8);
        }

        &.l3 {
          top: 80px;
          left: -80px;
          color: rgba(108, 117, 226, 0.8);
        }

        &.r3 {
          top: 80px;
          left: 165px;
          color: rgba(108, 117, 226, 0.8);
        }

        &.l4 {
          top: 105px;
          left: -95px;
          color: rgba(73, 87, 174, 0.8);
        }

        &.r4 {
          top: 105px;
          left: 185px;
          color: rgba(73, 87, 174, 0.8);
        }
      }
    }
  }
</style>
