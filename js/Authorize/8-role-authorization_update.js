//品牌列表
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminBrandApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/brand",
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const ulList = document.querySelector(".selectBrand");

			for (let i = 0; i < responseData.returnData.length; i++) {
				const brand = responseData.returnData[i];
				const brandName = brand.brandName;
				const brandId = brand.id;

				const li = document.createElement("li");
				li.classList.add("form-check");

				const input = document.createElement("input");
				input.classList.add("form-check-input");
				input.type = "checkbox";
				input.value = "";
				input.id = brandId;

				const label = document.createElement("label");
				label.classList.add("form-check-label");
				label.htmlFor = brandId;
				label.textContent = brandName;

				li.appendChild(input);
				li.appendChild(label);

				ulList.appendChild(li);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 取得詳細資料
$(document).ready(function () {
	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
	const IdPost = JSON.stringify(dataId);

	console.log(IdPost);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminAuthorizeApi'
	// 组装所需数据
	var action = "getAuthorizeDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminAuthorizeApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: "https://88bakery.tw/HBAdmin/index.php?/api/authorize",
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const AuthData = responseData.returnData[0];
				$("#roleName").val(AuthData.fileName);
				$("#storeType").val(AuthData.brandName);
				$("#selectBrand").val(AuthData.year);
				$("#remarkAuth").val(AuthData.applicableType);
				$("#roleOrder").val(AuthData.remark);

				$("#BuildTime").val(AuthData.createTime);
				$("#EditTime").val(AuthData.updateTime);
				$("#EditAccount").val(AuthData.updateOperator);

				if (AuthData.fileName == "") {
					showWarningNotification();
				}
				displayFileNameInInput(AuthData.file);
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
