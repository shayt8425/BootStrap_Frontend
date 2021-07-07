RTU.DEFINE(function(require, exports) {
/**
 * 模块名：机车运用履历
 * name：trainis-antecedents
 * date:2015-2-12
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
	var flag;
	

RTU.register("app.trainisantecedents.query.init", function() {
	RTU.invoke("core.router.load",{
		url:"../app/modules/trains-antecedents/app-trains-antecedents-query.html",
		success:function(html){
			$html = $(html);
			if(popuwnd){
				popuwnd.html($html);
			}
			CurentTime();
			RTU.invoke("app.trainisantecedents.query.create");
			RTU.invoke("app.locopretime.query.create");
			RTU.invoke("app.locoruninfo.query.create");
			$(".trainisantecedentsSubmit").unbind("click").click(function(){
				var data=checkInputData();
				if(data!=false){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					RTU.invoke("app.trainisantecedents.query.showData",data);
					RTU.invoke("header.msg.hidden");
				}
			});
			$(".trainisantecedentsSubmit").click();
			
			$("#locopretimeSubmit").unbind("click").click(function(){
				var data=checkLocopretimeInputData();
				if(data!=false){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					RTU.invoke("app.locopretime.query.showData",data);
				}
			});			
			
			$("#locoruninfoSubmit").unbind("click").click(function(){
				var data=checkLocoruninfoInputData();
				if(data!=false){
					RTU.invoke("header.msg.show", "加载中,请稍后!!!");
					RTU.invoke("app.locoruninfo.query.showData",data);
				}
			});		
			
			$("#tab-start-head").unbind("click").click(function(){
				 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-left");
				 $(" #tab-middle").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
	             $(" #tab-end-div").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
                 $(".locodetail").removeClass("hidden");
                 $(".locopretime").addClass("hidden");
                 $(".locoruninfo").addClass("hidden");
			});
			$("#tab-middle").unbind("click").click(function(){
				 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-left").addClass("border-top-click");
				 $(" #tab-start-head").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
	             $(" #tab-end-div").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
                 $(".locopretime").removeClass("hidden");
                 $(".locodetail").addClass("hidden");
                 $(".locoruninfo").addClass("hidden");
			});
			$("#tab-end-div").unbind("click").click(function(){
				 $(this).addClass("border-bottom-type").removeClass("tab-background").addClass("border-left").addClass("border-top-click");
				 $(" #tab-middle").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
	             $(" #tab-start-head").removeClass("border-bottom-type").addClass("tab-background").addClass("border-top-click");
				 $(".locoruninfo").removeClass("hidden");
                 $(".locopretime").addClass("hidden");
                 $(".locodetail").addClass("hidden");	                 
			});
		}
	});
	return function() {
		return true;
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
       $("#locopretimeFirst_time").val(clock);
       $("#locopretimeFinish_time").val(clock);
       $("#trainisFirst_time").val(clock);
       $("#trainisFinish_time").val(clock);
       $("#locoruninfoFirst_time").val(clock);
       $("#locoruninfoFinish_time").val(clock);       
   }
 
RTU.register("app.locopretime.query.showData",function(){
	var refreshFun=function(data){
		if (data.shortname=="")
			{flag=0} else
				{flag=1};
        RTU.invoke("core.router.get", {
        	url: "locopritime/getLocopritime?"+"&shortname="+data.shortname+"&loco="+data.loco+"&locoAB="+data.locoAB+"&Firsttime="+data.Firsttime+"&Finishtime="+data.Finishtime,            	
            success: function (data) {
                if (data.data) {  
                	if (flag==0){
                		RTU.invoke("app.locopretime.query.tree.init", data.data);                		
                	}else{
                		RTU.invoke("app.locopretime.query.tree1.init", data.data);                		
                	}
	                                    
                } else RTU.invoke("header.alarmMsg.show", "无满足查询条件的数据");
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

RTU.register("app.locoruninfo.query.showData",function(){
	var refreshFun=function(data){
		if (data.shortname=="")
			{flag=0} else
				{flag=1};
        RTU.invoke("core.router.get", {
        	url: "locoruninfo/getLocoruninfo?"+"&shortname="+data.shortname+"&loco="+data.loco+"&locoAB="+data.locoAB+"&Firsttime="+data.Firsttime+"&Finishtime="+data.Finishtime,            	
            success: function (data) {
                if (data.data) {  
                	if (flag==0){
                		RTU.invoke("app.locoruninfo.query.tree.init", data.data);                		
                	}else{
                		RTU.invoke("app.locoruninfo.query.tree1.init", data.data);                		
                	}
	                                    
                } else RTU.invoke("header.alarmMsg.show", "无满足查询条件的数据");
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

RTU.register("app.trainisantecedents.query.showData",function(){
	var refreshFun=function(data){
//    		var showData=[];
//    		if(data&&data.length>0){
//    			showData=data;
//    		}
		var Resolution=getResolution();
		Twitdh=Resolution.Twidth-145;
		Theight=Resolution.Theight-175;			
		trainislateGrid = new RTGrid({
			url:"../trainisantecedents/querytrainisantecedents?Fdate="+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="+data.loco+"&shortname="+data.shortname+"&locoAB="+data.locoAB,
//                datas: showData,
            containDivId: "trainisAntecedents-bodyDiv-body-grid",
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
            loadPageCp: function (t) {
                t.cDiv.css("left", "200px");
                t.cDiv.css("top", "200px");

            },
            colNames: ["车次", "起始车站", "终到车站",  "起始时间",  "终到时间",  "运行时间"],
            colModel: [{ name: "checiName", width: "80px", isSort: true }, { name: "fstation", width: "80px", isSort: true }, { name: "dstation", width: "80px", isSort: true }, { name: "ftime", width: "92.5px", isSort: true }, { name: "dtime", width: "92.5px", isSort: true }, { name: "pretime", width: "92.5px"}]
        });
		$(".RTTable_Head tr td:first",$(".trainistrainisAntecedents_div")).html("序号");
	};
	
	return function(data){
		if (data.loco==""){
    		RTU.invoke("header.alarmMsg.show","请输入机车型号，机车号");
			return false;
		}
		if (data.Firsttime==""){
    		RTU.invoke("header.alarmMsg.show","请输入开始时间");
			return false;
		}
		if (data.Finishtime==""){
    		RTU.invoke("header.alarmMsg.show","请输入结束时间");
    			return false;
    		};
    		
    		refreshFun(data);
    		
 /* 		var url="trainisantecedents/querytrainisantecedents?Fdate="+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="+data.loco+"&shortname="+data.shortname;
        var param={
                url: url,
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    refreshFun(data.data);
                },
                error: function () {
                }
              };
        RTU.invoke("core.router.get", param);
        */

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
	data.Firsttime=$("#trainisFirst_time").val();
	data.Finishtime=$("#trainisFinish_time").val();
	tempdata=$("#trainisAntecedents_loco").val();
	if (tempdata){
		var strs=[];
		strs=tempdata.split("-");
		var locotemp=strs[1];
		data.shortname=strs[0];	
		var lastStr=locotemp.charAt(locotemp.length-1);
		if ((lastStr!="B")&&(lastStr!="A")){
			data.loco=locotemp;
		}else{
			data.loco=locotemp.substring(4,0);
		}
		if (lastStr=="A"){data.locoAB="1"};
		if (lastStr=="B"){data.locoAB="2"};
		if ((lastStr!="B")&&(lastStr!="A")){data.locoAB="0"};
	}else{
		data.loco="";
		data.shortname="";
	}

	return data;		
};

var checkLocopretimeInputData=function(){
	var data={};
	data.Firsttime=$("#locopretimeFirst_time").val();
	data.Finishtime=$("#locopretimeFinish_time").val();
	tempdata=$("#locopretime_loco").val();
	if (tempdata){
		var strs=[];
		strs=tempdata.split("-");
		var locotemp=strs[1];
		data.shortname=strs[0];	
		var lastStr=locotemp.charAt(locotemp.length-1);
		if ((lastStr!="B")&&(lastStr!="A")){
			data.loco=locotemp;
		}else{
			data.loco=locotemp.substring(4,0);
		}
		if (lastStr=="A"){data.locoAB="1"};
		if (lastStr=="B"){data.locoAB="2"};
		if ((lastStr!="B")&&(lastStr!="A")){data.locoAB="0"};
	}else{
		data.loco="";
		data.shortname="";
		data.locoAB="";
	}

	return data;		
};

var checkLocoruninfoInputData=function(){
	var data={};
	data.Firsttime=$("#locoruninfoFirst_time").val();
	data.Finishtime=$("#locoruninfoFinish_time").val();
	tempdata=$("#locoruninfo_loco").val();
	if (tempdata){
		var strs=[];
		strs=tempdata.split("-");
		var locotemp=strs[1];
		data.shortname=strs[0];	
		var lastStr=locotemp.charAt(locotemp.length-1);
		if ((lastStr!="B")&&(lastStr!="A")){
			data.loco=locotemp;
		}else{
			data.loco=locotemp.substring(4,0);
		}
		if (lastStr=="A"){data.locoAB="1"};
		if (lastStr=="B"){data.locoAB="2"};
		if ((lastStr!="B")&&(lastStr!="A")){data.locoAB="0"};
	}else{
		data.loco="";
		data.shortname="";
		data.locoAB="";
	}

	return data;		
};

RTU.register("app.trainisantecedents.query.activate", function() { //使得popuwnd对象活动
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
//			RTU.invoke("app.trainisantecedents.query.create", $html);
	};
});
RTU.register("app.trainisantecedents.query.deactivate", function() { //隐藏
	return function() {
		if (popuwnd) {
			popuwnd.hidden();
		}
	};
});


//搜索框智能提示  里程统计
RTU.register("app.locoruninfo.query.create", function () {
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
                return $('#locoruninfo_loco').val();
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
        autocompleteBuilder1($("#locoruninfo_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
        $('#locoruninfo_loco').result(function (event, autodata, formatted) {
            if (!formatted) {
                $('#locoruninfo_loco').val(formatted);
            }
        });
    };
    return function () {
        setTimeout(function () {
            initCheciNameAuto1();
        }, 10);
    };
});


//搜索框智能提示
RTU.register("app.locopretime.query.create", function () {
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
                return $('#locopretime_loco').val();
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
        autocompleteBuilder1($("#locopretime_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
        $('#locopretime_loco').result(function (event, autodata, formatted) {
            if (!formatted) {
                $('#locopretime_loco').val(formatted);
            }
        });
    };
    return function () {
        setTimeout(function () {
            initCheciNameAuto1();
        }, 10);
    };
});
//运行履历搜索框智能提示   
RTU.register("app.trainisantecedents.query.create", function () {
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
                return $('#trainisAntecedents_loco').val();
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
        autocompleteBuilder1($("#trainisAntecedents_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
        $('#trainisAntecedents_loco').result(function (event, autodata, formatted) {
            if (!formatted) {
                $('#trainisAntecedents_loco').val(formatted);
            }
        });
    };
    return function () {
        setTimeout(function () {
            initCheciNameAuto1();
        }, 10);
    };
});

RTU.register("app.trainisantecedents.query.init", function() {
	data = RTU.invoke("app.setting.data", "trainisantecedents");
	if (data && data.isActive) {
		RTU.invoke("app.trainisantecedents.query.activate");  
	}		
	return function() {
		return true;
	};
});

RTU.register("app.locopretime.query.tree1.init", function () {
    var childrenItem = function (data) {
    	var depotname=$("#locopretimedepotname").width()+3;
    	var locotype=$("#locopretimelocotype").width()+3;
    	var loco=$("#locopretimeloco").width()+3;
    	var locoab=$("#locopretimelocoab").width()+3;
    	var locopretimepretime=$("#locopretimepretime").width()-17;
        this.$item1 = $("<div class='locopretimetabBottom'> " + $("#locopretimetreedivHid #locopretimetabBottom").html() + "</div>");
        this.$item1.find("#locopretimetabBottomdepot").html(data[0]);  //data[0]   机务段名
        this.$item1.find("#locopretimetabBottomdepot").css("width",depotname.toString()+"px");
        this.$item1.find("#locopretimetabBottomlocotype").html(data[1]);//机车型号
        this.$item1.find("#locopretimetabBottomlocotype").css("width",locotype.toString()+"px");
        this.$item1.find("#locopretimetabBottomloco").html(data[2]);  //机车
        this.$item1.find("#locopretimetabBottomloco").css("width",loco.toString()+"px");
        this.$item1.find("#locopretimetabBottomlocoab").html(data[3]);  //AB节
        this.$item1.find("#locopretimetabBottomlocoab").css("width",locoab.toString()+"px");
        this.$item1.find("#locopretimetabBottompretime").html(data[4]);  //整备时间
        this.$item1.find("#locopretimetabBottompretime").css("width",locopretimepretime.toString()+"px");
        return this.$item1;
    };

    // 第一层
    var buildItemTr = function (data) {
    	var depotname=$("#locopretimedepotname").width()+3;
    	var locotype=$("#locopretimelocotype").width()-17;
    	var loco=$("#locopretimeloco").width()+3;
    	var locoab=$("#locopretimelocoab").width()+3;
    	var locopretimepretime=$("#locopretimepretime").width()+3;
        this.$item = $("<div>" + $("#locopretimetreedivHid #locopretime_middle").html() + "</div>");
        this.$item.find("#locopretimelocoid").html(data.loco);
        this.$item.find("#locopretimeloco_pretime").css("width",depotname.toString()+"px");
        this.$item.find("#locopretimelocotabTopTime").html(data.pretime);
        this.$item.find("#locopretimelocotabTopTime").css("width",locotype.toString()+"px");
        this.$item.find("#locopretimetabTopkong4").css("width",loco.toString()+"px");
        this.$item.find("#locopretimetabTopkong5").css("width",locoab.toString()+"px");
        this.$item.find("#locopretimetabTopkong6").css("width",locopretimepretime.toString()+"px");
        this.$item.find("#locopretimetabBottom").remove();
        for (var i = 0; i < data.list.length; i++) {
            this.$item.append(new childrenItem(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    };
//组装数据列表HTML，加载树对象
    var buildTreeHtml1 = function (data) {
        for (var i = 0; i < data.length; i++) {
            $(".locopretimetreediv").append(new buildItemTr(data[i]));
        }
        RTU.invoke("app.query.loading", { object: $(".driverworktreediv"), isShow: false });
    };
//树事件处理加载
    var initTreeHandle1 = function () { 
            //树收缩和展开事件2
        this.treeClick = function () {
            $(".locopretime-loco-click").click(function () {
                $(".img-btn2", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn2", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn2", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn2", $(this)).attr("src").indexOf("shousuo") != -1) {
                //	alert($(this).parent().attr('class'));  获得对象的class值
                    $(this).parent().siblings(".locopretimetabBottom").addClass("hidden");
                }
                else {
                    $(this).parent().siblings(".locopretimetabBottom").removeClass("hidden");
                }
            });
        };

        this.init = function () {
            ///////树收缩和展开事件
            this.treeClick();
        };
        this.init();
    };

    return function (data) {
        ///////先清除上次append的html
        $(".locopretimetreediv").empty();
        ///////建立树形Html
        buildTreeHtml1(data);
        ///////树事件处理加载
        initTreeHandle1();
        RTU.invoke("header.msg.hidden");
        };	
});

RTU.register("app.locopretime.query.tree.init", function () {
    ////组装树形子节点 完成
    var childrenItem = function (data) {
    	var depotname=$("#locopretimedepotname").width()+3;
    	var locotype=$("#locopretimelocotype").width()+3;
    	var loco=$("#locopretimeloco").width()+3;
    	var locoab=$("#locopretimelocoab").width()+3;
    	var locopretimepretime=$("#locopretimepretime").width()-17;
        this.$item1 = $("<div class='locopretimetabBottom'> " + $("#locopretimetreedivHid #locopretimetabBottom").html() + "</div>");
        this.$item1.find("#locopretimetabBottomdepot").html(data[0]);  //data[0]   机务段名
        this.$item1.find("#locopretimetabBottomdepot").css("width",depotname.toString()+"px");
        this.$item1.find("#locopretimetabBottomlocotype").html(data[1]);//机车型号
        this.$item1.find("#locopretimetabBottomlocotype").css("width",locotype.toString()+"px");
        this.$item1.find("#locopretimetabBottomloco").html(data[2]);  //机车
        this.$item1.find("#locopretimetabBottomloco").css("width",loco.toString()+"px");
        this.$item1.find("#locopretimetabBottomlocoab").html(data[3]);  //AB节
        this.$item1.find("#locopretimetabBottomlocoab").css("width",locoab.toString()+"px");
        this.$item1.find("#locopretimetabBottompretime").html(data[4]);  //整备时间
        this.$item1.find("#locopretimetabBottompretime").css("width",locopretimepretime.toString()+"px");
        return this.$item1;
    };

    // 第二层
    var buildItemTr1 = function (data) {
    	var depotname=$("#locopretimedepotname").width()+3;
    	var locotype=$("#locopretimelocotype").width()-17;
    	var loco=$("#locopretimeloco").width()+3;
    	var locoab=$("#locopretimelocoab").width()+3;
    	var locopretimepretime=$("#locopretimepretime").width()+3;
        this.$item = $("<div>" + $("#locopretimetreedivHid #locopretime_middle").html() + "</div>");
        this.$item.find("#locopretimelocoid").html(data.loco);
        this.$item.find("#locopretimeloco_pretime").css("width",depotname.toString()+"px");
        this.$item.find("#locopretimelocotabTopTime").html(data.pretime);
        this.$item.find("#locopretimelocotabTopTime").css("width",locotype.toString()+"px");
        this.$item.find("#locopretimetabTopkong4").css("width",loco.toString()+"px");
        this.$item.find("#locopretimetabTopkong5").css("width",locoab.toString()+"px");
        this.$item.find("#locopretimetabTopkong6").css("width",locopretimepretime.toString()+"px");
        this.$item.find("#locopretimetabBottom").remove();
        for (var i = 0; i < data.list.length; i++) {
            this.$item.append(new childrenItem(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    };
    ////组装数据列表行  第一层
    var buildItemTr = function (data) {
    	var depotname=$("#locopretimedepotname").width()+3;
    	var locotype=$("#locopretimelocotype").width()+3;
    	var loco=$("#locopretimeloco").width()+3;
    	var locoab=$("#locopretimelocoab").width()+3;
    	var locopretimepretime=$("#locopretimepretime").width()-17;
        this.$item = $("<div>" + $("#locopretimetreedivHid #locopretimetabDiv").html() + "</div>");
        this.$item.find("#labeldepot").html(data.depotid);
        this.$item.find("#locopretimedepot").css("width",depotname.toString()+"px");
        this.$item.find("#locopretimedepottabTopTime").html(data.pretime);
        this.$item.find("#locopretimedepottabTopTime").css("width",locopretimepretime.toString()+"px");
        this.$item.find("#locopretimetabTopkong1").css("width",locotype.toString()+"px");
        this.$item.find("#locopretimetabTopkong2").css("width",loco.toString()+"px");
        this.$item.find("#locopretimetabTopkong3").css("width",locoab.toString()+"px");
        this.$item.find("#locopretimetabBottom").remove();
        this.$item.find("#locopretime_middle").remove();
        for (var i = 0; i < data.list.length; i++) {
        		this.$item.append(new buildItemTr1(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    };
    ///////组装数据列表HTML，加载树对象
    var buildTreeHtml = function (data) {
        for (var i = 0; i < data.length; i++) {
            $(".locopretimetreediv").append(new buildItemTr(data[i]));
        }
        RTU.invoke("app.query.loading", { object: $(".driverworktreediv"), isShow: false });
    };
    ////////树事件处理加载
    var initTreeHandle = function () {
        ///////树收缩和展开事件1
        this.treeClick1 = function () {
            $(".locopretime-depot-click").click(function () {
                $(".img-btn1", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn1", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn1", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn1", $(this)).attr("src").indexOf("shousuo") != -1) {
                    $(this).parent().parent().siblings().addClass("hidden");
                }
                else {
                    $(this).parent().parent().siblings().removeClass("hidden");
                    }
             
                });
            };
  
            //树收缩和展开事件2
        this.treeClick2 = function () {
            $(".locopretime-loco-click").click(function () {
                $(".img-btn2", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn2", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn2", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn2", $(this)).attr("src").indexOf("shousuo") != -1) {
                //	alert($(this).parent().attr('class'));  获得对象的class值
                    $(this).parent().siblings(".locopretimetabBottom").addClass("hidden");
                }
                else {
                    $(this).parent().siblings(".locopretimetabBottom").removeClass("hidden");
                }
            });
        };


        this.init = function () {
            ///////树收缩和展开事件
            this.treeClick1();
            this.treeClick2();
        };
        this.init();
    };

    return function (data) {
        ///////先清除上次append的html
        $(".locopretimetreediv").empty();
        ///////建立树形Html
        buildTreeHtml(data);
        ///////树事件处理加载
        initTreeHandle();
        RTU.invoke("header.msg.hidden");
        };
    } 
);	


RTU.register("app.locoruninfo.query.tree.init", function () {
    ////组装树形子节点 完成
    var childrenItem = function (data) {
    	var commlength=$("#locoruninfodepotname").width()+3;
    	var locodistance=$("#locoruninfotmileage").width()-17;
        this.$item1 = $("<div class='locopretimetabBottom'> " + $("#locoruninfotreedivHid #locoruninfotabBottom").html() + "</div>");
        this.$item1.find("#locoruninfotabBottomdepot").html(data[0]);  //data[0]   机务段名
        this.$item1.find("#locoruninfotabBottomdepot").css("width",commlength.toString()+"px");
        this.$item1.find("#locoruninfotabBottomlocotype").html(data[1]);//机车型号
        this.$item1.find("#locoruninfotabBottomlocotype").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomloco").html(data[2]);  //机车+AB节
        this.$item1.find("#locoruninfotabBottomloco").css("width",commlength.toString()+"px");       
        this.$item1.find("#locoruninfotabBottomstime").html(data[3]);  //上线时间        
        this.$item1.find("#locoruninfotabBottomstime").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomftime").html(data[4]);  //下线时间        
        this.$item1.find("#locoruninfotabBottomftime").css("width",commlength.toString()+"px");
        this.$item1.find("#locoruninfotabBottomlinename").html(data[5]);  //线路号
        this.$item1.find("#locoruninfotabBottomlinename").css("width",commlength.toString()+"px");       
        this.$item1.find("#locoruninfotabBottomsdistance").html(data[6]);  //起始时间
        this.$item1.find("#locoruninfotabBottomsdistance").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomedistance").html(data[7]);  //终止里程
        this.$item1.find("#locoruninfotabBottomedistance").css("width",commlength.toString()+"px");   
        this.$item1.find("#locoruninfotabBottomdistance").html(data[8]);  //营运里程
        this.$item1.find("#locoruninfotabBottomdistance").css("width",locodistance.toString()+"px");                 
        return this.$item1;
    };

    // 第二层
    var buildItemTr1 = function (data) {
    	var locolength=$("#locoruninfodepotname").width()+3;
    	var locodistance=$("#locoruninfotmileage").width()-17;
        this.$item = $("<div>" + $("#locoruninfotreedivHid #locoruninfo_middle").html() + "</div>");
        this.$item.find("#locoruninfolocoid").html(data.loco);
        this.$item.find("#locoruninfoloco_runinfo").css("width",locolength.toString()+"px");
        this.$item.find("#locoruninfolocotabTo").html(data.totaldistance);
        this.$item.find("#locoruninfolocotabTo").css("width",locodistance.toString()+"px");
        this.$item.find("#locopretimetabTopkong9").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong10").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong11").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong12").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong13").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong14").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong15").css("width",locolength.toString()+"px");
        this.$item.find("#locoruninfotabBottom").remove();
        for (var i = 0; i < data.list.length; i++) {
            this.$item.append(new childrenItem(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    };
    ////组装数据列表行  第一层
    var buildItemTr = function (data) {
    	var locoruninfolength=$("#locoruninfodepotname").width()+3;
    	var totaldistancelength=$("#locoruninfotmileage").width()-17;
        this.$item = $("<div>" + $("#locoruninfotreedivHid #locoruninfotabDiv").html() + "</div>");
        this.$item.find("#locoruninfolabeldepot").html(data.depotid);
        this.$item.find("#locoruninfodepot").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfodepottabTop").html(data.totaldistance);
        this.$item.find("#locoruninfodepottabTop").css("width",totaldistancelength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong1").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong2").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong3").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong4").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong5").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong6").css("width",locoruninfolength.toString()+"px");
        this.$item.find("#locoruninfotabTopkong7").css("width",locoruninfolength.toString()+"px");  
        this.$item.find("#locoruninfotabBottom").remove();
        this.$item.find("#locoruninfo_middle").remove();
        for (var i = 0; i < data.list.length; i++) {
        		this.$item.append(new buildItemTr1(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    };
    ///////组装数据列表HTML，加载树对象
        
    var buildTreeHtml = function (data) {
        for (var i = 0; i < data.length; i++) {
            $(".locoruninfotreediv").append(new buildItemTr(data[i]));
        }
        RTU.invoke("app.query.loading", { object: $(".driverworktreediv"), isShow: false });
    };
    ////////树事件处理加载
    var initTreeHandle = function () {
        ///////树收缩和展开事件1
        this.treeClick1 = function () {
            $(".locoruninfo-depot-click").click(function () {
                $(".img-btn3", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn3", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn3", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn3", $(this)).attr("src").indexOf("shousuo") != -1) {
                    $(this).parent().parent().siblings().addClass("hidden");
                }
                else {
                    $(this).parent().parent().siblings().removeClass("hidden");
                    }
             
                });                       
            };
  
            //树收缩和展开事件2
        this.treeClick2 = function () {
            $(".locoruninfo-loco-click").click(function () {
                $(".img-btn4", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn4", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn4", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn4", $(this)).attr("src").indexOf("shousuo") != -1) {
                	//alert($(this).parent().attr('class'));  //获得对象的class值
                    $(this).parent().siblings(".locopretimetabBottom").addClass("hidden");//siblings找满足.locopretimetabBottom的兄弟对象
                }
                else {
                    $(this).parent().siblings(".locopretimetabBottom").removeClass("hidden");
                }
            });        
        };


        this.init = function () {
            ///////树收缩和展开事件
            this.treeClick1();
            this.treeClick2();
        };
        this.init();
    };

    return function (data) {
        ///////先清除上次append的html
        $(".locoruninfotreediv").empty();
        ///////建立树形Html
        buildTreeHtml(data);
        ///////树事件处理加载
        initTreeHandle();
        RTU.invoke("header.msg.hidden");
        };
    } 
);


RTU.register("app.locoruninfo.query.tree1.init", function () {
    var childrenItem = function (data) {
    	var commlength=$("#locoruninfodepotname").width()+3;
    	var locodistance=$("#locoruninfotmileage").width()-17;
        this.$item1 = $("<div class='locopretimetabBottom'> " + $("#locoruninfotreedivHid #locoruninfotabBottom").html() + "</div>");
        this.$item1.find("#locoruninfotabBottomdepot").html(data[0]);  //data[0]   机务段名
        this.$item1.find("#locoruninfotabBottomdepot").css("width",commlength.toString()+"px");
        this.$item1.find("#locoruninfotabBottomlocotype").html(data[1]);//机车型号
        this.$item1.find("#locoruninfotabBottomlocotype").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomloco").html(data[2]);  //机车+AB节
        this.$item1.find("#locoruninfotabBottomloco").css("width",commlength.toString()+"px");       
        this.$item1.find("#locoruninfotabBottomstime").html(data[3]);  //上线时间        
        this.$item1.find("#locoruninfotabBottomstime").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomftime").html(data[4]);  //下线时间        
        this.$item1.find("#locoruninfotabBottomftime").css("width",commlength.toString()+"px");
        this.$item1.find("#locoruninfotabBottomlinename").html(data[5]);  //线路号
        this.$item1.find("#locoruninfotabBottomlinename").css("width",commlength.toString()+"px");       
        this.$item1.find("#locoruninfotabBottomsdistance").html(data[6]);  //起始时间
        this.$item1.find("#locoruninfotabBottomsdistance").css("width",commlength.toString()+"px");        
        this.$item1.find("#locoruninfotabBottomedistance").html(data[7]);  //终止里程
        this.$item1.find("#locoruninfotabBottomedistance").css("width",commlength.toString()+"px");   
        this.$item1.find("#locoruninfotabBottomdistance").html(data[8]);  //营运里程
        this.$item1.find("#locoruninfotabBottomdistance").css("width",locodistance.toString()+"px");                 
        return this.$item1;
        	
    };

    // 第一层
    var buildItemTr = function (data) {
    	var locolength=$("#locoruninfodepotname").width()+3;
    	var locodistance=$("#locoruninfotmileage").width()-17;
        this.$item = $("<div>" + $("#locoruninfotreedivHid #locoruninfo_middle").html() + "</div>");
        this.$item.find("#locoruninfolocoid").html(data.loco);
        this.$item.find("#locoruninfoloco_runinfo").css("width",locolength.toString()+"px");
        this.$item.find("#locoruninfolocotabTo").html(data.totaldistance);
        this.$item.find("#locoruninfolocotabTo").css("width",locodistance.toString()+"px");
        this.$item.find("#locopretimetabTopkong9").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong10").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong11").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong12").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong13").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong14").css("width",locolength.toString()+"px");
        this.$item.find("#locopretimetabTopkong15").css("width",locolength.toString()+"px");
        this.$item.find("#locoruninfotabBottom").remove();
        for (var i = 0; i < data.list.length; i++) {
            this.$item.append(new childrenItem(data.list[i]));
        }
//            alert(this.$item.html());
        return this.$item;
    
    };
//组装数据列表HTML，加载树对象
    var buildTreeHtml1 = function (data) {
        for (var i = 0; i < data.length; i++) {
            $(".locoruninfotreediv").append(new buildItemTr(data[i]));
        }
        RTU.invoke("app.query.loading", { object: $(".driverworktreediv"), isShow: false });
    
    };
//树事件处理加载
    var initTreeHandle1 = function () { 
            //树收缩和展开事件2
        this.treeClick = function () {
            $(".locoruninfo-loco-click").click(function () {
                $(".img-btn4", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn4", $(this)).attr("src", "../static/img/app/zhankai.png") :
						$(".img-btn4", $(this)).attr("src", "../static/img/app/shousuo.png");
                if ($(".img-btn4", $(this)).attr("src").indexOf("shousuo") != -1) {
                	//alert($(this).parent().attr('class'));  //获得对象的class值
                    $(this).parent().siblings(".locopretimetabBottom").addClass("hidden");//siblings找满足.locopretimetabBottom的兄弟对象
                }
                else {
                    $(this).parent().siblings(".locopretimetabBottom").removeClass("hidden");
                }
            });        
        
        };

        this.init = function () {
            ///////树收缩和展开事件
            this.treeClick();
        };
        this.init();
    };

    return function (data) {
        ///////先清除上次append的html
        $(".locoruninfotreediv").empty();
        ///////建立树形Html
        buildTreeHtml1(data);
        ///////树事件处理加载
        initTreeHandle1();
        RTU.invoke("header.msg.hidden");
        };	
});

});
