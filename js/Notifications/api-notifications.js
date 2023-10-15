function handleLoginExpiration(apiResponse) {
	if (apiResponse.returnCode === "003") {
		toastr.warning(apiResponse.returnMessage);
		setTimeout(function () {
			window.location.href = "0-signin.html"; // 重定向到登录页面的URL
		}, 1000);
	}
}
