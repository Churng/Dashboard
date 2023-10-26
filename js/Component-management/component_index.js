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
		url: "https://88bakery.tw/HBAdmin/index.php?/api/brand",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const brandList = document.getElementById("selectBrand");

			const defaultOption = document.createElement("option");
			defaultOption.text = "請選擇品牌";
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
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 列表取得
function fetchAccountList() {
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
		url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// 处理成功响应
			console.log("成功响应：", responseData);
			// 可以在这里执行其他操作
			updatePageWithData(responseData);
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

	// 填充API数据到表格，包括下载链接
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		var downloadButtonHtml = "";
		if (data.file) {
			// 如果data.file不为null，创建可以下载的按钮
			downloadButtonHtml =
				'<button download class="btn btn-primary file-download" data-file="' +
				data.file +
				'" data-fileName="' +
				data.fileName +
				'">下載</button>';
		} else {
			// 如果data.file为null，创建禁用的按钮
			downloadButtonHtml = '<button class="btn btn-primary" disabled>無法下載</button>';
		}

		var modifyButtonHtml =
			'<a href="5-partsmanagement_update.html" class="btn btn-primary text-white modify-button" data-id="' +
			data.id +
			'">修改</a>';
		var deleteButtonHtml = '<button class="btn btn-danger delete-button" data-id="' + data.id + '">刪除</button>';
		var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

		// 查看倉庫還未設置
		var goInventory = '<a href="#" class="btn btn-primary">點擊</a>';

		dataTable.row
			.add([
				goInventory,
				buttonsHtml,
				data.componentNumber,
				data.componentName,
				data.brandName,
				data.suitableCarModel,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.workingHour,
				data.purchaseAmount,
				data.depotAmount,
				data.totalCost,
				data.lowestInventory,
				data.createTime,
			])
			.draw(false);
	}
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

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getComponentList";
	var chsmtoGetComponentList = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentList).toString().toLowerCase();

	$("#partsManagement").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// 处理成功响应
			console.log("成功响应：", responseData);
			// 可以在这里执行其他操作
			updatePageWithData(responseData);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

//刪除檔案
// $(document).on("click", ".delete-button", function () {
// 	var formData = new FormData();
// 	var deleteButton = $(this);
// 	var itemId = deleteButton.data("id");

// 	var data = {
// 		id: JSON.stringify(itemId),
// 	};

// 	var jsonData = JSON.stringify(data);

// 	$(document).off("click", ".confirm-delete");

// 	toastr.options = {
// 		closeButton: true, // 显示关闭按钮
// 		timeOut: 0, // 不自动关闭
// 		extendedTimeOut: 0, // 不自动关闭
// 		positionClass: "toast-top-center", // 设置提示位置
// 	};

// 	toastr.warning(
// 		"確定要刪除所選文件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
// 		"確定刪除",
// 		{
// 			allowHtml: true,
// 		}
// 	);

// 	// 在此處註冊點擊事件以確認刪除
// 	$(document).on("click", ".confirm-delete", function () {
// 		// 从localStorage中获取session_id和chsm
// 		// 解析JSON字符串为JavaScript对象
// 		const jsonStringFromLocalStorage = localStorage.getItem("userData");
// 		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
// 		const user_session_id = gertuserData.sessionId;

// 		// 组装发送文件所需数据
// 		// chsm = session_id+action+'HBAdminComponentApi'
// 		var action = "deleteComponentDetail";
// 		var chsmtoDeleteFile = user_session_id + action + "HBAdminComponentApi";
// 		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

// 		// 取得localstorage資料
// 		// 将 JSON 字符串解析为 JSON 对象
// 		var selectedDataString = localStorage.getItem("selectedData");
// 		// var selectedData = JSON.parse(selectedDataString);

// 		// 设置其他formData字段
// 		formData.set("action", action);
// 		formData.set("session_id", user_session_id);

// 		formData.set("chsm", chsm);
// 		formData.set("data", jsonData);

// 		// 发送删除请求
// 		$.ajax({
// 			type: "POST",
// 			url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
// 			data: formData,
// 			processData: false,
// 			contentType: false,
// 			success: function (response) {
// 				setTimeout(function () {
// 					showSuccessFileDeleteNotification();
// 				}, 1000);

// 				refreshDataList();
// 			},
// 			error: function (error) {
// 				showErrorNotification();
// 			},
// 		});
// 	});
// });

//刪除按鈕:外部function
$(document).on("click", ".delete-button", function () {
	var deleteButton = $(this);
	var itemId = deleteButton.data("id");

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	deleteItem(
		"HBAdminShoppingCartApi",
		"deleteShoppingCartDetail",
		"https://88bakery.tw/HBAdmin/index.php?/api/shoppingCart",
		jsonData,
		function (response) {
			refreshDataList();
		},
		function (error) {
			// 处理错误情况
		}
	);
});

// 下載資料

$(document).on("click", ".file-download", function () {
	var fileName = $(this).data("file");
	var apiName = "component"; // 或其他你需要的 apiName
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
		// 创建筛选数据对象
		var filterData = {};

		if (selectedBrandId) {
			filterData.brandId = selectedBrandId;
		}

		// 发送API请求以获取数据
		sendApiRequest(filterData);
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
			url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				// 处理成功响应
				console.log("成功响应：", responseData);
				// 可以在这里执行其他操作
				updatePageWithData(responseData);
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	}
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});

// 或者在点击按钮时调用 fetchAccountList
$("#allBtn").on("click", function () {
	fetchAccountList();
});

//權限控制
$(document).ready(function () {
	handlePermissionControl();
});
