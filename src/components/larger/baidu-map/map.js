/* eslint-disable */
export function MP () {
  return new Promise(function (resolve, reject) {
    let checkFn = () => {
      if (window.BMap && window.BMap.Map) {
        resolve(BMap);
      } else {
        setTimeout(checkFn, 300);
      }
    };
    if (!window.BMap) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'http://api.map.baidu.com/api?v=3.0&ak=5cGDv7LARbvAOX84P8wkI0kcK66SduUm&callback=init';
      script.onerror = reject;
      document.head.appendChild(script);
      checkFn();
    } else if (!window.BMap.Map) {
      checkFn();
    } else {
      resolve(BMap);
    }
  });
};
