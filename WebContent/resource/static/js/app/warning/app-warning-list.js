RTU.DEFINE(function (require, exports) {
/**
 * 模块名：首页报警
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
    
    window.warningPopuwnd;
    window.warnDatas;
    var tempAlarmTime;
    
    RTU.register("app.warnning.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                            
                        }
                    }
                });
            }
        };
    });
    //创建查询窗口
    RTU.register("app.warnning.query.activate", function () {
        return function () {
//        	
            //查询窗口
            RTU.invoke("app.warnning.loadHtml", { url: "../app/modules/warnning/app-warning-list.html", fn: function (html) {
            	$html = $(html);
            	var widthScreen = $("body").width();
            	var heightScreen = $("body").height();
            	if (!window.warningPopuwnd) {
                	window.warningPopuwnd = new PopuWnd({
                        title: "报警列表",
                        html: html,
                        /*width:300,*/
                        width: 350,
                        height: 0,
                        /*left: widthScreen-320,*/
                        left: widthScreen-370,
                        top: heightScreen+15,//heightScreen-480,
                        shadow: true
                    });
                	/*window.warningPopuwnd.remove = window.warningPopuwnd.close;
                	window.warningPopuwnd.close = window.warningPopuwnd.hidden;*/
                	window.warningPopuwnd.init();
                	/*window.warningPopuwnd.$wnd.find(".popuwnd-title-text")
                	.append("<div><input type='radio' checked value='1' " +
                			"id='versionAlarmRadio'/><label style='cursor:pointer'" +
                			" for='versionAlarmRadio'>版本报警</label>&nbsp;&nbsp;" +
                			"<input type='radio' value='2' " +
                			"id='locoregAlarmRaido'/><label style='cursor:pointer'" +
                			" for='locoregAlarmRaido'>机车注册报警</label></div>");*/
                }else {
                	window.warningPopuwnd.init();
                }
            	$("input[name='alarm_simpRadio']").unbind("click").bind("click",function(){
            		if($("#versionAlarmRadio").attr("checked")){
            			$("#warningTableTe").removeClass("hidden");
            			$("#warningTableTe-locoreg,#warningTableTe-wheel").addClass("hidden");
            		}
            		else if($("#locoregAlarmRadio").attr("checked")){
            			$("#warningTableTe-locoreg").removeClass("hidden");
            			$("#warningTableTe,#warningTableTe-wheel").addClass("hidden");
            		}
            		else{
            			$("#warningTableTe-wheel").removeClass("hidden");
            			$("#warningTableTe,#warningTableTe-locoreg").addClass("hidden");
            		}
            	});
                //加载数据
//            	window.warnDatas();
            	 window.psModel.searchNow({ topic: "warnData", trDataTemp: window.warnTrItem,token: window.warnPsModel });
            	
             // 重写关闭的方法
                window.warningPopuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	window.warningPopuwnd.close();
                	/*window.warningPopuwnd=undefined;*/
                	window.sendFaulureWarnningObjData=undefined;
                });
            }
            });
            
           
           
        };
    });
     var verAlarmFirstFlag=true;
//    window.warnDatas = function () {
	    window.warnPsModel = window.psModel.subscribe("warnData", function (t, data, TotalData) {
//	    	 if (data.length == 0) {
//                 $(".header_nav_notice_num").addClass("header_nav_notice_num_none");
//                 $(".showRed").addClass("hidden");
//             } 
//    		 $(".header_nav_notice_num").text(data.length);
    		/*window.warningDataLength=data.length;*/
	    	if(!TotalData)return;
	    	if(!RTU.invoke("app.setting.data","lkjequipmentversionhistoryquery")
	    			&&!RTU.invoke("app.setting.data","locoregmanagement")){
	    		return;
	    	}
	    	else{
	    		if(!RTU.invoke("app.setting.data","lkjequipmentversionhistoryquery")){
	    			$("#versionAlarmRadio,#versionAlarmLabel").hide();
	    			$("#locoregAlarmRadio,#locoregAlarmLabel").show();
	    			$("#locoregAlarmRadio").click();
	    		}
	    		else if(!RTU.invoke("app.setting.data","locoregmanagement")){
	    			$("#versionAlarmRadio,#versionAlarmLabel").show();
	    			$("#locoregAlarmRadio,#locoregAlarmLabel").hide();
	    			$("#versionAlarmRadio").click();
	    		}
	    		else{
	    			$("#versionAlarmRadio,#versionAlarmLabel,#locoregAlarmRadio,#locoregAlarmLabel").show();
	    			/*$("#locoregAlarmRadio,#locoregAlarmLabel").show();*/
	    		}
	    	}
	    	window.warningDataLength=TotalData.totalRecords;
	    	var str="";
	    	var locoRegStr="";
	    	var wheelStr="";
	    	var imgurl0bj = {"1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
	        
	    	/*if(data.length < 10){
	    		if (data.length == 0) {
	    			$(".header_nav_notice_num").addClass("header_nav_notice_num_none");
	    			$(".showRed").addClass("hidden");
	    		} 
	    		$(".showRed").removeClass("hidden");
	    		$(".header_nav_notice_num").text(data.length);
	    	}else {
	    		if(TotalData.totalPage>1){
           			$(".header_nav_notice_num").text(data.length+"+");
           		}else{
           			$(".header_nav_notice_num").text(data.length);
           		}
	    		$(".header_nav_notice_num").text(data.length);
//	    		$(".header_nav_notice_num").text(data.length+"+");
	    		$(".showRed").removeClass("hidden");
	    	}*/
	    	if(TotalData.totalRecords < 10){
	    		if (TotalData.totalRecords == 0) {
	    			$(".header_nav_notice_num").addClass("header_nav_notice_num_none");
	    			$(".showRed").addClass("hidden");
	    		} 
	    		$(".showRed").removeClass("hidden");
	    		/*$(".header_nav_notice_num").text(TotalData.totalRecords);*/
	    		$(".header_nav_notice_num").text(TotalData.data.length);
	    	}else {
	    		/*if(TotalData.totalPage>1){
           			$(".header_nav_notice_num").text(data.length+"+");
           		}else{
           			$(".header_nav_notice_num").text(data.length);
           		}*/
	    		/*$(".header_nav_notice_num").text(TotalData.totalRecords);*/
	    		$(".header_nav_notice_num").text(TotalData.data.length);
//	    		$(".header_nav_notice_num").text(data.length+"+");
	    		$(".showRed").removeClass("hidden");
	    	}
	    	var locoRegAlarmCount=0;
	        $.each(data, function (i, item) {
	        	
	        	//===============================================新警告弹出框start===================================================================
	        	if(tempAlarmTime == undefined){
	        		tempAlarmTime = data[0].alarmTime;
	        	}
	        	
	        	var endTime = data[0].alarmTime;
	        	var beginTime = tempAlarmTime;
	        	var beginTimes = beginTime.substring(0, 10).split('-');
	        	var endTimes = endTime.substring(0, 10).split('-');

	        	beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
	        	endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);

	        	var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
	        	
	        	if(a>0){
	        		if(window.warningPopuwnd){
	        			window.warningPopuwnd.close();
	                	/*window.warningPopuwnd=undefined;*/
	                	window.sendFaulureWarnningObjData=undefined;
	            	}
	    			RTU.invoke("app.warnning.query.activate");
	        		tempAlarmTime=data[0].alarmTime;
	        	}
	        	//===============================================新警告弹出框end===================================================================
	        	
	        	if(i==0){
	        		tempAlarmTime=item.alarmTime;
	        	}
	        	var imgUrl="";
	            var time=item.alarmTime;
	            var monthTime=time.substr(5, 5).replace("-","/");
	            var mini=time.substr(10, 9).replace("-","/");
	            if(item.isOnline == 1){   //isOnline字段，1=在线，2=离线
	            	imgUrl="../static/img/app/failureWarnning-images/train_04.png";
	            }else{
	            	imgUrl="../static/img/app/failureWarnning-images/train_03.png";
	            }
            	
            	if(item.alarmType!=undefined){
            		//说明是版本报警
            		/*str+=  "<div locoName='"+item.locoName+"' versionAlarm='' class='div_main'>" +
            				"<img alt='' src='"+imgUrl+"'><div class='tt'><div class='text-font-color'>"+item.locoName+"("+item.alarmCount+"次)"
            				+"</div></div><div class='tr-div'><table class='main-table'><tr><td class='text-align-td'>"+item.checiName+
            				"</td><td>"+monthTime+"</td><td>"+mini+"</td><td></td></tr>" +
            				"<tr rowspan='3'><td class='text-align-right'>描&nbsp;&nbsp;述："
            				+"</td><td colspan='3' class='text-align-td' style='text-align:left;'>"+item.alarmDesc+"</td></tr></table></div></div>";*/
            		/*str+=  "<div locoName='"+item.locoName+"' versionAlarm='' class='div_main'>" +
    				"<img alt='' src='"+imgUrl+"'><div class='tt'><div class='text-font-color'>"+item.locoName+"("+item.alarmCount+"次)"
    				+"</div></div><div class='tr-div'><table class='main-table'><tr><td  class='text-align-td'>"+item.checiName+
    				"</td><td colspan='3'>"+item.alarmTime+"</td></tr>";
            		for(var m=0;m<item.alarmCodeVos.length;m++){
            			str+="<tr style='height:"+(80/item.alarmCodeVos.length)+"%'><td style='width:40%;color:red' class='text-align-right'>"
            			+item.alarmCodeVos[m].alarmName+"("+item.alarmCodeVos[m].alarmCount+"次)"
            				+"</td><td colspan='3'  style='text-align:left;'>"+item.alarmCodeVos[m].alarmDesc+"</td></tr>";
            		};
            		str+="</table></div></div>";*/
            		if(item.alarmType==1){
            			//版本报警
        				str+=  "<div recId='"+item.recId+"' alarmType='"+item.alarmType+"' locoName='"+item.locoName+"' versionAlarm='' class='div_main'>" +
        				"<img alt='' src='"+imgUrl+"'><div class='tt'><div class='text-font-color'>"+item.locoName
        				+"</div></div><div class='tr-div'><table class='main-table'><tr><td  class='text-align-td'>"+item.checiName+
        				"</td><td colspan='3'>"+item.alarmTime+"</td></tr>";
                		for(var m=0;m<item.alarmCodeVos.length;m++){
                			str+="<tr style='height:"+(80/item.alarmCodeVos.length)+"%'><td style='width:40%;color:red' class='text-align-right'>"
                			+item.alarmCodeVos[m].alarmName
                				+"</td><td colspan='3'  style='text-align:left;'>"+item.alarmCodeVos[m].alarmDesc+"</td></tr>";
                		};
                		str+="</table></div></div>";
                		$("#warningTableTe").html(str);
            	        $($("#warningTableTe").parents(".popuwnd")).css({"height":$("#warningTableTe")
            	        	.css("height"),"max-height":"470px","top":(parseInt($("body").height())
            	        			-parseInt("25px")-parseInt($("#warningTableTe").css("height")))+"px"});
            			/*if($("#warningTableTe-locoreg div").length==0){
            				$($("#warningTableTe-locoreg").parents(".popuwnd")).css({"height":$("#warningTableTe")
                	        	.css("height"),"max-height":"250px","top":(parseInt($("body").height())
                	        			-parseInt("25px")-parseInt($("#warningTableTe").css("height")))+"px"});
            			}*/
            		}
            		else if(item.alarmType==2){
            			if(locoRegAlarmCount<10){
            				//TSC注册报警
                			locoRegStr+=  "<div recId='"+item.recId+"' alarmType='"+item.alarmType+"' locoName='"+item.locoName+"' versionAlarm='' class='div_main'>" +
            				"<img alt='' src='"+imgUrl+"'><div class='tt'><div class='text-font-color'>"+item.locoName
            				+"</div></div><div class='tr-div'><table style='height:150px;' class='main-table'><tr><td  class='text-align-td'>"+item.checiName+
            				"</td><td colspan='3'>"+item.alarmTime+"</td></tr>";
                    		for(var m=0;m<item.alarmCodeVos.length;m++){
                    			locoRegStr+="<tr style='height:"+(80/item.alarmCodeVos.length)+"%'><td style='width:40%;color:red' class='text-align-right'>"
                    			+item.alarmCodeVos[m].alarmName
                    				+"</td><td colspan='3'  style='text-align:left;'>"+item.alarmCodeVos[m].alarmDesc+"</td></tr>";
                    		};
                    		locoRegStr+="</table></div></div>";
                    		$("#warningTableTe-locoreg").html(locoRegStr);
                	        $($("#warningTableTe-locoreg").parents(".popuwnd")).css({"height":$("#warningTableTe-locoreg")
                	        	.css("height"),"max-height":"250px","top":(parseInt($("body").height())
                	        			-parseInt("25px")-parseInt($("#warningTableTe-locoreg").css("height")))+"px"});
                	        locoRegAlarmCount++;
            			}
            		}
            		else{
            			//轮径报警
            			wheelStr+=  "<div recId='"+item.recId+"' alarmType='"+item.alarmType+"' locoName='"+item.locoName+"' versionAlarm='' class='div_main'>" +
        				"<img alt='' src='"+imgUrl+"'><div class='tt'><div class='text-font-color'>"+item.locoName
        				+"</div></div><div class='tr-div'><table class='main-table'><tr><td  class='text-align-td'>"+item.checiName+
        				"</td><td colspan='3'>"+item.alarmTime+"</td></tr>";
                		for(var m=0;m<item.alarmCodeVos.length;m++){
                			wheelStr+="<tr style='height:"+(80/item.alarmCodeVos.length)+"%'><td style='width:40%;color:red' class='text-align-right'>"
                			+item.alarmCodeVos[m].alarmName
                				+"</td><td colspan='3'  style='text-align:left;'>"+item.alarmCodeVos[m].alarmDesc+"</td></tr>";
                		};
                		wheelStr+="</table></div></div>";
                		$("#warningTableTe-wheel").html(wheelStr);
            	        $($("#warningTableTe-wheel").parents(".popuwnd")).css({"height":$("#warningTableTe-wheel")
            	        	.css("height"),"max-height":"470px","top":(parseInt($("body").height())
            	        			-parseInt("25px")-parseInt($("#warningTableTe-wheel").css("height")))+"px"});
            		}
            	}
            	else{//说明是LKJ报警
            		var imgSignHtml = "";
    	            var imgurlSign = imgurl0bj[item.lightColor.toString()];
    	            if(imgurlSign != null){
    	        		var imgPathSign = "../static/img/app/moveCurve/"+imgurlSign;
    	        		imgSignHtml = "<img src='"+imgPathSign+"' style='width:16px;height:16px;position:inherit;left:auto;right:auto;vertical-align:middle;'/>";
    	    		}
    	            var locoTypeNameAndLocoNoAndLocoAb=item.ttypeShortname+"-"+item.locoNo;
                	if (item.locoAb !="1"&&item.locoAb!="2") {
                    } else if (item.locoAb == "1") {
                    	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
                    } else {
                    	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_B;
                    }
                	var desc=[];
                	if(item.alarmDesc!=""){
                		 desc=item.alarmDesc.split("|");
                	}
            		if(item.alarmCode=="9001"){
    	       	 		var d="";
    	       	 		if(desc[1]){
    	       	 			d=desc[1];
    	       	 		}
    	       	 		
    	       	 		d = d.replace(/</g, '&lt;');
    	       	 		d = d.replace(/>/g, '&gt;');
    	       	 		
    		       	 	str+=  "<div class='div_main' style='min-height: 185px;' alarmCode='"+item.alarmCode+"' ttypeShortname='"+item.ttypeShortname+"' locoTypeid='"+item.locoTypeid+"' locoNo='"+item.locoNo+"' checiName='"+item.checiName+"'>" +
    	   	 			"<img alt='' src='"+imgUrl+"'>" +
    					"<div class='tt'><div class='text-font-color'>"+locoTypeNameAndLocoNoAndLocoAb+"</div></div><div class='tr-div'>" +
    					"<table class='main-table'><tr><td class='text-align-td'>"+item.checiName+"</td><td>"+monthTime+"</td><td>"+mini+"</td><td>"+item.aalarmName+"</td></tr>" +
    					"<tr><td class='text-align-right'>详&nbsp;&nbsp;情：</td><td class='text-font-color' colspan='3'>"+d +"</td></tr>" +
    					"<tr><td class='text-align-right'>线&nbsp;&nbsp;路：</td><td class='text-font-color'>"+item.lname+"</td><td class='text-align-right'>位&nbsp;&nbsp;置：</td><td class='text-font-color'>"+item.sname+"</td></tr>" +
    					"<tr><td class='text-align-right'>速&nbsp;&nbsp;度：</td><td class='text-font-color'>"+item.speed+"</td><td class='text-align-right'>信&nbsp;&nbsp;号：</td><td class='text-font-color'>"+imgSignHtml+"</td></tr>" +
    					"<tr><td class='text-align-right'>里&nbsp;&nbsp;程：</td><td class='text-font-color'>"+item.kiloSign+"</td><td class='text-align-right'>状&nbsp;&nbsp;态：</td><td class='text-font-color'>"+item.jkState+"</td></tr>" +
    					"</table></div></div>";
    	       	 	}else{
    		       	 	str+=  "<div class='div_main' alarmCode='"+item.alarmCode+"' ttypeShortname='"+item.ttypeShortname+"' locoTypeid='"+item.locoTypeid+"' locoNo='"+item.locoNo+"' checiName='"+item.checiName+"'>" +
    	   	 			"<img alt='' src='"+imgUrl+"'>" +
    					"<div class='tt'><div class='text-font-color'>"+locoTypeNameAndLocoNoAndLocoAb+"</div></div><div class='tr-div'>" +
    					"<table class='main-table'><tr><td class='text-align-td'>"+item.checiName+"</td><td>"+monthTime+"</td><td>"+mini+"</td><td>"+item.aalarmName+"</td></tr>" +
    					"<tr><td class='text-align-right'>线&nbsp;&nbsp;路：</td><td class='text-font-color'>"+item.lname+"</td><td class='text-align-right'>位&nbsp;&nbsp;置：</td><td class='text-font-color'>"+item.sname+"</td></tr>" +
    					"<tr><td class='text-align-right'>速&nbsp;&nbsp;度：</td><td class='text-font-color'>"+item.speed+"</td><td class='text-align-right'>信&nbsp;&nbsp;号：</td><td class='text-font-color'>"+imgSignHtml+"</td></tr>" +
    					"<tr><td class='text-align-right'>里&nbsp;&nbsp;程：</td><td class='text-font-color'>"+item.kiloSign+"</td><td class='text-align-right'>状&nbsp;&nbsp;态：</td><td class='text-font-color'>"+item.jkState+"</td></tr>" +
    					"</table></div></div>";
    	       	 	}
            	}
	        });
	        
	        /*$(".warning-divBody").html(str);
	        
	        $($("#warningTableTe").parents(".popuwnd")).css({"height":$("#warningTableTe")
	        	.css("height"),"max-height":"470px","top":(parseInt($("body").height())
	        			-parseInt("25px")-parseInt($("#warningTableTe").css("height")))+"px"});*/
		 
	       
	        //行点击
	        $(".div_main").click(function(){
	        	if($(this).attr("alarmType")!=undefined){
	        		if($(this).attr("alarmType")==1){
	        			var sendVersionWarningData= {
			        			locoName:$(this).attr("locoName"),
			        			
			        	};
			        	window.sendVersionWarningData=sendVersionWarningData;
			        	RTU.invoke("app.module.active","lkjequipmentversionhistoryquery");
	        		}
	        		else if($(this).attr("alarmType")==2){
	        			/*var sendLocoRegWarningData= {
			        			locoName:$(this).attr("locoName"),
			        			recId:$(this).attr("recId")
			        	};
			        	window.sendLocoRegWarningData=sendLocoRegWarningData;
			        	RTU.invoke("app.module.active","locoregmanagement");*/
	        			window.open("modules/locoregmanagement/locoalarmreg.html?recId="+$(this).attr("recId"));
	        		}
	        		else{
	        			var sendFaulureWarnningObjData= {
			        			ttypeShortname: $(this).attr("ttypeShortname"),
			        			locoTypeid:  $(this).attr("locoTypeid"),
			        			locoNo: $(this).attr("locoNo"),
			        			checiName:  $(this).attr("checiName"),
			        			alarmCode:$(this).attr("alarmCode")
			        	};
			        	window.sendFaulureWarnningObjData=sendFaulureWarnningObjData;
			        	RTU.invoke("app.module.active","failurewarning");
	        		}
	        	}
	        	else{
	        		var sendFaulureWarnningObjData= {
		        			ttypeShortname: $(this).attr("ttypeShortname"),
		        			locoTypeid:  $(this).attr("locoTypeid"),
		        			locoNo: $(this).attr("locoNo"),
		        			checiName:  $(this).attr("checiName"),
		        			alarmCode:$(this).attr("alarmCode")
		        	};
		        	window.sendFaulureWarnningObjData=sendFaulureWarnningObjData;
		        	RTU.invoke("app.module.active","failurewarning");
	        	}
	        	
//	        	setTimeout(function(){
//	        		RTU.invoke("app.failurewarning.query.otherSendparam",sendFaulureWarnningObjData);
//	        	},300);
	        });
	        
	        
	    },function(){
	    	return [{ name: "confirmFlag", value:"0"}];
	    });
	    window.psModel.searchNow({ topic: "warnData", trDataTemp: window.warnTrItem,token: window.warnPsModel });
//    };

    
   
    
//    if(!window.warningPopuwnd){
//    	 window.interval= setInterval(function () {
//	    	getData();
//	      }, 1000);
//    }
   
    
//    function getData() {
//        $.ajax({
//            url: "../alarmLkjView/findByProperty?page=1&pageSize=5&confirmFlag=0",
//            dataType: "jsonp",
//            type: "GET",
//            success: function (data) {
//            	if(tempAlarmTime == undefined){
//            		tempAlarmTime=data.data[0].alarmTime;
//            	}
//            	
//            	var endTime = data.data[0].alarmTime;
//            	var beginTime = tempAlarmTime;
//            	var beginTimes = beginTime.substring(0, 10).split('-');
//            	var endTimes = endTime.substring(0, 10).split('-');
//
//            	beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + beginTime.substring(10, 19);
//            	endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + endTime.substring(10, 19);
//
//            	var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
//            	
//            	if(a>0){
//        			RTU.invoke("app.warnning.query.activate");
//            		tempAlarmTime=data.data[0].alarmTime;
//            	}
//            }
//        });
//    }
    
});
