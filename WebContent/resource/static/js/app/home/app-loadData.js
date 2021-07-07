RTU.DEFINE(function (require, exports) {
/**
 * 模块名：统一加载数据
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	$.ajaxSetup({cache:false});
    function trData() {
        this.timer = null;
        this.allData = [];
        this.timer = parseInt(top.getSysSettingValue("RefreshData")==""?2:top.getSysSettingValue("RefreshData"))*1000;//服务器设置刷新时间
        this.interval = null;
        this.url = "";
        this.topic = "";
        this.extendParam = null;
        this.httpRequest = new XMLHttpRequest();
        this.loading = false;
    }
    trData.prototype = {
//    		success:function(){
//    			
//    		},
        loadFn: function (obj) {//循环去数据
            this.url = "../onlineloco/searchByProperty?dFullName=&bFullName=&sFullName=&showSize=50&locoType=&locoNo=&dName=&checiName&lineName=&trainType=&sName=";
            this.topic = "refreshData";
            if (obj && obj.url) {
                this.url = obj.url;
            }
            if (obj && obj.topic) {
                this.topic = obj.topic;
            }
            if(obj&&obj.timer){
            	this.timer=obj.timer;
            }
            if (!this.extendParam) {
                this.extendParam = { sortField: "lkjTime", sortOrder: "DESC" };
            }
            if(this.httpRequest==null){
            	this.httpRequest=new XMLHttpRequest();
            }
            var that = this;
//            this.httpRequest = $.ajax({ url: this.url, dataType: "jsonp", type: "GET", data: this.extendParam,jsonpCallback:"success_jsonpCallback",cache:true,
//                success: function (data) {
//                	that.totaldata=data;
//                    that.allData = data.data;
//                    if (that.allData.length == 0) {
//                        return;
//                    }
//                    psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
//                },
//                complete: function (XHR, TS) { XHR = null; }, 
//                timeout: 12000,
//                error: function () {
//                    if (this.topic == "refreshData") {
//                        //                        alert("数据加载失败，请检查网络状况！");
//                        RTU.invoke("header.alarmMsg.show", "数据加载失败，请检查网络状况！");
//                    }
//                }
//            });
            this.url=this.url+"&sortField="+this.extendParam.sortField+"&sortOrder="+this.extendParam.sortOrder;
            this.httpRequest.open("GET",this.url,true);
            this.httpRequest.onreadystatechange = success;
            this.httpRequest.send();
            
            if(!this.loading)this.loadingindex = top.layer.load(1,{ shade: [0.6,'gray']}); //首次加载，启动进度条
          
            function success(){
            	if (that.httpRequest.readyState == 4){
            		if(!that.loading){
            			that.loading = true;
            			top.layer.close(that.loadingindex);
            		}
            		setTimeout(function(){
            			window.trItem.loadFn(obj);
            		}, window.trItem.timer);
	                if (that.httpRequest.status == 200) {
//	                	if(that.topic=="warnData"){
//	                    	that.totaldata=$.parseJSON('{"success":true,"msg":"","data":[{"recId":85442,"alarmCode":"1000","alarmDesc":"","alarmRecId":88856,"alarmTablename":"LCYX_YY_ALARM_LKJ","alarmTime":"2015-07-30 22:38:49","confirmDesc":"","confirmFlag":"0","confirmTime":"","confirmUserid":"","lkjRecId":88856,"lkjAlarmCode":"1000","appType":1,"checiEx":" ","checiName":"88888","currLateral":0,"currSidetrack":0,"deptId":1304,"deviceCorp":"","driverId":1026227,"engineSpeed":0,"factJiaolu":2,"frameNo":0,"frontDistance":800,"frontLateral":0,"frontLineflag":0,"frontLineno":0,"frontSidetrack":0,"frontStationJiaolu":0,"frontStationNo":0,"frontStationTmis":0,"gangya":0,"gpsDirection":0,"gpsEwflag":"","gpsHeight":0,"gpsNsflag":"","gpsSpeed":0,"gpsTime":"2000-01-01 00:00:00","guanya":500,"infoFrameNo":0,"infoVer":1,"inputJiaolu":2,"jkstate":18,"kcbz":"0","kehuo":0,"kiloSign":0,"latitude":0.0,"length":700,"limitedSpeed":72,"lineFlag":0,"lineNo":0,"lkjTime":"2015-07-30 22:38:49","locoAb":"0","locoIp":"","locoNo":"4382","locoSignal":1152,"locoTypeid":"106","longitude":0.0,"proVer":1,"receiveTime":"2015-07-23 23:38:16","signalNo":0,"signalType":0,"speed":0,"stationNo":99,"stationTmis":0,"totalDistance":2038,"totalWeight":5500,"transType":1,"validgpsCount":0,"vehicleCount":50,"vicedriverId":1023236,"wheel":10502.0,"workStatus":13,"zhidong":0,"benBuName":"本务","keHuoName":"货车","shangXiaXing":0,"jkState":"降级","spanMinutes":0,"isOnline":"1","loginName":"","realName":"","tuKu":"途中","lightColor":128,"dname":"向塘机务段","dshortname":"向塘 ","sname":"0","ttypeId":"106","ttypeName":"东风4(C)","did":"1304","lid":"0","lname":"0","ttypeShortname":"DF4C","aalarmLevel":"1","adeviceName":"","sid":"0","arecId":28,"aalarmCode":"1000","aalarmName":"与TAX通信故障","adeviceId":""},{"recId":224150,"alarmCode":"2003","alarmDesc":"","alarmRecId":226455,"alarmTablename":"LCYX_YY_ALARM_LKJ","alarmTime":"2015-07-27 13:40:40","confirmDesc":"","confirmFlag":"0","confirmTime":"","confirmUserid":"","lkjRecId":226455,"lkjAlarmCode":"2003","appType":1,"checiEx":" K","checiName":"K1235","currLateral":0,"currSidetrack":0,"deptId":1301,"deviceCorp":"","driverId":5101967,"engineSpeed":0,"factJiaolu":10,"frameNo":15228,"frontDistance":63937,"frontLateral":128,"frontLineflag":1,"frontLineno":8,"frontSidetrack":133,"frontStationJiaolu":10,"frontStationNo":178,"frontStationTmis":49631,"gangya":290,"gpsDirection":896,"gpsEwflag":"E","gpsHeight":1084,"gpsNsflag":"N","gpsSpeed":0,"gpsTime":"2015-07-27 13:40:45","guanya":600,"infoFrameNo":178,"infoVer":1,"inputJiaolu":147,"jkstate":192,"kcbz":"0","kehuo":1,"kiloSign":1999240,"latitude":26.33212,"length":456,"limitedSpeed":41,"lineFlag":1,"lineNo":8,"lkjTime":"2015-07-27 13:40:40","locoAb":"0","locoIp":"","locoNo":"0294","locoSignal":1032,"locoTypeid":"240","longitude":106.42602,"proVer":1,"receiveTime":"2015-07-27 13:40:12","signalNo":20009,"signalType":2,"speed":0,"stationNo":177,"stationTmis":37646,"totalDistance":63612,"totalWeight":1075,"transType":1,"validgpsCount":25,"vehicleCount":19,"vicedriverId":5102436,"wheel":12312.0,"workStatus":1,"zhidong":7,"benBuName":"本务","keHuoName":"客车","shangXiaXing":1,"jkState":"正常","spanMinutes":0,"isOnline":"1","loginName":"","realName":"","tuKu":"途中","lightColor":8,"dname":"南昌机务段","dshortname":"南昌 ","sname":"贵阳","ttypeId":"240","ttypeName":"和谐电1D","did":"1301","lid":"8","lname":"沪昆","ttypeShortname":"HXD1D","aalarmLevel":"1","adeviceName":"","sid":"37646","arecId":4,"aalarmCode":"2003","aalarmName":"途中常用","adeviceId":""},{"recId":224149,"alarmCode":"1002","alarmDesc":"","alarmRecId":226454,"alarmTablename":"LCYX_YY_ALARM_LKJ","alarmTime":"2015-07-27 13:40:11","confirmDesc":"","confirmFlag":"0","confirmTime":"","confirmUserid":"","lkjRecId":226454,"lkjAlarmCode":"1002","appType":1,"checiEx":" ","checiName":"51181","currLateral":0,"currSidetrack":0,"deptId":1307,"deviceCorp":"","driverId":7038278,"engineSpeed":0,"factJiaolu":10,"frameNo":570,"frontDistance":800,"frontLateral":0,"frontLineflag":0,"frontLineno":0,"frontSidetrack":0,"frontStationJiaolu":0,"frontStationNo":0,"frontStationTmis":0,"gangya":310,"gpsDirection":0,"gpsEwflag":"E","gpsHeight":68,"gpsNsflag":"N","gpsSpeed":0,"gpsTime":"2015-07-27 13:40:12","guanya":500,"infoFrameNo":4,"infoVer":1,"inputJiaolu":10,"jkstate":18,"kcbz":"0","kehuo":0,"kiloSign":2021,"latitude":29.07012,"length":19,"limitedSpeed":82,"lineFlag":0,"lineNo":0,"lkjTime":"2015-07-27 13:40:11","locoAb":"0","locoIp":"","locoNo":"0176","locoSignal":1152,"locoTypeid":"237","longitude":119.39537,"proVer":1,"receiveTime":"2015-07-27 13:39:40","signalNo":3595,"signalType":2,"speed":0,"stationNo":36,"stationTmis":0,"totalDistance":63967,"totalWeight":0,"transType":1,"validgpsCount":24,"vehicleCount":1,"vicedriverId":7030487,"wheel":11686.0,"workStatus":1,"zhidong":0,"benBuName":"本务","keHuoName":"货车","shangXiaXing":1,"jkState":"降级","spanMinutes":-1,"isOnline":"1","loginName":"","realName":"","tuKu":"途中","lightColor":128,"dname":"鹰潭机务段","dshortname":"鹰潭 ","sname":"0","ttypeId":"237","ttypeName":"和谐电1C","did":"1307","lid":"0","lname":"0","ttypeShortname":"HXD1C","aalarmLevel":"1","adeviceName":"","sid":"0","arecId":30,"aalarmCode":"1002","aalarmName":"TAX信息从异常恢复至正常","adeviceId":""},{"recId":224148,"alarmCode":"1001","alarmDesc":"","alarmRecId":226453,"alarmTablename":"LCYX_YY_ALARM_LKJ","alarmTime":"2015-07-27 13:40:08","confirmDesc":"","confirmFlag":"0","confirmTime":"","confirmUserid":"","lkjRecId":226453,"lkjAlarmCode":"1001","appType":1,"checiEx":" ","checiName":"51181","currLateral":0,"currSidetrack":0,"deptId":1307,"deviceCorp":"","driverId":7038278,"engineSpeed":0,"factJiaolu":10,"frameNo":569,"frontDistance":63515,"frontLateral":0,"frontLineflag":0,"frontLineno":0,"frontSidetrack":0,"frontStationJiaolu":0,"frontStationNo":0,"frontStationTmis":0,"gangya":310,"gpsDirection":0,"gpsEwflag":"E","gpsHeight":68,"gpsNsflag":"N","gpsSpeed":0,"gpsTime":"2015-07-27 13:40:10","guanya":500,"infoFrameNo":3,"infoVer":1,"inputJiaolu":10,"jkstate":82,"kcbz":"0","kehuo":0,"kiloSign":2021,"latitude":29.07012,"length":19,"limitedSpeed":41,"lineFlag":0,"lineNo":0,"lkjTime":"2015-07-27 13:40:08","locoAb":"0","locoIp":"","locoNo":"0176","locoSignal":1152,"locoTypeid":"237","longitude":119.39537,"proVer":1,"receiveTime":"2015-07-27 13:39:37","signalNo":3595,"signalType":2,"speed":0,"stationNo":36,"stationTmis":0,"totalDistance":63967,"totalWeight":0,"transType":1,"validgpsCount":24,"vehicleCount":1,"vicedriverId":7030487,"wheel":11686.0,"workStatus":1,"zhidong":0,"benBuName":"本务","keHuoName":"货车","shangXiaXing":1,"jkState":"降级","spanMinutes":-1,"isOnline":"1","loginName":"","realName":"","tuKu":"途中","lightColor":128,"dname":"鹰潭机务段","dshortname":"鹰潭 ","sname":"0","ttypeId":"237","ttypeName":"和谐电1C","did":"1307","lid":"0","lname":"0","ttypeShortname":"HXD1C","aalarmLevel":"1","adeviceName":"","sid":"0","arecId":29,"aalarmCode":"1001","aalarmName":"TAX信息异常","adeviceId":""},{"recId":224147,"alarmCode":"2000","alarmDesc":"","alarmRecId":226452,"alarmTablename":"LCYX_YY_ALARM_LKJ","alarmTime":"2015-07-27 13:39:34","confirmDesc":"","confirmFlag":"0","confirmTime":"","confirmUserid":"","lkjRecId":226452,"lkjAlarmCode":"2000","appType":1,"checiEx":" ","checiName":"66666","currLateral":0,"currSidetrack":0,"deptId":1301,"deviceCorp":"","driverId":1026228,"engineSpeed":400,"factJiaolu":3,"frameNo":12967,"frontDistance":64194,"frontLateral":128,"frontLineflag":2,"frontLineno":5,"frontSidetrack":0,"frontStationJiaolu":3,"frontStationNo":100,"frontStationTmis":220045,"gangya":310,"gpsDirection":46,"gpsEwflag":"E","gpsHeight":36,"gpsNsflag":"N","gpsSpeed":0,"gpsTime":"2015-07-27 13:39:39","guanya":600,"infoFrameNo":103,"infoVer":1,"inputJiaolu":3,"jkstate":88,"kcbz":"0","kehuo":0,"kiloSign":1342,"latitude":29.6554733333333,"length":19,"limitedSpeed":12,"lineFlag":0,"lineNo":0,"lkjTime":"2015-07-27 13:39:34","locoAb":"0","locoIp":"","locoNo":"0001","locoSignal":4612,"locoTypeid":"138","longitude":115.903678333333,"proVer":1,"receiveTime":"2015-07-27 13:39:05","signalNo":13224,"signalType":2,"speed":0,"stationNo":732,"stationTmis":220046,"totalDistance":52776,"totalWeight":0,"transType":1,"validgpsCount":11,"vehicleCount":1,"vicedriverId":0,"wheel":10501.0,"workStatus":11,"zhidong":0,"benBuName":"本务","keHuoName":"货车","shangXiaXing":0,"jkState":"降级","spanMinutes":0,"isOnline":"1","loginName":"","realName":"","tuKu":"库内","lightColor":4,"dname":"南昌机务段","dshortname":"南昌 ","sname":"九江西二场","ttypeId":"138","ttypeName":"东风11","did":"1301","lid":"0","lname":"0","ttypeShortname":"DF11","aalarmLevel":"1","adeviceName":"","sid":"220046","arecId":1,"aalarmCode":"2000","aalarmName":"通信故障异常","adeviceId":""}],"pageIndex":1,"pageSize":5,"totalPage":43941,"totalRecords":219705}');
//		                    that.allData =that.totaldata.data;
//	                	}else{
	                		that.totaldata=$.parseJSON(that.httpRequest.response);
		                    that.allData =that.totaldata.data;
//	                	}
	                	
	                	
//	                    if (that.allData.length == 0) {
//	                      return;
//	                    }
	                    setTimeout(function(){
	                    	psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
	                    	if(that.topic=="refreshData")
	                    	setLocoCount(that.totaldata);
	                    	else if(that.topic=="locoData")
	                    		setLocoStatistics(that.totaldata);
	                    },1000);
	                }else{
		                  if (this.topic == "refreshData") {
		                	  RTU.invoke("header.alarmMsg.show", "数据加载失败，请检查网络状况！");
		                  }
	                }
                }
            }
        },
        init: function (obj) {
        	
//                if (this.interval) {
//                clearInterval(this.interval);
//            }
            var that = this;
            this.loadFn(obj);
//            this.interval = setInterval(function () {
//                that.loadFn(obj);
//            }, this.timer);
//            return this.interval;
        }
    };
    
    var setLocoCount=function(data){
    	var onlineCount=0;
    	if(data.data&&data.data.length>0){
	     	for(var i=0;i<data.data.length;i++){
	        	if(data.data[i].state=="1"){
					onlineCount++;
				}
	        	/*else{
					outlineCount++;
				}*/
	    	}
    	}
    	$("#realtime_rt_offline_count_header").html(onlineCount);
   	 $("#registerTipsDiv").unbind("click").bind("click",function(){
		/* var new_window = null; 
			 new_window = window.open(); */
			 /*new_window.location.href = encodeURI( "../locoreg/index?userName="+window.RTU.data.user.realName); */
			 window.open("modules/locoregmanagement/locoalarmreg.html");
	 });
    };
    
    //顶端计数
    var setLocoStatistics=function(data){
    	 /*var outlineCount=0;*/
    	 if(data.data&&data.data.length>0){
    		 $("#realtime_rt_all_count_header").html(data.data[0]);
        	 $("#realtime_rt_all_count_header1").html(data.data[1]);
        	 $("#realtime_rt_online_count_header").html(data.data[2]);
    	 } 
    	 /*$("#realtime_rt_all_count_header").html(data.version.locoCount);
    	 $("#realtime_rt_all_count_header1").html(data.version.dongcheCount);
    	 $("#realtime_rt_online_count_header").html(data.version.laisCount);*/
    	 
/*    	 var date=new Date();
         var month=date.getMonth()+1;
         if(month<10)month="0"+month;
         var day=date.getDate()<9?("0"+date.getDate()):date.getDate();
         var hours=date.getHours();
         var minutes=date.getMinutes()<9?("0"+date.getMinutes()):date.getMinutes();  
         var seconds=date.getSeconds()<9?("0"+date.getSeconds()):date.getSeconds(); 
         var str=month+"-"+day+" "+hours+":"+minutes+":"+seconds;
    	 $("#realtime_rt_refreshTime_header").text(str);*/
    	 
    	 //机车注册提醒

    	 /*if(data.version.registerFlag){
    		 //if(locoRegTimer)return;
    		 var module="locoregmanagement";
             for (var i = 0; RTU.data && RTU.data.setting && 
             i < RTU.data.setting.length; i++){
                 
                 for (var j = 0; RTU.data.setting[i].module && 
                 RTU.data.setting[i].module.length
                 && j < RTU.data.setting[i].module.length; j++) {
                     if (module == RTU.data.setting[i].module[j].name) {

                    	 var m=0;
                		 //window.clearInterval(locoRegTimer);
                		 //locoRegTimer=window.setInterval(function(){
                			 //$("#registerTipsDiv").css("display",m++%2?"block":"none");
                		 //},1000);
                		 $("#registerTipsDiv").unbind("click").bind("click",function(){
                			 var new_window = null; 
                 			 new_window = window.open(); 
                 			 new_window.location.href =encodeURI( "../locoreg/index?userName="+window.RTU.data.user.realName); 
                		 });
                		 return;
                     }
                 }
             }

    	 }
    	 else{
    		 //window.clearInterval(locoRegTimer);
    		 //$("#registerTipsDiv").css("display","none");
    		 $("#registerTipsDiv").unbind("click").bind("click",function(){
    			 var new_window = null; 
     			 new_window = window.open(); 
     			 new_window.location.href = encodeURI( "../locoreg/index?userName="+window.RTU.data.user.realName); 
    		 });
    	 }*/

    };
    
    var locoRegTimer=null;
    window.trItem = new trData();
    var timerControl = trItem.init();
//    window.warnTrItem = new trData();
//    var warnControl = warnTrItem.init({ topic: "warnData", url: "../alarmLkjView/findByProperty?locoTypeid=&locoNo=&locoAb=&ADeviceId=&AAlarmCode=&AAlarmLevel=&confirmFlag=0&confirmUserid=&beginTime=2010-11-24%2004:52:18&endTime=2115-11-27%2004:52:18&page=1&pageSize=10" });
 /*   window.warnTrItem = new trData();
    var warnControl = warnTrItem.init({timer:60000, topic: "warnData", url: "../alarmLkjView/findByProperty?page=1&pageSize=10&confirmFlag=0&temp="+new Date() });
    */
    /*window.setLocoItem = new trData();
    var setLocoItemControl = setLocoItem.init({ timer:60000,topic: "locoData",
    url: "../onlineloco/findLocoStatistics?date="+new Date() });*/

//    var failureWarnningControl = failureWarnningTrItem.init({ topic: "failureWarnningData", url: "../alarmLkjView/findAllFaultVehicle" });
    //例子:
    // new trData().init({toppic:"refreshData",url:"http://4343544"});
    //  psModel.subscribe("refreshData",function(t,data){
  
    //  },function(){ var arr= [{name:"checiName" ,value: "T"},{name:"depotName",value:"太原1"}]; arr.isIntersection =true;  return arr}
    //   ,function(){ var arr =[{}{}]; arr.isIntersection =true; return arr; });
    //  psModel.cancelScribe("refreshData",0)

    /*******************发布订阅********************/
    window.psModel = (function () {
        var q = {};
        topics = {},
	        subUid = -1;
        //发布消息
        q.publish = function (topic, data, TotalData) {
            if (!topics[topic]) { return; } //如果不存在订阅的事件就返回
            var subs = topics[topic], //取出数组
	            len = subs.length;
            
            while (len--) {//循环执行数据里面的函数fn
                if (!subs[len].notStop) continue;
                if (subs[len].condition&&subs[len].condition.length>0) {
                    subs[len].func(topic, q.search(data, subs[len].condition),TotalData);
                }
                else {
                    subs[len].func(topic, data, TotalData);
                }
            }
            return this;
        };
        //订阅事件
        q.subscribe = function (topic, func, condition) {
            var arrCondition = [];
            for(i=2;i<arguments.length;i++){
                  arrCondition.push(arguments[i]);
            }
            topics[topic] = topics[topic] ? topics[topic] : []; //如果存在主题的话就赋值一个空数组
            var token = (++subUid).toString();
            topics[topic].push({//把每个函数压到某个主题的数据下面
                token: token,
                func: func,
                condition: arrCondition,
                notStop: true
            });
            return token; //返回一个计数id
        };
        q.searchNow = function (obj) {
            if (!obj) {
                obj = {};
            }
            var trDataTemp = obj.trDataTemp || window.trItem;
            var topic = obj.topic || "refreshData";
            var token = obj.token || "";
            if (!token) {
                q.publish(topic, trDataTemp.allData);
            }
            else {
                if (!topics[topic]) { return; } //如果不存在订阅的事件就返回
                var subs = topics[topic], //取出数组
                 len = subs.length;
                while (len--) {//循环执行数据里面的函数fn
                    if (!subs[len].notStop) continue;
                    if (subs[len].token != token) continue;
                    
                    if (subs[len].condition&&subs[len].condition.length>0) {
                        subs[len].func(topic, q.search(trDataTemp.allData, subs[len].condition),trDataTemp.totaldata);
                    }
                    else {

                        subs[len].func(topic, trDataTemp.allData, trDataTemp.totaldata);
                    }
                }
            }
        };
        q.search = function (data, arrcondition) {
            if (typeof arrcondition != "object") {
                throw new Error("数据类型不对！");
            }
            var arr = [];
            if(arrcondition.length==0){
            	return data;
            }
            for(var m=0;m<arrcondition.length;m++){
              var condition =arrcondition[m]();
              if(condition.isIntersection==undefined||condition.isIntersection ==true){
               arr = [];
               for (var j = 0; j < data.length; j++) {
                var tag = true;
                var ditem = data[j];
                for (var i = 0; i < condition.length; i++) {
                    var interval = condition[i].interval;
                    if (interval) {
                        if (!q.timeSearch(interval, ditem)) {
                            tag = false;
                            break;
                        }
                        continue;
                    }
                    var n = condition[i].name;
                    var v = condition[i].value.toString();
                    var isIntersection = condition[i].isIntersection? condition[i].isIntersection:true;//是否交集
                    var sv = v.toLowerCase();
                    if(ditem[n]===0){//如果是0的情况
                       if(ditem[n] != sv){
                         tag = false;//抛弃
                         break;
                       }
                    }else{
                    	if(n=="lineNo"){
                    		if (ditem[n]&&sv&&ditem[n]!=sv) {
                                tag = false;//抛弃
                                break;
                            }
                    	}
                    	else{
                    		if (ditem[n]&&ditem[n].toString().toLowerCase().search(sv) == -1) {
                                tag = false;//抛弃
                                break;
                            }
                    	}
                    }
                }
                if (tag == true) {
                    arr.push(ditem);
                } else {
                    tag = true;
                 }
               }

          }else{
           arr = [];
           for (var j = 0; j < data.length; j++) {
                var tag = false;
                var ditem = data[j];
                for (var i = 0; i < condition.length; i++) {
                    var interval = condition[i].interval;
                    if (interval) {
                        if (q.timeSearch(interval, ditem)) {
                            tag = true;
                            break;
                        }
                        continue;
                    }
                    var n = condition[i].name;
                    var v = condition[i].value.toString();
                    var isIntersection = condition[i].isIntersection? condition[i].isIntersection:true;//是否交集
                    var sv = v.toLowerCase();
                    if(ditem[n]===0){//如果是0的情况
                       if(ditem[n] == sv){
                         tag = true;//抛弃
                         break;
                       }
                    }else{
                    	if(n=="lineNo"){
                    		if (ditem[n]&&sv&&ditem[n]!=sv) {
                                tag = false;//抛弃
                                break;
                            }
                    	}
                    	else{
                    		if (ditem[n]&&ditem[n].toString().toLowerCase().search(sv) == -1) {
                                tag = false;//抛弃
                                break;
                            }
                    	}
                    }
                }
                if (tag == true) {
                    arr.push(ditem);
                    tag = false;
                } 
               }      
          }
           data =arr;
        }
        return arr;
        };
        //时间条件
        q.timeSearch = function (timeobj, ditem) {
            try {
                var tn = timeobj.timeName;
                var timer = Date.parse(ditem[tn]);
                var t1 = Date.parse(timeobj.startTime);
                var t2 = Date.parse(timeobj.endTime);
            }
            catch (e) {
                return true;
            }
            if (!t1 && !t2) {
                return true;
            }
            if (t1 && t2) {
                if (t1 < timer < t2) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (t1 && !t2) {
                if (t1 < timer) {
                    return true;
                }
                else {
                    return false;
                }
            }
            if (!t1 && t2) {
                if (t2 > timer) {
                    return true;
                }
                else {
                    return false;
                }
            }
            return true;
        };
        q.searchByCondition = function (condition, trItemTemp) {
            if (!trItemTemp) {
                trItemTemp = trItem;
            }
            return q.search(trItemTemp.allData, condition);
        };
        //取消订阅
        q.cancelScribe = function (topic, token) {
            if (!topics[topic]) { return; } //如果不存在订阅的事件就返回
            var subs = topics[topic]; //取出数组
            for (var i = 0, len = subs.length; i < len; i++) {
                if (subs[i].token === token) {
                    subs.splice(i, 1);
                    break;
                }
            }
        };
//       //取消订阅
//        q.cancelAllScribe = function (topic) {
//            if (!topics[topic]) { return; } //如果不存在订阅的事件就返回
//            var subs = topics[topic]; //取出数组
//            for (var i = 0, len = subs.length; i < len; i++) {
//            	if(topic=="refreshData"){
//        			if(subs[i].token==(window.homeTimer||-1)){
//        				continue;
//        	    	}
//            	}
//                 subs.splice(i, 1);
//            }
//        };
        
        //notStop:true为启动 false 为停止
        q.runControl = function (topic, token, notStop) {
            if (!topics[topic]) { return; } //如果不存在订阅的事件就返回
            var subs = topics[topic]; //取出数组
            for (var i = 0, len = subs.length; i < len; i++) {
                if (subs[i].token === token) {
                    subs[i].notStop = notStop;
                    break;
                }
            }
        };
        return q;
    })();
});