// 取得詳細資料
$(document).ready(function () {
	var partId = localStorage.getItem("readBrandId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminBrandApi'
	// 组装所需数据
	var action = "getBrandDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/brand`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const brandData = responseData.returnData[0];
				$("#brand-Name").val(brandData.brandName);
				$("#brandTextarea").val(brandData.remark);
				$("#brand-Order").val(brandData.brandOrder);
				$("#brand-Status").val(brandData.status);

				$("#BuildTime").val(brandData.createTime);
				$("#EditTime").val(brandData.updateTime);
				$("#EditAccount").val(brandData.updateOperator);

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

// 上傳POST
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

			const urlParams = new URLSearchParams(window.location.search);
			const partId = urlParams.get("id");

			//取值
			var getbrandName = $("#brand-Name").val();
			var getbrandOrder = $("#brand-Order").val();
			var getremark = $("#brandTextarea").val();
			var getbrandStatus = $("#brand-Status").val();

			var updateData = {
				id: partId,
				brandName: getbrandName,
				brandOrder: getbrandOrder,
				status: getbrandStatus,
				remark: getremark,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminBrandApi'
			var action = "updateBrandDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminBrandApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(updateData));

			$.ajax({
				type: "POST",
				url: `${apiURL}/brand`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					handleApiResponse(response);
					console.log(response);
					showSuccessFileNotification();
					localStorage.removeItem("selectedBrandData");
					localStorage.removeItem("readBrandId");
					var newPageUrl = "brandList.html";
					window.location.href = newPageUrl;
				},
				error: function (error) {
					showErrorFileNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});
