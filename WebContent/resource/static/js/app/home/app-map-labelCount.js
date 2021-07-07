RTU.DEFINE(function (require, exports) {
/**
 * 模块名：地图中，车站，机务段，铁路局
 * name：
 * date:2015-3-2
 * version:1.0 
 */
	require("map/RMap6.js");
    require("map/RMap5.js");
    var trainName = { 1: "货车", 2: "客车", 3: "高铁", 4: "动车", 5: "其它" };
    /***车站、机务段、铁路局的左键统计**begin************************************************************************************************************/
    /*添加标注，统计四种类型车的数量*/
    {
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
                //火车站左键
                var stationDataLen = stationData.length;
                for (var i = 0; i < stationDataLen; i++) {
                    if (stationData[i].demo == "大站") {
                    	pointType="transparent";
                    	
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
                    } else {
                    	pointType="transparentLess";
                    	
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
//                var initRailwaysMark = [{ initLng: 119.65837943650001, initLat: 29.37056884350001, name: "上海铁路局" },
//                                { initLng: 115.76775443650001, initLat: 39.35103759350001, name: "北京铁路局" }, { initLng: 122.80681693650001, initLat: 43.15963134350001, name: "沈阳铁路局" },
//                                { initLng: 102.93962943650001, initLat: 29.80025634350001, name: "成都铁路局" }, { initLng: 86.75994193650001, initLat: 42.69869384350001, name: "乌鲁木齐铁路局" },
//                                { initLng: 113.65837943650001, initLat: 24.23775634350001, name: "广铁集团" }, { initLng: 113.64275443650001, initLat: 33.97213134350001, name: "郑州铁路局" },
//                                { initLng: 126.68962943650001, initLat: 47.30025634350001, name: "哈尔滨铁路局" }, { initLng: 101.33025443650001, initLat: 25.79244384350001, name: "昆明铁路局" },
//                                { initLng: 111.58025443650001, initLat: 39.94088134350001, name: "呼和浩特铁路局" }, { initLng: 109.358346, initLat: 24.312009, name: "南宁铁路局" },
//                                { initLng: 116.89275443650001, initLat: 35.90963134350001, name: "济南铁路局" }, { initLng: 112.03337943650001, initLat: 31.58150634350001, name: "武汉铁路局" },
//                                { initLng: 102.92400443650001, initLat: 34.78463134350001, name: "兰州铁路局" }, { initLng: 100.29119193650001, initLat: 38.20650634350001, name: "青藏铁路公司" },
//                                { initLng: 115.839718, initLat: 28.664207, name: "南昌铁路局" }, { initLng: 112.33806693650001, initLat: 37.39791259350001, name: "太原铁路局" },
//                                { initLng: 108.85369193650001, initLat: 33.65181884350001, name: "西安铁路局"}];

                //机务段
//                var initLocomotiveMark = { initLng: 115.92120312499999, initLat: 28.648402343749993, name: "南昌机务段" };

                //添加铁路局标注
//                var railwaysLen = initRailwaysMark.length;
//                for (var i = 0; i < railwaysLen; i++) {
//                    RTU.invoke("map.marker.addMarker", {
//                        isSetCenter: true,
//                        TIPSID: "id",
//                        tabHeight: 600,
//                        pointType: "railways",
//                        iconWidth: 1, //点的 宽度
//                        iconHeight: 1, //点的高度
//                        tabHtml: $status.html(),
//                        pointData: { longitude: initRailwaysMark[i].initLng, latitude: initRailwaysMark[i].initLat, id: initRailwaysMark[i].name },
//                        setDataSeft: false,
//                        initFn: function (obj) {
//                            setDivCssInit(obj);
//                            obj.Point.setTabWH({ width: 420, height: 330 });
//                            RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
//                            obj.sendData = {
//                                "dName": "",
//                                "bName": obj.Point.obj.pointData.id,
//                                "sName": ""
//                            };
//                            //                           RTU.invoke("app.addInitMarkShowCount.search",obj);
//                            RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj);
//                            RTU.invoke("app.addInitMarkShowCount.initBut", obj);
//                            RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
//                        },
//                        closeFn: function () {
//                        },
//                        rightHand: function (obj) {
//                        }
//                    });
//                }
                RTU.invoke("map.railways");
                /////添加机务段标注
//                RTU.invoke("map.marker.addMarker", {
//                    isSetCenter: true,
//                    TIPSID: "id",
//                    tabHeight: 600,
//                    pointType: "locomotive",
//                    iconWidth: 1, //点的 宽度
//                    iconHeight: 1, //点的高度
//                    tabHtml: $status.html(),
//                    pointData: { longitude: initLocomotiveMark.initLng, latitude: initLocomotiveMark.initLat, id: initLocomotiveMark.name },
//                    setDataSeft: false,
//                    initFn: function (obj) {
//                        setDivCssInit(obj);
//                        obj.Point.setTabWH({ width: 420, height: 330 });
//                        RTU.invoke("map.setCenter", { lng: obj.longitude, lat: obj.latitude, top: 170 });
//                        obj.sendData = {
//                            "dName": obj.Point.obj.pointData.id,
//                            "bName": "",
//                            "sName": ""
//                        };
//                        //                           RTU.invoke("app.addInitMarkShowCount.search",obj);
//                        RTU.invoke("app.addInitMarkShowCount.searchTrainInfo", obj);
//                        RTU.invoke("app.addInitMarkShowCount.initBut", obj);
//                        RTU.invoke("app.addInitMarkShowCount.detailInfo", obj); ///详细信息
//                    },
//                    closeFn: function () {
//                    },
//                    rightHand: function (obj) {
//                    }
//                });
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

//                var telesemes = Map["teleseme"];
//                for (var i = 0; i < telesemes.length; i++) {
//                    mm.addIconMarker(telesemes[i].Cx, telesemes[i].Cy, pointTypeUrl.teleseme);
//                }

                var cars = pSKeeping;
                for (var i in cars) {
                    car = cars[i];
                    if (car == null) {
                        continue;
                    }
                    if (data.longitude.toString() == car.Cx.toString()) {
                        continue;
                    }
                    
                    var isOnline =car.obj.pointData.isOnline;
                    var imgUrl="../static/img/map/lessen_g.png";
                    if(car.obj.pointData.trainType==""){
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
                    	imgUrl =getImgUrl(car.obj.pointData[car.obj.pointType]?car.obj.pointData[car.obj.pointType]:car.obj.pointType);
                    }
                    
                    mm.addIconMarker(car.Cx, car.Cy, imgUrl, data.Point.obj.iconWidth / 2, data.Point.obj.iconHeight);
                    var loco = new RMap6.Marker.LabelMarker(car.Cx, car.Cy, car.obj.pointData.locoTypeStr, "#CCCCCC", 2);
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
                       // RTU.invoke("app.addStation", data.data);
                    },
                    error: function () {
                    }
                };
                RTU.invoke("core.router.get", param);
            };
        });
        //RTU.invoke("map.addInitMarkShowCount.searchStation");
        //查询机车信息
        RTU.register("app.addInitMarkShowCount.searchTrainInfo", function () {
            var $buildItem = function (data, index) {
                this.$item = $(".label-tfoot1");
                this.$item.find(".index").html(index);
                if (data.locoAb !="1"&&data.locoAb!="2") {
                    this.$item.find(".locoInfo").html(data.locoTypeName + "-" + data.locoNO);
                } else if (data.locoAb == "1") {
                    this.$item.find(".locoInfo").html(data.locoTypeName + "-" + data.locoNO + window.locoAb_A);
                } else {
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
});
