//分页插件编写

var RTGrid_New = (function ($) {
    RTGridFn.defaultParam = {
        url: "", //请求后台url
        extraUrlParam: null, //额外的url参数
        tableWidth: 800, //表格宽度
        tableHeight: 400, //表格高度
        hasCheckBox: true, //是否有checkbox
        showTrNum: true, //是否显示行号
        isSort: true, //是否排序
        colNames: null, //表格头部名字
        setPageSize: [30, 60, 90], //设置分页size
        pagerControlId: "RTGrid_Footdiv", //分页模块Id
        loadPageCp: null, //点击分页后的回调函数
        replaceTd: null, // [{ index: 1, fn: function (data) { return "<div>4444444444" + data + "</div>" },tdInitFn:function(td){} }, { index: 2, fn: function (data) { return "<div>55555555" + data + "</div>" } }], //替换单元格:[{index:1,fn:function(data){ return <div>+data+</div>}},{},{}]
        isShowPagerControl: true, //是否显示分页控制条，默认为true;
        isShowRefreshControl: true, //是否显示刷新文字提示，默认为true;
        isShowRefreshImgControl:false,
        clickTrEvent: null, //行点击事件
        selectTrEvent: null, //选择行事件
        beforeSortFn: null, //排序之前执行的函数
        beforeLoad: null, //加载之前的函数
        scrollTop: 0, //滚动条下拉距离
        isFirstLoad: true, //是否是第一次加载
        checkTrs: null, //保存点击了checkbox的行
        clickTr: null, //保存点击的行
        clickIdItem: "locoTypeid_locoNo_checiName",//保存点击过的行
        trRightClick:null//右键点击事件

    };
    var flagValue=false;
    var clickDataArr;//保存点击的行的数据
    function RTGridFn(param) {//构造函数
    	if(param.pageIndex&&param.pageIndex!=1){
    		this.pageIndex=param.pageIndex;
    	}else{
    		this.pageIndex = 1; //当前页
    	}
    	  
          this.totalPage = 1, //总页数
          this.pageSize = 30, //每页大小
          this.totalCount = 50; //总数
    	  this.totalRecords=0;
        this.param = this.checkData(param); //检查参数合法性,并且赋值
        if (this.param.beforeLoad) {
            this.param.beforeLoad(this);
        }
        this.sortParam = {}; //排序参数
      
        this.containDivId = this.param.containDivId; //容器id
        this.cDiv = $("#" + this.containDivId); //容器id jq对象
        if (this.param.url) {
            this.initData();
        }
        this.datas = this.param.datas; //数据
        this.msg=this.param.msg;
        if (!this.param.url && this.param.isShowPagerControl) {
            this.totalCount = this.param.datas.length;
            // this.param.setPageSize= [15, 30, 60]; //设置分页size
            this.setDatasPage();

        }
        this.pagerControl = {//分页控制模块
            conDiv: null,
            RTGridObj: null, //grid对象
            createControl: function (param) {
                this.RTGridObj = param.RTGridObj;
                this.param = $.extend({
                    url: "",
                    datas: null
                }, param || {});
                if (param.pagerControlId) {
                    this.conDiv = $("#" + param.pagerControlId, this.RTGridObj.cDiv).length ? $("#" + param.pagerControlId, this.RTGridObj.cDiv) : $("." + param.pagerControlId, this.RTGridObj.cDiv);
                    this.createHtml(this.conDiv, this.RTGridObj);
                }
            },
            createHtml: function (cdiv, that) {//创建分页html
                if (cdiv && cdiv.length == 1 && !cdiv.children().length) {
                    cdiv.empty().append(this.returnInnerHtml(that));
                }
                this.initPagerEvent();
            },
            returnInnerHtml: function (that) {
                var arr = [];
                arr.push('<div class="Page_Foot">');
                arr.push('<div class="pre_arrow">&lt;&lt;</div>');
                arr.push(' <div class="pre_Btn">上一页</div>');
                arr.push('<div class="page_showPage">1/1</div>');
                arr.push(' <div class="page_main"><div>转到第</div>');
                arr.push('<div class="RTGrid_page_inputDiv"> <input class="RTGrid_page_input" />');
                arr.push('</div>页<div class="RTGrid_Foot_Go">GO</div></div> ');
                arr.push('<div class="next_Btn">下一页</div>');
                arr.push('<div class="next_arrow">&gt;&gt;</div>');
                arr.push('<select class="RTGrid_selectPageSize"><option>' + that.param.setPageSize[0] + '</option>');
                arr.push('<option>' + that.param.setPageSize[1] + '</option><option>' + that.param.setPageSize[2] + '</option></select></div>');
                return arr.join("");
            },
            getData: function (obj) { //加载数据函数
                var p = $.extend({
                    url: "",
                    type: "get",
                    async: true,
                    cache: false,
                    data: {},
                    dataType: "json",
                    success: null,
                    timeout: 24000,
                    error: null
                }, obj || {});
                $.ajax(p);
            },
            initPagerEvent: function () {//初始化事件
                var that = this;
                this.setSize = (function (width, height) {
//                    var w = width || 310;
                    var h = height || 30;
                    $(".RTGrid_Footdiv ", that.RTGridObj.cDiv).css({ height: h });
                    return that.setSize = arguments.callee;
                })();
                this.loadPage = function (fncp) {
                    that.RTGridObj.showLoading();
                    if (that.RTGridObj.param.url) {
                    	if(that.param.containDivId=="yunxingjilu_grid_result"){
                    		if (that.param.url.indexOf("&flag=1")>0) {
                    			that.param.url=that.param.url.substring(0,that.param.url.indexOf("&flag=1"));
                    		}
                    	}
                    	
                        that.getData({ url: that.param.url, data: { page: that.RTGridObj.pageIndex, pageSize: that.RTGridObj.pageSize }, success: function (data) {
                            that.RTGridObj.param.datas = data.data;
                            that.RTGridObj.setPageParam(data);
                            that.RTGridObj.init(function () {
                                if (fncp) {
                                    fncp();
                                }
                            });
                           // that.RTGridObj.hideLoading();
                            if (that.param.loadPageCp && typeof that.param.loadPageCp == "function") {
                                that.param.loadPageCp(that);
                            }
                        }, error: function () {
                            that.RTGridObj.hideLoading();
                        }
                        });
                    } else {
                        that.RTGridObj.setDatasPage();
                        that.RTGridObj.init(function () {

                            if (fncp) {
                                fncp();
                            }
                        });

                    }
                    return that.loadPage = arguments.callee;
                };
                this.initClickEv = (function () {//初始化分页按钮的点击事件
                    $(".pre_arrow ", that.conDiv).unbind("click").click(function () {
                        that.RTGridObj.pageIndex = 1;
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.setShowPage();
                        that.loadPage();
                    });
                    $(".pre_Btn ", that.conDiv).unbind("click").click(function () {
                        that.RTGridObj.pageIndex = that.RTGridObj.pageIndex - 1;
                        if (that.RTGridObj.pageIndex < 1) {
                            that.RTGridObj.pageIndex = 1;
                        }
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.setShowPage();
                        that.loadPage();
                    });
                    $(".RTGrid_Foot_Go ", that.conDiv).unbind("click").click(function () {
                        that.RTGridObj.pageIndex = that.getGoInputNum();
                        if (that.RTGridObj.pageIndex < 1) {
                            that.RTGridObj.pageIndex = 1;
                        }
                        if (that.RTGridObj.pageIndex > that.getTotalPage()) {
                            that.RTGridObj.pageIndex = that.getTotalPage();
                        }
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.setShowPage();
                        that.setInputNumVal(that.pageIndex);
                        that.loadPage();
                    });
                    $(".next_Btn ", that.conDiv).unbind("click").click(function () {
                        that.RTGridObj.pageIndex = that.RTGridObj.pageIndex + 1;
                        if (that.RTGridObj.pageIndex >= that.getTotalPage()) {
                            that.RTGridObj.pageIndex = that.getTotalPage();
                        }
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.setShowPage();
                        that.loadPage();
                    });
                    $(".next_arrow ", that.conDiv).unbind("click").click(function () {
                        that.RTGridObj.pageIndex = that.getTotalPage();
                        if (that.RTGridObj.pageIndex > that.getTotalPage()) {
                            that.RTGridObj.pageIndex = that.getTotalPage();
                        }
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.setShowPage();
                        that.loadPage();
                    });
                    $(".RTGrid_selectPageSize ", that.RTGridObj.cDiv).unbind("change").change(function () {
                        if (that.RTGridObj.pageIndex > that.getTotalPage()) {
                            that.RTGridObj.pageIndex = that.getTotalPage();
                            that.setInputNumVal(that.RTGridObj.pageIndex);
                        }
                        that.RTGridObj.pageSize = that.getPageSize();
                        that.RTGridObj.pageIndex = 1;
                        that.loadPage(function () {
                            that.RTGridObj.pageIndex = 1;
                            that.setShowPage();
                        });
                    });
                })();
                this.getGoInputNum = function () {
                    var r = parseInt($(".RTGrid_page_input ", that.conDiv).val());
                    if (!r) {
                        return 0;
                    } else {
                        return r;
                    }
                };
                this.getTotalPage = function () {
                    if (!that.RTGridObj.param.url) {
                        var d = that.RTGridObj.param.datas;
                        var tp = d.length % that.getPageSize() == 0 ?
                            parseInt(d.length / that.getPageSize()) : parseInt(d.length / that.getPageSize()) + 1;
                        return tp;
                    }
                    else {
                        return that.RTGridObj.totalPage;
                    }
                };
                this.setPageSize = function () {
                    that.RTGridObj.pageSize = parseInt($(".RTGrid_selectPageSize ", that.conDiv).val());
                    return that.setPageSize = arguments.callee;
                } ();
                this.getPageSize = function () {
                    return parseInt($(".RTGrid_selectPageSize ", that.conDiv).val());
                };
                this.setInputNumVal = function (num) {
                    $(".RTGrid_page_input ", that.conDiv).val(num);
                },
                this.setShowPage = function () {
                    $(".page_showPage ", that.conDiv).html(that.RTGridObj.pageIndex + "/" + that.getTotalPage());
                    return that.setShowPage = arguments.callee;
                } ();
            }
        };

        this.init(); //初始化

    }
    RTGridFn.prototype = { //所有方法放到静态里面
    		
       setSize:function(width,height){
    	    this.cDiv.css({width:width,height:height});
    	    this.param.tableWidth=width||this.param.tableWidth;
    	    this.param.tableHeight=height||this.param.tableHeight;
    	   
       },
       refreshWidth:function(width,id){
        var that=this;
        var headTable=$(".RTTable_Head",$(id));
            var bodyTable=$(".RTTable-Body",$(id));
            var loadImgDiv=$(".RTGrid_LoadImgDiv",$(id));

            var oldWidth=$(headTable).width()||this.param.tableWidth;
            var changeWidth=(width-oldWidth)>194?194:(width-oldWidth);

            $(headTable).css({width:width});
            $(bodyTable).css({width:width});
            $(id).css({width:width});
            $(loadImgDiv).css({width:width});

            var headTr=$("tr:first",$(headTable));
            var headTds=$("td",$(headTr));
            var headTd=$("td:eq(1)",$(headTr));
            
            var bodyTr=$("tr:first",$(bodyTable));
            var bodyTds=$("td",$(bodyTr));
            var bodyTd=$("td:eq(1)",$(bodyTr));
         

            // alert($(headTd).width()+"  "+changeWidth);
            $(headTd).css({width:($(headTd).width()+changeWidth+1)+"px"});
            // alert($(headTd).width());
            $(bodyTd).css({width:($(headTd).width()+1)+"px"});


            $.each($(headTds), function (j, item) {
                if(j!=(headTds.length-1)){
                    // $(item).css({width:width/(headTds.length)+"px"});
                    $(bodyTds[j]).css({width:($(item).width()+1)+"px"});
                }
                
            });

           that.param.colModel[0].width=($(headTd).width()+1);
           this.param.tableWidth=width||this.param.tableWidth;
       },
        setDatasPage: function () {
            var st = (this.pageIndex - 1) * this.pageSize;
            var et = (st + this.pageSize) > this.param.datas.length ? this.param.datas.length : (st + this.pageSize);
            this.datas = this.param.datas.slice(st, et);
        },
        initData: function (obj) {
            var that = this;
            var p = $.extend({
                dataType: "json",
                data: $.extend({ pageSize: 30, page: 1 }, that.param.extraUrlParam || {})
            }, obj || {});
            this.showLoading();
            this.tool.initData({ data: p.data, dataType: p.dataType, async: false, url: this.param.url, success: function (data) {
                that.param.datas = data.data;
                that.param.msg=data.msg;
                if (!that.param.datas) {
                    that.param.datas = [];
                }
                that.setPageParam(data);

            }, error: function (e) {
                that.hideLoading();
                alert("加载数据失败！");
            }
            });
        },
        init: function (fncp) {
            // if (this.param.sortParam) {
            //     if (this.param.sortParam.itemName) {
            //         if (this.param.sortParam.upAndDown == "DECS") {
            //             this.sortDown(itemName);
            //         } else {
            //             this.sortUp(itemName);
            //         };
            //     };
            // };
            this.createHtml(this); //添加html
            var that = this;
            setTimeout(function () {
                that.initEvent(that); //初始化相关事件
            }, 1);
            if (fncp) {
                fncp();
            }
            if (this.param.loadPageCp) {
                this.param.loadPageCp(this);
            };
            this.setScroll_x(this);
            if(!this.param.isShowRefreshImgControl){
            	 this.hideLoading();
            }
           
            $(".RTGrid_Bodydiv", this.cDiv).scrollTop(this.scrollTop);
        },
        sortData:function(){

            if(!this.param.beforeSortFn&&this.sortParam.upAndDown){

   
             if(this.sortParam.upAndDown=="ASC"){
               
                this.sortUpFn(this.sortParam.itemName);
              }else{
                
                this.sortDownFn(this.sortParam.itemName);
               }
            }
        },
        refresh: function (datas) {
            if (this.param.url) {
                this.initData();
                this.init();
                return;
            }
            this.param.datas = datas || this.param.datas;
            this.setDatasPage();
            this.sortData();
            this.init();
        },
        setScroll_x: function (t) {
            var totalWidth =0;
            for (var i = 0, len = t.param.colModel.length; i < len; i++) {
                var tn = parseInt(t.param.colModel[i].width);
                totalWidth += tn;
            }
            if (t.param.hasCheckBox) {
            	totalWidth=totalWidth+31;
            }
            if (!totalWidth) return;
            if (totalWidth < t.cDiv.width()) {
                return;
            }
            $(".RTTable-Body", t.cDiv).css({ width: totalWidth });
            $(".RTGrid_Headdiv .RTTable_Head", t.cDiv).css({ width: totalWidth });
            $(".RTGrid_Headdiv", t.cDiv).css({ width: t.cDiv.width() - 20 });
            $(".RTGrid_Bodydiv", t.cDiv).scroll(function (e) {
                $(".RTGrid_Headdiv", t.cDiv).scrollLeft($(this).scrollLeft());
            });
            var tditem = $(".RTTable-Body thead tr td ", t.cDiv);
            $(".RTTable_Head thead tr td", t.cDiv).each(function (i, item) {
            	if(i!=(tditem.length-1)&&i!=0){
            		$(item).width($($(tditem).get(i)).width());
            	}
            });
        },
        createHtml: function (that) {
        	if(!this.param.isShowRefreshImgControl){
        		 this.showLoading();
        	}
           
            if (this.cDiv.length == 0) {
                this.tool.tError("找不到" + this.param.containDivId + "元素！");
            }
            if ($(".RTTable-Body", this.cDiv).length == 0) {
                this.cDiv.addClass("containGridDiv").empty().append(this.addTable());
            }
            else {
                this.param.isFirstLoad = false;
                var str = this.refreshBody();
                $($(".RTGrid_Bodydiv", this.cDiv)[0]).empty();
                $(".RTGrid_Bodydiv", this.cDiv)[0].innerHTML = str.join("");
                // this.setVariable();
            }
            this.setTableSize(this.param.tableWidth, this.param.tableHeight);
            this.setFootHeight();
            if (this.param.isShowPagerControl) {
                this.param.RTGridObj = this;
                that.pagerControl.createControl(this.param);
            }
           // if(!this.param.isShowRefreshImgControl||this.param.isFirstLoad){

            	 this.hideLoading();
           // }
           
            this.setVariable();

        },
        setVariable: function () {
            this.tb = $(".RTGrid_Bodydiv", this.cDiv);
            this.trs = $("tr", this.cDiv);
            this.tb_th_tds = $(".RTTable-Body thead tr td ", this.cDiv);
            this.tb_tb_trs = $(".RTTable-Body tbody tr  ", this.cDiv);
            this.tb_th_trs = $(".RTTable-Body thead tr", this.cDiv);
            this.th_th_tds = $(".RTTable_Head thead tr td ", this.cDiv);
            this.th_th_trs = $(".RTTable_Head thead tr  ", this.cDiv);
        },
        setPageParam: function (obj) {
            if (obj.pageIndex) {
                this.pageIndex = obj.pageIndex;
            }
            if (obj.pageSize) {
                this.pageSize = obj.pageSize;
            }
            if (obj.totalPage) {
                this.totalPage = obj.totalPage;
            }
            if(obj.totalRecords){
            	 this.totalRecords = obj.totalRecords;
            }
        },
        initEvent: function (that) {
            return {
            
                setScrollLeft: (function () {
                    that.tb.scroll(function (e) {
                        that.scrollTop = $(this).scrollTop();
                    });
                })(),
                moveTdSameWidth: (function () {//设置表头和主体的宽度一致
                    var tditem = that.tb_th_tds;
                    if (that.param.hasCheckBox) {
                    	 that.th_th_tds.each(function (i, item) {
                             if(i!=(that.th_th_tds.length-1)&&(i!=0)){
                             	$(item).width($($(tditem).get(i)).width());
                             	
                             }
                         	
                         	if(i==0){
                         		$(item).width($($(tditem).get(i)).width()+1);
                         	}
                             
                         });
                    }else{
                    	that.th_th_tds.each(function (i, item) {
                            if(i!=(that.th_th_tds.length-1)){
                            	$(item).width($($(tditem).get(i)).width());
                            }
                        });
                    }
                    
                    return that.moveTdSameWidth = arguments.callee;
                })(),
                mouseMoveEvent: (function () {//鼠标移过事件
                    setTimeout(function () {
                        var tditem = that.tb_tb_trs;
//                        var ths = that.th_th_trs;
                        tditem.hover(function () {
                            $(this).addClass("RTGrid_moveTr");
                        }, function () {
                            $(this).removeClass("RTGrid_moveTr");
                        });
                    }, 1);
                    return that.mouseMoveEvent = arguments.callee;
                })(),
                mouseTrClickEvent: (function () {//每行的点击事件
                    var tditem = $(".RTTable-Body tbody tr  ", that.cDiv);
                    var ths = that.th_th_trs;            
                    tditem.unbind("click.RTGrid").bind("click.RTGrid", function (e) {
                        tditem.removeClass("RTGrid_clickTr");
                        $(this).addClass("RTGrid_clickTr");
                        $("input:radio", tditem).removeAttr("checked");
                        $("input:radio", ths).removeAttr("checked");
                        $("input", $(this)).attr("checked", "checked");
                        if (that.param.clickTrEvent) {
                            that.setCheckBoxAndTr();
                            that.param.clickTrEvent(that);                       
                        };
                        clickDataArr=that.getSelectItemData();//获取选中行的数据
                        return false;
                    });
                    
                    tditem.unbind("mousedown").mousedown(function (e) { //点击图标右键调用回调函数
                      if (3 == e.which) {
                    	  tditem.removeClass("RTGrid_rightClickTr");
                          $(this).addClass("RTGrid_rightClickTr");
                          if(that.param.trRightClick){
                        	  var item = $(".RTTable-Body  tr[class*='RTGrid_rightClickTr']", this.cDiv);
                              var i = item.index();

                              var returnData={
                            		  data:i>=0?{ index: i, item: item, data: that.param.datas[i] }:{},
                    				  clientX:e.clientX,
                    				  clientY:e.clientY
                            	
                              };
                    		that.param.trRightClick(returnData);
                          }
                      }
                      return false;
                  });
                    
                    
                    return that.mouseTrClickEvent = arguments.callee;
                })(),
                tdOver: (function () {//显示或隐藏排序图标
                    setTimeout(function () {
//                        var cbkn = that.th_th_tds;
//                        cbkn.hover(function () {
//                            $(".RTGrid_sortDiv span", $(this)).show();
//                        }, function () {
//                            $(".RTGrid_sortDiv span", $(this)).hide();
//                        });

                    }, 1);
                    return that.tdOver = arguments.callee;
                })(),
                getDataTdIndex: function () {
                    return $(".RTTable-Body tbody tr:eq(0) td[class*='itemData']:first ", that.cDiv).index();
                },
                setCheckBox: (function (et) {//设置多选框事件
                    setTimeout(function () {
                        if (that.param.hasCheckBox) {
                            var tritem = that.trs;
                            tritem.each(function (i, item) {
                                if (i >= 2){
                                	$(":radio", item).data("itemData", that.param.url ? that.param.datas[i - 2] : that.datas[i - 2]);
                                	var data=that.param.datas[i - 2];
                                	if(!data)data=that.datas[i - 2];
                                	if(data&&clickDataArr&&data.recId==clickDataArr.recId){
                                		var check =$(":radio", item);
                                		$(item).addClass("RTGrid_clickTr");
                                		check[0].checked=true;
                                	}
                                }
                            });
                        }
                    }, 1);
                    return that.setCheckBox = arguments.callee;
                })(this),
                setSort: (function (that) {//设置排序事件

                    if (that.param.isSort) {
                        var cbkn = that.th_th_tds;
                        var tr = $(".RTTable-Body tbody tr:eq(0)", that.cDiv);
                        var tdi = $("td[itemname]:eq(0)", tr).index();
                
                        cbkn.each(function (i, item) {
                            if (!that || !that.param || !that.param.colModel || !that.param.colModel[i - tdi] || !that.param.colModel[i - tdi].isSort) {
                                return;
                            }
                            if (tdi!=-1&&i >= tdi && that.param.colModel[i - tdi].isSort) {
                                var imgt = $("<span class='RTGrid_sortDiv hidden'><span class='RTGrid_sort_1 hidden'><img src='../static/js/RTGrid/img/Sorting_1.png' /></span><span class='RTGrid_sort_2'><img src='../static/js/RTGrid/img/Sorting_2.png' /></span></span>");
                                if ($("span", item).length == 0) {
                                    $(item).append(imgt);
                                }
                                 $(item).unbind("click").click(function () {
                                	 cbkn.each(function (i, item1) {
                                		 $(".RTGrid_sortDiv",$(item1)).addClass("hidden");
                                	 });
                                	 $(".RTGrid_sortDiv",$(item)).removeClass("hidden");
                                	 
                                	 if(!$(".RTGrid_sort_2", $(item)).hasClass("hidden")){
                                		 var tdindex = $(item).index();
                                         var trBody = $(".RTTable-Body  tbody tr:eq(1)  ", that.cDiv);
                                         var itemName = $($("td", trBody).get(tdindex)).attr("itemName");
                                         $(".RTGrid_sort_2", $(item)).addClass("hidden");
                                         $(".RTGrid_sort_1", $(item)).removeClass("hidden");
                                         that.sortParam.itemName = itemName;
                                         that.sortParam.upAndDown = "ASC";
                                        
                                         if (that.param.beforeSortFn) {
                                             if (that.param.beforeSortFn(itemName, "ASC", that)) {
                                                 //that.sortUp(itemName);
                                                 return;
                                             }
                                             that.initData();
                                             that.init();
                                             return;
                                         }
                                        
                                         that.sortUpFn(itemName);
                                         that.init();
                                	 }else{
                                		 var tdindex = $(item).index();
                                         var trBody = $(".RTTable-Body  tbody tr:eq(1)  ", that.cDiv);
                                         var itemName = $($("td", trBody).get(tdindex)).attr("itemName");
                                         $(".RTGrid_sort_1", $(item)).addClass("hidden");
                                         $(".RTGrid_sort_2", $(item)).removeClass("hidden");
                                         that.sortParam.itemName = itemName;
                                         that.sortParam.upAndDown = "DESC";
                                      
                                         if (that.param.beforeSortFn) {
                                             if (that.param.beforeSortFn(itemName, "ASC", that)) {
                                                 //that.sortDown(itemName);
                                                 return;
                                             }
                                             that.initData();
                                             that.init();
                                             return;
                                         }
                                         that.sortDownFn(itemName);
                                         that.init();
                                	 }
                                    return false;
                                });
                                 $(item).mousedown(function(){
                                	 $(item).css("background","url('../static/js/RTGrid/img/list_title_bg_up.jpg')");
                                 });
                                 $(item).mouseup(function(){
                                	 $(item).css("background","url('../static/js/RTGrid/img/list_title_bg.png')");
                                 });
//                                 $(item).mouseover(function(){
//                                	 $(".RTGrid_sortDiv",$(item)).removeClass("hidden");
//                                 });
//                                 $(item).mouseout(function(){
//                                	 $(".RTGrid_sortDiv",$(item)).addClass("hidden");
//                                 });
//                                
//                                $(".RTGrid_sort_1", $(item)).unbind("click").click(function () {
//                                    var tdindex = $(this).parent().parent().index();
//                                    var trBody = $(".RTTable-Body  tbody tr:eq(1)  ", that.cDiv);
//                                    var itemName = $($("td", trBody).get(tdindex)).attr("itemName");
//                                    $(this).hide();
//                                    $(".RTGrid_sort_2", $(item)).show();
//                                    that.sortParam = {};
//                                    that.sortParam.itemName = itemName;
//                                    that.sortParam.upAndDown = "ASC";
//                                    if (that.param.beforeSortFn) {
//                                        if (that.param.beforeSortFn(itemName, "ASC", that)) {
//                                            //that.sortUp(itemName);
//                                            return;
//                                        }
//                                        that.initData();
//                                        that.init();
//                                        return;
//                                    }
//
//                                    that.sortUp(itemName);
//                                    return false;
//                                });
//                                $(".RTGrid_sort_2", $(item)).unbind("click").click(function () {
//                                	debugger;
//                                    var tdindex = $(this).parent().parent().index();
//                                    var trBody = $(".RTTable-Body  tbody tr:eq(1)  ", that.cDiv);
//                                    var itemName = $($("td", trBody).get(tdindex)).attr("itemName");
//                                    $(this).hide();
//                                    $(".RTGrid_sort_1", $(item)).show();
//                                    that.sortParam = {};
//                                    that.sortParam.itemName = itemName;
//                                    that.sortParam.upAndDown = "DESC";
//                                    if (that.param.beforeSortFn) {
//                                        if (that.param.beforeSortFn(itemName, "ASC", that)) {
//                                            //that.sortDown(itemName);
//                                            return;
//                                        }
//                                        that.initData();
//                                        that.init();
//                                        return;
//                                    }
//                                    
//                                    that.sortDown(itemName);
//                                   
//                                    return false;
//                                });
//

                            }
                        });
                    }
                    return that.setSort = arguments.callee;
                })(this),
                setFirstCheckBoxEv: (function () {//设置表头的多选框事件
                    var cbk = $(".RTTable_Head thead tr :radio  ", that.cDiv);
                    cbk.click(function () {
                        var cbkBody = $(".RTTable-Body  tr :radio  ", that.cDiv);
                        if ($(this).attr("checked")) {
                            cbkBody.attr("checked", "checked");
                        } else {
                            cbkBody.removeAttr("checked");
                        }
                        if (that.param.selectTrEvent) {
                            that.setCheckBoxAndTr();
                            that.param.selectTrEvent(that);
                        };

                    });
                    return that.setFirstCheckBoxEv = arguments.callee;
                })(),
                checkboxClick: (function () {//设置表主体的单选框事件
                    var cbkitem = $(".RTTable-Body  tr input[type='radio']", that.cDiv);
                    cbkitem.each(function (i, item) {
                        $(item).click(function (j,e) {
                            var that1 = this;
                            that.setFlag(false);
                            setTimeout(function () {
                                if (!$(that1).attr("checked")&&!flagValue) {
                                    $(that1).attr("checked", "checked");
                                    that.setFlag(true);
                                    var tditem = $(".RTTable-Body tbody tr  ", that.cDiv);
                                    tditem.removeClass("RTGrid_clickTr");
                                    var optRadio = $(".RTTable-Body  tr input[name='depotName']:checked", that.cDiv);
                                    $(optRadio).parent().parent().addClass("RTGrid_clickTr");
                                    clickDataArr=that.getSelectItemData();//获取选中行的数据
                                }
                                else {
                                	 if(!flagValue){
                                		 $(that1).removeAttr("checked");
                                		 that.setFlag(true);
                                	 }
                                }
                            }, 1);
                            setTimeout(function () {
                                if (that.param.selectTrEvent) {
                                    that.setCheckBoxAndTr();
                                    that.param.selectTrEvent(that, $(item));
                                };
                            }, 1);
                            return false;
                        });
                    });
                    return that.checkboxClick = arguments.callee;
                })(),
                setPageSizeFn: (function () {
                    setTimeout(function () {
                        if (that.param.setPageSize) {
                            $(".RTGrid_Footdiv select option ", that.cDiv).each(function (i, item) {
                                $(item).text(that.param.setPageSize[i]);
                                $(item).val(that.param.setPageSize[i]);
                            });
                        }
                    }, 1);
                    return that.setPageSizeFn = arguments.callee;
                })()
            };
        },
        setCheckBoxAndTr: function () {
            var that = this;
            that.setFlag(true);
            setTimeout(function () {
                var ckbs = $(".RTTable-Body tr input:radio:checked", that.cDiv);
                var ckbsId = [];
                var cidt = that.param.clickIdItem.split("_");
                ckbs.each(function (i, item) {
                    var idd = $(item).data("itemData");
                    if (cidt.length == 3) {
                        if (idd && idd[cidt[0]] && idd[cidt[1]] && idd[cidt[2]]) {
                            ckbsId.push(idd[cidt[0]] + "_" + idd[cidt[1]] + "_" + idd[cidt[2]]);
                        }
                    } else if (idd.length == 1) {
                        ckbsId.push(idd[cidt[0]]);
                    }
                });
                that.param.checkTrs = ckbsId;
                var item = $(".RTTable-Body  tr[class*='RTGrid_clickTr']", that.cDiv);
                var indext = item.index();
                var ckbdata = that.param.url ? that.param.datas[indext] : that.datas[indext];
                if (cidt.length == 3) {
                    if (ckbdata && ckbdata[cidt[0]]) {
                        that.param.clickTr = ckbdata[cidt[0]] + "_" + ckbdata[cidt[1]] + "_" + ckbdata[cidt[2]];
                    }
                } else if (cidt.length == 1) {
                    if (ckbdata && ckbdata[cidt[0]]) {
                        that.param.clickTr = ckbdata[cidt[0]];
                    }
                }else if (cidt.length == 2) {
                    if (ckbdata && ckbdata[cidt[0]]) {
                        that.param.clickTr = ckbdata[cidt[0]]+ "_" + ckbdata[cidt[1]];
                    }
                }

            }, 25);

        },
        currClickItem: function () {//返回当前点击的行数据
            var item = $(".RTTable-Body  tr[class*='RTGrid_clickTr']", this.cDiv);
            var i = item.index();
            if (i >= 0) {
                return { index: i, item: item, data: this.param.datas[i] };
            } else {
                return {};
            }
        },
        selectItem: function () {//返回当前选中的行的数据
            var ckbs = $(".RTTable-Body tr input:radio:checked", this.cDiv);
            return ckbs;
        },
        setClickData:function(){//清空记录保存的当前行数据
        	clickDataArr=null;
        },
        setTableSize: function (width, height) {//重设table大小
            var that = this;
            var tbd = $(".RTGrid_Bodydiv", this.cDiv);
            var rf = $(".RTGrid_Footdiv", this.cDiv);
            var loadD = $(".RTGrid_LoadImgDiv", this.cDiv);
            if (width && height)
                this.cDiv.css({ width: width, height: height });
            tbd.height(function (i, v) {
                if (that.param.isShowPagerControl&&that.param.isShowRefreshControl){
                	return that.tool.pxToInt(that.cDiv.height()) - (that.tool.pxToInt(rf.height()) || 30) * 2-((that.tool.pxToInt(loadD.height()) || 20)) - 5;
                }else if (that.param.isShowPagerControl&&!that.param.isShowRefreshControl){
                	$(".RTGrid_LoadImgDiv", that.cDiv).remove();
                	$(".RTGrid_Footdiv", that.cDiv).css("bottom","0px");
                	return that.tool.pxToInt(that.cDiv.height()) - (that.tool.pxToInt(rf.height()) || 30) * 2  - 5;
                }else if (!that.param.isShowPagerControl&&that.param.isShowRefreshControl){
                	$(".RTGrid_Footdiv", that.cDiv).remove();
                	return that.tool.pxToInt(that.cDiv.height()) -(that.tool.pxToInt(rf.height()) || 30) - ((that.tool.pxToInt(loadD.height()) || 20)) - 5;
                }else {
                    $(".RTGrid_Footdiv", that.cDiv).remove();
                    $(".RTGrid_LoadImgDiv", that.cDiv).remove();
                    return that.tool.pxToInt(that.cDiv.height()) - (that.tool.pxToInt(rf.height()) || 30) * 1 - 5;
                }
            });
        },
        sortUpFn: function (strName) {
            var resultData = this.param.url?this.param.datas:this.datas;
            resultData.sort(function (str1, str2) {
                var t = Date.parse(str1[strName]);
                var t2 = Date.parse(str2[strName]);
                if (t && typeof str1[strName] != "number") {
                    if (t < t2) {
                        return -1;
                    } else if (t > t2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
                try {
                    if (/^[\u4e00-\u9fa5]+$/i.test(str1[strName].substring(0, 1))) {
                        var n1 = makePy(str1[strName].substring(0, 1));
                        var n2 = makePy(str2[strName].substring(0, 1));
                        if (n1 < n2) {
                            return -1;
                        } else if (n1 > n2) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                } catch (e) {

                }
                if (str1[strName] < str2[strName]) {
                    return -1;
                } else if (str1[strName] > str2[strName]) {
                    return 1;
                } else {
                    return 0;
                }
            });
          //邓国知20151027新加
            if(this.datas)this.datas=resultData;
            if(this.param.datas)this.param.datas=resultData;
        },
        sortUp: function (strName) {//从小到达排序
            this.showLoading();
            this.sortUpFn(strName);
            this.datas=this.param.datas;
            this.createHtml(this); //添加html
            this.initEvent(this); //初始化相关事件
            if (this.param.loadPageCp) {
                this.param.loadPageCp(this);
            };
            this.setScroll_x(this);
            this.hideLoading();
        },
        sortDownFn: function (strName) {
           var resultData = this.param.url?this.param.datas:this.datas;
           resultData.sort(function (str1, str2) {
                var t = Date.parse(str1[strName]);
                var t2 = Date.parse(str2[strName]);
                if (t && typeof str1[strName] != "number") {
                    if (t < t2) {
                        return 1;
                    } else if (t > t2) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
                //判断中文
                try {
                    if (/^[\u4e00-\u9fa5]+$/i.test(str1[strName].substring(0, 1))) {
                        var n1 = makePy(str1[strName].substring(0, 1));
                        var n2 = makePy(str2[strName].substring(0, 1));
                        if (n1 < n2) {
                            return 1;
                        } else if (n1 > n2) {
                            return -1;
                        } else {
                            return 0;
                        }
                    }
                } catch (e) {
                    // TODO: handle exception
                }
                if (str1[strName] < str2[strName]) {
                    return 1;
                } else if (str1[strName] > str2[strName]) {
                    return -1;
                } else {
                    return 0;
                }
            });
           //邓国知20151027新加
           if(this.datas)this.datas=resultData;
           if(this.param.datas)this.param.datas=resultData;
        },
        sortDown: function (strName) {//从大到小排序
            this.showLoading();
            this.sortDownFn(strName);
            this.datas=this.param.datas;
            this.createHtml(this); //添加html
            this.initEvent(this); //初始化相关事件
            if (this.param.loadPageCp) {
                this.param.loadPageCp(this);
            };
            this.setScroll_x(this);
            this.hideLoading();
        },
        setFootHeight: function (h) {//设置分页控制条高度
            var that = this;
            var rt = $(".RTGrid_Footdiv", this.cDiv);
            var tbd = $(".RTGrid_Bodydiv", this.cDiv);

//            var ld=$(".RTGrid_LoadImgDiv",this.cDiv);
            if (h) {
                rt.css({ height: h });
                tbd.height(function (i, v) {
                    return v - that.tool.pxToInt(rt.height());
                });
            } else {
                rt.css({ height: 30 });
                tbd.css({ "margin-bottom": 60 });
            }
        },
        refreshBody: function (arrTableT) {
            var that = this;
            var arrTable = arrTableT || [];
            arrTable.push('<table class="RTTable-Body" ><thead style="visibility: hidden"><tr>');
            if (that.param.showTrNum) {
                arrTable.push("<td style='width:30px;border-right:1px solid #E8E8E8' >序号</td>");
            }
            if (that.param.hasCheckBox) {
                arrTable.push("<td style='width:31px;border-right:1px solid #E8E8E8;border-left:1px solid rgb(182, 182, 182)' ><input type='radio' class='RTGrid_checkbox' name='depotName' /></td>");
            }
            for (var i = 0; i < that.param.colNames.length; i++) {
//                if(i==0){
//                    arrTable.push("<td style='width:"+(that.param.colModel[i].width)+"px'>");
//                    arrTable.push(that.param.colNames[i]);
//                    arrTable.push("</td>");
//                }else{
//                    arrTable.push("<td>");
//                    arrTable.push(that.param.colNames[i]);
//                    arrTable.push("</td>");
//                }
            	 if(i!=(that.param.colNames.length-1)){
                     arrTable.push("<td style='width:"+(that.param.colModel[i].width==null?(that.param.tableWidth-60)/that.param.colModel.length:that.param.colModel[i].width)+"px'>");
                     arrTable.push("&nbsp;");
                     arrTable.push("</td>");
                 }else{
                     arrTable.push("<td>");
                     arrTable.push("&nbsp;");
                     arrTable.push("</td>");
                 }
            }
            
            arrTable.push('</tr></thead><tbody>');
            var fordata = that.param.url ? that.param.datas : that.datas;
            if (fordata.length != 0) {
                if (fordata) {
                    for (var i = 0; i < fordata.length; i++) {
                        var cd = fordata[i];
                        var flag=false;
                        if(clickDataArr&&cd.recId&&cd.recId==clickDataArr.recId){
                        	flag=true;
                        }
                        if(!flag&&!cd.recId&&clickDataArr.ttypeShortname){
                        	if(clickDataArr.ttypeShortname==cd.ttypeShortname&&clickDataArr.locoNo==cd.locoNo&&clickDataArr.checiName==cd.checiName){
                        		flag=true;
                        	}
                        }
                        var ckbname = "";
                        var cidt = that.param.clickIdItem.split("_");
                        if (cd && cidt.length == 3) {
                            ckbname = cd[cidt[0]] + "_" + cd[cidt[1]] + "_" + cd[cidt[2]];
                        } else if (cidt.length == 1) {
                            ckbname = cd[cidt[0]];
                        }else if(cidt.length == 2){
                        	ckbname = cd[cidt[0]] + "_" + cd[cidt[1]];
                        }
                        if (!that.param.clickTr) {
                        	if(flag){
                        		arrTable.push("<tr class='RTGrid_clickTr'>");
                        	}else{
                        		arrTable.push("<tr>");
                        	}
                        } else {
                            if (that.param.clickTr == ckbname) {

                                arrTable.push("<tr class='RTGrid_clickTr'>");
                            } else {
                                arrTable.push("<tr>");
                            }
                        }

                        if (that.param.showTrNum) {
                            arrTable.push("<td style='width:30px;border-right:1px solid #E8E8E8' >" + (i + (that.pageIndex - 1) * that.pageSize + 1) + "</td>");
                        }
                        if (that.param.hasCheckBox) {
                            if (that.param.checkTrs && that.param.checkTrs.length > 0 && ckbname) {
                            	
                                var tag = false;
                                for (var t = 0; t < that.param.checkTrs.length; t++) {
                                    if (that.param.checkTrs[t] == ckbname) {
                                        arrTable.push("<td style='width:31px;border-right:1px solid #E8E8E8;border-left:1px solid rgb(182, 182, 182)' ><input type='radio' class='RTGrid_checkbox' name='depotName' checked='checked' /></td>");
                                        tag = true;
                                        break;
                                    }
                                }
                                if (!tag) {
                                    arrTable.push("<td style='width:31px;border-right:1px solid #E8E8E8;border-left:1px solid rgb(182, 182, 182)' ><input type='radio' class='RTGrid_checkbox' name='depotName' /></td>");
                                }
                            } else {
                                arrTable.push("<td style='width:31x;border-right:1px solid #E8E8E8;border-left:1px solid rgb(182, 182, 182)' ><input type='radio' class='RTGrid_checkbox' name='depotName' /></td>");
                            }
                        }

                        var tdd = fordata[i];
                        for (var g = 0; g < that.param.colModel.length; g++) {
                            var n = that.param.colModel[g].name;
                            var w = that.param.colModel[g].width || null;
                            var tag = false;
                            if (that.param.replaceTd) {
                                for (var k = 0; k < that.param.replaceTd.length; k++) {
                                    var rt = that.param.replaceTd[k];
                                    if (rt.index == g) {
                                        var tdtarget = null;
                                        if (!w) {
                                        	if(that.param.colModel[g-1]&&that.param.colModel[g-1].width){
                                        		tdtarget= $("<td itemName='" + n + "' >");
                                        	}else{
                                        		tdtarget = $("<td itemName='" + n + "' style='width:"+((that.param.tableWidth-60)/that.param.colModel.length)+"px'></td>");
                                        	}
                                        } else {
                                            tdtarget = $("<td style='width:" + w + "px'  itemName='" + n + "' ></td>");
                                        }
                                        tdtarget[0].innerHTML = rt.fn(fordata[i][n], i, tdtarget, fordata[i], that);
                                        arrTable.push(tdtarget[0].outerHTML);
                                        tag = true;
                                        break;
                                    }
                                }
                            }

                            if (!tag) {
                                if (!w) {
                                    arrTable.push("<td itemName='" + n + "' >");
                                } else {
                                    arrTable.push("<td style='width:" + w + "px'  itemName='" + n + "' >");
                                }
                                
                                
                                arrTable.push(tdd[n]);
                            }
                            arrTable.push("</td>");
                        }
                        arrTable.push("</tr>");
                    }
                }
            }
            else {
                arrTable.push("<tr style='visibility: hidden'>");
                for (var i = 0; i < that.param.colNames.length; i++) {
                    arrTable.push("<td></td>");
                }
                arrTable.push("</tr>");
            }
            arrTable.push('</tbody></table>');
            return arrTable;
        },
        addTable: function () {//返回table的html
            var that = this;
            var arrTable = [];
//            <img class="RTGrid_LoadImg" src="../static/js/RTGrid/img/loading.gif" alt="" />
            arrTable.push('<div class="RTGrid_LoadImgDiv">数据正在更新...</div>');
            if(this.param.isShowRefreshImgControl){
            	arrTable.push('<div class="RTGrid_LoadImgoutDiv"><img class="RTGrid_LoadImg" src="../static/js/RTGrid/img/loading.gif" alt="" /></div>');
            }
            arrTable.push('<div class="RTGrid_Headdiv">');
            
            arrTable.push('<table class="RTTable_Head"><thead><tr>');
            if (this.param.showTrNum) {
                arrTable.push("<td style='width:30px;border-right:1px solid #E8E8E8'>序号</td>");
            }
            if (this.param.hasCheckBox) {
                arrTable.push("<td style='width:31px;border-right:1px solid rgb(182, 182, 182)' ><input type='radio' class='RTGrid_checkbox' name='depotName' /></td>");
            }
            for (var i = 0; i < this.param.colNames.length; i++) {
            	 if(i!=(that.param.colNames.length-1)){
            		 
                     arrTable.push("<td style='width:"+(that.param.colModel[i].width==null?(that.param.tableWidth-60)/that.param.colModel.length:that.param.colModel[i].width)+"px'>");
                     arrTable.push(that.param.colNames[i]);
                     arrTable.push("</td>");
                 }else{
                     arrTable.push("<td>");
                     arrTable.push(that.param.colNames[i]);
                     arrTable.push("</td>");
                 }
            }
            arrTable.push('</tr></thead></table></div>');
            arrTable.push('<div class="RTGrid_Bodydiv">');
            this.refreshBody(arrTable);
            arrTable.push('</div>');
            arrTable.push('<div class="RTGrid_Footdiv"></div>');
            return arrTable.join("");
        },
        controlTdShow: function (name) {//控制那列显示与不显示
            var rs = -1;
            for (var k = 0; k < this.param.colModel.length; k++) {
                if (this.param.colModel[k].name == name) {
                    rs = k;
                    break;
                }
            }
            return rs;
        },
        checkData: function (param) {//检验数据
            if (!param)
                this.tool.tError("请输入参数!");
            if (!param.url) {
                if (!param.datas || typeof param.datas != "object")
                    this.tool.tError("数据格式不正确!");
            }
            if (!param.containDivId)
                this.tool.tError("请填写containDivId!");
            if (!param.colNames)
                this.tool.tError("请填写表格头部名字!");
            return this.tool.cloneParam(param);
        },
        showLoading: function () {//显示加载框
        	$(".RTGrid_LoadImgDiv", this.cDiv).text("数据正在更新...");
            $(".RTGrid_LoadImgDiv", this.cDiv).show();
            if(this.param.isShowRefreshImgControl){
//            	$(".RTGrid_LoadImgoutDiv", this.cDiv).show();
            	RTU.invoke("header.msg.show", "加载中,请稍后!!!");
            }
            if($("#realtime_rt_refreshTime").length>0&&this.param.containDivId=="rt_tab_div_grid"){
            	$("#realtime_rt_refreshTime").text("数据正在更新...");
            }
        },
        hideLoading: function () {//隐藏加载框
        	var that=this;
            setTimeout(function () {
            	$(".RTGrid_LoadImgDiv", this.cDiv).text("数据更新完毕...");
//                $(".RTGrid_LoadImgoutDiv", this.cDiv).hide();
                if(that.param.isShowRefreshImgControl){
            		RTU.invoke("header.msg.hidden");
            	}
            	 if($("#realtime_rt_refreshTime").length>0&&that.param.containDivId=="rt_tab_div_grid"){
                	 var date=new Date();
                     var month=date.getMonth()+1;
                     if(month<10)month="0"+month;
                     var day=date.getDate()<9?"0"+date.getDate():date.getDate();
                     var hours=date.getHours();
                     var minutes=date.getMinutes()<9?"0"+date.getMinutes():date.getMinutes();  
                     var seconds=date.getSeconds()<9?"0"+date.getSeconds():date.getSeconds(); 
                     var str=month+"-"+day+" "+hours+":"+minutes+":"+seconds;
                	
                	
                	$("#realtime_rt_refreshTime").text(str);

                }
            }, 250);
           
        },
        tool: {//工具函数
            compareUp: function (str1, str2) {
                if (str1 < str2) {
                    return -1;
                } else if (str1 > str2) {
                    return 1;
                } else {
                    return 0;
                }
            },
            compareDown: function (str1, str2) {
                if (str1 < str2) {
                    return 1;
                } else if (str1 > str2) {
                    return -1;
                } else {
                    return 0;
                }
            },
            cloneParam: function (param) {
                return $.extend({}, RTGridFn.defaultParam, param);
            },
            tError: function (msg) {
                throw new Error(msg);
            },
            pxToInt: function (str) {
                try {
                    return parseInt(str);
                } catch (e) {
                    return 0;
                }
            },
            initData: function (obj) { //加载数据函数
                var p = $.extend({
                    url: "",
                    type: "get",
                    async: true,
                    cache: true,
                    data: {},
                    dataType: "json",
                    success: null,
                    timeout: 15000,
                    error: null
                }, obj || {});
                $.ajax(p);
            }
        },setFlag:function(value){
        	flagValue=value;
        	return flagValue;
        },getSelectItemData:function(){
        	var that=this;
        	var item = $(".RTTable-Body  tr[class*='RTGrid_clickTr']", that.cDiv);
            var i = item.index();
            return data =that.param.datas[i];
        }
    };
    
    return RTGridFn;

})(jQuery);

