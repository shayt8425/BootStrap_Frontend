RTU.DEFINE(function (require, exports) {
/**
 * 模块名：请求命令-result
 * name： orderRequest
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/app-filetransfer.css");

    var $requestHtml;
    /*var window.setuploadtimer; //5秒刷新用
*/    var currentPage = 1;
    var pageSize = 15;
    var totalPage = 1;
    var states = []; //存放文件传输的全部状态
    var checkedData = ""; //选中的数据
    var currClickData; //tsc单击上传上部分列表选中的数据
    var parentObjClass=".orderRequest-main-div";//当前父亲div的样式名
    var checkedTr=[];//记录选 中的行
    //显示详细窗口
    RTU.register("app.filemanager.showOrdRequestWin", function () {
        return function (data) {
            RTU.invoke("app.filemanger.ordrequest.createwin", data);
            checkedData = "";
            for (var i = 0; i < data.length; i++) {
                checkedData += data[i] + ";";
            }
            checkedData = checkedData.substring(0, checkedData.length - 1);
        };
    });

    //创建查询窗口
    RTU.register("app.filemanger.ordrequest.createwin", function () {
        return function (data) {
            //查询窗口
            RTU.invoke("app.filemanger.ordrequest.loadHtml", { url: "../app/modules/filemanager/app-filemanager-rightclick-ordrequest.html", fn: function (html) {
                $requestHtml = $(html);
                clearInterval(window.setuploadtimer); //窗口打开时清除5秒刷新
                if (window.popuwnd_file) {
                    window.popuwnd_file.close(); //原本存在的窗口需要销毁，然后重新更新窗口的标题
                }
                window.popuwnd_file = new PopuWnd({
                    title: "请求命令",
                    html: $requestHtml,
                    width: 820,
                    height: 520,
                    left: 380,
                    top: 60,
                    shadow: true
                });

                window.popuwnd_file.init();

                window.popuwnd_file.$wnd.find(".popuwnd-title-del-btn").click(function () {
                	checkedTr=[];
                    clearInterval(window.setuploadtimer); //窗口打开时清除5秒刷新
                });
                inputName=null;
                parentObjClass=null;
                currentPage=currentLkjPage=1;
                pageSize=lkjPageSize=15;
                return window.popuwnd_file;

            }, initEvent: function () {
                RTU.invoke("app.upload.page.init"); //分页
                RTU.invoke("app.filemanager.updateuploadlist", data); //加载上传列表
                //请求命令
                $(".requestOrdDiv").unbind("click").bind("click",function () {
                	if($("#requestTypeSel").val()==""){
                		RTU.invoke("header.notice.show","请选择命令类型");
                		return;
                	}
                	var pData={};
                	pData.requestCode=$("#requestTypeSel").val();
                	if(pData.requestCode=="1"){
                		pData.frequency=$("#sendFreqTxt").val();
                		if(isNaN(pData.frequency)){
                			RTU.invoke("header.notice.show","请输入数字");
                			$("#sendFreqTxt").focus();
                			return;
                		}
                		else if(pData.frequency<3||pData.frequency>300){
                			RTU.invoke("header.notice.show","请输入3~300之间的数字");
                			$("#sendFreqTxt").focus();
                			return;
                		}
                		pData.lastMinutes=$("#lastMinTxt").val();
                		if($.trim(pData.lastMinutes)!=""&&isNaN(pData.lastMinutes)){
                			RTU.invoke("header.notice.show","请输入数字");
                			$("#lastMinTxt").focus();
                			return;
                		}
                		else if($.trim(pData.lastMinutes)!=""&&pData.lastMinutes>4294967295){
                			RTU.invoke("header.notice.show","输入数字太大");
                			$("#lastMinTxt").focus();
                			return;
                		}
                		pData.deviceNo="1";
                		pData.infoType="4";
                		if($.trim(pData.lastMinutes)=="0")
                			pData.lastMinutes="";
                	}
                	else if(pData.requestCode=="7"){
                		pData.restReason="2";
                	}
                	if(!window.confirm("确认向车载发送请求?")){
                		return;
                	}
                	pData.locoStr="";
                	for(var i=0;i<locoStr.length;i++){
                		var arr=locoStr[i].split(",");
                		if(i==locoStr.length-1)
                			pData.locoStr+=arr[0]+","+arr[2]+","+arr[5];
                		else pData.locoStr+=arr[0]+","+arr[2]+","+arr[5]+";";
                	}
                	pData.deviceId="9";
                	
                	pData.userName=RTU.data.user.realName;
                	
                	var param={
  			              url: "requestOrder/addOrders",
  			              async:true,
  			              data:pData,
  		                  success: function (resData) {
  		                	  if(resData&&resData.success){
  		                		findByUpLoadState(true);
  		                	  }
  		                	  else{
  		                		 alert("后台发生了异常,错误信息:"+resData.msg); 
  		                	  }
  		                  },
  		                  error: function (e) {
  		                	 alert("调用错误!");
  		                  }
  						};
  				 RTU.invoke("core.router.post", param);
                });
                $("#requestTypeSel").unbind("change").bind("change",function () {
                	if($(this).val()=="1")
                		$(".upload-div th,td").removeClass("hidden");
                	else $(".upload-div .spec").addClass("hidden");
                	findByUpLoadState(true);
                });
            }
            });
        };
    });

    var locoStr;
    //更新上传列表
    RTU.register("app.filemanager.updateuploadlist", function () {
        //遍历数据并更新上传列表上半部分的数据
        var updateUpList = function (data,curParentObjClass) {
        	locoStr=data;
        	var upDatas = [];
            for (var i = 0; i < data.length; i++) {
                var upData = data[i].split(",");
                var temp = { id: i + 1, locoTypeid: upData[0], 
                		locoTypeName: upData[1], locoNo: upData[2], 
                		loco: upData[3], juduan: upData[4], locoAb: upData[5]
                		,isOnline:upData[6]};
                upDatas.push(temp);
            }
            /*var flag=curParentObjClass==".orderRequest-main-div";*/
            if ($(".upfile_result_div",curParentObjClass).length == 0) {
            	$(".upfile-up-div",curParentObjClass).
                append('<div class="upfile_result_div"><div id="upfile_result_div_grid"></div></div>');
            }
            
            var g = new RTGrid({
                containDivId: "upfile_result_div_grid",
                datas: upDatas,
                tableWidth: 755,
                tableHeight: 180,
                hasCheckBox: false,
                showTrNum: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
     				that.pageSize =3000;
     			},
                isShowPagerControl: false,
                clickTrEvent: function (d) {
                    $(".orderRequest-tbody2",curParentObjClass).empty(); //单击前清空上传窗口的下部分列表
                    if (window.setuploadtimer != "undefined") {
                        clearInterval(window.setuploadtimer); //清除5秒刷新
                    }
                    //拿到点击的数据
                    var fd = g.currClickItem().data;
                    currClickData = fd;
                    findByUpLoadState(true); //刷新下方列表
                    RTU.invoke("app.filemanager.findByUpLoadState"); //加载上传完成的记录
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
        };
        return function (data) {
            //如果没选中任何机车，则关闭窗口
            if (data.length == 0) {
                if (window.popuwnd_file) {
                    window.popuwnd_file.close();
                }
            }
            updateUpList(data,".orderRequest-main-div");
        };
    });

  
    
    //更新数据用
    var $buildItem2 = function (data, index) {
    	
    	this.$item = $(".orderRequest-tfoot2",parentObjClass);
    	
   	 	for(var i=0;i<checkedTr.length;i++){
            if(checkedTr[i]==data.id){
           	 this.$item.find(".u_check").attr("checked","checked");
    	   }
        }
    	
        this.$item.find("tr").attr("id", data.id);
        
        this.$item.find("#u_id").html(index);
        this.$item.find("#u_sendUser").html(data.sendUser);
        this.$item.find("#u_time").html(data.time);
        this.$item.find("#e_time").html(data.finishTime);
        this.$item.find("#u_frameNo").html(data.infoFrameNo);
        this.$item.find("#u_requestCode").html($("#requestTypeSel option[value='"+data.requestCode+"']").html());
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

            	if(states[i].transstateCode!="4"){
            		this.$item.find("#u_upState").html(states[i].transstateDesc);
            	}
            	else{
            		this.$item.find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
            	}
            }
        }
        return $(this.$item.html());
    };

    //刷新列表内容
    var refreshUploadDownList = function (data, index) {
        for (var i = 0; i < states.length; i++) {
            if (data.upState == states[i].transstateCode) {
                $(".orderRequest-tbody2",parentObjClass).
                find("tr[id='" + data.id + "']").find(".u_check").attr("alt", data.id);
                $(".orderRequest-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("upState", data.upState);
                $(".orderRequest-tbody2").find("tr[id='" + data.id + "']").find(".u_check").attr("value", data.filename);

                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_id").html(index);
                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_sendUser").html(data.sendUser);
                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_time").html(data.time);
                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#e_time").html(data.finishTime);
                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_frameNo").html(data.infoFrameNo);
                $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_requestCode")
                .html($("#requestTypeSel option[value='"+data.requestCode+"']").html());
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

                	$(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").
                    find("#u_upState").html(states[i].transstateDesc + "<div id='uploadBox' style='float:left;width:100px;height:12px;border:1px solid;margin-left:15px;'>" +
		        			"<div id='uploadBar' style='float:left;width:" + result + "px;height:12px;border:0px;background:#90ee90;text-align:center;'></div>" +
        					"<div style='position:absolute;margin-left:42px;'>" + result + "%</div></div>");
                } else {
                	$(".orderRequest-tbody2",parentObjClass).find("tr[id='" + data.id + "']").find("#u_upState").html(states[i].transstateDesc);
                }
            }
        }
    };

    //加载上传状态为完成的记录的共用方法
    var findByUpLoadState = function (empty) {
        if (empty) {
            $(".orderRequest-tbody2",parentObjClass).empty();
        }
        //currClickData为undefined的话说明没选中则不查询对应历史记录
        if (currClickData != undefined) {
            //    		var url = "upFile/findOneByHistory?locoTypeid="+currClickData.locoTypeid+"&locoNo="+currClickData.locoNo+"&locoAb="+currClickData.locoAb;
            var url = "requestOrder/findOneByHistory?page=" + currentPage + "&pageSize="
            + pageSize + "&locoTypeid=" + currClickData.locoTypeid + "&locoNo=" +
            currClickData.locoNo + "&locoAb=" + currClickData.locoAb+"&deviceId=9"
            +($("#requestTypeSel").val()==""?"":("&requestCode="+$("#requestTypeSel").val()));
            var param = {
                //    			url: "upFile/findAllByPage?page="+currentPage+"&pageSize=" + pageSize,
                url: encodeURI(url),
                dataType: "jsonp",
                success: function (obj) {
                    var d = obj.data;
                    if (empty) {
                        $(".orderRequest-tbody2",parentObjClass).empty();
                    }
                    for (var i = 0; i < d.length; i++) {
                        var idTemp = $(".orderRequest-tbody2",parentObjClass).find("tr[id='" + d[i].id + "']");
                        if (idTemp.attr("id") != null) {
                            refreshUploadDownList(d[i], i + 1);
                        } else {
                        	this.$item = $(".orderRequest-tfoot2",parentObjClass);
                            $(".orderRequest-tbody2",parentObjClass).append(new $buildItem2(d[i], i + 1));
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
                    }
                    
                    /*//点击行选中
                    $("#orderRequest-table tbody tr").unbind("click").click(function(){
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
                    });*/
                }
            };
            RTU.invoke("core.router.get", param);
        }
    };

    //加载上传状态为完成的记录
    RTU.register("app.filemanager.findByUpLoadState", function () {
        return function () {
            window.setuploadtimer = setInterval(function () {
                findByUpLoadState(false);
            }, 5000);
        };
    });

    //文件上传分页
    RTU.register("app.upload.page.init", function () {
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
                currentPage == 1 ? $(".upload-page-pre-page",parentObjClass).css("color", "#7d7d7d") :
                	$(".upload-page-pre-page",parentObjClass).css("color", "#3300FF");
                findByUpLoadState(true);
            });
            $(".upload-page-turn-page").click(function () {
            	if ($(".upload-page-turn-page-input",parentObjClass).val() == "") {
                    return;
                }
                ($(".upload-page-turn-page-input",parentObjClass).val() > 1 &&
                		$(".upload-page-turn-page-input",parentObjClass).val() < totalPage) 
                ? currentPage = $(".upload-page-turn-page-input",parentObjClass).val() : 
                	($(".upload-page-turn-page-input",parentObjClass).val() <= 1 ? currentPage = 1 : currentPage = totalPage);
                findByUpLoadState(true);
            });
            $(".upload-page-next-page").click(function () {
            	if (currentPage == totalPage) {
                    return;
                }
                currentPage < totalPage ? currentPage = parseInt(currentPage) + 1 : currentPage = totalPage;
                currentPage == totalPage ? $(".upload-page-next-page",parentObjClass).css("color", "#7d7d7d") 
                		: $(".upload-page-next-page",parentObjClass).css("color", "#3300FF");
            
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
                pageSize = parseInt($(".upload-page-select",parentObjClass).val());
            
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
    RTU.register("app.filemanger.ordrequest.loadHtml", function () {
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

    RTU.register("app.orderRequest.result.deactivate", function () {
        return function () {
            if (window.popuwnd_file) {
                window.popuwnd_file.hidden();
                //				$requestHtml.find(".orderRequest-tbody2").empty();//清空下半部分列表
                clearInterval(window.setuploadtimer); //其它页面切换窗口时清除5秒刷新
                checkedTr=[];
            }
        };
    });

});