/**
 * Created by jiachenpan on 16/11/18.
 */
var UUID = require('uuid');

export function getUuid(){
  return UUID.v1().replace(/-/g, '');
}

export function getJgNameByCode(list, value=""){
  if(!value) return ""
  var values = value.split(",");

  var province = list.find((item)=>{
    return item.value == values[0]
  });

  var city = province.children.find((item)=>{
    return item.value == values[1];
  });

  var county = city.children.find((item)=>{
    return item.value == values[2];
  });

  return `${province.label}/${city.label}/${county.label}`
}

export function getWjwfqxByCode(list, value=""){
  if(!value) return ""
  var wjwfqxs = value.split(",");
  var wjwfqx_info = [];
  list.forEach(item => {
    if (wjwfqxs.indexOf(item.bh) != -1) {
      wjwfqx_info.push(item.qxms);
    }
  });
  return wjwfqx_info.join("/")
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function JSONToExcelConvertor(JSONData, FileName, ShowLabel) {
  //先转化json
  var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

  var excel = '<table>';

  //设置表头
  var row = "<tr>";
  for (var i = 0, l = ShowLabel.length; i < l; i++) {
    row += "<td>" + ShowLabel[i].value + '</td>';
  }

  //换行
  excel += row + "</tr>";

  //设置数据
  for (var i = 0; i < arrData.length; i++) {
    var row = "<tr>";

    for (var index in arrData[i]) {
      var value = arrData[i][index].value === "." ? "" : arrData[i][index].value;
      row += '<td>' + value + '</td>';
    }

    excel += row + "</tr>";
  }

  excel += "</table>";

  var excelFile = "<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
  excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
  excelFile += '; charset=UTF-8">';
  excelFile += "<head>";
  excelFile += "<!--[if gte mso 9]>";
  excelFile += "<xml>";
  excelFile += "<x:ExcelWorkbook>";
  excelFile += "<x:ExcelWorksheets>";
  excelFile += "<x:ExcelWorksheet>";
  excelFile += "<x:Name>";
  excelFile += "{worksheet}";
  excelFile += "</x:Name>";
  excelFile += "<x:WorksheetOptions>";
  excelFile += "<x:DisplayGridlines/>";
  excelFile += "</x:WorksheetOptions>";
  excelFile += "</x:ExcelWorksheet>";
  excelFile += "</x:ExcelWorksheets>";
  excelFile += "</x:ExcelWorkbook>";
  excelFile += "</xml>";
  excelFile += "<![endif]-->";
  excelFile += "</head>";
  excelFile += "<body>";
  excelFile += excel;
  excelFile += "</body>";
  excelFile += "</html>";

  var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);

  var link = document.createElement("a");
  link.href = uri;

  link.style = "visibility:hidden";
  link.download = FileName + ".xls";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

//字符串转16进制
export function strToHexCharCode(str) {
  if (str === "")
    return "";
  var hexCharCode = [];
  hexCharCode.push("0x");
  for (var i = 0; i < str.length; i++) {
    hexCharCode.push((str.charCodeAt(i)).toString(16));
  }
  return hexCharCode.join("");w
}

//16进制转字符串
export function hexCharCodeToStr(hexCharCodeStr) {
  var trimedStr = hexCharCodeStr.trim();
  var rawStr =
    trimedStr.substr(0, 2).toLowerCase() === "0x" ?
    trimedStr.substr(2) :
    trimedStr;
  var len = rawStr.length;
  if (len % 2 !== 0) {
    alert("Illegal Format ASCII Code!");
    return "";
  }
  var curCharCode;
  var resultStr = [];
  for (var i = 0; i < len; i = i + 2) {
    curCharCode = parseInt(rawStr.substr(i, 2), 16); // ASCII Code Value
    resultStr.push(String.fromCharCode(curCharCode));
  }
  return resultStr.join("");
}

//toTree
export function toTree(data, pid = 'parentId', id = 'id') {
  var parents = data.filter((value) => {
    return !value[pid]
  });

  var children = data.filter((value) => {
    return value[pid]
  });

  var translator = (parents, children) => {
    parents.forEach((parent) => {
      children.forEach((current, index) => {
        if (current[pid] == parent[id]) {
          let temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);
          translator([current], temp);
          if (typeof parent.children !=='undefined') {
            parent.children.push(current)
          } else {
            parent.children = [current]
          }
        }
      });
    });
  }

  translator(parents, children)
  return parents;
}