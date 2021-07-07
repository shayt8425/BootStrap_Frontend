RTU.DEFINE(function (require, exports) {
/**
 * 模块名：机车在线里程统计
 * name：locomotiveonlinemileagecount
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../../../css/app/app-faultalarmsubsidiary.css");

    var $html;
    var popuwnd;
    var data;

    RTU.register("app.locomotiveonlinemileagecount.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/locomotiveonlinemileagecount/app-locomotiveonlinemileagecount-query.html",
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
    RTU.register("app.locomotiveonlinemileagecount.query.activate", function () {
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
    RTU.register("app.locomotiveonlinemileagecount.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    RTU.register("app.locomotiveonlinemileagecount.query.init", function () {
        data = RTU.invoke("app.setting.data", "locomotiveonlinemileagecount");
        if (data && data.isActive) {
            RTU.invoke("app.locomotiveonlinemileagecount.query.activate");
        }
        return function () {
            return true;
        };
    });
});
