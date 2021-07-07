<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>工业传动高保真</title>
	
	<!-- jQuery -->
    <script src="resource/js/jquery-3.2.1.min.js"></script>
    <script type="text/javascript" src="resource/plug/jquery-ui-1.11.2/jquery-ui.min.js"></script>
	
	<!-- bootstrap-3.3.7 -->
	<link rel="stylesheet" href="resource/plug/bootstrap-3.3.7/css/bootstrap-theme.min.css"/>
    <link rel="stylesheet" href="resource/plug/bootstrap-3.3.7/css/bootstrap.min.css"/>
    <link rel="stylesheet" href="resource/plug/bootstrap-table/bootstrap-table.css" />
    
    <script type="text/javascript" src="resource/plug/bootstrap-3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="resource/plug/bootstrap-table/bootstrap-table.js"></script>
    <script type="text/javascript" src="resource/plug/bootstrap-table/bootstrap-table-zh-CN.js"></script>
    
    <!-- zTree -->
    <link rel="stylesheet" href="resource/plug/zTree_v3/css/zTreeStyle/zTreeStyle.css"/>
    <script type="text/javascript" src="resource/plug/zTree_v3/js/jquery.ztree.all.min.js"></script>
    
    <!-- echars -->
    <script type="text/javascript" src="resource/plug/echarts-3.7.2/echarts.min.js"></script>
    
    <!-- 图标字体 -->
    <link rel="stylesheet" href="resource/plug/lmd-iconfont/demo.css"/>
    <link rel="stylesheet" href="resource/plug/lmd-iconfont/iconfont.css"/>
    <link rel="stylesheet" href="resource/css/icon_demo/demo.css"/>
	<link rel="stylesheet" href="resource/css/icon_demo/iconfont.css"/>
    
    <!-- 系统框架 -->
    <link rel="stylesheet" href="resource/plug/toastr/toastr.min.css" />
    <link href="resource/css/frontcommon.css" rel="stylesheet">
    <link rel="stylesheet" href="resource/css/zzlkj.css" />
    
    <script src="resource/js/FrontCommon.js"></script>
    <script type="text/javascript" src="resource/plug/toastr/toastr.min.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-BootStrapDialog.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-BootStrapTable.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-BootStrapMessage.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-BootStrapFormItem.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-BootStrapTab.js"></script>
    <script type="text/javascript" src="resource/js/FrontCommon-Parser.js"></script>
    
    <script type="text/javascript" src="resource/js/js_CG/index.js"></script>
    
    <!-- 其他 -->
    <link rel="stylesheet" href="resource/plug/font-awesome-4.7.0/css/font-awesome.min.css" />
    <script type="text/javascript" src="resource/plug/My97DatePicker/WdatePicker.js"></script>
    
    <!-- 自定义 -->
    <link rel="stylesheet" href="resource/css/css_CG/menu.css">
	<style type="text/css">
	.tab-content > .tab-pane{padding:0px 0px 1px 0px;}
        .nav-tabs>li{border-right:1px solid #ccc;margin: 0px;height: 30px}
        .nav-tabs > li.active{}
        .nav{min-height: 30px; font-size: 8px; background: #777777;color: #fff;line-height: 30px}
        .nav-tabs > li.active > a, .nav-tabs > li.active > a:focus, .nav-tabs > li.active > a:hover{
            color: #fff;
            background: #0086f7;
            border: 0px;
            text-align: center;
        }
        .nav > li > a{padding-bottom: 9px;background: #777777;border: 0px;color: #fff; width: 105px;
            height: 30px;text-align: center;margin: 0px;border-radius: 0px;font-size: 12px}
        .nav > li > a:hover{border: 0px;background: #0086f7;color:#fff;}
        .nav > li:hover{}
		html, body {
			min-width: 1024px;
			height: 100%;
		}
		 html,body{overflow: auto;height:100%;}
		.tab_00107{
			width: 345px;
    		left:  310px;
    		min-height: 55px;
		}
		a>span{
			display: block;
			font-size: 11px !important;
		}
		.tab>a{
			float: left;
			text-decoration: none;
			padding:20px 10px 10px 10px;
			color: white;
		}
		.tab>a>i{
			font-size: 30px;line-height: 30px;color:white; 
		}
		.tab>a:hover{
    		transform: scale(0.9);
		}		
	</style>
</head>
<body style="height:100%;overflow-y: hidden">
	<!--头部-->
	<header style="background: url('resource/images/top/bg.png');height: 57px;">
	<div class="icon_lists" style="position: absolute;right:13px;">	
	
	</div>
	</header>

	<div id="content_main" style="height:calc(100% - 57px)">
		<iframe id="myIframe" width="100%" height="100%" src="resource/html/workBench.html"
			frameborder="0" data-id="inner.html"  marginwidth="0" marginheight="0" scrolling="no"></iframe>
	</div>

</body>
<script type="text/javascript">
	//颜色数组
	var colorData = ['#ffc772','#40b361','#44d0f7','#d9b710','#22c1bb','#f7cf68','#177cb1','#a78f44','#89ada9','#88b2d9'];
	var count = 0;
	//菜单绑定事件
	function menuClick(url,id,level){
		$("#"+id).click(function(){
			if(level == 1){
				start();
		        startInit();
		        //加入选中样式
		        //图标选中高亮
		        $(this).unbind('mouseleave').unbind('mouseenter');
		        $(this).css({"background-color":"#222d38"});
		        $(this).children("i").css({"color":"#46c1fa"});
		        $(this).children("div").css({"color":"#46c1fa"});
		        $(this).children("div").children("div").css({"display":"none"});
			}
			if(!url||url==""||url=='null'){
				return;
			}
			FrontCommon.showLoading();
			$("#myIframe").attr("src", url);
			$("#myIframe").bind("load",function(){
				FrontCommon.hideLoading();
			});
	    });
	}
	//初始化二级菜单
	function initForTwoLevelMenu(){
		$.ajax({
			url:'authority/list.json',
			data:{remark:'TwoLevelMenu'},
			dataType:'json',
			type:'post',
			async:false,
			success:function(data){
				if(data["code"]["code"]==0){
					//alert(data["code"].authorityId);
					 $.each(data["result"], function(i, item) {
						//循环获取数据    
						initTwoLevelMenu(item,i);
						}); 
				}else{
					top.FrontCommon.error("初始化失败！");
				}
			}
		})
	};
	var initTwoLevelMenu = function(item,i) {
		var str = null;
		str = "<a id='"+item.authorityId+"'><i class='icon iconfont' style='border-radius: 5px;font-size: 30px;line-height: 30px;color:white; background: "+colorData[i]+";'>"+item.image+"</i><span>"+item.authorityName+"</span></a>";
		$(".tab_"+item.pid).append(str);
		menuClick(item.url, item.authorityId,2)
	}
		
	function getHeight(){
	    return document.documentElement.clientHeight-50;
	}
	//初始化界面
	function init(){
		$.ajax({
			url:'authority/list.json',
			data:{remark:'顶部菜单'},
			dataType:'json',
			type:'post',
			async:false,
			success:function(data){
				if(data["code"]["code"]==0){
					//alert(data["code"].authorityId);
					 $.each(data["result"], function(i, item) {
						//循环获取数据    
						initMenu(item);
						}); 
					
				}else{
					top.FrontCommon.error("初始化失败！");
				}
			}
		})
	};
	var initMenu = function(item) {
		var str = null;
		if(null == item.url){
			str = "<div class='menuDiv menu_hover' id='"+item.authorityId+"' url=''";
		}else{
			str = "<div class='menuDiv menu_hover' id='"+item.authorityId+"' url='"+item.url+"'";
		}
		if(('移动端' != item.authorityName && '关闭' != item.authorityName)){
			str +="><i class='icon iconfont "+item.image+"'></i>"+
			"<div><span>"+item.authorityName+"</span><div class='tabCon tab tab_"+item.authorityId+"' style='background:#222d38;display:none;border:0'></div></div>";
		}else{
			str += " style='padding-top: 14px;'>"+
			"<i class='icon iconfont "+item.image+"' style='color: white;font-size: 28px;'></i>";
		}
		$(".icon_lists").append(str);
		if(item.sort == 7){
			return;
		}
		menuClick(item.url,item.authorityId,1);
		if(item.sort == 1){
	    	count = item.authorityId;
		}
		if(item.sort == 9){
			$("#"+count).click();
		}
	} 
	var start = function() {
		$(".menuDiv").mouseleave(function(){
            $(this).css({"background-color":"rgba(26,35,43,1)"});
            if($(this).children("i").css("font-size")=="28px" && $(this).children("i").css("color") != "white"){
                $(this).children("i").css({"color":"white"});
                return;
            }
            $(this).children("i").css({"color":"#accdf0"});
            $(this).children("div").css({"color":"#accdf0"});
            $(this).children("div").children("div").css({"display":"none"});
		}).mouseenter(function(){
            $(this).css({"background-color":"#222d38"});
            $(this).children("i").css({"color":"#46c1fa"});
            $(this).children("div").css({"color":"#46c1fa"});
            $(this).children("div").children("div").css({"display":"block"});
		})
	};
	var startInit = function(){
        $(".menuDiv").each(function () {
            $(this).css({"background-color":"rgba(26,35,43,1)"});
            if($(this).children("i").css("font-size")=="28px" && $(this).children("i").css("color") != "white"){
                $(this).children("i").css({"color":"white"});
                return;
            }
            $(this).children("i").css({"color":"#accdf0"});
            $(this).children("div").css({"color":"#accdf0"});
        })
	};
	init();
	var configs = [];
	initForTwoLevelMenu();   
</script>
</html>
