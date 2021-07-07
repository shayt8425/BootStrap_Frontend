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
        this.timer = 5000;
        this.interval = null;
        this.url = "";
        this.topic = "";
        this.extendParam = null;
        this.httpRequest = new XMLHttpRequest();
        this.locoStr=LocoInfoStr;
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
            if (!this.extendParam) {
                this.extendParam = { sortField: "lkjTime", sortOrder: "DESC" };
            }
            if(this.httpRequest==null){
            	this.httpRequest=new XMLHttpRequest();
            }
            var that = this;
            this.url=this.url+"&sortField="+this.extendParam.sortField+"&sortOrder="+this.extendParam.sortOrder;
			this.httpRequest.dataType="jsonp";
            this.httpRequest.open("GET",this.url,true);
            this.httpRequest.onreadystatechange = success;
            this.httpRequest.send();
            function success(){
            	if (that.httpRequest.readyState == 4){
	                if (that.httpRequest.status == 200) {
	                	/*that.totaldata=$.parseJSON(that.httpRequest.response);
	                    that.allData =that.totaldata.data;
	                    setTimeout(function(){
	                    	psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
	                    },1000);*/
	                	var tempData=$.parseJSON(that.httpRequest.response);
	                	if(tempData.data&&tempData.data.length>0){
	                		if(that.locoStr){
	                			var newData=[];
            					var countIndex=0;
            					for(var i=0;i<tempData.data.length;i++){
            						if(data.indexOf(""+tempData.data[i].locoTypeid+tempData.data[i].locoNo+tempData.data[i].locoAb)!=-1){
            							newData[++countIndex]=tempData.data[i];
            						}
            					}
            					that.totaldata=tempData;
            					that.totaldata.data=newData;
        		                that.allData =newData;
        		                setTimeout(function(){
        	                    	psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
        	                    },1000);
	                		}
	                		else{
	                			$.ajax({
		                			url:"http://124.224.203.46:7080/lkj/locoInfo/listLocoInfoStr.do",
		                			type:"GET",
		                			success:function(data){
		                				if(data){
		                					that.locoStr=data;
		                					var newData=[];
		                					var countIndex=0;
		                					for(var i=0;i<tempData.data.length;i++){
		                						if(LocoInfoStr.indexOf(""+tempData.data[i].locoTypeid+tempData.data[i].locoNo+tempData.data[i].locoAb)!=-1){
		                							newData[++countIndex]=tempData.data[i];
		                						}
		                					}
		                					that.totaldata=tempData;
		                					that.totaldata.data=newData;
			        		                that.allData =newData;	
		                				}
		                				else{
		                					that.totaldata=tempData;
			        		                that.allData =that.totaldata.data;	
		                				}
		        	                    setTimeout(function(){
		        	                    	psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
		        	                    },1000);
		                			}
		                		});
	                		}
	                	}
	                	else{
        					that.totaldata=tempData;
    		                that.allData =that.totaldata.data;

    	                    setTimeout(function(){
    	                    	psModel.publish(that.topic, that.allData, that.totaldata); //发布刷新订阅
    	                    },1000);
        				}
	                }else{
		                  if (that.topic == "refreshData") {
		                	  RTU.invoke("header.alarmMsg.show", "数据加载失败，请检查网络状况！");
		                  }
	                }
                }
            }
        },
        init: function (obj) {
        	
                if (this.interval) {
                clearInterval(this.interval);
            }
            var that = this;
            this.loadFn(obj);
            this.interval = setInterval(function () {
                that.loadFn(obj);
            }, this.timer);
            return this.interval;
        }
    };
    
    window.trItem = new trData();
    var timerControl = trItem.init();
//    window.warnTrItem = new trData();
//    var warnControl = warnTrItem.init({ topic: "warnData", url: "../alarmLkjView/findByProperty?locoTypeid=&locoNo=&locoAb=&ADeviceId=&AAlarmCode=&AAlarmLevel=&confirmFlag=0&confirmUserid=&beginTime=2010-11-24%2004:52:18&endTime=2115-11-27%2004:52:18&page=1&pageSize=10" });
    window.warnTrItem = new trData();
    //var warnControl = warnTrItem.init({ topic: "warnData", url: "../alarmLkjView/findByProperty?page=1&pageSize=10&confirmFlag=0&temp="+new Date() });
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
                        if (ditem[n]&&ditem[n].toString().toLowerCase().search(sv) == -1) {
                        tag = false;//抛弃
                        break;
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
                        if (ditem[n]&&ditem[n].toString().toLowerCase().search(sv) != -1) {
                        tag = true;//抛弃
                        break;
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