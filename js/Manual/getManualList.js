$(document).ready(function () {
	// 获取“零件手册查询”菜单项
	var queryManualLink = $('.dropdown-item[href="2-manual-management_index.html"]');

	// 添加点击事件处理程序
	queryManualLink.click(function (event) {
		// 从localStorage中获取session_id和chsm
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const userData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = userData.sessionId;

		// 构建chsm
		var action = "getManualList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminManualApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

		// 发送POST请求到API以获取数据
		$.ajax({
			type: "POST",
			url: "https://88bakery.tw/HBAdmin/index.php?/api/manual",
			data: { session_id: user_session_id, action: action, chsm: chsm },
			success: function (response) {
				// 处理成功响应
				console.log("成功响应：", response);

				// 模拟从数据源获取的数据
				var responseData = {
					returnCode: response.returnCode,
					returnMessage: response.returnMessage,
					returnDataTotalAmount: response.returnDataTotalAmount,
					returnData: response.returnData,
				};

				// 获取表格元素
				var table = $("table");

				// 清空表格内容
				table.empty();

				// 填充数据到表格
				$.each(responseData.returnData, function (index, data) {
					// 创建新的表格行
					var row = $("<tr>");

					// 创建复选框单元格
					var checkboxCell = $("<td>").append($("<input>").attr("type", "checkbox"));
					row.append(checkboxCell);

					// 创建其他数据单元格
					var idCell = $("<td>").text(data.id);
					var fileNameCell = $("<td>").text(data.fileName);
					var brandNameCell = $("<td>").text(data.brandName);
					var yearCell = $("<td>").text(data.year);

					row.append(idCell, fileNameCell, brandNameCell, yearCell);

					// 将行添加到表格
					table.append(row);

					// 绑定点击事件，存储选中项目的ID
					row.click(function () {
						selectedItemId = $(this).find("td:eq(1)").text(); // 获取第二列（ID列）的文本
						selectedFileName = $(this).find("td:eq(2)").text(); // 获取第三列（fileName列）的文本

						// 存储选中的ID和fileName到localStorage
						var selectedData = { fileName: selectedFileName, id: selectedItemId };
						var selectedDataString = JSON.stringify(selectedData);
						localStorage.setItem("selectedData", selectedDataString);

						// 构建chsm和发送第二个API请求
						var action = "getManualDetail";
						var chsmtoGetManualDetail = user_session_id + action + "HBAdminManualApi";
						var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();
						var id = { id: parseInt(selectedItemId) };
						var currentDetailId = JSON.stringify(id);
						localStorage.setItem("id", currentDetailId);

						$.ajax({
							type: "POST",
							url: "https://88bakery.tw/HBAdmin/index.php?/api/manual",
							data: { action: action, session_id: user_session_id, chsm: chsm, data: JSON.stringify(id) },
							success: function (response) {
								console.log("成功响应：", response);
								// 处理第二个API的响应
								// 在这里可以执行其他操作
								// 例如，跳转到另一个页面
								// window.location.href = "檔案上傳測試.html";
							},
							error: function (error) {
								// 处理错误响应
								console.error("错误响应：", error);
							},
						});
					});
				});
			},
			error: function (error) {
				// 处理错误响应
				console.error("错误响应：", error);
			},
		});
	});
});
