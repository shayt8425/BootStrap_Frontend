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

    
    var $faultLogQueryHtml;
	var popuwnd_faultlogquery;
	var faultLogQueryData;
	var trainislateFaultLogQueryGrid;
	
	RTU.register("app.devicequalitytrack.faultlogquery.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-faultlogquery.html",
			success:function(html){
				$faultLogQueryHtml = $(html);
				if(popuwnd_faultlogquery){
					popuwnd_faultlogquery.html($faultLogQueryHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.faultlogquery.activate", function() { //使得popuwnd对象活动
		return function(locoData) {
			
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
			
			if (!popuwnd_faultlogquery) {
				popuwnd_faultlogquery = new PopuWnd({
					title : "问题管理",
					html : $faultLogQueryHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_faultlogquery.remove = popuwnd_faultlogquery.close;
				popuwnd_faultlogquery.close = popuwnd_faultlogquery.hidden;
				popuwnd_faultlogquery.init();
			} else {
				popuwnd_faultlogquery.init();
			}
			$("#fautLogQuery_fieldSet2").height(Theight*0.3);
			$("#fautLogQuery_fieldSet4").height(Theight-80-$("#fautLogQuery_fieldSet2").height()
					-$("#fautLogQuery_fieldSet1").height()-$("#fautLogQuery_fieldSet3").height());
			
			RTU.invoke("app.devicequalitytrack.faultlogquery.initinput",locoData);

		};
	});

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twidth=document.documentElement.clientWidth *0.7;
		Resolution.Theight=document.documentElement.clientHeight;
		/*Resolution.Twidth=document.documentElement.clientWidth ;
		Resolution.Theight=document.documentElement.clientHeight;*/
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.faultlogquery.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_faultlogquery) {
				popuwnd_faultlogquery.close();
			}
		};
	});
		
	RTU.register("app.devicequalitytrack.faultlogquery.downloadfile", function() {
		return function(data) {
			if(!data)return;
	     	if(window.confirm("确认要下载附件吗?")){
	     		window.location.href = "../devicequalitytrack/downloadFile?fileName=" + data;
	     	}
		};
	});


	RTU.register("app.devicequalitytrack.faultlogquery.initinput",function(){            
        //查询数据
        var faultLogQuery = function (data) {
        	var Resolution=getResolution();        	
			/*Twitdh=Resolution.Twidth-200;
			Theight=Resolution.Theight-520;*/
        	Twitdh=Resolution.Twidth-150;
			Theight=Resolution.Theight-60;	
    	    trainislateFaultLogQueryGrid = new RTGrid({
    			url:"../devicequalitytrack/searchFaultLogsByProperty?fdate="+data.fdate
    			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&recUser="+data.recUser+"&faultType="
    			+data.faultType+"&deviceId="+data.deviceId+"&date="+new Date(),
                containDivId: "devicequalitytrack-faultlogquery-bodyDiv-body-grid",
                tableWidth: Twitdh-10,
                tableHeight: Theight*0.25,
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
                clickTrEvent: function (t) {
                	var thisData = trainislateFaultLogQueryGrid.currClickItem().data;
                	$(".note",".faultLogNoteTab").val(thisData.faultNote);
                	if(currClickTrId==thisData.faultId)return;
                	currClickTrId=thisData.faultId;
                	initFeedBackTextArea(currClickTrId);
                },
                replaceTd:[	
          					{index: 5, fn: function (data,j,ctd,itemData) {
          						if(data&&data.length>10){
          							return "<label title='"+data+"'>"+data.substring(0,5)+"...</label>";
          						}
          						else return data;
          						
          					}},
          					{index: 6, fn: function (data,j,ctd,itemData) {
           						if(data&&data.length>0){
           							var str="";
           							for(var i=0;i<data.length;i++){
           								if(i<data.length-1){
           									str +="<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.faultlogquery.downloadfile'" +
            								",'"+data[i]+"')\">"+data[i]+"</a>&nbsp;&nbsp;";	
           								}
           								else str +="<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.faultlogquery.downloadfile'" +
        								",'"+data[i]+"')\">"+data[i]+"</a>";	
           							}
           							return str;
           						}
           						else return "";
           						
           					}},
           					{index: 8, fn: function (data,j,ctd,itemData) {
          						if(data==0)return "已处理";
          						else return "未处理";
          						
          					}}],
                   colNames: ["机车","局段","故障时间","设备名称","故障类型","描述","附件","报告人","处理状态"],
                   colModel: [{ name: "loconame" }, { name: "dshortname"},
                              { name: "faultDate" }, { name: "deviceName"},
                              { name: "faultName" }, { name: "faultNote"},
                              {name:"upfileName"},{name:"recUsername"},{name:"handleState"}]
            });
    		$(".RTTable_Head tr td:first",$("#devicequalitytrack-faultlogquery-bodyDiv-body-grid")).html("序号");
    		trainislateFaultLogQueryGrid.init();
    		
        };
        var getFaultLogQueryInput = function () {
            var pData = {};
            pData.fdate = $(".trainisFirst_time",".faultLogQueryTab").val();
            pData.tdate = $(".trainisFinish_time",".faultLogQueryTab").val();
            pData.deviceId = $(".deviceIdSelect_Query",".faultLogQueryTab").val();
            pData.faultType = $(".faultTypeSelect_Query",".faultLogQueryTab").val();
            pData.locoName = $(".trainislate_loco",".faultLogQueryTab").val();
            pData.recUser = $(".recUserInput",".faultLogQueryTab").val();
            return pData;
        }; 
        //初始化查询按钮
        var initFaultLogQuery=function(){
        	$(".faultLogQuery",".faultLogQueryTab").unbind("click").bind("click",function(){
            	faultLogQuery(getFaultLogQueryInput());
            });
        };
        var initExportFaultLogsToExcel=function(){
        	$(".faultLogExcelQuery",".faultLogQueryTab").unbind("click").bind("click",function(){
        		if(window.confirm("确认要导出到excel吗?")){
        			var data=getFaultLogQueryInput();
    	     		window.location.href = "../devicequalitytrack/exportFaultLogsToExcel?fdate="+data.fdate
        			+"&tdate="+data.tdate+"&locoName="+data.locoName
        			+"&recUser="+data.recUser+"&deviceId="+data.deviceId+"&faultType="+data.faultType+"&date="+new Date();
    	     	}
            });
        };
        
        var currClickTrId=null;//当前选中的问题行id;
        var initFaultLogDealBtn=function(){
        	$(".faultLogQuerySubBtn",".faultLogNoteTab").unbind("click").bind("click",function(){
        			if($.trim($(".feedbackNote",".faultLogNoteTab").val())==""){
        				RTU.invoke("header.notice.show", "请输入反馈意见");
                        RTU.utils.input.focusin($(".feedbackNote",".faultLogNoteTab"));
        				return;
        			}
        			if(!currClickTrId){
        				RTU.invoke("header.notice.show", "请选择需要反馈的问题");
                        /*RTU.utils.input.focusin($(".faultLogQuerySubBtn",".faultLogNoteTab"));*/
        				return;
        			}

                    RTU.invoke("core.router.post", {
                        url: "devicequalitytrack/saveFaultDeal",
                        data: {"faultId":currClickTrId,
                        		"note":$(".feedbackNote",".faultLogNoteTab").val(),
                        		"recUser":RTU.data.user.realName
                        	   },
                        success: function (obj) {
                            if (obj.success) {
                                RTU.invoke("header.notice.show", "添加反馈意见成功!");
                                initFeedBackTextArea(currClickTrId);
                                
                            } else {
                                RTU.invoke("header.notice.show", "添加反馈意见失败,请联系技术人员检查错误日志!");
                            }
                        },
                        error: function (e) {
                            RTU.invoke("header.notice.show", "发生错误:"+e);
                        }
                    });
        	});
        };
        var initFeedBackTextArea=function(faultId){
        	//点击问题,ajax获取当前问题对应的反馈意见列表
        	if(faultId){
        		RTU.invoke("core.router.get", {
                    url: "devicequalitytrack/findFaultDealsByFaultId",
                    data: {"faultId":faultId
                    	   },
                    success: function (obj) {
                    	$(".faultLogNoteSubTab tr","#fautLogQuery_fieldSet4").remove();
                        if (obj.success&&obj.data&&obj.data.length>0) {
                            var resData=obj.data;
                            var str="";
                            for(var i=0;i<resData.length;i++){
                            	str+="<tr style='height:20px'><th style='text-align:right'>序号:"+(i+1)+"</th><th style='text-align:right'>反馈人:</th><td>"+resData[i].recUsername
                            	+"</td><th style='text-align:right'>时间:</th><td>"+resData[i].recDate+"</td></tr><tr style='height:50px'>" +
                            			"<td colspan='5'><textarea style='width:100%' rows='4'>"
                            	+resData[i].faultdealNote+"</textarea></td></tr>";
                            }
                            $(".faultLogNoteSubTab","#fautLogQuery_fieldSet4").append(str);
                            
                        } else {
                            
                        }
                    },
                    error: function (e) {
                        RTU.invoke("header.notice.show", "发生错误:"+e);
                    }
                });
        	}
        };
        var initFaultSelValue=function(){
        	$("select option[value!='']",".faultLogQueryTab").remove();
        	
        	var url="devicequalitytrack/searchAllFaultType";
            var param={
                    url: url,
                    success: function (data) {
                    	if(data.success&&data.data&&data.data.length>0){
                    		for(var i=0;i<data.data.length;i++){
                    			$(".faultTypeSelect,.faultTypeSelect_Query",".faultLogQueryTab")
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
                    			$(".deviceIdSelect,.deviceIdSelect_Query",".faultLogQueryTab")
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
        return function (data) {
            initFaultLogQuery();//查询按钮初始化
            initExportFaultLogsToExcel();//导出到excel初始化
            initFaultLogDealBtn();//初始化反馈意见按钮
            initFaultSelValue();//初始化选择框
            $(".faultLogQuery",".faultLogQueryTab").click();
        };
        
	});

});
