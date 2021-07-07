(function(window,$){
	
	//BootStrap tabs定义
	window.BootStrapTab = function(config){
		this.config = $.extend({
			id:'',//tab页面元素标识
			cls:'nav-tabs',//bootstrap tab所采用的样式，默认nav-tabs
			width:"100%",//tab宽度，默认是父容器宽度的100%
			style:'',//用户自定义样式
			height:300,//tab content高度，默认300,
			tabs:[],//内部tab配置，对象格式{id:'xxx',title:'',content:'<div></div>或xxx.html',click:function(){xxx},success:function(){}}
			clickLoad:true,//是否点击tab页才加载内部iframe
			container: null,
			defaultActiveTab: 0
		},config);
		this.tabIndex = 0;
		if(this.config.container)this.appendTo(this.config.container);
	}
	
	BootStrapTab.prototype.appendTo = function(container){
		this.width = typeof(this.config.width)=="number"?this.config.width+"px":this.config.width;
		this.height = typeof(this.config.height)=="number"?this.config.height+"px":this.config.height;
		if(typeof(container)=='string'){
			container = document.getElementById(container);
		}
		this.tabLinkObj = $("<ul id=\""+this.config.id+"\" class=\"nav "+this.config.cls+"\" style=\"width:"
				+this.width+";"+this.config.style+"\"></ul>").appendTo(container)[0];
		this.tabContentObj = $("<div id=\""+this.config.id+"Content\" class=\"tab-content\" style=\"height:"
				+this.height+";\"></div>").appendTo(container)[0];
		//下面开始添加tab相关数据
		for(var idx in this.config.tabs){
			this.addTab(this.config.tabs[idx]);
		}
		if(this.config.tabs&&this.config.tabs.length>0)this.activeTab(this.config.defaultActiveTab);//激活第一个tab
	}
	
	/**
	 * 添加一个tab
	 * @param tab 预添加的tab配置对象
	 * @param removeable 是否可移除
	 */
	BootStrapTab.prototype.addTab = function(tab,removeable,removeCallback){
		var tabLink = this.buildTabLink(tab,this.tabIndex);
		var tabObj = this;
		if(removeable){
			if(tabLink.find("div").length==0){
				tabLink.find("a").css({"padding":"7px 25px 7px 15px","position":"relative"})
				$("<div class='count' style='cursor:pointer;color:#000;background-color:transparent'><span class='fa fa-remove'></span></div>")
				.appendTo(tabLink).mouseenter(function(){
					$(this).css("color","#ccc");
				}).mouseleave(function(){
					$(this).css("color","#000");
				}).click(function(){
					tabObj.removeById(tab.id);
					if(removeCallback)removeCallback(tabObj);
				})
			}
		}
		this.buildTabContent(tab,this.tabIndex);
		this.tabIndex++;
		this.config.tabs.push(tab);
		return tabLink;
	}
	
	/**
	 * 构建tab link区域html
	 */
	BootStrapTab.prototype.buildTabLink = function(tabConfig,tabIndex){
		var tab = this;
		var tabLink = $("<li tabindex=\""+tabIndex+"\"><a href=\"#"+tabConfig.id
			+"\" data-toggle=\"tab\" aria-expanded=\"false\">"+tabConfig.title+"</a></li>").
			appendTo($(tab.tabLinkObj)).find("a:first").click(function(e){
				tab.activeTab(tabIndex,function(){
					if(tabConfig.click){
						tabConfig.click.call(tab,tabConfig.id);
					}
				});
		});
		
		return tabLink.parent();
	}
	
	/**
	 * 构建tab内容区域html
	 */
	BootStrapTab.prototype.buildTabContent = function(tabConfig,tabIndex){
		var tab = this;
		var tabObj = $("<div class=\"tab-pane fade\" tabindex=\""+tabIndex+"\" id=\""+tabConfig.id
				+"\" style=\"height:100%;\"></div>").appendTo(tab.tabContentObj);
		if(tabConfig.content.substring(0,1)=="<"){
			$(tabConfig.content).appendTo(tabObj);
			//直接添加html，并触发success事件
			if(tabConfig.success)tabConfig.success.call(tab);
		}else{
			var frm = $("<iframe url=\""+tabConfig.content+"\" frameborder=\"0\" scrolling=\"auto\" " +
					"style=\"width:100%;height:100%\"></iframe>").appendTo(tabObj);
			if(!tab.config.clickLoad){
				frm.attr("src",frm.attr("url"));
				frm.bind("load",function(){
					if(tabConfig.success){
						tabConfig.success.call(tab,frm[0].contentWindow);
					}
				})
			}
		}
	}
	
	BootStrapTab.prototype.getFrameById = function(id){
		return $(this.tabContentObj).children("div[id='"+id+"']").find("iframe:first")[0].contentWindow;
	}
	
	BootStrapTab.prototype.getFrameByIndex = function(index){
		return $(this.tabContentObj).children("div:eq("+index+")").find("iframe:first")[0].contentWindow;
	}
	
	BootStrapTab.prototype.removeByIndex = function(index){
		var prevTabLink = $(this.tabLinkObj).children("li:eq("+index+")").prev("li");
		$(this.tabLinkObj).children("li:eq("+index+")").remove();
		$(this.tabContentObj).children("div:eq("+index+")").remove();
		this.activeTab(prevTabLink.attr("tabindex"));
	}
	
	BootStrapTab.prototype.removeById = function(id){
		var prevTabLink = $(this.tabLinkObj).find("a[href='#"+id+"']").parent().prev("li");
		$(this.tabLinkObj).find("a[href='#"+id+"']").parent().remove();
		$(this.tabContentObj).children("div[id='"+id+"']").remove();
		this.activeTab(prevTabLink.attr("tabindex"));
	}
	
	BootStrapTab.prototype.activeTab = function(obj,callback){
		if(typeof(obj)=='number'||/^[\d]+$/.test(obj)){
			this.activeTabByIndex(obj,callback);
		}else{
			this.activeTabById(obj,callback);
		}
		
	}
	
	BootStrapTab.prototype.activeTabByIndex = function(tabIndex,callback){
		var tab = this;
		//重新绑定一次tab显示回调函数
		$(this.tabLinkObj).children("li[tabindex='"+tabIndex+"']").find("a")[0].callbackFunc = callback;
		if(!$(this.tabLinkObj).children("li[tabindex='"+tabIndex+"']").find("a").attr('shownbinded')){//如果未绑定tab显示事件
			$(this.tabLinkObj).children("li[tabindex='"+tabIndex+"']").find("a").on("shown.bs.tab",function(e){
				//判断是否点击加载tab下的iframe
				if(tab.config.clickLoad){
					var frm = $(tab.tabContentObj).children("div[tabindex='"+tabIndex+"']").find("iframe:first");
					if(frm.length>0&&!frm.attr("src")){
						frm.attr("src",frm.attr("url"));
						frm.bind("load",function(){
							if(tab.config.tabs[tabIndex].success){
								tab.config.tabs[tabIndex].success.call(tab,frm[0].contentWindow);
							}
						})
					}
				}
				if(this.callbackFunc)this.callbackFunc.call(tab);
			})
			$(this.tabLinkObj).children("li[tabindex='"+tabIndex+"']").find("a").attr('shownbinded','true');
		}
		
		$(this.tabLinkObj).children("li[tabindex='"+tabIndex+"']").find("a").tab("show");//调用tab插件的函数
	}
	
	BootStrapTab.prototype.activeTabById = function(tabId,callback){
		var tab = this;
		//重新绑定一次tab显示回调函数
		$(this.tabLinkObj).find("a[href='#"+tabId+"']")[0].callbackFunc = callback;
		if(!$(this.tabLinkObj).find("a[href='#"+tabId+"']").attr('shownbinded')){//如果未绑定tab显示事件
			$(this.tabLinkObj).find("a[href='#"+tabId+"']").on("shown.bs.tab",function(e){
				//判断是否点击加载tab下的iframe
				if(tab.config.clickLoad){
					var frm = $(tab.tabContentObj).children("div[id='"+tabId+"']").find("iframe:first");
					var tabIndex = $(tab.tabContentObj).children("div[id='"+tabId+"']").attr("tabindex");
					if(frm.length>0&&!frm.attr("src")){
						frm.attr("src",frm.attr("url"));
						frm.bind("load",function(){
							if(tab.config.tabs[tabIndex].success){
								tab.config.tabs[tabIndex].success.call(tab,frm[0].contentWindow);
							}
						})
					}
				}
				if(this.callbackFunc)this.callbackFunc.call(tab);
			});
			$(this.tabLinkObj).find("a[href='#"+tabId+"']").attr('shownbinded','true');
		}
		$(this.tabLinkObj).find("a[href='#"+tabId+"']").tab("show");//调用tab插件的函数
	}
	
	
	BootStrapTab.prototype.getActive = function(){
		var returnObj = null;
		$(this.tabContentObj).children("div").each(function(){
			if($(this).hasClass("active")){
				returnObj = this;
			}
		})
		
		return returnObj;
	}
	
	//为tab设置数字提醒
	BootStrapTab.prototype.setCount = function(index,num){
		var tabLink = $(this.tabLinkObj).children("li[tabindex=\""+index+"\"]");
		if(tabLink.find("div").length==0){
			tabLink.find("a").css({"padding":"7px 25px 7px 15px","position":"relative"})
			tabLink.append("<div class='count'></div>")
		}
		tabLink.find("div").text(num);
	}
	
	//为tab移除数字提醒
	BootStrapTab.prototype.removeCount = function(index){
		var tabLink = $(this.tabLinkObj).children("li[tabindex=\""+index+"\"]");
		if(tabLink.find("div").length>0){
			tabLink.find("a").css({"padding":"7px 15px","position":"relative"})
			tabLink.find("div").remove();
		}
	}
	
	BootStrapTab.prototype.setHeight = function(height){
		var newHeight = typeof(height)=='number'?height+"px":height;
		$(this.tabContentObj).css({"height":newHeight});
	}
	
})(window,jQuery);