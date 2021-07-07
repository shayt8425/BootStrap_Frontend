/**
*	datatable css  js 引用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");
	document.write("<link href=\""+baseHost+"resource/plug/datatables-1.10.2/media/css/jquery.dataTables.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/datatables-1.10.2/media/js/jquery.dataTables.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basedatatable.js\"></script>");
} else {
	document.write("<link href=\""+baseHost+"resource/plug/datatables-1.10.2/media/css/jquery.dataTables.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<script src=\""+baseHost+"resource/plug/datatables-1.10.2/media/js/jquery.dataTables.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basedatatable.js\"></script>");
}