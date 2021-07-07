RTU.DEFINE(function(require, exports) {
/**
 * 模块名：机车管理
 * name：locomanager
 * date:2015-10-09
 * version:1.0 
 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");  
    require("jquery-uploadify/css/uploadify.css");
    require("jquery-uploadify/jquery.uploadify.js");
    var $html;
    var $html1;
	var popuwnd;
	var popuwnd1;
	var data;
	var data1;
	var flag;
	
	RTU.register("app.locomanagement.query.loadHtml", function() {  //初始化加载html
		return function() {
			RTU.invoke("core.router.load",{
				url:"../app/modules/locomanagement/locomanagement-query.html",
				success:function(html){
					$html = $(html);
					var Resolution=getResolution();
					Twitdh=Resolution.Twidth-140;
					Theight=Resolution.Theight-80;					
					if (popuwnd) {
						popuwnd.html($html);
						popuwnd.init();
					}else{
						popuwnd = new PopuWnd({
							title : data.alias,
							html : $html,
							width : Twitdh,
							height : Theight,
							left : 135,
							top : 60,
							shadow : true,
							removable:false,  //设置弹出窗口是否可拖动
							deletable:true	  //设置是否显示弹出窗口的关闭按钮
						});
						popuwnd.remove = popuwnd.close;
						popuwnd.close = popuwnd.hidden;
						popuwnd.init();
					}
					RTU.invoke("header.msg.hidden");
					
					RTU.invoke("app.locomanagement.query.initselect");
					//查询按钮
					$("#management_query",$html).unbind("click").click(function(){
						var data=checkcondition();
						if(data!=false){
							RTU.invoke("header.msg.show", "加载中,请稍后!!!");
							RTU.invoke("app.locomanagement.query.showData",data);						
						}
					});	
					$("#management_exp",$html).unbind("click").click(function(){
						var data=checkcondition();
			    		if(window.confirm("确认要导出到excel吗?")){
				     		window.location.href = "../locomanagement/explocomanagement?cj="+data.cj+"&department="+
				     		data.department+"&depot_name="+data.depot_name+"&loco_name="+data.tempdata;				     		
				     	}
					});	
					
					
					//智能提示
					RTU.invoke("app.locomanagement.query.create");
					
					$("#management_query",$html).click();   // $('p, div').css('margin', '0');这个是并列选择器
					RTU.invoke("app.locomanagement.inituploadify", 
	                		[$("#management_imp"),data]); //初始化文件上传插件                RTU.invoke("app.realtimelocomotivequery.inituploadify", 
					//更新
					$("#locomanagementmenu2",$html).unbind("click").click(function(){  
						$("#content-locomanagement-rightClickDiv").addClass("hidden");
						if(data1!=false){
							RTU.invoke("header.msg.show", "加载中,请稍后!!!");
							flag=2;
							RTU.invoke("app.locomanagement.edit.activate");							
							$("#locomanagement_edit_locotypeid").val(data1.locoTypeid);
							$("#locomanagement_edit_locono").val(data1.locoNo);							
							$("#locomanagement_edit_locoAB").val(data1.locoAb);
							$("#locomanagement_edit_loconame").val(data1.locoNameSys);
							//$("#locomanagement_edit_department").val(data1.);
							//$("#locomanagement_edit_depot").val(data1.depotId);							
							$("#locomanagement_edit_dwd").val(data1.depotName);
							$("#locomanagement_edit_cj").val(data1.cj);
							$("#locomanagement_edit_lj").val(data1.wheel1);
							$("#locomanagement__edit_lj1").val(data1.wheel2);							
							$("#locomanagement_edit_TSC").val(data1.isInstall);
							$("#locomanagement_edit_TSCfactory").val(data1.tscCorp);
							$("#locomanagement_SIM").val(data1.simNo);
							$("#locomanagement_edit_TSCtype").val(data1.tscType);							
							$("#locomanagement_edit_stata").val(data1.locoUseId);
						}					
					});				
					//插入，清空表单数据
					$("#locomanagementmenu1",$html).unbind("click").click(function(){
						$("#content-locomanagement-rightClickDiv").addClass("hidden");
						flag=1;
						RTU.invoke("header.msg.show", "加载中,请稍后!!!");
						RTU.invoke("app.locomanagement.edit.activate");
						$("#locomanagement_edit_locotypeid").val("");
						$("#locomanagement_edit_locono").val("");							
						$("#locomanagement_edit_locoAB").val("0");//AB节：0
						$("#locomanagement_edit_loconame").val("");					
						$("#locomanagement_edit_dwd").val("");
						$("#locomanagement_edit_cj").val("");
						$("#locomanagement_edit_lj").val("");
						$("#locomanagement__edit_lj1").val("");							
						$("#locomanagement_edit_TSC").val("0");//安装TSC：否
						$("#locomanagement_edit_TSCfactory").val("");
						$("#locomanagement_SIM").val("");
						$("#locomanagement_edit_TSCtype").val("");							
						$("#locomanagement_edit_stata").val("0");//运用状态：非应用
					});
					//删除
					$("#locomanagementmenu3",$html).unbind("click").click(function(){
						$("#content-locomanagement-rightClickDiv").addClass("hidden");
						var senddata={"recId":data1.recId}
						RTU.invoke("app.locomanagement.edit.delete",senddata);					
					});	
				}
			});
		};
	});
	
	var bureauList;
	RTU.register("app.locomanagement.query.initselect",function(){
		return function(){
			RTU.invoke("core.router.get", {
	        	url:"locomanagement/findAllBureaus",       	
	            success: function (data) {
	                if (data.success) {  
	                	bureauList=data.data;
	                	$("#locomanagement_department option[value!='']").remove();
	                	$("#locomanagement_depot option[value!='']").remove();
	                	$("#locomanagement_cj option[value!='']").remove();
	                	if(bureauList&&bureauList.length>0)
		                {
	                		for(var i=0;i<bureauList.length;i++){
	                			$("#locomanagement_department").append("<option value='"+bureauList[i].bid+"'>"
	                					+bureauList[i].bName+"</option>");
		                	}
	                		$("#locomanagement_department").unbind("change").bind("change",function(){
	                			$("#locomanagement_depot option[value!='']").remove();
	    	                	$("#locomanagement_cj option[value!='']").remove();
	                			for(var m=0;m<bureauList.length;m++){
	                				if(bureauList[m].bid==$(this).val()){
	                					for(var n=0;n<bureauList[m].dwdParamList.length;n++){
	                						$("#locomanagement_depot").append("<option value='"+bureauList[m].dwdParamList[n].dwdName+"'>"
	        	                					+bureauList[m].dwdParamList[n].dwdName+"</option>");
	                					}
	                					break;
	                				}
	                			}
	                			$("#management_query").click();
	                		});
	                		$("#locomanagement_depot").unbind("change").bind("change",function(){
	                			$("#locomanagement_cj option[value!='']").remove();
	                			var flag=false;
	                			for(var m=0;m<bureauList.length;m++){
	                				if(flag)break;
	                				if(bureauList[m].bid==$("#locomanagement_department").val()){
	                					for(var n=0;n<bureauList[m].dwdParamList.length;n++){
	                						if(bureauList[m].dwdParamList[n].dwdName==$(this).val()){
	                							for(var p=0;p<bureauList[m].dwdParamList[n].cjList.length;p++){
	                								$("#locomanagement_cj").append("<option value='"+bureauList[m].dwdParamList[n].cjList[p]+"'>"
	    	        	                					+bureauList[m].dwdParamList[n].cjList[p]+"</option>");
	                							}
	                							flag=true;
	                							break;
	                						}
	                					}
	                				}
	                			}
	                			$("#management_query").click();
	                		});
	                		$("#locomanagement_cj").unbind("change").bind("change",function(){
	                			$("#management_query").click();
	                		});
		                }
	                } 
	            },
	        });
		}
	});
	
	RTU.register("app.locomanagement.edit.init", function() {  //初始化加载html	
		RTU.invoke("core.router.load",{
			url:"../app/modules/locomanagement/locomanagement-edit.html",
			success:function(html){
				$html1 = $(html);
				if(popuwnd1){
					popuwnd1.html($html1);
				}
				//局下拉框
	        	 $("#locomanagement_edit_department",$html1).change(function () {
	      			RTU.invoke("app.locomanagement.query.searchDepot",{bureau:$("#locomanagement_edit_department").val()});
	              });
				//退出
				$("#management_edit_out",$html1).unbind("click").click(function(){
					popuwnd1.hidden();
				});
				$("#management_edit_sava",$html1).unbind("click").click(function(){
					var senddata={
					    "recId":data1.recId,
						"locoTypeid":$("#locomanagement_edit_locotypeid").val(),
						"locoNo":$("#locomanagement_edit_locono").val(),						
						"locoAb":$("#locomanagement_edit_locoAB").val(),
						"locoNamesys":$("#locomanagement_edit_loconame").val(),
						"department": $("#locomanagement_edit_department").val(),
						"depotnamejw": $("#locomanagement_edit_depot").val(),//机务段
						"depotName":$("#locomanagement_edit_dwd").val(), //电务段
						"cj":$("#locomanagement_edit_cj").val(),
						"wheel1":$("#locomanagement_edit_lj").val(),
						"wheel2":$("#locomanagement__edit_lj1").val(),							
						"isInstall":$("#locomanagement_edit_TSC").val(),
						"tscCorp":$("#locomanagement_edit_TSCfactory").val(),
						"simNo":$("#locomanagement_SIM").val(),
						"tscType":$("#locomanagement_edit_TSCtype").val(),							
						"locoUseId":$("#locomanagement_edit_stata").val(),
						"memo":$("#locomanagementmemo").val(),
						"locoName":data1.locoName,
						"depotId":data1.depotId,
						"simInstallName":data1.simInstallName,
   						"gpsgs":data1.gpsgs,
   						"fcjc":data1.fcjc
					};
					if (flag==2){
						RTU.invoke("app.locomanagement.edit.update",senddata);
					}  else{
						RTU.invoke("app.locomanagement.edit.insert",senddata);
					}							
				});
				
			}
		});
	});
	
	RTU.register("app.locomanagement.edit.update",function(){
		var refreshFun=function(data){
	        RTU.invoke("core.router.get", {
	        	url:"locomanagement/updatedata?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+
	        	"&locoNamesys="+data.locoNamesys+"&depotnamejw="+data.depotnamejw+"&depotName="+data.depotName+"&cj="+data.cj+"&memo="+data.memo+
	        	"&wheel1="+data.wheel1+"&wheel2="+data.wheel2+"&isInstall="+data.isInstall+"&tscCorp="+data.tscCorp+
	        	"&simNo="+data.simNo+"&tscType="+data.tscType+"&locoUseId="+data.locoUseId+"&department="+data.department+"&recId="+data.recId+
	        	"&locoName="+data.locoName+"&depotId="+data.depotId+"&simInstallName="+data.simInstallName+"&gpsgs="+data.gpsgs+"&fcjc="+data.fcjc,       	
	            success: function (data) {
	                if (data.success) {  
	                	RTU.invoke("header.alarmMsg.show", "保存成功");                 
	                } else {RTU.invoke("header.alarmMsg.show", "保存失败");}
	            },
	        });
		};
		
		return function(data){
			if (data.locoTypeid==""){
	    		RTU.invoke("header.alarmMsg.show","请输入机车型号");
				return false;
			}
			if (data.locoNo==""){
	    		RTU.invoke("header.alarmMsg.show","请输入机车号");
				return false;
			};
			if (data.locoAb==""){
	    		RTU.invoke("header.alarmMsg.show","请输入AB节");
				return false;
			};
			refreshFun(data);
		};
	});
	
	RTU.register("app.locomanagement.edit.insert",function(){
		var refreshFun=function(data){
	        RTU.invoke("core.router.get", {
	        	url:"locomanagement/insertdata?locoTypeid="+data.locoTypeid+"&locoNo="+data.locoNo+"&locoAb="+data.locoAb+
	        	"&locoNamesys="+data.locoNamesys+"&depotnamejw="+data.depotnamejw+"&depotName="+data.depotName+"&cj="+data.cj+"&memo="+data.memo+
	        	"&wheel1="+data.wheel1+"&wheel2="+data.wheel2+"&isInstall="+data.isInstall+"&tscCorp="+data.tscCorp+
	        	"&simNo="+data.simNo+"&tscType="+data.tscType+"&locoUseId="+data.locoUseId+"&department="+data.department+"&recId="+data.recId,       	
	            success: function (data) {
	                if (data.success) {  
	                	RTU.invoke("header.alarmMsg.show", "插入成功");  
	                	var data=checkcondition();
						if(data!=false){
							RTU.invoke("header.msg.show", "加载中,请稍后!!!");
							RTU.invoke("app.locomanagement.query.showData",data);	
						}
	                } else {RTU.invoke("header.alarmMsg.show", "插入失败");}
	            },
	        });
		};
		
		return function(data){
			if (data.locoTypeid==""){
	    		RTU.invoke("header.alarmMsg.show","请输入机车型号");
				return false;
			}
			if (data.locoNo==""){
	    		RTU.invoke("header.alarmMsg.show","请输入机车号");
				return false;
			};
			if (data.locoAb==""){
	    		RTU.invoke("header.alarmMsg.show","请输入AB节");
				return false;
			};
			refreshFun(data);
		};
	});
	
	RTU.register("app.locomanagement.edit.delete",function(){
		var refreshFun=function(data){
	        RTU.invoke("core.router.get", {
	        	url:"locomanagement/deletedata?recId="+data.recId,       	
	            success: function (data) {
	                if (data.success) {  
	                	RTU.invoke("header.alarmMsg.show", "删除成功");    
	                	var data=checkcondition();
						if(data!=false){
							RTU.invoke("header.msg.show", "加载中,请稍后!!!");
							RTU.invoke("app.locomanagement.query.showData",data);	
						}
	                } else {RTU.invoke("header.alarmMsg.show", "删除失败");}
	            },
	        });
		};		
		return function(data){
			refreshFun(data);
		};
	});
	
	RTU.register("app.locomanagement.edit.activate", function() {
		return function() {
			RTU.invoke("header.msg.hidden");
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-80;
			if (!popuwnd1) {
				popuwnd1 = new PopuWnd({
					title : data1.locoName,
					html : $html1,
					width : Twitdh,
					height : Theight,
					left : 135,
					top : 60,
					shadow : true,
					removable:false,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd1.remove = popuwnd1.close;
				popuwnd1.close = popuwnd1.hidden;
				popuwnd1.init();
			} else {
				popuwnd1.init();
			}
		};
	});
	
	RTU.register("app.locomanagement.query.activate", function() {
		return function() {
			RTU.invoke("app.locomanagement.query.loadHtml");
		};
	});
	
	var checkcondition=function(){
		var data={};
		data.department=$("#locomanagement_department").val();
		data.depot_name=$("#locomanagement_depot").val();
		data.tempdata=$("#locomanagement_loco").val();
		data.cj=$("#locomanagement_cj").val();
		/*if (data.tempdata){
			
		}else{
			data.tempdata="all";
		}*/
		return data;			
	};
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
	RTU.register("app.locomanagement.query.deactivate", function() {
		return function() {
			if (popuwnd1) {
				popuwnd1.hidden();
			}
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	RTU.register("app.locomanagement.query.init", function() {
		data = RTU.invoke("app.setting.data", "locomanagement");
		if (data && data.isActive) {
			RTU.invoke("app.locomanagement.query.activate");
		}		
		return function() {
			return true;
		};
	});
    
	RTU.register("app.locomanagement.query.showData",function(){
		var refreshFun=function(data){
//	    		var showData=[];
//	    		if(data&&data.length>0){
//	    			showData=data;
//	    		}
			RTU.invoke("header.msg.hidden");
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-145;	
			Theight=Resolution.Theight-160;	
			trainislateGrid = new RTGrid({
				url:"../locomanagement/querylocomanagement?cj="+data.cj+"&department="+data.department+"&depot_name="+data.depot_name+"&loco_name="+data.tempdata,
//	                datas: showData,
	            containDivId: "locomanagement-bodyDiv-body-grid",
	            tableWidth: Twitdh,
	            tableHeight: Theight,
	            isSort: true, //是否排序
	            hasCheckBox: false,
	            showTrNum: true,
	            isShowPagerControl: true,
	            isShowRefreshControl:false,
	            beforeLoad:function(that){
					that.pageSize =30;
				},
                trRightClick:function(returnData){   //右键
     				 var clientX=returnData.clientX;
      				 var clientY=returnData.clientY;
      				var rightDiv=$("#content-locomanagement-rightClickDiv");
     				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth  ;
	   		         var height1 = document.documentElement.clientHeight;
	   		         if((clientX+width)>width1){
	   					  $(rightDiv).css({"left":(clientX-50-width)+"px"});
	   				 }else{
	   					  $(rightDiv).css({"left":(clientX-100)+"px"});
	   				 }
	   				 if((clientY+height)>height1){
	   				  $(rightDiv).css({"top":(clientY-60-height)+"px"});
	   				 }else{
	   				  $(rightDiv).css({"top":(clientY-60)+"px"});
	   				 }
	   				 $(rightDiv).removeClass("hidden");
	   				  data1={
	   						 "recId":returnData.data.data.recId,
	   						"locoTypeid":returnData.data.data.locoTypeid,
	   						"locoNo":returnData.data.data.locoNo,
	   						"locoAb":returnData.data.data.locoAb,
	   						"depotId":returnData.data.data.depotId,
	   						"locoName":returnData.data.data.locoName,
	   						"depotIdDw":returnData.data.data.depotIdDw,
	   						"depotIdYy":returnData.data.data.depotIdYy,
	   						"locoUseId":returnData.data.data.locoUseId,
	   						"lkjType":returnData.data.data.lkjType,
	   						"locoCl":returnData.data.data.locoCl,
	   						"lcdCl":returnData.data.data.lcdCl,
	   						"locoPrgCl":returnData.data.data.locoPrgCl,
	   						"locoOverpass":returnData.data.data.locoOverpass,
	   						"wheel1":returnData.data.data.wheel1,
	   						"wheel2":returnData.data.data.wheel2,
	   						"memo":returnData.data.data.memo,
	   						"isInstall":returnData.data.data.isInstall,
	   						"simInstall":returnData.data.data.simInstall,
	   						"simNo":returnData.data.data.simNo,
	   						"isReg":returnData.data.data.isReg,
	   						"tscType":returnData.data.data.tscType,
	   						"tscCorp":returnData.data.data.tscCorp,
	   						"depotName":returnData.data.data.depotName,
	   						"simInstallName":returnData.data.data.simInstallName,
	   						"locoNameSys":returnData.data.data.locoNameSys,
	   						"cj":returnData.data.data.cj,
	   						"gpsgs":returnData.data.data.gpsgs,
	   						"fcjc":returnData.data.data.fcjc,
	   						"department":returnData.data.data.bname,
	   						"depotnamejw":returnData.data.data.depotnamejw
	   						
	   				 };	   				                   
                },
                clickTrEvent: function (t) {   //点击行
                },
	            loadPageCp: function (t) {
	            	
	                t.cDiv.css("left", "200px");
	                t.cDiv.css("top", "200px");
                    if (t.param.datas.length == 0) {
                   	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                        return;
                    }

	            },
	            colNames: ["机车", "所属段", "所属车间",  "TSC型号",  "TSC厂家",  "SIM卡号","备注"],
	            colModel: [{ name: "locoName", isSort: true }, { name: "depotName", isSort: true }, { name: "cj",  isSort: true }, { name: "tscType",isSort: true }, { name: "tscCorp",isSort: true }, { name: "simNo", isSort: true},{ name: "memo", isSort: true}]
	        });
			//$(".RTTable_Head tr td:first",$(".trainistrainisAntecedents_div")).html("序号");
		
		};
		
		return function(data){	    		
	    		refreshFun(data);
		};
	});
	
	
	//搜索框智能提示
	RTU.register("app.locomanagement.query.create", function () {
	    var autocompleteBuilder1 = function (object, url, exParams, parse) {
	        try {
	            url = "../" + url;
	            object.autocomplete(url, {
	                minChars: 0,
	                width: 172,
	                matchContains: true,
	                autoFill: false,
	                max: 100,
	                dataType: "json",
	                extraParams: exParams,
	                parse: parse,
	                formatItem: function (data, i, totle) {
	                    return data;
	                },
	                formatResult: function (format) {
	                    return format;
	                }
	            });

	        } catch (e) {
	        }
	    };
	    var initCheciNameAuto1 = function () {
	        CheciNameExParams1 = {
	            keyword: function () {
	                return $('#locomanagement_loco').val();
	            }
	        };

	        CheciNameParse1 = function (data) {
	            data = data.data;
	            var rows = [];
	            for (var i = 0; i < data.length; i++) {
	                var text1 = $.trim(data[i].locoTypeName);
	                var text4 = $.trim(data[i].locoNO);
	                var text5 = $.trim(data[i].locoAb);
	                if(text5!="1"&&text5!="2"){
	                	text5="";
	                }else if(text5=="1"){
	                	text5="A";
	                }else{
	                	text5="B";
	                }
	                var aa = text1 + "-" + text4+text5;
	                rows[rows.length] = {
	                    data: "<table style='z-index:99999;'><tr><td align='center' style='width:85px;'>" + aa + "</td></tr></table>",
	                    value: aa,
	                    result: aa
	                };
	            }
	            return rows;
	        };
	        autocompleteBuilder1($("#locomanagement_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
	        $('#locomanagement_loco').result(function (event, autodata, formatted) {
	            if (!formatted) {
	                $('#locomanagement_loco').val(formatted);
	            }
	        });
	    };
	    return function () {
	        setTimeout(function () {
	            initCheciNameAuto1();
	        }, 10);
	    };
	});
 
    //根据局来查找段
    RTU.register("app.locomanagement.query.searchDepot",function(){
    	return function(data){
    		var url="depot/searchDepotByBureau";
    		var param={
	              url: url,
	              data:{
	                  "bureau":data.bureau,
	              },
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.locomanagement.query.setDepot",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });  
    
    //设置段的下拉
    RTU.register("app.locomanagement.query.setDepot",function(){
    	return function(data){
    		var depotHtml="<option value='全部' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
    			depotHtml=depotHtml+"<option value="+item.dName+"  class='selectOptionCss'>"+item.dName+"</option>";
            });
    		$("#locomanagement_edit_depot").html(depotHtml);    		
    	};
    });    
   
// 拆分机车字符串
   RTU.register("app.trainislate.query.splitlocoNo", function () {
       return function (locoTypeStr) {
           var locoTypeName = "";
           var locoNo = "";
           var locoAb = "";
           if (locoTypeStr == "") {
               return {
                   locoTypeName: "",
                   locoNo: ""
               };
           }
           //是纯数字的时候约定输入的是机车号
           var n = Number(locoTypeStr);
           if (!isNaN(n)) {
               locoTypeName = "";
               locoNo = locoTypeStr;
           } else {
               var str = locoTypeStr.split('-');
               if (str.length == 2) {
                   locoTypeName = str[0];
                   locoNo = str[1];
               } else if (str.length > 2) {
                   locoTypeName += str[0];
                   for (var i = 1; i < str.length - 1; i++) {
                       locoTypeName += ("-" + str[i]);
                   }
                   locoNo = str[str.length - 1];
               } else if (str.length < 2) {
                   locoTypeName = locoTypeStr;
               }
           }
           return {
               locoTypeName: locoTypeName,
               locoNo: locoNo,
               locoAb:locoAb
           };
       };
   });
   
   //初始化文件上传插件
   RTU.register("app.locomanagement.inituploadify", function () {/*
       return function (data) {
       	//上传文件插件的处理  
           $(data[0]).uploadify({
               swf: '../static/js/jquery-uploadify/swf/uploadify.swf', //按钮路径
               uploader: '../upFile/upLoadFile', //请求后台URL
               width: '71',
               height: '22',
               method: 'POST',
               buttonClass: 'upLoadFileBtn1',
               buttonText: "导入Excel",
               buttonCursor: 'hand',
               preventCaching: true,
               auto: false, //不自动上传
               multi: false, //是否允许多选
               removeTimeout: 10, //消失时间
               fileTypeExts: '*.*',
               fileSizeLimit:'10MB',
               formData: { 'folderName': 'img' ,'deviceId':(data[2]?data[2]:"9")}, //文件夹名称
               overrideEvents: [ 'onDialogClose','onSelectError' ],
               onUploadStart: function (file) {
                   var newdata = "";
                   for (var i = 0; i < data[1].length; i++) {
                       newdata += data[1][i] + ";";
                   }
                   newdata = newdata.substring(0, newdata.length - 1);
                   //在onUploadStart事件中，也就是上传之前，把参数写好传递到后台。  
                   
                   $(data[0]).uploadify("settings", "formData", { 'userName': RTU.data.user.realName, 'data': newdata
                   	});
               },
               onSelect: function (fileObj) {
               //    var name = fileObj.name;
                 //  $(".file-upload-input",parentObjClass).val(name);
               },
               onSelectError: function(file, errorCode, errorMsg){
               	 var msgText = "上传失败\n";  
                    switch (errorCode) {  
                        case SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED:  
                            msgText += "每次最多上传 " + this.settings.queueSizeLimit + "个文件";  
                            break;  
                        case SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT:  
                            msgText += "文件大小超过限制( " + this.settings.fileSizeLimit + " )";  
                            break;  
                        case SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE:  
                            msgText += "文件大小为0";  
                            break;  
                        case SWFUpload.QUEUE_ERROR.INVALID_FILETYPE:  
                            msgText += "文件格式不正确，仅限 " + this.settings.fileTypeExts;  
                            break;  
                        default:  
                            msgText += "错误代码：" + errorCode + "\n" + errorMsg;  
                    }  
                    alert(msgText);  
               },
               onUploadSuccess: function (file, data, response) {
                   //更新上传记录
                   findByUpLoadState(true);
               },
               onCancel: function () {
               	$(".file-upload-input",parentObjClass).val("");
               }
           });
       };
   */});
	
});