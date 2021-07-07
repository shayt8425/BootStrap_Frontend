RTU.DEFINE(function (require, exports) {
/**
 * 模块名：TSC注册管理
 * name： locoregmanagement
 * date:2016-06-23
 * version:1.0 
 */
    /*require("popuwnd/js/popuwnd.js");*/
        
    var $html;
	var popuwnd;
	RTU.register("app.locoregmanagement.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/locoregmanagement/locoregmanagement.html",
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
	
	RTU.register("app.locoregmanagement.query.activate", function() { //使得popuwnd对象活动
		return function() {
			window.open("modules/locoregmanagement/locoregmanagement.html");
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
	/*RTU.register("app.locoregmanagement.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});*/
	
	RTU.register("app.locoregmanagement.query.init", function() {
		data = RTU.invoke("app.setting.data", "locoregmanagement");
		if (data && data.isActive) {
			RTU.invoke("app.locoregmanagement.query.activate");  
		}		
		return function() {
			return true;
		};
	});

});
