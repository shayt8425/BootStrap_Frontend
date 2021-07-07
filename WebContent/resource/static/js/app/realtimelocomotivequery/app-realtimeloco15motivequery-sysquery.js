RTU.DEFINE(function (require, exports) {

    require("jquery/jquery-1.7.2.min.js");
    require("../../../css/app/app-realtimeloco15motive-sysquery.css");

    var intervalObj=new Array();
    
    var currData=null;

    RTU.register("app.lkj15sysinfo.query.movercurveinit",function(){
    	return function(data){
            currData=data;
            
            RTU.invoke("app.lkj15sysinfo.query.activate");
            
            $(".rightDiv .btn_quit_div").unbind("click").bind("click",function(){
            	
            	 $(".rightDiv").parent("div").hide();
        	});
    	};
    });
    
    RTU.register("app.lkj15sysinfo.query.init", function () {
        return function (data) {
        	RTU.invoke("core.router.load", {
                url: "../app/modules/app-realtimeloco15motivequery-sysquery.html",
                success: function (html) {
                	 $html = $(html);

                     /*if (window.popuwnd_file) {
                         //clearInterval(timer); //窗口关闭时清除3秒刷新
                         window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                     }*/
                     
                     if (window.popuwndLocoInfo) {
                         window.popuwndLocoInfo.close();
                     }
                     window.popuwndLocoInfo = new PopuWnd({
                         title: "新一代LKJ系统查询-" + "(" + data.locoTypeName + "-" + data.locoNo + ")",
                         html: html,
                         width: 730,
                         height: 342,
                         left: 315,
                         top: 60,
                         shadow: true
                     });
                     window.popuwndLocoInfo.myClose = window.popuwndLocoInfo.close;
                     window.popuwndLocoInfo.close = function () {
                         //clearInterval(timer); //窗口关闭时清除3秒刷新
                    	 for(var i=0;i<intervalObj.length;i++){
                    		 window.clearInterval(intervalObj[i]);
                    	 }
                         this.hidden();
                     };
                     window.popuwndLocoInfo.init();
                     
                     window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
                         //clearInterval(timer); //窗口关闭时清除3秒刷新
                    	 for(var i=0;i<intervalObj.length;i++){
                    		 window.clearInterval(intervalObj[i]);
                    	 }
                    	 window.popuwndLocoInfo=null;
                     });
                     
                     currData=data;
                     
                     RTU.invoke("app.lkj15sysinfo.query.activate");
                }
            });
        };
    });

    RTU.register("app.lkj15sysinfo.query.activate", function () {
        return function () {
        	$(".rightDiv .btn_trainparam_div").click(function(){
        		$(".sysstatusquery_maindiv,.machineunit_maindiv,.versioninfo_maindiv," +
        				".extendunit_maindiv,.checkparam_maindiv").hide();
        		$(".runparam_maindiv").show();
        	});
        	
        	$(".rightDiv .btn_checkinfo_div").click(function(){
        		$(".sysstatusquery_maindiv,.machineunit_maindiv,.versioninfo_maindiv," +
				".extendunit_maindiv,.runparam_maindiv").hide();
        		$(".checkparam_maindiv").show();
        	});
        	
        	$(".rightDiv .btn_sysstatus_div").click(function(){
        		$(".runparam_maindiv,.machineunit_maindiv,.versioninfo_maindiv," +
				".extendunit_maindiv,.checkparam_maindiv").hide();
        		$(".sysstatusquery_maindiv").show();
        	});

        	$(".rightDiv .btn_versioninfo_div").click(function(){
        		$(".sysstatusquery_maindiv,.machineunit_maindiv,.runparam_maindiv," +
				".extendunit_maindiv,.checkparam_maindiv").hide();
        		$(".versioninfo_maindiv").show();
        	});

        	$(".rightDiv .btn_machineunit_div").click(function(){
        		$(".sysstatusquery_maindiv,.runparam_maindiv,.versioninfo_maindiv," +
				".extendunit_maindiv,.checkparam_maindiv").hide();
        		$(".machineunit_maindiv").show();
        	});
        	
        	$(".rightDiv .btn_extendunit_div").click(function(){
        		$(".sysstatusquery_maindiv,.machineunit_maindiv,.versioninfo_maindiv," +
				".runparam_maindiv,.checkparam_maindiv").hide();
        		$(".extendunit_maindiv").show();
        	});
        	
        	$(".rightDiv .btn_quit_div").unbind("click").bind("click",function(){
        		window.popuwndLocoInfo.close();
        	});
        	
        	RTU.invoke("app.lkj15sysinfo.runparam.init");
        	
        	intervalObj.push(window.setInterval('RTU.invoke("app.lkj15sysinfo.runparam.init")',5000));
        	
        	RTU.invoke("app.lkj15sysinfo.statusquery.init");
        	
        	intervalObj.push(window.setInterval('RTU.invoke("app.lkj15sysinfo.statusquery.init")',5000));
        };
    });

    RTU.register("app.lkj15sysinfo.statusquery.init", function () {
    	return function(){
    		 var url = "../jk15Equip/searchLoco15ByEquip?locoTypeid="+currData.locoTypeid+"&locoNo="+currData.locoNo
             +"&locoAb="+currData.locoAb;
             $.ajax({
                 url: url,
                 dataType: "jsonp",
                 type: "GET",
                 success: function (data) {

                	 if(data.data.length>0){
                		 
                		 //系统状态
                		 if(data.data[0].btm==1){
                  			$(".btm_error_div").hide();
                  		}else{
                  			$(".btm_error_div").show();
                  		}
                		 if(data.data[0].dmi_i==1){
                  			$(".dmi_i_error_div").hide();
                  		}else{
                  			$(".dmi_i_error_div").show();
                  		}
                  		
                  		if(data.data[0].dmi_ii==1){
                  			$(".dmi_ii_error_div").hide();
                  		}else{
                  			$(".dmi_ii_error_div").show();
                  		}
                  		if(data.data[0].locosignal==1){
                  			$(".locosignal_error_div").hide();
                 		}else{
                 			$(".locosignal_error_div").show();
                 		}
                  		
                  		//主机单元
                  		if(data.data[0].hostmodule_i==2){
                 			$(".machineunit_maindiv .host_i").show();
                 			$(".machineunit_maindiv .host_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].hostmodule_i==1){
                 			$(".machineunit_maindiv .host_i").show();
                 			$(".machineunit_maindiv .host_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safeout_i").hide();
                  		
                  		if(data.data[0].hostmodule_ii==2){
                 			$(".machineunit_maindiv .host_ii").show();
                 			$(".machineunit_maindiv .host_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].hostmodule_ii==1){
                 			$(".machineunit_maindiv .host_ii").show();
                 			$(".machineunit_maindiv .host_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .host_ii").hide();
                  		
                  		if(data.data[0].safenumoutput_i==2){
                 			$(".machineunit_maindiv .safeout_i").show();
                 			$(".machineunit_maindiv .safeout_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safenumoutput_i==1){
                 			$(".machineunit_maindiv .safeout_i").show();
                 			$(".machineunit_maindiv .safeout_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safeout_i").hide();
                  		
                  		if(data.data[0].safenumoutput_ii==2){
                 			$(".machineunit_maindiv .safeout_ii").show();
                 			$(".machineunit_maindiv .safeout_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safenumoutput_ii==1){
                 			$(".machineunit_maindiv .safeout_ii").show();
                 			$(".machineunit_maindiv .safeout_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safeout_ii").hide();
                  		
                  		if(data.data[0].safenuminput_i==2){
                 			$(".machineunit_maindiv .safein_i").show();
                 			$(".machineunit_maindiv .safein_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safenuminput_i==1){
                 			$(".machineunit_maindiv .safein_i").show();
                 			$(".machineunit_maindiv .safein_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safein_i").hide();
                  		
                  		if(data.data[0].safenuminput_ii==2){
                 			$(".machineunit_maindiv .safein_ii").show();
                 			$(".machineunit_maindiv .safein_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safenuminput_ii==1){
                 			$(".machineunit_maindiv .safein_ii").show();
                 			$(".machineunit_maindiv .safein_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safein_ii").hide();
                  		
                  		if(data.data[0].safefreqinput_i==2){
                 			$(".machineunit_maindiv .safefreqin_i").show();
                 			$(".machineunit_maindiv .safefreqin_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safefreqinput_i==1){
                 			$(".machineunit_maindiv .safefreqin_i").show();
                 			$(".machineunit_maindiv .safefreqin_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safefreqin_i").hide();
                  		
                  		if(data.data[0].safefreqinput_ii==2){
                 			$(".machineunit_maindiv .safefreqin_ii").show();
                 			$(".machineunit_maindiv .safefreqin_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].safefreqinput_ii==1){
                 			$(".machineunit_maindiv .safefreqin_ii").show();
                 			$(".machineunit_maindiv .safefreqin_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .safefreqin_ii").hide();
                  		
                  		if(data.data[0].normimitateinput_i==2){
                 			$(".machineunit_maindiv .imulateoutin_i").show();
                 			$(".machineunit_maindiv .imulateoutin_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].normimitateinput_i==1){
                 			$(".machineunit_maindiv .imulateoutin_i").show();
                 			$(".machineunit_maindiv .imulateoutin_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .imulateoutin_i").hide();
                  		
                  		if(data.data[0].normimitateinput_ii==2){
                 			$(".machineunit_maindiv .imulateoutin_ii").show();
                 			$(".machineunit_maindiv .imulateoutin_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].normimitateinput_ii==1){
                 			$(".machineunit_maindiv .imulateoutin_ii").show();
                 			$(".machineunit_maindiv .imulateoutin_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .imulateoutin_ii").hide();
                  		
                  		if(data.data[0].communicaterecord_i==2){
                 			$(".machineunit_maindiv .corprecord_i").show();
                 			$(".machineunit_maindiv .corprecord_i").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].communicaterecord_i==1){
                 			$(".machineunit_maindiv .corprecord_i").show();
                 			$(".machineunit_maindiv .corprecord_i").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .corprecord_i").hide();
                  		
                  		if(data.data[0].communicaterecord_ii==2){
                 			$(".machineunit_maindiv .corprecord_ii").show();
                 			$(".machineunit_maindiv .corprecord_ii").removeClass("colorDiv_Error").addClass("colorDiv");
                 		}else if(data.data[0].communicaterecord_ii==1){
                 			$(".machineunit_maindiv .corprecord_ii").show();
                 			$(".machineunit_maindiv .corprecord_ii").removeClass("colorDiv").addClass("colorDiv_Error");
                 		}
                 		else 
                 			$(".machineunit_maindiv .corprecord_ii").hide();
                  		
                  		if($(".colorDiv_Error").length>0){
                  			$(".sysstatusquery_maindiv .machineunit_error_div").show();
                  		}
                	 }
                	 
                 }
             });
    	};
    });
    
    
    RTU.register("app.lkj15sysinfo.runparam.init", function () {

        function getCheciType(trainType){
        	switch (trainType) {
				case "1":
					return "货车";
				case "3":
					return "高铁";
				case "4":
					return "动车";
				default:
					return "客车";
			}
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
        function getversion(value){
        	if(!value)return "";
        	var resStr="";
        	value=value.toString();
        	switch(value.length){
        		case 8:
        			resStr=value.substr(0,4)+"."+
     			   value.substr(4,2)+"."+value.substr(6,2);
        			break;
        		case 10: 
        			resStr=value.substr(0,4)+"."+
      			   value.substr(4,2)+"."+value.substr(6,2)+"."+value.substr(8,2);
        		break;
        		case 12:
        			resStr=value.substr(0,4)+"."+
      			   value.substr(4,2)+"."+value.substr(6,2)+"."+value.substr(8,2)+"."+value.substr(10,2);
        			break;
        			default:break;
        	}
        	return resStr;
        };
        
        return function () {
        	$.ajax({
                url: "../onlineloco15/searchLoco15InfoByProperty?locoTypeid=" + currData.locoTypeid + "&locoNo=" + currData.locoNO+"&locoAb="+currData.locoAb,
                dataType: "jsonp",
                type: "GET",
                success: function (r) {
               	 var itemData=r.data;
               	 if(itemData){
               		 try{
                           //发车参数
                           $(".speed").text(itemData.speed); //实速度
                           $(".speedlevel").text(itemData.speedlevel+"km/h"); //速度等级
                           $(".frontDistance").text(itemData.frontDistance); //前方距离
                           $(".traintype").text(getCheciType(itemData.traintype));//列车类型
                           $(".chezhongtype").text(itemData.locotypeidentity);//车种标识
                           $(".checino").text(itemData.checiName); //车次
                           $(".driver1").text(itemData.driverId); //司机号1
                           $(".driver2").text(itemData.vicedriverId); //司机号2
                           $(".weight").text(itemData.weight); //载重
                           $(".totalWeight").text(itemData.totalWeight); //总重量
                           $(".carcount").text(itemData.vehicleCount); //辆数
                           
                           $(".rundirection").text(itemData.curlkjdirection);//发车方向
                           if(itemData.length!=null&&itemData.length.toString().trim()!=""){
                        	   itemData.length=itemData.length.toString();
                        	   switch(itemData.length.length){
                               case 1:
                            	   $(".totallength").text(0+"."+itemData.length); //计长
                               default:
                            	   $(".totallength").text(itemData.length.substr(0,itemData.length.length-1)+"."+
                            			   itemData.length.substr(itemData.length.length-1,1)); //计长
                            	   
                               }
                           }
                           else $(".totallength").text("");
                           
                           /*$(".chonglianche").text(itemData.locoAb==0?"无":(itemData.locoAb==1?"A节":"B节"));*/
                           
                           $(".runroute").text(itemData.factJiaolu);
                           
                           $(".keche").text(itemData.keche); //客车
                           
                           $(".zhongche").text(itemData.zhongche); //重车数
                           
                           $(".kongche").text(itemData.kongche); //空车数
                                   
                           $(".feiyunyongche").text(itemData.feiyunyongche); //非运用车数
                           
                           $(".daikeche").text(itemData.daikeche); //代客车
                           
                           $(".shouche").text(itemData.shouche); //守车
                           
                           //检修参数
                           $(".deptno").text(itemData.deptId); //所属段号
                           
                           $(".equipno").text(itemData.lkjno); //装置号 
                           $(".maichong").text(itemData.chaiyoujimaichong); //柴油机脉冲
                           $(".liangcheng")
                           .text(itemData.shuangzbliangchen); //管压 
                           if(itemData.wd_i!=null&&itemData.wd_i.toString().trim()!=""){
                        	   itemData.wd_i=itemData.wd_i.toString();
                        	   switch(itemData.wd_i.length){
                               case 1:
                            	   $(" .lunjing_i").text(0+"."+itemData.wd_i); //轮径I
                               default:
                            	   $(" .lunjing_i").text(itemData.wd_i.substr(0,itemData.wd_i.length-1)+"."+
                            			   itemData.wd_i.substr(itemData.wd_i.length-1,1)); //轮径I
                            	   
                               }
                           }
                           else 
                        	   $(" .lunjing_i").text("");
                           
                           if(itemData.wd_ii!=null&&itemData.wd_ii.toString().trim()!=""){
                        	   itemData.wd_ii=itemData.wd_ii.toString();
                        	   switch(itemData.wd_ii.length){
                               case 1:
                            	   $(" .lunjing_ii").text(0+"."+itemData.wd_ii); //轮径II
                               default:
                            	   $(" .lunjing_ii").text(itemData.wd_ii.substr(0,itemData.wd_ii.length-1)+"."+
                            			   itemData.wd_ii.substr(itemData.wd_ii.length-1,1)); //轮径II
                            	   
                               }
                           }
                           else 
                        	   $(" .lunjing_ii").text("");
                           $(".locotype").text(itemData.ttypeShortname); //机车
                           $(".locono").text(itemData.locoNo);
                           $(".btmdistance_i").text(itemData.replydistance_i);
                           $(".gpsdistance_i").text(itemData.gpsdistance_i);
                           
                           //系统状态版本赋值
                           $(".machineversion").text(itemData.apphostpluginver_i&&itemData.apphostpluginver_i.substr(0,1)!="0"?
                        		   getversion(itemData.apphostpluginver_i):getversion(itemData.apphostpluginver_ii)); 
                           $(".dmiversion").text(itemData.dmisoftwarever_i&&itemData.dmisoftwarever_i.substr(0,1)!="0"?
                        		   getversion(itemData.dmisoftwarever_i):getversion(itemData.dmisoftwarever_ii));
                           $(".ctrlparamversion").text(itemData.hostplugincontroldataparam_i&&itemData.hostplugincontroldataparam_i.substr(0,1)!="0"?
                        		   getversion(itemData.hostplugincontroldataparam_i):getversion(itemData.hostplugincontroldataparam_ii));
                           $(".basicdataversion").text(itemData.hostplugindataver_i&&itemData.hostplugindataver_i.substr(0,1)!="0"?
                        		   getversion(itemData.hostplugindataver_i):getversion(itemData.hostplugindataver_ii));
                           
                           //版本信息
                           
                           $(".version_ctrlsoft_i").text(getversion(itemData.hostplugincontrolsoftparam_i));
                           $(".version_ctrlsoft_ii").text(getversion(itemData.hostplugincontrolsoftparam_ii));
                           $(".version_ctrlfile_i").text(getversion(itemData.hostplugincontroldataparam_i));
                           $(".version_ctrlfile_ii").text(getversion(itemData.hostplugincontroldataparam_ii));
                           $(".version_basicsoft_i").text(getversion(itemData.hostpluginsoftwarever_i));
                           $(".version_basicsoft_ii").text(getversion(itemData.hostpluginsoftwarever_ii));
                           $(".version_basicfile_i").text(getversion(itemData.hostplugindataver_i));
                           $(".version_basicfile_ii").text(getversion(itemData.hostplugindataver_ii));
                           $(".version_hostsoft_i").text(getversion(itemData.apphostpluginver_i));
                           $(".version_hostsoft_ii").text(getversion(itemData.apphostpluginver_ii));
                           $(".version_dmisoft_i").text(getversion(itemData.dmisoftwarever_i));
                           $(".version_dmisoft_ii").text(getversion(itemData.dmisoftwarever_ii));
                           $(".version_ctrlsoft_i").text(getversion(itemData.hostplugincontrolsoftparam_i));
                           
                           
/*                         $(".locoNo").text(itemData.ttypeShortname+"-"+itemData.locoNo+"("+itemData.ttypeName+")"); //机车
                           $(".deptno").text(itemData.did); //所属段
                           $(".distanceText").text(itemData.frontDistance); //下一个信号机距离 
                           $(".place").text(itemData.sname+"-"+itemData.lname+  "(" + getLineFlag(itemData.lineFlag)+")");//位置
                           $(".signalNo").text(itemData.signalHeader+(itemData.signalNo=="0"?"":itemData.signalNo)); //信号机
                           $(".signalType").text(itemData.signalName); //信号机类型
                           $(".jkState").text(jkstateObj[itemData.jkstate]); //工作模式
                           $(".kiloSign").text(itemData.kiloSign/1000); //公里标
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
                           $(".jkstate").text(itemData.jkstateName); //监控状态 
                           $(".zhidongshuchu").text(getZhidongType(itemData.zhidong)); //制动输出 
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
                        	   $(".receiveTime").text(itemData.receiveTimeStr);
                           }
                           
                           //版本信息
                           $(".apphostpluginver1").text(itemData.apphostpluginver_i); 
                           $(".apphostpluginver2").text(itemData.apphostpluginver_ii); 
                           $(".hostplugindataver1").text(itemData.hostplugindataver_i); 
                           $(".hostplugindataver2").text(itemData.hostplugindataver_ii); 
                           $(".hostpluginsoftwarever1").text(itemData.hostpluginsoftwarever_i); 
                           $(".hostpluginsoftwarever2").text(itemData.hostpluginsoftwarever_ii); 
                           $(".hostplugincontroldataparam1").text(itemData.hostplugincontroldataparam_i); 
                           $(".hostplugincontroldataparam2").text(itemData.hostplugincontroldataparam_ii); 
                           $(".hostplugincontrolsoftparam1").text(itemData.hostplugincontrolsoftparam_i); 
                           $(".hostplugincontrolsoftparam2").text(itemData.hostplugincontrolsoftparam_ii); 
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
                           $(".distance_ico").attr("src", getImgUrl(itemData.locoSignal));*/
                         }
                         catch(e){
                         	
                          throw new Error("没有返回数据或者数据格式不正确！");
                         }
               	 }
                    
                }
            });
        	
        	
        };
    
    });
});
