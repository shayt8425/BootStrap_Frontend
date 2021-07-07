//窗口类型的拖动 top为标题
//    $(".top").drag({parentContainDrag: $(".top").parent(), dowmCallBack: function (t) {
//        $(t).css("width",500);} });
//不是窗口类型的拖动 show 为主体
//$(".show").drag({ dowmCallBack: function (t) {
// $(t).css("width", 500);} });
; (function ($) {
    if ($) {
        $.fn.extend({ "drag": function (obj) {
            var p = $.extend({
                dowmCallBack: null, //鼠标点下后的回调，方便操作
                timeDrag: 1, //拖动跟尾延迟时间
                parentContainDrag: null//对于窗口类型的拖动，应该只有标题表示可以拖动，但实际是整个容器的拖动
            }, obj || {});
            var that = this;
            if (p.parentContainDrag) {
                that = p.parentContainDrag;
            }
            $(this).mousedown(function (e) {
                $(this).css("cursor", "move");
                var offset = $(that).offset();
                var x = e.pageX - offset.left;
                var y = e.pageY - offset.top;
                $(document).bind("mousemove.drag", function (ev) {
                    $(that).stop(); //加上这个之后  
                    var _x = ev.pageX - x; //获得X轴方向移动的值  
                    var _y = ev.pageY - y; //获得Y轴方向移动的值  
                    if (_x < 0) _x = 0;
                    if (_y < 0) _y = 0;
                    if (_x > $(window).width() - $(that).width()) _x = $(window).width() - $(that).width();
                    if (_y > $(window).height() - $(that).height()) _y = $(window).height() - $(that).height();
                    $(that).css({ left: _x + "px", top: _y + "px" });
                });
                if (p.dowmCallBack) {
                    p.dowmCallBack(that);
                }
                return;
            });
            $(document).mouseup(function () {
                $(this).css("cursor", "default");
                $(this).unbind("mousemove.drag");
            });
            return this;
        }
        });
    }
})(jQuery || null);