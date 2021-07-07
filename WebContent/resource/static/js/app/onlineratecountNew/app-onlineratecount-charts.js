RTU.DEFINE(function (require, exports) {
/**
 * 模块名：上线率统计
 * name：onlineratecount
 * date:2015-2-12
 * version:1.0 
 */
		require("jquery/ichart.1.2.min.js");
	    require("../../../css/app/onlineratecountNew/app-onlineratecount-charts.css");
	    var	 onlineratecountchartsGrid;// 统计列表数据
	    var onlineratecountchartsGridRightBottom;
	    RTU.register("app.onlineratecount.charts.init", function () {
	    	  return function (Resolution) {
	    		  //Resolution.staDate="2015-11-01";  //  29 30  31  
		    	 // Resolution.endDate="2015-11-30";
	    		  
	    		  
	    		  
	    		  // 显示列表数据  上方
	    		  RTU.invoke("app.onlineratecount.charts.showLaisTabData",Resolution);
	    		  
	    		  //显示图表  左下方  天图
	    		  RTU.invoke("app.onlineratecount.charts.drawLaisDay",Resolution);
	    		  
	    		  // 对比按钮
	    		  $(".onlineratecount-charts-right-button-contrast").unbind("click").click(function(){
	    			  
	    			  var grid=$("#onlineratecount-charts-right-bottom-divTab .RTTable_Head input");
	    	    		var len=4;
	    	    		if(grid[0].checked==true){
	    	    			len=5;
	    	    		}
	    			var checkeds_Date =  onlineratecountchartsGridRightBottom.selectItem();
	    			
	    			if(checkeds_Date.length==0){
	    				RTU.invoke("header.notice.show", "请选择一行数据。。");
						return false;
	    			}else if(checkeds_Date.length>len){
	    				RTU.invoke("header.notice.show", "最多只能选择四天..");
						return false;
	    			}
	    			var timeStr="";
	    			for(var i=0;i<checkeds_Date.length;i++){
	    				var d=$(checkeds_Date[i]).data("itemData");
	    				if(d)
	    				timeStr+=d.day+",";
	    			}
	    			Resolution.timeStr=timeStr;
	    			Resolution.checkeds_Date=checkeds_Date;//选择的天数据
	    			//请求数据
	    			getHourData(Resolution);
	    			
	    			  return false;
	    		  });
	    		  
	    		  $(function(){
	    			 
	    	           $("div","#onlineratecount-charts-tab-top-grid").scroll(function(e){  
	    	        	   
	    	        	  var sw=$(".RTGrid_Bodydiv")[2].scrollWidth;
	    	        	  var cw=$(".RTGrid_Bodydiv")[2].clientWidth;
	    	        	  
	    	        	   //获取滚动条到左边的垂直宽度 
	    	        	   var slw= $(this).scrollLeft(); 
	    	        	   
	    	        	   if(((slw+cw)+1)> sw-18){
	    	        		   $(this).scrollLeft(slw-3);
	    	        	   }else{
	    	        		   $(this).scrollLeft(slw);
	    	        	   }
	    	           });
	    		 });
	    	  };
	    });
	   
	    
	    //获取小时的数据
	    function getHourData(Resolution){
	    	// var url='locochart/getLocoHchart?locostr='+Resolution.loco+'&btime='+Resolution.timeStr;
	    	var param = {
	                datatype: "jsonp",
	                url: "locochart/getLocoHchart",
                    data: {
                    	"locostr":Resolution.loco,
                    	"btime":Resolution.timeStr
                    },
	                success: function (data) {
	             	  $("#canvasDiv").empty();//清空 天数据
	             	  if(data.data)
	             	  Resolution.hourData=data.data;
	             	  RTU.invoke("app.onlineratecount.charts.drawLaisHour",Resolution);
	                },
	                error: function () {
	                }
	              };
	    	
	             RTU.invoke("core.router.post", param);
	    }
	    
	    //右下方  日期生成   
	    function setDateOption(Resolution,dateArr){
	    	$("#onlineratecount-charts-right-bottom-divTab").css("height",Resolution.Theight * 0.4 -55);//.css("overflow","hidden");//.css("overflow-x","hidden");
	    	dataArr=[];
	    	for(var i=0;i<dateArr.length;i++){
	    		var data = new Array();
	    		data.day=dateArr[i];
	    		dataArr[i]=data;
	    	}
	    	
	    	 onlineratecountchartsGridRightBottom = new RTGrid({
					datas:dataArr,
		            containDivId: "onlineratecount-charts-right-bottom-divTab",
		            tableWidth: Resolution.Twidth * 0.1 + 8,
		            tableHeight: Resolution.Theight * 0.4 - 55,
		            isSort: false, //是否排序
		            hasCheckBox: true,
		            showTrNum: false,
		            isShowPagerControl: false,
		            isShowRefreshControl:false,
	                trRightClick:function(returnData){
	                	
	                },
	                clickTrEvent: function (t) {   //点击行
	                },
		            loadPageCp: function (t) {
		                t.cDiv.css("left", "200px");
		                t.cDiv.css("top", "200px");
	                    if (t.param.datas.length == 0) {
	                   	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
	                        return;
	                    }
		            },
//		            replaceTd: dayTdVal,
		            colNames: ["日期"],
		            colModel: [{name:"day"}]
		        });
	    	
	    	
//	    	$("#onlineratecount-charts-right-bottom-divTab").empty();
//	    	var opt="<table>";
//	    	for(var i= 0;i<dateArr.length;i++){
//	    		opt +="<tr class='onlineratecount-charts-right-bottom-tr onlineratecount-charts-right-bottom-tr-hover-color'><td width='32px'><input name='onlineratecount-charts-right-bottom-tr-checkbox' type='checkbox'/></td><td>"+dateArr[i]+"</td></tr>";
//	    	}
//	    	opt +="</table>";
//	    	$("#onlineratecount-charts-right-bottom-divTab").prepend(opt);
//	    	opt=null;
//	    	
//	    	var rightBot_tr=$(".onlineratecount-charts-right-bottom-tr");
//	    	rightBot_tr.each(function(){
//	    		$(this).unbind("click").click(function(e){
//	    			var tdInputbox= $(this).children().eq(0).children().eq(0);//当前行下第一个td 下第一个input
//	    			if(tdInputbox[0].checked){
//	    				tdInputbox[0].checked=false;
//	    			}else{
//	    				tdInputbox[0].checked=true;
//	    			}
//	    		});
//	    	});
	    }
	    
	    //获取明天的日期
	    function GetDateStr(date,AddDayCount) {
	        var dd = new Date(date);
	        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
	        var y = dd.getFullYear();
	        var m = dd.getMonth()+1;//获取当前月份的日期
	        if(m<10)m="0"+m;
	        var d = dd.getDate();
	        if(getStrLength(d.toString())==1){
	        	d="0"+d;
	        }
	        return y+"-"+m+"-"+d;
	    }
	        
        function getStrLength(str) {  
            var cArr = str.match(/[^\x00-\xff]/ig);  
            return str.length + (cArr == null ? 0 : cArr.length);  
        } 
	   
	   //两个日期相差天数
	    function getDays(strDateStart,strDateEnd){
	    	   var strSeparator = "-"; //日期分隔符
	    	   var oDate1;
	    	   var oDate2;
	    	   var iDays;
	    	   oDate1= strDateStart.split(strSeparator);
	    	   oDate2= strDateEnd.split(strSeparator);
	    	   var strDateS = new Date(oDate1[0], oDate1[1]-1, oDate1[2]);
	    	   var strDateE = new Date(oDate2[0], oDate2[1]-1, oDate2[2]);
	    	   iDays = parseInt(Math.abs(strDateS - strDateE ) / 1000 / 60 / 60 /24);//把相差的毫秒数转换为天数 
	    	   return (iDays+1) ;
	    	}
	    
	    // 显示列表数据  上方
	    RTU.register("app.onlineratecount.charts.showLaisTabData", function () {
	      return function showLaisTabData(Resolution){
	    	 
	    	  $("#onlineratecount-charts-tab-top-grid").empty();
	    	  //两个日期相差的天数
	    	  var day=getDays(Resolution.staDate, Resolution.endDate);
	    	  //表格属性 字段
	    	  var dayAttrArr=["型号","时间","电务段"];
	    	  //表格显示值 属性
	    	  var dayValArr=[{ name: "loco",isSort: true ,width:"100"},{ name: "lasttime",isSort: true ,width:"100"},{ name: "dname",isSort: true,width:"100" }];
	    	  //调整显示表格内容 数组
	    	  var dayTdVal=[{index: 1, fn: function (data,j,ctd,itemData,obj) {
	    		  				if(data=="null"){
	    		  					return "";
	    		  				}else{
	    		  					return data;
	    		  				}
							}
						}];
	    	  //日期数组
	    	  var dateArr=[];
	    	  
	    	  for(var i=0;i<day;i++){
	    		 var d= GetDateStr(Resolution.staDate,i);
	    		 dateArr.push(d);
	    	  }
	    	  dateArr=dateArr.reverse();//倒序
	    	  Resolution.dateArr=dateArr;//保存查询日期数组
	    	  
	    	  setDateOption(Resolution,dateArr);//页面 右下方日期生成
	    	  
	    	  var index=3;//索引 标记 从3 开始的 表格内容 自定义显示
	    	  for(var j=0;j<dateArr.length;j++){
	    		  var darr =dateArr[j].split("-");
	    		  dayAttrArr.push(darr[1]+"/"+darr[2]);
	    		
	    		   var val =  { name: "datestr",isSort: true,width:"70"};
	    		  if(j==dateArr.length-1){
	    			   val =  { name: "datestr",isSort: true,width:"70" };
	    		  }
	    		
    			  dayValArr.push(val);//表格值     字段
    			  
    			  
    			  var indexa=0;//表格运行次数
    			  var tdVal=  {index: index, fn: function (data,j,ctd,itemData,obj) {
			    				    var t=itemData.datestr.split(",");
			    				    var flag=false;
			    				     for(var i=0;i<t.length;i++){  
				    				    	if(dateArr[indexa%day]==t[i]){
	    				     	    		flag=true;
	    				     	    	}
			    				     }
			    				     if(flag){
			    				    	 indexa++;
		    				    		 return "√";
			    				     }else{
			    				    	 indexa++;
		    				    		 return "";
			    				     }
 								}
 							};
    			
    			dayTdVal.push(tdVal);
    			  index++;
	    	  }
	    	  //locochart/getLocoOline?locostr=[{%22locoTypeid%22:%22302%22,%22locoNo%22:%222151%22,%22locoAb%22:%220%22},{%22locoTypeid%22:%22302%22,%22locoNo%22:%222590%22,%22locoAb%22:%220%22}]&btime=2015-10-25&etime=2015-11-25
	    	 onlineratecountchartsGrid = new RTGrid({
					url:"../locochart/getLocoOline",
		            containDivId: "onlineratecount-charts-tab-top-grid",
		            tableWidth: Resolution.Twidth * 0.98,
		            tableHeight: Resolution.Theight * 0.4,
		            isSort: true, //是否排序
		            hasCheckBox: false,
		            showTrNum: true,
		            isShowPagerControl: false,
		            isShowRefreshControl:false,
	                trRightClick:function(returnData){
	                	
	                },
	                clickTrEvent: function (t) {   //点击行
	                },
	                extraUrlParam:{
	                	locostr:Resolution.loco,
		    			btime:Resolution.staDate,
		    			etime:Resolution.endDate,
		    			rTGridType:"post"
	                 },
		            loadPageCp: function (t) {
		            	
		                t.cDiv.css("left", "200px");
		                t.cDiv.css("top", "200px");
	                    if (t.param.datas.length == 0) {
	                   	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
	                        return;
	                    }
		            },
		            replaceTd: dayTdVal,
		            colNames: dayAttrArr,
		            colModel: dayValArr
		        });
	    	 
	    	 RTU.invoke("header.msg.hidden");
	    	  
	     };
	    });
	    
	    //显示图表  天图
	    RTU.register("app.onlineratecount.charts.drawLaisDay", function () {
	    	  return function (Resolution) {
	  
	    		 var dataDay= onlineratecountchartsGrid.datas;
	    		 var dateArr=Resolution.dateArr.reverse();
	    		  
	    		// 天图
	     		  var day=[];
	   			//组合数据
	     		  var dayUpLine=[];
	     		if(dateArr.length==1){//当只选 一天时   日期在后显示
	     			day.push("");
	     			dayUpLine.push(0);
	     		}
//	     		if(day.length==1)day.push("");   //当只选 一天时   日期在前显示
//	     		if(dayUpLine.length==1)dayUpLine.push(0);
	     		
	     		
	   			for(var i=0;i<dateArr.length;i++){
	   				
	   				var d=dateArr[i].split("-");
	   				day.push(d[2]);
	   				
	   				var index=0;
	   				for(var j=0;j<dataDay.length;j++){//车上线情况数据
	   					var strArr =dataDay[j].datestr.split(",");//这台车的上线日期数组(数据库获得日期数组)
	   					strArr=strArr.reverse();
	   					for(var ij=0;ij<strArr.length;ij++){
	   						if(dateArr[i]==strArr[ij]){//循环查询某天机车是否上线
	   							index++;  //每台车的上线统计
	   							break;
	   						}
	   					}
	   				}
	   				dayUpLine.push(index);
	   			}
	   			
	   			var data2 = [
	   			         	{
	   			         		name : '机车上线数/台',
	   			         		value:dayUpLine,
	   			         		color:'#f68f70',
	   			         		line_width:2
	   			         	}
	   			         ]; 			
	   		    var h =$("#onlineratecount-charts-top").height();
	   			var chart = new iChart.LineBasic2D({
	   				render : 'canvasDiv',
	   				data: data2,
	   				align:'center',
	   				title : '天   TSC 上线统计图',
	   				//subtitle : '平均每个人访问2-3个页面(访问量单位：万)',
	   				//footnote : '数据来源：模拟数据',
	   				width : Resolution.Twidth * 0.87 - 20,
//	   				height : Resolution.Theight * 0.4,
	   				height : h,
	   				background_color:'#FEFEFE',
	   				tip:{
	   					enable:true,
	   					shadow:true,
	   					move_duration:Resolution.Theight * 0.5,
	   					border:{
	   						 enable:true,
	   						 radius : 5,
	   						 width:1,
	   						 color:'#3f8695'
	   					},
	   					listeners:{
	   						 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
	   						parseText:function(tip,name,value,text,i){
	   							return name+"上线数: "+value+" 台";
	   						}
	   					}
	   				},
	   				tipMocker:function(tips,i){
	   					//当只选 一天时   日期在后显示
	   					var d="",t=false;
	   					//判断是否只选择一天  
	   					if(dateArr.length==1){
	   						d=dateArr[Math.floor(0)];
	   						t=true;
	   					}else{
	   						d=dateArr[Math.floor(i)];
	   					}
	   					
	   					var div=$("#canvasDiv div:first");
	   					var ccc=$($(div).children()).get(2);
	   					ccc=$(ccc).css("visibility","visible");
	   					if(t&&i==0){
	   						ccc=$(ccc).css("visibility","hidden");
	   						return "<span></span>";//日期
	   					}else{
	   						return "<div id='tipDate' style='font-weight:600'>"+d+" "+//日期
	   						"</div>"+tips.join("<br/>");
	   					}
	   					
	   					
//	   					当只选 一天时   日期在前显示
//	   					var d=dateArr[Math.floor(i)];
//	   					var div=$("#canvasDiv div:first");
//	   					var ccc=$($(div).children()).get(2);
//	   					ccc=$(ccc).css("visibility","visible");
//	   					
//	   					if(d){
//	   						return "<div id='tipDate' style='font-weight:600'>"+d+" "+//日期
//	   						"</div>"+tips.join("<br/>");
//	   					}else{
//	   						ccc=$(ccc).css("visibility","hidden");
//	   						return "<span></span>";//日期
//	   						
//	   					}
	   					
	   				},
	   				legend : {
	   					enable : true,
	   					row:1,//设置在一行上显示，与column配合使用
	   					column : 'max',
	   					valign:'top',
	   					sign:'bar',
	   					background_color:null,//设置透明背景
	   					offsetx:-80,//设置x轴偏移，满足位置需要
	   					border : true
	   				},
	   				crosshair:{
	   					enable:true,
	   					line_color:'#62bce9'//十字线的颜色
	   				},
	   				sub_option : {
	   					label:false,
	   					point_size:10
	   				},
	   				coordinate:{
	   					width:Resolution.Twidth * 0.8 * 0.85 ,
	   					height:Resolution.Theight * 0.4 * 0.6,
	   					axis:{
	   						color:'#dcdcdc',
	   						width:1
	   					},
	   					scale:[{
	   						 position:'left',	
	   						 start_scale:Math.min.apply(null, dayUpLine)-1<0?0:Math.min.apply(null, dayUpLine)-1,
	   						 end_scale:Math.max.apply(null, dayUpLine)+1,
	   						 scale_space:calculateKeDu(dayUpLine,"day"),
	   						 scale_size:1,
	   						 scale_color:'#9f9f9f'
	   					},{
	   						 position:'bottom',	
	   						 labels:day
	   					}]
	   				}
	   			});
	   			
	   		
	   		//开始画图
	   		chart.draw();
	   		
	    	  };
	    });
	    
	    //计算刻度
	    function calculateKeDu(data,val){
	    	
	    	if(val=="hour")
	    		data=data[0].value;
	    	
	    	var max =Math.max.apply(null, data);
	    	
	    	var min =Math.min.apply(null, data);
	    	
	    	var val=(max-min)/10;
	    	
	    	if(val<1){
	    		return 1;
	    	}else{
	    		return Math.ceil(val);
	    	}
	    };
	    
	  //显示图表  左下方  小时图
	    RTU.register("app.onlineratecount.charts.drawLaisHour", function () {
	    	  return function (Resolution) {
	    		  // 实际返回数据  天数
	    		  var hour_DayLength=Resolution.hourData.length;
	    		  //画图数据
	    		  var hourData=[];
	    		  //画线 颜色
	    		  var colorArr=["BLACK","GREEN","BLUE","RED"];
	    		  //选择了多少天
			      for(var j=0,ij= Resolution.checkeds_Date.length-1;j<Resolution.checkeds_Date.length,ij>=0;j++,ij--){
			    	   
			    	  //选择的天  数据
			    	   var d=$(Resolution.checkeds_Date[ij]).data("itemData");
			    	   if(d){
			    		   var hour_Day = new Array();
			    		   var falg=false;//当前天是否 有上线
			    		   var dayData="";
			    		   // 实际返回数据  天数
			    		   for(var k=0;k<hour_DayLength;k++){
			    			   dayData=Resolution.hourData[k];//
			    			   if(d.day==dayData[0]){// 当前天 有上线
			    				   falg=true;
			    				   break;
			    			   }
			    		   }
			    		   for(var y=1;y<25;y++){//24H
			    			   if(falg){
			    				   hour_Day.push(dayData[y]);
			    			   }else{
			    				   hour_Day.push(y-y);
			    			   }
			    		   }
			    		   
			    		   var color =j==Resolution.checkeds_Date.length-1?colorArr[3]:colorArr[j];
			    		   var day={name :d.day,value:hour_Day,color:color,line_width:2};
			    		   hourData.push(day);
			    	   }
			       }
	   		
		   		var labels2 = ["00","01","02","03","04","05","06","07","08","09","10","11","12","13","14","15","16","17","18","19","20","21","22","23"];
		   	    var h =$("#onlineratecount-charts-top").height();
		   		var chart2 = new iChart.LineBasic2D({
	   				render : 'canvasDiv',
	   				data: hourData,
	   				align:'center',
	   				title : '小时   TSC 上线统计图',
	   				//subtitle : '平均每个人访问2-3个页面(访问量单位：万)',
	   				//footnote : '数据来源：模拟数据',
	   				width : Resolution.Twidth * 0.87 -20,
	   				height : h,
//	   				height : Resolution.Theight * 0.4,
	   				background_color:'#FEFEFE',
	   				tip:{
	   					enable:true,
	   					shadow:true,
	   					move_duration:Resolution.Theight * 0.5,
	   					border:{
	   						 enable:true,
	   						 radius : 5,
	   						 width:1,
	   						 color:'#3f8695'
	   					},
	   					listeners:{
	   						
	   					 //tip:提示框对象、name:数据名称、value:数据值、text:当前文本、i:数据点的索引
	   						parseText:function(tip,name,value,text,i){
	   							return "<span style='color:#005268;font-size:12px;'>"+name +"  "+ labels2[i]+":00 上线数: "+ value +" 台<br/>";
//	   							"</span><span style='color:#005268;font-size:20px;'>"+value+"台</span>";
	   						}
	   					
	   					
	   					}
	   				},
	   				tipMocker:function(tips,i){
	   				    return "<div id='tipDate' style='font-weight:600'>"+
	   							"</div>"+tips.join("<br/>");
	   					
	   				    //下面是分的很细 
	   					//return "<div id='tipDate' style='font-weight:600'>"+
	   					//		labels[Math.floor(i/12)]+" "+//日期
	   					//		(((i%12)*2<10?"0":"")+(i%12)*2)+":00"+//时间
	   					//		"</div>"+tips.join("<br/>");
	   				},
	   				legend : {
	   					enable : true,
	   					row:1,//设置在一行上显示，与column配合使用
	   					column : 'max',
	   					valign:'top',
	   					sign:'bar',
	   					background_color:null,//设置透明背景
	   					offsetx:-80,//设置x轴偏移，满足位置需要
	   					border : true
	   				},
	   				crosshair:{
	   					enable:true,
	   					line_color:'#62bce9'//十字线的颜色
	   				},
	   				sub_option : {
	   					label:false,
	   					point_size:10
	   				},
	   				coordinate:{
	   					width:Resolution.Twidth * 0.8 * 0.85 ,
	   					height:Resolution.Theight * 0.4 * 0.6,
	   					axis:{
	   						color:'#dcdcdc',
	   						width:1
	   					},
	   					scale:[{
	   						 position:'left',	
	   						 //start_scale:1,
	   						 start_scale:0,
	   						 end_scale:Math.max.apply(null, hourData)+1,
//	   						 end_scale:Math.max.apply(null, hourData)+1,
	   						 scale_space:calculateKeDu(hourData,"hour"),
	   						 scale_size:2,
	   						 scale_color:'#9f9f9f'
	   					},{
	   						 position:'bottom',	
	   						 labels:labels2
	   					}]
	   				}
	   			});
	   		
		   		//开始画图
		   		chart2.draw();
	               
	    	  };
	    });
});
