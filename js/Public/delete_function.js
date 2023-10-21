function deleteItem(apiName, action, url, jsonData, successCallback, errorCallback) {
	var formData = new FormData();

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要刪除所選項目嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var chsmtoDeleteFile = user_session_id + action + apiName;
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		$.ajax({
			type: "POST",
			url: url,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				setTimeout(function () {
					showSuccessFileDeleteNotification();
				}, 1000);
				if (successCallback) {
					successCallback(response);
				}
			},
			error: function (error) {
				showErrorNotification();
				if (errorCallback) {
					errorCallback(error);
				}
			},
		});
	});
}
