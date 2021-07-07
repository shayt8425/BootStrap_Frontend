RTU.DEFINE(function (require, exports) {
	
	 require("../../../css/app/labelpointsenclosure/app-labelpointsenclosure.css");
	 require("../../../css/app/labelpointsenclosure/app-labelpointsenclosure-detail.css");

	 var labelpointsenclosurePoint;//添加标注点
	 var labelpointsenclosureBureauName;//局下拉框数据
	 var labelpointsenclosureGrid;//列表
	 var locationPoint;//定位点
	 RTU.register("app.labelpointsenclosure.rightHandMap.addMarker",function(){
	    	return function(searchData){
	    		
				RTU.invoke("core.router.load", {
					 url: "../app/modules/labelpointsenclosure/app-labelpointsenclosure-detail.html",
					 async: false,
					 success: function (status) {
						 $status = $(status);
					 }
				});
//				if(searchData.opt&&searchData.opt=="update"){
//					RTU.invoke("map.marker.removeMarker",labelpointsenclosurePoint);
//				}
				
				if(searchData.type=="edit" || searchData.type=="add"){
					if(locationPoint){//删除定位点
						  RTU.invoke("map.marker.removeMarker",locationPoint);
					}
					labelpointsenclosurePoint= RTU.invoke("map.marker.addMarker", {
						 isSetCenter: true,
						 pointType:searchData.pointType,
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
			                 $("#"+obj.tabId+" .labelpointsenclosure-editOutDiv").removeClass("hidden");
							 $("#"+obj.tabId+" .labelpointsenclosure-showOutDiv").addClass("hidden");
								if(searchData.type=="add"){
									$(".lab-td3" ,".labelpointsenclosure-detail-editDiv-tab02").addClass("hidden");
									$(".lab-td4" ,".labelpointsenclosure-detail-editDiv-tab02").removeClass("hidden");
									$(".role_save").removeClass("hidden");
									
									obj.labelpointsenclosureType=searchData.labelpointsenclosureType;
								}else if(searchData.type=="edit"){
									obj.data=searchData.data;
								}
							 obj.type=searchData.type;
			             	 RTU.invoke("app.labelpointsenclosure.query.initDetail",obj);//回显数据  修改 或  添加
							 setTimeout(function(){
								 var objId= $("#" + obj.tabId);
								 $(" .closediv", $(objId)).click(function () {
				                    $(objId).hide();
								 });
							 },30);
						 },
						 rightHand:function(obj){}
			 		});
					
					if(searchData.type=="edit"){
						labelpointsenclosurePoint.data=searchData.data;
						window.labelpointsenclosurePointArr.push(labelpointsenclosurePoint);
					}
					
					setTimeout(function(){
						labelpointsenclosurePoint.runClickEvent();
			 		},50);
				}else{
					
					searchData.point={
							latitude:searchData.data.latitude,
							longitude:searchData.data.longitude
					};
					labelpointsenclosurePoint= RTU.invoke("map.marker.addMarker", {
						 isSetCenter: true,
						 pointType:searchData.pointType,
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
							 $(".modify").remove();
							 var tab = $("#" + obj.tabId);
							 var cNum = 20;
				                if (obj.Point.DetaY == -7) {
				                    cNum = 4;
				                }
			                 var tp = -tab.height() - 20;
			                 var tml = -tab.width() / 2 + cNum-7;
			                 tab.css({ "margin-left": tml, "margin-top": tp });
			                 obj.data=searchData.data;
			                 obj.type="show";
			                 
			             	 RTU.invoke("app.labelpointsenclosure.query.initDetail",obj);//查看
							 
							 setTimeout(function(){
								 var objId= $("#" + obj.tabId);
								 $(" .closediv", $(objId)).click(function () {
				                    $(objId).hide();
								 });
							 },30);
							 
						 },
						 rightHand:function(obj){
							 var userLabPointRole= RTU.invoke("app.labelpointsenclosure.getUserLabPointRole");
							 obj.data=searchData.data;
							 $(".modify").remove();
							 for ( var int = 0; int < window.labelpointsenclosurePointArr.length; int++) {
									if(obj.Point==window.labelpointsenclosurePointArr[int]){
										labelpointsenclosurePoint=window.labelpointsenclosurePointArr[int];
									}
							 }
							 
							 var upd=false;
							 var del=false;
							 for(var y=0;y<userLabPointRole.labRole.length;y++){
								 if("IID"==userLabPointRole.labRole[y]){
									 upd=true;
								 }
								 if("IIC"==userLabPointRole.labRole[y]){
									 del=true;
								 }
							 }
							 
							 var html="<div id='modify' class='modify' style='text-align:center'><ul>";
								 if(upd)
									 html+="<li><a href='#' class='modifyLabPoint'>修改</a></li>";
								 
								 if(del)
									 html+="<li><a href='#' class='deleteLabPoint'>删除</a></li>";
								 
								 html+="</ul></div>";
							 
							 $(labelpointsenclosurePoint.Icon).after(html);
							 $(".modifyLabPoint").click(function(){
								 $(".modify").remove();
								 RTU.invoke("map.setCenter", { lng: searchData.data.longitude, lat: searchData.data.latitude});
				    				var data={};
				    				data.data=searchData.data;
				    				data.type="edit";
				    				data.point={latitude:searchData.data.latitude,longitude:searchData.data.longitude};
				    				data.pointType=RTU.invoke("app.labelpointsenclosure.getPointImgType",searchData.data.pointsType);
				    				data.isShowTitle=false;
				    				RTU.invoke("app.labelpointsenclosure.query.removeMarker");//删除点
				    				RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",data);
							 });
							 $(".deleteLabPoint").click(function(){
								 $(".modify").remove();
								 RTU.invoke("header.roleAlarmMsg.show","确定删除标注名为："+searchData.data.pointsName+" 的标注点吗？-");
								 $("#roleAlarmSureBtn").click(function () {
				       	             $("#roleAlarmDiv").addClass("hidden");
				       	          var url="labelpointsenclosure/deleteLabelpointsenclosure?recId="+searchData.data.recId;
				     	   			 var param={
				     	                   url: url,
				     	                   cache: false,
				     	                   asnyc: true,
				     	                   datatype: "json",
				     	                   success: function (data) {
				     	                	   RTU.invoke("header.notice.show", "删除成功。。");
				     	                	  RTU.invoke("app.labelpointsenclosure.query.removeMarker");//删除点
				     	                	  if(getGridLen())
			      		                		   RTU.invoke("app.labelpointsenclosure.query.initList");
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
					
					/*setTimeout(function(){
						labelpointsenclosurePoint.runClickEvent();
			 		},50);*/
					
					if(searchData.hidded&&searchData.hidded==true){
						RTU.invoke("map.marker.hideMarker",labelpointsenclosurePoint);
					}
					
					//保存添加的
					labelpointsenclosurePoint.data=searchData.data;
					window.labelpointsenclosurePointArr.push(labelpointsenclosurePoint);
				}
				//显示标注名
				if(searchData.isShowTitle&&searchData.isShowTitle==true)
				if(searchData.data&&labelpointsenclosurePoint){
					$(labelpointsenclosurePoint.Icon).after('<div  class="TIPShowName" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+(-3)+'px;left:'+(25)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + searchData.data.pointsName + '</div>');
				}
				RTU.invoke("app.labelpointsenclosure.query.initDetail",searchData);//查看
	    	};
	    });
	 
	//15 页面初始化
	  RTU.register("app.labelpointsenclosure.query.initDetail",function(){
	    	return function(data){
	    		RTU.invoke("app.labelpointsenclosure.query.bureauName", data);
	    		RTU.invoke("app.labelpointsenclosure.query.initDetailBtn",data);
	    		RTU.invoke("app.labelpointsenclosure.query.initDetailData",data);
	    	};
	    });
	 
	//16初始化段名称
	    RTU.register("app.labelpointsenclosure.query.bureauName",function(){
	    	return function(data){
	    		if(!labelpointsenclosureBureauName){
	    			labelpointsenclosureBureauName=getfindByShortname();
	    		}
	    		$(".labelpointsenclosure-detail-editDiv-tab-bureauName").empty();
	    		$(labelpointsenclosureBureauName).each(function(i){
	    			var id=labelpointsenclosureBureauName[i].id;
	    			var name=labelpointsenclosureBureauName[i].text;
	    			if(data.data&&data.data.bureauId==id){
	    				data.data.bureauName=name;
	    			}
					$opt =$("<option id='"+id+"' b_id='' value='"+id+"'>"+name+"</option>");
		 			$(".labelpointsenclosure-detail-editDiv-tab-bureauName").append($opt);
				});
	    	};
	    });
	    
	    //18  标注点信息页面事件
	    RTU.register("app.labelpointsenclosure.query.initDetailBtn",function(){
	    	return function(data){
	    		var role_save=$("#"+data.tabId+" .role_save").attr("role");
	    		var dis=$(".lab-td3").css("display");
	    		if(role_save==undefined&&dis!="block"){
	    			$("#"+data.tabId+" .labelpointsenclosure-detail-editDiv-tab-button02-upDiv").css("margin-left","45px");
	    		}
				//取消
	    		$("#"+data.tabId+" #labelpointsenclosure-detail-editDiv-tab-button02").unbind("click").click(function(){
					if(data.type=="add"){
						RTU.invoke("app.labelpointsenclosure.query.removeMarker");//删除点
					}else if(data.type=="edit"){
						RTU.invoke("app.labelpointsenclosure.query.removeMarker",data);//删除点
	                	 var sendData = {
               			   data:data.data,
               			   type:"show",
               			   isShowTitle:true,
               			   pointType:RTU.invoke("app.labelpointsenclosure.getPointImgType",data.data.pointsType),
	                	   };
	                       RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
					}
					$(".pointTab").css("display","none");
				});
	    		 //修改
	    		$("#"+data.tabId+" #labelpointsenclosure-detail-editDiv-tab-button03").unbind("click").click(function(){
	    			saveOrEditData(data);
				});
				//保存
	    		$("#"+data.tabId+" #labelpointsenclosure-detail-editDiv-tab-button04").unbind("click").click(function(){
	    			saveOrEditData(data);
				});
	    		function saveOrEditData(data){
	    			//添加 或修改 
	    			var bureauId=$("#"+data.tabId+" #labelpointsenclosure-detail-editDiv-tab-bureauName option:selected").attr('id');//获取选 中属性的值
	    			var pointsName=$("#"+data.tabId+' #labelpointsenclosure-detail-editDiv-tab-stationName').val();
	    			var dotType =$("#"+data.tabId+" #lab-selectType option:selected").val();
	    			var remark=$("#"+data.tabId+" #labelpointsenclosure-detail-editDiv-tab-remark").val();
	    			pointsName=pointsName.trim();
				  if(pointsName==""){
				      RTU.invoke("header.alarmMsg.show","请输入标注点名称");
				      return false;
	  			  }else if(bureauId==""||bureauId==undefined){
	  				  RTU.invoke("header.alarmMsg.show","请选择标注点所属局");
	  				  return false;
	  			  }
	  			  else if(dotType == ""||dotType=="请选择标注点类型"){
	  				  RTU.invoke("header.alarmMsg.show","请选择标注点类型");
	  				  return false;
	  			  }
	    		  else{
    				   RTU.invoke("header.msg.show", "保存中，请稍后！！！");
    				   //修改
    				   if(data.data&&data.data.recId){
    					   var url="labelpointsenclosure/updateLabelpointsenclosure?recId="+data.data.recId+"&pointsName="+pointsName+"&pointsType="+dotType+"&editUser=abc&bureauId="+bureauId+"&remark="+remark;
    					   var param = {
      		                   url: url,
      		                   cache: false,
      		                   asnyc: true,
      		                   datatype: "jsonp",
      		                   success: function (data) {
      		                	   if(data.success){
      		                	   RTU.invoke("header.notice.show", "修改成功。。");
      		                	   RTU.invoke("header.msg.hidden");
      		                	   data.data.type="edit";
      		                	   RTU.invoke("app.labelpointsenclosure.query.removeMarker",data.data);//删除点
      		                	   if(getGridLen())
      		                		   RTU.invoke("app.labelpointsenclosure.query.initList");
      		                	   var sendData = {
    		                			   data:data.data,
    		                			   type:"show",
    		                			   opt:"update",
    		                			   isShowTitle:true,
    		                			   pointType:RTU.invoke("app.labelpointsenclosure.getPointImgType",data.data.pointsType),
    			                	   };
    			                    RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
      		                	   }else{
      		                		 RTU.invoke("header.notice.show", "修改失败。。");
        		                	   RTU.invoke("header.msg.hidden");
      		                	   }
      		                   },
      		                   error: function () {
      		                	   RTU.invoke("header.msg.hidden");
      		                   }
      		                 };
      		                RTU.invoke("core.router.get", param);
     				   }else{
     					   //添加
     					  var url="labelpointsenclosure/addLabelpointsenclosure?pointsName="+pointsName+"&pointsType="+dotType+"&longitude="+data.longitude+"&latitude="+data.latitude+"&editUser=abc&bureauId="+bureauId+"&remark="+remark;
     					  var param = {
      		                   url: url,
      		                   cache: false,
      		                   asnyc: true,
      		                   datatype: "jsonp",
      		                   success: function (data) {
      		                	   RTU.invoke("app.labelpointsenclosure.query.removeMarker");//删除点
      		                	   RTU.invoke("header.notice.show", "添加成功。。");
      		                	   RTU.invoke("header.msg.hidden");
      		                	 if(getGridLen())
    		                		   RTU.invoke("app.labelpointsenclosure.query.initList");
      		                	 var sendData = {
  		                			   data:data.data,
  		                			   type:"show",
  		                			   isShowTitle:true,
  		                			   pointType:RTU.invoke("app.labelpointsenclosure.getPointImgType",data.data.pointsType),
  			                	   };
  			                       RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
      		                   },
      		                   error: function () {
      		                	   RTU.invoke("header.msg.hidden");
      		                   }
      		                 };
      		                RTU.invoke("core.router.get", param);
	     				   }
	    			}
	    		}
	    	};
	    });
	    
	    
	    //回显标注信息
		  RTU.register("app.labelpointsenclosure.query.initDetailData",function(){
		    	return function(data){
		    		if(data.type=="show"){
						$("#"+data.tabId+' #labelpointsenclosure-detail-showDiv-tab-stationName').text(data.data.pointsName);
						$("#"+data.tabId+' #labelpointsenclosure-detail-showDiv-tab-bureauName').text(data.data.bureauName);
						$("#"+data.tabId+' #labelpointsenclosure-detail-showDiv-tab-pointType').text(getPointType(data.data.pointsType));
						$("#"+data.tabId+' #labelpointsenclosure-detail-show-tab-remark').text(data.data.remark);
		        		
		    		}else if(data.type=="edit"){//编辑时
		    			$("#"+data.tabId+' #labelpointsenclosure-detail-editDiv-tab-stationName').val(data.data.pointsName);
						$("#"+data.tabId+' #labelpointsenclosure-detail-editDiv-tab-bureauName').val(data.data.bureauId);
						$("#"+data.tabId+' #labelpointsenclosure-detail-editDiv-tab-remark').val(data.data.remark);
		        		
		    			$("#"+data.tabId+" #lab-selectType option[name='labelType']").each(function(){
		    				if($(this).val()==data.data.pointsType){
		    					$(this).val(data.data.pointsType);
		    					$(this).attr("selected","selected");
		    				}
		    			});
		    		}else if(data.type=="add"){
		    			$("#"+data.tabId+" #lab-selectType option[name='labelType']").each(function(){
		    				if($(this).val()==data.labelpointsenclosureType){
		    					$(this).val(data.labelpointsenclosureType);
		    					$(this).attr("selected","selected");
		    				}
		    			});
		    		}
		    	};
		    });
		  
		  function hideMarker(data){
			  
			  for(var j=0;j<window.labelpointsenclosurePointArr.length;j++){
				  if(com(window.labelpointsenclosurePointArr[j].data, data)){
					  RTU.invoke("map.marker.hideMarker",window.labelpointsenclosurePointArr[j]);
				  };
			  }
		  }
		  
		  function com(arrPoint,data){
			  for(var j=0;j<data.length;j++){
				  if(data[j].recId==arrPoint.recId){
					  return false;
				  }
			  }
			  return true;
		  }
		  
		  
		  //9初始化tab1查询列表
		    RTU.register("app.labelpointsenclosure.query.initList",function(){
		    	var getConditions = function(){
		    		 var typeCheckbox=$("input[name='type']");
		    		 var bid=$("#labelpointsenclosure-bureauName").attr("bureauid");
		    		 var bureauid=bid==undefined?"":bid;
		    		 var typeStr="";
		    		 $.each(typeCheckbox, function (i, item) {
			   			 if($(item).attr("checked")=="checked"){
			   				typeStr=typeStr+$(item).val()+",";
				   		 }
			         });
		    		 typeStr=typeStr.substring(0, typeStr.length-1);
		    		 var data={
		    				 type:typeStr,
		    				 bureauid:bureauid
		    		 };
		    		 return data;
		    	};
		    	var refreshFun=function(data){
		    		
//		    		RTU.invoke("map.marker.hideMarker",1);
//		    		hideMarker(data);
		    		
		    		//是否刷新列表
		    		if(getGridLen()){
		    			labelpointsenclosureGrid = new RTGrid({
		    				datas: data,
		    				containDivId: "labelpointsenclosure-bodyDiv-sub1-body-grid",
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
		    				selectTrEvent: function (t, currClickItem) {//复选框选中事件
		    					if($(currClickItem).attr("checked")=="checked"){
		    						var thisData = currClickItem.data("itemData");
		    						//设置中心点
		    						RTU.invoke("app.labelpointsenclosure.query.clickcheckbox",thisData);
		    						RTU.invoke("map.changeLevel", "8");
		    					}
		    				},
		    				clickTrEvent: function (d, ckb) {
		    					var fd = labelpointsenclosureGrid.currClickItem().data;
		    					//设置中心点
		    					RTU.invoke("app.labelpointsenclosure.query.clickcheckbox",fd);
		    					RTU.invoke("map.changeLevel", "8");
		    				},
		    				replaceTd: [{ index: 2, fn: function (data, j, ctd, itemData) {
		    					return getPointType(data);
		    				}
		    				}],
		    				loadPageCp: function (t) {
		    					t.cDiv.css("left", "200px");
		    					t.cDiv.css("top", "200px");
		    				},
		    				colNames: ["标注点名称", "所属局","标注点类型"],
		    				colModel: [{ name: "pointsName", width: "100px", isSort: true },
		    				           { name: "bureauName", width: "110px", isSort: true },
		    				           { name: "pointsType", width: "100px", isSort: true }]
		    			});
		    		}else{
		    			for(var i=0;i<data.length;i++){
		    				var sendData = {
		    						data:data[i],
		    						type:"show",
		    						pointType:RTU.invoke("app.labelpointsenclosure.getPointImgType",data[i].pointsType),
		    						isShowTitle:true
		    				};
		    				RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",sendData);
		    			}
		    		}
					RTU.invoke("header.msg.hidden");
		    	};
		    	return function(){
		    		RTU.invoke("header.msg.show", "加载中,请稍后!!!");
		    		var conditions=getConditions();
		    		 var url="labelpointsenclosure/findByLabTypeOrBureau?type="+conditions.type+"&bureauId="+conditions.bureauid;
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
		 RTU.register("app.labelpointsenclosure.compareLabLevel", function () {
			  return function compareLabLevel(data){
				  var labLevel=false;
					 for(var a=0;a<data.userLabPointRole.length;a++){
						 if(data.userLabPointRole[a].type==data.pointsType){
							 if(Number(data.userLabPointRole.level)>=Number(data.userLabPointRole[a].level)){
								 labLevel=true;
							 };
						 }
					 }
				 return labLevel;
			  };
		 });
		  
		  function getGridLen(){
			  var runFalg=false;
			  if($("#labelpointsenclosure-bodyDiv-sub1-body-grid").length>0){
				  runFalg=true;
			  };
			  return runFalg;
		  }
		  
		  
		//类型对应的名称
		    function getPointType(strType){
		    	 if (strType == "1") {
		             return "防洪防汛";
		         }else if (strType == "2") {
		             return "临时限速";
		         }else if(strType=="3"){
		        	 return "换装点";
		         }else{
		        	 return "其它";
		         }
		    }
		    
		    //类型对应的显示图片类型 
		    RTU.register("app.labelpointsenclosure.getPointImgType", function () {
		    	return function getPointImgType(strType){
		    		if (strType == "1") {
		    			return "FloodPreventionAndFloodControl";
		    		}else if (strType == "2") {
		    			return "temporarySpeedLimitPoint";
		    		}else if(strType=="3"){
		    			return "transshipmentPoint";
		    		}else{
		    			return "otherPoint";
		    		}
		    	};
		    });
		    
	 //获取权限  显示  增加  修改  删除
	    RTU.register("app.labelpointsenclosure.getUserLabPointRole", function () {
	    	return function removeMarkerLab(){
	    		var level=$(".map-showLevel").text().trim();
	    		var setting=RTU.data.setting;
	    		var labRole=[];
		   		 for(var j=0;j<setting.length;j++){
		   			 if(setting[j].alias=="系统设置"){
		   				 var mod=setting[j].module;
		   				 for(var k=0;k<mod.length;k++){
		   					 if(mod[k].alias=="标注点"){
		   						 var lab_role=mod[k].module;
		   						 for(var c=0;c<lab_role.length;c++){
		   							labRole[c]=lab_role[c].id;
		   						 }
		   					 }
		   				 }
		   			 }
		   		 }
		   		
		   		var userLabPointRole=[
		                 {level:window.publicData["WfloodPointLevel"],type:1},
		                 {level:window.publicData["RlimitPointLevel"],type:2},
		                 {level:window.publicData["EelectronraildepotPointLevel"],type:3},
		                 {level:window.publicData["FxPointLevel"],type:4},
		                ];
		   		userLabPointRole.labRole=labRole;
		   		userLabPointRole.level=level;
		   		 return userLabPointRole;
	    	};
	    });
	 
	 //17获取局
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
	    
	    //删除所有标注点
	    RTU.register("app.labelpointsenclosure.removeMarkerLab", function () {
	    	return function removeMarkerLab(){
	    		for(var j=0;j<window.labelpointsenclosurePointArr.length;j++){
					 RTU.invoke("map.marker.removeMarker",window.labelpointsenclosurePointArr[j]);
				}
				window.labelpointsenclosurePointArr=[];//所有标注点 清空
	    	};
	    });
	
	 
    
  //移除地图上的电子围栏标注
	  RTU.register("app.labelpointsenclosure.query.removeMarker",function(){
		  return function(type){
			  
			  if(labelpointsenclosurePoint){
				  var falg=true;
				  if("add"==type){
					  for(var j=0;j<window.labelpointsenclosurePointArr.length;j++){
						  if(window.labelpointsenclosurePointArr[j]==labelpointsenclosurePoint){
							  falg=false;
						  }
					  }
				  }else if(type&&(type.type=="other"||type.type=="edit")){
					  for(var j=0;j<window.labelpointsenclosurePointArr.length;j++){
						  if(window.labelpointsenclosurePointArr[j].Cx==type.longitude&&
								  window.labelpointsenclosurePointArr[j].Cy==type.latitude){
							  RTU.invoke("map.marker.removeMarker",window.labelpointsenclosurePointArr[j]);
							  deleteLabPointArr(window.labelpointsenclosurePointArr[j].data);
							  falg=false;
						  }
					  }
				  }
				  if(falg){
					  RTU.invoke("map.marker.removeMarker",labelpointsenclosurePoint);
					  deleteLabPointArr(labelpointsenclosurePoint.data);
				  }
			  }
		  };
	  });
	  
	  function deleteLabPointArr(data){
		  if(data){
			  var pointArr=[];
			  for(var j=0;j<window.labelpointsenclosurePointArr.length;j++){
				  if(window.labelpointsenclosurePointArr[j].data.recId!=data.recId){
					  pointArr.push(window.labelpointsenclosurePointArr[j]);
				  }
			  }
			  window.labelpointsenclosurePointArr=[];
			  window.labelpointsenclosurePointArr=pointArr;
		  }
	  }
	  
	//14添加弹出标签及相应的点击事件
	  RTU.register("app.labelpointsenclosure.query.setTabHtml", function () {
	        return function (data) {
//	        	var Point = $.extend(true, {}, data);
	        	var img = $("img[alt='" + data.obj.tabId + "']");
	            $(img).empty().after("<div id='menuPrent' class='hidden' ><div id='menu' style='text-align:center'><ul><li><a href='#' class='mflood'>防洪防汛</a></li><li><a href='#' class='rlimit'>临时限速</a></li><li><a href='#' class='hzPoint'>换装点</a></li><li><a href='#' class='other'>其它</a></li></ul></div></div>");
	            
	            $(img).mousedown(function(e){
	            	if (3 == e.which) {
	            		var d={
	            			MouseCx:data.Cx,
	            			MouseCy:data.Cy
	            		};
	            		$("#labelpointsenclosureTypeDiv").remove();
	            		$("#menuPrent").removeClass("hidden").css("margin-left", "40px").css("margin-top", "40px");
	    	            rightClick("menuPrent",d);
	            	}
	            });
	            
	            $("body").click(function(){
	            	$("#menuPrent").addClass("hidden");
	            });
	        };
	    });
	
	  
	  
	    //10右键点击地图任意位置，添加电子围栏
	    RTU.register("app.labelpointsenclosure.rightHandMap.init", function(){
	    	return function(){
	    		var mapObj = RTU.invoke("map.getMap");
	    		mapObj.Map.addEventListener(mapObj.RMapEvent.MouseRightButtonEvent, rightEventListener);
	    		$("#map").mousedown(function(e){//地图单击
	    			$("#labelpointsenclosureTypeDiv").remove();
	    		});
	    	};
	    });
	  
	    //11
	    var rightEventListener=function(e){
	    	//是否已打开电子围栏页面
	    	if($("#electronrail-bodyDiv-sub1-body-grid").length>0){
	    		return false;
	    	}
	    	//是否已打开特殊点围栏页面
	    	if($("#electronraildepot-body-grid").length>0){
	    		return false;
	    	}
	    	
	    	//如果没有权限,就不弹出右键窗口
	    	var data = RTU.invoke("app.setting.data", "labelpointsenclosure");
	        if (!data ||!data.isActive) {
	            return false;
	        }
	    	
	    	$("#menuPrent").addClass("hidden");
			$("#labelpointsenclosureTypeDiv").remove();
			$("body").append("<div id='labelpointsenclosureTypeDiv' style='position:absolute;background-color:#fff;width:105px;height:25px;top:" + e.MouseY + "px;left:" + e.MouseX + "px;z-index:9999999'></div>");
			$("#labelpointsenclosureTypeDiv").empty().append("<div><div id='menu' style='text-align:center'><ul><li><a href='#' class='mflood'>防洪防汛</a></li><li><a href='#' class='rlimit'>临时限速</a></li><li><a href='#' class='hzPoint'>换装点</a></li><li><a href='#' class='other'>其它</a></li></ul></div></div>");
			rightClick("labelpointsenclosureTypeDiv",e);
		};
		//12标注类型事件
		function rightClick(divId,e){
			$(".mflood").unbind("click").click(function(){
				if(divId=="menuPrent")
					$("#"+divId).addClass("hidden");
				else
				$("#"+divId).remove();
				var type = "1";
				addLabelpointsenclosure(type,e);
			});
			$(".rlimit").unbind("click").click(function(){
				if(divId=="menuPrent")
					$("#"+divId).addClass("hidden");
				else
				$("#"+divId).remove();
				var type = "2";
				addLabelpointsenclosure(type,e);
			});
			$(".hzPoint").unbind("click").click(function(){
				if(divId=="menuPrent")
					$("#"+divId).addClass("hidden");
				else
				$("#"+divId).remove();
				var type = "3";
				addLabelpointsenclosure(type,e);
			});
			$(".other").unbind("click").click(function(){
				if(divId=="menuPrent")
					$("#"+divId).addClass("hidden");
				else
				$("#"+divId).remove();
				var type = "4";
				addLabelpointsenclosure(type,e);
			});
			
			//添加标注点
			function addLabelpointsenclosure(type,e){
	    		RTU.invoke("app.labelpointsenclosure.query.removeMarker","add");//删除点
				var point = { "longitude":e.MouseCx , "latitude":e.MouseCy};
				  e.point=point;
				  e.labelpointsenclosureType=type;
				  e.type="add";
				  e.pointType=RTU.invoke("app.labelpointsenclosure.getPointImgType",type);
				  RTU.invoke("map.setCenter", { lng: e.MouseCx, lat: e.MouseCy });
				 RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",e);
			}
		}
		 //5显示所有标注点信息页面  按钮事件
	    RTU.register("app.labelpointsenclosure.query.initBtn",function(){
	    	return function(){
	    		
	    		var r_del=$(".role_delete").attr("role");//IIC
	    		var r_upd=$(".role_update").attr("role");//IID
	    		if(r_del!=undefined&&r_upd!=undefined){//全有
	    			$(".content-btn-container._ROLE_.role_update").css("right","150px");
	    		}
	    		
	    		//tab2定位  新建
				$("#labelpointsenclosure-sub2-button1").unbind("click").click(function(){
					RTU.invoke("app.labelpointsenclosure.query.sub2.searchPosition");
				});
				//查询
				$("#labelpointsenclosure-button1").unbind("click").click(function(){
					RTU.invoke("app.labelpointsenclosure.query.initList");//列表数据显示
				});
				//修改
				$("#labelpointsenclosure-sub1-button2").unbind("click").click(function(){
					var checkeds = labelpointsenclosureGrid.selectItem();
	    			if(checkeds.length == 0){
	    				RTU.invoke("header.notice.show", "请选择一个标注点。。");
	    				return false;
	    			}else if(checkeds.length>1){
	    				RTU.invoke("header.notice.show", "只能选择一个标注点。。");
	    				return false;
	    			}else{
	    				var d = $(checkeds[0]).data("itemData");
	    				var data={};
	    				data.data=d;
	    				data.type="edit";
	    				data.point={latitude:d.latitude,longitude:d.longitude};
	    				data.pointType=RTU.invoke("app.labelpointsenclosure.getPointImgType",d.pointsType);
	    				data.isShowTitle=false;
	    				d.type="other";
	    				RTU.invoke("app.labelpointsenclosure.query.removeMarker",d);
	    				RTU.invoke("app.labelpointsenclosure.rightHandMap.addMarker",data);
	    				//设置中心点
						RTU.invoke("app.labelpointsenclosure.query.clickcheckbox",d);
						RTU.invoke("map.changeLevel", "8");
	    			}
				});
				//删除
				$("#labelpointsenclosure-sub1-button3").unbind("click").click(function(){
					var checkeds = labelpointsenclosureGrid.selectItem();
					if(checkeds.length == 0){
						RTU.invoke("header.notice.show", "请选择一个标注点。。");
						return false;
					}else{
						var name="";
						 $.each(checkeds, function (i, item) {
		     	   			 var data=$(item).data("itemData");
		     	   			 if(data)
		     	   			 if(checkeds.length==1){
		     	   				 RTU.invoke("header.roleAlarmMsg.show","确定删除"+data.pointsName+" 的标注点吗？-");
		     	   			 }else{
		     	   				 name+=data.pointsName+",";
		     	   			 }
						 });
						 if(checkeds.length>1){
							 name=name.substring(0, name.length-1);
							 RTU.invoke("header.roleAlarmMsg.show","确定删除"+name+" 的标注点吗？-");
						 }
						 $("#roleAlarmSureBtn").click(function () {
		       	             $("#roleAlarmDiv").addClass("hidden");
			       	          $.each(checkeds, function (i, item) {
			     	   			 var obj=$(item).data("itemData");
			     	   			 obj.type="other";
			     	   			 if(obj){
				     	   			var url="labelpointsenclosure/deleteLabelpointsenclosure?recId="+obj.recId;
				     	   			 var param={
				     	                   url: url,
				     	                   cache: false,
				     	                   asnyc: true,
				     	                   datatype: "json",
				     	                   success: function (data) {
				     	                	  RTU.invoke("header.notice.show", "删除成功。。");
				     	                	  RTU.invoke("app.labelpointsenclosure.query.removeMarker",obj);//删除点
				     	                	 if(getGridLen())
			      		                		   RTU.invoke("app.labelpointsenclosure.query.initList");
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
					}
				});
				
	    	};
	    });
    RTU.register("app.labelpointsenclosure.close.labGrid",function(){
    	return function(){
    		if(labelpointsenclosureGrid){
    			labelpointsenclosureGrid=null;
    		}
    	};
    });
    
  //设置中心点
    RTU.register("app.labelpointsenclosure.query.clickcheckbox", function () {
        return function (clickData) {
               RTU.invoke("map.setCenter", { lng: clickData.longitude, lat: clickData.latitude });
        };
    });
    
  //8添加定位点图标
	  RTU.register("app.labelpointsenclosure.query.addMarkerLocatin", function(){
		  return function(data){
			  if(locationPoint){
				  RTU.invoke("map.marker.removeMarker",locationPoint);
			  }
			  var lng=0;
			  var lat=0;
			 if(data.lng&&data.lat){//查询定位时
				  lng=data.lng;
				  lat =data.lat;
			 }else{					//回显标注点时
				 lat=data.latitude;
				 lng=data.longitude;
			 }
			  var w=44,h=44; //点的 宽度
			  var imgName="crossing";//定位点图
			  $status = $("<div></div>");
			  locationPoint = RTU.invoke("map.marker.addMarker", {
					 isSetCenter: true,
					 pointType:imgName,
					 TIPSID: "id",
					 iconWidth:w, //点的 宽度
				     iconHeight:h, //点的高度
				     iconLeft: -21, //点图标left
		    	     iconTop: -23, //点图标top
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
			  
			  //if(data.pointName)//显示标注点名称
			  //$(electronPoint.Icon).after('<div  class="TIPShowName" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+(-3)+'px;left:'+(19)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + data.elecName + '</div>');
			  
			  return locationPoint;
		  };
	  });
  
	    
});
