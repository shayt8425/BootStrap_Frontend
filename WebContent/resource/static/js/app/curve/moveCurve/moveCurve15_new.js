//处理运行曲线的函数
//请求html
MoveCurve15.countId = 0;
function MoveCurve15(obj) {
		
	    this.htmlUrl = obj.htmlUrl || "";
	    this.data = null;
	    this.itemData = obj.itemData || null;
	    this.html = "";
	    this.dataUrl = obj.dataUrl || "";
	    this.moveTimer = obj.moveTimer || 5; //5秒之后刷新
	    var that = this;
	    this.pndWin = null;
	    this.id = "htmlId" + MoveCurve15.countId++;
	    this.top = obj.top || 60;
	    /*this.left = obj.left || 290;*/
	    this.left=380;
	    this.distanceLast = 0; //上一次距离公里表的位置
	    this.setSpeedLineLastP = null; //实时速度的上一次速度
	    this.MaxSpeedLineLastP = null; //最大速度的上一次速度
	    this.scroolLeft = 0; //整体偏移量
	    this.lastDate = 0; //时间
	    this.carP = 0; //机车位置
	    this.MiddleLineLeft = 0;
	    this.xinHaoDistance = 0;
	    this.xhcount = 0;
	    this.pageXc = 0;
	    this.isMove = false; //控制移动函数
	    this.lastScroolLeft = 0;
	    this.wX = 730; // 容器的宽度 
	    this.wH = 342; //容器的高度
	    this.hrangeNum = 210; //y轴数值范围
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
	    this.loadHisDataTagTime = 0; //历史数据分量加载标记
	    this.arrSation = []; //记录站名
	    this.totalNum = 0; //历史记录总条数
	    this.DateNow = null;
	    this.isLoadCp = false; //是否加载完成
	    this.moveHisItem = []; //记录加载过的数据，用于拖动
	    this.moveItem = []; //记录加载过的数据，用于拖动（实时）
	    this.loadHisDataTag = false; //第一次加载数据的时候默认加载一些数据
	    this.isNowPlay = true; //是实时还是历史
	    this.maxSpeedValue = 180; //左边y轴
	    this.isSmallWin = true; //是否小窗口状态
	    this.playBarLength = 175; //播放调长度
	    this.guanyNumHeight = 70; //管压的部分高度
	    this.lightColorisChange = true; //记录信号机的状态是否改变
	    this.isLargerWin = true; //默认是不是大窗口 true 代表大窗口
	    this.largerBtn = null;	    
	    this.isTurnSingal = false; //是否信号机改变标志
	    this.isSingular = false; //是否出于异常状态
	    this.lastSingular = false; //上一次是否异常状态
	    this.drawStationFlag=false;//如果该值为真，则在后续数据加载中如果加载到出站信号机，则需要在画下一个信号机之前画车站
	    this.firstLimitedSpeed=0;//上两个5秒的限速
	    this.lastLimitedSpeed=0;//删一个5秒的限速，如果和firstLimitedSpeed不相同且差值超过5以上，则判断当前速度，如果该值相同，则需要在拐角处画出当前限速	    
	    this.loadHisInfoCount=100;//默认加载的历史数据
	    this.lastSignalType=0;//上一个信号机类型,如果上一个信号机是接车进路或者进站信号机,而下一个信号机是接发车进路信号机,也需要画一个车站,因为后面就不会再有出站或者发车进路信号机了
	    this.init(that);	    

	    /*this.curCurveArray=new Array();//存储需要画曲线的坐标点
*/
}
MoveCurve15.prototype.init = function (that) {
    //加载html数据
    this.html = this.loadHtml(this.htmlUrl, function (html) {//根据html路径加载html页面
        //取得html数据后初始化窗口
        var html = "<div id='" + that.id + "'>" + html + "</div>"; //外加一个标记div，用于定位
        var pwTextName = that.itemData ? "新一代LKJ运行曲线-" + that.itemData.name : "新一代LKJ运行曲线"; //窗口的标题
        that.pndWin = new PopuWnd({
            title: pwTextName,
            html: html,
            width: 775,
            height: 529,
            left: that.left,
            top: that.top,
            shadow: true
        });
        that.pndWin.init(); //初始化
        that.mCDiv = $("#" + that.id); //保存变量
        
        //that.reSetCss(); //用于变换窗口大小时候重新设置css样式
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
MoveCurve15.prototype.returnWin = function () {
    return this.pndWin;
};

//历史搜索的下拉列表
MoveCurve15.prototype.setValueToSationSelect = function(data){
    var that =this;
	Array.prototype.contains =function(obj){
		var i =this.length;
		while(i--){
			if(this[i]===obj){
			   	 return true;
			}
		}
		return false;
	};
	function doSetValue(data){
		setTimeout(function(){
			var arr= [];
			for(var i=0;i<data.length;i++){
				if(!that.arrSation.contains("<option>"+data[i].sName+"</option>")&&data[i].sName) {	
				     arr.push("<option>"+data[i].sName+"</option>");	
				     that.arrSation.push("<option>"+data[i].sName+"</option>");
				}
			}
		  $(".sAnchezhan",that.mCDiv).append(arr.join(""));
		  $(".sAnchezhan:first",that.mCDiv).attr("checked","checked");
		}, 10);
	}
	doSetValue(data);
};
//加载历史数据
MoveCurve15.prototype.loadHisData=function(tempurl,locoTypeid,locoNo){
	this.loadHisDataTagTime++;
	if(this.loadHisDataTagTime==1){
		MoveCurve15.DateTime =new Date();
		this.loadingshow();
	}
	var that =this;
	var t = this.loadHisDataTagTime;
	var URL ="../onlineloco15/searchMoveLine15ByTime?locoTypeid="+locoTypeid+"&locoNo="+locoNo+"&page="+t+"&pageSize="+500+"&beginTime=&endTime=&locoAb=&station=&1408524355637";
	if(!tempurl){
		tempurl=true;
	}
	else{
		URL ="../onlineloco15/searchMoveLine15ByTime?locoTypeid="+locoTypeid+"&locoNo="+locoNo+"&page="+t+"&pageSize="+500+"&beginTime=&endTime="+that.DateNow+"&locoAb=&station=&1408524355637";
	}
	$.ajax({
        url: URL,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
        	if (that.loadHisDataTagTime == 1) {
                if (!data || data.data.length == 0) {
                    that.showTipMsg("没有历史数据！", 3);
                    that.loadinghide();
                    return;
                }
            }
        	
              if(data&&data.data){
          		if(data.totalRecords){
        		 	that.totalNum =data.totalRecords; 
        		}
                that.DateNow = data.dateNow; 
            	if(that.loadHisDataTagTime==1){
            	 that.loadinghide();
            	  var imgbtn = $(".ff_icon_nor",that.mCDiv);
            	  imgbtn.trigger("click");
            	  imgbtn.trigger("click");
            	  imgbtn.trigger("click");
            	  imgbtn.trigger("click");
            	}
            	if(data.data&&data.data.length==0){
            		that.isLoadCp=true;
            		return;
            	}
            	that.lLoadDataResult = that.lLoadDataResult.concat(data.data);
                that.setValueToSationSelect(data.data);//历史模式下选择站的下拉框
                that.setDataToScreen(that.lLoadDataResult, that);  
                that.loadHisData(tempurl,locoTypeid,locoNo);//递归调用
              }else{
            	   that.loadHisData(tempurl,locoTypeid,locoNo);//递归调用 
              }	
        }
	});
};
//转换成历史模式
MoveCurve15.prototype.changeMoudle=function(that){
	this.isNowPlay =false;
	this.lastLimitedSpeed=0;
	this.firstLimitedSpeed=0;
	this.drawStationFlag=false;
	this.lastSignalType=0;
	//停掉计时器
	if (that.timerCount)
        clearInterval(that.timerCount);
	for(var i=0;i<that.childTimersArr.length;i++){
		if(that.childTimersArr[i]){
			clearInterval(that.childTimersArr[i]);
		}
	}
    $(".moveErrorPage",that.mCDiv).hide();
	this.clearSvg();//清空面板
	//加载历史数据
	this.moveTimer =MoveCurvertimer;
	var locoTypeid = this.locoTypeid;
   	var locoNo = this.locoNo;
   	//this.loadingshow();
   	
   	this.loadHisData(null,locoTypeid,locoNo);
   	this.setDataToScreen(that.lLoadDataResult, that);
};
//显示加载中图标
MoveCurve15.prototype.loadingshow =function(){
	$(".loadingDiv",this.mCDiv).show();
};
//隐藏加载中图标
MoveCurve15.prototype.loadinghide =function(){
	$(".loadingDiv",this.mCDiv).hide();
};
//回到历史模式
MoveCurve15.prototype.returnMoudle =function(that){

    this.isNowPlay = true;
    //停掉计时器
    if (that.timerCount)
        clearInterval(that.timerCount);
    this.clearSvg(); //清空面板
    this.moveTimer = 5;
    this.loadData(that);
};
//初始化各种事件
var MoveCurvertimer =5;
MoveCurve15.prototype.initEvent = function (tempthis) {
	//点击切换成历史播放状态
    $(".hisQueryDiv", tempthis.mCDiv).click(function (e) {
        e.stopPropagation();
        if ($(".moveHisControlR", tempthis.mCDiv).css("display")=="none") {
            //$(this).attr('src', '../static/img/app/moveCurve/ss_icon_pre.png');
            
            $(".moveHisControlR", tempthis.mCDiv).show().css({top:"528px",left:"0px"});
            /*$(".moveHisControlR .moveCountNum", tempthis.mCDiv).css({left:"0px"});*/
            

            if (tempthis.loadHisDataInterval) {
                clearInterval(tempthis.loadHisDataInterval);
            };
            tempthis.showTipMsg("已进入历史模式！", 3);
            tempthis.isMove = false;
            tempthis.changeMoudle(tempthis); //转化成历史模式

        } else {

            $(".moveHisControlR", tempthis.mCDiv).hide();

            MoveCurvertimer = tempthis.moveTimer;
            tempthis.isMove = false;
            tempthis.showTipMsg("已进入实时模式！", 3);
            tempthis.returnMoudle(tempthis);

        }
        return false;
	   });
    
    //机车信息查询按钮点击事件
    $(".machineQueryDiv",tempthis.mCDiv).click(function(){
    	if ($(".locoQueryDiv", tempthis.mCDiv).css("display")=="none"){
    		$(".locoQueryDiv", tempthis.mCDiv).show().css("z-index",9999);
    		tempthis.loadHtml("../app/modules/app-realtimeloco15motivequery-sysquery.html",function(html){
    			$(".locoQueryDiv", tempthis.mCDiv).html(html);
    			RTU.invoke("app.lkj15sysinfo.query.movercurveinit",tempthis.itemData.data);
    		});
        
    		}
    	else 
    		$(".locoQueryDiv").hide();
    	
    });
    
    //机车查询弹出窗口各个菜单项点击事件
    
    
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
   $(".moveDrawSpeed",tempthis.mCDiv).bind("mouseup.dragPoint", function (e) {
       $(thist).css("cursor", "default");
       $(document).unbind("mousemove.dragPoint");
       clicktemp = false;
       var playNum =parseInt(tempthis.totalNum * tempthis.mouseUpLastX / tempthis.playBarLength); 
       if(playNum>tempthis.lLoadDataResult.length){
    	   RTU.invoke("header.msg.show","此处数据还没有加载！");
    	   setTimeout(function(){
    			RTU.invoke("header.msg.hidden");
    	   },1500);
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
       $(".moveDragLine",tempthis.mCDiv).width(w);
   }
   var tNum = tempthis.moveTimer;
   //提速
   $(".ff_icon_nor",tempthis.mCDiv).click(function () {
       var sn = parseInt($(".moveDrawSpeedNum",tempthis.mCDiv).text());
       sn++;
       if (sn > 5) {
           sn = 5;
       }
       tempthis.moveTimer = tNum / (sn * 4);
       tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
       $(".moveDrawSpeedNum",tempthis.mCDiv).text("");
       $(".moveDrawSpeedNum",tempthis.mCDiv).text(sn);
   });
   //减速
   $(".rew_icon_nor",tempthis.mCDiv).click(function () {
       var sn = parseInt($(".moveDrawSpeedNum",tempthis.mCDiv).text());
       sn--;
       if (sn <= 1) {
           sn = 1;
       }
       if (sn == 1) {
           tempthis.moveTimer =  0.9;
       }
       else {
           tempthis.moveTimer = tNum / (sn * 4);
       }
       tempthis.setDataToScreen(tempthis.lLoadDataResult, tempthis);
       $(".moveDrawSpeedNum",tempthis.mCDiv).text("");
       $(".moveDrawSpeedNum",tempthis.mCDiv).text(sn);
   });
   //停止
   $(".stop_icon_nor",tempthis.mCDiv).click(function () {
       if (tempthis.timerCount)
           clearInterval(tempthis.timerCount);
       tempthis.clearSvg();
       $(".moveWayLabel",tempthis.mCDiv).empty();
       $(".moveDrawImgDiv",tempthis.mCDiv).css("left", 0);
       $(".moveDragLine",tempthis.mCDiv).width(0);
       tempthis.playCount = 0;
       $(".moveCountNum",tempthis.mCDiv).text(" " + tempthis.playCount + "/" + tempthis.lLoadDataResult.length);
   });
   //点击换图片
   $(".movePlayBtn",tempthis.mCDiv).click(function () {
       tempthis.defaultSet();
       $(this).attr("src", $(this).attr("tempsrc"));
       $(".pause_icon_nor",tempthis.mCDiv).attr("src", $(".pause_icon_nor",tempthis.mCDiv).attr("rsrc"));
   });
   //暂停和播放
   $(".pause_icon_nor",tempthis.mCDiv).click(function (e) {
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
   $(".curveSelectSationImg",tempthis.mCDiv).click(function(e){
	    e.stopPropagation();
   	if($(this).attr('src').indexOf('curveSearch_icon_nor')!=-1){
   		$(this).attr('src','../static/img/app/moveCurve/curveSearch_icon_pre.png');
   		 $(".selectSationDiv",tempthis.mCDiv).show();	
   	}else{
   		$(this).attr('src','../static/img/app/moveCurve/curveSearch_icon_nor.png');
   		 $(".selectSationDiv",tempthis.mCDiv).hide();	
   	}
   	return false;
   });
   $("input[type='radio']",tempthis.mCDiv).click(function(){
	   $("input[type='text']",tempthis.mCDiv).val("");
	   $("#" + tempthis.id + " input[type='text'],#"+ tempthis.id +" select").attr("disabled","disabled").addClass("selectControl");
	   $("select,input",$(this).parent().parent()).removeAttr("disabled").removeClass("selectControl");
   });
   $("input[type='radio']:first",tempthis.mCDiv).trigger("click");
   //点击搜索车站
   $(".selectSationBtn",tempthis.mCDiv).click(function(){
	   tempthis.isMove = false;
	   if(!tempthis.isLoadCp){
		   if(!confirm("数据还没有加载完全，确定要搜索吗？")){
			   return;
		   }
	   }
	   var rv=$("input[type='radio'][name='ssi']:checked",tempthis.mCDiv).val();
	   var item = tempthis.lLoadDataResult;
	   switch (rv) {
			case "0"://时间
			  var timetemp =  $(".sAnshijian",tempthis.mCDiv).val();
			  var d =new Date(timetemp);
			  for(var i=0;i<item.length;i++){
				  if(new Date(item[i].date)>d){
					  tempthis.playSearch(tempthis,i);
					  break;
				  }
			  }
				break;
			case "1"://车站
			       var stext =$(".sAnchezhan",tempthis.mCDiv).val();
			       if(!stext){
			    	   return;
			       }
			       for(var i=0;i<item.length;i++){
			       	if(item[i].sName===stext){
			     		tempthis.playSearch(tempthis,i);
			       		break;
			       	}
			       }
				break;
			case "2"://公里标

				  var signalDistanceT =  $(".sAngonglibiao",tempthis.mCDiv).val();
				   for(var i=0;i<item.length;i++){
				       	if(parseFloat(item[i].signalDistance)>(parseFloat(signalDistanceT)*1000)){
				       		tempthis.playSearch(tempthis,i);
				       		break;
				       	}
				       }
				break;
			case "3"://信号机
				  var signalNoT =  $(".sAnxinhaoji",tempthis.mCDiv).val();
				   for(var i=0;i<item.length;i++){
				       	if(parseFloat(item[i].signalNo)>parseFloat(signalNoT)){
				       		tempthis.playSearch(tempthis,i);
				       		break;
				       	}
				       }
				break;
			default:
				break;
			}
   });
   //取消按钮
   $(".selectSationCancelBtn",tempthis.mCDiv).click(function(){
	   $(".selectSationDiv",tempthis.mCDiv).hide();
	   $(".curveSelectSationImg",tempthis.mCDiv).attr('src','../static/img/app/moveCurve/curveSearch_icon_nor.png');
   });
//   $(".moveBottomShowDiv",tempthis.mCDiv).toggle(function(){
//	   $(".pause_icon_nor",tempthis.mCDiv).trigger("click");
//   },function(){
//	   $(".pause_icon_nor",tempthis.mCDiv).trigger("click");
//   });
   
   
};
//搜索之后的播放控制
MoveCurve15.prototype.playSearch=function(that,i){
	var item = that.lLoadDataResult;
	that.clearSvg();
	that.playCount =i-1;   
    if(that.playCount==-1){
    	that.playCount=0;    	
    }
    if (!that.playStatus()) {
   	 $(".pause_icon_nor",that.mCDiv).trigger("click");
    }
    that.setDataToScreen(item, that,"",true);
};
//播放状态 true为正在播放 flase 为暂停
MoveCurve15.prototype.playStatus = function () {
    if ($(".pause_icon_nor",this.mCDiv).attr("src").indexOf("pause_icon_nor") != -1) {
        //播放中 
        return true;
    } else {
        return false;
    }
};
//播放控制图标设置成默认值
MoveCurve15.prototype.defaultSet = function () {
    $(".movePlayBtn",this.mCDiv).each(function (i, item) {
        $(item).attr("src", $(item).attr("rsrc"));
    });
};
//暂停播放
MoveCurve15.prototype.pause = function (e,targetStr) {
    this.defaultSet();
    if (this.timerCount)
        clearInterval(this.timerCount);
};
//播放
MoveCurve15.prototype.play = function (e, targetStr) {
    this.defaultSet();
    this.setDataToScreen(this.lLoadDataResult, this);
};
//计算播放点的移动
MoveCurve15.prototype.controlPlayPlace = function (x) {
    var countNum = parseInt(this.totalNum * x / this.playBarLength);
    if (countNum > (this.lLoadDataResult * x / this.playBarLength)) {
        //        alert("此处数据还没有加载完成！");
        RTU.invoke("header.alarmMsg.show", "此处数据还没有加载完成！");
        return;
    }
    this.setDataToScreen(this.lLoadDataResult, this, countNum);
};
//清屏
MoveCurve15.prototype.clearSvg = function () {
    $(" svg",this.mCDiv).remove();
    $(".moveWayLabelDiv,.moveWayLabelDiv1",this.mCDiv).remove();
    $(".stationDiv1",this.mCDiv).empty();
    
};
//历史模式下面的赋值到屏幕上面
MoveCurve15.prototype.setDataToScreen = function (datat, that, countNum,jump) {
    if (countNum) {
        that.clearSvg();
        that.playCount = countNum - 1;
    }
    if(!datat||!datat.length){
		 return;		 
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
    }, that.moveTimer * 1000);
    function setDataToSByCount(data, that) {
        if (data.jkstate == "异常" || data.jkStatus == 0) {
            that.isSingular = true;
            that.setErrorData(data);
        }
        else {
            that.isSingular = false;
            $(".moveErrorPage", that.mCDiv).hide();
            that.setData(data, that);
        }
    };
    function controlmoveDrawImg(datat) {
    	that.setLineControlDraw(datat);
        if (that.playCount == datat.length) {
            that.defaultSet();
            $(".pause_icon_nor",that.mCDiv).attr("src", $("#" + that.id + " .pause_icon_nor").attr("tempsrc"));
            $(".curveHisRea",that.mCDiv).trigger("click");
        }
    }
    function recordCount() {
     // $("#" + that.id + " .moveCountNum").text(" " + that.playCount + "/" + that.lLoadDataResult.length);
        $(".moveCountNum",that.mCDiv).text(" " + that.playCount + "/" + that.totalNum);
    }
};
//异常数据赋值
MoveCurve15.prototype.setErrorData = function (data) {
    var that = this;
    $(".moveShowDiv15 .moveSpeed", that.mCDiv).text(data.speed ? data.speed : "0"); //速度
    $(".moveShowDiv15 .moveRestrictSpeed", that.mCDiv).text(data.limitSpeed); //限制最高速度
    $(".moveShowDiv15 .moveDistance", that.mCDiv).text(data.distance); //距离
    $(".moveShowDiv15 .moveSD_D", that.mCDiv).text("--"); //信号里程
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
        $(".moveShowDiv15 .moveDate", this.mCDiv).text(d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
    } else {
        $(".moveShowDiv15 .moveDate", this.mCDiv).text((d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
    }
    $(".moveShowDiv15 .moveTimeDiv", that.mCDiv).text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
    $(".moveShowEngine .turnSpeed", that.mCDiv).text("--");
    $(".moveShowEngine .guangya", that.mCDiv).text("--");
    $(".moveShowEngine .gangya", that.mCDiv).text("--");
    $(".moveShowEngine .fenggang1", that.mCDiv).text("--");
    $(".moveShowEngine .fenggang2", that.mCDiv).text("--");
    $(".moveSD_S", that.mCDiv).text("--");
    that.setLinePlace(data, true);
};
//拖动的控制条
MoveCurve15.prototype.setLineControlDraw = function (datat) {
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

var jkstateValue={
		1:"待机",
		2:"出入段",
		3:"调车",
		4:"降级",
		5:"通常",
		6:"目视",
		7:"非本务",
		8:"无防冒",
		9:"ATP"
};

var yalitype={
		1:"管压",
		2:"均风缸",
		3:"制动缸",
		4:"制动缸1",
		5:"制动缸2",
		6:"均风缸1",
		7:"均风缸2"
};

var signalTypeArray={
		1	:"接车进路",
		2	:"进站",
		3	:"接发车进路",
		4	:"发车进路",
		5	:"出站",
		6	:"通过",
		7	:"容许",
		9	:"预告",
		10	:"分割",
		8	:"接近",
		11	:"线路所通过",
		12	:"腰岔",
		40	:"信号标志牌"
};

//给界面上的字段赋值、选中样式等
MoveCurve15.prototype.initRightPar=function(data){
	 var that =this;
	 var jkstate=parseInt(data.jkstate);
	 $(".tongchang,.geli,.wuquan,.zhixian,.cexian",that.mCDiv).removeClass("left-bottom-selected-color");
	 //监控状态
	 var jkstateVal=jkstateValue[jkstate];
	 if(!jkstateVal){
		 $(".tongchang",that.mCDiv).html("");
	 }
	 else{
		 $(".tongchang",that.mCDiv).addClass("left-bottom-selected-color").html(jkstateVal);
	 }
	 
	 //隔离
	 if(data.zhidong==1){
		 $(".geli",that.mCDiv).addClass("left-bottom-selected-color");
	 }
	 
	 //dmi操作权
	 if((data.dmiright&8)!=0){
		 $(".wuquan",that.mCDiv).addClass("left-bottom-selected-color");
		 if((data.dmiright&4)!=0){
			 $(".wuquan",that.mCDiv).html("有权") ;
		 }
		 else{
			 $(".wuquan",that.mCDiv).html("II有权") ;
		 }
	 }
	 else{
		 if((data.dmiright&4)==0){
			 
			 $(".wuquan",that.mCDiv).html("无权") ;
		 }
		 else{
			 $(".wuquan",that.mCDiv).addClass("left-bottom-selected-color");
			 $(".wuquan",that.mCDiv).html("I有权") ;
		 }
	 }
	 
	 //支线、侧线
	 if(data.curr_lateral){
		 $(".zhixian",that.mCDiv).addClass("left-bottom-selected-color");
	 }
	 if(data.curr_sidetrack){
		 $(".cexian",that.mCDiv).addClass("left-bottom-selected-color");
	 }
	 
	 //压力信息
	 $(".yali1",that.mCDiv).html(yalitype[data.stresstype1]);
	 $(".yali2",that.mCDiv).html(yalitype[data.stresstype2]);
	 $(".yali3",that.mCDiv).html(yalitype[data.stresstype3]);
	 $(".yali4",that.mCDiv).html(yalitype[data.stresstype4]);
	 $(".guanya",that.mCDiv).html(data.guangya);
	 $(".zhidonggang",that.mCDiv).html(data.gangya);
	 $(".jungang1",that.mCDiv).html(data.fenggang1);
	 $(".jungang2",that.mCDiv).html(data.fenggang2);
	 
	 //工况
	 if((data.workCondition&1)!=0){
		 $(".lingwei",that.mCDiv).html("零位");
	 }
	 else{
		 $(".lingwei",that.mCDiv).html("非零");
	 }
	 
	 if((data.workCondition&2)!=0){
		 $(".xiangqian",that.mCDiv).html("向后");
	 }
	 else {
		 if((data.workCondition&4)!=0){
			 $(".xiangqian",that.mCDiv).html("向前");
		 }
		 else{
			 $(".xiangqian",that.mCDiv).html("");
		 }
	 }
	 
	 if((data.workCondition&8)!=0){
		 $(".qianyin",that.mCDiv).html("制动");
	 }
	 else {
		 if((data.workCondition&16)!=0){
			 $(".qianyin",that.mCDiv).html("牵引");
		 }
		 else{
			 $(".qianyin",that.mCDiv).html("");
		 }
	 }
	 
	 if((data.runstateflag&2)!=0){
		 $(".yali5",that.mCDiv).html("原边电流");
	 }
	 else{
		 $(".yali5",that.mCDiv).html("转速");
	 }
	 
	 $(".zhuansu",that.mCDiv).html(data.turnSpeed);
	 	 
	 /*	$(".jkstatediaoche",that.mCDiv).removeClass("moveBight");
	 $(".zhidongxiezai",that.mCDiv).removeClass("moveBight");
	 $(".zhidongchangyong",that.mCDiv).removeClass("moveBight");
	 $(".churuduan",that.mCDiv).removeClass("moveBight");
	 $(".mushixingche",that.mCDiv).removeClass("moveBight");
	 $(".feibenwu",that.mCDiv).removeClass("moveBight");
	 $(".wufangmao",that.mCDiv).removeClass("moveBight");
	 $(".qita",that.mCDiv).removeClass("moveBight");
	  if(jkstate==4){
   	  $(".jkstatejiangji",that.mCDiv).removeClass("moveBight").addClass("moveBight");
      }else{
   	  $(".jkstatejiangji",that.mCDiv).removeClass("moveBight");
   	 if(jkstate==3){
    	  $(".jkstatediaoche",that.mCDiv).removeClass("moveBight").addClass("moveBight");
    }else{
    	  $(".jkstatediaoche",that.mCDiv).removeClass("moveBight");
    	  if(jkstate==1){
        	  $(".zhidongxiezai",that.mCDiv).removeClass("moveBight").addClass("moveBight");
        }else{
        	  $(".zhidongxiezai",that.mCDiv).removeClass("moveBight");
        	  if(jkstate==5){
            	  $(".zhidongchangyong",that.mCDiv).removeClass("moveBight").addClass("moveBight");
            }else{
            	  $(".zhidongchangyong",that.mCDiv).removeClass("moveBight");
            	  if(jkstate==2){
                	  $(".churuduan",that.mCDiv).removeClass("moveBight").addClass("moveBight");
                }else{
                	  $(".churuduan",that.mCDiv).removeClass("moveBight");
                	  if(jkstate==6){
                    	  $(".mushixingche",that.mCDiv).removeClass("moveBight").addClass("moveBight");
                    }else{
                    	  $(".mushixingche",that.mCDiv).removeClass("moveBight");
                    	  if(jkstate==7){
                        	  $(".feibenwu",that.mCDiv).removeClass("moveBight").addClass("moveBight");
                        }else{
                        	  $(".feibenwu",that.mCDiv).removeClass("moveBight");
                        	  if(jkstate==8){
                            	  $(".wufangmao",that.mCDiv).removeClass("moveBight").addClass("moveBight");
                            }else{
                            	  $(".wufangmao",that.mCDiv).removeClass("moveBight");
                            	  if(jkstate==9){
                                	  $(".qita",that.mCDiv).removeClass("moveBight").addClass("moveBight");
                                }else{
                                	  $(".qita",that.mCDiv).removeClass("moveBight");
                                }
                            }
                        }
                    }
                }
            }
        }
       
    }
      
     }*/
	  
     
/*     if(data.zhidongjinji==0){
     	  $(".zhidongjinji",that.mCDiv).removeClass("moveBight");
     }else{
     	  $(".zhidongjinji",that.mCDiv).removeClass("moveBight").addClass("moveBight");
     }
       if(data.kehuo==0||data.kehuo==""){
    	   
     	  $(".kehuo",that.mCDiv).removeClass("moveBight");
     }else{
     	  $(".kehuo",that.mCDiv).removeClass("moveBight").addClass("moveBight");
     }
      if(data.locoAb==""||data.locoAb=="0"){
      	  $(".locoAb",that.mCDiv).text(" ").removeClass("moveBight");
      }else if(data.locoAb=="1"){
      	  $(".locoAb",that.mCDiv).text("A 机").removeClass("moveBight").addClass("moveBight");
      }else if(data.locoAb=="2"){
    	  $(".locoAb",that.mCDiv).text("B 机").removeClass("moveBight").addClass("moveBight");
      }*/
};
//先加载3000条数据
MoveCurve15.prototype.loadHisData3000 =function(locoTypeid,locoNo,fn){
    this.loadingshow();
    this.showTipMsg("正在加载一部分历史数据...");
    // alert(this.tool.DateTimeFormat(new Date(1416537985000),"yyyy-MM-dd hh:mm:ss"))
	var that =this;
	var URL = "../onlineloco15/searchMoveLine15ByTimeSize?locoTypeid=" + locoTypeid
	+ "&locoNo=" + locoNo + "&returnSize="+this.loadHisInfoCount+"&locoAb=&1408524355637";
	$.ajax({
        url: URL,
        dataType: "jsonp",
        type: "GET",
        success: function (data) {
	            that.loadinghide();
	            if (!data || data.data.length == 0) {
	                that.showTipMsg("没有历史数据，已切换到实时模式", 3);
	                if (fn) {
	                    fn();
	                }
	                return;
	            };
        		if(data&&data.data){
                    var d = data.data;
                    that.nowPlayData = d;
                    that.nowPlayCount = 0;
                    that.showTipMsg("正在预加载历史数据...");
                    that.loadHisDataInterval = setInterval(function () {
                    	
                        that.setData(d[that.nowPlayCount], that);
                        that.nowPlayCount++;
                        if (that.nowPlayCount >= d.length) {
                            that.showTipMsg("加载完毕，已进入实时模式！");
                            that.hideTipMsg(3);
                            clearInterval(that.loadHisDataInterval);
                            if (fn) {
                                fn();
                            }
                        };
                    }, 50);
                }
                	
        }
	});
};
//实时模式下面的加载数据
MoveCurve15.prototype.loadData = function (that) {
    function ldata() {
        var tempurl = that.dataUrl.indexOf("?") == -1 ? that.dataUrl + "?" + new Date().getTime() : that.dataUrl + "&" + new Date().getTime();
        $.ajax({
            url: tempurl,
            dataType: "jsonp",
            type: "GET",
            success: function (data) {
            	
                var tempdata = data.data[0];
                if (!tempdata || tempdata.length == 0) {
                    return;
                }
                var value=tempdata.dataVersion;
                /*var resStr=value;
                switch(value.length){
        		case 8:
        			resStr=value.substr(0,4)+"."+
     			   value.substr(4,2)+"."+value.substr(6,2);
        			break;
        		case 10: 
        			resStr=value.substr(0,4)+"."+
      			   value.substr(4,2)+"."+value.substr(6,2)+"."+value.substr(8,2);
        		break;
        		case 12:
        			resStr=value.substr(0,4)+"."+
      			   value.substr(4,2)+"."+value.substr(6,2)+"."+value.substr(8,2)+"."+value.substr(10,2);
        			break;
        			default:
        				break;
        	}*/
                $(".jkbanbenDiv","#"+that.id).html(value);
                /*if(jkbanben.length==12){
                	$(".jkbanbenDiv",that.mcDiv).html(jkbanben.substr(0,4)+"."
                			+jkbanben.substring(4,2)+"."+jkbanben.substring(6,2)+"."
                			+jkbanben.substring(8,2)+"."+jkbanben.substring(10,2));
                }
                else 
                	$(".jkbanbenDiv",that.mcDiv).html(jkbanben);*/
                //data = data.data[0];
                that.nowPlayData.push(tempdata); //实时加载的数据
                that.nowPlayCount++;
                if (tempdata.jkstate == "异常" || tempdata.jkStatus == 0) {
                    that.isSingular = true;
                    var arrdata = that.segmentation(tempdata); //拆分数据
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
                        that.setErrorData(tempdata);
                    }
                }
                else {
                    that.isSingular = false;
                    $(".moveErrorPage", that.mCDiv).hide();
                    that.initRightPar(tempdata);
                   
                              
                    var arrdata = that.segmentation(tempdata); //拆分数据
                    if (arrdata && arrdata.length > 0) {
                        var count = 0;
                        var t = setInterval(function () {
                            t.count = 0;
                            if (that.isMove == false)
                                that.setData(arrdata[count], that);
                            count++;
                            if (arrdata.length == count) {
                                clearInterval(t);
                                //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
                            	if(that.drawStationFlag){
                            		if(tempdata.signalType!=1&&tempdata.signalType!=2&&tempdata.signalType!=3){
                            			//画车站
                                		var divs = $(".moveBottomSpeed .moveWayLabelDiv", that.mCDiv);
                                		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
                                		that.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);
                                		that.drawStationFlag=false;
                            		}
                            		/*else if(tempdata.signalType!=2&&tempdata.signalType!=1
                            				&&tempdata.signalType!=this.lastSignalType&&this.lastSignalType!=3){
                            			//画车站
                                		var divs = $(".moveBottomSpeed .moveWayLabelDiv", this.mCDiv);
                                		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
                                		this.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);
                                		this.drawStationFlag=false;
                            		}else if(this.lastSignalType==3)this.drawStationFlag=false;*/
                            	}
                            	else if(tempdata.signalType==2
                            			||tempdata.signalType==3
                            			||tempdata.signalType==1){
                            		that.drawStationFlag=true;//可能下一次循环就要开始加载车站了
                            	}
                            }
                        }, 1000);
                        that.childTimersArr.push(t);
                    } else {
                        that.setData(tempdata, that);
                        //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
                        if(that.drawStationFlag){
                        	if(tempdata.signalType!=1&&tempdata.signalType!=2&&tempdata.signalType!=3){
                    			//画车站
                        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", that.mCDiv);
                        		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
                        		that.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);
                        		that.drawStationFlag=false;
                    		}
                    		/*else if(tempdata.signalType!=2&&tempdata.signalType!=1
                    				&&tempdata.signalType!=this.lastSignalType&&this.lastSignalType!=3){
                    			//画车站
                        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", this.mCDiv);
                        		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
                        		this.AddStation(tempdata, parseInt($(divs[divs.length-2]).css("left"))+left/2);
                        		this.drawStationFlag=false;
                    		}else if(this.lastSignalType==3)this.drawStationFlag=false;*/
                    	}
                    	else if(tempdata.signalType==2
                    			||tempdata.signalType==3
                    			||tempdata.signalType==1){ 
                    		that.drawStationFlag=true;//可能下一次循环就要开始加载车站了
                    	}
                    }  
                }
                that.segmentationData = tempdata;
                this.lastSignalType=tempdata.signalType;
            }
        });
    };
    if (that.loadHisDataTag == false) {
        that.loadHisData3000(that.locoTypeid, that.locoNo, function () {
            ldata();
            if (that.httpRequest) {//ajax停止
                that.httpRequest.abort();
                that.httpRequest = null;
            }
            that.timerCount = setInterval(function () {
                ldata();
            }, that.moveTimer * 1000);
        }); //预先加载100调数据
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
//分割数据 使界面更加滑动
MoveCurve15.prototype.segmentation =function(data){
    var arr = [];
    var dsp = 0; //实时速度
    var dlm = 0; //最高速度

    var dt = 0;
    if (this.segmentationData) {
        dt = parseInt((this.segmentationData.distance - data.distance) / this.moveTimer);
        if (dt < 0) {
            dt = parseInt(this.segmentationData.distance / this.moveTimer);
        }
        dsp = Math.round((this.segmentationData.speed - data.speed) / this.moveTimer);
        dlm = Math.round((this.segmentationData.limitSpeed - data.limitSpeed) / this.moveTimer);

        for (var i = 0; i < this.moveTimer; i++) {
            var tempitem = this.clone(this.segmentationData);
            tempitem.distance = tempitem.distance - dt * (i + 1);
            tempitem.speed = tempitem.speed - dsp * (i + 1);
            tempitem.limitSpeed = tempitem.limitSpeed - dlm * (i + 1);

            arr.push(tempitem);
        }
        return arr;
    }
    else {
        return arr;
    }
};
//设置信号灯
MoveCurve15.prototype.changeSignColor = function (data) {
    var tempImg = this.tool.imgurl0bj[data.locoSignal.toString()];
    var srcimg = tempImg ? tempImg : "WU.png";
    var arr = $(".moveSatus15 img", this.mCDiv).attr("src").split("/");
    arr[0] = "/";
    if (arr[arr.length - 1] != srcimg) {//改变
        this.lightColorisChange = true;
        if (this.lastSignalId == ($.trim(data.signal_header)+(data.signalNo?data.signalNo:""))) {//没有新的信号机来
            this.upDatesignalImg(data); //就更新最后一个信号机
        }
        $(".moveSatus15 img", this.mCDiv).attr("src", this.tool.getImgUrl(data.locoSignal, this));
    }
    else {
        this.lightColorisChange = false;
    }
};
//前方信号机的灯发生改变的时候彩带和最后一个信号机的灯也跟着变化
MoveCurve15.prototype.upDatesignalImg=function(data){
    var m = $("#" + this.id + " .moveWayLabelDiv:last");
    
    var imgs = this.getSignalImg(data) ; //
    $("img:last", m).attr("src", "../static/img/app/moveCurve/" + imgs);
/*    if (imgLength == 2) {
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
    };*/
    var cw = 0;
    var img = this.tool.imgurl0bj[data.locoSignal.toString()];
    var srcimg = img ? img : "WU.png";

};
MoveCurve15.prototype.justSetData=function(data,that){
    if (data) {
        $(" .moveSD_S", this.mCDiv).text(data.signalName);
        $(" .moveSD_S1", this.mCDiv).text($.trim(data.signal_header)+(data.signalNo?data.signalNo:""));
        $(".moveShowDiv15 .moveSpeed", this.mCDiv).text(data.speed); //速度
        $(".moveShowDiv15 .moveRestrictSpeed", this.mCDiv).text(data.limitSpeed); //限制最高速度
        $(".moveShowDiv15 .moveDistance", this.mCDiv).text(data.distance); //距离
        $(".moveShowDiv15 .moveSD_D", this.mCDiv).text(data.signalDistance / 1000); //信号里程
        var d = new Date(data.date);
        if (that.isLargerWin) {
            $(".moveShowDiv15 .moveDate", this.mCDiv).text(d.getFullYear() + "年" + (d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
        } else {
            $(".moveShowDiv15 .moveDate", this.mCDiv).text((d.getMonth() + 1) + "月" + d.getDate() + "日"); //速度
        }

        $(".moveShowDiv15 .moveTimeDiv", this.mCDiv).text((d.getHours().toString().length < 2 ? ("0" + d.getHours().toString()) : d.getHours()) + ":" + (d.getMinutes().toString().length < 2 ? ("0" + d.getMinutes().toString()) : d.getMinutes()) + ":" + (d.getSeconds().toString().length < 2 ? ("0" + d.getSeconds().toString()) : d.getSeconds())); //速度
/*        $(".moveShowEngine .turnSpeed", this.mCDiv).text(data.turnSpeed);
        $(".moveShowEngine .guangya", this.mCDiv).text(data.guangya);
        $(".moveShowEngine .gangya", this.mCDiv).text(data.gangya);
        $(".moveShowEngine .fenggang1", this.mCDiv).text(data.fenggang1);
        $(".moveShowEngine .fenggang2", this.mCDiv).text(data.fenggang2);
*/
        that.changeSignColor(data); //信号机的控制
        that.initRightPar(data); //右边的状态表
        that.setMaxSpeedValue(data,that); //y轴数值的控制
    }
};
//根据数据设置坐标y的的数值
MoveCurve15.prototype.setMaxSpeedValue =function(data,curveObj){
	if(!data) return;
	if("301,302,305,306".indexOf(curveObj.locoTypeid)!=-1){
		var ei=0;
		switch(data.speedLevel){
			case 200:
				ei=30;
				this.hrangeNum=210;
				break;
			case 250:
				ei=40;
				this.hrangeNum=280;
				break;
			default:
				ei=50;
				this.hrangeNum=350;
				break;
		}
		$(".moveSpeedNum .moveSN_N","#"+curveObj.id).each(function(i,item){
			 $(item).text(ei*(6-i));
		});
	}
	else{
		if(data.speedLevel>120&&curveObj.maxSpeedValue==120){
			this.maxSpeedValue=180;
			var ei = 30;
			$(".moveSpeedNum .moveSN_N","#"+curveObj.id).each(function(i,item){
				 $(item).text(ei*(6-i));
			});
			this.hrangeNum=210;
		}
		else if(data.speedLevel<160&&curveObj.maxSpeedValue==180){

			this.maxSpeedValue=120;
			var ei = 20;
			$(".moveSpeedNum .moveSN_N","#"+curveObj.id).each(function(i,item){
				 $(item).text(ei*(6-i));
			});
			this.hrangeNum=140;
		}
		else{//speedLevel有问题,则默认120
			this.maxSpeedValue=120;
			var ei = 20;
			$(".moveSpeedNum .moveSN_N","#"+curveObj.id).each(function(i,item){
				 $(item).text(ei*(6-i));
			});
			this.hrangeNum=140;
		}
	}
};
//赋值数据划线
MoveCurve15.prototype.setData = function (data, that) {
	if(!this.isMove){
	    this.justSetData(data,that);	
	}
    //根据数值初始化各条线的位置
    that.setLinePlace(data,null);
};
//判断是拖动还是实时更新
MoveCurve15.prototype.isMoveFn =function(sl){
    var totalWidth = $(".moveBottomSpeed",this.mCDiv).width();
    var addWidth = totalWidth -this.wX;
    var rangeWidth = addWidth -110;
    if(rangeWidth>sl){//实时
    	this.isMove = true;     
    }
    else{//在拖动
    
    	this.isMove = false; 
    	//this.moveSetData(sl);//数据赋值
    }
};
//拖动时候的数据显示
MoveCurve15.prototype.moveSetData =function(sl){
	var that =this;
	if(this.moveHisItem.length>0){
		setTimeout(function(){
			for(var i=that.moveHisItem.length-1;i>0;i--){
				 if(sl==parseInt(that.moveHisItem[i].distance)){
					 that.justSetData(that.lLoadDataResult[that.moveHisItem[i].playCount],that);
					 break;
				 }
			 }	
		},1);
	}
}; 
//拖动时候的数据显示(实时候的时候)
MoveCurve15.prototype.moveNowPlaySetData = function (sl) {
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
MoveCurve15.prototype.drawMiddleLine = function (that) {
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
MoveCurve15.prototype.setLinePlace = function (data, isError) {
    //设置实时速度线
    this.setLine(data, isError);
};

/*重要方法*///画线
MoveCurve15.prototype.setLine = function (data, isError) {
    this.xhcount++;
    //根据速度转化成坐标
    if (!data.speed) {
        data.speed = 0;
    };
    var sp = data.speed; //实时速度
    var lm = data.limitSpeed; //最高速度
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
        this.lastSignalId =$.trim(data.signal_header)+(data.signalNo?data.signalNo:"");
        this.AddSignal(data, this.MiddleLineLeft);
        this.distanceLast = data.distance;
        this.lastDate = data.date;
        this.lastSingular = this.isSingular; //上一次是否异常状态
    }
    else { //否则根据上一次的点 和这次的点画线
        //已知 界面的总长度是5公里左右
        //这次5秒更新所走的距离
        // this.distanceLast =data.distance;
        var newD = Math.abs(data.distance - this.distanceLast);
        if ((data.distance - this.distanceLast) > 0 || this.lastSignalId != ($.trim(data.signal_header)+(data.signalNo?data.signalNo:""))) {
            this.isTurnSingal = true;
            newD = Math.abs(this.distanceLast);
        }
        else {
            this.isTurnSingal = false;
        }
        if (this.isSingular || this.lastSingular) {
            if (this.lastDate) {
                var ddate = data.date - this.lastDate;
                newD = ddate / 3600000 * data.speed * 1000;
            }
        };
        if (!newD) newD = 0;
        //计算这个距离在座标上面的距离
        var newW = newD * this.wX / 5000;
        var nx = this.setSpeedLineLastP[0] + newW;
        var nyp = this.wH - (this.wH / this.hrangeNum) * sp;
        var nyl = this.wH - (this.wH / this.hrangeNum) * lm;

        if (isError) {//不正常情况先只画两条线条
            //画实速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0], startY: this.setSpeedLineLastP[1], endX: nx, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
            //画限速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
        }
        else {
            //画实速线
            this.tool.drawSvgLine({ htmlId: this.id, color: 'green', lineName: "lineGreen", startX: this.setSpeedLineLastP[0], startY: this.setSpeedLineLastP[1], endX: nx, endY: nyp, containerId: $("#" + this.id + " .moveBottomSpeed") });
            
            if(this.lastLimitedSpeed>data.limitSpeed&&(data.limitspeedlength&16384)!=0){
            	  this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
/*                if(data.limitSpeed!=0)
                    this.tool.drawText({text:data.limitSpeed, htmlId: this.id, color: '#f3ae00', x:nx
    	                ,y:nyl });*/
            	
                /*if(this.curCurveArray.length==0){
                	this.curCurveArray.push({ htmlId: this.id, color: 'red', lineName: "curveRed", 
                		x: this.MaxSpeedLineLastP[0], y: this.MaxSpeedLineLastP[1]
                		, containerId: $("#" + this.id + " .moveBottomSpeed") });
                }
                this.curCurveArray.push({x: nx, y: nyl});*/
            }
            else{
            	if(data.limitSpeed!=this.lastLimitedSpeed){    
                    this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], 
                    	startY: this.MaxSpeedLineLastP[1], endX: nx, endY: this.MaxSpeedLineLastP[1], containerId: $("#" + this.id + " .moveBottomSpeed") });
                    this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: nx, 
                    	startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
                    if(data.limitSpeed>this.lastLimitedSpeed){
                    	if((data.limitSpeed-this.lastLimitedSpeed>=10))
                    		{
                    		this.tool.drawText({text:data.limitSpeed, htmlId: this.id, color: '#f3ae00', x:nx
    	    	                ,y:nyl });
                    		}
                    	if(this.lastLimitedSpeed<this.firstLimitedSpeed
                    			&&(this.firstLimitedSpeed-this.lastLimitedSpeed)>=10
                    			&&this.lastLimitedSpeed!=0){
                    		//曲线先往下 再横着 再往上
                    		this.tool.drawText({text:this.lastLimitedSpeed, htmlId: this.id, color: '#f3ae00', x:this.MaxSpeedLineLastP[0]
    	    	                ,y:this.MaxSpeedLineLastP[1] });
                    	}
                    }
                    
                }
                else if(data.limitSpeed==this.lastLimitedSpeed){
                	//画限速线
                    this.tool.drawSvgLine({ htmlId: this.id, color: 'red', lineName: "lineRed", startX: this.MaxSpeedLineLastP[0], 
                    	startY: this.MaxSpeedLineLastP[1], endX: nx, endY: nyl, containerId: $("#" + this.id + " .moveBottomSpeed") });
                    
                    if(this.lastLimitedSpeed<this.firstLimitedSpeed
                    		&&(this.firstLimitedSpeed-this.lastLimitedSpeed)>=10
                    		&&this.lastLimitedSpeed!=0){
                		this.tool.drawText({text:data.limitSpeed, htmlId: this.id, color: '#f3ae00', x:this.MaxSpeedLineLastP[0]
	    	                ,y:this.MaxSpeedLineLastP[1] });
                	}
                }
            	
            	/*if((data.limitspeedlength&16384)!=0&&this.curCurveArray.length>0){
                	this.tool.drawCurve(this.curCurveArray);
                	this.curCurveArray=new Array();
                }*/
            }          
            
            var tempLimitedSpeed=this.lastLimitedSpeed;
            
            this.firstLimitedSpeed=tempLimitedSpeed;

            this.lastLimitedSpeed=data.limitSpeed;

            
        }
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
        this.tool.setLeft("#" + this.id + " .moveMiddleLine", this.MiddleLineLeft);
        //移动机车位置
        this.moveCar(newW);
        //容器长度加nx然后整体往左移动nx
        $(".moveBottomSpeed", this.mCDiv).css("width", this.tool.getWidth("#" + this.id + " .moveBottomSpeed") + newW);
        //出信号点 
        if (this.lastSignalId != ($.trim(data.signal_header)+(data.signalNo?data.signalNo:"")) && !isError && !this.isSingular) {
            this.AddSignal(data, this.MiddleLineLeft);
            this.lastSignalId = $.trim(data.signal_header)+(data.signalNo?data.signalNo:"");
        }
      //先判断是否已经画了进站信号机，再根据当前这一条是否是出站信号机来判断是否需要画车站
        if(this.drawStationFlag){
        	if(data.signalType!=1&&data.signalType!=2&&data.signalType!=3){
    			//画车站
        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", this.mCDiv);
        		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
        		this.AddStation(data, parseInt($(divs[divs.length-2]).css("left"))+left/2);
        		this.drawStationFlag=false;
    		}
    		/*else if(data.signalType!=2&&data.signalType!=1
    				&&data.signalType!=this.lastSignalType&&this.lastSignalType!=3){
    			//画车站
        		var divs = $(".moveBottomSpeed .moveWayLabelDiv", this.mCDiv);
        		var left=parseInt($(divs[divs.length-1]).css("left"))-parseInt($(divs[divs.length-2]).css("left"));
        		this.AddStation(data, parseInt($(divs[divs.length-2]).css("left"))+left/2);
        		this.drawStationFlag=false;
    		} else if(this.lastSignalType==3)this.drawStationFlag=false;*/
    	}
    	else if(data.signalType==2
    			||data.signalType==3
    			||data.signalType==1){
    		this.drawStationFlag=true;//可能下一次循环就要开始加载车站了
    	}
        this.lastSignalType=data.signalType;
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
        this.setLastArr({ nx: nx, nyp: nyp, nyl: nyl, lastDate: data.date, lastSingular: this.isSingular });
        this.distanceLast = data.distance;
    }
};

var signalImgUrlObj={ "1": "xhjPoint_green3.png", "2": "xhjPoint_green2.png", 
		"3": "xhjPoint_green.png","4": "xhjPoint_greenyellow.png","5": "xhjPoint_greenyellow2.png","6": "xhjPoint_yellow.png",
		"7": "xhjPoint_yellow2s.gif","8": "xhjPoint_yellow2.png","9":"xhjPoint_green6.png","10": "xhjPoint_yellowyellow2.gif",
		"11": "xhjPoint_yellowyellow.png", "12": "xhjPoint_redyellows.gif","13": "xhjPoint_redyellow.png"
			,"14": "xhjPoint_red.png","15": "xhjPoint_green4.png",
		"16": "xhjPoint_green5.png","17":"xhjPoint_white.png","18":"xhjPoint_white.png","19": "xhjPoint_black.png"
			,"20": "xhjPoint_white.png","21":"xhjPoint_yellow3.png","32": "xhjPoint_blue.png" }; 

//获取信号机的图片
MoveCurve15.prototype.getSignalImg =function(data){

	for(var item in signalImgUrlObj){
			if(item==data.locoSignal)return signalImgUrlObj[item];
		
	}
	return "xhjPoint_wu.png" ;
/*	 var imgs=["xhjPoint_wu.png"];
	 switch (data.locoSignal) {

	case 1:
		imgs=["xhjPoint_green.png","xhjPoint_green.png"];
		break;
	case 16:
		imgs=["xhjPoint_green.png","xhjPoint_green.png"];
		break;
	case 15:
		
	case 9:
		imgs=["xhjPoint_green.png","xhjPoint_green.png"];
		break;
	case 3:
		 imgs=["xhjPoint_green.png"];
			break;
	case 4:
	case 5:
		 imgs=["xhjPoint_green.png","xhjPoint_yellow.png"];
		break;
	case 6:
		 imgs=["xhjPoint_yellow.png"];
		break;
	case 7:
	case 8:
	case 10:
	case 11:
		case 21:
		 imgs=["xhjPoint_yellow.png","xhjPoint_yellow.png"];
		break;
	case 12:
	case 13:
		 imgs=["xhjPoint_red.png","xhjPoint_red.png"];
		break;
	case 14:
		 imgs=["xhjPoint_red.png"];
		break;
	case 17:
	case 18:
	case 20:
		 imgs=["xhjPoint_white.png"];
		break;
	case 19:
		 imgs=["xhjPoint_black.png"];
		break;
	case 32:
		 imgs=["xhjPoint_blue.png"];
		break;
	default:
		break;
	}	
	return imgs;*/
}; 

//添加车站
MoveCurve15.prototype.AddStation = function (data, newSL) {
/*    var newXd = data.distance * this.wX / 5000;
    //计算这个距离在座标上面的距离
    var newxinhaoleft = newSL + newXd;*/

    var	newXP= $("<div class='moveWayLabelDiv1' style='height:250px'><div class='moveC'><img style='left:-10px' src='../static/img/app/moveCurve/NO.png' alt='' />" +
    		"</div><div class='signalNum' style='left:-200px;text-align:right;width:200px;color:#00BFF3'>" + (data.sname?data.sname:data.stationTmis) + "</div></div>")
	.css("left", newSL+"px").attr("id", "stationId" + data.stationTmis);
    $(".moveBottomSpeed",this.mCDiv).append(newXP);
}; 

//添加信号机
MoveCurve15.prototype.AddSignal = function (data, newSL) {
    var newXd = data.distance * this.wX / 5000;
    //计算这个距离在座标上面的距离
    var newxinhaoleft = newSL + newXd;
    //$(".moveWayLabelDiv .moveC").removeClass("movePGreen").addClass("movePGray");
    var colorImgArr =this.getSignalImg(data);
    var newXP =null;
/*    if(colorImgArr.length==1){
    	newXP= $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/"+colorImgArr
    	+"' alt='' /></div><div class='signalNum'>" + $.trim(data.signal_header)+(data.signalNo?data.signalNo:"") + "</div></div>")
    	.addClass("movePGreen").css("left", newxinhaoleft).attr("id", "xhid" + data.signalId);
    }
    else{
    	newXP= $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/"
    			+colorImgArr[0]+"' alt='' /><img style='top:12px;' src='../static/img/app/moveCurve/"
    			+colorImgArr[1]+"' alt='' /></div><div class='signalNum'>" + $.trim(data.signal_header)+(data.signalNo?data.signalNo:"")
    			+ "</div></div>").addClass("movePGreen").css("left", newxinhaoleft).attr("id", "xhid" 
    					+ data.signalId);
    }*/
    newXP= $("<div class='moveWayLabelDiv'><div class='moveC'><img src='../static/img/app/moveCurve/"+colorImgArr
        	+"' alt='' /></div><div class='signalNum'>" + $.trim(data.signal_header)+(data.signalNo?data.signalNo:"") + "</div></div>")
        	.addClass("movePGreen").css("left", newxinhaoleft).attr("id", "xhid" + data.signalId);
    $(".moveBottomSpeed",this.mCDiv).append(newXP);
};
//移动机车
MoveCurve15.prototype.moveCar = function (newW) {
    this.carP += newW;
    this.tool.setLeft("#" + this.id + " .currentTrain", this.carP);
};
//给记录数组赋值
MoveCurve15.prototype.setLastArr = function (data) {
    this.setSpeedLineLastP = [data.nx, data.nyp];
    this.MaxSpeedLineLastP = [data.nx, data.nyl];

    this.lastDate = data.lastDate;
    this.lastSingular = data.lastSingular;
};
MoveCurve15.prototype.jumpDistance =function(num){
    if (!this.setSpeedLineLastP) {
        this.setSpeedLineLastP = [];
        this.MaxSpeedLineLastP = [];

        this.setSpeedLineLastP[0] = num;
        this.MaxSpeedLineLastP[0] = num;

        return;
    };
    this.setSpeedLineLastP[0] += num;
    this.MaxSpeedLineLastP[0] += num;


};
//移动
MoveCurve15.prototype.move = function (newW,data) {
    this.scroolLeft += newW;
    $(".moveBottomContainDiv",this.mCDiv).scrollLeft(this.scroolLeft);
};
MoveCurve15.prototype.loadHtml = function (url, fncb) {
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
MoveCurve15.prototype.showTipMsg = function (msg, time) {

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
MoveCurve15.prototype.hideTipMsg = function (t) {
    if (t) {
        setTimeout(function () {
            $(".loadMsg", this.mCDiv).hide();
        }, t * 1000);
    } else {
        $(".loadMsg", this.mCDiv).hide();
    };

};
//克隆对象
MoveCurve15.prototype.clone = function (Obj) {
    if (typeof (Obj) != 'object') return Obj;
    if (Obj == null) return Obj;
    var myNewObj = new Object();
    for (var i in Obj)
        myNewObj[i] = Obj[i];
    return myNewObj;
};
//工具类
MoveCurve15.prototype.tool = {
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
	    //画文字
	    drawText:function(obj){
    		/*$('#'+obj.htmlId+' .svglineRed').prepend("<text x='0' y='0' text-anchor='middle' fill='#f3ae00'>" +
    				"<tspan dx='"+obj.x+"' dy='"+(obj.y-5)+"' font-weight='bold'>"+obj.text+"</tspan></text>");*/
    		
    		$(".moveBottomSpeed",this.mCDiv).append('<div class="stationDiv1" style="left:'+(obj.x-10)+'px;top:'+(obj.y-20)+'px">'+obj.text+'</div>');

	    },
	    //画平滑曲线
	    drawCurve:function(obj){
	    	var pointStr="";
	    	for(var i=1;i<obj.length;i++){
	    		if(i==obj.length-1)
	    			pointStr +=obj[i].x+","+obj[i].y;
	    		else
	    			pointStr +=obj[i].x+","+obj[i].y+",";
	    	}
	    	var svgStr='<svg style="position: absolute;top:0px;left:0px;width:'+obj[0].containerId.width()+'px;height:'+obj[0].containerId.height()+'px" class="svg' + obj[0].lineName
	    	+ '" ><path d="M' + obj[0].x + ',' + obj[0].y + ' Q'+pointStr+'" style="stroke:' + 
	    	obj[0].color + ';stroke-width:1; fill:none"></path></svg>';
	    	obj[0].containerId.append($(svgStr));
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
	            container.append('<svg style="position: absolute;top:0px;left:0px;" class="svg' + lineName + '" ><g><polyline  class="' + lineId + '"   points=' + startX + ',' + startY + ' ' + startX + ',' + startY + '"  style="stroke:' + color + ';stroke-width:1; fill:none"></polyline></g></svg>');
	        }
	        $(svgId).attr({ "width": obj.containerId.width(), "height": obj.containerId.height() }); //设置svg容器的宽度
	        var line = $(svgId + " ." + lineId)[0]; //读取当前的线条
	        if (line && line.getAttributeNS) {//如果线条存在
	            var points = line.getAttributeNS(null, 'points').split(' '); //读取线条上面的数据
	            points[points.length - 1] = endX + "," + endY; //往点的数据上追加一个数据
	            line.setAttributeNS(null, 'points', points.join(' ')); //把数据设回到线上面,
	            var line1 = line.getAttributeNS(null, 'points').split(' ');
	            var linepoint = line.getAttributeNS(null, 'points') + " " + line1[line1.length - 1]; //在设置一个最后的点，作为下次的开始点
	            line.setAttributeNS(null, 'points', linepoint);
	        }
	    }, //保存信号机的图片
	    imgurl0bj:  { "1": "L3.png", "2": "L2.png", 
    		"3": "L.png","4": "LU.png","5": "LU2.png","6": "U.png",
    		"7": "U2S.gif","8": "U2.png","9":"L6.png","10": "UUS.gif", "11": "UU.png", 
    		"12": "HUS.gif","13": "HU.png","14": "H.png","15": "L4.png",
    		"16": "L5.png","17":"B.png","18":"B.png","19": "NO.png","20": "B.png","21":"U3.png","32": "Blue.png" },
		getImgUrl: function (id, that) {//根据data读取读取线号机的图片
	        if (that.tool.imgurl0bj[id.toString()]) {
	            return "../static/img/app/moveCurve/" + that.tool.imgurl0bj[id.toString()];
	        }
	        else {
	            return "../static/img/app/moveCurve/WU.png";
	        }
	    }
};