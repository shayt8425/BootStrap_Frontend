RTU.DEFINE(function(require, exports) {
/**
 * 模块名：设备质量追踪机车管理
 * name：devicequalitytrack
 * date:2015-2-12
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("../common/common.js");
    require("../../../css/app/locomotivefeedback/feedbackquery.css");
    
    var $devmanQueryHtml;
	var popuwnd_devmanquery;
	
	RTU.register("app.devicequalitytrack.devmanquery.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/devicequalitytrack/app-devicequalitytrack-deviceman.html",
			success:function(html){
				$devmanQueryHtml = $(html);
				if(popuwnd_devmanquery){
					popuwnd_devmanquery.html($devmanQueryHtml);
				}			
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.devicequalitytrack.devmanquery.activate", function() { //使得popuwnd对象活动
		return function(data) {
			
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			Twitdh=Resolution.Twitdh;
			Theight=Resolution.Theight;			
			if (!popuwnd_devmanquery) {
				popuwnd_devmanquery = new PopuWnd({
					title : "设备配置管理",
					html : $devmanQueryHtml,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : false,
					removable:true,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd_devmanquery.remove = popuwnd_devmanquery.close;
				popuwnd_devmanquery.close = popuwnd_devmanquery.hidden;
				popuwnd_devmanquery.init();
			} else {
				popuwnd_devmanquery.init();
			}	
			$("#devman_locoQueryDiv td,input").addClass("inputTdClass");
			$("#devman_locoQueryDiv th").addClass("thClass");
			RTU.invoke("app.devicequalitytrack.devmanquery.initinput",data);

		};
	});

	var getResolution=function(){
		var Resolution={};
/*		Resolution.Twitdh=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	*/
		Resolution.Twitdh=document.documentElement.clientWidth-140;
		Resolution.Theight=document.documentElement.clientHeight-60;
		/*Resolution.Twitdh=document.documentElement.clientWidth ;
		Resolution.Theight=document.documentElement.clientHeight;*/
		return Resolution;
	};
	
	RTU.register("app.devicequalitytrack.devmanquery.deactivate", function() { //隐藏
		return function() {
			if (popuwnd_devmanquery) {
				popuwnd_devmanquery.close();
			}
		};
	});		

	RTU.register("app.devicequalitytrack.devmanquery.initinput",function(){
		function initSelect(data){
			$("#devman_locoQueryDiv input[type='text'],textarea").val("");
			$("#devman_locoQueryDiv th[deviceCode]").removeAttr("deviceId");
			$("select[name='devmanLocoSel'] option[value!='']").remove();
			var url="devicequalitytrack/searchLocosByProperty";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (resData) {
                	 if(resData&&resData.data){
                		 for(var i=0;i<resData.data.length;i++){
                			 $("select[name='devmanLocoSel']").
                			 append("<option value='"+resData.data[i].recId+"' "+
                			(data&&data==resData.data[i].loconame?"selected":"")+">"+resData.data[i].loconame+"</option>");
                		 }
                		 if(data){
                			 locoChange($("select[name='devmanLocoSel']").val());
                		 }
                	 }
                  },
                  error: function () {
                  }
				};
			    RTU.invoke("core.router.get", param);
		};
		function initSaveBtn(){
			var locoId=$("select[name='devmanLocoSel']").val();
			if(locoId){
				if(!window.confirm("确认要保存该配置吗?")){
					return;
				}
				var pData={};
				/*pData.locoDeviceViewList=[];*/
				pData.locoId=locoId;
				pData.sysNum=[];
				pData.parentDeviceid=[];
				pData.deviceCode=[];
				pData.deviceNo=[];
				pData.deviceVerProc=[];
				pData.deviceVerData=[];
				pData.deviceType=[];
				pData.deviceId=[];
				pData.deviceName=[];
				pData.note=[];
				var pDataLen=0;
				for(var count=1;count<=2;count++){
					var str=count==1?"i":"ii";
					var th_i=$("#host_fieldset_"+str+" th[deviceCode]");
					for(var i=0;i<th_i.length;i++){
						/*pData.locoId[pDataLen]=locoId;*/
						pData.sysNum[pDataLen]=count.toString();
						var deviceCode=$(th_i[i]).attr("deviceCode");
						pData.deviceCode[pDataLen]=deviceCode;
						pData.deviceId[pDataLen]=$(th_i[i]).attr("deviceId")?$(th_i[i]).attr("deviceId"):"";
						pData.deviceType[pDataLen]=$(th_i[i]).attr("deviceType")?$(th_i[i]).attr("deviceType"):"";
						pData.parentDeviceid[pDataLen]=i==0?"":"host";
						pData.deviceName[pDataLen]=$(th_i[i]).html().replace(":","");
						if(deviceCode!="data"){
							pData.deviceNo[pDataLen]=$("#host_fieldset_"+str+" input[name='"+deviceCode+"TypeTxt'").val();
							pData.deviceVerProc[pDataLen]=$("#host_fieldset_"+str+" input[name='"+deviceCode+"VerTxt'").val();
							pData.deviceVerData[pDataLen]="";
						}
						else{
							pData.deviceNo[pDataLen]="";
							pData.deviceVerData[pDataLen]=$("#host_fieldset_"+str+" input[name='dataVerTxt'").val();
							pData.deviceVerProc[pDataLen]="";
						}
						pData.note[pDataLen]="";
						pDataLen++;
					}
					
					for(var m=0;m<2;m++){
						var fieldsetId="";
						if(m==0){
							fieldsetId="#extend_fieldset_";
						}
						else fieldsetId="#dmi_fieldset_";
						var th_ii=$(fieldsetId+str+" th[deviceCode]");
						for(var i=0;i<th_ii.length;i++){
							/*pData.locoId[pDataLen]=locoId;*/
							pData.sysNum[pDataLen]=count.toString();
							var deviceCode=$(th_ii[i]).attr("deviceCode");
							pData.deviceCode[pDataLen]=deviceCode;
							pData.parentDeviceid[pDataLen]="";
							pData.deviceVerData[pDataLen]="";
							pData.deviceId[pDataLen]=$(th_ii[i]).attr("deviceId")?$(th_ii[i]).attr("deviceId"):"";
							pData.deviceType[pDataLen]=$(th_ii[i]).attr("deviceType")?$(th_ii[i]).attr("deviceType"):"";
							pData.deviceName[pDataLen]=$(th_ii[i]).html().replace(":","");
							pData.deviceNo[pDataLen]=$(fieldsetId+str+" input[name='"+deviceCode+"TypeTxt'").val();
							pData.deviceVerProc[pDataLen]=$(fieldsetId+str+" input[name='"+deviceCode+"VerTxt'").val();
							pData.deviceVerData[pDataLen]="";
							pData.note[pDataLen]="";
							pDataLen++;
						}
						/*pData.locoId[pDataLen]=locoId;*/
						
					}
				}
				pData.sysNum[pDataLen]="0";
				pData.deviceCode[pDataLen]=$("#devman_locoQueryDiv textarea[name='otherRemark']").attr("deviceId")?
						$("#devman_locoQueryDiv textarea[name='otherRemark']").attr("deviceId"):"";
				pData.parentDeviceid[pDataLen]="";
				pData.deviceVerData[pDataLen]="";
				pData.deviceId[pDataLen]="";
				pData.deviceType[pDataLen]="";
				pData.deviceName[pDataLen]="";
				pData.deviceNo[pDataLen]="";
				pData.deviceVerProc[pDataLen]="";
				pData.note[pDataLen]=$("#devman_locoQueryDiv textarea[name='otherRemark']").val();
				var param={
			              url: "devicequalitytrack/saveLocoDevice",
			              async:false,
			              data:pData,
		                  success: function (resData) {
		                	  if(resData&&resData.success){
		                		  RTU.invoke("header.notice.show", "保存机车:"
		                				  +$("select[name='devmanLocoSel'] option:selected").html()+"配置成功!");
		                		  locoChange(locoId);
		                	  }
		                	  else{
		                		 alert("后台发生了异常,错误信息:"+resData.msg); 
		                	  }
		                  },
		                  error: function (e) {
		                	 alert("调用错误!");
		                  }
						};
				 RTU.invoke("core.router.post", param);
			}
			else{
				RTU.invoke("header.notice.show", "请选择机车");
			}
			
			
		};
		function locoChange(value){
			$("#devman_locoQueryDiv input[type='text'],textarea").val("");
			$("#devman_locoQueryDiv th[deviceCode]").removeAttr("deviceId");
			if(value){
				var url="devicequalitytrack/getLocoDeviceInfoByProperty?locoId="+value;
	    		var param={
		              url: url,
		              cache: false,
	                  asnyc: true,
	                  datatype: "json",
	                  success: function (resData) {
	                	 if(resData&&resData.data){
	                		 var locoDeviceList=resData.data;
	                		 for(var i=0;i<locoDeviceList.length;i++){
	                			var locoDevice=locoDeviceList[i];
	                			if(locoDevice.sysNum==1){
	                				if(locoDevice.deviceCode!='data'){
	                					if(locoDevice.parentDeviceid||locoDevice.deviceCode=="host"){
	                						$("#host_fieldset_i th[deviceCode='"+locoDevice.deviceCode+"']").attr("deviceId",locoDevice.deviceId)
	                						.attr("deviceType",locoDevice.deviceType);
	                						$("#host_fieldset_i input[name='"+locoDevice.deviceCode+"TypeTxt']").val(locoDevice.deviceNo);
			                				$("#host_fieldset_i input[name='"+locoDevice.deviceCode+"VerTxt']").val(locoDevice.deviceVerProc);
	                					}
	                					else if(locoDevice.deviceCode=="dmi"){
	                						$("#dmi_fieldset_i th[deviceCode='dmi']")
	                						.attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                						$("#dmi_fieldset_i input[name='dmiTypeTxt']").val(locoDevice.deviceNo);
			                				$("#dmi_fieldset_i input[name='dmiVerTxt']").val(locoDevice.deviceVerProc);
	                					}
	                					else{
	                						$("#extend_fieldset_i th[deviceCode='"+locoDevice.deviceCode+"']")
	                						.attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                						$("#extend_fieldset_i input[name='"+locoDevice.deviceCode+"TypeTxt']").val(locoDevice.deviceNo);
			                				$("#extend_fieldset_i input[name='"+locoDevice.deviceCode+"VerTxt']").val(locoDevice.deviceVerProc);
	                					}
	                				}
	                				else {
	                					$("#fieldset_i th[deviceCode='data']").attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                					$("#fieldset_i input[name='dataVerTxt']").val(locoDevice.deviceVerData);
	                				}
	                				
	                			}
	                			else if(locoDevice.sysNum==2){
	                				if(locoDevice.deviceCode!='data'){
	                					if(locoDevice.parentDeviceid||locoDevice.deviceCode=="host"){
	                						$("#host_fieldset_ii th[deviceCode='"+locoDevice.deviceCode+"']").attr("deviceId",locoDevice.deviceId)
	                						.attr("deviceType",locoDevice.deviceType);
	                						$("#host_fieldset_ii input[name='"+locoDevice.deviceCode+"TypeTxt']").val(locoDevice.deviceNo);
			                				$("#host_fieldset_ii input[name='"+locoDevice.deviceCode+"VerTxt']").val(locoDevice.deviceVerProc);
	                					}
	                					else if(locoDevice.deviceCode=="dmi"){
	                						$("#dmi_fieldset_ii th[deviceCode='dmi']")
	                						.attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                						$("#dmi_fieldset_ii input[name='dmiTypeTxt']").val(locoDevice.deviceNo);
			                				$("#dmi_fieldset_ii input[name='dmiVerTxt'").val(locoDevice.deviceVerProc);
	                					}
	                					else{
	                						$("#extend_fieldset_ii th[deviceCode='"+locoDevice.deviceCode+"']")
	                						.attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                						$("#extend_fieldset_ii input[name='"+locoDevice.deviceCode+"TypeTxt']").val(locoDevice.deviceNo);
			                				$("#extend_fieldset_ii input[name='"+locoDevice.deviceCode+"VerTxt']").val(locoDevice.deviceVerProc);
	                					}
	                				}
	                				else {
	                					$("#fieldset_ii th[deviceCode='data']").attr("deviceId",locoDevice.deviceId).attr("deviceType",locoDevice.deviceType);
	                					$("#fieldset_ii input[name='dataVerTxt'").val(locoDevice.deviceVerData);
	                				}
	                			}
	                			else{
	                				
	                				$("#devman_locoQueryDiv textarea[name='otherRemark']").val(locoDevice.note).attr("deviceId",locoDevice.deviceId);
	                			}
	                		 }
	                	 }
	                  },
	                  error: function () {
	                  }
					};
				    RTU.invoke("core.router.get", param);
			}
		}
		return function(data){
			initSelect(data);
			$("#devman_locoQueryDiv .devmanSave").unbind("click").bind("click",function(){
				initSaveBtn();
			});
			$("select[name='devmanLocoSel']").unbind("change").bind("change",function(){
				locoChange($(this).val());
			});
		};
	});

	
});
