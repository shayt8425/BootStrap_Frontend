(function(window,$){
	window.BootStrapFormItem = new Object();
	
	//声明bootstrap表单项的普通文本类型
	BootStrapFormItem.text = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.text.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.text.prototype.getDomHtml = function(){
		var html = "<div style=\"position:relative;width:"+this.width+"\"><input type=\"text\" autocomplete=\"off\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\""+
				   "class=\"form-control"+(" "+this.itemConfig.cls)+"\" "+(this.itemConfig.readOnly?"readonly=\"readonly\" ":"")+
				   (this.itemConfig.maxlength?"maxlength=\""+this.itemConfig.maxlength+"\" ":"")+
				   "placeholder=\""+this.itemConfig.placeholder+"\" style=\"width:"+this.width+";"+this.itemConfig.style+"\" /></div>";
		return html;
	}
	
	BootStrapFormItem.text.prototype.setWidth = function(width){
		//通用的设置表单宽度函数
		this.domObj.style.width = typeof(width)=="number"?width+"px":width;
		$(this.domObj).find("input").css({"width":typeof(width)=="number"?width+"px":width});
	}
	
	BootStrapFormItem.text.prototype.appendTo = function(container){
		FrontCommon.FormItem.prototype.appendTo.call(this,container);
		if(this.itemConfig.clearable)this.bindRemoveButton();
	}
	
	/**
	 * 注册移除按钮的事件
	 */
	BootStrapFormItem.text.prototype.bindRemoveButton = function(right){
		var item = this;
		var control = this.getTargetControl();
		if(right){
			right = $(this.domObj).find(".btn").outerWidth()+7;
		}
		var removeBtn = $("<i class=\"glyphicon glyphicon-remove\" " +
			"style=\"display:none;position: absolute;" +
			"right: "+(right?right:7)+"px;z-index: 1000;\"></i>")
		.insertAfter($(control));
		var topset = (removeBtn.parent().outerHeight()-14)/2;
		removeBtn.css({top:topset+'px'});
		removeBtn.mousedown(function(){
			$(this).attr("mousedown","true");
		}).mouseup(function(){
			$(this).attr("mousedown","false");
			$(control).blur();
			if($(item.domObj).find(".dropdown-toggle").length>0){
				$(item.domObj).find(".dropdown-toggle").focus();
			}
		}).click(function(){
			item.clear(item.itemConfig.type=='select');
		});
		$(control).keyup(function(){
			if($(this).val()!=""&&$(this).is(":focus")){
				var topset = (removeBtn.parent().outerHeight()-14)/2;
				removeBtn.css({top:topset+'px'});
				removeBtn.show();
				$(this).css({"padding-right":"22px"})
			}else{
				removeBtn.hide();
				$(this).css({"padding-right":"12px"})
			}
		}).focus(function(){
			if($(this).val()!=""&&(item.itemConfig.type!='text'||!item.itemConfig.readOnly)){
				var topset = (removeBtn.parent().outerHeight()-14)/2;
				removeBtn.css({top:topset+'px'});
				removeBtn.show();
				$(this).css({"padding-right":"22px"})
			}else{
				removeBtn.hide();
				$(this).css({"padding-right":"12px"})
			}
		}).blur(function(e){
			if($(removeBtn).attr("mousedown")!="true"){
				removeBtn.hide();
				$(this).css({"padding-right":"12px"})
			}
		})
	}
	
	//声明bootstrap表单项的密码类型
	BootStrapFormItem.password = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.password.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.password.prototype.getDomHtml = function(){
		var html = "<div style=\"position:relative;width:"+this.width+"\"><input type=\"password\" autocomplete=\"off\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\""+
				   "class=\"form-control"+(" "+this.itemConfig.cls)+"\" "+(this.itemConfig.readOnly?"readonly=\"readonly\" ":"")+
				   "placeholder=\""+this.itemConfig.placeholder+"\" style=\"width:"+this.width+";"+this.itemConfig.style+"\" /></div>";
		return html;
	}
	
	BootStrapFormItem.password.prototype.appendTo = function(container){
		FrontCommon.FormItem.prototype.appendTo.call(this,container);
		if(this.itemConfig.clearable)BootStrapFormItem.text.prototype.bindRemoveButton.call(this);
	}
	
	BootStrapFormItem.password.prototype.setWidth = function(width){
		//通用的设置表单宽度函数
		this.domObj.style.width = typeof(width)=="number"?width+"px":width;
		$(this.domObj).find("input").css({"width":typeof(width)=="number"?width+"px":width});
	}
	
	//声明bootstrap表单项的数字类型
	BootStrapFormItem.number = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
		this.itemConfig = $.extend({
			min:"0",
			max: 0x7fffffff
		},this.itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.number.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.number.prototype.getDomHtml = function(){
		var html = "<div style=\"position:relative;width:"+this.width+"\"><input type=\"number\" min=\""+this.itemConfig.min+"\" max=\""+this.itemConfig.max+"\" autocomplete=\"off\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\""+
				   "class=\"form-control"+(" "+this.itemConfig.cls)+"\" "+(this.itemConfig.readOnly?"readonly=\"readonly\" ":"")+
				   "placeholder=\""+this.itemConfig.placeholder+"\" style=\"width:"+this.width+";"+this.itemConfig.style+"\" /></div>";
		return html;
	}
	
	BootStrapFormItem.number.prototype.appendTo = function(container){
		FrontCommon.FormItem.prototype.appendTo.call(this,container);
	}
	
	BootStrapFormItem.number.prototype.setWidth = function(width){
		//通用的设置表单宽度函数
		this.domObj.style.width = typeof(width)=="number"?width+"px":width;
		$(this.domObj).find("input").css({"width":typeof(width)=="number"?width+"px":width});
	}
	
	//声明bootstrap表单项的隐藏域类型
	BootStrapFormItem.hidden = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.hidden.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.hidden.prototype.getDomHtml = function(){
		var html = "<input type=\"hidden\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\"/>";
		return html;
	}
	
	//声明bootstrap表单项的date类型
	BootStrapFormItem.date = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
		this.itemConfig = $.extend({
			dateFmt:'yyyy-MM-dd',
			validateType:"pattern",
			messagePattern:'日期格式错误',
			readOnly: false
		},this.itemConfig);
		
		
		var regex = this.itemConfig.dateFmt;
		var dateMatchArr = regex.match(/d{1,2}/g);
		if(dateMatchArr){
			dateStr = dateMatchArr[0];
			regex = regex.replace(dateStr, "[\\d]{"+dateStr.length+"}");
		}
		var yearMatchArr = regex.match(/y{1,4}/ig);
		if(yearMatchArr){
			yearStr = yearMatchArr[0];
			regex = regex.replace(yearStr, "[\\d]{"+yearStr.length+"}");
		}
		var monthMatchArr = regex.match(/M{1,2}/g);
		if(monthMatchArr){
			monthStr = monthMatchArr[0];
			regex = regex.replace(monthStr, "[\\d]{"+monthStr.length+"}");
		}
		var hourMatchArr = regex.match(/H{1,2}/g);
		if(hourMatchArr){
			hourStr = hourMatchArr[0];
			regex = regex.replace(hourStr, "[\\d]{"+hourStr.length+"}");
		}
		var minMatchArr = regex.match(/m{1,2}/g);
		if(minMatchArr){
			minStr = minMatchArr[0];
			regex = regex.replace(minStr, "[\\d]{"+minStr.length+"}");
		}
		var secondMatchArr = regex.match(/s{1,2}/g);
		if(secondMatchArr){
			secondStr = secondMatchArr[0];
			regex = regex.replace(secondStr, "[\\d]{"+secondStr.length+"}");
		}
		this.itemConfig.pattern = regex;
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.date.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.date.prototype.getDomHtml = function(){
		//日期控件，全部放开，可以输入和选择
		this.controlWidth = typeof(this.itemConfig.width)=='number'?(this.itemConfig.width-33)+"px":this.itemConfig.width;
		this.height = this.itemConfig.height?(typeof(this.itemConfig.height)=="number"?this.itemConfig.height+"px":this.itemConfig.height):"200px";
		var html = "<div class=\"input-group\"><input autocomplete=\"off\" type=\"text\""+(this.itemConfig.readOnly?"readonly=\"readonly\"":"")+" id=\""+this.itemConfig.id+"\" name=\""+this.itemConfig.name+"\""+
				   " class=\"form-control"+(" "+this.itemConfig.cls)+"\" style=\"background-color:#fff;width:"+this.controlWidth+";"+this.itemConfig.style+"\" placeholder=\""+this.itemConfig.placeholder+"\" />";
		html += "<div class=\"input-group-btn\" style=\"width:auto;\">";
		html += "<button type=\"button\" style=\"\" class=\"btn btn-default dropdown-toggle\"><span class=\"iconfont icon-rili\" style='color:rgb(133,223,236);font-size:16px;'></span></button>";
		html += "</div></div>";
		return html;
	}
	
	BootStrapFormItem.date.prototype.appendTo = function(container){
		var item = this;
		FrontCommon.FormItem.prototype.appendTo.call(this,container);
		setTimeout(function(){
			item.controlWidth = typeof(item.itemConfig.width)=='number'?(item.itemConfig.width-$(item.domObj).find(".btn").outerWidth()+1)+"px":item.itemConfig.width;
			item.getTargetControl().style.width = item.controlWidth;
		}, 100);
		
		$(this.domObj).find("button:first").click(function(){
			WdatePicker($.extend({el:$(item.domObj).find("input[type='text']")[0]},item.itemConfig));
			if(!item.itemConfig.readOnly)$(item.getTargetControl()).prop("readonly",false);
		})
		
		if(this.itemConfig.clearable)BootStrapFormItem.text.prototype.bindRemoveButton.call(this,40);
	}
	
	//声明bootstrap textarea
	BootStrapFormItem.textarea = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.textarea.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.textarea.prototype.getDomHtml = function(){
		this.height = this.itemConfig.height?(typeof(this.itemConfig.height)=="number"?this.itemConfig.height+"px":this.itemConfig.height):"150px";
		var html = "<textarea type=\"textarea\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\""+
		   "class=\"form-control"+(" "+this.itemConfig.cls)+"\" "+(this.itemConfig.readOnly?"readonly=\"readonly\" ":"")+
		   (this.itemConfig.maxlength?"maxlength=\""+this.itemConfig.maxlength+"\" ":"")+
		   "placeholder=\""+this.itemConfig.placeholder+"\" style=\"width:"+this.width+";height:"+
		   this.height+";"+this.itemConfig.style+"\"></textarea>";
		return html;
	}
	
	//声明bootstrap radio
	BootStrapFormItem.radio = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
		this.itemConfig = $.extend({
			datas: null,
			url: '',
			"data-value":"value",
			"data-label":"label",
			"urlParams":{},
			"urlDataProp":[]
		},this.itemConfig);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.radio.prototype = new FrontCommon.FormItem();
	
	//重写radio的appendTo函数
	BootStrapFormItem.radio.prototype.appendTo = function(container){
		FrontCommon.FormItem.prototype.appendTo.call(this,container);//调用父类函数
		var item = this;
		if(this.itemConfig.datas){
			this.buildDatas();
			this.datasAlready = true;
		}else if(this.itemConfig.url&&this.itemConfig.url!=""){
			$.ajax({
				url:item.itemConfig.url,
				type:'post',
				dataType:'json',
				data:item.itemConfig.urlParams,
				success:function(data){
					var dataStr = "data";
					//获取url返回的数据，如果需要取data["?"]["?"]属性，则需要eval
					for(var idx in item.itemConfig.urlDataProp){
						dataStr += "[\""+item.itemConfig.urlDataProp[idx]+"\"]";
					}
					eval("item.itemConfig.datas = "+dataStr);
					item.datasAlready = true;
					item.buildDatas();
				}
			})
		}
	}
	
	//构建radio数据
	BootStrapFormItem.radio.prototype.buildDatas = function(){
		for(var idx in this.itemConfig.datas){
			var dataValue = this.itemConfig.datas[idx][this.itemConfig["data-value"]];
			var dataLabel = this.itemConfig.datas[idx][this.itemConfig["data-label"]];
			this.buildOption(dataValue, dataLabel);
		}
	}
	
	BootStrapFormItem.radio.prototype.buildOption = function(dataValue, dataLabel){
		var item = this;
		var obj = $("<span type=\""+this.itemConfig.type+"\" data-value=\""+dataValue+"\" style=\"margin-right:10px;cursor:pointer;\"><span class=\"glyphicon glyphicon-ok-circle-empty\" style=\"margin-right:5px;top:0px;\"></span>"+dataLabel+"</span>")
		.appendTo($(this.domObj)).click(function(){
			$(item.domObj).find(".glyphicon").removeClass("glyphicon-ok-circle").addClass("glyphicon-ok-circle-empty");
			$(this).find(".glyphicon").removeClass("glyphicon-ok-circle-empty").addClass("glyphicon-ok-circle");
			$(item.domObj).find("input[type='hidden']:first").val(dataValue);
		});
		
		return obj;
	}
	
	/**
	 * radio的setValue函数，重写
	 */
	BootStrapFormItem.radio.prototype.setValue = function(value, callback){
		var item = this;
		if(this.datasAlready){
			$(this.domObj).find("[data-value='"+value+"']").click();
			
			if(callback && typeof(callback)=='function')callback.call(this);
		}else{
			setTimeout(function(){
				item.setValue(value, callback);
			}, 500);
		}
	}
	
	/**
	 * radio的清空函数
	 */
	BootStrapFormItem.radio.prototype.clear = function(){
		$(this.domObj).find("input[type='hidden']:first").val("");
		$(this.domObj).find(".glyphicon").removeClass("glyphicon-ok-circle").addClass("glyphicon-ok-circle-empty");
	}
	
	BootStrapFormItem.radio.prototype.getDomHtml = function(){
		var html = "<div style=\"position:relative\"><input type=\"hidden\" name=\""+this.itemConfig.name+"\" id=\""+this.itemConfig.id+"\"/></div>";
		return html;
	}
	
	BootStrapFormItem.radio.prototype.setDisabled = function(){
		$(this.domObj).append("<div name=\"disbaledDiv\" style=\"width: 100%;height: calc(100% + 10px);position: absolute;"+
			"top: -5px;left: -5px;background: #ccc;border: 1px solid #ccc;border-radius: 5px;opacity: 0.4;\"></div>")
	}
	
	BootStrapFormItem.radio.prototype.setEnabled = function(){
		$(this.domObj).find("div[name='disbaledDiv']").remove();
	}
	
	BootStrapFormItem.checkbox = function(itemConfig){
		BootStrapFormItem.radio.call(this,itemConfig);
	}
	
	BootStrapFormItem.checkbox.prototype = new BootStrapFormItem.radio();
	
	BootStrapFormItem.checkbox.prototype.buildOption = function(dataValue, dataLabel){
		var item = this;
		var obj = $("<span type=\""+this.itemConfig.type+"\" data-value=\""+dataValue+"\" style=\"margin-right:10px;cursor:pointer;\"><span class=\"glyphicon glyphicon-unchecked\" style=\"margin-right:5px;top:0px;\"></span>"+dataLabel+"</span>")
		.appendTo($(this.domObj)).click(function(){
			var value = $(item.domObj).find("input[type='hidden']:first").val();
			if($(this).find(".glyphicon").hasClass("glyphicon-unchecked")){
				$(this).find(".glyphicon").removeClass("glyphicon-unchecked").addClass("glyphicon-check");
				$(item.domObj).find("input[type='hidden']:first").val(value+(value==""?"":",")+dataValue);
			}else{
				$(this).find(".glyphicon").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
				$(item.domObj).find("input[type='hidden']:first").val(
						value.replace(","+dataValue,"").replace(dataValue+",","").replace(dataValue,""));
			}
		});
		
		return obj;
	}
	
	/**
	 * checkbox的清空函数
	 */
	BootStrapFormItem.checkbox.prototype.clear = function(){
		$(this.domObj).find("input[type='hidden']:first").val("");
		$(this.domObj).find("span[type='checkbox']>.glyphicon").removeClass("glyphicon-check").addClass("glyphicon-unchecked");
	}
	
	/**
	 * checkbox的setValue函数，重写
	 */
	BootStrapFormItem.checkbox.prototype.setValue = function(value, callback){
		var item = this;
		if(this.datasAlready){
			this.clear();
			for(var idx in this.itemConfig.datas){
				if((value+",").indexOf(this.itemConfig.datas[idx][this.itemConfig["data-value"]]+",")>-1){
					$(this.domObj).find("[data-value='"+this.itemConfig.datas[idx][this.itemConfig["data-value"]]+"']").click();
				}
			}
			
			if(callback && typeof(callback)=='function')callback.call(this);
		}else{
			setTimeout(function(){
				item.setValue(value, callback);
			}, 500);
		}
	}
	
	//声明bootstrap select
	BootStrapFormItem.select = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
		this.itemConfig = $.extend({
			select:function(item,value,label){},
			dropmenuWidth:"auto",
			remote: false,
			datas: null,
			url: '',
			popDir:'down',//选择列表弹出方向，上or下，默认下
			"data-value":"value",
			"data-label":"label",
			"urlParams":{},
			selectDataRequired: true,
			selectDataRequiredMesage: '请选择一个选项',
			"urlDataProp":[],
			popVerticalDir:'left',
			multiple: false,//是否多选
			remoteLimit:50,//远程调用是，限制的最大搜索数据长度
			dataLimit:200//默认下拉框选项显示最大数量
		},this.itemConfig);
		if(!this.itemConfig.placeholder||this.itemConfig.placeholder=="")this.itemConfig.placeholder = "请选择";
		if(this.itemConfig.multiple)this.itemConfig.readOnly = true;//暂时这样处理
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.select.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.select.prototype.getDomHtml = function(){
		//文本框的宽度，需要减去下拉按钮的宽度
		this.dropmenuWidth = typeof(this.itemConfig.dropmenuWidth)=='number'?(this.itemConfig.dropmenuWidth-33)+"px":this.itemConfig.dropmenuWidth;
		this.controlWidth = typeof(this.itemConfig.width)=='number'?(this.itemConfig.width-33)+"px":this.itemConfig.width;
		this.height = this.itemConfig.height?(typeof(this.itemConfig.height)=="number"?this.itemConfig.height+"px":this.itemConfig.height):"200px";
		var html = "<div class=\"input-group\"><input autocomplete=\"off\" type=\"text\""+(this.itemConfig.readOnly?" readOnly":"")+" name=\""+this.itemConfig.name+"Select\""+
				   " class=\"form-control"+(" "+this.itemConfig.cls)+"\" style=\"background-color:#fff;width:"+this.controlWidth+";"+this.itemConfig.style+"\" placeholder=\""+this.itemConfig.placeholder+"\" />";
		html += "<input type=\"hidden\" id=\""+this.itemConfig.id+"\" name=\""+this.itemConfig.name+"\"/>";
		html += "<div class=\"input-group-btn\" style=\"width:auto;\">";
		html += "<button type=\"button\" style=\"\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"iconfont icon-shaixuan\"></span></button>";
		html += "<ul class=\"dropdown-menu\" style=\"width:"+this.dropmenuWidth+";"+(this.itemConfig.popVerticalDir=="left"?"left:-"+this.controlWidth:"right:0px")+
			    ";height:"+this.height+";overflow:auto;min-width:"+this.width+";\">";
		html += "</ul></div></div>";
		return html;
	}
	
	BootStrapFormItem.select.prototype.setPopDir = function(popDir){
		if(popDir=='up'){
			$(this.domObj).find(".dropdown-menu").each(function(){
				$(this).css("top",-4-$(this).outerHeight())
			})
		}else if(popDir=="down"){
			$(this.domObj).find(".dropdown-menu").each(function(){
				$(this).css("top","100%");
			})
		}
	}
	
	//覆盖父类的appendTo函数
	BootStrapFormItem.select.prototype.appendTo = function(container){
		FrontCommon.FormItem.prototype.appendTo.call(this,container);//调用父类函数，类似java super
		var formItemObj = this;
		setTimeout(function(){
			formItemObj.controlWidth = typeof(formItemObj.itemConfig.width)=='number'?(formItemObj.itemConfig.width-$(formItemObj.domObj).find(".btn").outerWidth()+1)+"px":formItemObj.itemConfig.width;
			formItemObj.getTargetControl().style.width = formItemObj.controlWidth;
			$(formItemObj.domObj).find("ul.dropdown-menu").css({"left":"-"+formItemObj.controlWidth});
		}, 100);
		if(this.itemConfig.popDir=="auto"){
			var control = formItemObj.getTargetControl();
			var obj = $(control).offset();
			//如果上面的空间大于下面的空间，那么往上弹出
			if(document.documentElement.clientHeight-obj.top<obj.top){
				obj.top = obj.top-4-$(this.domObj).find(".dropdown-menu").outerHeight();
			}else{
				obj.top = obj.top+$(control).height()+2;
			}
			$(this.domObj).find(".dropdown-menu").css({"position":"fixed","top":obj.top+"px","left":obj.left+"px"});
			$(this.domObj).find("button").click(function(){
				var controlOffset = $(control).offset();
				//如果上面的空间大于下面的空间，那么往上弹出
				if(document.documentElement.clientHeight-(controlOffset.top-document.documentElement.scrollTop)<(controlOffset.top-document.documentElement.scrollTop)){
					controlOffset.top = controlOffset.top-4-$(formItemObj.domObj).find(".dropdown-menu").outerHeight()-document.documentElement.scrollTop;
				}else{
					controlOffset.top = controlOffset.top-document.documentElement.scrollTop+$(control).height()+2;
				}
				$(formItemObj.domObj).find(".dropdown-menu").css({"top":controlOffset.top+"px","left":controlOffset.left+"px"});
			});
		}else if(this.itemConfig.popDir=='up'){
			$(this.domObj).find(".dropdown-menu").each(function(){
				$(this).css("top",-4-$(this).outerHeight())
			})
		}
		var item = this;
		//注册清除按钮事件
		if(this.itemConfig.clearable)BootStrapFormItem.text.prototype.bindRemoveButton.call(this,40);
		FrontCommon.startItemListen($(this.domObj).find("input[type='text']")[0],function(oldValue,newValue){
			var control = $(item.domObj).find("input[type='text']");
			//修改了文本框中的内容，自动修改hidden的值
			$(item.domObj).find("input[type='hidden']:first").val(newValue);
			if(!item.itemConfig.remote){
				if(item.itemConfig.datas){
					//数据自动过滤
					item.itemConfig.filterDatas = [];
					for(var idx in item.itemConfig.datas){
						var dataValue = item.itemConfig.datas[idx][item.itemConfig["data-value"]];
						var dataLabel = item.itemConfig.datas[idx][item.itemConfig["data-label"]];
						if(dataLabel.toUpperCase().indexOf(newValue.toUpperCase())>-1){
							item.itemConfig.filterDatas.push(item.itemConfig.datas[idx]);
						}
					}
					//重新刷新数据
					item.buildSelectDatas();
					if(item.notShowMenu){
						item.notShowMenu = false;
					}else{
						$(item.domObj).find(".input-group-btn").removeClass("open").addClass("open");
					}
				}
			}else{
				item.getUrlDatas($.extend(item.itemConfig.urlParams,{remoteLimit:item.itemConfig.remoteLimit,searchKey:item.getValue()}));
				if(item.notShowMenu){
					item.notShowMenu = false;
				}else{
					$(item.domObj).find(".input-group-btn").removeClass("open").addClass("open");
				}
			}
			
			if(item.itemConfig.popDir=="auto"){
				var controlOffset = $(control).offset();
				//如果上面的空间大于下面的空间，那么往上弹出
				if(document.documentElement.clientHeight-(controlOffset.top-document.documentElement.scrollTop)<(controlOffset.top-document.documentElement.scrollTop)){
					controlOffset.top = controlOffset.top-4-$(formItemObj.domObj).find(".dropdown-menu").outerHeight()-document.documentElement.scrollTop;
				}else{
					controlOffset.top = controlOffset.top-document.documentElement.scrollTop+$(control).height()+2;
				}
				$(item.domObj).find(".dropdown-menu").css({"top":controlOffset.top+"px","left":controlOffset.left+"px"});
			}
		});//开启监听，自动过滤数据
		$(this.domObj).find("input[type='text']").bind("keydown",function(e){
			if(e.keyCode==9){
				$(item.domObj).find(".input-group-btn").removeClass("open");
				item.notShowMenu = true;
			}if(e.keyCode==38||e.keyCode==40){
				$(item.domObj).find(".dropdown-toggle").focus();
			}
		})
		if(!this.itemConfig.remote){
			//初始化数据
			if(this.itemConfig.datas){
				this.buildSelectDatas();
				this.datasAlready = true;
			}else if(this.itemConfig.url&&this.itemConfig.url!=""){
				item.getUrlDatas(item.itemConfig.urlParams);
			}
		}else{
			//远程调用
			item.getUrlDatas($.extend(item.itemConfig.urlParams,{remoteLimit:item.itemConfig.remoteLimit,searchKey:item.getValue()}));
		}
	}
	
	BootStrapFormItem.select.prototype.getUrlDatas = function(params){
		var item = this;
		this.datasAlready = false;
		$.ajax({
			url:item.itemConfig.url,
			type:'post',
			dataType:'json',
			data:params,
			success:function(data){
				var dataStr = "data";
				//获取url返回的数据，如果需要取data["?"]["?"]属性，则需要eval
				for(var idx in item.itemConfig.urlDataProp){
					dataStr += "[\""+item.itemConfig.urlDataProp[idx]+"\"]";
				}
				eval("item.itemConfig.datas = "+dataStr);
				item.itemConfig.filterDatas = null;
				item.datasAlready = true;
				item.buildSelectDatas();
			}
		})
	}
	
	BootStrapFormItem.select.prototype.setDatas = function(datas){
		this.itemConfig.datas = datas;
		this.itemConfig.filterDatas = null;
		this.clear(false);
		this.buildSelectDatas();
	}
	
	//生成下拉框数据
	BootStrapFormItem.select.prototype.buildSelectDatas = function(){
		//只能显示过滤出来的数据
		if(!this.itemConfig.filterDatas)this.itemConfig.filterDatas = this.itemConfig.datas;
		//先清空下拉列表
		$(this.domObj).find("ul:first").empty();
		for(var idx in this.itemConfig.filterDatas){
			if(parseInt(idx)<this.itemConfig.dataLimit||this.itemConfig.dataLimit==0){
				var dataValue = this.itemConfig.filterDatas[idx][this.itemConfig["data-value"]];
				var dataLabel = this.itemConfig.filterDatas[idx][this.itemConfig["data-label"]];
				this.buildOption(dataValue, dataLabel);
			}
		}
	}
	
	/**
	 * 生成数据选项
	 * @param dataValue 选项值
	 * @param dataLabel 选项标签
	 */
	BootStrapFormItem.select.prototype.buildOption = function(dataValue,dataLabel){
		var item = this;
		var obj = $("<li data-value=\""+dataValue+"\" style=\"position:relative;\"><a href=\"javascript:void(0)\" style=\"padding-right:30px;\">"+dataLabel+"</a></li>")
		.appendTo($(this.domObj).find("ul:first")).click(function(e){
			item.itemConfig.select(item,dataValue,dataLabel);
			if(item.itemConfig.multiple){//如果是多选
				var value = $(item.domObj).find("input[type='hidden']:first").val();
				var label = $(item.domObj).find("input[type='text']").val();
				if($(this).find(".glyphicon-ok").length>0){
					//取消选中
					$(this).find("i:first").remove();
					$(item.domObj).find("input[type='hidden']:first").val(value.replace(","+dataValue,"").replace(dataValue+",","").replace(dataValue,""));
					$(item.domObj).find("input[type='text']").val(label.replace(","+dataLabel,"").replace(dataLabel+",","").replace(dataLabel,""));
				}else{
					var flag = false;//定义一个变量，标识是否需要隐藏下拉列表
					if($(item.domObj).find("ul").is(":hidden")){//如果下拉列表是隐藏的，先显示，如果不这么做无法得到offsetTop
						$(item.domObj).find(".input-group-btn").removeClass("open").addClass("open");
						flag = true;//标识变量需要隐藏
					}
					$(this).append("<i class=\"glyphicon glyphicon-ok\" style=\"top:4px;position: absolute;right: 10px;color:orange;\"></i>");
					if(flag)$(item.domObj).find(".input-group-btn").removeClass("open");//隐藏下拉列表
					$(item.domObj).find("input[type='hidden']:first").val(value+(value==""?"":",")+dataValue);
					$(item.domObj).find("input[type='text']").val(label+(label==""?"":",")+dataLabel);
				}
				$(item.domObj).find("input[type='text']").attr("orgValue",$(item.domObj).find("input[type='text']").val());
				//阻止冒泡
				e.stopPropagation();
			}else{
				$(item.domObj).find("input[type='text']").val(dataLabel);
				$(item.domObj).find("input[type='hidden']:first").val(dataValue);
				//取消之前的选中
				if(item.selectItem)$(item.selectItem).find("i:first").remove();
				//标记选中
				var flag = false;//这里与多选下拉框一样
				if($(item.domObj).find("ul").is(":hidden")){
					$(item.domObj).find(".input-group-btn").removeClass("open").addClass("open");
					flag = true;
				}
				$(this).append("<i class=\"glyphicon glyphicon-ok\" style=\"top:4px;position: absolute;right: 10px;color:orange;\"></i>");
				if(flag)$(item.domObj).find(".input-group-btn").removeClass("open");
				item.selectItem = this;
				$(item.domObj).find("input[type='text']").attr("orgValue",dataLabel);//选中之后不因为值改变再显示下拉列表
				if($(item.domObj).find("ul:first").is(":hidden")){
					//阻止冒泡
					e.stopPropagation();
				}
			}
		}).find("a").attr("title",dataLabel);
		
		return obj;
	}
	
	/**
	 * 获取当前选中的数据
	 */
	BootStrapFormItem.select.prototype.getSelectData = function(){
		var item = this;
		var datas = [];
		$(this.domObj).find(".glyphicon-ok").each(function(){
			var value = $(this).parent().attr("data-value");
			for(var idx in item.itemConfig.datas){
				if(item.itemConfig.datas[idx][item.itemConfig["data-value"]]==value){
					datas.push(item.itemConfig.datas[idx]);
					break;
				}
			}
		})
		
		return datas;
	}
	
	/**
	 * 设置控件宽度函数，需要重写，需要计算输入框的宽度
	 * @param width
	 */
	BootStrapFormItem.select.prototype.setWidth = function(width){
		var controlWidth = typeof(width)=="number"?width-33+"px":(width.indexOf("px")>-1?parseInt(width.replace("px",""))-33:width);
		$(this.domObj).find("ul:first").css({"min-width":typeof(width)=="number"?width+"px":width});
		$(this.domObj).find("ul:first").css({"left":"-"+controlWidth});
		$(this.domObj).find("input[type='text']").css("width",controlWidth);
	}
	
	/**
	 * 清除下拉列表数据
	 * @param listShow 清空后是否显示下拉列表
	 */
	BootStrapFormItem.select.prototype.clear = function(listShow){
		$(this.domObj).find("input[type='hidden']:first").val("");
		$(this.domObj).find("input[type='text']").val("");
		var item = this;
		if(!listShow){
			$(this.domObj).find("input[type='text']").attr("orgValue","");//不因为值改变再显示下拉列表
			if(!this.itemConfig.remote){
				this.itemConfig.filterDatas = [];
				for(var idx in this.itemConfig.datas){
					this.itemConfig.filterDatas.push(this.itemConfig.datas[idx]);
				}
				//重新刷新数据
				this.buildSelectDatas();
			}else{
				this.getUrlDatas($.extend(item.itemConfig.urlParams,{remoteLimit:item.itemConfig.remoteLimit,searchKey:""}));
			}
		}
		$(this.domObj).find(".glyphicon-ok").remove();
	}
	
	/**
	 * 重写setvalue函数，
	 * 暂时先这样赋值，需要修改
	 * @param value
	 */
	BootStrapFormItem.select.prototype.setValue = function(value, callback, searchFlag){
		var item = this;
		if(this.datasAlready){//必须数据加载完成后，才能调用
			if(this.itemConfig.multiple){//多选，直接勾选对应的选项
				this.clear();
				for(var idx in this.itemConfig.datas){
					if((value+",").indexOf(this.itemConfig.datas[idx][this.itemConfig["data-value"]]+",")>-1){
						$(this.domObj).find("li[data-value='"+this.itemConfig.datas[idx][this.itemConfig["data-value"]]+"']").click();
					}
				}
			}else{//单选或搜索类型
				var flag = false;
				for(var idx in this.itemConfig.datas){
					if(this.itemConfig.datas[idx][this.itemConfig["data-value"]]==value){
						//如果能找到这个选项
						if($(this.domObj).find("li[data-value='"+value+"']").length>0){
							$(this.domObj).find("li[data-value='"+value+"']").click();
						}else{
							//不能找到则需要build
							var obj = this.buildOption(this.itemConfig.datas[idx][this.itemConfig["data-value"]],
										this.itemConfig.datas[idx][this.itemConfig["data-label"]]);
							obj.click();
						}
						flag = true;
						break;
					}
				}
				if(!flag){//如果datas中找不到这个值，value和label都设置成这个值
					$(this.domObj).find("input[type='hidden']:first").val(value);
					$(this.domObj).find("input[type='text']").val(value);
					if(!searchFlag)$(this.domObj).find("input[type='text']").attr("orgValue",value);//不因为值改变再显示下拉列表
					$(this.domObj).find(".glyphicon-ok").remove();
				}
			}
			if(callback && typeof(callback)=='function')callback.call(this);
		}else{
			setTimeout(function(){
				item.setValue(value, callback, searchFlag);
			}, 500)
		}
	}
	
	//声明bootstrap tree
	BootStrapFormItem.tree = function(itemConfig){
		FrontCommon.FormItem.call(this,itemConfig);
		this.itemConfig = $.extend({
			dropmenuWidth:"auto",
			url:'',//树控件的数据来源,
			nodes:null,
			popDir:'down',
			popVerticalDir:'left',
			"urlParams":{},
			"urlDataProp":[],//访问url带来的数据时，需要访问的属性数组
			jsonFormatOut:false,//是否以json格式输出选中的树节点，必须配合ztree的checkboxType.Y = 'ps' or 'p'，否则无效
			treeSetting:{
				callback: {
					onClick:null,
					onCheck:null
				}
			}
		},this.itemConfig);
		this.itemConfig.treeSetting = $.extend({callback:{onClick:null,onCheck:null}},this.itemConfig.treeSetting);
	}
	
	//次句代码申明继承FrontCommon.FormItem
	BootStrapFormItem.tree.prototype = new FrontCommon.FormItem();
	
	BootStrapFormItem.tree.prototype.getDomHtml = function(){
		//文本框的宽度，需要减去下拉按钮的宽度
		this.dropmenuWidth = typeof(this.itemConfig.dropmenuWidth)=='number'?(this.itemConfig.dropmenuWidth-33)+"px":this.itemConfig.dropmenuWidth;
		this.controlWidth = typeof(this.itemConfig.width)=='number'?(this.itemConfig.width-33)+"px":this.itemConfig.width;
		this.height = this.itemConfig.height?(typeof(this.itemConfig.height)=="number"?this.itemConfig.height+"px":this.itemConfig.height):"200px";
		var html = "<div class=\"input-group\"><input autocomplete=\"off\" type=\"text\""+(this.itemConfig.readOnly?" readOnly":"")+" name=\""+this.itemConfig.name+"Tree\""+
				   " class=\"form-control"+(" "+this.itemConfig.cls)+"\" style=\"background-color:#fff;width:"+this.controlWidth+";"+this.itemConfig.style+"\" placeholder=\""+this.itemConfig.placeholder+"\" />";
		html += "<input type=\"hidden\" id=\""+this.itemConfig.id+"\" name=\""+this.itemConfig.name+"\"/>";
		html += "<div class=\"input-group-btn\" style=\"width:auto;\">";
		html += "<button type=\"button\" style=\"\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\" aria-haspopup=\"true\" aria-expanded=\"false\"><span class=\"iconfont icon-shaixuan\"></span></button>";
		html += "<ul id=\""+this.itemConfig.id+"treeContainer\" class=\"tree-menu ztree\" style=\"width:"+this.dropmenuWidth+";"+(this.itemConfig.popVerticalDir=="left"?"left:-"+this.controlWidth:"right:0px")+";height:"+this.height+";overflow:auto;min-width:"+this.width+";\">";
		html += "</ul></div></div>";
		return html;
	}
	
	BootStrapFormItem.tree.prototype.setPopDir = function(popDir){
		if(popDir=='up'){
			$(this.domObj).find(".tree-menu").each(function(){
				$(this).css("top",-4-$(this).outerHeight())
			})
		}else if(popDir=="down"){
			$(this.domObj).find(".tree-menu").each(function(){
				$(this).css("top","100%");
			})
		}
	}
	
	//重写下拉组合tree的appendTo
	BootStrapFormItem.tree.prototype.appendTo = function(container){
		var item = this;
		FrontCommon.FormItem.prototype.appendTo.call(this,container);
		setTimeout(function(){
			item.controlWidth = typeof(item.itemConfig.width)=='number'?(item.itemConfig.width-$(item.domObj).find(".btn").outerWidth()+1)+"px":item.itemConfig.width;
			item.getTargetControl().style.width = item.controlWidth;
			$(item.domObj).find("ul.tree-menu").css({"left":"-"+item.controlWidth});
		}, 100);
		if(this.itemConfig.popDir=="auto"){
			var control = item.getTargetControl();
			var obj = $(control).offset();
			//如果上面的空间大于下面的空间，那么往上弹出
			if(document.documentElement.clientHeight-obj.top<obj.top){
				obj.top = obj.top-4-$(this.domObj).find(".tree-menu").outerHeight();
			}else{
				obj.top = obj.top+$(control).height()+2;
			}
			$(this.domObj).find(".tree-menu").css({"position":"fixed","top":obj.top+"px","left":obj.left+"px"});
			$(this.domObj).find("button").click(function(){
				var controlOffset = $(control).offset();
				//如果上面的空间大于下面的空间，那么往上弹出
				if(document.documentElement.clientHeight-(controlOffset.top-document.documentElement.scrollTop)<(controlOffset.top-document.documentElement.scrollTop)){
					controlOffset.top = controlOffset.top-4-$(item.domObj).find(".tree-menu").outerHeight()-document.documentElement.scrollTop;
				}else{
					controlOffset.top = controlOffset.top-document.documentElement.scrollTop+$(control).height()+2;
				}
				$(item.domObj).find(".tree-menu").css({"top":controlOffset.top+"px","left":controlOffset.left+"px"});
			});
		}else if(this.itemConfig.popDir=='up'){
			$(this.domObj).find(".tree-menu").each(function(){
				$(this).css("top",-4-$(this).outerHeight())
			})
		}
		//注册移除按钮相关事件
		if(this.itemConfig.clearable)BootStrapFormItem.text.prototype.bindRemoveButton.call(this,40);
		
		var treeContainer = $(this.domObj).find("ul:first")[0];
		$(treeContainer).click(function(e){
			e.stopPropagation();//禁止冒泡上去，避免点击树节点，自动关闭了弹层
		})
		
		$(this.domObj).find("input[type='text']").keydown(function(e){
			//禁止按键
			e.preventDefault();
		})
		
		//合并用户自定义的onClick，为了给treeFormItem添加默认勾选设置值函数
		var userOnClick = this.itemConfig.treeSetting.callback.onClick;//获取用户自定义的onClick
		this.itemConfig.treeSetting.callback.onClick = function(event, treeId, treeNode, clickFlag){
			if(!item.treeObj.ztree.setting.check.enable){//单选模式，自动赋值
				$(item.domObj).find("input[type='text']").val(item.treeObj.getText());
				$(item.domObj).find("input[type='hidden']:first").val(item.treeObj.getValue());
				$(item.domObj).find("button:first").click();//隐藏下拉树
			}
			//这里是用户自定义的onClick事件
			if(userOnClick)userOnClick(event, treeId, treeNode, clickFlag);
		}
		
		var userOnCheck = this.itemConfig.treeSetting.callback.onCheck;//获取用户自定义的onCheck
		this.itemConfig.treeSetting.callback.onCheck = function(event, treeId, treeNode){
			//自动赋值到文本框
			$(item.domObj).find("input[type='text']").val(item.treeObj.getText());
			$(item.domObj).find("input[type='hidden']:first").val(item.treeObj.getValue());
			//这里是用户自定义的onClick事件
			if(userOnCheck)userOnCheck(event, treeId, treeNode);
		}
		
		//初始化树对象
		this.treeObj = new BootStrapTree($.extend({container:treeContainer},this.itemConfig));
	}
	
	BootStrapFormItem.tree.prototype.clear = function(){
		FrontCommon.FormItem.prototype.clear.call(this);
		$(this.domObj).find("input[type='text']").val("");
		//清除选中的节点
		if(this.treeObj){
			//如果生成了ztree对象才能取消选中
			this.treeObj.clear();
		}
	}
	
	BootStrapFormItem.tree.prototype.setWidth = function(width){
		BootStrapFormItem.select.prototype.setWidth.call(this,width)
	}
	
	BootStrapFormItem.tree.prototype.refresh = function(nodes){
		this.clear();
		this.treeObj.refresh(nodes);
	}
	
	BootStrapFormItem.tree.prototype.setValue = function(valObj, callback){
		var item = this;
		if(this.treeObj.datasAlready){
			this.treeObj.setValue(valObj);
			if(!this.treeObj.ztree.setting.check.enable){
				$(this.domObj).find("input[type='text']").val(this.treeObj.getText());
				$(this.domObj).find("input[type='hidden']:first").val(this.treeObj.getValue());
			}
			if(callback && typeof(callback)=='function')callback.call(this);
		}else{
			setTimeout(function(){
				item.setValue(valObj, callback);
			}, 500);
		}
	}
	
})(window,jQuery)