import axiosApi from '@/http/axiosApi';

export default class GetIndexServices {
  static async getEnergyAmount () {
    let obs = await axiosApi('getEnergyAmount');
    // let obss = await axiosApis('getAmount');
    // console.log(obss);
    // // let data = '';
    // obss.subscribe(res => {
    //   console.log(res);
    // }, e => console.log(e));
    return obs;
  }
  static async getEnergyDistribute () {
    let obs = await axiosApi('getEnergyDistribute');
    return obs;
  }
  static async getEnergyOnline () {
    let obs = await axiosApi('getEnergyOnline');
    return obs;
  }
  static async getEnergyMonthRegister () {
    let obs = await axiosApi('getEnergyMonthRegister');
    return obs;
  }
  // part-two
  static async getEnergyDataAmount () {
    let obs = await axiosApi('getEnergyDataAmount');
    return obs;
  }
  static async getEnergyMonthFaultWarn () {
    let obs = await axiosApi('getEnergyMonthFaultWarn');
    return obs;
  }
  static async getEnergyDayAlarm () {
    let obs = await axiosApi('getEnergyDayAlarm');
    return obs;
  }
  // part-three
  static async getEnergyRunSummary () {
    let obs = await axiosApi('getEnergyRunSummary');
    return obs;
  }
  static async getEnergyAvgVelocity () {
    let obs = await axiosApi('getEnergyAvgVelocity');
    return obs;
  }
  static async getEnergyRunAnalysis () {
    let obs = await axiosApi('getEnergyRunAnalysis');
    return obs;
  }
  static async getEnergyLocList () {
    let obs = await axiosApi('getEnergyLocList');
    return obs;
  }
  static async getEnergyDealer () {
    let obs = await axiosApi('getEnergyDealer');
    return obs;
  }
  static async getEnergyServicer () {
    let obs = await axiosApi('getEnergyServicer');
    return obs;
  }
}
