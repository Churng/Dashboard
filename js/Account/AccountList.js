//取得商店資料、存取ID
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
			const storeList = document.getElementById("A-shoplist");

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

// 取得權限資料、存取ID
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAuthorizeApi'
	// 組裝菜單所需資料
	var action = "getAuthorizeList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminAuthorizeApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/authorize`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const rolleList = document.getElementById("A-auth");

			const defaultOption = document.createElement("option");
			defaultOption.text = "請選擇角色";
			defaultOption.value = "";
			rolleList.appendChild(defaultOption);

			for (let i = 0; i < responseData.returnData.length; i++) {
				const roll = responseData.returnData[i];
				const rollName = roll.authorizeName;
				const rollId = roll.id;
				const option = document.createElement("option");

				option.text = rollName;
				option.value = rollId;

				rolleList.appendChild(option);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 監聽欄位變動
$(document).ready(function () {
	var selectedShopId, selectedAuthId, selectedStatus;

	// 监听选择门市的变化
	$("#A-shoplist").on("change", function () {
		selectedShopId = $("#A-shoplist").val();
	});

	// 监听选择角色的变化
	$("#A-auth").on("change", function () {
		selectedAuthId = $("#A-auth").val();
	});

	// 监听选择状态的变化
	$("#A-status").on("change", function () {
		selectedStatus = $("#A-status").val();
	});

	// 点击搜索按钮时触发API请求
	$("#searchBtn").on("click", function () {
		// 创建筛选数据对象
		var filterData = {};

		if (selectedShopId) {
			filterData.storeId = selectedShopId;
		}

		if (selectedAuthId) {
			filterData.authorizeId = selectedAuthId;
		}

		if (selectedStatus) {
			filterData.status = selectedStatus;
		}

		if (selectedShopId || selectedAuthId || selectedStatus) {
			sendApiRequest(filterData);
		} else if (!statusValue) {
			fetchAccountList();
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

		// 设置API请求数据
		var action = "getAccountList";
		var chsmtoGetAccountList = user_session_id + action + "HBAdminAccountApi";
		var chsm = CryptoJS.MD5(chsmtoGetAccountList).toString().toLowerCase();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;
		$("#accountList").DataTable();
		// 发送API请求以获取数据
		$.ajax({
			type: "POST",
			url: `${apiURL}/account`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				// 处理成功响应
				console.log("成功响应：", responseData);
				updatePageWithData(responseData);
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	}
});

// //取帳號列表
function fetchAccountList() {
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAccountApi'
	// 組裝菜單所需資料
	var action = "getAccountList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminAccountApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#accountList").DataTable();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/account`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// 处理成功响应
			console.log("成功响应：", responseData);
			updatePageWithData(responseData);
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

// 或者在点击按钮时调用 fetchAccountList
$("#allBtn").on("click", function () {
	fetchAccountList();
});

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#accountList").DataTable();
	dataTable.clear().draw();

	// 填充API数据到表格，包括下载链接
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		// 權限設定 //

		// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		// var currentUrl = window.location.href;
		// handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

		var modifyButtonHtml =
			'<a href="8-account-update.html" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="' +
			data.id +
			'">修改</a>';

		var readButtonHtml =
			'<a href="8-account-update.html" style="display:none" class="btn btn-warning text-white" data-button-type="read" data-id="' +
			data.id +
			'">查看</a>';

		var buttonsHtml = modifyButtonHtml + "&nbsp;" + readButtonHtml;

		var statusText = data.status === "0" ? "停用" : "正常";

		dataTable.row
			.add([
				buttonsHtml,
				data.account,
				data.userName,
				data.storeName,
				data.email,
				data.phoneNumber,
				data.authorizeName,
				statusText,
				data.createTime,
			])
			.draw(false);
	}
}

$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});
