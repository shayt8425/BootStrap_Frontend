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
    require("app/devicequalitytrack/app-devicequalitytrack-faultlogquery.js");//问题管理,查询界面
    
    var $faultLogHtml;
	var popuwnd_faultlog;
	var faultLogData;
	var trainislateFaultLogGrid;
	
	RTU.register("app.devicequalitytrack.faultlog.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-faultlog.html",
			success:function(html){
				$faultLogHtml = $(html);
				if(popuwnd_faultlog){
					popuwnd_faultlog.html($faultLogHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.faultlog.activate", function() { //使得popuwnd对象活动
		return function(locoData) {
			
			var width = $("body").width() - 640;
			var height = $("body").height() - 120;
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
			
			if (!popuwnd_faultlog) {
				popuwnd_faultlog = new PopuWnd({
					title : "问题上报",
					html : $faultLogHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_faultlog.remove = popuwnd_faultlog.close;
				popuwnd_faultlog.close = popuwnd_faultlog.hidden;
				popuwnd_faultlog.init();
			} else {
				popuwnd_faultlog.init();
			}
			var bottomFieldSet1=Theight-$("#topFieldSet1").height()-60;
			$("#bottomFieldSet1").height(bottomFieldSet1);
			
			RTU.invoke("app.devicequalitytrack.faultlog.initinput",locoData);
			RTU.invoke("app.devicequalitytrack.faultlog.inituploadify",locoData);
		};
	});

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twidth=document.documentElement.clientWidth * 0.7;
		Resolution.Theight=document.documentElement.clientHeight ;
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.faultlog.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_faultlog) {
				popuwnd_faultlog.close();
			}
		};
	});
	
	
	
	RTU.register("app.devicequalitytrack.faultlog.initinput",function(){
		var getAddInputVal = function () {
            var pData = {};
            pData.locoTypeid = $(".locoTypeid",".mainTab_faultLog_Add").val();
            pData.locoNo = $(".locoNo",".mainTab_faultLog_Add").val();
            pData.locoAb = $(".locoAb",".mainTab_faultLog_Add").val();
            pData.note = $(".note",".mainTab_faultLog_Add").val();
            pData.recUser = $(".recUser",".mainTab_faultLog_Add").val();
            pData.faultDate = $(".faultDate",".mainTab_faultLog_Add").val();
            pData.faultType=$(".faultTypeSelect",".mainTab_faultLog_Add").val();
            pData.faultId=$(".faultId",".mainTab_faultLog_Add").val();
            pData.deviceId = $(".deviceIdSelect",".mainTab_faultLog_Add").val();
            pData.upfileName = $(".attachFileName","#faultLogOperDiv").val();
            pData.logId=$(".logId",".mainTab_faultLog_Add").val();
            return pData;
        };
        //删除空的数据
        var addInputDataTrim = function (pData) {
            pData = pData ? pData : {};
            for (var name in pData) {
                if (!pData[name]) {
                    delete pData[name];
                }
            }
            return pData;
        };
        var checkSaveInput = function (pData) {
        	if (RTU.utils.string.isBank(pData.deviceId)) {
                RTU.invoke("header.notice.show", "请选择故障设备");
                RTU.utils.input.focusin($(".deviceIdSelect",".mainTab_faultLog_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".deviceIdSelect",".mainTab_faultLog_Add"));
            }
        	if (RTU.utils.string.isBank(pData.faultType)) {
                RTU.invoke("header.notice.show", "请选择故障类型");
                RTU.utils.input.focusin($(".faultTypeSelect",".mainTab_faultLog_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".faultTypeSelect",".mainTab_faultLog_Add"));
            }
            if (RTU.utils.string.isBank(pData.faultDate)) {
                RTU.invoke("header.notice.show", "请选择故障时间");
                RTU.utils.input.focusin($(".faultDate",".mainTab_faultLog_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".faultDate",".mainTab_faultLog_Add"));
            }
            if (RTU.utils.string.isBank(pData.recUser)) {
                RTU.invoke("header.notice.show", "请输入报告人");
                RTU.utils.input.focusin($(".recUser",".mainTab_faultLog_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".recUser",".mainTab_faultLog_Add"));
            }
            if (RTU.utils.string.isBank(pData.note)) {
                RTU.invoke("header.notice.show", "请输入故障描述!");
                RTU.utils.input.focusin($(".note",".mainTab_faultLog_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".note",".mainTab_faultLog_Add"));
            }
            return true;
        };
        var saveFaultLog = function (pData) {
            RTU.invoke("core.router.post", {
                url: "devicequalitytrack/saveFaultLog",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "上报问题成功!");
                        $(".faultLogQuery",".mainTab_faultLog_Query").click();
                    } else {
                        RTU.invoke("header.notice.show", "上报问题失败,请联系技术人员检查错误日志!");
                    }
                },
                error: function (e) {
                    RTU.invoke("header.notice.show", "发生错误:"+e);
                }
            });
        };
        var initFaultLogSave = function () {//初始化保存按钮
        	$(".faultLogAdd","#faultLogOperDiv").unbind("click").bind("click",function () {
                var mData = addInputDataTrim(getAddInputVal());
                if (checkSaveInput(mData)) {
                    saveFaultLog(mData);
                }
                });
        };//上面是日志保存初始化
        
        //重置按钮初始化
        var initFaultLogReset = function () {
        	$(".faultLogReset","#faultLogOperDiv").unbind("click").bind("click",function(){
            	
            	var locoName=$(".trainislate_loco",".mainTab_faultLog_Add").val();
            	var locoTypeid=$(".locoTypeid",".mainTab_faultLog_Add").val();
            	var locoNo=$(".locoNo",".mainTab_faultLog_Add").val();
            	var locoAb=$(".locoAb",".mainTab_faultLog_Add").val();
            	$("input,textarea,select","#faultLogOperDiv").val("");
            	$(".recUser",".mainTab_faultLog_Add").val(RTU.data.user.realName);
            	$(".trainislate_loco",".mainTab_faultLog_Add").val(locoName);
            	$(".locoTypeid",".mainTab_faultLog_Add").val(locoTypeid);
            	$(".locoNo",".mainTab_faultLog_Add").val(locoNo);
            	$(".locoAb",".mainTab_faultLog_Add").val(locoAb);
            });
        };
        
        //查询机车最新的5条上报日志,默认当前机车
        var faultLogQuery = function (data) {
        	var Resolution=getResolution();        	
			Twitdh=Resolution.Twidth-140;
			/*Theight=Resolution.Theight-520;	*/
    	    trainislateFaultLogGrid = new RTGrid({
    			url:"../devicequalitytrack/searchNewestFaultLogsByProperty?fdate="+data.fdate
    			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&faultType="+data.faultType+"&deviceId="+data.deviceId
    			+"&date="+new Date(),
//                datas: showData,
                containDivId: "devicequalitytrack-faultlog-bodyDiv-body-grid",
                tableWidth: Twitdh*0.95,
                tableHeight: $("#bottomFieldSet1").height()*0.7,
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
                clickTrEvent: function (t) {
                	var thisData = trainislateFaultLogGrid.currClickItem().data;
                    $(".locoTypeid",".mainTab_faultLog_Add").val(thisData.locoTypeid);
                    $(".locoNo",".mainTab_faultLog_Add").val(thisData.locoNo);
                    $(".locoAb",".mainTab_faultLog_Add").val(thisData.locoAb);
                    $(".trainislate_loco",".mainTab_faultLog_Add").val(thisData.loconame);                    
                    $(".recUser",".mainTab_faultLog_Add").val(thisData.recUsername);
                    $(".deviceIdSelect",".mainTab_faultLog_Add").val(thisData.deviceId);
                    $(".faultTypeSelect",".mainTab_faultLog_Add").val(thisData.faultType);
                    $(".faultId",".mainTab_faultLog_Add").val(thisData.faultId);
                    $(".note",".mainTab_faultLog_Add").val(thisData.faultNote);
                    $(".logId",".mainTab_faultLog_Add").val(thisData.logId);
                    $(".faultDate",".mainTab_faultLog_Add").val(thisData.faultDate);
                },
                replaceTd:[
          				 					
       					{index: 5, fn: function (data,j,ctd,itemData) {
       						if(data&&data.length>10){
       							return "<label title='"+data+"'>"+data.substring(0,5)+"...</label>";
       						}
       						else return data;
       						
       					}},
       					{index: 6, fn: function (data,j,ctd,itemData) {
       						return "<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.faultlogquery.activate'" +
							","+data+")\">问题管理</a>&nbsp;&nbsp;"+
       						"<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.faultlog.deleterecord'" +
								","+data+")\">删除</a>";
       						
       					}}],
                colNames: ["机车","局段","故障时间","设备名称","故障类型","描述","操作"],
                colModel: [{ name: "loconame" }, { name: "dshortname"},
                           { name: "faultDate" }, { name: "deviceName"},
                           { name: "faultName" }, { name: "faultNote"},
                           {name:"faultId"}]
            });
    	    trainislateFaultLogGrid.init();
    		$(".faultLogReset","#faultLogOperDiv").click();
        };
        var getFaultLogQueryInput = function () {
            var pData = {};
            pData.fdate = $(".trainisFirst_time",".mainTab_faultLog_Query").val();
            pData.tdate = $(".trainisFinish_time",".mainTab_faultLog_Query").val();
            pData.deviceId = $(".deviceIdSelect_Query",".mainTab_faultLog_Query").val();
            pData.faultType = $(".faultTypeSelect_Query",".mainTab_faultLog_Query").val();
            pData.locoName = $(".trainislate_loco",".mainTab_faultLog_Add").val();
            return pData;
        }; 
        //初始化查询按钮
        var initFaultLogQuery=function(){
        	$(".faultLogQuery",".mainTab_faultLog_Query").unbind("click").bind("click",function(){
            	faultLogQuery(getFaultLogQueryInput());
            });
        };
        var initSelectValue=function(){
        	$("select option[value!='']",".faultLogDiv").remove();
        	
        	var url="devicequalitytrack/searchAllFaultType";
            var param={
                    url: url,
                    success: function (data) {
                    	if(data.success&&data.data&&data.data.length>0){
                    		for(var i=0;i<data.data.length;i++){
                    			$(".faultTypeSelect,.faultTypeSelect_Query",".faultLogDiv")
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
                    			$(".deviceIdSelect,.deviceIdSelect_Query",".faultLogDiv")
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
            initFaultLogSave();//保存按钮初始化
            initFaultLogReset();//重置初始化按钮
            initFaultLogQuery();//查询按钮初始化
            initSelectValue();//下拉框初始化
        	$(".recUser",".mainTab_faultLog_Add").val(RTU.data.user.realName);
        	$(".trainislate_loco",".mainTab_faultLog_Add").val(data.locoName);
        	$(".locoTypeid",".mainTab_faultLog_Add").val(data.locoTypeid);
        	$(".locoNo",".mainTab_faultLog_Add").val(data.locoNo);
        	$(".locoAb",".mainTab_faultLog_Add").val(data.locoAb);
        	$(".deviceIdSelect",".mainTab_faultLog_Add").focus();
        	$(".faultLogQuery",".mainTab_faultLog_Query").click();

            
        };
        
	});

	RTU.register("app.devicequalitytrack.faultlog.deleterecord", function() {
		return function(data) {
			if(window.confirm("确认要删除该故障记录?")){
	     		 var url="devicequalitytrack/deleteFaultLog?faultId="+data;
	             var param={
	                     url: url,
	                     success: function (data) {
	                     	if(data.success){
	                     		$(".faultLogReset","#faultLogOperDiv").click();
	                     		$(".faultLogQuery",".mainTab_faultLog_Query").click();
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
	
	//初始化文件上传插件
    RTU.register("app.devicequalitytrack.faultlog.inituploadify", function () {
        return function (data) {
        	//上传文件插件的处理  
            $("#faultlog_loadFile").uploadify({
                swf: '../static/js/jquery-uploadify/swf/uploadify.swf', //按钮路径
                uploader: '../devicequalitytrack/upLoadFile', //请求后台URL
                width: '71',
                height: '22',
                method: 'POST',
                buttonClass: 'upLoadFileBtn',
                buttonText: "选择文件",
                buttonCursor: 'hand',
                preventCaching: true,
                auto: false, //不自动上传
                multi: false, //是否允许多选
                removeTimeout: 10, //消失时间
                fileTypeExts: '*.*',
                formData: { 'folderName': 'attachFiles' }, //文件夹名称
                overrideEvents: [ 'onDialogClose','onSelectError' ],
                onUploadStart: function (file) {
/*                    var locoTypeid=$(".locoTypeId",".mainTab_faultLog_Add").val();

                    var locoNo = $(".locoNo",".mainTab_faultLog_Add").val();
                    var locoAb = $(".locoAb",".mainTab_faultLog_Add").val();
                	var newdata = locoTypeid+","+locoNo+","+locoAb;*/
                    //在onUploadStart事件中，也就是上传之前，把参数写好传递到后台。  
                    $("#feedback_loadFile","#faultLogOperDiv").uploadify("settings", "formData", { 'userName': RTU.data.user.realName });
                },
                onSelect: function (fileObj) {
                    var name = fileObj.name;
                    var fileName=$.trim($(".fileUploadInput","#faultLogOperDiv").val());
                    if(fileName&&fileName.indexOf(name)!=-1){
                    	$(".fileUploadInput","#faultLogOperDiv").val(fileName+";"+name);	
                    }
                    else if(fileName=="")
                    	$(".fileUploadInput","#faultLogOperDiv").val(name);	
                    
                },
                onSelectError: function(file, errorCode, errorMsg){
                	$(".fileUploadInput","#faultLogOperDiv").val($(".attachFileName","#faultLogOperDiv").val());
                },
                onUploadSuccess: function (file, data, response) {
                    if(data){
                    	var fileName=$.trim($(".attachFileName","#faultLogOperDiv").val());
                        if(fileName){
                        	$(".attachFileName","#faultLogOperDiv").val(fileName+";"+data);	
                        }
                        else $(".attachFileName","#faultLogOperDiv").val(data);
                    	/*$(".attachFileName","#faultLogOperDiv").val(data);*/
                    }
                    else{
                    	RTU.invoke("header.notice.show", "上传文件失败!");
                    }
                    $(".fileUploadInput","#faultLogOperDiv").val($(".attachFileName","#faultLogOperDiv").val());
                },
                onCancel: function () {
                    $(".fileUploadInput","#faultLogOperDiv").val($(".attachFileName","#faultLogOperDiv").val());
                }   
            });
        };
    });
    
	RTU.register("app.devicequalitytrack.faultlog.faultlogaddfn",function(){ 
		return function(id){
	    	var locoData={};
	    	locoData.locoTypeid=$("#"+id).attr("locoTypeid");
			locoData.locoNo=$("#"+id).attr("locoNo");
			locoData.locoAb=$("#"+id).attr("locoAb");
			locoData.logId=$("#"+id).attr("logId");
			locoData.locoName=$("#"+id).attr("locoName");
	    	RTU.invoke('app.devicequalitytrack.faultlog.activate',locoData);
		};

    });
});
