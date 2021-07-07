RTU.DEFINE(function (require, exports) {
/**
 * 模块名：文件上传-result
 * name： filetransfer
 * date:2015-2-12
 * version:1.0 
 */
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
    var currentLkjPage = 1;
    var lkjPageSize = 15;
    var lkjTotalPage = 1;
    var states = []; //存放文件传输的全部状态
    var checkedData = ""; //选中的数据
    var currClickData; //tsc单击上传上部分列表选中的数据
    var currLkjClickData; //lkj单击上传上部分列表选中的数据
    var inputName="u_check";//当前复选框的名称
    var parentObjClass=".filetransfer-main-div";//当前父亲div的样式名
    var topFlag=true;//如果为true,说明是在TSC页面,否则是LKJ页面
    var checkedTr=[];//记录选 中的行
    //显示详细窗口
    RTU.register("app.realtimelocomotivequery.showFileTransferWin", function () {
        return function (data) {
            RTU.invoke("app.realtimelocomotivequery.upload.createwin", data);
            checkedData = "";
            for (var i = 0; i < data.length; i++) {
                checkedData += data[i] + ";";
            }
            checkedData = checkedData.substring(0, checkedData.length - 1);
        };
    });

    //创建查询窗口
    RTU.register("app.realtimelocomotivequery.upload.createwin", function () {
        return function (data) {
            //查询窗口
            RTU.invoke("app.realtimelocomotivequery.upload.loadHtml", { url: "../app/modules/realtimelocomotivequery/app-realtimelocomotivequery-rightclick-filetransfer.html", fn: function (html) {
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
                    left: 380,
                    top: 60,
                    shadow: true
                });
                window.popuwnd_file.init();

                window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	checkedTr=[];
                    clearInterval(setuploadtimer); //窗口打开时清除5秒刷新
                });
                inputName=null;
                parentObjClass=null;
                currentPage=currentLkjPage=1;
                pageSize=lkjPageSize=15;
                return window.popuwnd_file;

            }, initEvent: function () {
                //tab页面切换效果
                $(".filetransfer-fileupload-operator-tab-ul li").click(function () {
                    $(this).css({ "border-bottom": "0px", "background": "#FFF" }).siblings().css({ "border-bottom": "1px solid gray", "background": "#F2F2F2" });
                    $("." + this.id + "-div").removeClass("hidden").siblings().addClass("hidden");
                    if($(".fileupload-lkj-div").css("display")!="block"){
                    	inputName="u_check";
                    	parentObjClass=".filetransfer-main-div";
                    	topFlag=true;
                    	checkedTr=[];
                    	}
                    else{
                    	inputName="u_check_lkj";
                    	parentObjClass=".fileupload-lkj-div";
                    	topFlag=false;
                    	checkedTr=[];
                    }
                    findByUpLoadState(true);  
                });
                $("#filetransfer-main").click();
                RTU.invoke("app.upload.page.init"); //分页
                RTU.invoke("app.realtimelocomotivequery.inituploadify", 
                		[$("#loadFile"),data]); //初始化文件上传插件
                RTU.invoke("app.realtimelocomotivequery.inituploadify", [$("#loadFile_lkj"),data,"1"]); //初始化文件上传插件
                //            	RTU.invoke("app.realtimelocomotivequery.findByUpLoadState");//加载上传完成的记录
                RTU.invoke("app.realtimelocomotivequery.updateuploadlist", data); //加载上传列表

                //取消上传
                $(".cancelupload").click(function () {
                    var id = "";
                    var upState = "";
                    var ids = "";
                    var flag = false; //判断是否选中复选框
                    
                    $("input[name='"+inputName+"']").each(function () {
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
                            $("input[name='"+inputName+"']").each(function () {
                                if ("checked" == $(this).attr("checked")) {
                                    var fName = $(this).attr("value"); //文件名
                                    var state = $(this).attr("upState");

                                    if (state == "130") {
                                        RTU.invoke("header.alarmMsg.show", fName + "文件已经取消，不能重复操作");
                                    } else if (state == "5") {
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
    RTU.register("app.realtimelocomotivequery.inituploadify", function () {
        return function (data) {
        	//上传文件插件的处理  
            $(data[0]).uploadify({
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
                    var name = fileObj.name;
                    $(".file-upload-input",parentObjClass).val(name);
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
    });

    //更新上传列表
    RTU.register("app.realtimelocomotivequery.updateuploadlist", function () {
        //遍历数据并更新上传列表上半部分的数据
        var updateUpList = function (data,curParentObjClass) {
            var upDatas = [];
            for (var i = 0; i < data.length; i++) {
                var upData = data[i].split(",");
                var temp = { id: i + 1, locoTypeid: upData[0], 
                		locoTypeName: upData[1], locoNo: upData[2], 
                		loco: upData[3], juduan: upData[4], locoAb: upData[5]
                		,isOnline:upData[6]};
                upDatas.push(temp);
            }
            var flag=curParentObjClass==".filetransfer-main-div";
            if ($(".upfile_result_div",curParentObjClass).length == 0) {
                if(flag)
            	$(".upfile-up-div",curParentObjClass).
                append('<div class="upfile_result_div"><div id="upfile_result_div_grid"></div></div>');
                else $(".upfile-up-div",curParentObjClass).
                append('<div class="upfile_result_div"><div id="upfile_result_lkj_div_grid"></div></div>');
            }
            if(true)
            var g = new RTGrid({
                containDivId: (flag?"upfile_result_div_grid":"upfile_result_lkj_div_grid"),
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
                    $(".filetransfer-tbody2",curParentObjClass).empty(); //单击前清空上传窗口的下部分列表
                    if (setuploadtimer != "undefined") {
                        clearInterval(setuploadtimer); //清除5秒刷新
                    }

                    //拿到点击的数据
                    var fd = g.currClickItem().data;
                    if(flag)
                    currClickData = fd;
                    else currLkjClickData=fd;
                    findByUpLoadState(true); //刷新下方列表
                    RTU.invoke("app.realtimelocomotivequery.findByUpLoadState"); //加载上传完成的记录
                },
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");

                    //默认选中一行记录
                    setTimeout(function () {
                        $(".RTTable-Body tbody tr:eq(0)", t.cDiv).trigger("click");
                    }, 500);
                },
                replaceTd: [{ index: 0, fn: function (data, j, ctd,itemData) {
                    if(data==0){
                    	return "<img src='../static/img/app/outline_pic_14_14.png'/>";
                    }
                    else return "<img src='../static/img/app/online_pic_14_14.png'/>";
                } 
                },{ index: 1, fn: function (data, j, ctd, itemData) {
//                	alert("itemData.locoAb"+itemData.locoAb)
                	if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                		return data+"-"+itemData.locoNo;
                    } else if (itemData.locoAb == "1") {
                    	return data+"-"+itemData.locoNo + window.locoAb_A;
                    } else {
                    	return data+"-"+itemData.locoNo + window.locoAb_B;
                    }
                }}],
                colNames: ["在线状态","机车", "车次", "局段"],
                colModel: [{name:"isOnline",width:"50"},
                           /*{ name: "locoTypeName", width: "154", isSort: true }, */
                           { name: "locoTypeName", width: "200", isSort: true }, 
                           /*{ name: "locoNo", width: "130", isSort: true }, */
                           { name: "loco", width: "140", isSort: true }, 
                           { name: "juduan", width: "150", isSort: true}]
            });
            else{
            	$("#upfile_result_lkj_div_grid").append($("#upfile_result_div_grid").html());
            	//默认选中一行记录
                setTimeout(function () {
                    $(".RTTable-Body tbody tr:eq(0)", "#upfile_result_lkj_div_grid").trigger("click");
                }, 500);
            }
            
            /*if(!flag){
            	var theadTds = $(".RTTable_Head thead tr td",curParentObjClass);
            	var tbodyTds = $(".RTTable-Body tbody tr:eq(0) td",curParentObjClass);
                for(var i=0;i<theadTds.length;i++){
                	$(theadTds[i]).css("width",$(tbodyTds[i]).css("width"));
                }
            }*/
        };
        return function (data) {
            //如果没选中任何机车，则关闭窗口
            if (data.length == 0) {
                if (window.popuwnd_file) {
                    window.popuwnd_file.close();
                }
            }
            updateUpList(data,".filetransfer-main-div");
            updateUpList(data,".fileupload-lkj-div");
        };
    });

  
    
    //更新数据用
    var $buildItem2 = function (data, index) {
    	
    	this.$item = $(".filetransfer-tfoot2",parentObjClass);
    	
   	 	for(var i=0;i<checkedTr.length;i++){
            if(checkedTr[i]==data.id){
           	 this.$item.find(".u_check").attr("checked","checked");
    	   }
        }
    	
        this.$item.find("tr").attr("id", data.id);
        this.$item.find(".u_check").attr("alt", data.id);
        this.$item.find(".u_check").attr("upState", data.upState);
        this.$item.find(".u_check").attr("value", data.filename);
        
        if(topFlag){
        	this.$item.find("#u_id").html(index);
            this.$item.find("#u_crc32").html(data.crc32);
            this.$item.find("#u_sendUser").html(data.sendUser);
            this.$item.find("#u_time").html(data.time);
            this.$item.find("#e_time").html(data.finishTime);
            this.$item.find("#u_filename").html(data.filename);
            this.$item.find("#u_filesize").html(data.totalLen);
        }
        else{
        	this.$item.find("#u_id_lkj").html(index);
            this.$item.find("#u_crc32_lkj").html(data.crc32);
            this.$item.find("#u_sendUser_lkj").html(data.sendUser);
            this.$item.find("#u_time_lkj").html(data.time);
            this.$item.find("#e_time_lkj").html(data.finishTime);
            this.$item.find("#u_filename_lkj").html(data.filename);
            this.$item.find("#u_filesize_lkj").html(data.totalLen);
        }
        for (var i = 0; i < states.length; i++) {
            if (data.upState == states[i].transstateCode) {
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
                if(topFlag){
                	if(states[i].transstateCode!="4"){
                		this.$item.find("#u_upState").html(states[i].transstateDesc);
                	}
                	else{
                		this.$item.find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
    		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
            					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                	}
                	
                }
                else{
                	if(states[i].transstateCode!="4"){
                		this.$item.find("#u_upState_lkj").html(states[i].transstateDesc);
                	}
                	else
                		this.$item.find("#u_upState_lkj").html(states[i].transstateDesc + "<div id='uploadBox_lkj' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
		        			"<div id='uploadBar_lkj' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                }
                /*if (data.upState == "4" || data.upState == "48") {
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
                    if(topFlag){
                    	this.$item.find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
    		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
            					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                    }
                    else{
                    	this.$item.find("#u_upState_lkj").html(states[i].transstateDesc + "<div id='uploadBox_lkj' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
    		        			"<div id='uploadBar_lkj' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
            					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                    }
                } else {
                    if(topFlag)this.$item.find("#u_upState").html(states[i].transstateDesc);
                    else this.$item.find("#u_upState_lkj").html(states[i].transstateDesc);
                }*/
            }
        }
        return $(this.$item.html());
    };

    //刷新列表内容
    var refreshUploadDownList = function (data, index) {
        for (var i = 0; i < states.length; i++) {
            if (data.upState == states[i].transstateCode) {
                $(".filetransfer-tbody2",parentObjClass).
                find("tr[id='" + data.id + "']").find(".u_check").attr("alt", data.id);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("upState", data.upState);
                $(".filetransfer-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("value", data.filename);
                if(topFlag){
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_id").html(index);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_crc32").html(data.crc32);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_sendUser").html(data.sendUser);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_time").html(data.time);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#e_time").html(data.finishTime);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_filename").html(data.filename);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_filesize").html(data.totalLen);
                }
                else{
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_id_lkj").html(index);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_crc32_lkj").html(data.crc32);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_sendUser_lkj").html(data.sendUser);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_time_lkj").html(data.time);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#e_time_lkj").html(data.finishTime);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_filename_lkj").html(data.filename);
                    $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_filesize_lkj").html(data.totalLen);
                }
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
                    if(topFlag){
                    	$(".filetransfer-tbody2",parentObjClass)
                        .find("tr[id='" + data.id + "']").
                        find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
    		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
            					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                    }
                    else{
                    	$(".filetransfer-tbody2",parentObjClass)
                        .find("tr[id='" + data.id + "']").
                        find("#u_upState_lkj").html(states[i].transstateDesc + "<div id='uploadBox_lkj' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
    		        			"<div id='uploadBar_lkj' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
            					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                    }
                } else {
                    if(topFlag){
                    	$(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_upState").html(states[i].transstateDesc);
                    }
                    else{
                    	$(".filetransfer-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_upState_lkj").html(states[i].transstateDesc);
                    }
                }
            }
        }
    };

    //加载上传状态为完成的记录的共用方法
    var findByUpLoadState = function (empty) {
        if (empty) {
            $(".filetransfer-tbody2",parentObjClass).empty();
        }
        //currClickData为undefined的话说明没选中则不查询对应历史记录
        if (topFlag&&currClickData != undefined) {
            //    		var url = "upFile/findOneByHistory?locoTypeid="+currClickData.locoTypeid+"&locoNo="+currClickData.locoNo+"&locoAb="+currClickData.locoAb;
            var url = "upFile/findOneByHistory?page=" + currentPage + "&pageSize=" + pageSize + "&locoTypeid=" + currClickData.locoTypeid + "&locoNo=" + currClickData.locoNo + "&locoAb=" + currClickData.locoAb;
            var param = {
                //    			url: "upFile/findAllByPage?page="+currentPage+"&pageSize=" + pageSize,
                url: encodeURI(url),
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.data;
                    if (empty) {
                        $(".filetransfer-tbody2",parentObjClass).empty();
                    }
                    for (var i = 0; i < d.length; i++) {
                        var idTemp = $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + d[i].id + "']");
                        if (idTemp.attr("id") != null) {
                            refreshUploadDownList(d[i], i + 1);
                        } else {
                        	
                        	 this.$item = $(".filetransfer-tfoot2",parentObjClass);
                             if ("checked" ==  this.$item.find(".u_check").attr("checked")) {
   		                           this.$item.find(".u_check").removeAttr("checked");
                               }
                            $(".filetransfer-tbody2",parentObjClass).append(new $buildItem2(d[i], i + 1));
                        }

                        if (obj.totalPage != undefined) {
                            totalPage = obj.totalPage;
                        }
                        currentPage == totalPage ? $(".upload-page-next-page",parentObjClass).css("color", "#7d7d7d") 
                        		: $(".upload-page-next-page",parentObjClass).css("color", "#3300FF");
                        currentPage == 1 ? $(".upload-page-pre-page",parentObjClass).css("color", "#7d7d7d") :
                        	$(".upload-page-pre-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-first-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-last-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-turn-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-current-page",parentObjClass).html(currentPage + "/" + totalPage);
                        
                        $("input[class='u_check']['alt="+d[i].id+"']",parentObjClass).unbind("click").click(function(event){
                   		 //處理事件Code
                   		 event.stopPropagation();
                   	 });
                    }
                    
                    //点击行选中
                    $("#filetransfer-table tbody tr").unbind("click").click(function(){
                    	 var tdTe=$(this).children().children().eq(0);
                    	 var id= tdTe.context.id;
     	            	 if ("checked" !=  $(tdTe).attr("checked")) {
     	            		 $(tdTe).attr("checked","checked");
     	            		checkedTr.push(id);
     	                 }else if ("checked" ==  $(tdTe).attr("checked")) {
     	                	for(var i = 0; i<checkedTr.length;i++){
    	                         if(checkedTr[i]==id){
    	                             checkedTr[i]="";
    	                         }
    	                     }
     	                	 $(tdTe).removeAttr("checked");
     	                 }
                    });
                }
            };
            RTU.invoke("core.router.get", param);
        }
        else if(!topFlag&&currLkjClickData!=undefined){

            //    		var url = "upFile/findOneByHistory?locoTypeid="+currClickData.locoTypeid+"&locoNo="+currClickData.locoNo+"&locoAb="+currClickData.locoAb;
            var url = "upFile/findOneByHistory?deviceId=1&page=" + currentLkjPage + "&pageSize=" + lkjPageSize + 
            "&locoTypeid=" + currLkjClickData.locoTypeid + "&locoNo=" + currLkjClickData.locoNo + "&locoAb=" 
            + currLkjClickData.locoAb;
            var param = {
                //    			url: "upFile/findAllByPage?page="+currentPage+"&pageSize=" + pageSize,
                url: encodeURI(url),
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.data;
                    if (empty) {
                        $(".filetransfer-tbody2",parentObjClass).empty();
                    }
                    for (var i = 0; i < d.length; i++) {
                        var idTemp = $(".filetransfer-tbody2",parentObjClass).find("tr[id='" + d[i].id + "']");
                        if (idTemp.attr("id") != null) {
                            refreshUploadDownList(d[i], i + 1);
                        } else {
                        	
                        	 this.$item = $(".filetransfer-tfoot2",parentObjClass);
                             if ("checked" ==  this.$item.find(".u_check").attr("checked")) {
   		                           this.$item.find(".u_check").removeAttr("checked");
                              }
                        	
                            $(".filetransfer-tbody2",parentObjClass).append(new $buildItem2(d[i], i + 1));
                        }

                        if (obj.totalPage != undefined) {
                            lkjTotalPage = obj.totalPage;
                        }
                        currentLkjPage == lkjTotalPage ? $(".upload-page-next-page",parentObjClass).css("color", "#7d7d7d")
                        		: $(".upload-page-next-page",parentObjClass).css("color", "#3300FF");
                        currentLkjPage == 1 ? $(".upload-page-pre-page",parentObjClass).css("color", "#7d7d7d") :
                        	$(".upload-page-pre-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-first-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-last-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-turn-page",parentObjClass).css("color", "#3300FF");
                        $(".upload-page-current-page",parentObjClass).html(currentLkjPage + "/" + lkjTotalPage);
                        
                        $("input[class='u_check']['alt="+d[i].id+"']",parentObjClass).unbind("click").click(function(event){
                   		 //處理事件Code
                   		 event.stopPropagation();
                   	 });
                    }
                    
                    //点击行选中
                    $("#filetransfer-table-lkj tbody tr").unbind("click").click(function(){
                    	 var tdTe=$(this).children().children().eq(0);
                    	 var id= tdTe.context.id;
     	            	 if ("checked" !=  $(tdTe).attr("checked")) {
     	            		 $(tdTe).attr("checked","checked");
     	            		checkedTr.push(id);
     	                 }else if ("checked" ==  $(tdTe).attr("checked")) {
     	                	for(var i = 0; i<checkedTr.length;i++){
	   	                         if(checkedTr[i]==id){
	   	                             checkedTr[i]="";
	   	                         }
     	                	}
     	                	 $(tdTe).removeAttr("checked");
     	                 }
                    });
                }
            };
            RTU.invoke("core.router.get", param);        
        }
    };

    //加载上传状态为完成的记录
    RTU.register("app.realtimelocomotivequery.findByUpLoadState", function () {
        return function () {
            setuploadtimer = setInterval(function () {
                findByUpLoadState(false);
            }, 5000);
        };
    });

    //文件上传分页
    RTU.register("app.upload.page.init", function () {
        var initEvent = function () {
            $(".upload-page-first-page").click(function () {
                if(topFlag){
                	if (currentPage == 1) {
                        return;
                    }
                    currentPage = 1;
                }
                else{
                	if (currentLkjPage == 1) {
                        return;
                    }
                    currentLkjPage = 1;
                }
                findByUpLoadState(true);
            });
            $(".upload-page-pre-page").click(function () {
                if(topFlag){
                	if (currentPage == 1) {
                        return;
                    }
                    currentPage > 1 ? currentPage = parseInt(currentPage) - 1 : currentPage = 1;
                    currentPage == 1 ? $(".upload-page-pre-page",parentObjClass).css("color", "#7d7d7d") :
                    	$(".upload-page-pre-page",parentObjClass).css("color", "#3300FF");
                }
                else{
                	if (currentLkjPage == 1) {
                        return;
                    }
                	currentLkjPage > 1 ? currentLkjPage = parseInt(currentLkjPage) - 1 : currentLkjPage = 1;
                	currentLkjPage == 1 ? $(".upload-page-pre-page",parentObjClass).css("color", "#7d7d7d") : 
                		$(".upload-page-pre-page",parentObjClass).css("color", "#3300FF");
                }
                findByUpLoadState(true);
            });
            $(".upload-page-turn-page").click(function () {
                if(topFlag){
                	if ($(".upload-page-turn-page-input",parentObjClass).val() == "") {
                        return;
                    }
                    ($(".upload-page-turn-page-input",parentObjClass).val() > 1 &&
                    		$(".upload-page-turn-page-input",parentObjClass).val() < totalPage) 
                    ? currentPage = $(".upload-page-turn-page-input",parentObjClass).val() : 
                    	($(".upload-page-turn-page-input",parentObjClass).val() <= 1 ? currentPage = 1 : currentPage = totalPage);
                }
                else{
                	if ($(".upload-page-turn-page-input",parentObjClass).val() == "") {
                        return;
                    }
                    ($(".upload-page-turn-page-input",parentObjClass).val() > 1 
                    		&& $(".upload-page-turn-page-input",parentObjClass).val() < lkjTotalPage) 
                    ? currentLkjPage = $(".upload-page-turn-page-input",parentObjClass).val() : 
                    	($(".upload-page-turn-page-input",parentObjClass).val() <= 1 ? 
                    			currentLkjPage = 1 : currentLkjPage = lkjTotalPage);
                }
                findByUpLoadState(true);
            });
            $(".upload-page-next-page").click(function () {
                if(topFlag){
                	if (currentPage == totalPage) {
                        return;
                    }
                    currentPage < totalPage ? currentPage = parseInt(currentPage) + 1 : currentPage = totalPage;
                    currentPage == totalPage ? $(".upload-page-next-page",parentObjClass).css("color", "#7d7d7d") 
                    		: $(".upload-page-next-page",parentObjClass).css("color", "#3300FF");
                }
                else{
                	if (currentLkjPage == lkjTotalPage) {
                        return;
                    }
                	currentLkjPage < totalPage ? currentLkjPage = parseInt(currentLkjPage) + 1 
                			: currentLkjPage = lkjTotalPage;
                	currentLkjPage == totalPage ? $(".upload-page-next-page",parentObjClass).css("color", "#7d7d7d") 
                			: $(".upload-page-next-page",parentObjClass).css("color", "#3300FF");
                }
                findByUpLoadState(true);
            });
            $(".upload-page-last-page").click(function () {
                if(topFlag){
                	if (currentPage == totalPage) {
                        return;
                    }
                    currentPage = totalPage;
                }
                else{
                	if (currentLkjPage == lkjTotalPage) {
                        return;
                    }
                	currentLkjPage = lkjTotalPage;
                }
                findByUpLoadState(true);
            });
            $(".upload-page-select").change(function () {
                if(topFlag){
                	currentPage = 1;
                    pageSize = parseInt($(".upload-page-select",parentObjClass).val());
                }
                else{
                	currentLkjPage = 1;
                    lkjPageSize = parseInt($(".upload-page-select",parentObjClass).val());
                }
                findByUpLoadState(true);
            });
        };
        return function () {
            initEvent();
        };
    });

    //加载文件传输全部状态
    RTU.register("app.fileupload.transstate.init", function () {
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
    RTU.register("app.realtimelocomotivequery.upload.loadHtml", function () {
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
                checkedTr=[];
            }
        };
    });

});