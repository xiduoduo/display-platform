import axiosApi from '@/http/axiosApi';

export default class getKmsPage2Service {
  static async getMileageTime () {
    let obs = await axiosApi('getKmsPage2_getMileageTime');
    return obs;
  }

  static async getFaultTop20ByMonth () {
    let obs = await axiosApi('getKmsPage2_faultTop20ByMonth');
    return obs;
  }

  static async getMileageSection () {
    let obs = await axiosApi('getKmsPage2_getMileageSection');
    return obs;
  }

  static async getChartRunAndOil () {
    let obs = await axiosApi('getKmsPage2_getChartRunAndOil');
    return obs;
  }

  static async getMapData (params) {
    let obs = await axiosApi('getKmsPage2_getMapData', params);
    return obs;
  }
};
