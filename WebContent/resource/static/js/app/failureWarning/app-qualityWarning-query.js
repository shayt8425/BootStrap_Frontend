RTU.DEFINE(function (require, exports) {
/**
 * 模块名：设备监测-实时事件分析-query
 * name： qualitywarning
 * date:2016-03-23
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../common/common.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
        
    var $html;
	var popuwnd;
	var data;
	var qualityWarningGrid;
    	
	RTU.register("app.qualitywarning.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/failureWarning/app-qualitywarning-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				
				RTU.invoke("app.qualitywarning.query.create");
				$(".qualitywarningSubmit").unbind("click").click(function(){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
						var data=checkInputData();
						if(data!=false){
							RTU.invoke("app.qualitywarning.query.showData",data);
						};
					},10);
					
				}); 
				
				$(".rightFileDiv .qualitywarningReset").unbind("click").click(function(){
					$("#qualitywarning_loco").val("");
					$("#qualitywarning_queryTab").find("input,select").val("");
					$(".qualitywarningSubmit").click();	
				}); 
				
				$(".rightFileDiv select").unbind("change").bind("change",function(){
					$(".qualitywarningSubmit").click();
				}); 				
	            //查询全部
	            $(".rightFileDiv .filetransferShowAllBut").unbind("click").bind("click",function () {
	            	$("#qualitywarning_loco").val("");
	            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
		            	RTU.invoke("app.qualitywarning.query.showData");
					},10);
	            	
	            });
			}
		});
		return function() {
			return true;
		};
	});
	
	var intervalObj=null;
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth-135;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
	
	//获得查询参数
	var checkInputData=function(){
		var data={};
		data.Firsttime=$("#qualitywarningFirst_time").val();
		data.Finishtime=$("#qualitywarningFinish_time").val();
		/*data.locoName=$("#qualitywarning_checi").val().toUpperCase() ;*/
		data.dwd=$("#qualitywarning_dwd").val();
		data.cj=$("#qualitywarning_cj").val();
		data.itemCode=$("#qualitywarning_eventType").val();
		data.loconame=$.trim($("#qualitywarning_loco").val()).toUpperCase();
		data.itemtypeId=$("#qualitywarning_itemType").val();
		return data;		
	};
	RTU.register("app.qualitywarning.query.activate", function() { //使得popuwnd对象活动
		return function() {
			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			/*Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;*/
			Twitdh=Resolution.Twidth*0.95;
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
				window.setTimeout(function(){
					$("#qualitywarning_queryTab input,select").val("");
					$(".qualitywarningSubmit").click();
				},100);
			}
			RTU.invoke("app.qualitywarning.query.dataInit", "");
		};
	});
	RTU.register("app.qualitywarning.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	
    //搜索框智能提示
    RTU.register("app.qualitywarning.query.create", function () {
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
                    mustMatch:true,
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
                    return $('#qualitywarning_loco').val();
                }
            };

            CheciNameParse1 = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text1 = $.trim(data[i].locoTypeName);
                    var text4 = $.trim(data[i].locoNO);
                    var text5 = $.trim(data[i].locoAb);
                    if(text5!="1"&&text5!="2"){
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
            autocompleteBuilder1($("#qualitywarning_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            /*$('#qualitywarning_loco').result(function (event, autodata, formatted) {
            	if(formatted){
            		var arr=formatted.split("_");
            		if(arr.length>1){
            			$('#qualitywarning_loco').val(arr[0]);
            			$('#qualitywarning_loco').attr("locoAb",arr[1]);
            		}
            		else $('#qualitywarning_loco').val(formatted);
            	}
            });*/
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
                $(".qualitywarningSubmit").click();
            }, 10);
        };
    });
    


	
	RTU.register("app.qualitywarning.query.init", function() {
		data = RTU.invoke("app.setting.data", "qualitywarning");
		if (data && data.isActive) {
			RTU.invoke("app.qualitywarning.query.activate");  
		}		
		return function() {
			return true;
		};
	});
	
	
    //初始化按钮
    RTU.register("app.qualitywarning.query.initButton", function () {
        return function () {};
    });


    
	RTU.register("app.qualitywarning.query.showData",function(){
		var initClickFn=function(){
			
		};
		var refreshFun=function(data){
			$("#qualitywarning-quality-grid").empty().removeClass("containGridDiv");
			var width=$("#qualitywarning-bodyDiv-body-grid").width();
			qualityWarningGrid = new RTGrid({
    			url:encodeURI("../qualityalarm/getqualityalarm?Firsttime="
    				+data.Firsttime+"&Finishtime="+data.Finishtime+"&loconame="
    				+data.loconame+"&deptdw="+data.dwd+"&cj="+data.cj
    				+"&itemCode="+data.itemCode+"&itemtypeId="+data.itemtypeId),
                containDivId: "qualitywarning-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#qualitywarning-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				
    			},
    			 replaceTd:[],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                    initClickFn();
                },
                colNames: ["机车", "电务段", "车间","事件名称","项点类型","发生时间","事件描述"],
                colModel: [{ name: "locoName",width:width*0.1}, 
                           { name: "deptDw",width:width*0.05}, 
                           { name: "cj",width:width*0.05}, 
                           { name: "itemName",width:width*0.1},
                           { name: "itemtypeName",width:width*0.05}, 
                           { name: "lkjTime",width:width*0.1},{name:"resultInfo"}]
            });
    		$(".RTTable_Head tr td:first",$("#qualitywarning-bodyDiv-body-grid")).text("序号");
    		RTU.invoke("header.msg.hidden");
    	};
    	
    	return function(data){
    		refreshFun(data);
    		initClickFn();
    	};
	});
	var curObj=null;
	var fileName=null;
});
