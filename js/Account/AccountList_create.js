// 列表取得：取商店ID製作選單
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStoreApi'
	// 組裝菜單所需資料
	var action = "getStoreList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminStoreApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/store`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				const storeList = document.getElementById("A-storeName");

				const defaultOption = document.createElement("option");
				defaultOption.text = "請選擇門市";
				defaultOption.value = "";
				storeList.appendChild(defaultOption);

				for (let i = 0; i < responseData.returnData.length; i++) {
					const store = responseData.returnData[i];
					const storeName = store.storeName;
					const storeId = store.id;
					const option = document.createElement("option");
					option.text = storeName;
					option.value = storeId;

					storeList.appendChild(option);
				}
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 列表取得：取AuthID\Name製作角色選單
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAuthorizeApi'
	// 組裝菜單所需資料
	var action = "getAuthorizeList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminAuthorizeApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/authorize`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				const rolleList = document.getElementById("A-authorizeName");

				const defaultOption = document.createElement("option");
				defaultOption.text = "請選擇角色";
				defaultOption.value = "";
				rolleList.appendChild(defaultOption);

				for (let i = 0; i < responseData.returnData.length; i++) {
					const roll = responseData.returnData[i];
					const rollName = roll.authorizeName;
					const rollId = roll.id;
					const option = document.createElement("option");

					option.text = rollName;
					option.value = rollId;

					rolleList.appendChild(option);
				}
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

//上傳POST
$(document).ready(function () {
	var formData = new FormData();
	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			event.preventDefault();
			var getaccount = $("#A-account").val();
			var getpassword = $("#A-password").val();
			var getuserName = $("#A-userName").val();
			var getstoreName = $("#A-storeName").find(":selected").val();
			var getemail = $("#A-email").val();
			var getphoneNumber = $("#A-phoneNumber").val();
			var getauthorizeName = $("#A-authorizeName").find(":selected").val();
			var getstatus = $("#A-status").val();

			var getcreateTime = $("#BuildTime").val();

			var accountDataObject = {
				account: getaccount,
				password: getpassword,
				storeName: getstoreName,
				userName: getuserName,
				email: getemail,
				phoneNumber: getphoneNumber,
				authorizeName: getauthorizeName,
				status: getstatus,
				createTime: getcreateTime,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminAccountApi'
			var action = "insertAccountDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminAccountApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(accountDataObject));

			console.log(formData);
			// 发送文件上传请求

			$.ajax({
				type: "POST",
				url: `${apiURL}/account`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					if (response.returnCode === "1") {
						showSuccessFileNotification();
						setTimeout(function () {
							var newPageUrl = "accountList.html";
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
