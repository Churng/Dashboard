// 获取当前页面路径
const currentPath = window.location.pathname;

// 获取菜单项容器
const dynamicMenu = document.getElementById("dynamicMenu");

// 找到所有的菜单项
const menuItems = dynamicMenu.querySelectorAll(".nav-link.dropdown-toggle");

// 添加点击事件处理程序来记录展开的菜单项状态
menuItems.forEach((menuItem) => {
	menuItem.addEventListener("click", () => {
		// 获取点击的菜单项的URL
		const menuUrl = menuItem.getAttribute("href");

		// 将展开的菜单项URL存储在localStorage中
		localStorage.setItem("expandedMenu", menuUrl);
	});
});

// 在页面加载时应用展开的菜单项状态
window.addEventListener("load", () => {
	// 从localStorage中获取展开的菜单项URL
	const expandedMenuUrl = localStorage.getItem("expandedMenu");

	if (expandedMenuUrl) {
		// 找到对应的菜单项并展开
		const expandedMenuItem = dynamicMenu.querySelector(`[href="${expandedMenuUrl}"]`);

		if (expandedMenuItem) {
			// 找到父菜单项并展开
			const parentDropdown = expandedMenuItem.closest(".dropdown");
			if (parentDropdown) {
				parentDropdown.classList.add("show");
			}
		}
	}
});

// 生成菜单
// (您可以在此之后调用您的generateMenu函数)
