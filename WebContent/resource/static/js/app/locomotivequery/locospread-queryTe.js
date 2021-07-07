RTU.DEFINE(function (require, exports) {
/**
 * 模块名：机车分布查询
 * name：onlinecountquery
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
    require("../../../css/app/locomotivequery/locospread-query.css");
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
    require("app/locomotivequery/app-locomotivequery-electronquery.js");
    require("jquery/jquery-scroll.js");
    
    var popuwnd_onlleft = null; //左侧弹出窗口
   
    var shortTypeData = {}; //型号分布数据
    var  clickCount=0;
    
    //加载数据并初始化窗口和事件
    RTU.register("app.locomotivequery.locospread.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                    	$html=$(html);
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                            
                            var mainDiv=$(".content-locospread-MainDiv");
                            var height=mainDiv.height();
                            var width=mainDiv.width();
                            $(".content-basic-div-new").css({"height":(height-40)+"px"});
                            $("#content-locospread-tuzhong").css({"height":(height-100)*0.4+"px"});
                            $("#content-locospread-kunei").css({"height":(height-100)*0.3+"px"});
                            $("#content-locospread-churuku").css({"height":(height-100)*0.3+"px"});

                            $(".content-locospread-middleDiv").css({"height":(height-40)+"px"});
                            $(".content-locospread-middle-c").css({"height":(height-100)+"px"});
                            
                            $(".content-locospread-electronDiv").css({"height":(height-40)+"px"});
                            $(".content-locospread-electron-c").css({"height":(height-100)+"px"});
    
                            $(".content-locospread-endDiv").css({"height":(height-40)+"px"});
                            $(".locospread-conditionsTabtop").css({"width":(width-80)+"px"});
                            $(".locospread-list-tab").css({"width":(width-24)+"px"});
                        }
                        var data_filetransfer = RTU.invoke("app.setting.data", "filetransfer");
	       				 var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
	       				 if(data_filetransfer == null || data_filetransfer == undefined ){
	       					 $("#menu4").parent().remove();
	       				 }
	       				 if(data_filedownload == null || data_filedownload == undefined ){
	       					 $("#menu5").parent().remove();
	       				 }
                    }
                });
            }
        };
    });
    
    var width;
    var height;
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
    
    //查询窗口
    RTU.register("app.onlinecountquery.query.activate", function () {
        return function () {
            //查询窗口
//        	width = document.documentElement.clientWidth * 0.85;
//            height = document.documentElement.clientHeight * 0.89;
        	RTU.invoke("header.msg.hidden");
        	var Resolution=getResolution();
			var width=Resolution.Twidth;
			var height=Resolution.Theight-35;
/*        	var width=Resolution.Twidth;
			var height=Resolution.Theight;*/
			
            RTU.invoke("app.locomotivequery.locospread.loadHtml", { url: "../app/modules/locomotivequery/locospread-queryNew.html", fn: function (html) {
            	if (!popuwnd_onlleft) {
                    popuwnd_onlleft = new PopuWnd({
                        title: "机车分布查询",
                        html: html,
//                        width: width > 810 ? width : 810,
//                        height:height > 500 ? height : 500,
                        width: width ,
                        height:height ,
                        left: 0,
                        top: 35,
                        shadow: true
                    });
                    popuwnd_onlleft.remove = popuwnd_onlleft.close;
                    popuwnd_onlleft.close = popuwnd_onlleft.hidden;
                    popuwnd_onlleft.init();
                }
                else {
                	popuwnd_onlleft.close();
                    popuwnd_onlleft.init();
                }
            	
            	var navTitle = $(".popuwnd-title", popuwnd_onlleft.$wnd);
            	var navShadow = $(".box_shadow", popuwnd_onlleft.$wnd);
                navTitle.css("height","15px");
                navTitle.attr("style","top:-10px; opacity: 0");
                navShadow.attr("style","top:-10px; opacity: 0");
            	
            	
                return popuwnd_onlleft;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.onlinecountquery.query.initTopBtn");
            	$(".tab-start-head").click();
            	RTU.invoke("app.onlinecountquery.query.toggleSize");
                setTimeout(function(){
                    RTU.invoke("app.onlinecountquery.query.searchBylocation");
                    RTU.invoke("app.onlinecountquery.query.initInputAuto",$("#searchLocoInput"));
                },25);
            	
                setTimeout(function(){
                    RTU.invoke("app.onlinecountquery.query.searchByLocoType");
                    RTU.invoke("app.onlinecountquery.query.initInputAuto",$("#searchLocoInput1"));
                },50);
                
                setTimeout(function(){
                    RTU.invoke("app.electronquery.searchByElectron");
                    RTU.invoke("app.onlinecountquery.query.initInputAuto",$("#searchLocoInput2"));
                },75);
                
                popuwnd_onlleft.$wnd.find(".popuwnd-title-del-btn").click(function () {
                    RTU.invoke("header.msg.hidden");
                });
            }
            });
        };
    });
    
    RTU.register("app.onlinecountquery.query.initInputAuto",function(){
	       var trainStrParse = function (data) {  //给机车型号和机车号增加-符号
	            data = data.data;
	            var rows = [];
	            for (var i = 0; i < data.length; i++) {

	                rows[rows.length] = {
                           data: data[i],
                           value: data[i].locoTypeName + "-" + data[i].locoNO,
                           result: data[i].locoTypeName + "-" + data[i].locoNO //返回的结果显示内容   
                       };
	            }
	            return rows;
	        };
    	return function(data){

	        data.autocomplete("../onlineloco/" +
	        		"searchByProperty?dFullName=&bFullName=&sFullName=&showSize=50" +
	        		"&locoType=&locoNo=&dName=&checiName&lineName=&trainType=&sName=" +
	        		"&temptime=" + new Date().getTime(), {
                minChars: 0, //表示在自动完成激活之前填入的最小字符
                max: 100, //表示列表里的条目数
                autoFill: false, //表示自动填充
                mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
                matchContains: true, //表示包含匹配,相当于模糊匹配
                width: 180,
                scrollHeight: 200, //表示列表显示高度,默认高度为180
                dataType: "json",
                parse: trainStrParse,
                formatItem: function (row) {///下拉列表每行数据
                	return row.locoTypeName + "-" + row.locoNO;
                },
                formatMatch: function (row) {
                	return row.locoTypeName + "-" + row.locoNO;
                },
                formatResult: function (row) {
                	return row.locoTypeName + "-" + row.locoNO;
                }
            }).result(function (event, data, formatted) {
  	
            });

    };
    });
    
    //控制放大缩小
    RTU.register("app.onlinecountquery.query.toggleSize", function () {
        return function () {
            var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
            delbtn.addClass("popuwnd-title-del-btn2").css({ right: "-2px", top: "0px", height: "20px", width: "33px" });
            delbtn.parent().append("<div class='amplifyWin'></div>");
            var btn = $(".amplifyWin", delbtn.parent()).addClass("amplifyWin_larger");
//            var width = document.documentElement.clientWidth * 0.90;
//            var height = document.documentElement.clientHeight * 0.89;
            var Resolution=getResolution();
			/*var width=Resolution.Twidth-140;
			var height=Resolution.Theight-60;*/
            var width=Resolution.Twidth;
			var height=Resolution.Theight-10;
            btn.click(function () {
                btn.outDiv = $(".content-locospread-MainDiv", popuwnd_onlleft.$wnd);
                if (btn.hasClass("amplifyWin_larger")) {//缩小
                    btn.removeClass("amplifyWin_larger").addClass("amplifyWin_small");
                    popuwnd_onlleft.setSize(300, 5);
                    btn.outDiv.hide();
                } else {//放大
                    btn.removeClass("amplifyWin_small").addClass("amplifyWin_larger");
                    setTimeout(function () {
                    	btn.outDiv.show();
                    	popuwnd_onlleft.setSize(width, height);
                    }, 25);
                }
            });
        };
    });
    
    //初始化第三个tab页
    RTU.register("app.onlinecountquery.query.initTab3",function(){
    	return function(){
    		RTU.invoke("app.onlinecountquery.query.searchBureau");
        	RTU.invoke("app.onlinecountquery.query.searchLine");
        	RTU.invoke("app.onlinecountquery.query.searchDepot",{bureau:"南昌铁路局"});
        	var outDiv=$(".locospread-list-tab");
        	var width=$(outDiv).width();
        	var height=$(outDiv).height();
        	var d=[];
        	
        	var Resolution=getResolution();
/*			var width=Resolution.Twidth-160;
			var height=(Resolution.Theight-60)/2-120;*/
            var width=Resolution.Twidth;
			var height=Resolution.Theight/3+20;
			
        	 window.onlinecountGrid= new RTGrid({
       		     datas:[],
        		 containDivId: "locospread-list-grid",
                 tableWidth:width,
                 tableHeight:height,
                 isSort: true,
                 showTrNum:true,
                 hasCheckBox:false,
                 isShowPagerControl:true,
                 loadPageCp:function(t){
               		t.cDiv.css("left","200px");
               		t.cDiv.css("top","200px");
                 },
                 replaceTd: [ { index: 0, fn: function (data, j, ctd, itemData) {
                     if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                         return itemData.locoTypeName + "-" + itemData.locoNO;
                     } else if (itemData.locoAb == "1") {
                         return itemData.locoTypeName + "-" + itemData.locoNO + window.locoAb_A;
                     } else {
                         return itemData.locoTypeName + "-" + itemData.locoNO + window.locoAb_B;
                     }
                 }
                 },{index: 5, fn: function (data,j,ctd,itemData) {
						var kiloSign = itemData.kiloSign;
						if(kiloSign == null){
							return "";
						}else {
							return kiloSign/1000;
						}
						
					}
                 }],
                 colNames: ["机车", "车次", "AB节", "机务段","线路","里程","车站","所属局","时间"],
                 colModel: [{ name: "locoTypeName",width:"100px",isSort: true}, { name: "checiName",width:"50px",isSort: true}, { name: "locoAb",width:"50px",isSort: true}, { name: "depotName" ,width:"100px",isSort: true},{ name: "lineName",width:"100px",isSort: true}, { name: "kiloSign" ,width:"100px",isSort: true}, { name: "sName",width:"100px" ,isSort: true }, { name: "bureauName",width:"100px",isSort: true },  { name: "lkjTimeStr", width: "100px" ,isSort: true  }]
             });
        	
        	 RTU.invoke("app.onlinecountquery.query.clearResultCount");
        	
        	 $(" .locospread-bureauSelect").change(function () {
     			RTU.invoke("app.onlinecountquery.query.searchDepot",{bureau:$(".locospread-bureauSelect").val()});
             });
        	 
        	 $(".app_locospread_commit").unbind("click").click(function(){
        		 var data=getconditions();
        		 RTU.invoke("app.onlinecountquery.query.searchResult",data);
        	 });
        	 
        	 $(".app_locospread_reset").unbind("click").click(function(){
        		 RTU.invoke("app.onlinecountquery.query.clearConditions");
        	 });
        	 $(".app_locospread_reset").click();
    	};
    });
    
    //初始化头部tab切换
    RTU.register("app.onlinecountquery.query.initTopBtn",function(){
    	return function(){
    		
    		
    		$("#closeBtn").unbind("click").click(function(){
    			popuwnd_onlleft.$wnd.find(".popuwnd-title-del-btn").click();
    		});
    		
    		
    		
    		$(".tab-start-head").unbind("click").click(function(){
    			 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                 $(" .tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .tab-middle-end").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                
                 $(" .content-basic-div-new").removeClass("hidden");
                 $(" .content-locospread-middleDiv").addClass("hidden");
                 $(" .content-locospread-endDiv").addClass("hidden");
                 $(".content-locospread-electronDiv").addClass("hidden");
    		});
    		
    		$(".tab-middle").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-middle-end").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-basic-div-new").addClass("hidden");
                $(" .content-locospread-middleDiv").removeClass("hidden");
                $(" .content-locospread-endDiv").addClass("hidden");
                $(".content-locospread-electronDiv").addClass("hidden");
    		});
    		
    		$(".tab-middle-end").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-basic-div-new").addClass("hidden");
                $(" .content-locospread-middleDiv").addClass("hidden");
                $(" .content-locospread-endDiv").removeClass("hidden");
                $(".content-locospread-electronDiv").addClass("hidden");
                RTU.invoke("app.onlinecountquery.query.initTab3");
    		});
    		
    		$(".tab-end-div").unbind("click").click(function(){
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .tab-middle-end").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .content-basic-div-new").addClass("hidden");
                $(" .content-locospread-middleDiv").addClass("hidden");
                $(" .content-locospread-endDiv").addClass("hidden");
               
                $(" .content-locospread-electronDiv").removeClass("hidden");
                
                /*RTU.invoke("app.onlinecountquery.query.initTab3");*/
    		});
    	};
    });
    
    //位置分布查询
    RTU.register("app.onlinecountquery.query.searchBylocation",function(){
    	return function(){
    		var url="onlineloco/findWayOrLib";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	 if(data.data&&data.data.length>0){
                		 RTU.invoke("app.onlinecountquery.query.Tab1.createHtml",data.data[0]);
                	 }
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //第一个tab页组装html
    RTU.register("app.onlinecountquery.query.Tab1.createHtml",function(){  
        var $buildItem1 = function (data, index) {	
        	this.$item  =$("#content-locospread-tuzhong-right-hidden");
        	this.$item.find(".content-locospread-middle-c-sub-title-lineName").text(data.lineName + ":");
            this.$item.find(".content-locospread-middle-c-sub-title-num").text("共" + data.typeCount + "台");
            var tabDiv=this.$item.find(".content-locospread-middle-c-sub-c-tabDiv");
            $(tabDiv).html("");
            
            var html="";
            var showD=data.locoTolInfoVo;
            for(var i=0,len=showD.length;i<len;i++){
            	var locoab="";
            	if (showD[i].locoAB==1) {//A
            		locoab=window.locoAb_A;
            			
            	}else if (showD[i].locoAB==2) {//B
            		locoab=window.locoAb_B;
            	}
            	if(showD[i].state=="在线"){
            		
            		html=html+"<div class='content-locospread-middle-c-sub-c-tabDiv-Td content-locospread-middle-c-sub-c-tabDiv-TdOnline' alt='1'" +
        			" ttypeShortName='"+showD[i].ttypeShortName+"' date='"+showD[i].date+"' frontLineName='"+showD[i].frontLineName+"' " +
        			"frontStationName='"+showD[i].frontStationName+"' limitedSpeed='"+showD[i].limitedSpeed+"' speed='"+showD[i].speed+"' lineName='"+showD[i].lineName+"' " +
        			"kilometer='"+showD[i].kilometer+"' jkstateName='"+showD[i].jkstateName+"' benBuKeHuo='"+showD[i].benBuKeHuo+"' " +
        			"locoCheci='"+showD[i].locoCheci+"' locoNo='"+showD[i].locoNo+"' state='"+showD[i].state+"' " +
        			"time='"+showD[i].time+"' tuku='"+showD[i].tuku+"' locoTypeid='"
        			+showD[i].ttypeId+"' dname='"+showD[i].dname+"' locoAb='"+
        			showD[i].locoAB+"' lkjType='"+showD[i].lkjType+"'>" +
        			"<div class='content-locospread-middle-c-sub-c-tabDiv-Td-type'>" +showD[i].ttypeShortName+"-"+showD[i].locoNo+locoab
            		   +"</div><div class='content-locospread-middle-c-sub-c-tabDiv-Td-checiname'>"+showD[i].locoCheci+
            		  "</div></div>";
            	}else{
            		html=html+"<div class='content-locospread-middle-c-sub-c-tabDiv-Td'" +
        			" ttypeShortName='"+showD[i].ttypeShortName+"' date='"+showD[i].date+"' frontLineName='"+showD[i].frontLineName+"' alt='1'" +
        			"frontStationName='"+showD[i].frontStationName+"' limitedSpeed='"+showD[i].limitedSpeed+"'  speed='"+showD[i].speed+"'  lineName='"+showD[i].lineName+"' " +
        			"kilometer='"+showD[i].kilometer+"' jkstateName='"+showD[i].jkstateName+"' benBuKeHuo='"+showD[i].benBuKeHuo+"' " +
        			"locoCheci='"+showD[i].locoCheci+"' locoNo='"+showD[i].locoNo+"' state='"+showD[i].state+"'" +
        			"time='"+showD[i].time+"' tuku='"+showD[i].tuku+"' locoTypeid='"+showD[i].ttypeId+"' dname='"+
        			showD[i].dname+"'   locoAb='"+showD[i].locoAB+"' lkjType='"+showD[i].lkjType+"'>" +
        			"<div class='content-locospread-middle-c-sub-c-tabDiv-Td-type'>" +showD[i].ttypeShortName+"-"+showD[i].locoNo+locoab
            		   +"</div><div class='content-locospread-middle-c-sub-c-tabDiv-Td-checiname'>"+showD[i].locoCheci+
            		  "</div></div>";
            	}
            }            
            $(tabDiv).html(html);   
            if(showD.length<=10){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"50px","line-height":"50px"});
                this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"50px","line-height":"50px"});
            }else if(showD.length>10&&showD.length<=20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"100px","line-height":"100px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"100px","line-height":"100px"});
            }else if(showD.length>20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"145px","line-height":"145px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"145px","line-height":"145px"});
            }
            return $(this.$item);
        };
        var $buildItem2 = function (data, index) {	
        	this.$item  =$("#content-locospread-kunei-right-hidden");
        	this.$item.find(".content-locospread-middle-c-sub-title-depotname").text(data.name + ":");
            this.$item.find(".content-locospread-middle-c-sub-title-num").text("共" +data.typeCount + "台");
            var tabDiv=this.$item.find(".content-locospread-middle-c-sub-c-tabDiv");
            var showLocoNoDiv=this.$item.find(".content-locospread-middle-c-sub-c-sub-showLocoNo");
            $(tabDiv).html("");
            $(showLocoNoDiv).html("");
            var html="";

            var showD=data.locoOtherInfos;
            for(var i=0,len=showD.length;i<len;i++){
            	html=html+"<div class='content-locospread-kunei-train content-locospread-kunei-train-online'  ttypeShortname='"+showD[i].ttypeShortname+"' dname='"+data.name+"'>"+
            	          "<img  class='content-locospread-kunei-train-empty' src='../static/img/app/failureWarnning-images/train-online.png'/>"+
            	          "<div class='content-locospread-kunei-train-info'><div class='content-locospread-kunei-train-info-left'>"+showD[i].ttypeShortname+
            	          "</div><div class='content-locospread-kunei-train-info-right'>"+showD[i].locoCount+"台</div></div></div>";

            	var car=showD[i].locoNos;
            	var subhtml="<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub-outDiv hidden' id='content-locospread-middle-c-sub-c-sub-showLocoNo-sub"+showD[i].ttypeShortname+"' ttypeShortname='"+showD[i].ttypeShortname+"'>";

            	for(var a=0;a<car.length;a++){
            		
            		var locoab="";
                	if (car[a].locoAB==1) {//A
                		locoab=window.locoAb_A;
                	}else if (car[a].locoAB==2) {//B
                		locoab=window.locoAb_B;
                	}
            		
                    if(car[a].state=="在线"){
            				subhtml=subhtml+"<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub content-locospread-middle-c-sub-c-tabDiv-TdOnline' alt='2'" +
            				"ttypeShortName='"+showD[i].ttypeShortname+"' locoNo='"+car[a].locoNo+"' locoChec='"+car[a].locoCheci+"' " +
            				"state='"+car[a].state+"' tuku='"+car[a].tuku+"' locoTypeid='"+car[a].ttypeId+"' dname='"+car[a].dname+"'" +
            				" date='"+car[a].date+"'  time='"+car[a].time+"' speed='"+car[a].speed+"' locoAb='"+car[a].locoAB+"' benBuKeHuo='"+car[a].benBuKeHuo+"' lkjType='"+car[a].lkjType+"'>"+car[a].locoNo+locoab+"</div>";
            		}else{
            			subhtml=subhtml+"<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub' alt='2'" +
        				"ttypeShortName='"+showD[i].ttypeShortname+"' locoNo='"+car[a].locoNo+"' locoChec='"+car[a].locoCheci+"' " +
        				"state='"+car[a].state+"' tuku='"+car[a].tuku+"' locoTypeid='"+car[a].ttypeId+"' dname='"+car[a].dname+"'" +
        				" date='"+car[a].date+"'  time='"+car[a].time+"' speed='"+car[a].speed+"' locoAb='"+car[a].locoAB+"'  benBuKeHuo='"+car[a].benBuKeHuo+"' lkjType='"+car[a].lkjType+"'>"+car[a].locoNo+locoab+"</div>";
            		}
            	}
            	subhtml=subhtml+"</div>";
            	$(showLocoNoDiv).append(subhtml);
            }
            
            $(tabDiv).html(html);
            var totalWidth=$(".content-locospread-MainDiv").width()*0.95*0.98;
            var num=totalWidth/160;
            if(showD.length<=num){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"55px","line-height":"55px"});
                this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"55px","line-height":"55px"});
            }else if(showD.length>num&&showD.length<=num*2){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"120px","line-height":"120px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"120px","line-height":"120px"});
            }else if(showD.length>num*2){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"185px","line-height":"185px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"185px","line-height":"185px"});
            }
        	return $(this.$item);
        };
        var $buildItem3 = function (data, index) {	
        	this.$item  =$("#content-locospread-churuku-right-hidden");
        	this.$item.find(".content-locospread-middle-c-sub-title-depotname").text(data.name + ":");
            this.$item.find(".content-locospread-middle-c-sub-title-num").text("共" + data.typeCount + "台");
            var tabDiv=this.$item.find(".content-locospread-middle-c-sub-c-tabDiv");
            var showLocoNoDiv=this.$item.find(".content-locospread-middle-c-sub-c-sub-showLocoNo");
            $(tabDiv).html("");
            $(showLocoNoDiv).html("");
            var html="";

            var showD=data.locoOtherInfos2;
            for(var i=0,len=showD.length;i<len;i++){
            	html=html+"<div class='content-locospread-kunei-train content-locospread-kunei-train-online'  ttypeShortname='"+showD[i].ttypeShortname+"'  dname='"+data.name+"'>"+
            	          "<img  class='content-locospread-kunei-train-empty' src='../static/img/app/failureWarnning-images/train-online.png'/>"+
            	          "<div class='content-locospread-kunei-train-info'><div class='content-locospread-kunei-train-info-left'>"+showD[i].ttypeShortname+
            	          "</div><div class='content-locospread-kunei-train-info-right'>"+showD[i].locoCount+"台</div></div></div>";

            	var car=showD[i].locoNos;
            	var subhtml="<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub-outDiv hidden' id='content-locospread-middle-c-sub-c-sub-showLocoNo-sub"+showD[i].ttypeShortname+"' ttypeShortname='"+showD[i].ttypeShortname+"'>";
            	
            	for(var a=0;a<car.length;a++){
            		var locoab="";
                	if (car[a].locoAB==1) {//A
                		locoab=window.locoAb_A;
                	}else if (car[a].locoAB==2) {//B
                		locoab=window.locoAb_B;
                	}
                	if(car[a].state=="在线"){
        				subhtml=subhtml+"<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub content-locospread-middle-c-sub-c-tabDiv-TdOnline' alt='2'" +
        				"ttypeShortName='"+showD[i].ttypeShortname+"' locoNo='"+car[a].locoNo+"' locoChec='"+car[a].locoCheci+"' " +
        				"state='"+car[a].state+"' tuku='"+car[a].tuku+"' locoTypeid='"+car[a].ttypeId+"' dname='"+car[a].dname+"'" +
        				" date='"+car[a].date+"'  time='"+car[a].time+"' speed='"+car[a].speed+"' locoAb='"+car[a].locoAB+"'  benBuKeHuo='"+car[a].benBuKeHuo+"' lkjType='"+car[a].lkjType+"'>"+car[a].locoNo+locoab+"</div>";
	        		}else{
	        			subhtml=subhtml+"<div class='content-locospread-middle-c-sub-c-sub-showLocoNo-sub' alt='2'" +
	    				"ttypeShortName='"+showD[i].ttypeShortname+"' locoNo='"+car[a].locoNo+"' locoChec='"+car[a].locoCheci+"' " +
	    				"state='"+car[a].state+"' tuku='"+car[a].tuku+"' locoTypeid='"+car[a].ttypeId+"' dname='"+car[a].dname+"'" +
	    				" date='"+car[a].date+"'  time='"+car[a].time+"' speed='"+car[a].speed+"' locoAb='"+car[a].locoAB+"'  benBuKeHuo='"+car[a].benBuKeHuo+"' lkjType='"+car[a].lkjType+"'>"+car[a].locoNo+locoab+"</div>";
	        		}
            	}
            	subhtml=subhtml+"</div>";
            	$(showLocoNoDiv).append(subhtml);
            }
            
            $(tabDiv).html(html);        
            var totalWidth=$(".content-locospread-MainDiv").width()*0.95*0.98;
            var num=totalWidth/160;
            if(showD.length<=num){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"55px","line-height":"55px"});
                this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"55px","line-height":"55px"});
            }else if(showD.length>num&&showD.length<=num*2){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"120px","line-height":"120px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"120px","line-height":"120px"});
            }else if(showD.length>num*2){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"185px","line-height":"185px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"185px","line-height":"185px"});
            }
        	return $(this.$item);
        };
    	
    	return function(data){
    		var showBody1=$(".content-locospread-tuzhong-right");
    		var showBody2=$(".content-locospread-kunei-right");
    		var showBody3=$(".content-locospread-churuku-right");
    		$(showBody1).html("");
    		$(showBody2).html("");
    		$(showBody3).html("");
    		var html1=[];
    		var html2=[];
    		var html3=[];
    		var count1=0;
    		var count2=0;
    		var count3=0;
    		var count4=0;
    		/*var unOnlineCount=0;
    		var inUseCount=0;
    		var unUseCount=0;*/
    		for(var i=0,len=data.length;i<len;i++){
    			if(data[i]==null||!data[i].tuKu)continue;
    			/*unOnlineCount=data[i].unOnlineCount;//从未上线机车
    			inUseCount=data[i].inUseCount;
    			unUseCount=data[i].unUseCount;*/
    			if(data[i].tuKu=="途中"){
    				count1=data[i].lineCount;
    				
    				for(var a=0;a<data[i].locoLines.length;a++){
    					html1.push((new $buildItem1(data[i].locoLines[a],a)).html());
    				}
    			}
    			else if(data[i].tuKu=="库内"){
    				count2=data[i].lineCount;
    				for(var b=0;b<data[i].locoLineOthers.length;b++){
    					html2.push((new $buildItem2(data[i].locoLineOthers[b],b)).html());
    				}
    			}
    			else if(data[i].tuKu=="出入库"){
    				count3=data[i].lineCount;
    				for(var c=0;c<data[i].locoLineOthers.length;c++){
    					html3.push((new $buildItem3(data[i].locoLineOthers[c],c)).html());
    				}
    			}
    			else if(data[i].tuKu=="其它"){
    				count4=data[i].lineCount;
    			}
    			/*inUseCount+=data[i].inUseCount;
    			unUseCount+=data[i].unUseCount;*/
    		}
    		$("#content-locospread-tuzhong-totalcount").text(count1+"台");
    		$("#content-locospread-kunei-totalcount").text(count2+"台");
    		$("#content-locospread-churuku-totalcount").text(count3+"台");
    		/*$("#content-locospread-head-totalCountInUse,content-locospread-middle-top-totalCountInUse")
    		.text(inUseCount+"台");
    		$("#content-locospread-head-totalCountUnUse,content-locospread-middle-top-totalCountUnUse")
    		.text(unUseCount+"台");
    		$("#content-locospread-head-totalCountUnOnline,content-locospread-middle-top-totalCountUnOnline")
    		.text(unOnlineCount+"台");
    		$("#content-locospread-head-totalCount,#content-locospread-middle-top-totalCount")
    		.text((inUseCount+unUseCount)+"台");*/
    		
    		$(showBody1).append(html1.join(""));
    		$(showBody2).append(html2.join(""));
    		$(showBody3).append(html3.join(""));
    		setTimeout(function(){
    			RTU.invoke("app.onlinecountquery.query.initTab1Btn");
    		},25);
    	};
    });
    
    //初始化第一个tab页按钮事件
    RTU.register("app.onlinecountquery.query.initTab1Btn",function(){
    	return function(){
    		$(".content-locospread-middle-c-sub-title-img",$(".content-basic-div-new")).unbind("click").click(function(){
    			var parent=$(this).parent().parent();
    			var chidren=$(this).children();
    			var content=$(".content-locospread-middle-c-sub-c",$(parent));
   			    var content1=$(".content-locospread-middle-c-sub-c-sub",$(parent));
                var cars=$(".content-locospread-middle-c-sub-c-table-td-bg",$(content));
                if(!$(content).hasClass("hidden")){
    				$(content).addClass("hidden");
   				    $(content1).addClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_max.png");
                    $(cars).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    			}else{
    				$(content).removeClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_min.png");
    			}
    		});
    		
    		$(".content-locospread-middle-c-sub-c-tabDiv-Td",$(".content-locospread-tuzhong-right")).mouseover(function(e){
    			  $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");    			  
    			  var date=$(this).attr("date");
    			  var frontLineName=$(this).attr("frontLineName");
                  var speed=$(this).attr("speed");
    			  var frontStationName=$(this).attr("frontStationName");
    			  var jkstateName=$(this).attr("jkstateName");
    			  var benBuKeHuo=$(this).attr("benBuKeHuo");
    			  var kilometer=$(this).attr("kilometer");
    			  var limitedSpeed=$(this).attr("limitedSpeed");
    			  var lineName=$(this).attr("lineName");
    			  var locoCheci=$(this).attr("locoCheci");
    			  var locoNo=$(this).attr("locoNo");
    			  var state=$(this).attr("state");
    			  var time=$(this).attr("time");
    			  var ttypeShortName=$(this).attr("ttypeShortName");
    			  var tuku=$(this).attr("tuku");
    			  var locoAb=$(this).attr("locoAb");
    			  var locoab="";
    			  if (locoAb==1) {//A
              		 locoab=window.locoAb_A;
	              	}else if (locoAb==2) {//B
	              		locoab=window.locoAb_B;
	              	}
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  if(state=="在线"){
					  var locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
					  $("#tuzhongHoverDiv-tab-loco",$(locoTypeDiv)).text(ttypeShortName+"-"+locoNo+locoab);
					  $("#tuzhongHoverDiv-tab-state",$(locoTypeDiv)).text(tuku+"/"+state);
					  $("#tuzhongHoverDiv-tab-lkjstateName",$(locoTypeDiv)).text(jkstateName);
					  $("#tuzhongHoverDiv-tab-checiname",$(locoTypeDiv)).text(locoCheci);
					  $("#tuzhongHoverDiv-tab-benBuKeHuo",$(locoTypeDiv)).text(benBuKeHuo);
					  $("#tuzhongHoverDiv-tab-speed",$(locoTypeDiv)).text(speed);
					  $("#tuzhongHoverDiv-tab-limitedspeed",$(locoTypeDiv)).text(limitedSpeed);
					  $("#tuzhongHoverDiv-tab-linename",$(locoTypeDiv)).text(lineName);
					  $("#tuzhongHoverDiv-tab-frontlinename",$(locoTypeDiv)).text(frontLineName);
					  $("#tuzhongHoverDiv-tab-frongstationname",$(locoTypeDiv)).text(frontStationName);
					  
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
			          var height1 = document.documentElement.clientHeight;

			          if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
					  
					  
				  }else{
					  var locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
					  $("#locoTypeHoverDiv-tab-loco",$(locoTypeDiv)).text(ttypeShortName+"-"+locoNo+locoab);
					  
					  $("#locoTypeHoverDiv-tab-checkname",$(locoTypeDiv)).text(locoCheci);
					  $("#locoTypeHoverDiv-tab-state",$(locoTypeDiv)).text(tuku+"/"+state);
					
					  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text(date);
					  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text(time);
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
					 var height1 = document.documentElement.clientHeight;

					 if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
				  };
    		}).mousemove(function(e){
    			 var state=$(this).attr("state");
    			 var clientX=e.clientX;
    			 var clientY=e.clientY;
    			 var locoTypeDiv;
    			  if(state=="在线"){
    				  locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
    			  }else{
    				  locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
    			  }
    			  
    			  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9  ;
		          var height1 = document.documentElement.clientHeight;
		          
		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
    			  
    		}).mouseout(function(e){
    			$(this).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    			$("#content-locospread-tuzhongHoverDiv").addClass("hidden");
    			$("#content-locospread-locoTypeHoverDiv").addClass("hidden");
    		}).mousedown(function(e){
    			 if (3 == e.which) {
      				 var that=this;
      				 var clientX=e.clientX;
      				 var clientY=e.clientY;
      				 var rightDiv=$("#content-locospread-rightClickDiv");
      				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth*0.9  ;
	   		         var height1 = document.documentElement.clientHeight;
	   		          
	   		      if((clientX+width)>width1){
					  $(rightDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(rightDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(rightDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(rightDiv).css({"top":(clientY-30)+"px"});
				  }
	   				 $(rightDiv).removeClass("hidden");
	   				 
	   				 $("tr td",$(".content-locospread-rightClickDiv-tab")).unbind("click").click(function(){
	   					 var id=$(this).attr("id");
	   					 var ttypeshortname=$(that).attr("ttypeshortname");
	   					 var locoNo=$(that).attr("locono");
	   					 var locoAb=$(that).attr("locoAB");
	   					 var locoCheci=$(that).attr("locoCheci");
	   					 var locoTypeid=$(that).attr("locoTypeid");
	   					 var speed=$(that).attr("speed");
	   					 var depotname=$(that).attr("dname");
                         var benBuKeHuo=$(that).attr("benBuKeHuo");
                         var date=$(that).attr("date");
                         var time=$(that).attr("time");
                         var lkjType=$(that).attr("lkjType");
                         
	   					 if(id=="menu1"){
	   						 var loco=ttypeshortname+"-"+locoNo;
	   					  RTU.invoke("map.marker.findMarkersContainsNotExist", {
	                             pointId: loco,
	                             isSetCenter: true,
	                             stopTime: 5000,
	                             locoAb:locoAb,
	                             locoTypeid:locoTypeid,
	                             locoNo:locoNo,
	                             lkjType:lkjType,
	                             fnCallBack: function () {
	                             }
	                         });
//	                         var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
//	                         var btn = $(".amplifyWin", delbtn.parent());
//	                         btn.click();
	   				    	$("#closeBtn").click();
	                         $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu2"){
	   						 var sendData={
	                                 "id": "11111",
	                                 "name": locoCheci + "(" + ttypeshortname+"-"+locoNo + ")",
	                                  data: {
	                                      locoTypeid:locoTypeid,
	                                      locoNO:locoNo,
	                                      checiName:locoCheci,
	                                      locoTypeName:ttypeshortname,
	                                      locoAb:locoAb,
	                                      lkjType:lkjType
	                                  }
	                         };
	                          var arr=[];
	                          arr[0]=sendData;
	                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
	                          $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu3"){
                            var sendData={
                                locoTypeid:locoTypeid,
                                locoNo:locoNo,
                                locoAb:locoAb,
                                locoTypename:ttypeshortname,
                                benBuKeHuo:benBuKeHuo,
                                date:date+" "+time
                            };
                            if(lkjType!=1)
                            	RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                            else RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
	   					 }else if(id=="menu4"){
	   						var datas=[];
	   						 var checiName = locoCheci;
                             var locoTypeName = ttypeshortname;
                             var locoNO = locoNo;
                             var depotName =depotname;
                             datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
                             if(lkjType!=1)
                            	 RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                             else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
                             $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu5"){
	   					    var data = {
                                  "locotypeid": locoTypeid,
                                  "locono": locoNo,
                                  "locoTypeName": ttypeshortname,
                                  "locoAb": locoAb,
                                  "speed":speed
                              };
                              if(lkjType!=1)
	   					      RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
                              else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                              $(rightDiv).addClass("hidden");
	   					 }
	   				 });
	   				 
	   				 $("body").click(function(){
	   					$("#content-locospread-rightClickDiv").addClass("hidden");
	   				 });
      				 
      			 }
    		});
    		
    		window.preClick=null;
    		window.count=0;
    		$(".content-locospread-kunei-train",$(".content-basic-div-new")).unbind("click").click(function(){	 
    			 var ttypeShortname= $(this).attr("ttypeShortname");
    			 var dname=$(this).attr("dname");
    			 var str=dname+"-"+ttypeShortname;

    			 if(window.preClick!=null&&window.preClick==str){
    				 window.count++;
    				 if(window.count%2!=0){
    					 $(".content-locospread-kunei-train",$(this).parent().parent().parent().parent()).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    					 $(this).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    					 $(".content-locospread-middle-c-sub-c-sub",$(this).parent().parent().parent().parent()).addClass("hidden");
    				 }else{
    					//展开
    					 $(".content-locospread-kunei-train",$(this).parent().parent().parent().parent()).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    					 $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
    					 $(".content-locospread-middle-c-sub-c-sub",$(this).parent().parent().parent().parent()).removeClass("hidden");   					 
    				 }
    			 }else{
    				 window.preClick=str;
    				 window.count=0;
    				 $(".content-locospread-kunei-train",$(this).parent().parent().parent().parent()).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    				 $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
    				 $(".content-locospread-middle-c-sub-c-sub",$(this).parent().parent().parent().parent()).removeClass("hidden");
    			 }
    			 $(".content-locospread-middle-c-sub-c-sub-showLocoNo-sub-outDiv",$(this).parent().parent().parent().parent()).addClass("hidden");
    			 $("#content-locospread-middle-c-sub-c-sub-showLocoNo-sub"+ttypeShortname,$(this).parent().parent().parent().parent()).removeClass("hidden");
    		});
    		
    		$(".content-locospread-middle-c-sub-c-sub-showLocoNo-sub",$(".content-basic-div-new")).mouseover(function(e){
      		     $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
	      		   var locoAb=$(this).attr("locoAb");
	 			  var locoab="";
	 			  if (locoAb==1) {//A
	           		 locoab=window.locoAb_A;
		          }else if (locoAb==2) {//B
		              locoab=window.locoAb_B;
	              }
	      		  var loco=$(this).attr("ttypeshortname")+"-"+$(this).attr("locono")+locoab;
	   			  var state=$(this).attr("state");
	   			  var time=$(this).attr("time");
	   			  var date=$(this).attr("date");
	   			  var tuku=$(this).attr("tuku");
	   			  var locoChec=$(this).attr("locoChec");
	   			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
				  $("#locoTypeHoverDiv-tab-loco",$(locoTypeDiv)).text(loco);
				  $("#locoTypeHoverDiv-tab-state",$(locoTypeDiv)).text(tuku+"/"+state);
				  $("#locoTypeHoverDiv-tab-checkname",$(locoTypeDiv)).text(locoChec);
				
				  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text(date);
				  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text(time);
				 
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9 ;
		          var height1 = document.documentElement.clientHeight;

				  if((clientX)>width1){
					  $(locoTypeDiv).css({"left":(clientX-40-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX-90)+"px"});
				  }
				  if((clientY)>height1){
					  $(locoTypeDiv).css({"top":(clientY-60-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-60)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
      			
      		}).mousemove(function(e){
      			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9  ;
		          var height1 = document.documentElement.clientHeight;
		          
		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
      		}).mouseout(function(e){
      			$(this).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
      			$("#content-locospread-locoTypeHoverDiv").addClass("hidden");
      		}).mousedown(function(e){
      			 if (3 == e.which) {
      				 var that=this;
      				 var clientX=e.clientX;
      				 var clientY=e.clientY;
      				 var rightDiv=$("#content-locospread-rightClickDiv");
      				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth*0.9  ;
	   		         var height1 = document.documentElement.clientHeight;
	   		          
	   		      if((clientX+width)>width1){
					  $(rightDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(rightDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(rightDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(rightDiv).css({"top":(clientY-30)+"px"});
				  }
	   				 $(rightDiv).removeClass("hidden");
	   				 
	   				 $("tr td",$(".content-locospread-rightClickDiv-tab")).unbind("click").click(function(){
	   					 var id=$(this).attr("id");
	   					 var ttypeshortname=$(that).attr("ttypeshortname");
	   					 var locoNo=$(that).attr("locono");
	   					 var locoAb=$(that).attr("locoAB");
	   					 var locoCheci=$(that).attr("locoCheci");
	   					 var locoTypeid=$(that).attr("locoTypeid");
	   					 var speed=$(that).attr("speed");
	   					 var depotname=$(that).attr("dname");
                          var benBuKeHuo=$(that).attr("benBuKeHuo");
                          var date=$(that).attr("date");
                          var time=$(that).attr("time");
                          var lkjType=$(that).attr("lkjType");
	   					 if(id=="menu1"){
	   						 var loco=ttypeshortname+"-"+locoNo;
	   					  RTU.invoke("map.marker.findMarkersContainsNotExist", {
	                             pointId: loco,
	                             isSetCenter: true,
	                             stopTime: 5000,
	                             locoAb:locoAb,
	                             locoTypeid:locoTypeid,
	                             locoNo:locoNo,
	                             lkjType:lkjType,
	                             fnCallBack: function () {
	                             }
	                         });
//	                         var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
//	                         var btn = $(".amplifyWin", delbtn.parent());
//	                         btn.click();
	   					     $("#closeBtn").click();
	                         $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu2"){
	   						 var sendData={
	                                 "id": "11111",
	                                 "name": locoCheci + "(" + ttypeshortname+"-"+locoNo + ")",
	                                  data: {
	                                      locoTypeid:locoTypeid,
	                                      locoNO:locoNo,
	                                      checiName:locoCheci,
	                                      locoTypeName:ttypeshortname,
	                                      locoAb:locoAb,
	                                      lkjType:lkjType
	                                  }
	                         };
	                          var arr=[];
	                          arr[0]=sendData;
	                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
	                          $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu3"){

	   						 var sendData={
                                locoTypeid:locoTypeid,
                                locoNo:locoNo,
                                locoAb:locoAb,
                                locoTypename:ttypeshortname,
                                benBuKeHuo:benBuKeHuo,
                                date:date+" "+time
                            };
	   						if(lkjType!=1)
                            RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
	   						else RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData)
	   					 }else if(id=="menu4"){
	   						 var datas=[];
	   						 var checiName = locoCheci;
                             var locoTypeName = ttypeshortname;
                             var locoNO = locoNo;
                             var depotName =depotname;
                             datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
                             if(lkjType!=1)
                             RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                             else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
                             $(rightDiv).addClass("hidden");
	   					 }else if(id=="menu5"){
	   					    var data = {
                                  "locotypeid": locoTypeid,
                                  "locono": locoNo,
                                  "locoTypeName": ttypeshortname,
                                  "locoAb": locoAb,
                                  "speed":speed
                              };
	   					    if(lkjType!=1)
                              RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
	   					    else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                              $(rightDiv).addClass("hidden");
	   					 }
	   				 });
	   				 
	   				 $("body").click(function(){
	   					$("#content-locospread-rightClickDiv").addClass("hidden");
	   				 });
      			 }
      		});
    
            $("#searchLocoBtn").unbind("click").click(function(){
            	$(".content-locospread-middle-c-sub-c-table-td-bg").removeClass("content-locospread-middle-c-sub-c-table-td-bg");
                var loco=$("#searchLocoInput").val();
                var locoArr=loco.split("-");
                var locoTypeid=locoArr[0].toLocaleUpperCase();//机车简称
                    loco=loco.toLocaleUpperCase();//输入的字符转大写
                var lastChar =loco.substring(loco.length-1);//机车号最后一个字母
                    var number =loco.indexOf("-");
                	var imgBtn=$(".content-locospread-middle-c-sub-title-img",$(".content-basic-div-new"));
                	imgBtn.each(function() {
                		var imgBtnParent=$(this).parent().parent();
                		var chidren=$(imgBtnParent).children();
                		var content=$(".content-locospread-middle-c-sub-c",$(imgBtnParent));
                		if(!$(content).hasClass("hidden")){
                			$(this).click();
                		}
                	});
            	if (number>0) {//  机车简称-机车号查询
            		
            		if(!isNaN(lastChar)){//是数字   AB节为0的情况
            			//alert(loco);
            			$("div[ttypeshortname='"+locoTypeid+"']",$(".content-basic-div-new")).each(function() {
            				var ttypeshortname=$(this).attr("ttypeshortname");
            				var locono=$(this).attr("locono");
            				 var locoab=$(this).attr("locoab");
            				var alt=$(this).attr("alt");
            				if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
            					var str=ttypeshortname+"-"+locono;
            					if(str==loco){
            						if(alt=='1'){
            							var parent=$(this).parent().parent().parent().parent();
            							$(".content-locospread-middle-c-sub-title-img",$(parent)).click();
            							$(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
            						}else if(alt=='2'){
            							var parent1=$(this).parent().parent().parent().parent().parent();
            							$(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
            							var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
            							$("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
            							$(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
            						}
            						return false;
            					}
            				}
            			});
					}else {
						if (lastChar=="A") {    //AB节为  1的情况
							$("div[ttypeshortname='"+locoTypeid+"']",$(".content-basic-div-new")).each(function() {
								   var ttypeshortname=$(this).attr("ttypeshortname");
								   var locono=$(this).attr("locono");
								   var locoab=$(this).attr("locoab");
								   var alt=$(this).attr("alt");
								   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null&&locoab&&locoab!=null){
									   var str=ttypeshortname+"-"+locono+"A";
									   if(str==loco&&locoab==1){//  机车号  + AB节为1的情况
										   if(alt=='1'){
											   var parent=$(this).parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
											   
										   }else if(alt=='2'){
											   var parent1=$(this).parent().parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
											   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
											   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   }
										   return false;
									   }
								   }
							   });
						   }else if(lastChar=="B"){   //AB节为  2的情况
							   $("div[ttypeshortname='"+locoTypeid+"']",$(".content-basic-div-new")).each(function() {
								   var ttypeshortname=$(this).attr("ttypeshortname");
								   var locono=$(this).attr("locono");
								   var locoab=$(this).attr("locoab");
								   var alt=$(this).attr("alt");
								   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null&&locoab&&locoab!=null){
									   var str=ttypeshortname+"-"+locono+"B";
									   if(str==loco&&locoab==2){//  机车号  + AB节为1的情况
										   if(alt=='1'){
											   var parent=$(this).parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   }else if(alt=='2'){
											   var parent1=$(this).parent().parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
											   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
											   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   }
										   return false;
									   }
								   }
							   });
						   }
					}
				}else {//只是机车号查询  + AB 节 
					var locoNo =loco.substring(0,loco.length-1);//机车号
					if(!isNaN(lastChar)){//是数字   AB节为0的情况
						   $("div[locono='"+loco+"']",$(".content-basic-div-new")).each(function() {
							   var ttypeshortname=$(this).attr("ttypeshortname");
							   var locono=$(this).attr("locono");
							   var locoab=$(this).attr("locoab");
							   var alt=$(this).attr("alt");
							  // alert(locono+"---"+loco+"---"+locoab);
							   if(locono&&locono!=null&&locoab&&locoab!=null){
								   var str=locono;
								   if(str==loco){//  机车号  + AB节为0的情况
									   if(alt=='1'){
										   var parent=$(this).parent().parent().parent().parent();
										   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
										   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   
									   }else if(alt=='2'){
										   var parent1=$(this).parent().parent().parent().parent().parent();
										   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
										   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
										   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
										   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
									   }
									   return false;
								   }
							   }
						   });
						}else{
						   if (lastChar=="A") {    //AB节为  1的情况
							   $("div[locono='"+locoNo+"']",$(".content-basic-div-new")).each(function() {
								   var ttypeshortname=$(this).attr("ttypeshortname");
								   var locono=$(this).attr("locono");
								   var locoab=$(this).attr("locoab");
								   
								   var alt=$(this).attr("alt");
								   if(locono&&locono!=null&&locoab&&locoab!=null){
									   var str=locono;
									   if(str==locoNo&&locoab==1){//  机车号  + AB节为1的情况
										   if(alt=='1'){
											   var parent=$(this).parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
											   
										   }else if(alt=='2'){
											   var parent1=$(this).parent().parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
											   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
											   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   }
										   return false;
									   }
								   }
							   });
							
						   }else if(lastChar=="B"){   //AB节为  2的情况
							   $("div[locono='"+locoNo+"']",$(".content-basic-div-new")).each(function() {
								   var ttypeshortname=$(this).attr("ttypeshortname");
								   var locono=$(this).attr("locono");
								   var locoab=$(this).attr("locoab");
								   
								   var alt=$(this).attr("alt");
								   if(locono&&locono!=null&&locoab&&locoab!=null){
									   var str=locono;
									   if(str==locoNo&&locoab==2){//  机车号  + AB节为2的情况
										   if(alt=='1'){
											   var parent=$(this).parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
											   
										   }else if(alt=='2'){
											   var parent1=$(this).parent().parent().parent().parent().parent();
											   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
											   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
											   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
											   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
										   }
										   return false;
									   }
								   }
							   });
						   }
						}
				}
                
            });
            $(".content-locospread-middle-tuku-sub-title-img",$(".content-basic-div-new")).unbind("click").click(function(){
            	var parent=$(this).parent().parent();
            	var imgBtn = $(".content-locospread-middle-c-sub-title-img",$(parent));
            	if(clickCount%2==0){
            		$(".content-locospread-title-img",$(this).parent()).attr({"src":"../static/img/app/locomotivequery/01_up.png","title":"收起","alt":"收起"});
            		$(imgBtn).each(function(){
                		var imgBtnParent=$(this).parent().parent();
                		var content=$(".content-locospread-middle-c-sub-c",$(imgBtnParent));
                		if($(content).hasClass("hidden")){
                			$(this).click();
                		}
                	});
            		clickCount++;
            	}else{
            		$(".content-locospread-title-img",$(this).parent()).attr({"src":"../static/img/app/locomotivequery/01_down.png","title":"展开","alt":"展开"});
            		$(imgBtn).each(function(){
                		var imgBtnParent=$(this).parent().parent();
                		var chidren=$(imgBtnParent).children();
                		var content=$(".content-locospread-middle-c-sub-c",$(imgBtnParent));
                		if(!$(content).hasClass("hidden")){
                			$(this).click();
                		}
                	});
            		clickCount++;
            	}
            });
    	};
    });
/**********************************
 * 第二个tab
 *********************************/   
    //型号分布查询
    RTU.register("app.onlinecountquery.query.searchByLocoType",function(){
    	return function(){
    		var url="onlineloco/searchLocomotivesInfo?tuKuChuRuKu=";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	 RTU.invoke("app.onlinecountquery.query.Tab2.createHtml",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //第二个tab页组装html
    RTU.register("app.onlinecountquery.query.Tab2.createHtml",function(){    	
        var $buildItem = function (data, index) {
        	this.$item  =$("#content-locospread-middle-c-sub-hidden");
            this.$item.find(".content-locospread-middle-c-sub").attr("id","middle-c-sub-"+data.ttypeShortname);
            this.$item.find(".content-locospread-middle-c-sub-title-locoTypeName").text(data.ttypeShortname + ":");
            this.$item.find(".content-locospread-checkbox").attr("checked","checked").attr("locotypename",data.ttypeShortname);
            this.$item.find(".content-locospread-middle-c-sub-title-num").text("共"+ data.vehicleCount + "台");
            this.$item.find(".content-locospread-middle-c-sub-title-tz-num").text(data.tuZhongCount);
            this.$item.find(".content-locospread-middle-c-sub-title-kn-num").text(data.kuNeiCount);
            this.$item.find(".content-locospread-middle-c-sub-title-crk-num").text(data.chuRuKuCount);
            this.$item.find(".content-locospread-middle-c-sub-c-table").html("");
            
            var html = RTU.invoke("app.onlinecountquery.query.Tab2.createTRHtml",data);

            this.$item.find(".content-locospread-middle-c-sub-c-table").html(html).attr("locotypename",data.ttypeShortname);
            var showD=data.locoList;
            
            if(showD.length<=10){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"60px","line-height":"60px"});
                this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"60px","line-height":"60px"});
            }else if(showD.length>10&&showD.length<=20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"120px","line-height":"120px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"120px","line-height":"120px"});
            }else if(showD.length>20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"175px","line-height":"175px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"175px","line-height":"175px"});
            }
            return $(this.$item);
        };
    	return function(data){
    		var showBody=$(".content-locospread-middle-c");
    		$(showBody).html("");
    		var html=[];
    		/*var count=0;*/
    		var unOnlineCount=0;
    		var inUseCount=0;
    		var unUseCount=0;
    		for(var i=0,len=data.length;i<len;i++){
    			/*count=count+data[i].vehicleCount;*/
    			unOnlineCount=data[i].unOnlineCount;//从未上线机车
    			inUseCount=data[i].inUseCount;
    			unUseCount=data[i].unUseCount;
    			html.push((new $buildItem(data[i],i)).html());
    			shortTypeData[data[i].ttypeShortname] = data[i];
    		}
    		$(showBody).append(html.join(""));
    		/*$("#content-locospread-middle-top-totalCount").text(count+"台");
    		$("#content-locospread-middle-top-totalCountInUse").text(count+"台");*/
    		$("#content-locospread-head-totalCountInUse,#content-locospread-middle-top-totalCountInUse")
    		.text(inUseCount+"台");
    		$("#content-locospread-head-totalCountUnUse,#content-locospread-middle-top-totalCountUnUse")
    		.text(unUseCount+"台");
    		/*$("#content-locospread-head-totalCountUnOnline,content-locospread-middle-top-totalCountUnOnline")
    		.text(unOnlineCount+"台");*/
    		$("#content-locospread-head-totalCount,#content-locospread-middle-top-totalCount")
    		.text((inUseCount+unUseCount)+"台");
    		setTimeout(function(){
    			RTU.invoke("app.onlinecountquery.query.initTab2Btn");
    		},25);
    	};
    });
    
    RTU.register("app.onlinecountquery.query.Tab2.createTRHtml",function(){
    	return function(data){
    		var html="<tr>";
            var d=data.locoList;
            
            for(var j=0,len=d.length;j<len;j++){
            	if(j!=0&&j%10==0){
    				html=html+"</tr><tr>";
    			}
            	var locoab="";
            	if (d[j].locoAb==1) {//A
            		locoab=window.locoAb_A;
            	}else if (d[j].locoAb==2) {//B
            		locoab=window.locoAb_B;
            	}
            	
            	if(d[j].isOnline&&d[j].isOnline=="在线"){
            		html=html+"<td class='content-locospread-middle-c-sub-c-tabDiv-TdOnline' ttypeshortname='"+data.ttypeShortname+"' locotypename='"+data.ttypeShortname+"' locotypeid='"+d[j].locoTypeid+"' locono='"+d[j].locoNo+"' locoNo='"+d[j].locoNo+"' checiName='"+d[j].checiName+"' " +
            				"dname='"+d[j].dname+"' locoAb='"+d[j].locoAb+"' speed='"+d[j].speed+"'  isOnline='"+d[j].isOnline+"' time='"+d[j].time+"' tuKuChuRuKu='"+d[j].tuKuChuRuKu+"'" +
            				" benBuKeHuo='"+d[j].benBuKeHuo+"' frontLineName='"+d[j].frontLineName+"' frontStationName='"+d[j].frontStationName+"' jkstate='"+d[j].jkstate+"' limitedSpeed='"+d[j].limitedSpeed+"' " +
            				"lineName='"+d[j].lineName+"' lkjTime='"+d[j].lkjTime+"' alt='1' lkjType='"+d[j].lkjType+"'>"+data.ttypeShortname+"-"+d[j].locoNo+locoab+"<br>"+d[j].checiName+"</td>";
            	}else{
            		html=html+"<td  ttypeshortname='"+data.ttypeShortname+"'  locotypename='"+data.ttypeShortname+"' locotypeid='"+d[j].locoTypeid+"'  locono='"+d[j].locoNo+"' locoNo='"+d[j].locoNo+"'  checiName='"+d[j].checiName+"' dname='"+d[j].dname+"'" +
            				" locoAb='"+d[j].locoAb+"' speed='"+d[j].speed+"'  isOnline='"+d[j].isOnline+"' time='"+d[j].time+"' tuKuChuRuKu='"+d[j].tuKuChuRuKu+"' " +
            				 "benBuKeHuo='"+d[j].benBuKeHuo+"'  frontLineName='"+d[j].frontLineName+"' frontStationName='"+d[j].frontStationName+"' jkstate='"+d[j].jkstate+"' limitedSpeed='"+d[j].limitedSpeed+"' " +
            				"lineName='"+d[j].lineName+"' lkjTime='"+d[j].lkjTime+"' alt='1' lkjType="+d[j].lkjType+">"+data.ttypeShortname+"-"+d[j].locoNo+locoab+"<br>"+d[j].checiName+"</td>";
            	}
	            if(j==len-1){
	            	 for(var a=0;a<(10-d.length%10);a++){
	                 	html=html+"<td style='border:0px;background-color:white;visibility:hidden;'>&nbsp;</td>";
	                 }
	            	html=html+"</tr>";
	            }
            }
            return html;
    	};
    });

    //初始化第二个tab页按钮事件
    RTU.register("app.onlinecountquery.query.initTab2Btn",function(){
    	return function(){
    		$(".content-locospread-middle-c-sub-title-img").unbind("click").click(function(){
    			var parent=$(this).parent().parent();
    			var chidren=$(this).children();
    			var content=$(".content-locospread-middle-c-sub-c",$(parent));
    			if(!$(content).hasClass("hidden")){
    				$(content).addClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_max.png");
    			}else{
    				$(content).removeClass("hidden");
    				$(chidren).attr("src","../static/img/app/locomotivequery/01_min.png");
    			}
    		});
    		
            $(".content-locospread-middle-c-sub-c-scrollUp",$(".content-locospread-middle-c")).unbind("click").click(function(){
                var parent=$(this).parent().parent();
                var body=$(".content-locospread-middle-c-sub-c-tableDiv",$(parent));

                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(currentSrollTop-58);
            });
            
            $(".content-locospread-middle-c-sub-c-scrollDown",$(".content-locospread-middle-c")).unbind("click").click(function(){
                var parent=$(this).parent().parent();
                var body=$(".content-locospread-middle-c-sub-c-tableDiv",$(parent));
                
                var currentSrollTop=$(body).scrollTop();
                $(body).scrollTop(58+currentSrollTop);
            });
    		
    		$("tr td",$(".content-locospread-middle-c-sub-c-table",$(".content-locospread-middle-c"))).mouseover(function(e){
    			  $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
    			  var loco=$(this).text();
    			  var state=$(this).attr("isOnline");
    			  var time=$(this).attr("time");
    			  var tuKuChuRuKu=$(this).attr("tuKuChuRuKu");
    			  var frontLineName=$(this).attr("frontLineName");
    			  var frontStationName=$(this).attr("frontStationName");
    			  var jkstateName=$(this).attr("jkstateName");
    			  var limitedSpeed=$(this).attr("limitedSpeed");
    			  var lineName=$(this).attr("lineName");
    			  var lkjTime=$(this).attr("lkjTime");
    			  var ttypeShortname=$(this).attr("locotypename");
    			  var locoTypeid=$(this).attr("locoTypeid");
    			  var locoAb=$(this).attr("locoAb");
    			  var locoNo=$(this).attr("locoNo");
    			  var checiName=$(this).attr("checiName");
    			  var dname=$(this).attr("dname");
    			  var speed=$(this).attr("speed");
    			  var state=$(this).attr("isOnline");
    			  var benBuKeHuo=$(this).attr("benBuKeHuo");
    			  var locoAb=$(this).attr("locoAb");
    			  var locoab="";
    			  if (locoAb==1) {//A
              		 locoab=window.locoAb_A;
	              	}else if (locoAb==2) {//B
	              		locoab=window.locoAb_B;
	              	}
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
    			  
    			  if(state=="在线"){
					  var locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
					  $("#tuzhongHoverDiv-tab-loco",$(locoTypeDiv)).text(ttypeShortname+"-"+locoNo+locoab);
					  $("#tuzhongHoverDiv-tab-state",$(locoTypeDiv)).text(tuKuChuRuKu+"/"+state);
					  $("#tuzhongHoverDiv-tab-lkjstateName",$(locoTypeDiv)).text(jkstateName);
					  $("#tuzhongHoverDiv-tab-checiname",$(locoTypeDiv)).text(checiName);
					  $("#tuzhongHoverDiv-tab-benBuKeHuo",$(locoTypeDiv)).text(benBuKeHuo);
					  $("#tuzhongHoverDiv-tab-speed",$(locoTypeDiv)).text(speed);
					  $("#tuzhongHoverDiv-tab-limitedspeed",$(locoTypeDiv)).text(limitedSpeed);
					  $("#tuzhongHoverDiv-tab-linename",$(locoTypeDiv)).text(lineName);
					  $("#tuzhongHoverDiv-tab-frontlinename",$(locoTypeDiv)).text(frontLineName);
					  $("#tuzhongHoverDiv-tab-frongstationname",$(locoTypeDiv)).text(frontStationName);
					  
					  
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
			          var height1 = document.documentElement.clientHeight;

			          if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
				  }else{
					  var locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
					  $("#locoTypeHoverDiv-tab-loco",$(locoTypeDiv)).text(ttypeShortname+"-"+locoNo+locoab);
					  $("#locoTypeHoverDiv-tab-checkname",$(locoTypeDiv)).text(checiName);
					  $("#locoTypeHoverDiv-tab-state",$(locoTypeDiv)).text(tuKuChuRuKu+"/"+state);
					  if(time&&time!=""){
						  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text(time.substring(0,10));
						  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text(time.substring(10,time.length-1));
					  }else{
						  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text("");
						  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text("");
					  }
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
			          var height1 = document.documentElement.clientHeight;

			          if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
				  };
    			
    		}).mousemove(function(e){
    			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var state=$(this).attr("isOnline");
				  var locoTypeDiv;
				  if(state=="在线"){
					  locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
				  }else{
					  locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
				  }
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9  ;
		          var height1 = document.documentElement.clientHeight;
		          
		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
    		}).mouseout(function(e){
    			$(this).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
    			$("#content-locospread-locoTypeHoverDiv").addClass("hidden");
    			$("#content-locospread-tuzhongHoverDiv").addClass("hidden");
    		}).mousedown(function(e){
   			 if (3 == e.which) {
  				 var that=this;
  				 var clientX=e.clientX;
  				 var clientY=e.clientY;
  				 var rightDiv=$("#content-locospread-rightClickDiv");
  				 var width=$(rightDiv).width();
   				 var height=$(rightDiv).height();
   				 var width1 = document.documentElement.clientWidth*0.9  ;
   		         var height1 = document.documentElement.clientHeight;
   		          
   		      if((clientX+width)>width1){
				  $(rightDiv).css({"left":(clientX-50-width)+"px"});
			  }else{
				  $(rightDiv).css({"left":(clientX+20)+"px"});
			  }
			  if((clientY+height)>height1){
				  $(rightDiv).css({"top":(clientY-30-height)+"px"});
			  }else{
				  $(rightDiv).css({"top":(clientY-30)+"px"});
			  }
   				 $(rightDiv).removeClass("hidden");
   				 
   				 $("tr td",$(".content-locospread-rightClickDiv-tab")).unbind("click").click(function(){
   					 var id=$(this).attr("id");
            	     var ttypeshortname=$(that).attr("locotypename");
					 var locoNo=$(that).attr("locoNo");
					 var locoAb=$(that).attr("locoAB");
					 var locoCheci=$(that).attr("checiName");
					 var locoTypeid=$(that).attr("locoTypeid");
					 var speed=$(that).attr("speed");
					 var depotname=$(that).attr("dname");
                     var time=$(that).attr("time");
                     var benBuKeHuo=$(that).attr("benBuKeHuo");
                     var lkjType=$(that).attr("lkjType");
   					 if(id=="menu1"){
   						 var loco=ttypeshortname+"-"+locoNo;
                         RTU.invoke("map.marker.findMarkersContainsNotExist", {
                             pointId: loco,
                             isSetCenter: true,
                             stopTime: 5000,
                             locoAb:locoAb,
                             locoTypeid:locoTypeid,
                             locoNo:locoNo,
                             lkjType:lkjType,
                             fnCallBack: function () {
                             }
                         });
//                         var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
//                         var btn = $(".amplifyWin", delbtn.parent());
//                         btn.click();
                         $("#closeBtn").click();
                         $(rightDiv).addClass("hidden");
   					 }else if(id=="menu2"){
   						 var sendData={
                                 "id": "11111",
                                 "name": locoCheci + "(" + ttypeshortname+"-"+locoNo + ")",
                                  data: {
                                      locoTypeid:locoTypeid,
                                      locoNO:locoNo,
                                      checiName:locoCheci,
                                      locoTypeName:ttypeshortname,
                                      locoAb:locoAb,
                                      lkjType:lkjType
                                  }
                         };
                          var arr=[];
                          arr[0]=sendData;
                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
                          $(rightDiv).addClass("hidden");
   					 }else if(id=="menu3"){
   					  var sendData={
                              locoTypeid:locoTypeid,
                              locoNo:locoNo,
                              locoAb:locoAb,
                              locoTypename:ttypeshortname,
                              benBuKeHuo:benBuKeHuo,
                              date:time
                          };
   					  		if(lkjType!=1)
	   						RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
   					  		else RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
   					 }else if(id=="menu4"){
   						var datas=[];
   						 var checiName = locoCheci;
                         var locoTypeName = ttypeshortname;
                         var locoNO = locoNo;
                         var depotName =depotname;
                         datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
                         if(lkjType!=1)
                         RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
                         else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
                         $(rightDiv).addClass("hidden");
   					 }else if(id=="menu5"){
   					    var data = {
                              "locotypeid": locoTypeid,
                              "locono": locoNo,
                              "locoTypeName": ttypeshortname,
                              "locoAb": locoAb,
                              "speed":speed
                          };
   					    if(lkjType!=1)
                          RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
   					    else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                          $(rightDiv).addClass("hidden");
   					 }
   				 });
   				 
   				 $("body").click(function(){
   					$("#content-locospread-rightClickDiv").addClass("hidden");
   				 });
   			 }
    		});
    		
    		$(".content-locospread-checkbox",$(".content-locospread-middle-c-sub-title")).click(function(e){
    			var target = $(this);
    			var typeObject = {1:"途中",2:"库内",3:"出入库"};
    			var locotypename = target.attr("locotypename");
    			
    			var data = $.extend({},shortTypeData[locotypename]);
    			
    			var checkeds = $(".content-locospread-checkbox:checked",$("#middle-c-sub-"+locotypename));
    			var checkTypes = {};
    			$.each(checkeds, function(i,val){
    				var typeName = typeObject[$(val).val()];
    				checkTypes[typeName] = typeName;
    			});
    			
    			var locoListNew = [];
    			$.each(data.locoList, function(i,val){
    				if(checkTypes[val.tuKuChuRuKu] != null){
    					locoListNew.push(val);
    				}
    			});
    			
    			data.locoList = locoListNew;
    			
    			var html = RTU.invoke("app.onlinecountquery.query.Tab2.createTRHtml",data);
    			$(".content-locospread-middle-c-sub-c-table",$("#middle-c-sub-"+locotypename)).empty().html(html);
    			
    			setTimeout(function(){
        			RTU.invoke("app.onlinecountquery.query.initTab2Btn");
        		},25);
    		});
    		
    		   $("#searchLocoBtn1").unbind("click").click(function(){
                   var loco=$("#searchLocoInput1").val();
                   var locoArr=loco.split("-");
                   var locoTypeid=locoArr[0].toLocaleUpperCase();//机车简称
                       loco=loco.toLocaleUpperCase();//输入的字符转大写
                   var lastChar =loco.substring(loco.length-1);//机车号最后一个字母
                       var number =loco.indexOf("-");
                   
                   var imgBtn=$(".content-locospread-middle-c-sub-title-img",$(".content-locospread-middleDiv"));
                   imgBtn.each(function() {
                       var imgBtnParent=$(this).parent().parent();
                       var chidren=$(imgBtnParent).children();
                       var content=$(".content-locospread-middle-c-sub-c",$(imgBtnParent));
                       if(!$(content).hasClass("hidden")){
                          $(this).click();
                       }
                   });
                   if (number>0) {
                	   if(!isNaN(lastChar)){//是数字   AB节为0的情况
                		   $("td[ttypeshortname='"+locoTypeid+"']",$(".content-locospread-middleDiv")).each(function() {
                			   var ttypeshortname=$(this).attr("ttypeshortname");
                			   var locono=$(this).attr("locono");
                			   var alt=$(this).attr("alt");
                			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
                				   var str=ttypeshortname+"-"+locono;
                				   if(str==loco){
                					   if(alt=='1'){
                						   var parent=$(this).parent().parent().parent().parent().parent().parent();
                						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
                						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                						   
                					   }else if(alt=='2'){
                						   var parent1=$(this).parent().parent().parent().parent().parent();
                						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
                						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
                						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                					   }
                					   return false;
                				   }
                			   }
                		   });
                	   }else {
                		   //AB节为1的情况
                		   if (lastChar=="A") {
                			   $("td[ttypeshortname='"+locoTypeid+"']",$(".content-locospread-middleDiv")).each(function() {
                    			   var ttypeshortname=$(this).attr("ttypeshortname");
                    			   var locono=$(this).attr("locono");
                    			   var locoab=$(this).attr("locoab");
                    			   var alt=$(this).attr("alt");
                    			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
                    				   var str=ttypeshortname+"-"+locono+"A";
                    				   if(str==loco&&locoab==1){
                    					   if(alt=='1'){
                    						   var parent=$(this).parent().parent().parent().parent().parent().parent();
                    						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
                    						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                    						   
                    					   }else if(alt=='2'){
                    						   var parent1=$(this).parent().parent().parent().parent().parent();
                    						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
                    						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                    						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
                    						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                    					   }
                    					   return false;
                    				   }
                    			   }
                    		   });
                			   //AB节为2的情况
                		   }else if (lastChar=="B") {
                			   $("td[ttypeshortname='"+locoTypeid+"']",$(".content-locospread-middleDiv")).each(function() {
                    			   var ttypeshortname=$(this).attr("ttypeshortname");
                    			   var locono=$(this).attr("locono");
                    			   var locoab=$(this).attr("locoab");
                    			   var alt=$(this).attr("alt");
                    			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
                    				   var str=ttypeshortname+"-"+locono+"B";
                    				   if(str==loco&&locoab==2){
                    					   if(alt=='1'){
                    						   var parent=$(this).parent().parent().parent().parent().parent().parent();
                    						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
                    						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                    						   
                    					   }else if(alt=='2'){
                    						   var parent1=$(this).parent().parent().parent().parent().parent();
                    						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
                    						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
                    						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
                    						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
                    					   }
                    					   return false;
                    				   }
                    			   }
                    		   });
                		   }
                	   }
                   }else {//只是机车号+ab节查询
                	   var locoNo =loco.substring(0,loco.length-1);//机车号
   						if(!isNaN(lastChar)){//是数字   AB节为0的情况
	   						 $("td[locono='"+loco+"']",$(".content-locospread-middleDiv")).each(function() {
	              			   var ttypeshortname=$(this).attr("ttypeshortname");
	              			   var locono=$(this).attr("locono");
	              			   var alt=$(this).attr("alt");
	              			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
	              				   var str=locono;
	              				   if(str==loco){
	              					   if(alt=='1'){
	              						   var parent=$(this).parent().parent().parent().parent().parent().parent();
	              						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
	              						   
	              					   }else if(alt=='2'){
	              						   var parent1=$(this).parent().parent().parent().parent().parent();
	              						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
	              						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	              						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
	              					   }
	              					   return false;
	              				   }
	              			   }
	              		   });
   						}else {
	   						 if (lastChar=="A") {    //AB节为  1的情况
	   							$("td[locono='"+locoNo+"']",$(".content-locospread-middleDiv")).each(function() {
	 	              			   var ttypeshortname=$(this).attr("ttypeshortname");
	 	              			   var locono=$(this).attr("locono");
	 	              			   var locoab=$(this).attr("locoab");
	 	              			   var alt=$(this).attr("alt");
	 	              			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
	 	              				   var str=locono;
	 	              				   if(str==locoNo&&locoab==1){
	 	              					   if(alt=='1'){
	 	              						   var parent=$(this).parent().parent().parent().parent().parent().parent();
	 	              						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
	 	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
	 	              						   
	 	              					   }else if(alt=='2'){
	 	              						   var parent1=$(this).parent().parent().parent().parent().parent();
	 	              						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
	 	              						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
	 	              						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
	 	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
	 	              					   }
	 	              					   return false;
	 	              				   }
	 	              			   }
	 	              		   });
	   						 }else if (lastChar=="B") {//AB节为  2的情况
	   							$("td[locono='"+locoNo+"']",$(".content-locospread-middleDiv")).each(function() {
		 	              			   var ttypeshortname=$(this).attr("ttypeshortname");
		 	              			   var locono=$(this).attr("locono");
		 	              			   var locoab=$(this).attr("locoab");
		 	              			   var alt=$(this).attr("alt");
		 	              			   if(ttypeshortname&&ttypeshortname!=null&&locono&&locono!=null){
		 	              				   var str=locono;
		 	              				   if(str==locoNo&&locoab==2){
		 	              					   if(alt=='1'){
		 	              						   var parent=$(this).parent().parent().parent().parent().parent().parent();
		 	              						   $(".content-locospread-middle-c-sub-title-img",$(parent)).click();
		 	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
		 	              						   
		 	              					   }else if(alt=='2'){
		 	              						   var parent1=$(this).parent().parent().parent().parent().parent();
		 	              						   $(".content-locospread-middle-c-sub-title-img",$(parent1)).click();
		 	              						   var parent2=$(".content-locospread-middle-c-sub-c",$(this).parent().parent().parent().parent().parent());
		 	              						   $("div[ttypeshortname='"+ttypeshortname+"']",$(parent2)).click();
		 	              						   $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
		 	              					   }
		 	              					   return false;
		 	              				   }
		 	              			   }
		 	              		   });
							 }
						}
                   }
               });
    	};
    });
    
    
    
	/***********************
	 * 下面是第三个Tab的js
	 ***********************/    
    //查找所有的线路
    RTU.register("app.onlinecountquery.query.searchLine",function(){
    	return function(){
    		var url="line/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.onlinecountquery.query.setLine",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });

    //根据局来查找段
    RTU.register("app.onlinecountquery.query.searchDepot",function(){
    	return function(data){
    		var url="depot/searchDepotByBureau";
    		var param={
	              url: url,
	              data:{
	                  "bureau":data.bureau,
	              },
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.onlinecountquery.query.setDepot",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //查找所有的铁路局
    RTU.register("app.onlinecountquery.query.searchBureau",function(){
    	return function(){
    		var url="bureau/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.onlinecountquery.query.setBureau",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //设置线路下拉
    RTU.register("app.onlinecountquery.query.setLine",function(){
    	return function(data){
    		var LineHtml="<option value='0' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
    			LineHtml=LineHtml+"<option value="+item.lName+"  class='selectOptionCss'>"+item.lName+"</option>";
            });
    		$(".locospread-lineSelect").html(LineHtml);
    	};
    });
    
    //设置段的下拉
    RTU.register("app.onlinecountquery.query.setDepot",function(){
    	return function(data){
    		var depotHtml="<option value='0' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
    			depotHtml=depotHtml+"<option value="+item.shortname+"  class='selectOptionCss'>"+item.dName+"</option>";
            });
    		$(".locospread-depotSelect").html(depotHtml);
    		
    	};
    });
    
    //设置局的下拉
    RTU.register("app.onlinecountquery.query.setBureau",function(){
    	return function(data){
    		var bureauHtml="<option value='0' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
				bureauHtml=bureauHtml+"<option value="+item.bName+"  class='selectOptionCss'>"+item.bName+"</option>";
            });
    		$(".locospread-bureauSelect").html(bureauHtml);
    	};
    });
    
    /**
     * 清空所有条件
     */
    RTU.register("app.onlinecountquery.query.clearConditions",function(){
    	return function(){
    		$(".locospread-lineSelect").val("0");
    		$(".locospread-bureauSelect").val("0");
    		RTU.invoke("app.onlinecountquery.query.searchDepot",{bureau:"0"});
    		
    		 //位置
	   		 var position=$("input[name='locospread-position']"); 
	   		 $.each(position, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
	   				$(item).removeAttr("checked");
	   			 }
	        });
   		 
	   		 //是否在线
	   		 var status=$("input[name='locospread-status']"); 
	   		 $.each(status, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
		   				$(item).removeAttr("checked");
		   		 }
	         });
	   		 
	   		 //用途
	   		 var use=$("input[name='locospread-use']"); 
	   		 $.each(use, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
		   				$(item).removeAttr("checked");
		   		 }
	         });
	   		 
	   		 //种类
	   		 var kind=$("input[name='locospread-kind']"); 
	   		 $.each(kind, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
		   				$(item).removeAttr("checked");
		   		 }
	         });
	   		 
	   		 //行别
	   		 var updown=$("input[name='locospread-updown']"); 
	   		 $.each(updown, function (i, item) {
	   			 if($(item).attr("checked")=="checked"){
		   				$(item).removeAttr("checked");
		   		 }
	          });
    	};
    });
    
    /**
     * 清空所有统计的数据
     */
    RTU.register("app.onlinecountquery.query.clearResultCount",function(){
    	return function(){
    		$(".locospread-countResult-position").addClass("hiddenDiv");
    		$(".locospread-countResult-isonline").addClass("hiddenDiv");
    		$(".locospread-countResult-use").addClass("hiddenDiv");
    		$(".locospread-countResult-kind").addClass("hiddenDiv");
    		$(".locospread-countResult-updown").addClass("hiddenDiv");
    		

			$(".countResult-position-inway-count").text(0);
			$(".countResult-position-instation-count").text(0);
			$(".countResult-position-inwarehouse-count").text(0);
			$(".countResult-isonline-online-count").text(0);
			$(".countResult-isonline-unonline-count").text(0);
			$(".countResult-use-passenger-count").text(0);
			$(".countResult-use-goods-count").text(0);
			$(".countResult-use-motor-count").text(0);
			$(".countResult-use-high-count").text(0);
			$(".countResult-kind-IC-count").text(0);
			$(".countResult-kind-electric-count").text(0);
			$(".countResult-updown-down-count").text(0);
			
			$(".locospread-list-count").text(0);
    	};
    });
    
    /**
     * 得到所有的条件
     */
    function getconditions(){
    	var data={};
		
		data.line=$(".locospread-lineSelect").val()=="0"?"":$(".locospread-lineSelect").val();
		data.bureau=$(".locospread-bureauSelect").val()=="0"?"":$(".locospread-bureauSelect").val();
		data.depot=$(".locospread-depotSelect").val()=="0"?"":$(".locospread-depotSelect").val();
		//位置
		 var positionChecked=$("input[name='locospread-position']");  
		 var positionStr="";  
		 $.each(positionChecked, function (i, item) {
			 if($(item).attr("checked")=="checked"){
				 positionStr=positionStr+$(item).val()+",";
			 }
         });
		 if(positionStr!=""){
			 positionStr=positionStr.substring(0,positionStr.length-1);
		 }
		 data.positionStr=positionStr;
		 
		 //是否在线
		 var status=$("input[name='locospread-status']"); 
		 var statusStr="";  
		 $.each(status, function (i, item) {
			 if($(item).attr("checked")=="checked"){
				 statusStr=statusStr+$(item).val()+",";
			 }
         });
		 if(statusStr!=""){
			 statusStr=statusStr.substring(0,statusStr.length-1);
		 }
		 data.statusStr=statusStr;
		 
		 //用途
		 var use=$("input[name='locospread-use']"); 
		 var useStr="";  
		 $.each(use, function (i, item) {
			 if($(item).attr("checked")=="checked"){
				 useStr=useStr+$(item).val()+",";
			 }
         });
		 if(useStr!=""){
			 useStr=useStr.substring(0,useStr.length-1);
		 }
		 data.useStr=useStr;
		 
		 //种类
		 var kind=$("input[name='locospread-kind']"); 
		 var kindStr="";  
		 $.each(kind, function (i, item) {
			 if($(item).attr("checked")=="checked"){
				 kindStr=kindStr+$(item).val()+",";
			 }
         });
		 if(kindStr!=""){
			 kindStr=kindStr.substring(0,kindStr.length-1);
		 }
		 data.kindStr=kindStr;
		 
		 //行别
		 var updown=$("input[name='locospread-updown']"); 
		 var updownStr="";  
		 $.each(updown, function (i, item) {
			 if($(item).attr("checked")=="checked"){
				 updownStr=updownStr+$(item).val()+",";
			 }
         });
		 if(updownStr!=""){
			 updownStr=updownStr.substring(0,updownStr.length-1);
		 }
		 data.updownStr=updownStr;
		 
		 return data;
    }
  
    /**
     * 查询统计结果
     */
    RTU.register("app.onlinecountquery.query.searchResult",function(){
    	return function(data){
            RTU.invoke("header.msg.show","正在加载数据。。");
    		var url="onlineloco/distributionQuery?bName="+data.bureau+"&dName="+data.depot+"&lName="+data.line+"&page=1&pageSize=1000000&location="+data.positionStr+"&state="+data.statusStr+"&use="+data.useStr+"&vehicles="+data.kindStr+"&upDownLine="+data.updownStr;
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  window.ShowDatas=data.list.data.slice(0);

            		  RTU.invoke("app.onlinecountquery.query.setResultHidden");
            		  RTU.invoke("app.onlinecountquery.query.setTabList",data.list);
            		  RTU.invoke("app.onlinecountquery.query.countClickEvent");
                	  if(data.count&&data.count.data&&data.count.data.length>=0){//如果存在统计结果
                	      RTU.invoke("app.onlinecountquery.query.setResultCount",data.count);
                	  }else{//如果不存在统计结果，就直接隐藏统计div
                		  RTU.invoke("app.onlinecountquery.query.clearResultCount");
                	  }
                      RTU.invoke("header.msg.hidden");
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    /**
     * 将结果放到列表中显示
     */
    RTU.register("app.onlinecountquery.query.setTabList",function(){
    	return function(data){
    		if(data.totalRecords){
    			 $(".locospread-list-count").text(data.totalRecords);
    			 window.onlinecountGrid.refresh(data.data);
    		}else{
    			 $(".locospread-list-count").text(data.data.length);
    			 window.onlinecountGrid.refresh(data.data);
    		}
    	};
    });
    
    /**
     * 统计结果div的隐藏域显示
     */
    RTU.register("app.onlinecountquery.query.setResultHidden",function(){
    	return function(){
    		var conditions=getconditions();
    		if(conditions.positionStr!=""){
    			$(".locospread-countResult-position").removeClass("hiddenDiv");
    			$(".countResult-position-inway").addClass("hiddenSubDiv");
    			$(".countResult-position-instation").addClass("hiddenSubDiv");
    			$(".countResult-position-inwarehouse").addClass("hiddenSubDiv");
    			var a=conditions.positionStr.split(",");
    			$.each(a, function (i, item) {
    				$("div[alt='"+item+"']",$(".locospread-countResult-position")).removeClass("hiddenSubDiv");
    				if(i==0){
    					$("div[alt='"+item+"']",$(".locospread-countResult-position")).css("top","2px");
    				}else if(i==1){
    					$("div[alt='"+item+"']",$(".locospread-countResult-position")).css("top","10px");
    				}else if(i==2){
    					$("div[alt='"+item+"']",$(".locospread-countResult-position")).css("top","16px");
    				}
    			});
    		}else{
    			$(".locospread-countResult-position").addClass("hiddenDiv");
    		}
    		if(conditions.statusStr!=""){
    			$(".locospread-countResult-isonline").removeClass("hiddenDiv");
    			$(".countResult-isonline-online").addClass("hiddenSubDiv");
    			$(".countResult-isonline-unonline").addClass("hiddenSubDiv");
    			var a=conditions.statusStr.split(",");
    			$.each(a, function (i, item) {
    				$("div[alt='"+item+"']",$(".locospread-countResult-isonline")).removeClass("hiddenSubDiv");
    				if(i==0){
    					$("div[alt='"+item+"']",$(".locospread-countResult-isonline")).css("top","2px");
    				}else if(i==1){
    					$("div[alt='"+item+"']",$(".locospread-countResult-isonline")).css("top","6px");
    				}
    			});
    		}else{
    			$(".locospread-countResult-isonline").addClass("hiddenDiv");
    		}
    		if(conditions.useStr!=""){
    			$(".locospread-countResult-use").removeClass("hiddenDiv");
    			$(".countResult-use-passenger").addClass("hiddenSubDiv");
    			$(".countResult-use-goods").addClass("hiddenSubDiv");
    			$(".countResult-use-motor").addClass("hiddenSubDiv");
    			$(".countResult-use-high").addClass("hiddenSubDiv");
    			var a=conditions.useStr.split(",");
    			$.each(a, function (i, item) {
    				$("div[alt='"+item+"']",$(".locospread-countResult-use")).removeClass("hiddenSubDiv");
    				if(i==0){
    					$("div[alt='"+item+"']",$(".locospread-countResult-use")).css("top","2px");
    				}else if(i==1){
    					$("div[alt='"+item+"']",$(".locospread-countResult-use")).css("top","6px");
    				}else if(i==2){
    					$("div[alt='"+item+"']",$(".locospread-countResult-use")).css("top","10px");
    				}else if(i==3){
    					$("div[alt='"+item+"']",$(".locospread-countResult-use")).css("top","14px");
    				}
    			});
    		}else{
    			$(".locospread-countResult-use").addClass("hiddenDiv");
    		}
    		if(conditions.kindStr!=""){
    			$(".locospread-countResult-kind").removeClass("hiddenDiv");
    			$(".countResult-kind-IC").addClass("hiddenSubDiv");
    			$(".countResult-kind-electric").addClass("hiddenSubDiv");
    			var a=conditions.kindStr.split(",");
    			$.each(a, function (i, item) {
    				$("div[alt='"+item+"']",$(".locospread-countResult-kind")).removeClass("hiddenSubDiv");
    				if(i==0){
    					$("div[alt='"+item+"']",$(".locospread-countResult-updown")).css("top","2px");
    				}else if(i==1){
    					$("div[alt='"+item+"']",$(".locospread-countResult-updown")).css("top","6px");
    				}
    			});
    		}else{
    			$(".locospread-countResult-kind").addClass("hiddenDiv");
    		}
    		if(conditions.updownStr!=""){
    			$(".locospread-countResult-updown").removeClass("hiddenDiv");
    			$(".countResult-updown-up").addClass("hiddenSubDiv");
    			$(".countResult-updown-down").addClass("hiddenSubDiv");
    			var a=conditions.updownStr.split(",");
    			$.each(a, function (i, item) {
    				$("div[alt='"+item+"']",$(".locospread-countResult-updown")).removeClass("hiddenSubDiv");
    				if(i==0){
    					$("div[alt='"+item+"']",$(".locospread-countResult-updown")).css("top","2px");
    				}else if(i==1){
    					$("div[alt='"+item+"']",$(".locospread-countResult-updown")).css("top","6px");
    				}
    			});
    		}else{
    			$(".locospread-countResult-updown").addClass("hiddenDiv");
    		}
    		RTU.invoke("app.onlinecountquery.query.setResultPosition");
    	};
    });
    
    /**
     * 设置每一个统计类型div的样式
     */
    RTU.register("app.onlinecountquery.query.setResultPosition",function(){
    	return function(){
    		var width=$(".locospread-countResult").width();
    		var allDiv=["locospread-countResult-position","locospread-countResult-isonline","locospread-countResult-use","locospread-countResult-kind","locospread-countResult-updown"];
    		var resultDiv=allDiv;
    		var hiddenDiv=$(".hiddenDiv");
    		
    		hiddenDiv.each(function(){
        		for(var i=0;i<allDiv.length;i++){
        			if(allDiv[i]==$(this).attr("id")){
        				resultDiv.splice(i,1);
        				break;
        			}
        		}
        	});

        	for(var i=0;i<resultDiv.length;i++){
        		if(i==0){
        			if(resultDiv.length==1){
        				$("."+resultDiv[i]).css("left",(width-300)*0.5);
        			}else{
        				$("."+resultDiv[i]).css("left",((width-300)/(resultDiv.length+1)));
        			}
        		}else if(i==1) {
        			$("."+resultDiv[i]).css("left",((width-300)/(resultDiv.length+1)*2)+50);
        		}else if(i==2) {
        			$("."+resultDiv[i]).css("left",((width-300)/(resultDiv.length+1)*3)+100);
        		}else if(i==3) {
        			$("."+resultDiv[i]).css("left",((width-300)/(resultDiv.length+1)*4)+150);
        		}else if(i==4) {
        			$("."+resultDiv[i]).css("left",((width-300)/(resultDiv.length+1)*5)+200);
        		}
        	}
    	};
    });
    
    /**
     * 设置统计结果的数目到div中
     */
    RTU.register("app.onlinecountquery.query.setResultCount",function(){
    	return function(data){
    		var data=data.data;
    		for(var i=0;i<data.length;i++){
    			if(data[i].trainType=="位置"){
    				var list=data[i].trainList;
    				for(var j=0;j<list.length;j++){
    					if(list[j].trainType=="途中"){
    						$(".countResult-position-inway-count").text(list[j].count);
    					}else if(list[j].trainType=="库内"){
    						$(".countResult-position-instation-count").text(list[j].count);
    					}else if(list[j].trainType=="出入库"){
    						$(".countResult-position-inwarehouse-count").text(list[j].count);
    					}
    				}
    				
    			}else if(data[i].trainType=="状态"){
    				var list=data[i].trainList;
    				for(var j=0;j<list.length;j++){
    					if(list[j].trainType=="在线"){
    						$(".countResult-isonline-online-count").text(list[j].count);
    					}else if(list[j].trainType=="离线"){
    						$(".countResult-isonline-unonline-count").text(list[j].count);
    					}
    				}
    			}else if(data[i].trainType=="用途"){
    				var list=data[i].trainList;
    				for(var j=0;j<list.length;j++){
    					if(list[j].trainType=="客车"){
    						$(".countResult-use-passenger-count").text(list[j].count);
    					}else if(list[j].trainType=="货车"){
    						$(".countResult-use-goods-count").text(list[j].count);
    					}else if(list[j].trainType=="动车"){
    						$(".countResult-use-motor-count").text(list[j].count);
    					}else if(list[j].trainType=="高铁"){
    						$(".countResult-use-high-count").text(list[j].count);
    					}
    				}
    			}else if(data[i].trainType=="车种"){
    				var list=data[i].trainList;
    				for(var j=0;j<list.length;j++){
    					if(list[j].trainType=="内燃"){
    						$(".countResult-kind-IC-count").text(list[j].count);
    					}else if(list[j].trainType=="电力"){
    						$(".countResult-kind-electric-count").text(list[j].count);
    					}
    				}
    			}else if(data[i].trainType=="行别"){
    				var list=data[i].trainList;
    				for(var j=0;j<list.length;j++){
    					if(list[j].trainType=="上行"){
    						$(".countResult-updown-up-count").text(list[j].count);
    					}else if(list[j].trainType=="下行"){
    						$(".countResult-updown-down-count").text(list[j].count);
    					}
    				}
    			}
    		}
    	};
    });
    
    /**
     * 点击统计结果的div，刷新列表
     */
    RTU.register("app.onlinecountquery.query.countClickEvent",function(){
    	return function(){
    		$(".countResult-position-inway").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].location=="途中"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-position-instation").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].location=="库内"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-position-inwarehouse").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].location=="出入库"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		
    		$(".countResult-isonline-online").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].state=="在线"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-isonline-unonline").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].state=="离线"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		
    		$(".countResult-use-passenger").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].use=="客车"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-use-goods").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].use=="货车"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-use-motor").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].use=="动车"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-use-high").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].use=="高铁"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		
    		$(".countResult-kind-IC").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].vehicles=="内燃"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-kind-electric").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].vehicles=="电力"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		
    		$(".countResult-updown-up").click(function(){
    			var datas=  window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].upDown=="上行"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    		$(".countResult-updown-down").click(function(){
    			var datas=window.ShowDatas;
        		var datasLen=datas.length;
        		var selectData=[];
        		
    			for(var i=0;i<datasLen;i++){
    				if(datas[i].upDown=="下行"){
    					selectData.push(datas[i]);
    				}
    			}
    			RTU.invoke("app.onlinecountquery.query.setTabList",selectData);
    		});
    	};
    });
    
    RTU.register("app.onlinecountquery.query.init", function () {
        //var data = RTU.invoke("app.setting.data", "onlinecountquery");
       // if (data && data.isActive) {
            RTU.invoke("app.onlinecountquery.query.activate");
        //}
        return function () {
            return true;
        };
    });

    RTU.register("app.onlinecountquery.query.deactivate", function () {
        return function () {
            if (popuwnd_onlleft) {
                popuwnd_onlleft.hidden();
                RTU.invoke("header.msg.hidden");
            }
            if(window.yunxingjiluPopuwnd){
            	window.yunxingjiluPopuwnd.close();
            }
        };
    });
    
});
