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
    /*require("app/common/front_common.js");*/
    window.yunxingjiluPopuwnd;
    var g;
    window.format2;
    
    RTU.register("app.lkjyunxingjilu.loadHtmldata", function () {
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
    RTU.register("app.lkjyunxingjilu.query.activate", function () {
    	function getDateStr(format,date){
    		var returnStr = format;
    		returnStr = returnStr.replace(/y{1,4}/ig,date.getFullYear()+"");
    		returnStr = returnStr.replace(/M{1,2}/g,date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1+"");
    		returnStr = returnStr.replace(/d{1,2}/ig,date.getDate() < 10 ? "0"+date.getDate() : date.getDate()+"");
    		
    		returnStr = returnStr.replace(/m{1,2}/g,date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()+"");
    		returnStr = returnStr.replace(/h{1,2}/ig,date.getHours() < 10 ? "0"+date.getHours() : date.getHours()+"");
    		returnStr = returnStr.replace(/s{1,2}/ig,date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()+"");
    		
    		return returnStr;
    	}
        return function (data) {
        	/*RTU.invoke("header.msg.show", "加载中,请稍后!!!");*/
            //查询窗口
            RTU.invoke("app.lkjyunxingjilu.loadHtmldata", { url: "../app/modules/realtimelocomotivequery/app-yunxingjilu-lkj-query.html", fn: function (html) {
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
                		title:"监控实时记录",
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
                		"<div style='float:left;right:50px;width:150px;'>实时记录</div>" +
        				"<div style='float:left;right:50px;width:230px;'>车型车号："+locoTypeNameAndLocoNoAndLocoAb+"</div>" +
                		"<div style='float:left;right:50px;width:200px;'>客货："+kehuo+"</div>" +
        				"<div style='float:left;right:50px;width:200px;'>日期："+data.date+"</div>" +
						"</div>");
            	//初始化开始时间和结束时间空间框
            	var today = new Date();
            	$("#satrtDate").val(getDateStr('yyyy-MM-dd HH:mm:ss', new Date(
            			today.getTime() - 1/24 * 24 * 60 * 60 * 1000)));
            	$("#endDate").val(getDateStr('yyyy-MM-dd HH:mm:ss', today));
            	$("#yunxingjiluQryBtn").click(function(){
            		RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            		window.setTimeout(function(){
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
                    },10);
            		
            	});//重载表格
            	
               RTU.invoke("header.msg.show", "加载中,请稍后!!!");
               window.setTimeout(function(){
                	RTU.invoke("app.lkjyunxingjilu.query.loadDatas",data);
                },100);
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
    RTU.register("app.lkjyunxingjilu.query.loadDatas", function () {
    	var eventArr={
    		    //以下是自检信息(含故障信息)
    		    0xA008:"轮径超上界",
    		    0xA009:"轮径超下界",
    		    0xA010:"硬件复位",
    		    0xA020:"A监控记录板故障",
    		    0xA022:"A模拟量输入故障",
    		    0xA023:"B模拟量输入故障",
    		    0xA026:"A数字输入故障",
    		    0xA027:"B数字输入故障",
    		    0xA028:"A工况输入故障",
    		    0xA029:"B工况输入故障",
    		    0xA030:"A数字量输出故障",
    		    0xA031:"B数字量输出故障 ",
    		    0xA036:"A模块故障",
    		    0xA037:"B模块故障",
    		    0xA420:"A监控记录板恢复",
    		    0xA421:"B监控记录板恢复",
    		    0xA422:"A模拟量输入恢复",
    		    0xA423:"B模拟量输入恢复",
    		    0xA426:"A数字量输入恢复",
    		    0xA427:"B数字量输入恢复",
    		    0xA428:"A工况输入恢复",
    		    0xA429:"B工况输入恢复",
    		    0xA430:"A数字量输出恢复",
    		    0xA431:"B数字量输出恢复",
    		    0xA436:"A模块恢复",
    		    0xA437:"B模块恢复",
    		    0xC0:"关机",
    		    0xC1:"开机",
    		    //以下是检修输入信息
    		    0xA801:"日期修改",
    		    0xA802:"时间修改",
    		    0xA803:"轮径修改",
    		    0xA828:"备用轮径修改",
    		    0xA830:"机车号修改",
    		    0xA838:"机车AB节修改",
    		    0xA831:"装置号修改",
    		    0xA832:"机车型号修改", 
    		    0xA837:"机车类型修改",
    		    0xA845:"默认总重修改",
    		    0xA836:"默认计长修改",
    		    0xA834:"默认辆数修改",
    		    0xA839:"柴机脉冲数修改",
    		    0xA840:"速度表量程修改",
    		    0xA842:"GPS校时",
    		  	//司机输入信息
    		    0xA821:"司机号",
    		    0xA804:"副司机号",
    		    0xA820:"车次",
    		    0xA824:"本补客货",
    		    0xA805:"监控交路号",
    		    0xA818:"数据交路号",
    		    0xA806:"车站号",
    		    0xA827:"总重",
    		    0xA815:"辆数",
    		    0xA816:"计长",
    		    0xA829:"载重",
    		    0xA809:"客车",
    		    0xA810:"重车",
    		    0xA811:"空车",
    		    0xA812:"非运用车",
    		    0xA813:"代客车",
    		    0xA814:"守车",
    		    0xA843:"防撞辆数变化",
    		  //揭示信息
    		    0xB101:"揭示输入",
    		    0xB102:"限速开始",
    		    0xB103:"揭示结束",
    		    0xB106:"设定清揭示",
    		    0xB110:"揭示重新记录",
    		    0xB111:"揭示查询",
    		    0xB826:"取消揭示",
    		    0xB119:"工区揭示自动解锁",
    		    0xB115:"过揭示起点",
    		    0xB116:"过揭示终点",

    		    //速度事件信息
    		    0xA012:"速度突降",
    		    0xA013:"速度通道切换",
    		    0xA014:"速度通道号",
    		    0xA039:"人工速度通道切换",
    		    0xBE02:"各通道速度",
    		    0xD2:"轮对空转",
    		    0xD3:"空转结束",
    		    0xD4:"轮对滑行",
    		    0xD5:"滑行结束",
    		    0xB906:"空转报警开始",
    		    0xB907:"空转报警结束",

    		    //按键事件
    		    0xB805:"解锁键",
    		    0xB806:"副解锁键",
    		    0xB836:"确认键",
    		    0xB818:"警惕键",
    		    0xB813:"缓解键",
    		    0xB827:"定标键",
    		    0xB841:"参数确认",
    		    0xB819:"前端巡检1",
    		    0xB820:"后端巡检",
    		    0xB821:"前端巡检2",
    		    0xB834:"IC卡插入",
    		    0xB835:"IC卡拔出",
    		    0xB837:"键盘检测成功",
    		    0xB838:"键盘检测失败",
    		    0xB855:"数传呼叫地面",
    		 	 //运行状态
    		    0xB401:"A机单机",
    		    0xB402:"B机单机",
    		    0xB403:"A主B备",
    		    0xB405:"A备B主",//新加
    		    0xB404:"主备切换",
    		    0xB702:"降级运行",            
    		    0xB814:"进入调车",
    		    0xB815:"退出调车",
    		    0xB816:"出段",
    		    0xB817:"入段",
    		    0xB839:"退出出段",
    		    0xB840:"退出入段",
    		    0xB807:"单键解锁",
    		    0xB808:"双键解锁",
    		    0xB847:"临时命令输入",
    		    0xB846:"凭证输入",
    		    0xB848:"绿灯信号确认",
    		    0xB849:"机车信号故障确认",
    		    0xB850:"机车信号故障",
    		    0xB856:"转入20km/h限速",
    		    0xB857:"转出20km/h限速",
    		    0xB890:"转入信号故障",
    		    0xB891:"转出信号故障",
    		    0xB892:"转入线路限速",
    		    0xB851:"自动进入补机",
    		    0xB852:"自动退出补机",
    		    0xC8:"报警开始",
    		    0xC9:"报警结束",
    		    0xCA:"防溜报警开始",
    		    0xCB:"防溜报警结束",
    		    0xB908:"欠压报警开始",
    		    0xB909:"欠压报警结束",
    		    0xB910:"抱闸报警开始",
    		    0xB911:"抱闸报警结束",
    		    0xB912:"小闸报警开始",
    		    0xB913:"小闸报警结束",
    		    0xCD:"日期变化",
    		    0xD0:"停车",
    		    0xD1:"开车",
    		    0xDB:"紧急制动",
    		    0xDC:"常用制动",
    		    0xDD:"卸载动作",
    		    0xDE:"允许缓解",
    		    0xDF:"缓解成功",
    		    0xB822:"过站中心确认",
    		    0xB823:"信号确认",
    		    0xBE03:"开车侧线号",
    		    0xB842:"动车确认有效",
    		    0xB854:"非特殊站停车开口",

    		    //制动试验
    		    0xB901:"常用制动试验开始",
    		    0xB902:"紧急制动试验开始",
    		    0xB903:"常用制动试验结束",
    		    0xB904:"紧急制动试验结束",
    		    0xB905:"常用试验减压结束",

    		    //数据调用
    		    0xB801:"开车对标",
    		    0xB802:"车位向前",
    		    0xB803:"车位向后",
    		    0xB804:"车位对中",
    		    0xB810:"支线选择",
    		    0xA822:"输入支线无效",
    		    0xB811:"侧线选择",
    		    0xA823:"输入侧线无效",
    		    0xC2:"公里标突变",
    		    0xC3:"坐标增",
    		    0xC4:"坐标减",
    		    0xC5:"过机不校",
    		    0xC6:"过机校正",
    		    0xC7:"过站中心",
    		    0xCC:"道岔",
    		    0xCE:"过信号机",
    		    0xCF:"正线终止",
    		    0xB704:"过分相",
    		    0xB706:"调用反向数据",
    		    0xB707:"退出反向数据",
    		    0xDA01:"工务线路信息",
    		    0xA898:"显示器1版本变化",
    		    0xA899:"显示器2版本变化",

    		    //机车条件变化
    		    0xE0:"机车信号变化",
    		    0xE1:"制式电平变化",
    		    //"转速变化0xE2:",
    		    0xE3:"机车工况变化",
    		    0xE4:"信号突变",
    		    0xE5:"平调信号变化",
    		    0xE6:"速度变化",
    		    0xE7:"转速变化",
    		    0xE8:"电流变化",//16
    		    0xE9:"电压变化",
    		    0xEA:"电功率变化",
    		    0xDA02:"牵引电流变化",
    		    0xEC:"限速变化",
    		    0xEB:"管压变化",
    		    0xEE:"闸缸压力变化",
    		    0xEF:"均缸压力变化",
    		    0xED:"定量记录",
    		    0xB709:"记录自动过分相",
    		    0xB705:"鸣笛记录",
    		    0xB712:"鸣笛开始",
    		    0xB713:"鸣笛结束",
    		    0xBC30:"主断状态",
    		    0xB750:"主断开关状态", 
    		    0xB751:"手动主断状态",
    		    0xB752:"自动分相预断",
    		    0xB753:"自动分相强断",
    		    0xBC50:"MVB闸压变化",
    		    0xBC51:"手柄级位变化",
    		    0xDA03:"机车信号序号",
    		    
    		    //不单独翻译的记录           
    		    0xB701:"状态变化",
    		    
    		    0xA894:"显1通信超时",
    		    0xA895:"显1通信超时恢复",
    		    0xA896:"显2通信超时",
    		    0xA897:"显2通信超时恢复",
    			

    		    //后面加的记录
    		    0xA861:"警惕确认",
    		    0xA862:"警惕确认",
    		    0xA863:"出入库键",//20150531加
    		    0xA864:"调车键",
    		    0xA865:"开车键",
    		    0xA866:"车站变化",
    		    0xA867:"TSC通信超时",
    		    0xA868:"显示器1自检故障",
    		    0xA869:"显示器2自检故障",
    		    0xA870:"地面信息A自检故障",
    		    0xA871:"地面信息B自检故障",
    		    0xA872:"通信A自检故障",
    		    0xA873:"通信B自检故障",
    		    0xA874:"扩展通信A自检故障",
    		    0xA875:"扩展通信B自检故障",

    		    0xA876:"A机常用试验开始",
    		    0xA877:"A机常用试验结束",
    		    0xA878:"B机常用试验开始",
    		    0xA879:"B机常用试验结束",
    		    0xA880:"A机紧急试验开始",
    		    0xA881:"A机紧急试验结束",
    		    0xA882:"B机紧急试验开始",
    		    0xA883:"B机紧急试验结束",
    		    0xA884:"TSC掉线",
    		    0xA885:"TSC上线",
    		    0xA886:"TSC复位",
    		    0xA887:"信号突变报警结束",
    		    0xC000:"显示器1自检恢复",
    		    0xC001:"显示器2自检恢复",
    		    0xC002:"地面信息A自检恢复",
    		    0xC003:"地面信息B自检恢复",
    		    0xC004:"通信A自检恢复",
    		    0xC005:"通信B自检恢复",
    		    0xC006:"扩展通信A自检恢复",
    		    0xC007:"扩展通信B自检恢复",
    		    //20160905加
    		    0xC008:"A监控记录程序错",
    		    0xC009:"A监控记录数据错",
    		    0xC00A:"A监控记录RAM错",
    		    0xC00B:"A监控记录CPU_RAM错",
    		    0xC00C:"A监控记录同步通讯错",
    		    0xC00D:"A监控记录CAN通讯错",
    		    0xC00E:"A监控记录日历时钟错",
    		    0xC00F:"B监控记录程序错",
    		    0xC010:"B监控记录数据错",
    		    0xC011:"B监控记录RAM错",
    		    0xC012:"B监控记录CPU_RAM错",
    		    0xC013:"B监控记录同步通讯错",
    		    0xC014:"B监控记录CAN通讯错",
    		    0xC015:"B监控记录日历时钟错",

    		    0xC016:"A监控记录程序恢复",
    		    0xC017:"A监控记录数据恢复",
    		    0xC018:"A监控记录RAM恢复",
    		    0xC019:"A监控记录CPU_RAM恢复",
    		    0xC01A:"A监控记录同步通讯恢复",
    		    0xC01B:"A监控记录CAN通讯恢复",
    		    0xC01C:"A监控记录日历时钟恢复",

    		    0xC01D:"B监控记录程序恢复",
    		    0xC01E:"B监控记录数据恢复",
    		    0xC01F:"B监控记录RAM恢复",
    		    0xC020:"B监控记录CPU_RAM恢复",
    		    0xC021:"B监控记录同步通讯恢复",
    		    0xC022:"B监控记录CAN通讯恢复",
    		    0xC023:"B监控记录日历时钟恢复",

    		    0xC024:"制动输出模块_A故障",
    		    0xC025:"制动输出模块_B故障",
    		    0xC026:"机车工况模块_A故障",
    		    0xC027:"机车工况模块_B故障",
    		    0xC028:"机车信号模块_A故障",
    		    0xC029:"机车信号模块_B故障",
    		    0xC02A:"扩展通信插件_A故障",
    		    0xC02B:"扩展通信插件_B故障",
    		    0xC02C:"模拟量输入模块_A故障",
    		    0xC02D:"模拟量输入模块_B故障",
    		    0xC02E:"通信插件_A故障",
    		    0xC02F:"通信插件_B故障",
    		    0xC030:"地面信息插件_A故障",
    		    0xC031:"地面信息插件_B故障",

    		    0xC032:"制动输出模块_A恢复",
    		    0xC033:"制动输出模块_B恢复",
    		    0xC034:"机车工况模块_A恢复",
    		    0xC035:"机车工况模块_B恢复",
    		    0xC036:"机车信号模块_A恢复",
    		    0xC037:"机车信号模块_B恢复",
    		    0xC038:"扩展通信插件_A恢复",
    		    0xC039:"扩展通信插件_B恢复",
    		    0xC03A:"模拟量输入模块_A恢复",
    		    0xC03B:"模拟量输入模块_B恢复",
    		    0xC03C:"通信插件_A恢复",
    		    0xC03D:"通信插件_B恢复",
    		    0xC03E:"地面信息插件_A恢复",
    		    0xC03F:"地面信息插件_B恢复",

    		    0xC040:"显示器1故障",
    		    0xC041:"显示器2故障",
    		    0xC042:"显示器1恢复",
    		    0xC043:"显示器2恢复",

    		    0xC044:"双紧急制动故障",
    		    0xC045:"监控软件不一致",
    		    0xC046:"地面数据不一致",
    		    0xC047:"双紧急制动恢复",
    		    0xC048:"监控软件一致",
    		    0xC049:"地面数据一致"
    		};
		function onEventCode(record){
			var eventName= eventArr[record.eventCode];
			/* if(eventName)return eventName;
			eventName=getEventName(record.eventCode);
			return eventName?eventName:record.eventCode; */
			return eventName?eventName:record.eventCode;
		}
		function onLocoSignal(record){
			/* var data=record.locoSignal;
			if(data==0)
 			   $(ctd).css("color","green");
 		   else if(data==1||
 				   data==2||
 				   data==4|data==19||data==20)
 			   $(ctd).css("color","#008180");
 		   else if(data==5||data==6||data==18)
 			   $(ctd).css("color","red");
 		   else if(data==3)
 			   $(ctd).css("color","#047B57"); */
 			  //0空，1绿灯, 2绿黄灯, 3黄灯, 4黄2灯,5 黄2闪,6 双黄灯,7 双黄闪,8 红黄灯,9 红黄闪,10 白灯,11 红灯,12 调车白灯,13 调车蓝灯,14 灭灯,15 多灯
 			   switch(record.locoSignal){
 			   case 1:
 				   return "绿灯";
 			  case 2:
				   return "绿黄灯";
 			 case 3:
				   return "黄灯";
 			 case 4:
				   return "黄2灯";
 			 case 5:
				   return "黄2闪";
 			 case 6:
				   return "双黄灯";
 			 case 7:
				   return "双黄闪";
 			 case 8:
				   return "红黄灯";
 			 case 9:
				   return "红黄闪";
 			 case 10:
				   return "白灯";
 			 case 11:
				   return "红灯";
 			 case 12:
				   return "调车白灯";
 			 case 13:
				   return "调车蓝灯";
 			case 14:
				   return "灭灯";
 			case 15:
				   return "多灯";
 			   	default:
 			   		return "";
 			   }
 		   /* return lampcode[record.locoSignal]; */
		}
        return function (data) {
        	 var imgurl0bj = {"1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
        	 //查询窗口
        	 var width = document.documentElement.clientWidth * 0.9;
             var height = document.documentElement.clientHeight * 0.9-30;
             
             //判断data是否含有alarmTime属性
             /*data.hasOwnProperty('alarmTime'); */
             var url;
             if (data.hasOwnProperty('alarmTime')) {
            	 url="../lmdLkjFileReal/findLkjRecordInfoByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+"&alarmTime="+data.alarmTime+"&flag=1";
             } else {
            	/* url="../lkjInfoHis/findLkjRecordInfoByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+
            	 "&startDate="+$("#satrtDate").val()+"&endDate="+$("#endDate").val();*/
            	 url="../lmdLkjFileReal/findLkjRecordInfoByTrain?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb;
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
                 replaceTd:[{index: 0, fn: function (data,j,ctd,itemData) {
						return onEventCode(itemData);
					}},{index: 2, fn: function (data,j,ctd,itemData) {
						var kiloSign = itemData.kiloSign;
						if(kiloSign == null){
							return "";
						}else {
							return kiloSign/1000;
						}
						
					}},{index: 6, fn: function (data,j,ctd,itemData) {
						return onLocoSignal(itemData);
					}
			        }],
                 colNames: ["事件名称","时间","公里标","其它","距离", "信号机", "信号","速度","限速","零位","前后","牵引","管压","缸压","均缸1","均缸2","转速","监控模式"],
                 colModel: [
                 /*{name:"recordNo",isSort:false},*/
                 {name:"eventCode",isSort:false},
                 {name:"lkjTime",isSort:false},
                 {name:"kiloSign",isSort:false},
                 {name:"other",isSort:false},
                 {name:"frontDistance",isSort:false},
                 {name:"signalName",isSort:false},
                 {name:"locoSignal",isSort:false},
                 {name:"speed",isSort:false},
                 {name:"limitedSpeed",isSort:false},
                 {name:"lingwei",isSort:false},
                 {name:"qianhou",isSort:false},
                 {name:"zhidong",isSort:false},
                 {name:"guanya",isSort:false},
                 {name:"gangya",isSort:false},
                 {name:"jg1press",isSort:false},
                 {name:"jg2press",isSort:false},
                 {name:"turnSpeed",isSort:false},
                 {name:"jkstateName",isSort:false}]
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
