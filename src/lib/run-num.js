let runNum = (options, fn) => {
  options = options || {};
  // console.log(options);
  // let $this = document.getElementById(targetEle);
  // let time = options.time || 0; // 总时间--毫秒为单位
  // let finalNum = options.num || 0; // 要显示的真实数值
  // let regulator = options.regulator || 100; // 调速器，改变regulator的数值可以调节数字改变的速
  // let runNumBool = options.runNumBool || true; // 是否执行动画
  let {time = 0, num: finalNum = 0, regulator = 100, runNumBool = true, count = 0} = options;
  if (!runNumBool) {
    fn && fn((finalNum + '').split(''));
  } else {
    let step = finalNum / (time / regulator); // 每30ms增加的数值--
    // let count = 0; // 计数器
    let initial = 0;
    // let _self = this;
    var timer = setInterval(function () {
      count = count + step;
      if (count >= finalNum) {
        clearInterval(timer);
        count = finalNum;
      }
      // t未发生改变的话就直接返回
      // 避免调用text函数，提高DOM性能
      var t = Math.floor(count);
      if (t === initial) return;
      initial = t;
      fn && fn((initial + '').split(''));
      // _self.num = (initial + '').split('');
    }, 30);
  }
};

export default runNum;
