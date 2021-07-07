RTU.DEFINE(function (require, exports) {
/**
 * 模块名：请求命令-query
 * name： orderrequest
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/filemanager/app-filemanager-rightclick-ordrequest.js");
    require("app/loading/list-loading.js");
    var $html;
    var win_orderRequest;
    var data;
    var orderRequest = null;
   
    //加载数据并初始化窗口和事件
    RTU.register("app.orderrequest.orderRequest.loadHtml", function () {
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
    RTU.register("app.orderrequest.query.initButton", function () {
        return function () {
            //根据条件查询
            $(".orderRequestSearchBut").unbind("click").click(function () {
                var input = $(".ordRequest_searchBtn").val();
                RTU.invoke("app.orderrequest.query.dataInit", input);
            });
            //查询全部
            $(".orderRequestShowAllBut").unbind("click").click(function () {
                RTU.invoke("app.orderrequest.query.dataInit", "");
            });

            //文件上传-弹窗按钮
            $(".ordRequest-btn").unbind("click").click(function () {
                	 var arry = [];
                	 var lkj2000Array=[];
                	 var lkj15Array=[];
                     $(".orderRequest1-children-ck").each(function () {
                         var locotypeid = "";
                         var locotypename = "";
                         var locono = "";
                         var checiName = "";
                         var sName = "";
                         var locoAb = "";
                         var isOnline="";
                         if ($(this).attr("checked")) {
                        	 var thatC=this;
	                        		 locotypeid = $(this).attr("locotypeid");
	                        		 locotypename = $(this).attr("locotypename");
	                        		 locono = $(this).attr("locono");
	                        		 checiName = $(this).attr("checiName");
	                        		 sName = $(this).attr("sName");
	                        		 locoAb = $(this).attr("locoAb");
	                        		 isOnline=$(this).attr("isOnline");
	                        		 arry.push(locotypeid + "," + locotypename + "," + locono + "," + checiName + "," + sName + "," + locoAb+","+isOnline);
	                        		 if($(this).attr("lkjType")!=1){
	                        			 lkj2000Array.push($(this));
	                        		 }
	                        		 else{
	                        			 lkj15Array.push($(this));
	                        		 }
                         };
                     });
                     if(lkj15Array.length>0&&lkj2000Array.length>0){
                    	 alert("不能同时选择15型和2000型机车");
                    	 return;
                     }
                     if(lkj2000Array.length==0&&lkj15Array.length==0){
                    	 /*if(window.popuwnd_file){
                     		window.popuwnd_file.close();
                     	}*/
                    	 if(window.setuploadtimer)
                    	 clearInterval(window.setuploadtimer); //窗口打开时清除5秒刷新
                         if (window.popuwnd_file) {
                             window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                         }
                    	 return;
                     }
                     if(lkj2000Array.length>0)
      	            	RTU.invoke("app.filemanager.showOrdRequestWin", arry);
                     else RTU.invoke("app.filemanager.showFile15TransferWin", arry);
            });
        };
    });

    //弹出查询页面
    RTU.register("app.orderrequest.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口
            RTU.invoke("app.orderrequest.orderRequest.loadHtml", { url: "../app/modules/filemanager/app-filemanager-ordrequest.html", fn: function (html) {
                if (!win_orderRequest) {
                    win_orderRequest = new PopuWnd({
                        title: data.alias,
                        html: html,
                        width: 240,
                        height: 420,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    win_orderRequest.remove = win_orderRequest.close;
                    /*win_orderRequest.close = function(){
                    	if (orderRequest) {
                            clearInterval(orderRequest); //清除5秒刷新.
                        }
                    	orderRequest=null;
                    	return win_orderRequest.hidden();
                    }*/
                    win_orderRequest.init();
                }
                else {
                    win_orderRequest.init();
                }
                if (orderRequest) {
                    clearInterval(orderRequest); //清除5秒刷新
                }
                orderRequest=null;
                return win_orderRequest;
            },
                initEvent: function () { //初始化事件
                    RTU.invoke("app.orderrequest.query.smartTips.init");
                    RTU.invoke("app.orderrequest.query.dataInit", ""); //初始化数据
                    RTU.invoke("app.orderrequest.query.initButton"); //初始化查询按钮
                    $(".ordRequest_searchBtn").inputTip({ text: "" }).parent().css({ "float": "left" });
                }
            });
        };
    });

    //搜索框智能提示
    RTU.register("app.orderrequest.query.smartTips.init", function () {
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
                }).result(function (event, data, formatted){
                	var arr=formatted.split("_");
                	$("#ordRequest_searchBtn").attr("locoAb",arr[1]);
                	
                });

            } catch (e) {
            }
        };
        var initCheciNameAuto1 = function () {
            CheciNameExParams1 = {
                keyword: function () {
                    return $('#ordRequest_searchBtn').val();
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
                        value: aa+"_"+locoAB,
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#ordRequest_searchBtn"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            $('#ordRequest_searchBtn').result(function (event, autodata, formatted) {
                if (!formatted) {
                	var arr=formatted.split("_");
                    $('#ordRequest_searchBtn').val(arr[0]);
                }
            });
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
            }, 10);
        };
    });

    RTU.register("app.orderrequest.query.init", function () {
        data = RTU.invoke("app.setting.data", "orderrequest");
        if (data && data.isActive) {
            RTU.invoke("app.orderrequest.query.activate");
        }
        return function () {
            return true;
        };
    });
    RTU.register("app.orderrequest.query.deactivate", function () {
        return function () {
        	RTU.invoke("header.roleAlarmMsg.hide");
            if (win_orderRequest) {
                /*win_orderRequest.hidden();
                if (orderRequest) {
                    clearInterval(orderRequest);
                }*/
            	win_orderRequest.close();
            	win_orderRequest=null;
            }
        };
    });

    RTU.register("app.orderrequest.query.dataInit", function () {
        var initData = function (url) {
            RTU.invoke("app.query.loading", {
                object: $(".orderRequest1-body"),
                isShow: true
            });
            var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    if (data.data) {
                        RTU.invoke("app.orderrequest1.query.tree.init", data.data);
                    }
                },
                error: function () {
                    RTU.invoke("app.query.loading", { object: $(".orderRequest1-body"), isShow: false });
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
                var locoAbStr=  $("#ordRequest_searchBtn").attr("locoAB");
//                var locoAbStr="";
            	if(!isNaN(isAB)){  //只有机车号、AB节为0
            		if(!locoAbStr)locoAbStr="0";
            	}else{
//            		if(isAB=="A"){ 
//            			locoAbStr =1;
//            		}else if(isAB=="B"){ 
//            			locoAbStr=2;
//            		}
            		locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
            	}
            	var typeId= arry[0];
            	var test=/^[1-9]+[0-9]*]*$/;
            	if(test.test(typeId)){
            		url = "onlineloco/getTreeList?tTypeId=" + arry[0] + "&locoType=&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
            	}else{
            		url = "onlineloco/getTreeList?tTypeId=&locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
            	}
//                url = "onlineloco/getTreeList?tTypeId=&locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
//                url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + arry[1] + "&checiName=&beginTime=&endTime=";
                initData(url);
            } else {
            	url = "onlineloco/getTreeList?tTypeId=&locoType="+str+"&locoNo="+str+"&checiName="+str+"&beginTime=&endTime=&locoAb";
                initData(url);
            }
        };
    });
    /************************
    *add date:2014-08-06
    * *********************/
    RTU.register("app.orderrequest1.query.tree.init", function () {
        ////组装树形子节点
        var childrenItem = function (locoTypeid, locoTypeName, data) {
            this.$item = $($(".orderRequest1-children-div-template .orderRequest1-children-div-table").html());
            
            var locoNoAndAB=null;
           	if (data[1] !="1"&&data[1]!="2") {
           		 locoNoAndAB=data[0] ;
            } else if (data[1] == "1") {
           	 	locoNoAndAB=data[0]+ window.locoAb_A;
            } else {
           	 	locoNoAndAB=data[0]+ window.locoAb_B;
            }
            
            this.$item.find(".orderRequest1-locoNo").html(locoNoAndAB);  //data[0]
            this.$item.find(".juduan_upload").html(data[3]);
            this.$item.find(".locoType").html(data[2]); // checiName=$(this).attr("checiName");sName=$(this).attr("sName");
            data[4] == 0 ? this.$item.find(".uploadisOnline-img").attr("src", "../static/img/app/outline_pic_14_14.png") :
	            	this.$item.find(".uploadisOnline-img").attr("src", "../static/img/app/online_pic_14_14.png");
            this.$item.find(".orderRequest1-children-ck").attr({ "id": data[0]
	            , "locotypeid": locoTypeid
	            , "locotypename": locoTypeName
	            , "locono": data[0]
	            , "checiName": data[2]
	            , "sName": data[3]
	            , "locoAb": data[1]
            	, "speed":data[5]
            	, "name":"orderRequest1-children-ck-name",
            	"lkjType":data[6],
            	"isOnline":data[4]
            });
            return this.$item;
        };
        ////组装树形行父节点
        var fatherItem = function (data) {
            this.$item = $("<div>" + $(".orderRequest1-father-div-template .orderRequest1-father-temp").html() + "</div>");
            this.$item.find(".locoTypeName").html(data.locoTypeName);
            //this.$item.find(".locoTypeid").html(data.locoTypeid);
            return this.$item;
        };
        ////组装数据列表行
        var buildItemTr = function (data) {
            this.$item = $("<div>" + $(".orderRequest1-body-tr-template").html() + "</div>");
            this.$item.find(".orderRequest1-father-div").append(new fatherItem(data));
            for (var i = 0; i < data.list.length; i++) {
                this.$item.find(".orderRequest1-children-div-table").append(new childrenItem(data.locoTypeid, data.locoTypeName, data.list[i]));
            }
            return this.$item;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
            for (var i = 0; i < data.length; i++) {
                $(".orderRequest1-body .orderRequest1-body-tr").append(new buildItemTr(data[i]));
            }
            RTU.invoke("app.query.loading", { object: $(".orderRequest1-body"), isShow: false });
        };
        ////////树事件处理加载
        var initTreeHandle = function () {
            ///////树收缩和展开事件
            this.treeClick = function () {
                $(".orderRequest1-span-click").click(function () {
//                	alert(1)
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
            //////树父节点全选/全不选
            this.treeFatherCheck = function () {
                $(".orderRequest1-father-ck").click(function () {
                    $(this).attr("checked") ? $(".orderRequest1-children-ck", $(this).parent().parent().siblings()).attr("checked", "checked") : $(".orderRequest1-children-ck", $(this).parent().parent().siblings()).removeAttr("checked");
                    $(".ordRequest-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                });
            };
            //////树子节点全选/一不选->父节点选中/未选中
            var ord_ckbClickFlag = true; //切换用(判断是否点击的是复选框而不是行)
            this.treeChildrenCheck = function () {
                //复选框选中单击事件
                $(".orderRequest1-children-ck").click(function () {
                	RTU.invoke("header.roleAlarmMsg.hide");
                	/*if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}*/
                	 /*if(window.popuwnd_file)
                		 window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click();*/
                	if(window.setuploadtimer)
                   	 clearInterval(window.setuploadtimer); //窗口打开时清除5秒刷新
                        if (window.popuwnd_file) {
                            window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                    }
                    ord_ckbClickFlag = false;
                    if ($(this).is(":checked")) {//判断复选框是否被选中
                    	 $(this).attr("checked", "checked");
                         $(".ordRequest-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                    	
                    } else {
                    	$(this).removeAttr("checked");
                    }
                });

                //行选中单击事件
                $("#orderRequest1-main-divUpload .orderRequest1-body-tr tr").click(function () {
                    var that = this;
                    var ckb = $(".orderRequest1-children-ck", $(that));
                    var checkboxs = $("input[name='orderRequest1-children-ck-name']");
                    if (ord_ckbClickFlag) {//如果是复选框选中的，则行选中不需要触发选中事件及弹出窗口，只需将ckbClickFlag设为默认
                    	/*if(window.popuwnd_file){
                    		window.popuwnd_file.close();
                    	}*/
                    	 /*if(window.popuwnd_file)
                    		 window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click();*/
                    	if(window.setuploadtimer)
                       	 clearInterval(window.setuploadtimer); //窗口打开时清除5秒刷新
                            if (window.popuwnd_file) {
                                window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                            }
                    	if (ckb.is(":checked")) {//判断复选框是否被选中
                            ckb.removeAttr("checked");
                            $(".ordRequest-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                        } else {
                        	 $.each(checkboxs, function (i, item) {
                	   			 if($(item).attr("checked")=="checked"){
                	   				$(item).removeAttr("checked");
                		   		 }
                	         });
                        	
                            ckb.attr("checked", "checked");
                            
                            $(".ordRequest-btn").trigger("click");
                        }
                    } else {
                        ord_ckbClickFlag = true;
                    }
                });
            };

            //树子节点点击，鼠标移动及点击效果
            this.moveroverTr = function () {
                var itemtr = $("#orderRequest1-main-divUpload .orderRequest1-children-div tr");
                itemtr.hover(function () {
                    $(this).addClass("file_upload_moveTr");
                }, function () {
                    $(this).removeClass("file_upload_moveTr");
                });
                itemtr.click(function () {
                    itemtr.removeClass("file_upload_clickTr"); //移除所有行的点击背景颜色
                    $(this).addClass("file_upload_clickTr"); //添加当前点击选中行的背景颜色
                });
            };
            this.init = function () {
                ///////树收缩和展开事件
                this.treeClick();
                //////树父节点全选/全不选
                this.treeFatherCheck();

                this.moveroverTr();

                //////树子节点全选/一不选->父节点选中/未选中
                this.treeChildrenCheck();
            };
            this.init();

            var itemModels = $("#orderRequest1-main-divUpload .orderRequest1-body-tr>div");
            if (orderRequest) {
                clearInterval(orderRequest);
                orderRequest=null;
            }
           /* orderRequest = setInterval(function () {}, 5000);*/

            var refreshData = function (url) {
                //	            		RTU.invoke("app.query.loading", {
                //	                        object: $(".orderRequest1-body"),
                //	                        isShow: true
                //	        	         });
                var param = {
                    url: url,
                    cache: false,
                    asnyc: true,
                    datatype: "json",
                    success: function (data) {
                        for (var i = 0; i < data.data.length; i++) {
                            var d = data.data[i];
                            var divItem = itemModels[i];
                            $(".locoTypeName:eq(" + i + ")", divItem).text(d.locoTypeName);
                            if (d.list) {
                                for (var k = 0; k < d.list.length; k++) {
                                    var loco = d.list[k];
                                    if (loco[4] == 0) {
                                        $(".uploadisOnline-img:eq(" + k + ")", divItem).attr("src", "../static/img/app/outline_pic_14_14.png");
                                    }
                                    else {
                                        $(".uploadisOnline-img:eq(" + k + ")", divItem).attr("src", "../static/img/app/online_pic_14_14.png");
                                    }
                                    
                                    var locoNoAndAB=null;
                                   	if (loco[1]!="1"&&loco[1]!="2") {
                                   		 locoNoAndAB=loco[0];
                                    } else if (loco[1] == "1") {
                                   	 	locoNoAndAB=loco[0]+ window.locoAb_A;
                                    } else {
                                   	 	locoNoAndAB=loco[0]+ window.locoAb_B;
                                    }
                                    
                                    
                                    $(".orderRequest1-locoNo:eq(" + k + ")", divItem).text(locoNoAndAB);  //loco[0]
                                    $(".locoType:eq(" + k + ")", divItem).text(loco[2]);
                                    $(".juduan_upload:eq(" + k + ")", divItem).text(loco[3]);
                                }
                            }
                        }
                    },
                    error: function () {
                        RTU.invoke("app.query.loading", { object: $(".orderRequest1-body"), isShow: false });
                    }
                };
                RTU.invoke("core.router.get", param);
            };

            var refreshTreeData = function () {
                var str = $(".ordRequest_searchBtn").val();
                var url = "";
                if (str.indexOf('-') != -1) {
                    var arry = str.split('-');
                    var locoNoStr=arry[1];
                    var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)
                    var locoAbStr=  $("#ordRequest_searchBtn").attr("locoAB");
                	if(!isNaN(isAB)){  //只有机车号、AB节为0
                		if(!locoAbStr)locoAbStr=0;
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
                    
                    refreshData(url);
                } else {
                	url = "onlineloco/getTreeList?tTypeId=&locoType="+str+"&locoNo="+str+"&checiName="+str+"&beginTime=&endTime=&locoAb=";
                    refreshData(url);
                }
            };
            refreshTreeData();
        };
        return function (data) {
            ///////先清除上次append的html
            $(".orderRequest1-body .orderRequest1-body-tr").empty();
            ///////建立树形Html
            buildTreeHtml(data);
            ///////树事件处理加载
            initTreeHandle();
        };

    });
});
