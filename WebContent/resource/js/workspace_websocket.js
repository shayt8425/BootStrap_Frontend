/*********************风场webSocket*********************/
FrontCommon.request(FrontCommon.contextPath+"/device/list.json",{productSerial:"3",isPass:"1"},function(data){
	if(data["code"]["code"]==0){
		var datas = data["result"];
		$('#windDeviceNums').html(datas.length);
		if(datas.length>0)getRealData(datas);
	}
})
var websocket;
function getRealData(datas){
	FrontCommon.startRealityWSConn(function(){
		websocket = this;
		websocket.onopen = function(event) {
			//连接成功后，自动调取数据
			var deviceArr = [];
			for (var idx in datas){
				deviceArr.push(datas[idx].deviceNo)
			}
			setTimeout(function(){
				sendMessage(deviceArr);
			},1000);
		};
		websocket.onmessage = function(event) {
			var data=JSON.parse(event.data);
			if(data["code"]&&data["code"]["code"]=="0-000"){//用户失效
				websocket.close();
			}else if(data["code"]&&data["code"]["code"]=="0-008"){//连接已建立
			}else if(data["code"]&&data["code"]["code"]=="0"){//接收到消息
				for(var idx in datas)datas[idx].settled = false;
				var result = JSON.parse(data["result"]["result"]);
				var allDatas = result[0]["data"];
				for(var idx2 in datas){//循环设备数据
					var flag = false;//设置一个判断变量
					for(var idx in allDatas){//设置对应的状态值
						if(allDatas[idx].serialnum==datas[idx2].deviceNo){//找到匹配的设备数据了
							datas[idx2].dataValue = allDatas[idx].signalData[0].signalValue;
							datas[idx2].settled = true;
							flag = true;
							break;
						}
					}
					if(!flag){//没有找到匹配的数据，状态为离线
						datas[idx2].dataValue = 0;
						datas[idx2].settled = true;
					}
				}
				//设置值进去
				setPowerCount(datas);
			}
		};
		websocket.onerror = function(event) {
		};
		websocket.onclose = function(event) {
		}
	});
}
function sendMessage(deviceArr){
	FrontCommon.request(FrontCommon.contextPath+"/conversion/getVCode.json",{"signal_content":"1#CI_SubIprEnergyReal"},function(data){
		if(websocket&&websocket.readyState==1){//可以通信才能发送消息
			websocket.send(JSON.stringify({type:'1',requestEntity:{"msgType":"message","frequency":"5000",
				"value":[{"protocol_type":"34",
					"serialnums":deviceArr,"signalNames":[data["result"]],"dev_type":"73"}]}}));
		}
	});
}
function setPowerCount(datas){
	var flag = true;
	var valueArr = [];
	for(var idx in datas){
		if(!datas[idx].settled){
			flag=false;
			break;
		}else{
			valueArr.push(datas[idx].dataValue);
		}
	}
	if(!flag){
		setTimeout(function(){
			setPowerCount(datas)
		},500);
	}else{
		getDoubleValue(valueArr.join(","))
	}
}
function getDoubleValue(str){
	FrontCommon.request(FrontCommon.contextPath+"/getDecimalValue.json",{str:str},function(data){
		//累计发电量
		$("#powerCount").text(data["result"]);
	})
}
/*****************************过分项webSocket*******************/
FrontCommon.request(FrontCommon.contextPath+"/device/list.json",{productSerial:"8",isPass:"1"},function(data){
	if(data["code"]["code"]==0){
		var datas = data["result"];
		if(datas.length>0){
			getRealData2(datas);
		}
	}
});
var websocket2;
function getRealData2(datas){
	FrontCommon.startRealityWSConn(function(){
		websocket2 = this;
		websocket2.onopen = function(event) {
			//连接成功后，自动调取数据
			var deviceArr = [];
			for (var idx in datas){
				deviceArr.push(datas[idx].deviceNo)
			}
			setTimeout(function(){
				sendMessage2(deviceArr);
			},1000);
		};
		websocket2.onmessage = function(event) {
			var data=JSON.parse(event.data);
			if(data["code"]&&data["code"]["code"]=="0-000"){//用户失效
				websocket2.close();
			}else if(data["code"]&&data["code"]["code"]=="0-008"){//连接已建立
			}else if(data["code"]&&data["code"]["code"]=="0"){//接收到消息
				for(var idx in datas)datas[idx].settled = false;
				var result = JSON.parse(data["result"]["result"]);
				var allDatas = result[0]["data"];
				for(var idx in allDatas){
					for(var idx2 in datas){
						if(allDatas[idx].serialnum==datas[idx2].deviceNo){
							datas[idx2].dataValue = allDatas[idx].signalData[0].signalValue;
							datas[idx2].settled = true;
							break;
						}
					}
				}
				//设置值进去
				setPowerCount2(datas);
			}
		};
		websocket2.onerror = function(event) {
		};
		websocket2.onclose = function(event) {
		}
	});
}

function sendMessage2(deviceArr){
	if(websocket2&&websocket2.readyState==1){//可以通信才能发送消息
		websocket2.send(JSON.stringify({type:'1',requestEntity:{"msgType":"message","frequency":"5000",
			"value":[{"protocol_type":"34",
				"serialnums":deviceArr,"signalNames":["v0006486462"],"dev_type":"98"}]}}));
	}
	
}

function setPowerCount2(datas){
	var flag = true;
	var valueArr = [];
	for(var idx in datas){
		if(!datas[idx].settled){
			flag=false;
			break;
		}else{
			valueArr.push(datas[idx].dataValue);
		}
	}
	if(!flag){
		setTimeout(function(){
			setPowerCount2(datas)
		},500);
	}else{
		getDoubleValue2(valueArr.join(","))
	}
}

function getDoubleValue2(str){
	FrontCommon.request(FrontCommon.contextPath+"/getDecimalValue.json",{str:str,divideNum:"1"},function(data){
		$("#all_change_times").text(data["result"]);
	})
}
/******************************************************************/