/**
 * 生成附件插件
 * 需要个性化输入的参数为：
 * uploader（必须）：上传action路径
 * host（可选）：如果不传，则取cookie中的路径
 * attach_id_dom（必须）：附件隐藏域的dom对象，为jquery对象。如：$("#attach_id")，用来存放此业务数据的附件id，可以为空，为空则在上传第一个附件后自动生成赋值
 * control（可选）：有三位数字组成，控制附件上传，下载，删除操作,允许为1，不允许为0。默认为：111。如：111表示可上传，下载，删除。110表示可上传，下载，不可删除
 * 自定义回调函数：
 * baseUploadSuccess：上传成功后的事件
 * baseDeleteBefore:删除附件前的事件
 * baseDeleteSuccess：删除附件成功后的事件
 * baseListSuccess：加载附件列表成功后的事件
 */
(function($){
	$.fn.baseuploadify = function(options){
		// 如不传参数，则全部使用默认配置
		if(options == undefined){
			options = {};
		}
		//设置上传路径
		if(!options.host){
			options.host = FrontCommon.contextPath + "/";
		}
		
		// 如果不传值，则默认给id为attach_id_dom的隐藏域赋值
		if(!options.attach_id_dom){
			options.attach_id_dom = $("#attach_id_dom");
		}
		
		// <!-- 如果需要显示图片预览 如上传头像时，定义该标签即可 名字固定为preview_pic_dom ,暂只支持一张图片 -->
	    // <img id="preview_pic_dom" style="width: 100px; height: 100px;"/>
		options.preview_pic_dom = $("#preview_pic_dom");
		
		// list_group_show 上传完成后是否显示上传文件的列表信息 true显示　false不显示
		if(options.list_group_show == undefined){
			options.list_group_show = true;
		}
		// file_queue_show 是否显示进度条　true 显示 false不显示
		if(options.file_queue_show == undefined){
			options.file_queue_show = true;
		}
		
		//设置参数
		var setting = "";
		var this_dom = this;
		//默认参数
		var defaults = {
			control:'111',
			//baseUploadSuccess:function(){},
			//baseDeleteBefore:function(){},
			//baseDeleteSuccess:function(){},
			//baseListSuccess:function(){},
			swf : options.host + "resource/plug/uploadify-3.2.1/uploadify.swf",
  	        uploader : options.host + "attach/uploadFile.json",
  	        buttonClass : "btn btn-info",
  	        buttonText : "上传文件",
  	        fileObjName : "files",	//文件域的name，后台接收文件的name
  	        fileSizeLimit : "200MB",//如果为整数型则表示以KB为单位的大小，如果是字符串，使用(B, KB, MB, or GB)为单位，比如’2MB’，此参数只表示前台控制的大小。后台需要另外设置
  	        fileTypeExts : "*.*", 	//设置可以选择的文件的类型，格式如：’*.doc;*.pdf;*.rar’ 。
  	        fileTypeDesc : "请选择附件",  //这个属性值必须设置fileTypeExts属性后才有效，用来设置选择文件对话框中的提示文本，如设置fileTypeDesc为“请选择rar doc pdf文件”
  	        formData : {},	//JSON格式上传每个文件的同时提交到服务器的额外数据，注意！！！ 只能设置静态参数（在插件初始化前就已经存在且不变的值）
  	        multi : true,
  	        removeCompleted : true,
  	        removeTimeout : 1,//如果设置了任务完成后自动从队列中移除，则可以规定从完成到被移除的时间间隔，单位 S。
  	        width : '120',//设置文件浏览按钮的宽度
  	        onInit : function(){//初始化完后的方法,如果设置为不可上传，则注销此上传插件
  	        	$("#"+this_dom.attr("id")).append("<span id='fileCount' style='margin-left: 18px'></span>");
  	        	//页面为file域，但经过插件解析后，变成一个div，这里取file域的id，通过此id的选择器找到邻近的附件列表list
  	        	var list_group_dom = $("#"+this_dom.attr("id")).nextAll(".list-group").eq(0);//附件展示区域
  	        	if(list_group_dom.length==0){
  	        		list_group_dom =$("#"+this_dom.attr("id")+"_ul");
  	        	}
  	        	list_group_dom.attr("relate_id", this_dom.attr("id"));
  	        	if(!options.file_queue_show){
  	        		$("#" + this_dom.attr("id")+ "-queue").hide(); // 隐藏上传列表
  	        	}
  	        	if(options.preview_pic_dom.length > 0){ // 如可以获取预览的dom信息，并且attach_id_dom有值时 则展示预览信息
  	        		if(setting.attach_id_dom.val() != ""){
  	        			// 下载头像文件
  	        			options.preview_pic_dom.attr("src", options.host+"attach/downloadFileBySpare1.json?bd_attach_id=" + setting.attach_id_dom.val() + "&spare1=1");
  	        		}
  	        	}
  	        	if(options.list_group_show){
  	        		listAttach(setting, list_group_dom);
  	        	}
  	        	options.attach_id_dom.bind("change", function(){
  	        		listAttach(setting, list_group_dom);
  	        	});
  	        	if(!setting.control){
  	        		setting.control = "111";//默认为可上传，可下载，可删除
  	        	}
  	        	if(setting.control.length == 3){
  	        		if(setting.control.charAt(0) == "0"){
  	        			this_dom.uploadify("destroy");
  	        			this_dom.remove();	//TODO 为什么不能删除？？？ 
  	        			$("#"+this_dom.attr("id")).remove();
  	        		}
  				} else {
  					this_dom.uploadify("destroy");
  				}
  	        	//下载方法
  	        	list_group_dom.on("click",".attach_donwload",function(){
  	        		var $this = $(this);
  	        		$.fn.baseuploadify.download({
  	        			host : options.host,
  	        			beforeDownload:setting.basebeforeDownload,
  	        			attach_id : $this.parent().attr("id")
  	        		});
  	        	});
  	        	//删除方法
  	        	list_group_dom.on("click",".attach_delete",function(){
  	        		var $this = $(this);
  	        		$.fn.baseuploadify.del({
  	        			host : options.host,
  	        			attach_id : $this.parent().attr("id"),
  	        			deleteBefore:setting.baseDeleteBefore,
  	        			deleteSuccess:function(data){
  	        				if(data.code.code == 0){
  	        					if(setting.baseDeleteSuccess){
  	        						setting.baseDeleteSuccess();
  	        					}
  	        					$this.parent().parent().find("#" + data.result.attach_id).remove();  	        					
  	        					refreshCount(null, list_group_dom.attr("relate_id"));
  	        				}
  	        			}
  	        		})
  	        	});
  	        }, 
  	      	onFallback : function(){
  	      		FrontCommon.warning("此浏览器不支持flash，请先安装flash插件！");
  	      	},
  	        onUploadProgress : function(){
  	        	if(options.preview_pic_dom.length > 0){ // 上传的过程中, 在图片预览区显示正在加载的图标
	      			options.preview_pic_dom.attr("src", options.host+"resource/images/loading-1.gif");
	      		}
  	        },
  	      	onSelectError : function (file, errorCode, errorMsg) {  
              switch (errorCode) {  
                  case -100:  
                	  FrontCommon.warning("上传的文件数量已经超出系统限制的" + jQuery('#file_upload').uploadify('settings', 'queueSizeLimit') + "个文件！");  
                      break;  
                  case -110:  
                	  FrontCommon.warning("文件 [" + file.name + "] 大小超出系统限制的" + jQuery('#file_upload').uploadify('settings', 'fileSizeLimit') + "大小！");
                      break;  
                  case -120:  
                	  FrontCommon.warning("文件 [" + file.name + "] 大小异常！");  
                      break;  
                  case -130:  
                	  FrontCommon.warning("文件 [" + file.name + "] 类型不正确！");  
                      break;  
              }
  	      	},
  	      	onUploadStart : function(file){
  	      		//设置动态参数,如果有自定义参数会追加
  	      		var formData = $.extend({}, this_dom.uploadify("settings", "formData"), {bd_attach_id:setting.attach_id_dom.val(), from_source:setting.from_source});
  	      		if(options.preview_pic_dom.length > 0){// 如果是上传头像信息
  	      			formData.spare1 = 1; // 用备用字段1 表示为上传的是头像信息
  	      		}
  	      		this_dom.uploadify("settings", "formData", formData);
  	      	},
  	      	onUploadSuccess : function(file, data, response){
  	      		var list_group_dom = $("#"+this_dom.attr("id")).nextAll(".list-group").eq(0);
  	      		if(list_group_dom.length==0){
	        		list_group_dom =$("#"+this_dom.attr("id")+"_ul");
	        	}
  	      		data = $.parseJSON(data);
  	      		if(data.code.code == 0){
  	      			if(options.preview_pic_dom){ // 如可以获取预览的dom信息，则展示预览信息
  	      				options.preview_pic_dom.attr("src", options.host+"attach/downloadFile.json?attach_id="+data.result.attach_id);
  	      			}
  	      			if(options.list_group_show){ // 无需展示上传列表的信息，如上传头像信息等特殊情况时
  	      				//页面为file域，但经过插件解析后，变成一个div，这里取file域的id，通过此id的选择器找到邻近的附件列表list
  	      				if($("#"+this_dom.attr("id")).nextAll(".list-group").length==0){ //如果用于展示的ul不在file域下
  	      					$("#"+this_dom.attr("id")+"_ul").append(showOneAttach.call(list_group_dom,setting,data.result));
  	      				}else{
  	      				$("#"+this_dom.attr("id")).nextAll(".list-group")
  	      				.eq(0)
  	      				.append(showOneAttach.call(list_group_dom,setting,data.result));
  	      				
  	      				}
  	      			}
  	      			setting.attach_id_dom.val(data.result.bd_attach_id);//上传成功后，赋值业务附件id
  	      		} else {
  	      			FrontCommon.warning(data.code.msg);
  	      		}
  	      		if(options.baseUploadSuccess){
  	      			options.baseUploadSuccess(file,data);	//自定义的上传成功的回调函数，file:为插件file对象，具体参考文档，data:为服务器断返回来的数据
  	      		}
  	      	}
		}
		//extend参数
		setting = $.extend({}, defaults, options);
		
		this_dom.uploadify(setting);	//调用上传插件!!!!!!!!!
	};
	
	/**
	 * 删除附件
	 */
	$.fn.baseuploadify.del = function(options){
		var defaults = {
			attach_id : "",	//要删除的附件id
			//deleteBefore:function(){},	//删除前的方法
			//deleteSuccess:function(){}	//删除成功的方法
		}
		//设置参数
		var setting = $.extend({}, defaults, options);
		if(setting.attach_id && setting.attach_id != "" && setting.attach_id != undefined ){
			if(setting.deleteBefore){
				setting.deleteBefore();	//删除前回调
			}
			$.ajax({
				url:setting.host+"attach/delete.json",
				type:"post",
				dataType:"json",
				data:{"attach_id":setting.attach_id},
				contentType:"application/x-www-form-urlencoded;charset=UTF-8",
				beforeSend:function(XHR){},
				success:function(data, textStatus, jqXHR){
					//do something...
					if(setting.deleteSuccess){
						setting.deleteSuccess(data);	//删除后回调
					}
				},
				error:function(XMLHttpRequest, textStatus, errorThrown){},
				complete:function(XHR, TS){}
			});
		}
	};
	/**
	 * 下载附件
	 */
	$.fn.baseuploadify.download = function(options){
		var defaults = {
			attach_id : "",	//要下载的附件id
			beforeDownload:function(){}	//下载前的方法
		}
		//设置参数
		var setting = $.extend({}, defaults, options);
		if(setting.beforeDownload){
			setting.beforeDownload(setting.attach_id);
		}
		location.href = options.host+"attach/downloadFile.json?attach_id="+setting.attach_id;
	};
	
	//闭包私有函数。显示一行附件信息
	function showOneAttach(options, data){
		if(options.control == ""){
			options.control = "111";//默认为可上传，可下载，可删除
		}
		var count = this.children().length; // 拼接序号
		var li_str = "<li class=\"list-group-item\" id=\""+data.attach_id+"\"><span name='count' style='float:left'>" + (++count) + ".</span>";
		//如果是图片，则显示缩略图
		var mime_type = "image/jpeg;image/png;image/bmp;image/gif;image/x-icon;image/pict;image/tiff";
		if(mime_type.indexOf(data.mime_type) >= 0){
			li_str += "<span><img class='attach_img' style='position: absolute;right: 10px;top: 3px;' width='32' height='32' src='"+options.host+"attach/downloadFile.json?attach_id="+data.attach_id+"'></span> ";
		}
		li_str += "<div class='upload_filename_cls' style='float:left' title='"+data.really_name+"'>"+data.really_name+"</div>";
		if(options.show_uploader){
			li_str += "&nbsp;&nbsp; 上传者："+(data.uploader_name?data.uploader_name:"未知上传者");
		}
		if(options.show_created){
			li_str += "&nbsp;&nbsp; 上传时间："+data.created;
		}
		if(options.control.length == 3){
			if(options.control.charAt(1) == "1"){
				li_str += "&nbsp;&nbsp;<span class=\"attach_btn attach_donwload\" ><a href=\"###\">下载</a></span>";
			}
			if(options.control.charAt(2) == "1"){
				li_str += "&nbsp;&nbsp;<span class=\"attach_btn attach_delete\"><a href=\"###\">删除</a></span>";
			}
			if(mime_type.indexOf(data.mime_type) >= 0){
				li_str += "&nbsp;&nbsp;<span class=\"attach_btn attach_look\" ><a href='javacript:void(0)' onclick=\"viewImg('"+options.host+"attach/downloadFile.json?attach_id="+data.attach_id+"')\">查看</a></span>";
			}
		}
		li_str += "<span class=\"badge\" style='margin-right:30px'>"+showFileSize(data.file_size)+"</span>";
		refreshCount(count, this.attr("relate_id"));
		return li_str+"</li>";
	}
	//闭包私有函数。构造文件大小，分B K M显示
	function showFileSize(fileSize){
		if(fileSize < 1024){
			fileSize = Math.round(fileSize) + "B";
		} else if(fileSize >= 1024 && fileSize < 1024*1024 ){
			fileSize = Math.round(fileSize / 1024) +"K";
		} else if(fileSize >= 1024*1024){
			fileSize = Math.round(fileSize / (1024*1024)) +"M";
		} else {
			fileSize = "";
		}
		return fileSize;
	}
	//闭包私有函数。查询此业务数据的附件列表
	function listAttach(options,list_dom){
		$.ajax({
			url:options.host+"attach/listByBdAttachId.json",
			type:"post",
			dataType:"json",
			data:{"bd_attach_id":options.attach_id_dom.val()},
			contentType:"application/x-www-form-urlencoded;charset=UTF-8",
			beforeSend:function(XHR){},
			success:function(data, textStatus, jqXHR){
				if(data.code.code == 0){
					//请求成功
					list_dom.html("");
					$.each(data.result,function(key,value){
						list_dom.append(showOneAttach.call(list_dom,options,value));
					});
				} else {
					list_dom.html("");
				}
				if(options.baseListSuccess){
					options.baseListSuccess(data); 
				}
			},
			error:function(XMLHttpRequest, textStatus, errorThrown){},
			complete:function(XHR, TS){}
		});
	}
	
	
})(jQuery)

// 删除后刷新序号
function refreshCount(count, main_dom_id){
	var spans = $("#"+main_dom_id).find(".list-group").find("span[name='count']"); // 拼接序号
	if(count){
		$("#"+main_dom_id).find("#fileCount").html("附件数:" + count);
	}else{
		$("#"+main_dom_id).find("#fileCount").html("附件数:" + spans.length);
	}
	spans.each(function(index){
		$(this).html(++inde+".");
	 });
}

function viewImg(src){
	window.open(FrontCommon.contextPath + "/viewImg.html?"+src);
}