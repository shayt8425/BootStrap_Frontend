RTU.DEFINE(function (require, exports) {
/**
 * 模块名：上线率统计
 * name：onlineratecount
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/onlineratecountNew/app-onlineratecount.css");
    require("../../../css/app/app-search.css");
    var $html;
    var data;
    var popuwnd_left = null; //左侧弹出窗口
    var popuwnd_right = null; //住查询窗口

    //加载数据并初始化窗口和事件
    RTU.register("app.onlineratecount.query.loadHtml", function () {
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
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution; 
	}

    //查询窗口
    RTU.register("app.onlineratecount.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            RTU.invoke("app.onlineratecount.query.loadHtml", { url: "../app/modules/onlineratecountNew/app-onlineratecount-query.html", fn: function (html) {
//                var width = $("body").width() - 640;
//                var height = $("body").height() - 120;
            	var Resolution=getResolution();
    			var width=Resolution.Twidth;
    			var height=Resolution.Theight-80;
                if (!popuwnd_left) {
                    popuwnd_left = new PopuWnd({
                        title: data.alias,
                        html: html,
                        width: width,
                        height: height,
                        left: 0,
                        top: 55,
                        shadow: true
                    });
                    popuwnd_left.remove = popuwnd_left.close;
                    popuwnd_left.close = popuwnd_left.hidden;
                    popuwnd_left.init();
                } else {
                    popuwnd_left.init();
                }
                return popuwnd_left;
            }, initEvent: function () { //初始化事件
                RTU.invoke("app.onlineratecount.query.initBut");
            }
            });
        };
    });

  


    RTU.register("app.onlineratecount.query.init", function () {
        data = RTU.invoke("app.setting.data", "onlineratecount");
        if (data && data.isActive) {
            RTU.invoke("app.onlineratecount.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.onlineratecount.query.deactivate", function () {
        return function () {
            if (popuwnd_left) {
                popuwnd_left.hidden();
            }
            if (popuwnd_right) {
                popuwnd_right.hidden();
            }
        };
    });

 
});
