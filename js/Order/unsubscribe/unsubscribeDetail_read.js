// 取得詳細資料
// update
let unsubId = "";
$(document).ready(function () {
	var partId = localStorage.getItem("UnRId");
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
				$("#orderId").val(unsubscribeData.orderNo);
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
