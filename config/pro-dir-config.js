// 按项目名打包对应文件夹：如:/dist/display文件夹下
let proDir = (dir) => {
  switch (process.env.PROJECT) {
    case 'display':
      return dir + '/display';
    case 'kms':
      return dir + '/engine';
    case 'energy':
      return dir + '/energy';
    case 'autopilot':
      return dir + '/autopilot';
    default:
      return dir;
  }
};

module.exports = proDir;
