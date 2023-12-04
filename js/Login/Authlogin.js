//User login info

var userData = localStorage.getItem("currentUser");
var userObject = JSON.parse(userData);
var userName = userObject.userName;
var userPhoto = userObject.userPhoto;

//Authlogin
$(document).ready(function () {
	var currentUser = localStorage.getItem("userData");

	if (!userData || !currentUser) {
		window.location.href = "signin.html";
	}
});

// 使用者名稱、圖片
window.onload = function () {
	var userNameElement = document.getElementById("userName");
	userNameElement.textContent = userName;

	var imgElement = document.querySelector(".userImg");
	imgElement.src = userPhoto;
};

// log-out
$(function () {
	// 登出按鈕的点击事件处理
	$("#logout").on("click", function () {
		// 移除 localStorage 中的用户数据
		localStorage.removeItem("userData");
		localStorage.removeItem("currentUser");
		window.history.replaceState({}, document.title, "signin.html");

		window.location.href = "signin.html";
	});
});

// 通知數字
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminNotificationApi'
	// 組裝菜單所需資料
	var action = "getNotificationList";
	var chsmtoGetNotificationList = user_session_id + action + "HBAdminNotificationApi";
	var chsm = CryptoJS.MD5(chsmtoGetNotificationList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/notification`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			// console.log("成功响应：", responseData);
			var unreadMsgNumElement = document.getElementById("unreadMsgNum");
			if (unreadMsgNumElement) {
				unreadMsgNumElement.textContent = responseData.unReadAmount;
			}
		},
		error: function (error) {
			console.error("错误:", error);
		},
	});
});
