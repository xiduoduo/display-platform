import axiosApi from '@/http/axiosApi';

export default class GetProductServices {
  static async getEnergyProdCBrand () {
    let data = await axiosApi('getEnergyProdCBrand');
    return data;
  }
  static async getEnergyProdCType () {
    let data = await axiosApi('getEnergyProdCType');
    return data;
  }
  static async getEnergyProdTop20 () {
    let data = await axiosApi('getEnergyProdTop20');
    return data;
  }
}
