// 取得詳細資料
let orderStatus;
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
			console.log(responseData);
			handleApiResponse(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				var status = responseData.orderData;
				orderStatus = status.status;
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
	console.log(responseData);
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

	var orderLog = orderData.orderLog;

	var updateTime = orderData.updateTime;
	var updateOperator = orderData.updateOperator;

	const orderLogArray = orderData.orderLog;
	actionNote = "";
	if (orderLogArray.length > 0) {
		orderLog.forEach((logItem, index) => {
			actionNote = logItem.actionNote;
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
	$("#orderLog").val(actionNote);

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
		var checkboxHtml = "";
		if (data.status == 3) {
			var checkboxHtml = '<input type="checkbox" class="your-checkbox-class" data-id="' + data.id + '">';
		}

		// 刪除零件：
		var deleteButtonHtml = "";
		if (data.status == 1 || data.status == 2 || data.status == 3) {
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
		if (data.status == 3 && data.statusName == "已出庫") {
			if (data.if_order_unsubscribe === true) {
				unsubButtonHtml +=
					'<button class="btn btn-warning unsubscribe-button" data-id="' + data.id + '" >退貨</button>';
			}
		}

		var buttonsHtml = deleteButtonHtml + "&nbsp;" + unsubButtonHtml;
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
	var formData = new FormData(); // 在外部定义 formData

	var unsubscribeButton = $(this);
	var itemId = unsubscribeButton.data("id");
	console.log(itemId, buttonStatus);

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning("確定要執行退貨嗎？<br/><br><button class='btn btn-danger confirm-delete'>確定</button>", "確定退貨", {
		allowHtml: true,
	});

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminOrderApi'
		var action = "unsubscribeOrderDetailComponent";
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
				showSuccessorderunSubscribeNotification();
				refreshDataList();
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
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要完成訂單嗎？<br/><br><button class='btn btn-danger confirm-delete'>確定</button>",
		"確定完成訂單",
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
	var formData = new FormData(); // 在外部定义 formData

	var partId = localStorage.getItem("orderNo");
	var orderData = JSON.parse(partId);
	const dataId = { orderNo: orderData };
	const IdPost = JSON.stringify(dataId);

	var jsonData = IdPost;

	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要取消訂單嗎？<br/><br><button class='btn btn-danger confirm-delete'>確定</button>",
		"確定取消訂單",
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
