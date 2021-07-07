RTU.DEFINE(function (require, exports) {
/**
 * 模块名：机车右键
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("app/realtimelocomotivequery/app-realtimelocomotivequery-move.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.js");
//    require("app/faultalarmsubsidiary/app-trainalarmstateparticulars-query.js");
    require("app/curve/moveCurve/moveCurve.js");
    require("../../../css/app/app-search.css");

    var $html;
    var popuwnd;
    // 运行曲线
    // var $movehtml
    var movewnd;
    // 机车信息
    var trainwnd;
    var resultwnd;
    // 列表曲线窗体，数组
    var mutimovewnd = [];
    var infowndwidth = 500;
    var infowndheight = 100;
    var offset;
    var data;
    var timer;
//
//    var timerLock = false;
//    RTU.register("app.realtimelocomotivequery.query.initTimer", function () {
//        function tip() {
//            // 刷屏
//            // 获取列表所有id
//            var ids = RTU.invoke("app.realtimelocomotivequery.query.getResultLoco");
//            RTU.invoke("app.realtimelocomotivequery.query.findByLoco", ids);
//        }
//        return function () {
//            if (!timer) {
//                tip();
//                timer = window.setInterval(tip, 5000);
//            }
//            return true;
//        };
//    });
//    RTU.register("app.realtimelocomotivequery.query.stopTimer", function () {
//        return function () {
//            if (time) {
//                window.clearInterval(timer);
//            }
//        };
//    });
//    RTU.register("app.realtimelocomotivequery.query.findByLoco", function () {
//        return function (ids) {
//        	alert(123);
//            var idsStr = '[';
//            for (var i = 0; i < ids.length; i++) {
//                var idStr = "";
//                if (i != 0) {
//                    idStr = ",";
//                }
//                idStr += '{"locoTypeid":"' + ids[i].locoTypeName + '" ,"locoNo":"' + ids[i].locoNo + '"}';
//                idsStr += idStr;
//            }
//            idsStr += "]";
//            var url = "onlineloco/searchLocoInByProperty";
//            var param = {
//                url: url,
//                data: {
//                    "str": idsStr
//                },
//                cache: false,
//                datatype: "json",
//                success: function (data) {
//                    $.each(data.data, function (i, n) {
//                        n.locoTypeStr = n.locoTypeName + "-" + n.locoNO;
//                        n.pointTypeUrl = RTU.invoke("app.realtimelocomotivequery.query.changetrainStr", n);
//                    });
//                    var d = {
//                        p: false,
//                        data: data.data
//                    };
//                    RTU.invoke("app.realtimelocomotivequery.query.AddOrUpdateMarker", d);
//                }
//            };
//            RTU.invoke("core.router.post", param);
//        };
//    });
//
//    RTU.register("app.realtimelocomotivequery.query.getResultLoco", function () {
//        return function () {
//            var items = $(".rt_result_tab.mytab_body tbody tr td.locoTypeStr");
//            var ids = [];
//            for (var i = 0; i < items.length; i++) {
//                ids[ids.length] = RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $(items[i]).html());
//            }
//
//            return ids;
//        };
//    });
//    RTU.register("app.realtimelocomotivequery.query.AddOrUpdateMarker", function () {
//        return function (data) {
//            var $status;
//            RTU.invoke("core.router.load", {
//                url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-trainalarm.html",
//                async: false,
//                success: function (status) {
//                    $status = $(status);
//                }
//            });
//            if (data.p != true) {
//                data.p = false;
//            }
//
//         
//                 RTU.invoke("map.marker.addAndUpDateMarkers", {
//                     pointId: "locoTypeStr",
//                     pointDatas: data.data,
//                     TIPSID: "locoTypeStr",
//                     tabHtml: $status.html(),
//                     pointType: "pointTypeUrl",
//                     isSetCenter: data.p,
//                     setDataSeft: false,
//                     tabWidth: 418, //tab 宽度
//                     tabHeight: 330, //tab 的高度
//                     initFn: function (obj) {
//                     	RTU.invoke("app.realtimelocomotivequery.trainalarm.activate",obj);
//                     	$("#" + obj.tabId + " .bundefined").unbind("click").click(function () {
//                             RTU.invoke("app.realtimelocomotivequery.query.initInfoWnd",obj);
//                         })
//                         RTU.invoke("map.setCenter",{lng:obj.longitude,lat:obj.latitude});
//                     },
//                     rightHand: function (obj) {
//                    	 alert(2);
//                         RTU.invoke("app.realtimelocomotivequery.rightHtml.init", obj);
//                     }
//                 }); 
//           
//        }
//    });
//    // 初始化列车报警窗口
//    RTU.register("app.realtimelocomotivequery.query.initInfoWnd", function () {
//        // data 包括机车信息与设备信息data.traininfo data.equipinfo
//        var item = function (data) {
//            var inittrainalarm = function (info) {
//                var h = function ($h,info) {
//                    trainwnd = new PopuWnd({
//                        title: "列车警报状态详情-" + info.itemData.checiName + "(" + info.itemData.locoTypeStr + ")",
//                        html: $h,
//                        width: 900,
//                        height: 580,
//                        left: 70,
//                        top: 60,
//                        shadow: true
//                    });
//                    trainwnd.init();
//                    RTU.invoke("app.failurewarning.trainalarm.init");
//                };
//                loadHtml("../app/modules/app-trainalarmstateparticulars-query.html", h, data);
//            },
//            // url 请求路径 $h缓存的html f回调函数
//			loadHtml = function (url, f,info) {
//			    RTU.invoke("core.router.load", {
//			        url: url,
//			        success: function (html) {
//			            // $h = $(html);
//			            try {
//			                var $h = $(html);
//			                f($h,info);
//
//			            } catch (e) {
//			            	
//			            }
//
//			        }
//			    });
//			};
//            inittrainalarm();
//        };
//        return function (obj) {
//            item(obj);
//        };
//    });
    var wndMoveCurve=null;
    // 创建多个运行曲线窗口
    RTU.register("app.publicRealtimelocomotivequery.query.initmutimove", function () {
        var wndBuilder = function (datas) {
            // url 请求路径 $h缓存的html f回调函数
            var loadHtml = function (url, f) {
                RTU.invoke("core.router.load", {
                    url: url,
                    async: false,
                    success: function (html) {
                        // $h = $(html);
                        try {
                            var $h = $(html);
                            f($h);
                        } catch (e) {
                        }

                    }
                });
            };
            var countid = 0;
           
            var initmove = function (info, top, left) {
                var f = function ($h) {
                    countid++;
                    $h = $("<div id = 'HtmlId" + countid + "'>" + $h.html() + "</div>");
                    var newmovewnd = new PopuWnd({
                        title: "运行曲线-" + info.name,
                        html: $h,
                        width: 507,
                        height: 398,
                        left: left,
                        top: top,
                        shadow: true
                    });
                    newmovewnd.init();
                    RTU.invoke("app.realtimelocomotivequery.move.init", {
                        htmlId: "HtmlId" + countid
                    });
                    mutimovewnd[mutimovewnd.length] = newmovewnd;
                };
                wndMoveCurve = info.data.lkjType!=1?new MoveCurve({ locoTypeid:info.data.locoTypeid,locoNo:info.data.locoNO,locoAb:info.data.locoAb,top: 60, left: 1, itemData: info,
                	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move2.html", 
                	dataUrl: '../onlineloco/searchMoveLineByProperty?str=[{"locoTypeid":"' + info.data.locoTypeid + '","locoNo":"' + info.data.locoNO 
                	+ '","locoAb":"'+info.data.locoAb+'"}]' })
                :new MoveCurve15({ locoTypeid:info.data.locoTypeid,locoNo:info.data.locoNO,locoAb:info.data.locoAb,top: top, left: left, itemData: info,
                	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move15.html", 
                	dataUrl: '../onlineloco15/searchMoveLine15ByProperty?str=[{"locoTypeid":"' + info.data.locoTypeid + '","locoNo":"' + info.data.locoNO 
                	+ '","locoAb":'+info.data.locoAb+'"}]'});
            };
            var clearmoves = function () {
                for (var i = 0; i < (mutimovewnd.length || 0); i++) {
                    try {
                        mutimovewnd[i].close();
                    } catch (e) {
                    }
                }
                mutimovewnd = [];
            };
            clearmoves();
            j = 1;
            for (var i = 0; i < (datas.length || 0); i++) {
                var top;
                var left;
                if (j == 2) {
                    top = 90;
                    left = ($(window).width() / 2 + 20);
                } else if (j == 3) {
                    top = 520;
                    left = ($(window).width() / 2 - infowndwidth - 20);
                } else if (j == 4) {
                    top = 520;
                    left = ($(window).width() / 2 + 20);
                    j = 0;
                } else {
                    top = 90;
                    left = ($(window).width() / 2 - infowndwidth - 20);
                }
                j++;
                initmove(datas[i], top, left);
            }
        };
        return function (datas) {
            wndBuilder(datas);
        };
    });
//
//    RTU.register("app.realtimelocomotivequery.query.initResultWnd", function () {
//        var tableBuilder = function (info) {
//            if (!info) {
//                return;
//            }
//            var titles = info.titles;
//            var data = info.data;
//            $(".rt_result_tab").html("");
//            $(".mytab_head").append("<thead><tr></tr></thead>");
//            $(".mytab_body").append("<tbody></tbody>");
//            for (var i = 0; i < titles.length; i++) {
//                var name = titles[i].name;
//                var width = (titles[i].width || "30px");
//                var text = titles[i].value;
//                if (!titles[i].isCheckBox) {
//                    $(".mytab_head thead tr").append("<td class = '"
//																	+ name
//																	+ "' id = '"
//																	+ name
//																	+ "' style = 'width:"
//																	+ width
//																	+ "' ><div>"
//																	+ text
//																	+ "</div></td>");
//                } else {
//                    $(".mytab_head thead tr").append(
//													"<td style = 'width:"
//															+ width
//															+ "'>&nbsp;</td>");
//                }
//            }
//            for (var i = 0; i < data.length; i++) {
//                var lineStr = "<tr>";
//
//                for (var j = 0; j < titles.length; j++) {
//                    var name = titles[j].name;
//
//                    var width = (titles[j].width || "30px");
//
//                    if (!titles[j].isCheckBox) {
//                        lineStr += "<td class = '"
//														+ name
//														+ "' style = 'width:"
//														+ width + "'>"
//														+ data[i][name]
//														+ "</td>";
//                    } else {
//                        var value = titles[j].value;
//                        var isChe = "";
//
//                        if (value == true) {
//                            isChe = "checked";
//                        }
//                        lineStr += "<td class = '"
//														+ name
//														+ "' style = 'width:"
//														+ width
//														+ "'><input type='checkbox' class = 'checkItem "
//														+ name + "' " + isChe
//														+ "/></td>";
//                    }
//                }
//                lineStr += "</tr>";
//                $(".rt_result_tab.mytab_body tbody")
//												.append(lineStr);
//            }
//            var w = $(".mytab_body tbody tr").width();
//            if (w > 0) {
//                w += 1;
//                $(".mytab_head").css("width", w + "px");
//            }
//            $(".rt_result_tab tbody tr:odd").addClass(
//											"rtgreen");
//            $(".rt_result_tab tbody tr").click(function (e) {
//                try {
//                    var _checkbox = $("input[type='checkbox']", $(this));
//                    var isCheck = _checkbox.hasClass("checked");
//                    if (!isCheck) {
//                        _checkbox.attr("checked", "checked");
//                        _checkbox.addClass("checked");
//                        var id = $(".locoTypeStr", $(this)).html();
//                        // RTU.invoke("map.marker.findMarkers",
//                        // { pointId:
//                        // id, stopTime:
//                        // 5000 });
//                        RTU.invoke("map.marker.findMarkers", {
//                            pointId: id,
//                            isSetCenter: true,
//                            stopTime: 5000,
//                            fnCallBack: function () {
//                            }
//                        });
//                    } else {
//                        _checkbox.removeAttr("checked");
//                        _checkbox.removeClass("checked");
//                    }
//                } catch (e) {
//                }
//            });
//        };
//        return function (info) {
//            tableBuilder(info);
//        };
//    });
//    RTU.register("app.realtimelocomotivequery.query.initResult", function () {
//        return function () {
//            if ($(".rt_tab_div").length == 0) {
////                $(".rt_result_div").append('<div class="rt_tab_div"><div class = "myTable_head my_tab"><table class="rt_result_tab mytab_head"> </table></div><div class = "myTable_body my_tab"><table class="rt_result_tab mytab_body"></table></div></div>');
//            	$(".rt_rstabDiv").append('<div class="rt_tab_div"><div class = "myTable_head my_tab"><table class="rt_result_tab mytab_head"> </table></div><div class = "myTable_body my_tab"><table class="rt_result_tab mytab_body"></table></div></div>');
//            	// 新建table
//                var info = {
//                    titles: [{ name: "id", isCheckBox: true, value: false, width: "4%" },
//                            { name: "checiName", width: "10%", value: "车次" },
//                            { name: "locoTypeStr", width: "15%", value: "机车" },
//                            { name: "depotName", width: "17%", value: "所属局段" },
//                            { name: "lineName", width: "10%", value: "位置线" },
//                            { name: "kiloSign", width: "12%", value: "里程" },
//                            { name: "speed", width: "7%", value: "实速" },
//                            { name: "limitSpeed", width: "7%", value: "限速" },
//                            { name: "receiveTime", width: "17%", value: "接收时间"}],
//                    data: []
//                };
//                RTU.invoke("app.realtimelocomotivequery.query.initResultWnd", info);
//            }
//        };
//    });
//    RTU.register("app.realtimelocomotivequery.query.loading", function () {
//        var tableloading = function (object, isShow) {
//            if (isShow) {
//                var loadingdiv = object.siblings("div.div_loading");
//                if ((!loadingdiv)
//												|| loadingdiv.length == 0) {
//                    var fatherdiv = object.parent();
//                    if (fatherdiv)
//                        fatherdiv.append("<div class = 'div_loading'><div class='tab_loading'> <img src='../static/img/app/loading.gif' /></div></div>");
//                } else {
//                    loadingdiv.removeClass("hidden");
//                }
//            } else {
//                var loadingdiv = object.siblings("div.div_loading");
//                loadingdiv.addClass("hidden");
//            }
//        };
//        return function (item) {
//            tableloading(item.object, item.isShow);
//        };
//    });
    RTU.register("app.publicRealtimelocomotivequery.query.closeAllWnd", function () {
        return function () {
            for (var i = 0; i < mutimovewnd.length; i++) {
                try {
                    mutimovewnd[i].close();
                } catch (e) {

                }
            }
            mutimovewnd = [];
        };
    });
//    // 拆分机车字符串
//    RTU.register("app.realtimelocomotivequery.query.splitlocoNo", function () {
//        return function (locoTypeStr) {
//            var locoTypeName = "";
//            var locoNo = "";
//            if (locoTypeStr == "") {
//                return {
//                    locoTypeName: "",
//                    locoNo: ""
//                };
//            }
//            var str = locoTypeStr.split('-');
//            if (str.length == 2) {
//                locoTypeName = str[0];
//                locoNo = str[1];
//            } else if (str.length > 2) {
//                locoTypeName += str[0];
//                for (var i = 1; i < str.length - 1; i++) {
//                    locoTypeName += ("-" + str[i]);
//                }
//
//                locoNo = str[str.length - 1];
//            } else if (str.length < 2) {
//                // var p = locoTypeStr.match("\\d");
//                // //验证是否数字开头
//                // if (p != null) {
//                // locoNo = locoTypeStr;
//                // }
//                // else {
//                locoTypeName = locoTypeStr;
//                // }
//            }
//            return {
//                locoTypeName: locoTypeName,
//                locoNo: locoNo
//            };
//        };
//    });
//
//    RTU.register("app.realtimelocomotivequery.query.changetrainStr", function () {
//        return function (obj) {
//            var str = "";
//            if (obj.trainType == "1") {
//                str = "huoche";
//            } else if (obj.trainType == "2") {
//                str = "keche";
//            } else if (obj.trainType == "3") {
//                str = "highRail";
//            } else if (obj.trainType == "4") {
//                str = "dongche";
//            } else if (obj.trainType == "5") {
//                str = "keche";
//            }
//            if (obj.isAlarm == "1") {
//                str += "Alert";
//            }
//            if (obj.isOnline == "0") {
//                str += "Offline";
//            }
//            else {
//                str += "Online";
//            }
//            return str;
//        };
//    });
//
});
