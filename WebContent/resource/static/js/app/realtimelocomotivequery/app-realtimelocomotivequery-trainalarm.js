RTU.DEFINE(function (require, exports) {
/**
 * 模块名：列车跟踪-机车详情
 * name： 
 * date:2015-2-12
 * version:1.0 
 */
    require("../../../css/app/app-locomotive-details.css");
    
    require("app/loading/list-loading.js");
    require("app/curve/moveCurve/moveCurve.js"); 
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");

    RTU.register("app.realtimelocomotivequery.trainalarm.init", function () {
        return function (detailsData) {
            $("#checiName").text(detailsData.checiName);
            $("#locoTypeid_locoNo").text("");
            $("#driverId").text(detailsData.driverId);
            $("#DName").text(detailsData.DName);
            $("#speed").text(detailsData.speed);
            $("#limitedSpeed").text(detailsData.limitedSpeed);
            $("#signalNo").text(detailsData.signalNo);
            $("#frontDistance").text(detailsData.frontDistance);
            $("#totalWeight").text(detailsData.totalWeight);
            $("#length").text(detailsData.length);
            $("#vehicleCount").text(detailsData.vehicleCount);
            $("#engineSpeed").text(detailsData.engineSpeed);
            $("#guanya").text(detailsData.guanya);
            $("#gangya").text(detailsData.gangya);
            $("#workStatus").text(detailsData.workStatus);
            $("#jkstate").text(detailsData.jkstate);
            $("#zhidong").text(detailsData.zhidongName);
            $("#RAlarmLevel").text(detailsData.RAlarmLevel);
            $("#alarmName").text(detailsData.alarmName);
        };
    });

    var tempImgObj = { "0": "NO.png", "1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
    function getImgUrl(id) {
        if (tempImgObj[id.toString()])
            return "../static/img/app/moveCurve/" + tempImgObj[id.toString()];
        else {
            return "../static/img/app/moveCurve/NO.png";
        }
    }
    RTU.register("app.realtimelocomotivequery.trainalarm.initData", function () {

        return function (data) {
            //前三个
            $.ajax({
            	url: "../onlineloco/searchLocoInfoByProperty?locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO + "&locoAb=" + data.itemData.locoAb,
            	dataType: "jsonp",
                type: "GET",
                success: function (r) {
                    var tabId = data.tabId;
                    var itemData = r.data;
                    try {
                        if (tabId) {
                            $("#" + tabId + " .speed").text(itemData.speed); //实速度
                            $("#" + tabId + " .limitedSpeed").text(itemData.limitedSpeed); //限速
                            $("#" + tabId + " .frontDistance").text(itemData.frontDistance); //距离
                            $("#" + tabId + " .checiName").text(itemData.checiName); //车次
//                            $("#" + tabId + " .drDriverName").text(itemData.driverId); //司机名称
                            $("#" + tabId + " .drDriverName").text(itemData.drDriverName); 
                            var colValue=null;
                            if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                        		colValue=itemData.ttypeShortname + "-" + itemData.locoNo;
                            } else if (itemData.locoAb == "1") {
                            	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                            } else {
                            	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                            }
                            $("#" + tabId + " .locoNo").text(colValue); //机车   //itemData.ttypeShortname + "-" + itemData.locoNo
                            $("#" + tabId + " .dname").text(itemData.dname); //所属区段
                            $("#" + tabId + " .distanceText").text(itemData.frontDistance); //距离
                            $("#" + tabId + " .place").text(itemData.sName+"("+itemData.lname+")");
                            $("#" + tabId + " .signalNo").text(itemData.signalName+" "+itemData.signalNo); //信号机
                            $("#" + tabId + " .kiloSign").text(itemData.kiloSign / 1000); //公里标
                            $("#" + tabId + " .totalWeight").text(itemData.totalWeight); //总重量
                            $("#" + tabId + " .totalDistance").text(itemData.length); //计长
                            $("#" + tabId + " .vehicleCount").text(itemData.vehicleCount); //辆数
                            $("#" + tabId + " .engineSpeed").text(itemData.engineSpeed); //柴速 
                            $("#" + tabId + " .guangya").text(itemData.guanya); //管压 
                            $("#" + tabId + " .gangya").text(itemData.gangya); //缸压 
//                            $("#" + tabId + " .workStatus").text(itemData.workStatus); //工况 
                            $("#" + tabId + " .workStatus").text(itemData.workStatusName);
                            $("#" + tabId + " .jkstate").text(itemData.jkstateName); //监控状态 
                            $("#" + tabId + " .zhidong").text(itemData.zhidongName); //制动输出 
                            if (itemData.lkjTimeStr) {
                                $("#" + tabId + " .receiveTime").text(itemData.lkjTimeStr); //时间 
                            } else {
                                var d = new Date();
                                var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                                $("#" + tabId + " .receiveTime").text(timeText); //时间 
                            }

                            //版本信息
                            $("#" + tabId + " .jkzbA").text(itemData.jkzbA); // 监控主板A版本信息
                            $("#" + tabId + " .jkzbB").text(itemData.jkzbB); // 监控主板B版本信息	
                            $("#" + tabId + " .jkzbAdata").text(itemData.jkzbAdata); //监控主板A数据版本
                            $("#" + tabId + " .jkzbBdata").text(itemData.jkzbBdata); //监控主板B数据版本	
                            $("#" + tabId + " .monitor1").text(itemData.monitor1); // 一端显示器版本信息
                            $("#" + tabId + " .monitor2").text(itemData.monitor2); // 二端显示器版本信息	
                            $("#" + tabId + " .groundA").text(itemData.groundA); // 地面处理A模块版本信息
                            $("#" + tabId + " .groundB").text(itemData.groundB); // 地面处理B模块版本信息
                            $("#" + tabId + " .txbA").text(itemData.txbA); // 通信A模块版本信息
                            $("#" + tabId + " .txbB").text(itemData.txbB); // 通信B模块版本信息
                            $("#" + tabId + " .kztxbA").text(itemData.kztxbA); // 扩展通信A版本信息
                            $("#" + tabId + " .kztxbB").text(itemData.kztxbB); // 扩展通信B版本信息
                            
                            //质量警报
                            $("#" + tabId + " .alarmTime").text(itemData.alarmTime);
//                            $("#" + tabId + " .tscAlarmName").text(itemData.tscAlarmName);
                            $("#" + tabId + " .tscAlarmName").text(itemData.alarmName);
                            $("#" + tabId + " .alarmType").text(itemData.alarmType);
                            $("#" + tabId + " .jsState").text(itemData.jkstateName);
                           
                            
                            if(itemData.alarmCode=="9001"){
                            	 var desc=[];
                                 if(itemData.alarmDesc!=""){
                            		 desc=itemData.alarmDesc.split("|");
                                 }
                            	var d="";
            	       	 		if(desc[1]){
            	       	 			d=desc[1];
            	       	 		}
            	       	 		
            	       	 		$("#" + tabId + " .alarmDesc").parent().removeClass("hidden");
            	       	 		$("#" + tabId + " .alarmDesc").text(d);
                            }
                            
                            //点击详情
                          
                            $(".bundefined").click(function(){
                            	if(itemData.alarmCode==""){
                            		 RTU.invoke("header.alarmMsg.show", "该车没有故障报警信息。");
                            	}else{
                            		 var sendData={
                   	                      locoTypeid:itemData.locoTypeid,
                   	                      locoNo:itemData.locoNo,
                   	                      locoAb:itemData.locoAb,
                   	                      locoTypename:itemData.ttypeShortname,
                   	                      kehuo:itemData.kehuo,
                   	                      date:itemData.lkjTimeStr,
                   	                      alarmTime:itemData.alarmTime
                                         };
                                         RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                            	}
                            	
                             });
                             
                            //状态图标
                            $("#" + tabId + " .distance_ico").attr("src", getImgUrl(itemData.lineFlag));
                        } else {
                            $(" .speed").text(itemData.speed); //实速度
                            $(" .limitedSpeed").text(itemData.limitedSpeed); //限速
                            $(" .frontDistance").text(itemData.frontDistance); //距离
                            $(" .checiName").text(itemData.checiName); //车次
//                            $(" .drDriverName").text(itemData.driverId); //司机名称
                            $(" .drDriverName").text(itemData.drDriverName);
                            var colValue=null;
                            if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                        		colValue=itemData.ttypeShortname + "-" + itemData.locoNo;
                            } else if (itemData.locoAb == "1") {
                            	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                            } else {
                            	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                            }
                            
                            $(" .locoNo").text(colValue); //机车  //itemData.ttypeShortname + "-" + itemData.locoNo
                            $(" .dname").text(itemData.dname); //所属区段
                            $(" .distanceText").text(itemData.frontDistance); //距离 
                            $(".place").text(itemData.sName+"("+itemData.lname+")");
                            $(" .signalNo").text(itemData.signalName+" "+itemData.signalNo); //信号机
                            $(" .kiloSign").text(itemData.kiloSign / 1000); //公里标
                            $(" .totalWeight").text(itemData.totalWeight); //总重量
                            $(" .totalDistance").text(itemData.length); //计长
                            $(" .vehicleCount").text(itemData.vehicleCount); //辆数
                            $(" .engineSpeed").text(itemData.engineSpeed); //柴速 
                            $(" .guangya").text(itemData.guanya); //管压 
                            $(" .gangya").text(itemData.gangya); //缸压 
//                            $(" .workStatus").text(itemData.workStatus); //工况 
                            $(" .workStatus").text(itemData.workStatusName);
                            $(" .jkstate").text(itemData.jkstateName); //监控状态 
                            $(" .zhidong").text(itemData.zhidongName); //制动输出 
                            if (itemData.lkjTimeStr) {
                                $(" .receiveTime").text(itemData.lkjTimeStr); //时间 
                            } else {
                                var d = new Date();
                                var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                                $(" .receiveTime").text(timeText); //时间 
                            }
                            if(itemData.gpsTimeoutFlag==1){
                            	//gps已超时,且长期未上线
                            }
                            //版本信息
                            $(" .jkzbA").text(itemData.jkzbA); // 监控主板A版本信息
                            $(" .jkzbB").text(itemData.jkzbB); // 监控主板B版本信息	
                            $(" .jkzbAdata").text(itemData.jkzbAdata); //监控主板A数据版本
                            $(" .jkzbBdata").text(itemData.jkzbBdata); //监控主板B数据版本	
                            $(" .monitor1").text(itemData.monitor1); // 一端显示器版本信息
                            $(" .monitor2").text(itemData.monitor2); // 二端显示器版本信息	
                            $(" .groundA").text(itemData.groundA); // 地面处理A模块版本信息
                            $(" .groundB").text(itemData.groundB); // 地面处理B模块版本信息
                            $(" .txbA").text(itemData.txbA); // 通信A模块版本信息
                            $(" .txbB").text(itemData.txbB); // 通信B模块版本信息
                            $(" .kztxbA").text(itemData.kztxbA); // 扩展通信A版本信息
                            $(" .kztxbB").text(itemData.kztxbB); // 扩展通信B版本信息
                            //质量警报
                            $(" .alarmTime").text(itemData.alarmTime);
//                            $(" .tscAlarmName").text(itemData.tscAlarmName);
                            $(" .tscAlarmName").text(itemData.alarmName);
                            $(" .alarmType").text(itemData.alarmType);
                            $(" .jsState").text(itemData.jkstateName);
                            
                            if(itemData.alarmCode=="9001"){
                           	 var desc=[];
                                if(itemData.alarmDesc!=""){
                           		 desc=itemData.alarmDesc.split("|");
                                }
                           	var d="";
           	       	 		if(desc[1]){
           	       	 			d=desc[1];
           	       	 		}
           	       	 		
           	       	 		$(" .alarmDesc").parent().removeClass("hidden");
           	       	 		$(" .alarmDesc").text(d);
                           }
                            
                            
                            //点击详情
                            $(".bundefined").click(function(){
                            	if(itemData.alarmCode==""){
                           		 RTU.invoke("header.alarmMsg.show", "该车没有故障报警信息。");
	                           	}else{
	                            	 var sendData={
	                	                      locoTypeid:itemData.locoTypeid,
	                	                      locoNo:itemData.locoNo,
	                	                      locoAb:itemData.locoAb,
	                	                      locoTypename:itemData.ttypeShortname,
	                	                      kehuo:itemData.kehuo,
	                	                      date:itemData.lkjTimeStr,
	                	                      alarmTime:itemData.alarmTime
	                                      };
	                                      RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
	                           	}
                             });
                            //状态图标
                            $(" .distance_ico").attr("src", getImgUrl(itemData.lineFlag));
                        }

                    }
                    catch (e) {

                        throw new Error("没有返回数据或者数据格式不正确！");
                    }


                }
            });
        };
    });
    
    var initData;//保存新的数据
    RTU.register("app.realtimelocomotivequery.trainalarm.initData_Test", function () {
    return function (data) {
    	if(data){
    		var tabId = data.tabId;
    		var itemData=data.itemData;
    		if(initData){//保证数据是新的
    			itemData=initData;
    		}
    		if(tabId){
    			//运行状态
    			$("#" + tabId + " .speed").text(itemData.speed); //实速度
                $("#" + tabId + " .limitedSpeed").text(itemData.limitedSpeed); //限速
                $("#" + tabId + " .frontDistance").text(itemData.frontDistance); //距离
                $("#" + tabId + " .checiName").text(itemData.checiName); //车次
                $("#" + tabId + " .drDriverName").text(itemData.drDriverName); //司机名称
                /*var colValue=null;
                if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
            		colValue=itemData.ttypeShortname + "-" + itemData.locoNo;
                } else if (itemData.locoAb == "1") {
                	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
                } else {
                	colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
                }
                $("#" + tabId + " .locoNo").text(colValue); //机车   //itemData.ttypeShortname + "-" + itemData.locoNo
                */
                $("#" + tabId + " .locoNo").text(itemData.locoTypeStr)
                $("#" + tabId + " .dname").text(itemData.dname); //所属区段
                $("#" + tabId + " .distanceText").text(itemData.frontDistance); //距离
                $("#" + tabId + " .place").text(itemData.sName+"("+itemData.lname+")");
                $("#" + tabId + " .signalNo").text(itemData.signalName+" "+itemData.signalNo); //信号机
                $("#" + tabId + " .kiloSign").text(itemData.kiloSign / 1000); //公里标
                $("#" + tabId + " .totalWeight").text(itemData.totalWeight); //总重量
                $("#" + tabId + " .totalDistance").text(itemData.length); //计长
                $("#" + tabId + " .vehicleCount").text(itemData.vehicleCount); //辆数
                $("#" + tabId + " .engineSpeed").text(itemData.engineSpeed); //柴速 
                $("#" + tabId + " .guangya").text(itemData.guanya); //管压 
                $("#" + tabId + " .gangya").text(itemData.gangya); //缸压 
                $("#" + tabId + " .workStatus").text(itemData.workStatusName); //工况
                $("#" + tabId + " .jkstate").text(itemData.jkstateName); //监控状态 
                $("#" + tabId + " .zhidong").text(itemData.zhidongName); //制动输出 
                if (itemData.lkjTimeStr) {
                	if(itemData.gpsTimeoutFlag==1){
                		$("#" + tabId + " .receiveTime").text(itemData.lkjTimeStr); //时间 
                		$("#"+tabId+" .errorDesc").text("GPS信息超时,GPS最后时刻:"+itemData.gpsTime+"");
                	}
                	else{
                		$("#" + tabId + " .receiveTime").text(itemData.lkjTimeStr); //时间 
                	}
                    
                } else {
                    var d = new Date();
                    var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                    $("#" + tabId + " .receiveTime").text(timeText); //时间 
                }
    		}else{
    			//运行状态
    			$(" .speed").text(itemData.speed); //实速度
    			$(" .limitedSpeed").text(itemData.limitedSpeed); //限速
    			$(" .frontDistance").text(itemData.frontDistance); //距离
    			$(" .checiName").text(itemData.checiName); //车次
    			$(" .drDriverName").text(itemData.drDriverName);//司机名称
    			/*var colValue=null;
    			if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
    				colValue=itemData.ttypeShortname + "-" + itemData.locoNo;
    			} else if (itemData.locoAb == "1") {
    				colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_A;
    			} else {
    				colValue= itemData.ttypeShortname + "-" + itemData.locoNo + window.locoAb_B;
    			}
    			$(" .locoNo").text(colValue); //机车
*/    			
    			$(" .locoNo").text(itemData.locoTypeStr);
    			$(" .dname").text(itemData.dname); //所属区段
    			$(".place").text(itemData.sName+"("+itemData.lname+")");//位置
    			$(" .signalNo").text(itemData.signalName+" "+itemData.signalNo); //信号机
    			$(" .kiloSign").text(itemData.kiloSign / 1000); //公里标
    			$(" .totalWeight").text(itemData.totalWeight); //总重量
    			$(" .totalDistance").text(itemData.length); //计长
    			$(" .vehicleCount").text(itemData.vehicleCount); //辆数
    			$(" .engineSpeed").text(itemData.engineSpeed); //柴速 
    			$(" .guangya").text(itemData.guanya); //管压 
    			$(" .gangya").text(itemData.gangya); //缸压 
    			$(" .workStatus").text(itemData.workStatusName);//工况 
    			$(" .jkstate").text(itemData.jkstateName); //监控状态 
    			$(" .zhidong").text(itemData.zhidongName); //制动输出 
    			if (itemData.lkjTimeStr) {
    				$(" .receiveTime").text(itemData.lkjTimeStr+"  <GPS失效,无法获取定位信息>"); //时间 
    			} else {
    				var d = new Date();
    				var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
    				$(" .receiveTime").text(timeText+"  <GPS失效>"); //时间 
    			}
    		}
    		
    		/*setTimeout(function(){
	 			
	 		},50);*/
    		
    		$.ajax({
            	url: "../onlineloco/searchLocoInfoByProperty?locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO + "&locoAb=" + data.itemData.locoAb,
            	dataType: "jsonp",
                type: "GET",
                success: function (r) {
                	 var tabId = data.tabId;
                     var itemData = r.data;
                     if(window.locoInfoInterval){//已启动定时器
             			initData=itemData;
                     }else{
                     	initData=[];
                     }
                     try {
                         if (tabId) {
                             //版本信息
                             $("#" + tabId + " .jkzbA").text(itemData.jkzbA); // 监控主板A版本信息
                             $("#" + tabId + " .jkzbB").text(itemData.jkzbB); // 监控主板B版本信息	
                             $("#" + tabId + " .jkzbAdata").text(itemData.jkzbAdata); //监控主板A数据版本
                             $("#" + tabId + " .jkzbBdata").text(itemData.jkzbBdata); //监控主板B数据版本	
                             $("#" + tabId + " .jkdateA").text(itemData.jkzbAdate); //监控主板A日期版本
                             $("#" + tabId + " .jkdateB").text(itemData.jkzbBdate); //监控主板B日期版本	
                             $("#" + tabId + " .monitor1").text(itemData.monitor1); // 一端显示器版本信息
                             $("#" + tabId + " .monitor2").text(itemData.monitor2); // 二端显示器版本信息	
                             $("#" + tabId + " .monitorData1").text(itemData.monitorData1); // 一端数据版本信息
                             $("#" + tabId + " .monitorData2").text(itemData.monitorData2); // 二端数据版本信息	
                             $("#" + tabId + " .groundA").text(itemData.groundA); // 地面处理A模块版本信息
                             $("#" + tabId + " .groundB").text(itemData.groundB); // 地面处理B模块版本信息
                             $("#" + tabId + " .txbA").text(itemData.txbA); // 通信A模块版本信息
                             $("#" + tabId + " .txbB").text(itemData.txbB); // 通信B模块版本信息
                             $("#" + tabId + " .kztxbA").text(itemData.kztxbA); // 扩展通信A版本信息
                             $("#" + tabId + " .kztxbB").text(itemData.kztxbB); // 扩展通信B版本信息
                             
                             //质量警报
                             $("#" + tabId + " .alarmTime").text(itemData.alarmTime);
//                             $("#" + tabId + " .tscAlarmName").text(itemData.tscAlarmName);
                             $("#" + tabId + " .tscAlarmName").text(itemData.alarmName);
                             $("#" + tabId + " .alarmType").text(itemData.alarmType);
                             $("#" + tabId + " .jsState").text(itemData.jkstateName);
                            
                             
                             if(itemData.alarmCode=="9001"){
                             	 var desc=[];
                                  if(itemData.alarmDesc!=""){
                             		 desc=itemData.alarmDesc.split("|");
                                  }
                             	var d="";
             	       	 		if(desc[1]){
             	       	 			d=desc[1];
             	       	 		}
             	       	 		
             	       	 		$("#" + tabId + " .alarmDesc").parent().removeClass("hidden");
             	       	 		$("#" + tabId + " .alarmDesc").text(d);
                             }
                             
                             //点击详情
                           
                             $(".bundefined").click(function(){
                             	if(itemData.alarmCode==""){
                             		 RTU.invoke("header.alarmMsg.show", "该车没有故障报警信息。");
                             	}else{
                             		 var sendData={
                    	                      locoTypeid:itemData.locoTypeid,
                    	                      locoNo:itemData.locoNo,
                    	                      locoAb:itemData.locoAb,
                    	                      locoTypename:itemData.ttypeShortname,
                    	                      kehuo:itemData.kehuo,
                    	                      date:itemData.lkjTimeStr,
                    	                      alarmTime:itemData.alarmTime
                                          };
                                          RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                             	}
                             	
                              });
                              
                             //状态图标
                             $("#" + tabId + " .distance_ico").attr("src", getImgUrl(itemData.lineFlag));
                         } else {
                             //版本信息
                             $(" .jkzbA").text(itemData.jkzbA); // 监控主板A版本信息
                             $(" .jkzbB").text(itemData.jkzbB); // 监控主板B版本信息	
                             $(" .jkzbAdata").text(itemData.jkzbAdata); //监控主板A数据版本
                             $(" .jkzbBdata").text(itemData.jkzbBdata); //监控主板B数据版本	
                             $(" .jkdateA").text(itemData.jkzbAdate); //监控主板A日期版本
                             $(" .jkdateB").text(itemData.jkzbBdate); //监控主板B日期版本	
                             $(" .monitor1").text(itemData.monitor1); // 一端显示器版本信息
                             $(" .monitor2").text(itemData.monitor2); // 二端显示器版本信息
                             $(" .monitorData1").text(itemData.monitorData1); // 一端数据版本信息
                             $(" .monitorData2").text(itemData.monitorData2); // 二端数据版本信息
                             $(" .groundA").text(itemData.groundA); // 地面处理A模块版本信息
                             $(" .groundB").text(itemData.groundB); // 地面处理B模块版本信息
                             $(" .txbA").text(itemData.txbA); // 通信A模块版本信息
                             $(" .txbB").text(itemData.txbB); // 通信B模块版本信息
                             $(" .kztxbA").text(itemData.kztxbA); // 扩展通信A版本信息
                             $(" .kztxbB").text(itemData.kztxbB); // 扩展通信B版本信息
                             //质量警报
                             $(" .alarmTime").text(itemData.alarmTime);
//                             $(" .tscAlarmName").text(itemData.tscAlarmName);
                             $(" .tscAlarmName").text(itemData.alarmName);
                             $(" .alarmType").text(itemData.alarmType);
                             $(" .jsState").text(itemData.jkstateName);
                             
                             if(itemData.alarmCode=="9001"){
                            	 var desc=[];
                                 if(itemData.alarmDesc!=""){
                            		 desc=itemData.alarmDesc.split("|");
                                 }
                            	var d="";
            	       	 		if(desc[1]){
            	       	 			d=desc[1];
            	       	 		}
            	       	 		
            	       	 		$(" .alarmDesc").parent().removeClass("hidden");
            	       	 		$(" .alarmDesc").text(d);
                            }
                             
                             //点击详情
                             $(".bundefined").click(function(){
                             	if(itemData.alarmCode==""){
                            		 RTU.invoke("header.alarmMsg.show", "该车没有故障报警信息。");
 	                           	}else{
 	                            	 var sendData={
 	                	                      locoTypeid:itemData.locoTypeid,
 	                	                      locoNo:itemData.locoNo,
 	                	                      locoAb:itemData.locoAb,
 	                	                      locoTypename:itemData.ttypeShortname,
 	                	                      kehuo:itemData.kehuo,
 	                	                      date:itemData.lkjTimeStr,
 	                	                      alarmTime:itemData.alarmTime
 	                                      };
 	                                      RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
 	                           	}
                              });
                             //状态图标
                             $(" .distance_ico").attr("src", getImgUrl(itemData.lineFlag));
                         }

                     }
                     catch (e) {
                         throw new Error("没有返回数据或者数据格式不正确！");
                     }
                }
        	});
       }
    };
});
    RTU.register("app.realtimelocomotivequery.trainalarm.searchEquip", function () {
        return function (obj) {
            var url = "../jkEquip/searchLocoByEquip?locoTypeid=" + obj.itemData.locoTypeid + "&locoNo=" + obj.itemData.locoNO + "&locoAb=" + obj.itemData.locoAb;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    var tabId = obj.tabId;
                    if (data&&data["data"]&&data.data.length > 0) {
                        if (tabId) {
                        	
                            if (data.data[0].hxz == 0) {
                                $("#" + tabId + " .left_equip_hxz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $("#" + tabId + " .left_equip_hxz").text("正常");
                            } else {
                                $("#" + tabId + " .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $("#" + tabId + " .left_equip_hxz").text("故障");
                            }
                            if(data.data[0].guard1setup==0){
                            	$("#" + tabId + " .left_equip_jingti1").hide();
                            	}
                            else{
                            	$("#" + tabId + " .left_equip_jingti1").show();
                            	$("#" + tabId + " .left_equip_jingti1").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	//$("#" + tabId + " .left_equip_jingti1").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            }
                            if(data.data[0].guard2setup==0){
                            	$("#" + tabId + " .left_equip_jingti2").hide();                         	
                            }
                            else{
                            	$("#" + tabId + " .left_equip_jingti2").show();
                            	$("#" + tabId + " .left_equip_jingti2").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	//$("#" + tabId + " .left_equip_jingti2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            }
                            
                            
                            $("#" + tabId + " .left_equip_B_tdState1").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState3").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState4").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState5").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState6").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState7").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $("#" + tabId + " .left_equip_B_tdState8").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            if (data.data[0].monitor1 == 0) {
                                $("#" + tabId + " .left_equip_monitor1").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].monitor2 == 0) {
                                $("#" + tabId + " .left_equip_monitor2").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].sjbyz == 0) {
                                $("#" + tabId + " .left_equip_sjbyz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $("#" + tabId + " .left_equip_sjbyz").text("一致");
                            } else {
                                $("#" + tabId + " .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $("#" + tabId + " .left_equip_sjbyz").text("不一致");
                            }

                            if (data.data[0].jkbyz == 0) {
                                $("#" + tabId + " .left_equip_jkbyz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $("#" + tabId + " .left_equip_jkbyz").text("一致");
                            } else {
                                $("#" + tabId + " .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $("#" + tabId + " .left_equip_jkbyz").text("不一致");
                            }

                            if (data.data[0].zdgz == 0) {
                                $("#" + tabId + " .left_equip_zdgz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $("#" + tabId + " .left_equip_zdgz").text("正常");
                            } else {
                                $("#" + tabId + " .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $("#" + tabId + " .left_equip_zdgz").text("不正常");
                            }
                            /*if(data.data[0].locoAb!="1"&&data.data[0].locoAb!="2"){
                            	$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
                            	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
                            	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                            }else{
                            	$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbB);
                            	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbBData);
                            	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor2Info);
                            }*/
                            /*$("#" + tabId + " .left_equip_B_jkzbAjkdate")
                    		.removeClass("bg-red-color-wb");
                    		$("#" + tabId + " .left_equip_B_jkzbAdata")
                    		.removeClass("bg-red-color-wb");
                    		$("#" + tabId + " .left_equip_B_monitor1")
                    		.removeClass("bg-red-color-wb");*/
                            $("#" + tabId + " .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                    		$("#" + tabId + " .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                    		$("#" + tabId + " .left_equip_B_monitor1").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                    		$("#" + tabId + " .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                    		$("#" + tabId + " .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                    		$("#" + tabId + " .left_equip_B_monitor1").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                            if(data.data[0].dsj=="0"){
                            	if(data.data[0].jkzbA!=data.data[0].jkzbB){
                            		$("#" + tabId + " .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		$("#" + tabId + " .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		$("#" + tabId + " .left_equip_B_monitor1").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		/*$("#" + tabId + " .left_equip_B_jkzbAjkdate")
                            		.addClass("bg-red-color-wb");
                            		$("#" + tabId + " .left_equip_B_jkzbAdata")
                            		.addClass("bg-red-color-wb");
                            		$("#" + tabId + " .left_equip_B_monitor1")
                            		.addClass("bg-red-color-wb");*/
                            		$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA+"/"+data.data[0].jkzbB);
                                	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData+"/"+data.data[0].jkzbBData);
                                	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor1Info+"/"+data.data[0].monitor2Info);
                            	}
                            	else{
                            		$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
                                	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
                                	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                            	}
                            }
                            else{
                            	if(data.data[0].abj=="0"){
                                	$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
                                	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
                                	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                                }else{
                                	$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbB);
                                	$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbBData);
                                	$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor2Info);
                                }
                            }
                            
                            ///////////////////////////////////////////////////////////////////
                           
                            $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_txaError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_claError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_clbError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_txbError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-divErrorGray-wb");

                            $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-divErrorGray-wb");

                            if(data.data[0].dsj==0||data.data[0].abj==0){
                            	//双击运行或者单机且为a机运行
                            	if (data.data[0].szlsrcA == 0) {
                                    $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrA == 0) {
                                    $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].kztxA == 0) {
                                    $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].mnlsrcA == 0) {
                                    $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].txbA == 0) {
                                    $("#" + tabId + " .left_equip_txaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].xxclA == 0) {
                                    $("#" + tabId + " .left_equip_claError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].clockA == 0&&data.data[0].canA==0&&data.data[0].cpuRamA==0&&data.data[0].ramA==0&&data.data[0].dataEpromA==0&&data.data[0].proEpromA==0) {
                                    $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }
                            }
                            else{
                            	//单机且不是a机运行
                                $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                            }
                            
                            if(data.data[0].dsj==0||data.data[0].abj==1){
                            	//双击或者单机且为b机运行
                                if (data.data[0].clockB == 0&&data.data[0].canB==0&&data.data[0].cpuRamB==0&&data.data[0].ramB==0&&data.data[0].dataEpromB==0&&data.data[0].proEpromB==0) {
                                    $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].xxclB == 0) {
                                    $("#" + tabId + " .left_equip_clbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].txbB == 0) {
                                    $("#" + tabId + " .left_equip_txbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].mnlsrcB == 0) {
                                    $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].kztxB == 0) {
                                    $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrB == 0) {
                                    $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrcB == 0) {
                                    $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }
                            }
                            else{
                            	//单机且不是b机运行
                                $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                            }
                            

                            ///////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_mnLcgyl").text(data.data[0].mnLcgyl);
                            $("#" + tabId + " .left_equip_pipestress0").text(data.data[0].pipestress0);
                            $("#" + tabId + " .left_equip_pipestress1").text(data.data[0].pipestress1);
                            $("#" + tabId + " .left_equip_pipestress2").text(data.data[0].pipestress2);
                            $("#" + tabId + " .left_equip_pipestress3").text(data.data[0].pipestress3);
                            $("#" + tabId + " .left_equip_plSd0").text(data.data[0].speed0);
                            $("#" + tabId + " .left_equip_plSd1").text(data.data[0].speed1);
                            $("#" + tabId + " .left_equip_plSd2").text(data.data[0].speed2);
                            //////////////////////////////////////////////////////
                            $("#" + tabId + " .left_equip_mnYbdy").text(data.data[0].ybdy);
                            $("#" + tabId + " .left_equip_mnYbdl").text(data.data[0].ybdl);
                            $("#" + tabId + " .left_equip_plYbgl").text(data.data[0].ybgl);
                            $("#" + tabId + " .left_equip_plCyzs").text(data.data[0].cs);
                            $("#" + tabId + " .left_equip_mnJsdj").text(data.data[0].jsd);
                            $("#" + tabId + " .left_equip_mnZjyl").text(data.data[0].zjdy);
                            ///////////////////////////////////////////////////////
                            if (data.data[0].mnJsdj == 0) {
                                $("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnYbdy == 0) {
                                $("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnYbdl == 0) {
                                $("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            
//                            if (data.data[0].zjdy == 0) {
//                                $("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
//                            } else {
//                                $("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            }
                            
                            if (data.data[0].mnZjyl == 0) {
                                $(" .left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnByyl == 0) {
                                $("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnFgyl == 0) {
                                $("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnZgyl == 0) {
                                $("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnLcgyl == 0) {
                                $("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            /////////////////////////////////////////////////////
                            
                            if(data.data[0].dsj==0||data.data[0].abj==0){
                                if (data.data[0].proEpromA == 0) {
                                    $("#" + tabId + " .left_equip_proEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].dataEpromA == 0) {
                                    $("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].ramA == 0) {
                                    $("#" + tabId + " .left_equip_ramA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].cpuRamA == 0) {
                                    $("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].tbtxA == 0) {
                                    $("#" + tabId + " .left_equip_tbtxA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].canA == 0) {
                                    $("#" + tabId + " .left_equip_canA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].clockA == 0) {
                                    $("#" + tabId + " .left_equip_clockA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                            }
                            else{
                            	$("#" + tabId + " .left_equip_proEpromA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_ramA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_tbtxA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_canA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_clockA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	
                            }
                            
                            if(data.data[0].dsj==0||data.data[0].abj==1){
                                if (data.data[0].proEpromB == 0) {
                                    $("#" + tabId + " .left_equip_proEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].dataEpromB == 0) {
                                    $("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].ramB == 0) {
                                    $("#" + tabId + " .left_equip_ramB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].cpuRamB == 0) {
                                    $("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].tbtxB == 0) {
                                    $("#" + tabId + " .left_equip_tbtxB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].canB == 0) {
                                    $("#" + tabId + " .left_equip_canB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].clockB == 0) {
                                    $("#" + tabId + " .left_equip_clockB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $("#" + tabId + " .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                            }
                            else{
                            	$("#" + tabId + " .left_equip_proEpromB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_ramB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_tbtxB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_canB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$("#" + tabId + " .left_equip_clockB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            }
                            
                            ///////////////////////////////////////////////////////////
                            if (data.data[0].gnkzh == 0) {
                                $("#" + tabId + " .left_equip_gnkzh").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $("#" + tabId + " .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            //$("#" + tabId + " .left_equip_deviceCorpIf").text(data.data[0].deviceCorpIf);
                            //$("#" + tabId + " .left_equip_B_proVerIf").text(data.data[0].proVerIf);
                            $("#" + tabId + " .left_equip_B_lkjTime").text(data.data[0].lkjTimeIf);
                        } else {
                            if (data.data[0].hxz == 0) {
                                $(" .left_equip_hxz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $(" .left_equip_hxz").text("正常");
                            } else {
                                $(" .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $(" .left_equip_hxz").text("故障");
                            }
                            if(data.data[0].guard1setup==0){
                            	//$(".left_equip_jingti2").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	$(".left_equip_jingti1").hide();
                            }
                            else{
                            	$(".left_equip_jingti1").show();
                            	$(".left_equip_jingti1").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	//$(".left_equip_jingti2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } 
                            if(data.data[0].guard2setup==0){
                            	//$(".left_equip_jingti2").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	$(".left_equip_jingti2").hide();
                            }
                            else{
                            	$(".left_equip_jingti2").show();
                            	$(".left_equip_jingti2").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                            	//$(".left_equip_jingti2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            }                            
                            $(" .left_equip_B_tdState1").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState3").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState4").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState5").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState6").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState7").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            $(" .left_equip_B_tdState8").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            
                            if (data.data[0].monitor1 == 0) {
                                $(" .left_equip_monitor1").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].monitor2 == 0) {
                                $(" .left_equip_monitor2").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].sjbyz == 0) {
                                $(" .left_equip_sjbyz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $(" .left_equip_sjbyz").text("一致");
                            } else {
                                $(" .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $(" .left_equip_sjbyz").text("不一致");
                            }

                            if (data.data[0].jkbyz == 0) {
                                $(" .left_equip_jkbyz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $(" .left_equip_jkbyz").text("一致");
                            } else {
                                $(" .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $(" .left_equip_jkbyz").text("不一致");
                            }

                            if (data.data[0].zdgz == 0) {
                                $(" .left_equip_zdgz").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                $(" .left_equip_zdgz").text("正常");
                            } else {
                                $(" .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                $(" .left_equip_zdgz").text("不正常");
                            }

//                            $(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbAjkdate);
/*                            if(data.data[0].locoAb!="1"&&data.data[0].locoAb!="2"){
	                            $(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
	                            $(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
	                            $(" .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                            }else{
	                            $(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbB);
	                            $(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbBData);
	                            $(" .left_equip_B_monitor1").text(data.data[0].monitor2Info);
                            }*/
                            $(" .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                            $(" .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                            $(" .left_equip_B_monitor1").parent("div.row-right-div-wb")
                    		.css({"margin-left":"0px"});
                            $(" .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                            $(" .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                            $(" .left_equip_B_monitor1").parent("div.row-right-div-wb")
                    		.css({"font-weight":"bold"});
                            if(data.data[0].dsj=="0"){
                            	if(data.data[0].jkzbA!=data.data[0].jkzbB){
                            		$(" .left_equip_B_jkzbAjkdate").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		$(" .left_equip_B_jkzbAdata").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		$(" .left_equip_B_monitor1").parent("div.row-right-div-wb")
                            		.css({"margin-left":"-20px"});
                            		/*$("#" + tabId + " .left_equip_B_jkzbAjkdate")
                            		.addClass("bg-red-color-wb");
                            		$("#" + tabId + " .left_equip_B_jkzbAdata")
                            		.addClass("bg-red-color-wb");
                            		$("#" + tabId + " .left_equip_B_monitor1")
                            		.addClass("bg-red-color-wb");*/
                            		$(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA+"/"+data.data[0].jkzbB);
                                	$(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData+"/"+data.data[0].jkzbBData);
                                	$(" .left_equip_B_monitor1").text(data.data[0].monitor1Info+"/"+data.data[0].monitor2Info);
                            	}
                            	else{
                            		$(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
                                	$(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
                                	$(" .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                            	}
                            }
                            else{
                            	if(data.data[0].abj=="0"){
                                	$(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbA);
                                	$(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbAData);
                                	$(" .left_equip_B_monitor1").text(data.data[0].monitor1Info);
                                }else{
                                	$(" .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbB);
                                	$(" .left_equip_B_jkzbAdata").text(data.data[0].jkzbBData);
                                	$(" .left_equip_B_monitor1").text(data.data[0].monitor2Info);
                                }
                            }
                            ///////////////////////////////////////////////////////////////////
                            
                            $(" .left_equip_szlsrcA").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_szlsrA").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_kztxaError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_mnlsrcA").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_txaError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_claError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_jkzbaError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_jkzbbError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_clbError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_txbError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_mnlsrcB").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_kztxbError").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_szlsrB").removeClass("pic-divErrorGray-wb");

                            $(" .left_equip_szlsrcB").removeClass("pic-divErrorGray-wb");
                            if(data.data[0].dsj==0||data.data[0].abj==0){
                            	if (data.data[0].szlsrcA == 0) {
                                    $(" .left_equip_szlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(" .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrA == 0) {
                                    $(" .left_equip_szlsrA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(" .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].kztxA == 0) {
                                    $(".left_equip_kztxaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].mnlsrcA == 0) {
                                    $(".left_equip_mnlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].txbA == 0) {
                                    $(".left_equip_txaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].xxclA == 0) {
                                    $(".left_equip_claError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].clockA == 0&&data.data[0].canA==0&&data.data[0].cpuRamA==0&&data.data[0].dataEpromA==0&&data.data[0].proEpromA==0) {
                                    $(".left_equip_jkzbaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }
                            }
                            else{
                                $(" .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                            }
                            
                            if(data.data[0].dsj==0||data.data[0].abj==1){
                            	if (data.data[0].clockB == 0&&data.data[0].canB==0&&data.data[0].cpuRamB==0&&data.data[0].dataEpromB==0&&data.data[0].proEpromB==0) {
                                    $(".left_equip_jkzbbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].xxclB == 0) {
                                    $(".left_equip_clbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].txbB == 0) {
                                    $(".left_equip_txbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].mnlsrcB == 0) {
                                    $(".left_equip_mnlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].kztxB == 0) {
                                    $(".left_equip_kztxbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrB == 0) {
                                    $(".left_equip_szlsrB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }

                                if (data.data[0].szlsrcB == 0) {
                                    $(".left_equip_szlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                                } else {
                                    $(".left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                                }
                            }
                            else{
                                $(" .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                                $(" .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                            }
                            
                            
                            ///////////////////////////////////////////////////////
//                            $(" .left_equip_mnLcgyl").text(data.data[0].mnLcgyl);
                            $("#" + tabId + " .left_equip_pipestress0").text(data.data[0].pipestress0);
                            $("#" + tabId + " .left_equip_pipestress1").text(data.data[0].pipestress1);
                            $("#" + tabId + " .left_equip_pipestress2").text(data.data[0].pipestress2);
                            $("#" + tabId + " .left_equip_pipestress3").text(data.data[0].pipestress3);
                            $(" .left_equip_plSd0").text(data.data[0].speed0);
                            $(" .left_equip_plSd1").text(data.data[0].speed1);
                            $(" .left_equip_plSd2").text(data.data[0].speed2);
                            //////////////////////////////////////////////////////
                            $(" .left_equip_mnYbdy").text(data.data[0].ybdy);
                            $(" .left_equip_mnYbdl").text(data.data[0].ybdl);
                            $(" .left_equip_plYbgl").text(data.data[0].ybgl);
                            $(" .left_equip_plCyzs").text(data.data[0].cs);
                            $(" .left_equip_mnJsdj").text(data.data[0].jsd);
                            $(" .left_equip_mnZjyl").text(data.data[0].zjdy);
                            ///////////////////////////////////////////////////////
                            if (data.data[0].mnJsdj == 0) {
                                $(" .left_equip_B_mnJsdj").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnYbdy == 0) {
                                $(" .left_equip_B_mnYbdy").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnYbdl == 0) {
                                $(" .left_equip_B_mnYbdl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            
//                            if (data.data[0].zjdy == 0) {
//                            	$(" .left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
//                            } else {
//                            	$(" .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            }

                            if (data.data[0].mnZjyl == 0) {
                                $(" .left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnByyl == 0) {
                                $(" .left_equip_B_mnByyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnFgyl == 0) {
                                $(" .left_equip_B_mnFgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnZgyl == 0) {
                                $(" .left_equip_B_mnZgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }

                            if (data.data[0].mnLcgyl == 0) {
                                $(" .left_equip_B_mnLcgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            /////////////////////////////////////////////////////
                            
                            if(data.data[0].dsj==0||data.data[0].abj==0){
                                if (data.data[0].proEpromA == 0) {
                                    $(" .left_equip_proEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].dataEpromA == 0) {
                                    $(" .left_equip_dataEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].ramA == 0) {
                                    $(" .left_equip_ramA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].cpuRamA == 0) {
                                    $(" .left_equip_cpuRamA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].tbtxA == 0) {
                                    $(" .left_equip_tbtxA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].canA == 0) {
                                    $(" .left_equip_canA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].clockA == 0) {
                                    $(" .left_equip_clockA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                            }
                            else{
                            	$(" .left_equip_proEpromA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_dataEpromA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_ramA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_cpuRamA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_tbtxA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_canA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_clockA").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	
                            }
                            
                            if(data.data[0].dsj==0||data.data[0].abj==1){
                                if (data.data[0].proEpromB == 0) {
                                    $(" .left_equip_proEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].dataEpromB == 0) {
                                    $(" .left_equip_dataEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].ramB == 0) {
                                    $(" .left_equip_ramB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].cpuRamB == 0) {
                                    $(" .left_equip_cpuRamB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].tbtxB == 0) {
                                    $(" .left_equip_tbtxB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].canB == 0) {
                                    $(" .left_equip_canB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                                if (data.data[0].clockB == 0) {
                                    $(" .left_equip_clockB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                                } else {
                                    $(" .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                                }
                            }
                            else{
                            	$(" .left_equip_proEpromB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_dataEpromB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_ramB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_cpuRamB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_tbtxB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_canB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            	$(" .left_equip_clockB").removeClass("bg-red-color-wb").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                            }
                            
                            ///////////////////////////////////////////////////////////
                            if (data.data[0].gnkzh == 0) {
                                $(" .left_equip_gnkzh").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                            } else {
                                $(" .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                            }
                            //$(" .left_equip_deviceCorpIf").text(data.data[0].deviceCorpIf);
                            //$(" .left_equip_B_proVerIf").text(data.data[0].proVerIf);
                            $(".left_equip_B_lkjTime").text(data.data[0].lkjTimeIf);
                        }

                    } else {
                        if (tabId) {
                        	
                        	 $("#" + tabId + " .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_hxz").text("故障");
                             $("#" + tabId + " .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             /*if(data.data[0].guard1Setup==0){
                            	 $("#" + tabId + " .left_equip_jingti1").hide();
                             }
                             else{
                            	 $("#" + tabId + " .left_equip_jingti1").show();
                            	 $("#" + tabId + " .left_equip_jingti1").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                             	 //$("#" + tabId + " .left_equip_jingti2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                             }
                             if(data.data[0].guard2Setup==0){
                            	 $("#" + tabId + " .left_equip_jingti2").hide();
                             }
                             else{
                            	 $("#" + tabId + " .left_equip_jingti2").show();
                            	 $("#" + tabId + " .left_equip_jingti2").removeClass("bg-green-color-wb").removeClass("bg-red-color-wb").addClass("bg-gray-color-wb");
                             	 //$("#" + tabId + " .left_equip_jingti2").removeClass("bg-gray-color-wb").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                             }*/
                             $("#" + tabId + " .left_equip_jingti1").hide();
                             $("#" + tabId + " .left_equip_jingti2").hide();
                             $("#" + tabId + " .left_equip_B_tdState1").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState2").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState3").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState4").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState5").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState6").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState7").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_B_tdState8").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_sjbyz").text("不一致");

                             $("#" + tabId + " .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_jkbyz").text("不一致");

                             $("#" + tabId + " .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $("#" + tabId + " .left_equip_zdgz").text("不正常");

                             $("#" + tabId + " .left_equip_B_jkzbAjkdate").text("");
                             $("#" + tabId + " .left_equip_B_jkzbAdata").text("");
                             $("#" + tabId + " .left_equip_B_monitor1").text("");
                             ///////////////////////////////////////////////////////////////////
                             $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                             ///////////////////////////////////////////////////////
//                             $("#" + tabId + " .left_equip_mnLcgyl").text("");
                             $("#" + tabId + " .left_equip_pipestress0").text("");
                             $("#" + tabId + " .left_equip_pipestress1").text("");
                             $("#" + tabId + " .left_equip_pipestress2").text("");
                             $("#" + tabId + " .left_equip_pipestress3").text("");
                             $("#" + tabId + " .left_equip_plSd0").text("");
                             $("#" + tabId + " .left_equip_plSd1").text("");
                             $("#" + tabId + " .left_equip_plSd2").text("");
                             //////////////////////////////////////////////////////
                             $("#" + tabId + " .left_equip_mnYbdy").text("");
                             $("#" + tabId + " .left_equip_mnYbdl").text("");
                             $("#" + tabId + " .left_equip_plYbgl").text("");
                             $("#" + tabId + " .left_equip_plCyzs").text("");
                             $("#" + tabId + " .left_equip_mnJsdj").text("");
                             $("#" + tabId + " .left_equip_mnZjyl").text("");
                             ///////////////////////////////////////////////////////
                             $("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             /////////////////////////////////////////////////////
                             $("#" + tabId + " .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $("#" + tabId + " .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             ///////////////////////////////////////////////////////////
                             $("#" + tabId + " .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             //$("#" + tabId + " .left_equip_deviceCorpIf").text("");
                             //$("#" + tabId + " .left_equip_B_proVerIf").text("");
                             $("#" + tabId + " .left_equip_B_lkjTime").text("");
                         } else {
                             $(" .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_hxz").text("故障");
                             $(" .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_jingti1").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_jingti2").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_jingti1").hide();
                             $(" .left_equip_jingti2").hide();
                             $(" .left_equip_B_tdState1").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState2").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState3").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState4").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState5").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState6").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState7").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_B_tdState8").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

//                             $(".middle-left-row-right-content-div1-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                             $(".middle-left-row-right-content-div2-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");


                             $(" .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_sjbyz").text("不一致");

                             $(" .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_jkbyz").text("不一致");

                             $(" .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             $(" .left_equip_zdgz").text("不正常");

                             $(" .left_equip_B_jkzbAjkdate").text("");
                             $(" .left_equip_B_jkzbAdata").text("");
                             $(" .left_equip_B_monitor1").text("");
                             ///////////////////////////////////////////////////////////////////
                             $(" .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");

                             $(" .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divErrorGray-wb");
                             ///////////////////////////////////////////////////////
//                             $(" .left_equip_mnLcgyl").text("");
                             $(" .left_equip_pipestress0").text("");
                             $(" .left_equip_pipestress1").text("");
                             $(" .left_equip_pipestress2").text("");
                             $(" .left_equip_pipestress3").text("");
                             $(" .left_equip_plSd0").text("");
                             $(" .left_equip_plSd1").text("");
                             $(" .left_equip_plSd2").text("");
                             //////////////////////////////////////////////////////
                             $(" .left_equip_mnYbdy").text("");
                             $(" .left_equip_mnYbdl").text("");
                             $(" .left_equip_plYbgl").text("");
                             $(" .left_equip_plCyzs").text("");
                             $(" .left_equip_mnJsdj").text("");
                             $(" .left_equip_mnZjyl").text("");
                             ///////////////////////////////////////////////////////
                             $(" .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             /////////////////////////////////////////////////////
                             $(" .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");

                             $(" .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             ///////////////////////////////////////////////////////////
                             $(" .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-gray-color-wb");
                             //$(" .left_equip_deviceCorpIf").text("");
                             //$(" .left_equip_B_proVerIf").text("");
                             $(".left_equip_B_lkjTime").text("");
                             
                             
//                            $("#" + tabId + " .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $("#" + tabId + " .left_equip_hxz").text("故障");
//                            $("#" + tabId + " .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
////                            $("#" + tabId + ".middle-left-row-right-content-div1-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
////                            $("#" + tabId + ".middle-left-row-right-content-div2-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $("#" + tabId + " .left_equip_sjbyz").text("不一致");
//
//                            $("#" + tabId + " .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $("#" + tabId + " .left_equip_jkbyz").text("不一致");
//
//                            $("#" + tabId + " .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $("#" + tabId + " .left_equip_zdgz").text("不正常");
//
//                            $("#" + tabId + " .left_equip_B_jkzbAjkdate").text("");
//                            $("#" + tabId + " .left_equip_B_jkzbAdata").text("");
//                            $("#" + tabId + " .left_equip_B_monitor1").text("");
//                            ///////////////////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//                            ///////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_mnLcgyl").text("");
//                            $("#" + tabId + " .left_equip_plSd0").text("");
//                            $("#" + tabId + " .left_equip_plSd1").text("");
//                            $("#" + tabId + " .left_equip_plSd2").text("");
//                            //////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_mnYbdy").text("");
//                            $("#" + tabId + " .left_equip_mnYbdl").text("");
//                            $("#" + tabId + " .left_equip_plYbgl").text("");
//                            $("#" + tabId + " .left_equip_plCyzs").text("");
//                            $("#" + tabId + " .left_equip_mnJsdj").text("");
//                            $("#" + tabId + " .left_equip_mnZjyl").text("");
//                            ///////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            /////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $("#" + tabId + " .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            ///////////////////////////////////////////////////////////
//                            $("#" + tabId + " .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            //$("#" + tabId + " .left_equip_deviceCorpIf").text("");
//                            //$("#" + tabId + " .left_equip_B_proVerIf").text("");
//                        } else {
//                            $(" .left_equip_hxz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $(" .left_equip_hxz").text("故障");
//                            $(" .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
////                            $(".middle-left-row-right-content-div1-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
////                            $(".middle-left-row-right-content-div2-wb").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//
//                            $(" .left_equip_sjbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $(" .left_equip_sjbyz").text("不一致");
//
//                            $(" .left_equip_jkbyz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $(" .left_equip_jkbyz").text("不一致");
//
//                            $(" .left_equip_zdgz").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            $(" .left_equip_zdgz").text("不正常");
//
//                            $(" .left_equip_B_jkzbAjkdate").text("");
//                            $(" .left_equip_B_jkzbAdata").text("");
//                            $(" .left_equip_B_monitor1").text("");
//                            ///////////////////////////////////////////////////////////////////
//                            $(" .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//
//                            $(" .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
//                            ///////////////////////////////////////////////////////
//                            $(" .left_equip_mnLcgyl").text("");
//                            $(" .left_equip_plSd0").text("");
//                            $(" .left_equip_plSd1").text("");
//                            $(" .left_equip_plSd2").text("");
//                            //////////////////////////////////////////////////////
//                            $(" .left_equip_mnYbdy").text("");
//                            $(" .left_equip_mnYbdl").text("");
//                            $(" .left_equip_plYbgl").text("");
//                            $(" .left_equip_plCyzs").text("");
//                            $(" .left_equip_mnJsdj").text("");
//                            $(" .left_equip_mnZjyl").text("");
//                            ///////////////////////////////////////////////////////
//                            $(" .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            /////////////////////////////////////////////////////
//                            $(" .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//
//                            $(" .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            ///////////////////////////////////////////////////////////
//                            $(" .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
//                            //$(" .left_equip_deviceCorpIf").text("");
//                            //$(" .left_equip_B_proVerIf").text("");
                        }
                    }
                }
            });
            var url = "../tSCStatus/findTSCInfo?locoTypeid="+obj.itemData.locoTypeid+"&locoNo="+obj.itemData.locoNO+"&locoAb="+obj.itemData.locoAb;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                	var tabId = obj.tabId;
                	data = data.data;
                	if(data != null){
            
                		if (tabId) {
	                		$("#" + tabId + " .left_equip_deviceCorpIf").text(data.deviceCorp);
	                		$("#" + tabId + " .left_equip_softver").text(data.tscType);
	                		if(data.softver.indexOf("(")!=-1){
	                			$("#" + tabId + " .left_equip_B_proVerIf").text("");
	                			$("#" + tabId + " .left_equip_B_proVerIf_sw").text(data.softver).parent("div").show();
	                		}
	                		else{
	                			$("#" + tabId + " .left_equip_B_proVerIf").text(data.softver);
	                			$("#" + tabId + " .left_equip_B_proVerIf_sw").parent("div").hide();
	                		}
	                			
	                       
                		}else{
                			$(".left_equip_deviceCorpIf").text(data.deviceCorp);
                    		$(".left_equip_softver").text(data.tscType);
                    		if(data.softver.indexOf("(")!=-1){
                    			$(".left_equip_B_proVerIf_sw").text(data.softver).parent("div").show();
                    			$(".left_equip_B_proVerIf").text("");
	                		}
	                		else{
	                			$(".left_equip_B_proVerIf").text(data.softver);
	                			$(".left_equip_B_proVerIf_sw").parent("div").hide();
	                		}
                		}
                	}
//                	
                }
            });
        }
    })

    RTU.register("app.realtimelocomotivequery.trainalarm.setEquipDetailData", function () {
        return function (data) {

        }
    });


    RTU.register("app.realtimelocomotivequery.trainalarm.activate", function () {

        return function (obj) {
        	
           // if(RTU.data.user.roleName.indexOf("机务")!=-1){
           // 	$(".qualityAlarm-tab-div,.equipmentStatus-tab-div,.tscExperience-tab-div").hide();
          //  }
          //  else $(".qualityAlarm-tab-div,.equipmentStatus-tab-div,.tscExperience-tab-div").show();
            //更新数据
        	if(window.locoInfoInterval){
            	clearInterval(window.locoInfoInterval);
            	window.locoInfoInterval=null;
            }
        	initData=null;
        	
//        	if(!window.locoInfoInterval){
        		RTU.invoke("app.realtimelocomotivequery.trainalarm.initData_Test", obj);
                RTU.invoke("app.realtimelocomotivequery.trainalarm.searchEquip", obj);
                RTU.invoke("app.realtimelocomotivequery.trainalarm.tscExperienceInitData", obj);
//                if(obj.isInterval){
//                	
//                }else{
                	window.locoInfoInterval = setInterval(function () {
                		RTU.invoke("app.realtimelocomotivequery.trainalarm.initData_Test", obj);
                		RTU.invoke("app.realtimelocomotivequery.trainalarm.searchEquip", obj);
                		RTU.invoke("app.realtimelocomotivequery.trainalarm.tscExperienceInitData", obj);
                	},5000);
//                }
                RTU.invoke("app.realtimelocomotivequery.trainalarm.initclick", obj);
//      	  	}
        	  
        	  
           
        };
    });

    RTU.register("app.realtimelocomotivequery.trainalarm.initclick", function () {
        return function (obj) {
            //初始化界面事件
            if (obj.tabId) {
                $("#" + obj.tabId + " .basic-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-basic-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-tscExperience-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 420 });
                });
                $("#" + obj.tabId + " .version-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-version-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-tscExperience-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 420 });
                });
                $("#" + obj.tabId + " .qualityAlarm-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-tscExperience-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 420 });
                });
                $("#" + obj.tabId + " .equipmentStatus-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-right");
                	/*$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");*/
                	$("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-tscExperience-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 670, height: 506 });
                   /* RTU.invoke("app.realtimelocomotivequery.trainalarm.equipmentStatusInitData", obj);*/
                });

                $("#" + obj.tabId + " .tscExperience-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-tscExperience-div").removeClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 420 });
                    
                });
                $("#" + obj.tabId + " .basic-tab-div").click();
            } else {
                $(" .basic-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                    $(" .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .content-basic-div").removeClass("hidden");
                    $(" .content-version-div").addClass("hidden");
                    $(" .content-qualityAlarm-div").addClass("hidden");
                    $(" .content-equipmentStatus-div").addClass("hidden");
                    $(" .content-tscExperience-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(380, 405);
                });
                $(" .version-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $(" .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .content-version-div").removeClass("hidden");
                    $(" .content-basic-div").addClass("hidden");
                    $(" .content-qualityAlarm-div").addClass("hidden");
                    $(" .content-equipmentStatus-div").addClass("hidden");
                    $(" .content-tscExperience-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(380, 405);
                });
                $(" .qualityAlarm-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $(" .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .content-qualityAlarm-div").removeClass("hidden");
                    $(" .content-basic-div").addClass("hidden");
                    $(" .content-version-div").addClass("hidden");
                    $(" .content-equipmentStatus-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(380, 405);
                    $(" .content-tscExperience-div").addClass("hidden");
                });
                $(" .equipmentStatus-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-right");
                	/*$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");*/
                	$(" .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".tscExperience-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .content-equipmentStatus-div").removeClass("hidden");
                    $(" .content-basic-div").addClass("hidden");
                    $(" .content-version-div").addClass("hidden");
                    $(" .content-qualityAlarm-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(670, 503);
                    $(" .content-tscExperience-div").addClass("hidden");
                    /*RTU.invoke("app.realtimelocomotivequery.trainalarm.equipmentStatusInitData", obj);*/
                });
                $(" .tscExperience-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $(".basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(" .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".content-equipmentStatus-div").addClass("hidden");
                    $(".content-basic-div").addClass("hidden");
                    $(".content-version-div").addClass("hidden");
                    $(".content-qualityAlarm-div").addClass("hidden");
                    $(".content-tscExperience-div").removeClass("hidden");
                    obj.popuwndLocoInfo.setSize(380, 420);
                    /*RTU.invoke("app.realtimelocomotivequery.trainalarm.tscExperienceInitData", obj);*/
                });
                
                $(" .basic-tab-div").click();
                
//                $(" .bundefined").unbind("click").click(function () {
//                    RTU.invoke("app.realtimelocomotivequery.query.initInfoWnd", obj);
//                });
            };

        };
    });

/*    RTU.register("app.realtimelocomotivequery.trainalarm.equipmentStatusInitData", function () {
        return function (data) {
            $.ajax({
                url: "../lkjStatusHis/searchHisInfoByProperty?page=1&pageSize=10&locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO + "&locoAb=" + data.itemData.locoAb+"&beginTime=&endTime=",
                dataType: "jsonp",
                type: "GET",
                success: function (r) {
                	
                }
            });

        }
    });*/

    RTU.register("app.realtimelocomotivequery.trainalarm.deactivate", function () {

        return function () {

        };
    });
    
    RTU.register("app.realtimelocomotivequery.trainalarm.tscExperienceInitData",function(){
    	return function(data){
    		 $.ajax({
                 url: "../onlineloco/searchTscInfoByProperty?locoTypeName="+data.itemData.locoTypeName+"-"+
                 (data.itemData.locoNo?data.itemData.locoNo:data.itemData.locoNO)+(data.itemData.locoAb=="1"?"A":(data.itemData.locoAb=="2"?"B":"")),
                 dataType: "jsonp",
                 type: "GET",
                 success: function (r) {
                	 if(r.data&&r.data.length>0){
                		 var objData=r.data;
                		 $("#componentId").text(objData[0]);
              			$("#productName").text(objData[1]);
              			$("#componentName").text(objData[2]);
              			$("#factoryId").text(objData[3]);
              			$("#factoryName").text(objData[4]);
              			$("#componentStatus").text(objData[5]);
              			$("#produceDate").text(objData[6]);
              			$("#useDate").text(objData[7]==null?"":objData[7]);
              			$("#bigRepairDate").text(objData[8]==null?"":objData[8]);
              			$("#middleRepairDate").text(objData[9]==null?"":objData[9]);
              			$("#belongDepot").text(objData[10]);
              			$("#workShop").text(objData[11]);
              			$("#tscRemark").text(objData[12]==null?"":objData[12]);
                 	}
                 }
             });
    	};
    });
});
