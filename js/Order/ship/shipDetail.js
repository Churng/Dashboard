function fetchAccountList() {
	var partId = localStorage.getItem("shipNo");
	console.log(partId);
	var getshipNo = JSON.parse(partId);
	const dataId = { shipNo: getshipNo };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminOrderApi'
	// 组装所需数据
	var action = "getShipDetail";
	var chsmtoGetOrderDetail = user_session_id + action + "HBAdminShipApi";
	var chsm = CryptoJS.MD5(chsmtoGetOrderDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/ship`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				console.log(responseData);
				updateData(responseData);
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

//表單內資料：單據詳細資料
function updateData(responseData) {
	const shipData = responseData.shipData;

	var shipNo = shipData.shipNo;
	var createTime = shipData.createTime;
	var statusName = shipData.statusName;
	var createTime = shipData.createTime;
	var createOperator = shipData.createOperator;
	var storeName = shipData.storeName;
	var statusName = shipData.statusName;
	var remark = shipData.remark;

	var orderNo = shipData.orderNo;
	var orderStoreName = shipData.orderStoreName;
	var orderNote = shipData.orderNote;

	var updateTime = shipData.updateTime;
	var updateOperator = shipData.updateOperator;

	var createOperator = shipData.createOperator;
	var approveOperator = shipData.approveOperator;
	var receiveOperator = shipData.receiveOperator;
	var cancelOperator = shipData.cancelOperator;

	// 填充表单元素的值
	$("#shipNo").val(shipNo);
	$("#createTime").val(createTime);
	$("#createOperator").val(createOperator);
	$("#storeName").val(storeName);
	$("#statusName").val(statusName);
	$("#remark").val(remark);

	$("#orderNo").val(orderNo);
	$("#orderStoreName").val(orderStoreName);
	$("#orderNote").val(orderNote);

	$("#BuildTime").val(createTime);
	$("#EditTime").val(updateTime);
	$("#EditAccount").val(updateOperator);

	$("#requisition-member").val(createOperator);
	$("#approve-member").val(approveOperator);
	$("#receive-member").val(receiveOperator);
	$("#ship_cancel-member").val(cancelOperator);

	// 填充完毕后隐藏加载中的spinner
	$("#spinner").hide();

	//申請出庫
	var requisitionInput = $("#shipRequisition");
	if (Boolean(shipData.if_ship_ship_requisition) === true) {
		requisitionInput.prop("disabled", false);
	} else {
		requisitionInput.val("");
		requisitionInput.prop("disabled", true);
	}

	//同意出庫
	var approveInput = $("#shipApprove");
	if (Boolean(shipData.if_ship_ship_approve) === true) {
		approveInput.prop("disabled", false);
	} else {
		approveInput.val("");
		approveInput.prop("disabled", true);
	}

	//領取零件
	var receiveInput = $("#shipReceive");
	if (Boolean(shipData.if_ship_ship_receive) === true) {
		receiveInput.prop("disabled", false);
	} else {
		receiveInput.val("");
		receiveInput.prop("disabled", true);
	}

	//取消出庫
	var cancelInput = $("#shipCancel");
	if (Boolean(shipData.if_ship_ship_cancel) === true) {
		cancelInput.prop("disabled", false);
	} else {
		cancelInput.val("");
		cancelInput.prop("disabled", true);
	}
}

//底下表格內資料：零件
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockOutPage").DataTable();
	dataTable.clear().draw();

	// 填充API数据到表格，包括下载链接
	responseData.returnData.forEach(function (data) {
		// console.log(data);

		dataTable.row
			.add([
				data.componentId,
				data.componentNumber,
				data.componentName,
				data.brandName,
				data.suitableCarModel,
				data.price,
				data.wholesalePrice,
				data.lowestWholesalePrice,
				data.cost,
				data.workingHour,
				data.depotPosition,
				data.statusName,
			])
			.draw(false);
	});
}

//更新數據
function refreshDataList() {
	var dataTable = $("#stockOutPage").DataTable();
	dataTable.clear().draw();

	var partId = localStorage.getItem("shipNo");
	var getshipNo = JSON.parse(partId);
	const dataId = { shipNo: getshipNo };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminShipApi''
	// 组装所需数据
	var action = "getShipDetail";
	var chsmtoGetOrderDetail = user_session_id + action + "HBAdminShipApi";
	var chsm = CryptoJS.MD5(chsmtoGetOrderDetail).toString().toLowerCase();

	$("#stockOutPage").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/ship`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				updateData(responseData);
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

//同意出庫
$(document).on("click", "#shipApprove", function (e) {
	e.stopPropagation();
	var formData = new FormData();

	var partId = localStorage.getItem("shipNo");
	var getshipNo = JSON.parse(partId);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-order");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要同意出庫嗎？<br/><br><button class='btn btn-danger confirm-order'>確定</button>",
		"確定同意出庫",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-order", function () {
		var updateData = {};
		var getremark = $("#remark").val();
		updateData.shipNo = getshipNo;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminShipApi'
		var action = "approveAllShip";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/ship`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessshipApproveNotification();
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

//領取零件
$(document).on("click", "#shipReceive", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	var partId = localStorage.getItem("shipNo");
	var getshipNo = JSON.parse(partId);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-order");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要領取零件嗎？<br/><br><button class='btn btn-danger confirm-order'>確定</button>",
		"確定完成領取",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-order", function () {
		var updateData = {};
		var getremark = $("#remark").val();
		updateData.shipNo = getshipNo;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminShipApi'
		var action = "receiveAllShip";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/ship`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessshipRequisitionNotification();
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

//取消出庫
$(document).on("click", "#shipCancel", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	var partId = localStorage.getItem("shipNo");
	var getshipNo = JSON.parse(partId);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-order");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要取消出庫嗎？<br/><br><button class='btn btn-danger confirm-order'>確定</button>",
		"確定取消出庫",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-order", function () {
		var updateData = {};
		var getremark = $("#remark").val();
		updateData.shipNo = getshipNo;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminShipApi'
		var action = "cancelAllShip";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/ship`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessshipCancelNotification();
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

//跳轉頁面
// $(document).ready(function () {
// 	var urlParams = new URLSearchParams(window.location.search);
// 	var shipNo = urlParams.get("shipNo");

// 	if (shipNo) {
// 		getOrderfetchAccountList(shipNo);
// 	} else {
// 		fetchAccountList();
// 	}
// });

//getOrderfetchAccountList
// function getOrderfetchAccountList(shipNo) {
// 	const dataId = { shipNo: shipNo };
// 	const IdPost = JSON.stringify(dataId);
// 	console.log(IdPost);
// 	// 从localStorage中获取session_id和chsm
// 	// 解析JSON字符串为JavaScript对象
// 	const jsonStringFromLocalStorage = localStorage.getItem("userData");
// 	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
// 	const user_session_id = gertuserData.sessionId;

// 	// chsm = session_id+action+'HBAdminOrderApi'
// 	// 组装所需数据
// 	var action = "getShipDetail";
// 	var chsmtoGetOrderDetail = user_session_id + action + "HBAdminShipApi";
// 	var chsm = CryptoJS.MD5(chsmtoGetOrderDetail).toString().toLowerCase();

// 	// 发送POST请求
// 	$.ajax({
// 		type: "POST",
// 		url: `${apiURL}/ship`,
// 		data: {
// 			action: action,
// 			session_id: user_session_id,
// 			chsm: chsm,
// 			data: IdPost,
// 		},
// 		success: function (responseData) {
// 			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
// 				console.log(responseData);
// 				updateData(responseData);
// 				updatePageWithData(responseData);
// 			} else {
// 				handleApiResponse(responseData);
// 			}
// 		},
// 		error: function (error) {
// 			showErrorNotification();
// 		},
// 	});
// }

$(document).ready(function () {
	fetchAccountList();
});
