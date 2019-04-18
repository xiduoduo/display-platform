let newCity = (name) => {
  switch (name) {
    // 北京
    case '密云县':
      return '密云区';
    case '延庆县':
      return '延庆区';
    // 天津
    case '蓟县':
      return '蓟州区';
    case '静海县':
      return '静海区';
    case '宁河县':
      return '宁河区';
    // 上海
    case '崇明县':
      return '崇明区';
    // 重庆
    case '开县':
      return '开州区';
    case '璧山县':
      return '璧山区';
    case '荣昌县':
      return '荣昌区';
    case '潼南县':
      return '潼南区';
    case '铜梁县':
      return '铜梁区';
    // 新疆
    case '吐鲁番地区':
      return '吐鲁番市';
    case '哈密地区':
      return '哈密市';
    // 西藏
    case '山南地区':
      return '山南市';
    case '日喀则地区':
      return '日喀则市';
    case '昌都地区':
      return '昌都市';
    case '林芝地区':
      return '林芝市';
    // 澳门：氹:dang、
    case '路氹城':
      return '路凼填海区';
    case '氹仔':
      return '嘉模堂区';
    case '澳门半岛':
      return '花王堂区';
    default:
      return name;
  }
};

export default newCity;
