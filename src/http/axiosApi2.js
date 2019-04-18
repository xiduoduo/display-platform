import axios from 'axios';
import {Observable} from 'rxjs';
import { webSocket } from 'rxjs/webSocket';
import { getUrlConfig, REQUEST_METHOD_MAP } from './http.url.config';
/**
 * 异步请求
 * @param action: http.url.config.js下HTTP_URL_MAP配置下的别名
 * @param data={}: 请求-->传递的参数
 * @returns {*}: 返回值 -> Promise
 */

let axiosApi2 = (action, data = {}) => {
  // params: 传入数据
  if (!action) {
    return false;
  }
  // 解构出对应的值;
  let {url, method, delay = 0, loop = 0} = getUrlConfig(action);
  // 是否是webSocket的url
  let isWebSocket = url.indexOf('ws://') === 0;
  // 是否携带token
  if (action !== 'getNav' && !isWebSocket) {
    data.token = window.Vues.$store.state.currentPageBrand.token;
  }
  // get 请求参数
  let params = method === REQUEST_METHOD_MAP.GET ? data : {};
  // 具体的请求
  // let requests = '';
  let run = (resolve) => {
    let callbackFn = (res) => {
      // 解构数据
      let data = isWebSocket ? res : res.data;
      data = typeof data === 'string' ? JSON.parse(data) : data;
      // 返回的数据解构 -- 字段
      let resDatas = {
        code: 0,
        data,
        totalCount: 0,
        message: ''
      };
      resolve(resDatas);
    };
    // 请求方法
    let requests = () => {
      axios({
        url,
        method,
        params,
        data
      }).then(callbackFn).catch((error) => {
        callbackFn({
          data: {
            error
          }
        });
      });
    };
    // delay延迟加载
    let timer = setTimeout(() => {
      // console.log('delay...');
      clearTimeout(timer);
      if (!isWebSocket) {
        requests();
      }
    }, delay);
  };
  let pro = new Promise((resolve) => {
    run(resolve);
  });
  // ....
  let loops = (observer) => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      timer = null;
      let newPro = new Promise((resolve) => {
        run(resolve);
      });
      /* TODO: pro 没有变，返回的值也不变 */
      newPro.then(res => {
        // console.log(res);
        observer.next(res);
        loops(observer);
      });
    }, loop);
    return timer;
  };
  // 返回订阅器
  if (isWebSocket) {
    return webSocket({
      url,
      openObserver: {
        next: () => {
          console.log('open ws: ', url);
        }
      }
    });
  } else {
    return new Observable(observer => {
      try {
        pro.then(res => {
          observer.next(res);
          if (loop > 0) {
            loops(observer);
          }
        });
      } catch (e) {
        console.log('axiosApi Error:' + e);
      }
    });
  }
};

export default axiosApi2;
