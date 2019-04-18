// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/autopilot' : '';
const kmsRoute = [
  {
    path: devPath || '/', // 自动驾驶路由
    component: 'AutoLayout', // 自动驾驶背景
    meta: { // 是否需要登录访问
      keepAlive: true
    },
    children: [
      {
        path: '',
        redirect: 'index.html'
      },
      {
        path: 'index.html',
        meta: {
          keepAlive: true
        },
        name: 'AutoIndex',
        component: 'AutoIndex'
      },
      {
        path: 'monitoring/index.html',
        meta: {
          keepAlive: true
        },
        name: 'AutoMonitoring',
        component: 'AutoMonitoring'
      },
      {
        path: 'history/index.html',
        meta: {
          keepAlive: true
        },
        name: 'AutoHistory',
        component: 'AutoHistory'
      }
    ]
  }
];
module.exports = kmsRoute;
