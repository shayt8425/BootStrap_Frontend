/**
 * 系统本地存储类，存储系统变量。如果系统不支持localStorage就存cookie
 * Author: Gavin
 * Date: 2015-07-13
 * Version: 1.0
 */
var Stroage = (function(Stroage){
	/**
	 * 是否支持本地存储，true:支持，false:不支持。
	 * 说明：本地存储在ie8+，及所有主流浏览器中都支持。ie6和ie7不支持，这两种浏览器暂时在本系统中不考虑
	 */
	Stroage.isSuport = function(){
	    if (typeof window.localStorage === 'object' && typeof window.sessionStorage === 'object'){
	    	return true;
	    }
	    return false;
	};
	/**
	 * 保存数据，默认存localStorage，如果浏览器不支持，就存cookie
	 */
	Stroage.setItem = function(key,value,expiredays){
		if(Stroage.isSuport()){//存localStorage
			localStorage.setItem(key, value);
		} else {//存cookie
			if(!expiredays){	//如果不传过期天数，就默认30天
				expiredays = 30;
			}
		    var exp = new Date();
		    exp.setTime(exp.getTime() + expiredays*24*60*60*1000);
		    document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
		}
	};
	/**
	 * 获取数据，默认从localStorage
	 */
	Stroage.getItem = function(key){
		if(Stroage.isSuport()){//取localStorage
			return localStorage.getItem(key);
		} else { //取cookie
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
		    if(arr=document.cookie.match(reg)){
		    	return unescape(arr[2]);
		    } else {
		    	return null;
		    }
		}
	};
	/**
	 * 删除指定的数据
	 */
	Stroage.removeItem = function(key){
		try {
			if(Stroage.isSuport()){//localStorage
				localStorage.removeItem(key);
			} else { //cookie
				var exp = new Date();
			    exp.setTime(exp.getTime() - 1);
			    var cval=getCookie(name);
			    if(cval!=null){
			    	document.cookie= name + "="+cval+";expires="+exp.toGMTString();    	
			    }
			}
		} catch (e) {
			
		}
	};
	/**
	 * 删除所有的本地存储
	 */
	Stroage.clear = function(){
		try {
			localStorage.clear();
		} catch (e) {
			
		}
	};
	
	return Stroage;
}(Stroage || {}))