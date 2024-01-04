// 取得列表
var table;
function fetchAccountList() {
	showSpinner();
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStocksApi'
	// 組裝菜單所需資料
	var action = "getStocksList";
	var chsmtoGetStockList = user_session_id + action + "HBAdminStocksApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockList).toString().toLowerCase();

	// 檢查表格是否已初始化，如果已初始化則先銷毀它
	if ($.fn.DataTable.isDataTable("#depotList")) {
		$("#depotList").DataTable().destroy();
	}

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/stocks`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1") {
				updatePageWithData(responseData, table);
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

function updatePageWithData(responseData) {
	var totalAmounteElement = document.getElementById("depotNum");
	var totalAmounteValue = responseData.returnDataTotalAmount;
	totalAmounteElement.value = totalAmounteValue;

	var depotNumElement = document.getElementById("totalAmount");
	var depotNumValue = responseData.returnTotalCost;
	depotNumElement.value = depotNumValue;

	var dataTable = $("#depotList").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#depotList").DataTable({
		autoWidth: false,
		columns: [
			{
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="depotComponentDetail.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}">修改</a>`;
					var readButtonHtml = `<a href="depotComponentDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="${row.id}">查看詳請</a>`;
					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml;
					return buttonsHtml;
				},
			},
			{ data: "id" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "brandName" },
			{ data: "suitableCarModel" },
			{ data: "orderNo" },
			{ data: "storeName" },
			{ data: "orderNote" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "depotPosition" },
			{ data: "statusName" },
			{ data: "createTime" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
			var api = this.api();

			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				// 如果對象的特定鍵的值為空，則隱藏列
				if (obj.price === "" || obj.price === undefined) {
					api.column(9).visible(false);
				} else {
					// 否則，顯示列
					api.column(9).visible(true);
				}

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(10).visible(false);
				} else {
					api.column(10).visible(true);
				}

				if (obj.wholesalePrice === "" || obj.wholesalePrice === undefined) {
					api.column(11).visible(false);
				} else {
					api.column(11).visible(true);
				}

				if (obj.lowestWholesalePrice === "" || obj.lowestWholesalePrice === undefined) {
					api.column(12).visible(false);
				} else {
					api.column(12).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});

	table.clear().rows.add(data).draw();
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
});
function sendApiRequest(filterData) {
	showSpinner();
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

	// $("#depotList").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/stocks`,
		data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				if (responseData.returnData.length > 0) {
					updatePageWithData(responseData, table);
					hideSpinner();
				} else {
					shownoDataNotification();
				}
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}
// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var componentId = urlParams.get("componentId");

	if (componentId) {
		var filterData = {
			ifOrderNo: 1,
			status: 1,
			componentId: componentId,
		};

		sendApiRequest(filterData);
	} else {
		fetchAccountList();
	}
});
