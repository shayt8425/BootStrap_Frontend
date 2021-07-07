/**
 * base树定义
 * @param options
 * options:参数必须的一个参数为 mySetting 为用户自定义参数，此参数规定了一些常用的封装好的配置，
 * 		   如果需要完全自定义 也可以按照ztree官方提供的setting配置 http://www.ztree.me/v3/api.php
 * 	options参数示例：
 * 	{
 * 		mySetting:{
 * 			url:"",
 * 			chkStyle:"",
 * 			treeId:"",
 * 			treeType:"dailog",	//默认为dailog模式（弹出框模式，弹出框模式需要指定事件触发的dom id），还有self模式（这个为直接在页面展示的形式，需要指定页面中存在的treeId）
 * 			domId:"",			//如果为dailog模式，必须指定触发此弹出框的dom，可以是input，也可以是button...
 * 			title:"",			//如果是dailog模式，可以设置title
 * 			rightClickMenu:""	//如果需要右键菜单，请设置此参数
 * 			//右键菜单  示例
	  					rightClickMenu:{		//右键菜单
	  						menu1:{
	  							menuIcon:"fa fa-plus",	//菜单icon
	  							menuText:"增加",//菜单显示文字
	  							show:"root node",		//菜单显示场景，root 是点击树空白地方显示。node 是点击树节点显示
	  							clickEvent:function(selectedNodes,zTree,event){	//单击回调
	  								ztreeAdd(selectedNodes);
	  							}
	  						},
	  						menu2:{
	  							menuIcon:"icon-pencil",
	  							menuText:"修改",
	  							show:"node",
	  							clickEvent:function(selectedNodes,zTree,event){
	  								ztreeUpdate(selectedNodes);
	  							}
	  						},
	  					}
 * 
 * 			getIdAndName:"",	//返回id和名字串,还有所有选中的节点对象
 * 			getData:"",			//返回node对象数组，可以获取更全面的信息
 * 			onSuccess:function(event, treeId, treeNode, msg){} //标准的ztree加载成功的回调
 * 		}
 * 	}
 * Gavin 20170106
 */
var Tree = (function(Tree){
	
	/**
	 * 树生成方法
	 */
	Tree.create = function(options){
		var ztree = "";
		var defaults = {
			//自定义参数的默认参数
			mySetting:{
				url:"",
				chkStyle:"",
				treeId:"",
				treeType:"dailog",
				domId:"",
				title:"",
				selectIds:"",
				//这些是弹出框树的额外默认参数，因为用到了bootstrap中的popover组件
				trigger : "click",//出发弹出树的事件，有click | hover | focus | manual
				placement : "bottom",//树的展示位置，默认是从下面弹出 有  top | bottom | left | right | auto.
			},
			
			async:{
				enable:true,
				url:options.mySetting.url ,
				dataFilter:null,
				dataType:"json",
				otherParam: {}//传给后台的参数 如：{"id":"1", "name":"test"}
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "parent_id",
				}
			},
	  		check: {
	  			enable: ((options.mySetting.chkStyle != "" && typeof options.mySetting.chkStyle != "undefined")   ? true : false),
	  			chkStyle: options.mySetting.chkStyle,
	  			//勾选 [checkbox] 对于父子节点的关联关系  默认值：{ "Y": "ps", "N": "ps" }  请注意大小写，不要改变
	  			//Y 属性定义 checkbox 被勾选后的情况；N 属性定义 checkbox 取消勾选后的情况；
	  			//"p" 表示操作会影响父级节点；"s" 表示操作会影响子级节点。
	  			//例如：checkbox 勾选操作，只影响父级节点；取消勾选操作，只影响子级节点  chkboxType: { "Y": "p", "N": "s" }
	  			chkboxType: { "Y": "ps", "N": "ps" },
	  			radioType: "all"
	  		},
	  		callback: {
	  			onRightClick:function(event, treeId, treeNode){
	  				if(options.mySetting.rightClickMenu){
	  					_onRightClick(options,event, treeId, treeNode);
	  				}
	  				return true;
	  			},
	  			onDblClick:function(event, treeId, treeNode){
	  				//当为单选树时，双击为选中值且关掉树
	  				if(options.mySetting.chkStyle == "radio"){
	  					ztree.checkNode(treeNode, true, false);//选中
	  					if(options.mySetting.treeType == "dailog"){
	  						if(ztreeOptions.mySetting.getIdAndName){
	  							//返回id和name回调
	  							var idAndName = getCheckedIdAndName(ztree);	//获取选取的数据id和name
	  							ztreeOptions.mySetting.getIdAndName(idAndName[0],idAndName[1],idAndName[2]);
	  						}
	  						if(ztreeOptions.mySetting.getData){
	  							//返回node对象回调
	  							ztreeOptions.mySetting.getData(getCheckedData(ztree));
	  						}
	  						ztree.destroy();
	  						tree_div.slideUp(function(){tree_div.remove()});
	  						$("body").off("click");//取消click事件
	  					}
	  				}
	  			},
	  			onAsyncSuccess: function(event, treeId, treeNode, msg){
	  				if(options.mySetting.onSuccess){	//树完成后的自定义事件
	  					options.mySetting.onSuccess(event, treeId, treeNode, msg);
	  				}
	  			}
	  		}
		}
		var ztreeOptions = $.extend(true,defaults,options);	//深度递归合并参数
		
		var treeId = "";
		if(ztreeOptions.mySetting.treeId){
			treeId = ztreeOptions.mySetting.treeId;
		} else {
			treeId = "baseztree";
		}
		
		//判断是否存在了此id 的 tree，存在则直接返回treeObj，这里加上self，是为了重新调用此方法，重新加载树
		if($("body").find("#"+treeId).length <= 0 || ztreeOptions.mySetting.treeType == "self"){
			if(ztreeOptions.mySetting.treeType == "dailog"){//如果处于dailog模式下，生成并绑定domId的Popover
				_createPopoverPanel(ztreeOptions);
				//绑定弹出框的显示成功后的事件--》打开树
				$("#"+ztreeOptions.mySetting.domId).on("shown.bs.popover",function(){
					//如果弹出框是上面或下面弹出来的，用js调整树的位置，默认是居中的
					if(ztreeOptions.mySetting.placement == "bottom" || ztreeOptions.mySetting.placement == "top"){
						var popoverLeft = $("#"+treeId).parents(".popover").css("left").replace("px","");
						if(parseInt(popoverLeft) >= 5){
							$("#"+treeId).parents(".popover").css("left","5px");							
						}
					}
					
					ztree = $.fn.zTree.init($("#"+treeId), ztreeOptions, null);
					//如果处于dailog模式下，需要延时响应除树之外的地方的点击事件来销毁树
					window.setTimeout(function(){
						$("body").on("click",function(e){
							if($(e.target).parents(".popover").length == 0){
								$("#"+ztreeOptions.mySetting.domId).popover("hide");
								$("body").off("click");//取消click事件
							}
						})
					}, 1000);
	  			});
				//绑定弹出框消失后的事件，此事件会获取数据，销毁树，取代确定事件
				$("#"+ztreeOptions.mySetting.domId).on("hidden.bs.popover",function(e){
					if(ztreeOptions.mySetting.getIdAndName){
						var idAndName = Tree.getCheckedIdAndName(ztree);	//获取选取的数据id和name
						ztreeOptions.mySetting.getIdAndName(idAndName[0],idAndName[1],idAndName[2]);
					}
					if(ztreeOptions.mySetting.getData){
						ztreeOptions.mySetting.getData(Tree.getCheckedData(ztree));//返回node对象回调
					}
					ztree.destroy();
				})
			} else {
				ztree = $.fn.zTree.init(_getTreeDom(treeId), ztreeOptions, null);//生成树
				_getTreeDom(treeId).css("min-height","280px")//设置树的最小高度
			}
			
			return ztree;
		} else {
			return $.fn.zTree.getZTreeObj(treeId);
		}
	}
	
	/**
	 * 私有方法，创建弹出树的面板，这里用到了bootstrap的popover组件
	 */
	var _createPopoverPanel = function(ztreeOptions){
		$("#"+ztreeOptions.mySetting.domId).popover({
			title : ztreeOptions.mySetting.title,
			trigger : ztreeOptions.mySetting.trigger,
			placement : ztreeOptions.mySetting.placement,
			animation : true,
			html : true,
			content : "<ul id='"+ztreeOptions.mySetting.treeId+"' class='ztree'></ul>"
		});
	}
	
	/**
	 * 树回选，默认是根据id回选，也可以使根据具体param回选
	 */
	Tree.checkeNode = function(paramValues,treeId,param){
		var treeObj =  $.fn.zTree.getZTreeObj(treeId);
		var sonSign = false; //true 表示 全部子孙节点,false表示只影响父节点
		if(treeObj.setting.check.chkStyle === "radio"){
			sonSign = true;
		}
		if(paramValues == ""){
			treeObj.checkAllNodes(false);
			treeObj.expandAll(false);
		} else {
			var paramValues = paramValues.split(",");
			if(param == "" || !param){
				param = "id";
			}
			for(var i = 0;i<paramValues.length;i++){ 
				var node =  treeObj.getNodeByParam(param, paramValues[i], null);
				//1 需要勾选 或 取消勾选 的节点数据 
				//2 是否勾选节点 
				//3 true 表示按照 setting.check.chkboxType 属性进行父子节点的勾选联动操作，false 表示只修改此节点勾选状态，无任何勾选联动操作
				treeObj.checkNode(node, true, false);
				treeObj.expandNode(node, true, sonSign, true);
			}
		}
	}
	
	/**
	 * treeObj:可以使ztree对象 也可以是ztree dom id
	 * 返回选中的node对象中的id和name，还有整个选中了的node对象
	 */
	Tree.getCheckedIdAndName = function(treeIdOrObj){
		if($.type(treeIdOrObj) == "string"){
			treeIdOrObj = $.fn.zTree.getZTreeObj(treeIdOrObj);
		}
		var ids = new Array();
		var names = new Array();
		var nodes = treeIdOrObj.getCheckedNodes(true);
		$.each(nodes,function(){
			ids.push(this.id);
			names.push(this.name);
		})
		return new Array(ids.join(","),names.join(","),nodes);
	}
	
	/**
	 * treeObj:可以是ztree对象 也可以是ztree dom id
	 * nodeField:可以指定得到某属性的值，如果不传此参数，默认是得到选中节点node数组
	 * 返回
	 * 		1：nodeField不传，返回选中的ztree的node对象
	 * 		2：nodeField有值，返回指定的node属性的字符串，以逗号分隔，比如传id，返回所勾选的数据的id串回去，传name，返回所勾选的数据的name串回去
	 */
	Tree.getCheckedData = function(treeIdOrObj,nodeField){
		if($.type(treeIdOrObj) == "string"){
			treeIdOrObj = $.fn.zTree.getZTreeObj(treeIdOrObj);
		}
		if(nodeField){
			var fieldValue = new Array();
			var nodes = treeIdOrObj.getCheckedNodes(true);
			$.each(nodes,function(key,value){
				fieldValue.push(value[nodeField]);
			})
			return fieldValue.join(",");
		} else {
			return treeIdOrObj.getCheckedNodes(true);		
		}
	}

	/**
	 * treeObj:可以是ztree对象 也可以是ztree dom id
	 * nodeField:可以指定得到某属性的值，如果不传此参数，默认是得到选中节点node数组
	 * 返回
	 * 		1：nodeField不传，返回选中的ztree的node对象
	 * 		2：nodeField有值，返回指定的node属性的字符串，以逗号分隔，比如传id，返回所选中的数据的id串回去，传name，返回所选中的数据的name串回去
	 */
	Tree.getSelectData = function(treeIdOrObj,nodeField){
		if($.type(treeIdOrObj) == "string"){
			treeIdOrObj = $.fn.zTree.getZTreeObj(treeIdOrObj);
		}
		if(nodeField){
			var fieldValue = new Array();
			var nodes = treeIdOrObj.getSelectedNodes();
			$.each(nodes,function(key,value){
				fieldValue.push(value[nodeField]);
			})
			return fieldValue.join(",");
		} else {
			return treeIdOrObj.getSelectedNodes();		
		}
	}
	
	/**
	 * 私有方法，获取顶层页面元素的方法
	 */
	var _getTreeDom = function(domId){
		if($("#"+domId).length > 0 ){
			return $("#"+domId);
		} else {
			return $("#"+domId,window.top.document);
		}
	}
	
	/***===============右键菜单 私有方法 start================**/
	var _onRightClick = function (options, event, treeId, treeNode) {
		var zTree = $.fn.zTree.getZTreeObj(treeId);
		if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
			zTree.cancelSelectedNode();
			_showRMenu(options,treeId,"root", event.clientX, event.clientY);
		} else if (treeNode) {
			zTree.selectNode(treeNode);
			_showRMenu(options,treeId,"node", event.clientX, event.clientY);
		}
	}

	var _showRMenu = function (options,treeId,type, x, y) {
		//约定，右键菜单id为treeId + "_ztreeRightMenu"，如果页面存在菜单dom，则直接显示，否则先创建再显示
		//右键菜单的样式为bootstrap的list-group样式
		if($("#"+treeId+"_ztreeRightMenu").length <= 0){
			var menuTemplate = "<div class='ztreeRightMenuDiv' id='"+treeId+"_ztreeRightMenu' style='display: none;position:absolute;top:0;text-align: left;padding: 2px;'>"+
								"<div class='list-group'>";
			$.each(options.mySetting.rightClickMenu,function(key,value){ 
				menuTemplate += "<a href='###' class='list-group-item list-group-item-info "+key+" "+ value.show +"'>"+
								  	"<span class='"+value.menuIcon+"'></span> "+value.menuText+
								"</a>";
			})
			menuTemplate +=	"</div></div>";
			$("body").append(menuTemplate);
			//循环绑定事件
			$.each(options.mySetting.rightClickMenu,function(key,value){ 
				//为每个菜单绑定click事件，事件回调函数参数分别为：当前选中的树节点，当前树id，event对象
				if(value.clickEvent){
					$("#"+treeId+"_ztreeRightMenu").on("click","."+key,function(event){
						var zTree = $.fn.zTree.getZTreeObj(treeId);
						value.clickEvent(zTree.getSelectedNodes(),zTree,event);
						_hideRMenu();
					});
				}
			})
		} else {
			$("#"+treeId+"_ztreeRightMenu").show();
		}
		if (type=="root") {
			$("#"+treeId+"_ztreeRightMenu .node").hide();
			$("#"+treeId+"_ztreeRightMenu .root").show();
		} else {
			$("#"+treeId+"_ztreeRightMenu .root").hide();
			$("#"+treeId+"_ztreeRightMenu .node").show();
		}
		$("#"+treeId+"_ztreeRightMenu").css({"top":y+"px", "left":x+"px", "display":"block"}).show();

		$("body").on("mousedown", function(e){
			_onBodyMouseDown(e,treeId);
		});
	}
	var _hideRMenu = function () {
		$(".ztreeRightMenuDiv").css({"display": "none"});
		$("body").off("mousedown", onBodyMouseDown);
	}
	var _onBodyMouseDown = function (event,treeId){
		if (!(event.target.id == treeId+"_ztreeRightMenu" || $(event.target).parents("#"+treeId+"_ztreeRightMenu").length > 0)) {
			$("#"+treeId+"_ztreeRightMenu").css({"display" : "none"});
		}
	}
	/***===============右键菜单 私有方法 end================**/
	
	return Tree;
}(Tree || {}));