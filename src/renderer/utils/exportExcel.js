function tableToExcel(jsonData,thead,fileName='下载.xls'){

	//列标题


	let head = ''
	for(let i of thead) {
		head+=`<td>${i}</td>`
	}
	var str = `<tr>${head}</tr>`;

	//循环遍历，每行加入tr标签，每个单元格加td标签
	for(let i = 0 ; i < jsonData.length ; i++ ){
		str+='<tr>';
		for(let item in jsonData[i]){
				//增加\t为了不让表格显示科学计数法或者其他格式
				str+=`<td>${ jsonData[i][item] + '\t'}</td>`;
		}
		str+='</tr>';
	}
	//Worksheet名
	var worksheet = 'Sheet1'
	var uri = 'data:application/vnd.ms-excel;base64,';

	//下载的表格模板数据
	var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
	xmlns:x="urn:schemas-microsoft-com:office:excel"
	xmlns="http://www.w3.org/TR/REC-html40">
	<head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
		<x:Name>${worksheet}</x:Name>
		<x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
		</x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
		</head><body><table>${str}</table></body></html>`;


	//下载模板

	var link = document.createElement('a');
	link.download = fileName;
	link.href = uri + base64(template)
	link.click();

	// window.location.href = uri + base64(template)


}
//输出base64编码
function base64 (s) { return window.btoa(unescape(encodeURIComponent(s))) }

export default tableToExcel
