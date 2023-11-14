// 取得列表
function fetchAccountList() {
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
			if (responseData.returnCode === "1") {
				updatePageWithData(responseData);
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#depotList").DataTable();
	dataTable.clear().draw();

	var totalAmounteElement = document.getElementById("totalAmount");
	var totalAmounteValue = responseData.returnDataTotalAmount;
	totalAmounteElement.value = totalAmounteValue;

	// var depotNumElement = document.getElementById("depotNum");
	// var depotNumValue = responseData.returnDataTotalAmount;
	// depotNumElement.value = depotNumValue;

	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		// 權限設定 //

		// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		// var currentUrl = window.location.href;
		// handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

		var modifyButtonHtml =
			'<a href="depotDetail.html" style="display:inline-block" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="' +
			data.id +
			'">修改</a>';

		var readButtonHtml =
			'<a href="depotDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="' +
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

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("depotId", id);
});

// 查看詳請
$(document).on("click", ".read-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("depotReadId", id);
});

// 監聽欄位變動
$(document).ready(function () {
	var orderNumSelect, depotStatusSelect;

	// 監聽訂單序號
	$("#orderNum").on("change", function () {
		orderNumSelect = $("#orderNum").val();
	});

	// 監聽零件狀態
	$("#depotStatus").on("change", function () {
		depotStatusSelect = $("#depotStatus").val();
	});

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		// 创建筛选数据对象
		var filterData = {};

		if (orderNumSelect) {
			filterData.ifOrderNo = orderNumSelect;
		}

		if (depotStatusSelect) {
			filterData.status = depotStatusSelect;
		}

		if (orderNumSelect || depotStatusSelect) {
			sendApiRequest(filterData);
		} else if (!orderNumSelect || !depotStatusSelect) {
			fetchAccountList();
		}
	});

	// 创建一个函数，发送API请求以获取数据
	function sendApiRequest(filterData) {
		// 获取用户数据
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 设置API请求数据
		// chsm = session_id+action+'HBAdminStocksApi'
		var action = "getStocksList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminStocksApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;

		$("#depotList").DataTable();
		// 发送API请求以获取数据
		$.ajax({
			type: "POST",
			url: `${apiURL}/stocks`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				if (responseData.returnCode === "1") {
					updatePageWithData(responseData);
				} else {
					handleApiResponse(responseData);
				}
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	}
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});
