RTU.DEFINE(function (require, exports) {
/**
 * 模块名：运行轨迹
 * name：trainrunninglocus
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/locomotivequery/trainrunninglocus.css");
//    require("../../home/app-map.js");
//    require("../../home/app-map-track.js");
//    require("../../home/app-map-pointControl.js");
    require("My97DatePicker/WdatePicker.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
    var $runninghtml;
    function locusFn() {
        this.allData = []; //所有数据
        this.lineArr0 = []; //画线数组的arr
        this.httpRequest = null; //记录ajax请求对象
        this.isFirstRun = true; //是否是第一次运行加载
        this.clickTrData = null; //点击grid的行数据
        this.startTime = null; //播放起时间
        this.endTime = null; //播放结束时间
        this.nowPage = 0; //当前的页数
        this.line = null; //线对形象
        this.marker = null; //保存当前的点
        this.timeSpeed = 250; //播放速度
        this.timeInterval = null; //定时器
        this.payCount = 0; //记录播放记录
        this.arrSation = []; //记录车站下拉条目
        this.nowData = []; //现在的记录
        this.searchArr = []; //查找数组存放的变量
        this.isloadComplete = false; //是否加载完成
        this.mouseUpLastX = 1;
        this.lines = []; //保存每条线条
        this.lineNun = 0; //线的编号
        this.BorderLngLatobj = {}; //边界经纬度
        this.Map = null;
        this.isPlay = false;
        this.lastIsUserLngLat = {}; //最后可用经纬度

    };
    locusFn.prototype = {
        init: function (clickTrData) {
            this.clickTrData = clickTrData; ///点击赋值
            this.removeStatus(); //清除所有状态
            this.loadData(); //开始加载数据
            this.getBorderLngLat(); //获取边界经纬度
        },
        getBorderLngLat: function () {//获取边界经纬度
            var Map = RTU.invoke("map.getMap").Map;
            var lnglat = Map.toCoordinates(0, 0);
            var lnglat2 = Map.toCoordinates($(window).width(), $(window).height());
            this.BorderLngLatobj = { start: lnglat, end: lnglat2 };
        },
        initRightPart: function () {//右边部分的html处理
            $(".locusShowData").remove();
            $(".playSchedule").remove();
            $("body").append('<div class="locusShowData"></div>');

            $(".locusShowData").append($runninghtml);
            $("body").append('<div class="playSchedule"><img src="../static/img/app/locomotivequery/btn_backward.png" class="btn_backward"/> <img src="../static/img/app/'
						 + 'locomotivequery/btn_pause.png" class="btn_pause" />'
						 + '<img src="../static/img/app/locomotivequery/btn_stop.png" class="btn_stop" /><img src="../static/img/app/locomotivequery/btn_forward.png" class="btn_forward"/>'
						 + '<hr class="hr_class"/><div class="btn_beginTime_div">开始时间：<div class="btn_beginTime"></div></div>'
						 + '<div class="btn_endTime_div">结束时间：<div class="btn_endTime"></div></div>'
						 + '<div class="btn_bufferedTime_div">缓冲时间：<div class="btn_bufferedTime"></div></div>'
						 + '<div class="timebase">时间轴：<div class="timebase_outLine"><div class="timebase_dragLine"></div><div class="timebase_loadLine"></div><div class="timebase_Img"><div class="locusShowDate"><div class="TimeTest"></div></div><img class="timebase_Imsg" src="../static/img/app/moveCurve/visited_stops.png" alt=""/></div></div></div>'
						 + '<div class="s_shudu_tip">播放速度：</div><select class="s_shudu"><option>8X</option><option>4X</option>' +
						 '<option selected>2X</option><option>1X</option></select></div>');
            this.initRightPartEven();
            var Map = RTU.invoke("map.getMap").Map;
            this.Map = Map;
            var that = this;
            Map.addEventListener(RMapEvent.Moved, function () {
                that.getBorderLngLat();

            });
            Map.addEventListener(RMapEvent.LevelChanged, function () {
                that.getBorderLngLat();

            });
        },
        initRightPartEven: function () {//初始化事件
            this.rightPart_close(); //关闭按钮
            this.rightPart_up(); //上部数据显示
            this.rightPart_down(); //下部速度控制
            Array.prototype.contains = function (obj) {
                var i = this.length;
                while (i--) {
                    if (this[i] === obj) {
                        return true;
                    }
                }
                return false;
            };
        },
        rightPart_close: function () {

        },
        rightPart_up: function () {
            var that = this;
            RTU.invoke("app.locomotivequery.trainrunninglocus.initclick");
            this.selectSation(); //选择车站
            $(".trainrunninglocus-closeImg-btn").unbind("click").click(function () {
                that.removeStatus();
            });
        },
        selectSation: function () {
            var that = this;
            if (this.nowData.length == 0) {
                return;
            }
            setTimeout(function () {
                var arr = [];
                for (var i = 0; i < that.nowData.length; i++) {
                    var sname = that.nowData[i].dshortname;
                    if (!that.arrSation.contains("<option>" + sname + "</option>") && sname) {
                        arr.push("<option>" + sname + "</option>");
                        that.arrSation.push("<option>" + sname + "</option>");
                    }
                }
                $(".tlstartStation").append(arr.join(""));
                $(".tlstartStation:first").attr("checked", "checked");
            }, 25);
        },
        rightPart_down: function () {

            var that = this;
            $(".s_shudu").change(function () {
                var k = $(this).val();
                if (k == "8X") {
                    that.timeSpeed = 62.5;
                    that.play();
                } else if (k == "4X") {
                    that.timeSpeed = 125;
                    that.play();
                }
                else if (k == "2X") {
                    that.timeSpeed = 250;
                    that.play();
                }
                else if (k == "1X") {
                    that.timeSpeed = 500;
                    that.play();
                }
            });
            //减速
            $(".btn_backward").click(function () {
                that.timeSpeed = that.timeSpeed + 20;
                that.play();
            });
            //加速
            $(".btn_forward").click(function () {
                if (that.timeSpeed < 30) {
                    that.timeSpeed = 30;
                    return;
                }
                that.timeSpeed = that.timeSpeed - 20;
                if (!that.isPlay) {
                    that.play();
                };
            });
            //暂停
            $(".btn_pause").click(function () {
                if (that.timeInterval)
                    clearInterval(that.timeInterval);
                if (that.isPlay) {
                    $(".btn_pause").attr("src", "../static/img/app/locomotivequery/btn_pause.png");
                    that.isPlay = false;
                    that.play();

                } else {
                    $(".btn_pause").attr("src", "../static/img/app/locomotivequery/btn_play.png");
                    that.isPlay = true;
                }
            });
            //播放
            $(".btn_play").click(function () {
                if (that.timeInterval)
                    clearInterval(that.timeInterval);
                that.play();
            });
            //停止
            $(".btn_stop").click(function () {
                that.removeStatus();
            });
            var clicktemp = false;
            //初始化回放速度控制
            var thist = " .timebase_Img";
            $(thist).mousedown(function (e) {
                $(".locusShowDate").show();
                that.locusShowDateTime();
                if (that.timeInterval)
                    clearInterval(that.timeInterval);
                clicktemp = true;
                $(thist).css("cursor", "pointer");
                var position = $(thist).position();
                var x = e.pageX - position.left;
                var y = e.pageY - position.top;
                $(".timebase_dragLine").width(position.left);
                var tw = $(thist).width() / 2 - 8;
                var th = $(thist).height() / 2 - 8;
                $(document).bind("mousemove.dragPoint", function (ev) {
                    $(thist).css("cursor", "pointer");
                    var _x = ev.pageX - x; //获得X轴方向移动的值
                    var _y = ev.pageY - y; //获得Y轴方向移动的值    
                    if (_x < tw) _x = tw;
                    if (_y < th) _y = th;
                    if (_x > $(thist).parent().width() - tw) _x = $(thist).parent().width() - tw;
                    if (_y > $(thist).parent().height() - th) _y = $(thist).parent().height() - th;
                    $(thist).css({ left: _x + "px" });
                    that.mouseUpLastX = _x;
                    that.locusShowDateTime();
                    $(".timebase_dragLine").width(_x);
                    return false;
                });
                e.stopPropagation();
                return false;
            });
            $(".timebase_outLine").bind("mouseup.dragPoint1", function (e) {
                $(".locusShowDate").hide();
                $(document).unbind("mousemove.dragPoint");
                that.jumpDataPlay();
                clicktemp = false;
                return false;
            });
            $("body").bind("mouseup.dragPoint1", function (e) {
                $(".locusShowDate").hide();
                $(document).unbind("mousemove.dragPoint");
                clicktemp = false;
                return false;
            });
            $(thist).parent().mousedown(function (e) {
                $(".locusShowDate").show();
                if (that.timeInterval)
                    clearInterval(that.timeInterval);
                if (clicktemp == false) {
                    that.mouseUpLastX = e.offsetX;
                    that.locusShowDateTime();
                    $(".timebase_dragLine").width(e.offsetX);
                    $(thist).css({ left: e.offsetX + "px" });
                }
                that.jumpDataPlay();
                return false;
            });
            //站点搜索
            $(".tlsureStation").click(function () {
                var stext = $(".tlstartStation").val();
                var count = -1;
                for (var i = 0, len = that.allData.length; i < len; i++) {
                    if ($.trim(that.allData[i].dshortname) == $.trim(stext)) {
                        count = i;
                        break;
                    }
                }
                if (count == -1) {
                    //						 alert("没有找到相关站点！");
                    RTU.invoke("header.alarmMsg.show", "没有找到相关站点！");
                    return;
                }
                that.payCount = count;
                that.play();
                that.drawLine();
            });
            //时间搜索
            $(".tlsureTime").click(function () {
                var stime = $(".tlStarTime").val();
                var endtime = $(".tlEndTime").val();
                var st = "";
                var et = "";
                try {
                    st = new Date(stime);
                    et = new Date(endtime);
                }
                catch (e) {
                }
                if (!st.getTime() && !et.getTime()) {
                    that.searchArr = that.allData;
                    that.reSetLine(); //线的重画
                    that.searPlay(that.allData);
                }
                if (st.getTime() && et.getTime()) {
                    that.searchArr = [];
                    for (var i = 0, len = that.allData.length; i < len; i++) {
                        var td = new Date(that.allData[i].receiveTime);
                        if (td > st) {
                            that.searchArr.push(that.allData[i]);
                        }
                        if (td > et) {
                            break;
                        }
                    }
                    that.searPlay(that.searchArr);
                }
                if (!st.getTime() && et.getTime()) {
                    that.searchArr = [];
                    for (var i = 0, len = that.allData.length; i < len; i++) {
                        var td = new Date(that.allData[i].receiveTime);
                        that.searchArr.push(that.allData[i]);
                        if (td > et) {
                            break;
                        }
                    }
                    that.searPlay(that.searchArr);
                }
                if (st.getTime() && !et.getTime()) {
                    that.searchArr = [];
                    for (var i = 0, len = that.allData.length; i < len; i++) {
                        var td = new Date(that.allData[i].receiveTime);
                        if (td > st) {
                            that.searchArr.push(that.allData[i]);
                        }
                    }
                    that.searPlay(that.searchArr);
                }
            });
        },
        locusShowDateTime: function () {
            var payCount = parseInt(this.mouseUpLastX * this.totalRecords / 175);
            $(".locusShowDate .TimeTest").text(this.tool.getDateTime(this.allData[payCount].receiveTime));
        },
        //拖动滚动条的时候跳到指定位置播放
        jumpDataPlay: function () {
            var that = this;
            if (this.timeInterval) {
                clearInterval(this.timeInterval);
            }
            var hasLoadW = this.allData.length * 175 / this.totalRecords;
            if (this.mouseUpLastX > hasLoadW) {
                //					 alert("数据还没有加载到此处！");
                RTU.invoke("header.alarmMsg.show", "数据还没有加载到此处！");
                return;
            }
            that.payCount = parseInt(this.mouseUpLastX * this.totalRecords / 175);
            RTU.invoke("map.setCenter", { lng: this.allData[that.payCount].longitude, lat: this.allData[that.payCount].latitude });
            that.getBorderLngLat();
            that.play();

        },
        startSetData: function () {//开始赋值数据
            var item = this.findTheFirstGoodLatLng();
            this.addMarker(item.longitude, item.latitude, item.lateMinutes);
            this.play();
        },
        searPlay: function (runData) {//搜索条件下面的查找
            if (runData) {
                this.reSetLine(); //线的重画
                this.play(runData); //面板和点的开始   				
            }
        },
        reSetLine: function () {
            var d = this.searchArr;
            var arr = [];
            for (var i = 0; i < d.length; i++) {
                if (i == 0) {//第一次循环，定位到地图中心点
                    var item = this.findTheFirstGoodLatLng(d);
                    RTU.invoke("map.setCenter", { lng: item.longitude, lat: item.latitude });
                    this.getBorderLngLat();
                }
                var tm = {};
                tm.Cx = d[i].longitude;
                tm.Cy = d[i].latitude;
                tm.lateMinutes = d[i].lateMinutes;
                tm.index = i;
                if (!this.filterLatLng(tm.Cx, tm.Cy)) {
                    continue;
                }
                arr.push(tm);
            }
            this.drawLine(arr); //画线
        },

        play: function (runData) {//播放
            if (this.timeInterval) {
                clearInterval(this.timeInterval);
            }
            if (runData) {
                this.payCount = 0;
            }
            var that = this;
            var data = runData || that.allData;
            this.timeInterval = setInterval(function () {
                if (that.payCount == data.length) {
                    that.payCount = 0;
                    clearInterval(that.timeInterval);
                }else{
	                that.SetData_rigthPart(data);
	                that.UpDateMarker(data);
	                that.setControlBar(); //控制条的控制
                }
            }, this.timeSpeed);
        },
        setControlBar: function () {
            var rlw = this.payCount * 175 / this.totalRecords;
            $(".timebase_dragLine").width(rlw);
            $(".timebase_Img").css("left", rlw);
        },
        SetData_rigthPart: function (runData) {
            var data = runData || this.allData;
            this.payCount++;
            if(this.payCount < data.length)
            	RTU.invoke("app.locomotivequery.trainrunninglocus.activate", data[this.payCount]);
        },
        UpDateMarker: function (runData) {
            var data = runData || this.allData;
            try {
                var lng = data[this.payCount].longitude;
                var lat = data[this.payCount].latitude;
                var p = this.marker;
                this.checkIsOutMap(lng, lat); //检查是否超出地图边界
                p.update(lng, lat, p.TagObject, p.IconUrl, p.DetaX, p.DetaY, p.IconWidth, p.IconHeight);
            }
            catch (e) {
            }
        },
        checkIsOutMap: function (lng, lat) {
            var s = this.BorderLngLatobj.start;
            var e = this.BorderLngLatobj.end;
            if (lat > s.Cy || lat < e.Cy || lng < s.Cx || lng > e.Cx) {
                RTU.invoke("map.setCenter", { lng: lng, lat: lat });
                this.getBorderLngLat();
            };
        },
        loadData: function () {

            this.nowPage++;
            if (this.nowPage == 1) {
                RTU.invoke("header.msg.show", "加载中,请稍后！");
            }
            var that = this;
//            var checiName = this.clickTrData.data.checiName;
            var locoTypeid = this.clickTrData.data.locoTypeid;
            var locoNo = this.clickTrData.data.locoNO;
            var locoAb = this.clickTrData.data.locoAb;
            var stime = $("#locus_contain2 .statTime").val();
            var etime = $("#locus_contain2 .endTime").val();
            this.httpRequest = $.ajax({
                url: "../onlineloco/searchLocoInfoHisByProperty?locoTypeid=" + locoTypeid + "&locoNo=" + locoNo + "&locoAb=" + locoAb + "&beginStation=&endStation=&page=" + that.nowPage + "&pageSize=500&beginTime="+stime+"&endTime="+etime,
                type: "GET",
                dataType: "json",
                cache: true,
                async: true,
//                data: { beginTime: locusControl.startTime, endTime: locusControl.endTime },
                success: function (data) {
                    RTU.invoke("header.msg.hidden");
                    var d = data.data;
                    that.nowData = d;
                    if (d.length == 0 && that.nowPage == 1) {
                        that.tool.showMsg("本次列车没有数据");
                        return;
                    }
                    if (d.length == 0) {
                        $(".btn_endTime").text(this.endTime);
                        $(".btn_bufferedTime").text(this.endTime);
                        return;
                    }
                   
                    that.filterAllData(d); //记录每次加载的数据
                    if (that.nowPage == 1) {//如果第一次加载就启动赋值操作
                        that.initRightPart(); //初始化右边控制模块
                        that.startSetData();
                        that.totalRecords = data.totalRecords;
                        $(".btn_endTime").text(that.tool.getDateTime(new Date().getTime()));
                    }
                    that.upDateLoadLine();
                    that.setLineArr(d); //赋值数组画线
                    that.setStatAndEnd(); //赋值开始和结束时间
                    that.loadData(); //递归调用
                } 
            });
        },
        upDateLoadLine: function () {
            var hasLoadW = this.allData.length * 175 / this.totalRecords;
            $(".timebase_loadLine").width(hasLoadW);
        },
        drawNewLine: function (d, i) {
            this.lineNun++;
            if (!this["lineArr" + this.lineNun]) {
                this["lineArr" + this.lineNun] = [];
            }

            for (var j = i; j < d.length; j++) {
                this["lineArr" + this.lineNun].push();
                var tm = this.returnTm(j, d);
                if (!this.filterLatLng(tm.Cx, tm.Cy)) {
                    continue;
                }
                this["lineArr" + this.lineNun].push(tm);
            };
            this.drawLine();

        },
        returnTm: function (i, d) {
            var tm = {};
            tm.Cx = d[i].longitude;
            tm.Cy = d[i].latitude;
            tm.lateMinutes = d[i].lateMinutes;
            tm.index = i;
            return tm;
        },
        setLineArr: function (d) {
            for (var i = 0; i < d.length; i++) {
                if (i == 0 && this.isFirstRun == true) {//第一次循环，定位到地图中心点
                    var item = this.findTheFirstGoodLatLng();
                    RTU.invoke("map.setCenter", { lng: item.longitude, lat: item.latitude });
                    this.getBorderLngLat();
                    this.lastIsUserLngLat.lat = item.latitude;
                    this.lastIsUserLngLat.lng = item.longitude;
                }
                // if (i!=0) {
                //    var lastdate =   d[i-1].receiveTime;
                //    var thisdate =   d[i].receiveTime;
                //    if (thisdate-lastdate>600000) {
                //    	  
                // 	  this.drawNewLine(d,i);
                // 	   return;
                //    };
                // };
                var tm = this.returnTm(i, d);
                if (!this.filterLatLng(tm.Cx, tm.Cy)) {

                    continue;
                }
                this["lineArr" + this.lineNun].push(tm);
            }
            if (this.isFirstRun) {
                this.drawLine(); //画线
                this.isFirstRun = false;
            }
        },
        removeMarker: function () {
            if (this.marker) {
                RTU.invoke("map.marker.removeMarker", this.marker); //删除点 
            }
        },
        addMarker: function (lng, lat, lateMinutes) {
            RTU.invoke("map.marker.removeMarker", this.marker); //删除点
            this.marker = RTU.invoke("map.marker.addMarker", {
                imgUrl: "../static/img/map/huocheOnline.png",
                isSetCenter: true,
                pointType: "locusPoint",
                tabWidth: 220,
                tabHeight: 280,
                tabHtml: this.getTabHtml(),
                pointData: { longitude: lng, latitude: lat, lateMinutes: lateMinutes },
                setDataSeft: false,
                closeFn: function () {
                },
                loadData: function (obj) {
                    var lateMinutes = obj.pointData.lateMinutes == "" ? "0" : obj.pointData.lateMinutes;
                    if (parseInt(lateMinutes) < 0) {
                        $("img[alt='" + obj.tabId + "']").after('<div class="OntimeLate" style="position:absolute;top:-13px;right:-65px; width:39px;height:17px;background-image: url(\'../static/img/app/train_late.png\');">'
								+ '<span class="time-span" style="position:absolute;right:2px;color:#fff;top:1px;text-align: center; width:25px;">' + lateMinutes + '</span></div>');
                    }
                    else {
                        $("img[alt='" + obj.tabId + "']").after('<div class="OntimeLate" style="position:absolute;top:-13px;right:-65px; width:39px;height:17px;background-image: url(\'../static/img/app/train_ontime.png\');">'
								+ '<span class="time-span" style="position:absolute;right:2px;color:#fff;top:1px;text-align: center; width:25px;">' + (lateMinutes > "0" ? ("+" + lateMinutes) : lateMinutes) + '</span></div>');
                    }
                }
            });
        },
        getTabHtml: function () {
            var tab = {
                html: "",
                detaX: 0,
                detaY: 0
            };
            return tab;
        },
        drawLine: function (runData) {
            // RTU.invoke("map.marker.electronicRlineClose");//关闭线条
            var lineData = runData || this["lineArr" + this.lineNun];
            var line = RTU.invoke("map.marker.Rline", { arr: lineData, lineW: 4, lineC: "red", lineO: 0.8 });
            this.line = line;
            this.lines.push(line);
        },
        findTheFirstGoodLatLng: function (runData) {
            var data = runData || this.allData;
            for (var i = 0, len = data.length; i < len; i++) {
                if (this.filterLatLng(data[i].latitude, data[i].longitude)) {
                    return data[i];
                    break;
                }
            }
            return {};
        },
        filterAllData: function (d) {//过滤经纬度异常的数据
        	 this.lastIsUserLngLat.lat = d[d.length-1].latitude;
             this.lastIsUserLngLat.lng = d[d.length-1].longitude;
             this.allData = this.allData.concat(d);
//            for (var i = 0, len = d.length; i < len; i++) {
//                if (this.filterLatLng(d[i].latitude, d[i].longitude)) {
//                    this.allData.push(d[i]);
//                    this.lastIsUserLngLat.lat = d[i].latitude;
//                    this.lastIsUserLngLat.lng = d[i].longitude;
//                }
//                else {
//
//                    d[i].latitude = this.lastIsUserLngLat.lat;
//                    d[i].longitude = this.lastIsUserLngLat.lng;
//                    this.allData.push(d[i]);
//                }
//
//            }
        },
        filterLatLng: function (latitude, longitude) {//过滤不合格的经纬度
            if (!latitude || !longitude || latitude == "0.0," || longitude == "0.0," || latitude <= 0 || longitude <= 0) {
                return false;
            }
            return true;
        },
        setStatAndEnd: function () {
            this.startTime = this.tool.getDateTime(this.allData[0].receiveTime);
            this.endTime = this.tool.getDateTime(this.allData[this.allData.length - 1].receiveTime);
            $(".btn_beginTime").text(this.startTime);

            $(".btn_bufferedTime").text(this.endTime);
            this.setSearchTime();
        },
        setSearchTime: function () {
            var that = this;
            $(".tlStarTime").click(function () {
                WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss', minDate: that.startTime, maxDate: that.endTime });
            });
            $(".tlEndTime").click(function () {
                WdatePicker({ dateFmt: 'yyyy-MM-dd HH:mm:ss', minDate: that.startTime, maxDate: that.endTime });
            });
        },
        removeStatus: function () {//清除所有状态
            this.isFirstRun = true;
            this.arrSation = [];
            this.nowPage = 0; //分页重设
            this.payCount = 0; //重设播放进度
            if (this.httpRequest) {//ajax停止
                this.httpRequest.abort();
                this.httpRequest = null;
            }
            if (this.timeInterval) {//清除定时器
                clearInterval(this.timeInterval);
            }
            RTU.invoke("map.marker.removeMarker", this.marker); //删除点
            RTU.invoke("map.removeAllGraphics"); //删除线    	    	  
            RTU.invoke("map.marker.electronicRlineClose"); //关闭线条
            window.psModel.runControl("refreshData", window.homeTimer, false);
            RTU.invoke("map.marker.removeCarMarker"); //隐藏车辆
            RTU.invoke("map.marker.hideguDaoMarker"); //隐藏古道
            RTU.invoke("map.showPointPointType", { show: false, pointType: "station" }); //隐藏车站 
            this.allData = []; //所有数据
            this.lineArr = []; //画线数组的arr;
            RTU.invoke("header.msg.hidden");
            $(".locusShowData").remove();
            $(".playSchedule").remove();
        },
        tool: {
            getDateTime: function (tempd) {
                var d = new Date();
                if (tempd)
                    d = new Date(tempd);
                var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
                return timeText;
            },
            showMsg: function (msg) {
                var that = this;
                RTU.invoke("header.msg.show", msg);
                setTimeout(function () {
                    that.hideMsg();
                }, 1000);
            },
            hideMsg: function () {
                RTU.invoke("header.msg.hidden");
            },
            removeAllGraphics: function () {
            },
            hidePlaySchedule: function () {
                $(".playSchedule").hide();
            }
        }
    };
    window.locusControl = new locusFn();
    var popuwnd_onlleft = null; //左侧弹出窗口
    var g;
    //加载数据并初始化窗口和事件
    RTU.register("app.locomotivequery.trainrunninglocus.loadHtml", function () {
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
    RTU.register("app.trainrunninglocus.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            RTU.invoke("map.show");
            $(".playSchedule").show();
            //查询窗口
            RTU.invoke("app.locomotivequery.trainrunninglocus.loadHtml", { url: "../app/modules/locomotivequery/trainrunninglocus.html", fn: function (html) {
                if (!popuwnd_onlleft) {
                    popuwnd_onlleft = new PopuWnd({
                        title: "列车运行轨迹",
                        html: html,
                        width: 270,
                        height: 465,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    popuwnd_onlleft.remove = popuwnd_onlleft.close;
                    popuwnd_onlleft.close = popuwnd_onlleft.hidden;
                    popuwnd_onlleft.init();
                }
                else {
                    popuwnd_onlleft.init();
                }
                popuwnd_onlleft.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	 psModel.cancelScribe("refreshData", window.trainrunninglocusRefresh);
                	 window.psModel.runControl("refreshData", window.homeTimer, true);
                     psModel.searchNow({ token: window.homeTimer });
                });
                return popuwnd_onlleft;
            }, initEvent: function () { //初始化事件
                //加载列表
                $("#locus_contain2 .locus_search").unbind("click").click(function () {
                    RTU.invoke("app.locomotivequery.trainrunninglocus.loadSearch", { name: $("#locus_contain2 .carName").val(), value: $("#locus_contain2 .carValue").val(), st: $("#locus_contain2 .statTime").val(), et: $("#locus_contain2 .endTime").val() });
                    psModel.searchNow({ token: window.trainrunninglocusRefresh });
                });
                $("#locus_contain2 .locus_search").click();
                $("#locus_contain2 .carName").inputTip({ text: "" }).parent().css({ "float": "right" });
                $("#locus_contain2 .carValue").inputTip({ text: "" }).parent().css({ "float": "right" });
                //加载列表数据
                RTU.invoke("app.locomotivequery.trainrunninglocus.loadSearch", { name: "", value: "", st: "", et: "" });
            }
            });
        };
    });
    RTU.invoke("core.router.load", {
        url: "../app/modules/trainrunninglocus/trainrunninglocus.html",
        async: false,
        success: function (html) {
        	$runninghtml = html;
        }
    });

    RTU.register("app.locomotivequery.trainrunninglocus.activate", function () {
        return function (data) {
            $(".trainrunninglocus-speed").text(data.speed); //实速度
            $(".trainrunninglocus-limitedSpeed").text(data.limitedSpeed); //限速
            $(".trainrunninglocus-frontDistance").text(data.frontDistance); //距离
            $(".trainrunninglocus-checiName").text(data.checiName); //车次
//            $(".trainrunninglocus-drDriverName").text(data.driverId); //司机名称
            var drDriverName = data.drDriverName;
            if(!drDriverName)drDriverName = data.driverId;
            $(".trainrunninglocus-drDriverName").text(drDriverName);
            
            var locoNoAndLocoAb=null;
         	if (data.locoAb !="1"&&data.locoAb!="2") {
         		locoNoAndLocoAb=data.locoNo;
	        } else if (data.locoAb == "1") {
	        	   locoNoAndLocoAb= data.locoNo + window.locoAb_A;
	        } else {
	        	   locoNoAndLocoAb=  data.locoNo+ window.locoAb_B;
	        }
            $(".trainrunninglocus-locoNo").text(data.ttypeShortname+"-"+locoNoAndLocoAb); //机车  data.locoNo
            
            $(".trainrunninglocus-dname").text(data.dname); //所属区段
            $(".trainrunninglocus-distanceText").text(data.frontDistance); //距离 
            //			$(".trainrunninglocus-place").text(data.dshortname + "- " + data.lname);
            var sName = data.sName;
            if(!sName)sName = data.stationTmis;
            $(".trainrunninglocus-place").text(sName+"("+data.lname+")");
            $(".trainrunninglocus-signalNo").text(data.signalNo); //信号机
            $(".trainrunninglocus-kiloSign").text(data.kiloSign / 1000); //公里标
            $(".trainrunninglocus-totalWeight").text(data.totalWeight); //总重量
            //$(".trainrunninglocus-totalDistance").text(data.totalDistance); //计长
            $(".trainrunninglocus-totalDistance").text(data.length); //计长
            $(".trainrunninglocus-vehicleCount").text(data.vehicleCount); //辆数
            $(".trainrunninglocus-engineSpeed").text(data.engineSpeed); //柴速 
            $(".trainrunninglocus-guangya").text(data.guanya); //管压 
            $(".trainrunninglocus-gangya").text(data.gangya); //缸压 
            $(".trainrunninglocus-workStatus").text(data.workStatus); //工况 
            $(".trainrunninglocus-jkstate").text(data.jkstate); //监控状态 
            $(".trainrunninglocus-zhidong").text(data.zhidongName); //制动输出 
            var d = new Date();
            if (data.receiveTime)
                d = new Date(data.receiveTime);
            var timeText = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + (d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds());
            $(" .trainrunninglocus-receiveTime").text(timeText); //时间 
            //版本信息
            $(" .trainrunninglocus-jkzbA").text(data.jkzbA); // 监控主板A版本信息
            $(" .trainrunninglocus-jkzbB").text(data.jkzbB); // 监控主板B版本信息	
            $(" .trainrunninglocus-jkzbAdata").text(data.jkzbAdata); //监控主板A数据版本
            $(" .trainrunninglocus-jkzbBdata").text(data.jkzbBdata); //监控主板B数据版本	
            $(" .trainrunninglocus-monitor1").text(data.monitor1); // 一端显示器版本信息
            $(" .trainrunninglocus-monitor2").text(data.monitor2); // 二端显示器版本信息	
            $(" .trainrunninglocus-groundA").text(data.groundA); // 地面处理A模块版本信息
            $(" .trainrunninglocus-groundB").text(data.groundB); // 地面处理B模块版本信息
            $(" .trainrunninglocus-txbA").text(data.txbA); // 通信A模块版本信息
            $(" .trainrunninglocus-txbB").text(data.txbB); // 通信B模块版本信息
            $(" .trainrunninglocus-kztxbA").text(data.kztxbA); // 扩展通信A版本信息
            $(" .trainrunninglocus-kztxbB").text(data.kztxbB); // 扩展通信B版本信息
            //状态图标
            $(" .trainrunninglocus-distance_ico").attr("src", getImgUrl(data.lineFlag));
        };
    });
    RTU.register("app.locomotivequery.trainrunninglocus.initclick", function () {
        return function (data) {
            $(".trainrunninglocus-basic-tab-div").unbind("click").click(function () {
                $(this).addClass("trainrunninglocus-border-bottom-type").removeClass("trainrunninglocus-tab-background").addClass("trainrunninglocus-border-top-click").addClass("trainrunninglocus-border-left");
                $(".trainrunninglocus-version-tab-div").removeClass("trainrunninglocus-border-bottom-type").addClass("trainrunninglocus-tab-background").removeClass("trainrunninglocus-border-top-click");
                $(".trainrunninglocus-content-basic-div").removeClass("hiddenDiv");
                $(".trainrunninglocus-content-version-div").addClass("hiddenDiv");
            });
            $(".trainrunninglocus-version-tab-div").unbind("click").click(function () {
                $(this).addClass("trainrunninglocus-border-bottom-type").removeClass("trainrunninglocus-tab-background").addClass("trainrunninglocus-border-top-click").addClass("trainrunninglocus-border-left");
                $(".trainrunninglocus-basic-tab-div").removeClass("trainrunninglocus-border-bottom-type").addClass("trainrunninglocus-tab-background").removeClass("trainrunninglocus-border-top-click");
                $(".trainrunninglocus-content-basic-div").addClass("hiddenDiv");
                $(".trainrunninglocus-content-version-div").removeClass("hiddenDiv");
            });
            $(".trainrunninglocus-basic-tab-div").trigger("click");
            //点击关闭
            $(".trainrunninglocus-closeImg-btn").unbind("click").click(function () {
                removeTimer();
                $(".playSchedule").hide();
            });

        };
    });
    var currentTr = null;
    function refreshDatas(data) {
        if (g) {
            var t = g.currClickItem();
            if (t.item) {
                currentTr = g.currClickItem();
                currentTr.count = 1;
            }
            g.refresh(data);
        } else {
            g = new RTGrid({
                datas: data,
                containDivId: "locus_table_grid",
                tableWidth: 250,
                tableHeight: 270,
                hasCheckBox: false,
                beforeLoad:function(that){
     				that.pageSize =3000;
     			},
                isShowPagerControl: false,
                showTrNum: false,
                beforeSortFn: function (sname, isUp, that) {
                    var sname = that.sortParam.itemName;
                    if (sname == "isOnline") {
                        sname = "isOnline";
                    }
                    if (sname == "locoNO") {
                        sname = "train";
                    }
                    if (sname == "locoTypeStr") {
                        sname = "train";
                    }
                    if (sname == "depotName") {
                        sname = "DShortname";
                    }
                    if (sname == "lineName") {
                        sname = "LName";
                    }
                    if (sname == "sName") {
                        sname = "SName";
                    }
                    if (sname == "limitSpeed") {
                        sname = "limitedSpeed";
                    }
                    if (sname == "receiveTimeStr") {
                        sname = "lkjTime";
                    }
                    var exparm = { "sortField": sname, "sortOrder": that.sortParam.upAndDown };
                    window.trItem.extendParam = exparm;
                    if (trItem.httpRequest) {//ajax停止
                        trItem.httpRequest.abort();
                        trItem.httpRequest = null;
                    }
                    trItem.loadFn();
                    return true;
                },
                loadPageCp: function (t) {
                    t.cDiv.css("left", "203px");
                    t.cDiv.css("top", "210px");
                    if (currentTr) {
                        var trs = $(".RTTable-Body tbody  tr", g.cDiv);
                        trs.each(function (i, item) {
                            var cbd = $(item).children(" td[itemname='locoNO']").text();
                            var cdata = cbd.split("-");
                            if (cdata[0] == currentTr.data.locoTypeName && cdata[1] == currentTr.data.locoNO) {
                                $(item).addClass("RTGrid_clickTr");
                                return false;
                            }
                        });
                    }
                    currentTr = null;
                },
                clickTrEvent: function (t) {
                	if(locusControl){
                		locusControl.removeStatus();
                		locusControl = null;
                	}
                	locusControl = new locusFn();
                    locusControl.startTime = $("#locus_contain2 .statTime").val();
                    locusControl.endTime = $("#locus_contain2 .endTime").val();
                    if (!locusControl.startTime) {
                        //	                        alert("请选择开始时间！");
                        RTU.invoke("header.alarmMsg.show", "请选择开始时间！");
                        return;
                    }
                    if (!locusControl.endTime) {
                        //	                        alert("请选择结束时间！");
                        RTU.invoke("header.alarmMsg.show", "请选择结束时间！");
                        return;
                    }
                    locusControl.init(g.currClickItem());
                },
                replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
                    //		            	 1=在线监控，2=在线非监控，3=离线监控，4=离线非监控
                	if (data == "1"||data == "2") {
                        return "<img src='../static/img/app/online_pic_14_14.png'>";
                    } else if (data == "3"||data == "4") {
                        return "<img src='../static/img/app/outline_pic_14_14.png'>";
                    }
                }
                }, { index: 2, fn: function (data, j, ctd, itemData) {
                    if (itemData.locoAb == "0") {
//                        return itemData.locoNO;
                        return itemData.locoTypeName + "-" + itemData.locoNO;
                    } else if (itemData.locoAb == "1") {
//                        return itemData.locoNO + window.locoAb_A;
                        return itemData.locoTypeName + "-" + itemData.locoNO + window.locoAb_A;
                    } else {
//                        return itemData.locoNO + window.locoAb_B;
                        return itemData.locoTypeName + "-" + itemData.locoNO + window.locoAb_B;
                    }
                }}],
                colNames: [" ", "车次", "机车", "局段"],
                colModel: [{ name: "isOnline", width: "60px", isSort: true }, { name: "checiName", width: "35px", isSort: true }, { name: "locoNO", isSort: true }, { name: "depotName", width: "70px", isSort: true}]
            });
        }
    }
    RTU.register("app.locomotivequery.trainrunninglocus.loadSearch", function () {
        return function (data) {
            //时间条件还没有加上去
            function conditions() {
                var loco = RTU.invoke("app.realtimelocomotivequery.query.splitlocoNo", $("#locus_contain2 .carName").val());
                return [{ name: "locoTypeName", value: loco.locoTypeName || "" }, { name: "locoNO", value: loco.locoNo || "" },
						{ name: "checiName", value: $("#locus_contain2 .carValue").val() || "" }, { interval: { timeName: "receiveTimeStr"}}];
            }
            psModel.cancelScribe("refreshData", window.trainrunninglocusRefresh);
            window.trainrunninglocusRefresh = psModel.subscribe("refreshData", function (t, data) {
                refreshDatas(data);
            }, conditions);
        };
    });
    RTU.register("app.trainrunninglocus.query.init", function () {
        var data = RTU.invoke("app.setting.data", "trainrunninglocus");
        if (data && data.isActive) {
            RTU.invoke("app.trainrunninglocus.query.activate");
        }
        return function () {
            return true;
        };
    });
    
    // 拆分机车字符串
    RTU.register("app.realtimelocomotivequery.query.splitlocoNo", function () {
        return function (locoTypeStr) {
            var locoTypeName = "";
            var locoNo = "";
            if (locoTypeStr == "") {
                return {
                    locoTypeName: "",
                    locoNo: ""
                };
            }
            //是纯数字的时候约定输入的是机车号
            var n = Number(locoTypeStr);
            if (!isNaN(n)) {
                locoTypeName = "";
                locoNo = locoTypeStr;
            } else {
                var str = locoTypeStr.split('-');
                if (str.length == 2) {
                    locoTypeName = str[0];
                    locoNo = str[1];
                } else if (str.length > 2) {
                    locoTypeName += str[0];
                    for (var i = 1; i < str.length - 1; i++) {
                        locoTypeName += ("-" + str[i]);
                    }
                    locoNo = str[str.length - 1];
                } else if (str.length < 2) {
                    locoTypeName = locoTypeStr;
                }
            }
            return {
                locoTypeName: locoTypeName,
                locoNo: locoNo
            };
        };
    });
    RTU.register("app.trainrunninglocus.query.deactivate", function () {
        return function () {
            if (popuwnd_onlleft) {
                popuwnd_onlleft.hidden();
                $(".playSchedule").remove();
                $(".locusShowData").remove();
                locusControl.removeMarker();
                RTU.invoke("map.marker.showCarMarker");
                RTU.invoke("map.marker.showguDaoMarker");
                RTU.invoke("map.removeAllGraphics");
                RTU.invoke("map.showPointPointType", { show: true, pointType: "station" });
            }
            window.locusControl.removeStatus();
            psModel.cancelScribe("refreshData", window.trainrunninglocusRefresh);
            window.psModel.runControl("refreshData", window.homeTimer, true);
            psModel.searchNow({ token: window.homeTimer });
        };
    });
    RTU.register("app.trainrunninglocus.query.initBut", function () {
        return function () {
        };
    });
    var tempImgObj = { "0": "NO.png", "1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
    function getImgUrl(id) {
        if (tempImgObj[id.toString()])
            return "../static/img/app/moveCurve/" + tempImgObj[id.toString()];
        else {
            return "../static/img/app/moveCurve/NO.png";
        }
    }
});
