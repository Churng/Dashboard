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
			handleApiResponse(responseData);
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

// 列表取得：ALL
function fetchAccountList() {
	showSpinner();
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminComponentApi'
	// 組裝菜單所需資料
	var action = "getComponentList";
	var chsmtoGetComponentList = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentList).toString().toLowerCase();

	$("#partsManagement").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				hideSpinner();
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
	var dataTable = $("#partsManagement").DataTable();
	dataTable.clear().draw();

	// 显示所有列
	dataTable.columns().visible(true);

	// 填充API数据到表格，包括下载链接
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		// console.log(data);

		// 按鈕設定//

		// var downloadButtonHtml = "";
		// if (data.file) {
		// 	// 如果data.file不为null，创建可以下载的按钮
		// 	downloadButtonHtml =
		// 		'<button download class="btn btn-primary file-download" data-file="' +
		// 		data.file +
		// 		'" data-fileName="' +
		// 		data.fileName +
		// 		'">下載</button>';
		// } else {
		// 	// 如果data.file为null，创建禁用的按钮
		// 	downloadButtonHtml = '<button class="btn btn-primary" disabled>無法下載</button>';
		// }

		var modifyButtonHtml =
			'<a href="5-partsmanagement_update.html" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="' +
			data.id +
			'">修改</a>';
		var deleteButtonHtml =
			'<button class="btn btn-danger delete-button"data-button-type="delete" data-id="' + data.id + '">刪除</button>';

		var readButtonHtml =
			'<a href="5-partsmanagement_update.html" style="display:none" class="btn btn-warning text-white read-button" data-button-type="read" data-id="' +
			data.id +
			'">查看</a>';

		var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml + "&nbsp;" + readButtonHtml;

		// 查看倉庫還未設置
		var goInventory = '<a href="#" class="btn btn-primary">點擊</a>';

		var row = [
			goInventory,
			buttonsHtml,
			data.componentNumber,
			data.componentName,
			data.brandName,
			data.suitableCarModel,
		];

		pushDataIfExists(data, "price", true, row);
		pushDataIfExists(data, "cost", true, row);
		pushDataIfExists(data, "wholesalePrice", true, row);
		pushDataIfExists(data, "lowestWholesalePrice", true, row);
		pushDataIfExists(data, "totalCost", true, row);

		row.push(data.workingHour, data.purchaseAmount, data.depotAmount, data.lowestInventory, data.createTime);
		setColumnVisibility(data, dataTable);
		dataTable.row.add(row).draw(false);
	}
}

// 欄位填充
function pushDataIfExists(data, field, showColumn, row) {
	var value = data.hasOwnProperty(field) ? data[field] : null;
	if (showColumn) {
		row.push(value !== null ? value : "");
	} else {
		row.push("");
	}
}

// 欄位可見
function setColumnVisibility(data, dataTable) {
	var columnsToCheck = ["price", "cost", "wholesalePrice", "lowestWholesalePrice", "totalCost"];

	columnsToCheck.forEach(function (columnName, index) {
		var isVisible = data.hasOwnProperty(columnName) && data[columnName] !== null;
		dataTable.column(index + 6).visible(isVisible);
	});
}

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});

//更新數據
function refreshDataList() {
	var dataTable = $("#partsManagement").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getComponentList";
	var chsmtoGetComponentList = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentList).toString().toLowerCase();

	$("#partsManagement").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
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

//刪除按鈕
$(document).on("click", ".delete-button", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var deleteButton = $(this);
	var itemId = deleteButton.data("id");

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	$(document).off("click", ".confirm-delete");
	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要刪除所選零件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	$(document).one("click", ".confirm-delete", function () {
		var confirmDeleteToast = toastr.info("删除中...", { timeOut: 0 });

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "deleteComponentDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminComponentApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		$.ajax({
			type: "POST",
			url: `${apiURL}/component`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				removeNotification(confirmDeleteToast);
				if (response.returnCode === "1") {
					refreshDataList();
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				removeNotification(confirmDeleteToast);
				showErrorNotification();
			},
			complete: function () {
				showSuccessFileDeleteNotification();
			},
		});
	});
});

function showDeletingNotification() {
	return toastr.info("删除中...", { timeOut: 0 });
}

// 删除完成
function showSuccessFileDeleteNotification() {
	toastr.success("删除完成");
}

// 移除提示
function removeNotification(toast) {
	toastr.clear(toast);
}

// 下載資料
$(document).on("click", ".file-download", function () {
	var fileName = $(this).data("file");
	var apiName = "component";
	if (fileName) {
		downloadFile(apiName, fileName);
	} else {
		showWarningFileNotification();
	}
});

// 監聽欄位變動
$(document).ready(function () {
	var selectedBrandId;

	// 監聽品牌
	$("#selectBrand").on("change", function () {
		selectedBrandId = $("#selectBrand").val();
	});

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		var dataTable = $("#partsManagement").DataTable();
		dataTable.clear().draw();

		// 创建筛选数据对象
		var filterData = {};

		var selectedBrand = $("#selectBrand").val();

		if (!selectedBrand) {
			fetchAccountList();
		} else {
			var filterData = {};
			filterData.brandId = selectedBrand;
			sendApiRequest(filterData);
		}
	});
});

// 创建一个函数，发送API请求以获取数据
function sendApiRequest(filterData) {
	// 获取用户数据
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminComponentApi'
	// 組裝菜單所需資料
	var action = "getComponentList";
	var chsmtoGetComponentList = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentList).toString().toLowerCase();

	var filterDataJSON = JSON.stringify(filterData);
	var postData = filterDataJSON;

	$("#partsManagement").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
		data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
		success: function (responseData) {
			console.log(responseData);
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
