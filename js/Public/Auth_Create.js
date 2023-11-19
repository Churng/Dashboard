var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;
function handlePageCreatePermissions(currentUser, currentUrl) {
	let currentPageAuth = null;

	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			if (
				(currentUrl.includes("manualDetail") && page.name === "零件手冊資料") ||
				(currentUrl.includes("storeDetail") && page.name === "門市資料") ||
				(currentUrl.includes("brandDetail") && page.name === "零件品牌資料")
			) {
				currentPageAuth = page.auth;
				if (!currentPageAuth.includes("insert")) {
					document.body.style.display = "none";
					window.history.back();
				}

				if (currentPageAuth.includes("insert")) {
					const updateButton = document.getElementById("saveButton");
					updateButton.disabled = false;
				}

				if (currentPageAuth.includes("download")) {
					showButton(document.getElementById("downloadBtn"));
				}

				break;
			}
		}
	}
	console.log("Auth values for current page:", currentPageAuth);
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
