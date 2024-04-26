$(document).ready(function () {
	handlePageReadPermissions(currentUser, currentUrl);
});

// 取得詳細資料
let orderStatus;
let orderId;
let orderNo;
function fetchAccountList() {
	var partId = localStorage.getItem("orderRId");
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
					//出庫單預設選取 1/24
					var checkboxHtml = "";

					if (row.if_order_execute_ship === true) {
						if (row.status === "3") {
							return `<input type="checkbox" class="executeship-button" data-id="${row.id}" checked disabled>`;
						}
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
							deleteButtonHtml += `<button class="btn btn-danger delete-button" disabled>刪除零件</button>`;
						}
					}

					// 退貨：退貨單新增
					var unsubButtonHtml = "";
					if (row.status == 6 && row.statusName == "已出庫") {
						if (Boolean(row.if_order_unsubscribe) === true) {
							unsubButtonHtml += `<button  class="btn btn-warning unsubscribe-button" disabled>退貨</button>`;
						}
					}

					//查看退貨單
					// if_unsubscribeDetail: true
					var unsubreadButtonHtml = "";
					if (Boolean(row.if_unsubscribeDetail) === true) {
						unsubreadButtonHtml += `<button type="button"  class="btn btn-success text-white unsubdetail-button" disabled>查看退貨單</button>`;
					}

					//查看出庫單
					// if_shipDetail = true
					// shipNo

					var shipButtonHtml = "";
					if (Boolean(row.if_shipDetail) === true) {
						shipButtonHtml += `<button  class="btn btn-primary text-white ship-button" disabled>查看出庫單</button>`;
					}

					//查看零件採購單
					//if_purchaseDetail =true
					//purchaseId

					var purchaseButtonHtml = "";
					if (Boolean(row.if_purchaseDetail) === true) {
						purchaseButtonHtml += `<button type="button"  class="btn btn-info text-white purchase-button " disabled>查看零件採購</button>`;
					}

					var buttonsHtml =
						deleteButtonHtml +
						"&nbsp;" +
						unsubButtonHtml +
						"&nbsp;" +
						shipButtonHtml +
						"&nbsp;" +
						purchaseButtonHtml +
						"&nbsp;" +
						unsubreadButtonHtml;

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

//跳轉頁面
$(document).ready(function () {
	fetchAccountList();
});
