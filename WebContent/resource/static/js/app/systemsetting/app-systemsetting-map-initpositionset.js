RTU.DEFINE(function (require, exports) {
/**
 * 模块名：弹出地图设置窗口
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../map/RMap5.js");
    require("../../../css/app/app-map.css");
   // require("../../app/home/app-map.js");
   // require("../../app/home/app-map-track.js");
   // require("../../app/home/app-map-pointControls.js");
    //显示详细窗口
    var popuwnd = null;
    var defaultMap;
    var mapTool;
    var currentLevel;
    var arry;
    /************************************************
    * 弹出地图设置窗口
    ***********************************************/
    RTU.register("app.mapsetting.showWin", function () {
        return function () {
            RTU.invoke("app.mapinitpositionset.loadHtml", { url: "../app/modules/systemsetting/app-mapinitpositionset.html", fn: function (html) {
                if (popuwnd) {
                    popuwnd.close();
                    delete popuwnd;
                    popuwnd = null;
                }
                popuwnd = new PopuWnd({
                    title: "默认全局地图位置",
                    html: html,
                    width: 570,
                    height: 400,
                    left: 120,
                    top: 30,
                    shadow: true
                });
                popuwnd.myClose = popuwnd.close;

                popuwnd.init();

                return popuwnd;
            }, initEvent: function () {
                //按钮绑定事件
                RTU.invoke("app.mapsetting.btnClickInit");
                RTU.invoke("app.mapsetting.init");
            }
            });
        };
    });
    /************************************************
    * 加载地图方法
    ***********************************************/
    RTU.register("app.mapsetting.init", function () {
        var movingGetLevel = function () {
            $("#currentLevel").html(defaultMap.getLevel());
            $("#current-level").html(defaultMap.getLevel());
        };
        var mapShow = function (data) {
        	window.mapModel = "railway";
        	RMapConstant.MapRoot = "/tile-railway/";
            $("#currentLevel").html(data[0]);
            defaultMap = new RMap($("#map1")[0], data[1], data[2], 5, $("#map1").width(), $("#map1").height());
            defaultMap.addEventListener(RMapEvent.LevelChanged, movingGetLevel);
            defaultMap.show();
            defaultMap.setLevel(data[0]);
            mapTool = new RToolManager(defaultMap);
            mapTool.addCross("../static/img/app/cross.gif", 32.5, 22.5);
            mapTool.addEagleMap(150, 150, true);
            mapTool.addZoomDirectBar(10, 10);
        };
        var getPoi = function () {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + top.loginSysData.data.user.id + "&options=MapLevel&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        var data = data.data;
                        arry = data.optionvalue.split(",");
                        mapShow(arry);
                    }else{
                    	var data = RTU.invoke("map.getDefaultMapLevel1");
                    	mapShow([data.Level,data.lng,data.lat]);
                    }
                }
            });
        };
        return function () {
            getPoi();
        };
    });
    /************************************************
    * 绑定按钮事件
    ***********************************************/
    RTU.register("app.mapsetting.btnClickInit", function () {
        var commomAjaxFn = function (value) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + top.loginSysData.data.user.id + "&options=MapLevel&optionvalue=" + value + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };
        ///////////按钮事件
        var btnClickInit = function () {
            //alert("load btn event");
            ////恢复默认按钮
            this.callBackBtn = function () {
                $("#callback-btn").click(function () {
                    ////恢复默认设置
                    var data = RTU.invoke("map.getDefaultMapLevel1");
                    commomAjaxFn(data.Level + "," + data.lng + "," + data.lat);
                    $("#current-level").html(data.Level);
                    $("#MapLevel").html(data.Level);
                    //RTU.invoke("map.savePositionLevel", data);
                    if (popuwnd) {
                        popuwnd.close();
                        delete popuwnd;
                        popuwnd = null;
                    }

                });
            };
            ///保存按钮
            this.saveBtn = function () {
                $("#save-btn").click(function () {
                    $("#current-level").html(defaultMap.getLevel());
                    commomAjaxFn(defaultMap.getLevel() + "," + defaultMap.getCenter().Cx + "," + defaultMap.getCenter().Cy);
                    ///将当前中心点设为起始点
                   // RTU.invoke("map.savePositionLevel", { Level: defaultMap.getLevel(), lng: defaultMap.getCenter().Cx, lat: defaultMap.getCenter().Cy });
                    $("#defaultLevel-span").html(defaultMap.getLevel());
                    $("#MapLevel").html(defaultMap.getLevel());
                    if (popuwnd) {
                        popuwnd.close();
                        delete popuwnd;
                        popuwnd = null;
                    }
                });
            };
            this.init = function () {
                this.callBackBtn();
                this.saveBtn();
            };
            this.init();
        };
        ///////////文本加载
        var textInit = function () {
            //////当前级别
            this.currentLevelTextInit = function () {
                var level = RTU.invoke("map.getNowMapLevel");
                $("#current-level").html(level);
            };
            /////默认级别
            this.defaultLevelTextInit = function () {
                var data = RTU.invoke("map.getDefaultMapLevel1");
                $("#current-level").html(data.Level);
            };
            this.init = function () {
                this.defaultLevelTextInit();
                this.currentLevelTextInit();
            };
            this.init();
        };
        return function () {
            textInit();
            btnClickInit();
        };
    });
    /************************************************
    * 加载地图界面的Html
    ***********************************************/
    RTU.register("app.mapinitpositionset.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load1", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                        }
                    }
                });
            }
        };
    });
    
    RTU.register("core.router.load1", function () {
        return function (param) {
            if (!param.dataType)
                param.dataType = "html";
            $.ajax(param);
        };

    });
  //默认地图级别 以及默认经纬度
    RTU.register("map.getDefaultMapLevel1", function () {
        return function () {
            return { Level: 10, lng: "113.133965374", lat: "27.827545406" };
        };
    });
});