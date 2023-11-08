var idArray = []; // 取得每一筆項目的ID

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

			console.log(responseData);

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
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 列表取得
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminShoppingCartApi'

	// 組裝菜單所需資料
	var action = "getShoppingCartList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminShoppingCartApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#partsCar").DataTable();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData, "購物車");
			updatePageWithData(responseData);

			responseData.returnData.forEach(function (item) {
				idArray.push(item.id);
			});
			console.log(idArray);
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#partsCar").DataTable();
	dataTable.clear().draw();

	console.log(responseData);
	var totalPriceElement = document.getElementById("totalPrice");
	var totalPriceValue = responseData.totalPrice;
	totalPriceElement.value = totalPriceValue;

	var totalPriceAmountElement = document.getElementById("returnDataTotalAmount");
	var totalPriceAmountValue = responseData.returnDataTotalAmount;
	totalPriceAmountElement.textContent = totalPriceAmountValue;

	var selectBrandElement = document.getElementById("selectBrand");
	var selectBrandValue = responseData.brandName;
	selectBrandElement.value = selectBrandValue;

	// 填充API数据到表格，包括下载链接
	for (var i = 0; i < responseData.returnData.length; i++) {
		var data = responseData.returnData[i];

		var modifyButtonHtml =
			'<button class="btn btn-primary text-white modify-button" data-bs-toggle="modal" data-bs-target="#modifyModal" data-id="' +
			data.id +
			'">修改</button>';
		var deleteButtonHtml = '<button class="btn btn-danger delete-button" data-id="' + data.id + '">刪除</button>';
		var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

		dataTable.row
			.add([
				buttonsHtml,
				data.amount,
				data.depotAmount,
				data.componentNumber,
				data.componentName,
				data.suitableCarModel,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.cost,
				data.workingHour,
				data.statusName,
				data.updateTime,
				data.updateOperator,
				data.createTime,
				data.createOperator,
			])
			.draw(false);
	}
}

// 修改按钮点击事件处理程序
$(document).on("click", ".modify-button", function () {
	var itemId = $(this).data("id"); // 获取动态ID
	console.log(itemId);
	$("#confirmModifyButton").data("id", itemId);
});

// 修改数量
$("#confirmModifyButton").on("click", function () {
	// 获取用户输入的数量
	var quantity = $("#quantityInput").val();
	var itemId = $(this).data("id");

	console.log(quantity, itemId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const getUserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = getUserData.sessionId;

	// 组装发送文件所需数据
	// chsm = session_id+action+'HBAdminShoppingCartApi'
	var action = "updateShoppingCartDetail";
	var chsmtoPostFile = user_session_id + action + "HBAdminShoppingCartApi";
	var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

	var formData = new FormData();

	// 设置其他formData字段
	formData.append("action", action);
	formData.append("session_id", user_session_id);
	formData.append("chsm", chsm);

	var updateData = {
		amount: parseInt(quantity),
		id: String(itemId),
	};

	formData.append("data", JSON.stringify(updateData));

	console.log(JSON.stringify(updateData));
	// 将数据发送到服务器的API
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
		data: formData,
		processData: false, // 不处理数据
		contentType: false, // 不设置内容类型
		success: function (response) {
			console.log(response);
			$("#modifyModal").modal("hide");
			refreshDataList();
		},
		error: function (error) {
			// 处理错误响应
		},
	});
});

//更新數據
function refreshDataList() {
	var dataTable = $("#partsCar").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminShoppingCartApi'
	// 組裝菜單所需資料
	var action = "getShoppingCartList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminShoppingCartApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#partsCar").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
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

//刪除
$(document).on("click", ".delete-button", function () {
	var formData = new FormData(); // 在外部定义 formData

	var deleteButton = $(this); // 保存删除按钮元素的引用
	var itemId = deleteButton.data("id");

	var data = {
		id: itemId,
	};

	// 将对象转换为 JSON 字符串
	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true, // 显示关闭按钮
		timeOut: 0, // 不自动关闭
		extendedTimeOut: 0, // 不自动关闭
		positionClass: "toast-top-center", // 设置提示位置
	};

	toastr.warning(
		"確定要刪除所選項目嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
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
		// chsm = session_id+action+'HBAdminShoppingCartApi'
		var action = "deleteShoppingCartDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShoppingCartApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		// 发送删除请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/shoppingCart`,
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

//填寫訂單
$(document).ready(function () {
	var formData = new FormData();
	$("#addToOrder").click(function () {
		var idArrayString = idArray.map(function (id) {
			return id.toString();
		});

		// 解析JSON字符串为JavaScript对象
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminOrderApi'
		var action = "insertOrderDetail";
		var chsmtoPostFile = user_session_id + action + "HBAdminOrderApi";
		var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("shoppingCartId", JSON.stringify(idArrayString));

		$.ajax({
			type: "POST",
			url: `${apiURL}/order`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log(response);
				if (response.returnCode === "1") {
					showSuccessAddToOrderNotification();
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
