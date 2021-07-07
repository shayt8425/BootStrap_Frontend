RTU.DEFINE(function (require, exports) {
/**
* 模块名：所有地图点控制
* name：
* date:2015-2-12
* version:1.0 
*/
	require("app/home/app-map.js");
   require("map/RMap6.js");
   require("map/RMap5.js");
   require("app/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.js");
   var trainName = { 1: "货车", 2: "客车", 3: "高铁", 4: "动车", 5: "其它" };
   var clickNum=80;
   /*******添加一个点****begin***************************************************************************************************************/
   //重新设置point 点上的值
   function reSetPointData(obj) {
       if (currentPoint) {
           mcFn(currentPoint.obj, currentPoint, true);
       }
   }
   function pointLevelControlS(pointType) {//控制部分点的隐藏与显示
       var r = true;
       switch (pointType) {
           case "station":
               if (Map.Level < parseInt(userData["Station"])) {
                   r = false;
               }
               break;
           case "teleseme":
               if (Map.Level < parseInt(userData["Signal"])) {
                   r = false;
               }
               break;
           case "turnout":
               if (Map.Level < parseInt(userData["DaoCha"])) {
                   r = false;
               }
               break;
           default:
               r = true;
               break;
       }
       return r;
   }
   function MarkerSetting(data) {
       var Point = data.Point;
       var pointObj = Point.obj;
       var pointObjType = pointObj.pointType;
       if (!Map[Point.pointType]) {
           Map[Point.pointType] = [];
           Map[Point.pointType].push(Point);
           window.carPoints.push(Point);
       }
       else {
           Map[Point.pointType].push(Point);
           window.carPoints.push(Point);
       }
       Map.addMarker(Point);
       setTimeout(function () {
           var pointObj = Point.obj;
           var pointObjType = pointObj.pointType;
           if (!Map[Point.pointType]) {
               Map[Point.pointType] = [];
               Map[Point.pointType].push(Point);
               window.carPoints.push(Point);
           }
           else {
               Map[Point.pointType].push(Point);
               window.carPoints.push(Point);
           }
           if (pointObj.TIPSID && pointObjType != "station" && pointObjType != "transparent" && pointObjType != "transparentLess" && pointObjType != "teleseme" && pointObjType != "guDaoNumber" && pointObjType != "railways" && pointObjType != "locomotive") {//tIPS开关
              if(pointObjType=="pointTypeUrl"){
           	   Point.TIPSID = pointObj.pointData[pointObj.TIPSID];
           	   RTU.invoke("map.marker.setTIPSData", Point);
              }
           };
           if (pointObjType != "station" && pointObjType != "teleseme" && pointObjType != "guDaoNumber" && pointObjType != "railways" && pointObjType != "locomotive" && pointObjType != "turnout" && !Point.guiji) {
           } else if (pointObjType == "station" || pointObjType == "railways" || pointObjType == "locomotive") {
               RTU.invoke("app.addStationName", Point);
           }
           if(pointObjType=="rlimitPoint"){
           	var limitSpeed=pointObj.pointData.limitSpeed||0;
           	$(Point.Icon).after("<div id='limitSpeed+"+pointObj.tabId+"' class='limitSpeed' style='left: 14px;top: 12px;position: absolute;font-size: 10px;font-weight: bold;font-family: arial;color: black;cursor:pointer;'>"+limitSpeed+"</div>");
           	
           	var limitDiv=$(".limitSpeed",$(Point.Icon).parent());
           	var speedWidth=$(limitDiv).width()/2;
           	var speedHeight=$(limitDiv).height()/2;
           	var iWidth=$(Point.Icon)[0].clientWidth/2;
           	var iHeight=$(Point.Icon)[0].clientHeight/2;
           	
           	$(limitDiv).css({"left":(iWidth-speedWidth)+"px","top":(iHeight-speedHeight-2)+"px"});
           	$(limitDiv).unbind("click").click(function(){
           		Point.runClickEvent();
           	});
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
           if (pointObj.initFn) {
               Point.runClickEvent = function (evt) {//点击会弹开他不的执行的函数
                   $(".rightHandDiv").hide();
                   $(".pointMouseoverDiv").remove();
                   var tabDiv = $("#" + Point.obj.tabId);
                   var targetImg = $(Point.Icon);
                   if (tabDiv.length == 0) {
                       targetImg.after(Point.customHtml);
                       tabDiv = $("#" + Point.obj.tabId, targetImg.parent());
                       setImg({}, Point);
                   }
                   if (tabDiv.css("display") == "block") {
                       tabDiv.remove();
                       Point.isShowTab = false;
                       tabDiv.parent().css("z-index", 0);
                       pointObj.closeFn ? pointObj.closeFn() : "";
                   } else {
                       $(".pointTab:not([id=='" + Point.obj.tabId + "'])").hide();
                       tabDiv.show();
                       Point.isShowTab = true;
                       tabDiv.parent().css("z-index", clickNum++);
                       // 弹开tab后执行初始化函数
                       pointObj.initFn ? pointObj.initFn({ longitude: pointObj.pointData.longitude, latitude: pointObj.pointData.latitude, tabId: pointObj.tabId, itemData: pointObj.itemData, Point: Point }) : "";
                   }
               };
           } else {
               Point.runClickEvent = null;
           }
   
           RTU.invoke("point.TipsSetting", Point);
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
           if(Point.pointType=="pointTypeUrl"){
          		 var aa=[];
          		 $(Point.Icon).mouseover(function(){
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
               				aa.push(pSKeeping[n].obj.itemData);
               			}
               		}
               	}
               	if(aa.length>1){
               		 aa=aa.sort(function(x,y){return (x.locoTypeName.localeCompare(y.locoTypeName)); });
              		 Point.runClickEvent = function(e){
              			$(".rightHandDiv").hide();
              			$(".pointTab:not([id=='" + obj.tabId + "'])").hide();
              			 if($("#" + obj.tabId + "pointMouseoverDiv")&&$("#" + obj.tabId + "pointMouseoverDiv").length>0){
              				$("#" + obj.tabId + "pointMouseoverDiv").parent().css("z-index", 0);
              				$("#" + obj.tabId + "pointMouseoverDiv").remove();
              			 }else{
              				 $(".pointMouseoverDiv").remove();
              				var htmlArr=[];
	                    	for(var i=0;i<aa.length;i++){
	                    		var trhtml="";
	                    		if(i!=0&&i%3==0){
	                    			trhtml=trhtml+"</tr><tr>";
	                			}
	                    		if(aa[i].isOnline=="1"||aa[i].isOnline=="2"){
	                    			trhtml=trhtml+"<td lkjType='"+aa[i].lkjType+"' locoTypeName="+aa[i].locoTypeName+" locoTypeid="+aa[i].locoTypeid+" locoNo="+aa[i].locoNo+" locoAb="+aa[i].locoAb+" class='pointMouseoverTableTdOnline'>";
	                    		}else{
	                    			trhtml=trhtml+"<td lkjType='"+aa[i].lkjType+"' locoTypeName="+aa[i].locoTypeName+" locoTypeid="+aa[i].locoTypeid+" locoNo="+aa[i].locoNo+" locoAb="+aa[i].locoAb+" class='pointMouseoverTableTdOffline'>";
	                    			
	                    		}
	                    		if(aa[i].locoAb=="0"){
	                    			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+"&nbsp;</td>";
	                    		}else if(aa[i].locoAb=="1"){
	                    			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+window.locoAb_A+"&nbsp;</td>";
	                    		}else{
	                    			trhtml=trhtml+"&nbsp;"+aa[i].locoTypeName+"-"+aa[i].locoNo+window.locoAb_B+"&nbsp;</td>";
	                    		}
	                    		htmlArr.push(trhtml);
	                    	}
	                    	var html="<div class='pointMouseoverDiv' id='" + obj.tabId + "pointMouseoverDiv' style='left:"+(width-3)+"px;top:"+(height-3)+"px;'><table  class='pointMouseoverTable'><tr>" +htmlArr.join("")+
	            			"</table></div>";
	                    	$($(this)[0].Icon).after(html);
	                    	
	                    	 var leftDiv=$("#" + obj.tabId + "pointMouseoverDiv");
	                         var menuHeight=$(leftDiv).height();
	                         var menuWidth=$(leftDiv).width();
	                         var clientx = $(Point.Icon)[0].x;
	                         var clienty= $(Point.Icon)[0].y;
	                         var  width1 = document.documentElement.clientWidth ;
	                         var  height1 = document.documentElement.clientHeight ;
	                         if((clientx+menuWidth*2)>width1){
	                         	$(leftDiv).css("left",-(menuWidth)+"px");
	                         }
	                         if((clienty+menuHeight*2)>height1){
	                         	$(leftDiv).css("top",-(menuHeight)+"px");
	                         }
	                    	
	                    	$("#" + obj.tabId + "pointMouseoverDiv").parent().css("z-index", clickNum++);
	                    	
	                    	$("tr td",$(".pointMouseoverTable",$("#"+ obj.tabId + "pointMouseoverDiv"))).unbind("click").click(function(){
	                    		var locoTypeid=$(this).attr("locoTypeid");
	                    		var locoTypeName=$(this).attr("locoTypeName");
	                    		var locoNo=$(this).attr("locoNo");
	                    		var locoAb=$(this).attr("locoAb");
	                    		var lkjType=$(this).attr("lkjType");
	                    		 var $status;
	                    		 if(lkjType!=1){
	                    			 RTU.invoke("core.router.load", {
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
//	                                     title: locoTypeName+"-"+locoNo + "-详情",
	                                 	title: "",
	                                     html: $status.html(),
	                                     width: 380,
	                                     height: 405,
	                                     left: 450,
	                                     top: 60,
	                                     shadow: true
	                                 });
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

                                var obj = {};
                                obj.itemData = {
                               		 locoTypeid:locoTypeid,
                               		 locoNO:locoNo,
                               		 locoAb:locoAb
                                };
                                obj.popuwndLocoInfo = window.popuwndLocoInfo;
                                if(lkjType!=1)
                               	 RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
                                else
                               	 RTU.invoke("app.realtimeloco15motivequery.trainalarm.activate", obj);
                                $(this).parent().parent().parent().parent().remove();
	                    	});
	                    	
	                    	 $("body").mousedown(function (e) { //隐藏
	                             $(".pointMouseoverDiv").remove();
	                         });
              			 }
              		 };
              		}else{
              		 if (Point.obj.initFn) {
                        Point.runClickEvent = function (evt) {//点击会弹开他不的执行的函数
                            $(".rightHandDiv").hide();
                            $(".pointMouseoverDiv").remove();
                            var tabDiv = $("#" + Point.obj.tabId);
                            var targetImg = $(Point.Icon);
                            if (tabDiv.length == 0) {
                                targetImg.after(Point.customHtml);
                                tabDiv = $("#" + Point.obj.tabId, targetImg.parent());
                                setImg({}, Point);
                            }
                            if (tabDiv.css("display") == "block") {
                                tabDiv.remove();
                                Point.isShowTab = false;
                                tabDiv.parent().css("z-index", 0);
                                pointObj.closeFn ? pointObj.closeFn() : "";
                            } else {
                                $(".pointTab:not([id=='" + Point.obj.tabId + "'])").hide();
                                tabDiv.show();
                                Point.isShowTab = true;
                                tabDiv.parent().css("z-index", 99);
                                // 弹开tab后执行初始化函数
                                pointObj.initFn ? pointObj.initFn({ longitude: pointObj.pointData.longitude, latitude: pointObj.pointData.latitude, tabId: pointObj.tabId, itemData: pointObj.itemData, Point: Point }) : "";
                            }
                        };
                    } else {
                        Point.runClickEvent = null;
                    }
              		}
          		 });
          }
           
           $(Point.Icon).addClass(Point.pointType);
           if (!pointLevelControlS(Point.pointType)) {
               Map.hideMarker(Point);
           }
           //鼠标经过图标显示提示信息
           if (Point.pointType == "station") {
               var pointId = pointObj.tabId;
               $(Point.Icon).after("<div class='map-main-notice hidden' id='" + pointId + "_div'>" +
                   "<ul class='map-ul-notice'><li>车站：" + pointObj.pointData.id + "</li>" +
                   "<li>经度：" + Point.Cx + "</li><li>纬度：" + Point.Cy + "</li></ul><img class='tag-img' src='../static/img/app/user_60.png' /></div>").
                       hover(function () {
                           $("#" + pointId + "_div").show();
                       }, function () {
                           $("#" + pointId + "_div").hide();
                       });
               $("#" + pointId + "_div").css("left", -$("#" + pointId + "_div").width() - 10);
           }
           if (pointObjType == "transparent" || pointObjType === "transparentLess") {
               Point.IconWidth = pointObj.pointData.width + 4;
               Point.IconHeight = 25;
               Point.DetaY = 3;
               Point.DetaX = 1;
               Point.refresh();
           }
       }, 2);
   }
   //添加一个点
   var tabIdCount = 0;
   RTU.register("map.marker.addMarker", function () {
       return function (data) {
           var obj = $.extend({}, pointParm, data || {}); //合并参数
           var iurl = ''; //临时图片url变量
           obj.tabId ? null : obj.tabId = "tabId" + (tabIdCount++); //创建tabid 方便以后的操作
           obj.imgUrl ? iurl = obj.imgUrl : iurl = getImgUrl(obj.pointData[obj.pointType] ? obj.pointData[obj.pointType] : obj.pointType); //赋值url 默认带上tabid后缀 方便操作
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
   window.carPoints = []; //用来贮存车的点

   //添加并且不断的更新点  
   //调用例子： RTU.invoke("map.marker.addAndUpDateMarkers",{pointDatas:data, TIPSID:"76767676",tabHtml: "<div>56677676</div>", setDataSeft: false,initFn: function (obj) {  } },rightHand:function(obj){    });
   //pointDatas：为输入的数据,tabHtml:为自定义html数据,setDataSeft:表示是否自动设置数据,initFn:为初始化函数
   RTU.register("map.marker.addAndUpDateMarkers", function () {
       return function (data) {
           var obj = $.extend({}, pointParm, data || {}); //合并参数
           if (obj.pointDatas && obj.pointDatas.length) {//pointDatas 有数据才进行
               for (var i = 0; i < obj.pointDatas.length; i++) {//循环pointDatas 里面的数据
                   var objtemp = $.extend({}, obj); //创建临时参数变量
                   objtemp.pointData = obj.pointDatas[i]; //取出每个点的数据赋值给临时变量
                   objtemp.itemData = obj.pointDatas[i]; //返回到回调函数的数据
                   var pointKey = objtemp.pointData[obj.pointId]; //pointKey 为每个点数据的id
                   var lng = objtemp.pointData.longitude; //读取每个点的经纬度
                   var lat = objtemp.pointData.latitude; //读取每个点的经纬度
                   var kp = pSKeeping[pointKey]; //查找这个点是否存在
                   if (!kp) {
                       obj.pointId ? pSKeeping[pointKey] = RTU.invoke("map.marker.addMarker", objtemp) : "";

                   } //如果点不存在，添加到地图，并且放到Map.pSKeeping容器中
                   else {
                       var pd = objtemp.pointData;
                       pd.longitude = lng;
                       pd.latitude = lat;
                       kp.obj.pointData = pd;
                       pSKeeping[pointKey] = RTU.invoke("map.point.updatePoint", { point: kp, lng: lng, lat: lat });
                       obj.showMarker ? Map.showMarker(pSKeeping[pointKey]) : ""; //如果设置了showMarker 显示该点
                       mcFn(pSKeeping[pointKey].obj, pSKeeping[pointKey]);
                   }
                   //是否最后操作的点 在地图的中心显示
                   if (i == obj.pointDatas.length - 1 && obj.isSetCenter) {
                       var tempPoint = obj.pointDatas[obj.pointDatas.length - 1];
                       if (tempPoint.longitude && tempPoint.latitude)
                           Map.setCenter(tempPoint.longitude, tempPoint.latitude);
                   }
               }
           }
           RTU.invoke("map.TipsSetting", userData["TipsSetting"]);
           reSetPointData(); //使当前的点的tab再次显示。
           window.tagShowLessenMark = "set";
           RTU.invoke("map.showLessenMark");
       };
   });
   RTU.register("map.setCurrentPoint", function () {
       return function () {
           if (currentPoint) {
               if (currentPoint.obj.itemData) {
                   var currentData = currentPoint.obj.itemData;
                   if (currentData.isShowHighLevel == "1") {
                       if (!currentPoint.isShowTab) {
                           Map.setLevel(13);
                           RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude });
                       } else {
                           Map.setLevel(13);
                           RTU.invoke("map.setCenter", { lng: currentData.longitude, lat: currentData.latitude, top: 270, left: 190 });
                       }
                   }
                   else {
                       Map.setLevel(10);
                   }
               }
           }
       };
   });
   /*******添加和更新多个点****end***************************************************************************************************************/
   /******查找点****begin***************************************************************************************************************/
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
                   if (data && data.isSetCenter) {//自动定位
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
               }else{
               	var $status;
                   RTU.invoke("core.router.load", {
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
//                       title: data.pointId + "-详情",
                	   title: "",
                       html: $status.html(),
                       width: 380,
                       height: 405,
                       left: 450,
                       top: 60,
                       shadow: true
                   });
                   window.popuwndLocoInfo.init();

                   var obj = {};
                   obj.itemData ={
                   		locoTypeid:data.locoTypeid,
                   		locoNO:data.locoNo,
                   		locoAb:data.locoAb
                   };
                   obj.popuwndLocoInfo = window.popuwndLocoInfo;
                   RTU.invoke("app.realtimelocomotivequery.trainalarm.activate", obj);
                   RTU.invoke("map.marker.clearSelectPointCss");
               }
           }
       };
   });
   
   //清除机车选中状态
   RTU.register("map.marker.clearSelectPointCss",function(){
   	return function(){
   		if (currentPoint)
   			$("img[alt='" + currentPoint.obj.tabId + "']").removeClass("selectPointCss");
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

   /**信号机控制****begin******************************************************************************************************/
   {
       Map.TelesemeMarkerOpen = true;
       var telesemeNum = 7; //信号机默认显示级别
       //显示信号机
       RTU.register("map.showTeleseme", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: true, pointType: "teleseme" });
               $(".header-maptooler-dropdown-item-11").text("信号机-关");
               Map.TelesemeMarkerOpen = true;
           };
       });
       //隐藏信号机
       RTU.register("map.hideTeleseme", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: false, pointType: "teleseme" });
               $(".header-maptooler-dropdown-item-11").text("信号机-开");
               Map.TelesemeMarkerOpen = false;
           };
       });

       //信号机开关的状态
       RTU.register("map.marker.TelesemeMarkerStuts", function () {
           return function (data) {
               return Map.TelesemeMarkerOpen;
           };
       });
       var showTeleseme = 10; //信号机默认显示级别
       var tagTeleseme = true;
       RTU.register("map.Teleseme", function () {
           return function (data) {
               if (data) {
                   showTeleseme = data;
                   guDaoPointLevel = data;
               }
               if (Map.Level < showTeleseme && tagTeleseme == true) {
                   tagTeleseme = false;
                   RTU.invoke("map.hideTeleseme");
                   RTU.telesemeShow = null;
               } else if (Map.Level >= showTeleseme && RTU.telesemeShow == "close") {

               } else if (Map.Level >= showTeleseme && RTU.telesemeShow != "close" && tagTeleseme == false) {
                   tagTeleseme = true;
                   RTU.invoke("map.showTeleseme");
               }
           };
       });
   }
   /**信号机控制****end******************************************************************************************************/

   /**道岔控制****begin******************************************************************************************************/
   //道岔
   {
       Map.TurnoutMarkerOpen = true;
       var turnoutNum = 7; //道岔默认显示级别
       //显示道岔
       RTU.register("map.showTurnout", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: true, pointType: "turnout" });
               $(".header-maptooler-dropdown-item-12").text("道岔-关");
               Map.TurnoutMarkerOpen = true;
           };
       });
       //隐藏道岔
       RTU.register("map.hideTurnout", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: false, pointType: "turnout" });
               $(".header-maptooler-dropdown-item-12").text("道岔-开");
               Map.TurnoutMarkerOpen = false;
           };
       });

       //道岔开关的状态
       RTU.register("map.marker.TurnoutMarkerStuts", function () {
           return function (data) {
               return Map.TurnoutMarkerOpen;
           };
       });

       var showTurnout = 10; //道岔默认显示级别
       var tagTurnout = true;
       RTU.register("map.Turnout", function () {
           return function (data) {
               if (data) {
                   showTurnout = data;
               }
               if (Map.Level < showTurnout && tagTurnout == true) {
                   tagTurnout = false;
                   RTU.invoke("map.hideTurnout");
                   RTU.turnoutShow = null;
               } else if (Map.Level >= showTurnout && RTU.turnoutShow == "close") {

               } else if (Map.Level >= showTurnout && RTU.turnoutShow != "close" && tagTurnout == false) {
                   tagTurnout = true;
                   RTU.invoke("map.showTurnout");
               }
           };
       });
   }
   /**道岔控制****end******************************************************************************************************/
   /***车站、机务段、铁路局的左键统计**begin************************************************************************************************************/
   /*添加标注，统计四种类型车的数量*/
   {
       //添加车以外得点的tab
       RTU.register("app.addStationName", function () {
           return function (point) {
               var pointObj = point.obj;
               var pointObjData = pointObj.pointData;
               var pointObjTabId = pointObj.tabId;
               var img = $(point.Icon);
               if (pointObj.pointType == "railways" || pointObj.pointType == "locomotive") {
                   img.before('<div class="railwaysDiv">' + pointObjData.id + '</div>');
                   $(".railwaysDiv", $(point.Icon).parent()).css({ "cursor": "pointer" });

                   $(".railwaysDiv", $(point.Icon).parent()).click(function () {
                       point.runClickEvent();
                   });

                   if (pointObj.pointType == "locomotive") {
                       $(".railwaysDiv", $(point.Icon).parent()).css({ "font-size": "14px" });
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
           };
       });

       RTU.register("app.railways.setColor", function () {
           return function (data) {
               var mapMarker = Map.MarkerArr;
               var len = Map.MarkerArr.length;
               for (var i = 0; i < len; i++) {
                   if (mapMarker[i].pointType == "railways") {
                       var stationDiv = $(".stationDiv", $("#" + mapMarker[i].obj.tabId).parent());
                       $(stationDiv).css("background-color", "rgb(" + data.railwaysBackgroundColor + ")");
                       $(stationDiv).css("color", "rgb(" + data.railwaysFontColor + ")");
                   }
               }
           };
       });

       RTU.register("app.addStation", function () {
           return function (stationData) {
               var $status;
               //左键弹出框的html
               RTU.invoke("core.router.load", {
                   url: "../app/modules/labelcountquery/labelcountquery.html",
                   async: false,
                   success: function (status) {
                       $status = $(status);
                   }
               });
               //车站
               //            var stationData=[{longitude:115.91875,latitude:28.662109,sName:"南昌"},{longitude:116.006172,latitude:29.705781,sName:"九江"}];
               //          ,{longitude:115.882578,latitude:29.598047,sName:"庐山城际场"},
               //             {longitude:115.829375,latitude:29.490156,sName:"K23线路所"},{longitude:115.768125,latitude:29.309219,sName:"德安城际场"},{longitude:115.774922,latitude:29.244141,sName:"共青城城际场"},
               ////             {longitude:115.815547,latitude:29.020234,sName:"永修城际场"},{longitude:115.870859,latitude:28.814609,sName:"乐化城际场"}
               //火车站左键
               var stationDataLen = stationData.length;
               for (var i = 0; i < stationDataLen; i++) {
                   if (stationData[i].demo == "大站") {
                       RTU.invoke("map.marker.addMarker", {
                           isSetCenter: true,
                           TIPSID: "id",
                           tabHeight: 600,
                           pointType: "transparent",
                           tabHtml: $status.html(),
                           pointData: { longitude: stationData[i].longitude, latitude: stationData[i].latitude, id: stationData[i].name, width: stationData[i].picNameWidth },
                           setDataSeft: false,
                           initFn: function (obj) {
                               RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
                               setDivCssInit(obj); //初始化页面
                               obj.Point.setTabWH({ width: 420, height: 330 });

                               obj.sendData = {
                                   "dName": "",
                                   "bName": "",
                                   "sName": obj.Point.obj.pointData.id
                               };
                               //                           RTU.invoke("app.addInitMarkShowCount.search",obj);//查询统计信息
                               RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj); //查询机车信息
                               RTU.invoke("app.addInitMarkShowCount.initBut", obj); //初始化tab的title按钮
                               RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
                           },
                           closeFn: function () {
                           },
                           rightHand: function (obj) {
                           }
                       });
                   } else {
                       RTU.invoke("map.marker.addMarker", {
                           isSetCenter: true,
                           TIPSID: "id",
                           tabHeight: 600,
                           pointType: "transparentLess",
                           tabHtml: $status.html(),
                           pointData: { longitude: stationData[i].longitude, latitude: stationData[i].latitude, id: stationData[i].name, width: stationData[i].picNameWidth },
                           setDataSeft: false,
                           initFn: function (obj) {
                               RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
                               setDivCssInit(obj); //初始化页面
                               obj.Point.setTabWH({ width: 420, height: 330 });
                               obj.sendData = {
                                   "dName": "",
                                   "bName": "",
                                   "sName": obj.Point.obj.pointData.id
                               };
                               //                         RTU.invoke("app.addInitMarkShowCount.search",obj);//查询统计信息
                               RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj); //查询机车信息
                               RTU.invoke("app.addInitMarkShowCount.initBut", obj); //初始化tab的title按钮
                               RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
                           },
                           closeFn: function () {
                           },
                           rightHand: function (obj) {
                           }
                       });
                   }
               }
               RTU.invoke("map.Station");
               RTU.invoke("map.StationLess");
           };
       });

       //添加标注
       RTU.register("map.addInitMarkShowCount", function () {
           return function (stationData) {
               var $status;
               //左键弹出框的html
               RTU.invoke("core.router.load", {
                   url: "../app/modules/labelcountquery/labelcountquery.html",
                   async: false,
                   success: function (status) {
                       $status = $(status);
                   }
               });
               //铁路局
               //          var initRailwaysMark=[{ initLng: 121.43100, initLat: 31.249867 ,name:"上海铁路局"},
               //                                { initLng: 116.340211, initLat: 39.824462 ,name:"北京铁路局"},{ initLng: 123.340935, initLat: 41.815538 ,name:"沈阳铁路局"},
               //                                { initLng: 104.048695, initLat: 30.668893 ,name:"成都铁路局"},{ initLng: 87.590492, initLat: 43.838309 ,name:"乌鲁木齐铁路局"},
               //                                { initLng: 113.263513, initLat: 23.093545 ,name:"广州铁路公司"},{ initLng: 113.638031, initLat: 34.757524 ,name:"郑州铁路局"},
               //                                { initLng: 126.600318, initLat: 45.757632 ,name:"哈尔滨铁路局"},{ initLng: 102.632204, initLat: 24.933429 ,name:"昆明铁路局"},
               //                                { initLng: 111.623457, initLat: 40.814532 ,name:"呼和浩特铁路局"},{ initLng: 109.358346, initLat: 24.312009 ,name:"柳州铁路局"},
               //                                { initLng: 116.897993, initLat: 36.621188 ,name:"济南铁路局"},{ initLng: 114.260336, initLat: 30.571004 ,name:"武汉铁路局"},
               //                                { initLng: 103.553407, initLat: 36.090615 ,name:"兰州铁路局"},{ initLng: 101.681634, initLat: 36.795889 ,name:"青藏铁路公司"},
               //                                { initLng: 115.839718, initLat: 28.664207 ,name:"南昌铁路局"},{ initLng: 112.463916, initLat: 37.832953,name:"太原铁路局"},
               //                                { initLng: 108.863353, initLat: 34.269227 ,name:"西安铁路局"}];
               //          
               var initRailwaysMark = [{ initLng: 119.65837943650001, initLat: 29.37056884350001, name: "上海铁路局" },
                               { initLng: 115.76775443650001, initLat: 39.35103759350001, name: "北京铁路局" }, { initLng: 122.80681693650001, initLat: 43.15963134350001, name: "沈阳铁路局" },
                               { initLng: 102.93962943650001, initLat: 29.80025634350001, name: "成都铁路局" }, { initLng: 86.75994193650001, initLat: 42.69869384350001, name: "乌鲁木齐铁路局" },
                               { initLng: 113.65837943650001, initLat: 24.23775634350001, name: "广铁集团" }, { initLng: 113.64275443650001, initLat: 33.97213134350001, name: "郑州铁路局" },
                               { initLng: 126.68962943650001, initLat: 47.30025634350001, name: "哈尔滨铁路局" }, { initLng: 101.33025443650001, initLat: 25.79244384350001, name: "昆明铁路局" },
                               { initLng: 111.58025443650001, initLat: 39.94088134350001, name: "呼和浩特铁路局" }, { initLng: 109.358346, initLat: 24.312009, name: "南宁铁路局" },
                               { initLng: 116.89275443650001, initLat: 35.90963134350001, name: "济南铁路局" }, { initLng: 112.03337943650001, initLat: 31.58150634350001, name: "武汉铁路局" },
                               { initLng: 102.92400443650001, initLat: 34.78463134350001, name: "兰州铁路局" }, { initLng: 100.29119193650001, initLat: 38.20650634350001, name: "青藏铁路公司" },
                               { initLng: 115.839718, initLat: 28.664207, name: "南昌铁路局" }, { initLng: 112.33806693650001, initLat: 37.39791259350001, name: "太原铁路局" },
                               { initLng: 108.85369193650001, initLat: 33.65181884350001, name: "西安铁路局"}];

               //机务段
               var initLocomotiveMark = { initLng: 115.92120312499999, initLat: 28.648402343749993, name: "南昌机务段" };

               //添加铁路局标注
               var railwaysLen = initRailwaysMark.length;
               for (var i = 0; i < railwaysLen; i++) {
                   RTU.invoke("map.marker.addMarker", {
                       isSetCenter: true,
                       TIPSID: "id",
                       tabHeight: 600,
                       pointType: "railways",
                       tabHtml: $status.html(),
                       pointData: { longitude: initRailwaysMark[i].initLng, latitude: initRailwaysMark[i].initLat, id: initRailwaysMark[i].name },
                       setDataSeft: false,
                       initFn: function (obj) {
                           setDivCssInit(obj);
                           obj.Point.setTabWH({ width: 420, height: 330 });
                           RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
                           obj.sendData = {
                               "dName": "",
                               "bName": obj.Point.obj.pointData.id,
                               "sName": ""
                           };
                           //                           RTU.invoke("app.addInitMarkShowCount.search",obj);
                           RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj);
                           RTU.invoke("app.addInitMarkShowCount.initBut", obj);
                           RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
                       },
                       closeFn: function () {
                       },
                       rightHand: function (obj) {
                       }
                   });
               }
               RTU.invoke("map.railways");
               /////添加机务段标注
               RTU.invoke("map.marker.addMarker", {
                   isSetCenter: true,
                   TIPSID: "id",
                   tabHeight: 600,
                   pointType: "locomotive",
                   tabHtml: $status.html(),
                   pointData: { longitude: initLocomotiveMark.initLng, latitude: initLocomotiveMark.initLat, id: initLocomotiveMark.name },
                   setDataSeft: false,
                   initFn: function (obj) {
                       setDivCssInit(obj);
                       obj.Point.setTabWH({ width: 420, height: 330 });
                       RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
                       obj.sendData = {
                           "dName": obj.Point.obj.pointData.id,
                           "bName": "",
                           "sName": ""
                       };
                       //                           RTU.invoke("app.addInitMarkShowCount.search",obj);
                       RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj);
                       RTU.invoke("app.addInitMarkShowCount.initBut", obj);
                       RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
                   },
                   closeFn: function () {
                   },
                   rightHand: function (obj) {
                   }
               });
               RTU.invoke("map.locomotive");
               // RTU.invoke("map.showLessenMark");
           };
       });
       RTU.invoke("map.addInitMarkShowCount");
       Map.locomotiveMarkerOpen = true;
       //显示机务段
       RTU.register("map.showLocomotive", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: true, pointType: "locomotive" });
               Map.locomotiveMarkerOpen = true;
           };
       });
       //隐藏机务段
       RTU.register("map.hideLocomotive", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: false, pointType: "locomotive" });
               Map.locomotiveMarkerOpen = false;
           };
       });

       //机务段开关的状态
       RTU.register("map.marker.locomotiveMarkerStuts", function () {
           return function (data) {
               return Map.locomotiveMarkerOpen;
           };
       });

       RTU.register("map.locomotive", function () {
           return function (data) {
               if (!data) {
                   data = window.publicData["startLocomotive"];
               }
               if (Map.Level < data) {
                   RTU.invoke("map.hideLocomotive");
               } else if (Map.Level >= data) {
                   RTU.invoke("map.showLocomotive");
               }
           };
       });

       Map.railwaysMarkerOpen = true;
       //显示铁路局
       RTU.register("map.showRailways", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: true, pointType: "railways" });
               RTU.invoke("map.showPointPointType", { show: true, pointType: "railwaysTransparent" });
               Map.railwaysMarkerOpen = true;
           };
       });
       //隐藏铁路局
       RTU.register("map.hideRailways", function () {
           return function () {
               RTU.invoke("map.showPointPointType", { show: false, pointType: "railways" });
               RTU.invoke("map.showPointPointType", { show: false, pointType: "railwaysTransparent" });
               Map.railwaysMarkerOpen = false;
           };
       });

       //铁路局开关的状态
       RTU.register("map.marker.railwaysMarkerStuts", function () {
           return function (data) {
               return Map.railwaysMarkerOpen;
           };
       });

       RTU.register("map.railways", function () {
           return function (data) {
               if (!data) {
                   data = window.publicData["carLevelShow"];
               }
               if (Map.Level > data) {
                   RTU.invoke("map.hideRailways");
               } else if (Map.Level <= data) {
                   RTU.invoke("map.showRailways");
               }
           };
       });

       RTU.invoke("map.railways");
       RTU.invoke("map.locomotive");
       //机务段是否显示
       RTU.register("map.isShow.locomotive", function () {
           return function () {
               var mapMarkerLen = Map.MarkerArr.length;
               var mapMarker = Map.MarkerArr;
               for (var i = 0; i < mapMarkerLen; i++) {
                   if (mapMarker[i].tempurl) {
                       RTU.invoke("map.marker.hideMarker", mapMarker[i]);
                   }
               }
           };
       });

       //铁路局是否显示
       RTU.register("map.isShow.railways", function () {
           return function () {
               RTU.invoke("map.marker.hideMarker");
           };
       });


       function simulateClick(el) {
           var evt;
           if (document.createEvent) { // DOM Level 2 standard 
               evt = document.createEvent("MouseEvents");
               evt.initMouseEvent("click", true, true, window,
       0, 0, 0, 0, 0, false, false, false, false, 0, null);
               el.dispatchEvent(evt);
           } else if (el.fireEvent) { // IE 
               el.fireEvent('onclick');
           }
       }
       //////////////站场、机务段地图详情
       RTU.register("app.addInitMarkShowCount.detailInfo", function () {
           var movingGetLevel = function () {
               var windowRmap2 = window.rmap2;
               //        window.rmap2.getLevel()<13?(windowRmap2.setLevel(13),windowRmap2.getMarkerManager().hideAll()):(windowRmap2.getLevel()==13?windowRmap2.getMarkerManager().hideAll():windowRmap2.getMarkerManager().showAll());      
           };
           var initMap = function (data) {
               RMap6.TileRule.TILE_ROOT = "/tile/typical/"; //通过NGINX配置

               window.rmap2 = new RMap6.RMap($("#" + data.tabId + " .Div1").get(0), $("#" + data.tabId + " .Div1").width(), $("#" + data.tabId + " .Div1").height(), data.longitude, data.latitude, 14);

               var winRmap2 = window.rmap2;
               winRmap2.show();
               winRmap2.addEventListener(RMap6.Event.MAP_ZOOMED, movingGetLevel); //地图放大缩小
               winRmap2.getControls().addCompass('../static/img/map/compass3.png');

               var mm = winRmap2.getMarkerManager();

               var telesemes = Map["teleseme"];
               for (var i = 0; i < telesemes.length; i++) {
                   mm.addIconMarker(telesemes[i].Cx, telesemes[i].Cy, pointTypeUrl.teleseme);
               }

               var cars = pSKeeping;
               for (var i in cars) {
                   car = cars[i];
                   if (car == null) {
                       continue;
                   }
                   if (data.longitude.toString() == car.Cx.toString()) {
                       continue;
                   }
                   mm.addIconMarker(car.Cx, car.Cy, pointTypeUrl[car.obj.pointData.pointTypeUrl], 22, 44);
                   var loco = new RMap6.Marker.LabelMarker(car.Cx, car.Cy, car.obj.pointData.locoTypeStr + "<" + car.obj.pointData.checiName + "> " + car.obj.pointData.lateMinutes, "#F1E1FF", 2);
                   var a = mm.addMarker(loco);
               }

               var img = data.Point.pointType == "station" ? pointTypeUrl.station : (data.Point.pointType == "locomotive" ? pointTypeUrl.locomotive : pointTypeUrl.railways);
               var imgtemp = mm.addIconMarker(data.longitude, data.latitude, img, 22, 44);
               var name = "";
               if (data.sendData.dName != "") {
                   name = data.sendData.dName;
               }
               else if (data.sendData.sName != "") {
                   name = data.sendData.sName;
               }
               else if (data.sendData.bName != "") {
                   name = data.sendData.bName;
               }
               var lbm = new RMap6.Marker.LabelMarker(data.longitude, data.latitude, name, "#0f0", 2);
               lbm.draw(100, 200);
               mm.addMarker(lbm);
               winRmap2.getMarkerManager().showAll();
               winRmap2.addStaticLayer("../railWay/railWay?lineDown=6&mainLine=10&stationLine=14&r=" + new Date().getTime() + "&str=&path=");
           };
           return function (data) {
               $("#" + data.tabId + " .Div1").html("");
               initMap(data);
           };
       });
       // 查询昌九线所有的车站信息
       RTU.register("map.addInitMarkShowCount.searchStation", function () {
           return function () {
               var url = "railWay/railWayStationList?r=1415591366785&path=" + Map.Level + "/144/35/36_34.png";
               var param = {
                   url: url,
                   cache: false,
                   asnyc: true,
                   datatype: "json",
                   success: function (data) {
                       RTU.invoke("app.addStation", data.data);
                   },
                   error: function () {
                   }
               };
               RTU.invoke("core.router.get", param);
           };
       });
       RTU.invoke("map.addInitMarkShowCount.searchStation");
       //查询机车信息
       RTU.register("app.addInitMarkShowCount.searchTrainInfo", function () {
           var $buildItem = function (data, index) {
               this.$item = $(".label-tfoot1");
               this.$item.find(".index").html(index);
               if (data.locoAb == "0") {
                   this.$item.find(".locoInfo").html(data.locoTypeName + "-" + data.locoNO);
               } else if (data.locoAb == "1") {
                   this.$item.find(".locoInfo").html(data.locoTypeName + "-" + data.locoNO + window.locoAb_A);
               } else if (data.locoAb == "2") {
                   this.$item.find(".locoInfo").html(data.locoTypeName + "-" + data.locoNO + window.locoAb_B);
               }
               this.$item.find(".checiName").html(data.checiName);
               this.$item.find(".trainType").html(data.trainType);
               this.$item.find(".depotName").html(data.depotName);
               this.$item.find(".lineName").html(data.lineName);
               this.$item.find(".kiloSign").html(data.kiloSign / 1000);
               this.$item.find(".isOnline").html(data.isOnline);

               this.$item.find(".sName").html(data.sName);
               this.$item.find(".bureauName").html(data.bureauName);
               return $(this.$item.html());
           };
           return function (obj) {
               function conditions() {
                   return [{ "name": "sname", "value": obj.sendData.sName },
                    { "name": "bname", "value": obj.sendData.bName },
                    { "name": "dname", "value": obj.sendData.dName}];
               }

               window.refreshCountStation = psModel.subscribe("refreshData", function (t, data) {
                   var trainCountObj = {};

                   var objTbody = $("#" + obj.tabId + " .label-tbody1");
                   $(objTbody).html("");
                   var dataLen = data.length;
                   for (var i = 0; i < dataLen; i++) {
                       $(objTbody).append(new $buildItem(data[i], i + 1));
                       var countT = trainCountObj[data[i].trainType];
                       if (countT == null) {
                           trainCountObj[data[i].trainType] = 1;
                       } else {
                           trainCountObj[data[i].trainType] = countT + 1;
                       }
                   }

                   var a = [];
                   for (var key in trainName) {
                       var ct = 0;
                       if (trainCountObj[key] != null) {
                           ct = trainCountObj[key];
                       }
                       a.push({ trainType: trainName[key], count: ct });
                   }

                   obj.setData = a;
                   setDivCss(obj);
               }, conditions);
               psModel.searchNow();
           };
       });
       //初始化html
       function setDivCssInit(obj) {
           var objId = $("#" + obj.tabId);
           $(" .label-tbody1", $(objId)).children().remove();
           var height = $(" .label_horizontal_line", $(objId)).height();
           $(" .label_passenger_train", $(objId)).css("height", 0);
           $(" .label_passenger_train_count", $(objId)).css("top", height);
           $(" .label_goods_train", $(objId)).css("height", 0);
           $(" .label_goods_train_count", $(objId)).css("top", height);
           $(" .label_power_train", $(objId)).css("height", 0);
           $(" .label_power_train_count", $(objId)).css("top", height);
           $(" .label_high_train", $(objId)).css("height", 0);
           $(" .label_high_train_count", $(objId)).css("top", height);
           $(" .label_char", $(objId)).removeClass("hiddenDiv");
           $(" .label_info", $(objId)).addClass("hiddenDiv");
           $(" .label_img", $(objId)).addClass("hiddenDiv");
           $(" .label-basic-tab-div", $(objId)).addClass("label-border-bottom-type").removeClass("label-tab-background").addClass("label-border-top-click").addClass("label-border-left");
           $(" .label-info-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
           $(" .label-img-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
       }
       //设置img
       function setDivImg(obj) {
           var objId = $("#" + obj.tabId);
           $(" .imgShow", $(objId)).html("");

           var img = $(" .imgShow", $(objId));
           var div = "";
           if (obj.Point.obj.pointData.id == "南昌机务段") {
               div = '<img class="DivImg" src="../static/img/app/labelcountquery/nanchangDepot.png" />';
               $(img).html(div);
           }
           if (obj.Point.obj.pointData.id == "九江火车站") {
               div = '<img class="DivImg" src="../static/img/app/labelcountquery/jiujiangStation.png" />';
               $(img).html(div);
           }
           if (obj.Point.obj.pointData.id == "南昌火车站") {
               div = '<img class="DivImg" src="../static/img/app/labelcountquery/nanchangStation.png" />';
               $(img).html(div);
           }
       };
       //根据查询结果设置html的样式
       function setDivCss(obj) {
           var height = $(".label_horizontal_line").height(); //左侧的坐标轴高度
           var totalCount = 0; //得到车的总数，下面设置高度用百分比来设置

           var objDataLen = obj.setData.length;
           var objData = obj.setData;
           for (var i = 0; i < objDataLen; i++) {
               totalCount = totalCount + objData[i].count;
           }
           for (var i = 0; i < objDataLen; i++) {
               var objId = $("#" + obj.tabId);
               if (objData[i].trainType == trainName[2]) {
                   if (objData[i].count == 0) {
                       $(" .label_passenger_train", $(objId)).css("height", 0);
                       $(" .label_passenger_train_count", $(objId)).css("top", height);
                   } else {
                       $(" .label_passenger_train", $(objId)).css("height", (objData[i].count / totalCount) * height);
                       $(" .label_passenger_train_count", $(objId)).css("top", (height - (objData[i].count / totalCount) * height));
                   }
                   $(" .label_passenger_train_count", $(objId)).text(objData[i].count);
                   $(" .label_passenger_train_type", $(objId)).text(objData[i].trainType);

               } else if (objData[i].trainType == trainName[1]) {
                   if (objData[i].count == 0) {
                       $(" .label_goods_train", $(objId)).css("height", 0);
                       $(" .label_goods_train_count", $(objId)).css("top", height);
                   } else {
                       $(" .label_goods_train", $(objId)).css("height", (objData[i].count / totalCount) * height);
                       $(" .label_goods_train_count", $(objId)).css("top", (height - (objData[i].count / totalCount) * height));
                   }
                   $(" .label_goods_train_count", $(objId)).text(objData[i].count);
                   $(" .label_goods_train_type", $(objId)).text(objData[i].trainType);
               } else if (objData[i].trainType == trainName[4]) {
                   if (objData[i].count == 0) {
                       $(" .label_power_train", $(objId)).css("height", 0);
                       $(" .label_power_train_count").css("top", height);
                   } else {
                       $(" .label_power_train", $(objId)).css("height", (objData[i].count / totalCount) * height);
                       $(" .label_power_train_count", $(objId)).css("top", (height - (objData[i].count / totalCount) * height));
                   }
                   $(" .label_power_train_count", $(objId)).text(objData[i].count);
                   $(" .label_power_train_type", $(objId)).text(objData[i].trainType);

               } else if (objData[i].trainType == trainName[3]) {
                   if (objData[i].count == 0) {
                       $(" .label_high_train", $(objId)).css("height", 0);
                       $(" .label_high_train_count", $(objId)).css("top", height);
                   } else {
                       $(" .label_high_train", $(objId)).css("height", (objData[i].count / totalCount) * height);
                       $(" .label_high_train_count", $(objId)).css("top", (height - (objData[i].count / totalCount) * height));
                   }
                   $(" .label_high_train_count", $(objId)).text(objData[i].count);
                   $(" .label_high_train_type", $(objId)).text(objData[i].trainType);
               }
           }
       }
       //初始化title切换
       RTU.register("app.addInitMarkShowCount.initBut", function () {
           return function (obj) {
               var objId = $("#" + obj.tabId);
               $(" .label-basic-tab-div", $(objId)).unbind("click").click(function () {
                   $(this).addClass("label-border-bottom-type").removeClass("label-tab-background").addClass("label-border-top-click").addClass("label-border-left");
                   $(" .label-info-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $("  .label-img-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $(" .label_char", $(objId)).removeClass("hiddenDiv");
                   $(" .label_info", $(objId)).addClass("hiddenDiv");
                   $(" .label_img", $(objId)).addClass("hiddenDiv");
                   obj.Point.setTabWH({ width: 420, height: 330 });

               });
               $(" .label-info-tab-div", $(objId)).unbind("click").click(function () {
                   $(this).addClass("label-border-bottom-type").removeClass("label-tab-background").addClass("label-border-top-click");
                   $("  .label-basic-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $("  .label-img-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $(" .label_info", $(objId)).removeClass("hiddenDiv");
                   $(" .label_char", $(objId)).addClass("hiddenDiv");
                   $(" .label_img", $(objId)).addClass("hiddenDiv");
                   obj.Point.setTabWH({ width: 700, height: 420 });

               });
               $("  .label-img-tab-div", $(objId)).unbind("click").click(function () {
                   $(this).addClass("label-border-bottom-type").removeClass("label-tab-background").addClass("label-border-top-click").addClass("label-border-right");
                   $(" .label-basic-tab-div", $(objId)).removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $("  .label-info-tab-div").removeClass("label-border-bottom-type").addClass("label-tab-background").removeClass("label-border-top-click");
                   $(" .label_info", $(objId)).addClass("hiddenDiv");
                   $(" .label_char", $(objId)).addClass("hiddenDiv");
                   $(" .label_img", $(objId)).removeClass("hiddenDiv");
                   obj.Point.setTabWH({ width: 700, height: 420 });

               });
               $(" .closediv", $(objId)).unbind("click").click(function () {
                   $(objId).hide();
               });
               $(" .label-basic-tab-div", $(objId)).click();
           };
       });
   }
   /***车站、机务段、铁路局的左键统计**end************************************************************************************************************/
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
		    			//rgb(51, 166, 59)
		    			$(point.Icon).after('<div  class="TIPSDiv" style="line-height: 20px;font-family: initial;position:absolute;border-radius:5px;text-align:center;top:'+($(point.Icon).height()/2-10)+'px;left:'+($(point.Icon).width()+5)+'px;color:#fff;background-color:blue;opacity: 0.7;padding:0px 5px; display:inline-block;min-width:20px;white-space:nowrap;)">' + point.TIPSID + '</div>');
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
   
   {
       RTU.register("point.TipsSetting", function () {
           return function (point) {
               var p = $(point.Icon).parent();
               var vs = userData["TipsSetting"];
               if ($(".TIPSDiv", p) && $(".TIPSDiv", p).length > 0) {
                   if (vs == "none") {
                       $(".TIPSDiv", p).text("");
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
                   $(".TIPSDiv", p).text(html);
                   /*$(TIPSDiv).text(point.obj.pointData.tips);*/
                  /* var html = "";
                   var pointData = point.obj.pointData;
                   if (vs.indexOf("1") != -1) {
                       html = html + pointData.locoTypeName + "-";
                   }
                   
                   if (vs.indexOf("2") != -1) {
                	   
                	   html = html + pointData.locoNo ;

                       if (pointData.locoAb == "0") {
                       } else if (pointData.locoAb == "1") {
                      	 html=html+window.locoAb_A;
                       } else {
                      	 html=html+window.locoAb_B;
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
                   $(".TIPSDiv", p).text(html);*/
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
                   var p = $(window.carPoints[i].Icon).parent();
                   if ($(".TIPSDiv", p) && $(".TIPSDiv", p).length > 0) {
                       if (vs == "none") {
                           $(".TIPSDiv", p).text("");
                       } else {
                           var html = "";
                           var pointData = window.carPoints[i].obj.pointData;
                           if (vs.indexOf("1") != -1) {
                               html = html + pointData.locoTypeName + "-";
                           }
                           if (vs.indexOf("2") != -1) {
                        	   
                        	   html = html + pointData.locoNo ;
                        	   
                        	   if (pointData.locoAb == "0") {
                               } else if (pointData.locoAb == "1") {
                              	 html=html+window.locoAb_A;
                               } else {
                              	 html=html+window.locoAb_B;
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
                           $(".TIPSDiv", p).text(html);
                       }
                   }
               }
           };
       });
   }
   /**tIPS的tab控制****end******************************************************************************************************/

   /**地图级别变化到某一级别，标注变为小图标****begin******************************************************************************************************/
   {
       var flag = true;
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
           if (p.pointType == "locusPoint" || p.pointType == "teleseme") {
               return;
           }

           p.IconUrl = data.imgurl || p.IconUrl;
           p.IconWidth = data.width || p.IconWidth;
           p.IconHeight = data.height || p.IconHeight;

           var tab = $("#" + p.obj.tabId);
           var tabParent = $(p.Icon).parent();
           var stationDiv = $(".stationDiv", $(tabParent));
           var TIPSDiv = $(".TIPSDiv", $(tabParent));
           if (p.pointType == "transparentLess" || p.pointType == "transparent"|| p.pointType == "rlimitPoint") {
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
           if (stationDiv.length != 0) {
               var sh = stationDiv.height();
               stationDiv.css({ left: (pw + pl) + 5, top: -1 * sh / 2 + ph / 2 });
           }
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
       window.tagShowLessenMark = "set";
       RTU.register("map.showLessenMark", function () {
           return function (Point) {
               var parr = [];
               if (Point) {
                   parr.push(Point);
               }
               var mapMarkerLen = parr.length == 0 ? window.carPoints.length : parr.length;
               var mapMarker = parr.length == 0 ? window.carPoints : parr;
               // 1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
               if(window.tagShowLessenMark=="set"){
               	if(Map.Level <= window.publicData["carLevelShow"]){
               		window.tagShowLessenMark=true;
               	}else{
               		
               		window.tagShowLessenMark=false;
               	}
               }
               if (Map.Level <= window.publicData["carLevelShow"]&&window.tagShowLessenMark==true) {
                   for (var i = 0; i < mapMarkerLen; i++) {
                     if(mapMarker[i].obj&&mapMarker[i].obj.pointData){
                   	  var isOnline = mapMarker[i].obj.pointData.isOnline;
                         var isAlarm = mapMarker[i].obj.pointData.isAlarm;
                         if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm == "1")) {
                             var info = window.publicData["IconlessLocoAlertOffline"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         }
                         else if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm != "1")) {
                             var info = window.publicData["IconlessLocoOffline"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         }
                         else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm == "1")) {
                             var info = window.publicData["IconlessLocoAlertOnline"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         }
                         else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm != "1")) {
                             var info = window.publicData["IconlessLocoOnline"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         } else if (mapMarker[i].pointType == "railways") {
                             var info = window.publicData["Iconrailways"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         }
                         else if (mapMarker[i].pointType == "locomotive") {
                             var info = window.publicData["Iconlocomotive"].split("-");
                             setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                         }
                     }
//                        else if (mapMarker[i].pointType.indexOf("station") != -1) {
//                            var  info=window.publicData["IconLessStation"].split("-");
//                            setImg({ index: i, imgurl:info[0] , width: info[1], height: info[2],DetaY:-7,DetaX:-7 });
//                        }
                       window.tagShowLessenMark=false;
                   }
               } else if (Map.Level > window.publicData["carLevelShow"]&&window.tagShowLessenMark==false) {
                   for (var i = 0; i < mapMarkerLen; i++) {
                     if(mapMarker[i].pointType){
                       if (mapMarker[i].pointType.indexOf("station") != -1) {
                       }
                       else if (mapMarker[i].pointType == "railways") {
                           var info = window.publicData["Iconrailways"].split("-");
                           setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                       }
                       else if (mapMarker[i].pointType == "locomotive") {
                           var info = window.publicData["Iconlocomotive"].split("-");
                           setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                       } else {
                           var carType = mapMarker[i].obj.pointData.pointTypeUrl;
                           switch (carType) {
                               case "dongcheOnline":
                                   var info = window.publicData["IcondongcheOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "dongcheOffline":
                                   var info = window.publicData["IcondongcheOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "dongcheAlertOffline":
                                   var info = window.publicData["IcondongcheAlertOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "dongcheAlertOnline":
                                   var info = window.publicData["IcondongcheAlertOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "kecheOnline":
                                   var info = window.publicData["IconkecheOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "kecheOffline":
                                   var info = window.publicData["IconkecheOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "kecheAlertOnline":
                                   var info = window.publicData["IconkecheAlertOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "kecheAlertOffline":
                                   var info = window.publicData["IconkecheAlertOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "huocheOffline":
                                   var info = window.publicData["IconhuocheOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "huocheOnline":
                                   var info = window.publicData["IconhuocheOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "huocheAlertOffline":
                                   var info = window.publicData["IconhuocheAlertOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "huocheAlertOnline":
                                   var info = window.publicData["IconhuocheAlertOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "highRailOffline":
                                   var info = window.publicData["IconhighRailOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "highRailOnline":
                                   var info = window.publicData["IconhighRailOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "highRailAlertOffline":
                                   var info = window.publicData["IconhighRailAlertOffline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                               case "highRailAlertOnline":
                                   var info = window.publicData["IconhighRailAlertOnline"].split("-");
                                   setImg({ index: i, imgurl: info[0], width: info[1], height: info[2], DetaY: -7, DetaX: -7 }, mapMarker[i]);
                                   break;
                           }
                   	}
                       }
                   }
               }
           };
       });
   }
   // /**地图级别变化到某一级别，标注变为小图标****end******************************************************************************************************/     
   //     /**从数据库中查询个人设置信息****begin******************************************************************************************************/  
   //     ; (function () {
   //         //tIPS个人设置等级
   //       if(userData["Tips"])
   //         showCarPointLevel = parseInt(userData["Tips"]);
   //         RTU.invoke("map.showCarPointLevel", showCarPointLevel);
   //         //车站
   //         if(userData["Station"])
   //         RTU.invoke("map.Station", parseInt(userData["Station"]));
   //         //信号机
   //         if(userData["Signal"])
   //         RTU.invoke("map.Teleseme", parseInt(userData["Signal"]));
   //         //道岔
   //         if(userData["DaoCha"])
   //         RTU.invoke("map.Turnout", parseInt(userData["DaoCha"]));
   //         //机车
   //         if(window.publicData["carLevelShow"])
   //             RTU.invoke("map.showLessenMark", parseInt(window.publicData["carLevelShow"]));
   //     })();

   // /**从数据库中查询个人设置信息****end******************************************************************************************************/

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
});
