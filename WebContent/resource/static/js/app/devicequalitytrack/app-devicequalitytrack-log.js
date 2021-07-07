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
    
    var $logHtml;
	var popuwnd_log;
	var logData;
	var trainislateLogGrid;
	
	RTU.register("app.devicequalitytrack.log.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-log.html",
			success:function(html){
				$logHtml = $(html);
				if(popuwnd_log){
					popuwnd_log.html($logHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.log.activate", function() { //使得popuwnd对象活动
		return function(locoData) {
			
			var width = $("body").width() - 640;
			var height = $("body").height() - 120;
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
			
			if (!popuwnd_log) {
				popuwnd_log = new PopuWnd({
					title : "添乘日志上报",
					html : $logHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_log.remove = popuwnd_log.close;
				popuwnd_log.close = popuwnd_log.hidden;
				popuwnd_log.init();
			} else {
				popuwnd_log.init();
			}
			var bottomFieldSet=Theight-$("#topFieldSet").height()-60;
			$("#bottomFieldSet").height(bottomFieldSet);
			
			RTU.invoke("app.devicequalitytrack.log.initinput",locoData);
			RTU.invoke("app.devicequalitytrack.log.inituploadify",locoData);
		};
	});
	
	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twidth=document.documentElement.clientWidth * 0.85;
		Resolution.Theight=document.documentElement.clientHeight ;
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.log.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_log) {
				popuwnd_log.close();
			}
		};
	});
	
	
	 RTU.register("app.devicequalitytrack.log.create", function () {});

	RTU.register("app.devicequalitytrack.log.initinput",function(){
		var getAddInputVal = function () {
            var pData = {};
            pData.locoTypeid = $(".locoTypeid",".mainTab_Add").val();
            pData.locoNo = $(".locoNo",".mainTab_Add").val();
            pData.locoAb = $(".locoAb",".mainTab_Add").val();
            pData.note = $(".note",".mainTab_Add").val();
            pData.startDate = $(".startDate",".mainTab_Add").val();
            pData.arriveDate = $(".arriveDate",".mainTab_Add").val();
            pData.recUser = $(".recUser",".mainTab_Add").val();
            pData.mileage = $(".mileage",".mainTab_Add").val();
            pData.startStation = $(".startStation",".mainTab_Add").val();
            pData.endStation = $(".endStation",".mainTab_Add").val();
            pData.procVer = $(".hostVer",".mainTab_Add").val();
            pData.dataVer = $(".dataVer",".mainTab_Add").val();
            pData.runState = $(".runstateSelect",".mainTab_Add").val();
            pData.upfileName = $(".attachFileName","#operDiv").val();
            pData.logId=$(".logId",".mainTab_Add").val();
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
        	if (RTU.utils.string.isBank(pData.mileage)) {
                RTU.invoke("header.notice.show", "请输入里程");
                RTU.utils.input.focusin($(".mileage",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".mileage",".mainTab_Add"));
            }
        	if (isNaN(pData.mileage)) {
                RTU.invoke("header.notice.show", "里程必须为数字");
                RTU.utils.input.focusin($(".mileage",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".mileage",".mainTab_Add"));
            }
        	if (RTU.utils.string.isBank(pData.startStation)) {
                RTU.invoke("header.notice.show", "请输入起始站");
                RTU.utils.input.focusin($(".startStation",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".startStation",".mainTab_Add"));
            }
        	if (RTU.utils.string.isBank(pData.endStation)) {
                RTU.invoke("header.notice.show", "请输入终到站");
                RTU.utils.input.focusin($(".endStation",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".endStation",".mainTab_Add"));
            }
        	if (RTU.utils.string.isBank(pData.procVer)) {
                RTU.invoke("header.notice.show", "请输入主机版本");
                RTU.utils.input.focusin($(".hostVer",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".hostVer",".mainTab_Add"));
            }
        	if (RTU.utils.string.isBank(pData.dataVer)) {
                RTU.invoke("header.notice.show", "请输入数据版本");
                RTU.utils.input.focusin($(".dataVer",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".dataVer",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.startDate)) {
                RTU.invoke("header.notice.show", "请选择开车日期");
                RTU.utils.input.focusin($(".startDate",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".startDate",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.arriveDate)) {
                RTU.invoke("header.notice.show", "请选择到达日期");
                RTU.utils.input.focusin($(".arriveDate",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".arriveDate",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.note)) {
                RTU.invoke("header.notice.show", "请输入运行情况!");
                RTU.utils.input.focusin($(".note",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".note",".mainTab_Add"));
            }
           
            return true;
        };
        var saveLog = function (pData) {
            RTU.invoke("core.router.post", {
                url: "devicequalitytrack/saveLog",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "上报日志成功!");
                        $(".feedbackQuery",".mainTab_Query").click();
                    } else {
                        RTU.invoke("header.notice.show", "上报日志失败"+obj.msg);
                    }
                },
                error: function (e) {
                    RTU.invoke("header.notice.show", "发生错误:"+e);
                }
            });
        };
        var initLogSave = function () {//初始化保存按钮
        	$(".feedbackAdd","#operDiv").unbind("click").bind("click",function () {
                var mData = addInputDataTrim(getAddInputVal());
                if (checkSaveInput(mData)) {
                    saveLog(mData);
                }
                });
        };//上面是日志保存初始化
        
        //重置按钮初始化
        var initLogReset = function () {
        	$(".feedbackReset","#operDiv").unbind("click").bind("click",function(){
            	var userName=$(".recUser",".mainTab_Add").val();
            	var locoName=$(".trainislate_loco",".mainTab_Add").val();
            	var locoTypeid=$(".locoTypeid",".mainTab_Add").val();
            	var locoNo=$(".locoNo",".mainTab_Add").val();
            	var locoAb=$(".locoAb",".mainTab_Add").val();
            	$("input,textarea","#operDiv").val("");
            	$(".recUser",".mainTab_Add").val(userName);
            	$(".trainislate_loco",".mainTab_Add").val(locoName);
            	$(".locoTypeid",".mainTab_Add").val(locoTypeid);
            	$(".locoNo",".mainTab_Add").val(locoNo);
            	$(".locoAb",".mainTab_Add").val(locoAb);
            });
        };
        
        //查询机车最新的5条上报日志,默认当前机车
        var logQuery = function (data) {
        	var Resolution=getResolution();        	
			Twitdh=Resolution.Twidth-140;
			/*Theight=(Resolution.Theight-60)*0.3;	*/
			Theight=$("#bottomFieldSet").height()*0.7;
    	    trainislateLogGrid = new RTGrid({
    			url:"../devicequalitytrack/searchNewestLogsByProperty?fdate="+data.fdate
    			+"&tdate="+data.tdate+"&locoName="+data.locoName+"&recUser="+data.recUser
    			+"&date="+new Date(),
//                datas: showData,
                containDivId: "devicequalitytrack-bodyDiv-body-grid",
                tableWidth: Twitdh*0.95,
                tableHeight: Theight,
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
                	var thisData = trainislateLogGrid.currClickItem().data;
                    $(".locoTypeid",".mainTab_Add").val(thisData.locoTypeid);
                    $(".locoNo",".mainTab_Add").val(thisData.locoNo);
                    $(".locoAb",".mainTab_Add").val(thisData.locoAb);
                    $(".trainislate_loco",".mainTab_Add").val(thisData.loconame);
                    $(".mileage",".mainTab_Add").val(thisData.mileage);
                    $(".startStation",".mainTab_Add").val(thisData.startStation);
                    $(".endStation",".mainTab_Add").val(thisData.endStation);
                    $(".startDate",".mainTab_Add").val(thisData.startDate);
                    $(".arriveDate",".mainTab_Add").val(thisData.arriveDate);
                    $(".recUser",".mainTab_Add").val(thisData.recUsername);
                    $(".runstateSelect",".mainTab_Add").val(thisData.runState);
                    $(".hostVer",".mainTab_Add").val(thisData.procVer);
                    $(".dataVer",".mainTab_Add").val(thisData.dataVer);
                    $(".note",".mainTab_Add").val(thisData.note);
                    $(".logId",".mainTab_Add").val(thisData.logId);
                },
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
       						return str+"<a href='#' onclick=\"javascript:RTU.invoke('app.devicequalitytrack.log.deleterecord'" +
								","+data+")\">删除</a>";
       						
       					}}],
                colNames: ["机车","局段","里程","开车日期","到达日期","起始站","终到站","主机版本","数据版本","运行状态","运行情况","操作"],
                colModel: [{ name: "loconame" }, { name: "dshortname"},
                           { name: "mileage"}, { name: "startDate",width:Twitdh*0.15},{ name: "arriveDate",width:Twitdh*0.15},
                           { name: "startStation"},{name:"endStation"},{name:"procVer"},{name:"dataVer"},{name:"runState"}
                           ,{name:"note",width:Twitdh*0.1},{name:"logId",width:Twitdh*0.1}]
            });
    		$(".RTTable_Head tr td:first",$("#devicequalitytrack-bodyDiv-body-grid")).html("序号");
    		trainislateLogGrid.init();

    		$(".feedbackReset","#operDiv").click();
        };
        var getLogQueryInput = function () {
            var pData = {};
            pData.fdate = $(".trainisFirst_time",".mainTab_Query").val();
            pData.tdate = $(".trainisFinish_time",".mainTab_Query").val();
            pData.recUser = $(".recUserInput",".mainTab_Query").val();
            pData.locoName = $(".trainislate_loco",".mainTab_Query").val();
            return pData;
        }; 
        //初始化查询按钮
        var initLogQuery=function(){
        	$(".feedbackQuery",".mainTab_Query").unbind("click").bind("click",function(){
            	logQuery(getLogQueryInput());
            });
        };

        return function (data) {
        	
        	$(".mileage",".mainTab_Add").focus();
        	$(".trainislate_loco",".mainTab_Query").val(data.locoName);
            initLogSave();//保存按钮初始化
            initLogReset();//重置初始化按钮
            initLogQuery();//查询按钮初始化
            $(".feedbackQuery",".mainTab_Query").click();
        	$(".recUser",".mainTab_Add").val(RTU.data.user.realName);
        	$(".trainislate_loco",".mainTab_Add").val(data.locoName);
        	$(".locoTypeid",".mainTab_Add").val(data.locoTypeid);
        	$(".locoNo",".mainTab_Add").val(data.locoNo);
        	$(".locoAb",".mainTab_Add").val(data.locoAb);
        	var url="devicequalitytrack/getVersionByLoco?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb;
            var param={
                    url: url,
                    success: function (resData) {
                    	if(resData&&resData.data){
                    		$(".mainTab_Add .hostVer").val(resData.data[0]);
                    		$(".mainTab_Add .dataVer").val(resData.data[1]);
                    	}
                    },
                    error: function (e) {
                    	alert(e);
                    }
                  };
            RTU.invoke("core.router.get", param);
        };
        
	});

	RTU.register("app.devicequalitytrack.log.deleterecord", function() {
		return function(data) {
			if(window.confirm("确认要删除该上报日志?")){
	     		 var url="devicequalitytrack/deleteLog?logId="+data;
	             var param={
	                     url: url,
	                     success: function (data) {
	                     	if(data.success){
	                     		$(".feedbackReset","#operDiv").click();
	                     		$(".feedbackQuery",".mainTab_Query").click();
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
    RTU.register("app.devicequalitytrack.log.inituploadify", function () {
        return function (data) {
        	//上传文件插件的处理  
            $("#feedback_loadFile").uploadify({
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
/*                    var locoTypeid=$(".locoTypeId",".mainTab_Add").val();

                    var locoNo = $(".locoNo",".mainTab_Add").val();
                    var locoAb = $(".locoAb",".mainTab_Add").val();
                	var newdata = locoTypeid+","+locoNo+","+locoAb;*/
                    //在onUploadStart事件中，也就是上传之前，把参数写好传递到后台。  
                    $("#feedback_loadFile",".feedbackDiv").uploadify("settings", "formData", { 'userName': RTU.data.user.realName });
                },
                onSelect: function (fileObj) {
                    var name = fileObj.name;
                    var fileName=$.trim($(".fileUploadInput",".feedbackDiv").val());
                    if(fileName&&fileName.indexOf(name)!=-1){
                    	$(".fileUploadInput",".feedbackDiv").val(fileName+";"+name);	
                    }
                    else if(fileName=="")
                    	$(".fileUploadInput",".feedbackDiv").val(name);	
                    
                },
                onSelectError: function(file, errorCode, errorMsg){
                	$(".fileUploadInput",".feedbackDiv").val($(".attachFileName",".feedbackDiv").val());
                },
                onUploadSuccess: function (file, data, response) {
                    if(data){
                    	var fileName=$.trim($(".attachFileName",".feedbackDiv").val());
                        if(fileName){
                        	$(".attachFileName",".feedbackDiv").val(fileName+";"+data);	
                        }
                        else $(".attachFileName",".feedbackDiv").val(data);
                    	/*$(".attachFileName",".feedbackDiv").val(data);*/
                    }
                    else{
                    	RTU.invoke("header.notice.show", "上传文件失败!");
                    }
                    $(".fileUploadInput",".feedbackDiv").val($(".attachFileName",".feedbackDiv").val());
                },
                onCancel: function () {
                    $(".fileUploadInput",".feedbackDiv").val($(".attachFileName",".feedbackDiv").val());
                }   
            });
        };
    });
    
    
});
