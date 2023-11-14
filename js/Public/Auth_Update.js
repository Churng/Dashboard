var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;
function handlePageUpdatePermissions(currentUser, currentUrl) {
	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];

			if (currentUrl.includes("manualDetail") && Array.isArray(page.auth)) {
				if (!page.auth.includes("read")) {
					document.body.style.display = "none";
					window.history.back();
				}

				if (page.auth.includes("read")) {
					const updateButton = document.getElementById("updateButton");
					updateButton.disabled = false;
				}

				if (page.auth.includes("update")) {
					const updateButton = document.getElementById("updateButton");
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
