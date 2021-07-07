RTU.DEFINE(function (require, exports) {
/**
 * 模块名：电子围栏--result
 * name：electronrail
 * date:2015-2-12
 * version:1.0 
 */
	var electronPoint;
    var timerList;
    //初始化弹出界面
	RTU.register("app.electronrail.details.init",function(){
		return function(data){
			RTU.invoke("app.electronrail.details.initBtn",data);//初始化按钮
			RTU.invoke("app.electronrail.details.initData",data);//初始化数据
			RTU.invoke("app.electronrail.details.create");//初始化线路input
		};
	});
	//初始化按钮
	RTU.register("app.electronrail.details.initBtn",function(){
		return function(data){
			$("#electronrail-detail-editDiv-tab-button1").attr("tabId",data.tabId);
			//初始化修改按钮
			$("#"+data.tabId+" #electronrail-detail-showDiv-tab-button1").unbind("click").click(function(){
				$("#"+data.tabId+" .electronrail-detail-editDiv").removeClass("hidden");
				$("#"+data.tabId+" .electronrail-detail-showDiv").addClass("hidden");
				
			});
			//初始化保存按钮
			$("#"+data.tabId+" #electronrail-detail-editDiv-tab-button1").unbind("click").click(function(){
				RTU.invoke("app.electronrail.details.updateDate",$(this).attr("tabId"));
			});
			//判断是否是从tab页的修改按钮跳转进来，如果是，则触发当前页面修改按钮事件，使页面处于可修改界面
			if(data.isUpdate){
				$("#"+data.tabId+" .electronrail-detail-editDiv").removeClass("hidden");
				$("#"+data.tabId+" .electronrail-detail-showDiv").addClass("hidden");
//				$("#"+data.tabId+" #electronrail-detail-showDiv-tab-button1").click();
			}
		};
	});
	
	//初始化弹出界面数据
	RTU.register("app.electronrail.details.initData",function(){
		return function(obj){
			var data=obj.Point.obj.pointData;
			var tabId=obj.tabId;
			if(data.type==1){
				$("#" + tabId +" #electronrail-detail-showDiv-tab-limitSpeed").text(data.limitSpeed||"");
				$("#" + tabId +" #electronrail-detail-editDiv-tab-limitSpeed").val(data.limitSpeed||"");
			}else{
				$("#" + tabId +" #electronrail-detail-showDiv-tab-timeType").text(data.limitTime==1?"临时":"永久"||"");
				$("#" + tabId +" #electronrail-detail-editDiv-timeType").val(data.limitTime);
				
			}
			$("#" + tabId +" #electronrail-detail-showDiv-tab-lineName").text(data.lineName);
			$("#" + tabId +" #electronrail-detail-showDiv-tab-lineName").attr("lineNo",data.lineNo);
			$("#" + tabId +" #electronrail-detail-showDiv-tab-beginkiloSign").text(data.beginKiloSign);
			$("#" + tabId +" #electronrail-detail-showDiv-tab-endkiloSign").text(data.endKiloSign);
			$("#" + tabId +" #electronrail-detail-showDiv-tab-beginTime").text(window.formatDate(data.beginDate));
			$("#" + tabId +" #electronrail-detail-showDiv-tab-endTime").text(window.formatDate(data.endDate));
			
			$("#" + tabId +" input[name='electronrail-detail-showDiv-tab-upDown1']").each(function(){
	            if($(this).val()==data.upDown){
	                $(this).attr("checked",true);
	            }
	        });
			
			$("#" + tabId +" #electronrail-detail-editDiv-tab-lineName").val(data.lineName);
			$("#" + tabId +" #electronrail-detail-editDiv-tab-lineName").attr("lineNo",data.lineNo);
			$("#" + tabId +" #electronrail-detail-editDiv-tab-beginkiloSign").val(data.beginKiloSign);
			$("#" + tabId +" #electronrail-detail-editDiv-tab-endkiloSign").val(data.endKiloSign);
			$("#" + tabId +" #electronrail-detail-editDiv-tab-beginTime").val(window.formatDate(data.beginDate));
			$("#" + tabId +" #electronrail-detail-editDiv-tab-endTime").val(window.formatDate(data.endDate));
			
			$("#" + tabId +" input[name='electronrail-detail-editDiv-tab-upDown2']").each(function(){
				if($(this).val()==data.upDown){
					$(this).attr("checked",true);
				}
			});
			$("#" + tabId +" .electronrail-detail-title").attr("pointId",data.id.split("-")[1]);
			$("#" + tabId +" .electronrail-detail-title").attr("type",data.type);
			
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
	            }, 500);
	        };
	    });
	    
	 //得到输入框数据
	 function getParams(obj){
		 var tabId=obj;
		 var param={};
		 
		 param.id=$("#" + tabId +" .electronrail-detail-title").attr("pointId");
		 param.type=$("#" + tabId +" .electronrail-detail-title").attr("type");
		 param.limitSpeed=($("#" + tabId +" #electronrail-detail-editDiv-tab-limitSpeed").val()||"");
		 param.limitTime=($("#" + tabId +" #electronrail-detail-editDiv-timeType").val()||"");
			
		 param.lineNo=$("#" + tabId +" #electronrail-detail-editDiv-tab-lineName").attr("lineNo");
		 param.beginKiloSign=$("#" + tabId +" #electronrail-detail-editDiv-tab-beginkiloSign").val();
		 param.endKiloSign=$("#" + tabId +" #electronrail-detail-editDiv-tab-endkiloSign").val();
		 param.beginDate=$("#" + tabId +" #electronrail-detail-editDiv-tab-beginTime").val();
		 param.endDate=$("#" + tabId +" #electronrail-detail-editDiv-tab-endTime").val();
			
		 $("#" + tabId +" input[name='electronrail-detail-editDiv-tab-upDown2']").each(function(){
			 if($(this).attr("checked")=="checked"){
				param.upDown=$(this).val();
			}
		 });
		 
		  if((param.limitSpeed==""&&param.limitTime=="")){
			  RTU.invoke("header.alarmMsg.show","请输入限速值或时间范围");
			  return false;
		  }else if(param.beginKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入开始里程");
			  return false;
		  }else if(param.endKiloSign==""){
			  RTU.invoke("header.alarmMsg.show","请输入结束里程");
			  return false;
		  }else if(param.lineNo==""){
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
	 
	 //修改数据
	 RTU.register("app.electronrail.details.updateDate",function(){
		 return function(data){
			 RTU.invoke("header.msg.show", "保存中,请稍后!!!");
			 var newData=getParams(data);
			 var url="electronic/updateElectronrail?id="+newData.id+"&lineNo="+newData.lineNo+"&upDown="+newData.upDown+"&limitTime="+newData.limitTime+"&beginKiloSign="+newData.beginKiloSign+"&limitSpeed="+newData.limitSpeed+
			         "&endKiloSign="+newData.endKiloSign+"&beginDate="+newData.beginDate+"&endDate="+newData.endDate+"";
			 var param={
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "jsonp",
                   success: function (data) {
                	   var sendData={
                			   id:data.data
                	   };
                     RTU.invoke("app.electronrail.query.addMarker",sendData);
                	   RTU.invoke("header.notice.show", "修改成功。。");
                	   RTU.invoke("header.msg.hidden");
                       staticSaveData("ElectronicVersion", "1");
                       RTU.invoke("map.railWayElectronicfence", {});
                   },
                   error: function () {
                   }
                 };
                RTU.invoke("core.router.get", param);                
		 };
	 });
	 
	 //查找某一个电子围栏数据
	  function searchOne(id){
		  var searchData=null;
		  $.ajax({
	          url: "../electronic/findById?id="+id,
	          type: "get",
	          async: false,
	          success: function (data) {
	              var data = $.parseJSON(data);
	              if (data.data) {
	            	  if(data.data){
	            		  searchData=jQuery.extend(true, {}, data.data);
	            	  }
	              };
	          }
	      });
		  return searchData;
	  }
	 
	 //清空地图上电子围栏标注，并添加新的标注
	 var $status;
	  RTU.register("app.electronrail.query.addMarker",function(){
		  return function(data){
			if(!data.isupdate){//判断是否是tab页按钮跳转进来，如果是，则直接触发使详情界面弹出
				 if(electronPoint){
					 RTU.invoke("map.marker.removeMarker",electronPoint);
				 }
				 var searchData=searchOne(data.id);
				 if(searchData&&searchData!=null){
					 if(searchData.type=="1"){//区分点击弹出的界面
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfence/app-electrionicfence-detail.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }else{
						 RTU.invoke("core.router.load", {
							 url: "../app/modules/electronicfence/app-electrionicfence-detail1.html",
							 async: false,
							 success: function (status) {
								 $status = $(status);
							 }
						 });
					 }
						
					   searchData.id="electronicfence-"+searchData.id;
				 		electronPoint= RTU.invoke("map.marker.addMarker", {
							 isSetCenter: true,
							 pointType: searchData.type==1?"rlimitPoint":"WfloodPoint",
							 TIPSID: "id",
							 iconWidth: searchData.type==1?"30":"28", //点的 宽度
						     iconHeight: searchData.type==1?"30":"25", //点的高度
						     iconLeft:-13,
						     iconTop:-9,
							 isDefaultRightTab: true,
							 setDataSeft: false,
							 tabHtml: $status.html(),
							 pointData: searchData,
							 tabWidth: 270, //tab 宽度
							 tabHeight: 310, //tab 的高度
							 initFn: function (obj) {
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
					                    $(objId).hide();
									 });
								 },30);
								 
							 },
							 rightHand:function(obj){}
				 		});
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
						 Point:electronPoint,
						 tabId:electronPoint.obj.tabId,
						 isUpdate:true
				 }
				 setTimeout(function(){
					 var objId= $("#" + electronPoint.obj.tabId);
					 $(" .closediv", $(objId)).click(function () {
		                    $(objId).hide();
		             });
				 },30);
				 RTU.invoke("app.electronrail.details.init",obj);
			}
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
