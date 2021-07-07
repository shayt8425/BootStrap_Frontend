RTU.DEFINE(function (require, exports) {
/**
 * 模块名：首页header
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("app/home/app-loadData.js");
    require("app/home/app-map.js");
    require("app/home/app-map-track.js");
    require("app/systemsetting/app-systemsetting-personalsetting-control.js");
    require("app/warning/app-warning-list.js");
    require("app/home/app-map-pointControls.js");
    require("app/home/app-map-labelCount.js");
    require("app/electronicfenceNew/app-electronicfence-query.js");
    var mData = RTU.data.user;
    //home图标功能
    ///描述：注册header点击导航响应事件
    ///方法名：header.home.init  split
    ///参数：无
    ///返回值：无
    ///执行方式：直接只执行一遍
    RTU.register("header.home.init", function () {
        $(".header .header_nav_home").click(function () {
            RTU.invoke("navigation.recycle");
            RTU.invoke("navigation.init");
        });
        $(".header_index").click(function () {
            window.location.href = '../app';
        });
        return function () {
        };
    });
    
    //警报
    RTU.register("header.alarm.init", function () {
        return function () {
        };
    });
    
    ///描述：注册Header导航栏事件
    ///方法名：header.nav.init
    ///参数：无
    ///返回值：无
    ///执行方式：直接执行一遍 
    RTU.register("header.nav.init", function () {
        var saveAjax = function (options, value) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + value + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };
        var getData = function (options) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        var data = data.data;
                        if (data.optionvalue != "0") {
                            var optionValue = "";
                            optionValue = RTU.invoke("map.getNowMapLevel");
                            optionValue += "," + RTU.invoke("map.getCenter").Cx + "," + RTU.invoke("map.getCenter").Cy;
                            saveAjax("RecordingLastClick", optionValue);
                        }
                    }
                }
            });
        };
        var initClick = function () {
            $(".header .header_account").click(function () {
                RTU.invoke("header.nav.dropdown.show");
            });
            //修改密码
            var data_passwordsetting = RTU.invoke("app.setting.data", "passwordsetting");
            if (data_passwordsetting == null) {
                $(".header-nav-dropdown-item-modify").hide();
            } else {
                $(".header-nav-dropdown-item-modify").show();

                $(".header-nav-dropdown .header-nav-dropdown-item-modify").click(function () {
                    RTU.invoke("header.nav.dropdown.show", false);
                    RTU.invoke("app.module.active", "passwordsetting");
                });
            }
            $(".header-nav-dropdown .header-nav-dropdown-item-logout").click(function () {
                ////是否记录鼠标最后点击位置
                getData("RecordingLastClick");
                RTU.invoke("header.nav.dropdown.show", false);
                RTU.invoke("core.router.get", {
                    url: "/logout",
                    success: function () {
                    	window.top.location.href = '../app/login.html';
                    }
                });
                RTU.utils.cookie.clearall();
            });
            //个人设置
            var data_systemsetting = RTU.invoke("app.setting.data", "systemsetting");
            if (data_systemsetting == null) {
                $(".header-nav-dropdown-item-personal").hide();
            } else {
                $(".header-nav-dropdown-item-personal").show();

                $(".header-nav-dropdown .header-nav-dropdown-item-personal").click(function () {
                    RTU.invoke("header.nav.dropdown.show", false);
                    RTU.invoke("app.module.active", "systemsetting");
                });
            }
        };
        initClick();
        return function () {
        };
    });
    
    ///描述：注册页面dom显示隐藏方法
    ///方法名：header.nav.dropdown.show
    ///参数：pData真假值
    ///返回值：无
    ///执行方式：调用
    ///调用例如：RTU.invoke("header.nav.dropdown.show",pData)
    RTU.register("header.nav.dropdown.show", function () {
        var isShow = false;
        $("body div").click(function () {
            if ($(this).attr("class") && ($(this).attr("id") == ("map") || $(this).hasClass("header_maptooler") || $(this).hasClass("header_systemsetup") || $(this).hasClass("header_nav_notice_num"))) {
                $(".header-nav-dropdown").attr("class", "header-nav-dropdown hidden");
                isShow = false;
            }
        });
        return function (pData) {
            if (pData == true) {
                $(".header-nav-dropdown").attr("class", "header-nav-dropdown");
                isShow = true;
            } else if (pData == false) {
                $(".header-nav-dropdown").attr("class", "header-nav-dropdown hidden");
                isShow = false;
            } else if (isShow) {
                $(".header-nav-dropdown").attr("class", "header-nav-dropdown hidden");
                isShow = false;
            } else {
                $(".header-nav-dropdown").attr("class", "header-nav-dropdown");
                isShow = true;
            }
        };
    });
    
    ///描述：注册信息提示的tip方法
    ///方法名：header.notice.show
    ///参数：msg
    ///返回值：无
    ///执行方式：调用
    ///调用例如：RTU.invoke("header.notice.show",msg)
    RTU.register("header.notice.show", function () {
        return function (msg) {
            $(".header-notice-contianer").attr("class", "header-notice-contianer");
            $(".header-notice-contianer .header-notice-main-text").html(msg);
            setTimeout("$('.header-notice-contianer').attr('class','header-notice-contianer hidden');", 2000);
        };
    });
    
    ///描述：注册显示登录名
    ///方法名：header.account.init
    ///参数：无
    ///返回值：无
    ///执行方式：直接执行一次
    RTU.register("header.account.init", function () {
        if (mData) {
            $(".header_account_name").text(mData.realName || mData.loginName || "");
        }
        return function () { };
    });
    
    //控制地图工具栏的显示隐藏
    RTU.register("header.maptooler.show", function () {
        var isShow = false;
        $("body div").click(function () {
            if ($(this).attr("class") && ($(this).attr("id") == ("map") || $(this).hasClass("header_account") || $(this).hasClass("header_systemsetup") || $(this).hasClass("header_nav_notice_num"))) {
                $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown hidden");
                isShow = false;
            }
        });
        $("body .header-maptooler-dropdown div").click(function () {
            $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown");
            isShow = true;
            return false;
        });
        return function (pData) {
            if (pData == true) {
                $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown");
                isShow = true;
            } else if (pData == false) {
                $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown hidden");
                isShow = false;
            } else if (isShow) {
                $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown hidden");
                isShow = false;
            } else {
                $(".header-maptooler-dropdown").attr("class", "header-maptooler-dropdown");
                isShow = true;
            }
        };
    });
    
    //查询所有的个人设置
    var optionValues = {};
    RTU.register("app.maptooler.searchUserSet", function () {
        return function () {
            var url = "syssetting/findByUserId";
            var param = {
                url: url,
                data: {
                    "userId": RTU.data.user.id
                },
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    if (data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            optionValues[data.data[i].options] = data.data[i].optionvalue;
                        }
                    }
                },
                error: function () {
                }
            };
            RTU.invoke("core.router.get", param);
        };
    });
    
    RTU.tipsShow = null;
    RTU.stationShow = null;
    RTU.telesemeShow = null;
    RTU.turnoutShow = null;
    //地图工具功能实现
    RTU.register("header.maptooler.init", function () {
        var initClick = function () {
            $("#header_maptooler").click(function () {
                RTU.invoke("header.maptooler.show");
            });
            var electronicFence = 1; //电子围栏切换用
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-1").click(function () {
                //电子围栏开关
                if (electronicFence % 2 == 0) {
                    RTU.invoke("map.marker.electronicRailClose", { closeFn: function () { } });
                    $(".header-maptooler-dropdown-item-1").text("电子围栏-开");
                    
                    RTU.invoke("map.removeAllGraphics");//清除所有线
                   var pointArr= RTU.invoke("app.eelectronrail.getElectronPointArr");
                   RTU.invoke("map.marker.removeAllMarker",pointArr);//在地图上清除所有点
                   RTU.invoke("app.electronrail.clearElectronPointArr");//清空保存画的点
         		   RTU.invoke("app.electronrail.clearElectronPolygons");//清空保存画面的数组
                } else {
                	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                	var url="electronicNew/findAllElectronrails?type=3";
                    var param={
                          url: url,
                          cache: false,
                          asnyc: true,
                          datatype: "json",
                          success: function (data) {
                        	  RTU.invoke("header.msg.hidden");
                             if(data.data&&data.data.length>1){
                            	 var showData=data.data;
                            	 //画围栏的区域添加标注点
                            	 for ( var int = 0; int < showData.length; int++) {
                            		 showData[int].isShow=true;
                            		 RTU.invoke("app.electronrails.showElectronicRPolygon",showData[int]);
                            		 RTU.invoke("app.electronrail.query.addMarkerLocatin",showData[int]);
                            	 }
                             }
                          },
                          error: function () {
                          }
                        };
                       RTU.invoke("core.router.get", param);
                	//获取所有的点
                	//获取所有的面
                	
//                   var tool_polygon = RTU.invoke("map.marker.electronicRail", { borderb: 3, borderc: '#FF00FF', borderpocity: 0.7, core: '#FFFF66', pocity: 0.3, completeFn: function (arr) {
//                        //电子围栏点的坐标
//                		 var arr  =tool_polygon.CoordinatesArr;
//                	     Map.addEventListener(RMapEvent.MouseClickEvent,function(e){
//                	    	  var p ={};
//                	    	  p.Cx = e.MouseCx;
//                	    	  p.Cy=  e.MouseCy;
////                	    	  if(IsPointInRegion(p,arr)){
////                	    		  alert(1);
////                	    	  }else{
//////                	    		  alert(2);
////                	    	  }
////                	    	  return false;
//
//                	     });
//                    } 
//                    });
                    $(".header-maptooler-dropdown-item-1").text("电子围栏-关");
                }
                RTU.invoke("header.maptooler.show", false);
                electronicFence++;
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-2").click(function () {
                //TIPS开关
                RTU.invoke("app.maptooler.searchUserSet");
                var NowMapLevel = RTU.invoke("map.getNowMapLevel");
                if (NowMapLevel >= userData["Tips"]) {
                    var TIPS1 = RTU.invoke("map.marker.tIPSMarkerStuts");
                    if (TIPS1) {
                        RTU.invoke("map.marker.tIPSMarkerClose");
                        RTU.tipsShow = "close";
                    } else {
                        RTU.invoke("map.marker.tIPSMarkerOpen");
                        RTU.tipsShow = "open";
                    }
                }
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-3").click(function () {
                //鹰眼开关
                var status = RTU.invoke("map.EagleStatus"); //开关状态
                if (status) {
                    RTU.invoke("map.addEagleClose");
                    $(".header-maptooler-dropdown-item-3").text("鹰眼-开");
                } else {
                    RTU.invoke("map.addEagleOpen", { width: 250, height: 250 });
                    $(".header-maptooler-dropdown-item-3").text("鹰眼-关");
                }
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-4").click(function () {
                //清空测距
                RTU.invoke("map.rangingClose");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-5").click(function () {
                //测距
                var ranging = RTU.invoke("map.rangingStuts");
                RTU.invoke("map.rangingOpen");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-6").click(function () {
                //缩小
                RTU.invoke("map.marker.reduceLevel");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-7").click(function () {
                //放大
                RTU.invoke("map.marker.addLevel");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-8").click(function () {
                //还原全国位置
                RTU.invoke("map.setInitialChina");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-9").click(function () {
                //还原默认位置
                RTU.invoke("map.setInitialPosition");
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-10").click(function () {
                //设置车站标注显示
                RTU.invoke("app.maptooler.searchUserSet");
                var NowMapLevel = RTU.invoke("map.getNowMapLevel");
                if (NowMapLevel >= userData["Station"]) {
                    var stationStatus = RTU.invoke("map.marker.StationMarkerStuts");
                    if (stationStatus) {
                        RTU.invoke("map.hideStation");
                        RTU.stationShow = "close";
                    } else {
                        RTU.invoke("map.showStation");
                        RTU.stationShow = "open";
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "stationState", value: RTU.stationShow });
                }
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-11").click(function () {
                //设置信号机标注显示
                RTU.invoke("app.maptooler.searchUserSet");
                var NowMapLevel = RTU.invoke("map.getNowMapLevel");
                if (NowMapLevel >= userData["Signal"]) {
                    var telesemeStatus = RTU.invoke("map.marker.TelesemeMarkerStuts");
                    if (telesemeStatus) {
                        RTU.invoke("map.hideTeleseme");
                        RTU.telesemeShow = "close";
                    } else {
                        RTU.invoke("map.showTeleseme");
                        RTU.telesemeShow = "open";
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "telesemeState", value: RTU.telesemeShow });
                }
                RTU.invoke("header.maptooler.show", false);

            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-12").click(function () {
                //设置道岔标注显示
                RTU.invoke("app.maptooler.searchUserSet");
                var NowMapLevel = RTU.invoke("map.getNowMapLevel");
                if (NowMapLevel >= userData["DaoCha"]) {
                    var turnoutStatus = RTU.invoke("map.marker.TurnoutMarkerStuts");
                    if (turnoutStatus) {
                        RTU.invoke("map.hideTurnout");
                        RTU.turnoutShow = "close";
                    } else {
                        RTU.invoke("map.showTurnout");
                        RTU.turnoutShow = "open";
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "turnoutState", value: RTU.turnoutShow });
                }
                RTU.invoke("header.maptooler.show", false);
            });
            $(".header-maptooler-dropdown .header-maptooler-dropdown-item-13").click(function () {
            	if($(this).text()=="关闭离线机车"){
                	$.ajax({
                        url: "../syssetting/updateObjByProperty?options=ShowOffLineLoco&optionvalue=0" +
                        		"&userid=" + RTU.data.user.id + "&type=2",
                        dataType: "jsonp",
                        type: "GET",
                        success: function (value) {
                        	window.userData["ShowOffLineLoco"]=0;
                        	window.pSKeeping = {}; //用来储存point点 以便更新点的时候不用再次添加
                            window.carPointData={};//存储机车点
                            RTU.invoke("map.marker.removeAllMarker");
                        }
                    });
                	$(this).html("打开离线机车");
            	}
            	else{
            		$.ajax({
                        url: "../syssetting/updateObjByProperty?options=ShowOffLineLoco&optionvalue=1" +
                        		"&userid=" + RTU.data.user.id + "&type=2",
                        dataType: "jsonp",
                        type: "GET",
                        success: function (value) {
                        	window.userData["ShowOffLineLoco"]=1;
                        	window.pSKeeping = {}; //用来储存point点 以便更新点的时候不用再次添加
                            window.carPointData={};//存储机车点
                            RTU.invoke("map.marker.removeAllMarker");
                        }
                    });
                	$(this).html("关闭离线机车");
            	}
            });
            
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=ShowOffLineLoco&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                	if(value&&value.data){
                		if(value.data.optionvalue=="1"){
                			$(".header-maptooler-dropdown .header-maptooler-dropdown-item-13").html("关闭离线机车");
                        }
                        else $(".header-maptooler-dropdown .header-maptooler-dropdown-item-13").html("打开离线机车");
                	}
                	else $(".header-maptooler-dropdown .header-maptooler-dropdown-item-13").html("关闭离线机车");
                }
            });
        };
        initClick();
        return function () { };
    });

    //保存设置
    RTU.register("header.maptooler.saveState", function () {
        return function (data) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + data.option + "&optionvalue=" + data.value + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    RTU.invoke("header.maptooler.searchAllUser");
                }
            });
        };
    });

    RTU.register("header.maptooler.searchAllUser", function () {
        return function () {
            $.ajax({
                url: "../syssetting/findByUserId?userId=" + RTU.data.user.id,
                type: "get",
                async: false,
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            window.userData[data.data[i].options] = data.data[i].optionvalue;
                        }
                    }
                }
            });
        };
    });

    RTU.register("header.systemsetup.init", function () {

        var initClick = function () {
            //系统设置
            var data_systemsettings = RTU.invoke("app.setting.data", "systemsettings");
            if (data_systemsettings == null) {
                $(".header .header_systemsetup").hide();
                return;
            } else {
                $(".header .header_systemsetup").show();
            }

            //参数设置
            var flag_systemparamsSetting = true;
            var data_systemparamsSetting = RTU.invoke("app.setting.data", "systemparamsSetting");
            if (data_systemparamsSetting == null) {
                $(".header-systemsetup-dropdown-item-preferences").hide();
                flag_systemparamsSetting = false;
            } else {
                $(".header-systemsetup-dropdown-item-preferences").show();
            }

            //用户管理
            var flag_usermanagement = true;
            var data_usermanagement = RTU.invoke("app.setting.data", "usermanagement");
            if (data_usermanagement == null) {
                $(".header-systemsetup-dropdown-item-user_management").hide();
                flag_usermanagement = false;
            } else {
                $(".header-systemsetup-dropdown-item-user_management").show();
            }

            //角色管理 
            var flag_rolepermissionsmanagement = true;  
            var data_rolepermissionsmanagement = RTU.invoke("app.setting.data", "rolepermissionsmanagement");
            if (data_rolepermissionsmanagement == null) {
                $(".header-systemsetup-dropdown-item-role_management").hide();
                flag_rolepermissionsmanagement = false;
            } else {
                $(".header-systemsetup-dropdown-item-role_management").show();
            }
            
            //注册管理
            var loco_regmanagement = true;  
            var loco_regmanagement = RTU.invoke("app.setting.data", "locoregmanagement");
            if (!loco_regmanagement) {
                $(".header-systemsetup-dropdown-item-loco_regmanagement").hide();
                loco_regmanagement = false;
            } else {
                $(".header-systemsetup-dropdown-item-loco_regmanagement").show();
                $(".header-systemsetup-dropdown-item-loco_regmanagement")
                .unbind("click").bind("click",function(){
                	$("#registerTipsDiv").click();
                });
            }   
            
            //机车管理 
            var flag_locomanagement = true;  
            var data_locomanagement = RTU.invoke("app.setting.data", "locomanagement");
            if (data_locomanagement == null) {
                $(".header-systemsetup-dropdown-item-loco_management").hide();
                flag_locomanagement = false;
            } else {
                $(".header-systemsetup-dropdown-item-loco_management").show();
            }            

            //铁路专题数据
            var flag_railwaydissertationdata = true;
            var data_railwaydissertationdata = RTU.invoke("app.setting.data", "railwaydissertationdata");
            if (data_railwaydissertationdata == null) {
                $(".header-systemsetup-dropdown-item-railway_dissertation_data").hide();
                flag_railwaydissertationdata = false;
            } else {
                $(".header-systemsetup-dropdown-item-railway_dissertation_data").show();
            }
            
            //字典管理
            var flag_dictionaryManagementdata = true;
            var data_dictionaryManagementdata = RTU.invoke("app.setting.data", "dictionaryManagement");
            if (data_dictionaryManagementdata == null) {
                $(".header-systemsetup-dropdown-item-dictionarymanagement_data").hide();
                flag_dictionaryManagementdata = false;
            } else {
                $(".header-systemsetup-dropdown-item-dictionarymanagement_data").show();
            }
            //标注点围栏
            var flag_labelpointsenclosuredata = true;
            var data_labelpointsenclosuredata = RTU.invoke("app.setting.data", "labelpointsenclosure");
            if (data_labelpointsenclosuredata == null) {
            	$(".header-systemsetup-dropdown-item-labelpointsenclosure_data").hide();
            	flag_labelpointsenclosuredata = false;
            } else {
            	$(".header-systemsetup-dropdown-item-labelpointsenclosure_data").show();
            }
            
            $(".header .header_systemsetup").click(function () {
                RTU.invoke("header.systemsetup.dropdown.show");
            });

            if (flag_systemparamsSetting) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-preferences").click(function () {
                    RTU.invoke("header.systemsetup.dropdown.show", false);
                    RTU.invoke("app.module.active", "systemparamsSetting");
                });
            }

            if (flag_usermanagement) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-user_management").click(function () {
                    RTU.invoke("header.systemsetup.dropdown.show", false);
                    RTU.invoke("app.module.active", "usermanagement");
                });
            }

            if (flag_rolepermissionsmanagement) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-role_management").click(function () {
                    RTU.invoke("header.systemsetup.dropdown.show", false);
                    RTU.invoke("app.module.active", "rolepermissionsmanagement");
                });
            }
            //机车管理
            if (flag_locomanagement) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-loco_management").click(function () {
                    RTU.invoke("header.systemsetup.dropdown.show", false);
                    RTU.invoke("app.module.active", "locomanagement");
                });
            }
            
          //字典管理
            if (flag_dictionaryManagementdata) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-dictionarymanagement_data").click(function () {
                    RTU.invoke("header.systemsetup.dropdown.show", false);
                    RTU.invoke("app.module.active", "dictionaryManagement");
                });
            }
            //标注点围栏
            if (flag_labelpointsenclosuredata) {
            	$(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-labelpointsenclosure_data").click(function () {
            		RTU.invoke("header.systemsetup.dropdown.show", false);
            		RTU.invoke("app.module.active", "labelpointsenclosure");
            	});
            }

            //			$(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-section_management").click(function() {
            //				RTU.invoke("header.systemsetup.dropdown.show",false);
            //			});

            if (flag_railwaydissertationdata) {
                $(".header-systemsetup-dropdown .header-systemsetup-dropdown-item-railway_dissertation_data").click(function () {
					    RTU.invoke("header.systemsetup.dropdown.show", false);
					    RTU.invoke("app.module.active", "railwaydissertationdata");
				});
            }
            RTU.invoke("app.realtimelocomotivequery.setLabPoint");//画标注点
        };
        initClick();
        return function () {
        };
    });
    
    //控制地图工具显示隐藏
    RTU.register("header.systemsetup.dropdown.show", function () {
        var isShow = false;
        $("body div").click(function () {
            if ($(this).attr("class") && ($(this).attr("id") == ("map") || $(this).hasClass("header_account") || $(this).hasClass("header_maptooler") || $(this).hasClass("header_nav_notice_num"))) {
                $(".header-systemsetup-dropdown").attr("class", "header-systemsetup-dropdown hidden");
                isShow = false;
                return true;
            }
        });
        return function (pData) {
            if (pData == true) {
                $(".header-systemsetup-dropdown").attr("class", "header-systemsetup-dropdown");
                isShow = true;
            } else if (pData == false) {
                $(".header-systemsetup-dropdown").attr("class", "header-systemsetup-dropdown hidden");
                isShow = false;
            } else if (isShow) {
                $(".header-systemsetup-dropdown").attr("class", "header-systemsetup-dropdown hidden");
                isShow = false;
            } else {
                $(".header-systemsetup-dropdown").attr("class", "header-systemsetup-dropdown");
                isShow = true;
            }
        };
    });

    //显示提示信息，可设置位置
    RTU.register("header.msg.show", function () {
        return function (msg) {
        	if(msg.indexOf("-")!=-1){
        		var a=msg.split("-");
            	 $(".header-msg-contianer").css({"top":a[1]+"px","left":a[2]+"px"});
        		 $(".header-msg-contianer").attr("class", "header-msg-contianer");
                 $(".header-msg-contianer .header-msg-main-text").html(a[0]);
        	}else{
        		$(".header-msg-contianer").css({"top":"50%","left":"50%"});
                $(".header-msg-contianer").attr("class", "header-msg-contianer");
                $(".header-msg-contianer .header-msg-main-text").html(msg);
        	}
        };
    });

    //隐藏提示信息
    RTU.register("header.msg.hidden", function () {
        return function () {
            $('.header-msg-contianer').attr('class', 'header-msg-contianer hidden');
        };
    });

    //提示信息，包含确认和右上角x
    RTU.register("header.alarmMsg.show", function () {
        return function (msg) {
        	if(msg.indexOf("-")!=-1){
        		var a=msg.split("-");
        		$("#alarmDiv").css({"top":"50%","left":"50%"});
                $("#alarmContent").text(a[0]);
        	}else{
                $("#alarmContent").text(msg);
        	}
            $("#alarmDiv").removeClass("hidden");
            $("#sureBtn").click(function () {
                $("#alarmDiv").addClass("hidden");
            });
            $(".closeImg").click(function () {
                $("#alarmDiv").addClass("hidden");
            });
        };
    });
    
  //提示信息，包含确认和右上角x  显示位置为当前鼠标位置
    RTU.register("header.alarmMsg.showMousePosition", function () {
    	function getMousePos(event) {
	        var e = event || window.event;
	        return {'x':e.clientX,'y':e.clientY};
	    }
        return function (msg) {
        	if(msg.indexOf("-")!=-1){
        		var a=msg.split("-");
        		var xy =getMousePos();
        		$("#alarmDiv").css({"top":(xy.y-90)+"px","left":xy.x+"px"});
                $("#alarmContent").text(a[0]);
        	}else{
                $("#alarmContent").text(msg);
        	}
            $("#alarmDiv").removeClass("hidden");
            $("#sureBtn").click(function () {
                $("#alarmDiv").addClass("hidden");
            });
            $(".closeImg").click(function () {
                $("#alarmDiv").addClass("hidden");
            });
        };
    });
    
    //隐藏提示信息
    RTU.register("header.alarmMsg.hide", function () {
        return function () {
                $("#alarmDiv").addClass("hidden");
        };
    });
    
    //提示信息，包含确认和取消按钮
    RTU.register("header.roleAlarmMsg.show", function () {
        return function (msg) {
        	if(msg.indexOf("-")!=-1){
        		var a=msg.split("-");
        		$("#roleAlarmDiv").css({"top":"50%","left":"50%"});
                $("#roleAlarmContent").text(a[0]);
        	}else{
                $("#roleAlarmContent").text(msg);
        	}
            $("#roleAlarmDiv").removeClass("hidden");
            $("#roleAlarmSureBtn").unbind("click").click(function () {
                $("#roleAlarmDiv").addClass("hidden");
            });
            $("#roleAlarmCanelBtn").unbind("click").click(function () {
                $("#roleAlarmDiv").addClass("hidden");
            });
        };
    });
    
    //隐藏提示信息
    RTU.register("header.roleAlarmMsg.hide", function () {
        return function () {
            $("#roleAlarmDiv").addClass("hidden");
        };
    });
    
    //时间格式化
    window.formatDate= function formatCSTDate(strDate,format){
  	   var date=new Date(strDate);
  	   var paddNum = function(num){
     		num += "";
     		return num.replace(/^(\d)$/,"0$1");
  	   };
	  	//指定格式字符
	  	var cfg = {
	  		yyyy : date.getFullYear(), //年 : 4位
	  		yy : date.getFullYear().toString().substring(2),//年 : 2位
	  		M  : paddNum(date.getMonth() + 1),  //月 : 如果1位的时候不补0
	  		MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
	  		d  : paddNum(date.getDate()),   //日 : 如果1位的时候不补0
	  		dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
	  		hh : paddNum(date.getHours()), //时
	  		mm : paddNum(date.getMinutes()), //分
	  		ss : paddNum(date.getSeconds()) //秒
	  	};
	  	format || (format = "yyyy-MM-dd hh:mm:ss");
	  	return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
      };
});
