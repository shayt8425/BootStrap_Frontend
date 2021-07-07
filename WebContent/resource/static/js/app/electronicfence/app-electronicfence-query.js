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
    require("app/electronicfence/app-electronicfence-detail.js");
    var $html;
    var popuwnd;
    var data;
    var electronrailGrid;
    var timerList;

  var curPoints = []; //全部点的数组
  var o = []; //添加标注中点击绘制区域时画的电子围栏数组

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
            //查询窗口  
            RTU.invoke("app.electronrail.query.loadHtml", { url: "../app/modules/electronicfence/app-electrionicfence-query.html", fn: function (html) {
            	if (!popuwnd) {
                    popuwnd = new PopuWnd({
                        title: "电子围栏",
                        html: html,
                        width: 350,
                        height:480,
                        left: 115,
                        top: 60,
                        shadow: true
                    });
                    popuwnd.remove = popuwnd.close;
                    popuwnd.close = popuwnd.hidden;
                    popuwnd.init();
                }
                else {
                    popuwnd.init();
                }
                return popuwnd;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.electronrail.query.create");
            	RTU.invoke("app.electronrail.query.initTopBtn");
            	RTU.invoke("app.electronrail.query.initBtn");
            	RTU.invoke("app.electronrail.query.initList");
            	
            	 popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
            			RTU.invoke("map.removeCenterCross");
                    	RTU.invoke("app.electronrail.query.removeMarker");
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
                 $(" .electronrail-tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                
                 $(" .electronrail-bodyDiv-sub1").removeClass("hidden");
                 $(" .electronrail-bodyDiv-sub2").addClass("hidden");
                 $(" .electronrail-bodyDiv-sub3").addClass("hidden");
                 popuwnd.setSize(350,480);
                 $(".app_electronrail_tab_div").css("width","346px");
                 $(".electronrail-tab-div1-new").css("width","346px");
                 $(".electronrail-bodyDiv").css("width","345px");
                 RTU.invoke("map.removeCenterCross");
    		});
    		$(".electronrail-tab-start-head").click();
    		$(".electronrail-tab-middle").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .electronrail-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .electronrail-tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
               
                $(" .electronrail-bodyDiv-sub2").removeClass("hidden");
                $(" .electronrail-bodyDiv-sub1").addClass("hidden");
                $(" .electronrail-bodyDiv-sub3").addClass("hidden");
                popuwnd.setSize(270,480);
                $(".app_electronrail_tab_div").css("width","266px");
                $(".electronrail-tab-div1-new").css("width","266px");
                $(".electronrail-bodyDiv").css("width","265px");
                
                $("#electronrail-bodyDiv-sub2-lineNames").inputTip({ text: "" });
                $("#electronrail-bodyDiv-sub2-PlineName").inputTip({ text: "" });
                RTU.invoke("map.addCenterCross");
                RTU.invoke("app.electronrail.query.removeMarker");
    		});
    		
    		$(".electronrail-tab-end-div").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .electronrail-tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .electronrail-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
               
                $(" .electronrail-bodyDiv-sub3").removeClass("hidden");
                $(" .electronrail-bodyDiv-sub2").addClass("hidden");
                $(" .electronrail-bodyDiv-sub1").addClass("hidden");
                popuwnd.setSize(270,480);
                $(".app_electronrail_tab_div").css("width","266px");
                $(".electronrail-tab-div1-new").css("width","266px");
                $(".electronrail-bodyDiv").css("width","265px");
                
                $("#electronrail-sub3-lineName").inputTip({ text: "" });
                $("#electronrail-bodyDiv-sub3-PlineName").inputTip({ text: "" });
                RTU.invoke("map.addCenterCross");
                RTU.invoke("app.electronrail.query.removeMarker");
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
        var initsub3lineNameAuto = function () {//线路
        	lineNameExParams = {
        			lName: function () {
        				return $('#electronrail-sub3-lineName').val();
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
        	RTU.autocompleteBuilder($("#electronrail-sub3-lineName"), "line/findByLName", lineNameExParams, lineNameParse);
        	if ($('#electronrail-sub3-lineName').result)
        		$('#electronrail-sub3-lineName').result(function (event, autodata, formatted) {
        			var arr=formatted.split("-");
        			$('#electronrail-sub3-lineName').val(arr[0]);
        			$('#electronrail-sub3-lineName').attr("lineNo",arr[1]);
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
        var initsub3lineNameAuto1 = function () {//线路
            lineNameExParams = {
                lName: function () {
                    return $('#electronrail-bodyDiv-sub3-PlineName').val();
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
            RTU.autocompleteBuilder($("#electronrail-bodyDiv-sub3-PlineName"), "line/findByLName", lineNameExParams, lineNameParse);
            if ($('#electronrail-bodyDiv-sub3-PlineName').result)
                $('#electronrail-bodyDiv-sub3-PlineName').result(function (event, autodata, formatted) {
                	var arr=formatted.split("-");
                    $('#electronrail-bodyDiv-sub3-PlineName').val(arr[0]);
                    $('#electronrail-bodyDiv-sub3-PlineName').attr("lineNo",arr[1]);
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
                initsub3lineNameAuto();
                initsub2lineNameAuto1();
                initsub3lineNameAuto1();
            }, 500);
            $("#electronrail-lineName").inputTip({ text: "" });
            $("#electronrail-bodyDiv-sub2-lineName").inputTip({ text: "" });
            $("#electronrail-sub3-lineName").inputTip({ text: "" });
            $("#electronrail-bodyDiv-sub2-PlineName").inputTip({ text: "" });
            $("#electronrail-bodyDiv-sub3-PlineName").inputTip({ text: "" });
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
    
    //清空第三个tab的输入框
    RTU.register("app.electronrail.query.clearTab3Add",function(){
    	return function(){
    		$("#electronrail-sub3-timeType").val("1");
    		$("#electronrail-sub3-beginkiloSign").val("");
    		$("#electronrail-sub3-endKiloSign").val("");
    		$("#electronrail-sub3-lineNames").val("");
    		$("#electronrail-sub3-beginTime").val("");
    		$("#electronrail-sub3-endTime").val("");
    		$("input[name='electronrail-sub3-upDown']").each(function(){
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
    			var checkeds=electronrailGrid.selectItem();
    			if(checkeds.length==0){
    				RTU.invoke("header.notice.show", "请选择电子围栏。。");
    			}else if(checkeds.length>1){
    				RTU.invoke("header.notice.show", "只能选择一个电子围栏。。");
    			}else{
    				var data=$(checkeds[0]).data("itemData");
    				data.isupdate=true;
    				RTU.invoke("app.electronrail.query.addMarker",data);
    			}
    		});
    		//tab1删除
			$("#electronrail-sub1-button3").unbind("click").click(function(){
				var checkeds=electronrailGrid.selectItem();
				 RTU.invoke("header.roleAlarmMsg.show","确定删除？");
				 $("#roleAlarmSureBtn").click(function () {
       	             $("#roleAlarmDiv").addClass("hidden");
	       	          $.each(checkeds, function (i, item) {
	     	   			 var data=$(item).data("itemData");
	     	   			 var url="electronic/deleteElectronrail?id="+data.id;
	     	   			 var param={
	     	                   url: url,
	     	                   cache: false,
	     	                   asnyc: true,
	     	                   datatype: "json",
	     	                   success: function (data) {
	     	                	  RTU.invoke("header.notice.show", "删除成功。。...");
	     	                	  RTU.invoke("app.electronrail.query.removeMarker");
	     	                	  RTU.invoke("app.electronrail.query.initList");
	     	                	  staticSaveData("ElectronicVersion", "1");
	     	                      RTU.invoke("map.railWayElectronicfence", {});
	     	                   },
	     	                   error: function () {
	     	                   }
	     	                 };
	     	              RTU.invoke("core.router.get", param);
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
			//tab3定位
			$("#electronrail-sub3-button1").unbind("click").click(function(){
				RTU.invoke("app.electronrail.query.sub3.searchPosition");
			});
			//tab3添加
			$("#electronrail-sub3-button2").unbind("click").click(function(){
				RTU.invoke("app.electronrail.query.sub3.addMarker");
				
			});
    	};
    });
    
    //得到第二个tab数据
    function sub2Conditions(){
    	var data={};
    	data.lineName=($("#electronrail-bodyDiv-sub2-PlineName").val()||"");
    	data.lineNo=($("#electronrail-bodyDiv-sub2-PlineName").attr("lineNo")||"");
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
    
    //定位
    RTU.register("app.electronrail.query.sub2.searchPosition",function(){
    	return function(){
    		var conditions=sub2Conditions();
    		if(conditions){
    			RTU.invoke("header.msg.show", "正在定位。。");
    			var ks =parseInt(conditions.kiloSign * 1000);
    			var url="railWay/glbFindAll?lineNo="+conditions.lineNo+"&lineName="+conditions.lineName+"&upOrDown="+conditions.upDown+"&glb="+ks+"";
    			var param={
    					url: url,
    					cache: false,
    					asnyc: true,
    					datatype: "json",
    					success: function (data) {
    						RTU.invoke("header.msg.hidden");
    						if(data.data){
    							if(data.data.lng!=0&&data.data.lat!=0){
    								RTU.invoke("map.setCenter", { lng: data.data.lng, lat: data.data.lat });
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
    
    //得到第三个tab数据
    function sub3Conditions(){
    	var data={};	  
    	data.lineName=($("#electronrail-bodyDiv-sub3-PlineName").val()||"");
    	data.lineNo=($("#electronrail-bodyDiv-sub3-PlineName").attr("lineNo")||"");
    	data.kiloSign=($("#electronrail-bodyDiv-sub3-PkiloSign").val()||"");
    	var str="";
		var radio=$("input[name='electronrail-bodyDiv-sub3-PupDown'");
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
    //定位
    RTU.register("app.electronrail.query.sub3.searchPosition",function(){
    	return function(){
    		var conditions=sub3Conditions();
    		if (conditions) {
    			RTU.invoke("header.msg.show", "正在定位。。");
    			var ks =parseInt(conditions.kiloSign * 1000);
				var url="railWay/glbFindAll?lineNo="+conditions.lineNo+"&lineName="+conditions.lineName+"&upOrDown="+conditions.upDown+"&glb="+ks+"";
	    		var param={
	    				url: url,
	    				cache: false,
	    				asnyc: true,
	    				datatype: "json",
	    				success: function (data) {
	    					RTU.invoke("header.msg.hidden");
	    					if(data.data){
	    						if(data.data.lng!=0&&data.data.lat!=0){
	                   			 RTU.invoke("map.setCenter", { lng: data.data.lng, lat: data.data.lat });
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
    
    //初始化tab1查询列表
    RTU.register("app.electronrail.query.initList",function(){
    	var getConditions=function(){
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
    		 upDownStr=upDownStr.substring(0, upDownStr.length-1);
    		 
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
    		if(data&&data.length>0){
    			showData=data;
    		}
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
    				that.pageSize =3000;
    			},
                isShowRefreshControl:false,
                selectTrEvent: function (t, currClickItem) {
                	if($(currClickItem).attr("checked")=="checked"){
                		var thisData = currClickItem.data("itemData");
                		thisData.isupdate=false;
                     	RTU.invoke("app.electronrail.query.clickcheckbox", thisData);
                	}else{
                		RTU.invoke("app.electronrail.query.removeMarker");
                	}
                	
                },
                clickTrEvent: function (d, ckb) {
                	 var fd = electronrailGrid.currClickItem().data;
                	 
	                  RTU.invoke("app.electronrail.query.clickcheckbox", fd);
                },
                //               1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
                replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                	 if (data == "1") {
                         return "临时限速";
                     } else if (data == "2") {
                         return "防洪防汛";
                     }
                }
                }],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");

                },
                colNames: ["标准类型", "线路", "开始时间",  "结束时间"],
                colModel: [{ name: "type", width: "80px", isSort: true }, { name: "lineName", width: "80px", isSort: true }, { name: "beginDateStr", width: "92.5px", isSort: true }, { name: "endDateStr", width: "92.5px", isSort: true}]
            });
    	};
    	return function(){
    		var conditions=getConditions();
    		var url="electronic/queryElectronic?type="+conditions.type+"&lineNo="+conditions.lineNo+"&upDown="+conditions.upDown+"&beginDate="+conditions.beginTime+"&endDate="+conditions.endTime;

             var param={
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "json",
                   success: function (data) {

                       refreshFun(data.data);
                   },
                   error: function () {
                   }
                 };
                RTU.invoke("core.router.get", param);
    	};
    });
    
  //点击复选框，在地图上出现
  RTU.register("app.electronrail.query.clickcheckbox", function () {
      return function (clickData) {
              //设置中心点
             RTU.invoke("map.setCenter", { lng: clickData.longitude, lat: clickData.latitude });
             //在地图上添加点
             clickData.isupdate=false;
             RTU.invoke("app.electronrail.query.addMarker",clickData);
      };
  });
  
  /**
   * ***********************************************************************
   */
  //tab2添加”临时限速“电子围栏
  RTU.register("app.electronrail.query.sub2.addMarker",function(){
	  var getParams=function(){
		  var data={};
		  data.limitSpeed=$("#electronrail-bodyDiv-sub2-limitSpeed").val();
		  data.beginKiloSign=$("#electronrail-bodyDiv-sub2-beginKiloSign").val();
		  data.endKiloSign=$("#electronrail-bodyDiv-sub2-endKiloSign").val();
		  data.lineNo=($("#electronrail-bodyDiv-sub2-lineNames").attr("lineno")||"");
		  data.lineName=($("#electronrail-bodyDiv-sub2-lineNames"));
		  if(data.lineName==""){
			  data.lineNo=="";
		  }
		  data.beginTime=$("#electronrail-bodyDiv-sub2-beginTime").val();
		  data.endTime=$("#electronrail-bodyDiv-sub2-endTime").val();
		  data.upDown=$("input[name='electronrail-bodyDiv-sub2-upDown']:checked").val();
		  return data;
	  };
	  return function(){
		  var params=getParams();
		  if(params.limitSpeed==""){
			  RTU.invoke("header.alarmMsg.show","请输入限速值");
			  return false;
		  }else if(params.beginKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始里程");
			  return false;
		  }else if(params.endKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束里程");
			  return false;
		  }else if(params.lineNo==""){
			  RTU.invoke("header.alarmMsg.show","请输入线路");
			  return false;
		  }else if(params.beginTime==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始时间");
			  return false;
		  }else if(params.endTime==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束时间");
			  return false;
		  }else{
			  RTU.invoke("header.msg.show", "保存中,请稍后!!!");
			  var center=RTU.invoke("map.getCenter");
			  var url="electronic/electronicSpeed?type=1&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign+
					  "&upDown="+params.upDown+"&limitSpeed="+params.limitSpeed+"&lineNo="+params.lineNo+"&longitude="+center.Cx+"&latitude="+center.Cy+
					  "&beginDate="+params.beginTime+"&endDate="+params.endTime+"";
			  var param={
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "jsonp",
                   success: function (data) {
                	   var sendData={
                			   id:data.data
                	   }
                     RTU.invoke("app.electronrail.query.addMarker",sendData);
                	   RTU.invoke("app.electronrail.query.clearTab2Add");
                	   RTU.invoke("header.notice.show", "添加成功。。");
                	   RTU.invoke("header.msg.hidden");
                	   staticSaveData("ElectronicVersion", "1");
                       RTU.invoke("map.railWayElectronicfence", {});
                	   
                   },
                   error: function () {
                	   RTU.invoke("header.msg.hidden");
                   }
                 };
                RTU.invoke("core.router.get", param);
		  }
	  };
  });
  
  //tab3添加“防洪防汛”电子围栏
  RTU.register("app.electronrail.query.sub3.addMarker",function(){
	  var getParams=function(){
		  var data={};
		  data.timeType=$("#electronrail-sub3-timeType").val();
		  data.beginKiloSign=$("#electronrail-sub3-beginkiloSign").val();
		  data.endKiloSign=$("#electronrail-sub3-endkiloSign").val();
		  data.lineNo=($("#electronrail-sub3-lineName").attr("lineno")||"");
		  data.lineName=($("#electronrail-sub3-lineName"));
		  if(data.lineName==""){
			  data.lineNo=="";
		  }
		  data.beginTime=$("#electronrail-sub3-beginTime").val();
		  data.endTime=$("#electronrail-sub3-endTime").val();
		  data.upDown=$("input[name='electronrail-sub3-upDown']:checked").val();
		  return data;
	  };
	  return function(){
		  var params=getParams();
		  if(params.beginKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始里程");
			  return false;
		  }else if(params.endKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束里程");
			  return false;
		  }else if(params.lineNo==""){
			  RTU.invoke("header.alarmMsg.show","请输入线路");
			  return false;
		  }else if(params.beginTime==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始时间");
			  return false;
		  }else if(params.endTime==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束时间");
			  return false;
		  }else{
			  RTU.invoke("header.msg.show", "保存中,请稍后!!!");
			  var center=RTU.invoke("map.getCenter");
			  var url="electronic/electronicFlood?type=2&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign+
					  "&upDown="+params.upDown+"&limitTime="+params.timeType+"&lineNo="+params.lineNo+"&longitude="+center.Cx+"&latitude="+center.Cy+
					  "&beginDate="+params.beginTime+"&endDate="+params.endTime+"";
			    var param={
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "jsonp",
                   success: function (data) {
                	   var sendData={
                			   id:data.data
                	   }
                	   RTU.invoke("app.electronrail.query.addMarker",sendData);
                	   RTU.invoke("app.electronrail.query.clearTab3Add");
                	   RTU.invoke("header.notice.show", "添加成功。。");
                	   RTU.invoke("header.msg.hidden");
                	   staticSaveData("ElectronicVersion", "1");
                       RTU.invoke("map.railWayElectronicfence", {});
                   },
                   error: function () {
                	   RTU.invoke("header.msg.hidden");
                   }
                 };
                RTU.invoke("core.router.get", param);
		  }
	  };
  });
    
    RTU.register("app.electronrail.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.close();
            }
        	RTU.invoke("map.removeCenterCross");
        	RTU.invoke("app.electronrail.query.removeMarker");
        };
    });

    RTU.register("app.electronrail.query.init", function () {
        data = RTU.invoke("app.setting.data", "electronrail");
        if (data && data.isActive) {
            RTU.invoke("app.electronrail.query.activate");
        }
        return function () {
         
        };
    });
    //保存系统设置
    function staticSaveData(options, value) {
        $.ajax({
            url: "../syssetting/updateObjByProperty?userid=-1&options=" + options + "&optionvalue=" + value + "&type=1&r=" + new Date().getTime(),
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
            }
        });
    }
});
