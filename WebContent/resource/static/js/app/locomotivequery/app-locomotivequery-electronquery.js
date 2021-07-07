RTU.DEFINE(function (require, exports) {
/**
 * 模块名：特殊点围栏分布查询
 * name:electronquery
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("../../../css/app/locomotivequery/electronquery.css");

/**********************************
 * 机车分布第四个界面
 *********************************/   
    //型号分布查询
    RTU.register("app.electronquery.searchByElectron",function(){
    	return function(){
    		var url="electronraildepot/findLocomotiveSpreadSumInfo?userId="+window.RTU.data.user.id;
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                 
                  /*timeout:20000,*/
                  success: function (data) {
                	 RTU.invoke("app.electronquery.Tab2.createHtml",data.data);
                  }
    			  ,
                  error: function (e) {
                	  alert(e);
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    
    //第二个tab页组装html
    RTU.register("app.electronquery.Tab2.createHtml",function(){

        var $buildItem = function (data, index) {

        	this.$item  =$("#content-locospread-electron-c-sub-hidden");
            this.$item.find(".content-locospread-middle-c-sub").attr("id","middle-c-sub-"+data.recId);
            this.$item.find(".content-locospread-middle-c-sub-title-locoTypeName").text(data.stationRail + "(共"+data.locoCount+"台):").css({width:"120px"});
            this.$item.find(".content-locospread-checkbox").attr("checked","checked").val(data.locoTypeid);
            this.$item.find(".content-locospread-middle-c-sub-title-num").text("共"+ data.locoCount + "台");
            var showD=[];
           
            var index=0;
            this.$item.find(".content-locospread-middle-c-sub-title").find(".content-locospread-middle-c-sub-title-tz-num").remove();
            //按车型分类
            for(var i=0;i<data.locoTypeVoList.length;i++){
            	var locoTypeVo=data.locoTypeVoList[i];
            	//(85/data.locoTypeVoList.length)
                this.$item.find(".content-locospread-middle-c-sub-title").append("<div style='width:8%;left:1%'" +
                		" class='content-locospread-middle-c-sub-title-tz-num'>" +
                		"<input id='locoTypeid_"+data.recId+locoTypeVo.locoTypeid+"' type='checkbox' value='"+locoTypeVo.locoTypeid+"' class='content-locospread-electron-checkbox' " +
                				"checked='checked'><label for='locoTypeid_"+data.recId+locoTypeVo.locoTypeid+"'>"
                						+locoTypeVo.locoTypeName+"("+locoTypeVo.locoTypeCount+"台)</label></div>");
                for(var j=0;j<locoTypeVo.onlineLocoViewList.length;j++){
                	showD[index]=locoTypeVo.onlineLocoViewList[j];
                	index++;
                }
            }
            
            //按段分类
            for(var i=0;i<data.depotTypeVoList.length;i++){
            	var depotTypeVo=data.depotTypeVoList[i];
            	//(85/data.locoTypeVoList.length)
                this.$item.find(".content-locospread-middle-c-sub-title").append("<div style='display:none;width:8%;left:1%'" +
                		" class='content-locospread-middle-c-sub-title-tz-num'>" +
                		"<input id='depotId_"+data.recId+depotTypeVo.depotId+"' type='checkbox' value='"+depotTypeVo.depotId+"' class='content-locospread-electron-checkbox' " +
                				"checked='checked'><label for='depotId_"+data.recId+depotTypeVo.depotId+"'>"
                						+depotTypeVo.depotName+"("+depotTypeVo.depotTypeCount+"台)</label></div>");
                /*for(var j=0;j<depotTypeVo.onlineLocoViewList.length;j++){
                	showD[1][index]=depotTypeVo.onlineLocoViewList[j];
                	index++;
                }*/
            }
            
            this.$item.find(".content-locospread-middle-c-sub-c-table").html("");
            
            var html = RTU.invoke("app.electronquery.Tab2.createTRHtml",[showD,data.recId]);

            this.$item.find(".content-locospread-middle-c-sub-c-table").html(html).attr("locotypename",data.recId);

            if(showD.length<=10){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"60px","line-height":"60px"});
                this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"60px","line-height":"60px"});
            }else if(showD.length>10&&showD.length<=20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"120px","line-height":"120px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"120px","line-height":"120px"});
            }else if(showD.length>20){
            	this.$item.find(".content-locospread-middle-c-sub-c-tableDiv").css({"height":"175px","line-height":"175px"});
            	this.$item.find(".content-locospread-middle-c-sub-c").css({"height":"175px","line-height":"175px"});
            }

            return $(this.$item);
        };
    	return function(data){
    		var showBody=$(".content-locospread-electron-c");
    		$(showBody).html("");
    		var html=[];
    		var count=0;
    		for(var i=0,len=data.length;i<len;i++){
    			count=count+data[i].locoCount;
    			html.push((new $buildItem(data[i],i)).html());
    		}
    		$(showBody).append(html.join(""));
    		$("#content-locospread-electron-top-totalCount").text(count+"台");
    		$(".content-locospread-electron-checkbox").unbind("click").bind("click",function(){
    			
    			if($(this).attr("id").indexOf("locoTypeid")!=-1){
    				
    				if($(this).attr("checked")){
    					$(".content-locospread-electron-c td[locoTypeid='"+$(this).attr("id").split("_")[1]+"']").show();
    				}
    				else{
    					$(".content-locospread-electron-c td[locoTypeid='"+$(this).attr("id").split("_")[1]+"']").hide();
    				}
    			}
    			else{
    				if($(this).attr("checked")){
    					$(".content-locospread-electron-c td[depotId='"+$(this).attr("id").split("_")[1]+"']").show();
    				}
    				else{
    					$(".content-locospread-electron-c td[depotId='"+$(this).attr("id").split("_")[1]+"']").hide();
    				}
    			}
    		});
    		/*$("#content-locospread-electron-top-totalCountInUse").text(count+"台");*/
    		/*setTimeout(function(){
    			RTU.invoke("app.electronquery.initTab2Btn");
    		},25);*/
    		$("#searchLocoBtn2").unbind("click").click(function(){
                 var loco=$.trim($("#searchLocoInput2").val());
                 if(loco){
                	 var obj=$(".content-locospread-electron-c td[loconame='"+loco+"']");
                	 if(obj.length>0){
                		 $(".content-locospread-electron-c td[loconame='"+loco+"']").show();
                         $(".content-locospread-electron-c td[loconame!='"+loco+"']").hide();
                	 }
                 }
                 else{
                	 $(".content-locospread-electron-c td").show();
                 }
                 
             });
    		
    		$("tr td",$(".content-locospread-middle-c-sub-c-table",$(".content-locospread-electronDiv"))).mouseover(function(e){
  			  $(this).addClass("content-locospread-middle-c-sub-c-table-td-bg");
  			  
  			  var tuKuChuRuKu=$(this).attr("tuKuChuRuKu");
  			  var frontLineName=$(this).attr("frontLineName");
  			  var frontStationName=$(this).attr("frontStationName").split("-");
  			  if(frontStationName.length>1)frontStationName=frontStationName[1];
  			  else frontStationName=frontStationName[0];
  			  var jkstateName=$(this).attr("jkstateName");
  			  var limitedSpeed=$(this).attr("limitedSpeed");
  			  var lineName=$(this).attr("lineName");
  			  var lkjTime=$(this).attr("lkjTime");
  			  var loconame=$(this).attr("loconame");
  			  
  			  var checiName=$(this).attr("checiName");
  			  
  			  var speed=$(this).attr("speed");
  			  var state=$(this).attr("isOnline");
  			  var benBuKeHuo=$(this).attr("benBuKeHuo");
  			  /*var locoAb=$(this).attr("locoAb");
  			  var locoab="";
  			  if (locoAb==1) {//A
            		 locoab=window.locoAb_A;
	              	}else if (locoAb==2) {//B
	              		locoab=window.locoAb_B;
	              	}*/
  			  var clientX=e.clientX;
				  var clientY=e.clientY;
  			 
  			  if(state=="在线"){
  				  	  
					  var locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
					  $("#tuzhongHoverDiv-tab-loco",$(locoTypeDiv)).text(loconame);
					  $("#tuzhongHoverDiv-tab-state",$(locoTypeDiv)).text(tuKuChuRuKu+"/在线");
					  $("#tuzhongHoverDiv-tab-lkjstateName",$(locoTypeDiv)).text(jkstateName);
					  $("#tuzhongHoverDiv-tab-checiname",$(locoTypeDiv)).text(checiName);
					  $("#tuzhongHoverDiv-tab-benBuKeHuo",$(locoTypeDiv)).text(benBuKeHuo);
					  $("#tuzhongHoverDiv-tab-speed",$(locoTypeDiv)).text(speed);
					  $("#tuzhongHoverDiv-tab-limitedspeed",$(locoTypeDiv)).text(limitedSpeed);
					  $("#tuzhongHoverDiv-tab-linename",$(locoTypeDiv)).text(lineName);
					  $("#tuzhongHoverDiv-tab-frontlinename",$(locoTypeDiv)).text(frontLineName);
					  $("#tuzhongHoverDiv-tab-frongstationname",$(locoTypeDiv)).text(frontStationName);
					  
					  
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
			          var height1 = document.documentElement.clientHeight;

			          if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
				  }else{
					  var locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
					  $("#locoTypeHoverDiv-tab-loco",$(locoTypeDiv)).text(loconame);
					  $("#locoTypeHoverDiv-tab-checkname",$(locoTypeDiv)).text(checiName);
					  $("#locoTypeHoverDiv-tab-state",$(locoTypeDiv)).text(tuKuChuRuKu+"/离线");
					  if(lkjTime&&lkjTime!=""){
						  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text(lkjTime.substring(0,10));
						  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text(lkjTime.substring(10));
					  }else{
						  $("#locoTypeHoverDiv-tab-date",$(locoTypeDiv)).text("");
						  $("#locoTypeHoverDiv-tab-time",$(locoTypeDiv)).text("");
					  }
					  var width=$(locoTypeDiv).width();
					  var height=$(locoTypeDiv).height();
					  var width1 = document.documentElement.clientWidth*0.9 ;
			          var height1 = document.documentElement.clientHeight;

			          if((clientX+width)>width1){
						  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
					  }else{
						  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
					  }
					  if((clientY+height)>height1){
						  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
					  }else{
						  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
					  }
					  $(locoTypeDiv).removeClass("hidden");
				  };
  			
  		}).mousemove(function(e){
  			  var clientX=e.clientX;
				  var clientY=e.clientY;
				  var state=$(this).attr("isOnline");
				  var locoTypeDiv;
				  if(state=="在线"){
					  locoTypeDiv=$("#content-locospread-tuzhongHoverDiv");
				  }else{
					  locoTypeDiv=$("#content-locospread-locoTypeHoverDiv");
				  }
				  var width=$(locoTypeDiv).width();
				  var height=$(locoTypeDiv).height();
				  var width1 = document.documentElement.clientWidth*0.9  ;
		          var height1 = document.documentElement.clientHeight;
		          
		          if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
				  $(locoTypeDiv).removeClass("hidden");
  		}).mouseout(function(e){
  			$(this).removeClass("content-locospread-middle-c-sub-c-table-td-bg");
  			$("#content-locospread-locoTypeHoverDiv").addClass("hidden");
  			$("#content-locospread-tuzhongHoverDiv").addClass("hidden");
  		}).mousedown(function(e){
 			 if (3 == e.which) {
				 var that=this;
				 var clientX=e.clientX;
				 var clientY=e.clientY;
				 var rightDiv=$("#content-locospread-rightClickDiv");
				 var width=$(rightDiv).width();
 				 var height=$(rightDiv).height();
 				 /*var width1 = document.documentElement.clientWidth*0.9  ;*/
 				 var width1 = document.documentElement.clientWidth;
 		         var height1 = document.documentElement.clientHeight;
 		          
 		        if((clientX+width)>width1){
					  $(locoTypeDiv).css({"left":(clientX-50-width)+"px"});
				  }else{
					  $(locoTypeDiv).css({"left":(clientX+20)+"px"});
				  }
				  if((clientY+height)>height1){
					  $(locoTypeDiv).css({"top":(clientY-30-height)+"px"});
				  }else{
					  $(locoTypeDiv).css({"top":(clientY-30)+"px"});
				  }
 				 $(rightDiv).removeClass("hidden");
 				 
 				 $("tr td",$(".content-locospread-rightClickDiv-tab")).unbind("click").click(function(){
 					 var id=$(this).attr("id");
 					 var ttypeshortname=$(that).attr("locotypename");
					 var locoNo=$(that).attr("locoNo");
					 var locoAb=$(that).attr("locoAB");
					 var locoCheci=$(that).attr("checiName");
					 var locoTypeid=$(that).attr("locoTypeid");
					 var speed=$(that).attr("speed");
					 var depotname=$(that).attr("dname");
					 var time=$(that).attr("time");
					 var benBuKeHuo=$(that).attr("benBuKeHuo");
					 var lkjType=$(that).attr("lkjType");
 					 if(id=="menu1"){
 						 var loco=ttypeshortname+"-"+locoNo;
 						 RTU.invoke("map.marker.findMarkersContainsNotExist", {
                           pointId: loco,
                           isSetCenter: true,
                           stopTime: 5000,
                           locoAb:locoAb,
                           locoTypeid:locoTypeid,
                           locoNo:locoNo,
                           lkjType:lkjType,
                           fnCallBack: function () {
                           }
                       });
                       var delbtn = $(".popuwnd-title-del-btn", popuwnd_onlleft.$wnd);
                       var btn = $(".amplifyWin", delbtn.parent());
                       btn.click();
                       $(rightDiv).addClass("hidden");
 					 }else if(id=="menu2"){
 						 var sendData={
                               "id": "11111",
                               "name": locoCheci + "(" + ttypeshortname+"-"+locoNo + ")",
                                data: {
                                    locoTypeid:locoTypeid,
                                    locoNO:locoNo,
                                    checiName:locoCheci,
                                    locoTypeName:ttypeshortname,
                                    locoAb:locoAb,
                                    lkjType:lkjType
                                }
 						 };
                        var arr=[];
                        arr[0]=sendData;
                        RTU.invoke("app.publicRealtimelocomotivequery.query.initmutimove", arr);
                        $(rightDiv).addClass("hidden");
 					 }else if(id=="menu3"){
 						 	var sendData={
	                            locoTypeid:locoTypeid,
	                            locoNo:locoNo,
	                            locoAb:locoAb,
	                            locoTypename:ttypeshortname,
	                            benBuKeHuo:benBuKeHuo,
	                            date:time
 						 	};
 					  		if(lkjType!=1)
	   						RTU.invoke("app.publicservicelinepatroldispatchcommand.query.activate",sendData);
 					  		else RTU.invoke("app.public15servicelinepatroldispatchcommand.query.activate",sendData);
 					 }else if(id=="menu4"){
 						   var datas=[];
 						   var checiName = locoCheci;
	                       var locoTypeName = ttypeshortname;
	                       var locoNO = locoNo;
	                       var depotName =depotname;
	                       datas.push(locoTypeid + "," + locoTypeName + "," + locoNO + "," + checiName + "," + depotName + "," + locoAb);
	                       if(lkjType!=1)
	                       RTU.invoke("app.realtimelocomotivequery.showFileTransferWin", datas);
	                       else RTU.invoke("app.realtimelocomotivequery.showFile15TransferWin", datas);
	                       $(rightDiv).addClass("hidden");
 					 }else if(id=="menu5"){
 					    var data = {
                            "locotypeid": locoTypeid,
                            "locono": locoNo,
                            "locoTypeName": ttypeshortname,
                            "locoAb": locoAb,
                            "speed":speed
                        };
 					    if(lkjType!=1)
 					    	RTU.invoke("app.realtimelocomotivequery.showFileDownloadWin", data);
 					    else RTU.invoke("app.realtimelocomotivequery.showFile15DownloadWin", data);
                        $(rightDiv).addClass("hidden");
 					 }
 				 });
 				 
 				 $("body").click(function(){
 					$("#content-locospread-rightClickDiv").addClass("hidden");
 				 });
 			 }
  		});
    	};
    });
    
    RTU.register("app.electronquery.Tab2.createTRHtml",function(){
    	return function(data){
    		var html="<tr>";
            var d=data[0];
            var recId=data[1];
            
            for(var j=0,len=d.length;j<len;j++){
            	if(j!=0&&j%10==0){
    				html=html+"</tr><tr>";
    			}
            	var locoab="";
            	if (d[j].locoAb==1) {//A
            		locoab=window.locoAb_A;
            	}else if (d[j].locoAb==2) {//B
            		locoab=window.locoAb_B;
            	}
            	
            	if(d[j].isOnline=="1"||d[j].isOnline=="2"){
            		var state="在线";
            		html=html+"<td jkstateName='"+d[j].jkstateName+"' class='content-locospread-middle-c-sub-c-tabDiv-TdOnline' loconame='"+d[j].ttypeShortname+"-"+d[j].locoNo+locoab+"' depotId='"+recId+""+d[j].did+"' ttypeshortname='"+d[j].ttypeShortname+"' locotypename='"+d[j].ttypeShortname+"' locotypeid='"+recId+""+d[j].locoTypeid+"' locono='"+d[j].locoNo+"' locoNo='"+d[j].locoNo+"' checiName='"+d[j].checiName+"' " +
            				"dname='"+d[j].dname+"' locoAb='"+d[j].locoAb+"' speed='"+d[j].speed+"'  isOnline='"+state+"' tuKuChuRuKu='"+d[j].tuKuChuRuKu+"'" +
            				" benBuKeHuo='"+d[j].locoUseName+"' frontLineName='"+d[j].frontLName+"' frontStationName='"+d[j].frontSName+"' jkstate='"+d[j].jkstate+"' limitedSpeed='"+d[j].limitedSpeed+"' " +
            				"lineName='"+d[j].lname+"' lkjTime='"+d[j].gpsTime+"' alt='1' lkjType='"+d[j].lkjType+"'>"+d[j].ttypeShortname+"-"+d[j].locoNo+locoab+"<br>"+(d[j].did==0?d[j].checiName:d[j].dname)+"</td>";
            	}else{
            		var state="离线";
            		html=html+"<td jkstateName='"+d[j].jkstateName+"' loconame='"+d[j].ttypeShortname+"-"+d[j].locoNo+locoab+"' depotId='"+recId+""+d[j].did+"' class='content-locospread-electron-c-sub-c-tabDiv-TdOnline' ttypeshortname='"+d[j].ttypeShortname+"' locotypename='"+d[j].ttypeShortname+"' locotypeid='"+recId+""+d[j].locoTypeid+"' locono='"+d[j].locoNo+"' locoNo='"+d[j].locoNo+"' checiName='"+d[j].checiName+"' " +
            				"dname='"+d[j].dname+"' locoAb='"+d[j].locoAb+"' speed='"+d[j].speed+"'  isOnline='"+state+"' tuKuChuRuKu='"+d[j].tuKuChuRuKu+"'" +
            				" benBuKeHuo='"+d[j].locoUseName+"' frontLineName='"+d[j].frontLName+"' frontStationName='"+d[j].frontSName+"' jkstate='"+d[j].jkstate+"' limitedSpeed='"+d[j].limitedSpeed+"' " +
            				"lineName='"+d[j].lname+"' lkjTime='"+d[j].gpsTime+"' alt='1' lkjType='"+d[j].lkjType+"'>"+d[j].ttypeShortname+"-"+d[j].locoNo+locoab+"<br>"+(d[j].did==0?d[j].checiName:d[j].dname)+"</td>";
            	}
	            if(j==len-1){
	            	 for(var a=0;a<(10-d.length%10);a++){
	                 	html=html+"<td style='border:0px;background-color:white;visibility:hidden;'>&nbsp;</td>";
	                 }
	            	html=html+"</tr>";
	            }
            }
            
            
            return html;
    	};
    });


});
