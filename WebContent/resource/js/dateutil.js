/*
日期处理js
 */
var formatStr = 'yyyy-MM-dd hh:mm:ss';

function getDateSplit(time) {
    return {
        y: time.getFullYear(),
        M: time.getMonth() + 1,
        d: time.getDate(),
        h: time.getHours(),
        m: time.getMinutes(),
        s: time.getSeconds()
    };
}

/*
 * 日期格式化
 */
function date2str(x, y) {
    var z = getDateSplit(x);
    return y.replace(/(y+|M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-(v.length > 2 ? v.length : 2))
    });
};

function addDay(time, day) {
    return new Date(new Date(time).getTime() + day * 86400000);
}

function addQuarter(time, quarter) {
    var splitTime = getDateSplit(time);
    var num = splitTime.M + 3 * quarter;
    return new Date(splitTime.y + (num >= 0 ? parseInt(num / 12) : parseInt(num / 12 - 1)), (num >= 0 ? (num % 12) : (num % 12 + 12)) - 1, splitTime.d, splitTime.h, splitTime.m, splitTime.s);
}

function addMonth(time, month) {
    var splitTime = getDateSplit(time);
    var num = splitTime.M + month;
    return new Date(splitTime.y + (num >= 0 ? parseInt(num / 12) : parseInt(num / 12 - 1)), (num >= 0 ? (num % 12) : (num % 12 + 12)) - 1, splitTime.d, splitTime.h, splitTime.m, splitTime.s);
}

function addYear(time, year) {
    var splitTime = getDateSplit(time);
    return new Date(splitTime.y + year, splitTime.M - 1, splitTime.d, splitTime.h, splitTime.m, splitTime.s);
}

function getDateStr(time) {
    return date2str(time, formatStr);
}

function getNowHeadMonth(){
    var now = new Date();
    return getDateStr(addMonth(new Date(now.getFullYear(),now.getMonth(),1),-1));
}
