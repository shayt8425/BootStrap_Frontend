RTU.DEFINE(function(require, exports) {
/**
 * 模块名：设备质量追踪机车管理
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
    
    var $locoQueryHtml;
	var popuwnd_locoquery;
	var locoData;
	var trainislateLocoQueryGrid;
	
	RTU.register("app.devicequalitytrack.locoquery.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-locoquery.html",
			success:function(html){
				$locoQueryHtml = $(html);
				if(popuwnd_locoquery){
					popuwnd_locoquery.html($locoQueryHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.locoquery.activate", function() { //使得popuwnd对象活动
		return function() {
			
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			Twitdh=Resolution.Twitdh;
			Theight=Resolution.Theight;
			
			if (!popuwnd_locoquery) {
				popuwnd_locoquery = new PopuWnd({
					title : "机车查询",
					html : $locoQueryHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_locoquery.remove = popuwnd_locoquery.close;
				popuwnd_locoquery.close = popuwnd_locoquery.hidden;
				popuwnd_locoquery.init();
			} else {
				popuwnd_locoquery.init();
			}	
			
			RTU.invoke("app.devicequalitytrack.locoquery.initinput");

		};
	});

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twitdh=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twitdh=document.documentElement.clientWidth * 0.85-140;
		Resolution.Theight=document.documentElement.clientHeight * 0.85-60;
		/*Resolution.Twitdh=document.documentElement.clientWidth ;
		Resolution.Theight=document.documentElement.clientHeight;*/
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.locoquery.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_locoquery) {
				popuwnd_locoquery.close();
			}
		};
	});		

	RTU.register("app.devicequalitytrack.locoquery.initinput",function(){            
        //查询数据
        var locoQuery = function (data) {
        	var Resolution=getResolution();        	
			/*Twitdh=Resolution.Twitdh-200;
			Theight=Resolution.Theight-520;*/
        	Twitdh=Resolution.Twitdh*0.95;
			Theight=Resolution.Theight-$("#locoquery_topFieldSet").height()-50;
			$("#devicequalitytrack-locoquery-grid").empty();
		    trainislateLocoQueryGrid = new RTGrid({
    			url:"../devicequalitytrack/searchLocosByProperty?locoName="+data.locoName+"&date="+new Date(),
                containDivId: "devicequalitytrack-locoquery-grid",
                tableWidth: Twitdh,
                tableHeight: Theight-20,
                isSort: false, //是否排序
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
                replaceTd:[
          				{index: 5, fn: function (data,j,ctd,itemData) {
       						return data!=0?(data==1?"A节":"B节"):"无";
       					}},
       					{index: 7, fn: function (data,j,ctd,itemData) {
       						return "<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.locoquery.deleterecord'" 
       						+","+itemData.recId+")\">删除</a>";
       					}}],
                colNames: ["所属铁路局","所属段","机车","车型","车号","AB节","装车日期","操作"],
                colModel: [{ name: "bName"},{name:"dshortname"},{name:"loconame"}
                			,{name:"locoTypename"},{name:"locoNo"},{name:"locoAb"},{name:"packDate"},{name:"recId"}]
            });
    		$(".RTTable_Head tr td:first",$("#devicequalitytrack-locoquery-grid")).html("序号");
    		trainislateLocoQueryGrid.init();
    		$("#locoQueryFieldSet").height(Theight);
        };
        
        var getlocoQueryInput = function () {
            var pData = {};
            pData.locoName = $(".trainislate_loco",".locoQueryTab").val();
            return pData;
        }; 
        //初始化查询按钮
        var initlocoQuery=function(){
        	$(".locoQueryBtn",".locoQueryTab").unbind("click").bind("click",function(){
        		locoQuery(getlocoQueryInput());
            });
        };
        var initExportLocosToExcel=function(){
        	$(".excelQuery",".devQua_locoQueryDiv").unbind("click").bind("click",function(){
        		if(window.confirm("确认要导出到excel吗?")){
        			var data=getlocoQueryInput();
    	     		window.location.href = "../devicequalitytrack/exportLocosToExcel?locoName="
    	     			+data.locoName+"&date="+new Date();
    	     	}
            });
        };
        return function () {
            initlocoQuery();//查询按钮初始化
            initExportLocosToExcel();//导出到excel初始化
            $(".locoQueryBtn",".locoQueryTab").click();
        };
        
	});

	RTU.register("app.devicequalitytrack.locoquery.deleterecord", function() {
		return function(data) {
			if(window.confirm("确认要删除该机车?")){
	     		var url="devicequalitytrack/deleteLoco?recId="+data;
	             var param={
	                     url: url,
	                     success: function (data) {
	                     	if(data.success){
	                     		/*$(".feedbackReset","#operDiv").click();*/
	                     		RTU.invoke("header.notice.show", "删除成功");
		                		RTU.invoke("app.devicequalitytrack.query.create");
	                     		$(".locoQueryBtn",".locoQueryTab").click();
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
