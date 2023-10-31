// 取得詳細資料
let unsubId = "";
$(document).ready(function () {
	var partId = localStorage.getItem("UnsubscribeId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminUnsubscribeApi'
	// 组装所需数据
	var action = "getUnsubscribeDetail";
	var chsmtogetUnsubscribeDetail = user_session_id + action + "HBAdminUnsubscribeApi";
	var chsm = CryptoJS.MD5(chsmtogetUnsubscribeDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/unsubscribe`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const unsubscribeData = responseData.returnData[0];
				// 單據
				$("#unsubId").val(unsubscribeData.id);
				$("#createTime").val(unsubscribeData.createTime);
				$("#createOperator").val(unsubscribeData.createOperator);
				$("#unsubscribeStoreName").val(unsubscribeData.unsubscribeStoreName);
				$("#unsubscribeStatusName").val(unsubscribeData.unsubscribeStatusName);
				$("#unsubscribeRemark").val(unsubscribeData.unsubscribeRemark);

				// 訂單
				$("#orderId").val(unsubscribeData.orderId);
				$("#orderStoreName").val(unsubscribeData.orderStoreName);
				$("#orderNote").val(unsubscribeData.orderNote);

				//零件序號
				$("#componentId").val(unsubscribeData.componentId);
				$("#statusName").val(unsubscribeData.statusName);
				$("#EditAccount").val(unsubscribeData.updateOperator);

				$("#BuildTime").val(unsubscribeData.createTime);
				$("#EditTime").val(unsubscribeData.updateTime);
				$("#EditAccount").val(unsubscribeData.updateOperator);
				if (unsubscribeData.fileName == "") {
					showWarningNotification();
				}
				// displayFileNameInInput(unsubscribeData.file);
				// const myButton = document.getElementById("downloadBtn");
				// myButton.setAttribute("data-file", unsubscribeData.file);

				getComponentContent(unsubscribeData.componentId);

				var completeButton = $("#completeBtn");
				if (unsubscribeData.if_unsubscribe_execute_complete === true) {
					completeButton.addClass("disabled");
				} else {
					completeButton.removeClass("disabled");
				}

				var cancelButton = $(".cancelBtn");
				if (unsubscribeData.if_unsubscribe_execute_cancel === true) {
					cancelButton.addClass("disabled");
				} else {
					cancelButton.removeClass("disabled");
				}

				unsubId = unsubscribeData.id;

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

	//取零件資料
	function getComponentContent(componentId) {
		const dataId = { id: componentId };
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
			url: `${apiURL}/component`,
			data: {
				action: action,
				session_id: user_session_id,
				chsm: chsm,
				data: IdPost,
			},
			success: function (responseData) {
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
	}
});

//監聽按鈕：取消、完成
// $(document).on("click", "#completeBtn", function () {
// 	var formData = new FormData();

// 	var getunsubId = $("#unsubId").val();
// 	var statusName = $("#statusName").val();

// 	var updateData = {
// 		id: getunsubId,
// 	};

// 	// 从localStorage中获取session_id和chsm
// 	// 解析JSON字符串为JavaScript对象
// 	const jsonStringFromLocalStorage = localStorage.getItem("userData");
// 	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
// 	const user_session_id = gertuserData.sessionId;

// 	// chsm = session_id+action+'HBAdminUnsubscribeApi'
// 	// 组装所需数据
// 	var action = "completeUnsubscribeDetail";
// 	var chsmtoGetComponentDetail = user_session_id + action + "HBAdminUnsubscribeApi";
// 	var chsm = CryptoJS.MD5(chsmtoGetComponentDetail).toString().toLowerCase();

// 	formData.set("action", action);
// 	formData.set("session_id", user_session_id);
// 	formData.set("chsm", chsm);
// 	formData.set("data", JSON.stringify(updateData));

// 	// 发送POST请求
// 	$.ajax({
// 		type: "POST",
// 		url: `${apiURL}/unsubscribe`,
// 		data: formData,
// 		success: function (responseData) {
// 			console.log(responseData);
// 			// if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
// 			// 	// 填充完毕后隐藏加载中的spinner
// 			// 	$("#spinner").hide();
// 			// } else {
// 			// 	showErrorNotification();
// 			// }
// 		},
// 		error: function (error) {
// 			showErrorNotification();
// 		},
// 	});
// });

// $(document).on("click", "#cancelBtn", function () {
// 	var formData = new FormData();

// 	var updateData = {
// 		id: unsubId,
// 	};

// 	// 从localStorage中获取session_id和chsm
// 	// 解析JSON字符串为JavaScript对象
// 	const jsonStringFromLocalStorage = localStorage.getItem("userData");
// 	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
// 	const user_session_id = gertuserData.sessionId;

// 	// chsm = session_id+action+'HBAdminUnsubscribeApi'
// 	// 组装所需数据
// 	var action = "deleteStockInDetail";
// 	var chsmtoGetComponentDetail = user_session_id + action + "HBAdminUnsubscribeApi";
// 	var chsm = CryptoJS.MD5(chsmtoGetComponentDetail).toString().toLowerCase();

// 	formData.set("action", action);
// 	formData.set("session_id", user_session_id);
// 	formData.set("chsm", chsm);
// 	formData.set("data", JSON.stringify(updateData));

// 	// 发送POST请求
// 	$.ajax({
// 		type: "POST",
// 		url: `${apiURL}/unsubscribe`,
// 		data: formData,
// 		success: function (responseData) {
// 			console.log(responseData);
// 			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
// 				showSuccessFileDeleteNotification();
// 			}
// 		},
// 		error: function (error) {
// 			showErrorNotification();
// 		},
// 	});
// });

// 顯示已上傳檔案
function displayFileNameInInput(fileName) {
	const fileInput = document.getElementById("fileInput");

	if (fileName) {
		const dataTransfer = new DataTransfer();

		const blob = new Blob([""], { type: "application/octet-stream" });
		const file = new File([blob], fileName);

		dataTransfer.items.add(file);

		const fileList = dataTransfer.files;

		fileInput.files = fileList;
	}
}

// 下载檔案
$(document).on("click", ".file-download", function (e) {
	e.preventDefault(); // 阻止默认链接行为
	var fileName = $(this).data("file");
	var apiName = "unsubscribe";
	if (fileName) {
		downloadPdfFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});
