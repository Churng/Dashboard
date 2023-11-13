// 取得詳細資料
let orderStatus;
let orderId;
$(document).ready(function () {
	var partId = localStorage.getItem("orderNo");
	var orderData = JSON.parse(partId);
	const dataId = { orderNo: orderData };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminOrderApi'
	// 组装所需数据
	var action = "getOrderDetail";
	var chsmtoGetOrderDetail = user_session_id + action + "HBAdminOrderApi";
	var chsm = CryptoJS.MD5(chsmtoGetOrderDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/order`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			handleApiResponse(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				var getOrderData = responseData.orderData;
				orderStatus = getOrderData.status;
				orderId = getOrderData.id;
				console.log(responseData);
				updateData(responseData);
				updatePageWithData(responseData);
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

//表單內資料：單據詳細資料
function updateData(responseData) {
	// console.log(responseData);
	// var partId = localStorage.getItem("orderNo");
	// var partId = JSON.parse(partId);
	const orderData = responseData.orderData;

	var orderId = orderData.id;
	var orderNo = orderData.orderNo;
	var statusName = orderData.statusName;
	var createTime = orderData.createTime;
	var createOperator = orderData.createOperator;
	var storeName = orderData.storeName;
	var brandName = orderData.brandName;
	var orderNote = orderData.orderNote;
	var orderRemark = orderData.orderRemark;
	var totalPrice = responseData.totalPrice;

	var updateTime = orderData.updateTime;
	var updateOperator = orderData.updateOperator;

	const orderLogArray = orderData.orderLog;
	var actionNotesText = "";

	if (orderLogArray.length > 0) {
		orderLogArray.forEach((logItem, index) => {
			actionNotesText += `[${logItem.actionNote}\n`;
		});
	}

	// 填充表单元素的值
	$("#orderId").val(orderId);
	$("#orderNo").val(orderNo);
	$("#createOperator").val(createOperator);
	$("#storeName").val(storeName);
	$("#statusName").val(statusName);
	$("#orderAmount").val(totalPrice);
	$("#brandName").val(brandName);
	$("#orderNote").val(orderNote);
	$("#orderRemark").val(orderRemark);
	$("#orderLog").val(actionNotesText);

	$("#BuildTime").val(createTime);
	$("#EditTime").val(updateTime);
	$("#EditAccount").val(updateOperator);

	// 填充完毕后隐藏加载中的spinner
	$("#spinner").hide();
}

//底下表格內資料：購物單零件們
function updatePageWithData(responseData) {
	// console.log(responseData);
	// 清空表格数据
	var dataTable = $("#orderDetail").DataTable();
	dataTable.clear().draw();

	// 填充API数据到表格，包括下载链接
	responseData.returnData.forEach(function (data) {
		//checkbox顯示：狀態在庫（3）
		//出庫單選取
		var checkboxHtml = "";
		if (data.status == 3) {
			var checkboxHtml = '<input type="checkbox" class="executeship-button" data-id="' + data.id + '">';
		}

		// 刪除零件：
		var deleteButtonHtml = "";
		if (data.status == 1 || data.status == 2 || data.status == 3 || data.status == 4 || data.status == 5) {
			if (data.if_order_delete_component === true) {
				deleteButtonHtml +=
					'<button class="btn btn-danger delete-button" data-id="' +
					data.id +
					'" data-status="' +
					data.status +
					'">刪除零件</button>';
			}
		}

		// 退貨：退貨單新增
		var unsubButtonHtml = "";
		if (data.status == 6 && data.statusName == "已出庫") {
			if (data.if_order_unsubscribe === true) {
				unsubButtonHtml +=
					'<button  class="btn btn-warning unsubscribe-button" data-id="' + orderId + '" >退貨</button>';
			}
		}

		//查看出庫單
		// if_shipDetail = true
		// shipId

		var shipButtonHtml = "";
		if ((data.if_shipDetail = true)) {
			shipButtonHtml +=
				'<a href="shipDetail.html"  class="btn btn-primary text-white "  data-id="' + data.id + '">查看出庫單</a>';
		}

		//查看零件採購單
		//if_purchaseDetail =true
		//purchaseId

		var purchaseButtonHtml = "";
		if ((data.if_purchaseDetail = true)) {
			purchaseButtonHtml +=
				'<a href="purchaseDetail.html"  class="btn btn-info text-white purchase-button "  data-id="' +
				data.id +
				'">查看零件採購</a>';
		}

		var buttonsHtml =
			deleteButtonHtml + "&nbsp;" + unsubButtonHtml + "&nbsp;" + shipButtonHtml + "&nbsp;" + purchaseButtonHtml;
		dataTable.row
			.add([
				checkboxHtml,
				buttonsHtml,
				data.componentId,
				data.componentNumber,
				data.componentName,
				data.suitableCarModel,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.cost,
				data.workingHour,
				data.depotPosition,
				data.statusName,
				data.orderLog,
			])
			.draw(false);
	});
}
// 查看零件採購單
$(document).on("click", ".purchase-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("purchaseId", id);
});

//更新數據
function refreshDataList() {
	var dataTable = $("#orderDetail").DataTable();
	dataTable.clear().draw();

	var partId = localStorage.getItem("orderNo");
	var orderData = JSON.parse(partId);
	const dataId = { orderNo: orderData };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminOrderApi'
	// 组装所需数据
	var action = "getOrderDetail";
	var chsmtoGetOrderDetail = user_session_id + action + "HBAdminOrderApi";
	var chsm = CryptoJS.MD5(chsmtoGetOrderDetail).toString().toLowerCase();

	$("#orderDetail").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/order`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			handleApiResponse(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				updateData(responseData);
				updatePageWithData(responseData);
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

//刪除零件
$(document).on("click", ".delete-button", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	var deleteButton = $(this); // 保存删除按钮元素的引用
	var itemId = deleteButton.data("id");
	var buttonStatus = event.target.getAttribute("data-status");
	console.log(itemId, buttonStatus);

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		// 根据按钮的状态值执行不同的提示
		if (buttonStatus == 1) {
			showgoPurchaseNotification();
		} else if (buttonStatus == 2) {
			showSuccessAddToOrderNotification();
		} else if (buttonStatus == 3) {
			showgoshipDetailNotification();
		}
	});

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center", // 设置提示位置
	};

	toastr.warning(
		"確定要刪除所選零件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminOrderApi'
		var action = "deleteOrderDetailComponent";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminOrderApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		$.ajax({
			type: "POST",
			url: `${apiURL}/order`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				handleApiResponse(response);
				showSuccessFileDeleteNotification();
				refreshDataList();
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

//unsubscribe-button
//退貨
$(document).on("click", ".unsubscribe-button", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var unsubscribeButton = $(this);
	var itemId = unsubscribeButton.data("id"); //orderId
	localStorage.setItem("getOrderId", itemId);

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-unsubscribe");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要執行退貨嗎？<br/><br><button class='btn btn-danger confirm-unsubscribe'>確定</button>",
		"確定退貨",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminUnsubscribeApi'
		var action = "getUnsubscribeDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);
		$.ajax({
			type: "POST",
			url: `${apiURL}/unsubscribe`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				handleApiResponse(response);
				console.log(response);
				setTimeout(function () {
					showSuccessorderunSubscribeNotification();
				}, 1000);
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

//orderComplete
//訂單完成
$(document).on("click", "#orderComplete", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData
	if (orderStatus == 3) {
		showSuccessorderCompleteNotification();
		return;
	}

	console.log(orderStatus);

	var partId = localStorage.getItem("orderNo");
	var orderData = JSON.parse(partId);
	const dataId = { orderNo: orderData };
	const IdPost = JSON.stringify(dataId);

	var jsonData = IdPost;

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-order");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要完成訂單嗎？<br/><br><button class='btn btn-danger confirm-order'>確定</button>",
		"確定完成訂單",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-order", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminOrderApi'
		var action = "completeAllOrder";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminOrderApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		$.ajax({
			type: "POST",
			url: `${apiURL}/order`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				handleApiResponse(response);
				showSuccessorderCompleteNotification();
				refreshDataList();
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

//orderCancel
//訂單取消
$(document).on("click", "#orderCancel", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	var partId = localStorage.getItem("orderNo");
	var orderData = JSON.parse(partId);
	const dataId = { orderNo: orderData };
	const IdPost = JSON.stringify(dataId);

	var jsonData = IdPost;

	$(document).off("click", ".confirm-cancel");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要取消訂單嗎？<br/><br><button class='btn btn-danger confirm-cancel'>確定</button>",
		"確定取消訂單",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-cancel", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminOrderApi'
		var action = "cancelAllOrder";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminOrderApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		console.log(formData);

		$.ajax({
			type: "POST",
			url: `${apiURL}/order`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				handleApiResponse(response);
				showSuccessorderCancelNotification();
				refreshDataList();
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

//執行出庫
// if_order_execute_ship = true
$(document).on("click", "#orderExecuteShip", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var checkboxes = document.querySelectorAll(".executeship-button:checked");

	var selectedIds = [];
	checkboxes.forEach(function (checkbox) {
		selectedIds.push(checkbox.getAttribute("data-id"));
	});

	var formattedData = JSON.stringify(selectedIds);
	console.log(formattedData);

	$(document).off("click", ".confirm-execute");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要出庫選取零件嗎？<br/><br><button class='btn btn-danger confirm-execute'>確定</button>",
		"確定出庫零件",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-execute", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		console.log(user_session_id);
		// chsm = session_id+action+'HBAdminShipApi'
		var action = "insertShipDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		console.log(chsm);

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("orderIdList", formattedData);

		$.ajax({
			type: "POST",
			url: `${apiURL}/ship`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				showSuccessshipdetail();
				refreshDataList();
			},
			error: function (error) {
				handleApiResponse(response);
			},
		});
	});
});

$(document).on("click", "#saveBtn", function (e) {
	window.history.back();
});
