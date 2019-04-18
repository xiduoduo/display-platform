const displayRoute = [{
  path: '/', // 展示平台路由
  // name: 'layout',
  // meta: {
  //   keepAlive: true // 需要被缓存
  // },
  component: 'Layout',
  children: [
    {
      path: '',
      component: 'Index',
      children: [
        {
          path: '',
          redirect: 'index.html'
        },
        {
          path: 'index.html',
          name: 'partone',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: 'PartOne'
        },
        {
          path: 'index/parttwo/index.html',
          name: 'parttwo',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: 'PartTwo'
        },
        {
          path: 'index/partThree/index.html',
          name: 'partThree',
          meta: {
            keepAlive: true // 需要被缓存
          },
          component: 'PartThree'
        }
      ]
    },
    {
      path: 'trial/index.html',
      name: 'trial',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: 'Trial'
    },
    {
      path: 'product/index.html',
      name: 'product',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: 'Product'
    },
    {
      path: 'logistics/index.html',
      name: 'logistics',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: 'Logistics'
    },
    {
      path: 'operative/index.html',
      name: 'operative',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: 'Operative'
    },
    {
      path: 'service/index.html',
      name: 'service',
      meta: {
        keepAlive: true // 需要被缓存
      },
      component: 'Service'
    }
  ]
}];

module.exports = displayRoute;
