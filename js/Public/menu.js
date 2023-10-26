var currentData = localStorage.getItem("currentUser");
var currentData = JSON.parse(currentData);
var menuData = currentData.userretrunData;

// 获取要放置菜单项的父元素
const dynamicMenu = document.getElementById("dynamicMenu");

function compareMenuOrder(a, b) {
	return a.menuOrder - b.menuOrder;
}

function generateMenu(data, parentId) {
	const parentItems = data
		.filter((item) => item.mainCategoryId === parentId && item.type === "1st")
		.sort(compareMenuOrder);

	const titleToIconMap = {
		手冊管理: "fa fa-tachometer-alt me-2",
		門市管理: "fa fa-laptop me-2",
		零件管理: "far fa-folder me-2",
		訂單管理: "far fa-file-alt me-2",
		通知管理: "far fa-file-alt me-2",
		出入庫管理: "far fa-folder me-2",
		盤點作業: "fas fa-table me-2",
		帳號管理: "fa fa-th me-2",
		零件採購管理: "far fa-folder me-2",
	};

	parentItems.forEach((parentItem) => {
		const parentMenuItem = document.createElement("div");
		parentMenuItem.className = "nav-item dropdown";

		const parentDropdownLink = document.createElement("a");
		parentDropdownLink.href = parentItem.url || "javascript:void(0)";
		parentDropdownLink.className = "nav-link dropdown-toggle";
		parentDropdownLink.setAttribute("data-bs-toggle", "dropdown");
		parentDropdownLink.textContent = parentItem.name;

		const iconClass = titleToIconMap[parentItem.name] || "fa-circle";

		const icon = document.createElement("i");
		icon.className = `fas ${iconClass}`;

		parentDropdownLink.prepend(icon);

		const parentDropdownMenu = document.createElement("div");
		parentDropdownMenu.className = "dropdown-menu bg-transparent border-0";

		parentMenuItem.appendChild(parentDropdownLink);
		parentMenuItem.appendChild(parentDropdownMenu);

		dynamicMenu.appendChild(parentMenuItem);

		// 递归生成子层菜单项
		generateSubMenu(data, parentItem.id, parentDropdownMenu);
	});
}

function generateSubMenu(data, parentId, parentDropdownMenu) {
	const subItems = data
		.filter((item) => item.mainCategoryId === parentId && item.type === "2st")
		.sort(compareMenuOrder);

	subItems.forEach((subItem) => {
		const subMenuItem = document.createElement("a");
		subMenuItem.href = subItem.url || "javascript:void(0)";
		subMenuItem.className = "dropdown-item";
		subMenuItem.textContent = subItem.name;

		parentDropdownMenu.appendChild(subMenuItem);

		// 如果子项还有子层，继续递归生成
		generateSubMenu(data, subItem.id, subMenuItem);
	});
}
generateMenu(menuData, null);

// 分隔線
