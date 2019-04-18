<template>
  <SlotLayout class="bg" :bgImg="bgImg">
    <div class="scales" :style="scales">
      <NavDisplay/>
      <keep-alive>
        <router-view v-if="keepAlive"></router-view>
      </keep-alive>
    </div>
    <Pagination :paginations="pagination"/>
  </SlotLayout>
</template>

<script>
import theme from '@/theme';

export default {
  name: 'index',
  data () {
    return {
      bgImg: '',
      scales: {
        transform: 'scale(1) translate3d(0, 0, 0)'
      },
      pagination: [
        {
          index: 0,
          path: '/index.html'
        },
        {
          index: 1,
          path: '/index/parttwo/index.html'
        },
        {
          index: 2,
          path: '/index/partthree/index.html'
        },
        {
          index: 3,
          path: '/trial/index.html'
        },
        {
          index: 4,
          path: '/product/index.html'
        },
        {
          index: 5,
          path: '/logistics/index.html'
        },
        {
          index: 6,
          path: '/operative/index.html'
        },
        {
          index: 7,
          path: '/service/index.html'
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
    this.getRouter();
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
