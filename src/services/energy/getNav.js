import axiosApi from '@/http/axiosApi';

export default class ApiServices {
  static async getEnergyNav () {
    let data = await axiosApi('getEnergyNav');
    return data;
  }
  static async getDate () {
    let obs = await axiosApi('getDate');
    return obs;
  }
}
