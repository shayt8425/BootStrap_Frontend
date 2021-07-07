RTU.DEFINE(function (require, exports) {
/**
 * 模块名：角色管理
 * name： rolepermissionsmanagement
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");

    var $html;
    var popuwnd;
    var data;
    var cData;
    var cRole = {};
    var mIsSave = false;
    
//    var treeData=[];
    var markData=[];
    
    //加载数据并初始化窗口和事件
    RTU.register("app.rolepermissionsmanagement.loadHtml", function () {
        return function (data) {
            if (data && data.url) {
                RTU.invoke("core.router.load", {
                    url: data.url,
                    success: function (html) {
                    	$html=$(html);
                    	if (popuwnd) {
                            popuwnd.html($html);
                            RTU.invoke("app.rolepermissionsmanagement.query.create", $html);
                        }
                        RTU.invoke("app.rolepermissionsmanagement.input.init");
                        RTU.invoke("app.rolepermissionsmanagement.query.search.init");
                        RTU.invoke("app.rolepermissionsmanagement.query.input.init");
                        RTU.invoke("app.rolepermissionsmanagement.query.data.roles.init");
//                        $html.find(".query_btn").click(function () {
//                            updateParams();
//                            search();
//                        });
                        $html.find(".query_btn").click();
                    }
                });
            }
        };
    });
    
    
    
    
    
    
//    RTU.register("app.rolepermissionsmanagement.query.init", function () {
//        RTU.invoke("core.router.load", {
//            url: "../app/modules/rolepermissionsmanagement/app-rolepermissionsmanagement-query.html",
//            success: function (html) {
//                $html = $(html);
//                if (popuwnd) {
//                    popuwnd.html($html);
//                    RTU.invoke("app.rolepermissionsmanagement.query.create", $html);
//                }
//                RTU.invoke("app.rolepermissionsmanagement.input.init");
//                RTU.invoke("app.rolepermissionsmanagement.query.search.init");
//                RTU.invoke("app.rolepermissionsmanagement.query.input.init");
//                RTU.invoke("app.rolepermissionsmanagement.query.data.roles.init");
////                $html.find(".query_btn").click(function () {
////                    updateParams();
////                    search();
////                });
//                $html.find(".query_btn").click();
//            }
//        });
//        return function () {
//            return true;
//        };
//    });
    RTU.register("app.rolepermissionsmanagement.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            
            
            RTU.invoke("app.rolepermissionsmanagement.loadHtml", { url: "../app/modules/rolepermissionsmanagement/app-rolepermissionsmanagement-query.html", fn: function (html) {
            	
            	 popuwnd = new PopuWnd({
                     title: data.alias,
                     html: html,
                     width: width > 800 ? width : 800,
                     height: height > 600 ? height : 600,
                     left: 135,
                     top: 60,
                     shadow: true
                 });
                 popuwnd.remove = popuwnd.close;
                 popuwnd.close = popuwnd.hidden;
                 popuwnd.init();
                 
            	}, initEvent: function () { //初始化事件
            		
            		
            	}
            });
            
            
//            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: width > 800 ? width : 800,
                    height: height > 600 ? height : 600,
                    left: 135,
                    top: 60,
                    shadow: true
                });
                popuwnd.remove = popuwnd.close;
                popuwnd.close = popuwnd.hidden;
                popuwnd.init();
//            } else {
//                popuwnd.init();
//            }
              setTimeout(function(){
            	  RTU.invoke("app.rolepermissionsmanagement.allocation.loadTreeData");
            	  },50);
        };
    });
    RTU.register("app.rolepermissionsmanagement.query.deactivate", function () {
        return function () {
            if (popuwnd) {
            	 popuwnd.close();
                 popuwnd = null;
            }
        };
    });
    RTU.register("app.rolepermissionsmanagement.query.init", function () {
        data = RTU.invoke("app.setting.data", "rolepermissionsmanagement");
        if (data && data.isActive) {
            RTU.invoke("app.rolepermissionsmanagement.query.activate");
        }
        return function () {
            return true;
        };
    });
    RTU.register("app.rolepermissionsmanagement.input.show", function () {
        return function (show) {
            if (show) {
                $html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-up");
                $html.find(".content-input").attr("class", "content-body content-input");
                $html.find(".content-input-allocation").attr("class", "content-body content-input-allocation hidden");
            } else {
                $html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-down");
                $html.find(".content-input").attr("class", "content-body hidden content-input");
            }
        };
    });
    
    RTU.register("app.rolepermissionsmanagement.query.data.roles.init", function () {
        var equals = function (p1, p2) {
            if (p1 && p2 && p1.id == p2.id) {
                return true;
            }
            return false;
        };
        var checkValue = function (p1, p2) {
            for (var i = 0; p2 && p2.length && i < p2.length; i++) {
                if (equals(p1, p2[i])) {
                    return p2[i];
                }
            }
            return null;
        };
        var BItem = function (pData) {
            this.data = pData;
            this.$item = $("<label><input type='checkbox'>" + this.data.alias + " </label>");
            this.selected = false;
            this.select = function (selected) {
                if (selected) {
                    this.$item.find("input").attr("checked", "checked");
                    this.selected = true;
                } else {
                    this.$item.find("input").removeAttr("checked");
                    this.selected = false;
                }
            };
            this.initSelect = function () {
                this.$item.find("input").change($.proxy(function () {
                    this.selected = this.$item.find("input").attr("checked") ? true : false;
                }, this));
            };
            this.valueOf = function () {
                return "{\"id\":\"" + this.data.id + "\"}";
            };
            this.init = function () {
                this.initSelect();
                return this.$item;
            };
        };
        var FItem = function (pData) {
            this.data = pData;
            this.$item = $("<div><label><input class='f-select' type='checkbox'>" + this.data.alias + "</label><div class='content-row-content hidden'>&nbsp;&nbsp;</div></div>");
            this.selected = false;
            this.items = [];
            this.select = function (selected) {
                if (selected) {
                    this.$item.find("input").attr("checked", "checked");
                    this.selected = true;
                    this.selectModules(true);
                    this.$item.find(".content-row-content").attr("class", "content-row-content");
                } else {
                    this.$item.find("input").removeAttr("checked");
                    this.selected = false;
                    this.selectModules(false);
                    this.$item.find(".content-row-content").attr("class", "content-row-content hidden");
                }
            };
            this.selectModules = function (selected) {
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].select(selected);
                }
            };
            this.initSelect = function () {
                this.$item.find(".f-select").change($.proxy(function () {
                    this.select(this.$item.find(".f-select").attr("checked") ? true : false);
                }, this));
            };
            this.initItems = function () {
                for (var i = 0; this.data.module && i < this.data.module.length; i++) {
                    var item = new BItem(this.data.module[i]);
                    this.items.push(item);
                    this.$item.find(".content-row-content").append(item.init());
                }
            };
            this.valueOf = function () {
                if (this.selected) {
                    var value = "{\"id\":\"" + this.data.id + "\",\"module\":[";
                    var isFirst = true;
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].selected) {
                            if (!isFirst) {
                                value += ",";
                            } else {
                                isFirst = false;
                            }
                            value += this.items[i];
                        }
                    }
                    value += "]}";
                    return value;
                } else {
                    return null;
                }
            };
            this.setValue = function (pData) {
                for (var i = 0; i < this.items.length; i++) {
                    var mData = checkValue(this.items[i].data, pData);
                    if (mData) {
                        this.items[i].select(true);
                    } else {
                        this.items[i].select(false);
                    }
                }
            };
            this.init = function () {
                this.initSelect();
                this.initItems();
                return this.$item;
            };
        };
        var MItem = function (pData) {
            this.data = pData;
            this.$item = $("<div><div class='font-12-5'><label><input class='m-select' type='checkbox' value='" + pData.id + "'>" + pData.alias + "</label></div></div>");
            this.selected = false;
            this.items = [];
            this.select = function (selected) {
                if (selected) {
                    this.$item.find("input").attr("checked", "checked");
                    this.selected = true;
                    this.selectModules(true);
                    this.$item.find(".content-row-line").attr("class", "content-row-line font-12-6");
                } else {
                    this.$item.find("input").removeAttr("checked");
                    this.selected = false;
                    this.selectModules(false);
                    this.$item.find(".content-row-line").attr("class", "content-row-line font-12-6 hidden");
                }
            };
            this.selectModules = function (selected) {
                for (var i = 0; i < this.items.length; i++) {
                    this.items[i].select(selected);
                }
            };
            this.initSelect = function () {
                this.$item.find(".m-select").change($.proxy(function () {
                    this.select(this.$item.find(".m-select").attr("checked") ? true : false);
                }, this));
            };
            this.initItems = function () {
                if (this.data.module && this.data.module.length && this.data.module.length > 0) {
                    this.$item.append("<div class='content-row-line font-12-6 hidden'></div>");
                    for (var i = 0; this.data.module && i < this.data.module.length; i++) {
                        var item = new FItem(this.data.module[i]);
                        this.items.push(item);
                        this.$item.find(".content-row-line").append(item.init());
                    }
                }
            };
            this.valueOf = function () {
                if (this.selected) {
                    var value = "{\"id\":\"" + this.data.id + "\",\"module\":[";
                    var isFirst = true;
                    for (var i = 0; i < this.items.length; i++) {
                        if (this.items[i].selected) {
                            if (!isFirst) {
                                value += ",";
                            } else {
                                isFirst = false;
                            }
                            value += this.items[i];
                        }
                    }
                    value += "]}";
                    return value;
                } else {
                    return null;
                }
            };
            this.setValue = function (pData) {
                for (var i = 0; i < this.items.length; i++) {
                    var mData = checkValue(this.items[i].data, pData);
                    if (mData) {
                        this.items[i].select(true);
                        this.items[i].setValue(mData.module);
                    } else {
                        this.items[i].select(false);
                    }
                }
            };
            this.init = function () {
                this.initSelect();
                this.initItems();
                return this.$item;
            };
        };
        var RoleSetting = function (pData) {
            this.data = pData;
            this.items = [];
            this.userIndex = -1; 	//用户设置索引
            this.initRole = function () {
                if (this.data.data && this.data.data.length && this.data.data.length > 0)
                    for (var i = 0; i < this.data.data.length; i++) {
                        var item = new MItem(this.data.data[i]);
                        //记录用户设置索引
                        if (this.data.data[i].id == "IA") {
                            this.userIndex = i;
                        }
                        this.items.push(item);
                        $html.find(".content-row-container").append(item.init());
                    }
            };
            this.valueOf = function () {
                var value = "[";
                var isFirst = true;
                for (var i = 0; i < this.items.length; i++) {
                    if (this.items[i].selected) {
                        if (!isFirst) {
                            value += ",";
                        } else {
                            isFirst = false;
                        }
                        value += this.items[i];
                    }
                }
                value += "]";
                return value;
            };
            this.setValue = function (pData) {
                for (var i = 0; i < this.items.length; i++) {
                    var mData = checkValue(this.items[i].data, pData);
                    if (mData) {
                        this.items[i].select(true);
                        this.items[i].setValue(mData.module);
                    } else {
                        this.items[i].select(false);
                    }
                }
            };
            this.init = function () {
                this.initRole();
                //默认选中用户设置
                this.items[this.userIndex].select(true);
            };
            this.init();
        };
        return function () {
            RTU.invoke("core.router.load", {
                url: "../static/data/roles.json",
                dataType: "json",
                success: function (pData) {
                    cRole = new RoleSetting(pData);
                }
            });
        };
    });
    RTU.register("app.rolepermissionsmanagement.input.init", function () {
        var isShow = false;
        return function () {
            $html.find(".content-dropdown-btn").click(function () {
                if (isShow) {
                    RTU.invoke("app.rolepermissionsmanagement.input.show", false);
                    isShow = false;
                } else {
                    RTU.invoke("app.rolepermissionsmanagement.input.show", true);
                    isShow = true;
                }
            });
        };
    });
    RTU.register("app.rolepermissionsmanagement.query.input.init", function () {
        var initSave = function () {
            $html.find(".input-save-btn").click($.proxy(function () {
                var mData = checkData(getInput(cData));
                if (!mIsSave) {
                    if (checkSaveInput(mData)) {
                        save(mData);
                    }
                } else {
                    if (checkUpdateInput(mData)) {
                        update(mData);
                    }
                }
            }, this));
        };
        var initReset = function () {
            $html.find(".input-reset-btn").click($.proxy(function () {
                RTU.invoke("app.rolepermissionsmanagement.query.input.modify", {});
                RTU.invoke("app.rolepermissionsmanagement.query.input.change", false);
            }, this));
        };
        var initPasswordInput = function () {
            $html.find(".input_plainPassword").focusout($.proxy(function () {
                if (mIsSave && RTU.utils.string.isBank($html.find(".input_plainPassword").val())) {
                    $html.find(".input_plainPassword").val("********");
                }
            }, this));
            $html.find(".input_plainPassword").mouseup($.proxy(function () {
                if (mIsSave && $html.find(".input_plainPassword").val() == "********") {
                    $html.find(".input_plainPassword").val("");
                }
            }, this));
        };
        var getInput = function (pData) {
            var mData = pData ? pData : {};
            pData = {};
            pData.id = mData.id;
            pData.name = $html.find(".input_name").val();
            pData.remark = $html.find(".input_remark").val();
            return pData;
        };
        var checkData = function (pData) {
            pData = pData ? pData : {};
            for (var name in pData) {
                if (!pData[name]) {
                    delete pData[name];
                }
            }
            return pData;
        };
        var checkSaveInput = function (pData) {
            if (RTU.utils.string.isBank(pData.name)) {
                RTU.invoke("header.notice.show", "角色名不能为空!");
                RTU.utils.input.focusin($html.find(".input_name"));
                return false;
            } else {
                RTU.utils.input.focusout($html.find(".input_name"));
            }
            return true;
        };
        var checkUpdateInput = function (pData) {
            if (RTU.utils.string.isBank(pData.name)) {
                RTU.invoke("header.notice.show", "角色名不能为空!");
                RTU.utils.input.focusin($html.find(".input_name"));
                return false;
            } else {
                RTU.utils.input.focusout($html.find(".input_name"));
            }
            return true;
        };
        var save = function (pData) {
            RTU.invoke("core.router.get", {
                url: "rolepermissionsmanagement/save?roles=" + cRole,
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "角色 '" + pData.name + "' 添加成功!");
                        $html.find(".query_btn").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function () {
                    RTU.invoke("header.notice.show", "角色 '" + pData.name + "' 添加失败!");
                }
            });
        };
        var update = function (pData) {
            RTU.invoke("core.router.get", {
                url: "rolepermissionsmanagement/update?roles=" + cRole,
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "角色 '" + pData.name + "' 保存成功!");
                        $html.find(".query_btn").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function () {
                    RTU.invoke("header.notice.show", "角色 '" + pData.name + "' 保存失败!");
                }
            });
        };
        return function () {
            initSave();
            initReset();
            initPasswordInput();
        };
    });
    RTU.register("app.rolepermissionsmanagement.query.input.modify", function () {
        var setInput = function (pData) {
            pData = pData ? pData : {};
            $html.find(".content-input").find(".input_name").val(pData.name || "");
            $html.find(".content-input").find(".input_remark").val(pData.remark || "");
            cRole.setValue(pData.roles ? eval(pData.roles) : []);
            RTU.utils.input.focusout($html.find(".input_name"));
        };
        return function (pData) {
            cData = pData;
            setInput(pData);
        };
    });
    RTU.register("app.rolepermissionsmanagement.query.input.change", function () {
        var changeSaveBtn = function (isSave) {
            mIsSave = isSave;
            if (isSave) {
                $html.find(".input-save-btn").html("保存");
            } else {
                $html.find(".input-save-btn").html("添加");
            }
        };
        return function (isSave) {
            changeSaveBtn(isSave);
        };
    });    
    RTU.register("app.rolepermissionsmanagement.query.search.init", function () {

        var param;
        var pageBtn;
        var data;
        
        var updateParams = function () {
            param = {};
            param.name = $html.find(".query_name").val();
            param.pageIndex = 1;
            param.pageSize = 10;
        };
        var resetParams = function () {
            $html.find(".query_name").val("");
        };
        var parseParams = function () {
            if (param.name == "") {
                delete param.name;
            }
            return param;
        };
        var search = function () {
        	
        	var vargs=parseParams();
            RTU.invoke("core.router.get", {
            	url: "rolepermissionsmanagement/search?name="+(vargs.name==undefined?'':vargs.name)+"&pageIndex="+vargs.pageIndex+"&pageSize="+vargs.pageSize,
                success: $.proxy(function (_data) {
                    data = _data;
                    pageBtn.setPage(data.pageIndex, data.totalPage);
                    doResult();
                }, this)
            });
        };
        var doResult = function () {
            buildItems(data.data);
        };
        var buildItems = function (datas) {
            $html.find(".content-table").find("tbody").html("");
            for (var i = 0; i < datas.length; i++) {
                datas[i].index = i;
                var item = new Item(datas[i]);
                item.onRemove = $.proxy(function (_data) {
                    datas.splice(_data.index, 1);
                    refesh();
                    checkSelect();
                }, this);
                $html.find(".content-table").find("tbody").append(item.$item);
            }
        };
        var refesh = function () {
            for (var i = 0; i < data.data.length; i++) {
                if (data.data[i].item) {
                    data.data[i].item.refeshIndex(i);
                }
            }
        };
        var initPageButton = function () {
            pageBtn.onPage = function (page) {
                param.pageIndex = page;
                search();
            }
        };
        var selectAll = function (isSelect) {
            if (data && data.data) {
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].item) {
                        data.data[i].item.select(isSelect);
                    }
                }
            }
        };
        var deleteSelected = function () {
            if (data && data.data) {
                var ids = "";
                var isFirst = true;
                for (var i = 0; i < data.data.length; i++) {
                    if (data.data[i].selected) {
                        if (!isFirst) {
                            ids = ids + ","

                        }
                        isFirst = false;
                        ids = ids + data.data[i].id;

                        data.data[i].item.remove();
                        i--;
                    }
                }

                doDelete(ids);
            }
        };
        var doDelete = function (ids) {
            RTU.invoke("core.router.get", {
                url: "rolepermissionsmanagement/delete?ids=" + ids,
                success: $.proxy(function (pData) {
                    if (pData.success) {
                        RTU.invoke("header.notice.show", "删除成功！");
                    } else {
                        RTU.invoke("header.notice.show", pData.msg);
                    }
                }, this),
                error: function () {
                    RTU.invoke("header.notice.show", "删除失败！");
                }
            });
        };
        var checkSelect = function () {
            if (data && data.data && data.data.length == 0) {
                doSelected(false);
            }
        };
        var doSelected = function (isSelect) {
            if (isSelect) {
                $html.find(".select-all-btn").attr("checked", "checked");
            } else {
                $html.find(".select-all-btn").removeAttr("checked");
            }

        };
        var Item = function (data) {
            this.data = data;
            this.$item = $("<tr>" + $html.find(".content-result-template").html() + "</tr>");
            this.init = function () {
                this.initData();
                this.initDelete();
                this.initSelect();
                this.initModify();
                this.initAllocation();
            };
            this.initData = function () {
                this.refeshIndex(this.data.index);
                this.data.item = this;
                for (var name in this.data) {
                    this.$item.find(".result-" + name).html(data[name]);
                }
            };
            this.initDelete = function () {
                this.$item.find(".result-delete-btn").click($.proxy(function () {
                    doDelete(this.data.id);
                    this.remove();
                }, this));
            };
            this.initModify = function () {
                this.$item.find(".result-modify-btn").click($.proxy(function () {
                    RTU.invoke("app.rolepermissionsmanagement.query.input.modify", this.data);
                    RTU.invoke("app.rolepermissionsmanagement.query.input.change", true);
                    RTU.invoke("app.rolepermissionsmanagement.input.show", true);
                }, this));
            };
            this.initAllocation = function () {
            	this.$item.find(".result-allocation-btn").click($.proxy(function () {
        			RTU.invoke("app.rolepermissionsmanagement.allocation.show.init", true);
        			$(".allocation-cancel-all-ck").trigger("click");
        			RTU.invoke("app.rolepermissionsmanagement.allocation.checked", this.data);
            		RTU.invoke("app.rolepermissionsmanagement.allocation.head", this.data);
            	}, this));
            };
            this.initSelect = function () {
                this.$item.find(".result-select").change($.proxy(function () {
                    this.data.selected = this.$item.find(".result-select").attr("checked") ? true : false;
                }, this));
                this.$item.find(".result-select").mouseup($.proxy(function () {
                    doSelected(false);
                }, this));
            };
            this.refeshIndex = function (index) {
                this.data.index = index;
                this.$item.attr("class", "row-" + (this.data.index % 2));
            };
            this.remove = function () {
                this.$item.remove();
                this.onRemove(this.data);
                this.data.selected = false;
                this.data.item = null;
                this.data = null;
            };
            this.onRemove = function (data) {

            };
            this.select = function (isSelect) {
                if (isSelect) {
                    this.$item.find(".result-select").attr("checked", "checked");
                    this.data.selected = true;
                } else {
                    this.$item.find(".result-select").removeAttr("checked");
                    this.data.selected = false;
                }
            };
            this.init();
        };

        return function () {
            $html.find(".query_btn").click(function () {
                updateParams();
                search();
            });
            $html.find(".select-all-btn").click(function () {
                selectAll($html.find(".select-all-btn").attr("checked") ? true : false);
            });
            $html.find(".delete-btn").click(function () {
                deleteSelected();
            });
            $html.find(".reset_btn").click(function () {
                resetParams();
            });
            pageBtn = new PageButton({
                $html: $html.find(".x-pagebutton")
            });
            initPageButton();
        };
    });
    //加载列表树的数据
    RTU.register("app.rolepermissionsmanagement.allocation.loadTreeData",function(){
    	return function(){
    		var url="onlineloco/getTreeListAll";
    		var param = {
    				url: url,
    				asnyc: true,
    				datatype: "json",
    				success: function (data) {
//    					RTU.invoke("app.rolepermissionsmanagement.allocation.show.init", true);
    					RTU.invoke("app.rolepermissionsmanagement.allocation.show", data.data);
    					$("#locoregStateSel").unbind("change").bind("change",function(){
    						var selVal=$(this).val();
    						var bid=$(".bureauSelectAllocation").attr("bid");
    						if(bid==undefined||bid=="0"){
    							$(".allocation-children-ck[isReg]").parent().parent().show();
    						    if(selVal==""){
    						    	
    						    }
    							else{
    								$(".allocation-children-ck[isReg!="+selVal+"]").attr("checked",false).parent().parent().hide();
    							}
    							
    						}
    						else{
    							var did=$(".depotSelectAllocation").attr("did");
    							if(did==undefined||did=="0"){
    								$(".allocation-children-ck[isReg][bid='"+bid+"']").parent().parent().show();
    								if(selVal==""){
    									
    								}
    								else{
    									$(".allocation-children-ck[isReg!="+selVal+"][bid='"+bid+"']").attr("checked",false).parent().parent().hide();
    								}
    								
    							}
    							else{
    								$(".allocation-children-ck[isReg][did='"+did+"']").parent().parent().show();
    								if(selVal==""){
    									
    								}
    								else{
    									$(".allocation-children-ck[isReg!="+selVal+"][did='"+did+"']").attr("checked",false).parent().parent().hide();
    								}
    								
    							}
    						}
    					});
    					
    					$("#locoSelectAllocation").unbind("click").bind("click",function(){
    						var bid=$(".bureauSelectAllocation").attr("bid");
    						if(bid==undefined||bid=="0"){
    							if(!$(this).attr("checked")){
        							//读取所有在线表机车
        							$(".allocation-children-ck[isReg='0']").parent().parent().show();
        						}
        						else{
        							//只读取已注册机车
        							$(".allocation-children-ck[isReg='0']").attr("checked",false).parent().parent().hide();
        						}
    						}
    						else{
    							var did=$(".depotSelectAllocation").attr("did");
    							if(did==undefined||did=="0"){
    								if(!$(this).attr("checked")){
            							//读取所有在线表机车
            							$(".allocation-children-ck[isReg='0'][bid='"+bid+"']").parent().parent().show();
            						}
            						else{
            							//只读取已注册机车
            							$(".allocation-children-ck[isReg='0'][bid='"+bid+"']").attr("checked",false).parent().parent().hide();
            						}
    							}
    							else{
    								if(!$(this).attr("checked")){
            							//读取所有在线表机车
            							$(".allocation-children-ck[isReg='0'][did='"+did+"']").parent().parent().show();
            						}
            						else{
            							//只读取已注册机车
            							$(".allocation-children-ck[isReg='0'][did='"+did+"']").attr("checked",false).parent().parent().hide();
            						}
    							}
    						}
    						
    					});
    					$(".allocation-span-click").unbind("click").bind("click",function (event) {
    						$(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1 ? $(".img-btn", $(this)).attr("src", "../static/img/app/zhankai.png") :
    							$(".img-btn", $(this)).attr("src", "../static/img/app/shousuo.png");
    						if ($(".img-btn", $(this)).attr("src").indexOf("shousuo") != -1) {
    							$(this).parent().parent().siblings().addClass("hidden");
    						}
    						else {
    							$(this).parent().parent().siblings().removeClass("hidden");
    						}
    						event.preventDefault();
    					});
    					$(".allocation-father-ck",$("#allocation-main-divL")).bind("click",$.proxy(function (e,data) {
    						var that=$(e.currentTarget);
    						if(data){
    							if(data==1){
    								//选中
    								$(".allocation-children-ck", that.parent().parent().siblings()).each(function(i,item){
    									if($(item).parent().parent().css("display")!="none"){
        									$(item).attr("checked", "checked");
        									var locotypeid = $(this).attr("locotypeid");
        									var locotypename = $(this).attr("locotypename");
        									var locono = $(this).attr("locono");
        									var locoAb = $(this).attr("locoAb");
        									var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
        									var k=locotypename+"-"+noandab;
        									markData=markData||[];
        									if(!markData[k]){
        										markData[k]="[\""+locotypeid+"\",\""+locotypename+"\",\""+locono+"\",\""+locoAb+"\"]";
        									}
        									$("#"+k+"-right").parent().parent().parent().parent().removeClass("hidden");
        									$("#"+k+"-right").parent().parent().removeClass("hidden");
    									}

    								});
    							}else if(data==2){
    								//取消
    								$(".allocation-children-ck", that.parent().parent().siblings()).each(function(i,item){
    									if($(item).parent().parent().css("display")!="none"){
        									$(item).removeAttr("checked");
        									var locotypeid = $(this).attr("locotypeid");
        									var locotypename = $(this).attr("locotypename");
        									var locono = $(this).attr("locono");
        									var locoAb = $(this).attr("locoAb");
        									var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
        									var k=locotypename+"-"+noandab;
        									markData=markData||[];
        									if(markData[k]){
        										delete markData[k];
        									}
        									$("#"+k+"-right").parent().parent().addClass("hidden");
        									$("#"+k+"-right").parent().parent().parent().parent().addClass("hidden");
    									}

    								});
    							}
    						}else{
    							if(that.attr("checked")){
    								$(".allocation-children-ck", that.parent().parent().siblings()).each(function(i,item){
    									$(item).attr("checked", "checked");
    									var locotypeid = $(this).attr("locotypeid");
    									var locotypename = $(this).attr("locotypename");
    									var locono = $(this).attr("locono");
    									var locoAb = $(this).attr("locoAb");
    									var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
    									var k=locotypename+"-"+noandab;
    									markData=markData||[];
    									if(!markData[k]){
    										markData[k]="[\""+locotypeid+"\",\""+locotypename+"\",\""+locono+"\",\""+locoAb+"\"]";
    									}
    									$("#"+k+"-right").parent().parent().parent().parent().removeClass("hidden");
    									$("#"+k+"-right").parent().parent().removeClass("hidden");
    								});
    							}else{
    								$(".allocation-children-ck", that.parent().parent().siblings()).each(function(i,item){
    									$(item).removeAttr("checked");
    									var locotypeid = $(this).attr("locotypeid");
    									var locotypename = $(this).attr("locotypename");
    									var locono = $(this).attr("locono");
    									var locoAb = $(this).attr("locoAb");
    									var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
    									var k=locotypename+"-"+noandab;
    									markData=markData||[];
    									if(markData[k]){
    										delete markData[k];
    									}
    									$("#"+k+"-right").parent().parent().addClass("hidden");
    									$("#"+k+"-right").parent().parent().parent().parent().addClass("hidden");
    								});
    							}
    						}
    					},this));
    					$(".allocation-children-ck",$("#allocation-main-divL")).bind("click",function () {
    						var locotypeid = $(this).attr("locotypeid");
    						var locotypename = $(this).attr("locotypename");
    						var locono = $(this).attr("locono");
    						var locoAb = $(this).attr("locoAb");
    						var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
    						var k=locotypename+"-"+noandab;
    						if ($(this).attr("checked")) {
    							$(this).attr("checked","checked");
    							if($(this).parent().parent().parent().parent().find(".allocation-children-ck[checked='checked']").length==
    								$(this).parent().parent().parent().parent().find(".allocation-children-ck").length){
    								$(this).parent().parent().parent().parent().find(".allocation-father-ck").attr("checked","checked");
    							}
    							$("#"+k+"-right").parent().parent().removeClass("hidden");
    							$("#"+k+"-right").parent().parent().parent().parent().removeClass("hidden");
    							$("#"+k+"-right").parent().parent().parent().parent().parent().removeClass("hidden");
    							markData=markData||[];
    							if(!markData[k]){
    								markData[k]="[\""+locotypeid+"\",\""+locotypename+"\",\""+locono+"\",\""+locoAb+"\"]";
    							}
    						}else{
    							$(this).removeAttr("checked");
    							$(this).parent().parent().parent().parent().find(".allocation-father-ck").removeAttr("checked");
    							var len1=$("#"+k+"-right").parent().parent().parent().parent().find(".allocation-children-div").find("div.hidden").length;
    							var len2=$("#"+k+"-right").parent().parent().parent().parent().find(".allocation-children-div").find("div").length/2-1;
    							if(len1==len2){
//                        		$("#"+k+"-right").parent().parent().find(".allocation-father-ck").addClass("hidden");
    								$("#"+k+"-right").parent().parent().parent().parent().addClass("hidden");
    							} 
    							$("#"+k+"-right").parent().parent().addClass("hidden");
    							if(markData[k]){
    								delete markData[k];
    							}
    						}
    					});
    					$(".allocation-all-ck",$("#allocation-main-divL")).unbind("click").click(function () {
    						if($(this).attr("checked")){
    							$(".allocation-father-ck,.allocation-children-ck").attr("checked", "checked");
    						}else{
    							$(".allocation-father-ck,.allocation-children-ck").removeAttr("checked");
    							$("#allocation-main-divR").find(".allocation-body-tr").html("");
    						}
    					});
    					$(".alllocation-delete-img-parent").bind("click",function(){
    						$(this).parent().parent().parent().parent().find(".allocation-children-div").each(function(i,$item){
    							$(".alllocation-delete-img",$item).trigger("click");
    						});
    						$(this).parent().parent().parent().parent().addClass("hidden");
    					});
    					$(".alllocation-delete-img").bind("click",function(){
    						var that=$(this).parent().find(".allocation-children-ck");
    						var locotypeid = that.attr("locotypeid");
    						var locotypename = that.attr("locotypename");
    						var locono = that.attr("locono");
    						var locoAb = that.attr("locoAb");
    						var noandab = locono+RTU.invoke("app.locoAb.getChar",locoAb);
    						var k=locotypename+"-"+noandab;
    						if(markData[k]){
    							delete markData[k];
    						}
    						var len1=$(this).parent().parent().parent().parent().find(".allocation-children-div").find("div.hidden").length;
    						var len2=$(this).parent().parent().parent().parent().find(".allocation-children-div").find("div").length;
    						if(len1==len2/2-1){
    							$(this).parent().parent().parent().parent().addClass("hidden");
    						}
    						$(this).parent().parent().addClass("hidden");
    						$("#"+k+"-left").parent().parent().parent().parent().find(".allocation-father-div .allocation-father-ck").removeAttr("checked");
    						$("#"+k+"-left").removeAttr("checked");
    					});
    					$(".allocation-delete-all-ck").bind("click",function(){
    						$(".allocation-father-div",$("#allocation-main-divR")).each(function(i,$item){
    							$(".alllocation-delete-img-parent",$item).trigger("click");
    						});
    						markData=[];
    					});
    					$(".allocation-select-all-ck",$("#allocation-main-divL")).bind("click",function(){
//            			$(".allocation-father-div",$("#allocation-main-divL")).each(function(i,$item){
    						$(".allocation-father-div",$("#allocation-main-divL").find(".allocation-body-tr").find("div:not(.hidden)")).each(function(i,$item){
    							$(".allocation-father-ck",$item).removeAttr("checked");
    							$(".allocation-father-ck",$item).trigger("click",[1]);
    						});
    					});
    					$(".allocation-cancel-all-ck",$("#allocation-main-divL")).bind("click",function(){
//            			$(".allocation-father-div",$("#allocation-main-divL")).each(function(i,$item){
    						$(".allocation-father-div",$("#allocation-main-divL").find(".allocation-body-tr").find("div:not(.hidden)")).each(function(i,$item){
    							$(".allocation-father-ck",$item).attr("checked","checked");
    							$(".allocation-father-ck",$item).trigger("click",[2]);
    						});
    						$(".allocation-delete-all-ck").click();
    					});
    					$(".allocation-save-all-ck").click(function(){
    						var strJson="[";
    						var isF=true;
    						for(d in markData){
    							if(!isF){
    								strJson+=",";
    							}else{
    								isF=false;
    							}
    							strJson+=markData[d];
    						}
    						strJson+="]";
    						RTU.invoke("app.rolepermissionsmanagement.allocation.saveLocos",{"id":$("#input-name-allocation-role").attr("roleid"),"locos":strJson});
    						
    					});
    					$(".input-dingwei-btn").unbind("click").click(function () {
    						$(".allocation-children-div-data",$("#allocation-main-divL")).css("color","");
    						var v1=$("#allocation-locoName").val().trim();
    						if(v1){
    							$(".img-btn[src='../static/img/app/zhankai.png']",$("#allocation-main-divL")).each(function(i,item){
    								$(item).parent().click();
    							});            				
    							v1=v1.toUpperCase();
    							if(v1.indexOf("-")>0){
    								$("#"+v1+"-left").parent().parent().parent().parent().find(".allocation-span-click").click();
    								$("#"+v1+"-left").parent().css("color","red");
    							}else if(v1.substring(0,v1.length-1)=="A"||v1.substring(0,v1.length-1)=="B"){
    								$(".loconoab-"+v1,$("#allocation-main-divL")).each(function(i,item){
    									$(item).parent().parent().parent().parent().find(".allocation-span-click").click();
    									$(item).parent().css("color","red");
    								});
    							}else{
    								$(".loconoab-"+v1,$("#allocation-main-divL")).each(function(i,item){
    									$(item).parent().parent().parent().parent().find(".allocation-span-click").click();
    									$(item).parent().css("color","red");
    								});
    								$(".loconoab-"+v1+"A",$("#allocation-main-divL")).each(function(i,item){
    									$(item).parent().parent().parent().parent().find(".allocation-span-click").click();
    									$(item).parent().css("color","red");
    								});
    								$(".loconoab-"+v1+"B",$("#allocation-main-divL")).each(function(i,item){
    									$(item).parent().parent().parent().parent().find(".allocation-span-click").click();
    									$(item).parent().css("color","red");
    								});
    							}
    						}else{
    							$("#allocation-main-divL").find(".allocation-father-div").parent().addClass("hidden");
    							var v2=$(".depotSelectAllocation option:selected").attr("did");
    							if(v2){
    								$("#allocation-main-divL").find(".allocation_did_"+v2).parent().parent().parent().removeClass("hidden");
    							}else{
    								var v3=$(".bureauSelectAllocation option:selected").attr("bid");
    								if(v3){
    									if(v3=="00"){
    										$("#allocation-main-divL").find(".allocation-father-div").parent().removeClass("hidden");
    									}else{
    										$("#allocation-main-divL").find(".allocation_bid_"+v3).parent().parent().parent().removeClass("hidden");
    									}
    								}else{
    									$("#allocation-main-divL").find(".allocation-father-div").parent().removeClass("hidden");
    								}
    							}
    						}
    					});
    					$(".allocation-cancel-all-ck").trigger("click");
    				},
    				error: function () {
    					//RTU.invoke("app.query.loading", { object: $(".content-input-allocation"), isShow: false });
    				}
    		};
    		RTU.invoke("core.router.get", param);
    	};
    });
    RTU.register("app.rolepermissionsmanagement.allocation.show", function () {
    	////组装树形子节点
        var childrenItem = function (locoTypeid, locoTypeName, data) {
            this.$itemL = $("<div>" + $("#allocation-children-itemLDiv-data").html() + "</div>");
            this.$itemR = $("<div class='hidden'>" + $("#allocation-children-itemLDiv-data-R").html() + "</div>");
            
            var locoNoAndAB=data[0]+RTU.invoke("app.locoAb.getChar",data[1]);
           	var k=locoTypeName+"-"+locoNoAndAB;
            this.$itemL.find(".allocation-locoNo").html(locoNoAndAB);
            this.$itemR.find(".allocation-locoNo").html(locoNoAndAB);
            this.$itemL.find(".allocation-children-ck").attr({ "id": k+"-left"
	            , "locotypeid": locoTypeid
	            , "locotypename": locoTypeName
	            , "locono": data[0]
	            , "locoAb": data[1]
	            , "isReg" : data[7]
            	, "did"   : data[9]
            	, "bid"   : data[8]
            	, "name":"allocation-children-ck-name"
            });
            this.$itemL.find(".allocation-children-ck").removeAttr("checked").addClass("loconoab-"+locoNoAndAB);
            this.$itemR.find(".allocation-children-ck").attr({ "id": k+"-right"
	            , "locotypeid": locoTypeid
	            , "locotypename": locoTypeName
	            , "locono": data[0]
	            , "locoAb": data[1]
            	, "isReg" : data[7]
	        	, "did"   : data[9]
	        	, "bid"   : data[8]
	            , "name":"allocation-children-ck-name"
            });            
            return this;
        };
        ////组装树形行父节点
        var fatherItem = function (data) {
            this.$itemL = $("<div locoTypename='"+data.locoTypeName+"'>" + $("#allocation-parent-itemLDiv").html() + "</div>");
            this.$itemR = $("<div>" + $("#allocation-parent-itemLDiv-R").html() + "</div>");
            this.$itemL.find(".allocation-father-ck").removeAttr("checked");
            this.$itemL.find(".allocation-father-ck").addClass("allocation_bid_"+data.bId+" allocation_did_"+data.dId);
            this.$itemL.find(".locoTypeName").html(data.locoTypeName);
            this.$itemR.find(".locoTypeName").html(data.locoTypeName);
            return this;
        };
        ////组装数据列表行
        var buildItemTr = function (data) {
            this.$itemL = $("<div>" + $("#allocation-body-tr-template").html() + "</div>");
            this.$itemR = $("<div>" + $("#allocation-body-tr-template-R").html() + "</div>");
            var f=new fatherItem(data);
            this.$itemL.find(".allocation-father-div").append(f.$itemL);
            this.$itemR.find(".allocation-father-div").append(f.$itemR);
            for (var i = 0; i < data.list.length; i++) {
            	var c=new childrenItem(data.locoTypeid, data.locoTypeName, data.list[i]);
                this.$itemL.find(".allocation-children-div").append(c.$itemL);
                this.$itemR.find(".allocation-children-div").append(c.$itemR);
            }
            return this;
        };
        ///////组装数据列表HTML，加载树对象
        var buildTreeHtml = function (data) {
        	$("#allocation-main-divL .allocation-body-tr").html("");
        	$("#allocation-main-divR .allocation-body-tr").html("");
            for (var i = 0; i < data.length; i++) {
            	var tt=new buildItemTr(data[i]);
                $("#allocation-main-divL .allocation-body-tr").append(tt.$itemL);
                $("#allocation-main-divR .allocation-body-tr").append(tt.$itemR);
            }
        };
        return function(data){
        	buildTreeHtml(data);
        };
    });
    RTU.register("app.rolepermissionsmanagement.allocation.show.init", function () {    	
    	return function (show) {
    		if (show) {
    			$html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-up");
    			$html.find(".content-input-allocation").attr("class", "content-body content-input-allocation");
    			$html.find(".content-input").attr("class", "content-body content-input hidden");
    		} else {
    			$html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-down");
    			$html.find(".content-input-allocation").attr("class", "content-body hidden content-input-allocation");
    		}
    	};
    });
    
    RTU.register("app.rolepermissionsmanagement.allocation.checked", function(){
    	return function(data){
    		var array=eval(data.locos);
    		var length = array.length;
    		if(array.length==0){
    			markData=[];
    		}else{
	    		for(i in array){
	    			var d=array[i];
	    			var locoNoAndAB=d[2]+RTU.invoke("app.locoAb.getChar",d[3]);
	    			var k=d[1]+"-"+locoNoAndAB;
	    			if($("#"+k+"-left").length>0){
	    				markData[k]="[\""+d[0]+"\",\""+d[1]+"\",\""+d[2]+"\",\""+d[3]+"\"]";
		    			$("#"+k+"-left").attr("checked","checked");
		    			$("#"+k+"-right").parent().parent().removeClass("hidden");
		    			$("#"+k+"-right").parent().parent().parent().parent().removeClass("hidden");
	    			}else{
	    				length--;
	    			}	    			
	    		}
    		}
    		$("#hasAssign").text(length);
    		$(".allocation-father-ck",$("#allocation-main-divL")).each(function(i,item){
    			var len1=$(this).parent().parent().siblings().find(".allocation-children-ck[checked='checked']").length;
    			var len2=$(this).parent().parent().siblings().find(".allocation-children-ck").length;
    			if(len1>0 && len1==len2){
        			$(this).attr("checked","checked");
        		}
    		});
    		$(".allocation-father-div",$("#allocation-main-divR")).each(function(i,item){
    			var len1=$(this).parent().find(".allocation-children-div").find("div.hidden").length;
    			var len2=$(this).parent().find(".allocation-children-div").find("div").length;
    			if(len2==0 || len1==len2/2){
    				$(this).parent().addClass("hidden");
    			}
    		});
    	}
    });
    RTU.register("app.rolepermissionsmanagement.allocation.head", function () {
        var setInput = function (pData) {
            pData = pData ? pData : {};
            $html.find("#input-name-allocation-role").html(pData.name || "");
            $html.find("#input-name-allocation-role").attr("roleId",pData.id || "");
        };
        var bureauLocoQuery=function(bid){
        	$("#allocation-locoName").val("");
        	var selVal=$("locoregStateSel").val();
        	if(selVal==""){
        		if(bid==undefined||bid=="0"){
        			
        			var obj=$(".allocation-children-ck","#allocation-main-divL");
        			obj.removeAttr("hidden");
            		obj.parent().parent().show();//每一台机车的checkbox的父节点的父节点div显示
            		obj.parent().parent().parent().prev().show();//车型div显示
            	}
            	else{
            		var obj=$(".allocation-children-ck[bid!='"+bid+"']","#allocation-main-divL");
            		obj.parent().parent().hide();
            		$(".allocation-children-ck[bid='"+bid+"']","#allocation-main-divL").parent().parent().show();
            	}
        	}
        	else{
        		if(bid==undefined||bid=="0"){
        			var obj=$(".allocation-children-ck[isReg="+selVal+"]","#allocation-main-divL");
        			obj.removeAttr("hidden");
            		obj.parent().parent().show();//每一台机车的checkbox的父节点的父节点div显示
            		obj.parent().parent().parent().prev().show();//车型div显示
            	}
            	else{
            		var obj=$(".allocation-children-ck[isReg!="+selVal+"][bid!='"+bid+"']","#allocation-main-divL");
            		obj.parent().parent().hide();
            		$(".allocation-children-ck[bid='"+bid+"']","#allocation-main-divL").parent().parent().show();
            	}
        	}
        	/*var queryVal=$("#locoSelectAllocation").attr("checked");
        	if(!queryVal){//不结合
        		if(bid==undefined||bid=="0"){
        			
        			var obj=$(".allocation-children-ck","#allocation-main-divL");
        			obj.removeAttr("hidden");
            		obj.parent().parent().show();//每一台机车的checkbox的父节点的父节点div显示
            		obj.parent().parent().parent().prev().show();//车型div显示
            	}
            	else{
            		var obj=$(".allocation-children-ck[bid!='"+bid+"']","#allocation-main-divL");
            		obj.parent().parent().hide();
            		$(".allocation-children-ck[bid='"+bid+"']","#allocation-main-divL").parent().parent().show();
            	}
        	}
        	else{//结合
        		if(bid==undefined||bid=="0"){
            		$(".allocation-children-ck[isReg!='0']","#allocation-main-divL").parent().parent().show();
            	}
            	else{
            		$(".allocation-children-ck[bid!='"+bid+"']","#allocation-main-divL").attr("checked",false).parent().parent().hide();
            		$(".allocation-children-ck[isReg!='0'][bid='"+bid+"']","#allocation-main-divL").parent().parent().show();
            	}
        	}*/
        	
        };
        return function (pData) {
            setInput(pData);
            RTU.invoke("app.rolepermissionsmanagement.allocation.searchBureau");
        	RTU.invoke("rolepermissionsmanagement.allocation.searchDepot",{bureau:"南昌铁路局"});
        	$(".bureauSelectAllocation").change(function () {
    			RTU.invoke("app.rolepermissionsmanagement.allocation.searchDepot",{bureau:$(".bureauSelectAllocation").val()});
    			bureauLocoQuery($(".bureauSelectAllocation option:selected").attr("bid"));
        	});
        };
    });
    //保存机车权限设置
    RTU.register("app.rolepermissionsmanagement.allocation.saveLocos",function(){
    	var saveLocos = function (pData) {
            RTU.invoke("core.router.post", {
                url: "rolepermissionsmanagement/saveLocos",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "保存成功!");
                        var array=eval(pData.locos);
                        $("#hasAssign").text(array.length);
                        $html.find(".query_btn").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function () {
                    RTU.invoke("header.notice.show", "保存失败!");
                }
            });
        };
    	return function(data){
    		saveLocos(data);
    	};
    });    
  //查找所有的铁路局
    RTU.register("app.rolepermissionsmanagement.allocation.searchBureau",function(){
    	return function(){
    		var url="bureau/findAll";
    		var param={
	              url: url,
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.rolepermissionsmanagement.allocation.setBureau",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });
    //设置局的下拉
    RTU.register("app.rolepermissionsmanagement.allocation.setBureau",function(){
    	return function(data){
    		var bureauHtml="<option value='0' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
				bureauHtml=bureauHtml+"<option value="+item.bName+" bid="+item.bId+"  class='selectOptionCss'>"+item.bName+"</option>";
            });
    		$(".bureauSelectAllocation").html(bureauHtml);
    	};
    });
    //根据局来查找段
    RTU.register("app.rolepermissionsmanagement.allocation.searchDepot",function(){
    	return function(data){
    		var url="depot/searchDepotByBureau";
    		var param={
	              url: url,
	              data:{
	                  "bureau":data.bureau,
	              },
	              cache: false,
                  asnyc: true,
                  datatype: "json",
                  success: function (data) {
                	  RTU.invoke("app.rolepermissionsmanagement.allocation.setDepot",data.data);
                  },
                  error: function () {
                  }
				};
			   RTU.invoke("core.router.get", param);
    	};
    });  
    //设置段的下拉
    RTU.register("app.rolepermissionsmanagement.allocation.setDepot",function(){
    	return function(data){
    		var depotHtml="<option value='0' selected='selected'  class='selectOptionCss'>全部</option>";
    		$.each(data, function (i, item) {
    			depotHtml=depotHtml+"<option value="+item.shortname+" did="+item.dId+"  class='selectOptionCss'>"+item.dName+"</option>";
            });
    		$(".depotSelectAllocation").html(depotHtml);
    		$(".depotSelectAllocation").unbind("change").bind("change",function(){
    			$("#allocation-locoName").val("");
    			var did=$(".depotSelectAllocation option:selected").attr("did");
    			var selVal=$("#locoregStateSel").val();
    			if(selVal==""){
    				if(did==undefined||did=="0"){
                		$(".allocation-children-ck","#allocation-main-divL").parent().parent().show();
                	}
                	else{
                		$(".allocation-children-ck[did!='"+did+"']","#allocation-main-divL").attr("checked",false).parent().parent().hide();
                		$(".allocation-children-ck[did='"+did+"']","#allocation-main-divL").parent().parent().show();
                	}
    			}
    			else{
    				if(did==undefined||did=="0"){
                		$(".allocation-children-ck[]","#allocation-main-divL").parent().parent().show();
                	}
                	else{
                		$(".allocation-children-ck[isReg][did!='"+did+"']","#allocation-main-divL").attr("checked",false).parent().parent().hide();
                		$(".allocation-children-ck[did='"+did+"']","#allocation-main-divL").parent().parent().show();
                	}
    			}
    			/*var queryVal=$("#locoSelectAllocation").attr("checked");
            	if(!queryVal){//不结合
            		if(did==undefined||did=="0"){
                		$(".allocation-children-ck","#allocation-main-divL").parent().parent().show();
                	}
                	else{
                		$(".allocation-children-ck[did!='"+did+"']","#allocation-main-divL").attr("checked",false).parent().parent().hide();
                		$(".allocation-children-ck[did='"+did+"']","#allocation-main-divL").parent().parent().show();
                	}
            	}
            	else{//结合
            		if(did==undefined||did=="0"){
                		$(".allocation-children-ck[isReg!='0']","#allocation-main-divL").parent().parent().show();
                	}
                	else{
                		$(".allocation-children-ck[did!='"+did+"']","#allocation-main-divL").attr("checked",false).parent().parent().hide();
                		$(".allocation-children-ck[isReg!='0'][did='"+did+"']","#allocation-main-divL").parent().parent().show();
                	}
            	}*/
    		});
    	};
    });
});
