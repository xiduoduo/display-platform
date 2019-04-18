import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
// 引入单独模块
import * as types from './mutation-types';
// import {BRAND_MAP} from '@/services/common';

Vue.use(Vuex);

// 开放环境:打印store
const debug = process.env.NODE_ENV !== 'production';

export const store = new Vuex.Store({
  state: {
    paths: [], // 是否执行动画
    currentPageBrand: {}, // 当前车型导航{ name: '', token: '' }
    menuList: [], // 全部车型导航
    webSocketData: { // webscoket数据: 这个里面的内容都是字符串格式的，方便对比内容是否变化
      rt_fault: '', // 每次只返回一条json数据
      new_product: '', // 返回数组
      vl_start: '', // 返回数组
      vl_end: '' // 返回数组
    }
  },
  getters: {
    getPaths (state) {
      return state.paths;
    },
    // 返回导航数据
    currentPageBrand (state) {
      return state.currentPageBrand;
    },
    getMenuList (state) {
      return state.menuList;
    },
    // 返回websocket数据
    getWebsocket_rt_fault (state) {
      return state.webSocketData.rt_fault;
    },
    getWebsocket_new_product (state) {
      return state.webSocketData.new_product;
    },
    getWebsocket_vl_start (state) {
      return state.webSocketData.vl_start;
    },
    getWebsocket_vl_end (state) {
      return state.webSocketData.vl_end;
    }
  },
  actions: {
    // 只用于异步/请求
    // async initCurrentUser ({commit, state}) {
    //   let user = await profileService.getCurrentUser();
    //   if (user.name) {
    //     commit(STORE_MUTATION_MAP.UPDATE_CURRENT_USER, user);
    //   }
    // }
  },
  mutations: {
    [types.UPDATE_RUN_NUM_BOOL] (state, pathName) {
      // 是否执行动画
      if (state.paths.indexOf(pathName) !== -1) return;
      state.paths.push(pathName);
    },
    [types.UPDATE_GLOBAL_BRAND] (state, brand) {
      // 当前车型token
      state.currentPageBrand = brand;
    },
    [types.UPDATE_NAV_MENU_LIST] (state, data) {
      // 车型导航token数据
      state.menuList = data;
    },
    [types.UPDATE_WEBSOCKET_DATA_MAP] (state, data) {
      if (!data || !data.model) return false;
      state.webSocketData[data.model] = JSON.stringify(data);
    }
  },
  modules: {
  },
  strict: debug, // 开发环境下使用严格模式
  plugins: debug ? [createLogger()] : [] // 开发环境输出log
});
