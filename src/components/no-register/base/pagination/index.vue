<template>
  <div class="nav-pagination">
    <span class="pagination-item" v-if="theme === 0" :class="{active: paginationActive === item.index}"
          :key="i"
          v-for="(item, i) in paginations"
          @click="changeSwiper(item)"></span>
    <p class="pagination-con display-flex justify-align-center" v-if="theme === 1">
      <span :class="{active: paginationActive === item.index}"
            :key="i"
            v-for="(item, i) in paginations"
            @click="changeSwiper(item)"></span>
    </p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'index',
  data () {
    return {
      paginationActive: 0,
      intervalNavTimer: null
    };
  },
  props: {
    paginations: { // 底部导航
      type: Array,
      default: () => []
    },
    theme: { // 两种样式方式
      type: Number,
      default: 0
    },
    loopNav: { // 是否自动切换页面
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters([
      'currentPageBrand'
    ])
  },
  watch: {
    $route () {
      this.changeSwiper();
      if (this.loopNav) {
        this.IntervalNavList();
      }
    },
    currentPageBrand () {
      if (this.loopNav) {
        this.IntervalNavList();
      }
    }
  },
  created: function () {
    var _self = this;
    // 键盘事件
    document.onkeydown = function (e) {
      // ArrowLeft
      // ArrowRight
      let key = e.key || e.code || e.keyCode;
      if (key === 37) {
        key = 'ArrowLeft';
      }
      if (key === 39) {
        key = 'ArrowRight';
      }
      if (!_self[key]) return;
      // 调用方法名与e.key/e.code键值名称相同
      _self[key]();
    };
  },
  methods: {
    ArrowLeft () { // 向左
      this.paginationActive--;
      if (this.paginationActive < 0) {
        this.paginationActive = this.paginations.length - 1;
      }
      this.$router.push({path: `${this.paginations[this.paginationActive].path}`, query: this.$route.query});
    },
    ArrowRight () { // 向右
      this.paginationActive++;
      if (this.paginationActive > this.paginations.length - 1) {
        this.paginationActive = 0;
      }
      this.$router.push({path: `${this.paginations[this.paginationActive].path}`, query: this.$route.query});
    },
    changeSwiper (item) {
      // 获取当前导航索引
      let _self = this;
      let pathName = _self.$route.path;
      if (!item) {
        _self.paginations.forEach(ele => {
          if (ele.path === pathName) {
            item = ele;
          }
        });
      }
      _self.paginationActive = item.index;
      _self.$router.push({path: `${item.path}`, query: _self.$route.query});
      if (this.loopNav) {
        this.IntervalNavList();
      }
    },
    IntervalNavList () {
      // 自动切换导航定时器: 1.5分钟轮换
      let _self = this;
      clearInterval(_self.intervalNavTimer);
      _self.intervalNavTimer = null;
      let navIndex = _self.paginationActive || 0;
      _self.intervalNavTimer = setInterval(() => {
        navIndex++;
        if (navIndex > _self.paginations.length - 1) {
          navIndex = 0;
        }
        _self.$router.push({path: `${_self.paginations[navIndex].path}`, query: _self.$route.query});
      }, 1.5 * 60 * 1000);
    }
  },
  mounted: function () {
    this.changeSwiper();
  }
};
</script>

<style scoped lang="scss">
  .nav-pagination {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 1.5%;
    text-align: center;

    .pagination-item {
      display: inline-block;
      cursor: pointer;
      margin: 0 4px;
      width: 30px;
      height: 3px;
      background-color: rgba(255, 255, 255, .2);

      &.active {
        background-color: rgba(255, 255, 255, .5);
      }
    }

    .pagination-con {
      margin: 0 auto;
      width: 100px;
      height: 20px;
      border: 1px solid rgba(255, 255, 255, .3);
      border-radius: 20px;

      span {
        border-radius: 50%;
        width: 10px;
        height: 10px;
        cursor: pointer;
        margin: 0 15px;
        background-color: rgba(255, 255, 255, .3);
        &.active {
          background: #007aff;
        }
      }
    }
  }
</style>
