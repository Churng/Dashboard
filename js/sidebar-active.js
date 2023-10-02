$(document).ready(function () {
	console.log(32423423);
	// // 找到所有带有 .nav-item.dropdown 类的元素
	// $(".nav-item.dropdown").each(function () {
	// 	var dropdownToggle = $(this).find(".nav-link.dropdown-toggle");
	// 	var dropdownMenu = $(this).find(".dropdown-menu");

	// 	// 获取唯一的菜单标识符
	// 	var menuId = dropdownMenu.attr("id");

	// 	// 检查 localStorage 中是否有展开状态的信息
	// 	var isMenuOpen = localStorage.getItem(menuId) === "open";

	// 	if (isMenuOpen) {
	// 		// 如果 localStorage 中有展开状态，则展开菜单
	// 		dropdownMenu.addClass("show");
	// 	}

	// 	// 监听下拉菜单的显示事件
	// 	dropdownToggle.on("click", function (e) {
	// 		e.preventDefault(); // 阻止默认点击事件
	// 		if (!dropdownMenu.hasClass("show")) {
	// 			// 如果菜单被展开，保存展开状态到 localStorage
	// 			localStorage.setItem(menuId, "open");
	// 		} else {
	// 			// 如果菜单被关闭，从 localStorage 中移除展开状态
	// 			localStorage.removeItem(menuId);
	// 		}

	// 		// 手动跳转到链接的 href 属性
	// 		window.location.href = $(this).attr("href");
	// 	});
	// });
});
