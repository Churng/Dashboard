//User login info

if (typeof Storage !== "undefined") {
	var userData = localStorage.getItem("currentUser");

	if (userData) {
		var userObject = JSON.parse(userData);

		var userName = userObject.userName;
		var userPhoto = userObject.userPhoto;
	} else {
		console.log("在localStorage中未找到個人資料。");
	}
} else {
	console.log("瀏覽器不支持localStorage。");
}

//Authlogin
$(function () {
	var userData = localStorage.getItem("userData");
	var currentUser = localStorage.getItem("currentUser");

	if (!userData || !currentUser) {
		window.location.href = "0-signin.html";
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
		window.history.replaceState({}, document.title, "0-signin.html");

		window.location.href = "0-signin.html";
	});
});
