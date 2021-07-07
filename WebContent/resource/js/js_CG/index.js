var settingData = null;
//颜色数组
var colorData = ['#ffc772','#40b361','#44d0f7','#d9b710','#22c1bb','#f7cf68','#177cb1','#a78f44','#89ada9','#88b2d9'];
var menuHtml = "";
var userSession = {};
$(function() {
	$.ajax({
		url:'userSession.json',
		dataType:'json',
		type:'post',
		async:false,
		success : function(data){
			if(data["code"]["code"]==0){
				userSession = data["result"];
				settingData = userSession.auths;
				menuHtml=getAllMenuHtml(settingData,1);
				$("#navIcon").html(menuHtml);
				bindMenuEvent();//菜单事件绑定
				for(var id in settingData){
					if(settingData[id].authorityId=="WORKSPACE"){
						menuClick(settingData[id].url, settingData[id].authorityId);
						break;
					}
				}
			}
		}
	});
	$.ajax({
		url:'authority/getAuthorityTree.json',
		dataType:'json',
		data:{gqdb_no_show:'1'},
		type:'post',
		async:false,
		success : function(data){
			if(data["code"]["code"]==0){
				window.allAuthNodes = data["result"];
			}
		}
	});
	$.ajax({
		url:'user/getOrgUserTree.json',
		dataType:'json',
		data:{gqdb_no_show:'1',orgId:top.getSessionUserObj().orgId},
		type:'post',
		async:false,
		success : function(data){
				window.orgUserTreeNodes = data;
			}
	});

});

function getDtTypeName(dt_type){
	for(var idx in dtTypeDatas){
		if(dtTypeDatas[idx].dictCode==dt_type)return dtTypeDatas[idx].dictName;
	}
	
	return "";
}

function getDtTypeDatas(){
	var datas = [];
	for(var idx in dtTypeDatas){
		datas.push({value:dtTypeDatas[idx].dictCode,label:dtTypeDatas[idx].dictName})
	}
	return datas;
}

function getDeviceTreeForDtType(){
	return window.DeviceTreeForDtTypeNodes;
}
function getDeviceTreeForDtTypeNodesFilter2(){
	return window.DeviceTreeForDtTypeNodesFilter2
}
function getSessionUserObj(){
	return userSession.userBean;
}

function isHaveRole(roleId){
	for(var idx in userSession.roles){
		if(userSession.roles[idx].roleId==roleId)return true;
	}
	return false;
}

function getAuthChild(authId){
	return getAuthChildDigui(settingData,authId);
}

function getAuthChildDigui(settingData,authId){
	if(settingData&&settingData.length>0){
		for(var idx in settingData){
			if(settingData[idx]["authorityId"]==authId){
				console.log(settingData[idx]["authorityName"]);
				return settingData[idx]["children"];
			}else{
				//递归找子节点
				var data = getAuthChildDigui(settingData[idx]["children"],authId);
				if(data)return data;
			}
		}
	}
}

function bindMenuEvent(){
	$('#navIcon li').children("a").mouseenter(function(e) {
		if($(this).parent().children(".tabCon").length==0||
				$(this).parent().children(".tabCon").is(":hidden")){
			$(this).parent().addClass('active').siblings().removeClass('active');
			var liDom = $(this).parent();
			
			$(this).parent().children(".tabCon").slideToggle(200,'swing',function(){

			});
			
			var tabCon = $(this).parent().children(".tabCon");
			if(tabCon.length>0&&tabCon.offset().left+tabCon.width()>document.documentElement.clientWidth){
				tabCon.css({"left":document.documentElement.clientWidth-tabCon.offset().left-tabCon.width()-4+"px"});
			}
			
			liDom.bind("mouseleave",function(){
				liDom.removeClass('active');
				liDom.children(".tabCon").slideToggle(400);
				liDom.siblings().children(".tabCon").stop(false,true);
				liDom.unbind("mouseleave");
			})
		}
	});
}

/**
 *比对用户权限与菜单 
 *@param settingData 用户权限
 *@param rolesData json菜单
 */
function extendData(settingData,rolesData){
	for(var i=0;i<settingData.length;i++){
		var roleData = findByRolesData(settingData[i].authorityId,rolesData);
		if(roleData){
			settingData[i].url = roleData.url;
			settingData[i].authorityName = roleData.authorityName;
			settingData[i].image = roleData.image;
			settingData[i].authorityType = roleData.authorityType;
			settingData[i].color = roleData.color;
		}
		//递归替换成原有对象
		if(settingData[i]["children"]&&settingData[i]["children"].length>0)extendData(settingData[i]["children"],rolesData);
	}
}

function findByRolesData(id,rolesData){
	for(var i=0;i<rolesData.length;i++){
		if(id==rolesData[i]["authorityId"]){
			return rolesData[i];
		}else if(rolesData[i]["children"]&&rolesData[i]["children"].length>0){
			var roleData = findByRolesData(id,rolesData[i]["children"]);
			if(roleData){return roleData};
		}
	}
}
/**
 * 菜单控制
 */
function getAllMenuHtml(settingDatas,level){
    for(var i=0;i<settingDatas.length;i++){
    	if(level==2&&i==0&&settingDatas[i]["authorityType"]=="菜单"){//如果是二级菜单必须在外层拼接容器html
    		var num=settingDatas.length>6?6:settingDatas.length;
        	menuHtml += "<div class=\"tabCon\" style=\"width:"+(num*81+20)+"px\"><ul class=\"tabConUl\">";
    	}
        if(level==1&&settingDatas[i]["authorityType"]=="菜单"){//一级菜单拼接html
            menuHtml += "<li class=\"navico\" "+(settingDatas[i]["authorityName"].length>4?"style=\"width:"+(settingDatas[i]["authorityName"].length*14+12)+"px;\"":"")+" id=\""+settingDatas[i]["authorityId"]+"\" src=\""+settingDatas[i]["url"]+"\" onClick=\"menuClick('"+settingDatas[i]["url"]+"','"+settingDatas[i]["authorityId"]+"')\"><a href=\"javascript:void(0)\" ><i class=\"icon iconfont "+settingDatas[i]["image"]+"\"></i><span>"+settingDatas[i]["authorityName"]+"</span></a>";
        }else if(level==2&&settingDatas[i]["authorityType"]=="菜单"){//二级菜单
            menuHtml += "<li><a style='color: white;background:"+colorData[i]+";' class=\"color3\" href=\"javascript:void(0)\" id=\""+settingDatas[i]["id"]+"\" src=\""+settingDatas[i]["url"]+"\" onClick=\"menuClick('"+settingDatas[i]["url"]+"','"+settingDatas[i]["authorityId"]+"')\"><i class=\"icon iconfont\">"+settingDatas[i]["image"]+"</i></a><span style=\"color: white;\">"+settingDatas[i]["authorityName"]+"</span></li>";
        }else{
            //按钮暂或tab页不处理
        }
        if(settingDatas[i]["children"]&&settingDatas[i]["children"].length>0){
            //递归向下处理
            getAllMenuHtml(settingDatas[i]["children"], level+1);
        }
        
        if(i==settingDatas.length-1){
        	 if(level==2&&settingDatas[0]["authorityType"]=="菜单"){//如果是二级菜单必须先拼接
        		menuHtml += "</ul></div>";
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
	$(".navico").removeClass("focus");
	$("#"+id).addClass("focus");
	window.currentNode = findByRolesData(id, settingData);
	var allNodes = [ currentNode ];
	var pNode = findParentNode(currentNode, settingData, null);
	while (pNode) {
		allNodes.push(pNode);
		pNode = findParentNode(pNode, settingData, null);
	}
	/*
	var positionText = "当前位置：";
	for (var i = allNodes.length - 1; i >= 0; i--)
		positionText += allNodes[i]["alias"] + (i == 0 ? "" : " -> ");
	$(".trainInfo").find("div:first").text(positionText);*/
}

function findParentNode(currentNode, moduleData, parentNode) {
	if (moduleData && moduleData.length > 0) {
		for ( var idx in moduleData) {
			if (moduleData[idx].id == currentNode.id) {
				return parentNode;
			} else if (moduleData[idx]["children"]
					&& moduleData[idx]["children"].length > 0) {
				var node = findParentNode(currentNode,
						moduleData[idx]["children"], moduleData[idx]);
				if (node)
					return node;
			}
		}
	}
}
