import axiosApi from '@/http/axiosApi';

export default class GetService {
  static async getFaultRanking () {
    let data = await axiosApi('getFaultRanking');
    return data;
  }
  static async getAlarmRanking () {
    let data = await axiosApi('getAlarmRanking');
    return data;
  }
  static async getRepairByPrvRank () {
    let data = await axiosApi('getRepairByPrvRank');
    return data;
  }
  static async getInStationCar () {
    let data = await axiosApi('getInStationCar');
    return data;
  }
}
