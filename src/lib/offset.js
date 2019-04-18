let offset = (curEle) => {
  let totalLeft = null;
  let totalTop = null;
  let par = curEle.offsetParent;
  // 首先把自己本身的进行累加
  totalLeft += curEle.offsetLeft;
  totalTop += curEle.offsetTop;

  // 只要没有找到body，我们就把父级参照物的边框和偏移量累加
  while (par) {
    if (navigator.userAgent.indexOf('MSIE 8.0') === -1) {
      // 不是标准的ie8浏览器，才进行边框累加
      // 累加父级参照物边框
      totalLeft += par.clientLeft;
      totalTop += par.clientTop;
    }
    // 累加父级参照物本身的偏移
    totalLeft += par.offsetLeft;
    totalTop += par.offsetTop;
    par = par.offsetParent;
  }
  return {left: totalLeft, top: totalTop};
};

export default offset;
