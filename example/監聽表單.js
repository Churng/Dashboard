$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	// 添加表单提交事件监听器
	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			// 处理表单提交
			event.preventDefault();

			// 获取ID
		}
		uploadForm.classList.add("was-validated");
	});
});

// 監聽表單範本
