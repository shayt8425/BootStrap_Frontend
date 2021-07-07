RTU.DEFINE(function(require, exports) {
/**
 * 模块名：设备质量追踪
 * name：equipmentqualitytrack
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
   // require("../realtimelocomotivequery/app-realtimelocomotivequery-query.js")
    require("../common/common.js");
    require("../../../css/app/locomotivefeedback/feedbackquery.css");
    
    var $html;
	var popuwnd;
	var data;
	var trainislateGrid;
	
	RTU.register("app.equipmentqualitytrack.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/locomotivefeedback/app-locomotivefeedbackindex.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				RTU.invoke("app.equipmentqualitytrack.query.create");
				RTU.invoke("app.equipmentqualitytrack.initinput");
				RTU.invoke("app.equipmentqualitytrack.inituploadify");			
			}
		});
		return function() {
			return true;
		};
	});
	
	//获得查询参数
	var checkInputData=function(){
		var data={};
		data.Firsttime=$("#trainisFirst_time").val();
		data.Finishtime=$("#trainisFinish_time").val();
		tempdata=$("#trainisAntecedents_loco").val();
		if (tempdata){
			var strs=[];
			strs=tempdata.split("-");
			var locotemp=strs[1];
			data.shortname=strs[0];	
			var lastStr=locotemp.charAt(locotemp.length-1);
			if ((lastStr!="B")&&(lastStr!="A")){
				data.loco=locotemp;
			}else{
				data.loco=locotemp.substring(4,0);
			}
			if (lastStr=="A"){data.locoAB="1";};
			if (lastStr=="B"){data.locoAB="2";};
			if ((lastStr!="B")&&(lastStr!="A")){data.locoAB="0";};
		}else{
			data.loco="";
			data.shortname="";
		}

		return data;		
	};
	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twidth=document.documentElement.clientWidth * 0.85;
		Resolution.Theight=document.documentElement.clientHeight * 0.85;
		return Resolution;
	}
	RTU.register("app.equipmentqualitytrack.query.activate", function() { //使得popuwnd对象活动
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
//			RTU.invoke("app.equipmentqualitytrack.query.create", $html);
		};
	});
	RTU.register("app.equipmentqualitytrack.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.close();
			}
		};
	});
	
	
	 RTU.register("app.equipmentqualitytrack.query.create", function () {
		 	var initFaultTypeAuto=function(){
		 		try{

	                $('.faultTypeInput',".feedbackDiv").autocomplete("../lkj15feedback/searchAllFaultType?date=" + new Date(), {
	                    minChars: 0, //表示在自动完成激活之前填入的最小字符
	                    max: 100, //表示列表里的条目数
	                    autoFill: false, //表示自动填充
	                    mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
	                    matchContains: true, //表示包含匹配,相当于模糊匹配
	                    width: 180,
	                    scrollHeight: 200, //表示列表显示高度,默认高度为180
	                    dataType: "json",
	                    extraParams: {
	                        keyword: function () {
	                            var r = $('.faultTypeInput',".feedbackDiv").val();
	                            if (r != "请输入故障类型") {
	                                return r;
	                            } else {
	                                return "";
	                            }
	                        }
	                    },
	                    parse: function (data) {
	                    	data = data.data;
	    		            var rows = [];
	    		            for (var i = 0; i < data.length; i++) {
	    		                rows[rows.length] = {
	    		                    data: data[i],
	    		                    text:data[i].faultName,
	    		                    result:data[i].faultName
	    		                };
	    		            }
	    		            return rows;
	                    },
	                    formatItem: function (row) {///下拉列表每行数据
	                    	return row.faultName;
	                    },
	                    formatMatch: function (row) {
	                    	return row.faultName;
	                    },
	                    formatResult: function (row) {
	                        return row.faultName;
	                    }
	                }).result(function (event, data, formatted) {
	                    if($(this).attr("name")!=undefined){
	                    	if (data) {
		                    	$('.faultTypeId',".feedbackDiv").val(data.faultTypeId);
		                    }
		                    else{
		                    	$('.faultTypeId',".feedbackDiv").val("");
		                    }
	                    }
	                });
		 		}catch(e){
		 			alert(e);
		 		}	    
		 	};
		    var inittrainStrAuto = function () {
		        trainStrExParams = {
                        keyword: function () {
                            var r = $('.trainislate_loco',".mainTab_Add").val();
                            if (r != "请输入机车型号或机车号") {
                                return r;
                            } else {
                                return "";
                            }
                        }
		        };
		        trainStrParse = function (data) {  //给机车型号和机车号增加-符号
		            data = data.data;
		            var rows = [];
		            for (var i = 0; i < data.length; i++) {

		                rows[rows.length] = {
                                data: data[i],
                                value: data[i].locoTypeName + "-" + data[i].locoNO,
                                result: data[i].locoTypeName + "-" + data[i].locoNO //返回的结果显示内容   
                            };
		            }
		            return rows;
		        };
		        $('.trainislate_loco',".feedbackDiv").autocomplete("../onlineloco/" +
		        		"searchByProperty?dFullName=&bFullName=&sFullName=&showSize=50" +
		        		"&locoType=&locoNo=&dName=&checiName&lineName=&trainType=&sName=" +
		        		"&temptime=" + new Date().getTime(), {
                    minChars: 0, //表示在自动完成激活之前填入的最小字符
                    max: 100, //表示列表里的条目数
                    autoFill: false, //表示自动填充
                    mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
                    matchContains: true, //表示包含匹配,相当于模糊匹配
                    width: 180,
                    scrollHeight: 200, //表示列表显示高度,默认高度为180
                    dataType: "json",
                    extraParams:trainStrExParams,
                    parse: trainStrParse,
                    formatItem: function (row) {///下拉列表每行数据
                    	return row.locoTypeName + "-" + row.locoNO;
                    },
                    formatMatch: function (row) {
                    	return row.locoTypeName + "-" + row.locoNO;
                    },
                    formatResult: function (row) {
                    	return row.locoTypeName + "-" + row.locoNO;
                    }
                }).result(function (event, data, formatted) {
                	if($(this).attr("name")!=undefined){
                		if (formatted) {
                        	$('.locoTypeId',".mainTab_Add").val(data.locoTypeid);
                        	$('.locoNo',".mainTab_Add").val(data.locoNo);
                        	$('.locoAb',".mainTab_Add").val(data.locoAb);
                        }
                        else{
                        	$('.locoTypeId,.locoNo,.locoAb',".mainTab_Add").val("");
                        }
                	}
                	/*else{
                		if($(this).attr("id")=="recUserInput"){
                			
                		}
                		else{
                			
                		}
                		if (formatted) {
                        	$('.locoTypeId',".mainTab_Query").val(data.locoTypeid);
                        	$('.locoNo',".mainTab_Query").val(data.locoNo);
                        	$('.locoAb',".mainTab_Query").val(data.locoAb);
                        }
                        else{
                        	$('.locoTypeId,.locoNo,.locoAb',".mainTab_Query").val("");
                        }
                	}*/
                	
                });
	 		    
		    }; 

		    return function (data) {
		    	inittrainStrAuto();
		    	initFaultTypeAuto();
		    };
		 
	 });

	
	RTU.register("app.equipmentqualitytrack.query.init", function() {
		data = RTU.invoke("app.setting.data", "equipmentqualitytrack");
		if (data && data.isActive) {
			RTU.invoke("app.equipmentqualitytrack.query.activate");  
		}		
		return function() {
			return true;
		};
	});
	
	RTU.register("app.equipmentqualitytrack.query.downloadfile", function() {
		return function(data) {
			if(!data)return;
	     	if(window.confirm("确认要下载附件吗?")){
	     		window.location.href = "../lkj15feedback/downloadFile?fileName=" + data;
	     	}
		};
	});
	RTU.register("app.equipmentqualitytrack.query.deleterecord", function() {
		return function(data) {
			if(window.confirm("确认要删除该条记录吗?")){
	     		var url="lkj15feedback/delete?did="+data;
	             var param={
	                     url: url,
	                     success: function (data) {
	                     	$(".feedbackQuery",".mainTab_Query").click();
	                     },
	                     error: function (e) {
	                     	alert(e);
	                     }
	                   };
	             RTU.invoke("core.router.get", param);
	     	}
		};
	});

	RTU.register("app.equipmentqualitytrack.initinput",function(){
        var initSave = function () {
        	$(".feedbackAdd",".operDiv").unbind("click").bind("click",function () {
                var mData = checkData(getInput());
                if (checkSaveInput(mData)) {
                    save(mData);
                }
                });
        };
        var initReset = function () {
        	$(".feedbackReset",".operDiv").unbind("click").bind("click",function(){
            	$("input,textarea",".mainTab_Add").val("");
            });
        };
        var initQuery=function(){
        	$(".feedbackQuery",".operDiv").unbind("click").bind("click",function(){
            	query(getQueryInput());
            });
        };
        var initExportToExcel=function(){
        	$(".feebackExcel",".operDiv").unbind("click").bind("click",function(){
        		if(window.confirm("确认要导出到excel吗?")){
        			var data=getQueryInput();
    	     		window.location.href = "../lkj15feedback/exportToExcel?fdate="+data.fdate
        			+"&tdate="+data.tdate+"&shortname="+data.shortname
        			+"&faultName="+data.faultName+"&recUser="+data.recUser+"&date="+new Date()
    	     	}
            });
        };
        var initTopButtonClick=function(){
        	
        	$("#faultDiv").click(
        			function(){
        		/*$(".tab-start-head",".feedbackDiv").addClass("border-top-click");*/
        		$("#faultsumDiv").addClass("tab-background");
        		$("#faultDiv").removeClass("tab-background");
        		$(".operDiv",".feedbackDiv").show();
        		$(".sumDiv",".feedbackDiv").hide();
        	});
        	$("#faultsumDiv").click(
        			function(){
        		/*$(".tab-middle",".feedbackDiv").addClass("border-top-click");*/
            	$("#faultDiv").addClass("tab-background");
            	$("#faultsumDiv").removeClass("tab-background");
            	$(".sumDiv",".feedbackDiv").show();
            	$(".operDiv",".feedbackDiv").hide();
        	});
        	$("#faultDiv").click();
        };
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
        			+"&tdate="+data.tdate+"&shortname="+data.shortname
        			+"&faultName="+data.faultName+"&recUser="+data.recUser+"&date="+new Date();
    	     	}
            });
        };

        var getSumQueryInput = function () {
            var pData = {};
/*            pData.locoTypeid = $(".locoTypeId",".mainTab_Query").val();
            pData.locoNo = $(".locoNo",".mainTab_Query").val();
            pData.locoAb = $(".locoAb",".mainTab_Query").val();*/
            pData.fdate = $(".trainisFirst_time",".sumTab_Query").val();
            pData.tdate = $(".trainisFinish_time",".sumTab_Query").val();
            pData.recUser = $(".recUserInput",".sumTab_Query").val();
            pData.shortname = $(".trainislate_loco",".sumTab_Query").val();
            return pData;
        };
        var getQueryInput = function () {
            var pData = {};
/*            pData.locoTypeid = $(".locoTypeId",".mainTab_Query").val();
            pData.locoNo = $(".locoNo",".mainTab_Query").val();
            pData.locoAb = $(".locoAb",".mainTab_Query").val();*/
            pData.faultName = $(".faultTypeInput",".mainTab_Query").val();
            pData.fdate = $(".trainisFirst_time",".mainTab_Query").val();
            pData.tdate = $(".trainisFinish_time",".mainTab_Query").val();
            pData.recUser = $(".recUserInput",".mainTab_Query").val();
            pData.shortname = $(".trainislate_loco",".mainTab_Query").val();
            return pData;
        };
        var getInput = function () {
            var pData = {};
            pData.locoTypeid = $(".locoTypeId",".mainTab_Add").val();
            pData.locoNo = $(".locoNo",".mainTab_Add").val();
            pData.locoAb = $(".locoAb",".mainTab_Add").val();
            pData.faultType = $(".faultTypeId",".mainTab_Add").val();
            pData.faultName = $(".faultTypeInput",".mainTab_Add").val();
            pData.remark = $(".fault_remark",".mainTab_Add").val();
            pData.errorTime = $(".fault_time",".mainTab_Add").val();
            pData.recUser = $(".recUserInput",".mainTab_Add").val();
            pData.upfileName = $(".attachFileName",".mainTab_Add").val();            
            return pData;
        };
        var checkData = function (pData) {
            pData = pData ? pData : {};
            for (var name in pData) {
                if (!pData[name]) {
                    delete pData[name];
                }
            }
            return pData;
        };
        var checkSaveInput = function (pData) {
            if (RTU.utils.string.isBank(pData.locoTypeid)) {
                RTU.invoke("header.notice.show", "请选择机车!");
                RTU.utils.input.focusin($(".trainislate_loco",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".trainislate_loco",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.faultType)
            		||$.trim(pData.faultName)=="请输入故障类型") {
                RTU.invoke("header.notice.show", "请输入故障类型!");
                RTU.utils.input.focusin($(".faultTypeInput",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".faultTypeInput",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.errorTime)) {
                RTU.invoke("header.notice.show", "请选择故障发生时间");
                RTU.utils.input.focusin($(".fault_time",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".fault_time",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.remark)) {
                RTU.invoke("header.notice.show", "请输入故障描述!");
                RTU.utils.input.focusin($(".fault_remark",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".fault_remark",".mainTab_Add"));
            }
            if (RTU.utils.string.isBank(pData.recUser)) {
                RTU.invoke("header.notice.show", "请输入报告人!");
                RTU.utils.input.focusin($(".recUserInput",".mainTab_Add"));
                return false;
            } else {
                RTU.utils.input.focusout($(".recUserInput",".mainTab_Add"));
            }
            return true;
        };
        var save = function (pData) {
            RTU.invoke("core.router.get", {
                url: "lkj15feedback/save",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "添加记录成功!");
                        $(".feedbackQuery",".mainTab_Query").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function (e) {
                    RTU.invoke("header.notice.show", "添加记录失败:"+e);
                }
            });
        };
        var query = function (data) {
        	var Resolution=getResolution();
        	
			Twitdh=Resolution.Twidth-200;
			Theight=Resolution.Theight-520;	
    	    trainislateGrid = new RTGrid({
    			url:"../lkj15feedback/searchByProperty?fdate="+data.fdate
    			+"&tdate="+data.tdate+"&shortname="+data.shortname+
    			"&faultName="+data.faultName+"&recUser="+data.recUser
    			+"&date="+new Date(),
//                datas: showData,
                containDivId: "equipmentqualitytrack-bodyDiv-body-grid",
                tableWidth: Twitdh,
                tableHeight: Theight,
                isSort: false, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize =30;
    			},
                loadPageCp: function (t) {
                    t.cDiv.css("margin-left", "40px");
                    t.cDiv.css("margin-top", "20px"); 
                    t.cDiv.css("left", "0px");
                },
                replaceTd:[
       					{index: 3, fn: function (data,j,ctd,itemData) {
       						var time=itemData.errorTime;//receiveTime;
       						if(time==null){
       							return "";
       						}else{
       							return window.format2(time);
       						}
       						
       					}},
       					{index: 5, fn: function (data,j,ctd,itemData) {
       						if(itemData.upfileName){
       							return "<a href='#' onclick=\"javascript:RTU.invoke('app.equipmentqualitytrack.query.downloadfile'" +
       									",'"+itemData.upfileName+"')\">"
       							+itemData.upfileName+"</a>";
       						}
       						return null;
       						
       					}},
       					{index: 6, fn: function (data,j,ctd,itemData) {
       						return "<a href='#' onclick=\"javascript:RTU.invoke('app.equipmentqualitytrack.query.deleterecord'" +
								","+itemData.recId+")\">删除</a>";
       						
       					}}],
                colNames: ["机车", "故障类型", "故障描述",  "故障时间",  "报告人","附件","操作"],
                colModel: [{ name: "ttypeShortname" }, { name: "faultName"},
                           { name: "remark"}, { name: "errorTime"},
                           { name: "recUser"}, { name: "upfileName"},{name:"recId"}]
            });
    		$(".RTTable_Head tr td:first",$("#equipmentqualitytrack-bodyDiv-body-grid")).html("序号");
    		trainislateGrid.init();
        };
        
        var totalWidth =0;//存储统计列表的表头总宽度
        var setScrollX = function (t) {//滚动条自适应宽度
            
            for (var i = 0, len = t.param.colModel.length; i < len; i++) {
                var tn = parseInt(t.param.colModel[i].width);
                totalWidth += tn;
            }
            if (t.param.hasCheckBox) {
            	totalWidth=totalWidth+31;
            }
            if (!totalWidth) return;
            if (totalWidth < t.cDiv.width()) {
                return;
            }
            $(".RTTable-Body", t.cDiv).css({ width: totalWidth });
            $(".RTGrid_Headdiv .RTTable_Head", t.cDiv).css({ width: totalWidth });
            $(".RTGrid_Headdiv", t.cDiv).css({ width: t.cDiv.width() - 20 });
            $(".RTGrid_Bodydiv", t.cDiv).scroll(function (e) {
                $(".RTGrid_Headdiv", t.cDiv).scrollLeft($(this).scrollLeft());
            });
            var tditem = $(".RTTable-Body thead tr td ", t.cDiv);
            $(".RTTable_Head thead tr td", t.cDiv).each(function (i, item) {
            	if(i!=(tditem.length-1)&&i!=0){
            		$(item).width($($(tditem).get(i)).width());
            	}
            });
        };
        var theadTdArray;
        var theadTdWidth;
        var initSumTab_Head=function(){
        	var url="lkj15feedback/searchAllFaultType";
            var param={
                    url: url,
                    success: function (data) {
                    	if(data.data&&data.data.length>0){
                    		$(".commom-table-header tr:first td:last",".sumDiv")
                    		.attr("colspan",data.data.length);
                    		for(var i=0;i<data.data.length;i++){
                    			$(".commom-table-header tr:last",".sumDiv")
                        		.append("<td class='width-px-60'>"+data.data[i].faultName+"</td>");
                        		
                    		}  
                    		theadTdArray=new Array();
                    		theadTdWidth=0;
                    		var tds=$(".commom-table-header tr:last td",".sumDiv");
                    		for(var i=0;i<tds.length;i++){
                    			
                        		theadTdWidth+=$(tds[i]).width();
                    		}

                    	}
                    },
                    error: function (e) {
                    	alert(e);
                    }
                  };
            RTU.invoke("core.router.get", param);
        	
        };
       var sumQuery=function(data){
    	   RTU.invoke("core.router.get", {
                url:"lkj15feedback/searchSumInfoByProperty?fdate="+data.fdate
   			+"&tdate="+data.tdate+"&shortname="+data.shortname+
			"&recUser="+data.recUser+"&date="+new Date(),
               success: function (obj) {
                   if (obj.success) {
                	   var d = obj.data;
                       var table = $(".commom-table-main-content-table",".sumDiv");
                       table.empty();
                       var arr = [];
                       for (var i = 0; i < d.length; i++) {
                           var str="<tr><td class='width-px-40'>"+(i+1)+"</td><td class='width-px-60'>"+d[i].ttypeShortname+"</td>";
                           for(var j=0;j<d[i].faultTypeList.length;j++){
                        	   str+="<td class='width-px-60'>"+d[i].faultTypeList[j].faultCount+"</td>";
                           }
                           
                        	   str+="</tr>";   
                        	arr.push(str);   
                       }
                       table.append(arr.join(""));
                       totalWidth=0;
                       var tdChildren=$($("tr",table)[0]).find("td");
                       for(var i=0;i<tdChildren.length;i++){
                    	   /*totalWidth+=$(tdchildren[i]).width();*/
                    	   theadTdArray[i].css({width:$(tdChildren[i]).width()});
                       }
/*                       if(totalWidth>theadTdWidth){
                    	   //有滚动条需要重新设置td宽度
                    	   for(var i=0;i<theadTdArray.length;i++){
                    		   theadTdArray[i].css({width:})
                    	   }
                       }*/

                       //更改一行的背景颜色
                       $(".commom-table-main-content-table tr",".sumDiv").click(function () {
                           $(".commom-table-main-content-table tr",".sumDiv").removeClass("visited");
                           $(this).removeClass("visited").addClass("visited");

                       });
                       
                   } else {
                       RTU.invoke("header.notice.show", obj.msg);
                   }
               },
               error: function (e) {
                   RTU.invoke("header.notice.show", "添加记录失败:"+e);
               }
           });
       };
        return function () {
        	$(".recUserInput",".mainTab_Add").val(RTU.data.user.realName);
            initSave();//保存按钮初始化
            initReset();//重置初始化按钮
            initQuery();//查询按钮初始化
            initExportToExcel();//查询数据导出excel
            initTopButtonClick();//顶部按钮初始化
            initSumQuery();
            initExportToExcel_Sum();
            initSumTab_Head();
        };
        
	});

	//初始化文件上传插件
    RTU.register("app.equipmentqualitytrack.inituploadify", function () {
        return function (data) {
        	//上传文件插件的处理  
            $("#feedback_loadFile",".feedbackDiv").uploadify({
                swf: '../static/js/jquery-uploadify/swf/uploadify.swf', //按钮路径
                uploader: '../lkj15feedback/upLoadFile', //请求后台URL
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
                    $(".fileUploadInput",".feedbackDiv").val(name);
                },
                onSelectError: function(file, errorCode, errorMsg){
                	
                },
                onUploadSuccess: function (file, data, response) {
                    if(data){
                    	$(".attachFileName",".feedbackDiv").val(data);
                    }
                    else{
                    	RTU.invoke("header.notice.show", "上传文件失败!");
                    }
                },
                onCancel: function () {
                    $(".fileUploadInput",".feedbackDiv").val("");
                }   
            });
        };
    });
    
    
});
