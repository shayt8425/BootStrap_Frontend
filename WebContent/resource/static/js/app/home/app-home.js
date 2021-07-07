RTU.DEFINE(function (require, exports) {
/**
 * 模块名：主页
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	
    require("jquery/jquery-1.7.2.min.js");
    require("jquery/drag.js");
    require("jquery/jquery.autocomplete.css");
    require("jquery/jquery.autocomplete.js");
    require("../../../css/app/app-rightclick.css");
    require("app/home/app-index-right-initmove.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filetransfer.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filedownload.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.js");
    require("../../../css/app/moveCurve/moveCurve.css");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    require("RTGrid/makePy.js");
    require("RTGrid/RTGrid.js");
    require("RTGrid/RTGrid.css");
    require("../../../css/app/moveCurve/moveCurve.css");
    require("app/curve/moveCurve/moveCurve.js");
    require("app/home/app-loadData.js");
    require("app/warning/app-warning-list.js");
    
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-rightclick-filedownload.js");
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-rightclick-filetransfer.js");
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-trainalarm.js");
    
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-sysquery.js");
    require("../../../css/app/app-realtimeloco15motive-sysquery.css");
    
    require("../../../css/app/moveCurve/moveCurve15.css");
    require("app/curve/moveCurve/moveCurve15_new.js");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu15-query.js");
    require("app/lkj15limitinfo/app-lkj15limitinfo-query.js");
    require("app/labelpointsenclosure/app-labelpointsenclosure-query-detail.js");
/*    require("app/realtimelocomotivequery/app-realtimelocomotivequery-query.js");*/

    var baseurl1 = "";
    var baseurl2 = "../";
    var roles = {};
    var timer;
    var timer1;
    var timer2;
    var aa = "";
    window.isAroundLocoList = false;
    window.isThisLineLocoList = false;
    window.warningDataLength=0;
    window.locoAb_A="A";
    window.locoAb_B="B";
    window.labelpointsenclosurePointArr=[];//保存显示过的标注点
    ///描述：注册页面加载方法
    ///注册的方法名："core.router.load"
    ///参数：param即ajax对象
    ///返回值：无
    ///执行方式：调用
    ///调用例子：RTU.invoke("core.router.load",param);
    RTU.register("core.router.load", function () {
        var dellRole = function (param) {
            if (param.dataType == "html") {
                param._success = param.success;
                RTU.invoke("header.account.set", RTU.data.user);
                param.success = function (html) {
                    param._success(dellHtml(html));
                };
            }
        };
        var dellHtml = function (html) {
            var $html = $("<div>" + html + "</div>");
            $html.find("._ROLE_").each(function () {
                var $el = $(this);
                if (!isPermissioned($el.attr("role"))) {
                    //$el.remove();
                }
            });
            return $html.html();
        };
        var isPermissioned = function (pData) {
            if (roles[pData]) {
                return true;
            }
            return false;
        };
        return function (param) {
            param.url = baseurl1 + param.url;
            if (!param.dataType)
                param.dataType = "html";
            dellRole(param);
            $.ajax(param);
        };

    });
   
    ///描述：注册ajax()的GET请求方式的方法
    ///方法名："core.router.get"
    ///参数：param即ajax对象
    ///返回值：无
    ///执行方式：调用
    ///调用如：RTU.invoke("core.router.get",param);
    RTU.register("core.router.get", function () {
        return function (param) {
            param.url = baseurl2 + param.url;
            param.url = encodeURI(param.url);
            param.dataType = "jsonp";
            param.type = "GET";
            $.ajax(param);
        };
    });
    ///描述：注册ajax()的POST请求方式的方法
    ///方法名："core.router.post"
    ///参数：param即ajax对象
    ///返回值：无
    ///执行方式：调用
    ///调用如：RTU.invoke("core.router.post",param);
    RTU.register("core.router.post", function () {
        return function (param) {
            param.url = baseurl2 + param.url;
            param.url = encodeURI(param.url);
            param.dataType = "jsonp";
            param.type = "POST";
            $.ajax(param);
        };
    });

    ///描述：注册菜单点击响应事件
    ///方法名：app.module.active
    ///参数：module模块名称，如setting里面对应的"module"数组项的name属性
    ///返回值：无
    ///执行方式：调用
    ///调用如：调用如：RTU.invoke("app.module.active",module);
    RTU.register("app.module.active", function () {
        var lastModule;
        return function (module) {
            RTU.invoke("header.msg.show","请稍后。。");
        		
        	RTU.invoke("header.alarmMsg.hide");
        	
        	RTU.invoke("header.roleAlarmMsg.hide");
        	 setTimeout(function(){
             	
             	
             },1);
        	
        
        	//统一关闭定时器，除了主页
            if (lastModule) {
                RTU.invoke("app." + lastModule + ".nav.deactivate");
                RTU.invoke("app." + lastModule + ".query.deactivate");
                RTU.invoke("app." + lastModule + ".result.deactivate");
            }
            var data;
            if (!RTU.invoke("app." + module + ".query.init")) {
                if (!data) {
                    data = RTU.invoke("app.setting.data", module);
                }
                if (data && data.url) {
                
                    data.isActive = true;
                    RTU.USE(data.url);
                	
                }else{
                	RTU.invoke("header.msg.hidden");
                	RTU.invoke("header.notice.show","功能开发中！");
                }
            }
           
            RTU.invoke("app." + module + ".nav.activate");
            RTU.invoke("app." + module + ".query.activate");
            RTU.invoke("app." + module + ".result.activate");

            var thisModel=$(".nav_item_" + module);
            if(!$(thisModel).hasClass("nav_item")){
            	$($(thisModel).parents(".popuwnd")).hide(); //隐藏2级菜单
            }
            
            lastModule = module;
        };
    });
    ///描述：注册获取当前登录用户的信息
    ///方法名：app.data.user
    ///参数：无
    ///返回值：当前登录的用户信息
    ///执行方式：调用
    ///调用形如：RTU.invoke("app.data.user")
    RTU.register("app.data.user", function () {
        return function () {
            return RTU.data.user;
        };
    });
    ///描述：注册用户登录权限验证
    ///方法名：app.setting.init
    ///参数：无
    ///返回值：无
    ///执行方式：直接执行
    RTU.register("app.setting.init", function () {
        var parseRoles = function (pData) {
            if (pData && pData.length) {
                for (var i = 0; i < pData.length; i++) {
                    roles[pData[i].id] = true;
                    if (pData[i].module && pData[i].module.length && pData[i].module.length > 0) {
                        parseRoles(pData[i].module);
                    }
                }
            }
        };
       
        RTU.invoke("core.router.get", {
            url: "./setting",
            success: function (data) {
            	data = top.loginSysData;
            	RTU.invoke("header.alarmMsg.show", "请选择开始时间！");
                RTU.data = data.data;
                parseRoles(data.data.setting);
                if (data.data && data.data.user && data.data.setting && data.data.setting.length && data.data.setting.length > 0) {

                	$("body").attr("class", "");
                    RTU.USE("app/home/app-header.js");
                  //不调用菜单  RTU.USE("app/home/app-navigation.js");
                    RTU.USE("app/home/app-map.js");
                    RTU.USE("app/home/app-map-track.js");
                    RTU.USE("app/home/app-map-pointControls.js");
                    RTU.invoke("app.user.complexion.update");
                    RTU.invoke("app.index.changeMapModel.init");
                    
                    var attentionLocos=RTU.data.user.attentionLocos;
                    if(attentionLocos){
                    	var arr=attentionLocos.split(",");
                        RTU.data.user.locoList=[];
                        for(var i=0;i<arr.length;i++){
                        	RTU.data.user.locoList[i]=arr[i];
                        }
                    }
                    
                } else {
                    window.setTimeout(function () {
                    	window.top.location.href = '../app/login.html';
                    }, 500);
                }
            },
            error: function () {
                window.setTimeout(function () {
                    window.top.location.href = '../app/login.html';
                }, 500);
                console.log("loading setting error");
            }
        });
        return function () {
        };
    });
    ///描述：注册加载权限模块数据
    ///方法名：app.setting.data
    ///参数：module模块名称
    ///返回值：返回权限模块数据
    ///执行方式：调用
    ///调用如：RTU.invoke("app.setting.data",module)
    RTU.register("app.setting.data", function () {
        return function (module) {
            for (var i = 0; RTU.data && RTU.data.setting && i < RTU.data.setting.length; i++) {
                if (module == RTU.data.setting[i].name) {
                    return RTU.data.setting[i];
                }
                for (var j = 0; RTU.data.setting[i].module && RTU.data.setting[i].module.length && j < RTU.data.setting[i].module.length; j++) {
                    if (module == RTU.data.setting[i].module[j].name) {
                    	if(RTU.data.setting[i].module[j].module&&RTU.data.setting[i].module[j].module.length>0){
                     	   for(var k=0;k<RTU.data.setting[i].module[j].module.length;k++){
                     		   if(RTU.data.setting[i].module[j].module[k].name=="5milesDownload")
                        		   window.hasDownPerm=true;//有第三级的权限说明是拥有5公里速度下载权限
                     		   else if(RTU.data.setting[i].module[j].module[k].name=="forceFlagDownload")
                        		   window.hasForceFlagPerm=true;//允许强制转储文件
                     		   else if(RTU.data.setting[i].module[j].module[k].name=="getFlagDownload")
                        		   window.hasGetFlagPerm=true;//允许从设备获取文件
                     		   else if(RTU.data.setting[i].module[j].module[k].name=="dwConfirm"){
                     			   window.hasDwConfirmPerm=true;
                     		   }
                     		   else if(RTU.data.setting[i].module[j].module[k].name=="jwConfirm"){
                     			  window.hasJwConfirmPerm=true;
                    		   }
                     	   }
                        }
                    	return RTU.data.setting[i].module[j];
                    }
                }
            }
        };
    });

    //    RTU.register("app.role.ispermissioned", function () {
    //        return function (pData) {
    //            if (roles[pData]) {
    //                return true;
    //            }
    //            return false;
    //        };
    //    });

    RTU.register("core.utils.string.isBank", function () {
        return function (s) {
            if (s == null) {
                return true;
            }
            return new RegExp(/^\s*$/).test(s);
        };
    });

    RTU.register("core.utils.cookie.clearall", function () {
        return function (s) {
            var rs = document.cookie.match(new RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))", "gi"));
            for (var i in rs) {
                document.cookie = rs[i] + "=;expires=Mon, 26 Jul 1997 05:00:00 GMT; path=/; ";
            }
        };
    });

    RTU.register("core.utils.input.focusin", function () {
        return function ($input) {
            $input.removeClass("focus");
            $input.addClass("focus");
            $input.focus();
        };
    });

    RTU.register("core.utils.input.focusout", function () {
        return function ($input) {
            $input.removeClass("focus");
        };
    });

    //查询皮肤颜色，并设置
    RTU.register("app.user.complexion.update", function () {
        var getComplexion = function () {
            $.ajax({
                url: "../syssetting/findByProperty?options=皮肤&userid=" + RTU.data.user.id + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                    if (value && value.data) {
                        var color = value.data.optionvalue;
                        if (color == "红色") {
                            $(".header").css("background", "url('../static/img/app/bg_3.png')");
                            $(".index-searche-right-btn").css("background-color", "#c0392b");
                            nav_itemColor(color);
                        } else if (color == "绿色") {
                            $(".header").css("background", "url('../static/img/app/bg_1.png')");
                            $(".index-searche-right-btn").css("background-color", "#009d0c");
                            nav_itemColor(color);
                        } else {
                            $(".header").css("background", "url('../static/img/app/bg_2.png')");
                            $(".index-searche-right-btn").css("background-color", "#005DBA");
                            nav_itemColor("#005DBA");
                        }
                    }
                }
            });
        };

        var nav_itemColor = function (str) {
            var cssset = document.styleSheets[0].cssRules;
            var style1 = cssset[0];
            if (str == "绿色") {
                style1.style.backgroundColor = "#009d0c";
            } else if (str == "红色") {
                style1.style.backgroundColor = "#c0392b";
            } else {
                style1.style.backgroundColor = "#005DBA";
            }
        };
        return function () {
            getComplexion();
        };
    });

    RTU.register("app.setting.getbaseurl2", function () {
        return function () {
            return baseurl2;
        };
    });
    
    //搜索框初始化
    RTU.register("app.index.search.init", function () {
        //    	 $(window).bind("resize", function () {
        //    	     	 var winHeight = document.documentElement.clientHeight;
        //                 var winWidth = document.documentElement.clientWidth;
        //                
        //                 $(".loco-runningstate-query-title-div").parents(".popuwnd").css({"width":winWidth*0.8});
        //    	     });
        $(".index-clear-btn").click(function () {
            $(".index-search-input").val("请输入机车").css("color", "#999999");
        });
        $("#index-searche-right-btn").click(function () {
        	  var width = document.documentElement.clientWidth * 0.95;
        	var left=$(".index-searche-left",$(this).parent());
        	if(!$(left).hasClass("hidden")){
        		$(left).addClass("hidden");
        		$(this).addClass("index-searche-right-btn-leftHidden");
        		var offset=$(this).parent().offset();
        		
        		$(this).parent().css({"width":"50px","left":width+"px","top":"52px"});
        		$("#index-search-right-img").attr("src","../static/img/app/searchImg1.png");
        	}else{
        		$(left).removeClass("hidden");
        		$(this).removeClass("index-searche-right-btn-leftHidden");
        		$(this).parent().css({"width":"248px","left":(width-210)+"px","top":"52px"});
        		$("#index-search-right-img").attr("src","../static/img/app/index-search-img.png");
        	}
        });
        
       

        $(".header_nav_notice_num").click(function () {
        	if(window.warningDataLength>0){
        		if(!window.warningPopuwnd){
            		RTU.invoke("app.warnning.query.activate");
            	}else{
            		window.warningPopuwnd.close();
                	window.warningPopuwnd=undefined;
                	window.sendFaulureWarnningObjData=undefined;
            	}
        	}
        });
        return function () {
            return true;
        };
    });
    
    RTU.register("app.index.changeMapModel.init",function(){
    	var  setMapModel=function(){
    		 $.ajax({
                 url: "../syssetting/findByProperty?options=SetMapShowModel&userid=" + RTU.data.user.id + "&type=2",
                 dataType: "jsonp",
                 type: "GET",
                 success: function (value) {

                     var type = value&&value.data?value.data.optionvalue:"1";
                    
                     var imgSrc="../static/img/app/tile.png";
                     var alt="index_tile";
     				 var labelText="常规地图";
     				 if (type == "0") {
                   	     imgSrc="../static/img/app/tile.png";
    				     labelText="常规地图";
    				     alt="index_tile";
    				     window.mapModel="normal";
                     }else if (type == "1") {
                   	     imgSrc="../static/img/app/tile_railway.png";
    				     labelText="铁路地图";
    				     alt="index_tile_railway";
    				     window.mapModel="railway";
                    } else {
                   	     imgSrc="../static/img/app/tile_moon.png";
    					 labelText="卫星地图";
    					 alt="index_tile_moon";
    					 window.mapModel="moon";
                    }
     				 
                     $(".mapModel_changeLabel").text(labelText);
     				 $(".mapModel_changeLabel").attr("alt",alt);
     				 $("#mapModel_changeImg").attr("src",imgSrc);
     				 RTU.invoke("map.setGuDaoNumberDiv");
                 
                 }
             });
    	};
    	
    	
    	$(".mapModel_changeLabel").unbind("click").click(function(){
    		if($(".select_option_temp")&&$(".select_option_temp").length>0){
    			
    		}else{
    			var alt=$(this).attr("alt");
        		
        		var html="";
        		if(alt=="index_tile"){
        			html=html+"<div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile_railway'>铁路地图</div><div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile_moon'>卫星地图</div>";
        		}else if(alt=="index_tile_railway"){
        			html=html+"<div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile'>常规地图</div><div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile_moon'>卫星地图</div>";
        		}else{
        			html=html+"<div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile_railway'>铁路地图</div><div class='mapModel_changeLabel_option select_option select_option_temp' alt='index_tile'>常规地图</div>";
        		}

        		$(".mapModel_changeLabelDiv").append(html);
        		
        		setTimeout(function(){
        			$(".select_option_temp").unbind("click").click(function(){
        				var alt=$(this).attr("alt");
        				var imgSrc="../static/img/app/tile.png";
        				var labelText="常规地图";
        				var type="0";
        				if(alt=="index_tile"){
        					imgSrc="../static/img/app/tile.png";
        					labelText="常规地图";
        					type="0";
        					 window.mapModel="normal";
        				}else if(alt=="index_tile_railway"){
        					imgSrc="../static/img/app/tile_railway.png";
        					labelText="铁路地图";
        					type="1";
        					 window.mapModel="railway";
        				}else{
        					imgSrc="../static/img/app/tile_moon.png";
        					labelText="卫星地图";
        					type="2";
        					 window.mapModel="moon";
        				}
        				$(".mapModel_changeLabel").text(labelText);
        				$(".mapModel_changeLabel").attr("alt",alt);
        				$("#mapModel_changeImg").attr("src",imgSrc);
        				
        				
        				RTU.invoke("map.temp.setMapShowMoudel",type);
        				$(".select_option_temp").remove();
        				
        				RTU.invoke("app.realtimelocomotivequery.setLabPoint");
        				RTU.invoke("app.labelpointsenclosure.rightHandMap.init");//右键添加标注点
        			});
        		},5);
    		}
    		
    		
    	});
    	$("#map").click(function(){
			$(".select_option_temp").remove();
		});
    	return function(){
    		setMapModel();
    	};
    });

    //搜索框智能提示
    RTU.register("app.index.search.smartTips.init", function () {
        var autocompleteInit = function () {
            try {
                $('#index_checiName').autocomplete("../onlineloco/searchByProperty?dFullName=&bFullName=&sFullName=&showSize=50&locoType=&locoNo=&dName=&checiName&lineName=&trainType=&sName=&temptime=" + new Date().getTime(), {
                    minChars: 0, //表示在自动完成激活之前填入的最小字符
                    max: 100, //表示列表里的条目数
                    autoFill: false, //表示自动填充
                    mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
                    matchContains: true, //表示包含匹配,相当于模糊匹配
                    width: 245,
                    scrollHeight: 200, //表示列表显示高度,默认高度为180
                    dataType: "json",
                    extraParams: {
                        keyword: function () {
                            var r = $("#index_checiName").val();
                            if (r != "请输入机车或车次") {
                                return r;
                            } else {
                                return "";
                            }
                        }
                    },
                    parse: function (data) {
                        data = data.data;
                        var parsed = [];
                        for (var i = 0; i < data.length; i++) {
                        	/*var locoAb="";
                            if (data[i].locoAb == "1") {
                            	locoAb= "A";
                            } else if (data[i].locoAb == "2"){
                            	locoAb= "B";
                            }*/
                            parsed[parsed.length] = {
                                data: data[i],
                                /*value: data[i].locoTypeName + "-" + data[i].locoNO+locoAb,
                                result: data[i].locoTypeName + "-" + data[i].locoNO+locoAb //返回的结果显示内容   
*/ 
                                value: data[i].locoTypeStr,
                                result: data[i].locoTypeStr //返回的结果显示内容 
                                };
                        }
                        return parsed;
                    },
                    formatItem: function (row) {///下拉列表每行数据
                        var isonline = "";
                        if ($.trim(row.isOnline)  == "1"||$.trim(row.isOnline)  == "2") {
                        	  isonline = "../static/img/app/Sig_3.png";
                        } else if ($.trim(row.isOnline)  == "3"||$.trim(row.isOnline)  == "4") {
                        	  isonline = "../static/img/app/Sig_1.png";
                        }
                        /*var locoAb="";
                    	if (row.locoAb == "1") {
                    	   locoAb= "A";
                        } else if (row.locoAb == "2"){
                    	   locoAb= "B";
                        }*/
                        /*return "<table style='z-index:99999;'><tr><td style='width:20px;'>" +
                        		"<div style='width:20px;height:20px;background-image:url(" + isonline + ");'>" +
                        				"</div></td><td align='left' style='width:85px;'>" 
                        		+ row.locoTypeName + "-" + row.locoNO +locoAb +"</td>" +
                        				"<td align='left' style='width:85px;'>" + row.checiName + 
                        				"</td></tr></table>";*/
                    	return "<table style='z-index:99999;'><tr><td style='width:20px;'>" +
                		"<div style='width:20px;height:20px;background-image:url(" + isonline + ");'>" +
                				"</div></td><td align='left' style='width:85px;'>" 
                		+ row.locoTypeStr +"</td>" +
                				"<td align='left' style='width:85px;'>" + row.checiName + 
                				"</td></tr></table>";
                    },
                    formatMatch: function (row) {
                    	/*var locoAb="";
                    	if (row.locoAb == "1") {
                    	   locoAb= "A";
                        } else if (row.locoAb == "2"){
                    	   locoAb= "B";
                       }
                        return row.locoTypeName + "-" + row.locoNO+locoAb;*/
                    	return row.locoTypeStr;
                    },
                    formatResult: function (row) {
                    	/*var locoAb="";
                    	if (row.locoAb == "1") {
                    	   locoAb= "A";
                        } else if (row.locoAb == "2"){
                    	   locoAb= "B";
                        }
                        return row.locoTypeName + "-" + row.locoNO+locoAb;*/
                    	return row.locoTypeStr;
                    }
                }).result(function (event, data, formatted) {
                    if (!formatted) {
                        $('#index_checiName').val(formatted);
                    }
                  $("#index_checiName").css("color", "#000");
                  if ($("#index_checiName").val() == "") {
                  }
                  else {
                      RTU.invoke("map.marker.electronicRlineClose");
//                      RTU.invoke("map.marker.showCarMarker");
//                      RTU.invoke("map.marker.showguDaoMarker");
                      RTU.invoke("map.removeAllGraphics");
//                    	  $(".popuwnd-title-del-btn").each(function (i, item) {
//                              if($(this).offsetParent.innerText!="列车跟踪"){
//                             	 $(this).click();
//                              }else{
//                            	  $(this).click();
//                              }
//                           });
                      //$(".popuwnd-title-del-btn").click();
                      if(window.popuwndLocoInfo&&window.popuwndLocoInfo.$wnd){
                    	  $(".popuwnd-title-del-btn",window.popuwndLocoInfo.$wnd).click();
                      }
                      $(".pointTab").remove();
                      setTimeout(function(){
                    	  RTU.invoke("map.marker.findMarkersContainsNotExist", {
                    		  pointId: $('#index_checiName').val(),
                    		  isSetCenter: true,
                    		  level: 10,
                    		  locoTypeid: data.locoTypeid,
                    		  locoNo: data.locoNo,
                    		  locoAb: data.locoAb,
                    		  lkjType:data.lkjType
                    		  
                    	  });
                      },200);
                  }
                });

            } catch (e) {
            }
        };
        return function () {
            //JS阻止事件冒泡,要不然文本框没法选中条件20141011
            $(".index-search-input").mousedown(function (event) {
                event.stopPropagation();
            });

            setTimeout(function () {
                autocompleteInit();
            }, 10);
            $(function () {

                setTimeout(function () {
                    if ($(".index-searche").drag)
                        $(".index-searche").drag();
                }, 10);
            });
        };
    });
    RTU.invoke("app.index.search.smartTips.init");


    RTU.register("app.index.changetrainStr", function () {
        return function (obj) {
            var str = "";
            if(obj.lkjType!=1){
            	if (obj.trainType == "1") {
                    str = "huoche";
                } else if (obj.trainType == "2") {
                    str = "keche";
                } else if (obj.trainType == "3") {
                    str = "highRail";
                } else if (obj.trainType == "4") {
                    str = "dongche";
                } else if (obj.trainType == "5") {
                    str = "keche";
                }
            }
            else{
            	if(obj.locoUseId!=0){
            		if(obj.trainType==1){
            			if(obj.checiName.substring(0,1)=="G"||obj.checiName.substring(0,1)=="g"){
            				str="highRail";
            			}
            			else str="dongche";
            		}
            		else str="keche";
            	}
            	else{
            		str="huoche";
            	}
            }
           /*if(obj.lkjType==1)str +="15";*/
           if (obj.isAlarm == "1") {
               str += "Alert";
           }
            //               1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
            if (obj.isOnline == "1"||obj.isOnline == "2") {
                str += "Online";
            }else if (obj.isOnline == "3"||obj.isOnline == "4") {
                str += "Offline";
            }else {
                str += "Online";
            }
//            if (obj.isOnline == "1") {
//            	str += "AlertOnline";
//            } else if (obj.isOnline == "2") {
//            	str += "Online";
//            } else if (obj.isOnline == "3") {
//            	str += "AlertOffline";
//            } else if (obj.isOnline == "4") {
//            	str += "Offline";
//            } else {
//            	str += "Online";
//            }
            return str;
        };
    });
    
    //格式化机车str
    RTU.register("app.index.home.formatData", function () {
        return function (data) {
        	var lkj2000Objs=new Array();
            var lkj15Objs=new Array();
            var flag0=0;
            var flag1=0;
             $.each(data, function (i, n) {
             //	n.locoTypeStr = n.locoTypeName + "-" + n.locoNO;
             	/*n.tips = n.locoTypeName + "-" + n.locoNO+"-"+n.checiName;*/
               n.pointTypeUrl = RTU.invoke("app.index.changetrainStr", n);
               
               //if(flag0+flag1<=200){
               var coord = Map.toClientPoint(n.longitude, n.latitude)
               if(data.length==1||(coord.X>=0&&coord.X<=mapWidth&&coord.Y>=0&&coord.Y<=mapHeight)){
            	   if(n.lkjType!=1){
                	   lkj2000Objs.push(n);
                	   flag0++;
                   }
                   else{
                	   lkj15Objs.push(n);
                	   flag1++;
                   }
               }
               //}
	           
               
             });
            var d = {
                p: false,
                data: data,
                lkj2000Objs:lkj2000Objs,
                lkj15Objs:lkj15Objs,
                flag0:flag0,
                flag1:flag1
            };
            return d;
        };
    });
    ///地图上列车标注
    var $status;
    
    var $status1;
    window.isCompleteUpdate = false;
    RTU.register("app.index.AddOrUpdateMarker", function () {
    	return function(data){
//        	var lkj2000Objs=new Array();
//            var lkj15Objs=new Array();
//            var flag0=0;
//            var flag1=0;
//            $.each(data.data,function(i,n){      	
//            	if(n.lkjType!=1){
//            		lkj2000Objs.push(n);
//            		flag0++;
//            	}
//            	else{
//            		lkj15Objs.push(n);
//            		flag1++;
//            	}
//            });
           if(!$status&&data.flag0>0)
           	{
        	   //RTU.invoke("app.realtimelocomotivequery.query.yxxx");
                	/* RTU.invoke("core.router.load", {
                         url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.html",
                         async: false,
                         success: function (status) {
                             $status =$('<iframe id="iframe0" name="iframe0" width="100%" height="100%" src="../app/modules/realtimelocomap/realtimeloco-info.html" frameborder="0" data-id="inner.html" 	seamless></iframe>');// $(status);
                         }
                     });*/
           	}
           
//           if(!$status1&&data.flag1>0)
//       	{
//           	 RTU.invoke("core.router.load", {
//                    url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
//                    async: false,
//                    success: function (status1) {
//                        $status1 = $(status1);
//                    }
//                });
//       	}
            if (data.p != true) {
                data.p = false;
            }
            window.isCompleteUpdate = false;
            if(data.flag0>0){
            	//地图添加lkj2000机车
            	RTU.invoke("map.marker.addAndUpDateMarkers", {
                    pointId: "locoTypeStr",
                    pointDatas: data.lkj2000Objs,
                    TIPSID: "tips",
                    pointType: "pointTypeUrl",
                    tabHtml:'<iframe id="popuwndLocoInfo" name="popuwndLocoInfo" width="100%" height="100%" src="../app/modules/realtimelocomap/realtimeloco-info.html" frameborder="0" data-id="inner.html" 	seamless></iframe>',// $status.html(),
                    isSetCenter: false,
                    setDataSeft: false,
                    tabWidth: 700, //tab 宽度
                    tabHeight: 460, //tab 的高度
                    initFn: function (obj) {
                    	window.selectData={data:obj.itemData};
                    	//关闭之前的
                    	if(window.popuwndLocoInfo&&window.popuwndLocoInfo.$wnd){
                      	  $(".popuwnd-title-del-btn",window.popuwndLocoInfo.$wnd).click();
                        }
                        RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
//                        $("#" + obj.tabId + " .bundefined").unbind("click").click(function () {
//                            RTU.invoke("app.realtimelocomotivequery.query.initInfoWnd", obj);
//                        });
                        RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 270, left: 190 });
                    },
                    rightHand: function (obj) {
                        RTU.invoke("app.realtimelocomotivequery.rightHtml.init", obj);
//                        var lt = RTU.invoke("map.markTopLeft", {lng: obj.lng, lat: obj.lat});
//                        if(($(window).height()-lt.Y)<160){
//                        	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat, top: 230 ,left:$(window).width()/2-($(window).width()-lt.X)});	
//                        }  
//                        if(($(window).width()-lt.X)<110){
//                         	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat,left: $(window).width()/2 -120,top:$(window).height()/2-($(window).height()-lt.Y) });	
//                         }  
                    }
                });
            }
            
    if(data.flag1>0){	
/*    RTU.invoke("core.router.load", {
         url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
         async: false,
         success: function (status1) {
             $status1 = $(status1);
         }
     });*/
     //地图添加新一代机车
    RTU.invoke("map.marker.addAndUpDateMarkers", {
        pointId: "locoTypeStr",
        pointDatas: data.lkj15Objs,
        TIPSID: "tips",
        //tabHtml: $status1.html(),
        tabHtml:'<iframe id="popuwndLocoInfo" name="popuwndLocoInfo" width="100%" height="100%" src="../app/modules/realtimelocomap/realtimeloco-lkj15.html" frameborder="0" data-id="inner.html" 	seamless></iframe>',// $status.html(),
        pointType: "pointTypeUrl",
        isSetCenter: false,
        setDataSeft: false,
        //tabWidth: 380, //tab 宽度
        //tabHeight: 500, //tab 的高度
        tabWidth: 700, //tab 宽度
        tabHeight: 460, //tab 的高度
        initFn: function (obj) {
        	
           // RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
//            $("#" + obj.tabId + " .bundefined").unbind("click").click(function () {
//                RTU.invoke("app.realtimeloco15motivequery.query.initInfoWnd", obj);
//            });
            RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 270, left: 190 });
        },
        rightHand: function (obj) {
            RTU.invoke("app.realtimelocomotivequery.rightHtml.init", obj);
            var lt = RTU.invoke("map.markTopLeft", {lng: obj.lng, lat: obj.lat});
            if(($(window).height()-lt.Y)<160){
           	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat, top: 230 ,left:$(window).width()/2-($(window).width()-lt.X)});	
           }  
           if(($(window).width()-lt.X)<110){
          	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat,left: $(window).width()/2 -120,top:$(window).height()/2-($(window).height()-lt.Y) });	
          }  
         
        }
    });

    }
            window.isCompleteUpdate = true;
    	};
    });
    
    if(pointLocoId){//外部页面有传值，直接定位机车
    	dingwei();
    }
    
    function dingwei(){
    	if(window.allListRefresh&&window.trItem.allData&&window.trItem.allData.length>0){
    		for(var idx in window.trItem.allData){
    			if(window.trItem.allData[idx].locoTypeStr==pointLocoId){
    				var d = RTU.invoke("app.index.home.formatData", [window.trItem.allData[idx]]);
                    //更新或增加该标记点
                    RTU.invoke("app.index.AddOrUpdateMarker", d);
                    
                    RTU.invoke("map.marker.findMarkers", {
                        pointId: pointLocoId,
                        isSetCenter: true,
                        stopTime: 5000,
                        isShowHighLevel:1,
                        fnCallBack: function () {
                        }
                    });
                    
                    pointLocoId=null;
                    break;
    			}
    		}
    	}else{
    		setTimeout(function(){
    			dingwei();
    		},500);
    	}
    }

    //得到所有机车，格式化
    RTU.register("app.index.home.dataInit", function () {
        return function (data) {
            if (data.length == 0) return;
            var d = RTU.invoke("app.index.home.formatData", data);
            RTU.invoke("app.index.AddOrUpdateMarker", d);
        };
    });
    //关闭附近列车和本线路列车定时请求
    psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
    psModel.cancelScribe("refreshData", window.aroundLocoTimer);
    var loadcount = 0;
    
/*    //顶端计数
    var setLocoCount=function(data){
	 
    	 var onlineCount=0;
    	 var outlineCount=0;
    	 if(data&&data.length>0){
    	     	for(var i=0;i<data.length;i++){
    	        	if(data[i].state=="1"){
    					onlineCount++;
    				}else{
    					outlineCount++;
    				}
    	    	}
    	 } 
    	 $("#realtime_rt_all_count_header").html(outlineCount+onlineCount);
    	 $("#realtime_rt_online_count_header").html(onlineCount);
    	 $("#realtime_rt_offline_count_header").html(outlineCount);
    	 var date=new Date();
         var month=date.getMonth()+1;
         if(month<10)month="0"+month;
         var day=date.getDate()<9?("0"+date.getDate()):date.getDate();
         var hours=date.getHours();
         var minutes=date.getMinutes()<9?("0"+date.getMinutes()):date.getMinutes();  
         var seconds=date.getSeconds()<9?("0"+date.getSeconds()):date.getSeconds(); 
         var str=month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    	 $("#realtime_rt_refreshTime_header").text(str);
    };*/
    
    
    //定时更新机车标注点
    function updatePointTimer(){
    	//定时请求查询所有机车
    	if(window.allListRefresh){//如果列表中的相关事件已经执行完成
    		window.homeTimer = psModel.subscribe("refreshData", function (t, data) {
    			if (data.length == 0) {
    	            var homeInterval = setInterval(function () {
    	                if (loadcount == 200) {
    	                    clearInterval(homeInterval);
    	                }
    	                loadcount++;
    	                if (window.trItem.allData.length != 0 && window.Map) {
    	                	var dd=new Array();
    	                	if(window.userData&&window.userData.ShowOffLineLoco=="0"){
    	                		for(var m=0;m<window.trItem.allData.length;m++){
    	                			if(window.trItem.allData[m].state=="1"){
    	                				dd.push(window.trItem.allData[m]);
    	                			}
    	                		}
    	                	}
    	                	else 
    	                		dd=window.trItem.allData;
    	                    /*var d = {
    	                        p: false,
    	                        data: window.trItem.allData
    	                    };*/
    	                	var d = {
    	                            p: false,
    	                            data: dd
    	                        };
    	                    RTU.invoke("app.index.AddOrUpdateMarker", d);
    	                    clearInterval(homeInterval);
    	                }
    	            }, 10);
    	        } else {
    	        	var dd=new Array();
    	        	if(window.userData&&window.userData.ShowOffLineLoco=="0"){
    	        		for(var m=0;m<data.length;m++){
    	        			if(window.trItem.allData[m].state=="1"){
    	        				dd.push(data[m]);
    	        			}
    	        		}
    	        	}
    	        	else 
    	        		dd=data;
    	            RTU.invoke("app.index.home.dataInit", dd);
    	        }
    			/*setLocoCount(data);*/
//    	    		 psModel.cancelScribe("refreshData", window.homeTimer);

    	    });
    	    psModel.searchNow({ token: window.homeTimer });
    	}else{
    		setTimeout(function(){
    			updatePointTimer();
    		}, 500);
    	}
    }
    
    function addMapEvent(){
    	if(window.RMapEvent){
        	Map.addEventListener(RMapEvent.Moved,function(){
        		//自动添加该条标记点
                var d = RTU.invoke("app.index.home.formatData", window.trItem.allData);
                //更新或增加该标记点
                RTU.invoke("app.index.AddOrUpdateMarker", d);
        	});
    	}else{
    		setTimeout(function(){
    			addMapEvent();
    	    },500);
    	}
    }
    
    updatePointTimer();
    addMapEvent();
//    setTimeout(function(){
//    	RTU.invoke("app.realtimelocomotivequery.setLabPoint");
//    },1000);

    var paramData = null;
    var exparm = null;
    var ctr = null;
    var currentTr = null;
    var ctr1 = null;
    var currentTr1 = null;
    //首页-右键菜单
    RTU.register("app.realtimelocomotivequery.rightHtml.init", function () {
        function refreshRealtimeList(data) {
            if (window.attention) {
                if (window.realtimeG) {
                    var t = window.realtimeG.currClickItem();
                    ctr = window.realtimeG.selectItem();
                    if (t.item) {
                        currentTr = window.realtimeG.currClickItem();
                        currentTr.count = 1;
                    }
                    window.realtimeG.refresh(data);
                }else{ 
                	 window.realtimeG = new RTGrid({
                         datas: data,
                         containDivId: "rt_tab_div_grid",
                           tableWidth: 365,
                          tableHeight: 300,
                         hasCheckBox: true,
                         isSort: true,
                         showTrNum: false,
                         isShowPagerControl: false,
                         beforeLoad:function(that){
                             that.pageSize =3000;
                         },
                         beforeSortFn: function (sname, isUp) {
                             if (sname == "isOnline") {
                                 sname = "spanMinutes";
                             }
                             if (sname == "locoTypeStr") {
                                 sname = "train";
                             }

                             if (sname == "depotName") {
                                 sname = "DShortname";
                             }

                             if (sname == "lineName") {
                                 sname = "LName";
                             }
                             if (sname == "sName") {
                                 sname = "SName";
                             }
                             if (sname == "limitSpeed") {
                                 sname = "limitedSpeed";
                             }
                             if (sname == "receiveTimeStr") {
                                 sname = "lkjTime";
                             }
                             exparm = { "sortField": sname, sortOrder: isUp };
                             window.realtimeG.param.extraUrlParam = exparm;
                             if (window.realtimeG) {
                                 var t = window.realtimeG.currClickItem();
                                 ctr = window.realtimeG.selectItem();
                                 if (t.item) {
                                     currentTr = window.realtimeG.currClickItem();
                                     currentTr.count = 1;
                                 }
                             }
                         },
                         selectTrEvent: function (t, currClickItem) {
                             if($(currClickItem).attr("checked")=="checked"){
                                 var thisData = currClickItem.data("itemData");
                                 /*var id = thisData.locoTypeName + "-" + thisData.locoNO;*/
                                 var id = thisData.locoTypeStr;
                                 RTU.invoke("map.marker.findMarkersContainsNotExist", {
                                     pointId: id,
                                     isSetCenter: true,
                                     stopTime: 5000,
                                     lkjType:thisData.lkjType,
                                     fnCallBack: function () {
                                     }
                                 });
                              }else{
                                 RTU.invoke("map.marker.clearSelectPointCss");
                              }

                             
                         },
                         clickTrEvent: function (t) {
                             var thisData = window.realtimeG.currClickItem();
                             try {
                                 var _thisTr = $(thisData.item);
                                 var _checkbox = $("input[type='checkbox']", $(thisData.item));
                                 /*var id = thisData.data.locoTypeName + "-" + thisData.data.locoNO;*/
                                 var id = thisData.data.locoTypeStr;
                                 var allCheckbox = $("input[type='checkbox']", $(thisData.item).parent());
                                 allCheckbox.each(function () {
                                     if (id == $(".locoTypeStr", _thisTr).html()) {
                                         _checkbox.attr("checked", "checked");
                                         _checkbox.addClass("checked");
                                         return false;
                                     }
                                 });

                                 RTU.invoke("map.marker.findMarkersContainsNotExist", {
                                     pointId: id,
                                     isSetCenter: true,
                                     stopTime: 5000,
                                     lkjType:thisData.lkjType,
                                     fnCallBack: function () {
                                     }
                                 });
                             } catch (e) {
                             }
                         },
                         loadPageCp: function (t) {
                             t.cDiv.css("left", "200px");
                             t.cDiv.css("top", "200px");
                             $("#rt_tab_div_grid .RTGrid_Bodydiv").css("height", "230px");
                             if (ctr) {
                                 var trs = $(".RTTable-Body tbody  tr", window.realtimeG.cDiv);
                                 trs.each(function (i, item) {
                                     var cbd = $("input[type='checkbox']", $(item)).data("itemData");
                                     var ctrTr = ctr.parent().parent().children(" td[itemname='locoTypeStr']");

                                     ctrTr.each(function (count, ctrTrItem) {
                                         var locoStr = $(ctrTrItem).text();
                                         var loco = locoStr.split("-");
                                         var locoTypeName = loco[0];
                                         var locoNO = loco[1];
                                         if (cbd.locoTypeName == locoTypeName && cbd.locoNO == locoNO) {
                                             if (currentTr) {
                                                 if (cbd.locoTypeName == currentTr.data.locoTypeName && cbd.locoNO == currentTr.data.locoNO) {
                                                     $(item).addClass("RTGrid_clickTr");
                                                 }
                                             }
                                             $("input[type='checkbox']", $(item)).attr("checked", "checked");
                                             return false;
                                         }
                                     });
                                 });
                                 ctr = null;
                             }
                         },
                         //                     1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
                         replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                         	 if (data == "1"||data == "2") {
                                  return "<img src='../static/img/app/online_pic_14_14.png'>";
                              } else if (data == "3"||data == "4") {
                                  return "<img src='../static/img/app/outline_pic_14_14.png'>";
                              }
                         }
                         }, { index: 2, fn: function (data, j, ctd, itemData) {
                             /*return itemData.locoTypeName + "-" + itemData.locoNO;*/
                        	 return itemData.locoTypeStr;
                         }
                         }, { index: 4, fn: function (data, j, ctd, itemData) {
                             if(itemData.receiveTimeStr){
                                return itemData.receiveTimeStr.substring(5,itemData.receiveTimeStr.length);
                             }
                          }
                          }],
                         colNames: ["状态", "车次", "机车","实速",  "时间"],
                         colModel: [{ name: "isOnline", width: "40px", isSort: true }, { name: "checiName", width: "40px", isSort: true }, { name: "locoTypeStr", width: "70px", isSort: true }, { name: "speed", width: "45px", isSort: true }, { name: "receiveTimeStr", width: "70px", isSort: true}]
                     });
              }
            } else {
                if (window.RealtimeAttentionList) {
                    var t = window.RealtimeAttentionList.currClickItem();
                    ctr1 = window.RealtimeAttentionList.selectItem();
                    if (t.item) {
                        currentTr1 = window.RealtimeAttentionList.currClickItem();
                        currentTr1.count = 1;
                    }
                    window.RealtimeAttentionList.refresh(data);
                }else{
                	if (data.length == 0) {
                        window.RealtimeAttentionList.datas.length = 0;
                        window.RealtimeAttentionList.init();
                    } else {
                        window.RealtimeAttentionList = new RTGrid({
                            containDivId: "attention_div_grid",
                             tableWidth: 363,
                            tableHeight: 410,
                            isSort: false, //是否排序
                            hasCheckBox: true,
                            showTrNum: false,
                            isShowPagerControl: false,
                            beforeSortFn: function (sname, isUp) {
                                window.RealtimeAttentionList.param.extraUrlParam = { "sortField": sname, sortOrder: isUp };
                            },
                            beforeLoad:function(that){
                               that.pageSize =3000;
                            },
                            loadPageCp: function (t) {
                                t.cDiv.css("left", "200px");
                                t.cDiv.css("top", "200px");
                                $("#attention_div_grid .RTGrid_Bodydiv").css("height", "410px");

                                if (ctr1) {
                                    var trs = $(".RTTable-Body tbody  tr", window.RealtimeAttentionList.cDiv);
                                    trs.each(function (i, item) {
                                        var cbd = $("input[type='checkbox']", $(item)).data("itemData");
                                        var ctrTr = ctr1.parent().parent().children(" td[itemname='locoTypeStr']");

                                        ctrTr.each(function (count, ctrTrItem) {
                                            var locoStr = $(ctrTrItem).text();
                                            var loco = locoStr.split("-");
                                            var locoTypeName = loco[0];
                                            var locoNO = loco[1];
                                            if (cbd.locoTypeName == locoTypeName && cbd.locoNO == locoNO) {
                                                if (currentTr) {
                                                    if (cbd.locoTypeName == currentTr.data.locoTypeName && cbd.locoNO == currentTr1.data.locoNO) {
                                                        $(item).addClass("RTGrid_clickTr");
                                                    }
                                                }
                                                $("input[type='checkbox']", $(item)).attr("checked", "checked");
                                                return false;
                                            }
                                        });
                                    });
                                    ctr1 = null;
                                }
                            },
                            selectTrEvent: function (t, currClickItem) {
                                if($(currClickItem).attr("checked")=="checked"){
                                     var thisData = currClickItem.data("itemData");
                                    var id = thisData.locoTypeStr;
                                    RTU.invoke("map.marker.findMarkersContainsNotExist", {
                                        pointId: id,
                                        isSetCenter: true,
                                        stopTime: 5000,
                                        lkjType:thisData.lkjType,
                                        fnCallBack: function () {
                                        }
                                    });
                                 }else{
                                    RTU.invoke("map.marker.clearSelectPointCss");
                                 }
                            },
                            clickTrEvent: function (t) {
                                var thisData = window.RealtimeAttentionList.currClickItem();
                                try {
                                    /*var id = thisData.data.locoTypeName + "-" + thisData.data.locoNO;*/
                                	var id=thisData.data.locoTypeStr;
                                    RTU.invoke("map.marker.findMarkersContainsNotExist", {
                                        pointId: id,
                                        isSetCenter: true,
                                        stopTime: 5000,
                                        lkjType:thisData.lkjType,
                                        fnCallBack: function () {
                                        }
                                    });
                                } catch (e) {
                                }
                            },
                            replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                            	 if (data == "1"||data == "2") {
                                     return "<img src='../static/img/app/online_pic_14_14.png'>";
                                 } else if (data == "3"||data == "4") {
                                     return "<img src='../static/img/app/outline_pic_14_14.png'>";
                                 }
                            }
                            }, { index: 2, fn: function (data, j, ctd, itemData) {
                                /*return itemData.locoTypeName + "-" + itemData.locoNO;*/
                            	return itemData.locoTypeStr;
                            }
                            }, { index: 4, fn: function (data, j, ctd, itemData) {
                            if(itemData.receiveTimeStr){
                               return itemData.receiveTimeStr.substring(5,itemData.receiveTimeStr.length);
                            }
                         }
                         }],
                            colNames: ["状态", "车次", "机车", "实速",  "时间"],
                            colModel: [{ name: "isOnline", width: "40px", isSort: true }, { name: "checiName", width: "40px", isSort: true }, { name: "locoTypeStr", width: "70px", isSort: true }, { name: "speed", width: "45px", isSort: true },{ name: "receiveTimeStr", width: "70px", isSort: true}],
                            datas: data
                        });
                    }
                }
            }
        }
        return function (obj) {
            $(".rightHandDiv", $(obj.target).parent()).remove();
           var clientWidth = ($(obj.Point.Icon)[0].clientWidth||32);
           var clientHeight= ($(obj.Point.Icon)[0].clientHeight||30);
           
           $(obj.target).after("<div class='rightHandDiv' style='position: absolute;background-color:#fff;width:105px;height:auto;top:"+clientHeight+"px;left:"+clientWidth+"px;'></div>").show();
           var rightDiv=$(".rightHandDiv", $(obj.target).parent());
         
           if(clientWidth>30){
        	   $(rightDiv).css("left",(clientWidth)-15+"px");
           }
           
           if(clientHeight>30){
       			$(rightDiv).css("top",(clientHeight)-15+"px");
           }
           var lkj15Str="";
           if(obj.pointData.lkjType==1){
        	   lkj15Str="<li><a href='#' class='sysquery-a'>主机查询</a></li>"
        		   +"<li><a href='#' class='limitinfo-a'>揭示信息</a></li>";
           }
            $(".rightHandDiv").empty().append("<div><div id='menu'><ul>"+lkj15Str+"<li><a href='#' class='neartrain-a'>显示附近列车</a></li>"
            		+ "<li><a href='#' class='selflinetrain-a'>显示本线路列车</a></li>" +
            		"<li><a href='#' class='runningcurve-a'>列车运行曲线</a></li>" +
            		"<li><a href='#' class='yunxingjilu-a'>运行记录</a></li>" +
            		"<li id='but3'><a href='#' class='upfile-a'>文件上传</a></li> " +
            		"<li id='but4'><a href='#' class='downfile-a'>文件下载</a></li>" +
            		"<li><a href='#' class='Magnifier-a'>放大镜模式</a></li></ul></div></div>");

            var menuHeight=$(rightDiv).height();
            var menuWidth=$(rightDiv).width();
            var clientx = $(obj.Point.Icon)[0].x;
            var clienty= $(obj.Point.Icon)[0].y;
            var  width = document.documentElement.clientWidth ;
            var  height = document.documentElement.clientHeight ;
            if((clientx+menuWidth)>width){
            	if(clientWidth>30){
            		$(rightDiv).css("left",-(menuWidth)+15+"px");
            	}else{
            		$(rightDiv).css("left",-(menuWidth)+"px");
            	}
            }
            if((clienty+menuHeight)>height){
            	if(clientHeight>30){
            		$(rightDiv).css("top",-(menuHeight)+15+"px");
            	}else{
            		$(rightDiv).css("top",-(menuHeight)+"px");
            	}
            }
            
            //文件上传
            var data_filetransfer = RTU.invoke("app.setting.data", "filetransfer");

            //文件下载
            var data_filedownload = RTU.invoke("app.setting.data", "filedownload");

            if (data_filetransfer == null || data_filetransfer == undefined) {
                $("#but3").css("display", "none");
            }

            if (data_filedownload == null || data_filedownload == undefined) {
                $("#but4").css("display", "none");
            }

            ///模拟放大镜
            $(".Magnifier-a", $(obj.target).parent()).unbind("click").click(function () {
                ///先移出前一次的after
                $(".Magnifier-div", $(obj.target).parent()).remove();
                ///after放大镜窗口
                var locoTypeNameAndLocoNoAndLocoAb=obj.pointData.locoTypeStr;
                /*if (obj.pointData.locoAb == "1") {
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
	            } else if (obj.pointData.locoAb == "2"){
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb+ window.locoAb_B;
	            }*/
                
                $(obj.target).after("<div class='Magnifier-parentDiv' id='Magnifier_parent" + obj.target.alt + "'><div class='Magnifier-div' id='Magnifier_" + obj.target.alt + "'></div>" +
				 		"<img src='../static/img/map/graph_delete.png' class='close-img' style='position:absolute;right:0px;top:0px;z-index:9999;'/>" +
				 		"<img src='../static/img/map/dropwnd_dir.png' style='position:absolute;bottom:-25px;left:243px;z-index:-1;'/>" +
				 		"<div class='Magnifier-top-tab'>放大镜---" + locoTypeNameAndLocoNoAndLocoAb + "</div></div>");
                ///初始化放大镜地图
                RTU.invoke("MagnifierMap.init", obj);
                ///放大镜窗口关闭按钮
                $(".close-img", $("#Magnifier_parent" + obj.target.alt)).click(function () {
                    $(".Magnifier-parentDiv", $(obj.target).parent()).remove();
                });
                ///隐藏右键菜单
                $(".rightHandDiv").hide();
            });
            
            if(obj.pointData.lkjType==1){
                ///主机查询
                $(".sysquery-a", $(obj.target).parent()).unbind('click').click(function () {
           		 	RTU.invoke("app.lkj15sysinfo.query.init",obj.pointData);
                });
                
              ///主机查询
                $(".limitinfo-a", $(obj.target).parent()).unbind('click').click(function () {
                	RTU.invoke("app.lkj15limitinfo.query.init",obj.pointData);
                });
            }
            ///文件上传
            $(".upfile-a", $(obj.target).parent()).unbind('click').click(function () {
        		var arry = [];
                var locotypeid = obj.pointData.locoTypeid;
                var locotypename = obj.pointData.locoTypeName;
                var locono = obj.pointData.locoNO;
                var locoAb = obj.pointData.locoAb;
                var checiName = obj.pointData.checiName;
                var sName = obj.pointData.depotName;
                arry.push(locotypeid + "," + locotypename + "," + locono +"," + checiName + "," + sName+ ","+ locoAb);
                if(obj.pointData.lkjType!=1)
                	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", arry);
                else
                	RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", arry);
            });
            ///文件下载
            $(".downfile-a", $(obj.target).parent()).unbind('click').click(function () {
    			var d = (obj.pointData.locoTypeStr).split("-");
            	if(obj.pointData.lkjType!=1)
            		RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", 
            				{ locotypeid: obj.pointData.locoTypeid, 
            			locono: obj.pointData.locoNO,
            			locoTypeName: d[0],speed:obj.pointData.speed,
            			locoAb:obj.pointData.locoAb});
            	else 
            		RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", 
            				{ locotypeid: obj.pointData.locoTypeid, 
            			locono: obj.pointData.locoNO,
            			locoTypeName: d[0],speed:obj.pointData.speed,
            			locoAb:obj.pointData.locoAb});
            });
            ///运行曲线
            $(".runningcurve-a", $(obj.target).parent()).unbind('click').click(function () {
            	var locoTypeNameAndLocoNoAndLocoAb=obj.pointData.locoTypeStr;
                /*if (obj.pointData.locoAb == "1") {
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
	            } else if (obj.pointData.locoAb == "2"){
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb+ window.locoAb_B;
	            }*/
/*                if(obj.pointData.lkjType!=1)
                	RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", 
                		[{ "id": "11111", "name": obj.pointData.checiName + "(" 
                			+ locoTypeNameAndLocoNoAndLocoAb + ")", data: obj.pointData}]);
                else 
                	RTU.invoke("app.realtimelocomotivequery.query.initmutimove",
                			[{ "id": "11111", "name": obj.pointData.checiName + "(" 
                    			+ locoTypeNameAndLocoNoAndLocoAb + ")", data: obj.pointData}]);*/
            	RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", 
                		[{ "id": "11111", "name": obj.pointData.checiName + "(" 
                			+ locoTypeNameAndLocoNoAndLocoAb + ")", data: obj.pointData}]);
                /*RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", [{ "id": "11111", "name": obj.pointData.checiName + "(" +locoTypeNameAndLocoNoAndLocoAb + ")", data: obj.pointData}]);*/
                $(".rightHandDiv").hide();
            });
            //运行记录
            $(".yunxingjilu-a", $(obj.target).parent()).unbind('click').click(function () {
            	 var sendData={
                         locoTypeid:obj.pointData.locoTypeid,
                         locoNo:obj.pointData.locoNo,
                         locoAb:obj.pointData.locoAb,
                         locoTypename:obj.pointData.locoTypeName,
                         kehuo:obj.pointData.kehuo,
                         date:obj.pointData.lkjTimeStr
                     };
             	if(obj.pointData.lkjType!=1)
            		RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
            	else 
            		RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
            	
            	$(".rightHandDiv").hide();
            });
            ///显示附近列车
            $(".neartrain-a", $(obj.target).parent()).unbind('click').click(function () {
                $(".rightHandDiv").hide();
                window.psModel.runControl("refreshData", window.homeTimer, false);
                window.psModel.cancelScribe("refreshData", window.allListRefresh);
                window.psModel.cancelScribe("refreshData", window.refreshNum);
                window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                window.psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
                function conditions() {
                    return [{ name: "locoTypeid", value: obj.pointData.locoTypeid },
            		        { name: "locoNO", value: obj.pointData.locoNO },
            		        { name: "locoAb", value: obj.pointData.locoAb}];
                }
                window.aroundLocoTimer = psModel.subscribe("refreshData", function (t, data) {
                    if (($(".rt_tab_div_grid") && $(".rt_tab_div_grid").length > 0) || ($(".attention_div_grid") && $(".attention_div_grid").length > 0)) {
                        if (window.realtimeG || window.RealtimeAttentionList) {
                            if ($(" .raltime_rt_div") && !$(" .raltime_rt_div").hasClass("hidden")) {
                                window.isAroundLocoList = true;
                                window.isThisLineLocoList = false;
                            }
                            refreshRealtimeList(data);
                        }
                    }
                    RTU.invoke("map.marker.hideCarMarker");
                    for (var j = 0; j < data.length; j++) {
                        var d = data[j];
                        /*RTU.invoke("map.marker.showSomeCarMarker",
                        		d.locoTypeName + "-" + d.locoNO+RTU.invoke("app.locoAb.getChar",d.locoAb));*/
                        RTU.invoke("map.marker.showSomeCarMarker",
                        		d.locoTypeStr);
                    }
                }, conditions);
                psModel.searchNow();
            });
            ///显示本线路列车
            $(".selflinetrain-a", $(obj.target).parent()).unbind('click').click(function () {
                $(".rightHandDiv").hide();
                window.psModel.runControl("refreshData", window.homeTimer, false);
                window.psModel.cancelScribe("refreshData", window.allListRefresh);
                window.psModel.cancelScribe("refreshData", window.refreshNum);
                window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                window.psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
                function conditions() {
                    return [{ name: "lineNo", value: obj.pointData.lineNo}];
                }
                window.thisLineLocoTimer = psModel.subscribe("refreshData", function (t, data) {
                    if (($(".rt_tab_div_grid") && $(".rt_tab_div_grid").length > 0) || ($(".attention_div_grid") && $(".attention_div_grid").length > 0)) {
                        if (window.realtimeG || window.RealtimeAttentionList) {
                            if ($(" .raltime_rt_div") && !$(" .raltime_rt_div").hasClass("hidden")) {
                                window.isAroundLocoList = false;
                                window.isThisLineLocoList = true;
                            }
                            refreshRealtimeList(data);
                        }
                    }
                    RTU.invoke("map.marker.hideCarMarker");
                    for (var j = 0; j < data.length; j++) {
                        var d = data[j];
                        /*RTU.invoke("map.marker.showSomeCarMarker", 
                        		d.locoTypeName + "-" + d.locoNO+RTU.invoke("app.locoAb.getChar",d.locoAb));*/
                        RTU.invoke("map.marker.showSomeCarMarker",
                        		d.locoTypeStr);
                    }
                }, conditions);
                psModel.searchNow();

            });
            $("body").mousedown(function (e) { //隐藏
                $(".rightHandDiv").hide();
                $(".pointMouseoverDiv").remove();
            });

        };
    });
    ///初始化放大镜地图
    RTU.register("MagnifierMap.init", function () {
        return function (obj) {
            {//初始化地图
                RMap6.TileRule.TILE_ROOT = "/tile/typical/";
                window.carRmap2 = new RMap6.RMap(document.getElementById("Magnifier_" + obj.target.alt), $('#Magnifier_' + obj.target.alt).width(), $('#Magnifier_' + obj.target.alt).height(), obj.lng, obj.lat, 15);
                var winRmap2 = window.carRmap2;
                winRmap2.show();
                winRmap2.getControls().addCompass('../static/img/map/compass3.png');
                var markerManager = winRmap2.getMarkerManager();
            }
//            {//信号机器
//                var telesemes = Map["teleseme"];
//                for (var i = 0; i < telesemes.length; i++) {
//                    markerManager.addIconMarker(telesemes[i].Cx, telesemes[i].Cy, pointTypeUrl.teleseme);
//                }
//            }
            {//添加车
                var cars = pSKeeping;
                for (var i in cars) {
                    car = cars[i];
                    if (car == null) {
                        continue;
                    }
                    if (obj.lng.toString() == car.Cx.toString()) {
                        continue;
                    }
                    
                    
                    var isOnline =car.obj.pointData.isOnline;
                    var imgUrl="../static/img/map/lessen_g.png";
                    if(car.obj.pointData.trainType==""){
                		var info=window.publicData["IconlessLocoOffline"].split("-");
        				var info1=window.publicData["IconlessLocoOnline"].split("-");
                		
                		 if(isOnline && (isOnline == "3"||isOnline == "4")){
        				if(info[0]){
        					imgUrl=info[0];
        				}else{
        					imgUrl = "../static/img/map/lessen_g.png";
        				}
                			
                		}else if(isOnline && (isOnline == "1"||isOnline == "2")){
        				if(info1[0]){
        					imgUrl=info1[0];
        				}else{
                				imgUrl = "../static/img/map/lessen_y.png";
        				}
                		}
                    }else{
                    	imgUrl =getImgUrl(car.obj.pointData[car.obj.pointType]?car.obj.pointData[car.obj.pointType]:car.obj.pointType);
                    }
                    
                    markerManager.addIconMarker(car.Cx, car.Cy, imgUrl, obj.Point.obj.iconWidth / 2, obj.Point.obj.iconHeight);
                    var loco = new RMap6.Marker.LabelMarker(car.Cx, car.Cy, car.obj.pointData.locoTypeStr, "#CCCCCC", 2);
                    var a = markerManager.addMarker(loco);
                }
            }
            
            var isOnline =obj.pointData.isOnline;
            var imgUrl="../static/img/map/lessen_g.png";
            if(obj.pointData.trainType==""){
        		var info=window.publicData["IconlessLocoOffline"].split("-");
				var info1=window.publicData["IconlessLocoOnline"].split("-");
        		
        		 if(isOnline && (isOnline == "3"||isOnline == "4")){
				if(info[0]){
					imgUrl=info[0];
				}else{
					imgUrl = "../static/img/map/lessen_g.png";
				}
        			
        		}else if(isOnline && (isOnline == "1"||isOnline == "2")){
				if(info1[0]){
					imgUrl=info1[0];
				}else{
        				imgUrl = "../static/img/map/lessen_y.png";
				}
        		}
            }else{
            	imgUrl =getImgUrl(obj.pointData[obj.pointData.pointTypeUrl]?obj.pointData[obj.pointData.pointTypeUrl]:obj.pointData.pointTypeUrl);
            }
            
            markerManager.addIconMarker(obj.lng, obj.lat,imgUrl, obj.Point.obj.iconWidth / 2, obj.Point.obj.iconHeight);
            var lbm = new RMap6.Marker.LabelMarker(obj.lng, obj.lat, obj.pointData.locoTypeStr, "#CCCCCC", 2);
            markerManager.addMarker(lbm);
            winRmap2.getMarkerManager().showAll();
            winRmap2.addStaticLayer("../railWay/railWay?r=" + new Date().getTime() + "&str=&path=");

            obj.Point.obj.loadData = function (obj) {
            };
        };
    });

    RTU.register("app.index.search.inputTip.init", function () {
        var searchTip = function () {
            $("#index_checiName").val() == "请输入机车" ? $("#index_checiName").css("color", "#999999") : $("#index_checiName").css("color", "#000");
            $("#index_checiName").focus(function () {
                $(this).val() == "请输入机车" ? $(this).val("") : $("#index_checiName").css("color", "#000");
            }).blur(function () {
                $(this).val() == "" ? $(this).val("请输入机车").css("color", "#999999") : $("#index_checiName").css("color", "#000");
            });
        };
        return function () {
            searchTip();
        };
    });
    RTU.invoke("app.index.search.inputTip.init");
    
    /**
     * 传入机车的AB节值,返回对应的字母
     */
    RTU.register("app.locoAb.getChar", function () {
        return function(locoAb){
        		var res="";
        		if(locoAb != '1'&&locoAb!='2'){
        			res="";
        		}else if(locoAb == '1'){
        			res=locoAb_A;
        		}else{
        			res=locoAb_B;
        		}
        	return res;
        };
    });
    
    RTU.register("app.realtimelocomotivequery.setLabPoint", function () {
    	return function setLabPoint(){
	    	/*var data = RTU.invoke("app.setting.data", "labelpointsenclosure");
	        if (!data ||!data.isActive) {
	            return false;
	        }*/
    		//加载标注点数据
    		var d= getLabPointData();
    		RTU.invoke("app.labelpointsenclosure.removeMarkerLab");
    		var userLabPointRole =RTU.invoke("app.labelpointsenclosure.getUserLabPointRole");
    		var select=false;
    		for(var y=0;y<userLabPointRole.labRole.length;y++){
				 if("IIA"==userLabPointRole.labRole[y]){
					 select=true;
				 }
			 }
    		if(select){
	    		for(var i=0;i<d.length;i++){
	    			var data={
	    					pointsType:d[i].pointsType,
	    					userLabPointRole:userLabPointRole
	    			};
	    			var labLevel=RTU.invoke("app.labelpointsenclosure.compareLabLevel",data);
	    			
	    			var sendData = {
	    					data:d[i],
	    					type:"show",
	    					pointType:RTU.invoke("app.labelpointsenclosure.getPointImgType",d[i].pointsType),
	    					isShowTitle:true
	    			};
	    			if(labLevel){
	    				sendData.hidded=false;
	    				RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
	    			}else{
	    				sendData.hidded=true;
	    				RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
	    			}
	    		}
    		}
    	};
    });
    
    /**
     * 获取标注点的数据
     */
    function getLabPointData(){
    	   var searchData=null;
			  $.ajax({
		          url: "../labelpointsenclosure/findByLabTypeOrBureau?type=&bureauId=",
		          type: "get",
		          async: false,
		          success: function (data) {
		              var data = $.parseJSON(data);
		              if (data.data) {
		            	  if(data.data){
		            		  searchData =data.data;
		            	  }
		              };
		          }
		      });
			  return searchData;
    }
    RTU.register("header.notice.show", function () {
        return function (msg) {
            $(".header-notice-contianer").attr("class", "header-notice-contianer");
            $(".header-notice-contianer .header-notice-main-text").html(msg);
            setTimeout("$('.header-notice-contianer').attr('class','header-notice-contianer hidden');", 2000);
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
});