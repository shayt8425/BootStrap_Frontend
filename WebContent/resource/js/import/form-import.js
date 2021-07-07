/**
*	form css  js 引用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<script src=\""+baseHost+"resource/plug/jquery-form/jquery.initForm.js\"></script>");
} else {
	document.write("<script src=\""+baseHost+"resource/plug/jquery-form/jquery.initForm.js\"></script>");
}