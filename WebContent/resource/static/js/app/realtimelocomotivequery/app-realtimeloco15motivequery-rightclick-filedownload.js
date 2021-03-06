RTU.DEFINE(function (require, exports) {
    //require("jquery/jquery-1.7.2.min.js");
    require("popuwnd/js/popuwnd.js");
    require("jquery-uploadify/css/uploadify.css");
    require("jquery-uploadify/jquery.uploadify.js");
    require("../../../css/app/app-filetransfer.css");
    /*require("app/realtimelocomotivequery/app-realtimelocomotivequery-filetransfer-lookfile.js");*/
    
    var $html;
    /*var data;*/
    /*var timer; //5秒刷新用
*/    var currentPage = 1;
    var pageSize = 15;
    var totalPage = 1;
    var states = []; //存放文件传输的全部状态
    var c_filename; //需要下载文件的名字
    var c_filesize; //需要下载文件的大小
    var c_heXbyteStr; //需要下载文件的那条记录的十六进制字符串
    /*var requestDirectoryTime; //请求目录时间
*/    var clickData; //树形点击后传过来的信息
    //选中行ID
    var selectedId = "";

    //显示详细窗口
    RTU.register("app.realtimelocomotivequery.showFile15DownloadWin", function () {
        return function (data) {
            RTU.invoke("app.realtimelocomotivequery.createwin15", data);
            if(clickData){
            	if(clickData.locotypeid!=data.locotypeid
            			||clickData.locono!=data.locono
            			||clickData.locoAb!=data.locoAb){
            		selectedId="";
            		c_filename=undefined;
                    c_filesize=undefined;
                    c_heXbyteStr=undefined;
            	}
            }
            clickData = data;
        };
    });

    //创建查询窗口
    RTU.register("app.realtimelocomotivequery.createwin15", function () {
        return function (data) {
            //查询窗口
            RTU.invoke("app.realtimelocomotivequery.loadHtml15", { url: "../app/modules/app-realtimeloco15motivequery-rightclick-filedownload.html", fn: function (html) {
                $html = $(html);

                if (window.popuwnd_file) {
                	if(window.fileDownTimer)
                		clearInterval(fileDownTimer); //窗口关闭时清除3秒刷新
                    window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                }
                window.popuwnd_file = new PopuWnd({
                    title: "新一代LKJ文件下载-" + "(" + data.locoTypeName + "-" + data.locono + ")",
                    html: html,
                    width: 820,
                    height: 555,
                    left: 380,
                    top: 60,
                    shadow: true
                });
                window.popuwnd_file.myClose = window.popuwnd_file.close;
                /*window.popuwnd_file.close = function () {
                    clearInterval(timer); //窗口关闭时清除3秒刷新
                    window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                };*/
                window.popuwnd_file.init();
                window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	if(window.fileDownTimer)
                		clearInterval(fileDownTimer); //窗口关闭时清除3秒刷新
                });
                $(".filetransfer-tbody1").empty(); //清空下半部分列表
                if(!window.hasForceFlagPerm)
                	$("#c_forceFlag").attr("disabled","disabled").attr("checked",false);
                else $("#c_forceFlag").removeAttr("disabled");
                if(!window.hasGetFlagPerm)
                	$("#c_getFlag").attr("disabled","disabled").attr("checked",false);
                else $("#c_getFlag").removeAttr("disabled");
                return window.popuwnd_file;

            }, initEvent: function () {
                //tab页面切换效果
                $(".filetransfer-filedownload-operator-tab-ul li").click(function () {
                    $(this).css({ "border-bottom": "0px", "background": "#FFF" }).siblings().css({ "border-bottom": "1px solid gray", "background": "#F2F2F2" });
                    $("." + this.id + "-div").removeClass("hidden").siblings().addClass("hidden");
                });
                $("#showAutoDownLoad").unbind("click").bind("click",function(){
                	findByDownState15(true);
                });
                RTU.invoke("app.realtimelocomotivequery.loadSucceedTab15"); //加载下载完成的记录(5秒)
                RTU.invoke("app.download.page.init15");

                //最新文件
                $(".newestFile").click(function () {
                	var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
                	RTU.invoke("header.alarmMsg.hide");
                	RTU.invoke("header.roleAlarmMsg.hide");
                	if(data_filedownload == null || data_filedownload == undefined ){
                		RTU.invoke("header.alarmMsg.show", "对不起，权限不足，无法操作");
                		return false;
                	}else{
                	
	                  if(data.speed>5){
/*	               	 if(RTU.data.user.roleId!="-53126093"){
	               		 RTU.invoke("header.alarmMsg.show", "在途机车速度大于5km/h,不允许下载文件");
	           			return false;
	           		}else{*/
	                	if(!window.hasDownPerm){
	                		RTU.invoke("header.alarmMsg.show", "在途机车速度大于5km/h,不允许下载文件");
		           			return false;  
	                	}
	                	else{
	           			RTU.invoke("header.roleAlarmMsg.show","在途机车速度大于5km/h,请谨慎下载");
	           			 try {
	                            $("#roleAlarmSureBtn").unbind("click").click(function () {
		               	             $("#roleAlarmDiv").addClass("hidden");
		               	             
			               	          var url = "downFile15/newestFile?locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
				               	       +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
				               	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);
			                          var param = {
			                              url: encodeURI(url),
			                              dataType: "jsonp",
			                              success: function (obj) {
			                                  if (obj.success) {
			                                      findByDownState15(true);
			                                      RTU.invoke("header.notice.show", "正在请求最新文件！");
			                                  } else {
			                                      RTU.invoke("header.notice.show", "请求失败");
			                                  }
			                              }
			                          };
			                          if (confirm("是否请求最新文件！")) {
			                              RTU.invoke("core.router.get", param);
			                          }
		               	             
		               	             
		               	         });
		           	            $("#roleAlarmCanelBtn").click(function () {
		           	                $("#roleAlarmDiv").addClass("hidden");
		           	                return false;
		           	            });
	                        } catch (e) {
	                        }
	                	  }
	           		/*}*/
	               }else{
	            	   var url = "downFile15/newestFile?locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
	            	   +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
         	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);;
	                    var param = {
	                        url: encodeURI(url),
	                        dataType: "jsonp",
	                        success: function (obj) {
	                            if (obj.success) {
	                                findByDownState15(true);
	                                RTU.invoke("header.notice.show", "正在请求最新文件！");
	                            } else {
	                                RTU.invoke("header.notice.show", "请求失败");
	                            }
	                        }
	                    };
	                    if (confirm("是否请求最新文件！")) {
	                        RTU.invoke("core.router.get", param);
	                    }
	               }
                  }            	
                });

                //请求目录
                $(".catalogue").click(function () {
                	var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
                	RTU.invoke("header.alarmMsg.hide");
                	RTU.invoke("header.roleAlarmMsg.hide");
                	if(data_filedownload == null || data_filedownload == undefined ){
                		RTU.invoke("header.alarmMsg.show","对不起，权限不足，无法操作");
                		return false;
                	}else{
	                  if(data.speed>5){
	               	 /*if(RTU.data.user.roleId!="-53126093"){
	           			RTU.invoke("header.alarmMsg.show","在途机车速度大于5km/h,不允许下载文件");
	           			return false;
	           		}else{*/
	                	  if(!window.hasDownPerm){
		                		RTU.invoke("header.alarmMsg.show", "在途机车速度大于5km/h,不允许下载文件");
			           			return false;  
		                	}
		                	else{
	           			RTU.invoke("header.roleAlarmMsg.show","在途机车速度大于5km/h,请谨慎下载");
	           			 try {
	                            $("#roleAlarmSureBtn").unbind("click").click(function () {
		               	             $("#roleAlarmDiv").addClass("hidden");
		               	             
			               	          var url = "downFile15/catalogue?locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
			               	          +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
			            	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);;
			                          var param = {
			                              url: encodeURI(url),
			                              dataType: "jsonp",
			                              success: function (obj) {
			                                  if (obj.success) {
			                                      findByDownState15(true);
			                                      RTU.invoke("header.notice.show", "请求目录中...");
			                                  } else {
			                                      RTU.invoke("header.notice.show", "请求失败");
			                                  }
			                              }
			                          };
			                          if (confirm("是否请求目录!")) {
			                              if (typeof (data.locotypeid) != "undefined" && typeof (data.locono) != "undefined") {
			                                  RTU.invoke("core.router.get", param);
			                              }
			                          }
		               	         });
		           	            $("#roleAlarmCanelBtn").click(function () {
		           	                $("#roleAlarmDiv").addClass("hidden");
		           	                return false;
		           	            });
	                        } catch (e) {
	                        }
	           		/*}*/
		                	}
	               }else{
	            	   var url = "downFile15/catalogue?locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
	            	   +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
         	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);;
	                    var param = {
	                        url: encodeURI(url),
	                        dataType: "jsonp",
	                        success: function (obj) {
	                            if (obj.success) {
	                                findByDownState15(true);
	                                RTU.invoke("header.notice.show", "请求目录中...");
	                            } else {
	                                RTU.invoke("header.notice.show", "请求失败");
	                            }
	                        }
	                    };
	                    if (confirm("是否请求目录!")) {
	                        if (typeof (data.locotypeid) != "undefined" && typeof (data.locono) != "undefined") {
	                            RTU.invoke("core.router.get", param);
	                        }
	                    }
	               }
                  }     
                });

                //下载文件到ftp
                $(".downLoadFileToFTP").click(function () {
                	
                	var data_filedownload = RTU.invoke("app.setting.data", "filedownload");
                	RTU.invoke("header.roleAlarmMsg.hide");
                	RTU.invoke("header.alarmMsg.hide");
                	if(data_filedownload == null || data_filedownload == undefined ){
                		RTU.invoke("header.alarmMsg.show","对不起，权限不足，无法操作");
                		return false;
                	}else{
	                  if(data.speed>5){
	               	 /*if(RTU.data.user.roleId!="-53126093"){
	           			RTU.invoke("header.alarmMsg.show","在途机车速度大于5km/h,不允许下载文件");
	           			return false;
	           		}else{*/
	                	  if(!window.hasDownPerm){
		                		RTU.invoke("header.alarmMsg.show", "在途机车速度大于5km/h,不允许下载文件");
			           			return false;  
		                	}
		                	else{
	           			RTU.invoke("header.roleAlarmMsg.show","在途机车速度大于5km/h,请谨慎下载");
	           			 try {
	                            $("#roleAlarmSureBtn").unbind("click").click(function () {
		               	             $("#roleAlarmDiv").addClass("hidden");
			               	          var downState;
			                          var url = "downFile15/downLoadFileToFTP?downloadFilename=" + c_filename + "&totalLen=" + c_filesize + "&heXbyteStr=" 
			                          + c_heXbyteStr + "&locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
			                          +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
			               	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);
			                          var param = {
			                              url: encodeURI(url),
			                              dataType: "jsonp",
			                              success: function (obj) {
			                                  if (obj.success) {
			                                      findByDownState15(true);
			                                      RTU.invoke("header.notice.show", "命令已发出！");
			                                  } else {
			                                      RTU.invoke("header.notice.show", "请求失败");
			                                  }
			                              }
			                          };
			                          if (typeof (c_filename) != "undefined" && typeof (c_filesize) != "undefined") {
			                              if (confirm("是否下载!")) {
			                                  RTU.invoke("core.router.get", param);
			                              }
			                          } else {
			                              RTU.invoke("header.notice.show", "请选择一个要下载的文件！");
			                          }	
		               	         });
		           	            $("#roleAlarmCanelBtn").click(function () {
		           	                $("#roleAlarmDiv").addClass("hidden");
		           	                return false;
		           	            });
	                        } catch (e) {
	                        }
	           		/*}*/
		                	}
	               }else{
	            	   var downState;
	                    var url = "downFile15/downLoadFileToFTP?downloadFilename=" + c_filename + "&totalLen=" + c_filesize +
	                    "&heXbyteStr=" + c_heXbyteStr + "&locoTypeid=" + data.locotypeid + "&locoNo=" + data.locono + "&locoAb=" + data.locoAb + "&userName=" + RTU.data.user.realName
                        +"&forceFlag="+($("#c_forceFlag").attr("enabled")||!$("#c_forceFlag").attr("checked")?0:1)+
             	          "&getFlag="+($("#c_getFlag").attr("enabled")||!$("#c_getFlag").attr("checked")?0:1);
	                    var param = {
	                        url: encodeURI(url),
	                        dataType: "jsonp",
	                        success: function (obj) {
	                            if (obj.success) {
	                                findByDownState15(true);
	                                RTU.invoke("header.notice.show", "命令已发出！");
	                            } else {
	                                RTU.invoke("header.notice.show", "请求失败");
	                            }
	                        }
	                    };
	                    if (typeof (c_filename) != "undefined" && typeof (c_filesize) != "undefined") {
	                        if (confirm("是否下载!")) {
	                            RTU.invoke("core.router.get", param);
	                        }
	                    } else {
	                        RTU.invoke("header.notice.show", "请选择一个要下载的文件！");
	                    }
                   }
                  }   
                });

                //取消下载
                $(".cancelDownload").click(function () {
                    var id = "";
                    var downState = "";
                    var ids = "";
                    var flag = false; //判断是否选中复选框
                    $("input[name='check']").each(function () {
                        if ("checked" == $(this).attr("checked")) {
                            id = $(this).attr("alt");
                            downState = $(this).attr("downState");

                            //多选时用于取消多条记录
                            if (downState != "130" && downState != "5") {
                                ids = ids + id + ",";
                            }

                            if ($(this).is(':checked') == true) {
                                flag = true;
                            } else {
                                flag = false;
                            }
                        }

                    });

                    ids = ids.substring(0, ids.length - 1); //去掉最后面的逗号

                    if (flag) {
                        var param = {
                            url: "downFile15/cancelDownloadByIdIn?ids=" + ids,
                            dataType: "jsonp",
                            success: function (obj) {
                                if (obj.success) {
                                    findByDownState15(true);
                                    RTU.invoke("header.notice.show", "命令已下达！");
                                }
                            }
                        };
                        if (confirm("是否取消!")) {
                            $("input[name='check']").each(function () {
                                if ("checked" == $(this).attr("checked")) {
                                    var fName = $(this).attr("value"); //文件名
                                    var state = $(this).attr("downState");
                                    if (state == "130") {
                                        //                						alert(fName+"文件已经取消，不能重复操作");
                                        RTU.invoke("header.alarmMsg.show", fName + "文件已经取消，不能重复操作");
                                    } else if (state == "5") {
                                        //                						alert(fName+"文件已传输成功，不能取消");
                                        RTU.invoke("header.alarmMsg.show", fName + "文件已传输成功，不能取消");
                                    }
                                }
                            });
                            RTU.invoke("core.router.get", param);
                        }
                    } else {
                        RTU.invoke("header.notice.show", "请选择一个要取消的文件！");
                    }
                });

                //保存到本地
                $(".saveToLocal").click(function () {
                    var fileName = "";
                    var downState = "";
                    var arrays = []; //用于存储多条选中信息
                    $("input[name='check']").each(function () {
                        if ("checked" == $(this).attr("checked")) {
                            fileName = $(this).attr('value');
                            downState = $(this).attr("downState");
                            var arr = { "fileName": fileName, "downState": downState };
                            arrays.push(arr);
                        }
                    });

                    if (arrays.length != 0) {
                        for (var i = 0; i < arrays.length; i++) {
                            if ("" != arrays[i].fileName && "undefined" != typeof (arrays[i].fileName)) {
                                if (arrays[i].downState == "5") {
                                    window.location.href = "../downFile15/downLoadFile?fileName=" + encodeURI(arrays[i].fileName);
                                } else {
                                    RTU.invoke("header.notice.show", "文件未传输完成！");
                                }
                            } else {
                                RTU.invoke("header.notice.show", "请选择一个文件！");
                            }
                        }
                    } else {
                        RTU.invoke("header.notice.show", "请选择一个文件！");
                    }
                });

                //删除文件
                $(".deleteFile").click(function () {
                    var id = "";
                    var ids = "";
                    var downState = "";
                    var fileName = "";
                    var flag = false; //判断是否选中复选框
                    $("input[name='check']").each(function () {
                        if ("checked" == $(this).attr("checked")) {
                            id = $(this).attr("alt");
                            downState = $(this).attr("downState");
                            fileName = $(this).attr("value");

                            //多选时用于删除多条记录
                            if (downState == "130" || downState == "5") {
                                ids = ids + id + ",";
                            }

                            if ($(this).is(':checked') == true) {
                                flag = true;
                            } else {
                                flag = false;
                            }
                        }
                    });
 
                    ids = ids.substring(0, ids.length - 1);

                    if (flag) {
                        var param = {
                            url: "downFile15/deleteByIdIn?ids=" + ids,
                            dataType: "jsonp",
                            success: function (obj) {
                                if (obj.success) {
                                    findByDownState15(true);
                                    RTU.invoke("header.notice.show", "文件删除成功！");
                                }
                            }
                        };
                        if (confirm("是否删除!")) {
                            $("input[name='check']").each(function () {
                                if ("checked" == $(this).attr("checked")) {
                                    var state = $(this).attr("downState");
                                    if (state != "130" && state != "5") {
                                        //                						alert("有文件正在传输，请先取消");
                                        RTU.invoke("header.alarmMsg.show", "有文件正在传输，请先取消");
                                    }
                                }
                            });
                            RTU.invoke("core.router.get", param);
                        }
                    } else {
                        RTU.invoke("header.notice.show", "请选择一个要删除的文件！");
                    }

                });

                //查看文件
                $(".lookFile").click(function () {
                    var fileName = "";
                    var downState = "";
                    var i=0;
                    $("input[name='check']").each(function () {
                        if ("checked" == $(this).attr("checked")) {
                        	i++;
                            fileName = $(this).attr('value');
                            downState = $(this).attr("downState");
                        }
                    });
                    
                    if ("" != fileName && "undefined" != typeof (fileName)) {
                    	if(i==1){
                    		if(fileName.substr(fileName.length-4)==".dir"){
                    			RTU.invoke("header.notice.show", "不能解释目录文件！");
                    		}else{
	                    		if (downState == "5") {
	                                //弹出文件查看窗口
	                                //RTU.invoke("app.filetransfer.lookfile.init", data);
	                            	var arr=new Array();
	                    			arr.push(data);
	                    			arr.push(fileName);
	                    			//弹出文件查看窗口
	                    			RTU.invoke("app.filetransfer.lookfile.init",arr);
	                            } else {
	                                RTU.invoke("header.notice.show", "文件未下载完成！");
	                            }
                    		}                    		
                    	}else{
                    		RTU.invoke("header.notice.show", "只能选择一个文件！");
                    	}
                    } else {
                        RTU.invoke("header.notice.show", "请选择一个文件！");
                    }
                });

            }
            });
        };
    });

    var getHostType=function(value){
    	if(value==90)return "I系";
    	else if(value==165)return "II系";
    	return "未知";
    };
    
    //更新文件下载上半个列表的数据
    updateUpList15 = function (obj) {
        var d = obj.data;
        var table = $html.find(".commom-table-main-content-table");
        table.empty();

        var arr = [];
        for (var i = 0; i < d.length; i++) {
            var cls = "";
            if (selectedId == d[i].id) {
                cls = "visited";
            }

            //根据是否转存更改表中行的颜色
            if (d[i].isSave == "1") {
                arr.push("<tr id='" + d[i].id + "' class='" + cls + " green'>");
            }
            else {
                arr.push("<tr id='" + d[i].id + "' class='" + cls + " black'>");
            }

            arr.push("<td class='width-px-40' byteStr='" + d[i].byteStr + "' id='c_id'>" + i + "</td>");
            arr.push("<td class='width-px-40' id='c_version'>" + getHostType(d[i].version) + "</td>");
            arr.push("<td class='width-px-90' id='c_checiName'>" + d[i].checiName + "</td>");
            arr.push("<td class='width-px-90' id='c_driver'>" + d[i].driver + "</td>");
            arr.push("<td class='width-px-140' id='c_time'>" + d[i].time + "</td>");
            arr.push("<td class='width-px-210' id='c_filename'>" + d[i].filename + "</td>");
            arr.push("<td  id='c_filesize'>" + d[i].filesize + "</td></tr>");
        }
        table.append(arr.join(""));

        //更改一行的背景颜色
        $(".commom-table-main-content-table tr").click(function () {
            $(".commom-table-main-content-table tr").removeClass("visited");
            $(this).removeClass("visited").addClass("visited");

            selectedId = $(this).attr("id");

            //拿到选中的文件名及大小及十六进制字符串
            c_filename = $(".visited").find("#c_filename").html();
            c_filesize = $(".visited").find("#c_filesize").html();
            c_heXbyteStr = $(".visited").find("#c_id").attr("byteStr");
        });
    };

    //供findByDownState方法更新数据用
    var $buildItem1_15 = function (data, index) {
        this.$item = $(".filetransfer-tfoot1");
        this.$item.find("tr").attr("id", data.id);
        this.$item.find(".check").attr("alt", data.id);
        this.$item.find(".check").attr("downState", data.downState);
        this.$item.find(".check").attr("value", data.filename);
        this.$item.find("#s_id").html(index);
        this.$item.find("#s_filename").html(data.filename);
        this.$item.find("#s_startTime").html(data.time);
        this.$item.find("#s_finishTime").html(data.finishTime);
        this.$item.find("#s_checiName").html(data.checiName);
        this.$item.find("#s_downloadUsername").html(data.requestMode==0?data.sendUser:"自动下载");
        this.$item.find("#s_filesize").html(data.filesize);

        for (var i = 0; i < states.length; i++) {
            if (data.downState == states[i].transstateCode) {
                if (data.downState == "4" || data.downState == "48") {
                    var tlen = data.filesize;
                    var dlen = data.downlen;
                    if (dlen == "" || dlen == "null") {
                        dlen = 0;
                    }
                    if (tlen == "" || tlen == "null" || tlen == "0") {
                        tlen = 1;
                    }
                    var result = parseInt(parseFloat(dlen / tlen) * 100); //计算百分比
                    //		        	//显示进度条
                    this.$item.find("#s_downState").html(states[i].transstateDesc + "<div id='downloadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:30px;'>" +
		        			"<div id='downloadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
		        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                } else {
                    this.$item.find("#s_downState").html(states[i].transstateDesc);
                }
            }
        }
        return $(this.$item.html());
    };

    //刷新列表内容
    var refreshFiletransferList15 = function (data, index) {
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find(".check").attr("downState", data.downState);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find(".check").attr("value", data.filename);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find(".check").attr("alt", data.id);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_id").html(index);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_filename").html(data.filename);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_filesize").html(data.filesize);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_startTime").html(data.time);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_finishTime").html(data.finishTime);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_checiName").html(data.checiName);
        $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_downloadUsername").html(data.requestMode==0?data.sendUser:"自动下载");

        for (var i = 0; i < states.length; i++) {
            if (data.downState == states[i].transstateCode) {

                if (data.downState == "4" || data.downState == "48") {
                    var tlen = data.filesize;
                    var dlen = data.downlen;
                    if (dlen == "" || dlen == "null") {
                        dlen = 0;
                    }
                    if (tlen == "" || tlen == "null" || tlen == "0") {
                        tlen = 1;
                    }
                    var result = parseInt(parseFloat(dlen / tlen) * 100); //计算出百分比
                    //刷新进度条
                    $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_downState").html(states[i].transstateDesc + "<div id='downloadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:30px;'>" +
		        			"<div id='downloadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;left:10px;'></div>" +
		        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                } else {
                    $(".filetransfer-tbody1").find("tr[id='" + data.id + "']").find("#s_downState").html(states[i].transstateDesc);
                }
            }
        }
    };

    //加载下载状态记录的共用方法
    var findByDownState15 = function (empty) {
        if (empty) {
            $(".filetransfer-tbody1").empty();
        }
        var cd = clickData;
        var param = {
            //    			url: "downFile/findAllByPage?page="+currentPage+"&pageSize=" + pageSize,
            url: "downFile15/findByLocoTypeAndLocoNoAndLocoAb?page=" + currentPage + 
            "&pageSize=" + pageSize + "&locoTypeid=" + cd.locotypeid + "&locoNo=" + 
            cd.locono + "&locoAb=" 
            + cd.locoAb+($("#showAutoDownLoad").attr("checked")?"&autoDownFlag=1":""),
            //    			url: "downFile/findAllByPage?locoTypeid="+cd.locotypeid+"&locoNo="+cd.locono+"&locoAb="+cd.locoAb,
            dataType: "jsonp",
            success: function (obj) {
                var d = obj.data;

                if (empty) {
                    $(".filetransfer-tbody1").empty();
                }
                var curIndex=(currentPage-1)*pageSize;
                //拿到数初始化或刷新下半部分列表
                for (var i = 0; i < d.length; i++) {
                    var temp = curIndex+parseInt(i) + 1;
                    var idTemp = $(".filetransfer-tbody1").find("tr[id='" + d[i].id + "']");
                    if (idTemp.attr("id") != null) {
                        refreshFiletransferList15(d[i], temp);
                    } else {
                        $(".filetransfer-tbody1").append(new $buildItem1_15(d[i], temp));
                    }
                }
                if (obj.totalPage != undefined) {
                    totalPage = obj.totalPage;
                }
                currentPage == totalPage ? $(".download-page-next-page").css("color", "#7d7d7d") : $(".download-page-next-page").css("color", "#3300FF");
                currentPage == 1 ? $(".download-page-pre-page").css("color", "#7d7d7d") : $(".download-page-pre-page").css("color", "#3300FF");
                $(".download-page-first-page").css("color", "#3300FF");
                $(".download-page-last-page").css("color", "#3300FF");
                $(".download-page-turn-page").css("color", "#3300FF");
                $(".download-page-current-page").html(currentPage + "/" + totalPage);
                
              //点击行选中
                $("#filedownload-table tbody tr").unbind("click").click(function(){
                	 var tdTe=$(this).children().children().eq(0);
 	            	 if (!$(tdTe).attr("checked")) {
 	            		 $(tdTe).attr("checked","checked");
 	                 }else if ($(tdTe).attr("checked")) {
 	                	 $(tdTe).removeAttr("checked");
 	                 }
 	            	
                });
            }
        };
        RTU.invoke("core.router.get", param);

        //每刷新一次就请求后台是否有最新文件需要更新上半部分列表
        var param = {
            url: "downFile15/updateDownStateCode?locoTypeid=" + cd.locotypeid + "&locoNo=" + cd.locono + "&locoAb=" + cd.locoAb,
            dataType: "jsonp",
            success: function (obj) {
                if (obj.success && obj.data != null) {
                    //更新上半部分列表
                    updateUpList15(obj);

                  /*  //机车文件目录名
                    $(".requestDirectoryFile").html(obj.data[0].newFileName || "");
                    //目录时间
                    $(".requestDirectoryTime").html(obj.data[0].newFileDate || "");*/
                  //机车文件目录名
                    $(".requestDirectoryFile").html((obj.data[0].newFileDate?(obj.data[0].newFileDate):"")+(obj.data[0].newFileName?("("+obj.data[0].newFileName+")"):""));
                }
            }
        };
        RTU.invoke("core.router.get", param);
    };

    //加载下载状态为完成的记录
    RTU.register("app.realtimelocomotivequery.loadSucceedTab15", function () {
        return function () {
            findByDownState15(true); //刷新列表
            setTimeout(function () { }, 500);
            window.fileDownTimer = setInterval(function () { findByDownState15(false); }, 3000);

        };
    });

    //文件下载分页
    RTU.register("app.download.page.init15", function () {
        var initEvent = function () {
            $(".download-page-first-page").click(function () {
                if (currentPage == 1) {
                    return;
                }
                currentPage = 1;
                findByDownState15(true);
            });
            $(".download-page-pre-page").click(function () {
                if (currentPage == 1) {
                    return;
                }
                currentPage > 1 ? currentPage = parseInt(currentPage) - 1 : currentPage = 1;
                currentPage == 1 ? $(this).css("color", "#7d7d7d") : $(this).css("color", "#3300FF");
                findByDownState15(true);
            });
            $(".download-page-turn-page").click(function () {
                if ($(".download-page-turn-page-input").val() == "") {
                    return;
                }
                ($(".download-page-turn-page-input").val() > 1 && $(".download-page-turn-page-input").val() < totalPage) ? currentPage = $(".download-page-turn-page-input").val() : ($(".download-page-turn-page-input").val() <= 1 ? currentPage = 1 : currentPage = totalPage);
                findByDownState15(true);
            });
            $(".download-page-next-page").click(function () {
                if (currentPage == totalPage) {
                    return;
                }
                currentPage < totalPage ? currentPage = parseInt(currentPage) + 1 : currentPage = totalPage;
                currentPage == totalPage ? $(this).css("color", "#7d7d7d") : $(this).css("color", "#3300FF");
                findByDownState15(true);
            });
            $(".download-page-last-page").click(function () {
                if (currentPage == totalPage) {
                    return;
                }
                currentPage = totalPage;
                findByDownState15(true);
            });
            $(".download-page-select").change(function () {
                currentPage = 1;
                pageSize = parseInt($(".download-page-select").val());
                findByDownState15(true);
            });
        };
        return function () {
            initEvent();
        };
    });

    //加载文件传输全部状态
    RTU.register("app.filetransfer.transstate.init15", function () {
        var param = {
            url: "downFile15/findAllTransstateCode",
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

    //清空后台最新时间
    var emptyNewDate15 = function () {
        var param = {
            url: "downFile15/emptyNewDate",
            dataType: "jsonp",
            success: function (obj) {
            }
        };
        RTU.invoke("core.router.get", param);
    };

    //加载数据并初始化窗口和事件
    RTU.register("app.realtimelocomotivequery.loadHtml15", function () {
        return function (data) {
            if (data && data.url) {
                //当文件传输全部状态为空时才加载
                if (states.length == 0) {
                    RTU.invoke("app.filetransfer.transstate.init15"); //加载文件传输全部状态
                }
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                            //清空后台最新时间
                            emptyNewDate15();

                            //刷新列表
                            //findByDownState15(true);
                        }
                    }
                });
            }
        };
    });

    RTU.register("app.filedownload.result.deactivate15", function () {
        return function () {
            if (window.popuwnd_file) {
                window.popuwnd_file.close();
                if(window.fileDownTimer)
            		clearInterval(fileDownTimer); //窗口关闭时清除3秒刷新
            }
        };
    });

});