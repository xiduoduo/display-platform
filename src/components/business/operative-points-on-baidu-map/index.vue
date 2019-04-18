<template>
  <BaiduMap
    :theme="0"
    id="operative-map"
    @ready.self="onMapReady"
  ></BaiduMap>
</template>

<script>
import BaiduMap from '@/components/larger/baidu-map';

export default {
  name: 'operative-points-on-baidu-map',
  components: {
    BaiduMap
  },
  props: {
    dataRef: {
      type: Object,
      default: function () {
        return {
          high: [],
          middle: [],
          low: []
        };
      }
    }
  },
  data () {
    return {
      map: null,
      mapv: null,
      mapLineLayers: []
    };
  },
  methods: {
    onMapReady (map) {
      this.mapv = require('@/lib/map/mapv.js');
      this.map = map;
    },
    renderPoints (options, list = []) {
      if (list.length === 0) return;
      let data = [];
      // let topData = [];

      list.forEach(elem => {
        data.push({
          geometry: {
            type: 'Point',
            coordinates: elem
          },
          time: Math.random() * 10
        });
        // topData.push(elem);
      });

      let dataSet = new this.mapv.DataSet(data);
      // eslint-disable-next-line
      this.mapLineLayers[0] = new this.mapv.baiduMapLayer(this.map, dataSet, options);
    },
    bindData () {
      if (!this.map) return;
      this.map.clearOverlays();
      this.mapLineLayers.forEach(elem => elem.destroy());
      this.mapLineLayers = [];

      this.renderPoints({
        fillStyle: 'rgba(200, 200, 0, 0.8)',
        bigData: 'Point',
        size: 0.7,
        draw: 'simple',
        animation: {
          stepsRange: {
            start: 0,
            end: 10
          },
          trails: 1,
          duration: 6
        }
      }, this.dataRef.high);

      this.renderPoints({
        fillStyle: 'rgba(255, 250, 0, 0.8)',
        size: 0.7,
        bigData: 'Point',
        draw: 'simple',
        animation: {
          stepsRange: {
            start: 0,
            end: 10
          },
          trails: 1,
          duration: 6
        }
      }, this.dataRef.middle);

      this.renderPoints({
        fillStyle: 'rgba(255, 250, 250, 0.6)',
        size: 0.7,
        bigData: 'Point',
        draw: 'simple'
      }, this.dataRef.low);
    }
  },
  watch: {
    map () {
      this.bindData();
    },
    dataRef () {
      this.bindData();
    }
  }
};
</script>

<style scoped lang="scss">
</style>
