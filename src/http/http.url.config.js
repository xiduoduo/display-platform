/**
 * 设置api接口
 * @type {boolean}
 * localhostDev = true 开发环境 : 生产环境;
 * @param url: 必填required
 * @param method: 请求方式 -- default: 'get'
 * @param isList: 是否需要列表格式[] -- default: false
 * @param delay: 请求延迟，单位毫秒 -- default: 0
 * @param loop: 循环请求，单位毫秒 -- default: 0
 */
import * as newRoutes from '@/mock-data/config.js';
// console.log(newRoutes.routes);
let websockertPro = 'ws://demo.ifoton.com.cn';
let websockertDev = 'ws://localhost:8081';
let HTTP_URL_MAP = newRoutes.routes;
Object.keys(HTTP_URL_MAP).forEach(key => {
  // websocket
  if (HTTP_URL_MAP[key].method === 'ws') {
    HTTP_URL_MAP[key].url = process.env.NODE_ENV !== 'production' ? websockertDev + HTTP_URL_MAP[key].url : websockertPro + HTTP_URL_MAP[key].url;
  }
});
export const REQUEST_METHOD_MAP = {
  GET: 'get',
  POST: 'post'
};
let getUrlConfig = (action) => {
  let result = Object.assign({
    url: '',
    action: action,
    method: REQUEST_METHOD_MAP.GET,
    isList: false,
    delay: 0
  }, HTTP_URL_MAP[action]);
  return result;
};
export { getUrlConfig };
