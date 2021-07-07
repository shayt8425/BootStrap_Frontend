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
    require("../../../css/app/locomotivefeedback/feedbackquery.css");
    require("app/devicequalitytrack/app-devicequalitytrack-faultlog.js");//故障上报
    
    var $logQueryHtml;
	var popuwnd_logquery;
	var logData;
	var trainislateLogQueryGrid;
	
	RTU.register("app.devicequalitytrack.logquery.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-logquery.html",
			success:function(html){
				$logQueryHtml = $(html);
				if(popuwnd_logquery){
					popuwnd_logquery.html($logQueryHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.logquery.activate", function() { //使得popuwnd对象活动
		return function(locoData) {
			
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
			
			if (!popuwnd_logquery) {
				popuwnd_logquery = new PopuWnd({
					title : "添乘管理",
					html : $logQueryHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_logquery.remove = popuwnd_logquery.close;
				popuwnd_logquery.close = popuwnd_logquery.hidden;
				popuwnd_logquery.init();
			} else {
				popuwnd_logquery.init();
			}	
			RTU.invoke("app.devicequalitytrack.logquery.initinput",locoData);

		};
	});

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		/*Resolution.Twidth=document.documentElement.clientWidth * 0.85;
		Resolution.Theight=document.documentElement.clientHeight * 0.85;*/
		Resolution.Twidth=document.documentElement.clientWidth ;
		Resolution.Theight=document.documentElement.clientHeight;
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.logquery.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_logquery) {
				popuwnd_logquery.close();
			}
		};
	});
		
	RTU.register("app.devicequalitytrack.logquery.downloadfile", function() {
		return function(data) {
			if(!data)return;
	     	if(window.confirm("确认要下载附件吗?")){
	     		window.location.href = "../devicequalitytrack/downloadFile?fileName=" + data;
	     	}
		};
	});



	RTU.register("app.devicequalitytrack.logquery.initinput",function(){            
        //查询数据
        var logQuery = function (data) {
        	var Resolution=getResolution();        	
			/*Twitdh=Resolution.Twidth-200;
			Theight=Resolution.Theight-520;*/
        	Twitdh=Resolution.Twidth-150;
			Theight=Resolution.Theight-60;	
    	    trainislateLogQueryGrid = new RTGrid({
    			url:"../devicequalitytrack/searchLogsByProperty?fdate="+data.fdate
    			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&recUser="+data.recUser
    			+"&date="+new Date(),
                containDivId: "devicequalitytrack-logquery-grid",
                tableWidth: Twitdh-10,
                tableHeight: Theight*0.8,
                isSort: false, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize =30;
    			},
                loadPageCp: function (t) {
                	 t.cDiv.css("left", "200px");
                     t.cDiv.css("top", "200px");
                },
                clickTrEvent: function (t) {},
                replaceTd:[
          				{index: 9, fn: function (data,j,ctd,itemData) {
           						return data==0?"正常":"故障";
           						
           				}},       					
       					{index: 10, fn: function (data,j,ctd,itemData) {
       						if(data&&data.length>10){
       							return "<label title='"+data+"'>"+data.substring(0,5)+"...</label>";
       						}
       						else return data;
       						
       					}},
       					{index: 11, fn: function (data,j,ctd,itemData) {
       						if(data&&data.length>0){
       							var str="";
       							for(var i=0;i<data.length;i++){
       								if(i<data.length-1){
       									str +="<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.logquery.downloadfile'" +
        								",'"+data[i]+"')\">"+data[i]+"</a>&nbsp;&nbsp;";	
       								}
       								else str +="<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.logquery.downloadfile'" +
    								",'"+data[i]+"')\">"+data[i]+"</a>";	
       							}
       							return str;
       						}
       						else return "";
       						
       					}},
       					{index: 12, fn: function (data,j,ctd,itemData) {
       						var str="";
       						if(itemData.runState==1){
       							/*var locoData={};
       							locoData.locoTypeid=itemData.locoTypeid;
       							locoData.locoNo=itemData.locoNo;
       							locoData.locoAb=itemData.locoAb;
       							locoData.logId=data;*/
       							str="<a href='#' locoName='"+itemData.loconame+"' locoTypeid='"+itemData.locoTypeid+"' locoNo='"+itemData.locoNo
       							+"' locoAb='"+itemData.locoAb+"' logId='"+data+"' id='"+itemData.logId+"Href' " +
       									"onclick=\"javascript:RTU.invoke('app.devicequalitytrack.faultlog.faultlogaddfn','"
       							+itemData.logId+"Href')\">问题上报</a>&nbsp;&nbsp;";	
       						}
       						return str+"<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.logquery.deleterecord'" +
								","+itemData.logId+")\">删除</a>";
       						
       					}}],
                colNames: ["机车","局段","里程","开车日期","到达日期","起始站","终到站","主机版本","数据版本","运行状态","运行情况","运行文件","操作"],
                colModel: [{ name: "loconame" }, { name: "dshortname"},
                           { name: "mileage"}, { name: "startDate",width:Twitdh*0.15},{ name: "arriveDate",width:Twitdh*0.15},
                           { name: "startStation"},{name:"endStation"},{name:"procVer"},{name:"dataVer"},{name:"runState"}
                           ,{name:"note",width:Twitdh*0.1},{name:"upfileName",width:Twitdh*0.1},{name:"logId",width:Twitdh*0.1}]
            });
    		$(".RTTable_Head tr td:first",$("#devicequalitytrack-logquery-grid")).html("序号");
    		trainislateLogQueryGrid.init();
    		$("#logQueryFieldSet").height(Theight*0.85);
        };
        
        var getLogQueryInput = function () {
            var pData = {};
            pData.fdate = $(".trainisFirst_time",".logQueryTab").val();
            pData.tdate = $(".trainisFinish_time",".logQueryTab").val();
            pData.recUser = $(".recUserInput",".logQueryTab").val();
            pData.locoName = $(".trainislate_loco",".logQueryTab").val();
            return pData;
        }; 
        //初始化查询按钮
        var initLogQuery=function(){
        	$(".feedbackQuery",".logQueryTab").unbind("click").bind("click",function(){
            	logQuery(getLogQueryInput());
            });
        };
        var initExportLogsToExcel=function(){
        	$(".excelQuery",".logQueryDiv").unbind("click").bind("click",function(){
        		if(window.confirm("确认要导出到excel吗?")){
        			var data=getLogQueryInput();
    	     		window.location.href = "../devicequalitytrack/exportLogsToExcel?fdate="+data.fdate
        			+"&tdate="+data.tdate+"&locoName="+data.locoName
        			+"&recUser="+data.recUser+"&date="+new Date();
    	     	}
            });
        };
        return function (data) {
            initLogQuery();//查询按钮初始化
            initExportLogsToExcel();//导出到excel初始化
            $(".feedbackQuery",".logQueryTab").click();
        };
        
	});

	RTU.register("app.devicequalitytrack.logquery.deleterecord", function() {
		return function(data) {
			if(window.confirm("确认要删除该上报日志?")){
	     		var url="devicequalitytrack/deleteLog?logId="+data;
	             var param={
	                     url: url,
	                     success: function (data) {
	                     	if(data.success){
	                     		/*$(".feedbackReset","#operDiv").click();*/
	                     		$(".feedbackQuery",".logQueryTab").click();
	                     	}
	                     },
	                     error: function (e) {
	                     	alert(e);
	                     }
	                   };
	             RTU.invoke("core.router.get", param);
	     	}
		};
	});
	
	
});
