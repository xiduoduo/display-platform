import axiosApi from '@/http/axiosApi';

export default class OperativeService {
  static getEnergyOperativeList () {
    return axiosApi('getEnergyOperativeList');
  }

  static getEnergyOperativeSpeedRangeList () {
    return axiosApi('getEnergyOperativeSpeedRangeList');
  }

  static getEnergyOperativeRecordList () {
    return axiosApi('getEnergyOperativeRecordList');
  }
}
