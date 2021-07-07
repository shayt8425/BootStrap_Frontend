RTU.DEFINE(function (require, exports) {
/**
 * 模块名：文件管理-质量分析信息
 * name： 
 * date:2015-2-12
 * version:1.0 
 */
    require("../../../css/app/app-locomotive-details.css");
    require("app/loading/list-loading.js");
    require("app/curve/moveCurve/moveCurve.js"); 
    require("app/publicservicelinepatroldispatchcommand/app-yunxingjilu-query.js");
   /* require("app/filemanager/app-filemanager-query-quality.js");*/
    var filename;
    var popuwnd;
    var curObj;
    
    var getResolution=function(){
		var Resolution={};
		Resolution.Twidth=document.body.offsetWidth;
		Resolution.Theight=document.body.clientHeight+document.body.clientTop;	
		return Resolution;
	}
    RTU.register("app.filemanager.quality.init", function () {
    	
        return function (data) {
            filename=data[1];
            curObj=data;
			RTU.invoke("core.router.load", {
				url:"../app/modules/filemanager/app-filemanager-query-quality.html",
                success: function (html) {
                	var Resolution=getResolution();
        			/*Twitdh=Resolution.Twidth-140;
        			Theight=Resolution.Theight-60;*/
                	Twitdh=Resolution.Twidth*0.9;
        			Theight=Resolution.Theight*0.9;
                     
                if(popuwnd){
                	popuwnd.close();
                }
                popuwnd= new PopuWnd({
                    title: "全程记录文件质量分析" + "(" + data+")",
                    html: html,
                    width: Twitdh,
                    height: Theight,
                    left: 135,
                    top: 60,
                    shadow: true,
                    removable: true,  //设置弹出窗口是否可拖动
                    deletable: true	  //设置是否显示弹出窗口的关闭按钮
                });  
                    popuwnd.init(); 
                    window.setTimeout('RTU.invoke("app.filemanager.quality.getdata");', 100);
                    RTU.invoke("header.msg.show", "加载中,请稍后！-290-650");
                    RTU.invoke("app.filemanager.qualityitem.showData");
                    RTU.invoke("header.msg.hidden");
                 
                }
              });
		
        };
		
			
			
    
    });
    
    var tempImgObj = { "0": "NO.png", "1": "L.png", "2": "LU.png", "4": "U.png", "8": "U2.png", "16": "UU.png", "32": "HU.png", "64": "H.png", "128": "B.png" };
    function getImgUrl(id) {
        if (tempImgObj[id.toString()])
            return "../static/img/app/moveCurve/" + tempImgObj[id.toString()];
        else {
            return "../static/img/app/moveCurve/NO.png";
        }
    }
    //质量分析相点详情显示
	RTU.register("app.filemanager.qualityitem.showData",function(){
		var refreshFun=function(data){
   		var ColWitdh;
   		ColWitdh=$("#qualityAnaDiv").width()-20;
			/*var Resolution=getResolution();
			Twitdh=Resolution.Twidth*0.9;
			Theight=Resolution.Theight*0.8;*/			
    		trainislateGrid2 = new RTGrid({
    			url:"../filemanager/fileQualityItem?filename="+filename,
//                datas: showData,
                containDivId: "qualityitem-bodyDiv-body-grid",
                tableWidth: $("#qualityAnaDiv").width()-20,
                tableHeight: $("#qualityAnaDiv").height()-20,
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
                colNames: ["质量项", "说明", "记录时间",  "行数",  "公里标",  "信号机","速度"],
                colModel: [{ name: "itemName",width:ColWitdh*0.1 }, { name: "remark",width:ColWitdh*0.3}, { name: "time",width:ColWitdh*0.15}, 
                           { name: "rownumber",width:ColWitdh*0.1}, { name: "gonglibiao",width:ColWitdh*0.1},
                           { name: "xinhaoji",width:ColWitdh*0.1}
                           ,{ name: "sudu",width:ColWitdh*0.1}]
            });
    		$(".RTTable_Head tr td:first",$(".trainistrainisAntecedents_div")).html("序号");
    	};
    	
    	return function(data){
    		/*if (data.loco==""){
        		RTU.invoke("header.alarmMsg.show","请输入机车型号，机车号");
    			return false;
    		}
    		if (data.Firsttime==""){
        		RTU.invoke("header.alarmMsg.show","请输入开始时间");
    			return false;
    		}
    		if (data.Finishtime==""){
        		RTU.invoke("header.alarmMsg.show","请输入结束时间");
    			return false;
    		};
    		*/
    		refreshFun(data);
    		$(".RTTable-Body tbody tr","#qualityitem-bodyDiv-body-grid").unbind("dblclick").bind("dblclick",function(){
    			var tds=$(this).children("td");
    			var paramData = {};
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
 /* 		var url="filemanager/querytrainisantecedents?Fdate="+data.Firsttime+"&Tdate="+data.Finishtime+"&loco="+data.loco+"&shortname="+data.shortname;
            var param={
                    url: url,
                    cache: false,
                    asnyc: true,
                    datatype: "json",
                    success: function (data) {
                        refreshFun(data.data);
                    },
                    error: function () {
                    }
                  };
            RTU.invoke("core.router.get", param);
            */

    	};
	});
    
    RTU.register("app.filemanager.quality.getdata", function () {

        return function (data) {
            //前三个
            $.ajax({
            	url: "../filemanager/filemanagerquality?filename=" + filename,
            	dataType: "jsonp",
                type: "GET",
                success: function (r) {
                    
                    var itemData = r.data[0];
                    try {
                        if (itemData) {
                           
                        	 $("#yingjianfw").text(itemData[0]);      //硬件复位       
                        	 if(itemData[0]>0)
                        		 $("#yingjianfw").css("color","red");
                             $("#jingjizd").text(itemData[1]);          //紧急制动   
                             if(itemData[1]>0)
                        		 $("#jingjizd").css("color","red");
                             $("#jintiyc").text(itemData[2]);            //警惕异常      
                             if(itemData[2]>0)
                        		 $("#jintiyc").css("color","red");
                             $("#fangliuyc").text(itemData[3]);        //防溜异常   
                             if(itemData[3]>0)
                        		 $("#fangliuyc").css("color","red");
                             $("#xiansutj").text(itemData[4]);          //限速突降
                             if(itemData[4]>0)
                        		 $("#xiansutj").css("color","red");
                             $("#xinghaoyc").text(itemData[5]);        //信号异常  
                             if(itemData[5]>0)
                        		 $("#xinghaoyc").css("color","red");
                             $("#yichangzd").text(itemData[6]);        //异常制动     
                             if(itemData[6]>0)
                        		 $("#yichangzd").css("color","red");
                             $("#gonglims").text(itemData[7]);          //20公里模式  
                             if(itemData[7]>0)
                        		 $("#gonglims").css("color","red");
                             $("#mingdiyc").text(itemData[8]);          //鸣笛异常
                             if(itemData[8]>0)
                        		 $("#mingdiyc").css("color","red");
                             $("#rengongjz").text(itemData[9]);        //人工校正      
                             if(itemData[9]>0)
                        		 $("#rengongjz").css("color","red");
                             $("#zhujitx").text(itemData[10]);            //主机通讯
                             if(itemData[10]>0)
                        		 $("#zhujitx").css("color","red");
                             $("#chaisuyc").text(itemData[11]);          //柴速异常
                             if(itemData[11]>0)
                        		 $("#chaisuyc").css("color","red");
                             $("#zhuduanyc").text(itemData[12]);        //主断异常
                             if(itemData[12]>0)
                        		 $("#zhuduanyc").css("color","red");
                             $("#danjiyx").text(itemData[13]);            //单机运行 
                             if(itemData[13]>0)
                        		 $("#danjiyx").css("color","red");
                             $("#yaliyc").text(itemData[14]);              //压力异常 
                             if(itemData[14]>0)
                        		 $("#yaliyc").css("color","red");
                             $("#wenjianyc").text(itemData[15]);        //文件异常
                             if(itemData[15]>0)
                        		 $("#wenjianyc").css("color","red");
                             $("#shijianyc").text(itemData[16]);        //时间异常
                             if(itemData[16]>0)
                        		 $("#shijianyc").css("color","red");
                             $("#guojieyc").text(itemData[17]);          //过节异常
                             if(itemData[17]>0)
                        		 $("#guojieyc").css("color","red");
                             $("#zhidongtd").text(itemData[18]);        //制动通道 
                             if(itemData[18]>0)
                        		 $("#zhidongtd").css("color","red");
                             $("#gongkuangyc").text(itemData[19]);    //工况异常
                             if(itemData[19]>0)
                        		 $("#gongkuangyc").css("color","red");
                             $("#suduyc").text(itemData[20]);              //速度异常  
                             if(itemData[20]>0)
                        		 $("#suduyc").css("color","red");
                             $("#changyongzd").text(itemData[21]);    //常用制动
                             if(itemData[21]>0)
                        		 $("#changyongzd").css("color","red");
                             $("#xianshiqiyc").text(itemData[22]);    //显示异常  
                             if(itemData[22]>0)
                        		 $("#xianshiqiyc").css("color","red");
                             $("#lunjinyj").text(itemData[23]);          //轮径越界 
                             if(itemData[23]>0)
                        		 $("#lunjinyj").css("color","red");
                            
                        }
                           
                            
                            
                          
                           
                        }

                    
                    catch (e) {

                        throw new Error("没有返回数据或者数据格式不正确！");
                    }


                }
            });
        };
    });

});
