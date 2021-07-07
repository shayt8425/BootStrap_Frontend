RTU.DEFINE(function (require, exports) {
/**
 * 模块名：铁路专题数据设置--图标设置
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");

    var popuwnd_iconset = null;

    /************************************************
    * 弹出地图设置窗口
    ***********************************************/
    RTU.register("app.railwaydataset.iconset.showWin", function () {
        return function (id) {

            var strName = "";
            switch (id) {
                case "railways-icon":
                    strName = "铁路局图标";
                    break;
                case "locomotive-icon":
                    strName = "机务段图标";
                    break;
                case "less_station-icon":
                    strName = "小站图标";
                    break;
                case "middle_station-icon":
                    strName = "中站图标";
                    break;
                case "large_station-icon":
                    strName = "大站图标";
                    break;
                case "lessOnline-icon":
                    strName = "列车在线小图标";
                    break;
                case "lessUnonline-icon":
                    strName = "列车不在线小图标";
                    break;
                case "lessRailways-icon":
                    strName = "铁路局小图标";
                    break;
                case "lessLocomotive-icon":
                    strName = "机务段小图标";
                    break;
                case "lessStation-icon":
                    strName = "车站小图标";
                    break;
                case "station-icon":
                    strName = "车站";
                    break;
                case "teleseme-icon":
                    strName = "信号灯";
                    break;
                case "turnout-icon":
                    strName = "道岔";
                    break;
                case "WfloodPoint-icon":
                    strName = "防洪防汛";
                    break;
                case "rlimitPoint-icon":
                    strName = "临时限速";
                    break;
                case "eelectronraildepotPoint-icon":
                    strName = "换装点";
                    break;
                case "fxPoint-icon":
                    strName = "其他";
                    break;
                case "dongcheOnline":
                    strName = "动车在线";
                    break;
                case "dongcheOffline":
                    strName = "动车离线";
                    break;
                case "dongcheAlertOffline":
                    strName = "动车警报离线";
                    break;
                case "dongcheAlertOnline":
                    strName = "动车警报在线";
                    break;
                case "kecheOnline":
                    strName = "客车在线";
                    break;
                case "kecheOffline":
                    strName = "客车下线";
                    break;
                case "kecheAlertOnline":
                    strName = "客车警报在线";
                    break;
                case "kecheAlertOffline":
                    strName = "客车警报下线";
                    break;
                case "huocheOffline":
                    strName = "货车离线";
                    break;
                case "huocheOnline":
                    strName = "货车在线";
                    break;
                case "huocheAlertOffline":
                    strName = "货车警报离线";
                    break;
                case "huocheAlertOnline":
                    strName = "货车在警报线";
                    break;
                case "highRailOffline":
                    strName = "高铁离线";
                    break;
                case "highRailOnline":
                    strName = "高铁在线";
                    break;
                case "highRailAlertOffline":
                    strName = "高铁警报离线";
                    break;
                case "highRailAlertOnline":
                    strName = "高铁在警报线";
                    break;
                case "lessLocoOnline":
                    strName = "小图标在线正常";
                    break;
                case "lessLocoOffline":
                    strName = "小图标在线";
                    break;
                case "lessLocoAlertOffline":
                    strName = "小图标离线警报";
                    break;
                case "lessLocoAlertOnline":
                    strName = "小图标在线警报";
                    break;
                default:
                    break;
            }
            RTU.invoke("app.railwaydataset.iconset.loadHtml", { url: "../app/modules/railwaydissertationdata/app-railwaydataset-iconset.html", fn: function (html) {

                if (popuwnd_iconset) {
                    popuwnd_iconset.close();
                    delete popuwnd_iconset;
                    popuwnd_iconset = null;
                }
                popuwnd_iconset = new PopuWnd({
                    title: strName + "-自定义图标",
                    html: html,
                    width: 550,
                    height: 400,
                    left: 360,
                    top: 90,
                    shadow: true
                });
                popuwnd_iconset.myClose = popuwnd_iconset.close;
                popuwnd_iconset.init();

                return popuwnd_iconset;
            }, initEvent: function () {
                $.ajax({
                    url: "../common/listAllFile?folderPath=static\\img\\map\\pointIcon",
                    dataType: "json",
                    type: "GET",
                    success: function (data) {
                        RTU.invoke("app.railwaydataset.iconset.getdata", data);
                        RTU.invoke("app.railwaydataset.iconset.initItemClick", id);
                    }
                });
            }
            });
        };
    });
    RTU.register("app.railwaydataset.iconset.getdata", function () {
        var buildItem = function (data) {
            var $item = $("<div style='float:left;text-align:center;' class='select-item'></div>");
            var img = new Image();
            img.src = "../static/img/map/pointIcon/" + data;
            img.alt = "图标";

            img.onload = function () {
                img.width = this.width;
                img.height = this.height;
                $item.append(img);
            };
            return $item;
        };
        return function (data) {
            $(".iconset-container-div").empty();
            for (var i = 0, len = data.data.length; i < len; i++) {
                if (data.data[i].indexOf(".svn") != -1)
                    continue;
                $(".iconset-container-div").append(new buildItem(data.data[i]));
            }
            $(".iconset-container-div").append($("<div style='float:left;text-align:center;' class='select-item'>无图标</div>"));
        };
    });
    
    //选中图片触发事件
    RTU.register("app.railwaydataset.iconset.initItemClick", function () {
        var saveData = function (options, optionsValue) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=-1&options=" + options + "&optionvalue=" + optionsValue + "&type=1&r=" + new Date().getTime(),
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };
        var initClick = function (id) {
            this.itemClick = function (id) {
                $(".select-item").dblclick(function () {
                    var src = "";
                    var pointTypeName = "";
                    if ($("img", $(this)).attr("src") == undefined) {
                        $("#" + id).removeAttr("src").attr("alt", "无图标");
                    }
                    else {
                        $("#" + id).attr("src", $("img", $(this)).attr("src"));

                    }
                    src = $("img", $(this)).attr("src");
                    imginfo = $("img", $(this)).attr("width") + "-" + $("img", $(this)).attr("height");
                    $("#" + id).removeClass("hidden");
                    switch (id) {
                        case "railways-icon":
                            saveData("Iconrailways", src + "-" + imginfo);
                            pointTypeName = "Iconrailways";
                            window.tagShowLessenMark = false;
                            window.publicData["Iconrailways"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "locomotive-icon":
                            saveData("Iconlocomotive", src + "-" + imginfo);
                            pointTypeName = "Iconlocomotive";
                            window.tagShowLessenMark = false;
                            window.publicData["Iconlocomotive"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "less_station-icon":
                            saveData("IconLess_station", src);
                            window.pointTypeName = "IconLess_station";
                            window.publicData[pointTypeName] = src;
                            saveData("StationVersion", "1");
                            RTU.invoke("map.railwayStations");
                            RTU.invoke("map.refreshStationClick");
                            break;
                        case "middle_station-icon":
                            saveData("IconMiddle_station", src);
                            pointTypeName = "IconMiddle_station";
                            window.publicData[pointTypeName] = src;
                            saveData("StationVersion", "1");
                            RTU.invoke("map.railwayStations");
                            RTU.invoke("map.refreshStationClick");
                            break;
                        case "large_station-icon":
                            saveData("IconLarge_station", src);
                            pointTypeName = "IconLarge_station";
                            window.publicData[pointTypeName] = src;
                            saveData("StationVersion", "1");
                            RTU.invoke("map.railwayStations");
                            RTU.invoke("map.refreshStationClick");
                            break;
                        case "lessOnline-icon":
                            saveData("IconLessOnline", src + "-" + imginfo);
                            pointTypeName = "IconLessOnline";
                            window.tagShowLessenMark = true;
                            window.publicData["IconLessOnline"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessUnonline-icon":
                            saveData("IconLessUnonline", src + "-" + imginfo);
                            pointTypeName = "IconLessUnonline";
                            window.tagShowLessenMark = true;
                            window.publicData["IconLessUnonline"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessRailways-icon":
                            saveData("IconLessRailways", src + "-" + imginfo);
                            pointTypeName = "IconLessRailways";
                            window.railwaysShowLessenMark = true;
                            window.publicData["IconLessRailways"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessLocomotive-icon":
                            saveData("IconLessLocomotive", src + "-" + imginfo);
                            pointTypeName = "IconLessLocomotive";
                            window.publicData["IconLessLocomotive"] = src + "-" + imginfo;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessStation-icon":
                            saveData("IconLessStation", src);
                            pointTypeName = "IconLessStation";
                            window.tagShowLessenMark = true;
                            window.publicData["IconLessStation"] = src;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "station-icon":
                            saveData("Iconstation", src + "-" + imginfo);
                            window.publicData["Iconstation"] = src + "-" + imginfo;
                            pointTypeName = "Iconstation";
                            break;
                        case "teleseme-icon":
                            saveData("Iconteleseme", src);
                            pointTypeName = "Iconteleseme";
                            window.publicData[pointTypeName] = src;
                            saveData("SignVersion", "1");
                            RTU.invoke("app.firstLoad.showTeleseme");
                            break;
                        case "turnout-icon":
                            saveData("Iconturnout", src);
                            pointTypeName = "Iconturnout";
                            window.publicData[pointTypeName] = src;
                            saveData("PoiVersion", "1");
                            RTU.invoke("app.firstLoad.showDaocha");
                            break;
                        case "WfloodPoint-icon":
                        	  saveData("IconFloodPreventionAndFloodControl", src);
                              pointTypeName = "IconFloodPreventionAndFloodControl";
                              window.publicData[pointTypeName] = src;
                              RTU.invoke("app.firstLoad.showWfloodPointImg");
                            break;
                        case "rlimitPoint-icon":
                        	 saveData("IcontemporarySpeedLimitPoint", src);
                             pointTypeName = "IcontemporarySpeedLimitPoint";
                             window.publicData[pointTypeName] = src;
                             RTU.invoke("app.firstLoad.showRlimitPointImg");
                            break;
                        case "eelectronraildepotPoint-icon":
                        	 saveData("IcontransshipmentPoint", src);
                             pointTypeName = "IcontransshipmentPoint";
                             window.publicData[pointTypeName] = src;
                             RTU.invoke("app.firstLoad.showEelectronraildepotPointImg");
                            break;
                        case "fxPoint-icon":
                        	 saveData("IconotherPoint", src);
                             pointTypeName = "IconotherPoint";
                             window.publicData[pointTypeName] = src;
                             RTU.invoke("app.firstLoad.showFxPointImg");
                            break;
                        case "dongcheOnline":
                            saveData("IcondongcheOnline", src + "-" + imginfo);
                            pointTypeName = "IcondongcheOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "dongcheOffline":
                            saveData("IcondongcheOffline", src + "-" + imginfo);
                            pointTypeName = "IcondongcheOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "dongcheAlertOffline":
                            saveData("IcondongcheAlertOffline", src + "-" + imginfo);
                            pointTypeName = "IcondongcheAlertOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "dongcheAlertOnline":
                            saveData("IcondongcheAlertOnline", src + "-" + imginfo);
                            pointTypeName = "IcondongcheAlertOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "kecheOnline":
                            saveData("IconkecheOnline", src + "-" + imginfo);
                            pointTypeName = "IconkecheOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "kecheOffline":
                            saveData("IconkecheOffline", src + "-" + imginfo);
                            pointTypeName = "IconkecheOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "kecheAlertOnline":
                            saveData("IconkecheAlertOnline", src + "-" + imginfo);
                            pointTypeName = "IconkecheAlertOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "kecheAlertOffline":
                            saveData("IconkecheAlertOffline", src + "-" + imginfo);
                            pointTypeName = "IconkecheAlertOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "huocheOffline":
                            saveData("IconhuocheOffline", src + "-" + imginfo);
                            pointTypeName = "IconhuocheOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "huocheOnline":
                            saveData("IconhuocheOnline", src + "-" + imginfo);
                            pointTypeName = "IconhuocheOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "huocheAlertOffline":
                            saveData("IconhuocheAlertOffline", src + "-" + imginfo);
                            pointTypeName = "IconhuocheAlertOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "huocheAlertOnline":
                            saveData("IconhuocheAlertOnline", src + "-" + imginfo);
                            pointTypeName = "IconhuocheAlertOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "highRailOffline":
                            saveData("IconhighRailOffline", src + "-" + imginfo);
                            pointTypeName = "IconhighRailOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "highRailOnline":
                            saveData("IconhighRailOnline", src + "-" + imginfo);
                            pointTypeName = "IconhighRailOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "highRailAlertOffline":
                            saveData("IconhighRailAlertOffline", src + "-" + imginfo);
                            pointTypeName = "IconhighRailAlertOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "highRailAlertOnline":
                            saveData("IconhighRailAlertOnline", src + "-" + imginfo);
                            pointTypeName = "IconhighRailAlertOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = false;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessLocoOnline":
                            saveData("IconlessLocoOnline", src + "-" + imginfo);
                            pointTypeName = "IconlessLocoOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = true;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessLocoOffline":
                            saveData("IconlessLocoOffline", src + "-" + imginfo);
                            pointTypeName = "IconlessLocoOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = true;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessLocoAlertOffline":
                            saveData("IconlessLocoAlertOffline", src + "-" + imginfo);
                            pointTypeName = "IconlessLocoAlertOffline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = true;
                            RTU.invoke("map.showLessenMark");
                            break;
                        case "lessLocoAlertOnline":
                            saveData("IconlessLocoAlertOnline", src + "-" + imginfo);
                            pointTypeName = "IconlessLocoAlertOnline";
                            window.publicData[pointTypeName] = src + "-" + imginfo;
                            window.tagShowLessenMark = true;
                            RTU.invoke("map.showLessenMark");
                            break;
                        default:
                            break;
                    }
                    RTU.invoke("map.pointImgSetting", { pointName: pointTypeName, ImgUrl: src });

                    popuwnd_iconset.close();
                });
            };
            this.init = function (id) {
                this.itemClick(id);
            };
            this.init(id);
        };
        return function (id) {
            initClick(id);
        };
    });
    /************************************************
    * 加载地图界面的Html
    ***********************************************/
    RTU.register("app.railwaydataset.iconset.loadHtml", function () {
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
        };
    });
    RTU.register("app.railwaydissertationdata.query.deactivate", function () {
        return function () {
            if (popuwnd_iconset) {
                popuwnd_iconset.hidden();
            }
        };
    });
});