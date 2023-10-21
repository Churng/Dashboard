$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			//取值
			var getstoreName = $("#shop-storeName").val();
			var getstoreManager = $("#shop-storeManager").val();
			var getstoreType = $("#shop-Type").val();
			var getcontactPerson = $("#shop-ContactPerson").val();
			var getphoneNumber = $("#shop-phoneNumber").val();
			var getfax = $("#shop-FaxNumber").val();

			var getfax = $("#shop-TaxNumber").val();
			var gettaxId = $("#shop-TaxNumber").val();
			var getstatus = $("#shop-status").val();
			var getaddress = $("#shop-address").val();
			var getstoreOrder = $("#shop-order").val();

			var shopDataObject = {
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
			var action = "insertStoreDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminStoreApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			console.log(chsm);

			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(shopDataObject));

			$.ajax({
				type: "POST",
				url: "https://88bakery.tw/HBAdmin/index.php?/api/store",
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					showSuccessFileNotification();
					var newPageUrl = "storeList.html";
					window.location.href = newPageUrl;
				},
				error: function (error) {
					showErrorSubmitNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});
