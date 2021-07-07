RTU.DEFINE(function (require, exports) {
/**
 * 模块名：设备监测
 * name：equipmentdetection
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("../../../css/app/facilitymonitoring.css");
    
    var popuwnd_search = null;
    var popuwnd_list = null;
    var popuwnd_datail = null;
    var initJs=false;
    var g;


    //显示15型机车详细窗口
    RTU.register("app.equipment15detection.showDatailWin", function () {
        return function (data) {
            RTU.invoke("app.equipmentdetection.loadHtml", { url: "../app/modules/facility15monitoring-Detail.html", fn: function (html) {
            	if (popuwnd_datail) {
                    popuwnd_datail.close();
                    delete popuwnd_datail;
                    popuwnd_datail = null;
                }
                popuwnd_datail = new PopuWnd({
                    title: "新一代LKJ机车设备详细" + "(" + data.locoTypeShortname+ "-"+data.locono+")",
                    html: html,
                    width: 670,
                    height: 330,
                    left: 360,
                    top: 60,
                    shadow: true
                });
                popuwnd_datail.myClose = popuwnd_datail.close;
                popuwnd_datail.close = function () {
                    this.hidden();
                };
                popuwnd_datail.init();
                $(".equipment-monitoring-main-content-div,.equipment-detail-div").css("height",263);
                $(".equipment-monitoring-main-div").css("height",320);
                return popuwnd_datail;
            }, initEvent: function () {
                $(".equipment-monitoring-operator-tab-ul li").click(function () {
                    $(this).css({ "border-bottom": "0px", "background": "#FFF" }).siblings().css({ "border-bottom": "1px solid gray", "background": "#F2F2F2" });
                    $("." + this.id + "-div").removeClass("hidden").siblings().addClass("hidden");
//                    $(".operator-down-div").removeClass("hidden");
                    /////tsc和tax先屏蔽历史记录跳转
                   if($(this).attr("id")=="tsc"||$(this).attr("id")=="tax")
                	   {
                	   		
                	   		$(".history-btn").addClass("hidden");
                	   }
                   else
                	   {
                	   		$(".equipment-monitoring-main-content-div,.equipment-detail-div").css("height",263);
                	   		$(".history-btn").removeClass("hidden");
                	   }
                });
                $(function(){
                	 $(".history-btn").click(function(){
                		 if(!initJs)
                			 {
//                			 	require("app/lkjequipmentversionhistoryquery/app-locoquery-lkjequipmenthistoryquery.js");
                			 	RTU.invoke("app.module.active","lkjequipmentversionhistoryquery");		
                			 }   
                		
                		 RTU.invoke("app.lkjequipmentversionhistoryquery.query.activate",data.locono);
                		 $(".lkjequipment_locoNo-input").val(data.locono);
                		
                     });
                });
               
                RTU.invoke("app.equipment15detection.detailData.init", data);
                RTU.invoke("app.tscequipment.detailData.init",data);
            }
            });
        };
    });
    
    //显示详细窗口
    RTU.register("app.equipmentdetection.showDatailWin", function () {
        return function (data) {
        	RTU.invoke("app.equipmentdetection.loadHtml", { url: "../app/modules/facilitymonitoring/facilitymonitoring-Detail.html", fn: function (html) {
            	if (popuwnd_datail) {
                    popuwnd_datail.close();
                    delete popuwnd_datail;
                    popuwnd_datail = null;
                }
            	
            	var locoTypeNameAndLocoNoAndLocoAb=data.locoTypeShortname+ "-"+data.locono;
            	if (data.locoAb !="1"&&data.locoAb!="2") {
                } else if (data.locoAb == "1") {
                	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
                } else {
                	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_B;
                }
            	
                popuwnd_datail = new PopuWnd({
                    title: "机车详细" + "（" +locoTypeNameAndLocoNoAndLocoAb+"）",   // data.locoTypeShortname+ "-"+data.locono
                    html: html,
                    width: 670,
                    height: 545,
                    left: 380,
                    top: 60,
                    shadow: true
                });
                popuwnd_datail.myClose = popuwnd_datail.close;
                popuwnd_datail.close = function () {
                    this.hidden();
                };
                popuwnd_datail.init();

                return popuwnd_datail;
            }, initEvent: function () {
                $(".equipment-monitoring-operator-tab-ul li").click(function () {
                    $(this).css({ "border-bottom": "0px", "background": "#FFF" }).siblings().css({ "border-bottom": "1px solid gray", "background": "#F2F2F2" });
                    $("." + this.id + "-div").removeClass("hidden").siblings().addClass("hidden");
//                    $(".operator-down-div").removeClass("hidden");
                    /////tsc和tax先屏蔽历史记录跳转
                   if($(this).attr("id")=="tsc"||$(this).attr("id")=="tax")
                	   {
                	   		$(".history-btn").addClass("hidden");
                	   }
                   else
                	   {
                	   		$(".history-btn").removeClass("hidden");
                	   }
                });
                $(function(){
                	 $(".history-btn").click(function(){
                		 if(!initJs)
                			 {
//                			 	require("app/lkjequipmentversionhistoryquery/app-locoquery-lkjequipmenthistoryquery.js");
                			 	RTU.invoke("app.module.active","lkjequipmentversionhistoryquery");		
                			 }   
                		
                		 RTU.invoke("app.lkjequipmentversionhistoryquery.query.activate",data.locono);
                		 $(".lkjequipment_locoNo-input").val(data.locono);
                		
                     });
                });
               
                RTU.invoke("app.equipmentdetection.detailData.init", data);
                RTU.invoke("app.tscequipment.detailData.init",data);
            }
            });
        };
    });
    
    //画线，暂时不分开，过后整理
    RTU.register("app.equipmentdetection.drawline.init", function () {
        var point = function (x, y) {//画点
            var oDiv = document.createElement('div');
            oDiv.style.position = 'absolute';
            oDiv.style.height = '1px';
            oDiv.style.width = '1px';
            oDiv.style.backgroundColor = '#EEE9E9';
            oDiv.style.left = x + 'px';
            oDiv.style.top = y + 'px';
            return oDiv; //注意：返回的值是一个dom节点，但并未追加到文档中
        };
        var drawLine = function (x1, y1, x2, y2) {//画一条直线的方法
            var x = x2 - x1; //宽
            var y = y2 - y1; //高
            var frag = document.createDocumentFragment();
            if (Math.abs(y) > Math.abs(x)) {//那个边更长，用那边来做画点的依据（就是下面那个循环），如果不这样，当是一条垂直线或水平线的时候，会画不出来
                if (y > 0)//正着画线是这样的
                    for (var i = 0; i < y; i++) {
                        var width = x / y * i ; //x/y是直角两个边长的比，根据这个比例，求出新坐标的位置
                        {

                            frag.appendChild(point(width + x1, i + y1));
                        }
                    }
                if (y < 0) {//有时候是倒着画线的
                    for (var i = 0; i > y; i--) {
                        var width = x / y * i;
                        {
                            frag.appendChild(point(width + x1, i + y1));
                        }
                    }
                }
            } //end if
            else {

                if (x > 0)//正着画线是这样的
                    for (var i = 0; i < x; i++) {
                        var height = y / x * i;
                        {

                            frag.appendChild(point(i + x1, height + y1));
                        }
                    }
                if (x < 0) {//有时候是倒着画线的
                    for (var i = 0; i > x; i--) {
                        var height = y / x * i;
                        {
                            frag.appendChild(point(i + x1, height + y1));
                        }
                    }
                } //end if
            }
            $(".detail-up-container-div").append(frag);
        };

        return function () {
            //2G
            drawLine(300, 100, 450, 50);
            //3G
            drawLine(350, 120, 450, 100);
            //厂家
            drawLine(50, 80, 50, 390);
            //CPU
            drawLine(70, 330, 450, 480);
            //wlan无线模块
            drawLine(40, 300, 450, 430);
            //CAN
            drawLine(300, 300, 450, 370);
            //RS485
            drawLine(130, 230, 450, 320);
            //以太网
            drawLine(80, 180, 450, 260);
            //GPS模块卫星数
            drawLine(240, 200, 450, 210);
            //GPS模块
            drawLine(180, 180, 450, 160);
        };
    });    

    //创建查询窗口
    RTU.register("app.equipmentdetection.query.activate", function () {
        return function () {
//        	alert(111);
        	RTU.invoke("header.msg.hidden");
            $(".popuwnd-title-text:contains('机车查询')").parent(".popuwnd").trigger("click");
            //查询窗口
            RTU.invoke("app.equipmentdetection.loadHtml", { url: "../app/modules/facilitymonitoring/facilitymonitoring-query.html", fn: function (html) {
                if (!popuwnd_search) {
                    popuwnd_search = new PopuWnd({
                        title: "设备监测",
                        html: html,
                        width: 240,
                        height: 510,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    popuwnd_search.myClose = popuwnd_search.close;
                    popuwnd_search.close = function () {
                        this.hidden();
                    };
                    popuwnd_search.init();
                }
                else {
                    popuwnd_search.init();
                }
                popuwnd_search.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	 psModel.cancelScribe("refreshData", window.equipmentRefresh);
                });
                return popuwnd_search;
            }, initEvent: function () {
                $("#f_search").inputTip({ text: "" });
                
                 g = new RTGrid({
      			    datas:trItem.allData,
                    containDivId: "carListContain-grid",
                    tableWidth:220,
                    tableHeight:365,
                    isSort: true, //是否排序
                    hasCheckBox: false, //是否有checkbox
                    showTrNum: false, //是否显示行号
                    beforeLoad:function(that){
         				that.pageSize =3000;
         			},
                    isShowPagerControl:false,
//                    colNames: ["状态","机车","tt","车次"],//arry=["姓名","性别"]
//                    colModel: [{name:"isOnline", isSort: true},{name:"locoNO", isSort: true},{name:"locoTypeid", isSort: true},{name:"checiName", isSort: true}],//[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                    colNames: ["状态","机车","车次"],//arry=["姓名","性别"]
                    colModel: [{name:"isOnline", isSort: true},{name:"locoNO",width:88, isSort: true},{name:"checiName", isSort: true}],//[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                    beforeSortFn: function (sname, isUp, that) {
                        var sname = that.sortParam.itemName;
                        if (sname == "isOnline") {
                            sname = "isOnline";
                        }
                        
                        if (sname == "locoNO") {
                            sname = "train";
                        }
                        if (sname == "locoTypeStr") {
                            sname = "train";
                        }
                        
                        if (sname == "depotName") {
                            sname = "DShortname";
                        }
                        if (sname == "lineName") {
                            sname = "LName";
                        }
                        if (sname == "sName") {
                            sname = "SName";
                        }
                        if (sname == "limitSpeed") {
                            sname = "limitedSpeed";
                        }
                        if (sname == "receiveTimeStr") {
                            sname = "lkjTime";
                        }
                        var exparm = { "sortField": sname, "sortOrder": that.sortParam.upAndDown };
                        window.trItem.extendParam = exparm;
                        if (trItem.httpRequest) {//ajax停止
                            trItem.httpRequest.abort();
                            trItem.httpRequest = null;
                        }
                        trItem.loadFn();
                        return true;
                    },
                    loadPageCp:function(t){
                  		t.cDiv.css("left","210px");
                  		t.cDiv.css("top","340px");
                  		$("#carListContain-grid .RTGrid_Bodydiv").css("height","310px");   
                  		if(currentTr){
                  			var trs = $(".RTTable-Body tbody  tr", g.cDiv);
                   			trs.each(function(i,item){
                   				var cbd = $(item).children(" td[itemname='locoNO']").text();
           						var cdata=cbd.split("-");
       							if(cdata[0] ==currentTr.data.locoTypeName&&cdata[1] == currentTr.data.locoNO){
            							$(item).addClass("RTGrid_clickTr");
            							 return false;
            					}
               							
                   			});
                   
                  		}
                  		currentTr=null;
                  			
                  	}
			          ,replaceTd:[{index:0,fn:function(data){
			        	  if (data == "1"||data == "2") {
                              return "<img src='../static/img/app/online_pic_14_14.png'>";
                          } else if (data == "3"||data == "4") {
                              return "<img src='../static/img/app/outline_pic_14_14.png'>";
                          }
			          }},{index:1,fn:function(arg0,arg1,arg2,arg3){
			        	   if(arg3.locoAb !="1"&&arg3.locoAb!="2"){
			        		   return arg3.locoTypeName+"-"+arg3.locoNO;
				       	   }else if(arg3.locoAb=="1"){
				       		   return arg3.locoTypeName+"-"+arg3.locoNO+window.locoAb_A;
				       	   }else {
				       		   return arg3.locoTypeName+"-"+arg3.locoNO+window.locoAb_B;
				       	   }
			          }}]
			          ,clickTrEvent:function(){
			        	  var lkjType=g.currClickItem().data.lkjType;
			        	  if(lkjType!=1)
			        		  RTU.invoke("app.equipmentdetection.showDatailWin", { locotypeid: g.currClickItem().data.locoTypeid, locono: g.currClickItem().data.locoNO,locoAb:g.currClickItem().data.locoAb, locoTypeShortname: g.currClickItem().data.locoTypeName});
			        	  else
			        		  RTU.invoke("app.equipment15detection.showDatailWin", { locotypeid: g.currClickItem().data.locoTypeid, locono: g.currClickItem().data.locoNO,locoAb:g.currClickItem().data.locoAb, locoTypeShortname: g.currClickItem().data.locoTypeName});
			          }
	             });

                $("#f_btnSearch").click(function () {                	
               try{    
            	   psModel.searchNow({token:window.equipmentRefresh});
                } catch (e) {
                }
                });

                $("#f_btnAllSearch").click(function () {
                	$("#f_search").val("");
                	RTU.invoke("app.equipmentdetection.listData.init",false);
                	 psModel.searchNow({token:window.equipmentRefresh});
                });
                $("#f_btnAllSearch").click();

            }
            });
        };
    });
    
    
    RTU.register("app.tscequipment.detailData.init", function () {
        return function (data) {//data.locotypeid   data.locono
            var url = "../tSCStatus/findTSCInfo?locoTypeid="+data.locotypeid+"&locoNo="+data.locono+"&locoAb="+data.locoAb ;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                	data = data.data;
                	if(data != null){
                		$(".changjia").text(data.deviceCorp);
                		$(".tsc").text(data.tscType);
                		$(".version").text(data.softver);
                		
                		$(".equip_deviceCorpIf").text(data.deviceCorp);
                		$(".equip_softver").text(data.tscType);
                		$(".equip_B_proVerIf").text(data.softver);
                	}
                }
            });
        };
    });
    ///插件数据加载
    var currentTr=null;
    RTU.register("app.equipmentdetection.listData.init",function(){
    	var initGrid=function(str){
    		 if(g){
    			 var t = g.currClickItem();
    			    if(t.item){
	      				currentTr = g.currClickItem(); 
	      				currentTr.count =1;
    			    }
    			    g.refresh(str);
    		  }else{
    			   g = new RTGrid({
    					  datas:str,
    		              containDivId: "carListContain-grid",
    		              tableWidth:220,
    		              tableHeight:365,
    		              hasCheckBox: false, //是否有checkbox
    		              showTrNum: false, //是否显示行号
    		              beforeLoad:function(that){
    	         				that.pageSize =3000;
    	         			},
    		              isShowPagerControl:false,
    		              colNames: ["状态","机车"],//arry=["姓名","性别"]
    		              colModel: [{name:"isOnline"},{name:"locoNO"}],//[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
    		              loadPageCp:function(t){
    		             	
    		                  		t.cDiv.css("left","210px");
    		                  		t.cDiv.css("top","340px");
    		                  		$("#carListContain-grid .RTGrid_Bodydiv").css("height","310px");   
    		                  		if(currentTr){
    		                  			var trs = $(".RTTable-Body tbody  tr", g.cDiv);
    		                   			trs.each(function(i,item){
    		                   				var cbd = $(item).children(" td[itemname='locoNO']").text();
		                   						var cdata=cbd.split("-");
	                   							if(cdata[0] ==currentTr.data.locoTypeName&&cdata[1] == currentTr.data.locoNO){
	    	                							$(item).addClass("RTGrid_clickTr");
	    	                							 return false;
    	                						}
    		                   			});
    		                   
    		                  		}
    		                  		currentTr=null;
    		                  			
    		                  	}
    		          ,replaceTd:[{index:0,fn:function(data){
    		          			return data==0?"<img src='../static/img/app/Sig_1.png'/>":(data==1?"<img src='../static/img/app/Sig_3.png'/>":"<img src='../static/img/app/Sig_1.png'/>");
    		          }},{index:1,fn:function(arg0,arg1,arg2,arg3){
    		        	   if(arg3.locoAb !="1"&&arg3.arg3!="2"){
    		       		       return arg3.locoTypeName+"-"+arg3.locoNO;
    			       	   }else if(arg3.locoAb=="1"){
    			       		   return arg3.locoTypeName+"-"+arg3.locoNO+window.locoAb_A;
    			       	   }else {
    			       		   return arg3.locoTypeName+"-"+arg3.locoNO+window.locoAb_B;
    			       	   }
    		          }}]
    		          ,clickTrEvent:function(){
    		        	  var lkjType=g.currClickItem().data.lkjType;
			        	  if(lkjType!=1)
			        		  RTU.invoke("app.equipmentdetection.showDatailWin", { locotypeid: g.currClickItem().data.locoTypeid, locono: g.currClickItem().data.locoNO,locoAb:g.currClickItem().data.locoAb, locoTypeShortname: g.currClickItem().data.locoTypeName});
			        	  else
			        		  RTU.invoke("app.equipment15detection.showDatailWin", { locotypeid: g.currClickItem().data.locoTypeid, locono: g.currClickItem().data.locoNO,locoAb:g.currClickItem().data.locoAb, locoTypeShortname: g.currClickItem().data.locoTypeName});
    		          }
    		          });
    		  }
    	
    	};
    	 
    	return function(str){
    		 psModel.cancelScribe("refreshData", window.equipmentRefresh);
			window.equipmentRefresh=psModel.subscribe("refreshData",function(t,data){
	    		  initGrid(data);
	    	  },function(){
	    		  var arr=[{name:"locoNO",value:$("#f_search").val()},{name:"checiName",value:$("#f_search").val()}];
	    		  arr.isIntersection =false; 
	    		  return arr
	    	  });
    	};
    });
    
    //加载数据并初始化窗口和事件
    RTU.register("app.equipmentdetection.loadHtml", function () {
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
        }
    });
    RTU.register("app.equipmentdetection.query.init", function () {
        var data = RTU.invoke("app.setting.data", "equipmentdetection");
        if (data && data.isActive) {
            RTU.invoke("app.equipmentdetection.query.activate");
        }
        return function () {
            return true;
        };
    });
    
    RTU.register("app.equipmentdetection.detailData.init", function () {
        return function (data) {//data.locotypeid   data.locono
            var url = "../jkEquip/searchLocoByEquip?locoTypeid="+data.locotypeid+"&locoNo="+data.locono+"&locoAb="+data.locoAb ;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data.length > 0) {
                    	RTU.invoke("app.equipmentdetection.setDetailData",data.data[0]);
                    }else{
                    	RTU.invoke("app.equipmentdetection.setDetailData");
                    }
                }
            });
        }
    });
    
    //新一代设备监测 LKJ设备状态查询
    RTU.register("app.equipment15detection.detailData.init", function () {
        return function (data) {//data.locotypeid   data.locono
            var url = "../jk15Equip/searchLoco15ByEquip?locoTypeid="+data.locotypeid+"&locoNo="+data.locono+"&locoAb="+data.locoAb ;
            $.ajax({
                url: url,
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data.length > 0) {
                    	RTU.invoke("app.equipment15detection.setDetailData",data.data[0]);
                    }else{
                    	RTU.invoke("app.equipment15detection.setDetailData");
                    }
                }
            });
        };
    });
    
    RTU.register("app.equipment15detection.setDetailData",function(){
    	return function(data){
    		if(data){


             	/*$("#" + tabId + " .left_equip_btm").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$("#" + tabId + " .left_equip_btm").text("正常");*/
             	if(data.btm==1){
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
         		if(data.dmi_i==1){
         			$(".left_equip_monitor1").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         		}else{
         			$(".left_equip_monitor1").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         		}
         		
         		if(data.dmi_ii==1){
         			$(".left_equip_monitor2").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         		}else{
         			$(".left_equip_monitor2").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         		}
/*         		if(data.dmi_iorii==0){
         			$(".left_equip_monitor2").hide();
         		}
         		else $(".left_equip_monitor1").hide();*/
         		
         		/*$(".left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_signal").text("正常");*/
         		if(data.locosignal==1){
         			$(".left_equip_signal").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_signal").text("正常");
         		}else{
         			$(".left_equip_signal").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_signal").text("故障");
         		}
     			/*$(".left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_power").text("正常");*/
         		if(data.displaypowermodule==1){
         			$(".left_equip_power").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_power").text("正常");
         		}else{
         			$(".left_equip_power").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_power").text("故障");
         		}
     			/*$(".left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_font").text("正常");*/
         		if(data.fontfile==1){
         			$(".left_equip_font").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_font").text("正常");
         		}else{
         			$(".left_equip_font").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_font").text("故障");
         		}
     			/*$(".left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_signalpic").text("正常");*/
         		if(data.locosignalpicture==1){
         			$(".left_equip_signalpic").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_signalpic").text("正常");
         		}else{
         			$(".left_equip_signalpic").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_signalpic").text("故障");
         		}
     			/*$(".left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_disstorage").text("正常");*/
         		if(data.displayramcheck==1){
         			$(".left_equip_disstorage").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_disstorage").text("正常");
         		}else{
         			$(".left_equip_disstorage").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_disstorage").text("故障");
         		}
     			/*$(".left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_pixel").text("正常");*/
         		if(data.dynamicpixelcheck==1){
         			$(".left_equip_pixel").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_pixel").text("正常");
         		}else{
         			$(".left_equip_pixel").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_pixel").text("失败");
         		}
     			/*$(".left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_key").text("正常");*/
         		if(data.keybord==1){
         			$(".left_equip_key").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_key").text("正常");
         		}else{
         			$(".left_equip_key").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_key").text("故障");
         		}
     			/*$(".left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
     			$(".left_equip_cardreader").text("正常");*/
         		if(data.cardreader_ic==1){
         			$(".left_equip_cardreader").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			$(".left_equip_cardreader").text("正常");
         		}else{
         			$(".left_equip_cardreader").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			$(".left_equip_cardreader").text("故障");
         		}
         		
         		$(".left_equip_dmitemp").text(data.temperature_dmi);
         		
         		//温度判断有待商榷
         		if(data.temperature_dmi<50){
         			$(".left_equip_dmitemp").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");
         			
         		}else{
         			$(".left_equip_dmitemp").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");
         			
         		}
         		/*$(".left_equip_B_jkzbAjkdate").text(data.jkzbAjkdate);
         		$(".left_equip_B_jkzbAdata").text(data.jkzbAdata);
         		$(".left_equip_B_monitor1").text(data.monitor1Info);*/
         		///////////////////////////////////////////////////////////////////
         		
         		if(data.hostmodule_i==2){
         			$(".left_equip_hostmodule_i").show();
         			$(".left_equip_hostmodule_i").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.hostmodule_i==1){
         			$(".left_equip_hostmodule_i").show();
         			$(".left_equip_hostmodule_i").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else 
         			$(".left_equip_hostmodule_i").hide();
         		
         		
         		if(data.hostmodule_ii==2){
         			$(".left_equip_hostmodule_ii").show();
         			$(".left_equip_hostmodule_ii").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.hostmodule_ii==1){
         			$(".left_equip_hostmodule_ii").show();
         			$(".left_equip_hostmodule_ii").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else 
         			$(".left_equip_hostmodule_ii").hide();
         		
         		
         		if(data.safenumoutput_i==2){
         			$(".left_equip_szlsrcA").show();
         			$(".left_equip_szlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safenumoutput_i==1){
         			$(".left_equip_szlsrcA").show();
         			$(".left_equip_szlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else 
         			$(".left_equip_szlsrcA").hide();
         		
         		
         		if(data.safenuminput_i==2){
         			$(".left_equip_szlsrA").show();
         			$(".left_equip_szlsrA").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safenuminput_i==1){
         			$(".left_equip_szlsrA").show();
         			$(".left_equip_szlsrA").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_szlsrA").hide();
         		
         		
         		if(data.railsignalmodule_i==2){
         			$(".left_equip_kztxaError").show();
         			$(".left_equip_kztxaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.railsignalmodule_i==1){
         			$(".left_equip_kztxaError").show();
         			$(".left_equip_kztxaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_kztxaError").hide();
         		
         		
         		if(data.safefreqinput_i==2){
         			$(".left_equip_mnlsrcA").show();
         			$(".left_equip_mnlsrcA").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safefreqinput_i==1){
         			$(".left_equip_mnlsrcA").show();
         			$(".left_equip_mnlsrcA").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_mnlsrcA").hide();
         		
         		$(".left_equip_txaError").show();
         		if(data.normimitateinput_i==2){
         			$(".left_equip_txaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.normimitateinput_i==1){
         			$(".left_equip_txaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_txaError").hide();
         		
         		
         		if(data.communicaterecord_i==2){
         			$(".left_equip_claError").show();
         			$(".left_equip_claError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.communicaterecord_i==1){
         			$(".left_equip_claError").show();
         			$(".left_equip_claError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_claError").hide();
         		
         		if(data.flaxraypass_i==1){
         			
         			$(".left_equip_jkzbaError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else {
         			
         			$(".left_equip_jkzbaError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		
         		
         		if(data.flaxraypass_ii==1){

         			$(".left_equip_jkzbbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else {
         			
         			$(".left_equip_jkzbbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		
         		
         		if(data.communicaterecord_ii==2){
         			$(".left_equip_clbError").show();
         			$(".left_equip_clbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.communicaterecord_ii==1){
         			$(".left_equip_clbError").show();
         			$(".left_equip_clbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_clbError").hide();
         		
         		if(data.normimitateinput_ii==2){
         			$(".left_equip_txbError").show();
         			$(".left_equip_txbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.normimitateinput_ii==1){
         			$(".left_equip_txbError").show();
         			$(".left_equip_txbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_txbError").hide();
         		
         		if(data.safefreqinput_ii==2){
         			$(".left_equip_mnlsrcB").show();
         			$(".left_equip_mnlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safefreqinput_ii==1){
         			$(".left_equip_mnlsrcB").show();
         			$(".left_equip_mnlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_mnlsrcB").hide();
         		
         		if(data.railsignalmodule_ii==2){
         			$(".left_equip_kztxbError").show();
         			$(".left_equip_kztxbError").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.railsignalmodule_ii==1){
         			$(".left_equip_kztxbError").show();
         			$(".left_equip_kztxbError").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_kztxbError").hide();
         		
         		if(data.safenuminput_ii==2){
         			$(".left_equip_szlsrB").show();
         			$(".left_equip_szlsrB").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safenuminput_ii==1){
         			$(".left_equip_szlsrB").show();
         			$(".left_equip_szlsrB").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_szlsrB").hide();
         		
         		if(data.safenumoutput_ii==2){
         			$(".left_equip_szlsrcB").show();
         			$(".left_equip_szlsrcB").removeClass("pic-divError-wb").addClass("pic-div-wb");
         		}else if(data.safenumoutput_ii==1){
         			$(".left_equip_szlsrcB").show();
         			$(".left_equip_szlsrcB").removeClass("pic-div-wb").addClass("pic-divError-wb");
         		}
         		else $(".left_equip_szlsrcB").hide();
         		///////////////////////////////////////////////////////
         		$(".left_equip_mnLcgyl").text(data.mnLcgyl);
         		$(".left_equip_plSd0").text(data.plSd0);
         		$(".left_equip_plSd1").text(data.plSd1);
         		$(".left_equip_plSd2").text(data.plSd2);
         		//////////////////////////////////////////////////////
         		$(".left_equip_mnYbdy").text(data.mnYbdy);
         		$(".left_equip_mnYbdl").text(data.mnYbdl);
         		$(".left_equip_plYbgl").text(data.plYbgl);
         		$(".left_equip_plCyzs").text(data.plCyzs);
         		$(".left_equip_mnJsdj").text(data.mnJsdj);
         		$(".left_equip_mnZjyl").text(data.mnZjyl);
         		///////////////////////////////////////////////////////
         		if(data.mnJsdj==0){
         			$(".left_equip_B_mnJsdj").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnJsdj").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnYbdy==0){
         			$(".left_equip_B_mnYbdy").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnYbdy").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnYbdl==0){
         			$(".left_equip_B_mnYbdl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnYbdl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnZjyl==0){
         			$(".left_equip_B_mnZjyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnZjyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnByyl==0){
         			$(".left_equip_B_mnByyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnByyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnFgyl==0){
         			$(".left_equip_B_mnFgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnFgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnZgyl==0){
         			$(".left_equip_B_mnZgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnZgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.mnLcgyl==0){
         			$(".left_equip_B_mnLcgyl").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_B_mnLcgyl").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		/////////////////////////////////////////////////////
         		if(data.proEpromA==0){
         			$(".left_equip_proEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_proEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.proEpromB==0){
         			$(".left_equip_proEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_proEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.dataEpromA==0){
         			$(".left_equip_dataEpromA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_dataEpromA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.dataEpromB==0){
         			$(".left_equip_dataEpromB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_dataEpromB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.ramA==0){
         			$(".left_equip_ramA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_ramA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.ramB==0){
         			$(".left_equip_ramB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_ramB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.cpuRamA==0){
         			$(".left_equip_cpuRamA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_cpuRamA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.cpuRamB==0){
         			$(".left_equip_cpuRamB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_cpuRamB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.tbtxA==0){
         			$(".left_equip_tbtxA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_tbtxA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         	    		
         		if(data.tbtxB==0){
         			$(".left_equip_tbtxB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_tbtxB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.canA==0){
         			$(".left_equip_canA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_canA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.canB==0){
         			$(".left_equip_canB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_canB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.clockA==0){
         			$(".left_equip_clockA").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_clockA").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		
         		if(data.clockB==0){
         			$(".left_equip_clockB").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_clockB").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		///////////////////////////////////////////////////////////
         		if(data.gnkzh==0){
         			$(".left_equip_gnkzh").removeClass("bg-red-color-wb").addClass("bg-green-color-wb");;
         		}else{
         			$(".left_equip_gnkzh").removeClass("bg-green-color-wb").addClass("bg-red-color-wb");;
         		}
         		$(".left_equip_deviceCorpIf").text(data.deviceCorpIf);
         		$(".left_equip_B_proVerIf").text(data.proVerIf);
    		 
    		}
    		else{
    			
    		}
    		};
    	});
    
    RTU.register("app.equipmentdetection.setDetailData",function(){
    	return function(data){
    		if(data){
    			if(data.hxz==0){
        			$(".equip_hxz").removeClass("bg-red-color").addClass("bg-green-color");
        			$(".equip_hxz").text("正常");
        		}else{
        			$(".equip_hxz").removeClass("bg-green-color").addClass("bg-red-color");
        			$(".equip_hxz").text("故障");
        		}
    			 $(".equip_jingti1").removeClass("bg-green-color").removeClass("bg-red-color").addClass("bg-gray-color");
                 $(".equip_jingti2").removeClass("bg-green-color").removeClass("bg-red-color").addClass("bg-gray-color");

    			 if(data.guard1setup==0){
    				 $(".equip_jingti1").hide();
    			 }
    			 else{
    				 $(".equip_jingti1").show();
    			 }
    			 if(data.guard2setup==0){
    				 $(".equip_jingti2").hide();
    			 }
    			 else{
    				 $(".equip_jingti2").show();
    			 }
    			 $(" .equip_B_tdState1").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState2").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState3").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState4").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState5").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState6").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState7").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
                 $(" .equip_B_tdState8").removeClass("bg-gray-color").removeClass("bg-red-color").addClass("bg-green-color");
        		if(data.monitor1==0){
        			$(".equip_monitor1").removeClass("bg-red-color").addClass("bg-green-color");
        		}else{
        			$(".equip_monitor1").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.monitor2==0){
        			$(".equip_monitor2").removeClass("bg-red-color").addClass("bg-green-color");
        		}else{
        			$(".equip_monitor2").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.sjbyz==0){
        			$(".equip_sjbyz").removeClass("bg-red-color").addClass("bg-green-color");;
        			$(".equip_sjbyz").text("一致");
        		}else{
        			$(".equip_sjbyz").removeClass("bg-green-color").addClass("bg-red-color");;
        			$(".equip_sjbyz").text("不一致");
        		}
        		
        		if(data.jkbyz==0){
        			$(".equip_jkbyz").removeClass("bg-red-color").addClass("bg-green-color");;
        			$(".equip_jkbyz").text("一致");
        		}else{
        			$(".equip_jkbyz").removeClass("bg-green-color").addClass("bg-red-color");;
        			$(".equip_jkbyz").text("不一致");
        		}
        		
        		if(data.zdgz==0){
        			$(".equip_zdgz").removeClass("bg-red-color").addClass("bg-green-color");;
        			$(".equip_zdgz").text("正常");
        		}else{
        			$(".equip_zdgz").removeClass("bg-green-color").addClass("bg-red-color");;
        			$(".equip_zdgz").text("不正常");
        		}
        		
//        		$(".equip_B_jkzbAjkdate").text(data.jkzbAjkdate);
        		if(data.locoAb!="1"&&data.locoAb!="2"){
        			$(".equip_B_jkzbAjkdate").text(data.jkzbA);
            		$(".equip_B_jkzbAdata").text(data.jkzbAData);
            		$(".equip_B_monitor1").text(data.monitor1Info);
        		}else{
	        		$(".equip_B_jkzbAjkdate").text(data.jkzbB);
	        		$(".equip_B_jkzbAdata").text(data.jkzbBData);
	        		$(".equip_B_monitor1").text(data.monitor2Info);
        		}
        		///////////////////////////////////////////////////////////////////
    			$(".equip_szlsrcA").removeClass("pic-divErrorGray");
        		
    			$(".equip_szlsrA").removeClass("pic-divErrorGray");
    		
    			$(".equip_kztxaError").removeClass("pic-divErrorGray");
    			
    			$(".equip_mnlsrcA").removeClass("pic-divErrorGray");
    		
    			$(".equip_txaError").removeClass("pic-divErrorGray");
    		
    			$(".equip_claError").removeClass("pic-divErrorGray");
    		
    			$(".equip_jkzbaError").removeClass("pic-divErrorGray");
    		
    			$(".equip_jkzbbError").removeClass("pic-divErrorGray");
    		
    			$(".equip_clbError").removeClass("pic-divErrorGray");
    		
    			$(".equip_txbError").removeClass("pic-divErrorGray");
    		
    			$(".equip_mnlsrcB").removeClass("pic-divErrorGray");
    		
    			$(".equip_kztxbError").removeClass("pic-divErrorGray");
    		
    			$(".equip_szlsrB").removeClass("pic-divErrorGray");
    		
    			$(".equip_szlsrcB").removeClass("pic-divErrorGray");
        		if(data.dsj==0||data.abj==0){
        			if(data.szlsrcA==0){
            			$(".equip_szlsrcA").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_szlsrcA").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.szlsrA==0){
            			$(".equip_szlsrA").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_szlsrA").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.kztxA==0){
            			$(".equip_kztxaError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_kztxaError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.mnlsrcA==0){
            			$(".equip_mnlsrcA").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_mnlsrcA").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.txbA==0){
            			$(".equip_txaError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_txaError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.xxclA==0){
            			$(".equip_claError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_claError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.clockA == 0&&data.canA==0&&data.cpuRamA==0&&data.ramA==0&&data.dataEpromA==0&&data.proEpromA==0){
            			$(".equip_jkzbaError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_jkzbaError").removeClass("pic-div").addClass("pic-divError");
            		}
        		}
        		else{
        			$(".equip_szlsrcA").removeClass("pic-div").addClass("pic-divErrorGray");
            		
        			$(".equip_szlsrA").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_kztxaError").removeClass("pic-div").addClass("pic-divErrorGray");
        			
        			$(".equip_mnlsrcA").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_txaError").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_claError").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_jkzbaError").removeClass("pic-div").addClass("pic-divErrorGray");
        		

        		}
        		
        		if(data.dsj==0||data.abj==1){
        			if (data.clockB == 0&&data.canB==0&&data.cpuRamB==0&&data.ramB==0&&data.dataEpromB==0&&data.proEpromB==0) {
            			$(".equip_jkzbbError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_jkzbbError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.xxclB==0){
            			$(".equip_clbError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_clbError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.txbB==0){
            			$(".equip_txbError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_txbError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.mnlsrcB==0){
            			$(".equip_mnlsrcB").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_mnlsrcB").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.kztxB==0){
            			$(".equip_kztxbError").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_kztxbError").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.szlsrB==0){
            			$(".equip_szlsrB").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_szlsrB").removeClass("pic-div").addClass("pic-divError");
            		}
            		
            		if(data.szlsrcB==0){
            			$(".equip_szlsrcB").removeClass("pic-divError").addClass("pic-div");
            		}else{
            			$(".equip_szlsrcB").removeClass("pic-div").addClass("pic-divError");
            		}
        		}
        		else{
        			$(".equip_jkzbbError").removeClass("pic-div").addClass("pic-divErrorGray");
            		
        			$(".equip_clbError").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_txbError").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_mnlsrcB").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_kztxbError").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_szlsrB").removeClass("pic-div").addClass("pic-divErrorGray");
        		
        			$(".equip_szlsrcB").removeClass("pic-div").addClass("pic-divErrorGray");
        		}
        		
        		
        		
        		///////////////////////////////////////////////////////
//        		$(".equip_mnLcgyl").text(data.mnLcgyl);
        		$(".equip_pipestress0").text(data.pipestress0);
        		$(".equip_pipestress1").text(data.pipestress1);
        		$(".equip_pipestress2").text(data.pipestress2);
        		$(".equip_pipestress3").text(data.pipestress3);
        		$(".equip_plSd0").text(data.speed0);
        		$(".equip_plSd1").text(data.speed1);
        		$(".equip_plSd2").text(data.speed2);
        		//////////////////////////////////////////////////////
        		$(".equip_mnYbdy").text(data.ybdy);
        		$(".equip_mnYbdl").text(data.ybdl);
        		$(".equip_plYbgl").text(data.ybgl);
        		$(".equip_plCyzs").text(data.cs);
        		$(".equip_mnJsdj").text(data.jsd);
        		$(".equip_mnZjyl").text(data.zjdy);
        		///////////////////////////////////////////////////////
        		if(data.mnJsdj==0){
        			$(".equip_B_mnJsdj").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnJsdj").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.mnYbdy==0){
        			$(".equip_B_mnYbdy").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnYbdy").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.mnYbdl==0){
        			$(".equip_B_mnYbdl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnYbdl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		
//        		if(data.zjdy==0){
//        			$(".equip_B_mnZjyl").removeClass("bg-red-color").addClass("bg-green-color");;
//        		}else{
//        			$(".equip_B_mnZjyl").removeClass("bg-green-color").addClass("bg-red-color");;
//        		}
        		
        		if(data.mnZjyl==0){
        			$(".equip_B_mnZjyl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnZjyl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		
        		if(data.mnByyl==0){
        			$(".equip_B_mnByyl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnByyl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.mnFgyl==0){
        			$(".equip_B_mnFgyl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnFgyl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.mnZgyl==0){
        			$(".equip_B_mnZgyl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnZgyl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.mnLcgyl==0){
        			$(".equip_B_mnLcgyl").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_B_mnLcgyl").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		/////////////////////////////////////////////////////
        		if(data.proEpromA==0){
        			$(".equip_proEpromA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_proEpromA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.proEpromB==0){
        			$(".equip_proEpromB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_proEpromB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.dataEpromA==0){
        			$(".equip_dataEpromA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_dataEpromA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.dataEpromB==0){
        			$(".equip_dataEpromB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_dataEpromB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.ramA==0){
        			$(".equip_ramA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_ramA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.ramB==0){
        			$(".equip_ramB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_ramB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.cpuRamA==0){
        			$(".equip_cpuRamA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_cpuRamA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.cpuRamB==0){
        			$(".equip_cpuRamB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_cpuRamB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.tbtxA==0){
        			$(".equip_tbtxA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_tbtxA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        	    		
        		if(data.tbtxB==0){
        			$(".equip_tbtxB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_tbtxB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.canA==0){
        			$(".equip_canA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_canA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.canB==0){
        			$(".equip_canB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_canB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.clockA==0){
        			$(".equip_clockA").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_clockA").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		
        		if(data.clockB==0){
        			$(".equip_clockB").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_clockB").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		///////////////////////////////////////////////////////////
        		if(data.gnkzh==0){
        			$(".equip_gnkzh").removeClass("bg-red-color").addClass("bg-green-color");;
        		}else{
        			$(".equip_gnkzh").removeClass("bg-green-color").addClass("bg-red-color");;
        		}
        		//$(".equip_deviceCorpIf").text(data.deviceCorpIf);
        		//$(".equip_B_proVerIf").text(data.proVerIf);
        		
//        		$(".lkjTimeValue").text(data.lkjTime);
        		$(".equip_B_lkjTime").text(data.lkjTime);
    		}else{//bg-gray-color   pic-divErrorGray
    			
    			$(".equip_hxz").removeClass("bg-green-color").addClass("bg-gray-color");
    			
    			$(".equip_hxz").text("故障");
    			$(".equip_monitor1").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_monitor2").removeClass("bg-green-color").addClass("bg-gray-color");;
    			 $(".equip_jingti1").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_jingti2").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_jingti1").hide();
                 $(".equip_jingti2").hide();
                 $(".equip_B_tdState1").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState2").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState3").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState4").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState5").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState6").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState7").removeClass("bg-green-color").addClass("bg-gray-color");
                 $(".equip_B_tdState8").removeClass("bg-green-color").addClass("bg-gray-color");
    			$(".equip_sjbyz").removeClass("bg-green-color").addClass("bg-gray-color");;
    			$(".equip_sjbyz").text("不一致");
    		
    			$(".equip_jkbyz").removeClass("bg-green-color").addClass("bg-gray-color");;
    			$(".equip_jkbyz").text("不一致");
    		
    			$(".equip_zdgz").removeClass("bg-green-color").addClass("bg-gray-color");;
    			$(".equip_zdgz").text("不正常");
        		
        		$(".equip_B_jkzbAjkdate").text("");
        		$(".equip_B_jkzbAdata").text("");
        		$(".equip_B_monitor1").text("");
        		///////////////////////////////////////////////////////////////////
    			$(".equip_szlsrcA").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_szlsrA").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_kztxaError").removeClass("pic-div").addClass("pic-divErrorGray");
    			
    			$(".equip_mnlsrcA").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_txaError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_claError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_jkzbaError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_jkzbbError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_clbError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_txbError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_mnlsrcB").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_kztxbError").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_szlsrB").removeClass("pic-div").addClass("pic-divErrorGray");
    		
    			$(".equip_szlsrcB").removeClass("pic-div").addClass("pic-divErrorGray");
        		///////////////////////////////////////////////////////
    			$(".equip_pipestress0").text("");
    			$(".equip_pipestress1").text("");
    			$(".equip_pipestress2").text("");
    			$(".equip_pipestress3").text("");
        		$(".equip_plSd0").text("");
        		$(".equip_plSd1").text("");
        		$(".equip_plSd2").text("");
        		//////////////////////////////////////////////////////
        		$(".equip_mnYbdy").text("");
        		$(".equip_mnYbdl").text("");
        		$(".equip_plYbgl").text("");
        		$(".equip_plCyzs").text("");
        		$(".equip_mnJsdj").text("");
        		$(".equip_mnZjyl").text("");
        		///////////////////////////////////////////////////////
    			$(".equip_B_mnJsdj").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnYbdy").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnYbdl").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnZjyl").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnByyl").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnFgyl").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnZgyl").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_B_mnLcgyl").removeClass("bg-green-color").addClass("bg-gray-color");;
        		/////////////////////////////////////////////////////
    			$(".equip_proEpromA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_proEpromB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_dataEpromA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_dataEpromB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_ramA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_ramB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_cpuRamA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_cpuRamB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_tbtxA").removeClass("bg-green-color").addClass("bg-gray-color");;
    	    		
    			$(".equip_tbtxB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_canA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_canB").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_clockA").removeClass("bg-green-color").addClass("bg-gray-color");;
    		
    			$(".equip_clockB").removeClass("bg-green-color").addClass("bg-gray-color");;
        		///////////////////////////////////////////////////////////
    			$(".equip_gnkzh").removeClass("bg-green-color").addClass("bg-gray-color");;
    			
//    			$(".equip_hxz").removeClass("bg-green-color").addClass("bg-red-color");
//    			$(".equip_hxz").text("故障");
//    			$(".equip_monitor1").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_monitor2").removeClass("bg-green-color").addClass("bg-red-color");;
//    			
////    			$(".middle-left-row-right-content-div1").removeClass("bg-green-color").addClass("bg-red-color");;
////        		
////    			$(".middle-left-row-right-content-div2").removeClass("bg-green-color").addClass("bg-red-color");;
//    			
//    		
//    			$(".equip_sjbyz").removeClass("bg-green-color").addClass("bg-red-color");;
//    			$(".equip_sjbyz").text("不一致");
//    		
//    			$(".equip_jkbyz").removeClass("bg-green-color").addClass("bg-red-color");;
//    			$(".equip_jkbyz").text("不一致");
//    		
//    			$(".equip_zdgz").removeClass("bg-green-color").addClass("bg-red-color");;
//    			$(".equip_zdgz").text("不正常");
//        		
//        		$(".equip_B_jkzbAjkdate").text("");
//        		$(".equip_B_jkzbAdata").text("");
//        		$(".equip_B_monitor1").text("");
//        		///////////////////////////////////////////////////////////////////
//    			$(".equip_szlsrcA").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_szlsrA").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_kztxaError").removeClass("pic-div").addClass("pic-divError");
//    			
//    			$(".equip_mnlsrcA").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_txaError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_claError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_jkzbaError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_jkzbbError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_clbError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_txbError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_mnlsrcB").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_kztxbError").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_szlsrB").removeClass("pic-div").addClass("pic-divError");
//    		
//    			$(".equip_szlsrcB").removeClass("pic-div").addClass("pic-divError");
//        		///////////////////////////////////////////////////////
//        		$(".equip_mnLcgyl").text("");
//        		$(".equip_plSd0").text("");
//        		$(".equip_plSd1").text("");
//        		$(".equip_plSd2").text("");
//        		//////////////////////////////////////////////////////
//        		$(".equip_mnYbdy").text("");
//        		$(".equip_mnYbdl").text("");
//        		$(".equip_plYbgl").text("");
//        		$(".equip_plCyzs").text("");
//        		$(".equip_mnJsdj").text("");
//        		$(".equip_mnZjyl").text("");
//        		///////////////////////////////////////////////////////
//    			$(".equip_B_mnJsdj").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnYbdy").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnYbdl").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnZjyl").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnByyl").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnFgyl").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnZgyl").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_B_mnLcgyl").removeClass("bg-green-color").addClass("bg-red-color");;
//        		/////////////////////////////////////////////////////
//    			$(".equip_proEpromA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_proEpromB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_dataEpromA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_dataEpromB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_ramA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_ramB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_cpuRamA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_cpuRamB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_tbtxA").removeClass("bg-green-color").addClass("bg-red-color");;
//    	    		
//    			$(".equip_tbtxB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_canA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_canB").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_clockA").removeClass("bg-green-color").addClass("bg-red-color");;
//    		
//    			$(".equip_clockB").removeClass("bg-green-color").addClass("bg-red-color");;
//        		///////////////////////////////////////////////////////////
//    			$(".equip_gnkzh").removeClass("bg-green-color").addClass("bg-red-color");;
    			$(".equip_deviceCorpIf").text("");
        		$(".equip_B_proVerIf").text("");
//        		$(".lkjTimeValue").text("");
        		$(".equip_B_lkjTime").text("");
    		}
    		
    	};
    });
    RTU.register("app.equipmentdetection.query.deactivate", function () {
        return function () {
        	//$(".popuwnd").css("display","none");
            if (popuwnd_search) {
                popuwnd_search.hidden();
            }
            if (popuwnd_list) {
                popuwnd_list.hidden();
            }
            if (popuwnd_datail) {
                popuwnd_datail.hidden();
            }
            if(window.popuwnd_lkj)
            	{
            	window.popuwnd_lkj.hidden();
            	}
            psModel.cancelScribe("refreshData", window.equipmentRefresh);
            
        };
    });

});
