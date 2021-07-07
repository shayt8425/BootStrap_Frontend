//input的提示 2014.06.25 jw
//例子：  $("#test1").inputTip({text:"56565"});
; (function () {
    $.fn.extend({ "inputTip": function (o) {
        var obj = $.extend({
            text: "",
            iconCloseW: "12",
            isShowCloseBtn: true
        }, o || {});
        var that = this;
        that.isClick = false;
        function inputTipFn() {
            this.inputTip_text;
            this.inputTip_close;
            this.parentDiv;
            var that1 = this;
            this.initFn = function () {
                this.fillHtml(that);
                this.initEvent(that);
                return that;
            }
        };
        inputTipFn.prototype.fillHtml = function (that) {
        	var len=$(that).width();
        	if(len==0){
        		len=108;
        	}else{
        		len=$(that).outerWidth();
        	}
            if ($(that).parent(".wrapTipDiv").length == 0) {
                $(that).wrap("<div class='wrapTipDiv'></div>").parent().append("<div class='inputTip_text'></div><img src='../static/js/inputTip/img/inputTip_closeImg.png' class='inputTip_close'  alt='' />");
                $(that).css({ 'display': 'block', 'padding-left': '5px' });
                this.parentDiv = $(that).parent();
                this.parentDiv.css("width", len);
                this.inputTip_text = $(".inputTip_text", this.parentDiv);
                this.inputTip_close = $(".inputTip_close", this.parentDiv);
                this.inputTip_text.css({ "width": len - obj.iconCloseW, "height": $(that).outerHeight(), "line-height": $(that).outerHeight() + "px" }).text(obj.text);
                this.inputTip_close.css({ "width": obj.iconCloseW + "px", "margin-top": -obj.iconCloseW / 2 + "px" });
            }
            else {
                this.parentDiv = $(that).parent();
                this.parentDiv.css("width", $(that).outerWidth());
                this.inputTip_text = $(".inputTip_text", this.parentDiv);
                this.inputTip_close = $(".inputTip_close", this.parentDiv);
                this.inputTip_text.css({ "width": $(that).outerWidth() - obj.iconCloseW, "height": $(that).outerHeight(), "line-height": $(that).outerHeight() + "px" }).text(obj.text);
                this.inputTip_close.css({ "width": obj.iconCloseW + "px", "margin-top": -obj.iconCloseW / 2 + "px" });
            }

        }

        inputTipFn.countTimer = 0;
        inputTipFn.prototype.initEvent = function (that) {
            $(that).bind("click.inputTip", function () {
                var timer = setInterval(function () {
                    inputTipFn.countTimer++;
                    if ($(that).val() != "") {
                        $(".inputTip_text", $(that).parent()).hide();
                        inputTipFn.countTimer = 0;
                        clearInterval(timer);
                    }
                    if (inputTipFn.countTimer > 200) {
                        inputTipFn.countTimer = 0;
                        clearInterval(timer);
                    }
                }, 10);
            });
            var that1 = this;
            
            if (this.inputTip_text)
                this.inputTip_text.click(function () {
                    $(this).hide();
                    that1.inputTip_close.show();
                    if (!that.isClick) {
                        $(that).focus().trigger("click");
                        that.isClick = true;
                    }
                    else {
                        $(that).focus();
                        $(that).trigger("click");
                    }
                });
            that1.parentDiv.focusin(function (that) {
                that1.inputTip_close.show();
            });
            if (that1.inputTip_close)
            	 that1.inputTip_close.click(function () {
                    var ta = this;
                    $(that).val("");
                    if($(that).attr("id")=="lineName")$("#lineNo").val("");
                    $(that).each(function(i){
                    	for(var i=0;i<this.attributes.length;i++){
                    		if(this.attributes[i].name=="bureauid"||this.attributes[i].name=="locoab"){
                    			this.attributes[i].nodeValue="";
                    		}
                    	}
                    });
                    $(".inputTip_close", $(that).parent()).hide();
                    if (that.inputTip_close) {
                        $(ta).hide();
                        that1.inputTip_text.show();
                    }
                });
            $(that).blur(function () {
               // $(".inputTip_close", $(that).parent()).hide();
                if ($(that).val() == "") {
                    that1.inputTip_text.show();
                    $(".inputTip_close", $(that).parent()).hide();
                    
                }
                return false;
            });
            $(that).keydown(function () {
                that1.inputTip_text.hide();
                that1.inputTip_close.show();
            });
        }
        return new inputTipFn().initFn();
    }
    });
})();