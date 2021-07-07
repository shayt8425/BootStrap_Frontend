RTU.DEFINE(function (require, exports) {
/**
 * 模块名：TSC设备历史查询
 * name：tscequipmenthistoryquery
 * date:2015-2-12
 * version:1.0 
 */
    require("My97DatePicker/WdatePicker.js");
    require("app/loading/list-loading.js");
   
    
    
    var $html;
    var popuwnd;
    var data;
    var radioTscFlag = "";
    //加载查询页面，得到页面对象
    RTU.register("app.tscequipmenthistoryquery.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/tscequipmenthistoryquery/app-locoquery-tscequipmenthistoryquery.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                }
                //智能搜索框
                RTU.invoke("app.tscequipmenthistoryquery.query.searchzhineng");
                
                //初始化，默认模式一
                $("input[value='TscStatusHisM1']").attr("checked", "checked");
                //构建查询条件对象
                var optionFn = function () {
                	var locoNoStr=$(".tscequipmenthistory_locoNo-input").val();
                	var locoAbStr="";
                	var indexLast=locoNoStr.substr(locoNoStr.length-1,locoNoStr.length);
                	var locoNo="";
                	if(isNaN(indexLast)){  //isNaN()的意思是非数字
                		locoNo=locoNoStr.substr(0,locoNoStr.length-1);
                		if(indexLast == "A"){
                			locoAbStr="1";
                		}else if(indexLast == "B"){
                			locoAbStr="2";
                		}
//                		else{
//                			locoAbStr="0";
//                		}
                	}else{
                		locoNo=locoNoStr;
                	}
                    var option = {
                        optionValue: radioTscFlag == "" ? $("input[checked='checked']", $(".tscmodel-container")).val() : radioTscFlag,
                        deptName: $(".tscequipmenthistory_deptName-input").val(),
                        locoNo: locoNo,
                        locoAb:locoAbStr,
                        locoTypeName: $(".tscequipmenthistory_locoTypeName-input").val(),
                        beginTime: $(".tscequipmenthistory_beginTime-input").val(),
                        endTime: $(".tscequipmenthistory_endTime-input").val()
                    };
                    return option;
                };
                //首次加载数据
                var first = false;
                var option1 = new optionFn();
                option1.deptName = "1a&1";
                RTU.invoke("app.tscequipmenthistoryquery.checkProperty.isOrNotShow", option1);
                //查询点击事件
                $("#loco-tsc-query-btn").click(function () {
                    first = true;
                    var option = new optionFn();
                    RTU.invoke("app.tscequipmenthistoryquery.checkProperty.isOrNotShow", option);
                });
                //模式单选事件
                $("input[name='tscmodel']").click(function () {
                    $("input[name='tscmodel']").removeAttr("checked");
                    $(this).attr("checked", "checked");
                    var option = new optionFn();
                    if (first) {
                        option.optionValue = $(this).val();
                    }
                    else {
                        option.optionValue = $(this).val();
                        option.deptName = "1a&1";
                    }
                    RTU.invoke("app.tscequipmenthistoryquery.checkProperty.isOrNotShow", option);
                });
            }
        });
        return function () {
            return true;
        };
    });
    
    
    
    RTU.register("app.tscequipmenthistoryquery.query.searchzhineng", function () {
    	 //局段
        var initdepotStrAuto = function () {
        	depotStrExParams = {
        		shortname:$('.tscequipmenthistory_deptName-input').val(),
        	};
        	depotStrParse = function (data) {
        		ff=true;
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
//        	http://localhost:8080/traingeo-deployer/depot/findByShortname?shortname=%E5%93%88&callback=
//        	http://localhost:8080/traingeo-deployer/traintype/searchByLocoTypeAndLocoNo?shortName=DF11&locoNo=0237
        	
        	autocompleteBuilder($(".tscequipmenthistory_deptName-input"), "depot/findByShortname", depotStrExParams, depotStrParse);
        	try {
        		$('.tscequipmenthistory_deptName-input').result(function (event, autodata, formatted) {
        			$('.tscequipmenthistory_deptName-input').val(formatted);
        		});
        	}
        	catch (e) {
        	}
        };
        
        //机车型号
        var inittypenameStrAuto = function () {
        	loconameStrExParams = {
        		shortName:$('.tscequipmenthistory_locoTypeName-input').val(),
        		locoNo:'',
        	};
        	loconameStrParse = function (data) {
        		
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text = replacelocoTypeNameSpace(data[i]);
                    rows[rows.length] = {
                        data: text,
                        value: text,
                        result: text
                    };
                }
                return rows;
        	};
//        	http://localhost:8080/traingeo-deployer/depot/findByShortname?shortname=%E5%93%88&callback=
//        	http://localhost:8080/traingeo-deployer/traintype/searchByLocoTypeAndLocoNo?shortName=DF11&locoNo=0237
        	
        	autocompleteBuilder($(".tscequipmenthistory_locoTypeName-input"), "traintype/searchByLocoTypeAndLocoNo", loconameStrExParams, loconameStrParse);
        	try {
        		$('.tscequipmenthistory_locoTypeName-input').result(function (event, autodata, formatted) {
        			$('.tscequipmenthistory_locoTypeName-input').val(formatted);
        		});
        	}
        	catch (e) {
        	}
        };
        
        
      //机车号
        var initloconoStrAuto = function () {
        	loconoStrExParams = {
        		locoNo:$('.tscequipmenthistory_locoNo-input').val(),
//        		shortName:'',
        	};
        	loconoStrParse = function (data) {
        		
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text1 = replacelocoNoSpace(data[i]);
                    var text2 = replacelocoAbSpace(data[i]);
                    if(text2 !="1"&&text2!="2"){
                      	text2="";
                      }else if(text2 == '1'){
                      	text2="A";
                      }else{
                      	text2="B";
                      }
                   var text = text1 + text2;
                    rows[rows.length] = {
                        data: text,
                        value: text+"_"+data[i].locoAb,
                        result: text
                    };
                }
                return rows;
        	};
//        	http://localhost:8080/traingeo-deployer/depot/findByShortname?shortname=%E5%93%88&callback=
//        	http://localhost:8080/traingeo-deployer/traintype/searchByLocoTypeAndLocoNo?shortName=DF11&locoNo=0237
        	
        	autocompleteBuilder($(".tscequipmenthistory_locoNo-input"), "traintype/searchByLocoNo", loconoStrExParams, loconoStrParse);
        	try {
        		$('.tscequipmenthistory_locoNo-input').result(function (event, autodata, formatted) {
        			if(formatted){
        				var arr=formatted.split("_");
        				if(arr.length>1){
        					$('.tscequipmenthistory_locoNo-input').val(arr[0]);
        					$('.tscequipmenthistory_locoNo-input').attr("locoAb",arr[1]);
        				}
        				else $('.tscequipmenthistory_locoNo-input').val(formatted);
        			}
        		});
        	}
        	catch (e) {
        	}
        };
        
        var replaceSpace = function (obj) {
            if (obj.text) {
                var reg = /\s/g;
                return obj.text.replace(reg, "");
            } else {
                return "";
            }
        };
        
        var replacelocoTypeNameSpace = function (obj) {
            if (obj.locoTypeName) {
                var reg = /\s/g;
                return obj.locoTypeName.replace(reg, "");
            } else {
                return "";
            }
        };
        
        var replacelocoNoSpace = function (obj) {
            if (obj.locoNo) {
                var reg = /\s/g;
                return obj.locoNo.replace(reg, "");
            } else {
                return "";
            }
        };
        var replacelocoAbSpace = function (obj) {
            if (obj.locoAb) {
                var reg = /\s/g;
                return obj.locoAb.replace(reg, "");
            } else {
                return "";
            }
        };
        return function () {
        	$(".tscequipmenthistory_deptName-input").inputTip({ text: "" });
            $(".tscequipmenthistory_locoTypeName-input").inputTip({ text: "" });
            $(".tscequipmenthistory_locoNo-input").inputTip({ text: "" });
            
            initdepotStrAuto();
		
			inittypenameStrAuto();
		
			initloconoStrAuto();
			
			$(".wrapTipDiv",$(".content-tscequipmenthistory-tab3-condition-cell")).css("display","inline-block");
        };
    });
    
    
    
  //显示智能搜提示
    var autocompleteBuilder = function (object, url, exParams, parse) {
    	try {
    		url = "../" + url;                
    		
    		object.autocomplete(url, {
    			minChars: 0,
    			width: 156,
    			matchContains: true,
    			autoFill: false,
    			max: 100,
    			dataType: "jsonp",
    			extraParams: exParams,
    			parse: parse,
    			formatItem: function (item) {
    				return item;
    			},
    			formatResult: function (format) {
    				return format;
    			}
    		});
    	} catch (e) {
    	}
    };
    
   
    
    
    ////////TSC设备历史查询窗口初始化
    RTU.register("app.tscequipmenthistoryquery.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
        	var Resolution=getResolution();
			var width=Resolution.Twidth-140;
			var height=Resolution.Theight-60;
        	
            if (!popuwnd) {
//                var winWidth = document.documentElement.clientWidth;
                popuwnd = new PopuWnd({
                    title: "TSC设备历史查询",
                    html: $html,
//                    width: winWidth * 0.8,
                    //width: 890,
//                    height: 530,
                    width: width ,
                    height:height ,
                    left: 135,
                    top: 60,
                    shadow: true
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
            } else {
                popuwnd.init();
//                var winWidth = document.documentElement.clientWidth;
//                $(".loco-tscequipmenthistory-query-title-div").parents(".popuwnd").css({ "width": winWidth * 0.8 });
                $(".loco-tscequipmenthistory-query-title-div").css( "width",width);
                $("#loco-tsc-query-btn").click();
            }
        };
    });
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
    
    
    ///检测要显示的字段
    var strExist = "";
    RTU.register("app.tscequipmenthistoryquery.checkProperty.isOrNotShow", function () {
        var checkFn = function (options) {
            $.ajax({
                url: "../syssetting/findByProperty?userid=" + RTU.data.user.id + "&options=" + options.optionValue + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (data) {
                    strExist = data.data.optionvalue;
                    var arrCol = [];
                    var arrName = [];
                    var array = [{ field: "recId", name: "记录ID", width: "80px" }, { field: "receiveTime", name: "记录处理时间", width: "130px" }
								, { field: "locoTypeid", name: "机车型号", width: "80px" }, { field: "locoNo", name: "机车号", width: "60px" }
							    , { field: "locoAb", name: "A/B节", width: "60px" }, { field: "locoIp", name: "机车ip", width: "60px" }
							    , { field: "deptId", name: "机车所属段", width: "100px" }, { field: "frameNo", name: "帧序号", width: "60px" }
							    , { field: "appType", name: "应用类型", width: "80px" }, { field: "transType", name: "传输通道类型", width: "120px" }
							    , { field: "proVer", name: "协议版本号", width: "100px" }, { field: "infoVer", name: "信息版本号", width: "100px" }
							    , { field: "infoFrameNo", name: "信息帧序号", width: "100px" }, { field: "lkjTime", name: "lkj主机时间", width: "130px" }
							    , { field: "deviceCorp", name: "厂家", width: "40px" }, { field: "tscType", name: "车载型号", width: "80px" }
							    , { field: "mainSoftver", name: "软件主版本号", width: "120px" }, { field: "subSoftver", name: "软件次版本号", width: "120px" }
							    , { field: "cpuTemp", name: "CPU温度", width: "80px" }, { field: "can0Use", name: "CAN0通道是否有效", width: "130px" }
							    , { field: "can0State", name: "CAN0通道状态", width: "130px" }, { field: "can1Use", name: "CAN1通道是否有效", width: "130px" }
							    , { field: "can1State", name: "CAN1通道状态", width: "130px" }, { field: "can2Use", name: "CAN2通道是否有效", width: "130px" }
							    , { field: "can2State", name: "CAN2通道状态", width: "130px" }, { field: "can3Use", name: "CAN3通道是否有效", width: "130px" }
							    , { field: "can3State", name: "CAN3通道状态", width: "130px" }, { field: "eth0Use", name: "ETH0通道是否有效", width: "130px" }
							    , { field: "eth0State", name: "ETH0通道状态", width: "130px" }, { field: "eth1Use", name: "ETH1通道是否有效", width: "130px" }
							    , { field: "eth1State", name: "ETH1通道状态", width: "130px" }, { field: "eth2Use", name: "ETH2通道是否有效", width: "130px" }
							    , { field: "eth2State", name: "ETH2通道状态", width: "130px" }, { field: "eth3Use", name: "ETH3通道是否有效", width: "130px" }
							    , { field: "eth3State", name: "ETH3通道状态", width: "130px" }, { field: "gpsState", name: "GPS模块状态", width: "100px" }
							    , { field: "wlanState", name: "WLAN网卡状态", width: "130px" }, { field: "com1State", name: "通信模块1状态", width: "120px" }
							    , { field: "com2State", name: "通信模块2状态", width: "130px" }, { field: "locoTypeShortName", name: "机车型号简称", width: "100px" }
							    , { field: "deptShortName", name: "段简称", width: "60px"}];
                    var showArr = [];
                    for (var i = 0; i < array.length; i++) {
                        if (strExist.indexOf(array[i]["field"]) != -1) {

                            showArr.push({ field: array[i]["field"], name: array[i]["name"], width: array[i]["width"] });
                        }
                    }
                    var countLocoNo=0;
                    var tt=null;
                    $.each(strExist.split(","), function (i, item) {
                        $.each(showArr, function (i, item1) {
                            if (item == item1.field) {
                            	countLocoNo++;
                                var o1 = { name: item1.field, isSort: true, width: item1.width };
                                if(item1.field=="locoNo"){
                                	tt=countLocoNo;
                                }
                                arrCol.push(o1);
                                arrName.push(item1.name);
                            }
                        });
                    });
                    var o = { col: arrCol, name: arrName };
                    $("#tsc-gridId").html("");
                    
                    var Resolution=getResolution();
        			var width=Resolution.Twidth-160;
        			var height=Resolution.Theight-210;
                    
                    if(tt>0){
                	  var g = new RTGrid({
                          url: "../tscStatusHis/findTSCStatusByPropertyTOHistory?deptName=" + options.deptName + "&locoNo=" + options.locoNo + "&locoTypeName=" + options.locoTypeName + "&locoAb="+options.locoAb+"&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                          containDivId: "tsc-gridId",
//                          tableWidth: 870,
//                          tableHeight: 400,
                          tableWidth: width,
                 		tableHeight: height,	
                          hasCheckBox: false, //是否有checkbox
                          showTrNum: true, //是否显示行号
                          isSort: true, //是否排序
                          colNames: o.name, //arry=["姓名","性别"]
                          colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px",isSort:true}]
                          replaceTd: [ { index: tt-1, fn: function (data, j, ctd, itemData) {
                        	 if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                         		return data;
                             } else if (itemData.locoAb == "1") {
                         		return data + window.locoAb_A;
                             } else {
                         		return  data+ window.locoAb_B;
                             }
                         }}],
                          loadPageCp: function (t) {
                              t.cDiv.css({ "left": "210px", "top": "330px", width: t.cDiv.parent(".popuwnd-main").width() - 20 });
                          }
                      });
                    }else{
                	  var g = new RTGrid({
                          url: "../tscStatusHis/findTSCStatusByPropertyTOHistory?deptName=" + options.deptName + "&locoNo=" + options.locoNo + "&locoTypeName=" + options.locoTypeName + "&locoAb="+options.locoAb+"&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                          containDivId: "tsc-gridId",
//                          tableWidth: 870,
//                          tableHeight: 400,
                          tableWidth: width,
                     		tableHeight: height,
                          hasCheckBox: false, //是否有checkbox
                          showTrNum: true, //是否显示行号
                          isSort: true, //是否排序
                          colNames: o.name, //arry=["姓名","性别"]
                          colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px",isSort:true}]
                          replaceTd: [ { index: tt-1, fn: function (data, j, ctd, itemData) {
                         	 if (itemData.locoAb !="1"&&itemData.locoAb!="2") {
                          		return data;
                              } else if (itemData.locoAb == "1") {
                          		return data + window.locoAb_A;
                              } else {
                          		return  data+ window.locoAb_B;
                              }
                          }}],
                          loadPageCp: function (t) {
                              t.cDiv.css({ "left": "210px", "top": "330px", width: t.cDiv.parent(".popuwnd-main").width() - 20 });
                          }
                      });
                    }
                  
                }
            });
        };
        return function (options) {
            checkFn(options);
        };
    });
    ///////关闭TSC设备历史查询窗口
    RTU.register("app.tscequipmenthistoryquery.result.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    //////用户权限验证
    RTU.register("app.tscequipmenthistoryquery.query.init", function () {
        data = RTU.invoke("app.setting.data", "tscequipmenthistoryquery");
        if (data && data.isActive) {
            RTU.invoke("app.tscequipmenthistoryquery.query.activate");
        }
        return function () {
            return true;
        };
    });
});

