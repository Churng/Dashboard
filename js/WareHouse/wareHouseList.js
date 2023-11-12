// 取得列表
function fetchAccountList() {
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
		url: `${apiURL}/stockIn`,
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
			'<a href="wareHouseDetail_update.html" style="display:inline-block" class="btn btn-primary text-white modify-button" data-button-type="update" data-componentid="' +
			data.componentId +
			'" data-id="' +
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

// 監聽日期選擇
$(document).ready(function () {
	var sdateValue, edateValue;

	// 監聽起始日期
	$("#startDate").on("change", function () {
		sdateValue = $(this).val();
	});

	// 監聽結束日期
	$("#endDate").on("change", function () {
		edateValue = $(this).val();
	});

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		// 创建筛选数据对象
		var filterData = {};

		if (sdateValue) {
			filterData.stime = sdateValue;
		}

		if (edateValue) {
			filterData.etime = edateValue;
		}

		sendApiRequest(filterData);
	});

	function sendApiRequest(filterData) {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// console.log(user_session_id);
		// chsm = session_id+action+'HBAdminStockInApi'
		// 組裝菜單所需資料
		var action = "getStockInList";
		var chsmtoGetStockListList = user_session_id + action + "HBAdminStockInApi";
		var chsm = CryptoJS.MD5(chsmtoGetStockListList).toString().toLowerCase();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;

		$("#stockIn").DataTable();
		// 发送API请求以获取数据
		$.ajax({
			type: "POST",
			url: `${apiURL}/stockIn`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				if (responseData.returnCode === "1") {
					updatePageWithData(responseData);
					clearDateFields();
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

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var cid = $(this).data("componentid");
	var id = $(this).data("id");

	localStorage.setItem("componentId", cid);
	localStorage.setItem("wareHouseId", id);
});

// Modal點擊跳轉頁面
$(document).ready(function () {
	$("#confirm").click(function () {
		var inputValue = $("#componentId").val();
		localStorage.setItem("componentValue", inputValue);
		$("#createModal").modal("hide");

		window.location.href = "wareHouseDetail.html";
	});
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});

// 或者在点击按钮时调用 fetchAccountList
$("#allBtn").on("click", function () {
	fetchAccountList();
});

function clearDateFields() {
	$("#startDate").val("");
	$("#endDate").val("");
}
