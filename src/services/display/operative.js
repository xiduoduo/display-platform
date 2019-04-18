import axiosApi from '@/http/axiosApi';

export default class OperativeService {
  static getOperativeList () {
    return axiosApi('getOperativeList');
  }

  static getOperativeSpeedRangeList () {
    return axiosApi('getOperativeSpeedRangeList');
  }

  static getOperativeDrivingList () {
    return axiosApi('getOperativeDrivingList');
  }

  static getOperativeRecordList () {
    return axiosApi('getOperativeRecordList');
  }

  static getOrderTrend () {
    return axiosApi('getOrderTrend');
  }
}
