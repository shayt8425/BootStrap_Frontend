$(function(){
	window.form1 = $(".common_form").formParser()[0];

	//内容区域高度
	$("#main-content").height(document.documentElement.clientHeight-110);
	graph();
})

var page = 1;
var total = 0;

var typeNodes = [{value:'',name:'全部'},{value:'1',name:'催办'}];

/**
 *	查询数据 
 */
function queryData(){
	$("#main-content").empty();
	page = 1;
	graph();
}

/**
 * 重置
 */
function resetForm(){
	window.form1.clear();
	page = 1;
	queryData();
}

//消息显示
function graph(){
	if(page===null){
		page = 1;
	}
	var params =  getParams({pageSize:20,pageNumber:page});
	$("#pageli").text(page);
	FrontCommon.showLoading();
	FrontCommon.request("notice/pageList.json",params,function(data){
		 //获取消息数据并显示到页面上
		FrontCommon.hideLoading();
		total = data.total;
		var pageTotal = Math.round(parseInt(total)/20)+1;
		$("#total").text(pageTotal);
		if(data.total==0){
			$("#main-content").append("<div style='width:100%;text-align:center;'>暂无通知!</div>")
		}else{
		$.each(data.rows,function(key,value){
			//已读/未读
			var stateclass;
			var statespan;
			if(value.state==='0'){
				stateclass = "label-danger";
				statespan = "未读";
			}
			if(value.state==='1'){
				stateclass = "label-success";
				statespan = "已读";
			}
			//通知类型
			var type;
			if(value.type==='1'){
				type = "催办";
			}
			var htm = "<div class='collapseTable'><table><thead><tr><th class='padding-left-10' width='30'><span class='label "+stateclass+"' id='span-"+value.id+"'>"+statespan+"<span></th>"
			+"<th class='padding-left-10' width='170'><span class='sky'>通知类型："+type+"</span></th>"
			+"<th class='padding-left-10'><b class='sky'>"+value.title+"</b></th>"
			+"<th class='padding-left-10 small sky' width='150'>"+value.time+"</th>"
			+"<th class='padding-right-10 text-right' width='80'><a data-toggle='collapse'  href='#"+value.id+"'><span>查看<i class='fa fa-chevron-down'></i></span><span class='hide'>收起<i class='fa fa-chevron-up'></i></span></a></th>"
			+"</tr></thead></table></div>"
			+"<div id='"+value.id+"' class='collapse'><table class='table table-bordered'>"
			+"<tr><td>"+value.sender_org_name+" "+value.sender_name+" 发来催办</td></tr>";
			if(value.remark!=null){
				htm += "<tr><td>"+value.remark+"</td></tr>";
			}
			if(value.content!=null){
				htm += "<tr><td>"+value.content+"</td></tr>";
			}
			htm += "</table></div>";
			$("#main-content").append(htm);
			$("a[href='#"+value.id+"']").click(function(){
				$("a[href='#"+value.id+"'] span").toggleClass("hide");
				if($("#span-"+value.id).text()=="未读"){
				     fun(value);
			    }
			});
		})
		}
	})
}

function fun(value){
	//若为未读，则把“未读”标识更新为”已读“，把通知图标上红点数字减1（如果结果为0则隐藏原点），并通过ajax把数据更新为已读
	var num = $("#noticeNum", window.top.document).text();
	num = parseInt(num)-1;
	//alert(num)
	if(num==0){
		$("#noticeNum", window.top.document).addClass("none");
	}else{
		$("#noticeNum", window.top.document).text(num);
	}
	if(value.state==='0'){
		$("#span-"+value.id).text("已读");
		$("#span-"+value.id).removeClass("label-danger");
		$("#span-"+value.id).addClass("label-success");
		$.ajax({//使通知状态更新为已读
			url:'notice/update.json',
			data:value,
			dataType:'json',
			type:'post'
		})
	}
}

//显示消息的查询条件	
function getParams(params){
	    var queryParamObj = {receiver:top.getSessionUserObj().userId};	
//	    var data = window.form1.getFormData();
		var formData = window.form1.getFormData();
		for(var attr in formData){
			if(attr=="type"){
				if(formData[attr]==""){
					formData[attr] ='1';
				}
			}else{
				if(formData[attr]=="")formData[attr]=undefined;
			}
		}
		var queryParamObjCp = {};
		for(var attr in queryParamObj){
			queryParamObjCp[attr] = queryParamObj[attr];
		}
		var paramObj = $.extend(queryParamObjCp,formData);
		params.jsonParam = JSON.stringify(paramObj);
		return params; 
}

//获取上一页
function prev(){
	if(page>1){
		page -= 1;
		$("#main-content").empty();
		graph();
	}
}

//获取下一页
function next(){
	if((total!=null) && (page<total/20)){
		page += 1;
		$("#main-content").empty();
		graph();
	}
}