function fetchAccountList() {
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminReportApi'
	// 組裝菜單所需資料
	var action = "getInventoryReportList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminReportApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/report`,
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
	var dataTable = $("#inventoryReport").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#inventoryReport").DataTable({
		autoWidth: false,

		responsive: true,
		columns: [
			{
				render: function (data, type, row) {
					return `<input type="checkbox" class="executeship-button" data-id="${row.id}">`;
				},
			},
			{ data: "inventoryNo" },
			{ data: "userName" },
			{ data: "createTime" },
			{ data: "updateTime" },
			{ data: "depotPosition" },
			{ data: "componentId" },
			{ data: "brandName" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "inventoryTotalAmount" },
			{ data: "depotTotlaAmount" },
			{ data: "totalAmountDiff" },
			{ data: "inventoryTotalCost" },
			{ data: "depotTotalCost" },
			{ data: "totalCostDiff" },
			{ data: "warehouseLocation" },
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

		if (sdateValue || edateValue) {
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
		var action = "getInventoryReportList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminReportApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();
		var filterDataJSON = JSON.stringify(filterData);

		var postData = filterDataJSON;

		$.ajax({
			type: "POST",
			url: `${apiURL}/report`,
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

//下載全選功能
$(document).ready(function () {
	// 全选功能
	function selectAllCheckboxes() {
		var allRows = table.rows().nodes();
		$(allRows).find(".executeship-button").prop("checked", true);
	}

	// 取消全选功能
	function cancelAllCheckboxes() {
		var allRows = table.rows().nodes();
		$(allRows).find(".executeship-button").prop("checked", false);
	}

	// 下载选定数据
	function downloadSelectedData() {
		var selectedData = [];

		table
			.rows()
			.nodes()
			.each(function (node) {
				var checkbox = $(node).find(".executeship-button");
				if (checkbox.prop("checked")) {
					var rowData = table.row(node).data();
					var item = {
						inventoryNo: rowData.inventoryNo,
						componentId: rowData.componentId,
						warehouseLocation: rowData.warehouseLocation,
					};
					selectedData.push(item);
				}
			});

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "getInventoryReportListCSV";
		var chsmtoGetManualList = user_session_id + action + "HBAdminReportApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

		// 使用 jQuery 的 AJAX 请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/report`,
			data: {
				session_id: user_session_id,
				action: action,
				chsm: chsm,
				csvIndex: JSON.stringify(selectedData),
			},
			xhrFields: {
				responseType: "blob", // 指定响应类型为 blob
			},
			success: function (blob, status, xhr) {
				// 从响应头中提取文件名
				const disposition = xhr.getResponseHeader("Content-Disposition");
				let fileName = "盤點報表.csv";
				if (disposition && disposition.indexOf("attachment") !== -1) {
					const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
					if (matches != null && matches[1]) fileName = matches[1].replace(/['"]/g, "");
				}

				// 创建一个 URL 并下载
				const url = window.URL.createObjectURL(blob);
				const a = document.createElement("a");
				a.style.display = "none";
				a.href = url;
				a.download = fileName;
				document.body.appendChild(a);
				a.click();
				window.URL.revokeObjectURL(url);
				document.body.removeChild(a);
			},
			error: function (error) {
				console.error("API request failed:", error);
				showErrorNotification();
			},
		});
	}

	$("#allSelectdBtn").on("click", function () {
		selectAllCheckboxes();
	});

	$("#donloadBtn").on("click", function () {
		downloadSelectedData();
	});

	$("#cancelallSelectdBtn").on("click", function () {
		cancelAllCheckboxes();
	});
});
