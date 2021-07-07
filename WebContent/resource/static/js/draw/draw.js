var MyDraw = {
    Drawference: {
        weight: "1px",
        color: "red"
    },
    DrawPoint: function (x, y) {//画点
        var oDiv = document.createElement('div');
        oDiv.style.position = 'absolute';
        oDiv.style.height = this.Drawference.weight;
        oDiv.style.width = this.Drawference.weight;
        oDiv.style.backgroundColor = this.Drawference.color;
        oDiv.style.left = x + 'px';
        oDiv.style.top = y + 'px';
        return oDiv; //注意：返回的值是一个dom节点，但并未追加到文档中
    },
    DrawLine: function (id, x1, y1, x2, y2, htmlId) {//画一条直线的方法
        var x = x2 - x1; //宽
        var y = y2 - y1; //高
        var frag = document.createDocumentFragment();
        if (Math.abs(y) > Math.abs(x)) {//那个边更长，用那边来做画点的依据（就是下面那个循环），如果不这样，当是一条垂直线或水平线的时候，会画不出来
            if (y > 0)//正着画线是这样的
                for (var i = 0; i < y; i++) {
                    var width = x / y * i  //x/y是直角两个边长的比，根据这个比例，求出新坐标的位置
                    {
                        frag.appendChild(this.DrawPoint(width + x1, i + y1));
                    }
                }
            if (y < 0) {//有时候是倒着画线的
                for (var i = 0; i > y; i--) {
                    var width = x / y * i
                    {
                        frag.appendChild(this.DrawPoint(width + x1, i + y1));
                    }
                }
            }
        } //end if
        else {

            if (x > 0)//正着画线是这样的
                for (var i = 0; i < x; i++) {
                    var height = y / x * i
                    {

                        frag.appendChild(this.DrawPoint(i + x1, height + y1));
                    }
                }
            if (x < 0) {//有时候是倒着画线的
                for (var i = 0; i > x; i--) {
                    var height = y / x * i
                    {
                        frag.appendChild(this.DrawPoint(i + x1, height + y1));
                    }
                }
            } //end if
        }
        document.getElementById(id).appendChild(frag);
    },
    Clear: function (id) {
        document.getElementById(htmlId).getElementById(id).innerhtml = '';
    }

}