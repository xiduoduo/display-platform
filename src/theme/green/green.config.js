/**
 * 皮肤js配置皮肤：图片、颜色等
 * 新能源皮肤样式：修改下面的色值，整体皮肤会变，如无需要请不要修改！！！
 * 如配置其他皮肤，请将整体green包复制，单独修改自己需要皮肤...
 */
import bgImg from '@/assets/green/img/g-bg.png';
import pointPng from '@/assets/green/img/mapPoint.png';

let green = {
  bgImg,
  nav: {},
  echarts: {
    map: {
      pointPng,
      geoItemStyleAreaColor: 'rgba(56, 67, 80, .8)',
      geoItemStyleBorderColor: '#455367',
      geoItemStyleEmphasisAreaColor: 'rgba(56, 67, 80, 1)',
      scatterLabelColor: '#222',
      effectItemColor: '#fff',
      effectItemColor2: '#00de98',
      effectLabelColor: '#00de98'
    },
    partOneBar: {
      linearGradient: ['rgba(0,244,68,1)', 'rgba(0,222,152,0)'],
      color: '#02e250',
      lineColor: 'rgba(255, 255, 255, .1)',
      splitColor: 'rgba(255, 255, 255, .1)',
      barColor: ['rgba(145,255,0,1)', '#00de98']
    },
    operativeBar: {
      barColor: ['rgba(0,222,152,.6)', 'rgba(0,222,152,.1)'],
      color: '#02d291'
    }
  },
  components: {
    numberBlock: {}
  }
};
export default green;
