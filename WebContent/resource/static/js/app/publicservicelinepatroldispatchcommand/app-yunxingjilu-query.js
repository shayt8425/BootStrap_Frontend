RTU.DEFINE(function (require, exports) {
/**
 * 模块名：运行记录
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
    require("My97DatePicker/WdatePicker.js");
    require("app/common/front_common.js");
    window.yunxingjiluPopuwnd;
    var g;
    window.format2;
    
    RTU.register("app.publicservicelinepatroldispatchcommand.loadHtmldata", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                        }
                    }
                });
            }
        };
    });
    
    //创建查询窗口
    RTU.register("app.publicservicelinepatroldispatchcommand.query.activate", function () {
        return function (data) {
        	//RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            //查询窗口
            RTU.invoke("app.publicservicelinepatroldispatchcommand.loadHtmldata", { url: "../app/modules/realtimelocomotivequery/app-yunxingjilu-query.html", fn: function (html) {
            	$html = $(html);
            	var width = document.documentElement.clientWidth * 0.9;
                var height = document.documentElement.clientHeight * 0.9;
                //判断窗口是否存在
                if (window.yunxingjiluPopuwnd) {
                	window.yunxingjiluPopuwnd.close();
                	window.yunxingjiluPopuwnd=undefined;
                }
            	if (!window.yunxingjiluPopuwnd) {
                	window.yunxingjiluPopuwnd = new PopuWnd({
                		title:"运行记录",
                		html: html,
                        width: width,
                        height: height,
                        left:115,
                        top: 60,
                        shadow: true
                    });
                	window.yunxingjiluPopuwnd.init();
                }else {
                	window.yunxingjiluPopuwnd.init();
                }
            	
              //重写关闭的方法
                window.yunxingjiluPopuwnd.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	window.yunxingjiluPopuwnd.close();
                	window.yunxingjiluPopuwnd=undefined;
                	RTU.invoke("header.msg.hidden");
                	RTU.invoke("header.alarmMsg.hide");
                });
                var kehuo=data.kehuo==1?"客车":"货车";
                var locoTypeNameAndLocoNoAndLocoAb=data.locoTypename+"-"+data.locoNo;
                 if (data.locoAb == "1") {
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
	            } else if (data.locoAb == "2"){
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb+ window.locoAb_B;
	            }
                
            	$(".popuwnd-title-text",window.yunxingjiluPopuwnd.$wnd).html("<div>" +
                		"<div style='float:left;right:50px;width:150px;'>运行记录</div>" +
        				"<div style='float:left;right:50px;width:230px;'>机车型号："+locoTypeNameAndLocoNoAndLocoAb+"</div>" +
                		"<div style='float:left;right:50px;width:200px;'>客货："+kehuo+"</div>" +
        				"<div style='float:left;right:50px;width:200px;'>日期："+data.date+"</div>" +
						"</div>");
            	//初始化开始时间和结束时间空间框
            	var today = new Date();
            	$("#satrtDate").val(FrontCommon.getDateStr('yyyy-MM-dd HH:mm:ss', new Date(
            			today.getTime() - 3 * 24 * 60 * 60 * 1000)));
            	$("#endDate").val(FrontCommon.getDateStr('yyyy-MM-dd HH:mm:ss', today));
            	$("#yunxingjiluQryBtn").click(function(){
            		if(g){
            			//重载参数
            			 var param = $("#searchForm").serializeArray();
                         var paramObj = {pageSize:100};
                         for(var idx in param){
                        	 paramObj[param[idx].name] = param[idx].value;
                         }
            			 g.param.extraUrlParam = paramObj;
            			 g.refresh();
            		}
            	});//重载表格
                RTU.invoke("app.publicservicelinepatroldispatchcommand.query.loadDatas",data);
                /*RTU.invoke("core.router.get",
                		{
                		url:"lkjInfoHis/findOnlineLocoViewHisCountByTrain?locoTypeid="
                			+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+
                			"&pageSize="+g.pageSize+"&page="+g.pageIndex,
                		success:function(data){
                        	if(data.data&&data.data.totalPage){
                    			if(g){
                    				g.totalPage=resData.data.totalPage;
                    				g.setPageParam(data.data);
                    			}
                    		};
                		}
                		});*/
                
            }
            });
        };
    });
    
    
  //加载数据
    RTU.register("app.publicservicelinepatroldispatchcommand.query.loadDatas", function () {
        return function (data) {
        	 var imgurl0bj = {"1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
        	 //查询窗口
        	 var width = document.documentElement.clientWidth * 0.9;
             var height = document.documentElement.clientHeight * 0.9-30;
             
             //判断data是否含有alarmTime属性
             data.hasOwnProperty('alarmTime'); 
             var url;
             if (data.hasOwnProperty('alarmTime')) {
            	 url="../lkjInfoHis/findOnlineLocoViewHisByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+"&alarmTime="+data.alarmTime+"&flag=1";
             } else {
            	 url="../lkjInfoHis/findOnlineLocoViewHisByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb;
             }
             var param = $("#searchForm").serializeArray();
             var paramObj = {pageSize:100};
             for(var idx in param){
            	 paramObj[param[idx].name] = param[idx].value;
             }
        	 g = new RTGrid({
        		url:url,
        	     containDivId: "yunxingjilu_grid_result",
                 tableWidth:width,
                 tableHeight:height,
                 isSort: true,  //是否排序
                 showTrNum:true,
                 hasCheckBox:false,
                 clickIdItem:"lkjTime_locoNo_recId",
                 isShowRefreshImgControl:true,
                 setPageSize:[100,200,500],
                 extraUrlParam:paramObj,
                 beforeLoad:function(that){
                	 that.pageSize =100;
                 },
                 isShowPagerControl:true,   //显示分页
                 isShowRefreshImgControl:true,
                 isShowRefreshControl:false,
                 trRightClick:function(returnData){   //右键
                     
                 },
                 clickTrEvent: function (t) {   //点击行
                 },
                 loadPageCp:function(t){
                	 if(t.cDiv){
                		 t.cDiv.css("left","200px");
                		 t.cDiv.css("top","230px");
                		 window.setTimeout(function () {
                        	 t.cDiv.find(".RTGrid_Bodydiv").scrollTop(0);
                         }, 100);
                	 }
                     //debugger;
                     /*if (!t.param.datas&&t.param.datas.length == 0) {
                    	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                         return;
                     }
                     //滚动条设置顶端
                     */
                 },
                 replaceTd:[
					{index: 0, fn: function (data,j,ctd,itemData) {
						var time=itemData.lkjTime;//receiveTime;
						if(time==null){
							return "";
						}else{
							return window.format2(time);
						}
						
					}},{index: 1, fn: function (data,j,ctd,itemData) {
						var kiloSign = itemData.kiloSign;
						if(kiloSign == null){
							return "";
						}else {
							return kiloSign/1000;
						}
						
					}},{index: 3, fn: function (data,j,ctd,itemData) {
//						var signal = itemData.signalName + " " + itemData.signalId;
						var signal = itemData.signalName + " " + itemData.signalNo;
						if(signal == null){
							return "";
						}else{
							return signal;
						}
					}},{index: 4, fn: function (data,j,ctd,itemData) {
	             		var lightColor = itemData.lightColor;
	             		var imgurl = imgurl0bj[lightColor.toString()];
		             		if(imgurl == null){
		             			return "";
		             		}else{
		                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
		                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
		             		}
				        }
			        }],
//			      colNames: ["时间","列车位置","速度","限速","柴速","管压","缸压","工况","信号","公里标","信号机","距离"],
//	              colModel: [{name:"lkjTime", isSort: true},{name:"sname", isSort: true},{name:"speed", isSort: true},
//	                         {name:"limitedSpeed", isSort: true},{name:"engineSpeed", isSort: true},{name:"guanya", isSort: true},
//	                         {name:"gangya", isSort: true},{name:"workStatus", isSort: true},{name:"locoSignal", isSort: true},
//	                         {name:"kiloSign", isSort: true},{name:"signalName", isSort: true},{name:"totalDistance", isSort: true}]
                 colNames: ["时间","里程","距离","信号机","信号","速度", "限速", "零位","前后","牵引","管压","缸压","转速","均缸1","均缸2"],
                 colModel: [
                 {name:"lkjTime",isSort:false},
                 {name:"kiloSign",isSort:false},
                 {name:"frontDistance",isSort:false},
                 {name:"signalName",isSort:false},
                 {name:"locoSignal",isSort:false},
                 {name:"speed",isSort:false},
                 {name:"limitedSpeed",isSort:false},
                 {name:"zerobit",isSort:false},
                 {name:"aheadback",isSort:false},
                 {name:"towbreak",isSort:false},
                 {name:"guanya",isSort:false},
                 {name:"gangya",isSort:false},
                 {name:"engineSpeed",isSort:false},
                 {name:"jg1press",isSort:false},
                 {name:"jg2press",isSort:false}]
             });
//        	RTU.invoke("header.msg.hidden");
        	 
        };
    });
    
    window.format2= function formatCSTDate(strDate,format){
 	   var date=new Date(strDate);
 	   var paddNum = function(num){
    		num += "";
    		return num.replace(/^(\d)$/,"0$1");
	 	};
	 	//指定格式字符
	 	var cfg = {
	 		yyyy : date.getFullYear(), //年 : 4位
	 		yy : date.getFullYear().toString().substring(2),//年 : 2位
	 		M  : paddNum(date.getMonth() + 1),  //月 : 如果1位的时候不补0
	 		MM : paddNum(date.getMonth() + 1), //月 : 如果1位的时候补0
	 		d  : paddNum(date.getDate()),   //日 : 如果1位的时候不补0
	 		dd : paddNum(date.getDate()),//日 : 如果1位的时候补0
	 		hh : paddNum(date.getHours()), //时
	 		mm : paddNum(date.getMinutes()), //分
	 		ss : paddNum(date.getSeconds()) //秒
	 	};
	 	format || (format = "yyyy-MM-dd hh:mm:ss");
	 	return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
     };
});
