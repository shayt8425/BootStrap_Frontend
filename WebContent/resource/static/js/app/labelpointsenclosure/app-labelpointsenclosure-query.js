RTU.DEFINE(function (require, exports) {
/**
 * 模块名：标注点围栏--query
 * name：labelpointsenclosure
 * date:2015-12-21
 * version:1.0 
 */
	require("app/home/app-map-track.js");
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/labelpointsenclosure/app-labelpointsenclosure.css");
	require("../../../css/app/labelpointsenclosure/app-labelpointsenclosure-detail.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("My97DatePicker/WdatePicker.js");
    require("popuwnd/js/popuwnd.js");
    require("app/home/app-map.js");
    require("app/labelpointsenclosure/app-labelpointsenclosure-query-detail.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-query.js");
    var $html;
    var labelpointsenclosure_popuwnd;
    var data;
    var o = []; //添加标注中点击绘制区域时画的电子围栏数组
    var anchor_LabelpointsenclosurePoint;//定位点图标
    
    
    RTU.register("app.labelpointsenclosure.query.loadHtml", function () {
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
    //1查询窗口
    RTU.register("app.labelpointsenclosure.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口  
            RTU.invoke("app.labelpointsenclosure.query.loadHtml", { url: "../app/modules/labelpointsenclosure/app-labelpointsenclosure-query.html", fn: function (html) {
            	if (!labelpointsenclosure_popuwnd) {
            		labelpointsenclosure_popuwnd = new PopuWnd({
                        title: "标注点",
                        html: html,
                        width: 350,
                        height:480,
                        left: 10,
                        top: 60,
                        shadow: true
                    });
            		labelpointsenclosure_popuwnd.remove = labelpointsenclosure_popuwnd.close;
            		labelpointsenclosure_popuwnd.close = labelpointsenclosure_popuwnd.hidden;
            		labelpointsenclosure_popuwnd.init();
                }
                else {
                	labelpointsenclosure_popuwnd.close();
                	labelpointsenclosure_popuwnd.html(html);
                	labelpointsenclosure_popuwnd.init();
                }
                return labelpointsenclosure_popuwnd;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.labelpointsenclosure.query.create");//局 线  查询
            	RTU.invoke("app.labelpointsenclosure.query.initTopBtn");//头部切换
//            	RTU.invoke("app.labelpointsenclosure.query.initList");//列表数据显示
            	RTU.invoke("app.labelpointsenclosure.query.initBtn");//按钮事件
//            	RTU.invoke("app.labelpointsenclosure.rightHandMap.init");//右键添加标注点
            	labelpointsenclosure_popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                    	RTU.invoke("app.labelpointsenclosure.query.deactivate");
            	 });
            }
            });
        };
    });
    
    
     //2头部tab切换
    RTU.register("app.labelpointsenclosure.query.initTopBtn",function(){
    	return function(){
    		$(".labelpointsenclosure-tab-start-head").unbind("click").click(function(){
    			 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                 $(" .labelpointsenclosure-tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                
                 $(" .labelpointsenclosure-bodyDiv-sub1").removeClass("hidden");
                 $(" .labelpointsenclosure-bodyDiv-sub2").addClass("hidden");
                 labelpointsenclosure_popuwnd.setSize(350,400);
                 $(".app_labelpointsenclosure_tab_div").css("width","346px");
                 $(".labelpointsenclosure-tab-div1-new").css("width","346px");
                 $(".labelpointsenclosure-bodyDiv").css("width","345px");
                 RTU.invoke("app.labelpointsenclosure.query.initList");//列表数据显示
    		});
    		$(".labelpointsenclosure-tab-start-head").click();
    		$(".labelpointsenclosure-tab-middle").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .labelpointsenclosure-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
               
                $(" .labelpointsenclosure-bodyDiv-sub2").removeClass("hidden");
                $(" .labelpointsenclosure-bodyDiv-sub1").addClass("hidden");
                labelpointsenclosure_popuwnd.setSize(350,235);
                $(".app_labelpointsenclosure_tab_div").css("width","346px");
                $(".labelpointsenclosure-tab-div1-new").css("width","346px");
                $(".labelpointsenclosure-bodyDiv").css("width","345px");
                
                $("#labelpointsenclosure-bodyDiv-sub2-lineNames").inputTip({ text: "" });
                $("#labelpointsenclosure-bodyDiv-sub2-PlineName").inputTip({ text: "" });
    		});
    	};
    });
  
    //3
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
    
    //4铁路局    线路查询
    RTU.register("app.labelpointsenclosure.query.create", function () {
            var initbureauNameAuto = function () {//路局
            	bureauNameExParams = {
            			bname: function () {
                        return $('#labelpointsenclosure-bureauName').val();
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
                RTU.autocompleteBuilder($("#labelpointsenclosure-bureauName"), "bureau/findByShortname", bureauNameExParams, bureauNameParse);
                if ($('#labelpointsenclosure-bureauName').result)
                    $('#labelpointsenclosure-bureauName').result(function (event, autodata, formatted) {
                    	var arr=formatted.split("-");
                        $('#labelpointsenclosure-bureauName').val(arr[0]);
                        $('#labelpointsenclosure-bureauName').attr("bureauId",arr[1]);
                    });
            };
            
            var initsub2lineNameAuto = function () {//线路
                lineNameExParams = {
                    lName: function () {
                        return $('#labelpointsenclosure-bodyDiv-sub2-PlineName').val();
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
                RTU.autocompleteBuilder($("#labelpointsenclosure-bodyDiv-sub2-PlineName"), "line/findByLName", lineNameExParams, lineNameParse);
                if ($('#labelpointsenclosure-bodyDiv-sub2-PlineName').result)
                    $('#labelpointsenclosure-bodyDiv-sub2-PlineName').result(function (event, autodata, formatted) {
                    	var arr=formatted.split("-");
                        $('#labelpointsenclosure-bodyDiv-sub2-PlineName').val(arr[0]);
                        $('#labelpointsenclosure-bodyDiv-sub2-PlineName').attr("lineNo",arr[1]);
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
                setTimeout(function () {
                	initbureauNameAuto();
                	initsub2lineNameAuto();
                }, 500);
                $("#labelpointsenclosure-bureauName").inputTip({ text: "" });
            };
        
    });
    
  //6定位
    RTU.register("app.labelpointsenclosure.query.sub2.searchPosition",function(){
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
    								anchor_LabelpointsenclosurePoint = RTU.invoke("app.labelpointsenclosure.query.addMarkerLocatin", { lng: data.data.lng, lat: data.data.lat });
    								RTU.invoke("app.labelpointsenclosure.query.setTabHtml", anchor_LabelpointsenclosurePoint);
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
    
    //7得到第二个tab数据
    function sub2Conditions(){
    	var data={};
    	data.lineName=($("#labelpointsenclosure-bodyDiv-sub2-PlineName").val()||"");
    	data.lineNo = ($("#labelpointsenclosure-bodyDiv-sub2-PlineName").attr("lineNo")||"");
    	data.kiloSign=($("#labelpointsenclosure-bodyDiv-sub2-PkiloSign").val()||"");
    	var str="";
    		var radio=$("input[name='labelpointsenclosure-bodyDiv-sub2-PupDown'");
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
    
    
  
    
	  //退出
    RTU.register("app.labelpointsenclosure.query.deactivate", function () {
        return function () {
            if (labelpointsenclosure_popuwnd) {
            	labelpointsenclosure_popuwnd.close();
            }
            
			$("#labelpointsenclosureTypeDiv").remove();
			$("#labelpointsenclosure-bodyDiv-sub1-body-grid").remove();
			RTU.invoke("app.labelpointsenclosure.close.labGrid");
        	//var mapObj = RTU.invoke("map.getMap");
    		//mapObj.Map.removeEventListener(mapObj.RMapEvent.MouseRightButtonEvent, rightEventListener);
        };
    });

    RTU.register("app.labelpointsenclosure.query.init", function () {
       // var data = RTU.invoke("app.setting.data", "labelpointsenclosure");
        //if (data && data.isActive) {
            //RTU.invoke("app.labelpointsenclosure.query.activate");
       // }
        return function () {
            return true;
        };
    });
    
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
