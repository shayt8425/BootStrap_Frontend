RTU.DEFINE(function (require, exports) {
/**
 * 模块名：参数设置
 * name：systemparamsSetting
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    var $html;
    var popuwnd;
    var data;
    var cData;
    var mIsSave = false;
    /************************************************
    * 加载参数设置页面的Html
    ***********************************************/
    RTU.register("app.systemparamsSetting.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/systemsetting/app-systemparamsSetting-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    //RTU.invoke("app.systemparamsSetting.query.create", $html);
                }
                RTU.invoke("app.systemparamsSetting.query.domInit");
                RTU.invoke("app.systemsetting.query.alarm.levelSet.init");
            }
        });
        return function () {
            return true;
        };
    });
    /************************************************
    * 加载参数设置窗口
    ***********************************************/
    RTU.register("app.systemparamsSetting.query.activate", function () {
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
                    left: 115,
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
    /************************************************
    * 关闭参数设置窗口
    ***********************************************/
    RTU.register("app.systemparamsSetting.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    /************************************************
    * 验证具备参数设置权限
    ***********************************************/
    RTU.register("app.systemparamsSetting.query.init", function () {
        data = RTU.invoke("app.setting.data", "systemparamsSetting");
        if (data && data.isActive) {
            RTU.invoke("app.systemparamsSetting.query.activate");
        }
        return function () {
            return true;
        };
    });
    /************************************************
    * 数据初始化
    ***********************************************/
    RTU.register("app.systemparamsSetting.query.domInit", function () {
        /////数据加载
        var dataInit = function (options, selector) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=-1&options=" + options + "&type=1",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    var data = data.data;
                    if (selector == "ftp_path") {
                        if (data.optionvalue != "") {
                            var array = data.optionvalue.split('|');
                            $(".ip_input").val(array[0]);
                            $(".port_input").val(array[1]);
                            $(".userName_input").val(array[2]);
                            $(".password_input").val(array[3]);
                        }
                    }
                    else {
                        $(selector).val(data.optionvalue);
                    }
                }
            });
        };
        /////数据保存
        var save = function (options, optionvalue) {
            $.ajax({
                url: "../syssetting/updateObjByProperty?userid=-1&options=" + options + "&optionvalue=" + optionvalue + "&type=1",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    //alert("设置成功!");
                }
            });
        };
        ////////初始化数据
        var initData = function () {
            //ftp路径
            this.ftpPathDataInit = function () {
                dataInit("FTPPath", "ftp_path");
            };
            //数据Refresh时间间隔
            this.dataRefreshTimeInit = function () {
                dataInit("RefreshData", ".data_reflesh");
            };
            //机车离线时间
            this.isOnlineMinutesInit = function () {
                dataInit("IsOnlineMinutes", ".train_outline");
            };
            //列车间距追踪
            this.trackPitchDistanceInit = function () {
            	dataInit("TrackPitchDistance", ".train_trackPitch");
            };
            this.init = function () {
                this.ftpPathDataInit();
                this.dataRefreshTimeInit();
                this.isOnlineMinutesInit();
                this.trackPitchDistanceInit();
            };
            this.init();
        };
        /////////保存事件
        var initSave = function () {
            ///////ftp保存事件
            this.ftpPathSave = function () {
                $(".ip_input").blur(function () {
                    var value = $(".ip_input").val() + "|" + $(".port_input").val() + "|" + $(".userName_input").val() + "|" + $(".password_input").val();
                    save("FTPPath", value);
                });
                $(".port_input").blur(function () {
                    var value = $(".ip_input").val() + "|" + $(".port_input").val() + "|" + $(".userName_input").val() + "|" + $(".password_input").val();
                    save("FTPPath", value);
                });
                $(".userName_input").blur(function () {
                    var value = $(".ip_input").val() + "|" + $(".port_input").val() + "|" + $(".userName_input").val() + "|" + $(".password_input").val();
                    save("FTPPath", value);
                });
                $(".password_input").blur(function () {
                    var value = $(".ip_input").val() + "|" + $(".port_input").val() + "|" + $(".userName_input").val() + "|" + $(".password_input").val();
                    save("FTPPath", value);
                });
            };
            ////////数据Refresh时间间隔 保存
            this.dataRefreshTimeSave = function () {
                $(".data_reflesh").blur(function () {
                    save("RefreshData", $(this).val());
                });
            };
            //////机车离线时间  保存
            this.isOnlineMinutesSave = function () {
                $(".train_outline").blur(function () {
                    save("IsOnlineMinutes", $(this).val());
                });
            };
            //////列车间距追踪  保存
            this.trackPitchDistanceSave = function () {
            	$(".train_trackPitch").blur(function () {
            		save("TrackPitchDistance", $(this).val());
            	});
            };
            this.init = function () {
                this.ftpPathSave();
                this.dataRefreshTimeSave();
                this.isOnlineMinutesSave();
                this.trackPitchDistanceSave();
            };
            this.init();
        };
        return function () {
            initData();
            initSave();
        };
    });

    var $buildItemAlarm = function (data) {
        this.$item = $(".alarm-level-block");
        this.$item.find(".content-block-body-row").attr("id", data.recId);
        this.$item.find(".content-block-label").html(data.alarmName + "：");
        this.$item.find(".level-select option").attr("selected", false);
        this.$item.find(".level-select option[value='" + data.alarmLevel + "']").attr("selected", true);
        return $(this.$item.html());
    };

    //报警等级配置
    RTU.register("app.systemsetting.query.alarm.levelSet.init", function () {
        //////////通用获取数据Ajax加载
        var getData = function (options, selector) {
            $(".alarm-level-list").empty();
            var param = {
                url: "alarmcode/findAll",
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.data;
                    for (var i = 0; i < d.length; i++) {
                        $(".alarm-level-list").append(new $buildItemAlarm(d[i]));
                    }
                }
            };
            RTU.invoke("core.router.get", param);
        };
        //////数据初始化
        var dataIni = function () {
            ////tips
            this.tipsInit = function () {
                getData("alarmName", ".alarmName_showSet");
            };
            this.init = function () {
                this.tipsInit();
            };
            this.init();
        };
        //报警等级配置
        var alarmLevelInit = function () {
            this.setbtn = function () {
                $(".alarmLevel-setBtn").click(function () {
                    $(".alarm-div").removeClass("hidden");
                    $(".conver-div").removeClass("hidden");
                });
            };
            this.finishBtn = function () {
                $("#alarm-level-finish-btn").click(function () {
                    RTU.invoke("app.systemparamsSetting.alarmLevel.save");
                });
            };
            this.closeBtn = function () {
                $(".setting-closeImg-btn").click(function () {
                    $(".alarm-div").addClass("hidden");
                    $(".detail-info-div").addClass("hidden");
                    $(".conver-div").addClass("hidden");
                });
            };
            this.init = function () {
                this.setbtn();
                this.finishBtn();
                this.closeBtn();
            };
            this.init();
        };
        return function () {
            dataIni();
            alarmLevelInit();
        };
    });
    ///////////数据保存
    RTU.register("app.systemparamsSetting.alarmLevel.save", function () {
        return function () {
            var jsonStr = "[";

            $(".alarm-level-list").find(".content-block-body-row").each(function () {
                var id = $(this).attr("id");
                var level = $(this).find(".level-select").val();
                jsonStr += ("{\"recId\":\"" + id + "\",\"alarmLevel\":\"" + level + "\"},");
            });

            jsonStr = jsonStr.substring(0, jsonStr.length - 1);
            jsonStr += "]";

            var param = {
                url: "alarmcode/updateObjBatch?jsonStr=" + jsonStr,
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.success;
                    if (d) {
                        //	   				 		alert("保存成功!");
                        RTU.invoke("header.alarmMsg.show", "保存成功!");
                        $(".alarm-div").addClass("hidden");
                        $(".conver-div").addClass("hidden");
                    } else {
                        //	   				 		alert("保存失败!");
                        RTU.invoke("header.alarmMsg.show", "保存失败!");
                    }
                }
            };
            RTU.invoke("core.router.post", param);
        };
    });
});
