import axios from 'axios';
import {Observable} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { getUrlConfig, REQUEST_METHOD_MAP } from './http.url.config';
/**
 * 异步请求
 * @param action: http.url.config.js下HTTP_URL_MAP配置下的别名
 * @param data={}: 请求-->传递的参数
 * @returns {*}: 返回值 Observables
 */
class AxiosReqs {
  constructor (action, data = {}) {
    this.action = action;
    this.data = data;
    this.params = {};
    this.url = '';
    this.method = REQUEST_METHOD_MAP.GET;
    this.delay = 0;
    this.loop = null;
    this.isWebSocket = false;
    this.interval = null;
    this.resObservable = null;
    this.observer = null;
    this.isList = false;
    this.init();
    this.delayInit = this.delayInit.bind(this);
    this.ObservableReq = this.ObservableReq.bind(this);
  }
  init () {
    // 初始化参数：url/token/method:get-post/loop/delay...
    this.getArgs();
    // 请求方式：websocket/axios
    this.resObservable = this.isWebSocket ? this.websocketReq() : this.ObservableReq();
  }
  delayInit () {
    return new Promise((resolve) => {
      let timer = setTimeout(() => {
        clearTimeout(timer);
        timer = null;
        resolve(this.requests());
      }, this.delay);
    });
  }
  loopInit (observer) {
    if (this.interval) clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.delayInit().then(res => {
        observer.next(res);
      });
    }, this.loop);
    return () => {
      clearInterval(this.interval);
      console.log('end-axios-req');
    };
  }
  ObservableReq () {
    let res = this.delayInit();
    return new Observable(observer => {
      this.observer = observer;
      try {
        res.then(res => {
          observer.next(res);
        });
        if (this.loop > 0) {
          // console.log(this.loopInit(observer));
          return this.loopInit(observer);
        }
      } catch (e) {
        console.log('axiosApi Error:' + e);
      }
    });
  }
  getArgs () {
    // 解构出对应的值;
    let {url, method, delay = 0, loop = 0, isList = false} = getUrlConfig(this.action);
    this.url = url;
    this.method = method;
    this.delay = delay;
    this.loop = loop;
    this.isList = isList;
    // 是否是webSocket的url
    this.isWebSocket = this.url.indexOf('ws://') === 0;
    // 添加token
    this.reqToken();
    // get 请求参数
    this.params = method === REQUEST_METHOD_MAP.GET ? this.data : {};
  }
  reqToken () {
    // 是否携带token
    if (this.action !== 'getNav' && !this.isWebSocket) {
      this.data.token = window.Vues.$store.state.currentPageBrand.token;
    }
  }
  requests () {
    // 请求方法
    return new Promise(resolve => {
      axios({
        url: this.url,
        method: this.method,
        params: this.params,
        data: this.data
      }).then(res => {
        this.reqBackFn(res, resolve);
      }).catch((error) => {
        // 返回的数据解构 -- 字段
        if (error.message) {
          let type = 'error';
          this.reqBackFn({
            data: {
              type,
              error
            }
          }, resolve);
        } else {
          // 如果请求错误，那么15秒后再次发送此请求
          setTimeout(() => {
            this.delayInit().then(res => {
              this.observer.next(res);
            });
          }, 15 * 1000);
        }
      });
    });
  }
  reqBackFn (res, cResolve) {
    // 处理返回数据
    let data = this.isWebSocket ? res : res.data;
    data = typeof data === 'string' ? JSON.parse(data) : data;
    // 返回的数据解构 -- 字段
    if (data.type === 'error') {
      data.type = 'success';
      data.data = this.isList ? [] : {};
    }
    let newData = {
      code: 0,
      data,
      totalCount: 0,
      message: ''
    };
    cResolve(newData);
  }
  websocketReq () {
    return webSocket({
      url: this.url,
      openObserver: {
        next: () => {
          console.log('open ws: ', this.url);
        }
      }
    });
  }
}
let axiosApis = (action, data = {}) => {
  // params: 传入数据
  if (!action) {
    return false;
  }
  return new AxiosReqs(action, data).resObservable;
};
export default axiosApis;
