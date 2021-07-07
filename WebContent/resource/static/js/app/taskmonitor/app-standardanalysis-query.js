RTU.DEFINE(function (require, exports) {
/**
 * 模块名：设备监测-实时事件分析-query
 * name： standardanalysis
 * date:2016-03-23
 * version:1.0 
 */
    /*require("popuwnd/js/popuwnd.js");*/
        
    var $html;
	var popuwnd;
	RTU.register("app.standardanalysis.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/taskmonitor/taskmonitor.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
			}
		});
		return function() {
			return true;
		};
	});
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
	
	RTU.register("app.standardanalysis.query.activate", function() { //使得popuwnd对象活动
		return function() {
			window.open("modules/taskmonitor/taskmonitor.html");
			RTU.invoke("header.msg.hidden");
			/*
			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth;
			Theight=Resolution.Theight-60;
			if (!popuwnd) {
				popuwnd = new PopuWnd({
					title : data.alias,
					html : $html,
					width : Twitdh,
					height : Theight,
					left : 0,
					top : 60,
					shadow : true,
					removable:false,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd.remove = popuwnd.close;
				popuwnd.close = popuwnd.hidden;
				popuwnd.init();
			} else {
				popuwnd.init();
			}
		*/};
	});
	/*RTU.register("app.standardanalysis.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});*/
	
	RTU.register("app.standardanalysis.query.init", function() {
		data = RTU.invoke("app.setting.data", "standardanalysis");
		if (data && data.isActive) {
			RTU.invoke("app.standardanalysis.query.activate");  
		}		
		return function() {
			return true;
		};
	});

});
