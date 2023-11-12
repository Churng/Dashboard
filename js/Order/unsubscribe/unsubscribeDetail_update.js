// 取得詳細資料
// update
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
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const unsubscribeData = responseData.returnData[0];
				// 單據
				$("#unsubId").val(unsubscribeData.id);
				$("#createTime").val(unsubscribeData.createTime);
				$("#createOperator").val(unsubscribeData.createOperator);
				$("#unsubscribeStoreName").val(unsubscribeData.unsubscribeStoreName);
				$("#unsubscribeStatusName").val(unsubscribeData.unsubscribeStatusName);
				$("#unsubscribeRemark").val(unsubscribeData.unsubscribeRemark);
				$("#unsubscribeId").val(unsubscribeData.unsubscribeId);

				// 訂單
				$("#orderId").val(unsubscribeData.orderId);
				$("#orderStoreName").val(unsubscribeData.orderStoreName);
				$("#orderNote").val(unsubscribeData.orderNote);

				//零件序號
				$("#componentId").val(unsubscribeData.depotId);
				$("#statusName").val(unsubscribeData.depotStatusName);
				$("#depotRemark").val(unsubscribeData.depotRemark);

				//零件定義
				$("#componentNumber").val(unsubscribeData.componentNumber);
				$("#componentName").val(unsubscribeData.componentName);
				$("#workingHour").val(unsubscribeData.workingHour);
				$("#lowestWholesalePrice").val(unsubscribeData.lowestWholesalePrice);
				$("#depotPosition").val(unsubscribeData.depotPosition);
				$("#description").val(unsubscribeData.description);
				$("#precautions").val(unsubscribeData.precautions);
				$("#supplier").val(unsubscribeData.componentSupplier);
				$("#suitableModel").val(unsubscribeData.suitableCarModel);
				$("#Price").val(unsubscribeData.price);
				$("#WholesalePrice").val(unsubscribeData.wholesalePrice);

				$("#BuildTime").val(unsubscribeData.createTime);
				$("#EditTime").val(unsubscribeData.updateTime);
				$("#EditAccount").val(unsubscribeData.updateOperator);

				if (unsubscribeData.fileName == "") {
					showWarningNotification();
				}

				// displayFileNameInInput(unsubscribeData.file);
				// const myButton = document.getElementById("downloadBtn");
				// myButton.setAttribute("data-file", unsubscribeData.file);

				const startButton = document.getElementById("startBtn");
				if (
					unsubscribeData.if_unsubscribe_execute_start === false ||
					unsubscribeData.if_unsubscribe_execute_start === undefined
				) {
					startButton.disabled = true;
				} else {
					startButton.disabled = false;
				}

				const completeButton = document.getElementById("completeBtn");
				if (
					unsubscribeData.if_unsubscribe_execute_complete === false ||
					unsubscribeData.if_unsubscribe_execute_complete === undefined
				) {
					completeButton.disabled = true;
				} else {
					completeButton.disabled = false;
				}

				const cancelButton = document.getElementById("cancelBtn");
				if (
					unsubscribeData.if_unsubscribe_execute_cancel === false ||
					unsubscribeData.if_unsubscribe_execute_cancel === undefined
				) {
					cancelButton.disabled = true;
				} else {
					cancelButton.disabled = false;
				}

				unsubId = unsubscribeData.id;

				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

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

// 完成訂單
$(document).ready(function () {
	var formData = new FormData();
	var uploadButton = document.getElementById("completeBtn"); // 通过按钮的ID来获取按钮元素
	console.log(uploadButton);
	// 添加按钮点击事件监听器
	uploadButton.addEventListener("click", function (event) {
		// event.preventDefault();

		var partId = localStorage.getItem("UnsubscribeId");
		var getremark = $("#unsubscribeRemark").val();
		var fileInput = document.getElementById("fileInput");

		var updateData = {};
		if (fileInput.files.length > 0) {
			for (var i = 0; i < fileInput.files.length; i++) {
				formData.append("unsubscribe[]", fileInput.files[i]);
			}
			updateData.fileName = fileInput.files[0].name;
			updateData.file = fileInput.files[0].name;
		} else {
			updateData.fileName = "";
			updateData.file = "";
		}
		updateData.id = partId;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装上传更新文件的数据
		var action = "updateUnsubscribeDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		// 发送上传更新文件的请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/unsubscribe`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileNotification();
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	});
});

// 取消訂單
$(document).ready(function () {
	var formData = new FormData();
	var uploadButton = document.getElementById("cancelBtn"); // 通过按钮的ID来获取按钮元素
	console.log(uploadButton);
	// 添加按钮点击事件监听器
	uploadButton.addEventListener("click", function (event) {
		// event.preventDefault();

		var partId = localStorage.getItem("UnsubscribeId");
		var getremark = $("#unsubscribeRemark").val();
		var fileInput = document.getElementById("fileInput");

		var updateData = {};
		if (fileInput.files.length > 0) {
			for (var i = 0; i < fileInput.files.length; i++) {
				formData.append("unsubscribe[]", fileInput.files[i]);
			}
			updateData.fileName = fileInput.files[0].name;
			updateData.file = fileInput.files[0].name;
		} else {
			updateData.fileName = "";
			updateData.file = "";
		}
		updateData.id = partId;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装上传更新文件的数据
		var action = "deleteStockInDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		// 发送上传更新文件的请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/unsubscribe`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileNotification();
				} else {
					handleApiResponse(response);
				}

				console.warn(response);
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	});
});
