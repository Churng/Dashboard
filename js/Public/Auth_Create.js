var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;
function handlePageCreatePermissions(currentUser, currentUrl) {
	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			if (currentUrl.includes("manualDetail") && Array.isArray(page.auth)) {
				if (!page.auth.includes("read")) {
					document.body.style.display = "none";
					window.history.back();
				}

				if (page.auth.includes("insert")) {
					const updateButton = document.getElementById("saveButton");
					updateButton.disabled = false;
				}

				if (page.auth.includes("download")) {
					showButton(document.getElementById("downloadBtn"));
				}
			}
		}
	}
}

function hideButton(element) {
	if (element) {
		element.style.display = "none";
	}
}

function showButton(element) {
	if (element) {
		element.style.display = "block";
	}
}

// 调用权限控制函数
var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;
handlePagePermissions(currentUser, currentUrl);
