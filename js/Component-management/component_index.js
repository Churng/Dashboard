//取得品牌清單、做權限篩選
var selectedFirstBrandId;
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
				selectedFirstBrandId = brandList.value;

				// 触发API请求
				sendApiRequest({ brandId: selectedFirstBrandId });
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 列表取得：ALL
function fetchAccountList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

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

var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#partsManagement").DataTable();
	dataTable.clear().destroy();
	dataTable.columns().visible(true);

	var data = responseData.returnData;

	table = $("#partsManagement").DataTable({
		autoWidth: false,
		columns: [
			{
				render: function (data, type, row) {
					var goInventory = `<button type="button" class="btn btn-primary depot-button" data-id="${row.id}">點擊</button>`;

					return goInventory;
				},
			},
			{
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="componentDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}">修改</a>`;

					var deleteButtonHtml = `<button class="btn btn-danger delete-button" style="display:none" data-button-type="delete"  data-id="${row.id}">刪除</button>`;

					var readButtonHtml = `<a href="componentDetail_read.html" style="display:none" class="btn btn-warning text-white read-button" data-button-type="read"  data-id="${row.id}">查看詳請</a>`;

					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "brandName" },
			{ data: "suitableCarModel" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "purchaseAmount" },
			{ data: "depotAmount" },
			{ data: "totalCost", defaultContent: "" },
			{ data: "lowestInventory" },
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
					api.column(6).visible(false);
				} else {
					// 否則，顯示列
					api.column(6).visible(true);
				}

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(7).visible(false);
				} else {
					api.column(7).visible(true);
				}

				if (obj.wholesalePrice === "" || obj.wholesalePrice === undefined) {
					api.column(8).visible(false);
				} else {
					api.column(8).visible(true);
				}

				if (obj.lowestWholesalePrice === "" || obj.lowestWholesalePrice === undefined) {
					api.column(9).visible(false);
				} else {
					api.column(9).visible(true);
				}

				if (obj.totalCost === "" || obj.totalCost === undefined) {
					api.column(13).visible(false);
				} else {
					api.column(13).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});

// 查看詳請
$(document).on("click", ".read-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partRId", id);
});

// 零件轉倉庫
$(document).ready(function () {
	$(document).on("click", ".depot-button", function () {
		var id = $(this).data("id");
		window.location.href = "depotList.html?componentId=" + id;
	});
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
				updatePageWithData(responseData, table);
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
	var selectedBrandId = "";

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		var dataTable = $("#partsManagement").DataTable();
		dataTable.clear().draw();

		selectedBrandId = $("#selectBrand").val();
		if (selectedBrandId === "") {
			fetchAccountList();
			return;
		}

		// 创建筛选数据对象
		var filterData = {};

		if (!selectedBrandId && selectedFirstBrandId && selectedFirstBrandId !== "") {
			filterData.brandId = selectedFirstBrandId;
		} else if (selectedBrandId && selectedBrandId !== "") {
			filterData.brandId = selectedBrandId;
		}
		sendApiRequest(filterData);
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
				updatePageWithData(responseData, table);
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}
