RTU.DEFINE(function (require, exports) {
/**
 * 模块名：单独的加载图标
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    RTU.register("app.query.loading", function () {
        var tableloading = function (object, isShow) {
            if (isShow) {
                var loadingdiv = object.siblings("div.div_loading");
                if ((!loadingdiv)
												|| loadingdiv.length == 0) {
                    var fatherdiv = object.parent();
                    if (fatherdiv)
                        fatherdiv.append("<div class = 'div_loading'><div class='tab_loading'><img src='../static/img/app/loading.gif' /></div></div>");
                } else {
                    loadingdiv.removeClass("hidden");
                }
            } else {
                var loadingdiv = object.siblings("div.div_loading");
                loadingdiv.addClass("hidden");
            }
        };
        return function (item) {
            tableloading(item.object, item.isShow);
        };
    });
});