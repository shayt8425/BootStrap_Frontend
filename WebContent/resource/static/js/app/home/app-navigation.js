RTU.DEFINE(function (require, exports) {
/**
 * 模块名：菜单
 * name：
 * date:2015-2-12
 * version:1.0 
 */
    require("jquery/jquery-1.7.2.min.js");
    require("popuwnd/js/popuwnd.js");
//    require("app/home/app-header.js");

    var NavPopuwnds = {};

    ///描述：注册创建导航弹出窗的方法
    ///方法名：navigation.popuwnd.create
    ///参数：param窗体对象option：{title:"",html:"",width:60,height : 50 * this.num,	left : this.data.left,	top : 60,	shadow : false,	isMove : false,	removable:false,deletable:false}
    ///返回值：窗体对象
    ///执行方式：调用
    ///调用例如：RTU.invoke("navigation.popuwnd.create", param);	
    RTU.register("navigation.popuwnd.create", function () {
        var index = 0;
        return function (param) {
            index++;
            var popuwnd = new PopuWnd(param);
            popuwnd._index = index;
            NavPopuwnds[index] = popuwnd;
            $.extend(popuwnd.close, function () {
                NavPopuwnds[popuwnd._index] = null;
            });
            return popuwnd;
        };
    });
    ///描述：注册导航栏被点击时的响应事件
    ///方法名：navigation.module.active
    ///参数：module即模块名称
    ///返回值：无
    ///执行方式：调用
    ///调用例如：RTU.invoke("navigation.module.active",module)
    RTU.register("navigation.module.active", function () {
        var lastModule;
        return function (module) {
            if (lastModule) {
                RTU.invoke("navigation." + lastModule + ".deactivate");
            }
            RTU.invoke("navigation." + module + ".activate");
            RTU.invoke("app.index.stopTimer");
            RTU.invoke("app.showthisLineLoco.stopTimer");
            lastModule = module;
        };
    });
    ///描述：注册创建左栏主菜单方法
    ///方法名：navigation.main.create
    ///参数：data
    ///返回值：无
    ///执行方式：调用
    ///调用例如：RTU.invoke("navigation.main.create",data)
    RTU.register("navigation.main.create", function () {
        var Item = function (data) {
            this.data = data;
            this.$item = $("<div class='nav_item'><div class='nav_item_icon'></div><div class='delimiter'>|</div><div class='nav_item_content'></div><div class='menu-item-arrow'></div><div class='nav_item_notice hidden font-12-3'></div></div>");
            this.initText = function () {
                this.$item.addClass("nav_item_" + this.data.name);
                this.$item.find(".nav_item_content").html(this.data.alias);
                //this.$item.find(".nav_item_notice").html(this.data.alias);
                //判断是否有二级菜单显示向右箭头
                if(data.module == null || data.module.length==0){
                	this.$item.find(".menu-item-arrow").hide();
                }
            };
            this.initClick = function () {
                this.$item.click($.proxy(function () {
                    RTU.invoke("navigation.module.active", this.data.name);
                    if (this.data.level == 1) {
                    	if(this.data && this.data.url){
                    		RTU.invoke("app.module.active", this.data.name);
                    		$(".nav_item_active").removeClass("nav_item_active_HOVER_mark").removeClass("nav_item_active");
//                    		$(".nav_item_"+this.data.name).addClass("nav_item_active_HOVER_mark").addClass("nav_item_active");
                    	}
                    } else {
                        RTU.invoke("app.module.active", this.data.name);
                    }
                }, this)).mouseover($.proxy(function () {                	
                    RTU.invoke("navigation.module.active", this.data.name);
                    if (this.data.level == 1) {
                    } else {
                        RTU.invoke("app.module.active", this.data.name);
                    }

                }, this));

            };
            this.initHover = function () {
                this.$item.mouseover($.proxy(function () {
                    if (!this.data.isActive) {
                        this.$item.removeClass("nav_item_active").addClass("nav_item_hover");
                    }
                    //this.$item.find(".nav_item_notice").attr("class", "nav_item_notice font-12-3");
                }, this), $.proxy(function () {
                    if (!this.data.isActive) {
//                        this.$item.removeClass("nav_item_hover");
                    	this.$item.removeClass("nav_item_hover").removeClass("nav_item_active");
                    }
                    //this.$item.find(".nav_item_notice").attr("class", "nav_item_notice hidden font-12-3");
                }, this)).mouseout(function(e){
                	$(e.currentTarget).removeClass("nav_item_active");
//                		if($(".nav_item_active")&&$(".nav_item_active").length>1){
//                			if(!$(e.currentTarget).hasClass("nav_item_active_HOVER_mark")){
//                				$(e.currentTarget).removeClass("nav_item_hover").removeClass("nav_item_active");
//                			}
                			
//                		}
                	if($(".nav_sub_item")&&$(".nav_sub_item").length>0){
                		
	                	$("#map").mouseover(function(){
	                		if($(".nav_item_active_HOVER_mark")&&$(".nav_item_active_HOVER_mark").length>0){
	                			
	                			 var a=$(".nav_item_active");
	                			 if(a&&a.length==2){
	                				 $(a).each(function() {
	                	                    if(!$(this).hasClass("nav_item_active_HOVER_mark")){
	                	                    	$(this).removeClass("nav_item_active");
	                	                    }
	                	                });
	                			 }

	                			
	                		}else{
	                			//$(".nav_item_active").removeClass("nav_item_active");
	                		}
	                		if($(".nav_sub_item")&&$(".nav_sub_item").length>0){
	                			if($(".nav_sub_item_active")&&$(".nav_sub_item_active").length>0){
	                				
	                			}
	                			$(".nav_sub_item").parent().parent().parent().parent().parent().remove();
	                		}
	                	});
                	}
                });                
            };
            this.initActive = function () {
                if (this.data.isActive) {
                	 this.$item.removeClass("nav_item_hover").addClass("nav_item_active");
//                    this.$item.attr("class", "nav_item nav_item_active nav_item_" + this.data.name);
                    if (this.data.popuwnd) {
                        this.data.popuwnd.close();
                        this.data.popuwnd = null;
                    }
                    if (this.data.level == 1) {
                        var offset = this.$item.offset();
                        this.data.module = this.data.module && this.data.module.length ? this.data.module : [];
                        this.data.popuwnd = RTU.invoke("navigation.sub.create", this.data);
                    }
                }
            };
            this.initEvent = function () {
                if (this.data.level != 1) {
                    RTU.register("app." + this.data.name + ".nav.activate", $.proxy(function () {
                        return $.proxy(function () {
                            var offset = this.$item.offset();
                            this.$item.removeClass("nav_item_hover").addClass("nav_item_active");
//                            this.$item.attr("class", "nav_item nav_item_active nav_item_" + this.data.name);
                            this.data.left = offset.left + 116;
                            this.data.top = offset.top-5;
                            this.data.isActive = true;
                        }, this);
                    }, this));
                    RTU.register("app." + this.data.name + ".nav.deactivate", $.proxy(function () {
                        return $.proxy(function () {
                        	this.$item.removeClass("nav_item_hover").removeClass("nav_item_active");
//                            this.$item.attr("class", "nav_item nav_item_" + this.data.name);
                            this.data.isActive = false;
                        }, this);
                    }, this));
                } else {
                    RTU.register("navigation." + this.data.name + ".activate", $.proxy(function () {
                        return $.proxy(function () {
//                            this.$item.attr("class", "nav_item nav_item_active nav_item_" + this.data.name);
                        	this.$item.removeClass("nav_item_hover").addClass("nav_item_active");
                            var offset = this.$item.offset();
                            this.data.module = this.data.module && this.data.module.length ? this.data.module : [];                            
                            this.data.left = offset.left + 111;
                            this.data.top = offset.top-5;
                            this.data.popuwnd = this.data.module.length>0?RTU.invoke("navigation.sub.create", this.data):null;
                            this.data.isActive = true;
                        }, this);
                    }, this));
                    RTU.register("navigation." + this.data.name + ".deactivate", $.proxy(function () {
                        return $.proxy(function () {
//                            this.$item.attr("class", "nav_item nav_item_" + this.data.name);
                        	if(this.data.level==1){
                        		if(!this.$item.hasClass("nav_item_active_HOVER_mark")){
                            		this.$item.removeClass("nav_item_hover").removeClass("nav_item_active");
                            	}
                        	}else{
                        		this.$item.removeClass("nav_item_hover").removeClass("nav_item_active");
                        	}                        	
                        	if (this.data.popuwnd) {
                        		this.data.popuwnd.close();
                        		this.data.popuwnd = null;
                        	}
                        	this.data.isActive = false;
                        }, this);
                    }, this));
                }
            };
            this.initMove = function () {
                var pX = -1;
                var pY = -1;
                var isDown = false;
                var isMove = false;
                this.$item.mousedown($.proxy(function (e) {
                    pY = +e.clientY;
                    pX = +e.clientX;
                    isDown = true;
                }, this));
                $("body").mouseup(function () {
                    pX = 0;
                    pY = 0;
                    isDown = false;
                });
                try {
                    document.addEventListener('mousemove', $.proxy(function (handle) {
                        this.move(handle);
                    }, this), false);
                } catch (e) {
                    document.attachEvent('onmousemove', $.proxy(function (handle) {
                        this.move(handle);
                    }, this));
                } finally {
                    try {
                        document.onmousemove = $.proxy(function (handle) {
                            this.move(handle);
                        }, this);
                    } catch (die) {
                    }
                }
                this.move = function (handle) {
                    if (handle && handle.clientY && !isMove && isDown && Math.sqrt(Math.pow(+handle.clientY - pY, 2) + Math.pow(+handle.clientX - pX, 2)) > 30) {
                        RTU.invoke("navigation.main.create", {
                            datas: [this.data],
                            left: handle.clientX,
                            top: handle.clientY + 7,
                            isMove: true
                        });
                        this.remove();
                        isMove = true;
                    }
                };
            };
            this.init = function () {
                this.initText();
                this.initClick();
//                this.initMove();
                this.initEvent();
                this.initHover();
                this.initActive();
                /*if(this.data.name=="failurewarning")
           	 	{
	               	this.$item.click();
	               	this.$item.removeClass("nav_item_active");	
           	 	}*/
                return this.$item;
            };
            this.remove = function () {
                this.$item.remove();
                this.onRemove(this.$item);
                this.$item = null;

            };
            this.onRemove = function ($item) {

            };
        };
        var Nav = function (data) {
            this.data = data;
            this.$nav = $("<div></div>");
            this.popuwnd;
            this.num = 0;
            this.init = function () {
                this.initText();
                this.initPopuWnd();
                this.initLevel();
            };
            this.initText = function () {
                for (var i = 0; data.datas.length && i < data.datas.length; i++) {
                    if (data.datas[i].level == 1 || data.datas[i].level == 2) {
                        this.$nav.append(this.bind(new Item(data.datas[i])).init());
                        this.num++;
                    }
                }
            };
            this.bind = function (item) {
                item.onRemove = $.proxy(function () {
                    if (this.popuwnd.h - 50 < 10) {
                        this.popuwnd.close();
                    } else {
                        this.popuwnd.setSize(this.popuwnd.w, this.popuwnd.h - 50);
                    }
                }, this);
                return item;
            };
            this.initLevel = function () {
                this.$nav.mousemove($.proxy(function () {
                    if (this.popuwnd) {
                        this.popuwnd.setLevel();
                    }
                }, this));
//                this.popuwnd.$wnd.mouseout($.proxy(function () {
//                    if (this.popuwnd) {
//                        this.popuwnd.close();
//                    }
//                }, this));
            };
            this.initPopuWnd = function () {
                this.popuwnd = RTU.invoke("navigation.popuwnd.create", {
                    title: "",
                    html: this.$nav,
                    width: 130,
                    height: 50.5 * this.num,
                    //left: this.data.left,
                    left: 0,
                    top: 60,
                    shadow: false,
                    isMove: false,
                    removable: false,
                    deletable: false
                });
                this.popuwnd.init();
                var togglebtn = $(".popuwnd-title", this.popuwnd.$wnd);
                $(".popuwnd-title-center", this.popuwnd.$wnd).css({ margin: "0px", height: "37px", width: "130px"});
                $(".popuwnd-title-right", this.popuwnd.$wnd).css({ height: "37px"}).addClass("popuwnd-title-right-change");
                togglebtn.append("<div class='popuwnd-title-toggleShrinkExpand popuwnd-title-toggleExpand'></div>");
                $(".popuwnd-main", this.popuwnd.$wnd).css({ top: "22px"});  
                $(".popuwnd-title-toggleShrinkExpand", this.popuwnd.$wnd).click(function(){
                	if($($(this).parent().parent().parent()).height()>50){
                		window.pheight=$($(this).parent().parent().parent()).height();
                	}
                	var thatParent = $(this).parent().parent();
                	if($(".popuwnd-main", thatParent).hasClass("hidden")){
                		$(".popuwnd-title-center", thatParent).css({ width: "130px"});
                		$(".popuwnd-main", thatParent).removeClass("hidden");
                		$($(this).parent().parent().parent()).css({height:window.pheight});
                		$(".popuwnd-title", thatParent).css({ width: "130px", height: "37px"});
                		$(this).removeClass("popuwnd-title-toggleShrink").addClass("popuwnd-title-toggleExpand");
                	}else{
                		$(".popuwnd-title-center", thatParent).css({ width: "37px"});
                		$($(this).parent().parent().parent()).css({height:"50px"});
                		$(".popuwnd-main", thatParent).addClass("hidden");
                		$(".popuwnd-title", thatParent).css({ width: "37px", height: "37px"});
                		$(this).removeClass("popuwnd-title-toggleExpand").addClass("popuwnd-title-toggleShrink");
                		if($(".nav_sub_item")&&$(".nav_sub_item").length>0){
                			$(".nav_sub_item").parent().parent().parent().parent().remove();
                		}
                	}
                });
               /* $(".popuwnd-title-toggleShrinkExpand", this.popuwnd.$wnd).mouseover(function(){
                	if($($(this).parent().parent().parent()).height()>50){
                		window.pheight=$($(this).parent().parent().parent()).height();
                	}
                	var thatParent = $(this).parent().parent();
                	if($(".popuwnd-main", thatParent).hasClass("hidden")){
                		$(".popuwnd-title-center", thatParent).css({ width: "130px"});
                		$(".popuwnd-main", thatParent).removeClass("hidden");
                		$($(this).parent().parent().parent()).css({height:window.pheight});
                		$(".popuwnd-title", thatParent).css({ width: "130px", height: "37px"});
                		$(this).removeClass("popuwnd-title-toggleShrink").addClass("popuwnd-title-toggleExpand");
                	}
                });
                $(".popuwnd-title-toggleShrinkExpand", this.popuwnd.$wnd).click();*/
            };
        };
        return function (data) {
            new Nav(data).init();
        };
    });

    ///描述：注册创建下级菜单方法
    ///方法名：navigation.sub.create
    ///参数：data模块数据
    ///返回值：下一级菜单窗口
    ///执行方式：调用
    ///调用例如：RTU.invoke("navigation.sub.create",data)
    window.set = {};
    RTU.register("navigation.sub.create", function () {
        var Item = function (data, flag) {
            this.data = data;
            this.$item = $("<div class='nav_sub_item'><div class='nav_sub_item_text font-12-3'></div></div>");
//        	this.$item.css("background", $(".nav_item").css("background"));
//            this.initText = function () {
//            	this.$item.find(".nav_sub_item_text").text(this.data.alias);
//            	this.$item.addClass("nav_item_" + this.data.name);
//            };
            
            var color= $(".nav_item").css("background");
       	   if (color == "#c0392b"||color.indexOf("rgb(192, 57, 43)")>=0) {
       		 this.$item.addClass("background_red");
            } else if (color == "#009d0c"||color.indexOf("rgb(0, 157, 12)")>=0) {
           	 this.$item.addClass("background_green");
            } else {
           	 this.$item.addClass("background_blue");
            }
            
            this.initText = function () {
            	this.$item.find(".nav_sub_item_text").text(this.data.alias);
            	this.$item.addClass("nav_item_" + this.data.name);
            	
//            	this.$item.css("background", $(".nav_item").css("background"));
//            	if(flag == 1){
//            		this.$item.attr("style","border-radius:6px 6px 0px 0px;");
//            		this.$item.find(".nav_sub_item_text").attr("style","border-radius:6px 6px 0px 0px;");
//            	}
//            	if(flag == 2){
//            		this.$item.attr("style","border-radius:0px 0px 6px 6px;");
//            		this.$item.find(".nav_sub_item_text").attr("style","border-radius:6px 6px 0px 0px;");
//            	}
//            	if(flag == 3){
//            		this.$item.attr("style","border-radius:6px 6px 6px 6px;");
//            		this.$item.find(".nav_sub_item_text").attr("style","border-radius:6px 6px 0px 0px;");
//            	}
            };
            this.initHover = function () {
                this.$item.mouseover($.proxy(function () {
                    this.$item.addClass("nav_sub_item_HOVER");
                }, this)).mouseleave($.proxy(function(e){
                	this.$item.removeClass("nav_sub_item_HOVER");
                	if(!$(e.toElement).hasClass("nav_sub_item")&&!$(e.toElement).hasClass("nav_sub_item_text")&&!$(e.toElement).hasClass("colsItem")){
                		if($(".nav_sub_item")&&$(".nav_sub_item").length>0){
                			$(".nav_sub_item").parent().parent().parent().parent().parent().remove();
                		}
                	}
                },this));      
            };
            this.initClick = function () {
                this.$item.click($.proxy(function () {
                    if (this.data.level == 1) {
                    } else {
                    	 var a=$(".nav_item_active");
            			 if(a&&a.length==2){
            				 $(a).each(function() {
            	                    if($(this).hasClass("nav_item_active_HOVER_mark")){
            	                    	$(this).removeClass("nav_item_active").removeClass("nav_item_active_HOVER_mark");
            	                    }else{
//            	                    	$(this).addClass("nav_item_active").addClass("nav_item_active_HOVER_mark");
            	                    }
            	                });
            			 }else  if(a&&a.length==1){
//            				 $(a).addClass("nav_item_active_HOVER_mark");
            			 }
//                    	var parentItem=$(".nav_item_active");
//                    	if(parentItem&&parentItem.length>0){
//                    		$(parentItem).removeClass("nav_item_active");
//                    	}
                    	
                        RTU.invoke("app.module.active", this.data.name);
                    }
                }, this));
            };
            this.initActive = function () {
                if (this.data.fullName == window.set.data && window.set.isActive) {
                    this.$item.attr("class", "nav_sub_item nav_sub_item_active nav_item_" + this.data.name);
                }
            };
            this.initEvent = function () {
                if (this.data.level == 1) {
                	
                } else {
                    RTU.register("app." + this.data.name + ".nav.activate", $.proxy(function () {
                        return $.proxy(function () {
                            this.$item.attr("class", "nav_sub_item nav_sub_item_active nav_item_" + this.data.name);
                            RTU.invoke("header.maptooler.show", false);

                            window.set.data = data.fullName;
                            window.set.isActive = true;
                            this.data.isActive = true;
                        }, this);
                    }, this));
                    RTU.register("app." + this.data.name + ".nav.deactivate", $.proxy(function () {
                        return $.proxy(function () {
                            this.$item.attr("class", "nav_sub_item nav_item_" + this.data.name);

                            window.set.data = data.fullName;
                            window.set.isActive = false;
                            this.data.isActive = false;
                        }, this);
                    }, this));
                }
            };
            this.init = function () {
                this.initText();
                this.initClick();
                this.initEvent();
                this.initHover();
                this.initActive();
                return this.$item;
            };
        };
        var Nav = function (data) {
            this.data = data;
            this.$nav = $("<div></div>");
            this.popuwnd;
            this.initText = function () {
            	var flag = 0;
            	this.$nav.width(Math.ceil(data.module.length/4)*130);
            	var itemHtml=$("<div class='colsItem'></div>");
                for (var i = 0; data.module.length && i < data.module.length; i++) {
//                	if(i == 0 && data.module.length == 1){
//                		flag = 3;
//                		this.$nav.append(new Item(data.module[i], flag).init());
//                	}else if(i == data.module.length -1){
//                		flag = 2;
//                		this.$nav.append(new Item(data.module[i], flag).init());
//                	}else if(i == 0){
//                		flag = 1;
//                		this.$nav.append(new Item(data.module[i], flag).init());
//                	}else{
//                		flag = 0;
//                		this.$nav.append(new Item(data.module[i], flag).init());
//                	}
                	if(i%4==0){
                		itemHtml=$("<div class='colsItem'></div>")
                	}
                	itemHtml.append(new Item(data.module[i]).init());
                	if(i%4==3||i == data.module.length-1){                	
                		this.$nav.append(itemHtml);
                	}
//                	$(".nav_sub_item").css("background-color" ,$(".nav_item").css("background-color"));
                }
            };
            this.initPopuwnd = function () {
                this.popuwnd = RTU.invoke("navigation.popuwnd.create", {
                    title: "",
                    html: this.$nav,
                    width: 130,
                    height: this.data.module.length<4?50 * this.data.module.length:200,
                    left: this.data.left+20,
                    //					top : 60,
                    top: this.data.top+15,
                    shadow: false,
                    removable: false,
                    deletable: false
                });
                this.popuwnd.init();
            };
            this.init = function () {
                this.initText();
                this.initPopuwnd();
            };
            this.close = function () {
                try {
                    this.popuwnd.close();
                } catch (e) {
                }
                delete this.$nav;
                delete this.popuwnd;
                this.$nav = null;
                this.popuwnd = null;
            };
        };

        return function (data) {
            var nav = new Nav(data);
            nav.init();
            var navTitle = $(".popuwnd-title", nav.popuwnd.$wnd);
            navTitle.css("height","15px");
//            $(".popuwnd-title-left",navTitle).css("height","15px");
//            $(".popuwnd-title-center",navTitle).css("height","15px");
//            $(".popuwnd-title-right",navTitle).css("height","15px");
//            $(".popuwnd-main",nav.popuwnd.$wnd).css("top","0px");
//            navTitle.css("top","10px");
//            navTitle.attr("style","top:-10px; border-radius:6px 6px 6px 6px; opacity: 0");
//            $(".popuwnd-main",nav.popuwnd.$wnd).attr("style","top:-10px; border-radius:6px 6px 6px 6px; opacity: .9");
            navTitle.attr("style","top:-10px; opacity: 0");
            $(".popuwnd-main",nav.popuwnd.$wnd).attr("style","top:-10px; opacity: .9");
            return nav;
        };
    });
    //	RTU.register("navigation.item.offset", function() {
    //		return function(module) {
    //			$item = $(".nav_item_" + module);
    //			if ($item) {
    //				return $item.offset();
    //			} else {
    //				{
    //				}
    //				;
    //			}
    //		};
    //	});


    ///描述：注册导航加载方法
    ///方法名：navigation.init
    ///参数：无
    ///返回值：无
    ///执行方式：调用
    ///调用例如：RTU.invoke("navigation.init")
    RTU.register("navigation.init", function () {

        return function () {
            RTU.invoke("navigation.main.create", {
                datas: RTU.data && RTU.data.setting && RTU.data.setting.length ? RTU.data.setting : [],
                left: 5,
                top: 90
            });
        };
    });


    RTU.register("navigation.recycle", function () {
        return function () {
            for (var p in NavPopuwnds) {
                if (NavPopuwnds[p]) {
                    NavPopuwnds[p].close();
                }
            }
            NavPopuwnds = {};
        };
    });
    RTU.invoke("navigation.init");

});
