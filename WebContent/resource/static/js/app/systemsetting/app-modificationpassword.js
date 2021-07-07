RTU.DEFINE(function (require, exports) {
/**
 * 模块名：修改密码
 * name：passwordsetting
 * date:2015-2-12
 * version:1.0 
 */
    require("popuwnd/js/popuwnd.js");
    require("draw/draw.js");
    require("../../../css/app/app-modificationpassword.css");
    var $html;
    var popuwnd;
    var data;

    /***************************************************************************
    * 加载修改密码页面的Html
    **************************************************************************/
    RTU.register("app.passwordsetting.query.init", function () {
        RTU.invoke("core.router.load", {
            url: "../app/modules/passwordsetting/app-modificationpassword.html",
            success: function (html) {
                $html = $(html);
                if (popuwnd) {
                    popuwnd.html($html);
                    RTU.invoke("app.passwordsetting.query.create", $html);
                }
                RTU.invoke("app.passwordsetting.query.btn.init");
            }
        });
        return function () {
            return true;
        };
    });
    /***************************************************************************
    * 修改密码窗口-加载
    **************************************************************************/
    RTU.register("app.passwordsetting.query.activate", function () {
        return function () {
        	RTU.invoke("header.msg.hidden");
            var width = $("body").width() - 640;
            var height = $("body").height() - 120;
            if (!popuwnd) {
                popuwnd = new PopuWnd({
                    title: data.alias,
                    html: $html,
                    width: 300,
                    height: 200,
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
        };
    });
    /***************************************************************************
    * 修改密码窗口关闭
    **************************************************************************/
    RTU.register("app.passwordsetting.query.deactivate", function () {
        return function () {
            if (popuwnd) {
                popuwnd.hidden();
            }

        };
    });
    /***************************************************************************
    * 验证用户权限
    **************************************************************************/
    RTU.register("app.passwordsetting.query.init", function () {
        data = RTU.invoke("app.setting.data", "passwordsetting");
        if (data && data.isActive) {
            RTU.invoke("app.passwordsetting.query.activate");
        }
        return function () {
            return true;
        };
    });

    /***************************************************************************
    * 按钮初始化
    **************************************************************************/
    RTU.register("app.passwordsetting.query.btn.init", function () {
        return function () {
            //提交按钮
            $html.find(".app_password_commit").click(function () {
                var oldPassword = $html.find("input[name='oldPassword']").val();
                var newPassword = $html.find("input[name='newPassword']").val();
                var confirmPassword = $html.find("input[name='confirmPassword']").val();
                if (oldPassword == "") {
                    RTU.invoke("header.notice.show", "旧密码不能为空!");
                    return;
                }
                if (newPassword == "") {
                    RTU.invoke("header.notice.show", "新密码不能为空!");
                    return;
                }
                if (confirmPassword == "") {
                    RTU.invoke("header.notice.show", "确认密码不能为空!");
                    return;
                }
                if (newPassword != confirmPassword) {
                    RTU.invoke("header.notice.show", "两次密码输入不一致!");
                    return;
                }
                if (newPassword.length < 6) {
                    RTU.invoke("header.notice.show", "密码长度不能少于6位!");
                    return;
                }

                var pData = {};
                pData.oldPwd = oldPassword;
                pData.newPwd = newPassword;

                RTU.invoke("core.router.get", {
                    url: "changePwd",
                    data: $.param(pData),
                    success: function (obj) {
                        if (obj.success) {
                            RTU.invoke("app.passwordsetting.query.deactivate");
                        }

                        RTU.invoke("header.notice.show", obj.msg);
                    },
                    error: function () {
                        RTU.invoke("header.notice.show", "密码修改失败!");
                    }
                });
            });

            //重置按钮
            $html.find(".app_password_reset").click(function () {
                $html.find("input[name='oldPassword']").val("");
                $html.find("input[name='newPassword']").val("");
                $html.find("input[name='confirmPassword']").val("");
            });
            return true;
        };
    });

});