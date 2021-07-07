/**
*	加载富文本框 ueditor
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<script src=\""+baseHost+"resource/plug/ueditor1_4_3-utf8-jsp/ueditor.config.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/ueditor1_4_3-utf8-jsp/ueditor.all.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/ueditor1_4_3-utf8-jsp/lang/zh-cn/zh-cn.js\"></script>");
} else {
	document.write("<script src=\""+baseHost+"resource/plug/ueditor1_4_3-utf8-jsp/ueditor.config.js\"></script>");
	document.write("<script src=\""+baseHost+"/resource/plug/ueditor1_4_3-utf8-jsp/ueditor.all.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/ueditor1_4_3-utf8-jsp/lang/zh-cn/zh-cn.js\"></script>");
}