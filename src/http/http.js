/**
 * http配置
 */
import axios from 'axios';
// import router from '@/router';
import qs from 'qs';

// axios 配置

axios.defaults.timeout = 300000;
// axios.defaults.headers.post = {};
// axios.defaults.headers.common = {};
// axios.defaults.headers.put = {};
// axios.defaults.headers.patch = {};
// axios.defaults.headers = {
//   'Content-type': 'application/x-www-form-urlencoded'
// };
// 映射时，后端接口服务器
// axios.defaults.baseURL = `http://localhost:3000`;
// http request 拦截器
let token = true;
axios.interceptors.request.use(
  config => {
    if (token) {
      // config.headers.Authorization = `BasicAuth ${stores.state.token}`;
    }
    config.method === 'post' ? config.data = qs.stringify({...config.data}) : config.params = {...config.params};
    return config;
  },
  err => {
    return Promise.reject(err);
  });

// http response 拦截器
axios.interceptors.response.use(
  response => {
    // console.log(response)
    // if (response.data.errno) {
    //   response.data.
    // }
    return response;
  },
  error => {
    if (error.response) {
      // if (error.response.status === 401 && document.location.pathname.startsWith('/console/')) {
      // ToastTip.warn('登录信息失效，请重新登录！');
      // }
      // switch (error.response.status) {
      //   case 401:
      //     // console.log(error.response);
      //     // 登录超时, token超时
      //     // 401 清除token信息并跳转到登录页面
      //     router.replace({
      //       name: '/passport/login/index.html',
      //       query: {redirect: router.currentRoute.fullPath}
      //     });
      //     break;
      //   default:
      //   // console.log('err-login')
      //   /* 普通401拦截直接返回到登录页面 */
      //   // stores.commit(types.LOGOUT);
      //   // router.push('/');
      // }
    }
    return Promise.reject(error.response.data);
  });

export default axios;
