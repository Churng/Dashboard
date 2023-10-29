// 取得列表
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminStockInApi'
	// 組裝菜單所需資料
	var action = "getStockInList";
	var chsmtoGetStockListList = user_session_id + action + "HBAdminStockInApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockListList).toString().toLowerCase();

	$("#stockIn").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/stockIn",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// 处理成功响应
			console.log("成功响应：", responseData);
			// 可以在这里执行其他操作
			updatePageWithData(responseData);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockIn").DataTable();
	dataTable.clear().draw();

	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		// 權限設定 //

		// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		// var currentUrl = window.location.href;
		// handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

		var modifyButtonHtml =
			'<a href="wareHouseDetail_update.html" style="display:inline-block" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="' +
			data.id +
			'">修改</a>';

		var deleteButtonHtml =
			'<button class="btn btn-danger delete-button"  style="display:none" data-id="' +
			data.id +
			'" data-filename="' +
			data.fileName +
			'">刪除</button>';

		var readButtonHtml =
			'<a href="wareHouseDetail_update.html" style="display:none" class="btn btn-warning text-white read-button" data-button-type="read" data-id="' +
			data.id +
			'">查看</a>';

		var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml + "&nbsp;" + readButtonHtml;

		dataTable.row
			.add([
				buttonsHtml,
				data.id,
				data.createTime,
				data.createOperator,
				data.depotId,
				data.storeName,
				data.createOperatorId,
				data.componentId,
				data.componentSupplier,
				data.componentNumber,
				data.componentName,
				data.brandName,
				data.suitableCarModel,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.cost,
				data.workingHour,
				data.statusName,
			])
			.draw(false);
	}
}
