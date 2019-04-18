<template>
  <div class="map" :id="id"></div>
</template>

<script>
import { MP } from './map';
import themes from './themes';
export default {
  name: 'baidu-map',
  map: null,
  data () {
    return {};
  },
  props: {
    theme: {
      type: Number,
      default: 0
    },
    myTheme: {
      type: Array,
      default: () => []
    },
    id: {
      type: String,
      default: ''
    }
  },
  methods: {
    initMap () {
      // eslint-disable-next-line
      this.map = new BMap.Map(this.id, {
        enableMapClick: false
      }); // 创建Map实例
      // eslint-disable-next-line
      this.map.centerAndZoom(new BMap.Point(105.403119, 37.028658), 5); // 初始化地图,设置中心点坐标和地图级别
      this.map.enableScrollWheelZoom(false); // 开启鼠标滚轮缩放
      // 初始化地图样式
      if (this.myTheme.length) {
        this.map.setMapStyle({
          styleJson: this.myTheme
        });
      } else {
        this.map.setMapStyle(themes[this.theme || 0]);
      }
      this.$emit('ready', this.map);
    }
  },
  mounted: function () {
    // var that = this;
    this.$nextTick(function () {
      MP().then(BMap => {
        if (!BMap) return;
        this.initMap();
      });
    });
  }
};
</script>

<style scoped lang="scss">
  .map {
    width: 100%;
    height: 100%;
  }
</style>
