$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	// 添加表单提交事件监听器
	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			showWarningfillFormNotification();
		} else {
			// 处理表单提交
			event.preventDefault();
			var getbrandName = $("#brand-Name").val();
			var getbrandOrder = $("#brand-Order").val();
			var getbrandTextarea = $("#brandTextarea").val();
			var getbrandStatus = $("#brand-Status").val();

			var brandDataObject = {
				brandName: getbrandName,
				brandOrder: getbrandOrder,
				remark: getbrandTextarea,
				status: getbrandStatus,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminBrandApi'
			var action = "insertBrandDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminBrandApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(brandDataObject));

			console.log(formData);

			// 发送文件上传请求
			$.ajax({
				type: "POST",
				url: `${apiURL}/brand`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					console.log(response);
					showSuccessFileNotification();
					var newPageUrl = "brandList.html";
					window.location.href = newPageUrl;
				},
				error: function (error) {
					console.log(error);
					showErrorNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});
