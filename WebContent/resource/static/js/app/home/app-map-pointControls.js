RTU.DEFINE(function (require, exports) {
/**
 * 模块名：所有地图点控制
 * name：
 * date:2015-2-27
 * version:1.0 
 */
	require("app/home/app-map.js");
    require("map/RMap6.js");
    require("map/RMap5.js");
//    require("app/home/home.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.js");
    require("app/realtimelocomotivequery/app-realtimeloco15motivequery-trainalarm.js");
    
    
    window.carPoints=[];//保存所有机车点
    window.railwaysPoints=[];//保存所有铁路局点
    window.stationPoints=[];//保存所有车站透明点
    window.locomotivePoints=[];//保存所有机务段点
    window.guDaoNumberPoints=[];//保存所有股道编号点
   
    var clickNum=80;
    /*******添加一个点****begin***************************************************************************************************************/
    //重新设置point 点上的值
    function reSetPointData(obj) {
        if (currentPoint) {
            mcFn(currentPoint.obj, currentPoint, true);
        }
    }
   
    function MarkerSetting(data) {
        var Point = data.Point;
        Map.addMarker(Point);
        if(Point.pointType=="pointTypeUrl"){
        	var info=changeImg(Point);
        	refreshImg({imgurl: info.imgurl, width: info.width, height: info.height, DetaY: -7, DetaX: -7},Point);
        }
        if(Point.pointType=="locusPoint"){
        	refreshImg({ width: 40, height: 40, DetaY: -7, DetaX: -7},Point);
        }
        setTimeout(function () {
            var pointObj = Point.obj;
            var pointObjType = pointObj.pointType;
            if (!Map[Point.pointType]) {
                Map[Point.pointType] = [];
                Map[Point.pointType].push(Point);
            }
            else {
                Map[Point.pointType].push(Point);
            }
            if(pointObjType=="pointTypeUrl"){//表示该点为机车类型
         	   Point.TIPSID = pointObj.pointData[pointObj.TIPSID];
         	   RTU.invoke("map.marker.setTIPSData", Point);
         	   RTU.invoke("point.TipsSetting", Point);
         	   window.carPoints.push(Point);
            }else{//其他类型
            	if(pointObjType == "railways"){//铁路局
            		RTU.invoke("app.addStationName", Point);
            		window.railwaysPoints.push(Point);
            	}
            	if(pointObjType == "locomotive"){//机务段
            		RTU.invoke("app.addStationName", Point);
            		window.locomotivePoints.push(Point);
            	}
            	if(pointObjType == "guDaoNumber"){//股道编号
            		window.guDaoNumberPoints.push(Point);
            		RTU.invoke("app.addGuDaoNumber",Point);
            		$(Point.Icon).parent().css("z-index", "-1");
            	}
            	
            	if(pointObjType=="rlimitPoint"){//电子围栏
                	var limitSpeed=pointObj.pointData.limitSpeed||0;
                	$(Point.Icon).after("<div id='limitSpeed+"+pointObj.tabId+"' class='limitSpeed' style='left: 14px;top: 12px;position: absolute;font-size: 10px;font-weight: bold;font-family: arial;color: black;cursor:pointer;'>"+limitSpeed+"</div>");
                	
                	var limitDiv=$(".limitSpeed",$(Point.Icon).parent());
                	var speedWidth=$(limitDiv).width()/2;
                	var speedHeight=$(limitDiv).height()/2;
                	var iWidth=$(Point.Icon)[0].clientWidth/2;
                	var iHeight=$(Point.Icon)[0].clientHeight/2;
                	
                	$(limitDiv).css({"left":(iWidth-speedWidth)+"px","top":(iHeight-speedHeight-2)+"px"});
                	$(limitDiv).unbind("click").click(function(){
                		$(".modify").remove();//电子围栏右键功能
                		Point.runClickEvent();
                	});
                }
            	
            	 if (pointObjType == "transparent" || pointObjType === "transparentLess") {//车站
            		 $(Point.Icon).parent().css("z-index",-1);;
                     Point.IconWidth = pointObj.pointData.width + 4;
                     Point.IconHeight = 25;
                     Point.DetaY = 3;
//                     Point.DetaX = 1;
                     Point.refresh();
                     
                     window.stationPoints.push(Point);
                 }
            }
            
            Point.setTabWH = function (whdata) {//重设高度和宽度
                var cNum = 20;
                if (Point.DetaY == -7) {
                    cNum = 4;
                }
                $("#" + pointObj.tabId).css({ "width": whdata.width, "height": whdata.height, "margin-top": (-whdata.height - 20), "margin-left": (-whdata.width / 2 + cNum) });
            };
            Point.getIcon = function (whdata) {//重设高度和宽度
                return Point.Icon;
            };
            Point.addEventListener(RMarkerEvent.MouseClickEvent, function (e) {//添加点击事件    
                mcFn(pointObj, Point);
            });
            //左键
            if (pointObj.initFn) {
            	 if(Point.pointType=="pointTypeUrl"){
                   		 var aa=[];
                   		 $(Point.Icon).mouseover(function(){//鼠标移上去，开始计算堆叠点数目
                   			var Cx1=$(this)[0].x;
                        	var Cy1=$(this)[0].y;
                        	var width=$(this)[0].clientWidth;
                        	var height=$(this)[0].clientHeight;
                        	
                        	var leftCx=Cx1-width;
                        	var rightCx=Cx1+width;
                        	var topCy=Cy1-height;
                        	var bottomCy=Cy1+height;
                        	aa=[];
                        	for(var n in pSKeeping){
                        		if(pSKeeping[n]){
                        			var offset=$(pSKeeping[n].Icon)[0];
                        			var top=offset.y;
                        			var left=offset.x;
                        			if(top>=topCy&&top<=bottomCy&&left>=leftCx&&left<=rightCx){
                        				aa.push(pSKeeping[n].obj.pointData);
                        			}
                        		}
                        	}
                        	if(aa.length>1){//如果，堆叠点>1，则列表显示
                        		 aa=aa.sort(function(x,y){
                        			 var _c1= x.locoTypeName.localeCompare(y.locoTypeName);
    	        					 if(_c1==0)
    	        						 return x.locoNo.localeCompare(y.locoNo);
    	        					 return _c1;
                        		});
	                       		 Point.runClickEvent = function(e){
	                       			RTU.invoke("map.setCenter", { lng: this.Cx, lat: this.Cy, top: 100, left: 20 });
	                       			
	                       			changeCheckCheckbox(Point);
	                       			setTimeout(function(){
	                       				 carPointClickEvent(Point,aa,width,height);
	                       			 },50);
	                       		 };
	                       		 
	                       		 //邓国知新加mouseover事件
	                       		 if(!Map.tIPSMarkerOpen){
	                       			 //简易模式下加入机车名提示
	                       			carPointClickEvent(Point,aa,width,height);
	                       		 }
                       		}else{//如果，没有堆叠，则直接出发点击事件
	                       		 if (Point.obj.initFn) {
	                                 Point.runClickEvent = function (evt) {//点击会弹开他不的执行的函数
	                                	 changeCheckCheckbox(Point);
	                                	 pointClickEvent(Point);
	                                 };
	                             } else {
	                                 Point.runClickEvent = null;
	                             }
	                       		
	                       		 //邓国知新加mouseover事件
	                       		 if(!Map.tIPSMarkerOpen){
	                       			 //简易模式下加入机车名提示
	                       			$(".TIPSDiv",$(Point.Div.div)).show();
	                       			
	                       		 }
                       		}
                   		 })
                   		 
                   		 //邓国知新加mouseout事件
                   		 $(Point.Icon).mouseout(function(){
                   			if(!Map.tIPSMarkerOpen){
                      			 //简易模式下加入机车名提示
                   				if($(".TIPSDiv",$(Point.Div.div)).length>0)
                   					$(".TIPSDiv",$(Point.Div.div)).hide();
//                   				if($(".pointMouseoverDiv",$(Point.Div.div)))
//                   					$(".pointMouseoverDiv",$(Point.Div.div)).remove();
                      		 }
                   		 });
                   		 
                   	
            	 }else{
            		 Point.runClickEvent = function (evt) {//点击会弹开他不的执行的函数
                     	pointClickEvent(Point);
                     };
            	 }
            } else {
                Point.runClickEvent = null;
            }
          //以下是右键
            var obj = Point.obj;
            var objPointData = obj.pointData;
            if (obj.rightHand) {
                $(Point.Icon).mousedown(function (e) { //点击图标右键调用回调函数
                    rightcount = rightcount + 1;
                    if (3 == e.which) {
                    	$(this).parent().css("z-index", clickNum++);
                    	$(".rightHandDiv").hide();
                    	$(".pointMouseoverDiv").remove();
                    	  $(".pointTab").hide();
                        obj.rightHand({ lng: objPointData.longitude, lat: objPointData.latitude, target: this, pointData: obj.itemData ? obj.itemData : objPointData, Point: Point });
                    }
                    return false;
                });
            }
              if (obj.rightHand) {
	            var limitDiv=$(".limitSpeed",$(Point.Icon).parent());
	       	    $(limitDiv).unbind("mousedown").mousedown(function(e){
	       		if(3 == e.which){ 
	 				  //alert('这 是右键单击事件'); 
	       			$(".rightHandDiv").hide();
                	$(".pointMouseoverDiv").remove();
                	  $(".pointTab").hide();
	 				obj.rightHand({ lng: objPointData.longitude, lat: objPointData.latitude, target: this, pointData: obj.itemData ? obj.itemData : objPointData, Point: Point });
	 			  }
	       	    });
            
              }
            
            $(Point.Icon).addClass(Point.pointType);
        });
    }
    
    function changeCheckCheckbox(Point){
//    	var currentPImg=$("img[alt='" + currentPoint.obj.tabId + "']");
    	
    	
    	
    	 if (currentPoint){
    		 if(currentPoint.obj.tabId==Point.obj.tabId){
    			 return false;
    	    	}else{
    	    		$("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
    	    	}
     		 }
    	 currentPoint=Point;
    	 var currentPImg=$("img[alt='" + currentPoint.obj.tabId + "']");
           $(currentPImg).addClass("selectPointCss");
           
           currentPImg=null;
           
           var locoTypeStr=Point.obj.pointData.locoTypeStr;
           var locoAb=Point.obj.pointData.locoAb;
           if(locoAb == "1"){
        	   locoTypeStr=locoTypeStr+window.locoAb_A;
           }else if(locoAb == "2"){
        	   locoTypeStr=locoTypeStr+window.locoAb_B;
           }
           
           var realoutDiv=$(".realtime-outDiv");
           
           if($(realoutDiv)&&$(realoutDiv).length>0){
        	   $("input[checked='checked']",$(realoutDiv)).each(function(i,item){
        		   var that=this;
        		   $(" td[itemname='locoTypeStr']",$(that).parent().parent()).each(function(i,item){
            		   if($(this).text()!=locoTypeStr){
            			   $(that).removeAttr("checked");
            			   return ;
            		   }
            	   });
        	   });
        	   
        	   $(" td[itemname='locoTypeStr']",$(realoutDiv)).each(function(i,item){
        		   if($(this).text()==locoTypeStr){
        			   $(this).parent().click();
        			   var top=$(this).parent().offset().top;
        			   $(this).parent().parent().parent().parent().scrollTop($(this).parent().parent().parent().parent().scrollTop()+top-300);
        			   return ;
        		   }
        	   });
           }
           
           realoutDiv=null;
    }
    
    
    
    //通常标注点左键方法
    function pointClickEvent(Point){
    	 var pointObj = Point.obj;
    	$(".rightHandDiv").hide();
        $(".pointMouseoverDiv").remove();
        var tabDiv = $("#" + Point.obj.tabId);
        var targetImg = $(Point.Icon);
        if (tabDiv.length == 0) {
    
        	//判断在主页面开启电子围栏    当单击时 就不显示详情页
        	if(Point.pointType!="electronraildepotPointMain"&&Point.pointType!="crossing"){
        		
        		targetImg.after(Point.customHtml);
        		
        		tabDiv = $("#" + Point.obj.tabId, targetImg.parent());
        		if(pointObj.pointType!="WfloodPoint"&&pointObj.pointType!="FloodPreventionAndFloodControl"
        			&&pointObj.pointType!="temporarySpeedLimitPoint"
        				&&pointObj.pointType!="transshipmentPoint"
        					&&pointObj.pointType!="otherPoint"){
        			setImg({}, Point);
        		}
        	}
        }
        if (tabDiv.css("display") == "block") {
            tabDiv.remove();
            Point.isShowTab = false;
            tabDiv.parent().css("z-index", 0);
            pointObj.closeFn ? pointObj.closeFn() : "";
            if(window.locoInfoInterval){
            	clearInterval(window.locoInfoInterval);
            	window.locoInfoInterval=null;
            }
        } else {
            $(".pointTab:not([id=='" + Point.obj.tabId + "'])").hide();
            tabDiv.show();
            Point.isShowTab = true;
            tabDiv.parent().css("z-index", clickNum++);
            // 弹开tab后执行初始化函数
            pointObj.initFn ? pointObj.initFn({ longitude: pointObj.pointData.longitude, latitude: pointObj.pointData.latitude, tabId: pointObj.tabId, itemData: pointObj.pointData, Point: Point }) : "";
        }
        
        tabDiv=null;
    }
    
    function createTabHtml(aa){
    	var htmlArr=[];
    	for(var i=0;i<aa.length;i++){
    		var trhtml="";
    		if(i!=0&&i%4==0){
    			trhtml=trhtml+"</tr><tr>";
			}
    		var pData=aa[i];
    		if(pData.isOnline=="1"||pData.isOnline=="2"){
    			trhtml=trhtml+"<td speed='"+aa[i].speed+"' alt='tabId"+parseInt(1000*Math.random())+"' locoTypeStr='"+pData.locoTypeStr+"'  kehuo='"+pData.kehuo+"' lkjTimeStr='"+pData.lkjTimeStr+"'  checiName='"+pData.checiName+"' sName='"+pData.sName+"' lkjType='"+pData.lkjType+"' locoTypeName="+pData.locoTypeName+" locoTypeid="+pData.locoTypeid+" locoNo="
    			+pData.locoNo+" locoAb="+pData.locoAb+" class='pointMouseoverTableTdOnline'>";
    		}else{
    			trhtml=trhtml+"<td speed='"+aa[i].speed+"' alt='tabId"+parseInt(1000*Math.random())+"' locoTypeStr='"+pData.locoTypeStr+"' kehuo='"+pData.kehuo+"' lkjTimeStr='"+pData.lkjTimeStr+"' checiName='"+pData.checiName+"' sName='"+pData.sName+"' lkjType='"+pData.lkjType+"' locoTypeName="+pData.locoTypeName+" locoTypeid="+pData.locoTypeid+" locoNo="
    			+pData.locoNo+" locoAb="+pData.locoAb+" class='pointMouseoverTableTdOffline'>";
    			
    		}
    		if(pData.locoAb!="1"&&pData.locoAb!="2"){
    			trhtml=trhtml+"&nbsp;"+pData.locoTypeName+"-"+pData.locoNo+"&nbsp;</td>";
    		}else if(pData.locoAb=="1"){
    			trhtml=trhtml+"&nbsp;"+pData.locoTypeName+"-"+pData.locoNo+window.locoAb_A+"&nbsp;</td>";
    		}else{
    			trhtml=trhtml+"&nbsp;"+pData.locoTypeName+"-"+pData.locoNo+window.locoAb_B+"&nbsp;</td>";
    		}
    		htmlArr.push(trhtml);
    		
    	}
    	return htmlArr;
    }
    
    
    function setListRightClick(positionClient,pData,obj){
    	$("body").after("<div class='rightHandDiv' style='position: absolute;background-color:#fff;width:105px;height:auto;top:"+positionClient.clientHeight+"px;left:"+positionClient.clientWidth+"px;'></div>").show();
           var rightDiv=$(".rightHandDiv", $(obj.target).parent());
         
           if(positionClient.clientWidth>30){
        	   $(rightDiv).css("left",(positionClient.clientWidth)-15+"px");
           }
           
           if(positionClient.clientHeight>30){
       			$(rightDiv).css("top",(positionClient.clientHeight)-15+"px");
           }

           rightDiv=null;
           
            $(".rightHandDiv").empty().append("<div><div id='menu'><ul><li><a href='#' class='neartrain-a'>显示附近列车</a></li>"
            		+ "<li><a href='#' class='selflinetrain-a'>显示本线路列车</a></li>" +
            		"<li><a href='#' checiName='"+pData.checiName+"' locoTypeStr='"+pData.locoTypeStr+"' locoAb="+pData.locoAb+" class='runningcurve-a'>列车运行曲线</a></li>" +
            		"<li><a href='#' lkjType='"+pData.lkjType+"' kehuo='"+pData.kehuo+"' lkjTimeStr='"+pData.lkjTimeStr+"' locoTypeName="+pData.locoTypeName+"  locoTypeid="+pData.locoTypeid+" locoNo="+pData.locoNo+" locoAb="+pData.locoAb+" class='yunxingjilu-a'>运行记录</a></li>" +
            		"<li id='but3'><a href='#' checiName='"+pData.checiName+"' sName='"+pData.sName+"' lkjType='"+pData.lkjType+"' locoTypeName="+pData.locoTypeName+"  locoTypeid="+pData.locoTypeid+" locoNo="+pData.locoNo+" locoAb="+pData.locoAb+" class='upfile-a'>文件上传</a></li> " +
            		"<li id='but4'><a href='#' lkjType='"+pData.lkjType+"' locoTypeStr='"+pData.locoTypeStr+"' speed='"+pData.speed+"' locoTypeName="+pData.locoTypeName+"  locoTypeid="+pData.locoTypeid+" locoNo="+pData.locoNo+" class='downfile-a'>文件下载</a></li>" +
            		"<li><a href='#' locoTypeStr='"+pData.locoTypeStr+"' locoAb="+pData.locoAb+" alt="+pData.alt+" class='Magnifier-a'>放大镜模式</a></li></ul></div></div>");
            
            //文件上传
         var data_filetransfer = RTU.invoke("app.setting.data", "filetransfer");

         //文件下载
         var data_filedownload = RTU.invoke("app.setting.data", "filedownload");

         if (data_filetransfer == null || data_filetransfer == undefined) {
             $("#but3").css("display", "none");
         }

         if (data_filedownload == null || data_filedownload == undefined) {
             $("#but4").css("display", "none");
         }

         ///模拟放大镜
         $(".Magnifier-a").click(function () {
         	var alt=$(this).attr("alt");
         	obj.target=this;
         	this.alt=alt;
         	obj.lng=Point.Cx;
         	obj.lat=Point.Cy;
         	obj.pointData=Point.obj.pointData;
         	///隐藏右键菜单
             $(".rightHandDiv").hide();
             ///先移出前一次的after
             $(".Magnifier-parentDiv").remove();
             ///after放大镜窗口
             var locoTypeNameAndLocoNoAndLocoAb = $(this).attr("locoTypeStr");
             var locoAb = $(this).attr("locoAb");
             if (locoAb == "1") {
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
	            } else if (locoAb == "2"){
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb+ window.locoAb_B;
	            }
             $("body").after("<div style='position:absolute;left:450px;top:70px;' class='Magnifier-parentDiv' id='Magnifier_parent" + obj.target.alt + "'><div class='Magnifier-div' id='Magnifier_" + obj.target.alt + "'></div>" +
				 		"<img src='../static/img/map/graph_delete.png' class='close-img' style='position:absolute;right:0px;top:0px;z-index:9999;'/>" +
				 		"<img class='dirImg' src=' ../static/img/map/dropwnd_dir.png' style='position:absolute;bottom:-25px;left:243px;z-index:-1;'/>" +
				 		"<div class='Magnifier-top-tab'>放大镜---" + locoTypeNameAndLocoNoAndLocoAb + "</div></div>");
             ///初始化放大镜地图
             RTU.invoke("MagnifierMap.init", obj);
             ///放大镜窗口关闭按钮
             $(".close-img").click(function () {
                 $(".Magnifier-parentDiv").remove();
             });
             
         });
         ///文件上传
         $(".upfile-a").unbind('click').click(function () {
     		var arry = [];
     		var locotypeid=$(this).attr("locoTypeid");
     		var locotypename = $(this).attr("locoTypeName");
              var locono = $(this).attr("locoNo");
              var locoAb = $(this).attr("locoAb");
              var checiName = $(this).attr("checiName");
              var sName = $(this).attr("sName");
             arry.push(locotypeid + "," + locotypename + "," + locono +"," + checiName + "," + sName+ ","+ locoAb);
             if($(this).attr("lkjType")!=1)
             	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", arry);
             else
             	RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", arry);
             
             $(".rightHandDiv").hide();
         });
         ///文件下载
         $(".downfile-a").click(function () {
         	var locoTypeStr=$(this).attr("locoTypeStr");
         	var locotypeid=$(this).attr("locoTypeid");
     		var locotypename = $(this).attr("locoTypeName");
              var locono = $(this).attr("locoNo");
 			var d = (locoTypeStr).split("-");
            var locoAb = $(this).attr("locoAb");
         	if($(this).attr("lkjType")!=1)
         		RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", 
         				{ locotypeid: locotypeid, 
         			locono: locono,
         			locoTypeName: locotypename,speed:pData.speed,
         			locoAb:locoAb});
         	else 
         		RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", 
         				{ locotypeid: locotypeid, 
         			locono: locono,
         			locoTypeName: locotypename,speed:pData.speed,
         			locoAb:locoAb});
         	
         	 $(".rightHandDiv").hide();
         });
         ///运行曲线
         $(".runningcurve-a").click(function () {
         	 var locoTypeNameAndLocoNoAndLocoAb = $(this).attr("locoTypeStr");
              var locoAb = $(this).attr("locoAb");
             var checiName = $(this).attr("checiName");
             
//         	var locoTypeNameAndLocoNoAndLocoAb=obj.pointData.locoTypeStr;
             if (locoAb == "1") {
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb + window.locoAb_A;
	            } else if (locoAb == "2"){
	            	locoTypeNameAndLocoNoAndLocoAb= locoTypeNameAndLocoNoAndLocoAb+ window.locoAb_B;
	            }
         	RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", 
             		[{ "id": "11111", "name": checiName + "(" 
             			+ locoTypeNameAndLocoNoAndLocoAb + ")", data: obj.pointData}]);
             $(".rightHandDiv").hide();
         });
         //运行记录
         $(".yunxingjilu-a").click(function () {
         	
         	var locotypeid=$(this).attr("locoTypeid");
     		var locotypename = $(this).attr("locoTypeName");
              var locono = $(this).attr("locoNo");
              var locoAb = $(this).attr("locoAb");
             var kehuo = $(this).attr("kehuo");
             var lkjTimeStr = $(this).attr("lkjTimeStr");
         	
         	 var sendData={
                      locoTypeid:locotypeid,
                      locoNo:locono,
                      locoAb:locoAb,
                      locoTypename:locotypename,
                      kehuo:kehuo,
                      date:lkjTimeStr
                  };
          	if($(this).attr("lkjType")!=1)
         		RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
         	else 
         		RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
          	
          	$(".rightHandDiv").hide();
         	
         });
         ///显示附近列车
         $(".neartrain-a").click(function () {
             $(".rightHandDiv").hide();
             window.psModel.runControl("refreshData", window.homeTimer, false);
             window.psModel.cancelScribe("refreshData", window.allListRefresh);
             window.psModel.cancelScribe("refreshData", window.refreshNum);
             window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
             window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
             window.psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
             function conditions() {
                 return [{ name: "locoTypeid", value: obj.pointData.locoTypeid },
         		        { name: "locoNO", value: obj.pointData.locoNO },
         		        { name: "locoAb", value: obj.pointData.locoAb}];
             }
             window.aroundLocoTimer = psModel.subscribe("refreshData", function (t, data) {
                 if (($(".rt_tab_div_grid") && $(".rt_tab_div_grid").length > 0) || ($(".attention_div_grid") && $(".attention_div_grid").length > 0)) {
                     if (window.realtimeG || window.RealtimeAttentionList) {
                         if ($(" .raltime_rt_div") && !$(" .raltime_rt_div").hasClass("hidden")) {
                             window.isAroundLocoList = true;
                             window.isThisLineLocoList = false;
                         }
                         refreshRealtimeList(data);
                     }
                 }
                 RTU.invoke("map.marker.hideCarMarker");
                 for (var j = 0; j < data.length; j++) {
                     var d = data[j];
                     RTU.invoke("map.marker.showSomeCarMarker", d.locoTypeName + "-" + d.locoNO+RTU.invoke("app.locoAb.getChar",d.locoAb));
                 }
             }, conditions);
             psModel.searchNow();
         });
         ///显示本线路列车
         $(".selflinetrain-a").click(function () {
             $(".rightHandDiv").hide();
             window.psModel.runControl("refreshData", window.homeTimer, false);
             window.psModel.cancelScribe("refreshData", window.allListRefresh);
             window.psModel.cancelScribe("refreshData", window.refreshNum);
             window.psModel.cancelScribe("refreshData", window.aroundLocoTimer);
             window.psModel.cancelScribe("refreshData", window.thisLineLocoTimer);
             window.psModel.cancelScribe("refreshData", window.RealtimeRefreshListNotSearch);
             function conditions() {
                 return [{ name: "lineNo", value: obj.pointData.lineNo}];
             }
             window.thisLineLocoTimer = psModel.subscribe("refreshData", function (t, data) {
                 if (($(".rt_tab_div_grid") && $(".rt_tab_div_grid").length > 0) || ($(".attention_div_grid") && $(".attention_div_grid").length > 0)) {
                     if (window.realtimeG || window.RealtimeAttentionList) {
                         if ($(" .raltime_rt_div") && !$(" .raltime_rt_div").hasClass("hidden")) {
                             window.isAroundLocoList = false;
                             window.isThisLineLocoList = true;
                         }
                         refreshRealtimeList(data);
                     }
                 }
                 RTU.invoke("map.marker.hideCarMarker");
                 for (var j = 0; j < data.length; j++) {
                     var d = data[j];
                     RTU.invoke("map.marker.showSomeCarMarker", d.locoTypeName + "-" + d.locoNO+RTU.invoke("app.locoAb.getChar",d.locoAb));
                 }
             }, conditions);
             psModel.searchNow();
         });
         function refreshRealtimeList(data) {
             if (window.attention) {
                 if (window.realtimeG) {
                     var t = window.realtimeG.currClickItem();
                     ctr = window.realtimeG.selectItem();
                     if (t.item) {
                         currentTr = window.realtimeG.currClickItem();
                         currentTr.count = 1;
                     }
                     window.realtimeG.refresh(data);
               }
             } else {
                 if (window.RealtimeAttentionList) {
                     var t = window.RealtimeAttentionList.currClickItem();
                     ctr1 = window.RealtimeAttentionList.selectItem();
                     if (t.item) {
                         currentTr1 = window.RealtimeAttentionList.currClickItem();
                         currentTr1.count = 1;
                     }
                     window.RealtimeAttentionList.refresh(data);
                 }
             }
         }
    }
    
    
    function setListLeftClick(leftData){
    	 var $status;
		 
		 RTU.invoke("map.marker.findMarkersContainsNotExist", {
   		  pointId: leftData.locotypestr,
   		  isSetCenter: true,
   		  level: 10,
   		  locoTypeid: leftData.locoTypeid,
   		  locoNo: leftData.locoNo,
   		  locoAb: leftData.locoAb,
   		  lkjType:leftData.lkjType
   		  
   	     });
		 if(window.realtimeG){
    		 var thisData = window.realtimeG.currClickItem();
             var id = leftData.locotypestr;
             var allCheckbox = $("input[type='checkbox']", $(thisData.item).parent());
             var datas=window.realtimeG.datas;
             allCheckbox.each(function (i,item) {
            	 if(id==datas[i].locoTypeStr){
            		 $(this).parent().parent().click();
      			     var top=$(this).parent().parent().offset().top;
      			     $(this).parent().parent().parent().parent().parent().scrollTop($(this).parent().parent().parent().parent().parent().scrollTop()+top-300);
                     return false;
                 }
             });
		 }
		 if(leftData.lkjType!=1){
			 RTU.invoke("app.realtimelocomotivequery.query.yxxx");
			 return;
			/* RTU.invoke("core.router.load", {
                 url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.html",
                 async: false,
                 success: function (status) {
                     $status = $(status);
                 }
             });
             if (window.popuwndLocoInfo) {
                 window.popuwndLocoInfo.close();
             }
             window.popuwndLocoInfo = new PopuWnd({
             	 title: "",
                 html: $status.html(),
                 width: 380,
                 height: 405,
                 left: 450,
                 top: 60,
                 shadow: true
             });*/
		 }else{
                 RTU.invoke("core.router.load", {
                     url: "../app/modules/app-realtimeloco15motivequery-trainalarm.html",
                     async: false,
                     success: function (status) {
                         $status = $(status);
                     }
                 });
    			 
                 if (window.popuwndLocoInfo) {
                     window.popuwndLocoInfo.close();
                 }
                 window.popuwndLocoInfo = new PopuWnd({
                     title: "",
                     html: $status.html(),
                     width: 380,
                     height: 500,
                     left: 450,
                     top: 60,
                     shadow: true
                 });
         }
         window.popuwndLocoInfo.init();
       
         window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
        	 window.popuwndLocoInfo=null;
         });
         
         var obj = {};
         obj.itemData = {
        		 locoTypeid:leftData.locoTypeid,
        		 locoNO:leftData.locoNo,
        		 locoAb:leftData.locoAb,
        		 locoTypeName:leftData.locoTypeName
         };
         obj.popuwndLocoInfo = window.popuwndLocoInfo;
         obj.isInterval="no";
         leftData.popuwndLocoInfo = window.popuwndLocoInfo;
         leftData.isInterval="no";
         if(leftData.lkjType!=1)
           	 RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", leftData);
            else
           	 RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
         
         $(this).parent().parent().parent().parent().parent().remove();
    }
    
    function getPointData(data){
    		return pSKeeping[data.locotypestr].obj.pointData;
    }
    
    function getcarPoint(data){
    	return carPointData[data.pointId];
    }
    
    //机车点堆叠时的左键方法
    function carPointClickEvent(Point,aa,width,height,mouseoverFlag){
    	    var obj = Point.obj;
    	    $(".rightHandDiv").hide();
			//$(".pointTab:not([id=='" + obj.tabId + "'])").hide();当鼠标移动到机车的点上时 不要隐藏 pointtab
			
			var pMouseoverDiv=$("#" + obj.tabId + "pointMouseoverDiv");
			
			 if($(pMouseoverDiv)&&$(pMouseoverDiv).length>0
			 	&&$(".pointMouseoverDiv",Point.Div.div).length==0){
				 $(pMouseoverDiv).parent().css("z-index", 0);
					$(pMouseoverDiv).remove();
					
					pMouseoverDiv=null;
			 }else{
				 $(".pointMouseoverDiv").remove();
				var htmlArr=[];
        	for(var i=0;i<aa.length;i++){
        		var trhtml="";
        		if(i!=0&&i%4==0){
        			trhtml=trhtml+"</tr><tr>";
    			}
        		if(aa[i].isOnline=="1"||aa[i].isOnline=="2"){
        			trhtml=trhtml+"<td speed='"+aa[i].speed+"' alt='tabId"+parseInt(1000*Math.random())+"' locoTypeStr='"+aa[i].locoTypeStr+"' kehuo='"+aa[i].kehuo+"' lkjTimeStr='"+aa[i].lkjTimeStr+"' checiName='"+aa[i].checiName+"' sName='"+aa[i].sName+"'  lkjType='"+aa[i].lkjType+"' locoTypeName="+aa[i].locoTypeName+" locoTypeid="+aa[i].locoTypeid+" locoNo="+aa[i].locoNo+" locoAb="+aa[i].locoAb+" class='pointMouseoverTableTdOnline'>";
        		}else{
        			trhtml=trhtml+"<td speed='"+aa[i].speed+"' alt='tabId"+parseInt(1000*Math.random())+"' locoTypeStr='"+aa[i].locoTypeStr+"' kehuo='"+aa[i].kehuo+"' lkjTimeStr='"+aa[i].lkjTimeStr+"' checiName='"+aa[i].checiName+"' sName='"+aa[i].sName+"' lkjType='"+aa[i].lkjType+"' locoTypeName="+aa[i].locoTypeName+" locoTypeid="+aa[i].locoTypeid+" locoNo="+aa[i].locoNo+" locoAb="+aa[i].locoAb+" class='pointMouseoverTableTdOffline'>";
        			
        		}
        		/*if(aa[i].locoAb!="1"&&aa[i].locoAb!="2"){
        			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+"&nbsp;</td>";
        		}else if(aa[i].locoAb=="1"){
        			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+"A&nbsp;</td>";
        		}else{
        			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+"B&nbsp;</td>";
        		}*/
        		trhtml=trhtml+"&nbsp;"+aa[i].locoTypeStr+"&nbsp;</td>";
        		htmlArr.push(trhtml);
        	}
        	var html="<div class='pointMouseoverDiv' id='" + obj.tabId + "pointMouseoverDiv' style='left:"+(width-3)+"px;top:"+(height-3)+"px;'>"+
        	"<div class='closediv'></div> <div ><input type='checkbox' alt="+obj.pointData.locoTypeStr+" tabid="+obj.tabId+" value='1' name='pointMouseoverDiv-checkbox' class='pointMouseoverDiv-checkbox'>按在线排序</div><div class='pointMouseoverTableOut'><table  class='pointMouseoverTable'><tr>" +htmlArr.join("")+
			"</table></div></div>  ";
        	$($(Point)[0].Icon).after(html);
        	
        	 var leftDiv=$("#" + obj.tabId + "pointMouseoverDiv");
             var menuHeight=$(leftDiv).height();
//             var menuWidth=$(leftDiv).width();
//             var clientx = $(Point.Icon)[0].x;
             var clienty= $(Point.Icon)[0].y;
//             var  width1 = document.documentElement.clientWidth ;
             var  height1 = document.documentElement.clientHeight ;
//             if((clientx+menuWidth*2)>width1){
//             	$(leftDiv).css("left",-(menuWidth)+"px");
//             }
             if((clienty+menuHeight*2)>height1){
             	$(leftDiv).css("top",-(menuHeight)+"px");
             }
        	
        	$(leftDiv).parent().css("z-index", clickNum++);
        	
        	$("tr td",$(".pointMouseoverTable",$(leftDiv))).unbind("mousedown").mousedown(function(e){
        		$(".rightHandDiv").hide();
        		if(3==e.which){
        			var pData={};
        			pData.locoTypeid=$(this).attr("locoTypeid");
        			pData.locoTypeName = $(this).attr("locoTypeName");
        			pData.locoNo = $(this).attr("locoNo");
        			pData.locoAb = $(this).attr("locoAb");
        			pData.checiName = $(this).attr("checiName");
        			pData.sName = $(this).attr("sName");
        			pData.kehuo = $(this).attr("kehuo");
        			pData.lkjTimeStr = $(this).attr("lkjTimeStr");
        			pData.locoTypeStr = $(this).attr("locoTypeStr");
        			pData.speed = $(this).attr("speed");
        			pData.alt = $(this).attr("alt");
        			var obj=Point.obj;
        			window.setTimeout(function () {
    				   $(".rightHandDiv", $(obj.target).parent()).remove();
    				   
    				   var positionClient={};
    				   positionClient.clientWidth = (e.clientX||32);
    				   positionClient.clientHeight= (e.clientY||30);
           	           
           	       		setListRightClick(positionClient,pData,obj);
                    }, 500);
        			
        		}else{
        			var leftData={};
        			leftData.locoTypeid=$(this).attr("locoTypeid");
        			leftData.locoTypeName=$(this).attr("locoTypeName");
        			leftData.locoNo=$(this).attr("locoNo");
        			leftData.locoAb=$(this).attr("locoAb");
        			leftData.locotypestr=$(this).attr("locotypestr");
        			leftData.lkjType=$(this).attr("lkjType");
        			leftData.itemData=getPointData(leftData);
        			setListLeftClick(leftData);
            		
        		}
        	});
        	//checkbox,按在线排序
	        	$(".pointMouseoverDiv-checkbox",$(leftDiv)).unbind("click").click(function(){
	        		 $(".rightHandDiv").hide();
	        		var pk=$(this).attr("alt");
	        		var tabid=$(this).attr("tabid");
	        		var bb;
	        		if($(this).attr("checked")=="checked"){//如果选中checkbox，则按在线排序
	        			 bb=aa.sort(function(x,y){
	        				 if(((x.isOnline==1||x.isOnline==2)&&(y.isOnline==1||y.isOnline==2))||((x.isOnline==3||x.isOnline==4)&&(y.isOnline==3||y.isOnline==4))){
	        					 var _c1= x.locoTypeName.localeCompare(y.locoTypeName);
	        					 if(_c1==0)
	        						 return x.locoNo.localeCompare(y.locoNo);
	        					 return _c1;
	        				 }else
	        					 return (x.isOnline.localeCompare(y.isOnline)); });//对数组按在线进行重新排序
	        			 
	        			$(".pointMouseoverTable",$("#" + tabid + "pointMouseoverDiv")).html("");//清空列表
	        			var htmlArr=createTabHtml(bb);//重新创建tab
	     	        	var html="<tr>" +htmlArr.join("");
	     	        	$(".pointMouseoverTable",$("#" + tabid + "pointMouseoverDiv")).html(html);
	     	        	
	        		}else{//不按在线排序
	        			 bb=aa.sort(function(x,y){
	        				 var _c1= x.locoTypeName.localeCompare(y.locoTypeName);
        					 if(_c1==0)
        						 return x.locoNo.localeCompare(y.locoNo);
	        				 return _c1; 
	        			});//对数组按机车型号排序
	        			 
	        			 $(".pointMouseoverTable",$("#" + tabid + "pointMouseoverDiv")).html("");//清空列表
	        			 var htmlArr=createTabHtml(bb);//重新创建tab
	     	        	var html="<tr>" +htmlArr.join("");
	     	        	$(".pointMouseoverTable",$("#" + tabid + "pointMouseoverDiv")).html(html);
	        		}
	        		
        		  //绑定列表每个td点击事件，弹出机车详情
	        		$("tr td",$(".pointMouseoverTable",$("#"+ tabid + "pointMouseoverDiv"))).unbind("mousedown").mousedown(function(e){
	        			 $(".rightHandDiv").hide();
	        			if(3==e.which){
	        				var pData={};
	            			pData.locoTypeid=$(this).attr("locoTypeid");
	            			pData.locoTypeName = $(this).attr("locoTypeName");
	            			pData.locoNo = $(this).attr("locoNo");
	            			pData.locoAb = $(this).attr("locoAb");
	            			pData.checiName = $(this).attr("checiName");
	            			pData.sName = $(this).attr("sName");
	            			pData.kehuo = $(this).attr("kehuo");
	            			pData.lkjTimeStr = $(this).attr("lkjTimeStr");
	            			pData.locoTypeStr = $(this).attr("locoTypeStr");
	            			pData.speed = $(this).attr("speed");
	            			pData.alt = $(this).attr("alt");
	            			var obj=Point.obj;
	            			window.setTimeout(function () {
	        				   $(".rightHandDiv", $(obj.target).parent()).remove();
	        				   
	        				   var positionClient={};
	        				   positionClient.clientWidth = (e.clientX||32);
	        				   positionClient.clientHeight= (e.clientY||30);
	               	           
	               	       		setListRightClick(positionClient,pData,obj);
	                        }, 500);
		        		}else{
			        		var leftData={};
		        			leftData.locoTypeid=$(this).attr("locoTypeid");
		        			leftData.locoTypeName=$(this).attr("locoTypeName");
		        			leftData.locoNo=$(this).attr("locoNo");
		        			leftData.locoAb=$(this).attr("locoAb");
		        			leftData.locotypestr=$(this).attr("locotypestr");
		        			leftData.lkjType=$(this).attr("lkjType");
		        			leftData.itemData=getPointData(leftData);
		        			setListLeftClick(leftData);
		        		}
		        	});
	        		
	        	});
        	 $(" .closediv").unbind("click").click(function () {
                 $(".pointMouseoverDiv").remove();
             });
        	 
        	 leftDiv=null;
		}
    }
    
    //设置TIPS开关类点的tab
    RTU.register("map.marker.setTIPSData", function () {
    	return function (point) {
    			//color:#fff; rgb(51, 166, 59)
	    		if(point.obj.itemData.isOnline=="1"||point.obj.itemData.isOnline=="2"){
	    			$(point.Icon).after('<div  class="TIPSDiv" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+($(point.Icon).height()/2-10)+'px;left:'+($(point.Icon).width()+5)+'px;background-color: #00ccff;opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + point.TIPSID + '</div>');
	    		}else{
	    			$(point.Icon).after('<div  class="TIPSDiv" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+($(point.Icon).height()/2-10)+'px;left:'+($(point.Icon).width()+5)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + point.TIPSID + '</div>');
	    		}
    	};
    });
    //设置TIPS显示文本
    RTU.register("point.TipsSetting", function () {
        return function (point) {
            var TIPSDiv =$(".TIPSDiv", $(point.Icon).parent()) ;
            var vs = userData["TipsSetting"];
            if ($(TIPSDiv) && $(TIPSDiv).length > 0) {
                if (vs == "none") {
                    $(TIPSDiv).text("");
                }
                var html = "";
                var pointData = point.obj.pointData;
                var tips=pointData.tips;
                if (vs.indexOf("1") != -1) {
                    html = html + pointData.locoTypeName + "-";
                }
                if (vs.indexOf("2") != -1) {
                    if(pointData.locoTypeName.indexOf("CRH")!=-1){
                    	var arr=tips.split("-");
                       	html = html +(arr[1]+"-"+arr[2]).substring(0,6);
                    }else{
                    	html = html + pointData.locoNo ;
                        if (pointData.locoAb == "1") {
                       	 html=html+window.locoAb_A;
                        } else if (pointData.locoAb == "2"){
                       	 html=html+window.locoAb_B;
                        }
                    }
                }
                if (vs.indexOf("3") != -1) {
                    html = html + "<" + pointData.checiName + ">";
                }
                /*if (vs.indexOf("4") != -1) {
                    html = html + "("+pointData.lateMinutes+")";
                }*/
                if (html.charAt(html.length - 1) == "-") {
                    html = html.substring(0, html.length - 1);
                }
                $(TIPSDiv).text(html);
                /*$(TIPSDiv).text(point.obj.pointData.tips);*/
                TIPSDiv=null;
            }
        };
    });
    
    //tips 的tab 控制
    RTU.register("map.TipsSetting", function () {
        return function (data) {
            if (!data) {
                return;
            }
            var vs = data;
            for (var i = 0, len = window.carPoints.length; i < len; i++) {
                var p =$(".TIPSDiv",  $(window.carPoints[i].Icon).parent());
                if ($(p) && $(p).length > 0) {
                    if (vs == "none") {
                        $(p).text("");
                    } else {
                        var html = "";
                        var pointData = window.carPoints[i].obj.pointData;
                        var tips=pointData.tips;
                        if (vs.indexOf("1") != -1) {
                            html = html + pointData.locoTypeName + "-";
                        }
                        if (vs.indexOf("2") != -1) {
                            if(pointData.locoTypeName.indexOf("CRH")!=-1){
                            	var arr=tips.split("-");
                               	html = html +(arr[1]+"-"+arr[2]).substring(0,6);
                            }else{
                            	html = html + pointData.locoNo ;
                                if (pointData.locoAb == "1") {
                               	 html=html+window.locoAb_A;
                                } else if (pointData.locoAb == "2"){
                               	 html=html+window.locoAb_B;
                                }
                            }
                        }
                        if (vs.indexOf("3") != -1) {
                            html = html + "<" + pointData.checiName + ">";
                        }
                        if (vs.indexOf("4") != -1) {
                        	 html = html + "("+pointData.lateMinutes+")";
                        }
                        if (html.charAt(html.length - 1) == "-") {
                            html = html.substring(0, html.length - 1);
                        }
                        $(p).text(html);
                    }
                }
                p=null;
            }
        };
    });
    
    //添加不同点的名称
    RTU.register("app.addStationName", function () {
        return function (point) {
            var pointObj = point.obj;
            var pointObjData = pointObj.pointData;
            var img = $(point.Icon);
            
            var railwaysDiv=$(".railwaysDiv", $(point.Icon).parent());
            if (pointObj.pointType == "railways" || pointObj.pointType == "locomotive") {
                img.before('<div class="railwaysDiv">' + pointObjData.id + '</div>');
                $(railwaysDiv).css({ "cursor": "pointer" });

                $(railwaysDiv).click(function () {
                    point.runClickEvent();
                });

                if (pointObj.pointType == "locomotive") {
                    $(railwaysDiv).css({ "font-size": "14px" });
                }
            } else if (pointObj.pointType == "station") {
                if (Map.Level >= window.publicData["carLevelShow"]) {
                    img.before('<div class="stationDiv">' + pointObjData.id + '</div>');
                }
                else {
                    img.before('<div class="stationDiv stationDivLessForStation">' + pointObjData.id + '</div>');
                }
            } else {
                img.before('<div class="stationDiv">' + pointObjData.id + '</div>');
            }
            
            railwaysDiv=null;
        };
    });
    
    //添加一个点
    var tabIdCount = 0;
    RTU.register("map.marker.addMarker", function () {
        return function (data) {
            var obj = $.extend({}, pointParm, data || {}); //合并参数
            var iurl = ''; //临时图片url变量
            obj.tabId ? null : obj.tabId = "tabId" + (tabIdCount++); //创建tabid 方便以后的操作
            var isOnline = obj.pointData.isOnline;
            var imgUrl="../static/img/map/lessen_g.png";
            if(obj.pointData.trainType==""){
        		var info=window.publicData["IconlessLocoOffline"].split("-");
				var info1=window.publicData["IconlessLocoOnline"].split("-");
        		
        		 if(isOnline && (isOnline == "3"||isOnline == "4")){
				if(info[0]){
					imgUrl=info[0];
				}else{
					imgUrl = "../static/img/map/lessen_g.png";
				}
        			
        		}else if(isOnline && (isOnline == "1"||isOnline == "2")){
				if(info1[0]){
					imgUrl=info1[0];
				}else{
        				imgUrl = "../static/img/map/lessen_y.png";
				}
        		}
            }else{
            	imgUrl =getImgUrl(obj.pointData[obj.pointType]?obj.pointData[obj.pointType]:obj.pointType);
            }
            obj.imgUrl ? iurl = obj.imgUrl : iurl = imgUrl; //赋值url 默认带上tabid后缀 方便操作
            var tab = getTabType("base", obj); //返回特定的tab对象
            var Point = null; //定义point对象
            var objPointData = obj.pointData;
            if (objPointData.longitude && objPointData.latitude) {//存在经纬度才添加
                //添加点到地图
                Point = new RTabMarker(objPointData.longitude, objPointData.latitude, tab, iurl, obj.iconLeft, obj.iconTop, obj.iconWidth, obj.iconHeight);
                Point.Name = "点的位置";
                Point.Icon.alt = obj.tabId;
                Point.pointType = obj.pointType; //点的类型
                Point.customHtml = tab.customHtml;
                obj.loadData ? obj.loadData(obj) : ""; //如果配置了loadData就执行这个回调
                Point.obj = obj; //把整个obj数据放到point下面 保存数据
                MarkerSetting({ Point: Point });              
            }
            return Point; //返回这个点
        };
    });
    /*******添加一个点****end***************************************************************************************************************/
    
    /*******添加和更新多个点****begin***************************************************************************************************************/
    window.pSKeeping = {}; //用来储存point点 以便更新点的时候不用再次添加
    window.carPointData={};//存储机车点
    
    //添加并且不断的更新点  
    //调用例子： RTU.invoke("map.marker.addAndUpDateMarkers",{pointDatas:data, TIPSID:"76767676",tabHtml: "<div>56677676</div>", setDataSeft: false,initFn: function (obj) {  } },rightHand:function(obj){    });
    //pointDatas：为输入的数据,tabHtml:为自定义html数据,setDataSeft:表示是否自动设置数据,initFn:为初始化函数
    RTU.register("map.marker.addAndUpDateMarkers", function () {
        return function (data) {
        	
            var obj = $.extend({}, pointParm, data || {}); //合并参数
            if (obj.pointDatas && obj.pointDatas.length) {//pointDatas 有数据才进行
            	obj.pointDatas=obj.pointDatas.reverse();
            	/*carPointData={};*/
                for (var i =0; i < obj.pointDatas.length; i++) {//循环pointDatas 里面的数据
                    var objtemp = $.extend({}, obj); //创建临时参数变量
                    objtemp.pointData = obj.pointDatas[i]; //取出每个点的数据赋值给临时变量
                    objtemp.itemData = obj.pointDatas[i]; //返回到回调函数的数据
                    var pointKey = objtemp.pointData[obj.pointId]; //pointKey 为每个点数据的id
                    

//                    if(pointKey=="SS4-0990"||pointKey=="SS4-1056"||pointKey=="SS4-1057"||pointKey=="SS4-1058"||pointKey=="SS4-1059"
//                    	||pointKey=="SS4-1062"||pointKey=="SS4-1063"||pointKey=="SS4-1064"||pointKey=="SS4-1065"||pointKey=="SS4-1066"||pointKey=="SS4-1067"
//                    		||pointKey=="SS4-1068"||pointKey=="SS4-1071"){
//                    	continue;
//                    }
                    
                    
                    var lng = objtemp.pointData.longitude; //读取每个点的经纬度
                    var lat = objtemp.pointData.latitude; //读取每个点的经纬度
                    var isOnline=objtemp.pointData.isOnline;
                    var checiName=objtemp.pointData.checiName;
                    
                    
                    var kp = pSKeeping[pointKey]; //查找这个点是否存在
                    	 if (!kp) {
                    		 if(lng&&lat){
                    			 obj.pointId ? pSKeeping[pointKey] = RTU.invoke("map.marker.addMarker", objtemp) : "";
                    		 }

                         } //如果点不存在，添加到地图，并且放到Map.pSKeeping容器中
                         else {
                        	 if((!$(".pointTab")||$(".pointTab").length==0)&&!window.popuwndLocoInfo){
                        		 if(window.locoInfoInterval){
                                  	clearInterval(window.locoInfoInterval);
                                  	window.locoInfoInterval=null;
                                  }
                        	 };
                        	 
                        	 
                             var oldObj=kp.obj.pointData;
                             if(oldObj.isOnline==isOnline&&oldObj.latitude==lat&&oldObj.longitude==lng){
                            	 if(oldObj.checiName!=checiName){
                            		 pSKeeping[pointKey].obj.pointData.checiName=checiName;
                            		
                            		  RTU.invoke("point.TipsSetting",pSKeeping[pointKey]);
                            	 }
                        		 pSKeeping[pointKey].obj.pointData=objtemp.pointData;
                            	
                             }else{
                            	 if(lng&&lat){
                            		 if(currentPoint){
                            			 if(currentPoint.obj.pointData.locoTypeStr==pointKey){
                            				 currentPoint.obj.pointData=objtemp.pointData;
                                		 }
                            		 }
                            		 
                            		 var pd = objtemp.pointData;
                                     pd.longitude = lng;
                                     pd.latitude = lat;
                                     kp.obj.pointData = pd;
                                     pSKeeping[pointKey] = RTU.invoke("map.point.updatePoint", { point: kp, lng: lng, lat: lat });
                                     obj.showMarker ? Map.showMarker(pSKeeping[pointKey]) : ""; //如果设置了showMarker 显示该点
                                     mcFn(pSKeeping[pointKey].obj, pSKeeping[pointKey]);
                                     if(oldObj.checiName!=checiName){
                                    	 pSKeeping[pointKey].obj.pointData.checiName=checiName;
                                    	
                                    	 RTU.invoke("point.TipsSetting",pSKeeping[pointKey]);
                                     }
                                	 pSKeeping[pointKey].obj.pointData=objtemp.pointData;
                            	 }else if(!(lng&&lat)&&!(oldObj.longitude&&oldObj.latitude)){
                            		 $(".TIPSDiv",$(pSKeeping[pointKey].Icon).parent()).remove();
                            		 $(".pointTab:not([id=='" + pSKeeping[pointKey].obj.tabId + "'])").remove();
                            		 $("#" + pSKeeping[pointKey].obj.tabId + "pointMouseoverDiv").remove();
                            		 RTU.invoke("map.marker.removeMarker",pSKeeping[pointKey]);
                            		 pSKeeping[pointKey]=null;
                            		 delete pSKeeping[pointKey];
                            	 }
                            	 
                             }
                         }
                   
                    //是否最后操作的点 在地图的中心显示
                    if (i == obj.pointDatas.length - 1 && obj.isSetCenter) {
                        var tempPoint = obj.pointDatas[obj.pointDatas.length - 1];
                        if (tempPoint.longitude && tempPoint.latitude)
                            Map.setCenter(tempPoint.longitude, tempPoint.latitude);
                    }
                    carPointData[pointKey]=objtemp.pointData;
                }
            }
            reSetPointData(); //使当前的点的tab再次显示。
            RTU.invoke("map.setCurrentPoint");
            
        };
    });
 
    /*******添加和更新多个点****end***************************************************************************************************************/

    /******查找点****begin***************************************************************************************************************/
    
    RTU.register("map.setCurrentPoint", function () {
        return function () {
            if (currentPoint) {
                if (currentPoint.obj.pointData) {
                    var currentData = currentPoint.obj.pointData;
                    if (currentPoint.isShowHighLevel == "1") {
                        if (!currentPoint.isShowTab) {
                            /*Map.setLevel(10);*/
                            RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude });
                        } else {
                            /*Map.setLevel(10);*/
                            RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude, top: 270, left: 190 });
                        }
                    }
                    else {
                    	 if (!currentPoint.isShowTab) {
                             RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude });
                         } else {
                             RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude, top: 270, left: 190 });
                         }
//                        Map.setLevel(10);
                    }
                }
            }
        };
    });
    //查找某一个点
    //调用方法RTU.invoke("map.marker.findMarkers",{pointId:"1",isSetCenter：true,stopTime:5000,fnCallBack:function(){}});
    RTU.register("map.marker.findMarkers", function () {
        return function (data) {
            if (data && data.stopTime) {
                var timer = setInterval(function () {
                    clearInterval(timer);
                }, data.stopTime);
            }
            if (data && data.pointId) {
                if (pSKeeping[data.pointId]) {
                    var target = pSKeeping[data.pointId];
                    if (currentPoint)
                        $("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
                    //选中点的图标边框变颜色
                    $("img[alt='" + target.obj.tabId + "']").addClass("selectPointCss");
                    $(".pointTab").hide();
                    mcFn(target.obj, target);
                    var lng = target.Cx;
                    var lat = target.Cy;
                    if (data && data.isSetCenter) {
                        Map.setCenter(lng, lat);
                        if (data.level) {
                            RTU.invoke("map.changeLevel", data.level);
                        } else {
                            if (Map.Level < 10) {
                                RTU.invoke("map.changeLevel", 10);
                            }
                        }
                    }
                    if (data && data.fnCallBack) {
                        data.fnCallBack({ lng: lng, lat: lat });
                    }
                    currentPoint = target;
                    if(data.isShowHighLevel){
                    	currentPoint.isShowHighLevel=data.isShowHighLevel;
                    }
                    currentPoint.isShowTab=false;
                }
            }
        };
    });

    //查找地图上的点，若存在则选中当前点，如果不存在，则弹出机车详情页面
    RTU.register("map.marker.findMarkersContainsNotExist", function () {
        return function (data) {
            if (data && data.stopTime) {
                var timer = setInterval(function () {
                    clearInterval(timer);
                }, data.stopTime);
            }
            if (data && data.pointId) {
                if (pSKeeping[data.pointId]) {
                	  if (window.popuwndLocoInfo) {
                          window.popuwndLocoInfo.close();
                          window.popuwndLocoInfo=null;
                      }
                    var target = pSKeeping[data.pointId];
                    if (currentPoint)
                        $("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
                    //选中点的图标边框变颜色
                    $("img[alt='" + target.obj.tabId + "']").addClass("selectPointCss");
                    $(".pointTab").hide();
                    mcFn(target.obj, target);
                    var lng = target.Cx;
                    var lat = target.Cy;
                    if (data && data.isSetCenter) {
                        Map.setCenter(lng, lat);
                        if (data.level) {
                            RTU.invoke("map.changeLevel", data.level);
                        } else {
                            if (Map.Level < 10) {
                                RTU.invoke("map.changeLevel", 10);
                            }
                        }
                    }
                    if (data && data.fnCallBack) {
                        data.fnCallBack({ lng: lng, lat: lat });
                    }
                    currentPoint = target;
                    if(data.isShowHighLevel){
                    	currentPoint.isShowHighLevel=data.isShowHighLevel;
                    }
                    currentPoint.isShowTab=false;
                }else{
                	var $status;
                	var lkjType=data.lkjType==undefined||data.lkjType!=1?0:1;
                	if(lkjType!=1){
                		RTU.invoke("app.realtimelocomotivequery.query.yxxx");
                		return;
                	}
                    RTU.invoke("core.router.load", {
                        url: lkjType!=1?
                        		"../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.html"
                        		:"../app/modules/app-realtimeloco15motivequery-trainalarm.html",
                        		async: false,
                        success: function (status) {
                            $status = $(status);
                        }
                    });
                    if (window.popuwndLocoInfo) {
                        window.popuwndLocoInfo.close();
                        window.popuwndLocoInfo=null;
                    }
                    window.popuwndLocoInfo = new PopuWnd({
//                        title: data.pointId + "-详情",
                    	title: "",
                    	html: $status.html(),
                        width: 380,
                        height: lkjType!=1?405:500,
                        left: 450,
                        top: 60,
                        shadow: true
                    });
                    window.popuwndLocoInfo.init();
                    
                    window.popuwndLocoInfo.$wnd.find(".popuwnd-title-del-btn").click(function () {
                   	 window.popuwndLocoInfo=null;
                    });
                    
                    var obj = {};
                    obj.itemData ={
                    		locoTypeid:data.locoTypeid,
                    		locoNO:data.locoNo,
                    		locoAb:data.locoAb,
                    		locoTypeName:data.pointId.split("-")[0]
                    };
                    obj.popuwndLocoInfo = window.popuwndLocoInfo;
                    if(lkjType!=1){
                    	obj.itemData=getcarPoint(data);
                    	RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
                    }
                    else
                    	RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
                    RTU.invoke("map.marker.clearSelectPointCss");
                }
            }
        };
    });
    
    //清除机车选中状态
    RTU.register("map.marker.clearSelectPointCss",function(){
    	return function(){
    		if (currentPoint){
    			$("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
	    		currentPoint.isShowHighLevel="0";
	    		currentPoint=null;
	    		//$(".pointTab").remove();
	    		$(".rightHandDiv").remove();
	    		$(".pointMouseoverDiv").remove();
    		}
    			
    	};
    });
    RTU.register("map.marker.clearSelectPointCssAll",function(){
    	return function(){
    		if (currentPoint){
    			if(window.realtimeG){
    				var thisData = window.realtimeG.currClickItem();
    				var _checkbox = $("input[type='checkbox'][checked='checked']", $(thisData.item));
    				if(_checkbox){
    					_checkbox.trigger("click");
    				}
    			}
    			if(window.RealtimeAttentionList){
    				var thisData = window.RealtimeAttentionList.currClickItem();
    				var _checkbox = $("input[type='checkbox'][checked='checked']", $(thisData.item));
    				if(_checkbox){
    					_checkbox.trigger("click");
    				}
    			}
    			$("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
    			currentPoint.isShowHighLevel="0";
    			//currentPoint = null;
    		}else{
    			if(window.realtimeG){
	    			var boxes = window.realtimeG.selectItem();
	    			if(boxes.length>0){
	    				$.each(boxes, function (i, n) {
	    					$(n).trigger("click");
	    				});
	    			}
    			}
    			if(window.RealtimeAttentionList){
	    			var boxes1 = window.RealtimeAttentionList.selectItem();
	    			if(boxes1.length>0){
	    				$.each(boxes1, function (i, n) {
	    					$(n).trigger("click");
	    				});
	    			}
    			}
    		}
    		//$(".pointTab").remove();
    		//只清除机车的详情框
    		if(currentPoint && currentPoint.obj){
    			$("#"+currentPoint.obj.tabId).remove();
    		}
    		$(".rightHandDiv").remove();
    		$(".pointMouseoverDiv").remove();
    		if(window.popuwndLocoInfo){
            	window.popuwndLocoInfo.close();
            	window.popuwndLocoInfo = null;
            }
    		$(".modify").remove();//电子围栏右键功能
    		if(currentPoint)currentPoint=null;
    	};
    });
    
    //查找点，调用和上面一样
    RTU.register("map.marker.searchMarkers", function () {
        return function (data) {
            Map.hideAllMarker();
            var obj = $.extend(pointParm, data || {});
            obj.showMarker = true;
            RTU.invoke("map.marker.addAndUpDateMarkers", obj);
        };
    });
    /******查找点****end***************************************************************************************************************/
    
/***股道编号**begin************************************************************************************************************/
/*股道编号*/
{
//    //股道编号的数据
//    function guDaoNumberData() {
//        var guDaoNumber = [{ initLng: 116.00478906250001, initLat: 29.703138671874996, name: "1" }, { initLng: 116.00466015625001, initLat: 29.702974609374998, name: "2" }, { initLng: 116.00459765625001, initLat: 29.702755859374996, name: "Ⅲ" },
//	    	                 { initLng: 116.00467968750002, initLat: 29.702748046874998, name: "Ⅳ" }, { initLng: 116.00464062500001, initLat: 29.702662109374998, name: "Ⅴ" }, { initLng: 116.00451953125001, initLat: 29.702505859374998, name: "6" },
//	    	                 { initLng: 116.00458359375002, initLat: 29.702447265624997, name: "7" }, { initLng: 116.00473828125001, initLat: 29.702423828124996, name: "8" }, { initLng: 116.00465234375001, initLat: 29.702185546874997, name: "9" },
//	    	                 { initLng: 116.00466406250001, initLat: 29.702126953124996, name: "10" }, { initLng: 116.00460937500002, initLat: 29.701935546874996, name: "Ⅺ" }, { initLng: 116.00452343750001, initLat: 29.701818359374997, name: "Ⅻ" }, //九江火车站
//	    	                 {initLng: 115.91919531250002, initLat: 28.663068359374993, name: "1" }, { initLng: 115.91924218750002, initLat: 28.662876953124993, name: "Ⅱ" }, { initLng: 115.91929296875001, initLat: 28.662806640624993, name: "3" },
//	    	                 { initLng: 115.91941796875001, initLat: 28.662634765624993, name: "4" }, { initLng: 115.91946875000002, initLat: 28.662595703124992, name: "5" }, { initLng: 115.91951562500002, initLat: 28.662513671874994, name: "6" },
//	    	                 { initLng: 115.91962109375002, initLat: 28.662525390624992, name: "7" }, { initLng: 115.91968750000002, initLat: 28.662318359374993, name: "8" }, { initLng: 115.91982812500002, initLat: 28.662302734374993, name: "9" },
//	    	                 { initLng: 115.91987890625002, initLat: 28.662123046874996, name: "Ⅹ" }, { initLng: 115.91914062500001, initLat: 28.664259765624994, name: "11" }, { initLng: 115.91908593750001, initLat: 28.664494140624996, name: "12" },
//	    	                 { initLng: 115.91901562500001, initLat: 28.664583984374993, name: "13" }, { initLng: 115.91895312500002, initLat: 28.664650390624995, name: "14" }, { initLng: 115.91895703125002, initLat: 28.666080078124995, name: "15" },
//	    	                 { initLng: 115.91977343950001, initLat: 28.664896484374992, name: "检1" }, { initLng: 115.91986328125, initLat: 28.665185546874994, name: "检2" }, { initLng: 115.9199375, initLat: 28.665267578124993, name: "检3" },
//	    	                 { initLng: 115.92003125000001, initLat: 28.665306640624994, name: "检4" }, { initLng: 115.92013281250001, initLat: 28.66548632812499, name: "检5" }, //南昌火车站
//	    	                 {initLng: 115.91887812499999, initLat: 28.650236328124986, name: "2" }, { initLng: 115.91893281249999, initLat: 28.650244140624988, name: "3" }, { initLng: 115.91901093749999, initLat: 28.650244140624988, name: "4" },
//	    	                 { initLng: 115.91906853124999, initLat: 28.65030273437499, name: "5" }, { initLng: 115.91916328125, initLat: 28.65045898437499, name: "6" }, { initLng: 115.91887812499999, initLat: 28.647951171874986, name: "7" },
//	    	                 { initLng: 115.91891328125, initLat: 28.647826171874986, name: "8" }, { initLng: 115.91927656249999, initLat: 28.64706445312987, name: "9" }, { initLng: 115.91933125, initLat: 28.64702145437499, name: "10" },
//	    	                 { initLng: 115.91939375, initLat: 28.64705664062499, name: "11" }, { initLng: 115.91947578125, initLat: 28.64736914061599, name: "12" }, { initLng: 115.91989765625, initLat: 28.650470703124988, name: "13" },
//	    	                 { initLng: 115.91993671875, initLat: 28.650560546874985, name: "14" }, { initLng: 115.91835859375, initLat: 28.647130859374986, name: "15" }, { initLng: 115.91843671875, initLat: 28.647177734374985, name: "16" },
//	    	                 { initLng: 115.91855390625, initLat: 28.647205078124987, name: "17" }, { initLng: 115.9186203125, initLat: 28.647275390624984, name: "18" }, { initLng: 115.91867109374999, initLat: 28.647314453124984, name: "19" },
//	    	                 { initLng: 115.91871015625, initLat: 28.647396484374987, name: "20" }, { initLng: 115.9187609375, initLat: 28.647416015624984, name: "21" }, { initLng: 115.91883125, initLat: 28.647927734374985, name: "22" },
//	    	                 { initLng: 115.9188484375, initLat: 28.645256640624993, name: "23" }, { initLng: 115.91887968750001, initLat: 28.645518359374993, name: "24" }, { initLng: 115.91893528125, initLat: 28.64505742187499, name: "25" },
//	    	                 { initLng: 115.91868437500001, initLat: 28.64430742187499, name: "26" }, { initLng: 115.91884453125002, initLat: 28.644295703124993, name: "27" }, { initLng: 115.91879375, initLat: 28.64524492187499, name: "28" },
//	    	                 { initLng: 115.91954375, initLat: 28.64598320312499, name: "29" }, { initLng: 115.919621875, initLat: 28.64574492187499, name: "30" }, { initLng: 115.919676765625, initLat: 28.64551835937499, name: "31" },
//	    	                 { initLng: 115.91965703125001, initLat: 28.64529179687499, name: "32" }, { initLng: 115.91956718750001, initLat: 28.64490117187499, name: "33" }, { initLng: 115.91894921875, initLat: 28.644170312499988, name: "34" },
//	    	                 { initLng: 115.91892421875, initLat: 28.64418906249999, name: "35" }, { initLng: 115.91932734374998, initLat: 28.65187695312499, name: "36" }, { initLng: 115.91955781249999, initLat: 28.65084960937499, name: "37" },
//	    	                 { initLng: 115.91921406249999, initLat: 28.647158203124988, name: "38" }, { initLng: 115.91932890625, initLat: 28.64549882812499, name: "39" }, { initLng: 115.91831328125001, initLat: 28.64323710937499, name: "40"}]; //南昌机务段
//        return guDaoNumber;
//    }
    //在地图上添加股道编号
    RTU.register("map.showGuDaoNumberData", function () {
        return function () {
        	$.getJSON("../gudaonumber.json",function (data) {
//        		var guDaoNumArr = guDaoNumberData();
        		var guDaoNumArr = data;
        		for (var i = 0; i < guDaoNumArr.length; i++) {
        			RTU.invoke("map.marker.addMarker", {
        				isSetCenter: true,
        				TIPSID: "id",
        				tabHeight: 600,
        				iconWidth: 1,
        				iconHeight: 1,
        				pointType: "guDaoNumber",
        				tabHtml: "<div style='width:200px'>12</div>",
        				pointData: { longitude: guDaoNumArr[i].initLng, latitude: guDaoNumArr[i].initLat, id: guDaoNumArr[i].name },
        				setDataSeft: false,
        				closeFn: function () {
        				},
        				rightHand: function (obj) {
        				}
        			});
        		}
        		
        		setTimeout(function(){
        			RTU.invoke("map.setGuDaoNumberDiv","color");
        		},100);
        	});
        };
    });
    
    RTU.invoke("map.showGuDaoNumberData");
    //股道编号的div
    RTU.register("app.addGuDaoNumber", function () {
        return function (point) {
            $(point.Icon).before('<div class="guDaoNumberDiv"  >' + point.obj.pointData.id + '</div>');
        };
    });
    //控制股道编号的显示

    RTU.register("map.setGuDaoNumberDiv", function () {
        return function (data) {
        	if(data&&data=="color"){
        		$(".guDaoNumberDiv").css("background-color","rgb("+window.publicData["guDaoNumColor"]+")");
        	}
        	
            if (Map.Level >= window.publicData["GudaoNumLevel"]&&window.mapModel=="railway") {
                $(".guDaoNumberDiv").show();
            } else if (Map.Level < window.publicData["GudaoNumLevel"]&&window.mapModel=="railway") {
                $(".guDaoNumberDiv").hide();
            }
        };
    });

//    var tagsetGuDaoNumberDiv = true;
//    RTU.register("map.setGuDaoNumberDiv", function () {
//    	return function (data) {
//    		if (Map.Level >= 1 && tagsetGuDaoNumberDiv == true) {
//    			tagsetGuDaoNumberDiv = false;
//    			$(".guDaoNumberDiv").show();
//    		} else if (Map.Level < 1 && tagsetGuDaoNumberDiv == false) {
//    			tagsetGuDaoNumberDiv = true;
//    			$(".guDaoNumberDiv").hide();
//    		}
//    	};
//    });
}
/***股道编号**end************************************************************************************************************/

    
    

    /**车站点控制****begin******************************************************************************************************/
    {
        Map.StationMarkerOpen = true;
        //显示大车站点(透明)
        RTU.register("map.showStation", function () {
            return function () {
                RTU.invoke("map.showPointPointType", { show: true, pointType: "transparent" });
                Map.StationMarkerOpen = true;
            };
        });

        //隐藏大车站点(透明)
        RTU.register("map.hideStation", function () {
            return function () {
                RTU.invoke("map.showPointPointType", { show: false, pointType: "transparent" });
                Map.StationMarkerOpen = false;
            };
        });

        //车站点开关的状态
        RTU.register("map.marker.StationMarkerStuts", function () {
            return function (data) {
                return Map.StationMarkerOpen;
            };
        });
        var showStation = 8; //车站默认显示级别
        var tagStation = true;
        RTU.register("map.Station", function () {
            return function (data) {
                if (!data)
                    showStation = window.publicData["MaxStation"];
                if (Map.Level < showStation) {
                    RTU.invoke("map.hideStation");
                } else if (Map.Level >= showStation) {
                    RTU.invoke("map.showStation");
                }
            };
        });

        RTU.invoke("map.Station");

        //小车站点(透明)
        RTU.register("map.showStationLess", function () {
            return function () {
                RTU.invoke("map.showPointPointType", { show: true, pointType: "transparentLess" });
                Map.StationMarkerOpen = true;
            };
        });

        //小车站点(透明)
        RTU.register("map.hideStationLess", function () {
            return function () {
                RTU.invoke("map.showPointPointType", { show: false, pointType: "transparentLess" });
                Map.StationMarkerOpen = false;
            };
        });

        RTU.register("map.StationLess", function () {
            return function (data) {
                if (!data)
                    showStation = window.publicData["MinStation"];
                if (Map.Level < showStation) {
                    RTU.invoke("map.hideStationLess");
                } else if (Map.Level >= showStation) {
                    RTU.invoke("map.showStationLess");
                }
            };
        });

        RTU.invoke("map.StationLess");
    }
    /**车站点控制****end******************************************************************************************************/

    /**tIPS的tab控制****begin******************************************************************************************************/
    {
        //tIPS个人设置等级
        var showCarPointLevel = 7;
        var tagShowCarPointLevel = true;
        
        RTU.register("map.showTipsLevel", function () {
 	        return function (data) {
 	        	if(Map.Level>=data){
 	                RTU.invoke("map.marker.tIPSMarkerOpen");
 	        	}else{
 	                RTU.invoke("map.marker.tIPSMarkerClose");
 	                RTU.tipsShow=null;
 	        	}
 	        };
 	    });
    }
 	    //设置TIPS开关类点的tab
 	    RTU.register("map.marker.setTIPSData", function () {
 	    	return function (point) {
 		    		if(point.obj.itemData.isOnline=="1"||point.obj.itemData.isOnline=="2"){
 		    			//rgb(51, 166, 59) color:#fff
 		    			$(point.Icon).after('<div  class="TIPSDiv" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+($(point.Icon).height()/2-10)+'px;left:'+($(point.Icon).width()+5)+'px;background-color:#00ccff;opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + point.TIPSID + '</div>');
 		    		}else{
 		    			$(point.Icon).after('<div  class="TIPSDiv" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+($(point.Icon).height()/2-10)+'px;left:'+($(point.Icon).width()+5)+'px;color:#fff;background-color: rgb(126, 127, 128);opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + point.TIPSID + '</div>');
 		    		}
        };
    });
    //设置TIPS开关类点的tab
    RTU.register("map.marker.setTabHtml", function () {
        return function (data) {
            $("img[alt='" + data.point.obj.tabId + "']").after(data.customHtml);
        };
    });
    //列车正晚点标注
    RTU.register("map.marker.TrainOntimeLate", function () {
        return function (point) {
            var pointObjData = point.obj.pointData;
            var minutes = pointObjData.lateMinutes == "" ? "0" : pointObjData.lateMinutes;
            var img = $("img[alt='" + point.obj.tabId + "']");
            if (parseInt(minutes) < 0) {
                $(img).after('<div class="OntimeLate" style="position:absolute;top:-13px;right:-65px; width:39px;height:17px;background-image: url(\'../static/img/app/train_late.png\');"' +
                        '><span class="time-span" style="position:absolute;right:2px;color:#fff;top:1px;text-align: center; width:25px;">' + minutes + '</span></div>');
            } else {
                $(img).after('<div class="OntimeLate" style="position:absolute;top:-13px;right:-65px; width:39px;height:17px;background-image: url(\'../static/img/app/train_ontime.png\');"' +
                        '><span class="time-span" style="position:absolute;right:2px;color:#fff;top:1px;text-align: center; width:25px;">' + (minutes > "0" ? ("+" + minutes) : minutes) + '</span></div>');
            }
        };
    });
    /**tIPS的tab控制****end******************************************************************************************************/
    
    /**地图级别变化到某一级别，标注变为小图标****begin******************************************************************************************************/
    {
        function setImg(data, point) {
            var p = Map.MarkerArr[data.index];
            var isOnePoint = false;
            if (point) {
                p = point;
                if (!point.Maplet) {
                    point.Maplet = Map;
                    isOnePoint = true;
                }
            }
            p.IconUrl = data.imgurl || p.IconUrl;
            p.IconWidth = data.width || p.IconWidth;
            p.IconHeight = data.height || p.IconHeight;

            var tab = $("#" + p.obj.tabId);
            var tabParent = $(p.Icon).parent();
            var TIPSDiv = $(".TIPSDiv", $(tabParent));
            if (p.pointType == "transparentLess" || p.pointType == "transparent"|| p.pointType == "rlimitPoint" || p.pointType == "eelectronraildepotPoint") {
            } else {
                if (p.IconWidth <= 16) {
                    p.DetaY = -7;
                    p.DetaX = -7;
                }
                else {
                    p.DetaY = -22;
                    p.DetaX = -22;
                }
            }
            if (!isOnePoint) {
                p.refresh();
            }
            var pw = $(p.Icon).width();
            var ph = $(p.Icon).height();
            var pl = parseInt($(p.Icon).css("left"));
            if (tab.length != 0) {
                var cNum = 20;
                if (p.DetaY == -7) {
                    cNum = 4;
                }
                var tp = -tab.height() - 20;
                var tml = -tab.width() / 2 + cNum;
                tab.css({ "margin-left": tml, "margin-top": tp });
            }

            if (TIPSDiv.length != 0) {
                var th = TIPSDiv.height();
                TIPSDiv.css({ left: (pw + pl) + 5, top: -1 * th / 2 + ph / 2 });
            }
        }

        //地图级别小于6时，显示小图标
//        window.tagShowLessenMark = "set";
//        RTU.register("map.showLessenMark", function () {
//            return function (Point) {
//                var parr = [];
//                if (Point) {
//                    parr.push(Point);
//                }
//                var mapMarkerLen = parr.length == 0 ? window.carPoints.length : parr.length;
//                var mapMarker = parr.length == 0 ? window.carPoints : parr;
//                // 1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
//                if(window.tagShowLessenMark=="set"){
//                	if(Map.Level <= window.publicData["carLevelShow"]){
//                		window.tagShowLessenMark=true;
//                	}else{
//                		
//                		window.tagShowLessenMark=false;
//                	}
//                }
//                if (Map.Level <= window.publicData["carLevelShow"]&&window.tagShowLessenMark==true) {
//                    for (var i = 0; i < mapMarkerLen; i++) {
//                      if(mapMarker[i].obj&&mapMarker[i].obj.pointData){
//                    	  var isOnline = mapMarker[i].obj.pointData.isOnline;
//                          var isAlarm = mapMarker[i].obj.pointData.isAlarm;
//                          if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm == "1")) {
//                              var info = window.publicData["IconlessLocoAlertOffline"].split("-");
//                              setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                          }
//                          else if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm != "1")) {
//                              var info = window.publicData["IconlessLocoOffline"].split("-");
//                              setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                          }
//                          else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm == "1")) {
//                              var info = window.publicData["IconlessLocoAlertOnline"].split("-");
//                              setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                          }
//                          else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm != "1")) {
//                              var info = window.publicData["IconlessLocoOnline"].split("-");
//                              setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                          } 
//                      }
//                        window.tagShowLessenMark=false;
//                    }
//                } else if (Map.Level > window.publicData["carLevelShow"]&&window.tagShowLessenMark==false) {
//                    for (var i = 0; i < mapMarkerLen; i++) {
//                      if(mapMarker[i].pointType){
//                            var carType = mapMarker[i].obj.pointData.pointTypeUrl;
//                            switch (carType) {
//                                case "dongcheOnline":
//                                    var info = window.publicData["IcondongcheOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "dongcheOffline":
//                                    var info = window.publicData["IcondongcheOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "dongcheAlertOffline":
//                                    var info = window.publicData["IcondongcheAlertOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "dongcheAlertOnline":
//                                    var info = window.publicData["IcondongcheAlertOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "kecheOnline":
//                                    var info = window.publicData["IconkecheOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "kecheOffline":
//                                    var info = window.publicData["IconkecheOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "kecheAlertOnline":
//                                    var info = window.publicData["IconkecheAlertOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "kecheAlertOffline":
//                                    var info = window.publicData["IconkecheAlertOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "huocheOffline":
//                                    var info = window.publicData["IconhuocheOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "huocheOnline":
//                                    var info = window.publicData["IconhuocheOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "huocheAlertOffline":
//                                    var info = window.publicData["IconhuocheAlertOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "huocheAlertOnline":
//                                    var info = window.publicData["IconhuocheAlertOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "highRailOffline":
//                                    var info = window.publicData["IconhighRailOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "highRailOnline":
//                                    var info = window.publicData["IconhighRailOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "highRailAlertOffline":
//                                    var info = window.publicData["IconhighRailAlertOffline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                                case "highRailAlertOnline":
//                                    var info = window.publicData["IconhighRailAlertOnline"].split("-");
//                                    setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
//                                    break;
//                            }
//                    	}
//                    }
//                }
//            };
//        });
    }
     /**地图级别变化到某一级别，标注变为小图标****end******************************************************************************************************/
    
    /**个人设置图标功能****begin******************************************************************************************************/
    RTU.register("map.pointImgSetting", function () {
        return function (obj) {
            if (obj.pointName && obj.ImgUrl) {
                var pointN = obj.pointName.substr(4);
                pointTypeUrl[pointN] = obj.ImgUrl;
                for (var i = 0; i < Map[pointN].length; i++) {
                    Map[pointN][i].IconUrl = obj.ImgUrl;
                    $("img[alt=" + Map[pointN][i].obj.tabId + "]").attr("src", obj.ImgUrl);
                }
            }
        };
    });
    /**设置图标功能****end******************************************************************************************************/
    function changeImg(point){
    	if (Map.Level <= window.publicData["carLevelShow"]) {
          	    var isOnline = point.obj.pointData.isOnline;
                var isAlarm = point.obj.pointData.isAlarm;
                var returnData={};
                var info=null;
                if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm == "1")) {
                     info = window.publicData["IconlessLocoAlertOffline"].split("-");
                   
                }
                else if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm != "1")) {
                     info = window.publicData["IconlessLocoOffline"].split("-");
                }
                else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm == "1")) {
                     info = window.publicData["IconlessLocoAlertOnline"].split("-");
                }
                else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm != "1")) {
                     info = window.publicData["IconlessLocoOnline"].split("-");
                } 
                if(info){
                	 returnData={
                     		imgurl: info[0],
                     		width: info[1],
                     		height: info[2],
                     		DetaY: -7,
                     		DetaX: -7,
                     		point:point
                     };
                }
            return returnData;
      }else{
    	  var carType = point.obj.pointData.pointTypeUrl;
    	  var returnData={};
          var info=null;
    	  switch (carType) {
            case "dongcheOnline":
                info = window.publicData["IcondongcheOnline"].split("-");
                break;
            case "dongcheOffline":
                info = window.publicData["IcondongcheOffline"].split("-");
                break;
            case "dongcheAlertOffline":
                info = window.publicData["IcondongcheAlertOffline"].split("-");
                break;
            case "dongcheAlertOnline":
                info = window.publicData["IcondongcheAlertOnline"].split("-");
                break;
            case "kecheOnline":
                info = window.publicData["IconkecheOnline"].split("-");
                break;
            case "kecheOffline":
                info = window.publicData["IconkecheOffline"].split("-");
                break;
            case "kecheAlertOnline":
                info = window.publicData["IconkecheAlertOnline"].split("-");
                break;
            case "kecheAlertOffline":
                info = window.publicData["IconkecheAlertOffline"].split("-");
                break;
            case "huocheOffline":
                info = window.publicData["IconhuocheOffline"].split("-");
                break;
            case "huocheOnline":
                info = window.publicData["IconhuocheOnline"].split("-");
                break;
            case "huocheAlertOffline":
                info = window.publicData["IconhuocheAlertOffline"].split("-");
                break;
            case "huocheAlertOnline":
                info = window.publicData["IconhuocheAlertOnline"].split("-");
                break;
            case "highRailOffline":
                info = window.publicData["IconhighRailOffline"].split("-");
                break;
            case "highRailOnline":
                info = window.publicData["IconhighRailOnline"].split("-");
                break;
            case "highRailAlertOffline":
                info = window.publicData["IconhighRailAlertOffline"].split("-");
                break;
            case "highRailAlertOnline":
                info = window.publicData["IconhighRailAlertOnline"].split("-");
                break;
        }
    	  
    	  if(info){
         	 returnData={
              		imgurl: info[0],
              		width: info[1],
              		height: info[2],
              		DetaY: -7,
              		DetaX: -7,
              		point:point
              };
         }
    	  return returnData;
      }
    	
    }
    function refreshImg(data, p) {//刷新标注的图片路径和大小
        p.IconUrl = data.imgurl || p.IconUrl;
        p.IconWidth = data.width || p.IconWidth;
        p.IconHeight = data.height || p.IconHeight;

        if (p.IconWidth <= 16) {
            p.DetaY = -7;
            p.DetaX = -7;
        }
        else {
            p.DetaY = -22;
            p.DetaX = -22;
        }
        p.refresh();
      
    }
});
