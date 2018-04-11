/**
* ajax 提交表单
* @param ele 要提交表单的选择器
* @param jumpurl 操作成功后要执行的动作，可以是url、回调函数、或者是一个要关闭的元素选择器
* @param other_param 附加参数
*/
function send_form_ele(ele,jumpurl,other_param){
	//ZENG.msgbox.show('正在加载···', 6, true);
	var a = new AJAXForm(ele);
	if(other_param){
		a.add_data(other_param);
	}
	a.dataType = 'json';
	a.success = function(res){
		if(res.status){
			alert(res.info);
			//console.log(window.location.href);
			if(jumpurl != undefined){
				if($.isFunction(jumpurl)){
					jumpurl(a);
				}else if(jumpurl[0] == '#'){
					$(jumpurl).modal('hide');
				}else{
					document.location.href = jumpurl;
				}
			}
		}else{
			
			if(res.info){
				// console.log(res);
				alert(res.info);
			}else{
				alert('操作失败');
			}
		}
	}
	a.error = function(){
		alert('操作失败');
	}
	a.complete = function(){
		//ZENG.msgbox._hide();
	}
	a.send();
}

/**
* 获取已选中checkbox的值
* @param boxele checkbox 表单域 的范围选择器（checkbox 表单域的容器）
* @param inputele checkbox 表单域的选择器
* @param jumpurl 操作成功后要执行的动作，回调函数
*/
function get_checked_values(boxele, inputele, jumpurl){
	var checked = $(boxele).find(inputele+'[type="checkbox"]:checked');
	var data = [];
	for(var i = 0; i < checked.length; i++){
		data.push($(checked[i]).val());
	}
	if(data.length){
		jumpurl(data);
	}else{
		alert('请先选择操作对象');
	}
}

/**
* ajax 提交表单, 并将表单外部的 checkbox 表单域的值添加到表单中
* @param formele 要提交表单的选择器
* @param boxele checkbox 表单域 的范围选择器（checkbox 表单域的容器）
* @param inputele checkbox 表单域的选择器
* @param name 给定一个属性名称
* @param jumpurl 操作成功后要执行的动作，可以是url、回调函数、或者是一个要关闭的元素选择器
*/
function send_checked_Batch(formele, boxele, inputele, name, jumpurl){
	
	var checked = $(boxele).find(inputele+'[type="checkbox"]:checked');
	var data = {};
	data[name] = [];
	for(var i = 0; i < checked.length; i++){
		data[name].push($(checked[i]).val());
	}
	if(data[name].length){
		send_form_ele(formele, jumpurl, data);
	}else{
		alert('请先选择操作对象');
	}
	
}

/**
* checkbox全选
* @param boxele checkbox 表单域 的范围选择器（checkbox 表单域的容器）
*/
function select_checkbox(boxele){
	var checkboxall = $(boxele).find("input[type='checkbox']");
	var currentchecked = $(boxele).find("input[type='checkbox']:checked");
	if(currentchecked.length == checkboxall.length){
	    $(checkboxall).prop('checked', false);
	}else{
	    $(checkboxall).prop('checked', true);
	}
}

/**
* checkbox反选
* @param boxele checkbox 表单域 的范围选择器（checkbox 表单域的容器）
*/
function select_checkbox2(boxele){
	$(boxele).find("input[type='checkbox']").prop('checked',function(i, checked){
		return !checked;
	});
}


/**
* 根据数据组合属性字符串
*/
function create_attr_from_data(data){
	var arg = '';
	for(attr in data){
		arg += attr+'="'+data[attr]+'" ';
	}
	return arg;
}



/**
* jqGrid 提交表单查询，主要用于后端筛选并分页
*/
function jqGrid_search(form_ele,grid_id){
	var a = new AJAXForm(form_ele);
	$(grid_id).jqGrid('setGridParam',{postData:{search_data:a.data}}).trigger('reloadGrid');
}

/**
* jqGrid 提交表单查询，主要用于后端筛选，前端分页（及后端不分页）
*/
function jqGrid_search2(form_ele,grid_id){
	ZENG.msgbox.show('正在加载···', 6, true);
	var a = new AJAXForm(form_ele);
	a.dataType = 'json';
	a.success = function(data){
		if(!$.isArray(data)){
			data = [];
		}
		//console.log(data);
		$(grid_id).jqGrid('clearGridData');
		$(grid_id).jqGrid('setGridParam',{data:data}).trigger('reloadGrid');
	}
	a.complete = function(){
		ZENG.msgbox._hide();
	}
	a.send();
}

//jqGrid 重新加载数据（用于回调）
function rejqGrid(grid_id){
	return function(){
		$(grid_id).jqGrid().trigger('reloadGrid');
	}
}

/**
* 重新加载jqGrid并关闭bootstrap模态框（用于回调）
* @param grid_id
* @param modal_id 模态框id
*/
function rejqGrid2(grid_id, modal_id){
	return function(){
		$(grid_id).jqGrid().trigger('reloadGrid');
		$(modal_id).modal('hide');
	}
}

//formatter 接口函数
function formatter(cellvalue,options,rowObject,callback){
	if(cellvalue){ //修改的时候
		return callback(cellvalue);
	}else{ //第一次加载的时候
		return callback(rowObject);
	}
}

//ajax 获取jqGrid数据
function jqGrid_get_data(grid,url){
	ZENG.msgbox.show('正在加载···', 6, true);
	$.ajax({
		url: url,
		dataType:'json',
		success:function(data){
			$(grid).jqGrid('setGridParam',{data:data,readonlydata:data}).trigger('reloadGrid');
		},
		error:function(){
			console.log('加载失败了');
		},
		complete:function(){
			ZENG.msgbox._hide();
		}
	});
}

//设置jqGrid 宽度为100%
function setGridWidth(grid_id,box){
	$(grid_id).jqGrid('setGridWidth',$(box).width());
}



/** 
 * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 * 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 * Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18      
 */
Date.prototype.pattern=function(fmt) {         
    var o = {         
    "M+" : this.getMonth()+1, //月份         
    "d+" : this.getDate(), //日         
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时         
    "H+" : this.getHours(), //小时         
    "m+" : this.getMinutes(), //分         
    "s+" : this.getSeconds(), //秒         
    "q+" : Math.floor((this.getMonth()+3)/3), //季度         
    "S" : this.getMilliseconds() //毫秒         
    };         
    var week = {         
    "0" : "/u65e5",         
    "1" : "/u4e00",         
    "2" : "/u4e8c",         
    "3" : "/u4e09",         
    "4" : "/u56db",         
    "5" : "/u4e94",         
    "6" : "/u516d"        
    };         
    if(/(y+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));         
    }         
    if(/(E+)/.test(fmt)){         
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);         
    }         
    for(var k in o){         
        if(new RegExp("("+ k +")").test(fmt)){         
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));         
        }         
    }         
    return fmt;         
}


/**
* 对Date的扩展，将 Date 转化为指定格式的String
* 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
* 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
* 例子： 
* (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
* (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
*/
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
* 根据时间间隔计算出时间点，以数组形式返回
* @param space 间隔时长，单位：秒
* @param start 开始计算时间，格式：时分  例如：10:33
*/
function get_point_form_date(space, start){
	var date = '2015-01-01';
	var start_time = date + ' ' + start;
	var max_time = date + ' 23:59:59' ;
	var u = (new Date(start_time)).getTime();
	var max_u = (new Date(max_time)).getTime();
	var space = space*1000;
	var arr = new Array();
	
	do{
		arr.push((new Date(u)).Format("hh:mm"));
		u += space;
	}while(u < max_u)
	return arr;
}

/**
* 通过加减运算计算日期
* @param int num 天数   例如：-1 表示减去 1天   1 表示加上1天
* @param String date 参考日期，默认为当前日期 
* @return String 返回运算后的日期
*/
function  operation_date(num, date){
	if(!date){
		var cdate = new Date();
	}else{
		var cdate = new Date(date);
	}
	if(!num){
		num = 0;
	}
	var t = cdate.getTime() + (num * 24 * 60 * 60 * 1000);
	
	var rdate = (new Date(t)).Format("yyyy-MM-dd");
	
	return rdate;
}


/**
* 根据 参考日期 计算出 某一周的 开始 和 结束 日期
* @param int num 以当前周为参考，之后的第几周   例如：-1:上一周; -2:上上周   1:下一周; 2:下下周; 0:当前周 （这里所说的当前周是指 给定参考日期所在的周）
* @param String date 参考日期，默认为当前日期 
* @return Array 返回 开始日期 和 结束日期（数组第一个值为开始日期，第二个值为结束日期）
*/
function date_to_week_be(num,date){
	var arr = [];
	if(!num)
		num = 0;
	if(!date)
		var cdate = new Date();
	else
		var cdate = new Date(date);
	
	var w = cdate.getDay();
	
	var cd = cdate.Format('yyyy-MM-dd');
	
	if(w == 0){
		w = 7;
	}
	
	var cbd = operation_date(-(w-1), cd);
	
	var ced = operation_date(6, cbd);
	
	var bd = operation_date(num*7, cbd);
	
	var ed = operation_date(num*7, ced);
	
	return [bd,ed];
	
}



/**
* input文件表单预览
* fileele:file类型的input
* showele:预览img标签的id 
* 
* 示例
* <img id="yulan" src="" />
* <input id="myfile" type="file" name="myfile" />
* loadImageFile('myfile', 'yulan');
*/
function loadImageFile(fileele,showele) {
	var oFReader = new FileReader(), rFilter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
	
	oFReader.onload = function (oFREvent) {
		$(showele).css('visibility','visible');
		$(showele).attr('src',oFREvent.target.result);
		
	};
	var file = $(fileele).get(0);
	
	if (file.files.length === 0) {
		$(showele).css('visibility','hidden');
		return;
	}
	var oFile = file.files[0];
	if (!rFilter.test(oFile.type)) {
		$(showele).css('visibility','hidden');
		alert("请选择一张图片!");
		return;
	}
	oFReader.readAsDataURL(oFile);
}

/**
* 清空表单文件域
*/
function resetFileInput(inputfile){   
    var file = $(inputfile).get();
	for(var i=0; i<file.length; i++){
		file[i].value='';
	}
}

/**
* 重置表单
* @param form 要重置的form选择器
*/
function reset_form(formele){
	$(formele).get(0).reset();
}


/**
* 检查某个值是否存在一个数组中，返回找到的第一个所在位置，找不到返回 -1
*/
Array.prototype.indexOf=function(val){
	for(var i=0; i<this.length; i++){
		if(this[i] === val){
			return i;
		}
	}
	return -1;
}


/**
* base64加解密
* 使用说明：
	var str='123';
	var base = new Base64();
	base.encode(str);  加密
	base.decode(str);解密
*/ 
function Base64(){  
   
    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";  
   
    // public method for encoding  
    this.encode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = _utf8_encode(input);  
        while (i < input.length) {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output +  
            _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +  
            _keyStr.charAt(enc3) + _keyStr.charAt(enc4);  
        }  
        return output;  
    }  
   
    // public method for decoding  
    this.decode = function (input) {  
        var output = "";  
        var chr1, chr2, chr3;  
        var enc1, enc2, enc3, enc4;  
        var i = 0;  
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");  
        while (i < input.length) {  
            enc1 = _keyStr.indexOf(input.charAt(i++));  
            enc2 = _keyStr.indexOf(input.charAt(i++));  
            enc3 = _keyStr.indexOf(input.charAt(i++));  
            enc4 = _keyStr.indexOf(input.charAt(i++));  
            chr1 = (enc1 << 2) | (enc2 >> 4);  
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);  
            chr3 = ((enc3 & 3) << 6) | enc4;  
            output = output + String.fromCharCode(chr1);  
            if (enc3 != 64) {  
                output = output + String.fromCharCode(chr2);  
            }  
            if (enc4 != 64) {  
                output = output + String.fromCharCode(chr3);  
            }  
        }  
        output = _utf8_decode(output);  
        return output;  
    }  
   
    // private method for UTF-8 encoding  
    _utf8_encode = function (string) {  
        string = string.replace(/\r\n/g,"\n");  
        var utftext = "";  
        for (var n = 0; n < string.length; n++) {  
            var c = string.charCodeAt(n);  
            if (c < 128) {  
                utftext += String.fromCharCode(c);  
            } else if((c > 127) && (c < 2048)) {  
                utftext += String.fromCharCode((c >> 6) | 192);  
                utftext += String.fromCharCode((c & 63) | 128);  
            } else {  
                utftext += String.fromCharCode((c >> 12) | 224);  
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);  
                utftext += String.fromCharCode((c & 63) | 128);  
            }  
   
        }  
        return utftext;  
    }  
   
    // private method for UTF-8 decoding  
    _utf8_decode = function (utftext) {  
        var string = "";  
        var i = 0;  
        var c = c1 = c2 = 0;  
        while ( i < utftext.length ) {  
            c = utftext.charCodeAt(i);  
            if (c < 128) {  
                string += String.fromCharCode(c);  
                i++;  
            } else if((c > 191) && (c < 224)) {  
                c2 = utftext.charCodeAt(i+1);  
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));  
                i += 2;  
            } else {  
                c2 = utftext.charCodeAt(i+1);  
                c3 = utftext.charCodeAt(i+2);  
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));  
                i += 3;  
            }  
        }  
        return string;  
    }  
}

/**
* 提取数组中 某列的值（主要用于select 取出的数据）
* @param arr 要操作的数组
* @param colname 要提取的列名称(可以使多个列名的 数组)
* return 返回提取出的结果
*/
function get_column_values(arr, colname){
	var a = {};
	if(typeof colname == 'object'){
		for(var i=0; i<colname.length; i++){
			a[colname[i]] = [];
		}
	}else{
		a[colname] = [];
	}
	for(var i=0; i<arr.length; i++){
		for(c in a){
			a[c].push(arr[i][c]);
		}
	}
	return a;
}

/**
* 对指定列进行统计计算（主要用于select 取出的数据）
* @param arr 要操作的数组
* @param column 要统计的列名称
* @param type 统计类型  sum:求和 ave:求平均值
* return 反回统计结果
*/
function get_column_statistics(arr, column,type){
	res = 0;
	for(var i=0; i<arr.length; i++){
		if(arr[i][column])
			res += Number(arr[i][column]);
	}
	switch(type){
		case 'sum':
			break;
		case 'ave':
			res = res/arr.length;
			break;
	}
	return res;
}