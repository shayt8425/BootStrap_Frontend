/**
 * 模块名：运行曲线--result--实时
 * name：trainrunningcurve
 * date:2015-2-12
 * version:1.0 
 */
//处理运行曲线的函数
//请求html
MoveCurve.countId = 0;
function MoveCurve(obj) {
	this.lastSignalFlag=false;
	/*this.firstFlag=true;//20160615邓国知新加,标识首次进入
*/    this.htmlUrl = obj.htmlUrl || "";
    this.data = null;
    this.itemData = obj.itemData || null;
    this.html = "";
    this.dataUrl = obj.dataUrl || "";
    this.moveTimer = obj.moveTimer || 5; //5秒之后刷新
    var that = this;
    this.pndWin = null;
    this.id = "htmlId" + MoveCurve.countId++;
    this.top = obj.top || 60;
    this.left = obj.left || 590;
    this.distanceLast = 0; //上一次距离公里表的位置
    this.setSpeedLineLastP = null; //实时速度的上一次速度
    this.MaxSpeedLineLastP = null; //最大速度的上一次速度
    this.guanYaP = null; //管压位置
    this.turnSpeedLast = null; //转速
    this.gangyaLast = null; //钢压力
    this.scroolLeft = 0; //整体偏移量
    this.lastDate = 0; //时间
    this.carP = 0; //机车位置
    this.MiddleLineLeft = 0;
    this.xinHaoDistance = 0;
    this.xhcount = 0;
    this.pageXc = 0;
    this.isMove = false; //控制移动函数
    this.lastScroolLeft = 0;
    this.wX = 372; // 容器的宽度 
    this.wH = 234; //容器的高度
    this.hrangeNum = 330; //y轴数值范围
    this.lastSignalId = 0;
    this.segmentationData = null; //分割数据的data
    this.nowPlayData = []; //实时加载的数据
    this.nowPlayCount = 0;
    this.timerCount = null; //计时器
    this.lLoadDataResult = []; //贮存返回的数据
    this.playCount = 0; //录像已播放条数
    this.mouseUpLastX = 0; //拖动最后放起的left值
    this.childTimersArr = [];
    this.locoTypeid = obj.locoTypeid; //机车型号
    this.locoNo = obj.locoNo; //机车号
    this.locoAb = obj.locoAb;
    this.loadHisDataTagTime = 0; //历史数据分量加载标记
    this.arrSation = []; //记录站名
    this.totalNum = 0; //历史记录总条数
    this.DateNow = null;
    this.isLoadCp = false; //是否加载完成
    this.moveHisItem = []; //记录加载过的数据，用于拖动
    this.moveItem = []; //记录加载过的数据，用于拖动（实时）
    this.loadHisDataTag = false; //第一次加载数据的时候默认加载一些数据
    this.isNowPlay = true; //是实时还是历史
    this.maxSpeedValue = 300; //左边y轴
    this.isSmallWin = true; //是否小窗口状态
    this.playBarLength = 175; //播放调长度
    this.guanyNumHeight = 70; //管压的部分高度
    this.lightColorisChange = true; //记录信号机的状态是否改变
    this.isLargerWin = true; //默认是不是大窗口 true 代表大窗口
    this.largerBtn = null;
    this.moveLightBar = null;
    this.isTurnSingal = false; //是否信号机改变标志
    this.isSingular = false; //是否出于异常状态
    this.lastSingular = false; //上一次是否异常状态
    this.drawStationFlag=false;//如果该值为真，则在后续数据加载中如果加载到出站信号机，则需要在画下一个信号机之前画车站
    this.lastSignalType=0;//上一个信号机类型,如果上一个信号机是接车进路或者进站信号机,而下一个信号机是接发车进路信号机,也需要画一个车站,因为后面就不会再有出站或者发车进路信号机了
    this.quXian=1;//曲线标识
    this.shiMo=false;
    this.isOnline=obj.isOnline;//是否在线
    this.endTime="";//结束时间
	this.beginTime="";//开始时间
    var falg;
    if (obj.hasOwnProperty('isMaxMin')) {//从菜单 列车运行曲线入口进入时显示小窗口   其它地方进入则显示大窗口
    	falg=false;//false 代表小窗口
    }else{
    	falg=true;//true 代表大窗口
    }
    this.isLargerWin=falg;
    this.init(that);
    init(this.isLargerWin,that);
}
function init(isLargerWin,that){
	 $("#"+that.id+" .leftTime").addClass("showLeftTime");
	if(isLargerWin){//大窗口
	}else{
		 $("#"+that.id+" .moveShowHisDiv").addClass("min-moveShowHisDiv");//小窗口时
		 $("#"+that.id+" .showFrontStation").css("width","60px");
		 $("#"+that.id+" .leftTitle").css("display","none");
	}
}
var MaxValue=-88;//大窗口内容整体向左移动
var minValue=40;//小窗口整体向右移动
MoveCurve.prototype.init = function (that) {
    //加载html数据
    this.html = this.loadHtml(this.htmlUrl, function (html) {//根据html路径加载html页面
        //取得html数据后初始化窗口
        var html = "<div id='" + that.id + "'>" + html + "</div>"; //外加一个标记div，用于定位
        var pwTextName = that.itemData ? "运行曲线-" + that.itemData.name : "运行曲线"; //窗口的标题
        that.pndWin = new PopuWnd({
            title: pwTextName,
            html: html,
            width: 580,
            height: 398,
            left: that.left,
            top: that.top,
            shadow: true
        });
        that.pndWin.init(); //初始化
        that.mCDiv = $("#" + that.id); //保存变量
        $(".movecurve_checi", this.mCDiv).val(that.itemData.data.checiName);
        $(".movecurve_driver", this.mCDiv).val(that.itemData.data.drDriverId);
        that.moveLightBar = $(".moveLightBar", that.mCDiv); //彩带变量，避免重复读取
        that.reSetCss(); //用于变换窗口大小时候重新设置css样式
        that.mCDiv.parent().prev().find(".popuwnd-title-del-btn").click(function () {//关闭窗口执行的函数

            var t = setInterval(function () {
                if (that.timerCount) {
                    clearInterval(that.timerCount);
                    clearInterval(t);
                }
            }, 100);
            if (that.itemData.item) {//关闭窗口的时候，列表的数据勾选同时也去掉
                $(that.itemData.item).removeAttr("checked");
            }
            that.moveTimer = 5; //实时的步数默认设置为5

            return false;
        });
        /*if (that.isLargerWin) {//默认是否是大窗口
            that.largerBtn.trigger('click');
        };*/
        //加载数据
        that.loadData(that);
        //初始化可拖动事件
        that.drawMiddleLine(that);
        //初始化事件
        that.initEvent(that);
    });
    return that.pndWin; //返回窗口对象
};
//返回窗口对象
MoveCurve.prototype.returnWin = function () {
    return this.pndWin;
};
MoveCurve.prototype.reSetCss = function () {
	
    var that = this; //保存变量
    var p = this.mCDiv.parent().prev(); //读取窗口的父对象设置窗口变大的样式
   // p.css({ top: "-15px", height: "35px" });
   // $(".popuwnd-title-text", p).css({ top: "3px" });
   // $(".popuwnd-title-center", p).css({ height: "35px" });
   // $(".popuwnd-title-right", p).css({ height: "35px" });
   // $(".popuwnd-title-left", p).css({ height: "35px" });
    var delbtn = $(".popuwnd-title-del-btn", p); //删除按钮的样式
  //  delbtn.addClass("popuwnd-title-del-btn").css({ right: "-2px", top: "0px", height: "20px", width: "33px" });
   /* delbtn.parent().append("<div class='amplifyWin'></div>");
    var largerBtn = $(".amplifyWin", delbtn.parent()).addClass("amplifyWin_small"); //放大按钮
    largerBtn.toggle(function () {//放大按钮的事件
    
         $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_min");
       	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_max");

        largerBtn.removeClass("amplifyWin_small").addClass("amplifyWin_larger");
        if ($(".moveHisControlR", that.mCDiv).css("display") == "block") {//根据是否打开历史状态来设置窗口大小
            that.pndWin.setSize(775, 531); //设置窗口的大小
        }
        else {
            that.pndWin.setSize(775, 507);
        }
        that.wX = 630;
        that.isSmallWin = false;
        that.isLargerWin = true;
        $(".moveTopShowDiv img:first", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/move_larger_03.png");
        $(".moveBottomShowDiv img:eq(1)", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/new-move_larger_13.png");
        $(".moveShowDiv", that.mCDiv).addClass("moveShowDiv_larger");
        $(".moveDate", that.mCDiv).addClass("moveDate_larger");
        $(".moveTimeDiv", that.mCDiv).addClass("moveTimeDiv_larger");
        $(".moveTime", that.mCDiv).addClass("moveTime_larger");
        $(".moveSpeed", that.mCDiv).addClass("moveSpeed_larger");
        $(".moveRestrictSpeed", that.mCDiv).addClass("moveRestrictSpeed_larger");
        $(".moveDistance", that.mCDiv).addClass("moveDistance_larger");
        $(".moveSignDistance", that.mCDiv).addClass("moveSignDistance_larger");
        $(".moveTurnSpeedNum", that.mCDiv).addClass("moveTurnSpeedNum_larger");
        $(".moveSN_N", that.mCDiv).addClass("moveSN_N_larger");
        $(".moveBottomContainDiv", that.mCDiv).addClass("moveBottomContainDiv_larger");
        $(".moveBottomSpeed", that.mCDiv).addClass("moveBottomSpeed_larger");
        $(".movePPNum", that.mCDiv).addClass("movePPNum_larger");
        $(".moveHisControlR", that.mCDiv).addClass("moveHisControlR_larger");
        $(".moveTopShowDiv", that.mCDiv).addClass("moveTopShowDiv_larger");
        $(".moveRightBox", that.mCDiv).addClass("moveRightBox_larger");
        $(".moveLightBar", that.mCDiv).addClass("moveLightBar_larger");
        $(".movePipePressure", that.mCDiv).addClass("movePipePressure_larger");
        $(".curveSelectSation", that.mCDiv).addClass("curveSelectSation_largar");
        $(".moveMoveCountSpeed", that.mCDiv).addClass("moveMoveCountSpeed_larger");
        $(".moveVideotapeSpeed", that.mCDiv).addClass("moveVideotapeSpeed_larger");
        $(".moveDrawSpeed", that.mCDiv).addClass("moveDrawSpeed_larger");
        $(".moveControlSpeedBtn", that.mCDiv).addClass("moveControlSpeedBtn_larger");
        $(".moveBottomShowDiv", that.mCDiv).addClass("moveBottomShowDiv_larger");
        that.playBarLength = 375; //播放加载条
        that.wH = 332; //容器的高度
        that.guanyNumHeight = 80;
        $(".moveBottomSpeed,.movePipePressure,.moveWayLabel,.moveLightBar,.newMoveShowHisDiv", that.mCDiv).width(function (i, v) {//加大个容器的高度
            return parseFloat(v) + 258;
        });
        $(".currentTrain,.moveMiddleLine",that.mCDiv).css("left", function (i, v) {
            return parseFloat(v) + 258;
        });
        if (!that.setSpeedLineLastP) {//设置各个变量的初始化的值
            that.MiddleLineLeft = 521;
            that.carP = 481;
            that.jumpDistance(521);
        } else {
            that.MiddleLineLeft += 258;
            that.carP += 258;
            that.jumpDistance(258);
        };
        that.clearSvg(); //清屏
        that.setLineControlDraw(that.lLoadDataResult); //设置播放加载条的宽度
        
        // 右下方放大时的样式
        $("#"+that.id+" .moveRightBox_larger").css("height","460px");
        $("#"+that.id+" .moveShowHisDiv").css("top","550px");
        $("#"+that.id+" .moveRightBox-right").addClass("max-moveRightBox-right");
        $("#"+that.id+" .moveShowHisDiv").addClass("max-moveShowHisDiv");
        $("#"+that.id+" .moveShowHisDiv").removeClass("min-moveShowHisDiv");
        $("#"+that.id+" .leftTime").addClass("showLeftTime");
        $("#"+that.id+" .showFrontStation").css("width","135px");
        $("#"+that.id+" .showName").removeClass("showName_min");
        $("#"+that.id+" .showName").addClass("showName_max");
        $("#"+that.id+" .leftTitle").css("display","block");
        
    }, function () {//点击放大缩小按钮后的操作
           
    	largerBtn.removeClass("amplifyWin_larger").addClass("amplifyWin_small");
        if ($(".moveHisControlR", that.mCDiv).css("display") == "block") {//根据是否打开历史状态来设置窗口大小
            that.pndWin.setSize(580, 422);//宽度不变   高度增加
        } else {
            that.pndWin.setSize(580, 398);//设置窗口大小    宽度不变  高度减小
        }
        that.wX = 372;
        that.isSmallWin = true;
        that.isLargerWin = false;
        $(".moveTopShowDiv img:first", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/new-move_03.png");
        $(".moveBottomShowDiv img:eq(1)", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/new-move_132.png");
        $(".moveShowDiv", that.mCDiv).removeClass("moveShowDiv_larger");
        $(".moveDate", that.mCDiv).removeClass("moveDate_larger");
        $(".moveTimeDiv", that.mCDiv).removeClass("moveTimeDiv_larger");
        $(".moveTime", that.mCDiv).removeClass("moveTime_larger");
        $(".moveSpeed", that.mCDiv).removeClass("moveSpeed_larger");
        $(".moveRestrictSpeed", that.mCDiv).removeClass("moveRestrictSpeed_larger");
        $(".moveDistance", that.mCDiv).removeClass("moveDistance_larger");
        $(".moveSignDistance", that.mCDiv).removeClass("moveSignDistance_larger");
        $(".moveTurnSpeedNum", that.mCDiv).removeClass("moveTurnSpeedNum_larger");
        $(".moveSN_N", that.mCDiv).removeClass("moveSN_N_larger");
        $(".moveBottomContainDiv", that.mCDiv).removeClass("moveBottomContainDiv_larger");
        $(".moveBottomSpeed", that.mCDiv).removeClass("moveBottomSpeed_larger");
        $(".movePPNum", that.mCDiv).removeClass("movePPNum_larger");
        $(".moveHisControlR", that.mCDiv).removeClass("moveHisControlR_larger");
        $(".moveTopShowDiv", that.mCDiv).removeClass("moveTopShowDiv_larger");
        $(".moveRightBox", that.mCDiv).removeClass("moveRightBox_larger");
        $(".moveLightBar", that.mCDiv).removeClass("moveLightBar_larger");
        $(".movePipePressure", that.mCDiv).removeClass("movePipePressure_larger");
        $(".curveSelectSation", that.mCDiv).removeClass("curveSelectSation_largar");
        $(".moveMoveCountSpeed", that.mCDiv).removeClass("moveMoveCountSpeed_larger");
        $(".moveVideotapeSpeed", that.mCDiv).removeClass("moveVideotapeSpeed_larger");
        $(".moveDrawSpeed", that.mCDiv).removeClass("moveDrawSpeed_larger");
        $(".moveControlSpeedBtn", that.mCDiv).removeClass("moveControlSpeedBtn_larger");
        $(".moveBottomShowDiv", that.mCDiv).removeClass("moveBottomShowDiv_larger");
        that.playBarLength = 175;
        that.wH = 234; //容器的高度
        that.guanyNumHeight = 70;
        $(".moveBottomSpeed,.movePipePressure,.moveWayLabel,.moveLightBar,newMoveShowHisDiv", that.mCDiv).width(function (i, v) {
        	return parseFloat(v) - 184;
        });
        $(".currentTrain,.moveMiddleLine",that.mCDiv).css("left", function (i, v) {
            return parseFloat(v) - 184;
        });
        
        if (!that.setSpeedLineLastP) {
            that.MiddleLineLeft = 521;
            that.carP = 481;
            that.jumpDistance(521);
        } else {
            that.MiddleLineLeft -= 258;
            that.carP -= 258;
            that.jumpDistance(-258);
        };
        that.clearSvg();
        that.setLineControlDraw(that.lLoadDataResult);  
        // 右下方缩小时的样式
        $("#"+that.id+" .moveRightBox-right").removeClass("max-moveRightBox-right");
        $("#"+that.id+" .moveShowHisDiv").removeClass("max-moveShowHisDiv");
        $("#"+that.id+" .moveShowHisDiv").addClass("min-moveShowHisDiv");
        $("#"+that.id+" .moveRightBox_larger").css("height","400px");
        $("#"+that.id+" .moveRightBox").css("height","400px");
        $("#"+that.id+" .moveShowHisDiv").css("top","430px");
        $("#"+that.id+" .showFrontStation").css("width","60px");
        $("#"+that.id+" .leftTime").addClass("showLeftTime");
        $("#"+that.id+" .showName").removeClass("showName_max");
        $("#"+that.id+" .showName").addClass("showName_min");
        $("#"+that.id+" .leftTitle").css("display","none");
        $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_max");
      	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_min");
    });
    this.largerBtn = largerBtn;*/
};

MoveCurve.prototype.Large = function(){
	var that = this;
	$(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_min");
   	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_max");

    if ($(".moveHisControlR", that.mCDiv).css("display") == "block") {//根据是否打开历史状态来设置窗口大小
        that.pndWin.setSize(775, 531); //设置窗口的大小
    }
    else {
        that.pndWin.setSize(775, 507);
    }
    that.wX = 630;
    that.isSmallWin = false;
    that.isLargerWin = true;
    $(".moveTopShowDiv img:first", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/move_larger_03.png");
    $(".moveBottomShowDiv img:eq(1)", that.mCDiv).attr("src", "../static/img/app/app-realtimelocomotivequery-move/new-move_larger_13.png");
    $(".moveShowDiv", that.mCDiv).addClass("moveShowDiv_larger");
    $(".moveDate", that.mCDiv).addClass("moveDate_larger");
    $(".moveTimeDiv", that.mCDiv).addClass("moveTimeDiv_larger");
    $(".moveTime", that.mCDiv).addClass("moveTime_larger");
    $(".moveSpeed", that.mCDiv).addClass("moveSpeed_larger");
    $(".moveRestrictSpeed", that.mCDiv).addClass("moveRestrictSpeed_larger");
    $(".moveDistance", that.mCDiv).addClass("moveDistance_larger");
    $(".moveSignDistance", that.mCDiv).addClass("moveSignDistance_larger");
    $(".moveTurnSpeedNum", that.mCDiv).addClass("moveTurnSpeedNum_larger");
    $(".moveSN_N", that.mCDiv).addClass("moveSN_N_larger");
    $(".moveBottomContainDiv", that.mCDiv).addClass("moveBottomContainDiv_larger");
    $(".moveBottomSpeed", that.mCDiv).addClass("moveBottomSpeed_larger");
    $(".movePPNum", that.mCDiv).addClass("movePPNum_larger");
    $(".moveHisControlR", that.mCDiv).addClass("moveHisControlR_larger");
    $(".moveTopShowDiv", that.mCDiv).addClass("moveTopShowDiv_larger");
    $(".moveRightBox", that.mCDiv).addClass("moveRightBox_larger");
    $(".moveLightBar", that.mCDiv).addClass("moveLightBar_larger");
    $(".movePipePressure", that.mCDiv).addClass("movePipePressure_larger");
    $(".curveSelectSation", that.mCDiv).addClass("curveSelectSation_largar");
    $(".moveMoveCountSpeed", that.mCDiv).addClass("moveMoveCountSpeed_larger");
    $(".moveVideotapeSpeed", that.mCDiv).addClass("moveVideotapeSpeed_larger");
    $(".moveDrawSpeed", that.mCDiv).addClass("moveDrawSpeed_larger");
    $(".moveControlSpeedBtn", that.mCDiv).addClass("moveControlSpeedBtn_larger");
    $(".moveBottomShowDiv", that.mCDiv).addClass("moveBottomShowDiv_larger");
    that.playBarLength = 375; //播放加载条
    that.wH = 332; //容器的高度
    that.guanyNumHeight = 80;
    $(".moveBottomSpeed,.movePipePressure,.moveWayLabel,.moveLightBar,.newMoveShowHisDiv", that.mCDiv).width(function (i, v) {//加大个容器的高度
        return parseFloat(v) + 258;
    });
    $(".currentTrain,.moveMiddleLine",that.mCDiv).css("left", function (i, v) {
        return parseFloat(v) + 258;
    });
    if (!that.setSpeedLineLastP) {//设置各个变量的初始化的值
        that.MiddleLineLeft = 521;
        that.carP = 481;
        that.jumpDistance(521);
    } else {
        that.MiddleLineLeft += 258;
        that.carP += 258;
        that.jumpDistance(258);
    };
    that.clearSvg(); //清屏
    that.setLineControlDraw(that.lLoadDataResult); //设置播放加载条的宽度
    
    // 右下方放大时的样式
    $("#"+that.id+" .moveRightBox_larger").css("height","460px");
    $("#"+that.id+" .moveShowHisDiv").css("top","550px");
    $("#"+that.id+" .moveRightBox-right").addClass("max-moveRightBox-right");
    $("#"+that.id+" .moveShowHisDiv").addClass("max-moveShowHisDiv");
    $("#"+that.id+" .moveShowHisDiv").removeClass("min-moveShowHisDiv");
    $("#"+that.id+" .leftTime").addClass("showLeftTime");
    $("#"+that.id+" .showFrontStation").css("width","135px");
    $("#"+that.id+" .showName").removeClass("showName_min");
    $("#"+that.id+" .showName").addClass("showName_max");
    $("#"+that.id+" .leftTitle").css("display","block");
}
//历史搜索的下拉列表
MoveCurve.prototype.setValueToSationSelect = function (data) {
    var that = this;
    Array.prototype.contains = function (obj) {//给数据添加是否包涵方法
        var i = this.length;
        while (i--) {
            if (this[i] === obj) {
                return true;
            }
        }
        return false;
    };
    function doSetValue(data) {//把车站添加到下拉列表中
        setTimeout(function () {
            var arr = [];
            for (var i = 0, len = data.length; i < len; i++) {
                if (!that.arrSation.contains("<option>" + data[i].sName + "</option>") && data[i].sName) {
                    arr.push("<option>" + data[i].sName + "</option>");
                    that.arrSation.push("<option>" + data[i].sName + "</option>");
                }
            }
            $(".sAnchezhan", that.mCDiv).append(arr.join(""));
            $(".sAnchezhan:first", that.mCDiv).attr("checked", "checked");
        }, 10);
    }
    doSetValue(data);
};
//加载历史数据
var isLoadHisFalg=[];//是否停止加载历史数据
MoveCurve.prototype.loadHisData = function (tempurl, locoTypeid, locoNo, locoAb,url,falg) {
    this.loadHisDataTagTime++; //记录加载次数
    if (this.loadHisDataTagTime == 1) { //如果是第一次加载
        MoveCurve.DateTime = new Date(); //默认当前时间
        this.loadingshow(); //提示加载
    }
    var that = this;
    var t = this.loadHisDataTagTime;
    var th=this.id;		
	var i=th.substring(th.length-1,th.length);
	var URL="";
	var myDate = new Date(); //获取今天日期
		if(falg){//有条件
			if(url!=null&&url!="")
		    URL = "../onlineloco/searchMoveLineByTime?locoTypeid=" + locoTypeid + "&locoNo=" 
		    + locoNo + "&page=" + t + "&pageSize=" + 150 +"&locoAb="+locoAb+"&station="+url;
		}else{//无条件   //无条件查询   默认查询当前历史 一小时  
			if(this.loadHisDataTagTime == 1){
				 this.endTime = myDate.getFullYear()+"-"+(myDate.getMonth()+1)
				 +"-"+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()
				 +":"+myDate.getSeconds();
				 this.beginTime=myDate.getFullYear()+"-"+(myDate.getMonth()+1)
				 +"-"+myDate.getDate()+" "+(myDate.getHours()-1)+":"+myDate.getMinutes()
				 +":"+myDate.getSeconds();
			}
			//20160505 邓国知新加 车次 司机查询
		    var checi=$(".movecurve_checi", this.mCDiv).val();
		    var driver=$(".movecurve_driver", this.mCDiv).val();
		    URL = "../onlineloco/searchMoveLineByTime?locoTypeid=" + locoTypeid + "&locoNo="
		    + locoNo + "&page=" + t + "&pageSize=" + 150 +"&beginTime="+
		    this.beginTime+"&endTime=" + this.endTime + "&locoAb="+locoAb+"&station="
		    +"&checi="+checi+"&driver="+driver;
		}

    this.httpRequest = $.ajax({
        url: URL,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
        	if(!data.success){
        	      that.loadinghide();
        		return;
        	}
            if (that.loadHisDataTagTime == 1) {
                if (!data || data.data.length == 0) {
                    that.showTipMsg("没有历史数据！", 3);
                    that.loadinghide();
                    return;
                }
            }
            if (data && data.data) {
                if (data.totalRecords) {//总记录数
                    that.totalNum = data.totalRecords;
                }
                that.DateNow = data.dateNow;//当前时间
                if (that.loadHisDataTagTime == 1) {
                    that.loadinghide();
                    var imgbtn = $(".ff_icon_nor", that.mCDiv);
                    imgbtn.trigger("click");
                    imgbtn.trigger("click");
                    imgbtn.trigger("click");
                    imgbtn.trigger("click");
                }
                /*if (data.data && data.data.length == 0) {//长度为0时停止
                    that.isLoadCp = true;
                    return;
                }*/
                that.isLoadCp = true;
                that.lLoadDataResult = that.lLoadDataResult.concat(data.data);
                that.setValueToSationSelect(data.data); //历史模式下选择站的下拉框
                that.setDataToScreen(that.lLoadDataResult, that);
                /*if(isLoadHisFalg[i])
                that.loadHisData(tempurl, locoTypeid, locoNo, locoAb,url,falg); //递归调用
*/            } else {
            	if(isLoadHisFalg[i])
                that.loadHisData(tempurl, locoTypeid, locoNo, locoAb,url,falg); //递归调用 
            }
        }
    });
};
//转换成历史模式
MoveCurve.prototype.changeMoudle = function (that,url,falg) {
    this.isNowPlay = false;
    var th=this.id;
	var i=th.substring(th.length-1,th.length);
	//清空数据
     lastTimeErrorData[i]=[];//记录最后一个时间
     xhjTempErrorData[i]=[];//信号机变量
     distanceTempErrorData[i]=[];//前方距离
      lastTime[i]=[];//记录最后一个时间
      xhjTemp[i]=[];//信号机变量
      distanceTemp[i]=[];//前方距离
     
    //停掉计时器
    if (that.timerCount)
        clearInterval(that.timerCount);
    for (var i = 0; i < that.childTimersArr.length; i++) {
        if (that.childTimersArr[i]) {
            clearInterval(that.childTimersArr[i]);
        }
    }
    $(".moveErrorPage", that.mCDiv).hide();
    this.clearSvg(); //清空面板
    //加载历史数据
    this.moveTimer = MoveCurvertimer;
    var locoTypeid = this.locoTypeid;
    var locoNo = this.locoNo;
    var locoAb = this.locoAb;
    //this.loadingshow();
    this.loadHisData(null, locoTypeid, locoNo, locoAb,url,falg);
    this.setDataToScreen(that.lLoadDataResult, that);
};
//显示加载中图标
MoveCurve.prototype.loadingshow = function () {
    $(".loadingDiv", this.mCDiv).show();
};
//隐藏加载中图标
MoveCurve.prototype.loadinghide = function () {
    $(".loadingDiv", this.mCDiv).hide();
};
//回到实时模式
MoveCurve.prototype.returnMoudle = function (that) {

    this.isNowPlay = true;
    var th=this.id;
	var i=th.substring(th.length-1,th.length);
     lastTimeErrorData[i]=[];//记录最后一个时间
     xhjTempErrorData[i]=[];//信号机变量
     distanceTempErrorData[i]=[];//前方距离
     lastTime[i]=[];//记录最后一个时间
     xhjTemp[i]=[];//信号机变量
     distanceTemp[i]=[];//前方距离
     
    //停掉计时器
    if (that.timerCount)
        clearInterval(that.timerCount);
    this.clearSvg(); //清空面板
    this.moveTimer = 5;
    this.loadData(that);
};
//初始化各种事件
var MoveCurvertimer = 5;
MoveCurve.prototype.initEvent = function (tempthis) {
		var that=this;
		var th=this.id;
        var indexObj=th.substring(th.length-1,th.length);
    //点击切换成历史播放状态
    $(".curveHisRea", tempthis.mCDiv).click(function (e) {
        e.stopPropagation();
        tempthis.lLoadDataResult=[];////贮存返回的数据
        setLineWidth(0);//拖放速度 初始为0
        $(".moveDrawImgDiv", tempthis.mCDiv).css("left", 0);//拖放点
        $(".moveCountNum", tempthis.mCDiv).text(" " + 0 + "/" + 0);
        $(".moveHasLoadLine", tempthis.mCDiv).width(0);//灰色进度条宽度
        tempthis.loadHisDataTagTime=0;//请求次数
        tempthis.lastSignalId=0;//上一次的信号机
        tempthis.playCount=0;//回放播放的条数
        tempthis.clearArray();
        tempthis.clearSvg();
        var myDate = new Date();
        var month=myDate.getMonth()+1;
        if(month<10)month="0"+month;
        var day=myDate.getDate();
        if(day<10)day="0"+day;
        var hour=myDate.getHours();
        if(hour<10)day="0"+hour;
        var nextHour=myDate.getHours()-1;
        if(nextHour<10)day="0"+nextHour;
        var minute=myDate.getMinutes();
        if(minute<10)minute="0"+minute;
        var second=myDate.getSeconds();
        if(second<10)second="0"+second;
        
        var  endTime = myDate.getFullYear()+"-"+month+"-"+day+
        " "+hour+":"+minute+":"+second;
	    var beginTime=myDate.getFullYear()+"-"+month+"-"+day+
        " "+nextHour+":"+minute+":"+second;
	    $(".stashijian", tempthis.mCDiv).val(beginTime);
	    $(".endshijian", tempthis.mCDiv).val(endTime);
        if ($(this).attr('src').indexOf('ss_icon_nor.png') != -1) {
        	isLoadHisFalg[indexObj]=true;
        	//弹出选择框
        	if ($(".curveSelectSationImg", tempthis.mCDiv).attr('src').indexOf('curveSearch_icon_nor') != -1) {
           		 $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_pre.png');
                    $(".selectSationDiv", tempthis.mCDiv).show();
                    if (tempthis.isSmallWin) {
                      $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_max");
                    	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_min");
                    }else{
                      $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_min");
                    	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_max");
                    }
            } else {
           	 $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
                $(".selectSationDiv", tempthis.mCDiv).hide();
            }
        	
            $(this).attr('src', '../static/img/app/moveCurve/ss_icon_pre.png');
            if (tempthis.isSmallWin) {
                tempthis.pndWin.setSize(580, 421);
            }
            else {
                tempthis.pndWin.setSize(775, 531);
            }
            $(".moveHisControlR", tempthis.mCDiv).show();
            $(this).parent().css("bottom", "24px");
            if (tempthis.loadHisDataInterval) {
                clearInterval(tempthis.loadHisDataInterval);
            };
            tempthis.isMove = false;
            tempthis.isNowPlay = false;
            tempthis.showTipMsg("已进入历史模式！", 3);
          //停掉计时器
            if (that.timerCount)
                clearInterval(that.timerCount);
            
            $("#"+that.id+" .congQuQiao-left").css("top","461px");
            $("#"+that.id+" .newMoveShowHisDiv").css("top","11px");
            $("#"+that.id+" .congDuanMian").empty();
        	$("#"+that.id+" .quXian").empty();
        	$("#"+that.id+" .daoQiaoSui").empty();
        	$("#"+that.id+" .moveWayLabelDiv1").remove();
        	
        } else {
        	 isLoadHisFalg[indexObj]=false;
        	$(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
            $(this).attr('src', '../static/img/app/moveCurve/ss_icon_nor.png');
            $(".moveHisControlR", tempthis.mCDiv).hide();
            if (tempthis.isSmallWin) {
                tempthis.pndWin.setSize(580, 398);
            }
            else {
                tempthis.pndWin.setSize(775, 508);
            }
            $(this).parent().css("bottom", "0px");
            MoveCurvertimer = tempthis.moveTimer;
            
            tempthis.isMove = false;
            tempthis.isNowPlay =true;
            tempthis.showTipMsg("已进入实时模式！", 3);
            tempthis.returnMoudle(tempthis);

            $("#"+that.id+" .congQuQiao-left").css("top","461px");
            $("#"+that.id+" .newMoveShowHisDiv").css("top","11px");
            $("#"+that.id+" .congDuanMian").empty();
        	$("#"+that.id+" .quXian").empty();
        	$("#"+that.id+" .daoQiaoSui").empty();
        	$("#"+that.id+" .moveWayLabelDiv1").remove();
        }
        return false;
    });
    var clicktemp = false;
    //初始化回放速度控制
    var thist = "#" + tempthis.id + " .moveDrawImgDiv";
    $(thist).mousedown(function (e) {
        tempthis.isMove = false;
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
    $(".moveDrawSpeed", tempthis.mCDiv).bind("mouseup.dragPoint", function (e) {
        $(thist).css("cursor", "default");
        $(document).unbind("mousemove.dragPoint");
        clicktemp = false;
        var playNum = parseInt(tempthis.totalNum * tempthis.mouseUpLastX / tempthis.playBarLength);
        if (playNum > tempthis.lLoadDataResult.length) {
            RTU.invoke("header.msg.show", "此处数据还没有加载！");
            setTimeout(function () {
                RTU.invoke("header.msg.hidden");
            }, 1500);
            return;
        }
        if (tempthis.timerCount)
            clearInterval(tempthis.timerCount);
        tempthis.controlPlayPlace(tempthis.mouseUpLastX);
    });
    //兼容火狐浏览器的函数，用于计算拖动点到边上面的距离
    function getOffset(e) {
        var target = e.target;
        if (target.offsetLeft == undefined) {
            target = target.parentNode;
        }
        var pageCoord = getPageCoord(target);
        var eventCoord =
  {     //计算鼠标位置（触发元素与窗口的距离）
      x: window.pageXOffset + e.clientX,
      y: window.pageYOffset + e.clientY
  };
        var offset =
  {
      offsetX: eventCoord.x - pageCoord.x,
      offsetY: eventCoord.y - pageCoord.y
  };
        return offset;
    }
    function getPageCoord(element)    //计算从触发到root间所有元素的offsetLeft值之和。
    {
        var coord = { x: 0, y: 0 };
        while (element) {
            coord.x += element.offsetLeft;
            coord.y += element.offsetTop;
            element = element.offsetParent;
        }
        return coord;
    }

    //拖动控制条
    $(thist).parent().mousedown(function (e) {
        tempthis.isMove = false;
        if (clicktemp == false) {
            if (!e.offsetX) {
                e.offsetX = getOffset(e).offsetX;
            };
            tempthis.mouseUpLastX = e.offsetX;
            if (tempthis.timerCount)
                clearInterval(tempthis.timerCount);
            setLineWidth(e.offsetX);
            $(thist).css({ left: e.offsetX + "px" });
            var playNum = parseInt(tempthis.totalNum * e.offsetX / tempthis.playBarLength);
            if (playNum > tempthis.lLoadDataResult.length) {
                RTU.invoke("header.msg.show", "此处数据还没有加载！");
                setTimeout(function () {
                    RTU.invoke("header.msg.hidden");
                }, 1500);
                return;
            }
            tempthis.playCount = playNum;
            tempthis.controlPlayPlace(e.offsetX);
        }
        return false;
    });
    function setLineWidth(w) {
        $(".moveDragLine", tempthis.mCDiv).width(w);
    }
    var tNum = tempthis.moveTimer;
    //提速
    $(".ff_icon_nor", tempthis.mCDiv).click(function () {
        var sn = parseInt($(".moveDrawSpeedNum", tempthis.mCDiv).text());
        sn++;
        if (sn > 5) {
            sn = 5;
        }
        tempthis.moveTimer = tNum / (sn * 4);
        tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
        $(".moveDrawSpeedNum", tempthis.mCDiv).text("");
        $(".moveDrawSpeedNum", tempthis.mCDiv).text(sn);
    });
    //减速
    $(".rew_icon_nor", tempthis.mCDiv).click(function () {
        var sn = parseInt($(".moveDrawSpeedNum", tempthis.mCDiv).text());
        sn--;
        if (sn <= 1) {
            sn = 1;
        }
        if (sn == 1) {
            tempthis.moveTimer = 0.9;
        }
        else {
            tempthis.moveTimer = tNum / (sn * 4);
        }
        tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
        $(".moveDrawSpeedNum", tempthis.mCDiv).text("");
        $(".moveDrawSpeedNum", tempthis.mCDiv).text(sn);
    });
    //停止
    $(".stop_icon_nor", tempthis.mCDiv).click(function () {
        if (tempthis.timerCount){
        	clearInterval(tempthis.timerCount);
        }
        tempthis.clearSvg();
        $(".moveWayLabel", tempthis.mCDiv).empty();
        $(".moveDrawImgDiv", tempthis.mCDiv).css("left", 0);
        $(".moveDragLine", tempthis.mCDiv).width(0);
        tempthis.playCount = 0;
        tempthis.lastSignalId=0;//上一次的信号机
        $(".moveCountNum", tempthis.mCDiv).text(" " + tempthis.playCount + "/" + tempthis.lLoadDataResult.length);
    });
    //点击换图片
    $(".movePlayBtn", tempthis.mCDiv).click(function () {
        tempthis.defaultSet();
        $(this).attr("src", $(this).attr("tempsrc"));
        $(".pause_icon_nor", tempthis.mCDiv).attr("src", $(".pause_icon_nor", tempthis.mCDiv).attr("rsrc"));
    });
    //暂停和播放
    $(".pause_icon_nor", tempthis.mCDiv).click(function (e) {
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
    //条件选择    改变样式
    $("input[type='radio']", tempthis.mCDiv).click(function () {
        $("input[type='text']", tempthis.mCDiv).val("");
        $("#" + tempthis.id + " input[type='text'],#" + tempthis.id + " select").attr("disabled", "disabled").addClass("selectControl");
        $("select,input", $(this).parent().parent()).removeAttr("disabled").removeClass("selectControl");
    });
    $("input[type='radio']:first", tempthis.mCDiv).trigger("click");

    //取消按钮
    $(".selectSationCancelBtn", tempthis.mCDiv).click(function () {
        $(".selectSationDiv", tempthis.mCDiv).hide();
        $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
        
//        tempthis.lLoadDataResult=[];////贮存返回的数据
//        setLineWidth(0);//拖放速度 初始为0
//        $(".moveDrawImgDiv", tempthis.mCDiv).css("left", 0);//拖放点
//        $(".moveCountNum", tempthis.mCDiv).text(" " + 0 + "/" + 0);
//        $(".moveHasLoadLine", tempthis.mCDiv).width(0);//灰色进度条宽度
//        tempthis.loadHisDataTagTime=0;//请求次数
//        tempthis.lastSignalId=0;//上一次的信号机
//        tempthis.playCount=0;//回放播放的条数
//        tempthis.clearArray();
//        var whereUrl="";
//        isLoadHisFalg[indexObj]=true;
//        tempthis.changeMoudle(tempthis,whereUrl,false);
        return  false;
    });
    
    //选择查询条件
    $(".curveSelectSationImg", tempthis.mCDiv).click(function (e) {
        e.stopPropagation();
        var myDate = new Date();
        var  endTime = myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+" "+myDate.getHours()+":"+myDate.getMinutes()+":"+myDate.getSeconds();
	    var beginTime=myDate.getFullYear()+"-"+(myDate.getMonth()+1)+"-"+myDate.getDate()+" "+(myDate.getHours()-1)+":"+myDate.getMinutes()+":"+myDate.getSeconds();
	    $(".stashijian", tempthis.mCDiv).val(beginTime);
	    $(".endshijian", tempthis.mCDiv).val(endTime);
        if ($(this).attr('src').indexOf('curveSearch_icon_nor') != -1) {
            $(this).attr('src', '../static/img/app/moveCurve/curveSearch_icon_pre.png');
            $(".selectSationDiv", tempthis.mCDiv).show();
            if (tempthis.isSmallWin) {
                $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_max");
              	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_min");
              }else{
                $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_min");
              	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_max");
              }
        } else {
            $(this).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
            $(".selectSationDiv", tempthis.mCDiv).hide();
        }
        isLoadHisFalg[indexObj]=false;
        return false;
    });
    
    
    
    //点击按  时间  或   公里标    或    信号机    搜索 
    $(".selectSationBtn", tempthis.mCDiv).click(function (e) {
    	 e.stopPropagation();
    	 tempthis.lLoadDataResult=[];////贮存返回的数据
         setLineWidth(0);//拖放速度 初始为0
         $(".moveDrawImgDiv", tempthis.mCDiv).css("left", 0);//拖放点
         $(".moveCountNum", tempthis.mCDiv).text(" " + 0 + "/" + 0);
         $(".moveHasLoadLine", tempthis.mCDiv).width(0);//灰色进度条宽度
         tempthis.loadHisDataTagTime=0;//请求次数
         tempthis.lastSignalId=0;//上一次的信号机
         tempthis.playCount=0;//回放播放的条数
         
        var whereUrl="";
        var optValue="";
	    var stashijian = $(".stashijian", tempthis.mCDiv).val();
	    var endshijian = $(".endshijian", tempthis.mCDiv).val();
	    
	    //20160505 邓国知新加 车次 司机查询
	    var checi=$(".movecurve_checi", tempthis.mCDiv).val();
	    var driver=$(".movecurve_driver", tempthis.mCDiv).val();
//        var stadate= new Date(stashijian);
//        var enddate= new Date(endshijian);
//        var y="",m="",h="",d="",mi="",s="",statime="",endtime="",endy="",endm="",endh="",endd="",endmi="",ends="";
//    		y=stadate.getFullYear();m=stadate.getMonth()+1;d=stadate.getDate();h=stadate.getHours();mi=stadate.getMinutes();s=stadate.getSeconds(); 
//    		endy=stadate.getFullYear();endm=stadate.getMonth()+1;endd=stadate.getDate();endh=stadate.getHours();endmi=stadate.getMinutes();ends=stadate.getSeconds(); 
//	   		statime=y+"-"+m+"-"+d+" "+h+":"+mi+":"+s;
//	   		endtime=endy="-"+endm+"-"+endd+" "endh=":"+endmi=":"+ends;
	   		 
	   		 
	   		 whereUrl="&beginTime="+stashijian+"&endTime="+endshijian+"&checi="+checi+"&driver="+driver;
	   		 optValue=stashijian;
	   		
//	   		 console.log(stashijian+"---------"+endshijian);
        
//        var rv = $("input[type='radio'][name='ssi']:checked", tempthis.mCDiv).val();
//        switch (rv) {
//            case "0": //时间
//                var stashijian = $(".stashijian", tempthis.mCDiv).val();
//                var stadate= new Date(stashijian);
//                
//                var endshijian = $(".endshijian", tempthis.mCDiv).val();
//                var enddate= new Date(endshijian);
//                
//                var y="",m="",h="",d="",mi="",s="",time="";
//            		y=stadate.getFullYear();   
//        	   		 m=stadate.getMonth()+1;      
//        	   		 d=stadate.getDate();       
//        	   		 h=stadate.getHours();     
//        	   		 mi=stadate.getMinutes();    
//        	   		 s=stadate.getSeconds(); 
//        	   		 time=y+"-"+m+"-"+d+" "+h+":"+mi+":"+s;
//        	   		 optValue=stashijian;
//        	   		 whereUrl="&beginTime="+time;
//        	   		 
//        	   		 console.log(stashijian+"---------"+endshijian);
//        	   		 
//                break;
//            case "2": //公里标
//                var signalDistanceT = $(".sAngonglibiao", tempthis.mCDiv).val();
//                optValue=signalDistanceT;
//                whereUrl="&kiloSign="+(signalDistanceT* 1000);
//                break;
//            case "3": //信号机
//                var signalNoT = $(".sAnxinhaoji", tempthis.mCDiv).val();
//                optValue=signalNoT;
//                whereUrl="&signalNo="+signalNoT;
//                break;
//        }
        $(".selectSationDiv", tempthis.mCDiv).hide();
        $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
        //访问历史数据接口
        	if(optValue.length==0||optValue==""){
        		alert("请输入正确的查询条件");
        		//弹出选择框
            	if ($(".curveSelectSationImg", tempthis.mCDiv).attr('src').indexOf('curveSearch_icon_nor') != -1) {
               		 $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_pre.png');
                        $(".selectSationDiv", tempthis.mCDiv).show();
                        if (tempthis.isSmallWin) {
                          $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_max");
                        	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_min");
                        }else{
                          $(".selectSationDiv", that.mCDiv).removeClass("selectSationDiv_min");
                        	$("#"+that.id+" .selectSationDiv").addClass("selectSationDiv_max");
                        }
                } else {
               	 $(".curveSelectSationImg", tempthis.mCDiv).attr('src', '../static/img/app/moveCurve/curveSearch_icon_nor.png');
                    $(".selectSationDiv", tempthis.mCDiv).hide();
                }
        	}else{
        		isLoadHisFalg[indexObj]=true;
        		tempthis.changeMoudle(tempthis,whereUrl,true);
        	}
    		return false;
    });
};




//搜索之后的播放控制
MoveCurve.prototype.playSearch = function (that, i) {
    var item = that.lLoadDataResult;
    that.clearSvg();
    that.playCount = i - 1;
    if (that.playCount == -1) {
        that.playCount = 0;
    }
    if (!that.playStatus()) {
        $(".pause_icon_nor", that.mCDiv).trigger("click");
    }
    that.setDataToScreen(item, that, "", true);
};
//播放状态 true为正在播放 flase 为暂停
MoveCurve.prototype.playStatus = function () {
    if ($(".pause_icon_nor", this.mCDiv).attr("src").indexOf("pause_icon_nor") != -1) {
        //播放中 
        return true;
    } else {
        return false;
    }
};
//播放控制图标设置成默认值
MoveCurve.prototype.defaultSet = function () {
    $(".movePlayBtn", this.mCDiv).each(function (i, item) {
        $(item).attr("src", $(item).attr("rsrc"));
    });
};
//暂停播放
MoveCurve.prototype.pause = function (e, targetStr) {
    this.defaultSet();
    if (this.timerCount)
        clearInterval(this.timerCount);
};
//播放
MoveCurve.prototype.play = function (e, targetStr) {
    this.defaultSet();
    this.setDataToScreen(this.lLoadDataResult, this);
};
//计算播放点的移动
MoveCurve.prototype.controlPlayPlace = function (x) {
    var countNum = parseInt(this.totalNum * x / this.playBarLength);
    if (countNum > (this.lLoadDataResult * x / this.playBarLength)) {
        //        alert("此处数据还没有加载完成！");
        RTU.invoke("header.alarmMsg.show", "此处数据还没有加载完成！");
        return;
    }
    this.setDataToScreen(this.lLoadDataResult, this, countNum);
};
//清屏
var isClear=[];
var isRun=true;
var staValue=[];
MoveCurve.prototype.clearSvg = function () {
	 var th=this.id;		
	 var i=Number(th.substring(th.length-1,th.length));
	isClear[i]=false;
	staValue[i]=true;
	isRun=true;
	$("#"+this.id+" .congDuanMian").empty();
	$("#"+this.id+" .quXian").empty();
	$("#"+this.id+" .daoQiaoSui").empty();
	$("#"+this.id+" .moveLightBar").empty();
	//清空数组
	xhjArray3=[];//存储信号机
	xhjArray3Index=0;
	
	chaVal[i]=0;
	initValue[i]=0;
	
    $(" svg", this.mCDiv).remove();
    $(".moveWayLabelDiv", this.mCDiv).remove();
    $(" .moveWayNum", this.mCDiv).remove();
    $(".moveLightBar", this.mCDiv).empty();
	$("#"+this.id+" .moveWayLabelDiv1").remove();
};

MoveCurve.prototype.clearArray = function () {
	var th=this.id;
    var i=th.substring(th.length-1,th.length);
	//清空数组
	 lastTimeErrorData[i]=[];//记录最后一个时间
	 xhjTempErrorData[i]=[];//信号机变量
	 distanceTempErrorData[i]=[];//前方距离
	 myDate2[i]=[]; //上次记录数据的时间
	 lastDataFalg[i]=[];//记录最后一次历史数据  标记数组
	 lastData[i]=[];//记录各容器最后一条数据
	 lastTime[i]=[];//记录最后一个时间
	 xhjTemp[i]=[];//信号机变量
	 distanceTemp[i]=[];//前方距离
	 lineDQSTemp[i]=[];//道桥隧开始坐标值
	 lineDQSTemp2[i]=[];//道桥隧结束坐标值 
	 linePoDuStaXTemp1[i]=[];//坡度变量值 
	 linePoDuStaXTemp2[i]=[];//坡度变量值
	 lineQuEndXTemp[i]=[];//弯道曲线记录上一次结束值 
	 xhjArray3=[];//存储信号机 不重复  所有容器的
	 xhjArray3Index=0;//索引
	 linePoDuXTemp1[i]=[];//坡度变量值1
	 signalNoTemp[i]=[];//信号机变量值
	 linePoDuXTemp2[i]=[];//坡度变量值2
//	 xhj_disArray[i]=[];//存储信号机前方距离
//	 xhj_disIndex=0;//索引
	 frontDistance[i]=[];//记录上次前方距离
//	 objId=[];//存储容器对象  不相同
//	 objIndex=0;//角标
//	 thisObj=0;//当前容器 角标
};



//历史模式下面的赋值到屏幕上面
MoveCurve.prototype.setDataToScreen = function (datat, that, countNum, jump) {

    if (countNum) {
        that.clearSvg();
        that.playCount = countNum - 1;
    }
    if (!datat || !datat.length) {
        return;
    }
    if (!this.playStatus()) {
        return;
    }
    if (that.timerCount)
        clearInterval(that.timerCount);

    if (jump) {
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
    }, that.moveTimer * 1000);
    function setDataToSByCount(data, that) {
    	if(data!=undefined)
       /* if (data.jkstate == "异常" || data.jkStatus == 0) {*/
    	if (data.distance<0) {
            that.isSingular = true;
            that.setErrorData(data);
        }
        else {
            that.isSingular = false;
            $(".moveErrorPage", that.mCDiv).hide();
            if(!that.isNowPlay){
            	that.setData(data, that);
            }
        }
    };
    function controlmoveDrawImg(datat) {
        that.setLineControlDraw(datat);
        if (that.playCount == datat.length) {
            that.defaultSet();
            $(".pause_icon_nor", that.mCDiv).attr("src", $("#" + that.id + " .pause_icon_nor").attr("tempsrc"));
            $(".curveHisRea", that.mCDiv).trigger("click");
        }
    }
    function recordCount() {
        // $("#" + that.id + " .moveCountNum").text(" " + that.playCount + "/" + that.lLoadDataResult.length);
        $(".moveCountNum", that.mCDiv).text(" " + that.playCount + "/" + that.totalNum);
    }
};
//异常数据赋值
var lastTimeErrorData=[];//记录最后一个时间
var xhjTempErrorData=[];//信号机变量
var distanceTempErrorData=[];//前方距离
MoveCurve.prototype.setErrorData = function (data) {
	var that = this;
    if(data.frontSName)
        $("#"+that.id+" .showName").text(data.frontSName);//前方车站显示
       else $("#"+that.id+" .showName").text("未知");
    if(data.distance<0){
    	return;
    }
    var th=this.id;
    var i=th.substring(th.length-1,th.length);
    if(lastTimeErrorData[i]==undefined)lastTimeErrorData[i]=0;
    if(xhjTempErrorData[i]==undefined)xhjTempErrorData[i]=0;
    if(distanceTempErrorData[i]==undefined)distanceTempErrorData[i]=0;
    var d=data;
    var isRunFalg=false;
    if(this.isNowPlay){//实时模式
		if(new Date(data.date).getTime()>lastTimeErrorData[i]){
			if(xhjTempErrorData[i]==data.signalNo){
				if(data.distance>distanceTempErrorData[i]){
					d.distance=distanceTempErrorData[i];
				}
			}
			isRunFalg=true;
			lastTimeErrorData[i]=new Date(d.date).getTime();
			xhjTempErrorData[i]=d.signalNo;
			distanceTempErrorData[i]=d.distance;
		}
		if(!isRunFalg)return;
    }

    $(".moveShowDiv .moveSpeed", that.mCDiv).text(data.speed ? data.speed : "0"); //速度
    
//    kcbz为0的就画，kcbz不为零的就不画
    if(data.kcbz=="0"){//动车   非0时隐藏  限速   和  红线
    	$(".moveShowDiv .moveRestrictSpeed", that.mCDiv).text(data.limitSpeed); //限制最高速度
    }else{
    	$(".moveShowDiv .moveRestrictSpeed", that.mCDiv).text(""); //限制最高速度
    }
    $(".moveShowDiv .moveDistance", that.mCDiv).text(data.distance); //距离
    $(".moveShowDiv .moveSD_D", that.mCDiv).text(data.signalDistance / 1000); //信号里程
    this.changeSignColor(data); //改变信号机颜色
    that.initRightPar(data);
    var d = null;
    if (data.date) {
        d = new Date(data.date);
    }
    else {
        d = new Date();
    }
    if (that.isLargerWin) {
        $(".moveShowDiv .moveDate", this.mCDiv).text(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate()); //速度
    } else {
        $(".moveShowDiv .moveDate", this.mCDiv).text((d.getMonth() + 1) + "-" + d.getDate()); //速度
    }
    $(".moveShowDiv .moveTimeDiv", that.mCDiv).text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
    $(".moveShowEngine .turnSpeed", that.mCDiv).text("--");
    $(".moveShowEngine .guangya", that.mCDiv).text("--");
    $(".moveShowEngine .gangya", that.mCDiv).text("--");
    $(".moveShowEngine .fenggang1", that.mCDiv).text("--");
    $(".moveShowEngine .fenggang2", that.mCDiv).text("--");
    $(".moveSD_S", that.mCDiv).text(data.signalName + "" + data.signalNo);
    that.setSdinfo(data.sdinfo);
    that.setLinePlace(data, true);

};
//拖动的控制条
MoveCurve.prototype.setLineControlDraw = function (datat) {
    var that = this;
    var hasLoadleft = that.playBarLength * datat.length / that.totalNum;
    // if($(".moveDrawSpeed",that.mCDiv).width()<hasLoadleft){
    //   hasLoadleft =$(".moveDrawSpeed",that.mCDiv).width();
    // }
    $(".moveHasLoadLine", that.mCDiv).width(hasLoadleft);
    var left = that.playBarLength * that.playCount / that.totalNum;
    $(".moveDrawImgDiv", that.mCDiv).css("left", left);
    $(".moveDragLine", that.mCDiv).width(left);
};
//sdStatus控制函数
MoveCurve.prototype.setSdinfo = function (v) {
    $(".sdStatus .sdYTarget", this.mCDiv).css("visibility", "hidden");
    if (v == 0) {
    } else if (v == 1) {
        $(".sdStatus .sdinfo1", this.mCDiv).css("visibility", "visible");
    }
    else if (v == 2) {
        $(".sdStatus .sdinfo2", this.mCDiv).css("visibility", "visible");
    }
    else if (v == 3) {
        $(".sdStatus .sdinfo3", this.mCDiv).css("visibility", "visible");
    }
    else if (v == 4) {
        $(".sdStatus .LC_Y", this.mCDiv).css("visibility", "visible");
    }
};
//右边状态部分的控制
MoveCurve.prototype.initRightPar = function (data) {
    var that = this;
    if (data.jkstatejiangji == 0) {
        $(".jkstatejiangji", that.mCDiv).removeClass("moveBight");
    } else {
        $(".jkstatejiangji", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.jkstatediaoche == 0) {
        $(".jkstatediaoche", that.mCDiv).removeClass("moveBight");
    } else {
        $(".jkstatediaoche", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.zhidongxiezai == 0) {
        $(".zhidongxiezai", that.mCDiv).removeClass("moveBight");
    } else {
        $(".zhidongxiezai", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.zhidongchangyong == 0) {
        $(".zhidongchangyong", that.mCDiv).removeClass("moveBight");
    } else {
        $(".zhidongchangyong", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.zhidongjinji == 0) {
        $(".zhidongjinji", that.mCDiv).removeClass("moveBight");
    } else {
        $(".zhidongjinji", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.kehuo == 0 || data.kehuo == "") {

        $(".kehuo", that.mCDiv).removeClass("moveBight");
    } else {
        $(".kehuo", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }
    if (data.locoAb == "" || (data.locoAb!="1"&&data.locoAb!="2")) {
        $(".locoAb", that.mCDiv).text(" ").removeClass("moveBight");
    } else if (data.locoAb == "1") {
        $(".locoAb", that.mCDiv).text("A 机").removeClass("moveBight").addClass("moveBight");
    } else {
        $(".locoAb", that.mCDiv).text("B 机").removeClass("moveBight").addClass("moveBight");
    }
    $(".currLateralNo", that.mCDiv).html(data.currLateral);
    if (data.currLateral&&data.currLateral!=0) {
    	$(".currLateral", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    	
    } else {
    	$(".currLateral", that.mCDiv).removeClass("moveBight");
    }
    $(".currSidetrackNo", that.mCDiv).html(data.currSidetrack);
    if (data.currSidetrack&&data.currSidetrack!=0) {
    	$(".currSidetrack", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    } else {
    	$(".currSidetrack", that.mCDiv).removeClass("moveBight");
    }
    if (data.ruduan&&data.ruduan!=0) {
    	$(".churuku", that.mCDiv).removeClass("moveBight").addClass("moveBight");
    	$(".churuku", that.mCDiv).html("入段");
    } else {
    	if (data.chuduan&&data.chuduan!=0) {
        	$(".churuku", that.mCDiv).removeClass("moveBight").addClass("moveBight");
        	$(".churuku", that.mCDiv).html("出段");
        } else {
        	$(".churuku", that.mCDiv).removeClass("moveBight");
        }
    }
    
};
//先加载3000条数据
var shiMo2=false;//是否是已经切换到实时模式
var lastData=[];//记录各容器最后一条数据
var notLiSiData=false;//有无历史数据
MoveCurve.prototype.loadHisData3000 = function (locoTypeid, locoNo, locoAb, fn,checiName,lkjTime) {
	var th=this.id;		
	var i=th.substring(th.length-1,th.length);
	
	if(this.quXian==1){
		notLiSiData=false;
	}
    this.loadingshow();
    this.showTipMsg("正在加载一部分历史数据...");
//     alert(this.tool.DateTimeFormat(new Date(),"yyyy-MM-dd hh:mm:ss"))
  
    var that = this;
    var URL = "../onlineloco/searchMoveLineByTimeSize?locoTypeid=" + locoTypeid + "&locoNo=" 
    + locoNo + "&returnSize=100&locoAb="+locoAb+"&checi="+checiName+"&lkjTime="+lkjTime;
    $.ajax({
        url: URL,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
            that.loadinghide();
            if (!data || !data.data || data.data.length == 0) {
                that.showTipMsg("没有历史数据，已切换到实时模式", 3);
                notLiSiData=true;
                if (fn) {
                    fn();
                }
                return;
            };
//           var ti= that.tool.DateTimeFormat(new Date(),"yyyy-MM-dd hh:mm:ss");
//           console.log(ti);
            if (data && data.data) {
            	for ( var int = 0; int < data.data.length; int++) {
					
	                var d = data.data;
	                that.nowPlayData = d;
	                that.showTipMsg("正在预加载历史数据...");
                    that.setData(d[int], that);
                    if (int == d.length-1) {
                        that.showTipMsg("加载完毕，已进入实时模式！");
                        that.hideTipMsg(5);
                        if (fn) {
                          fn();
                        }
                        break;
                    };
            	}
                   
               
            }        

        }
    });
};
//实时模式下面的加载数据
var myDate2=[]; //上次记录数据的时间
var lastDataFalg=[];//记录最后一次历史数据  标记数组
var lastData=[];//记录各容器最后一条数据
MoveCurve.prototype.loadData = function (that) {
	var th=this.id;
	var i=th.substring(th.length-1,th.length);
    function ldata() {
    	//设置请求 时间参数
    	var str=that.dataUrl.substring(0,that.dataUrl.length-2);
    	var y="",m="",d="",h="",mi="",s="",time="";
    	if(myDate2[i]==undefined||myDate2[i].length==0){
    		 str=str+',"beginTime":""}]';
    	}else{
    		y=myDate2[i].getFullYear();   
	   		 m=myDate2[i].getMonth()+1;      
	   		 d=myDate2[i].getDate();       
	   		 h=myDate2[i].getHours();      
	   		 mi=myDate2[i].getMinutes();    
	   		 s=myDate2[i].getSeconds(); 
	   		 time=y+"-"+m+"-"+d+" "+h+":"+mi+":"+s;
	   		 str=str+',"beginTime":"'+ time+ '"}]';
    	}
    	
        var tempurl = that.dataUrl.indexOf("?") == -1 ? str + "?" + new Date().getTime() : str + "&" + new Date().getTime();
        $.ajax({
            url: tempurl,
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
            	if(data.success){
	                var tempdata = data.data[0];
	                if (!tempdata || tempdata.length == 0) {
	                    return;
	                }
	                var len= data.data.length;
	                var t = new Date(data.data[len-1].date);//你已知的时间
	                if(myDate2[i]!=undefined)
	                if(myDate2[i]==t){//表示已经请求过
	                	return;
	                }
	                myDate2[i]=t;//记录当前数据中最近时间
	                var len=data.data.length;
	                
	                $(data.data).each(function(i){
						var d=data.data[i];
		                that.nowPlayData.push(d); //实时加载的数据
		                that.nowPlayCount++;
		                /*if (d.jkstate == "异常" || d.jkStatus == 0) {*/
		                 /*if (d.distance<0) {
		                	shiMo2=true;
		                    that.isSingular = true;
		                    var arrdata = that.segmentation_2(d); //拆分数据

		                    if (arrdata && arrdata.length > 0) {
		                        var count = 0;
		                        var t = setInterval(function () {
		                            t.count = 0;
		                            if (that.isMove == false)
		                                that.setErrorData(arrdata[count]);
		                            count++;
		                            if (arrdata.length == count) {
		                                clearInterval(t);
		                            }
		                        }, 1000);
		                        that.childTimersArr.push(t);
		                    } else {
		                        that.setErrorData(d);
		                    }
		                }
		                else {}*/

	                    that.isSingular = false;
	                    $(".moveErrorPage", that.mCDiv).hide();
	                    that.initRightPar(d);
//	                    var arrdata = that.segmentation(d); //拆分数据
	                    var arrdata=[];
	                    arrdata=that.segmentation_2(d,len,i);//拆分数据
	                    if (arrdata && arrdata.length > 0) {
	                        var count = 0;
	                        var t = setInterval(function () {
	                        	if(!that.isNowPlay)return;
	                            t.count = 0;
	                            if (that.isMove == false)
	                            	that.setData(arrdata[count], that);
	                            count++;
	                            	
	                            if (arrdata.length == count) {
	                                clearInterval(t);
	                              //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
	                                if(that.drawStationFlag){
	                            		if(tempdata.signalId!=
	                            			1&&tempdata.signalId!=2&&tempdata.signalId!=0){
	                            			//画车站
	                                		var divs = $(".moveBottomSpeed .moveWayLabelDiv", that.mCDiv);
	                                		/*var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
	                                		that.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);*/
	                                		that.AddStation(tempdata, parseInt($(divs[divs.length-1]).css("left"))-500);
	                                		that.drawStationFlag=false;
	                            		}
	                           	}else if(tempdata.signalId==1
	                        			||tempdata.signalId==2){
	                           		that.drawStationFlag=true;
	                           		}
	                            }
	                        }, 1000);
	                        that.childTimersArr.push(t);
	                    }
	                    else {
	                        that.setData(d, that);
	                        //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
	                    	if(that.drawStationFlag){
	                    		if(tempdata.signalId!=
	                    			1&&tempdata.signalId!=2&&tempdata.signalId!=0){
	                    			//画车站
	                        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", that.mCDiv);
	                        		/*var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
	                        		that.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);*/
	                        		that.AddStation(tempdata, parseInt($(divs[divs.length-1]).css("left"))-500);
	                        		that.drawStationFlag=false;
	                    		}
	                    	}
	                    	else if(tempdata.signalId==1
	                    			||tempdata.signalId==2){
	                    		that.drawStationFlag=true;//可能下一次循环就要开始加载车站了
	                    	}
	                    }
	                
		                that.segmentationData = tempdata;
            		});   
	            }
        	}
        });
    };
    if (that.loadHisDataTag == false) {
        that.loadHisData3000(that.locoTypeid, that.locoNo, that.locoAb, function () {
            ldata();
            if (that.httpRequest) {//ajax停止
                that.httpRequest.abort();
                that.httpRequest = null;
            }
            that.timerCount = setInterval(function () {
                ldata();
            }, that.moveTimer * 1000);
        },that.itemData.data.checiName,that.itemData.data.lkjTimeStr); //预先加载100调数据
        that.loadHisDataTag = true;
    }
    else {
        ldata();
        if (that.httpRequest) {//ajax停止
            that.httpRequest.abort();
            that.httpRequest = null;
        }
        that.timerCount = setInterval(function () {
            ldata();
        }, that.moveTimer * 1000);
    }
};

//分割数据2 使界面更加滑动  改变前方距离 和 增加1s 时间
MoveCurve.prototype.segmentation_2 = function (data,len,index) {
	
	var dataArray=[];
	/**
	 * 当一次请求返回多条数据时 只对最后一条数据进行分割  前几条直接画线
	 */
	if((len-1)==index){
	     var d=data;
	     var d2=data;
	     var d3=data;
	     var t = new Date(data.date);//你已知的时间
	     var t_s=t.getTime();//转化为时间戳毫秒数
	     var nt=new Date();//定义一个新时间
	         nt.setTime(t_s+1000);//设置新时间比旧时间多一秒钟
	      
	     var nt2=new Date();
	     nt2.setTime(t_s+2000);
	     
	     var nt3=new Date();
	     nt3.setTime(t_s+3000);
	     
	     var nt4=new Date();
	     nt4.setTime(t_s+4000);
	     
	     var nt5=new Date();
	     nt5.setTime(t_s+5000);
	     
	     var json = JSON.stringify(data);
	     var data1=JSON.parse(json); 
	   
		    data.distance=data.distance-10;
		    data.date=nt;
		    var json = JSON.stringify(data);
		    var data2=JSON.parse(json); 
	   
		    d.distance=d.distance-5;
		    d.date=nt2;
		    var json = JSON.stringify(d);
		    var data3=JSON.parse(json); 
	 	   
		    d2.distance=d2.distance-10;
		    d2.date=nt3;
		    var json = JSON.stringify(d2);
		    var data4=JSON.parse(json); 
		    
		    d3.distance=d3.distance-5;
		    d3.date=nt4;
		    var json = JSON.stringify(d3);
		    var data5=JSON.parse(json); 
	 	   
	 	   dataArray[0]=data1;   
		   dataArray[1]=data2;   
		   dataArray[2]=data3;   
		   dataArray[3]=data4;   
		   dataArray[4]=data5; 
     
	}else{
		 dataArray[0]=data;   
	}
	  return dataArray;
};

//分割数据 使界面更加滑动
MoveCurve.prototype.segmentation = function (data) {
	
    var arr = [];
    var dsp = 0; //实时速度
    var dlm = 0; //最高速度
    var dgy = 0; //管压
    var dgangy = 0; // data.gangya; //缸压力
    var dturnSpeed = 0; //转速
    var dt = 0;
    if (this.segmentationData) {
        dt = parseInt((this.segmentationData.distance - data.distance) / this.moveTimer);
        if (dt < 0) {
            dt = parseInt(this.segmentationData.distance / this.moveTimer);
        }
        dsp = Math.round((this.segmentationData.speed - data.speed) / this.moveTimer);
        dlm = Math.round((this.segmentationData.limitSpeed - data.limitSpeed) / this.moveTimer);
        dgy = Math.round((this.segmentationData.guangya - data.guangya) / this.moveTimer);
        dgangy = Math.round((this.segmentationData.gangya - data.gangya) / this.moveTimer);
        dturnSpeed = Math.round((this.segmentationData.turnSpeed - data.turnSpeed) / this.moveTimer);
        
        for (var i = 0; i < this.moveTimer; i++) {
            var tempitem = this.clone(this.segmentationData);
            tempitem.distance =data.distance;
            tempitem.speed = tempitem.speed - dsp * (i + 1);
            tempitem.limitSpeed = tempitem.limitSpeed - dlm * (i + 1);
            tempitem.guangya = tempitem.guangya - dgy * (i + 1);
            tempitem.gangya = tempitem.gangya - dgangy * (i + 1);
            tempitem.turnSpeed = tempitem.turnSpeed - dturnSpeed * (i + 1);
            arr.push(tempitem);
        } 
        return arr;
    }
    else {
        return arr;
    }
    
};
//设置信号灯
MoveCurve.prototype.changeSignColor = function (data) {
    var tempImg = this.tool.imgurl0bj[data.lightColor.toString()];
    var srcimg = tempImg ? tempImg : "NO.png";
    var arr = $(".moveSatus img", this.mCDiv).attr("src").split("/");
    arr[0] = "/";
    if(arr[arr.length - 1] != srcimg) {//改变
    	if(arr.length!=1)
    		this.lightColorisChange = true;
        if (this.lastSignalId == data.signalNo) {//没有新的信号机来
            this.upDatesignalImg(data); //就更新最后一个信号机
        }
        $(".moveSatus img", this.mCDiv).attr("src", this.tool.getImgUrl(data.lightColor, this));
    }
    else {
        this.lightColorisChange = false;
    }
};
//前方信号机的灯发生改变的时候彩带和最后一个信号机的灯也跟着变化
MoveCurve.prototype.upDatesignalImg = function (data) {
    var m = $("#" + this.id + " .moveWayLabelDiv:last");
    var imgLength = $("img", m).length || 1;

    var imgs = this.getSignalImg(data) || 1; //
    if (imgLength == 2) {
        if (imgs.length == 2) {
            $("img:first", m).attr("src", "../static/img/app/moveCurve/" + imgs[0]);
            $("img:last", m).attr("src", "../static/img/app/moveCurve/" + imgs[1]);
        }
        else {
            $("img:first", m).attr("src", "../static/img/app/moveCurve/" + imgs[0]);
            $("img:last", m).remove();
        }
    } else {
        if (imgs.length == 2) {
            $("img:first", m).after("<img style='top:12px;' src='../static/img/app/moveCurve/" + imgs[1] + "' alt='' />");
            $("img:first", m).attr("src", "../static/img/app/moveCurve/" + imgs[0]);
        }
        else {
            $("img:last", m).attr("src", "../static/img/app/moveCurve/" + imgs[0]);
        }
    };
    var cw = 0;
    var img = this.tool.imgurl0bj[data.lightColor.toString()];
    var srcimg = img ? img : "NO.png";
    var bgc = this.getColorBarColor(srcimg);
    /*if ($(".linebar", this.moveLightBar).length == 0) return;
    if (bgc.split(",").length > 1) {//两种颜色的
        this.moveLightBar.append("<div class='linebar' ><div class='linebarTop' style='background-color:" + bgc.split(",")[0] + "' ></div><div class='linebarBottom' style='background-color:" + bgc.split(",")[1] + "'></div></div>");
    }
    else {
        this.moveLightBar.append("<div class='linebar  style='background-color:" + bgc + "'></div>");
    }*/
};
//设置界面上的数据
MoveCurve.prototype.justSetData = function (data, that) {

		if (data) {
	        $(" .moveSD_S", this.mCDiv).text(data.signalName + "" + data.signalNo);
	        $(".moveShowDiv .moveSpeed", this.mCDiv).text(data.speed); //速度
	        //kcbz为0的就画，kcbz不为零的就不画
	        if(data.kcbz=="0"){//隐藏  限速   和  红线
	        	$(".moveShowDiv .moveRestrictSpeed", this.mCDiv).text(data.limitSpeed); //限制最高速度
	        }else{
	        	$(".moveShowDiv .moveRestrictSpeed", this.mCDiv).text(""); //限制最高速度
	        }
	        $(".moveShowDiv .moveDistance", this.mCDiv).text(data.distance); //距离
	        $(".moveShowDiv .moveSD_D", this.mCDiv).text(data.signalDistance / 1000); //信号里程
	        var d = new Date(data.date);
	        if (that.isLargerWin) {
	            $(".moveShowDiv .moveDate", this.mCDiv).text(d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() ); //速度
	        } else {
	            $(".moveShowDiv .moveDate", this.mCDiv).text((d.getMonth() + 1) + "-" + d.getDate()); //速度
	        }
	
	        $(".moveShowDiv .moveTimeDiv", this.mCDiv).text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
	        $(".moveShowEngine .turnSpeed", this.mCDiv).text(data.turnSpeed);
	        $(".moveShowEngine .guangya", this.mCDiv).text(data.guangya);
	        $(".moveShowEngine .gangya", this.mCDiv).text(data.gangya);
	        $(".moveShowEngine .fenggang1", this.mCDiv).text(data.fenggang1);
	        $(".moveShowEngine .fenggang2", this.mCDiv).text(data.fenggang2);
	        
	        if(data.frontSName)
	         $("#"+this.id+" .showName").text(data.frontSName);//前方车站显示
	        else $("#"+this.id+" .showName").text("未知");
	        		
	        that.changeSignColor(data); //信号机的控制
	        that.initRightPar(data); //右边的状态表
	        that.setSdinfo(data.sdinfo); //sdinfo的状态控制
	        that.setMaxSpeedValue(data.maxSpeedValue); //y轴数值的控制
	    }
};
//根据数据设置坐标y的的数值
MoveCurve.prototype.setMaxSpeedValue = function (maxSpeedValue) {
    if (!maxSpeedValue||maxSpeedValue==0) return;
    if (this.maxSpeedValue == maxSpeedValue) return;
    this.maxSpeedValue = maxSpeedValue;
    var ei = maxSpeedValue / 10;
    $("#"+this.id+" .moveSpeedNum .moveSN_N").each(function(i,item){
    	$(item).text(ei * (10 - i));
    });
    if (this.maxSpeedValue == 200) {
        this.hrangeNum = this.maxSpeedValue + 20;
    } else {
        this.hrangeNum = this.maxSpeedValue + ei;
    }
};
var lastTime=[];//记录最后一个时间
var xhjTemp=[];//信号机变量
var distanceTemp=[];//前方距离
MoveCurve.prototype.setData = function (data, that) {
	/*if(data.distance<0){//前方距离异常
		var th=this.id;
    	var i=th.substring(th.length-1,th.length);
		if(xhjTemp[i]==undefined)xhjTemp[i]=0;
    	if(distanceTemp[i]==undefined)distanceTemp[i]=0;
    	if(xhjTemp[i]==data.signalNo){
			data.distance=distanceTemp[i];
		}
    	else{
    		//当前信号机与上一个信号机不一致了,前方距离如何赋值?
    		data.distance=Math.abs(data.distance);
    	}
	}*/
	if(data.distance<0)data.distance=Math.abs(data.distance);
	/*if(data.distance>=0){}*/

	//根据数值初始化各条线的位置
	that.setLinePlace(data);
    if (!this.isMove) {
    	var th=this.id;
    	var i=th.substring(th.length-1,th.length);
    	if(lastTime[i]==undefined)lastTime[i]=0;
    	if(xhjTemp[i]==undefined)xhjTemp[i]=0;
    	if(distanceTemp[i]==undefined)distanceTemp[i]=0;
    	if(this.isNowPlay){//实时模式
    		var d=data;
    		if(new Date(data.date).getTime()>lastTime[i]){
    			if(xhjTemp[i]==data.signalNo){
    				if(data.distance>distanceTemp[i]){
    					d.distance=distanceTemp[i];
    				}
    			}
    			this.justSetData(d, that);
    			lastTime[i]=new Date(d.date).getTime();
    			xhjTemp[i]=d.signalNo;
    			distanceTemp[i]=d.distance;
    		}
		}else{//历史模式
			var d=data;
			this.justSetData(d, that);
		}
    }


};
//判断是拖动还是实时更新
MoveCurve.prototype.isMoveFn = function (sl) {
    var totalWidth = $(".moveBottomSpeed", this.mCDiv).width(); //总长度
    var addWidth = totalWidth - this.wX; //已经添加了的总长度
    var cNum = 110;
    if (this.isLargerWin) {
        cNum = 370;
    };
    var rangeWidth = addWidth - cNum; //添加了的总长度-
    if (rangeWidth > sl) {//实时
        this.isMove = true;
    }
    else {//在拖动

        this.isMove = false;
        //this.moveSetData(sl);//数据赋值
    }
};
//拖动时候的数据显示
MoveCurve.prototype.moveSetData = function (sl) {
    var that = this;
    if (this.moveHisItem.length > 0) {
        setTimeout(function () {
            for (var i = that.moveHisItem.length - 1; i > 0; i--) {
                if (sl == parseInt(that.moveHisItem[i].distance)) {
                    that.justSetData(that.lLoadDataResult[that.moveHisItem[i].playCount], that);
                    break;
                }
            }
        }, 1);
    }
};
//拖动时候的数据显示(实时候的时候)
MoveCurve.prototype.moveNowPlaySetData = function (sl) {
    var that = this;
    if (this.moveItem.length > 0) {
        setTimeout(function () {
            for (var i = that.moveItem.length - 1; i > 0; i--) {
                if (sl == parseInt(that.moveItem[i].distance)) {
                    that.justSetData(that.nowPlayData[that.moveItem[i].nowPlayCount], that);
                    break;
                }
            }
        }, 1);
    }
};
//初始化可拖动事件
MoveCurve.prototype.drawMiddleLine = function (that) {
    var that = this;
    $(".moveBottomContainDiv", this.mCDiv).mousedown(function (e) {
        $(this).css("cursor", "move");
        var of = 0;
        var count = 0;
        $(this).bind("mousemove", function (e) {
            if (count > 0) {
                var left = of - e.clientX;
                of = e.clientX;
                var sl = $(this).scrollLeft() + left;
                $(this).scrollLeft(sl);
                that.isMoveFn(sl);
                if (!that.isNowPlay) {
                    that.moveSetData(sl);
                } else {
                    that.moveNowPlaySetData(sl);
                }

            } else {
                count++;
                of = e.clientX;
            }
        });
    }).mouseenter(function () {
        $(this).css("cursor", "move");
    }).mouseup(function (e) {
        $(this).unbind("mousemove");
    });
    $("body").mouseup(function () {
        $(".moveBottomContainDiv", that.mCDiv).unbind("mousemove");

    });
};


var lineDQSTemp=[];//道桥隧开始坐标值
var lineDQSTemp2=[];//道桥隧结束坐标值 
var linePoDuStaXTemp1=[];//坡度变量值 
var linePoDuStaXTemp2=[];//坡度变量值
var lineQuEndXTemp=[];//弯道曲线记录上一次结束值 
var signalDistanceFalg=true;//纵断面是画折线还是画加载线
var xhjArray3=[];//存储信号机 不重复  所有容器的
var xhjArray3Index=0;//索引
var linePoDuXTemp1=[];//坡度变量值1
var signalNoTemp=[];//信号机变量值
var linePoDuXTemp2=[];//坡度变量值2
var xhj_disArray=[];//存储信号机前方距离
var xhj_disIndex=0;//索引
var frontDistance=[];//记录上次前方距离

//画线    数据过滤
MoveCurve.prototype.setLinePlace = function (data, isError) {
	
	if(this.quXian==1){//清除
		xhj_disArray=[];//存储信号机前方距离
		xhj_disIndex=0;//索引
	}
	$("#"+this.id+" .moveRightBox").css("display","block");
	$("#"+this.id+" .moveRightBox02").css("display","none");
	var th=this.id;
	var i=Number(th.substring(th.length-1,th.length));
	if(this.isNowPlay){//实时模式
	
		  var json2 = JSON.stringify(xhjArray3);
		  var data3=JSON.parse(json2); 
		  var xhjArray=[];
		  var y=0;
		  var countFalg=false;
		  for ( var int =data3.length-1; int >0; int--) {
				if(data3[int].id==th){
					xhjArray[y]=data3[int].signalNo;
					y++;
					if(y==3){
						countFalg=true;
						break;
					}
				}
			 }
		  //避免出现  信号机跳过画线   
		  if(countFalg){
			  if(xhjArray[0]<xhjArray[1]&&xhjArray[1]<xhjArray[2]){//当前信号机在  减小
				  if(xhjArray[0]==data.signalNo||data.signalNo<xhjArray[0]){
				  }else{
					  return;
				  }
			  }else if(xhjArray[0]>xhjArray[1]&&xhjArray[1]>xhjArray[2]){//当前信号机在  增大
				  if(xhjArray[0]==data.signalNo||data.signalNo>xhjArray[0]){
				  }else{
					  return;
				  }
			  }
		  }
		  
	    if(frontDistance[i]==undefined)frontDistance[i]=0;
		var xhj_dis = new Object(); 
		 var json = JSON.stringify(xhj_disArray);
	    var data2=JSON.parse(json); 
	    var xhjDisFalg=true;
	    if(data.jkstatediaoche==0&&data.jkstatejiangji==0){
	 	   f: for ( var int = 0; int < data2.length; int++) {
		   		if(this.id==data2[int].id)//当前容器对象
				{
	   				if(data2[int].xhj==data.signalNo){//信号机相等 
						for ( var int3 = int; int3 < data2.length; int3++) {
							if(data2[int].dis==data.distance){//前方距离相等
								xhjDisFalg=false;
								break f;
							}
							if(data.distance>frontDistance[i]){//当前  前方距离大于上次前方距离
								xhjDisFalg=false;
								break f;
							}
						}
					}
				}
		}
	    }

	    
	    if(xhjDisFalg){
	    	//记录变量值
	    	xhj_dis.xhj=data.signalNo;
	    	xhj_dis.dis=data.distance;
	    	xhj_dis.id=this.id;
	    	xhj_disArray[xhj_disIndex]=xhj_dis;
	    	xhj_disIndex++;
	    }
	    if(xhjDisFalg){
	    	this.setLine(data, isError);
	    	frontDistance[i]=data.distance;
	    }
	}else{//历史模式下
		this.setLine(data, isError);
	}
};

/*重要方法*///画线
var objId=[];//存储容器对象  不相同
var objIndex=0;//角标
var thisObj=0;//当前容器 角标

MoveCurve.prototype.setLine = function (data, isError) {
//	var i=this.id.substring(this.id.length-1,this.id.length);
	var objIdFalg=true;
	var index=null;
	for ( var int = 0; int < objId.length; int++) {
		if(objId[int]==this.id){
			objIdFalg=false;
			index=int;
			thisObj=int;
			break;
		}
	}
	if(objIdFalg){
		objId[objIndex]=this.id;
		objIndex++;
	}
	
    this.xhcount++;
    //根据速度转化成坐标
    if (!data.speed) {
        data.speed = 0;
    };
    var sp = data.speed; //实时速度
    var lm = data.limitSpeed; //最高速度
    var gy = data.guangya; //管压
    var gangy = data.gangya || 5; //缸压力
    var turnSpeed = data.turnSpeed; //转速
    if (!this.setSpeedLineLastP) {//如果是第一次进入，初始化各个变量
        //定义当前的x轴一半原点
        var x = this.wX * 0.7;
        //算出第一个坐标点的y轴位置 350为假定的最高速度
        var y = this.wH * sp / this.hrangeNum;
        this.setSpeedLineLastP = [x, (this.wH - y)];
        this.MaxSpeedLineLastP = [x, (this.wH - this.wH * lm / this.hrangeNum)];
        this.scroolLeft = $("#" + this.id + " .moveBottomContainDiv").scrollLeft();
        this.MiddleLineLeft = this.tool.getLeft("#" + this.id + " .moveMiddleLine");
        this.carP = this.tool.getLeft("#" + this.id + " .currentTrain"); //机车位置
        this.guanYaP = [x, this.guanyNumHeight - this.guanyNumHeight * gy / 800];
        this.gangyaLast = [x, this.guanyNumHeight - this.guanyNumHeight * gangy / 800];
        this.turnSpeedLast = [x, (this.wH - this.wH * turnSpeed / 1980)];
        this.lastSignalId = data.signalNo;
        this.AddSignal(data, this.MiddleLineLeft,this.isLargerWin);
        this.distanceLast = data.distance;
        this.lastDate = data.date;
        this.lastSingular = this.isSingular; //上一次是否异常状态
    }
    else { //否则根据上一次的点 和这次的点画线
        //已知 界面的总长度是5公里左右
        //这次5秒更新所走的距离
        // this.distanceLast =data.distance;
        var newD = Math.abs(data.distance - this.distanceLast);
        /*if(this.firstFlag){
        	this.firstFlag=false;
        	this.isTurnSignal=false;
        }
        else{}*/

    	if ((data.distance - this.distanceLast) > 0 || (this.lastSignalId != data.signalNo)) {
            this.isTurnSingal = true;
            newD = Math.abs(this.distanceLast);
        }
        else {
            this.isTurnSingal = false;
        }
    
        var ddate=0;
        if (this.isSingular || this.lastSingular) {
            if (this.lastDate) {
                 ddate = data.date - this.lastDate;
                newD = ddate / 3600000 * data.speed * 1000;
            }
        };
        
        if((ddate/3600000/24)>10)newD=0;//记录间隔
        
        if (!newD||newD<0) newD = 0;
        
        //计算这个距离在座标上面的距离
        var newW = newD * this.wX / 5000;  
        var nx = this.setSpeedLineLastP[0] + newW;
        var nyp = this.wH - (this.wH / this.hrangeNum) * sp;
        var nyl = this.wH - (this.wH / this.hrangeNum) * lm;
        var ngy = this.guanyNumHeight - (this.guanyNumHeight / 800) * gy;
        var ngangy = this.guanyNumHeight - (this.guanyNumHeight / 800) * gangy;
        var nturnSpeed = this.wH - (this.wH / 1980) * turnSpeed;
        if(nyl<0)return;
        
        if (this.quXian==1) {//每当点击时初始化值
			this.quXian=2;
		}
    
        var suoXiaoFalg=false;
        this.isLargerWin;//true  表示大窗口    false 表示小窗口
        if(this.isLargerWin){
        	suoXiaoFalg=true;
        }
        var addTemp2;
    	if(suoXiaoFalg){//true  表示大窗口    false 表示小窗口
    		addTemp2=MaxValue;
    	}else{	
    		addTemp2=minValue;
    	}
        //道桥隧
        var ixxType=0;//区别 道桥隧 编号
        var staXDQS=0;//画线开始值 
        var endXDQS=0;//画线结束值 
        var lineArrayDQS;//存储开始结束里程
        var lineDQSFalg=true;//是否画道桥隧
        $(data.lkjCurveInfoList).each(function(){
        	var sta=this.lbegincoord;//开始里程
			var end =this.lendcoord;//结束里程
			ixxType=this.ixxtype;//区别编号
						
			lineArrayDQS=[sta,end];
	    	staXDQS=(Math.abs(lineArrayDQS[0]-data.signalDistance)*0.126)+nx;//画线开始坐标
	    	endXDQS=(Math.abs(lineArrayDQS[1]-lineArrayDQS[0])*0.126)+staXDQS;//画线结束坐标
	    	
	    	if(index!=null){
	    		if(lineDQSTemp[index]==undefined)lineDQSTemp[index]=0;
				if(lineDQSTemp2[index]==undefined)lineDQSTemp2[index]=0;
	    	}
	    	
	    	//当前开始值==上次开始值        当前开始值 小于 上次结束值    
	    	if (staXDQS==lineDQSTemp[index]||staXDQS<lineDQSTemp2[index]) {
	    		lineDQSFalg=false;
			}else {
				lineDQSFalg=true;
				staXDQS+=addTemp2;
				endXDQS+=addTemp2;
			}
	    	lineDQSTemp[index]=staXDQS;//记录当前容器下的开始值
	    	
	    	if (endXDQS>lineDQSTemp2[index])  //当前结束是否大于上次结束
	    	if(end>0)  //当前结束里程大于0
	    	lineDQSTemp2[index]=endXDQS;//记录最后一个坐标
        });
       
   
       //坡度---纵断面
        var staXPD=0;//画线第一个值
        var endXPD=0;//画线第二个值 
        var xend=0;//记录最大值 
        var xend2=0;//记录最大值 
        var lineArrayPD3=[];//存储实际坡度值
        var lineArrayPD2=[];//存储坡度计算变量值
        var lineArrayPD1=[];//存储实际断面画线值 
        var linePoDuStaXFalg=false;//是否画纵断面
		$(data.lkjCurveInfoPoDuList).each(function(){
			
			if(index!=null){//判断
					if(signalNoTemp[index]==undefined)signalNoTemp[index]=0;
					if(linePoDuStaXTemp1[index]==undefined)linePoDuStaXTemp1[index]=0;
					if(linePoDuStaXTemp2[index]==undefined)linePoDuStaXTemp2[index]=0;
					if(linePoDuXTemp1[index]==undefined)linePoDuXTemp1[index]=0;
					if(linePoDuXTemp2[index]==undefined)linePoDuXTemp2[index]=0;
			}
			
			if(index!=null)
			if(signalNoTemp[index]<data.signalNo){//上次小于当前信号机值 			信号机增大
				
				var end2=0;
				var end3=0;
				var end4=0;
				var end5=0;
				var end6=0;
				
				var sta=this.lbegincoord;//开始里程
				var end=sta+this.ipolen1;    // 一个面
		    	
		    	if (this.ipolen2>0)
		    	 end2=this.ipolen1+this.ipolen2+this.lbegincoord;  //二个面
		    	 endd2=end2;
				
		    	if (this.ipolen2>0&&this.ipolen3>0)
		    	 end3=this.ipolen1+this.ipolen2+this.ipolen3+this.lbegincoord;  //三个面
		    	 endd3=end3;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0)
		    	 end4=this.ipolen1+this.ipolen2+this.ipolen3+this.ipolen4+this.lbegincoord;  //四个面
		    	 endd4=end4;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0&&this.ipolen5>0)
		    	 end5=this.ipolen1+this.ipolen2+this.ipolen3+this.ipolen4+this.ipolen5+this.lbegincoord;  //五个面
		    	 endd5=end5;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0&&this.ipolen5>0&&this.ipolen6>0)
		    	 end6=this.ipolen1+this.ipolen2+this.ipolen3+this.ipolen4+this.ipoen5+this.ipolen6+this.lbegincoord;  //六个面
		    	 endd6=end6;
		    	 
		    	 xend=0;
		    	lineArrayPD2[0]=sta;lineArrayPD2[1]=end;lineArrayPD2[2]=end2;lineArrayPD2[3]=end3;lineArrayPD2[4]=end4;lineArrayPD2[5]=end5;lineArrayPD2[6]=end6;
		    	for ( var int = 0; int < lineArrayPD2.length; int++) {
	        		if (lineArrayPD2[int]>xend) {
	        			xend=lineArrayPD2[int];
	        		}
		        }
		    	
		    	if(sta>=linePoDuStaXTemp1[index]){//开始里程大于上次结束里程       下行       大
		    		
		    		linePoDuStaXTemp1[index]=xend;//根据容器区分变量值 
		    		
			    	staXPD=(Math.abs(sta-data.signalDistance)*0.126)+nx;
			    	
			    	endXPD=(Math.abs(end-data.signalDistance)*0.126)+nx;
		    		
		    		if(end2>0)
			    		end2=Math.abs(end2-data.signalDistance)*0.126+nx;  
			    	if(end3>0)
			    		end3=Math.abs(end3-data.signalDistance)*0.126+nx;    
			    	
			    	if(end4>0)
			    		end4=Math.abs(end4-data.signalDistance)*0.126+nx;    
			    	
			    	if(end5>0)
			    		end5=Math.abs(end5-data.signalDistance)*0.126+nx;    
			    	
			    	if(end6>0)
			    		end6=Math.abs(end6-data.signalDistance)*0.126+nx; 
		    		
			    	lineArrayPD2[0]=staXPD;lineArrayPD2[1]=endXPD;lineArrayPD2[2]=end2;lineArrayPD2[3]=end3;lineArrayPD2[4]=end4;lineArrayPD2[5]=end5;lineArrayPD2[6]=end6;
			    	
		    		xend=0;
		    		for ( var int = 0; int < lineArrayPD2.length; int++) {
		        		if (lineArrayPD2[int]>xend) {
		        			xend=lineArrayPD2[int];
		        		}
			        }
		    		var maxFlag=false;
	    	    	for ( var int = 0; int < lineArrayPD2.length-1; int++) {
	    	    		if(lineArrayPD2[int+1]!=0){
	    	    			if(lineArrayPD2[int+1]>lineArrayPD2[int]){
	    	    				maxFlag=true;
	    	    			}else{
	    	    				maxFlag=false;
	    	    				break;
	    	    			}
	    	    		}
			        }
		    		
		    		if(staXPD>=linePoDuXTemp1[index]&&maxFlag){//  一直大     
		    			lineArrayPD1[0]=staXPD>0?(staXPD+addTemp2):0;lineArrayPD1[1]=endXPD>0?(endXPD+addTemp2):0;lineArrayPD1[2]=end2>0?(end2+addTemp2):0;lineArrayPD1[3]=end3>0?(end3+addTemp2):0;lineArrayPD1[4]=end4>0?(end4+addTemp2):0;lineArrayPD1[5]=end5>0?(end5+addTemp2):0;lineArrayPD1[6]=end6>0?(end6+addTemp2):0;
//		    			lineArrayPD1[0]=staXPD+addTemp2;lineArrayPD1[1]=endXPD+addTemp2;lineArrayPD1[2]=end2+addTemp2;lineArrayPD1[3]=end3+addTemp2;lineArrayPD1[4]=end4+addTemp2;lineArrayPD1[5]=end5+addTemp2;lineArrayPD1[6]=end6+addTemp2;
		    			lineArrayPD3[0]=this.ipodu1;
		    	    	lineArrayPD3[1]=this.ipodu2;
		    	    	lineArrayPD3[2]=this.ipodu3;
		    	    	lineArrayPD3[3]=this.ipodu4;
		    	    	lineArrayPD3[4]=this.ipodu5;
		    	    	lineArrayPD3[5]=this.ipodu6;
		    	    	
		    	    	linePoDuStaXFalg=true;
		    	    	linePoDuXTemp1[index]=xend;
		    		}
		    	}
			}else{
				var end2=0;
				var end3=0;
				var end4=0;
				var end5=0;
				var end6=0;
				
				var sta=this.lbegincoord;//开始里程
				var end=sta-this.ipolen1;    // 一个面
		    	
		    	if (this.ipolen2>0)
		    	 end2=this.lbegincoord-this.ipolen1-this.ipolen2;  //二个面
		    	 endd2=end2;
				
		    	if (this.ipolen2>0&&this.ipolen3>0)
		    	 end3=this.lbegincoord-this.ipolen1-this.ipolen2-this.ipolen3;  //三个面
		    	 endd3=end3;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0)
		    	 end4=this.lbegincoord-this.ipolen1-this.ipolen2-this.ipolen3-this.ipolen4;  //四个面
		    	 endd4=end4;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0&&this.ipolen5>0)
		    	 end5=this.lbegincoord-this.ipolen1-this.ipolen2-this.ipolen3-this.ipolen4-this.ipolen5;  //五个面
		    	 endd5=end5;
		    	
		    	if (this.ipolen2>0&&this.ipolen3>0&&this.ipolen4>0&&this.ipolen5>0&&this.ipolen6>0)
		    	 end6=this.lbegincoord-this.ipolen1-this.ipolen2-this.ipolen3-this.ipolen4-this.ipoen5-this.ipolen6;  //六个面
		    	 endd6=end6;
				
		    	lineArrayPD2[0]=sta;lineArrayPD2[1]=end;lineArrayPD2[2]=end2;lineArrayPD2[3]=end3;lineArrayPD2[4]=end4;lineArrayPD2[5]=end5;lineArrayPD2[6]=end6;
				
		    	xend=lineArrayPD2[0];
	    		for ( var int = 1; int < lineArrayPD2.length; int++) {
	        		if (lineArrayPD2[int]<xend&&lineArrayPD2[int]!=0) {
	        			xend=lineArrayPD2[int];
	        		}
		        }
				
				if(sta<=linePoDuStaXTemp2[index]){//开始里程大于上次结束里程       下行       大
					
					linePoDuStaXTemp2[index]=xend;
					
					staXPD=(Math.abs(sta-data.signalDistance)*0.126)+nx;
			    	
			    	endXPD=(Math.abs(end-data.signalDistance)*0.126)+nx;
		    		
		    		if(end2>0)
			    		end2=Math.abs(end2-data.signalDistance)*0.126+nx;  
			    	if(end3>0)
			    		end3=Math.abs(end3-data.signalDistance)*0.126+nx;    
			    	
			    	if(end4>0)
			    		end4=Math.abs(end4-data.signalDistance)*0.126+nx;    
			    	
			    	if(end5>0)
			    		end5=Math.abs(end5-data.signalDistance)*0.126+nx;    
			    	
			    	if(end6>0)
			    		end6=Math.abs(end6-data.signalDistance)*0.126+nx; 
			    	
			    	lineArrayPD2[0]=staXPD;lineArrayPD2[1]=endXPD;lineArrayPD2[2]=end2;lineArrayPD2[3]=end3;lineArrayPD2[4]=end4;lineArrayPD2[5]=end5;lineArrayPD2[6]=end6;
			    	
			    	xend2=0;
		    		for ( var int = 0; int < lineArrayPD2.length; int++) {
		        		if (lineArrayPD2[int]>xend2) {
		        			xend2=lineArrayPD2[int];
		        		}
			        }
		    		var maxFlag=false;
	    	    	for ( var int = 0; int < lineArrayPD2.length-1; int++) {
	    	    		if(lineArrayPD2[int+1]!=0){
	    	    			if(lineArrayPD2[int+1]>lineArrayPD2[int]){
	    	    				maxFlag=true;
	    	    			}else{
	    	    				maxFlag=false;
	    	    				break;
	    	    			}
	    	    		}
			        }
		    		
		    		if(staXPD>=linePoDuXTemp2[index]&&maxFlag){	//  一直大     
		    			
		    			lineArrayPD1[0]=staXPD>0?(staXPD+addTemp2):0;lineArrayPD1[1]=endXPD>0?(endXPD+addTemp2):0;lineArrayPD1[2]=end2>0?(end2+addTemp2):0;lineArrayPD1[3]=end3>0?(end3+addTemp2):0;lineArrayPD1[4]=end4>0?(end4+addTemp2):0;lineArrayPD1[5]=end5>0?(end5+addTemp2):0;lineArrayPD1[6]=end6>0?(end6+addTemp2):0;
		    			lineArrayPD3[0]=this.ipodu1;
		    	    	lineArrayPD3[1]=this.ipodu2;
		    	    	lineArrayPD3[2]=this.ipodu3;
		    	    	lineArrayPD3[3]=this.ipodu4;
		    	    	lineArrayPD3[4]=this.ipodu5;
		    	    	lineArrayPD3[5]=this.ipodu6;
		    	    
		    	    	linePoDuStaXFalg=true;
		    	    	linePoDuXTemp2[index]=xend2;
		    		}
				}
			}
			signalNoTemp[index]=data.signalNo;
		});	    	
		
		if (data.lkjCurveInfoPoDuList.length==0) {
			linePoDuStaXFalg=false;
		}
		
		//弯道---曲线
        var staXWD=0;//画线开始值 
        var endXWD=0;//画线结束值 
        var lineArrayWD;//存储画线公里值 
        var banJin=0;//半径
        var ixxTypeWD=0;//区别编号
        var staQX=0;//开始里程
        var endQX=0;//结束里程
        var lineQuEndXFalg=true;//是否画弯道曲线
        $(data.lkjCurveInfoWanDaoList).each(function(i){
        	
			staQX=this.lbegincoord;//开始里程
			endQX =this.lendcoord;//结束里程
			
			banJin=this.ibanjin;//半径;
			ixxTypeWD=this.ixxtype;//区别编号
			
			lineArrayWD=[staQX,endQX];
	    	staXWD=(Math.abs(lineArrayWD[0]-data.signalDistance)*0.126)+nx;//画线开始坐标
	    	endXWD=(Math.abs(lineArrayWD[1]-lineArrayWD[0])*0.126)+staXWD;//画线开始坐标
	    	
	    		if(index!=null)
		    	if(lineQuEndXTemp[index]==undefined)lineQuEndXTemp[index]=0;
		    	
		    	if(index!=null)
		    	if (staXWD<lineQuEndXTemp[index]) {  //如果这次开始小于上次结束 就不画线
		    		lineQuEndXFalg=false;
				}else {
					lineQuEndXFalg=true;
					if(endXWD>lineQuEndXTemp[index]){
						lineQuEndXTemp[index]=endXWD;//记录上一次结束坐标
					}
					staXWD+=addTemp2;
					endXWD+=addTemp2;
				}
        });
        
        if (data.lkjCurveInfoWanDaoList.length==0) {
        	lineQuEndXFalg=true;
		}
        
        var addTemp;
    	if(suoXiaoFalg){//true  表示大窗口    false 表示小窗口
    		addTemp=MaxValue;
    	}else{	
    		addTemp=minValue;
    	}
        
//        if (isError) {//不正常情况先只画两条线条+纵断面 弯道  道桥隧
//            //画实速线
//            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0]+addTemp, startY: this.setSpeedLineLastP[1], endX: nx+addTemp, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
//           
////          kcbz为0的就画，kcbz不为零的就不画
//            if(data.kcbz=="0"){//动车   非0时隐藏  限速   和  红线
//            	//画限速线
//            	this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0]+addTemp, startY: this.MaxSpeedLineLastP[1], endX: nx+addTemp, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed"),show:true,data:data });
//            }else{
//            	this.tool.drawSvgLine({ htmlId: this.id, color: 'purple', lineName: "linePurple", startX: this.MaxSpeedLineLastP[0]+addTemp, startY: this.MaxSpeedLineLastP[1], endX: nx+addTemp, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed"),show:false,data:data });
//            }
//       
//            //画坡度  --纵断面
//            if (linePoDuStaXFalg) {
//            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "congDuanMian", startX:staXPD, startY:0, endX: endXPD, endY:0, containerId: $("#" + this.id + " .congDuanMian"),lineArrayPD2:lineArrayPD1,lineArrayPD3:lineArrayPD3,signalDistanceFalg:true,suoXiaoFalg:suoXiaoFalg,show:true});
//			}else{
//				this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "congDuanMian", startX:staXPD, startY:0, endX: endXPD, endY:0, containerId: $("#" + this.id + " .congDuanMian"),lineArrayPD2:lineArrayPD1,lineArrayPD3:lineArrayPD3,signalDistanceFalg:false,suoXiaoFalg:suoXiaoFalg,show:true});
//			}
//            
//            //画弯道
//            if (lineQuEndXFalg) {
//            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "quXian",startX:staXWD, startY:12, endX: endXWD, endY:12,containerId: $("#" + this.id + " .quXian"),banJin:banJin,ixxTypeWD:ixxTypeWD,date:data.date,suoXiaoFalg:suoXiaoFalg,show:true});
//			}
//           
//            //画道桥隧
//            if (lineDQSFalg) {
//            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "daoQiaoSui", startX:staXDQS, startY:30, endX: endXDQS, endY: 30, containerId: $("#" + this.id + " .daoQiaoSui"),ixxType:ixxType,show:true });
//            }
//        }
//        else {
        		//画实速线
        		this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0]+addTemp, startY: this.setSpeedLineLastP[1], endX: nx+addTemp, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed"),show:true });
        		
//        		kcbz为0的就画，kcbz不为零的就不画
                 if(data.kcbz=="0"){//动车   非0时隐藏  限速   和  红线
                	 //画限速线
                	 this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0]+addTemp, startY: this.MaxSpeedLineLastP[1], endX: nx+addTemp, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed"),show:true,data:data });
                 }else{
                	 this.tool.drawSvgLine({ htmlId: this.id, color: 'purple', lineName: "linePurple", startX: this.MaxSpeedLineLastP[0]+addTemp, startY: this.MaxSpeedLineLastP[1], endX: nx+addTemp, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed"),show:false,data:data });
                 }
        		//画转速
        		this.tool.drawSvgLine({ htmlId: this.id, color: 'yellow', lineName: "lineYellow", startX: this.turnSpeedLast[0]+addTemp, startY: this.turnSpeedLast[1], endX: nx+addTemp, endY: nturnSpeed, containerId: $("#" + this.id + " .moveBottomSpeed"),show:true });
        		//画管压线
        		this.tool.drawSvgLine({ htmlId: this.id, color: 'blue', lineName: "lineBlue", startX: this.guanYaP[0]+addTemp, startY: this.guanYaP[1], endX: nx+addTemp, endY: ngy, containerId: $("#" + this.id + " .movePipePressure"),show:true });
        		//画缸压力线
        		this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen1", startX: this.gangyaLast[0]+addTemp, startY: this.gangyaLast[1], endX: nx+addTemp, endY: ngangy, containerId: $("#" + this.id + " .movePipePressure"),show:true });
        	
            //画坡度  --纵断面
            if (linePoDuStaXFalg) {
            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "congDuanMian", startX:staXPD, startY:0, endX: endXPD, endY:0, containerId: $("#" + this.id + " .congDuanMian"),lineArrayPD2:lineArrayPD1,lineArrayPD3:lineArrayPD3,signalDistanceFalg:true,suoXiaoFalg:suoXiaoFalg,show:true});
			}else{
				this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "congDuanMian", startX:staXPD, startY:0, endX: endXPD, endY:0, containerId: $("#" + this.id + " .congDuanMian"),lineArrayPD2:lineArrayPD1,lineArrayPD3:lineArrayPD3,signalDistanceFalg:false,suoXiaoFalg:suoXiaoFalg,show:true});
			}
            
            //画弯道
            if (lineQuEndXFalg) {
            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "quXian",startX:staXWD, startY:12, endX: endXWD, endY:12,containerId: $("#" + this.id + " .quXian"),banJin:banJin,ixxTypeWD:ixxTypeWD,date:data.date,suoXiaoFalg:suoXiaoFalg,show:true});
			}
           
            //画道桥隧
            if (lineDQSFalg) {
            	this.tool.drawSvgLine({ htmlId: this.id, color: '#FFFFFF', lineName: "daoQiaoSui", startX:staXDQS, startY:30, endX: endXDQS, endY: 30, containerId: $("#" + this.id + " .daoQiaoSui"),ixxType:ixxType,show:true });
            }
        
//        }
        
        //中间黄线移动到最新位置
        this.MiddleLineLeft += newW;
        
        //保存数据，用于往后拖动的时候显示数据
        if (newW != 0) {
            if (!this.isNowPlay) {
                this.moveHisItem.push({ distance: this.MiddleLineLeft, playCount: this.playCount });
            } else {
                this.moveItem.push({ distance: this.MiddleLineLeft, nowPlayCount: this.nowPlayCount });
            }
        }
        
        //中间黄线移动位置
        if(suoXiaoFalg){//true  表示大窗口    false 表示小窗口
        	 this.tool.setLeft("#" + this.id + " .moveMiddleLine", (this.MiddleLineLeft+MaxValue));
        }else{
        	 this.tool.setLeft("#" + this.id + " .moveMiddleLine", (this.MiddleLineLeft+minValue));
        }
       
        //移动机车位置
        this.moveCar(newW,suoXiaoFalg);
        //容器长度加nx然后整体往左移动nx
        $(".moveBottomSpeed", this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .moveBottomSpeed") +newW);

//        console.log(this.id+"信号机"+data.signalNo+"实时前方距离:"+data.distance+"----------变化距离:"+this.MiddleLineLeft+"***********"+newW);
        
        var xhjArray3Falg=true;//判断是否有重复的信号机,避免画重复信号机
        if (this.lastSignalId != data.signalNo && !isError && !this.isSingular) {
        	 var json = JSON.stringify(xhjArray3);
        	  var data2=JSON.parse(json); 
        	  for ( var int = 0; int < data2.length; int++) {
        		  if(this.id==data2[int].id)
        			  if(data.signalNo==data2[int].signalNo){
        				  xhjArray3Falg=false;
        				  break;
        			  }
        	  }
        	if(xhjArray3Falg){
        		var xhj = new Object();
        		xhj.signalNo=data.signalNo;
        		xhj.id=this.id;
        		xhjArray3[xhjArray3Index]=xhj;//存储信号机
        		xhjArray3Index++;
        	}
        }
        
      //出信号点 
        var changeColorFlag=false;
        if (this.lastSignalId != data.signalNo && !isError && !this.isSingular) {
        	if(xhjArray3Falg){
        		this.AddSignal(data, this.MiddleLineLeft,suoXiaoFalg);
        		changeColorFlag=true;
        	}
            this.lastSignalId = data.signalNo;
        }
        
      //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
    	if(this.drawStationFlag){
    		if(data.signalId!= 
    			1&&data.signalId!=2&&data.signalId!=0){
    			//画车站
        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", this.mCDiv);
        		/*var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
        		this.AddStation(data, parseInt($(divs[divs.length-2]).css("left"))+left/2);*/
        		this.AddStation(data, parseInt($(divs[divs.length-1]).css("left"))-500);
        		this.drawStationFlag=false;
    		}
    	}
    	else if(data.signalId==1
    			||data.signalId==2){
    		this.drawStationFlag=true;//可能下一次循环就要开始加载车站了
    	}
        //管压
        $(".movePipePressure", this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .movePipePressure") +newW);
        // $(".moveLightBar",this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .moveLightBar") + newW);
        
        //设置 div容器宽
        $("#"+this.id+" .newMoveShowHisDiv").css("width", this.tool.getWidth("#" + this.id + " .newMoveShowHisDiv") +(newW+10));
        $("#"+this.id+" .quXian").css("width", this.tool.getWidth("#" + this.id + " .newMoveShowHisDiv") +(newW+10));
        
        
        if(changeColorFlag){
    		this.colorBar(newW, data,suoXiaoFalg,true); //最后一个参数为true 说明需要画新的光带
    	}
    	else 
    		this.colorBar(newW, data,suoXiaoFalg); //彩带
        
        
        if (!this.isMove) {
            if (this.lastScroolLeft) {
                newW += this.lastScroolLeft;
                this.lastScroolLeft = 0;
            }
            this.move(newW, data);
        }
        else {
            this.lastScroolLeft += newW;
        }
        this.setLastArr({ nx: nx, nyp: nyp, nyl: nyl, ngy: ngy, ngangy: ngangy, nturnSpeed: nturnSpeed, lastDate: data.date, lastSingular: this.isSingular });
        this.distanceLast = data.distance;
    }
};
//获取彩带颜色
MoveCurve.prototype.getColorBarColor = function (srcimg) {
    var imgobj = { "NO.png": "#242424", "L.png": "#76CC37", "LU.png": "#90D55D,#E19014", "U.png": "#ECBF3A", "U2.png": "#ECC43E", "UU.png": "#E0C030,#E0C030", "HU.png": "#EDCC47,#D61D1C", "H.png": "#DB0B04", "B.png": "#F3F3F3" };
    return imgobj[srcimg] ? imgobj[srcimg] : "#242424";
};
//获取彩带颜色
MoveCurve.prototype.getColorFont = function (srcimg) {
    var imgobj = { "NO.png": "", "L.png": "L", "LU.png": "LU", "U.png": "U", "U2.png": "U2", "UU.png": "UU", "HU.png": "HU", "H.png": "H", "B.png": "" };
    return imgobj[srcimg] ? imgobj[srcimg] : "";
};
//添加彩带
var initValue=[];
var chaVal=[];
MoveCurve.prototype.colorBar = function (newW, data,suoXiaoFalg,signalChangeFlag) {
    var that = this;
    var th=this.id;		
    var i=Number(th.substring(th.length-1,th.length));
    //if(!newW) return;//如果是没有走动的话 就什么都不做
    var cw = $("#" + this.id + " .moveLightBar").width() +newW; //得到最新的总长度
    that.moveLightBar.css("width", cw); //宽度
    var tempimg = this.tool.imgurl0bj[data.lightColor.toString()];
    var srcimg = tempimg ? tempimg : "NO.png"; //根据数据得到图片
    var bgc = this.getColorBarColor(srcimg); //根据图片得到背景颜色
    
    if(suoXiaoFalg){//true  表示大窗口   
    	if ($(".linebar", that.moveLightBar).length == 0) {//第一次添加
    		initValue[i]=initVal[i];
			that.moveLightBar.append("<div class='linebar firstOneLineBar' style='margin-left:" + (0) + "px;background-color:" + bgc + ";text-align:center;'></div>");
    	}
    }else{// false 表示小窗口
    	 if ($(".linebar", that.moveLightBar).length == 0) {//第一次添加
    		 initValue[i]=initVal[i];
			 that.moveLightBar.append("<div class='linebar firstOneLineBar' style='margin-left:" + (0) + "px;background-color:" + bgc + ";text-align:center;'></div>");
    	 }
    }
    
    if (that.isTurnSingal) {//如果是反转距离，那么最后的光带还要加上这段距离   是否信号机改变标志    标志改变
        $(".linebar:last", that.moveLightBar).css("width", function (i, v) {
            if (!$(this).attr("linew")) {
                $(this).attr("linew", newW);
                return newW + "px";
            }
            $(this).attr("linew", parseFloat($(this).attr("linew")) + newW);
            return $(this).attr("linew") + "px";
        });
    }
    if(signalChangeFlag){
    	if (bgc.split(",").length > 1) {//两种颜色的
            that.moveLightBar.append("<div class='linebar' style='text-align:center;color:white'><span>"+this.getColorFont(srcimg)+
            		"</span><div class='linebarTop' style='background-color:" + bgc.split(",")[0] + ";text-align:center' ></div>" +
            		"<div class='linebarBottom' style='background-color:" + bgc.split(",")[1] + ";text-align:center'></div></div>");
        }
        else {//一种颜色
            that.moveLightBar.append("<div class='linebar'  style='background-color:" + bgc + ";text-align:center;color:white'><span>"+this.getColorFont(srcimg)+"</span></div>");
        }
    	that.lastSignalFlag=true;
    }
    else if(that.lightColorisChange) {//图标改变时候就添加
    	if(!that.lastSignalFlag){
    		that.lastSignalFlag=false;
            if (bgc.split(",").length > 1) {//两种颜色的
                that.moveLightBar.append("<div class='linebar' style='text-align:center;color:white'><span>"+this.getColorFont(srcimg)+"</span><div class='linebarTop' style='background-color:" + bgc.split(",")[0] + ";text-align:center' ></div>" +
                		"<div class='linebarBottom' style='background-color:" + bgc.split(",")[1] + ";text-align:center'></div></div>");
            }
            else {//一种颜色
                that.moveLightBar.append("<div class='linebar'  style='background-color:" + bgc + ";text-align:center;color:white'><span>"+this.getColorFont(srcimg)+"</span></div>");
            }
    	}
    	else if($(".linebar:last",that.moveLightBar).find("span").html()!=this.getColorFont(srcimg)){
    		//更新光带文字
    		
    		var lastLinebarTopDiv=$(".linebar:last .linebarTop",that.moveLightBar);
    		var lastLinebarBottomDiv=$(".linebar:last .linebarBottom",that.moveLightBar);
    		if (bgc.split(",").length > 1) {//两种颜色的
    			if(lastLinebarTopDiv.length>0){
    				$(".linebar:last",that.moveLightBar).find("span").html(this.getColorFont(srcimg));
    				lastLinebarTopDiv.css("background-color",bgc.split(",")[0]);
    				lastLinebarBottomDiv.css("background-color",bgc.split(",")[1]);
    			}
    			else{
    				$(".linebar:last",that.moveLightBar).empty();
    				that.moveLightBar.append("<div class='linebar' style='text-align:center;color:white'>" +
    						"<span>"+this.getColorFont(srcimg)+"</span><div class='linebarTop' " +
    								"style='background-color:" + bgc.split(",")[0] + ";text-align:center' >" +
    										"</div><div class='linebarBottom' style='background-color:" +
    										bgc.split(",")[1] + ";text-align:center'></div></div>");
    			}
            }
            else {//一种颜色
    			if(lastLinebarTopDiv.length>0){
    				$(".linebar:last",that.moveLightBar).remove();
    				that.moveLightBar.append("<div class='linebar'  style='background-color:" + 
    						bgc + ";text-align:center;color:white'><span>"+this.getColorFont(srcimg)
    						+"</span></div>");
    			}
    			else{
    				$(".linebar:last",that.moveLightBar).find("span").html(this.getColorFont(srcimg));
    				$(".linebar:last",that.moveLightBar).css("background-color",bgc);
    			}
            
            }
    	}
    }
    if (!that.isTurnSingal) {// 是否信号机改变标志    标志没有改变
        $(".linebar:last", that.moveLightBar).css("width", function (i, v) {
            if (!$(this).attr("linew")) {
                $(this).attr("linew", newW);
                return newW + "px";
            }
            $(this).attr("linew", parseFloat($(this).attr("linew")) + newW);
            return $(this).attr("linew") + "px";
        });
    }
    
    if(isClear[i]&&!this.isLargerWin){//小窗口下
    		if(staValue[i])
    		$("#"+this.id+" .linebar").first().css("margin-left",initVal[i]+"px");
    	 	var firstW=$("#"+this.id+" .linebar").first().width();
    	 	var cha=(firstW-(initVal[i]-initValue[i]));
    	 	if(cha<chaVal[i])
    	 		cha=chaVal[i];
    	 	if(cha<0){
    	 		$("#"+this.id+" .linebar").first().css("margin-left",(initVal[i]-Math.abs(cha))+"px");
    	 		cha=0;
    	 		staValue[i]=false;
    	 	}
    	 	if(staValue[i])
    	 	$("#"+this.id+" .linebar").first().css("width",cha+"px");
    	 	chaVal[i]=cha;
    }
   
    if(isClear[i]&&this.isLargerWin){//大窗口 下
		$("#"+this.id+" .linebar").first().css("margin-left",initVal[i]+"px");
	 	var firstW=$("#"+this.id+" .linebar").first().width();
	 	var cha=(firstW-(initVal[i]-initValue[i]));
	 	if(cha<chaVal[i])
	 		cha=chaVal[i];
	 	if(cha<0)cha=0;
	 	$("#"+this.id+" .linebar").first().css("width",cha+"px");
	 	chaVal[i]=cha;
    }
    
    isClear[i]=true;
};
//获取信号机的图片
MoveCurve.prototype.getSignalImg = function (data) {
    var imgs = ["xhjPoint_green.png"];
    switch (data.lightColor) {
        case 0:
            imgs = ["xhjPoint_black.png"];
            break;
        case 1:
            imgs = ["xhjPoint_green.png"];
            break;
        case 2:
            imgs = ["xhjPoint_green.png", "xhjPoint_yellow.png"];
            break;
        case 4:
            imgs = ["xhjPoint_yellow.png"];
            break;
        case 8:
            imgs = ["xhjPoint_yellow.png"];
            break;
        case 16:
            imgs = ["xhjPoint_yellow.png", "xhjPoint_yellow.png"];
            break;
        case 32:
            imgs = ["xhjPoint_yellow.png", "xhjPoint_red.png"];
            break;
        case 64:
            imgs = ["xhjPoint_red.png"];
            break;
        case 128:
            imgs = ["xhjPoint_white.png"];
            break;
        default:
            break;
    }
    return imgs;
};
//添加车站
MoveCurve.prototype.AddStation = function (data, newSL) {
/*    var newXd = data.distance * this.wX / 5000;
    //计算这个距离在座标上面的距离
    var newxinhaoleft = newSL + newXd;*/

    var	newXP= $("<div class='moveWayLabelDiv1' style='height:200px'><div class='moveC'><img style='left:-10px' src='../static/img/app/moveCurve/NO.png' alt='' />" +
    		"</div><div class='signalNum' style='left:-220px;text-align:right;width:200px;color:#00BFF3'>" +data.sName + "</div></div>")
	.css("left", newSL+"px").attr("id", "stationId" + data.stationTmis);
    $(".moveBottomSpeed",this.mCDiv).append(newXP);
}; 
//添加信号机
MoveCurve.prototype.AddSignal = function (data, newSL,suoXiaoFalg) {
    var newXd = data.distance * this.wX / 5000;
    //计算这个距离在座标上面的距离
    var newxinhaoleft = newSL + newXd;
    //$(".moveWayLabelDiv .moveC").removeClass("movePGreen").addClass("movePGray");
    var colorImgArr = this.getSignalImg(data);
    var newXP = null;
    
    if(suoXiaoFalg){
    	if (colorImgArr.length == 1) {
    		newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/" + colorImgArr[0] + "' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft+MaxValue).attr("id", "xhid" + data.signalId);
    	}
    	else {
    		newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/" + colorImgArr[0] + "' alt='' /><img style='top:12px;' src='../static/img/app/moveCurve/" + colorImgArr[1] + "' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft+MaxValue).attr("id", "xhid" + data.signalId);
    	}
    	$(".moveBottomSpeed", this.mCDiv).append(newXP);
    	//画公里表
    	var ki = $('<div class="moveWayNum"><div class="moveHLine"></div><div class="moveWayN_Num">' + (data.kiloSign / 1000) + '</div></div>').css("left", newxinhaoleft+MaxValue);
    	$(".moveWayLabel", this.mCDiv).append(ki);
    	$(".moveWayLabel", this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .moveWayLabel") + newxinhaoleft+MaxValue);
    }else{
    	if (colorImgArr.length == 1) {
    		newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/" + colorImgArr[0] + "' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft+minValue).attr("id", "xhid" + data.signalId);
    	}
    	else {
    		newXP = $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/" + colorImgArr[0] + "' alt='' /><img style='top:12px;' src='../static/img/app/moveCurve/" + colorImgArr[1] + "' alt='' /></div><div class='signalNum'>" + data.signalNo + "</div></div>").addClass("movePGreen").css("left", newxinhaoleft+minValue).attr("id", "xhid" + data.signalId);
    	}
    	$(".moveBottomSpeed", this.mCDiv).append(newXP);
    	//画公里表
    	var ki = $('<div class="moveWayNum"><div class="moveHLine"></div><div class="moveWayN_Num">' + (data.kiloSign / 1000) + '</div></div>').css("left", newxinhaoleft+minValue);
    	$(".moveWayLabel", this.mCDiv).append(ki);
    	$(".moveWayLabel", this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .moveWayLabel") + newxinhaoleft+minValue);
    };
    
//    console.log(this.id+"前方距离算出的值："+newXd+"前方距离:"+data.distance+"当前信号机："+data.signalNo+"变化值 ："+newxinhaoleft);

};
//移动机车
MoveCurve.prototype.moveCar = function (newW,suoXiaoFalg) {
    this.carP += newW;
    if(suoXiaoFalg){//窗口缩小状态
    	this.tool.setLeft("#" + this.id + " .currentTrain", (this.carP+MaxValue));
    }else{
    	this.tool.setLeft("#" + this.id + " .currentTrain", (this.carP+minValue));
    }
};
//给记录数组赋值
MoveCurve.prototype.setLastArr = function (data) {
    this.setSpeedLineLastP = [data.nx, data.nyp];
    this.MaxSpeedLineLastP = [data.nx, data.nyl];
    this.guanYaP = [data.nx, data.ngy];
    this.gangyaLast = [data.nx, data.ngangy];
    this.turnSpeedLast = [data.nx, data.nturnSpeed];
    this.lastDate = data.lastDate;
    this.lastSingular = data.lastSingular;
};
MoveCurve.prototype.jumpDistance = function (num) {
    if (!this.setSpeedLineLastP) {
        this.setSpeedLineLastP = [];
        this.MaxSpeedLineLastP = [];
        this.guanYaP = [];
        this.gangyaLast = [];
        this.turnSpeedLast = [];
        this.setSpeedLineLastP[0] = num;
        this.MaxSpeedLineLastP[0] = num;
        this.guanYaP[0] = num;
        this.gangyaLast[0] = num;
        this.turnSpeedLast[0] = num;
        return;
    };
    this.setSpeedLineLastP[0] += num;
    this.MaxSpeedLineLastP[0] += num;
    this.guanYaP[0] += num;
    this.gangyaLast[0] += num;
    this.turnSpeedLast[0] += num;
};
//移动
MoveCurve.prototype.move = function (newW, data) {
    this.scroolLeft += newW;
    $(".moveBottomContainDiv", this.mCDiv).scrollLeft(this.scroolLeft);
};
//加载html的方法
MoveCurve.prototype.loadHtml = function (url, fncb) {
    RTU.invoke("core.router.load", {
        url: url,
        async: false,
        success: function (html) {
            if (fncb) {
                fncb(html);
            }
        }
    });
};
//显示提示
MoveCurve.prototype.showTipMsg = function (msg, time) {

    $(".loadMsg", this.mCDiv).empty().text(msg);
    $(".loadMsg", this.mCDiv).show();
    if (time) {
        var that = this;
        setTimeout(function () {
            that.hideTipMsg();
        }, time * 1000);
    }
};
//隐藏提示
MoveCurve.prototype.hideTipMsg = function (t) {
    if (t) {
        setTimeout(function () {
            $(".loadMsg", this.mCDiv).hide();
        }, t * 1000);
    } else {
        $(".loadMsg", this.mCDiv).hide();
    };

};
//克隆对象
MoveCurve.prototype.clone = function (Obj) {
    if (typeof (Obj) != 'object') return Obj;
    if (Obj == null) return Obj;
    var myNewObj = new Object();
    for (var i in Obj)
        myNewObj[i] = Obj[i];
    return myNewObj;
};
//工具类
var lastMaxVal=[];//纵断面最大值
var xstaMinVal=[];//纵断面开始值 
var quXianStartVal=[];//曲线开始
var quXianEndVal=[];//曲线结束
var daoQiaoSuiMaxTemp=[];//道桥隧
var initVal=[];//同步最开始值 
var countSVG=[];
MoveCurve.prototype.tool = {
    DateTimeFormat: function (d, fmt) {//日期格式
        var o = {
            "M+": d.getMonth() + 1, //月份 
            "d+": d.getDate(), //日 
            "h+": d.getHours(), //小时 
            "m+": d.getMinutes(), //分 
            "s+": d.getSeconds(), //秒 
            "q+": Math.floor((d.getMonth() + 3) / 3), //季度 
            "S": d.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    getLeft: function (selectStr) { //获取left
        return parseInt($(selectStr).css("left").substring(0, $(selectStr).css("left").length - 2));
    },
    setLeft: function (selectStr, value) {
        $(selectStr).css("left", value);
    },
    getWidth: function (selectStr) {
        if ($(selectStr).css("width"))
            return parseInt($(selectStr).css("width").substring(0, $(selectStr).css("width").length - 2));
        else {
            return 0;
        }
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
    /*重要方法*///次方法是画线的核心，通过前后两个点的坐标画线
    drawSvgLine: function (obj) {
        var startX = obj.startX || 0; //开始点的x坐标
        var startY = obj.startY || 0; //开始点的y坐标
        var endX = obj.endX || 0; //开结束点的x坐标
        var endY = obj.endY || 0; //开结束点的y坐标
        var color = obj.color || "red"; //线的颜色 
        var container = obj.containerId; //$ 容器对象
        var lineName = obj.lineName || "line"; //每条线的名字
        if (!container) return; //如果画线的容器不存在就直接返回
        var svgId = '#' + obj.htmlId + ' .svg' + lineName; //包涵每条线的svgid
        var lineId = 'svg' + lineName + "line"; //线条的id
        if ($(svgId).length == 0) {//第一次添加，添加svg容器和线条
        	if ("congDuanMian"==lineName) {
        		container.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points=' + 0 + ',' + 12 + ' ' + 0 + ',' + 12 + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        	}else if("quXian"==lineName){
        		container.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points=' + 521 + ',' + 12 + ' ' + 521 + ',' + 12 + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        	}else if("daoQiaoSui"==lineName){
        		container.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points=' + 0 + ',' + 18 + ' ' + startX + ',' + startY + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        	}else{
        		if(lineName!="linePurple"&&lineName!="lineRed")
        		container.append('<svg style="position: absolute;top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points=' + startX + ',' + startY + ' ' + startX + ',' + startY + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        	}
        }
        var i=Number(obj.htmlId.substring(obj.htmlId.length-1,obj.htmlId.length));
        if(countSVG[i]==undefined)countSVG[i]=0;
        if(initVal[i]==undefined)initVal[i]=0;
        var falg=false;
        var line = $(svgId + " ." + lineId)[0]; //读取当前的线条
        if(obj.show){
        	if(lineName=="lineRed"){
        		if(countSVG[i]>1&&endY!=0&&startX>initVal[i]){
        			container.append('<svg style="position: absolute;top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points="'+startX+','+startY+' '+endX+','+endY+'"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
        			falg=true;
        		}
    			countSVG[i]++;//svg个数
        	}
        }
        
        if(falg)
        line = $(svgId + " ." + lineId)[countSVG[i]]; //读取当前的线条
        
        $(svgId).attr({ "width": obj.containerId.width(), "height": obj.containerId.height() }); //设置svg容器的宽度
       
        //获取最开始的值 
        if ("lineGreen"==lineName) {
        	if (line && line.getAttributeNS){
        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
				var x=points[0].split(",")[0];
				initVal[i]=x;
        	}
        }
        //纵断面
       if ("congDuanMian"==lineName) {
        	
        	var signalDistanceFalg=obj.signalDistanceFalg;//是否画纵断面
        	var lineArrayPD2 =obj.lineArrayPD2;//划线坐标
        	var lineArrayPD3=obj.lineArrayPD3;//坡度   判断正负  
        	if(lastMaxVal[thisObj]==undefined)lastMaxVal[thisObj]=0;
	        if(xstaMinVal[thisObj]==undefined)xstaMinVal[thisObj]=0;
        	if(signalDistanceFalg){//有值可画线

	        	//获取最大值 
	        	for ( var int = 0; int < lineArrayPD2.length; int++) {
	        		if (lineArrayPD2[int]>lastMaxVal[thisObj]) {
	        			lastMaxVal[thisObj]=lineArrayPD2[int];//记录当前画线最大值 
	        		}
	        	}
	        	
        		var xsta=lineArrayPD2[0];
        		var x1=lineArrayPD2[1];
        		xstaMinVal[thisObj]=xsta;//记录当前画线开始值 
        		
	        	var falg=true;//表示上坡
	        	if (lineArrayPD3[0]>0&&lineArrayPD2[0]>0&&xsta>0&&x1>0) {   //上坡
	        		if (line && line.getAttributeNS&&xsta!=undefined&&x1!=undefined) {//如果线条存在
	        		falg=true;
	        		
	        		var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points0[points0.length - 1] = xsta + "," + 12; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint0);
	        		
	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points[points.length - 1] = xsta + "," + 0; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint);
	        		
	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points2[points2.length - 1] = xsta + "," + 24; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint2);
	        		
	        		var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points3[points3.length - 1] = x1 + "," + 0; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
	        		var line3 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint3);
	        		
	        		var points4 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points4[points4.length - 1] = x1 + "," + 24; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points4.join(' ')); //把数据设回到线上面,
	        		var line4 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint4 = line.getAttributeNS(null, 'points') + " " + line4[line4.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint4);
	        		
	        		var points5 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points5[points5.length - 1] = x1 + "," + 12; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points5.join(' ')); //把数据设回到线上面,
	        		var line5 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint5 = line.getAttributeNS(null, 'points') + " " + line5[line5.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint5);
	        		
	        		var con =container.children();//在下级元素中添加        	
	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((x1-xsta)/2)+xsta-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[0])+'</text></svg>');
	        		}
				}else if(lineArrayPD3[0]<=0&&lineArrayPD2[0]>0&&xsta>0&&x1>0){
					if (line && line.getAttributeNS&&xsta!=undefined&&x1!=undefined) {//如果线条存在
					falg=false;
					var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
					points0[points0.length - 1] = xsta + "," + 12; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint0);
	        		
	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points[points.length - 1] = xsta + "," + 24; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint);
	        		
	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points2[points2.length - 1] = xsta + "," + 0; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint2);
	        		
	        		var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points3[points3.length - 1] = x1 + "," + 24; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
	        		var line3 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint3);
	        		
	        		var points4 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points4[points4.length - 1] = x1 + "," + 0; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points4.join(' ')); //把数据设回到线上面,
	        		var line4 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint4 = line.getAttributeNS(null, 'points') + " " + line4[line4.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint4);
	        		
	        		var points5 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        		points5[points5.length - 1] = x1 + "," + 12; //往点的数据上追加一个数据
	        		line.setAttributeNS(null, 'points', points5.join(' ')); //把数据设回到线上面,
	        		var line5 = line.getAttributeNS(null, 'points').split(' ');
	        		var linepoint5 = line.getAttributeNS(null, 'points') + " " + line5[line5.length - 1]; //在设置一个最后的点，作为下次的开始点
	        		line.setAttributeNS(null, 'points', linepoint5);
	        		
	        		var con =container.children();//在下级元素中添加        	
	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((x1-xsta)/2)+xsta-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[0])+'</text></svg>');
					}
	        	}
	        	if (line && line.getAttributeNS){
		        	if (falg) {
						var shangFalg=true;
						for ( var int = 1; int < lineArrayPD3.length; int++) {
							if (lineArrayPD3[int]>0) {
								if(lineArrayPD2[int+1]>0){  //表示有值可画线   上坡  画  上坡
									if (shangFalg) {
										var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			            				points0.length=points0.length-1;
			        	        		points0[points0.length - 1] = lineArrayPD2[int+1] + "," +0; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
			        	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint0);
			        	        		
			        	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			        	        		points[points.length - 1] = lineArrayPD2[int+1] + "," + 24; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
			        	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint);
			        	        		
			        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," + 12; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
			        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint2);
			        	        		
			        	        		var con =container.children();//在下级元素中添加        	
			        	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
			        	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((lineArrayPD2[int+1]-lineArrayPD2[int])/2)+lineArrayPD2[int]-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[int])+'</text></svg>');
			        	        		
									}else {    //下坡  画上坡
										
										var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			            				points0.length=points0.length-1;
			            				var x=points0[points0.length - 1].split(",")[0];
			        	        		points0[points0.length - 1] = x + "," +24; //改变数据
			        	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
			        	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint0);
			        	        		
			        	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			        	        		points[points.length - 1] = lineArrayPD2[int+1] + "," +0; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
			        	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint);
			        	        		
			        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," +24; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
			        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint2);
			        	        		
			        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
			        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," + 12; //往点的数据上追加一个数据
			        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
			        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint2);
			        	        		
			        	        		var con =container.children();//在下级元素中添加        	
			        	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
			        	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((lineArrayPD2[int+1]-lineArrayPD2[int])/2)+lineArrayPD2[int]-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[int])+'</text></svg>');
									}
		        	        		shangFalg=true;
								}
							}else {
								//上坡  画  下坡
								if(lineArrayPD2[int+1]>0){  //表示有值可画线
									var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		            				points0.length=points0.length-1;
		            				if(points0[points0.length - 1]!=null){
		            					var x=points0[points0.length - 1].split(",")[0];
			        	        		points0[points0.length - 1] = x + "," + 0; //改变数据
			        	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
			        	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
			        	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
			        	        		line.setAttributeNS(null, 'points', linepoint0);
		            				}
		        	        		
		        	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points[points.length - 1] = lineArrayPD2[int+1] + "," + 24; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
		        	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint);
		        	        		
		        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," + 0; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
		        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint2);
		        	        		
		        	        		var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points3[points3.length - 1] = lineArrayPD2[int+1] + "," + 12; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
		        	        		var line3 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint3);
									shangFalg=false;
									
									var con =container.children();//在下级元素中添加        	
		        	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
		        	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((lineArrayPD2[int+1]-lineArrayPD2[int])/2)+lineArrayPD2[int]-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[int])+'</text></svg>');
								}
							}
						}
					}else {
						for ( var int = 1; int < lineArrayPD3.length; int++) {
							if (lineArrayPD3[int]>0) {        //下坡  画上坡
								if(lineArrayPD2[int+1]>0){  //表示有值可画线
									
									var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		            				points0.length=points0.length-1;
		            				var x=points0[points0.length - 1].split(",")[0];
		        	        		points0[points0.length - 1] = x + "," +24; //改变数据
		        	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
		        	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint0);
		        	        		
		        	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points[points.length - 1] = lineArrayPD2[int+1] + "," +0; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
		        	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint);
		        	        		
		        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," +24; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
		        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint2);
		        	        		
		        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," + 12; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
		        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint2);
		        	        		
		        	        		var con =container.children();//在下级元素中添加        	
		        	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
		        	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((lineArrayPD2[int+1]-lineArrayPD2[int])/2)+lineArrayPD2[int]-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[int])+'</text></svg>');
								}
							}else {							//下坡  画 下 坡
								if(lineArrayPD2[int+1]>0){  //表示有值可画线
									
									var points0 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		            				points0.length=points0.length-1;
		            				var x=points0[points0.length - 1].split(",")[0];
		        	        		points0[points0.length - 1] = x + "," + 0; //改变数据
		        	        		line.setAttributeNS(null, 'points', points0.join(' ')); //把数据设回到线上面,
		        	        		var line0 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint0 = line.getAttributeNS(null, 'points') + " " + line0[line0.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint0);
		        	        		
		        	        		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points[points.length - 1] = lineArrayPD2[int+1] + "," + 24; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
		        	        		var line1 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint);
		        	        		
		        	        		var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points2[points2.length - 1] = lineArrayPD2[int+1]+ "," + 0; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
		        	        		var line2 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint2);
		        	        		
		        	        		var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        	        		points3[points3.length - 1] = lineArrayPD2[int+1] + "," + 12; //往点的数据上追加一个数据
		        	        		line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
		        	        		var line3 = line.getAttributeNS(null, 'points').split(' ');
		        	        		var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
		        	        		line.setAttributeNS(null, 'points', linepoint3);
		        	        		
		        	        		var con =container.children();//在下级元素中添加        	
		        	        		//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
		        	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(((lineArrayPD2[int+1]-lineArrayPD2[int])/2)+lineArrayPD2[int]-15)+'" y="12" fill="#EBEBE4">'+Math.abs(lineArrayPD3[int])+'</text></svg>');
								}
							}
						}
					}
	        	}
        	}
        	else{//纵断面  画加载线
	        		if (line && line.getAttributeNS) {
//	        			var w=$("#"+obj.htmlId+" .svgcongDuanMian").width();
//	        			var i=obj.htmlId.substring(obj.htmlId.length-1,obj.htmlId.length);
	        			var wi=$("#"+obj.htmlId+" .newMoveShowHisDiv").width();
	        			var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        			
	        			if(wi>=initVal[i]&&isClear[i]){
	        				points[points.length - 1] = wi + "," + 12; //往点的数据上追加一个数据
	        				line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        				var line1 = line.getAttributeNS(null, 'points').split(' ');
	        				var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
	        				line.setAttributeNS(null, 'points', linepoint);
	        			}
		        	}	
        		}
        	//处理加载线画过头的情况
	        	if (line && line.getAttributeNS) {
	        			var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		        		//大于xsta      小于lastMaxVal[thisObj]
		        		var index=0;
		        		// 查找替换   每一个开始坐标前面不能有比它大的
	        			for ( var int2 = 0; int2 < points.length; int2++) {
	        				var x=points[int2].split(",")[0];
	        				if (x==xstaMinVal[thisObj]) {
	        					index=int2;
							}
						}
	        			for ( var int3 = 0; int3 < index; int3++) {
	        				var x=points[int3].split(",")[0];
	        				if (x>xstaMinVal[thisObj]) {
								points[int3] = xstaMinVal[thisObj] + "," + 12;
								line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        				}
						}
	        			
	        			
	        			// 查找替换   每一个结束坐标后面不能有比它小的
	        			for ( var int2 = 0; int2 < points.length; int2++) {
	        				var x=points[int2].split(",")[0];
	        				if (x==lastMaxVal[thisObj]) {
	        					index=int2;
							}
						}
	        			for ( var int3 = index; int3 <points.length; int3++) {
	        				var x=points[int3].split(",")[0];
	        				if (x<lastMaxVal[thisObj]) {
								points[int3] = lastMaxVal[thisObj] + "," + 12;
								line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        				}
						}
	        			
//	        			// 查找替换   每一个结束坐标前面不能有比它大的
	        			if(lastMaxVal[thisObj]>0){
	        				for ( var int2 = 0; int2 < points.length; int2++) {
	        					var x=points[int2].split(",")[0];
	        					if (x==lastMaxVal[thisObj]) {
	        						index=int2;
	        					}
	        				}
	        				for ( var int3 = 0; int3 <index; int3++) {
	        					var x=points[int3].split(",")[0];
	        					if (x>lastMaxVal[thisObj]) {
	        						points[int3] = lastMaxVal[thisObj] + "," + 12;
	        						line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        					}
	        				}
	        			}
	        			
//	        			initVal[i]第一个开始值 
	        			if(isClear[i]){
	        				points[0] = initVal[i] + "," + 12; 
	        				line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	        			}
	        	}

    }else if ("quXian"==lineName) {
        	if (startX>0&&endX>0) {
        		
        		quXianStartVal[thisObj]=startX;//记录开始坐标
        		quXianEndVal[thisObj]=endX;//记录结束坐标
        		
        		var x=(endX-startX)/2+startX;// 显示字体的x值
        		var banJin=obj.banJin;//半径值
        		var ixxTypeWD=obj.ixxTypeWD;//上 or  下
        		if (ixxTypeWD==1) {
        			if (line && line.getAttributeNS) {//如果线条存在
        				var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
        				points[points.length - 1] = startX + "," + startY; //往点的数据上追加一个数据
        				line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
        				var line1 = line.getAttributeNS(null, 'points').split(' ');
        				var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
        				line.setAttributeNS(null, 'points', linepoint);
        				endY=6;
        				var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
        				points2[points2.length - 1] = startX + "," + endY; //往点的数据上追加一个数据
        				line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
        				var line2 = line.getAttributeNS(null, 'points').split(' ');
        				var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
        				line.setAttributeNS(null, 'points', linepoint2);
        				endY=6;
        				var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
        				points3[points3.length - 1] = endX + "," + endY; //往点的数据上追加一个数据
        				line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
        				var line3 = line.getAttributeNS(null, 'points').split(' ');
        				var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
        				line.setAttributeNS(null, 'points', linepoint3);
        				endY=12;
        				var points4 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
        				points4[points4.length - 1] = endX + "," + endY; //往点的数据上追加一个数据
        				line.setAttributeNS(null, 'points', points4.join(' ')); //把数据设回到线上面,
        				var line4 = line.getAttributeNS(null, 'points').split(' ');
        				var linepoint4 = line.getAttributeNS(null, 'points') + " " + line4[line4.length - 1]; //在设置一个最后的点，作为下次的开始点
        				line.setAttributeNS(null, 'points', linepoint4);
        				
        				var con =container.children();//在下级元素中添加        	
        				//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
        				con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(x-15)+'" y="15" fill="red">'+banJin+'</text></svg>');
        			
        			}
					
				}else if(ixxTypeWD==0){
					if (line && line.getAttributeNS) {//如果线条存在
						var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
						points[points.length - 1] = startX + "," + 12; //往点的数据上追加一个数据
						line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
						var line1 = line.getAttributeNS(null, 'points').split(' ');
						var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
						line.setAttributeNS(null, 'points', linepoint);
						endY=6;
						var points2 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
						points2[points2.length - 1] = startX + "," + 18; //往点的数据上追加一个数据
						line.setAttributeNS(null, 'points', points2.join(' ')); //把数据设回到线上面,
						var line2 = line.getAttributeNS(null, 'points').split(' ');
						var linepoint2 = line.getAttributeNS(null, 'points') + " " + line2[line2.length - 1]; //在设置一个最后的点，作为下次的开始点
						line.setAttributeNS(null, 'points', linepoint2);
						endY=6;
						var points3 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
						points3[points3.length - 1] = endX + "," + 18; //往点的数据上追加一个数据
						line.setAttributeNS(null, 'points', points3.join(' ')); //把数据设回到线上面,
						var line3 = line.getAttributeNS(null, 'points').split(' ');
						var linepoint3 = line.getAttributeNS(null, 'points') + " " + line3[line3.length - 1]; //在设置一个最后的点，作为下次的开始点
						line.setAttributeNS(null, 'points', linepoint3);
						endY=12;
						var points4 = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
						points4[points4.length - 1] = endX + "," + 12; //往点的数据上追加一个数据
						line.setAttributeNS(null, 'points', points4.join(' ')); //把数据设回到线上面,
						var line4 = line.getAttributeNS(null, 'points').split(' ');
						var linepoint4 = line.getAttributeNS(null, 'points') + " " + line4[line4.length - 1]; //在设置一个最后的点，作为下次的开始点
						line.setAttributeNS(null, 'points', linepoint4);
						
						var con =container.children();//在下级元素中添加        	
						//con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+x+'" y="20" fill="red" transform="translate('+x+',20) rotate(90)">I</text></svg>');
						con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '"><text x="'+(x-15)+'" y="15" fill="red">'+banJin+'</text></svg>');
					
					}
				}
        	}else {
        		//画加载线
	        		if (line && line.getAttributeNS) {
//	        			var w=$("#"+obj.htmlId+" .svgquXian").width();
//	        			var i=obj.htmlId.substring(obj.htmlId.length-1,obj.htmlId.length);
	        			var wi=$("#"+obj.htmlId+" .newMoveShowHisDiv").width();
	        			var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	        			
	        			if(wi>=initVal[i]&&isClear[i]){
	        				points[points.length - 1] = wi + "," + 12; //往点的数据上追加一个数据
		        			line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
		        			var line1 = line.getAttributeNS(null, 'points').split(' ');
		        			var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
		        			line.setAttributeNS(null, 'points', linepoint);
	        			}
		        	}
        		}
        	
	        	if(quXianStartVal[thisObj]==undefined)quXianStartVal[thisObj]=0;
	    		if(quXianEndVal[thisObj]==undefined)quXianEndVal[thisObj]=0;
	    		
//	 			处理加载线画过头的情况
	    		if (line && line.getAttributeNS) {//如果线条存在  
		    		var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
		    		
		    		//对于大于开始坐标的数据 用当前开始坐标替换  
		    		var index=0;
		    		for ( var int2 = 0; int2 < points.length; int2++) {
						var x=points[int2].split(",")[0];
						if (x==quXianStartVal[thisObj]) {
							index=int2;
						}
					}
					for ( var int3 = 0; int3 <=index; int3++) {
						var x=points[int3].split(",")[0];
						if (x>quXianStartVal[thisObj]) {
							points[int3] = quXianStartVal[thisObj] + "," + 12;
							line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
						}
					}
					
					//对于小于结束坐标的数据 用当前结束坐标替换  
					for ( var int2 = 0; int2 < points.length; int2++) {
						var x=points[int2].split(",")[0];
						if (x==quXianEndVal[thisObj]) {
							index=int2;
						}
					}
					for ( var int3 = index; int3 < points.length;int3++) {
						var x=points[int3].split(",")[0];
						if (x<quXianEndVal[thisObj]) {
							points[int3] = quXianEndVal[thisObj] + "," + 12;
							line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
						}
					}
//        			initVal[i]第一个开始值 
					if(isClear[i]){
						points[0] = initVal[i] + "," + 12; 
						line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
					}
	    		}	
		}
        else if ("daoQiaoSui"==lineName) {
        	if (startX>0&&endX>0) {
	        	if(daoQiaoSuiMaxTemp[thisObj]==undefined)daoQiaoSuiMaxTemp[thisObj]=0;
	        	var falg=false;//道桥隧是否画线
		        if(startX>daoQiaoSuiMaxTemp[thisObj]){//当前开始值大于上次结束值
	        		falg=true;
	        		if(endX>=daoQiaoSuiMaxTemp[thisObj])//当前结束值 大于 上次结束值 
	        			daoQiaoSuiMaxTemp[thisObj]=endX;//记录画线结束值
	        	}else{
	        		falg=false;
	        	}
	        	if(falg){
		        	if (85==obj.ixxType) {  //画道
			        		var con =container.children();//在下级元素中添加        		
			        		con.append('<svg  biaoshi="dao" style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  points="'+startX+','+12+' '+startX+','+18+' '+endX+','+30+' '+endX+','+12+'" style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
		        	}else if (86==obj.ixxType) { //画桥
			        		var con =container.children();//在下级元素中添加        		
			        		con.append('<svg  biaoshi="qiao" style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  points="'+startX+','+18+' '+startX+','+12+' '+endX+','+12+' '+endX+','+18+'" style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
		        	}else if (87==obj.ixxType) { //画隧
			        		endX=startX+12;
			        		var con =container.children();//在下级元素中添加        		
		//	        		con.append('<svg style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  points="'+startX+','+30+' '+(startX+5)+','+25+' '+(startX+5)+','+15+' '+startX+','+10+' '+(endX+5)+','+0+' '+endX+','+10+' '+endX+','+30+' '+(endX+5)+','+40+'" style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
			        		con.append('<svg  biaoshi="suiDao" style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  points="'+startX+','+20+' '+(startX+5)+','+18+' '+(startX+5)+','+10+' '+startX+','+6+'" style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
			        		con.append('<svg  biaoshi="suiDao" style="top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  points="'+(endX+5)+','+6+' '+(endX)+','+10+' '+(endX)+','+18+' '+(endX+5)+','+20+'" style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
		        	}
	        	}
        	}
		}
        else if (line && line.getAttributeNS) {//如果线条存在
    	    var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
    		points[points.length - 1] = endX + "," + endY; //往点的数据上追加一个数据
    		line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
    		var line1 = line.getAttributeNS(null, 'points').split(' ');
    		var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
    		line.setAttributeNS(null, 'points', linepoint);
        }        
    }, //保存信号机的图片
    imgurl0bj: { "0": "NO.png", "1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" },
    getImgUrl: function (id, that) {//根据data读取读取线号机的图片
        if (that.tool.imgurl0bj[id.toString()]) {
            return "../static/img/app/moveCurve/" + that.tool.imgurl0bj[id.toString()];
        }
        else {
            return "../static/img/app/moveCurve/NO.png";
        }
    }
};