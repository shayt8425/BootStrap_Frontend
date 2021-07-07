/**
 * 序列化表单，jquery的增强版，将checkbox中的多个选中的数据，以一个字符串以逗号分隔返回
 */
$.fn.serializeObject = function () {
	var o = {};
	var a = this.serializeArray();
	//将checkbox表单的数据放到一个数组中去 
	$.each(a, function () {
	    if (o[this.name] !== undefined) {
	        if (!o[this.name].push) {
	            o[this.name] = [o[this.name]];
	        }
	        o[this.name].push(this.value || '');
	    } else {
	        o[this.name] = this.value || '';
	    }
	})
	//checkbox数据已放到数组中了， 将其字符串化，以逗号分隔
	var $checkbox = $("input[type=checkbox]",this);
    $.each($checkbox,function(){
    	if(o[this.name] != null && $.isArray(o[this.name]) && o[this.name].length > 1){
    		o[this.name] = o[this.name].join(",")
    	}
    });
	return $.param(o);
};

/**
 * form表单提交通用方法
 * 必须参数： formDom（要提交的表单的jquery对象），clickDom（单击事件的jquery对象，用于disabled此元素）
 * 请求成功回调：baseSuccess
 * 请求失败回调：baseError
 * @param options
 */
function ajaxFormSubmit(options){
	var toastObj = "";
	var defaults = {
		url:"",
		type:"post",
		dataType:"json",
		data:options.formDom.serializeObject(),	//此方法是扩展了jquery的serialize();
		context:"document.body",
		contentType:"application/x-www-form-urlencoded;charset=UTF-8",
		beforeSend:function(XHR){
			XHR.setRequestHeader("_ticket_", localStorage.getItem("_ticket_"));
			toastr.clear();
			//loading
			$(document.body).append("<div class='base-loading'><span class='fa fa-spinner fa-spin fa-fw'></span></div>");
			//为当前发起请求的dom元素disabled，防止再次提交
			options.clickDom.attr("disabled","disabled");
		},
		success:function(data, textStatus, jqXHR){
			$(document.body).find(".base-loading").remove();
			if(data.code.code == 0){
				toastObj = toastr.success(data.code.msg,"",{progressBar:true});
			} else {
				if(data.code.code == "0-007"){//系统异常，点击文字可以弹出具体异常信息
					var msg = "<a href='###' onClick='alert(\""+data.code.msg+"\")' title='点击查看详情' style='text-decoration: underline;'>系统异常，操作失败！</a>";
					toastObj = toastr.error(msg,"code [ "+data.code.code+" ]",{progressBar:true});
				} else {
					toastObj = toastr.error(data.code.msg,"code [ "+data.code.code+" ]",{progressBar:true});	
				}
			}
			if(options.baseSuccess){
				data.toastObj = toastObj;	//将toastr对象返回，便于操作
				options.baseSuccess(data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			toastr.error("网络请求失败，请稍后再试","",{progressBar:true});
			if(options.baseError){
				options.baseError(XMLHttpRequest,textStatus,errorThrown);
			}
		},
		complete:function(XHR, TS){
			$(document.body).find(".base-loading").remove();
			options.clickDom.removeAttr("disabled");
			if(typeof window.localStorage === 'object'){
				var ticket = XHR.getResponseHeader("_ticket_");
				if(ticket == "200" || ticket == 200 || ticket != "null" || ticket == null){
					//如果服务器端未配置验证权限，或者出现异常了 ，就不需要重新设置_ticket_
				} else {
					Stroage.setItem("_ticket_",ticket);
				}
		  	}
		}
	}
	var ajaxOptions = $.extend(defaults,options);
	$.ajax(ajaxOptions);
}
/**
 * ajax请求通用方法
 * 额外参数：
 * 			loading：是否显示进度条，true:显示 false:不显示
 * 			clickDom：事件触发对象，因为有些事件是由按钮或其他控件触发的，这个时候触发后可能需要控制不能再次触发知道请求返回前。
 * 			toast：是否显示交互后的由服务器端返回来的信息以toast形式展示，true:显示，false:不显示。
 * 请求成功回调：baseSuccess
 * 请求失败回调：baseError
 * @param options
 */
function ajaxRequest(options){
	var toastObj = "";
	var defaults = {
		url:"",
		type:"post",
		dataType:"json",
		data:"",
		context:"document.body",
		contentType:"application/x-www-form-urlencoded;charset=UTF-8",
		beforeSend:function(XHR){
			XHR.setRequestHeader("_ticket_", localStorage.getItem("_ticket_"));
			toastr.clear();
			if(options.loading){
				//loading
				$(document.body).append("<div class='base-loading'><span class='fa fa-spinner fa-spin fa-fw'></span></div>");
			}
			if(options.clickDom){
				//为当前发起请求的dom元素disabled，防止再次提交
				options.clickDom.attr("disabled","disabled");
			}
		},
		success:function(data, textStatus, jqXHR){
			if(options.loading){
				$(document.body).find(".base-loading").remove();
			}
			if(options.toast){
				if(data.code.code == 0){
					toastObj = toastr.success(data.code.msg,"",{progressBar:true});
				} else {
					if(data.code.code == "0-007"){//系统异常，点击文字可以弹出具体异常信息
						var msg = "<a href='###' onClick='alert(\""+data.code.msg+"\")' title='点击查看详情' style='text-decoration: underline;'>系统异常，操作失败！</a>";
						toastObj = toastr.error(msg,"code [ "+data.code.code+" ]",{progressBar:true});
					} else {
						toastObj = toastr.error(data.code.msg,"code [ "+data.code.code+" ]",{progressBar:true});	
					}
				}
			}
			if(options.baseSuccess){
				data.toastObj = toastObj;
				options.baseSuccess(data);
			}
		},
		error:function(XMLHttpRequest, textStatus, errorThrown){
			if(options.toast){
				toastr.error("网络请求失败，请稍后再试","",{progressBar:true});
			}
			if(options.baseError){
				options.baseError(XMLHttpRequest, textStatus, errorThrown);
			}
		},
		complete:function(XHR, TS){
			if(options.loading){
				$(document.body).find(".base-loading").remove();
			}
			if(options.clickDom){
				options.clickDom.removeAttr("disabled");
			}
			if(typeof window.localStorage === 'object'){
				var ticket = XHR.getResponseHeader("_ticket_");
				if(ticket == "200" || ticket == 200 || ticket != "null" || ticket == null){
					//如果服务器端未配置验证权限，或者出现异常了 ，就不需要重新设置_ticket_
				} else {
					Stroage.setItem("_ticket_",ticket);
				}
		  	}
		}
	}
	var ajaxOptions = $.extend(defaults,options);
	$.ajax(ajaxOptions);
}