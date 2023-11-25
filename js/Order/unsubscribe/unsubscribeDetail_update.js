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
				const unsubAmount = responseData;

				$("#amount").val(unsubAmount.returnDataTotalAmount);
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

				displayFileNameInInput(unsubscribeData.file);
				const myButton = document.getElementById("downloadBtn");
				myButton.setAttribute("data-file", unsubscribeData.file);

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
	var apiName = "component";
	if (fileName) {
		downloadFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});

// 退貨完成;
$(document).on("click", "#completeBtn", function (e) {
	e.stopPropagation();
	var formData = new FormData();

	console.log(e);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-unsubscribe");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要完成退貨嗎？<br/><br><button class='btn btn-danger confirm-unsubscribe'>確定</button>",
		"確定同意退貨",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-unsubscribe", function () {
		var updateData = {};
		var getremark = $("#unsubscribeRemark").val();
		updateData.id = unsubId;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminUnsubscribeApi'
		var action = "completeUnsubscribeDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/unsubscribe`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessunsubCompleteNotification();
					setTimeout(function () {
						location.reload();
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

// 取消訂單
$(document).on("click", "#cancelBtn", function (e) {
	e.stopPropagation();
	var formData = new FormData();

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".cancel-unsubscribe");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要取消退貨嗎？<br/><br><button class='btn btn-danger cancel-unsubscribe'>確定</button>",
		"確定取消退貨",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".cancel-unsubscribe", function () {
		var updateData = {};
		var getremark = $("#unsubscribeRemark").val();
		updateData.id = unsubId;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminUnsubscribeApi'
		var action = "deleteUnsubscribeDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminUnsubscribeApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/unsubscribe`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					setTimeout(function () {
						showSuccessunsubCancelNotification();
					}, 1000);
					location.reload();
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
