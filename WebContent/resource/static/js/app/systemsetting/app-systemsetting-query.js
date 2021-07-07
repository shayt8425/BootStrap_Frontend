RTU.DEFINE(function (require, exports) {
/**
 * 模块名：个人设置
 * name：systemsetting
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("draw/draw.js");
    require("app/systemsetting/app-systemsetting-map-initpositionset.js");
    require("app/home/app-map.js");
    require("app/home/app-map-track.js");
    require("app/home/app-map-pointControls.js");
    var $html;
    var popuwnd;
    var data;
    var userData = RTU.data.user;
    var trainrunningField = [{ field: "recId", name: "记录ID" }, { field: "receiveTime", name: "记录处理时间" }
    						, { field: "locoTypeid", name: "机车型号" }, { field: "locoNo", name: "机车号" }
    						, { field: "locoAb", name: "A/B节" }, { field: "locoIp", name: "机车ip" }
						    , { field: "frameNo", name: "帧序号" }, { field: "appType", name: "应用类型" }
						    , { field: "transType", name: "传输通道类型" }, { field: "proVer", name: "协议版本号" }
						    , { field: "infoVer", name: "信息版本号" }, { field: "infoFrameNo", name: "信息帧序号" }
						    , { field: "lkjTime", name: "lkj主机时间" }, { field: "deviceCorp", name: "厂家" }
						    , { field: "driverId", name: "司机编号" }, { field: "vicedriverId", name: "副司机编号" }
						    , { field: "checiName", name: "车次名" }, { field: "checiEx", name: "车次扩充" }
						    , { field: "kehuo", name: "本补客货" }, { field: "inputJiaolu", name: "输入交路号" }
						    , { field: "factJiaolu", name: "实际交路号" }, { field: "stationNo", name: "车站号" }
						    , { field: "totalWeight", name: "总重" }, { field: "length", name: "计长" }
						    , { field: "vehicleCount", name: "辆数" }, { field: "speed", name: "实速" }
						    , { field: "limitedSpeed", name: "限速" }, { field: "engineSpeed", name: "柴速" }
						    , { field: "guanya", name: "列车管压" }, { field: "gangya", name: "闸缸压力" }
						    , { field: "workStatus", name: "机车工况" }, { field: "zhidong", name: "制动输出" }
						    , { field: "locoSignal", name: "机车信号" }, { field: "lineFlag", name: "标准线路号标志" }
						    , { field: "lineNo", name: "标准线路号" }, { field: "stationTmis", name: "标准车站号" }
						    , { field: "frontLineflag", name: "前方标准线路号标志" }, { field: "frontLineno", name: "前方标准线路号" }
						    , { field: "frontStationJiaolu", name: "前方车站交路号" }, { field: "frontStationNo", name: "前方车站站号" }
						    , { field: "kiloSingD", name: "公里标" }, { field: "frontDistance", name: "前方距离" }
						    , { field: "signalType", name: "信号机种类制式" }, { field: "signalNo", name: "信号机编号" }
						    , { field: "totalDistance", name: "累计位移" }, { field: "jkstate", name: "监控状态" }
						    , { field: "currLateral", name: "本分区支线" }, { field: "currSidetrack", name: "本分区侧线" }
						    , { field: "frontLateral", name: "前方分区支线" }, { field: "frontSidetrack", name: "前方分区侧线" }
						    , { field: "wheel", name: "轮径" }, { field: "kcbz", name: "控车标志" }
						    , { field: "validgpsCount", name: "有效卫星数" }, { field: "gpsTime", name: "gps时间" }
						    , { field: "gpsDirection", name: "gps速度方向" }, { field: "gpsSpeed", name: "gps速度" }
						    , { field: "gpsHeight", name: "gps高度" }, { field: "gpsEwflag", name: "gpsEw半球标志" }
						    , { field: "gpsNsflag", name: "gpsNs半球标志" }, { field: "longitude", name: "gps经度" }
						    , { field: "latitude", name: "gps纬度" }, { field: "tShortname", name: "机车型号简称" }
						    , { field: "dShortname", name: "所属段简称" }, { field: "signalId", name: "信号机编号" }
						    , { field: "signalName", name: "信号机名称" }, { field: "sName", name: "车站名" }
						    , { field: "deptId", name: "机车所属段" }, { field: "frontStationTmis", name: "前方标准车站号"}];

    var lkjverInfoField = [{ field: "recId", name: "记录ID" }, { field: "receiveTime", name: "记录处理时间" }
    					, { field: "locoTypeid", name: "机车型号" }, { field: "locoNo", name: "机车号" }
					    , { field: "locoAb", name: "A/B节" }, { field: "locoIp", name: "机车ip" }
					    , { field: "deptId", name: "机车所属段" }, { field: "frameNo", name: "帧序号" }
					    , { field: "appType", name: "应用类型" }, { field: "transType", name: "传输通道类型" }
					    , { field: "proVer", name: "协议版本号" }, { field: "infoVer", name: "信息版本号" }
					    , { field: "infoFrameNo", name: "信息帧序号" }, { field: "lkjTime", name: "lkj主机时间" }
					    , { field: "deviceCorp", name: "厂家" }, { field: "hxz", name: "黑匣子版本信息" }
					    , { field: "monitor1", name: "一端显示器版本信息" }, { field: "monitor2", name: "二端显示器版本信息" }
					    , { field: "groundA", name: "地面处理A模块版本信息" }, { field: "groundB", name: "地面处理B模块版本信息" }
					    , { field: "txbA", name: "通信A模块版本信息" }, { field: "txbB", name: "通信B模块版本信息" }
					    , { field: "kztxbA", name: "扩展通信A版本信息" }, { field: "kztxbB", name: "扩展通信B版本信息" }
					    , { field: "gps", name: "GPS版本信息" }, { field: "jkzbA", name: "监控主板A版本信息" }
					    , { field: "jkzbB", name: "监控主板B版本信息" }, { field: "jkzbAjkdate", name: "监控主板A监控生成日期" }
					    , { field: "jkzbBjkdate", name: "监控主板B监控生成日期" }, { field: "xtkzAbj", name: "系统控制A、B机" }
					    , { field: "xtkzZbj", name: "系统控制主、备机" }, { field: "xtkzYed", name: "系统控制一端、二端有权" }
					    , { field: "xtkzWqd", name: "系统控制无权端发声、静音" }, { field: "xtkzDsj", name: "系统控制单机、双机" }
					    , { field: "warningtype", name: "版本警示信息类型" }, { field: "warningid", name: "版本警示ID" }
					    , { field: "icflag", name: "IC卡卡控标志" }, { field: "wheel", name: "轮径" }
					    , { field: "jkzbAData", name: "监控主板A数据版本" }, { field: "jkzbBData", name: "监控主板B数据版本" }
					    , { field: "monitor1Data", name: "一端显示器数据版本" }, { field: "monitor2Data", name: "二端显示器数据版本" }
					    , { field: "bJ", name: "备机版本信息"}];

    var tscequipmentField = [{ field: "recId", name: "记录ID" }, { field: "receiveTime", name: "记录处理时间" }
    						, { field: "locoTypeid", name: "机车型号" }, { field: "locoNo", name: "机车号" }
						    , { field: "locoAb", name: "A/B节" }, { field: "locoIp", name: "机车ip" }
						    , { field: "deptId", name: "机车所属段" }, { field: "frameNo", name: "帧序号" }
						    , { field: "appType", name: "应用类型" }, { field: "transType", name: "传输通道类型" }
						    , { field: "proVer", name: "协议版本号" }, { field: "infoVer", name: "信息版本号" }
						    , { field: "infoFrameNo", name: "信息帧序号" }, { field: "lkjTime", name: "lkj主机时间" }
						    , { field: "deviceCorp", name: "厂家" }, { field: "tscType", name: "车载型号" }
						    , { field: "mainSoftver", name: "软件主版本号" }, { field: "subSoftver", name: "软件次版本号" }
						    , { field: "cpuTemp", name: "CPU温度" }, { field: "can0Use", name: "CAN0通道是否有效" }
						    , { field: "can0State", name: "CAN0通道状态" }, { field: "can1Use", name: "CAN1通道是否有效" }
						    , { field: "can1State", name: "CAN1通道状态" }, { field: "can2Use", name: "CAN2通道是否有效" }
						    , { field: "can2State", name: "CAN2通道状态" }, { field: "can3Use", name: "CAN3通道是否有效" }
						    , { field: "can3State", name: "CAN3通道状态" }, { field: "eth0Use", name: "ETH0通道是否有效" }
						    , { field: "eth0State", name: "ETH0通道状态" }, { field: "eth1Use", name: "ETH1通道是否有效" }
						    , { field: "eth1State", name: "ETH1通道状态" }, { field: "eth2Use", name: "ETH2通道是否有效" }
						    , { field: "eth2State", name: "ETH2通道状态" }, { field: "eth3Use", name: "ETH3通道是否有效" }
						    , { field: "eth3State", name: "ETH3通道状态" }, { field: "gpsState", name: "GPS模块状态" }
						    , { field: "wlanState", name: "WLAN网卡状态" }, { field: "com1State", name: "通信模块1状态" }
						    , { field: "com2State", name: "通信模块2状态" }, { field: "locoTypeShortName", name: "机车型号简称" }
						    , { field: "deptShortName", name: "段简称"}];

    /***************************************************************************
    * 加载个人设置页面的Html
    **************************************************************************/
    RTU.register("app.systemsetting.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/systemsetting/app-systemsetting-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    RTU.invoke("app.systemsetting.query.create", $html);
                }
                RTU.invoke("app.systemsetting.query.complexion.init");
                RTU.invoke("app.systemsetting.query.btn.init");
                RTU.invoke("app.systemsetting.query.map.levelSet.init");
                RTU.invoke("app.systemsetting.query.map.levelSet.save.init");
                RTU.invoke("app.systemsetting.query.tips.ItemInit");

                RTU.invoke("app.railwaydissertationdata.query.mapModelSet.init");
                RTU.invoke("app.systemsetting.query.switch.btn.init");
                RTU.invoke("app.systemsetting.query.mybureau.init");
                RTU.invoke("app.systemsetting.query.offlineloco.init");
            }
        });
        return function () {
            return true;
        };
    });
    /***************************************************************************
    * 个人设置窗口-加载
    **************************************************************************/
    RTU.register("app.systemsetting.query.activate", function () {
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
            }
        };
    });
    /***************************************************************************
    * 个人设置窗口关闭
    **************************************************************************/
    RTU.register("app.systemsetting.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    /***************************************************************************
    * 验证用户权限
    **************************************************************************/
    RTU.register("app.systemsetting.query.init", function () {
        data = RTU.invoke("app.setting.data", "systemsetting");
        if (data && data.isActive) {
            RTU.invoke("app.systemsetting.query.activate");
        }
        return function () {
            return true;
        };
    });
    /***************************************************************************
    * 地图级别设置-属性显示默认级别
    **************************************************************************/
    RTU.register("app.systemsetting.query.map.levelSet.init", function () {
        // ////////通用获取数据Ajax加载
        var getData = function (options, selector) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        var data = data.data;
                        if (selector == "#defaultLevel-span") {
                            $(selector).html(data.optionvalue.split(",")[0]);
                        }
                        else if (selector == "#lastClick_ck") {
                            if (data.optionvalue == "0") {
                                $(selector).removeAttr("checked");
                            }
                            else {
                                $(selector).attr("checked", "checked");
                            }
                        }
                        else if (selector == "#telesemeIconDefault") {//信号机图标
                            if (data.optionvalue == "hide") {
                                $(selector).removeAttr("checked");
                            } else {
                                $(selector).attr("checked", "checked");
                            }
                        }
                        else if (selector == "#telesemeNameDefault") {//信号机名称
                            if ($("#telesemeIconDefault").is(":checked")) {
                                $(selector).removeAttr("disabled");
                            }

                            if (data.optionvalue == "hide") {
                                $(selector).removeAttr("checked");
                            } else {
                                $(selector).attr("checked", "checked");
                            }
                        }
                        else if (selector == "#turnoutIconDefault") {//道岔图标
                            if (data.optionvalue == "hide") {
                                $(selector).removeAttr("checked");
                            } else {
                                $(selector).attr("checked", "checked");
                            }
                        }
                        else if (selector == "#carNameDefault") {//机车名称
                            if (data.optionvalue == "hide") {
                                $(selector).removeAttr("checked");
                                RTU.invoke("map.marker.tIPSMarkerClose");
                                RTU.tipsShow = "close";
                            } else {
                                $(selector).attr("checked", "checked");
                                RTU.invoke("map.marker.tIPSMarkerOpen");
                                RTU.tipsShow = "open";
                            }
                        }
                        else {
                            $(selector).val(data.optionvalue);
                        }
                    }
                }
            });
        };

        /***********************************************************************
        * 初始化数据
        **********************************************************************/
        var dataIni = function () {
            // //地图级别默认值
            this.defaultLevelInit = function () {
                getData("MapLevel", "#defaultLevel-span");
            };
            // //tips
            this.tipsInit = function () {
                getData("Tips", ".tisp_showSet");
            };
            // //股道
            // this.gudaoInit = function () {
            // getData("GuDao", ".guDao_showSet");
            // };
            // //车站
            this.stationInit = function () {
                getData("Station", ".station_showSet");
            };
            // //信号机
            this.signalInit = function () {
                getData("Signal", ".signal_showSet");
            };
            // //道岔
            this.daochaInit = function () {
                getData("DaoCha", ".daocha");
            };
            // //记录鼠标最后点击位置
            this.recordLastClick = function () {
                getData("RecordingLastClick", "#lastClick_ck");
            };
            this.carNameClick = function () {
                getData("carNameDefault", "#carNameDefault");
            };
            // //信号机图标
            this.telesemeIconClick = function () {
                getData("telesemeIconDefault", "#telesemeIconDefault");
            };
            // //信号机名称
            this.telesemeNameClick = function () {
                getData("telesemeNameDefault", "#telesemeNameDefault");
            };
            // //道岔图标
            this.turnoutIconClick = function () {
                getData("turnoutIconDefault", "#turnoutIconDefault");
            };
            this.init = function () {
                this.defaultLevelInit();
                this.tipsInit();
                // this.gudaoInit();
                this.stationInit();
                this.signalInit();
                this.daochaInit();
                this.recordLastClick();
                this.carNameClick();
                this.telesemeIconClick();
                this.telesemeNameClick();
                this.turnoutIconClick();
                //                this.turnoutNameClick();
            };
            this.init();
        };
        /***********************************************************************
        * 股道窗口设置-隐藏/显示
        **********************************************************************/
        var guodaoInit = function () {
            this.setbtn = function () {
                $(".guodao-setBtn").click(function () {
                    $(".guodao-div").removeClass("hidden");
                    $(".overconver-div").removeClass("hidden");
                    // //加载数据
                    // 正线
                    getData("GuDaoZXXiaXing", "#mainLine-select");
                    // 正线下行$("#mainLineUp-select")
                    getData("GuDaoZXShangXing", "#mainLineUp-select");
                    // 站线
                    getData("GuDaoZhanXian", "#stationLine-select");
                });
            };
            this.finishBtn = function () {
                $("#guodao-finish-btn").click(function () {
                    $(".guodao-div").addClass("hidden");
                    $(".overconver-div").addClass("hidden");
                });
            };
            this.init = function () {
                this.setbtn();
                this.finishBtn();
            };
            this.init();
        };
        return function () {
            dataIni();
        };
    });
    /***************************************************************************
    * 数据保存
    **************************************************************************/
    RTU.register("app.systemsetting.query.map.levelSet.save.init", function () {
        var saveAjax = function (options, value) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + value + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    searchAjax();
                }
            });
        };

        var searchAjax = function () {
            $.ajax({
                url: "../syssetting/findByUserId?userId=" + RTU.data.user.id,
                type: "get",
                async: false,
                success: function (data) {
                    var data = $.parseJSON(data);
                    if (data.data) {
                        for (var i = 0; i < data.data.length; i++) {
                            window.userData[data.data[i].options] = data.data[i].optionvalue;
                        }
                    }
                }
            });
        };

        var saveInit = function () {
            this.dropDownChange = function () {
                // //TIPS
                $(".tisp_showSet").change(function () {
                    saveAjax("Tips", $(".tisp_showSet").val());
                    RTU.invoke("map.showCarPointLevel", $(".tisp_showSet").val());
                });
                // //车站
                $(".station_showSet").change(function () {
                    saveAjax("Station", $(".station_showSet").val());
                    RTU.invoke("map.Station", $(".station_showSet").val());
                });
                // //信号机
                $(".signal_showSet").change(function () {
                    saveAjax("Signal", $(".signal_showSet").val());
                    RTU.invoke("map.Teleseme", $(".signal_showSet").val());
                });
                // //道岔
                $(".daocha").change(function () {
                    saveAjax("DaoCha", $(".daocha").val());
                    RTU.invoke("map.Turnout", $(".daocha").val());
                });
                // //记录鼠标最后点击位置
                $("#lastClick_ck").click(function () {
                    var optionValue = "";
                    if ($(this).attr("checked")) {
                        optionValue = "1";
                    }
                    else {
                        optionValue = "0";
                    }
                    saveAjax("RecordingLastClick", optionValue);
                });

                //机车名称
                $("#carNameDefault").click(function () {
                    if ($(this).is(":checked")) {
                        saveAjax($(this).val(), "show");
                        window.userData["carNameDefault"] = "show";
                        RTU.invoke("map.marker.tIPSMarkerOpen");
                        RTU.tipsShow = "open";
                    } else {
                        saveAjax($(this).val(), "hide");
                        window.userData["carNameDefault"] = "hide";
                        RTU.invoke("map.marker.tIPSMarkerClose");
                        RTU.tipsShow = "close";
                    }
                });

                //信号机图标
                $("#telesemeIconDefault").click(function () {
                    if ($(this).is(":checked")) {
                        $("#telesemeNameDefault").removeAttr("disabled");
                        saveAjax($(this).val(), "show");
                        window.userData["telesemeIconDefault"] = "show";
                        if (window.userData["telesemeNameDefault"] == "show") {
                            $("#telesemeNameDefault").attr("checked", "checked");
                        } else {
                            $("#telesemeNameDefault").removeAttr("checked");
                        }
                        RTU.invoke("app.firstLoad.showTeleseme");
                    } else {
                        $("#telesemeNameDefault").attr("disabled", "disabled");
                        $("#telesemeNameDefault").removeAttr("checked");

                        saveAjax($(this).val(), "hide");
                        RTU.invoke("map.remove.railWaySign");
                        RTU.invoke("map.remove.railWaySignName");
                        window.userData["telesemeIconDefault"] = "hide";
                    }
                });

                //信号机名
                $("#telesemeNameDefault").click(function () {
                    if ($(this).is(":checked")) {
                        saveAjax($(this).val(), "show");
                        if ($("#telesemeIconDefault").is(":checked")) {
                            RTU.invoke("map.railWaySignName");
                        } else {
                            $(this).attr("disabled", "disabled");
                        }
                    } else {
                        saveAjax($(this).val(), "hide");
                        RTU.invoke("map.remove.railWaySignName");
                    }
                });

                //岔道图标
                $("#turnoutIconDefault").click(function () {
                    if ($(this).is(":checked")) {
                        saveAjax($(this).val(), "show");
                        // RTU.invoke("map.railWayPoi");
                        window.userData["turnoutIconDefault"] = "show";
                        RTU.invoke("app.firstLoad.showDaocha");
                    } else {
                        saveAjax($(this).val(), "hide");
                        RTU.invoke("map.remove.railWayPoi");
                        window.userData["turnoutIconDefault"] = "hide";
                    }
                });
            };
            this.Init = function () {
                this.dropDownChange();
            };
            this.Init();
        };

        return function () {
            saveInit();
        };
    });
    /***********************************************************************
    * 历史信息列表显示隐藏保存按钮绑定事件
    **********************************************************************/
    RTU.register("app.systemsetting.query.btn.init", function () {
        // ///////数据加载
        var dataInit = function (options, selector) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    var d = data.data;
                    if (d) {
                        var data = d.optionvalue.split(",");
                    }

                    var selectType = "";
                    var selectArr = [];

                    if (selector == "RealTimeHistory_LKJ_ck") {
                        selectType = "RealTimeHistory_LKJ";
                        selectArr = trainrunningField;
                    } else if (selector == "VersionHistory_LKJ_ck") {
                        selectType = "VersionHistory_LKJ";
                        selectArr = lkjverInfoField;
                    } else if (selector == "TscStatusHis_ck") {
                        selectType = "TscStatusHis";
                        selectArr = tscequipmentField;
                    }

                    $("." + selectType + "_selectOption").empty();
                    $("." + selectType + "_allOption").empty();

                    var selectedArr = [];
                    $.each(selectArr, function (i, allItem) {
                        var b = false;
                        $.each(data, function (i, item) {
                            if (allItem.field == item) {
                                b = true;
                                selectedArr.push({ field: allItem.field, name: allItem.name });
                            }
                        });

                        if (!b) {
                            var str = "<option value='" + allItem.field + "'>" + allItem.name + "</option>";
                            $("." + selectType + "_allOption").append(str);
                        }

                    });
                    $.each(data, function (i, item) {
                        $.each(selectedArr, function (i, item1) {
                            if (item == item1.field) {
                                var str = "<option value='" + item1.field + "'>" + item1.name + "</option>";
                                $("." + selectType + "_selectOption").append(str);
                            }
                        });
                    });
                }
            });
        };

        // 初始化---列车运行状态历史查询按钮
        var initRealTimeHistory_LKJBut = function () {
            // 当选中项发生改变时==控制上下移动是否可用
            $(".RealTimeHistory_LKJ_selectOption").change(function () {
                if ($(".RealTimeHistory_LKJ_selectOption option:selected").length > 1) {
                    $(".RealTimeHistory_LKJ_upMove").attr("disabled", true);
                    $(".RealTimeHistory_LKJ_downMove").attr("disabled", true);
                } else {
                    $(".RealTimeHistory_LKJ_upMove").attr("disabled", false);
                    $(".RealTimeHistory_LKJ_downMove").attr("disabled", false);
                }
            });

            // 右移
            $(".RealTimeHistory_LKJ_rightMove").unbind("click").click(function () {
                $.each($(".RealTimeHistory_LKJ_allOption option:selected"), function (i, item) {
                    $(".RealTimeHistory_LKJ_allOption option[value='" + $(item).val() + "']").remove();
                    $(".RealTimeHistory_LKJ_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });

            });

            // 左移
            $(".RealTimeHistory_LKJ_leftMove").unbind("click").click(function () {
                $.each($(".RealTimeHistory_LKJ_selectOption option:selected"), function (i, item) {
                    $(".RealTimeHistory_LKJ_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".RealTimeHistory_LKJ_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部右移
            $(".RealTimeHistory_LKJ_allRightMove").unbind("click").click(function () {
                $.each($(".RealTimeHistory_LKJ_allOption option"), function (i, item) {
                    $(".RealTimeHistory_LKJ_allOption option[value='" + $(item).val() + "']").remove();
                    $(".RealTimeHistory_LKJ_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部左移
            $(".RealTimeHistory_LKJ_allLeftMove").unbind("click").click(function () {
                $.each($(".RealTimeHistory_LKJ_selectOption option"), function (i, item) {
                    $(".RealTimeHistory_LKJ_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".RealTimeHistory_LKJ_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 上移
            $(".RealTimeHistory_LKJ_upMove").unbind("click").click(function () {
                if ($(".RealTimeHistory_LKJ_selectOption option:selected").length > 0) {
                    var selectIndex = $(".RealTimeHistory_LKJ_selectOption").get(0).selectedIndex;

                    if (selectIndex > 0) {
                        $('.RealTimeHistory_LKJ_selectOption option:selected').insertBefore($('.RealTimeHistory_LKJ_selectOption option:selected').prev('option'));
                    } else {
                        //        				alert("此为第一项了。");
                        RTU.invoke("header.alarmMsg.show", "此为第一项了。");
                    }
                } else {
                    //        			alert("请选择一项。。。");
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 下移
            $(".RealTimeHistory_LKJ_downMove").unbind("click").click(function () {
                if ($(".RealTimeHistory_LKJ_selectOption option:selected").length > 0) {
                    var selectLength = $(".RealTimeHistory_LKJ_selectOption option").length;
                    var selectIndex = $(".RealTimeHistory_LKJ_selectOption").get(0).selectedIndex;
                    if (selectIndex < selectLength - 1) {
                        $('.RealTimeHistory_LKJ_selectOption option:selected').insertAfter($('.RealTimeHistory_LKJ_selectOption option:selected').next('option'));
                    } else {
                        RTU.invoke("header.alarmMsg.show", "此为最后一项了。");
                    }
                } else {
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 保存
            $(".RealTimeHistory_LKJ_saveBut").click(function () {
                var str = "";
                $.each($(".RealTimeHistory_LKJ_selectOption option"), function (i, item) {
                    str = str + $(item).val() + ",";
                });
                str = str.substring(0, str.length - 1);
                saveModel("LkjInfoHisM" + $(".RealTimeHistory_LKJ_saveBut").attr("model"), str);
                $("#lkjrealTime-set-container").addClass("hidden");
                $(".overconver-div").addClass("hidden");
            });
        };
        // 初始化---lkj版本历史查询按钮
        var initVersionHistory_LKJ_But = function () {
            // 当选中项发生改变时==控制上下移动是否可用
            $(".VersionHistory_LKJ_selectOption").change(function () {
                if ($(".VersionHistory_LKJ_selectOption option:selected").length > 1) {
                    $(".VersionHistory_LKJ_upMove").attr("disabled", true);
                    $(".VersionHistory_LKJ_downMove").attr("disabled", true);
                } else {
                    $(".VersionHistory_LKJ_upMove").attr("disabled", false);
                    $(".VersionHistory_LKJ_downMove").attr("disabled", false);
                }
            });

            // 右移
            $(".VersionHistory_LKJ_rightMove").unbind("click").click(function () {
                $.each($(".VersionHistory_LKJ_allOption option:selected"), function (i, item) {
                    $(".VersionHistory_LKJ_allOption option[value='" + $(item).val() + "']").remove();
                    $(".VersionHistory_LKJ_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 左移
            $(".VersionHistory_LKJ_leftMove").unbind("click").click(function () {
                $.each($(".VersionHistory_LKJ_selectOption option:selected"), function (i, item) {
                    $(".VersionHistory_LKJ_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".VersionHistory_LKJ_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部右移
            $(".VersionHistory_LKJ_allRightMove").unbind("click").click(function () {
                $.each($(".VersionHistory_LKJ_allOption option"), function (i, item) {
                    $(".VersionHistory_LKJ_allOption option[value='" + $(item).val() + "']").remove();
                    $(".VersionHistory_LKJ_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部左移
            $(".VersionHistory_LKJ_allLeftMove").unbind("click").click(function () {
                $.each($(".VersionHistory_LKJ_selectOption option"), function (i, item) {
                    $(".VersionHistory_LKJ_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".VersionHistory_LKJ_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 上移
            $(".VersionHistory_LKJ_upMove").unbind("click").click(function () {
                if ($(".VersionHistory_LKJ_selectOption option:selected").length > 0) {
                    var selectIndex = $(".VersionHistory_LKJ_selectOption").get(0).selectedIndex;

                    if (selectIndex > 0) {
                        $('.VersionHistory_LKJ_selectOption option:selected').insertBefore($('.VersionHistory_LKJ_selectOption option:selected').prev('option'));
                    } else {
                        RTU.invoke("header.alarmMsg.show", "此为第一项了。");
                    }
                } else {
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 下移
            $(".VersionHistory_LKJ_downMove").unbind("click").click(function () {
                if ($(".VersionHistory_LKJ_selectOption option:selected").length > 0) {
                    var selectLength = $(".VersionHistory_LKJ_selectOption option").length;
                    var selectIndex = $(".VersionHistory_LKJ_selectOption").get(0).selectedIndex;
                    if (selectIndex < selectLength - 1) {
                        $('.VersionHistory_LKJ_selectOption option:selected').insertAfter($('.VersionHistory_LKJ_selectOption option:selected').next('option'));
                    } else {
                        RTU.invoke("header.alarmMsg.show", "此为最后一项了。");
                    }
                } else {
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 保存
            $(".VersionHistory_LKJ_saveBut").click(function () {
                var str = "";
                $.each($(".VersionHistory_LKJ_selectOption option"), function (i, item) {
                    str = str + $(item).val() + ",";
                });
                str = str.substring(0, str.length - 1);
                saveModel("LkjVersionM" + $(".VersionHistory_LKJ_saveBut").attr("model"), str);
                $("#lkjversion-set-container").addClass("hidden");
                $(".overconver-div").addClass("hidden");
            });
        };
        // 初始化---列车运行状态历史查询按钮
        var initTscStatusHis_LKJBut = function () {
            // 当选中项发生改变时==控制上下移动是否可用
            $(".TscStatusHis_selectOption").change(function () {
                if ($(".TscStatusHis_selectOption option:selected").length > 1) {
                    $(".TscStatusHis_upMove").attr("disabled", true);
                    $(".TscStatusHis_downMove").attr("disabled", true);
                } else {
                    $(".TscStatusHis_upMove").attr("disabled", false);
                    $(".TscStatusHis_downMove").attr("disabled", false);
                }
            });

            // 右移
            $(".TscStatusHis_rightMove").unbind("click").click(function () {
                $.each($(".TscStatusHis_allOption option:selected"), function (i, item) {
                    $(".TscStatusHis_allOption option[value='" + $(item).val() + "']").remove();
                    $(".TscStatusHis_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });

            });

            // 左移
            $(".TscStatusHis_leftMove").unbind("click").click(function () {
                $.each($(".TscStatusHis_selectOption option:selected"), function (i, item) {
                    $(".TscStatusHis_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".TscStatusHis_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部右移
            $(".TscStatusHis_allRightMove").unbind("click").click(function () {
                $.each($(".TscStatusHis_allOption option"), function (i, item) {
                    $(".TscStatusHis_allOption option[value='" + $(item).val() + "']").remove();
                    $(".TscStatusHis_selectOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 全部左移
            $(".TscStatusHis_allLeftMove").unbind("click").click(function () {
                $.each($(".TscStatusHis_selectOption option"), function (i, item) {
                    $(".TscStatusHis_selectOption option[value='" + $(item).val() + "']").remove();
                    $(".TscStatusHis_allOption").append("<option value='" + $(item).val() + "'>" + $(item).text() + "</option>");
                });
            });

            // 上移
            $(".TscStatusHis_upMove").unbind("click").click(function () {
                if ($(".TscStatusHis_selectOption option:selected").length > 0) {
                    var selectIndex = $(".TscStatusHis_selectOption").get(0).selectedIndex;

                    if (selectIndex > 0) {
                        $('.TscStatusHis_selectOption option:selected').insertBefore($('.TscStatusHis_selectOption option:selected').prev('option'));
                    } else {
                        RTU.invoke("header.alarmMsg.show", "此为第一项了。");
                    }
                } else {
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 下移
            $(".TscStatusHis_downMove").unbind("click").click(function () {
                if ($(".TscStatusHis_selectOption option:selected").length > 0) {
                    var selectLength = $(".TscStatusHis_selectOption option").length;
                    var selectIndex = $(".TscStatusHis_selectOption").get(0).selectedIndex;
                    if (selectIndex < selectLength - 1) {
                        $('.TscStatusHis_selectOption option:selected').insertAfter($('.TscStatusHis_selectOption option:selected').next('option'));
                    } else {
                        RTU.invoke("header.alarmMsg.show", "此为最后一项了。");
                    }
                } else {
                    RTU.invoke("header.alarmMsg.show", "请选择一项。。。");
                }
            });

            // 保存
            $(".TscStatusHis_saveBut").click(function () {
                var str = "";
                $.each($(".TscStatusHis_selectOption option"), function (i, item) {
                    str = str + $(item).val() + ",";
                });
                str = str.substring(0, str.length - 1);
                saveModel("TscStatusHisM" + $(".TscStatusHis_saveBut").attr("model"), str);
                $("#tsc-set-container").addClass("hidden");
                $(".overconver-div").addClass("hidden");
            });
        };

        var saveModel = function (options, str) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + str + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };

        // //////LKJ实时模式数据加载
        var setLKJRealtimePopety = function (modelType) {
            $("#RealTimeHistory_LKJ_checkAll").removeAttr("checked");
            $("#RealTimeHistory_LKJ_unCheckAll").removeAttr("checked");
            $("#lkjrealTime-set-container").removeClass("hidden");
            $(".overconver-div").removeClass("hidden");
            $("#RealTimeHistory_LKJ_btn").attr("model", modelType);
            $("#modelType-lkj-title").html("模式" + (modelType == "1" ? "一" : (modelType == "2" ? "二" : "三")));
            $(".upMove").attr("disabled", false);
            $(".downMove").attr("disabled", false);
            $(".RealTimeHistory_LKJ_saveBut").attr("model", modelType);
            dataInit("LkjInfoHisM" + modelType, "RealTimeHistory_LKJ_ck");
            initRealTimeHistory_LKJBut();
        };
        // //////LKJ版本模式数据加载
        var setLKJVersionPopety = function (modelType) {
            $("#VersionHistory_LKJ_checkAll").removeAttr("checked");
            $("#VersionHistory_LKJ_unCheckAll").removeAttr("checked");
            $("#lkjversion-set-container").removeClass("hidden");
            $(".overconver-div").removeClass("hidden");
            $(".VersionHistory_LKJ_saveBut").attr("model", modelType);
            $("#modelType-lkjversion-title").html("模式" + (modelType == "1" ? "一" : (modelType == "2" ? "二" : "三")));
            dataInit("LkjVersionM" + modelType, "VersionHistory_LKJ_ck");
            initVersionHistory_LKJ_But();
        };
        // //////TSC设备模式数据加载
        var setTSCPopety = function (modelType) {
            $("#TscStatusHis_CheckAll").removeAttr("checked");
            $("#TscStatusHis_unCheckAll").removeAttr("checked");
            $("#tsc-set-container").removeClass("hidden");
            $(".overconver-div").removeClass("hidden");
            $(".TscStatusHis_saveBut").attr("model", modelType);
            $("#modelType-tsc-title").html("模式" + (modelType == "1" ? "一" : (modelType == "2" ? "二" : "三")));
            dataInit("TscStatusHisM" + modelType, "TscStatusHis_ck");
            initTscStatusHis_LKJBut();
        };

        // /按钮 事件绑定
        var btnBindInit = function () {
            // /////地图设置触发按钮
            $(".map-initposition-set").click(function () {
                RTU.invoke("app.mapsetting.showWin");
            });
            // ////关闭按钮
            $(".setting-closeImg-btn").click(function () {
                $(".guodao-div").addClass("hidden");
                $(".detail-info-div").addClass("hidden");
                $(".overconver-div").addClass("hidden");
            });

            // /////历史信息模式按钮事件
            /** ************LKJ实时历史信息*************** */
            // //////模式一
            $(".lkjrealTime-setBtn1").click(function () {
                setLKJRealtimePopety(1);
            });
            // //////模式二
            $(".lkjrealTime-setBtn2").click(function () {
                setLKJRealtimePopety(2);
            });
            // //////模式三
            $(".lkjrealTime-setBtn3").click(function () {
                setLKJRealtimePopety(3);
            });
            /** ************LKJ版本历史信息*************** */
            // //////模式一
            $(".lkjversion-setBtn1").click(function () {
                setLKJVersionPopety(1);
            });
            // //////模式二
            $(".lkjversion-setBtn2").click(function () {
                setLKJVersionPopety(2);
            });
            // //////模式三
            $(".lkjversion-setBtn3").click(function () {
                setLKJVersionPopety(3);
            });
            /** ************TSC历史信息*************** */
            // //////模式一
            $(".tsc-setBtn1").click(function () {
                setTSCPopety(1);
            });
            // //////模式二
            $(".tsc-setBtn2").click(function () {
                setTSCPopety(2);
            });
            // //////模式三
            $(".tsc-setBtn3").click(function () {
                setTSCPopety(3);
            });
        };
        return function () {
            // checkbox初始化
            // ///checkboxInit();
            // 全选/全不选事件
            // checkbox_checkAllOrNot_Click();
            // 保存按钮事件
            btnBindInit();
        };
    });
    // ///////皮肤下拉框数据加载
    RTU.register("app.systemsetting.query.background.init", function () {
        var dropdwColorInit = function () {
            var strColor = "";
            strColor = ($(".index-searche-right-btn").css("background-color") == "rgb(0, 157, 12)" ? "绿色" : ($(".index-searche-right-btn").css("background-color") == "rgb(0, 93, 186)" ? "蓝色" : ($(".index-searche-right-btn").css("background-color") == "rgb(192, 57, 43)" ? "红色" : "")));
            $("#complexion").val(strColor);
        };
        return function () {
            dropdwColorInit();
        };
    });
    
    // /////////创建皮肤下拉框选项
    RTU.register("app.systemsetting.query.offlineloco.init", function () {
        var checkBoxInit = function () {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=ShowOffLineLoco&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                	if(value&&value.data){
                		if(value.data.optionvalue=="1"){
                        	$("#locoDisplay").attr("checked","checked");
                        }
                        else $("#locoDisplay").removeAttr("checked");
                	}
                	else $("#locoDisplay").attr("checked","checked");
                }
            });
        };
        return function () {
            checkBoxInit();
            $("#locoDisplay").click(function () {
            	var checkVal=$("#locoDisplay").attr("checked")?"1":"0";
            	$.ajax({
                    url: "../syssetting/updateObjByProperty?options=ShowOffLineLoco&optionvalue="
                    	+ checkVal + "&userid=" + userData.id + "&type=2",
                    dataType: "jsonp",
                    type: "GET",
                    success: function (value) {
                    	window.userData["ShowOffLineLoco"]=checkVal;
                    	window.pSKeeping = {}; //用来储存point点 以便更新点的时候不用再次添加
                        window.carPointData={};//存储机车点
                        RTU.invoke("map.marker.removeAllMarker");
                        
                        RTU.invoke("header.notice.show", "机车显示设置成功!");
                    }
                });
            });
        };
    });
    
    // /////////创建皮肤下拉框选项
    RTU.register("app.systemsetting.query.complexion.init", function () {
        var complexionSearch = function () {
            $.ajax({
                url: "../dictionary/findAllByParentName?parentName=皮肤颜色",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                    var data = value.data;
                    $("#complexion").html("");
                    $("#complexion").append("<option value=' '>请选择颜色</option>");
                    for (var i = 0; i < data.length; i++) {
                        $("#complexion").append("<option value='" + data[i].name + "'>" + data[i].name + "</option>");
                    }
                    RTU.invoke("app.systemsetting.query.background.init");
                }
            });
        };

        var complexionChange = function (optionvalue) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?options=皮肤&optionvalue=" + optionvalue + "&userid=" + userData.id + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                    RTU.invoke("header.notice.show", "皮肤颜色修改成功!");
                }
            });
        };
        return function () {
            complexionSearch();
            $("#complexion").change(function () {
                var changeVal = $("#complexion").val();
                var changeText = $("#complexion").find("option:selected").text();
                complexionChange(changeText);
                // 立刻切换皮肤
                var color = (changeText == "蓝色" ? "#005aba" : (changeText == "绿色" ? "#009d0c" : (changeText == "红色" ? "#c0392b" : "#009d0c")));
                if (color == "#c0392b") {
                    $("#header").css("background", "url('../static/img/app/bg_3.png')");
                    $(".nav_item").removeClass("background_green").removeClass("background_blue").addClass("background_red");
                } else if (color == "#009d0c") {
                    $("#header").css("background", "url('../static/img/app/bg_1.png')");
                    $(".nav_item").removeClass("background_red").removeClass("background_blue").addClass("background_green");
                } else {
                    $("#header").css("background", "url('../static/img/app/bg_2.png')");
                    $(".nav_item").removeClass("background_green").removeClass("background_red").addClass("background_blue");
                }

                $(".index-searche-right-btn").css("background-color", color);
            });
        };
    });
    // /////////创建所属局下拉框选项
    RTU.register("app.systemsetting.query.mybureau.init", function () {
    	var getData = function (options, domId) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                    	$("#" + domId).val(data.data.optionvalue);
                    }
                }
            });
        };
    	var mybureauSearch = function () {
    		$.ajax({
    			url: "../bureau/findAll",
    			dataType: "jsonp",
    			type: "GET",
    			success: function (value) {
    				var data = value.data;
    				$("#mybureau").html("");
    				$("#mybureau").append("<option value=' '>请选择所属局</option>");
    				for (var i = 0; i < data.length; i++) {
    					$("#mybureau").append("<option value='" + data[i].bId + "'>" + data[i].bName + "</option>");
    				}
    				getData("mybureau","mybureau");
    			}
    		});
    	};
    	
    	var mybureauChange = function (optionvalue) {
    		$.ajax({
    			url: "../syssetting/updateObjByProperty?options=mybureau&optionvalue=" + optionvalue + "&userid=" + userData.id + "&type=2",
    			dataType: "jsonp",
    			type: "GET",
    			success: function (value) {
    				RTU.invoke("header.notice.show", "默认所属局修改成功!");
    			}
    		});
    	};
    	return function () {
    		mybureauSearch();
    		$("#mybureau").change(function () {
    			var changeVal = $("#mybureau").val();
//    			var changeText = $("#mybureau").find("option:selected").text();
//    			mybureauChange(changeText);
    			mybureauChange(changeVal);
    		});
    	};
    });

    // /////TIPS配置项设置
    RTU.register("app.systemsetting.query.tips.ItemInit", function () {
        var getData = function (options) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        var data = data.data;
                        $("input[name='tipsItemSet_ck']", $(".tipsitemset-container")).each(function () {
                            if (data.optionvalue.indexOf($(this).attr("id")) != -1) {
                                $(this).attr("checked", "checked");
                            }
                        });
                    }
                }
            });
        };
        var save = function (options, strName) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + strName + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };
        var dataInit = function () {
            this.checkboxDataInit = function () {
                getData("TipsSetting");
            };
            this.checkboxClick = function () {
                $("input[name='tipsItemSet_ck']").click(function () {
                    var strName = "";
                    $("input[name='tipsItemSet_ck']", $(".tipsitemset-container")).each(function () {
                        if ($(this).attr("checked")) {
                            strName += $(this).val() + ",";
                        }
                    });
                    save("TipsSetting", strName);
                    window.userData["TipsSetting"] = strName;
                    if (strName == "") {
                        strName = "none";
                    }
                    RTU.invoke("map.TipsSetting", strName);
                });
            };
            this.init = function () {
                this.checkboxClick();
                this.checkboxDataInit();
            };
            this.init();
        };
        return function () {
            dataInit();
        };
    });

    RTU.register("app.systemsetting.query.switch.btn.init", function () {
        var getData = function (options, domId) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        if (data.data.optionvalue == "close") {
                            $("#" + domId).removeClass("switch-background-on").addClass("switch-background-off");
                        }
                        else {
                            $("#" + domId).removeClass("switch-background-off").addClass("switch-background-on");
                        }
                    }
                }
            });
        };
        var bindDataBtn = function () {
            this.stationSwitch = function () {
                getData("stationState", "switch-station");
                getData("telesemeState", "switch-teleseme");
                getData("turnoutState", "switch-turnout");
            };
            this.init = function () {
                this.stationSwitch();
            };
            this.init();
        };

        var initClickBtn = function () {
            this.stationBtn = function () {
                $("#switch-station").click(function () {
                    var status = "";
                    if ($(this).attr("class").indexOf("switch-background-on") != -1) {
                        status = "close";
                        $(this).removeClass("switch-background-on");
                        $(this).addClass("switch-background-off");
                    }
                    else {
                        status = "open";
                        $(this).removeClass("switch-background-off");
                        $(this).addClass("switch-background-on");
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "stationState", value: status });
                    RTU.invoke("map.setPointShow", { stateName: "stationState", stateValue: status, pointTypeName: "Station", pointTypeValue: $(".station_showSet").val() });

                });
                $("#switch-teleseme").click(function () {
                    var status = "";
                    if ($(this).attr("class").indexOf("switch-background-on") != -1) {
                        status = "close";
                        $(this).removeClass("switch-background-on");
                        $(this).addClass("switch-background-off");
                    }
                    else {
                        status = "open";
                        $(this).removeClass("switch-background-off");
                        $(this).addClass("switch-background-on");
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "telesemeState", value: status });
                    RTU.invoke("map.setPointShow", { stateName: "telesemeState", stateValue: status, pointTypeName: "Signal", pointTypeValue: $(".signal_showSet").val() });
                });
                $("#switch-turnout").click(function () {
                    var status = "";
                    if ($(this).attr("class").indexOf("switch-background-on") != -1) {
                        status = "close";

                        $(this).removeClass("switch-background-on");
                        $(this).addClass("switch-background-off");
                    }
                    else {
                        status = "open";
                        RTU.invoke("map.returnUserData");
                        $(this).removeClass("switch-background-off");
                        $(this).addClass("switch-background-on");
                    }
                    RTU.invoke("header.maptooler.saveState", { option: "turnoutState", value: status });
                    RTU.invoke("map.setPointShow", { stateName: "turnoutState", stateValue: status, pointTypeName: "DaoCha", pointTypeValue: $(".daocha").val() });
                });
            };
            this.init = function () {
                this.stationBtn();
            };
            this.init();
        };
        return function () {
            bindDataBtn();
            initClickBtn();
        };
    });
    RTU.register("app.railwaydissertationdata.query.mapModelSet.init", function () {
        var clickFlag = "-1";
        var getdata = function (optionKey) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + optionKey + "&type=1",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    if (data.data != null) {
                        if (data.data.optionvalue == "1") {
                            clickFlag = "1";
                            $("#MapshowModel-railway").attr("checked", "checkec");
                        }
                        else  if(data.data.optionvalue == "0")  {
                            clickFlag = "0";
                            $("#MapshowModel-base").attr("checked", "checkec");
                        }else{
                        	 clickFlag = "2";
                             $("#MapshowModel-moon").attr("checked", "checkec");
                        }
                    }
                }
            });
        };
        var setData = function (options, value) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=" + RTU.data.user.id + "&options=" + options + "&optionvalue=" + value + "&type=1",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                }
            });
        };
        var initSetRadioData = function () {
            this.initData = function () {
                getdata("SetMapShowModel");
            };
            this.init = function () {
                this.initData();
            };
            this.init();
        };

        var initRadioClick = function () {
            $("input[name='MapshowModel']").click(function () {
                $(this).attr("checked", "checked");
                setData("SetMapShowModel", $(this).val());
                window.userData["SetMapShowModel"] = $(this).val();
                RTU.invoke("map.railwayStations");
                RTU.invoke("map.setMapShowMoudel", $(this).val());
                
                var type=$(this).val();
                
                var imgSrc="../static/img/app/tile.png";
                var alt="index_tile";
				 var labelText="常规地图";
				 if (type == "0") {
               	     imgSrc="../static/img/app/tile.png";
				     labelText="常规地图";
				     alt="index_tile";
                 }else if (type == "1") {
               	     imgSrc="../static/img/app/tile_railway.png";
				     labelText="铁路地图";
				     alt="index_tile_railway";
                } else {
               	     imgSrc="../static/img/app/tile_moon.png";
					 labelText="卫星地图";
					 alt="index_tile_moon";
                }
                
                $(".mapModel_changeLabel").text(labelText);
				$(".mapModel_changeLabel").attr("alt",alt);
				$("#mapModel_changeImg").attr("src",imgSrc);
				$(".select_option_temp").remove();
            });
        };
        return function () {
            initSetRadioData();
            initRadioClick();
        };
    });
});





