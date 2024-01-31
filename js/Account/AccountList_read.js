$(document).ready(function () {
	handlePageReadPermissions(currentUser, currentUrl);
});

// 函數用於發送API請求
function makeRequestA(url, user_session_id, action, chsm) {
	return $.ajax({
		url: url,
		method: "POST",
		data: { session_id: user_session_id, action: action, chsm: chsm },
	});
}

function makeRequestB(url, user_session_id, action, chsm) {
	return $.ajax({
		url: url,
		method: "POST",
		data: { session_id: user_session_id, action: action, chsm: chsm },
	});
}

function makeRequestC(url, user_session_id, action, chsm, IdPost) {
	return $.ajax({
		url: url,
		method: "POST",
		data: { session_id: user_session_id, action: action, chsm: chsm, data: IdPost },
	});
}

// API回應
function storeResponse(response) {
	const responseData = response;
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
}

function roleApiResponse(response) {
	const responseData = response;
	const rolleList = document.getElementById("A-authorizeName");
	const defaultAuthOption = document.createElement("option");
	defaultAuthOption.text = "請選擇角色";
	defaultAuthOption.value = "";
	rolleList.appendChild(defaultAuthOption);

	for (let i = 0; i < responseData.returnData.length; i++) {
		const roll = responseData.returnData[i];
		const rollName = roll.authorizeName;
		const rollId = roll.id;

		const option = document.createElement("option");
		option.text = rollName;
		option.value = rollId;

		rolleList.appendChild(option);
	}
}

function detailApiResponse(response) {
	const responseData = response;
	console.log(responseData);

	if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
		const accountData = responseData.returnData[0];

		// console.log(storeOptions);
		$("#A-account").val(accountData.account);
		$("#A-password").val(accountData.password);
		$("#A-userName").val(accountData.userName);
		$("#A-storeName").val(accountData.storeId);
		$("#A-email").val(accountData.email);
		$("#A-phoneNumber").val(accountData.phoneNumber);
		$("#A-authorizeName").val(accountData.authorizeId);
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
}

async function fetchData() {
	try {
		var partId = localStorage.getItem("AcRId");
		const dataId = { id: partId };

		const IdPost = JSON.stringify(dataId);
		const parsedObject = JSON.parse(IdPost);
		parsedObject.id = parseInt(parsedObject.id);
		console.log(IdPost);

		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 組裝菜單所需資料
		var action = "getStoreList";
		var chsmtoGetStoreList = user_session_id + action + "HBAdminStoreApi";
		var chsm = CryptoJS.MD5(chsmtoGetStoreList).toString().toLowerCase();

		var actionAuthorize = "getAuthorizeList";
		var chsmtoGetAuthList = user_session_id + actionAuthorize + "HBAdminAuthorizeApi";
		var chsm_Auth = CryptoJS.MD5(chsmtoGetAuthList).toString().toLowerCase();

		var actionDetail = "getAccountDetail";
		var chsmtoGetAccountDetail = user_session_id + actionDetail + "HBAdminAccountApi";
		var chsm_detail = CryptoJS.MD5(chsmtoGetAccountDetail).toString().toLowerCase();

		const endpointA = `${apiURL}/store`;
		const endpointB = `${apiURL}/authorize`;
		const endpointC = `${apiURL}/account`;

		const responseA = await makeRequestA(endpointA, user_session_id, action, chsm);
		storeResponse(responseA, "回應A");

		const responseB = await makeRequestB(endpointB, user_session_id, actionAuthorize, chsm_Auth);
		roleApiResponse(responseB, "回應B");

		const responseC = await makeRequestC(endpointC, user_session_id, actionDetail, chsm_detail, IdPost);
		detailApiResponse(responseC);
	} catch (error) {
		// 處理錯誤
		console.error("發生錯誤：", error);
	}
}

$(document).ready(function () {
	fetchData(); // 調用 fetchData 函數以觸發API請求和處理
});

//上傳POST
$(document).ready(function () {
	var formData = new FormData();
	var partId = localStorage.getItem("AcRId");
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
				userName: getuserName,
				email: getemail,
				phoneNumber: getphoneNumber,
				status: getstatus,
				createTime: getcreateTime,
			};

			if (getstoreName !== "") {
				accountDataObject.storeId = getstoreName;
			}

			if (getauthorizeName !== "") {
				accountDataObject.authorizeId = getauthorizeName;
			}

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
					if (response.returnCode === "1") {
						showSuccessFileNotification();
						setTimeout(function () {
							localStorage.removeItem("AcRId");
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
