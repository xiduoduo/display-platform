import Vue from 'vue';

/**
 * vue中 一劳永逸的组件注册,无需再import!
 * @param string
 * @returns {string}
 */
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function replaceLine (string) {
  if (string.indexOf('-') !== -1) {
    string = string.replace(/-./g, (a, b) => {
      return a.substr(1).toUpperCase();
    });
  }
  return string;
}
const requireComponent = require.context(
  '../components/no-register', true, /\.vue$/

  // 找到components文件夹下以.vue命名的文件

);

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName);
  let a = '';
  if (fileName.lastIndexOf('/index') !== -1) {
    fileName = fileName.replace('/index', '');
    a = fileName.lastIndexOf('/');
  } else {
    a = fileName.lastIndexOf('/');
  }
  // a = fileName.lastIndexOf('/');
  fileName = '.' + fileName.slice(a);
  let componentName = capitalizeFirstLetter(
    fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  );
  componentName = replaceLine(componentName);
  // console.log(componentName);
  // const componentName = capitalizeFirstLetter(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')
  //   // 因为得到的filename格式是: './baseButton.vue', 所以这里我们去掉头和尾，只保留真正的文件名
  // );

  Vue.component(componentName, componentConfig.default || componentConfig);
});
