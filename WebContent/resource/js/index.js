/**
 * 当前登陆用户的信息
 */
var userSessionBean={};
/**
 * 客户管理页面用到-当前点击的公司信息
 */
var currCompany = {};
/**
 * 客户管理页面-给二级客户分配设备用到-当前点击的公司信息
 */
var deviceAssignCompany = {};




var settingData = null;
var menuHtml = "";
var minMenuHtml = "";
var username = getCookie("username");
$(function(){
	$.ajax({
		url:'auth.json',
		data:{},
		type:'post',
		dataType:'json',
		success:function(data){
				userSessionBean = data;
				settingData = userSessionBean.auths;
				minMenuHtml = getMinNav(settingData,1);
				menuHtml=getAllMenuHtml(settingData,1);
				$("#minNav").html(minMenuHtml);
				$("#navIcon").html(menuHtml);
				bindMenuEvent();//菜单事件绑定
		}
	})
})

/*
 *获取指定名称的cookie的值
 */
 function getCookie(name){
     var strCookie=document.cookie;
     var arrCookie=strCookie.split("; ");
     for(var i=0;i<arrCookie.length;i++){
           var arr=arrCookie[i].split("=");
           if(arr[0]==name)return arr[1];
     }
     return "";
}

function bindMenuEvent(){
	/**
	 * 闭状态下的菜单栏点击事件
	 */
	$('.left-nav-close ul li').click(function(){
		//绑定展开点击事件
		var name = $(this).attr('name');
		$('.d-firstNav[name='+name+']').click();
		//
		$('.left-nav-close ul li').removeClass('active');
		$('.left-nav-close ul li i').removeClass('active');
		$(this).addClass('active');
		$(this).children('i').addClass('active');
		
	});
	/**
	 * 展开状态菜单栏点击事件
	 */
	$('.d-firstNav').click(function() {
		//改变关闭状态下的样式
		var name = $(this).attr('name');
		$('.left-nav-close ul li').removeClass('active');
		$('.left-nav-close ul li i').removeClass('active');
		$('.li[name='+name+']').addClass('active');
		$('.li[name='+name+']').children('i').addClass('active');
		//
		$('.d-firstNav').find('div.background:last-child>i').removeClass("rotate180").addClass("rotate180");
		if($(this).parent().find(".d-firstDrop").is(":hidden")){
			$(this).find('div.background:last-child>i').removeClass("rotate180");
		}else{
			$(this).find('div.background:last-child>i').removeClass("rotate180").addClass("rotate180");
		}
		$(this).next().slideToggle();
		$(this).parent().siblings().find('.d-firstDrop').slideUp();

		$('.d-firstNav').removeClass('active');
		$(this).addClass('active');
		$('.background').removeClass('active');
		$(this).children('.background').addClass('active');
		$('.background i').removeClass('active');
		$(this).children('div').children('i').addClass('active');
	});
	//初始化a标签链接到tab即菜单的点击事件，其中changeStyle为点击时样式的改变
	$(".d-firstDrop li a").each(function(){
		if($(this).attr('href') != "" && $(this).attr('href') != null && $(this).attr('href') != "#"){
			$(this).tab(changeStyle, function(){
				
			});
		}else{
			//$(this).unbind("click");
		}
	});
	
}

function getMinNav(settingDatas,level){
	for(var i=0;i<settingDatas.length;i++){
		if(settingDatas[i]["authorityType"]=="1"){//一级菜单拼接html
	        minMenuHtml += "<li class=\"li\" name = \""+settingDatas[i]["authorityId"]+"\" ><i class=\"icon iconfont icon-"+settingDatas[i]["image"]+"\"></i></li>";
	    }
	}
	return minMenuHtml;
}
/*
 * 点击时样式的改变
 * */
function changeStyle(dom){
	$('.d-firstDrop li').removeClass('active');
    $(dom).parent().addClass('active');
    $('.d-firstNav').removeClass('active');
    $(dom).parent().parent().prev().addClass('active');
}

/*
 * 获取当前登录用户Bean
 * */
function getSessionUserObj(){
	return userSession.userBean;
}

/*
 * 当前登录用户Bean是否存在角色ID为roleId的角色
 * */
function isHaveRole(roleId){
	for(var idx in userSession.roles){
		if(userSession.roles[idx].roleId==roleId)return true;
	}
	return false;
}
/*
 * 递归找子节点
 * */
function getAuthChild(authId){
	return getAuthChildDigui(settingData,authId);
}
/*
 * 递归找子节点
 * */
function getAuthChildDigui(settingData,authId){
	if(settingData&&settingData.length>0){
		for(var idx in settingData){
			if(settingData[idx]["authorityId"]==authId){
				console.log(settingData[idx]["authorityName"]);
				return settingData[idx]["childrens"];
			}else{
				//递归找子节点
				var data = getAuthChildDigui(settingData[idx]["childrens"],authId);
				if(data)return data;
			}
		}
	}
}

/**
 * 菜单控制
 */
function getAllMenuHtml(settingDatas,level){
    for(var i=0;i<settingDatas.length;i++){
    	if(settingDatas[i]["url"] == null || settingDatas[i]["url"] == ""){
    		settingDatas[i]["url"] = "#";
    	}
    	if(level==2&&i==0&&settingDatas[i]["authorityType"]=="1"){//如果是二级菜单必须在外层拼接容器html
    		var num=settingDatas.length>6?6:settingDatas.length;
    		menuHtml += "<ul class=\"d-firstDrop\">";
    	}
        if(level==1&&settingDatas[i]["authorityType"]=="1"){//一级菜单拼接html
        	menuHtml += "<li><div class=\"d-firstNav\" style=\"position:relative\" name = \""+settingDatas[i]["authorityId"]+"\" ><div class=\"background\"><i class=\"icon iconfont icon-"+settingDatas[i]["image"]+
        	"\"></i></div><span>"+settingDatas[i]["authorityName"]+"</span><div class=\"background\" style=\"right: 10px;color: #4bb8eb;position: absolute;top: 15px;\">" +
        			"<i class=\"icon iconfont icon-shangsanjiao rotate180\"></i></div></div>";
        }else if(level==2&&settingDatas[i]["authorityType"]=="1"){//二级菜单
        	menuHtml += "<li><a class = \"tab\" serial=\""+settingDatas[i]["serial"]+"\" pid=\""+settingDatas[i]["pid"]+"\" href=\""+settingDatas[i]["url"]+"\" id=\""+settingDatas[i]["authorityId"]+"\" rel=\""+settingDatas[i]["image"]+"\" data-value=\""+settingDatas[i]["authorityName"]+"\" \">"+settingDatas[i]["authorityName"]+"</a></li>";
        }else{
            //按钮暂或tab页不处理
        }
        if(settingDatas[i]["childrens"]&&settingDatas[i]["childrens"].length>0){
            //递归向下处理
            getAllMenuHtml(settingDatas[i]["childrens"], level+1);
        }
        
        if(i==settingDatas.length-1){
        	if(level==2&&settingDatas[0]["authorityType"]=="1"){//如果是二级菜单必须先拼接
        		menuHtml += "</ul>";
    		}else if(level==1){
    			menuHtml +=  "</li>";
    		}
        }
    }
    return menuHtml; 
}

/**
 * 菜单栏点击页面导航事件
 */
function menuClick(url, id) {
	if(!url||url==""||url=='null'){
		return;
	}
	FrontCommon.showLoading();
	$("#iframe0").attr("src", url);
	$("#iframe0").bind("load",function(){
		FrontCommon.hideLoading();
	});
	window.currentNode = findByRolesData(id, settingData);
	var allNodes = [ currentNode ];
	var pNode = findParentNode(currentNode, settingData, null);
	while (pNode) {
		allNodes.push(pNode);
		pNode = findParentNode(pNode, settingData, null);
	}
	
}

/**
 * 查找父节点
 */
function findParentNode(currentNode, moduleData, parentNode) {
	if (moduleData && moduleData.length > 0) {
		for ( var idx in moduleData) {
			if (moduleData[idx].id == currentNode.id) {
				return parentNode;
			} else if (moduleData[idx]["childrens"]
					&& moduleData[idx]["childrens"].length > 0) {
				var node = findParentNode(currentNode,
						moduleData[idx]["childrens"], moduleData[idx]);
				if (node)
					return node;
			}
		}
	}
}