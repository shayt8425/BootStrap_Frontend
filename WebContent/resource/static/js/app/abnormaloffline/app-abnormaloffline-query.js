RTU.DEFINE(function (require, exports) {
/**
 * 模块名：查询统计-异常掉线查询-query
 * name： abnormaloffline
 * date:2016-04-29
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("../common/common.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
        
    var $html;
	var popuwnd;
	var data;
	var abofflineGrid;
    	
	RTU.register("app.abnormaloffline.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/abnormaloffline/app-abnormaloffline-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				RTU.invoke("app.abnormaloffline.query.create");
				$(".abofflineSubmit").unbind("click").click(function(){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
						var data=checkInputData();
						if(data!=false){
							RTU.invoke("app.abnormaloffline.query.showData",data);
							
						}
						else 
							RTU.invoke("header.msg.hidden");
					},10);
					
				}); 
				$(".abofflineexp").unbind("click").click(function(){
					//RTU.invoke("header.msg.show", "加载中,请稍后!!!");
						var data=checkInputData();
						if(data!=false){
							RTU.invoke("app.abnormaloffline.query.exp",data);							
						};										
				}); 
				
				$(".rightFileDiv .abofflineReset").unbind("click").click(function(){
					$("#aboffline_loco").val("");
					$("#aboffline_queryTab").find("input,select").val("");
					$(".abofflineSubmit").click();	
				}); 
				
				$(".rightFileDiv select").unbind("change").bind("change",function(){
					$(".abofflineSubmit").click();
				}); 				
	            //查询全部
	            $(".rightFileDiv .filetransferShowAllBut").unbind("click").bind("click",function () {
	            	$("#aboffline_loco").val("");
	            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					window.setTimeout(function(){
		            	RTU.invoke("app.abnormaloffline.query.showData");
					},10);
	            	
	            });
			}
		});
		return function() {
			return true;
		};
	});

	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
	
	//获得查询参数
	var checkInputData=function(){
		var data={};
		/*data.day=$("#offlineDaySel").val();*/
		data.day=$("#offlineDayInput").val();
		if(isNaN(data.day)){
			RTU.invoke("header.notice.show","请输入数字");
			$("#offlineDayInput").focus();
			return false;
		}
		/*data.locoName=$("#aboffline_checi").val().toUpperCase() ;*/
		data.dwd=$("#aboffline_dwd").val();
		data.cj=$("#aboffline_cj").val();
		data.speed=$("#aboffline_speed").val();
		data.jkstate=$("#aboffline_jkstate").val();
		data.locostatus=$("#aboffline_locostatus").val();
		data.loconame=$.trim($("#aboffline_loco").val()).toUpperCase();
		return data;		
	};
	RTU.register("app.abnormaloffline.query.activate", function() { //使得popuwnd对象活动
		return function() {
			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			/*Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;*/
			Twitdh=Resolution.Twidth;
			Theight=Resolution.Theight-60;
			if (!popuwnd) {
				popuwnd = new PopuWnd({
					title : data.alias,
					html : $html,
					width : Twitdh,
					height : Theight,
					left : 0,
					top : 60,
					shadow : true,
					removable:false,  //设置弹出窗口是否可拖动
					deletable:true	  //设置是否显示弹出窗口的关闭按钮
				});
				popuwnd.remove = popuwnd.close;
				popuwnd.close = popuwnd.hidden;
				popuwnd.init();
			} else {
				popuwnd.init();
				window.setTimeout(function(){
					$("#aboffline_queryTab input,select").val("");
					$(".abofflineSubmit").click();
				},100);
			}
			RTU.invoke("app.abnormaloffline.query.dataInit", "");
		};
	});
	RTU.register("app.abnormaloffline.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	
    //搜索框智能提示
    RTU.register("app.abnormaloffline.query.create", function () {
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
                    mustMatch:true,
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
                    return $('#aboffline_loco').val();
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
                        value: aa+"_"+data[i].locoAb,
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#aboffline_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            $('#aboffline_loco').result(function (event, autodata, formatted) {
            	/*if(formatted){
            		var arr=formatted.split("_");
            		if(arr.length>1){
            			$('#aboffline_loco').val(arr[0]);
            			$('#aboffline_loco').attr("locoAb",arr[1]);
            		}
            		else $('#aboffline_loco').val(formatted);
            	}*/
            });
        };
        return function () {
            setTimeout(function () {
                /*initCheciNameAuto1();*/
                $(".abofflineSubmit").click();
            }, 10);
        };
    });
    
	RTU.register("app.abnormaloffline.query.init", function() {
		data = RTU.invoke("app.setting.data", "abnormaloffline");
		if (data && data.isActive) {
			RTU.invoke("app.abnormaloffline.query.activate");  
		}		
		return function() {
			return true;
		};
	});
		
    //初始化按钮
    RTU.register("app.abnormaloffline.query.initButton", function () {
        return function () {};
    });
    
	RTU.register("app.abnormaloffline.query.exp",function(){
		var refreshFun=function(data){
    		if(window.confirm("确认要导出到excel吗?")){
	     		window.location.href = "../abnormaloffline/expofflinedata?speed="+data.speed+"&jkstatename="
	             +data.jkstate+"&locostatus="+data.locostatus+"&day="+data.day+"&loconame="
	            +data.loconame+"&deptdw="+data.dwd+"&cj="+data.cj;
	     	}
             };   	
    	return function(data){
    		refreshFun(data);
    		/*initClickFn();*/
    	};
	});    
          

	RTU.register("app.abnormaloffline.query.showData",function(){
		/*var initClickFn=function(){
			
		};*/
		var refreshFun=function(data){
			$("#aboffline-bodyDiv-body-grid").empty().removeClass("containGridDiv");
			var width=$("#aboffline-bodyDiv-body-grid").width();
			abofflineGrid = new RTGrid({
    			url:encodeURI("../abnormaloffline/findLocosByProperty?speed="+data.speed+"&jkstatename="
    			+data.jkstate+"&locostatus="+data.locostatus+"&day="+data.day+"&loconame="
    			+data.loconame+"&deptdw="+data.dwd+"&cj="+data.cj),
                containDivId: "aboffline-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#aboffline-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    			},
    			selectTrEvent:function(){
    				if(!$("#content-aboffline-rightClickDiv").hasClass("hidden"))
    					$("#content-aboffline-rightClickDiv").addClass("hidden");
    			},
    			replaceTd:[
    			            { index: 0, fn: function (data,j,ctd,itemData) {
    			            	$(ctd).attr("locoTypeid",itemData.locoTypeid).
    			            	attr("locoNo",itemData.locoNo).attr("locoAb",itemData.locoAb)
    			            	.attr("lkjType",itemData.lkjType).attr("kehuoName",itemData.kehuoName)
    			            	.attr("checiName",itemData.checiName).attr("tTypeShortname",itemData.tTypeShortName)
    			            	.attr("lkjTime",itemData.lkjTimeStr);
        	             		return data;
        			      	  }
        			        }
    			           ],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                    /*initClickFn();*/
                },
                trRightClick:function(returnData){
    				 var that=$(returnData.data.item).find("td[itemname='locoName']");
    				 var clientX=returnData.clientX;
    				 var clientY=returnData.clientY;
    				 var rightDiv=$("#content-aboffline-rightClickDiv");
    				 var width=$(rightDiv).width();
	   				 var height=$(rightDiv).height();
	   				 var width1 = document.documentElement.clientWidth  ;
	   		         var height1 = document.documentElement.clientHeight;
		   		      /*if((clientX+width)>width1){
						  $(rightDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(rightDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(rightDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(rightDiv).css({"top":(clientY-30)+"px"});
					  }*/
		   		      if((clientX+width)>width1){
						  $(rightDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(rightDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(rightDiv).css({"top":(clientY-30-height-$(that).height()*2)+"px"});
					  }else{
						  $(rightDiv).css({"top":(clientY-30-$(that).height()*2)+"px"});
					  }
	   				 $(rightDiv).removeClass("hidden");
	   				 $("tr td",$(".content-aboffline-rightClickDiv-tab")).unbind("click").click(function(){
	   					 var id=$(this).attr("id");
	   					 var tTypeShortname=$(that).attr("tTypeShortname");
	   					 var locoNo=$(that).attr("locoNo");
	   					 var locoAb=$(that).attr("locoAb");
	   					 var locoCheci=$(that).attr("checiName");
	   					 var locoTypeid=$(that).attr("locoTypeid");
	   					 var lkjType=$(that).attr("lkjType");
	   					 var kehuo=$(that).attr("kehuoName");
	   					 var lkjTime=$(that).attr("lkjTime");
	   					 if(id=="aboffline_menu1"){
	   						 /*var loco=tTypeShortname+"-"+locoNo;*/
	   						popuwnd.close();
	                         RTU.invoke("map.marker.findMarkersContainsNotExist", {
	                             pointId: $(that).html(),
	                             isSetCenter: true,
	                             stopTime: 5000,
	                             locoAb:locoAb,
	                             locoTypeid:locoTypeid,
	                             locoNo:locoNo,
	                             lkjType:lkjType,
	                             fnCallBack: function () {
	                             }
	                         });
	                         /*$("#app_lkjequipmenthistory_closeBtn").click();*/
	                         $(rightDiv).addClass("hidden");
	   					 }else if(id=="aboffline_menu2"){
	   						 var sendData={
	                                 "id": "11111",
	                                 "name": locoCheci + "(" +$(that).html()+ ")",
	                                  data: {
	                                      locoTypeid:locoTypeid,
	                                      locoNO:locoNo,
	                                      checiName:locoCheci,
	                                      locoTypeName:tTypeShortname,
	                                      locoAb:locoAb,
	                                      lkjType:lkjType
	                                  }
	                         };
	                          var arr=[];
	                          arr[0]=sendData;
	                          RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
	                          $(rightDiv).addClass("hidden");
	   					 }else if(id=="aboffline_menu3"){
                          var sendData={
                              locoTypeid:locoTypeid,
                              locoNo:locoNo,
                              locoAb:locoAb,
                              locoTypename:tTypeShortname,
                              kehuo:kehuo,
                              date:lkjTime
                          };
                          if(lkjType!=1)
	   						RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
                          else 
                          	RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
                          $(rightDiv).addClass("hidden");
	   					 }
	   				 });
	   				 $("body").unbind("click").bind("click",function(){
	   					$("#content-aboffline-rightClickDiv").addClass("hidden");
	   				 });
                },
                colNames: ["机车","支配段", "电务段", "车间","运用状态","车次","速度","监控状态","公里标(km)","线路","最后位置","最后上线时间"],
                colModel: [{ name: "locoName",width:width*0.1}, 
                           { name: "deptName",width:width*0.1},
                           { name: "deptDw",width:width*0.1}, 
                           { name: "cj",width:width*0.1}, 
                           {name:"locoStatus",width:width*0.05},
                           {name:"checiName",width:width*0.05},
                           { name: "speed",width:width*0.05}, 
                           { name: "jkstateName",width:width*0.1},
                           {name:"kiloSign",width:width*0.05},{name:"lName",width:width*0.05},
                           {name: "sName",width:width*0.1},{name:"lkjTimeStr",width:width*0.1}]
            });
    		$(".RTTable_Head tr td:first",$("#aboffline-bodyDiv-body-grid")).text("序号");
    		RTU.invoke("header.msg.hidden");
    		/*$(".RTTable-Body tr",$("#aboffline-bodyDiv-body-grid")).mousedown(function(e){
   			 if (3 == e.which) {}
    		});*/
    	};
    	
    	return function(data){
    		refreshFun(data);
    		/*initClickFn();*/
    	};
	});
});
