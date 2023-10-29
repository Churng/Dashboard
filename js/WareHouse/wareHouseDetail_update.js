// 取得詳細資料
$(document).ready(function () {
	var stockValue = localStorage.getItem("wareHouseId");
	var IdPost = JSON.stringify({ id: stockValue });

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStockInApi'
	// 组装所需数据
	var action = "getStockInDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminStockInApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/stockIn",
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const wareHouseData = responseData.returnData[0];
				$("#WarehouseId").val(wareHouseData.stockInNo);
				$("#createTime").val(wareHouseData.createTime);
				$("#createOperator").val(wareHouseData.createOperator);
				$("#storeName").val(wareHouseData.storeName);
				$("#statusName").val(wareHouseData.statusName);

				$("#amount").val(wareHouseData.amount);

				$("#BuildTime").val(wareHouseData.createTime);
				$("#EditTime").val(wareHouseData.updateTime);
				$("#EditAccount").val(wareHouseData.updateOperator);

				updatePageWithData(responseData);
				// 填充完毕后隐藏加载中的spinner;
				$("#spinner").hide();
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockInPage").DataTable();
	dataTable.clear().draw();

	for (var i = 0; i < responseData.orderMatchData.length; i++) {
		var data = responseData.orderMatchData[i];
		// 權限設定 //

		// var currentUser = JSON.parse(localStorage.getItem("currentUser"));
		// var currentUrl = window.location.href;
		// handlePagePermissions(currentUser, currentUrl);

		// 按鈕設定//

		dataTable.row
			.add([
				data.id,
				data.componentId,
				data.componentNumber,
				data.componentName,
				data.orderNo,
				data.storeName,
				data.orderNote,
			])
			.draw(false);
	}
}

//零件內容
// 取得詳細資料：component
$(document).ready(function () {
	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminComponentApi'
	// 组装所需数据
	var action = "getComponentDetail";
	var chsmtoGetComponentDetail = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			handleApiResponse(responseData);

			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const componentData = responseData.returnData[0];
				$("#componentName").val(componentData.componentName);
				$("#componentNumber").val(componentData.componentNumber);
				$("#brandId").val(componentData.brandId);

				$("#purchaseAmount").val(componentData.purchaseAmount);
				$("#depotAmount").val(componentData.depotAmount);
				$("#depotPosition").val(componentData.depotPosition);

				$("#Price").val(componentData.price);
				$("#Cost").val(componentData.cost);
				$("#WholesalePrice").val(componentData.wholesalePrice);
				$("#lowestWholesalePrice").val(componentData.lowestWholesalePrice);
				$("#supplier").val(componentData.componentSupplier);
				$("#workingHour").val(componentData.workingHour);
				$("#suitableModel").val(componentData.suitableCarModel);
				$("#description").val(componentData.description);
				$("#precautions").val(componentData.precautions);
				$("#lowestInventory").val(componentData.lowestInventory);

				$("#BuildTime").val(componentData.createTime);
				$("#EditTime").val(componentData.updateTime);
				$("#EditAccount").val(componentData.getupdateOperator);

				displayFileNameInInput(componentData.file);
				const myButton = document.getElementById("downloadBtn");
				myButton.setAttribute("data-file", componentData.file);

				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

$(document).ready(function () {
	$("#BackList").click(function () {
		localStorage.removeItem("componentValue");
		localStorage.removeItem("partId");
		window.location.href = "wareHouseList.html";
	});
});
