RTU.DEFINE(function (require, exports) {
/**
 * 模块名：运行曲线--query
 * name：trainrunningcurve
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/locomotivequery/trainrunningcurve.css");
    require("../../../css/app/app-query-move.css");

    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("draw/DrawLine/DrawLine.css");
    require("draw/DrawLine/DrawLine.js");
    require("app/loading/list-loading.js");
    require("RTTree/RTTree.js");
    require("RTTree/RTTree.css");
    require("../../../css/app/moveCurve/moveCurve.css");
    require("app/curve/moveCurve/moveCurveHistroy.js");

    var curve_tree = null;
    var autoRefreshCurve = null; //用于页面树形列表5秒自动刷新

    // 位置用于循环显示
    var localTopLeft = [{ top: 60, left: 380, isShowP: true }, { top: 60, left: 900, isShowP: false }, { top: 500, left: 380, isShowP: false }, { top: 500, left: 900, isShowP: false}];
    localTopLeft.reset = function () {
        for (var i = 0; i < localTopLeft.length; i++) {
            if (i == 0) {
                localTopLeft[i].isShowP = true;
            }
            else {
                localTopLeft[i].isShowP = false;
            }

        }
    };
    localTopLeft.next = function () {
        var showIndex = localTopLeft.getNowShowIndex();
        for (var i = 0; i < localTopLeft.length; i++) {
            localTopLeft[i].isShowP = false;
        }
        localTopLeft[showIndex].isShowP = false;
        if (showIndex == localTopLeft.length - 1) {
            showIndex = -1;
        }
        localTopLeft[showIndex + 1].isShowP = true;
        return localTopLeft[showIndex + 1];

    };
    localTopLeft.prev = function (index) {
        var showIndex = localTopLeft.getNowShowIndex();
        if (index == 0) {
            showIndex = 4;
        }
        else {
            showIndex = index;
        }
        for (var i = 0; i < localTopLeft.length; i++) {
            localTopLeft[i].isShowP = false;
        }
        var id = showIndex - 1;
        if (id < 0) {
            id = 0;
        }
        localTopLeft[id].isShowP = true;
    };
    localTopLeft.getNowShowIndex = function () {
        for (var i = 0; i < localTopLeft.length; i++) {
            if (localTopLeft[i].isShowP == true)
                return i;
        }
    };
    localTopLeft.getLTobj = function () {
        var nowIndex = localTopLeft.getNowShowIndex();
        var item = localTopLeft[nowIndex];
        localTopLeft.next();
        return item;
    };

    var win_curve = null; //左侧弹出窗口
    var winObj = {}; //曲线窗口

    //加载数据并初始化窗口和事件
    RTU.register("app.locomotivequery.trainrunningcurve.loadHtml", function () {
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
    //查询窗口
    RTU.register("app.trainrunningcurve.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            RTU.invoke("map.show");
            //查询窗口
            RTU.invoke("app.locomotivequery.trainrunningcurve.loadHtml", { url: "../app/modules/locomotivequery/trainrunningcurve.html", fn: function (html) {
                if (!win_curve) {
                    win_curve = new PopuWnd({
                        title: "运行曲线",
                        html: html,
                        width: 240,
                        height: 440,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    win_curve.remove = win_curve.close;
                    win_curve.close = win_curve.hidden;
                    win_curve.init();
                    
                    win_curve.$wnd.find(".popuwnd-title-del-btn").click(function () {
                    	 psModel.cancelScribe("refreshData", window.trainrunningcureRefresh);
                    });

                    $("#curve_contain .curve_search").unbind("click").click(function () {
                        psModel.searchNow({ token: window.trainrunningcureRefresh });
                    });
                    $("#curve_contain .curve_clear").unbind("click").click(function () {
                        $(".carName").val("");
                        $(".carValue").val("");
                    });

                    $("#curve_contain .carName").inputTip({ text: "" }).parent().css({ "float": "left" });
                    $("#curve_contain .carValue").inputTip({ text: "" }).parent().css({ "float": "left" });

                    var htmlcurve = "";
                    RTU.invoke("core.router.load", {
                        url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move3.html",
                        success: function (html) {
                            htmlcurve = html;
                        }
                    });
                    psModel.cancelScribe("refreshData", window.trainrunningcureRefresh);
                    window.trainrunningcureRefresh = psModel.subscribe("refreshData", function (t, data) {
                    	if (!curve_tree) {
                            curve_tree = new RTTree({
                                datas: data,
                                parentColName: "locoTypeName",
                                selectType: "checkbox",
                                containId: "curve_tree",
                                IdColName: "locoNo",
                                treeWidth: "235",
                                treeHeight: "300",
                                treeHead: ["机车", "车次", "局段"],
                                treeModel: [{ name: "locoNo", width: "40px" }, { name: "checiName", width: "30px" }, { name: "dshortname", width: "30px"}],
                                replaceTd: [{ colName: "locoNo", fn: function (colValue, td, d) {
                                	if (d.locoAb !="1"&&d.locoAb!="2") {
                                		colValue= d.locoNo;
                                    } else if (d.locoAb == "1") {
                                    	colValue= d.locoNo + window.locoAb_A;
                                    } else {
                                    	colValue= d.locoNo + window.locoAb_B;
                                    }
                                    if (d.isOnline == 1 || d.isOnline == 2) {
                                        return "<img src='../static/img/app/online_pic_20_20.png'  style='width=16px;height:16px;vertical-align: middle;' />" + colValue;
                                    } else {
                                        return "<img src='  ../static/img/app/outline_pic_20_20.png'  style='width=16px;height:16px;vertical-align: middle;' />" + colValue;
                                    }
                                }}],
                                trClick: function (tr, data) {
                                    for (var i in winObj) {
                                        if (winObj && winObj[i]) {
                                            winObj[i].close();
                                            winObj[i] = null;
                                        }
                                    }
                                    localTopLeft.reset();
                                    var item_w = localTopLeft.getLTobj();
                                    var MoveCurveObj =data.lkjType!=1?
                                    new MoveCurve({ locoTypeid: data.locoTypeid, locoNo: data.locoNo,locoAb:data.locoAb,checiName:data.checiName,isOnline:data.isOnline,isMaxMin:false,  
                                    	top: item_w.top, left: item_w.left, itemData: { name: data.checiName+"(" + data.locoTypeName + "-" + data.locoNo + ")" },
                                    	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move2.html", 
                                    	dataUrl: '../onlineloco/searchMoveLineByProperty?str=[{"locoTypeid":"' + data.locoTypeid + '","locoNo":"' 
                                    	+ data.locoNO + '","locoAb":"' + data.locoAb + '"}]' })
                                    :new MoveCurve15({ locoTypeid: data.locoTypeid, locoNo: data.locoNo,locoAb:data.locoAb,checiName:data.checiName,isOnline:data.isOnline,isMaxMin:false,
                                    	top: item_w.top, left: item_w.left, itemData: { name: data.checiName+"(" + data.locoTypeName + "-" + data.locoNo + ")" },
                                    	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move15.html", 
                                    	dataUrl: '../onlineloco15/searchMoveLine15ByProperty?str=[{"locoTypeid":"' + data.locoTypeid + '","locoNo":"' 
                                    	+ data.locoNO + '","locoAb":"' + data.locoAb + '"}]' });

                                    winObj["id" + data.locoNo] = MoveCurveObj.returnWin();
                                    winObj["id" + data.locoNo].timerCount = MoveCurveObj.timerCount;
                                    winObj["id" + data.locoNo].MoveCurveObj = MoveCurveObj;
                                    winObj["id" + data.locoNo].$wnd.find(".popuwnd-title-del-btn").click({ locoNo: data.locoNo }, function (e) {
                                        for (var i = 0; i < curve_tree.tableTrs.length; i++) {
                                            if (curve_tree.tableTrs[i].children[0].innerHTML.indexOf(e.data.locoNo) != -1) {
                                                curve_tree.selectTypes[i].checked = false;
                                                curve_tree.selectTrsTD[i] = "";
                                                $(curve_tree.tableTrs[i]).removeClass("RTTree_clickTr");
                                                curve_tree.clickTrID = "";
                                                if (winObj["id" + data.locoNo])
                                                    winObj["id" + data.locoNo].close();
                                                winObj["id" + data.locoNo] = null;
                                                break;
                                            }
                                        }
                                        return false;
                                    });
                                },
                                enCheckFn: function (d) {
                                    if (winObj["id" + d.locoNo]) {
                                        winObj["id" + d.locoNo].$wnd.find(".popuwnd-title-del-btn").trigger('click');
                                        if (winObj["id" + d.locoNo])
                                            winObj["id" + d.locoNo].close();
                                        winObj["id" + d.locoNo] = null;
                                    }
                                    var tag = false;
                                    for (var j = 0; j < curve_tree.selectTrsTD.length; j++) {
                                        if (curve_tree.selectTrsTD[j]) {
                                            tag = true;
                                            break;
                                        }
                                    }
                                    if (!tag) {
                                        curve_tree.clickTrID = "";
                                        for (var i = 0; i < curve_tree.tableTrs.length; i++) {
                                            $(curve_tree.tableTrs[i]).removeClass("RTTree_clickTr");
                                            curve_tree.selectTypes[i].checked = false;
                                            curve_tree.selectTrsTD[i] = "";
                                        }
                                    }
                                },
                                selectInputFn: function (data, datas) {
                                    if (datas.length == 1) {
                                        localTopLeft.reset();
                                    }
                                    var item_w = localTopLeft.getLTobj();
                                    for (var i = 0; i < datas.length; i++) {
                                        (function () {
                                            var data = datas[i];
                                            if (!winObj["id" + data.locoNo]) {
                                                var MoveCurveObj =data.lkjType!=1?
                                                        new MoveCurve({ locoTypeid: data.locoTypeid, locoNo: data.locoNo,locoAb:data.locoAb,checiName:data.checiName,isOnline:data.isOnline,isMaxMin:false, 
                                                        	top: item_w.top, left: item_w.left, itemData: { name: data.checiName+"(" + data.locoTypeName + "-" + data.locoNo + ")" },
                                                        	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move2.html", 
                                                        	dataUrl: '../onlineloco/searchMoveLineByProperty?str=[{"locoTypeid":"' + data.locoTypeid + '","locoNo":"' 
                                                        	+ data.locoNO + '","locoAb":"' + data.locoAb + '"}]' })
                                                        :new MoveCurve15({ locoTypeid: data.locoTypeid, locoNo: data.locoNo,locoAb:data.locoAb,checiName:data.checiName,isOnline:data.isOnline,isMaxMin:false, 
                                                        	top: item_w.top, left: item_w.left, itemData: { name: data.checiName+"(" + data.locoTypeName + "-" + data.locoNo + ")" },
                                                        	htmlUrl: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move15.html", 
                                                        	dataUrl: '../onlineloco15/searchMoveLine15ByProperty?str=[{"locoTypeid":"' + data.locoTypeid + '","locoNo":"' 
                                                        	+ data.locoNO + '","locoAb":"' + data.locoAb + '"}]' });
                                                winObj["id" + data.locoNo] = MoveCurveObj.returnWin();
                                                winObj["id" + data.locoNo].timerCount = MoveCurveObj.timerCount;
                                                winObj["id" + data.locoNo].MoveCurveObj = MoveCurveObj;
                                                winObj["id" + data.locoNo].$wnd.find(".popuwnd-title-del-btn").click({ locoNo: data.locoNo }, function (e) {
                                                    for (var i = 0; i < curve_tree.tableTrs.length; i++) {
                                                        if (curve_tree.tableTrs[i].children[0].innerHTML.indexOf(e.data.locoNo) != -1) {
                                                            curve_tree.selectTypes[i].checked = false;
                                                            curve_tree.selectTrsTD[i] = "";
                                                            if (winObj["id" + data.locoNo])
                                                                winObj["id" + data.locoNo].close();
                                                            $(curve_tree.tableTrs[i]).removeClass("RTTree_clickTr");
                                                            winObj["id" + data.locoNo] = null;
                                                            break;
                                                        }
                                                    }
                                                    return false;
                                                });
                                            }
                                        })(i);
                                    }
                                }
                            });
                        } else {
                            curve_tree.refresh(data);
                        }
                    }, function () {
                        return [{ name: "locoNo", value: $(".carName").val() }, { name: "checiName", value: $(".carValue").val()}];
                    });
                    psModel.searchNow({ token: window.trainrunningcureRefresh });
                }
                else {
                    win_curve.init();
                }
                if (autoRefreshCurve) {
                    clearInterval(autoRefreshCurve); //清除5秒刷新
                }
                return win_curve;
            }, initEvent: function () { //初始化事件
            }
            });
        };
    });
    //加载运行曲线
    RTU.register("app.locomotivequery.trainrunningcurve.loadCurve", function () {
        return function () {
            RTU.invoke("core.router.load", {
                url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-move3.html",
                success: function (html) {
                    new PopuWnd({
                        title: "列车警报状态详情",
                        html: html,
                        width: 507,
                        height: 398,
                        left: 70,
                        top: 60,
                        shadow: true
                    }).init();
                }
            });
        };
    });
    function tagNull() {
        var tag = false;
        for (var n in winObj) {
            if (winObj[n]) {
                tag = true;
                break;
            }
        }
        if (!tag) {
            localTopLeft.reset();
        }
    }
    RTU.register("app.trainrunningcurve.query.init", function () {
        var data = RTU.invoke("app.setting.data", "trainrunningcurve");
        if (data && data.isActive) {
            RTU.invoke("app.trainrunningcurve.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.trainrunningcurve.query.deactivate", function () {
        return function () {
            if (win_curve) {
                win_curve.close();
            }
            if (winObj) {
                for (var n in winObj) {
                    winObj[n].close();
                    winObj[n] = undefined;
                }
            }
            if (autoRefreshCurve) {
                clearInterval(autoRefreshCurve); //清除5秒刷新
            }
            
            psModel.cancelScribe("refreshData", window.trainrunningcureRefresh);
        };
    });

});
