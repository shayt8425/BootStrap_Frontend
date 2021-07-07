RTU.DEFINE(function (require, exports) {
/**
 * 模块名：用户管理
 * name：usermanagement
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("pagebutton/js/pagebutton.js");

    var $html;
    var popuwnd;
    var data;
    var cData;
    var mIsSave = false;

    RTU.register("app.usermanagement.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/usermanagement/app-usermanagement-query.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    RTU.invoke("app.usermanagement.query.create", $html);
                }
                RTU.invoke("app.usermanagement.input.init");
                RTU.invoke("app.usermanagement.query.search.init");
                RTU.invoke("app.usermanagement.query.data.unit.init");
                RTU.invoke("app.usermanagement.query.data.duty.init");
                RTU.invoke("app.usermanagement.query.data.department.init");
                RTU.invoke("app.usermanagement.query.data.role.init");
                RTU.invoke("app.usermanagement.query.input.init");
                $html.find(".query_btn").click(function () {
                    updateParams();
                    search();
                });
                $html.find(".query_btn").click();
            }
        });
        return function () {
            return true;
        };
    });
    RTU.register("app.usermanagement.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            if (!popuwnd) {
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
            } else {
                popuwnd.init();
            }
            //重新加载角色下拉框内容
            RTU.invoke("app.usermanagement.query.data.role.init");
        };
    });
    RTU.register("app.usermanagement.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }
        };
    });
    RTU.register("app.usermanagement.query.init", function () {
        data = RTU.invoke("app.setting.data", "usermanagement");
        if (data && data.isActive) {
            RTU.invoke("app.usermanagement.query.activate");
        }
        return function () {
            return true;
        };
    });
    RTU.register("app.usermanagement.input.show", function () {
        return function (show) {
            if (show) {
                $html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-up");
                $html.find(".content-input").attr("class", "content-body content-input");
            } else {
                $html.find(".content-dropdown-btn").attr("class", "content-dropdown-btn content-dropdown-btn-down");
                $html.find(".content-input").attr("class", "content-body hidden content-input");
            }
        };
    });
    RTU.register("app.usermanagement.input.init", function () {
        var isShow = false;
        return function () {
            $html.find(".content-dropdown-btn").click(function () {
                if (isShow) {
                    RTU.invoke("app.usermanagement.input.show", false);
                    isShow = false;
                } else {
                    RTU.invoke("app.usermanagement.input.show", true);
                    isShow = true;
                }
            });
        };
    });
    RTU.register("app.usermanagement.query.data.duty.init", function () {
        var initQuerySelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $(".query_duty").html(html);
        };
        var initInputSelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $(".input_duty").html(html);
        };
        return function () {
            RTU.invoke("core.router.get", {
                url: "dictionary/findAllByParentName?parentName=职务",
                success: function (obj) {
                    initQuerySelector(obj.data);
                    initInputSelector(obj.data);
                }
            });
        };
    });
    RTU.register("app.usermanagement.query.data.unit.init", function () {
        var initQuerySelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $(".query_unit").html(html);
        };
        var initInputSelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].unitCode + "</option>";
            }
            $(".input_unitcode").html(html);
        };
        return function () {
            RTU.invoke("core.router.get", {
                url: "unit/findAll",
                success: function (obj) {
                    initQuerySelector(obj.data);
                    initInputSelector(obj.data);
                }
            });
        };
    });
    RTU.register("app.usermanagement.query.data.department.init", function () {
        var initInputSelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].dname + "</option>";
            }
            $(".input_department").html(html);
        };
        return function () {
            RTU.invoke("core.router.get", {
                url: "department/findAll",
                success: function (obj) {
                    initInputSelector(obj.data);
                }
            });
        };
    });
    RTU.register("app.usermanagement.query.data.role.init", function () {
        var initInputSelector = function (data) {
            var html = "<option></option>";
            for (var i = 0; i < data.length; i++) {
                html += "<option value='" + data[i].id + "'>" + data[i].name + "</option>";
            }
            $(".input_role").html(html);
        };
        return function () {
            RTU.invoke("core.router.get", {
                url: "rolepermissionsmanagement/findAll",
                success: function (obj) {
                    initInputSelector(obj.data);
                }
            });
        };
    });
    RTU.register("app.usermanagement.query.input.init", function () {
        var initSave = function () {
            $html.find(".input-save-btn").click($.proxy(function () {
                var mData = checkData(getInput(cData));
                if (!mIsSave) {
                    if (checkSaveInput(mData)) {
                        save(mData);
                    }
                } else {
                    if (checkUpdateInput(mData)) {
                        if (mData.plainPassword == "********") {
                            mData.plainPassword = "";
                        }
                        update(mData);
                    }
                }
            }, this));
        };
        var initReset = function () {
            $html.find(".input-reset-btn").click($.proxy(function () {
                RTU.invoke("app.usermanagement.query.input.modify", {});
                RTU.invoke("app.usermanagement.query.input.change", false);
            }, this));
        };
        var initPasswordInput = function () {
            $html.find(".input_plainPassword").focusout($.proxy(function () {
                if (mIsSave && RTU.utils.string.isBank($html.find(".input_plainPassword").val())) {
                    $html.find(".input_plainPassword").val("********");
                    //					$html.find(".input_plainPassword").val("");
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
            pData.loginName = $html.find(".input_loginName").val();
            pData.realName = $html.find(".input_realName").val();
            pData.no = $html.find(".input_no").val() || null;
            pData.plainPassword = $html.find(".input_plainPassword").val();
            pData.departmentId = $html.find(".input_department").val();
            pData.dutyId = $html.find(".input_duty").val();
            pData.roleId = $html.find(".input_role").val();
            pData.unitId = $html.find(".input_unitcode").val();
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
            if (RTU.utils.string.isBank(pData.loginName)) {
                RTU.invoke("header.notice.show", "用户名不能为空!");
                RTU.utils.input.focusin($html.find(".input_loginName"));
                return false;
            } else {
                RTU.utils.input.focusout($html.find(".input_loginName"));
            }
            if (RTU.utils.string.isBank(pData.plainPassword)) {
                RTU.invoke("header.notice.show", "密码不能为空!");
                RTU.utils.input.focusin($html.find(".input_plainPassword"));
                return false;
            } else {
                RTU.utils.input.focusout($html.find(".input_plainPassword"));
            }
            return true;
        };
        var checkUpdateInput = function (pData) {
            if (RTU.utils.string.isBank(pData.loginName)) {
                RTU.invoke("header.notice.show", "用户名不能为空!");
                RTU.utils.input.focusin($html.find(".input_loginName"));
                return false;
            } else {
                RTU.utils.input.focusout($html.find(".input_loginName"));
            }
            return true;
        };
        var save = function (pData) {
            RTU.invoke("core.router.get", {
                url: "usermanagement/save",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "用户 '" + pData.loginName + "' 添加成功!");
                        $html.find(".query_btn").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function () {
                    RTU.invoke("header.notice.show", "用户 '" + pData.loginName + "' 添加失败!");
                }
            });
        };
        var update = function (pData) {
            RTU.invoke("core.router.get", {
                url: "usermanagement/update",
                data: $.param(pData),
                success: function (obj) {
                    if (obj.success) {
                        RTU.invoke("header.notice.show", "用户 '" + pData.loginName + "' 保存成功!");
                        $html.find(".query_btn").click();
                    } else {
                        RTU.invoke("header.notice.show", obj.msg);
                    }
                },
                error: function () {
                    RTU.invoke("header.notice.show", "用户 '" + pData.loginName + "' 保存失败!");
                }
            });
        };
        return function () {
            initSave();
            initReset();
            //initPasswordInput();
        };
    });
    RTU.register("app.usermanagement.query.input.modify", function () {
        var setInput = function (pData) {
            pData = pData ? pData : {};
            $html.find(".input_loginName").val(pData.loginName || "");
            $html.find(".input_no").val(pData.no || "");
            $html.find(".input_realName").val(pData.realName || "");
            $html.find(".input_plainPassword").val(pData.id ? "********" : "");
            $html.find(".input_department").val(pData.departmentId || "");
            $html.find(".input_duty").val(pData.dutyId || "");
            $html.find(".input_role").val(pData.roleId || "");
            $html.find(".input_unitcode").val(pData.unitId || "");

            RTU.utils.input.focusout($html.find(".input_loginName"));
            RTU.utils.input.focusout($html.find(".input_plainPassword"));
        };
        return function (pData) {
            cData = pData;
            setInput(pData);
        };
    });
    RTU.register("app.usermanagement.query.input.change", function () {
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
    RTU.register("app.usermanagement.query.search.init", function () {

        var param;
        var pageBtn;
        var data;

        var updateParams = function () {
            param = {};
            param.name = $html.find(".query_name").val();
            param.unitId = $html.find(".query_unit").val();
            param.dutyId = $html.find(".query_duty").val();
            param.pageIndex = 1;
            param.pageSize = 10;
        };
        var resetParams = function () {
            $html.find(".query_name").val("");
            $html.find(".query_unit").val("");
            $html.find(".query_duty").val("");
        };
        var parseParams = function () {
            if (param.name == "") {
                delete param.name;
            }
            if (param.unitId == null) {
                delete param.unitId;
            }
            if (param.dutyId == null) {
                delete param.dutyId;
            }
            return $.param(param);
        };
        var search = function () {
            RTU.invoke("core.router.get", {
                url: "usermanagement/search?" + parseParams(),
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
            $html.find("tbody").html("");
            for (var i = 0; i < datas.length; i++) {
                datas[i].index = i;
                var item = new Item(datas[i]);
                item.onRemove = $.proxy(function (_data) {
                    datas.splice(_data.index, 1);
                    refesh();
                    checkSelect();
                }, this);
                $html.find("tbody").append(item.$item);
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
                url: "usermanagement/delete?ids=" + ids,
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
                    RTU.invoke("app.usermanagement.query.input.modify", this.data);
                    RTU.invoke("app.usermanagement.query.input.change", true);
                    RTU.invoke("app.usermanagement.input.show", true);
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
});
