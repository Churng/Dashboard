// 取得詳細資料
$(document).ready(function () {
	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);
	handlePageUpdatePermissions(currentUser, currentUrl);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStoreApi'
	// 组装所需数据
	var action = "getStoreDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminStoreApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	$.ajax({
		type: "POST",
		url: `${apiURL}/store`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const shopData = responseData.returnData[0];

				$("#shop-storeName").val(shopData.storeName);
				$("#shop-storeManager").val(shopData.storeManager);
				$("#shop-Type").val(shopData.storeType);

				$("#shop-ContactPerson").val(shopData.contactPerson);
				$("#shop-phoneNumber").val(shopData.phoneNumber);
				$("#shop-FaxNumber").val(shopData.fax);
				$("#shop-TaxNumber").val(shopData.taxId);

				$("#shop-status").val(shopData.status);
				$("#shop-address").val(shopData.address);
				$("#shop-order").val(shopData.storeOrder);

				$("#BuildTime").val(shopData.createTime);
				$("#EditTime").val(shopData.updateTime);
				$("#EditAccount").val(shopData.updateOperator);

				var storeTypeValue = shopData.storeType;
				var shopTypeSelect = $("#shop-Type");
				shopTypeSelect.val(storeTypeValue);

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

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			var partId = localStorage.getItem("partId");

			//取值
			var getstoreName = $("#shop-storeName").val();
			var getstoreManager = $("#shop-storeManager").val();
			var getstoreType = $("#shop-Type").val();
			var getcontactPerson = $("#shop-ContactPerson").val();
			var getphoneNumber = $("#shop-phoneNumber").val();
			var getfax = $("#shop-FaxNumber").val();

			var gettaxId = $("#shop-TaxNumber").val();
			var getstatus = $("#shop-status").val();
			var getaddress = $("#shop-address").val();
			var getstoreOrder = $("#shop-order").val();

			var updateData = {
				id: partId,
				storeName: getstoreName,
				storeManager: getstoreManager,
				storeType: getstoreType,
				contactPerson: getcontactPerson,
				phoneNumber: getphoneNumber,
				fax: getfax,
				taxId: gettaxId,
				status: getstatus,
				address: getaddress,
				storeOrder: getstoreOrder,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminStoreApi'
			var action = "updateStoreDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminStoreApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(updateData));

			console.log(formData);

			// 发送文件上传请求
			$.ajax({
				type: "POST",
				url: `${apiURL}/store`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					console.log(response);

					if (response.returnCode === "1") {
						showSuccessFileNotification();

						setTimeout(function () {
							localStorage.removeItem("partId");
							var newPageUrl = "storeList.html";
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
		uploadForm.classList.add("was-validated");
	});
});
