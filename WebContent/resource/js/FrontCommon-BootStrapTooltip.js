(function(window,$){
	
	window.BootStrapTooltip = function(config){
		this.config = $.extend({
			delay: 3000,
			top: 0,
			left : 0,
			content: '',
			container : document.body
		}, config);
		if(this.config.container)this.appendTo(this.config.container);
	}
	
	BootStrapTooltip.prototype.appendTo = function(container){
		var html = "<div class=\"popover fade bottom in\" role=\"tooltip\" "+
				   "style=\"top: "+this.config.top+"px; left: "+this.config.left+"px;\">"+
				   "<div class=\"arrow\" style=\"left: 50%;\"></div><h3 class=\"popover-title\" style=\"display: none;\"></h3>"+
				   "<div class=\"popover-content\">"+this.config.content+"</div><input type='text' style='width:0px;height:0px;border:0px;float:left'/></div>";
		if(typeof(container)=='string'){
			container = document.getElementById(container);
		}
		var tip = this;
		this.domObj = $(html).appendTo($(container))[0];
		$(this.domObj).click(function(){
			tip.hide();
		});
	}
	
	/**
	 * tooltip的显示函数，delay = 0 不自动隐藏,
	 * @param delay
	 */
	BootStrapTooltip.prototype.show = function(delay){
		var tip = this;
		if(this.tipOut)clearTimeout(this.tipOut);
		this.hide();
		$(this.domObj).show();
		if(delay!=0)this.tipOut = setTimeout(function(){
			$(tip.domObj).fadeOut("fast",function(){
				tip.hide();
			});
		},delay?delay:this.config.delay);
	}
	
	BootStrapTooltip.prototype.hide = function(delay){
		$(this.domObj).stop(true,true).hide();
	}
	
	//设置tooltip的内容
	BootStrapTooltip.prototype.setContent = function(content){
		$(this.domObj).find(".popover-content").html(content);
	}
	
	BootStrapTooltip.prototype.setPositionType = function(positionType){
		if(positionType=="top"){
			$(this.domObj).removeClass("bottom").removeClass("top").addClass("top");
		}else{
			$(this.domObj).removeClass("bottom").removeClass("top").addClass("bottom");
		}
	}
	
	//posObj {top:222,left:111}
	BootStrapTooltip.prototype.setPosition = function(posObj){
		$(this.domObj).css({top: (posObj.top?posObj.top:0)+'px', left: (posObj.left?posObj.left:0)+'px'});
	}
	
})(window,jQuery)