RTU.DEFINE(function (require, exports) {
/**
 * 模块名：限制区段查询
 * name： limitsection
 * date:2016-06-29
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/loading/list-loading.js");
    require("../../../css/app/app-list.css");
    require("../common/common.js");
    require("../../../css/app/locomotivequery/locospread-queryTe.css");
        
    var $html;
	var popuwnd;
	var data;
	var limitsectionGrid;
    	
	RTU.register("app.limitsectionquery.query.init", function() {
		RTU.invoke("core.router.load",{
			url:"../app/modules/lkjequipmentversionhistoryquery/app-limitsection-query.html",
			success:function(html){
				$html = $(html);
				if(popuwnd){
					popuwnd.html($html);
				}
				
				RTU.invoke("app.limitsectionquery.query.create");
				$(".limitsectionSubmit").unbind("click").click(function(){
					if($("#limitsection_quduan").val()&&$("#limitsection_loco").val()
							&&$("#limitsection_version").val()){
						RTU.invoke("header.msg.show", "加载中,请稍后!!!");
						window.setTimeout(function(){
							RTU.invoke("app.limitsectionquery.query.showData");
						},10);
					}
					else{
						if(!$("#limitsection_quduan").val())
							RTU.invoke("header.notice.show","请选择运行区段");
						else if(!$("#limitsection_loco").val())
							RTU.invoke("header.notice.show","请选择机车");
						else
							RTU.invoke("header.notice.show","未获取到机车对应的实时版本");
						return;
					}
				});
			}
		});
		return function() {
			return true;
		};
	});
	
	var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth-135;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};
	
	RTU.register("app.limitsectionquery.query.activate", function() { //使得popuwnd对象活动
		return function() {
			/*RTU.invoke("header.msg.show", "加载中,请稍后!!!");*/
			/*var width = $("body").width() - 640;
			var height = $("body").height() - 120;*/
			var Resolution=getResolution();
			/*Twitdh=Resolution.Twidth-140;
			Theight=Resolution.Theight-60;*/
			Twitdh=Resolution.Twidth*0.8;
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
				/*window.setTimeout(function(){
					$(".limitsectionSubmit").click();
				},100);*/
			}
			window.setTimeout(function(){
				$("#limitsection_loco,#limitsection_version").val("");
				$("#limitsection-bodyDiv-body-grid").empty();
				RTU.invoke("core.router.get",{
					 url: "limitsection/findAllSections",
					 dataType:"jsonp",
	                 success: function (obj) {
	                        if (obj.success) {
	                        	var list=obj.data;
	                        	if(list&&list.length>0){
	                        		$("#limitsection_quduan option").remove();
	                        		for(var i=0;i<list.length;i++){
	                        			$("#limitsection_quduan")
	                        			.append("<option value='"+list[i].qdid+"'>"+list[i].qdname+"</option>");
	                        		}
	                        	}
	                        }
	                    },
	                    error: function (obj) {
	                    }
				});
			},10);
			RTU.invoke("header.msg.hidden");
		};
	});
	RTU.register("app.limitsectionquery.query.deactivate", function() { //隐藏
		return function() {
			if (popuwnd) {
				popuwnd.hidden();
			}
		};
	});
	
    //搜索框智能提示
    RTU.register("app.limitsectionquery.query.create", function () {
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
                    return $('#limitsection_loco').val();
                }
            };

            CheciNameParse1 = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    
                    var aa = data[i][0];
                    rows[rows.length] = {
                        data: "<table style='z-index:99999;'><tr><td align='center' style='width:85px;'>"
                        	+ aa + "</td></tr></table>",
                        value: aa+"_"+data[i][1],
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#limitsection_loco"), "limitsection/findAllLocos", CheciNameExParams1, CheciNameParse1);
            $('#limitsection_loco').result(function (event, autodata, formatted) {
            	if(formatted){
            		var arr=formatted.split("_");
            		if(arr.length>1){
            			$('#limitsection_loco').val(arr[0]);
            			$('#limitsection_version').val(arr[1]);
            		}
            		else $('#limitsection_loco').val(formatted);
            	}
            });
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
               
            }, 10);
        };
    });
    
	RTU.register("app.limitsectionquery.query.init", function() {
		data = RTU.invoke("app.setting.data", "limitsectionquery");
		if (data && data.isActive) {
			RTU.invoke("app.limitsectionquery.query.activate");  
		}		
		return function() {
			return true;
		};
	});
		
    //初始化按钮
    RTU.register("app.limitsectionquery.query.initButton", function () {
        return function () {};
    });

	RTU.register("app.limitsectionquery.query.showData",function(){
		var refreshFun=function(data){
			$("#limitsection-quality-grid").empty().removeClass("containGridDiv");
			var width=$("#limitsection-bodyDiv-body-grid").width();
			limitsectionGrid = new RTGrid({
    			url:encodeURI("../limitsection/findLimitStationInfoByProperty?currentVersion="
    					+$("#limitsection_version").val()
    					+"&qdId="+$("#limitsection_quduan").val()),
                containDivId: "limitsection-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#limitsection-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				
    			},
    		    replaceTd:[
						{
							index: 2, fn: function (data,j,ctd,itemData) {
								return data==0?"上行":"下行";
							}
						}, 
						{
							index: 4, fn: function (data,j,ctd,itemData) {
							return data==1?"<span style='color:red'>不允许通过</span>":"允许通过";
							
							}
						}   
    			],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                },
                colNames: ["站名", "站号","上下行","计划版本","允许通过","备注"],
                colModel: [{ name: "timsname"}, 
                           { name: "timsid"}, 
                           { name: "sxx"}, 
                           { name: "planVersion"}, 
                           { name: "limitFlag"}, 
                           { name: "note"}
                		  ]
            });
    		$(".RTTable_Head tr td:first",$("#limitsection-bodyDiv-body-grid")).text("序号");
    		
    		RTU.invoke("header.msg.hidden");
    		if(limitsectionGrid.datas.length==0){
    			RTU.invoke("header.notice.show","该机车版本能够适应该区段");
    		}
    	};
    	
    	return function(data){
    		refreshFun(data);
    	};
	});
});
