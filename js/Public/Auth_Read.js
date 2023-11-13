var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;
function handlePageReadPermissions(currentUser, currentUrl) {
	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			console.log("currentUrl:", currentUrl);
			console.log("page.auth:", page.auth);
			if (currentUrl.includes("manualDetail") && Array.isArray(page.auth)) {
				if (!page.auth.includes("read")) {
					document.body.style.display = "none";
					window.history.back();
				}

				if (page.auth.includes("read")) {
					hideButton(document.getElementById("saveButton"));
					hideButton(document.getElementById("updateButton"));
					// hideButton(document.getElementById("downloadBtn"));
					const elementsWithClass = document.getElementsByClassName("form-control");
					for (let i = 0; i < elementsWithClass.length; i++) {
						elementsWithClass[i].disabled = true;
					}
				}
			}
		}
	}
}

// 创建一个函数，根据元素隐藏
function hideButton(element) {
	if (element) {
		element.style.display = "none";
	}
}

// 创建一个函数，根据按钮ID来显示按钮
function showButton(element) {
	if (element) {
		element.style.display = "block";
	}
}
