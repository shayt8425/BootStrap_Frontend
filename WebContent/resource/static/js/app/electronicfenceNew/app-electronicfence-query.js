RTU.DEFINE(function (require, exports) {
/**
 * 模块名：电子围栏--query
 * name：electronrail
 * date:2015-2-12
 * version:1.0 
 */
	require("app/home/app-map-track.js");
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/electronicfence/app-electronrail.css");
    require("../../../css/app/electronicfence/app-electronrail-detail.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("My97DatePicker/WdatePicker.js");
    require("app/electronicfenceNew/app-electronicfence-detail.js");
    require("popuwnd/js/popuwnd.js");
    require("app/home/app-map.js");
    require("app/home/app-home.js");/*
    require("app/home/app-header.js");  */ 
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-query.js");
    var $html;
    var popuwnd;
    var data;
    var electronrailGrid;
    var timerList;
    var findByShortname=[];
    var curPoints = []; //全部点的数组
    var o = []; //添加标注中点击绘制区域时画的电子围栏数组
    var electronPoint;

    RTU.register("app.electronrail.query.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                    	$html=$(html);
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";                                      
                        }
                    }
                });
            }
        };
    });
    //查询窗口
    RTU.register("app.electronrail.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口  
            RTU.invoke("app.electronrail.query.loadHtml", { url: "../app/modules/electronicfenceNew/app-electrionicfence-query.html", fn: function (html) {
            	if (!popuwnd) {
                    popuwnd = new PopuWnd({
                        title: "围栏管理",
                        html: html,
                        width: 360,
                        height:400,
                        left: 5,
                        top: 60,
                        shadow: true
                    });
                    popuwnd.remove = popuwnd.close;
                    popuwnd.close = popuwnd.hidden;
                    popuwnd.init();
                } else {
                	popuwnd.close();
                	popuwnd.html(html);
                    popuwnd.init();
                }
            	if(electronrailGrid){
            		electronrailGrid = null;
            	}
                return popuwnd;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.electronrail.query.create");
            	RTU.invoke("app.electronrail.query.initTopBtn");
            	RTU.invoke("app.electronrail.query.initBtn");
//            	RTU.invoke("app.electronrail.query.initList");
            	RTU.invoke("app.electronrail.rightHandMap.init");
            	 popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
            			RTU.invoke("map.removeCenterCross");
                    	RTU.invoke("app.electronrail.query.removeMarker");
                    	RTU.invoke("app.electronrail.query.deactivate");
                    	var mapObj = RTU.invoke("map.getMap");
                		mapObj.Map.removeEventListener(mapObj.RMapEvent.MouseRightButtonEvent, rightEventListener);
            	 });
            }
            });
        };
    });
    
    /**
     * 头部tab切换
     */
    RTU.register("app.electronrail.query.initTopBtn",function(){
    	return function(){
    		$(".electronrail-tab-start-head").unbind("click").click(function(){
    			 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                 $(" .electronrail-tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                
                 $(" .electronrail-bodyDiv-sub1").removeClass("hidden");
                 $(" .electronrail-bodyDiv-sub2").addClass("hidden");
                // popuwnd.setSize(360,400);
                 $(".app_electronrail_tab_div").css("width","346px");
                 $(".electronrail-tab-div1-new").css("width","346px");
                 $(".electronrail-bodyDiv").css("width","345px");
                 RTU.invoke("map.removeCenterCross");
                 RTU.invoke("app.electronrail.query.initList");
    		});
    		$(".electronrail-tab-start-head").click();
    		$(".electronrail-tab-middle").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .electronrail-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
               
                $(" .electronrail-bodyDiv-sub2").removeClass("hidden");
                $(" .electronrail-bodyDiv-sub1").addClass("hidden");
               // popuwnd.setSize(360,235);
                $(".app_electronrail_tab_div").css("width","346px");
                $(".electronrail-tab-div1-new").css("width","346px");
                $(".electronrail-bodyDiv").css("width","345px");
                
                $("#electronrail-bodyDiv-sub2-lineNames").inputTip({ text: "" });
                $("#electronrail-bodyDiv-sub2-PlineName").inputTip({ text: "" });
//                RTU.invoke("map.addCenterCross");
                RTU.invoke("app.electronrail.query.removeMarker");
    		});
    	};
    });
  
    RTU.autocompleteBuilder = function (object, url, exParams, parse) {
        try {
            url = "../" + url;
            object.autocomplete(url, {
                minChars: 0,
                width: 168,
                matchContains: true,
                autoFill: false,
                max: 100,
                dataType: "jsonp",
                extraParams: exParams,
                parse: parse,
                formatItem: function (item) {
                    return item;
                },
                formatResult: function (format) {
                    return format;
                }
            });
        } catch (e) {
        }
    };
    
    //初始化线路input
    RTU.register("app.electronrail.query.create", function () {
        var initlineNameAuto = function () {//线路
            lineNameExParams = {
                lName: function () {
                    return $('#electronrail-lineName').val();
                }
            };
            lineNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i].text);
                    var id = replaceSpace(data[i].id);
                    rows[rows.length] = {
                        data: text,
                        value: text+"-"+id,
                        result: text
                    };
                }
                return rows;
            };
            RTU.autocompleteBuilder($("#electronrail-lineName"), "line/findByLName", lineNameExParams, lineNameParse);
            if ($('#electronrail-lineName').result)
                $('#electronrail-lineName').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronrail-lineName').val(arr[0]);
                    $('#electronrail-lineName').attr("lineNo",arr[1]);
                });
        };
        var initsub2lineNameAuto = function () {//线路
            lineNameExParams = {
                lName: function () {
                    return $('#electronrail-bodyDiv-sub2-lineNames').val();
                }
            };
            lineNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i].text);
                    var id = replaceSpace(data[i].id);
                    rows[rows.length] = {
                        data: text,
                        value: text+"-"+id,
                        result: text
                    };
                }
                return rows;
            };
            RTU.autocompleteBuilder($("#electronrail-bodyDiv-sub2-lineNames"), "line/findByLName", lineNameExParams, lineNameParse);
            if ($('#electronrail-bodyDiv-sub2-lineNames').result)
                $('#electronrail-bodyDiv-sub2-lineNames').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronrail-bodyDiv-sub2-lineNames').val(arr[0]);
                    $('#electronrail-bodyDiv-sub2-lineNames').attr("lineNo",arr[1]);
                });
        };
        var initsub2lineNameAuto1 = function () {//线路
            lineNameExParams = {
                lName: function () {
                    return $('#electronrail-bodyDiv-sub2-PlineName').val();
                }
            };
            lineNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i].text);
                    var id = replaceSpace(data[i].id);
                    rows[rows.length] = {
                        data: text,
                        value: text+"-"+id,
                        result: text
                    };
                }
                return rows;
            };
            RTU.autocompleteBuilder($("#electronrail-bodyDiv-sub2-PlineName"), "line/findByLName", lineNameExParams, lineNameParse);
            if ($('#electronrail-bodyDiv-sub2-PlineName').result)
                $('#electronrail-bodyDiv-sub2-PlineName').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronrail-bodyDiv-sub2-PlineName').val(arr[0]);
                    $('#electronrail-bodyDiv-sub2-PlineName').attr("lineNo",arr[1]);
                });
        };
        var replaceSpace = function (text) {
            if (text) {
                var reg = /\s/g;
                return text.replace(reg, "");
            } else {
                return "";
            }
        };
        return function (data) {
            if (timerList)
                clearInterval(timerList);
            setTimeout(function () {
                initlineNameAuto();
                initsub2lineNameAuto();
                initsub2lineNameAuto1();
            }, 500);
            $("#electronrail-lineName").inputTip({ text: "" });
            $("#electronrail-bodyDiv-sub2-lineName").inputTip({ text: "" });
            $("#electronrail-bodyDiv-sub2-PlineName").inputTip({ text: "" });
        };
    });
    
  //清空第二个tab的输入框
    RTU.register("app.electronrail.query.clearTab2Add",function(){
    	return function(){
    		$("#electronrail-bodyDiv-sub2-limitSpeed").val("");
    		$("#electronrail-bodyDiv-sub2-beginKiloSign").val("");
    		$("#electronrail-bodyDiv-sub2-endKiloSign").val("");
    		$("#electronrail-bodyDiv-sub2-lineNames").val("");
    		$("#electronrail-bodyDiv-sub2-beginTime").val("");
    		$("#electronrail-bodyDiv-sub2-endTime").val("");
    		$("input[name='electronrail-bodyDiv-sub2-upDown']").each(function(){
				if($(this).val()=="1"){
					$(this).attr("checked",true);
				}
			});
    	};
    });
    
    //初始化三个tab页的按钮事件
    RTU.register("app.electronrail.query.initBtn",function(){
    	return function(){
    		//tab1查询
    		$("#electronrail-sub1-button1").unbind("click").click(function(){
    			RTU.invoke("app.electronrail.query.initList");
    		});
    		//tab1修改
    		$("#electronrail-sub1-button2").unbind("click").click(function(){
    			if($("#eelectronraildepotPoint-detail-editDiv-tab-depotName").text()==""){
    				$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","on").attr("src","../static/img/app/failureWarnning-images/failureWarnning-Select.png");
    			}else{
    				$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","Off").attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");
    			}
    			var checkeds = electronrailGrid.selectItem();
    			if(checkeds.length == 0){
    				RTU.invoke("header.notice.show", "请选择电子围栏。。");
    			}else if(checkeds.length>1){
    				RTU.invoke("header.notice.show", "只能选择一个电子围栏。。");
    			}else{
    				var data = $(checkeds[0]).data("itemData");
    				data.isupdate = "1";
    				RTU.invoke("app.electronrail.query.addMarker",data);
    			}
    		});
    		//tab1删除
			$("#electronrail-sub1-button3").unbind("click").click(function(){
				var checkeds = electronrailGrid.selectItem();
				if(checkeds.length == 0){
    				RTU.invoke("header.notice.show", "请选择电子围栏。。");
    				return false;
				}
				var name="";
				 $.each(checkeds, function (i, item) {
     	   			 var data=$(item).data("itemData");
     	   			 if(data)
     	   			 if(checkeds.length==1){
     	   				 RTU.invoke("header.roleAlarmMsg.show","确定删除围栏名为："+data.elecName+" 的围栏吗？-");
     	   			 }else{
     	   				 name+=data.elecName+",";
     	   			 }
				 });
				 if(checkeds.length>1){
					 name=name.substring(0, name.length-1);
					 RTU.invoke("header.roleAlarmMsg.show","确定删除围栏名为："+name+" 的围栏吗？-");
				 }
				 $("#roleAlarmSureBtn").click(function () {
       	             $("#roleAlarmDiv").addClass("hidden");
	       	          $.each(checkeds, function (i, item) {
	     	   			 var data=$(item).data("itemData");
	     	   			 if(data){
		     	   			var url="electronicNew/deleteElectronrail?parentRecId="+data.recId+"&type="+data.elecType;
		     	   			 var param={
		     	                   url: url,
		     	                   cache: false,
		     	                   asnyc: true,
		     	                   datatype: "json",
		     	                   success: function (data) {
		     	                	  staticSaveData("ElectronicVersion", "1");
		     	                	  RTU.invoke("map.railWayElectronicfence", {});
		     	                	  RTU.invoke("app.electronrail.query.removeMarker");
		     	                	  RTU.invoke("header.notice.show", "删除成功。。");
		     	                	  RTU.invoke("app.electronrail.query.initList");
		     	                   },
		     	                   error: function () {
		     	                   }
		     	                 };
	     	              RTU.invoke("core.router.get", param);
	     	   			 }
	     	          });
       	          });
   	            $("#roleAlarmCanelBtn").click(function () {
   	                $("#roleAlarmDiv").addClass("hidden");
   	                return false;
   	            });
			});
			//tab2定位
			$("#electronrail-sub2-button1").unbind("click").click(function(){
				RTU.invoke("app.electronrail.query.sub2.searchPosition");
			});
			//tab2添加
			$("#electronrail-sub2-button2").unbind("click").click(function(){
				RTU.invoke("app.electronrail.query.sub2.addMarker");
			});
    	};
    });
    
    //得到第二个tab数据
    function sub2Conditions(){
    	var data={};
    	data.lineName=($("#electronrail-bodyDiv-sub2-PlineName").val()||"");
    	data.lineNo = ($("#electronrail-bodyDiv-sub2-PlineName").attr("lineNo")||"");
    	data.kiloSign=($("#electronrail-bodyDiv-sub2-PkiloSign").val()||"");
    	var str="";
    		var radio=$("input[name='electronrail-bodyDiv-sub2-PupDown'");
        	$.each(radio, function (i, item) {
      			 if($(item).attr("checked")=="checked"){
      				str=$(item).val();
    	   		 }
            });
        	data.upDown=str;
    	if(data.lineName==""){
    		 RTU.invoke("header.alarmMsg.show","请输入线路");
    		 return false;
    	}else if(data.kiloSign==""){
    		RTU.invoke("header.alarmMsg.show","请输入里程");
    		return false;
    	}else{
    		
        	return data;
    	}
    }
    
    //添加弹出标签及相应的点击事件
	  RTU.register("app.electronrail.query.setTabHtml", function () {
	        return function (data) {
//	        	var Point = $.extend(true, {}, data);
	        	var img = $("img[alt='" + data.obj.tabId + "']");
//	            $(img).empty().after("<div id='menu' class='hidden'><ul><li><a href='#' id='rlimit'>临时限速</a></li>"
//	            		+"<li><a href='#' id='mflood'>防洪防汛</a></li><li><a href='#' id='cansel'>取消</a></li></ul></div>");
//	            $(img).click(function(){
//	            	$("#menu").removeClass("hidden").css("margin-left", "40px").css("margin-top", "40px");
//	            });
	            $(img).mousedown(function(e){
	            	if (3 == e.which) {
	            		$("#eleRightHandDiv").remove();
	            		//$("#menu").removeClass("hidden").css("margin-left", "40px").css("margin-top", "40px");
	    	            //rightClick("menuPrent",d);
	            		console.log(data);
	            		var d={
	            				MouseX:e.clientX,
	            				MouseY:e.clientY,
	            				MouseCx:data.Cx,
	            				MouseCy:data.Cy
	            		};
	            		rightEventListener(d);
	            	}
	            });
	         /*   
	            $("#rlimit").unbind("click").click(function(){
	            	
	            	RTU.invoke("map.marker.removeMarker", data);
	            	var typeData = {};
	            	typeData.type = "1";
	            	typeData.point = Point;
	            	typeData.isupdate = "2";
	            	RTU.invoke("app.electronrail.query.addMarkerPoint", typeData);
				});
	            $("#mflood").unbind("click").click(function(){
	            	RTU.invoke("map.marker.removeMarker", data);
	            	var typeData = {};
	            	typeData.type = "2";
	            	typeData.point = Point;
	            	typeData.isupdate = "2";
	            	RTU.invoke("app.electronrail.query.addMarkerPoint", typeData);
	            });
	            $("#cansel").unbind("click").click(function(){
	            	RTU.invoke("map.marker.removeMarker", data);
	            });
	            
	            $("body").click(function(){
	            	$("#menu").addClass("hidden");
	            });
	            */
	        };
	    });
	  
    //定位
    RTU.register("app.electronrail.query.sub2.searchPosition",function(){
    	return function(){
    		var conditions = sub2Conditions();
    		if(conditions){
    			RTU.invoke("header.msg.show", "正在定位。。");
    			var ks = parseInt(conditions.kiloSign * 1000);
    			var url="railWay/glbFindAll?lineNo="+conditions.lineNo+"&lineName="+conditions.lineName+"&upOrDown="+conditions.upDown+"&glb="+ks+"";
    			var param={
    					url: url,
    					cache: false,
    					asnyc: true,
    					datatype: "json",
    					success: function (data) {
    						RTU.invoke("header.msg.hidden");
    						if(data.data){
    							if(data.data.lng!=0 && data.data.lat != 0){
    								RTU.invoke("map.setCenter", { lng: data.data.lng, lat: data.data.lat });
    								RTU.invoke("map.changeLevel", "12");
    								electronPoint = RTU.invoke("app.electronrail.query.addMarkerLocatin", { lng: data.data.lng, lat: data.data.lat });
    								RTU.invoke("app.electronrail.query.setTabHtml", electronPoint);
    							}else{
    								RTU.invoke("header.alarmMsg.show","暂无数据");
    							}
    						}
    					},
    					error: function () {
    					}
    			};
    			RTU.invoke("core.router.get", param);
    		}
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
    //初始化tab1查询列表
    RTU.register("app.electronrail.query.initList",function(){
    	var getConditions = function(){
    		 var typeCheckbox=$("input[name='type']");
    		 var upDownCheckbox=$("input[name='upDown']");
    		 var lineNo=($("#electronrail-lineName").attr("lineno")||"");
    		 var lineName=($("#electronrail-lineName").val());
    		 var beginTime=$("#beginTime").val();
    		 var endTime=$("#endTime").val();
    		 
    		 if(lineName==""){
    			 lineNo="";
    		 }
    		 
    		 var typeStr="";
    		 $.each(typeCheckbox, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
	   				typeStr=typeStr+$(item).val()+",";
		   		 }
	         });
    		 typeStr=typeStr.substring(0, typeStr.length-1);
    		 
    		 var upDownStr="";
    		 $.each(upDownCheckbox, function (i, item) {
    			 if($(item).attr("checked")=="checked"){
    				 upDownStr=upDownStr+$(item).val()+",";
    			 }
    		 });
    		 upDownStr = upDownStr.substring(0, upDownStr.length-1);
    		 
    		 var data={
    				 type:typeStr,
    				 upDown:upDownStr,
    				 lineNo:lineNo,
    				 beginTime:beginTime,
    				 endTime:endTime
    		 };
    		 return data;
    	};
    	var refreshFun=function(data){
    		var showData=[];
    		if(data && data.length>0){
    			showData=data;
    		}
    		
    		  var electronPointArr=RTU.invoke("app.eelectronrail.getElectronPointArr");
    		  RTU.invoke("app.electronrail.clearElectronPointArr");//清空保存画的点
    		  RTU.invoke("app.electronrail.clearElectronPolygons");//清空保存画面的数组
			  RTU.invoke("map.marker.removeAllMarker",electronPointArr);//清除所有点
			  RTU.invoke("map.removeAllGraphics");//清除所有线
			  
    		electronrailGrid = new RTGrid({
                datas: showData,
                containDivId: "electronrail-bodyDiv-sub1-body-grid",
                tableWidth: 345,
                tableHeight: 245,
                isSort: true, //是否排序
                hasCheckBox: true,
                showTrNum: false,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize = 3000;
    			},
                isShowRefreshControl:false,
                selectTrEvent: function (t, currClickItem) {
                	if($(currClickItem).attr("checked")=="checked"){
                		var thisData = currClickItem.data("itemData");
                		thisData.isupdate = "3";
                     	RTU.invoke("app.electronrail.query.clickcheckbox", thisData);
                     	RTU.invoke("map.changeLevel", "8");
                	}else{
                		RTU.invoke("app.electronrail.query.removeMarker");
                	}
                	
                },
                clickTrEvent: function (d, ckb) {
                	 var fd = electronrailGrid.currClickItem().data;
                	 
	                  RTU.invoke("app.electronrail.query.clickcheckbox", fd);
	                  RTU.invoke("map.changeLevel", "8");
                },
                replaceTd: [{ index: 1, fn: function (data, j, ctd, itemData) {
                	 if (data == "1") {
                         return "临时限速";
                     } else if (data == "2") {
                         return "防洪防汛";
                     }else if(data=="3"){
                    	 return "特殊点围栏";
                     }else{
                    	 return data;
                     }
                }
                }],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                },
                colNames: ["围栏名称", "围栏类型"],
                colModel: [{ name: "elecName", width: "70px", isSort: true }, { name: "elecType", width: "55px", isSort: true }]
    		});
    		//画围栏的区域添加标注点
    		for ( var int = 0; int < showData.length; int++) {
    			showData[int].isupdate="3";
    			showData[int].isShow=true;
    			RTU.invoke("app.electronrails.showElectronicRPolygon",showData[int]);
    			RTU.invoke("app.electronrail.query.addMarker",showData[int]);
			}
			RTU.invoke("header.msg.hidden");
    	};
    	return function(){
    		RTU.invoke("header.msg.show", "加载中,请稍后!!!");
    		var conditions=getConditions();
    		var url="";
    		if(conditions.type==""){
    			conditions.type="1,2,3";
    		}
    		url="electronicNew/findAllElectronrails?type="+conditions.type;
             var param={
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "json",
                   success: function (data) {
                	   if(data&&data.data)
                       refreshFun(data.data);
                	   else RTU.invoke("header.msg.hidden");
                   },
                   error: function () {
                   }
                 };
                RTU.invoke("core.router.get", param);
    	};
    });
    
  //移除地图上的电子围栏标注
	  RTU.register("app.electronrail.query.removeMarker",function(){
		  return function(){
			  if(electronPoint){
					 RTU.invoke("map.marker.removeMarker",electronPoint);
			  }
		  }
	  });
    
  //点击复选框，在地图上出现
  RTU.register("app.electronrail.query.clickcheckbox", function () {
      return function (clickData) {
              //设置中心点
             RTU.invoke("map.setCenter", { lng: clickData.longitude, lat: clickData.latitude });
             //在地图上添加点
             clickData.isupdate="3";
             clickData.check=true;
             
             RTU.invoke("app.electronrail.query.addMarker",clickData);
      };
  });
  
  /**
   * ***********************************************************************
   */
    
    RTU.register("app.electronrail.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.close();
            }
            
            var electronPointArr=RTU.invoke("app.eelectronrail.getElectronPointArr");
            $("#electronrail-bodyDiv-sub1-body-grid").remove();
            RTU.invoke("app.electronrail.clearElectronPolygons");//清空保存画面的数组
			RTU.invoke("map.marker.removeAllMarker",electronPointArr);//清除所有点
			RTU.invoke("map.removeAllGraphics");//清除所有线
			
			$("#eleRightHandDiv").remove();
			
        	var mapObj = RTU.invoke("map.getMap");
    		mapObj.Map.removeEventListener(mapObj.RMapEvent.MouseRightButtonEvent, rightEventListener);
        };
    });

//    RTU.register("app.electronrail.query.init", function () {
//        data = RTU.invoke("app.setting.data", "electronrail");
//        if (data && data.isActive) {
//            RTU.invoke("app.electronrail.query.activate");
//        }
//        return function () {
//         
//        };
//    });
    //右击右键是否显示菜单列表
    RTU.register("app.electronrail.setFlagValue", function () {
    	return function setFlagValue(value){
    		flagValue=value;
    	};
    });
    
    var flagValue=false;
    var rightEventListener=function(e){
    	
    	if(flagValue){//不显示右键菜单
    		return false;
    	}
    	
		$("#eleRightHandDiv").remove();
		$("body").append("<div id='eleRightHandDiv' style='position:absolute;background-color:#fff;width:105px;height:25px;top:" + e.MouseY + "px;left:" + e.MouseX + "px;z-index:9999999'></div>");
		var eleRightHandDiv = $("#eleRightHandDiv");
		
		if($("#elecTabLeftDiv").attr("class").indexOf("border-top-click")!=-1){
			
			eleRightHandDiv.empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='rlimit'>临时限速</a></li><li><a href='#' class='mflood'>防洪防汛</a></li><li><a href='#' class='redactElectronicFence'>特殊点围栏</a></li></ul></div></div>");
		
		}else if($("#elecTabRightDiv").attr("class").indexOf("border-top-click")!=-1){
			var val=selectType();
			if(val=="1"){
				eleRightHandDiv.empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='rlimit'>临时限速</a></li></ul></div></div>");
			}else if(val=="2"){
				eleRightHandDiv.empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='mflood'>防洪防汛</a></li></ul></div></div>");
			}else{
				eleRightHandDiv.empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='redactElectronicFence'>特殊点围栏</a></li></ul></div></div>");
			}
		}
		
		
		$(".rlimit").click(function(){
			$("#eleRightHandDiv").remove();
			var type = "1";
			draw(type);
		});
		$(".mflood").click(function(){
			$("#eleRightHandDiv").remove();
			var type = "2";
			draw(type);
		});
		$(".redactElectronicFence").click(function(){
			$("#eleRightHandDiv").remove();
			var type = "3";
			draw(type);
		});
		function draw(type){
			flagValue=true;
			RTU.invoke("header.alarmMsg.showMousePosition","请用鼠标左键进行围栏选择，左键双击结束!-");
        	var lineName = $('#electronrail-bodyDiv-sub2-PlineName').val();
        	var lineId=$('#electronrail-bodyDiv-sub2-PlineName').attr("lineNo");
        	var lineUpDown=getLineUpDown();
        	var typeData = {};
        	typeData.type = type;
			typeData.point = { "Cx":e.MouseCx , "Cy":e.MouseCy};
			typeData.isupdate = "2";
      		typeData.lineName=lineName;
      		typeData.upDown=lineUpDown;
      		typeData.lineNo=lineId;
      		typeData.rightButton=true;
      		//画定位点
      		electronPoint=RTU.invoke("app.electronrail.query.addMarkerLocatin", { lng:e.MouseCx, lat:e.MouseCy,type:type,token:true });
      		
		  		window.eelectronraildepot_tool_polygon = RTU.invoke("map.marker.electronicRail", { borderb: 3, borderc: '#FF00FF', borderpocity: 0.7, core: '#FFFF66', pocity: 0.3, completeFn: function (arr) {
                //电子围栏点的坐标
          		 var arr  =window.eelectronraildepot_tool_polygon.CoordinatesArr;
          		 var str="";
          		 for(var i=0;i<arr.length;i++){
          			 str=str+arr[i].Cx+","+arr[i].Cy+"|";
          		 }
          		 str=str.substring(0, str.length-1);
          		typeData.points=str;
          		flagValue=false;
          		RTU.invoke("header.alarmMsg.hide");
          		RTU.invoke("map.marker.removeMarker",electronPoint);
          		RTU.invoke("app.electronrail.query.addMarkerPoint", typeData);
  			   } 
              });
		}
		
		function selectType(){
			var val="";
			var radio=$("input[name='electronrail_type'");
        	     $.each(radio, function (i, item) {
      			 if($(item).attr("checked")=="checked"){
      			    val=$(item).val();
    	   		 }
            });
        	return val;
		}
		
		function getLineUpDown(){
			var lineUpDown="";
			var radio=$("input[name='electronrail-bodyDiv-sub2-PupDown'");
        	$.each(radio, function (i, item) {
      			 if($(item).attr("checked")=="checked"){
      				lineUpDown=$(item).val();
    	   		 }
            });
        	return lineUpDown;
		}
	};
	
    
    //右键点击地图任意位置，添加电子围栏
    RTU.register("app.electronrail.rightHandMap.init", function(){
    	var mapObj = RTU.invoke("map.getMap");
    	return function(){
    		mapObj.Map.addEventListener(mapObj.RMapEvent.MouseRightButtonEvent, rightEventListener);
    		$("#map").mousedown(function(e){
    			$("#eleRightHandDiv").remove();
    		});
    	};
    });
  
    
    
    RTU.register("app.electronrail.query.init", function () {
        //var data = RTU.invoke("app.setting.data", "electronrail");
        //if (data && data.isActive) {
           // RTU.invoke("app.electronrail.query.activate");
        //}
        setTimeout(function () {
        	findByShortname=getfindByShortname();
        },10);
        return function () {
            return true;
        };
    });
    
    RTU.register("app.electronrail.getfindByShortname", function () {
    	return function(){
    		if(findByShortname){
    			return findByShortname;
    		}else{
    			return getfindByShortname();
    		}
    	}
    });
    
    function getfindByShortname(){
    	   var searchData=null;
			  $.ajax({
		          url: "../bureau/findByShortname?bname=",
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
    
    function staticSaveData(options, value){
   	$.ajax({
    		url: "../syssetting/updateObjByProperty?userid=-1&options=" + options + "&optionvalue=" + value + "&type=1&r=" + new Date().getTime(),
    		dataType: "jsonp",
    		type: "GTE",
    		success: function(data){
    			
    		}
    	});
    }
});
