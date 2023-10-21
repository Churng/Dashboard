document.addEventListener("DOMContentLoaded", function () {
	// 從本地儲存中獲取選單資料
	var currentData = localStorage.getItem("currentUser");
	var currentData = JSON.parse(currentData);
	var menuData = currentData.userretrunData;

	// 獲取選單容器
	var menuContainer = document.querySelector(".navbar-nav");

	// 建立一個物件來保存第一層選單項目
	var firstLevelMenu = {};

	// 遍歷選單資料
	menuData.forEach(function (menuItem) {
		if (menuItem.type === null) {
			// 如果 menuItem.type 為 null，則不處理
			return;
		}

		// 建立選單項目
		var dropdownItem = document.createElement("div");
		dropdownItem.className = "nav-item";

		// 建立連結元素
		var dropdownLink = document.createElement("a");
		dropdownLink.href = menuItem.url || "javascript:void(0)";
		dropdownLink.className = "nav-link";
		dropdownLink.textContent = menuItem.name;

		// 將連結元素添加到選單項目中
		dropdownItem.appendChild(dropdownLink);

		if (menuItem.type === "1st") {
			// 如果是第一層選單，設置下拉選單的相關屬性
			dropdownItem.className += " dropdown";
			dropdownLink.className += " dropdown-toggle";
			dropdownLink.setAttribute("data-bs-toggle", "dropdown");
			dropdownLink.setAttribute("role", "button");

			// 建立一個空的下拉選單容器供第一層選單使用
			var dropdownMenu = document.createElement("div");
			dropdownMenu.className = "dropdown-menu bg-transparent border-0";

			// 將第一層選單項目加入到下拉選單容器中
			dropdownItem.appendChild(dropdownMenu);

			// 儲存第一層選單項目以便後續引用
			firstLevelMenu[menuItem.id] = dropdownMenu;
		}

		if (menuItem.auth && menuItem.type === "2st") {
			// 如果是第二層選單且具有權限，將其添加到適當的第一層選單中
			var parentDropdown = firstLevelMenu[menuItem.mainCategoryId];
			if (parentDropdown) {
				var dropdownItemChild = document.createElement("a");
				dropdownItemChild.href = menuItem.url || "javascript:void(0)";
				dropdownItemChild.className = "dropdown-item";
				dropdownItemChild.textContent = menuItem.name;
				parentDropdown.appendChild(dropdownItemChild);
			}
		} else {
			// 如果不是第二層選單，則直接將其添加到選單容器中
			menuContainer.appendChild(dropdownItem);
		}

		if (menuItem.auth && menuItem.auth.includes("read")) {
			// 如果具有 "read" 權限，則顯示選單項目
			dropdownItem.style.display = "block";
		} else {
			// 如果不具有 "read" 權限，則隱藏選單項目
			dropdownItem.style.display = "none";
		}

		// 將連結元素添加到選單項目中
		dropdownItem.appendChild(dropdownLink);
	});
});
