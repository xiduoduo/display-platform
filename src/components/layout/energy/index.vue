<template>
  <SlotLayout class="bg green" :bgImg="bgImg">
    <div class="scales kms-container" :style="scales">
      <NavEnergy/>
      <keep-alive>
        <router-view v-if="keepAlive"></router-view>
      </keep-alive>
    </div>
    <Pagination :paginations="pagination" :loopNav="Boolean(false)"/>
  </SlotLayout>
</template>

<script>
// import theme from '@/theme';
// let green = theme('green');
// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/energy' : '';
export default {
  name: 'index',
  data () {
    return {
      bgImg: this.GREEN.bgImg,
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
          path: devPath + '/index/parttwo/index.html'
        },
        {
          index: 2,
          path: devPath + '/index/partthree/index.html'
        },
        {
          index: 3,
          path: devPath + '/product/index.html'
        },
        {
          index: 4,
          path: devPath + '/logistics/index.html'
        },
        {
          index: 5,
          path: devPath + '/operative/index.html'
        },
        {
          index: 6,
          path: devPath + '/service/index.html'
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
      // this.bgImg = this.$route.query.theme ? theme(this.$route.query.theme).bgImg : '';
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
    background-color: #1c232b;
    background-size: auto 348px !important;
    background-position: center bottom;
  }
  .scales {
    width: 1920px;
    height: 1080px;
    overflow: hidden;
  }
</style>
