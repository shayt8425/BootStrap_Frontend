(function(window,$){
	//定义bootstrapTree，
	window.BootStrapTree = function(treeConfig){
		var tree = this;
		this.treeConfig = $.extend({
			container: null,//树控件添加到的容器
			url:'',//树控件的数据来源,
			nodes:null,
			"urlParams":{},
			"urlDataProp":[],//访问url带来的数据时，需要访问的属性数组
			jsonFormatOut:false,//是否以json格式输出选中的树节点，必须配合ztree的checkboxType.Y = 'ps' or 'p'，否则无效
			treeSetting:{//ztree的配置对象
				callback: {
					onClick:null
				}
			}
		},treeConfig);
		var userOnClick = this.treeConfig.treeSetting.callback.onClick;//获取用户自定义的onClick
		this.treeConfig.treeSetting.callback.onClick = function(event, treeId, treeNode, clickFlag){
			if(tree.ztree.setting.check.enable){//添加点击树节点，自动选中复选框的函数，合并到onclick中
				//自动勾选该节点
				tree.ztree.checkNode(treeNode, null, true, true);
			}
			//这里是用户自定义的onClick事件
			if(userOnClick)userOnClick(event, treeId, treeNode, clickFlag);
		}
		if(this.treeConfig.container)this.appendTo(this.treeConfig.container);
	}
	
	//bootStrapTree的添加函数，暂时使用ztree实现，配置对象使用zSetting，请参见ztree api
	BootStrapTree.prototype.appendTo = function(container){
		var tree = this;
		if(typeof(container)=="string"){
			container = document.getElementById(container);
		}
		this.treeConfig.container = container;
		if(this.treeConfig.nodes){
			//初始化ztree
			this.ztree = $.fn.zTree.init($(container),this.treeConfig.treeSetting,this.treeConfig.nodes);
			this.datasAlready = true;
		}else if(this.treeConfig.url&&this.treeConfig.url!=''){
			//如果用户配置了url
			$.ajax({
				url:tree.treeConfig.url,
				type:'post',
				dataType:'json',
				data:tree.treeConfig["urlParams"],
				success:function(data){
					var dataStr = "data";
					//获取url返回的数据，如果需要取data["?"]["?"]属性，则需要eval
					for(var idx in tree.treeConfig.urlDataProp){
						dataStr += "[\""+tree.treeConfig.urlDataProp[idx]+"\"]";
					}
					eval("tree.treeConfig.nodes = "+dataStr);
					tree.ztree = $.fn.zTree.init($(container),tree.treeConfig.treeSetting,tree.treeConfig.nodes);
					tree.datasAlready = true;
				}
			})
		}
	}
	
	BootStrapTree.prototype.getValue = function(){
		if(this.ztree.setting.check.enable){
			//如果是复选框模式
			var nodes = this.ztree.getCheckedNodes(true);
			if(this.treeConfig.jsonFormatOut//如果用户配置了值输出为json串模式，且checkbox选中时级联选中了父节点
					&&this.ztree.setting.check.chkboxType.Y.indexOf("p")>-1){
				//输出json串模式
				var roots = [];
				var childrenName = this.ztree.setting.data.key.children;
				//获取用户选中的树节点，该函数只限于nodes节点是递归从上往下拿到的
				for(var i=0;i<nodes.length;i++){
					if(!nodes[i].getParentNode()){//顶级节点，直接往roots对象里面放
						var nodeObj = {id:nodes[i][this.ztree.setting.data.simpleData.idKey]};
						nodeObj[childrenName] = [];
						roots.push(nodeObj);
					}else{
						this.setToParentNode(roots,nodes[i]);
					}
				}
				//生成需要写入的树数据['xxx':ddd,children:[]]
				checkJson = JSON.stringify(roots);
				return checkJson;
			}else{
				var nodeId = "";
				for(var i=0;i<nodes.length;i++){//拼接树控件的值
					nodeId += nodes[i][this.ztree.setting.data.simpleData.idKey]+(i==nodes.length-1?"":",");
				}
				return nodeId;
			}
		}else{
			var nodes = this.ztree.getSelectedNodes();
			return nodes&&nodes.length>0?nodes[0][this.ztree.setting.data.simpleData.idKey]:"";
		}
	}
	
	BootStrapTree.prototype.getText = function(){
		if(this.ztree.setting.check.enable){
			//如果是复选框模式
			var nodes = this.ztree.getCheckedNodes(true);
			var nodeText = "";
			for(var i=0;i<nodes.length;i++){//拼接树控件的值
				nodeText += nodes[i][this.ztree.setting.data.key.name]+(i==nodes.length-1?"":",");
			}
			return nodeText;
		}else{
			var nodes = this.ztree.getSelectedNodes();
			return nodes&&nodes.length>0?nodes[0][this.ztree.setting.data.key.name]:"";
		}
	}
	
	//tree的setvalue函数
	BootStrapTree.prototype.setValue = function(valObj){
		var tree = this;
		if(this.datasAlready){//必须数据加载完全，才能设置
			if(this.ztree.setting.check.enable){
				//先清空选中
				this.ztree.checkAllNodes(false);
				//如果有父级联，且输出格式为json串模式
				if(this.ztree.setting.check.chkboxType.Y.indexOf('p')>-1
						&&this.treeConfig.jsonFormatOut){
					//只能传json对象，否则无法正确设置
					if(typeof(valObj)=='string'&&$.trim(valObj)!='')
						valObj = eval(valObj);
					this.childCheck(valObj);
				}else if(typeof(valObj)=='string'&&$.trim(valObj)!=''){
					//如果是逗号隔开
					var arr = valObj.split(",");
					var idkey = this.ztree.setting.data.simpleData.idKey;
					var childrenKey =  this.ztree.setting.data.key.children;
					for(var idx in arr){
						var node = this.ztree.getNodeByParam(idkey,arr[idx]);
						if(node&&this.ztree.setting.check.chkboxType.Y.indexOf('s')<0){
							//如果没有子级联，那么每个都要选中
							this.ztree.checkNode(node, true, true, true)
						}else if(node&&this.ztree.setting.check.chkboxType.Y.indexOf('p')>=0
								&&(!node[childrenKey]||node[childrenKey].length<=0)){
							//如果有父级联又有子级联选中子节点就可以了
							this.ztree.checkNode(node, true, true, true);
						}
					}
				}
			}else{
				if(valObj&&valObj!=''){
					var treeNode = this.ztree.getNodeByParam(this.ztree.setting.data.simpleData.idKey,valObj);
					if(treeNode){
						this.ztree.selectNode(treeNode);
					}
				}
			}
		}else{
			setTimeout(function(){
				tree.setValue(valObj);
			}, 500);
		}
	}
	
	BootStrapTree.prototype.refresh = function(nodes){
		var tree = this;
		if(this.ztree)this.ztree.destroy();
		tree.datasAlready = false;
		if(nodes){
			tree.ztree = $.fn.zTree.init($(tree.treeConfig.container),tree.treeConfig.treeSetting,nodes);
			tree.datasAlready = true;
		}else if(this.treeConfig.url&&this.treeConfig.url!=''){
			//如果用户配置了url
			$.ajax({
				url:tree.treeConfig.url,
				type:'post',
				dataType:'json',
				data:tree.treeConfig["urlParams"],
				success:function(data){
					var dataStr = "data";
					//获取url返回的数据，如果需要取data["?"]["?"]属性，则需要eval
					for(var idx in tree.treeConfig.urlDataProp){
						dataStr += "[\""+tree.treeConfig.urlDataProp[idx]+"\"]";
					}
					eval("tree.treeConfig.nodes = "+dataStr);
					tree.ztree = $.fn.zTree.init($(tree.treeConfig.container),tree.treeConfig.treeSetting,tree.treeConfig.nodes);
					tree.datasAlready = true;
				}
			})
		} 
	}
	
	/**
	 * 树的选中清除函数
	 */
	BootStrapTree.prototype.clear = function(){
		if(this.ztree){
			if(this.ztree.setting.check.enable){
				this.ztree.checkAllNodes(false);
			}else{
				this.ztree.cancelSelectedNode();
			}
		}
	}
	
	/**
	 *  因为树有级联check，所以只要选中子节点就ok
	 */
	BootStrapTree.prototype.childCheck = function(nodeArr){
		var childrenName = this.ztree.setting.data.key.children;//首先获取children声明的对应属性名
		var idkey = this.ztree.setting.data.simpleData.idKey;//首先获取树节点的标识字段
		for(var i=0;i<nodeArr.length;i++){
			var node = this.ztree.getNodeByParam(idkey,nodeArr[i][idkey]);
			if(node&&(this.ztree.setting.check.chkboxType.Y.indexOf("s")<0||
					!nodeArr[i][childrenName]||nodeArr[i][childrenName].length<=0)){
				//如果没有子级联，或者当前节点没有子节点了则选中
				this.ztree.checkNode(node, true, true, true);
			}
			if(nodeArr[i][childrenName]&&nodeArr[i][childrenName].length>0){
				//如果有子节点，那么递归往下走
				this.childCheck(nodeArr[i][childrenName]);
			}
		}
	}
	
	BootStrapTree.prototype.expandAll = function(){
		var tree = this;
		if(this.datasAlready){
			this.ztree.expandAll(true);
		}else{
			setTimeout(function(){
				tree.expandAll();
			},500);
		}
	}
	
	BootStrapTree.prototype.collapseAll = function(){
		var tree = this;
		if(this.datasAlready){
			this.ztree.expandAll(false);
		}else{
			setTimeout(function(){
				tree.collapseAll();
			},500);
		}
	}
	
	BootStrapTree.prototype.setToParentNode = function(childNodes,node){
		//获取子节点属性的名称
		var childrenName = this.ztree.setting.data.key.children;
		for(var i=0;i<childNodes.length;i++){
			if(childNodes[i].id==node.getParentNode().id){//如果当前节点是节点对象节点的子节点
				var obj = {id:node[this.ztree.setting.data.simpleData.idKey]};
				obj[childrenName] = [];
				childNodes[i][childrenName].push(obj);//
			}else if(childNodes[i][childrenName]&&childNodes[i][childrenName].length>0){
				//递归向下去设置子节点
				this.setToParentNode(childNodes[i][childrenName],node);
			}
		}
	}
})(window,jQuery);