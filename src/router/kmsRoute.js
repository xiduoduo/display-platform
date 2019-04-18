// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/engine' : '';
const kmsRoute = [
  {
    path: devPath + '/login/index.html', // 康明斯
    name: 'KmsLogin',
    component: 'KmsLogin' // 康明斯登录页
  },
  {
    path: devPath || '/', // 康明斯路由
    component: 'KmsLayout', // 康明斯背景
    meta: { // 是否需要登录访问
      requireAuth: true,
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
        name: 'KmsIndex',
        component: 'KmsIndex'
      },
      {
        path: 'mileage/index.html',
        meta: {
          keepAlive: true
        },
        name: 'KmsMileage',
        component: 'KmsMileage'
      }
    ]
  }
];
module.exports = kmsRoute;
