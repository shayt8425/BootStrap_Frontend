/**
*	jQuery-Validation-Engine css  js 引用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<link href=\""+baseHost+"resource/plug/datetimepicker/css/bootstrap-datetimepicker.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/datetimepicker/js/bootstrap-datetimepicker.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js\"></script>");
} else {
	document.write("<link href=\""+baseHost+"resource/plug/datetimepicker/css/bootstrap-datetimepicker.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/datetimepicker/js/bootstrap-datetimepicker.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN.js\"></script>");
}