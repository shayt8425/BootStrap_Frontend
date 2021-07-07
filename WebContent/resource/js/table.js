//用于处理已选和待选的信息
// 取消选择 则将数据显示在表格中
function cancelSelect(devicetype_id){
	$("lable[id='" + devicetype_id + "']").remove();
	$("span[id='" + devicetype_id + "']").remove();
	$("tr[id='" + devicetype_id + "']").show();
	$("tr[id='" + devicetype_id + "']").removeClass("selected");
	$("input[value='" + devicetype_id + "']").prop("checked", false);
}