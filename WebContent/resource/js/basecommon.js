/**
*	框架核心js代码
*	Gavin 20141028
*/
//整个系统框架的全局变量，分别存放了：页面宽度，页面高度，左边菜单宽度，左边菜单高度，右边内容页宽度，右边内容页高度
var base_w_h_array = new Array();
$(function(){ 
	//初始化框架大小
	base_w_h_array = base_resize(52,210);	//默认框架，头部高52px;左边宽210px;右边自动算出来
	//窗口变化时调整框架大小
	$(window).resize(function(){
		base_w_h_array = base_resize(52,base_w_h_array[2]);	//默认框架，头部高52px;左边宽当前左边宽度;右边自动算出来
	});
	//菜单折叠js
	//二级菜单单击效果
	$("#base-left-ul div").on("click",function(){
		if(!$(this).hasClass("base-second-menu-current") && !$(this).hasClass("base-short-menu")){
			$("#base-left-ul").find("div").removeClass("base-second-menu-current");
			$("#base-left-ul").find("ul li").removeClass("base-third-menu-current");
			$("#base-left-ul").find("ul").hide("500");
			$(this).addClass("base-second-menu-current")
				   .next("ul").show("500");
		} else if($(this).hasClass("base-short-menu")){	//当处于短菜单时，需要弹出菜单框, .base-short-menu此class是个短菜单标志，在长短单切换到短菜单时加上的。fun:baseChangeFrame
			$("#base-left-ul-cache").hide();//隐藏弹出的三级菜单
			if($(this).next("ul").length != 0){
				//计算出点击菜单的上边距和左边距
				var menu_top = $(this).position().top-2;
				var menu_left = $(this).position().left+$(this).width()+10; 
				$("#base-left-ul-cache").css({"left":menu_left+"px","top":menu_top+"px"})
				$("#base-left-ul-cache").html($(this).parent().html()).show();
				$("#base-left-ul-cache").find("ul").show(500);
				var ul_width = $("#base-left-ul-cache").width();
				$("#base-left-ul-cache").find("div").css("width",ul_width+"px");
				$("#base-left-ul-cache").find(".base-second-menu-name").show(500);
			}
		}
		menu_second_click($(this));
	})
	//三级菜单单击效果，以及弹出菜单的点击
	$("#base-left-ul ul,#base-left-ul-cache").on("click","li",function(){
		if(!$(this).hasClass("base-third-menu-current")){
			$(this).parent().find("li").removeClass("base-third-menu-current");
			$(this).addClass("base-third-menu-current");
		}
		menu_third_click($(this));
		$("#base-left-ul-cache").hide();	//隐藏弹出的菜单
	})
	//标签页的关闭按钮单击事件
	$("#base-tabs-ul").on("click",".colse-tab-btn",function(){
		var _this = $(this);
		_this.parent().parent().remove();
		var a_href = _this.parent().attr("href");
		$(a_href).remove();
		$("#base-tabs-ul").find("a:last").tab("show");
	})
	//左边顶部一级菜点击事件
	$("#base-top ul li").on("click",function(){
		var data_id = $(this).attr("data-id")
		//点击一级菜单，过滤二级菜单
		$("#base-left-ul > li").hide();
		$("#base-left-ul > li div span[data-parent='"+data_id+"']").parent().parent().show();
	});
	$("#base-top ul li:eq(0)").trigger("click");	//页面初始化进来后，模拟点击第一个一级菜单
	
	//底部pin功能
	$(".base-pin span:first").on("click",function(){
		if($(this).parent().width() > 40){
			$(this).parent().animate({width: "40px"}, 500 );
		    $(".base-pin span:gt(0)").hide("slow");
		} else {
			$(this).parent().animate({width: "160px"}, 500 );
			$(this).nextAll("span").show("slow");
		}
		$("#base-left-ul-cache").hide();	//隐藏弹出的菜单
	})
})
function base_resize(base_header_height,base_left_width){
	var base_width = $("#base-header").width();
	var base_height = $(window).height();
	//都减了两个像素是因为有2px下边框
	var left_width = base_left_width;
	var left_height = base_height-base_header_height;
	var right_width = base_width-base_left_width;
	var right_heigth = base_height-base_header_height;
	$("#base-header").css("height",base_header_height-2+"px");
	$("#base-left").css({"width":left_width+"px","height":left_height+"px"})
	$("#base-right").css({"width":right_width+"px",
							"height":right_heigth+"px",
							"top":base_header_height-2+"px",
							"left":left_width+"px",
							"overflow-y":"auto"})
	$("#base-left-ul").css("height",left_height+"px");	//这里减去40，是因为这里有个一级菜单，40px高度
	$("#base-tabs-ul").next("div").css("height",right_heigth-45+"px");
	return new Array(base_width,base_height,left_width,left_height,right_width,right_heigth);
}
/**
 * 二级菜单的跳转事件（如果其下有三级菜单，不进行跳转，否则跳转）
 * @param $dom
 */
function menu_second_click($dom){
	if($dom.next("ul").length == 0){
		var id = $dom.find(".base-second-menu-name").attr("id");
		var url = $dom.find(".base-second-menu-name").attr("data-url");
		var name = $dom.find(".base-second-menu-name").html();
		if($.trim(url) != ""){
			newWin(id,name,url,true);
		}
	}
}
/**
 * 三级菜单跳转(三级菜单的id是由二级菜单的id+"#"+当前三级菜单的id)
 * @param $dom
 */
function menu_third_click($dom){
	var parent_id = $dom.parent().prev("div").find(".base-second-menu-name").attr("id");
	var id = $dom.find(".base-third-menu-name").attr("id");
	var url = $dom.find(".base-third-menu-name").attr("data-url");
	var name = $dom.find(".base-third-menu-name").html();
	if($.trim(url)){
		newWin(parent_id+"-"+id,name,url,true,false);
	}
}
/**
 * 新增一个tab窗口
 * @param menu_id	tab id，菜单id，全局唯一
 * @param menu_name	tab name，菜单name
 * @param menu_url  tab内容页要展示的页面的地址
 * @param closeable 是否可关闭
 * @param closeable 是否是新打开一个tab窗口(在同一个一级菜单下打开二级菜单，是否这些二级菜单在同一个tab窗口下打开)
 */
function newWin(menu_id,menu_name,menu_url,closeable,is_new_win){
	var tab_id = "base_gavin_"+menu_id;	//tab id 加上前缀，使唯一
	if($("#base-tabs-ul a[href=#"+tab_id+"]").length > 0){
		$("#base-tabs-ul a[href=#"+tab_id+"]").tab("show");
		return;
	}
	var close_icon = "";
	if(closeable){
		close_icon = "<span class=\"colse-tab-btn glyphicon glyphicon-remove\"></span>";
	}
	var nav_tab_html = "<li><a href=\"#"+tab_id+"\" data-toggle=\"tab\">"+menu_name+" "+close_icon+"</a></li>";
	var tab_panes_html = "<div class=\"tab-pane fade\" id=\""+tab_id+"\" style=\"width:100%; height: 100%\">"+
		  				 "<iframe src=\""+menu_url+"\" frameborder=0  width=\"100%\" height=\"100%\" style=\"border: none;\"></iframe>"+
		  				 "</div>";
	if(is_new_win){
		$("#base-tabs-ul").append(nav_tab_html);
		$("#base-tabs-ul").next("div").append(tab_panes_html);
	} else {
		//如果不需要新打开一个tab窗口，找到tab中一级菜单id相同的dom，替换成传过来的要显示的dom（tab的id组成由一级菜单id+"-"+二级菜单id）
		var parent_id = tab_id.split("-");
		var tab_dom = $("#base-tabs-ul").find("a[href^=#"+parent_id[0]+"]");
		var tab_content_dom = $("#base-tabs-ul").next("div").find("div[id^="+parent_id[0]+"]");
		//如果找不到，则在tab的最后新开一个窗口
		if(tab_dom.length > 0){
			tab_dom.parent().replaceWith(nav_tab_html);
			tab_content_dom.replaceWith(tab_panes_html);
		} else {
			$("#base-tabs-ul").append(nav_tab_html);
			$("#base-tabs-ul").next("div").append(tab_panes_html);
		}
	}
	$("#base-tabs-ul").find("li").removeClass("active");
	$("#base-tabs-ul").next("div").find("div").removeClass("active");
	$("#base-tabs-ul a[href=#"+tab_id+"]").tab('show');
	return tab_id;
}
/**
 * 得到当前激活状态的tab，即当前打开的tab窗口
 * @returns {Array}
 */
function getActiveWin(){
	var $dom = $("#base-tabs-ul li").find(".active");
	if($dom.length == 0){
		$dom = $("#base-tabs-ul li:last");
	}
	var tab_id = $dom.find("a").attr("href").substring(1);//因为tab的href属性带有#，所以他的id值得去掉#
	var tab_index = $dom.index();
	var tab_name = $dom.find("a").html();
	return [tab_index,tab_id,tab_name];
}

/**
 * 调整框架菜单宽度方法
 * @param s_h_header 短菜单框架头部高度
 * @param s_w_left 短菜单框架左边菜单宽度
 * @param l_h_header 长框架头部高度
 * @param l_w_left 长框架左边菜单宽度
 */
function baseChangeFrame(s_h_header,s_w_left,l_h_header,l_w_left){
	//当菜单有base-short-menu class，说明正处于宽菜单界面，此时需要调整为短菜单
	if(!$("#base-left-ul").find("div").hasClass("base-short-menu")){
		$("#base_left_top div:not(:last)").hide();
		$("#base-left-ul").find("div").css("width",s_w_left).addClass("base-short-menu");	//添加一个标志 base-short-menu
		$("#base-left-ul").find("ul").hide();
		$(".base-second-menu-name").hide();
		//去掉当前点击的菜单样式
		$("#base-left-ul").find("div").removeClass("base-second-menu-current");
		$("#base-left-ul").find("ul li").removeClass("base-third-menu-current");
		
		base_w_h_array = base_resize(s_h_header,s_w_left);
	} else {
		$("#base_left_top div:not(:last)").show("500");
		$("#base-left-ul").find("div").css("width",l_w_left).removeClass("base-short-menu");
		$(".base-second-menu-name").show("500");
		base_w_h_array = base_resize(l_h_header,l_w_left);
	}
	$(".base-pin span:first").trigger("click");	//模拟点击一次，让div收缩
}