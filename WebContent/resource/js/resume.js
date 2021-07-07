/**
 * 画设备履历图
 * @param deviceNo 设备编号
 */
function drawResume(deviceNo){
	var url = "http://"+top.location.host+"/DriveManager/deviceresume/list.json";
	$.ajax({
		url:url,
		data:{deviceNo:deviceNo},
		type:'post',
		dataType:'json',
		success:function(data){
			var list = data['result'];
			console.log(list)
			for(var i in list){
				drawNode(list[i].happenTime,list[i].content,list[i].type);
				if(i<list.length-1){
					$('#record').append("<div class='connect-big'></div>");
				}
			}
			$('.revordDiv-big').eq(0).css("margin","0px")
		}
	})
}
function drawNode(time,content,type){
	var url = "http://"+top.location.host+"/DriveManager/resource/images/resume/";
	var word = "";
	if(type == 1){
		word = "设计";
	}else if(type == 2){
		word = "运维";
	}
	var imgClass = "img-big";
	var revordClass = "revordDiv-big";
	var connectClass = "connect-big";
	var html = "<div class='"+revordClass+"'><div class='tip-bubble tip-time'><div>"+time+"</div></div> <img class='"+imgClass+"' src=\""+url+type+".png\"> <span class='wordTitle'>"+word+"</span> <div class='tip-bubble tip-content'><div>"+content+"</div></div></div>"; 
	$('#record').append(html);
}