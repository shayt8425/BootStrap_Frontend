RTU.DEFINE(function (require, exports) {
/**
 * 模块名：地图引擎操作
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    require("jquery/jquery-1.7.2.min.js");
    require("map/RMap5.js");
    require("jquery/jquery.autocomplete.css");
    require("jquery/jquery.autocomplete.js");
    require("../../../css/app/app-map.css");
    require("../../../css/app/labelcountquery/labelcountquery.css");
    require("../../../css/app/app-list.css");
    window.Map = null;
    window.ToolManager = null;
    window.currentPoint = null;
    window.isUpdate = true;
    var mapLayer = null;
    window.isUpdateTimer = null;
    window.timert = null; //平滑计时器
    window.rightcount = 0;
    window.publicData = {};
    window.loadData = {};
    window.centerMarker=null;
    window.pointTypeUrl = {
        "dongcheOnline": "../static/img/map/dongcheOnline.png", //动车在线
        "dongcheOffline": "../static/img/map/dongcheOffline.png", //动车离线
        "dongcheAlertOffline": "../static/img/map/dongcheAlertOffline.gif", //动车警报离线
        "dongcheAlertOnline": "../static/img/map/dongcheAlertOnline.gif", //动车警报在线
        "kecheOnline": "../static/img/map/kecheOnline.png", //客车在线
        "kecheOffline": "../static/img/map/kecheOffline.png", //客车下线
        "kecheAlertOnline": "../static/img/map/kecheAlertOnline.gif", //客车警报在线
        "kecheAlertOffline": "../static/img/map/kecheAlertOffline.gif", //客车警报下线
        "huocheOffline": "../static/img/map/huocheOffline.png", //货车离线
        "huocheOnline": "../static/img/map/huocheOnline.png", //货车在线
        "huocheAlertOffline": "../static/img/map/huocheAlertOffline.gif", //货车警报离线
        "huocheAlertOnline": "../static/img/map/huocheAlertOnline.gif", //货车在警报线
        "highRailOffline": "../static/img/map/highRailOffline.png", //高铁离线
        "highRailOnline": "../static/img/map/highRailOnline.png", //高铁在线
        "highRailAlertOffline": "../static/img/map/highRailAlertOffline.gif", //高铁警报离线
        "highRailAlertOnline": "../static/img/map/highRailAlertOnline.gif", //高铁在警报线
        "alarm1": "../static/img/map/alarm1.png", //一级警报
        "alarm2": "../static/img/map/alarm2.png", //二级警报
        "alarm3": "../static/img/map/alarm3.png", //三级警报
        "alarm4": "../static/img/map/alarm4.png", //四级警报
        "locostaff": "../static/img/map/locostaff.png", //机车乘务员
        "movePoint": "../static/img/map/movePoint.png", //移动端
        "railways": "../static/img/map/railways.png", //铁路局
        "teleseme": "../static/img/map/teleseme2.png", //信号机
        "station": "../static/img/map/station.png", //车站
        "fxPoint": "../static/img/map/fxPoint.png", //分相点
        "bridge": "../static/img/map/bridge.png", //桥梁
        "tunnel": "../static/img/map/tunnel.png", //隧道
        "demarPoint": "../static/img/map/demarPoint.png", //分解口
        "turnout": "../static/img/map/turnout.png", //道岔
        "PfloodPoint": "../static/img/map/PfloodPoint.png", //防汛点
        "WfloodPoint": "../static/img/map/WfloodPoint1.png", //防洪
        
        "FloodPreventionAndFloodControl": "../static/img/map/WfloodPoint1.png", //防洪防汛  标注点
        "temporarySpeedLimitPoint": "../static/img/map/rlimitPoint1.png",       //临时限速   标注点
        "transshipmentPoint": "../static/img/map/turnout.png", 					//换装点       标注点
        "otherPoint": "../static/img/map/fxPoint.png", 							//其它           标注点
        
        "rlimitPoint": "../static/img/map/rlimitPoint1.png", //临时限速点
        "eelectronraildepotPoint": "../static/img/map/tunnel.png", //临时限速点
        "electronraildepotPointMain": "../static/img/map/rlimitPoint1.png", //临时限速点
        "crossing": "../static/img/map/crossing.png", //道口
        "LslidesPoint": "../static/img/map/LslidesPoint.png", //塌方点
        "locomotive": "../static/img/map/locomotive.png", //机务段
        "guDaoNumber": "../static/img/map/guDaoNumber.png", //股道编号
        "transparentLess": "../static/img/map/transparent.png", //
        "transparent": "../static/img/map/transparent.png"//透明图片
    };
    window.pointParm = {
        pointId: "", //标记点的id字段用于更新
        isSetCenter: false, //是否设置中心
        tabId: "", //tab的id
        tabWidth: 330, //tab 宽度
        tabHeight: 290, //tab 的高度
        iconWidth: 14, //点的 宽度
        iconHeight: 14, //点的高度
        iconLeft: -7, //点图标left
        iconTop: -7, //点图标top
        imgUrl: '', //自己设置点的 图片
        pointType: 'huocheOnline', //添加的点的类型，例如
        pointData: null, //点的数据对象
        pointDatas: null, //添加多个点的时候
        initFn: null, //初始化函数
        closeFn: null, //关闭回调函数
        closeImg: true, //是否显示右上角的关闭按钮
        colNames: null, //数据的列名称
        setDataSeft: true, //是否自动填充数据
        searchFn: null, //查询回调
        isShowTabBottom: true, //是否显示横线一下部分
        tabHtml: "", //自己填充的html数据 结合 setDataSeft =false 使用。
        traceFn: null, //追踪事件
        showMarker: false, //显示标注点
        itemData: null, //自定义tab的每个点的数据
        loadData: null, //加载数据函数
        TIPSID: "", //TIPS 的字段
        rightHand: null//图标邮件点击事件
    };
    //复制对象
    function clone(Obj) {
        if (typeof (Obj) != 'object') return Obj;
        if (Obj == null) return Obj;
        var myNewObj = new Object();
        for (var i in Obj)
            myNewObj[i] = Obj[i];
        return myNewObj;
    }
    //根据point 类型返回点的url
    window.getImgUrl = function (pointType) {
        for (var i in window.pointTypeUrl) {
            if (i == pointType) {
                return window.pointTypeUrl[i];
                break;
            }
        }
        return "huocheOnline";
    };
    //贮存tab的分类
    window.getTabType = function (type, obj) {
        switch (type) {
            case 'base':
                var arr = [];
                if(obj.tabHtml.indexOf('realtimeloco-info.html')<0){
                	arr.push('<div class="pointTab" id="' + obj.tabId + '" style="width:' + obj.tabWidth + 'px;height:' + obj.tabHeight + 'px;margin-top:' + (-obj.tabHeight - 20) + 'px;margin-left:' + (-obj.tabWidth / 2 + 20) + 'px">');
                	arr.push('<div class="closediv"></div><img'+(!obj.itemData||obj.itemData.lkjType==0?"":" style='bottom:-32px'")+' class="bottomImg" src="../static/img/map/dropwnd_dir.png" /><div class="pointTab_shadow_down"></div><div class="pointTab_shadow_down_left"></div><div class="pointTab_shadow_down_right"></div><div class="pointTab_shadow_top"></div><div class="pointTab_shadow_top_left"></div><div class="pointTab_shadow_top_right"></div><div class="pointTab_shadow_left"></div><div class="pointTab_shadow_right"></div><div class="paointab_contain">' + obj.tabHtml);
                	arr.push('</div></div>');
                }else{
                	arr.push('<div class="pointTab" id="' + obj.tabId + '" style="width:' + obj.tabWidth + 'px;height:' + obj.tabHeight + 'px;margin-top:' + (-obj.tabHeight - 20) + 'px;margin-left:' + (-obj.tabWidth / 2 + 20) + 'px">');
                	arr.push('<div class="closediv" style="display:none"></div><img'+(!obj.itemData||obj.itemData.lkjType==0?"":" style='bottom:-32px'")+' class="bottomImg" src="../static/img/map/dropwnd_dir.png" /><div class="pointTab_shadow_down"></div><div class="pointTab_shadow_down_left"></div><div class="pointTab_shadow_down_right"></div><div class="pointTab_shadow_top" style="background: #444C60;height:30px;top:-30px;font-size:14px;color:#FFF"><div style="margin:5px 0px 0px 15px;">运行信息</div><div class="popuwnd-title-del-btn" onclick="$(this).parent().parent().find(\'.closediv:first\').click();"></div></div><div class="pointTab_shadow_top_left"></div><div class="pointTab_shadow_top_right"></div><div class="pointTab_shadow_left"></div><div class="pointTab_shadow_right"></div><div class="paointab_contain">' + obj.tabHtml);
                	arr.push('</div></div>');
                }
                var tab = {
                    customHtml: arr.join(""),
                    html: "",
                    detaX: 0,
                    detaY: 0
                };
                return tab;
                break;
            default:
        }
    };
    /**个人设置的所有查询（总）****begin******************************************************************************************************/
    window.userData = {};
    //给userData设置默认值
    RTU.register("user.setDefaultValue", function () {
        userData = { //默认值
            "BaselineColor": "128,0,128",
            "DaoCha": "8",
            "FTPPath": "191.168.230.214:8080",
            //      		"GuDao": "3",
            //      		"GuDaoZX": "9",
            //      		"GuDaoZXShangXing": "7",
            //      		"GuDaoZXXiaXing": "6",
            //      		"GuDaoZhanXian": "14",
            //      		"MaxStation":"13",
            //      		"MedStation":"10",
            //      		"MinStation":"6",
            //      		"GuDaoVersion":"1",
            //      		"DisVersion":"1",
            //      		"StationVersion":"1",
            "IconDongcheAlertOffline": "undefined",
            "IconDongcheAlertOnline": "../static/img/map/highRailAlertOnline.gif",
            "IconDongcheOffline": "undefined",
            "IconDongcheOnline": "../static/img/map/highRailAlertOnline.gif",
            "IconHighRailAlertOffline": "../static/img/map/tunnel.png",
            "IconHuocheAlertOffline": "../static/img/map/huocheOffline.png",
            "IconHuocheOnline": "../static/img/map/movePoint.png",
            "IconKecheAlertOffline": "../static/img/map/turnout.png",
            "IconKecheOffline": "../static/img/map/dongcheOffline.png",
            "IconKecheOnline": "../static/img/map/kecheAlertOffline.gif",
            "IconStation": "../static/img/map/kecheOnline.png",
            "IconTeleseme": "../static/img/map/teleseme2.png",
            "IconTurnout": "../static/img/map/turnout.png",
            "IcondongcheAlertOffline": "../static/img/map/highRailAlertOffline.gif",
            "IcondongcheAlertOnline": "../static/img/map/highRailAlertOnline.gif",
            "IcondongcheOffline": "../static/img/map/highRailOffline.png",
            "IcondongcheOnline": "../static/img/map/highRailOnline.png",
            "IconhuocheAlertOnline": "undefined",
            "IconkecheAlertOnline": "undefined",
            "Iconstation": "../static/img/map/kecheOnline.png",
            "Iconteleseme": "../static/img/map/teleseme2.png",
            "Iconturnout": "../static/img/map/turnout.png",
            //标注点类型图片
            "IconFloodPreventionAndFloodControl": "../static/img/map/WfloodPoint1.png",
            "IcontemporarySpeedLimitPoint": "../static/img/map/rlimitPoint1.png",
            "IcontransshipmentPoint": "../static/img/map/turnout.png",
            "IconotherPoint": "../static/img/map/fxPoint.png",
            
            "IsOnlineMinutes": "11",
            "LineUpColor": "31,1,14",
            "LkjInfoHis": "checiName,factJiaolu,guanya,gangya,signalType,signalNo,locoSignal,frontStationNo,kiloSign,frontDistance,",
            "LkjInfoHisM1": "factJiaolu,stationNo,speed,signalType,signalNo,locoSignal,workStatus,frontStationNo,kiloSign,frontDistance,jkstate,",
            "LkjInfoHisM2": "checiName,lkjTime,factJiaolu,stationNo,speed,guanya,gangya,signalType,signalNo,locoSignal,workStatus,frontStationNo,kiloSign,frontDistance,jkstate,",
            "LkjInfoHisM3": "lkjTime,guanya,gangya,jkstate,signalType,signalNo,workStatus,frontStationNo,kiloSign,frontDistance",
            "LkjVersion": "locoNo,lkjTime,deviceCorp,jkzbA,jkzbB,jkzbAdata,jkzbBdata,monitor1,monitor2,monitor1Data,monitor2Data,groundA,groundB,txbA,kztxbB,jkzbAjkdate,jkzbBjkdate,txbB,kztxbA,",
            "LkjVersionM1": "recId,receiveTime,locoNo",
            "LkjVersionM2": "proVer,locoNo,locoIp,deptId,appType,frameNo",
            "LkjVersionM3": "jkzbA,jkzbB,jkzbAdata,jkzbBdata,monitor1,monitor2,monitor1Data,monitor2Data,groundA,groundB,txbA,kztxbB,jkzbBjkdate,txbB,",
            "MapLevel": "7,115.854277874,28.686920406",
            "RecordingLastClick": "0",
            "RefreshData": "5",
            "SetMapShowModel": "“1”/",
            "Signal": "8",
            "Station": "5",
            "StationLineColor": "64,128,128",
            "Tips": "6",
            "TipsSetting": "1,2,3,",
            "TscStatusHis": "checiName,laisTime,tscType,cpuTemp,can0State,can2State,can3State,eth2State,gpsState,wlanState,com1State,com2State,",
            "TscStatusHisM1": "infoFrameNo,cpuTemp",
            "TscStatusHisM2": "can3State,can0State,can1State,can2State,appType",
            "TscStatusHisM3": "laisTime,tscType,cpuTemp,can2State,can3State,eth0State,eth1State,eth2State,gpsState,wlanState,com1State,com2State,",
            "Turnout": "2",
            "WfloodPointLevel":"4",
            "RlimitPointLevel":"4",
            "EelectronraildepotPointLevel":"4",
            "FxPointLevel":"4",
            "guDaoNumColor":"pink",
            "GudaoNumLevel":"4",
            "carLevelShow": "4",
            "railwaysBackgroundColor": "72,181,40",
            "railwaysFontColor": "255,255,255",
            "stationState": "open",
            "telesemeState": "close",
            "turnoutState": "close",
            "皮肤": "红色",
            "Urlczsb":"http://10.158.51.181:8088/czsbgl/tps/TpsAction.do?operate=viewScrjcInfo&operPage=jcbb_screen_list_lcyx&yxflag=0",
            "Urlczsb_hz":"http://10.158.51.181:8088/czsbgl/tps/TpsAction.do?operate=Changeplan_ManualFinishView&operPage=changeplan_finish_search&moduleid=060102"
        };
        return function () {
        };
    });

    RTU.register("map.addGrayLayer", function () {
        return function () {
            // ToolManager.addScale(10, null, null, 23);
            var l = Map.addLayer("../railWay/mapLayerTest?path=");
            l.Div.div.style.zIndex = -10000;
            return l;
        };
    });
    var getMapWidth = function () {
        return $("#map").width();
    };
    var getMapHeight = function () {
        return $("#map").height();
    };
    var numMapLat = 28.662890625;
    var numMapLng = 115.917578125;
    var intMapZoom = 10;

    //查询所有的图标信息，并放入pointTypeUrl
    RTU.register("app.map.setPointTypeUrl", function () {
        $.ajax({
            url: "../syssetting/findByUserId?userId=-1&tempdate=" + new Date().getTime(),
            type: "get",
            async: false,
            success: function (data) {
                var data = $.parseJSON(data);
                if (data.data) {
                    for (var i = 0; i < data.data.length; i++) {
                        window.publicData[data.data[i].options] = data.data[i].optionvalue;
                    }
                }
            }
        });
        window.loadData = window.publicData;
        for (var n in window.pointTypeUrl) {
            if (window.publicData["Icon" + n]) {
                var iconArr = window.publicData["Icon" + n].split("-"); ;
                window.pointTypeUrl[n] = iconArr[0];
            }
        }
        return function () {
            return true;
        };
    });


    //默认层级以及中心点
    $.ajax({
        url: "../syssetting/findByUserId?userId=" + RTU.data.user.id,
        type: "get",
        async: false,
        success: function (data) {
            var data = $.parseJSON(data);
            if (data&&data.data) {
            	if(data.data.length>0){
	                for (var i = 0; i < data.data.length; i++) {
	                    userData[data.data[i].options] = data.data[i].optionvalue;
	                }
            	}
                if (userData["MapLevel"]) {
                    var vs = userData["MapLevel"].split(',');
                    numMapLat = parseFloat(vs[2]);
                    numMapLng = parseFloat(vs[1]);
                    intMapZoom = parseInt(vs[0]);
                }
            }
        }
    });
    

    
    initMap.mapTemp = null;
    initMap.mapMarker = null;
    window.mapModel="";

    //初始化地图
    function initMap(obj) {
        if (!obj.MapRoot && obj.isFirstLoad == true) {
            /*if (window.userData["SetMapShowModel"] == "1") {
            	RMapConstant.MapRoot = "/tile-railway/"; //通过NGINX配置
            	window.mapModel="railway";
            	RTU.invoke("map.showGuDaoNumberData");
            	if(Map&&Map.Level){
            		intMapZoom=Map.Level;
            		var center= Map.getCenter();
            		numMapLng=center.Cx,
            		numMapLat=center.Cy;
            	}
                inintMainMap();
                pSKeeping={};
                psModel.searchNow({ token: window.homeTimer });
            }
            else */
            	if (window.userData["SetMapShowModel"] == "2") {
            	RMapConstant.MapRoot = "/tile-moon/"; //通过NGINX配置
            	window.mapModel="moon";
            	RTU.invoke("map.showGuDaoNumberData");
            	if(Map&&Map.Level){
            		intMapZoom=Map.Level;
            		var center= Map.getCenter();
            		numMapLng=center.Cx,
            		numMapLat=center.Cy;
            	}
                inintMainMap();
                pSKeeping={};
                psModel.searchNow({ token: window.homeTimer });
//                inintMainMap();
//                 if (!mapLayer) {
//                    mapLayer = RTU.invoke("map.addGrayLayer");
//                }
//                $("div[_rmap='mask']").after("<div id='maplayerDiv' style='width:100%;height:100%;background-color:rgb(225, 231, 233) ;left:0px;top:0px;position:absolute;z-index:35' ></div>");

//                RTU.invoke("app.firstLoad.show");

            } else if (window.userData["SetMapShowModel"] == "0"||window.userData["SetMapShowModel"] == "reload") {
//                $("#maplayerDiv").remove();
//                $("div[_rmap='mask']").hide();
//                Map.removeLayer(mapLayer);
//                mapLayer = null;
            	 RMapConstant.MapRoot = "/tile/"; //通过NGINX配置
            	 window.mapModel="normal";
            	 RTU.invoke("map.showGuDaoNumberData");
            	 if(Map&&Map.Level){
             		intMapZoom=Map.Level;
             		var center= Map.getCenter();
            		numMapLng=center.Cx,
            		numMapLat=center.Cy;
             	}
                 inintMainMap();
                 pSKeeping={};
                 psModel.searchNow({ token: window.homeTimer });
//                RTU.invoke("app.firstLoad.show");
            }
            else {
            	RMapConstant.MapRoot = "/tile-railway/"; //通过NGINX配置
            	window.mapModel="railway";
            	RTU.invoke("map.showGuDaoNumberData");
            	if(Map&&Map.Level){
            		intMapZoom=Map.Level;
            		var center= Map.getCenter();
            		numMapLng=center.Cx,
            		numMapLat=center.Cy;
            	}
                inintMainMap();
                pSKeeping={};
                psModel.searchNow({ token: window.homeTimer });
            }
        }
        else if (!obj.MapRoot && obj.isFirstLoad == false) {
            //正常地图
//            $("#maplayerDiv").remove();
//            if (mapLayer) {
//                Map.removeLayer(mapLayer);
//                mapLayer = null;
//            }
        	 RMapConstant.MapRoot = "/tile/"; //通过NGINX配置
        	 window.mapModel="normal";
        	 RTU.invoke("map.showGuDaoNumberData");
        	 if(Map&&Map.Level){
         		intMapZoom=Map.Level;
         		var center= Map.getCenter();
        		numMapLng=center.Cx,
        		numMapLat=center.Cy;
         	}
             inintMainMap();
             pSKeeping={};
             psModel.searchNow({ token: window.homeTimer });
        }
        else if (obj.MapRoot=="/tile-railway/" && obj.isFirstLoad == false) {
            //铁路地图
        	 RMapConstant.MapRoot = "/tile-railway/"; //通过NGINX配置
        	 window.mapModel="railway";
        	 RTU.invoke("map.showGuDaoNumberData");
        	 if(Map&&Map.Level){
         		intMapZoom=Map.Level;
         		var center= Map.getCenter();
        		numMapLng=center.Cx,
        		numMapLat=center.Cy;
         	}
             inintMainMap();
             pSKeeping={};
             psModel.searchNow({ token: window.homeTimer });
//            if (!mapLayer) {
//                mapLayer = RTU.invoke("map.addGrayLayer");
//                $("div[_rmap='mask']").after("<div id='maplayerDiv' style='width:100%;height:100%;background-color:rgb(225, 231, 233) ;left:0px;top:0px;position:absolute;z-index:35' ></div>");
//            }
//            RTU.invoke("app.firstLoad.show");
        }else if(obj.MapRoot=="/tile-moon/" && obj.isFirstLoad == false){
        	RMapConstant.MapRoot = "/tile-moon/"; //通过NGINX配置
        	window.mapModel="moon";
        	RTU.invoke("map.showGuDaoNumberData");
        	if(Map&&Map.Level){
        		intMapZoom=Map.Level;
        		var center= Map.getCenter();
        		numMapLng=center.Cx,
        		numMapLat=center.Cy;
        	}
            inintMainMap();
            pSKeeping={};
            psModel.searchNow({ token: window.homeTimer });
        }else if(obj.MapRoot=="/tile/" && obj.isFirstLoad == false){
        	RMapConstant.MapRoot = "/tile/"; //通过NGINX配置
        	window.mapModel="normal";
        	RTU.invoke("map.showGuDaoNumberData");
        	if(Map&&Map.Level){
        		intMapZoom=Map.Level;
        		var center= Map.getCenter();
        		numMapLng=center.Cx,
        		numMapLat=center.Cy;
        	}
            inintMainMap();
            pSKeeping={};
            psModel.searchNow({ token: window.homeTimer });
        }
        function inintMainMap() {
            RMapConstant.MapMinLevel = 0;
            RMapConstant.MapMaxLevel = 15;

            $("#map").empty();
            console.log(getMapWidth())
            Map = new RMap("map", numMapLng, numMapLat, intMapZoom, getMapWidth(), getMapHeight());
            Map.addEventListener(RMapEvent.Moving, Moving);
            Map.addEventListener(RMapEvent.Moved, Moved);
            Map.addEventListener(RMapEvent.LevelChanging, LevelChanging);
            Map.addEventListener(RMapEvent.LevelChanged, LevelChanged);
            /*//注释开始
            Map.addEventListener(RMapEvent.MouseDoubleClickEvent, function(e){
            	if($("#index_checiName")&&$("#test").length>0){
            		$("#lng").val("lng:"+e.MouseCx);
            		$("#lat").val("lat:"+e.MouseCy);
            		
            	}else{
            		$("body").append("<div style='position:absolute;border:3px;z-index:888;left:50%;top:40px;width:220px;height:70px;background:blue;' id='test'><input type='text' size='28' id='lng' value='lng:+"+e.MouseCx+"'><input type='text' size='28' id='lat' value='lat:+"+e.MouseCy+"'></div>");
            	}
            	$("#index_checiName").val("longitude:"+e.MouseCx+",latitude:"+e.MouseCy);
        		
            });//注释结束
*/            
            Map.show();
            ToolManager = new RToolManager(Map);
            ToolManager.addScale(10, null, null, 23);
            ToolManager.addZoomDirectBar($(window).width() - 80, 100);
            $(window).resize(function () {
                Map.resize(getMapWidth(), getMapHeight());
                ToolManager.ZoomDirectBar.Div.set(getMapWidth() - 80, 100);
            });
        }
    }
    initMap({ isFirstLoad: true });

    function Moving() {

        isUpdate = false;
        if (timert)
            clearInterval(timert);
    }
    function Moved() {
        border.upJwd();        
        RTU.invoke("map.marker.clearSelectPointCssAll");        
    }
    function LevelChanging() {
        if (Map.SelectMarker) {
            Map.SelectMarker = null;
        }
        if (window.MagnifierMap) {
            window.MagnifierMap.layerDiv.hide();
            window.MagnifierMap.hideAllMarker();
        }
    }
    function LevelChanged() {
        setTimeout(function () {
//            RTU.invoke("map.setPointShow");
//            RTU.invoke("map.showCarPointLevel");
        	RTU.invoke("map.setGuDaoNumberDiv");
            RTU.invoke("app.firstLoad.showWfloodPointLevel");
            RTU.invoke("app.firstLoad.showRlimitPointLevel");
            RTU.invoke("app.firstLoad.showEelectronraildepotPointLevel");
            RTU.invoke("app.firstLoad.showFxPointLevel");
            RTU.invoke("map.showleftLevel", Map.Level);
            RTU.invoke("map.setGuDaoNumberDiv");
//            RTU.invoke("map.locomotive");
//            RTU.invoke("map.railways");
//            RTU.invoke("app.firstLoad.showTeleseme");
//            RTU.invoke("app.firstLoad.showDaocha");
            //RTU.invoke("map.refreshStationClick");
            RTU.invoke("map.Station");
            RTU.invoke("map.StationLess");
            RTU.invoke("map.railWayElectronicfence");
            
        
            setTimeout(function () {
            		window.tagShowLessenMark="set";
            	 RTU.invoke("map.showTipsLevel", window.publicData["TipsLevelShow"]);
            }, 1);
           
//            
//            setTimeout(function () {
//                RTU.invoke("map.showLessenMark");
//            }, 1);
            if (window.MagnifierMap) {
                window.MagnifierMap.layerDiv.show();
                window.MagnifierMap.showAllMarker();
            }
            $(".pointMouseoverDiv").remove();
        }, 1);
        border.upJwd();
    }
    /**加载地图，添加地图监听****end******************************************************************************************************/
    //设置点的层级显示
//    RTU.register("map.setPointShow", function () {
//        return function (data) {
//            if (data) {
//                userData[data.stateName] = data.stateValue;
//                userData[data.pointTypeName] = data.pointTypeValue;
//            }
//            if (userData["turnoutState"] == "open" && Map.Level >= parseInt(userData["DaoCha"])) {
//                RTU.invoke("map.showTurnout");
//            } else {
//                RTU.invoke("map.hideTurnout");
//            }
//            if (userData["telesemeState"] == "open" && Map.Level >= parseInt(userData["Signal"])) {
//                RTU.invoke("map.showTeleseme");
//            } else {
//                RTU.invoke("map.hideTeleseme");
//            }
//            if (userData["stationState"] == "open" && Map.Level >= parseInt(userData["Station"])) {
//                RTU.invoke("map.showStation");
//            } else {
//                RTU.invoke("map.hideStation");
//            }
//        };
//    });
    //是否地图更新
    RTU.register("map.isUpdate", function () {
        return function (data) {
            if (data) {
                isUpdate = data;
            }
            else {
                return isUpdate;
            }
        };
    });
    //返回Map对象
    RTU.register("map.getMap", function () {
        return function (data) {
            return { Map: Map, RMapEvent: RMapEvent };
        };
    });
    RTU.register("map.is", function () {
        return function () {
            $("#map").removeClass("hidden");
        };
    });
    //地图隐藏
    RTU.register("map.hidden", function () {
        return function () {
            $("#map").removeClass("hidden");
            $("#map").addClass("hidden");
        };
    });
    //地图隐藏
    RTU.register("map.marker.hidden2", function () {
        return function () {
            RTU.invoke("map.hidden");
        };
    });
    //刷新地图
    RTU.register("map.refresh", function () {
        return function () {
            Map.refresh();
        };
    });
    //加载图层，股道用到
    RTU.register("map.addLayer1", function () {
        return function (layer) {
            Map.addLayer(layer);
        };
    });
    //移除图层
    RTU.register("map.removeLayer", function () {
        return function (layer) {
            Map.removeLayer(layer);
        };
    });
    //添加图形（线条和图形）
    RTU.register("map.addGraphics", function () {
        return function (graphics) {
            Map.addGraphics(graphics);
        };
    });
    //刷新一个图形
    RTU.register("map.refreshGraphics", function () {
        return function (graphics) {
            Map.refreshGraphics(graphics);
        };
    });
    //刷新图形
    RTU.register("map.refreshAllGraphics", function () {
        return function () {
            Map.refreshAllGraphics();
        };
    });
    //显示图形
    RTU.register("map.showGraphics", function () {
        return function (graphics) {
            Map.showGraphics(graphics);
        };
    });
    //隐藏图形
    RTU.register("map.hideGraphics", function () {
        return function (graphics) {
            Map.hideGraphics(graphics);
        };
    });
    //显示所有图形
    RTU.register("map.showAllGraphics", function () {
        return function () {
            Map.showAllGraphics();
        };
    });
    RTU.register("map.hideAllGraphics", function () {
        return function () {
            Map.hideAllGraphics();
        };
    });
    //移除图形
    RTU.register("map.removeGraphics", function () {
        return function (graphics) {
            Map.removeGraphics(graphics);
        };
    });
    //移除所有图形
    RTU.register("map.removeAllGraphics", function () {
        return function () {
            Map.removeAllGraphics();
        };
    });
    RTU.register("map.runSizeChangedEvent", function () {
        return function (mapEvent) {
            Map.runSizeChangedEvent(mapEvent);
        };
    });
    //层级变换触发的函数
    RTU.register("map.runLevelChangeEvent", function () {
        return function (mapEvent) {
            Map.runLevelChangeEvent(mapEvent);
        };
    });
    //中心变化的时候触发的函数
    RTU.register("map.runCenterChangedEvent", function () {
        return function (mapEvent) {
            Map.runCenterChangedEvent(mapEvent);
        };
    });
    //运行移动完的事件
    RTU.register("map.runMovedEvent", function () {
        return function (mapEvent) {
            Map.runMovedEvent(mapEvent);
        };
    });
    //运行移动中的事件
    RTU.register("map.runMovingEvent", function () {
        return function (mapEvent) {
            Map.runMovingEvent(mapEvent);
        };
    });
    //给地图添加事件
    RTU.register("map.addEventListener", function () {
        return function (param) {
            Map.addEventListener(param.type, param.fn);
        };
    });
    RTU.register("map.hideAllWinddowBox", function () {
        return function () {
            Map.hideAllWinddowBox();
        };
    });
    //隐藏所有WinddowBox
    RTU.register("map.hideAllWinddowBox", function () {
        return function () {
            Map.hideAllWinddowBox();
        };
    });
    //隐藏特定的tabbox
    RTU.register("map.hideTabMarkerBox", function () {
        return function (marker) {
            Map.hideTabMarkerBox(marker);
        };
    });
    //显示特定的tabbox
    RTU.register("map.showTabMarkerBox", function () {
        return function (marker) {
            Map.showTabMarkerBox(marker);
        };
    });
    //刷新特定的tabbox
    RTU.register("map.refreshTabMarkerBox", function () {
        return function (marker) {
            Map.refreshTabMarkerBox(marker);
        };
    });
    //隐藏特定的tabbox
    RTU.register("map.hideWindowMarkerBox", function () {
        return function (marker) {
            Map.hideWindowMarkerBox(marker);
        };
    });
    //显示特定的WindowMarkerBox"
    RTU.register("map.showWindowMarkerBox", function () {
        return function (marker) {
            Map.showWindowMarkerBox(marker);
        };
    });
    //刷新特定的WindowMarkerBox"
    RTU.register("map.refreshWindowMarkerBox", function () {
        return function (marker) {
            Map.refreshWindowMarkerBox(marker);
        };
    });
    //刷新阴影
    RTU.register("map.refreshShadow", function () {
        return function (param) {
            Map.refreshShadow(param.left, param.top, param.width, param.height);
        };
    });
    //刷新某个点
    RTU.register("map.marker.refreshMarker", function () {
        return function (marker) {
            Map.refreshMarker(marker);
        };
    });
    //刷新所有点
    RTU.register("map.marker.refreshAllMarker", function () {
        return function () {
            Map.refreshAllMarker();
        };
    });
    //显示某个点
    RTU.register("map.marker.showMarker", function () {
        return function (marker) {
            Map.showMarker(marker);
        };
    });
    //显示所有点
    RTU.register("map.marker.showAllMarker", function () {
        return function () {
            Map.showAllMarker();
        };
    });
    //隐藏某个点
    RTU.register("map.marker.hideMarker", function () {
        return function (marker) {
            Map.hideMarker(marker);
        };
    });
    //隐藏所有点
    RTU.register("map.marker.hideAllMarker", function () {
        return function () {
            Map.hideAllMarker();
        };
    });
    //移除某个点
    RTU.register("map.marker.removeMarker", function () {
        return function (marker) {
            Map.removeMarker(marker);
        };
    });
    //给地图增加一个等级
    RTU.register("map.marker.addLevel", function () {
        return function () {
            Map.setLevel(Map.Level + 1);
        };
    });
    //给地图减少一个等级
    RTU.register("map.marker.reduceLevel", function () {
        return function () {
            Map.setLevel(Map.Level - 1);
        };
    });
    //设置地图中心位置
    RTU.register("map.setCenter", function () {
        return function (data) {
            if (data.top || data.left) {
                if (!data.top) data.top = 0;
                if (!data.left) data.left = 0;
                var LT = Map.toClientPoint(data.lng, data.lat);
                var top = LT.Y - data.top;
                var left = LT.X - data.left;
                var LngLat = Map.toCoordinates(left, top);
                Map.setCenter(LngLat.Cx, LngLat.Cy);

            }
            else {
                Map.setCenter(data.lng, data.lat);
            }
        };
    });
    //返回点的top left 坐标
    RTU.register("map.markTopLeft", function () {
        return function (data) {
            return Map.toClientPoint(data.lng, data.lat);
        };
    });

    //还原默认位置(南车株洲)，默认级别
    Map.TabLevel = Map.Level;
    RTU.register("map.setInitialPosition", function () {
        return function () {
            //株洲经纬度
            var mapDefault = userData["MapLevel"];
            if (mapDefault) {
                var mapDefaultData = mapDefault.split(",");
                var lng = mapDefaultData[1];
                var lat = mapDefaultData[2];
                var level = mapDefaultData[0];
            } else {
                var lng = "113.133965374";
                var lat = "27.827545406";
                var level = Map.TabLevel;
            }
            Map.setCenter(lng, lat);
            Map.setLevel(parseInt(level));
        };
    });
    //全国中心
    RTU.register("map.setInitialChina", function () {
        return function () {
            var lng = "108.2316211624";
            var lat = "33.61856103124";
            Map.setCenter(lng, lat);
            Map.setLevel(2);
        };
    });
    //当前地图显示级别
    RTU.register("map.getNowMapLevel", function () {
        return function () {
            return Map.Level
        };
    });
    //返回地图中心点经纬度
    RTU.register("map.getCenter", function () {
        return function () {
            return Map.getCenter();
        };
    });
    
    //添加地图准星
    RTU.register("map.addCenterCross",function(){
    	return function(){
    		if(ToolManager){
    			if(ToolManager.CrossImg){
        			ToolManager.CrossImg.remove();
        		}
    			ToolManager.addCross("../static/img/map/cross.gif",32.5, 22.5);
    			$(ToolManager.CrossImg).css("z-index",15);
    		}
    	};
    });
    //移除地图准星
    RTU.register("map.removeCenterCross",function(){
    	return function(){
    		if(ToolManager.CrossImg){
    			ToolManager.CrossImg.remove();
    		}
    	};
    });
    
    //默认地图级别 以及默认经纬度
    RTU.register("map.getDefaultMapLevel", function () {
        return function () {
            return { Level: 10, lng: "113.133965374", lat: "27.827545406" };
        };
    });
    //保存经纬度以及 级别 地图立刻显示
    RTU.register("map.savePositionLevel", function () {
        return function (data) {
            if (data) {
                userData["MapLevel"] = data.Level + "," + data.lng + "," + data.lat;
                Map.setCenter(data.lng, data.lat);
                Map.setLevel(data.Level);
                Map.refresh();
            }
        };
    });
    //添加一个电子围栏
    RTU.register("map.marker.eleRPolygon", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            var rpgon = new RPolygon(data.arr, data.lineW, data.lineC, data.lineO, data.fillColor, data.fillOpacity);
            Map.addGraphics(rpgon);
            return rpgon;
        };
    });
    //删除单个多边形
    RTU.register("map.marker.removeRPolygon", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            if (data)
                Map.removeGraphics(data);
        };
    });
    //画多边形
    RTU.register("map.marker.electronicRPolygon", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            Map.rpgon = new RPolygon(data.arr, data.lineW, data.lineC, data.lineO, data.fillColor, data.fillOpacity);
            Map.addGraphics(Map.rpgon);
            return Map.rpgon;
        };
    });
    
    RTU.register("map.GetgraphicsDiv", function () {
        return function () {
            var obj =Map.GetgraphicsDiv();
            return obj;
        };
    });
    //获取画线的面的数组 
    RTU.register("map.GetGraphicsArr", function () {
        return function () {
            var obj =Map.GetGraphicsArr();
            return obj;
        };
    });
    //移除电子围栏
    RTU.register("map.marker.electronicRlineClose", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            if (Map.rline)
                Map.removeGraphics(Map.rline);
            if (data && data.rline) {
                Map.removeGraphics(data.rline);
            }

        };
    });
    var curveTimer = null;
    //运行轨迹更新点的方法
    RTU.register("map.point.updateCurvePoint", function () {
        return function (obj) {
            var p = $.extend({
                point: null,
                lat: 0,
                lng: 0,
                step: 50,
                timeInterval: 1000,
                tab: {}
            }, obj || {});
            p.point.update(p.lng, p.lat, p.tab, p.point.IconUrl, p.point.DetaX, p.point.DetaY, p.point.IconWidth, p.point.IconHeight);
            return p.point;
        };
    });
    //点的历史轨迹添加
    RTU.register("map.curveMarker", function () {
        return function (data) {
            var html = "";
            if (data && data.html) {
                html = data.html;
            }
            var tab = {
                html: html,
                detaX: 0,
                detaY: 0
            };
            var Point = new RTabMarker(data.lng, data.lat, tab, data.iurl, -22, -22, 44, 44);
            Point.Name = "点的位置";
            Map.addMarker(Point);
            return Point;
        };
    });
    var UpdateBorder = function () {
        this.stjinweidu = Map.toCoordinates(0, 0);
        this.endjinweid = Map.toCoordinates($(window).width(), $(window).height());
        this.upJwd = function (argument) {
            this.stjinweidu = Map.toCoordinates(0, 0);
            this.endjinweid = Map.toCoordinates($(window).width(), $(window).height());
        };
    };
    var border = new UpdateBorder();
    function checkIsOutMap(lng, lat) {
        var s = border.stjinweidu;
        var e = border.endjinweid;
        if (lat > s.Cy || lat < e.Cy || lng < s.Cx || lng > e.Cx) {
            Map.setCenter(lng, lat);
            border.upJwd();
        };
    };

    //更新某个点
    RTU.register("map.point.updatePoint", function () {
        return function (obj) {
            var p = $.extend({
                point: null,
                lat: 0,
                lng: 0
            }, obj || {});
            var point = p.point;
            var obj = point.obj;
                        
            if (point) {
            	
            	 if (Map.Level > window.publicData["carLevelShow"]) {

                 	if(getImgUrl(point.obj.pointData.pointTypeUrl)=="huocheOnline"){
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
 		        		 $(point.Icon).attr("src",imgUrl);
 		        		 point.IconUrl= imgUrl;
                 	}else{
                 		 $(point.Icon).attr("src", getImgUrl(point.obj.pointData.pointTypeUrl));
                 		 point.IconUrl= getImgUrl(point.obj.pointData.pointTypeUrl);
                 	}
                    
                     var isOnline = obj.pointData.isOnline;
                     if (isOnline && (isOnline == "3"||isOnline == "4")) {
                     	 $(".TIPSDiv",$(point.Icon).parent()).css("background-color","rgb(126, 127, 128)");
                     }  else if (isOnline && (isOnline == "1"||isOnline == "2")) {
                    	 //rgb(51, 166, 59)
                     	 $(".TIPSDiv",$(point.Icon).parent()).css("background-color","#00ccff");
                     } 
                 } else {
                     // 1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
                     var imgUrl = "";
                     var isOnline = obj.pointData.isOnline;
                     var isAlarm = obj.pointData.isAlarm;
                     if (isOnline && (isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm == "1")) {
                         var info = window.publicData["IconlessLocoAlertOffline"].split("-");
                         if (info[0]) {
                             imgUrl = info[0];
                         } else {
                             imgUrl = "../static/img/map/lessen_g.png";
                         }
                         $(".TIPSDiv",$(point.Icon).parent()).css("background-color","rgb(126, 127, 128)");
                     }
                     else if (isOnline &&(isOnline == "3"||isOnline == "4")&&isAlarm&&(isAlarm != "1")) {
                         var info = window.publicData["IconlessLocoOffline"].split("-");
                         if (info[0]) {
                             imgUrl = info[0];
                         } else {
                             imgUrl = "../static/img/map/lessen_g.png";
                         }
                         $(".TIPSDiv",$(point.Icon).parent()).css("background-color","rgb(126, 127, 128)");
                     }
                     else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm == "1")) {
                         var info = window.publicData["IconlessLocoAlertOnline"].split("-");
                         if (info[0]) {
                             imgUrl = info[0];
                         } else {
                             imgUrl = "../static/img/map/lessen_y.png";
                         }
                         //rgb(51, 166, 59)
                         $(".TIPSDiv",$(point.Icon).parent()).css("background-color","#00ccff");
                     }
                     else if (isOnline && (isOnline == "1"||isOnline == "2")&&isAlarm&&(isAlarm != "1")) {
                         var info = window.publicData["IconlessLocoOnline"].split("-");
                         if (info[0]) {
                             imgUrl = info[0];
                         } else {
                             imgUrl = "../static/img/map/lessen_y.png";
                         }
                         //rgb(51, 166, 59)
                         $(".TIPSDiv",$(point.Icon).parent()).css("background-color","#00ccff");
                     }
                     $(point.Icon).attr("src", imgUrl);
                     point.IconUrl= imgUrl;
                 }
            	
            	
            	
            	
            	
            	
                point.hideLabel();
                point.update(p.lng, p.lat, point.TagObject, point.IconUrl, point.DetaX, point.DetaY, point.IconWidth, point.IconHeight);
//                if ($("#" + obj.tabId).css("display") == "block") {
//                    obj.initFn({ longitude: obj.pointData.longitude, latitude: obj.pointData.latitude, tabId: obj.tabId, itemData: obj.itemData, Point: point });
//                }
//                if (obj.loadData) {
//                    obj.loadData({ longitude: p.lng, latitude: p.lat, tabId: obj.tabId, itemData: obj.itemData, Point: point });
//                }
                if ($(point.Icon).hasClass('selectPointCss')) {
                    checkIsOutMap(p.lng, p.lat);
                }
                //更新tips的内容
//                RTU.invoke("point.TipsSetting", point);
//                point.DetaX == -22&&
               
                return point;
            }
        };
    });
    //更新所有点
    RTU.register("map.point.updateAllPoint", function () {
        return function (newDatas) {
            for (var i = 0; i < Map.MarkerArr.length; i++) {
                RTU.invoke("map.point.updatePoint", { point: Map.MarkerArr[i], lat: newDatas[i].lat, lng: newDatas[i].lng });
            }
        };
    });
    //同上
    function onLevelChanged() {
        if (currentPoint)
            mcFn(currentPoint.obj, currentPoint, true);
    };
    //层级变化触发的函数
    RTU.register("map.marker.onLevelChanged", function () {
        return function (data) {
            Map.addEventListener(RMapEvent.LevelChanged, onLevelChanged);
            return this;
        };
    });
    RTU.invoke("map.marker.onLevelChanged");
    //添加点并且设置为地图的中心点		 
    RTU.register("map.marker.addMarkerCenter", function () {
        return function (data) {
            RTU.invoke("map.marker.addMarker", data);
            Map.setCenter(data.pointData.longitude, data.pointData.latitude);
            return this;
        };
    });
    //移除所有点
    RTU.register("map.marker.removeAllMarker", function () {
        return function (pointArr) {
        	if(pointArr){
        		//清除电子围 栏的画的所有点
        		for(var i=0;i<pointArr.length;i++){
    				Map.removeMarker(pointArr[i]);
    				//RTU.invoke("map.marker.removeMarker",pointArr[i]);
        		}
        	}else{
        		Map.hideAllMarker();
        		for (var i = 0; i < Map.MarkerArr.length; i++) {
        			Map.removeMarker(Map.MarkerArr[i]);
        		}
        		Map.MarkerArr = [];
        		pSKeeping = {};
        		Map.refresh();
        	}
        };
    });
    //返回地图点的个数
    RTU.register("map.marker.removeAllMarkerL", function () {
        return function () {
            return Map.MarkerArr.length;
        };
    });
    //改变地图层级
    RTU.register("map.changeLevel", function () {
        return function (data) {
            if (data) {
                Map.setLevel(parseInt(data));
            }
        };
    });
    //设置显示地图的当前级别
    RTU.register("map.showleftLevel", function () {
        return function (data) {
            $(".map-showLevel").remove();
            if (data) {
                $("body").append("<div  style='z-index:1;width:17px;text-align:center; position:absolute;right:47px;top:118px;font-size: 14px;font-family: 微软雅黑  宋体  arial sans-serif; font-size: 10px;font-weight:bold' class='map-showLevel'> " + data + "</div>");
            }
            else {
                $("body").append("<div style='z-index:1;width:17px;text-align:center;position:absolute;right:47px;top:118px;font-family: 微软雅黑  宋体 arial sans-serif; font-size: 10px;font-weight:bold' class='map-showLevel'> " + Map.Level + "</div>");
            }
        };
    });
    RTU.invoke("map.showleftLevel");
    //添加街市
    RTU.register("map.showLevelOnMould", function () {
        return function () {
            $("body").append("<div class='showLevelOnMould' style='z-index:11;'><div class='map-duan'><img src='../static/img/map/duan.png' alt='' /></div><div class='map-ju'><img src='../static/img/map/ju.png' alt='' /></div><div  class='map-guo'><img src='../static/img/map/guo.png' alt='' /></div></div>");
            $(".showLevelOnMould").mouseover(function () {
                $("div", $(this)).show();
            }).mouseout(function () {
                $("div", $(this)).hide();
            });
            $(".map-duan").click(function () {
                RTU.invoke("map.changeLevel", 12);
            });
            $(".map-ju").click(function () {
                RTU.invoke("map.changeLevel", 6);
            });
            $(".map-guo").click(function () {
                RTU.invoke("map.changeLevel", 1);
            });
        };
    });
    RTU.invoke("map.showLevelOnMould");
    //添加多个点
    RTU.register("map.marker.addMarkers", function () {
        return function (data) {
            var obj = $.extend(clone(pointParm), data || {});
            if (obj.pointDatas && obj.pointDatas.length) {
                for (var i = 0; i < obj.pointDatas.length; i++) {
                    var objtemp = $.extend({}, obj);
                    objtemp.pointData = obj.pointDatas[i];
                    RTU.invoke("map.marker.addMarker", objtemp);
                    if (i == obj.pointDatas.length - 1 && obj.isSetCenter) {
                        var tempPoint = obj.pointDatas[obj.pointDatas.length - 1];
                        if (tempPoint.longitude && tempPoint.latitude)
                            Map.setCenter(tempPoint.longitude, tempPoint.latitude);
                    }
                }
            }
        };
    });
    //添加多个自定义tab点
    RTU.register("map.marker.addTabMarkers", function () {
        return function (data) {
            var obj = $.extend({}, data || {});
            RTU.invoke("map.marker.addMarker", obj);
        };
    });
    //移除car所有点
    RTU.register("map.marker.removeCarMarker", function () {
        return function () {
            for (var i in pSKeeping) {
                Map.removeMarker(pSKeeping[i]);
            }
            pSKeeping = {};
            Map.refresh();
        };
    });
    //隐藏car点
    RTU.register("map.marker.hideCarMarker", function () {
        return function () {
            for (var i in pSKeeping) {
                if (pSKeeping[i])
                    Map.hideMarker(pSKeeping[i]);
            }
        };
    });
    //显示car点
    RTU.register("map.marker.showCarMarker", function () {
        return function () {
            for (var i in pSKeeping) {
                Map.showMarker(pSKeeping[i]);
            }
        };
    });

    //显示car点
    RTU.register("map.marker.showSomeCarMarker", function () {
        return function (id) {
            Map.showMarker(pSKeeping[id]);
        };
    });

    //显示隐藏某种类型的点
    //  RTU.invoke("map.showPointPointType",{show:true,pointType:"teleseme"})
    RTU.register("map.showPointPointType", function () {
        return function (data) {
            setTimeout(function () {
                if (Map[data.pointType]) {
                    for (var i = 0; i < Map[data.pointType].length; i++) {
                        if (data.show) {
                            Map.showMarker(Map[data.pointType][i]);
                        }
                        else {
                            Map.hideMarker(Map[data.pointType][i]);
                        }
                    }
                }
                else {
                    Map[data.pointType] = [];
                    for (var i = 0; i < Map.MarkerArr.length; i++) {
                        if (Map.MarkerArr[i].pointType == data.pointType) {
                            Map[data.pointType].push(Map.MarkerArr[i]);
                            if (data.show) {
                                Map.showMarker(Map.MarkerArr[i]);
                            }
                            else {
                                Map.hideMarker(Map.MarkerArr[i]);
                            }
                        }
                    }
                }
            }, 1);

        };
    });
    
    //修改某种类型的点图标
    //  RTU.invoke("map.showPointPointTypeImg",{show:true,pointType:"teleseme"})
    RTU.register("map.showPointPointTypeImg", function () {
        return function (data) {
            setTimeout(function () {
            	 var info = window.publicData[data.imgName].split("-");
           	  	 if (info[0]) {
                     imgUrl = info[0];
                 } else {
                     imgUrl = "../static/img/map/"+data.pointType+".png";
                 } 
           	  	 
           	  	 
                 
                if (Map[data.pointType]) {
                    for (var i = 0; i < Map[data.pointType].length; i++) {
                    	$(Map[data.pointType][i].Icon).attr("src", imgUrl);
                    }
                }
                else {
                    Map[data.pointType] = [];
                    for (var i = 0; i < Map.MarkerArr.length; i++) {
                        if (Map.MarkerArr[i].pointType == data.pointType) {
                        	$(Map.MarkerArr[i].Icon).attr("src", imgUrl);
                            Map[data.pointType].push(Map.MarkerArr[i]);
                        }
                    }
                }
            }, 1);

        };
    });

    //刷新车站点击
    RTU.register("map.refreshStationClick", function () {
        return function () {
            if (Map.Level >= window.publicData["MaxStation"] || Map.Level >= window.publicData["MinStation"]) {
            	for(var i=0;i< window.stationPoints.length;i++){
            		 RTU.invoke("map.marker.removeMarker",window.stationPoints[i]);
            	}
                RTU.invoke("map.addInitMarkShowCount.searchStation");
            }
        };
    });
    
    RTU.register("app.firstLoad.showWfloodPointLevel",function(){
    	return function(){
        	if(window.publicData["WfloodPointLevel"] > Map.Level){
        		RTU.invoke("map.showPointPointType",{show:false,pointType:"FloodPreventionAndFloodControl"});
        	}else{
        		RTU.invoke("map.showPointPointType",{show:true,pointType:"FloodPreventionAndFloodControl"});
        	}
    	};
    	
    });
	RTU.register("app.firstLoad.showRlimitPointLevel",function(){
		return function(){
			if(window.publicData["RlimitPointLevel"] > Map.Level){
	    		RTU.invoke("map.showPointPointType",{show:false,pointType:"temporarySpeedLimitPoint"});
	    	}else{
	    		RTU.invoke("map.showPointPointType",{show:true,pointType:"temporarySpeedLimitPoint"});
	    	}
		};
	});
	RTU.register("app.firstLoad.showEelectronraildepotPointLevel",function(){
		return function(){
			if(window.publicData["EelectronraildepotPointLevel"] > Map.Level){
	    		RTU.invoke("map.showPointPointType",{show:false,pointType:"transshipmentPoint"});
	    	}else{
	    		RTU.invoke("map.showPointPointType",{show:true,pointType:"transshipmentPoint"});
	    	}
		};
		
	});
	RTU.register("app.firstLoad.showFxPointLevel",function(){
		return function(){
			if(window.publicData["FxPointLevel"] > Map.Level){
	    		RTU.invoke("map.showPointPointType",{show:false,pointType:"otherPoint"});
	    	}else{
	    		RTU.invoke("map.showPointPointType",{show:true,pointType:"otherPoint"});
	    	}
		};
		
	});
	
	 RTU.register("app.firstLoad.showWfloodPointImg",function(){
		 return function(){
			 RTU.invoke("map.showPointPointTypeImg",{pointType:"FloodPreventionAndFloodControl",imgName:"IconFloodPreventionAndFloodControl"});
		 };
	 });
	 RTU.register("app.firstLoad.showRlimitPointImg",function(){
		 return function(){
			 RTU.invoke("map.showPointPointTypeImg",{pointType:"temporarySpeedLimitPoint",imgName:"IcontemporarySpeedLimitPoint"});
		 };
	 });
	 RTU.register("app.firstLoad.showEelectronraildepotPointImg",function(){
		 return function(){
			 RTU.invoke("map.showPointPointTypeImg",{pointType:"transshipmentPoint",imgName:"IcontransshipmentPoint"});
		 };
	 });
	 RTU.register("app.firstLoad.showFxPointImg",function(){
		 return function(){
			 RTU.invoke("map.showPointPointTypeImg",{pointType:"otherPoint",imgName:"IconotherPoint"});
		 };
	 });

    //鹰眼开
    RTU.register("map.addEagleOpen", function () {
        return function (data) {
            if (ToolManager.EagleMap) {
                ToolManager.EagleMap.close();
            }
            ToolManager.addEagleMap(data.width, data.height, true);
        };
    });
    //鹰眼关闭
    RTU.register("map.addEagleClose", function () {
        return function (data) {
            if (ToolManager.EagleMap) {
                ToolManager.EagleMap.close();
            }
        };
    });
    //鹰眼状态
    RTU.register("map.EagleStatus", function () {
        return function () {
            if (!ToolManager.EagleMap) {
                return false;
            } else {
                return ToolManager.EagleMap.openImg.style.display == "block" ? false : true;
            }
        };
    });
    //测距开
    Map.toolDistance = null;
    Map.isRangingOpen = false;
    RTU.register("map.rangingOpen", function () {
        return function (data) {
            if (Map.toolDistance) {
                Map.toolDistance.close();
                Map.toolDistance.clear();
                Map.toolDistance = null;
            }
            Map.toolDistance = new RDistanceTool(Map, 3, '#00FF00', 0.7);
            ToolManager.addTool(Map.toolDistance);
            Map.toolDistance.open();
            Map.isRangingOpen = true;
        };
    });
    //测距关
    RTU.register("map.rangingClose", function () {
        return function (data) {
            if (Map.toolDistance) {
                Map.toolDistance.close();
                Map.toolDistance.clear();
                Map.toolDistance = null;
                Map.isRangingOpen = false;
            }
        };
    });
    //测距的开关状态
    RTU.register("map.rangingStuts", function () {
        return Map.isRangingOpen;
    });
    //显示tips类的tab
    Map.tIPSMarkerOpen = true;
    RTU.register("map.marker.tIPSMarkerOpen", function () {
        return function (data) {
            $(".TIPSDiv").show();
            $(".header-maptooler-dropdown-item-2").text("机车名-关");
            Map.tIPSMarkerOpen = true;
        };
    });
    //隐藏tips类的tab
    RTU.register("map.marker.tIPSMarkerClose", function () {
        return function (data) {
            $(".TIPSDiv").hide();
            $(".header-maptooler-dropdown-item-2").text("机车名-开");
            Map.tIPSMarkerOpen = false;
        };
    });
    //tips开关的状态
    RTU.register("map.marker.tIPSMarkerStuts", function () {
        return function (data) {
            return Map.tIPSMarkerOpen;
        };
    });

    //Tips显示与否
    RTU.register("map.TipsShow", function () {
        return function () {
            if (window.userData["carNameDefault"] == "show") {
                RTU.invoke("map.marker.tIPSMarkerOpen");
            } else {
                RTU.invoke("map.marker.tIPSMarkerClose");
            }
        };
    });
    RTU.invoke("map.TipsShow");

    //电子围栏
    //调用：  RTU.invoke("map.marker.electronicRail",{borderb:3,borderc:'#FF00FF',borderpocity:0.7,core:'#FFFF66',pocity:0.3},completeFn:function(arr){});
    RTU.register("map.marker.electronicRail", function () {
        return function (data) {
            window.tool_polygon = new RPolygonTool(Map, data.borderb, data.borderc, data.borderpocity, data.core, data.pocity);
            ToolManager.addTool(window.tool_polygon);
            window.tool_polygon.addEventListener(RToolEvent.CloseTool, function (e) {
                if (data.completeFn) {
                    data.completeFn(tool_polygon.CoordinatesArr);
                }
            });
            tool_polygon.open();
            return tool_polygon;
        };
    });
    //电子围栏关闭
    //调用例子： RTU.invoke("map.marker.electronicRailClose",{closeFn:function(){}});
    RTU.register("map.marker.electronicRailClose", function () {
        return function (data) {
            if (window.tool_polygon) {
                window.tool_polygon.close();
                window.tool_polygon.clear();
                window.tool_polygon = null;
                if (data&&data.closeFn)
                    data.closeFn();
            }
        };
    });
    //电子围状态
    RTU.register("map.marker.electronicRailStatus", function () {
        return function () {
            if (window.tool_polygon) {
                return true;
            }
            else {
                return false;
            }
        };
    });
    //电子围栏画图形
    RTU.register("map.marker.electronicRline", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            Map.rline = new RLine(data.arr, data.lineW, data.lineC, data.lineO);
            Map.addGraphics(Map.rline);

            return Map.rline;
        };
    });
    //电子围栏画图形
    RTU.register("map.marker.Rline", function () {
        //data.arr:边线数组  data.lineW:边宽 data.lineC:边颜色 data.lineO:线透明度
        return function (data) {
            Map.rline = new RLine(data.arr, data.lineW, data.lineC, data.lineO);
            Map.addGraphics(Map.rline);
            Map.refreshGraphics(Map.rline);

            return Map.rline;
        };
    });
    //能看到的地图上面的点  更新
    function isSeePoint(obj) {
        var min = Map.getBounds().MinCoordinates;
        var max = Map.getBounds().MaxCoordinates;
        var oldPoint = pSKeeping[obj.pointId];
        if ((min.Cx < oldPoint.Cx && oldPoint.Cx < max.Cx) && (min.Cy < oldPoint.Cy && oldPoint.Cy < max.Cy) && Map.Level > 16) {//插入更新
            var step = 500; //每步十次更新
            var time = 5000; //速度250毫秒
            var Cxd = (obj.lat - oldPoint.Cy) / step;
            var Cyd = (obj.lng - oldPoint.Cx) / step;
            var timer = setInterval(function () {
                oldPoint.Cx += Cyd;
                oldPoint.Cy += Cxd;
                oldPoint.refresh();
                pSKeeping[obj.pointId] = oldPoint;
                step--;
                if (step == 0) clearInterval(timer);
            }, time / step);
            return true;
        }
        else {
            return false;
        }
    };
    //更新点到正确位置
    RTU.register("map.point.uPToRightP", function () {
        function upRp(url) {
            for (var n in pSKeeping) {
                var tempUrl = url + "?lat=" + pSKeeping[n].obj.pointData.latitude + "&lng=" + pSKeeping[n].obj.pointData.longitude;
                $.ajax({
                    url: tempUrl,
                    type: "GET",
                    dataType: "jsonp",
                    success: function (data) {
                        RTU.invoke("map.point.updatePoint", { point: pSKeeping[n], lat: data[0].lat, lng: data[0].lng });
                    }
                });
            }
        }
        return function (data) {
            if (!data || !data.url) {
                var url = "../calculateDistanceController/calculateDistance";
                upRp(url);
            } else {
                upRp(data.url);
            }
        };
    });
    //返回选中的点的对象
    RTU.register("app.currentPoint", function () {
        return function () {
            if (currentPoint) {
                return currentPoint;
            } else {
                return {};
            }
        };
    });
    //初始化点tab的界面
    window.mcFn = function (obj, Point, isclick) {
    	//alert("aaa");
        if (!obj) { return };
        obj.closeImg ? "" : $(".closediv").hide();
        $("#" + Point.obj.tabId + " .closediv").unbind("click").click(function () {
            $("#" + Point.obj.tabId).hide();
            Point.isShowTab=false;
            obj.closeFn ? obj.closeFn() : "";
            if(window.locoInfoInterval){
              	clearInterval(window.locoInfoInterval);
              	window.locoInfoInterval=null;
             }
        });
    };
    //返回个人设置数据
    RTU.register("map.returnUserData", function () {
        return function () {
            return { userData: userData, mapLevel: Map.Level };
        };
    });
    /****设置默认级别和中心点****begin*****************************************************************************************************/
    //设置地图默认级别（个人设置）
    RTU.register("map.setDefaultP", function () {
        return function () {
            if (userData["RecordingLastClick"] != "0" && userData["RecordingLastClick"] != "1") {
                var vs = userData["RecordingLastClick"].split(',');
                RTU.invoke("map.savePositionLevel", { Level: vs[0], lng: vs[1], lat: vs[2] });
            } else if (userData["RecordingLastClick"] == "1" || userData["RecordingLastClick"] == "0") {
                var vs = userData["MapLevel"].split(',');
                RTU.invoke("map.savePositionLevel", { Level: vs[0], lng: vs[1], lat: vs[2] });
            }
        };
    });
    RTU.invoke("map.setDefaultP");
    //预加载图片
    RTU.register("app.map.loadImg", function () {
        var ims = ["../static/img/map/pointIcon/railwaysLess.png",
		            "../static/img/map/pointIcon/lessen_station.png",
		            "../static/img/map/pointIcon/lessen_y.png",
		            "../static/img/map/pointIcon/lessen_g.png",
		            "../static/img/map/pointIcon/dongcheOnline.png", // 动车在线
					"../static/img/map/pointIcon/dongcheOffline.png", // 动车离线
					"../static/img/map/pointIcon/dongcheAlertOffline.gif", // 动车警报离线
					"../static/img/map/pointIcon/dongcheAlertOnline.gif", // 动车警报在线
					"../static/img/map/pointIcon/kecheOnline.png", // 客车在线
					"../static/img/map/pointIcon/kecheOffline.png", // 客车下线
					"../static/img/map/pointIcon/kecheAlertOnline.gif", // 客车警报在线
					"../static/img/map/pointIcon/kecheAlertOffline.gif", // 客车警报下线
					"../static/img/map/pointIcon/huocheOffline.png", // 货车离线
					"../static/img/map/pointIcon/huocheOnline.png", // 货车在线
					"../static/img/map/pointIcon/huocheAlertOffline.gif", // 货车警报离线
					"../static/img/map/pointIcon/huocheAlertOnline.gif", // 货车在警报线
					"../static/img/map/pointIcon/highRailOffline.png", // 高铁离线
					"../static/img/map/pointIcon/highRailOnline.png", // 高铁在线
					"../static/img/map/pointIcon/highRailAlertOffline.gif", // 高铁警报离线
					"../static/img/map/pointIcon/highRailAlertOnline.gif", // 高铁在警报线
					"../static/img/map/pointIcon/alarm1.png", // 一级警报
					"../static/img/map/pointIcon/alarm2.png", // 二级警报
					"../static/img/map/pointIcon/alarm3.png", // 三级警报
					"../static/img/map/pointIcon/alarm4.png", // 四级警报
					"../static/img/map/pointIcon/locostaff.png", // 机车乘务员
					"../static/img/map/pointIcon/movePoint.png", // 移动端
					"../static/img/map/pointIcon/railways.png", // 铁路局
					"../static/img/map/pointIcon/teleseme2.png", // 信号机
					"../static/img/map/pointIcon/station.png", // 车站
					"../static/img/map/pointIcon/fxPoint.png", // 分相点
					"../static/img/map/pointIcon/bridge.png", // 桥梁
					"../static/img/map/pointIcon/tunnel.png", // 隧道
					"../static/img/map/pointIcon/demarPoint.png", // 分解口
					"../static/img/map/pointIcon/turnout.png", // 道岔
					"../static/img/map/pointIcon/PfloodPoint.png", // 防汛点
					"../static/img/map/pointIcon/WfloodPoint.png", // 防洪
					"../static/img/map/pointIcon/WfloodPoint1.png", // 防洪
					"../static/img/map/pointIcon/rlimitPoint.png", // 临时限速点
					"../static/img/map/pointIcon/rlimitPoint1.png", // 临时限速点
					"../static/img/map/pointIcon/crossing.png", // 道口
					"../static/img/map/pointIcon/LslidesPoint.png", // 塌方点
					"../static/img/map/pointIcon/locomotive.png", // 机务段
					"../static/img/app/app-realtimelocomotivequery-move/move_larger_13.png",
					"../static/img/app/app-realtimelocomotivequery-move/move_larger_03.png",
					"../static/img/app/loadingMap.gif",
					"../static/img/map/railways.png"
		];
        return function () {
            for (var i = 0; i < ims.length; i++) {
                var img = document.createElement("img");
                img.style.display = "none";
                img.src = ims[i];
                $("body").append(img);
            }
        };
    });
    RTU.invoke("app.map.loadImg");
    /********设置默认级别和中心点****end******************************************************************************************************/

    /******地图模式转换**begin*****************************************************/
    RTU.register("map.setMapShowMoudel", function () {
        return function (data) {
            if (data == "1" || data == "changeSet") {
                window.userData["SetMapShowModel"] = "1";
                initMap({ isFirstLoad: false, MapRoot: "/tile-railway/" });
            }
            else if (data == "2" ) {
                window.userData["SetMapShowModel"] = "2";
                initMap({ isFirstLoad: false, MapRoot: "/tile-moon/" });
            }else {
                window.userData["SetMapShowModel"] = "reload";
                initMap({ isFirstLoad: true });
            }
        };
    });
    
    RTU.register("map.temp.setMapShowMoudel", function () {
        return function (data) {
            if (data == "1") {
                initMap({ isFirstLoad: false, MapRoot: "/tile-railway/" });
            }
            else if (data == "2" ) {
                initMap({ isFirstLoad: false, MapRoot: "/tile-moon/" });
            }else {
                initMap({ isFirstLoad: false , MapRoot: "/tile/"});
            }
        };
    });
    /******地图模式转换**end*****************************************************/
    RTU.invoke("app.labelpointsenclosure.rightHandMap.init");//右键添加标注点
});
