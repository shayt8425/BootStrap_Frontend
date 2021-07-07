RTU.DEFINE(function (require, exports) {

    require("jquery/jquery-1.7.2.min.js");
    require("popuwnd/js/popuwnd.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../../../css/app/app-faultalarmsubsidiary.css");
    require("app/loading/list-loading.js");
    var $html;
    var popuwnd;
    RTU.register("app.lkj15limitinfo.query.init", function () {
    	
        return function (obj) {
        	
        	RTU.invoke("core.router.load", {
                url: "../app/modules/app-lkj15limitinfo-query.html",
                success: function (html) {
                    $html = $(html);
                    
                    if(popuwnd)popuwnd.html($html);
                    
                    RTU.invoke("app.lkj15limitinfo.query.activate",obj);
                	
                	//临时限速信息
                    RTU.invoke("app.lkj15limitinfo.limitinfo.init",obj);  
                    
                  //临时限速控制信息
                   RTU.invoke("app.lkj15limitinfo.limitcontrolinfo.init",obj);  
                   
                   //临时限速控制信息
                   RTU.invoke("app.lkj15limitinfo.limitstatus.init",obj);  
                   
                   data=obj;
      
                   intervalObj = window.setInterval('RTU.invoke("app.lkj15limitinfo.inittime")', 5000);
                   
                   $($($(popuwnd.mhtml).parent().parent()).find(".popuwnd-title-del-btn")).click(function(){
                   		window.clearInterval(intervalObj);
                   });
                }
            });	
        };
    });
    
    var data;
    
    var intervalObj;
    
    RTU.register("app.lkj15limitinfo.inittime",function(){
    	return function(){
    		if(data){
    			//临时限速信息
                RTU.invoke("app.lkj15limitinfo.limitinfo.init",data);  
                
              //临时限速控制信息
               RTU.invoke("app.lkj15limitinfo.limitcontrolinfo.init",data);  
               
               //临时限速控制信息
               RTU.invoke("app.lkj15limitinfo.limitstatus.init",data);  
    		}
    	};
    });
    
    var width;
    var height;
    RTU.register("app.lkj15limitinfo.query.activate", function () {
        return function (data) {
            width = document.documentElement.clientWidth*0.7;
            height = document.documentElement.clientHeight*0.6;
            if(!popuwnd){
            	 popuwnd = new PopuWnd({
                     title: "揭示信息显示-"+data.checiName+"("+data.locoTypeName+"-"+data.locoNO+")",
                     html: $html,               
                     width: width > 880 ? width : 880,
                     height: height > 575 ? height : 575,
                     left: 70,
                     top: 60,
                     shadow: true,
                     removable: true,  //设置弹出窗口是否可拖动
                     deletable: true	  //设置是否显示弹出窗口的关闭按钮
                 });
                 popuwnd.remove = popuwnd.close;
                 popuwnd.close = popuwnd.hidden;
                 
            }
            else{
            	popuwnd.title="揭示信息显示-"+data.checiName+"("+data.locoTypeName+"-"+data.locoNO+")";
            }
            
            
            popuwnd.init();
        };
    });
    
    RTU.register("app.lkj15limitinfo.limitinfo.init",function(){
    	var detailGidInit=function(option){
    		var g1=null;
    		
    		g1 = new RTGrid({
                	url:"../lkj15LimitInfo/searchLimitInfoByProperty?locoTypeid=" + option.locoTypeid + "&locoNo=" + option.locoNO + "&locoAb="+option.locoAb,
                    containDivId: "lkj15-limitinfo-grid",
                    tableWidth:$("#lkj15limitinfo_div").width()-20,
                    tableHeight:180,
                    hasCheckBox: false, //是否有checkbox
                    showTrNum: false, //是否显示行号
                    isSort:false,
                    isShowPagerControl:false,
                    colNames: ["序号","记录号","揭示类型","时间类型","线路","主三线","上下行","正反向",
                               "开始里程","结束里程","开始时间","结束时间","客车限速","货车限速"],
                    colModel:[{name:"revealserialnumber",isSort:false}
                    ,{name:"recordno",isSort:false}
                    ,{name:"currevealtype",isSort:false},
                    {name:"curtimetype",isSort:false},
                    {name:"l_name",isSort:false},
                    {name:"zhusanxian",isSort:false},
                    {name:"xingbie",isSort:false},
                    {name:"directionflag",isSort:false},
                    {name:"startdistance",isSort:false},
                    {name:"enddistance",isSort:false},
                    {name:"starttime",isSort:false},
                    {name:"endtime",isSort:false},
                    {name:"passengercarspeed",isSort:false},
                    {name:"truckspeed",isSort:false}],
                    replaceTd:[
                               {
                            	   index: 2, fn: function (data,j,ctd,itemData) {
                            		   				return revealType[data];
                           	   	}
                               },
                               {
                            	   index: 3, fn: function (data,j,ctd,itemData) {
                            		   				return revealTimeType[data];
                           	   	}
                               },
                               {
                            	   index: 5, fn: function (data,j,ctd,itemData) {
                            		   				return zhusanxian[data];
                           	   	}
                               },
                               {
                            	   index: 7, fn: function (data,j,ctd,itemData) {
                            		   				return directionFlag[data];
                           	   	}
                               },
                               {
                            	   index: 6, fn: function (data,j,ctd,itemData) {
                            		   				return xingbie[data];
                           	   	}
                               }],
                               loadPageCp:function(t){
                           		$("#lkj15-limitinfo-grid").css("margin-left","0px")
                           		.css("margin-top","0px").css("left","0px").css("top","0px");
                           	}
                });
    		
    	};
    	return function(option){
    		detailGidInit(option);     		
    	};    	
    });
    
    //揭示类型
    var revealType={
    		1:"临时限速",
    		2:"停基改电",
    		3:"车站限速",
    		4:"股道限速",
    		5:"乘降所",
    		6:"绿色许可证",
    		7:"特定引导",
    		31:"防汛提示"
    };
    
    var revealTimeType={
    		0:"每日",
    		1:"昼夜"
    };
    
    var zhusanxian={
    		0:"主线",
    		1:"三线",
    		2:"四线",
    		3:"五线"
    };
    
    var directionFlag={
    		0:"正向",
    		1:"反向"
    };
    
    var xingbie={
    		0:"上行",
    		1:"下行"
    };
    
    
  //揭示类型
    var controlFlag={
    		0:"未起控",
    		1:"已起控",
    		2:"已解除"
    };
    
    RTU.register("app.lkj15limitinfo.limitcontrolinfo.init",function(){
    	var detailGidInit=function(option){
    		var g1=null;
    		
    		g1 = new RTGrid({
                	url:"../lkj15LimitControlInfo/searchLimitControlInfoByProperty?locoTypeid=" + option.locoTypeid + "&locoNo=" + option.locoNO + "&locoAb="+option.locoAb,
                    containDivId: "lkj15-limitcontrolinfo-grid",
                    tableWidth:$("#lkj15limitinfo_div").width()-20,
                    tableHeight:180,
                    hasCheckBox: false, //是否有checkbox
                    showTrNum: false, //是否显示行号
                    isSort:false,
                    isShowPagerControl:false,
                    colNames: ["序号","命令号","揭示条数","揭示类型","限速","起始里程","结束里程","状态"],
                    colModel:[{name:"revealserialnumber",isSort:false},{name:"recordno",isSort:false}
                    ,{name:"revealcount",isSort:false},{name:"currevealtype",isSort:false},
                    {name:"speedlimit",isSort:false},{name:"startdistance",isSort:false},
                    {name:"enddistance",isSort:false},{name:"begcontrolflag",isSort:false}],
                    replaceTd:[
                               {
                            	   index: 3, fn: function (data,j,ctd,itemData) {
                            		   				return revealType[data];
                           	   	}
                               },
                               {
                            	   index: 7, fn: function (data,j,ctd,itemData) {
                            		   				return controlFlag[data];
                           	   	}
                               }],
                    loadPageCp:function(t){
                        		t.cDiv.css("left","180px");
                        		t.cDiv.css("top","400px");
                        	}
                });
    		
    	};
    	return function(option){
    		detailGidInit(option);     		
    	};    	
    });
    
    RTU.register("app.lkj15limitinfo.limitstatus.init",function(){
    	var detailGidInit=function(option){
    		var g1=null;
    		
    		g1 = new RTGrid({
                	url:"../lkj15LimitStatus/searchLimitStatusInfoByProperty?locoTypeid=" + option.locoTypeid + "&locoNo=" + option.locoNO + "&locoAb="+option.locoAb,
                    containDivId: "lkj15-limitstatus-grid",
                    tableWidth:$("#lkj15limitinfo_div").width()-20,
                    tableHeight:150,
                    hasCheckBox: false, //是否有checkbox
                    showTrNum: false, //是否显示行号
                    isSort:false,
                    isShowPagerControl:false,
                    colNames: ["序号","揭示条数","校验码","状态"],
                    colModel:[{name:"seraialnumber",isSort:false},{name:"totalrevealcount",isSort:false}
                    ,{name:"decrevealcheckcode_crc32",isSort:false},{name:"revealstate",isSort:false}],
                    
                    loadPageCp:function(t){
                    	$("#lkj15-limitstatus-grid").css("margin-left","0px")
                   		.css("margin-top","0px").css("left","20px").css("top","71%");
                        	}
                });
    		
    	};
    	return function(option){
    		detailGidInit(option);     		
    	};    	
    });
    
});
