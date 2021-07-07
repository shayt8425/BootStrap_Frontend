RTU.DEFINE(function (require, exports) {
/**
 * 模块名：特殊点围栏--query
 * name：electronrail
 * date:2015-7-2
 * version:1.0 
 */
	require("../../../css/app/electronraildepot/app-electronraildepot.css");
	require("../../../css/app/electronraildepot/app-electronraildepot-newDetail.css");
	require("app/home/app-map.js");
	require("app/electronicfenceNew/app-electronicfence-detail.js");
	require("../../../css/app/electronicfence/app-electronrail-detail.css");
	require("popuwnd/js/popuwnd.js");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
 //   require("app/electronicfenceNew/app-electronicfence-query.js");
    require("RTGrid/RTGrid_New.js");
    var $html;
    var electronraildepot_popuwnd;
    var timerList ;
    var timerList1 ;
    var eelectronraildepotPoint;
    var electronraildepotGrid;
    var selectLoco;
    var g;
    var timeDepot;
    var timeDepotSelect;
    window.locomotiveDepotPopuwnd;
    var locomotives="eelectronraildepotPoint";//机务段
    RTU.register("app.eelectronraildepot.query.loadHtml", function () {
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
    RTU.register("app.eelectronraildepot.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口  
            RTU.invoke("app.eelectronraildepot.query.loadHtml", { url: "../app/modules/electronraildepot/app-electronraildepot-query.html", fn: function (html) {
            	if (!electronraildepot_popuwnd) {
                    electronraildepot_popuwnd = new PopuWnd({
                        title: "特殊点围栏",
                        html: html,
                        width: 370,
                        height:480,
                        left: 10,
                        top: 60,
                        shadow: true
                    });
                    electronraildepot_popuwnd.remove = electronraildepot_popuwnd.close;
                    electronraildepot_popuwnd.close = electronraildepot_popuwnd.hidden;
                    electronraildepot_popuwnd.init();
                }
                else {
                	electronraildepot_popuwnd.close();
                	electronraildepot_popuwnd.html(html);
                    electronraildepot_popuwnd.init();
                }
            	if(electronraildepotGrid){
            		electronraildepotGrid = null;
            	}
                return electronraildepot_popuwnd;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.eelectronraildepot.query.create");
            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            	RTU.invoke("app.eelectronraildepot.query.initList");
            	RTU.invoke("app.eelectronraildepot.query.ListBtnInit");
            	RTU.invoke("app.eelectronraildepot.rightHandMap.init");
            	RTU.invoke("app.eelectronraildepot.setInterval.initList");
            	 electronraildepot_popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
            		  var mapObj = RTU.invoke("map.getMap");
                      mapObj.Map.removeEventListener(mapObj.RMapEvent.MouseRightButtonEvent, eventListenerFun);
  					 
  					 $(".eelectronraildepot_rightHandDiv").remove();
  					RTU.invoke("app.eelectronraildepot.query.deactivate");
            	 });
            }
            });
        };
    });
    
    RTU.autocompleteBuilder = function (object, url, exParams, parse) {
        try {
            url = "../" + url;
            object.autocomplete(url, {
                minChars: 0,
                width: 120,
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
    
    RTU.register("app.eelectronraildepot.query.ListBtnInit",function(){
    	return function(){
    		$("#electronraildepot-button1").unbind("click").click(function(){
    			RTU.invoke("app.eelectronraildepot.query.initList");
    		});
			$("#electronraildepot-button2").unbind("click").click(function(){//主页面修改
				var checkeds = electronraildepotGrid.selectItem();
    			if(checkeds.length == 0){
    				RTU.invoke("header.notice.show", "请选择电子围栏。。");
    			}else if(checkeds.length>1){
    				RTU.invoke("header.notice.show", "只能选择一个电子围栏。。");
    			}else{
    				 var data = $(checkeds[0]).data("itemData");
    				 var sendData={}
                	 sendData.id=data.recId;
                	 sendData.type="edit";
                	 sendData.point=data;
                	// RTU.invoke("map.setCenter", { lng: data.longitude, lat: (data.latitude+0.99902333),top:110,left:200 });//当点击修改后重新定位中心点
                	 RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
    			}	
			});
			$("#electronraildepot-button3").unbind("click").click(function(){
				var checkeds = electronraildepotGrid.selectItem();
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
	     	   			 var recId=data.recId;
	     	   			 var url="electronicNew/deleteElectronrail?parentRecId="+recId+"&type="+data.elecType;
	     	   			 var param={
	     	                   url: url,
	     	                   cache: false,
	     	                   asnyc: true,
	     	                   datatype: "json",
	     	                   success: function (data) {
	     	                	 
	     	                	  RTU.invoke("header.notice.show", "删除成功。。");
	     	                	  RTU.invoke("header.msg.hidden");
   		                	   
	   		                	   RTU.invoke("app.eelectronraildepot.query.initList");
	   		                	   var sendData = {
		                			   id:recId,
		                			   type:"show"
			                	   };
			                       RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
			  					   RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
			  					 var mapObj = RTU.invoke("map.getMap");
			  					  if(mapObj.Map.rpgon){
			  						 RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
			  					  }
	     	                	  
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
			
			//查看机车
			$("#electronraildepot-button4").unbind("click").click(function(){
				//var checkeds = electronraildepotGrid.selectItem();
				var checkeds = electronraildepotGrid.getSelectItemData();
    			if(checkeds.length == 0){
    				RTU.invoke("header.notice.show", "请选择机务段。。");
    				return;
    			}else if(checkeds.length > 1){
    				RTU.invoke("header.notice.show", "只能选择一个特殊点围栏。");
    				return;
    			}
    			/*var data="";
    			 $.each(checkeds, function (i, item) {
     	   			  data=$(item).data("itemData");
    			 });*/
    			 RTU.invoke("app.locomotiveDepot.query.activate",checkeds);
			});
    	};
    });
    
    
    
    
    //创建查询窗口
    RTU.register("app.locomotiveDepot.query.activate", function () {
        return function (data) {
        	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            //查询窗口
            RTU.invoke("app.eelectronraildepot.query.loadHtml", { url: "../app/modules/electronraildepot/app-locomotivedepot-query.html", fn: function (html) {
                //判断窗口是否存在
                if (window.locomotiveDepotPopuwnd) {
                	window.locomotiveDepotPopuwnd.close();
                	window.locomotiveDepotPopuwnd=undefined;
                }
            	if (!window.locomotiveDepotPopuwnd) {
                	window.locomotiveDepotPopuwnd = new PopuWnd({
                		title:"",
                		html: html,
                        width: 650,
                        height: 410,
                        left:505,
                        top: 60,
                        shadow: true
                    });
                	window.locomotiveDepotPopuwnd.init();
                }else {
                	window.locomotiveDepotPopuwnd.init();
                }
            	
              //重写关闭的方法
                window.locomotiveDepotPopuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	window.locomotiveDepotPopuwnd.close();
                	window.locomotiveDepotPopuwnd=undefined;
                	RTU.invoke("header.msg.hidden");
                	RTU.invoke("header.alarmMsg.hide");
                });
                RTU.invoke("app.locomotiveDepot.query.loadDatas",data);
                RTU.invoke("app.locomotiveDepot.setInterval.loadDatas",data);
            }
            });
        };
    });
    
    //查看机车 列车 刷新数据
    RTU.register("app.locomotiveDepot.setInterval.loadDatas", function () {
    	return function time(data){
    		if(timeDepotSelect){
        		clearInterval(timeDepotSelect);
        	}
	    	 timeDepotSelect = setInterval(function () {
	    		//判断窗口是否存在
	            if (window.locomotiveDepotPopuwnd) {
	            	//console.log("已打开查看机车列表");
	            	RTU.invoke("app.locomotiveDepot.query.loadDatas",data);
	            }
	    	 }, 5000);
    	};
    });
    
    //加载数据
    RTU.register("app.locomotiveDepot.query.loadDatas", function () {
        return function (data) {
 			 var url ="../electronicNew/findLocosByElectronrailDepot?parentRecId="+data.recId+"&type=3";
 			  window.g= new RTGrid({
        		 url:url,
        	     containDivId: "locomotiveDepot_grid_result",
                 tableWidth:648,
                 tableHeight:375,
                 isSort: true,  //是否排序
                 showTrNum:true,
                 hasCheckBox:false,
                 clickIdItem:"lkjTime_locoNo_recId",
                 setPageSize:[100,200,500],
                 extraUrlParam:{
                	 pageSize:100
                 },
                 beforeLoad:function(that){
                	 that.pageSize =100;
                 },
                 isShowPagerControl:false,   //显示分页
                 isShowRefreshImgControl:true,
                 isShowRefreshControl:false,
                 trRightClick:function(returnData){   //右键
                     
                 },
                 clickTrEvent: function (t) {   //点击行
                	 //TODO 定位机车-展示机车详细信息
                 },
                 loadPageCp:function(t){
                     t.cDiv.css("left","200px");
                     t.cDiv.css("top","200px");
                     if (t.param.datas.length == 0) {
                    	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                         return;
                     }
                     //滚动条设置顶端
                     window.setTimeout(function () {
                    	 t.cDiv.find(".RTGrid_Bodydiv").scrollTop(0);
                     }, 100);
                 },
                 replaceTd:[
        			        { index: 0, fn: function (data, j, ctd, itemData) {
                           	 if (itemData.isOnline == "1"||itemData.isOnline == "2") {
                                    return "<img src='../static/img/app/online_pic_14_14.png'>";
                                } else if (itemData.isOnline == "3"||itemData.isOnline == "4") {
                                    return "<img src='../static/img/app/outline_pic_14_14.png'>";
                                }
                           }
                           },{index: 1, fn: function (data,j,ctd,itemData) {
        						return itemData.ttypeShortname+"-"+itemData.locoNo;
        					}
        			        }],
                 colNames: ["状态","机车","车次","机务段","线路","里程","车站", "所属局"],
                 colModel: [
                 {name:"isOnline", width: "40",isSort:true},          
                 {name:"locoNo",isSort:true},
                 {name:"checiName",isSort:true},
                 {name:"dname",isSort:true},
                 {name:"lname",isSort:true},
                 {name:"kiloSign",isSort:true},
                 {name:"sname",isSort:true},
                 {name:"bname",isSort:true}]
             });
        	  
        	    var msgArr=window.g.msg.split("_");
        	    if(msgArr.length>2){
        	    	
        	    	$(".popuwnd-title-text",window.locomotiveDepotPopuwnd.$wnd).html("<div>" +
        	    			"<div style='float:left;right:35px;width:300px;'>围栏名称："+data.elecName+"</div>" +
        	    			"<div style='float:left;right:35px;width:100px;'>总数："+msgArr[0]+"</div>" +
        	    			"<div style='float:left;right:35px;width:100px;'>在线："+msgArr[1]+"</div>" +
        	    			"<div style='float:left;right:35px;width:100px;'>离线："+msgArr[2]+"</div>" +
        	    	"</div>");
        	    }
        };
    });
    
    //初始化线路input
    RTU.register("app.eelectronraildepot.query.create", function () {
        var initbureauNameAuto = function () {//线路
        	bureauNameExParams = {
        			bname: function () {
                    return $('#electronraildepot-bureauName').val();
                }
            };
            bureauNameParse = function (data) {
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
            RTU.autocompleteBuilder($("#electronraildepot-bureauName"), "bureau/findByShortname", bureauNameExParams, bureauNameParse);
            if ($('#electronraildepot-bureauName').result)
                $('#electronraildepot-bureauName').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronraildepot-bureauName').val(arr[0]);
                    $('#electronraildepot-bureauName').attr("bureauId",arr[1]);
                });
        };
        var initdepotNameAuto = function () {//线路
        	depotNameExParams = {
        			shortname: function () {
                    return $('#electronraildepot-depotName').val();
                }
            };
        	depotNameParse = function (data) {
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
            RTU.autocompleteBuilder($("#electronraildepot-depotName"), "depot/findByShortname", depotNameExParams, depotNameParse);
            if ($('#electronraildepot-depotName').result)
                $('#electronraildepot-depotName').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronraildepot-depotName').val(arr[0]);
                    $('#electronraildepot-depotName').attr("depotId",arr[1]);
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
            	initbureauNameAuto();
                initdepotNameAuto();
            }, 500);
            $("#electronraildepot-depotName").inputTip({ text: "" });
            $("#electronraildepot-bureauName").inputTip({ text: "" });
        };
    });
    
    function getConditions(){
    	var data={};
    	data.depotId=$("#electronraildepot-depotName").attr("depotid")||"";
    	data.bureauId=$("#electronraildepot-bureauName").attr("bureauid")||"";
    	
    	return data;
    };
    
    //刷新特殊点围栏列表页面
    RTU.register("app.eelectronraildepot.setInterval.initList",function(){
    	return function time(){
	    	 timeDepot = setInterval(function () {
	    		 RTU.invoke("app.eelectronraildepot.query.initList");
	    	 }, 5000);
    	};
    });
    
    
    RTU.register("app.eelectronraildepot.query.initList",function(){
    	
    	var objData=[];
    	var refreshFun=function(data){
    		var showData=[];
    		for(var i = 0;i<data.length;i++){
    			showData[i]=data[i].electronrail;
    			objData[i]=data[i];
    		}
    		if(electronraildepotGrid){
    			electronraildepotGrid.refresh(showData);
    		}else{
    			electronraildepotGrid = new RTGrid_New({
                    datas: showData,
                    containDivId: "electronraildepot-body-grid",
                    tableWidth: 365,
                    tableHeight: 345,
                    isSort: true, //是否排序
                    hasCheckBox: false,
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
                    		
                    		 var sendData={}
                        	 sendData.id=thisData.recId;
                        	 sendData.type="show";
                        	 
                        	 RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
                    	}else{
                    		 /*if(eelectronraildepotPoint){
                    			//RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
                    		 }*/
                    		 /*var mapObj = RTU.invoke("map.getMap");
	               			 if(mapObj.Map.rpgon){
	               				 //RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
	               			 }
	               			 RTU.invoke("map.marker.electronicRailClose");*/
                    	}
                    	
                    },
                    clickTrEvent: function (d, ckb) {
                    	 var fd = electronraildepotGrid.currClickItem().data;
                    	 var sendData={}
                    	 for(var i=0;i<objData.length;i++){
 							if(fd.recId==objData[i].electronrail.recId){
 									 sendData.point=objData[i];
 							};
 						 }
                    	 sendData.id=fd.recId;
                    	 sendData.type="show";
                    	 RTU.invoke("map.setCenter", { lng: fd.longitude, lat: fd.latitude});
                    	 RTU.invoke("map.changeLevel", "8");
                    	 RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
                    	 //alert("1");
                    	 if (window.locomotiveDepotPopuwnd) {
                    		 var checkeds = electronraildepotGrid.getSelectItemData();
                 			 if(checkeds.length == 0){
                 				RTU.invoke("header.notice.show", "请选择机务段。。");
                 				return;
                 			 }else if(checkeds.length > 1){
                 				RTU.invoke("header.notice.show", "只能选择一个特殊点围栏。");
                 				return;
                 			 }
                 			 RTU.invoke("app.locomotiveDepot.query.activate",checkeds);
                         }                    	 
                    },
                    replaceTd: [{index: 2, fn: function (data,j,ctd,itemData) {
                    				if(objData[j].pointType==1){
                    					return "机务段";
                    				}else if(objData[j].pointType==2){
                    					return "车站";
                    				}else if(objData[j].pointType==3){
                    					return "换装点";
                    				}else if(objData[j].pointType==5){
                    					return "检测点";
                    				}else{
                    					return "其它";
                    				}
								}
                    			},{
                    			index: 3, fn: function (data,j,ctd,itemData) {
									return objData[j].count;;
									}
                    			}
			        		],
                    loadPageCp: function (t) {
                        t.cDiv.css("left", "200px");
                        t.cDiv.css("top", "200px");

                    },
                    colNames: ["围栏名称","所属局", "特殊点类型","机车总数"],
                    colModel: [{ name: "elecName", width: "70", isSort: true },{ name: "bureauName", width: "70", isSort: true }, { name: "depotName", width: "70", isSort: true }, { name: "count", width: "50", isSort: true }]
                });
    		}
    		RTU.invoke("header.msg.hidden");
    	};
    	
    	return function(){
    		var conditions=getConditions();
            var url="electronicNew/findElectronrailDepots?depotId="+conditions.depotId+"&bureauId="+conditions.bureauId+"&parentId=";
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
    
    //查找某一个电子围栏数据
	  function searchOne(id){
		  var searchData=null;
		  $.ajax({
	          url:"../electronicNew/findElectronrailDepots?depotId=&bureauId=&parentId="+id,
	          type: "get",
	          async: false,
	          success: function (data) {
	        	 data = $.parseJSON(data);
	             if(data&&data.data){
	            	 searchData = jQuery.extend(true, {}, data.data);
	             }
	          }
	      });
		  if(searchData!=null){
			  searchData=searchData[0];
		  }
		  return searchData;
	  }
	 
    
    RTU.register("app.eelectronraildepot.rightHandMap.addMarker",function(){
    	return function(searchData){
    		if(eelectronraildepotPoint){
				 RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
			}
    		if(!searchData.point){
        		searchData.point = searchOne(searchData.id);
    		}
			RTU.invoke("core.router.load", {
				 url: "../app/modules/electronraildepot/app-electronraildepot-newDetail.html",
				 async: false,
				 success: function (status) {
					 $status = $(status);
				 }
			});
			
			if(searchData.type=="edit" || searchData.type=="add"||searchData.type=="anewDraw"){
				eelectronraildepotPoint= RTU.invoke("map.marker.addMarker", {
					 isSetCenter: true,
					 pointType:locomotives,
					 TIPSID: "id",
					 iconWidth: "30", //点的 宽度
				     iconHeight:"30", //点的高度
		    		 iconLeft: -15, //点图标left
		    	     iconTop: -12, //点图标top
					 isDefaultRightTab: true,
					 setDataSeft: false,
					 tabHtml: $status.html(),
					 pointData: searchData.point,
					 tabWidth: 290, //tab 宽度
					 tabHeight: 240, //tab 的高度
					 initFn: function (obj) {
						 var tab = $("#" + obj.tabId);
						 var cNum = 20;
			                if (obj.Point.DetaY == -7) {
			                    cNum = 4;
			                }
		                 var tp = -tab.height() - 20;
		                 var tml = -tab.width() / 2 + cNum-7;
		                 tab.css({ "margin-left": tml, "margin-top": tp });
		                 if(obj.Point.obj.pointData&&obj.Point.obj.pointData.recId){
		                	 obj.itemData=obj.Point.obj.pointData;
		                	 obj.type="edit";
		                 }else{
		                	 obj.type="add";
		                	 obj.points=searchData.points;
		                 }
		                 if(searchData.Point)obj.type="anewDraw",obj.itemData=searchData.Point;
		             	 RTU.invoke("app.eelectronraildepot.query.initDetail",obj);
		             	$("#"+obj.tabId+" .electronraildepotPoint-editOutDiv").removeClass("hidden");
						$("#"+obj.tabId+" .electronraildepotPoint-showOutDiv").addClass("hidden");
						if(obj.type=="add"){
							$(".td3" ,".eelectronraildepotPoint-detail-editDiv-tab02").addClass("hidden");
							$(".td4" ,".eelectronraildepotPoint-detail-editDiv-tab02").removeClass("hidden");
						}
						 setTimeout(function(){
							 var objId= $("#" + obj.tabId);
							 $(" .closediv", $(objId)).click(function () {
			                    $(objId).hide();
							 });
						 },30);
						 
					 },
					 rightHand:function(obj){
						 //RTU.invoke("app.eelectronraildepot.markerRightClick",obj);
					 }
		 		});
				
				setTimeout(function(){
	    			eelectronraildepotPoint.runClickEvent();
		 		},50);
			}else{
				eelectronraildepotPoint= RTU.invoke("map.marker.addMarker", {
					 isSetCenter: true,
					 pointType: locomotives,
					 TIPSID: "id",
					 iconWidth: "30", //点的 宽度
				     iconHeight:"30", //点的高度
		    		 iconLeft: -15, //点图标left
		    	     iconTop: -12, //点图标top
					 isDefaultRightTab: true,
					 setDataSeft: false,
					 tabHtml: $status.html(),
					 pointData: searchData.point.electronrail,
					 tabWidth: 290, //tab 宽度
					 tabHeight: 240, //tab 的高度
					 initFn: function (obj) {
						 var tab = $("#" + obj.tabId);
						 var cNum = 20;
			                if (obj.Point.DetaY == -7) {
			                    cNum = 4;
			                }
		                 var tp = -tab.height() - 20;
		                 var tml = -tab.width() / 2 + cNum-7;
		                 tab.css({ "margin-left": tml, "margin-top": tp });
		                 obj.itemData=obj.Point.obj.pointData;
		                 obj.type="show";
		                 RTU.invoke("map.marker.electronicRailClose");
		             	 RTU.invoke("app.eelectronraildepot.query.initDetail",obj);
						 
						 setTimeout(function(){
							 var objId= $("#" + obj.tabId);
							 $(" .closediv", $(objId)).click(function () {
			                    $(objId).hide();
							 });
						 },30);
						 
					 },
					 rightHand:function(obj){
						 //obj.itemData=obj.Point.obj.pointData;
						 //RTU.invoke("app.eelectronraildepot.markerRightClick",obj);
					 }
		 		});
				
				setTimeout(function(){
	    			eelectronraildepotPoint.runClickEvent();
		 		},50);
				
				//显示围栏名
				 if(searchData.point.electronrail.elecName&&eelectronraildepotPoint){
					 $(eelectronraildepotPoint.Icon).after('<div  class="TIPShowName" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+(-3)+'px;left:'+(25)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + searchData.point.electronrail.elecName + '</div>');
				 }
			}
    	};
    });
    var flagValue=false;
    var eventListenerFun=function(e){
    	if(flagValue){
    		return false;
    	}
    	
		$("#eeleRightHandDiv").remove();
		$("body").append("<div id='eeleRightHandDiv' style='position:absolute;background-color:#fff;width:105px;height:25px;top:" + e.MouseY + "px;left:" + e.MouseX + "px;z-index:9999999'></div>");
		var eeleRightHandDiv = $("#eeleRightHandDiv");
		eeleRightHandDiv.empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='depotEle'>特殊点围栏</a></li></ul></div></div>");
		$(".depotEle").unbind("click").click(function(){
			$("#eeleRightHandDiv").remove();
			e.type = "add";
			draw(e);
		});
		$(".rlimit").click(function(){
			$("#eeleRightHandDiv").remove();
			e.type = "1";
			draw(e);
		});
		$(".mflood").click(function(){
			$("#eeleRightHandDiv").remove();
			e.type = "2";
			draw(e);
		});
		
		
    };
    
		function draw(e){
			flagValue=true;
			RTU.invoke("header.alarmMsg.showMousePosition","请用鼠标左键进行围栏选择，左键双击结束!-");
        	var typeData = {};
        	typeData.type = e.type;
        	if(e.itemData){
        		typeData.id=e.itemData.recId;
        		typeData.Point=e.itemData;
        	}
        	if(e.type=="1"||e.type=="2"){
        		typeData.point = { "Cx":e.MouseCx , "Cy":e.MouseCy};
    			typeData.isupdate = "2";
          		typeData.rightButton=true;
          		typeData.depot=true;
          		electronPoint=RTU.invoke("app.electronrail.query.addMarkerLocatin", { lng:e.MouseCx, lat:e.MouseCy,type:e.type });
        	}else{
        		if(e.MouseCx&&e.MouseCy){
        			typeData.point = { "longitude":e.MouseCx , "latitude":e.MouseCy};
        			electronPoint=RTU.invoke("app.electronrail.query.addMarkerLocatin", { lng:e.MouseCx, lat:e.MouseCy,type:e.type });
        		}else if(e.itemData){
        			typeData.point = { "longitude":e.itemData.longitude , "latitude":e.itemData.latitude};
        			electronPoint=RTU.invoke("app.electronrail.query.addMarkerLocatin", { lng:e.itemData.longitude, lat:e.itemData.latitude,type:e.type });
        		}else{
        			typeData.point = { "longitude":e.longitude , "latitude":e.latitude};
        			typeData.type="add";
        		}
        	}
			  		window.eelectronraildepot_tool_polygon2 = RTU.invoke("map.marker.electronicRail", { borderb: 3, borderc: '#FF00FF', borderpocity: 0.7, core: '#FFFF66', pocity: 0.3, completeFn: function (arr) {
                    //电子围栏点的坐标
	          		 var arr  =window.eelectronraildepot_tool_polygon2.CoordinatesArr;
	          		 var str="";
	          		 for(var i=0;i<arr.length;i++){
	          			 str=str+arr[i].Cx+","+arr[i].Cy+"|";
	          		 }
	          		 str=str.substring(0, str.length-1);
	          		 typeData.points=str;
	          		flagValue=false;
	          		RTU.invoke("header.alarmMsg.hide");
	          		if(eelectronraildepotPoint){
						 RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);//不显示页面
					}
	          		RTU.invoke("map.marker.removeMarker",electronPoint);
	          		if(e.type=="1"||e.type=="2"){
	          			RTU.invoke("app.electronrail.query.addMarkerPoint", typeData);
	          		}else{
	          			RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",typeData);
	          		}
  			   } 
              });
		}
		
    //右键点击地图任意位置，添加电子围栏
    RTU.register("app.eelectronraildepot.rightHandMap.init", function(){
    	var mapObj = RTU.invoke("map.getMap");
    	
    	return function(){
    		mapObj.Map.addEventListener(mapObj.RMapEvent.MouseRightButtonEvent, eventListenerFun);
    		$("#map").mousedown(function(e){
    			$("#eeleRightHandDiv").remove();
    		});
    	};
    });
    
//    RTU.register("app.eelectronraildepot.markerRightClick",function(){
//    	return function(obj){
//    		 var clientWidth = ($(obj.Point.Icon)[0].clientWidth||32);
//             var clientHeight= ($(obj.Point.Icon)[0].clientHeight||30);
//    		 $(obj.target).after("<div class='eelectronraildepot_rightHandDiv' style='position: absolute;background-color:#fff;width:105px;height:auto;top:"+clientHeight+"px;left:"+clientWidth+"px;'></div>").show();
//    		 var recid=obj.itemData ? obj.itemData.recId : -1;
//    		  $(".eelectronraildepot_rightHandDiv").empty().append("<div><div id='menu'><ul><li><a href='#' class='eelectronraildepot-a' alt="+recid+">编辑机务段围栏</a></li>"
//               +"</ul></div></div>");
//    		  
//    		  
//    		  $(".eelectronraildepot-a").unbind("click").click(function(){
//    			  $(".eelectronraildepot_rightHandDiv").remove();
//    			  var mapObj = RTU.invoke("map.getMap");
//    			  if(mapObj.Map.rpgon){
//    				 RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
//    			  }
//    			  RTU.invoke("map.marker.electronicRailClose");
//    			  var recId=$(this).attr("alt");
//    			  if(recId!=-1){
//    				  window.eelectronraildepot_tool_polygon3 = RTU.invoke("map.marker.electronicRail", { borderb: 3, borderc: '#FF00FF', borderpocity: 0.7, core: '#FFFF66', pocity: 0.3, completeFn: function (arr) {
////                        //电子围栏点的坐标
//                		 var arr  =window.eelectronraildepot_tool_polygon3.CoordinatesArr;
//                		 var str="";
//                		 for(var i=0;i<arr.length;i++){
//                			 str=str+arr[i].Cx+","+arr[i].Cy+"|";
//                		 }
//                		 str=str.substring(0, str.length-1);
//                		 
//                		 $.ajax({
//               	          url: "../electronraildepot/updateElectronrailDepot?recId="+recId+"&points="+str,
//               	          type: "get",
//               	          async: false,
//               	          success: function (data) {
//               	        	 RTU.invoke("header.notice.show", "添加围栏成功。。");
//               	          }
//                		 });
//                		 
//        			  } 
//                    });
//    			  }else{
//    				  RTU.invoke("header.alarmMsg.show","请先添加点到数据库。。");
//    			  }
//    		  });
    		  
//    	};
//    });
    
    RTU.register("app.eelectronraildepot.query.initDetail",function(){
    	return function(data){
    		RTU.invoke("app.eelectronraildepotPoint.query.stationName", data);
    		RTU.invoke("app.eelectronraildepot.query.initDetailBtn",data);
    		RTU.invoke("app.eelectronraildepot.query.initDetailData",data);
//    		RTU.invoke("app.eelectronraildepot.query.initDetailInput",data);
    	};
    });
    
    RTU.register("app.eelectronraildepot.query.initDetailBtn",function(){
    	return function(data){
			if(data.type=="edit" || data.type=="add"){
				$("#"+data.tabId+" .eelectronraildepotPoint-editOutDiv").removeClass("hidden");
				$("#"+data.tabId+" .eelectronraildepotPoint-showOutDiv").addClass("hidden");
			}else{
				$("#"+data.tabId+" .eelectronraildepotPoint-editOutDiv").addClass("hidden");
				$("#"+data.tabId+" .eelectronraildepotPoint-showOutDiv").removeClass("hidden");
			}
			$("#eelectronraildepotPoint-detail-editDiv-tab-button02").unbind("click").click(function(){
				//取消
				if(data.type=="edit"){
					/*var recId=$('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').attr("recId");
					 var sendData = {
               			   id:recId,
               			   type:"show"
	                	   };*/
	                      // RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
				}else if(data.type=="anewDraw"){
					if(eelectronraildepotPoint){
						 RTU.invoke("map.marker.electronicRailClose");
						 RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
					}
					var obj={
							id:data.itemData.recId,
							point:null
					};
					RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",obj);
					$(".pointTab").css("display","none");
				}else{
					if(eelectronraildepotPoint){
						 RTU.invoke("map.marker.electronicRailClose");
						 RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
					}
				}
				 $(".pointTab").css("display","none");
			});
			 //保存
    		 $("#eelectronraildepotPoint-detail-editDiv-tab-button04").unbind("click").click(function(){
    			saveOrEditData(data);
    		 });
    		//修改
			  $("#eelectronraildepotPoint-detail-editDiv-tab-button03").unbind("click").click(function(){//修改
				  saveOrEditData(data);
			  });
    		function saveOrEditData(data){
    			//添加 或修改 
    			var recId=$('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').attr("recId");
    			var bureauId=$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName option:selected").attr('id');//获取选 中属性的值
    			var stationName=$('#eelectronraildepotPoint-detail-editDiv-tab-stationName').val();
    			var dotType =$("#selectElecType option:selected").val();
    			var remark =document.getElementById("eelectronraildepotPoint-detail-editDiv-tab-remark").value;
    			//var depotId=$('#eelectronraildepotPoint-detail-editDiv-tab-depotName').attr("d_id");
    			//var depotName=$('#eelectronraildepotPoint-detail-editDiv-tab-depotName').text();
    			//var bureauName=$('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').val();
    			
			  if(stationName==""){
			      RTU.invoke("header.alarmMsg.show","请输入围栏名称");
			  return false;
  			  }else if(bureauId==""){
  				  RTU.invoke("header.alarmMsg.show","请选择围栏所属局");
  				  return false;
  			  }
  			  else if(dotType == ""||dotType=="请选择围栏类型"){
  				  RTU.invoke("header.alarmMsg.show","请选择围栏类型");
  				  return false;
  			  }
    			else{
    				   RTU.invoke("header.msg.show", "保存中，请稍后！！！");
    				   if(recId){
    					  // var url = "electronraildepot/updateElectronrailDepot?recId="+recId+"&dotType="+dotType+"&bureauId="+bureauId+"&points=&stationRail="+stationName+"&remark="+remark;
    					   var url="electronicNew/updateElectronrailDepot?parentRecId="+recId+"&depotId=1&pointType="+dotType+"&longitude=&latitude=&points=&elecName="+stationName+"&editUser=bbb&bureauId="+bureauId+"&remark="+remark;
    					   if(data.points){
    						    url="electronicNew/updateElectronrailDepot?parentRecId="+recId+"&depotId=1&pointType="+dotType+"&longitude=&latitude=&points="+data.points+"&elecName="+stationName+"&editUser=bbb&bureauId="+bureauId+"&remark="+remark;
    					   }
     					   var param = {
      		                   url: url,
      		                   cache: false,
      		                   asnyc: true,
      		                   datatype: "jsonp",
      		                   success: function (data) {
      		                	   RTU.invoke("header.notice.show", "修改成功。。");
      		                	   RTU.invoke("header.msg.hidden");
      		                	   
      		                	   RTU.invoke("app.eelectronraildepot.query.initList");
      		                	   var sendData = {
    		                			   id:data.data.id,
    		                			   type:"show"
    			                	   };
    			                       RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
      		                   },
      		                   error: function () {
      		                	   RTU.invoke("header.msg.hidden");
      		                   }
      		                 };
      		                RTU.invoke("core.router.get", param);
     				   }else{
//     					   var url = "electronraildepot/addElectronrailDepot?depotId="+depotId+"&bureauId="+bureauId+"&points=&latitude="+data.latitude+"&longitude="+data.longitude;
     					 //var url = "electronraildepot/addElectronrailDepot?dotType="+dotType+"&bureauId="+bureauId+"&points="+data.points+"&latitude="+data.latitude+"&longitude="+data.longitude+"&stationRail="+stationName+"&remark="+remark;  
     					 var url="electronicNew/addElectronrailDepot?depotId=1&pointType="+dotType+"&longitude="+data.longitude+"&latitude="+data.latitude+"&points="+data.points+"&elecName="+stationName+"&editUser=bbb&bureauId="+bureauId+"&remark="+remark;
     					 var param = {
      		                   url: url,
      		                   cache: false,
      		                   asnyc: true,
      		                   datatype: "jsonp",
      		                   success: function (data) {
      		                	   RTU.invoke("header.notice.show", "添加成功。。");
      		                	   RTU.invoke("header.msg.hidden");
      		                	   
      		                	   RTU.invoke("app.eelectronraildepot.query.initList");
      		                	   var sendData = {
    		                			   id:data.data.id,
    		                			   type:"show"
    			                	   };
    			                       RTU.invoke("app.eelectronraildepot.rightHandMap.addMarker",sendData);
      		                   },
      		                   error: function () {
      		                	   RTU.invoke("header.msg.hidden");
      		                   }
      		                 };
      		                RTU.invoke("core.router.get", param);
     				   }
    			}
    		}
    		  $("#eelectronraildepotPoint-detail-editDiv-tab-button01").unbind("click").click(function(){//编辑
    			  /*if(eelectronraildepotPoint){
						 RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);//不显示页面
					}*/
    			  var mapObj = RTU.invoke("map.getMap");
    			  if(mapObj.Map.rpgon){
    					RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
    				}
    			  RTU.invoke("map.marker.electronicRailClose");
    			data.type = "anewDraw";
    			$(".pointTab").css("display","none");
				draw(data);
			  });

			  $("#eelectronraildepotPoint-lineSelectBut").unbind("click").click(function(){//图片  段修改
				  RTU.invoke("app.eelectronraildepot.imgOnOffSet",data);
			  });
    	};
    });
    
    RTU.register("app.eelectronraildepot.query.initDetailData",function(){
    	return function(data){
    		var mapObj = RTU.invoke("map.getMap");
			  if(mapObj.Map.rpgon){
				 RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
			  }
    	    // RTU.invoke("map.marker.electronicRailClose");
    		if(data.itemData){
    			if(data.type=="edit"||data.type=="anewDraw"){
    				$("#eelectronraildepotPoint-detail-editDiv-tab-stationName").val(data.itemData.elecName);
    				$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName").attr("recId",data.itemData.recId).val(data.itemData.bureauId).attr("b_id",data.itemData.bureauId);
    				$("#eelectronraildepotPoint-detail-editDiv-tab-depotName").text(data.itemData.depotName).attr("d_id",data.itemData.depotId);
    			}else{
    				$("#eelectronraildepotPoint-detail-showDiv-tab-bureauName").text(data.itemData.bureauName);
    				$("#eelectronraildepotPoint-detail-showDiv-tab-depotName").text(data.itemData.depotName);
    				$("#eelectronraildepotPoint-detail-showDiv-tab-stationName").text(data.itemData.elecName);
    				
    			}
    			$("#eelectronraildepotPoint-detail-showDiv-tab-elecNo").text(data.itemData.elecNo);
				$("#eelectronraildepotPoint-detail-showDiv-tab-cjName").text(data.cjName?data.cjName:"");
    			$("#eelectronraildepotPoint-detail-show-tab-remark").val(data.itemData.remark);
				$("#eelectronraildepotPoint-detail-editDiv-tab-remark").val(data.itemData.remark);
				
    			var dataObj="";
    			if(!data.pointType){
    					dataObj =searchOne(data.itemData.recId);
    			}
    			$("#selectElecType option[name='elecType']").each(function(){
		            if($(this).val()==dataObj.pointType){
		            	$(this).val(dataObj.pointType);
		               $(this).attr("selected","selected");
		            }
		        });
    			
    			var type="其它";
				if(dataObj.pointType==1){
					type="机务段";
				}else if(dataObj.pointType==2){
					type="车站";
				}else if(dataObj.pointType==3){
					type="换装点";
				}
				else if(dataObj.pointType==5){
					type="检测点";
				}
				$("#eelectronraildepotPoint-detail-showDiv-tab-pointType").text(type);
    			
        		if(data.itemData.points!=""&&data.type!="anewDraw"){
        			var p=data.itemData.points.split("|");
        			var arr=[];
        			for(var i=0;i<p.length;i++){
        				var poi=p[i].split(",");
        				var pd={
        						Cx:poi[0],
        						Cy:poi[1]
        				};
        				arr.push(pd);
        			}
        			
        			var sendData={
        					arr:arr,
        					lineW:3,
        					lineC:'#FF00FF',
        					lineO:0.7,
        					fillColor:'#FFFF66',
        					fillOpacity:0.3
        			};
        			RTU.invoke("map.marker.electronicRPolygon",sendData);
        		}
    		}else{
    			$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName").val("");
				$("#eelectronraildepotPoint-detail-editDiv-tab-depotName").val("");
				$("#eelectronraildepotPoint-detail-showDiv-tab-bureauName").text("");
				$("#eelectronraildepotPoint-detail-showDiv-tab-depotName").text("");
				var bureauObj =RTU.invoke("app.eelectronraildepot.searchBureau",window.userData.mybureau);
				if(bureauObj){
					$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName").attr("b_id",bureauObj.bId).val(bureauObj.bId);
				}
    		}
    		if($("#eelectronraildepotPoint-detail-editDiv-tab-depotName").text()==""){
				$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","on").attr("src","../static/img/app/failureWarnning-images/failureWarnning-Select.png");
			}else{
				$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","Off").attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");
			}
    	};
    });
    
//    RTU.register("app.eelectronraildepot.query.initDetailInput",function(){
//    	 var initbureauNameAuto = function () {
//         	bureauNameExParams = {
//         			bname: function () {
//                     return $('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').val();
//                 }
//             };
//             bureauNameParse = function (data) {
//                 data = data.data;
//                 var rows = [];
//                 var len = data.length;
//                 for (var i = 0; i < len; i++) {
//                     var text = replaceSpace(data[i].text);
//                     var id = replaceSpace(data[i].id);
//                     rows[rows.length] = {
//                         data: text,
//                         value: text+"-"+id,
//                         result: text
//                     };
//                 }
//                 return rows;
//             };
//             RTU.autocompleteBuilder($("#eelectronraildepotPoint-detail-editDiv-tab-bureauName"), "bureau/findByShortname", bureauNameExParams, bureauNameParse);
//             if ($('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').result)
//                 $('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').result(function (event, autodata, formatted) {
//                 	var arr=formatted.split("-");
//                     $('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').val(arr[0]);
//                     $('#eelectronraildepotPoint-detail-editDiv-tab-bureauName').attr("bureauId",arr[1]);
//                 });
//         };
//         var initdepotNameAuto = function () {
//         	depotNameExParams = {
//         			shortname: function () {
//                     return $('#eelectronraildepotPoint-detail-editDiv-tab-depotName').val();
//                 }
//             };
//         	depotNameParse = function (data) {
//                 data = data.data;
//                 var rows = [];
//                 var len = data.length;
//                 for (var i = 0; i < len; i++) {
//                     var text = replaceSpace(data[i].text);
//                     var id = replaceSpace(data[i].id);
//                     rows[rows.length] = {
//                         data: text,
//                         value: text+"-"+id,
//                         result: text
//                     };
//                 }
//                 return rows;
//             };
//             RTU.autocompleteBuilder($("#eelectronraildepotPoint-detail-editDiv-tab-depotName"), "depot/findByShortname", depotNameExParams, depotNameParse);
//             if ($('#eelectronraildepotPoint-detail-editDiv-tab-depotName').result)
//                 $('#eelectronraildepotPoint-detail-editDiv-tab-depotName').result(function (event, autodata, formatted) {
//                 	var arr=formatted.split("-");
//                     $('#eelectronraildepotPoint-detail-editDiv-tab-depotName').val(arr[0]);
//                     $('#eelectronraildepotPoint-detail-editDiv-tab-depotName').attr("depotId",arr[1]);
//                 });
//         };
//       
//         var replaceSpace = function (text) {
//             if (text) {
//                 var reg = /\s/g;
//                 return text.replace(reg, "");
//             } else {
//                 return "";
//             }
//         };
//         return function (data) {
//             if (timerList1)
//                 clearInterval(timerList1);
//             setTimeout(function () {
//             	initbureauNameAuto();
//                 initdepotNameAuto();
//             }, 500);
//             $("#eelectronraildepotPoint-detail-editDiv-tab-depotName").inputTip({ text: "" });
//             $("#eelectronraildepotPoint-detail-editDiv-tab-bureauName").inputTip({ text: "" });
//         };
//    });
    
 
    
    RTU.register("app.eelectronraildepot.query.deactivate", function () {
        return function () {
        	//关闭查看机车列表
          	$("#locomotiveDepot_grid_content").parent().parent().parent().remove();
        	if(timeDepot){
        		 clearInterval(timeDepot);
        	}
        	if(timeDepotSelect){
        		clearInterval(timeDepotSelect);
        	}
        	if(electronraildepotGrid)
        	electronraildepotGrid.setClickData();
            if (electronraildepot_popuwnd) {
                electronraildepot_popuwnd.close();
            }
            var mapObj = RTU.invoke("map.getMap");
            mapObj.Map.removeEventListener(mapObj.RMapEvent.MouseRightButtonEvent, eventListenerFun);
            
            if(eelectronraildepotPoint){
          	  RTU.invoke("map.marker.removeMarker",eelectronraildepotPoint);
            }
			 var mapObj = RTU.invoke("map.getMap");
			  if(mapObj.Map.rpgon){
				 RTU.invoke("map.marker.removeRPolygon",mapObj.Map.rpgon); 
			  }
			  
			 RTU.invoke("map.marker.electronicRailClose");
			 
			 $(".eelectronraildepot_rightHandDiv").remove();
			 $("#electronraildepot-body-grid").remove();
        };
    });


    RTU.register("app.eelectronraildepot.query.init", function () {
        //var data = RTU.invoke("app.setting.data", "eelectronraildepot");
        //if (data && data.isActive) {
            RTU.invoke("app.eelectronraildepot.query.activate");
       // }
        return function () {
            return true;
        };
    });
});
