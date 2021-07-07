function getNum(){
				var str = '[{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"},{"no":"DF11-0324","gzlx":"紧急制动","jgjb":"三级","gzsj":"2016-2-15   15:27"}]';
				var x= eval('(' + str + ')');		
				/*var x=str;*/
				var no,gzlx,jgjb,gzsj;
				var noNode,gzlxNode,jgjbNode,gzsjNode;
				var m=0;
				var ids;
				for(var i =0;i<x.length;i++){
					no=x[i].no;
					gzlx=x[i].gzlx;
					jgjb=x[i].jgjb;
					gzsj=x[i].gzsj;
					noNode=$("<font id=\"no\" class=\"font-no\"></font>").text(no);
					gzlxNode=$("<font id=\"gz\" class=\"font-2\"></font>").text(gzlx);
					jgjbNode=$("<font id=\"jb\" class=\"font-2\"></font>").text(jgjb);
					gzsjNode=$("<font id=\"sj\" class=\"font-2\"></font>").text(gzsj);
					$("#row").append('<div class="squre" id="fk'+m+'" onmouseover="over(id)" onmouseout="out(id)">'+
														'<ul class="a1" id="a1'+m+'">'+
															'<li class="li1 li1_2" id="liNo'+m+'"></li>'+
															'<li class="li1"><font class="font-name" id="jc'+m+'">机车</font></li>'+
														'</ul>'+
														'<ul class="a2" id="a2'+m+'">'+
															'<ul class="a2_1" id="gzlx'+m+'">'+
																'<li class="li2_1"><font class="font-1" id="right_1'+m+'">故障类型</font></li>'+
																'<li class="li2" id="liGzlx'+m+'"></li>'+
															'</ul>'+
															'<ul class="a2_2" id="jgjb'+m+'">'+
																'<li class="li2_2"><font class="font-1" id="right_2'+m+'">警告级别</font></li>'+
																'<li class="li3" id="liJgjb'+m+'"></li>'+
															'</ul>'+
															'<ul class="a2_3" id="gzsj'+m+'">'+
																'<li class="li2_3"><font class="font-1" id="right_3'+m+'">故障时间</font></li>'+
																'<li class="li2" id="liGzsj'+m+'"></li>'+
															'</ul>'+
														'</ul>'+
														'<div class="a3" id="btn"><img src="../img/c1.png" /><a href="#" onclick="popCenterWindow()"><font class="font-3" id="cl'+m+'">处理</font></a></div>'+
													'</div>');
					var m1="#liNo"+m;
					var m2="#liGzlx"+m;
					var m3="#liJgjb"+m;
					var m4="#liGzsj"+m;
					$(m1).append(noNode);
					$(m2).append(gzlxNode);
					$(m3).append(jgjbNode);
					$(m4).append(gzsjNode);
					m++;
				}
			}

function tab(){}
function over(id){
	var fk=document.getElementById(id);
//	var no=document.getElementById("no");
//	var name=document.getElementById("jc");
//	var n1=document.getElementById("right_1");
//	var n2=document.getElementById("right_2");
//	var n3=document.getElementById("right_3");
//	var gzlx=document.getElementById("gz");
//	var jgjb=document.getElementById("jb");
//	var gzsj=document.getElementById("sj");
	fk.className='col animated pulse';
//	no.className='font-no2';
//	name.className='font-name2';
//	n1.className="font-1-1";
//	n2.className="font-1-1";
//	n3.className="font-1-1";
//	gzlx.className='font-2-2';
//	jgjb.className='font-2-2';
//	gzsj.className='font-2-2';
}
function out(id){
	var fk=document.getElementById(id);
//		var no=document.getElementById("no");
//		var name=document.getElementById("jc");
//		var n1=document.getElementById("right_1");
//		var n2=document.getElementById("right_2");
//		var n3=document.getElementById("right_3");
//		var gzlx=document.getElementById("gz");
//		var jgjb=document.getElementById("jb");
//		var gzsj=document.getElementById("sj");
	fk.className='squre';
//	no.className='font-no';
//	name.className='font-name';
//	n1.className="font-1";
//	n2.className="font-1";
//	n3.className="font-1";
//	gzlx.className='font-2';
//	jgjb.className='font-2';
//	gzsj.className='font-2';
}
			
//获取窗口的高度 
			var windowHeight;
			//获取窗口的宽度 
			var windowWidth;
			//获取弹窗的宽度 
			var popWidth;
			//获取弹窗高度 
			var popHeight;

			function init() {
				windowHeight = $(window).height();
				windowWidth = $(window).width();
				popHeight = $(".window").height();
				popWidth = $(".window").width();
			}
			//关闭窗口的方法 
			function closeWindow() {
				$(".title i").click(function() {
					$(this).parent().parent().hide("slow");
				});
			}
			var dealLocoName;
			var dealAlarmCode;
			//定义弹出居中窗口的方法 
			function popCenterWindow(locoName,alarmCode) {
				dealLocoName=locoName;
				dealAlarmCode=alarmCode;
				init();
				//计算弹出窗口的左上角Y的偏移量 
				var popY = (windowHeight - popHeight)/ 10;
				var popX = (windowWidth - popWidth) / 2;
				//alert('jihua.cnblogs.com'); 
				//设定窗口的位置 
				$("#center").css("top", popY).css("left", popX).slideToggle("slow");
				closeWindow();
			}
			
			function dealAlarmVersionInfo(){
				if($.trim($("#confirmTextArea").val())==""){
					RTU.invoke("header.notice.show","请输入处理意见");
					$("#confirmTextArea").focus();
					return;
				}
    			 //传到数据库部分
    			var params = {};
                params.locoName=dealLocoName;
                params.alarmCode=dealAlarmCode;
                params.confirmDesc=$.trim($("#confirmTextArea").text());
                params.userId=RTU.data.user.id;

				RTU.invoke("core.router.get", {
                   url: "lkjverInfo/confirmAlarm",
                   data: $.param(params),
                   success: function (obj) {
                       if (obj.success) {
                       	RTU.invoke("header.notice.show", "处理成功。。");
                       	$(".title i").click();
                       	$("#searchBtnVersionAlarm").click();
                       }
                   },
                   error: function (obj) {
                       RTU.invoke("header.notice.show", "处理失败。。");
                   }
               });
				dealLocoName=null;
				dealAlarmCode=null;
			}
			
			function lookFile(locoTypeid,locoNo,locoAb,locoTypeName,locoNoStr){
				RTU.invoke("core.router.get",{
					url: "downFile/findFileInfoByLoco?locoTypeid="+locoTypeid+"&locoNo="+locoNo+"&locoAb="+locoAb,
		             success: function (returnData){
		            	if(returnData&&returnData.data){
		                    //弹出文件查看窗口
		                    //RTU.invoke("app.filetransfer.lookfile.init", data);
		            		var value=returnData.data;
		            		var fileName=value[0]+"-"+value[1];
		                	var arr=new Array();
		                	var locoData={};
		                	locoData.locoTypeName=locoTypeName;
		                	locoData.locono=locoNoStr;
		        			arr.push(locoData);
		        			arr.push(fileName);
		        			//弹出文件查看窗口
		        			RTU.invoke("app.filetransfer.lookfile.init",arr);
		            	}
		            	else{
		            		RTU.invoke("header.notice.show","未找到相关作业文件或运行文件");
		            	}
		            },
				});
				
			};