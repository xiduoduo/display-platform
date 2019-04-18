// 开发环境带着 engine；生产环境不带engine
let devPath = process.env.NODE_ENV === 'development' ? '/energy' : '';
const energyRoute = [
  {
    path: devPath || '/', // 新能源路由
    component: 'EnergyLayout', // 新能源背景
    children: [
      {
        path: '',
        component: 'EnergyIndex',
        children: [
          {
            path: '',
            redirect: 'index.html'
          },
          {
            path: 'index.html',
            name: 'energypartone',
            meta: {
              keepAlive: true // 需要被缓存
            },
            component: 'EnergyPartOne'
          },
          {
            path: 'index/parttwo/index.html',
            name: 'energyparttwo',
            meta: {
              keepAlive: true // 需要被缓存
            },
            component: 'EnergyPartTwo'
          },
          {
            path: 'index/partThree/index.html',
            name: 'energypartThree',
            meta: {
              keepAlive: true // 需要被缓存
            },
            component: 'EnergyPartThree'
          }
        ]
      },
      {
        path: 'product/index.html',
        name: 'energyproduct',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: 'EnergyProduct'
      },
      {
        path: 'logistics/index.html',
        name: 'energylogistics',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: 'EnergyLogistics'
      },
      {
        path: 'operative/index.html',
        name: 'energyoperative',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: 'EnergyOperative'
      },
      {
        path: 'service/index.html',
        name: 'energyservice',
        meta: {
          keepAlive: true // 需要被缓存
        },
        component: 'EnergyService'
      }
    ]
  }
];
module.exports = energyRoute;
