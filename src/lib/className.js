let addClass = (obj, cls) => {
  let objClass = obj.className; // 获取 class 内容.
  let blank = (objClass !== '') ? ' ' : ''; // 判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
  obj.className = objClass + blank + cls; // 组合原来的 class 和需要添加的 class.替换原来的 class.
};

let removeClass = (obj, cls) => {
  let objClass = ' ' + obj.className + ' '; // 获取 class 内容, 并在首尾各加一个空格. ex) 'abc    bcd' -> ' abc    bcd '
  objClass = objClass.replace(/(\s+)/gi, ' '); // 将多余的空字符替换成一个空格. ex) ' abc    bcd ' -> ' abc bcd '
  let removed = objClass.replace(' ' + cls + ' ', ' '); // 在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
  removed = removed.replace(/(^\s+)|(\s+$)/g, ''); // 去掉首尾空格. ex) 'bcd ' -> 'bcd'
  obj.className = removed; // 替换原来的 class.
};

export { addClass, removeClass };
