// 取得詳細資料
let orderStatus;
let orderId;
let orderNo;
function fetchAccountList() {
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
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				var getOrderData = responseData.orderData;
				orderStatus = getOrderData.status;
				orderId = getOrderData.id;
				orderNo = getOrderData.orderNo;

				var getreturnData = responseData.returnData;

				//禁用執行出庫按鈕
				var allFalse = getreturnData.every(function (item) {
					return item.if_order_execute_ship === false;
				});
				if (allFalse) {
					document.getElementById("orderExecuteShip").disabled = true;
				}

				// var orderComplete = document.getElementById("orderComplete");
				// if (orderStatus == 3 || orderStatus == 4) {
				// 	orderComplete.disabled = true;
				// 	return;
				// } else {
				// 	orderComplete.disabled = false;
				// }

				updateData(responseData);
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
	var orderRemark = orderData.remark;
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

var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#orderDetail").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;
	console.log(data);
	table = $("#orderDetail").DataTable({
		autoWidth: false,
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					//checkbox顯示：狀態在庫（3）
					//出庫單選取
					var checkboxHtml = "";

					if (row.status === "3") {
						// 如果数组不为空且第一个对象的状态值为 3，返回特定的 HTML
						return `<input type="checkbox" class="executeship-button" data-id="${row.id}">`;
					} else {
						return checkboxHtml;
					}
				},
			},
			{
				// Buttons column
				render: function (data, type, row) {
					// Boolean(data.if_order_delete_component)
					// 刪除零件：
					var deleteButtonHtml = "";
					if (row.status == 1 || row.status == 2 || row.status == 3 || row.status == 4 || row.status == 5) {
						if (Boolean(row.if_order_delete_component) === true) {
							deleteButtonHtml += `<button class="btn btn-danger delete-button" data-id="${row.id}" data-status="${row.status}">刪除零件</button>`;
						}
					}

					// 退貨：退貨單新增
					var unsubButtonHtml = "";
					if (row.status == 6 && row.statusName === "已出庫") {
						if (Boolean(row.if_order_unsubscribe) === true) {
							unsubButtonHtml += `<button  class="btn btn-warning unsubscribe-button" data-id="${row.id}">退貨</button>`;
						}
					}

					//查看出庫單
					// if_shipDetail = true
					// shipNo

					var shipButtonHtml = "";
					if (Boolean(row.if_shipDetail) === true) {
						shipButtonHtml += `<button  class="btn btn-primary text-white ship-button"  data-id="${row.id}" data-shipno="${row.shipNo}"
							>查看出庫單</button>`;
					}

					//查看零件採購單
					//if_purchaseDetail =true
					//purchaseId

					var purchaseButtonHtml = "";
					if (Boolean(row.if_purchaseDetail) === true) {
						purchaseButtonHtml += `<button type="button"  class="btn btn-info text-white purchase-button "   data-id="${row.id}"  data-purchaseid="${row.purchaseId}"
						>查看零件採購</button>`;
					}

					var buttonsHtml =
						deleteButtonHtml + "&nbsp;" + unsubButtonHtml + "&nbsp;" + shipButtonHtml + "&nbsp;" + purchaseButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "depotId" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "depotPosition" },
			{ data: "statusName" },
		],
		drawCallback: function () {
			var api = this.api();

			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				// 如果對象的特定鍵的值為空，則隱藏列
				if (obj.price === "" || obj.price === undefined) {
					api.column(6).visible(false);
				} else {
					// 否則，顯示列
					api.column(6).visible(true);
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

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(9).visible(false);
				} else {
					api.column(9).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}
// 查看零件採購單
$(document).on("click", ".purchase-button", function () {
	var purchaseId = $(this).data("purchaseid");
	console.log("Ship No:", purchaseId);
	window.location.href = "purchaseDetail.html?purchaseId=" + purchaseId;
});

// 查看出庫單
$(document).on("click", ".ship-button", function () {
	var shipNo = $(this).data("shipno");
	console.log("Ship No:", shipNo);
	window.location.href = "shipDetail.html?shipNo=" + shipNo;
	localStorage.setItem("shipNo", JSON.stringify(shipNo));
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
			if (responseData.returnCode === "1") {
				updateData(responseData);
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

//刪除零件
$(document).on("click", ".delete-button", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var deleteButton = $(this);
	var itemId = deleteButton.data("id");
	var buttonStatus = event.target.getAttribute("data-status");
	console.log(itemId, buttonStatus);

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	$(document).off("click", ".confirm-delete");
	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要刪除所選零件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	$(document).on("click", ".confirm-delete", function () {
		// 根據按鈕的狀態值執行不同的提示
		// if (buttonStatus == 1) {
		// 	showgoPurchaseNotification();
		// } else if (buttonStatus == 2) {
		// 	showSuccessAddToOrderNotification();
		// } else if (buttonStatus == 3) {
		// 	showgoshipDetailNotification();
		// }

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

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
				if (response.returnCode === "1") {
					refreshDataList();
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorNotification();
			},
			complete: function () {
				isConfirmDeleteProcessing = false;
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
	console.log(unsubscribeButton);
	var itemId = unsubscribeButton.data("id"); //orderId
	console.log(itemId);
	// localStorage.setItem("getOrderId", itemId);

	var data = {
		orderId: itemId,
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
	$(document).on("click", ".confirm-unsubscribe", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;
		console.log(user_session_id);

		// chsm = session_id+action+'HBAdminUnsubscribeApi'
		var action = "insertUnsubscribeDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		console.log(chsm);

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
				console.log(response);
				showSuccessorderunSubscribeNotification();
				if (response.returnCode === "1") {
					var getSubId = response.unsubscribeId;
					localStorage.setItem("getOrderId", getSubId);

					setTimeout(function () {
						var newPageUrl = "unsubscribeDetail.html";
						window.location.href = newPageUrl;
					}, 3000);
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

//orderComplete
//訂單完成
$(document).on("click", "#orderComplete", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

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
				if (response.returnCode === "1") {
					showSuccessorderCompleteNotification();
					setTimeout(function () {
						refreshDataList();
					}, 1000);
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
				if (response.returnCode === "1") {
					showSuccessorderCancelNotification();
					setTimeout(function () {
						refreshDataList();
					}, 1000);
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

		// chsm = session_id+action+'HBAdminShipApi'
		var action = "insertShipDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

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
				if (response.returnCode === "1") {
					showSuccessshipdetail();
					setTimeout(function () {
						refreshDataList();
					}, 1000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				handleApiResponse(response);
			},
		});
	});
});

// 訂單儲存
$(document).on("click", "#saveBtn", function (e) {
	var formData = new FormData();

	var getorderNote = $("#orderNote").val();
	var getorderremark = $("#orderRemark").val();

	var updateData = {};
	updateData.orderNo = orderNo;
	updateData.orderNote = getorderNote;
	updateData.remark = getorderremark;

	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminOrderApi'
	var action = "updateOrderDetail";
	var chsmtoDeleteFile = user_session_id + action + "HBAdminOrderApi";
	var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

	formData.set("action", action);
	formData.set("session_id", user_session_id);
	formData.set("chsm", chsm);
	formData.set("data", JSON.stringify(updateData));

	$.ajax({
		type: "POST",
		url: `${apiURL}/order`,
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
			if (response.returnCode === "1") {
				showSuccessFileNotification();
				setTimeout(function () {
					localStorage.removeItem("orderNo");
					var newPageUrl = "orderList.html";
					window.location.href = newPageUrl;
				}, 1000);
			} else {
				handleApiResponse(response);
			}
		},
		error: function (error) {
			handleApiResponse(response);
		},
	});
});

//跳轉頁面
$(document).ready(function () {
	var urlParams = new URLSearchParams(window.location.search);
	var orderNo = urlParams.get("orderNo");

	if (orderNo) {
		getOrderfetchAccountList(orderNo);
	} else {
		fetchAccountList();
	}
});

//getOrderfetchAccountList
function getOrderfetchAccountList(orderNo) {
	const dataId = { orderNo: orderNo };
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
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				var getOrderData = responseData.orderData;
				orderStatus = getOrderData.status;
				orderId = getOrderData.id;
				orderNo = getOrderData.orderNo;

				updateData(responseData);
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
