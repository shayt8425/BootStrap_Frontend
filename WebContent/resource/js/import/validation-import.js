/**
*	jQuery-Validation-Engine css  js 引用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<link href=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/css/validationEngine.jquery.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/js/languages/jquery.validationEngine-zh_CN.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/js/jquery.validationEngine.js\"></script>");
} else {
	document.write("<link href=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/css/validationEngine.jquery.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/js/languages/jquery.validationEngine-zh_CN.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/jquery-validation-engine-2.6.4/js/jquery.validationEngine.js\"></script>");
}