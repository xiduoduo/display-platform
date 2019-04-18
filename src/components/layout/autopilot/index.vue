<template>
  <SlotLayout class="bg" :bgImg="bgImg">
    <div class="scales kms-container" :style="scales">
      <NavKms/>
      <keep-alive>
        <router-view v-if="keepAlive"></router-view>
      </keep-alive>
    </div>
    <Pagination :paginations="pagination" :theme="1"/>
  </SlotLayout>
</template>

<script>
import theme from '@/theme';
import LayoutKmsBg from './img/bg.jpg';
// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/engine' : '';
export default {
  name: 'index',
  data () {
    return {
      bgImg: LayoutKmsBg,
      scales: {
        transform: 'scale(1) translate3d(0, 0, 0)'
      },
      pagination: [
        {
          index: 0,
          path: devPath + '/index.html'
        },
        {
          index: 1,
          path: devPath + '/mileage/index.html'
        }
      ],
      keepAlive: true
    };
  },
  provide () {
    return {
      reload: this.reload
    };
  },
  methods: {
    reload () {
      this.keepAlive = false;
      this.$nextTick(() => {
        this.keepAlive = true;
      });
    },
    getRouter () {
      this.bgImg = this.$route.query.theme ? theme(this.$route.query.theme).bgImg : '';
    },
    winResize () {
      window.onresize = () => {
        this.getHeight();
      };
    },
    getHeight () {
      let w = 1920;
      let h = 1080;
      var dw = document.documentElement.offsetWidth / w;
      var dh = document.documentElement.offsetHeight / h;
      var d = parseFloat(Math.min(dw, dh).toFixed(2));
      var x = parseInt((document.documentElement.offsetWidth - w * d) / 2);
      this.scales = {
        transform: `translate3d(${x}px, 0, 0) scale(${d})`,
        transformOrigin: `0 0`
      };
    },
    changeHight () {
      this.getHeight();
      setTimeout(() => {
        this.winResize();
      }, 100);
    }
  },
  mounted: function () {
    // this.getRouter();
    this.changeHight();
  }
};
</script>

<style scoped lang="scss">
  .bg {
    position: relative;
  }
  .scales {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
  }
</style>
