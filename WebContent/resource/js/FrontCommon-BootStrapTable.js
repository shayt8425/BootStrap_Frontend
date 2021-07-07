(function(window,$){
	
	//BootStrap表格，这里的配置项，只列出一些基本的选项，其余配置项请参见bootstrap table文档
	window.BootStrapTable = function(config){
		this.config = $.extend({
			toolbar:undefined,//表格工具栏，可以是一个数组，数组的格式为[{icon:'plus',text:'添加',type:'default',click:function(){xxx}}]，也可以是一个jquery选择器"#toolbar"
			search:false,//是否显示搜索框，默认不显示
			columns:[],//表格的所有列配置，参见bootstrap table文档
			queryParams:function(params){return params},//需要额外参数需要重写这个函数
			pagination:true,//是否显示分页条，默认显示
			striped:true,//是否各行换色，默认是
			showRefresh:false,//是否显示刷新按钮
			showToggle:false,//是否显示 切换试图（table/card）按钮
			showPaginationSwitch:false,//是否显示隐藏分页工具栏按钮
			idField:'id',//主键列
			pageList:[20],//默认只有20这个可以选
			pageSize:20,
			method: 'post',
			contentType:'application/x-www-form-urlencoded',
			queryParamsType:'',
			clickToSelect:true,//选中行时自动选中checkbox
			singleSelect:false,//是否只允许单行选中
			showColumns:false,//是否显示 显示/隐藏表格列按钮
			showExport:false,//是否显示导出按钮
			exportUrl:'',//导出的action url
			sidePagination:"server",//默认分页方法，通过后台进行分页，client为js函数分页
			url:undefined,//table数据来源action
			detailFormatter: detailFormatter,//表格行详情默认函数
			detailView: true,
			data:[],//加载本地数据
			initPagination:BootStrapTable.initPagination,//重写分页函数，自定义分页，不使用默认的，想使用默认的，请设置此参数为除function定义之外的任何值
			loadingFunc:function(){//数据加载中函数
				FrontCommon.showLoading();
			},loadingCompleteFunc:function(){
				FrontCommon.hideLoading();
			}
		},config);
	}
	
	BootStrapTable.initPagination = function(){
		var bootTable = this;
		if(bootTable&&bootTable.options){
			var options = bootTable.options;
			if(options.totalPages){
				//定义分页条的所有html元素，.prevPage上一页,.nextPage下一页，.page_num_btn代表所有的数字跳转页面按钮
				var pagehtml = ["<div class=\"pull-left pagination-detail\"><div class='page_btn prevPage'>上一页</div><div class='page_num_btn page_btn'>1</div>"];
				//分页按钮的数字跳转按钮默认保证必须有“1”，“最后一页页码”
				//minShowPage表示除掉“1”，“最后一页页码”后分页条显示的第一个数字跳转按钮。
				var minShowPage = options.pageNumber-2>=1?options.pageNumber-2:1;
				minShowPage = minShowPage==1?2:minShowPage;
				//如果minShowPage>2说明1-minShowPage之间>2页，加...
				if(minShowPage>2)pagehtml.push("<div class='info'>...</div>");
				//maxShowPage表示除掉“1”，“最后一页页码”后分页条显示的最后一个数字跳转按钮。
				var maxShowPage = options.pageNumber+2<=options.totalPages?options.pageNumber+2:options.totalPages;
				maxShowPage = maxShowPage==options.totalPages?maxShowPage-1:maxShowPage;
				//这里判断minShowPage-maxShowPage是否达到了5个按钮，如果没有则补充。
				while(maxShowPage-minShowPage<4&&minShowPage>2){
					minShowPage--;
				}
				while(maxShowPage-minShowPage<4&&maxShowPage<options.totalPages-2){
					maxShowPage++;
				}
				//这里开始添加所有数字跳转按钮
				for(var i=minShowPage;i<=maxShowPage;i++){
					pagehtml.push("<div class='page_num_btn page_btn'>"+i+"</div>");
				}
				//如果maxShowPage>options.totalPages-1说明maxShowPage-options.totalPages之间>2页，加...
				if(maxShowPage<options.totalPages-1)pagehtml.push("<div class='info'>...</div>");
				//页面中的其他元素包括最后一页，下一页按钮，工多少页，刷新按钮等。
				if(options.totalPages!=1)pagehtml.push("<div class='page_num_btn page_btn'>"+options.totalPages+"</div>");
				pagehtml = pagehtml.concat(["<div class='page_btn nextPage'>下一页</div></div>",
					                "<div class=\"pull-right pagination\"><table class=\"bsgridPaging pagingLittleToolbar\">" +
					                "<tbody><tr><td>",
					                "共"+options.totalRows+"条记录",
					                "</td><td>到</td><td style='padding-left:0px;'><input class='form-control gotoPageInput' style='width:40px;padding:0px 2px;'/></td>",
					                "<td style='padding-left:0px;'>页</td><td style='padding:0px;'><div class='page_btn gotoPage'>跳转</div></td><td style='padding:0px;padding-left:10px;'><div class='page_btn refreshPage'>刷新</div></td></tr></tbody></table></div>"]);
				//每次页面切换的时候先将分页条内的所有html清空，然后再拼接新的html
				bootTable.$pagination.empty().append(pagehtml.join(""));
				//添加所有分页按钮的事件，数字跳转按钮
				bootTable.$pagination.find(".page_num_btn").each(function(){
					if($(this).text()==options.pageNumber)$(this).addClass("active");
				})
				//判断是否第一页，如果是,那么上一页按钮置灰
				if(options.pageNumber==1){
					bootTable.$pagination.find(".prevPage").addClass("disabledCls");
				}
				//判断是否最后一页，如果是,那么下一页按钮置灰
				if(options.pageNumber==options.totalPages||!options.totalPages||!options.totalRows){
					bootTable.$pagination.find(".nextPage").addClass("disabledCls");
				}
				//下一页按钮事件
				bootTable.$pagination.find(".nextPage:not(.disabledCls)").click(function(){
					bootTable.nextPage();
				});
				//上一页按钮事件
				bootTable.$pagination.find(".prevPage:not(.disabledCls)").click(function(){
					bootTable.prevPage();
				});
				//数字分页跳转按钮事件
				bootTable.$pagination.find(".page_num_btn:not(.active)").click(function(){
					bootTable.selectPage(parseInt($(this).text()));
				});
				
				//跳转到用户自定义页码
				bootTable.$pagination.find(".gotoPage").click(function(){
					var goPageInput = bootTable.$pagination.find(".gotoPageInput");
					if($.trim(goPageInput.val())==""){
						FrontCommon.warning("页码不能为空！");
						return;
					}
					if(!/^[\d]{0,}$/.test(goPageInput.val())){
						FrontCommon.warning("请输入数字！");
						return;
					}
					if(parseInt(goPageInput.val())<1||parseInt(goPageInput.val())>options.totalPages){
						FrontCommon.warning("页码必须在1-"+options.totalPages+"之间！");
						return;
					}
					bootTable.selectPage(parseInt(goPageInput.val()));
				});
			}else{
				bootTable.$pagination.empty().append(["<div class=\"pull-left pagination-detail\"><div class=\"page_btn prevPage disabledCls\">上一页</div>",
				                                      "<div class=\"page_num_btn page_btn active\">1</div><div class=\"page_btn nextPage disabledCls\">下一页</div></div>",
				                                      "<div class=\"pull-right pagination\"><table class=\"bsgridPaging pagingLittleToolbar\">" +
				                                      "<tbody><tr><td>",
				                                      "未找到任何数据！",
				                                      "</td><td style='padding:0px;padding-left:10px;'><div class='page_btn refreshPage'>刷新</div></td></tr></tbody></table></div>"].join(""));
			}
			
			//刷新按钮事件
			bootTable.$pagination.find(".refreshPage").click(function(){
				bootTable.refresh();
			});
		}
	}
	
	BootStrapTable.prototype.appendTo = function(container){
		var table = this;
		if(typeof(container)=="string"){
			container = document.getElementById(container);
		}
		//首先获取toolbar
		if(typeof(this.config.toolbar)=="string"){
			//如果是jquery选择器，直接把html元素交给container
			$(this.config.toolbar).appendTo($(container));
		}else if(this.config.toolbar//如果toolbar是数组
				&&Object.prototype.toString.call(this.config.toolbar) == '[object Array]'){
			var toolbarId = container.id+"Toolbar";
			var barHtml = "<div id=\""+toolbarId+"\"></div>";
			var barObj = $(barHtml).appendTo($(container));
			for(var idx in this.config.toolbar){
				var btnConfig = $.extend({"icon":'',type:'primary',click:null,text:""},this.config.toolbar[idx]);
				var btnHtml = "<button type=\"button\" style=\"margin-right:5px;\" class=\"btn btn-"+btnConfig.type+"\">";
				if(btnConfig.icon&&btnConfig.icon!=''){
					btnHtml+="<span class=\"glyphicon glyphicon-"+btnConfig.icon+"\"></span> "+btnConfig.text;
				}
				btnHtml += "</button>";
				
				//click事件绑定
				(function(btnConfig){
					$(btnHtml).appendTo(barObj).click(function(e){
						if(btnConfig.click&&typeof(btnConfig.click)=='function'){
							btnConfig.click.call(table);
						}
					});
				})(btnConfig);
			}
			this.config.toolbar = "#"+toolbarId;
		}
		this.tableObj = $("<table></table>").appendTo($(container))[0];
		$(this.tableObj).bootstrapTable(this.config);
	}
	
	/**
	 * 默认的表格行详情展示函数
	 */
	var detailFormatter = function(index, row) {
        var html = [];
        var options = this;
        $.each(row, function (key, value) {
            if((value==0||value)&&findColumnByKey(options,key))html.push('<p style="padding:5px 0px 0px 5px;"><b>' + findColumnByKey(options,key) + ':</b> ' + value + '</p>');
        });
        return html.join('');
    }
	
	/**
	 * 根据字段field，找到title
	 */
	var findColumnByKey = function(options, key){
		for(var idx in options.columns){
			if($.isArray(options.columns[idx])){
				for(var idx2 in options.columns[idx]){
					if(options.columns[idx][idx2].field==key){
						return options.columns[idx][idx2].title;
					}
				}
			}else if(options.columns[idx].field==key){
				return options.columns[idx].title;
			}
		}
		
		return null;
	}
	
	/**
	 * 获取选中的行关键字段数组，必须给出主键列配置
	 * @returns
	 */
	BootStrapTable.prototype.getSelections = function() {
		return $(this.tableObj).bootstrapTable('getSelections');
	}
	
	BootStrapTable.prototype.searchByParams = function(params,url,currPage){
		var bootTable = $(this.tableObj).data("bootstrap.table");
		var params = {query:params};
		if(!currPage)params.url = url?url:bootTable.options.url;
		if(url)bootTable.options.url=url;
		bootTable.refresh(params);
	}
	
	BootStrapTable.prototype.setHeight = function(tableHeight) {
		$(this.tableObj).bootstrapTable('resetView', {
            height: tableHeight
        });
	}
	
	BootStrapTable.prototype.resetWidth = function(tableHeight) {
		$(this.tableObj).bootstrapTable('resetWidth');
	}
	
	BootStrapTable.prototype.refreshBody = function() {
		var bootTable = $(this.tableObj).data("bootstrap.table");
		bootTable.initSearch();
		bootTable.initSort();
		bootTable.initBody(true);
	}
	
	BootStrapTable.prototype.loadData = function(data) {
		var bootTable = $(this.tableObj).data("bootstrap.table");
		bootTable.load(data);
	}
	
	BootStrapTable.prototype.initBody = function(fixedScroll) {
		var bootTable = $(this.tableObj).data("bootstrap.table");
		bootTable.initBody(fixedScroll);
	}
	
})(window,jQuery);