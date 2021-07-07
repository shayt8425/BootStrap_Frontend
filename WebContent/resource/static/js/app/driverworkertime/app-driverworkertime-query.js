RTU.DEFINE(function(require, exports) {
	/**
	 * 模块名：司机劳时统计
	 * name：app-driverworkertime
	 * date:2015-6-11
	 * version:1.0 
	 */
	require("popuwnd/js/popuwnd.js");
	require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/app-list.css");
    require("app/loading/list-loading.js");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
   // require("../realtimelocomotivequery/app-realtimelocomotivequery-query.js")
    require("../common/common.js")
    require("../../../css/app/locomotivequery/locospread-queryTe.css")
    
    var $html;
	var popuwnd;
	var data;
	RTU.register("app.driverworkertime.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/driverworkertime/app-driverworkertime-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				CurentTime();
				RTU.invoke("app.driverworkertime.query.create");
				
				$(".driverSubmit").unbind("click").click(function(){
					var data=checkInputData();
					if(data!=false){	
						RTU.invoke("header.msg.show", "加载中,请稍后!!!");
						RTU.invoke("app.driverworkertime.query.showData",data);						
					}
				});
				$(".driverSubmit").click();
			}
		});
		return function() {
			return true;
		};
	});
	
	RTU.register("app.driverworkertime.query.showData",function(){
		var refreshFun=function(data){
			
            RTU.invoke("core.router.get", {
            	url: "driverworker/getDriverworkdetail?"+"&driverid="+data.driverid+"&Firsttime="+data.Firsttime+"&Finishtime="+data.Finishtime,
                success: function (data) {
                    if (data.data.length!=0) {
                        RTU.invoke("app.driverworkertime.query.tree.init", data.data);                       
                    } else {
                    	$(".driverworktreediv").empty();
                    	RTU.invoke("header.msg.hidden");
                    	RTU.invoke("header.alarmMsg.show", "无满足查询条件的数据");
                    }                    	 
                },
            });
		};
    	
    	return function(data){
    		if (data.Firsttime==""){
        		RTU.invoke("header.alarmMsg.show","请输入开始时间");
    			return false;
    		}
    		if (data.Finishtime==""){
        		RTU.invoke("header.alarmMsg.show","请输入结束时间");
    			return false;
    		};
    		
    		refreshFun(data);
    	};
	});
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
	//获得查询参数
	var checkInputData=function(){
		var data={};
		data.Firsttime=$("#driveworkFirst_time").val();
		data.Finishtime=$("#driveworkFinish_time").val();
		data.driverid=$("#driverid").val();
		return data;
	};
	RTU.register("app.driverworkertime.query.activate", function() { //使得popuwnd对象活动
		return function() {
			RTU.invoke("header.msg.hidden");
			var width = $("body").width() - 640;
			var height = $("body").height() - 120;
			var Resolution=getResolution();
			Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;
			if (!popuwnd) {
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
			} else {
				popuwnd.init();
			}
		};
	});
	RTU.register("app.driverworkertime.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	    
	 RTU.register("app.driverworkertime.query.create", function () {
		    var inittrainStrAuto = function () {
		    	 DriverIdExParams = {
		                 keyword: function () {
		                     return $('#driverid').val();
		                 }
		             };
		    	 DriverIdStrParse = function (data) {  		    		
		            data = data.data;
		            var rows = [];
		            for (var i = 0; i < data.length; i++) {
		            	var text = replaceSpace(data[i]);		            
		                rows[rows.length] = {
		                    data: text,
		                    value: text,
		                    result: text
		                };	                
		            }
		            return rows;
		        };
		        //绑定插件
		        RTU.autocompleteBuilder($("#driverid"), "driverworker/getDriverId", DriverIdExParams, DriverIdStrParse);
		        try {
		            if ($('#driverid').result)
		                $('#').result(function (event, autodata, formatted) {
		                	$('#driverid').val(formatted); });
		        }
		        catch (e) {
		        }  
		    }; 
		    var replaceSpace = function (text) {
	            if (text) {
	                var reg = /\s/g;
	                return text.replace(reg, "");
	            } else {
	                return "";
	            }
	        };
		    return function (data) {
		    	inittrainStrAuto();
		    };
		 
	 }); 

	 var CurentTime=function(){
		   var myDate = new Date();
		   var now = new Date();       
	       var year = now.getFullYear();       //年
	       var month = now.getMonth() + 1;     //月 0代表1月
	       var day = now.getDate();            //日
	       var clock = year + "-";     
	       if(month < 10)
	           clock += "0";       
	       clock += month + "-";       
	       if(day < 10)
	           clock += "0";           
	       clock += day;
	       $("#driveworkFinish_time").val(clock);
	       $("#driveworkFirst_time").val(clock);
/*	       $("#trainisFirst_time").val('2015-06-01');
	       $("#trainisFinish_time").val('2015-06-06');*/
	   }
	
	RTU.register("app.driverworkertime.query.init", function() {
		data = RTU.invoke("app.setting.data", "driverworkertime");
		if (data && data.isActive) {
			RTU.invoke("app.driverworkertime.query.activate");  
		}		
		return function() {
			return true;
		};
	});
	
	
	
	RTU.register("app.driverworkertime.query.tree.init", function () {
        ////组装树形子节点 完成
        var childrenItem = function (data) {
        	var depotname=$("#drivework_depotname").width()+4;       
        	var drivername=$("#drivework_drivername").width()+3;
        	var dtime=$("#drivework_dtime").width()+3; 
        	var ftime=$("#drivework_ftime").width()+3; 
        	var worktime=$("#drivework_worktime").width()-13; 
            this.$item1 = $("<div class='driverworktabBottom'> " + $(".driverworktreedivHid .driverworktabBottom").html() + "</div>");
            this.$item1.find(".tabBottomTd").html(data[0]);  //data[0]   机务段名
            this.$item1.find(".tabBottomTd").css("width",depotname.toString()+"px");
            this.$item1.find(".tabBottomTdDriverid").html(data[1]);//司机ID
            this.$item1.find(".tabBottomTdDriverid").css("width",drivername.toString()+"px");
            this.$item1.find(".tabBottomTime1").html(data[2]);  //到岗时间
            this.$item1.find(".tabBottomTime1").css("width",dtime.toString()+"px");
            this.$item1.find(".tabBottomTdTim2").html(data[3]);  //到岗时间
            this.$item1.find(".tabBottomTdTim2").css("width",ftime.toString()+"px");
            this.$item1.find(".tabBottomTdTTime").html(data[4]);  //单次总时间
//            this.$item1.find(".tabBottomTdTTime").css("width",worktime.toString()+"px");
            this.$item1.find(".tabBottomTdTTime").css("width",worktime.toString()+"px");
            return this.$item1;
        };
        ////组装树形行父节点  完成
//        var fatherItem = function (data) {
//        	var depotname=$(".depotname").css("width");       
//        	var drivername=$(".drivername").css("width");
//        	var dtime=$(".dtime").css("width"); 
//        	var ftime=$(".ftime").css("width"); 
//        	var worktime=$(".worktime").css("width"); 
//            this.$item2 = $(".driverworktreedivHid .driverworktabTop");
//            this.$item2.find(".labelDriveID").html(data.driverid);
//            this.$item2.find(".labelDriveID").css("width",depotname.toString()+"px");
//            //this.$item2.find(".tabTopkong1").html("&nbsp");
//            this.$item2.find(".tabTopkong1").css("width",drivername);
////            this.$item2.find(".tabTopkong2").html("&nbsp");
////            this.$item2.find(".tabTopkong2").css("width",dtime);
////            this.$item2.find(".tabTopkong3").html("&nbsp");
////            this.$item2.find(".tabTopkong3").css("width",ftime);
//            this.$item2.find(".tabTopTime").html(data.worktime);    
//
//            return this.$item2;
//        };
        ////组装数据列表行
        var buildItemTr = function (data) {
        	var depotname=$("#drivework_depotname").width()+3;
        	var drivername=$("#drivework_drivername").width()+3;
        	var dtime=$("#drivework_dtime").width()+3;
        	var ftime=$("#drivework_ftime").width()+3;
        	var worktime=$("#drivework_worktime").width()-17;
            this.$item = $("<div>" + $(".driverworktreedivHid .driverworktabDiv").html() + "</div>");
            this.$item.find(".labelDriveID").html(data.driverid);
            this.$item.find(".tabTopDriveId").css("width",depotname.toString()+"px");
            this.$item.find(".tabTopTime").html(data.worktime);
            this.$item.find(".tabTopTime").css("width",worktime.toString()+"px");
            this.$item.find(".tabTopkong1").css("width",drivername.toString()+"px");
            this.$item.find(".tabTopkong2").css("width",dtime.toString()+"px");
            this.$item.find(".tabTopkong3").css("width",ftime.toString()+"px");
//            alert(this.$item.html());
            //this.$item.find(".driverworktabTop").append(new fatherItem(data));
            this.$item.find(".driverworktabBottom").remove();
            for (var i = 0; i < data.list.length; i++) {
                this.$item.append(new childrenItem(data.list[i]));
            }
//            alert(this.$item.html());
            return this.$item;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
            for (var i = 0; i < data.length; i++) {
                $(".driverworktreediv").append(new buildItemTr(data[i]));
            }
            RTU.invoke("app.query.loading", { object: $(".driverworktreediv"), isShow: false });
        };
        ////////树事件处理加载
        var initTreeHandle = function () {
            ///////树收缩和展开事件
            this.treeClick = function () {
                $(".driverwork-span-click").click(function () {
                    $(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn", $(this)).attr("src", "../static/img/app/zhankai.png") :
							$(".img-btn", $(this)).attr("src", "../static/img/app/shousuo.png");
                    if ($(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1) {
                        $(this).parent().parent().siblings().addClass("hidden");
                    }
                    else {
                        $(this).parent().parent().siblings().removeClass("hidden");
                    }
                });
            };

//            //树子点击，鼠标移动及点击效果
//            this.moveroverTr = function () {
//                var itemtr = $("#filetdownload1-main-divdownload .filedownload1-children-div tr");
//                itemtr.hover(function () {
//                    $(this).addClass("file_upload_moveTr");
//                }, function () {
//                    $(this).removeClass("file_upload_moveTr");
//                });
//                itemtr.click(function () {
//                    itemtr.removeClass("file_upload_clickTr");
//                    $(this).addClass("file_upload_clickTr");
//                });
//            };

            this.init = function () {
                ///////树收缩和展开事件
                this.treeClick();
                //选中单选按钮事件
              //  this.treeClickRadio();
              //  this.moveroverTr();
            };
            this.init();
        };

        return function (data) {
            ///////先清除上次append的html
            $(".driverworktreediv").empty();
            ///////建立树形Html
            buildTreeHtml(data);
            ///////树事件处理加载
            initTreeHandle();
            RTU.invoke("header.msg.hidden");
        };
    });
});
