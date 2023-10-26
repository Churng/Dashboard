// 列表取得
function fetchAccountList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStoreApi'
	// 組裝菜單所需資料
	var action = "getStoreList";
	var chsmtoGetStoreList = user_session_id + action + "HBAdminStoreApi";
	var chsm = CryptoJS.MD5(chsmtoGetStoreList).toString().toLowerCase();

	$("#storeInformation").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/store",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			handleApiResponse(responseData);
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

// 表格填充
function updatePageWithData(responseData) {
	var dataTable = $("#storeInformation").DataTable();
	dataTable.clear().draw();

	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		var modifyButtonHtml =
			'<a href="3-store-information_update.html" class="btn btn-primary text-white modify-button update-button" data-id="' +
			data.id +
			'">修改</a>';

		var statusText = data.status === "2" ? "停業" : "正常";

		dataTable.row
			.add([
				modifyButtonHtml,
				data.storeName,
				data.storeTypeName,
				data.storeManager,
				data.phoneNumber,
				data.address,
				statusText,
			])
			.draw(false);
	}
}

// 監聽拿修改ID
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});

// 門市選擇->清單變化
$(document).ready(function () {
	var selectedShopId;

	$("#searchStoreType").on("change", function () {
		selectedShopId = $("#searchStoreType").val();
	});

	$("#searchBtn").on("click", function () {
		var filterData = {};

		if (selectedShopId) {
			filterData.storeType = selectedShopId;
		}
		sendApiRequest(filterData);
	});

	function sendApiRequest(filterData) {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "getStoreList";
		var chsmtoGetStoreList = user_session_id + action + "HBAdminStoreApi";
		var chsm = CryptoJS.MD5(chsmtoGetStoreList).toString().toLowerCase();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;

		$("#storeInformation").DataTable();

		$.ajax({
			type: "POST",
			url: "https://88bakery.tw/HBAdmin/index.php?/api/store",
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				updatePageWithData(responseData);
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	}
});

// 加載時拿fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});

// 點擊按鈕時使用 fetchAccountList
$("#allBtn").on("click", function () {
	fetchAccountList();
});

//權限控制
$(document).ready(function () {
	handlePermissionControl();
});
