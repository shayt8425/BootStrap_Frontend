RTU.DEFINE(function (require, exports) {
/**
 * 模块名：个人设置--地图级别设置--属性显示默认级别
 * name：
 * date:2015-2-12
 * version:1.0 
 */
	require("app/home/app-map.js");
	
	RTU.register("map.carNameDefault", function () {
		var stationData =userData["carNameDefault"];
	    if(stationData == "hide"){
	    	RTU.invoke("map.marker.tIPSMarkerClose");
    		RTU.tipsShow="close";
	    } else {
	    	RTU.invoke("map.marker.tIPSMarkerOpen");
    		RTU.tipsShow="open";
	    }
		return function () {
	    };
    });
	
//    //信号机
//	var signData =userData["telesemeIconDefault"];
//    RTU.register("map.railWaySignSetting", function () {
//    	ToolManager.addScale(10, null, null, 23);
//    	var signLayer = Map.addLayer("../railWay/railWaySign?path=");
//    	signLayer.Div.div.style.zIndex=20;
//    	if(signData == "hide"){
//    		signLayer.Div.div.style.display = "none";
//    	} else {
//    		signLayer.Div.div.style.display = "block";
//    	}
//        return function () {
//            return signLayer;
//        };
//    });
//    
    //信号机名
//    RTU.register("map.railWaySignNameSetting", function () {
//    	ToolManager.addScale(10, null, null, 23);
//    	var signData =window.userData["telesemeIconDefault"];
//    	var signNameData =window.userData["telesemeNameDefault"];
//    	if(signNameData == "show" && signData == "show"){
//    		RTU.invoke("map.railWaySignName");
//    	} else {
//    		RTU.invoke("map.remove.railWaySignName");
//    	}
//        return function () {
//        	return signNameLayer;
//        };
//    });
//    
//    //道岔
//    RTU.register("map.railWayPoiSetting", function () {
//    	ToolManager.addScale(10, null, null, 23);
//    	var poiLayer = Map.addLayer("../railWay/railWayPoi?path=");
//    	poiLayer.Div.div.style.zIndex=10;
//    	var poiData =userData["turnoutIconDefault"];
//    	if(poiData == "hide"){
//    		poiLayer.Div.div.style.display = "none";
//    	} else {
//    		poiLayer.Div.div.style.display = "block";
//    	}
//        return function () {
//        	return poiLayer;
//        };
//    });
    
});