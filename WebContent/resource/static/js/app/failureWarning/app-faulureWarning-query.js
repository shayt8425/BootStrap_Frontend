RTU.DEFINE(function (require, exports) {
/**
 * 模块名：故障报警
 * name：failurewarning
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../../../css/app/failureWarning/failureWarning.css");
    require("app/loading/list-loading.js");
    require("app/curve/moveCurve/moveCurve.js");  
    require("../../../css/app/moveCurve/moveCurve.css");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    
    var $html;
    var popuwnd;
    var data;
    var timer=5000;
    var intervalTimer_faulureWarning = undefined;
    
    var imgurl0bj = {"1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
    
    RTU.register("app.failurewarning.query.initOne", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/failureWarning/app-failureWarnning-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    //根据屏幕大小来设定窗口中内容，各个Div的大小
                    /*$(".failureWarnning-MainDiv").css("width",(document.documentElement.clientWidth * 0.85-6)+"px");*/
                    $("#failureWarnning-right").css("width",($(".failureWarnning-MainDiv").width()-196)+"px");
                    $("#failureWarnning-left").css("height",($(".failureWarnning-MainDiv").height()-46)+"px");
                    $("#failureWarnning-right").css("height",($(".failureWarnning-MainDiv").height()-44)+"px");
                    $(".failureWarnning-left-result").css("height",($("#failureWarnning-left").height()-218)+"px");
                    $(".failureWarnning-left-result-div").css("height",($(".failureWarnning-left-result").height()-30)+"px");
                    $("#failureWarnning-lineSelect-content").css({"height":($("#failureWarnning-lineSelect").height()-9)+"px","width":($("#failureWarnning-lineSelect").width()-9)+"px"});
                    $("#failureWarnning-typeSelect-content").css({"height":($("#failureWarnning-typeSelect").height()-9)+"px","width":($("#failureWarnning-typeSelect").width()-9)+"px"});
                    $("#failureWarnning-right-Div2-content").css("height",($("#failureWarnning-right").height()-43)+"px");
                    /*$(".failureWarnning-right-Div2-content-sub").css({"width":($(".failureWarnning-MainDiv").width()-196)+"px","height":($("#failureWarnning-right").height()-43)+"px"});*/
                    
                    $("#failureWarnning-right-Div4-content").css("height",($("#failureWarnning-right").height()-43)+"px");
                    /*$(".failureWarnning-right-Div4-content-sub").css({"width":($(".failureWarnning-MainDiv").width()-196)+"px","height":($("#failureWarnning-right").height()-43)+"px"});*/

                    $("#failureWarnning-right-Div3-content").css("height",($("#failureWarnning-right").height()-43)+"px");
                    /*$(".failureWarnning-right-Div3-content-sub").css({"width":($(".failureWarnning-MainDiv").width()-196)+"px","height":($("#failureWarnning-right").height()-43)+"px"});*/
                    
                    RTU.invoke("app.failurewarning.query.initHtml",$html);
                	$("body div").mousedown(function(){
    					$("#failureWarnning-right-Div1-rightClick").hide();
    				});
                	
                }
            }
        });
        return function () {
            return true;
        };
    });

    var width;
    var height;
    var widthLeft;
    var heightLeft;
    RTU.register("app.failurewarning.query.activate", function () {
    	function initBtnClick(){
    		if($(".w_do_but").length>0||$(".w_look").length>0){
    			RTU.invoke("app.failurewarning.query.initDealBut");
    		}
    		else setTimeout(
    				function(){
    					initBtnClick();
    					},100);
    	};
        return function () {
//        	RTU.invoke("header.msg.hidden");
//        	RTU.invoke("header.msg.show","请稍后。。");
/*            width = document.documentElement.clientWidth * 0.85;
            height = document.documentElement.clientHeight * 0.85;*/
            width = document.documentElement.clientWidth;
            height = document.body.clientHeight+document.body.clientTop-35;
            
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data&&data.alias?data.alias:"故障报警",
                    html: $html,
                    width: width,
                    height: height,
                    left: 0,
                    top: 35,
                    shadow: true
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
            } else {
            	/*$(popuwnd.$wnd).find("div.containGridDiv").html("");*/
                popuwnd.init();
                setTimeout(function(){
	                RTU.invoke("app.failurewarning.query.otherSendparam");
	                initBtnClick();
                },100);
            }
            
        	var navTitle = $(".popuwnd-title", popuwnd.$wnd);
        	var navShadow = $(".box_shadow", popuwnd.$wnd);
            navTitle.css("height","15px");
            navTitle.attr("style","top:-10px; opacity: 0");
            navShadow.attr("style","top:-10px; opacity: 0");
            popuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                 clearInterval(intervalTimer_faulureWarning);
                 intervalTimer_faulureWarning = undefined;
                 RTU.invoke("app.failurewarning.query.clearConditions");
                 window.sendFaulureWarnningObjData=null;
            });
            RTU.invoke("app.failurewarning.query.toggleSize");            
        };
    });
    
    //控制放大缩小
    RTU.register("app.failurewarning.query.toggleSize", function () {
        return function () {
            var delbtn = $(".popuwnd-title-del-btn", popuwnd.$wnd);
            delbtn.addClass("popuwnd-title-del-btn2").css({ right: "-2px", top: "0px", height: "20px", width: "33px" });
            delbtn.parent().append("<div class='amplifyWin'></div>");
            var btn = $(".amplifyWin", delbtn.parent()).addClass("amplifyWin_larger");
            var width = document.documentElement.clientWidth * 0.85;
            var height = document.documentElement.clientHeight * 0.85;
            btn.click(function () {
                btn.outDiv = $(".failureWarnning-MainDiv", popuwnd.$wnd);
                if (btn.hasClass("amplifyWin_larger")) {//缩小
                    btn.removeClass("amplifyWin_larger").addClass("amplifyWin_small");
                    popuwnd.setSize(300, 5);
                    btn.outDiv.hide();
                } else {//放大
                    btn.removeClass("amplifyWin_small").addClass("amplifyWin_larger");
                    setTimeout(function () {
                    	btn.outDiv.show();
                    	popuwnd.setSize(width, height);
                    }, 25);
                }
            });
        };
    });
    
    //初始化
    RTU.register("app.failurewarning.query.initHtml",function(){
    	return function(){
    		$("#closeBtn_failure").unbind("click").click(function(){
    			popuwnd.$wnd.find(".popuwnd-title-del-btn").click();
    		});
    		RTU.invoke("app.failurewarning.query.initTopHover",$html);
    		RTU.invoke("app.failurewarning.query.initButEvent");
    		RTU.invoke("app.failurewarning.query.searchLine");
    		RTU.invoke("app.failurewarning.query.searchTraintype");
    		RTU.invoke("app.failurewarning.query.otherSendparam");
    		RTU.invoke("app.failurewarning.query.createIntervalTimer_faulureWarning");
//    		setTimeout(function(){
//    			RTU.invoke("app.failurewarning.query.searchLeftResult");
//    			RTU.invoke("app.failurewarning.query.initRightList");
//    		},30);
    	};
    });
    
    //首页报警点击后跳转入口
    RTU.register("app.failurewarning.query.otherSendparam",function(){
    	return function(sendFaulureWarnningObjData1){
    		var sendFaulureWarnningObjData=null;
    		if(sendFaulureWarnningObjData1){
    			sendFaulureWarnningObjData=sendFaulureWarnningObjData1;
    		}else if(window.sendFaulureWarnningObjData){
    			sendFaulureWarnningObjData = window.sendFaulureWarnningObjData;
    		}
    		if(window.sendFaulureWarnningObjData){
    			window.sendFaulureWarnningObjData = null;
    		}
    		
       		if(sendFaulureWarnningObjData){
        			$("#selectedTraintype").attr("alt",sendFaulureWarnningObjData.locoTypeid).text(sendFaulureWarnningObjData.ttypeShortname);
        			$("#failureWarnning-left-locoNo").val(sendFaulureWarnningObjData.locoNo);
        			$("#failureWarnning-left-checiName").val(sendFaulureWarnningObjData.checiName);
        			var isDealCheckbox=$("input[name='failureWarnning-left-isDeal']");
        			$.each(isDealCheckbox, function (i, item) {
        				if($(item).val()=="0"){
        					$(item).attr("checked","checked");
        				}
        			});
                    var selectDiv2=$("#typeSelectBut");
                    $(selectDiv2).addClass("shownow");
                    $(selectDiv2).attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");

        			setTimeout(function(){
        				RTU.invoke("app.failurewarning.query.searchLeftResult");
//        				$("#failureWarnning-Button1").click();//进入页面触发
        				var code=sendFaulureWarnningObjData.alarmCode;
        				var top2Code=["3050","3051","3052","3053","3054"];
        				var top3Code=["1000","1001","1002","3058","3056","3057"];
        				var top4Code=["3059","2008","3061","3062","3063","2001","9001","8060"];
        				var codeArray={
        						"3050":"failureWarnning-right-Div4-top2",
        						"3051":"failureWarnning-right-Div4-top3",
        						"3052":"failureWarnning-right-Div4-top4",
        						"3053":"failureWarnning-right-Div4-top5",
        						"3054":"failureWarnning-right-Div4-top6",
        						"1000":"failureWarnning-right-Div3-top2",
        						"1001":"failureWarnning-right-Div3-top3",
        						"1002":"failureWarnning-right-Div3-top3",
        						"3056":"failureWarnning-right-Div3-top4",
        						"3057":"failureWarnning-right-Div3-top5",
        						"3059":"failureWarnning-right-Div2-top2",
        						"2008":"failureWarnning-right-Div2-top3",
        						"3061":"failureWarnning-right-Div2-top4",
        						"3062":"failureWarnning-right-Div2-top5",
        						"3063":"failureWarnning-right-Div2-top6",
        						"2001":"failureWarnning-right-Div2-top7",
        						"9001":"failureWarnning-right-Div2-top8",
        						"8060":"failureWarnning-right-Div2-top9"
        				};
        				if($.inArray(code,top2Code)!=-1){
//        					$("#failureWarnning-right-Div4-top1").click();
        					$("#failureWarnning-top2").click();
        				}else if($.inArray(code,top3Code)!=-1){
//        					$("#failureWarnning-right-Div3-top1").click();
        					$("#failureWarnning-top3").click();
        				}else if($.inArray(code,top4Code)!=-1){
//        					$("#failureWarnning-right-Div2-top1").click();
        					$("#failureWarnning-top4").click();
        				}else{
        					$("#failureWarnning-top1").click();
//        					RTU.invoke("app.failurewarning.query.initRightList");
        				}
        				setTimeout(function(){
        					$("#"+codeArray[code]).click();
           			 },100);
        				
        				
//        				$("#failureWarnning-top1").click();
        				
        				
        				
        			},1)(sendFaulureWarnningObjData);
       		}else{
                    $("#selectedTraintype").attr("alt","").text("");
                    $("#failureWarnning-left-locoNo").val("");
                    $("#failureWarnning-left-checiName").val("");
                    var isDealCheckbox=$("input[name='failureWarnning-left-isDeal']");
                    $.each(isDealCheckbox, function (i, item) {
                            $(item).removeAttr("checked");
                    });
//                    setTimeout(function(){
//	                    RTU.invoke("app.failurewarning.query.searchLeftResult");
////	    				RTU.invoke("app.failurewarning.query.initRightList");
//	    				$("#failureWarnning-top1").click();
	                    $("#failureWarnning-Button1").click();
//                    },1);
            }
    	};
    });
    
    function searchTotalCount(sendData){
//    	var url="alarmLkjView/findByPropertyCount?alarmCodes="+sendData.code;
    	
    	 var conditons = conditionsFun();
         conditons.locoAb = "";
         if(window.failureWarningLeft){
             var clickTr = window.failureWarningLeft.currClickItem();
             if(clickTr&&clickTr.data){
                 conditons.locoAb = clickTr.data.locoAb;
                 conditons.locoTypeid = clickTr.data.locoTypeid;
                 conditons.locoNo = clickTr.data.locoNo;
                 conditons.checiName = clickTr.data.checiName;
             }
         }
         var url="alarmLkjView/findByPropertyCount?alarmCodes="+sendData.code+"&locoTypeid="+conditons.locoTypeid+"&locoNo="+conditons.locoNo+"&locoAb="+conditons.locoAb+"&ADeviceId=&AAlarmCode=&AAlarmLevel=&" +
                 "confirmFlag="+conditons.confirmFlag+"&confirmUserid=&beginTime=&endTime=&" +
                 "lineNo="+conditons.lineNo+"&checiName="+conditons.checiName+"&shangXiaXing="+conditons.shangXiaXing+"&tuKu="+conditons.tuKu+"&benBuName="+conditons.benBuName+"&keHuoName="+conditons.keHuoName+"";

         var param={
            url: url,
            cache: false,
            asnyc: true,
            datatype: "json",
            success: function (data) {
          	  if(sendData.name=="top2"){
          		  for(var i=0;i<data.data.length;i++){
	          		  	if(data.data[i].code=="3050"){
		        			$("#failureWarnning-right-Div4-top2-count").text("("+data.data[i].count+")");
		        		  }else if(data.data[i].code=="3051"){
		        			$("#failureWarnning-right-Div4-top3-count").text("("+data.data[i].count+")");
		        		  }else if(data.data[i].code=="3052"){
		        			$("#failureWarnning-right-Div4-top4-count").text("("+data.data[i].count+")");
		        		  }else if(data.data[i].code=="3053"){
		        			$("#failureWarnning-right-Div4-top5-count").text("("+data.data[i].count+")");
		        		  }else if(data.data[i].code=="3054"){
		        			$("#failureWarnning-right-Div4-top6-count").text("("+data.data[i].count+")");
		        		  }else if(data.data[i].code=="all"){
		        			$("#failureWarnning-right-Div4-top1-count").text("("+data.data[i].count+")");
		        		  }
          		  }
          	  } else if(sendData.name=="top3"){
          		  var c=0;
          		  for(var i=0;i<data.data.length;i++){
	          		if(data.data[i].code=="1000"){
	          			  $("#failureWarnning-right-Div3-top2-count").text("("+data.data[i].count+")");
	        		  }else if(data.data[i].code=="1001"){
	        			  c=c+data.data[i].count;
	        			  $("#failureWarnning-right-Div3-top3-count").text("("+data.data[i].count+")");
	        		  }else if(data.data[i].code=="1002"){
	        			  c=c+data.data[i].count;
	        			 
	        		  }else if(data.data[i].code=="3056"){
	        			  $("#failureWarnning-right-Div3-top4-count").text("("+data.data[i].count+")");
	        		  }else if(data.data[i].code=="3057"){
	        			  $("#failureWarnning-right-Div3-top5-count").text("("+data.data[i].count+")");
	        		  }else if(data.data[i].code=="all"){
	        			  $("#failureWarnning-right-Div3-top1-count").text("("+data.data[i].count+")");
	        		  }
          		 }
          		 $("#failureWarnning-right-Div3-top3-count").text("("+c+")");
          	  }else if(sendData.name=="top4"){
          		  for(var i=0;i<data.data.length;i++){
	            	if(data.data[i].code=="3059"){
	            		$("#failureWarnning-right-Div2-top2-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="2008"){
	          			$("#failureWarnning-right-Div2-top3-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="3061"){
	          			$("#failureWarnning-right-Div2-top4-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="3062"){
	          			$("#failureWarnning-right-Div2-top5-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="3063"){
	          			$("#failureWarnning-right-Div2-top6-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="2001"){
	          			$("#failureWarnning-right-Div2-top7-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="9001"){
	          			$("#failureWarnning-right-Div2-top8-count").text("("+data.data[i].count+")");
	          		  }else if(data.data[i].code=="8060"){
	          			$("#failureWarnning-right-Div2-top9-count").text("("+data.data[i].count+")");
	          		  }
	          		  else if(data.data[i].code=="all"){
	          			$("#failureWarnning-right-Div2-top1-count").text("("+data.data[i].count+")");
	        		  }
          		 }
              }
          	
            },
            error: function () {
            }
		};
		RTU.invoke("core.router.get", param);
    }
    
    //各个tab的事件初始化
    RTU.register("app.failurewarning.query.initTopHover",function(){
    	return function(html){
    	   /********主页面头部的tab****begin**********/
    		//全部
    		$("#failureWarnning-top1").mouseover(function(){
    			$(this).addClass("failureWarnning-top-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-top-bg");
    		}).click(function(){
    			$(this).addClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top2").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top3").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top4").removeClass("failureWarnning-top-click-bg");
    			 $("#failureWarnning-right-Div1-result-grid").empty();
    			 RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
	                    RTU.invoke("app.failurewarning.query.initRightList");
    			 },10);
				$("#failureWarnning-right-Div1").removeClass("hidden");
				$("#failureWarnning-right-Div2").addClass("hidden");
                $("#failureWarnning-right-Div4").addClass("hidden");
                $("#failureWarnning-right-Div3").addClass("hidden");
                
               
    		});
    		
//    			 $("#failureWarnning-top1").click();//进入页面触发
    		
    		
    		//LKJ设备监测
    		$("#failureWarnning-top2").mouseover(function(){
    			$(this).addClass("failureWarnning-top-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-top-bg");
    		}).click(function(){
    			$(this).addClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top1").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top3").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top4").removeClass("failureWarnning-top-click-bg");

                $("#failureWarnning-right-Div4").removeClass("hidden");
                $("#failureWarnning-right-Div2").addClass("hidden");
                $("#failureWarnning-right-Div1").addClass("hidden");
                $("#failureWarnning-right-Div3").addClass("hidden");
                
                $(".failureWarnning-right-Div3-top-bg",$("#failureWarnning-right")).removeClass("failureWarnning-right-Div3-top-bg");
              
                searchTotalCount({name:"top2",code:"3050,3051,3052,3053,3054"});
                setTimeout(function(){
                	
                	$("#failureWarnning-right-Div4-top1").click();
                },100);
    		});
    		
    		//LKJ相关设备监测
    		$("#failureWarnning-top3").mouseover(function(){
    			$(this).addClass("failureWarnning-top-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-top-bg");
    		}).click(function(){
    			$(this).addClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top1").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top2").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top4").removeClass("failureWarnning-top-click-bg");

                $("#failureWarnning-right-Div3").removeClass("hidden");
                $("#failureWarnning-right-Div2").addClass("hidden");
                $("#failureWarnning-right-Div1").addClass("hidden");
                $("#failureWarnning-right-Div4").addClass("hidden");
                
                $(".failureWarnning-right-Div3-top-bg",$("#failureWarnning-right")).removeClass("failureWarnning-right-Div3-top-bg");
               
                searchTotalCount({name:"top3",code:"1000,1001,1002,3058,3056,3057"});
                setTimeout(function(){
                	$("#failureWarnning-right-Div3-top1").click();
                },100);
    		});
    		
    		//非正常行车
    		$("#failureWarnning-top4").mouseover(function(){
    			$(this).addClass("failureWarnning-top-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-top-bg");
    		}).click(function(){
    			$(this).addClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top1").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top2").removeClass("failureWarnning-top-click-bg");
    			$("#failureWarnning-top3").removeClass("failureWarnning-top-click-bg");
    			
    			$("#failureWarnning-right-Div1").addClass("hidden");
                $("#failureWarnning-right-Div3").addClass("hidden");
                $("#failureWarnning-right-Div4").addClass("hidden");
    			$("#failureWarnning-right-Div2").removeClass("hidden");
    			
    			 $(".failureWarnning-right-Div3-top-bg",$("#failureWarnning-right")).removeClass("failureWarnning-right-Div3-top-bg");
    			
    			searchTotalCount({name:"top4",code:"3059,2008,3061,3062,3063,2001,9001,8060"});
    			 setTimeout(function(){
    				 $("#failureWarnning-right-Div2-top1").click();
    			 },100);
    			
    		});
    		/********主页面头部的tab****end**********/

            /***********LKJ设备监测*****begin******************/
            //全部
            $("#failureWarnning-right-Div4-top1").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top5").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top6").removeClass("failureWarnning-right-Div3-top-bg");
                
                
                $("#failureWarnning-right-Div4-sub1-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub1");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub1").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub5").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub6").addClass("hidden");
            });

            //自检异常
            $("#failureWarnning-right-Div4-top2").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top5").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top6").removeClass("failureWarnning-right-Div3-top-bg");
                
                $("#failureWarnning-right-Div4-sub2-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub2");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub2").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub5").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub6").addClass("hidden");
            });

            //时钟异常
            $("#failureWarnning-right-Div4-top3").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top5").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top6").removeClass("failureWarnning-right-Div3-top-bg");
             
                $("#failureWarnning-right-Div4-sub3-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub3");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub3").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub5").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub6").addClass("hidden");
            });

            //单机
            $("#failureWarnning-right-Div4-top4").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top5").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top6").removeClass("failureWarnning-right-Div3-top-bg");
              
                $("#failureWarnning-right-Div4-sub4-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub4");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub4").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub5").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub6").addClass("hidden");
            });

             //速度异常
            $("#failureWarnning-right-Div4-top5").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top6").removeClass("failureWarnning-right-Div3-top-bg");
              
                $("#failureWarnning-right-Div4-sub5-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub5");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub5").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub6").addClass("hidden");
            });

             //压力异常
            $("#failureWarnning-right-Div4-top6").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div4-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div4-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div4-top5").removeClass("failureWarnning-right-Div3-top-bg");

                $("#failureWarnning-right-Div4-sub6-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top2sub6");
                },100);
                
                $("#failureWarnning-right-Div4-content-sub6").removeClass("hidden");
                $("#failureWarnning-right-Div4-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div4-content-sub5").addClass("hidden");
            });
            /***********LKJ设备监测********end****************/

            /***********LKJ相关设备监测*****begin******************/
            //全部
            $("#failureWarnning-right-Div3-top1").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div3-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div3-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top5").removeClass("failureWarnning-right-Div3-top-bg");
            
                $("#failureWarnning-right-Div3-sub1-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top3sub1");
                },100);
                
                $("#failureWarnning-right-Div3-content-sub1").removeClass("hidden");
                $("#failureWarnning-right-Div3-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub5").addClass("hidden");
            });

            //TAX自检异常
            $("#failureWarnning-right-Div3-top2").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div3-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div3-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top5").removeClass("failureWarnning-right-Div3-top-bg");
                
                $("#failureWarnning-right-Div3-sub2-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top3sub2");
                },100);
                
                $("#failureWarnning-right-Div3-content-sub2").removeClass("hidden");
                $("#failureWarnning-right-Div3-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub5").addClass("hidden");
            });

            //TAX信息异常
            $("#failureWarnning-right-Div3-top3").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div3-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div3-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top4").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top5").removeClass("failureWarnning-right-Div3-top-bg");
            
                $("#failureWarnning-right-Div3-sub3-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top3sub3");
                },100);
                
                $("#failureWarnning-right-Div3-content-sub3").removeClass("hidden");
                $("#failureWarnning-right-Div3-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub4").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub5").addClass("hidden");
            });


            //LAIS自检异常
            $("#failureWarnning-right-Div3-top4").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div3-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div3-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top5").removeClass("failureWarnning-right-Div3-top-bg");
               
                $("#failureWarnning-right-Div3-sub4-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top3sub4");
                },100);
                
                $("#failureWarnning-right-Div3-content-sub4").removeClass("hidden");
                $("#failureWarnning-right-Div3-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub5").addClass("hidden");
            });

            //机车信号异常
            $("#failureWarnning-right-Div3-top5").mouseover(function(){
                $(this).addClass("failureWarnning-right-Div3-top-hover");
            }).mouseout(function(){
                $(this).removeClass("failureWarnning-right-Div3-top-hover");
            }).click(function(){
                $(this).addClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top1").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top2").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top3").removeClass("failureWarnning-right-Div3-top-bg");
                $("#failureWarnning-right-Div3-top4").removeClass("failureWarnning-right-Div3-top-bg");
            
                $("#failureWarnning-right-Div3-sub5-result-grid").empty();
                RTU.invoke("header.msg.show","加载中,请稍后!!!");
                setTimeout(function(){
                	RTU.invoke("app.failurewarning.query.initRightList.Top3sub5");
                },100);
                
                $("#failureWarnning-right-Div3-content-sub5").removeClass("hidden");
                $("#failureWarnning-right-Div3-content-sub1").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub2").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub3").addClass("hidden");
                $("#failureWarnning-right-Div3-content-sub4").addClass("hidden");
            });
             /***********LKJ相关设备监测*****end******************/
    		
    		 /*********非正常行车tab*****begin********/
    		//全部
    		$("#failureWarnning-right-Div2-top1").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			 $("#failureWarnning-right-Div2-sub1-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub1");
                 },100);
    			
    			$("#failureWarnning-right-Div2-content-sub1").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//LKJ制动
    		$("#failureWarnning-right-Div2-top2").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub2-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub2");
                 },100);
    			
				$("#failureWarnning-right-Div2-content-sub2").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//区间停车
    		$("#failureWarnning-right-Div2-top3").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub3-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub3");
                 },100);

				$("#failureWarnning-right-Div2-content-sub3").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//持续过机不校
    		$("#failureWarnning-right-Div2-top4").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub4-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub4");
                 },100);

				$("#failureWarnning-right-Div2-content-sub4").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//20KM/H行车模式
    		$("#failureWarnning-right-Div2-top5").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub5-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub5");
                 },100);

				$("#failureWarnning-right-Div2-content-sub5").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//距离行走异常
    		$("#failureWarnning-right-Div2-top6").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub6-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub6");
                 },100);

				$("#failureWarnning-right-Div2-content-sub6").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//途中超速
    		$("#failureWarnning-right-Div2-top7").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");

    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub7-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub7");
                 },100);
    			
				$("#failureWarnning-right-Div2-content-sub7").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		
    		//轮径异常
    		$("#failureWarnning-right-Div2-top9").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top8").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub9-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub9");
                 },100);
    			
				$("#failureWarnning-right-Div2-content-sub7").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub8").addClass("hidden");
    		});
    		
    		//间距异常
    		$("#failureWarnning-right-Div2-top8").mouseover(function(){
    			$(this).addClass("failureWarnning-right-Div2-top-hover");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-right-Div2-top-hover");
    		}).click(function(){
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top1").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top2").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top3").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top4").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top5").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top6").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top7").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-top9").removeClass("failureWarnning-right-Div3-top-bg");
    			$("#failureWarnning-right-Div2-sub8-result-grid").empty();
    			RTU.invoke("header.msg.show","加载中,请稍后!!!");
    			 setTimeout(function(){
    				 RTU.invoke("app.failurewarning.query.initRightList.Top4sub8");
                 },100);
    			
				$("#failureWarnning-right-Div2-content-sub8").removeClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub1").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub2").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub3").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub5").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub4").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub6").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub7").addClass("hidden");
    			$("#failureWarnning-right-Div2-content-sub9").addClass("hidden");
    		});
    		/*********非正常行车tab*****end********/
    	};
    });
    
    //各个按钮事件初始化
    RTU.register("app.failurewarning.query.initButEvent",function(){
    	return function(){
    		//线路选择按钮
    		$("#lineSelectBut").click(function(){
    			var selectDiv=$("#failureWarnning-lineSelect");
    			if($(this).hasClass("shownow")){
    				$(selectDiv).css({"display":"none"});
    				$(this).attr("src","../static/img/app/failureWarnning-images/failureWarnning-Select.png");
    				$(this).removeClass("shownow");
    				$("#selectedLine").text("").removeAttr("alt");
    			}else{
    				var offset=$(this).offset();
        			$("#failureWarnning-lineSelect").css({"display":"block","left":(offset.left-40)+"px","top":(offset.top-60)+"px"});
        			$(this).attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");
        			$(this).addClass("shownow");
    			}
    		});
    		
    		//车型选择按钮
    		$("#typeSelectBut").click(function(){
    			var selectDiv=$("#failureWarnning-typeSelect");

    			if($(this).hasClass("shownow")){
    				$(selectDiv).css({"display":"none"});
    				$(this).attr("src","../static/img/app/failureWarnning-images/failureWarnning-Select.png");
    				$(this).removeClass("shownow");
    				$("#selectedTraintype").text("").removeAttr("alt");
    			}else{
    				var offset=$(this).offset();
        			$("#failureWarnning-typeSelect").css({"display":"block","left":(offset.left-40)+"px","top":(offset.top-60)+"px"});
        			$("#typeSelectBut").attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");
        			$(this).addClass("shownow");
    			}
    		});
    		
    		//隐藏和显示左侧页面的按钮
    		$("#failureWarnning-left-toggleDiv").click(function(){
    			var left=$("#failureWarnning-left");
    			var right=$("#failureWarnning-right");
    			var toggleDiv=$("#failureWarnning-left-toggleDiv");

    			if($(left).hasClass("hidden")){
    				$(right).css("width",($(right).width()-194)+"px");
    				$(right).removeClass("failureWarnning-right-larger");
    			
    				$(left).removeClass("hidden");
    				$(toggleDiv).removeClass("failureWarnning-left-toggleDiv1");
    		
    			}else{
    				$(right).css("width",($(right).width()+194)+"px");
    				$(right).addClass("failureWarnning-right-larger");
    			
    				$(left).addClass("hidden");
    				$(toggleDiv).addClass("failureWarnning-left-toggleDiv1");
    			}

                 RTU.invoke("app.failurewarning.query.initRightList",true);//还要传数据

                 RTU.invoke("app.failurewarning.query.setListWidth",$(right).width());
    		});
    		//左侧查询按钮
    		$("#failureWarnning-Button1").unbind("click").click(function(){
    			if(window.failureWarningLeft&&window.failureWarningLeft.currClickItem()){
    				$(".RTTable-Body  tr[class*='RTGrid_clickTr']", $("#failureWarnning-left-result-grid")).removeClass("RTGrid_clickTr");
    				window.failureWarningLeft.param.clickTr=null;
    			}
    			
//    			if(intervalTimer_faulureWarning!=null){
    				if(!$("#failureWarnning-left").hasClass("hidden")){
                            RTU.invoke("app.failurewarning.query.searchLeftResult"); 
                        }
                        if(!$("#failureWarnning-right-Div1").hasClass("hidden")){
                        	if(window.failureWarningRight1){
                        		window.failureWarningRight1.param.extraUrlParam={
                                	    pageSize:100,
                                		page:window.failureWarningRight1.pageIndex
                                		
                                	};
                        			window.failureWarningRight1.param.url="../"+getUrl();
                                	window.failureWarningRight1.refresh();
                        	}else{
                        		
		                          RTU.invoke("app.failurewarning.query.initRightList");
                        	}
                        }else{
                        	$("#failureWarnning-top1").click();
                        }
                       
                        if(!$("#failureWarnning-right-Div2").hasClass("hidden")){
                             if(!$("#failureWarnning-right-Div2-content-sub1").hasClass("hidden")){
                             	if(window.failureWarningRightTop5Sub1){
                             		 window.failureWarningRightTop5Sub1.param.extraUrlParam={
                                			 pageSize:100,
                                      		page:window.failureWarningRightTop5Sub1.pageIndex	
                                      	};
                             		window.failureWarningRightTop5Sub1.param.url="../"+getUrl()+"&alarmCodes=3059,2008,3061,3062,3063,2001,9001,8060";
                                	 window.failureWarningRightTop5Sub1.refresh();
                            	}else{
	                                RTU.invoke("app.failurewarning.query.initRightList.Top4sub1");
                            	}
                             }
                             if(!$("#failureWarnning-right-Div2-content-sub2").hasClass("hidden")){
                             	if(window.failureWarningRightTop5Sub2){
                             		 window.failureWarningRightTop5Sub2.param.extraUrlParam={
                                			 pageSize:100,
                                     		page:window.failureWarningRightTop5Sub2.pageIndex	
                                     	};
                             		window.failureWarningRightTop5Sub2.param.url="../"+getUrl()+"&alarmCodes=3059";
                                	 window.failureWarningRightTop5Sub2.refresh();
                            	}else{
	                                RTU.invoke("app.failurewarning.query.initRightList.Top4sub2");
                            	}
                            	
                                
                             }
                             if(!$("#failureWarnning-right-Div2-content-sub3").hasClass("hidden")){
                             	if(window.failureWarningRightTop5Sub3){
                             		window.failureWarningRightTop5Sub3.param.extraUrlParam={
                            			    pageSize:100,
                                    		page:window.failureWarningRightTop5Sub3.pageIndex	
                                    	};
                             		window.failureWarningRightTop5Sub3.param.url="../"+getUrl()+"&alarmCodes=2008";
                             		window.failureWarningRightTop5Sub3.refresh();
                            	}else{
	                                RTU.invoke("app.failurewarning.query.initRightList.Top4sub3");
                            	}
                            	 
                                
                             }
                             if(!$("#failureWarnning-right-Div2-content-sub4").hasClass("hidden")){
                             	if(window.failureWarningRightTop5Sub4){
                             		window.failureWarningRightTop5Sub4.param.extraUrlParam={
                               			 pageSize:100,
                                      		page:window.failureWarningRightTop5Sub4.pageIndex	
                                      	};
                             		window.failureWarningRightTop5Sub4.param.url="../"+getUrl()+"&alarmCodes=3061";
                             		window.failureWarningRightTop5Sub4.refresh();
                            	}else{
	                                 RTU.invoke("app.failurewarning.query.initRightList.Top4sub4");
                            	}
                              }
                              if(!$("#failureWarnning-right-Div2-content-sub5").hasClass("hidden")){
                              	if(window.failureWarningRightTop5Sub5){
                              		 window.failureWarningRightTop5Sub5.param.extraUrlParam={
                               			  pageSize:100,
                                     		page:window.failureWarningRightTop5Sub5.pageIndex	
                                     	};
                              		window.failureWarningRightTop5Sub5.param.url="../"+getUrl()+"&alarmCodes=3062";
                              		 window.failureWarningRightTop5Sub5.refresh();
                            	}else{
                            		RTU.invoke("app.failurewarning.query.initRightList.Top4sub5");
                            	}
                                 
                              }
                              if(!$("#failureWarnning-right-Div2-content-sub6").hasClass("hidden")){
                              	if(window.failureWarningRightTop5Sub6){
                              		 window.failureWarningRightTop5Sub6.param.extraUrlParam={
                               			  pageSize:100,
                                       		page:window.failureWarningRightTop5Sub6.pageIndex	
                                       	};
                              		window.failureWarningRightTop5Sub6.param.url="../"+getUrl()+"&alarmCodes=3063";
                              		 window.failureWarningRightTop5Sub6.refresh();
                            	}else{
                            		RTU.invoke("app.failurewarning.query.initRightList.Top4sub6");
                            	}
                              }
                              if(!$("#failureWarnning-right-Div2-content-sub7").hasClass("hidden")){
                              	if(window.failureWarningRightTop5Sub7){
                              		 window.failureWarningRightTop5Sub7.param.extraUrlParam={
                               			  pageSize:100,
                                     		page:window.failureWarningRightTop5Sub7.pageIndex	
                                     	};
                              		window.failureWarningRightTop5Sub7.param.url="../"+getUrl()+"&alarmCodes=2001";
                              		 window.failureWarningRightTop5Sub7.refresh();
                            	}else{
                            		RTU.invoke("app.failurewarning.query.initRightList.Top4sub7");
                            	}
                            	 
                              }
                              if(!$("#failureWarnning-right-Div2-content-sub8").hasClass("hidden")){
                            	  if(window.failureWarningRightTop5Sub8){
                            		  window.failureWarningRightTop5Sub8.param.extraUrlParam={
                                			  pageSize:100,
                                      		page:window.failureWarningRightTop5Sub8.pageIndex	
                                      	};
                            		  window.failureWarningRightTop5Sub8.param.url="../"+getUrl()+"&alarmCodes=9001";
                                      window.failureWarningRightTop5Sub8.refresh();
                            	  }else{
	                                  RTU.invoke("app.failurewarning.query.initRightList.Top4sub8");
                            	  }
                               }
                              if(!$("#failureWarnning-right-Div2-content-sub9").hasClass("hidden")){
                            	  if(window.failureWarningRightTop5Sub9){
                            		  window.failureWarningRightTop5Sub9.param.extraUrlParam={
                                			  pageSize:100,
                                      		page:window.failureWarningRightTop5Sub9.pageIndex	
                                      	};
                            		  window.failureWarningRightTop5Sub9.param.url="../"+getUrl()+"&alarmCodes=8060";
                                      window.failureWarningRightTop5Sub9.refresh();
                            	  }else{
	                                  RTU.invoke("app.failurewarning.query.initRightList.Top4sub9");
                            	  }
                               }
                        }
//    			}else{
//    				RTU.invoke("app.failurewarning.query.createIntervalTimer_faulureWarning");
//    			}
    		});
    		
    		
    		//左侧情况按钮
    		$("#failureWarnning-Button2").unbind("click").click(function(){
    			RTU.invoke("app.failurewarning.query.clearConditions");
    		});
    		widthLeft=$(".failureWarnning-left-result-div").width();
    		heightLeft=$(".failureWarnning-left-result-div").height()*0.92;
//    		$("#failureWarnning-left-toggleDiv").click();
    	};
    });
    
    RTU.register("app.failurewarning.query.createIntervalTimer_faulureWarning",function(){
    	return function(){}
    });

    //设置每个子页面的宽度
    RTU.register("app.failurewarning.query.setListWidth",function(){
        return function(rightWidth){
                $("#failureWarnning-right-Div4-content-sub1").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div4-content-sub2").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div4-content-sub3").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div4-content-sub4").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div4-content-sub5").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div4-content-sub6").css({"width":rightWidth+"px"});

                $("#failureWarnning-right-Div3-content-sub1").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div3-content-sub2").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div3-content-sub3").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div3-content-sub4").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div3-content-sub5").css({"width":rightWidth+"px"});

                $("#failureWarnning-right-Div2-content-sub1").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub2").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub3").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub4").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub5").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub6").css({"width":rightWidth+"px"});
                $("#failureWarnning-right-Div2-content-sub7").css({"width":rightWidth+"px"});


                RTU.invoke("app.failurewarning.query.initRightList.Top2sub1",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top2sub2",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top2sub3",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top2sub4",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top2sub5",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top2sub6",true);

                RTU.invoke("app.failurewarning.query.initRightList.Top3sub1",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top3sub2",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top3sub3",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top3sub4",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top3sub5",true);
              
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub1",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub2",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub3",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub4",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub5",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub6",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub7",true);
                RTU.invoke("app.failurewarning.query.initRightList.Top4sub8",true);
        };
    });
    
    //清空左侧条件输入
    RTU.register("app.failurewarning.query.clearConditions",function(){
    	return function(){
    		$("#selectedLine").attr("alt","").text("");
    		$("#selectedTraintype").attr("alt","").text("");
			$("#failureWarnning-left-locoNo").val("");
			$("#failureWarnning-left-checiName").val("");
			
			
			if(window.failureWarningLeft && window.failureWarningLeft.currClickItem()){
				$(".RTTable-Body  tr[class*='RTGrid_clickTr']", $("#failureWarnning-left-result-grid")).removeClass("RTGrid_clickTr");
				window.failureWarningLeft.param.clickTr=null;
			}
			/*$("#failureWarnning-left").find(".containGridDiv").html("");*/
			$("#failureWarnning-left").find(".RTGrid_Bodydiv,.RTGrid_Footdiv").remove();
			
			if(window.failureWarningRight1)
			window.failureWarningRight1.pageIndex=1;
			if(window.failureWarningRightTop2Sub1)
			window.failureWarningRightTop2Sub1.pageIndex=1;
			if(window.failureWarningRightTop2Sub2)
				window.failureWarningRightTop2Sub2.pageIndex=1;
			if(window.failureWarningRightTop2Sub3)
				window.failureWarningRightTop2Sub3.pageIndex=1;
			if(window.failureWarningRightTop2Sub4)
				window.failureWarningRightTop2Sub4.pageIndex=1;
			if(window.failureWarningRightTop2Sub5)
				window.failureWarningRightTop2Sub5.pageIndex=1;
			if(window.failureWarningRightTop2Sub6)
				window.failureWarningRightTop2Sub6.pageIndex=1;
			if(window.failureWarningRightTop3Sub1)
				window.failureWarningRightTop3Sub1.pageIndex=1;
			if(window.failureWarningRightTop3Sub2)
				window.failureWarningRightTop3Sub2.pageIndex=1;
			if(window.failureWarningRightTop3Sub3)
				window.failureWarningRightTop3Sub3.pageIndex=1;
			if(window.failureWarningRightTop3Sub4)
				window.failureWarningRightTop3Sub4.pageIndex=1;
			if(window.failureWarningRightTop3Sub5)
				window.failureWarningRightTop3Sub5.pageIndex=1;
			if(window.failureWarningRightTop5Sub1)
				window.failureWarningRightTop5Sub1.pageIndex=1;
			if(window.failureWarningRightTop5Sub2)
				window.failureWarningRightTop5Sub2.pageIndex=1;
			if(window.failureWarningRightTop5Sub3)
				window.failureWarningRightTop5Sub3.pageIndex=1;
			if(window.failureWarningRightTop5Sub4)
				window.failureWarningRightTop5Sub4.pageIndex=1;
			if(window.failureWarningRightTop5Sub5)
				window.failureWarningRightTop5Sub5.pageIndex=1;
			if(window.failureWarningRightTop5Sub6)
				window.failureWarningRightTop5Sub6.pageIndex=1;
			if(window.failureWarningRightTop5Sub7)
				window.failureWarningRightTop5Sub7.pageIndex=1;
			if(window.failureWarningRightTop5Sub8)
				window.failureWarningRightTop5Sub8.pageIndex=1;
			/*$("#failureWarnning-right").find(".containGridDiv").html("");*/
			$("#failureWarnning-right").find(".RTGrid_Bodydiv,.RTGrid_Footdiv").remove();
			var upDownCheckbox=$("input[name='failureWarnning-left-upDown']");
			var stateCheckbox1=$("input[name='failureWarnning-left-state1']");
            var stateCheckbox2=$("input[name='failureWarnning-left-state2']");
            var stateCheckbox3=$("input[name='failureWarnning-left-state3']");
			var isDealCheckbox=$("input[name='failureWarnning-left-isDeal']");
			
			$.each(upDownCheckbox, function (i, item) {
   	   			if($(item).attr("checked")=="checked"){
   	   				$(item).removeAttr("checked");
   		   		}
			});
			$.each(stateCheckbox1, function (i, item) {
   	   			if($(item).attr("checked")=="checked"){
   	   			$(item).removeAttr("checked");
   		   		}
			});
            $.each(stateCheckbox2, function (i, item) {
                if($(item).attr("checked")=="checked"){
                $(item).removeAttr("checked");
                }
            });
            $.each(stateCheckbox3, function (i, item) {
                if($(item).attr("checked")=="checked"){
                $(item).removeAttr("checked");
                }
            });
			$.each(isDealCheckbox, function (i, item) {
   	   			if($(item).attr("checked")=="checked"){
   	   				$(item).removeAttr("checked");
   		   		}
			});
    	};
    });
    
    function conditionsFun(){
		var lid=($("#selectedLine").attr("alt")||"");
		var tid=($("#selectedTraintype").attr("alt")||"");
		var locoNo=$("#failureWarnning-left-locoNo").val();
		var checiName=$("#failureWarnning-left-checiName").val();
		
		var upDownCheckbox=$("input[name='failureWarnning-left-upDown']");
		var stateCheckbox1=$("input[name='failureWarnning-left-state1']");
		var stateCheckbox2=$("input[name='failureWarnning-left-state2']");
		var stateCheckbox3=$("input[name='failureWarnning-left-state3']");
		var isDealCheckbox=$("input[name='failureWarnning-left-isDeal']");
		
		var upDownStr="";
		var state1Str="";
		var state2Str="";
		var state3Str="";
		var isDealStr="";
		var upDownCount=0;
		var state1Count=0;
		var state2Count=0;
		var state3Count=0;
		var isDealCount=0;
		$.each(upDownCheckbox, function (i, item) {
   			if($(item).attr("checked")=="checked"){
   				upDownCount++;
   				upDownStr=upDownStr+$(item).val();
	   		}
		});
		$.each(stateCheckbox1, function (i, item) {
   			if($(item).attr("checked")=="checked"){
   				state1Count++;
   				state1Str=state1Str+$(item).val();
	   		}
		});
		$.each(stateCheckbox2, function (i, item) {
			if($(item).attr("checked")=="checked"){
				state2Count++;
				state2Str=state2Str+$(item).val();
			}
		});
		$.each(stateCheckbox3, function (i, item) {
			if($(item).attr("checked")=="checked"){
				state3Count++;
				state3Str=state3Str+$(item).val();
			}
		});
		$.each(isDealCheckbox, function (i, item) {
   			if($(item).attr("checked")=="checked"){
   				isDealCount++;
   				isDealStr=isDealStr+$(item).val();
	   		}
		});
		
		var data={
				lineNo : lid,
				locoTypeid : tid,
				locoNo : locoNo,
				checiName : checiName,
				shangXiaXing : upDownStr,
				tuKu : state1Str,
				benBuName : state2Str,
				keHuoName : state3Str,
				confirmFlag : isDealStr
		};
		if(upDownCount==2){
			data.shangXiaXing="";
		}
		if(state1Count==2){
			data.tuKu="";
		}
		if(state2Count==2){
			data.benBuName="";
		}
		if(state3Count==2){
			data.keHuoName="";
		}
		if(isDealCount==2){
			data.confirmFlag="";
		}
		
		return data;
	}
    
    //进入页面 初始化 左侧列表（刷新列表内容）
    RTU.register("app.failurewarning.query.initLeftList",function(){
    	return function(data){
    		if(!window.failureWarningLeft){
//    			var width=$(".failureWarnning-left-result-div").width();
//        		var height=$(".failureWarnning-left-result-div").height();
        		var showData=[];
        		if(data&&data.length>0){
        			showData=data;
        		}
        		var conditions = conditionsFun();
        		  window.failureWarningLeft = new RTGrid({
    	          	    datas:showData,
    	                containDivId: "failureWarnning-left-result-grid",
    	                tableWidth: widthLeft,
    	                tableHeight: heightLeft,
    	                isSort: true,
    	                showTrNum: false,
    	                hasCheckBox: false,
    	                beforeLoad: function(that){
             				that.pageSize =3000;
             			},
    	                isShowPagerControl: false,
    	                clickIdItem: "checiName_locoNo_recId",
    	                loadPageCp: function(t){
    	              		t.cDiv.css("left","200px");
    	              		t.cDiv.css("top","200px");
    	                },
    	                replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
    	                		 if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
    	                         } else if (itemData.locoAb == "1") {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    	                         } else {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    	                         }
    			      	  }
    			        }],
    			        clickTrEvent: function (t) {
                            var thisData = window.failureWarningLeft.currClickItem();
                            setTimeout(function(){
                            	var divs=$("div",$(".failureWarnning-top"));
                            	var id="";
                            	$.each(divs, function (i, n) {
        	    					if($(n).hasClass("failureWarnning-top-click-bg")){
        	    						id=$(n).attr("id");
        	    					}
        	    				});
                            	
                            	if(id=="failureWarnning-top1"){
                            		RTU.invoke("app.failurewarning.query.initRightList");
                            	}else{
                            		$(".failureWarnning-right-Div3-top-bg",$("#failureWarnning-right")).click();
                            	}
                            },20);
                        },
    	                colNames: ["车次","机车号"],
    	                colModel: [{ name: "checiName",isSort: true}, { name: "locoNo",isSort: true}]
    	            });
    		}else{
    			window.failureWarningLeft.refresh(data);
    		}
    	};
    });

    //列表右键功能
    RTU.register("app.failurewarning.query.initRightClick",function(){
        return function(returnData){
                if($("#failureWarnning-right-Div1-rightClick")){
                      $("#failureWarnning-right-Div1-rightClick").remove();
                }
                var clientX = returnData.clientX;
                var clientY = returnData.clientY;
                var data = returnData.data.data;

                var html = "<div class='failureWarnning-right-Div1-rightClick' id='failureWarnning-right-Div1-rightClick'>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-down'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-down-left'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-down-right'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-top'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-top-left'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-top-right'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-left'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-shadow-right'></div>" +
                         "<div class='failureWarnning-right-Div1-rightClick-content' id='failureWarnning-right-Div1-rightClick-content'>" +
                         "<table class='failureWarnning-right-Div1-rightClick-content-table'  cellspacing='0' collapse='0'>" +
                         "<tr><td class='failureWarnning-right-Div1-rightClick-content-table-border'  locoTypeid='"+data.locoTypeid+"'  ttypeShortname='"+data.ttypeShortname+"' locoNo='"+data.locoNo+"' locoAb='"+data.locoAb+"' id='rightMenu1''>列车跟踪</td></tr>" +
                         "<tr><td  ttypeShortname='"+data.ttypeShortname+"' locoTypeid='"+data.locoTypeid+"' locoNo='"+data.locoNo+"' locoAb='"+data.locoAb+"' id='rightMenu2'>运行曲线</td></tr>" +
                         "<tr><td ttypeShortname='"+data.ttypeShortname+"'  locoTypeid='"+data.locoTypeid+"'  locoNo='"+data.locoNo+"' locoAb='"+data.locoAb+"' locoTypeid='"+data.locoTypeid+"' kehuo='"+data.kehuo+"' lkjTime='"+data.lkjTime+"' alarmTime='"+data.alarmTime+"' id='rightMenu3'>运行记录</td></tr>" +
                         "</table>" +
                         "</div>" +
                         "</div>";
                $("body").append(html);
                $("#failureWarnning-right-Div1-rightClick").css({left:clientX,top:clientY});
                
                $(".failureWarnning-right-Div1-rightClick-content-table tr td",$("#failureWarnning-right-Div1-rightClick")).mouseover(function(){
                    $(this).addClass("failureWarnning-right-Div1-rightClick-content-table-event");
                }).mouseout(function(){
                    $(this).removeClass("failureWarnning-right-Div1-rightClick-content-table-event");
                }).unbind("click").click(function(){
                    $(".failureWarnning-right-Div1-rightClick-content-table tr td",$("#failureWarnning-right-Div1-rightClick")).removeClass("failureWarnning-right-Div1-rightClick-content-table-click");
                    $(this).addClass("failureWarnning-right-Div1-rightClick-content-table-click");
                    var menuName=$(this).attr("id");
                    var ttypeShortname=$(this).attr("ttypeShortname");
                    var locoNo=$(this).attr("locoNo");
                    var locoAb=$(this).attr("locoAb");
                    var locoTypeid=$(this).attr("locoTypeid");
                    if(menuName&&menuName=="rightMenu1"){
                         var id = ttypeShortname + "-" + locoNo;
                         
                         RTU.invoke("map.marker.findMarkersContainsNotExist", {
                             pointId: id,
                             isSetCenter: true,
                             stopTime: 5000,
                             locoAb:locoAb,
                             locoTypeid:locoTypeid,
                             locoNo:locoNo,
                             fnCallBack: function () {
                             }
                         });
                         /*var delbtn = $(".popuwnd-title-del-btn", popuwnd.$wnd);
                         var btn = $(".amplifyWin", delbtn.parent());
                         btn.click();*/
                         $("#failureWarnning-right-Div1-rightClick").hide();
                         popuwnd.close();
                    }else if(menuName&&menuName=="rightMenu2"){
                        var sendData={
                                "id": "11111",
                                "name": data.checiName + "(" + ttypeShortname+"-"+locoNo + ")",
                                 data: {
                                     locoTypeid:data.locoTypeid,
                                     locoNO:locoNo,
                                     checiName:data.checiName,
                                     locoTypeName:ttypeShortname,
                                     locoAb:locoAb
                                 }
                        };
                         var arr=[];
                         arr[0]=sendData;
                         RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
                         $("#failureWarnning-right-Div1-rightClick").hide();
                         popuwnd.close();
                    }else if(menuName&&menuName=="rightMenu3"){
                      var sendData={
	                      locoTypeid:data.locoTypeid,
	                      locoNo:data.locoNo,
	                      locoAb:locoAb,
	                      locoTypename:ttypeShortname,
	                      kehuo:data.kehuo,
	                      date:data.lkjTime,
	                      alarmTime:data.alarmTime
                      };

                      RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                      $("#failureWarnning-right-Div1-rightClick").hide();
                      popuwnd.close();
                    }
                });
        };
    });
    
    //得到查询条件组成url
    function getUrl(){
         var conditons = conditionsFun();
                conditons.locoAb = "";
                if(window.failureWarningLeft){
                    var clickTr = window.failureWarningLeft.currClickItem();
                    if(clickTr&&clickTr.data){
                        conditons.locoAb = clickTr.data.locoAb;
                        conditons.locoTypeid = clickTr.data.locoTypeid;
                        conditons.locoNo = clickTr.data.locoNo;
                        conditons.checiName = clickTr.data.checiName;
                    }
                }
          var url="alarmLkjView/findByProperty?locoTypeid="+conditons.locoTypeid+"&locoNo="+conditons.locoNo+"&locoAb="+conditons.locoAb+"&ADeviceId=&AAlarmCode=&AAlarmLevel=&" +
                        "confirmFlag="+conditons.confirmFlag+"&confirmUserid=&beginTime=&endTime=&" +
                        "lineNo="+conditons.lineNo+"&checiName="+conditons.checiName+"&shangXiaXing="+conditons.shangXiaXing+"&tuKu="+conditons.tuKu+"&benBuName="+conditons.benBuName+"&keHuoName="+conditons.keHuoName+"";
          return url;
    }
    
    function createRTGrid(data,flag){
    	var that_=data;
    	return new RTGrid({
 			url: data.url, //数组
 			containDivId: data.containDivId,//"failureWarnning-right-Div1-result-grid"
 			tableWidth: data.tableWidth,//width
 			tableHeight: flag?data.tableHeight:data.tableHeight*0.93,//height
 			isSort: true,//true
 			showTrNum: true,//true
 			hasCheckBox: false,//false
 			isShowPagerControl: true,//false
 			isShowRefreshImgControl:true,
 			pageIndex:data.pageIndex,
 			clickIdItem: "alarmTime_locoNo_recId",//"alarmTime_locoNo_recId"
 			 setPageSize:[100,200,500],
             extraUrlParam:{
            	 pageSize:100,
            	 pageIndex:that_.pageIndex,
            	 page:that_.pageIndex
             },
             beforeLoad:function(that){
            	 that.pageSize =100;
             }, //function(that){that.pageSize =3000;}
 			loadPageCp: function(t){
 				t.cDiv.css("left","200px");
 				t.cDiv.css("top","200px");
 				if(that_.setCount){
 					$("#"+that_.setCount).text("("+t.totalRecords+")");
 				}
 			},//function(t){t.cDiv.css("left","200px");t.cDiv.css("top","200px");}
 			trRightClick: function(returnData){
				RTU.invoke("app.failurewarning.query.initRightClick",returnData);
			}, //function(returnData){RTU.invoke("app.failurewarning.query.initRightClick",returnData);}
 			replaceTd: data.replaceTd,
 			clickTrEvent: function (t) {
				 $("#failureWarnning-right-Div1-rightClick").remove();
            },
  			colNames: data.colNames,
 			colModel: data.colModel,
 		});
    }
    
    //初始化右侧列表（主页面“全部”）
    RTU.register("app.failurewarning.query.initRightList", function(){
    		function refreshFun(data){
    			var right = $("#failureWarnning-right");
        		var width = $(right).width();
        		/*var height = $(right).height()-2;*/
        		var height = $(right).height()*0.95;
        		var pageIndex=1;
        		if(window.failureWarningRight1){
        			pageIndex=window.failureWarningRight1.pageIndex;
        		}
        		delete window.failureWarningRight1;
        			var sendData = {
        				url:"../" + getUrl(),
        				containDivId:"failureWarnning-right-Div1-result-grid",
        				tableWidth:width,
        				tableHeight:height,
        				pageIndex:pageIndex,
        				replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
        					    var locoStr="";
        	             		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
        	                         locoStr = itemData.ttypeShortname + "-" + itemData.locoNo;
        	                     } else if (itemData.locoAb == "1") {
        	                    	 locoStr = itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
        	                     } else {
        	                    	 locoStr = itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
        	                     }
        	             		
        	             		return "<a href='#' onclick='javascript:$(\"#failureWarnning-left-checiName\").val(\"\");$(\"#failureWarnning-left-locoNo\").val(\""+itemData.locoNo+"\");$(\"#failureWarnning-Button1\").click();'>"+locoStr+"</a>";
        			      	  }
        			        },
        			        { index: 3, fn: function (data,j,ctd,itemData) {
        					    
        	             		return "<a href='#' onclick='javascript:$(\"#failureWarnning-left-locoNo\").val(\"\");$(\"#failureWarnning-left-checiName\").val(\""+data+"\");$(\"#failureWarnning-Button1\").click();'>"+data+"</a>";
        			      	  }
        			        },
        			        { index: 11, fn: function (data,j,ctd,itemData) {
        	         		if(itemData.confirmFlag == "0"){
        	         			var html = "<a href='javascript:void(0)' class='w_do_but' recid='" + itemData.recId + "'><font style='color:red'>处理</font></a>";
        	         			return html;
        	         		}else{
        	         			return "<a href='javascript:void(0)' class='w_look' recid='" + itemData.recId + "'><font style='color:blue'>查看</font></a>";
        	         		}
        			        }
        			        
        			        },{ index: 6, fn: function (data,j,ctd,itemData) {
                	     		var kiloSign = itemData.kiloSign;
                	     		if(kiloSign == null){
                	     			return "";
                	     		}else{
                	         		return kiloSign/1000;
                	     		}
                		        }
        		        },{ index: 7, fn: function (data,j,ctd,itemData) {
        	     		var lightColor = itemData.lightColor;
        	     		var imgurl = imgurl0bj[lightColor.toString()];
        	     		if(imgurl == null){
        	     			return "";
        	     		}else{
        	         		var imgPath = "../static/img/app/moveCurve/"+imgurl;
        	         		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
        	     		}
        		        }
        		        }],
        	            colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","操作"],
        	            colModel: [{ name: "aalarmName",width:width*0.15,isSort: true }, { name: "locoNo",width:width*0.1,isSort: true}
						    , { name: "alarmTime",width:width*0.1,isSort: true}, { name: "checiName",width:width*0.05,isSort: true}
			    			, { name: "lname",width:width*0.1,isSort: true}, { name: "sname",width:width*0.1,isSort: true}
			    			, { name: "kiloSign",width:width*0.05,isSort: true}, { name: "locoSignal",width:width*0.1,isSort: true}
			    			, { name: "speed",width:width*0.05,isSort: true}, { name: "limitedSpeed",width:width*0.05,isSort: true}
			    			, { name: "jkState",width:width*0.05,isSort: true}, { name: "locoTypeid",width:width*0.1,isSort: true}]
        				
        			};
        			window.failureWarningRight1 = createRTGrid(sendData,true);
        			
        		setTimeout(function(){
        			RTU.invoke("app.failurewarning.query.initDealBut");
        		},50);
    		}
    	return function(flag){	
            if(flag){
                if(window.failureWarningRight1){
                    var right = $("#failureWarnning-right");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRight1.refreshWidth(width,$("#failureWarnning-right-Div1-result-grid"));
                    setTimeout(function(){
            			RTU.invoke("app.failurewarning.query.initDealBut");
            		},50);
                }
            }else{
            	
//            	setTimeout(function(){
            		refreshFun([]);
//            	},10);
            }
      };
    });
    
    RTU.register("app.failurewarning.query.initDealBut",function(){
    	return function(){
    		 $(".w_do_but").click(function(){
    			 //查询数据库部分
    			 var text=$(this).attr("recid");
    			 
    			 $(".failureWarnning-deal-do-content-input").attr("recid",text);
    			 
			     $("#failureWarnning-deal-do").css("display","block");
			     
			   
     		 });
    		 
     		 $(".w_look").unbind("click").click(function(){
     			 //查询数据库部分
     			 var text=$(this).attr("recid");
     			RTU.invoke("core.router.get", {
                    url: "alarmLkjView/findByProperties",
                    data: {recId:text},
                    success: function (obj) {
                        if (obj.success) {
                        	 $("#failureWarnning-deal-look-dealContent").text(obj.data.confirmDesc);
                        	 $("#failureWarnning-deal-look-dealUser").text(obj.data.realName);
                        	 $("#failureWarnning-deal-look-dealTime").text(obj.data.confirmTime);
                        }
                    },
                    error: function (obj) {
                    }
                });
     			
     			 $("#failureWarnning-deal-look").css("display","block");
     		 });
     		 
     		 $(".failureWarnning-deal-look-sure").unbind("click").click(function(){
     			 $("#failureWarnning-deal-look").css("display","none");
     		 });
     		 
     		 $(".failureWarnning-deal-do-sure").unbind("click").click(function(){
     			 //传到数据库部分
     			 var params = {};
                 params.recId= $(".failureWarnning-deal-do-content-input").attr("recid");
                 params.confirmDesc= $(".failureWarnning-deal-do-content-input").val();
                 params.confirmUserid = RTU.data.user.id;

                 if(params.confirmDesc&&params.confirmDesc!=""){
     				RTU.invoke("core.router.get", {
                        url: "alarminfo/confirmAlarm",
                        data: $.param(params),
                        success: function (obj) {
                            if (obj.success) {
                            	$("#failureWarnning-deal-do").css("display","none");
                            	RTU.invoke("header.notice.show", "处理成功。。");
                            	
                            	getData();
                            }
                        },
                        error: function (obj) {
                            RTU.invoke("header.notice.show", "处理失败。。");
                        }
                    });
     				
     				RTU.invoke("app.failurewarning.query.initRightList");
     			 }else{
     				   RTU.invoke("header.notice.show", "处理手段不能为空!");
     			 } 
     		 });
     		 
     		 $(".failureWarnning-deal-do-cencel").unbind("click").click(function(){
     			 $("#failureWarnning-deal-do").css("display","none");
     		 });
     		 $(".failureWarnning-deal-look-closediv").unbind("click").click(function(){
     			 $("#failureWarnning-deal-look").css("display","none");
     		 });
     		 
     		 $(".failureWarnning-deal-do-closediv").unbind("click").click(function(){
     			 $("#failureWarnning-deal-do").css("display","none");
     		 });
    	};
    });

    
    function getData() {
    	
	    $.ajax({
	        url: "../alarmLkjView/findByProperty?page=1&pageSize=10&confirmFlag=0",
	        dataType: "jsonp",
	        type: "GET",
	        success: function (data) {
	      	  
	      	  window.warnTrItem.allData=data.data;
	      	  window.warnTrItem.totaldata=data;
	      	  window.psModel.searchNow({ topic: "warnData", trDataTemp: window.warnTrItem });
	        }
	    });
  }
    

    //初始化“LKJ设备监测”的第一个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub1",function(){
        function refreshFun(data){
            var right = $("#failureWarnning-right-Div4-content-sub1");
            var width = $(right).width();
            var height = $(right).height();
        	var pageIndex=1;
    		if(window.failureWarningRightTop2Sub1){
    			pageIndex=window.failureWarningRightTop2Sub1.pageIndex;
    		}
            delete window.failureWarningRightTop2Sub1;
            	 var sendData = {
            			 url:"../"+getUrl()+"&alarmCodes=3050,3051,3052,3053,3054",
                         containDivId: "failureWarnning-right-Div4-sub1-result-grid",
                         tableWidth:width,
                         tableHeight:height,
                         pageIndex:pageIndex,
                         setCount:"failureWarnning-right-Div4-top1-count",
                         replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
                                 if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                      return itemData.ttypeShortname + "-" + itemData.locoNo;
                                  } else if (itemData.locoAb == "1") {
                                      return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                  } else {
                                      return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                  }
                           }
                         },{ index: 6, fn: function (data,j,ctd,itemData) {
             	     		var kiloSign = itemData.kiloSign;
             	     		if(kiloSign == null){
             	     			return "";
             	     		}else{
             	         		return kiloSign/1000;
             	     		}
             		        }
                         
                         },{ index: 7, fn: function (data,j,ctd,itemData) {
                     		var lightColor = itemData.lightColor;
                     		var imgurl = imgurl0bj[lightColor.toString()];
                     		if(imgurl == null){
                     			return "";
                     		}else{
     	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
     	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                     		}
     			        }
     			        }],
                         colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
                         colModel: [ { name: "aalarmName",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                         , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                         , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
                     }
                 window.failureWarningRightTop2Sub1= createRTGrid(sendData);
        }
        return function(flag){
            if(flag){
                if(window.failureWarningRightTop2Sub1){
                    var right=$("#failureWarnning-right-Div4-content-sub1");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop2Sub1.refreshWidth(width,$("#failureWarnning-right-Div4-sub1-result-grid"));
                   
                }
            }else{               
                refreshFun([]);
            }
        };
    });

  //初始化“LKJ设备监测”的第二个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub2",function(){
        function refreshFun(data){
            var right = $("#failureWarnning-right-Div4-content-sub2");
            var width = $(right).width();
            var height = $(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop2Sub2){
    			pageIndex=window.failureWarningRightTop2Sub2.pageIndex;
    		}
           delete window.failureWarningRightTop2Sub2;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3050",
//                        datas:showData,
                        containDivId: "failureWarnning-right-Div4-sub2-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div4-top2-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","模块状态"],
                        colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    };
                window.failureWarningRightTop2Sub2 = createRTGrid(sendData); 
        }
        return function(flag){               
            if(flag){
                if(window.failureWarningRightTop2Sub2){
                    var right = $("#failureWarnning-right-Div4-content-sub2");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop2Sub2.refreshWidth(width,$("#failureWarnning-right-Div4-sub2-result-grid"));
                  
                }
            }else{               
                refreshFun([]);
            }
        };
    });

  //初始化“LKJ设备监测”的第三个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub3", function(){
        function refreshFun(data){
            var right = $("#failureWarnning-right-Div4-content-sub3");
            var width = $(right).width();
            var height = $(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop2Sub3){
    			pageIndex=window.failureWarningRightTop2Sub3.pageIndex;
    		}
            delete window.failureWarningRightTop2Sub3;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3051",
//                        datas:showData,
                        containDivId: "failureWarnning-right-Div4-sub3-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div4-top3-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","异常时间"],
                        colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    };
                window.failureWarningRightTop2Sub3 = createRTGrid(sendData);
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop2Sub3){
                    var right = $("#failureWarnning-right-Div4-content-sub3");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop2Sub3.refreshWidth(width,$("#failureWarnning-right-Div4-sub3-result-grid"));
                   
                }
            }else{               
                refreshFun([]);
            }
        };
    });

  //初始化“LKJ设备监测”的第四个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub4",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div4-content-sub4");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop2Sub4){
    			pageIndex=window.failureWarningRightTop2Sub4.pageIndex;
    		}
            delete window.failureWarningRightTop2Sub4;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3052",
                        containDivId: "failureWarnning-right-Div4-sub4-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div4-top4-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","单机状态"],
                        colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    }
                 window.failureWarningRightTop2Sub4= createRTGrid(sendData); 
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop2Sub4){
                    var right = $("#failureWarnning-right-Div4-content-sub4");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop2Sub4.refreshWidth(width,$("#failureWarnning-right-Div4-sub4-result-grid"));
                   
                }
            }else{               
                refreshFun([]);
            }
        };
    });


  //初始化“LKJ设备监测”的第五个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub5",function(){
        function refreshFun(data){
            var right = $("#failureWarnning-right-Div4-content-sub5");
            var width = $(right).width();
            var height = $(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop2Sub5){
    			pageIndex=window.failureWarningRightTop2Sub5.pageIndex;
    		}
            delete window.failureWarningRightTop2Sub5;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3053",
                        containDivId: "failureWarnning-right-Div4-sub5-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div4-top5-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","通道速度"],
                        colModel: [{ name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true},
                         { name: "jkState",isSort: true},{ name: "aalarmName",isSort: true}]
                    };
                 window.failureWarningRightTop2Sub5= createRTGrid(sendData);
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop2Sub5){
                    var right = $("#failureWarnning-right-Div4-content-sub5");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop2Sub5.refreshWidth(width,$("#failureWarnning-right-Div4-sub5-result-grid"));
                   
                }
            }else{               
                refreshFun([]);
            }
        };
    });

      //初始化“LKJ设备监测”的第一个子模块
    RTU.register("app.failurewarning.query.initRightList.Top2sub6",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div4-content-sub6");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop2Sub6){
    			pageIndex=window.failureWarningRightTop2Sub6.pageIndex;
    		}
            delete window.failureWarningRightTop2Sub6;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3054",
                        containDivId: "failureWarnning-right-Div4-sub6-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div4-top6-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","异常原因"],
                        colModel: [{ name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true},
                         { name: "aalarmName",isSort: true}]
                    }
                 window.failureWarningRightTop2Sub6= createRTGrid(sendData); 
        }
         return function(flag){               
           if(flag){
                if(window.failureWarningRightTop2Sub6){
                    var right = $("#failureWarnning-right-Div4-content-sub6");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop2Sub6.refreshWidth(width,$("#failureWarnning-right-Div4-sub6-result-grid"));
                }
            }else{               
                refreshFun([]);
            }
        };
    });

 //初始化“LKJ相关设备监测”的第一个子模块
    RTU.register("app.failurewarning.query.initRightList.Top3sub1",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div3-content-sub1");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop3Sub1){
    			pageIndex=window.failureWarningRightTop3Sub1.pageIndex;
    		}
            delete window.failureWarningRightTop3Sub1;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=1000,1001,1002,3056,3057",
                        containDivId: "failureWarnning-right-Div3-sub1-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div3-top1-count",
                        replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 7, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
                        colModel: [ { name: "aalarmName",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
                    };
                 window.failureWarningRightTop3Sub1= createRTGrid(sendData); 
        }
        return function(flag){   
           if(flag){
                if(window.failureWarningRightTop3Sub1){
                    var right = $("#failureWarnning-right-Div3-content-sub1");
                    var width = $(right).width();
                    var height = $(right).height();
                    window.failureWarningRightTop3Sub1.refreshWidth(width,$("#failureWarnning-right-Div3-sub1-result-grid"));
                  
                }
            }else{               
                 refreshFun([]);
            }
        };
    });

    //初始化“LKJ相关设备监测”的第二个子模块
    RTU.register("app.failurewarning.query.initRightList.Top3sub2",function(){
        function refreshFun(data){
            var right = $("#failureWarnning-right-Div3-content-sub2");
            var width = $(right).width();
            var height = $(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop3Sub2){
    			pageIndex=window.failureWarningRightTop3Sub2.pageIndex;
    		}
            delete window.failureWarningRightTop3Sub2;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=1000",
                        containDivId: "failureWarnning-right-Div3-sub2-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div3-top2-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","TAX自检异常"],
                        colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    };
                 window.failureWarningRightTop3Sub2 = createRTGrid(sendData); 
        }
        return function(flag){     
           if(flag){
                if(window.failureWarningRightTop3Sub2){
                    var right=$("#failureWarnning-right-Div3-content-sub2");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop3Sub2.refreshWidth(width,$("#failureWarnning-right-Div3-sub2-result-grid"));
                  
                }
            }else{               
               refreshFun([]);
            }
        };
    });

    //初始化“LKJ相关设备监测”的第三个子模块
    RTU.register("app.failurewarning.query.initRightList.Top3sub3",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div3-content-sub3");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop3Sub3){
    			pageIndex=window.failureWarningRightTop3Sub3.pageIndex;
    		}
            delete window.failureWarningRightTop3Sub3;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=1001,1002",
                        containDivId: "failureWarnning-right-Div3-sub3-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div3-top3-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","异常信息"],
                        colModel: [  { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true},{ name: "aalarmName",isSort: true}]
                    };
                 window.failureWarningRightTop3Sub3= createRTGrid(sendData);
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop3Sub3){
                    var right=$("#failureWarnning-right-Div3-content-sub3");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop3Sub3.refreshWidth(width,$("#failureWarnning-right-Div3-sub3-result-grid"));
                   
                }
            }else{               
               refreshFun([]);
            }
        };
    });

    //初始化“LKJ相关设备监测”的第四个子模块
    RTU.register("app.failurewarning.query.initRightList.Top3sub4",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div3-content-sub4");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop3Sub4){
    			pageIndex=window.failureWarningRightTop3Sub4.pageIndex;
    		}
            delete window.failureWarningRightTop3Sub4;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3056",
                        containDivId: "failureWarnning-right-Div3-sub4-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div3-top4-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","TSC自检异常"],
                        colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    };
                 window.failureWarningRightTop3Sub4 = createRTGrid(sendData) ;
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop3Sub4){
                    var right=$("#failureWarnning-right-Div3-content-sub4");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop3Sub4.refreshWidth(width,$("#failureWarnning-right-Div3-sub4-result-grid"));
                  
                }
            }else{               
               refreshFun([]);
            }
        };
    });

    //初始化“LKJ相关设备监测”的第五个子模块
    RTU.register("app.failurewarning.query.initRightList.Top3sub5",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div3-content-sub5");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop3Sub5){
    			pageIndex=window.failureWarningRightTop3Sub5.pageIndex;
    		}
            delete window.failureWarningRightTop3Sub5;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3057",
                        containDivId: "failureWarnning-right-Div3-sub5-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div3-top5-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","信号切换状态"],
                        colModel: [{ name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}
                        , { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
                    };
                 window.failureWarningRightTop3Sub5 = createRTGrid(sendData); 
        }
        return function(flag){               
           if(flag){
                if(window.failureWarningRightTop3Sub5){
                    var right=$("#failureWarnning-right-Div3-content-sub5");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop3Sub5.refreshWidth(width,$("#failureWarnning-right-Div3-sub5-result-grid"));
                
                }
            }else{               
                refreshFun([]);
            }
        };
    });

    //初始化“非正常行车”的第一个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub1",function(){

        function refreshFun(data){
            var right=$("#failureWarnning-right-Div2-content-sub1");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
    		if(window.failureWarningRightTop5Sub1){
    			pageIndex=window.failureWarningRightTop5Sub1.pageIndex;
    		}
            delete window.failureWarningRightTop5Sub1;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3059,2008,3061,3062,3063,2001,9001,8060",
                        containDivId: "failureWarnning-right-Div2-sub1-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div2-top1-count",
                        replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
                                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo;
                                 } else if (itemData.locoAb == "1") {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                                 } else {
                                     return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                                 }
                          }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
                        },{ index: 7, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/" + imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
                        colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
                        colModel: [ { name: "aalarmName",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
                        , { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
                        , { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
                    };
                 window.failureWarningRightTop5Sub1 = createRTGrid(sendData);
           
        }
    	return function(flag){
            if(flag){
                if(window.failureWarningRightTop5Sub1){
                    var right=$("#failureWarnning-right-Div2-content-sub1");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub1.refreshWidth(width,$("#failureWarnning-right-Div2-sub1-result-grid"));
                    
                }
            }
            else{
                 refreshFun([]);
            }
           
    	};
    });
    
    //初始化“非正常行车”的第二个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub2",function(){
    	
    	function refreshFun(data){
    		var right=$("#failureWarnning-right-Div2-content-sub2");
    		var width=$(right).width();
    		var height=$(right).height();
    		 var pageIndex=1;
     		if(window.failureWarningRightTop5Sub2){
     			pageIndex=window.failureWarningRightTop5Sub2.pageIndex;
     		}
    		delete window.failureWarningRightTop5Sub2;
    			var sendData = {
    					url:"../"+getUrl()+"&alarmCodes=3059",
            			containDivId: "failureWarnning-right-Div2-sub2-result-grid",
            			tableWidth:width,
            			tableHeight:height,
            			pageIndex:pageIndex,
            			 setCount:"failureWarnning-right-Div2-top2-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
    	                		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
    	                         } else if (itemData.locoAb == "1") {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    	                         } else {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    	                         }
    			      	  }
                        },{ index: 5, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
    			        },{ index: 6, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
            			colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","制动原因"],
            			colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}, { name: "checiName",isSort: true}
            			, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}, { name: "locoSignal",isSort: true}
            			, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}, { name: "aalarmName",isSort: true}]
            		};
    			window.failureWarningRightTop5Sub2 = createRTGrid(sendData); 
    	}
    	return function(flag){
            if(flag){
                if(window.failureWarningRightTop5Sub2){
                    var right=$("#failureWarnning-right-Div2-content-sub2");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub2.refreshWidth(width,$("#failureWarnning-right-Div2-sub2-result-grid"));
                   
                }
            }
            else{
                refreshFun([]);
    		}
    	};
    });
    
    //初始化“非正常行车”的第三个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub3",function(){
    		function refreshFun(data){
        		var right=$("#failureWarnning-right-Div2-content-sub3");
        		var width=$(right).width();
        		var height=$(right).height();
        		
        		 var pageIndex=1;
          		if(window.failureWarningRightTop5Sub3){
          			pageIndex=window.failureWarningRightTop5Sub3.pageIndex;
          		}
        		delete window.failureWarningRightTop5Sub3;
        			var sendData = {
        					url:"../"+getUrl()+"&alarmCodes=2008",
                			containDivId: "failureWarnning-right-Div2-sub3-result-grid",
                			tableWidth:width,
                			tableHeight:height,
                			pageIndex:pageIndex,
                			setCount:"failureWarnning-right-Div2-top3-count",
            	            replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
        	                		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
          	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
          	                         } else if (itemData.locoAb == "1") {
          	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
          	                         } else {
          	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
          	                         }
           			      	  }
            	            },{ index: 5, fn: function (data,j,ctd,itemData) {
                	     		var kiloSign = itemData.kiloSign;
                	     		if(kiloSign == null){
                	     			return "";
                	     		}else{
                	         		return kiloSign/1000;
                	     		}
                		        }
            	            
           			        },{ index: 6, fn: function (data,j,ctd,itemData) {
                        		var lightColor = itemData.lightColor;
                        		var imgurl = imgurl0bj[lightColor.toString()];
                        		if(imgurl == null){
                        			return "";
                        		}else{
        	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
        	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                        		}
        			        }
        			        }],
                			colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","信号机"],
                			colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}, { name: "checiName",isSort: true}
            			    			, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}
            			    			, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}, { name: "signalNo",isSort: true}]
                		};
        			window.failureWarningRightTop5Sub3 = createRTGrid(sendData);
    		}
    	
    	return function(flag){
            if(flag){
                if(window.failureWarningRightTop5Sub3){
                    var right=$("#failureWarnning-right-Div2-content-sub3");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub3.refreshWidth(width,$("#failureWarnning-right-Div2-sub3-result-grid"));
                   
                }
            }
            else{
                refreshFun([]);
    		}
    	};
    });
    
    //初始化“非正常行车”的第四个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub4",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div2-content-sub4");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
      		if(window.failureWarningRightTop5Sub4){
      			pageIndex=window.failureWarningRightTop5Sub4.pageIndex;
      		}
            delete window.failureWarningRightTop5Sub4;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3061",
                        containDivId: "failureWarnning-right-Div2-sub4-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div2-top4-count",
                          replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                                  return itemData.locoTypeName+"-"+itemData.locoNO;
                            }
                          }],
                        replaceTd:[{ index: 5, fn: function (data,j,ctd,itemData) {
                        	var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
   			      	  }
			        }],
//                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
//                        colModel: [ { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
//                        , { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
//                        , { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}]
			        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","信号机"],
        			colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}, { name: "checiName",isSort: true}
    			    			, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}
    			    			, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}, { name: "signalNo",isSort: true}]
                    };
                 window.failureWarningRightTop5Sub4 = createRTGrid(sendData); 
        }
    	return function(flag){
            if(flag){
                if(window.failureWarningRightTop5Sub4){
                    var right=$("#failureWarnning-right-Div2-content-sub4");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub4.refreshWidth(width,$("#failureWarnning-right-Div2-sub4-result-grid"));
                   
                }
            }
            else{
               refreshFun([]);
            }
    	};
    });
    
    //初始化“非正常行车”的第五个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub5",function(){

        function refreshFun(data){
            var right=$("#failureWarnning-right-Div2-content-sub5");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
      		if(window.failureWarningRightTop5Sub5){
      			pageIndex=window.failureWarningRightTop5Sub5.pageIndex;
      		}
            delete window.failureWarningRightTop5Sub5;
            	var sendData = {
            			url:"../"+getUrl()+"&alarmCodes=3062",
                        containDivId: "failureWarnning-right-Div2-sub5-result-grid",
                        tableWidth:width,
                        tableHeight:height,
                        pageIndex:pageIndex,
                        setCount:"failureWarnning-right-Div2-top5-count",
                        replaceTd:[{ index: 5, fn: function (data,j,ctd,itemData) {
                        	var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
   			      	  }
			        }],
                        
//                        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速"],
//                        colModel: [ { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
//                        , { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
//                        , { name: "checiName",isSort: true}]
			        colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","信号机"],
        			colModel: [ { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}, { name: "checiName",isSort: true}
    			    			, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}
    			    			, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}, { name: "signalNo",isSort: true}]
                    };
                window.failureWarningRightTop5Sub5 = createRTGrid(sendData);
        }
    	return function(flag){
              if(flag){
                if(window.failureWarningRightTop5Sub5){
                    var right=$("#failureWarnning-right-Div2-content-sub5");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub5.refreshWidth(width,$("#failureWarnning-right-Div2-sub5-result-grid"));
                  
                }
            }
            else{
                 refreshFun([]);
            }
    	};
    });
    
    //初始化“非正常行车”的第六个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub6",function(){
        function refreshFun(data){
            var right=$("#failureWarnning-right-Div2-content-sub6");
            var width=$(right).width();
            var height=$(right).height();
            var pageIndex=1;
      		if(window.failureWarningRightTop5Sub6){
      			pageIndex=window.failureWarningRightTop5Sub6.pageIndex;
      		}
            delete window.failureWarningRightTop5Sub6;
            	   var sendData = {
            			   url:"../"+getUrl()+"&alarmCodes=3063",
                           containDivId: "failureWarnning-right-Div2-sub6-result-grid",
                           tableWidth:width,
                           tableHeight:height,
                           pageIndex:pageIndex,
                           setCount:"failureWarnning-right-Div2-top6-count",
                           replaceTd:[{ index: 5, fn: function (data,j,ctd,itemData) {
                           		var kiloSign = itemData.kiloSign;
                           			if(kiloSign == null){
                           				return "";
                           			}else{
                           				return kiloSign/1000;
                           			}
      			      	  	}
                           }],
                           
                           colNames: ["机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态","车位调整状态"],
                           colModel: [ { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
                           , { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}
                           , { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}, { name: "checiName",isSort: true}]
                       };
                    window.failureWarningRightTop5Sub6 = createRTGrid(sendData); 
        }
    	return function(flag){
            if(flag){
                if(window.failureWarningRightTop5Sub6){
                    var right=$("#failureWarnning-right-Div2-content-sub6");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub6.refreshWidth(width,$("#failureWarnning-right-Div2-sub6-result-grid"));
                  
                }
            }
            else{
               refreshFun([]);
            }
    	};
    });
    //初始化“非正常行车”的第七个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub7",function(){
    	function refreshFun(data){
    		var right=$("#failureWarnning-right-Div2-content-sub7");
    		var width=$(right).width();
    		var height=$(right).height();
    		 var pageIndex=1;
       		if(window.failureWarningRightTop5Sub7){
       			pageIndex=window.failureWarningRightTop5Sub7.pageIndex;
       		}
    		delete window.failureWarningRightTop5Sub7;
    			var sendData = {
    					 url:"../"+getUrl()+"&alarmCodes=2001",
            			containDivId: "failureWarnning-right-Div2-sub7-result-grid",
            			tableWidth:width,
            			tableHeight:height,
            			pageIndex:pageIndex,
            			setCount:"failureWarnning-right-Div2-top7-count",
                        replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
    	                		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
    	                         } else if (itemData.locoAb == "1") {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    	                         } else {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    	                         }
    			      	  }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
    			        },{ index: 7, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
            			colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
            			colModel: [ { name: "aalarmName",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
            			, { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
            			, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
            		};
    			window.failureWarningRightTop5Sub7 = createRTGrid(sendData);
    	}
    	return function(flag){

             if(flag){
                if(window.failureWarningRightTop5Sub7){
                    var right=$("#failureWarnning-right-Div2-content-sub7");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub7.refreshWidth(width,$("#failureWarnning-right-Div2-sub7-result-grid"));
                   
                }
            }else{
               refreshFun([]);
            }
    	};
    });
    
    //初始化“非正常行车”的第八个子模块(间距异常)
    RTU.register("app.failurewarning.query.initRightList.Top4sub8",function(){
    	function refreshFun(data){
    		var right=$("#failureWarnning-right-Div2-content-sub8");
    		var width=$(right).width();
    		var height=$(right).height();
    		 var pageIndex=1;
        		if(window.failureWarningRightTop5Sub8){
        			pageIndex=window.failureWarningRightTop5Sub8.pageIndex;
        		}
    		delete window.failureWarningRightTop5Sub8;
    			var sendData = {
    					 url:"../"+getUrl()+"&alarmCodes=9001",
            			containDivId: "failureWarnning-right-Div2-sub8-result-grid",
            			tableWidth:width,
            			tableHeight:height,
            			pageIndex:pageIndex,
            			setCount:"failureWarnning-right-Div2-top8-count",
                        replaceTd:[{ index: 0, fn: function (data,j,ctd,itemData) {
                        	var desc=[];
                        	if(itemData.alarmDesc!=""){
                        		 desc=itemData.alarmDesc.split("|");
                        	}
                        	var d="";
        	       	 		if(desc[1]){
        	       	 			d=desc[1];
        	       	 		}
        	       	 		return d;
			      	  }
                   },{ index: 1, fn: function (data,j,ctd,itemData) {
    	                		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
    	                         } else if (itemData.locoAb == "1") {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    	                         } else {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    	                         }
    			      	  }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
    			        },{ index: 7, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
            			colNames: ["报警描述","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
            			colModel: [ { name: "alarmDesc",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
            			, { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
            			, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
            		};
    			window.failureWarningRightTop5Sub8 = createRTGrid(sendData);
    	}
    	return function(flag){

             if(flag){
                if(window.failureWarningRightTop5Sub8){
                    var right=$("#failureWarnning-right-Div2-content-sub8");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub8.refreshWidth(width,$("#failureWarnning-right-Div2-sub8-result-grid"));
                   
                }
            }else{
               refreshFun([]);
            }
    	};
    });
    
    //初始化“非正常行车”的第七个子模块
    RTU.register("app.failurewarning.query.initRightList.Top4sub9",function(){
    	function refreshFun(data){
    		var right=$("#failureWarnning-right-Div2-content-sub9");
    		var width=$(right).width();
    		var height=$(right).height();
    		 var pageIndex=1;
       		if(window.failureWarningRightTop5Sub9){
       			pageIndex=window.failureWarningRightTop5Sub9.pageIndex;
       		}
    		delete window.failureWarningRightTop5Sub9;
    			var sendData = {
    					 url:"../"+getUrl()+"&alarmCodes=8060",
            			containDivId: "failureWarnning-right-Div2-sub9-result-grid",
            			tableWidth:width,
            			tableHeight:height,
            			pageIndex:pageIndex,
            			setCount:"failureWarnning-right-Div2-top7-count",
                        replaceTd:[{ index: 1, fn: function (data,j,ctd,itemData) {
    	                		if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    	                             return itemData.ttypeShortname + "-" + itemData.locoNo;
    	                         } else if (itemData.locoAb == "1") {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    	                         } else {
    	                        	 return itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    	                         }
    			      	  }
                        },{ index: 6, fn: function (data,j,ctd,itemData) {
            	     		var kiloSign = itemData.kiloSign;
            	     		if(kiloSign == null){
            	     			return "";
            	     		}else{
            	         		return kiloSign/1000;
            	     		}
            		        }
                        
    			        },{ index: 7, fn: function (data,j,ctd,itemData) {
                    		var lightColor = itemData.lightColor;
                    		var imgurl = imgurl0bj[lightColor.toString()];
                    		if(imgurl == null){
                    			return "";
                    		}else{
    	                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
    	                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
                    		}
    			        }
    			        }],
            			colNames: ["报警事件","机车号","发生时间","车次","线路","位置","里程","信号","速度","限速","工作状态"],
            			colModel: [ { name: "aalarmName",isSort: true}, { name: "locoNo",isSort: true}, { name: "alarmTime",isSort: true}
            			, { name: "checiName",isSort: true}, { name: "lname",isSort: true}, { name: "sname",isSort: true}, { name: "kiloSign",isSort: true}
            			, { name: "locoSignal",isSort: true}, { name: "speed",isSort: true}, { name: "limitedSpeed",isSort: true}, { name: "jkState",isSort: true}]
            		};
    			window.failureWarningRightTop5Sub9 = createRTGrid(sendData);
    	}
    	return function(flag){

             if(flag){
                if(window.failureWarningRightTop5Sub9){
                    var right=$("#failureWarnning-right-Div2-content-sub9");
                    var width=$(right).width();
                    var height=$(right).height();
                    window.failureWarningRightTop5Sub9.refreshWidth(width,$("#failureWarnning-right-Div2-sub9-result-grid"));
                   
                }
            }else{
               refreshFun([]);
            }
    	};
    });
    
    //查询所有的线路
    RTU.register("app.failurewarning.query.searchLine",function(){
    	return function(){
    		var url="line/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	RTU.invoke("app.failurewarning.query.setLine",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
   
    //查询所有的机车车型
    RTU.register("app.failurewarning.query.searchTraintype",function(){
    	return function(){
    		var url="traintype/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.failurewarning.query.setTraintype",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //初始化线路选择Div的内容
    RTU.register("app.failurewarning.query.setLine",function(){
    	return function(data){
    		var select=$("#failureWarnning-lineSelect-content");
    		var html="<table id='lineselect-table' class='lineselect-table'  cellspacing='4' collapse='4'><tr>";
    		for(var i=0,len=data.length;i<len;i++){
    			if(i!=0&&i%3==0){
    				html=html+"</tr><tr>";
    			}
    			html=html+"<td id='"+data[i].lId+"'>"+data[i].lName+"</td>";
    		}
    		html=html+"</table>";
    		$(select).html(html);
    		RTU.invoke("app.failurewarning.query.selectLineTd");
    	};
    });
    
    //初始化车型选择Div的内容
    RTU.register("app.failurewarning.query.setTraintype",function(){
    	return function(data){
    		var select = $("#failureWarnning-typeSelect-content");
    		var html = "<table id='typeselect-table' class='typeselect-table'  cellspacing='4' collapse='4'><tr>";
    		
    		for(var i = 0,len = data.length; i<len; i++){
    			var flag = false;
    			if(i !=0 && i%3 == 0){
    				html = html + "</tr><tr>";
    			}
    			if($("#selectedTraintype").text()&&$("#selectedTraintype").text() != ""){
    				if($("#selectedTraintype").attr("alt") == data[i].tTypeId){
    					html = html+"<td id='"+data[i].tTypeId+"' class='failureWarnning-right-Div3-top-bg'>"+data[i].shortname+"</td>";
    					flag = true;
    				}
    			}
    			if(!flag){
    				html = html+"<td id='"+data[i].tTypeId+"'>"+data[i].shortname+"</td>";
    			}
    		}
    		html = html+"</table>";
    		$(select).html(html);
    		RTU.invoke("app.failurewarning.query.selectTraintypeTd");
    	};
    });
    
    //初始化线路选择Div的内容Tab中td的事件
    RTU.register("app.failurewarning.query.selectLineTd",function(){
    	return function(){
    		$("#lineselect-table tr td").dblclick(function(){
    			$("#lineselect-table tr td").removeClass("failureWarnning-right-Div3-top-bg");
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			var lid=$(this).attr("id");
    			var lname=$(this).text();
    			$("#selectedLine").text(lname).attr("alt",lid);
    			var selectDiv=$("#failureWarnning-lineSelect");
    			selectDiv.css("display","none");
    		}).mouseover(function(){
    			$("#lineselect-table tr td").removeClass("failureWarnning-left-select-bg");
    			$(this).addClass("failureWarnning-left-select-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-left-select-bg");
    		});
    	};
    });
    
  //初始化车型选择Div的内容Tab中td的事件
    RTU.register("app.failurewarning.query.selectTraintypeTd",function(){
    	return function(){
    		$("#typeselect-table tr td").dblclick(function(){
    			$("#typeselect-table tr td").removeClass("failureWarnning-right-Div3-top-bg");
    			$(this).addClass("failureWarnning-right-Div3-top-bg");
    			var tid=$(this).attr("id");
    			var tname=$(this).text();
    			$("#selectedTraintype").text(tname).attr("alt",tid);
    			var selectDiv=$("#failureWarnning-typeSelect");
    			selectDiv.css("display","none");
    		}).mouseover(function(){
    			$("#typeselect-table tr td").removeClass("failureWarnning-left-select-bg");
    			$(this).addClass("failureWarnning-left-select-bg");
    		}).mouseout(function(){
    			$(this).removeClass("failureWarnning-left-select-bg");
    		});
    	};
    });
    
    //点击左侧查询按钮查询数据
    RTU.register("app.failurewarning.query.searchLeftResult", function(){
    	return function(){
    		var conditons = conditionsFun();
    		var url="alarmLkjView/findAllConditionFaultVehicle?locoNo="+conditons.locoNo+"&checiName="+conditons.checiName+"&LId="+conditons.lineNo+"&TTypeId="+conditons.locoTypeid+"" +
    				"&keHuoName="+conditons.keHuoName+"&benBuName="+conditons.benBuName+"&shangXiaXing="+conditons.shangXiaXing+"&confirmFlag="+conditons.confirmFlag+"&tuKu="+conditons.tuKu+"";
    		var param = {
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.failurewarning.query.initLeftList",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });

    RTU.register("app.failurewarning.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
                clearInterval(intervalTimer_faulureWarning);
                intervalTimer_faulureWarning = undefined;
            }
            RTU.invoke("app.failurewarning.query.clearConditions");
//            window.sendFaulureWarnningObjData=null;
        };
    });
    
    RTU.register("app.failurewarning.query.init", function () {
    	data = RTU.invoke("app.setting.data", "failurewarning");
        if (data && data.isActive) {
            RTU.invoke("app.failurewarning.query.activate");
        }
        return function () {
            return true;
        };
    });

});
