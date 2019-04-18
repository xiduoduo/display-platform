import axiosApi from '@/http/axiosApi';

export default class getKmsPage1Service {
  static async getDate () {
    let obs = await axiosApi('getDate');
    return obs;
  }
  static async getDistrMapData () {
    let obs = await axiosApi('getKmsPage1_mapData_distr');
    return obs;
  }
  static async getOnlineDistrMapData () {
    let obs = await axiosApi('getKmsPage1_mapData_onlineDistr');
    return obs;
  }
  static async getISFFactDistrMapData () {
    let obs = await axiosApi('getKmsPage1_mapData_factDistr', {factory: 'ISF'});
    return obs;
  }
  static async getISGFactDistrMapData () {
    let obs = await axiosApi('getKmsPage1_mapData_factDistr', {factory: 'ISG'});
    return obs;
  }
  static async getLeftData () {
    let obs = await axiosApi('getKmsPage1_leftData');
    return obs;
  }

  static async getRightOnLineData () {
    let obs = await axiosApi('getKmsPage1_rightOnLineData');
    return obs;
  }

  static async getRightISFData () {
    let obs = await axiosApi('getKmsPage1_rightFactoryData', {factory: 'ISF'});
    return obs;
  }

  static async getRightISGData () {
    let obs = await axiosApi('getKmsPage1_rightFactoryData', {factory: 'ISG'});
    return obs;
  }
};
