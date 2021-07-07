RTU.DEFINE(function(require, exports) {
/**
 * 模块名：列车正晚点
 * name：trainislate
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    
    var $html;
	var popuwnd;
	var data;
	
	RTU.register("app.trainislate.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/trainislate/app-trainislate-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				RTU.invoke("app.trainislate.query.create", $html);
				
//				$("#trainislate_loco").inputTip({ text: "" });
//				$("#trainislate_checi").inputTip({ text: "" });
//				$("#trainislate_loco").unbind("blur").blur(function(){
//					if($("#trainislate_loco").val()!="")$("#trainislate_checi").val("");
//					$("#trainislate_checi").unautocomplete();
//					initcheciStrAuto();
//				});
//				$("#trainislate_loco").unbind("click").click(function(){
//					if($("#trainislate_loco").val()!="")$("#trainislate_checi").val("");
//					$("#trainislate_checi").unautocomplete();
//					initcheciStrAuto();
//				});
				
				$(".trainislateSubmit").unbind("click").click(function(){					
					var data=checkInputData();
					if(data!=false){
						RTU.invoke("app.trainislate.query.showData",data);
					}
				});
				
			}
		});
		return function() {
			return true;
		};
	});
	RTU.register("app.trainislate.query.activate", function() {
		return function() {
			RTU.invoke("header.msg.hidden");
			var width = $("body").width() - 640;
			var height = $("body").height() - 120;
			if (!popuwnd) {
				popuwnd = new PopuWnd({
					title : data.alias,
					html : $html,
					width : 800,
					height : 450,
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
			RTU.invoke("app.trainislate.query.create", $html);
		};
	});
	RTU.register("app.trainislate.query.deactivate", function() {
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	RTU.register("app.trainislate.query.init", function() {
		data = RTU.invoke("app.setting.data", "trainislate");
		if (data && data.isActive) {
			RTU.invoke("app.trainislate.query.activate");
		}		
		return function() {
			return true;
		};
	});
    
	RTU.register("app.trainislate.query.showData",function(){
    	var getConditions=function(){
    		 var date=$("#trainislate_time").val();
    		 var checi=$("#trainislate_checi").val();
    		 var data={
    				 date:date,
    				 checi:checi
    		 };
    		 return data;
    	};
    	var refreshFun=function(data){
    		var showData=[];
    		if(data&&data.length>0){
    			showData=data;
    		}
    		trainislateGrid = new RTGrid({
                datas: showData,
                containDivId: "trainislate-bodyDiv-body-grid",
                tableWidth: 795,
                tableHeight: 380,
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize =3000;
    			},
    			replaceTd: [{ index: 1, fn: function (data, j, ctd, itemData) {
               	 if (data == "") {
                        return "--:--";//始发站
                 }
                 return data;
               }},{ index: 2, fn: function (data, j, ctd, itemData) {
                 	 if (data == "") {
                         return "--:--";//终点站
                  }
                  return data;
                }},{ index: 3, fn: function (data, j, ctd, itemData) {
	              return "--:--";
	            }},{ index: 4, fn: function (data, j, ctd, itemData) {
		          return "";
		        }}],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");

                },
                colNames: ["车站", "固定到达", "固定开车",  "实际时间",  "正晚点"],
                colModel: [{ name: "station", width: "80px", isSort: true }, { name: "atime", width: "80px", isSort: true }, { name: "stime", width: "92.5px", isSort: true }, { name: "rtime", width: "92.5px", isSort: true }, { name: "spanMinutes", width: "92.5px"}]
            });
    		$(".RTTable_Head tr td:first",$("#trainislate-bodyDiv-body-grid")).html("序号");
    	};
    	return function(){
    		var conditions=getConditions();
    		if(conditions.checi==""){
    			RTU.invoke("header.alarmMsg.show","请输入车次");
    			return false;
    		}
    		var url="stationtime/queryLocoTimeLate?date="+conditions.date+"&checi="+conditions.checi;

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
    	};
    });
	
	
	 //得到提交的值，查询条件
    function checkInputData(){
		var data={};
		data.datetime=$("#trainislate_time").val();
		data.checi=$("#trainislate_checi").val();
		return data;
  	}
	
	 //智能搜索
    RTU.register("app.trainislate.query.create", function () {
    	 var inittrainStrAuto = function () {//机车
             trainStrExParams = {
                 shortName: function () {
                     var val = RTU.invoke("app.trainislate.query.splitlocoNo", $('#trainislate_loco').val());
                     return val.locoTypeName;
                 },
                 locoNo: function () {
                     var val = RTU.invoke("app.trainislate.query.splitlocoNo", $('#trainislate_loco').val());
                     return val.locoNo;
                 },
                 locoAb: function () {
                     var val = RTU.invoke("app.trainislate.query.splitlocoNo", $('#trainislate_loco').val());
                     return val.locoAb;
                 }
             };
             trainStrParse = function (data) {
                 data = data.data;
                 var rows = [];
                 for (var i = 0; i < data.length; i++) {
                     var text1 = replaceSpace(data[i].locoTypeName);
                     var text2 = replaceSpace(data[i].locoNo); 
                     var text3 = replaceSpace(data[i].locoAb); 
                     if (text2 != "") {
                         text2 = "-" + text2;
                     }
                     if(text3 !='2'&&text3!='3'){
                     	text3="";
                     }else if(text3 == '1'){
                     	text3="A";
                     }else{
                     	text3="B";
                     }
                     var text = text1 + text2 + text3;
                     rows[rows.length] = {
                         data: text,
                         value: text,
                         result: text
                     };
                 }
                 return rows;
             };
             autocompleteBuilder($("#trainislate_loco"), "traintype/searchByLocoTypeAndLocoNo", trainStrExParams, trainStrParse);
             try {
                 if ($('#trainislate_loco').result)
                     $('#').result(function (event, autodata, formatted) { $('#trainislate_loco').val(formatted); });
             }
             catch (e) {
             }
         };
         
         var initcheciStrAuto = function () {
         	checiStrExParams = {
         		loco:$('#trainislate_loco').val(),
         	};
         	checiStrParse = function (data) {
         		
                 data = data.data;
                 var rows = [];
                 for (var i = 0; i < data.length; i++) {
                     var text = replaceSpace(data[i]);
                     rows[rows.length] = {
                         data: text,
                         value: text,
                         result: text
                     };
                 }
                 return rows;
         	};
            
         	autocompleteBuilder($("#trainislate_checi"), "stationtime/queryEffectiveCheci", checiStrExParams, checiStrParse);
         	try {
         		$('#trainislate_checi').result(function (event, autodata, formatted) {
         			$('#trainislate_checi').val(formatted);
         		});
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
       return function () {
    	   
       	   $("#trainislate_loco").inputTip({ text: "" });
           $("#trainislate_checi").inputTip({ text: "" });
           
           inittrainStrAuto();
           
           initcheciStrAuto();
       };
   });
   
   
   
 //显示智能搜提示
   var autocompleteBuilder = function (object, url, exParams, parse) {
   	try {
   		url = "../" + url;                
   		
   		object.autocomplete(url, {
   			minChars: 0,
   			width: 156,
   			matchContains: true,
   			autoFill: false,
   			max: 100,
   			dataType: "jsonp",
   			extraParams: exParams,
   			parse: parse,
   			formatItem: function (item) {
   				return item;
   			},
   			formatResult: function (format) {
   				return format;
   			}
   		});
   	} catch (e) {
   	}
   };
   
// 拆分机车字符串
   RTU.register("app.trainislate.query.splitlocoNo", function () {
       return function (locoTypeStr) {
           var locoTypeName = "";
           var locoNo = "";
           var locoAb = "";
           if (locoTypeStr == "") {
               return {
                   locoTypeName: "",
                   locoNo: ""
               };
           }
           //是纯数字的时候约定输入的是机车号
           var n = Number(locoTypeStr);
           if (!isNaN(n)) {
               locoTypeName = "";
               locoNo = locoTypeStr;
           } else {
               var str = locoTypeStr.split('-');
               if (str.length == 2) {
                   locoTypeName = str[0];
                   locoNo = str[1];
               } else if (str.length > 2) {
                   locoTypeName += str[0];
                   for (var i = 1; i < str.length - 1; i++) {
                       locoTypeName += ("-" + str[i]);
                   }
                   locoNo = str[str.length - 1];
               } else if (str.length < 2) {
                   locoTypeName = locoTypeStr;
               }
           }
           return {
               locoTypeName: locoTypeName,
               locoNo: locoNo,
               locoAb:locoAb
           };
       };
   });
	
	
    
//	//根据机车在车次选择列表上显示车次
//	RTU.register("app.trainislate.query.showCheci",function(){
//		return function(data){
//			$(".trainislate_checi").empty();
//			var url="stationtime/queryCheciByLoco";
//    		var param={
//	              url: url,
//	              data:{
//	            	  "loco":data.locovalue,
//	              },
//	              cache: false,
//                  asnyc: true,
//                  datatype: "json",
//                  success: function (data) {
//                	  var datahtml="";
//                	  $.each(data.data, function (i, n) {
//                			  datahtml=datahtml+"<option value='"+n+"'>"+n+"</option>";
//                      }); 
//                	  $(".trainislate_checi").html(datahtml);
//                  },
//                  error: function () {
//                  }
//				};
//			   RTU.invoke("core.router.get", param);
//		};
//	});
	
//    //显示智能搜提示
//    var autocompleteBuilder = function (object, url, exParams, parse) {
//    	try {
//    		url = "../" + url;                
//    		
//    		object.autocomplete(url, {
//    			minChars: 0,
//    			width: 156,
//    			matchContains: true,
//    			autoFill: false,
//    			max: 100,
//    			dataType: "jsonp",
//    			extraParams: exParams,
//    			parse: parse,
//    			formatItem: function (item) {
//    				return item;
//    			},
//    			formatResult: function (format) {
//    				return format;
//    			}
//    		});
//    	} catch (e) {
//    	}
//    };
//    var initcheciStrAuto = function () {
//    	checiStrExParams = {
//    		loco:$('#trainislate_loco').val(),
//    	};
//    	checiStrParse = function (data) {
//    		
//            data = data.data;
//            var rows = [];
//            for (var i = 0; i < data.length; i++) {
//                var text = replaceSpace(data[i]);
//                rows[rows.length] = {
//                    data: text,
//                    value: text,
//                    result: text
//                };
//            }
//            return rows;
//    	};
//       
////    	autocompleteBuilder($("#trainislate_checi"), "stationtime/queryCheciByLoco", checiStrExParams, checiStrParse);
//    	autocompleteBuilder($("#trainislate_checi"), "stationtime/queryEffectiveCheci", checiStrExParams, checiStrParse);
//    	try {
//    		$('#trainislate_checi').result(function (event, autodata, formatted) {
//    			$('#trainislate_checi').val(formatted);
//    		});
//    	}
//    	catch (e) {
//    	}
//    };
//    var replaceSpace = function (text) {
//        if (text) {
//            var reg = /\s/g;
//            return text.replace(reg, "");
//        } else {
//            return "";
//        }
//    };
//    RTU.register("app.trainislate.query.create", function () {
//        var inittrainStrAuto = function () {
//            trainStrExParams = {
//                shortName: function () {
//                    var val = RTU.invoke("app.trainislate.query.splitlocoNo", $('#trainislate_loco').val());
//                    return val.locoTypeName;
//                },
//                locoNo: function () {
//                    var val = RTU.invoke("app.trainislate.query.splitlocoNo", $('#trainislate_loco').val());
//                    return val.locoNo;
//                }
//            };
//            trainStrParse = function (data) {
//                data = data.data;
//                var rows = [];
//                for (var i = 0; i < data.length; i++) {
//                    var text1 = replaceSpace(data[i].locoTypeName);
//                    var text2 = replaceSpace(data[i].locoNo);
//                    if (text2 != "") {
//                        text2 = "-" + text2;
//                    }
//                    var text = text1 + text2;
//                    rows[rows.length] = {
//                        data: text,
//                        value: text,
//                        result: text
//                    };
//                }
//                return rows;
//            };
//            autocompleteBuilder($("#trainislate_loco"), "traintype/searchByLocoTypeAndLocoNo", trainStrExParams, trainStrParse);
//            try {
//                $('#trainislate_loco').result(function (event, autodata, formatted) {
//                	$('#trainislate_loco').val(formatted);
//                });
//            }
//            catch (e) {
//            }
//        };
//
//		return function (data) {
//			setTimeout(function () {
//                inittrainStrAuto();
//                initcheciStrAuto();
//            }, 500);
//            $("#trainislate_loco").inputTip({ text: "" });
//            $("#trainislate_checi").inputTip({ text: "" });
//		};
//    });

//	// 拆分机车字符串
//    RTU.register("app.trainislate.query.splitlocoNo", function () {
//        return function (locoTypeStr) {
//            var locoTypeName = "";
//            var locoNo = "";
//            if (locoTypeStr == "") {
//                return {
//                    locoTypeName: "",
//                    locoNo: ""
//                };
//            }
//            var str = locoTypeStr.split('-');
//            if (str.length == 2) {
//                locoTypeName = str[0];
//                locoNo = str[1];
//            } else if (str.length > 2) {
//                locoTypeName += str[0];
//                for (var i = 1; i < str.length - 1; i++) {
//                    locoTypeName += ("-" + str[i]);
//                }
//                locoNo = str[str.length - 1];
//            } else if (str.length < 2) {
//                locoTypeName = locoTypeStr;
//            }
//            return {
//                locoTypeName: locoTypeName,
//                locoNo: locoNo
//            };
//        };
//    });
});
