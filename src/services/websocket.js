import axiosApi from '@/http/axiosApi';
export default class WebSocketService {
  constructor () {
    this.start = this.start.bind(this);
  }
  static start () {
    axiosApi('websocket').subscribe(
      (result) => {
        // console.log(result);
        if (result.type !== 'success' || !result.data) return;
        let newData = result.model === 'rt_fault' ? result.data : result.data.data;
        let commitData = {
          model: result.model,
          data: newData
        };
        Vues.$store.commit('UPDATE_WEBSOCKET_DATA_MAP', commitData);
      },
      (err) => {
        // webscoket意外关闭或者报错， 间隔15秒重启websocket
        console.log('webscoket:' + err.type);
        if (Vues.$route.path.indexOf('/engine') !== -1) return;
        let timer = setTimeout(() => {
          clearTimeout(timer);
          timer = null;
          this.start();
        }, 15 * 1000);
      }
    );
  }
}
