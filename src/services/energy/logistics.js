import axiosApi from '@/http/axiosApi';

export default class LogisticsService {
  static getEnergySummary () {
    return axiosApi('getEnergySummary');
  }

  static getEnergyMapData () {
    return axiosApi('getEnergyOnroadLine');
  }

  static getEnergyRiskWarnData () {
    return axiosApi('getEnergyRiskWarnData');
  }

  static getEnergyLastArrived () {
    return axiosApi('getEnergyLastArrived');
  }

  static getEnergyLastStart () {
    return axiosApi('getEnergyLastStart');
  }

  static getEnergyScore () {
    return axiosApi('getEnergyScore');
  }

  static getEnergyTrend () {
    return axiosApi('getEnergyTrend');
  }
}
