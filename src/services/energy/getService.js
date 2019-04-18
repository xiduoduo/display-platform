import axiosApi from '@/http/axiosApi';

export default class GetService {
  static async getEnergyFaultRanking () {
    let data = await axiosApi('getEnergyFaultRanking');
    return data;
  }
  static async getEnergyAlarmRanking () {
    let data = await axiosApi('getEnergyAlarmRanking');
    return data;
  }
  static async getEnergyRepairByPrvRank () {
    let data = await axiosApi('getEnergyRepairByPrvRank');
    return data;
  }
  static async getEnergyInStationCar () {
    let data = await axiosApi('getEnergyInStationCar');
    return data;
  }
}
