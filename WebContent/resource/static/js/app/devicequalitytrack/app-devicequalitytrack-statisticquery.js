RTU.DEFINE(function(require, exports) {
/**
 * 模块名：设备质量追踪查询统计
 * name：equipmentqualitytrack
 * date:2015-12-04
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
    
    var $statisticHtml;
	var statPopuwnd;
	var trainislateStatGrid;
	
	RTU.register("app.devicequalitytrack.statisticquery.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-statisticquery.html",
			success:function(html){
				$statisticHtml = $(html);
				if(statPopuwnd){
					statPopuwnd.html($statisticHtml);
				}
				RTU.invoke("app.devicequalitytrack.statisticquery.create");	
			}
		});
		return function() {
			return true;
		};
	});
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.documentElement.clientWidth * 0.85-135;
		Resolution.Theight=document.documentElement.clientHeight * 0.85-60;
		return Resolution;
	};
	RTU.register("app.devicequalitytrack.statisticquery.activate", function() { //使得statPopuwnd对象活动
		return function() {
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth;
			Theight=Resolution.Theight;
			if (!statPopuwnd) {
				statPopuwnd = new PopuWnd({
					title : "查询统计",
					html : $statisticHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : true,
					removable:false,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				statPopuwnd.remove = statPopuwnd.close;
				statPopuwnd.close = statPopuwnd.hidden;
				statPopuwnd.init();
			} else {
				statPopuwnd.init();
			}
			RTU.invoke("app.devicequalitytrack.statisticquery.initinput");
		};
	});
	RTU.register("app.devicequalitytrack.statisticquery.deactivate", function() { //隐藏
		return function() {
			if (statPopuwnd) {
				statPopuwnd.close();
			}
		};
	});

	RTU.register("app.devicequalitytrack.statisticquery.initinput",function(){
        var initSumQuery=function(){
        	$(".feedbackSum",".sumDiv").unbind("click").bind("click",function(){
            	sumQuery(getSumQueryInput());
            });
        };
        var initExportToExcel_Sum=function(){
        	$(".feebackExcel_Sum",".sumDiv").unbind("click").bind("click",function(){
        		if(window.confirm("确认要导出到excel吗?")){
        			var data=getSumQueryInput();
    	     		window.location.href = "../lkj15feedback/exportToExcel_Sum?fdate="+data.fdate
        			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&deviceId="+data.deviceId
        			+"&faultType="+data.faultType+"&recUser="+data.recUser+"&date="+new Date();
    	     	}
            });
        };
        var getSumQueryInput = function () {
            var pData = {};
            pData.fdate = $(".trainisFirst_time",".sumTab_Query").val();
            pData.tdate = $(".trainisFinish_time",".sumTab_Query").val();
            pData.recUser = $(".recUserInput",".sumTab_Query").val();
            pData.locoName = $(".trainislate_loco",".sumTab_Query").val();
            pData.deviceId=$("#statDeviceIdSel",".sumTab_Query").val();
            pData.faultType=$("#statFaultTypeSel",".sumTab_Query").val();
            return pData;
        };
        
        var sumQuery=function(data){
       		var Resolution=getResolution();
       		Twitdh=Resolution.Twidth;
			Theight=Resolution.Theight;
			var topFieldSet=$("#faultStatTopFieldSet").height();
			trainislateStatGrid = new RTGrid({
   			url:"../lkj15feedback/searchSumInfoByProperty?fdate="+data.fdate
   			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&deviceId="+data.deviceId+"&faultType="+data.faultType+
			"&recUser="+data.recUser+"&date="+new Date(),
               containDivId: "devicequalitytrack-statquery-grid",
               tableWidth: Twitdh-30,
               tableHeight: Theight-topFieldSet-60,
               isSort: true, //是否排序
               hasCheckBox: false,
               showTrNum: true,
               isShowPagerControl: false,
               isShowRefreshControl:false,
               beforeLoad:function(that){
   				that.pageSize =30;
   			},
            loadPageCp: function (t) {
               	 t.cDiv.css("left", "200px");
                 t.cDiv.css("top", "200px");
            },
            clickTrEvent: function (t) {},
            
               colNames: ["机车","所属局","故障类型","设备名称","故障次数"],
               colModel: [{ name: "locoName" }, { name: "bName"},
                          { name: "faultName"}, { name: "deviceName"},{ name: "faultCount"}]
        });
   		$(".RTTable_Head tr td:first",$("#devicequalitytrack-statquery-grid")).html("序号");
   		trainislateStatGrid.init();
   		$("#faultStatFieldSet").height(Theight-topFieldSet-40);
        };
        
        var initStatisticSel=function(){
        	$("select option[value!='']",".sumDiv").remove();
        	var url="devicequalitytrack/searchAllFaultType";
            var param={
                    url: url,
                    success: function (data) {
                    	if(data.success&&data.data&&data.data.length>0){
                    		for(var i=0;i<data.data.length;i++){
                    			$("#statFaultTypeSel",".sumDiv")
                    			.append("<option value="+data.data[i].id+">"+data.data[i].text+"</option>");
                    		}
                    	}
                    },
                    error: function (e) {
                    	alert(e);
                    }
                  };
            RTU.invoke("core.router.get", param);
            
            var url1="devicequalitytrack/searchAllDevice";
            var param1={
                    url: url1,
                    success: function (data) {
                    	if(data.success&&data.data&&data.data.length>0){
                    		for(var i=0;i<data.data.length;i++){
                    			$("#statDeviceIdSel",".sumDiv")
                    			.append("<option value="+data.data[i].id+">"+data.data[i].text+"</option>");
                    		}
                    	}
                    },
                    error: function (e) {
                    	alert(e);
                    }
                  };
            RTU.invoke("core.router.get", param1);
	 	};
        return function () {
            initSumQuery();
            initExportToExcel_Sum();
            initStatisticSel();
            $(".feedbackSum",".sumDiv").click();
        };
	});
});
