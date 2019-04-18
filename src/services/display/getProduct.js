import axiosApi from '@/http/axiosApi';

export default class GetProductServices {
  static async getProdCBrand () {
    let data = await axiosApi('getProdCBrand');
    return data;
  }
  static async getProdCType () {
    let data = await axiosApi('getProdCType');
    return data;
  }
  static async getProdTop20 () {
    let data = await axiosApi('getProdTop20');
    return data;
  }
}
