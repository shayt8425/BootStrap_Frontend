(function() {
    var scrollSetp = 226,
    operationWidth = 0,
    leftOperationWidth = 30,
    animatSpeed = 150,
    //控制tab项的显示和隐藏
    linkframe = function(url, value,icon) {
        $("#menu-list a.active").removeClass("active");
        $("#menu-list a i.active").removeClass("active");
        //alert($("a[href='" + url + "'][data-value='" + value + "']").attr("href"));
        $(".midleul a").parent().removeClass("active");
        $(".midleul a[data-value='" + value + "']").parent().addClass("active");
        $("#menu-list a[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
        $("#menu-list a[data-url='" + url + "'][data-value='" + value + "'] i").first().addClass("active");
        $("#page-content iframe.active").removeClass("active");
        $("#page-content .iframe-content[data-url='" + url + "'][data-value='" + value + "']").addClass("active");
        $("#menu-all-ul li.active").removeClass("active");
        $("#menu-all-ul li[data-url='" + url + "'][data-value='" + value + "']").addClass("active")
    },
    //
     move = function(selDom) {
        var nav = $("#menu-list");
        var menuWidth = parseInt($("#page-tab").offset().left);
        //当前标签的lift属性的值
        var releft = selDom.offset().left-menuWidth+leftOperationWidth;
        //包含按钮的显示的tab栏宽
        var wwidth = parseInt($("#page-tab").width());
        //实际的tab栏的margin-left
        var left = parseInt(nav.css("margin-left"));
        if (releft < 0 && releft <= wwidth) {
            nav.animate({
                "margin-left": (left - releft + leftOperationWidth) + "px"
            },
            animatSpeed)
        } else {
            if (releft + selDom.width() > wwidth - operationWidth) {
                nav.animate({
                    "margin-left": (left - releft + wwidth - selDom.width() - operationWidth) + "px"
                },
                animatSpeed)
            }
        }
    },
    //创建新tab项时的移动
    createmove = function() {
        var nav = $("#menu-list");
        var wwidth = parseInt($("#page-tab").width());
        var navwidth = parseInt(nav.width());
        if (wwidth - operationWidth < navwidth) {
            nav.animate({
                "margin-left": "-" + (navwidth - wwidth + operationWidth) + "px"
            },
            animatSpeed)
        }
    },
    //关闭tab项时移动
    closemenu = function() {
        $(this.parentElement).animate({
            "width": "0",
            "padding": "0"
        },
        0,
        function() {
            var jthis = $(this);
            if (jthis.hasClass("active")) {
                var linext = jthis.next();
                if (linext.length > 0) {
                    linext.click();
                    move(linext)
                } else {
                    var liprev = jthis.prev();
                    if (liprev.length > 0) {
                        liprev.click();
                        move(liprev)
                    }
                }
            }
            this.remove();
            $("#page-content .iframe-content[data-url='" + jthis.data("url") + "'][data-value='" + jthis.data("value") + "']").remove();
            $("#menu-all-ul li[data-url='" + jthis.data("url") + "'][data-value='" + jthis.data("value") + "']").remove();
        });
        event.stopPropagation()
    },
    //初始化tab栏按钮点击事件
    init = function() {
    	//左箭头点击事件
        $("#page-prev").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            if (left !== 0) {
                nav.animate({
                    "margin-left": (left + scrollSetp > 0 ? 0 : (left + scrollSetp)) + "px"
                },
                animatSpeed)
            }
        });
        //右箭头点击事件
        $("#page-next").bind("click",
        function() {
            var nav = $("#menu-list");
            var left = parseInt(nav.css("margin-left"));
            //显示的tab栏宽度
            var wwidth = parseInt($("#page-tab").width());
            //实际的tab栏宽度
            var navwidth = parseInt(nav.width());
            //还剩多宽没显示
            var allshowleft = -(navwidth - wwidth + operationWidth);
            if (allshowleft !== left && navwidth > wwidth - operationWidth) {
                var temp = (left - scrollSetp);
                nav.animate({
                    "margin-left": (temp < allshowleft ? allshowleft: temp) + "px"
                },
                animatSpeed)
            }
        });
        //展开的下拉li
        $("#page-operation").bind("click",
        function() {
            var menuall = $("#menu-all");
            if (menuall.is(":visible")) {
                menuall.hide()
            } else {
                menuall.show()
            }
        });
        $("body").bind("mousedown",
        function(event) {
            if (! (event.target.id === "menu-all" || event.target.id === "menu-all-ul" || event.target.id === "page-operation" || event.target.id === "page-operation" || event.target.parentElement.id === "menu-all-ul")) {
                $("#menu-all").hide()
            }
        })
    };
    //注册tab方法
    $.fn.tab = function(changeStyle, tabNewCallBack) {
        //初始化tab栏按钮事件
    	init();
    	//为菜单绑定点击事件实现点击添加tab项
        this.bind("click",
        function() {
        	//改变li选中样式
        	if(changeStyle != null && changeStyle != ""){changeStyle(this);}
            var linkUrl = this.href;
            var id = this.id+"-iframe";
            var linkHtml = this.innerHTML.trim();
            var icon ='icon iconfont icon-' + this.rel;
            var selDom = $("#menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']");
            if (selDom.length === 0) {
            	console.log('111');
                var iel = $("<i>", {
                    "class": "menu-close"
                }).bind("click", closemenu);
                var tu = "<i class='"+icon+"' style='font-size: 20px;float: left;margin-top: 1px;display: inline-block;padding-right: 2px;'></i>";
                $("<a>", {
                    "html": tu+linkHtml,
                    "href": "javascript:void(0);",
                    "data-url": linkUrl,
                    "data-value": linkHtml,
                }).bind("click",
                function() {
                    var jthis = $(this);
                    move($("#menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']"));
                    linkframe(jthis.data("url"), jthis.data("value"))
                }).append(iel).appendTo("#menu-list");
                $("<iframe>", {
                	"id":id,
                	"style":"height:100%",
                	"scrolling":"auto",
                    "class": "iframe-content",
                    "data-url": linkUrl,
                    "data-value": linkHtml,
                    "src": linkUrl
                }).appendTo("#page-content");
                $("<li>", {
                    "html": linkHtml,
                    "data-url": linkUrl,
                    "data-value": linkHtml
                }).bind("click",
                function() {
                    var jthis = $(this);
                    linkframe(jthis.data("url"), jthis.data("value"));
                    move($("#menu-list a[data-url='" + linkUrl + "'][data-value='" + linkHtml + "']"));
                    $("#menu-all").hide();
                    event.stopPropagation()
                }).appendTo("#menu-all-ul");
                createmove();
                
                if(tabNewCallBack&&typeof(tabNewCallBack)=='function'){
                	tabNewCallBack.call(this);
                }
            } else {
                move(selDom)
            }
            linkframe(linkUrl, linkHtml,this.rel);
            return false
        });
        return this
    }
})();