$(function () {
	$("#loginForm").submit(function (event) {
		event.preventDefault(); // 阻止表单的默认提交行为

		// 获取表单数据
		var account = $("#username").val();
		var password = $("#password").val();
		var cobineChsm = account + password + "HBAdminLoginApi";
		var chsm = CryptoJS.MD5(cobineChsm).toString().toLowerCase();

		// 发送POST请求
		$.ajax({
			type: "POST",
			url: "https://88bakery.tw/HBAdmin/index.php?/api/adminLogin", // 替换为实际的服务器端处理脚本
			data: { account: account, password: password, chsm: chsm },
			success: function (response) {
				$("#loginResult").html("服务器响应：" + response);

				const returnCode = response.returnCode;
				const returnMessage = response.returnMessage;
				const returnData = response.returnData.sessionId;

				const userData = {
					returnCode: returnCode,
					returnMessage: returnMessage,
					sessionId: returnData,
				};

				// 将用户信息转换为JSON字符串
				const jsonString = JSON.stringify(userData);

				// 存储JSON字符串在LocalStorage中
				localStorage.setItem("userData", jsonString);

				// 解析JSON字符串为JavaScript对象
				const jsonStringFromLocalStorage = localStorage.getItem("userData");
				const gertuserData = JSON.parse(jsonStringFromLocalStorage);
				const getSessionId = userData.sessionId;

				// 組裝菜單所需資料
				var action = "select";
				var chsmtoMenu = getSessionId + action + "HBAdminMenuApi";
				var chsm = CryptoJS.MD5(chsmtoMenu).toString().toLowerCase();

				// 進入菜單
				$.ajax({
					type: "POST",
					url: "https://88bakery.tw/HBAdmin/index.php?/api/menu", // 替换为第二个API的URL
					data: { session_id: getSessionId, action: action, chsm: chsm },
					success: function (secondApiResponse) {
						// 在这里处理第二个API的响应
						console.log(secondApiResponse);
						// localStorage.removeItem('userData');

						// 第二次存储新的 currentUser
						var currentUser = {
							userreturnCode: secondApiResponse.returnCode,
							userName: secondApiResponse.name,
							userPhoto: secondApiResponse.personalPhoto,
							userretrunData: secondApiResponse.returnData,
							userMessage: secondApiResponse.returnMessage,
						};

						localStorage.setItem("currentUser", JSON.stringify(currentUser));

						// 成功導向測試頁面
						if (currentUser.userreturnCode === "1") {
							showSuccessLoginNotification();

							setTimeout(function () {
								window.location.href = "index.html";
							}, 1000);
						} else {
							// 登录失败，显示错误消息
							alert("登录失败，请重试。");
						}
					},
					error: function () {
						$("#loginResult").html("第二个API调用发生错误");
					},
				});
			},
			error: function () {
				$("#loginResult").html("发生错误");
			},
		});
	});
});
