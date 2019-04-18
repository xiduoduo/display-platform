/**
 * 说明：配置皮肤
 * 1.增加皮肤包下的js、scss;---->PS:包名与文件名对应[?theme=name]下的name
 * 2.在assets/sass/theme.scss下，引入增加的scss文件
 * 3.如果需要修改整体默认背景
 * (具体样式:默认配置不能满足的情况下)，
 * 请去components/slot/slot-layout下调整默认样式
 *
 * @param type
 * @returns {string}
 */
let theme = (type = '') => {
  let config = '';
  try {
    // 按需引入js配置
    config = require(`./${type}/${type}.config`).default;
  } catch (e) {
  }
  return config;
};

export default theme;
