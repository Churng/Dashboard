var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;

function handlePageCreatePermissions(currentUser, currentUrl) {
	let currentPageAuth = null;
	let pageFound = false;

	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			if (
				(currentUrl.includes("manualDetail") && page.name === "零件手冊資料") ||
				(currentUrl.includes("storeDetail") && page.name === "門市資料") ||
				(currentUrl.includes("brandDetail") && page.name === "零件品牌資料") ||
				(currentUrl.includes("componentDetail") && page.name === "零件定義資料") ||
				(currentUrl.includes("accountDetail") && page.name === "帳號資料") ||
				(currentUrl.includes("roleAuthorize") && page.name === "角色權限") ||
				(currentUrl.includes("inventoryDetail") && page.name === "盤點資料") ||
				(currentUrl.includes("wareHouseDetail") && page.name === "入庫單")
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

				pageFound = true;
				break;
			}
		}
	}

	if (!pageFound) {
		document.body.style.display = "none";
		window.history.back();
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
