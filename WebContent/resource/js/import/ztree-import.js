/**
*	datatable css  js 引用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<link href=\""+baseHost+"resource/plug/ztree-v3/css/zTreeStyle.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/ztree-v3/js/jquery.ztree.all-3.5.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/baseztree.js\"></script>");
} else {
	document.write("<link href=\""+baseHost+"resource/plug/ztree-v3/css/zTreeStyle.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/ztree-v3/js/jquery.ztree.all-3.5.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/baseztree.js\"></script>");
}