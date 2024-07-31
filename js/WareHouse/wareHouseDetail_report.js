// 取得列表
function fetchAccountList() {
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStockInApi'
	// 組裝菜單所需資料
	var action = "getStockInReportList";
	var chsmtoGetStockListList = user_session_id + action + "HBAdminReportApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockListList).toString().toLowerCase();

	$("#stockInReport").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/report`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
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
			const storeList = document.getElementById("wareReportStore");
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
				// sendApiRequest({ brandId: selectedBrandId });
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充'
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockInReport").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#stockInReport").DataTable({
		columns: [
			{
				render: function (data, type, row) {
					return `<input type="checkbox" class="executeship-button" data-id="${row.id}">`;
				},
			},
			{ data: "id" },
			{ data: "createTime" },
			{ data: "userName" },
			{ data: "storeName" },
			{ data: "statusName" },
			{ data: "typeName" },

			{
				render: function (data, type, row) {
					if (row.type === "1") {
						return "";
					} else if (row.type === "2") {
						return row.unsubscribeId;
					} else if (row.type === "3") {
						return row.inventoryId;
					}
					return "";
				},
			},

			{ data: "remark" },
			{ data: "amount" },
			{ data: "componentNumber" },
			{ data: "brandName" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "componentSupplier" },
			{ data: "depotPosition" },
			{ data: "description" },
			{ data: "precautions" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);

			var api = this.api();

			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				// 如果對象的特定鍵的值為空，則隱藏列
				if (obj.price === "" || obj.price === undefined) {
					api.column(14).visible(false);
				} else {
					// 否則，顯示列
					api.column(14).visible(true);
				}

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(17).visible(false);
				} else {
					api.column(17).visible(true);
				}

				if (obj.wholesalePrice === "" || obj.wholesalePrice === undefined) {
					api.column(15).visible(false);
				} else {
					api.column(15).visible(true);
				}

				if (obj.lowestWholesalePrice === "" || obj.lowestWholesalePrice === undefined) {
					api.column(16).visible(false);
				} else {
					api.column(16).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

// 監聽日期選擇
$(document).ready(function () {
	var sdateValue, edateValue, storeValue, selectedBrandId, statusValue, typeValue;

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
		selectedBrandId = $(this).val();
	});

	// 監聽門市
	$("#wareReportStore").on("change", function () {
		storeValue = $(this).val();
	});

	// 監聽來源類型
	$("#type").on("change", function () {
		typeValue = $(this).val();
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

		if (typeValue) {
			filterData.type = typeValue;
		}

		if (sdateValue || edateValue || statusValue || selectedBrandId || storeValue || typeValue) {
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

	// chsm = session_id+action+'HBAdminStockInApi'
	// 組裝菜單所需資料
	var action = "getStockInReportList";
	var chsmtoGetStockListList = user_session_id + action + "HBAdminReportApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockListList).toString().toLowerCase();

	var filterDataJSON = JSON.stringify(filterData);
	var postData = filterDataJSON;

	$("#stockInReport").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/report`,
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

function clearDateFields() {
	$("#startDate").val("");
	$("#endDate").val("");
}

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	showSpinner();
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
						id: rowData.id,
					};
					selectedData.push(item);
				}
			});

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "getStockInReportListCSV";
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
				let fileName = "入庫單報表.csv";
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
