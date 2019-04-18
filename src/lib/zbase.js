export default {
  Date: {
    getDateByFormat: function (_dateStr, _formatType, _ifSupplyZero) {
      _ifSupplyZero = _ifSupplyZero !== false ? true : _ifSupplyZero;
      try {
        if (_dateStr == null || _dateStr === '') return '';
        let _dateObj = typeof _dateStr === 'number' ? new Date(_dateStr) : typeof _dateStr === 'string' ? new Date((_dateStr + '').replace(/-/g, '/')) : _dateStr;
        let dateFormat = _formatType || 'yyyy-MM-dd HH:mm:ss';

        dateFormat = dateFormat.replace('yyyy', _dateObj.getFullYear());
        let _month = _dateObj.getMonth() + 1;
        let _day = _dateObj.getDate();
        let _hour = _dateObj.getHours();
        let _minute = _dateObj.getMinutes();
        let _second = _dateObj.getSeconds();

        dateFormat = dateFormat.replace('MM', _month > 9 ? _month : ((_ifSupplyZero ? '0' : '') + _month));
        dateFormat = dateFormat.replace('dd', _day > 9 ? _day : ((_ifSupplyZero ? '0' : '') + _day));
        dateFormat = dateFormat.replace('HH', _hour > 9 ? _hour : ((_ifSupplyZero ? '0' : '') + _hour));
        dateFormat = dateFormat.replace('mm', _minute > 9 ? _minute : ('0' + _minute));
        dateFormat = dateFormat.replace('ss', _second > 9 ? _second : ('0' + _second));

        return dateFormat;
      } catch (ex) {
        return _dateStr;
      }
    }
  }
};
