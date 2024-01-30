function fetchAccountList() {
	handlePageReadPermissions(currentUser, currentUrl);
	var partId = localStorage.getItem("shipRNo");
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
}

//底下表格內資料：零件
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockOutPage").DataTable();
	dataTable.clear().destroy();
	dataTable.columns().visible(true);

	var data = responseData.returnData;

	table = $("#stockOutPage").DataTable({
		autoWidth: false,
		columns: [
			{ data: "id" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "brandName" },
			{ data: "suitableCarModel" },
			{ data: "price", defaultContent: "" },
			{ data: "wholesalePrice", defaultContent: "" },
			{ data: "lowestWholesalePrice", defaultContent: "" },
			{ data: "cost", defaultContent: "" },
			{ data: "workingHour" },
			{ data: "depotPosition" },
			{ data: "shipRealPrice", defaultContent: "" },
			{ data: "statusName" },
		],
		drawCallback: function () {
			var api = this.api();

			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				// 如果對象的特定鍵的值為空，則隱藏列
				if (obj.price === "" || obj.price === undefined) {
					api.column(5).visible(false);
				} else {
					// 否則，顯示列
					api.column(5).visible(true);
				}

				if (obj.cost === "" || obj.cost === undefined) {
					api.column(8).visible(false);
				} else {
					api.column(8).visible(true);
				}

				if (obj.wholesalePrice === "" || obj.wholesalePrice === undefined) {
					api.column(6).visible(false);
				} else {
					api.column(6).visible(true);
				}

				if (obj.lowestWholesalePrice === "" || obj.lowestWholesalePrice === undefined) {
					api.column(7).visible(false);
				} else {
					api.column(7).visible(true);
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
	var dataTable = $("#stockOutPage").DataTable();
	dataTable.clear().draw();

	var partId = localStorage.getItem("shipRNo");
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
	var urlParams = new URLSearchParams(window.location.search);
	var shipNo = urlParams.get("shipRNo");

	if (shipNo) {
		getOrderfetchAccountList(shipNo);
	} else {
		fetchAccountList();
	}
});

//getOrderfetchAccountList
function getOrderfetchAccountList(shipNo) {
	const dataId = { shipNo: shipNo };
	const IdPost = JSON.stringify(dataId);
	console.log(IdPost);
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
