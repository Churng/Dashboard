// 取得列表
function fetchAccountList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminPurchaseApi'
	// 組裝菜單所需資料
	var action = "getPurchaseList";
	var chsmtoGetPurchaseList = user_session_id + action + "HBAdminPurchaseApi";
	var chsm = CryptoJS.MD5(chsmtoGetPurchaseList).toString().toLowerCase();

	$("#partsOrder").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/purchase`,
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

var table;
function updatePageWithData(responseData) {
	var dataTable = $("#partsOrder").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#partsOrder").DataTable({
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="purchaseDetail.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}" data-componentid="${row.componentId}">修改</a>`;

					var deleteButtonHtml = `<button class="btn btn-danger delete-button" style="display:none" data-button-type="delete" data-id="${row.id}">刪除</button>`;

					// var readButtonHtml = `<a href="manualDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="${row.id}">查看詳請</a>`;

					var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "id" },
			{ data: "createTime" },
			{ data: "createOperator" },
			{ data: "storeName" },
			{ data: "statusName" },
			{ data: "createTime" },
			{ data: "orderNo" },
			{ data: "componentId" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "brandName" },
			{ data: "suitableCarModel" },
			{ data: "wholesalePrice" },
			{ data: "lowestWholesalePrice" },
			{ data: "cost" },
			{ data: "workingHour" },
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

// 修改按鈕事件
$(document).on("click", ".modify-button", function () {
	var purchaseId = $(this).data("id");
	var componentId = $(this).data("componentid");

	localStorage.setItem("purchaseId", JSON.stringify(purchaseId));
	localStorage.setItem("componentId", JSON.stringify(componentId));
});

//更新數據
function refreshDataList() {
	var dataTable = $("#orderIndex").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	/// chsm = session_id+action+'HBAdminPurchaseApi'
	// 組裝菜單所需資料
	var action = "getPurchaseList";
	var chsmtoGetPurchaseList = user_session_id + action + "HBAdminPurchaseApi";
	var chsm = CryptoJS.MD5(chsmtoGetPurchaseList).toString().toLowerCase();

	$("#partsOrder").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/purchase`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			handleApiResponse(responseData);
			// console.log(responseData);
			updatePageWithData(responseData, table);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

//刪除檔案
$(document).on("click", ".delete-button", function () {
	var formData = new FormData(); // 在外部定义 formData

	var deleteButton = $(this); // 保存删除按钮元素的引用
	var itemId = deleteButton.data("id");

	var data = {
		id: JSON.stringify(itemId),
	};

	// 将对象转换为 JSON 字符串
	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true,
		timeOut: 3000,
		extendedTimeOut: 1,
		positionClass: "toast-top-center", // 设置提示位置
	};

	toastr.warning(
		"確定要刪除所選文件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		// 获取本地存储中的ID
		// 从localStorage中获取session_id和chsm
		// 解析JSON字符串为JavaScript对象
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminPurchaseApi'
		var action = "deletePurchaseDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminPurchaseApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		// 发送删除请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/purchase`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					setTimeout(function () {
						showSuccessFileDeleteNotification();
					}, 1000);

					refreshDataList();
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});

// 搜尋後清空
function clearDateFields() {
	$("#startDate").val("");
	$("#endDate").val("");
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
			console.log(responseData);
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

// 日期、狀態取得
// {"storeId":1,"status":1,"stime":"2023-10-13","etime":"2023-10-21"}

// 監聽欄位變動
$(document).ready(function () {
	var sdateValue, edateValue, storeValue, statusValue;

	// 監聽起始日期
	$("#startDate").on("change", function () {
		sdateValue = $(this).val();
	});

	// 監聽結束日期
	$("#endDate").on("change", function () {
		edateValue = $(this).val();
	});

	// 監聽門市
	$("#purchaseStore").on("change", function () {
		storeValue = $(this).val();
	});

	// 監聽狀態
	$("#purchaseStatus").on("change", function () {
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

		if (storeValue) {
			filterData.storeId = storeValue;
		}

		if (statusValue) {
			filterData.status = statusValue;
		}

		if (sdateValue || edateValue || storeValue || statusValue) {
			sendApiRequest(filterData);
		} else if (!statusValue || !storeValue) {
			fetchAccountList();
		}
	});

	function sendApiRequest(filterData) {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// console.log(user_session_id);
		// chsm = session_id+action+'HBAdminPurchaseApi'
		// 組裝菜單所需資料
		var action = "getPurchaseList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminPurchaseApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();
		var filterDataJSON = JSON.stringify(filterData);

		var postData = filterDataJSON;

		$("#orderIndex").DataTable();
		// 发送API请求以获取数据
		$.ajax({
			type: "POST",
			url: `${apiURL}/purchase`,
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
