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
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// depot-列表取得
function fetchAccountList() {
	showSpinner();
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminDepotApi'
	// 組裝菜單所需資料
	var action = "getDepotList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminDepotApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#searchParts").DataTable();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/depot`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
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

var table;
// 表格填充
function updatePageWithData(responseData) {
	var dataTable = $("#searchParts").DataTable();
	dataTable.clear().destroy();

	var data = responseData.returnData;

	table = $("#searchParts").DataTable({
		columns: [
			{
				render: function (data, type, row) {
					var buttonsHtml = `<button class="add-shopCar btn btn-primary text-white" data-componentName="${row.componentName}" data-componentNumber="${row.componentNumber}" data-brandId="${row.brandId}" data-amount="1" data-componentId="${row.id}">加入購物車</button>`;
					return buttonsHtml;
				},
			},
			{
				render: function (data, type, row) {
					var downloadButtonHtml = "";
					if (row && row.hasOwnProperty("file") && row.file !== undefined) {
						downloadButtonHtml = `<button  class="btn btn-primary file-download" data-file="${row.file}" data-fileName="${row.fileName}">下載</button>`;
					} else {
						downloadButtonHtml = `<button class="btn btn-primary" disabled>無法下載</button>`;
					}
					return downloadButtonHtml;
				},
			},
			{
				data: "thumbnail",
				render: function (data, type, row) {
					return `<img src="${row.thumbnail}" alt="${row.id}" width="100" height="100">`;
				},
			},
			{ data: "depotAmount" },
			{ data: "componentName" },
			{ data: "componentNumber" },
			{ data: "suitableCarModel" },
			{ data: "price" },
			{ data: "wholesalePrice" },
			{ data: "lowestWholesalePrice" },
			{ data: "workingHour" },
		],
		drawCallback: function () {
			// handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
	});
	table.rows.add(data).draw();
}

//更新數據
function refreshDataList() {
	var dataTable = $("#searchParts").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#searchParts").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/brand`,
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

// 加入購物車
$(document).ready(function () {
	var formData = new FormData();
	$(".tableList").on("click", ".add-shopCar", function () {
		// 获取按钮上的 data 属性值
		var componentName = $(this).data("componentname");
		var componentId = $(this).data("componentid");
		var componentNumber = $(this).data("componentnumber");
		var brandId = $(this).data("brandid");
		var amount = 1; // 这里使用1，你可以根据需要更改

		// 构建包含要发送的数据的对象
		var postData = {
			componentName: componentName,
			componentId: componentId,
			componentNumber: componentNumber,
			brandId: brandId,
			amount: amount,
		};

		// 解析JSON字符串为JavaScript对象
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminShoppingCartApi'
		var action = "insertShoppingCartDetail";
		var chsmtoPostFile = user_session_id + action + "HBAdminShoppingCartApi";
		var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(postData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/shoppingCart`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessAddToCarNotification();
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

// 監聽欄位變動
$(document).ready(function () {
	var selectedBrandId, selectInventoryId, selectedsearchValue;

	// 監聽品牌
	$("#selectBrand").on("change", function () {
		selectedBrandId = $("#selectBrand").val();
	});

	// 監聽倉庫庫存
	$("#selectInventory").on("change", function () {
		selectInventoryId = $("#selectInventory").val();
	});

	// 監聽欄位填寫
	$("#SearchInput").on("input", function () {
		// 获取输入框的值
		selectedsearchValue = $(this).val().trim();
	});

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		// 创建筛选数据对象
		var filterData = {};
		var searchData = {};

		if (selectedBrandId) {
			filterData.brandId = selectedBrandId;
		}

		if (selectInventoryId) {
			filterData.ifGoods = selectInventoryId;
		}

		if (selectedsearchValue) {
			searchData.componentName = selectedsearchValue;
			searchData.componentNumber = selectedsearchValue;
			searchData.suitableCarModel = selectedsearchValue;
		}

		if (selectedBrandId || selectInventoryId || selectedsearchValue) {
			sendApiRequest(filterData, searchData);
		} else if (selectedBrandId || selectInventoryId) {
			sendApiRequest(filterData, {});
		} else if (!selectedBrandId || !selectInventoryId) {
			fetchAccountList();
		}
	});

	function sendApiRequest(filterData, searchData) {
		// 获取用户数据
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		console.log(user_session_id);
		// 设置API请求数据
		var action = "getDepotList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminDepotApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

		$("#searchParts").DataTable();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;

		var searchDataJSON = JSON.stringify(searchData);
		var postSearchData = searchDataJSON;

		var requestData = {
			session_id: user_session_id,
			action: action,
			chsm: chsm,
		};

		if (postData !== "{}" && postSearchData !== "{}") {
			requestData.data = postData;
			requestData.likeData = postSearchData;
		} else {
			if (postData !== "{}") {
				requestData.data = postData;
			}
			if (postSearchData !== "{}") {
				requestData.likeData = postSearchData;
			}
		}

		$.ajax({
			type: "POST",
			url: `${apiURL}/depot`,
			data: requestData,
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
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});

//下載檔案
$(document).on("click", ".file-download", function () {
	var fileName = $(this).data("file");
	var apiName = "component";
	if (fileName) {
		downloadFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});
