import Vue from 'vue';
import Router from 'vue-router';
import * as views from '@/views/index';
import ROUTES from './config';
import {getStorage} from '@/lib/sessionStorage';
// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/engine' : '';
Vue.use(Router);
let renderRoutes = (rs = []) => {
  rs.forEach(elem => {
    if (elem.component) elem.component = views[elem.component];
    if (elem.children) renderRoutes(elem.children);
  });
};
renderRoutes(ROUTES);

const routes = ROUTES;
const router = new Router({
  routes
  // linkExactActiveClass: 'is-active',
  // mode: 'history'
  // linkActiveClass: 'is-active'
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (getStorage('userInfo')) { // 能够获取session
      next();
    } else {
      // 无session，返回登录页面
      next({
        path: devPath + '/login/index.html',
        query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
      });
    }
  } else {
    next();
  }
});
export default router;
