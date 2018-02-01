/**
* ajax 提交表单
* @param ele 要提交表单的选择器
* @param jumpurl 操作成功后要执行的动作，可以是url、回调函数、或者是一个要关闭的元素选择器
*/
function send_form_ele(ele,jumpurl){
	var a = new AJAXForm(ele);
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
	a.send();
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

//jqGrid 重新加载数据
function rejqGrid(grid_id){
	return function(){
		$(grid_id).jqGrid().trigger('reloadGrid');
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

//清空表单文件域
function resetFileInput(inputfile){   
    var file = $(inputfile).get();
	for(var i=0; i<file.length; i++){
		file[i].value='';
	}
}

