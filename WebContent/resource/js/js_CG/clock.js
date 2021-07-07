var CHANCE_SPEC, x, y;

CHANCE_SPEC = 50;
x = 0;
y = 0;
//获取随机数
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1) - min);
}
//给数据数组具体的索引赋值
function drawSpec(data, x, y, w) {
    var index;
    index = (x + y * w) * 4;
    data.data[index + 0] = 0;
    data.data[index + 1] = 0;
    data.data[index + 2] = 0;
    data.data[index + 3] = 0;
}
//画模型
function drawPattern(canvas, ctx, data) {
  var w, h;
  //画布的宽和高
  w = canvas.width;
  h = canvas.height;
  while (x < w) {
    if (rand(1, 100) < CHANCE_SPEC) {
      drawSpec(data, x, y, w);
    }
    x++;
  }
  if (x === w) {
    x = 0;
    y++;
  }
  if (y === h) {
    ctx.putImageData(data, 0, 0);
    return;
  }
  //循环调用
  drawPattern(canvas, ctx, data);
}

function main() {
  var canvas, ctx, data;
  canvas = document.getElementById('my-canvas');
  //getContext() 方法返回一个用于在画布上绘图的环境。
  ctx = canvas.getContext('2d');
  //getImageData() 方法返回 ImageData 对象，该对象拷贝了画布指定矩形的像素数据color/alpha 以数组形式存在，并存储于 ImageData 对象的 data 属性中。
  data = ctx.getImageData(0, 0, canvas.width, canvas.height);
  //画模型
  drawPattern(canvas, ctx, data);
  updateTime();
}
function CurrentTime(seconds,minutes,hours,days) {
    this.second = seconds;
    this.minute = minutes;
    this.hour = hours;
    this.day = days;
};
var currentTime = new CurrentTime(16,66,27,108);
//更新时间
function updateTime() {
  var  seconds, minutes, hours, times, i;
  //获取本地日期
  //解析成json格式的时间
  times = {
    'second': currentTime.second,
    'minute': currentTime.minute,
    'hour': currentTime.hour,
    'day':currentTime.day
  };
  //for in循环不能设置，只能从第一个到最后一个进行循环）。
    // json只能用for in循环，因为json的下标是没有规律的字符串，没有length。
    // 所以，一般数组就用for循环，json用for in循环。
  for (var type in times) {
    //hasOwnProperty()方法返回一个布尔值，判断对象是否包含特定的自身（非继承）属性。
      if('second' == type){
          currentTime.second=times[type]+1;
      }else if('minute' == type){
          currentTime.minute=times[type]+2;
      }else if('hour' == type){
          currentTime.hour=times[type]+3;
      }else if('day' == type){
          currentTime.day=times[type]+4;
      }
    if(times.hasOwnProperty(type)){
      setTimes(type, timeToString(times[type]));
    }
  }
  setTimeout(updateTime, 2000);
}
//时间字符串的转换
function timeToString(currentTime) {
  var t;
  t = currentTime.toString();
  if (t.length === 1) {
    return '0' + t;
  }
  return t;
}
//获取指定对象的文本属性
function getPreviousTime(type) {
  return $('#' + type + '-top').text();
}
//
function setTimes(type, timeStr) {
  setTime(getPreviousTime(type + '-tens'), 
    timeStr[0], type + '-tens');
  setTime(getPreviousTime(type + '-ones'),
    timeStr[1], type + '-ones');
  setTime(getPreviousTime(type + '-two'),
    timeStr[2], type + '-two');
}
//第一个参数：指定的HTML标签对象的文本属性；第二个参数：时间字符串；第三个参数：标签ID
function setTime(previousTime, newTime, type) {
  if (previousTime === newTime) {
    return;
  }
  //从载入后延迟指定的时间去执行一个表达式或者是函数;
  setTimeout(function() {
    $('#' + type + '-top').text(newTime);
  }, 150);
  setTimeout(function() {
  $('.bottom-container',
    $('#' + type + '-bottom')).text(newTime);
  }, 365);
  animateTime(previousTime, newTime, type);
}
//第一个参数：指定的HTML标签对象的文本属性；第二个参数：时间字符串；第三个参数：标签ID
function animateTime(previousTime, newTime, type) {
  var top, bottom;
  top = $('#top-' + type + '-anim');
  bottom = $('#bottom-' + type + '-anim');
  $('.top-half-num', top).text(previousTime);
  $('.dropper', bottom).text(newTime);
  top.show();
  bottom.show();
  //visibility 属性规定元素是否可见。
  $('#top-' + type + '-anim').css('visibility', 'visible');
  $('#bottom-' + type + '-anim').css('visibility', 'visible');
  animateNumSwap(type);
  setTimeout(function() {
    hideNumSwap(type);
  }, 365);
}

function animateNumSwap(type) {
  //该方法检查每个元素中指定的类。如果不存在则添加类，如果已设置则删除之。这就是所谓的切换效果。
  $('#top-' + type + '-anim').toggleClass('up');
  $('#bottom-' + type + '-anim').toggleClass('down');
}

function hideNumSwap(type) {
  $('#top-' + type + '-anim').toggleClass('up');
  $('#bottom-' + type + '-anim').toggleClass('down');
  $('#top-' + type + '-anim').css('visibility', 'hidden');
  $('#bottom-' + type + '-anim').css('visibility', 'hidden');
}

$(document).ready(main);


window.requestAnimFrame = (function(callback){ 
    return window.requestAnimationFrame || 
        window.webkitRequestAnimationFrame || 
        window.mozRequestAnimationFrame || 
        window.oRequestAnimationFrame || 
        window.msRequestAnimationFrame || 
        function(callback){ window.setTimeout(callback, 1000 / 60); }
})();
