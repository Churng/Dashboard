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
			if (isImageFile(fileName)) {
				openImageInNewTab(response, fileName);
			} else {
				downloadFileLocally(response, fileName);
			}
		},
		error: function (error) {
			showErrorFileNotification();
		},
	});
}

// 判断文件是否是图像类型
function isImageFile(fileName) {
	const imageExtensions = ["jpg", "jpeg", "png", "gif"];
	const fileExtension = getFileExtension(fileName).toLowerCase();
	return imageExtensions.includes(fileExtension);
}

// 在新標籤開啟圖像
function openImageInNewTab(blob, fileName) {
	const url = URL.createObjectURL(blob);
	const newTab = window.open();
	const imageElement = document.createElement("img");
	imageElement.src = url;
	newTab.document.body.appendChild(imageElement);

	const a = newTab.document.createElement("a");
	a.href = url;
	a.download = fileName;
	a.innerText = "Download";
	newTab.document.body.appendChild(a);
}

// 下载文件到本地
function downloadFileLocally(blob, fileName) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	window.URL.revokeObjectURL(url);
}

function getFileExtension(fileName) {
	return fileName.split(".").pop();
}
