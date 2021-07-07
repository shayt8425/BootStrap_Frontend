RTU.DEFINE(function (require, exports) {
/**
 * 模块名：工务巡线调度指挥
 * name：publicservicelinepatroldispatchcommand
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");

    var $html;
    var popuwnd;
    var data;

    RTU.register("app.publicservicelinepatroldispatchcommand.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/publicservicelinepatroldispatchcommand/app-publicservicelinepatroldispatchcommand-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                }
            }
        });
        return function () {
            return true;
        };
    });
    
    RTU.register("app.publicservicelinepatroldispatchcommand.query.activate", function () {
        return function () {
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: width > ($("body").width() - 100) ? width : ($("body").width() - 100),
                    height: height > 650 ? height : 650,
                    left: 135,
                    top: 60,
                    shadow: true,
                    removable: false,  //设置弹出窗口是否可拖动
                    deletable: false	  //设置是否显示弹出窗口的关闭按钮
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
            } else {
                popuwnd.init();
            }
        };
    });
    
    RTU.register("app.publicservicelinepatroldispatchcommand.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    
    RTU.register("app.publicservicelinepatroldispatchcommand.query.init", function () {
        data = RTU.invoke("app.setting.data", "publicservicelinepatroldispatchcommand");
        if (data && data.isActive) {
            RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate");
        }
        return function () {
            return true;
        };
    });

});
