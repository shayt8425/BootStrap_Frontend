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
    
    require("app/loading/list-loading.js");
    /*var $html;*/
  
    //初始化按钮
    RTU.register("app.filemanager.query.initButton", function () {
        return function () {};
    });


    //搜索框智能提示
    RTU.register("app.filemanager.query.smartTips.init", function () {
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
                    mustMatch:true,
                    formatItem: function (data, i, totle) {
                        return data;
                    },
                    formatResult: function (format) {
                        return format;
                    }
                }).result(function (event, data, formatted){
                	var arr=formatted.split("_");
                	$("#filemanager_loco").attr("locoAb",data.locoAb);
                	
                });

            } catch (e) {
            }
        };
        var initCheciNameAuto1 = function () {
            CheciNameExParams1 = {
                keyword: function () {
                    return $('#filemanager_loco').val();
                }
            };

            CheciNameParse1 = function (data) {
                data = data.data;
                var rows = [];
                for (var i = 0; i < data.length; i++) {
                    var text1 = $.trim(data[i].locoTypeName);
                    var text4 = $.trim(data[i].locoNO);
                    var text5 = $.trim(data[i].locoAb);
                    //var locoAB=text5;
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
                        value: aa+"_"+$.trim(data[i].locoAb),
                        result: aa
                    };
                }
                return rows;
            };
            autocompleteBuilder1($("#filemanager_loco"), "onlineloco/getByFocus", CheciNameExParams1, CheciNameParse1);
            /*$('#filemanager_loco').result(function (event, autodata, formatted) {
                if (!formatted) {
                	var arr=formatted.split("_");
                    $('#filemanager_loco').val(arr[0]);
                }
            });*/
        };
        return function () {
            setTimeout(function () {
                initCheciNameAuto1();
            }, 10);
        };
    });

    RTU.register("app.filemanager.query.dataInit", function () {
        var initData = function (url) {
            /*RTU.invoke("app.query.loading", {
                object: $("#leftTrainMainDiv"),
                isShow: true
            });*/
            var param = {
                url: url,
                cache: false,
                asnyc: true,
                datatype: "json",
                success: function (data) {
                    if (data.data) {
                        RTU.invoke("app.filemanager1.query.tree.init", data.data);
                    }
                },
                error: function () {
                    /*RTU.invoke("app.query.loading", { object: $("#leftTrainMainDiv"), isShow: false });*/
                }
            };
            RTU.invoke("core.router.get", param);
        };
        return function (str) {
            var url = "";
            if (str.indexOf('-') != -1) {
                var arry = str.split('-');
/*                var locoNoStr=arry[1];
                var isAB=locoNoStr.substring(locoNoStr.length-1,locoNoStr.length).toLocaleUpperCase();//判断最后一个字符（是否有AB节)
                var locoAbStr=  $("#filemanager_loco").attr("locoAB");
//                var locoAbStr="";
            	if(!isNaN(isAB)){  //只有机车号、AB节为0
            		locoAbStr=0;
            	}else{
//            		if(isAB=="A"){ 
//            			locoAbStr =1;
//            		}else if(isAB=="B"){ 
//            			locoAbStr=2;
//            		}
            		locoNoStr=locoNoStr.substring(0,locoNoStr.length-1);
            	}*/
            	var typeId= arry[0];
            	var test=/^[1-9]+[0-9]*]*$/;
            	if(test.test(typeId)){
            		url = "onlineloco/getTreeListByBureau";
            	}else{
            		url = "onlineloco/getTreeListByBureau";
            	}
//                url = "onlineloco/getTreeList?tTypeId=&locoType=" + arry[0] + "&locoNo=" + locoNoStr + "&locoAb="+locoAbStr+"&checiName=&beginTime=&endTime=";
//                url = "onlineloco/getTreeList?locoType=" + arry[0] + "&locoNo=" + arry[1] + "&checiName=&beginTime=&endTime=";
                initData(url);
            } else {
            	url = "onlineloco/getTreeListByBureau";
                initData(url);
            }
        };
    });
    /************************
    *add date:2014-08-06
    * *********************/
    RTU.register("app.filemanager1.query.tree.init", function () {
        ////组装树形子节点
    	var locoItem=function(bid,did,locoTypeId,locoTypeName,data){
    		var locoName=locoTypeName+"-"+
    		data[0]+(data[1]=="1"?"(A)":(data[1]=="2"?"(B)":""));
    		this.$item = $("<div style='margin-left:30%' bid='"+bid+"' did='"+did+"' locoTypeId='"+locoTypeId
    				+"' locoName='"+locoName+"'>"
    				+ $("#leftTrainMainDiv .filemanager-children-loco-div-temp").html() + "</div>");
            this.$item.find(".filemanager-locoName").text(locoName);
            this.$item.find(".filemanager-children-ck").attr({
            "locoStr":locoName,
            "locoTypeId":locoTypeId,
            "locoTypeName": locoTypeName
            , "locoNo": data[0]
            , "locoAb": data[1]
        	, "name":"filemanager-children-ck-name",
        	"lkjType":data[2]
        });
            return this.$item;
    	};
    	
        var locoTypeItem = function (bid,did,data) {

            this.$item = $("<div style='margin-left:20%' bid='"+bid+"' did='"+did+"' locoTypeId='"+data.locoTypeId+"'>"
            		+ $("#leftTrainMainDiv .filemanager-children-traintype-temp").html()
            		+ "</div>");
            this.$item.find(".locoTypeName").text(data.locoTypeName)
            ;
                  
            return this.$item;
        };
        
        var depotItem = function (bid,data) {
            this.$item = $("<div style='margin-left:10%' did='"+data.did+"' bid='"+bid+"'>"
            		+ $("#leftTrainMainDiv .filemanager-children-temp").html() + "</div>");
            this.$item.find(".dName").html(data.dname);
           
            return this.$item;
        };
        
    ////组装树形行父节点 局节点
        var bureauItem = function (data) {
            this.$item = $("<div bid='"+data.bid+"'>" + $("#leftTrainMainDiv .filemanager-father-temp").html() + "</div>");
            this.$item.find(".bName").html(data.bname);
            //this.$item.find(".locoTypeid").html(data.locoTypeid);
            return this.$item;
        };
        
        ////组装数据列表行
        var buildItemTr = function (data) {
            /*this.$item = $("<div>" + $("#file_treeDiv").html() + "</div>");
            this.$item.find(".filetransfer1-father-div").append(new bureauItem(data));*/
        	this.$item = $("<div></div>");
            this.$item.append(new bureauItem(data));
            var curbidDiv=$("<div curbid='"+data.bid+"' class='hidden'></div>");            
            for (var i = 0; i < data.list.length; i++) {
                /*this.$item.find(".filetransfer1-children-div").append(new depotItem(data.bid,data.list[i]));*/
            	curbidDiv.append(new depotItem(data.bid,data.list[i]));
            	var curdidDiv=$("<div curdid='"+data.list[i].did+"' class='hidden'></div>");
            	
                for (var j = 0; j < data.list[i].list.length; j++) {
                    /*this.$item.find(".filetransfer1-children-traintype-div").append(
                    		new locoTypeItem(data.bid,data.list[i].did,data.list[i].list[j]));*/
                	curdidDiv.append(new locoTypeItem(data.bid,data.list[i].did,data.list[i].list[j]));
                	
                	/*this.$item.append(
                    		new locoTypeItem(data.bid,data.list[i].did,data.list[i].list[j]));
                	this.$item.append("<div curlocoTypeId='"+data.list[i].list[j].locoTypeId+"'>");*/
                	var curlocoTypeIdDiv=$("<div curlocoTypeId='"+data.list[i].list[j].locoTypeId+"' class='hidden'></div>");
                    for(var m=0;m<data.list[i].list[j].list.length;m++){
                    	//绘制机车
                    	/*this.$item.find(".filetransfer1-children-loco-div")
                    	.append(new locoItem(data.bid,data.list[i].did,data.list[i].list[j].locoTypeId,
                    			data.list[i].list[j].locoTypeName,data.list[i].list[j].list[m]));*/
                    	/*this.$item
                    	.append(new locoItem(data.bid,data.list[i].did,data.list[i].list[j].locoTypeId,
                    			data.list[i].list[j].locoTypeName,data.list[i].list[j].list[m]));*/
                    	curlocoTypeIdDiv
                    	.append(new locoItem(data.bid,data.list[i].did,data.list[i].list[j].locoTypeId,
                    			data.list[i].list[j].locoTypeName,data.list[i].list[j].list[m]));
                    }
                    curdidDiv.append(curlocoTypeIdDiv);                   
                }
                curbidDiv.append(curdidDiv);     
            }
            this.$item.append(curbidDiv);
            return this.$item;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
            for (var i = 0; i < data.length; i++) {
                $("#leftTrainMainDiv .filemanager-tree-body .filemanager-tree-body-tr").append(new buildItemTr(data[i]));
            }
            /*RTU.invoke("app.query.loading", { object: $("#leftTrainMainDiv .filetransfer1-body"), isShow: false });*/
        };
        ////////树事件处理加载
        var initTreeHandle = function () {
            ///////树收缩和展开事件
            this.treeClick = function () {
                $("#leftTrainMainDiv .filemanager-span-click").unbind("click").click(function () {
                	//图标加号减号点击事件
                    $(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1 ? 
                    		$(".img-btn", $(this)).attr("src", "../static/img/app/zhankai.png") :
							$(".img-btn", $(this)).attr("src", "../static/img/app/shousuo.png");
                    var parentDiv=$(this).parent("div");
                    if(parentDiv.attr("locoTypeId")){
                    	if ($(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1){
                    		$("#leftTrainMainDiv div[curdid='"+parentDiv.attr("did")+"']").find("div[curlocoTypeId='"
                        			+parentDiv.attr("locoTypeId")+"']").addClass("hidden");
                    		
                    	}
                    	else{
                    		$("#leftTrainMainDiv div[curdid='"+parentDiv.attr("did")+"']").find("div[curlocoTypeId='"
                        			+parentDiv.attr("locoTypeId")+"']").removeClass("hidden");
                    	}
                    }
                    else if(parentDiv.attr("did")){
                    	if ($(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1){
                    		$("#leftTrainMainDiv").find("div[curdid='"
                        			+parentDiv.attr("did")+"']").addClass("hidden");
                    	}
                    	else{
                    		$("#leftTrainMainDiv").find("div[curdid='"
                        			+parentDiv.attr("did")+"']").removeClass("hidden");
                    	}
                    }
                    else{
                    	if ($(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1){
                    		$("#leftTrainMainDiv").find("div[curbid='"
                        			+parentDiv.attr("bid")+"']").addClass("hidden");
                    	}
                    	else{
                    		$("#leftTrainMainDiv").find("div[curbid='"
                        			+parentDiv.attr("bid")+"']").removeClass("hidden");
                    	}
                    }
                });
            };
            
            this.treeDblClick=function(){
            	$("#leftTrainMainDiv label.bName,label.dName,label.locoTypeName").dblclick(function () {
            		$(this).prev().prev().click();
            	});
            	
            	
            	
            	/*$("#leftTrainMainDiv label.bName").click(function () {
            		$(this).prev().click();
            	});*/
            };
            //////树父节点全选/全不选
            this.treeFatherCheck = function () {
                $("#leftTrainMainDiv .filemanager-father-ck").click(function () {
                	var parentDiv=$(this).parent("div");
                	if(parentDiv.attr("locoTypeId")){
                		var divs=$("#leftTrainMainDiv").find("div[locoTypeId='"+parentDiv.attr("locoTypeId")+"']");
                		for(var i=0;i<divs.length;i++){
                			$(divs[i]).find("input[type='checkbox']").attr("checked",this.checked);
                		}
                    }
                    else if(parentDiv.attr("did")){
                    	var divs=$("#leftTrainMainDiv").find("div[did='"+parentDiv.attr("did")+"']");
                		for(var i=0;i<divs.length;i++){
                			$(divs[i]).find("input[type='checkbox']").attr("checked",this.checked);
                		}
                    }
                    else{
                    	var divs=$("#leftTrainMainDiv").find("div[bid='"+parentDiv.attr("bid")+"']");
                		for(var i=0;i<divs.length;i++){
                			$(divs[i]).find("input[type='checkbox']").attr("checked",this.checked);
                		}
                    }
                });
            };
            //////树子节点全选/一不选->父节点选中/未选中
            var ckbClickFlag = true; //切换用(判断是否点击的是复选框而不是行)
            this.treeChildrenCheck = function () {
                //复选框选中单击事件
                $("#leftTrainMainDiv input[type='checkbox']").click(function () {
                	
                    ckbClickFlag = false;
                    if (this.checked) {//判断复选框是否被选中
                    	 this.checked=true;
                         
                    } else {
                    	 this.checked=false;
                    }
                    
                    var checkedItems=$("#leftTrainMainDiv input[type='checkbox'][locoNo]:checked");
                    var locoStr="";
                    var queryData={};
                    
                   
                	if(checkedItems.length>0&&checkedItems.length
                    		!=$("#leftTrainMainDiv input[type='checkbox'][locoNo]").length){
                		var locoStr="";
                    	for(var i=0;i<checkedItems.length;i++){                    		
                    		if($(checkedItems[i]).attr("name")=="filemanager-children-ck-name"){
                    			locoStr+=$(checkedItems[i]).attr("locoTypeId")+","+
                    			$(checkedItems[i]).attr("locoNo")+","+$(checkedItems[i]).attr("locoAb")+";";
                    		}
                    	}
                    	locoStr=locoStr.substring(0,locoStr.length-1);
                	}
                	
                    queryData.url="../filemanager/searchFilesByLoco?locoStr="+locoStr;
                	RTU.invoke("app.filemanager.query.showData",queryData);
                });
                
                //左边上次点击的行
                var lastClickDiv=null;
                //行选中单击事件
                $("#leftTrainMainDiv div[bid]").click(function () {               	
                	if(lastClickDiv)
                		lastClickDiv.removeClass("file_upload_clickTr");	
                	lastClickDiv=$(this);                	                	
                	if(!$(this).hasClass("file_upload_clickTr")){
                		$(this).addClass("file_upload_clickTr");
                	}
                	/*if($(this).find("input[type='checkbox']").attr("checked")){
                		$(this).find("input[type='checkbox']").attr("checked",false);
                	}
                	else $(this).find("input[type='checkbox']").attr("checked",true);
                	;*/
                	
                	
                });
            };          
            this.init = function () {
                ///////树收缩和展开事件
                this.treeClick();
                //////树父节点全选/全不选
                this.treeFatherCheck();
                //////树子节点全选/一不选->父节点选中/未选中
                this.treeChildrenCheck();
                
                this.treeDblClick();
            };
            this.init();

        };
        return function (data) {
            ///////先清除上次append的html
            $("#leftTrainMainDiv .filemanager-tree-body-tr").empty();
            ///////建立树形Html
            buildTreeHtml(data);
            ///////树事件处理加载
            initTreeHandle();
        };

    });

	RTU.register("app.filemanager.query.showData",function(){
		var initClickFn=function(){
    		$(".RTTable-Body tbody tr a[fileName='']","#filemanager-bodyDiv-body-grid").unbind("click").bind("click",function(){
    			/*var tds=$(this).parent("td").parent("tr").children("td");
    			var paramData = {};paramData.locoTypeName=$(tds[2]).find("a").html().split("-")[0];
    			paramData.locono=$(tds[2]).find("a").html().split("-")[1];
    			var arr=new Array();
    			arr.push(paramData);
    			arr.push((fileName=$(tds[1]).find("a").html()));
    			RTU.invoke("app.filetransfer.lookfile.init",arr);*/
    			var new_window = null; 
    			new_window = window.open(); 
    			if($.trim($(this).html()).indexOf("66666")!=-1)
	    			new_window.location.href = "http://10.158.51.181:8088/czsbgl/tps/TpsAction.do?" +
	    					"operate=QualityMainFile_View&operPage=quality_track";
    			else new_window.location.href = "http://10.158.51.181:8088/czsbgl/tps/LocoCheckRepareAction.do?operate=loginZlfxFileInfo&operPage=jcfileinfo";
				
			});
    		$(".RTTable-Body tbody tr","#filemanager-bodyDiv-body-grid").unbind("click").bind("click",function(){
    			var tds=$(this).children("td");
    			fileName=$(tds[1]).find("a").html();
    			var paramData = {};
    			paramData.locoTypeName=$(tds[2]).find("a").html().split("-")[0];
               	paramData.locono=$(tds[2]).find("a").html().split("-")[1];
               	curObj=new Array();
               	curObj.push(paramData);
               	curObj.push(fileName);
    			$("#filemanager-quality-grid").empty().removeClass("containGridDiv");
    			$("#filemanager-quality-detailDiv").empty().removeClass("containGridDiv");
    		    qualityGrid = new RTGrid({
        			url:"../filemanager/qualitystatistics?filename="+fileName,
//                    datas: showData,
                    containDivId: "filemanager-quality-grid",
                    tableWidth: $("#filemanager-quality-grid").width(),
                    tableHeight: $("#filemanager-quality-grid").height(),
                    isSort: false, //是否排序
                    hasCheckBox: true,
                    showTrNum: false,
                    isShowPagerControl: false,
                    isShowRefreshControl:false,
                    beforeLoad:function(that){
        				that.pageSize =30;
        			},
        			
                    loadPageCp: function (t) {
                        t.cDiv.css("left", "200px");
                        t.cDiv.css("top", "200px");

                    },
                    colNames: ["质量项", "次数"],
                    colModel: [{ name: "qualityName"}, { name: "count"}],
                               replaceTd:[
                         					
                         					{index: 0, fn: function (data,j,ctd,itemData) {
                         						$(ctd).attr("qualityId",itemData.qualityId==0?"":itemData.qualityId).attr("qualityName",itemData.qualityName);
                         						return data;
                         						
                         					}},
                         					
                         					]
                });
    		    qualityGrid.init();
    		    $(".RTTable_Head tr td:first","#filemanager-quality-grid").text("");
        		$(".RTTable-Body tbody tr","#filemanager-quality-grid").unbind("click").bind("click",function(){
        			var tds=$(this).children("td");
        			var colWidth;
        			colWidth=$("#filemanager-quality-detailDiv").width();
        		    qualityGrid1 = new RTGrid({
            			url:encodeURI("../filemanager/fileQualityItem?filename="+fileName+"&qualityId="+$(tds[1]).attr("qualityId")+"&qualityName="+$(tds[1]).attr("qualityName")),
//                        datas: showData,
                        containDivId: "filemanager-quality-detailDiv",
                        tableWidth: $("#filemanager-quality-detailDiv").width(),
                        tableHeight: $("#filemanager-quality-detailDiv").height(),
                        isSort: true, //是否排序
                        hasCheckBox: false,
                        showTrNum: true,
                        isShowPagerControl: false,
                        isShowRefreshControl:false,
                        beforeLoad:function(that){
            				that.pageSize =30;
            			},
            			
                        loadPageCp: function (t) {
                            t.cDiv.css("left", "200px");
                            t.cDiv.css("top", "200px");

                        },
                        colNames: ["质量项",  "记录时间","备注",  "行数",  "公里标",  "信号机","速度"],
                        colModel: [{ name: "itemName",width:colWidth*0.15 },  
                                   { name: "time",width:colWidth*0.15}, 
                                   { name: "remark",width:colWidth*0.2 },
                                   { name: "rownumber",width:colWidth*0.1}, 
                                   { name: "gonglibiao",width:colWidth*0.1},
                                   { name: "xinhaoji",width:colWidth*0.1}
                                   ,{ name: "sudu",width:colWidth*0.1}]
                    });
    				qualityGrid1.init();
    				$(".RTTable_Head tr td:first","#filemanager-quality-detailDiv").text("序号");
    				$(".RTTable-Body tbody tr","#filemanager-quality-detailDiv").unbind("dblclick").bind("dblclick",function(){
    	    			var tds=$(this).children("td");
    	    			
    	    			/*paramData.locoTypeName=$(tds[2]).html().split("-")[0];
    	               	paramData.locono=$(tds[2]).html().split("-")[1];
    	    			var arr=new Array();
    	    			arr.push(paramData);
    	    			arr.push($(tds[1]).html());*/
    	    			var rowCount=$(tds[4]).text();
    	    			curObj[2]=rowCount;
    	    			//弹出文件查看窗口
    	    			RTU.invoke("app.filetransfer.lookfile.init",curObj);
    					
    				});
    			});
			});
    		
    		/*$(".RTTable-Body tbody tr:first","#filemanager-bodyDiv-body-grid").click();
    		$(".RTTable-Body tbody tr:first","#filemanager-quality-grid").click();*/
		};
		var refreshFun=function(data){
//    		var showData=[];
//    		if(data&&data.length>0){
//    			showData=data;
//    		}
			
			$("#filemanager-quality-grid").empty().removeClass("containGridDiv");
			$("#filemanager-quality-detailDiv").empty().removeClass("containGridDiv");
			var width=$("#filemanager-bodyDiv-body-grid").width();
			/*var Resolution=getResolution();
			Twitdh=Resolution.Twidth-145;
			Theight=Resolution.Theight-175;		*/	
    		trainislateGrid = new RTGrid({
    			url:!data.url?encodeURI("../filemanager/querytrainisantecedents?Fdate="
    				+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="
    				+data.loco+"&shortname="+data.shortname+"&locoAB="
    				+data.locoAB+"&checi="+data.checi+"&driver="+data.driver
    				+"&dwd="+data.dwd+"&cj="+data.cj+"&fileType="+data.fileType)
    				:encodeURI(data.url),
//                datas: showData,
                containDivId: "filemanager-bodyDiv-body-grid",
                tableWidth: width,
                tableHeight: $("#filemanager-bodyDiv-body-grid").height(),
                isSort: true, //是否排序
                hasCheckBox: false,
                showTrNum: true,
                isShowPagerControl: true,
                isShowRefreshControl:false,
                beforeLoad:function(that){
    				that.pageSize =30;
    			},
    			 replaceTd:[
    			            {index: 0, fn: function (data,j,ctd,itemData) {
								return "<a href='#' fileName=''>"+data+"</a>";
							}},
           					{index: 1, fn: function (data,j,ctd,itemData) {
           						var locoName=itemData.shortname+"-"+itemData.locoNo+
           						(itemData.locoAb=="1"?"A":(itemData.locoAb=="2"?"B":""));
           						return "<a href='#' onclick='javascript:$(\".leftFileDiv #filemanager_loco\").val(\"\");" +
           								"$(\"#filemanager_queryTab\").find(\"input,select\").val(\"\");" +
           								"$(\".leftFileDiv #filemanager_loco\").val(\""+locoName+"\");" +
           										"$(\".leftFileDiv .filetransferSearchBut\").click();'>"+locoName+"</a>";
           						
           					}},
           					{index: 2, fn: function (data,j,ctd,itemData) {
           						/*return data.split("-")[0];*/
           						return "<a href='#' onclick='javascript:$(\".leftFileDiv #filemanager_loco\").val(\"\");" +
           								"$(\"#filemanager_queryTab\").find(\"input,select\").val(\"\");" +
           								"$(\".rightFileDiv #filemanager_checi\").val(\""+data.split("-")[0]+"\");" +
           								"$(\".rightFileDiv .filemanagerSubmit\").click();'>"+data.split("-")[0]+"</a>";
           						
           					}},
           					{index: 6, fn: function (data,j,ctd,itemData) {
           						/*return data.split("-")[1].split(".")[0];*/
           						return "<a href='#' onclick='javascript:$(\".leftFileDiv #filemanager_loco\").val(\"\");" +
           								"$(\"#filemanager_queryTab\").find(\"input,select\").val(\"\");" +
           								"$(\".rightFileDiv #filemanager_driver\").val(\""+data.split("-")[1].split(".")[0]+"\");" +
           								"$(\".rightFileDiv .filemanagerSubmit\").click();'>"+data.split("-")[1].split(".")[0]+"</a>";
           						
           					}},
           					{index: 9, fn: function (data,j,ctd,itemData) {
           						if(data=="0"){
           							$(ctd).css("color","blue");
           							return "手动下载";
           						}
           						return "自动下载";
           					}}
           					],
                loadPageCp: function (t) {
                    t.cDiv.css("left", "200px");
                    t.cDiv.css("top", "200px");
                    initClickFn();
                },
                colNames: ["文件名", "机车", "车次",  "机务段","电务段","车间",  "司机",  "文件大小","下载时间","下载方式"],
                colModel: [{ name: "downloadFilename",width:width*0.15 }, 
                           { name: "shortname"}, 
                           { name: "downloadFilename",width:width*0.1}, 
                           { name: "dName"},{ name: "depotName",width:width*0.1},
                           { name: "cj"}, { name: "downloadFilename"}, 
                           { name: "downLen",width:width*0.1},{ name: "finishTime",width:width*0.1},
                           { name: "requestMode",width:width*0.1}]
            });
    		$(".RTTable_Head tr td:first",$("#filemanager-bodyDiv-body-grid")).text("");
    		RTU.invoke("header.msg.hidden");
    	};
    	
    	return function(data){
    		refreshFun(data);
    		initClickFn();
    	};
	});
	var curObj=null;
	var fileName=null;
});
