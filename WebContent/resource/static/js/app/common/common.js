RTU.DEFINE(function (require, exports) {
/**
 * 模块名：公共模块
 * name：common
 * date:2015-2-12
 * version:1.0 
 */
	RTU.autocompleteBuilder =function autocompleteBuilder(object, url, exParams, parse) {
        try {
            url = "../" + url;
            object.autocomplete(url, {
                minChars: 0,
                width: 110,
                matchContains: true,
                autoFill: false,
                matchCase: true,
                max: 100,
                dataType: "jsonp",
                extraParams: exParams,
                parse: parse,
                formatItem: function (item) {
                    return item;
                },
                formatResult: function (format) {
                    return format;
                }
            });
        } catch (e) {
        }
    };
    RTU.register("app.common.query.splitlocoNo", function () {
        return function (locoTypeStr) {
            var locoTypeName = "";
            var locoNo = "";
            if (locoTypeStr == "") {
                return {
                    locoTypeName: "",
                    locoNo: ""
                };
            }
            //是纯数字的时候约定输入的是机车号
            var n = Number(locoTypeStr);
            if (!isNaN(n)) {
                locoTypeName = "";
                locoNo = locoTypeStr;
            } else {
                var str = locoTypeStr.split('-');
                if (str.length == 2) {
                    locoTypeName = str[0];
                    locoNo = str[1];
                } else if (str.length > 2) {
                    locoTypeName += str[0];
                    for (var i = 1; i < str.length - 1; i++) {
                        locoTypeName += ("-" + str[i]);
                    }
                    locoNo = str[str.length - 1];
                } else if (str.length < 2) {
                    locoTypeName = locoTypeStr;
                }
            }
            return {
                locoTypeName: locoTypeName,
                locoNo: locoNo
            };
        };
    });
});