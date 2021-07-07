RTU.DEFINE(function (require, exports) {
/**
 * 模块名：设备监测-实时事件分析-query
 * name： hzqkquery
 * date:2016-03-23
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../common/common.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
        
    var $html;
	var popuwnd;
	var popuwnd_confirm;
	var data;
	var hzqkQueryGrid;
    	
	RTU.register("app.hzqkquery.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/lkjequipmentversionhistoryquery/app-lkjequipmentversionhistory-query-hzqk.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
			}
		});
		return function() {
			return true;
		};
	});

	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};

	RTU.register("app.hzqkquery.query.activate", function() { //使得popuwnd对象活动
		return function() {
			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-135;
			Theight=Resolution.Theight-60;
			/*Twitdh=Resolution.Twidth*0.95;
			Theight=Resolution.Theight-60;*/
			if (!popuwnd) {
				popuwnd = new PopuWnd({
					title : data.alias,
					html : $html,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : true,
					removable:false,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd.remove = popuwnd.close;
				popuwnd.close = popuwnd.hidden;
				popuwnd.init();
			} else {
				popuwnd.init();
			}
			window.setTimeout(function(){
				RTU.invoke("core.router.get",{
					 url: "hzqkQuery/findAllTasks",
					 dataType:"jsonp",
	                 success: function (obj) {
	                        if (obj.success) {
	                        	$("#bureaPlanSel option[value!='']").remove();
	                        	$("#depotPlanSel option[value!='']").remove();
	                        	var list=obj.data;
	                        	if(list&&list.length>0){
	                        		for(var i=0;i<list.length;i++){
	                        			if($("#bureaPlanSel option[value='"+list[i].field+"']").length!=0)
	                        				continue;
	                        			$("#bureaPlanSel")
	                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
	                        		}
	                        	}
	                        	$("#depotPlanSel option").remove();
	        					RTU.invoke("core.router.get",{
	        						 url: "hzqkQuery/findPlansByTaskId?taskId="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():""),
	        						 dataType:"jsonp",
	        		                 success: function (obj) {
	        		                        if (obj.success) {
	        		                        	var list=obj.data;
	        		                        	if(list&&list.length>0){
	        		                        		$("#depotPlanSel").append("<option value=''></option>");
	        		                        		for(var i=0;i<list.length;i++){
	        		                        			if($("#depotPlanSel option[value='"+list[i].field+"']").length!=0)
	        		                        				continue;
	        		                        			$("#depotPlanSel")
	        		                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
	        		                        		}
	        		                        	}
	        		                        }
	        		                    },
	        		                    error: function (obj) {
	        		                    }
	        					});
	                        	RTU.invoke("app.hzqkquery.query.showData");
	                        	$("#bureaPlanSel").unbind("change").bind("change",function(){
	            					$("#depotPlanSel option").remove();
	            					$("#belongDepotSel").val("");
	            					$("#depotZpSel").val("");
	            					$("#hzqk_locoInput").val("");
	            					RTU.invoke("core.router.get",{
	            						 url: "hzqkQuery/findPlansByTaskId?taskId="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():""),
	            						 dataType:"jsonp",
	            		                 success: function (obj) {
	            		                        if (obj.success) {
	            		                        	var list=obj.data;
	            		                        	if(list&&list.length>0){
	            		                        		$("#depotPlanSel").append("<option value=''></option>");
	            		                        		for(var i=0;i<list.length;i++){
	            		                        			if($("#depotPlanSel option[value='"+list[i].field+"']").length!=0)
		        		                        				continue;
	            		                        			$("#depotPlanSel")
	            		                        			.append("<option value='"+list[i].field+"'>"+list[i].value+"</option>");
	            		                        		}
	            		                        	}
	            		                        	RTU.invoke("app.hzqkquery.query.showData");
	            		                        }
	            		                    },
	            		                    error: function (obj) {
	            		                    }
	            					});
	            				}); 
	                    		$("#depotPlanSel").unbind("change").bind("change",function(){
	                    			/*var requestUrl="electronicNew/findAllElectronrails?type=3";
	                                var param={
	                                      url: requestUrl,
	                                      cache: false,
	                                      datatype: "json",
	                                      success: function (data) {
	                                    	$("#belongDepotSel").val("");
	      	            					$("#depotZpSel").val("");
	      	            					$("#hzqk_locoInput").val("");
	                                   	   if(data&&data.data)
	                                          refreshFun(data.data);
	                                   	   else RTU.invoke("header.msg.hidden");
	                                      },
	                                      error: function () {
	                                      }
	                                    };
	                                   RTU.invoke("core.router.get", param);*/
	                    			$("#belongDepotSel").val("");
  	            					$("#depotZpSel").val("");
  	            					$("#hzqk_locoInput").val("");
	                    			RTU.invoke("app.hzqkquery.query.showData");
	            				}); 
	                        }
	                        
	                        $("#hzqk_queryBtn").unbind("click").bind("click",function(){
	                			/*RTU.invoke("app.hzqkquery.query.showDetails");*/
	                        	RTU.invoke("app.hzqkquery.query.showData");
	        				}); 
                   		$("#hzqk_excelBtn").unbind("click").click(function(){
                    			RTU.invoke("app.hzqkquery.query.exp",savadata);
                    		});
	                    },
	                    error: function (obj) {
	                    }
				});
			},10);
		};
	});
	RTU.register("app.hzqkquery.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});

	RTU.register("app.hzqkquery.query.init", function() {
		data = RTU.invoke("app.setting.data", "hzqkquery");
		if (data && data.isActive) {
			RTU.invoke("app.hzqkquery.query.activate");  
		}		
		return function() {
			return true;
		};
	});
	
	var hzqkDetailsGrid;
	var currentClickData;
	var savedata;
	

	RTU.register("app.hzqkquery.query.exp",function(){
		return function(data){
			if(data)
			{
				
				currentClickData=data;
			}
			else data=currentClickData;//说明是查询按钮,需将当前点击的上方表格的存储对象赋给data
			var url="";
			if(data[0].indexOf("电务段")!=-1){
				url="&depotName="+data[0];
			}
			else 
			url="&cj="+data[0];
			url+="&depotJw="+$("#belongDepotSel").val()+"&depotZp="+$("#depotZpSel").val()
			+"&locoName="+$("#hzqk_locoInput").val();
			var url1="";
			url1="../hzqkQuery/findHzqkExp?taskId="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():"")
			+($("#depotPlanSel").val()?("&changePlanId="+$("#depotPlanSel").val()):"")
			+url+(data[1]!=undefined?("&jchzFlag="+data[1]):"")+savacountdata;
		   // alert(url1);
			if(window.confirm("确认要导出到excel吗?")){
	     		window.location.href =url1;
	     	};               
		};
	});
	
	RTU.register("app.hzqkquery.query.showDetails",function(){
		return function(data){
			if(data)
			{
				
				currentClickData=data;
			}
			else data=currentClickData;//说明是查询按钮,需将当前点击的上方表格的存储对象赋给data
			savadata=data;
			$("#hzqkquery-bodyDiv-body-grid").empty().removeClass("containGridDiv");
			var width=$("#hzqkquery-bodyDiv-body-grid").width();
			var url="";
			if(data[0].indexOf("电务段")!=-1){
				url="&depotName="+data[0];
			}
			else 
				url="&cj="+data[0];
			url+="&depotJw="+$("#belongDepotSel").val()+"&depotZp="+$("#depotZpSel").val()
			+"&locoName="+$("#hzqk_locoInput").val();
			hzqkDetailsGrid = new RTGrid({
    			url:"../hzqkQuery/findHzqkViewByQuery?taskId="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():"")
    			+($("#depotPlanSel").val()?("&changePlanId="+$("#depotPlanSel").val()):"")
    			+url+(data[1]!=undefined?("&jchzFlag="+data[1]):""),
                containDivId: "hzqkquery-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#hzqkquery-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    			},
    			replaceTd:[
					{index: 1, fn: function (data,j,ctd,itemData) {
						return data+"/"+itemData.depotnameZp;
						
					}},
					{index: 9, fn: function (data,j,ctd,itemData) {
						return itemData.dwUsername&&itemData.jwUsername?"换装结束":data;
						
					}},
//					{index: 12, fn: function (data,j,ctd,itemData) {
//						return data+"/"+itemData.dwUsername;
//						
//					}},
					{index: 13, fn: function (data,j,ctd,itemData) {
						/*$(ctd).attr("jkzbA",itemData.jkzbA).attr("depotName",itemData.depotName);*/
						var tdStr="";
						if(itemData.jchzFlag==0)return "未换装无法确认";
						else if(!itemData.hzman||$.trim(itemData.hzman)=="")return "无作业人无法确认";
						else if(itemData.jchzFlag==-1)return"";
						else if(itemData.dwUsername&&itemData.jwUsername){
							tdStr+="<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
								+itemData.jchzRecid+"\",1,true])'>"+data+"</a>/"
								+"<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
								+itemData.jchzRecid+"\",0,true])'>"+itemData.dwUsername+"</a>";
						}
						else{
							 if(data){//有机务确认人,没有电务确认人
								 tdStr+="<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
										+itemData.jchzRecid+"\",1,true])'>"+data+"</a>/";
								 if(window.hasDwConfirmPerm){
									 tdStr+="<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
											+itemData.jchzRecid+"\",0])'>电务确认</a>";
								 }
							 }
							 else if(itemData.dwUsername){//有电务确认人,没有机务确认人
								 if(window.hasJwConfirmPerm){
									 tdStr+="&nbsp;<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
											+itemData.jchzRecid+"\",1])'>机务确认</a>";
								 }
								 tdStr+="/<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
										+itemData.jchzRecid+"\",0,true])'>"+itemData.dwUsername+"</a>";
							 }
							 else{//电务确认人和机务确认人都没有
								 if(!window.hasDwConfirmPerm&&!window.hasJwConfirmPerm){
									 return "无确认权限";
								 }
								 else{
									 if(window.hasJwConfirmPerm){
										 tdStr+="&nbsp;<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
												+itemData.jchzRecid+"\",1])'>机务确认</a>";
									 }
									 tdStr+="/";
									 if(window.hasDwConfirmPerm){
										 tdStr+="<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.jwdwConfirm\",[\""
												+itemData.jchzRecid+"\",0])'>电务确认</a>";
									 }
								 }
							 }
						}
						return tdStr;
					}}
				],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                    
                },
                colNames: ["机车","配属段/支配段","运用车间","运用状态", "最后上线时间", "实时位置","计划版本","实时版本","TSC比对时间","换装结果","换装时间","换装人","换装点","机/电确认"],
                colModel: [{ name: "locoName", isSort: true},{ name: "depotnameJw",width:width*0.1, isSort: true}, {name:"cj", isSort: true},{name:"locoStatename", isSort: true},{ name: "strLkjtime",width:width*0.1, isSort: true},{ name: "position",width:width*0.1, isSort: true}, { name: "planVersion", isSort: true}, 
                           { name: "currentVersion", isSort: true},{ name: "strJchzlaisdate",width:width*0.1, isSort: true},{ name: "jchzFlagname", isSort: true},{ name: "strJchzdate",width:width*0.1, isSort: true},
                           { name: "hzman",width:width*0.1, isSort: true}, { name: "jchzPot",width:width*0.1, isSort: true},{name:"jwUsername",width:width*0.1, isSort: true}
                           /*,{name:"detailOperTd",width:width*0.1}*/
                           ]
            });
			if(hzqkDetailsGrid.datas.length==0)
				$("#hzqkquery-bodyDiv-body-grid").empty().removeClass("containGridDiv");
			
			$(".RTTable-Body tbody tr","#hzqkquery-bodyDiv-body-grid").unbind("dblclick")
			.bind("dblclick",function(){
                if ($(".pointTab")) {
                    $(".pointTab").hide();
                }
                if (window.popuwndLocoInfo) {
                    window.popuwndLocoInfo.close();
                    window.popuwndLocoInfo=null;
                }
                RTU.invoke("map.marker.clearSelectPointCss");
                var obj = {};
                for(var i=0;i<window.trItem.allData.length;i++){
                	var trData=window.trItem.allData[i];
                	if($($(this).find("td")[1]).html()==trData.locoTypeStr
                			||$($(this).find("td")[1]).html()==(trData.locoTypeName+"-"+trData.locoNo)){
                		obj.itemData=trData;
                		break;
                	}
                }
                if(obj.itemData==undefined){
                	RTU.invoke("header.notice.show","无该机车版本查看权限");
                	return;
                }
               alert("未知");
                var $status;
                RTU.invoke("core.router.load", {
                    url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.html",
                    async: false,
                    success: function (status) {
                        $status = $(status);
                    }
                });
                
                window.popuwndLocoInfo = new PopuWnd({
//                    title: id + "-详情",
                	title: "",
                	html: $status.html(),
                    width: 380,
                    height: 405,
                    left: 515,
                    top: 60,
                    shadow: true
                });
                window.popuwndLocoInfo.init();
                window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
               	 window.popuwndLocoInfo=null;
                });
                obj.popuwndLocoInfo = window.popuwndLocoInfo;
                obj.isInterval="no";
                RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
                $(".version-tab-div",obj.popuwndLocoInfo.$wnd).click();
			});
			
		};
	});
	
	RTU.register("app.hzqkquery.query.jwdwConfirm",function(){
		return function(itemData){
			/*if(window.confirm("即将完成"+(data[0]==0?"电务确认":"机务确认")+",是否继续")){
				$.ajax({
			        url: "../hzqkQuery/jwdwConfirm",
			        dataType: "json",
			        data:{
			        	jchzRecid:data[0],
			        	userName:RTU.data.user.realName,
			        	jwDwFlag:data[1]
			        },
			        type: "POST",
			        success:function(obj){
	                       if (obj.success) {
	                    	   RTU.invoke("header.notice.show","确认成功!");
	                    	   RTU.invoke("app.hzqkquery.query.showDetails",currentClickData);
	                       }
	                       else{
	                    	   RTU.invoke("header.notice.show","更新失败!");
	                       }
			        }});
			}*/
			RTU.invoke("core.router.load",{
				url:"../app/modules/lkjequipmentversionhistoryquery/app-lkjequipmentversionhistory-query-hzqk-confirm.html",
				success:function(html){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					if(popuwnd_confirm){
						popuwnd_confirm.close();
						popuwnd_confirm=null;
					}

					var Resolution=getResolution();
					Twitdh=Resolution.Twidth-135;
					Theight=Resolution.Theight-60;
					popuwnd_confirm = new PopuWnd({
						title :"机务电务确认功能",
						html : $(html),
						width : 700,
						height : 500,
						left : (Twitdh-700)/2,
						top : (Theight-500)/2+60,
						shadow : true,
						removable:true,  //设置弹出窗口是否可拖动
						deletable:true	  //设置是否显示弹出窗口的关闭按钮
					});
					
					popuwnd_confirm.init();
				
					/*window.setTimeout(function(){},10);*/
					var currentClickTr=$("#hzqkquery-bodyDiv-body-grid .RTGrid_clickTr");
   					var index=parseInt($(currentClickTr.children("td")[0]).html())-1;
   					var currentClickTrData=hzqkDetailsGrid.datas[index];
   					$("#jwdwConfirm_depot").html(currentClickTrData.depotName);
   					$("#jwdwConfirm_hzPotInput").val(currentClickTrData.jchzPot);
   					$("#jwdwConfirm_cj").html((currentClickTrData.locoName.indexOf("CRH")==-1?
   							currentClickTrData.cj:"南昌西")+"车载车间");
   					$("#jwdwConfirm_loco").html(currentClickTrData.locoName);
   					if(currentClickTrData.currentVersion){
   						$("#jwdwConfirm_jkdata").html(currentClickTrData.jkzbData);
   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
   						$("#jwdwConfirm_jkdate").html(currentClickTrData.jkzbDate);
   						if(currentClickTrData.typeFlag==1){
	   						$("#jwdwConfirm_jkdata").html(currentClickTrData.currentVersion);
	   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
	   					}
	   					else if(currentClickTrData.typeFlag==2){
	   						$("#jwdwConfirm_jkzb").html(currentClickTrData.currentVersion);
	   					}
	   					else 
	   						$("#jwdwConfirm_jkdate").html(currentClickTrData.currentVersion);
   					}
   					else{
   						if(currentClickTrData.typeFlag==1){
	   						$("#jwdwConfirm_jkdata").html(currentClickTrData.planVersion);
	   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
	   					}
	   					else if(currentClickTrData.typeFlag==2){
	   						$("#jwdwConfirm_jkzb").html(currentClickTrData.planVersion);
	   					}
	   					else 
	   						$("#jwdwConfirm_jkdate").html(currentClickTrData.planVersion);
   					}
   					$("#jwdwConfirm_jchzDate").html(currentClickTrData.strJchzdate);
   					$("#jwdwConfirm_hzMan").html(currentClickTrData.hzman);
   					$("#jwdwConfirm_dwDate").val(currentClickTrData.strDwdate);
   					$("#jwdwConfirm_jwDate").val(currentClickTrData.strJwdate);
   					if(itemData[1]==0){
   						$("#jwdwConfirm_page").html("LKJ数据换装联控信息单电务联");
   						$("#jwdwConfirm_pageIndex").html("(第一联)");
   						//电务
   						$("#jwdwConfirm_jwUserInput").val(currentClickTrData.jwUsername)
   						.attr("readonly","readonly").css("color","gray");
   						if(itemData[2]){
   							//说明已经电务确认,只能查看
   							$("#jwdwConfirm_dwUserInput").val(currentClickTrData.dwUsername)
   							.attr("readonly","readonly").css("color","gray");;
   							$("#jwdwConfirmDiv input[type='text'],select").attr("disabled","disabled");
   							$("#jwdwconfirm_saveBtn").hide();
   						}
   						else{
   							$("#jwdwConfirm_dwUserInput").val(RTU.data.user.realName);
   							
   						}
   					}
   					else{
   						$("#jwdwConfirm_page").html("LKJ数据换装联控信息单机务联");
   						$("#jwdwConfirm_pageIndex").html("(第二联)");
   						$("#jwdwConfirm_dwUserInput").val(currentClickTrData.dwUsername)
   						.attr("readonly","readonly").css("color","gray");
   						if(itemData[2]){
   							//说明已经机务确认,只能查看
   							$("#jwdwConfirm_jwUserInput").val(currentClickTrData.jwUsername)
   							.attr("readonly","readonly").css("color","gray");;
   							$("#jwdwConfirmDiv input[type='text']").attr("disabled","disabled");
   							$("#jwdwconfirm_saveBtn").hide();
   						}
   						else{
   							$("#jwdwConfirm_jwUserInput").val(RTU.data.user.realName);
   							$("#jwdwConfirm_dwUserInput").attr("disabled","disabled");
   							
   						}
   					}
   					RTU.invoke("header.msg.hidden");
   					$("#jwdwconfirm_resetBtn").unbind("click").bind("click",function(){
   						popuwnd_confirm.close();
   					});
   					$("#jwdwconfirm_saveBtn").unbind("click").bind("click",function(){
   						if($.trim($("#jwdwConfirm_hzPotInput").val())==""){
   							RTU.invoke("header.notice.show","请输入换装地点");
   							return;
   						}
   						
   						if(itemData[1]==0){
   							if($("#jwdwConfirm_dwUserInput").val()==""){
	   							RTU.invoke("header.notice.show","请输入电务确认人");
	   							return;
	   						}
   						}
   						else{
   							if($("#jwdwConfirm_jwUserInput").val()==""){
	   							RTU.invoke("header.notice.show","请输入机务确认人");
	   							return;
	   						}
   						}
   						if($.trim($("#jwdwConfirm_hzMan").html())==""){
   							RTU.invoke("header.notice.show","电务作业人为空,无法确认");
   							return;
   						}
   						if(window.confirm("即将完成"+(itemData[1]==0?"电务确认":"机务确认")+",是否继续")){
   							$.ajax({
   						        url: "../hzqkQuery/jwdwConfirm",
   						        dataType: "json",
   						        data:{
   						        	jchzRecid:itemData[0],
   						        	userName:itemData[1]==0?$("#jwdwConfirm_dwUserInput").val()
   						        			:$("#jwdwConfirm_jwUserInput").val(),
   						        	jwDwFlag:itemData[1],
   						        	jchzPot:$("#hzPlaceSelRadio").attr("checked")?
   						        			$("#jwdwConfirm_hzPotSel").val():
   						        				$.trim($("#jwdwConfirm_hzPotInput").val())
   						        },
   						        type: "POST",
   						        success:function(obj){
   				                       if (obj.success) {
   				                    	   RTU.invoke("header.notice.show","确认成功!");
   				                    	   RTU.invoke("app.hzqkquery.query.showDetails",currentClickData);
   				                    	   RTU.invoke("app.hzqkquery.query.showData");
   				                    	   popuwnd_confirm.close();
   				                       }
   				                       else{
   				                    	   RTU.invoke("header.notice.show","更新数据库失败!");
   				                       }
   						        }});
   						}
   					});
					/*var requestUrl="electronicNew/findAllElectronrails?type=3";
		            var param={
		                   url: requestUrl,
		                   cache: false,
		                   asnyc: true,
		                   datatype: "json",
		                   success: function (data) {
		                	   $("#jwdwConfirm_hzPotSel option[value!='']").remove();
		                	   if(data&&data.data){
		                		   for(var i=0;i<data.data.length;i++){
		                			   $("#jwdwConfirm_hzPotSel")
		                			   .append("<option value='"+data.data[i].elecNo+"'"
		                					   +(currentClickTrData.jchzPot==data.data[i].elecName?"selected":"")+">"
		                					   +data.data[i].elecName+"</option>"); 
		                		   }
		                	   }
		                	   if($("#jwdwConfirm_hzPotSel").val()||!currentClickTrData.jchzPot){
		                		   //如果能匹配到值或者首次确认
		                		   $("#hzPlaceSelRadio").click();
		                	   }
		                	   else{
		                		   $("#hzPlaceInputRadio").click();
		                		   $("#jwdwConfirm_hzPotInput").val(currentClickTrData.jchzPot);
		                	   }
		                	
		   					$("#jwdwConfirm_depot").html(currentClickTrData.depotName);
		   					$("#jwdwConfirm_cj").html((currentClickTrData.locoName.indexOf("CRH")==-1?
		   							currentClickTrData.cj:"南昌西")+"车载车间");
		   					$("#jwdwConfirm_loco").html(currentClickTrData.locoName);
		   					if(currentClickTrData.currentVersion){
		   						$("#jwdwConfirm_jkdata").html(currentClickTrData.jkzbData);
		   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
		   						$("#jwdwConfirm_jkdate").html(currentClickTrData.jkzbDate);
		   						if(currentClickTrData.typeFlag==1){
			   						$("#jwdwConfirm_jkdata").html(currentClickTrData.currentVersion);
			   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
			   					}
			   					else if(currentClickTrData.typeFlag==2){
			   						$("#jwdwConfirm_jkzb").html(currentClickTrData.currentVersion);
			   					}
			   					else 
			   						$("#jwdwConfirm_jkdate").html(currentClickTrData.currentVersion);
		   					}
		   					else{
		   						if(currentClickTrData.typeFlag==1){
			   						$("#jwdwConfirm_jkdata").html(currentClickTrData.planVersion);
			   						$("#jwdwConfirm_jkzb").html(currentClickTrData.jkzbA);
			   					}
			   					else if(currentClickTrData.typeFlag==2){
			   						$("#jwdwConfirm_jkzb").html(currentClickTrData.planVersion);
			   					}
			   					else 
			   						$("#jwdwConfirm_jkdate").html(currentClickTrData.planVersion);
		   					}
		   					$("#jwdwConfirm_jchzDate").html(currentClickTrData.strJchzdate);
		   					$("#jwdwConfirm_hzMan").html(currentClickTrData.hzman);
		   					$("#jwdwConfirm_dwDate").val(currentClickTrData.strDwdate);
		   					$("#jwdwConfirm_jwDate").val(currentClickTrData.strJwdate);
		   					if(itemData[1]==0){
		   						$("#jwdwConfirm_page").html("LKJ数据换装联控信息单电务联");
		   						$("#jwdwConfirm_pageIndex").html("(第一联)");
		   						//电务
		   						$("#jwdwConfirm_jwUserInput").val(currentClickTrData.jwUsername)
		   						.attr("readonly","readonly").css("color","gray");
		   						if(itemData[2]){
		   							//说明已经电务确认,只能查看
		   							$("#jwdwConfirm_dwUserInput").val(currentClickTrData.dwUsername)
		   							.attr("readonly","readonly").css("color","gray");;
		   							$("#jwdwConfirmDiv input,select").attr("disabled","disabled");
		   							$("#jwdwconfirm_saveBtn").hide();
		   						}
		   						else{
		   							$("#jwdwConfirm_dwUserInput").val(RTU.data.user.realName);
		   							
		   						}
		   					}
		   					else{
		   						$("#jwdwConfirm_page").html("LKJ数据换装联控信息单机务联");
		   						$("#jwdwConfirm_pageIndex").html("(第二联)");
		   						$("#jwdwConfirm_dwUserInput").val(currentClickTrData.dwUsername)
		   						.attr("readonly","readonly").css("color","gray");
		   						if(itemData[2]){
		   							//说明已经机务确认,只能查看
		   							$("#jwdwConfirm_jwUserInput").val(currentClickTrData.jwUsername)
		   							.attr("readonly","readonly").css("color","gray");;
		   							$("#jwdwConfirmDiv input").attr("disabled","disabled");
		   							$("#jwdwconfirm_saveBtn").hide();
		   						}
		   						else{
		   							$("#jwdwConfirm_jwUserInput").val(RTU.data.user.realName);
		   							$("#jwdwConfirm_dwUserInput").attr("disabled","disabled");
		   							
		   						}
		   					}
		   					RTU.invoke("header.msg.hidden");
		   					$("#jwdwconfirm_resetBtn").unbind("click").bind("click",function(){
		   						popuwnd_confirm.close();
		   					});
		   					$("#jwdwconfirm_saveBtn").unbind("click").bind("click",function(){
		   						if($("#hzPlaceSelRadio").attr("checked")){
		   							if($("#jwdwConfirm_hzPotSel").val()==""){
			   							RTU.invoke("header.notice.show","请选择换装地点");
			   							return;
			   						}
		   						}
		   						else{
		   							if($.trim($("#jwdwConfirm_hzPotInput").val())==""){
			   							RTU.invoke("header.notice.show","请输入换装地点");
			   							return;
			   						}
		   						}
		   						
		   						if(itemData[1]==0){
		   							if($("#jwdwConfirm_dwUserInput").val()==""){
			   							RTU.invoke("header.notice.show","请输入电务确认人");
			   							return;
			   						}
		   						}
		   						else{
		   							if($("#jwdwConfirm_jwUserInput").val()==""){
			   							RTU.invoke("header.notice.show","请输入机务确认人");
			   							return;
			   						}
		   						}
		   						if($.trim($("#jwdwConfirm_hzMan").html())==""){
		   							RTU.invoke("header.notice.show","电务作业人为空,无法确认");
		   							return;
		   						}
		   						if(window.confirm("即将完成"+(itemData[1]==0?"电务确认":"机务确认")+",是否继续")){
		   							$.ajax({
		   						        url: "../hzqkQuery/jwdwConfirm",
		   						        dataType: "json",
		   						        data:{
		   						        	jchzRecid:itemData[0],
		   						        	userName:itemData[1]==0?$("#jwdwConfirm_dwUserInput").val()
		   						        			:$("#jwdwConfirm_jwUserInput").val(),
		   						        	jwDwFlag:itemData[1],
		   						        	jchzPot:$("#hzPlaceSelRadio").attr("checked")?
		   						        			$("#jwdwConfirm_hzPotSel").val():
		   						        				$.trim($("#jwdwConfirm_hzPotInput").val())
		   						        },
		   						        type: "POST",
		   						        success:function(obj){
		   				                       if (obj.success) {
		   				                    	   RTU.invoke("header.notice.show","确认成功!");
		   				                    	   RTU.invoke("app.hzqkquery.query.showDetails",currentClickData);
		   				                    	   RTU.invoke("app.hzqkquery.query.showData");
		   				                    	   popuwnd_confirm.close();
		   				                       }
		   				                       else{
		   				                    	   RTU.invoke("header.notice.show","更新数据库失败!");
		   				                       }
		   						        }});
		   						}
		   					});
		                   },
		                   error: function () {
		                   }
		            };
		            RTU.invoke("core.router.get", param);*/
				}
			});
		};
	});
   var savacountdata;	
	RTU.register("app.hzqkquery.query.showData",function(){
		var refreshFun=function(){
			$("#hzqkstatistic-bodyDiv-body-grid").empty().removeClass("containGridDiv");
			$("#hzqkquery-bodyDiv-body-grid").empty().removeClass("containGridDiv");
			savacountdata="&taskId1="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():"")
			+($("#depotPlanSel").val()?("&changePlanId1="+$("#depotPlanSel").val()):"");
			var width=$("#hzqkstatistic-bodyDiv-body-grid").width();
			hzqkQueryGrid = new RTGrid({
    			url:"../hzqkQuery/findHzStatisticsInfoById?taskId="+($("#bureaPlanSel").val()?$("#bureaPlanSel").val():"")
    			+($("#depotPlanSel").val()?("&changePlanId="+$("#depotPlanSel").val()):""),
                containDivId: "hzqkstatistic-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#hzqkstatistic-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: false,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				
    			},
    			replaceTd:[
    			    {index: 1, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\"])'>"+data+"</a>";
						
					}},
					{index: 2, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\"])'>"+data+"/0"+"</a>";
						
					}},
					{index: 3, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-1])'>"+data+"</a>"+"/"+
						 "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-3])'>"+itemData.superHzCount+"</a>";
					}},
					{index: 4, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",0])'>"+data+"</a>";//已换装点击
					}},
					{index: 5, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",4])'>"+data+"</a>";
					}},
					{index: 6, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",1])'>"+data+"</a>";
					}},
					/*,{index: 7, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",2])'>"+data+"</a>";
					}},
					{index: 8, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",3])'>"+data+"</a>";
					}},*/
					{index: 7, fn: function (data,j,ctd,itemData) {
						/*return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-2])'>"+itemData.jwDwConfirmCount
						+"("+data+"/"+itemData.dwConfirmCount+")</a>";*/
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-2])'>"+itemData.jwDwConfirmCount
						+"</a>(<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-4])'>"+(itemData.finishCount-data)+"</a>/<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-5])'>"+(itemData.finishCount-itemData.dwConfirmCount)+"</a>)";
					}}
					/*{index: 10, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showDetails\",[\""
						+itemData.unitName+"\",-3])'>"+data+"</a>";
					}}*/
					/*{index: 9, fn: function (data,j,ctd,itemData) {
						return "<a href='#' onclick='javascript:RTU.invoke(\"app.hzqkquery.query.showStatistics\",[\""
						+itemData.unitName+"\",0])'>近三日换装统计</a>";
					}}*/
				],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                    
                },
                /*colNames: ["部门", "计划总数", "计划数/临增数","已换装","未换装","lais销号","文件销号","手工销号","手持销号","机/电","机电"],
                colModel: [{ name: "unitName"}, 
                           { name: "totalCount"}, 
                           { name: "totalCount"},  { name: "finishCount"}, 
                           { name: "unFinishCount"},{ name: "laisCount"},{ name: "fileCount"},
                           { name: "manualCount"}, 
                           {name:"machineCount"},{name:"jwConfirmCount"},{name:"jwDwConfirmCount"},
                           {name:"operTd"}
                           ]*/
                colNames: ["部门", "计划总数", "计划数/临增数","已换装/超换装","未换装","实时比对(LMD)","文件比对","机电确认数(机未确认/电未确认)"],
                colModel: [{ name: "unitName"}, 
                           { name: "totalCount"}, 
                           { name: "totalCount"},  { name: "finishCount"}, 
                           { name: "unFinishCount"},{ name: "laisCount"},{ name: "fileCount"},
                           {name:"jwConfirmCount"}]
            });
    		
			var headTds = $("#hzqkstatistic-bodyDiv-body-grid .RTTable_Head tr").find("td");
			var headTr=$("<tr></tr>");
			for(var i=0;i<headTds.length;i++){
				if(i==5||i==6){
					
					headTr.append($("<td style='width:"+$(headTds[i]).css("width")+"'>"+$(headTds[i]).html()+"</td>"));
					/*if(i==5){
						$(headTds[i]).hide();
					}
					else{
						$(headTds[i]).attr("colspan","2").html("销号类型");
					}*/
					$(headTds[i]).hide();
					if(i==6)
					$("<td colspan='2'>销号类型</td>").insertAfter($(headTds[i]));
				}
				else{
					$(headTds[i]).attr("rowspan","2");
				}
			}
			
			$("#hzqkstatistic-bodyDiv-body-grid .RTTable_Head thead").append(headTr);
    		RTU.invoke("header.msg.hidden");
    		$("#hzqkQuery_div_bottom").css("margin-top",($("#hzqkstatistic-bodyDiv-body-grid").height()+50)+"px");
    		var trs=$("#hzqkstatistic-bodyDiv-body-grid .RTGrid_Bodydiv tbody tr");
    		if(currentClickData){
				RTU.invoke("app.hzqkquery.query.showDetails",currentClickData);
			}
    		else{
    			var flag=false;
        		for(var i=0;i<trs.length;i++){
        			var tds=$(trs[i]).children("td");
        			for(var j=1;j<tds.length-1;j++){

    					if(parseInt($(tds[j]).find("a").html())!=0){
        					$(tds[j]).find("a").click();
        					flag=true;
        					break;
        				}
    				
        				
        			}
        			if(flag)break;
        		}
    		}
    		
    		/*$(trs[0]).children("td[itemName='totalCount']").find("a").click();*/
    	};
    	
    	return function(data){
    		refreshFun();
    	};
	});
});
