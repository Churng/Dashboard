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
			handleApiResponse(responseData);
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

	// chsm = session_id+action+'HBAdminShoppingCartApi'
	// 組裝菜單所需資料
	var action = "getShoppingCartList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminShoppingCartApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1") {
				updatePageWithData(responseData, table);

				responseData.returnData.forEach(function (item) {
					idArray.push(item.id);
				});
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
var table;
function updatePageWithData(responseData) {
	var dataTable = $("#partsCar").DataTable();
	dataTable.clear().destroy();
	dataTable.columns().visible(true);

	var data = responseData.returnData;

	var totalPriceElement = document.getElementById("totalPrice");
	var totalPriceValue = responseData.totalPrice;
	totalPriceElement.value = totalPriceValue;

	var totalPriceAmountElement = document.getElementById("returnDataTotalAmount");
	var totalPriceAmountValue = responseData.returnDataTotalAmount;
	totalPriceAmountElement.textContent = totalPriceAmountValue;

	var selectBrandElement = document.getElementById("selectBrand");
	var selectBrandValue = responseData.brandName;
	selectBrandElement.value = selectBrandValue;

	table = $("#partsCar").DataTable({
		autoWidth: false,
		columns: [
			{
				render: function (data, type, row) {
					var modifyButtonHtml = `<button class="btn btn-primary text-white modify-button" data-bs-toggle="modal" data-bs-target="#modifyModal" data-id="${row.id}">修改</button>`;

					var deleteButtonHtml = `<button class="btn btn-danger delete-button" style="display:none" data-button-type="delete"  data-id="${row.id}">刪除</button>`;

					var buttonsHtml = modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "amount" },
			{ data: "depotAmount" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "statusName" },
			{ data: "updateTime" },
			{ data: "updateOperator" },
			{ data: "createTime" },
			{ data: "createOperator" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
			var api = this.api();

			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				if (obj.price === "" || obj.price === undefined) {
					api.column(6).visible(false);
				} else {
					api.column(6).visible(true);
				}

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(9).visible(false);
				} else {
					api.column(9).visible(true);
				}

				if (obj.wholesalePrice === "" || obj.wholesalePrice === undefined) {
					api.column(7).visible(false);
				} else {
					api.column(7).visible(true);
				}

				if (obj.lowestWholesalePrice === "" || obj.lowestWholesalePrice === undefined) {
					api.column(8).visible(false);
				} else {
					api.column(8).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

// 修改按钮点击事件处理程序
$(document).on("click", ".modify-button", function () {
	var itemId = $(this).data("id"); // 获取动态ID
	$("#confirmModifyButton").data("id", itemId);
});

// 修改数量
$("#confirmModifyButton").on("click", function () {
	var quantity = $("#quantityInput").val();
	var itemId = $(this).data("id");

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

	// 将数据发送到服务器的API
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
			if (response.returnCode === "1") {
				$("#modifyModal").modal("hide");
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

//更新數據
function refreshDataList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminShoppingCartApi'
	// 組裝菜單所需資料
	var action = "getShoppingCartList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminShoppingCartApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/shoppingCart`,
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
					var orderId = response.orderNo;
					localStorage.setItem("orderNo", JSON.stringify(orderId));

					setTimeout(function () {
						var newPageUrl = "orderDetail.html";
						window.location.href = newPageUrl;
					}, 2000);
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
