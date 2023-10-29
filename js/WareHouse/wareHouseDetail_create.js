// 填寫資料
$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();

			var getWarehouseId = $("#WarehouseId").val();
			var getcreateTime = $("#createTime").val();
			var getcreateOperator = $("#createOperator").val();
			var getstoreName = $("#storeName").val();
			var getstatusName = $("#statusName").val();

			var manualDataObject = {
				id: getWarehouseId,
				createTime: getcreateTime,
				createOperator: getcreateOperator,
				storeName: getstoreName,
				statusName: getstatusName,
			};

			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// chsm = session_id+action+'HBAdminStockInApi'
			var action = "insertStockInDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminStockInApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(manualDataObject));

			$.ajax({
				type: "POST",
				url: "https://88bakery.tw/HBAdmin/index.php?/api/stockIn",
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					console.log(response);
					showSuccessFileNotification();
					// setTimeout(function () {
					// 	var newPageUrl = "manualList.html";
					// 	window.location.href = newPageUrl;
					// }, 3000);
				},
				error: function (error) {
					showErrorFileNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});

//零件內容
// 取得詳細資料：component
// $(document).ready(function () {
// 	// 从localStorage中获取session_id和chsm
// 	// 解析JSON字符串为JavaScript对象
// 	const jsonStringFromLocalStorage = localStorage.getItem("userData");
// 	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
// 	const user_session_id = gertuserData.sessionId;

// 	// chsm = session_id+action+'HBAdminComponentApi'
// 	// 组装所需数据
// 	var action = "getComponentDetail";
// 	var chsmtoGetComponentDetail = user_session_id + action + "HBAdminComponentApi";
// 	var chsm = CryptoJS.MD5(chsmtoGetComponentDetail).toString().toLowerCase();

// 	// 发送POST请求
// 	$.ajax({
// 		type: "POST",
// 		url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
// 		data: {
// 			action: action,
// 			session_id: user_session_id,
// 			chsm: chsm,
// 			data: IdPost,
// 		},
// 		success: function (responseData) {
// 			console.log(responseData);
// 			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
// 				const componentData = responseData.returnData[0];
// 				$("#componentName").val(componentData.componentName);
// 				$("#componentNumber").val(componentData.componentNumber);
// 				$("#brandId").val(componentData.brandId);

// 				$("#purchaseAmount").val(componentData.purchaseAmount);
// 				$("#depotAmount").val(componentData.depotAmount);
// 				$("#depotPosition").val(componentData.depotPosition);

// 				$("#Price").val(componentData.price);
// 				$("#Cost").val(componentData.cost);
// 				$("#WholesalePrice").val(componentData.wholesalePrice);
// 				$("#lowestWholesalePrice").val(componentData.lowestWholesalePrice);
// 				$("#supplier").val(componentData.componentSupplier);
// 				$("#workingHour").val(componentData.workingHour);
// 				$("#suitableModel").val(componentData.suitableCarModel);
// 				$("#description").val(componentData.description);
// 				$("#precautions").val(componentData.precautions);
// 				$("#lowestInventory").val(componentData.lowestInventory);

// 				$("#BuildTime").val(componentData.createTime);
// 				$("#EditTime").val(componentData.updateTime);
// 				$("#EditAccount").val(componentData.getupdateOperator);

// 				displayFileNameInInput(componentData.file);
// 				const myButton = document.getElementById("downloadBtn");
// 				myButton.setAttribute("data-file", componentData.file);

// 				// 填充完毕后隐藏加载中的spinner
// 				$("#spinner").hide();
// 			} else {
// 				showErrorNotification();
// 			}
// 		},
// 		error: function (error) {
// 			showErrorNotification();
// 		},
// 	});
// });
