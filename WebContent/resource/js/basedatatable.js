/**
 * 此方法依赖jquery,datatable
 * @param baseOptions  一些基本属性数组
 * @param options	dataTable属性数组
 * @returns {String} 返回dataTable对象
 * Gavin 20141028
 */
function baseDataTable (baseOptions,options){
	var dataTable = "";
	var baseDefaultOptions = {
		"domId":"base-datable",
		"url":"",
		"lang_type":"zh_cn",		//界面语言 ,默认中文界面
		"toolbar":"",
		"search":"",
		"resetSearch":"",
		"draw":"",
		"dblclick":"",
		"multipleSelete":false
	}
	baseOptions = $.extend(baseDefaultOptions,baseOptions);
	
	var defaults = {
		"ajax": {
			"url":baseOptions.url,
			"type":"post"
		},
		"columns": "",
    	"dom": '<"base-datatable-toolbar">rt<"bottom"lip<"clear">>',
		"processing": true,
		"paging":true,	//是否显示分页条（ps 如果不需要分页条，则同步需要改info属性为false）
		"info":true,	//是否显示分页信息
		"searching": false,
	    "ordering": true,
    	"stateSave": true,
    	"language": datatableLanguage(baseOptions.lang_type),//界面语言 
    	"serverSide": true,
    	"order": [1,"asc"]	//默认排序列，第一参数是表格列的序号，从1开始
	}
	
	options = $.extend(defaults,options);
	
	dataTable = $('#'+baseOptions.domId).on('preXhr.dt', function ( e, settings, data ) {
		//ajax执行前 将data数据过滤，组装orderName,orderType，去掉columns,order search参数
		var orderIndex = data.order[0].column;
		data.orderName = data.columns[orderIndex].data;
		data.orderType = data.order[0].dir;
		data.jsonParam = baseOptions.search;
		delete data.columns;
		delete data.order;
		delete data.search;
	}).DataTable( options );
	
	if(baseOptions.multipleSelete){
		//开启多选
		$('#'+baseOptions.domId).on( 'click', 'tr', function () {
	        $(this).toggleClass('selected');
	    });
	}
	if(baseOptions.dblclick){
		//tr双击事件
		$('#'+baseOptions.domId).on( 'dblclick', 'tr:gt(0)', function () {
			baseOptions.dblclick(dataTable.row(this).data());
		});
	}
	//工具条  _wrapper
    $("#"+baseOptions.domId+"_wrapper .base-datatable-toolbar").html(baseOptions.toolbar);
    
    return dataTable;
}
/**
 * datatables 语言配置，根据不同的参数 返回不同语言界面
 * @param lang_type (zh_cn:中文，en:英文...)
 * @returns {}
 */
function datatableLanguage(lang_type){
	var zh_cn_language = {
					"processing": "<span class='fa fa-spinner fa-spin fa-fw'></span> 读取数据中...",
					"lengthMenu": "_MENU_",
					"zeroRecords": "没有找到符合条件的数据",
					"info": "当前第_START_-_END_条 共 _TOTAL_条",
					"infoEmpty": "没有记录",
					"infoFiltered": "(从 _MAX_ 条记录中过滤)",
					"infoPostFix": "",
					"search": "搜索",
					"url": "",
					"paginate": {
						"first":    "首页",
						"previous": "上一页",
						"next":     "下一页",
						"last":     "尾页"
					}
				}
	if(lang_type == "zh_cn"){
		return zh_cn_language;		
	} else {
		return zh_cn_language;
	}
}
/**
 * 获取datatable中选中的数据
 * @param temp_dataTable data对象
 * @param temp_column 要获取的目标列数据，以逗号分隔
 * @param callback(columnData,data) 回调函数，columnData是要取的列的数据集合，以逗号分隔/data选择的所有行数据
 * @param flag，传入字符标识，如果是true，则用单引号将temp_column的值抱起来('id1','id2','id3')，否则为（id1,id2,id3）
 */
function getSelectRowData(temp_dataTable,temp_column,callback, flag){
	var allData = temp_dataTable.rows('.selected').data();
	var columnData = new Array();
	if(temp_column != "" && $.type(temp_column) == "string"){
		allData.each(function(value){
			if(flag){
				columnData.push("'"+value[temp_column]+"'");
			} else {
				columnData.push(value[temp_column]);
			}
		});
	}
	callback(columnData.join(","),allData);
}