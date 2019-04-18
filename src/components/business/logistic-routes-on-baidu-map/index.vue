<template>
  <BaiduMap
    :theme="0"
    id="logistic-map"
    @ready.self="onMapReady"
  ></BaiduMap>
</template>

<script>
import BaiduMap from '@/components/larger/baidu-map';

function ComplexCustomOverlay (name, point, size, url) {
  this._point = new BMap.Point(point[0], point[1]);
  this._size = size;
  this._url = url;
  this._name = name;
};

let getIconPos = function (arrived) {
  let truck = document.querySelector('[title = "truck"]');
  let goods = document.querySelector('[title = "goods"]');
  let tl = parseInt(truck.style.left);
  let tt = parseInt(truck.style.top);
  let gl = parseInt(goods.style.left);
  let gt = parseInt(goods.style.top);
  // 由于goods 与 truck 大小不一致，所以goods的left top 需要修正为truck的大小
  gl = gl + 19 / 2 - 23.8 / 2;
  gt = gt + 19 / 2 - 39.3 / 2;
  let disL = tl - gl;
  let disT = tt - gt;

  let targetX, targetY;

  // 算角度
  let x = Math.atan2(disL, -disT);
  let deg = 180 * x / Math.PI;

  let absDisL = Math.abs(disL);
  let absDisT = Math.abs(disT);

  truck.style.transform = 'rotate(' + deg + 'deg)';
  /* eslint-disable */
  truck.offsetWidth;
  if (arrived) {
    if (absDisL < 50 && absDisT < 50) {
      // truck.css({'left': gl+10, 'top': gt+10});
    } else {
      truck.style.left = (tl - disL * 0.8) + 'px';
      truck.style.top = (tt - disT * 0.8) + 'px';
    }
    truck.offsetWidth;
    return [gl, gt];
  } else {
    if (absDisL < 50 && absDisT < 50) {
      // 最小距离 10
      let m = absDisL < 1 ? 0 : disL * 50 / absDisL;
      let n = absDisT < 1 ? 0 : disT * 50 / absDisT;
      targetX = tl - m / 5;
      targetY = tt - n / 5;
    } else {
      targetX = tl - disL / 5;
      targetY = tt - disT / 5;
    }
    return [targetX, targetY];
  }
};

export default {
  name: 'logistic-routes-on-baidu-map',
  components: {
    BaiduMap
  },
  props: {
    dataRef: {
      /**
       * [
       *    { startPoint: '13.13,123.31', endPoint: '1231.123,12321.123' }
       * ]
       */
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  data () {
    return {
      map: null,
      mapv: null,
      mapvLineLayer: null
    };
  },
  methods: {
    onMapReady (map) {
      this.mapv = require('@/lib/map/mapv.js');
      this.map = map;

      ComplexCustomOverlay.prototype = new BMap.Overlay();
      ComplexCustomOverlay.prototype.initialize = function (map) {
        this._map = map;
        let div = this._div = document.createElement('div');
        div.style.position = 'absolute';
        div.title = this._name;
        div.style.zIndex = BMap.Overlay.getZIndex(this._point.lat);
        div.style.width = this._size.w + 'px';
        div.style.height = this._size.h + 'px';
        div.style.background = 'url(' + this._url + ') center center no-repeat';
        map.getPanes().markerPane.appendChild(div);
        return div;
      };
      ComplexCustomOverlay.prototype.draw = function () {
        let map = this._map;
        let pixel = map.pointToOverlayPixel(this._point);
        this._div.style.left = pixel.x - this._size.w / 2 + 'px';
        this._div.style.top = pixel.y - this._size.h / 2 + 'px';
      };
      ComplexCustomOverlay.prototype.show = function (cb) {
        if (this._div) {
          this._div.style.display = '';
          if (cb) cb();
        }
      };
      ComplexCustomOverlay.prototype.hide = function (cb) {
        if (this._div) {
          this._div.style.display = 'none';
          if (cb) cb();
        }
      };
    },
    bindData () {
      if (!this.map) return;

      let data = this.dataRef.map(ci => {
        let start = {
          lng: ci.startPoint.split(',')[0],
          lat: ci.startPoint.split(',')[1]
        };

        let end = {
          lng: ci.endPoint.split(',')[0],
          lat: ci.endPoint.split(',')[1]
        };

        return {
          geometry: {
            type: 'LineString',
            coordinates: [
              [start.lng, start.lat],
              [end.lng, end.lat]
            ]
          },
          count: 100 * Math.random()
        };
      });
      this.map.clearOverlays();
      this.mapvLineLayer && this.mapvLineLayer.destroy();
      let dataSet = new this.mapv.DataSet(data);
      let options = {
        strokeStyle: 'rgba(55, 50, 250, 0.3)',
        globalCompositeOperation: 'lighter',
        shadowColor: 'rgba(55, 50, 250, 0.5)',
        gradient: {0: 'rgba(55, 50, 250, 0)', 1: 'rgba(55, 50, 250, 1)'},
        lineWidth: 0.2,
        draw: 'intensity',
        enableMassClear: false
      };

      /* eslint-disable */
      this.mapvLineLayer = new this.mapv.baiduMapLayer(this.map, dataSet, options);
    },
    drawOverlay (d, arrived) {
      if (!this.map) return;
      // 起点
      if (!d.startLonLat || !d.endLonLat) return;
      let box;
      try {
        let truckLon = Number(d.startLonLat.split(';')[0]);
        let truckLat = Number(d.startLonLat.split(';')[1]);
        let truckOverlay = new ComplexCustomOverlay('truck', [truckLon, truckLat], {w: 23.8, h: 39.3},
          require('@/assets/img/logistics/truck.png'));
        this.map.addOverlay(truckOverlay);
        // 终点
        let goodsLon = Number(d.endLonLat.split(';')[0]);
        let goodsLat = Number(d.endLonLat.split(';')[1]);
        let goodsOverlay = new ComplexCustomOverlay('goods', [goodsLon, goodsLat], {w: 19, h: 19},
          require('@/assets/img/logistics/goods.png'));
        this.map.addOverlay(goodsOverlay);

        // 画路径
        let sy = new BMap.Symbol(BMap_Symbol_SHAPE_BACKWARD_CLOSED_ARROW, {
          fillColor: '#fff',
          fillOpacity: 1,
          scale: 0.7,
          strokeColor: '#fff',
          strokeOpacity: 0
        });

        let icons = new BMap.IconSequence(sy, '5', '15');
        let pois = [
          new BMap.Point(truckLon, truckLat),
          new BMap.Point(goodsLon, goodsLat)
        ];
        let polyline = new BMap.Polyline(pois, {
          enableEditing: false,
          enableClicking: false,
          icons: [icons],
          strokeWeight: 0,
          strokeOpacity: 0.01,
          strokeColor: '#fff'
        });
        this.map.addOverlay(polyline);
        let truck = document.querySelector('[title = "truck"]');
        let goods = document.querySelector('[title = "goods"]');
        box = truck.parentNode;
        box.className = ' box';
        truck.offsetWidth;
        if (arrived) {
          let target = getIconPos(arrived);
          box.className = (box.className || '') + ' transEnd';
          truck.style.left = target[0] + 'px';
          truck.style.top = target[1] + 'px';
          truck.style.opacity = 1;
          // 卸货动画css内
        } else {
          truck.className = (truck.className || '') + ' opa1';
          let target = getIconPos(arrived);
          box.className = (box.className || '') + ' transStart';
          truck.style.left = target[0] + 'px';
          truck.style.top = target[1] + 'px';
          truck.style.opacity = 0;
        }
      } catch (ex) {}

      // 时间为： 汽车和货物的动画总时间
      let timer = setTimeout(() => {
        this.map.clearOverlays();
        if (box) box.className = '';
        clearTimeout(timer);
        timer = null;
      }, 2950);
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

<style lang="scss">
  .box {
    [title=truck] {
      transform-origin: center center;
      opacity: 0;

      &.opa1 {
        opacity: 1;
      }
    }

    [title=goods] {
      transform-origin: center center;
      transform: rotate(-15deg);
      opacity: 0;
    }

    &.transStart {
      [title=truck] {
        transition: left 2s linear, top 2s linear, opacity .5s ease-out 1.5s;
      }
    }

    &.transEnd {
      [title=truck] {
        transition: opacity .2s, left 1.2s linear .2s, top 1.2s linear .2s;
      }

      [title=goods] {
        transform: translate(20px, 20px);
        opacity: 1;
        transition: transform 1s linear 1.6s, opacity 0.2s linear 1.4s;
      }
    }

    span:nth-child(odd) canvas {
      animation: opa .5s linear 0s infinite alternate;
    }

    span:nth-child(even) canvas {
      animation: opa .5s linear .5s infinite alternate;
    }

  }
</style>
