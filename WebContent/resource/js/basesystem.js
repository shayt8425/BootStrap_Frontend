/**
 * 系统级参数工具类
 */
var System = (function(System){
	System.host = System.host || Stroage.getItem("baseHost");	//系统路径变量
	System.UserBean = System.UserBean || {};	//私有属性，用于 缓存js中的用户对象
	
	/**
	 * 获取用户信息，如果还没加载过，需要重新加载，如果已经加载了，直接取缓存中的
	 * 获取的User对象是多个对象的组合，详见User.java对象
	 * 比如要获取用户id ： System.User().user.user_id
	 * 比如要获取机构id ： System.User().org[0].org_id   获取用户机构 这里是一个机构列表，因为一个用户可能存在多个机构，主机构排第一
	 * 获取用户组id ： System.User().group[0].group_id 获取用户组 这里是一个用户组列表，因为一个用户可能存在多个组，默认取第一个
	 * 。。。
	 */
	System.User = function(){
		if(jQuery.isEmptyObject(window.top.System.UserBean)){	//判断是否最顶层框架加载过了用户
			$.ajax({
				url: System.host + "/system/getByUser.json",
				type:"post",  dataType:"json",
				data:{},  async:false,
				context:"document.body", contentType:"application/x-www-form-urlencoded;charset=UTF-8",
				beforeSend:function(XHR){
					XHR.setRequestHeader("_ticket_", Stroage.getItem("_ticket_"));
				},
				success:function(data, textStatus, jqXHR){
					if(data){
						System.UserBean = data;
						window.top.System.UserBean = data;	//同时赋值最顶层框架用户，这样就供其他页面调用，而不需要重新加载了
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){ },
				complete:function(XHR, TS){
					var ticket = XHR.getResponseHeader("_ticket_");
					if(ticket == "200" || ticket == 200 || ticket != "null" || ticket == null){
						//如果服务器端未配置验证权限，或者出现异常了 ，就不需要重新设置_ticket_
					} else {
						Stroage.setItem("_ticket_",ticket);
					}
				}
			});
		} else {
			System.UserBean = window.top.System.UserBean;
		}
		return System.UserBean;
	}
	
	/**
	 * 系统级框架的长度宽度集合对象，这里用的是一个方法，这里的数据是实时刷新的
	 * 用法： System.size().width
	 */
	System.size = function(){
		var baseSize = {
			width : $(window).width(),		//整个页面的宽度			
			height : $(window).height(),	//整个页面的高度
			left_width : 0,					//左边菜单栏宽度
			left_height : 0,				//左边菜单栏高度
			right_widht : $(window).width(),//右边内容区宽度  	默认是整个页面的宽度，因为有可能页面不依赖框架，独立的
			right_height : $(window).height()//右边内容区高度  默认是整个页面的高度，因为有可能页面不依赖框架，独立的
		}
		
		if(window.top.base_w_h_array){	//如果存在顶级框架页面，取顶级页面的已算好的数据，不存在就返回默认的
			baseSize.width = window.top.base_w_h_array[0];
			baseSize.height = window.top.base_w_h_array[1];
			baseSize.left_width = window.top.base_w_h_array[2];
			baseSize.left_height = window.top.base_w_h_array[3];
			baseSize.right_widht = window.top.base_w_h_array[4];
			baseSize.right_height = window.top.base_w_h_array[5];
		} 
		return baseSize;
	}
	
	return System;
}(System || {}));