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
    
    window.yunxingjiluPopuwnd;
    var g;
    window.format2;
    
    RTU.register("app.public15servicelinepatroldispatchcommand.loadHtmldata", function () {
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
    RTU.register("app.public15servicelinepatroldispatchcommand.query.activate", function () {
        return function (data) {
        	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            //查询窗口
            RTU.invoke("app.public15servicelinepatroldispatchcommand.loadHtmldata", { url: "../app/modules/realtimelocomotivequery/app-yunxingjilu-query.html", fn: function (html) {
            	$html = $(html);
            	var width = document.documentElement.clientWidth * 0.9;
                var height = document.documentElement.clientHeight * 0.9;
            	if (!window.yunxingjiluPopuwnd) {
                	window.yunxingjiluPopuwnd = new PopuWnd({
                		title:"新一代LKJ运行记录",
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
            	$(".popuwnd-title-text",window.yunxingjiluPopuwnd.$wnd).html("<div>" +
                		"<div style='float:left;right:50px;width:150px;'>运行记录</div>" +
        				"<div style='float:left;right:50px;width:230px;'>机车型号："+data.locoTypename+"-"+data.locoNo+"</div>" +
                		"<div style='float:left;right:50px;width:200px;'>客货："+kehuo+"</div>" +
        				"<div style='float:left;right:50px;width:150px;'>日期："+data.date+"</div>" +
						"</div>");
                RTU.invoke("app.public15servicelinepatroldispatchcommand.query.loadDatas",data);
            }
            });
        };
    });
    
    
  //加载数据
    RTU.register("app.public15servicelinepatroldispatchcommand.query.loadDatas", function () {
        return function (data) {
            var imgurl0bj = { "1": "L3.png", "2": "L2.png", 
            		"3": "L.png","4": "LU.png","5": "LU2.png","6": "U.png",
            		"7": "U2S.gif","8": "U2.png","9":"L6.png","10": "UUS.gif", "11": "UU.png", 
            		"12": "HUS.gif","13": "HU.png","14": "H.png","15": "L4.png",
            		"16": "L5.png","17":"B.png","18":"B.png","19": "NO.png","20": "B.png","21":"U3.png","32": "Blue.png" };
            function getImgUrl(id) {
            	if(imgurl0bj[id.toString()])
                return "../static/img/app/moveCurve/" + imgurl0bj[id.toString()];
            	else{
            		  return "../static/img/app/moveCurve/WU.png";//灭灯
            	}
            };
            var gangyaStr;
            var gangya1Str;
            var gangya2Str;
        	 //查询窗口
        	 var width = document.documentElement.clientWidth * 0.9;
             var height = document.documentElement.clientHeight * 0.9;
             var url="../onlineloco15/findOnlineLocoViewHisByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb,
        	 g= new RTGrid({
        		url:url,
        	     containDivId: "yunxingjilu_grid_result",
                 tableWidth:width,
                 tableHeight:height,
                 isSort: true,  //是否排序
                 showTrNum:true,
                 hasCheckBox:false,
                 clickIdItem:"lkjTime_locoNo_recId",
                 setPageSize:[100,200,500],
                 extraUrlParam:{
                	 pageSize:100
                 },
                 beforeLoad:function(that){
                	 that.pageSize =100;
                 },
                 isShowPagerControl:true,   //显示分页
                 isShowRefreshImgControl:true,
                 trRightClick:function(returnData){   //右键
                     
                 },
                 clickTrEvent: function (t) {   //点击行
                 },
                 loadPageCp:function(t){
                     t.cDiv.css("left","200px");
                     t.cDiv.css("top","200px");
                     
                     if (t.param.datas.length == 0) {
                    	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                         return;
                     }
                     var tds = $($("#yunxingjilu_grid_result .RTGrid_Headdiv .RTTable_Head tr")[0]).children("td");
                     $(tds[11]).html(gangyaStr);
                     $(tds[13]).html(gangya1Str);
                     $(tds[14]).html(gangya2Str);
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
						
					}},
					{index: 3, fn: function (data,j,ctd,itemData) {
						return data+" "+(itemData.signalHeader+(itemData.signalNo?itemData.signalNo:""));
					}},
					{index: 4, fn: function (data,j,ctd,itemData) {
	             		var lightColor = itemData.locoSignal;
	             		var imgurl = imgurl0bj[lightColor.toString()];
		             		if(imgurl == null){
		             			return "";
		             		}else{
		                		var imgPath = "../static/img/app/moveCurve/"+imgurl;
		                		return "<img src='"+imgPath+"' style='width:16px;height:16px;'/>";
		             		}
				        }
			        },
					{index: 6, fn: function (data,j,ctd,itemData) {
						if((itemData.workStatus&1)!=0){
			        		return "零位";
			        	}
			        	else{
			        		return "非零";
			        	}
					}
			        },
			        {index: 7, fn: function (data,j,ctd,itemData) {
						if((itemData.workStatus&2)!=0){
			        		return "向后";
			        	}
			        	else if((itemData.workStatus&4)!=0){
			        		return "向前";
			        	}
						return "";
					}
			        },
			        {index: 8, fn: function (data,j,ctd,itemData) {
						if((itemData.workStatus&8)!=0){
			        		return "制动";
			        	}
			        	else if((itemData.workStatus&16)!=0){
			        		return "牵引";
			        	}
						return "";
					}
			        },
			        {index: 9, fn: function (data,j,ctd,itemData) {
						if(itemData.stresstype1==1){
							return itemData.guanya;
						}
						else if(itemData.stresstype2==1){
							return itemData.zhidonggangya;
						}
						else if(itemData.stresstype3==1){
							return itemData.junfenggangya_1;
						}
						else if(itemData.stresstype4==1){
							return itemData.junfenggangya_2;
						}
						return 0;
					}
			        } ,
			        {index: 10, fn: function (data,j,ctd,itemData) {
			        	if(itemData.stresstype1==2||itemData.stresstype1==3){
			        		
			        		if(itemData.stresstype1==2){
			        			gangyaStr="均风缸";
			        		}
			        		else{
			        			gangyaStr="制动缸";
			        		}
							return itemData.guanya;
						}
						else if(itemData.stresstype2==2||itemData.stresstype2==3){
							
							if(itemData.stresstype2==2){
			        			gangyaStr="均风缸";
			        		}
			        		else{
			        			gangyaStr="制动缸";
			        		}
							return itemData.zhidonggangya;
						}
						else if(itemData.stresstype3==2||itemData.stresstype3==3){
							
							if(itemData.stresstype3==2){
			        			gangyaStr="均风缸";
			        		}
			        		else{
			        			gangyaStr="制动缸";
			        		}
							return itemData.junfenggangya_1;
						}
						else if(itemData.stresstype4==2||itemData.stresstype4==3){
							
							if(itemData.stresstype4==2){
			        			gangyaStr="均风缸";
			        		}
			        		else{
			        			gangyaStr="制动缸";
			        		}
							return itemData.junfenggangya_2;
						}
						return 0;
					}
			        } ,
			        {index: 12, fn: function (data,j,ctd,itemData) {
			        	if(itemData.stresstype1==4||itemData.stresstype1==6){
			        		if(itemData.stresstype1==4){
			        			gangya1Str="制动缸1";
			        		}
			        		else{
			        			gangya1Str="均风缸1";
			        		}
							return itemData.guanya;
						}
						else if(itemData.stresstype2==4||itemData.stresstype2==6){
							if(itemData.stresstype2==4){
								gangya1Str="制动缸1";
			        		}
			        		else{
			        			gangya1Str="均风缸1";
			        		}
							return itemData.zhidonggangya;
						}
						else if(itemData.stresstype3==4||itemData.stresstype3==6){
							if(itemData.stresstype4==4){
								gangya1Str="制动缸1";
			        		}
			        		else{
			        			gangya1Str="均风缸1";
			        		}
							return itemData.junfenggangya_1;
						}
						else if(itemData.stresstype4==4||itemData.stresstype4==6){
							if(itemData.stresstype4==4){
								gangya1Str="制动缸1";
			        		}
			        		else{
			        			gangya1Str="均风缸1";
			        		}
							return itemData.junfenggangya_2;
						}
						return 0;
					}
			        } ,
			        {index: 13, fn: function (data,j,ctd,itemData) {
			        	if(itemData.stresstype1==5||itemData.stresstype1==7){
			        		if(itemData.stresstype1==5){
								gangya2Str="制动缸2";
			        		}
			        		else{
			        			gangya2Str="均风缸2";
			        		}
							return itemData.guanya;
						}
						else if(itemData.stresstype2==5||itemData.stresstype2==7){
							if(itemData.stresstype2==5){
								gangya2Str="制动缸2";
			        		}
			        		else{
			        			gangya2Str="均风缸2";
			        		}
							return itemData.zhidonggangya;
						}
						else if(itemData.stresstype3==5||itemData.stresstype3==7){
							if(itemData.stresstype3==5){
								gangya2Str="制动缸2";
			        		}
			        		else{
			        			gangya2Str="均风缸2";
			        		}
							return itemData.junfenggangya_1;
						}
						else if(itemData.stresstype1==4||itemData.stresstype4==7){
							if(itemData.stresstype4==5){
								gangya2Str="制动缸2";
			        		}
			        		else{
			        			gangya2Str="均风缸2";
			        		}
							return itemData.junfenggangya_2;
						}
						return 0;
					}
			        } 
					],
//			      colNames: ["时间","列车位置","速度","限速","柴速","管压","缸压","工况","信号","公里标","信号机","距离"],
//	              colModel: [{name:"lkjTime", isSort: true},{name:"sname", isSort: true},{name:"speed", isSort: true},
//	                         {name:"limitedSpeed", isSort: true},{name:"engineSpeed", isSort: true},{name:"guanya", isSort: true},
//	                         {name:"gangya", isSort: true},{name:"workStatus", isSort: true},{name:"locoSignal", isSort: true},
//	                         {name:"kiloSign", isSort: true},{name:"signalName", isSort: true},{name:"totalDistance", isSort: true}]
                 colNames: ["时间","里程","距离","信号机","信号","速度","零位","前后","牵引","管压","缸压","转速","均缸1","均缸2"],
                 colModel: [
                 {name:"lkjTime",isSort:false},
                 {name:"kiloSign",isSort:false},
                 {name:"frontDistance",isSort:false},
                 {name:"signalName",isSort:false},
                 {name:"locoSignal",isSort:false},
                 {name:"speed",isSort:false},
                 {name:"workStatus",isSort:false},
                 {name:"workStatus",isSort:false},
                 {name:"workStatus",isSort:false},
                 {name:"guanya",isSort:false},
                 {name:"zhidonggangya",isSort:false},
                 {name:"engineSpeed",isSort:false},
                 {name:"junfenggangya_1",isSort:false},
                 {name:"junfenggangya_2",isSort:false}]
             });
        	RTU.invoke("header.msg.hidden");
        	 
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
