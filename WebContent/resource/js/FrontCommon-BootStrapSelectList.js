(function($, window){
	
	window.BootStrapSelectList = new Object();
	
	/**
	 * 生成左右列表
	 * @param 
	 */
	BootStrapSelectList = function(dataSetting){
	  this.dataSetting = $.extend({
		  label:"label",//label对应的数据属性
		  value:"value",//value对应的数据属性
		  buttonPadding:50,//按钮工具栏padding
		  buttonPaddingLeft:10,//按钮工具栏padding
		  multiple:true,//是否支持多选
		  leftDatas:[],//左边列表数据
		  rightDatas:[],//右边列表数据
		  leftTitle:'',//左边列表title
		  rightTitle:'',//右边列表title
		  buttons: [{text:">",title:'选中向右',icon:'',type:'warning',click:function(){this.selectedLeftToRight()}},//所有按钮
           			{text:"<",title:'选中向左',icon:'',type:'warning',click:function(){this.selectedRightToLeft()}},
           			{text:">>",title:'全部向右',icon:'',type:'warning',click:function(){this.allToRight()}},
           			{text:"<<",title:'全部向左',icon:'',type:'warning',click:function(){this.allToLeft()}},
           			{text:"×",title:'取消选中',icon:'',type:'warning',click:function(){this.cancelSelected(true);this.cancelSelected(false);}}],
		  width: 200,
		  height: 400,
		  container: null
	  },dataSetting);
	  if(this.dataSetting.container)this.appendTo(this.dataSetting.container);
	}
	
	BootStrapSelectList.prototype.appendTo = function(container){
		if(typeof(container)=="string"){
			container = document.getElementById(container);
		}
	    this.leftControlDom = this.createListControl(this.dataSetting.leftDatas,this.dataSetting.leftTitle);
	    this.leftControlDom.appendTo($(container));//添加左边列表
	    this.controlButtonDom = this.createButtonControl(this.dataSetting.buttons);
		this.controlButtonDom.appendTo($(container));//添加按钮
		this.rightControlDom = this.createListControl(this.dataSetting.rightDatas,this.dataSetting.rightTitle);
		this.rightControlDom.appendTo($(container));//添加右边按钮
		  
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

	BootStrapSelectList.prototype.getValue = function(){
		var value = "";
		this.rightControlDom.children("div").children("a").each(function(){
			value+=$(this).attr('data-value')+",";
		});
		
		return value!=""?value.substring(0,value.length-1):value;
	}
	
	BootStrapSelectList.prototype.getText = function(){
		var value = "";
		this.rightControlDom.children("div").children("a").each(function(){
			value+=$(this).text()+",";
		});
		
		return value!=""?value.substring(0,value.length-1):value;
	}
	
	//控件重置,相当于刷新
	BootStrapSelectList.prototype.reset = function(){
		this.leftSelected.splice(0,this.leftSelected.length);
		this.rightSelected.splice(0,this.rightSelected.length);
		this.controlReset(this.leftControlDom,this.dataSetting.leftDatas,this.leftSelected);
		this.controlReset(this.rightControlDom,this.dataSetting.rightDatas,this.rightSelected);
	}

	BootStrapSelectList.prototype.cancelSelected = function(left){
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

	BootStrapSelectList.prototype.controlReset = function(controlDom,datas,selectedArr){
		var selectListObj = this;//数据列表还原
		controlDom.find(".frontCommonListDiv").empty();
		for(var idx in datas){
			$("<a href=\"javascript:void(0)\" class=\"list-group-item\" data-value=\""+datas[idx][this.dataSetting.value]+"\"><p class=\"list-group-item-text\">"+datas[idx][this.dataSetting.label]+"</p>").appendTo(controlDom.find(".frontCommonListDiv"))[0].relateObj = datas[idx];
		}
		controlDom.find(".frontCommonListDiv").children("a").each(function(){
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

	BootStrapSelectList.prototype.clickSelected = function(selectedObj,clickObj,multiple){
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
	BootStrapSelectList.prototype.selectedLeftToRight = function(){
		if(this.leftSelected.length==0)return;//如果左边列表没有选中的，不管
		var selectListObj = this;
		
		var len =  selectListObj.rightSelected.length;//首先取消右边选中的数据
		for(var i=0;i<len;i++){
			this.clickSelected(this.rightSelected,this.rightSelected[0],this.dataSetting.multiple);
		}
		var appDiv = selectListObj.rightControlDom.find(".frontCommonListDiv");
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
		
		var lastData = selectListObj.rightControlDom.find(".frontCommonListDiv").find("a:last");
		lastData.focus();
		lastData.blur();
	}

	/**
	 * 右边列表选中数据移动到左边列表
	 */
	BootStrapSelectList.prototype.selectedRightToLeft = function(){
		if(this.rightSelected.length==0)return;//如果右边列表没有选中的，不管
		var selectListObj = this;
		
		var len =  selectListObj.leftSelected.length;//首先取消左边选中的数据
		for(var i=0;i<len;i++){
			this.clickSelected(this.leftSelected,this.leftSelected[0],this.dataSetting.multiple);
		}
		
		var appDiv = selectListObj.leftControlDom.find(".frontCommonListDiv");
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
		
		var lastData = selectListObj.leftControlDom.find(".frontCommonListDiv").find("a:last");
		lastData.focus();
		lastData.blur();
	}

	/**
	 * 所有左边数据往右边移动
	 */
	BootStrapSelectList.prototype.allToRight = function(){
		var selectListObj = this;
		var len =  selectListObj.leftSelected.length;//首先取消左边选中的数据
		for(var i=0;i<len;i++){
			this.clickSelected(this.leftSelected,this.leftSelected[0],this.dataSetting.multiple);
		}
		
		//左边列表所有数据往右走
		var appDiv = selectListObj.rightControlDom.find(".frontCommonListDiv");
		selectListObj.leftControlDom.find(".frontCommonListDiv").children("a").each(function(idx){
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
	BootStrapSelectList.prototype.allToLeft = function(){
		var selectListObj = this;
		var len =  selectListObj.rightSelected.length;//首先取消右边选中的数据
		for(var i=0;i<len;i++){
			this.clickSelected(this.rightSelected,this.rightSelected[0],this.dataSetting.multiple);
		}
		
		//右边列表所有数据往左走
		var appDiv = selectListObj.leftControlDom.find(".frontCommonListDiv");
		selectListObj.rightControlDom.find(".frontCommonListDiv").children("a").each(function(idx){
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
	BootStrapSelectList.prototype.dataUp = function(){
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
	BootStrapSelectList.prototype.dataDown = function(){
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

	BootStrapSelectList.prototype.createButtonControl = function(buttons){
		var listObj = this;
		var controlButtonDom = $("<div class=\"list-group\" style=\"float: left; width: 100px; padding-left:"
				 +this.dataSetting.buttonPaddingLeft+"px; padding-top:"+this.dataSetting.buttonPadding+"px\"></div>");
		for(var idx in buttons){
			 (function(buttonObj){
				 $("<a href=\"javascript:void(0)\" title=\""+buttonObj.title+"\" style=\"margin-left:5px;width:70px;\" " +
			 	 "class=\"btn btn-"+buttonObj.type+"\"><i class=\"glyphicon glyphicon-"+buttonObj.icon+"\"></i> "+
			 	 buttonObj.text+"</a><br/><br/>").appendTo(controlButtonDom).click(function(){
			 		if(buttonObj.click&&typeof(buttonObj.click)=='function'){
			 			buttonObj.click.call(listObj);
			 		}
			 	 }); 
			 })(buttons[idx]);
		 }
		 return controlButtonDom;
	}

	/**
	 * 创建左右列表html控件数据
	 * @param controlSetting 控件设置相关数据
	 * @param dataSetting 数据设置
	 * @returns 返回生成的控件
	 */
	BootStrapSelectList.prototype.createListControl = function(datas,title){
		 this.width = typeof(this.dataSetting.width)=="number"?this.dataSetting.width+"px":this.dataSetting.width;
		 this.height = typeof(this.dataSetting.height)=="number"?this.dataSetting.height+"px":this.dataSetting.height;
		 var controlListDom = $("<div class=\"list-group\" style=\"float: left; width: "+this.width+"\">");
		 $("<a href=\"#\" class=\"list-group-item active\"><h4 class=\"list-group-item-heading\">"+title+"</h4></a>").appendTo(controlListDom);
		 var listHtml = "<div class=\"frontCommonListDiv panel-body\" style=\"padding:0px;height:"+this.height+";overflow:auto;\">";
		 for(var idx in datas){
			 listHtml+="<a href=\"javascript:void(0)\" class=\"list-group-item\" data-value=\""+datas[idx][this.dataSetting.value]+"\"><p class=\"list-group-item-text\">"+datas[idx][this.dataSetting.label]+"</p>";
		 }
		 listHtml+="</div>";
		 $(listHtml).appendTo(controlListDom).find("a").each(function(idx){
			 this.relateObj = datas[idx];
		 });
		 return controlListDom;
	}
	
})(jQuery, window);