// 取得詳細資料
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
		url: "https://88bakery.tw/HBAdmin/index.php?/api/order",
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
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
		var checkboxHtml = '<input type="checkbox" class="your-checkbox-class" data-id="' + data.id + '">';

		var buttonsHtml = "";

		if (data.status == 1 || data.status == 2 || data.status == 3) {
			if (data.if_order_delete_component === true) {
				buttonsHtml += '<button class="btn btn-danger delete-button" data-id="' + data.id + '">刪除零件</button>';
			}
		}

		if (data.status == 5) {
			if (data.if_order_unsubscribe === true) {
				buttonsHtml += '<button class="btn btn-warning unsubscribe-button" data-id="' + data.id + '">退貨</button>';
			}
		}

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
