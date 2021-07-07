RTU.DEFINE(function (require, exports) {
/**
 * 模块名：LKJ版本监测
 * name：lkjequipmentversionhistoryquery
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("../../../css/app/lkjequipmentversionhistoryquery/locoquery-lkjequipmenthistory-query.css");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    require("jquery/jquery-scroll.js");
    require("My97DatePicker/WdatePicker.js");
    /*require("app/lkjequipmentversionhistoryquery/jquery-2.1.1.min.js");
    require("app/lkjequipmentversionhistoryquery/bootstrap.min.js?v=3.4.0");*/
    require("app/lkjequipmentversionhistoryquery/squre.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-filetransfer-lookfile.js");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    
    var popuwnd_onlleft = null; //左侧弹出窗口
    var shortTypeData = {}; //型号分布数据
    var data;
    var radiolkjFlag = "";
    var first = false;
    var select = false;
    var locoTypeid1 = 0;
    var locoNo1;
    var engineInfoArr = [];
    //加载数据并初始化窗口和事件
    RTU.register("app.lkjequipmenthistory.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                    	$html=$(html);
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                            var mainDiv=$(".content-lkjequipmenthistory-MainDiv");
                            var height=mainDiv.height();
                            var width=mainDiv.width();
                            $(".content-basic-div-new-version").css({"height":(height-40)+"px"});
                            $("#content-lkjequipmenthistory-version").css({"height":height-100+"px"});

                            $(".content-lkjequipmenthistory-middleDiv").css({"height":(height-40)+"px"});
                            $("#content-lkjequipmenthistory-version-type").css({"height":(height-100)+"px"});
                            
                            $(".content-lkjequipmenthistory-endDiv").css({"height":(height-40)+"px"});
                        }
                        var data_filetransfer = RTU.invoke("app.setting.data", "filetransfer");
	       				 var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
	       				 if(data_filetransfer == null || data_filetransfer == undefined ){
	       					 $("#menu4").parent().remove();
	       				 }
	       				 if(data_filedownload == null || data_filedownload == undefined ){
	       					 $("#menu5").parent().remove();
	       				 }
	       				 
//	       				RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchzhineng");
	       				 
                    }
                });
            }
        };
    });
    
//    var width;
//    var height;
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
    

	
    //查询窗口
    RTU.register("app.lkjequipmentversionhistoryquery.query.activate", function () {
    	
        return function () {
            //查询窗口
//        	width = document.documentElement.clientWidth * 0.85;
//            height = document.documentElement.clientHeight * 0.89;
        	RTU.invoke("header.msg.hidden");
        	var Resolution=getResolution();
			var width=Resolution.Twidth;
			var height=Resolution.Theight-35;
/*        	var width=Resolution.Twidth;
			var height=Resolution.Theight;*/
        	
            RTU.invoke("app.lkjequipmenthistory.loadHtml", { url: "../app/modules/lkjequipmentversionhistoryquery/app-lkjequipmentversionhistory-query.html", fn: function (html) {
            	if (!popuwnd_onlleft) {
                    popuwnd_onlleft = new PopuWnd({
                        title: "LKJ版本监测",
                        html: html,
//                        width: width > 810 ? width : 810,
//                        height:height > 500 ? height : 500,
                        width: width ,
                        height:height ,
                        left: 0,
                        top: 35,
                        shadow: true
                    });
                    popuwnd_onlleft.init();
                }
                else {
                	popuwnd_onlleft.close();
                    popuwnd_onlleft.init();
                }
            	
            	var navTitle = $(".popuwnd-title", popuwnd_onlleft.$wnd);
            	var navShadow = $(".box_shadow", popuwnd_onlleft.$wnd);
                navTitle.css("height","15px");
                navTitle.attr("style","top:-10px; opacity: 0");
                navShadow.attr("style","top:-10px; opacity: 0");
                
                RTU.invoke("core.router.load", {
                	url: "../app/modules/lkjequipmentversionhistoryquery/squre/squre.html",
                	success: function (html) {
                		if(html){
                			$("#content-version-alarm-div").html(html);
                			$("#row").width(popuwnd_onlleft.$wnd.width()-60);
                			$("#row").height((popuwnd_onlleft.$wnd.height()-$(".app_lkjequipmenthistory_tab_div").height()-
                					$(".seach_from").height())*0.85);
                			$("#searchBtnVersionAlarm").unbind("click").bind("click",function(){
                				RTU.invoke("header.msg.show","加载中,请稍后!!");
                        		RTU.invoke("core.router.get",{
            						 url: "lkjverInfo/searchAlarmLkjverInfoByProperty?confirmFlag="
            							 +($("#versionAlarmCheck").attr("checked")?1:0)
            							 +"&alarmCode="+$("#versionAlarmCodeSel").val()
            							 +"&locoName="+$("#searchLocoInputAlarmVersion").val()
            							 +"&alarmLevel="+$("#versionAlarmLevelSel").val(),
            						 dataType:"jsonp",
            		                 success: function (returnData) {
            		                	 var x=returnData.data;
            		                	 $("#row").empty();
            		                	 if(x&&x.length>0){
            		                		/*var locoName,checiName,kiloSign,upDown,jkstateName,sName,lName,alarmTime,alarmName
            		                		,alarmCount,planVersion,currentVersion;*/
            		         				var noNode,gzlxNode,jgjbNode,gzsjNode;
            		                		 /*var str = '[{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"}]';
            		         				var x= eval('(' + str + ')');	*/	
            		         				for(var m =0;m<x.length;m++){
            		         					var obj=x[m];
            		         					if($("#searchLocoInputAlarmVersion option[value='"+obj.locoName+"']").length==0){
            		         						$("#searchLocoInputAlarmVersion").append("<option value='"+obj.locoName+"'>"+obj.locoName+"</option>");
            		         					};
            		         					/*no=x[i].no;
            		         					gzlx=x[i].gzlx;
            		         					jgjb=x[i].jgjb;
            		         					gzsj=x[i].gzsj;*/
            		         					noNode=$("<font id='no' class='font-no'></font>").text(obj.locoName+"("+obj.checiName+")");
            		         					gzlxNode=$("<font id='gz' class='font-2' style='color:red'></font>").text(obj.alarmName);
            		         					/*jgjbNode=$("<font id='jb' class='font-2'></font>").text(obj.alarmCount+"次");*/
            		         					jgjbNode=$("<font id='jb' class='font-2'></font>").text(1+"次");
            		         					
            		         					gzsjNode=$("<font id='sj' class='font-2'></font>").text(obj.alarmTime);
            		         					$("#row").append('<div title="双击击可查看最新文件" ondblclick="javascript:lookFile('
            		         					+obj.locoTypeid+','+obj.locoNo+','+obj.locoAb+',\''+obj.locoName.split("-")[0]+'\','
            		         					+obj.locoName.split("-")[1]+')" style="cursor:pointer" class="squre" id="fk'+m
            		         					+'" onmouseover="over(id)" onmouseout="out(id)"><ul class="a1" id="a1'+m+'">'+
            		         					'<li style="margin-top:50px" class="li1 " id="liNo'+m+'"></li><li class="li1"><font class="font-name" id="jc'+m+'">'+(obj.locoName.indexOf("CRH")!=-1?"动车":"机车")
            		         					/*+'</font></li>'+'<li class="li1"><font class="font-name" id="alarmDesc'+m+'">'+obj.alarmDesc+'</li>'+'</ul>'+*/
            		         					+'</font></li>'+'<li class="li1"><font class="font-name" id="alarmDesc'+m+'"></li>'+'</ul>'+
            		         					'<ul class="a2" id="a2'+m+'"><ul class="a2_1" id="gzlx'+m+'"><li class="li2_1"><font class="font-1" id="right_1'+m+'">故障类型</font></li>'+
            		         					'<li class="li2_1" id="liGzlx'+m+'"></li></ul>'+
            		         					/*'<ul class="a2_2" id="jgjb'+m+'"><li class="li2_2"><font class="font-1" id="right_2'+m+'">报警次数</font></li>'+
            		         					'<li class="li2_2" id="liJgjb'+m+'"></li></ul>'*/
            		         					'<ul class="a2_2" id="gzsj'+m+'"><li class="li2_2"><font class="font-1" id="right_2'+m+'">最后报警时间</font></li>'+
            		         					'<li class="li2_2" id="liGzsj'+m+'"></li></ul>'
            		         					+'<ul class="a2_1" id="curVersion'+m+'"><li class="li2_1"><font class="font-1" id="right_1'+m+'">报警时刻车载版本</font></li>'+
            		         					'<li class="li2_1" id="liCurVersion'+m+'"></li></ul>'+
            		         					'<ul class="a2_2" id="planVersion'+m+'"><li class="li2_2"><font class="font-1" id="right_2'+m+'">报警计划版本</font></li>'+
            		         					'<li class="li_2" id="liPlanVersion'+m+'"></li></ul>'
            		         					/*+'<ul class="a2_1" id="kiloSign'+m+'"><li class="li2_1"><font class="font-1" id="right_1'+m+'">公里标(km)</font></li>'+
            		         					'<li class="li2_1" id="liKiloSign'+m+'"></li></ul>'+
            		         					'<ul class="a2_2" id="jkstateName'+m+'"><li class="li2_2"><font class="font-1" id="right_2'+m+'">监控状态</font></li>'+
            		         					'<li class="li_2" id="liJkstateName'+m+'"></li></ul>'*/
            		         					+'<ul class="a2_1" id="versionA'+m+'"><li class="li2_1"><font class="font-1" id="right_1'+m+'">当前A机版本</font></li>'+
            		         					'<li class="li2_1" id="liVersionA'+m+'"></li></ul>'+
            		         					'<ul class="a2_2" id="versionB'+m+'"><li class="li2_2"><font class="font-1" id="right_2'+m+'">当前B机版本</font></li>'+
            		         					'<li class="li_2" id="liVersionB'+m+'"></li></ul>'
            		         					+'<ul class="a2_1" id="gzsj'+m+'">'+
            		         					'<li class="li2_1"><font class="font-1" id="right_3'+m+'">当前位置</font></li>'+
            		         					'<li class="li2_1" id="liSName'+m+'"></li></ul>'+
            		         					/*'<ul class="a2_2" id="gzsj'+m+'">'+
            		         					'<li class="li2_2"><font class="font-1" id="right_3'+m+'">最后报警时间</font></li>'+
            		         					'<li class="li2_2" id="liGzsj'+m+'"></li></ul>'+*/
            		         					'</ul><div class="a3" id="btn">'+
            		         					(obj.confirmFlag!=1?('<img src="../static/img/app/cl.png" /><a href="#" onclick="popCenterWindow(\''+obj.locoName+'\','+obj.alarmCode+')">'+
                    		         					'<font class="font-3" id="cl'+m+'">处理</font></a></div></div>')
                    		         		    :('<font class="font-3" id="cl'+m+'">已处理</font></a></div></div>')));
            		         					var m1="#liNo"+m;
            		         					var m2="#liGzlx"+m;
            		         					var m3="#liJgjb"+m;
            		         					var m4="#liGzsj"+m;
            		         					$(m1).append(noNode);
            		         					$(m2).append(gzlxNode);
            		         					/*$(m3).append(jgjbNode);*/
            		         					$(m4).append(gzsjNode);
            		         					$("#liSName"+m).append("<font class='font-2'>"+obj.sName+"("+obj.lName+")"+"</font>");
            		         					$("#liCurVersion"+m).append("<font class='font-2' style='color:blue'>"+obj.currentVersion+"</font>");
            		         					$("#liPlanVersion"+m).append("<font  class='font-2'  style='color:red'>"+obj.planVersion+"</font>");
            		         					$("#liVersionA"+m).append("<font class='font-2' style='color:green'>"+obj.versionA+"</font>");
            		         					$("#liVersionB"+m).append("<font class='font-2' style='color:green'>"+obj.versionB+"</font>");
            		         					/*$("#liKiloSign"+m).append("<font class='font-2'>"+obj.kiloSign+"</font>");
            		         					$("#liJkstateName"+m).append("<font class='font-2'>"+obj.jkstateName+"</font>");*/
            		         				} 
            		                	 }
            		                	 RTU.invoke("header.msg.hidden");
            		                 },
            		                 error: function (obj) {}
            					});
                        	});
                			RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchAlarmVersionInfo");
                		}
                	}
                });
                
                return popuwnd_onlleft;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.lkjequipmentversionhistoryquery.query.initTopBtn");
            	RTU.invoke("app.lkjequipmentversionhistoryquery.query.toggleSize");
            	
            	
            	//读取报警信息
            	/*setTimeout(function(){
                    RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchAlarmVersionInfo");
                },10);*/
                setTimeout(function(){
                    RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchByVersion");
                    RTU.invoke("app.lkjequipmentversionhistoryquery.query.initInputAuto",$("#searchLocoInputVersion"));
                },25);
            	
                setTimeout(function(){
                    RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchByLocoType");
                    RTU.invoke("app.lkjequipmentversionhistoryquery.query.initInputAuto",$("#searchLocoInputType"));
                },50);
                
                popuwnd_onlleft.$wnd.find(".popuwnd-title-del-btn").click(function () {
	                 RTU.invoke("header.msg.hidden");
	                 popuwnd_onlleft.close();
	             	 popuwnd_onlleft=undefined;
                });

    			window.setTimeout(function(){
    				RTU.invoke("core.router.get",{
    					 url: "hzqkQuery/findAllTasks",
    					 dataType:"jsonp",
    	                 success: function (obj) {
    	                        if (obj.success) {
    	                        	$("#lkjver_bureaPlanSel option[value!='']").remove();
    	                        	$("#lkjver_depotPlanSel option[value!='']").remove();
    	                        	var list=obj.data;
    	                        	if(list&&list.length>0){
    	                        		for(var i=0;i<list.length;i++){
    	                        			$("#lkjver_bureaPlanSel")
    	                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
    	                        		}
    	                        	}
    	                        	
    	        					/*RTU.invoke("core.router.get",{
    	        						 url: "hzqkQuery/findPlansByTaskId?taskId="+$("#lkjver_bureaPlanSel").val(),
    	        						 dataType:"jsonp",
    	        		                 success: function (obj) {
    	        		                        if (obj.success) {
    	        		                        	var list=obj.data;
    	        		                        	if(list&&list.length>0){
    	        		                        		$("#lkjver_depotPlanSel").append("<option value=''></option>");
    	        		                        		for(var i=0;i<list.length;i++){
    	        		                        			$("#lkjver_depotPlanSel")
    	        		                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
    	        		                        		}
    	        		                        	}
    	        		                        }
    	        		                    },
    	        		                    error: function (obj) {
    	        		                    }
    	        					});*/
    	                        	
    	                        	$("#lkjver_bureaPlanSel").unbind("change").bind("change",function(){
    	            					$("#lkjver_depotPlanSel option[value!='']").remove();
    	            					RTU.invoke("core.router.get",{
    	            						 url: "hzqkQuery/findPlansByTaskId?taskId="+$("#lkjver_bureaPlanSel").val(),
    	            						 dataType:"jsonp",
    	            		                 success: function (obj) {
    	            		                        if (obj.success) {
    	            		                        	var list=obj.data;
    	            		                        	if(list&&list.length>0){
    	            		                        		/*$("#lkjver_depotPlanSel").append("<option value=''></option>");*/
    	            		                        		for(var i=0;i<list.length;i++){
    	            		                        			$("#lkjver_depotPlanSel")
    	            		                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
    	            		                        		}
    	            		                        	}
    	            		                        }
    	            		                    },
    	            		                    error: function (obj) {
    	            		                    }
    	            					});
    	            					$("#unExcCheckBox").attr("checked","checked");
    	            					$("#errorExeCheckBox").attr("checked","checked");
    	            					RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchByVersion");
    	            				}); 
    	                    		$("#lkjver_depotPlanSel").unbind("change").bind("change",function(){
    	                    			RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchByVersion");
    	            				}); 
    	                        }
    	                    },
    	                    error: function (obj) {
    	                    }
    				});
    			},10);
            }
            });
        };
    });
    
    RTU.register("app.lkjequipmentversionhistoryquery.query.searchAlarmVersionInfo",function(){
    	return function(data){
    		if(window.sendVersionWarningData){
    			var locoName=window.sendVersionWarningData.locoName;
    			if($("#searchLocoInputAlarmVersion option[value='"+locoName+"'").length==0){
    			 $("#searchLocoInputAlarmVersion").
        		 append("<option value='"+locoName+"'>"+locoName+"</option>");
    			}
    			$("#searchLocoInputAlarmVersion").val(locoName);
    			
    			/*$("#versionAlarmCodeSel").val(window.sendVersionWarningData.alarmCode);*/
	   		 }
	   		$("#searchBtnVersionAlarm").click();
	   		window.sendVersionWarningData=null;
	   		$(".seach_from select").unbind("change").bind("change",function(){
	   			$("#searchBtnVersionAlarm").click();
	   		});
	   		$(".seach_from input[type='checkbox']").unbind("click").bind("click",function(){
	   			$("#searchBtnVersionAlarm").click();
	   		});
    	};
    });
    
    RTU.register("app.lkjequipmentversionhistoryquery.query.initInputAuto",function(){
	       var trainStrParse = function (data) {  //给机车型号和机车号增加-符号
	            data = data.data;
	            var rows = [];
	            for (var i = 0; i < data.length; i++) {
	            	var locoab="";
		 			  if (data[i].locaAb!=1&&data[i].locoAb!=2) {
		           		 locoab="";
			          }else if (data[i].locoAb==1) {//A
			              locoab=window.locoAb_A;
		              }else{
		            	  locoab=window.locoAb_B;
		              }
	                rows[rows.length] = {
                        data: data[i],
                        value: data[i].locoTypeName + "-" + data[i].locoNO,
                        result: data[i].locoTypeName + "-" + data[i].locoNO+locoab //返回的结果显示内容   
                    };
	            }
	            return rows;
	        };
 	return function(data){

	        data.autocomplete("../onlineloco/" +
	        		"searchByProperty?dFullName=&bFullName=&sFullName=&showSize=50" +
	        		"&locoType=&locoNo=&dName=&checiName&lineName=&trainType=&sName=" +
	        		"&temptime=" + new Date().getTime(), {
             minChars: 0, //表示在自动完成激活之前填入的最小字符
             max: 100, //表示列表里的条目数
             autoFill: false, //表示自动填充
             mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
             matchContains: true, //表示包含匹配,相当于模糊匹配
             width: 180,
             scrollHeight: 200, //表示列表显示高度,默认高度为180
             dataType: "json",
             parse: trainStrParse,
             formatItem: function (row) {///下拉列表每行数据
            	 var locoab="";
	 			  if (row.locoAb!=1&&row.locoAb!=2) {
	           		 locoab="";
		          }else if (row.locoAb==1) {//A
		              locoab=window.locoAb_A;
	              }else{
	            	  locoab=window.locoAb_B;
	              }
             	return row.locoTypeName + "-" + row.locoNO + locoab;
             },
             formatMatch: function (row) {
             	return row.locoTypeName + "-" + row.locoNO;
             },
             formatResult: function (row) {
             	return row.locoTypeName + "-" + row.locoNO;
             }
         }).result(function (event, row, formatted) {
        	 if(row&&row.locoAb){
        		 $(data).attr("locoAb",row.locoAb);
        	 }
        	 else{
        		 $(data).attr("locoAb","");
        	 }
         });

 };
 });
    
    //控制放大缩小
    RTU.register("app.lkjequipmentversionhistoryquery.query.toggleSize", function () {
        return function () {
            var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
            delbtn.addClass("popuwnd-title-del-btn2").css({ right: "-2px", top: "0px", height: "20px", width: "33px" });
            delbtn.parent().append("<div class='amplifyWin'></div>");
            var btn = $(".amplifyWin", delbtn.parent()).addClass("amplifyWin_larger");
//            var width = document.documentElement.clientWidth * 0.90;
//            var height = document.documentElement.clientHeight * 0.89;
            var Resolution=getResolution();
/*			var width=Resolution.Twidth-140;
			var height=Resolution.Theight-60;*/
			var width=Resolution.Twidth;
			var height=Resolution.Theight-10;
            btn.click(function () {
                btn.outDiv = $(".content-lkjequipmenthistory-MainDiv", popuwnd_onlleft.$wnd);
                if (btn.hasClass("amplifyWin_larger")) {//缩小
                    btn.removeClass("amplifyWin_larger").addClass("amplifyWin_small");
                    popuwnd_onlleft.setSize(300, 5);
                    btn.outDiv.hide();
                } else {//放大
                    btn.removeClass("amplifyWin_small").addClass("amplifyWin_larger");
                    setTimeout(function () {
                    	btn.outDiv.show();
                    	popuwnd_onlleft.setSize(width, height);
                    }, 25);
                }
            });
        };
    });
    
    //初始化第三个tab页
    RTU.register("app.lkjequipmentversionhistoryquery.query.initTab3",function(){
    	return function(){
    		RTU.invoke("app.lkjequipmentversionhistoryquery.query.searchzhineng");
    		
            //初始化，默认模式一
            $("input[value='LkjVersionM1']").attr("checked", "checked");
            ///主表option
            var optionFn = function () {
            	//add by wh-------------------------------------------------------
            	var locoNoStr=$(".lkjequipment_locoNo-input").val();
            	var locoAbStr="";
            	var indexLast=locoNoStr.substr(locoNoStr.length-1,locoNoStr.length);
            	var locoNo="";
            	if(isNaN(indexLast)){  //isNaN()的意思是非数字
            		locoNo=locoNoStr.substr(0,locoNoStr.length-1);
            		if(indexLast == "A"){
            			locoAbStr="1";
            		}else if(indexLast == "B"){
            			locoAbStr="2";
            		}else{
            			var locoAb=$(".lkjequipment_locoNo-input").attr("locoAb");
            			if(locoAb=="")
            				locoAbStr="0";
            			else locoAbStr=locoAb;
            		}
            	}else{
            		locoNo=locoNoStr;
            	}
            	//-------------------------------------------------------------------------
                var optionM = {
                    optionValue: "",
                    deptShortname: $(".lkjequipment_deptName-input").val(),
                    //add
                    locoNo: locoNo,
                    locoAb:locoAbStr,
                    typeShortname: $(".lkjequipment_locoTypeName-input").val(),
//                    lkjInfolocoNo: $(".lkjequipment_locoNo-input").val(),
                    beginTime: "",
                    endTime: ""
                };
                return optionM;
            };

            var option1 = new optionFn();
            option1.deptShortname = "1a&1"; //主表初始化不加载数据
            RTU.invoke("app.lkjequipmentversionhistoryquery.query.initMgrid", option1);

            $("input[name='lkjversion-model']").click(function () {
                if (first && select) {
                    $("input[name='lkjversion-model']").removeAttr("checked");
                    $(this).attr("checked", "checked");
                    
                    var locoNoStr=$(".lkjequipment_locoNo-input").val();
                	var locoAbStr="";
                	var indexLast=locoNoStr.substr(locoNoStr.length-1,locoNoStr.length);
                	var locoNo="";
                	if(isNaN(indexLast)){  //isNaN()的意思是非数字
                		locoNo=locoNoStr.substr(0,locoNoStr.length-1);
                		if(indexLast == "A"){
                			locoAbStr="1";
                		}else if(indexLast == "B"){
                			locoAbStr="2";
                		}else{
                			var locoAb=$(".lkjequipment_locoNo-input").attr("locoAb");
                			if(locoAb=="")
                				locoAbStr="0";
                			else locoAbStr=locoAb;
                		}
                	}else{
                		locoNo=locoNoStr;
                	}
                    
                    var option = {
                        optionValue: radiolkjFlag == "" ? $("input[checked='checked']", $(".lkjmodel-container")).val() : radiolkjFlag,
                        locoTypeid: locoTypeid1,
//                        locoNo: locoNo1,
                        locoNo: locoNo,
                        locoAb:locoAbStr,
                        
                        beginTime: $(".lkjequipment_beginTime-input").val(),
                        endTime: $(".lkjequipment_endTime-input").val()
                    };
                    RTU.invoke("app.lkjequipmentversionhistoryquery.notShowData", option);
                }
                else {
                    $("input[name='lkjversion-model']").removeAttr("checked");
                    $(this).attr("checked", "checked");
                    
                    var locoNoStr=$(".lkjequipment_locoNo-input").val();
                	var locoAbStr="";
                	var indexLast=locoNoStr.substr(locoNoStr.length-1,locoNoStr.length);
                	var locoNo="";
                	if(isNaN(indexLast)){  //isNaN()的意思是非数字
                		locoNo=locoNoStr.substr(0,locoNoStr.length-1);
                		if(indexLast == "A"){
                			locoAbStr="1";
                		}else if(indexLast == "B"){
                			locoAbStr="2";
                		}else{
                			var locoAb=$(".lkjequipment_locoNo-input").attr("locoAb");
                			if(locoAb=="")
                				locoAbStr="0";
                			else locoAbStr=locoAb;
                		}
                	}else{
                		locoNo=locoNoStr;
                	}
                    
                    var option = {
                        optionValue: radiolkjFlag == "" ? $("input[checked='checked']", $(".lkjmodel-container")).val() : radiolkjFlag,
                        locoTypeid: 1,
//                        locoNo: 1,
                        locoNo: locoNo,
                        locoAb:locoAbStr,
                        beginTime: $(".lkjequipment_beginTime-input").val(),
                        endTime: $(".lkjequipment_endTime-input").val()
                    };
                    RTU.invoke("app.lkjequipmentversionhistoryquery.notShowData", option);
                }

            });
            $("input[name='lkjversion-model']:checked").click();

            //查询按钮事件
            $("#loco-lkjequipment-query-btn").click(function () {
                first = true;
                var optionM = new optionFn();
                ///主表加载数据
                RTU.invoke("app.lkjequipmentversionhistoryquery.query.initMgrid", optionM);
                $("#LKJ-gridId .RTTable-Body tbody tr:eq(0)").click();
            });
            if (globLeocono != undefined) {
                $(".lkjequipment_locoNo-input").val(globLeocono);
                $("#loco-lkjequipment-query-btn").click();
            }
            
    	};
    });
    
    
    
    //智能搜索
    RTU.register("app.lkjequipmentversionhistoryquery.query.searchzhineng", function () {
    	
       var initdepotStrAuto = function () {
       	depotStrExParams = {
       		shortname:$('#lkjequipment_deptName-input').val(),
       	};
       	depotStrParse = function (data) {
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
                   var text = replaceSpace(data[i]);
                   rows[rows.length] = {
                       data: text,
                       value: text,
                       result: text
                   };
               }
               return rows;
       	};
       	
       	autocompleteBuilder($("#lkjequipment_deptName-input"), "depot/findByShortname", depotStrExParams, depotStrParse);
       	try {
       		$('#lkjequipment_deptName-input').result(function (event, autodata, formatted) {
       			$('#lkjequipment_deptName-input').val(formatted);
       		});
       	}
       	catch (e) {
       	}
       };
       
       //机车型号
       var inittypenameStrAuto = function () {
       	loconameStrExParams = {
       		shortName:$('#lkjequipment_locoTypeName-input').val(),
       		locoNo:'',
       	};
       	loconameStrParse = function (data) {
       		
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
                   var text = replacelocoTypeNameSpace(data[i]);
                   rows[rows.length] = {
                       data: text,
                       value: text,
                       result: text
                   };
               }
               return rows;
       	};
       	autocompleteBuilder($("#lkjequipment_locoTypeName-input"), "traintype/searchByLocoTypeAndLocoNo", loconameStrExParams, loconameStrParse);
       	try {
       		$('#lkjequipment_locoTypeName-input').result(function (event, autodata, formatted) {
       			$('#lkjequipment_locoTypeName-input').val(formatted);
       		});
       	}
       	catch (e) {
       	}
       };
       
       
     //机车号
       var initloconoStrAuto = function () {
       	loconoStrExParams = {
       		locoNo:$('#lkjequipment_locoNo-input').val(),
//       		shortName:'',
       	};
       	loconoStrParse = function (data) {
       		
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
            	   var text1 = replacelocoNoSpace(data[i]);
                   var text2 = replacelocoAbSpace(data[i]);
                   if(text2 !='1'&&text2!='2'){
                     	text2="";
                     }else if(text2 == '1'){
                     	text2="A";
                     }else{
                     	text2="B";
                     }
//                   var text = replacelocoNoSpace(data[i]);
                   var text = text1 + text2;
                   rows[rows.length] = {
                       data: text,
                       value: text,
                       result: text
                   };
               }
               return rows;
       	};
       	autocompleteBuilder($(".lkjequipment_locoNo-input"), "traintype/searchByLocoNo", loconoStrExParams, loconoStrParse);
       	try {
       		$('#lkjequipment_locoNo-input').result(function (event, autodata, formatted) {
       			$('#lkjequipment_locoNo-input').val(formatted);
       		});
       	}
       	catch (e) {
       	}
       };
       
       var replaceSpace = function (obj) {
           if (obj.text) {
               var reg = /\s/g;
               return obj.text.replace(reg, "");
           } else {
               return "";
           }
       };
       
       var replacelocoTypeNameSpace = function (obj) {
           if (obj.locoTypeName) {
               var reg = /\s/g;
               return obj.locoTypeName.replace(reg, "");
           } else {
               return "";
           }
       };
       
       var replacelocoNoSpace = function (obj) {
           if (obj.locoNo) {
               var reg = /\s/g;
               return obj.locoNo.replace(reg, "");
           } else {
               return "";
           }
       };
       
       //add by wh
       var replacelocoAbSpace = function (obj) {
           if (obj.locoAb) {
               var reg = /\s/g;
               return obj.locoAb.replace(reg, "");
           } else {
               return "";
           }
       };
       
       return function () {
    	   
       	   $("#lkjequipment_deptName-input").inputTip({ text: "" });
           $("#lkjequipment_locoTypeName-input").inputTip({ text: "" });
           $("#lkjequipment_locoNo-input").inputTip({ text: "" });
           
           initdepotStrAuto();
           
           inittypenameStrAuto();
		
           initloconoStrAuto();
			
           $(".wrapTipDiv",$(".content-lkjequipmenthistory-tab3-condition-cell")).css("display","inline-block");
           
//			$(".updateCommon").css({"position":"absolute","margin-left":"-118px","margin-top":"-8px"});
//            $(".content-lkjequipmenthistory-tab3-condition-cell div input").css({"margin-left":"95px","width":"149px"});
//            $(".content-lkjequipmenthistory-tab3-condition-cell div").css("width","249px");
       };
   });
   
   
   
 //显示智能搜提示
   var autocompleteBuilder = function (object, url, exParams, parse) {
   	try {
   		url = "../" + url;                
   		
   		object.autocomplete(url, {
   			minChars: 0,
   			width: 156,
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
    
    
    
    
    //初始化tab页切换事件
    RTU.register("app.lkjequipmentversionhistoryquery.query.initTopBtn",function(){
    	return function(){
    		
    		$("#app_lkjequipmenthistory_closeBtn").unbind("click").click(function(){
    			popuwnd_onlleft.$wnd.find(".popuwnd-title-del-btn").click();
    		});
    		$(".tab-start-head-alarm-version").unbind("click").click(function(){
   			 	$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-middle-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-end-div-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-version-alarm-div").removeClass("hidden");
                $(" .content-basic-div-new-version").addClass("hidden");
                $(" .content-lkjequipmenthistory-middleDiv").addClass("hidden");
                $(" .content-lkjequipmenthistory-endDiv").addClass("hidden");
    		});
    		$(".tab-start-head-alarm-version").click();
    		
    		$(".tab-start-head-version").unbind("click").click(function(){
    			 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                 $(" .tab-middle-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .tab-end-div-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .tab-start-head-alarm-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .content-basic-div-new-version").removeClass("hidden");
                 $(" .content-lkjequipmenthistory-middleDiv").addClass("hidden");
                 $(" .content-lkjequipmenthistory-endDiv").addClass("hidden");
                 $(" .content-version-alarm-div").addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version1",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version2",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version3",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version4",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version5",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
                 $(".content-locospread-middle-c-sub-title-version6",$("#content-lkjequipmenthistory-version-right-hidden")).addClass("hidden");
    		});
    		/*$(".tab-start-head-version").click();*/
    		$(".tab-middle-version").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-start-head-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-end-div-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head-alarm-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-basic-div-new-version").addClass("hidden");
                $(" .content-lkjequipmenthistory-middleDiv").removeClass("hidden");
                $(" .content-lkjequipmenthistory-endDiv").addClass("hidden");
                $(" .content-version-alarm-div").addClass("hidden");
    		});
    		
    		$(".tab-end-div-version").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-middle-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head-alarm-version").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-basic-div-new-version").addClass("hidden");
                $(" .content-version-alarm-div").addClass("hidden");
                $(" .content-lkjequipmenthistory-middleDiv").addClass("hidden");
                $(" .content-lkjequipmenthistory-endDiv").removeClass("hidden");
                RTU.invoke("app.lkjequipmentversionhistoryquery.query.initTab3");
    		});
    	};
    });
    
    //根据版本统计
    RTU.register("app.lkjequipmentversionhistoryquery.query.searchByVersion",function(){
    	return function(){
    		RTU.invoke("header.msg.show","加载中,请稍后!!");
    		engineInfoArr.splice(0,engineInfoArr.length);
    		var url="lkjverInfo/searchVersionsToEngine?mainPlanId="+$("#lkjver_bureaPlanSel").val()+"&subPlanId="+$("#lkjver_depotPlanSel").val();
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	 if(data.data&&data.data.length>0){
                		 RTU.invoke("app.lkjequipmentversionhistoryquery.query.Tab1.createHtml",data.data);
                	 }
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //第一个tab页组装html
    RTU.register("app.lkjequipmentversionhistoryquery.query.Tab1.createHtml",function(){  
        var $buildItem1 = function (data, index) {	
        	this.$item  =$("#content-lkjequipmenthistory-version-right-hidden");
        	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-title-lineName").text(data.jkzbAData);
            this.$item.find(".content-lkjequipmenthistory-middle-c-sub-title-num").text(data.vehicleCount);
            this.$item.find(".content-locospread-middle-c-sub-title-version1-name").html("<input type='checkbox' value='1' class='content-locospread-checkbox'>");
            this.$item.find(".excTotalCountLabel").html("(版本报警:"+data.alarmCount+"台,未换装:"+data.unexcCount+"台,换装错误:"+data.errorExcCount+"台"+")");
            var tabDiv=this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv");
            $(tabDiv).html("");
            
            var html="";
            var showD=data.engineInfoList;
            var showD_jkzbAData = data.jkzbAData;
            if(showD_jkzbAData!="其它"){
	            engineInfoArr.push(showD_jkzbAData);
            }
            for(var i=0,len=showD.length;i<len;i++){
            	var locoTypenameAndLocoAndAB=null;
            	if (showD[i].locoAb !="1"&&showD[i].locoAb!="2") {
            		locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo;
                } else if (showD[i].locoAb == "1") {
                	locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo + "A";
                } else{
                	locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo + "B";
                }
            	
            	var isOnlineStyle = "";
            	
            	/*if(showD[i].isOnline=="在线"){
            		isOnlineStyle = "content-lkjequipmenthistory-middle-c-sub-c-tabDiv-TdOnline";
            	}*/
            	if(showD[i].isAlarm==1){
            		isOnlineStyle=" content-lkjequipmenthistory-alarm";
            	}
            	else{
            		switch(showD[i].planExcResult){
                	case 0:
                		isOnlineStyle=" content-lkjequipmenthistory-unexchange";
                		break;
                	/*case 1:
                	case 2:
                	case 3:
                		isOnlineStyle=" content-lkjequipmenthistory-exchange";
                		break;*/
                	case 8:
                		isOnlineStyle=" content-lkjequipmenthistory-errorexchange";
                		break; 
                		default:break;
                	}
            	}
            	var texthtml="<div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td "+isOnlineStyle+"' alt='1'" +
    			"jkzbAData='"+showD[i].jkzbAData+"' tTypeShortname='"+showD[i].tTypeShortname+"' date='"+showD[i].date+"' time='"+showD[i].time+"' jkzbA='"+showD[i].jkzbA+"' " +
    			"monitor1='"+showD[i].monitor1+"' monitor2='"+showD[i].monitor2+"' monitor1Data='"+showD[i].monitor1Data+"' monitor2Data='"+showD[i].monitor2Data+"' " +
    			"jkzbAjkdate='"+showD[i].jkzbAjkdate+"' locoNo='"+showD[i].locoNo+"' locoAb='"+showD[i].locoAb+"' dName='"+showD[i].dName+"' " +
    			"locoTypeid='"+showD[i].locoTypeid+"' checiName='"+showD[i].checiName+"' kehuo='"+showD[i].kehuo+"' deptId='"+showD[i].deptId+"' " +
    			"isOnline='"+showD[i].isOnline+"' lkjType='"+showD[i].lkjType+"'"+
    			(showD[i].lkjType!=1?"":(" apphostpluginver_i='"+showD[i].apphostpluginver_i+"' apphostpluginver_ii='"+showD[i].apphostpluginver_ii
    					+"' dmisoftwarever_i='"+showD[i].dmisoftwarever_i+"' dmisoftwarever_ii='"+showD[i].dmisoftwarever_ii
    					+"' hostplugincontroldataparam_i='"+showD[i].hostplugincontroldataparam_i+"' hostplugincontroldataparam_ii='"+showD[i].hostplugincontroldataparam_ii
    					+"' hostplugincontrolsoftparam_i='"+showD[i].hostplugincontrolsoftparam_i+"' hostplugincontrolsoftparam_ii='"+showD[i].hostplugincontrolsoftparam_ii
    					+"' hostplugindataver_i='"+showD[i].hostplugindataver_i+"' hostplugindataver_ii='"+showD[i].hostplugindataver_ii
    					+"' hostpluginsoftwarever_i='"+showD[i].hostpluginsoftwarever_i+"' hostpluginsoftwarever_ii='"+showD[i].hostpluginsoftwarever_ii+"'"))
    					+" plansoftver='"+showD[i].plansoftver+"'>" +
    			"<div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-type'>" +locoTypenameAndLocoAndAB
        		   +"</div><div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-checiname'>"+showD[i].jkzbAData+"/"
        		   +(showD[i].isAlarm==1?showD[i].planSoftVer:("<span style='color:red'>"+showD[i].planSoftVer+"</span>"))+
        		  "</div></div>";
            	html=html+texthtml;
            }            
            $(tabDiv).html(html);
            if(showD.length<=10){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"50px","line-height":"50px"});
                this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"50px","line-height":"50px"});
            }else if(showD.length>10&&showD.length<=20){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"100px","line-height":"100px"});
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"100px","line-height":"100px"});
            }else if(showD.length>20){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"145px","line-height":"145px"});
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"145px","line-height":"145px"});
            }
            return $(this.$item);
        };
    	return function(data){
    		$("input[type='checkbox'][name='hzqkCheckBox']","#topCheckBoxDiv").hide();
    		var showBody1=$("#content-lkjequipmenthistory-beginDiv");
    		$(showBody1).html("");
    		var html1=[];
    		var count1=0;
    		var unExcCount=0;
    		var excCount=0;
    		var errorExcCount=0;
    		var alarmCount=0;
    		for(var i=0,len=data.length;i<len;i++){
				count1 += data[i].vehicleCount;
				unExcCount+=data[i].unexcCount;
				excCount+=data[i].excCount;
				alarmCount+=data[i].alarmCount;
				errorExcCount+=data[i].errorExcCount;
				html1.push((new $buildItem1(data[i],i)).html());
    		}
    		$("#verAlarmCheckBoxLabel","#topCheckBoxDiv").html("版本报警("+alarmCount+"台)");
    		$("#unExcCheckBoxLabel","#topCheckBoxDiv").html("未换装("+unExcCount+"台)");
    		$("#excCheckBoxLabel","#topCheckBoxDiv").html("已换装("+excCount+"台)");
    		$("#errorExcCheckBoxLabel","#topCheckBoxDiv").html("换装错误("+errorExcCount+"台)");
    		$("#content-lkjequipmenthistory-head-totalCount").text((count1)+"台");
    		$("input[type='checkbox'][name='hzqkCheckBox']","#topCheckBoxDiv").show();
    		$("input[type='checkbox'][name='hzqkCheckBox']","#topCheckBoxDiv").unbind("click").click(function(){
            	if($(this).attr("checked")=="checked")
            		$("."+$(this).attr("classtype"),"#content-lkjequipmenthistory-beginDiv").show();
            	else
            		$("."+$(this).attr("classtype"),"#content-lkjequipmenthistory-beginDiv").hide();
            });
    		$(showBody1).append(html1.join(""));
    		
    		setTimeout(function(){
    			RTU.invoke("app.lkjequipmentversionhistoryquery.query.initTab1Btn");
                /*if(window.sendVersionWarningData){
                	if($("#unExcCheckBox").attr("checked")){
                    	$("#unExcCheckBox").removeAttr("checked");
                    	$(".content-lkjequipmenthistory-unexchange","#content-lkjequipmenthistory-beginDiv").hide();
                    }
                    if($("#errorExeCheckBox").attr("checked")){
                    	$("#errorExeCheckBox").removeAttr("checked");
                    	$(".content-lkjequipmenthistory-errorexchange","#content-lkjequipmenthistory-beginDiv").hide();
                    }
       			 $("#searchLocoInputVersion").val(window.sendVersionWarningData.locoName);
           		 $("#searchLocoBtnVersion").click();
       		 }
       		 window.sendVersionWarningData=null;*/
    		},25);
    		RTU.invoke("header.msg.hidden");
    	};
    });
    
    //初始化第一个tab页的按钮事件
    RTU.register("app.lkjequipmentversionhistoryquery.query.initTab1Btn",function(){
    	return function(){
    		$(".content-lkjequipmenthistory-middle-c-sub-title-img",$(".content-basic-div-new-version")).unbind("click").click(function(){
    			var parent=$(this).parent().parent();
    			var chidren=$(this).children();
    			var content=$(".content-lkjequipmenthistory-middle-c-sub-c",$(parent));
   			    var content1=$(".content-lkjequipmenthistory-middle-c-sub-c-sub",$(parent));
                var cars=$(".content-lkjequipmenthistory-middle-c-sub-c-table-td-bg",$(content));
                if(!$(content).hasClass("hidden")){
    				$(content).addClass("hidden");
   				    $(content1).addClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_max.png");
                    $(cars).removeClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    			}else{
    				$(content).removeClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_min.png");
    			}
    		});
    		
       		$(".content-lkjequipmenthistory-middle-c-sub-c-scrollUp",$(".content-basic-div-new-version")).unbind("click").click(function(){
       			var parent=$(this).parent().parent();
                var body=$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv",$(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv",$(parent)));

                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(currentSrollTop-58);
       		});
       		
       		$(".content-lkjequipmenthistory-middle-c-sub-c-scrollDown",$(".content-basic-div-new-version")).unbind("click").click(function(){
       			var parent=$(this).parent().parent();
                var body=$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv",$(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv",$(parent)));
                
                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(58+currentSrollTop);
       		});
    		
       		/**
       		 * ***********************************************下面是控制滚动的js
       		 */
       		$(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv",$(".content-basic-div-new-version")).unbind("mousewheel").mousewheel(function(objEvent, intDelta){
       			if (intDelta > 0){
			       $(".content-lkjequipmenthistory-middle-c-sub-c-scrollUp",$(this).parent()).click();
				}else if (intDelta < 0){
				   $(".content-lkjequipmenthistory-middle-c-sub-c-scrollDown",$(this).parent()).click();
				}

       		}).mouseover(function(){
           		$(".content-lkjequipmenthistory-version-right").unbind("scroll").scroll(function(e){
           			var top=$(this).offset().top;
           			$(this).scrollTop(top);
           			return true;
           		});
       		}).mouseout(function(){
           		$(".content-lkjequipmenthistory-version-right").unbind("scroll").scroll(function(e){

           		});
       		});
       		/**
       		 * ************************************************上面是控制滚动的js
       		 */
       		
    		$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td",$(".content-lkjequipmenthistory-version-right")).mouseover(function(e){
    			  $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");    			  
    			  var jkzbAData=$(this).attr("jkzbAData");
    			  var tTypeShortname=$(this).attr("tTypeShortname");
                  var date=$(this).attr("date");
                  var time=$(this).attr("time");
                  var lkjType=$(this).attr("lkjType");
                  if(lkjType!=1){
                	  $("#content-lkjequipmenthistory-tuzhongHoverDiv15").addClass("hidden");
        			  var jkzbA=$(this).attr("jkzbA");
        			  var monitor1=$(this).attr("monitor1");
        			  var monitor2=$(this).attr("monitor2");
        			  var monitor1Data=$(this).attr("monitor1Data");
        			  var monitor2Data=$(this).attr("monitor2Data");
        			  var jkzbAjkdate=$(this).attr("jkzbAjkdate");
        			  var locoNo=$(this).attr("locoNo");
/*        			  var dName=$(this).attr("dName");
        			  var locoTypeid=$(this).attr("locoTypeid");
        			  var checiName=$(this).attr("checiName");
        			  var kehuo=$(this).attr("kehuo");
        			  var deptId=$(this).attr("deptId");
        			  var isOnline=$(this).attr("isOnline");*/
        			  var locoAb=$(this).attr("locoAb");
    	 			  var locoab="";
    	 			  if (locoAb!=1&&locoAb!=2) {
    	           		 locoab="";
    		          }else if (locoAb==1) {//A
    		              locoab=window.locoAb_A;
    	              }else{
    	            	  locoab=window.locoAb_B;
    	              }
        			  var clientX=e.clientX;
    				  var clientY=e.clientY;
    				  
    				  var locoTypeDiv=$("#content-lkjequipmenthistory-tuzhongHoverDiv");
    				  $("#tuzhongHoverDiv-tab-loco",$(locoTypeDiv)).text(tTypeShortname+"-"+locoNo+locoab);
    				  $("#tuzhongHoverDiv-tab-date",$(locoTypeDiv)).text(date);
    				  $("#tuzhongHoverDiv-tab-time",$(locoTypeDiv)).text(time);
    				  $("#tuzhongHoverDiv-tab-jkzbA",$(locoTypeDiv)).text(jkzbA);
    				  $("#tuzhongHoverDiv-tab-jkzbAData",$(locoTypeDiv)).text(jkzbAData);
    				  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).text(monitor1);
    				  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).text(monitor2);
    				  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).text(monitor1Data);
    				  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).text(monitor2Data);
    				  $("#tuzhongHoverDiv-tab-jkzbAjkdate",$(locoTypeDiv)).text(jkzbAjkdate);
    				  
    				  if(monitor1 != monitor2){
    					  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor1-label",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor2-label",$(locoTypeDiv)).css({"color":"red"});
    				  }else{
    					  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor1-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor2-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    				  }
    				  
    				  if(monitor1Data != monitor2Data){
    					  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor1Data-label",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).css({"color":"red"});
    					  $("#tuzhongHoverDiv-tab-monitor2Data-label",$(locoTypeDiv)).css({"color":"red"});
    				  }else{
    					  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor1Data-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    					  $("#tuzhongHoverDiv-tab-monitor2Data-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
    				  }
    				  
    				  var width=$(locoTypeDiv).width();
    				  var height=$(locoTypeDiv).height();
    				  var width1 = document.documentElement.clientWidth*0.9 ;
    		          var height1 = document.documentElement.clientHeight*0.85;

    		          if((clientX+width)>width1){
    					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
    				  }else{
    					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
    				  }
    				  if((clientY+height)>height1){
    					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
    				  }else{
    					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
    				  }
    				  
    				  $(locoTypeDiv).removeClass("hidden");
                  }
                  else{
                	  $("#content-lkjequipmenthistory-tuzhongHoverDiv").addClass("hidden");

        			  var locoNo=$(this).attr("locoNo");
/*        			  var dName=$(this).attr("dName");
        			  var locoTypeid=$(this).attr("locoTypeid");
        			  var checiName=$(this).attr("checiName");
        			  var kehuo=$(this).attr("kehuo");
        			  var deptId=$(this).attr("deptId");
        			  var isOnline=$(this).attr("isOnline");*/
        			  var locoAb=$(this).attr("locoAb");
        			  var locoab="";
    	 			  if (locoAb==0) {
    	           		 locoab="";
    		          }else if (locoAb==1) {//A
    		              locoab=window.locoAb_A;
    	              }else{
    	            	  locoab=window.locoAb_B;
    	              }
        			  var clientX=e.clientX;
    				  var clientY=e.clientY;
    				  
    				  var locoTypeDiv=$("#content-lkjequipmenthistory-tuzhongHoverDiv15");
    				  $("#tuzhongHoverDiv-tab-loco15",$(locoTypeDiv)).text(tTypeShortname+"-"+locoNo+locoab);
    				  $("#tuzhongHoverDiv-tab-date15",$(locoTypeDiv)).text(date);
    				  $("#tuzhongHoverDiv-tab-time15",$(locoTypeDiv)).text(time);
    				  $("#tuzhongHoverDiv-tab-jcsjwj_i",$(locoTypeDiv)).text($(this).attr("hostplugindataver_i"));
    				  $("#tuzhongHoverDiv-tab-jcsjwj_ii",$(locoTypeDiv)).text($(this).attr("hostplugindataver_ii"));
    				  $("#tuzhongHoverDiv-tab-jcsjrj_i",$(locoTypeDiv)).text($(this).attr("hostpluginsoftwarever_i"));
    				  $("#tuzhongHoverDiv-tab-jcsjrj_ii",$(locoTypeDiv)).text($(this).attr("hostpluginsoftwarever_ii"));
    				  $("#tuzhongHoverDiv-tab-kzcsrj_i",$(locoTypeDiv)).text($(this).attr("hostplugincontrolsoftparam_i"));
    				  $("#tuzhongHoverDiv-tab-kzcsrj_ii",$(locoTypeDiv)).text($(this).attr("hostplugincontrolsoftparam_ii"));
    				  $("#tuzhongHoverDiv-tab-kzcswj_i",$(locoTypeDiv)).text($(this).attr("hostplugincontroldataparam_i"));
    				  $("#tuzhongHoverDiv-tab-kzcswj_ii",$(locoTypeDiv)).text($(this).attr("hostplugincontroldataparam_ii"));
    				  $("#tuzhongHoverDiv-tab-zjyyrj_i",$(locoTypeDiv)).text($(this).attr("apphostpluginver_i"));
    				  $("#tuzhongHoverDiv-tab-zjyyrj_ii",$(locoTypeDiv)).text($(this).attr("apphostpluginver_i"));
    				  $("#tuzhongHoverDiv-tab-dmiyyrj_i",$(locoTypeDiv)).text($(this).attr("dmisoftwarever_i"));
    				  $("#tuzhongHoverDiv-tab-dmiyyrj_ii",$(locoTypeDiv)).text($(this).attr("dmisoftwarever_ii"));
    				  
    				  
    				  var width=$(locoTypeDiv).width();
    				  var height=$(locoTypeDiv).height();
    				  var width1 = document.documentElement.clientWidth*0.9 ;
    		          var height1 = document.documentElement.clientHeight*0.85;

    		          if((clientX+width)>width1){
    					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
    				  }else{
    					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
    				  }
    				  if((clientY+height)>height1){
    					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
    				  }else{
    					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
    				  }
    				  
    				  $(locoTypeDiv).removeClass("hidden");
                  }  			
    		}).mousemove(function(e){
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var locoTypeDiv=$(this).attr("lkjType")!=1?$("#content-lkjequipmenthistory-tuzhongHoverDiv"):$("#content-lkjequipmenthistory-tuzhongHoverDiv15");
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth;
		          var height1 = document.documentElement.clientHeight;

		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
    		}).mouseout(function(e){
    			$(this).removeClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    			if($(this).attr("lkjType")!=1)
    				$("#content-lkjequipmenthistory-tuzhongHoverDiv").addClass("hidden");
    			else 
    				$("#content-lkjequipmenthistory-tuzhongHoverDiv15").addClass("hidden");
    		}).mousedown(function(e){
    			 if (3 == e.which) {
      				 var that=this;
      				 var clientX=e.clientX;
      				 var clientY=e.clientY;
      				 var rightDiv=$("#content-lkjequipmenthistory-rightClickDiv");
      				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth  ;
	   		         var height1 = document.documentElement.clientHeight;
	   		          
	   		      if((clientX+width)>width1){
					  $(rightDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(rightDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(rightDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(rightDiv).css({"top":(clientY-30)+"px"});
				  }
	   				 $(rightDiv).removeClass("hidden");
	   				 
	   				 $("tr td",$(".content-lkjequipmenthistory-rightClickDiv-tab")).unbind("click").click(function(){
	   					 var id=$(this).attr("id");
	   					 var tTypeShortname=$(that).attr("tTypeShortname");
	   					 var locoNo=$(that).attr("locoNo");
	   					 var locoAb=$(that).attr("locoAb");
	   					 var locoCheci=$(that).attr("checiName");
	   					 var locoTypeid=$(that).attr("locoTypeid");
	   					 var speed=$(that).attr("speed");
	   					 var depotname=$(that).attr("dName");
                         var kehuo=$(that).attr("kehuo");
                         var date=$(that).attr("date");
                         var time=$(that).attr("time");
                         var lkjType=$(that).attr("lkjType");
	   					 if(id=="menu1"){
	   						 var loco=tTypeShortname+"-"+locoNo;
	                         RTU.invoke("map.marker.findMarkersContainsNotExist", {
	                             pointId: loco,
	                             isSetCenter: true,
	                             stopTime: 5000,
	                             locoAb:locoAb,
	                             locoTypeid:locoTypeid,
	                             locoNo:locoNo,
	                             lkjType:lkjType,
	                             fnCallBack: function () {
	                             }
	                         });
//	                         var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
//	                         var btn = $(".amplifyWin", delbtn.parent());
//	                         btn.click();
	                         $("#app_lkjequipmenthistory_closeBtn").click();
	                         $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu2"){
	   						 var sendData={
	                                 "id": "11111",
	                                 "name": locoCheci + "(" + tTypeShortname+"-"+locoNo + ")",
	                                  data: {
	                                      locoTypeid:locoTypeid,
	                                      locoNO:locoNo,
	                                      checiName:locoCheci,
	                                      locoTypeName:tTypeShortname,
	                                      locoAb:locoAb,
	                                      lkjType:lkjType
	                                  }
	                         };
	                          var arr=[];
	                          arr[0]=sendData;
	                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
	                          $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu3"){
                            var sendData={
                                locoTypeid:locoTypeid,
                                locoNo:locoNo,
                                locoAb:locoAb,
                                locoTypename:tTypeShortname,
                                kehuo:kehuo,
                                date:date+" "+time
                            };
                            if(lkjType!=1)
	   						RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                            else 
                            	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
	   					 }else if(id=="menu4"){
	   						 var datas=[];
	   						 var checiName = locoCheci;
                             var locoTypeName = tTypeShortname;
                             var locoNO = locoNo;
                             var depotName =depotname;
                             datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
                             if(lkjType!=1)
                             	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                             else
                             	RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
                             //RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                             $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu5"){
	   					    var data = {
                                  "locotypeid": locoTypeid,
                                  "locono": locoNo,
                                  "locoTypeName": tTypeShortname,
                                  "locoAb": locoAb,
                                  "speed":speed
                              };
	   		            	if(lkjType!=1)
	   		            		RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", 
	   		            				data);
	   		            	else 
	   		            		RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", 
	   		            				data);
                              //RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
                              $(rightDiv).addClass("hidden");
	   					 }
	   				 });
	   				 
	   				 $("body").click(function(){
	   					$("#content-lkjequipmenthistory-rightClickDiv").addClass("hidden");
	   				 });
      				 
      			 }
    		});
    		$("#gotoczsb").unbind("click").click(function(){
    			var new_window = null; 
    			new_window = window.open(); 
    			new_window.location.href = window.userData["Urlczsb"]; 
    		});
    		$("#gotoczsb_hz").unbind("click").click(function(){
    			var new_window = null; 
    			new_window = window.open(); 
    			new_window.location.href = window.userData["Urlczsb_hz"]; 
    		});
    		$("#searchLocoBtnVersion").unbind("click").click(function(){
                var loco=$("#searchLocoInputVersion").val();
                var count =loco.indexOf("-");   //统计“-”
                var isAB=null;
                
                var imgBtn=$(".content-lkjequipmenthistory-middle-c-sub-title-img",$(".content-basic-div-new-version"));
                imgBtn.each(function() {
                    var imgBtnParent=$(this).parent().parent();
                    var chidren=$(imgBtnParent).children();
                    var content=$(".content-lkjequipmenthistory-middle-c-sub-c",$(imgBtnParent));
                    if(!$(content).hasClass("hidden")){
                       $(this).click();
                    }
                });

                if(count>0){  //机车简称-机车号  (DF11-0005)
                	 var locoArr=loco.split("-");
                     var locoTypeName=locoArr[0].toLocaleUpperCase();//机车简称
                     loco=loco.toLocaleUpperCase(); //转换大写
                     isAB=loco.substring(loco.length-1);//判断最后一个字符（是否有AB节）
                     
                	if(!isNaN(isAB)){   //AB节=0   isNaN()的意思是非数字    
                		$("div[ttypeshortname='"+locoTypeName+"']",$(".content-basic-div-new-version")).each(function() {
                            var tTypeShortname=$(this).attr("tTypeShortname");
                            var locono=$(this).attr("locono");
                            var locoab=$(this).attr("locoab");
                            var alt=$(this).attr("alt");

                            if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                                var str=tTypeShortname+"-"+locono;
                                if(str==loco){
                                    if(alt=='1'){
                                      var parent=$(this).parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");

                                    }else if(alt=='2'){
                                      var parent1=$(this).parent().parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                      var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                      $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                    }
                                    return false;
                                }
                            }
                        });
                	}else if (isAB =="A"){
                		$("div[ttypeshortname='"+locoTypeName+"']",$(".content-basic-div-new-version")).each(function() {
                            var tTypeShortname=$(this).attr("tTypeShortname");
                            var locono=$(this).attr("locono");
                            var locoab=$(this).attr("locoab");
                            var alt=$(this).attr("alt");

                            if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                                var str=tTypeShortname+"-"+locono+"A";
                                if(str==loco && locoab==1){
                                    if(alt=='1'){
                                      var parent=$(this).parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");

                                    }else if(alt=='2'){
                                      var parent1=$(this).parent().parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                      var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                      $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                    }
                                    return false;
                                }
                            }
                        });
                		
                	}else if(isAB =="B"){
                		$("div[ttypeshortname='"+locoTypeName+"']",$(".content-basic-div-new-version")).each(function() {
                            var tTypeShortname=$(this).attr("tTypeShortname");
                            var locono=$(this).attr("locono");
                            var locoab=$(this).attr("locoab");
                            var alt=$(this).attr("alt");

                            if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                                var str=tTypeShortname+"-"+locono+"B";
                                if(str==loco && locoab==2){
                                    if(alt=='1'){
                                      var parent=$(this).parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");

                                    }else if(alt=='2'){
                                      var parent1=$(this).parent().parent().parent().parent().parent();
                                      $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                      var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                      $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                      $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                    }
                                    return false;
                                }
                                /*else if(str==loco && locoab==3){
                                    if(alt=='1'){
                                        var parent=$(this).parent().parent().parent().parent();
                                        $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                        $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");

                                      }else if(alt=='2'){
                                        var parent1=$(this).parent().parent().parent().parent().parent();
                                        $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                        var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                        $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                        $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                      }
                                      return false;
                                  }*/
                            }
                        });
                	}
                	
                }else{  //机车号AB节   0005A或者0005a
                	var locoNo=null;
                	isAB=loco.substring(loco.length-1,loco.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节）
                	if(!isNaN(isAB)){  //只有机车号、AB节为0
                		
                		locoNo =loco.substring(0,loco.length); // 机车号

                        $("div[locono='"+locoNo+"']",$(".content-basic-div-new-version")).each(function() {
                          var locono=$(this).attr("locono");
                          var locoab=$(this).attr("locoab");
                          var alt=$(this).attr("alt");
      
                          if(locono&&locono!=null&&locoab&&locoab!=null){
                              var str=locono;
                              if(str==loco){
                                  if(alt=='1'){
                                    var parent=$(this).parent().parent().parent().parent();
                                    $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                    $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
      
                                  }else if(alt=='2'){
                                    var parent1=$(this).parent().parent().parent().parent().parent();
                                    $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                    var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                    $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                    $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                  }
                                  return false;
                              }                              
                          }
                      });
                	}else{   //机车号AB节
                		locoNo =loco.substring(0,loco.length-1); // 机车号
                		if(isAB=="A"){  //
                			 $("div[locono='"+locoNo+"']",$(".content-basic-div-new-version")).each(function() {
                                 var locono=$(this).attr("locono");
                                 var locoab=$(this).attr("locoab");
                                 var alt=$(this).attr("alt");
                                 if(locono&&locono!=null&&locoab&&locoab!=null){
                                     var str=locono;
                                     if(str==locoNo && locoab==1 ){
                                         if(alt=='1'){
                                           var parent=$(this).parent().parent().parent().parent();
                                           $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                           $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
             
                                         }else if(alt=='2'){
                                           var parent1=$(this).parent().parent().parent().parent().parent();
                                           $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                           var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                           $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                           $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                         }
                                         return false;
                                     }                              
                                 }
                             });
                    	}else if(isAB=="B"){  //
                    		 $("div[locono='"+locoNo+"']",$(".content-basic-div-new-version")).each(function() {
                                 var locono=$(this).attr("locono");
                                 var locoab=$(this).attr("locoab");
                                 var alt=$(this).attr("alt");
                                 if(locono&&locono!=null&&locoab&&locoab!=null){
                                     var str=locono;
                                     if(str==locoNo && locoab==2){
                                         if(alt=='1'){
                                           var parent=$(this).parent().parent().parent().parent();
                                           $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                           $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
             
                                         }else if(alt=='2'){
                                           var parent1=$(this).parent().parent().parent().parent().parent();
                                           $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                           var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                           $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                           $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                         }
                                         return false;
                                     }
                                     /*else if(str==loco && locoab==3){
                                         if(alt=='1'){
                                             var parent=$(this).parent().parent().parent().parent();
                                             $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                             $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");

                                           }else if(alt=='2'){
                                             var parent1=$(this).parent().parent().parent().parent().parent();
                                             $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                             var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                             $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                             $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                           }
                                           return false;
                                      }      */                        
                                 }
                             });
                    	}
                	}
                }
                
		   });
    		
    	};
    });
/**********************************
 * 第二个tab
 *********************************/   
    //根据型号统计
    RTU.register("app.lkjequipmentversionhistoryquery.query.searchByLocoType",function(){
    	return function(){
    		var url="lkjverInfo/searchLocoTypeToEngine";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	 RTU.invoke("app.lkjequipmentversionhistoryquery.query.Tab2.createHtml",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //第二个tab页组装html
    RTU.register("app.lkjequipmentversionhistoryquery.query.Tab2.createHtml",function(){    	
    	var $buildItem2 = function (data, index) {	
        	this.$item  =$("#content-lkjequipmenthistory-version-right-hidden1");
        	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-title-lineName").text(data.tTypeShortname);
            this.$item.find(".content-lkjequipmenthistory-middle-c-sub-title-num").text(data.vehicleCount);
            this.$item.find(".content-lkjequipmenthistory-middle-c-sub-title-name").addClass("title-width");
            var versionOut1=this.$item.find(".content-locospread-middle-c-sub-title-version1");
            var versionOut2=this.$item.find(".content-locospread-middle-c-sub-title-version2");
            var versionOut3=this.$item.find(".content-locospread-middle-c-sub-title-version3");
            var versionOut4=this.$item.find(".content-locospread-middle-c-sub-title-version4");
            var versionOut5=this.$item.find(".content-locospread-middle-c-sub-title-version5");
            var versionOut6=this.$item.find(".content-locospread-middle-c-sub-title-version6");
            $(versionOut1).addClass("hidden");
            $(versionOut2).addClass("hidden");
            $(versionOut3).addClass("hidden");
            $(versionOut4).addClass("hidden");
            $(versionOut5).addClass("hidden");
            $(versionOut6).addClass("hidden");

            var versionset=data.versionEngineCounts;
            for(var i=0,len=versionset.length;i<len;i++){
            	var versionset_i_jkzbAData=versionset[i].jkzbAData;
            	var fontClass="content-locospread-middle-c-sub-title-version-num-color";
            	for(var j=0;j<engineInfoArr.length;j++){
            		if(engineInfoArr[j]==versionset_i_jkzbAData){
            			fontClass=fontClass+""+j;
            			break;
            		}
            	}
            	if(i==0){
            		this.$item.find(".content-locospread-middle-c-sub-title-version1-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"' name='content-lkj-locospread-checkbox"+index+"' checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version1-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut1).removeClass("hidden");
            	}else if(i==1){
            		this.$item.find(".content-locospread-middle-c-sub-title-version2-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"'  name='content-lkj-locospread-checkbox"+index+"'   checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version2-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut2).removeClass("hidden");
            	}else if(i==2){
            		this.$item.find(".content-locospread-middle-c-sub-title-version3-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"'  name='content-lkj-locospread-checkbox"+index+"'  checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version3-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut3).removeClass("hidden");
            	}else if(i==3){
            		this.$item.find(".content-locospread-middle-c-sub-title-version4-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"'  name='content-lkj-locospread-checkbox"+index+"'  checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version4-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut4).removeClass("hidden");
            	}else if(i==4){
            		this.$item.find(".content-locospread-middle-c-sub-title-version5-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"'  name='content-lkj-locospread-checkbox"+index+"'  checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version5-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut5).removeClass("hidden");
            	}else if(i==5){
            		this.$item.find(".content-locospread-middle-c-sub-title-version6-name").html("<input type='checkbox' value='"+versionset[i].jkzbAData+"'  name='content-lkj-locospread-checkbox"+index+"'  checked='checked' class='content-lkj-locospread-checkbox'>"+versionset[i].jkzbAData);
            		this.$item.find(".content-locospread-middle-c-sub-title-version6-num").html("(<font class='"+fontClass+"'>"+versionset[i].vehicleCount+"</font>)");
            		$(versionOut6).removeClass("hidden");
            	}
            }

            var tabDiv=this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv");
            $(tabDiv).html("");
            var html="";
            var showD=data.engineInfoList;
            for(var i=0,len=showD.length;i<len;i++){
            	var versionset_i_jkzbAData=showD[i].jkzbAData;
            	var fontClass="content-locospread-middle-c-sub-title-version-num-color";
            	for(var j=0;j<engineInfoArr.length;j++){
            		if(engineInfoArr[j]==versionset_i_jkzbAData){
            			fontClass=fontClass+""+j;
            			break;
            		}
            	}
            	
            	var isOnlineStyle = "";
            	
            	if(showD[i].isOnline=="在线"){
            		isOnlineStyle = "content-lkjequipmenthistory-middle-c-sub-c-tabDiv-TdOnline";
            	}
            	
            	var locoTypenameAndLocoAndAB=null;
            	if (showD[i].locoAb !="1"&&showD[i].locoAb!="2") {
            		locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo;
                } else if (showD[i].locoAb == "1") {
                	locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo + "A";
                }else{
                	locoTypenameAndLocoAndAB=showD[i].tTypeShortname+"-"+showD[i].locoNo + "B";;
                }
            	
            	
            	html=html+"<div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td "+isOnlineStyle+"' alt='1' " +
    			"jkzbAData='"+showD[i].jkzbAData+"' tTypeShortname='"+showD[i].tTypeShortname+"' date='"+showD[i].date+"' time='"+showD[i].time+"' jkzbA='"+showD[i].jkzbA+"' " +
    			"monitor1='"+showD[i].monitor1+"' monitor2='"+showD[i].monitor2+"' monitor1Data='"+showD[i].monitor1Data+"' monitor2Data='"+showD[i].monitor2Data+"' " +
    			"jkzbAjkdate='"+showD[i].jkzbAjkdate+"' locoNo='"+showD[i].locoNo+"' locoAb='"+showD[i].locoAb+"' dName='"+showD[i].dName+"' " +
    			"locoTypeid='"+showD[i].locoTypeid+"' checiName='"+showD[i].checiName+"' kehuo='"+showD[i].kehuo+"' deptId='"+showD[i].deptId+"' " +
    			"isOnline='"+showD[i].isOnline+"' lkjType='"+showD[i].lkjType+"'"+
    			(showD[i].lkjType!=1?"":(" apphostpluginver_i="+showD[i].apphostpluginver_i+" apphostpluginver_ii="+showD[i].apphostpluginver_ii
    					+" dmisoftwarever_i="+showD[i].dmisoftwarever_i+" dmisoftwarever_ii="+showD[i].dmisoftwarever_ii
    					+" hostplugincontroldataparam_i="+showD[i].hostplugincontroldataparam_i+" hostplugincontroldataparam_ii="+showD[i].hostplugincontroldataparam_ii
    					+" hostplugincontrolsoftparam_i="+showD[i].hostplugincontrolsoftparam_i+" hostplugincontrolsoftparam_ii="+showD[i].hostplugincontrolsoftparam_ii
    					+" hostplugindataver_i="+showD[i].hostplugindataver_i+" hostplugindataver_ii="+showD[i].hostplugindataver_ii
    					+" hostpluginsoftwarever_i="+showD[i].hostpluginsoftwarever_i+" hostpluginsoftwarever_ii="+showD[i].hostpluginsoftwarever_ii))+">" +
    			"<div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-type'>" +locoTypenameAndLocoAndAB
        		   +"</div><div class='content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-checiname' alt='"+showD[i].jkzbAData+"'><font class='"+fontClass+"'>"+showD[i].jkzbAData+
        		  "</font></div></div>";
            }            
            $(tabDiv).html(html);     
            
            if(showD.length<=10){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"50px","line-height":"50px"});
                this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"50px","line-height":"50px"});
            }else if(showD.length>10&&showD.length<=20){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"100px","line-height":"100px"});
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"100px","line-height":"100px"});
            }else if(showD.length>20){
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv").css({"height":"145px","line-height":"145px"});
            	this.$item.find(".content-lkjequipmenthistory-middle-c-sub-c").css({"height":"145px","line-height":"145px"});
            }
            return $(this.$item);
        };
    	return function(data){
    		var showBody2=$("#content-lkjequipmenthistory-middleDiv");
    		$(showBody2).html("");
    		var html2=[];
    		var count2=0;
    		for(var i=0,len=data.length;i<len;i++){
				count2 += data[i].vehicleCount;
				html2.push((new $buildItem2(data[i],i)).html());
    		}
    		$("#content-lkjequipmenthistory-head-totalCount-type").text((count2)+"台");
    		
    		$(showBody2).append(html2.join(""));
    		
    		setTimeout(function(){
    			RTU.invoke("app.lkjequipmentversionhistoryquery.query.initTab2Btn");
    		},25);
    	};
    });
    
    //初始化第二个tab页按钮事件
    RTU.register("app.lkjequipmentversionhistoryquery.query.initTab2Btn",function(){
    	return function(){
    		$(".content-lkjequipmenthistory-middle-c-sub-title-img",$(".content-lkjequipmenthistory-middleDiv")).unbind("click").click(function(){
    			var parent=$(this).parent().parent();
    			var chidren=$(this).children();
    			var content=$(".content-lkjequipmenthistory-middle-c-sub-c",$(parent));
   			    var content1=$(".content-lkjequipmenthistory-middle-c-sub-c-sub",$(parent));
                var cars=$(".content-lkjequipmenthistory-middle-c-sub-c-table-td-bg",$(content))
                if(!$(content).hasClass("hidden")){
    				$(content).addClass("hidden");
   				    $(content1).addClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_max.png");
                    $(cars).removeClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    			}else{
    				$(content).removeClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_min.png");
    			}
    		});
    		
       		$(".content-lkjequipmenthistory-middle-c-sub-c-scrollUp",$(".content-lkjequipmenthistory-middleDiv")).unbind("click").click(function(){
       			var parent=$(this).parent().parent();
                var body=$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv",$(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv",$(parent)));

                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(currentSrollTop-58);
       		});
       		
       		$(".content-lkjequipmenthistory-middle-c-sub-c-scrollDown",$(".content-lkjequipmenthistory-middleDiv")).unbind("click").click(function(){
       			var parent=$(this).parent().parent();
                var body=$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv",$(".content-lkjequipmenthistory-middle-c-sub-c-tableDiv",$(parent)));
                
                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(58+currentSrollTop);
       		});
    		
/*    		$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td",$(".content-lkjequipmenthistory-version-right")).mouseover(function(e){
    			  $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");    			  
    			  var jkzbAData=$(this).attr("jkzbAData");
    			  var tTypeShortname=$(this).attr("tTypeShortname");
                  var date=$(this).attr("date");
                  var time=$(this).attr("time");
    			  var jkzbA=$(this).attr("jkzbA");
    			  var monitor1=$(this).attr("monitor1");
    			  var monitor2=$(this).attr("monitor2");
    			  var monitor1Data=$(this).attr("monitor1Data");
    			  var monitor2Data=$(this).attr("monitor2Data");
    			  var jkzbAjkdate=$(this).attr("jkzbAjkdate");
    			  var locoNo=$(this).attr("locoNo");
    			  var dName=$(this).attr("dName");
    			  var locoTypeid=$(this).attr("locoTypeid");
    			  var checiName=$(this).attr("checiName");
    			  var kehuo=$(this).attr("kehuo");
    			  var deptId=$(this).attr("deptId");
    			  var isOnline=$(this).attr("isOnline");
    			  var locoAb=$(this).attr("locoAb");
	 			   var locoab="";
    	 			  if (locoAb==0) {
    	           		 locoab="";
    		          }else if (locoAb==1) {//A
    		              locoab=window.locoAb_A;
    	              }else{
    	            	  locoab=window.locoAb_B;
    	              }
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  
				  var locoTypeDiv=$("#content-lkjequipmenthistory-tuzhongHoverDiv");
				  $("#tuzhongHoverDiv-tab-loco",$(locoTypeDiv)).text(tTypeShortname+"-"+locoNo+locoab);
				  $("#tuzhongHoverDiv-tab-date",$(locoTypeDiv)).text(date);
				  $("#tuzhongHoverDiv-tab-time",$(locoTypeDiv)).text(time);
				  $("#tuzhongHoverDiv-tab-jkzbA",$(locoTypeDiv)).text(jkzbA);
				  $("#tuzhongHoverDiv-tab-jkzbAData",$(locoTypeDiv)).text(jkzbAData);
				  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).text(monitor1);
				  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).text(monitor2);
				  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).text(monitor1Data);
				  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).text(monitor2Data);
				  $("#tuzhongHoverDiv-tab-jkzbAjkdate",$(locoTypeDiv)).text(jkzbAjkdate);
				  
				  if(monitor1 != monitor2){
					  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor1-label",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor2-label",$(locoTypeDiv)).css({"color":"red"});
				  }else{
					  $("#tuzhongHoverDiv-tab-monitor1",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor1-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor2",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor2-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
				  }
				  
				  if(monitor1Data != monitor2Data){
					  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor1Data-label",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).css({"color":"red"});
					  $("#tuzhongHoverDiv-tab-monitor2Data-label",$(locoTypeDiv)).css({"color":"red"});
				  }else{
					  $("#tuzhongHoverDiv-tab-monitor1Data",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor1Data-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor2Data",$(locoTypeDiv)).css({"color":"#7d7d7d"});
					  $("#tuzhongHoverDiv-tab-monitor2Data-label",$(locoTypeDiv)).css({"color":"#7d7d7d"});
				  }
				  
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth ;
		          var height1 = document.documentElement.clientHeight;

				  if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-40-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX-40)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-60-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-60)+"px"});
				  }
				  
				  $(locoTypeDiv).removeClass("hidden");
    			
    		}).mousemove(function(e){
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var locoTypeDiv=$("#content-lkjequipmenthistory-tuzhongHoverDiv");
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth ;
		          var height1 = document.documentElement.clientHeight;

		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-40-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX-90)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-60-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-60)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
    		}).mouseout(function(e){
    			$(this).removeClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    			$("#content-lkjequipmenthistory-tuzhongHoverDiv").addClass("hidden");
    		}).mousedown(function(e){
    			 if (3 == e.which) {
      				 var that=this;
      				 var clientX=e.clientX;
      				 var clientY=e.clientY;
      				 var rightDiv=$("#content-lkjequipmenthistory-rightClickDiv");
      				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth*0.9  ;
	   		         var height1 = document.documentElement.clientHeight*0.85;
	   		          
	   		         if((clientX+width)>width1){
	   					  $(rightDiv).css({"left":(clientX-50-width)+"px"});
	   				 }else{
	   					$(rightDiv).css({"left":(clientX-100)+"px"});
	   				 }
	   				 if((clientY+height)>height1){
	   				  $(rightDiv).css({"top":(clientY-60-height)+"px"});
	   				 }else{
	   				  $(rightDiv).css({"top":(clientY-60)+"px"});
	   				 }
	   				 $(rightDiv).removeClass("hidden");
	   				 
	   				 $("tr td",$(".content-lkjequipmenthistory-rightClickDiv-tab")).unbind("click").click(function(){
	   					 var id=$(this).attr("id");
	   					 var tTypeShortname=$(that).attr("tTypeShortname");
	   					 var locoNo=$(that).attr("locoNo");
	   					 var locoAb=$(that).attr("locoAb");
	   					 var locoCheci=$(that).attr("checiName");
	   					 var locoTypeid=$(that).attr("locoTypeid");
	   					 var speed=$(that).attr("speed");
	   					 var depotname=$(that).attr("dName");
                         var kehuo=$(that).attr("kehuo");
                         var date=$(that).attr("date");
                         var time=$(that).attr("time");
                         var lkjType=$(that).attr("lkjType");
	   					 if(id=="menu1"){
	   						 var loco=tTypeShortname+"-"+locoNo;
	   						RTU.invoke("map.marker.findMarkersContainsNotExist", {
	                             pointId: loco,
	                             isSetCenter: true,
	                             stopTime: 5000,
	                             locoAb:locoAb,
	                             locoTypeid:locoTypeid,
	                             locoNo:locoNo,
	                             lkjType:lkjType,
	                             fnCallBack: function () {
	                             }
	                         });
	                         var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
	                         var btn = $(".amplifyWin", delbtn.parent());
	                         btn.click();
	                         $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu2"){
	   						 var sendData={
	                                 "id": "11111",
	                                 "name": locoCheci + "(" + tTypeShortname+"-"+locoNo + ")",
	                                  data: {
	                                      locoTypeid:locoTypeid,
	                                      locoNO:locoNo,
	                                      checiName:locoCheci,
	                                      locoTypeName:tTypeShortname,
	                                      locoAb:locoAb,
	                                      lkjType:lkjType
	                                  }
	                         };
	                          var arr=[];
	                          arr[0]=sendData;
	                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
	                          $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu3"){
                            var sendData={
                                locoTypeid:locoTypeid,
                                locoNo:locoNo,
                                locoAb:locoAb,
                                locoTypename:tTypeShortname,
                                kehuo:kehuo,
                                date:date+" "+time
                            };
                            if(lkjType!=1)
    	   						RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                                else 
                                	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
	   					 }else if(id=="menu4"){
	   						var datas=[];
	   						 var checiName = locoCheci;
                             var locoTypeName = tTypeShortname;
                             var locoNO = locoNo;
                             var depotName =depotname;
                             datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
                             if(lkjType!=1)
                            	 RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                             else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
                             $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu5"){
	   					    var data = {
                                  "locotypeid": locoTypeid,
                                  "locono": locoNo,
                                  "locoTypeName": tTypeShortname,
                                  "locoAb": locoAb,
                                  "speed":speed
                              };
                              if(lkjType!=1)
                            	  RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
                              else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                              $(rightDiv).addClass("hidden");
	   					 }
	   				 });
	   				 
	   				 $("body").click(function(){
	   					$("#content-lkjequipmenthistory-rightClickDiv").addClass("hidden");
	   				 });
      				 
      			 }
    		});*/
    		
    		$("#searchLocoBtnType").unbind("click").click(function(){
    			var loco=$("#searchLocoInputType").val();
                var count =loco.indexOf("-");   //统计“-”
                var isAB=null;

	            var imgBtn=$(".content-lkjequipmenthistory-middle-c-sub-title-img",$(".content-lkjequipmenthistory-middleDiv"));
	            imgBtn.each(function() {
	                var imgBtnParent=$(this).parent().parent();
	                var chidren=$(imgBtnParent).children();
	                var content=$(".content-lkjequipmenthistory-middle-c-sub-c",$(imgBtnParent));
	                if(!$(content).hasClass("hidden")){
	                   $(this).click();
	                }
	            });

                if(count>0){  //机车简称-机车号  (DF11-0005)
                	 var locoArr=loco.split("-");
                     var locoTypeName=locoArr[0].toLocaleUpperCase();//机车简称
                     loco=loco.toLocaleUpperCase(); //转换大写
                     isAB=loco.substring(loco.length-1);//判断最后一个字符（是否有AB节）
                	if(!isNaN(isAB)){   //AB节=0   isNaN()的意思是非数字    
                		 $("div[ttypeshortname='"+locoTypeName+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
                           var tTypeShortname=$(this).attr("tTypeShortname");
                           var locono=$(this).attr("locono");
                           var locoab=$(this).attr("locoab");
                           var alt=$(this).attr("alt");
       
                           if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                               var str=tTypeShortname+"-"+locono;
                               if(str==loco){
                            	   if(alt=='1'){
                                     var parent=$(this).parent().parent().parent().parent();
                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
       
                                   }else if(alt=='2'){
                                     var parent1=$(this).parent().parent().parent().parent().parent();
                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                   }
                                   return false;
                               }
                           }
                       });
                	}else if (isAB =="A"){
                		
                		$("div[ttypeshortname='"+locoTypeName+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
                            var tTypeShortname=$(this).attr("tTypeShortname");
                            var locono=$(this).attr("locono");
                            var locoab=$(this).attr("locoab");
                            var alt=$(this).attr("alt");
        
                            if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                            	var str=tTypeShortname+"-"+locono+"A";
                                if(str==loco && locoab==1){
                                	 if(alt=='1'){
	                                     var parent=$(this).parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	       
                                   	}else if(alt=='2'){
	                                     var parent1=$(this).parent().parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                   }
                                    return false;
                                }
                            }
                        });
                	}else if(isAB =="B"){
                		$("div[ttypeshortname='"+locoTypeName+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
                            var tTypeShortname=$(this).attr("tTypeShortname");
                            var locono=$(this).attr("locono");
                            var locoab=$(this).attr("locoab");
                            var alt=$(this).attr("alt");

                            if(tTypeShortname&&tTypeShortname!=null&&locono&&locono!=null){
                            	var str=tTypeShortname+"-"+locono+"B";
                                if(str==loco && locoab==2){
                                	 if(alt=='1'){
                                         var parent=$(this).parent().parent().parent().parent();
                                         $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
                                         $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
           
                                       }else if(alt=='2'){
                                         var parent1=$(this).parent().parent().parent().parent().parent();
                                         $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
                                         var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                                         $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
                                         $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
                                       }
                                    return false;
                                }
                                /*else if(str==loco && locoab==3){
	                               	 if(alt=='1'){
	                                     var parent=$(this).parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	       
	                                   }else if(alt=='2'){
	                                     var parent1=$(this).parent().parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	                                   }
	                                return false;
                                }*/
                            }
                        });
                	}
                	
                }else{  //机车号AB节   0005A或者0005a
                	var locoNo=null;
                	isAB=loco.substring(loco.length-1,loco.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节）
                	if(!isNaN(isAB)){  //只有机车号、AB节为0
                		locoNo =loco.substring(0,loco.length); // 机车号
	            		$("div[locono='"+locoNo+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
	                        var locono=$(this).attr("locono");
	                        var locoab=$(this).attr("locoab");
	                        var alt=$(this).attr("alt");
	
	                        if(locono&&locono!=null&&locoab&&locoab!=null){
	                        	var str=locono;
	                            if(str==loco){
	                            	 if(alt=='1'){
	                                     var parent=$(this).parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	       
	                                   }else if(alt=='2'){
	                                     var parent1=$(this).parent().parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	                                   }
	                                return false;
	                            }
	                        }
	                    });
                	}else{   //机车号AB节
                		locoNo =loco.substring(0,loco.length-1); // 机车号
                		if(isAB=="A"){  //
                			$("div[locono='"+locoNo+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
    	                        var locono=$(this).attr("locono");
    	                        var locoab=$(this).attr("locoab");
    	                        var alt=$(this).attr("alt");
    	                        if(locono&&locono!=null&&locoab&&locoab!=null){
    	                        	var str=locono;
    	                            if(str==locoNo && locoab==1){
    	                            	 if(alt=='1'){
    	                                     var parent=$(this).parent().parent().parent().parent();
    	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
    	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    	       
    	                                   }else if(alt=='2'){
    	                                     var parent1=$(this).parent().parent().parent().parent().parent();
    	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
    	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
    	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
    	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    	                                   }
    	                                return false;
    	                            }
    	                        }
    	                    });
                    	}else if(isAB=="B"){  //
                    		$("div[locono='"+locoNo+"']",$(".content-lkjequipmenthistory-middleDiv")).each(function() {
    	                        var locono=$(this).attr("locono");
    	                        var locoab=$(this).attr("locoab");
    	                        var alt=$(this).attr("alt");
    	                        if(locono&&locono!=null&&locoab&&locoab!=null){
    	                        	var str=locono;
    	                            if(str==locoNo && locoab==2){
    	                            	 if(alt=='1'){
    	                                     var parent=$(this).parent().parent().parent().parent();
    	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
    	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    	       
    	                                   }else if(alt=='2'){
    	                                     var parent1=$(this).parent().parent().parent().parent().parent();
    	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
    	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
    	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
    	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
    	                                   }
    	                                return false;
    	                            }
    	                            /*else if(str==loco && locoab==3){
	                               	 if(alt=='1'){
	                                     var parent=$(this).parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	       
	                                   }else if(alt=='2'){
	                                     var parent1=$(this).parent().parent().parent().parent().parent();
	                                     $(".content-lkjequipmenthistory-middle-c-sub-title-img",$(parent1)).click();
	                                     var parent2=$(".content-lkjequipmenthistory-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	                                     $("div[ttypeshortname='"+tTypeShortname+"']",$(parent2)).click();
	                                     $(this).addClass("content-lkjequipmenthistory-middle-c-sub-c-table-td-bg");
	                                   }
	                                return false;
                                }*/
    	                        }
    	                    });
                    	}
                	}
                }
                
		   });
            
            $(".content-lkj-locospread-checkbox").unbind("click").click(function(){
            	var version=$(this).val();
            	var parent=$(this).parent().parent().parent().parent().parent();
     
            	var flag="checked";
            	if($(this).attr("checked")=="checked"){
            		flag="checked";
            	}else{
            		flag="unchecked";
            	}
            	if(version=="其它"){
        			var name=$(this).attr("name");
        			var checkbox=$("input[name='"+name+"']");
        			var checkboxArr="";
        			$(checkbox).each(function(){
        				if($(this).val()!="其它"){
        					checkboxArr=checkboxArr+$(this).val()+",";
        				}
        			});
        			
        			$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-checiname",$(parent)).each(function(){
            			if(checkboxArr.indexOf($(this).text())<0){
                			if(flag=="checked"){
                				$(this).parent().removeClass("hidden");
                			}else{
                				$(this).parent().addClass("hidden");
                			}
                		}
                		
                	});
        		}else{
        			$(".content-lkjequipmenthistory-middle-c-sub-c-tabDiv-Td-checiname",$(parent)).each(function(){
            			if($(this).text()==version){
                			if(flag=="checked"){
                				$(this).parent().removeClass("hidden");
                			}else{
                				$(this).parent().addClass("hidden");
                			}
                		}
                	});
        		}
            });
    	};
    });
    
    /**********************************
     * 第三个tab
     *********************************/   
    
    ///////主表加载数据
    RTU.register("app.lkjequipmentversionhistoryquery.query.initMgrid", function () {
        return function (optionM) {
        	var outDiv=$(".content-lkjequipmenthistory-endDiv");
//        	var width=$(outDiv).width()-20;
//        	var height=($(outDiv).height()-80)/2-10;
        	var Resolution=getResolution();
/*			var width=Resolution.Twidth-160;
			var height=(Resolution.Theight-210)/2;*/
			var width=Resolution.Twidth-10;
			var height=Resolution.Theight/2;
        	
            var g = new RTGrid({
                url: "../lkjInfo/searchinfoByProperty?deptShortname=" + optionM.deptShortname + "&typeShortname=" + optionM.typeShortname + "&locoNo=" + optionM.locoNo + "&locoAb=" + optionM.locoAb,
                containDivId: "LKJ-gridId",
                tableWidth: width,
                tableHeight: height,
                hasCheckBox: false, //是否有checkbox
                showTrNum: true, //是否显示行号
                isSort: true, //是否排序
                //isFirstTrSecect:true,
                colNames: ["机车型号", "机车号", "所属局段"],
                colModel: [{ name: "locoTypeName", isSort: true, width: "30%" }, { name: "locoNo", isSort: true, width: "30%" }, { name: "deptName", isSort: true, width: "30%"}],
                loadPageCp: function (t) {
                    t.cDiv.css({ "left": "210px", "top": "320px", width: t.cDiv.parent(".popuwnd-main").width() - 20 });

                },
                replaceTd: [{ index: 1, fn: function (data, j, ctd, itemData) {
                    if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                        return itemData.locoNo;
                    } else if (itemData.locoAb == "1") {
                        return itemData.locoNo + window.locoAb_A;
                    } else {
                        return itemData.locoNo + window.locoAb_B;
                    }
                }
                }],
                clickTrEvent: function (row) {
                    select = true;
                    locoTypeid1 = g.currClickItem().data.locoTypeid;
                    locoNo1 = g.currClickItem().data.locoNo;
                    locoAb1 = g.currClickItem().data.locoAb;
//                    alert(locoAb1)
                    var option = {
                        optionValue: radiolkjFlag == "" ? $("input[checked='checked']", $(".lkjmodel-container")).val() : radiolkjFlag,
                        locoTypeid: locoTypeid1,
                        locoNo: locoNo1,
                        locoAb: locoAb1,
                        beginTime: $(".lkjequipment_beginTime-input").val(),
                        endTime: $(".lkjequipment_endTime-input").val()
                    };
                    var locoNo = RTU.invoke("app.lkjequipmentversionhistoryquery.notShowData", option);
                }
            });
        }
    });
    
    ////设置表头显示/隐藏
    var strExit = "";
    RTU.register("app.lkjequipmentversionhistoryquery.notShowData", function () {
        var checkShow = function (option) {
            $.ajax({
                url: "../syssetting/findByProperty?options=" + option.optionValue + "&userid=" + RTU.data.user.id + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                    if (value && value.data) {
                        strExit = value.data.optionvalue;
                        var arrCol = [];
                        var arrName = [];
                        var array = [{ field: "recId", name: "记录ID", width: "80px" }, { field: "receiveTime", name: "记录处理时间", width: "130px" }
			    					, { field: "locoTypeid", name: "机车型号", width: "80px" }, { field: "locoNo", name: "机车号", width: "80px" }
								    , { field: "locoAb", name: "A/B节", width: "80px" }, { field: "locoIp", name: "机车ip", width: "80px" }
								    , { field: "deptId", name: "机车所属段", width: "100px" }, { field: "frameNo", name: "帧序号", width: "80px" }
								    , { field: "appType", name: "应用类型", width: "80px" }, { field: "transType", name: "传输通道类型", width: "120px" }
								    , { field: "proVer", name: "协议版本号", width: "100px" }, { field: "infoVer", name: "信息版本号", width: "100px" }
								    , { field: "infoFrameNo", name: "信息帧序号", width: "100px" }, { field: "lkjTime", name: "lkj主机时间", width: "130px" }
								    , { field: "deviceCorp", name: "厂家", width: "80px" }, { field: "hxz", name: "黑匣子版本信息", width: "140px" }
								    , { field: "monitor1", name: "一端显示器版本信息", width: "160px" }, { field: "monitor2", name: "二端显示器版本信息", width: "180px" }
								    , { field: "groundA", name: "地面处理A模块版本信息", width: "160px" }, { field: "groundB", name: "地面处理B模块版本信息", width: "160px" }
								    , { field: "txbA", name: "通信A模块版本信息", width: "160px" }, { field: "txbB", name: "通信B模块版本信息", width: "160px" }
								    , { field: "kztxbA", name: "扩展通信A版本信息", width: "160px" }, { field: "kztxbB", name: "扩展通信B版本信息", width: "160px" }
								    , { field: "gps", name: "GPS版本信息", width: "100px" }, { field: "jkzbA", name: "监控主板A版本信息", width: "2200px" }
								    , { field: "jkzbB", name: "监控主板B版本信息", width: "160px" }, { field: "jkzbAjkdate", name: "监控主板A监控生成日期", width: "160px" }
								    , { field: "jkzbBjkdate", name: "监控主板B监控生成日期", width: "160px" }, { field: "xtkzAbj", name: "系统控制A、B机", width: "160px" }
								    , { field: "xtkzZbj", name: "系统控制主、备机", width: "160px" }, { field: "xtkzYed", name: "系统控制一端、二端有权", width: "160px" }
								    , { field: "xtkzWqd", name: "系统控制无权端发声、静音", width: "160px" }, { field: "xtkzDsj", name: "系统控制单机、双机", width: "160px" }
								    , { field: "warningtype", name: "版本警示信息类型", width: "160px" }, { field: "warningid", name: "版本警示ID", width: "120px" }
								    , { field: "icflag", name: "IC卡卡控标志", width: "130px" }, { field: "wheel", name: "轮径", width: "80px" }
								    , { field: "jkzbAData", name: "监控主板A数据版本", width: "160px" }, { field: "jkzbBData", name: "监控主板B数据版本", width: "160px" }
								    , { field: "monitor1Data", name: "一端显示器数据版本", width: "160px" }, { field: "monitor2Data", name: "二端显示器数据版本", width: "160px" }
								    , { field: "bJ", name: "备机版本信息", width: "120px"}];


                        var showArr = [];
                        for (var i = 0, len = array.length; i < len; i++) {
                            if (strExit.indexOf(array[i]["field"]) != -1) {

                                showArr.push({ field: array[i]["field"], name: array[i]["name"] });
                            }
                        }
                        $.each(strExit.split(","), function (i, item) {
                            $.each(showArr, function (i, item1) {
                                if (item == item1.field) {
                                    var o1 = { name: item1.field, isSort: true, width: array[i]["width"] };
                                    arrCol.push(o1);
                                    arrName.push(item1.name);
                                }
                            });
                        });
                        
                        var outDiv=$(".content-lkjequipmenthistory-endDiv");
//                    	var width=$(outDiv).width()-20;
//                    	var height=($(outDiv).height()-80)/2-10;
                        var Resolution=getResolution();
/*            			var width=Resolution.Twidth-160;
            			var height=(Resolution.Theight-210)/2+10;*/
                        var width=Resolution.Twidth-10;
            			var height=Resolution.Theight;
            			
                    	var top=$("#LKJ-gridId").height()+320;
                        var o = { col: arrCol, name: arrName };
                        $("#LKJ-detail-gridId").html("");
                        var g1 = new RTGrid({
                            url: "../lkjverInfo/searchLkjverInfoByProperty?locoTypeid=" + option.locoTypeid + "&locoNo=" + option.locoNo + "&locoAb=0&beginTime=" + option.beginTime + "&endTime=" + option.endTime,
                            containDivId: "LKJ-detail-gridId",
                            tableWidth: width,
                            tableHeight: height,
                            hasCheckBox: false, //是否有checkbox
                            showTrNum: true, //是否显示行号
                            isSort: true, //是否排序
                            colNames: o.name, //arry=["姓名","性别"]
                            colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                            loadPageCp: function (t) {
                                t.cDiv.css({ "left": "210px", "top":top, width: t.cDiv.parent(".popuwnd-main").width() - 20 });
                            }
                        });
                    }
                }
            });
        };
        return function (option) {
            checkShow(option);
        };
    });
    
    RTU.register("app.lkjequipmentversionhistoryquery.query.init", function () {
        var data = RTU.invoke("app.setting.data", "lkjequipmentversionhistoryquery");
        if (data && data.isActive) {
            RTU.invoke("app.lkjequipmentversionhistoryquery.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.lkjequipmentversionhistoryquery.query.deactivate", function () {
        return function () {
            if (popuwnd_onlleft) {
                popuwnd_onlleft.hidden();
                RTU.invoke("header.msg.hidden");
            }
        };
    });
    
    RTU.register("app.lkjequipmentversionhistoryquerydup.query.activate",function(){
    	/*RTU.invoke("app.lkjequipmentversionhistoryquery.query.activate");*/
    	return function(){
    		RTU.invoke("app.lkjequipmentversionhistoryquery.query.activate");
    	};
    });
    RTU.register("app.lkjequipmentversionhistoryquerydup.query.deactivate",function(){
    	return function(){
    		RTU.invoke("app.lkjequipmentversionhistoryquery.query.deactivate");
    	}
    });
    
});
