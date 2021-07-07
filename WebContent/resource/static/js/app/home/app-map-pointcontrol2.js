RTU.DEFINE(function (require, exports) {
/**
 * 模块名：暂时没有使用
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("app/home/app-map.js");

    Function.prototype.method = function (name, fn) {//方法的扩展
        this.prototype[name] = fn;
        return this;
    };
    Function.inherit = function (parentClass) {//方法的继承
        this.prototype = new parentClass();
        return this;
    };
    Function.extend = function (parentClass) {//方法的扩展
        var F = function () { };
        F.prototype = parentClass.prototype;
        var subclass = this.prototype.constructor;
        this.prototype = new F();
        this.prototype.constructor = subclass;
    };
    var Interface = function (name, methods) {//接口的定义
        if (arguments.length != 2) {
            throw new Error("参数个数不正确！");
        }
        this.name = name;
        this.methods = [];
        for (var i = 0, len = methods.length; i < len; i++) {

            if (typeof methods[i] != "string") {
                throw new Error("方法名称类型不对！");
            }
            this.methods.push(methods[i]);
        }
    };
    Interface.checkImplements = function (object) {//接口检查函数
        if (arguments.length < 2) {
            throw new Error("参数个数不正确！");
        }
        for (var i = 1, len = arguments.length; i < len; i++) {
            var inf = arguments[i];
            if (inf.constructor !== Interface) {
                throw new Error("参数不是接口类型！");
            }
            for (var j = 0; j < inf.methods.length; j++) {
                var method = inf.methods[j];
                if (!object[method] || typeof object[method] != 'function') {
                    throw new Error("没有实现接口" + inf.name + " 的" + method + " 方法 ");
                }
            }
        }
    };

    var Ipoint = new Interface("Ipoint", ["remove", "show", "hide"]); //定义地图点方法通用接口
    var pointParent = function () { //点方法的父类函数，用来处理点的公共的方法
        this.points = []; //存放某一类型的点
        this.ishow = true; //marker层级显示标记
        this.isTabShow = true; //tab 层级显示标记
    };
    pointParent.prototype = {
        add: function (point) {
            Interface.checkImplements(point, Ipoint);
            this.points.push(point);
        },
        remove: function () {
            for (var i = 0, len = this.points.length; i < len; i++) {
                this.points[i].remove();
            }
        },
        show: function () {
            for (var i = 0, len = this.points.length; i < len; i++) {
                this.points[i].show();
            }
        },
        hide: function () {
            for (var i = 0, len = this.points.length; i < len; i++) {
                this.points[i].hide();
            }
        },
        levelChange: function (obj) {//这个函数处理地图层级转换的时候的事情
            this.showLevelNum = obj.showNum;
            this.showTabLevelNum = obj.tabShowNum;
            return this.levelChange = function () {
                if (Map.Level >= this.showLevelNum && this.ishow == true) {
                    this.ishow = false;
                    for (var i = 0, len = this.points.length; i < len; i++) {
                        Map.showMarker(this.points[i]);
                    }
                } else if (Map.Level <= this.showLevelNum && this.ishow == false) {
                    this.ishow = true;
                    for (var i = 0, len = this.points.length; i < len; i++) {
                        Map.hideMarker(this.points[i]);
                    }
                    return;
                }
                if (this.showTabLevelNum) {
                    if (Map.Level >= this.showTabLevelNum && this.isTabShow == true) {
                        this.isTabShow = false;
                        for (var i = 0, len = this.points.length; i < len; i++) {
                            this.points[i].showTab();
                        }
                    } else if (Map.Level <= this.showTabLevelNum && this.isTabShow == false) {
                        this.isTabShow = true;
                        for (var i = 0, len = this.points.length; i < len; i++) {
                            this.points[i].hideTab();
                        }
                    }
                }
            }
        }
    };

    var pointFn = function (obj) {//点处理函数
        this.paramObj = obj;
        this.point = null;
        this.tabIdCount = 0;
        this.tab = {};
        this.imgUrl = "";
        this.rightcount = 0;
        this.anchorImg = null;
        this.ishow = true;
        this.init();
    };
    pointFn.prototype = {
        initParam: function (obj) {
            for (var i in obj) {
                this[i] = obj[i];
            }
            this.tabId = "tabId" + (this.tabIdCount++);
            this.imgUrl = getImgUrl(this.pointData[this.pointType] ? this.pointData[this.pointType] : this.pointType);
            this.isShowSmallImg();
            this.setDataSeft ? "" : this.conntain = this.tabHtml;
            this.tab = getTabType("base", this);
        },
        init: function () {
            this.initParam(this.paramObj);
            var pd = this.pointData;
            if (pd.longitude && pd.latitude) {
                var point = new RTabMarker(pd.longitude, pd.latitude, this.tab, this.imgUrl, this.iconLeft, this.iconTop, this.iconWidth, this.iconHeight);
                this.Name = this.tabId;
                this.isShowMarker(point);
                Map.addMarker(point);
                point.Icon.alt = this.tabId;
                point.pointType = this.pointType;
                this.point = point;
                this.loadData ? this.loadData(this) : "";
                this.anchorImg = $("img[alt='" + this.tabId + "']");
                this.tabDiv = $("#" + this.tabId);
                if (this.rightHand) {
                    this.rightHand(this.anchorImg);
                }
                this.point.obj = this;
                this.markerSetting();
            }
        },
        isShowMarker: function (point) {//需要重写
            //			 if(Map.Level>=userData["DaoCha"]){
            //				 point.hide();
            //			 }
        },
        remove: function () {
            Map.removeMarker(this.point);
        },
        hide: function () {
            Map.hideMarker(this.point);
        },
        show: function () {
            Map.showMarker(this.point);
        },
        showTab: function () {//需要重写

        },
        hideTab: function () {//需要重写

        },
        upData: function () {


        },
        setTabWH: function (whdata) {
            var cNum = 20;
            if (Point.DetaY == -7) {
                cNum = 4;
            }
            this.tabDiv.css({ "width": whdata.width, "height": whdata.height, "margin-top": (-whdata.height - 20), "margin-left": (-whdata.width / 2 + cNum) });
        },
        getIcon: function () {
            return this.point.Icon;
        },
        markerSetting: function () {
            var that = this;
            setTimeout(function () {
                //that.addToMap();
                that.insertTabHtml();
                that.insertRightTab();
                that.rightTabLevelShow();
                that.notCarTab();
            }, 1);
        },
        initPointEvent: function () {
            var p = this.point;
            p.addEventListener(RMarkerEvent.MouseClickEvent, function (e) {//添加点击事件    
                mcFn(p.obj, p);
            });
            var pobj = p.obj;
            var itempobj = $("#" + pobj.tabId);
            if (pobj.initFn) {
                p.runClickEvent = function (evt) {//点击会弹开他不的执行的函数
                    $(".rightHandDiv").hide();
                    if (itempobj.css("display") == "block") {
                        itempobj.hide();
                        p.isShowTab = false;
                        itempobj.parent().css("z-index", 0);
                        pobj.closeFn ? pobj.closeFn() : "";
                    } else {
                        $(".pointTab").hide();
                        $(".pointTab").parent().css("z-index", 0);
                        itempobj.show();
                        p.isShowTab = true;
                        itempobj.parent().css("z-index", 99);
                        //弹开tab后执行初始化函数
                        pobj.initFn ? pobj.initFn({ longitude: pobj.pointData.longitude, latitude: pobj.pointData.latitude, tabId: pobj.tabId, itemData: pobj.itemData, Point: p }) : "";
                    }
                };
            }
            else {
                p.runClickEvent = null;
            }
            p.setTabWH = function (whdata) {//重设高度和宽度
                var cNum = 20;
                if (p.DetaY == -7) {
                    cNum = 4;
                }
                $("#" + p.obj.tabId).css({ "width": whdata.width, "height": whdata.height, "margin-top": (-whdata.height - 20), "margin-left": (-whdata.width / 2 + cNum) });
            };
        },
        addToMap: function () {
            var p = this.point;
            if (!this.mpa[p.pointType]) {
                Map[p.pointType] = [];
                Map[p.pointType].push(p);
            }
            else {
                Map[p.pointType].push(p);
            }
            this.initPointEvent();
        },
        insertTabHtml: function () {
            this.anchorImg.after(this.tab.customHtml);
        },
        replaceTabHtml: function (tabHtml) {
            $(".paointab_contain", $("#" + this.tabId)).empty().html(tabHtml);
        },
        insertRightTab: function () {//需要重写
            RTU.invoke("map.marker.setTIPSData", this.point);
            that.rightTabLevelShow();
        },
        rightTabLevelShow: function () {//需要重写

        },
        isShowSmallImg: function () {//需要重写
            if (Map.Level < userData["carLevelShow"]) {
                if (this.pointData.pointTypeUrl.indexOf("Offline") != -1) {
                    this.imgUrl = "../static/img/map/lessen_g.png";
                    return;
                }
                if (this.pointData.pointTypeUrl.indexOf("Online") != -1) {
                    this.imgUrl = "../static/img/map/lessen_y.png";
                    return;
                }
                if (this.pointType == "station") {
                    this.imgUrl = "../static/img/map/lessen_y.png";
                    return;
                }
            }
            if (Map.Level < 6 && this.pointType == "railways") {
                this.imgUrl = "../static/img/map/railwaysLess.png";
            }
        },
        notCarTab: function () {
            if (this.pointType == "station" || this.pointType == "railways" || this.pointType == "locomotive") {
                RTU.invoke("app.addStationName", this.point);
            }
            if (this.pointType == "guDaoNumber") {
                RTU.invoke("app.addGuDaoNumber", this.point);
            }
        },
        rightHand: function (img) {
            var that = this;
            img.mousedown(function (e) {
                $("#" + that.tabId).parent().css("z-index", that.rightcount + 1);
                that.rightcount++;
                if (3 == e.which) {
                    var pd = that.pointData;
                    that.rightHand({ lng: pd.longitude, lat: pd.latitude, target: this, pointData: that.itemData ? that.itemData : pd, Point: that.point });
                }
            });
        }
    };

    //保存所有点
    var pointsContainFn = function () {
        this.pointsContain = {};
        this.pointObjs = {};
    };
    pointsContainFn.prototype = {
        showAllMarker: function () {
            for (var i in this.pointsContain) {
                this.pointsContain[i].show();
            }
        },
        hideAllMarker: function () {
            for (var i in this.pointsContain) {
                this[i].hide();
            }
        },
        showSomeTypeMarker: function (obj) {
            for (var i in this.pointsContain) {
                if (i == obj.pointType) {
                    if (obj.isShow) {
                        this.pointsContain[i].show();
                    } else {
                        this.pointsContain[i].hide();
                    }
                    break;
                }
            }
        },
        add: function (pointType, obj) {
            var p = pointFnfactory(pointType, obj);
            var pname = pointType;
            if (!this.pointsContain[pname]) {
                this.pointsContain[pname] = new pointParent();

                this.pointsContain[pname].add(p);
            }
            else {

                this.pointsContain[pname].add(p);
            }
            var pk = p.point.obj.pointId;
            if (pk) {
                this.pointObjs[p.pointData[pk]] = p.point;
            }
            return p.point;
        },
        levelChange: function () {
            for (var i in this.pointsContain) {
                this.pointsContain[i].levelChange();
            }
        }
    };
    var controlPointFn = new pointsContainFn();
    var pointFnfactory = function (pointType, data) {//在这里重写每种类型的点的方法
        var p = null;
        switch (pointType) {
            case "":

                break;

            default:
                p = new pointFn(data);
                break;
        }
        return p;

    };




    /**************************************************************************************/



    RTU.register("map.marker.addMarker", function () {
        return function (data) {
            var obj = $.extend({}, pointParm, data || {}); //合并参数
            return controlPointFn.add(obj.pointType, obj);
        };
    });
    window.pSKeeping = controlPointFn.pointObjs;
    RTU.register("map.marker.addAndUpDateMarkers", function () {
        return function (data) {
            if (data.pointDatas) {
                for (var i = 0, len = data.pointDatas.length; i < len; i++) {
                    var objtemp = $.extend({}, data); //创建临时参数变量
                    objtemp.pointDatas = null;
                    objtemp.itemData = data.pointDatas[i];
                    objtemp.pointData = data.pointDatas[i];
                    var pd = objtemp.pointData;
                    var lng = pd.longitude; //读取每个点的经纬度
                    var lat = pd.latitude; //读取每个点的经纬度
                    var pointKey = pd[data.pointId]; //pointKey 为每个点数据的id
                    var k = controlPointFn.pointObjs[pointKey];
                    if (!k) {
                        controlPointFn.pointObjs[pointKey] = RTU.invoke("map.marker.addMarker", objtemp);
                    } else {
                        k.obj.pointData.longitude = lng;
                        k.obj.pointData.latitude = lat;
                        k = RTU.invoke("map.point.updatePoint", { point: k, lng: lng, lat: lat });
                        obj.showMarker ? Map.showMarker(k) : ""; //如果设置了showMarker 显示该点
                        mcFn(k.obj, k);
                    }
                    if (i == len - 1 && data.isSetCenter) {
                        Map.setCenter(lng, lat);
                    }
                }
            }
            reSetPointData();
        };
    });

});

