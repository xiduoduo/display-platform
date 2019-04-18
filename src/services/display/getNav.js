import axiosApi from '@/http/axiosApi';

export default class ApiServices {
  static async getNav () {
    let data = await axiosApi('getNav');
    return data;
  }
  static async getDate () {
    let obs = await axiosApi('getDate');
    return obs;
  }
}
