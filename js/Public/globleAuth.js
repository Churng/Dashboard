// 權限設定

function handlePagePermissions(currentUser, currentUrl) {
	if (currentUser.userretrunData) {
		for (var i = 0; i < currentUser.userretrunData.length; i++) {
			var page = currentUser.userretrunData[i];
			if (currentUrl.includes(page.url) && Array.isArray(page.auth)) {
				// 1
				if (page.auth.includes("read")) {
					hideButton(document.getElementById("addButton"));
					hideButton(document.getElementById("saveButton"));
					hideButton(document.getElementById("updateButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "inline-block";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}
				}

				// 12
				if (page.auth.includes("read") && page.auth.includes("insert")) {
					showButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var downloadButtons = document.querySelectorAll("[data-button-type='download']");
					for (var l = 0; l < downloadButtons.length; l++) {
						downloadButtons[l].style.display = "block";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "inline-block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "none";
					}
				}
				// 13
				if (page.auth.includes("read") && page.auth.includes("update")) {
					hideButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var downloadButtons = document.querySelectorAll("[data-button-type='download']");
					for (var l = 0; l < downloadButtons.length; l++) {
						downloadButtons[l].style.display = "block";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "inline-block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "none";
					}
				}

				// 14
				if (page.auth.includes("read") && page.auth.includes("delete")) {
					hideButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "inline-block";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "inline-block";
					}
				}

				// 23
				if (page.auth.includes("insert") && page.auth.includes("update")) {
					showButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "inline-block";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "none";
					}
				}

				// 24
				if (page.auth.includes("insert") && page.auth.includes("delete")) {
					showButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "none";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "inline-block";
					}
				}

				// 24
				if (page.auth.includes("insert") && page.auth.includes("delete")) {
					showButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "none";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "inline-block";
					}
				}

				// 34
				if (page.auth.includes("update") && page.auth.includes("delete")) {
					hideButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "inline-block";
					}

					var readButtons = document.querySelectorAll("[data-button-type='download']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "inline-block";
					}
				}

				// 1234
				if (
					page.auth.includes("read") &&
					page.auth.includes("insert") &&
					page.auth.includes("update") &&
					page.auth.includes("delete")
				) {
					showButton(document.getElementById("addButton"));

					var readButtons = document.querySelectorAll("[data-button-type='read']");
					for (var j = 0; j < readButtons.length; j++) {
						readButtons[j].style.display = "none";
					}

					var downloadButtons = document.querySelectorAll("[data-button-type='download']");
					for (var l = 0; l < downloadButtons.length; l++) {
						downloadButtons[l].style.display = "block";
					}

					var updateButtons = document.querySelectorAll("[data-button-type='update']");
					for (var k = 0; k < updateButtons.length; k++) {
						updateButtons[k].style.display = "inline-block";
					}

					var deleteButtons = document.querySelectorAll("[data-button-type='delete']");
					for (var m = 0; m < deleteButtons.length; m++) {
						deleteButtons[m].style.display = "inline-block";
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

// 调用权限控制函数
var currentUser = JSON.parse(localStorage.getItem("currentUser"));
var currentUrl = window.location.href;

// handlePagePermissions(currentUser, currentUrl);
