RTU.DEFINE(function (require, exports) {
/**
 * 模块名：列车运行状态历史查询
 * name：trainrunningstatehistoryquery
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("My97DatePicker/WdatePicker.js");
    require("app/loading/list-loading.js");
    var $html;
    var popuwnd;
    var data;
    var currentPage = 1;
    var pageSize = 20;
    var totalPage = 1;
    var radioFlag = "";
    var trainrunningstatehisGrid;
    //加载查询页面，得到页面对象

    RTU.register("app.trainrunningstatehistoryquery.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/trainrunningstatehistoryquery/app-locoquery-trainrunningstatehistoryquery.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                }
                
                //智能搜索
                RTU.invoke("app.trainrunningstatehistoryquery.query.searchzhineng");
                
                //初始化，默认模式一
                $("input[value='LkjInfoHisM1']").attr("checked", "checked");
                //构建查询条件对象
                var optionFn = function () {
                	var locoNoStr=$(".runningstate_locoNo-input").val();
                	var locoAbStr=$(".runningstate_locoNo-input").attr("locoAb");
                	var indexLast=locoNoStr.substr(locoNoStr.length-1,locoNoStr.length);
                	var locoNo="";
                	if(isNaN(indexLast)){  //isNaN()的意思是非数字
                		locoNo=locoNoStr.substr(0,locoNoStr.length-1);
                		if(indexLast == "A"){
                			locoAbStr="1";
                		}else if(indexLast == "B"){
                			locoAbStr="2";
                		}
                	}else{
                		locoNo=locoNoStr;
                		if(!locoAbStr)
            				locoAbStr="0";
                	}
                    var option = {
                        optionValue: radioFlag == "" ? $("input[checked='checked']", $(".trainsmodel-container")).val() : radioFlag,
                        deptName: $(".runningstate_deptId-input").val()==""?"":$(".runningstate_deptId-input").attr("deptid")||"",
//                        locoNo: $(".runningstate_locoNo-input").val(),
                        locoNo: locoNo,
                        locoAb:locoAbStr,
                        locoTypeName: $(".runningstate_locoTypeid-input").val()==""?"":$(".runningstate_locoTypeid-input").attr("locotypeid")||"",
                        beginTime: $(".start-time-input").val(),
                        endTime: $(".end-time-input").val()
                        
                    };
                    return option;
                };
                //首次加载数据
                var first = false;
                var option1 = new optionFn();
//                option1.deptName = "1a&1"; //首次加载不显示数据
            	
                RTU.invoke("app.trainrunningstatehistoryquery.notShowData", option1);
                //查询点击事件
                $("#train-query-btn").click(function () {
                	$(this).attr("clickNum","1");
                    first = false;
                    var options = new optionFn();
                    
                    if(options.deptName==""&&options.locoNo==""&&options.locoTypeName==""&&options.beginTime==""&&options.endTime==""){
                		RTU.invoke("header.msg.hidden");
                		RTU.invoke("header.alarmMsg.show","请输入查询条件！");
                    }else {
                    	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                    	RTU.invoke("app.trainrunningstatehistoryquery.notShowData", options);
					}
                });
                
                //模式切换
//                $("input[name='model']").unbind("click").click(function () {
                $("input[name='model']").click(function () {
                    $("input[name='model']").removeAttr("checked");
                    $(this).attr("checked", "checked");
                    
                    if (first) {
                    	var option = new optionFn();
                    	option.optionValue = $(this).val();
                    	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                    	RTU.invoke("app.trainrunningstatehistoryquery.changeShowData", option);
                    } else {
                    	var option = new optionFn();
                    	option.optionValue = $(this).val();
                        if(option.deptName==""&&option.locoNo==""&&option.locoTypeName==""&&option.beginTime==""&&option.endTime==""){
                        	RTU.invoke("header.alarmMsg.show","请输入查询条件！");
                        }else {
                        	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                        	RTU.invoke("app.trainrunningstatehistoryquery.notShowData", option);
                        }
                    }
                 });
            }
        });
        return function () {
            return true;
        };
    });
    
    
    //智能搜索
    RTU.register("app.trainrunningstatehistoryquery.query.searchzhineng", function () {
   	 //局段    runningstate_deptId-input"   runningstate_locoTypeid-input  runningstate_locoNo-input
       var initdepotStrAuto = function () {
       	depotStrExParams = {
       		shortname:$('.runningstate_deptId-input').attr("deptid")||"",
       	};
       	depotStrParse = function (data) {
       		ff=true;
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
                   var text = replaceSpace(data[i]);
                   rows[rows.length] = {
                       data: text,
                       value: text+"-"+data[i].id,
                       result: text
                   };
               }
               return rows;
       	};
       	
       	autocompleteBuilder($(".runningstate_deptId-input"), "depot/findByShortname", depotStrExParams, depotStrParse);
       	try {
       		$('.runningstate_deptId-input').result(function (event, autodata, formatted) {
       			var arr=formatted.split("-");
                $('.runningstate_deptId-input').val(arr[0]);
                $('.runningstate_deptId-input').attr("deptid",arr[1]);
       		});
       	}
       	catch (e) {
       	}
       };
       
       //机车型号
       var inittypenameStrAuto = function () {
       	loconameStrExParams = {
       		shortName:$('.runningstate_locoTypeid-input').attr("locotypeid")||"",
       		locoNo:'',
       	};
       	loconameStrParse = function (data) {
       		
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
                   var text = replacelocoTypeNameSpace(data[i]);
                   rows[rows.length] = {
                       data: text,
                       value: text+"-"+data[i].id,
                       result: text
                   };
               }
               return rows;
       	};
       	autocompleteBuilder($(".runningstate_locoTypeid-input"), "traintype/searchByLocoTypeAndLocoNo", loconameStrExParams, loconameStrParse);
       	try {
       		$('.runningstate_locoTypeid-input').result(function (event, autodata, formatted) {
       			var arr=formatted.split("-");
       			$('.runningstate_locoTypeid-input').val(arr[0]);
       			$('.runningstate_locoTypeid-input').attr("locotypeid",arr[1]);
       		});
       	}
       	catch (e) {
       	}
       };
       
       
     //机车号
       var initloconoStrAuto = function () {
       	loconoStrExParams = {
       		locoNo:$('.runningstate_locoNo-input').val(),
//       		shortName:'',
       	};
       	loconoStrParse = function (data) {
       		
               data = data.data;
               var rows = [];
               for (var i = 0; i < data.length; i++) {
            	   var text1 = replacelocoNoSpace(data[i]);
                   var text2 = replacelocoAbSpace(data[i]);
                   if(text2 !='1'&&text2!='2'){
                     	text2="";
                     }else if(text2 == '1'){
                     	text2="A";
                     }else{
                     	text2="B";
                     }
                  var text = text1 + text2;
//                   var text = replacelocoNoSpace(data[i]);
                   rows[rows.length] = {
                       data: text,
                       value: text+"_"+data[i].locoAb,
                       result: text
                   };
               }
               return rows;
       	};
       	autocompleteBuilder($(".runningstate_locoNo-input"), "traintype/searchByLocoNo", loconoStrExParams, loconoStrParse);
       	try {
       		$('.runningstate_locoNo-input').result(function (event, autodata, formatted) {
       			var arr=formatted.split("_");
       			if(arr.length>1){
       				$('.runningstate_locoNo-input').val(arr[0]);
       				$('.runningstate_locoNo-input').attr("locoAb",arr[1]);
       			}
       			else{
       			 $('.runningstate_locoNo-input').val(formatted);
       			 $('.runningstate_locoNo-input').attr("locoAb","");
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
    	   
       	   $(".runningstate_deptId-input").inputTip({ text: "" });
           $(".runningstate_locoTypeid-input").inputTip({ text: "" });
           $(".runningstate_locoNo-input").inputTip({ text: "" });
           $(".runningstate_deptId-input").attr("deptid","");
           $(".runningstate_locoTypeid-input").attr("locotypeid","");
           
           initdepotStrAuto();
		
		   inittypenameStrAuto();
		
			initloconoStrAuto();
			
			$(".wrapTipDiv",$(".content-trainrunningstatehistory-tab3-condition-cell")).css("display","inline-block");
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
   
   
   var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
   
    RTU.register("app.trainrunningstatehistoryquery.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
        	var Resolution=getResolution();
			var width=Resolution.Twidth-140;
			var height=Resolution.Theight-60;
        	
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: "列车运行状态历史查询",
                    html: $html,
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
//                $(".loco-runningstate-query-title-div").css( "width",width);
            }
            $(".loco-runningstate-query-title-div").css( "width",width);
           
        };
    });

    var strExit = "";
    RTU.register("app.trainrunningstatehistoryquery.notShowData", function () {
        var checkShow = function (options) {
            $.ajax({
                url: "../syssetting/findByProperty?options=" + options.optionValue + "&userid=" + RTU.data.user.id + "&type=2",
                dataType: "jsonp",
                type: "GET",
                success: function (value) {
                	RTU.invoke("header.msg.hidden");
                    if (value && value.data) {
                        strExit = value.data.optionvalue;
                        var arrCol = [];
                        var arrName = [];
                        var array = [{ field: "recId", name: "记录ID", width: "60px" }, { field: "receiveTime", name: "记录处理时间", width: "130px" }
									, { field: "locoTypeid", name: "机车型号", width: "70px" }, { field: "locoNo", name: "机车号", width: "60px" }
									, { field: "locoAb", name: "A/B节", width: "60px" }, { field: "locoIp", name: "机车ip", width: "60px" }
								    , { field: "frameNo", name: "帧序号", width: "60px" }, { field: "appType", name: "应用类型", width: "70px" }
								    , { field: "transType", name: "传输通道类型", width: "95px" }, { field: "proVer", name: "协议版本号", width: "95px" }
								    , { field: "infoVer", name: "信息版本号", width: "95px" }, { field: "infoFrameNo", name: "信息帧序号", width: "95px" }
								    , { field: "lkjTime", name: "lkj主机时间", width: "130px" }, { field: "deviceCorp", name: "厂家", width: "40px" }
								    , { field: "driverId", name: "司机编号", width: "70px" }, { field: "vicedriverId", name: "副司机编号", width: "95px" }
								    , { field: "checiName", name: "车次名", width: "60px" }, { field: "checiEx", name: "车次扩充", width: "80px" }
								    , { field: "kehuo", name: "本补客货", width: "80px" }, { field: "inputJiaolu", name: "输入交路号", width: "95px" }
								    , { field: "factJiaolu", name: "实际交路号", width: "95px" }, { field: "stationNo", name: "车站号", width: "60px" }
								    , { field: "totalWeight", name: "总重", width: "40px" }, { field: "length", name: "计长", width: "40px" }
								    , { field: "vehicleCount", name: "辆数", width: "40px" }, { field: "speed", name: "实速", width: "40px" }
								    , { field: "limitedSpeed", name: "限速", width: "40px" }, { field: "engineSpeed", name: "柴速", width: "40px" }
								    , { field: "guanya", name: "列车管压", width: "80px" }, { field: "gangya", name: "闸缸压力", width: "80px" }
								    , { field: "workStatus", name: "机车工况", width: "80px" }, { field: "zhidong", name: "制动输出", width: "80px" }
								    , { field: "locoSignal", name: "机车信号", width: "80px" }, { field: "lineFlag", name: "标准线路号标志", width: "120px" }
								    , { field: "lineNo", name: "标准线路号", width: "95px" }, { field: "stationTmis", name: "标准车站号", width: "95px" }
								    , { field: "frontLineflag", name: "前方标准线路号标志", width: "150px" }, { field: "frontLineno", name: "前方标准线路号", width: "120px" }
								    , { field: "frontStationJiaolu", name: "前方车站交路号", width: "120px" }, { field: "frontStationNo", name: "前方车站站号", width: "120px" }
								    , { field: "kiloSingD", name: "公里标", width: "60px" }, { field: "frontDistance", name: "前方距离", width: "80px" }
								    , { field: "signalType", name: "信号机种类制式", width: "120px" }, { field: "signalNo", name: "信号机编号", width: "100px" }
								    , { field: "totalDistance", name: "累计位移", width: "80px" }, { field: "jkstate", name: "监控状态", width: "80px" }
								    , { field: "currLateral", name: "本分区支线", width: "100px" }, { field: "currSidetrack", name: "本分区侧线", width: "100px" }
								    , { field: "frontLateral", name: "前方分区支线", width: "120px" }, { field: "frontSidetrack", name: "前方分区侧线", width: "120px" }
								    , { field: "wheel", name: "轮径", width: "40px" }, { field: "kcbz", name: "控车标志", width: "80px" }
								    , { field: "validgpsCount", name: "有效卫星数", width: "100px" }, { field: "gpsTime", name: "gps时间", width: "130px" }
								    , { field: "gpsDirection", name: "gps速度方向", width: "100px" }, { field: "gpsSpeed", name: "gps速度", width: "80px" }
								    , { field: "gpsHeight", name: "gps高度", width: "80px" }, { field: "gpsEwflag", name: "gpsEw半球标志", width: "120px" }
								    , { field: "gpsNsflag", name: "gpsNs半球标志", width: "120px" }, { field: "longitude", name: "gps经度", width: "120px" }
								    , { field: "latitude", name: "gps纬度", width: "120px" }, { field: "tShortname", name: "机车型号简称", width: "100px" }
								    , { field: "dShortname", name: "所属段简称", width: "100px" }, { field: "signalId", name: "信号机编号", width: "100px" }
								    , { field: "signalName", name: "信号机名称", width: "100px" }, { field: "sName", name: "车站名", width: "60px" }
								    , { field: "deptId", name: "机车所属段", width: "100px" }, { field: "frontStationTmis", name: "前方标准车站号", width: "120px"}];

                        var showArr = [];
                        for (var i = 0; i < array.length; i++) {
                            if (strExit.indexOf(array[i]["field"]) != -1) {

                                showArr.push({ field: array[i]["field"], name: array[i]["name"], width: array[i]["width"] });
                            }
                        }
                        var countLocoNo=0;
                        var tt=null;
                        $.each(strExit.split(","), function (i, item) {
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
                        $("#train-gridId").html("");
                        
//                        var width = winWidth * 0.78;
//                        var height = winHeight * 0.85;
//                        var winWidth = document.documentElement.clientWidth*0.9;
//                    	var height = document.documentElement.clientHeight;
                        
                        var Resolution=getResolution();
            			var width=Resolution.Twidth-160;
            			var height=Resolution.Theight-210;
                       if(tt>0){
                    	   if(!trainrunningstatehisGrid){
                           	var datas=[];
                           	trainrunningstatehisGrid = new RTGrid({
//                                        url: "../lkjInfoHis/findInfoByPropertyTOHistory?deptId=" + options.deptName + "&locoNo=" + options.locoNo + "&locoAb=&locoTypeid=" + options.locoTypeName + "&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                           		datas:datas,
                           		containDivId: "train-gridId",
//                           		tableWidth: winWidth,
//                           		tableHeight: height * 0.78> 774 ? height * 0.78 :(height-80) * 0.75,
                           		tableWidth: width,
                           		tableHeight: height,
//                           		tableHeight: height,
                           		hasCheckBox: false, //是否有checkbox
                           		showTrNum: true, //是否显示行号
                           		isSort: true, //是否排序
                           		colNames: o.name, //arry=["姓名","性别"]
                           		colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                           		replaceTd: [ { index: tt-1, fn: function (data, j, ctd, itemData) {
//                           			alert("22="+itemData.locoAb +"  "+data)
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
                           	if(options.deptName==""&&options.locoNo==""&&options.locoTypeName==""&&options.beginTime==""&&options.endTime==""){
                               	RTU.invoke("header.alarmMsg.show","请输入查询条件！");
                               }else{
                               	trainrunningstatehisGrid = new RTGrid({
                               		url: "../lkjInfoHis/findInfoByPropertyTOHistory?deptId=" + options.deptName + "&locoNo=" + options.locoNo + "&locoAb="+ options.locoAb+"&locoTypeid=" + options.locoTypeName + "&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                               		containDivId: "train-gridId",
//                               		tableWidth: winWidth,
////                               		tableHeight: height,
//                               		tableHeight: height * 0.78> 774 ? height * 0.78 :(height-80) * 0.73,
                               		tableWidth: width,
                               		tableHeight: height,
                               		hasCheckBox: false, //是否有checkbox
                               		showTrNum: true, //是否显示行号
                               		isSort: true, //是否排序
                               		isShowRefreshImgControl:true,
                               		colNames: o.name, //arry=["姓名","性别"]
                               		colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
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
                               	$(".RTTable_Head tr td:first",$("#train-gridId")).html("序号");
                               }
                           	
                           }
                       }else{
                    	   if(!trainrunningstatehisGrid){
                           	var datas=[];
                           	trainrunningstatehisGrid = new RTGrid({
//                                        url: "../lkjInfoHis/findInfoByPropertyTOHistory?deptId=" + options.deptName + "&locoNo=" + options.locoNo + "&locoAb=&locoTypeid=" + options.locoTypeName + "&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                           		datas:datas,
                           		containDivId: "train-gridId",
//                           		tableWidth: winWidth,
////                           		tableHeight: height,
//                           		tableHeight: height * 0.78> 774 ? height * 0.78 :(height-80) * 0.73,
                           		tableWidth: width,
                           		tableHeight: height,
                           		hasCheckBox: false, //是否有checkbox
                           		showTrNum: true, //是否显示行号
                           		isSort: true, //是否排序
                           		colNames: o.name, //arry=["姓名","性别"]
                           		colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                           		loadPageCp: function (t) {
                           			t.cDiv.css({ "left": "210px", "top": "330px", width: t.cDiv.parent(".popuwnd-main").width() - 20 });
                           		}
                           	});
                           }else{
                           	if(options.deptName==""&&options.locoNo==""&&options.locoTypeName==""&&options.beginTime==""&&options.endTime==""){
                               	RTU.invoke("header.alarmMsg.show","请输入查询条件！");
                               }else{
                               	trainrunningstatehisGrid = new RTGrid({
                               		url: "../lkjInfoHis/findInfoByPropertyTOHistory?deptId=" + options.deptName + "&locoNo=" + options.locoNo + "&locoAb="+options.locoAb+"&locoTypeid=" + options.locoTypeName + "&beginTime=" + options.beginTime + "&endTime=" + options.endTime,
                               		containDivId: "train-gridId",
//                               		tableWidth: winWidth,
////                               		tableHeight: height,
//                               		tableHeight: height * 0.78> 774 ? height * 0.78 :(height-80) * 0.73,
                               		tableWidth: width,
                               		tableHeight: height,
                               		hasCheckBox: false, //是否有checkbox
                               		showTrNum: true, //是否显示行号
                               		isSort: true, //是否排序
                               		isShowRefreshImgControl:true,
                               		colNames: o.name, //arry=["姓名","性别"]
                               		colModel: o.col, //[{name:"locoNo"},{name:"locoTypeName",width:"30px"}]
                               		loadPageCp: function (t) {
                               			t.cDiv.css({ "left": "210px", "top": "330px", width: t.cDiv.parent(".popuwnd-main").width() - 20 });
                               		}
                               	});
                               	
                               	$(".RTTable_Head tr td:first",$("#train-gridId")).html("序号");
                               }
                           }
                       }
                    }
                }
            });
        };
        return function (options) {
            checkShow(options);
        };
    });
    RTU.register("app.trainrunningstatehistoryquery.changeShowData", function () {
    	return function(options){
	    	$.ajax({
	            url: "../syssetting/findByProperty?options=" + options.optionValue + "&userid=" + RTU.data.user.id + "&type=2",
	            dataType: "jsonp",
	            type: "GET",
	            success: function (value) {
	            	RTU.invoke("header.msg.hidden");
	                if (value && value.data) {
	                    strExit = value.data.optionvalue;
			            var arrCol = [];
			            var arrName = [];
			            var array = [{ field: "recId", name: "记录ID", width: "60px" }, { field: "receiveTime", name: "记录处理时间", width: "130px" }
									, { field: "locoTypeid", name: "机车型号", width: "70px" }, { field: "locoNo", name: "机车号", width: "60px" }
									, { field: "locoAb", name: "A/B节", width: "60px" }, { field: "locoIp", name: "机车ip", width: "60px" }
								    , { field: "frameNo", name: "帧序号", width: "60px" }, { field: "appType", name: "应用类型", width: "70px" }
								    , { field: "transType", name: "传输通道类型", width: "95px" }, { field: "proVer", name: "协议版本号", width: "95px" }
								    , { field: "infoVer", name: "信息版本号", width: "95px" }, { field: "infoFrameNo", name: "信息帧序号", width: "95px" }
								    , { field: "lkjTime", name: "lkj主机时间", width: "130px" }, { field: "deviceCorp", name: "厂家", width: "40px" }
								    , { field: "driverId", name: "司机编号", width: "70px" }, { field: "vicedriverId", name: "副司机编号", width: "95px" }
								    , { field: "checiName", name: "车次名", width: "60px" }, { field: "checiEx", name: "车次扩充", width: "80px" }
								    , { field: "kehuo", name: "本补客货", width: "80px" }, { field: "inputJiaolu", name: "输入交路号", width: "95px" }
								    , { field: "factJiaolu", name: "实际交路号", width: "95px" }, { field: "stationNo", name: "车站号", width: "60px" }
								    , { field: "totalWeight", name: "总重", width: "40px" }, { field: "length", name: "计长", width: "40px" }
								    , { field: "vehicleCount", name: "辆数", width: "40px" }, { field: "speed", name: "实速", width: "40px" }
								    , { field: "limitedSpeed", name: "限速", width: "40px" }, { field: "engineSpeed", name: "柴速", width: "40px" }
								    , { field: "guanya", name: "列车管压", width: "80px" }, { field: "gangya", name: "闸缸压力", width: "80px" }
								    , { field: "workStatus", name: "机车工况", width: "80px" }, { field: "zhidong", name: "制动输出", width: "80px" }
								    , { field: "locoSignal", name: "机车信号", width: "80px" }, { field: "lineFlag", name: "标准线路号标志", width: "120px" }
								    , { field: "lineNo", name: "标准线路号", width: "95px" }, { field: "stationTmis", name: "标准车站号", width: "95px" }
								    , { field: "frontLineflag", name: "前方标准线路号标志", width: "150px" }, { field: "frontLineno", name: "前方标准线路号", width: "120px" }
								    , { field: "frontStationJiaolu", name: "前方车站交路号", width: "120px" }, { field: "frontStationNo", name: "前方车站站号", width: "120px" }
								    , { field: "kiloSingD", name: "公里标", width: "60px" }, { field: "frontDistance", name: "前方距离", width: "80px" }
								    , { field: "signalType", name: "信号机种类制式", width: "120px" }, { field: "signalNo", name: "信号机编号", width: "100px" }
								    , { field: "totalDistance", name: "累计位移", width: "80px" }, { field: "jkstate", name: "监控状态", width: "80px" }
								    , { field: "currLateral", name: "本分区支线", width: "100px" }, { field: "currSidetrack", name: "本分区侧线", width: "100px" }
								    , { field: "frontLateral", name: "前方分区支线", width: "120px" }, { field: "frontSidetrack", name: "前方分区侧线", width: "120px" }
								    , { field: "wheel", name: "轮径", width: "40px" }, { field: "kcbz", name: "控车标志", width: "80px" }
								    , { field: "validgpsCount", name: "有效卫星数", width: "100px" }, { field: "gpsTime", name: "gps时间", width: "130px" }
								    , { field: "gpsDirection", name: "gps速度方向", width: "100px" }, { field: "gpsSpeed", name: "gps速度", width: "80px" }
								    , { field: "gpsHeight", name: "gps高度", width: "80px" }, { field: "gpsEwflag", name: "gpsEw半球标志", width: "120px" }
								    , { field: "gpsNsflag", name: "gpsNs半球标志", width: "120px" }, { field: "longitude", name: "gps经度", width: "120px" }
								    , { field: "latitude", name: "gps纬度", width: "120px" }, { field: "tShortname", name: "机车型号简称", width: "100px" }
								    , { field: "dShortname", name: "所属段简称", width: "100px" }, { field: "signalId", name: "信号机编号", width: "100px" }
								    , { field: "signalName", name: "信号机名称", width: "100px" }, { field: "sName", name: "车站名", width: "60px" }
								    , { field: "deptId", name: "机车所属段", width: "100px" }, { field: "frontStationTmis", name: "前方标准车站号", width: "120px"}];
			
			            var showArr = [];
			            for (var i = 0; i < array.length; i++) {
			                if (strExit.indexOf(array[i]["field"]) != -1) {
			
			                    showArr.push({ field: array[i]["field"], name: array[i]["name"], width: array[i]["width"] });
			                }
			            }
			            $.each(strExit.split(","), function (i, item) {
			                $.each(showArr, function (i, item1) {
			                    if (item == item1.field) {
			                        var o1 = { name: item1.field, isSort: true, width: item1.width };
			                        arrCol.push(o1);
			                        arrName.push(item1.name);
			                    }
			                });
			            });
			            var o = { col: arrCol, name: arrName };
			            if($("#train-query-btn").attr("clickNum")=="1"){
			            	 that=  jQuery.extend(true, {},  trainrunningstatehisGrid); // trainrunningstatehisGrid;
					         $("#train-query-btn").removeAttr("clickNum");
			            }
			            trainrunningstatehisGrid.param.colNames=o.name;
			            trainrunningstatehisGrid.param.colModel=o.col;
			            trainrunningstatehisGrid.refresh(that.datas);
	                }
	            }
	    	});
    	}
    });
    RTU.register("app.trainrunningstatehistoryquery.result.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    RTU.register("app.trainrunningstatehistoryquery.query.init", function () {
        data = RTU.invoke("app.setting.data", "trainrunningstatehistoryquery");
        if (data && data.isActive) {
            RTU.invoke("app.trainrunningstatehistoryquery.query.activate");
        }
        return function () {
            return true;
        };
    });
    
    
});
