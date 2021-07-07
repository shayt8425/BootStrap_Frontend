/**
*	页面公共js代码
*	Gavin 20141028
*/
var bs = {
	win : {},	//所有窗口及弹出框命名空间
	util : {}	//所有工具方法命名空间
}
/**
 * 页面初始化方法
 */
$(function(){
	$("body").css("overflow-y","auto");//放开body纵向滚动条
})
/**=================== bs.win begin ==================**/
/**
 * 打开一个新tab窗口
 * @param page_name 页面名称
 * @param page_url 页面路径
 * @returns 返回打开的页面id
 */
bs.win.tabPage = function (page_name,page_url){
	return window.parent.newWin(bs.util.numRand(9999,0),page_name,page_url,true,true);
}
/**
 * 在当前窗口跳转到一个页面
 * @param page_url
 */
bs.win.page = function(page_url){
	location.href = page_url;
}
/**
 * 弹出alert框
 * @param message
 * @param callback
 */
bs.win.alert = function (message,callback){
	if(callback){
		window.top.bootbox.alert(message,callback);		
	} else {
		window.top.bootbox.alert(message);
	}
}
/**
 * 弹出确认框 
 * @param message
 * @param callback
 */
bs.win.confirm = function (message,callback){
	window.top.bootbox.confirm(message,callback);		
}
/**
 * 弹出输入框
 * @param title
 * @param callback
 */
bs.win.prompt = function (title,callback){
	window.top.bootbox.prompt(title,callback);
}
/**
 * 弹出普通dialog
 * @param options,具体options，请参考bootbox文档
 */
bs.win.dialog = function (options){
	window.top.bootbox.dialog(options);
}
/**
 * 关闭弹出框，如果不指定弹出框id，则默认关闭所有弹出框
 * @param dialogId
 */
bs.win.closeDialog = function (dialogId){
	window.top.bootbox.closeDialog(dialogId);
}
/**
 * 获取弹出框的iframe对象 如果dialogId为空，则找到第一个对话框，如果不为空，则找到指定对话框
 * @param dialogId 
 */
bs.win.dialogIframe = function (dialogId){
	return window.top.bootbox.getIframe(dialogId);
}
/**
 * 获取弹出框的iframe文档对象 如果dialogId为空，则找到第一个对话框，如果不为空，则找到指定对话框
 * @param dialogId
 */
bs.win.dialogIframeWindow = function (dialogId){
	return window.top.bootbox.getIframeWindow(dialogId);
}
/**=================== bs.win end ==================**/


/**=================== bs.util begin ==================**/

/**
 * 获取指定范围内的随机数
 * @param max 上限
 * @param min 下限
 * @returns
 */
bs.util.numRand = function (max,min) {
    var rand = parseInt(Math.random() * (max - min + 1) + min);
    return rand;
}

/**
 * 获取url地址的参数
 * @param name  指定的要获取的参数名称
 */
bs.util.getParam = function(name){
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return results[1];
    }
}

/**
 * 显示或隐藏列表页的更多搜索
 * @param obj
 */
bs.util.showOrHideSearch = function (obj){
	var _this = $(obj);
	if(_this.find("span").hasClass("fa-angle-double-down")){
		_this.find("span").removeClass("fa-angle-double-down").addClass("fa-angle-double-up");
		$(".base-search-hide").slideDown(500);
	} else {
		_this.find("span").removeClass("fa-angle-double-up").addClass("fa-angle-double-down");
		$(".base-search-hide").slideUp(500);
	}
}

/**
 * 判断字符串是否为空，包括undefined/null
 * @param str
 * @returns {Boolean}
 */
bs.util.isEmpty = function (str){
	try {
		if (str == "  " || str == "" || str == " "
			|| str == null || str == "null" || str.length == 0
			|| typeof str === "undefined" || str === "undefined") {
			return true;
		} else {
			return false;
		}
	} catch (e) {
		return false;
	}
}
/**
 * 从form中组装json字符串 
 * @param options
 * formIds:form DomId,从此form中取表单中的值，多个表单，用逗号分隔form DomId，可以为空，为空就从body中寻找所有form
 * exNames:不！！！需要组装的表单name，多个exName用逗号分隔。可以为空 为空则组装页面说有name
 * before：执行前，用户自定义回调方法
 * after：执行后，用户自定义回调方法
 */
bs.util.getJsonParam = function (options){
	//因为表单可能存在多个对象，这里做一层解析（主对象里包含另一个对象）。例如：user.name   user.email。
	var beanKey = "";	//存复杂表单对象的名字
	var beanJson = "";	//存复杂表单对象的属性
	
	var defaults = {
		formIds:"",	//多个formId,用逗号分隔
		exNames:"",	//多个exName用逗号分隔
		before:function(){},
		after:function(){}
	}
	var options = $.extend(defaults,options);
	options.before;	//执行前，执行用户自定义回调方法
	var jsonParam = "";
	if(options.formIds){	//如果传了formId和表单name,则循环获取数据
		var formId = options.formIds.split(",");
		$.each(formId,function(key,value){
			var f = $(value).serializeArray();
			$.each(f, function () {
				//exName字段没传或当前循环的name未在字段中，则组装json串
				if(options.exNames == undefined || options.exNames.indexOf(this.name) >= 0){
					//nothing
				} else {
					if(this.name.indexOf(".") >= 0){//如果存在复杂对象，则进一步解析
						var nameArray = this.name.split(".");
						beanKey = nameArray[0];
						beanJson += "\""+ nameArray[1] +"\":\""+ this.value +"\",";
					} else {
						jsonParam += "\""+this.name +"\":\""+ this.value +"\",";						
					}
				}
			});
		})
	} else if(options.formIds == ""){ 	//如果不传formIds,则在body中find form
		var f = $("body form").serializeArray();
		$.each(f, function () {
			//exName字段没传或当前循环的name未在字段中，则组装json串
			if(options.exNames == undefined || options.exNames.indexOf(this.name) >= 0){
				//nothing
			} else {
				if(this.name.indexOf(".") >= 0 ){//如果存在复杂对象，则进一步解析
					var nameArray = this.name.split(".");
					beanKey = nameArray[0];
					beanJson += "\""+ nameArray[1] +"\":\""+ this.value +"\",";
				} else {
					jsonParam += "\""+this.name +"\":\""+ this.value +"\",";						
				}
			}
		});
	}
	if(jsonParam != ""){
		jsonParam = jsonParam.substring(0,jsonParam.length-1);
	}
	if(beanJson != ""){
		beanJson = beanJson.substring(0,beanJson.length-1);
		beanJson = "\""+ beanKey +"\":{"+beanJson+"}" ;
	}
	if(beanJson != ""){
		jsonParam = "{"+jsonParam + "," + beanJson +"}";
	} else {
		jsonParam = "{"+ jsonParam + "}";
	}
	options.after; //执行后，执行用户自定义回调方法
	return jsonParam
}
/**=================== bs.util end ==================**/