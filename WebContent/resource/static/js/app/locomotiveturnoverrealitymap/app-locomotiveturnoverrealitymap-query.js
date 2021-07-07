RTU.DEFINE(function (require, exports) {
/**
 * 模块名：机车周转实际图
 * name：locomotiveturnoverrealitymap
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../../../css/app/locomotiveturnoverrealitymap/locomotiveturnoverreality-style.css");
    require("../../../js/jquery/d3.v3.min.js");
   
    var $html;
    var popuwnd;
    var data;
    var lastBeginTime;
    var lastEndTime;
    RTU.register("app.locomotiveturnoverrealitymap.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/locomotiveturnoverrealitymap/app-locomotiveturnoverrealitymap-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    RTU.invoke("app.time.init");
                    RTU.invoke("app.option_lineName.init");
                    RTU.invoke("app.option_lineNameData.init");
                    RTU.invoke("app.one_radioSelect");
                    RTU.invoke("app.plancheci.init");
                }
                
                //初始化，默认实际图
                /*$("input[value='LkjSJ']").attr("checked", "checked");
                $("#viewName").text("机车实际图");*/
                $("#LkjRH").attr("checked","checked");
                $("#viewName").text("机车周转计划图");
               
            }
        });
        return function () {
            return true;
        };
    });
    
    
    RTU.register("app.locomotiveturnoverrealitymap.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            var width = document.documentElement.clientWidth*0.85;
            var height =document.documentElement.clientHeight*0.85;
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: width,
                    height:height,
                    left: 135,
                    top: 60,
                    shadow: true,
                    removable: true,  //设置弹出窗口是否可拖动
                    deletable: true	  //设置是否显示弹出窗口的关闭按钮
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
            } else {
                popuwnd.init();
            }
        };
    });
    RTU.register("app.locomotiveturnoverrealitymap.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    RTU.register("app.locomotiveturnoverrealitymap.query.init", function () {
        data = RTU.invoke("app.setting.data", "locomotiveturnoverrealitymap");
        if (data && data.isActive) {
            RTU.invoke("app.locomotiveturnoverrealitymap.query.activate");
           
        }
        return function () {
            return true;
        };
    });
    
    
    //设置时间显示
    RTU.register("app.time.init", function () {
	     function GetDateStr(AddDayCount,extraParams){
	    	var dd = new Date();
		    dd.setDate(dd.getDate()+AddDayCount);
		    var y = dd.getFullYear();
		    var m = dd.getMonth()+1;
		    if(m<10)m="0"+m;
		    var d = dd.getDate();
		    if(d<10)d="0"+d;
		    return extraParams?(y+"-"+m+"-"+d):(y+"年"+m+"月"+d+"日");
	    };
	   function changeButtonInit(){//切换按钮初始化
		   $("#changeButton").unbind("click").bind("click",function(){
			   if($("#time3").val()==""||$("#time4").val()==""){
				   alert("请选择周转日期");
				   return;
			   }
			   var time3Val=$("#time3").val().split(' ')[0];
			   var time4Val=$("#time4").val().split(' ')[0];
			   var time3Array=time3Val.split('-');
			   var time4Array=time4Val.split('-');
			   $("#time").text(time3Array[0]+"年"+time3Array[1]+"月"+time3Array[2]+"日18时");
			   $("#time2").text(time4Array[0]+"年"+time4Array[1]+"月"+time4Array[2]+"日18时");
			   $("input[name='model']:checked").click();
		   });
	   };
	   function time3TextBlurFunc(){//周转日期时间选择框
		   $("#time3").unbind("blur").bind("blur",function(){
			   
			    var dd = new Date($("#time3").val());
			    dd.setDate(dd.getDate()+1);
			    var y = dd.getFullYear();
			    var m = dd.getMonth()+1;
			    if(m<10)m="0"+m;
			    var d = dd.getDate();
			    if(d<10)d="0"+d;
			    
			   $("#time4").val(y+"-"+m+"-"+d+" 18:00:00");
			   var time3Val=$("#time3").val().split(' ')[0];
			   var time4Val=$("#time4").val().split(' ')[0];
			   var time3Array=time3Val.split('-');
			   var time4Array=time4Val.split('-');
			   $("#time").text(time3Array[0]+"年"+time3Array[1]+"月"+time3Array[2]+"日18时");
			   $("#time2").text(time4Array[0]+"年"+time4Array[1]+"月"+time4Array[2]+"日18时");
		   });
	   };
	   return function runtime(){
		   /*var curHour=new Date().getHours();
		    var count1,count2;
		    if(curHour>=18){
		    	
		    }*/
	    	var time1 =GetDateStr(0)+"18时";//昨天
	    	var time2 =GetDateStr(1)+"18时";//今天
	    		$("#time").text(time1);//赋值
	    		$("#time2").text(time2);
	    		/*$("#time3").text(time1);
	    		$("#time4").text(time2);*/
	    		$("#time3").val(GetDateStr(0,true)+" 18:00:00");
	    		$("#time4").val(GetDateStr(1,true)+" 18:00:00");
	    		changeButtonInit();
	    		time3TextBlurFunc();
	    };
    });
    
    RTU.register("app.plancheci.init",function(){
    	return function(data){
    		$("#planCheciBtn").unbind("click").bind("click",function(){
    			if(!$("#checiSelect").val()){
    				alert("请选择一个车次");
    				return;
    			}
    			//根据区段、车次、计划时间生成机车计划信息
    			$.ajax({
    				
	    		/*url: "../section/findAll",*/
	    		url: "../section/savePlanInfo?scId="+$("#turnoverreality_lineName").val()+"&checi="+$("#checiSelect").val()
	    		+"&beginTime="+$("#time3").val()+"&endTime="+$("#time4").val()+"&realBeginTime="+lastBeginTime+"&realEndTime="
	    		+lastEndTime,
	    		dataType: "jsonp",
	    		type: "GET",
	    		success: function (value) {
	    			if (value && value.success!="") {
	    				alert("生成车次:"+$("#checiSelect").val()+"的计划信息成功");
	    			}
	    			else{
	    				alert("生成车次:"+$("#checiSelect").val()+"的计划信息失败");
	    			}
	    		}
	    	
    			})
    		});
    	};
    });
    
    //获取区段数据
    RTU.register("app.option_lineNameData.init", function () {
	    return function setLineName(){
	    	var cityElement =document.getElementById("turnoverreality_lineName");
	    	cityElement.options.length=1;
	    	$.ajax({
	    		/*url: "../section/findAll",*/
	    		url: "../section/findAllSections",
	    		dataType: "jsonp",
	    		type: "GET",
	    		success: function (value) {
	    			if (value && value.data) {
	    				$(value.data).each(function(i){
	    					
	    					var val=value.data[i][1];
	    					var id=value.data[i][0];
	    					//生成下拉选择列表
	    					$opt =$("<option id='"+id+"' value='"+id+"'>"+val+"</option>");
				 			$("#turnoverreality_lineName").append($opt);
	    				});
	    			}
	    		}
	    	});
	    };
    });
    
    
  //单选按钮事件
    RTU.register("app.one_radioSelect", function () {

	 return function radioSelect(){ 
		  $("input[name='model']").click(function () {
			  $(this).attr("checked", "checked");
			  var val=$(this).val();
			  $("#myCanvas").empty();//清除
			 
				  var chezhanNameArray=[];//存储车站名称
				  var cheZhanTmisArray=[];//存储车站tmisid数组;
				  var locoArray=[];//存储机车数组(二维的,一个车次可能对应多个机车)
				  var verCompareArray=[];//车次对应的机车比对信息
				  var dataObj=[];//存储所有所有车次的数据  x  y 坐标
				  var checiName=[];  //存储所有车次的名称
				  var timeArray=[];  //存储所有的时间    分钟
				  var dataIndex=0;  //存储所有所有车次的数据  x  y 坐标   索引
				  var checiNameIndex=0;  //存储所有车次的名称    索引 
				  var timeArrIndex=0;  //存储所有的时间    分钟   索引
				  //获取当前选中的线路
				  var  lineName =$("#turnoverreality_lineName option:selected").text();
				  var id=$("#turnoverreality_lineName option:selected").attr('id');//获取选 中属性的值
				  var time01= $("#time").text();	
				  time01=time01.replace("年", "-");
				  time01=time01.replace("月", "-");
				  time01=time01.replace("日", "-");
				  time01=time01.substring(0,time01.lastIndexOf("-"))+" 18:00";
				  lastBeginTime=time01+":00";
				  
				  var time02= $("#time2").text();
				  time02=time02.replace("年", "-");
				  time02=time02.replace("月", "-");
				  time02=time02.replace("日", "-");
				  time02=time02.substring(0,time02.lastIndexOf("-"))+" 18:00";
				  lastEndTime=time02+":00";
				  if(!id)return;
				  RTU.invoke("header.msg.show","请稍后。。");
				  var cheZhanDate=[];// 存储车站数组
				  
				  
				  $.ajax({
					  /*url: "../section/findStationNameByScId?scId="+id,*/
					  url: "../section/findStationNameBySectionId?sectionId="+id,
					  dataType: "jsonp",
					  type: "GET",
					  async:false,
					  success: function (value) {
						  if(value && value.data){
							  $(value.data).each(function(i){
								  var chezhanNameList =value.data;
								  for ( var int = 0; int < chezhanNameList.length; int++) {
									  chezhanNameArray[int]=chezhanNameList[int].stationName;
									  cheZhanTmisArray[int]=chezhanNameList[int].stationNo;
								  }
							  });
							  cheZhanDate=chezhanNameArray;// 车站数组
						  }
					  }
				  });
					  
			  //实际图
			  if(val=="LkjSJ"){
				  $("#viewName").text("机车实际图");
				//实际图的数据
				$.ajax({
					url: "../section/findViewForCheciAndTime?scId="+id+"&beginTime="+time01+"&endTime="+time02,
					dataType: "jsonp",
					type: "GET",
					success: function (value) {
						if(value && value.data){
							$(value.data).each(function(i){
								
								var dataArray2=[];//存储坐标  x为时间   y 为车站数字  一个车次内
								var index2=0;//存储坐标 索引
								var timeIndex=0;
								var time=[];
								/*var listdata=value.data[i].list;// 包括车站名和起止时间
*/							
								var listdata=value.data[i].list;// 包括车站名和起止时间
								/*checiName[checiNameIndex]=value.data[i].checiName+" "+listdata[i].locoTypename+"-"+listdata[i].locoNo;*/
								/*checiName[checiNameIndex]=listdata[i].locoTypename+"("+value.data[i].checiName+")";*/
								/*+" "+listdata[i].locos[0].locoTypename
								+"-"+listdata[i].locos[0].locoNo*/;
								checiName[checiNameIndex]=value.data[i].checiName;
								/*locoArray[checiNameIndex]=[];*/
								checiNameIndex++;
																	
								/*var lastArrStation;//上一条数据的到站
								var lastArrTime;//上一条数据的到站时间*/
								
								for ( var int1 = 0; int1 < listdata.length; int1++) {//  一个车次下面有很多条数据
										
										/*locoArray[checiNameIndex-1][int1]=[];
										locoArray[checiNameIndex-1][int1][0]=listdata[int1].locoTypename;
										locoArray[checiNameIndex-1][int1][1]=listdata[int1].locoTypeid;
										locoArray[checiNameIndex-1][int1][2]=listdata[int1].locoNo;
										locoArray[checiNameIndex-1][int1][3]=listdata[int1].locoAb;*/
										var chezhanName =listdata[int1].stationName;//出发站
										
										var chezhanSTime =listdata[int1].staTime;//出发站发车时间
										
										var chezhanATime =listdata[int1].arrTime;//出发站到达时间
																				
										/*if(lastArrStation&&lastArrStation==chezhanName){
											chezhanATime=lastArrTime;//遍历到下一条时将上一条的目的站的到站时间设为当前发站的到站时间
										}
										lastArrStation=listdata[int1].arrstation;//存储当前到站
										lastArrTime=listdata[int1].arrtime;//存储当前到站时间*/
										
										//新加判断前一条数据的
									
										for ( var int2 = 0; int2 < 2; int2++) {
											if (int2%2==0) {
												time[timeIndex]=chezhanATime.substring(chezhanATime.indexOf(":")+1,chezhanATime.length);
											}else {
												time[timeIndex]=chezhanSTime.substring(chezhanSTime.indexOf(":")+1,chezhanSTime.length);;
											}
											timeIndex++;
										}
										
										var yvalue=0;//车站对应的数字值
										for ( var int3 = 0; int3 < cheZhanDate.length; int3++) {
											if (cheZhanDate[int3]==chezhanName) {
												yvalue=int3;
												break;
											}
										}
										
										for ( var int3 =0; int3 <2; int3++) {
							    			var xy = new Object(); 
							    			if (int3==0) {
							    				xy.x =chezhanATime+""; 
							    				xy.y =yvalue; //车站对应的数字
							    				xy.z=0;		//实际
											}else {
							    				xy.x =chezhanSTime+""; 
							    				xy.y =yvalue; //车站对应的数字
							    				xy.z=0;
											}
							    			dataArray2[index2]=xy;
											index2++;
										}
									}
								dataObj[dataIndex]=dataArray2;
								dataIndex++;
								timeArray[timeArrIndex]=time;
								timeArrIndex++;
							});
							
							//转化
							 var json = JSON.stringify(dataObj);
		    				 var data2=JSON.parse(json); 
		    				 
		    				lineName =$.trim(lineName);
		    				if ("请选择线路"!=lineName) {
		    					$("#checiSelect option[value!='']").remove();
	    						RTU.invoke("app.checiselect.init",checiName);	
		    					document.getElementById("lname").innerHTML=lineName;
		    					
	    						var dataArray=[];
	    						dataArray[0]=data2;//坐标时间
	    						dataArray[1]=cheZhanDate;//车站
	    						dataArray[3]=checiName;//车次
	    						dataArray[5]=timeArray;//运行时间分钟
	    						/*dataArray[7]=locoArray;//车次对应的机车数组
*/	    						RTU.invoke("app.kedu.show.init",dataArray);
		    				};
		    				RTU.invoke("header.msg.hidden");
						}
						else{
							RTU.invoke("header.msg.hidden");
						}
					}
				});
		  			
			  }else if(val=="LkjJH"){
				  $("#viewName").text("机车计划图");
				//计划图数据
				$.ajax({
		    		/*url: "../section/findViewForCheciNew?scId="+id,*/
					url:"../section/findViewForCheciAndTimeNew?scId="+id+"&beginTime="+time01+"&endTime="+time02,
		    		dataType: "jsonp",
		    		type: "GET",
		    		success: function (value) {
		    			if (value && value.data) {
		    				$(value.data).each(function(i){
		    					
		    					/*checiName[checiNameIndex]=value.data[i].checiName;//车次名  待加机车号  简称
*/		    					
		    					/*checiName[checiNameIndex]=listdata[i].locoTypename+"("+value.data[i].checiName+")";*/
		    					/*var listdata=value.data[i].list;// 包括车站名和起止时间
		    					 
*/		    					checiName[checiNameIndex]=value.data[i].checiName;
								
								verCompareArray[checiNameIndex]=value.data[i].locoMotiveList;
		    					var listdata=value.data[i].list;
		    					locoArray[checiNameIndex]=[];
		    					checiNameIndex++;
		    					
		    					var dataArray=[];//存储坐标  x为时间   y 为车站数字  一个车次内
		    					var index=0;//存储坐标 索引
		    					var time=[];
		    					var timeIndex=0;
								var lastArrStation;//上一条数据的到站
								var lastArrTime;//上一条数据的到站时间
								var ob={};
								ob.arrstation=ob.stationName=listdata[0].stationName;
								ob.arrTime=ob.arrtime=ob.staTime=listdata[0].staTime;
								listdata.unshift(ob);
								var arr={};
								arr.arrstation=arr.stationName=listdata[listdata.length-1].arrstation;
								arr.staTime=arr.arrTime=arr.arrtime=listdata[listdata.length-1].arrtime;
								arr.locoTypename=listdata[listdata.length-1].locoTypename;
								arr.locoTypeid=listdata[listdata.length-1].locoTypeid;
								arr.locoNo=listdata[listdata.length-1].locoNo;
								arr.locoAb=listdata[listdata.length-1].locoAb;
								arr.receiveTime=listdata[listdata.length-1].receiveTime;
								arr.planVer=listdata[listdata.length-1].planVer;
								arr.factVer=listdata[listdata.length-1].factVer;
								arr.isAlarm=listdata[listdata.length-1].isAlarm;
								listdata.push(arr);
								
								for ( var int = 1; int < listdata.length; int++) {//  一个车次下面有很多条数据
										
									locoArray[checiNameIndex-1][int]=[];
									locoArray[checiNameIndex-1][int][0]=listdata[int].locoTypename;
									locoArray[checiNameIndex-1][int][1]=listdata[int].locoTypeid;
									locoArray[checiNameIndex-1][int][2]=listdata[int].locoNo;
									locoArray[checiNameIndex-1][int][3]=listdata[int].locoAb;
									locoArray[checiNameIndex-1][int][4]=listdata[int].receiveTime;
									locoArray[checiNameIndex-1][int][5]=listdata[int].planVer;
									locoArray[checiNameIndex-1][int][6]=listdata[int].factVer;
									locoArray[checiNameIndex-1][int][7]=listdata[int].isAlarm;
									var chezhanName =listdata[int].stationName;// 出发站车站名
									
									var chezhanATime =listdata[int-1].arrtime;//出发站到达时间等于前一条信息的目的站到达时间
									var chezhanATime2 =listdata[int-1].arrtime;// 出发站到达时间
									
									var chezhanSTime =listdata[int].staTime;// 出发站发车时间
									var chezhanSTime2 =listdata[int].staTime;// 出发站发车时间
									
									/*if(lastArrStation&&lastArrStation==chezhanName){
										chezhanATime2=chezhanATime=lastArrTime;//遍历到下一条时将上一条的目的站的到站时间设为当前发站的到站时间
									}
									lastArrStation=listdata[int].arrstation;//存储当前目的站
									lastArrTime=listdata[int].arrtime;//存储当前目的站到站时间
*/									
									for ( var int2 = 0; int2 < 2; int2++) {
										if (int2%2==0) {
											time[timeIndex]=chezhanATime.substring(chezhanATime.indexOf(":")+1,chezhanATime.length);
										}else {
											time[timeIndex]=chezhanSTime.substring(chezhanSTime.indexOf(":")+1,chezhanSTime.length);;
										}
										timeIndex++;
									}
									
									/*var chezhanATime3=Number(chezhanATime.substring(0,chezhanATime.indexOf(":")));
									
									chezhanATime=Number(chezhanATime.substring(0,chezhanATime.indexOf(":")));
										
									chezhanSTime=Number(chezhanSTime.substring(0,chezhanSTime.indexOf(":")));
									
									if (chezhanATime>18&&chezhanATime<24) {
										var time1= $("#time").text();	//昨天
										time1=time1.replace("年", "-");
										time1=time1.replace("月", "-");
										time1=time1.replace("日", "-");
										chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
										chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
									
									}else {
										if (chezhanATime==18) {
											var time1= $("#time").text();	//昨天
											time1=time1.replace("年", "-");
											time1=time1.replace("月", "-");
											time1=time1.replace("日", "-");
											chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
											chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
										}else {
											var time1= $("#time2").text();//今天
											time1=time1.replace("年", "-");
											time1=time1.replace("月", "-");
											time1=time1.replace("日", "-");
											chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
											chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
										}
									}
									if (int==0) { 
										if (chezhanATime3==18) {
											var time1= $("#time").text();//昨天
											time1=time1.replace("年", "-");
											time1=time1.replace("月", "-");
											time1=time1.replace("日", "-");
											chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
											chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
										}
									}
									if (chezhanATime3==24||chezhanATime3==00) {//今天
										var time1= $("#time2").text();
										time1=time1.replace("年", "-");
										time1=time1.replace("月", "-");
										time1=time1.replace("日", "-");
										chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
										chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
									}*/
									
									var yvalue=0;//车站对应的数字值
									for ( var int3 = 0; int3 < cheZhanDate.length; int3++) {
										if (cheZhanDate[int3]==chezhanName) {
											yvalue=int3;
											break;
										}
									}
									
						    		for ( var int3 =0; int3 <2; int3++) {
						    			var xy = new Object(); 
						    			if (int3==0) {
						    				xy.x =chezhanATime+""; 
						    				xy.y =yvalue; //车站对应的数字
						    				xy.z=1;			//计划
										}else {
						    				xy.x =chezhanSTime+""; 
						    				xy.y =yvalue; //车站对应的数字
						    				xy.z=1;
										}
						    			dataArray[index]=xy;
										index++;
									}
								}
		    					dataObj[dataIndex]=dataArray;
		    					timeArray[timeArrIndex]=time;
		    					timeArrIndex++;
		    					dataIndex++;
		    					
		    				});
		    				
		    				 var json = JSON.stringify(dataObj);
		    				 var data2=JSON.parse(json); 
		    				 
		    				lineName =$.trim(lineName);
		    				if ("请选择线路"!=lineName) {
		    					$("#checiSelect option[value!='']").remove();
	    						RTU.invoke("app.checiselect.init",checiName);	
		    					document.getElementById("lname").innerHTML=lineName;
		    					
	    						var dataArray=[];
	    						dataArray[0]=data2;//坐标时间
	    						dataArray[1]=cheZhanDate;//车站
	    						dataArray[3]=checiName;//车次
	    						dataArray[5]=timeArray;//运行时间分钟
	    						dataArray[7]=locoArray;//车次对应的机车数组,每一个站对应一个
	    						dataArray[9]=verCompareArray;//车次对应的机车版本比对结果,无重复机车
	    						RTU.invoke("app.kedu.show.init",dataArray);

		    				};
		    				RTU.invoke("header.msg.hidden");
		    			}
		    			else{
							RTU.invoke("header.msg.hidden");
						}
		    		}
		    	});
				
		  		//选择的是融合图	
			  }else if(val=="LkjRH"){
				  $("#viewName").text("机车融合图");
				//实际图的数据
				$.ajax({
					url: "../section/findViewForCheciAndTime?scId="+id+"&beginTime="+time01+"&endTime="+time02,
					dataType: "jsonp",
					type: "GET",
					success: function (value) {
						if(value && value.data){
							$(value.data).each(function(i){
								
								var dataArray2=[];//存储坐标  x为时间   y 为车站数字  一个车次内
								var index2=0;//存储坐标 索引
								var timeIndex=0;
								var time=[];
								
								var listdata=value.data[i].list;// 包括车站名和起止时间
							
								/*checiName[checiNameIndex]=value.data[i].checiName*/
								/*checiName[checiNameIndex]=listdata[i].locoTypename+"("+value.data[i].checiName+")";*/
								/*+" "+listdata[i].locos[0].locoTypename+"-"+listdata[i].locos[0].locoNo*/;
								checiName[checiNameIndex]=value.data[i].checiName;
								/*locoArray[checiNameIndex]=[];*/
								checiNameIndex++;
									
								for ( var int1 =0; int1 < listdata.length; int1++) {//  一个车次下面有很多条数据
									/*locoArray[checiNameIndex-1][int1]=[];
									locoArray[checiNameIndex-1][int1][0]=listdata[int1].locoTypename;
									locoArray[checiNameIndex-1][int1][1]=listdata[int1].locoTypeid;
									locoArray[checiNameIndex-1][int1][2]=listdata[int1].locoNo;
									locoArray[checiNameIndex-1][int1][3]=listdata[int1].locoAb;*/
										var chezhanName =listdata[int1].stationName;// 发车站
										
										var chezhanATime =listdata[int1].arrTime;//发车站到达时间
										
										var chezhanSTime =listdata[int1].staTime;//发车站发车时间
									
										for ( var int2 = 0; int2 < 2; int2++) {
											if (int2%2==0) {
												time[timeIndex]=chezhanATime.substring(chezhanATime.indexOf(":")+1,chezhanATime.length);
											}else {
												time[timeIndex]=chezhanSTime.substring(chezhanSTime.indexOf(":")+1,chezhanSTime.length);
											}
											timeIndex++;
										}
										
										var yvalue=0;//车站对应的数字值
										for ( var int3 = 0; int3 < cheZhanDate.length; int3++) {
											if (cheZhanDate[int3]==chezhanName) {
												yvalue=int3;
												break;
											}
										}
										
										for ( var int3 =0; int3 <2; int3++) {
							    			var xy = new Object(); 
							    			if (int3==0) {
							    				xy.x =chezhanATime+""; 
							    				xy.y =yvalue; //车站对应的数字
							    				xy.z=0;		//实际
											}else {
							    				xy.x =chezhanSTime+""; 
							    				xy.y =yvalue; //车站对应的数字
							    				xy.z=0;
											}
							    			dataArray2[index2]=xy;
											index2++;
										}
									}
								dataObj[dataIndex]=dataArray2;
								dataIndex++;
								timeArray[timeArrIndex]=time;
								timeArrIndex++;
							});
						}
						
						//计划图数据
							$.ajax({
					    		/*url: "../section/findViewForCheciNew?scId="+id,*/
								url:"../section/findViewForCheciAndTimeNew?scId="+id+"&beginTime="+time01+"&endTime="+time02,
					    		dataType: "jsonp",
					    		type: "GET",
					    		success: function (value) {
					    			if (value && value.data) {
					    				$(value.data).each(function(i){
					    					
					    					/*checiName[checiNameIndex]=value.data[i].checiName;//车次名  待加机车号  简称
*/					    					
					    					/*checiName[checiNameIndex]=listdata[i].locoTypename+"("+value.data[i].checiName+")";*/
					    					checiName[checiNameIndex]=value.data[i].checiName;
					    					
					    					locoArray[checiNameIndex]=[];
					    					verCompareArray[checiNameIndex]=value.data[i].locoMotiveList;
					    					var listdata=value.data[i].list;// 包括车站名和起止时间
					    					checiNameIndex++;
					    					
					    					var dataArray=[];//存储坐标  x为时间   y 为车站数字  一个车次内
					    					var index=0;//存储坐标 索引
					    					var time=[];
					    					var timeIndex=0;
											var lastArrStation;//上一条数据的到站
											var lastArrTime;//上一条数据的到站时间
											var ob={};
											ob.arrstation=ob.stationName=listdata[0].stationName;
											ob.arrTime=ob.arrtime=ob.staTime=listdata[0].staTime;
											listdata.unshift(ob);
											var arr={};
											arr.arrstation=arr.stationName=listdata[listdata.length-1].arrstation;
											arr.staTime=arr.arrTime=arr.arrtime=listdata[listdata.length-1].arrtime;
											arr.locoTypename=listdata[listdata.length-1].locoTypename;
											arr.locoTypeid=listdata[listdata.length-1].locoTypeid;
											arr.locoNo=listdata[listdata.length-1].locoNo;
											arr.locoAb=listdata[listdata.length-1].locoAb;
											arr.receiveTime=listdata[listdata.length-1].receiveTime;
											arr.planVer=listdata[listdata.length-1].planVer;
											arr.factVer=listdata[listdata.length-1].factVer;
											arr.isAlarm=listdata[listdata.length-1].isAlarm;
											listdata.push(arr);
											for ( var int = 1; int < listdata.length; int++) {//  一个车次下面有很多条数据
												locoArray[checiNameIndex-1][int]=[];
												locoArray[checiNameIndex-1][int][0]=listdata[int].locoTypename;
												locoArray[checiNameIndex-1][int][1]=listdata[int].locoTypeid;
												locoArray[checiNameIndex-1][int][2]=listdata[int].locoNo;
												locoArray[checiNameIndex-1][int][3]=listdata[int].locoAb;
												locoArray[checiNameIndex-1][int][4]=listdata[int].receiveTime;
												locoArray[checiNameIndex-1][int][5]=listdata[int].planVer;
												locoArray[checiNameIndex-1][int][6]=listdata[int].factVer;
												locoArray[checiNameIndex-1][int][7]=listdata[int].isAlarm;
												var chezhanName =listdata[int].stationName;// 出发站车站名
												
												var chezhanATime =listdata[int-1].arrtime;//出发站到达时间等于前一条信息的目的站到达时间
												var chezhanATime2 =listdata[int-1].arrtime;// 出发站到达时间
												
												var chezhanSTime =listdata[int].staTime;// 出发站发车时间
												var chezhanSTime2 =listdata[int].staTime;// 出发站发车时间
												
												if(lastArrStation&&lastArrStation==chezhanName){
													chezhanATime2=chezhanATime=lastArrTime;//遍历到下一条时将上一条的目的站的到站时间设为当前发站的到站时间
												}
												lastArrStation=listdata[int].arrstation;//存储当前目的站
												lastArrTime=listdata[int].arrtime;//存储当前目的站到站时间
												
												for ( var int2 = 0; int2 < 2; int2++) {
													if (int2%2==0) {
														time[timeIndex]=chezhanATime.substring(chezhanATime.indexOf(":")+1,chezhanATime.length);
													}else {
														time[timeIndex]=chezhanSTime.substring(chezhanSTime.indexOf(":")+1,chezhanSTime.length);;
													}
													timeIndex++;
												}
												
												/*var chezhanATime3=Number(chezhanATime.substring(0,chezhanATime.indexOf(":")));
												
												chezhanATime=Number(chezhanATime.substring(0,chezhanATime.indexOf(":")));
													
												chezhanSTime=Number(chezhanSTime.substring(0,chezhanSTime.indexOf(":")));
												
												if (chezhanATime>18&&chezhanATime<24) {
													var time1= $("#time").text();	//昨天
													time1=time1.replace("年", "-");
													time1=time1.replace("月", "-");
													time1=time1.replace("日", "-");
													chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
													chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
												
												}else {
													if (chezhanATime==18) {
														var time1= $("#time").text();	//昨天
														time1=time1.replace("年", "-");
														time1=time1.replace("月", "-");
														time1=time1.replace("日", "-");
														chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
														chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
													}else {
														var time1= $("#time2").text();//今天
														time1=time1.replace("年", "-");
														time1=time1.replace("月", "-");
														time1=time1.replace("日", "-");
														chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
														chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
													}
												}
												if (int==0) { 
													if (chezhanATime3==18) {
														var time1= $("#time").text();//昨天
														time1=time1.replace("年", "-");
														time1=time1.replace("月", "-");
														time1=time1.replace("日", "-");
														chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
														chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
													}
												}
												if (chezhanATime3==24||chezhanATime3==00) {//今天
													var time1= $("#time2").text();
													time1=time1.replace("年", "-");
													time1=time1.replace("月", "-");
													time1=time1.replace("日", "-");
													chezhanATime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanATime2;
													chezhanSTime=time1.substring(0,time1.lastIndexOf("-"))+" "+chezhanSTime2;
												}*/
												
												var yvalue=0;//车站对应的数字值
												for ( var int3 = 0; int3 < cheZhanDate.length; int3++) {
													if (cheZhanDate[int3]==chezhanName) {
														yvalue=int3;
														break;
													}
												}
												
									    		for ( var int3 =0; int3 <2; int3++) {
									    			var xy = new Object(); 
									    			if (int3==0) {
									    				xy.x =chezhanATime+""; 
									    				xy.y =yvalue; //车站对应的数字
									    				xy.z=1;			//计划
													}else {
									    				xy.x =chezhanSTime+""; 
									    				xy.y =yvalue; //车站对应的数字
									    				xy.z=1;
													}
									    			dataArray[index]=xy;
													index++;
												}
											}
					    					dataObj[dataIndex]=dataArray;
					    					timeArray[timeArrIndex]=time;
					    					timeArrIndex++;
					    					dataIndex++;
					    					
					    				});
					    				
					    				 var json = JSON.stringify(dataObj);
					    				 var data2=JSON.parse(json); 
					    				 
					    				lineName =$.trim(lineName);
					    				if ("请选择线路"!=lineName) {
					    					$("#checiSelect option[value!='']").remove();
					    					RTU.invoke("app.checiselect.init",checiName);
					    					document.getElementById("lname").innerHTML=lineName;
					    					
				    						var dataArray=[];
				    						dataArray[0]=data2;//坐标时间
				    						dataArray[1]=cheZhanDate;//车站
				    						dataArray[3]=checiName;//车次
				    						dataArray[5]=timeArray;//运行时间分钟
				    						dataArray[7]=locoArray;//车次对应的机车,每一个车站对应一个机车,有重复信息
				    						dataArray[9]=verCompareArray;//车次对应机车版本比对信息,无重复机车信息
				    						RTU.invoke("app.kedu.show.init",dataArray);
					    				};
					    				RTU.invoke("header.msg.hidden");
					    			}
					    			else{
										RTU.invoke("header.msg.hidden");
									}
					    		}
					    	});
						}
					});
			  		}
			  		
		  });
	    	};
    });
   
    RTU.register("app.checiselect.init", function () {
    	return function(data){
    		for(var i=0;i<data.length;i++){
    			if($("#checiSelect").find("option[id='"+data[i]+"']").length>0)continue;
				//生成下拉选择列表
				$opt =$("<option id='"+data[i]+"'>"+data[i]+"</option>");
	 			$("#checiSelect").append($opt);
    		}
    	};
    });
    
   //选择区段
    RTU.register("app.option_lineName.init", function () {
    	return function selectLineName() {
    		  $("#turnoverreality_lineName").change(function(){
    			  $("input[name='model']:checked").click();
    		  });
    	    };
    });
    
    //var parseDate = d3.time.format("%H:%M").parse;
   /* var colors = [//颜色
                  'steelblue',
                  'red'
                  ];*/
    //日期格式
    var parseDate = d3.time.format("%Y-%m-%d %H:%M").parse;
    //保存当前Hm
    var timeRed="";
    
    //画图方法
    RTU.register("app.kedu.show.init", function () {
    	function GetDateStr3(AddDayCount) {//获取日期
    		var dd = new Date();
    		dd.setDate(dd.getDate()+AddDayCount);
    		var Y = dd.getFullYear();
    		var M = dd.getMonth()+1;
    		var D = dd.getDate();
    		var H = dd.getHours(); 
        	var m = dd.getMinutes(); 
    		return Y+"-"+M+"-"+D+" "+H+":"+m;
    	}
       return function divshow(dataArray){
    	   
    	  var data=dataArray[0];//坐标时间
    	  var chezhan =dataArray[1];//车站
    	  
    	   
    	  //获取弹框的宽高
        var w =$("#tankuang").width();
        var h = $("#tankuang").height()-65;
	    
	    var width2 = w;
	    var height2 =h*0.85;
	    //设置宽高  外边距
	    var margin = {top: 25, right:100, bottom: 30, left:100},
	        width = width2 - margin.left - margin.right,
	        height = height2 - margin.top - margin.bottom;

	    //把data中的时间格式化
	    for (var int = 0; int < data.length; int++) {
	    	for (var j = 0; j <data[int].length; j++) {
	    		if ((data[int][j].x+"").length<17) {//只能一次   格式化后的长度大于17
  	    			data[int][j].x=parseDate(data[int][j].x);
  	    		}
	    	}
	    }
	    
	    //车站数组  索引
	    var chezhanNumber=[];	
	    for ( var int2 = 0; int2 < chezhan.length; int2++) {
	    	chezhanNumber[int2]=int2;
	    }
	    
	    var time1= $("#time").text();
		time1=time1.replace("年", "-");
		time1=time1.replace("月", "-");
		time1=time1.replace("日", "-");
		time1=time1.substring(0,time1.lastIndexOf("-"))+" 18:00";
		
		var time2= $("#time2").text();
		time2=time2.replace("年", "-");
		time2=time2.replace("月", "-");
		time2=time2.replace("日", "-");
		time2=time2.substring(0,time2.lastIndexOf("-"))+" 18:00";
	    
	    var jsonTime ={
	  	    	"xDate": [
	  	    		{
	  	    		    "time":time1,//坐标开始日期
	  	    		    "num":0
	  	    		},
	  	    		{
	  	    		    "time":time2,//坐标结束日期
	  	    		    "num":chezhanNumber.length-1
	  	    		}
	  	    	]
	  	    };
	    
	    //x 轴 
	    var x = d3.time.scale()
	    .range([0, width]);
	    x.domain(d3.extent(jsonTime.xDate, function(d){
	    	return parseDate(d.time);
	    }));
	    
	    var myDate = new Date();
	    var Y=myDate.getFullYear();    //获取完整的年份(4位,1970-????)
	    var M=myDate.getMonth()+1;       //获取当前月份(0-11,0代表1月)
	    var D=myDate.getDate();        //获取当前日(1-31)
	    var H=myDate.getHours();       //获取当前小时数(0-23)
	    var m=myDate.getMinutes();     //获取当前分钟数(0-59)
	    
	   var t=Y+"-"+M+"-"+D+" "+17+":"+50;
	    
	    var dateT=parseDate(t);
	    
//	    console.log(dateT);
	    
	    //生成时间轴数组
	    var dataTimeArray=[];
  	    var h=18;
  	    var count=0;
  	    var t1=time1.substring(0,time1.indexOf(" "));
  	    var t2="";
  	    var falg=true;
	    for ( var int = 0; int < 24; int++) {
	    	var m=0;
			if (h==24) {
				h=0;
				t1=time2.substring(0,time2.indexOf(" "));
			}
			for ( var int2 = 0; int2 <6; int2++) {  //每小时分6格
				t2=t1+" "+h+":"+m+"0";
				m++;
				if (m==6) {
					m=0;
				}
				if (falg) {
					var dat=new Date();
					
					var time =GetDateStr3(0);
					timeRed=time.substring(time.lastIndexOf(" ")+1,time.length);//截取HM
					var timeRed01 =timeRed.substring(0,timeRed.indexOf(":"));//小时
		        	var timeRed02=timeRed.substring(timeRed.indexOf(":")+1,timeRed.length);//分
					if (dat<parseDate(t2)) {
						dataTimeArray[count]=parseDate(time);//把当前时间存入数组中  红色显示用
						count++;
						falg=false;
					}
					if(parseDate(t2).getTime()==dateT.getTime()){
						if(timeRed01==17){
							
							if(timeRed02>50){
								dataTimeArray[count]=parseDate(time);//把当前时间存入数组中  红色显示用
								count++;
								falg=false;
							}
						}
					}
						
//					console.log(parseDate(t2).getTime()==dateT.getTime());
				}
				dataTimeArray[count]=parseDate(t2);
				count++;
			}
			h++;
		}
  	    dataTimeArray[count]=parseDate(time2);
  	    
  	    
//  	    console.log(dataTimeArray);

	    var xAxis = d3.svg.axis()
	    .scale(x)
	    //.ticks(80)//刻度格数
	    .tickValues(dataTimeArray)//设置时间值
	     .tickPadding(15)//刻度线与刻度标注之间的填充
	    .orient("bottom")	//刻度标注方向  默认向下
	    .tickSize(-height);

	     
	    //y 轴
	    var y = d3.scale.linear()
	    .range([height, 0]);//画图的高度
	    y.domain([0, d3.max(jsonTime.xDate, function(d){
	        return d.num;
	      })]);
	 
	    var yAxis = d3.svg.axis()//新建一个默认的坐标轴。
	        .scale(y)
	        .ticks(9)//刻度格数        与车站一致  传参
	    	//.tickPadding(10)//刻度线与刻度标注之间的填充
	    	.tickValues(chezhanNumber)
	    	.tickSize(-width)//若指定内部和外侧刻度线的长度，则设置之；若无指定，则返回当前内部刻度线的长度，默认为6（6px）。
	    	.tickSubdivide(false)	
	        .orient("left");//刻度标注方向

	    var zoom = d3.behavior.zoom()
	        .x(x)
	        .y(y)
	        .scaleExtent([1,25])//scaleExtent 用于设置最小和最大的缩放比例
	        .on("zoom", zoomed);	//控制左右移动   当 zoom 事件发生时，调用 zoomed 函数
	    
	    $("#myCanvas").empty();//清除
	    
	    //创建一个SVG容器
	    var svg = d3.select("#myCanvas").append("svg")
	    	.call(zoom)
	        .attr("width", width + margin.left + margin.right)
	        .attr("height", height + margin.top + margin.bottom)
	    	.append("g")
	        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	     
	    svg.append("g")
	        .attr("class", "x axis")
	        .attr("id","xzhou")
	        .attr("transform", "translate(0," + height + ")")
	        .call(xAxis);
	     
	    svg.append("g")
	        .attr("class", "y axis")
	        .attr("id","yzhou")
	        .call(yAxis);
	     
	    svg.append("clipPath")
	    	.attr("id", "clip")
	    	.append("rect")
	    	.attr("width", width)
	    	.attr("height", height);
	    
	    //折线线
	    var line = d3.svg.line()
	        .interpolate("linear")	
	        .x(function(d) { 
	        	
	        		return x(d.x);
	        })
	        .y(function(d) { 
	        		return y(d.y);
	        });		
	    	
	    svg.selectAll('.line')
	  	.data(data)
	  	.enter()
	  	.append("path")
	    .attr("class", "line")
	  	.attr("clip-path", "url(#clip)")
	  	.attr('stroke', function(d,i){ //有几条数据就运行几次  		
	  		var falg=false;
	  		for (var int =0; int < d.length; int++) {
				if (d[int].z==0) {// z 为0表示是实际运行
					falg=true;
				}
			}
	  		if (falg) {  //对 实际运行的线  设置属性 
	  			 d3.select(this)  
	  			 .attr("biaoji","shiJiLineName")
	  	      	 .attr("class", "shiji");
	  			return "blue";
			}else {		//对 计划运行的线  设置属性 
				var verCompareArray=dataArray[9][i];
				var errorFlag=false;
				for(var n=0;n<verCompareArray.length;n++){
					if(!verCompareArray[n].isAlarm)continue;
					else{
						errorFlag=true;
						break;
					}
				}
				if(errorFlag){
					d3.select(this)  
					 .attr("biaoji","JiHualineName")
			      	 .attr("class", "jihua_error")
			      	 .attr("checi",dataArray[3][i])
			      	 .attr("isAlarm","").attr("index",i);	
					return "red";
				}
				else{
					d3.select(this)  
					 .attr("biaoji","JiHualineName")
			      	 .attr("class", "jihua")
			      	 .attr("checi",dataArray[3][i]).attr("index",i);
					return "blue";
				}
			}
	  		// 以 z值来判断显示颜色  是计划   还是实际    保存数据的时候已经做好标记
	  	})
	    .attr("d", line)
	    .on("click",function(e){ //对所有的折线设置事件
	    	$("#content-locomotiveturnoverrealitymap-vercompareDiv").hide();
	    	var $path=$("path");   // 在改变样式之前还原所有的线样式
			$path.each(function(i){
				var name =$(this).attr("biaoji");
				if (name=="shiJiLineName") {
				d3.select(this)  
					.attr("class", "shiji");
				
			}else if(name=="JiHualineName"){
				
				if(d3.select(this).attr("isAlarm")!=undefined){
					d3.select(this)  
					.attr("class", "jihua_error");
				}
				else{
					d3.select(this)  
					.attr("class", "jihua");
				}
			}
			});
			
	    	d3.select(this)  
	  		.attr("class", "line2");//给当前选中的线路改变样式
	    	var curIndex=d3.select(this).attr("index");
	    	if(curIndex){
		    	var verCompareResult=dataArray[9][curIndex];
				$("#content-locomotiveturnoverrealitymap-vercompareDiv").remove();
				var msg="<div id='content-locomotiveturnoverrealitymap-vercompareDiv' " +
						"style='z-index:999999;position:absolute;width:600px;height:60px;left:25%;top:50%'>" +
						"<table class='commom-table-header'><thead><tr><td>车次</td><td>机车</td>" +
						"<td>计划版本</td><td>当前版本</td><td>是否允许派车</td><td>最新比对时间</td></tr></thead><tbody>";
				for(var m=0;m<verCompareResult.length;m++){
					msg+="<tr><td>"+
					dataArray[3][curIndex]+"</td><td>"+verCompareResult[m].locoTypename+"</td><td>"+verCompareResult[m].planVer
					+"</td><td>"+verCompareResult[m].factVer+"</td><td"
					+(verCompareResult[m].isAlarm?" style='background-color:#FFB399'":"")+">"
					+(verCompareResult[m].isAlarm?"不允许":"允许")
					+"</td><td>"+verCompareResult[m].receiveTime+"</td></tr>";
				}
				msg+="</tbody></table></div>";
				$("#myCanvas").append($(msg));
	    	}

	    	d3.event.stopPropagation();//让事件独立
	    	
	     })
	    .on("mouseover",function(){  
	      	
	    })
	  	.on("mouseout",function(d,i){ 
	  		
	  	})
	  	.on("dblclick",function(d,i){});

	    	//圆点
	    var points = svg.selectAll('.dots')
	    	.data(data)
	    	.enter()
	    	.append("g")
	        .attr("class", "dots")
	    	.attr("clip-path", "url(#clip)");	
	     
	    
	    	points.selectAll('.dot')
	    	.data(function(d, index){ 		
	    		var a = [];
	    		d.forEach(function(point,i){
	    			a.push({'index': index, 'point': point});
	    		});		
	    		return a;
	    	})
	    	.enter()
	    	.append('circle')
	    	.attr('class','dot')
	    	.attr("r", 2.5)
	    	.attr('fill', function(d,i){ 	
	    		//return colors[d.index%colors.length];  #7CCD7C
	    		return "#32CD32";
	    	})	
	    	.attr("transform", function(d) { 
	    		return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
	    	);
		    dataArray[2]=svg;
		    dataArray[4]=-1;
		    RTU.invoke("app.clickAlterStyle");//单击改变样式
		    RTU.invoke("app.yzhouAlterStyle.init");//y轴样式改变
		    RTU.invoke("app.showLeftTitle.init",dataArray);//执行显示车站和车次
		    RTU.invoke("app.setRedTimeLine.init");//当前时间y轴变红色
		    RTU.invoke("app.getXYZhouShow");//获取边框的值
		    
		    //x 轴样式改变
		    var $va =$("#yzhou").find("g");
			$va.each(function(i){
				if (i%2==0) {//样式改变
					$(this).find("line").each(function(){
						d3.select(this)  
						.attr("class", "lineWidth");
					});
				}
			});
		
		
		    //对折线放大缩小 和左右移动有关
		    function zoomed() {
		    	svg.select(".x.axis").call(xAxis);
		    	svg.select(".y.axis").call(yAxis);   
		    	
		    	svg.selectAll('path').attr('d', line);  
	  	    	//svg.selectAll('path.jihua').attr('d', line);  
		     
		    	dataArray[4]=1;
		    	
		    	RTU.invoke("app.clickAlterStyle");//单击改变样式
		    	RTU.invoke("app.yzhouAlterStyle.init");//y轴样式改变
		    	RTU.invoke("app.showLeftTitle.init",dataArray);//车站的显示  车次  时间
		    	RTU.invoke("app.setRedTimeLine.init");//当前时间y轴变红色
		    	RTU.invoke("app.setXYZhou");//设置边框的值
		    	
		    	points.selectAll('circle').attr("transform", function(d) { 
		    		return "translate(" + x(d.point.x) + "," + y(d.point.y) + ")"; }
		    	);  
		    }
    	};
    });
    
/*    var verAlarmPopuwnd;
    //机车版本报警展示
    RTU.register("app.locomotiveturnoverrealitymap.locoveralarm.activate", function () {
        return function (data) {
        	RTU.invoke("core.router.load", {
                url: "../app/modules/locomotiveturnoverrealitymap/app-locomotiveturnoverrealitymap-veralarminfo.html",
                success: function (html) {                    
                    var width = document.documentElement.clientWidth*0.2;
                    var height =document.documentElement.clientHeight*0.2;
                    if (!verAlarmPopuwnd) {
                    	verAlarmPopuwnd = new PopuWnd({
                            title: "机车版本比对详细信息",
                            html: html,
                            width: width,
                            height:height,
                            left: 135,
                            top: 60,
                            shadow: true,
                            removable: true,  //设置弹出窗口是否可拖动
                            deletable: true	  //设置是否显示弹出窗口的关闭按钮
                        });
                    	verAlarmPopuwnd.remove = verAlarmPopuwnd.close;
                    	verAlarmPopuwnd.close = verAlarmPopuwnd.hidden;
                    	verAlarmPopuwnd.init();
                    } else {
                    	verAlarmPopuwnd.init();
                    }
                }
            });

        };
    });*/
    
    var valueX=0;
    var valueY=0;
    //获取边框的值
    RTU.register("app.getXYZhouShow", function () {
	    return function getXYZhouShow(){
	    	var $va =$("#xzhou").find("path");
	     	$va.each(function(i){
	     		 valueX=$(this).attr("d");
	     	});
	     	var $va =$("#yzhou").find("path");
	     	$va.each(function(i){
	     		valueY=$(this).attr("d");
	     	});
	    };
    });
    
    //设置边框的值
    RTU.register("app.setXYZhou", function () {
	    return function setXYZhou(){
	    	 var $va =$("#xzhou").find("path");
	       	$va.each(function(i){
	       		$(this).attr("d",valueX);
	       	});
	      	 
	       	var $va =$("#yzhou").find("path");
	       	$va.each(function(i){
	       		$(this).attr("d",valueY);
	       	});
	    };
    });
    
    
    //单击改变样式
    RTU.register("app.clickAlterStyle", function () {
	    return function clickAlterStyle(){
	   	 $("#myCanvas").unbind().bind('click', function() {
	   		$("#content-locomotiveturnoverrealitymap-vercompareDiv").hide();
	 			var $path=$("path");
	 			$path.each(function(i){
	 				var name =$(this).attr("biaoji");
	 				if (name=="shiJiLineName") {
						d3.select(this)  
	 					.attr("class", "shiji");
					}else if(name=="JiHualineName"){
						if(d3.select(this).attr("isAlarm")!=undefined){
							d3.select(this)  
		 					.attr("class", "jihua_error");
						}
						else d3.select(this)  
	 					.attr("class", "jihua");
					}
	 			});
	 			
	 		});
	    };
    });
    
  //当前时间y轴变红色
    RTU.register("app.setRedTimeLine.init", function () {
    	
	    return function setRedTimeLine(){
	    	var $va =$("#xzhou").find("g");
        	var index=0;
        	var timeRed01 =timeRed.substring(0,timeRed.indexOf(":"));//小时
        	var timeRed02=timeRed.substring(timeRed.indexOf(":")+1,timeRed.length);//分
        	
        	var myDate = new Date();
    		var h =myDate.getHours();       //获取当前小时数(0-23)
    		var m=myDate.getMinutes();     //获取当前分钟数(0-59)
    		
    		if(timeRed==null||timeRed=="")
    			timeRed02=m;
    		
//    		console.log(timeRed);
        	
        	$va.each(function(i){
        		$th=$(this);
        		var xtext =$(this).find("text");
        		xtext.each(function(){
        			xtext=$(this).text();//h
//        			console.log(xtext);
        			if (timeRed01.length==1) {
						timeRed01="0"+timeRed01;
					}
        			if (timeRed02.length==1) {
						timeRed02="0"+timeRed02;
					}
    				if (timeRed01==xtext&&timeRed01<=18) {
    					if (timeRed02==0) {//整点钟
    						index=i;
    					}else if(timeRed02==10){
    						index=i+1;
    					}else if(timeRed02==20){
    						index=i+2;
    					}else if(timeRed02==30){
    						index=i+3;
    					}else if(timeRed02==40){
    						index=i+4;
    					}else if(timeRed02==50){
    						index=i+5;
    					}else if(timeRed02>0&&timeRed02<10){//分钟间隔
    						index=i+1;
    					}else if(timeRed02>10&&timeRed02<20){
    						index=i+2;
    					}else if(timeRed02>20&&timeRed02<30){
    						index=i+3;
    					}else if(timeRed02>30&&timeRed02<40){
    						index=i+4;
    					}else if(timeRed02>40&&timeRed02<50){
    						index=i+5;
    					}else if(timeRed02>50&&timeRed02<60){
    						index=i+6;
    					}
//    					console.log(h+"----"+i+"-----"+timeRed02);
    				}
				});
        		
        		if (i==index&&i!=0&&h<18) {
        			$th.find("line").each(function(){
    					d3.select(this)  
    					.attr("class", "lineWidth3")
    					.attr("style","stroke:rgb(255,0,0)")
    					.attr("redStyle", "redLine");;
    				});
				}
        	});
	    };
    });
  
    //y轴样式改变
    RTU.register("app.yzhouAlterStyle.init", function () {
        return	function yzhouAlterStyle(){
        	$(".lineWidth2").each(function(i){
        		d3.select(this)  
        		.attr("class", "lineWidth1");
        	});
        	var $va =$("#xzhou").find("g");
        	$va.each(function(i){
        		$th=$(this);
        		var xtext =$(this).find("text");
        		xtext.each(function(){
        			xtext=$(this).text();
        			var indexvalue =xtext.substring(0,2);
        			if (xtext.indexOf("PM")>-1||xtext.indexOf("AM")>1) {
        				$th.find("line").each(function(){
        					d3.select(this)  
        					.attr("class", "lineWidth2");
        				});
        			}
        			else {
        				if (isNaN(indexvalue)) {
						}else {
							$(this).text("");
						}
        			}
        			if(isNaN(indexvalue)){   //isNaN()非数字    
        				$th.find("line").each(function(){
        					d3.select(this)  
        					.attr("class", "lineWidth2");
        				});
        			}
				});
        	});
        };
    });
    
    //初始化显示时
    var maxHeight=-1;//记录最大的高度
    var maxWidth=-1;//记录最大的宽度
    
    //显示车站 和  车次数据
    RTU.register("app.showLeftTitle.init", function () {
        return	function showLeftTitle(dataArray){//放大缩小时左右车站显示
        	var w =$("#tankuang").width();
        	var svg=dataArray[2];
 	    //设置宽高  外边
 	    var margin = {top: 25, right:100, bottom: 30, left: 100},
 	        width = w - margin.left - margin.right;
        	$(".left-titie").empty();
    	    	var $va =$("#yzhou").find("g");// y 轴下所有g标签
    	    	
    	    	$va.each(function(i){
    	    		var height =$(this).attr("transform");
    	    		height=Number(height.substring((height.lastIndexOf(",")+1),(height.length-1)));
    	    		if(maxHeight<0){
    	    			if (i==0) {
    	    				maxHeight=height;//记录最大高度
    	    			}
    	    		}
    	    		//上下移动不符合的删除
    	    		if (height>maxHeight) {//当前高度大于最大高度的删除不显示  下面最大
						$(this).remove();
					}else if(height<0) {//小于0的也不显示   上面开始0
						$(this).remove();
					}
    	    		
    	    	});
    	    	
    	    	$va.each(function(i){
    	    		var height =$(this).attr("transform");
    	    		height=height.substring((height.lastIndexOf(",")+1),(height.length-1));
    	    		$(this).find("text").remove();//删除车站数字的显示
    	    		if (height>maxHeight||height<0) {
					}else{
	    	    		svg.append("g")
	    	    		.attr("class","left-titie")
	    	    		.append("text")
	    	    		.attr("class", "axis-label")
	    	    		.attr("text-anchor","end")//字体右对齐
	    	    		.attr("x",-8)
	    	    		.attr("y",height+10)
	    	    		.text(dataArray[1][i]);	// 当前线路上的车站  左边显示
	    	    		
	    	    		svg.append("g")
	    	    		.attr("class","left-titie")
	    	    		.append("text")
	    	    		.attr("class", "axis-label")
	    	    		.attr("x",width+8)
	    	    		.attr("y",height+10)
	    	    		.text(dataArray[1][i]);	// 当前线路上的车站   右边显示
					}
    	    		
    	    	});
    	 	   
    	    	
    	    	var $va =$("#xzhou").find("g"); // x轴下所有g标签
    	    	
    	    	var index=0;
    	    	$va.each(function(i){
    	    		index=i;//获取最大索引值值
    	    	});
    	    	
    	    	$va.each(function(i){
    	    		var xwidth =$(this).attr("transform");
    	    		xwidth=Number(xwidth.substring(10,(xwidth.lastIndexOf(","))));
    	    			if (xwidth<0) {			//左边开始0    超过左边删除不显示
    	    				$(this).remove();
						}
    	    			if (maxWidth<0) {		//只赋值一次
    	    				if (i==index) {		//最后一个值 
    	    					maxWidth=xwidth;//记录最大宽度
    	    				}
						}
    	    			if (dataArray[4]>0) {	//在左右移运的情况下才删除超过最大的宽度的轴
    	    				if (xwidth>maxWidth) {
    	    					$(this).remove();
    	    				}
						}
    	    	});
    	    	
    	    	//时间处理后显示   默认是以 AM  PM 显示
    	    	$va.each(function(i){
    	    		var xwidth =$(this).attr("transform");
    	    		var xtext =$(this).find("text");
    	    			xtext.each(function(){
    	    			xtext=$(this).text();
    	    			var time =xtext.substring(0,2);
    	        		xwidth=xwidth.substring(10,(xwidth.lastIndexOf(",")));
    	        		if (xwidth<0) {	// 左右在规定范围内显示
    	    				$(this).remove();
						}else {
							if (xwidth<(maxWidth+5)) {
								if (xtext.indexOf("PM")>-1) {
									if (time=="01") {
										time=13;
									}else if (time=="02") {
										time=14;
									}else if (time=="03") {
										time=15;
									}else if (time=="04") {
										time=16;
									}else if (time=="05") {
										time=17;
									}else if (time=="06") {
										time="18";
									}else if (time=="07") {
										time=19;
									}else if (time=="08") {
										time=20;
									}else if (time=="09") {
										time=21;
									}else if (time=="10") {
										time=22;
									}else if (time=="11") {
										time=23;
									}
									svg.append("g")
									.attr("class","left-titie")
									.append("text")
									.attr("class", "axis-label")
									.attr("x",xwidth-5)
									.attr("y",-10)
									.text(time);// 上面时间显示示
									$(this).text(time);//下面时间显示
									
								}else if (xtext.indexOf("AM")>-1) {
									svg.append("g")
									.attr("class","left-titie")
									.append("text")
									.attr("class", "axis-label")
									.attr("x",xwidth-5)
									.attr("y",-10)
									.text(time);// 时间
									$(this).text(time);
								}else if(isNaN(xtext)){  //非数字是零晨
									svg.append("g")
	    	    					.attr("class","left-titie")
	    	    					.append("text")
	    	    					.attr("class", "axis-label")
	    	    					.attr("x",xwidth-5)
	    	    					.attr("y",-10)
	    	    					.text("00");// 时间
	    	    					$(this).text("00");
								}
							}
						}
    	    		});
    	    	});
    	    	
    	    	
    	    	//车次和运行时间的分钟数显示
    	    	var cheziNameArray =dataArray[3];
    	    	var timeArray2=dataArray[5];
    	    	var locoArray=dataArray[9];
    	    	
    	    	$(".dots").each(function(index){//有几个车次就有几个
    	    		 var $dots=$($(".dots")[index]).find("circle");
    	    		 var lastX,lastY;//存储第一个circle的x、y坐标
    	    		 $dots.each(function(i){

    	    			var transformValue =$(this).attr("transform");
    	    			var x=transformValue.substring(10,(transformValue.lastIndexOf(",")));
    	    			var y=Number(transformValue.substring(transformValue.lastIndexOf(",")+1,transformValue.length-1));	 
    	    			var timeDate= timeArray2[index];
    	    			if (x>5&&x<maxWidth) {				//车次 时间  左右在规定范围内显示
	    	    			if (y>(maxHeight-15)||y<1) {	//车次 时间  上下在规定范围内显示
	    					}else{		
	    						if (i%2==0) {
	    							if(i==2){
    									var rotateG;
    									if(!lastX){
    										var transformValue1 =$($dots[1]).attr("transform");
    										lastX=transformValue1.substring(10,(transformValue1.lastIndexOf(",")));
    				    	    			lastY=Number(transformValue1.substring(transformValue1.lastIndexOf(",")+1,transformValue1.length-1));	 
    									}
    									if(y<lastY){//逆时针旋转
    										rotateG=parseInt(360-Math.atan((lastY-y)/(x-lastX))*180/Math.PI);//向上旋转
    									}
    									else{//顺时针旋转
    										rotateG=parseInt(360-Math.atan((lastY-y)/(x-lastX))*180/Math.PI);//向下旋转
    									}
	    								if(locoArray[index]&&locoArray[index].length>0){
	    									var locoNameStr="(";
											for(var j=0;j<locoArray[index].length;j++){
												if(j<locoArray[index].length-1){
													locoNameStr+=locoArray[index][j].locoTypename+"、";
												}
												else locoNameStr+=locoArray[index][j].locoTypename;
											}
											locoNameStr+=")";
	    									/*var locoNameStr="";
	    									for(var m=1;m<locoArray[index].length;m++){
	    										if(locoNameStr.indexOf(locoArray[index][m][0])==-1){
	    											locoNameStr+=locoArray[index][m][0]+",";
	    										}
	    									}
	    									locoNameStr=locoNameStr.substring(0,locoNameStr.length-1);*/

	    									svg.append("g").attr("transform","rotate("+rotateG+","+lastX+","+lastY+")")
		    								.attr("class","left-titie")
		    								.append("text")
		    								.attr("class", "axis-label")
		    								.attr("x",lastX)
		    								.attr("y",lastY)
		    								.text(cheziNameArray[index]+locoNameStr);// 车次名
	    								}
	    								else{
	    									svg.append("g").attr("transform","rotate("+rotateG+","+lastX+","+lastY+")")
		    								.attr("class","left-titie")
		    								.append("text")
		    								.attr("class", "axis-label")
		    								.attr("x",lastX)
		    								.attr("y",lastY)
		    								.text(cheziNameArray[index]);// 车次名
	    								}
	    								
	    							}
	    							svg.append("g")
	    							.attr("class","left-titie")
	    							.append("text")
	    							.attr("class", "axis-label")
	    							.attr("x",x-15)
	    							.attr("y",(y==0?0:y+20))
	    							.text(timeDate[i]);// 时间
	    						}else {
	    							if(i==1){
	    								lastX=x;
	    								lastY=y;
	    							}
	    							if(timeDate[i]==timeDate[i-1]){
	    								svg.append("g")
		    							.attr("class","left-titie")
		    							.append("text")
		    							.attr("class", "axis-label")
		    							.attr("x",x+50)
		    							.attr("y",(y==0?0:y+20));//时间
	    							}
	    							else{
	    								svg.append("g")
		    							.attr("class","left-titie")
		    							.append("text")
		    							.attr("class", "axis-label")
		    							.attr("x",x+50)
		    							.attr("y",(y==0?0:y+20))
		    							.text(timeDate[i]);// 时间
	    							}	
	    						}
	    					
	    						/*
	    						if (index%2==0) {
	    							if (i==0) {
	    								svg.append("g")
	    								.attr("class","left-titie")
	    								.append("text")
	    								.attr("class", "axis-label")
	    								.attr("x",x)
	    								.attr("y",y)
	    								.text(cheziNameArray[index]);// 车次名
	    								
	    							}
	    						}else {
	    							if (i==0) {
	    								svg.append("g")
	    								.attr("class","left-titie")
	    								.append("text")
	    								.attr("class", "axis-label")
	    								.attr("x",x)
	    								.attr("y",y)
	    								.text(cheziNameArray[index]);// 车次名
	    							}
	    						}
	    						if (i%2==0) {
	    							svg.append("g")
	    							.attr("class","left-titie")
	    							.append("text")
	    							.attr("class", "axis-label")
	    							.attr("x",x-15)
	    							.attr("y",(y==0?0:y+20))
	    							.text(timeDate[i]);// 时间
	    						}else {
	    							svg.append("g")
	    							.attr("class","left-titie")
	    							.append("text")
	    							.attr("class", "axis-label")
	    							.attr("x",x+50)
	    							.attr("y",(y==0?0:y+20))
	    							.text(timeDate[i]);// 时间
	    						}
	    					*/}
    	    			}
	    			 
    	    		 });
    	    	 });
    	    };
    });
});
