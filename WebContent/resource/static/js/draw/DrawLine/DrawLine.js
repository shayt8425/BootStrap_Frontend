//hjw 画线函数 对象形式：调用例子 new DrawLine({ startX: 10, startY: 10, endX: 188, endY: 188, containerId: "container" });
;(function(){
 function DrawLine(obj) {
    this.startX = obj.startX || 0;
    this.startY = obj.startY || 0;
    this.endX = obj.endX || 0;
    this.endY = obj.endY || 0;
    this.className = obj.className || "line";
    this.container = document.getElementById(obj.containerId);
    if (!this.container) return;
    this.setLine();
}
DrawLine.prototype.setLine = function () {
    if (this.startX == this.endX) {
        if (this.startY > this.endY) {
            var tempY = this.startY;
            this.startY = this.endY;
            this.endY = tempY;
        }
        for (var k = this.startY; k < this.endY; k++) {
            this.appendPoint(this.container, this.startX, k);
        }
    }
    var a = (this.startY - this.endY) / (this.startX - this.endX);
    var b = this.startY - a * this.startX;
    if (Math.abs(this.startX - this.endX) > Math.abs(this.startY - this.endY)) {
        if (this.startX > this.endX) {
            var tempX = this.endX;
            this.endX = this.startX;
            this.startX = tempX;
        }
        var left = this.container.style.left;
        var top = this.container.style.top;
        for (var i = this.startX; i <= this.endX; i++) {
            this.appendPoint(this.container, i, a * i + b);
        }
    } else {
        if (this.startY > this.endY) {
            var tempY = this.startY;
            this.startY = this.endY;
            this.endY = tempY;
        }
        for (var j = this.startY; j <= this.endY; j++) {
            this.appendPoint(this.container, (j - b) / a, j);
        }
    }
}
DrawLine.prototype.appendPoint = function (container, x, y) {
    var node = document.createElement("div");
    node.className = "line";
    node.style.marginTop = y;
    node.style.marginLeft = x;
    container.appendChild(node);
} 
//函数形式  调用： drawLine({ startX: 10, startY: 10, endX: 188, endY: 188, containerId: "container" });
function drawLine(obj) {
    var startX = obj.startX || 0;
    var startY = obj.startY || 0;
    var endX = obj.endX || 0;
    var endY = obj.endY || 0;
    var className = obj.className || "line";
    var container = obj.containerId;//$ 对象
    if (!container) return;
    if (startX == endX) {
        if (startY > endY) {
            var tempY = startY;
            startY = endY;
            endY = tempY;
        }
        for (var k = startY; k < endY; k++) {
            createPoint(container, startX, k);
        }
    }
    var a = (startY - endY) / (startX - endX);
    var b = startY - ((startY - endY) / (startX - endX)) * startX;
    if (Math.abs(startX - endX) > Math.abs(startY - endY)) {
        if (startX > endX) {
            var tempX = endX;
            endX = startX;
            startX = tempX;
        }
        var left = container.style.left;
        var top = container.style.top;
        for (var i = startX; i <= endX; i++) {
            createPoint(container, i, a * i + b);
        }
    } else {
        if (startY > endY) {
            var tempY = startY;
            startY = endY;
            endY = tempY;
        }
        for (var j = startY; j <= endY; j++) {
            createPoint(container, (j - b) / a, j);
        }
    }
    function createPoint(container, x, y) {
        var node = document.createElement("div");
        node.className = className;
        node.style.marginTop = y;
        node.style.marginLeft = x;
       container.appendChild(node);
    }
}
})()

