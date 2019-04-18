let displayRoute = require('./displayRoute');
let kmsRoute = require('./kmsRoute');
let energyRoute = require('./energyRoute');
let autopilotRoute = require('./autopilotRoute');

// 应用哪段路由
let ROUTES = [];
if (process.env.NODE_ENV === 'development') {
  // 开发模式
  ROUTES = displayRoute.concat(kmsRoute, energyRoute, autopilotRoute);
} else {
  // 生产模式
  if (process.env.PROJECT === 'display') {
    ROUTES = displayRoute;
  } else if (process.env.PROJECT === 'kms') {
    ROUTES = kmsRoute;
  } else if (process.env.PROJECT === 'energy') {
    ROUTES = energyRoute;
  } else if (process.env.PROJECT === 'autopilot') {
    ROUTES = autopilotRoute;
  } else {
    ROUTES = displayRoute.concat(kmsRoute, energyRoute);
  }
}
module.exports = ROUTES;
