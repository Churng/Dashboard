// 列表取得
function fetchAccountList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminReportApi'
	// 組裝菜單所需資料
	var action = "getOrderReportList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminReportApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// $("#orderIndex").DataTable();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/report`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
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

//取得門市資料
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStoreApi'
	// 組裝菜單所需資料
	var action = "getStoreList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminStoreApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/store`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const storeList = document.getElementById("purchaseStore");
			const defaultOption = document.createElement("option");
			defaultOption.text = "請選擇門市";
			defaultOption.value = "";
			storeList.appendChild(defaultOption);

			for (let i = 0; i < responseData.returnData.length; i++) {
				const store = responseData.returnData[i];
				const storeName = store.storeName;
				const storeId = store.id;

				const option = document.createElement("option");
				option.text = storeName;
				option.value = storeId;

				storeList.appendChild(option);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

//取得品牌清單、做權限篩選
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminBrandApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/brand`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const brandList = document.getElementById("selectBrand");

			const defaultOption = document.createElement("option");
			defaultOption.text = "請選擇品牌";
			defaultOption.value = "";
			brandList.appendChild(defaultOption);

			for (let i = 0; i < responseData.returnData.length; i++) {
				const brand = responseData.returnData[i];
				const brandName = brand.brandName;
				const brandId = brand.id;

				const option = document.createElement("option");
				option.text = brandName;
				option.value = brandId;

				brandList.appendChild(option);
			}

			if (responseData.returnData.length > 0) {
				brandList.selectedIndex = 1;
				// 获取选中的品牌ID
				selectedBrandId = brandList.value;

				// 触发API请求
				sendApiRequest({ brandId: selectedBrandId });
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#orderIndexReport").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#orderIndexReport").DataTable({
		autoWidth: false,
		columns: [
			{
				render: function (data, type, row) {
					return `<input type="checkbox" class="executeship-button" data-id="${row.id}">`;
				},
			},
			{ data: "orderNo" },
			{ data: "createTime" },
			{ data: "userName" },
			{ data: "storeName" },
			{ data: "statusName" },
			{ data: "brandName" },
			{ data: "remark" },
			{ data: "orderNote" },
			{ data: "orderRealPrice" },
			{ data: "orderTotalCost" },
			{ data: "amount" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

// 監聽欄位變動
$(document).ready(function () {
	var sdateValue, edateValue, statusValue, selectedBrandId, storeValue;

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
		console.log(statusValue);
	});

	// 監聽品牌
	$("#selectBrand").on("change", function () {
		selectedBrandId = $("#selectBrand").val();
	});

	// 監聽門市
	$("#purchaseStore").on("change", function () {
		storeValue = $(this).val();
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

		if (selectedBrandId) {
			filterData.brandId = selectedBrandId;
		}

		if (storeValue) {
			filterData.storeId = storeValue;
		}

		if (sdateValue || edateValue || statusValue || selectedBrandId || storeValue) {
			sendApiRequest(filterData);
		} else if (!statusValue) {
			fetchAccountList();
			clearDateFields();
		}
	});
});

function sendApiRequest(filterData) {
	showSpinner();
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminOrderApi'
	// 組裝菜單所需資料
	var action = "getOrderReportList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminReportApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();
	var filterDataJSON = JSON.stringify(filterData);

	var postData = filterDataJSON;

	$("#orderIndexReport").DataTable();
	// 发送API请求以获取数据
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

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
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
						orderNo: rowData.orderNo,
					};
					selectedData.push(item);
				}
			});

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "getOrderReportListCSV";
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
				let fileName = "訂單報表.csv";
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
