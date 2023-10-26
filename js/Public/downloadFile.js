function downloadFile(apiName, fileName) {
	const formData = new FormData();
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	const chsmtoDeleteFile = user_session_id + apiName + fileName + "HBAdminGetFileApi";
	const chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

	formData.set("apiName", apiName);
	formData.set("session_id", user_session_id);
	formData.set("chsm", chsm);
	formData.set("fileName", fileName);

	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/getFile",
		data: formData,
		processData: false,
		contentType: false,
		xhrFields: {
			responseType: "blob",
		},
		success: function (response) {
			console.log(response); // 使用 response，而不是 blob
			handleDownloadResponse(response, fileName, apiName);
		},
		error: function (error) {
			showErrorFileNotification();
		},
	});
}

function handleDownloadResponse(blob, fileName, apiName) {
	const url = window.URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName; // 指定文件名
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);

	if (blob.returnCode === 1) {
		setTimeout(function () {
			showSuccessFileDownloadNotification();
		}, 1000);

		refreshDataList();
	} else {
		handleAlertExpiration(blob);
	}
}
