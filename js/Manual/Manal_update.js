$(document).ready(function () {
	handlePageUpdatePermissions(currentUser, currentUrl);
});

// 取得詳細資料
$(document).ready(function () {
	var currentUser = JSON.parse(localStorage.getItem("currentUser"));
	var currentUrl = window.location.href;

	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminManualApi'
	// 组装所需数据
	var action = "getManualDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminManualApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/manual`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const manualData = responseData.returnData[0];
				$("#fileNameField").val(manualData.fileName);
				$("#M-BrandName").val(manualData.brandName);
				$("#M-year").val(manualData.year);
				$("#M-applicableType").val(manualData.applicableType);
				$("#M-remark").val(manualData.remark);

				$("#BuildTime").val(manualData.createTime);
				$("#EditTime").val(manualData.updateTime);
				$("#EditAccount").val(manualData.updateOperator);

				if (manualData.fileName == "") {
					showWarningNotification();
				}
				displayFileNameInInput(manualData.file);

				const myButton = document.getElementById("downloadBtn");
				myButton.setAttribute("data-file", manualData.file);

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

// 上傳更新檔案

$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	// 添加表单提交事件监听器
	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			// 处理表单提交
			event.preventDefault();

			if (fileInput.files.length > 0) {
				pushFileupdate();
			} else {
				pushnoFileupdate();
			}
		}
		uploadForm.classList.add("was-validated");
	});

	function pushFileupdate() {
		var partId = localStorage.getItem("partId");

		var getfileNameField = $("#fileNameField").val();
		var getBrandName = $("#M-BrandName").val();
		var getyear = $("#M-year").val();
		var getapplicableType = $("#M-applicableType").val();
		var getremark = $("#M-remark").val();
		var fileInput = document.getElementById("fileInput");

		var createTime = $("#BuildTime").val();
		var updateTime = $("#EditTime").val();
		var updateOperator = $("#EditAccount").val();
		var updateData = {};
		for (var i = 0; i < fileInput.files.length; i++) {
			formData.append("manual[]", fileInput.files[i]);
		}
		updateData.fileName = fileInput.files[0].name;
		updateData.file = fileInput.files[0].name;

		updateData.id = partId;
		updateData.fileName = getfileNameField;
		updateData.brandName = getBrandName;
		updateData.year = getyear;
		updateData.applicableType = getapplicableType;
		updateData.remark = getremark;
		updateData.file = fileInput.files[0].name;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装上传更新文件的数据
		var action = "updateManualDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminManualApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		// 发送上传更新文件的请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/manual`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileNotification();
					setTimeout(function () {
						localStorage.removeItem("partId");
						var newPageUrl = "manualList.html";
						window.location.href = newPageUrl;
					}, 1000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	}

	function pushnoFileupdate() {
		var partId = localStorage.getItem("partId");

		var getfileNameField = $("#fileNameField").val();
		var getBrandName = $("#M-BrandName").val();
		var getyear = $("#M-year").val();
		var getapplicableType = $("#M-applicableType").val();
		var getremark = $("#M-remark").val();
		var fileInput = document.getElementById("fileInput");

		var updateData = {};
		updateData.fileName = getfileNameField;
		updateData.file = "";

		updateData.id = partId;
		updateData.brandName = getBrandName;
		updateData.year = getyear;
		updateData.applicableType = getapplicableType;
		updateData.remark = getremark;

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装上传更新文件的数据
		var action = "updateManualDetail";
		var chsmtoUpdateFile = user_session_id + action + "HBAdminManualApi";
		var chsm = CryptoJS.MD5(chsmtoUpdateFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		// 发送上传更新文件的请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/manual`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileNotification();
					setTimeout(function () {
						localStorage.removeItem("partId");
						var newPageUrl = "manualList.html";
						window.location.href = newPageUrl;
					}, 1000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	}
});

// 下载檔案
$(document).on("click", ".file-download", function (e) {
	e.preventDefault();
	var fileName = $(this).data("file");
	var apiName = "manual";
	if (fileName) {
		downloadPdfFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});
