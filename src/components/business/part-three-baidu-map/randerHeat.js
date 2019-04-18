/* eslint-disable */
export function Heat () {
  return new Promise(function (resolve, reject) {
    let checkFn = () => {
      if (window.BMapLib && window.BMapLib.HeatmapOverlay) {
        resolve(window.BMapLib);
      } else {
        setTimeout(checkFn, 300);
      }
    };
    if (!window.BMapLib) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://api.map.baidu.com/library/Heatmap/2.0/src/Heatmap_min.js';
      script.onerror = reject;
      document.head.appendChild(script);
      checkFn();
    } else if (!window.BMapLib.HeatmapOverlay) {
      checkFn();
    } else {
      resolve(window.BMapLib);
    }
  });
};
