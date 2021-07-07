/*
报表工具
 */

function getImageBase64(dom){
    var canava = $("#"+dom).find("canvas")[0];
    var imgdata = canava.toDataURL("image/png")
    return imgdata.substring(imgdata.indexOf(",")+1);
}

function getReportdata(){
    return window.tableData;
}