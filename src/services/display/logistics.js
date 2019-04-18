import axiosApi from '@/http/axiosApi';

export default class LogisticsService {
  static getSummary () {
    return axiosApi('getSummary');
  }

  static getMapData () {
    return axiosApi('getOnroadLine');
  }

  static getRiskWarnData () {
    return axiosApi('getRiskWarning');
  }

  static getLastArrived () {
    return axiosApi('getLastArrived');
  }

  static getLastStart () {
    return axiosApi('getLastStart');
  }

  static getScore () {
    return axiosApi('getScore');
  }

  static getTrend () {
    return axiosApi('getTrend');
  }
}
