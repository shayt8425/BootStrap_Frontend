RTU.DEFINE(function(require, exports) {
/**
 * 模块名：设备质量追踪
 * name：devicequalitytrack
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("../common/common.js");
    require("app/devicequalitytrack/app-devicequalitytrack-log.js");//添乘日志上报
    require("app/devicequalitytrack/app-devicequalitytrack-logquery.js");//添乘管理,查询界面
    require("app/devicequalitytrack/app-devicequalitytrack-faultlog.js");//故障上报
    require("app/devicequalitytrack/app-devicequalitytrack-faultlogquery.js");//问题管理,查询界面
    require("app/devicequalitytrack/app-devicequalitytrack-locoquery.js");//机车查询界面
    require("app/devicequalitytrack/app-devicequalitytrack-devmanquery.js");//设备配置管理界面
    require("app/devicequalitytrack/app-devicequalitytrack-statisticquery.js");//查询统计
    
    require("../../../css/app/locomotivefeedback/feedbackquery.css");
    require("../../../css/app/lkjequipmentversionhistoryquery/locoquery-lkjequipmenthistory-query.css");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
    
    var $html;
	var popuwnd;
	var data;
	
	var locoPopuWnd;//机车添加界面对象;
	
	RTU.register("app.devicequalitytrack.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-menu.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				
/*				RTU.invoke("app.devicequalitytrack.initinput");
				RTU.invoke("app.devicequalitytrack.inituploadify");	*/		
			}
		});
		return function() {
			return true;
		};
	});
	

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twidth=document.documentElement.clientWidth * 0.85;
		Resolution.Theight=document.documentElement.clientHeight * 0.85;
		return Resolution;
	}
	RTU.register("app.devicequalitytrack.query.activate", function() { //使得popuwnd对象活动
		return function() {
			RTU.invoke("header.msg.hidden");
			var width = $("body").width() - 640;
			var height = $("body").height() - 120;
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
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
			window.setTimeout('RTU.invoke("app.devicequalitytrack.query.create");',100);
//			RTU.invoke("app.devicequalitytrack.query.create", $html);
		};
	});
	RTU.register("app.devicequalitytrack.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.close();
			}
		};
	});
	
	
	RTU.register("app.devicequalitytrack.query.create", function () {
		function initLeftMenuClickEvent(){//质量追踪主界面左边菜单点击初始化事件
			$(".leftMargin",".leftDiv").unbind("click").bind("click",function(){
				switch($(this).attr("id")){
					case "locoRunMangement":
						RTU.invoke("app.devicequalitytrack.logquery.activate");
						break;
					case "questionManagement":
						RTU.invoke("app.devicequalitytrack.faultlogquery.activate");
						break;
					case "querySum":
						RTU.invoke("app.devicequalitytrack.statisticquery.activate");
						break;
					case "devManagement":
						RTU.invoke("app.devicequalitytrack.devmanquery.activate");
						break;
					case "locoQuery":
						RTU.invoke("app.devicequalitytrack.locoquery.activate");
						break;
				}
			});
		};
		function initMouseEvent(){
			$(".trainImg","#deviceQualityRDiv").unbind("mouseover").bind("mouseover",function(e){
				  if(e.which==3||!$("#content-devicequalitytrack-rightClickDiv").hasClass("hidden"))return;
            	  var locoTypeDiv=$("#content-devicequalitytrack-locoHoverDiv");
    			  var clientX=e.clientX;
				  var clientY=e.clientY;			  
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9 ;
		          var height1 = document.documentElement.clientHeight*0.85;

		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-40-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX-100)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-60-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-60)+"px"});
				  }
				  
				  $("#locoHoverDiv-tab-loco").text($(this).attr("id"));
				  $("#locoHoverDiv-tab-runhours").text($(this).attr("totalRunHours"));
				  $("#locoHoverDiv-tab-runmiles").text($(this).attr("totalRunMiles"));
				  $("#locoHoverDiv-tab-recques").text($(this).attr("recFaultCount"));
				  $("#locoHoverDiv-tab-handleques").text($(this).attr("handledFaultCount"));
				  $("#locoHoverDiv-tab-curstate").text($(this).attr("isAlarm")=="false"?"正常":"故障未处理");
				  $(locoTypeDiv).removeClass("hidden");
			});
			$(".trainImg","#deviceQualityRDiv").unbind("mousemove").bind("mousemove",function(e){
				if(e.which==3||!$("#content-devicequalitytrack-rightClickDiv").hasClass("hidden"))return;
				  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var locoTypeDiv=$("#content-devicequalitytrack-locoHoverDiv");
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth;
		          var height1 = document.documentElement.clientHeight;

		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-40-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX-100)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-60-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-60)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
			});
			$(".trainImg","#deviceQualityRDiv").unbind("mouseout").bind("mouseout",function(){
				$("#content-devicequalitytrack-locoHoverDiv").addClass("hidden");
			});
			$(".trainImg","#deviceQualityRDiv").unbind("mousedown").bind("mousedown",function(e){
				if(3==e.which){//鼠标右键
     				 /*var that=this;*/
					$("#content-devicequalitytrack-locoHoverDiv").addClass("hidden");
     				 var clientX=e.clientX;
     				 var clientY=e.clientY;
     				 var rightDiv=$("#content-devicequalitytrack-rightClickDiv");
     				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth  ;
	   		         var height1 = document.documentElement.clientHeight;
	   		          
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
	   				 	   				 
	   				 $("body").click(function(){
	   					$("#content-devicequalitytrack-rightClickDiv").addClass("hidden");
	   				 });
	   				 var locoData={};
	   				 locoData.locoTypeid=$(this).attr("locoTypeid");
	   				 locoData.locoNo=$(this).attr("locoNo");
	   				 locoData.locoAb=$(this).attr("locoAb");
	   				 locoData.locoName=$(this).attr("id");
	   				 var recId=$(this).attr("recid");
	   				 $(".content-lkjequipmenthistory-rightClickDiv-tab-tdBorder","#content-devicequalitytrack-rightClickDiv")
	   				 .unbind("click").bind("click",function(){
	   					 switch($(this).attr("id")){
	   						 case "deviceQuaMenu1":
	   							 RTU.invoke("app.devicequalitytrack.log.activate",locoData);
	   							 break;
	   						 case "deviceQuaMenu2":
	   							 RTU.invoke("app.devicequalitytrack.faultlog.activate",locoData);
	   							 break;
	   						 case "deviceQuaMenu3":
	   							 if(window.confirm("确认删除机车"+locoData.locoName+"吗?")){
	   								var url="/devicequalitytrack/deleteLoco?recId="+recId;
		   				    		var param={
		   					              url: url,
		   					              cache: false,
		   				                  asnyc: true,
		   				                  datatype: "json",
		   				                  success: function (data) {
		   				                	if(data&&data.success){
						                		  RTU.invoke("header.notice.show", "删除成功");
						                		  RTU.invoke("app.devicequalitytrack.query.activate");
						                	  }
						                	  else RTU.invoke("header.notice.show", "删除失败");
		   				                  },
		   				                  error: function (e) {
		   				                	  alert(e);
		   				                  }
		   								};
		   							    RTU.invoke("core.router.get", param); 
	   							 }
	   							 break;
	   						 case "deviceQuaMenu4":
	   							 RTU.invoke("app.devicequalitytrack.devmanquery.activate",locoData.locoName);
	   							 break;
	   					 } 
	   				 });
				}
			});
			$(".rightBottomDiv","#deviceQualityRDiv").unbind("click").bind("click",function(){
				var Resolution=getResolution();
				Twitdh=Resolution.Twidth-140;
				Theight=Resolution.Theight-60;
				RTU.invoke("core.router.load",{
					url:"../app/modules/devicequalitytrack/app-devicequalitytrack-locoadd.html",
					success:function(html){
						if(locoPopuWnd)locoPopuWnd.close();
						locoPopuWnd = new PopuWnd({
								title : "机车维护",
								html : html,
								width : 300,
								height : 300,
								left : Twitdh/2,
								top : Theight/3,
								shadow : false,
								removable:true,  //设置弹出窗口是否可拖动
								deletable:true	  //设置是否显示弹出窗口的关闭按钮
							});
							/*locoPopuWnd.remove = locoPopuWnd.close;
							locoPopuWnd.close = locoPopuWnd.hidden;*/
						
						locoPopuWnd.init();
						/*RTU.invoke("app.devicequalitytrack.initinput");
						RTU.invoke("app.devicequalitytrack.inituploadify");	*/		
						RTU.invoke("app.devicequalitytrack.allocation.initselect");
					}
				});
			});
		};
		return function(data){
     		var url="devicequalitytrack/findIndexSumInfo";
             var param={
                     url: url,
                     success: function (resData) {
                     	if(resData&&resData.success){
                     		var successData=resData.data;
                     		$("#locoRunCount").text(successData.totalLocoCount);
                     		$("#locoRunHour").text(successData.totalRunHours);
                     		$("#locoRunMile").text(successData.totalRunMiles);
                     		var bureaList=successData.bureaInfoVoList;
                     		$(".rightMainDiv,.rightBottomDiv","#deviceQualityRDiv").remove();
                     		for(var i=0;i<bureaList.length;i++){
                     			var deviceQualityLocoList=bureaList[i].deviceQualityLocoList;
                     			var bName=bureaList[i].bname.replace("铁路局","").replace("铁路公司","");
                     			var appendStr="<div class='rigthTopDiv rightMainDiv'>" +
                     			"<div class='rightMainLeftDiv'>"+bName+"(<span>"+deviceQualityLocoList.length+"</span>台)</div>" +
                     			"<div class='rightMainRightDiv'><div style='text-align:left;margin-top:10px;width:100%'>" +
                     			"<div style='width:100%'>";
                     			/*$("#deviceQualityRDiv").append();*/
                     			var locoNameStr="";
                     			for(var j=0;j<deviceQualityLocoList.length;j++){
                     				appendStr+="<img recId='"+deviceQualityLocoList[j].recId+"' locoTypeid='"
                     				+deviceQualityLocoList[j].locoTypeid
                     				+"' locoNo='"+deviceQualityLocoList[j].locoNo
                     				+"' locoAb='"+deviceQualityLocoList[j].locoAb
                     				+"' isAlarm="+deviceQualityLocoList[j].alarm
                     				+" handledFaultCount="+deviceQualityLocoList[j].handledFaultCount
                     				+" recFaultCount="+deviceQualityLocoList[j].recFaultCount
                     				+" totalRunMiles="+deviceQualityLocoList[j].totalRunMiles+
                     				" totalRunHours="+deviceQualityLocoList[j].totalRunHours+" id='"
                     				+deviceQualityLocoList[j].locoName+"' class='trainImg' " +
                     				"src='../static/img/app/failureWarnning-images/"
                     				+(deviceQualityLocoList[j].alarm?"train-alarm.png":"train-online.png")+"' alt='未找到图片'/>";
                     				locoNameStr+="<div class='rightMainTextDiv'>"+deviceQualityLocoList[j].locoName+"</div>";
                     			}
                     			appendStr=appendStr+"</div>"+locoNameStr+"</div></div></div>";
                     			$("#deviceQualityRDiv").append($(appendStr));
                     		}
                     		$(".rightMainDiv","#deviceQualityRDiv").height((bureaList.length>4?15:60/bureaList.length)+"%");
                     		$("#deviceQualityRDiv").append("<div class='rightBottomDiv'>" +
                     				"<img src='../static/img/app/add.png' alt='未找到图片'></div>");
                     		initMouseEvent();
                     	}
                     },
                     error: function (e) {
                     	alert(e);
                     }
                   };
             RTU.invoke("core.router.get", param);
             initLeftMenuClickEvent();
		};
	});

	  //查找所有的铁路局
    RTU.register("app.devicequalitytrack.allocation.initselect",function(){
    	return function(){
    		var url="bureau/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.devicequalitytrack.allocation.setBureau",data.data);
                  },
                  error: function () {
                  }
				};
			    RTU.invoke("core.router.get", param);
			   
			    var url1="traintype/findAll";
	    	    var param1={
		              url: url1,
		              cache: false,
	                  asnyc: true,
	                  datatype: "json",
	                  success: function (data) {
	                	  if(data&&data.data){
	                		var locoTypeHtml="<option value='' selected='selected' class='selectOptionCss'></option>";
	                  		$.each(data.data, function (i, item) {
	                  			locoTypeHtml=locoTypeHtml+"<option value="+item.tTypeId+" class='selectOptionCss'>"+item.shortname+"</option>";
	                          });
	                  		$("#locoTypeSel").html(locoTypeHtml);
	                	  }
	                  },
	                  error: function () {
	                  }
					};
				 RTU.invoke("core.router.get", param1);
				 
				 $("#locoAddReset").unbind("click").bind("click",function(){
					$("#locoAddDiv select").empty();
					$("#locoAddDiv input,textarea").val("");
				 });
				 
				 $("#locoAddReset").unbind("click").bind("click",function(){
						$("#locoAddDiv select").empty();
						$("#locoAddDiv input,textarea").val("");
				 });
				 
				 $("#locoAddSave").unbind("click").bind("click",function(){
					 	var pData = {};
			            pData.deptId = $("#locoDepotSel").val();
			            pData.locoAb = $("#locoAbSel").val();
			            pData.locoTypeid = $("#locoTypeSel").val();
			            pData.locoNo = $("#locoNoTxt").val();
			            pData.note = $("#noteTxt").val();
			            pData.packDate =  $("#packDateTxt").val();
			            pData.recId =  $("#locoRecId").val();
			            if (RTU.utils.string.isBank(pData.deptId)) {
			                RTU.invoke("header.notice.show", "请选择所属段");
			                RTU.utils.input.focusin($("#locoDepotSel"));
			                return false;
			            } 
			            if (RTU.utils.string.isBank(pData.locoTypeid)) {
			                RTU.invoke("header.notice.show", "请选择所属段");
			                RTU.utils.input.focusin($("#locoTypeSel"));
			                return false;
			            }
			            else {
			                RTU.utils.input.focusout($("#locoTypeSel"));
			            }
			        	if (isNaN(pData.locoNo)||pData.locoNo.length!=4) {
			                RTU.invoke("header.notice.show", "车号必须为4位数字");
			                RTU.utils.input.focusin($("#locoNoTxt"));
			                return false;
			            } else {
			                RTU.utils.input.focusout($("#locoNoTxt"));
			            }

						RTU.invoke("core.router.get", {
					              url: "/devicequalitytrack/saveLoco",
					              data:pData,
					              cache: false,
				                  asnyc: true,
				                  success: function (data) {
				                	  if(data&&data.success){
				                		  RTU.invoke("header.notice.show", "保存成功");
				                		  RTU.invoke("app.devicequalitytrack.query.activate");
				                	  }
				                	  else RTU.invoke("header.notice.show", "保存失败");
				                  },
				                  error: function () {
				                  }
						});
				 });
    	};
    });
    //设置局的下拉
    RTU.register("app.devicequalitytrack.allocation.setBureau",function(){
    	return function(data){
    		var bureauHtml="<option value='' selected='selected' class='selectOptionCss'></option>";
    		$.each(data, function (i, item) {
				bureauHtml=bureauHtml+"<option value="+item.bId+" class='selectOptionCss'>"+item.bName+"</option>";
            });
    		$("#locoBureauSel").html(bureauHtml);
    		$("#locoBureauSel").unbind("change").bind("change",function(){
    			if($("#locoBureauSel").val()=="")$("#locoDepotSel").html("");
    			else
    			RTU.invoke("app.devicequalitytrack.allocation.searchDepot",$("#locoBureauSel option:selected").html());
    		});
    	};
    });
    //根据局来查找段
    RTU.register("app.devicequalitytrack.allocation.searchDepot",function(){
    	return function(data){
    		var url="depot/searchDepotByBureau";
    		var param={
	              url: url,
	              data:{
	                  "bureau":data,
	              },
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.devicequalitytrack.allocation.setDepot",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });  
    //设置段的下拉
    RTU.register("app.devicequalitytrack.allocation.setDepot",function(){
    	return function(data){
    		var depotHtml="<option value='' selected='selected' class='selectOptionCss'></option>";
    		$.each(data, function (i, item) {
    			depotHtml=depotHtml+"<option value="+item.dId+" class='selectOptionCss'>"+item.dName+"</option>";
            });
    		$("#locoDepotSel").html(depotHtml);
    	};
    });
	
	RTU.register("app.devicequalitytrack.query.init", function() {
		data = RTU.invoke("app.setting.data", "devicequalitytrack");
		if (data && data.isActive) {
			RTU.invoke("app.devicequalitytrack.query.activate");  
		}		
		return function() {
			return true;
		};
	}); 
});
