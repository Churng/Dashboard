// 取得列表
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	//chsm = session_id+action+'HBAdminStocksApi'
	// 組裝菜單所需資料
	var action = "getStocksList";
	var chsmtoGetStockList = user_session_id + action + "HBAdminStocksApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockList).toString().toLowerCase();

	$("#depotList").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/stocks`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			handleApiResponse(responseData);

			console.log("成功响应：", responseData);
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
	var dataTable = $("#depotList").DataTable();
	dataTable.clear().draw();

	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		// 權限設定 //

		// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		// var currentUrl = window.location.href;
		// handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

		var modifyButtonHtml =
			'<a href="manualDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="' +
			data.id +
			'">修改</a>';

		var readButtonHtml =
			'<a href="manualDetail_Rupdate.html" style="display:none margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="' +
			data.id +
			'">查看詳請</a>';

		var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml;

		dataTable.row
			.add([
				buttonsHtml,
				data.componentId,
				data.componentNumber,
				data.componentName,
				data.brandName,
				data.suitableCarModel,
				data.orderNo,
				data.storeName,
				data.orderNote,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.cost,
				data.workingHour,
				data.depotPosition,
				data.statusName,
				data.createTime,
			])
			.draw(false);
	}
}
