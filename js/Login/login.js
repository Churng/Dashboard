$(function () {
	$("#loginForm").submit(function (event) {
		event.preventDefault();

		var account = $("#username").val();
		var password = $("#password").val();
		var cobineChsm = account + password + "HBAdminLoginApi";
		var chsm = CryptoJS.MD5(cobineChsm).toString().toLowerCase();

		$.ajax({
			type: "POST",
			url: `${apiURL}/adminLogin`,
			data: { account: account, password: password, chsm: chsm },
			success: function (response) {
				if (response.returnCode === "1") {
					$("#loginResult").html("服务器响应：" + response);

					const returnCode = response.returnCode;
					const returnMessage = response.returnMessage;
					const returnData = response.returnData.sessionId;

					const userData = {
						returnCode: returnCode,
						returnMessage: returnMessage,
						sessionId: returnData,
					};

					const jsonString = JSON.stringify(userData);

					localStorage.setItem("userData", jsonString);

					const jsonStringFromLocalStorage = localStorage.getItem("userData");
					const gertuserData = JSON.parse(jsonStringFromLocalStorage);
					const getSessionId = userData.sessionId;

					var action = "select";
					var chsmtoMenu = getSessionId + action + "HBAdminMenuApi";
					var chsm = CryptoJS.MD5(chsmtoMenu).toString().toLowerCase();

					$.ajax({
						type: "POST",
						url: `${apiURL}/menu`,
						data: { session_id: getSessionId, action: action, chsm: chsm },
						success: function (secondApiResponse) {
							console.log(secondApiResponse);

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
								handleApiResponse(secondApiResponse);
							}
						},
						error: function () {
							showErrorNotification();
						},
					});
				} else {
					handleApiResponse(secondApiResponse);
				}
			},
			error: function () {
				showErrorNotification();
			},
		});
	});
});
