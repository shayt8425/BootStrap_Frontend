/**
 * 列表选择时根据值显示对应的文字   例 {id:"1",name:"222"}
 * @param jsonStr　所有状态值对应文字的json串 
 * @param value 实际值 
 * @param key json中存储状态的值的key 例中 id 
 * @param name json中的显示文字值的key 例中 name
 * @returns
 */
function getJsonByKey(jsonStr, value, key, name){
	for(var k in jsonStr) {
		if(jsonStr[k][key] == value){
			return jsonStr[k][name];
		}
	}
}