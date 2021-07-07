RTU.DEFINE(function (require, exports) {
/**
 * 模块名：二维区间图
 * name：two-dimensionintervalmap
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");

    var $html;
    var popuwnd;
    var data;

    RTU.register("app.two-dimensionintervalmap.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/two-dimensionintervalmap/app-two-dimensionintervalmap-query.html",
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
    RTU.register("app.two-dimensionintervalmap.query.activate", function () {
        return function () {
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: width > ($("body").width() - 100) ? width : ($("body").width() - 100),
                    height: height > 650 ? height : 650,
                    left: 115,
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
    RTU.register("app.two-dimensionintervalmap.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    RTU.register("app.two-dimensionintervalmap.query.init", function () {
        data = RTU.invoke("app.setting.data", "two-dimensionintervalmap");
        if (data && data.isActive) {
            RTU.invoke("app.two-dimensionintervalmap.query.activate");
        }
        return function () {
            return true;
        };
    });

});
