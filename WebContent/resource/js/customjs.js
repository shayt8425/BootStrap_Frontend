

$(document).ready(function () {
 
  //给模态框添加拖拽触发区域
  function dragArea() {
    var dragHander = "<div id='dragThis' style='position: absolute;height: 40px;top: 0px;left: 0px;right:30px;z-index: 100'></div>"
    $(".modal-content").before(dragHander);
  }
  dragArea();  


  //弹出提示
  $("[data-toggle=tooltip]").tooltip({
    html: !0
  });

   //ie8 提示
    if (navigator.userAgent.indexOf("MSIE") > 0) {
 
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
            var alertBox = "<div id='ieAlert' class='alert bg-lightyellow' style='font-size:14px;position:absolute;top:1px;left:1px;z-index:9999;width:100%;'><button type='button' class='close' data-dismiss='alert'><span aria-hidden='true'>&times;</span><span class='sr-only'>Close</span></button><p>本页面采用HTML5+CSS3，您正在使用IE浏览器，在本页面的显示效果可能有差异。建议您使用以下浏览器：<a href='http://www.baidu.com/s?wd=google%E6%B5%8F%E8%A7%88%E5%99%A8'> <i class='fa fa-chrome'></i> Chrome</a><a href='http://browser.qq.com/'> <i class='fa fa-qq'></i> QQ浏览器（极速模式）</a> <span style='font-size: 14px;vertical-align: middle;padding-left: 15px'><span id='countdown'>5</span> 秒后自动关闭此提示</span></p></div>"

            $("body").before(alertBox);
            $("title").after("<script src='js/html5shiv.min.js'></script><script src='js/respond.js'></script>");//ie8时加载兼容脚本

            //设置倒计时
            function timer(){
                  var setTime;
                        var time=parseInt($("#countdown").text());
                        setTime=setInterval(function(){
                            if(time<=0){
                                clearInterval(setTime);
                                return;
                            }
                            time--;
                            $("#countdown").text(time);
                        },1000);
                }
                timer();

            //自动关闭
            function autoclose() {
                $("#ieAlert").addClass('hide');
              }
              setTimeout(autoclose,5000);
            }
    }

   

  
 

//拖拽元素，基于jq

$('.modal-dialog').each(function(){
        $(this).dragging({
          move : 'both',
          randomPosition : false ,
          hander:'#dragThis'
        });
      });


  //模态框隐藏时清空数据
    $("#myModal").on("hidden.bs.modal", function() {  
      $(this).removeData("bs.modal");  
    });  



  
    //tab页
   function tab_switch() {
     $("#tab2 li").click(function(){
     $(this).addClass('active').siblings().removeClass('active');
     $(".tabCon").eq($(this).index()).addClass("show").siblings().removeClass('show');   
    });
   }
   tab_switch() ;
   

      function closeButton() {
        $("#alert").find(".close").click(function() {
          $("#alert").toggleClass("hide");
          $("#file-list-header").toggleClass("hide");
        });
      }
      closeButton() ;

});//end






