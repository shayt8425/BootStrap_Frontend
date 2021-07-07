var FrontCommon = new Object();
/**
 * 定义系统查找form的公用构造函数
 * @param formId form表单编号
 * @param containerId 所属容器dom标识
 * @param formAction form跳转的action
 * @param formTarget form跳转的目标target
 * @param formValidateSetting 表单验证默认参数
 */
FrontCommon.SearchForm = function(formId,containerId,formAction,formTarget,cols,formValidateSetting){
	this.formId = formId;
	this.containerId = containerId;
	this.formAction = formAction;
	this.formTarget = formTarget;
	this.items = [];
	this.cols = cols?cols:4;//默认一行显示条数
	this.buttons = [];
	this.useCols = 0;
	this.formValidateSetting = formValidateSetting;
	//生成其html
	this.html = "<form id=\""+formId+"\" name=\""+formId+"\" class=\"form-inline\" method=\"post\" action=\""+formAction+"\" target=\""+formTarget+"\"><table style=''><tbody></tbody></table></form>";
	document.getElementById(containerId).innerHTML = this.html;
	this.formDom = document.forms[formId];
	//表单验证 参数配置注入
	if(formValidateSetting)$('#'+formId).validationEngine("attach",formValidateSetting);
}

/**
 * 添加form表单项
 * @param item 需要添加的表单项
 * 两种方式，1 item为FrontCommon.formItem对象，
 * 2、item为form配置对象如：{id:"name", name:"name", text:"角色名称", type:"text", validateExpr:'required', validateCustom:{'message':{'data-errormessage-value-missing':'角色名称不能为空！'}}}
 */
FrontCommon.SearchForm.prototype.addItem = function(item){
	if(!item.controlDom){
		item = new FrontCommon.formItem(item.id, item.name, item.text, item.type, item.datas, item.treeSetting, item.validateExpr, item.validateCustom)
	}
	this.items.push(item);
	item.relateForm = this;
	var itemRow = null;
	if(item.type=='hidden'){
		$(item.controlDom).appendTo($(this.formDom).find("td:last"));
		return;
	}
	if(item.type=='textarea'){
		this.useCols = this.useCols%this.cols==0?this.useCols+1:(Math.floor(this.useCols/this.cols)+1)*this.cols+1;
	}else{
		this.useCols += 1;
	}
	if(this.useCols%this.cols==1||this.cols==1){
		//需要创建行
		itemRow = document.createElement("tr");
		itemRow.setAttribute("height","40px");
		this.formDom.getElementsByTagName("TBODY")[0].appendChild(itemRow);
	}else{
		itemRow = $(this.formDom).find("tr:last")[0];
	}
	var labelColumn = document.createElement("td");
	labelColumn.setAttribute("align","right");
	labelColumn.setAttribute("class","formLabelClass");
	labelColumn.style.padding = "0px 0px 3px 0px"
	labelColumn.appendChild(item.labelDom); 
	var controlColumn = document.createElement("td");
	if(item.type=='textarea'){
		controlColumn.setAttribute("colspan",this.cols*2-1);
	}if(item.config&&item.config.cols&&item.config.cols!=1){
		controlColumn.setAttribute("colspan",item.config.cols*2-1);
	}
	controlColumn.appendChild(item.controlDom);
	itemRow.appendChild(labelColumn);
	itemRow.appendChild(controlColumn);
	if(controlColumn.clientHeight>40){
		itemRow.setAttribute("height",controlColumn.clientHeight+8+"px");
	}
	if(item.type=='date'){
		//$('#'+item.id+'datetimepicker').datetimepicker($.extend({language:'zh-CN',autoclose:true,viewSelect:0},item.datas));
	}else if(item.type=='textarea'){
		this.useCols = this.useCols%this.cols==0?this.useCols:(Math.floor(this.useCols/this.cols)+1)*this.cols;
	}else if(item.config&&item.config.cols&&item.config.cols!=1){
		this.useCols += item.config.cols-1;
	}
}

/**
 * 添加form表单按钮项
 * @param item 需要添加的表单项
 */
FrontCommon.SearchForm.prototype.addButton = function(button){
	if(!button.html){
		button = new FrontCommon.button(button.id, button.text, button.icon, button.click, button.type);
	}
	if(this.buttons.length==0){
		this.buttonDiv = document.createElement("div");
		this.buttonDiv.setAttribute("class","form-group pull-right");
		this.formDom.appendChild(this.buttonDiv);
	}
	this.buttons.push(button);
	button.relateForm = this;
	if(!document.getElementById('buttonBar'+this.formId)){
		$("<td align='right' id='buttonBar"+this.formId+"'>&nbsp;&nbsp;&nbsp;</td>").appendTo($(this.formDom).find("tr:first"))
	}
	document.getElementById('buttonBar'+this.formId).innerHTML += button.html;
}

/**
 * 获取表单项，使用表单名称来获取
 * @param name 表单名称
 */
FrontCommon.SearchForm.prototype.getItemByName = function(name){
	for(var i=0;i<this.items.length;i++){
		if(this.items[i].name==name){
			return this.items[i];
		}
	}
}

/**
 * 获取表单项，使用表单ID来获取
 * @param id 表单ID
 */
FrontCommon.SearchForm.prototype.getItemById = function(id){
	for(var i=0;i<this.items.length;i++){
		if(this.items[i].id==id){
			return this.items[i];
		}
	}
}

/**
 * 表单项构造函数
 * @param id 表单项id号
 * @param name 表单项名称
 * @param text 表单项描述
 * @param type 表单项类型，如text、checkbox,select
 * @param datas 表单所要的数据或者ajax地址
 * @param treeSetting 如果是树控件，树控件使用的配置对象
 * @param validateExpr 表单验证使用的配置对象
 * @param validateCustom 表单验证自定义对象
 */
FrontCommon.formItem = function(id,name,text,type,datas,treeSetting,validateExpr,validateCustom){
	this.type = type;
	this.id = id;
	this.name = name;
	this.validateExpr = validateExpr;//添加表单的验证规则
	this.validateCustom = validateCustom;//添加表单的自定义对象
	//声明表单标签dom
	this.labelDom = document.createElement("label");
	this.labelDom.setAttribute("class","control-label");
	this.labelDom.innerHTML = "&nbsp;&nbsp;&nbsp;"+text+"：";
	//声明表单控件dom
	this.controlDom = document.createElement("span");
	this.datasAlreadyLoad = false;//添加变量表示表单项所需数据是否加载完成
	//表单控件dom内部html
	this.controlHtml = "";
	var formItem = this;
	if(type=="select"){//如果是下拉框
		var selectConfig = {"label":"label","value":"value","ajaxType":'get',"needAll":true,"allDesc":'全部'};
		selectConfig = $.extend(selectConfig,treeSetting);
		this.config = selectConfig;
		//拼接其html
		this.controlHtml += "<select class=\""+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control m-b\" style=\"width:204px\" name=\""+name+"\" id=\""+id+"\">";
		if(selectConfig["needAll"])this.controlHtml += "<option value=\"\">"+selectConfig["allDesc"]+"</option>";
		//如果下拉框的数据来源是一个url
		if(datas&&typeof(datas)=='string'){//如果是一个地址
			//使用ajax去后台获取数据
			$.ajax({
				url:datas,
				type:selectConfig["ajaxType"],
				dataType:'json',
				data:{},
				success:function(data){
					if(data){
						if(data&&data["data"])data=data["data"];
						if(data.length>0){
							var selectControl = $(formItem.controlDom);
							for(var i=0;i<data.length;i++){
								$("<option value=\""+data[i][selectConfig["value"]]+"\">"+data[i][selectConfig["label"]]+"</option>").appendTo(selectControl);
							}
						}
					}
					formItem.datasAlreadyLoad = true;
				}
			})
		}else{
			if(datas&&datas["data"])datas=datas["data"];
			if(datas&&datas.length>0){
				//json数据格式[{label:'测试',value:'测试'}]
				for(var i=0;i<datas.length;i++){
					this.controlHtml+="<option value=\""+datas[i][selectConfig["value"]]+"\">"+datas[i][selectConfig["label"]]+"</option>";
				}
			}
			this.datasAlreadyLoad = true;
		}
		this.controlHtml += "</select>";
	}else if(type=='date'){//日期控件
		var dateConfig = {"placeholder":text};
		dateConfig = $.extend(dateConfig,treeSetting);
		this.config = dateConfig;
		this.controlHtml += "<input "+(dateConfig["readOnly"]?"readonly=\"readonly\"":"onclick=\"WdatePicker({dateFmt:"+(!!dateConfig["format"]?"'"+dateConfig["format"]+"'":"\'yyyy-MM-dd HH:mm:ss\'")+"})\"")+"  type=\"text\"  id='"+id+"' name='"+name+"' class='"+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control'  />";
		//"<div class='input-group date' id='"+id+"datetimepicker'><input "+(dateConfig["readOnly"]?"readonly=\"readonly\"":"")+" type='text' id='"+id+"' name='"+name+"' class='"+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control'/><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-remove\"></span></span><span class=\"input-group-addon\"><span class=\"glyphicon glyphicon-calendar\"></span></span></div>";
		this.datas = datas;
	}else if(type=="suggest"){
		var suggestConfig = {"label":"label","value":"value","ajaxType":'get',"needAll":true,"placeholder":text};
		suggestConfig = $.extend(suggestConfig,treeSetting);
		this.config = suggestConfig;
		this.controlHtml += "<span class=\"textbox combo\" style=\"width:206px\" id=\"textbox"+id+"\"><span style=\"top:0px;right: 0px;position:absolute;\">";
		//添加树下拉按钮
		this.controlHtml += "<i onmouseover=\"$(this).attr('mouseoverflag','true')\" onmouseout=\"$(this).attr('mouseoverflag','false');if($(this).attr('inputblur')=='true')$(this).hide();\" onclick=\"var obj = $('#comboText"+id+"')[0].dataObj;obj.setValue('');\" class='glyphicon glyphicon-remove' style='background-color:#FFF;height:32px;padding-top:7px;display:none'></i><a href=\"javascript:void(0)\" class=\"textbox-icon combo-arrow\" style=\"width: 22px; height: 32px;\" onclick=\"$('#"+id+"comboSuggestDiv').css({'top':($('#textbox"+id+"').position().top+32>document.documentElement.clientHeight-200?$('#textbox"+id+"').position().top-205:$('#textbox"+id+"').position().top+32),'left':$('#textbox"+id+"').position().left});$('.suggetst_div').each(function(){if($(this).attr('id')!='"+id+"comboSuggestDiv')$(this).hide();});if($('#"+id+"comboSuggestDiv').is(':hidden')){$('#"+id+"comboSuggestDiv').show();$('#comboText"+id+"').focus();}else{$('#"+id+"comboSuggestDiv').hide();}\"></a></span>";
		this.controlHtml += "<input onblur=\"$('#textbox"+id+"').find('i:first').attr('inputblur','true');if($('#textbox"+id+"').find('i:first').attr('mouseoverflag')!='true')$('#textbox"+id+"').find('i:first').hide();\" onfocus=\"$('#textbox"+id+"').find('i:first').attr('inputblur','false');$('#textbox"+id+"').find('i:first').show();\" type=\"text\" placeholder=\""+suggestConfig["placeholder"]+"\" id=\"comboText"+id+"\" name=\"comboText"+name+"\" class=\""+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control\" autocomplete=\"off\" style=\"border:0px;border-radius:0px 0px 0px 0px;height:30px;width:184px\"/>";
		this.controlHtml += "<input type=\"hidden\" id=\""+id+"\" name=\""+name+"\"/></span>";
		//添加下拉框展示层
		$("<div class=\"suggetst_div\" style=\"position: absolute; z-index: 1000; display: none; width: 205px;\" id=\""+id+"comboSuggestDiv\"><div title=\"\" style=\"width: 205px; height: 205px;border: 1px solid #ccc;background-color: #dbdbdb;overflow:auto\" class=\"searchable-select-items\" id=\""+id+"SuggestContainer\"></div></div>").appendTo($(document.body));
		if(datas&&typeof(datas)=='string'){//如果是一个地址
			//使用ajax去后台获取数据
			$.ajax({
				url:datas,
				type:suggestConfig["ajaxType"],
				dataType:'json',
				data:{},
				success:function(data){
					if(data){
						if(data&&data["data"])data=data["data"];
						if(data.length>0){
							for(var i=0;i<data.length;i++){
								data[i]["html"] = "<div class=\"searchable-select-item\" data-value=\""+data[i][suggestConfig["value"]]+"\" onmouseover=\"$(this).addClass('hover')\" onmouseout=\"$(this).removeClass('hover')\">"+data[i][suggestConfig["label"]]+"</div>";
							}
						}
					}
					formItem.datasAlreadyLoad = true;
					formItem.datas = data;
				}
			})
		}else{
			if(datas&&datas["data"])datas=datas["data"];
			if(datas&&datas.length>0){
				for(var i=0;i<datas.length;i++){
					datas[i]["html"] = "<div class=\"searchable-select-item\" data-value=\""+datas[i][suggestConfig["value"]]+"\" onmouseover=\"$(this).addClass('hover')\" onmouseout=\"$(this).removeClass('hover')\">"+datas[i][suggestConfig["label"]]+"</div>";
				}
			}
			formItem.datasAlreadyLoad = true;
			formItem.datas = datas;
		}
		//启动监听
		this.startItemListen();
	}else if(type=="tree"){//如果是树选择类表单
		var treeSettings = $.extend({//设置树控件配置参数
			jsonFormatOut:true,
			placeholder:text,
			ajaxType:'get',
			width:205,
			height:205,
			data: {
				simpleData: {
					enable: true
				},
			},callback: {
				onClick: function(event, treeId, treeNode, clickFlag){
					if(formItem.itemTree.setting.check.enable){
						//自动勾选该节点
						var cascade = formItem.itemTree.setting.check.chkboxType.Y=='ps'||formItem.itemTree.setting.check.chkboxType.Y=='p';
						formItem.itemTree.checkNode(treeNode, null, cascade, true);
						return;
					}
					$('#comboText'+id).val(treeNode[formItem.itemTree.setting.data.key.name]);
					$(formItem.controlDom).find('input[name="'+name+'"]').val(treeNode[formItem.itemTree.setting.data.simpleData.idKey]);
					$('.combotree_div').hide();
				},onCheck: function(event, treeId, treeNode){
					var nodes = formItem.itemTree.getCheckedNodes(true);
					var nodeId = "";
					var nodeText = "";
					//拼接需要显示在树形控件中的文字
					for(var i=0;i<nodes.length;i++){
						nodeText += nodes[i][formItem.itemTree.setting.data.key.name]+(i==nodes.length-1?"":",");
						nodeId += nodes[i][formItem.itemTree.setting.data.simpleData.idKey]+(i==nodes.length-1?"":",");
					}
					//默认树控件值为用户check后的所有id拼接
					$(formItem.controlDom).find('input[name="'+name+'"]').val(nodeId);
					//文本框为用户check的节点描述
					$('#comboText'+id).val(nodeText);
					//如果是级联树，且用户设置输出为json串形式
					var cascade = formItem.itemTree.setting.check.chkboxType.Y=='ps'||formItem.itemTree.setting.check.chkboxType.Y=='p';
					if(cascade&&formItem.itemTree.setting.jsonFormatOut){
						var roots = [];
						var childrenName = formItem.itemTree.setting.data.key.children;
						//获取用户选中的树节点
						for(var i=0;i<nodes.length;i++){
							if(!nodes[i].getParentNode()){//顶级节点，直接往roots对象里面放
								var nodeObj = {id:nodes[i][formItem.itemTree.setting.data.simpleData.idKey]};
								nodeObj[childrenName] = [];
								roots.push(nodeObj);
							}else{
								formItem.setToParentNode(roots,nodes[i]);
							}
						}
						//生成需要写入的树数据['xxx':ddd,children:[]]
						var checkJson = "[";
						for(var i=0;i<roots.length;i++){
							var obj = new FrontCommon.jsonObj(roots[i]);
							checkJson += obj+(i==roots.length-1?"":",");
						}
						checkJson += "]";
						//表单项写入json数据
						$(formItem.controlDom).find('input[name="'+name+'"]').val(checkJson);
					}
				}
			}
		},treeSetting);
		this.config = treeSettings;
		//生成树表单项
		this.controlHtml += "<span class=\"textbox combo\" style=\"width:206px\" id=\"textbox"+id+"\"><span style=\"top:0px;right: 0px;position:absolute;\">";
		//添加树下拉按钮
		this.controlHtml += "<i onmouseover=\"$(this).attr('mouseoverflag','true')\" onmouseout=\"$(this).attr('mouseoverflag','false');if($(this).attr('inputblur')=='true')$(this).hide();\" onclick=\"var obj = $('#comboText"+id+"')[0].dataObj;obj.setValue('');\" class='glyphicon glyphicon-remove' style='background-color:#FFF;height:32px;padding-top:7px;display:none'></i><a href=\"javascript:void(0)\" class=\"textbox-icon combo-arrow\" style=\"width: 22px; height: 32px;\" onclick=\"$('#"+id+"comboTreeDiv').css({'top':($('#textbox"+id+"').position().top+32>document.documentElement.clientHeight-200?$('#textbox"+id+"').position().top-"+treeSettings["height"]+":$('#textbox"+id+"').position().top+32),'left':$('#textbox"+id+"').position().left});$('.combotree_div').each(function(){if($(this).attr('id')!='"+id+"comboTreeDiv')$(this).hide();});if($('#"+id+"comboTreeDiv').is(':hidden')){$('#"+id+"comboTreeDiv').show();$('#comboText"+id+"').focus();}else{$('#"+id+"comboTreeDiv').hide();}\"></a></span>";
		this.controlHtml += "<input type=\"text\" onblur=\"$('#textbox"+id+"').find('i:first').attr('inputblur','true');if($('#textbox"+id+"').find('i:first').attr('mouseoverflag')!='true')$('#textbox"+id+"').find('i:first').hide();\" onfocus=\"$('#textbox"+id+"').find('i:first').attr('inputblur','false');$('#textbox"+id+"').find('i:first').show();\" placeholder=\""+treeSettings["placeholder"]+"\" id=\"comboText"+id+"\" name=\"comboText"+name+"\" class=\""+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control\" autocomplete=\"off\" style=\"border:0px;border-radius:0px 0px 0px 0px;height:30px;width:184px\"/>";
		this.controlHtml += "<input type=\"hidden\" id=\""+id+"\" name=\""+name+"\"/></span>";
		//添加树展示层
		$("<div class=\"combotree_div\" style=\"position: absolute; z-index: 1000; display: none; width: "+treeSettings["width"]+"px;\" id=\""+id+"comboTreeDiv\"><div title=\"\" style=\"width: "+treeSettings["width"]+"px; height: "+treeSettings["height"]+"px;border: 1px solid #ccc;background-color: #dbdbdb;overflow:auto\"><ul class=\"ztree\" id=\""+id+"TreeContainer\"></ul></div></div>").appendTo($(document.body));
		//开始初始化树，必须给树容器节点添加id，否则有问题
		if(datas&&typeof(datas)=='string'){//如果是一个地址
			//使用ajax去后台获取数据
			$.ajax({
				url:datas,
				type:treeSettings.ajaxType,
				dataType:'json',
				data:{},
				success:function(data){
					if(data&&data["data"])data=data["data"];
					if(data&&data.length>0){
						$.fn.zTree.init($('#'+id+'TreeContainer'), treeSettings, data);
						formItem.itemTree = $.fn.zTree.getZTreeObj(id+'TreeContainer');
					}
					formItem.datasAlreadyLoad = true;
				}
			})
		}else{
			//datas:[{id:'',name:'',children:''}]
			if(datas&&datas["data"])datas=datas["data"];
			if(datas&&datas.length>0)$.fn.zTree.init($('#'+id+'TreeContainer'), treeSettings, datas);
			this.datasAlreadyLoad = true;
			//声明表单项内部树控件
			this.itemTree = $.fn.zTree.getZTreeObj(id+'TreeContainer');
		}
		this.startItemListen();
	}else{//其他
		if("radio"==type||"checkbox"==type){//如果是单选框或者复选框
			var boxConfig = {"label":"label","value":"value","ajaxType":'get'};
			boxConfig = $.extend(boxConfig,treeSetting);
			this.config = boxConfig;
			if(datas&&typeof(datas)=='string'){//如果是一个地址
				//使用ajax去后台获取数据
				$.ajax({
					url:datas,
					type:boxConfig["ajaxType"],
					dataType:'json',
					data:{},
					success:function(data){
						if(data){
							if(data&&data["data"])data=data["data"];
							if(data.length>0){
								for(var i=0;i<data.length;i++){
									$("<label class=\""+type+"-inline\" for=\""+id+data[i][boxConfig["value"]]+"\"><input name=\""+name+"\" type=\""+type+"\" style=\"margin-top:4px;\" value=\""+data[i][boxConfig["value"]]+"\" id=\""+id+data[i][boxConfig["value"]]+"\"/>"+data[i][boxConfig["label"]]+"</label>").appendTo($(formItem.controlDom));
								}
							}
						}
						formItem.datasAlreadyLoad = true;
					}
				})
			}else{
				//根据datas来生成数据,json数据格式[{label:'测试',value:'测试'}]
				if(datas&&datas["data"])datas=datas["data"];
				if(datas&&datas.length>0){
					for(var i=0;i<datas.length;i++){
						this.controlHtml+="<label class=\""+type+"-inline\" for=\""+id+datas[i][boxConfig["value"]]+"\"><input name=\""+name+"\" type=\""+type+"\" style=\"margin-top:4px;\" value=\""+datas[i][boxConfig["value"]]+"\" id=\""+id+datas[i][boxConfig["value"]]+"\"/>"+datas[i][boxConfig["label"]]+"</label>";
					}
				}
				this.datasAlreadyLoad = true;
			}
		}else if(type=='textarea'){
			var areaConfig = {readOnly:false,"placeholder":text};
			areaConfig = $.extend(areaConfig,treeSetting);
			this.config = areaConfig;
			this.controlHtml = "<textarea "+(areaConfig["readOnly"]?"readonly=\"readonly\"":"")+" class=\""+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control\" style=\"width:100%;resize:none;\" id=\""+id+"\" name=\""+name+"\" class=\"form-control\" rows=\""+(!datas.rows?5:datas.rows)+"\"></textarea>";
		}else{
			var inputConfig = {readOnly:false,"placeholder":text};
			inputConfig = $.extend(inputConfig,treeSetting);
			this.config = inputConfig;
			this.controlHtml = "<input type=\""+type+"\" "+(inputConfig["readOnly"]?"readonly=\"readonly\"":"")+" style=\"width:204px\" class=\""+(validateExpr?"validate["+validateExpr+"] ":"")+"form-control\" id=\""+id+"\" name=\""+name+"\" value=\""+(type=="color"?"#000000":"")+"\" placeholder=\""+inputConfig["placeholder"]+"\" />";
		}
	}
	this.controlDom.innerHTML = this.controlHtml;
	if("radio"!=type&&"checkbox"!=type){
		//如果不是checkbox或者radio设置为其实际的控件元素，并添加表单验证规则
		this.controlDom = this.controlDom.firstChild;
		if("tree"==type||type=='suggest'){
			$(this.controlDom).find("input[type='text']:first")[0].dataObj = formItem;
		}
		if(validateCustom){
			if(validateCustom.message){
				for(attr in validateCustom.message){
					(type=='suggest'||type=='tree'?$(this.controlDom).find("input:first")[0]:this.controlDom).setAttribute(attr,validateCustom.message[attr]);
				}
			}
			if(validateCustom.otherObj){
				for(attr in validateCustom.otherObj){
					if(!window[attr])window[attr] = validateCustom.otherObj[attr];
				}
			}
		}
	}
	if("textarea"==type){
		$(this.controlDom).bind("keydown",function(e){
			if(e.keyCode==13){
				e.preventDefault();
				this.value+='\r\n';
			}
		})
	}
	if(this.config.change)this.setChange();
}

FrontCommon.formItem.prototype.setChange = function(){
	var formItem = this;
	var changeFunc = function(){
		formItem.config.change(formItem,$(this).val());
	}
	if(this.type=='text'){
		$(this.controlDom).bind("change",changeFunc);
	}if(this.type=='date'){
		$(this.controlDom).bind("change",changeFunc);
		//$(this.controlDom).find('input:first').bind("change",changeFunc);
	}else if(this.type=='textarea'){
		$(this.controlDom).bind("change",changeFunc);
	}else if(this.type=='select'){
		$(this.controlDom).bind("change",changeFunc);
	}else if(this.type=='checkbox'||this.type=='radio'){
		changeFunc = function(){
			formItem.config.change(formItem,formItem.getValue());
		}
		$(this.controlDom).find("[type='checkbox'],[type='radio']").each(function(){
			$(this).bind("click",changeFunc);
		})
	}
}

/**
 * 设置控件宽度
 */
FrontCommon.formItem.prototype.setWidth = function(width){
	if(this.type=='text'||this.type=='color'){
		$(this.controlDom).width(width);
	}if(this.type=='date'){
		$(this.controlDom).width(width);
		//$(this.controlDom).find('input:first').width(width)
	}else if(this.type=='textarea'){
		$(this.controlDom).width(width);
	}else if(this.type=='select'){
		$(this.controlDom).width(width);
	}else if(this.type=='tree'||this.type=='suggest'){
		$(this.controlDom).width(width+12);
		$(this.controlDom).find("input:first").width(width-10);
	}
}

/**
 * 开始对控件value进行监听，如果值改变了，自动检索
 */
FrontCommon.formItem.prototype.startItemListen = function(){
	var formItem = this;
	if(this.type=='suggest'&&this.datasAlreadyLoad&&!this.optionLoad){//如果是suggest控件,初始化加载一次数据
		var html = "";
		for(var i=0;i<this.datas.length;i++){
			html += this.datas[i]['html'];
		}
		$('#'+formItem.id+'SuggestContainer').html(html);
		$('#'+formItem.id+'SuggestContainer').children("div").each(function(i){
			$(this).bind('click',function(){
				$(formItem.controlDom).find("input:first").val($(this).text());
				$(formItem.controlDom).find("input[type='hidden']").val($(this).attr('data-value'));
				//if(formItem.orgValue!=$(this).text()){
					if(formItem.config.change){
						formItem.config.change(formItem,$(this).text());
					}
				//}
				formItem.orgValue = $(this).text();
			})
		})
		this.optionLoad = true;
	}
	if(!this.orgValue) this.orgValue = "";
	var userInput = $(this.controlDom).find("input:first").val();
	if(this.orgValue!=userInput){
		if(this.type=='suggest'){
			$(formItem.controlDom).find("input[type='hidden']").val(userInput);
			$('#'+formItem.id+'SuggestContainer').children("div").each(function(i){
				//忽略大小写
				userInput = userInput.toUpperCase();
				if($(this).text().indexOf(userInput)>-1){
					this.style.display = '';
				}else{
					this.style.display = 'none';
				}
			});
			if($('#'+formItem.id+'comboSuggestDiv').is(":hidden")&&userInput!=""&&!formItem.noshowSuggest)$(this.controlDom).find("a:first").click();
			if(formItem.noshowSuggest)formItem.noshowSuggest = false;
		}
		this.orgValue = userInput;
		if(this.config.change&&(userInput||userInput=="")){
			this.config.change(formItem,userInput);
		}
	}
	setTimeout(function(){formItem.startItemListen()},1000);
}

/**
 * 递归设置树节点的value
 */
FrontCommon.formItem.prototype.setToParentNode = function(childNodes,node){
	//获取子节点属性的名称
	var childrenName = this.itemTree.setting.data.key.children;
	for(var i=0;i<childNodes.length;i++){
		if(childNodes[i].id==node.getParentNode().id){//如果当前节点是节点对象节点的子节点
			var obj = {id:node[this.itemTree.setting.data.simpleData.idKey]};
			obj[childrenName] = [];
			childNodes[i][childrenName].push(obj);
		}else if(childNodes[i][childrenName]&&childNodes[i][childrenName].length>0){
			//递归向下去设置子节点
			this.setToParentNode(childNodes[i][childrenName],node);
		}
	}
}

/**
 * @param containerId 需要将表单组件添加到的容器id
 */
FrontCommon.formItem.prototype.appendToContainer = function(containerId){
	if(this.type!='hidden')document.getElementById(containerId).appendChild(this.labelDom);
	document.getElementById(containerId).appendChild(this.controlDom);
	if(this.type=='date'){
	//	$('#'+this.id+'datetimepicker').datetimepicker($.extend({language:'zh-CN',autoclose:true,viewSelect:0},this.datas));
	}
}

/**
 * 设置表单控件对应的值
 * @param value 对应的值
 */
FrontCommon.formItem.prototype.setValue = function(value){
	if(this.type=='text'||this.type=='hidden'){
		$(this.controlDom).val(value);
	}if(this.type=='date'){
		$(this.controlDom).val(value);
	//	$(this.controlDom).find('input:first').val(value)
	}else if(this.type=='textarea'){
		$(this.controlDom).val(value)
	}else if(this.type=='select'){
		this.autosetSelectItem(value);
	}else if(this.type=='suggest'){
		this.noshowSuggest = true;
		$(this.controlDom).find("input:first").val(value);
		$(this.controlDom).find("input[type='hidden']:first").val(value);
	}else if(this.type=='tree'){
		this.autosetTreeItem(value);
	}else if(this.type=='color'){
		value = value.indexOf(",")>-1?("rgb("+value+")").colorHex():value;
		$(this.controlDom).val(value);
	}else if(this.type=='checkbox'||this.type=='radio'){
		var valueArr = value.split(",");
		$(this.controlDom).find('[type="checkbox"],[type="radio"]').each(function(){
			if(valueArr.indexOf($(this).val())>-1)$(this).attr("checked","checked");
		});
	}
}

/**
 * 获取表单控件对应的值
 * @param value 对应的值
 */
FrontCommon.formItem.prototype.getValue = function(){
	if(this.type=='text'||this.type=='hidden'){
		return $(this.controlDom).val();
	}if(this.type=='date'){
		return $(this.controlDom).val();
		//return $(this.controlDom).find('input:first').val();
	}else if(this.type=='textarea'){
		return $(this.controlDom).val();
	}else if(this.type=='select'){
		return $(this.controlDom).val();
	}else if(this.type=='color'){
		return $(this.controlDom).val();
	}else if(this.type=='checkbox'||this.type=='radio'){
		var value = "";
		$(this.controlDom).find('[type="checkbox"],[type="radio"]').each(function(){
			value += $(this).is(":checked")?$(this).val()+",":"";
		});
		value = value!=""?value.substring(0,value.length-1):value;
		return value;
	}else if(this.type=='tree'||this.type=='suggest'){
		return $(this.controlDom).find("input[type='hidden']").val();
	}
}

/**
 *  因为树有级联check，所以只要选中子节点就ok
 */
FrontCommon.formItem.prototype.childCheck = function(nodeArr){
	var childrenName = this.itemTree.setting.data.key.children;//首先获取children声明的对应属性名
	var idkey = this.itemTree.setting.data.simpleData.idKey;//首先获取树节点的标识字段
	for(var i=0;i<nodeArr.length;i++){
		var node = this.itemTree.getNodeByParam(idkey,nodeArr[i][idkey]);
		if(node&&(this.itemTree.setting.check.chkboxType.Y.indexOf("s")<0||
				!nodeArr[i][childrenName]||nodeArr[i][childrenName].length<=0)){
			//如果没有子级联，或者当前节点没有子节点了则选中
			this.itemTree.checkNode(node, null, true, true);
		}
		if(nodeArr[i][childrenName]&&nodeArr[i][childrenName].length>0){
			//如果有子节点，那么递归往下走
			this.childCheck(nodeArr[i][childrenName]);
		}
	}
}

FrontCommon.formItem.prototype.autosetTreeItem = function(value){
	if(this.itemTree){
		if(this.itemTree.setting.check.enable){//如果是多选树，需要组合选中
			if(typeof(value)=='string'&&$.trim(value)!=''&&this.config.jsonFormatOut){
				value = eval(value);
				this.childCheck(value);
			}else if(typeof(value)=='string'&&$.trim(value)!=''&&!this.config.jsonFormatOut){
				//如果是逗号隔开
				var arr = value.split(",");
				var idkey = this.itemTree.setting.data.simpleData.idKey;
				var childrenKey =  this.itemTree.setting.data.key.children;
				for(var idx in arr){
					var node = this.itemTree.getNodeByParam(idkey,arr[idx]);
					if(node&&this.itemTree.setting.check.chkboxType.Y.indexOf('s')<0){
						//如果没有子级联，那么每个都要选中
						this.itemTree.checkNode(node, null, true, true)
					}else if(node&&this.itemTree.setting.check.chkboxType.Y.indexOf('p')>=0&&(!node[childrenKey]||node[childrenKey].length<=0)){
						//如果有父级联又有子级联选中子节点就可以了
						this.itemTree.checkNode(node, null, true, true);
					}
				}
			}else if(value&&typeof(value)!='string'){
				this.childCheck(value);
			}
		}else{
			if(value&&value!=''){
				var treeNode = this.itemTree.getNodeByParam(this.itemTree.setting.data.simpleData.idKey,value);
				if(treeNode){
					this.itemTree.selectNode(treeNode);
					$('#comboText'+this.id).val(treeNode[this.itemTree.setting.data.key.name]);
					$(this.controlDom).find('input[name="'+this.name+'"]').val(treeNode[this.itemTree.setting.data.simpleData.idKey]);
				}
			}else if(!value||value==''){
				$(this.controlDom).find('input[type="text"]:first').val("");
				$(this.controlDom).find('input[type="hidden"]:first').val("");
				this.itemTree.cancelSelectedNode();
			}
		}
	}else{
		var formItem = this;
		setTimeout(function(){
			formItem.autosetTreeItem(value);
		},10);
	}
}

FrontCommon.formItem.prototype.autosetSelectItem = function(value){
	if(this.datasAlreadyLoad){
		$(this.controlDom).val(value);
	}else{
		var formItem = this;
		setTimeout(function(){
			formItem.autosetSelectItem(value);
		},10);
	}
}

/**
 * 系统按钮构造函数
 * @param id 按钮元素id
 * @param text 按钮显示文字
 * @param icon 按钮显示的图标，参见bootstrap
 * @param type 按钮颜色，默认:primary gray
 * @param click 点击事件 
 */
FrontCommon.button = function(id,text,icon,click,type){
	this.html = "<a href=\"javascript:void(0)\" style=\"margin-left:5px;\" id=\""+id+"\" onclick=\""+(click&&$.trim(click)!=''?click+"()":"")+"\" class=\"btn btn-"+(type?type:"primary")+"\"><i class=\"glyphicon glyphicon-"+icon+"\"></i> "+text+"</a>";
}

FrontCommon.button.prototype.appendToContainer = function(containerId){
	var button = this;
	$(button.html).appendTo($('#'+containerId));
}

/**
 * 系统共用表格构造函数
 * @param tableSettings 表格参数设置对象，请参见bsgrid参数设置
 * @param toolbar 表格所需要的按钮数组，格式：[{"id":"addButton","text":"增加","icon":"plus-sign","click":"add"}]
 * @param columns 表格对应的字段配置，格式[{isChecked:true,name:'id',text:'选择',width:'5%'},{name:'remark',text:'备注',width:'30%'}]
 * @param containerId 容器id 生成表格后需要放置到的容器id
 */
FrontCommon.CommonTable = function(tableId,tableSettings,toolbar,columns,containerId,width){
	this.tableId = tableId;
	this.tableSettings = tableId;
	this.toolbar = toolbar;
	this.columns = columns;
	this.width = width;
	//首先生成表格所需的html
	if(toolbar&&toolbar.length>0){
		if(document.getElementById(tableId+"ToolBarDiv")){//如果用户自定义了buttontoolbar
			this.toolbarDiv = document.getElementById(tableId+"ToolBarDiv");
		}else{
			//添加工具条
			this.toolbarDiv = document.createElement("div");
			this.toolbarDiv.setAttribute("class","tableToolbar");
			this.toolbarDiv.style.backgroundColor = '#444c60';
			document.getElementById(containerId).appendChild(this.toolbarDiv);
		}
		for(var i=0;i<toolbar.length;i++){
			var button = new FrontCommon.button(toolbar[i]["id"],toolbar[i]["text"],toolbar[i]["icon"],toolbar[i]["click"],toolbar[i]["type"]);
			this.toolbarDiv.innerHTML += button.html;
		}
	}
	if(columns&&columns.length>0){
		this.searchTable = document.createElement("table");
		this.searchTable.setAttribute("class","bsgrid");
		this.searchTable.setAttribute("id",tableId);
		this.searchTable.style.width = this.width?this.width:"100%";
		var thead = document.createElement("thead");
		this.searchTable.appendChild(thead);
		var headRow = document.createElement("tr");
		thead.appendChild(headRow);
		for(var i=0;i<columns.length;i++){
			var column = document.createElement("th");
			column.style.whiteSpace = "nowrap";
			if(columns[i].isChecked){
				column.setAttribute('w_check',"true");
			}
			if(columns[i].isLine){
				column.setAttribute('w_num',"total_line");
			}
			if(columns[i].render){
				column.setAttribute('w_render',columns[i].render);
			}
			if(columns[i].sort){
				column.setAttribute('w_sort',columns[i].name+","+columns[i].sort);
			}
			if(columns[i].align){
				column.setAttribute('w_align',columns[i].align);
			}
			if(columns[i].width){
				column.setAttribute('width',columns[i].width);
			}
			if(columns[i].w_hidden){
				column.setAttribute('w_hidden',columns[i].w_hidden);
			}
			column.setAttribute('w_index',columns[i].name);
			column.innerHTML = columns[i].text;
			headRow.appendChild(column);
		}
		document.getElementById(containerId).appendChild(this.searchTable);
		//开始初始化表格
		this.gridObj = $.fn.bsgrid.init(tableId, tableSettings);
	}
}

FrontCommon.CommonTable.prototype.getCheckedValues = function(){
	var returnValue = "";
	$('#'+this.tableId).find("input[class='bsgrid_editgrid_check']").each(function(){
		if($(this).is(":checked")){
			returnValue+=$(this).val()+",";
		}
	});
	returnValue = returnValue.substring(0,returnValue.lastIndexOf(','));
	return returnValue;
}

/**
 * 冻结表头，不让其滚动
 * @param index 需要冻结的表头所在行
 */
FrontCommon.CommonTable.prototype.tableHeadFrozen = function(index,width){
	this.frozeIndex = index?index:0;
	var tableId = this.tableId;
	//首先将原表格的表头展示
	$("#"+tableId).find("tr:eq("+this.frozeIndex+")").show();
	//并置为100%
	$("#"+tableId).css("width",width?width:(this.width?this.width:"100%"));
	//系统会自动对表格所有列宽进行调整
	var width = [];
	//设置表格的宽度固定大小与系统自动调整后的大小一样
	$("#"+tableId+"headDiv").find("table:first").width($("#"+tableId).width());
	$("#"+tableId).width($("#"+tableId).width());
	//获取表头的每一列列宽
	$("#"+tableId).find("tr:eq("+this.frozeIndex+")").find("th").each(function(){
		width.push($(this).width());
	})
	//将表头添加到headDiv，如果表头还未添加
	if($("#"+tableId+"headDiv").find("th").length==0){
		$("#"+tableId+"headDiv").find("table:first")[0].appendChild($("#"+tableId).find("thead")[0].cloneNode(true));
		$("#"+tableId+"headDiv").find("input[type='checkbox']").bind('click',function(){
			$("#"+tableId).find("thead:first").find('input[type="checkbox"]').click();
		});
	}
	//定义表格第一行数据每列的宽度
	$("#"+tableId).find("tr:eq("+(this.frozeIndex+1)+")").find("td").each(function(idx){
		$(this).width(width[idx]);
	})
	//定义表格表头每列的宽度
	$("#"+tableId+"headDiv").find("thead").find("th").each(function(idx){
		$(this).width(width[idx]);
	});
	
	//隐藏源数据表格的表头
	$("#"+tableId).find("tr:eq("+this.frozeIndex+")").hide();
	
	//如果调整完后，表格数据有滚动条，需要将表头的div容器宽度减去滚动条的宽度
	if($("#"+tableId).parent().height()<$("#"+tableId).height()&&
			$("#"+tableId).parent().width()<=$("#"+tableId).width()){
		$("#"+tableId+"headDiv").width($("#"+tableId).parent().width()-17);
	}
	
	//如果没有滚动条，但是表格的宽度达不到容器div的宽度，重新调整宽度与div宽度一样 
	if($("#"+tableId).parent().height()>=$("#"+tableId).height()&&
			$("#"+tableId).width()<$("#"+tableId).parent().width()){
		$("#"+tableId+"headDiv").find("table:first").width($("#"+tableId).parent().width()-1);
		$("#"+tableId).width($("#"+tableId).parent().width()-1);
	}else if($("#"+tableId).parent().height()>=$("#"+tableId).height()&&
			$("#"+tableId+"headDiv").width()<$("#"+tableId).parent().width()){
		//如果没有竖滚动条，且表头的宽度小于表格数据的宽度
		$("#"+tableId+"headDiv").find("table:first").width($("#"+tableId).width());
		$("#"+tableId+"headDiv").width($("#"+tableId).parent().width())
	}
	
}

FrontCommon.CommonTable.prototype.hidePage = function(){
	document.getElementById(this.tableId+'_pt_outTab').style.display = "none";
}

FrontCommon.CommonTable.prototype.frozenPage = function(){
	document.getElementById(this.tableId+'_pt_outTab').style.width = "100%";
	document.getElementById(this.tableId+'_pt_outTab').style.borderTop = "1px solid #ccc";
    document.getElementById(this.tableId+'pageContainer').appendChild(document.getElementById(this.tableId+'_pt_outTab'))
}

/**
 * 自定义json格式对象，输出json格式text文本
 */
FrontCommon.jsonObj = function(data){
	for(attr in data){
		this[attr] = data[attr];
		if(this.isArray(attr)){//如果是数组，继续迭代产生新对象
			for(var i=0;i<this[attr].length;i++){
				this[attr][i] = new FrontCommon.jsonObj(this[attr][i]);
			}
		}
	}
}


/**
 * 定义其toString方法
 */
FrontCommon.jsonObj.prototype.toString = function(){
	var returnText = "{";
	for(attr in this){
		if(typeof(this[attr])=='string'){
			returnText+="\""+attr+"\":\""+this[attr]+"\",";
		}else if(this.isArray(attr)){
			returnText+="\""+attr+"\":[";
			for(var i=0;i<this[attr].length;i++){
				returnText += this[attr].toString()+(i==this[attr].length-1?"":",");
			}
			returnText+="],";
		}else if(typeof(this[attr])=='function'){
			
		}else{
			returnText+="\""+attr+"\":"+this[attr]+",";
		}
	}
	
	returnText = (returnText=="{"?returnText:returnText.substring(0,returnText.length-1))+"}";
	
	return returnText;
}

FrontCommon.jsonObj.prototype.isArray = function(attr){  
  return Object.prototype.toString.call(this[attr]) == '[object Array]';   
}

/**
 * 生成选项卡，bootstrap风格
 * @param configSetting 选项卡配置：{id:'myTab',tabs:[{id:'home',text:'Home',content:'',type:'iframe'}],height:'400px'}
 */
FrontCommon.newTab = function(configSetting,skin){  
  this.tabDom = document.createElement('ul');
  this.tabDom.setAttribute("id",configSetting.id);
  this.tabDom.setAttribute("class","nav "+(skin?skin:"nav-pills"));
  this.contentDom = document.createElement('div');
  this.contentDom.setAttribute("id",configSetting.id+"Content");
  this.contentDom.setAttribute("class","tab-content tabContentDiv_"+(skin?skin:"nav-pills"));
  if(configSetting.height)this.contentDom.style.height = configSetting.height;
  if(configSetting.tabs&&configSetting.tabs.length>0){
	  for(var i=0;i<configSetting.tabs.length;i++){
		  this.tabDom.innerHTML += "<li tabIndex="+i+" class=\""+(i==0?"active":"")+"\"><a href=\"#"+configSetting.tabs[i].id+"\" data-toggle=\"tab\">"+configSetting.tabs[i].text+"</a></li>";
		  var contentHtml = "<div class=\"tab-pane fade"+(i==0?" in active":"")+"\" id=\""+configSetting.tabs[i].id+"\" style=\"height:100%\">";
		  if(configSetting.tabs[i].type&&configSetting.tabs[i].type=='iframe'){
			  contentHtml += "<iframe url=\""+configSetting.tabs[i].content+"\" src=\""+(i==0?configSetting.tabs[i].content:"about:blank")+"\" frameborder=\"0\" scrolling=\"no\" style=\"width:100%;height:100%\"></iframe>";
		  }else{
			  contentHtml += configSetting.tabs[i].content;
		  }
		  this.contentDom.innerHTML += contentHtml+"</div>";
	  }
	  
	  $(this.tabDom).children("li").bind("click",function(){
		  var tabIndex = $(this).attr('tabIndex');
		  var tabFrame = $("#"+configSetting.tabs[tabIndex].id).find("iframe")[0];
		  var tabId = configSetting.tabs[tabIndex].id;
		  if(tabFrame.src=="about:blank"){
			 
			  setTimeout(function(){
				  tabFrame.src = $(tabFrame).attr('url');
				  if(configSetting.tabs[tabIndex].click)configSetting.tabs[tabIndex].click(tabId);
			  },200);
		  }else{
			  if(configSetting.tabs[tabIndex].click)configSetting.tabs[tabIndex].click(tabId);
		  }
	  })
  }
}

FrontCommon.hasRight = function(settingData,rightId){
	if(settingData&&settingData.length>0){
		for(var idx in settingData){
			if(settingData[idx].id == rightId){
				return true;
			}else if(settingData[idx].module&&settingData[idx].module.length>0){
				var has = FrontCommon.hasRight(settingData[idx].module,rightId);
				if(has)return has;
			}
		}
	}
	return false;
}

FrontCommon.getRightByParent = function(settingData,parentId){
	if(!parentId)return [];
	if(settingData&&settingData.length>0){
		for(var idx in settingData){
			if(settingData[idx].id == parentId){
				return settingData[idx].module;
			}else if(settingData[idx].module&&settingData[idx].module.length>0){
				var has = FrontCommon.getRightByParent(settingData[idx].module,parentId);
				if(has!=undefined)return has;
			}
		}
	}
}

FrontCommon.newTab.prototype.appendToContainer = function(containerId){
	document.getElementById(containerId).appendChild(this.tabDom);
	document.getElementById(containerId).appendChild(this.contentDom);
}

/**
 * 生成左右列表
 * @param 
 */
FrontCommon.SelectList = function(leftSetting,buttons,rightSetting,dataSetting,containerId){  
  this.dataSetting = $.extend({label:"label",value:"value",buttonPadding:50,buttonPaddingLeft:0,multiple:false},dataSetting);
  this.leftSetting = leftSetting;
  this.rightSetting = rightSetting;
  this.leftControlDom = this.createListControl(leftSetting);
  this.leftControlDom.appendTo($('#'+containerId));
  this.controlButtonDom = this.createButtonControl(buttons);
  this.controlButtonDom.appendTo($('#'+containerId));
  this.rightControlDom = this.createListControl(rightSetting);
  this.rightControlDom.appendTo($('#'+containerId));
  
  var selectListObj = this;
  selectListObj.leftSelected = [];
  selectListObj.rightSelected = [];
  
  this.leftControlDom.children("div").children("a").each(function(){
	  $(this).bind("click",function(){
		  selectListObj.clickSelected(selectListObj.leftSelected,this,selectListObj.dataSetting.multiple);
	  })
	  
	  $(this).bind("keydown",function(e){
		  if(e.keyCode==16){
			  selectListObj.shiftDown = true;
		  }
	  })
	  
	   $(this).bind("keyup",function(e){
		  if(e.keyCode==16){
			  selectListObj.shiftDown = false;
		  }
	  })
  })
  
  this.rightControlDom.children("div").children("a").each(function(){
	  $(this).bind("click",function(){
		  selectListObj.clickSelected(selectListObj.rightSelected,this,selectListObj.dataSetting.multiple);
	  })
	  
	  $(this).bind("keydown",function(e){
		  if(e.keyCode==16){
			  selectListObj.shiftDown = true;
		  }
	  })
	  
	   $(this).bind("keyup",function(e){
		  if(e.keyCode==16){
			  selectListObj.shiftDown = false;
		  }
	  })
  })
}

FrontCommon.SelectList.prototype.getValue = function(){
	var value = "";
	this.rightControlDom.children("div").children("a").each(function(){
		value+=$(this).attr('data-value')+",";
	});
	
	return value!=""?value.substring(0,value.length-1):value;
}

FrontCommon.SelectList.prototype.reset = function(){
	this.leftSelected.splice(0,this.leftSelected.length);
	this.rightSelected.splice(0,this.rightSelected.length);
	this.controlReset(this.leftControlDom,this.leftSetting,this.leftSelected);
	this.controlReset(this.rightControlDom,this.rightSetting,this.rightSelected);
}

FrontCommon.SelectList.prototype.cancelSelected = function(left){
	if(left){
		$(this.leftSelected).each(function(idx){
			$(this).removeClass("selected");
		});
		this.leftSelected.splice(0,this.leftSelected.length);//清空
	}else{
		$(this.rightSelected).each(function(idx){
			$(this).removeClass("selected");
		});
		this.rightSelected.splice(0,this.rightSelected.length);//清空
	}
}

FrontCommon.SelectList.prototype.controlReset = function(controlDom,controlSetting,selectedArr){
	var selectListObj = this;//数据列表还原
	controlDom.find("div[class='frontCommonListDiv']").empty();
	for(var idx in controlSetting.datas){
		$("<a href=\"javascript:void(0)\" class=\"list-group-item\" data-value=\""+controlSetting.datas[idx][this.dataSetting.value]+"\"><p class=\"list-group-item-text\">"+controlSetting.datas[idx][this.dataSetting.label]+"</p>").appendTo(controlDom.find("div[class='frontCommonListDiv']"))[0].relateObj = controlSetting.datas[idx];
	}
	controlDom.find("div[class='frontCommonListDiv']").children("a").each(function(){
		  $(this).bind("click",function(){
			  selectListObj.clickSelected(selectedArr,this,selectListObj.dataSetting.multiple);
		  })
		  
		  $(this).bind("keydown",function(e){
			  if(e.keyCode==16){
				  selectListObj.shiftDown = true;
			  }
		  })
	  
		  $(this).bind("keyup",function(e){
			  if(e.keyCode==16){
				  selectListObj.shiftDown = false;
			  }
		  })
	})
}

FrontCommon.SelectList.prototype.clickSelected = function(selectedObj,clickObj,multiple){
	  if($(clickObj).attr('class').indexOf("selected")>-1){
		  $(clickObj).removeClass("selected");
		  selectedObj.splice(selectedObj.indexOf(clickObj),1);
	  }else{
		  if(!multiple&&selectedObj[0]){
			  $(selectedObj[0]).removeClass("selected");
		  }
		  if(multiple){
			  if(this.shiftDown&&this.lastSelectedObj){//如果shift按键下去了
				  var as = $(clickObj).parent().find("a");
				  //首先获取第0个选中的数据所处位置
				  var lastObjDomIndex = getObjIndex(this.lastSelectedObj);//最后选中的dom节点所在div的索引位置
				  var clickObjDomIndex = getObjIndex(clickObj);//点击的dom节点所在div的索引位置
				  var lastObjSelectedIndex = selectedObj.indexOf(this.lastSelectedObj);//最后点击dom节点所在选中节点的数组索引位置
				  //开始插入到数组的位置
				  var insertStartIndex = clickObjDomIndex>lastObjDomIndex?lastObjSelectedIndex:lastObjSelectedIndex-1;
				  //dom节点开始shift选中的位置
				  var startIndex = clickObjDomIndex>lastObjDomIndex?lastObjDomIndex:clickObjDomIndex;
				//dom节点结束shift选中的位置
				  var endIndex = clickObjDomIndex>lastObjDomIndex?clickObjDomIndex:lastObjDomIndex;
				  for(i=startIndex;i<=endIndex;i++){
					  if($(as[i]).attr('class').indexOf("selected")<0){
						  //选中
						  $(as[i]).addClass("selected");
						  selectedObj.splice(++insertStartIndex,0,as[i]);//需要按顺序写入数据到数组
					  }else{
						  selectedObj.splice(selectedObj.indexOf(as[i]),1);//先截掉该数据
						  selectedObj.splice(insertStartIndex++,0,as[i]);//需要按顺序写入数据到数组
					  }
				  }
			  }else{
				  var writeIndex = getInsertIndex(selectedObj,clickObj);
				  selectedObj.splice(writeIndex,0,clickObj);//需要按顺序写入数据到数组
				  this.lastSelectedObj = clickObj;//赋值最后一个选中的列表选项
			  }
		  }else{
			  selectedObj.splice(0,1,clickObj);
		  }
		  
		  $(clickObj).addClass("selected");
	  }
	  
	  function getObjIndex(obj){
		  var objIndex = 0;
		  var continueFlag = true;
		  $(obj).parent().find("a").each(function(){
			  if(continueFlag){
				  if(obj!=this){
					  objIndex++
				  }else{
					  continueFlag = false;
				  }
			  }
		  });
		  
		  return objIndex;
	  }
	  
	  function getInsertIndex(insertList,obj,objIndex){
		  objIndex = objIndex!=undefined?objIndex:getObjIndex(obj);
		  
		  var arr = $(obj).parent().find("a");
		  for(var idx in insertList){
			  var rowIndex = 0;
			  for(var idx2 in arr){
				  if(arr[idx2]==insertList[idx]){break;}
				  else{rowIndex++}
			  }
			  if(rowIndex>objIndex)return parseInt(idx);
		  }
		  
		  return insertList.length;
	  }
}

/**
 * 左边列表选中数据移动到右边列表
 */
FrontCommon.SelectList.prototype.selectedLeftToRight = function(){
	if(this.leftSelected.length==0)return;//如果左边列表没有选中的，不管
	var selectListObj = this;
	
	var len =  selectListObj.rightSelected.length;//首先取消右边选中的数据
	for(var i=0;i<len;i++){
		this.clickSelected(this.rightSelected,this.rightSelected[0],this.dataSetting.multiple);
	}
	var appDiv = selectListObj.rightControlDom.find("div[class='frontCommonListDiv']");
	$(this.leftSelected).each(function(idx){
		if(this.style.display!='none'){//如果不是隐藏的
			appDiv.append($(this));
			$(this).unbind('click').bind('click',function(){
				selectListObj.clickSelected(selectListObj.rightSelected,this,selectListObj.dataSetting.multiple);
			});
			selectListObj.rightSelected.push(this);
		}
	});
	this.leftSelected.splice(0,this.leftSelected.length);//清空左边选中数组
	
	var lastData = selectListObj.rightControlDom.find("div[class='frontCommonListDiv']").find("a:last");
	lastData.focus();
	lastData.blur();
}

/**
 * 右边列表选中数据移动到左边列表
 */
FrontCommon.SelectList.prototype.selectedRightToLeft = function(){
	if(this.rightSelected.length==0)return;//如果右边列表没有选中的，不管
	var selectListObj = this;
	
	var len =  selectListObj.leftSelected.length;//首先取消左边选中的数据
	for(var i=0;i<len;i++){
		this.clickSelected(this.leftSelected,this.leftSelected[0],this.dataSetting.multiple);
	}
	
	var appDiv = selectListObj.leftControlDom.find("div[class='frontCommonListDiv']");
	$(this.rightSelected).each(function(idx){
		if(this.style.display!='none'){//如果不是隐藏的
			appDiv.append($(this));
			$(this).unbind('click').bind('click',function(){
				selectListObj.clickSelected(selectListObj.leftSelected,this,selectListObj.dataSetting.multiple);
			});
			selectListObj.leftSelected.push(this);
		}
	});
	this.rightSelected.splice(0,this.rightSelected.length);//清空右边选中数组
	
	var lastData = selectListObj.leftControlDom.find("div[class='frontCommonListDiv']").find("a:last");
	lastData.focus();
	lastData.blur();
}

/**
 * 所有左边数据往右边移动
 */
FrontCommon.SelectList.prototype.allToRight = function(){
	var selectListObj = this;
	var len =  selectListObj.leftSelected.length;//首先取消左边选中的数据
	for(var i=0;i<len;i++){
		this.clickSelected(this.leftSelected,this.leftSelected[0],this.dataSetting.multiple);
	}
	
	//左边列表所有数据往右走
	var appDiv = selectListObj.rightControlDom.find("div[class='frontCommonListDiv']");
	selectListObj.leftControlDom.find("div[class='frontCommonListDiv']").children("a").each(function(idx){
		if(this.style.display!='none'){
			appDiv.append($(this));
			$(this).unbind('click').bind('click',function(){
				selectListObj.clickSelected(selectListObj.rightSelected,this,selectListObj.dataSetting.multiple);
			});
		}
	});
	
}

/**
 * 所有右边数据往左边移动
 */
FrontCommon.SelectList.prototype.allToLeft = function(){
	var selectListObj = this;
	var len =  selectListObj.rightSelected.length;//首先取消右边选中的数据
	for(var i=0;i<len;i++){
		this.clickSelected(this.rightSelected,this.rightSelected[0],this.dataSetting.multiple);
	}
	
	//右边列表所有数据往左走
	var appDiv = selectListObj.leftControlDom.find("div[class='frontCommonListDiv']");
	selectListObj.rightControlDom.find("div[class='frontCommonListDiv']").children("a").each(function(idx){
		if(this.style.display!='none'){
			appDiv.append($(this));
			$(this).unbind('click').bind('click',function(){//重新绑定click事件
				selectListObj.clickSelected(selectListObj.leftSelected,this,selectListObj.dataSetting.multiple);
			});
		}
	});
	
}

/**
 * 右边选中数据上移
 */
FrontCommon.SelectList.prototype.dataUp = function(){
	//所有右边选中数据写入前个节点之前
	var continueFlag = true;
	$(this.rightSelected).each(function(){
		if(continueFlag){
			var beforeNode = $(this).prev("a");
			if(beforeNode.length>0){
				beforeNode.before($(this));
			}else{
				alert("已到顶！");
				continueFlag = false;
			}
		}
	});
	
	this.rightSelected[0].focus();
	this.rightSelected[0].blur();
}

/**
 * 右边选中数据下移
 */
FrontCommon.SelectList.prototype.dataDown = function(){
	//所有右边选中数据写入后个节点之后
	var continueFlag = true;
	for(var idx = this.rightSelected.length-1;idx>=0;idx--){
		if(continueFlag){
			var obj = this.rightSelected[idx];
			var nextNode = $(obj).next("a");
			if(nextNode.length>0){
				nextNode.after($(obj));
			}else{
				alert("已到底！");
				continueFlag = false;
			}
		}
	}
	
	this.rightSelected[this.rightSelected.length-1].focus();
	this.rightSelected[this.rightSelected.length-1].blur();
}

FrontCommon.SelectList.prototype.createButtonControl = function(buttons){
	 var controlButtonDom = $("<div class=\"list-group\" style=\"float: left; width: 100px; padding-left:"+this.dataSetting.buttonPaddingLeft+"px; padding-top:"+this.dataSetting.buttonPadding+"px\">");
	 var buttonHtml = "";
	 for(var idx in buttons)buttonHtml+="<a href=\"javascript:void(0)\" style=\"margin-left:5px;width:70px;\" id=\""+buttons[idx].id+"\" onclick=\""+(buttons[idx].click&&$.trim(buttons[idx].click)!=''?buttons[idx].click+"()":"")+"\" class=\"btn btn-"+buttons[idx].type+"\"><i class=\"glyphicon glyphicon-"+buttons[idx].icon+"\"></i> "+buttons[idx].text+"</a><br/><br/>";
	 $(buttonHtml).appendTo(controlButtonDom);
	 return controlButtonDom;
}

/**
 * 创建左右列表html控件数据
 * @param controlSetting 控件设置相关数据
 * @param dataSetting 数据设置
 * @returns 返回生成的控件
 */
FrontCommon.SelectList.prototype.createListControl = function(controlSetting){
	 var controlListDom = $("<div class=\"list-group\" style=\"float: left; width: "+(controlSetting.width?controlSetting.width:200)+"px\">");
	 $("<a href=\"#\" class=\"list-group-item active\"><h4 class=\"list-group-item-heading\">"+controlSetting.title+"</h4></a>").appendTo(controlListDom);
	 var listHtml = "<div class=\"frontCommonListDiv\" style=\"height:"+(controlSetting.height?controlSetting.height:400)+"px;overflow:auto;\">";
	 for(var idx in controlSetting.datas)listHtml+="<a href=\"javascript:void(0)\" class=\"list-group-item\" data-value=\""+controlSetting.datas[idx][this.dataSetting.value]+"\"><p class=\"list-group-item-text\">"+controlSetting.datas[idx][this.dataSetting.label]+"</p>";
	 listHtml+="</div>";
	 $(listHtml).appendTo(controlListDom).find("a").each(function(idx){
		 this.relateObj = controlSetting.datas[idx];
	 });
	 return controlListDom;
}

/**
 * 打开编辑弹窗，用户自定义表格
 * @param dialogSettings 弹出层参数设置
 * @param formItems 用户自定义的表单项
 */
FrontCommon.openEditDialog = function(dialogSettings,form,formItems,record){
	//先调用layer.open弹出编辑框
	if(dialogSettings.buttons&&dialogSettings.buttons.length>0){//如果用户自定义了button
		dialogSettings.btn = [];
		for(var i=0;i<dialogSettings.buttons.length;i++){
			dialogSettings.btn.push(dialogSettings.buttons[i].text);
			if(i==0){
				dialogSettings.yes = dialogSettings.buttons[i].click;
			}else{
				eval("dialogSettings.btn"+(i+1)+"=dialogSettings.buttons[i].click");
			}
		}
	}
	var settingSuccess = dialogSettings.success;
	var layerIndex = layer.open($.extend(dialogSettings,{type:2,success: function(layero, index){
		var iframeWin = window[layero.find('iframe')[0]['name']];
		if(form&&iframeWin.initForm){
			iframeWin.initForm(form,formItems,record);
		}
		if(settingSuccess)settingSuccess(layero, index);
	}}));
	//修改样式
	top.$(".layui-layer-btn").children("a").each(function(idx){
		$(this).css("margin-left","5px");
		$(this).attr("class","btn btn-"+(dialogSettings.buttons[idx].type?dialogSettings.buttons[idx].type:"primary"));
		$(this).html("<i class='glyphicon glyphicon-"+dialogSettings.buttons[idx].icon+"'><span style=\"margin-left:5px;\">"+$(this).text()+"</span></i>");
	});
	top.$(".layui-layer-btn").attr('class','').css({padding:'10px 10px 0px 0px',width:"100%","border-top":"1px solid #ccc","text-align":"right"});
	
	return layerIndex;
}

/**
 * 根据日期格式，自动获取日期的字符创
 */
FrontCommon.getDateStr = function(format,date){
	var returnStr = format;
	returnStr = returnStr.replace(/y{1,4}/ig,date.getFullYear()+"");
	returnStr = returnStr.replace(/M{1,2}/g,date.getMonth()+1 < 10 ? "0"+(date.getMonth()+1) : date.getMonth()+1+"");
	returnStr = returnStr.replace(/d{1,2}/ig,date.getDate() < 10 ? "0"+date.getDate() : date.getDate()+"");
	
	returnStr = returnStr.replace(/m{1,2}/g,date.getMinutes() < 10 ? "0"+date.getMinutes() : date.getMinutes()+"");
	returnStr = returnStr.replace(/h{1,2}/ig,date.getHours() < 10 ? "0"+date.getHours() : date.getHours()+"");
	returnStr = returnStr.replace(/s{1,2}/ig,date.getSeconds() < 10 ? "0"+date.getSeconds() : date.getSeconds()+"");
	
	return returnStr;
}

/**
 * 根据日期格式，自动获取日期的字符创
 */
FrontCommon.getDateForStr = function(format,str){
	var returnDate = new Date();
	var yearMatchArr = format.match(/y{1,4}/ig);
	if(yearMatchArr){
		yearStr = yearMatchArr[0];
		returnDate.setFullYear(parseInt(str.substring(format.indexOf(yearStr),format.indexOf(yearStr)+yearStr.length)));
	}
	var monthMatchArr = format.match(/M{1,2}/g);
	if(monthMatchArr){
		monthStr = monthMatchArr[0];
		returnDate.setMonth(parseInt(str.substring(format.indexOf(monthStr),format.indexOf(monthStr)+monthStr.length))-1);
	}
	var dateMatchArr = format.match(/d{1,2}/g);
	if(dateMatchArr){
		dateStr = dateMatchArr[0];
		returnDate.setDate(parseInt(str.substring(format.indexOf(dateStr),format.indexOf(dateStr)+dateStr.length)));
	}
	var hourMatchArr = format.match(/h{1,2}/ig);
	if(hourMatchArr){
		hourStr = hourMatchArr[0];
		returnDate.setHours(parseInt(str.substring(format.indexOf(hourStr),format.indexOf(hourStr)+hourStr.length)));
	}
	var minuteMatchArr = format.match(/m{1,2}/g);
	if(minuteMatchArr){
		minuteStr = minuteMatchArr[0];
		returnDate.setMinutes(parseInt(str.substring(format.indexOf(minuteStr),format.indexOf(minuteStr)+minuteStr.length)));
	}
	var secondMatchArr = format.match(/s{1,2}/g);
	if(secondMatchArr){
		secondStr = secondMatchArr[0];
		returnDate.setSeconds(parseInt(str.substring(format.indexOf(secondStr),format.indexOf(secondStr)+secondStr.length)));
	}
	
	return returnDate;
	
}

FrontCommon.extendFormData = function(formId){
	var returnData = {};
	var data = $('#'+formId).serializeArray();
	$.each(data, function(i, field){
	    if(!returnData[field.name]){
	    	var value = field.value;
	    	var formItem = $("[name='"+field.name+"']");
	    	formItem.each(function(idx){
	    		if(idx==0&&$(this).attr('type')=='checkbox'){
	    			//拼接值
	    			value = "";
	    		}
	    		if($(this).attr('type')=='checkbox'&&$(this).is(":checked")){
	    			value += $(this).val()+",";
	    		}
	    		if($(this).attr('type')=='checkbox'&&idx==formItem.length-1){
	    			if(value.indexOf(",")>-1)value=value.substring(0,value.length-1);
	    		}
	    	});
	    	returnData[field.name] = value;
	    }
  	});
	return returnData;
}

/**
 * 添加下拉树点击页面其他地方消失事件
 */
$(document).bind('mouseup',function(e){
	var tar = e.target;
	while(tar&&tar.nodeName!="BODY"){
		if($(tar).attr('class')&&$(tar).attr('class').indexOf('combo')>-1){
			e.preventDefault();
			return;
		}
		tar = tar.parentNode;
	}
	$('.combotree_div').hide();
	$('.suggetst_div').hide();
});

$(document).keydown(function(e){   
    var keyEvent;   
    if(e.keyCode==8){   
        var d=e.srcElement||e.target;   
         if(d.tagName.toUpperCase()=='INPUT'||d.tagName.toUpperCase()=='TEXTAREA'){   
             keyEvent=d.readOnly||d.disabled;   
         }else{   
             keyEvent=true;   
         }   
     }else if(e.keyCode==13){//屏蔽回车提交第一个表单
    	 keyEvent=true;
     }else{   
         keyEvent=false;   
     }   
     if(keyEvent){   
         e.preventDefault();   
     }   
});

Array.prototype.indexOf = function(obj){
	for(var idx in this){
		if(this[idx] == obj)return parseInt(idx);
	}
	
	return -1;
}

//by zhangxinxu welcome to visit my personal website http://www.zhangxinxu.com/
//2010-03-12 v1.0.0
//十六进制颜色值域RGB格式颜色值之间的相互转换

//-------------------------------------
//十六进制颜色值的正则表达式
var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*RGB颜色转换为16进制*/
String.prototype.colorHex = function () {
 var that = this;
 if (/^(rgb|RGB)/.test(that)) {
     var aColor = that.replace(/(?:\(|\)|rgb|RGB)*/g, "").split(",");
     var strHex = "#";
     for (var i = 0; i < aColor.length; i++) {
         var hex = Number(aColor[i]).toString(16);
         if (hex === "0") {
             hex += hex;
         }
         strHex += hex;
     }
     if (strHex.length !== 7) {
         strHex = that;
     }
     return strHex;
 } else if (reg.test(that)) {
     var aNum = that.replace(/#/, "").split("");
     if (aNum.length === 6) {
         return that;
     } else if (aNum.length === 3) {
         var numHex = "#";
         for (var i = 0; i < aNum.length; i += 1) {
             numHex += (aNum[i] + aNum[i]);
         }
         return numHex;
     }
 } else {
     return that;
 }
};

//-------------------------------------------------

/*16进制颜色转为RGB格式*/
String.prototype.colorRgb = function () {
 var sColor = this.toLowerCase();
 if (sColor && reg.test(sColor)) {
     if (sColor.length === 4) {
         var sColorNew = "#";
         for (var i = 1; i < 4; i += 1) {
             sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
         }
         sColor = sColorNew;
     }
     //处理六位的颜色值
     var sColorChange = [];
     for (var i = 1; i < 7; i += 2) {
         sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
     }
     return "RGB(" + sColorChange.join(",") + ")";
 } else {
     return sColor;
 }
};

//定义系统的容器路径
var contextPath = location.href.replace(/http:/ig,"").replace('//',"");
var hostName = contextPath.substring(0,contextPath.indexOf('/'));
contextPath = contextPath.substring(contextPath.indexOf('/')+1);
contextPath = contextPath.substring(0,contextPath.indexOf('/'));
contextPath = "/"+contextPath;