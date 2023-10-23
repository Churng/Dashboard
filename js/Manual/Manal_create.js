$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			var fileInput = $("#fileInput")[0];

			if (fileInput.files.length > 0) {
				for (var i = 0; i < fileInput.files.length; i++) {
					var file = fileInput.files[i];
					formData.append("manual[]", file, file.name);
				}

				var getfileName = $("#fileNameField").val();
				var getbrandName = $("#M-BrandName").val();
				var getyear = $("#M-year").val();
				var getapplicableType = $("#M-applicableType").val();
				var getremark = $("#M-remark").val();

				var manualDataObject = {
					fileName: getfileName,
					brandName: getbrandName,
					year: getyear,
					applicableType: getapplicableType,
					remark: getremark,
					file: getfileName,
				};

				const jsonStringFromLocalStorage = localStorage.getItem("userData");
				const gertuserData = JSON.parse(jsonStringFromLocalStorage);
				const user_session_id = gertuserData.sessionId;

				var action = "insertManualDetail";
				var chsmtoPostFile = user_session_id + action + "HBAdminManualApi";
				var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

				formData.set("action", action);
				formData.set("session_id", user_session_id);
				formData.set("chsm", chsm);
				formData.set("data", JSON.stringify(manualDataObject));

				$.ajax({
					type: "POST",
					url: "https://88bakery.tw/HBAdmin/index.php?/api/manual",
					data: formData,
					processData: false,
					contentType: false,
					success: function (response) {
						showSuccessFileNotification();
						setTimeout(function () {
							var newPageUrl = "manualList.html";
							window.location.href = newPageUrl;
						}, 3000);
					},
					error: function (error) {
						showErrorFileNotification();
					},
				});
			} else {
				showWarningNotification();
			}
		}
		uploadForm.classList.add("was-validated");
	});
});

// //填入檔案名稱欄位
// $(document).ready(function () {
// 	// 获取文件输入字段和文件名显示字段的引用
// 	var fileInput = document.getElementById("fileInput");
// 	var fileNameField = document.getElementById("fileNameField");

// 	// 监听文件输入字段的变化事件
// 	fileInput.addEventListener("change", function () {
// 		if (fileInput.files.length > 0) {
// 			// 选择了文件，显示文件名
// 			fileNameField.value = fileInput.files[0].name;
// 		} else {
// 			// 未选择文件，清空文件名字段
// 			fileNameField.value = "";
// 		}
// 	});
// });
