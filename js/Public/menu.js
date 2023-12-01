var currentData = localStorage.getItem("currentUser");
var currentData = JSON.parse(currentData);
var menuData = currentData.userretrunData;

const dynamicMenu = document.getElementById("dynamicMenu");

function compareMenuOrder(a, b) {
	return a.menuOrder - b.menuOrder;
}

function hasPermission(auth, permission) {
	return auth.includes(permission);
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
		const hasReadPermission = hasPermission(parentItem.auth, "read");
		if (!hasReadPermission) {
			return;
		}

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

		generateSubMenu(data, parentItem.id, parentDropdownMenu);
	});
}

function generateSubMenu(data, parentId, parentDropdownMenu) {
	const subItems = data
		.filter((item) => item.mainCategoryId === parentId && item.type === "2st")
		.sort(compareMenuOrder);

	subItems.forEach((subItem) => {
		const hasReadPermission = hasPermission(subItem.auth, "read");

		if (!hasReadPermission) {
			return;
		}

		const subMenuItem = document.createElement("a");
		subMenuItem.href = subItem.url || "javascript:void(0)";
		subMenuItem.className = "dropdown-item";
		subMenuItem.textContent = subItem.name;

		parentDropdownMenu.appendChild(subMenuItem);

		generateSubMenu(data, subItem.id, subMenuItem);
	});
}

generateMenu(menuData, null);

//菜單展開
// 获取当前页面路径
let currentPath = window.location.pathname;
if (currentPath.charAt(0) === "/") {
	currentPath = currentPath.slice(1);
}
console.log(currentPath);

// 获取菜单项容器
const getdynamicMenu = document.getElementById("dynamicMenu");

// 找到所有的菜单项

const linksNodeList = document.querySelectorAll(".dropdown-menu a");
const links = Array.from(linksNodeList).map((link) => link.getAttribute("href"));

const matchedLinks = links.filter((link) => link === currentPath);

localStorage.setItem("expandedMenu", matchedLinks[0]);

// 在页面加载时应用展开的菜单项状态
window.addEventListener("load", () => {
	// 从localStorage中获取展开的菜单项URL
	const expandedMenuUrl = localStorage.getItem("expandedMenu");

	if (expandedMenuUrl) {
		// 找到对应的菜单项并展开
		const expandedMenuItem = getdynamicMenu.querySelector(`[href="${expandedMenuUrl}"]`);

		if (expandedMenuItem) {
			// 找到父菜单项并展开
			const parentDropdown = expandedMenuItem.closest(".dropdown-menu");
			if (parentDropdown) {
				parentDropdown.classList.add("show");
			}
		}
	}
});
