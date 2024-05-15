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

// 表格填充'
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockIn").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;
	console.log(data);

	table = $("#stockIn").DataTable({
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="wareHouseDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}" data-componentid="${row.componentId}">修改</a>`;

					var deleteButtonHtml = `<button class="btn btn-danger delete-button" style="display:none" data-button-type="delete" data-id="${row.id}" data-filename="${row.fileName}">刪除</button>`;

					var readButtonHtml = `<a href="wareHouseDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="${row.id}">查看詳請</a>`;

					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "id" },
			{ data: "createTime" },
			{ data: "createOperator" },
			{ data: "amount" },
			{ data: "componentSupplier" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "brandName" },
			{ data: "suitableCarModel" },
			{ data: "price" },
			{ data: "wholesalePrice" },
			{ data: "lowestWholesalePrice" },
			{ data: "cost" },
			{ data: "workingHour" },
			{ data: "statusName" },
			{ data: "typeName" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
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

	// 監聽狀態
	$("#type").on("change", function () {
		statusValue = $(this).val();
		console.log(statusValue);
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
			filterData.type = statusValue;
		}

		if (sdateValue || edateValue || statusValue) {
			sendApiRequest(filterData);
		} else if (!statusValue) {
			fetchAccountList();
			clearDateFields();
		}
	});

	function sendApiRequest(filterData) {
		showSpinner();
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

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

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var cid = $(this).data("componentid");
	var id = $(this).data("id");

	localStorage.setItem("componentId", cid);
	localStorage.setItem("wareHouseId", id);
});

// 查看詳請按鈕
$(document).on("click", ".read-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("whRId", id);
});

// Modal點擊跳轉頁面
$(document).ready(function () {
	$("#confirm").click(function () {
		var inputValue = $("#componentId").val();
		localStorage.setItem("componentBarcodeValue", inputValue);
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
