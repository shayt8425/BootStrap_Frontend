RTU.DEFINE(function (require, exports) {
/**
 * 模块名：列车跟踪--曲线
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    require("draw/draw.js");
    require("../../../css/app/app-query-move.css");

    var car;
    var rMax;
    var rMin;
    var sMax;
    var sMin;
    RTU.register("app.realtimelocomotivequery.move.init", function () {
        function initData(HtmlId) {
        };
        function initDrawLine(HtmlId) {
        };
        return function (obj) {
            initData(obj.HtmlId);
            initDrawLine(obj.HtmlId);
            return true;
        };
    });
    RTU.register("app.realtimelocomotivequery.move.activate", function () {
        var getspeed = function () {
            return { min: 0, max: 100 };
        }
        return function () {
            var speedRef = getspeed;
        };
    });
    RTU.register("app.realtimelocomotivequery.move.deactivate", function () {
        return function () {

        };
    });
    RTU.register("app.realtimelocomotivequery.move.getXY", function () {
        var get = function (cur, max, min, to) {
            return value = (cur - min) * to / max;
        }
        return function () {
            var carxy = new Array();
            var to = $(".center_back_div_1").height();
            var to2 = ($(".center_back_div_1").width() - 40) / 2;
            for (var i = 0; i < car.length; i++) {
                carxy[i] = {
                    y: to - get(car[i].speed, sMax, sMin, to),
                    x: get(car[i].r, rMax, rMin, to2)
                }
            }
            return carxy;
        };
    });
});
