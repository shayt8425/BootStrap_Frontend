(function(window,$){
	
	//消息窗使用，toastr
	toastr.options = {
	  "closeButton": false,
	  "debug": false,
	  "onclick": null,
	  "showDuration": "300",
	  "hideDuration": "1000",
	  "timeOut": 3000,
	  "extendedTimeOut": "1000",
	  "positionClass":"toast-top200-center",
	  "showEasing": "swing",
	  "hideEasing": "linear",
	  "showMethod": "fadeIn",
	  "hideMethod": "fadeOut"
	}
	
	window.BootStrapMessage = new Object();//定义Message对象
	
	window.BootStrapMessage.warning = function(message,title){
		//调用之前，将其他的消息提示框隐藏掉
		if(window.toastEle&&window.toastEle.length>0){
			window.toastEle.hide();
			toastr.remove(window.toastEle);
		}
		window.toastEle = toastr.warning(message,title);
	}
	
	window.BootStrapMessage.error = function(message,title){
		//调用之前，将其他的消息提示框隐藏掉
		if(window.toastEle&&window.toastEle.length>0){
			window.toastEle.hide();
			toastr.remove(window.toastEle);
		}
		window.toastEle = toastr.error(message,title);
	}
	
	window.BootStrapMessage.info = function(message,title){
		//调用之前，将其他的消息提示框隐藏掉
		if(window.toastEle&&window.toastEle.length>0){
			window.toastEle.hide();
			toastr.remove(window.toastEle);
		}
		window.toastEle = toastr.info(message,title);
	}

	window.BootStrapMessage.success = function(message,title){
		//调用之前，将其他的消息提示框隐藏掉
		if(window.toastEle&&window.toastEle.length>0){
			window.toastEle.hide();
			toastr.remove(window.toastEle);
		}
		window.toastEle = toastr.success(message,title);
	}
})(window,jQuery);