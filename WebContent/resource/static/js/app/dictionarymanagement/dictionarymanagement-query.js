RTU.DEFINE(function (require, exports) {
/**
 * 模块名：字典管理
 * name：dictionaryManagement
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("app/home/app-loadData.js");
//    require("inputTip/css/inputTip.css");
//    require("inputTip/inputTip.js");
    require("../../../css/app/dictionarymanagement/dictionarymanagement.css");
    require("jquery/jquery-scroll.js");
    
    var popuwnd_onlleft = null; //左侧弹出窗口
    var dictionaryManagementGrid;//段
    var dictionaryManagementLocoNoGrid;//机车
    //加载数据并初始化窗口和事件
    RTU.register("app.dictionaryManagement.locospread.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                    	$html=$(html);
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
//                            var mainDiv=$(".content-locospread-MainDiv");
//                            var height=mainDiv.height();
//                            var width=mainDiv.width();
                        	RTU.invoke("app.dictionaryManagement.query.depotShowData");//加载段数据
                        	RTU.invoke("app.dictionaryManagement.query.locoNoShowData");//加载机车数据
                        }
                    }
                });
            }
        };
    });
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
    
    //查询窗口
    RTU.register("app.dictionaryManagement.query.activate", function () {
        return function () {
            //查询窗口
        	RTU.invoke("header.msg.hidden");
        	var Resolution=getResolution();
			var width=Resolution.Twidth-140;
			var height=Resolution.Theight-60;
			
            RTU.invoke("app.dictionaryManagement.locospread.loadHtml", { url: "../app/modules/dictionarymanagement/dictionaryManagement-query.html", fn: function (html) {
            	if (!popuwnd_onlleft) {
                    popuwnd_onlleft = new PopuWnd({
                        title: "字典管理",
                        html: html,
                        width: width ,
                        height:height ,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    popuwnd_onlleft.remove = popuwnd_onlleft.close;
                    popuwnd_onlleft.close = popuwnd_onlleft.hidden;
                    popuwnd_onlleft.init();
                }
                else {
                    popuwnd_onlleft.init();
                }
                return popuwnd_onlleft;
            }, initEvent: function () { //初始化事件
            	RTU.invoke("app.dictionaryManagement.query.initTopBtn");
            	RTU.invoke("app.dictionaryManagement.bname.initTopBtn");
            }
            });
        };
    });
    
    //初始化头部tab切换
    var tabTitle="depot";//区分标识
    RTU.register("app.dictionaryManagement.query.initTopBtn",function(){
    	return function(){
    		//段
    		$(".dictionaryManagement-tab-start-head").unbind("click").click(function(){
    			tabTitle="depot";
    			$(".header_parameter_bureau").css("display","none");
    			$(".header_parameter_locoNo").css("display","none");
    			 $(".header_parameter_depot").css("display","table");
    			 $(".dictionaryManagement-DuanbodyDiv-body").css("display","block");
    			 $(".dictionaryManagement-locoNoBodyDiv-body").css("display","none");
    			 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
    			 $(" .dictionaryManagement-tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 $(" .dictionaryManagement-tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                 
    		});
    		//局
    		$(".dictionaryManagement-tab-middle").unbind("click").click(function(){
    			tabTitle="bureau";
    			$(".header_parameter_locoNo").css("display","none");
    			$(".header_parameter_depot").css("display","none");
    			$(".header_parameter_bureau").css("display","table");
    			$(".dictionaryManagement-DuanbodyDiv-body").css("display","none");
    			$(".dictionaryManagement-locoNoBodyDiv-body").css("display","none");
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
                $(" .dictionaryManagement-tab-end-div").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
                $(" .dictionaryManagement-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
    		
    		});
    		//机车	
    		$(".dictionaryManagement-tab-end-div").unbind("click").click(function(){
    			tabTitle="locoNo";
    			$(".header_parameter_bureau").css("display","none");
    			$(".header_parameter_depot").css("display","none");
    			$(".header_parameter_locoNo").css("display","table");
    			$(".dictionaryManagement-DuanbodyDiv-body").css("display","none");
    			$(".dictionaryManagement-locoNoBodyDiv-body").css("display","block");
    			$(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-top-click").addClass("border-left");
    			$(" .dictionaryManagement-tab-middle").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
    			$(" .dictionaryManagement-tab-start-head").removeClass("border-bottom-type").addClass("tab-background").removeClass("border-top-click");
    		
    		});
    		
    		//查询
    		$(".dmanagement_query").unbind("click").click(function(){
    			//获取条件
    			if(tabTitle=="depot"){
    				var data=getSelectData();
    				RTU.invoke("app.dictionaryManagement.query.depotShowData",data);
    			}else if(tabTitle=="locoNo"){
    				var shortName =$("#dictionaryManagement-select-locoNoShortName").val();
    				RTU.invoke("app.dictionaryManagement.query.locoNoShowData",shortName);//加载机车数据
    			}
    			return false;
    		});
    		
    		setLocoNoShortName();//初始化显示机车简称
    		
    		//增加    弹出表格
    		$('.dmanagement_insert').unbind("click").click(function(){
    			//打开背景
    			$("#dictionaryManagement-dg").addClass("dictionaryManagement-dg");
    			if(tabTitle=="depot"){
    				clearData();
    				$("#dictionaryManagement-insert").css("display","block");
    				setTabLeftTopPx(tabTitle);//设置弹出位置
    				$("#dictionaryManagement-insert-recid").attr("option","add");
    				$("#dictionaryManagement-tabTitle").text("增加段");
    			}else if(tabTitle=="locoNo"){
    				clearLocoNoData();
    				$("#dictionaryManagement-locoNo-insert").css("display","block");
    				setTabLeftTopPx(tabTitle);//设置弹出位置
    				$("#dictionaryManagement-locoNo-insert-recid").attr("option","add");
    				$("#dictionaryManagement-locoNo-tabTitle").text("增加机车型号");
				}
    			return false;
    		});
    		
    		//判断段编号是否存在于数据库中
    		$('#dictionaryManagement-insert-recid').unbind("blur").blur(function(){
    			//验证
    			if($("#dictionaryManagement-insert-recid").attr("option")!="update")
    			validated(true);
    		});
    		
    		//判断机车编号是否存在于数据库中
    		$('#dictionaryManagement-locoNo-insert-recid').unbind("blur").blur(function(){
    			//验证
    			if($("#dictionaryManagement-locoNo-insert-recid").attr("option")!="update")
    			validatedLocoNo(true);
    		});
    		
    		
    		//修改
    		$('.dmanagement_update').unbind("click").click(function(){
    			if(tabTitle=="depot"){
    				
    				//是否选 中一行
    				$("#dictionaryManagement-tabTitle").text("修改段");
    				var checkeds =dictionaryManagementGrid.selectItem();
    				var data="";
    				if(checkeds.length >1||checkeds.length==0){
    					RTU.invoke("header.notice.show", "请选择一行数据。。");
    					return false;
    				}else{
    					$("#dictionaryManagement-insert-recid").attr("option","update");
    					data = $(checkeds[0]).data("itemData");
    				}
    				
    				$("#dictionaryManagement-dg").addClass("dictionaryManagement-dg");
    				$("#dictionaryManagement-insert").css("display","block");
    				setTabLeftTopPx(tabTitle);
    				//回显数据
    				setDepotData(data);
    			}else if(tabTitle=="locoNo"){
    				
    				//是否选中一行
    				$("#dictionaryManagement-locoNo-tabTitle").text("修改机车型号");
    				var checkeds =dictionaryManagementLocoNoGrid.selectItem();
    				var data="";
    				if(checkeds.length >1||checkeds.length==0){
    					RTU.invoke("header.notice.show", "请选择一行数据。。");
    					return false;
    				}else{
    					$("#dictionaryManagement-locoNo-insert-recid").attr("option","update");
    					data = $(checkeds[0]).data("itemData");
    				}
    				setTabLeftTopPx(tabTitle);
    				$("#dictionaryManagement-dg").addClass("dictionaryManagement-dg");
    				$("#dictionaryManagement-locoNo-insert").css("display","block");
    				//回显
    				setLocoNoData(data);
				}
    			return false;
    		});

    		//删除
			$('.dmanagement_delete').unbind("click").click(function(){
				if(tabTitle=="depot"){
					//是否选 中一行
					var checkeds =dictionaryManagementGrid.selectItem();
					var data="";
					if(checkeds.length == 0){
						RTU.invoke("header.notice.show", "请选择一行数据。。");
						return false;
					}else{
						//提示
						RTU.invoke("header.roleAlarmMsg.show","确定删除吗？-");
						$("#roleAlarmSureBtn").click(function () {
							//也可删除多行
							for(var i=0,j=checkeds.length;i<j;i++){
								data = $(checkeds[i]).data("itemData");
								if(data)
									deleteDepot(data);
							}
						});
					}
				}else if(tabTitle=="locoNo"){
					//是否选 中一行
					var checkeds =dictionaryManagementLocoNoGrid.selectItem();
					var data="";
					if(checkeds.length == 0){
						RTU.invoke("header.notice.show", "请选择一行数据。。");
						return false;
					}else{
						//提示
						RTU.invoke("header.roleAlarmMsg.show","确定删除吗？-");
						$("#roleAlarmSureBtn").click(function () {
							//也可删除多行
							for(var i=0,j=checkeds.length;i<j;i++){
								data = $(checkeds[i]).data("itemData");
								if(data)
									deleteLocoNo(data);
							}
						});
					}
				}
				return false;
			});
			
			//保存数据
			$('.dmanagement_save').unbind("click").click(function(){
				if(tabTitle=="depot"){
					
					var data =getInsertData();
					
					if(data.option=="add"){
						var f =validated(false);
						if(f){
							insertDepot(data);
						}
					}else if(data.option=="update"){
						updateDepot(data);
					}
				}else if(tabTitle=="locoNo"){
					
					var data = getLocoInsertData();
					if(data.option=="add"){
						var f =validatedLocoNo(false);
						if(f){
							insertLocoNo(data);
						}
					}else if(data.option=="update"){
						updateLocoNoData(data);
					}
					
				}
				return false;
			});

			//返回
			$('.dmanagement_exit').unbind("click").click(function(){
				//关闭背景
				$("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
				
				if(tabTitle=="depot"){
					$("#dictionaryManagement-insert").css("display","none");
					clearData();
				}else if(tabTitle=="locoNo"){
					$("#dictionaryManagement-locoNo-insert").css("display","none");
					clearLocoNoData();
				}
				return false;
			});
    		
    		//联动查询段
    		$("#dictionaryManagement-bureauSelect").unbind("change").change(function(){
    			var bname=$("#dictionaryManagement-bureauSelect option:selected").text();
    			var depotData =searchDepot(bname);
    			setDepot(depotData);
    		});
    		
    		
    	};
    });
    
    function setLocoNoShortName(){
    	var url="../traintype/searchByLocoTypeAndLocoNo?shortName=&locoNo=";//获取所有机车简称
    	parses=function parse(data) {
	           //从url地址返回的json数据  要重写parse方法  --处理JSON格式的数据都要自己重写parse方法
		             data = eval("(" + data + ")");//把返回的json 格式数据转换成object 对象
		             var rows = [];
		          	 for (var i = 0; i < data.data.length; i++) {
		                 rows[rows.length] = {
	                         data:data.data[i],//代表下面方法中的data 对象
	                         value:data.data[i].locoTypeName,//与查询匹配有关  当匹配后会减少不匹配的内容
	                         result:data.data[i].locoTypeName //返回的结果显示内容   
	                     }; 
		          	 }
	            	 return rows;
			    };
        $("#dictionaryManagement-select-locoNoShortName").autocomplete(url,{
        	minChars: 0, //表示在自动完成激活之前填入的最小字符
            max: 100, //表示列表里的条目数
            autoFill: false, //表示自动填充
            mustMatch: false, //表示必须匹配条目,文本框里输入的内容,必须是data参数里的数据,如果不匹配,文本框就被清空
            matchContains: true, //表示包含匹配,相当于模糊匹配
            width: 150,
            scrollHeight: 100, //表示列表显示高度,默认高度为180
//		    dataType: "jsonp", //  这个属性有点奇怪  当前是在jsp中引用的这个插件不需要写     如果是在js中引用这个插件那就要写
         	parse:parses,
	         formatItem: function(data, i, max) {//格式化列表中的条目 data:条目对象,i:当前条目数,max:总条目数
	        	 return data.locoTypeName;
	        },
	        formatMatch: function(data, i, max) {//配合formatItem使用，作用在于，由于使用了formatItem，所以条目中的内容有所改变，而我们要匹配的是原始的数据，所以用formatMatch做一个调整，使之匹配原始数据
	        	return data.locoTypeName;
	        },
	        formatResult: function(data,i) {//定义最终返回的数据，比如我们还是要返回原始数据，而不是formatItem过的数据
				//最终返回的数据是显示在文本框中的
	        	return data.locoTypeName;
	        } 
        	}).result(//如果要在选 中的那一行添加一个属性那就在如下方法中写就OK 
        	function(event,data,formatted){
        		$("#dictionaryManagement-select-locoNoShortName").val(data.locoTypeName);
        	});
    }
    
    //设置弹出框位置
    function setTabLeftTopPx(tabTitle){
    	var Resolution=getResolution();
    	var width=Resolution.Twidth-140;
    	var height=Resolution.Theight-175;
    	var $box='';
    	if(tabTitle=="depot"){
    		$box = $('.dictionaryManagement-insert');
    	}else if(tabTitle=="locoNo"){
    		$box = $('.dictionaryManagement-locoNo-insert');
    	}
		    $box.css({
		        left: (width - $box.width()) / 2 + "px",
		        top: (height - $box.height() ) / 2 + "px",
		    });
    }
    
    //验证  段编号
    function validated(val){
    	var dId =$("#dictionaryManagement-insert-recid").val();
    	 var falg = false;
    	 if(dId&&dId.trim()!=""){
    		 if(!isNaN(dId)){
    			 $.ajax({
    				 url:"../depot/findById?dId="+dId,
    				 type: "get",
    				 async: val,
    				 success: function (data) {
    					 var data = $.parseJSON(data);
    					 if(data.data){
    						 //$("#dictionaryManagement-prompting-Title").text("编号已存在");
    						 RTU.invoke("header.alarmMsg.show","编号已存在-");
    						 falg=false;
    					 }else{
    						 $("#dictionaryManagement-prompting-Title").text("");
    						 falg=true;
    					 }
    				 }
    			 });
    		 }else{
    			// $("#dictionaryManagement-prompting-Title").text("编号必须为数字!!!");
    			 RTU.invoke("header.alarmMsg.show","编号必须为数字-");
    		 }
    	 }else{
    		 $("#dictionaryManagement-prompting-Title").text("");
    	 }
    	return falg;
    }
    
    //验证  机车编号
    function validatedLocoNo(val){
    	var locoId =$("#dictionaryManagement-locoNo-insert-recid").val();
    	 var falg = false;
    	 if(locoId&&locoId.trim()!=""){
    		 if(!isNaN(locoId)){
    			 $.ajax({
    				 url:"../traintype/searchTrainType?id="+locoId+"&shortName=",
    				 type: "get",
    				 async: val,
    				 success: function (data) {
    					 var data = $.parseJSON(data);
    					 if(data.data.length>0){
    						 //$("#dictionaryManagement-prompting-Title").text("编号已存在");
    						 RTU.invoke("header.alarmMsg.show","编号已存在-");
    						 falg=false;
    					 }else{
    						// $("#dictionaryManagement-prompting-Title").text("");
    						 falg=true;
    					 }
    				 }
    			 });
    		 }else{
    			// $("#dictionaryManagement-prompting-Title").text("编号必须为数字!!!");
    			 RTU.invoke("header.alarmMsg.show","编号必须为数字-");
    		 }
    	 }else{
    		// $("#dictionaryManagement-prompting-Title").text("");
    	 }
    	return falg;
    }
    
    
    //清空数据  机车
    function clearLocoNoData(falg){
    	$("#dictionaryManagement-locoNo-insert-recid").attr("option","");
    	$("#dictionaryManagement-locoNo-insert-recid").val("");
    	$("#dictionaryManagement-locoNo-insert-name").val("");
		$("#dictionaryManagement-locoNo-insert-shortName").val("");
		$("#dictionaryManagement-locoNo-insert-spell").val("");
		$("#dictionaryManagement-locoNo-insert-alias").val("");
		$("#dictionaryManagement-locoNo-insert-kmlightrepair").val("");
		$("#dictionaryManagement-locoNo-insert-powerquotiety").val("");
		$("#dictionaryManagement-locoNo-insert-designSpeed").val("");
		$("#dictionaryManagement-locoNo-insert-typeFlag option:selected").removeAttr("selected");
		$("#dictionaryManagement-locoNo-insert-recid").removeAttr("readonly");
		document.getElementById("dictionaryManagement-locoNo-insert-recid").style.removeProperty('border');
		if(falg)
		$("#dictionaryManagement-select-locoNoShortName").val("");
    }
    //清空数据  段
    function clearData(){
    	$("#dictionaryManagement-insert-recid").val("");
    	$("#dictionaryManagement-insert-name").val("");
		$("#dictionaryManagement-insert-shortName").val("");
		$("#dictionaryManagement-insert-bname option:selected").removeAttr("selected");
		$("#dictionaryManagement-insert-attr option:selected").removeAttr("selected");
		$("#dictionaryManagement-insert-beginTime").val("");
		$("#dictionaryManagement-insert-endTime").val("");
		$("#dictionaryManagement-insert-recid").removeAttr("readonly");
		document.getElementById("dictionaryManagement-insert-recid").style.removeProperty('border');
		$("#dictionaryManagement-prompting-Title").text("");
    }
    
    //修改时回显表格数据  机车
    function setLocoNoData(data){
    	$("#dictionaryManagement-locoNo-insert-recid").val(data.tTypeId).attr("readonly","readonly").css("border","0px");
    	$("#dictionaryManagement-locoNo-insert-name").val(data.tTypeName);
		$("#dictionaryManagement-locoNo-insert-shortName").val(data.shortname);
		$("#dictionaryManagement-locoNo-insert-spell").val(data.spell);
		$("#dictionaryManagement-locoNo-insert-alias").val(data.alias);
		$("#dictionaryManagement-locoNo-insert-kmlightrepair").val(data.kmlightrepair);
		$("#dictionaryManagement-locoNo-insert-powerquotiety").val(data.powerquotiety);
		$("#dictionaryManagement-locoNo-insert-designSpeed").val(data.designSpeed);
		$("#dictionaryManagement-locoNo-insert-typeFlag option[name='typeFlag']").each(function(){
            if($(this).val()==data.typeFlag){
               $(this).attr("selected","selected");
            }
        });
    }
    
    //修改时回显表格数据  段
    function setDepotData(data){
    	$("#dictionaryManagement-insert-recid").val(data.dId).attr("readonly","readonly").css("border","0px");
    	$("#dictionaryManagement-insert-name").val(data.dName);
		$("#dictionaryManagement-insert-shortName").val(data.shortname);
		$("#dictionaryManagement-insert-bname option[name='insertName']").each(function(){
            if($(this).text()==data.ownBureau){
               $(this).attr("selected","selected");
            }
        });
		
		$("#dictionaryManagement-insert-attr option[name='attrName']").each(function(){
            if($(this).val()==data.attribute){
               $(this).attr("selected","selected");
            }
        });
		$("#dictionaryManagement-insert-beginTime").val(data.bDate);
		$("#dictionaryManagement-insert-endTime").val(data.eDate);
    	
    }
    
    
    //获取选中数据去查询   段
    function getSelectData(){
    	
    	var bid=$("#dictionaryManagement-bureauSelect option:selected").attr("id");
    	var did=$("#dictionaryManagement-depotSelect option:selected").attr("id");
    	var data={
    			bid:bid==0?"":bid,
    			did:did==0?"":did
    	};
    	return data;
    }
    
    //删除机车
    function deleteLocoNo(data){
    	var url="traintype/deleteObj?tTypeId="+data.tTypeId;
		 var param = {
               url: url,
               cache: false,
               asnyc: true,
               datatype: "jsonp",
               success: function (data) {
            	   RTU.invoke("header.notice.show", "删除成功。。");
            	   RTU.invoke("header.msg.hidden");
            	   //刷新列表
            	   RTU.invoke("app.dictionaryManagement.query.locoNoShowData",$("#dictionaryManagement-select-locoNoShortName").val());//加载机车数据
               },
               error: function () {
                  RTU.invoke("header.notice.show", "删除失败。。");
            	   RTU.invoke("header.msg.hidden");
               }
             };
            RTU.invoke("core.router.get", param);
    }
    
    //删除段
    function deleteDepot(data){
    	 var url="depot/deleteDepot?dId="+data.dId;
		 var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "jsonp",
                success: function (data) {
             	   RTU.invoke("header.notice.show", "删除成功。。");
             	   RTU.invoke("header.msg.hidden");
             	   //刷新列表
             	   RTU.invoke("app.dictionaryManagement.query.depotShowData",getSelectData());//加载数据
                },
                error: function () {
                   RTU.invoke("header.notice.show", "删除失败。。");
             	   RTU.invoke("header.msg.hidden");
                }
              };
             RTU.invoke("core.router.get", param);
    }
    
  //获取填入表格的数据   机车型号
    function getLocoInsertData(){
    	var option=$("#dictionaryManagement-locoNo-insert-recid").attr("option");
    	var id =$("#dictionaryManagement-locoNo-insert-recid").val();
    	var name =$("#dictionaryManagement-locoNo-insert-name").val();
		var shortName =$("#dictionaryManagement-locoNo-insert-shortName").val();
		var spell = $("#dictionaryManagement-locoNo-insert-spell").val();
		var alias = $("#dictionaryManagement-locoNo-insert-alias").val();
		var kmlightrepair=$("#dictionaryManagement-locoNo-insert-kmlightrepair").val();
		var powerquotiety=$("#dictionaryManagement-locoNo-insert-powerquotiety").val();
		var designSpeed=$("#dictionaryManagement-locoNo-insert-designSpeed").val();
		var typeFlag=$("#dictionaryManagement-locoNo-insert-typeFlag option:selected").val();
		
		
		//判断是否为空
		if(id==""){
			RTU.invoke("header.alarmMsg.show","请输入机车编号-");
			return false;
		}
		else if(name==""){
			RTU.invoke("header.alarmMsg.show","请输入机车名-");
			return false;
		}
		else if(shortName==""){
			RTU.invoke("header.alarmMsg.show","请输入机车简称-");
			return false;
		}
		
		var data={
				id:id,
				name:name,
				shortName:shortName,
				spell:spell,
				alias:alias,
				kmlightrepair:kmlightrepair,
				powerquotiety:powerquotiety,
				designSpeed:designSpeed,
				typeFlag:typeFlag,
				option:option
		};
		return data;
    }
    
    //获取填入表格的数据   段
    function getInsertData(){
    	var option=$("#dictionaryManagement-insert-recid").attr("option");
    	var dId =$("#dictionaryManagement-insert-recid").val();
    	var name =$("#dictionaryManagement-insert-name").val();
		var shortName =$("#dictionaryManagement-insert-shortName").val();
		var bId =$("#dictionaryManagement-insert-bname option:selected").attr("id");
		var attr=$("#dictionaryManagement-insert-attr option:selected").val();
		var bDate =$("#dictionaryManagement-insert-beginTime").val();
		var eDate =$("#dictionaryManagement-insert-endTime").val();
		
		//判断是否为空
		if(dId==""){
			RTU.invoke("header.alarmMsg.show","请输入段编号-");
			return false;
		}
		else if(name==""){
			RTU.invoke("header.alarmMsg.show","请输入段名-");
			return false;
		}
		else if(shortName==""){
			RTU.invoke("header.alarmMsg.show","请输入段简称-");
			return false;
		}
		var data={
				dId:dId,
				name:name,
				shortName:shortName,
				bId:bId,
				attr:attr,
				bDate:bDate,
				eDate:eDate,
				option:option
		};
		return data;
    }
    
  //添加 机车
    function insertLocoNo(data){
    	var url="traintype/saveTrainType?tTypeId="+data.id+"&tTypeName="+data.name+"&shortname="+data.shortName
    	+"&spell="+data.spell+"&alias="+data.alias+"&kmlightrepair="+data.kmlightrepair+"&powerquotiety="+data.powerquotiety
    	+"&typeFlag="+data.typeFlag+"&designSpeed="+data.designSpeed;
		 var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "jsonp",
                success: function (data) {
             	   RTU.invoke("header.notice.show", "添加成功。。");
             	   RTU.invoke("header.msg.hidden");
             	  $("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
             	  $("#dictionaryManagement-locoNo-insert").css("display","none");
             	   //刷新列表
             	 RTU.invoke("app.dictionaryManagement.query.locoNoShowData",$("#dictionaryManagement-select-locoNoShortName").val());//加载机车数据
                },
                error: function () {
                   RTU.invoke("header.notice.show", "添加失败。。");
             	   RTU.invoke("header.msg.hidden");
                }
              };
             RTU.invoke("core.router.get", param);
    }
    
    
    //添加段
    function insertDepot(data){
    	var url="depot/insertDepot?dId="+data.dId+"&dName="+data.name+"&shortName="+data.shortName+"&attr="+data.attr+
    	"&bId="+data.bId+"&bDate="+data.bDate+"&eDate="+data.eDate;
		 var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "jsonp",
                success: function (data) {
             	   RTU.invoke("header.notice.show", "添加成功。。");
             	   RTU.invoke("header.msg.hidden");
             	  $("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
             	  $("#dictionaryManagement-insert").css("display","none");
             	   //刷新列表
             	  RTU.invoke("app.dictionaryManagement.query.depotShowData",getSelectData());//加载数据
                },
                error: function () {
                   RTU.invoke("header.notice.show", "添加失败。。");
             	   RTU.invoke("header.msg.hidden");
                }
              };
             RTU.invoke("core.router.get", param);
    }
    
    //修改机车
    function updateLocoNoData(data){
    	var url="traintype/updateTrainType?tTypeId="+data.id+"&tTypeName="+data.name+"&shortname="+data.shortName
    	+"&spell="+data.spell+"&alias="+data.alias+"&kmlightrepair="+data.kmlightrepair+"&powerquotiety="+data.powerquotiety
    	+"&typeFlag="+data.typeFlag+"&designSpeed="+data.designSpeed;
		 var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "jsonp",
                success: function (data) {
             	   RTU.invoke("header.notice.show", "修改成功。。");
             	   RTU.invoke("header.msg.hidden");
             	  $("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
             	  $("#dictionaryManagement-locoNo-insert").css("display","none");
             	   //刷新列表
             	 RTU.invoke("app.dictionaryManagement.query.locoNoShowData",$("#dictionaryManagement-select-locoNoShortName").val());//加载机车数据
                },
                error: function () {
                   RTU.invoke("header.notice.show", "修改失败。。");
             	   RTU.invoke("header.msg.hidden");
                }
              };
             RTU.invoke("core.router.get", param);
    }
    
    //修改段
    function updateDepot(data){
    	var url="depot/updateDepot?dId="+data.dId+"&dName="+data.name+"&shortName="+data.shortName+"&attr="+data.attr+
    	"&bId="+data.bId+"&bDate="+data.bDate+"&eDate="+data.eDate;
		 var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "jsonp",
                success: function (data) {
             	   RTU.invoke("header.notice.show", "修改成功。。");
             	   RTU.invoke("header.msg.hidden");
             	  $("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
             	  $("#dictionaryManagement-insert").css("display","none");
             	   //刷新列表
             	  RTU.invoke("app.dictionaryManagement.query.depotShowData",getSelectData());//加载数据
                },
                error: function () {
                   RTU.invoke("header.notice.show", "修改失败。。");
             	   RTU.invoke("header.msg.hidden");
                }
              };
             RTU.invoke("core.router.get", param);
    }
    
    //设置段
    function setDepot(depotData){
    	
    	$(".dictionaryManagement-depotSelect").empty();
		
		for(var i in depotData){
			$opt =$("<option id='"+depotData[i].dId+"' value='"+depotData[i].dId+"'>"+depotData[i].dName+"</option>");
			$(".dictionaryManagement-depotSelect").append($opt);
        }
		$opt =$("<option id='0' value='0'>全部</option>");
		$(".dictionaryManagement-depotSelect").prepend($opt);
    }
    
    //设置局
    RTU.register("app.dictionaryManagement.bname.initTopBtn",function(){
    	return function(){
    		var data =getfindByShortname();
    		$(".dictionaryManagement-bureauSelect").empty();
    		$(".dictionaryManagement-insert-bname").empty();
    		$(data).each(function(i){
				$opt =$("<option name='bname' id='"+data[i].id+"' b_id='' value='"+data[i].id+"'>"+data[i].text+"</option>");
				$insert =$("<option name='insertName' id='"+data[i].id+"' b_id='' value='"+data[i].id+"'>"+data[i].text+"</option>");
	 			$(".dictionaryManagement-bureauSelect").append($opt);
	 			$(".dictionaryManagement-insert-bname").append($insert);
			});
    	};
    });
    
    //请求段列表数据
    RTU.register("app.dictionaryManagement.query.depotShowData",function(){
		return function(data){
			RTU.invoke("header.msg.hidden");
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-145;	
			Theight=Resolution.Theight-160;	
			var url="../depot/searchDepot?bId=&dId=";
			if(data){
				url="../depot/searchDepot?bId="+data.bid+"&dId="+data.did;
			}
			 dictionaryManagementGrid = new RTGrid({
				url:url,
	            containDivId: "dictionaryManagement-DuanbodyDiv-body-grid",
	            tableWidth: Twitdh,
	            tableHeight: Theight,
	            isSort: true, //是否排序
	            hasCheckBox: true,
	            showTrNum: true,
	            isShowPagerControl: false,
	            isShowRefreshControl:false,
                trRightClick:function(returnData){
                	
                },
                clickTrEvent: function (t) {   //点击行
                },
	            loadPageCp: function (t) {
	            	
	                t.cDiv.css("left", "200px");
	                t.cDiv.css("top", "290px");
                    if (t.param.datas.length == 0) {
                   	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                        return;
                    }
	            },
	            replaceTd: [{index: 4, fn: function (data,j,ctd,itemData) {
	    				if(itemData.attribute=="1"){
	    					return "机务段";
	    					
	    				}else if(itemData.attribute=="0"){
	    					return "电务段";
	    				}else{
	    					return itemData.attribute;
	    				}
					}
    			}
    			],
	            colNames: ["编码","名称","简称","所属局","属性","生效时间","失效时间"],
	            colModel: [{ name: "dId",isSort: true },
	                       { name: "dName", isSort: true },
	                       { name: "shortname",isSort: true },
	                       { name: "ownBureau", isSort: true },
	                       { name: "attribute",isSort: true }, 
	                       { name: "bDate",isSort: true},
	                       { name: "eDate",isSort: true}]
	        });
		};
	});
    
    //请求机车列车数据
    RTU.register("app.dictionaryManagement.query.locoNoShowData",function(){
		return function(data){
			RTU.invoke("header.msg.hidden");
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-145.5;	
			Theight=Resolution.Theight-160;	
			var url="../traintype/searchTrainType?id=";
			if(data){
				url="../traintype/searchTrainType?id=&shortName="+data;
			}
			 dictionaryManagementLocoNoGrid = new RTGrid({
				url:url,
	            containDivId: "dictionaryManagement-locoNoBodyDiv-body-grid",
	            tableWidth: Twitdh,
	            tableHeight: Theight,
	            isSort: true, //是否排序
	            hasCheckBox: true,
	            showTrNum: true,
	            isShowPagerControl: false,
	            isShowRefreshControl:false,
                trRightClick:function(returnData){
                	
                },
                clickTrEvent: function (t) {   //点击行
                },
	            loadPageCp: function (t) {
	            	
	                t.cDiv.css("left", "200px");
	                t.cDiv.css("top", "290px");
                    if (t.param.datas.length == 0) {
                   	 RTU.invoke("header.alarmMsg.show", "没有数据！-1-1");
                        return;
                    }
	            },
	            replaceTd: [{index: 7, fn: function (data,j,ctd,itemData) {
	    				if(itemData.typeFlag=="0"){
	    					return "内燃";
	    				}else if(itemData.typeFlag=="1"){
	    					return "电力";
	    				}else if(itemData.typeFlag=="2"){
	    					return "动车组";
	    				}else if(itemData.typeFlag=="3"){
	    					return "其它";
	    				}else{
	    					return itemData.typeFlag;
	    				}
					}
    			}
    			],
	            colNames: ["编码","车型名称","简称","拼音码","别名","小辅修公里","功率系数","机车类别","机车设计时速"],
	            colModel: [{ name: "tTypeId",isSort: true },
	                       { name: "tTypeName", isSort: true },
	                       { name: "shortname",isSort: true },
	                       { name: "spell", isSort: true },
	                       { name: "alias",isSort: true }, 
	                       { name: "kmlightrepair",isSort: true},
	                       { name: "powerquotiety",isSort: true},
	                       { name: "typeFlag",isSort: true},
	                       { name: "designSpeed",isSort: true}
	                       ]
	        });
		};
	});

  //根据局来查找段
	  function searchDepot(bName){
		  var searchData=null;
		  $.ajax({
	          url: "../depot/searchDepotByBureau?bureau="+bName,
	          type: "get",
	          async: false,
	          success: function (data) {
	              var data = $.parseJSON(data);
	              if (data.data) {
	            	  if(data.data){
	            		  searchData = jQuery.extend(true, {}, data.data);
	            	  }
	              };
	          }
	      });
		 
		  return searchData;
	  }
    
    //查找所有局
    function getfindByShortname(){
 	   var searchData=null;
			  $.ajax({
		          url: "../bureau/findByShortname?bname=",
		          type: "get",
		          async: false,
		          success: function (data) {
		              var data = $.parseJSON(data);
		              if (data.data) {
		            	  if(data.data){
		            		  searchData =data.data;
		            	  }
		              };
		          }
		      });
			  return searchData;
    }
    
    RTU.register("app.dictionaryManagement.query.init", function () {
        var data = RTU.invoke("app.setting.data", "dictionaryManagement");
        if (data && data.isActive) {
            RTU.invoke("app.dictionaryManagement.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.dictionaryManagement.query.deactivate", function () {
        return function () {
            if (popuwnd_onlleft) {
                popuwnd_onlleft.close();
            }
            $("#dictionaryManagement-dg").removeClass("dictionaryManagement-dg");
			$("#dictionaryManagement-insert").css("display","none");
			$("#dictionaryManagement-locoNo-insert").css("display","none");
			clearData();
			clearLocoNoData(true);
        };
    });
    
});
