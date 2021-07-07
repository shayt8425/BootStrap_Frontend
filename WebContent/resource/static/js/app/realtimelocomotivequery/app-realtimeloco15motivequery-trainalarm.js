RTU.DEFINE(function (require, exports) {

    require("jquery/jquery-1.7.2.min.js");
    require("../../../css/app/app-realtimeloco15motive-details.css");

    RTU.register("app.realtimeloco15motivequery.trainalarm.init", function () {
        //        return function () {
        //            $(".app_realtime_train_div").append("+ 初始化后数据");
        //            return true;
        //        };
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
            $("#zhidong").text(detailsData.zhidong);
            $("#RAlarmLevel").text(detailsData.RAlarmLevel);
            $("#alarmName").text(detailsData.alarmName);
        };
    });

    var tempImgObj = { "1": "L3.png", "2": "L2.png", 
    		"3": "L.png","4": "LU.png","5": "LU2.png","6": "U.png",
    		"7": "U2S.gif","8": "U2.png","9":"L6.png","10": "UUS.gif", "11": "UU.png", 
    		"12": "HUS.gif","13": "HU.png","14": "H.png","15": "L4.png",
    		"16": "L5.png","17":"B.png","18":"B.png","19": "NO.png","20": "B.png","21":"U3.png","32": "Blue.png" };
    function getImgUrl(id) {
    	if(tempImgObj[id.toString()])
        return "../static/img/app/moveCurve/" + tempImgObj[id.toString()];
    	else{
    		  return "../static/img/app/moveCurve/WU.png";
    	}
    };
    
    var jkstateObj={
    		1:"待机",
    		2:"出入段",
    		3:"调车",
    		4:"降级",
    		5:"通常",
    		6:"目视",
    		7:"非本务",
    		8:"无防冒",
    		9:"与其它ATP结合"
    };
    
   
    
    RTU.register("app.realtimeloco15motivequery.trainalarm.initData", function () {
        function getCheciType(trainType,kehuo){
        	if(kehuo!=0){
        		switch (trainType) {
					case "1":
						return "动车组";
					case "2":
						return "旅客列车";
					case "3":
					case "4":
						return "行邮列车";
					case "5":
						return "行包列车";
					case "6":
						return "直达货物列车";
					case "7":
						return "货物列车";
					case "8":
						return "军用列车";
					case "9":
						return "单机";
					case "10":
						return "路用列车";
					default:
						return "其它";
        		}
        	}
        	else return "货车";
        };
        
        function getZhidongType(zhidong){
        	switch (zhidong) {
				case 0:
					return "货车闸瓦";
				case 1:
					return "客车闸瓦";
				case 2:
					return "盘形";
				case 3:
					return "动车组";
					default:break;
			}
        };
        
        function getLineFlag(lineFlag){
        	switch (lineFlag) {
				case 1:
					return "上行";
				case 2:
					return "下行";
					default:return "上行";
			}
        };
        function getWorkStatus(workstatus){
        	var res="";
        	if((workstatus&1)!=0){
        		res = "零位";
        	}
        	else{
        		res = "非零";
        	}
        	if((workstatus&2)!=0){
        		if(res=="")
        			res = "向后";
        		else res+="、向后";
        	}
           if((workstatus&4)!=0){
        	   if(res=="")
       			res = "向前";
       		   else res+="、向前";
        	}
           if((workstatus&8)!=0){
        	   if(res=="")
          			res = "制动";
          		   else res+="、制动";
	       	}
	           if((workstatus&16)!=0){
	        	   if(res=="")
	          			res = "牵引";
	          		   else res+="、牵引";
	       	}
	          
        	return res;
        };
        
        return function (data) {
            //前三个
        	//alert("../onlineloco15/searchLoco15InfoByProperty?locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO+"&locoAB="+data.itemData.locoAB);
            $.ajax({
                url: "../onlineloco15/searchLoco15InfoByProperty?locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO+"&locoAb="+data.itemData.locoAb,
                dataType: "jsonp",
                type: "GET",
                success: function (r) {
                    var tabId = data.tabId;
                    var itemData = r.data;
                    try{
                 	   if(tabId){
                    	   $("#" + tabId + " .speed").text(itemData.speed); //实速度
                           $("#" + tabId + " .limitedSpeed").text(itemData.limitedSpeed); //限速
                           $("#" + tabId + " .frontDistance").text(itemData.frontDistance); //距离
                           $("#"+tabId+" .checiType").text(getCheciType(itemData.traintype,itemData.kehuo));
                           $("#" + tabId + " .checiName").text(itemData.checiName); //车次
                           $("#" + tabId + " .drDriverName").text(itemData.drDriverName==null||itemData.drDriverName==""?itemData.driverId:itemData.drDriverName); //司机名称
                           $("#" + tabId + " .viceDriverName").text(itemData.drVicedriverName==null||itemData.drVicedriverName==""?itemData.vicedriverId:itemData.drVicedriverName); //司机名称
                           
                           $("#" + tabId + " .locoNo").text(itemData.ttypeShortname+"-"+itemData.locoNo+(itemData.locoAb==1?"A":(itemData.locoAb==2?"B":""))); //机车
                           $("#" + tabId + " .dname").text(itemData.dname?itemData.dname:itemData.deptId); //所属段
                           $("#" + tabId + " .distanceText").text(itemData.frontDistance); //下一个信号机距离 
                           $("#" + tabId + " .place").text(itemData.sname+"-"+itemData.lname+  "(" + getLineFlag(itemData.lineFlag)+")");//位置
                           $("#" + tabId + " .signalNo").text(itemData.signalHeader+(itemData.signalNo=="0"?"":itemData.signalNo)); //信号机
                           $("#" + tabId + " .signalType").text(itemData.signalName); //信号机类型
                           $("#" + tabId + " .jkState").text(jkstateObj[itemData.jkstate]); //工作模式
                           $("#" + tabId + " .kiloSign").text(itemData.kiloSign/1000); //公里标
                           $("#" + tabId + " .weight").text(itemData.weight); //总重量
                           $("#" + tabId + " .totalWeight").text(itemData.totalWeight); //总重量
                           if(itemData.length!=null&&itemData.length.toString().trim()!=""){
                        	   itemData.length=itemData.length.toString();
                        	   switch(itemData.length.length){
                               case 1:
                            	   $("#" + tabId + " .totalDistance").text(0+"."+itemData.length); //计长
                               default:
                            	   $("#" + tabId + " .totalDistance").text(itemData.length.substr(0,itemData.length.length-1)+"."+
                            			   itemData.length.substr(itemData.length.length-1,1)); //计长
                            	   
                               }
                           }
                           else $("#" + tabId + " .totalDistance").text("");
                           //$(".totalDistance").text(itemData.length); //计长
                           $("#" + tabId + " .vehicleCount").text(itemData.vehicleCount); //辆数
                           $("#" + tabId + " .engineSpeed").text(itemData.engineSpeed); //柴速 
                           $("#" + tabId + " .guangya").text(itemData.guanya); //管压 
                           $("#" + tabId + " .junhengfenggangya").text(itemData.junfenggangya); //均衡风缸压
                           $("#" + tabId + " .zhidonggangya").text(itemData.zhidonggangya); //制动缸压
                           $("#" + tabId + " .zongfenggangya").text(itemData.zongfenggangya); //总风缸压
                           $("#" + tabId + " .junfenggangya1").text(itemData.junfenggangya_1); //缸压 
                           $("#" + tabId + " .junfenggangya2").text(itemData.junfenggangya_2); //缸压 
                           $("#" + tabId + " .zhidonggangya1").text(itemData.zhidonggangya_1); //缸压 
                           $("#" + tabId + " .zhidonggangya2").text(itemData.zhidonggangya_2); //缸压 
                           $("#" + tabId + " .workStatus").text(getWorkStatus(itemData.workStatus)); //工况 
/*                           $(".jkstate").text(itemData.jkstateName); //监控状态 
*/                           $("#" + tabId + " .zhidongshuchu").text(getZhidongType(itemData.zhidong)); //制动输出 
                           $("#" + tabId + " .chaijimaichong").text(itemData.chaiyoujimaichong); //管压 
                           $("#" + tabId + " .szbliangcheng")
                           .text(itemData.shuangzbliangchen); //管压 
                           if(itemData.wd_i!=null&&itemData.wd_i.toString().trim()!=""){
                        	   itemData.wd_i=itemData.wd_i.toString();
                        	   switch(itemData.wd_i.length){
                               case 1:
                            	   $("#" + tabId + " .wd1").text(0+"."+itemData.wd_i); //计长
                               default:
                            	   $("#" + tabId + " .wd1").text(itemData.wd_i.substr(0,itemData.wd_i.length-1)+"."+
                            			   itemData.wd_i.substr(itemData.wd_i.length-1,1)); //计长
                            	   
                               }
                           }
                           else 
                        	   $("#" + tabId + " .wd1").text("");
                           if(itemData.wd_ii!=null&&itemData.wd_ii.toString().trim()!=""){
                        	   itemData.wd_ii=itemData.wd_ii.toString();
                        	   switch(itemData.wd_ii.length){
                               case 1:
                            	   $("#" + tabId + " .wd2").text(0+"."+itemData.wd_ii); //计长
                               default:
                            	   $("#" + tabId + " .wd2").text(itemData.wd_ii.substr(0,itemData.wd_ii.length-1)+"."+
                            			   itemData.wd_ii.substr(itemData.wd_ii.length-1,1)); //计长
                            	   
                               }
                           }
                           else 
                        	   $("#" + tabId + " .wd2").text("");

                           $("#" + tabId + " .lkjno").text(itemData.lkjno); //管压 
                           if (itemData.lkjTimeStr){
                        	   $("#" + tabId + " .receiveTime").text(itemData.lkjTimeStr); //时间 
                           }else{
                        	   var d = new Date();
                        	   var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                        	   $("#" + tabId + " .receiveTime").text(timeText);
                        	   /*$(".receiveTime").text(itemData.receiveTimeStr);*/
                           }
                           
                           //版本信息
                           $("#" + tabId + " .apphostpluginver1").text(itemData.apphostpluginver_i); 
                           $("#" + tabId + " .apphostpluginver2").text(itemData.apphostpluginver_ii); 
                           $("#" + tabId + " .hostplugindataver1").text(itemData.hostplugindataver_i); 
                           $("#" + tabId + " .hostplugindataver2").text(itemData.hostplugindataver_ii); 
                           /*$("#" + tabId + " .hostpluginsoftwarever1").text(itemData.hostpluginsoftwarever_i); 
                           $("#" + tabId + " .hostpluginsoftwarever2").text(itemData.hostpluginsoftwarever_ii); */
                           $("#" + tabId + " .hostpluginsoftwarever1").text(itemData.dataverJlxx_i); 
                           $("#" + tabId + " .hostpluginsoftwarever2").text(itemData.dataverJlxx_ii); 
                           $("#" + tabId + " .hostplugincontroldataparam1").text(itemData.hostplugincontroldataparam_i); 
                           $("#" + tabId + " .hostplugincontroldataparam2").text(itemData.hostplugincontroldataparam_ii); 
                           /*$("#" + tabId + " .hostplugincontrolsoftparam1").text(itemData.hostplugincontrolsoftparam_i); 
                           $("#" + tabId + " .hostplugincontrolsoftparam2").text(itemData.hostplugincontrolsoftparam_ii); */
                           $("#" + tabId + " .hostplugincontrolsoftparam1").text(itemData.dataverCheci_i); 
                           $("#" + tabId + " .hostplugincontrolsoftparam2").text(itemData.dataverCheci_ii); 
                           $("#" + tabId + " .dmisoftwarever1").text(itemData.dmisoftwarever_i); 
                           $("#" + tabId + " .dmisoftwarever2").text(itemData.dmisoftwarever_ii); 
                          
                           $("#" + tabId + " .safenumoutputpluginver1").text(itemData.safenumoutputpluginver_i); 
                           $("#" + tabId + " .safenumoutputpluginver2").text(itemData.safenumoutputpluginver_ii); 
                           
                           $("#" + tabId + " .platformhostpluginver1").text(itemData.platformhostpluginver_i); 
                           $("#" + tabId + " .platformhostpluginver2").text(itemData.platformhostpluginver_ii); 
                           $("#" + tabId + " .communicaterecordver1").text(itemData.communicaterecordver_i); 
                           $("#" + tabId + " .communicaterecordver2").text(itemData.communicaterecordver_ii); 
                           $("#" + tabId + " .freqinputpluginver1").text(itemData.freqinputpluginver_i); 
                           $("#" + tabId + " .freqinputpluginver2").text(itemData.freqinputpluginver_ii); 
                           $("#" + tabId + " .normimitateinputpluginver1").text(itemData.normimitateinputpluginver_i); 
                           $("#" + tabId + " .normimitateinputpluginver2").text(itemData.normimitateinputpluginver_ii); 
                           $("#" + tabId + " .safeinputpluginver1").text(itemData.safeinputpluginver_i); 
                           $("#" + tabId + " .safeinputpluginver2").text(itemData.safeinputpluginver_ii); 
                           
                           //质量警报
                           $("#" + tabId + " .alarmLevel").text(itemData.alarmLevel);
                           $("#" + tabId + " .tscAlarmName").text(itemData.tscAlarmName);
                           //状态图标
                           $("#" + tabId + " .distance_ico").attr("src", getImgUrl(itemData.locoSignal));
                	   }
                	   else{
                    	   $(".speed").text(itemData.speed); //实速度
                           $(".limitedSpeed").text(itemData.limitedSpeed); //限速
                           $(".frontDistance").text(itemData.frontDistance); //距离
                           $(".checiType").text(getCheciType(itemData.traintype,itemData.kehuo));
                           $(".checiName").text(itemData.checiName); //车次
                           $(".drDriverName").text(itemData.drDriverName==null||itemData.drDriverName==""?itemData.driverId:itemData.drDriverName); //司机名称
                           $(".viceDriverName").text(itemData.drVicedriverName==null||itemData.drVicedriverName==""?itemData.vicedriverId:itemData.drVicedriverName); //司机名称
                           
                           $(".locoNo").text(itemData.ttypeShortname+"-"+itemData.locoNo+(itemData.locoAb==1?"A":(itemData.locoAb==2?"B":""))); //机车
                           $(".dname").text(itemData.dname?itemData.dname:itemData.deptId); //所属段
                           $(".distanceText").text(itemData.frontDistance); //下一个信号机距离 
                           $(".place").text(itemData.sname+"-"+itemData.lname+  "(" + getLineFlag(itemData.lineFlag)+")");//位置
                           $(".signalNo").text(itemData.signalHeader+(itemData.signalNo=="0"?"":itemData.signalNo)); //信号机
                           $(".signalType").text(itemData.signalName); //信号机类型
                           $(".jkState").text(jkstateObj[itemData.jkstate]); //工作模式
                           $(".kiloSign").text(itemData.kiloSign/1000); //公里标
                           $(".weight").text(itemData.weight); //总重量
                           $(".totalWeight").text(itemData.totalWeight); //总重量
                           if(itemData.length!=null&&itemData.length.toString().trim()!=""){
                        	   itemData.length=itemData.length.toString();
                        	   switch(itemData.length.length){
                               case 1:
                            	   $(".totalDistance").text(0+"."+itemData.length); //计长
                               default:
                            	   $(".totalDistance").text(itemData.length.substr(0,itemData.length.length-1)+"."+
                            			   itemData.length.substr(itemData.length.length-1,1)); //计长
                            	   
                               }
                           }
                           else $(".totalDistance").text("");
                           $(".vehicleCount").text(itemData.vehicleCount); //辆数
                           $(".engineSpeed").text(itemData.engineSpeed); //柴速 
                           $(".guangya").text(itemData.guanya); //管压 
                           $(".junhengfenggangya").text(itemData.junfenggangya); //均衡风缸压
                           $(".zhidonggangya").text(itemData.zhidonggangya); //制动缸压
                           $(".zongfenggangya").text(itemData.zongfenggangya); //总风缸压
                           $(".junfenggangya1").text(itemData.junfenggangya_1); //缸压 
                           $(".junfenggangya2").text(itemData.junfenggangya_2); //缸压 
                           $(".zhidonggangya1").text(itemData.zhidonggangya_1); //缸压 
                           $(".zhidonggangya2").text(itemData.zhidonggangya_2); //缸压 
                           $(".workStatus").text(getWorkStatus(itemData.workStatus)); //工况 
/*                           $(".jkstate").text(itemData.jkstateName); //监控状态 
*/                           $(".zhidongshuchu").text(getZhidongType(itemData.zhidong)); //制动输出 
                           $(".chaijimaichong").text(itemData.chaiyoujimaichong); //管压 
                           $(".szbliangcheng")
                           .text(itemData.shuangzbliangchen); //管压 
                           if(itemData.wd_i!=null&&itemData.wd_i.toString().trim()!=""){
                        	   itemData.wd_i=itemData.wd_i.toString();
                        	   switch(itemData.wd_i.length){
                               case 1:
                            	   $(" .wd1").text(0+"."+itemData.wd_i); //计长
                               default:
                            	   $(" .wd1").text(itemData.wd_i.substr(0,itemData.wd_i.length-1)+"."+
                            			   itemData.wd_i.substr(itemData.wd_i.length-1,1)); //计长
                            	   
                               }
                           }
                           else 
                        	   $(" .wd1").text("");
                           if(itemData.wd_ii!=null&&itemData.wd_ii.toString().trim()!=""){
                        	   itemData.wd_ii=itemData.wd_ii.toString();
                        	   switch(itemData.wd_ii.length){
                               case 1:
                            	   $(" .wd2").text(0+"."+itemData.wd_ii); //计长
                               default:
                            	   $(" .wd2").text(itemData.wd_ii.substr(0,itemData.wd_ii.length-1)+"."+
                            			   itemData.wd_ii.substr(itemData.wd_ii.length-1,1)); //计长
                            	   
                               }
                           }
                           else 
                        	   $(" .wd2").text("");
                           $(".lkjno").text(itemData.lkjno); //管压 
                           if (itemData.lkjTimeStr){
                        	   $(".receiveTime").text(itemData.lkjTimeStr); //时间 
                           }else{
                        	   var d = new Date();
                        	   var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                        	   $(".receiveTime").text(timeText);
                        	   /*$(".receiveTime").text(itemData.receiveTimeStr);*/
                           }
                           
                           //版本信息
                           $(".apphostpluginver1").text(itemData.apphostpluginver_i); 
                           $(".apphostpluginver2").text(itemData.apphostpluginver_ii); 
                           $(".hostplugindataver1").text(itemData.hostplugindataver_i); 
                           $(".hostplugindataver2").text(itemData.hostplugindataver_ii); 
                           /*$(".hostpluginsoftwarever1").text(itemData.hostpluginsoftwarever_i); 
                           $(".hostpluginsoftwarever2").text(itemData.hostpluginsoftwarever_ii);*/ 
                           $(".hostpluginsoftwarever1").text(itemData.dataverJlxx_i); 
                           $(".hostpluginsoftwarever2").text(itemData.dataverJlxx_ii);
                           $(".hostplugincontroldataparam1").text(itemData.hostplugincontroldataparam_i); 
                           $(".hostplugincontroldataparam2").text(itemData.hostplugincontroldataparam_ii); 
                           /*$(".hostplugincontrolsoftparam1").text(itemData.hostplugincontrolsoftparam_i);  
                           $(".hostplugincontrolsoftparam2").text(itemData.hostplugincontrolsoftparam_ii);*/
                           
                           $(".hostplugincontrolsoftparam1").text(itemData.dataverCheci_i); 
                           $(".hostplugincontrolsoftparam2").text(itemData.dataverCheci_ii); 
                           $(".dmisoftwarever1").text(itemData.dmisoftwarever_i); 
                           $(".dmisoftwarever2").text(itemData.dmisoftwarever_ii); 
                          
                           $(".safenumoutputpluginver1").text(itemData.safenumoutputpluginver_i); 
                           $(".safenumoutputpluginver2").text(itemData.safenumoutputpluginver_ii); 
                           
                           $(".platformhostpluginver1").text(itemData.platformhostpluginver_i); 
                           $(".platformhostpluginver2").text(itemData.platformhostpluginver_ii); 
                           $(".communicaterecordver1").text(itemData.communicaterecordver_i); 
                           $(".communicaterecordver2").text(itemData.communicaterecordver_ii); 
                           $(".freqinputpluginver1").text(itemData.freqinputpluginver_i); 
                           $(".freqinputpluginver2").text(itemData.freqinputpluginver_ii); 
                           $(".normimitateinputpluginver1").text(itemData.normimitateinputpluginver_i); 
                           $(".normimitateinputpluginver2").text(itemData.normimitateinputpluginver_ii); 
                           $(".safeinputpluginver1").text(itemData.safeinputpluginver_i); 
                           $(".safeinputpluginver2").text(itemData.safeinputpluginver_ii); 
                           
                           //质量警报
                           $(".alarmLevel").text(itemData.alarmLevel);
                           $(".tscAlarmName").text(itemData.tscAlarmName);
                           //状态图标
                           $(".distance_ico").attr("src", getImgUrl(itemData.locoSignal));
                	   }
                    }
                    catch(e){
                    	
                     throw new Error("没有返回数据或者数据格式不正确！");
                    }
                 

                }
            });
        };
    });
    RTU.register("app.realtimeloco15motivequery.trainalarm.searchEquip", function () {
        return function (obj) {

            var url = "../jk15Equip/searchLoco15ByEquip?locoTypeid="+obj.itemData.locoTypeid+"&locoNo="+obj.itemData.locoNO
            +"&locoAb="+obj.itemData.locoAb;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                	 var tabId = obj.tabId;
                	 if (data.data.length > 0) {
                		 if(tabId){

                         	/*$("#" + tabId + " .left_equip_btm").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_btm").text("正常");*/
                         	if(data.data[0].btm==1){
                     			$("#" + tabId + " .left_equip_btm").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_btm").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_btm").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_btm").text("故障");
                     		}
                         	
                         	/*
                         	 * 新一代lkj状态处理 
                         	 */      
                         	
                         	$("#" + tabId + " .left_equip_monitor2").show();
                         	$("#" + tabId + " .left_equip_monitor1").show();
                     		if(data.data[0].dmi_i==1){
                     			$("#" + tabId + " .left_equip_monitor1").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     		}else{
                     			$("#" + tabId + " .left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     		}
                     		
                     		if(data.data[0].dmi_ii==1){
                     			$("#" + tabId + " .left_equip_monitor2").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     		}else{
                     			$("#" + tabId + " .left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     		}
                     		/*if(data.data[0].dmi_iorii==0){
                     			$("#" + tabId + " .left_equip_monitor2").hide();
                     		}
                     		else $("#" + tabId + " .left_equip_monitor1").hide();*/
                     		
                     		/*$("#" + tabId + " .left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_signal").text("正常");*/
                     		if(data.data[0].locosignal==1){
                     			$("#" + tabId + " .left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_signal").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_signal").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_signal").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_power").text("正常");*/
                     		if(data.data[0].displaypowermodule==1){
                     			$("#" + tabId + " .left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_power").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_power").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_power").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_font").text("正常");*/
                     		if(data.data[0].fontfile==1){
                     			$("#" + tabId + " .left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_font").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_font").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_font").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_signalpic").text("正常");*/
                     		if(data.data[0].locosignalpicture==1){
                     			$("#" + tabId + " .left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_signalpic").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_signalpic").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_signalpic").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_disstorage").text("正常");*/
                     		if(data.data[0].displayramcheck==1){
                     			$("#" + tabId + " .left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_disstorage").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_disstorage").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_disstorage").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_pixel").text("正常");*/
                     		if(data.data[0].dynamicpixelcheck==1){
                     			$("#" + tabId + " .left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_pixel").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_pixel").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_pixel").text("失败");
                     		}
                 			/*$("#" + tabId + " .left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_key").text("正常");*/
                     		if(data.data[0].keybord==1){
                     			$("#" + tabId + " .left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_key").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_key").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_key").text("故障");
                     		}
                 			/*$("#" + tabId + " .left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_cardreader").text("正常");*/
                     		if(data.data[0].cardreader_ic==1){
                     			$("#" + tabId + " .left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$("#" + tabId + " .left_equip_cardreader").text("正常");
                     		}else{
                     			$("#" + tabId + " .left_equip_cardreader").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$("#" + tabId + " .left_equip_cardreader").text("故障");
                     		}
                     		
                     		/*$("#"+tabId+" .left_equip_dmitemp").text(data.data[0].temperature_dmi);*/
                     		
                     		//温度判断有待商榷
                     		if(data.data[0].temperature_dmi<50){
                     			$("#" + tabId + " .left_equip_dmitemp").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			
                     		}else{
                     			$("#" + tabId + " .left_equip_dmitemp").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			
                     		}
                     		/*$("#" + tabId + " .left_equip_B_jkzbAjkdate").text(data.data[0].jkzbAjkdate);
                     		$("#" + tabId + " .left_equip_B_jkzbAdata").text(data.data[0].jkzbAdata);
                     		$("#" + tabId + " .left_equip_B_monitor1").text(data.data[0].monitor1Info);*/
                     		///////////////////////////////////////////////////////////////////
                     		
                     		if(data.data[0].hostmodule_i==2){
                     			$("#" + tabId + " .left_equip_hostmodule_i").show();
                     			$("#" + tabId + " .left_equip_hostmodule_i").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].hostmodule_i==1){
                     			$("#" + tabId + " .left_equip_hostmodule_i").show();
                     			$("#" + tabId + " .left_equip_hostmodule_i").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$("#" + tabId + " .left_equip_hostmodule_i").hide();
                     		
                     		
                     		if(data.data[0].hostmodule_ii==2){
                     			$("#" + tabId + " .left_equip_hostmodule_ii").show();
                     			$("#" + tabId + " .left_equip_hostmodule_ii").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].hostmodule_ii==1){
                     			$("#" + tabId + " .left_equip_hostmodule_ii").show();
                     			$("#" + tabId + " .left_equip_hostmodule_ii").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$("#" + tabId + " .left_equip_hostmodule_ii").hide();
                     		
                     		
                     		if(data.data[0].safenumoutput_i==2){
                     			$("#" + tabId + " .left_equip_szlsrcA").show();
                     			$("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenumoutput_i==1){
                     			$("#" + tabId + " .left_equip_szlsrcA").show();
                     			$("#" + tabId + " .left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$("#" + tabId + " .left_equip_szlsrcA").hide();
                     		
                     		
                     		if(data.data[0].safenuminput_i==2){
                     			$("#" + tabId + " .left_equip_szlsrA").show();
                     			$("#" + tabId + " .left_equip_szlsrA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenuminput_i==1){
                     			$("#" + tabId + " .left_equip_szlsrA").show();
                     			$("#" + tabId + " .left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_szlsrA").hide();
                     		
                     		
                     		if(data.data[0].railsignalmodule_i==2){
                     			$("#" + tabId + " .left_equip_kztxaError").show();
                     			$("#" + tabId + " .left_equip_kztxaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].railsignalmodule_i==1){
                     			$("#" + tabId + " .left_equip_kztxaError").show();
                     			$("#" + tabId + " .left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_kztxaError").hide();
                     		
                     		
                     		if(data.data[0].safefreqinput_i==2){
                     			$("#" + tabId + " .left_equip_mnlsrcA").show();
                     			$("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safefreqinput_i==1){
                     			$("#" + tabId + " .left_equip_mnlsrcA").show();
                     			$("#" + tabId + " .left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_mnlsrcA").hide();
                     		
                     		$("#" + tabId + " .left_equip_txaError").show();
                     		if(data.data[0].normimitateinput_i==2){
                     			$("#" + tabId + " .left_equip_txaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].normimitateinput_i==1){
                     			$("#" + tabId + " .left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_txaError").hide();
                     		
                     		
                     		if(data.data[0].communicaterecord_i==2){
                     			$("#" + tabId + " .left_equip_claError").show();
                     			$("#" + tabId + " .left_equip_claError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].communicaterecord_i==1){
                     			$("#" + tabId + " .left_equip_claError").show();
                     			$("#" + tabId + " .left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_claError").hide();
                     		
                     		if(data.data[0].flaxraypass_i==1){
                     			
                     			$("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else {
                     			
                     			$("#" + tabId + " .left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		
                     		
                     		if(data.data[0].flaxraypass_ii==1){

                     			$("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else {
                     			
                     			$("#" + tabId + " .left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		
                     		
                     		if(data.data[0].communicaterecord_ii==2){
                     			$("#" + tabId + " .left_equip_clbError").show();
                     			$("#" + tabId + " .left_equip_clbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].communicaterecord_ii==1){
                     			$("#" + tabId + " .left_equip_clbError").show();
                     			$("#" + tabId + " .left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_clbError").hide();
                     		
                     		if(data.data[0].normimitateinput_ii==2){
                     			$("#" + tabId + " .left_equip_txbError").show();
                     			$("#" + tabId + " .left_equip_txbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].normimitateinput_ii==1){
                     			$("#" + tabId + " .left_equip_txbError").show();
                     			$("#" + tabId + " .left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_txbError").hide();
                     		
                     		if(data.data[0].safefreqinput_ii==2){
                     			$("#" + tabId + " .left_equip_mnlsrcB").show();
                     			$("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safefreqinput_ii==1){
                     			$("#" + tabId + " .left_equip_mnlsrcB").show();
                     			$("#" + tabId + " .left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_mnlsrcB").hide();
                     		
                     		if(data.data[0].railsignalmodule_ii==2){
                     			$("#" + tabId + " .left_equip_kztxbError").show();
                     			$("#" + tabId + " .left_equip_kztxbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].railsignalmodule_ii==1){
                     			$("#" + tabId + " .left_equip_kztxbError").show();
                     			$("#" + tabId + " .left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_kztxbError").hide();
                     		
                     		if(data.data[0].safenuminput_ii==2){
                     			$("#" + tabId + " .left_equip_szlsrB").show();
                     			$("#" + tabId + " .left_equip_szlsrB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenuminput_ii==1){
                     			$("#" + tabId + " .left_equip_szlsrB").show();
                     			$("#" + tabId + " .left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_szlsrB").hide();
                     		
                     		if(data.data[0].safenumoutput_ii==2){
                     			$("#" + tabId + " .left_equip_szlsrcB").show();
                     			$("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenumoutput_ii==1){
                     			$("#" + tabId + " .left_equip_szlsrcB").show();
                     			$("#" + tabId + " .left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $("#" + tabId + " .left_equip_szlsrcB").hide();
                     		///////////////////////////////////////////////////////
                     		$("#" + tabId + " .left_equip_mnLcgyl").text(data.data[0].mnLcgyl);
                     		$("#" + tabId + " .left_equip_plSd0").text(data.data[0].plSd0);
                     		$("#" + tabId + " .left_equip_plSd1").text(data.data[0].plSd1);
                     		$("#" + tabId + " .left_equip_plSd2").text(data.data[0].plSd2);
                     		//////////////////////////////////////////////////////
                     		$("#" + tabId + " .left_equip_mnYbdy").text(data.data[0].mnYbdy);
                     		$("#" + tabId + " .left_equip_mnYbdl").text(data.data[0].mnYbdl);
                     		$("#" + tabId + " .left_equip_plYbgl").text(data.data[0].plYbgl);
                     		$("#" + tabId + " .left_equip_plCyzs").text(data.data[0].plCyzs);
                     		$("#" + tabId + " .left_equip_mnJsdj").text(data.data[0].mnJsdj);
                     		$("#" + tabId + " .left_equip_mnZjyl").text(data.data[0].mnZjyl);
                     		///////////////////////////////////////////////////////
                     		if(data.data[0].mnJsdj==0){
                     			$("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnYbdy==0){
                     			$("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnYbdl==0){
                     			$("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnZjyl==0){
                     			$("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnByyl==0){
                     			$("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnFgyl==0){
                     			$("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnZgyl==0){
                     			$("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnLcgyl==0){
                     			$("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		/////////////////////////////////////////////////////
                     		if(data.data[0].proEpromA==0){
                     			$("#" + tabId + " .left_equip_proEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].proEpromB==0){
                     			$("#" + tabId + " .left_equip_proEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.dataEpromA==0){
                     			$("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].dataEpromB==0){
                     			$("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].ramA==0){
                     			$("#" + tabId + " .left_equip_ramA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].ramB==0){
                     			$("#" + tabId + " .left_equip_ramB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].cpuRamA==0){
                     			$("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].cpuRamB==0){
                     			$("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].tbtxA==0){
                     			$("#" + tabId + " .left_equip_tbtxA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     	    		
                     		if(data.data[0].tbtxB==0){
                     			$("#" + tabId + " .left_equip_tbtxB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].canA==0){
                     			$("#" + tabId + " .left_equip_canA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].canB==0){
                     			$("#" + tabId + " .left_equip_canB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].clockA==0){
                     			$("#" + tabId + " .left_equip_clockA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].clockB==0){
                     			$("#" + tabId + " .left_equip_clockB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		///////////////////////////////////////////////////////////
                     		if(data.data[0].gnkzh==0){
                     			$("#" + tabId + " .left_equip_gnkzh").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$("#" + tabId + " .left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		$("#" + tabId + " .left_equip_deviceCorpIf").text(data.data[0].deviceCorpIf);
                     		$("#" + tabId + " .left_equip_B_proVerIf").text(data.data[0].proVerIf);
                         
                		 }
                		 else{

                         	/*$("#" + tabId + " .left_equip_btm").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$("#" + tabId + " .left_equip_btm").text("正常");*/
                         	if(data.data[0].btm==1){
                     			$(".left_equip_btm").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_btm").text("正常");
                     		}else{
                     			$(".left_equip_btm").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_btm").text("故障");
                     		}
                         	
                         	/*
                         	 * 新一代lkj状态处理 
                         	 */      
                         	
                         	$(".left_equip_monitor2").show();
                         	$(".left_equip_monitor1").show();
                     		if(data.data[0].dmi_i==1){
                     			$(".left_equip_monitor1").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     		}else{
                     			$(".left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     		}
                     		
                     		if(data.data[0].dmi_ii==1){
                     			$(".left_equip_monitor2").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     		}else{
                     			$(".left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     		}
                     		/*if(data.data[0].dmi_iorii==0){
                     			$(".left_equip_monitor2").hide();
                     		}
                     		else $(".left_equip_monitor1").hide();*/
                     		
                     		/*$(".left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_signal").text("正常");*/
                     		if(data.data[0].locosignal==1){
                     			$(".left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_signal").text("正常");
                     		}else{
                     			$(".left_equip_signal").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_signal").text("故障");
                     		}
                 			/*$(".left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_power").text("正常");*/
                     		if(data.data[0].displaypowermodule==1){
                     			$(".left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_power").text("正常");
                     		}else{
                     			$(".left_equip_power").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_power").text("故障");
                     		}
                 			/*$(".left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_font").text("正常");*/
                     		if(data.data[0].fontfile==1){
                     			$(".left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_font").text("正常");
                     		}else{
                     			$(".left_equip_font").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_font").text("故障");
                     		}
                 			/*$(".left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_signalpic").text("正常");*/
                     		if(data.data[0].locosignalpicture==1){
                     			$(".left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_signalpic").text("正常");
                     		}else{
                     			$(".left_equip_signalpic").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_signalpic").text("故障");
                     		}
                 			/*$(".left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_disstorage").text("正常");*/
                     		if(data.data[0].displayramcheck==1){
                     			$(".left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_disstorage").text("正常");
                     		}else{
                     			$(".left_equip_disstorage").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_disstorage").text("故障");
                     		}
                 			/*$(".left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_pixel").text("正常");*/
                     		if(data.data[0].dynamicpixelcheck==1){
                     			$(".left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_pixel").text("正常");
                     		}else{
                     			$(".left_equip_pixel").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_pixel").text("失败");
                     		}
                 			/*$(".left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_key").text("正常");*/
                     		if(data.data[0].keybord==1){
                     			$(".left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_key").text("正常");
                     		}else{
                     			$(".left_equip_key").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_key").text("故障");
                     		}
                 			/*$(".left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                 			$(".left_equip_cardreader").text("正常");*/
                     		if(data.data[0].cardreader_ic==1){
                     			$(".left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			$(".left_equip_cardreader").text("正常");
                     		}else{
                     			$(".left_equip_cardreader").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			$(".left_equip_cardreader").text("故障");
                     		}
                     		
                     		$("#"+tabId+" .left_equip_dmitemp").text(data.data[0].temperature_dmi);
                     		
                     		//温度判断有待商榷
                     		if(data.data[0].temperature_dmi<50){
                     			$(".left_equip_dmitemp").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
                     			
                     		}else{
                     			$(".left_equip_dmitemp").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
                     			
                     		}
                     		/*$(".left_equip_B_jkzbAjkdate").text(data.data[0].jkzbAjkdate);
                     		$(".left_equip_B_jkzbAdata").text(data.data[0].jkzbAdata);
                     		$(".left_equip_B_monitor1").text(data.data[0].monitor1Info);*/
                     		///////////////////////////////////////////////////////////////////
                     		
                     		if(data.data[0].hostmodule_i==2){
                     			$(".left_equip_hostmodule_i").show();
                     			$(".left_equip_hostmodule_i").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].hostmodule_i==1){
                     			$(".left_equip_hostmodule_i").show();
                     			$(".left_equip_hostmodule_i").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$(".left_equip_hostmodule_i").hide();
                     		
                     		
                     		if(data.data[0].hostmodule_ii==2){
                     			$(".left_equip_hostmodule_ii").show();
                     			$(".left_equip_hostmodule_ii").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].hostmodule_ii==1){
                     			$(".left_equip_hostmodule_ii").show();
                     			$(".left_equip_hostmodule_ii").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$(".left_equip_hostmodule_ii").hide();
                     		
                     		
                     		if(data.data[0].safenumoutput_i==2){
                     			$(".left_equip_szlsrcA").show();
                     			$(".left_equip_szlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenumoutput_i==1){
                     			$(".left_equip_szlsrcA").show();
                     			$(".left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else 
                     			$(".left_equip_szlsrcA").hide();
                     		
                     		
                     		if(data.data[0].safenuminput_i==2){
                     			$(".left_equip_szlsrA").show();
                     			$(".left_equip_szlsrA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenuminput_i==1){
                     			$(".left_equip_szlsrA").show();
                     			$(".left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_szlsrA").hide();
                     		
                     		
                     		if(data.data[0].railsignalmodule_i==2){
                     			$(".left_equip_kztxaError").show();
                     			$(".left_equip_kztxaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].railsignalmodule_i==1){
                     			$(".left_equip_kztxaError").show();
                     			$(".left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_kztxaError").hide();
                     		
                     		
                     		if(data.data[0].safefreqinput_i==2){
                     			$(".left_equip_mnlsrcA").show();
                     			$(".left_equip_mnlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safefreqinput_i==1){
                     			$(".left_equip_mnlsrcA").show();
                     			$(".left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_mnlsrcA").hide();
                     		
                     		$(".left_equip_txaError").show();
                     		if(data.data[0].normimitateinput_i==2){
                     			$(".left_equip_txaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].normimitateinput_i==1){
                     			$(".left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_txaError").hide();
                     		
                     		
                     		if(data.data[0].communicaterecord_i==2){
                     			$(".left_equip_claError").show();
                     			$(".left_equip_claError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].communicaterecord_i==1){
                     			$(".left_equip_claError").show();
                     			$(".left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_claError").hide();
                     		
                     		if(data.data[0].flaxraypass_i==1){
                     			
                     			$(".left_equip_jkzbaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else {
                     			
                     			$(".left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		
                     		
                     		if(data.data[0].flaxraypass_ii==1){

                     			$(".left_equip_jkzbbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else {
                     			
                     			$(".left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		
                     		
                     		if(data.data[0].communicaterecord_ii==2){
                     			$(".left_equip_clbError").show();
                     			$(".left_equip_clbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].communicaterecord_ii==1){
                     			$(".left_equip_clbError").show();
                     			$(".left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_clbError").hide();
                     		
                     		if(data.data[0].normimitateinput_ii==2){
                     			$(".left_equip_txbError").show();
                     			$(".left_equip_txbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].normimitateinput_ii==1){
                     			$(".left_equip_txbError").show();
                     			$(".left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_txbError").hide();
                     		
                     		if(data.data[0].safefreqinput_ii==2){
                     			$(".left_equip_mnlsrcB").show();
                     			$(".left_equip_mnlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safefreqinput_ii==1){
                     			$(".left_equip_mnlsrcB").show();
                     			$(".left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_mnlsrcB").hide();
                     		
                     		if(data.data[0].railsignalmodule_ii==2){
                     			$(".left_equip_kztxbError").show();
                     			$(".left_equip_kztxbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].railsignalmodule_ii==1){
                     			$(".left_equip_kztxbError").show();
                     			$(".left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_kztxbError").hide();
                     		
                     		if(data.data[0].safenuminput_ii==2){
                     			$(".left_equip_szlsrB").show();
                     			$(".left_equip_szlsrB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenuminput_ii==1){
                     			$(".left_equip_szlsrB").show();
                     			$(".left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_szlsrB").hide();
                     		
                     		if(data.data[0].safenumoutput_ii==2){
                     			$(".left_equip_szlsrcB").show();
                     			$(".left_equip_szlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
                     		}else if(data.data[0].safenumoutput_ii==1){
                     			$(".left_equip_szlsrcB").show();
                     			$(".left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
                     		}
                     		else $(".left_equip_szlsrcB").hide();
                     		///////////////////////////////////////////////////////
                     		$(".left_equip_mnLcgyl").text(data.data[0].mnLcgyl);
                     		$(".left_equip_plSd0").text(data.data[0].plSd0);
                     		$(".left_equip_plSd1").text(data.data[0].plSd1);
                     		$(".left_equip_plSd2").text(data.data[0].plSd2);
                     		//////////////////////////////////////////////////////
                     		$(".left_equip_mnYbdy").text(data.data[0].mnYbdy);
                     		$(".left_equip_mnYbdl").text(data.data[0].mnYbdl);
                     		$(".left_equip_plYbgl").text(data.data[0].plYbgl);
                     		$(".left_equip_plCyzs").text(data.data[0].plCyzs);
                     		$(".left_equip_mnJsdj").text(data.data[0].mnJsdj);
                     		$(".left_equip_mnZjyl").text(data.data[0].mnZjyl);
                     		///////////////////////////////////////////////////////
                     		if(data.data[0].mnJsdj==0){
                     			$(".left_equip_B_mnJsdj").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnYbdy==0){
                     			$(".left_equip_B_mnYbdy").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnYbdl==0){
                     			$(".left_equip_B_mnYbdl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnZjyl==0){
                     			$(".left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnByyl==0){
                     			$(".left_equip_B_mnByyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnFgyl==0){
                     			$(".left_equip_B_mnFgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnZgyl==0){
                     			$(".left_equip_B_mnZgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].mnLcgyl==0){
                     			$(".left_equip_B_mnLcgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		/////////////////////////////////////////////////////
                     		if(data.data[0].proEpromA==0){
                     			$(".left_equip_proEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].proEpromB==0){
                     			$(".left_equip_proEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.dataEpromA==0){
                     			$(".left_equip_dataEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].dataEpromB==0){
                     			$(".left_equip_dataEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].ramA==0){
                     			$(".left_equip_ramA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].ramB==0){
                     			$(".left_equip_ramB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].cpuRamA==0){
                     			$(".left_equip_cpuRamA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].cpuRamB==0){
                     			$(".left_equip_cpuRamB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].tbtxA==0){
                     			$(".left_equip_tbtxA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     	    		
                     		if(data.data[0].tbtxB==0){
                     			$(".left_equip_tbtxB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].canA==0){
                     			$(".left_equip_canA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].canB==0){
                     			$(".left_equip_canB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].clockA==0){
                     			$(".left_equip_clockA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		
                     		if(data.data[0].clockB==0){
                     			$(".left_equip_clockB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		///////////////////////////////////////////////////////////
                     		if(data.data[0].gnkzh==0){
                     			$(".left_equip_gnkzh").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
                     		}else{
                     			$(".left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
                     		}
                     		$(".left_equip_deviceCorpIf").text(data.data[0].deviceCorpIf);
                     		$(".left_equip_B_proVerIf").text(data.data[0].proVerIf);
                		 }
                	 }
                }
            });
        }
    })
    
    RTU.register("app.realtimeloco15motivequery.trainalarm.setEquipDetailData",function(){
    	return function(data){
    		
    	}
    });


    RTU.register("app.realtimeloco15motivequery.trainalarm.activate", function () {

        return function (obj) {
        	//更新数据
        	if(window.locoInfoInterval){
            	clearInterval(window.locoInfoInterval);
            	window.locoInfoInterval=null;
            }
        	if(obj&&obj.itemData){
                //更新数据
                RTU.invoke("app.realtimeloco15motivequery.trainalarm.initData", obj);
                RTU.invoke("app.realtimeloco15motivequery.trainalarm.searchEquip",obj);
                
                window.locoInfoInterval = setInterval(function () {
            		RTU.invoke("app.realtimeloco15motivequery.trainalarm.initData", obj);
            		RTU.invoke("app.realtimeloco15motivequery.trainalarm.searchEquip", obj);
            	},5000);
        	}


            //$(".app_realtime_train_div").append("+ activate数据");
            //            var url = "onlineloco/searchLocoInfoByProperty?locoTypeid=&locoNo=" + obj.locoNO;
            //            var param = {
            //                url: url,
            //                data: { "str": idsStr },
            //                cache: false,
            //                datatype: "jsonp",
            //                success: function (data) {
            //                    $.each(data.data, function (i, n) {
            //                        n.locoTypeStr = n.locoTypeName + "-" + n.locoNO;
            //                    });
            //                    var d = {
            //                        p: false,
            //                        data: data.data
            //                    };
            //                    RTU.invoke("app.realtimeloco15motivequery.query.AddOrUpdateMarker", d);
            //                }
            //            };
            //            RTU.invoke("core.router.get", param);
            //            $("#" + obj.tabId).append("+ activate数据");
            RTU.invoke("app.realtimeloco15motivequery.trainalarm.initclick", obj);
            //$("#"+ obj.tabId + " .content-qualityAlarm-div").append("<div><span class='bundefined'>详情</span></div>");
            //            $("#" + obj.tabId + " .bundefined").unbind("click").click(function () {
            //                RTU.invoke("app.realtimeloco15motivequery.query.initInfoWnd");
            //            })
        };
    });

    RTU.register("app.realtimeloco15motivequery.trainalarm.initclick", function () {
        return function (obj) {
        	if (obj.tabId) {
            	//初始化界面事件
                $("#" + obj.tabId + " .basic-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-basic-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 500 });
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
                    /*obj.Point.setTabWH({ width: 380, height: 500 });*/
                    obj.Point.setTabWH({ width: 380, height: 280 });
                    $("#" + obj.tabId + " .banbenA_New").css("height","220px");
                    $("#" + obj.tabId + " .banbenB_New").css("height","220px");
                });
                $("#" + obj.tabId + " .qualityAlarm-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 380, height: 420 });
                });
                $("#" + obj.tabId + " .equipmentStatus-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-right");
                    $("#" + obj.tabId + " .basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $("#" + obj.tabId + " .content-equipmentStatus-div").removeClass("hidden");
                    $("#" + obj.tabId + " .content-basic-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-version-div").addClass("hidden");
                    $("#" + obj.tabId + " .content-qualityAlarm-div").addClass("hidden");
                    obj.Point.setTabWH({ width: 670, height: 326 });
                    /*RTU.invoke("app.realtimeloco15motivequery.trainalarm.equipmentStatusInitData", obj);*/
                });
        	}
        	else{
            	//初始化界面事件
                $(".basic-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                    $(".version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".content-basic-div").removeClass("hidden");
                    $(".content-version-div").addClass("hidden");
                    $(".content-qualityAlarm-div").addClass("hidden");
                    $(".content-equipmentStatus-div").addClass("hidden");
                    
                    obj.popuwndLocoInfo.setSize(380, 510);
                });
                $(".version-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $(".basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".content-version-div").removeClass("hidden");
                    $(".content-basic-div").addClass("hidden");
                    $(".content-qualityAlarm-div").addClass("hidden");
                    $(".content-equipmentStatus-div").addClass("hidden");
                    /*obj.popuwndLocoInfo.setSize(380, 500);*/
                    obj.popuwndLocoInfo.setSize(380, 280);
                    $(" .banbenA_New").css("height","220px");
                    $(" .banbenB_New").css("height","220px");
                });
                $(".qualityAlarm-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click");
                    $(".basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".equipmentStatus-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".content-qualityAlarm-div").removeClass("hidden");
                    $(".content-basic-div").addClass("hidden");
                    $(".content-version-div").addClass("hidden");
                    $(".content-equipmentStatus-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(380, 420);
                    /*obj.Point.setTabWH({ width: 380, height: 280 });
                    $(" .banbenA_New").css("height","220px");
                    $(" .banbenB_New").css("height","220px");*/
                });
                $(".equipmentStatus-tab-div").unbind("click").click(function () {
                    $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-right");
                    $(".basic-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".version-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".qualityAlarm-tab-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                    $(".content-equipmentStatus-div").removeClass("hidden");
                    $(".content-basic-div").addClass("hidden");
                    $(".content-version-div").addClass("hidden");
                    $(".content-qualityAlarm-div").addClass("hidden");
                    obj.popuwndLocoInfo.setSize(670, 326);
                    /*$(this).parent("div").parent("div").parent("div").find(".equipment-monitoring-main-content-div-wb").css({"width":"669px","height":"288px"});*/
                    
                    $(this).parent("div").parent("div").parent("div").find(".content-equipmentStatus-div").css({"height":"288px"});
                    $(this).parent("div").parent("div").parent("div").find(".equipment-monitoring-main-content-div-wb").css({"width":"669px","height":"288px"});
                    
                    /*RTU.invoke("app.realtimeloco15motivequery.trainalarm.equipmentStatusInitData", obj);*/
                });
        	}

        }
    });

   /* RTU.register("app.realtimeloco15motivequery.trainalarm.equipmentStatusInitData", function () {
        return function (data) {
            $.ajax({
                url: "../lkjStatusHis/searchHisInfoByProperty?page=1&pageSize=10&locoTypeid=" + data.itemData.locoTypeid + "&locoNo=" + data.itemData.locoNO,
                dataType: "jsonp",
                type: "GET",
                success: function (r) {
                
                
                 } 
            });

        }
    });*/

    RTU.register("app.realtimeloco15motivequery.trainalarm.deactivate", function () {

        return function () {

        };
    });
});
