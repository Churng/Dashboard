var storeOptions = [];

$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// 定义action
	var actionStore = "getStoreList";
	var actionAuthorize = "getAuthorizeList";

	// chsm = session_id + action + 'HBAdminStoreApi'
	var chsmStore = CryptoJS.MD5(user_session_id + actionStore + "HBAdminStoreApi")
		.toString()
		.toLowerCase();
	var chsmAuthorize = CryptoJS.MD5(user_session_id + actionAuthorize + "HBAdminAuthorizeApi")
		.toString()
		.toLowerCase();

	var storeDataRequest = $.ajax({
		type: "POST",
		url: `${apiURL}/store`,
		data: { session_id: user_session_id, action: actionStore, chsm: chsmStore },
	});

	var authorizeDataRequest = $.ajax({
		type: "POST",
		url: `${apiURL}/authorize`,
		data: { session_id: user_session_id, action: actionAuthorize, chsm: chsmAuthorize },
	});

	// 使用$.when等待两个请求都完成
	$.when(storeDataRequest, authorizeDataRequest)
		.then(function (storeResponse, authorizeResponse) {
			console.log(storeResponse, authorizeResponse);
			if (storeResponse[1] === "success" && authorizeResponse[1] === "success") {
				// Store
				const storeList = document.getElementById("A-storeName");
				storeList.innerHTML = ""; // 清空下拉列表

				const defaultOption = document.createElement("option");
				defaultOption.text = "請選擇門市";
				storeList.appendChild(defaultOption);

				for (let i = 0; i < storeResponse[0].returnData.length; i++) {
					const store = storeResponse[0].returnData[i];
					const storeName = store.storeName;
					const storeId = store.id;

					const option = document.createElement("option");
					option.text = storeName;
					option.value = storeId;

					storeList.appendChild(option);
					storeOptions.push({ text: storeName, value: storeId });
				}

				// Auth

				const rolleList = document.getElementById("A-authorizeName");
				const defaultAuthOption = document.createElement("option");
				defaultAuthOption.text = "請選擇角色";
				rolleList.appendChild(defaultAuthOption);

				for (let i = 0; i < authorizeResponse[0].returnData.length; i++) {
					const roll = authorizeResponse[0].returnData[i];
					const rollName = roll.authorizeName;
					const rollId = roll.id;

					const option = document.createElement("option");
					option.text = rollName;
					option.value = rollId;

					rolleList.appendChild(option);
				}
			}
		})
		.fail(function (error) {
			showErrorNotification();
		});
});

//取得該筆項目詳細資料
$(document).ready(function () {
	var updateFormData = new FormData(); // 在外部定義更新資料

	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAccountApi'
	// 组装所需数据
	var action = "getAccountDetail";
	var chsmtoGetAccountDetail = user_session_id + action + "HBAdminAccountApi";
	var chsm = CryptoJS.MD5(chsmtoGetAccountDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/account`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const accountData = responseData.returnData[0];

				var storeName = getStoreNameById(accountData.storeId);
				console.log(storeName);

				console.log(storeOptions);
				$("#A-account").val(accountData.account);
				$("#A-password").val(accountData.password);
				$("#A-userName").val(accountData.userName);
				$("#A-storeName").val(storeName);
				$("#A-email").val(accountData.email);
				$("#A-phoneNumber").val(accountData.phoneNumber);
				$("#A-authorizeName").find(":selected").val();
				$("#A-status").val(accountData.status);

				$("#BuildTime").val(accountData.createTime);
				$("#EditTime").val(accountData.updateTime);
				$("#EditAccount").val(accountData.updateOperator);

				if (accountData.fileName == "") {
					showWarningNotification();
				}
				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

function getStoreNameById(storeId) {
	console.log(storeOptions);
	for (var i = 0; i < storeOptions.length; i++) {
		console.log(storeOptions[i].value);
		if (storeOptions[i].value == storeId) {
			console.log(storeOptions[i].value);
			return storeOptions[i].value;
		}
	}
	return ""; // 如果没有匹配的数据 如果未找到匹配的 storeId，则返回空字符串
}

//上傳POST
$(document).ready(function () {
	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);
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
				id: partId,
				account: getaccount,
				password: getpassword,
				storeId: getstoreName,
				userName: getuserName,
				email: getemail,
				phoneNumber: getphoneNumber,
				authorizeId: getauthorizeName,
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
			var action = "updateAccountDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminAccountApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(accountDataObject));

			var form = document.querySelector(".needs-validation");
			if (!form.checkValidity()) {
				event.preventDefault(); // 阻止默认提交行为
			}
			form.classList.add("was-validated");

			// 发送文件上传请求
			$.ajax({
				type: "POST",
				url: `${apiURL}/account`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					console.log(response);

					setTimeout(function () {
						showSuccessFileNotification();
					}, 1000);

					var newPageUrl = "accountList.html";
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
