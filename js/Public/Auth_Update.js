var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;

function handlePageUpdatePermissions(currentUser, currentUrl) {
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
				(currentUrl.includes("orderDetail") && page.name === "訂單資料") ||
				(currentUrl.includes("unsubscribeDetail") && page.name === "退貨單資料") ||
				(currentUrl.includes("depotComponentDetail") && page.name === "零件資料") ||
				(currentUrl.includes("wareHouseDetail") && page.name === "入庫單") ||
				(currentUrl.includes("shipDetail") && page.name === "出庫申請單") ||
				(currentUrl.includes("inventoryDetail") && page.name === "盤點資料") ||
				(currentUrl.includes("accountDetail") && page.name === "帳號資料") ||
				(currentUrl.includes("purchaseDetail") && page.name === "零件採購單資料") ||
				(currentUrl.includes("roleAuthorize") && page.name === "角色權限")
			) {
				currentPageAuth = page.auth;
				if (!currentPageAuth.includes("update")) {
					document.body.style.display = "none";
					window.history.back();
				}

				if (currentPageAuth.includes("read")) {
					const updateButton = document.getElementById("updateButton");
					updateButton.disabled = false;
				}

				if (currentPageAuth.includes("update")) {
					const updateButton = document.getElementById("updateButton");
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
