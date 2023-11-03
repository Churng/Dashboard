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

		// 權限設定 //

		var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		var currentUrl = window.location.href;
		handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

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
		url: `${apiURL}/component`,
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
		`${apiURL}/shoppingCart`,
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

// 或者在点击按钮时调用 fetchAccountList
$("#allBtn").on("click", function () {
	fetchAccountList();
});
