import axiosApi from '@/http/axiosApi';

export default class GetTrialServices {
  static async getSummaryInfo () {
    let obs = await axiosApi('getSummaryInfo');
    return obs;
  }
  static async getListSummaryGbProvince () {
    let obs = await axiosApi('getListSummaryGbProvince');
    return obs;
  }
  static async getCurrentSummaryInfo () {
    let obs = await axiosApi('getCurrentSummaryInfo');
    return obs;
  }
  static async getListTaskGroupByType () {
    let obs = await axiosApi('getListTaskGroupByType');
    return obs;
  }
  static async getListDaysTaskAnalysis (days) {
    let obs = await axiosApi('getListDaysTaskAnalysis', days);
    return obs;
  }
  static async getListTask () {
    let obs = await axiosApi('getListTask');
    return obs;
  }
}
