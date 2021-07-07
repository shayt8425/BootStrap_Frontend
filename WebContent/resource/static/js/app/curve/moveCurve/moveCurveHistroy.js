/**
 * 模块名：运行曲线--result--历史
 * name：trainrunningcurve
 * date:2015-2-12
 * version:1.0 
 */
//处理运行曲线的函数
//请求html
MoveCurveHistroy.countId = 0;

function MoveCurveHistroy(obj) {
    this.htmlUrl = obj.htmlUrl || "";
    this.data = null;
    this.itemData = obj.itemData || null;
    this.html = "";
    this.dataUrl = obj.dataUrl || "";
    this.timer = obj.timer || 5; //5秒之后刷新
    var that = this;
    this.pndWin = null;
    this.id = "hishtmlId" + MoveCurveHistroy.countId++;
    this.top = obj.top || 60;
    this.left = obj.left || 590;
    this.distanceLast = 0; //上一次距离公里表的位置
    this.setSpeedLineLastP = null; //实时速度的上一次速度
    this.MaxSpeedLineLastP = null; //最大速度的上一次速度
    this.guanYaP = null; //管压位置
    this.turnSpeedLast = null; //转速
    this.gangyaLast = null; //钢压力
    this.scroolLeft = 0; //整体偏移量
    this.carP = 0; //机车位置
    this.MiddleLineLeft = 0;
    this.xinHaoDistance = 0;
    this.xhcount = 0;
    this.pageXc = 0;
    this.isMove = true; //控制移动函数
    this.lastScroolLeft = 0;
    this.wX = 372; // 容器的宽度 
    this.wH = 170; //容器的高度
    this.lastSignalId = 0;
    this.timerCount = null; //计时器
    this.lLoadDataResult = []; //贮存返回的数据
    this.playCount = 0; //录像已播放条数
    this.mouseUpLastX = 0; //拖动最后放起的left值
    this.init(that);
}
MoveCurveHistroy.prototype.init = function (that) {
    //加载html数据
    this.html = this.loadHtml(this.htmlUrl, function (html) {
        var html = "<div id='" + that.id + "'>" + html + "</div>";
        var pwTextName = that.itemData ? "运行曲线-" + that.itemData.name : "运行曲线";
        that.pndWin = new PopuWnd({
            title: pwTextName,
            html: html,
            width: 507,
            height: 422,
            left: that.left,
            top: that.top,
            shadow: true
        });
        that.pndWin.init();
        $("#" + that.id).parent().prev().find(".popuwnd-title-del-btn").click(function () {
            if (that.timerCount) {
             clearInterval(that.timerCount);
            }
        });
        that.initMoudleEvent(that);
        //赋值对应的文本框
        that.loadData(that);
        //初始化可拖动事件
        that.drawMiddleLine(that);
    });
    return that.pndWin;
};
MoveCurveHistroy.prototype.initMoudleEvent = function (tempthis) {
    var clicktemp = false;
    //初始化回放速度控制
    var thist = "#" + tempthis.id + " .moveDrawImgDiv";
    $(thist).mousedown(function (e) {

        clicktemp = true;
        $(this).css("cursor", "pointer");
        var position = $(thist).position();
        var x = e.pageX - position.left;
        var y = e.pageY - position.top;
        setLineWidth(position.left);
        var tw = $(thist).width() / 2 - 8;
        var th = $(thist).height() / 2 - 8;
        $(document).bind("mousemove.dragPoint", function (ev) {
            if (tempthis.timerCount)
                clearInterval(tempthis.timerCount);
            var _x = ev.pageX - x; //获得X轴方向移动的值
            var _y = ev.pageY - y; //获得Y轴方向移动的值    
            if (_x < tw) _x = tw;
            if (_y < th) _y = th;
            if (_x > $(thist).parent().width() - tw) _x = $(thist).parent().width() - tw;
            if (_y > $(thist).parent().height() - th) _y = $(thist).parent().height() - th;
            $(thist).css({ left: _x + "px" });
            tempthis.mouseUpLastX = _x;
            setLineWidth(_x);
            return false;
        });
        e.stopPropagation();
        return false;
    });
    $("#" + tempthis.id + " .moveDrawSpeed").bind("mouseup.dragPoint", function (e) {
        $(thist).css("cursor", "default");
        $(document).unbind("mousemove.dragPoint");
        clicktemp = false;
        if (tempthis.timerCount)
            clearInterval(tempthis.timerCount);
        tempthis.controlPlayPlace(tempthis.mouseUpLastX);
    });
    $(thist).parent().mousedown(function (e) {
        if (clicktemp == false) {
            tempthis.mouseUpLastX = e.offsetX;
            if (tempthis.timerCount)
                clearInterval(tempthis.timerCount);
            setLineWidth(e.offsetX);
            $(thist).css({ left: e.offsetX + "px" });
            tempthis.playCount = parseInt(tempthis.lLoadDataResult.length * e.offsetX / 175);
            tempthis.controlPlayPlace(e.offsetX);
        }
        return false;
    });
    function setLineWidth(w) {
        $("#" + tempthis.id + " .moveDragLine").width(w);
    }
    var tNum = tempthis.timer;
    //提速
    $("#" + tempthis.id + " .ff_icon_nor").click(function () {

        var sn = parseInt($("#" + tempthis.id + " .moveDrawSpeedNum").text());
        sn++;
        if (sn > 5) {
            sn = 5;
        }
        tempthis.timer = tNum / (sn * 4);
        tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
        $("#" + tempthis.id + " .moveDrawSpeedNum").text("");
        $("#" + tempthis.id + " .moveDrawSpeedNum").text(sn);
    });
    //减速
    $("#" + tempthis.id + " .rew_icon_nor").click(function () {
        var sn = parseInt($("#" + tempthis.id + " .moveDrawSpeedNum").text());
        sn--;
        if (sn <= 1) {
            sn = 1;
        }
        if (sn == 1) {
            tempthis.timer = 5;
        }
        else {
            tempthis.timer = tNum / (sn * 4);
        }
        tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
        $("#" + tempthis.id + " .moveDrawSpeedNum").text("")
        $("#" + tempthis.id + " .moveDrawSpeedNum").text(sn)
    });
    //停止
    $("#" + tempthis.id + " .stop_icon_nor").click(function () {
        if (tempthis.timerCount)
            clearInterval(tempthis.timerCount);
        tempthis.clearSvg();
        $("#" + tempthis.id + " .moveWayLabel").empty();
        $("#" + tempthis.id + " .moveDrawImgDiv").css("left", 0);
        $("#" + tempthis.id + " .moveDragLine").width(0);
        tempthis.playCount = 0;
        $("#" + tempthis.id + " .moveCountNum").text(" " + tempthis.playCount + "/" + tempthis.lLoadDataResult.length);
    });
    //点击换图片
    $("#" + tempthis.id + " .movePlayBtn").click(function () {
        tempthis.defaultSet();
        $(this).attr("src", $(this).attr("tempsrc"));
        $("#" + tempthis.id + " .pause_icon_nor").attr("src", $("#" + tempthis.id + " .pause_icon_nor").attr("rsrc"));
    });
    //暂停和播放
    $("#" + tempthis.id + " .pause_icon_nor").click(function (e) {
        e.stopPropagation();
        tempthis.defaultSet();
        if ($(this).attr("src").indexOf("pause_icon_nor") != -1) {
            $(this).attr("src", $(this).attr("tempsrc"));
            tempthis.pause(e, "#" + tempthis.id + " .pause_icon_nor");
        } else {
            $(this).attr("src", $(this).attr("rsrc"));
            tempthis.play(e, "#" + tempthis.id + " .pause_icon_nor");
        }
    });
    
    //选择车站
    $("#" + tempthis.id + " .curveSelectSationImg").click(function(){
    	if($(this).attr('src').indexOf('curveSearch_icon_nor')!=-1){
    		$(this).attr('src','../static/img/app/moveCurve/curveSearch_icon_pre.png');
    		 $("#" + tempthis.id + " .selectSationDiv").show();	
    		
    	}else{
    		$(this).attr('src','../static/img/app/moveCurve/curveSearch_icon_nor.png');
    		 $("#" + tempthis.id + " .selectSationDiv").hide();	
    	}

    });
    //点击搜索车站
    $("#" + tempthis.id + " .selectSationBtn").click(function(){
        var item = tempthis.lLoadDataResult;
        var stext =$("#" + tempthis.id + " .selectSationInput").val();
        var counti= 0;
        for(var i=0;i<item.length;i++){
        	if(item[i].sName.indexOf(stext)!=-1){
        		counti = i;
        		break;
        	}
        }
        tempthis.clearSvg();
        tempthis.playCount =i-1;   
        tempthis.setDataToScreen(item, tempthis,"",true);
    
    });
    
}
//播放状态 true为正在播放 flase 为暂停
MoveCurveHistroy.prototype.playStatus = function () {
    if ($("#" + this.id + " .pause_icon_nor").attr("src").indexOf("pause_icon_nor") != -1) {
        //播放中 
        return true;
    } else {
        return false;
    }
}
//播放控制图标设置成默认值
MoveCurveHistroy.prototype.defaultSet = function () {
    $("#" + this.id + " .movePlayBtn").each(function (i, item) {
        $(item).attr("src", $(item).attr("rsrc"));
    });
}
//暂停播放
MoveCurveHistroy.prototype.pause = function (e,targetStr) {
    this.defaultSet();
    if (this.timerCount)
        clearInterval(this.timerCount);
}
//播放
MoveCurveHistroy.prototype.play = function (e, targetStr) {
    this.defaultSet();
    this.setDataToScreen(this.lLoadDataResult, this);
}

MoveCurveHistroy.prototype.controlPlayPlace = function (x) {
    var countNum = parseInt(this.lLoadDataResult.length * x / 175);
    this.setDataToScreen(this.lLoadDataResult, this, countNum);
}
MoveCurveHistroy.prototype.returnWin = function () {
    return this.pndWin;
}
MoveCurveHistroy.prototype.clearSvg = function () {
    $("#" + this.id + " svg").remove();
    $("#" + this.id + " .moveWayLabelDiv").remove();
    $("#" + this.id + " .moveWayNum").remove();
    
}
MoveCurveHistroy.prototype.setDataToScreen = function (datat, that, countNum,jump) {

    if (countNum) {
        //        if (that.timerCount)
        //            clearInterval(that.timerCount);
        that.clearSvg();
        that.playCount = countNum - 1;
        //        for (var i = 0; i < countNum; i++) {
        //            setDataToSByCount(datat[countNum], that);
        //        }
    }
    if (!this.playStatus()) {
        return;
    }
    if (that.timerCount)
        clearInterval(that.timerCount);
    
    if(jump){
    	  that.playCount++;
          if (that.playCount == datat.length + 1) {
              clearInterval(that.timerCount);
              that.playCount = 0;
              return;
          }
          //播放进度条
          controlmoveDrawImg(datat);
          //记录
          recordCount();
          data = datat[that.playCount];
          setDataToSByCount(data, that);
    }
    
    that.timerCount = setInterval(function () {
        that.playCount++;
        if (that.playCount == datat.length + 1) {
            clearInterval(that.timerCount);
            that.playCount = 0;
            return;
        }
        //播放进度条
        controlmoveDrawImg(datat);
        //记录
        recordCount();
        data = datat[that.playCount];
        setDataToSByCount(data, that);
    }, that.timer * 1000);
    function setDataToSByCount(data, that) {
        if (data.jkstate == "异常") {
            $("#" + that.id + " .moveErrorPage").show();
            $("#" + that.id + " .moveShowDiv .moveSpeed").text(data.speed ? data.speed : "0"); //速度
            $("#" + that.id + " .moveShowDiv .moveRestrictSpeed").text(data.limitSpeed); //限制最高速度
            $("#" + that.id + " .moveShowDiv .moveDistance").text(data.distance); //距离
            $("#" + that.id + " .moveShowDiv .moveSD_D").text("--"); //信号里程
            var d = null;
            if (data.date) {
                d = new Date(data.date);
            }
            else {
                d = new Date();
            }
            $("#" + that.id + " .moveShowDiv .moveDate").text((d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
            $("#" + that.id + " .moveShowDiv .moveTimeDiv").text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
            $("#" + that.id + " .moveShowEngine .turnSpeed").text("--");
            $("#" + that.id + " .moveShowEngine .guangya").text("--");
            $("#" + that.id + " .moveShowEngine .gangya").text("--");
            $("#" + that.id + " .moveShowEngine .fenggang1").text("--");
            $("#" + that.id + " .moveShowEngine .fenggang2").text("--");
            $("#" + that.id + " .moveSD_S").text("--");
            $("#" + that.id + " .sdStatus .sdYTarget").removeClass("sdVisible");
            if (data.sdinfo == 0) {
            } else if (data.sdinfo == 1) {
                $("#" + that.id + " .sdStatus .sdinfo1").addClass("sdVisible");
            }
            else if (data.sdinfo == 2) {
                $("#" + that.id + " .sdStatus .sdinfo2").addClass("sdVisible");
            }
            else if (data.sdinfo == 3) {
                $("#" + that.id + " .sdStatus .sdinfo3").addClass("sdVisible");
            }
            else if (data.sdinfo == 4) {
                $("#" + that.id + " .sdStatus .LC_Y").addClass("sdVisible");
            }
            that.setLinePlace(data, true);
        }
        else {
            $("#" + that.id + " .moveErrorPage").hide();
            that.setData(data, that);
        }
    };
    function controlmoveDrawImg(datat) {
        var left = 175 * that.playCount / datat.length;
        $("#" + that.id + " .moveDrawImgDiv").css("left", left);
        $("#" + that.id + " .moveDragLine").width(left);
        if (that.playCount == datat.length) {
            that.defaultSet();
            $("#" + that.id + " .pause_icon_nor").attr("src", $("#" + that.id + " .pause_icon_nor").attr("tempsrc"));

        }
    }
    function recordCount() {
        $("#" + that.id + " .moveCountNum").text(" " + that.playCount + "/" + that.lLoadDataResult.length);
    }
}
MoveCurveHistroy.prototype.loadData = function (that,station) {
    var tempurl = that.dataUrl.indexOf("?") == -1 ? that.dataUrl + "?" + new Date().getTime() : that.dataUrl + "&" + new Date().getTime();
    if(station){
    	tempurl=tempurl.replace("&station=","");
    	tempurl+="&station="+station;
    }
    
    $.ajax({
        url: tempurl,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
            that.lLoadDataResult = data.data;
            that.setDataToScreen(data.data, that);
        }
    });
};
MoveCurveHistroy.prototype.setData = function (data, that) {
    if (data) {
        $("#" + this.id + " .moveShowDiv .moveSpeed").text(data.speed); //速度
        $("#" + this.id + " .moveShowDiv .moveRestrictSpeed").text(data.limitSpeed); //限制最高速度
        $("#" + this.id + " .moveShowDiv .moveDistance").text(data.distance); //距离
        $("#" + this.id + " .moveShowDiv .moveSD_D").text(data.signalDistance / 1000); //信号里程
        var d = new Date(data.date);
        $("#" + this.id + " .moveShowDiv .moveDate").text((d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
        $("#" + this.id + " .moveShowDiv .moveTimeDiv").text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
        $("#" + this.id + " .moveShowEngine .turnSpeed").text(data.turnSpeed);
        $("#" + this.id + " .moveShowEngine .guangya").text(data.guangya);
        $("#" + this.id + " .moveShowEngine .gangya").text(data.gangya);
        $("#" + this.id + " .moveShowEngine .fenggang1").text(data.fenggang1);
        $("#" + this.id + " .moveShowEngine .fenggang2").text(data.fenggang2);
        $("#" + this.id + " .moveSatus img").attr("src", that.tool.getImgUrl(data.locoSignal, that));
        $("#" + this.id + " .sdStatus .sdYTarget").hide();
        if (data.sdinfo == 0) {
        } else if (data.sdinfo == 1) {
            $("#" + this.id + " .sdStatus .sdinfo1").show();
        }
        else if (data.sdinfo == 2) {
            $("#" + this.id + " .sdStatus .sdinfo2").show();
        }
        else if (data.sdinfo == 3) {
            $("#" + this.id + " .sdStatus .sdinfo3").show();
        }
        else if (data.sdinfo == 4) {
            $("#" + this.id + " .sdStatus .LC_Y").show();
        }
    }
    //根据数值初始化各条线的位置
    that.setLinePlace(data);
};
MoveCurveHistroy.prototype.drawMiddleLine = function (that) {
//    $("#" + this.id + " .moveBottomContainDiv").mousedown(function (e) {
//        that.isMove = false;
//        $(this).css("cursor", "move");
//        var of = 0;
//        var count = 0;
//        $(this).bind("mousemove", function (e) {
//            if (count > 0) {
//                var left = of - e.clientX;
//                of = e.clientX;
//                $(this).scrollLeft($(this).scrollLeft() + left);
//            } else {
//                count++;
//                of = e.clientX;
//            }
//        });
//    }).mouseenter(function () {
//        $(this).css("cursor", "move");
//    }).mouseup(function (e) {
//        $(this).unbind("mousemove");
//        setTimeout(function () {
//            that.isMove = true;
//        }, that.timer * 1000);
//        return false;
//    });
//    $("body").mouseup(function () {
//        $("#" + that.id + " .moveBottomContainDiv").unbind("mousemove");
//        setTimeout(function () {
//            that.isMove = true;
//        }, that.timer * 1000);
//    })
};
MoveCurveHistroy.prototype.setLinePlace = function (data, isError) {
    //设置实时速度线
    this.setLine(data, isError);
};
MoveCurveHistroy.prototype.setLine = function (data, isError) {
    this.xhcount++;
    //根据速度转化成坐标
    var sp = data.speed; //实时速度
    var lm = data.limitSpeed; //最高速度
    var gy = data.guangya; //管压
    var gangy = 200; // data.gangya; //缸压力
    var turnSpeed = data.turnSpeed//转速
    if (!this.setSpeedLineLastP) {//如果是第一次进入
        //定义当前的x轴一半原点
        var x = this.wX / 2;
        //算出第一个坐标点的y轴位置 350为假定的最高速度
        var y = this.wH * sp / 350;
        this.setSpeedLineLastP = [x, (this.wH - y)];
        this.MaxSpeedLineLastP = [x, (this.wH - this.wH * lm / 350)];
        this.scroolLeft = $("#" + this.id + " .moveBottomContainDiv").scrollLeft();
        this.MiddleLineLeft = this.tool.getLeft("#" + this.id + " .moveMiddleLine");
        this.carP = this.tool.getLeft("#" + this.id + " .currentTrain"); //机车位置
        this.guanYaP = [x, 70 - 70 * gy / 800];
        this.gangyaLast = [x, 70 - 70 * gangy / 800];
        this.turnSpeedLast = [x, (this.wH - this.wH * turnSpeed / 1800)];
        this.lastSignalId = data.signalNo;
        this.AddSignal(data, this.MiddleLineLeft);
        this.distanceLast = data.distance;
    }
    else { //否则根据上一次的点 和这次的点画线
        //已知 界面的总长度是5公里左右
        //这次5秒更新所走的距离
        var newD = Math.abs(data.distance - this.distanceLast);
        if ((data.distance - this.distanceLast) > 0) {
            newD = Math.abs(this.distanceLast);
        }
        if (!newD) newD = 0;
        //计算这个距离在座标上面的距离
        var newW = newD * this.wX / 5000;
        var nx = this.setSpeedLineLastP[0] + newW;
        var nyp = this.wH - (this.wH / 350) * sp;
        var nyl = this.wH - (this.wH / 350) * lm;
        var ngy = 70 - (70 / 800) * gy;
        var ngangy = 70 - (70 / 800) * gangy;
        var nturnSpeed = this.wH - (this.wH / 1800) * turnSpeed;
        //  this.tool.drawSvgLine({ color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0], startY: this.setSpeedLineLastP[1], endX: nx, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
        if (isError) {
            //画实速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0], startY: this.setSpeedLineLastP[1], endX: nx, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
            //画限速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
        }
        else {
            //画实速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0], startY: this.setSpeedLineLastP[1], endX: nx, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
            //画限速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
            //画转速
            this.tool.drawSvgLine({ htmlId: this.id, color: 'yellow', lineName: "lineYellow", startX: this.turnSpeedLast[0], startY: this.turnSpeedLast[1], endX: nx, endY: nturnSpeed, containerId: $("#" + this.id + " .moveBottomSpeed") });
            //画管压线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'blue', lineName: "lineBlue", startX: this.guanYaP[0], startY: this.guanYaP[1], endX: nx, endY: ngy, containerId: $("#" + this.id + " .movePipePressure") });
            //画缸压力线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen1", startX: this.gangyaLast[0], startY: this.gangyaLast[1], endX: nx, endY: ngangy, containerId: $("#" + this.id + " .movePipePressure") });
        }
        //中间黄线移动到最新位置
        this.MiddleLineLeft += newW;
        this.tool.setLeft("#" + this.id + " .moveMiddleLine", this.MiddleLineLeft);
        //容器长度加nx然后整体往左移动nx
        $("#" + this.id + " .moveBottomSpeed").css("width", this.tool.getWidth("#" + this.id + " .moveBottomSpeed") + newW);
        //移动机车位置
        this.moveCar(newW);
        //出信号点 
        if (this.lastSignalId != data.signalNo && !isError) {
            this.AddSignal(data, this.MiddleLineLeft);
            this.lastSignalId = data.signalNo;
        }
        //管压
        $("#" + this.id + " .movePipePressure").css("width", this.tool.getWidth("#" + this.id + " .movePipePressure") + this.MiddleLineLeft);
        if (this.isMove) {
            if (this.lastScroolLeft) {
                newW += this.lastScroolLeft;
                this.lastScroolLeft = 0;
            }
            this.move(newW);
        }
        else {
            this.lastScroolLeft += newW;
        }
        this.setLastArr({ nx: nx, nyp: nyp, nyl: nyl, ngy: ngy, ngangy: ngangy, nturnSpeed: nturnSpeed });
        this.distanceLast = data.distance;
    }
};
//添加信号机
MoveCurveHistroy.prototype.AddSignal = function (data, newSL) {
    $("#" + this.id + " .moveSD_S").text(data.signalName + "" + data.signalNo);
    var newXd = data.distance * this.wX / 5000;
    //计算这个距离在座标上面的距离
    var newxinhaoleft = newSL + newXd;
    //$(".moveWayLabelDiv .moveC").removeClass("movePGreen").addClass("movePGray");
    var newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/xhjPoint.png' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft).attr("id", "xhid" + data.signalId);
    if (data.signalName == "进站") {
        newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/xhjPoint.png' alt='' /><img style='top:12px;'  src='../static/img/app/moveCurve/xhjPoint-1.png' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft).attr("id", "xhid" + data.signalId);
    }
    $("#" + this.id + " .moveBottomSpeed").append(newXP);
    //画公里表
    var ki = $('<div class="moveWayNum"><div class="moveHLine"></div><div class="moveWayN_Num">' + (data.kiloSign / 1000) + '</div></div>').css("left", newxinhaoleft);
    $("#" + this.id + " .moveWayLabel").append(ki);
    $("#" + this.id + " .moveWayLabel").css("width", this.tool.getWidth("#" + this.id + " .moveWayLabel") + newxinhaoleft);
};
//移动机车
MoveCurveHistroy.prototype.moveCar = function (newW) {
    this.carP += newW;
    this.tool.setLeft("#" + this.id + " .currentTrain", this.carP);
};
//给记录数组赋值
MoveCurveHistroy.prototype.setLastArr = function (data) {
    this.setSpeedLineLastP = [data.nx, data.nyp];
    this.MaxSpeedLineLastP = [data.nx, data.nyl];
    this.guanYaP = [data.nx, data.ngy];
    this.gangyaLast = [data.nx, data.ngangy];
    this.turnSpeedLast = [data.nx, data.nturnSpeed];
};
//移动
MoveCurveHistroy.prototype.move = function (newW) {
    this.scroolLeft += newW;
    $("#" + this.id + " .moveBottomContainDiv").scrollLeft(this.scroolLeft);
};
MoveCurveHistroy.prototype.loadHtml = function (url, fncb) {
    RTU.invoke("core.router.load", {
        url: url,
        async: false,
        success: function (html) {
            if (fncb) {
                fncb(html);
            }
        }
    });
}
MoveCurveHistroy.prototype.tool = {
    getLeft: function (selectStr) { //获取left
        return parseInt($(selectStr).css("left").substring(0, $(selectStr).css("left").length - 2));
    },
    setLeft: function (selectStr, value) {
        $(selectStr).css("left", value);
    },
    getWidth: function (selectStr) {
        return parseInt($(selectStr).css("width").substring(0, $(selectStr).css("width").length - 2));
    },
    getHeight: function (selectStr) {
        return parseInt($(selectStr).css("height").substring(0, $(selectStr).css("height").length - 2));
    },
    drawLine: function (obj) {
        var startX = obj.startX || 0;
        var startY = obj.startY || 0;
        var endX = obj.endX || 0;
        var endY = obj.endY || 0;
        var className = obj.className || "line";
        var container = obj.containerId; //$ 对象
        if (!container) return;
        if (startX == endX) {
            if (startY > endY) {
                var tempY = startY;
                startY = endY;
                endY = tempY;
            }
            for (var k = startY; k < endY; k++) {
                createPoint(container, startX, k);
            }
        }
        var a = (startY - endY) / (startX - endX);
        var b = startY - ((startY - endY) / (startX - endX)) * startX;
        if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
            if (startX > endX) {
                var tempX = endX;
                endX = startX;
                startX = tempX;
            }
            for (var i = startX; i <= endX; i++) {
                createPoint(container, i, a * i + b);
            }
        } else {
            if (startY > endY) {
                var tempY = startY;
                startY = endY;
                endY = tempY;
            }
            for (var j = startY; j <= endY; j++) {
                createPoint(container, (j - b) / a, j);
            }
        }
        function createPoint(container, x, y) {
            var node = $("<div></div>");
            node.addClass(className).css({ "margin-top": y, "margin-left": x });
            container.append(node);
        }
    },
    drawSvgLine: function (obj) {
        var startX = obj.startX || 0;
        var startY = obj.startY || 0;
        var endX = obj.endX || 0;
        var endY = obj.endY || 0;
        var color = obj.color || "red";
        var container = obj.containerId; //$ 对象
        var moduleName = obj.moduleName || container.attr('class');
        var lineName = obj.lineName || "line";
        if (!container) return;
        var svgId = '#' + obj.htmlId + ' .svg' + lineName;
        var lineId = 'svg' + lineName + "line";
        if ($(svgId).length == 0) {
            container.append('<svg style="position: absolute;top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"  points=' + startX + ',' + startY + ' ' + startX + ',' + startY + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        }
        $(svgId).attr({ "width": obj.containerId.width(), "height": obj.containerId.height() });
        var line = $(svgId + " ." + lineId)[0];
        if (line.getAttributeNS) {
            var points = line.getAttributeNS(null, 'points').split(' ');
            points[points.length - 1] = endX + "," + endY;
            line.setAttributeNS(null, 'points', points.join(' '));
            var line1 = line.getAttributeNS(null, 'points').split(' ');
            var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1];
            line.setAttributeNS(null, 'points', linepoint);
        }
    },
    imgurl0bj:  { "0": "NO.png", "1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" },
    getImgUrl: function (id, that) {
        return "../static/img/app/moveCurve/" + that.tool.imgurl0bj[id.toString()];
    }
};