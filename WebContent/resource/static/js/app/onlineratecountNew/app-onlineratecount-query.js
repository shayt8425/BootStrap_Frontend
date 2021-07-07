RTU.DEFINE(function (require, exports) {
/**
 * 模块名：上线率统计
 * name：onlineratecount
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");
    require("My97DatePicker/WdatePicker.js");
    require("../../../css/app/onlineratecountNew/app-onlineratecount.css");
    require("../../../css/app/app-search.css");
    require("app/onlineratecountNew/app-onlineratecount-charts.js");
    var $html;
    var data;
    var popuwnd_left = null; //左侧弹出窗口
    var popuwnd_right = null; //住查询窗口
    var onlineratecountGrid=null;
    var onlineratecountGrid1=null;
    var locoData=[];
    var popuwnd_charts= null;
    //加载数据并初始化窗口和事件
    RTU.register("app.onlineratecount.query.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                        if (data.fn) {
                        	$html=html;
                            var win = data.fn($(html));
                            data.initEvent ? data.initEvent() : "";
                        }
                    }
                });
            }
        };
    });
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	};

    //查询窗口
    RTU.register("app.onlineratecount.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            RTU.invoke("app.onlineratecount.query.loadHtml", { url: "../app/modules/onlineratecountNew/app-onlineratecount-query.html", fn: function (html) {
            	var Resolution=getResolution();
    			var width=Resolution.Twidth;
    			var height=Resolution.Theight-80;
                if (!popuwnd_left) {
                    popuwnd_left = new PopuWnd({
                        title: data.alias,
                        html: html,
                        width: width,
                        height: height,
                        left: 0,
                        top: 55,
                        shadow: true,
                        removable:false  //设置弹出窗口是否可拖动
                    });
                    popuwnd_left.remove = popuwnd_left.close;
                    popuwnd_left.close = popuwnd_left.hidden;
                    popuwnd_left.init();
                } else {
                	popuwnd_left.close();
                    popuwnd_left.init();
                }
                return popuwnd_left;
            }, initEvent: function () { //初始化事件
            	
//            	$("#onlineratecount-search-beginDate").val("");
//            	$("#onlineratecount-search-endDate").val("");
            	$("#onlineratecount_loco").val("");
            	var myDate = new Date();
            	var myDate2 = new Date();
            	myDate2.setDate(myDate2.getDate()-30);
            	var endDate=getDate(myDate);
            	var beginDate= getDate(myDate2);
            	
            	$("#onlineratecount-search-beginDate").val(beginDate);
            	$("#onlineratecount-search-endDate").val(endDate);
            	
            	$("#onlineratecount-search-beginDate,#onlineratecount-search-endDate").unbind("click").click(function(){
            		WdatePicker({dateFmt:'yyyy-MM-dd'});
            	});
            	$("#onlineratecount-bodyDiv-body-grid1").removeClass("hidden");
            	$("#onlineratecount-bodyDiv-body-grid").removeClass("hidden").addClass("hidden");
    			
              	RTU.invoke("app.onlineratecount.initHtmlCss");
                RTU.invoke("app.onlineratecount.query.initBut");
                RTU.invoke("app.onlineratecount.query.locolist");
                RTU.invoke("app.onlineratecount.querydata",{"beginDate":beginDate,"endDate":endDate});
//                RTU.invoke("app.onlineratecount.querydata");
                RTU.invoke("app.onlineratecount.initRightList");
                RTU.invoke("app.onlineratecount.query.initRightBtn");
                $("#onlineratecount-queryData").unbind("click").click(function(){
                	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                	var beginDate=$("#onlineratecount-search-beginDate").val();
                	var endDate=$("#onlineratecount-search-endDate").val();               	
                	RTU.invoke("app.onlineratecount.querydata",{"beginDate":beginDate,"endDate":endDate,flag:"Y"});
                	
                });
                $("#short-key").change(function(){
                	var endDate;
                	var beginDate;
                	if ($("#short-key").val()=="7天")
                		{
                	var myDate = new Date();
                	var myDate2 = new Date();
                	myDate2.setDate(myDate2.getDate()-7);
                	endDate=getDate(myDate);
                	beginDate= getDate(myDate2);
                       } 
                	if ($("#short-key").val()=="15天")
            		{
			        	var myDate = new Date();
			        	var myDate2 = new Date();
			        	myDate2.setDate(myDate2.getDate()-15);
			        	endDate=getDate(myDate);
			        	beginDate= getDate(myDate2);
                   } 
                	if ($("#short-key").val()=="30天")
            		{
			        	var myDate = new Date();
			        	var myDate2 = new Date();
			        	myDate2.setDate(myDate2.getDate()-30);
			        	endDate=getDate(myDate);
			        	beginDate= getDate(myDate2);
                   }                 	
                	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
                	RTU.invoke("app.onlineratecount.querydata",{"beginDate":beginDate,"endDate":endDate,flag:"Y"});
/*        	        setTimeout(function () {
        	            initLocoNameAuto1();
        	        }, 10);*/
                	//totalcount();
                });
            }
            });
        };
    });
    function getDate(myDate) {  
       var y=myDate.getFullYear(),m=myDate.getMonth()+1,d=myDate.getDate();
       if(m<10)m="0"+m;
       if(d<10)d="0"+d;
       return y+"-"+m+"-"+d;
    } 
    RTU.register("app.onlineratecount.query.initBut", function () {
    	return function () {
    		$("#onlineratecount-rightBottom-button").unbind("click").click(function(){
    			var sta=$("#onlineratecount-search-beginDate").val();
    			var end=$("#onlineratecount-search-endDate").val();
    			
    			if(sta==""){
    				RTU.invoke("header.notice.show", "请选择起始日期。。");
    				return false;
    			}
    			else if(end==""){
    				RTU.invoke("header.notice.show", "请选择结束日期。。");
    				return false;
    			}
    			var state_grid =$("#onlineratecount-bodyDiv-body-grid").css("display");
    			var state_grid1 =$("#onlineratecount-bodyDiv-body-grid1").css("display");
    			var options="";
    			if(state_grid=="block"){
    				options=onlineratecountGrid.selectItem();
    			}else if(state_grid1=="block"){
    				options=onlineratecountGrid1.selectItem();
    			}
    			if(options.length==0){
    				RTU.invoke("header.notice.show", "请选择一行数据。。");
					return false;
    			}
    			RTU.invoke("header.msg.show", "加载中,请稍后!!!");
    			var loco='[';
    			for(var j=0;j<options.length;j++){
    				
    				var d=$(options[j]).data("itemData");
    				if(d){
    					 loco+='{"locoTypeid":"'+d.locoTypeid+'","locoNo":"'+d.locoNo+'","locoAb":"'+d.locoAb+'"},';
    				};
    			}
    			if(loco.length>1){
    				loco=loco.substring(0,loco.length-1);
    			}
    			loco+=']';
    			var Resolution=getResolution();
    			Resolution.loco=loco;
    			Resolution.staDate=sta;
    			Resolution.endDate=end;
    			RTU.invoke("app.onlineratecount.query.loadHtml", 
    					{ url: "../app/modules/onlineratecountNew/app-onlineratecount-charts.html", 
    				fn: function (html) {
    					var width=Resolution.Twidth;
    					var height=Resolution.Theight-80;
    					if (!popuwnd_charts) {
    						popuwnd_charts = new PopuWnd({
    							title: "TSC 统计列车图",
    							html: html,
    							width: width,
    							height: height,
    							left: 0,
    							top: 55,
    							shadow: true,
    							removable:false  //设置弹出窗口是否可拖动
    						});
    						popuwnd_charts.remove = popuwnd_charts.close;
    						popuwnd_charts.close = popuwnd_charts.hidden;
    						popuwnd_charts.init();
    					} else {
    						popuwnd_charts.init();
    					}
    					return popuwnd_charts;
    				}, initEvent: function () { 
    					RTU.invoke("app.onlineratecount.charts.init",Resolution);
    				}
    				});
    		});
    		var inputVal="";
    		$('#onlineratecount_loco').unbind("mouseout").mouseout(function(){
    			var val=$(this).val();
    			if(inputVal!=val){
    				clearCheckBox();
    			}
    		});
    		
    		$('#onlineratecount_loco').unbind("mouseover").mouseover(function(){
    			inputVal=$(this).val();
    		});
    	};
    });
    
    //清除复选框 选中状态
    function clearCheckBox(){
    	var grid= $("#onlineratecount-bodyDiv-body-grid .RTTable_Head input");
		var grid1=$("#onlineratecount-bodyDiv-body-grid1 .RTTable_Head input");
		
		if(grid[0].checked==true){
			grid[0].click();
		}
		if(grid1[0].checked==true){
			grid1[0].click();
		}
    }

	//搜索框智能提示
	RTU.register("app.onlineratecount.query.locolist", function () {
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
	            }).result(function (event, autodata, formatted) {
	            	clearCheckBox();
                });

	        } catch (e) {
	        }
	    };
	    var initLocoNameAuto1 = function () {
	    	LocoNameExParams1 = {
	            keyword: function () {
	                return $('#onlineratecount_loco').val();
	            }
	        };

	    	LocoNameParse1 = function (data) {
	            data = data.data;
	            var rows = [];
	            for (var i = 0; i < data.length; i++) {
	                var text1 = $.trim(data[i].locoTypeName);
	                var text4 = $.trim(data[i].locoNo);
	                var text5 = $.trim(data[i].locoAb);
	                var aa = text1 + "-" + text4+RTU.invoke("app.locoAb.getChar",text5);
	                rows[rows.length] = {
	                    data: "<table><tr><td align='left' style='width:170px;'>" + aa + "</td></tr></table>",
	                    value: aa,
	                    result: aa
	                };
	            }
	            return rows;
	        };
	        autocompleteBuilder1($("#onlineratecount_loco"), "statistics/getByFocus", LocoNameExParams1, LocoNameParse1);
	        $('#onlineratecount_loco').result(function (event, autodata, formatted) {
	            if (!formatted) {
	                $('#onlineratecount_loco').val(formatted);
	            }
	            //选中后，立即查询&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
	            $("#onlineratecount_loco").keyup();
	        });
	    };
	    return function () {
	        setTimeout(function () {
	            initLocoNameAuto1();
	        }, 10);
	    };
	});
    
    RTU.register("app.onlineratecount.initHtmlCss",function(){
    	return function(){
			var width=$(".onlineratecount-MainDiv").width();
			var height=$(".onlineratecount-MainDiv").height();
			var left_inUse_H=$(".onlineratecount-leftDiv-inUseDiv").height();
			$(".onlineratecount-leftDiv-inUseDiv-TabDiv").css("max-height",height*0.4-20);
			$(".onlineratecount-leftDiv-inUseDiv-Tab1Div").css("max-height",height*0.4-50);
			$(".onlineratecount-leftDiv-KeepDiv").css({"max-height":(height*0.4-80)});
			$(".onlineratecount-leftDiv-KeepDiv-TabDiv").css("max-height",(height*0.4-80-20));
			$(".onlineratecount-leftDiv-KeepDiv-Tab1Div").css("max-height",(height*0.4-150-20-40));
			$(".onlineratecount-leftDiv-otherDiv").css({"max-height":(height*0.4-80)});
			$(".onlineratecount-leftDiv-otherDiv-TabDiv").css("max-height",(height*0.4-80-20));
			$(".onlineratecount-leftDiv-otherDiv-Tab1Div").css("max-height",(height*0.4-150-20-40));
			$(".onlineratecount-rightDiv-resultTabDiv").css("height",height-200-$(".onlineratecount-rightDiv-countDiv").height());
			$(".onlineratecount-rightDiv-resultDiv").css("height",height-170-$(".onlineratecount-rightDiv-countDiv").height());
    	};
    });

    RTU.register("app.onlineratecount.initRightList",function(){
    	return function(){
//        	data.locoList
    		var width=$(".onlineratecount-MainDiv").width()*0.31;
    		var height=$(".onlineratecount-MainDiv").height()-200-$(".onlineratecount-rightDiv-countDiv").height();
            onlineratecountGrid = new RTGrid({
                datas: [],
                containDivId: "onlineratecount-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: height,
                isSort: true, //是否排序
                hasCheckBox: true,
                showTrNum: false,
                isShowPagerControl: false,
                isShowRefreshControl:false,
                isShowRefreshImgControl:true,
                clickIdItem: "locoTypeid_locoNo_locoAb",
                selectTrEvent: function (t, currClickItem) {
            	},
                beforeLoad:function(that){
    				that.pageSize =3000;
    				
    			},
    			replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
    				return itemData.typeName+"-"+itemData.locoNo+RTU.invoke("app.locoAb.getChar",itemData.locoAb);
		        	}
    			},
    			/*{ index: 4, fn: function (data, j, ctd, itemData) {
	    				if((itemData.typeName.substring(0,3).toUpperCase()=="CRH") || (itemData.typeName.toUpperCase()=="SS4")){
	    					return "动车";
	    				}else{
	    					return "机车";
	    				}
    				}
    			},*/
    			{ index: 3, fn: function (data, j, ctd, itemData) {
    				if(itemData.simInstall=="1"){
    					return "装车";
    				}else{
    					return "未装车";
    				}
				}
			}],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");

                },
                colNames: ["机车编号", "电务段", "车载车间", "TSC装车","最后位置","备注"],
                colModel: [{ name: "typeName",isSort: true }, 
                           { name: "dName", isSort: true }, 
                           { name: "cj", isSort: true }, 
                          
                           { name: "simInstall", isSort: true }, 
                           { name: "latestPosition", isSort: true },
                           { name: "detail", isSort: true }]
            });
            
            onlineratecountGrid1 = new RTGrid({
            	datas: [],
            	containDivId: "onlineratecount-bodyDiv-body-grid1",
            	tableWidth: width,
            	tableHeight: height,
            	isSort: true, //是否排序
            	hasCheckBox: true,
            	showTrNum: false,
            	isShowPagerControl: false,
            	isShowRefreshControl:false,
            	isShowRefreshImgControl:true,
            	clickIdItem: "locoTypeid_locoNo_locoAb",
            	selectTrEvent: function (t, currClickItem) {
            	},
            	beforeLoad:function(that){
            		that.pageSize =3000;
            		
            	},
            	replaceTd: [{ index: 0, fn: function (data, j, ctd, itemData) {
            		return itemData.typeName+"-"+itemData.locoNo+RTU.invoke("app.locoAb.getChar",itemData.locoAb);
            		}
            	},{ index: 5, fn: function (data, j, ctd, itemData) {
	            		if(itemData.isOnline=="1"){
	    					return "上线";
	    				}else{
	    					return "未上线";
	    				}
            		}
            	}],
            	loadPageCp: function (t) {
            		t.cDiv.css("left", "200px");
            		t.cDiv.css("top", "200px");
            		
            	},
            	colNames: ["机车编号", "电务段", "车载车间",  "TSC厂家",  "TSC型号","TSC上线"],
            	colModel: [{ name: "typeName",isSort: true }, 
            	           { name: "dName", isSort: true }, 
            	           { name: "cj", isSort: true }, 
            	           { name: "tscCorp", isSort: true }, 
            	           { name: "tscType", isSort: true }, 
            	           { name: "isOnline", isSort: true }]
            });
    	};
    });

    RTU.register("app.onlineratecount.querydata", function () {
    	return function (data) {
    		if(data.flag&&data.flag=="Y"){
    			 RTU.invoke("core.router.get", {
    	                url: "statistics/analysis?beginDate="+data.beginDate+"&endDate="+data.endDate,
    	                success: function (obj) {
    	                    if(obj&&obj.success){
    	                    	var data=obj.data;
    	                    	if(locoData&&locoData.length>0){
    	                    		locoData=[];
    	                    	}
    	                    	locoData=data.locoList;
    	                    	data.flag="Y";
    	                    	RTU.invoke("app.onlineratecount.createLeftHtml",data);	
    	                    }
    	                    totalcount();
    	                    RTU.invoke("header.msg.hidden");
    	                }
    	            });
    		}else{
    			 RTU.invoke("core.router.get", {
    	                url: "statistics/analysis?beginDate="+data.beginDate+"&endDate="+data.endDate,
    	                success: function (obj) {
    	                    if(obj&&obj.success){
    	                    	var data=obj.data;
    	                    	if(locoData&&locoData.length>0){
    	                    		locoData=[];
    	                    	}
    	                    	locoData=data.locoList;
    	                    	RTU.invoke("app.onlineratecount.createLeftHtml",data);	
    	                    }
    	                    totalcount();
    	                    RTU.invoke("header.msg.hidden");
    	                }
    	            });
    		}
           
        };
    });
    
    RTU.register("app.onlineratecount.createLeftHtml",function(){
    	return function(data){
        	var cjs="";
        	var cjTdWidth=100/(2*(data.cjList.length+1)+1)+"%";
        	var headTds = $($(".onlineratecount-leftDiv-headTab thead tr")[0]).children("td");
        	$(headTds[0]).width(cjTdWidth);
    		$(headTds[1]).attr("colspan",data.cjList.length+1).width(cjTdWidth*(data.cjList.length+1));
    		$(headTds[2]).attr("colspan",data.cjList.length+1).width(cjTdWidth*(data.cjList.length+1));
        	var lenT=data.cjList.length;
        	for (var i=0;i<lenT;i++) {
        		/*cjs+="<td class=\"tabTdWidth\" style='width:"+cjTdWidth+"'>"+data.cjList[i]+"</td>";*/
        		cjs+="<td style='width:"+cjTdWidth+"'>"+data.cjList[i]+"</td>";
			}
        	/*cjs=cjs+"<td class=\"tabTdWidth\" style='width:"+cjTdWidth+"'>共计</td>"+cjs+"<td style='width:"+cjTdWidth+"'>共计</td>";*/
        	cjs=cjs+"<td style='width:"
        	+cjTdWidth+"'>共计</td>"+cjs+"<td style='width:"+cjTdWidth+"'>共计</td>";
        	$("#onlineratecount-cjTabTd").empty().append(cjs);
        	var cjTongjiTou="<td class='test1' width=\""+cjTdWidth+"\">合计</td>";
        	var cjTongjiWei="";
        	var vos = data.tongjiList[0].vos;
        	for (var i =0;i<vos.length;i++) {
        		if(i==vos.length-1){
        			cjTongjiTou+="<td class='test text_decoration1' xAxis='共计' yAxis='合计' isTotal='1' isFengcun='' style='width:"+cjTdWidth+"'>"+vos[i][0]+"/"+vos[i][1]+"</td>";
        			cjTongjiWei+="<td class='text_decoration2' xAxis='共计' yAxis='合计' isTotal='0'  isFengcun='' style='width:"+cjTdWidth+"'>"+vos[i][2]+"/"+vos[i][3]+"</td>";
    			}else{
    				/*cjTongjiTou+="<td class='test tabTdWidth text_decoration1' xAxis='"+data.cjList[i]+"' yAxis='合计' isTotal='1'  isFengcun='' style='width:"+cjTdWidth+"'>"+vos[i][0]+"/"+vos[i][1]+"</td>";
    				cjTongjiWei+="<td class='tabTdWidth text_decoration2' xAxis='"+data.cjList[i]+"' yAxis='合计' isTotal='0'  isFengcun='' style='width:"+cjTdWidth+"'>"+vos[i][2]+"/"+vos[i][3]+"</td>";*/
    				cjTongjiTou+="<td class='test text_decoration1' xAxis='"
    					+data.cjList[i]+"' yAxis='合计' isTotal='1'  isFengcun='' style='width:"
    					+cjTdWidth+"'>"+vos[i][0]+"/"+vos[i][1]+"</td>";
    				cjTongjiWei+="<td class='text_decoration2' xAxis='"
    					+data.cjList[i]+"' yAxis='合计' isTotal='0'  isFengcun='' style='width:"
    					+cjTdWidth+"'>"+vos[i][2]+"/"+vos[i][3]+"</td>";
    			}
			}
        	$("#onlineratecount-cjTongji").empty().append(cjTongjiTou+cjTongjiWei);
        	var yyTr = "";
        	var lenYy=data.yyList.length;
        	/*var width=$(".test1").width()+1;
        	var width1=$(".test1").width()+1;*/
        	var width=cjTdWidth;
        	var width1=cjTdWidth;
        	for (var i=0;i<lenYy-1;i++) {
        		var vosYy = data.yyList[i].vos;
        		var typeYy = data.yyList[i].typeName;
        		var cjTongjiTouYy="<tr><td width="+width1+">"+typeYy+"</td>";
            	var cjTongjiWeiYy="";
        		for (var j=0,lent=vosYy.length;j<lent;j++) {
        			var tabTdClass="width="+width1;
        			var xAxisYy="";
        			if(j==lent-1){
        				xAxisYy="共计";
        			}else{
        				xAxisYy=data.cjList[j];
        			}
        			cjTongjiTouYy+="<td "+tabTdClass+" class='text_decoration1' xAxis='"+xAxisYy+"' yAxis='"+typeYy+"' isTotal='1' isFengcun='0'>"+vosYy[j][0]+"/"+vosYy[j][1]+"</td>";
        			/*if(j==lent-1){
        				tabTdClass="";
        			}*/
            		cjTongjiWeiYy+="<td "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisYy+"' yAxis='"+typeYy+"' isTotal='0' isFengcun='0'>"+vosYy[j][2]+"/"+vosYy[j][3]+"</td>";
				}
        		yyTr+=cjTongjiTouYy+cjTongjiWeiYy+"</tr>";
        	}
        	$("#onlineratecount-inUseTabYy").empty().append(yyTr);             	
        	var lastYy=data.yyList[lenYy-1];
        	var cjTongjiTouYyXj="<td width="+width1+">运用小计</td>";
        	var cjTongjiWeiYyXj="";
    		for (var i=0,lent=lastYy.vos.length;i<lent;i++) {
    			var tabTdClass="width="+width1;
    			var xAxisYyXj="";
    			if(i==lent-1){
    				/*tabTdClass=""; */
    				xAxisYyXj="共计";
    			}else{
    				xAxisYyXj=data.cjList[i];
    			}
        		/*cjTongjiTouYyXj+="<td class='tabTdWidth  text_decoration1' xAxis='"+xAxisYyXj
        		+"' yAxis='运用小计' isTotal='1' isFengcun='0' width='"+width1+"'>"+lastYy.vos[i][0]
        		+"/"+lastYy.vos[i][1]+"</td>";*/
    			cjTongjiTouYyXj+="<td class='text_decoration1' xAxis='"+xAxisYyXj
        		+"' yAxis='运用小计' isTotal='1' isFengcun='0' width='"+width1+"'>"+lastYy.vos[i][0]
        		+"/"+lastYy.vos[i][1]+"</td>";
        		cjTongjiWeiYyXj+="<td "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisYyXj+"' yAxis='运用小计' isTotal='0' isFengcun='0'>"+lastYy.vos[i][2]+"/"+lastYy.vos[i][3]+"</td>";
			}
        	$("#onlineratecount-inUseTabCountYy").empty().append(cjTongjiTouYyXj+cjTongjiWeiYyXj);
        	
        	var fcTr = "";
        	var lenFc=data.fcList.length;
        	for (var i=0;i<lenFc-1;i++) {
        		var vosFc = data.fcList[i].vos;
        		/*var typeFc = i==0?data.fcList[i].typeName:data.fcList[i].checkTypeName;*/
        		var typeFc = data.fcList[i].typeName;
        		var cjTongjiTouFc="<tr><td width="+width1+">"+typeFc+"</td>";
        		var cjTongjiWeiFc="";
        		for (var j=0,lent=vosFc.length;j<lent;j++) {
        			var tabTdClass="width="+width1;
        			var xAxisFc="";
        			if(j==lent-1){
        				xAxisFc="共计";
        			}else{
        				xAxisFc=data.cjList[j];
        			}
        			cjTongjiTouFc+="<td "+tabTdClass+" class=' text_decoration1' xAxis='"+xAxisFc+"' yAxis='"+typeFc+"' isTotal='1' isFengcun='1'>"+vosFc[j][0]+"/"+vosFc[j][1]+"</td>";
        			/*if(j==lent-1){
        				tabTdClass="";
        			}*/
        			cjTongjiWeiFc+="<td  "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisFc+"' yAxis='"+typeFc+"' isTotal='0' isFengcun='1'>"+vosFc[j][2]+"/"+vosFc[j][3]+"</td>";
        		}
        		fcTr+=cjTongjiTouFc+cjTongjiWeiFc+"</tr>";
        	}
        	$("#onlineratecount-inUseTabFc").empty().append(fcTr);
        	var lastFc=data.fcList[lenFc-1];
        	var cjTongjiTouFcXj="<td width="+width1+">修程小计</td>";
        	var cjTongjiWeiFcXj="";
        	for (var i=0,lent=lastFc.vos.length;i<lent;i++) {
        		var tabTdClass="width="+width;
        		var xAxisFcXj="";
    			if(i==lent-1){
    				/*tabTdClass="";*/ 
    				xAxisFcXj="共计";
    			}else{
    				xAxisFcXj=data.cjList[i];
    			}
        		/*cjTongjiTouFcXj+="<td class='tabTdWidth text_decoration1' xAxis='"
        			+xAxisFcXj+"' yAxis='修程小计' isTotal='1' isFengcun='1' width='"+width1+"'>"
        			+lastFc.vos[i][0]+"/"+lastFc.vos[i][1]+"</td>";*/
    			cjTongjiTouFcXj+="<td class='text_decoration1' xAxis='"
        			+xAxisFcXj+"' yAxis='修程小计' isTotal='1' isFengcun='1' width='"+width1+"'>"
        			+lastFc.vos[i][0]+"/"+lastFc.vos[i][1]+"</td>";
        		cjTongjiWeiFcXj+="<td "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisFcXj+"' yAxis='修程小计' isTotal='0' isFengcun='1'>"+lastFc.vos[i][2]+"/"+lastFc.vos[i][3]+"</td>";
        	}
        	$("#onlineratecount-inUseTabCountFc").empty().append(cjTongjiTouFcXj+cjTongjiWeiFcXj);
        	
        	var otherTr = "";
        	var lenOther=data.otherList.length;
        	for (var i=0;i<lenOther-1;i++) {
        		var vosOther = data.otherList[i].vos;
        		/*var typeOther = i==0?data.OtherList[i].typeName:data.OtherList[i].checkTypeName;*/
        		var typeOther = data.otherList[i].typeName;
        		var cjTongjiTouOther="<tr><td width="+width1+">"+typeOther+"</td>";
        		var cjTongjiWeiOther="";
        		for (var j=0,lent=vosOther.length;j<lent;j++) {
        			var tabTdClass="width="+width1;
        			var xAxisOther="";
        			if(j==lent-1){
        				xAxisOther="共计";
        			}else{
        				xAxisOther=data.cjList[j];
        			}
        			cjTongjiTouOther+="<td "+tabTdClass+" class=' text_decoration1' xAxis='"+xAxisOther+"' yAxis='"+typeOther+"' isTotal='1' isFengcun='2'>"+vosOther[j][0]+"/"+vosOther[j][1]+"</td>";
        			/*if(j==lent-1){
        				tabTdClass="";
        			}*/
        			cjTongjiWeiOther+="<td  "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisOther+"' yAxis='"+typeOther+"' isTotal='0' isFengcun='2'>"+vosOther[j][2]+"/"+vosOther[j][3]+"</td>";
        		}
        		otherTr+=cjTongjiTouOther+cjTongjiWeiOther+"</tr>";
        	}
        	$("#onlineratecount-otherTabFc").empty().append(otherTr);
        	var lastOther=data.otherList[lenOther-1];
        	var cjTongjiTouOtherXj="<td width="+width1+">其它小计</td>";
        	var cjTongjiWeiOtherXj="";
        	for (var i=0,lent=lastOther.vos.length;i<lent;i++) {
        		var tabTdClass="width="+width;
        		var xAxisOtherXj="";
    			if(i==lent-1){
    				/*tabTdClass="";*/ 
    				xAxisOtherXj="共计";
    			}else{
    				xAxisOtherXj=data.cjList[i];
    			}
        		/*cjTongjiTouOtherXj+="<td class='tabTdWidth text_decoration1' xAxis='"+xAxisOtherXj+
        		"' yAxis='其它小计' isTotal='1' isFengcun='2' width='"+width1+"'>"+lastOther.vos[i][0]
        		+"/"+lastOther.vos[i][1]+"</td>";*/
    			cjTongjiTouOtherXj+="<td class='text_decoration1' xAxis='"+xAxisOtherXj+
        		"' yAxis='其它小计' isTotal='1' isFengcun='2' width='"+width1+"'>"+lastOther.vos[i][0]
        		+"/"+lastOther.vos[i][1]+"</td>";
        		cjTongjiWeiOtherXj+="<td "+tabTdClass+" class='text_decoration2' xAxis='"+xAxisOtherXj+"' yAxis='其它小计' isTotal='0' isFengcun='2'>"+lastOther.vos[i][2]+"/"+lastOther.vos[i][3]+"</td>";
        	}
        	$("#onlineratecount-otherTabCountFc").empty().append(cjTongjiTouOtherXj+cjTongjiWeiOtherXj);
        	
        	setTimeout(function(){
        		$(".onlineratecount-leftDiv-KeepDiv").css({"top":($(".onlineratecount-leftDiv-inUseDiv-TabDiv").height()+130)});
        		$(".onlineratecount-leftDiv-otherDiv").css({"top":($(".onlineratecount-leftDiv-inUseDiv-TabDiv").height()+$(".onlineratecount-leftDiv-KeepDiv-TabDiv").height()+130+45)});
        		RTU.invoke("app.onlineratecount.query.initTdEvent");
        	},100);
        	$("#onlineratecount-search-beginDate").val(data.min_onlineDate);
        	$("#onlineratecount-search-endDate").val(data.max_onlineDate);
        	if(data.flag&&data.flag=="Y"){
        	}else{
        		//更新右边列表
        		var condition={
        				isRight:"Y",
        				simInstall:1
        		};
        		RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	}
    	};
    });
        
    RTU.register("app.onlineratecount.query.initTdEvent",function(){
    	return function(){
    		var height=$(".onlineratecount-MainDiv").height();		
    		$(".text_decoration1").unbind("click").click(function(){
    			var param={};
    			param.xaxis=$(this).attr("xaxis");
    			param.yaxis=$(this).attr("yaxis");
    			param.istotal=$(this).attr("istotal");
    			param.isfengcun=$(this).attr("isfengcun");
    			param.isRight="N";//注注注注注注注注注注注注注注注注//需要加一个参数来判断是总数还是LAIS装车，如果是总数  的，需要进行动车判断
    			$("#onlineratecount-rightDiv-simInstall-allDiv").removeClass("hidden");
    			$("#onlineratecount-rightDiv-simInstall-yDiv").removeClass("hidden").addClass("hidden");
    			$(".onlineratecount-rightDiv-resultTabDiv").css("height",height-200-$(".onlineratecount-rightDiv-countDiv").height());
    			$(".onlineratecount-rightDiv-resultDiv").css("height",height-140-$(".onlineratecount-rightDiv-countDiv").height());
    			$("#onlineratecount-bodyDiv-body-grid").removeClass("hidden");
    			$("#onlineratecount-bodyDiv-body-grid1").removeClass("hidden").addClass("hidden");
    			onlineratecountGrid.param.tableHeight=height-170-$(".onlineratecount-rightDiv-countDiv").height();
    			onlineratecountGrid.refresh();
    			RTU.invoke("app.onlineratecount.query.createConditions",param);
    		});
		
    		//LAIS装车/LAIS上线
    		$(".text_decoration2").unbind("click").click(function(){
    			var param={};
    			param.xaxis=$(this).attr("xaxis");
    			param.yaxis=$(this).attr("yaxis");
    			param.istotal=$(this).attr("istotal");
    			param.isfengcun=$(this).attr("isfengcun");
    			param.isRight="Y";//注注注注注注注注注注注注注注注注//需要加一个参数来判断是总数还是LAIS装车，如果是总数  的，需要进行动车判断
    			$("#onlineratecount-rightDiv-simInstall-allDiv").removeClass("hidden").addClass("hidden");
    			$("#onlineratecount-rightDiv-simInstall-yDiv").removeClass("hidden");
    			$(".onlineratecount-rightDiv-resultTabDiv").css("height",height-200-$(".onlineratecount-rightDiv-countDiv").height());
    			
    			$(".onlineratecount-rightDiv-resultDiv").css("height",height-170-$(".onlineratecount-rightDiv-countDiv").height());
    			
    			$("#onlineratecount-bodyDiv-body-grid1").removeClass("hidden");
    			$("#onlineratecount-bodyDiv-body-grid").removeClass("hidden").addClass("hidden");
    			
    			onlineratecountGrid1.param.tableHeight=height-200-$(".onlineratecount-rightDiv-countDiv").height();
    			onlineratecountGrid1.refresh();
    			
    			RTU.invoke("app.onlineratecount.query.createConditions",param);
    		});
    	};
    });
    
    var totalcount=function(){
    	var height=$(".onlineratecount-MainDiv").height();
		var param={};
		param.xaxis="共计";
		param.yaxis="合计";
		param.istotal="0";
		param.isfengcun="";
		param.isRight="Y";//注注注注注注注注注注注注注注注注//需要加一个参数来判断是总数还是LAIS装车，如果是总数  的，需要进行动车判断
		
		$("#onlineratecount-rightDiv-simInstall-allDiv").removeClass("hidden").addClass("hidden");
		$("#onlineratecount-rightDiv-simInstall-yDiv").removeClass("hidden");
		
		$(".onlineratecount-rightDiv-resultTabDiv").css("height",height-200-$(".onlineratecount-rightDiv-countDiv").height());
		
		$(".onlineratecount-rightDiv-resultDiv").css("height",height-170-$(".onlineratecount-rightDiv-countDiv").height());
		
		$("#onlineratecount-bodyDiv-body-grid1").removeClass("hidden");
		$("#onlineratecount-bodyDiv-body-grid").removeClass("hidden").addClass("hidden");
		
		onlineratecountGrid1.param.tableHeight=height-200-$(".onlineratecount-rightDiv-countDiv").height();
		onlineratecountGrid1.refresh();		
		RTU.invoke("app.onlineratecount.query.createConditions",param);
    };
    
    RTU.register("app.onlineratecount.query.createConditions",function(){
    	return function(param){
    		var condition={};
    		condition.isRight=param.isRight;
    			if(param.xaxis=="共计"){
    				if(param.yaxis=="合计"){///x为共计，y为合计，这只可能是  最上边  的机车总数的  共计 或者LAIS装车的  共计，此时，不存在 封存 和 运用 的分类了
    					//1(总数)  0   
    					if(param.istotal=="1"){//最上边的机车总数的  共计
    						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){//最上边的  LAIS装车的  共计
    	    				condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}else if(param.yaxis=="运用小计"){//运用小计   ///x为共计，y为运用小计，这只可能是  运用小计   的机车总数的  共计 或者LAIS装车的  共计，此时，不存在 封存 和 运用 的分类了
        				//1(总数)  0   
    					if(param.istotal=="1"){//运用小计的机车总数的  共计
    						condition.fcjc=0;
    						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){//运用小计  LAIS装车的  共计
    	    				condition.fcjc=0;
    	    				condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}else if(param.yaxis=="修程小计"){//修程小计    ///x为共计，y为封存小计，这只可能是  修程小计   的机车总数的  共计 或者LAIS装车的  共计，此时，不存在 封存 和 运用 的分类了
        				//1(总数)  0   
    					if(param.istotal=="1"){//封存小计的机车总数的  共计
    						condition.fcjc=1;
    						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){//修程小计  LAIS装车的  共计
    	    				condition.fcjc=1;
    	    				condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}
        			else if(param.yaxis=="其它小计"){//修程小计    ///x为共计，y为封存小计，这只可能是  修程小计   的机车总数的  共计 或者LAIS装车的  共计，此时，不存在 封存 和 运用 的分类了
        				//1(总数)  0   
        				condition.fcState=true;
    					if(param.istotal=="1"){//封存小计的机车总数的  共计
    						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){//修程小计  LAIS装车的  共计
    	    				condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}
        			else{//此时点击的是某一种车型的td，需要判断是否封存和是否为总数
        				if(param.isfengcun=="0"){//1(封存)  0   ///此时为运用机车的某种车型的  共计   （总数的共计  或者装车的共计）
        					if(param.istotal=="1"){//1(总数)  0    ///此时为运用机车的某种车型的   总数的   共计  
        						condition.fcjc=0;
        						condition.typeName=param.yaxis;
        						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ ///此时为运用机车的某种车型的   装车的   共计
        	    				condition.fcjc=0;
        	    				condition.simInstall=1;
        						condition.typeName=param.yaxis;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}else if(param.isfengcun=="1"){  ///此时为封存机车的某种修程类型的  共计   （总数的共计  或者装车的共计）
            				if(param.istotal=="1"){//1(总数)  0    ///此时为修程机车的某种修程类型的   总数的   共计  
            					condition.fcjc=1;
        						condition.typeName=param.yaxis;
            					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ ///此时为封存机车的某种车型的   装车的   共计
        	    				condition.fcState=true;
        	    				condition.simInstall=1;
        						condition.typeName=param.yaxis;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}
            			else if(param.isfengcun=="2"){  ///此时为封存机车的某种修程类型的  共计   （总数的共计  或者装车的共计）
            				condition.fcState=true;
            				if(param.istotal=="1"){//1(总数)  0    ///此时为修程机车的某种修程类型的   总数的   共计  
        						condition.typeName=param.yaxis;
            					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ ///此时为封存机车的某种车型的   装车的   共计
        	    				condition.simInstall=1;
        						condition.typeName=param.yaxis;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}
        			}
    			}else{//不是共计，则是点击的是车间的  除了  共计 列  的td
    				if(param.yaxis=="合计"){//此时点击的是  最上边的除去  共计  列的td   y为合计，则不存在  封存  和  运用  的分类判断
    					if(param.istotal=="1"){//1(总数)  0    //此时为最上边的总数 的  某车间  的合计td
    						condition.cj=param.xaxis;
    						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){  //此时为最上边的LAIS装车 的  某车间  的合计td
    	    				condition.simInstall=1;
    	    				condition.cj=param.xaxis;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        				
        			}else if(param.yaxis=="运用小计"){//运用小计  //此时点击的是  运用小计的除去  共计  列的td
        				if(param.istotal=="1"){//1(总数)  0    //此时为运用小计的总数 的  某车间  的合计td
        					condition.fcjc=0;
        					condition.cj=param.xaxis;
        					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){  //此时为运用小计的LAIS装车 的  某车间  的合计td
    	    				condition.fcjc=0;
        					condition.cj=param.xaxis;
        					condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}else if(param.yaxis=="修程小计"){//修程小计  //此时点击的是  封存小计的除去  共计  列的td
        				if(param.istotal=="1"){//1(总数)  0    //此时为封存小计的总数 的  某车间  的合计td
        					condition.fcjc=1;
        					condition.cj=param.xaxis;
        					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){  //此时为封存小计的LAIS装车 的  某车间  的合计td
    	    				condition.fcjc=1;
        					condition.cj=param.xaxis;
        					condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}
        			else if(param.yaxis=="其它小计"){//修程小计  //此时点击的是  封存小计的除去  共计  列的td
        				condition.fcState=true;
        				if(param.istotal=="1"){//1(总数)  0    //此时为封存小计的总数 的  某车间  的合计td
        					
        					condition.cj=param.xaxis;
        					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}else if(param.istotal=="0"){  //此时为封存小计的LAIS装车 的  某车间  的合计td
    	    				
        					condition.cj=param.xaxis;
        					condition.simInstall=1;
    	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
    	    			}
        			}
        			else{//此时点击的是  某种车型除去  共计  列的td（同时除去运用小计和封存小计）
        				if(param.isfengcun=="1"){//1(封存)  0   //此时为某车间  封存  的  某车型  的  除去  共计  列的td
        					if(param.istotal=="1"){//1(总数)  0   //此时为 某车间  封存 的 某车型  的  总数 的 除去  共计  列 的td
        						condition.cj=param.xaxis;
        						condition.fcjc=1;
        						condition.typeName=param.yaxis;
        						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ //此时为 某车间  封存 的 某车型  的  LAIS装车 的 除去  共计  列 的td
        	    				condition.cj=param.xaxis;
        						condition.fcjc=1;
        						condition.typeName=param.yaxis;
            					condition.simInstall=1;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}if(param.isfengcun=="2"){//1(封存)  0   //此时为某车间  封存  的  某车型  的  除去  共计  列的td
        					condition.fcState=true;
            				if(param.istotal=="1"){//1(总数)  0   //此时为 某车间  封存 的 某车型  的  总数 的 除去  共计  列 的td
        						condition.cj=param.xaxis;
        						
        						condition.typeName=param.yaxis;
        						RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ //此时为 某车间  封存 的 某车型  的  LAIS装车 的 除去  共计  列 的td
        	    				condition.cj=param.xaxis;
        						
        						condition.typeName=param.yaxis;
            					condition.simInstall=1;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}
        				else if(param.isfengcun=="0"){ //此时为某车间  运用  的  某车型  的  除去  共计  列的td
            				if(param.istotal=="1"){//1(总数)  0   //此时为 某车间  运用 的 某车型  的  总数 的 除去  共计  列 的td
            					condition.cj=param.xaxis;
        						condition.fcjc=0;
        						condition.typeName=param.yaxis;
            					RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}else if(param.istotal=="0"){ //此时为 某车间  运用 的 某车型  的  LAIS装车 的 除去  共计  列 的td
        	    				condition.cj=param.xaxis;
        						condition.fcjc=0;
        						condition.typeName=param.yaxis;
            					condition.simInstall=1;
        	    				RTU.invoke("app.onlineratecount.query.filterDatas",condition);
        	    			}
            			}
        			}
    			}
    	};
    });

    RTU.register("app.onlineratecount.query.filterDatas",function(){
    	return function(condition){
    		
//    		condition.cj=param.xaxis;
//			condition.fcjc=0;
//			condition.typeName=param.yaxis;
//			condition.simInstall=1;
    		if(condition){
        		window.afterFilterDatas=[];
        		var dongcheArr=[];
        		for(var i=0;i<locoData.length;i++){
        			var flag_cj="N";
        			var flag_fcjc="N";
        			var flag_fcState="N";
        			var flag_typeName="N";
        			var flag_simInstall="N";
        			if(condition.cj){
        				if(locoData[i].cj!=condition.cj){
        					flag_cj="N";
        				}else{
        					flag_cj="Y";
        				}
        			}else{
        				flag_cj="Y";
        			}
        			if(condition.fcjc=="0"||condition.fcjc=="1"){
        				if(locoData[i].fcjc!=condition.fcjc){
            				flag_fcjc="N";
            			}else{
            				flag_fcjc="Y";
            			}
        			}else{
        				flag_fcjc="Y";
        			}
        			
        			if(condition.fcState){
        				if(locoData[i].fcState==5||locoData[i].fcState==6||locoData[i].fcState==2
        						||locoData[i].fcState==3){
        					flag_fcState="Y";
        				}else{
        					flag_fcState="N";
        				}
        			}else{
        				if(condition.fcjc=="1"){
        					if(locoData[i].fcState==5||locoData[i].fcState==6||locoData[i].fcState==2
            						||locoData[i].fcState==3){
            					flag_fcState="N";
            				}else{
            					flag_fcState="Y";
            				}
            			}else{
            				flag_fcState="Y";
            			}
        			}
        			
        			if(condition.typeName){
        				if(locoData[i].typeName!=condition.typeName&&locoData[i].checkTypeName!=condition.typeName){
            				flag_typeName="N";
            			}else{
            				flag_typeName="Y";
            			}
        			}else{
        				flag_typeName="Y";
        			}
        			
        			if(condition.simInstall=="0"||condition.simInstall=="1"){
        				if(locoData[i].simInstall!=condition.simInstall){
        					flag_simInstall="N";
            			}else{
            				flag_simInstall="Y";
            			}
        			}else{
        				flag_simInstall="Y";
        			}
        			
        			if(flag_cj=="Y"&&flag_fcjc=="Y"&&flag_typeName=="Y"&&flag_simInstall=="Y"
        				&&flag_fcState=="Y"){
        				if(condition.isRight=="N"){
        					if((locoData[i].typeName.substring(0,3).toUpperCase()=="CRH") || (locoData[i].typeName.toUpperCase()=="SS4")){
        						if(locoData[i].simInstall=="0"){
        							window.afterFilterDatas.push(locoData[i]);
        						}else{
        							if(dongcheArr&&dongcheArr.length==0){
            							dongcheArr.push(locoData[i]);
            							window.afterFilterDatas.push(locoData[i]);
            						}else if(dongcheArr&&dongcheArr.length==1){
            							dongcheArr=[];
            						}
        						}
        						
        					}else{
        						window.afterFilterDatas.push(locoData[i]);
        					}
        				}else{
        					window.afterFilterDatas.push(locoData[i]);
        				}
        			}
        		}
        		if(condition.isRight=="N"){
        			onlineratecountGrid.refresh(window.afterFilterDatas);
        		}else{
        			onlineratecountGrid1.refresh(window.afterFilterDatas);
        		}
        		
        		$("#onlineratecount-rightDiv-resultSize").text(window.afterFilterDatas.length);
        		
        		RTU.invoke("app.onlineratecount.query.initRightBtnVal",condition.isRight);
    		}else{
    			onlineratecountGrid.refresh([]);
    			onlineratecountGrid1.refresh([]);
    			$("#onlineratecount-rightDiv-resultSize").text(0);
    			window.afterFilterDatas=[];
    			
    			RTU.invoke("app.onlineratecount.query.initRightBtnVal",condition.isRight);
    		}

    	};
    });
    
    
    RTU.register("app.onlineratecount.query.initRightBtnVal",function(){
    	return function(isRight){

    		var grid= $("#onlineratecount-bodyDiv-body-grid .RTTable_Head input");
    		var grid1=$("#onlineratecount-bodyDiv-body-grid1 .RTTable_Head input");
    		
    		if(grid[0].checked==true){
    			grid[0].click();
    		}
    		if(grid1[0].checked==true){
    			grid1[0].click();
    		}
    		
    		if(isRight=="Y"){
    			var tscCorp_sw=0;
    			var tscCorp_zs=0;
    			var tscType_tsc1=0;
    			var tscType_tsc2=0;
    			var isOnline_y=0;
    			var isOnline_n=0;
    			for(var i=0;i<window.afterFilterDatas.length;i++){
    				if(window.afterFilterDatas[i].tscCorp=="河南思维"){
    					tscCorp_sw++;
    				}else{
    					tscCorp_zs++;
    				}
    				
    				if(window.afterFilterDatas[i].tscType=="TSC1"){
    					tscType_tsc1++;
    				}else{
    					tscType_tsc2++;
    				}
    				
    				if(window.afterFilterDatas[i].isOnline=="1"){
    					isOnline_y++;
    				}else{
    					isOnline_n++;
    				}
    			}
    			$("#onlineratecount_tscCorp_all").val("全部("+(window.afterFilterDatas.length)+")");
    			$("#onlineratecount_tscCorp_sw").val("思维("+(tscCorp_sw)+")");
    			$("#onlineratecount_tscCorp_zs").val("株所("+(tscCorp_zs)+")");
    			
    			$("#onlineratecount_tscType_all").val("全部("+(window.afterFilterDatas.length)+")");
    			$("#onlineratecount_tscType_tsc1").val("TSC1("+(tscType_tsc1)+")");
    			$("#onlineratecount_tscType_tsc2").val("TSC2("+(tscType_tsc2)+")");
    			
    			$("#onlineratecount_isOnline_all").val("全部("+(window.afterFilterDatas.length)+")");
    			$("#onlineratecount_isOnline_y").val("上线("+(isOnline_y)+")");
    			$("#onlineratecount_isOnline_n").val("未上("+(isOnline_n)+")");
    			
    			
    			$(".onlineratecount_tscCorp").removeClass("backgroundImg").removeAttr("tscCorpClick").removeAttr("disabled");
    			$(".onlineratecount_tscType").removeClass("backgroundImg").removeAttr("tscTypeClick").removeAttr("disabled");
    			$(".onlineratecount_isOnline").removeClass("backgroundImg").removeAttr("isOnlineClick").removeAttr("disabled");
    			
    			$("#onlineratecount_tscCorp_all").attr("tscCorpClick",$("#onlineratecount_tscCorp_all").attr("alt")).addClass("backgroundImg");
    			$("#onlineratecount_tscType_all").attr("tscTypeClick",$("#onlineratecount_tscType_all").attr("alt")).addClass("backgroundImg");;
    			$("#onlineratecount_isOnline_all").attr("isOnlineClick",$("#onlineratecount_isOnline_all").attr("alt")).addClass("backgroundImg");;
    			
    			
    		}else{
    			
    			var carKind_normal=0;
    			var carKind_dongche=0;
    			var simInstall_y=0;
    			var simInstall_n=0;
    			
    			for(var i=0;i<window.afterFilterDatas.length;i++){
    				
    				if((window.afterFilterDatas[i].typeName.substring(0,3).toUpperCase()=="CRH") || (window.afterFilterDatas[i].typeName.toUpperCase()=="SS4")){
						carKind_dongche++;
					}else{
						carKind_normal++;
					}
    				
    				if(window.afterFilterDatas[i].simInstall=="1"){
    					simInstall_y++;
    				}else{
    					simInstall_n++;
    				}
    			}
    			
    			$("#onlineratecount_carKind_all").val("全部("+(window.afterFilterDatas.length)+")");
    			$("#onlineratecount_carKind_normal").val("机车("+(carKind_normal)+")");
    			$("#onlineratecount_carKind_dongche").val("动车("+(carKind_dongche)+")");
    			
    			$("#onlineratecount_simInstall_all").val("全部("+(window.afterFilterDatas.length)+")");
    			$("#onlineratecount_simInstall_y").val("装车("+(simInstall_y)+")");
    			$("#onlineratecount_simInstall_n").val("未装("+(simInstall_n)+")");
    			
    			
    			$(".onlineratecount_carKind").removeClass("backgroundImg").removeAttr("carKindClick").removeAttr("disabled");
    			$(".onlineratecount_simInstall").removeClass("backgroundImg").removeAttr("simInstallClick").removeAttr("disabled");
    			$("#onlineratecount_carKind_all").attr("carKindClick",$("#onlineratecount_carKind_all").attr("alt")).addClass("backgroundImg");
    			$("#onlineratecount_simInstall_all").attr("simInstallClick",$("#onlineratecount_simInstall_all").attr("alt")).addClass("backgroundImg");
    			
    		}
    	};
    });
    
    RTU.register("app.onlineratecount.query.initRightBtn",function(){
    	return function(){
    		//厂家
    		$(".onlineratecount_tscCorp").unbind("click").click(function(){
    			$(".onlineratecount_tscCorp").removeAttr("disabled");
				$(".onlineratecount_tscCorp").removeAttr("tscCorpClick");
				$(".onlineratecount_tscCorp").removeClass("backgroundImg");
				$(this).attr({"disabled":"true","tscCorpClick":$(this).attr("alt")});
				$(this).addClass("backgroundImg");
				var clickAlt={
						isRight:"Y",
						tscCorp_type:$(this).attr("alt"),
						tscType_type:$("input[class*='onlineratecount_tscType backgroundImg']").attr("tscTypeClick"),
						isOnline_type:$("input[class*='onlineratecount_isOnline backgroundImg']").attr("isOnlineClick"),
						loco:$("#onlineratecount_loco").val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
    		//型号
			$(".onlineratecount_tscType").unbind("click").click(function(){
				$(".onlineratecount_tscType").removeAttr("disabled");
				$(".onlineratecount_tscType").removeAttr("tscTypeClick");
				$(".onlineratecount_tscType").removeClass("backgroundImg");
				$(this).attr({"disabled":"true","tscTypeClick":$(this).attr("alt")});
				$(this).addClass("backgroundImg");
				
				var clickAlt={
						isRight:"Y",
						tscCorp_type:$("input[class*='onlineratecount_tscCorp backgroundImg']").attr("tscCorpClick"),
						tscType_type:$(this).attr("alt"),
						isOnline_type:$("input[class*='onlineratecount_isOnline backgroundImg']").attr("isOnlineClick"),
						loco:$("#onlineratecount_loco").val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
			//上线
			$(".onlineratecount_isOnline").unbind("click").click(function(){
				$(".onlineratecount_isOnline").removeAttr("disabled");
				$(".onlineratecount_isOnline").removeAttr("isOnlineClick");
				$(".onlineratecount_isOnline").removeClass("backgroundImg");
				$(this).attr({"disabled":"true","isOnlineClick":$(this).attr("alt")});
				$(this).addClass("backgroundImg");
				
				var clickAlt={
						isRight:"Y",
						tscCorp_type:$("input[class*='onlineratecount_tscCorp backgroundImg']").attr("tscCorpClick"),
						tscType_type:$("input[class*='onlineratecount_tscType backgroundImg']").attr("tscTypeClick"),
						isOnline_type:$(this).attr("alt"),
						loco:$("#onlineratecount_loco").val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
			
			
			
			///种类
			$(".onlineratecount_carKind").unbind("click").click(function(){
				$(".onlineratecount_carKind").removeAttr("disabled");
				$(".onlineratecount_carKind").removeAttr("carKindClick");
				$(".onlineratecount_carKind").removeClass("backgroundImg");
				$(this).attr({"carKindClick":$(this).attr("alt"),"disabled":"true"});
				$(this).addClass("backgroundImg");
				
				var clickAlt={
						isRight:"N",
						carKind_type: $(this).attr("alt"),
						simInstall_type:$("input[class*='onlineratecount_simInstall backgroundImg']").attr("simInstallClick"),
						loco:$("#onlineratecount_loco").val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
			//装车
			$(".onlineratecount_simInstall").unbind("click").click(function(){
				$(".onlineratecount_simInstall").removeAttr("disabled");
				$(".onlineratecount_simInstall").removeAttr("simInstallClick");
				$(".onlineratecount_simInstall").removeClass("backgroundImg");
				$(this).attr({"simInstallClick":$(this).attr("alt"),"disabled":"true"});
				$(this).addClass("backgroundImg");
				var clickAlt={
						isRight:"N",
						simInstall_type: $(this).attr("alt"),
						carKind_type:$("input[class*='onlineratecount_carKind backgroundImg']").attr("carKindClick"),
						loco:$("#onlineratecount_loco").val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
			
			
			$("#onlineratecount_loco").keyup(function(e){
				var isRight = $("div[class='onlineratecount-rightDiv-countDiv']").attr("alt");
				var clickAlt={
						isRight:isRight,
						simInstall_type: $(".onlineratecount_simInstall").attr("simInstallClick"),
						carKind_type:$(".onlineratecount_carKind").attr("carKindClick"),
						tscCorp_type:$(".onlineratecount_tscCorp").attr("tscCorpClick"),
						tscType_type:$(".onlineratecount_tscType").attr("tscTypeClick"),
						isOnline_type:$(".onlineratecount_isOnline").attr("isOnlineClick"),
						loco:$(this).val()
				};
				RTU.invoke("app.onlineratecount.query.createRightDataConditions",clickAlt);
			});
			
    	};
    });
    
    
    RTU.register("app.onlineratecount.query.createRightDataConditions",function(){
    	return function(clickAlt){
    		var condition={};
    		condition.isRight=clickAlt.isRight;
    		condition.loco=clickAlt.loco;
    		if(clickAlt.isRight=="Y"){
//    			var clickAlt={
//						isRight:"N",
//						tscCorp_type: $(this).attr("alt"),
//						tscType_type:$(".onlineratecount_tscType").attr("tscTypeClick"),
//						isOnline_type:$(".onlineratecount_isOnline").attr("isOnlineClick"),
//						loco:$("#onlineratecount_loco").val()
//				};
    			if(clickAlt.tscCorp_type=="tscCorp_all"){
    				if(clickAlt.tscType_type=="tscType_all"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//全部
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//上线
    						condition.isOnline=1;
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//未上
    						condition.isOnline=0;
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else if(clickAlt.tscType_type=="tscType_tsc1"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//TSC1
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//TSC1  且 上线
    						condition.isOnline=1;
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//TSC1 且  未上
    						condition.isOnline=0;
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else{
    					if(clickAlt.isOnline_type=="isOnline_all"){//TSC2
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//TSC2  且 上线
    						condition.isOnline=1;
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//TSC2 且  未上
    						condition.isOnline=0;
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}
    			}else if(clickAlt.tscCorp_type=="tscCorp_sw"){
    				if(clickAlt.tscType_type=="tscType_all"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//思维
    						condition.tscCorp="河南思维";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//思维 且 上线
    						condition.isOnline=1;
    						condition.tscCorp="河南思维";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//思维 且 未上
    						condition.isOnline=0;
    						condition.tscCorp="河南思维";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else if(clickAlt.tscType_type=="tscType_tsc1"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//思维 且 TSC1
    						condition.tscCorp="河南思维";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//思维 且 TSC1  且 上线
    						condition.isOnline=1;
    						condition.tscCorp="河南思维";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//思维 且 TSC1 且  未上
    						condition.isOnline=0;
    						condition.tscCorp="河南思维";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else{
    					if(clickAlt.isOnline_type=="isOnline_all"){//思维 且 TSC2
    						condition.tscCorp="河南思维";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//思维 且 TSC2  且 上线
    						condition.isOnline=1;
    						condition.tscCorp="河南思维";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//思维 且 TSC2 且  未上
    						condition.isOnline=0;
    						condition.tscCorp="河南思维";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}
    			}else{
    				if(clickAlt.tscType_type=="tscType_all"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//株所
    						condition.tscCorp="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//株所 且 上线
    						condition.isOnline=1;
    						condition.tscCorp="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//株所 且 未上
    						condition.isOnline=0;
    						condition.tscCorp="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else if(clickAlt.tscType_type=="tscType_tsc1"){
    					if(clickAlt.isOnline_type=="isOnline_all"){//株所 且 TSC1
    						condition.tscCorp="other";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//株所 且 TSC1  且 上线
    						condition.isOnline=1;
    						condition.tscCorp="other";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//株所 且 TSC1 且  未上
    						condition.isOnline=0;
    						condition.tscCorp="other";
    						condition.tscType="TSC1";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}else{
    					if(clickAlt.isOnline_type=="isOnline_all"){//株所 且 TSC2
    						condition.tscCorp="other";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else if(clickAlt.isOnline_type=="isOnline_y"){//株所 且 TSC2  且 上线
    						condition.isOnline=1;
    						condition.tscCorp="other";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}else{//株所 且 TSC2 且  未上
    						condition.isOnline=0;
    						condition.tscCorp="other";
    						condition.tscType="other";
    						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
    					}
    				}
    			}
    			
    		}else{
				if(clickAlt.carKind_type=="carKind_all"){
					if(clickAlt.simInstall_type=="simInstall_all"){//全部
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else if(clickAlt.simInstall_type=="simInstall_y"){//装车
						condition.simInstall=1;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else{//未装
						condition.simInstall=0;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}
				}else if(clickAlt.carKind_type=="carKind_normal"){
					if(clickAlt.simInstall_type=="simInstall_all"){//机车
						condition.kind="normal";
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else if(clickAlt.simInstall_type=="simInstall_y"){//装车  且  机车
						condition.kind="normal";
						condition.simInstall=1;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else{//未装  且  机车
						condition.kind="normal";
						condition.simInstall=0;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}
				}else{
					if(clickAlt.simInstall_type=="simInstall_all"){//动车
						condition.kind="dongche";
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else if(clickAlt.simInstall_type=="simInstall_y"){//装车  且  动车
						condition.kind="dongche";
						condition.simInstall=1;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}else{//未装  且  动车
						condition.kind="dongche";
						condition.simInstall=0;
						RTU.invoke("app.onlineratecount.query.filterRightData",condition);
					}
				}
    		}
    	};
    });
    
    RTU.register("app.onlineratecount.query.filterRightData",function(){
    	return function(condition){
    		var showArr=[];

    			for(var i=0;i<window.afterFilterDatas.length;i++){
    				var  flag_kind="N";
    				var  flag_simInstall="N";
    				var  flag_loco="N";
    				var  flag_tscCorp="N";
    				var  flag_tscType="N";
    				var  flag_isOnline="N";
    				
    				if(condition.kind){
    					if(condition.kind=="normal"){
        					if((window.afterFilterDatas[i].typeName.substring(0,3).toUpperCase()=="CRH") || (window.afterFilterDatas[i].typeName.toUpperCase()=="SS4")){
        						flag_kind="N";
        					}else{
        						flag_kind="Y";
        					}
        				}else{
        					if((window.afterFilterDatas[i].typeName.substring(0,3).toUpperCase()=="CRH") || (window.afterFilterDatas[i].typeName.toUpperCase()=="SS4")){
        						flag_kind="Y";
        					}else{
        						flag_kind="N";
        					}
        				}
    				}else{
    					flag_kind="Y";
    				}
    				
					if(condition.simInstall=="0"||condition.simInstall=="1"){
        				if(window.afterFilterDatas[i].simInstall!=condition.simInstall){
        					flag_simInstall="N";
            			}else{
            				flag_simInstall="Y";
            			}
        			}else{
        				flag_simInstall="Y";
        			}
					

					

					if(condition.tscCorp){
						if(condition.tscCorp=="河南思维"){
							if(window.afterFilterDatas[i].tscCorp=="河南思维"){
								flag_tscCorp="Y";
							}else{
								flag_tscCorp="N";
							}
						}else{
							if(window.afterFilterDatas[i].tscCorp=="河南思维"){
								flag_tscCorp="N";
							}else{
								flag_tscCorp="Y";
							}
						}
        				
        			}else{
        				flag_tscCorp="Y";
        			}
					
					if(condition.tscType){
						if(condition.tscType=="TSC1"){
							if(window.afterFilterDatas[i].tscType=="TSC1"){
								flag_tscType="Y";
							}else{
								flag_tscType="N";
							}
						}else{
							if(window.afterFilterDatas[i].tscType=="TSC1"){
								flag_tscType="N";
							}else{
								flag_tscType="Y";
							}
						}
        				
        			}else{
        				flag_tscType="Y";
        			}
					
					
					if(condition.isOnline=="0"||condition.isOnline=="1"){
        				if(window.afterFilterDatas[i].isOnline!=condition.isOnline){
        					flag_isOnline="N";
            			}else{
            				flag_isOnline="Y";
            			}
        			}else{
        				flag_isOnline="Y";
        			}
					
					
					if(condition.loco&&condition.loco!=""){
						var key=window.afterFilterDatas[i].typeName+"-"+window.afterFilterDatas[i].locoNo+RTU.invoke("app.locoAb.getChar",window.afterFilterDatas[i].locoAb);
						if(key.toUpperCase().indexOf((condition.loco).toUpperCase())>=0){
							flag_loco="Y";
						}else{
							flag_loco="N";
						}
					}else{
						flag_loco="Y";
					}
            			
					if(flag_kind=="Y"&&flag_simInstall=="Y"&&flag_loco=="Y"&&flag_tscCorp=="Y"&&flag_tscType=="Y"&&flag_isOnline=="Y"){
						showArr.push(window.afterFilterDatas[i]);
					}
    			}
    			
    			if(condition.isRight=="N"){
        			onlineratecountGrid.refresh(showArr);
        		}else{
        			onlineratecountGrid1.refresh(showArr);
        		}
        		
        		$("#onlineratecount-rightDiv-resultSize").text(showArr.length);
    		
    	};
    });

    RTU.register("app.onlineratecount.query.init", function () {
        data = RTU.invoke("app.setting.data", "onlineratecount");
        if (data && data.isActive) {
            RTU.invoke("app.onlineratecount.query.activate");
        }
        return function () {
            return true;
        };
    });

    RTU.register("app.onlineratecount.query.deactivate", function () {
        return function () {
            if (popuwnd_left) {
                popuwnd_left.hidden();
            }
            if (popuwnd_right) {
                popuwnd_right.hidden();
            }
        };
    });

 
});
