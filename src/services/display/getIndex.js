import axiosApi from '@/http/axiosApi';

export default class GetIndexServices {
  static getAmount () {
    return axiosApi('getAmount');
    // let obss = await axiosApis('getAmount');
    // console.log(obss);
    // // let data = '';
    // obss.subscribe(res => {
    //   console.log(res);
    // }, e => console.log(e));
    // return obs;
  }
  static getDistribute () {
    return axiosApi('getDistribute');
  }
  static getOnline () {
    return axiosApi('getOnline');
  }
  static getMonthRegister () {
    return axiosApi('getMonthRegister');
  }
  // part-two
  static getDataAmount () {
    return axiosApi('getDataAmount');
  }
  static getMonthBehavior () {
    return axiosApi('getMonthBehavior');
  }
  static getMonthFaultWarn () {
    return axiosApi('getMonthFaultWarn');
  }
  static getDayAlarm () {
    return axiosApi('getDayAlarm');
  }
  static getOuManRunAnalysis () {
    return axiosApi('getOuManRunAnalysis');
  }
  // part-three
  static getRunSummary () {
    return axiosApi('getRunSummary');
  }
  static getAvgVelocity () {
    return axiosApi('getAvgVelocity');
  }
  static getRunAnalysis () {
    return axiosApi('getRunAnalysis');
  }
  static getLocList () {
    return axiosApi('getLocList');
  }
  static getDealer () {
    return axiosApi('getDealer');
  }
  static getServicer () {
    return axiosApi('getServicer');
  }
}
