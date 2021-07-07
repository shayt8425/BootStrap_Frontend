(function(window,$){
	
	//BootStrap弹窗
	window.BootStrapMenu = function(config){
		this.config = $.extend({
			width:200,//menu菜单的宽度
			height:'auto',//menu菜单的高度
			menus:[],//menu菜单的内部数据，内部对象格式为{icon:'',text:'',click:function(){}}，icon为菜单项的图标，text为菜单项的文字，click为菜单项点击事件
			autoHide:true,//是否自动隐藏，点击menu外的任何地方，隐藏menu,
			x:0,//menu弹出的位置基于frame的x，y
			y:0
		},config);
	}
	
	window.BootStrapMenu.menu = null;
	
	BootStrapMenu.prototype.append = function(){
		//添加别的menu时，关掉之前弹出的menu
		if(window.BootStrapMenu.menu){
			window.BootStrapMenu.menu.close();
		}
		var menu = this;
		this.height = typeof(this.config.height)=='number'?this.config.height+'px':this.config.height;
		this.width = typeof(this.config.width)=='number'?this.config.width+'px':this.config.width;
		var dialog = this;
		var html = "<ul class=\"dropdown-menu\" style=\"top:"+this.config.y+"px;left:"+this.config.x
				   +"px;width:"+this.width+";height:"+this.height+";overflow:auto;\"></ul>";
		this.domObj = $(html).appendTo($(document.body))[0];
		$(this.domObj).click(function(e){//菜单点击禁止冒泡
			e.stopPropagation();
		})
		//生成内容menu菜单项
		for(var idx in this.config.menus){
			var menuObj = this.config.menus[idx];
			this.addMenu(menuObj);
		}
		
		if(this.config.autoHide){//如果配置了自动隐藏
			$(document.body).bind("click",function(){
				menu.close();
			});
		}
		window.BootStrapMenu.menu = this;
	}
	
	BootStrapMenu.prototype.addMenu = function(menuObj){
		var menu = this;
		var menuLiobj = $("<li class='menuCustomClass'><a href=\"javascript:void(0)\" style=\"padding-right:30px;color:blue\">"+
				"<span class=\"fa fa-"+menuObj.icon+"\"></span>&nbsp;&nbsp;&nbsp;"+menuObj.text+"</li>");
		menuLiobj.appendTo($(this.domObj)).click(function(e){
			if(menuObj.click&&typeof(menuObj.click=='function')){
				menuObj.click.call(menu);
			}
			menu.close();
		});
		if(!menuObj.icon||menuObj.icon==''){
			menuLiobj.find(".glyphicon").attr("class","glyphicon glyphicon-move").css({"visibility":"hidden"});
		}
	}
	
	BootStrapMenu.prototype.addSeperator = function(index){
		if(!index&&index!=0){
			$("<li class='divider'></li>").appendTo($(this.domObj));
		}else{
			$(this.domObj).find(".menuCustomClass:eq("+index+")").before("<li class='divider'></li>");
		}
	}
	
	BootStrapMenu.prototype.open = function(x,y){
		var menu = this;
		
		if(!this.domObj){
			this.append();
		}
		if(x&&y){
			$(this.domObj).css({top:y+'px',left:x+'px'}).show();
		}else{
			$(this.domObj).show();
		}
	}
	
	BootStrapMenu.prototype.close = function(){
		$(this.domObj).hide();
		$(this.domObj).remove();
		if(this.config.autoHide){//如果配置了自动隐藏
			$(document.body).unbind("click");
		}
		window.BootStrapMenu.menu = null;
	}
	
})(window,jQuery);