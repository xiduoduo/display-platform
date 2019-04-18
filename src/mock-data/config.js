const REQUEST_METHOD_MAP = {
  GET: 'get',
  POST: 'post'
};
let mapDataCount = 0;

// mock-data下json文件夹位置
let kmsPage1PublicDir = 'src/mock-data/json/kms/page1/';
let kmsPage2PublicDir = 'src/mock-data/json/kms/page2/';
// let websockertPro = 'ws://demo.ifoton.com.cn';
// let websockertDev = 'ws://localhost:8081';
let displayDir = 'src/mock-data/json/display';
let energyDir = 'src/mock-data/json/energy';

// 防止url一样，mock-data返回相同数据
let energyUrl = process.env.NODE_ENV !== 'production' ? '/energy' : '';

// 根据生产环境区分websocket
let websocketUrl = '';
if (process.env.NODE_ENV !== 'production') {
  // 开发环境
  // 开发环境返回数据、接口、文件、services都是相同的
  websocketUrl = '/ws/common';
} else {
  // 生产环境
  // 接口: display: common; energy: newEnergy
  websocketUrl = process.env.PROJECT === 'display' ? '/ws/common' : '/ws/newEnergy';
}
let intervalId = null;

// 康明斯token;
let kmsToken = '44839dc2bb5640e685f5ee651b7a27c9';

// 具体接口配置
let routes = {
  'websocket': {
    url: websocketUrl,
    method: 'ws', // 此项表示是websocket模拟，必填
    // interval: 3000, // 后台返回数据间隔（毫秒值），如不配置值返回一次
    json: displayDir + '/websocket/all.json',
    renderFn: function (dataRes, ws, req, ext) {
      clearInterval(intervalId);
      // let num = Number(data.data.code);
      let type = ['rt_fault', 'vl_end', 'vl_start', 'new_product'];
      let num = 0;
      intervalId = setInterval(() => {
        if (ws.readyState === 1) {
          if (num > 3) {
            num = 0;
          }
          if (num === 0) {
            dataRes[type[num]].data.code++;
          }
          ws.send(JSON.stringify(dataRes[type[num]]));
          num++;
        } else {
          clearInterval(intervalId);
        }
      }, 5000);
    }
  },
  'getDate': {
    url: '/display/user/systime.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 10 * 1000,
    renderFn: function (data, req, res, ext) {
      let d = new Date();
      let obj = {
        'type': 'success',
        'content': '',
        'data': d.getTime()
      };
      res.status(200).send(obj);
    }
  },
  'getNav': { // 导航-车型
    url: '/display/user/getBrands.json',
    method: REQUEST_METHOD_MAP.GET,
    isList: true,
    // delay: 10000,
    json: displayDir + '/nav.json'
  },
  // part-one
  'getAmount': { // 实时数据
    url: '/display/car/amount.json',
    loop: 5 * 1000,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/part-one/amount.json',
    renderFn: function (data, req, res, ext) {
      var token = req.query.token;
      res.status(200).send(data[token]);
    }
  },
  'getDistribute': { // 地图数据
    url: '/display/car/distribute.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 30 * 60 * 1000, // 30分钟请求一次
    json: displayDir + '/part-one/distribute.json'
  },
  'getOnline': { // 在线车辆-线图
    url: '/display/car/online.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/part-one/online.json',
    loop: 5 * 60 * 1000, // 5分钟请求一次
    renderFn: function (data, req, res, ext) {
      var token = req.query.token;
      if (token === kmsToken) {
        let d = ext.fs.readFileSync(
          kmsPage1PublicDir + 'getRightOnLineData.json', 'utf-8');
        res.status(200).send(d);
      } else {
        res.status(200).send(data);
      }
    }
  },
  'getMonthRegister': { // 月注册车辆-柱图
    url: '/display/car/monthRegister.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000, // 24小时请求一次
    json: displayDir + '/part-one/monthRegister.json'
  },
  // part-two
  'getDataAmount': { // 数据采集
    url: '/display/analysis/dataAmount.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 5 * 1000,
    json: displayDir + '/part-two/dataAmount.json'
  },
  'getOuManRunAnalysis': { // 欧曼-行驶分析
    url: '/display/analysis/runAnalysis.json',
    method: REQUEST_METHOD_MAP.GET,
    // loop: 5 * 1000,
    json: displayDir + '/part-two/runAnalysis.json'
  },
  'getMonthBehavior': { // 不规范驾驶行为
    url: '/display/analysis/monthBehavior.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000,
    json: displayDir + '/part-two/monthBehavior.json'
  },
  'getMonthFaultWarn': { // 本月故障报警
    url: '/display/analysis/monthFaultWarn.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000,
    json: displayDir + '/part-two/monthFaultWarn.json'
  },
  'getDayAlarm': { // 今日故障报警
    url: '/display/analysis/dayAlarm.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    loop: 60 * 60 * 1000,
    json: displayDir + '/part-two/dayAlarm.json'
  },
  // part-three
  'getRunSummary': { // 总里程
    url: '/display/analysis/runSummary.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 5 * 1000,
    json: displayDir + '/part-three/runSummary.json'
  },
  'getAvgVelocity': { // 平均速度
    url: '/display/analysis/avgVelocity.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000,
    json: displayDir + '/part-three/avgVelocity.json'
  },
  'getRunAnalysis': { // 行驶分析
    url: '/display/analysis/runAnalysis.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/part-three/runAnalysis.json'
  },
  'getLocList': { // 地图热区
    url: '/display/car/locList.json',
    method: REQUEST_METHOD_MAP.GET,
    isList: true,
    json: displayDir + '/part-three/locList.json'
  },
  'getDealer': { // 经销商
    url: '/display/dealer/list.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/part-three/list.json'
  },
  'getServicer': { // 服务商
    url: '/display/servicer/list.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/part-three/list2.json'
  },
  // trial-试制
  'getSummaryInfo': { // 总试制任务数
    url: '/display/trial/summaryInfo.json',
    json: displayDir + '/trial/summaryInfo.json'
  },
  'getListSummaryGbProvince': { // 地图数据
    url: '/display/trial/listSummaryGbProvince.json',
    isList: true,
    json: displayDir + '/trial/listSummaryGbProvince.json'
  },
  'getCurrentSummaryInfo': { // 当前数据
    url: '/display/trial/currentSummaryInfo.json',
    json: displayDir + '/trial/currentSummaryInfo.json'
  },
  'getListTaskGroupByType': { // 试制试验类型
    url: '/display/trial/listTaskGroupByType.json',
    isList: true,
    json: displayDir + '/trial/listTaskGroupByType.json'
  },
  'getListDaysTaskAnalysis': { // 试制试验车辆数、行驶统计
    url: '/display/trial/listDaysTaskAnalysis.json',
    isList: true,
    json: displayDir + '/trial/listDaysTaskAnalysis.json'
  },
  'getListTask': { // 试制试验-进度
    url: '/display/trial/listTask.json',
    isList: true,
    json: displayDir + '/trial/listTask.json'
  },
  // product-生产
  'getProdCBrand': { // 生产统计
    url: '/display/car/prodCBrand.json',
    isList: true,
    json: displayDir + '/product/prodCBrand.json',
    delay: 3000
  },
  'getProdCType': { // 车型对应-生产统计
    url: '/display/car/prodCType.json',
    isList: true,
    json: displayDir + '/product/prodCType.json',
    delay: 3000
  },
  'getProdTop20': { // 生产信息
    url: '/display/car/prodTop20.json',
    isList: true,
    json: displayDir + '/product/prodTop20.json',
    delay: 3000
  },
  // 物流
  // 物流概要信息
  'getSummary': {
    url: '/display/order/summary.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/summary.json'
  },
  // 获取在途线路信息
  'getOnroadLine': {
    url: '/display/order/onroadLine.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/onroadLine.json'
  },
  // 风险预警
  'getRiskWarning': {
    url: '/display/order/riskWarn.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/riskWarn.json'
  },
  // 获取最新到达信息
  'getLastArrived': {
    url: '/display/order/lastArrived.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/lastArrived.json'
  },
  // 获取最新已发车信息
  'getLastStart': {
    url: '/display/order/lastStart.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/lastStart.json'
  },
  // 运输评价
  'getScore': {
    url: '/display/order/score.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/score.json'
  },
  // 运单走势
  'getTrend': {
    url: '/display/order/trend.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/logistics/trend.json'
  },
  // 运行
  // 获取今日运行数据
  'getOperativeList': {
    url: '/display/car/dayLocHotspot.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/operative/getOperativeList.json',
    loop: 2 * 60 * 60 * 1000
    // getParam () {
    //   let ZBase = require('@/lib/zbase');
    //   let date = new Date();
    //   let hour = date.getHours();
    //   hour = hour % 2 === 0 ? hour : (hour - 1);
    //   let param = {
    //     timeMillis: (new Date(ZBase.Date.getDateByFormat(date, 'yyyy/MM/dd ' + hour + ':00:00'))).getTime()
    //   };
    //   return param;
    // }
  },
  // 驾驶行为
  'getOperativeDrivingList': {
    url: '/display/analysis/brandBehavior.json',
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/operative/getOperativeDrivingList.json'
  },
  // 速度区间分布
  'getOperativeSpeedRangeList': {
    url: '/display/analysis/velocitySection.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/operative/getOperativeSpeedRangeList.json'
  },
  // 获取平均油耗、平均速度、平均里程
  'getOperativeRecordList': {
    url: '/display/analysis/runDaily.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/operative/getOperativeRecordList.json'
  },
  // 服务
  // 故障数据
  'getFaultRanking': {
    url: '/display/analysis/faultRanking.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/service/faultRanking.json'
  },
  // 报警数据
  'getAlarmRanking': {
    url: '/display/analysis/alarmRanking.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/service/alarmRanking.json'
  },
  // 真实性排行
  'getRepairByPrvRank': {
    url: '/display/servicer/repairByPrvRank.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/service/repairByPrvRank.json'
  },
  // 今日在站车辆数
  'getInStationCar': {
    url: '/display/servicer/inStationCar.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: displayDir + '/service/inStationCar.json'
  },
  /* ---------------Start-康明斯--------------- */
  'getKmsPage1_mapData_distr': {
    url: '/display/engine/distr.json',
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage1PublicDir + 'distr.json'
  },
  'getKmsPage1_mapData_onlineDistr': {
    url: '/display/engine/onlineDistr.json',
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage1PublicDir + 'onlineDistr.json'
  },
  'getKmsPage1_mapData_factDistr': {
    url: '/display/engine/factDistr.json',
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage1PublicDir + 'factDistr.json',
    renderFn: function (data, req, res, ext) {
      var factory = req.query.factory;
      res.status(200).send(data[factory]);
    }
  },
  'getKmsPage1_leftData': {
    url: '/display/engine/amount.json',
    method: REQUEST_METHOD_MAP.GET,
    loop: 1000 * 5,
    renderFn: function (data, req, res, ext) {
      let d = {
        'type': 'success',
        'content': '车辆数取得成功',
        'data': {
          'ONLINENUM': 131025,
          'ALLNUM': 174027 + Math.round((Math.random() * 10)),
          'FACTORY': [
            {
              'NAME': 'ISF',
              'NUM': 59378 + Math.round((Math.random() * 10))
            }, {
              'NAME': 'ISG',
              'NUM': 114648 + Math.round((Math.random() * 10))
            }]
        }
      };
      res.status(200).send(d);
    }
  },
  'getKmsPage1_rightOnLineData': {
    // 在上面，搜索url
    url: '/display/car/online.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET
    // json: kmsPage1PublicDir + 'getRightOnLineData.json'
  },
  'getKmsPage1_rightFactoryData': {
    url: '/display/engine/monthAddByFact.json',
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage1PublicDir + 'getRightFactoryData.json',
    renderFn: function (data, req, res) {
      var factory = req.query.factory;
      res.status(200).send(data[factory]);
    }
  },
  // 康明斯 mileage
  'getKmsPage2_getMileageTime': {
    url: `${energyUrl}/display/analysis/runSummary.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage2PublicDir + 'getMileageTime.json'
  },
  'getKmsPage2_faultTop20ByMonth': {
    url: '/display/analysis/faultTop20ByMonth.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage2PublicDir + 'faultTop20ByMonth.json'
  },
  'getKmsPage2_getMileageSection': {
    url: '/display/analysis/dayMileageSection.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage2PublicDir + 'getMileageSection.json'
  },
  'getKmsPage2_getChartRunAndOil': {
    url: '/display/analysis/monthRunInfo.json',
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage2PublicDir + 'getChartRunAndOil.json'
  },
  'getKmsPage2_getMapData': {
    url: '/display/car/locHotspot.json',
    method: REQUEST_METHOD_MAP.GET,
    json: kmsPage2PublicDir + 'getMapData.json',
    renderFn: function (dataRes, req, res, ext) {
      var obj = dataRes[mapDataCount];
      mapDataCount++;
      mapDataCount = mapDataCount > 6 ? 0 : mapDataCount;
      res.status(200).send(obj);
    }
  },
  // End kms page2
  /* ---------------Start-新能源--------------- */
  getEnergyNav: {
    url: '/display/user/getNewEnergyBrands.json',
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/energyNav.json`
  },
  'getEnergyDistribute': { // 地图数据
    url: `${energyUrl}/display/car/distribute.json`,
    method: REQUEST_METHOD_MAP.GET,
    loop: 30 * 60 * 1000, // 30分钟请求一次
    json: `${energyDir}/part-one/distribute.json`
  },
  'getEnergyAmount': { // 实时数据
    url: `${energyUrl}/display/car/amount.json`,
    loop: 5 * 1000,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-one/amount.json`
  },
  'getEnergyOnline': { // 在线车辆-线图
    url: `${energyUrl}/display/car/online.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-one/online.json`,
    loop: 5 * 60 * 1000 // 5分钟请求一次
  },
  'getEnergyMonthRegister': { // 月注册车辆-柱图
    url: `${energyUrl}/display/car/monthRegister.json`,
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000, // 24小时请求一次
    json: `${energyDir}/part-one/monthRegister.json`
  },
  // part-two
  'getEnergyDataAmount': { // 数据采集
    url: `${energyUrl}/display/analysis/dataAmount.json`,
    method: REQUEST_METHOD_MAP.GET,
    loop: 5 * 1000,
    json: `${energyDir}/part-two/dataAmount.json`
  },
  'getEnergyMonthFaultWarn': { // 本月故障报警
    url: `${energyUrl}/display/analysis/monthFaultWarn.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000,
    json: `${energyDir}/part-two/monthFaultWarn.json`
  },
  'getEnergyDayAlarm': { // 今日故障报警
    url: `${energyUrl}/display/analysis/dayAlarm.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    loop: 60 * 60 * 1000,
    json: `${energyDir}/part-two/dayAlarm.json`
  },
  // part-three
  'getEnergyRunSummary': { // 总里程
    url: `${energyUrl}/display/analysis/totalRunData.json`,
    method: REQUEST_METHOD_MAP.GET,
    loop: 5 * 1000,
    json: `${energyDir}/part-three/runSummary.json`
  },
  'getEnergyAvgVelocity': { // 平均速度
    url: `${energyUrl}/display/analysis/avgVelocity.json`,
    method: REQUEST_METHOD_MAP.GET,
    loop: 24 * 60 * 60 * 1000,
    json: `${energyDir}/part-three/avgVelocity.json`
  },
  'getEnergyRunAnalysis': { // 行驶分析
    url: `${energyUrl}/display/analysis/runAnalysis.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-three/runAnalysis.json`
  },
  'getEnergyLocList': { // 地图热区
    url: `${energyUrl}/display/car/locList.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-three/locList.json`
  },
  'getEnergyDealer': { // 经销商
    url: `${energyUrl}/display/dealer/list.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-three/list.json`
  },
  'getEnergyServicer': { // 服务商
    url: `${energyUrl}/display/servicer/list.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/part-three/list2.json`
  },
  // product-生产
  'getEnergyProdCBrand': { // 生产统计
    url: `${energyUrl}/display/car/prodCBrand.json`,
    isList: true,
    json: `${energyDir}/product/prodCBrand.json`
  },
  'getEnergyProdCType': { // 车型对应-生产统计
    url: `${energyUrl}/display/car/prodCType.json`,
    isList: true,
    json: `${energyDir}/product/prodCType.json`
  },
  'getEnergyProdTop20': { // 生产信息
    url: `${energyUrl}/display/car/prodTop20.json`,
    isList: true,
    json: `${energyDir}/product/prodTop20.json`
  },
  // 物流
  // 物流概要信息
  'getEnergySummary': {
    url: `${energyUrl}/display/order/summary.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/summary.json`
  },
  // 获取在途线路信息
  'getEnergyOnroadLine': {
    url: `${energyUrl}/display/order/onroadLine.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/onroadLine.json`
  },
  // 风险预警
  'getEnergyRiskWarnData': {
    url: `${energyUrl}/display/order/riskWarn.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/riskWarn.json`
  },
  // 获取最新到达信息
  'getEnergyLastArrived': {
    url: `${energyUrl}/display/order/lastArrived.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/lastArrived.json`
  },
  // 获取最新已发车信息
  'getEnergyLastStart': {
    url: `${energyUrl}/display/order/lastStart.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/lastStart.json`
  },
  // 运输评价
  'getEnergyScore': {
    url: `${energyUrl}/display/order/score.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/score.json`
  },
  // 运单走势
  'getEnergyTrend': {
    url: `${energyUrl}/display/order/trend.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/logistics/trend.json`
  },
  // 运行
  // 获取今日运行数据
  'getEnergyOperativeList': {
    url: `${energyUrl}/display/car/dayLocHotspot.json`,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/operative/getOperativeList.json`,
    loop: 2 * 60 * 60 * 1000
    // getParam () {
    //   let ZBase = require('@/lib/zbase');
    //   let date = new Date();
    //   let hour = date.getHours();
    //   hour = hour % 2 === 0 ? hour : (hour - 1);
    //   let param = {
    //     timeMillis: (new Date(ZBase.Date.getDateByFormat(date, 'yyyy/MM/dd ' + hour + ':00:00'))).getTime()
    //   };
    //   return param;
    // }
  },
  // 速度区间分布
  'getEnergyOperativeSpeedRangeList': {
    url: `${energyUrl}/display/analysis/velocitySection.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/operative/getOperativeSpeedRangeList.json`
  },
  // 获取平均油耗、平均速度、平均里程、油耗走势
  'getEnergyOperativeRecordList': {
    url: `${energyUrl}/display/analysis/runDaily.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/operative/getOperativeRecordList.json`
  },
  // 服务
  // 故障数据
  'getEnergyFaultRanking': {
    url: `${energyUrl}/display/analysis/faultRanking.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/service/faultRanking.json`
  },
  // 报警数据
  'getEnergyAlarmRanking': {
    url: `${energyUrl}/display/analysis/alarmRanking.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/service/alarmRanking.json`
  },
  // 真实性排行
  'getEnergyRepairByPrvRank': {
    url: `${energyUrl}/display/servicer/repairByPrvRank.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/service/repairByPrvRank.json`
  },
  // 今日在站车辆数
  'getEnergyInStationCar': {
    url: `${energyUrl}/display/servicer/inStationCar.json`,
    isList: true,
    method: REQUEST_METHOD_MAP.GET,
    json: `${energyDir}/service/inStationCar.json`,
    renderFn: function (dataRes, req, res, ext) {
      var token = req.query.token;
      if (token === 'ALL') {
        res.status(200).send(dataRes);
      } else {
        res.status(200).send(null);
      }
    }
  }
};

Object.keys(routes).forEach(key => {
  routes[key].url = process.env.NODE_ENV !== 'production' &&
  routes[key].method !== 'ws' ? `/api${routes[key].url}` : `${routes[key].url}`;
});
let newRoutes = {};
newRoutes.routes = routes;
module.exports = newRoutes;
