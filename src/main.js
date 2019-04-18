// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import 'babel-polyfill';
import router from './router';

import MetaInfo from 'vue-meta-info';
import axios from '@/http/http';
import { store } from '@/stores';
// 引入echarts
import ECharts from 'vue-echarts';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/map';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/grid';
import 'echarts/lib/component/geo';
// import echarts from 'echarts';
// import 'echarts-gl';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
// 注册全局组件-不需要注册的组件
import '@/lib/require-components';

// require styles
import 'swiper/dist/css/swiper.css';
import 'animate.css';
import '@/assets/sass/global.scss';

import chinaJson from '@/assets/json/china'; // 引入中国地图数据
import { MAP_PROVINCES } from '@/services/common';
// import shanghai from 'echarts/map/json/province/shanghai'; // 引入中国地图数据
// ECharts.registerMap('shanghai', shanghai);
import theme from '@/theme';
let GREEN = theme('green');
ECharts.registerMap('china', chinaJson);

// 定义全国省份的数组
MAP_PROVINCES.forEach(ele => {
  // import chinaJson from `echarts/map/json/china`; // 引入全国地图数据
  ECharts.registerMap(ele, require(`@/assets/json/province/${ele}`));
});
Vue.config.productionTip = false;
Vue.use(MetaInfo);
// Vue.prototype.$echarts = echarts;
Vue.component('chart', ECharts);
Vue.component('swiper', swiper);
Vue.component('swiperSlide', swiperSlide);
// 将案axios挂载vue上，直接用this.axios访问
Vue.prototype.axios = axios;
Vue.prototype.GREEN = GREEN;
/* eslint-disable no-new */
window.Vues = new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});
