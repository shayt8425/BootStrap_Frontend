RTU.DEFINE(function (require, exports) {
/**
 * 模块名：电子围栏--result
 * name：electronrail
 * date:2015-2-12
 * version:1.0 
 */
	
	require("app/home/app-map-track.js");
	require("../../../css/app/electronraildepot/app-electronraildepot-newDetail.css");
	require("app/home/app-map.js");
	require("app/home/app-map-pointControls.js");
	
	var electronPoint;
    var timerList;
    var points="";//画线坐标
    var electronPointArr=[];//保存画的所有点对象
    var electronPolygons=[];//保存画的多边形
    var bureauShortname;//局
    var locomotivesMain="electronraildepotPointMain";//主页面机务段显示
    var locomotives="eelectronraildepotPoint";//电子围栏里面机务段
    var floodControl="WfloodPoint";//防洪防汛
    var speedTimelimit="rlimitPoint";//限时限速
    //初始化弹出界面
	RTU.register("app.electronrail.details.init",function(){
		return function(data){
			if(data.isUpdate=="1"){
				$("#electronrail-detail-editDiv-tab-button2").attr("isUpdate","1");
			}else if(data.isUpdate=="2"){
				$("#electronrail-detail-editDiv-tab-button2").attr("isUpdate","2");
			}else{
				$("#electronrail-detail-editDiv-tab-button2").attr("isUpdate","3");
			}
			RTU.invoke("app.eelectronraildepotPoint.query.stationName", data);//机务段根据所属局显示对应的段信息
			RTU.invoke("app.electronrail.details.initBtn",data);//初始化按钮
			RTU.invoke("app.eelectronraildepot.button.clickIncident",data);
			RTU.invoke("app.electronrail.details.initData",data);//初始化数据
			RTU.invoke("app.electronrail.details.create",data);//初始化线路input
		};
	});
	//添加限速
	RTU.register("app.electronrail.query.rlimit.addMarker", function(){
		  var getParams = function(){
			  var data = {};
			  data.electronrailName = ($("#electronrail-detail-editDiv-tab-Name")).val();
			  data.limitSpeed = $("#electronrail-detail-editDiv-tab-limitSpeed").val();
			  data.beginKiloSign = $("#electronrail-detail-editDiv-tab-beginkiloSign").val();
			  data.endKiloSign = $("#electronrail-detail-editDiv-tab-endkiloSign").val();
			  
			  data.marginLeft = $("#electronrail-detail-editDiv-tab-marginLeft").val();
			  data.marginRight = $("#electronrail-detail-editDiv-tab-marginRight").val();
			  
			  data.lineNo = ($("#electronrail-detail-editDiv-tab-lineName").attr("lineno")||"");
			  data.lineName = ($("#electronrail-detail-editDiv-tab-lineName")).val();
			  if(data.lineName == ""){
				  data.lineNo == "";
			  }
			  data.beginTime = $("#electronrail-detail-editDiv-tab-beginTime").val();
			  data.endTime = $("#electronrail-detail-editDiv-tab-endTime").val();
			  data.upDown = $("input[name='electronrail-detail-editDiv-tab-upDown2']:checked").val();
			  
			  
			  return data;
		  };
		  return function(data){
			  var params = getParams();
			  params.Cx = data.Point.Cx;
			  params.Cy = data.Point.Cy;
			  if(params.limitSpeed == ""){
				  RTU.invoke("header.alarmMsg.show","请输入限速值");
				  return false;
			  }else if(params.beginKiloSign == ""){
				  RTU.invoke("header.alarmMsg.show","请输入开始里程");
				  return false;
			  }else if(params.endKiloSign == ""){
				  RTU.invoke("header.alarmMsg.show","请输入结束里程");
				  return false;
			  }
			  else if(params.marginLeft == ""){
				  RTU.invoke("header.alarmMsg.show","请输入左边距");
				  return false;
			  }
			  else if(params.marginRight == ""){
				  RTU.invoke("header.alarmMsg.show","请输入右边距");
				  return false;
			  }
			  else if(params.lineNo == ""){
				  RTU.invoke("header.alarmMsg.show","请输入线路");
				  return false;
			  }else if(params.beginTime == ""){
				  RTU.invoke("header.alarmMsg.show","请输入开始时间");
				  return false;
			  }else if(params.endTime == ""){
				  RTU.invoke("header.alarmMsg.show","请输入结束时间");
				  return false;
			  }
			  else{
				 var url="electronicNew/addElectronrailSpeed?lineNo="+params.lineNo+"&upDown="+
				 params.upDown+"&beginDate="+params.beginTime+"&endDate="+params.endTime
				 +"&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign
				 +"&limitSpeed="+params.limitSpeed+"&longitude="+params.Cx+"&latitude="+params.Cy
				 +"&points="+points+"&elecName="+params.electronrailName+"&editUser=bbb&bureauId=8&"
				 +"remark=没有备注栏";
					 var param = {
	                   url: url,
	                   cache: false,
	                   asnyc: true,
	                   datatype: "jsonp",
	                   success: function (data) {
	                	   var sendData = {
	                			   recId:data.data.id,
	                			   elecType:data.data.type,
	                			   isupdate:"3",
	                			   optionType:"add"
	                	   };
	                       RTU.invoke("app.electronrail.query.addMarker",sendData);
	                	   RTU.invoke("app.electronrail.query.clearTab2Add");
	                	   staticSaveData("ElectronicVersion", "1");
	                	   RTU.invoke("map.railWayElectronicfence", {});
	                	   RTU.invoke("header.msg.hidden");
	                	   RTU.invoke("map.marker.electronicRailClose");//关闭刚才画的电子围栏
	                	   var upele =electronPoint;
	                	   RTU.invoke("header.notice.show", "添加成功。。");
	                	   RTU.invoke("app.electronrail.query.initList");
	                	   setTimeout(function () {
	                		   if(upele){
	                			   RTU.invoke("map.marker.removeMarker",upele);
	                		   }
	                	   },1500);
	                   },
	                   error: function () {
	                	   RTU.invoke("header.msg.hidden");
	                   }
	                 };
	                RTU.invoke("core.router.get", param);
			  }
		  };
	  });
	
	//添加防洪防涝
	 RTU.register("app.electronrail.query.mflood.addMarker",function(){
		  var getParams = function(tabId){
			  var data={};
			  data.electronrailName=($("#"+tabId+" #electronrail-detail-editDiv-tab-Name")).val();
			  data.timeType=$("#"+tabId+" #electronrail-detail-editDiv-timeType").val();
			  data.beginKiloSign=$("#"+tabId+" #electronrail-detail-editDiv-tab-beginkiloSign").val();
			  data.endKiloSign=$("#"+tabId+" #electronrail-detail-editDiv-tab-endkiloSign").val();
			  data.marginLeft = $("#"+tabId+" #electronrail-detail-editDiv-tab-marginLeft").val();
			  data.marginRight = $("#"+tabId+" #electronrail-detail-editDiv-tab-marginRight").val();
			  data.lineNo=($("#"+tabId+" #electronrail-detail-editDiv-tab-lineName").attr("lineno")||"");
			  data.lineName=($("#"+tabId+" #electronrail-detail-editDiv-tab-lineName")).val();
			  if(data.lineName==""){
				  data.lineNo=="";
			  }
			  data.beginTime=$("#"+tabId+" #electronrail-detail-editDiv-tab-beginTime").val();
			  data.endTime=$("#"+tabId+" #electronrail-detail-editDiv-tab-endTime").val();
			  data.upDown=$("#"+tabId+" input[name='electronrail-detail-editDiv-tab-upDown2']:checked").val();
			  
			  return data;
		  };
		  return function(data){
			  var params=getParams(data.tabId);
			  params.Cx = data.Point.Cx;
			  params.Cy = data.Point.Cy;
			  if(params.beginKiloSign==""){
				  RTU.invoke("header.alarmMsg.show","请输入开始里程");
				  return false;
			  }else if(params.endKiloSign==""){
				  RTU.invoke("header.alarmMsg.show","请输入结束里程");
				  return false;
			  }else if(params.marginLeft == ""){
				  RTU.invoke("header.alarmMsg.show","请输入左边距");
				  return false;
			  }
			  else if(params.marginRight == ""){
				  RTU.invoke("header.alarmMsg.show","请输入右边距");
				  return false;
			  }
			  else if(params.lineNo==""){
				  RTU.invoke("header.alarmMsg.show","请输入线路");
				  return false;
			  }else if(params.beginTime==""){
				  RTU.invoke("header.alarmMsg.show","请输入开始时间");
				  return false;
			  }else if(params.endTime==""){
				  RTU.invoke("header.alarmMsg.show","请输入结束时间");
				  return false;
			  }else{
				 var url="electronicNew/addElectronrailFlood?lineNo="+params.lineNo+"&upDown="+params.upDown+"&beginDate="+params.beginTime+"&endDate="+params.endTime+"&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign+"&limitType="+params.timeType
				  +"&limitSpeed=&longitude="+params.Cx+"&latitude="+params.Cy+"&points="+points+"&elecName="+params.electronrailName+"&editUser=测试人&bureauId=08&remark=没有备注";
				  var param={
	                   url: url,
	                   cache: false,
	                   asnyc: true,
	                   datatype: "jsonp",
	                   success: function (data) {
	                	   var sendData={
	                			   recId:data.data.id,
	                			   elecType:data.data.type,
	                			   isupdate:"3",
	                			   optionType:"add"
	                	   };
	                	   RTU.invoke("app.electronrail.query.addMarker",sendData);
	                	   staticSaveData("ElectronicVersion", "1");
	                	   RTU.invoke("map.railWayElectronicfence", {});
	                	   RTU.invoke("map.marker.electronicRailClose");//关闭刚才画的电子围栏
	                	   var upele =electronPoint;
	                	   RTU.invoke("header.notice.show", "添加成功。。");
	                	   RTU.invoke("app.electronrail.query.initList");
	                	   setTimeout(function () {
	                		   if(upele){
	                			   RTU.invoke("map.marker.removeMarker",upele);
	                		   }
	                	   },1500);
	                   },
	                   error: function () {
	                   }
	                 };
	                RTU.invoke("core.router.get", param);
			  }
		  };
	  });
	 
	//添加机务段围栏
	 RTU.register("app.eelectronraildepot.query.maintenance.addMarker",function(){
		  var getParams = function(){
			  var data={};
			  data.stationName=$("#eelectronraildepotPoint-detail-editDiv-tab-stationName").val();
			  //data.elecNo=$("#eelectronraildepotPoint-detail-editDiv-tab-elecNo").val();
			  data.dotType =$("#selectElecType option:selected").val();
			  data.remark =document.getElementById("eelectronraildepotPoint-detail-editDiv-tab-remark").value;
			  data.b_id=$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName option:selected").attr('id');//获取选 中属性的值
			  data.cj=$("#eelectronraildepotPoint-detail-editDiv-tab-cjName").val();
			  return data;
		  };
		  return function(pointData){
			  var params=getParams();
			  params.Cx = pointData.Cx;
			  params.Cy = pointData.Cy;
			  if(params.stationName==""){
				  RTU.invoke("header.alarmMsg.show","请输入围栏名称");
				  return false;
			  }/*else if(params.elecNo==""){
				  RTU.invoke("header.alarmMsg.show","请输入围栏编号");
				  return false;
			  }
			  else if(isNaN(params.elecNo)){
				  RTU.invoke("header.alarmMsg.show","围栏编号必须为数字");
				  return false;
			  }*/
			  else if(params.b_id==""){
				  RTU.invoke("header.alarmMsg.show","请选择围栏所属局");
				  return false;
			  }
			  else if(params.dotType == ""||params.dotType=="请选择围栏类型"){
				  RTU.invoke("header.alarmMsg.show","请选择围栏类型");
				  return false;
			  }
			  else{
				  var url="electronicNew/addElectronrailDepot?depotId=1&pointType="+
				  params.dotType+"&longitude="+params.Cx+"&latitude="+params.Cy+"&points="
				  +points+"&elecName="+params.stationName+"&editUser="+top.loginSysData['data']['user']['userId']+"&bureauId="+params.b_id
				  +"&remark="+params.remark+/*"&elecNo="+params.elecNo+*/"&cj="+params.cj;
				  var param={
	                   url: url,
	                   cache: false,
	                   asnyc: true,
	                   datatype: "jsonp",
	                   success: function (data) {
	                	   var sendData={
	                			   recId:data.data.id,
	                			   isupdate:"3",
	                			   isShow:false,
	                			   type:"3",
	                			   elecType:data.data.type,
	                			   optionType:"add"
	                				   
	                	   };
	                	   RTU.invoke("app.electronrail.query.addMarker",sendData);
	                	   staticSaveData("ElectronicVersion", "1");
	                	   RTU.invoke("map.railWayElectronicfence", {});
	                	   RTU.invoke("map.marker.electronicRailClose");//关闭刚才画的电子围栏
	                	   var upele =electronPoint;
	                	   RTU.invoke("header.notice.show", "添加成功。。");
	                	   RTU.invoke("app.electronrail.query.initList");
	                	   setTimeout(function () {
	                		   if(upele){
	                			   RTU.invoke("map.marker.removeMarker",upele);
	                		   }
	                	   },1500);
	                   },
	                   error: function () {
	                   }
	                 };
	                RTU.invoke("core.router.get", param);
	                points="";
			  }
		  };
	  });
	
	//初始化按钮
	RTU.register("app.electronrail.details.initBtn",function(){
		return function(data){
			$("#"+data.tabId+" #electronrail-detail-editDiv-tab-button1").attr("tabId",data.tabId);
			$("#"+data.tabId+" #eelectronraildepotPoint-detail-editDiv-tab-button03").attr("tabId",data.tabId);
			
			
			//初始化修改按钮
			$("#"+data.tabId+" #electronrail-detail-showDiv-tab-button1").unbind("click").click(function(){
				$("#"+data.tabId+" .electronrail-detail-editDiv").removeClass("hidden");
				$("#"+data.tabId+" .electronrail-detail-showDiv").addClass("hidden");
				
			});
			if(data.isUpdate=="1"||data.isUpdate=="2"){//DIV 的显示或隐藏
				$("#"+data.tabId+" .electronrail-detail-editDiv").removeClass("hidden");
				$("#"+data.tabId+" .electronrail-detail-showDiv").addClass("hidden");
				
				//机务段
				$("#"+data.tabId+" .electronraildepotPoint-editOutDiv").removeClass("hidden");
				$("#"+data.tabId+" .electronraildepotPoint-showOutDiv").addClass("hidden");
				
//				$("#"+data.tabId+" #electronrail-detail-showDiv-tab-button1").click();
			}
			//初始化修改按钮
			$("#"+data.tabId+" #electronrail-detail-editDiv-tab-button1").unbind("click").click(function(){
				RTU.invoke("app.electronrail.details.updateDate",data);
			});
		
			//初始化取消按钮
			$("#"+data.tabId+" #electronrail-detail-editDiv-tab-button2").unbind("click").click(function(){
				
				var isUpdate=$(this).attr("isUpdate");
				if(isUpdate=="1"){
					$("#"+data.tabId+" .electronrail-detail-editDiv").addClass("hidden");
					$("#"+data.tabId+" .electronrail-detail-showDiv").removeClass("hidden");
				}else{
					RTU.invoke("map.marker.electronicRailClose");
				    if(electronPoint){
						RTU.invoke("map.marker.removeMarker",electronPoint);
					}
				}
				$(".pointTab").css("display","none");
			});
			//初始化保存按钮
			$("#"+data.tabId+" #electronrail-detail-editDiv-tab-button3").unbind("click").click(function(){
				var alt = $(this).attr("alt");
				if(alt == "1"){
					RTU.invoke("app.electronrail.query.rlimit.addMarker", data);
				}else if(alt=="2"){
					RTU.invoke("app.electronrail.query.mflood.addMarker", data);
				}
			});
		};
	});
	
	//初始化弹出界面数据
	RTU.register("app.electronrail.details.initData", function(){
		return function(obj){
			var data = obj.Point.obj.pointData;
			var tabId = obj.tabId;
			if(!bureauShortname)
			bureauShortname=RTU.invoke("app.electronrail.getfindByShortname");
			if(data){
				data=searchOne(data);//查询单个
				if(data.electronrail.elecType == 1){
					$("#" + tabId +" #electronrail-detail-showDiv-tab-limitSpeed").text(data.limitSpeed||"");
					$("#" + tabId +" #electronrail-detail-editDiv-tab-limitSpeed").val(data.limitSpeed||"");
				}else if(data.electronrail.elecType == 2){
					$("#" + tabId +" #electronrail-detail-showDiv-tab-timeType").text(data.limitTime==1?"临时":"永久"||"");
					$("#" + tabId +" #electronrail-detail-editDiv-timeType").val(data.limitTime);
				}else{//机务段围栏
					$(bureauShortname).each(function(i){
						if(bureauShortname[i].deptId==data.electronrail.bureauId){
							$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-bureauName").val(bureauShortname[i].deptId).attr("b_id",data.electronrail.bureauId);
							$("#" + tabId +" #eelectronraildepotPoint-detail-showDiv-tab-bureauName").text(bureauShortname[i].deptName);
						}
					});
					//邓国知20160712新加 车间
					$("#" + tabId +" #eelectronraildepotPoint-detail-editDiv-tab-cjName").val(data.cjName?data.cjName:"");
					//$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-elecNo").val(data.electronrail.elecNo);
					$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-stationName").val(data.electronrail.elecName);
					$("#" + tabId +" #eelectronraildepotPoint-detail-showDiv-tab-stationName").text(data.electronrail.elecName);
					$("#" + tabId +" .electronraildepotPoint-detail-title").attr("pointId",data.electronrail.recId);
					$("#" + tabId +" #eelectronraildepotPoint-detail-show-tab-remark").val(data.electronrail.remark);
					$("#" + tabId +" #eelectronraildepotPoint-detail-editDiv-tab-remark").val(data.electronrail.remark);
					
					$("#" + tabId +" option[name='elecType']").each(function(){
			            if($(this).val()==data.pointType){
			            	$(this).val(data.pointType);
			               $(this).attr("selected","selected");
			            }
			        });
					var type="其它";
					if(data.pointType==1){
						type="机务段";
					}else if(data.pointType==2){
						type="车站";
					}else if(data.pointType==3){
						type="换装点";
					}
					else if(data.pointType==5){
						type="检测点";
					}
					$("#" + tabId +" #eelectronraildepotPoint-detail-showDiv-tab-pointType").text(type);
				};
				
				$("#" + tabId +" #electronrail-detail-showDiv-tab-Name").text(data.electronrail.elecName);
				$("#" + tabId +" #electronrail-detail-showDiv-tab-lineName").text(data.lineNo).attr("lineNo",data.lineNo);;
				$("#" + tabId +" #electronrail-detail-showDiv-tab-beginkiloSign").text(data.beginKiloSign);
				$("#" + tabId +" #electronrail-detail-showDiv-tab-endkiloSign").text(data.endKiloSign);
				$("#" + tabId +" #electronrail-detail-showDiv-tab-beginTime").text(window.formatDate(data.beginDate));
				$("#" + tabId +" #electronrail-detail-showDiv-tab-endTime").text(window.formatDate(data.endDate));
				
				$("#" + tabId +" input[name='electronrail-detail-showDiv-tab-upDown1']").each(function(){
		            if($(this).val()==data.upDown){
		                $(this).attr("checked",true);
		            }
		        });
				
				$("#" + tabId +" #electronrail-detail-editDiv-tab-Name").val(data.electronrail.elecName);
				$("#" + tabId +" #electronrail-detail-editDiv-tab-lineName").val(data.lineNo).attr("lineNo",data.lineNo);;
				$("#" + tabId +" #electronrail-detail-editDiv-tab-beginkiloSign").val(data.beginKiloSign);
				$("#" + tabId +" #electronrail-detail-editDiv-tab-endkiloSign").val(data.endKiloSign);
				$("#" + tabId +" #electronrail-detail-editDiv-tab-marginLeft").val(data.marginLeft);
				$("#" + tabId +" #electronrail-detail-editDiv-tab-marginRight").val(data.marginRight);
				
				if(data.beginDate != undefined){
					$("#" + tabId +" #electronrail-detail-editDiv-tab-beginTime").val(window.formatDate(data.beginDate));
				}
				if(data.endDate != undefined){
					$("#" + tabId +" #electronrail-detail-editDiv-tab-endTime").val(window.formatDate(data.endDate));
				}
				
				$("#" + tabId +" input[name='electronrail-detail-editDiv-tab-upDown2']").each(function(){
					if($(this).val()==data.upDown){
						$(this).attr("checked",true);
					}
				});
			}else{//新建时显示用户所属局
				var bureauObj =RTU.invoke("app.eelectronraildepot.searchBureau",window.userData.mybureau);
				$("#" + tabId +" #eelectronraildepotPoint-detail-editDiv-tab-bureauName").attr("b_id",bureauObj.bId).val(bureauObj.bId);
			}
			
		};
	});
	/**
	 * 画电子围栏区域
	 */
	 RTU.register("app.electronrails.showElectronicRPolygon", function () {
		return function showElectronicRPolygon(data){
				if(data.points!=""){
					var p=data.points.split("|");
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
					var a =RTU.invoke("map.marker.electronicRPolygon",sendData);
					var obj={
							lat:data.latitude,
						    log:data.longitude,
						    data:a
						};
					electronPolygons.push(obj);//保存画的多边形
				}
			};
	 });
	 RTU.register("app.electronrail.clearElectronPolygons", function () {
		 return function(){
			  electronPolygons=[];
		 };
	 });
	 RTU.register("app.electronrail.clearElectronPointArr", function () {
		 return function(){
			 electronPointArr=[];
		 };
	 });
	
	//初始化线路input
	 RTU.register("app.electronrail.details.create", function () {
	        var initlineNameAuto = function () {//线路
	            lineNameExParams = {
	                lName: function () {
	                    return $('#electronrail-detail-editDiv-tab-lineName').val();
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
	            RTU.autocompleteBuilder($("#electronrail-detail-editDiv-tab-lineName"), "line/findByLName", lineNameExParams, lineNameParse);
	            if ($('#electronrail-detail-editDiv-tab-lineName').result)
	                $('#electronrail-detail-editDiv-tab-lineName').result(function (event, autodata, formatted) {
	                	var arr=formatted.split("-");
	                    $('#electronrail-detail-editDiv-tab-lineName').val(arr[0]);
	                    $('#electronrail-detail-editDiv-tab-lineName').attr("lineNo",arr[1]);
	                });
	        };
	       
	        var initlineNameAutoLocation = function () {//线路
	            lineNameExParams = {
	                lName: function () {
	                    return $('#electronrail-detail-editDiv-tab-lineName').val();
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
	            RTU.autocompleteBuilder($("#electronrail-detail-editDiv-tab-lineName"), "line/findByLName", lineNameExParams, lineNameParse);
	            if ($('#electronrail-detail-editDiv-tab-lineName').result)
	                $('#electronrail-detail-editDiv-tab-lineName').result(function (event, autodata, formatted) {
	                	var arr=formatted.split("-");
	                    $('#electronrail-detail-editDiv-tab-lineName').val(arr[0]);
	                    $('#electronrail-detail-editDiv-tab-lineName').attr("lineNo",arr[1]);
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
	                initlineNameAutoLocation();
	            }, 500);
	        };
	    });
	    
	 //得到输入框数据
	 function getParams(obj){
		 var tabId=obj.tabId;
		 var param={};
		 
		 param.electronrailName=($("#" + tabId +" #electronrail-detail-editDiv-tab-Name").val()||"");
		 param.lineNo=$("#" + tabId +" #electronrail-detail-editDiv-tab-lineName").attr("lineNo");
		 param.limitSpeed=($("#" + tabId +" #electronrail-detail-editDiv-tab-limitSpeed").val()||"");
		 param.beginKiloSign=$("#" + tabId +" #electronrail-detail-editDiv-tab-beginkiloSign").val();
		 param.endKiloSign=$("#" + tabId +" #electronrail-detail-editDiv-tab-endkiloSign").val();
		 param.beginDate=$("#" + tabId +" #electronrail-detail-editDiv-tab-beginTime").val();
		 param.endDate=$("#" + tabId +" #electronrail-detail-editDiv-tab-endTime").val();
		 $("#" + tabId +" input[name='electronrail-detail-editDiv-tab-upDown2']").each(function(){
			 if($(this).attr("checked")=="checked"){
				 param.upDown=$(this).val();
			 }
		 });
		
		 param.type=$("#" + tabId +" .electronrail-detail-title").attr("type");
		 param.limitTime=($("#" + tabId +" #electronrail-detail-editDiv-timeType").val()||"");
			
		  if(param.beginKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始里程");
			  return false;
		  }else if(param.endKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束里程");
			  return false;
		  }
		 else if(param.electronrailName == ""){
			  RTU.invoke("header.alarmMsg.show","请输入围栏名");
			  return false;
		  } 
		  else if(param.lineNo==""){
			  RTU.invoke("header.alarmMsg.show","请输入线路");
			  return false;
		  }else if(param.beginDate==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始时间");
			  return false;
		  }else if(param.endDate==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束时间");
			  return false;
		  }
		 
		 return param;
	 }
	 
	 //修改数据   防洪防汛  限时限速
	 RTU.register("app.electronrail.details.updateDate",function(){
		 return function(data){
			 var params = getParams(data);
			 if(params){
				 var url="";
				if(data.data.elecType=="1"){
					 url="electronicNew/updateElectronrailSpeed?parentRecId="+data.data.recId+"&lineNo="+params.lineNo+"&upDown="+params.upDown+"&beginDate="+params.beginDate+"&endDate="+params.endDate+"&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign+"&limitSpeed="+params.limitSpeed+"&longitude=&latitude=&points=&elecName="+params.electronrailName+"&editUser=bbb&bureauId=8&remark=没有备注栏";
				}else if(data.data.elecType=="2"){
					 url="electronicNew/updateElectronrailFlood?parentRecId="+data.data.recId+"&lineNo="+params.lineNo+"&upDown="+params.upDown+"&beginDate="+params.beginDate+"&endDate="+params.endDate+"&beginKiloSign="+params.beginKiloSign+"&endKiloSign="+params.endKiloSign+"&limitType="+params.limitTime
					  +"&limitSpeed=98&longitude=&latitude=&points=&elecName="+params.electronrailName+"&editUser=测试人&bureauId=08&remark=没有备注";
				}
				 var param = {
						 url: url,
						 cache: false,
						 asnyc: true,
						 datatype: "jsonp",
						 success: function (data) {
							 var sendData={
									 id:data.data,
									 isupdate:"3"
							 };
							 staticSaveData("ElectronicVersion", "1");
							 RTU.invoke("map.railWayElectronicfence", {});
							 RTU.invoke("app.electronrail.query.addMarker", sendData);
							 RTU.invoke("header.notice.show", "修改成功。。");
							 setTimeout(function(){
						 		RTU.invoke("app.electronrail.query.initList");
						 	 },2100);
						 },
						 error: function () {
						 }
				 };
				 RTU.invoke("core.router.get", param);
			 }
		 };
	 });
	 
	 
	//修改数据   机务段围栏
	 RTU.register("app.eelectronraildepot.details.updateDate",function(){
		 return function(data){
			 var getParams = function(tabId){
				  var data={};
				  data.id=$("#" + tabId +" .electronraildepotPoint-detail-title").attr("pointId");
				  data.stationName=($("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-stationName").val()||"");
				  //data.elecNo=($("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-elecNo").val()||"");
				  data.dotType =$("#"+tabId+" #selectElecType option:selected").val();
				  data.remark =$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-remark").val();
				  data.b_id=$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-bureauName option:selected").attr('id');//获取选 中属性的值
				  data.cj=$("#"+tabId+" #eelectronraildepotPoint-detail-editDiv-tab-cjName").val();
				  return data;
			  };
			 var params=getParams(data.tabId);
			  if(params.stationName==""){
				  RTU.invoke("header.alarmMsg.show","请输入站段围栏名称");
				  return false;
			  }/*else if(params.elecNo==""){
				  RTU.invoke("header.alarmMsg.show","请输入围栏编号");
				  return false;
			  }
			  else if(isNaN(params.elecNo)){
				  RTU.invoke("header.alarmMsg.show","围栏编号必须为数字");
				  return false;
			  }*/
			  else if(params.b_id==""){
				  RTU.invoke("header.alarmMsg.show","请输入围栏所属局");
				  return false;
			  }else if(params.dotType==""||params.dotType=="请选择围栏类型"){
				  RTU.invoke("header.alarmMsg.show","请选择围栏类型");
				  return false;
			  }
			  else{
				 var id="";
				  if(data.data){
					  id=data.data.recId;
				  }
				  if(!id){
					 id=data.Point.obj.pointData.recId;
				 }
				 var url="electronicNew/updateElectronrailDepot?parentRecId="
					 +id+"&depotId=1&pointType="+params.dotType+"&longitude=&latitude=&points="+
					 points+"&elecName="+params.stationName+"&editUser=bbb&bureauId="+
					 params.b_id+"&remark="+params.remark+/*"&elecNo="+params.elecNo+*/"&cj="+params.cj;
				 var param = {
						 url: url,
						 cache: false,
						 asnyc: true,
						 datatype: "jsonp",
						 success: function (data) {
							 var sendData={
									 id:data.data,
									 isupdate:"3",
									 type:"3"
							 };
							 staticSaveData("ElectronicVersion", "1");
							 RTU.invoke("map.railWayElectronicfence", {});
							 RTU.invoke("app.electronrail.query.addMarker", sendData);
							 RTU.invoke("header.notice.show", "修改成功。。");
							 RTU.invoke("map.marker.electronicRailClose");//关闭刚才画的电子围栏
							 setTimeout(function(){
								 RTU.invoke("app.electronrail.query.initList");
							 },2100);
						 },
						 error: function () {
						 }
				 };
				 RTU.invoke("core.router.get", param);
				 points="";
			}
		 };
	 });
	 
	 //查找某一个电子围栏数据
	  function searchOne(dataObj){
		  var searchData=null;
		  var url="../electronicNew/findOneElectronrail?parentRecId="+dataObj.recId+"&type="+dataObj.elecType;
		  $.ajax({
	          url: url,
	          type: "get",
	          async: false,
	          success: function (data) {
	              var data = $.parseJSON(data);
	              if (data.data) {
	            	  if(data.data){
	            		  searchData = jQuery.extend(true, {}, data.data);
	            	  }
	              };
	          }
	      });
		  return searchData;
	  }
	  //添加地图电子围栏，并添加新的标注    重新创建点
	  var $status;
	  var x="",y="";
	  RTU.register("app.electronrail.query.addMarkerPoint",function(){
		  return function(typeData){
			         points=typeData.points;//画线经纬度
			         var imgName="";
			         var w=30,h=30;
					 if(typeData.type == "1"){//区分点击弹出的界面
						 imgName=speedTimelimit;
						 w=30;h=30;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfenceNew/app-electrionicfence-detail.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }else if(typeData.type == "2"){
						 w=28;h=25;
						 imgName=floodControl;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfenceNew/app-electrionicfence-detail1.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }else{
						 imgName=locomotives;
						 w=30,h=30;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronraildepot/app-electronraildepot-newDetail.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }
					 var height=365;
					 var width=270;
					 if(typeData.type==3){
						 height=290;
						 width=290;
					 }
					 
					 x=typeData.point.Cx,y=typeData.point.Cy;
				 	 electronPoint = RTU.invoke("map.marker.addMarker", {
							 isSetCenter: true,
							 pointType:imgName,
							 TIPSID: "id",
							 iconWidth:w,
							 iconHeight:h,	 
				    		 iconLeft: -15, //点图标left
				    	     iconTop: -12, //点图标top
							 isDefaultRightTab: true,
							 setDataSeft: false,
							 tabHtml: $status.html(),
							 pointData: { longitude: typeData.point.Cx, latitude:typeData.point.Cy },
							 tabWidth:width,
							 tabHeight:height,
							 initFn: function (obj) {
								 var tab = $("#" + obj.tabId);
								 var cNum = 20;
					                if (obj.Point.DetaY == -7) {
					                    cNum = 4;
					                }
				                 var tp = -tab.height() - 20;
				                 var tml = -tab.width() / 2 + cNum-7;
				                 tab.css({ "margin-left": tml, "margin-top": tp });
				                  
				                 var Newobj = {
										 Point: electronPoint,
										 tabId: electronPoint.obj.tabId,
										 isUpdate: "2",
										 data:typeData.data,
										 rightButton:typeData.rightButton
								 }
				                 Newobj.Point.obj.pointData=typeData.data;
				                 RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude,top: 150, left: 190 });//当点击修改后重新定位中心点  
				                 RTU.invoke("app.electronrail.details.init", Newobj);
								 setTimeout(function(){
									 var objId= $("#" + obj.tabId);
									 $(".closediv", $(objId)).click(function () {
										// alert("cc");
					                    $(objId).hide();
					                    $(objId).remove();
									 });
								 },30);

				                 $(".td2" ,".electronrail-detail-editDiv-tab").removeClass("hidden");
					             $(".td1" ,".electronrail-detail-editDiv-tab").addClass("hidden");
					         	//新建
					         	if($("#elecTabRightDiv").attr("class").indexOf("border-top-click")!=-1){
					         		
					         		if(!typeData.data){
					         			$(".td3" ,".eelectronraildepotPoint-detail-editDiv-tab02").addClass("hidden");
					         			$(".td4" ,".eelectronraildepotPoint-detail-editDiv-tab02").removeClass("hidden");
					         		}
					         		
					         	}//查询
					         	 else if($("#elecTabLeftDiv").attr("class").indexOf("border-top-click")!=-1){
					         		if(typeData.rightButton){//右键进入
					         			$(".td3" ,".eelectronraildepotPoint-detail-editDiv-tab02").addClass("hidden");
						         		$(".td4" ,".eelectronraildepotPoint-detail-editDiv-tab02").removeClass("hidden");
					         		}else{//列表进入
					         			$(".td3" ,".eelectronraildepotPoint-detail-editDiv-tab02").removeClass("hidden");
					         			$(".td4" ,".eelectronraildepotPoint-detail-editDiv-tab02").addClass("hidden");
					         		}
					         	}
							 },
							 rightHand:function(obj){
		           }
				 		});
				 		setTimeout(function(){
				 			electronPoint.runClickEvent();
				 		},50);
		  };
	  });
	  
	 //清空地图上电子围栏标注，并添加新的标注     从列表页进入
	 var $status;
	  RTU.register("app.electronrail.query.addMarker",function(){
		  return function(data){
			if(data.isupdate=="3"){//判断是否是tab页按钮跳转进来，如果是，则直接触发使详情界面弹出
				if(!data.isShow){
					if(electronPoint){
						RTU.invoke("map.marker.removeMarker",electronPoint);
					}
				}
				 var imgName="";
				 var w=30,h=30;
				 var falg=false;
				 if(data.optionType&&data.optionType=="add"){
					data= searchOne(data);
					falg=true;
				 }
				 if(data.elecType&&!data.elecType){
					 	data.elecType=data.electronrail.elecType;
					}
				 if(data && data != null){
					 if(data.elecType == "1"){//区分点击弹出的界面
						 imgName=speedTimelimit;
						  w=30,h=30;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfenceNew/app-electrionicfence-detail.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }else if(data.elecType == "2"){
						 imgName=floodControl;
						  w=28,h=25;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfenceNew/app-electrionicfence-detail1.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }
					 else{
						 imgName=locomotives;
						 w=30,h=30;
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronraildepot/app-electronraildepot-newDetail.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }
					 var height=365;
					 var width=270;
					 if(data.elecType=="3"){
						 height=290;
						 width=290;
					 }
					 if(falg){
							data= data.electronrail;
						}
				 	   electronPoint= RTU.invoke("map.marker.addMarker", {
							 isSetCenter: true,
							 pointType:imgName,
							 TIPSID: "id",
				    		 iconWidth:w, //点的 宽度
		    				 iconHeight:h, //点的高度
				    		 iconLeft: -15, //点图标left
				    	     iconTop: -12, //点图标top
							 isDefaultRightTab: true,
							 setDataSeft: false,
							 tabHtml: $status.html(),
							 pointData: data,
							 tabWidth: width, //tab 宽度
							 tabHeight: height, //tab 的高度
							 initFn: function (obj) {
								 $(".modify").remove();
								 var tab = $("#" + obj.tabId);
								 var cNum = 20;
					                if (obj.Point.DetaY == -7) {
					                    cNum = 4;
					                }
				                 var tp = -tab.height() - 20;
				                 var tml = -tab.width() / 2 + cNum-7;
				                
				                 tab.css({ "margin-left": tml, "margin-top": tp });
								 RTU.invoke("app.electronrail.details.init",obj);
								 
								 setTimeout(function(){
									 var objId= $("#" + obj.tabId);
									 $(" .closediv", $(objId)).click(function () {
										//alert("ee");
					                    $(objId).hide();
					                    $(objId).remove();
									 });
								 },30);
								 
							 },
							 rightHand:function(obj){
								 $(".modify").remove();
								 for ( var int = 0; int < electronPointArr.length; int++) {
										if(obj.Point==electronPointArr[int]){
											electronPoint=electronPointArr[int];
										}
								 }
								 $(electronPoint.Icon).after("<div id='modify' class='modify' style='text-align:center'><ul>" +
								 		"<li><a href='#' class='modifyElec'>修改</a></li>" +
								 		"<li><a href='#' class='deleteElec'>删除</a></li>" +
								 		"</ul></div>");
								 $(".modifyElec").click(function(){
									 $(".modify").remove();
									 obj.pointData.isupdate = "1";
									 RTU.invoke("map.setCenter", { lng: obj.pointData.longitude, lat: obj.pointData.latitude,top: 150, left: 190 });
									 RTU.invoke("app.electronrail.query.addMarker",obj.pointData);
									 
								 });
								 $(".deleteElec").click(function(){
									 $(".modify").remove();
									 RTU.invoke("header.roleAlarmMsg.show","确定删除围栏名为："+obj.pointData.elecName+" 的围栏吗？-");
									 $("#roleAlarmSureBtn").click(function () {
					       	             $("#roleAlarmDiv").addClass("hidden");
										 var url="electronicNew/deleteElectronrail?parentRecId="+obj.pointData.recId+"&type="+obj.pointData.elecType;
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
					     	                	 setTimeout(function(){
					     				 			RTU.invoke("app.electronrail.query.initList");
					     				 		},2100);
					     	                   },
					     	                   error: function () {
					     	                   }
					     	                 };
					     	              RTU.invoke("core.router.get", param);
								   });
									$("#roleAlarmCanelBtn").click(function () {
						   	                $("#roleAlarmDiv").addClass("hidden");
						   	                return false;
					   	            }); 
								 });
							 }
				 		});
				 	   if(data.isShow){
				 		  electronPointArr.push(electronPoint);
				 	   }
				 		setTimeout(function(){
				 			//electronPoint.runClickEvent();
				 		},50);
					 }
				 //显示围栏名
				 if(data.elecName&&electronPoint){
					if(!data.check)
					 $(electronPoint.Icon).after('<div  class="TIPShowName" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+(-3)+'px;left:'+(25)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + data.elecName + '</div>');
				 }
				 
			}else{
				 var tabDiv = $("#" + electronPoint.obj.tabId);
				 var targetImg = $(electronPoint.Icon);
				 if (tabDiv.length == 0) {
                     targetImg.after(electronPoint.customHtml);
                     tabDiv = $("#" + electronPoint.obj.tabId, targetImg.parent());
                 }
				 if (tabDiv.css("display") != "block") {
					 $(".pointTab:not([id=='" + electronPoint.obj.tabId + "'])").hide();
					 tabDiv.show();
					 electronPoint.isShowTab = true;
					 tabDiv.parent().css("z-index", 99);
				 }
				 var cNum = 20;
                 var tp = -tabDiv.height() - 20;
                 var tml = -tabDiv.width() / 2 + cNum-7;
                 tabDiv.css({ "margin-left": tml, "margin-top": tp });
				 var obj={
						 Point: electronPoint,
						 tabId: electronPoint.obj.tabId,
						 isUpdate: "1",
						 data:data
				 }
				 setTimeout(function(){
					 var objId= $("#" + electronPoint.obj.tabId);
					 $(" .closediv", $(objId)).unbind("click").click(function () {
						 //alert("dd");
						 if($("#"+electronPoint.obj.tabId+" .electronrail-detail-showDiv").hasClass("hidden")){
							 $("#"+electronPoint.obj.tabId+" .electronrail-detail-editDiv").addClass("hidden");
							 $("#"+electronPoint.obj.tabId+" .electronrail-detail-showDiv").removeClass("hidden");
							 $(objId).hide();
						 }else{
							 $(objId).hide();
						 }
						 $(objId).remove();
		             });
				 },30);
				 
				 //if(data.elecType!=3)
				 RTU.invoke("map.setCenter", { lng: data.longitude, lat: data.latitude,top: 150, left: 190  });//当点击修改后重新定位中心点
				
				 RTU.invoke("app.electronrail.details.init",obj);
			}
		  };
	  });
	  
	  //添加定位点图标
	  RTU.register("app.electronrail.query.addMarkerLocatin", function(){
		  return function(data){
			  if(electronPoint){
				  RTU.invoke("map.marker.removeMarker",electronPoint);
			  }
			  var lng=0;
			  var lat=0;
			  if(data.lng&&data.lat){
				  lng=data.lng;
				  lat =data.lat;
			  }else{
				 lat=data.latitude;
				 lng=data.longitude;
			  }
			  var imgName="";
			  var w=44,h=44; //点的 宽度
			  if(data.type){
				  if(data.type=="1"){
					  w=30;h=30;imgName=speedTimelimit;
				  }else if(data.type=="2"){
					  w=28;h=25;imgName=floodControl;
				  }else if(data.type=="3"||data.type=="add"||data.type=="anewDraw"){
					  w=30;h=30;imgName=locomotives;
				  }
			  }else if(data.elecType=="3"){
				      w=30;h=30;imgName=locomotivesMain;//特殊点围栏图片 标记
			  }else{
				  imgName="crossing";//定位点图
			  }
			  var iconLeft =-23;
			  var iconTop=-21;
			  if(data.token){
				  iconLeft=-15;
				  iconTop=-12;
			  }
			  $status = $("<div></div>");
			  electronPoint = RTU.invoke("map.marker.addMarker", {
					 isSetCenter: true,
					 pointType:imgName,
					 TIPSID: "id",
					 iconWidth:w, //点的 宽度
				     iconHeight:h, //点的高度
				     iconLeft: iconLeft, //点图标left
		    	     iconTop: iconTop, //点图标top
					 isDefaultRightTab: true,
					 setDataSeft: false,
					 tabHtml: $status.html(),
					 pointData: { longitude:lng, latitude:lat },
					 tabWidth: 70, //tab 宽度
					 tabHeight: 60, //tab 的高度
					 initFn: function (obj) {
					 },
					 rightHand:function(obj){
						 
					 }
		 		});
			  if(data.elecName)
			  $(electronPoint.Icon).after('<div  class="TIPShowName" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+(-3)+'px;left:'+(19)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + data.elecName + '</div>');
			  if(data.isShow){
		 		  electronPointArr.push(electronPoint);
		 	   } 
			  return electronPoint;
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
	//机务段按钮事件
	  RTU.register("app.eelectronraildepot.button.clickIncident",function(){
		  
		  return function(data){
			  
			  if(data.Point.Cx)x=data.Point.Cx;
			  if(data.Point.Cy)y=data.Point.Cy;
			  
			  $("#"+data.tabId+" #eelectronraildepotPoint-detail-editDiv-tab-button01").unbind("click").click(function(){//编辑
				  $(".pointTab").css("display","none");
				  data.type=3;
				  edit(data);
			  });
			  $("#"+data.tabId+" #eelectronraildepotPoint-detail-editDiv-tab-button04").unbind("click").click(function(){//保存
				  RTU.invoke("app.eelectronraildepot.query.maintenance.addMarker", data.Point);
			  });
			  
			  $("#"+data.tabId+" #eelectronraildepotPoint-detail-editDiv-tab-button02").unbind("click").click(function(){//取消
					
				  if(data.isUpdate=="1"){//编辑
					  $("#"+data.tabId+" .electronraildepotPoint-editOutDiv").addClass("hidden");
					  $("#"+data.tabId+" .electronraildepotPoint-showOutDiv").removeClass("hidden");
				  }else if(data.isUpdate=="2"){//新建
					  RTU.invoke("map.marker.electronicRailClose");
					  if(electronPoint){
							RTU.invoke("map.marker.removeMarker",electronPoint);
						}
				  }
				  $(".pointTab").css("display","none");
				  points="";
				  
			  });
			  $("#"+data.tabId+" #eelectronraildepotPoint-detail-editDiv-tab-button03").unbind("click").click(function(){//修改
				  RTU.invoke("app.eelectronraildepot.details.updateDate",data);
			  });
//			  $("#"+data.tabId+" #eelectronraildepotPoint-lineSelectBut").unbind("click").click(function(){//图片  段修改
//				  
//				  RTU.invoke("app.eelectronraildepot.imgOnOffSet",data);
//			  });
			  
		  };
	  });
	  
	  
	  function edit(data){
		  RTU.invoke("app.electronrail.setFlagValue",true);
		  RTU.invoke("header.alarmMsg.showMousePosition","请用鼠标左键进行围栏选择，左键双击结束!-");
		  var mapObj = RTU.invoke("map.getMap");
		  
		  if(mapObj.Map.rpgon&&data.data){
			  var GetgraphicsDiv=RTU.invoke("map.GetgraphicsDiv");
			  var GetGraphicsArr=RTU.invoke("map.GetGraphicsArr");
				 
			  for(var i=0;i<electronPolygons.length;i++){
				  if(electronPolygons[i].lat==data.data.latitude&&electronPolygons[i].log==data.data.longitude){
					  var a=electronPolygons[i].data;
					  for (var b = 0; b < GetGraphicsArr.length; b++) if (GetGraphicsArr[b] == a) {
						  for (var c = 0; c < GetgraphicsDiv.get().childNodes.length; c++) 
							  if (GetgraphicsDiv.get().childNodes[c] == a.Div.get()) {
								  GetgraphicsDiv.get().removeChild(a.Div.get());
								  break;
							  }
						  GetGraphicsArr.splice(b, 1);
						  break;
					  }
					  break;
				  }
			  }
		  }
		  RTU.invoke("map.marker.electronicRailClose");
		  var queryOrNew=$(".border-top-click");
		  var queryOrNewText=queryOrNew[0].innerText;
		  
		  //获取选中的类型
		  var val="";
		  var radio=$("input[name='electronrail_type'");
		  $.each(radio, function (i, item) {
			  if($(item).attr("checked")=="checked"){
				  val=$(item).val();
			  }
		  });
		  if(queryOrNewText=="查询"){
			  val = "3";
		  }
		  var lineName = $('#electronrail-bodyDiv-sub2-PlineName').val();
		  var lineId=$('#electronrail-bodyDiv-sub2-PlineName').attr("lineNo");
		  var lineUpDown="";
		  var radio=$("input[name='electronrail-bodyDiv-sub2-PupDown'");
		  $.each(radio, function (i, item) {
			  if($(item).attr("checked")=="checked"){
				  lineUpDown=$(item).val();
			  }
		  });
		  var typeData = {};
		  if(data){
			  typeData.data=data.data;
		  }
		  typeData.type = data.type?data.type:val;
		  typeData.point = { "Cx":x , "Cy":y};
		  typeData.isupdate = "2";
		  typeData.lineName=lineName;
		  typeData.lineId=lineId;
		  typeData.upDown=lineUpDown;
		  typeData.rightButton=data.rightButton;
		  window.eelectronraildepot_tool_polygon2 = RTU.invoke("map.marker.electronicRail", { borderb: 3, borderc: '#FF00FF', borderpocity: 0.7, core: '#FFFF66', pocity: 0.3, completeFn: function (arr) {
			  //电子围栏点的坐标
			  var arr  =window.eelectronraildepot_tool_polygon2.CoordinatesArr;
			  var str="";
			  for(var i=0;i<arr.length;i++){
				  str=str+arr[i].Cx+","+arr[i].Cy+"|";
			  }
			  str=str.substring(0, str.length-1);
			  typeData.points=str;
			  RTU.invoke("header.alarmMsg.hide");
			  RTU.invoke("app.electronrail.setFlagValue",false);
			 if(electronPoint){
				  RTU.invoke("map.marker.removeMarker",electronPoint);
			  }
			  RTU.invoke("app.electronrail.query.addMarkerPoint", typeData);
		  } 
		  });
	  }
	  
	  
	  //初始化段名称及点击事件
	    RTU.register("app.eelectronraildepotPoint.query.stationName",function(){
	    	return function(data){
	    		if(!bureauShortname){
	    			//bureauShortname=RTU.invoke("app.electronrail.getfindByShortname");
	    			$.ajax({
	  		          url: "../zcdept/find?curPage=1&pageSize=1000",
	  		          type: "get",
	  		          async: false,
	  		          success: function (data) {
	  		              if (data.data) {
	  		            	  bureauShortname=data.data;
	  		              };
	  		          }
	  		      });
	    		}
	    		var deptId="";
	    		if(data&&data.data&&data.data.bureauId){
	    			deptId=data.data.bureauId;
	    		}
	    		var bureauName=$(".electronraildepotPoint-detail-editDiv-tab-bureauName");
	    		bureauName.empty();
	    		bureauName.append($("<option >请选择所属局</option>"));
	    		var cjName=$(".electronraildepotPoint-detail-editDiv-tab-cjName");
	    		cjName.empty();
	    		cjName.append($("<option >请选择车间</option>"));
	    		
	    		$(bureauShortname).each(function(i){
	    			if(bureauShortname[i].deptType=="09"){
	    				$opt =$("<option id='"+bureauShortname[i].deptId+"' b_id='' "+(deptId==bureauShortname[i].deptId?"selected":"")+" value='"+bureauShortname[i].deptId+"'>"+bureauShortname[i].deptName+"</option>");
	    				$(".electronraildepotPoint-detail-editDiv-tab-bureauName").append($opt);
	    			}else if(bureauShortname[i].deptType=="11"&&bureauShortname[i].deptName.indexOf("车间")>0){
	    				$opt =$("<option id='"+bureauShortname[i].deptId+"' b_id='' value='"+bureauShortname[i].deptId+"'>"+bureauShortname[i].deptName+"</option>");
	    				cjName.append($opt);
	    			}
				});
	    	};
	    });
	    
	    //图片的开关设置
	    RTU.register("app.eelectronraildepot.imgOnOffSet",function(){
	    	return function(data){
	    		var selectDiv=$("#eelectronraildepotPoint-lineSelect");
	    		if($("#eelectronraildepotPoint-lineSelectBut").attr("onOff")=="on"){
	    			$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","Off").attr("src","../static/img/app/failureWarnning-images/failureWarnning-selectClear.png");
	    			$(selectDiv).css({"display":"block"});
	    			var bureau=$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName");
	    			var id=$(bureau).attr("b_id");
	    			var text=$(bureau).val();
	    			var data={
	    					id:id,text:text
	    			};
	    			showDepotName(data);//显示段名称
	    		}else{
	    			$("#eelectronraildepotPoint-lineSelectBut").attr("onOff","on").attr("src","../static/img/app/failureWarnning-images/failureWarnning-Select.png");
	    			$(selectDiv).css({"display":"none"});
	    			$("#eelectronraildepotPoint-detail-editDiv-tab-depotName").text("").attr("d_id","");
	    		}
	    	};
	    });
	    
	    //返回所有点
	    RTU.register("app.eelectronrail.getElectronPointArr",function(){
	    	return function(data){
	    		return electronPointArr;
	    	};
	    });
	    
	    //根据选中的局显示段名称
	    function showDepotName(data){
	    	$("#eelectronraildepotPoint-detail-editDiv-tab-bureauName").attr("b_id",data.id).val(data.text);
    		var select=$("#eelectronraildepotPoint-lineSelect-content");
    		var html="<table id='paragraphSelect-table' class='paragraphSelect-table'  cellspacing='4' collapse='4'><tr>";
	        var depotDataObjArray =searchDepot(data.text);
	         for(var i in depotDataObjArray){
	        	 if(i!=0&&i%3==0){
	        		 html=html+"</tr><tr>";
	        	 }
	        	 html=html+"<td id="+depotDataObjArray[i].dId+" onmouseover=this.bgColor='#F9A500' onmouseout=this.bgColor='' >"+depotDataObjArray[i].dName+"</td>";
	         }
	         html=html+"</table>";
	         $(select).empty().html(html);
	         $("#paragraphSelect-table tr td").each(function(){
	        	 $(this).unbind("click").click(function(){
	        		 $("#eelectronraildepotPoint-detail-editDiv-tab-depotName").
	        		 text($(this).text()).attr("d_id",this.id);
	        		 $("#eelectronraildepotPoint-lineSelect").css({"display":"none"});
	        	 });
	         });
	    }
	    
	  //根据局来查找段
		  function searchDepot(bName){
			  var searchData=null;
			  $.ajax({
		          url: "../depot/searchDepotByBureau?bureau="+bName,
		          type: "get",
		          async: false,
		          success: function (data) {
		              var data = $.parseJSON(data);
		              if (data.data) {
		            	  if(data.data){
		            		  searchData = jQuery.extend(true, {}, data.data);
		            	  }
		              };
		          }
		      });
			 
			  return searchData;
		  }
		 //根据id 获取局
		  RTU.register("app.eelectronraildepot.searchBureau",function(){
			 return function(id){
				  var bureauObj=null;
				  $.ajax({
					  url: "../bureau/findAll",
					  type: "get",
					  async: false,
					  success: function (data) {
						  var data = $.parseJSON(data);
						  if (data.data) {
							  var obj =data.data;
							  for(var i in obj){
								  if(obj[i].bId==id){
									  bureauObj=obj[i];
								  }
							  }
						  };
					  }
				  });
				  return bureauObj;
			  }
		  });
	  
	  //时间格式化
	    window.formatDate= function formatCSTDate(strDate,format){
	    	
	  	   var date=new Date(strDate);
	  	   var paddNum = function(num){
	     		num += "";
	     		return num.replace(/^(\d)$/,"0$1");
	  	   };
		  	//指定格式字符
		  	var cfg = {
		  		yyyy : date.getFullYear(), //年 : 4位
		  		yy : date.getFullYear().toString().substring(2),//年 : 2位
		  		M  : paddNum(date.getMonth() + 1),  //月 : 如果1位的时候不补0
		  		MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
		  		d  : paddNum(date.getDate()),   //日 : 如果1位的时候不补0
		  		dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
		  		hh : paddNum(date.getHours()), //时
		  		mm : paddNum(date.getMinutes()), //分
		  		ss : paddNum(date.getSeconds()) //秒
		  	};
		  	format || (format = "yyyy-MM-dd hh:mm:ss");
		  	return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
	      };
	      
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
