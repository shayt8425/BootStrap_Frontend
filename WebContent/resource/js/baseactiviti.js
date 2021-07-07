/**
 * 流程相关工具类
 */
var Flow = (function(Flow){
	
	/**
	 * 创建查看已办办件历史的
	 */
	Flow.createHisTaskDomForTable = function (historicTaskInstances){
		var button_html = '<button type="button" class="btn btn-link" data-toggle="tooltip">查看我的已办</button>';
		return button_html + Flow.createHisTaskHtml(historicTaskInstances);
	}
	
	/**
	 * 创建流程历史任务表格展示的html，参数historicTaskInstances对应HistoricTaskInstance 后台bean
	 */
	Flow.createHisTaskHtml = function(historicTaskInstances){
		var tableHtml = "<div style='display:none'>" +
							"<table class='table table-bordered' >#TABLE#</table>" +
						"</div>";
		var tableHeadHtml = "<thead>"+
								"<tr>"+
						        	"<th>环节名称</th>"+
						        	"<th>接收时间</th>"+
						        	"<th>处理时间</th>"+
						        	"<th>审批时长</th>"+
						        "</tr>"+
						    "</thead>";
		var tableBodyHtml = "<tbody>#TBODY#</tbody>";
		
		var tbody = "";
		$.each(historicTaskInstances,function(key,value){
			tbody += eachCreateTableBody(value);
		})
		
		function eachCreateTableBody (historicTaskInstance){
			return "<tr>"+
			          "<td>"+historicTaskInstance.name+"</td>"+
			          "<td>"+formatDate(historicTaskInstance.createTime)+"</td>"+
			          "<td>"+formatDate(historicTaskInstance.endTime)+"</td>"+
			          "<td>"+getLongTime(historicTaskInstance.endTime - historicTaskInstance.createTime)+"</td>"+
			       "</tr>";
		}
		
		return tableHtml.replace("#TABLE#",(tableHeadHtml + tableBodyHtml.replace("#TBODY#", tbody)))
	}
	
	/**
	 * 格式化日期
	 */
	var formatDate = function(time, format){
		if(!format){
			format = "yyyy-MM-dd HH:mm:ss";
		}
		if(time){
			var t = new Date(time);
		    var tf = function(i){return (i < 10 ? '0' : '') + i};
		    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a){
		        switch(a){
		            case 'yyyy':
		                return tf(t.getFullYear());
		                break;
		            case 'MM':
		                return tf(t.getMonth() + 1);
		                break;
		            case 'mm':
		                return tf(t.getMinutes());
		                break;
		            case 'dd':
		                return tf(t.getDate());
		                break;
		            case 'HH':
		                return tf(t.getHours());
		                break;
		            case 'ss':
		                return tf(t.getSeconds());
		                break;
		        }
		    })
		} else {
			return "";
		}
	}
	
	/**
	 * 根据毫秒数得到时长
	 */
	var getLongTime = function(timeStr){
		if(timeStr >= 0){
			var secondTime = parseInt(timeStr/1000);
			if(secondTime < 60) {
				return secondTime+"秒";
			} 
			if(60 <= secondTime && secondTime < 3600) {
				var min = parseInt(secondTime / 60);
				var second = secondTime - min*60;
				return min + "分钟"+ second +"秒";
			} 
			if(3600 <= secondTime && secondTime < 86400) {
				var hour = parseInt(secondTime / 3600);
				var min = parseInt((secondTime - hour*3600) / 60);
				var second = secondTime - hour*3600 - min*60;
				return hour + "小时" + min + "分钟"+ second +"秒";
			} 
			if(secondTime >= 86400){
				var day = parseInt(secondTime / 86400);
				var hour = parseInt((secondTime - day*86400) / 3600);
				var min = parseInt((secondTime - day*86400 - hour*3600) / 60);
				//var second = secondTime - day*86400 - hour*3600 - min*60;
				return day + "天" + hour + "小时" + min + "分钟";
			}
		} else {
			return "";
		}
	}
	return Flow;
}(Flow || {}));