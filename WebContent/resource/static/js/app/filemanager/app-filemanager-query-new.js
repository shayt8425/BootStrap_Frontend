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
    require("../common/common.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
    require("app/filemanager/app-filemanager-tree.js");
    var $html;
	var popuwnd;
	var data;
	
	
	RTU.register("app.filemanager.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/filemanager/app-filemanager-query-new.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				
				RTU.invoke("app.filemanager.query.create");
				$(".filemanagerSubmit").unbind("click").click(function(){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
						var data=checkInputData();
						if(data!=false){
							RTU.invoke("app.filemanager.query.showData",data);
						};
					},10);
					
				}); 
				
				$(".filemanagerReset").unbind("click").click(function(){
					$(".leftFileDiv #filemanager_loco").val("");
					$("#filemanager_queryTab").find("input,select").val("");
					$(".filemanagerSubmit").click();
					
				}); 
				
				$(".rightFileDiv select").unbind("change").bind("change",function(){
					$(".filemanagerSubmit").click();
				}); 
				

	            //根据条件查询
	            $("#leftFileDiv .filetransferSearchBut").unbind("click").bind("click",function () {
	            	if($.trim($("#filemanager_loco").val())==""){
	            		$("#leftFileDiv .filetransferShowAllBut").click();
	            		return;
	            	}
	            	else{
						$("#filemanager_queryTab").find("input,select").val("");
						$(".filemanagerSubmit").click();
						return;
	            	}
	            	/*var str = $.trim($("#filemanager_loco").val());
	            	var checkbox=$("#leftTrainMainDiv input[type='checkbox'][locoStr='"+str+"']");
	            	if(checkbox.length==0){
	            		alert("无该机车文件记录");
	            		return;
	            	}
	            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
						
		                
		                $("#leftTrainMainDiv input[type='checkbox]").attr("checked",false);
		                
		                checkbox.attr("checked",true);
		                var locoStr=checkbox.attr("locoTypeId")+","+
		                checkbox.attr("locoNo")+","+checkbox.attr("locoAb");          	
		                var queryData={};            	
		                queryData.url="../filemanager/searchFilesByLoco?locoStr="+locoStr;
		            	RTU.invoke("app.filemanager.query.showData",queryData);
					},10);*/
	            	
	            });
	            //查询全部
	            $("#leftFileDiv .filetransferShowAllBut").unbind("click").bind("click",function () {
	            	$("#filemanager_loco").val("");
	            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
						var queryData={};            	
		                queryData.url="../filemanager/searchFilesByLoco?locoStr=";
		            	RTU.invoke("app.filemanager.query.showData",queryData);
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
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
	//获得查询参数
	var checkInputData=function(){
		var data={};
		data.Firsttime=$("#filemanagerFirst_time").val();
		data.Finishtime=$("#filemanagerFinish_time").val();
		data.checi=$("#filemanager_checi").val().toUpperCase() ;
		data.driver=$("#filemanager_driver").val();
		data.dwd=$("#filemanager_dwd").val();
		data.cj=$("#filemanager_cj").val();
		data.fileType=$("#filemanager_fileType").val();
		data.locoAB="";
		tempdata=$.trim($("#filemanager_loco").val());
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
			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			/*Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;*/
			Twitdh=Resolution.Twidth;
			Theight=Resolution.Theight-60;
			if (!popuwnd) {
				popuwnd = new PopuWnd({
					title : data.alias,
					html : $html,
					width : Twitdh,
					height : Theight,
					left : 0,
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
					$("#filemanager_queryTab input,select").val("");
					$(".filemanagerSubmit").click();
				},100);
			}
			/*if(intervalObj)window.clearInterval(intervalObj);
			intervalObj=window.setInterval(function(){
            	RTU.invoke("app.filemanager.query.showData",checkInputData());
            },20000);*/
			RTU.invoke("app.filemanager.query.dataInit", "");
			
//			RTU.invoke("app.filemanager.query.create", $html);
		};
	});
	RTU.register("app.filemanager.query.deactivate", function() { //隐藏
		return function() {
			/*window.clearInterval(intervalObj);*/
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
            autocompleteBuilder1($("#filemanager_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            $('#filemanager_loco').result(function (event, autodata, formatted) {
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
