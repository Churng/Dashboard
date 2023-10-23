// 监听菜单项的点击事件
document.getElementById("dynamicMenu").addEventListener("click", (event) => {
	// 获取点击的菜单项的数据属性 data-page
	// 从localStorage中获取currentUser的userretrunData
	const userretrunData = JSON.parse(localStorage.getItem("currentUser"));
	const targetName = userretrunData.userretrunData;

	// 获取当前页面的路径
	const currentPath = window.location.pathname; // 根据实际情况可能需要适当的处理
	console.log(currentPath);

	// 从路径中提取页面名称
	// const currentPageName = extractPageNameFromPath(currentPath);
	console.log(currentPageName);

	// 查找当前页面的权限信息
	const currentPageAuth = targetName.find((data) => data.url === currentPageName);

	// 如果找到了对应页面的权限信息...
	if (currentPageAuth) {
		// 判断是否具有read权限
		if (currentPageAuth.auth.includes("read")) {
			// 可以查看页面
			console.log("可以查看页面");
		}

		// 判断是否具有insert权限
		if (currentPageAuth.auth.includes("insert")) {
			// 显示上传按钮
			console.log("显示上传按钮");
		}

		// 判断是否具有update权限
		if (currentPageAuth.auth.includes("update")) {
			// 显示更新按钮
			console.log("显示更新按钮");
		}

		// 判断是否具有delete权限
		if (currentPageAuth.auth.includes("delete")) {
			// 显示删除按钮
			console.log("显示删除按钮");
		}
	} else {
		// 如果没有找到对应页面的权限信息，可以采取默认的操作或者显示权限不足的提示
		console.log("没有权限查看当前页面");
	}
});

function extractPageNameFromPath(path) {
	// 实现根据路径提取页面名称的逻辑
	// 例如，如果路径是 "/page1"，你可以返回 "page1"
}
