RTU.DEFINE(function (require, exports) {
/**
 * 模块名：文件上传-query
 * name： filetransfer
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("../../../css/app/app-filetransfer.css");
    require("../../../css/app/app-search.css");
    require("inputTip/css/inputTip.css");
    require("inputTip/inputTip.js");
    require("app/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filetransfer.js");
    require("app/loading/list-loading.js");
    var $html;
    var win_uploadfile;
    var data;
    var uploadFile = null;
   
    //加载数据并初始化窗口和事件
    RTU.register("app.filetransfer.uploadfile.loadHtml", function () {
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
    RTU.register("app.filetransfer.query.initButton", function () {
        return function () {
            //根据条件查询
            $(".filetransferSearchBut").unbind("click").click(function () {
                var input = $(".upLine_searchBtn").val();
                RTU.invoke("app.filetransfer.query.dataInit", input);
            });
            //查询全部
            $(".filetransferShowAllBut").unbind("click").click(function () {
                RTU.invoke("app.filetransfer.query.dataInit", "");
            });

            //文件上传-弹窗按钮
            $(".upload-btn").click(function () {
            		
                	 var arry = [];
                	 var lkj2000Array=[];
                	 var lkj15Array=[];
                     $(".filetransfer1-children-ck").each(function () {
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
                    	 if(window.popuwnd_file){
                     		window.popuwnd_file.close();
                     	}
                    	 return;
                     }
                     if(lkj2000Array.length>0)
      	            	RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", arry);
                     else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", arry);
            });
        };
    });

    //弹出查询页面
    RTU.register("app.filetransfer.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            //查询窗口
            RTU.invoke("app.filetransfer.uploadfile.loadHtml", { url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-filetransfer-query.html", fn: function (html) {
                if (!win_uploadfile) {
                    win_uploadfile = new PopuWnd({
                        title: data.alias,
                        html: html,
                        width: 240,
                        height: 420,
                        left: 135,
                        top: 60,
                        shadow: true
                    });
                    win_uploadfile.remove = win_uploadfile.close;
                    win_uploadfile.close = function(){
                    	if (uploadFile) {
                            clearInterval(uploadFile); //清除5秒刷新.
                        }
                    	uploadFile=null;
                    	return win_uploadfile.hidden();
                    }
                    win_uploadfile.init();
                }
                else {
                    win_uploadfile.init();
                }
                if (uploadFile) {
                    clearInterval(uploadFile); //清除5秒刷新
                }
                uploadFile=null;
                return win_uploadfile;
            },
                initEvent: function () { //初始化事件
                    RTU.invoke("app.filetransfer.query.smartTips.init");
                    RTU.invoke("app.filetransfer.query.dataInit", ""); //初始化数据
                    RTU.invoke("app.filetransfer.query.initButton"); //初始化查询按钮
                    $(".upLine_searchBtn").inputTip({ text: "" }).parent().css({ "float": "left" });
                }
            });
        };
    });

    //搜索框智能提示
    RTU.register("app.filetransfer.query.smartTips.init", function () {
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
                	$("#upLine_searchBtn").attr("locoAb",arr[1]);
                	
                });

            } catch (e) {
            }
        };
        var initCheciNameAuto1 = function () {
            CheciNameExParams1 = {
                keyword: function () {
                    return $('#upLine_searchBtn').val();
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
            autocompleteBuilder1($("#upLine_searchBtn"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            $('#upLine_searchBtn').result(function (event, autodata, formatted) {
                if (!formatted) {
                	var arr=formatted.split("_");
                    $('#upLine_searchBtn').val(arr[0]);
                }
            });
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
            }, 10);
        };
    });

    RTU.register("app.filetransfer.query.init", function () {
        data = RTU.invoke("app.setting.data", "filetransfer");
        if (data && data.isActive) {
            RTU.invoke("app.filetransfer.query.activate");
        }
        return function () {
            return true;
        };
    });
    RTU.register("app.filetransfer.query.deactivate", function () {
        return function () {
        	RTU.invoke("header.roleAlarmMsg.hide");
            if (win_uploadfile) {
                win_uploadfile.hidden();
                if (uploadFile) {
                    clearInterval(uploadFile);
                }
            }
        };
    });

    RTU.register("app.filetransfer.query.dataInit", function () {
        var initData = function (url) {
            RTU.invoke("app.query.loading", {
                object: $(".filetransfer1-body"),
                isShow: true
            });
            var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    if (data.data) {
                        RTU.invoke("app.filetransfer1.query.tree.init", data.data);
                    }
                },
                error: function () {
                    RTU.invoke("app.query.loading", { object: $(".filetransfer1-body"), isShow: false });
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
                var locoAbStr=  $("#upLine_searchBtn").attr("locoAB");
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
    RTU.register("app.filetransfer1.query.tree.init", function () {
        ////组装树形子节点
        var childrenItem = function (locoTypeid, locoTypeName, data) {
            this.$item = $($(".filetransfer1-children-div-template .filetransfer1-children-div-table").html());
            
            var locoNoAndAB=null;
           	if (data[1] !="1"&&data[1]!="2") {
           		 locoNoAndAB=data[0] ;
            } else if (data[1] == "1") {
           	 	locoNoAndAB=data[0]+ window.locoAb_A;
            } else {
           	 	locoNoAndAB=data[0]+ window.locoAb_B;
            }
            
            this.$item.find(".filetransfer1-locoNo").html(locoNoAndAB);  //data[0]
            this.$item.find(".juduan_upload").html(data[3]);
            this.$item.find(".locoType").html(data[2]); // checiName=$(this).attr("checiName");sName=$(this).attr("sName");
            data[4] == 0 ? this.$item.find(".uploadisOnline-img").attr("src", "../static/img/app/outline_pic_14_14.png") :
	            	this.$item.find(".uploadisOnline-img").attr("src", "../static/img/app/online_pic_14_14.png");
            this.$item.find(".filetransfer1-children-ck").attr({ "id": data[0]
	            , "locotypeid": locoTypeid
	            , "locotypename": locoTypeName
	            , "locono": data[0]
	            , "checiName": data[2]
	            , "sName": data[3]
	            , "locoAb": data[1]
            	, "speed":data[5]
            	, "name":"filetransfer1-children-ck-name",
            	"lkjType":data[6],
            	"isOnline":data[4]
            });
            return this.$item;
        };
        ////组装树形行父节点
        var fatherItem = function (data) {
            this.$item = $("<div>" + $(".filetransfer1-father-div-template .filetransfer1-father-temp").html() + "</div>");
            this.$item.find(".locoTypeName").html(data.locoTypeName);
            //this.$item.find(".locoTypeid").html(data.locoTypeid);
            return this.$item;
        };
        ////组装数据列表行
        var buildItemTr = function (data) {
            this.$item = $("<div>" + $(".filetransfer1-body-tr-template").html() + "</div>");
            this.$item.find(".filetransfer1-father-div").append(new fatherItem(data));
            for (var i = 0; i < data.list.length; i++) {
                this.$item.find(".filetransfer1-children-div-table").append(new childrenItem(data.locoTypeid, data.locoTypeName, data.list[i]));
            }
            return this.$item;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
            for (var i = 0; i < data.length; i++) {
                $(".filetransfer1-body .filetransfer1-body-tr").append(new buildItemTr(data[i]));
            }
            RTU.invoke("app.query.loading", { object: $(".filetransfer1-body"), isShow: false });
        };
        ////////树事件处理加载
        var initTreeHandle = function () {
            ///////树收缩和展开事件
            this.treeClick = function () {
                $(".filetransfer1-span-click").click(function () {
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
                $(".filetransfer1-father-ck").click(function () {
                    $(this).attr("checked") ? $(".filetransfer1-children-ck", $(this).parent().parent().siblings()).attr("checked", "checked") : $(".filetransfer1-children-ck", $(this).parent().parent().siblings()).removeAttr("checked");
                    $(".upload-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                });
            };
            //////树子节点全选/一不选->父节点选中/未选中
            var ckbClickFlag = true; //切换用(判断是否点击的是复选框而不是行)
            this.treeChildrenCheck = function () {
                //复选框选中单击事件
                $(".filetransfer1-children-ck").click(function () {
                	RTU.invoke("header.roleAlarmMsg.hide");
                	if(window.popuwnd_file){
                		window.popuwnd_file.close();
                	}
                    ckbClickFlag = false;
                    if ($(this).is(":checked")) {//判断复选框是否被选中
                    	 $(this).attr("checked", "checked");
                         $(".upload-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                    	
                    } else {
                    	$(this).removeAttr("checked");
                    }
                });

                //行选中单击事件
                $("#filetransfer1-main-divUpload .filetransfer1-body-tr tr").click(function () {
                    var that = this;
                    var ckb = $(".filetransfer1-children-ck", $(that));
                    var checkboxs = $("input[name='filetransfer1-children-ck-name']");
                    if (ckbClickFlag) {//如果是复选框选中的，则行选中不需要触发选中事件及弹出窗口，只需将ckbClickFlag设为默认
                    	if(window.popuwnd_file){
                    		window.popuwnd_file.close();
                    	}
                    	if (ckb.is(":checked")) {//判断复选框是否被选中
                            ckb.removeAttr("checked");
                            $(".upload-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                        } else {
                        	 $.each(checkboxs, function (i, item) {
                	   			 if($(item).attr("checked")=="checked"){
                	   				$(item).removeAttr("checked");
                		   		 }
                	         });
                        	
                            ckb.attr("checked", "checked");
                            
                            $(".upload-btn").trigger("click"); //触发上传按钮单击事件弹出窗口
                        }
                    } else {
                        ckbClickFlag = true;
                    }
                });
            };

            //树子节点点击，鼠标移动及点击效果
            this.moveroverTr = function () {
                var itemtr = $("#filetransfer1-main-divUpload .filetransfer1-children-div tr");
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

            var itemModels = $("#filetransfer1-main-divUpload .filetransfer1-body-tr>div");
            if (uploadFile) {
                clearInterval(uploadFile);
                uploadFile=null;
            }
            uploadFile = setInterval(function () {
                var refreshData = function (url) {
                    //	            		RTU.invoke("app.query.loading", {
                    //	                        object: $(".filetransfer1-body"),
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
                                        
                                        
                                        $(".filetransfer1-locoNo:eq(" + k + ")", divItem).text(locoNoAndAB);  //loco[0]
                                        $(".locoType:eq(" + k + ")", divItem).text(loco[2]);
                                        $(".juduan_upload:eq(" + k + ")", divItem).text(loco[3]);
                                    }
                                }
                            }
                        },
                        error: function () {
                            RTU.invoke("app.query.loading", { object: $(".filetransfer1-body"), isShow: false });
                        }
                    };
                    RTU.invoke("core.router.get", param);
                };

                var refreshTreeData = function () {
                    var str = $(".upLine_searchBtn").val();
                    var url = "";
                    if (str.indexOf('-') != -1) {
                        var arry = str.split('-');
                        var locoNoStr=arry[1];
                        var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)
                        var locoAbStr=  $("#upLine_searchBtn").attr("locoAB");
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
            }, 5000);

        };
        return function (data) {
            ///////先清除上次append的html
            $(".filetransfer1-body .filetransfer1-body-tr").empty();
            ///////建立树形Html
            buildTreeHtml(data);
            ///////树事件处理加载
            initTreeHandle();
        };

    });
});
