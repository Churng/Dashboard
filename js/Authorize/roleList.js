// 取得列表
$(document).ready(function () {
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAuthorizeApi'
	// 組裝菜單所需資料
	var action = "getAuthorizeList";
	var chsmtoGetAuthList = user_session_id + action + "HBAdminAuthorizeApi";
	var chsm = CryptoJS.MD5(chsmtoGetAuthList).toString().toLowerCase();

	$("#roleList").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/authorize`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// 处理成功响应
			console.log("成功响应：", responseData);

			updatePageWithData(responseData);
			handleApiResponse(responseData);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 更新頁面按鈕
function updatePageWithData(responseData) {
	var dataTable = $("#roleList").DataTable();
	dataTable.clear().draw();
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		var modifyButtonHtml =
			'<a href="8-role-authorization_update.html" data-id="' +
			data.id +
			'" class="btn btn-primary text-white modify-button">修改</a>';

		dataTable.row.add([modifyButtonHtml, data.authorizeName, data.storeTypeName, data.roleOrder]).draw(false);
	}
}

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});

//更新數據
function refreshDataList() {
	var dataTable = $("#roleList").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getManualList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminManualApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#roleList").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/manual`,
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
}
