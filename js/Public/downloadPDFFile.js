function downloadPdfFile(apiName, fileName) {
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
			console.log(response);
			openInNewTab(response, fileName);
		},
		error: function (error) {
			showErrorFileNotification();
		},
	});
}

// 在新标签页中打开文件
function openInNewTab(blob, fileName) {
	const fileExtension = getFileExtension(fileName).toLowerCase();

	// 只支持 PDF 文件扩展名
	if (fileExtension === "pdf") {
		const url = URL.createObjectURL(blob);
		const newTab = window.open();
		newTab.document.write('<iframe width="100%" height="100%" src="' + url + '"></iframe>');
	} else {
		// 不支持的文件类型
		showErrorFileNotification();
	}
}

// 获取文件扩展名
function getFileExtension(fileName) {
	return fileName.split(".").pop();
}
