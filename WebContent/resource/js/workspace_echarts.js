var data = [{name:"已处理数",value:85},{name:"进行中",value:85},{name:"已完成数",value:85}];
var pieOption = {
	//中间文字
	 title:{
	     show : true,
	     x: '35%',
	     y: '40%',
	     text:"本月告警总数",
	     subtext:'\t\t\t\t\t\t130台',
		 itemGap:4,
		 fontSize : 12,
		 subtextStyle:{
		      fontSize : 14,
		      fontWeight : 'bold',
		      color:'#000',
	     },
	 },
	 //鼠标焦点
	 tooltip: {
	     trigger: 'item',
	     formatter: "{b}: {c} ({d}%)"
	 },
	 //背景
	 backgroundColor:'',
	//每个区域的颜色
	 color:['#1fabe6','#f4a869','#76efc9'],
	 //
	 series: [
	     {
	         name:'统计',
			 type:'pie',
			 avoidLabelOverlap: false,
			 //饼图的大小
			 radius: ['40%', '70%'],
			 //位置
			 center : ['50%', '45%'],
			 //数据
			 data:data,
			 //样式
			 avoidLabelOverlap: true,	//是否启用防止标签重叠策略
			 itemStyle : {
			     normal : {
			    	 label : { 
			    		 show : false,   //隐藏标示文字{b}{c}次 \n
			    		 position:'outsideTop',
			    		 fontSize: 14,
			    		 formatter: "数量：{c} \n占比：{d}%\t",
			    		 borderWidth: 1,
			    		 borderRadius: 5,
			    		 borderColor: 'rgba(63,67,92,0.6)',
			    	 },
			    	 labelLine : { 
						 show : false,   //隐藏标示线
					 },
					 borderWidth: 10,
					 borderColor: '#fff',
	             },
	         },
	         hoverOffset:5,
	         emphasis:{
	        	 itemStyle:{
	        		 borderColor:'#fff',
	        	 }
	         }
	         
	     }
	 ],
	//小标签
	 legend: {
		 show:true,
	     orient: 'horizontal',
		 selectedMode: false,
		 left: '3%', //距离x轴的距离
		 bottom: '1%',//距离Y轴的距
		 width:400,
		 //每项间隔
		 itemWidth:18,
		 itemHeight:18,
		 selectedMode:true,
		 formatter: function (name) {
			 var total = 0;
			 var target = 0;
			 for (var i = 0, l = newData.length; i < l; i++) {
				 total += newData[i].value;
				 if (newData[i].name == name) {
					 target = newData[i].value;
				 }
			 }
			 if(total == 0){
				 return name +':  '+ 0 + ' 占比：' + 0 + '%';
			 }
			 return name +':  '+ target + ' 占比：' + ((target/total)*100).toFixed(0) + '%';
		 },
		 textStyle:{//图例文字的样式
		     fontSize:14,
		     padding:[0,20,0,0]
		 },
	 },
};
if(top.document.body.clientWidth>1400){
	pieOption['title']['x'] = "41%";
}
