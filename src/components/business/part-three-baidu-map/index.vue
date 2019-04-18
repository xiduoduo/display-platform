<template>
  <BaiduMap
    :myTheme="myTheme"
    id="part-three-map"
    ref="bmap"
    @ready.self="onMapReady"
  ></BaiduMap>
</template>
<script>
import BaiduMap from '@/components/larger/baidu-map';
import { Heat } from './randerHeat';

const STYLES = [
  {
    'featureType': 'water',
    'elementType': 'all',
    'stylers': {
      'color': '#030641'
    }
  },
  {
    'featureType': 'highway',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#102c8e'
    }
  },
  {
    'featureType': 'highway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#102c8e'
    }
  },
  {
    'featureType': 'arterial',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#15308c'
    }
  },
  {
    'featureType': 'arterial',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#0b3d51'
    }
  },
  {
    'featureType': 'all',
    'elementType': 'labels.text.fill',
    'stylers': {
      'color': '#5fedf7'
    }
  },
  {
    'featureType': 'all',
    'elementType': 'labels.text.stroke',
    'stylers': {
      'color': '#102c8e'
    }
  },
  {
    'featureType': 'local',
    'elementType': 'geometry',
    'stylers': {
      'color': '#15308c'
    }
  },
  {
    'featureType': 'land',
    'elementType': 'all',
    'stylers': {
      'color': 'rgba(21, 125, 198, .25)'
    }
  },
  {
    'featureType': 'subway',
    'elementType': 'geometry',
    'stylers': {
      'lightness': -70
    }
  },
  {
    'featureType': 'subway',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#4a6ffb'
    }
  },
  {
    'featureType': 'subway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#4a6ffb'
    }
  },
  {
    'featureType': 'railway',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#3d55af'
    }
  },
  {
    'featureType': 'railway',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#3d55af'
    }
  },
  {
    'featureType': 'building',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#000'
    }
  },
  {
    'featureType': 'building',
    'elementType': 'geometry',
    'stylers': {
      'color': '#022338'
    }
  },
  {
    'featureType': 'green',
    'elementType': 'geometry',
    'stylers': {
      'color': '#0096ff'
    }
  },
  {
    'featureType': 'boundary',
    'elementType': 'geometry.fill',
    'stylers': {
      'color': '#000d7f'
    }
  },
  {
    'featureType': 'boundary',
    'elementType': 'geometry.stroke',
    'stylers': {
      'color': '#157dc6'
    }
  },
  {
    'featureType': 'manmade',
    'elementType': 'all',
    'stylers': {
      'color': '#102c8e'
    }
  }
];
export default {
  name: 'index',
  components: {
    BaiduMap
  },
  data () {
    return {
      myTheme: STYLES,
      map: null,
      mapv: null,
      mapLineLayers: [],
      pointCollectionSrever: null
    };
  },
  props: {
    dataRef: {
      type: Array,
      default: () => []
    },
    dealerData: {
      type: Array,
      default: () => []
    }
  },
  watch: {
    map () {
      this.bindData();
    },
    dataRef () {
      this.randerHotMap();
    },
    dealerData () {
      this.dealer(this.dealerData);
    }
  },
  methods: {
    onMapReady (map) {
      this.mapv = require('@/lib/map/mapv.js');
      this.map = map;
      // 动态创建script，并加载heatMap.js
      Heat();
    },
    bindData () {
      if (!this.map || !window.BMapLib) return;
      this.hotZoon(this.dataRef);
      this.dealer(this.dealerData);
    },
    randerHotMap () {
      let _self = this;
      let timer = setTimeout(() => {
        clearTimeout(timer);
        // console.log(0);
        if (!window.BMapLib) {
          _self.randerHotMap();
        }
        _self.hotZoon(_self.dataRef);
      }, 100);
    },
    hotZoon (data) {
      // eslint-disable-next-line
      let heatmapOverlay = new window.BMapLib.HeatmapOverlay({'radius': 20});
      this.map.addOverlay(heatmapOverlay);
      heatmapOverlay.setDataSet({data: data, max: 10});
    },
    dealer (data) {
      if (this.pointCollectionSrever) {
        this.map.removeOverlay(this.pointCollectionSrever);
      }
      /* eslint-disable */
      var options = {
        shape: BMAP_POINT_SHAPE_STAR,
        color: '#FFB7F4',
        size: BMAP_POINT_SIZE_BIG
      };
      this.pointCollectionSrever = new BMap.PointCollection(data, options);
      this.map.addOverlay(this.pointCollectionSrever);
    }
  }
};
</script>

<style scoped>

</style>
