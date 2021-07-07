(function(window,$){
	window.FrontCommon = new Object();
	
	FrontCommon.listenInterval = 500;//监听间隔，毫秒
	
	FrontCommon.uiType = 'BootStrap';//默认解析的控件类型，BootStrap
	
	Array.prototype.indexOf = function(obj){
		for(var idx in this){
			if(obj==this[idx])return idx;
		}
		return -1;
	}
	
	FrontCommon.getTop = function(){
		if(top.getSessionUserObj){
			return top;
		}else if(top.opener){
			return top.opener.top;
		}else{
			return top;
		}
	}
	
	FrontCommon.getDateForStr = function(format,str,dateObj){
		var returnDate = new Date();
		if(dateObj)returnDate.setTime(dateObj.getTime());
		var yearMatchArr = format.match(/y{1,4}/ig);
		if(yearMatchArr){
			yearStr = yearMatchArr[0];
			var index = format.indexOf(yearStr);
			if(index<str.length)returnDate.setFullYear(parseInt(str.substring(format.indexOf(yearStr),format.indexOf(yearStr)+yearStr.length)));
		}
		var monthMatchArr = format.match(/M{1,2}/g);
		if(monthMatchArr){
			monthStr = monthMatchArr[0];
			var index = format.indexOf(monthStr);
			if(index<str.length)returnDate.setMonth(parseInt(str.substring(format.indexOf(monthStr),format.indexOf(monthStr)+monthStr.length))-1);
		}
		var dateMatchArr = format.match(/d{1,2}/g);
		if(dateMatchArr){
			dateStr = dateMatchArr[0];
			var index = format.indexOf(dateStr);
			if(index<str.length)returnDate.setDate(parseInt(str.substring(format.indexOf(dateStr),format.indexOf(dateStr)+dateStr.length)));
		}
		var hourMatchArr = format.match(/h{1,2}/ig);
		if(hourMatchArr){
			hourStr = hourMatchArr[0];
			var index = format.indexOf(hourStr);
			if(index<str.length)returnDate.setHours(parseInt(str.substring(format.indexOf(hourStr),format.indexOf(hourStr)+hourStr.length)));
		}
		var minuteMatchArr = format.match(/m{1,2}/g);
		if(minuteMatchArr){
			minuteStr = minuteMatchArr[0];
			var index = format.indexOf(minuteStr);
			if(index<str.length)returnDate.setMinutes(parseInt(str.substring(format.indexOf(minuteStr),format.indexOf(minuteStr)+minuteStr.length)));
		}
		var secondMatchArr = format.match(/s{1,2}/g);
		if(secondMatchArr){
			secondStr = secondMatchArr[0];
			var index = format.indexOf(secondStr);
			if(index<str.length)returnDate.setSeconds(parseInt(str.substring(format.indexOf(secondStr),format.indexOf(secondStr)+secondStr.length)));
		}
		return returnDate;
		
	}
	
	/*
	 * 添加（escape）编码的数据到本地cookie
	 */
	FrontCommon.addCookie = function(name,value,expireHours){
	     var cookieString=name+"="+escape(value);
	     //判断是否设置过期时间
	     if(expireHours>0){
	            var date=new Date();
	            date.setTime(date.getTime()+expireHours*3600*1000);
	            cookieString=cookieString+"; path=/; expires="+date.toGMTString();
	     }else{
	    	 cookieString=cookieString+"; path=/";
	     }
	     document.cookie=cookieString;
	}

	FrontCommon.getCookie = function(objName){
		var arrStr = document.cookie.split("; ");
		for (var i = 0; i < arrStr.length; i++) {
			var temp = arrStr[i].split("=");
			if (temp[0] == objName)
				return unescape(temp[1]);
		}
	}
	
	FrontCommon.startRealityWSConn = function(callback){
		var websocket = null;
		FrontCommon.addCookie("socketType", "1", 0);
		FrontCommon.request(FrontCommon.contextPath+"/getSystemHost.json",{},function(data){
			var host = data["result"].split("|")[0];
			var port = data["result"].split("|")[1];
			var connectParam = "username="+FrontCommon.getCookie('username')+"&token="+FrontCommon.getCookie('token')+"&type=1&socketType=1";
			if ('WebSocket' in window) {
				websocket = new WebSocket("ws://" + host+":"+port+FrontCommon.contextPath+"/websocket");
			} else if ('MozWebSocket' in window) {
				websocket = new MozWebSocket("ws://" + host+":"+port+FrontCommon.contextPath+"/websocket");
			} else {
				websocket = new SockJS("http://" + host+":"+port+FrontCommon.contextPath + "/websocket/sockjs");
			}
			
			if(callback){callback.call(websocket)}
		})
	}

	FrontCommon.getDateStr = function(format,date){
		var returnStr = format;
		var yearMatchArr = returnStr.match(/y{1,4}/ig);
		if(yearMatchArr){
			yearStr = yearMatchArr[0];
			returnStr = returnStr.replace(yearStr,(date.getFullYear()+"").substring(4-yearStr.length)+"");
		}
		returnStr = returnStr.replace(/M{1,2}/g,date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1+"");
		returnStr = returnStr.replace(/d{1,2}/ig,date.getDate() < 10 ? "0"+date.getDate() : date.getDate()+"");
		
		returnStr = returnStr.replace(/m{1,2}/g,date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()+"");
		returnStr = returnStr.replace(/h{1,2}/ig,date.getHours() < 10 ? "0"+date.getHours() : date.getHours()+"");
		returnStr = returnStr.replace(/s{1,2}/ig,date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()+"");
		
		return returnStr;
	}
	
	var getContextPath = function(url){
		var contextPath = "http://localhost:8080/BootStrap_Frontend/";
		return contextPath;
	}
	
	FrontCommon.contextPath = top==window?getContextPath(window.contextPathUrl):top.FrontCommon.contextPath;
	
	FrontCommon.loadcss = function(path){
		$("<link rel=\"stylesheet\" href='"+path+"'/>")
				.appendTo($(document.head));
	}
	
	FrontCommon.loadScript = function(path,callback){
		$.getScript(path,callback);
	}
	
	
	FrontCommon.loadcss(FrontCommon.contextPath+"/resource/plug/font-awesome-4.7.0/css/font-awesome.min.css");
	FrontCommon.loadcss(FrontCommon.contextPath+"/resource/plug/sys_font_icon/iconfont.css");
	/**
	 * 工具方法，给控件添加监听事件
	 */
	FrontCommon.startItemListen = function(control,callback){
		if(typeof(control)=='string'){
			control = document.getElementById(control);
		}
		if(!$(control).attr("orgValue"))$(control).attr("orgValue","");
		//如果值有改变，触发相应事件
		if($(control).attr("orgValue")!=control.value){
			callback($(control).attr("orgValue"),control.value);
			$(control).attr("orgValue",control.value);
		}
		
		setTimeout(function(){FrontCommon.startItemListen(control,callback)}, FrontCommon.listenInterval);
	}
	
	/**
	 * 声明前台框架，form表单的构造函数
	 */
	FrontCommon.Form = function(formConfig){
		//首先获取表单的配置对象
		this.formConfig = $.extend({//默认对象
			id:'',//表单id
			name:'',//表单name
			action:'',//表单提交的action url
			method: 'post',
			target:'',
			items: 4,//表单一行能容纳的控件个数，默认一行4个
			cls:'common_form',//表单的css class，默认common_form
			container: null,
			uiType:'BootStrap',//默认使用的ui类型BootStrap
			submitType:'ajax',//默认提交方式：ajax，提交类型ajax，http
			sourceUrl:'',//form表单数据来源url
			sourceData:undefined,//form表单数据来源，默认undefined
			sourceUrlParams:{},//数据源url参数
			sourceUrlDataProp:[],//url数据来源data后面的参数data['datas']['user']，那么就是['data','user']
			submitCodeProp:['code','code'],
			submitMsgProp:['code','msg']
		},formConfig);
		//添加到对应容器中
		if(this.formConfig.container)this.appendTo(this.formConfig.container);
	}
	
	/**
	 * 生成form的dom对象到对应的container中
	 */
	FrontCommon.Form.prototype.appendTo = function(container){
		//生成form html
		this.domHtml = "<form id=\""+this.formConfig.id+"\" name=\""+this.formConfig.name+"\""+
		  " action=\""+this.formConfig.action+"\" target=\""+this.formConfig.target+"\""+
		  " method=\""+this.formConfig.method+"\" class=\""+this.formConfig.cls+"\">"+
		  "<table><tbody></tbody></table></form>";
		if(typeof(container)=="string"){
			container = document.getElementById(container);
		}
		this.domObj = $(this.domHtml).appendTo(container)[0];
		this.totalcolspan = 0;
		this.items = [];
	}
	
	/**
	 * 提交form
	 * callback 提交后的回调
	 */
	FrontCommon.Form.prototype.submit = function(callback,nomessage){
		var formObj = this;
		if(this.formConfig.submitType=="ajax"){
			$.ajax({
				url:formObj.formConfig.action,
				type:formObj.formConfig.method,
				dataType:'json',
				data:formObj.getFormData(),
				success:function(data){
					var code = eval("data[\""+formObj.formConfig.submitCodeProp.join("\"][\"")+"\"]");
					var msg = eval("data[\""+formObj.formConfig.submitMsgProp.join("\"][\"")+"\"]");
					if(!nomessage){
						if(code==0){
							top.FrontCommon.success(msg);
						}else{
							top.FrontCommon.error(msg);
						}
					}
					if(callback)callback(data);
				},error:function(){
					FrontCommon.error('系统错误请联系管理员！');
				}
			})
		}else{
			//暂时先这样
			formObj.domObj.submit();
		}
	}
	
	/**
	 * 清空form的所有控件值
	 * @extendFunc 扩展函数，clear的时候可以选择清除其他的控件值
	 */
	FrontCommon.Form.prototype.clear = function(extendFunc){
		for(var idx in this.items){
			this.items[idx].clear();
		}
		if(extendFunc)extendFunc(this);
	}
	
	FrontCommon.Form.prototype.add = function(item){
		if(item instanceof FrontCommon.FormItem){
		}else{
			//如果item不是FormItem对象
			//需要new出该对象
			item = $.extend({uiType:this.formConfig.uiType},item);//默认使用的控件类型，与表单定义的控件类型一致
			item = FrontCommon.newFormItem(item);
		}
		//开始进行表单添加
		if(this.domObj){
			item.relateForm = this;
			if(item.itemConfig.type=="hidden"){
				item.appendTo($(this.domObj));
			}else{
				var tb = $(this.domObj).find("tbody:first");
				if(tb.length>0){
					var lastRow = tb.find("tr:last");
					if(this.totalcolspan%this.formConfig.items==0){
						//需要重新创立行
						lastRow = $("<tr></tr>").appendTo(tb);
					}
					//首先添加表单说明td，
					$("<td class=\""+item.itemConfig.labelClass+"\">&nbsp;&nbsp;&nbsp;"+
							(item.itemConfig.required?"<font color='red'>*</font>":"&nbsp;")+item.itemConfig.text+"：</td>").
							appendTo(lastRow);
					//添加控件td
					item.appendTo($("<td colspan=\""+(item.itemConfig.colspan*2-1)+"\"></td>").appendTo(lastRow));
				}
			}
			this.items.push(item);
			this.totalcolspan += item.itemConfig.colspan;
		}else{
			alert("未定义表单："+this.formConfig.id+"添加到哪个容器！");
		}
	}
	
	FrontCommon.Form.prototype.getFormItemByName = function(name){
		for(var idx in this.items){
			if(this.items[idx].itemConfig.name==name){
				return this.items[idx];
			}
		}
	}
	
	FrontCommon.Form.prototype.getFormItemById = function(id){
		for(var idx in this.items){
			if(this.items[idx].itemConfig.id==id){
				return this.items[idx];
			}
		}
	}
	
	FrontCommon.Form.prototype.getFormItemByIndex = function(idx){
		return this.items[idx];
	}
	
	FrontCommon.Form.prototype.valid = function(noMsg){
		for(var idx in this.items){
			var valid =  this.items[idx].valid(noMsg);
			if(!valid)return false;
		}
		
		return true;
	}
	
	/**
	 * form数据初始化
	 * 用户配置了form的sourceData或者url
	 */
	FrontCommon.Form.prototype.initData = function(data){
		var form = this;
		if(data){
			this.setSourceData(data);
		}else if(this.formConfig.sourceData){
			this.setSourceData(this.formConfig.sourceData);
		}else if(this.formConfig.sourceUrl){
			$.ajax({
				url: form.formConfig.sourceUrl,
				dataType: 'json',
				type: 'post',
				data: form.formConfig.sourceUrlParams,
				success: function(data){
					var str = "var sourceData = data";
					for(var idx in form.formConfig.sourceUrlDataProp){
						str += "['"+form.formConfig.sourceUrlDataProp[idx]+"']";
					}
					eval(str);
					form.setSourceData(sourceData);
				}
			})
		}
	}
	
	/**
	 * 设置form表单的值
	 */
	FrontCommon.Form.prototype.setSourceData = function(sourceData){
		for(var idx in this.items){
			if(sourceData[this.items[idx].itemConfig.name]||sourceData[this.items[idx].itemConfig.name]==0){
				//如果数据源对应的表单项有值，那么设置
				this.items[idx].setValue(sourceData[this.items[idx].itemConfig.name]);
			}else{//否则清空
				this.items[idx].clear();
			}
		}
	}
	
	/**
	 * 获取表单所有的表单项数据，以json格式输出
	 */
	FrontCommon.Form.prototype.getFormData = function(){
		var returnObj = {};
		for(var idx in this.items){
			returnObj[this.items[idx].itemConfig.name] = this.items[idx].getValue();
		}
		
		return returnObj;
	}
	
	/**
	 * FormItem公用父类，
	 * @param itemConfig 表单项配置对象，这里列出了表单项的公用属性，如果是子类对象独有属性，请在子类构造函数中申明
	 * FormItem几个关键函数，appendTo(container):指定表单项添加到那个容器中，不同的控件可能不同
	 * setValue:给表单项设置值，该函数必须在appendTo调用之后才有用
	 * @returns {FrontCommon.FormItem}
	 */
	FrontCommon.FormItem = function(itemConfig){
		this.itemConfig = $.extend(true,{
			id:'',
			name:'',
			text:'',
			width:200,
			placeholder:"",
			readOnly:false,//是否只读
			required:false,//是否必填
			colspan: 1,//占用表单项个数
			labelClass: 'fc_label',//对应的表单项说明的td样式
			type: '',
			uiType:'',
			cls:'',//自定义的样式class
			style:'',//强制自定义样式
			change:null,//控件值改变事件
			validateType:undefined,//可以是pattern既正则表达式，number数字,float可以带小数点,custom自定义
			messageRequired:undefined,//验证后如果值不允许为空错误提示的信息
			messageNumber:undefined,//验证后如果值为非数字错误提示的信息
			messageFloat:undefined,
			messagePattern:undefined,
			isshow: true,
			pattern:null,//正则表达式
			customValidate:function(val){
				return true;
			},
			clearable:true,
			disabled:false,
			value:'',//默认值
			maxlength:'',//最大字符长度			
			click:null//点击事件
		},itemConfig);//itemConfig必须使用深度复制，否则可能会修改源数据
		//隐藏域，占用表单项数为0
		if(this.itemConfig.type=="hidden")this.itemConfig.colspan=0;
		this.width = typeof(this.itemConfig.width)=='number'?this.itemConfig.width+"px":this.itemConfig.width;
	}
	
	FrontCommon.FormItem.prototype.getTargetControl = function(){
		var control = null;
		if($(this.domObj).attr("type")==this.itemConfig.type){
			control = $(this.domObj)[0];
		}else{
			control = $(this.domObj).find("[type='text'],[type='"+this.itemConfig.type+"']")[0];
		}
		
		return control;
	}
	
	FrontCommon.FormItem.prototype.valid = function(noMsg){
		var control = this.getTargetControl();
		if(this.itemConfig.selectDataRequired&&$.trim(this.getValue())!=""){//没有选中任何选项且值不是空的
			if(this.getSelectData().length==0){
				var content = this.itemConfig.selectDataRequiredMesage&&this.itemConfig.selectDataRequiredMesage!=''?
				this.itemConfig.selectDataRequiredMesage:"请选择一个选项！";
				this.messageContent = content;
				if(!noMsg){
					setTimeout(function(){
						$(control).focus();
						var obj = $(control).offset();
						obj.top = obj.top+$(control).height();
						obj.content = content;
						FrontCommon.showTip(obj);
						$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
					}, 200);
				}
				return false;
			}
		}
		if(this.itemConfig.required&&$.trim(this.getValue())==""){
			//$(control).focus();
			var content = this.itemConfig.messageRequired&&this.itemConfig.messageRequired!=''?
					this.itemConfig.messageRequired:this.itemConfig.text+"不能为空！";
			this.messageContent = content;
			if(!noMsg){
				setTimeout(function(){
					$(control).focus();
					var obj = $(control).offset();
					obj.top = obj.top+$(control).height();
					obj.content = content;
					FrontCommon.showTip(obj);
					$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
				}, 200);
			}
			return false;
		}
		if(this.itemConfig.validateType=='number'&&!/^[\d+]{1,}$/.test(this.getValue())&&$.trim(this.getValue())!=""){
			var content = this.itemConfig.messageNumber&&this.itemConfig.messageNumber!=''?
					this.itemConfig.messageNumber:this.itemConfig.text+"必须为数字！";
			this.messageContent = content;
			if(!noMsg){
				$(control).focus();
				setTimeout(function(){
					var obj = $(control).offset();
					obj.top = obj.top+$(control).height();
					obj.content = content;
					FrontCommon.showTip(obj);
					$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
				}, 200);
			}
			return false;
		}else if(this.itemConfig.validateType=='float'&&!/^[\d+]{1,}(\.)[\d]{1,}$/.test(this.getValue())&&$.trim(this.getValue())!=""){
			var content = this.itemConfig.messageFloat&&this.itemConfig.messageFloat!=''?
					this.itemConfig.messageFloat:this.itemConfig.text+"必须为小数！";
			this.messageContent = content;
			if(!noMsg){
				$(control).focus();
				setTimeout(function(){
					var obj = $(control).offset();
					obj.top = obj.top+$(control).height();
					obj.content = content;
					FrontCommon.showTip(obj);
					$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
				}, 200);
			}
			return false;
		}else if(this.itemConfig.validateType=='pattern'&&$.trim(this.getValue())!=""){
			var regex = new RegExp(this.itemConfig.pattern);
			if(!regex.test(this.getValue())){
				var content = this.itemConfig.messagePattern&&this.itemConfig.messagePattern!=''?
						this.itemConfig.messagePattern:this.itemConfig.text+"格式不正确！";
				this.messageContent = content;
				if(!noMsg){
					$(control).focus();
					setTimeout(function(){
						var obj = $(control).offset();
						obj.top = obj.top+$(control).height();
						obj.content = content;
						FrontCommon.showTip(obj);
						$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
					}, 200);
				}
				return false;
			}
		}else if(this.itemConfig.validateType=='custom'){
			var validateObj = this.itemConfig.customValidate(this.getValue(),this);
			if(typeof(validateObj)=='string'){//如果用户返回了一串文字，说明不通过
				var content = validateObj;
				this.messageContent = content;
				if(!noMsg){
					$(control).focus();
					setTimeout(function(){
						var obj = $(control).offset();
						obj.top = obj.top+$(control).height();
						obj.content = content;
						FrontCommon.showTip(obj);
						$(FrontCommonToolTip.domObj).find("input[type='text']").focus();
					}, 200);
				}
				return false;
			}
		}
		
		return true;
	}
	
	FrontCommon.FormItem.prototype.setWidth = function(width){
		//通用的设置表单宽度函数
		this.domObj.style.width = typeof(width)=="number"?width+"px":width;
	}
	
	FrontCommon.FormItem.prototype.setValue = function(val, callback){
		//通用的设置表单值数据函数
		if($(this.domObj).attr("name")==this.itemConfig.name){
			return $(this.domObj).val(val);
		}else{
			return $(this.domObj).find("[name='"+this.itemConfig.name+"']").val(val);
		}
		
		if(callback && typeof(callback) == 'function')callback.call(this);
	}
	
	FrontCommon.FormItem.prototype.getValue = function(){
		//通用的获取表单项值
		if($(this.domObj).attr("name")==this.itemConfig.name){
			return $(this.domObj).val();
		}else{
			return $(this.domObj).find("[name='"+this.itemConfig.name+"']").val();
		}
	}
	
	FrontCommon.FormItem.prototype.clear = function(val){
		//通用的设置表单宽度函数
		if($(this.domObj).attr("name")==this.itemConfig.name){
			return $(this.domObj).val("");
		}else{
			return $(this.domObj).find("[name='"+this.itemConfig.name+"']").val("");
		}
	}
	
	FrontCommon.FormItem.prototype.setDisabled = function(){
		if($(this.domObj).attr("name")==this.itemConfig.name){
			$(this.domObj).css({"background-color":"rgba(192,192,192,.5)"}).attr("disabled","disabled");
		}else{
			$(this.domObj).find("input,button").css({"background-color":"rgba(192,192,192,.5)"}).attr("disabled","disabled");
		}
	}	
	
	FrontCommon.FormItem.prototype.setEnabled = function(){
		if($(this.domObj).attr("name")==this.itemConfig.name){
			$(this.domObj).css({"background-color":"#fff"}).removeAttr("disabled");
		}else{
			$(this.domObj).find("input,button").css({"background-color":"#fff"}).removeAttr("disabled");
		}
	}	
	
	/**
	 * 显示控件
	 */
	FrontCommon.FormItem.prototype.show = function(){
		$(this.domObj).show();
	}	
	
	/**
	 * 隐藏控件
	 */
	FrontCommon.FormItem.prototype.hide = function(){
		$(this.domObj).hide();
	}	
	
	//添加到dom容器中
	FrontCommon.FormItem.prototype.appendTo = function(container){
		this.domHtml = this.getDomHtml();
		if(typeof(container)=="string"){
			container = document.getElementById(container);
		}
		this.domObj = $(this.domHtml).appendTo(container)[0];
		//添加控件的change事件
		//直接给控件添加监听
		var control = null;
		if($(this.domObj).attr("name")==this.itemConfig.name){
			control = $(this.domObj)[0];
		}else{
			control = $(this.domObj).find("[name='"+this.itemConfig.name+"']")[0];
		}
		var item = this;
		if(this.itemConfig.change){//触发change事件
			FrontCommon.startItemListen(control,function(oldValue,newValue){
				item.itemConfig.change.call(item,oldValue,newValue);
			});
		}
		if(this.itemConfig.click){//绑定点击事件
			$(control).click(function(e){
				item.itemConfig.click.call(item,e,this);
			})
		}
		if(this.itemConfig.value&&$.trim(this.itemConfig.value!='')){
			this.setValue(this.itemConfig.value);
		}
		if(this.itemConfig.disabled){//控件设置了禁用
			this.setDisabled();
		}
		if(!this.itemConfig.isshow){//控件设置了默认不显示
			this.hide();
		}
	}
	
	FrontCommon.newFormItem = function(itemConfig){
		itemConfig = $.extend({uiType:FrontCommon.uiType},itemConfig);//这里默认使用FrontCommon的默认ui对象
		var item = eval("new "+itemConfig.uiType+"FormItem."+itemConfig.type+"(itemConfig)");
		return item;
	}
	
	/**
	 * 警告消息提示
	 */
	FrontCommon.warning = function(message,title){
		eval(FrontCommon.uiType+"Message.warning(message,title)");
	}
	
	/**
	 * 成功消息提示
	 */
	FrontCommon.success = function(message,title){
		eval(FrontCommon.uiType+"Message.success(message,title)");
	}
	
	/**
	 * 普通消息提示
	 */
	FrontCommon.info = function(message,title){
		eval(FrontCommon.uiType+"Message.info(message,title)");
	}
	
	/**
	 * 失败消息提示
	 */
	FrontCommon.error = function(message,title){
		eval(FrontCommon.uiType+"Message.error(message,title)");
	}
	
	/**
	 * 确认提示框弹出
	 */
	FrontCommon.confirm = function(message,title,callback,dialogConfig){
		var maxHeight = document.documentElement.clientHeight-150;
		var dialog = FrontCommon.showDialog($.extend({
			title:title?title:"系统提示",
			width:400,
			customeCls:'confirmDialog',
			content:"<div style='padding:10px 15px;font-size:16px;max-height:"+maxHeight+"px;overflow:auto;'>"+
			""+message+"</div>",
			success:function(){
				$(this.domObj).show();
				var height = (document.documentElement.clientHeight-$(this.domObj).find(".modal-dialog").outerHeight())/2;
				$(this.domObj).hide();
				$(this.domObj).find(".modal-dialog").css({"margin-top":height+"px"});
			},
			buttons:[{icon:'check',text:"确定",click:function(){
				if(callback)callback(true);
				FrontCommon.closeDialog(dialog);
			}},{icon:'power-off',text:'取消',type:'default',click:function(){
				if(callback)callback(false);
				FrontCommon.closeDialog(dialog);
			}}]
		},dialogConfig));
	}
	
	/**
	 * 打开弹窗
	 * @param config
	 * @returns
	 */
	FrontCommon.showDialog = function(config){
		this.config = $.extend({
			width:600,//弹窗的宽度
			height:'auto',//弹窗的高度
			title:"",//弹窗标题
			content:"",//弹窗的内容
			buttons:[],//弹窗按钮，按钮配置对象{icon:'',type:'default|primary|success|info|warning',click:'function(){}|close'}
			success:function(){//加载成功事件
				
			}
		},config)
		eval("var dialog = new "+FrontCommon.uiType+"Dialog(this.config)");
		
		dialog.open();
		
		return dialog;
	}
	
	FrontCommon.showLoading = function(){
		if(!window.loadingDomObj){
			window.loadingDomObj = $("<div loadcount=0 class=\"modal-backdrop\" style=\"display:block;opacity:1;background: transparent;\">"+
					"<div style=\"text-align: center;height:100%;width:100%;\">"+
					"<img src=\""+FrontCommon.contextPath+"/resource/images/loading-0.gif\" style=\"margin-top:20%\"/>"+
			"</div></div>").appendTo($(document.body))[0];
		}
		$(window.loadingDomObj).attr("loadcount",parseInt($(window.loadingDomObj).attr("loadcount"))+1).show();
	}
	
	FrontCommon.hideLoading = function(){
		if(window.loadingDomObj){
			if($(window.loadingDomObj).attr("loadcount")>0){
				$(window.loadingDomObj).attr("loadcount",parseInt($(window.loadingDomObj).attr("loadcount"))-1);
			}
			if($(window.loadingDomObj).attr("loadcount")==0)$(window.loadingDomObj).hide();
		}
	}
	
	FrontCommon.showLoadingPage = function(){
		if(!window.loadingDomObjPage){
			window.loadingDomObjPage = $("<div loadcount=0 style=\"z-index:1000000;background:#000;display:block;position:fixed;top:0px;left:0px;\"></div>").appendTo($(document.body))[0];
			$(window.loadingDomObjPage).css({"width":document.documentElement.clientWidth+"px","height":document.documentElement.clientHeight+"px"});
			$("<iframe frameborder=\"0\" style=\"width:100%;height:100%;\" src=\""+FrontCommon.contextPath+"/resource/plug/html5-canvas-shine-loading/index.html\"></iframe>").appendTo($(window.loadingDomObjPage));
		}
		$(window.loadingDomObjPage).attr("loadcount",parseInt($(window.loadingDomObjPage).attr("loadcount"))+1).show();
	}
	
	FrontCommon.hideLoadingPage = function(){
		if(window.loadingDomObjPage){
			if($(window.loadingDomObjPage).attr("loadcount")>0){
				$(window.loadingDomObjPage).attr("loadcount",parseInt($(window.loadingDomObjPage).attr("loadcount"))-1);
			}
			if($(window.loadingDomObjPage).attr("loadcount")==0)$(window.loadingDomObjPage).hide();
		}
	}
	
	FrontCommon.openSaveDialog = function(dialogConfig,formConfig,formItems,formData,saveBack){
		this.config = $.extend({
			width:600,//弹窗的宽度
			height:'auto',//弹窗的高度
			title:"",//弹窗标题
			content:FrontCommon.contextPath+"/common_save.html",//弹窗的内容
			buttons:[{icon:'check',text:"提交",click:function(){
				this.getFrameWin().save(saveBack);
			}},{icon:'power-off',text:'关闭',type:'default',click:function(){
				FrontCommon.closeDialog(dialog);
			}}]//弹窗按钮，按钮配置对象{icon:'',type:'default|primary|success|info|warning',click:'function(){}|close'}
		},dialogConfig);
		
		this.config.success = function(){//默认加载成功事件，需要合并进去
			if(this.getFrameWin().initForm){
				this.getFrameWin().initForm(formConfig,formItems,formData);
			}
		}
		if(dialogConfig.success&&typeof(dialogConfig.success)){//如果用户自定义了success事件
			var orgSuccessFunc = this.config.success;
			this.config.success = function(){
				orgSuccessFunc.call(this);
				dialogConfig.success.call(this);
			}
		}
		eval("var dialog = new "+FrontCommon.uiType+"Dialog(this.config)");
		
		dialog.open();
		
		return dialog;
	}
	
	/**
	 * 关闭弹窗函数，
	 * @param dialog 需要关闭的弹窗对象，通过FrontCommon.showDialog获得
	 */
	FrontCommon.closeDialog = function(dialog){
		dialog.close();
	}
	
	/**
	 * 公用函数，用来初始化表格
	 */
	FrontCommon.initTable = function(config,container){
		eval("var table = new "+FrontCommon.uiType+"Table(config)");
		if(container)table.appendTo(container);
		
		return table;
	}
	
	FrontCommon.initTree = function(config,container){
		if(container)config["container"] = container;
		eval("var tree = new "+FrontCommon.uiType+"Tree(config)");
		
		return tree;
	}
	
	FrontCommon.initSelectList = function(config,container){
		if(container)config["container"] = container;
		eval("var selectListObj = new "+FrontCommon.uiType+"SelectList(config)");
		
		return selectListObj;
	}
	
	FrontCommon.initTab = function(config,container){
		if(container)config["container"] = container;
		eval("var tab = new "+FrontCommon.uiType+"Tab(config)");
		
		return tab;
	}
	
	FrontCommon.showMenu = function(config,x,y){
		eval("var menu = new "+FrontCommon.uiType+"Menu(config)");
		menu.append();
		menu.open(x,y)
		return menu;
	}
	
	FrontCommon.closeMenu = function(menu){
		menu.close();
	}
	
	/**
	 * 显示tooltip提示框
	 * config的
	 */
	FrontCommon.showTip = function(config,width,top,title){
		if(!window.FrontCommonToolTip)window.FrontCommonToolTip = new BootStrapTooltip($.extend({left:0,top:0,content:''}),config);
		if(width){
			$(window.FrontCommonToolTip.domObj).width(width);
		}else{
			$(window.FrontCommonToolTip.domObj).css({"width":"auto"});
		}
		if(top){
			window.FrontCommonToolTip.setPositionType("top");
		}else{
			window.FrontCommonToolTip.setPositionType("bottom");
		}
		if(title){
			$(window.FrontCommonToolTip.domObj).find(".popover-title").text(title).show();
		}else{
			$(window.FrontCommonToolTip.domObj).find(".popover-title").hide()
		}
		FrontCommonToolTip.setPosition(config);
		FrontCommonToolTip.setContent(config.content);
		FrontCommonToolTip.show(config.delay);
	}
	
	FrontCommon.hideTip = function(){
		FrontCommonToolTip.hide();
	}
	
	FrontCommon.deleteData = function(url,deleteData,callback){
		top.FrontCommon.confirm("您确定要删除吗？","删除确认",function(confirm){
			if(confirm){
				$.ajax({
					url:url,
					type:'post',
					dataType:'json',
					data:deleteData,
					success:function(data){
						if(data["code"]["code"]==0){
							top.FrontCommon.success(data["code"]["msg"]);
						}else{
							top.FrontCommon.error(data["code"]["msg"]);
						}
						if(callback)callback(data);
					}
				})
			}
		})
	}
	
	FrontCommon.postData = function(url,params,confirmTitle,confirmMessage,callback,multipart,noMsg){
		top.FrontCommon.confirm(confirmMessage,confirmTitle,function(confirm){
			if(confirm){
				$.ajax($.extend({
					url:url,
					type:'post',
					dataType:'json',
					data:params,
					success:function(data){
						if(!noMsg){
							if(data["code"]["code"]==0){
								top.FrontCommon.success(data["code"]["msg"]);
							}else{
								top.FrontCommon.error(data["code"]["msg"]);
							}
						}
						if(callback)callback(data);
					}
				},multipart?{contentType:false,processData:false}:{}))
			}
		})
	}
	
	FrontCommon.request = function(url,params,callback,ajaxParam){
		var ajaxP = $.extend({
			type:'post',
			dataType:'json',
			data:params},
			ajaxParam,
			{
				url:url,
				success:function(data){
					if(callback)callback(data);
				}
			})
		$.ajax(ajaxP);
	}
	
	FrontCommon.downloadTemplate = function(url){
		if(!document.forms["exportDataForm"]){
			$(document.body).append("<form action='"+url+"' method='post' target='exportFrame' " +
					"name='exportDataForm'></form>" +
					"<iframe style='display:none' name='exportFrame'></iframe>");
		}
		document.forms["exportDataForm"].action=url;
		document.forms["exportDataForm"].submit();
	}
	
	FrontCommon.exportData = function(url, params){
		var isFinish = function(){
			FrontCommon.request(FrontCommon.contextPath+"/getSessionAttr.json",{attrName:'exportData'},function(data){
				if(data["code"]["code"]!=0){
					top.FrontCommon.error('系统错误，请联系管理员！','系统错误');
					top.FrontCommon.hideProgress();
					return;
				}
				if(data["code"]["code"]==0&&data["result"]=="complete"){
					//如果已完成，那么隐藏数据加载中提示
					top.FrontCommon.setProgress({progress:100,duration:50,callback:function(){
						top.FrontCommon.hideProgress();
						FrontCommon.request(FrontCommon.contextPath+"/setSessionAttr.json",{attrName:'exportData',attrValue:'initial'},function(re){
						});
					}});
				}else{
					setTimeout(function(){
						isFinish()
					},500);
				}
			});
		}
		if(!document.forms["exportDataForm"]){
			$(document.body).append("<form action='"+url+"' method='post' target='exportFrame' " +
					"name='exportDataForm'></form>" +
					"<iframe style='display:none' name='exportFrame'></iframe>");
		}
		document.forms["exportDataForm"].action=url;
		for(var attr in params){
			if(!document.forms["exportDataForm"][attr]){
				$(document.forms["exportDataForm"]).append("<input type='hidden' name='"+attr+"'/>");
			}
			document.forms["exportDataForm"][attr].value = params[attr];
		}
		FrontCommon.request(FrontCommon.contextPath+"/setSessionAttr.json",{attrName:'exportData',attrValue:'processing'},function(data){
			if(data["code"]["code"]==0){
				//数据加载中提示
				top.FrontCommon.showProgress();
				top.FrontCommon.setProgress({progress:90,duration:20000,callback:null});
				document.forms["exportDataForm"].submit();//提交导出下载
				//开始判断下载是否完成
				isFinish();
			}else{
				top.FrontCommon.error('系统错误，请联系管理员！','系统错误');
			}
		})
	}
	
	FrontCommon.downloadFile = function(fileName, path){
		if(!document.forms["downloadFileForm"]){
			$(document.body).append("<form action='' method='post' target='downloadFileFrame' " +
					"name='downloadFileForm'><input type='hidden' name='fileName'/><input type='hidden' name='path'/></form>" +
					"<iframe style='display:none' name='downloadFileFrame'></iframe>");
		}
		document.forms["downloadFileForm"].action=FrontCommon.contextPath+"/downloadFile.json";
		document.forms["downloadFileForm"]["fileName"].value = fileName;
		document.forms["downloadFileForm"]["path"].value = path;
		document.forms["downloadFileForm"].submit();
	}
	
	FrontCommon.downloadReport = function(url, params){
		if(!document.forms["downloadReportForm"]){
			$(document.body).append("<form action='' method='post' target='downloadReportForm' " +
					"name='downloadReportForm'><input type='hidden' name='fileName'/><input type='hidden' name='path'/></form>" +
					"<iframe style='display:none' name='downloadReportForm'></iframe>");
		}
		document.forms["downloadReportForm"].action=url;
		if(!document.forms["downloadReportForm"]["jsondata"]){
			$(document.forms["downloadReportForm"]).append("<input type='hidden' name='jsondata'/>");
		}
		document.forms["downloadReportForm"]["jsondata"].value =JSON.stringify(params) ;
		document.forms["downloadReportForm"].submit();
	}
	
	FrontCommon.impTemplate = function(url,callback){
		if(!document.forms["importDataForm"]){
			$(document.body).append("<form enctype=\"multipart/form-data\" action=\""+url+"\" method='post' " +
					"name=\"importDataForm\" target=\"impFrame\"></form>" +
					"<iframe style='display:none' name='impFrame'></iframe>");
			$(document.forms["importDataForm"]).append("<input accept=\"application/vnd.ms-excel\" type='file' style='display:none' name='fileData'/>")
			$(document.forms["importDataForm"]["fileData"]).bind("change",function(){
				var formData = new FormData(document.forms["importDataForm"]);
				top.FrontCommon.confirm("您确定要导入该文件吗？","导入确认",function(confirm){
					if(confirm){
						top.FrontCommon.showProgress();
						top.FrontCommon.setProgress({progress:90,duration:8000,callback:null});
						$.ajax({
							url:url,
							type:'post',
							data:formData,
							dataType:'json',
							contentType:false,
							processData:false,
							error:function(){
								top.FrontCommon.hideProgress();
								top.FrontCommon.error('系统错误，请联系管理员！','系统错误');
							},
							success:function(data){
								top.FrontCommon.setProgress({progress:100,duration:1000,callback:function(){
									top.FrontCommon.hideProgress();
									buttons = [];
									var message = "";
									if(data["code"]["code"]=="0-060001"){//模板错误
										message = data["code"]["msg"];
									}else if(data["code"]["code"]=="0-060002"){//EXCEL数据错误
										message = "EXCEL数据错误，请下载导入结果文件进行查看！";
										buttons.push({icon:'download',text:"下载导入结果",click:function(){
											var fileName = data["result"].split("|")[0];
											var path = data["result"].split("|")[1];
											FrontCommon.downloadFile(fileName, path);
										}})
									}else if(data["code"]["code"]=="0"){
										message = data["result"];
										callback(data);
									}else{
										message = data["code"]["msg"];
									}
									buttons.push({icon:'power-off',text:'关闭',type:'default',click:function(){
										top.FrontCommon.closeDialog(dialog);
									}})
									var dialog = top.FrontCommon.showDialog({
										title:"导入提示",
										width:400,
										customeCls:'confirmDialog',
										content:"<div style='padding:10px 15px;font-size:16px;word-break:break-all'>"+
										""+message+"</div>",
										success:function(){
											$(this.domObj).show();
											var height = (top.document.documentElement.clientHeight-$(this.domObj).find(".modal-dialog").outerHeight())/2;
											$(this.domObj).hide();
											$(this.domObj).find(".modal-dialog").css({"margin-top":height+"px"});
										},
										buttons:buttons
									});
									
								}});
							}
						})
					}
				})
			});
		}
		document.forms["importDataForm"].reset();
		document.forms["importDataForm"]["fileData"].click();
	}
	
	/**
	 * 显示系统进度条
	 */
	FrontCommon.showProgress = function(){
		if(!document.getElementById("progress_bar")){
			$("<div style=\"width:460px;z-index:1000000000;position:fixed;padding:2em;display:none;" +
			  "background:-webkit-gradient(linear, left top, left bottom, color-stop(0.65, rgba(255,255,255,1)), color-stop(1, rgba(255,255,255,1)))\">" +
			  "<div id=\"progress_bar\" style=\"\" class=\"ui-progress-bar ui-container\">"+
			"<div class=\"ui-progress\" style=\"width: 10%;\">"+
			"<span class=\"ui-label\" style=\"display:none;font-size:12px;\"><span>已完成</span><b class=\"value\">79%</b></span>"+
			"</div></div>"+
			"</div>").appendTo($(document.body));
			$("<div id='progress_bar_fade' style='position:fixed;left:0px;top:0px;width:100%;" +
			  "z-index:999999999;height:100%;background-color:#000;opacity:0.2;'></div>").appendTo($(document.body));
			FrontCommon.loadcss(FrontCommon.contextPath+"/resource/css/progress-bar.css")
		}
		$("#progress_bar").parent().css({top:(document.documentElement.clientHeight-91)/2+"px",
			left:(document.documentElement.clientWidth-460)/2+"px"})
		$("#progress_bar").parent().show();
		$("#progress_bar_fade").show();
	}
	
	/**
	 * 设置进度条值，{progress:进度条的位置(10-100),duration:动画执行时间,callback:动画完成的回调}
	 */
	FrontCommon.setProgress = function(config){
		var progressconfig = $.extend({progress:10,duration:2000,callback:null},config);
		$("#progress_bar .ui-progress").stop();
		$("#progress_bar .ui-progress").animateProgress(progressconfig.progress,progressconfig.duration,progressconfig.callback);
	}
	
	/**
	 * 隐藏进度条
	 */
	FrontCommon.hideProgress = function(){
		$("#progress_bar .ui-progress").stop();
		$("#progress_bar").find(".ui-label").hide();
		$("#progress_bar").find(".ui-progress").css({"width":"10%"});
		$("#progress_bar").parent().hide();
		$("#progress_bar_fade").hide();
	}
	
	/**
	 * 添加jquery进度条动画函数
	 */
	$.fn.animateProgress = function(progress, duration, callback) {    
	    return this.each(function() {
	      $(this).animate({
	        width: progress+'%'
	      }, {
	        duration: duration, 
	        // 动画类型swing or linear
	        easing: 'swing',
	        // 动画的每一步都必须更新加载进度文字说明
	        step: function( progress ){
	          var labelEl = $('.ui-label', this),
	              valueEl = $('.value', labelEl);
	          var fontEl = $('span', labelEl);
	          
	          if (Math.ceil(progress) < 20 && $('.ui-label', this).is(":visible")) {
	            labelEl.hide();
	          }else{
	            if (labelEl.is(":hidden")) {
	              labelEl.fadeIn();
	            };
	          }
	          
	          if (Math.ceil(progress) == 100) {
	            setTimeout(function() {
	              labelEl.fadeOut();
	            }, 1000);
	          }
	          
	          valueEl.text(Math.ceil(progress) + '%');
	        },
	        complete: function(scope, i, elem) {
	          if (callback) {
	            callback.call(this, i, elem );
	          };
	        }
	      });
	    });
	  };
	  
	  $(function(){
		$(document.body).bind("mousedown",function(e){
			var target = e.target;
			while(target&&target.nodeName!="BODY"){
				if($(target).hasClass('advance_search_div')){
					return true;
				}else{
					target = target.parentNode;
				}
			}
			$(".advance_search_div").hide();
			return true;
		})
	  })
	
})(window,jQuery)