RTU.DEFINE(function (require, exports) {
    //require("jquery/jquery-1.7.2.min.js");
    require("popuwnd/js/popuwnd.js");
    require("jquery-uploadify/css/uploadify.css");
    require("jquery-uploadify/jquery.uploadify.js");
    require("../../../css/app/app-filetransfer.css");

    var $html;
    var data;
    var setuploadtimer; //5秒刷新用
    var currentPage = 1;
    var pageSize = 15;
    var totalPage = 1;
    var states = []; //存放文件传输的全部状态
    var checkedData = ""; //选中的数据
    var currClickData; //单击上传上部分列表选中的数据

    //显示详细窗口
    RTU.register("app.realtimelocomotivequery.showFile15TransferWin", function () {
        return function (data) {
            RTU.invoke("app.realtimelocomotivequery.upload.create15win", data);
            checkedData = "";
            for (var i = 0; i < data.length; i++) {
                checkedData += data[i] + ";";
            }
            checkedData = checkedData.substring(0, checkedData.length - 1);
        };
    });

    //创建查询窗口
    RTU.register("app.realtimelocomotivequery.upload.create15win", function () {
        return function (data) {
            //查询窗口
            RTU.invoke("app.realtimelocomotivequery.upload.load15Html", { url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filetransfer.html", fn: function (html) {
                $html = $(html);
                clearInterval(setuploadtimer); //窗口打开时清除5秒刷新
                if (window.popuwnd_file) {
                    window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                }
                window.popuwnd_file = new PopuWnd({
                    title: "TSC升级",
                    html: $html,
                    width: 820,
                    height: 555,
                    left: 360,
                    top: 60,
                    shadow: true
                });
                window.popuwnd_file.init();

                window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click(function () {
                    clearInterval(setuploadtimer); //窗口打开时清除5秒刷新
                });
                return window.popuwnd_file;

            }, initEvent: function () {
                //tab页面切换效果
                $(".filetransfer-fileupload-operator-tab-ul li").click(function () {
                    $(this).css({ "border-bottom": "0px", "background": "#FFF" }).siblings().css({ "border-bottom": "1px solid gray", "background": "#F2F2F2" });
                    $("." + this.id + "-div").removeClass("hidden").siblings().addClass("hidden");
                });
                RTU.invoke("app.upload.page.init15"); //分页
                RTU.invoke("app.realtimelocomotivequery.initupload15ify", data); //初始化文件上传插件
                //            	RTU.invoke("app.realtimelocomotivequery.findByUpLoadState");//加载上传完成的记录
                RTU.invoke("app.realtimelocomotivequery.updateupload15list", data); //加载上传列表

                //取消上传
                $(".cancelupload").click(function () {
                    var id = "";
                    var upState = "";
                    var ids = "";
                    var flag = false; //判断是否选中复选框
                    $("input[name='u_check']").each(function () {
                        if ("checked" == $(this).attr("checked")) {
                            id = $(this).attr("alt");
                            upState = $(this).attr("upState");

                            //多选时用于取消多条记录
                            if (upState != "130" && upState != "5") {
                                ids = ids + id + ",";
                            }

                            if ($(this).is(':checked') == true) {
                                flag = true;
                            } else {
                                flag = false;
                            }
                        }
                    });

                    //判断是否有复选框被选中
                    if (flag) {
                        var param = {
                            url: "upFile/cancelDownloadByIdIn?ids=" + ids,
                            dataType: "jsonp",
                            success: function (obj) {
                                RTU.invoke("header.notice.show", "命令已下达");
                                findByUpLoadState(true);
                            }
                        };

                        if (confirm("是否取消!")) {
                            $("input[name='u_check']").each(function () {
                                if ("checked" == $(this).attr("checked")) {
                                    var fName = $(this).attr("value"); //文件名
                                    var state = $(this).attr("upState");

                                    if (state == "130") {
                                        //               						alert(fName+"文件已经取消，不能重复操作");
                                        RTU.invoke("header.alarmMsg.show", fName + "文件已经取消，不能重复操作");
                                    } else if (state == "5") {
                                        //               						alert(fName+"文件已传输成功，不能取消");
                                        RTU.invoke("header.alarmMsg.show", fName + "文件已传输成功，不能取消");
                                    }
                                }
                            });
                            RTU.invoke("core.router.get", param);
                        }
                    } else {
                        RTU.invoke("header.notice.show", "请选择一个要取消的选项！");
                    }
                });
            }
            });
        };
    });

    //初始化文件上传插件
    RTU.register("app.realtimelocomotivequery.initupload15ify", function () {
        return function (data) {
            //上传文件插件的处理  
            $("#loadFile").uploadify({
                swf: '../static/js/jquery-uploadify/swf/uploadify.swf', //按钮路径
                uploader: '../upFile/upLoadFile', //请求后台URL
                width: '71',
                height: '22',
                method: 'POST',
                buttonClass: 'upLoadFileBtn',
                buttonText: "选择文件",
                buttonCursor: 'hand',
                preventCaching: true,
                auto: false, //不自动上传
                multi: false, //是否允许多选
                removeTimeout: 10, //消失时间
                fileTypeExts: '*.*',
                formData: { 'folderName': 'img' }, //文件夹名称
                'onUploadStart': function (file) {
                    var newdata = "";
                    for (var i = 0; i < data.length; i++) {
                        newdata += data[i] + ";";
                    }
                    newdata = newdata.substring(0, newdata.length - 1);
                    //在onUploadStart事件中，也就是上传之前，把参数写好传递到后台。  
                    $("#loadFile").uploadify("settings", "formData", { 'userName': RTU.data.user.realName, 'data': newdata });
                },
                'onSelect': function (fileObj) {
                    var name = fileObj.name;
                    $(".file-upload-input").val(name);
                },
                'onUploadSuccess': function (file, data, response) {
                    //更新上传记录
                    findByUpLoadState(true);
                },
                'onCancel': function () {
                    $(".file-upload-input").val("");
                }
            });
        };
    });

    //更新上传列表
    RTU.register("app.realtimelocomotivequery.updateupload15List", function () {
        //遍历数据并更新上传列表上半部分的数据
        var updateUpList = function (data) {
            var upDatas = [];
            for (var i = 0; i < data.length; i++) {
                var upData = data[i].split(",");
                var temp = { id: i + 1, locoTypeid: upData[0], locoTypeName: upData[1], locoNo: upData[2], loco: upData[3], juduan: upData[4], locoAb: upData[5] };
                upDatas.push(temp);
            }

            if ($(".upfile_result_div").length == 0) {
                $(".upfile-up-div").append('<div class="upfile_result_div"><div id="upfile_result_div_grid"></div></div>');
            }
            var g = new RTGrid({
                containDivId: "upfile_result_div_grid",
                datas: upDatas,
                tableWidth: 755,
                tableHeight: 180,
                hasCheckBox: false,
                showTrNum: true,
                beforeLoad:function(that){
     				that.pageSize =3000;
     			},
                isShowPagerControl: false,
                clickTrEvent: function (d) {
                    $(".filetransfer-tbody2").empty(); //单击前清空上传窗口的下部分列表
                    if (setuploadtimer != "undefined") {
                        clearInterval(setuploadtimer); //清除5秒刷新
                    }

                    //拿到点击的数据
                    var fd = g.currClickItem().data;
                    currClickData = fd;

                    findByUpLoadState(true); //刷新下方列表
                    RTU.invoke("app.realtimelocomotivequery.findByUpLoad15State"); //加载上传完成的记录
                },
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
//                    $(".RTGrid_Bodydiv", t.cDiv).css("height", "150px");
                    //默认选中一行记录
                    setTimeout(function () {
                        $(".RTTable-Body tbody tr:eq(0)", t.cDiv).trigger("click");
                    }, 500);

                },
                replaceTd: [{ index: 0, fn: function (data, j, ctd) {
                    return data;

                } 
                }],
                colNames: ["机车型号", "机车号", "车次", "局段"],
                colModel: [{ name: "locoTypeName", width: "154px", isSort: true }, { name: "locoNo", width: "130px", isSort: true }, { name: "loco", width: "140px", isSort: true }, { name: "juduan", width: "150px", isSort: true}]
            });
        };
        return function (data) {
            //如果没选中任何机车，则关闭窗口
            if (data.length == 0) {
                if (window.popuwnd_file) {
                    window.popuwnd_file.close();
                }
            }
            updateUpList(data);
        };
    });

    //更新数据用
    var $buildItem2 = function (data, index) {
        this.$item = $(".filetransfer-tfoot2");
        this.$item.find("tr").attr("id", data.id);
        this.$item.find(".u_check").attr("alt", data.id);
        this.$item.find(".u_check").attr("upState", data.upState);
        this.$item.find(".u_check").attr("value", data.filename);
        this.$item.find("#u_id").html(index);
        this.$item.find("#u_crc32").html(data.crc32);
        this.$item.find("#u_sendUser").html(data.sendUser);
        this.$item.find("#u_time").html(data.time);
        this.$item.find("#e_time").html(data.finishTime);
        this.$item.find("#u_filename").html(data.filename);
        this.$item.find("#u_filesize").html(data.totalLen);
        for (var i = 0; i < states.length; i++) {
            if (data.upState == states[i].transstateCode) {
                if (data.upState == "4" || data.upState == "48") {
                    var tlen = data.totalLen;
                    var dlen = data.upLen;
                    if (dlen == "" || dlen == "null") {
                        dlen = 0;
                    }
                    if (tlen == "" || tlen == "null" || tlen == "0") {
                        tlen = 1;
                    }
                    var result = parseInt(parseFloat(dlen / tlen) * 100);
                    //添加进度条
                    this.$item.find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                } else {
                    this.$item.find("#u_upState").html(states[i].transstateDesc);
                }
            }
        }
        return $(this.$item.html());
    };

    //刷新列表内容
    var refreshUploadDownList = function (data, index) {
        for (var i = 0; i < states.length; i++) {
            if (data.upState == states[i].transstateCode) {
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("alt", data.id);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("upState", data.upState);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("value", data.filename);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_id").html(index);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_crc32").html(data.crc32);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_sendUser").html(data.sendUser);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_time").html(data.time);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#e_time").html(data.finishTime);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_filename").html(data.filename);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_filesize").html(data.totalLen);
                if (data.upState == "4" || data.upState == "48") {
                    var tlen = data.totalLen;
                    var dlen = data.upLen;
                    if (dlen == "" || dlen == "null") {
                        dlen = 0;
                    }
                    if (tlen == "" || tlen == "null" || tlen == "0") {
                        tlen = 1;
                    }
                    var result = parseInt(parseFloat(dlen / tlen) * 100);
                    //刷新进度条
                    $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                } else {
                    $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find("#u_upState").html(states[i].transstateDesc);
                }
            }
        }
    };

    //加载上传状态为完成的记录的共用方法
    var findByUpLoadState = function (empty) {
        if (empty) {
            $(".filetransfer-tbody2").empty();
        }

        //currClickData为undefined的话说明没选中则不查询对应历史记录
        if (currClickData != undefined) {
            //    		var url = "upFile/findOneByHistory?locoTypeid="+currClickData.locoTypeid+"&locoNo="+currClickData.locoNo+"&locoAb="+currClickData.locoAb;
            var url = "upFile/findOneByHistory?page=" + currentPage + "&pageSize=" + pageSize + "&locoTypeid=" + currClickData.locoTypeid + "&locoNo=" + currClickData.locoNo + "&locoAb=" + currClickData.locoAb;
            var param = {
                //    			url: "upFile/findAllByPage?page="+currentPage+"&pageSize=" + pageSize,
                url: encodeURI(url),
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.data;
                    if (empty) {
                        $(".filetransfer-tbody2").empty();
                    }
                    for (var i = 0; i < d.length; i++) {
                        var idTemp = $(".filetransfer-tbody2").find("tr[id='" + d[i].id + "']");
                        if (idTemp.attr("id") != null) {
                            refreshUploadDownList(d[i], i + 1);
                        } else {
                            $(".filetransfer-tbody2").append(new $buildItem2(d[i], i + 1));
                        }

                        if (obj.totalPage != undefined) {
                            totalPage = obj.totalPage;
                        }
                        currentPage == totalPage ? $(".upload-page-next-page").css("color", "#7d7d7d") : $(".upload-page-next-page").css("color", "#3300FF");
                        currentPage == 1 ? $(".upload-page-pre-page").css("color", "#7d7d7d") : $(".upload-page-pre-page").css("color", "#3300FF");
                        $(".upload-page-first-page").css("color", "#3300FF");
                        $(".upload-page-last-page").css("color", "#3300FF");
                        $(".upload-page-turn-page").css("color", "#3300FF");
                        $(".upload-page-current-page").html(currentPage + "/" + totalPage);
                        
                        
                        
                        $("input[class='u_check']['alt="+d[i].id+"']").unbind("click").click(function(event){
                   		 //處理事件Code
                   		 event.stopPropagation();
                   	 });
                    }
                    
                    //点击行选中
                    $("#filetransfer-table tbody tr").unbind("click").click(function(){
                    	 var tdTe=$(this).children().children().eq(0);
     	            	 if ("checked" !=  $(tdTe).attr("checked")) {
     	            		 $(tdTe).attr("checked","checked");
     	                 }else if ("checked" ==  $(tdTe).attr("checked")) {
     	                	 $(tdTe).removeAttr("checked");
     	                 }
                    });
                }
            };
            RTU.invoke("core.router.get", param);
        }
    };

    //加载上传状态为完成的记录
    RTU.register("app.realtimelocomotivequery.findByUpLoad15State", function () {
        return function () {
            setuploadtimer = setInterval(function () {
                findByUpLoadState(false);
            }, 5000);
        };
    });

    //文件上传分页
    RTU.register("app.upload.page.init15", function () {
        var initEvent = function () {
            $(".upload-page-first-page").click(function () {
                if (currentPage == 1) {
                    return;
                }
                currentPage = 1;
                findByUpLoadState(true);
            });
            $(".upload-page-pre-page").click(function () {
                if (currentPage == 1) {
                    return;
                }
                currentPage > 1 ? currentPage = parseInt(currentPage) - 1 : currentPage = 1;
                currentPage == 1 ? $(this).css("color", "#7d7d7d") : $(this).css("color", "#3300FF");
                findByUpLoadState(true);
            });
            $(".upload-page-turn-page").click(function () {
                if ($(".upload-page-turn-page-input").val() == "") {
                    return;
                }
                ($(".upload-page-turn-page-input").val() > 1 && $(".upload-page-turn-page-input").val() < totalPage) ? currentPage = $(".upload-page-turn-page-input").val() : ($(".upload-page-turn-page-input").val() <= 1 ? currentPage = 1 : currentPage = totalPage);
                findByUpLoadState(true);
            });
            $(".upload-page-next-page").click(function () {
                if (currentPage == totalPage) {
                    return;
                }
                currentPage < totalPage ? currentPage = parseInt(currentPage) + 1 : currentPage = totalPage;
                currentPage == totalPage ? $(this).css("color", "#7d7d7d") : $(this).css("color", "#3300FF");
                findByUpLoadState(true);
            });
            $(".upload-page-last-page").click(function () {
                if (currentPage == totalPage) {
                    return;
                }
                currentPage = totalPage;
                findByUpLoadState(true);
            });
            $(".upload-page-select").change(function () {
                currentPage = 1;
                pageSize = parseInt($(".upload-page-select").val());
                findByUpLoadState(true);
            });
        };
        return function () {
            initEvent();
        };
    });

    //加载文件传输全部状态
    RTU.register("app.fileupload.transstate.init15", function () {
        var param = {
            url: "downFile/findAllTransstateCode",
            dataType: "jsonp",
            success: function (obj) {
                var d = obj.data;
                states = d;
            }
        };
        return function () {
            RTU.invoke("core.router.get", param);
        };
    });

    //加载数据并初始化窗口和事件
    RTU.register("app.realtimelocomotivequery.upload.load15Html", function () {
        return function (data) {
            if (data && data.url) {
                //当文件传输全部状态为空时才加载
                if (states.length == 0) {
                    RTU.invoke("app.fileupload.transstate.init"); //加载文件传输全部状态
                }
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

    RTU.register("app.filetransfer.result.deactivate", function () {
        return function () {
            if (window.popuwnd_file) {
                window.popuwnd_file.hidden();
                //				$html.find(".filetransfer-tbody2").empty();//清空下半部分列表
                clearInterval(setuploadtimer); //其它页面切换窗口时清除5秒刷新
            }
        };
    });

});