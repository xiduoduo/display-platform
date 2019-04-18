# 展示平台 + 康明斯 + 新能源
> ## 维护与开发请先看 -> 目录介绍:如需新增或维护项目请按目录结构进行开发、维护
##### 测试地址: [展示平台http://10.100.2.217:8190/v3/index.html](http://10.100.2.217:8190/v3/index.html)
##### 测试地址: [康明斯平台http://10.100.2.217:8190/engine/index.html](http://10.100.2.217:8190/engine/index.html)
##### 测试地址: [新能源平台http://10.100.2.217:8190/energy/index.html](http://10.100.2.217:8190/energy/index.html)
##### 正式地址: [展示平台http://demo.ifoton.com.cn/v2/index.html](http://demo.ifoton.com.cn/v2/index.html)
##### 正式地址: [康明斯平台http://demo.ifoton.com.cn/engine/index.html](http://demo.ifoton.com.cn/engine/index.html)
##### 正式地址: [新能源平台http://demo.ifoton.com.cn/energy/index.html](http://demo.ifoton.com.cn/energy/index.html)

> 本项目开发基于：vue^2.5.2
#### 目录介绍
> 主体目录基于vue-cli创建。主要介绍src和cofig目录

> 注意:src/components/no-register内部组件命名【不可重名、尽量主文件名为index.vue】如果包下有index.vue文件，那么包名就是组件使用的名称-包名小写可带横线-以大驼峰命名方式使用。如: nav-display => NavDisplay
```
> /config
  > pro-dir-config.js 打包生成项目文件夹目录名称
  > pro-display.env.js 展示平台打包输出配置
  > pro-energy.env.js 新能源平台打包输出配置
  > pro-kms.env.js 康明斯平台打包输出配置
> /src
  > /assets: 静态资源：图片、css、json文件
    > green 绿色主题内单独应用到的静态资源：图片、css、json文件
    > fonts 字体、iconfont文件
    > json 内部是echarts地图json数据，如果后台返回【地区字段】名不符合echarts内部的地区名称，请在src/components/larger/echarts/map/js内部去维护。PS:尽量不要直接更改json内部地区名称。【echarts4.0天津地区缺失蓟州区，后期维护需注意】
    > sass 公用css
      > theme.scss 这个是用来引入src/theme/皮肤样式的
  > /components: 组件
    > abandoned 从未使用的组件放到这里：防止以后还能用
    > larger 比较大的基础组件
    > layout 布局组件
      > 内部根据展示、康明斯、新能源平台区分了3个组件，各自维护、各不冲突。后期维护：如果存在的布局组件不能复用，请新建项目包进行开发
    > no-register 不需要手动注册直接可用:具体请看内部具体组件使用方式【此目录要求放入复用性高的组件或者小巧的】
      > base 小组件
        > nav 组件：根据展示、康明斯、新能源平台区分了3个组件。后期维护：如果存在的导航组件不能复用，请新建项目包进行开发
      > slot 插槽组件
  > /http 异步
    > http.js 请求axios的基础配置
    > http.url.config.js 引入/src/mock-data/config.js，通过配置生成具体请求
    > axiosApi.js 引入./http.url.config.js，封装请求为配置方式
  > /lib 基础公用js：注意本项目尽可能不用jQuery，所以一下基础方法可以单独写在这里
  > /mock-data 本地启动fe-mock-data代理服务json文件及config.js配置文件
  > /project 项目文件:根据展示、康明斯、新能源平台区分了3个目录
    > display 展示平台
    > kms 康明斯平台
    > energy 新能源平台
  > /router 路由文件:根据展示、康明斯、新能源平台区分了3个文件【具体请看文件内部写法】
    > displayRoute.js
    > energyRoute.js
    > kmsRoute.js
  > /services 接口调用文件:根据展示、康明斯、新能源平台区分了3个文件夹
    > common.js 存放静态变量
  > /stores 全局状态管理vuex
  > /theme 皮肤文件
    > green 已经应用的皮肤配置
    > theme.globle.scss 维护的公共样式
  > /views 试图组件，来加载页面组件
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
npm run build-display 打包展示平台
npm run build-kms 打包康明斯平台
npm run build-energy 打包新能源平台

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
