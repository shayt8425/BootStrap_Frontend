RTU.DEFINE(function (require, exports) {
/**
 * 模块名：文件下载-query
 * name：filedownload
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filedownload.js");
    require("app/loading/list-loading.js");
    var $html;
    var win_downloadfile;
    var data;
    var loadFile = null;

    //加载数据并初始化窗口和事件
    RTU.register("app.filetransfer.downloadfile.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                        }
                    }
                });
            }
        };
    });

    //初始化按钮
    RTU.register("app.filedownload.query.initButton", function () {
        return function () {
            //根据条件查询
            $(".filedownloadSearchBut").unbind("click").click(function () {
                var input = $(".upLine_searchBtn_download").val();
                RTU.invoke("app.filedownload.query.dataInit", input);
            });
            //查询全部
            $(".filedownloadShowAllBut").unbind("click").click(function () {
                RTU.invoke("app.filedownload.query.dataInit", "");
            });
        };
    });

    //弹出查询页面
    RTU.register("app.filedownload.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口
            RTU.invoke("app.filetransfer.downloadfile.loadHtml", { url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-filedownload-query.html", fn: function (html) {
            	if (!win_downloadfile) {
                    win_downloadfile = new PopuWnd({
                        title: data.alias,
                        html: html,
                        width: 240,
                        height: 420,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    win_downloadfile.remove = win_downloadfile.close;
                    win_downloadfile.close = function(){
                    	if(loadFile){
                    		clearInterval(loadFile);
                    		loadFile=null;
                    	}
                    	return win_downloadfile.hidden();
                    }
                    win_downloadfile.init();
                }
                else {
                    win_downloadfile.init();
                }
                return win_downloadfile;
            },
                initEvent: function () { //初始化事件
                    RTU.invoke("app.filedownload.query.smartTips.init");
                    RTU.invoke("app.filedownload.query.dataInit", ""); //初始化数据
                    RTU.invoke("app.filedownload.query.initButton"); //初始化查询按钮
                    $(".upLine_searchBtn_download").inputTip({ text: "" }).parent().css({ "float": "left" });
                }
            });
        };
    });

    //搜索框智能提示
    RTU.register("app.filedownload.query.smartTips.init", function () {
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
                    parse: parse,//处理JSON格式的数据都要自己重写parse方法
                    formatItem: function (data, i, totle) {
                        return data;
                    },
                    formatResult: function (format) {
                        return format;
                    }
                }).result(function (event, data, formatted){
                	if(formatted){
                		var arr=formatted.split("_");
                		if(arr.length>1)
                			$("#upLine_searchBtn_download").attr("locoAb",arr[1]);
                	}
                	else $("#upLine_searchBtn_download").attr("locoAb","");
                });

            } catch (e) {
            }
        };
        var initCheciNameAuto1 = function () {
            CheciNameExParams1 = {
                keyword: function () {
                    return $('#upLine_searchBtn_download').val();
                }
            };

            CheciNameParse1 = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text1 = $.trim(data[i].locoTypeName);
                    var text4 = $.trim(data[i].locoNO);
                    var text5 = $.trim(data[i].locoAb);
                    var locoAB=text5;
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
                        value:  aa+"_"+locoAB,
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#upLine_searchBtn_download"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            /*$('#upLine_searchBtn_download').result(function (event, autodata, formatted) {
                if (!formatted) {
                	var arr=formatted.split("_");
                    $('#upLine_searchBtn_download').val(arr[0]);
                }
            });*/
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
            }, 10);
        };
    });

    RTU.register("app.filedownload.query.init", function () {
        data = RTU.invoke("app.setting.data", "filedownload");
        if (data && data.isActive) {
            RTU.invoke("app.filedownload.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.filedownload.query.deactivate", function () {
        return function () {
            if (win_downloadfile) {
                win_downloadfile.hidden();
            }
            if(loadFile){
        		clearInterval(loadFile);
        		loadFile=null;
        	}
            RTU.invoke("header.roleAlarmMsg.hide");
        };
    });

    RTU.register("app.filedownload.query.dataInit", function () {
        var initData = function (url) {
            RTU.invoke("app.query.loading", {
                object: $(".filedownload1-body"),
                isShow: true
            });
            var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    if (data.data) {
                        RTU.invoke("app.filedownload.query.tree.init", data.data);
                    }
                },
                error: function () {
                    RTU.invoke("app.query.loading", { object: $(".filedownload1-body"), isShow: false });
                }
            };
            RTU.invoke("core.router.get", param);

        };
        return function (str) {
            var url = "";
            if (str.indexOf('-') != -1) {
                var arry = str.split('-');
                var locoNoStr=arry[1];
                var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)
                var locoAbStr=$("#upLine_searchBtn_download").attr("locoAb");
//                var locoAbStr="";
            	if(!isNaN(isAB)){  //只有机车号、AB节为0            		
        			if(locoAbStr=="")
        				locoAbStr=0;
            	}else{
            		if(isAB=="A"){ 
            			locoAbStr =1;
            		}else if(isAB=="B"){ 
            			locoAbStr=2;
            		}
            		locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
            	}
            	var typeId= arry[0];
            	var test=/^[1-9]+[0-9]*]*$/;
            	if(test.test(typeId)){
            		url = "onlineloco/getTreeList?tTypeId=" + arry[0] + "&locoType=&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
            	}else{
            		url = "onlineloco/getTreeList?tTypeId=&locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
            	}
//            	url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
//                url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + arry[1] + "&checiName=&beginTime=&endTime=";
                initData(url);
            } else {
                url = "onlineloco/getTreeList?locoType="+str+"&locoNo="+str+"&checiName="+str+"&beginTime=&endTime=&locoAb=";
                initData(url);
            }
        };
    });
    /************************
    *add date:2014-08-06
    * *********************/
    RTU.register("app.filedownload.query.tree.init", function () {
        ////组装树形子节点
        var childrenItem = function (locoTypeid, locoTypeName, data) {
        	var locoNoAndAB=null;
        	 if (data[1] !="1"&&data[1]!="2") {
        		 locoNoAndAB=data[0] ;
             } else if (data[1] == "1") {
            	 locoNoAndAB=data[0]+ window.locoAb_A;
             } else {
            	 locoNoAndAB=data[0]+ window.locoAb_B;
             }
        	
            this.$item = $($(".filedownload1-children-div-template .filedownload1-children-div-table").html());
            this.$item.find(".filedownload1-locoNo").html(locoNoAndAB);  //data[0]   
            this.$item.find(".locoType_download").html(data[2]);
            this.$item.find(".juduan_download").html(data[3]);
            this.$item.find(".filedownload1-children-ck").attr({ "id": data[0], "locotypeid": locoTypeid, "locotypename": locoTypeName, "locono": data[0], "locoAb": data[1], "speed": data[5],"lkjType":data[6] });
            data[4] == 0 ? this.$item.find(".downloadisOnline-img").attr("src", "../static/img/app/outline_pic_20_20.png") :
	            	this.$item.find(".downloadisOnline-img").attr("src", "../static/img/app/online_pic_20_20.png");
            return this.$item;
        };
        ////组装树形行父节点
        var fatherItem = function (data) {
            this.$item = $("<div>" + $(".filedownload1-father-div-template .filedownload1-father-temp").html() + "</div>");
            this.$item.find(".locoTypeName_download").html(data.locoTypeName);
            return this.$item;
        };
        ////组装数据列表行
        var buildItemTr = function (data) {
            this.$item = $("<div>" + $(".filedownload1-body-tr-template").html() + "</div>");
            this.$item.find(".filedownload1-father-div").append(new fatherItem(data));
            for (var i = 0; i < data.list.length; i++) {
                this.$item.find(".filedownload1-children-div-table").append(new childrenItem(data.locoTypeid, data.locoTypeName, data.list[i]));
            }
            return this.$item;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
            for (var i = 0; i < data.length; i++) {
                $(".filedownload1-body .filedownload1-body-tr").append(new buildItemTr(data[i]));
            }
            RTU.invoke("app.query.loading", { object: $(".filedownload1-body"), isShow: false });
        };
        ////////树事件处理加载
        var initTreeHandle = function () {
            ///////树收缩和展开事件
            this.treeClick = function () {
                $(".filedownload1-span-click").click(function () {
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
            //选中单选按钮事件
            this.treeClickRadio = function () {
                $(".filedownload1-children-ck").click(function () {
                	RTU.invoke("header.roleAlarmMsg.hide");
                		var locotypeid = "";
                        var locotypename = "";
                        var locono = "";
                        var locoAb = "";
                        var speed=0;
                        if ($(this).attr("checked")) {
                            locotypeid = $(this).attr("locotypeid");
                            locotypename = $(this).attr("locotypename");
                            locono = $(this).attr("locono");
                            locoAb = $(this).attr("locoAb");
                            speed=$(this).attr("speed");
                            if($(this).attr("lkjType")!=1)
                            	RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", 
                            			{ locotypeid: locotypeid, locono: locono,
                            		locoTypeName: locotypename, locoAb: locoAb,speed:speed });
                            else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", 
                        			{ locotypeid: locotypeid, locono: locono,
                        		locoTypeName: locotypename, locoAb: locoAb ,speed:speed});
                        };
                });

                $("#filetdownload1-main-divdownload .filedownload1-body-tr tr").click(function () {
                    var ckb = $(".filedownload1-children-ck", $(this));
                		ckb.attr("checked", "checked");
                        var locotypeid = ckb.attr("locotypeid");
                        var locotypename = ckb.attr("locotypename");
                        var locono = ckb.attr("locono");
                        var locoAb = ckb.attr("locoAb");
                        var speed=ckb.attr("speed");
                        if(ckb.attr("lkjType")!=1)
                        	RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", 
                        			{ locotypeid: locotypeid, locono: locono,
                        		locoTypeName: locotypename, locoAb: locoAb,speed:speed });
                        else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", 
                    			{ locotypeid: locotypeid, locono: locono,
                    		locoTypeName: locotypename, locoAb: locoAb,speed:speed });
/*                        RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", { locotypeid: locotypeid, locono: locono, locoTypeName: locotypename, locoAb: locoAb,speed:speed });*/
                });
            };

            //树子点击，鼠标移动及点击效果
            this.moveroverTr = function () {
                var itemtr = $("#filetdownload1-main-divdownload .filedownload1-children-div tr");
                itemtr.hover(function () {
                    $(this).addClass("file_upload_moveTr");
                }, function () {
                    $(this).removeClass("file_upload_moveTr");
                });
                itemtr.click(function () {
                    itemtr.removeClass("file_upload_clickTr");
                    $(this).addClass("file_upload_clickTr");
                });
            };

            this.init = function () {
                ///////树收缩和展开事件
                this.treeClick();
                //选中单选按钮事件
                this.treeClickRadio();
                this.moveroverTr();
            };
            this.init();

            var itemModels = $("#filetdownload1-main-divdownload .filedownload1-body-tr>div");
            if(loadFile){
            	clearInterval(loadFile);
            	loadFile=null;
            }
            loadFile = setInterval(function () {
                var refreshData = function (url) {
                    var param = {
                        url: url,
                        cache: false,
                        asnyc: true,
                        datatype: "json",
                        success: function (data) {
                            for (var i = 0; i < data.data.length; i++) {
                                var d = data.data[i];
                                var divItem = itemModels[i];
                                $(".locoTypeName_download:eq(" + i + ")", divItem).text(d.locoTypeName);
                                if (d.list) {
                                    for (var k = 0; k < d.list.length; k++) {
                                        var loco = d.list[k];
                                        if (loco[4] == 0) {
                                            $(".downloadisOnline-img:eq(" + k + ")", divItem).attr("src", "../static/img/app/outline_pic_20_20.png");
                                        }
                                        else {
                                            $(".downloadisOnline-img:eq(" + k + ")", divItem).attr("src", "../static/img/app/online_pic_20_20.png");
                                        }
                                        
                                        var locoNoAndAB=null;
	                                   	if (loco[1] !="1"&&loco[1]!="2") {
	                                   		 locoNoAndAB=loco[0] ;
                                        } else if (loco[1] == "1") {
                                       	 locoNoAndAB=loco[0]+ window.locoAb_A;
                                        } else {
                                       	 locoNoAndAB=loco[0]+ window.locoAb_B;
                                        }
                                        
                                        $(".filedownload1-locoNo:eq(" + k + ")", divItem).text(locoNoAndAB);  //loco[0]
                                        $(".locoType_download:eq(" + k + ")", divItem).text(loco[2]);
                                        $(".juduan_download:eq(" + k + ")", divItem).text(loco[3]);
                                    }
                                }
                            }
                        }
                    };
                    RTU.invoke("core.router.get", param);
                };

                var refreshTreeData = function () {
                    var str = $(".upLine_searchBtn_download").val(); //输入框条件
                    var url = "";
                    if (str.indexOf('-') != -1) {
                        var arry = str.split('-');
                        var locoNoStr=arry[1];
                        var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)
                        var locoAbStr=$("#upLine_searchBtn_download").attr("locoAb");
                    	if(!isNaN(isAB)){  //只有机车号、AB节为0
                    		if(locoAbStr=="")
                				locoAbStr=0;
                    	}else{
                    		if(isAB=="A"){ 
                    			locoAbStr =1;
                    		}else if(isAB=="B"){ 
                    			locoAbStr=2;
                    		}
                    		locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
                    	}
                    	var typeId= arry[0];
                    	var test=/^[1-9]+[0-9]*]*$/;
                    	if(test.test(typeId)){
                    		url = "onlineloco/getTreeList?tTypeId=" + arry[0] + "&locoType=&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
                    	}else{
                    		url = "onlineloco/getTreeList?tTypeId=&locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
                    	}
//                    	url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
//                        url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + arry[1] + "&checiName=&beginTime=&endTime=";

                        refreshData(url);
                    } else {
                    	url = "onlineloco/getTreeList?locoType="+str+"&locoNo="+str+"&checiName="+str+"&beginTime=&endTime=&locoAb=";
                        refreshData(url);
                    }
                };
                refreshTreeData();
            }, 5000);

        };

        return function (data) {
            ///////先清除上次append的html
            $(".filedownload1-body .filedownload1-body-tr").empty();
            ///////建立树形Html
            buildTreeHtml(data);
            ///////树事件处理加载
            initTreeHandle();
        };
    });
});
