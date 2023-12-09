function fetchAccountList() {
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminInventoryApi'
	// 組裝菜單所需資料
	var action = "getInventoryList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminInventoryApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/inventory`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				console.log(responseData);

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
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#inventory").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#inventory").DataTable({
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="inventoryDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-inventoryno="${row.inventoryNo}">修改</a>`;

					var readButtonHtml = `<a href="inventoryDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-inventoryno="${row.inventoryNo}">查看詳請</a>`;

					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "inventoryNo" },
			{ data: "createOperator" },
			{ data: "createTime" },
			{ data: "updateTime" },
			{ data: "depotPosition" },
			{ data: "totalCost" },
			{ data: "depotTotlaAmount" },
			{ data: "inventoryTotalAmount" },
			{ data: "statusName" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

$(document).ready(function () {
	fetchAccountList();
});

// 修改按鈕事件
$(document).on("click", ".modify-button", function () {
	var inventoryId = $(this).data("inventoryno");
	localStorage.setItem("inventoryNo", inventoryId);
});

$(document).on("click", ".read-button", function () {
	var inventoryrId = $(this).data("inventoryno");
	localStorage.setItem("inventoryRNo", inventoryrId);
});

$(document).ready(function () {
	var sdateValue, edateValue, statusValue;

	// 監聽起始日期
	$("#startDate").on("change", function () {
		sdateValue = $(this).val();
	});

	// 監聽結束日期
	$("#endDate").on("change", function () {
		edateValue = $(this).val();
	});

	// 監聽狀態
	$("#status").on("change", function () {
		statusValue = $(this).val();
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

		if (statusValue) {
			filterData.status = statusValue;
		}

		if (sdateValue || edateValue || statusValue) {
			sendApiRequest(filterData);
		} else if (!statusValue) {
			fetchAccountList();
			// clearDateFields();
		}
	});

	function sendApiRequest(filterData) {
		showSpinner();
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminOrderApi'
		// 組裝菜單所需資料
		var action = "getInventoryList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminInventoryApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();
		var filterDataJSON = JSON.stringify(filterData);

		var postData = filterDataJSON;

		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				console.log(responseData);
				if (responseData.returnCode === "1") {
					updatePageWithData(responseData);
					hideSpinner();
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

function clearDateFields() {
	$("#startDate").val("");
	$("#endDate").val("");
}
