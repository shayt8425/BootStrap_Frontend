RTU.DEFINE(function(require, exports) {
/**
 * 模块名：文件管理
 * name：filemanager
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
    require("../common/common.js")
    require("../../../css/app/locomotivequery/locospread-queryTe.css")
    require("app/filemanager/app-filemanager-query-quality.js");
    var $html;
	var popuwnd;
	var data;
	
	
	RTU.register("app.filemanager.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/filemanager/app-filemanager-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				
				RTU.invoke("app.filemanager.query.create");
				$(".filemanagerSubmit").unbind("click").click(function(){
					var data=checkInputData();
					if(data!=false){
						RTU.invoke("header.msg.show", "加载中,请稍后!!!");
						RTU.invoke("app.filemanager.query.showData",data);
						RTU.invoke("header.msg.hidden");
					}
				}); 
				$(".filemanagerQuality").unbind("click").click(function(){
					boxes = trainislateGrid.selectItem();
                    var paramData = {};
                    if (boxes.length > 0) {
                        $.each(boxes, function (i, n) {
                            $n = $(n).data("itemData");
                           	paramData.locoTypeName=$n.shortname;
                           	paramData.locono=$n.locoNo;
                           	var arr=new Array();
                			arr.push(paramData);
                			arr.push($n.downloadFilename);
                			//弹出文件查看窗口
                			RTU.invoke("app.filetransfer.lookfile.init",arr);
                        });
         	           	
                    }
                    else{
                    	 RTU.invoke("header.notice.show", "请选择一个文件！");
                    }
				});
				
				$(".filemanagerZlfx").unbind("click").click(function(){///////
					boxes = trainislateGrid.selectItem();
                    var paramData = {};
                    if (boxes.length > 0) {
                        $.each(boxes, function (i, n) {
                            $n = $(n).data("itemData");
                           	paramData.locoTypeName=$n.shortname;
                           	paramData.locono=$n.locoNo;
                           	var arr=new Array();
                			arr.push(paramData);
                			arr.push($n.downloadFilename);
                			//弹出文件查看窗口
                			RTU.invoke("app.filemanager.quality.init",arr);
                        });
         	           	
                    }
                    else{
                    	 RTU.invoke("header.notice.show", "请选择一个文件！");
                    }
				});//////////////
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.filemanager.query.showData",function(){
		var refreshFun=function(data){
//    		var showData=[];
//    		if(data&&data.length>0){
//    			showData=data;
//    		}
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-145;
			Theight=Resolution.Theight-175;			
    		trainislateGrid = new RTGrid({
    			url:"../filemanager/querytrainisantecedents?Fdate="
    				+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="
    				+data.loco+"&shortname="+data.shortname+"&locoAB="
    				+data.locoAB+"&checi="+data.checi+"&driver="+data.driver,
//                datas: showData,
                containDivId: "filemanager-bodyDiv-body-grid",
                tableWidth: Twitdh,
                tableHeight: Theight,
                isSort: true, //是否排序
                hasCheckBox: true,
                showTrNum: false,
                isShowPagerControl: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize =30;
    			},
    			 replaceTd:[
           					
           					{index: 1, fn: function (data,j,ctd,itemData) {
           						return itemData.shortname+"-"+itemData.locoNo;
           						
           					}},
           					{index: 2, fn: function (data,j,ctd,itemData) {
           						return data.split("-")[0];
           						
           					}},
           					{index: 4, fn: function (data,j,ctd,itemData) {
           						return data.split("-")[1].split(".")[0];
           						
           					}},
           					{index: 7, fn: function (data,j,ctd,itemData) {
           						return data==0?"手动下载":"自动下载";
           						
           					}}
           					],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");

                },
                colNames: ["文件名", "机车", "车次",  "站段",  "司机",  "文件大小","下载时间","下载方式"],
                colModel: [{ name: "downloadFilename" }, { name: "shortname"}, { name: "downloadFilename"}, { name: "dName"}, { name: "downloadFilename"}, { name: "downLen"},{ name: "finishTime"},{ name: "requestMode"}]
            });
    		$(".RTTable_Head tr td:first",$(".trainistrainisAntecedents_div")).html("序号");
    	};
    	
    	return function(data){
    		/*if (data.loco==""){
        		RTU.invoke("header.alarmMsg.show","请输入机车型号，机车号");
    			return false;
    		}
    		if (data.Firsttime==""){
        		RTU.invoke("header.alarmMsg.show","请输入开始时间");
    			return false;
    		}
    		if (data.Finishtime==""){
        		RTU.invoke("header.alarmMsg.show","请输入结束时间");
    			return false;
    		};
    		*/
    		refreshFun(data);
    		$(".RTTable-Body tbody tr","#filemanager-bodyDiv-body-grid").unbind("dblclick").bind("dblclick",function(){
    			var tds=$(this).children("td");
    			var paramData = {};
    			paramData.locoTypeName=$(tds[2]).html().split("-")[0];
               	paramData.locono=$(tds[2]).html().split("-")[1];
    			var arr=new Array();
    			arr.push(paramData);
    			arr.push($(tds[1]).html());
    			//弹出文件查看窗口
    			RTU.invoke("app.filetransfer.lookfile.init",arr);
				
			});
 /* 		var url="filemanager/querytrainisantecedents?Fdate="+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="+data.loco+"&shortname="+data.shortname;
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
            */

    	};
	});
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
	//获得查询参数
	var checkInputData=function(){
		var data={};
		data.Firsttime=$("#filemanagerFirst_time").val();
		data.Finishtime=$("#filemanagerFinish_time").val();
		data.checi=$("#filemanager_checi").val();
		data.driver=$("#filemanager_driver").val();
		data.locoAB="";
		tempdata=$("#filemanager_loco").val();
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
			if ((lastStr!="B")&&(lastStr!="A"))
			{
				var locoAb=$("#filemanager_loco").attr("locoAb");
				if(!locoAb)locoAb="0";
				data.locoAb=locoAb;
			};
		}else{
			data.loco="";
			data.shortname="";
			data.locoAb="";
		}

		return data;		
	};
	RTU.register("app.filemanager.query.activate", function() { //使得popuwnd对象活动
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
			if(intervalObj)window.clearInterval(intervalObj);
			intervalObj=window.setInterval(function(){
            	RTU.invoke("app.filemanager.query.showData",checkInputData());
            },10000);
//			RTU.invoke("app.filemanager.query.create", $html);
		};
	});
	RTU.register("app.filemanager.query.deactivate", function() { //隐藏
		return function() {
			window.clearInterval(intervalObj);
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	
    //搜索框智能提示
    RTU.register("app.filemanager.query.create", function () {
        var autocompleteBuilder1 = function (object, url, exParams, parse) {
            try {
                url = "../" + url;
                object.autocomplete(url, {
                    minChars: 0,
                    width: 172,
                    matchContains: true,
                    autoFill: false,
                    max: 100,
                    dataType: "json",
                    extraParams: exParams,
                    parse: parse,
                    formatItem: function (data, i, totle) {
                        return data;
                    },
                    formatResult: function (format) {
                        return format;
                    }
                });

            } catch (e) {
            }
        };
        var initCheciNameAuto1 = function () {
            CheciNameExParams1 = {
                keyword: function () {
                    return $('#filemanager_loco').val();
                }
            };

            CheciNameParse1 = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text1 = $.trim(data[i].locoTypeName);
                    var text4 = $.trim(data[i].locoNO);
                    var text5 = $.trim(data[i].locoAb);
                    if(text5==0){
                    	text5="";
                    }else if(text5=="1"){
                    	text5="A";
                    }else{
                    	text5="B";
                    }
                    var aa = text1 + "-" + text4+text5;
                    rows[rows.length] = {
                        data: "<table style='z-index:99999;'><tr><td align='center' style='width:85px;'>" + aa + "</td></tr></table>",
                        value: aa+"_"+data[i].locoAb,
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#filemanager_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            $('#filemanager_loco').result(function (event, autodata, formatted) {
                /*if (!formatted) {
                    $('#filemanager_loco').val(formatted);
                }*/
            	if(formatted){
            		var arr=formatted.split("_");
            		if(arr.length>1){
            			$('#filemanager_loco').val(arr[0]);
            			$('#filemanager_loco').attr("locoAb",arr[1]);
            		}
            		else $('#filemanager_loco').val(formatted);
            	}
            	
            });
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
                $(".filemanagerSubmit").click();
                
            }, 10);
        };
    });
    var intervalObj=null;
	/* RTU.register("app.filemanager.query.create", function () {
		    var inittrainStrAuto = function () {
		        trainStrExParams = {
		            shortName: function () {
		                var val = RTU.invoke("app.common.query.splitlocoNo", $('#trainisAntecedents_loco').val());
		                return val.locoTypeName; //机车型号
		            },
		            locoNo: function () { 
		                var val = RTU.invoke("app.common.query.splitlocoNo", $('#trainisAntecedents_loco').val());
		                return val.locoNo;//机车号
		            }
		        };
		        trainStrParse = function (data) {  //给机车型号和机车号增加-符号
		            data = data.data;
		            var rows = [];
		            for (var i = 0; i < data.length; i++) {
		                var text1 = replaceSpace(data[i].locoTypeName);
		                var text2 = replaceSpace(data[i].locoNo);
		                if (text2 != "") {
		                    text2 = "-" + text2;
		                }
		                var text = text1 + text2;
		                rows[rows.length] = {
		                    data: text,
		                    value: text,
		                    result: text
		                };
		            }
		            return rows;
		        };
		        //绑定插件
		        RTU.autocompleteBuilder($("#trainisAntecedents_loco"), "/traintype/searchByLocoTypeAndLocoNo", trainStrExParams, trainStrParse);
		        try {
		            if ($('#trainisAntecedents_loco').result)
		                $('#').result(function (event, autodata, formatted) { $('#trainisAntecedents_loco').val(formatted); });
		        }
		        catch (e) {
		        }  
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
		    	inittrainStrAuto();
		    };
		 
	 }); */

	
	RTU.register("app.filemanager.query.init", function() {
		data = RTU.invoke("app.setting.data", "filemanager");
		if (data && data.isActive) {
			RTU.invoke("app.filemanager.query.activate");  
		}		
		return function() {
			return true;
		};
	});
});
