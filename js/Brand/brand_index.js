// 列表取得
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminBrandApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#brand-management").DataTable();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/brand",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			updatePageWithData(responseData);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#brand-management").DataTable();
	dataTable.clear().draw();

	// 填充API数据到表格，包括下载链接
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		var modifyButtonHtml = '<a href="brand_update.html?id=' + data.id + '" class="btn btn-primary text-white">修改</a>';
		var deleteButtonHtml = '<button class="btn btn-danger delete-button" data-id="' + data.id + '">刪除</button>';
		var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

		dataTable.row
			.add([buttonsHtml, data.brandName, data.brandOrder, data.statusName, data.createTime, data.createOperator])
			.draw(false);
	}
}

//更新數據
function refreshDataList() {
	var dataTable = $("#brand-management").DataTable();
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

	$("#brand-management").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/brand",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			updatePageWithData(responseData);
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
	console.log(itemId);

	var data = {
		id: JSON.stringify(itemId),
	};

	console.log(data);

	// 将对象转换为 JSON 字符串
	var jsonData = JSON.stringify(data);

	console.log(jsonData);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true, // 显示关闭按钮
		timeOut: 0, // 不自动关闭
		extendedTimeOut: 0, // 不自动关闭
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
		// chsm = session_id+action+'HBAdminBrandApi'
		var action = "deleteBrandDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminBrandApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		// 发送删除请求
		$.ajax({
			type: "POST",
			url: "https://88bakery.tw/HBAdmin/index.php?/api/brand",
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				setTimeout(function () {
					showSuccessFileDeleteNotification();
				}, 1000);

				refreshDataList();
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});