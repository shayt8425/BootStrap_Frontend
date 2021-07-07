RTU.DEFINE(function (require, exports) {
/**
 * 模块名：铁路专题数据
 * name：railwaydissertationdata
 * date:2015-2-12
 * version:1.0 
 */
//图标，下拉框，保存按钮分别在一个方法里面
    require("popuwnd/js/popuwnd.js");
    require("app/home/app-map.js");
    require("app/home/app-map-track.js");
    require("app/home/app-map-pointControls.js");
    require("app/railwaydissertationdata/zxx.color_exchange.js");
    require("app/railwaydissertationdata/app-railwaydataset-iconset.js");

    var $html;
    var popuwnd;
    var data;
    var userData = RTU.data.user;

    RTU.register("app.railwaydissertationdata.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/railwaydissertationdata/app-railwaydissertationdata-query-new.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    RTU.invoke("app.railwaydissertationdata.query.create", $html);
                }

                RTU.invoke("app.railwaydissertationdata.query.initData");
                RTU.invoke("app.railwaydissertationdata.query.initAllData");
                RTU.invoke("app.railwaydissertationdata.query.allSelectEvent");
                RTU.invoke("app.railwaydissertationdata.query.allSaveBut");
            }
        });
        return function () {
            return true;
        };
    });

    RTU.register("app.railwaydissertationdata.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: 800,
                    height: 530,
                    left: 135,
                    top: 60,
                    shadow: true
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
            } else {
                popuwnd.init();
                RTU.invoke("app.railwaydissertationdata.query.initData");
                RTU.invoke("app.railwaydissertationdata.query.initAllData");
            }
        };
    });


    //初始化数据（图标类）
    RTU.register("app.railwaydissertationdata.query.initData", function () {
        var getdata = function (id, optionKey) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=-1&options=" + optionKey + "&type=1",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        $("#" + id).removeClass("hidden");
                        if (data.data.optionvalue == "undefined") {
                            $("#" + id).removeAttr("src").attr("alt", "无图标");
                        } else {
                            $("#" + id).attr("src", data.data.optionvalue.split("-")[0]);
                        }
                    } else {
                        $("#" + id).addClass("hidden");
                    }
                }
            });
        };
        var initData = function () {
            this.btnClickInit = function () {
                $("#station-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "station-icon");
                });
                $("#teleseme-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "teleseme-icon");
                });
                $("#turnout-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "turnout-icon");
                });
                
                
                $("#WfloodPoint-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "WfloodPoint-icon");
                });
                $("#rlimitPoint-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "rlimitPoint-icon");
                });
                $("#eelectronraildepotPoint-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "eelectronraildepotPoint-icon");
                });
                $("#fxPoint-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "fxPoint-icon");
                });
                
                
                $("#lessOnline-icon-but").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "lessOnline-icon");
                });
                $("#lessUnonline-icon-but").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "lessUnonline-icon");
                });
                $("#lessRailways-icon-but").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "lessRailways-icon");
                });
                $("#lessStation-icon-but").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "lessStation-icon");
                });
                $("#lessLocomotive-icon-but").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "lessLocomotive-icon");
                });
                $("#less_stationIconbut").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "less_station-icon");
                });
                $("#middle_stationIconbut").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "middle_station-icon");
                });
                $("#large_stationIconbut").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "large_station-icon");
                });
                $("#locomotive-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "locomotive-icon");
                });
                $("#railways-icon-btn").click(function () {
                    RTU.invoke("app.railwaydataset.iconset.showWin", "railways-icon");
                });
                $("#keche-icon-select").change(function () {
                    var kecheIcon = $("#keche-incon-btn");
                    var kecheDiv = $(".keche-incon-div", $(this).parent());
                    if ($(this).val() == "") {
                        kecheIcon.removeClass("keche-incon-btn");
                        kecheDiv.addClass("hidden");
                    } else {
                        kecheIcon.addClass("keche-incon-btn");
                        kecheDiv.removeClass("hidden");
                        $(".keche-img").attr("id", $(this).val());
                        getdata($(this).val(), "Icon" + $(this).val());
                    }
                });

                $("#huoche-icon-select").change(function () {
                    var huocheIcon = $("#huoche-incon-btn");
                    var huocheDiv = $(".huoche-incon-div", $(this).parent());
                    if ($(this).val() == "") {
                        huocheIcon.removeClass("huoche-incon-btn");
                        huocheDiv.addClass("hidden");
                    } else {
                        huocheIcon.addClass("huoche-incon-btn");
                        huocheDiv.removeClass("hidden");
                        $(".huoche-img").attr("id", $(this).val());
                        getdata($(this).val(), "Icon" + $(this).val());
                    }
                });

                $("#dongche-icon-select").change(function () {
                    var dongcheIcon = $("#dongche-incon-btn");
                    var dongcheDiv = $(".dongche-incon-div", $(this).parent());
                    if ($(this).val() == "") {
                        dongcheIcon.removeClass("dongche-incon-btn");
                        dongcheDiv.addClass("hidden");
                    } else {
                        dongcheIcon.addClass("dongche-incon-btn");
                        dongcheDiv.removeClass("hidden");
                        $(".dongche-img").attr("id", $(this).val());
                        getdata($(this).val(), "Icon" + $(this).val());
                    }
                });

                $("#highRail-icon-select").change(function () {
                    var highRailIcon = $("#highRail-incon-btn");
                    var highRailDiv = $(".highRail-incon-div", $(this).parent());
                    if ($(this).val() == "") {
                        highRailIcon.removeClass("highRail-incon-btn");
                        highRailDiv.addClass("hidden");
                    } else {
                        highRailIcon.addClass("highRail-incon-btn");
                        highRailDiv.removeClass("hidden");
                        $(".highRail-img").attr("id", $(this).val());
                        getdata($(this).val(), "Icon" + $(this).val());
                    }
                });

                $("#lessLoco-icon-select").change(function () {
                    var lessLocoIcon = $("#lessLoco-incon-btn");
                    var lessLocoDiv = $(".lessLoco-incon-div", $(this).parent());
                    if ($(this).val() == "") {
                        lessLocoIcon.removeClass("lessLoco-incon-btn");
                        lessLocoDiv.addClass("hidden");
                    } else {
                        lessLocoIcon.addClass("lessLoco-incon-btn");
                        lessLocoDiv.removeClass("hidden");
                        $(".lessLoco-img").attr("id", $(this).val());
                        getdata($(this).val(), "Icon" + $(this).val());
                    }
                });

                $("#keche-incon-btn").click(function () {
                    if ($("#keche-icon-select").val() == "") {
                        //                		 	alert("请选择机车！");
                        RTU.invoke("header.alarmMsg.show", "请选择机车！");
                        return;
                    }
                    RTU.invoke("app.railwaydataset.iconset.showWin", $("#keche-icon-select").val());
                });

                $("#huoche-incon-btn").click(function () {
                    if ($("#huoche-icon-select").val() == "") {
                        //                		 	alert("请选择机车！");
                        RTU.invoke("header.alarmMsg.show", "请选择机车！");
                        return;
                    }
                    RTU.invoke("app.railwaydataset.iconset.showWin", $("#huoche-icon-select").val());
                });

                $("#dongche-incon-btn").click(function () {
                    if ($("#dongche-icon-select").val() == "") {
                        //                		 	alert("请选择机车！");
                        RTU.invoke("header.alarmMsg.show", "请选择机车！");
                        return;
                    }
                    RTU.invoke("app.railwaydataset.iconset.showWin", $("#dongche-icon-select").val());
                });

                $("#highRail-incon-btn").click(function () {
                    if ($("#highRail-icon-select").val() == "") {
                        //                		 	alert("请选择机车！");
                        RTU.invoke("header.alarmMsg.show", "请选择机车！");
                        return;
                    }
                    RTU.invoke("app.railwaydataset.iconset.showWin", $("#highRail-icon-select").val());
                });

                $("#lessLoco-incon-btn").click(function () {
                    if ($("#lessLoco-icon-select").val() == "") {
                        //                		 	alert("请选择机车！");
                        RTU.invoke("header.alarmMsg.show", "请选择机车！");
                        return;
                    }
                    RTU.invoke("app.railwaydataset.iconset.showWin", $("#lessLoco-icon-select").val());
                });
            };
            this.dataInit = function () {
                getdata("railways-icon", "Iconrailways");
                getdata("locomotive-icon", "Iconlocomotive");
                getdata("teleseme-icon", "Iconteleseme");
                getdata("turnout-icon", "Iconturnout");
                getdata("WfloodPoint-icon", "IconFloodPreventionAndFloodControl");
                getdata("rlimitPoint-icon", "IcontemporarySpeedLimitPoint");
                getdata("eelectronraildepotPoint-icon", "IcontransshipmentPoint");
                getdata("fxPoint-icon", "IconotherPoint");

                getdata("large_station-icon", "IconLarge_station");
                getdata("middle_station-icon", "IconMiddle_station");
                getdata("less_station-icon", "IconLess_station");
            };
            this.init = function () {
                this.btnClickInit();
                this.dataInit();
            };
            this.init();
        };
        return function () {
            initData();
        };
    });

    //主要设置页面中的颜色
    function getData(options, selector) {
        $.ajax({
            url: "../syssetting/findByProperty?userid=-1&options=" + options + "&type=1&r=" + new Date().getTime(),
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
                if (data.data != null) {
                    if (selector == "LineUpColor") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#lineUpColor").val(str.colorHex());
                        }
                    } else if (selector == "StationLineColor") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#stationLineColor").val(str.colorHex());
                        }
                    } else if (selector == "BaselineColor") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#baseLineColor").val(str.colorHex());
                        }
                    } else if (selector == "railwaysBackgroundColor") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#railwaysBackgroundColor").val(str.colorHex());
                        }
                    } else if (selector == "railwaysFontColor") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#railwaysFontColor").val(str.colorHex());
                        }
                    } else if (selector == "DistrictColor") {  //省份边界
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#districtColor").val(str.colorHex());
                        }
                    } else if (selector == "CountryColor") {  //全国铁路
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#countryColor").val(str.colorHex());
                        }
                    } else if (selector == "lessGuDaoWidth") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            $("#lessGuDaoWidth").val(data.optionvalue);
                        }
                    } else if (selector == "lessGuDaoColor") {  //全国铁路
                        var data = data.data;
                        if (data.optionvalue != "") {
                            var str = "rgb(" + data.optionvalue + ")";
                            $("#lessGuDaoColor").val(str.colorHex());
                        }
                    } else if (selector == "carLevelShow") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            $(".car_level_showSet").val(data.optionvalue);
                        }
                    }else if (selector == "TipsLevelShow") {
                        var data = data.data;
                        if (data.optionvalue != "") {
                            $(".tips_level_showSet").val(data.optionvalue);
                        }
                    }else if (selector == "guDaoNumColor") {
	                	var data = data.data;
	                	if (data.optionvalue != "") {
	                		  var str = "rgb(" + data.optionvalue + ")";
	                		$("#guDaoNumColor").val(str.colorHex());
	                	}
                    }
                }
            }
        });
    };

    //查询所有系统设置
    function staticGetData(options, selector) {
        $.ajax({
            url: "../syssetting/findByProperty?userid=-1&options=" + options + "&type=1&r=" + new Date().getTime(),
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
//            	debugger;
                if (data.data != null) {
                    var data = data.data;
                    $(selector).val(data.optionvalue);
                }
            }
        });
    }

    //保存系统设置
    function staticSaveData(options, value) {
        $.ajax({
            url: "../syssetting/updateObjByProperty?userid=-1&options=" + options + "&optionvalue=" + value + "&type=1&r=" + new Date().getTime(),
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
            }
        });
    }

    //得到个人设置
    function staticGetUserData(optionKey) {
        $.ajax({
            url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + optionKey + "&type=1",
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
                if (data.data != null) {
                    if (data.data.options == "SetNotMapShowModel") {
                        var dataArr = data.data.optionvalue.split(",");
                        $.each(dataArr, function (i, n) {
                            if (n == "1") {
                                clickFlag = "1";
                                $("#NotMapshowModel-railway").attr("checked", "checkec");
                            }
                            if (n == "0") {
                                clickFlag = "0";
                                $("#NotMapshowModel-base").attr("checked", "checkec");
                            }
                        });
                    }
                }
            }
        });
    }

    //保存个人设置
    function staticSaveUserData(options, value) {
        $.ajax({
            url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + value + "&type=1",
            dataType: "jsonp",
            type: "GET",
            success: function (data) {

            }
        });
    }

    /**
    * 进入页面初始化页面所有的数据（除去图标类）
    */
    RTU.register("app.railwaydissertationdata.query.initAllData", function () {
        return function () {
        	
        	staticGetData("TipsLevelShow", ".tips_level_showSet"); //tips等级
        	staticGetData("GudaoNumLevel", ".guDaoNum_showSet"); //tips等级
        	
        	getData("guDaoNumColor", "guDaoNumColor"); //股道编号颜色
            staticGetData("carLevelShow", ".car_level_showSet"); //简易等级

            staticGetData("GuDaoZXShangXing", ".guDaoSX_showSet"); ////股道上行
            staticGetData("GuDaoZXXiaXing", ".guDaoXX_showSet"); ////股道下行
            staticGetData("GuDaoZhanXian", ".guDaoZX_showSet"); ////股道站线
            getData("LineUpColor", "LineUpColor"); //正线上行
            getData("StationLineColor", "StationLineColor"); //站线
            getData("BaselineColor", "BaselineColor"); //其他
            staticGetData("LineWidth", "#lineWidth"); //线的宽度
            staticGetData("LineLength", "#lineLength"); //线的长度
            staticGetData("LineKou", "#lineKou"); //缺口的长度

            getData("AllWidth", "lessGuDaoWidth"); //简易股道设置
            getData("AllColor", "lessGuDaoColor"); //简易股道设置

            getData("DistrictColor", "DistrictColor"); //省份颜色
            staticGetData("DistrictLineWidth", "#districtLineWidth"); //线的宽度
            staticGetUserData("SetNotMapShowModel"); //省份显示

            staticGetData("MinStation", ".minStation_showSet"); ////小站
            staticGetData("MedStation", ".medStation_showSet"); ////中站
            staticGetData("MaxStation", ".maxStation_showSet"); ////大站

            staticGetData("startLocomotive", "#startShow_locomotive"); //机务段
            staticGetData("DaoCha", "#startShow_turnout"); //道岔
            staticGetData("Signal", "#startShow_teleseme"); //信号机
            
            staticGetData("WfloodPointLevel", "#startShow_WfloodPoint");
            staticGetData("RlimitPointLevel", "#startShow_rlimitPoint");
            staticGetData("EelectronraildepotPointLevel", "#startShow_eelectronraildepotPoint");
            staticGetData("FxPointLevel", "#startShow_fxPoint");

        };
    });

    /**
    * 所有设置等级的下拉列表
    */
    RTU.register("app.railwaydissertationdata.query.allSelectEvent", function () {
        return function () {
        	//tip设置级别
        	 $("#tips-level-select").change(function () {
                 var value = $(".tips_level_showSet").val();
                 staticSaveData("TipsLevelShow", value);
                 window.publicData["TipsLevelShow"] = value;
                 RTU.invoke("map.showTipsLevel", window.publicData["TipsLevelShow"]);
             });
        	
            //简易等级
            $("#car_level_showSet").change(function () {
                var value = $(".car_level_showSet").val();
                staticSaveData("carLevelShow", value);
                window.publicData["carLevelShow"] = value;
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
                window.tagShowLessenMark="set";
                RTU.invoke("map.showLessenMark");
            });

            //正线上行
            $("#mainLineUp-select").change(function () {
                staticSaveData("GuDaoZXShangXing", $("#mainLineUp-select").val());
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //正线下行
            $("#mainLine-select").change(function () {
                staticSaveData("GuDaoZXXiaXing", $("#mainLine-select").val());
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //站线
            $("#stationLine-select").change(function () {
                staticSaveData("GuDaoZhanXian", $("#stationLine-select").val());
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });

            //小站
            $("#minStation").change(function () {
                var value = $("#minStation").val();
                staticSaveData("MinStation", value);
                staticSaveData("StationVersion", "1");
                RTU.invoke("map.railwayStations");
                window.publicData["MinStation"] = value;
                RTU.invoke("map.StationLess");
            });
            //中站
            $("#medStation").change(function () {
                staticSaveData("MedStation", $("#medStation").val());
                staticSaveData("StationVersion", "1");
                RTU.invoke("map.railwayStations");
            });
            //大站
            $("#maxStation").change(function () {
                var value = $("#maxStation").val();
                staticSaveData("MaxStation", value);
                staticSaveData("StationVersion", "1");
                RTU.invoke("map.railwayStations");
                window.publicData["MaxStation"] = value;
                RTU.invoke("map.Station");
            });
            //机务段
            $("#startShow_locomotive").change(function () {
                var startLocomotive = $(".startShow_locomotive").val();
                staticSaveData("startLocomotive", startLocomotive);
                window.publicData["startLocomotive"] = startLocomotive;
                RTU.invoke("map.locomotive", startLocomotive);
            });
            //信号机
            $("#startShow_teleseme").change(function () {
                var startTeleseme = $(".startShow_teleseme").val();
                staticSaveData("Signal", startTeleseme);
                staticSaveData("SignVersion", "1");
                window.publicData["Signal"] = startTeleseme;
                RTU.invoke("app.firstLoad.showTeleseme");
            });
            //道岔
            $("#startShow_turnout").change(function () {
                var startTrunout = $(".startShow_turnout").val();
                staticSaveData("DaoCha", startTrunout);
                staticSaveData("PoiVersion", "1");
                window.publicData["DaoCha"] = startTrunout;
                RTU.invoke("app.firstLoad.showDaocha");
            });
            //防洪防汛
            $("#startShow_WfloodPoint").change(function () {
                var startWfloodPoint = $(".startShow_WfloodPoint").val();
                staticSaveData("WfloodPointLevel", startWfloodPoint);
               
                window.publicData["WfloodPointLevel"] = startWfloodPoint;
                RTU.invoke("app.firstLoad.showWfloodPointLevel");
            });
            //临时限速
            $("#startShow_rlimitPoint").change(function () {
                var startRlimitPoint = $(".startShow_rlimitPoint").val();
                staticSaveData("RlimitPointLevel", startRlimitPoint);

                window.publicData["RlimitPointLevel"] = startRlimitPoint;
                RTU.invoke("app.firstLoad.showRlimitPointLevel");
            });
            //换装点
            $("#startShow_eelectronraildepotPoint").change(function () {
                var startEelectronraildepotPoint = $(".startShow_eelectronraildepotPoint").val();
                staticSaveData("EelectronraildepotPointLevel", startEelectronraildepotPoint);

                window.publicData["EelectronraildepotPointLevel"] = startEelectronraildepotPoint;
                RTU.invoke("app.firstLoad.showEelectronraildepotLevel");
            });
            //其他
            $("#startShow_fxPoint").change(function () {
                var startFxPoint = $(".startShow_fxPoint").val();
                staticSaveData("FxPointLevel", startFxPoint);

                window.publicData["FxPointLevel"] = startFxPoint;
                RTU.invoke("app.firstLoad.showFxPointLevel");
            });
            
            //其他
            $("#guDaoNum_showSet").change(function () {
            	var startGudaoNumLevel = $(".guDaoNum_showSet").val();
            	staticSaveData("GudaoNumLevel", startGudaoNumLevel);
            	
            	window.publicData["GudaoNumLevel"] = startGudaoNumLevel;
            	RTU.invoke("map.setGuDaoNumberDiv");
            });
            
            
            
        };
    });

    /**
    * 所有保存按钮
    */
    RTU.register("app.railwaydissertationdata.query.allSaveBut", function () {
        return function () {
            //正弦上行-颜色
            $("#lineUp_color_btn").click(function () {
                var lineUpColor = $("#lineUpColor").val();
                lineUpColor = lineUpColor.colorRgb().substring(4, lineUpColor.colorRgb().length - 1);
                staticSaveData("LineUpColor", lineUpColor);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //正弦下行-颜色
            $("#baseline_color_btn").click(function () {
                var baseLineColor = $("#baseLineColor").val().colorRgb();
                baseLineColor = baseLineColor.substring(4, baseLineColor.length - 1);
                staticSaveData("BaselineColor", baseLineColor);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //站线-颜色
            $("#stationLine_color_btn").click(function () {
                var stationLineColor = $("#stationLineColor").val();
                stationLineColor = stationLineColor.colorRgb().substring(4, stationLineColor.colorRgb().length - 1);
                staticSaveData("StationLineColor", stationLineColor);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //股道宽度
            $("#lineWidthBut").click(function () {
                var lineWidth = $("#lineWidth").val();
                staticSaveData("LineWidth", lineWidth);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //股道虚线长度
            $("#lineLengthBut").click(function () {
                var lineLength = $("#lineLength").val();
                staticSaveData("LineLength", lineLength);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //股道缺口长度
            $("#lineKouBut").click(function () {
                var lineKou = $("#lineKou").val();
                staticSaveData("LineKou", lineKou);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //股道-简易-宽度
            $("#lessGuDaoWidth_btn").click(function () {
                var gudaoWidth = $("#lessGuDaoWidth").val();
                staticSaveData("AllWidth", gudaoWidth);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //股道-简易-颜色
            $("#lessGuDaoColor_btn").click(function () {
                var gudaoColor = $("#lessGuDaoColor").val();
                gudaoColor = gudaoColor.colorRgb().substring(4, gudaoColor.colorRgb().length - 1);
                staticSaveData("AllColor", gudaoColor);
                staticSaveData("GuDaoVersion", "1");
                RTU.invoke("map.GuDao", {});
            });
            //省份边界-颜色
            $("#district_color_btn").click(function () {
                var districtColor = $("#districtColor").val();
                districtColor = districtColor.colorRgb().substring(4, districtColor.colorRgb().length - 1);
                staticSaveData("DistrictColor", districtColor);
                staticSaveData("DisVersion", 1);
                RTU.invoke("map.GuDaoDis", {});
            });
            //省份边界-宽度
            $("#districtLineWidthBut").click(function () {
                var districtLineWidth = $("#districtLineWidth").val();
                staticSaveData("DistrictLineWidth", districtLineWidth);
                staticSaveData("DisVersion", 1);
                RTU.invoke("map.GuDaoDis", {});
            });
            //省份-显示
            $("input[name='NotMapshowModel']").click(function () {
                var chekboxEle = $("input[name='NotMapshowModel']");
                var resultStr = "";
                $.each(chekboxEle, function (i, n) {
                    if ($(n).attr("checked") == "checked") {
                        resultStr = resultStr + $(n).val() + ",";
                    }
                });
                resultStr = resultStr.substring(0, resultStr.length - 1);
                staticSaveUserData("SetNotMapShowModel", resultStr);
                window.userData["SetNotMapShowModel"] = resultStr;
                RTU.invoke("map.setMapShowMoudel", window.userData["SetMapShowModel"]);
            });
            
            //股道编号颜色
            $("#guDaoNum_color_btn").click(function () {
                var guDaoNumColor = $("#guDaoNumColor").val();
                guDaoNumColor = guDaoNumColor.colorRgb().substring(4, guDaoNumColor.colorRgb().length - 1);
                staticSaveData("guDaoNumColor", guDaoNumColor);
                window.publicData["guDaoNumColor"]=guDaoNumColor;
                RTU.invoke("map.setGuDaoNumberDiv","color");
            });
        };
    });

    RTU.register("app.railwaydissertationdata.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });

    RTU.register("app.railwaydissertationdata.query.init", function () {
        data = RTU.invoke("app.setting.data", "railwaydissertationdata");
        if (data && data.isActive) {
            RTU.invoke("app.railwaydissertationdata.query.activate");
        }
        return function () {
            return true;
        };
    });
});
