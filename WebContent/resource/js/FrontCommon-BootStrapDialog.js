(function(window,$){
	
	//BootStrap弹窗
	window.BootStrapDialog = function(config){
		this.config = $.extend({
			dialogIndex: window.BootStrapDialog.dialogIndex,
			width:600,
			dragable:true,
			height:'auto',
			customeCls:'',//自定义的样式
			title:"",//弹窗标题
			content:"",//弹窗的内容
			buttons:[],//弹窗按钮，按钮配置对象{icon:'',type:'default|primary|success|info|danger|warning',click:'function(){}|close'}
			backdrop:true,//指定一个静态的背景，当用户点击模态框外部时不会关闭模态框。
			keyboard:true,//当按下 escape 键时关闭模态框，设置为 false 时则按键无效。
			show:false,//当初始化时显示模态框。
			remote:false,//使用 jQuery .load 方法，为模态框的主体注入内容。如果添加了一个带有有效 URL 的 href，则会加载其中的内容。如下面的实例所示：
			success:function(){//加载成功事件
				
			},close:function(){
				
			},opencallback:function(){//窗口打开后回调事件
				
			}
		},config)
		window.BootStrapDialog.dialogIndex++;
	}
	
	window.BootStrapDialog.dialogIndex = 0;//打开的dialog序号，从0开始，用于z-index
	
	BootStrapDialog.prototype.append = function(){
		var dialog = this;
		var html = "<div class=\"modal fade "+this.config.customeCls+"\" style=\"z-index:"+(1050+this.config.dialogIndex)+"\">"+
				   "<div class=\"modal-dialog\" style=\"width:"+this.config.width+"px\"><div class=\"modal-content\"><div class=\"modal-header\">"+
			       "<button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>"+
			       "<h4 class=\"modal-title\">"+this.config.title+"</h4></div>"+
		           "<div class=\"modal-body\" style=\"padding:0px;\"></div>"+
		           "<div class=\"modal-footer\"></div></div></div></div>";
		this.domObj = $(html).appendTo($(document.body))[0];
		//生成内容html
		if(this.config.content.substring(0,1)=="<"){//可认为是html
			$(this.config.content).appendTo($(this.domObj).find(".modal-body"));
			this.config.success.call(this);//调用config的success事件
		}else{
			//认为是iframe的url
			$("<iframe url='"+this.config.content+"' frameborder='0' style='height:100%;width:100%'></iframe>")
			.appendTo($(this.domObj).find(".modal-body")).bind('load',function(){
				dialog.config.success.call(dialog);
			});
		}
		if(this.config.height!='auto'){
			$(this.domObj).find(".modal-body").height(this.config.height-92);
		}
		//然后生成button
		for(var idx in this.config.buttons){
			var btnConfig = $.extend({"icon":'',type:'primary',click:null,text:""},this.config.buttons[idx]);
			var btnHtml = "<button type=\"button\" class=\"btn btn-"+btnConfig.type+"\">";
			if(btnConfig.icon&&btnConfig.icon!=''){
				btnHtml+="<span class=\"fa fa-"+btnConfig.icon+"\"></span> "+btnConfig.text;
			}
			btnHtml += "</button>";
			(function(btnConfig){
				$(btnHtml).appendTo($(dialog.domObj).find(".modal-footer")).click(function(e){
					if(btnConfig.click&&typeof(btnConfig.click)=='function'){
						btnConfig.click.call(dialog);
					}
				});
			})(btnConfig);
		}
		
		if(this.config.dragable){
			if(!$(this.domObj).draggable){
				//引入
				$.getScript(FrontCommon.contextPath+"/resource/plug/jquery-ui-1.11.2/jquery-ui.min.js",function(){
					$(dialog.domObj).draggable({
						handle: ".modal-header"
					});
					$(dialog.domObj).find(".modal-header").css({"cursor":"move"})
				});
			}else{
				$(dialog.domObj).draggable({
					handle: ".modal-header"
				});
				$(dialog.domObj).find(".modal-header").css({"cursor":"move"})
			}
		}
	}
	
	BootStrapDialog.prototype.open = function(){
		var dialog = this;
		
		if(!this.domObj){
			this.append();
		}
		$(this.domObj).modal($.extend(this.config,{show:true})).on("hidden.bs.modal",function(){
			dialog.domObj = null;
	    	$(this).remove();
	    	dialog.config.close.call(dialog);
	    }).on("shown.bs.modal",function(){
	    	if(dialog.config.height!='auto'){
				var height = parseInt(dialog.config.height);
				height -= $(dialog.domObj).find(".modal-header").outerHeight();
				height -= $(dialog.domObj).find(".modal-footer").outerHeight();
				$(dialog.domObj).find(".modal-body").height(height-2);
			}
	    	if($(dialog.domObj).find("iframe").length>0){
	    		$(dialog.domObj).find("iframe:first").attr('src',$(dialog.domObj).find("iframe:first").attr('url'));
	    	}
	    	if(dialog.config.opencallback&&typeof(dialog.config.opencallback)=='function'){
	    		dialog.config.opencallback.call(dialog);
	    	}
	    })
	    $(this.domObj).next("div").css({"z-index":(1049+this.config.dialogIndex)});
	}
	
	BootStrapDialog.prototype.close = function(){
		$(this.domObj).modal('hide');
	}
	
	BootStrapDialog.prototype.getFrameWin = function(){
		return $(this.domObj).find("iframe")[0].contentWindow;
	}
	
})(window,jQuery);