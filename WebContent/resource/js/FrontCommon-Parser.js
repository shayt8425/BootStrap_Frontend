(function(window,$){//前台框架，html解析器
	
	//html属性大小写转换
	var transAttrArr = ["readOnly","uiType","labelClass","dateFmt","urlParams","dropmenuWidth","minDate","maxDate",
	                    "urlDataProp","jsonFormatOut","treeSetting","undefinedText","submitCodeProp","selectDataRequired",
	                    "sortName","sortOrder","sortStable","dataField","scrollPagination","remoteLimit","selectDataRequiredMesage",
	                    "contentType","dataType","ajaxOptions","queryParams","queryParamsType","responseHandler",
	                    "onlyInfoPagination","sidePagination","totalRows","pageNumber","pageSize","pageList",
	                    "paginationHAlign","paginationVAlign","paginationDetailHAlign","paginationPreText",
	                    "paginationNextText","searchOnEnterKey","strictSearch","searchAlign","selectItemName",
	                    "showHeader","showFooter","showColumns","showPaginationSwitch","showRefresh","showToggle",
	                    "buttonsAlign","smartDisplay","minimumCountColumns","idField","uniqueId","cardView",
	                    "detailView","detailFormatter","trimOnSearch","clickToSelect","singleSelect","popDir",
	                    "toolbarAlign","checkboxHeader","silentSort","maintainSelected","searchTimeOut","searchText",
	                    "iconSize","buttonsClass","iconsPrefix","customSearch","customSort","rowStyle","dataLimit",
	                    "rowAttributes","footerStyle","onAll","onClickCell","onDblClickCell","onClickRow",
	                    "onDblClickRow","onSort","onCheck","onUncheck","onCheckAll","onUncheckAll","defaultActiveTab",
	                    "onCheckSome","onUncheckSome","onLoadSuccess","onLoadError","onColumnSwitch","popVerticalDir",
	                    "onPageChange","onSearch","onToggle","onPreBody","onPostBody","onPostHeader","initPagination",
	                    "onExpandRow","onCollapseRow","onRefreshOptions","onRefresh","onResetView","validateType","onRightClickRow",
	                    "messageRequired","messageNumber","messageFloat","messagePattern","customValidate","loadingFunc",
	                    "sourceUrlDataProp","sourceData","sourceUrlParams","sourceUrl","clickLoad","autoHide","loadingCompleteFunc"];
	
	function getFormItemAttr(attr){
		for(var idx in transAttrArr){//因为html的属性只支持小写，需要将FormItem内部属性进行大小写转换
			if(transAttrArr[idx].toUpperCase()==attr.toUpperCase()){
				return transAttrArr[idx];
			}
		}
		
		return attr;
	}
	
	$.fn.extend({
		attributesParser:function(){
			var attrs = [];
			$(this).each(function(){
				var obj = {};//首先获取所有的attributes
				for(var idx = 0; idx < this.attributes.length; idx++){
					obj[getFormItemAttr(this.attributes[idx]["name"])] = FrontCommon.stringExpressionParse(this.attributes[idx]["value"]);
				}
				attrs.push(obj);
			});
			return attrs;
		},
		formParser:function(formConfig){//表单解析器
			var forms = [];
			$(this).each(function(){
				var configObj = $(this).attributesParser()[0];
				if(formConfig)configObj = $.extend(configObj,formConfig);
				var formObj = new FrontCommon.Form(configObj);
				//首先解析form对象
				formObj.domObj = this;
				var items = $(this).find("FormItem").formItemParser(formObj);
				//然后解析form内容的表单项对象
				formObj.items = items;
				for(var idx in formObj.items)formObj.items[idx].relateForm = formObj;
				forms.push(formObj);
			});
			return forms;
		},
		formItemParser:function(formObj){//表单项解析器
			var items = [];
			$(this).each(function(){
				var configObj = $(this).attributesParser()[0];
				if(formObj){//解析时，如果有form对象，默认使用form的uiType
					configObj = $.extend({uiType:formObj.formConfig.uiType},configObj);
				}else{
					configObj = $.extend({uiType:FrontCommon.uiType},configObj);
				}
				var item = FrontCommon.newFormItem(configObj);
				item.appendTo(this.parentNode);
				$(item.domObj).insertBefore($(this));
				items.push(item);
				$(this).remove();//然后移除掉这个临时元素
			})
			return items;
		},
		tableParser:function(){
			var tables = [];
			$(this).each(function(){
				var configObj = $(this).attributesParser()[0];
				var table = eval("FrontCommon.initTable(configObj,$(this).parent()[0])");
				tables.push(table);
				$(this).remove();//然后移除掉这个临时元素
			})
			return tables;
		},
		treeParser:function(){
			var trees = [];
			$(this).each(function(){
				var configObj = $(this).attributesParser()[0];
				var tree = eval("FrontCommon.initTree(configObj,$(this).parent()[0])");
				trees.push(tree);
				$(this).remove();//然后移除掉这个临时元素
			})
			return trees;
		},
		tabParser:function(){
			var tabs = [];
			$(this).each(function(){
				var configObj = $(this).attributesParser()[0];
				var tab = eval("FrontCommon.initTab(configObj,$(this).parent()[0])");
				tabs.push(tab);
				$(this).remove();//然后移除掉这个临时元素
			})
			return tabs;
		}
	})
	
	var staticExprArr = ["null","undefined","true","false"]
	
	Array.prototype.indexOf = function(obj){
		for(var idx in this){
			if(this[idx]==obj)return idx;
		}
		return -1;
	}
	
	/**
	 * 对字符串表达式进行解析
	 */
	FrontCommon.stringExpressionParse = function(expression){
		var expr = $.trim(expression.toString());
		if(staticExprArr.indexOf(expr)>-1){//如果是常用变量，如undefined,null,true,false等
			return eval(expr);
		}else if(/^[\d]{0,}$/.test(expr)){//如果是数字
			//parseInt之后如果一样才可以转数字
			return parseInt(expr)+""==expr?parseInt(expr):expr;
		}else if(/^[\d]{0,}(\.)[\d]{1,}$/.test(expr)){//如果是小数
			return parseFloat(expr);
		}else{
			if(expr.substring(0,1)==":"){
				eval("var obj = "+expr.substring(1));
				return obj;
			}else{
				return expr;
			}
		}
	}
})(window,jQuery)