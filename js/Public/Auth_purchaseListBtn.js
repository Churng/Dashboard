var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;

function handlePagePurchaseListBtnPermissions(currentUser, currentUrl) {
	let currentPageAuth = null;
	let pageFound = false;

	if (currentUser && currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			if (
				page.name === "零件採購單列表" &&
				page.auth.includes("update") &&
				currentUser.userretrunData.some((item) => item.name === "零件採購單資料" && item.auth.includes("update"))
			) {
				currentPageAuth = page.auth;
				pageFound = true;

				// 启用按钮
				enableButtons(["select-all-btn", "update-detail-btn", "delete-detail-btn"]);

				break;
			}
		}
	}

	if (!pageFound) {
		console.log("No '零件採購單資料' page found.");
	}
}

// 根据按钮ID启用按钮
function enableButtons(buttonIds) {
	buttonIds.forEach((id) => {
		var element = document.getElementById(id);
		if (element) {
			element.disabled = false;
		}
	});
}

// 调用函数进行权限处理
handlePagePurchaseListBtnPermissions(currentUser, currentUrl);
