var RTTree = (function () {
    function RTTree(param) {
        this.param = this.extend(param);
        this.conDiv = this.getById(this.param.containId);
        this.conImgs = [];
        this.tableTrs = [];
        this.treeParentNames = [];
        this.headTableTr = [];
        this.tables = [];
        this.selectTypes = [];
        this.colNames = [];
        this.clickTrID = null; //点击的行
        this.selectTrsTD = []; //选中的行
        this.init();
    };
    RTTree.param = {
        parentColName: "", //父节点字段
        datas: [], //数据源
        IdColName: "", //id字段
        containId: "", //容器id
        url: "", //请求后台url，和data二选一
        treeWidth: "", //宽度
        treeHeight: "", //高度
        treeHead: [], //头部
        selectType: "radio", // checkbox,default，是多选还是单选，默认值是没有
        treeModel: {}, //设置模型
        enCheckFn: null//去选中的时候触发的时间
    };
    RTTree.prototype.init = function (fn) {
        if (this.param.url) {
            var that = this;
            this.loadTableData(function (data) {
                that.param.datas = data;
                that.setTreeSize();
                that.initHead();
                that.initBody();
                that.initEvent();
                if (fn) {
                    fn();
                }
            });
        } else {
            this.setTreeSize();
            this.initHead();
            this.initBody();
            this.initEvent();
            if (fn) {
                fn();
            }
        }
    };
    //刷新
    RTTree.prototype.refresh = function (data) {
        this.param.datas = data || this.param.datas;
        this.conDiv.innerHTML = "";
        this.conImgs = [];
        this.tableTrs = [];
        this.treeParentNames = [];
        this.tables = [];
        this.selectTypes = [];
        this.colNames = [];
        var that = this;
        this.init(function () {
            (function () {
                if (that.clickTrID) { //找出点击那行
                    for (var i = 0; i < that.param.datas.length; i++) {
                        var d = that.param.datas[i];
                        if (that.clickTrID == d[that.param.IdColName]) {
                            var trs = that.body.getElementsByTagName("tr");

                            that.addClass(that.tableTrs[i], "RTTree_clickTr");
                            that.selectTypes[i].checked = true;

                            break;
                        } else {
                            that.selectTypes[i].checked = false;
                            that.selectTrsTD[i] = "";
                        }
                    }
                }
            })();
            (function () {
                if (that.selectTrsTD.length != 0) { //找出选中行
                    for (var j = 0; j < that.param.datas.length; j++) {
                        if (that.selectTrsTD[j]) {
                            that.selectTypes[j].checked = true;
                        }
                    }
                }
            })();
            $(".RTTree_body").scrollTop(that.scrollTop);
        });
    };

    RTTree.prototype.ishavaReplace = function (d, name, data, td) {
        for (var i = 0; i < this.param.replaceTd.length; i++) {
            if (this.param.replaceTd[i].colName == name) {
                d = this.param.replaceTd[i].fn(d, td, data);
            }
        }
        return d;
    };

    RTTree.prototype.getcolNames = function () {
        var arr = [];
        for (var i = 0, len = this.param.treeModel.length; i < len; i++) {
            var n = this.param.treeModel[i].name;
            if (n != this.param.parentColName) {
                arr.push(n);
            }
        }
        return arr;
    }
    RTTree.prototype.setTreeSize = function (w, h) {
        this.conDiv.className = "RTTree";
        this.conDiv.style.width = (w || this.param.treeWidth) + "px";
        this.conDiv.style.height = (h || this.param.treeHeight) + "px";
    };
    RTTree.prototype.initHead = function () {
        this.head = this.create("div");
        this.head.className = "RTTree_head";
        this.head_table = this.create("table");
        this.head_table.className = "RTTree_head_table";
        var tr = this.create("tr");
        var h = this.param.treeHead;
        for (var i = 0, len = h.length; i < len; i++) {
            var td = this.create("td")
            var t = document.createTextNode(h[i]);
            td.appendChild(t);
            tr.appendChild(td);
        }
        this.headTableTr.push(tr);
        this.head_table.appendChild(tr);
        this.head.appendChild(this.head_table);
        this.conDiv.appendChild(this.head);
        this.setHeadCss = function (obj) {
            this.head.style.width = obj.width;
            this.head.style.height = obj.height;
            this.head.style.backgroundColor = obj.backgroundColor;
        };
    };
    RTTree.prototype.initBody = function () {
        this.body = this.create("div");
        this.body.className = "RTTree_body";
        if (this.param.datas.length > 0) {
            this.addDataToTree(this.body);
        }
        this.conDiv.appendChild(this.body);
        this.setBodySize = function (w, h) {
            this.body.style.width = (w || this.param.treeWidth) - 20 + "px";
            this.body.style.height = (h || this.param.treeHeight - 30) + "px";
        }
        this.setBodySize();
        this.reSizeHead();
    };
    
    var locoTyName=[];
    var locoTyNameIndex=0;
    RTTree.prototype.initEvent = function (exeNum) {
        var that = this;
        setScrollLeft: (function () {
            $(".RTTree_body").scroll(function (e) {
                that.scrollTop = $(this).scrollTop();
            });
        })();
        (function () { //展开和收缩
            for (var i = exeNum ? exeNum : 0, len = that.conImgs.length; i < len; i++) {
                that.addEvent(that.conImgs[i], "click", function () {
                    if (this.src.indexOf("zhankai.png") != -1) {
                    	
                    	var s = this.parentNode.parentNode;
                    	var ch=$(s).find('span.RTTree_Item_childrens'); 
                    	var v=$(ch).text();
                    	for ( var int = 0; int < locoTyName.length; int++) {
							if(locoTyName[int]==v){
								locoTyName[int]="";
								break;
							}
						}
                    	
                        this.src = '../static/js/RTTree/img/shousuo.png';
                        var p = this.parentNode.parentNode.parentNode;
                        var target = that.getClass("RTTree_Item_table", p);
                        that.addClass(target[0], "RTTree_None");
                    } else {
                    	
                    	var s = this.parentNode.parentNode;
                    	var ch=$(s).find('span.RTTree_Item_childrens'); 
                    	var v=$(ch).text();
                    	
                    	locoTyName[locoTyNameIndex]=v;
                    	locoTyNameIndex++;
                    	
                        this.src = '../static/js/RTTree/img/zhankai.png';
                        var p = this.parentNode.parentNode.parentNode;
                        var target = that.getClass("RTTree_Item_table", p);
                        that.removeClass(target[0], "RTTree_None");
                    }
                });
            }
        })();
        (function () {  //鼠标经过和点击的样式
            for (var i = exeNum ? exeNum : 0, len = that.tableTrs.length; i < len; i++) {
                that.addEvent(that.tableTrs[i], "mouseover", function () {
                    that.addClass(this, "RTTree_moveTr");
                });
                that.addEvent(that.tableTrs[i], "mouseout", function () {
                    that.removeClass(this, "RTTree_moveTr");
                });
                (function (i) {
                    that.addEvent(that.tableTrs[i], "click", function (e) {
                        if (e.target.localName == "td") {
                            for (var j = 0, len = that.tableTrs.length; j < len; j++) {
                                that.removeClass(that.tableTrs[j], "RTTree_clickTr");
                            }
                            that.addClass(this, "RTTree_clickTr");
                            var tr = this;
                            if (that.param.IdColName) {
                                that.clickTrID = that.param.datas[i][that.param.IdColName];
                            }
                            if (that.param.trClick) {
                                that.removeCheck(i);
                                that.param.trClick(tr, that.param.datas[i]);
                            }
                        }
                        return false;
                    });
                })(i);
            }
        })();
        (function () {  //插入选择的按钮
            if (that.param.selectType == "radio") {
                setSelectType("radio");
            }
            if (that.param.selectType == "checkbox") {
                setSelectType("checkbox");
            }
            function setSelectType(inputType) {
                for (var i = exeNum ? exeNum : 0; i < that.tableTrs.length; i++) {
                    var tr = that.tableTrs[i];
                    var td = tr.getElementsByTagName("td")[0];
                    var r = that.create("input");
                    r.type = inputType;
                    r.name = "rtTree_radio";
                    r.className = "rtTree_radio";
                    r.style.cssText = "vertical-align:middle;";
                    that.selectTypes.push(r);
                    if (td) {
                        td.insertBefore(r, td.firstChild);
                    }

                }
                var tdh = that.headTableTr[0].getElementsByTagName("td")[0];
                var put = that.create("input");
                put.type = inputType;
                put.name = "rtTree_radio";
                put.style.cssText = "vertical-align:middle;visibility:hidden;";
                if (tdh) {
                    tdh.insertBefore(put, tdh.firstChild);
                }

            }
        })();
        (function () {//点击多选框或者单选框
            var ss = that.selectTypes;
            for (var i = exeNum ? exeNum : 0, len = ss.length; i < len; i++) {
                (function (i) {
                    that.addEvent(ss[i], "change", function (e) {
                        if (ss[i].checked) {
                            var checkData = [];
                            for (var b = 0; b < that.tableTrs.length; b++) {
                                var tr = that.tableTrs[b];
                                var checkbox = that.getClass("rtTree_radio", tr)[0];
                                if (checkbox.checked) {
                                    checkData.push(that.param.datas[b]);
                                    if (that.param.IdColName) {
                                        that.selectTrsTD[i] = that.param.datas[b][that.param.IdColName];
                                    }
                                }
                            }
                            that.param.selectInputFn(that.param.datas[i], checkData);
                        } else {
                            that.selectTrsTD[i] = "";
                            if (that.param.enCheckFn) {
                                that.param.enCheckFn(that.param.datas[i]);
                            }
                        }
                        return false;
                    });
                })(i);
            }
        })();
    };
    //选择的状态
    RTTree.prototype.removeCheck = function (thisInputIndex) {
        for (var i = 0; i < this.selectTypes.length; i++) {
            if (thisInputIndex == i) {
                continue;
            } else {
                this.selectTypes[i].checked = false;
            }
            this.selectTypes[thisInputIndex].checked = true;
        }
    };
    RTTree.prototype.addDataToTree = function (treeBody, jumpIndex, notIntable) {

        for (var i = jumpIndex ? jumpIndex : 0, len = this.param.datas.length; i < len; i++) {
            var d = this.param.datas[i];
            
            var parName = this.getParentValue(d);
            var RTTree_Item_table = this.create("table");
            
            
            if (!notIntable) {
                var isIntable = this.isHavedTable(parName);
                if (isIntable.tag) {
                    RTTree_Item_table = isIntable.table;
                    this.addDataTotable(RTTree_Item_table, i);
                    continue;
                }
            }

            var showFalg=false;
            for ( var int = 0; int < locoTyName.length; int++) {
				if(parName==locoTyName[int]){
					showFalg=true;
					break;
				}
			}

            var RTTree_Item = this.create("div");
            RTTree_Item.className = "RTTree_Item";
            var RTTree_Item_parent = this.create("div");
            RTTree_Item_parent.className = "RTTree_Item_parent";

            var RTTree_ConImg = this.create("span");
            RTTree_ConImg.className = "RTTree_ConImg";
            var imgCon = this.create("img");
            if(showFalg){
            	imgCon.src = "../static/js/RTTree/img/zhankai.png";
            }else{
            	
            	imgCon.src = "../static/js/RTTree/img/shousuo.png";
            }
            this.conImgs.push(imgCon);
            RTTree_ConImg.appendChild(imgCon);
            var RTTree_parentName = this.create("span");
            RTTree_parentName.className = "RTTree_parentName";
            var t = document.createTextNode(parName);
            RTTree_parentName.appendChild(t);
            this.treeParentNames.push(RTTree_parentName);
            var RTTree_Item_childrens = this.create("div");
            RTTree_parentName.className = "RTTree_Item_childrens";
//          RTTree_Item_table.className = "RTTree_Item_table";
            
            if(showFalg){
            	RTTree_Item_table.className = "RTTree_Item_table";
            }else{
            	
            	RTTree_Item_table.className = "RTTree_Item_table RTTree_None";
            }
            
            
            RTTree_Item_table = this.addDataTotable(RTTree_Item_table, i);
            this.tables.push({ parentName: parName, table: RTTree_Item_table });
            RTTree_Item_parent.appendChild(RTTree_ConImg);
            RTTree_Item_parent.appendChild(RTTree_parentName);
            RTTree_Item.appendChild(RTTree_Item_parent);
            RTTree_Item_childrens.appendChild(RTTree_Item_table);
            RTTree_Item.appendChild(RTTree_Item_childrens);
            treeBody.appendChild(RTTree_Item);
        }
    };
    //重新设置头部宽度 
    RTTree.prototype.reSizeHead = function () {
        var tr = this.tableTrs[0];
        if (tr) {
            var tds = tr.getElementsByTagName("td");
            var thds = this.headTableTr[0].getElementsByTagName("td");
            for (var i = 0; i < tds.length; i++) {
                if (tds[i].clientWidth)
                    thds[i].width = tds[i].clientWidth + "px";
            }

        }

    };
    RTTree.prototype.isHavedTable = function (parentName) {
        var ts = this.tables;
        var tag = false;
        var t = null;
        for (var i = 0; i < ts.length; i++) {
            if (parentName == ts[i].parentName) {
                tag = true;
                t = ts[i].table;
                break;
            }
        }
        return { tag: tag, table: t };
    };
    RTTree.prototype.addDataTotable = function (RTTree_Item_table, runIndex) {
        var that = this;
        var tr = this.create("tr");
        tr.className = "RTTree_tr_" + runIndex;
        var d = this.param.datas[runIndex];
        var model = this.param.treeModel;
        for (var n = 0; n < model.length; n++) {
            var td = this.create("td");
            var nm = model[n].name;
            if (nm == this.param.parentColName) {
                if (this.param.replaceTd) {
                    var rd = this.param.replaceTd;
                    for (var g = 0, len = this.param.replaceTd.length; g < len; g++) {
                        if (nm == rd[g].colName) {
                            var l = that.treeParentNames.length;
                            if (l > 0) {
                                that.treeParentNames[l - 1].innerHTML = rd[g].fn(d[nm], td, d);
                            }
                            break;
                        }
                    }
                } else {
                    td.appendChild(document.createTextNode(d[nm]));
                }
                continue;
            }
            td.appendChild(document.createTextNode(d[nm]));
            td.className = "rd_" + nm;
            if (this.param.replaceTd) {
                var rd = this.param.replaceTd;
                for (var g = 0, len = this.param.replaceTd.length; g < len; g++) {
                    if (nm == rd[g].colName) {
                        td.innerHTML = rd[g].fn(d[nm], td, d);
                        break;
                    }
                }
            }
            if (model[n].width) {
                td.style.width = model[n].width;
            }
            tr.appendChild(td);
        }
        this.tableTrs.push(tr);
        RTTree_Item_table.appendChild(tr);
        return RTTree_Item_table;
    };
    RTTree.prototype.getParentValue = function (d) {
        var name = "noName";
        for (var n in d) {
            if (n == this.param.parentColName) {
                name = d[n];
                break;
            }
        }
        return name;
    };
    RTTree.prototype.create = function (type) {
        return document.createElement(type);
    };
    RTTree.prototype.getById = function (id) {
        return document.getElementById(id);
    };
    RTTree.prototype.extend = function (data) {
        var p = this.clone(RTTree.param);
        for (var i in data) {
            p[i] = data[i];
        }
        return p;
    };
    RTTree.extend = function (obj1, obj2) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
        return obj1;
    };
    RTTree.prototype.clone = function (p) {
        var o = {};
        for (var i in p) {
            o[i] = p[i];
        }
        return o;
    };
    RTTree.prototype.loadTableData = function (fn) {
        this.load({ url: this.param.url + "?temp=" + new Date().getTime(), success: function (data) {
            if (typeof data == "string") {
                data = JSON.parse(data);
            }
            if (fn) {
                if (data.data) {
                    fn(data.data)
                } else {
                    fn(data);
                }
            }
        }
        });
    };
    RTTree.prototype.load = function (param) {
        var obj = RTTree.extend({
            url: '',
            data: '',
            success: null,
            method: 'get',
            async: true,
            type: 'json',
            timeout: 20000,
            error: null
        }, param || {});
        var xhr = (function () {
            if (typeof XMLHttpRequest != 'undefined') {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject != 'undefined') {
                var version = [
                                        'MSXML2.XMLHttp.6.0',
                                        'MSXML2.XMLHttp.3.0',
                                        'MSXML2.XMLHttp'
            ];
                for (var i = 0; version.length; i++) {
                    try {
                        return new ActiveXObject(version[i]);
                    } catch (e) {
                        //跳过
                    }
                }
            } else {
                throw new Error('您的系统或浏览器不支持XHR对象！');
            }
        })();
        obj.url = obj.url + '?rand=' + Math.random();
        obj.data = (function (data) {
            var arr = [];
            for (var i in data) {
                arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
            }
            return arr.join('&');
        })(obj.data);
        if (obj.method === 'get') obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
        if (obj.async === true) {
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    callback();
                }
            };
        }
        xhr.open(obj.method, obj.url, obj.async);
        var istimeout = false;
        var timer = setTimeout(function () {
            istimeout = true;
            if (xhr.abort) {
                xhr.abort();
                if (obj.error) {
                    obj.error("超时了");
                }
            }
        }, obj.timeout);
        if (obj.method === 'post') {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(obj.data);
        } else {
            xhr.send(null);
        }
        if (obj.async === false) {
            callback();
        }
        function callback() {
            if (istimeout) return;
            if (xhr.status == 200) {
                var type = xhr.getResponseHeader("Content-Type");
                var datat = "";
                if (type.indexOf("xml") !== -1 && xhr.responseXML)
                    datat = xhr.responseXML;
                else if (type === "application/json")
                    datat = JSON.parse(xhr.responseText);
                else
                    datat = xhr.responseText;
                obj.success(datat);
            } else {
                alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
            }
        }
    };
    RTTree.prototype.addEvent = function (obj, type, fn) {

        if (typeof obj.addEventListener != 'undefined') {
            obj.addEventListener(type, fn, false);
        } else {
            if (!obj.events) obj.events = {};
            if (!obj.events[type]) {
                obj.events[type] = [];
                if (obj['on' + type]) obj.events[type][0] = fn;
            } else {
                if (this.addEvent.equal(obj.events[type], fn)) return false;
            }
            obj.events[type][this.addEvent.ID++] = fn;
            obj['on' + type] = this.addEvent.exec;
        }
    };
    RTTree.prototype.addEvent.ID = 1;
    RTTree.prototype.addEvent.exec = function (event) {
        var e = event || this.addEvent.fixEvent(window.event);
        var es = this.events[e.type];
        for (var i in es) {
            es[i].call(this, e);
        }
    };
    RTTree.prototype.addEvent.equal = function (es, fn) {
        for (var i in es) {
            if (es[i] == fn) return true;
        }
        return false;
    };
    RTTree.prototype.addEvent.fixEvent = function (event) {
        event.preventDefault = this.addEvent.fixEvent.preventDefault;
        event.stopPropagation = this.addEvent.fixEvent.stopPropagation;
        event.target = event.srcElement;
        return event;
    };
    RTTree.prototype.addEvent.fixEvent.preventDefault = function () {
        this.returnValue = false;
    };
    RTTree.prototype.addEvent.fixEvent.stopPropagation = function () {
        this.cancelBubble = true;
    };
    RTTree.prototype.getClass = function (className, parentNode) {
        var node = null;
        var temps = [];
        if (parentNode) {
            node = parentNode;
        } else {
            node = document;
        }
        var all = node.getElementsByTagName('*');
        for (var i = 0; i < all.length; i++) {
            if ((new RegExp('(\\s|^)' + className + '(\\s|$)')).test(all[i].className)) {
                temps.push(all[i]);
            }
        }
        return temps;
    };
    RTTree.prototype.addClass = function (obj, className) {
        obj.className += ' ' + className;
    };
    RTTree.prototype.removeClass = function (obj, className) {
        obj.className = obj.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
    };
    return RTTree;
})();