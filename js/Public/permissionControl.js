function handlePermissionControl() {
	const currentUser = JSON.parse(localStorage.getItem("currentUser"));

	if (currentUser.userretrunData) {
		currentUser.userretrunData.forEach((page) => {
			if (page.name && page.url === null && page.auth) {
				if (!page.auth.includes("read")) {
					showErrorAuthNotification();
					window.location.href = "index.html";
				}
			}

			if (page.name && page.url !== null && page.auth) {
				//read
				if (page.auth.includes("read")) {
					document.getElementById("addButton").style.display = "block";
				}
				//insert
				if (page.auth.includes("insert")) {
					document.getElementById("addButton").style.display = "block";
				}
				// update
				if (page.auth.includes("update")) {
					var modifyButtons = document.getElementsByClassName("update-button");
					for (var i = 0; i < modifyButtons.length; i++) {
						modifyButtons[i].style.display = "inline-block";
					}
				}
				// delete
				if (page.auth.includes("delete")) {
					var deleteButtons = document.getElementsByClassName("delete-button");
					for (var j = 0; j < deleteButtons.length; j++) {
						deleteButtons[j].style.display = "inline-block";
					}
				}
			}
		});
	}
}

function generateViewButton(data) {
	if (userPermissions["auth:read"]) {
		const viewButtonHtml =
			'<a href="2-manual-management_view.html" class="btn btn-primary text-white view-button" data-id="' +
			data.id +
			'">查看</a>';
		return viewButtonHtml;
	}
	return "";
}
