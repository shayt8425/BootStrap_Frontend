RTU.DEFINE(function (require, exports) {
/**
 * 模块名：列车跟踪
 * name：realtimelocomotivequery
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-move.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.js");
    //require("app/faultalarmsubsidiary/app-trainalarmstateparticulars-query.js");
    require("../../../css/app/app-search.css");
    require("../../../css/app/moveCurve/moveCurve.css");
    require("app/curve/moveCurve/moveCurve.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-lkj-query.js");
    require("app/home/app-home.js");
    //新一代新加代码
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-trainalarm.js");
    require("app/lkj15limitinfo/app-lkj15limitinfo-query.js");
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-sysquery.js");
    // 位置用于循环显示
    var localTopLeft = [{ top: 60, left: 450, isShowP: true }, { top: 60, left: 960, isShowP: false }, { top: 480, left: 450, isShowP: false }, { top: 480, left: 960, isShowP: false}];
    localTopLeft.next = function () {
        var showIndex = localTopLeft.getNowShowIndex();
        for (var i = 0; i < localTopLeft.length; i++) {
            localTopLeft[i].isShowP = false;
        }
        localTopLeft[showIndex].isShowP = false;
        if (showIndex == localTopLeft.length - 1) {
            showIndex = -1;
        }
        localTopLeft[showIndex + 1].isShowP = true;
        return localTopLeft[showIndex + 1];
    };
    localTopLeft.Default = function () {
        for (var i = 0; i < localTopLeft.length; i++) {
            localTopLeft[i].isShowP = false;
        }
        localTopLeft[0].isShowP = true;
    };
    localTopLeft.prev = function () {
        var showIndex = localTopLeft.getNowShowIndex();
        for (var i = 0; i < localTopLeft.length; i++) {
            localTopLeft[i].isShowP = false;
        }
        var id = showIndex - 1;
        if (id < 0) {
            id = 0;
        }
        localTopLeft[id].isShowP = true;
    };
    localTopLeft.getNowShowIndex = function () {
        for (var i = 0; i < localTopLeft.length; i++) {
            if (localTopLeft[i].isShowP == true)
                return i;
        }
    };
    localTopLeft.getLTobj = function () {
        var nowIndex = localTopLeft.getNowShowIndex();
        var item = localTopLeft[nowIndex];
        localTopLeft.next();
        return item;
    }
    var $html;//查询窗口机车页面
    var popuwnd;//机车查询
    var movewnd;// 运行曲线
    var trainwnd;// 机车信息
    var resultwnd;
    var mutimovewnd = []; // 列表曲线窗体，数组
    var infowndwidth = 500;
    var infowndheight = 100;
    var offset;
    var data;
    var timer;
    var timerList;
    RTU.timerquery = null;
    var boxes = null;
    var AllReqData = []; //总体数据变量
    var url = "";
    window.attention = true;//当前列表是否为查询列表
    var timerLock = false;
    /**
     * 机车查询模块-加载初始化
     * 
     */
    RTU.register("app.realtimelocomotivequery.query.init", function () {
        return function () {
        	RTU.invoke("core.router.load", {
                url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-query.html",
                success: function (html) {
                    $html = html;
                    if (popuwnd) {
                        popuwnd.html($html); 
                        RTU.invoke("app.realtimelocomotivequery.query.create", $html);
                        try{
                        	$("#trainStr").inputTip({ text: "" });
                        }catch(e){
                        }
                        try{
                        	$("#lineName").inputTip({ text: "" });
                        }catch(e){
                        }
                        try{
                        	$(".checiNameInput").inputTip({ text: "" });
                        }catch(e){
                        }
                        try{
                        	$("#sName").inputTip({ text: "" });
                        }catch(e){
                        }
                    } else { 
                        RTU.invoke("app.realtimelocomotivequery.query.activate");
                    }
                    
                }
            });
            return true;
        };
    });
    /*
     * 机车列表权限控制
     */
    function locoRight(){
    	//top.FrontCommon.hasRight(top.settingData,"030"+type)
    	var buttons = $("a[class='app_rt_button tip_button']");
    	
    	if(!top.FrontCommon.hasRight(top.settingData,"0302")){
    		for(var i in buttons){
        		if($.trim(buttons[i].text)=='运行曲线'){
        			buttons.eq(i).hide();
        		}
        	} 
    	}
    	if(!top.FrontCommon.hasRight(top.settingData,"0303")){
    		for(var i in buttons){
        		if($.trim(buttons[i].text)=='文件上传'){
        			buttons.eq(i).hide();
        		}
        	} 
    	}
    	if(!top.FrontCommon.hasRight(top.settingData,"0304")){
    		for(var i in buttons){
        		if($.trim(buttons[i].text)=='文件下载'){
        			buttons.eq(i).hide();
        		}
        	} 
    	}
    	if(!top.FrontCommon.hasRight(top.settingData,"0306")){
    		for(var i in buttons){
        		if($.trim(buttons[i].text)=='运行记录'){
        			buttons.eq(i).hide();
        		}
        	} 
    	}
    	if(!top.FrontCommon.hasRight(top.settingData,"0307")){
    		for(var i in buttons){
        		if($.trim(buttons[i].text)=='关注'){
        			buttons.eq(i).hide();
        		}
        	} 
    	}   	 
    }
    /**
     *创建:机车查询窗口
     */
    RTU.register("app.realtimelocomotivequery.query.activate", function () {
        return function () { 
        //	RTU.invoke("header.msg.hidden");
          //  RTU.invoke("map.show");
           // var offset = RTU.invoke("navigation.item.offset", data?data.name:"realtimelocomotivequery");
            if(!popuwnd){
	            popuwnd = new PopuWnd({
	                title: data?data.alias:"实时追踪",
	                html: $html,
	                width: 395,
	                height: 490,
	                left: 0,
	                top: 30,
	                shadow: true
	            });
            }else{
            	popuwnd.close();
            	popuwnd.$html;
            }
            popuwnd.init();
            popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                window.psModel.cancelScribe("refreshData", window.refreshNum);
                window.psModel.cancelScribe("refreshData", window.allListRefresh);
                window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", []);
                
                window.psModel.runControl("refreshData", window.homeTimer, true);
                psModel.searchNow({ token: window.homeTimer });
                RTU.invoke("map.marker.clearSelectPointCss");
                RTU.invoke("map.marker.hideCarMarker");
                if(top.getUserSettingValue("ShowOffLineLoco")=="0"){
            		for(var m=0;m<window.trItem.allData.length;m++){
            			if(window.trItem.allData[m].state=="1"){//只显示在线
            				RTU.invoke("map.marker.showSomeCarMarker", 
            						window.trItem.allData[m].locoTypeStr);
            			}
            		}
            	}else {
            		for(var m=0;m<window.trItem.allData.length;m++){
            			RTU.invoke("map.marker.showSomeCarMarker", window.trItem.allData[m].locoTypeStr);
            		}
            	}
            });
            $(".realtime-outDiv", popuwnd.$wnd).show();
            $(".raltime_rt_button_div", popuwnd.$wnd).show();
            window.RealtimeAttentionList = null;
            
            //点击tab的列表选项
            $(".raltime_basic-tab-div").click(function () {
            	$(this).addClass("active");
                $(" .raltime_attention-tab-div").removeClass("active");
                $(" .raltime_rt_div").removeClass("hidden");
                $(" .attention_div").addClass("hidden");
                $(".app_rt_raltime_attention_but").text("添加关注");
                window.attention = true;
            });
            $(".raltime_basic-tab-div").click(); //每次进入显示列表页面
            RTU.invoke("app.realtimelocomotivequery.query.create", $html);
            locoRight();//机车信息权限控制
            
        };
    });
/*
    //控制放大缩小
    RTU.register("app.realtimelocomotivequery.query.toggleSize", function () {
        return function () {
            var delbtn = $(".popuwnd-title-del-btn", popuwnd.$wnd);
            //delbtn.addClass("popuwnd-title-del-btn2").css({ right: "-2px", top: "0px", height: "30px", width: "33px" });
            delbtn.parent().append("<div class='amplifyWin'></div>");
            var btn = $(".amplifyWin", delbtn.parent()).addClass("amplifyWin_larger");

            btn.click(function () {
                btn.outDiv = $(".realtime-outDiv", popuwnd.$wnd);
                btn.button_div = $(".raltime_rt_button_div-outDiv", popuwnd.$wnd);
                if (btn.hasClass("amplifyWin_larger")) {//缩小
                    btn.removeClass("amplifyWin_larger").addClass("amplifyWin_small");
                    popuwnd.setSize(375, 5);
                    btn.outDiv.hide();
                    btn.button_div.hide();
                } else {//放大
                    btn.removeClass("amplifyWin_small").addClass("amplifyWin_larger");
                    popuwnd.setSize(375, 540);
                    btn.outDiv.show();
                    btn.button_div.show();
                    setTimeout(function () {
                        psModel.searchNow({ token: window.allListRefresh });
                    }, 20);
                }
            });
        
        };
    });*/


    function autocompleteBuilder(object, url, exParams, parse) {
        try {
            url = "../" + url;
            object.autocomplete(url, {
                minChars: 0,
                width: 110,
                matchContains: true,
                autoFill: false,
                matchCase: true,
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
    }
    RTU.autocompleteBuilder = function (object, url, exParams, parse) {
        try {
            url = "../" + url;
            object.autocomplete(url, {
                minChars: 0,
                width: 110,
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
            }).result(function (event, data, formatted){
//            	$("#trainStr").attr("locono","999");
            });
        } catch (e) {
        }
    };

   /**
    * 创建:查询窗口页面内容
    */
    RTU.register("app.realtimelocomotivequery.query.create", function () {
        var inittrainStrAuto = function () {//机车
            trainStrExParams = {
                shortName: function () {
                    var val = RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $('#trainStr').val());
                    return val.locoTypeName;
                },
                locoNo: function () {
                    var val = RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $('#trainStr').val());
                    return val.locoNo;
                }
            };
            trainStrParse = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                	var text1 = replaceSpace(data[i].locoTypeName);
                    var text2 = replaceSpace(data[i].locoNo); 
                    var text3 = replaceSpace(data[i].locoAb); 
                    var loco_No=text3;
                    if (text2 != "") {
                        text2 = "-" + text2;
                        text3=RTU.invoke("app.locoAb.getChar",text3);
                    }
                    else{
                    	text3="";
                    	loco_No="";
                    }
                    var text = text1 + text2 + text3;
                    rows[rows.length] = {
                        data: text,
                        value: text+"_"+loco_No,
                        result: text
                    };
                }
                return rows;
            };
            //车次提示框
            RTU.autocompleteBuilder($("#trainStr"), "traintype/searchByLocoTypeAndLocoNo", trainStrExParams, trainStrParse);
            if ($('#trainStr').result)
                $('#trainStr').result(function (event, autodata, formatted) {
                	var arr=formatted.split("_");
                    $('#trainStr').val(arr[0]);
                    $('#trainStr').attr("locoAb",arr[1]);//添加一个属性  机车AB节
                });
        };
        var initlineNameAuto = function () {//线路
            lineNameExParams = {
                lName: function () {
                    return $('#lineName').val();
                }
            };
            lineNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i].text);
                    rows[rows.length] = {
                        data: data[i],
                        value: data[i],
                        result: text
                    };
                }
                return rows;
            };
            try {
                
                $("#lineName").autocomplete("../line/findByLName", {
                    minChars: 0,
                    width: 110,
                    matchContains: true,
                    autoFill: false,
                    max: 100,
                    dataType: "jsonp",
                    extraParams: lineNameExParams,
                    parse:lineNameParse,
                    formatItem: function (item) {
                        return item.text;
                    },
                    formatMatch: function (item) {
                        return item.text;
                    },
                    formatResult: function (format) {
                        return format.text;
                    }
                }).result(function (event, data, formatted){
//                	$("#trainStr").attr("locono","999");
                });
                if ($('#lineName').result){
                	$('#lineName').result(function (event, autodata, formatted) {
                        $('#lineName').val(formatted.text);
                        $('#lineNo').val(autodata.id);
                    });
                }
                else{
                	$('#lineNo').val("");
                }
            } catch (e) {
            }
        };
        var initCheciNameAuto = function () {//车次
            CheciNameExParams = {
                checiName: function () {
                    return $('#checiName').val();
                }
            };
            CheciNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i]);
                    rows[rows.length] = {
                        data: text,
                        value: text,
                        result: text
                    };
                }
                return rows;
            };
            RTU.autocompleteBuilder($("#checiName"), "onlineloco/findByCheciName", CheciNameExParams, CheciNameParse);
            if ($('#checiName').result)
                $('#').result(function (event, autodata, formatted) {
                    $('#checiName').val(formatted);
                });
        };
        var initStationNameAuto = function () {//局段
            sNameExParams = {
                shortname: function () {
                    return $('#sName').val();
                }
            };
            sNameParse = function (data) {
                data = data.data;
                var rows = [];
                var len = data.length;
                for (var i = 0; i < len; i++) {
                    var text = replaceSpace(data[i].text);
                    rows[rows.length] = {
                        data: text,
                        value: text,
                        result: text
                    };
                }
                return rows;
            };
            RTU.autocompleteBuilder($("#sName"), "depot/findByShortname", sNameExParams, sNameParse);
            if ($('#sName').result)
                $('#sName').result(function (event, autodata, formatted) {
                    $('#sName').val(formatted);
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
                inittrainStrAuto();
                initlineNameAuto();
                initCheciNameAuto();
                initStationNameAuto();
            }, 500);
            try{
            	$("#trainStr").inputTip({ text: "" });
            }catch(e){
            }
            try{
            	$("#lineName").inputTip({ text: "" });
            }catch(e){
            }
            try{
            	$(".checiNameInput").inputTip({ text: "" });
            }catch(e){
            }
            if(top.getUserSettingValue("ShowOffLineLoco")=="0"){//是否显示离线机车
            	$("#online_checkbox").attr("checked","checked");
            }else{
            	$("#online_checkbox").removeAttr("checked");
            }
            try{
            	$("#sName").inputTip({ text: "" });
            }catch(e){
            }
            

            RTU.invoke("app.realtimelocomotivequery.query.initList"); //进入页面初始化列表
            RTU.invoke("app.realtimelocomotivequery.query.initBtnEvent"); //初始化按钮-列表
            /* $("#trainStr,#checiName,#sName,#lineNo").unbind("focus").bind("focus",function(){
            	if($.trim($(this).val()))
            		$("#Button1").click();
            });*/
           // RTU.invoke("app.realtimelocomotivequery.query.initResult");
            
            //文件上传
        //  var data_filetransfer = RTU.invoke("app.setting.data", "filetransfer");
          //文件下载
        //  var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
        //  if (data_filetransfer == null || data_filetransfer == undefined) {
       //       $("#Button4").css("display", "none");
       //   }
       //   if (data_filedownload == null || data_filedownload == undefined) {
      //        $("#Button5").css("display", "none");
     //     }
        };
    });

    //进入页面初始化列表
    RTU.register("app.realtimelocomotivequery.query.initList", function () {
        return function () {
            setTimeout(function () {
            	window.realtimeG=undefined;
            	$("#trainStr").val(locoName);
                $(".app_rt_raltime_commit").click();//查询按钮点击事件
            }, 5);
        };
    });

    //初始化按钮事件
    RTU.register("app.realtimelocomotivequery.query.initBtnEvent", function () {
        return function () {
        	var inputVal="";
    		$('#trainStr').unbind("blur").blur(function(){
    			var val=$(this).val();
    			if(inputVal!=val){
    				$(this).removeAttr("locoab");
    			}
    		});
    		
    		$('#trainStr').unbind("focus").focus(function(){
    			inputVal=$(this).val();
    		});
        	
            //查询
            $(".app_rt_raltime_commit").unbind("click").click(function () {
                window.psModel.runControl("refreshData", window.homeTimer, false);
                window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                var searchobj = {
                    isProPerty: true
                };
                if(window.realtimeG)window.realtimeG.param.datas = [];
                RTU.invoke("app.realtimelocomotivequery.query.search", searchobj);
                psModel.searchNow({ token: window.allListRefresh });
            });
            //回车查询
            var initKeydown = function () {
                document.onkeydown = function (event) {
                    event = (window.event || event);
                    if (event.keyCode == 13 && (event.srcElement.id == "trainStr"||event.srcElement.id == "checiName"||
                         event.srcElement.id == "sName"||event.srcElement.id == "lineName")){
                        $(".app_rt_raltime_commit").click();
                    }
                };
            };
            initKeydown();
            //查询所有
            $(".app_rt_raltime_all").click(function () {
                window.psModel.runControl("refreshData", window.homeTimer, false);
                window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                var searchobj = {
                    isProPerty: false
                };

                //清空输入框
                var aa = $(".inputTip_close").parent();
                $.each($(aa), function (i, n) {
                    var bb = $(n).children()[0];
                    if ($(bb).attr("id") == "trainStr" || $(bb).attr("id") == "lineName" || $(bb).attr("id") == "dName" || $(bb).attr("id") == "carType" || $(bb).attr("id") == "checiName" || $(bb).attr("id") == "sName") {
                        $(bb).parent().children("img[class='inputTip_close']").click();
                    };
                });
                
                $('#trainStr').attr("locoAb","");
                var locationCheckbox=$("input[name='app_rt_kind_location']");
            	var stateCheckbox=$("input[name='app_rt_kind_state']");
            	var useCheckbox=$("input[name='app_rt_kind_use']");
            	var upDownCheckbox=$("input[name='app_rt_kind_upDown']");

            	$.each(locationCheckbox, function (i, item) {
    	   			 if($(item).attr("checked")=="checked"){
    	   				$(item).removeAttr("checked");
    		   		 }
    	         });
            	 $.each(stateCheckbox, function (i, item) {
    	   			 if($(item).attr("checked")=="checked"){
    	   				stateStr=stateStr+$(item).val();
    		   		 }
    	         });
            	 $.each(useCheckbox, function (i, item) {
    	   			 if($(item).attr("checked")=="checked"){
    	   				$(item).removeAttr("checked");
    		   		 }
    	         });
            	 $.each(upDownCheckbox, function (i, item) {
    	   			 if($(item).attr("checked")=="checked"){
    	   				$(item).removeAttr("checked");
    		   		 }
    	         });
                RTU.invoke("app.realtimelocomotivequery.query.search", searchobj);
                psModel.searchNow({ token: window.allListRefresh });
            });

            //列表tab
            $(".raltime_basic-tab-div").unbind("click").click(function () {
            	if (window.popuwndLocoInfo) {
                    window.popuwndLocoInfo.close();
                    window.popuwndLocoInfo=null;
                }
            	//RTU.invoke("header.alarmMsg.hide");
            	//RTU.invoke("header.roleAlarmMsg.hide");
            	$(this).addClass("active");
                $(" .raltime_attention-tab-div").removeClass("active");
                $(" .raltime_rt_div").removeClass("hidden");
                $(" .attention_div").addClass("hidden");
                $(".app_rt_raltime_attention_but").text("添加关注");
                window.attention = true;
                //停掉关注列表的计时器
                window.psModel.runControl("refreshData", window.refreshNum, false);
                window.psModel.runControl("refreshData", window.aroundLocoTimer, false);
                window.psModel.runControl("refreshData", window.thisLineLocoTimer, false);
                window.psModel.runControl("refreshData", window.homeTimer, false);
                if (!window.isAroundLocoList && !window.isThisLineLocoList) {//如果之前列表页面查询数据后，没有查询过附近列车和本线路列车，则直接重新查询所有数据
                    $(".app_rt_raltime_commit").trigger("click");
                } else {//如果之前查询所附近列车和本线路列车，就不重新查询，直接得到之前列表的数据刷新一下
                    psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
                    window.RealtimeRefreshListNotSearch = window.psModel.subscribe("refreshData", function (t, data) {
                        RTU.invoke("map.marker.hideCarMarker");
                        var arr = [];
                        for (var i = 0, len = window.realtimeG.datas.length; i < len; i++) {
                            var item = window.realtimeG.datas[i];
                            var idstr = item.locoTypeName + "-" + item.locoNO+item.locoAb;
                            for (var j = 0; j < data.length; j++) {
                                var d = data[j];
                                if (d.locoTypeStr==item.locoTypeStr) {
                                    arr.push(d);
                                    RTU.invoke("map.marker.showSomeCarMarker",
                                    		d.locoTypeStr);
                                    break;
                                }
                            }
                        }
                        RTU.invoke("", arr);
                        refreshData(window.realtimeG.datas);
                    });
                }
            });

            //关注列表tab
            $(".raltime_attention-tab-div").unbind("click").click(function () {
            	if (window.popuwndLocoInfo) {
                    window.popuwndLocoInfo.close();
                    window.popuwndLocoInfo=null;
                }
            	RTU.invoke("header.alarmMsg.hide");
            	RTU.invoke("header.roleAlarmMsg.hide");
            	$(this).addClass("active");
                $(" .raltime_basic-tab-div").removeClass("active");
                $(" .attention_div").removeClass("hidden");
                $(" .raltime_rt_div").addClass("hidden");
                $(".app_rt_raltime_attention_but").text("取消关注");
                window.attention = false;
                window.psModel.runControl("refreshData", window.allListRefresh, false);
                window.psModel.runControl("refreshData", window.aroundLocoTimer, false);
                window.psModel.runControl("refreshData", window.thisLineLocoTimer, false);
                window.psModel.runControl("refreshData", window.RealtimeRefreshListNotSearch, false);
                window.psModel.runControl("refreshData", window.homeTimer, false);
                if (!window.RealtimeAttentionList) {//如果关注列表不存在，就直接初始化，用作title的显示
                    var data = [];
                    window.RealtimeAttentionList = new RTGrid({
                        datas: window.firstAttentionData,
                        containDivId: "attention_div_grid",
                        tableWidth: 363,
                        tableHeight: 410,
                        isSort: true, //是否排序
                        hasCheckBox: true,
                        showTrNum: false,
                        clickIdItem: "locoTypeid_locoNo_locoAb",
                        beforeLoad:function(that){
             				that.pageSize =3000;
             			},
                        isShowPagerControl: false,
                        loadPageCp: function (t) {
                            t.cDiv.css("left", "204px");
                            t.cDiv.css("top", "204px");
                            $("#attention_div_grid .RTGrid_Bodydiv").css("height", "360px");

                        },
                        selectTrEvent: function (t, currClickItem) {
                         if($(currClickItem).attr("checked")=="checked"){
                            var thisData = currClickItem.data("itemData");
                            var id = thisData.locoTypeStr;
                            RTU.invoke("map.marker.findMarkers", {
                                pointId: id,
                                isSetCenter: true,
                                stopTime: 5000,
                                isShowHighLevel:1,
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
                                window.selectData=thisData;
                                var d = RTU.invoke("app.index.home.formatData", [thisData.data]);
                                //更新或增加该标记点
                                RTU.invoke("app.index.AddOrUpdateMarker", d);
                                
                                RTU.invoke("app.realtimelocomotivequery.query.showMenu",thisData);//显示按钮栏
                                
                            	var id =thisData.data.locoTypeStr;
                                RTU.invoke("map.marker.findMarkers", {
                                    pointId: id,
                                    isSetCenter: true,
                                    stopTime: 5000,
                                    isShowHighLevel:1,
                                    fnCallBack: function () {
                                    }
                                });
                              
                                var lng = thisData.data.longitude;
                                var lat = thisData.data.latitude;
                                if ((lng == 0) || (lat == 0)) {
                                    if ($(".pointTab")) {
                                        $(".pointTab").hide();
                                    }
                                    RTU.invoke("map.marker.clearSelectPointCss");
                                    var $status;
                                  //  if(thisData.data.lkjType!=1){
                                    	RTU.invoke("app.realtimelocomotivequery.query.yxxx");
//                                    } else{
//                                        RTU.invoke("core.router.load", {
//                                            url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
//                                            async: false,
//                                            success: function (status) {
//                                                $status = $(status);
//                                            }
//                                        });
//                                        if (window.popuwndLocoInfo) {
//                                            window.popuwndLocoInfo.close();
//                                            window.popuwndLocoInfo=null;
//                                        }
//                                        window.popuwndLocoInfo = new PopuWnd({
//                                            title: id + "-详情",
//                                            html: $status.html(),
//                                            width: 380,
//                                            height: 510,
//                                            left: 513,
//                                            top: 60,
//                                            shadow: true
//                                        });
//                                        window.popuwndLocoInfo.init();
//                                       
//                                        window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
//                                       	 window.popuwndLocoInfo=null;
//                                        });
//                                        
//                                        var obj = {};
//                                        obj.itemData = thisData.data;
//                                        obj.popuwndLocoInfo = window.popuwndLocoInfo;
//                                        RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
//                                    }

                                    } else {
	                                    if (window.popuwndLocoInfo) {
	                                        window.popuwndLocoInfo.close();
	                                        window.popuwndLocoInfo=null;
	                                    }
	                                    
	                                  //找到之后再更新区域内的其他点
	                                    var d2 = RTU.invoke("app.index.home.formatData", window.trItem.allData);
	                                    //更新标记点
	                                    RTU.invoke("app.index.AddOrUpdateMarker", d2);
	                                }
                            } catch (e) {
                            }
                        },
                        replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                        	 if (data == "1"||data == "2") {
                        		return '<div class="greenLight"></div>'; 
                             } else if (data == "3"||data == "4") {
                            	 return '<div class="yellowLight"></div>';
                             }
                        }
                        }, { index: 2, fn: function (data, j, ctd, itemData) {
                        	return itemData.locoTypeStr;
                        }
                        }, { index: 4, fn: function (data, j, ctd, itemData) {
                            if(itemData.receiveTimeStr){
                               return '<div id="gz_'+itemData.locoTypeStr+'">'+ itemData.lkjTimeStr.substring(5,itemData.lkjTimeStr.length)+'</div>';
                         	   //return itemData.receiveTimeStr.substring(5,itemData.receiveTimeStr.length);
                            }
                         }
                         }],
                        colNames: ["状态", "车次", "机车",  "实速",  "时间"],
                        colModel: [{ name: "isOnline", width: "40", isSort: true }, { name: "checiName", width: "50", isSort: true }, { name: "locoTypeStr", width: "70", isSort: true },  { name: "speed", width: "40", isSort: true },  { name: "receiveTimeStr", isSort: true}]
                    });
                    setTimeout(function () {
                        RTU.invoke("app.realtimelocomotivequery.query.refreshMarker", window.RealtimeAttentionList.datas);
                        RTU.invoke("map.marker.showguDaoMarker");
                    }, 100);
                } else {//如果存在，就刷新地图标注，并刷新列表
                    RTU.invoke("app.realtimelocomotivequery.query.refreshMarker", window.firstAttentionData);
                    RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", window.firstAttentionData);
                }
                //由于关注页面的列表并没有保存到数据，所以查询的时候直接刷新之前列表的数据
                psModel.cancelScribe("refreshData", window.refreshNum);
                window.refreshNum = window.psModel.subscribe("refreshData", function (t, data) {
                	RTU.invoke("map.marker.hideCarMarker");
                    var arr = [];
                    var attentionLocos=RTU.data.user.attentionLocos.split(",");
                    var onlineCount=0;
                    var outlineCount=0;
                    if(attentionLocos.length>0){
                    	var index=0;
                    	for (var j = 0; j < data.length; j++) {
                            var d = data[j];
                            if(RTU.data.user.attentionLocos.indexOf(d.locoTypeStr)!=-1){ 
                                arr.push(d);
                                RTU.invoke("map.marker.showSomeCarMarker",
                                		d.locoTypeStr);
                                index++;
                                if(d.isOnline=="1"||d.isOnline=="2")
                                	onlineCount++;
                                else outlineCount++;
                            }
                            if(index==attentionLocos.length)break;
                        }
                    }
                    $("#realtime_rt_all_count1").text(onlineCount+outlineCount);
                    $("#realtime_rt_online_count1").text(onlineCount);
                    $("#realtime_rt_offline_count1").text(outlineCount);
                    
                    window.firstAttentionData=arr;
                    RTU.invoke("app.realtimelocomotivequery.query.refreshMarker", arr);
                    RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", arr);
                });
                psModel.searchNow({ token: window.refreshNum });
            });

            //添加关注（取消关注）
           /* $(".app_rt_raltime_attention_but").unbind("click").click(function () {
                RTU.invoke("app.realtimelocomotivequery.query.attentionClick");
            });*/

            //文件上传
            $(".app_rt_raltime_fileupload").unbind("click").click(function () {
                if (window.attention) {//如果当前为列表页面，就从列表页面得到数据
                	if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}
                    	 boxes = window.realtimeG.selectItem();
                         var datas = [];
                         if (boxes.length > 0) {
                             $.each(boxes, function (i, n) {
                                 $n = $(n).data("itemData");
                                	 try {
                                         var checiName = $n.checiName;
                                         var locoTypeName = $n.locoTypeName;
                                         var locoNO = $n.locoNO;
                                         var depotName = $n.depotName;
                                         var locoTypeid = $n.locoTypeid;
                                         var locoAb = $n.locoAb;
                                         var isOnline=$n.isOnline==3||$n.isOnline==4?"0":"1";
                                         datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb+","+isOnline);
                                     } catch (e) {
                                     }
                             });
              	           	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                         } else {
                             RTU.invoke("header.notice.show", "未选中机车");
                         }
                } else {//如果当前为关注页面，就从关注页面得到数据
                	
                	if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}
                        boxes = window.RealtimeAttentionList.selectItem();

                        var datas = [];
                        var isPass="";
                        if (boxes.length > 0) {
                            $.each(boxes, function (i, n) {
                                $n = $(n).data("itemData");
                                	try {
                                        var checiName = $n.checiName;
                                        var locoTypeName = $n.locoTypeName;
                                        var locoNO = $n.locoNO;
                                        var depotName = $n.depotName;
                                        var locoTypeid = $n.locoTypeid;
                                        var locoAb = $n.locoAb;
                                        var isOnline=$n.isOnline==3||$n.isOnline==4?"0":"1";
                                        datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb+","+isOnline);
                                        isPass="Y";
                                    } catch (e) {
                                    }
                            });
             	            	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                        } else {
                            RTU.invoke("header.notice.show", "未选中机车");
                        }
                }
            });
            //文件下载
            $(".app_rt_raltime_filedownload").unbind("click").click(function () {
                if (window.attention) {//如果当前为列表页面，就从列表页面得到数据
                	
                	if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}
                	RTU.invoke("header.alarmMsg.hide");
                	RTU.invoke("header.roleAlarmMsg.hide");
                		boxes = window.realtimeG.selectItem();
                        if (boxes.length == 1) {//如果选中一辆机车的话则弹出下载框
                            $.each(boxes, function (i, n) {
                                $n = $(n).data("itemData");
                            		 try {
                                         var data = {
                                             "locotypeid": $n.locoTypeid,
                                             "locono": $n.locoNO,
                                             "locoTypeName": $n.locoTypeName,
                                             "locoAb": $n.locoAb,
                                             "speed":$n.speed
                                         };
                                         if($n.lkjType!=1)
                                          	RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
                                          else
                                          	RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                                     } catch (e) {
                                     }
                            });
                        } else if (boxes.length > 1) {//如果选中机车超过一辆的话则提示信息
                            RTU.invoke("header.notice.show", "请选择单辆机车进行下载操作");
                        } else if (boxes.length <= 0) {
                            RTU.invoke("header.notice.show", "未选中机车");
                        }
                } else {//如果当前为关注页面，就从关注页面得到数据
                	
                	if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}
                	RTU.invoke("header.alarmMsg.hide");
                	RTU.invoke("header.roleAlarmMsg.hide");
                		boxes = window.RealtimeAttentionList.selectItem();
                        if (boxes.length == 1) {//如果选中一辆机车的话则弹出下载框
                            $.each(boxes, function (i, n) {
                                $n = $(n).data("itemData");
                                	 try {
                                         var data = {
                                             "locotypeid": $n.locoTypeid,
                                             "locono": $n.locoNO,
                                             "locoTypeName": $n.locoTypeName,
                                             "locoAb": $n.locoAb,
                                             "speed":$n.speed
                                         };
                                         RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
                                     } catch (e) {
                                     }
                            });
                        } else if (boxes.length > 1) {//如果选中机车超过一辆的话则提示信息
                            RTU.invoke("header.notice.show", "请选择单辆机车进行下载操作");
                        } else if (boxes.length <= 0) {
                            RTU.invoke("header.notice.show", "未选中机车");
                        }
                	}
            });

            //运行曲线
            $(".app_rt_raltime_showmove").unbind("click").click(function () {
                var movedatas = [];
                if (window.attention) {//如果当前为列表页面，就从列表页面得到数据
                    boxes = window.realtimeG.selectItem();
                    $.each(boxes, function (i, n) {
                        var indexOfData = $(n).parent().parent().index();
                        $n = $(n).data("itemData");
                        var id = $n.locoTypeStr;
                        var name = $n.checiName + "(" + $n.locoTypeStr + ")";
                        var data = {
                            id: id,
                            name: name,
                            data: window.realtimeG.datas[indexOfData],
                            item: n
                        };
                        movedatas[movedatas.length] = data;
                    });
                    RTU.invoke("app.realtimelocomotivequery.query.initmutimove", movedatas);
                } else {//如果当前为关注页面，就从关注页面得到数据
                    boxes = window.RealtimeAttentionList.selectItem();
                    $.each(boxes, function (i, n) {
                        var indexOfData = $(n).parent().parent().index();
                        $n = $(n).data("itemData");
                        var id = $n.locoTypeStr;
                        var name = $n.checiName + "(" + $n.locoTypeStr + ")";

                        var data = {
                            id: id,
                            name: name,
                            data: window.RealtimeAttentionList.datas[indexOfData],
                            item: n
                        };
                        movedatas[movedatas.length] = data;
                    });
                    RTU.invoke("app.realtimelocomotivequery.query.initmutimove", movedatas);
                }
            });
            
            //运行记录
            $(".app_rt_raltime_yunxingjilu").unbind("click").click(function(){
            	 if (window.attention) {//如果当前为列表页面，就从列表页面得到数据
            		 boxes = window.realtimeG.selectItem();
                     $.each(boxes, function (i, n) {
                         $n = $(n).data("itemData");
                         var sendData={
                                 locoTypeid:$n.locoTypeid,
                                 locoNo:$n.locoNo,
                                 locoAb:$n.locoAb,
                                 locoTypename:$n.locoTypeName,
                                 kehuo:$n.kehuo,
                                 date:$n.lkjTimeStr
                             };
                         if($n.lkjType!=1)
                         	RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                         else
                         	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
                     });
                     
            	 }else {//如果当前为关注页面，就从关注页面得到数据
            		 boxes = window.RealtimeAttentionList.selectItem();
                     $.each(boxes, function (i, n) {
                         $n = $(n).data("itemData");
                         var sendData={
                                 locoTypeid:$n.locoTypeid,
                                 locoNo:$n.locoNo,
                                 locoAb:$n.locoAb,
                                 locoTypename:$n.locoTypeName,
                                 kehuo:$n.kehuo,
                                 date:$n.lkjTimeStr
                             };
                         if($n.lkjType!=1){
                        	 RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                         }else{
                        	 RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                         }
                  });
            	 }
            });
            
            //新一代代码   揭示信息显示
            $(".app_rt_raltime_limitinfo").unbind("click").click(function () {
           	 	if(window.attention){
           	 		boxes = window.realtimeG.selectItem();
           	 	}else{
           	 		boxes = window.RealtimeAttentionList.selectItem();
           	 	}
                                
                if(boxes.length==0){
               	 alert("请选择一行");
                }
                
                $.each(boxes, function (i, n) {
                    $n = $(n).data("itemData");
                    if($n.lkjType!=1){
	                	alert("请选择15型机车");
	                	return;
                	}
                	 RTU.invoke("app.realtimelocomotivequery.query.initlkj15limitinfo",$n);
                	});
           });
            
            //新一代代码
            RTU.register("app.realtimelocomotivequery.query.initlkj15limitinfo", function () {
            	return function(data){
            		 RTU.invoke("app.realtimelocomotivequery.query.closeAllWnd");
            		 RTU.invoke("app.lkj15limitinfo.query.init",data);
            	};
            	
            });
            
            $(".app_rt_raltime_sysquery").unbind("click").click(function () {
           	 	if(window.attention){
           	 		boxes = window.realtimeG.selectItem();
           	 	}else{
           	 		boxes = window.RealtimeAttentionList.selectItem();
           	 	}
                                
                if(boxes.length==0){
               	 	alert("请选择一行");
                }
                
                $.each(boxes, function (i, n) {
                    $n = $(n).data("itemData");
                    if($n.lkjType!=1){
	                	alert("请选择15型机车");
	                	return;
                	}
                    RTU.invoke("app.realtimelocomotivequery.query.closeAllWnd");
           		 	RTU.invoke("app.lkj15sysinfo.query.init",$n);
                	});
           });
            
        };
    });

   
    //点击添加关注（取消关注）
    //RTU.register("app.realtimelocomotivequery.query.attentionClick", function () {});
    window.firstAttentionData=[];
    window.firstAttentionDataFlag=true;
    //刷新关注tab的列表
    RTU.register("app.realtimelocomotivequery.query.refreshAttention", function () {
        return function (dataArr) {
        	var ctr1 = null;
        	var currentTr1 = null;
            if (window.RealtimeAttentionList) {//如果关注页面存在，先得到当前点击的数据行和选中的数据行，然其刷新后依旧为点击和选中状态
                var t = window.RealtimeAttentionList.currClickItem();
                ctr1 = window.RealtimeAttentionList.selectItem();
                if (t.item) {
                    currentTr1 = window.RealtimeAttentionList.currClickItem();
                    currentTr1.count = 1;
                }
                if (dataArr.length == 0) {//如果传过来数据为空，直接清空列表
                	window.RealtimeAttentionList.refresh(window.firstAttentionData);
                }else{
                	window.RealtimeAttentionList.refresh(dataArr);
                }
                
            }else{
            	window.firstAttentionData=dataArr;
            	window.firstAttentionDataFlag=false;
            }
           
        };
    });

    //刷新地图机车标注
    RTU.register("app.realtimelocomotivequery.query.refreshMarker", function () {
        return function (datas) {
            var d = RTU.invoke("app.index.home.formatData", datas);
            RTU.invoke("app.realtimelocomotivequery.query.AddOrUpdateMarker", d);
            RTU.invoke("map.marker.showguDaoMarker");
        };
    });
    var ctr = null;
    var currentTr = null;
    //刷新列表tab页面的列表
    function refreshDataFn(data) {
        if (window.realtimeG) {//先得到当前点击的数据行和选中的数据行，然其刷新后依旧为点击和选中状态
            window.realtimeG.refresh(data);
            if (window.popuwndLocoInfo) {//如果点击行机车没有经纬度，则刷新弹出框的数据；
                var thisData = window.realtimeG.currClickItem();
                var obj = {};
                obj.itemData = thisData.data;
                obj.popuwndLocoInfo = window.popuwndLocoInfo;
                obj.isInterval="no";
            }
        }else{
        	 if ($(".raltime_rt_tab_div").length == 0) {
                 $(".raltime_rt_rstabDiv").append('<div class="raltime_rt_tab_div"><div id="rt_tab_div_grid"></div></div>');
             }
                 //初始化-实时查询
                 window.realtimeG = new RTGrid({
                     datas: data,
                     containDivId: "rt_tab_div_grid",
                     tableWidth: 365,
                     tableHeight: 260,
                     isSort: true, //是否排序
                     hasCheckBox: true,
                     showTrNum: false,
                     clickIdItem: "locoTypeid_locoNo_locoAb",
                     isShowPagerControl: false,
                     beforeLoad:function(that){
         				that.pageSize =3000;
         			},
                     isShowRefreshControl:false,
                     beforeSortFn: function (sname, isUp, that) {
                    	 that.pageSize =3000;
                         var sname = that.sortParam.itemName;
                         if (sname == "isOnline") {
                             sname = "isOnline";
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
                         var exparm = { "sortField": sname, "sortOrder": that.sortParam.upAndDown };
                         window.trItem.extendParam = exparm;
                         if (trItem.httpRequest) {//ajax停止
                             trItem.httpRequest.abort();
                             trItem.httpRequest = null;
                         }
                         trItem.loadFn();
                         window.realtimeG.param.datas = [];
                         return true;
                     },
                     /*trRightClick: function (returnData){//右键
                    	 selectData=returnData.data;
                    	 var clientY= $("#"+returnData.data.data.locoTypeStr).offset().top-30;
                    	 var clientX  = $("#"+returnData.data.data.locoTypeStr).position().left+120;
          				 var rightDiv=$("#content-locospread-rightClickDiv");
          				 var width=$(rightDiv).width();
    	   				 var height=$(rightDiv).height(); 
    	   				 var width1 = document.documentElement.clientWidth*0.9  ;
    	   		         var height1 = document.documentElement.clientHeight;
                    	 if((clientX+width)>width1){
       					  	  $(rightDiv).css({"left":(clientX-50-width)+"px"});
	       				  }else{
	       					  $(rightDiv).css({"left":(clientX+20)+"px"});
	       				  }
	       				  if((clientY+height)>height1){
	       					  $(rightDiv).css({"top":(clientY-height)+"px"});
	       				  }else{
	       					  $(rightDiv).css({"top":(clientY-30)+"px"});
	       				  }
       	   				 $(rightDiv).removeClass("hidden");
		       	   			$("body").click(function(){
			   					$("#content-locospread-rightClickDiv").addClass("hidden");
			   				 });
                     },*/
                     selectTrEvent: function (t, currClickItem) {//选择事件
                         if (!currClickItem) return;
                         if($(currClickItem).attr("checked")=="checked"){
                            var thisData = currClickItem.data("itemData");
                            window.selectData={"data":thisData};
                            var id=thisData.locoTypeStr;
                             RTU.invoke("map.marker.findMarkers", {
                                 pointId: id,
                                 isSetCenter: true,
                                 stopTime: 5000,
                                 isShowHighLevel:1,
                                 fnCallBack: function () {
                                 }
                             });
                             var lng = thisData.longitude;
                             var lat = thisData.latitude;
                             if ((lng == 0) || (lat == 0)) {
                                 if ($(".pointTab")) {
                                     $(".pointTab").hide();
                                 }
                                 RTU.invoke("map.marker.clearSelectPointCss");
                                 var $status;
                                 //if(thisData.lkjType!=1){
                                	 RTU.invoke("app.realtimelocomotivequery.query.yxxx");
//                                 }else{
//
//                                     RTU.invoke("core.router.load", {
//                                         url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
//                                         async: false,
//                                         success: function (status) {
//                                             $status = $(status);
//                                         }
//                                     });
//                                     if (window.popuwndLocoInfo) {
//                                         window.popuwndLocoInfo.close();
//                                         window.popuwndLocoInfo=null;
//                                     }
//                                     window.popuwndLocoInfo = new PopuWnd({
//                                         title: id + "-详情",
//                                         html: $status.html(),
//                                         width: 380,
//                                         height: 510,
//                                         left: 513,
//                                         top: 60,
//                                         shadow: true
//                                     });
//                                     window.popuwndLocoInfo.init();
//                                     window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
//                                    	 window.popuwndLocoInfo=null;
//                                     });
//                                     var obj = {};
//                                     obj.itemData = thisData;
//                                     obj.popuwndLocoInfo = window.popuwndLocoInfo;
//                                     RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
//                                 
//                                 }

                             } else {
                                 if (window.popuwndLocoInfo) {
                                     window.popuwndLocoInfo.close();
                                     window.popuwndLocoInfo=null;
                                 }
                             }
                         }else{
                            RTU.invoke("map.marker.clearSelectPointCss");
                         }
                     },
                     clickTrEvent: function (t) {//单击事件
                         var thisData = window.realtimeG.currClickItem();
                         window.selectData=thisData;
                       //自动添加该条标记点
                         var d = RTU.invoke("app.index.home.formatData", [thisData.data]);
                         //更新或增加该标记点
                         RTU.invoke("app.index.AddOrUpdateMarker", d);
                         RTU.invoke("app.realtimelocomotivequery.query.showMenu",thisData);//显示按钮栏
                         try {
                        	 //选中当前行
                             var _thisTr = $(thisData.item);
                             var _checkbox = $("input[type='checkbox']", $(thisData.item));
                             var id=thisData.data.locoTypeStr;
                             var allCheckbox = $("input[type='checkbox']", $(thisData.item).parent());
                             allCheckbox.each(function () {
                                 if (id == $(".locoTypeStr", _thisTr).html()) {
                                     _checkbox.attr("checked", "checked");
                                     _checkbox.addClass("checked");
                                     return false;
                                 }
                             });
                             //在地图上标识机车选中
                             RTU.invoke("map.marker.findMarkers", {
                                 pointId: id,
                                 isSetCenter: true,
                                 stopTime: 5000,
                                 isShowHighLevel:1,
                                 fnCallBack: function () {
                                 }
                             });
                            
                             var lng = thisData.data.longitude;
                             var lat = thisData.data.latitude;
                             if ((lng == 0) || (lat == 0)) {//没有位置信息
                                 if ($(".pointTab")) {
                                     $(".pointTab").hide();
                                 }
                                 RTU.invoke("map.marker.clearSelectPointCss");
                                 var $status;
                               //  if(thisData.data.lkjType!=1){
                                 //RTU.invoke("app.realtimelocomotivequery.query.deactivate");
                                 if(window.popuwndLocoInfo){
                                	 window.popuwndLocoInfo.close();
                                	 window.popuwndLocoInfo=null;
                                 }
                               //在切换到其他菜单时，清空当前菜单所有的五秒刷新
                                 /*window.psModel.cancelScribe("refreshData", window.refreshNum);
                                 window.psModel.cancelScribe("refreshData", window.allListRefresh);
                                 window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                                 window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                                 window.psModel.runControl("refreshData", window.homeTimer, true);
                                 RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", []);
                                 
                                 RTU.invoke("app.realtimelocomotivequery.query.stopTimer");
                                 RTU.invoke("app.realtimelocomotivequery.searchList.stopTimer");
                                 RTU.invoke("app.filetransfer.result.deactivate");
                                 RTU.invoke("app.filedownload.result.deactivate");                                 
                                 if (wndMoveCurve) {
                                 	clearInterval(wndMoveCurve.timerCount);
                                     wndMoveCurve.returnWin().close();
                                 }
                                 RTU.invoke("header.alarmMsg.hide");
                             	RTU.invoke("header.roleAlarmMsg.hide");
                             	RTU.invoke("map.marker.clearSelectPointCss");*/
                                 
                                 RTU.invoke("app.realtimelocomotivequery.query.yxxx");
//                                 }else{
//                                     RTU.invoke("core.router.load", {
//                                         url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
//                                         async: false,
//                                         success: function (status) {
//                                             $status = $(status);
//                                         }
//                                     });
//                                     if (window.popuwndLocoInfo) {
//                                         window.popuwndLocoInfo.close();
//                                         window.popuwndLocoInfo=null;
//                                     }
//                                     window.popuwndLocoInfo = new PopuWnd({
//                                         title: id + "-详情",
//                                         html: $status.html(),
//                                         width: 380,
//                                         height: 510,
//                                         left: 513,
//                                         top: 60,
//                                         shadow: true
//                                     });
//                                     window.popuwndLocoInfo.init();
//                                     window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
//                                    	 window.popuwndLocoInfo=null;
//                                     });
//                                     var obj = {};
//                                     obj.itemData = thisData.data;
//                                     obj.popuwndLocoInfo = window.popuwndLocoInfo;
//                                     RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
//                                 
//                                 }

                             } else {
                                 if (window.popuwndLocoInfo) {
                                     window.popuwndLocoInfo.close();
                                     window.popuwndLocoInfo=null;
                                 }
                               //定位过去之后
                             //更新区域的其他点
                              var d2 = RTU.invoke("app.index.home.formatData", window.trItem.allData);
                              //更新或增加该标记点
                              RTU.invoke("app.index.AddOrUpdateMarker", d2);
                             }
                         } catch (e) {
                         }
                     },
                     // 1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
                     replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                     	 if (data == "1"||data == "2") {
                     		return '<div class="greenLight"></div>';
                            //return "<img src='../static/img/app/online_pic_14_14.png'>";
                         } else if (data == "3"||data == "4") {
                        	 return '<div class="yellowLight"></div>';
                            //return "<img src='../static/img/app/outline_pic_14_14.png'>";
                         }
                     }
                     }, { index: 2, fn: function (data, j, ctd, itemData) {
                         /*if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                             return itemData.locoTypeName + "-" + itemData.locoNO;
                         } else if (itemData.locoAb == "1") {
                             return itemData.locoTypeName + "-" + itemData.locoNO + "A";
                         } else {
                             return itemData.locoTypeName + "-" + itemData.locoNO + "B";
                         }*/
                    	 return itemData.locoTypeStr;
                     }
                     }, { index: 4, fn: function (data, j, ctd, itemData) {
                        if(itemData.lkjTimeStr){
                     	   return '<div id="'+itemData.locoTypeStr+'">'+ itemData.lkjTimeStr.substring(5,itemData.lkjTimeStr.length)+'</div>';
                        }
                     }
                     }],
                     loadPageCp: function (t) {
                         t.cDiv.css("left", "200px");
                         t.cDiv.css("top", "200px");
                     },
                     colNames: ["状态", "车次", "机车",  "实速",  "时间"],
                     colModel: [{ name: "isOnline", width: "40", isSort: true }, { name: "checiName", width: "50", isSort: true }, { name: "locoTypeStr", width: "70", isSort: true },  { name: "speed", width: "40", isSort: true },  { name: "receiveTimeStr",   isSort: true}]
                 });
                 if(window.realtimeG.datas&&window.realtimeG.datas.length>0){
                 	window.firstAttentionData=[];
                 	for(var i=0;i<window.realtimeG.datas.length;i++){
                 		/*var locoStr=window.realtimeG.datas[i].locoTypeName+"-"+
                 		window.realtimeG.datas[i].locoNO+window.realtimeG.datas[i].locoAb;*/
                 		var locoStr=window.realtimeG.datas[i].locoTypeStr;
                 		if(RTU.data.user.attentionLocos.indexOf(locoStr)!=-1){
                 			//说明遍历到的机车在关注列表中,添加到关注数据中
                 			window.firstAttentionData.push(window.realtimeG.datas[i]);
                 		};
                 	};
                 };
        }
        //if (window.isCompleteUpdate == true) {
        //    var d = RTU.invoke("app.index.home.formatData", data);
        //    RTU.invoke("app.index.AddOrUpdateMarker", d);
        //}
        
    }
    //查询数据
    RTU.register("app.realtimelocomotivequery.query.search", function () {
        return function (searchObj) {
            try {
                RTU.invoke("app.realtimelocomotivequery.query.closeAllWnd");
                function searchResult(data){
                	var locationCheckbox=$("input[name='app_rt_kind_location']");
                	var stateCheckbox=$("input[name='app_rt_kind_state']");
                	var useCheckbox=$("input[name='app_rt_kind_use']");
                	var upDownCheckbox=$("input[name='app_rt_kind_upDown']");
                	
                	var locationStr="";
                	var stateStr="";
                	var useStr="";
                	var upDownStr="";
                	  
                	 $.each(locationCheckbox, function (i, item) {
        	   			 if($(item).attr("checked")=="checked"){
        	   				locationStr=locationStr+$(item).val();
        		   		 }
        	         });
                	 $.each(stateCheckbox, function (i, item) {
        	   			 if($(item).attr("checked")=="checked"){
        	   				stateStr=stateStr+$(item).val();
        		   		 }
        	         });
                	 $.each(useCheckbox, function (i, item) {
        	   			 if($(item).attr("checked")=="checked"){
        	   				useStr=useStr+$(item).val();
        		   		 }
        	         });
                	 $.each(upDownCheckbox, function (i, item) {
        	   			 if($(item).attr("checked")=="checked"){
        	   				upDownStr=upDownStr+$(item).val();
        		   		 }
        	         });
                
                	
                	 var onlineCount=0;
                	 var outlineCount=0;
                	 
                	 var returnData={
                			 onlineCount:0,
                			 outlineCount:0,
                			 resultData:[]
                	 };
                if(locationStr==""&&stateStr==""&&useStr==""&&upDownStr==""){
                	for(var i=0,len=data.length;i<len;i++){
	                	if(data[i].state=="1"){
							onlineCount++;
						}else{
							outlineCount++;
						}
                	}
                	returnData.resultData=data;
                }else{
                	for(var i=0;i<data.length;i++){
                		
                		var bLocationOnload = false;//途中
        				var bLocationStore = false;//库内
        				var bStateOnline = false;//在线
        				var bStateOutline = false;//离线
        				var bUseKeche = false;//客车
        				var bUseHuoche = false;//货车
        				var bUseDongche = false;//动车
        				var bUseGaotie = false;//高铁
        				var bUpDownLineUp = false;//上行
        				var bUpDownLineDown = false;//下行
        				
        				
        				var bLocation = null;//动车
        				var bState = null;//高铁
        				var bUse = null;//上行
        				var bUpDown = null;//下行
        				
        				
        				if(locationStr!=""){
        					if(data[i].location!=""&&locationStr.indexOf(data[i].location)!=-1){
            					if(data[i].location=="1"){
            						bLocationOnload=true;
            					}else if(data[i].location=="2"){
            						bLocationStore=true;
            					}
            					bLocation=true;
            				}else if((data[i].location==""||locationStr.indexOf(data[i].location)<=0)){
            					bLocationOnload = false;//动车
            					bLocationStore = false;//动车
            					bLocation=true;
            				}else{
            					bLocation=false;
            				}
        				}else{
        					bLocation=false;
        				}
        				
        				if(stateStr!=""){
        					if(data[i].state!=""&&stateStr.indexOf(data[i].state)!=-1){
            					if(data[i].state=="1"){
            						bStateOnline=true;
            					}else{
            						bStateOutline=true;
            					}
            					bState=true;
            				}else if(stateStr.indexOf(data[i].state)<=0||data[i].state!=""){
            					bStateOnline=false;
            					bStateOutline=false;
            					bState = true;//高铁
            				}else{
            					bState=false;
            				}
        				}else{
        					bState=false;
        				}
        				
        				if(useStr!=""){
        					if(data[i].use!=""&&useStr.indexOf(data[i].use)!=-1){
            					if(data[i].use=="1"){
            						bUseHuoche=true;
            					}else if(data[i].use=="2"){
            						bUseKeche=true;
            					}else if(data[i].use=="3"){
            						bUseGaotie=true;
            					}else{
            						bUseDongche=true;
            					}
            					bUse=true;
            				}else if(data[i].use==""||useStr.indexOf(data[i].use)<=0){
            					bUseHuoche=false;
            					bUseKeche=false;
            					bUseGaotie=false;
            					bUseDongche=false;
            					bUse=true;
            				}else{
                				bUse = false;//上行
            				}
        				}else{
            				bUse = false;//上行
        				}
        				
        				if(upDownStr!=""){
        					if(data[i].upDown!=""&&upDownStr.indexOf(data[i].upDown)!=-1){
            					if(data[i].upDown=="1"){
            						bUpDownLineUp=true;
            					}else{
            						bUpDownLineDown=true;
            					}
            					bUpDown=true;
            				}else if(data[i].upDown!=""||upDownStr.indexOf(data[i].upDown)<=0){
            					bUpDownLineUp= false;
            					bUpDownLineDown= false;
            					bUpDown=true;
            				}else{
            					bUpDown = false;//下行
            				}
        				}else{
        					bUpDown = false;//下行
        				}
        				if(((bLocation&&(bLocationOnload||bLocationStore))||!bLocation)
        						&&((bState&&(bStateOnline||bStateOutline))||!bState)
        						&&((bUse&&(bUseHuoche||bUseKeche||bUseGaotie||bUseDongche))||!bUse)
        						&&((bUpDown&&(bUpDownLineUp||bUpDownLineDown))||!bUpDown)
        						){
        					if(data[i].state=="1"){
        						onlineCount++;
        					}else{
        						outlineCount++;
        					}
        					returnData.resultData.push(data[i]);
        				}
                	}
                }	 
	                returnData.onlineCount=onlineCount;
	                returnData.outlineCount=outlineCount;
	                return returnData;
                }
                
                function conditionsFun() {
                    var trainType = $('#carType').val();
                    var trainStr = "";
                    if (trainType == "全部") {
                        trainStr = "";
                    } else if (trainType == "货车") {
                        trainStr = "1";
                    } else if (trainType == "客车") {
                        trainStr = "2";
                    } else if (trainType == "高铁") {
                        trainStr = "3";
                    } else if (trainType == "动车") {
                        trainStr = "4";
                    } else if (trainType == "其他") {
                        trainStr = "5";
                    } else {
                        trainStr = "";
                    }
                    var locoNoStr=RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $('#trainStr').val()).locoNo;
                    var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)

                    var locoAbStr =$('#trainStr').attr("locoAb");
                    /*var locoAbStr="";*/
                	if(!isNaN(isAB)){  //只有机车号、AB节为0
                		if(!locoAbStr)locoAbStr=0;
                	}else{
//                		if(isAB=="A"){ 
//                			locoAbStr =1;
//                		}else if(isAB=="B"){ 
//                			locoAbStr=2;
//                		}
                		locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
                	}
//                	locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
                    return [{ name: "locoTypeName", value: (RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $('#trainStr').val()).locoTypeName || "") },
                                	{ name: "locoNO", value: ( locoNoStr || "") },
                                	{ name: "locoAb", value: ( locoAbStr || "") },
                                	{ name: "depotName", value: ($('#dName').val() || "") },
                                	{ name: "checiName", value: ($('#checiName').val() == "on" ? "" : $('#checiName').val() || "") },
                                	/*{ name: "lineName", value: ($('#lineName').val() || "") },*/
                                	{ name: "lineNo", value: ($('#lineNo').val() || "") },
                                	{ name: "tscCorp",value:$("#tscCorpSel").val()},
                                	{ name: "tscSoftver",value:$("#tscSoftverSel").val()},
                                	{ name: "trainType", value: (trainStr || "") },
                                	{ name: "dshortname", value: ($('#sName').val() || "")}];
                }

                    window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
                    window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
                    window.psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
//                    window.psModel.cancelScribe("refreshData", window.homeTimer);
                    psModel.cancelScribe("refreshData", window.allListRefresh);
                    window.allListRefresh = psModel.subscribe("refreshData", function (t, data) {
                    	var returnData=searchResult(data);
                    	window.isAroundLocoList = false;
                        window.isThisLineLocoList = false;
                        refreshDataFn(returnData.resultData);
                        RTU.invoke("map.marker.hideCarMarker");
                        var len=returnData.resultData.length;
                        for (var j = 0; j < len; j++) {
                            var d = returnData.resultData[j];
                            /*RTU.invoke("map.marker.showSomeCarMarker", d.locoTypeName + "-" 
                            		+ d.locoNO+RTU.invoke("app.locoAb.getChar",d.locoAb));*/
                            RTU.invoke("map.marker.showSomeCarMarker",
                            		d.locoTypeStr);
                        }
                        
                        $("#realtime_rt_all_count").text(len);
                        $("#realtime_rt_online_count").text(returnData.onlineCount);
                        $("#realtime_rt_offline_count").text(returnData.outlineCount);
                        /*$("#tscOlCountDiv",top.document.body).text(returnData.onlineCount);//更新主页面数据
*/                        try{
                        	//刷新详情子页面                        	
							if($("#popuwndLocoInfo")[0]&&window.realtimeG.currClickItem()){
								/*console.log(JSON.stringify(window.realtimeG.currClickItem().data));*/
								$("#popuwndLocoInfo")[0].contentWindow.initTab1(window.realtimeG.currClickItem().data);
								$("#popuwndLocoInfo")[0].contentWindow.initTab2(window.realtimeG.currClickItem().data);
								$("#popuwndLocoInfo")[0].contentWindow.initTab3(window.realtimeG.currClickItem().data);
							}
                        }catch(e){//alert(e);
                        }
                    }, conditionsFun);
//                RTU.invoke("app.realtimelocomotivequery.query.initTimer");
//                RTU.invoke("app.result.showthisLineLoco.stopTimer");
//                RTU.invoke("app.result.showAroundLoco.stopTimer");

            } catch (e) {
            }
        };
    });

    var $status;
	var $status1;
    RTU.register("app.realtimelocomotivequery.query.AddOrUpdateMarker", function () {
        return function (data) {    
            if (data.p != true) {
                data.p = false;
            }
            
            var lkj2000Objs=new Array();
            var lkj15Objs=new Array();
            var flag0=0;
            var flag1=0;
            $.each(data.data,function(i,n){      	
            	if(n.lkjType!=1){
            		lkj2000Objs.push(n);
            		flag0++;
            	}
            	else{
            		lkj15Objs.push(n);
            		flag1++;
            	}
            });
            
            if(flag0!=0){
            	RTU.invoke("core.router.load", {
                    url: "../app/modules/app-realtimelocomotivequery-trainalarm.html",
                    async: false,
                    success: function (status) {
                        $status = $(status);
                    }
                });
            	
            	RTU.invoke("map.marker.addAndUpDateMarkers", {
                    pointId: "locoTypeStr",
                    pointDatas: lkj2000Objs,
                    TIPSID: "tips",
                    tabHtml: $status.html(),
                    pointType: "pointTypeUrl",
                    isSetCenter: false,
                    setDataSeft: false,
                    tabWidth: 380, //tab 宽度
                    tabHeight: 420, //tab 的高度
                   initFn: function (obj) {
                    	
                        RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
//                        $("#" + obj.tabId + " .bundefined").unbind("click").click(function () {
//                            RTU.invoke("app.realtimelocomotivequery.query.initInfoWnd", obj);
//                        });
                        RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 270, left: 190 });
                    },
                    rightHand: function (obj) {
                        RTU.invoke("app.realtimelocomotivequery.rightHtml.init", obj);
                        var lt = RTU.invoke("map.markTopLeft", {lng: obj.lng, lat: obj.lat});
//                        if(($(window).height()-lt.Y)<160){
//                       	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat, top: 230 ,left:$(window).width()/2-($(window).width()-lt.X)});	
//                       }  
//                       if(($(window).width()-lt.X)<110){
//                      	 RTU.invoke("map.setCenter", { lng: obj.lng, lat: obj.lat,left: $(window).width()/2 -120,top:$(window).height()/2-($(window).height()-lt.Y) });	
//                      }  
                     
                    }
                });
            }
            
            if(flag1!=0){
            	
            	RTU.invoke("core.router.load", {
                     url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
                     async: false,
                     success: function (status1) {
                         $status1 = $(status1);
                     }
                 });
            	 
            	RTU.invoke("map.marker.addAndUpDateMarkers", {
                    pointId: "locoTypeStr",
                    pointDatas: lkj15Objs,
                    TIPSID: "tips",
                    tabHtml: $status1.html(),
                    pointType: "pointTypeUrl",
                    isSetCenter: false,
                    setDataSeft: false,
                    tabWidth: 380, //tab 宽度
                    tabHeight: 500, //tab 的高度
                    initFn: function (obj) {
                    	
                        RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
                        RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 270, left: 190 });
                    },
                    rightHand: function (obj) {
                        RTU.invoke("app.realtimelocomotivequery.rightHtml.init", obj);
                        var lt = RTU.invoke("map.markTopLeft", {lng: obj.lng, lat: obj.lat});
                    }
                });
            }
            
            
        };
    });
    
  //新一代代码  初始化新一代lkj列车报警窗口
    RTU.register("app.realtimeloco15motivequery.query.initInfoWnd", function () {
        // data 包括机车信息与设备信息data.traininfo data.equipinfo
        var item = function (data) {
            var inittrainalarm = function (info) {
                var h = function ($h, info) {
                	//if(info.lkjType==1)alert("15");
                    trainwnd = new PopuWnd({
                        title: "新一代lkj列车警报状态详情-" + info.itemData.checiName + "(" + info.itemData.locoTypeStr + ")",
                        html: $h,
                        width: 900,
                        height: 580,
                        left: 70,
                        top: 60,
                        shadow: true
                    });
                    trainwnd.init();
                    //RTU.invoke("app.failurewarning.trainalarm.init");
                };
                loadHtml("../app/modules/app-trainalarm15stateparticulars-query.html", h, data);
            },
            // url 请求路径 $h缓存的html f回调函数
			loadHtml = function (url, f, info) {
			    RTU.invoke("core.router.load", {
			        url: url,
			        success: function (html) {
			            try {
			                var $h = $(html);
			                f($h, info);
			            } catch (e) {
			            }
			        }
			    });
			};
            inittrainalarm();
        };
        return function (obj) {
        	
            item(obj);
        };
    });
    
    // 初始化列车报警窗口
    RTU.register("app.realtimelocomotivequery.query.initInfoWnd", function () {
        // data 包括机车信息与设备信息data.traininfo data.equipinfo
        var item = function (data) {
            var inittrainalarm = function (info) {
                var h = function ($h, info) {
                    trainwnd = new PopuWnd({
                        title: "列车警报状态详情-" + info.itemData.checiName + "(" + info.itemData.locoTypeStr + ")",
                        html: $h,
                        width: 900,
                        height: 580,
                        left: 115,
                        top: 60,
                        shadow: true
                    });
                    trainwnd.init();
                    RTU.invoke("app.failurewarning.trainalarm.init");
                };
                loadHtml("../app/modules/realtimelocomotivequery/app-trainalarmstateparticulars-query.html", h, data);
            },
            // url 请求路径 $h缓存的html f回调函数
			loadHtml = function (url, f, info) {
			    RTU.invoke("core.router.load", {
			        url: url,
			        success: function (html) {
			            try {
			                var $h = $(html);
			                f($h, info);
			            } catch (e) {
			            }
			        }
			    });
			};
            inittrainalarm();
        };
        return function (obj) {
            item(obj);
        };
    });
    var wndMoveCurve = null;
    // 创建多个运行曲线窗口
    RTU.register("app.realtimelocomotivequery.query.initmutimove", function () {
        var wndBuilder = function (datas) {
            // url 请求路径 $h缓存的html f回调函数
            var loadHtml = function (url, f) {
                RTU.invoke("core.router.load", {
                    url: url,
                    async: false,
                    success: function (html) {
                        try {
                            var $h = $(html);
                            f($h);
                        } catch (e) {
                        }
                    }
                });
            };
            var countid = 0;
            var initmove = function (info, top, left,curMoveCount) {
                var f = function ($h) {
                    countid++;
                    $h = $("<div id = 'HtmlId" + countid + "'>" + $h.html() + "</div>");
                    var newmovewnd = new PopuWnd({
                        title: "运行曲线-" + info.name,
                        html: $h,
                        width: 507,
                        height: 398,
                        left: left,
                        top: top,
                        shadow: true
                    });
                    newmovewnd.init();
                    RTU.invoke("app.realtimelocomotivequery.move.init", {
                        htmlId: "HtmlId" + countid
                    });
                    mutimovewnd[mutimovewnd.length] = newmovewnd;
                };
                var item_w = localTopLeft.getLTobj();
                var locoTypeid = info.data.locoTypeid;
                var locoNo = info.data.locoNO;
                var locoAb = info.data.locoAb;
                var top = item_w.top;
                var left = item_w.left;
                if ($("#rt_tab_div_grid input[type='checkbox']:checked").length == 1) {
                	item_w.top = 60;
                	item_w.left = 590;
                    localTopLeft.Default();
                };
                info.name = info.data.checiName + "(" + info.data.locoTypeStr+")";
                if(info.data.lkjType!=1){
                	/*if (window.popuwndLocoInfo) {
                        window.popuwndLocoInfo.close();
                        window.popuwndLocoInfo=null;
                    }*/
                    wndMoveCurve = new MoveCurve({ locoTypeid:locoTypeid,
                   	 locoNo:locoNo,
                   	 locoAb:info.data.locoAb,
                   	 top: item_w.top-25, left: (item_w.left-42), 
                   	 itemData: info, 
                   	 htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move2.html",
                   	 dataUrl: '../onlineloco/searchMoveLineByProperty?str=[{"locoTypeid":"' + info.data.locoTypeid + '","locoNo":"' + info.data.locoNO + '","locoAb":"'+info.data.locoAb+'"}]' });
                     wndMoveCurve.Large();
                } else{ //如果是新一代lkj则创建MoveCurve15类型的曲线图形，具体实现待定
                    	  wndMoveCurve = new MoveCurve15({ locoTypeid:locoTypeid,
                         	 locoNo:locoNo,
                         	 locoAb:info.data.locoAb,
                         	 top: item_w.top, left: item_w.left, 
                         	 itemData: info, 
/*                         	 htmlUrl: "../app/modules/app-realtimeloco15motivequery-move2.html",*/
                         	 htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move15.html",
                         	 dataUrl: '../onlineloco15/searchMoveLine15ByProperty?str=[{"locoTypeid":"' + info.data.locoTypeid
                         	 + '","locoNo":"' + info.data.locoNO + '","locoAb":"'+info.data.locoAb+'"}]'});
                }
                var w = wndMoveCurve.returnWin();
                mutimovewnd[mutimovewnd.length] = w;
            };
            var clearmoves = function () {
                for (var i = 0; i < (mutimovewnd.length || 0); i++) {
                    try {
                        mutimovewnd[i].close();
                    } catch (e) {
                    }
                }
                mutimovewnd = [];
            };
            clearmoves();
            j = 1;
            for (var i = 0; i < (datas.length || 0); i++) {
                var top;
                var left;
                if (j == 2) {
                    top = 60;
                    left = ($(window).width() / 2 + 270);
                } else if (j == 3) {
                    top = 480;
                    left = ($(window).width() / 2 - infowndwidth + 250);
                } else if (j == 4) {
                    top = 480;
                    left = ($(window).width() / 2 + 270);
                    j = 0;
                } else {
                    top = 60;
                    left = ($(window).width() / 2 - infowndwidth + 250);
                }
                j++;
                initmove(datas[i], top, left,j-1);
            }
        };
        return function (datas) {
            wndBuilder(datas);
        };
    });

    RTU.register("app.realtimelocomotivequery.query.initResult", function () {
        return function () {
            if ($(".raltime_rt_tab_div").length == 0) {
                $(".raltime_rt_rstabDiv").append('<div class="raltime_rt_tab_div"><div id="rt_tab_div_grid"></div></div>');
            }
        };
    });

    RTU.register("app.realtimelocomotivequery.query.closeAllWnd", function () {
        return function () {
            for (var i = 0; i < mutimovewnd.length; i++) {
                try {
                    mutimovewnd[i].close();
                } catch (e) {
                }
            }
            mutimovewnd = [];
        };
    });
    // 拆分机车字符串
    RTU.register("app.realtimelocomotivequery.query.splitlocoNo", function () {
        return function (locoTypeStr) {
            var locoTypeName = "";
            var locoNo = "";
            if (locoTypeStr == "") {
                return {
                    locoTypeName: "",
                    locoNo: ""
                };
            }
            //是纯数字的时候约定输入的是机车号
            var n = Number(locoTypeStr);
            if (!isNaN(n)) {
                locoTypeName = "";
                locoNo = locoTypeStr;
            } else {
                var str = locoTypeStr.split('-');
                if (str.length == 2) {
                    locoTypeName = str[0];
                    locoNo = str[1];
                } else if (str.length > 2) {
                    locoTypeName += str[0];
                    for (var i = 1; i < str.length - 1; i++) {
                        locoTypeName += ("-" + str[i]);
                    }
                    locoNo = str[str.length - 1];
                } else if (str.length < 2) {
                    locoTypeName = locoTypeStr;
                }
            }
            return {
                locoTypeName: locoTypeName,
                locoNo: locoNo
            };
        };
    });
  
    RTU.register("app.realtimelocomotivequery.query.deactivate", function () {
        return function () {
            //在切换到其他菜单时，清空当前菜单所有的五秒刷新
            window.psModel.cancelScribe("refreshData", window.refreshNum);
            window.psModel.cancelScribe("refreshData", window.allListRefresh);
            window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
            window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
            window.psModel.runControl("refreshData", window.homeTimer, true);
            RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", []);
            if (popuwnd) {
                popuwnd.close();
                popuwnd = null;
            }
            RTU.invoke("app.realtimelocomotivequery.query.stopTimer");
            RTU.invoke("app.realtimelocomotivequery.searchList.stopTimer");
            RTU.invoke("app.filetransfer.result.deactivate");
            RTU.invoke("app.filedownload.result.deactivate");
            
            if (wndMoveCurve) {
            	clearInterval(wndMoveCurve.timerCount);
                wndMoveCurve.returnWin().close();
            }
            RTU.invoke("header.alarmMsg.hide");
        	RTU.invoke("header.roleAlarmMsg.hide");
        	RTU.invoke("map.marker.clearSelectPointCss");
        	
//        	psModel.cancelAllScribe("refreshData");
//        	psModel.cancelAllScribe("warnData");
        };
    });

  /*  RTU.register("app.realtimelocomotivequery.query.init", function () {
        data = RTU.invoke("app.setting.data", "realtimelocomotivequery");
        if (data && data.isActive) {
            RTU.invoke("app.realtimelocomotivequery.query.activate");
        }
        return function () {
            return true;
        };
    });*/
    /**
     * 运行信息
     */
    RTU.register("app.realtimelocomotivequery.query.yxxx", function () {
    	return function(thisData){
    	//	showInfo();
    		var _html='<iframe id="popuwndLocoInfo" name="popuwndLocoInfo" width="100%" height="100%" src="../app/modules/realtimelocomap/realtimeloco-info.html" frameborder="0" data-id="inner.html" 	seamless></iframe>';
    		if(selectData.data.lkjType=="1"){//LKJ15
        		_html='<iframe id="popuwndLocoInfo" name="popuwndLocoInfo" width="100%" height="100%" src="../app/modules/realtimelocomap/realtimeloco-lkj15.html" frameborder="0" data-id="inner.html" 	seamless></iframe>';
    		}
    		if(!window.popuwndLocoInfo){
    			window.popuwndLocoInfo = new PopuWnd({
                    title: "运行信息",
                    html: _html,
                    width: 700,
                    height:460,
                    left: 500,
                    top: 50,
                    shadow: true
                });
            }else{
            	window.popuwndLocoInfo.close();
            	window.popuwndLocoInfo.html=_html;
            }
    		window.popuwndLocoInfo.init();
    		return; 
    	}
    });
    
    /**
     * 运行曲线
     */
    RTU.register("app.realtimelocomotivequery.query.yxqx", function () {
    	return function(n){
    		var movedatas = [];
            if (window.attention) {//如果当前为列表页面，就从列表页面得到数据
                boxes = window.realtimeG.selectItem();
                if(boxes.length==1){
                    var data = {
                        id: n.data.locoTypeStr,
                        name: n.data.checiName + "(" + n.data.locoTypeStr + ")",
                        data: n.data,
                        item: n
                    };
                    movedatas[movedatas.length] = data;
                }else{
                	$.each(boxes, function (i, n) {
                		var indexOfData = $(n).parent().parent().index();
                		$n = $(n).data("itemData");
                		var id = $n.locoTypeStr;
                		var name = $n.checiName + "(" + $n.locoTypeStr + ")";
                		var data = {
                				id: id,
                				name: name,
                				data: window.realtimeG.datas[indexOfData],
                				item: n
                		};
                		movedatas[movedatas.length] = data;
                	});
                }
                RTU.invoke("app.realtimelocomotivequery.query.initmutimove", movedatas);
            } else {//如果当前为关注页面，就从关注页面得到数据
                boxes = window.RealtimeAttentionList.selectItem();
                if(boxes.length==1){
                    var data = {
                        id: n.data.locoTypeStr,
                        name: n.data.checiName + "(" + n.data.locoTypeStr + ")",
                        data: n.data,
                        item: n
                    };
                    movedatas[movedatas.length] = data;
                }else{
                	$.each(boxes, function (i, n) {
                		var indexOfData = $(n).parent().parent().index();
                		$n = $(n).data("itemData");
                		var id = $n.locoTypeStr;
                		var name = $n.checiName + "(" + $n.locoTypeStr + ")";
                		
                		var data = {
                				id: id,
                				name: name,
                				data: window.RealtimeAttentionList.datas[indexOfData],
                				item: n
                		};
                		movedatas[movedatas.length] = data;
                	});
                }
                RTU.invoke("app.realtimelocomotivequery.query.initmutimove", movedatas);
            }
    	};
	});
    
    /**
     * 实时lkj分析记录
     */
    RTU.register("app.realtimelocomotivequery.query.ssjl", function () {
    	return function(n){
                var sendData={
                        locoTypeid:n.data.locoTypeid,
                        locoNo:n.data.locoNo,
                        locoAb:n.data.locoAb,
                        locoTypename:n.data.locoTypeName,
                        kehuo:n.data.kehuo,
                        date:n.data.lkjTimeStr
                    };
            //RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            if(n.data.lkjType!=1)
            	RTU.invoke("app.lkjyunxingjilu.query.activate",sendData);
            else
            	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
            };
	});
    /**
     * 运行记录
     */
    RTU.register("app.realtimelocomotivequery.query.yxll", function () {
    	return function(n){
                var sendData={
                        locoTypeid:n.data.locoTypeid,
                        locoNo:n.data.locoNo,
                        locoAb:n.data.locoAb,
                        locoTypename:n.data.locoTypeName,
                        kehuo:n.data.kehuo,
                        date:n.data.lkjTimeStr
                    };
            //RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            if(n.data.lkjType!=1)
            	RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
            else
            	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
            };
	});
    /**
     * 文件上传
     */
    RTU.register("app.realtimelocomotivequery.query.wjsc", function () {
    	return function(n){
    		var _html='<iframe id="downloadiframe" name="downloadiframe" width="100%" height="100%" src="../app/modules/tscupdate/tscupdate_map.html?type=map" frameborder="0" data-id="inner.html" 	seamless></iframe>';
    		if(!!window.popuwnd_file){
    			window.popuwnd_file.close();
            }
    		window.popuwnd_file = new PopuWnd({
                title: "文件上传["+n.data.locoTypeStr+"]",
                html: _html,
                width: 850,
                height:460,
                left: 500,
                top: 50,
                shadow: true
            });
    		window.popuwnd_file.init();
    		//var downloadFrame = $("#downloadiframe")[0].contentWindow;
			// 每刷新一次就请求后台是否有最新文件需要更新上半部分列表
			//downloadFrame.selectedObj = n;
			//downloadFrame.reloadsearchTable2();
    	}
    });
    /**
     * 文件下载
     */
    RTU.register("app.realtimelocomotivequery.query.wjxz", function () {
    	return function(n){
    		var _html='<iframe id="downloadiframe" name="downloadiframe" width="100%" height="100%" src="../app/modules/lkjfiledownload/lkjdownload_map.html?type=map" frameborder="0" data-id="inner.html" 	seamless></iframe>';
    		if(!!window.popuwnd_file){
    			window.popuwnd_file.close();
            }
        	window.popuwnd_file = new PopuWnd({
                title: "文件下载["+n.data.locoTypeStr+"]",
                html: _html,
                width: 850,
                height:460,
                left: 500,
                top: 50,
                shadow: true
            });
    		window.popuwnd_file.init();
    		//var downloadFrame = $("#downloadiframe").find("iframe:first")[0].contentWindow;
			// 每刷新一次就请求后台是否有最新文件需要更新上半部分列表
			//downloadFrame.selectedObj = n;
			//downloadFrame.reloadsearchTable2();
    	}
    });
    
    /**
     * 添加关注
     */
    RTU.register("app.realtimelocomotivequery.query.jcgz", function () {
    	return function(n){
    		var updateData=n.data.locoTypeStr;//添加的关注机车
    		if(RTU.data.user.attentionLocos.indexOf(updateData)>=0){
    			RTU.invoke("header.notice.show", "机车己关注!");
    			return ;
    		}else{
    			if(RTU.data.user.attentionLocos!=""){
    				updateData=updateData+","+RTU.data.user.attentionLocos;
    			}
    			if(updateData.split(",").length>300){
            		RTU.invoke("header.notice.show", "最多允许关注300台机车!");
            		return;
            	}    			
    		}
    		RTU.invoke("core.router.post",{
                url: "setting/saveAttentionLocos",
                data: {
                	"userId":RTU.data.user.id,
                	"locos":updateData
                },
                success: function (obj) {
                	if(obj.success){
                    	window.RTU.data.user.attentionLocos=updateData;
                    	RTU.invoke("header.notice.show", "添加关注成功!");
                    	//己初始化关注列表
                        if (window.RealtimeAttentionList && window.RealtimeAttentionList.datas && window.RealtimeAttentionList.datas.length > 0) {
                        	window.firstAttentionData.push(dataArr[n.data]);
                        } else {//未初始化关注列表
                        	window.firstAttentionData=[n.data];
                            RTU.invoke("app.realtimelocomotivequery.query.refreshAttention", [n.data]);
                        }
                	}else{
                		RTU.invoke("header.notice.show", "添加关注失败,请重试!");
                	}
                },
                error: function () {
                    RTU.invoke("header.notice.show", "保存失败!");
                }
        	});
    	}
    });
    /**
     * 取消关注
     */
    RTU.register("app.realtimelocomotivequery.query.qxgz", function () {
    	return function(n){
    		var selectTr = n;
    		var onlineCount=parseInt($("#realtime_rt_online_count1").text());
            var outlineCount=parseInt($("#realtime_rt_offline_count1").text());
            var temp = window.firstAttentionData;
            var updateData=RTU.data.user.attentionLocos;
    		var data = selectTr.data;   
            for (var j = 0, lenlen = temp.length; j < lenlen; j++) {
            	var locoStr=data.locoTypeStr;
            	if (locoStr== temp[j].locoTypeStr) {
                	window.firstAttentionData.splice(j, 1); //移除选中的数据
                	if(window.firstAttentionData.length!=0){
                		updateData=
                			updateData.replace(","+locoStr,"");
                		updateData=
                			updateData.replace(locoStr+",","");
                		if(data.isOnline=="1"||data.isOnline=="2")onlineCount--;
                		else outlineCount--;
                	}else{
                		updateData="";
                		outlineCount=onlineCount=0;
                	}
                	break;
                }
            }    
            RTU.invoke("core.router.post",{
                url: "setting/saveAttentionLocos",
                data: {
                	"userId":RTU.data.user.id,
                	"locos":updateData
                },
                success: function (obj) {
                	$("#realtime_rt_all_count1").text(outlineCount+onlineCount);
                    $("#realtime_rt_online_count1").text(onlineCount);
                    $("#realtime_rt_offline_count1").text(outlineCount);
                	window.RTU.data.user.attentionLocos=updateData;
                	RTU.invoke("header.notice.show", "取消关注成功!");
                },
                error: function () {
                    RTU.invoke("header.notice.show", "保存失败!");
                }
        	});
            RTU.invoke("app.realtimelocomotivequery.query.refreshMarker", window.firstAttentionData);
            RTU.invoke("app.realtimelocomotivequery.query.refreshAttention",window.firstAttentionData);
    	}
    });
    /**
     * 显示按钮菜单
     */
    RTU.register("app.realtimelocomotivequery.query.showMenu", function () {
    	return function(data){
    		if(window.attention){
    			if(RTU.data.user.attentionLocos.indexOf(data.data.locoTypeStr)>=0){
    				$("#gz1").hide();
    			}else{
    				$("#gz1").show();
    			}
    			$("#gz2").hide();
    		}else{
    			$("#gz1").hide();
    			$("#gz2").show();
    		}
    		var gz=window.attention?"":"gz_";
    		var clientY= $("#"+gz+data.data.locoTypeStr).offset().top-30;
    		var clientX  = $("#"+gz+data.data.locoTypeStr).position().left+120;
    		var rightDiv=$("#content-locospread-rightClickDiv");
    		var width=$(rightDiv).width();
    		var height=$(rightDiv).height(); 
    		var width1 = document.documentElement.clientWidth*0.9  ;
    		var height1 = document.documentElement.clientHeight;
    	  if((clientX+width)>width1){
    		$(rightDiv).css({"left":(clientX-50-width)+"px"});
    	  }else{
    		$(rightDiv).css({"left":(clientX+20)+"px"});
    	  }
    	  if((clientY+height)>height1){
    		$(rightDiv).css({"top":(clientY-height)+"px"});
    	  }else{
    		$(rightDiv).css({"top":(clientY-30)+"px"});
    	  }
    	 $(rightDiv).removeClass("hidden");
    		$("body").click(function(e){
    			var source = e.srcElement;
    			var temp = source;
    			while(temp&&temp.nodeName!='BODY'){
    				if(temp.getAttribute("class")=="RTGrid_Bodydiv"){
    					if(source.nodeName=='INPUT')return true;
    					else return false;
    				}else{
    					temp = temp.parentNode;
    				}
    			}
    		    $("#content-locospread-rightClickDiv").addClass("hidden");
    	 });
    	}
    });
});
//var selectData=null;//被选择的数据对象
function btnClick(type){
	if(type!="1"&&type!="8"&&type!="9"&&!top.FrontCommon.hasRight(top.settingData,"030"+type)){
		top.layer.alert("没有权限！", {icon: 2});
		return;
	}
	if(type=="1"){//运行信息
		RTU.invoke("app.realtimelocomotivequery.query.yxxx");
	}else if(type=="7"){//添加关注
		RTU.invoke("app.realtimelocomotivequery.query.jcgz",window.selectData);
		 try{
         	//刷新详情子页面                        	
				if($("#popuwndLocoInfo")[0].contentWindow){
					$("#popuwndLocoInfo")[0].contentWindow.gzState(true);
				}
         }catch(e){//alert(e);
         }
	}else if(type=="2"){//运行曲线
		RTU.invoke("app.realtimelocomotivequery.query.yxqx",window.selectData);
	}else if(type=="3"){//文件上传
		RTU.invoke("app.realtimelocomotivequery.query.wjsc",window.selectData);
	}else if(type=="4"){//文件下载
		RTU.invoke("app.realtimelocomotivequery.query.wjxz",window.selectData);
	}else if(type=="9"){//实时lkj分析记录
		RTU.invoke("app.realtimelocomotivequery.query.ssjl",window.selectData);
	}else if(type=="6"){//机车记录
		RTU.invoke("app.realtimelocomotivequery.query.yxll",window.selectData);
	}else if(type=="8"){//取消观注
		RTU.invoke("app.realtimelocomotivequery.query.qxgz",window.selectData);
		 try{
         	//刷新详情子页面                        	
				if($("#popuwndLocoInfo")[0].contentWindow){
					$("#popuwndLocoInfo")[0].contentWindow.gzState(false);
				}
         }catch(e){//alert(e);
         }
	}
}