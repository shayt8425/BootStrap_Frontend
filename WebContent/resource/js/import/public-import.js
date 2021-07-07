/**
*	公用css  js 引用，这里有个baseHost全局变量，后面其他的引用js需要此变量，所以要求此js必须最先应用
*/
if(window.top.Stroage){
	var baseHost = window.top.Stroage.getItem("baseHost");//如果是window.open打开的页面，建议在页面里加上代码：Stroage.setItem("baseHost","项目根路径");
	document.write("<link href=\""+baseHost+"resource/plug/bootstrap-3.3.0/css/bootstrap.min.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<link href=\""+baseHost+"resource/plug/font-awesome-4.7.0/css/font-awesome.min.css\" rel=\"stylesheet\">"); 
	document.write("<link href=\""+baseHost+"resource/plug/toastr/toastr.css\" rel=\"stylesheet\">"); 
	document.write("<link href=\""+baseHost+"resource/css/style.css\" rel=\"stylesheet\">"); 
	document.write("<script src=\""+baseHost+"resource/js/jquery-1.11.0.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/bootstrap-3.3.0/js/bootstrap.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basestorage.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basesystem.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/toastr/toastr.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/bootbox.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/jquery-form/ajaxRequest.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/common.js\"></script>");
	document.write("<!--[if lt IE 9]>");
	document.write("<script src=\""+baseHost+"resource/js/html5shiv.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/respond.min.js\"></script>");
	document.write("<![endif]-->");
} else {
	//1 得到 http://xxxxx:yyy/
	var baseHost = window.document.location.protocol + "//" + window.document.location.host + "/";
	var shortenedUrl = window.document.location.href.replace(baseHost, "");
	//2替换http://xxxxx:yyy/后  得到地址的第一个斜杠 / 前的项目名。例如base-core。如果有域名，做了nginx反向代理可能无项目名，这里可能需要修改
	baseHost = baseHost + shortenedUrl.substring(0, shortenedUrl.indexOf("/")) + "/";
	
	document.write("<link href=\""+baseHost+"resource/plug/bootstrap-3.3.0/css/bootstrap.min.css\" rel=\"stylesheet\" media=\"screen\">"); 
	document.write("<link href=\""+baseHost+"resource/plug/font-awesome-4.7.0/css/font-awesome.min.css\" rel=\"stylesheet\">"); 
	document.write("<link href=\""+baseHost+"resource/plug/toastr/toastr.css\" rel=\"stylesheet\">"); 
	document.write("<link href=\""+baseHost+"resource/css/style.css\" rel=\"stylesheet\">"); 
	document.write("<script src=\""+baseHost+"resource/js/jquery-1.11.0.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/bootstrap-3.3.0/js/bootstrap.min.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basestorage.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/basesystem.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/toastr/toastr.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/bootbox.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/plug/jquery-form/ajaxRequest.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/common.js\"></script>");
	document.write("<!--[if lt IE 9]>");
	document.write("<script src=\""+baseHost+"resource/js/html5shiv.js\"></script>");
	document.write("<script src=\""+baseHost+"resource/js/respond.min.js\"></script>");
	document.write("<![endif]-->");
}