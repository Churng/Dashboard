// 取得列表
var table;
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getManualList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminManualApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	table = $("#manual-management").DataTable({
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="manualDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}">修改</a>`;

					var deleteButtonHtml = `<button class="btn btn-danger delete-button" style="display:none" data-button-type="delete" data-id="${row.id}" data-filename="${row.fileName}">刪除</button>`;

					var readButtonHtml = `<a href="manualDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-id="${row.id}">查看詳請</a>`;

					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml + "&nbsp;" + deleteButtonHtml;

					return buttonsHtml;
				},
			},
			{
				// Download button column
				render: function (data, type, row) {
					var downloadButtonHtml = "";
					if (row.file) {
						downloadButtonHtml = `<button download style="display:none" class="btn btn-primary file-download" id="download-button" data-button-type="download" data-file="${row.file}" data-fileName="${row.fileName}">下載</button>`;
					} else {
						downloadButtonHtml = `<button style="display:none" class="btn btn-primary" data-button-type="download" disabled>無法下載</button>`;
					}
					return downloadButtonHtml;
				},
			},
			{ data: "fileName" },
			{ data: "brandName" },
			{ data: "year" },
			{ data: "applicableType" },
			{ data: "remark" },
			{ data: "createTime" },
			{ data: "createOperator" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
			hideDownloadColumn();
		},
		columnDefs: [{ orderable: false, targets: 0 }],
		order: [],
	});
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/manual`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1") {
				updatePageWithData(responseData, table);
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 表格填充
function updatePageWithData(responseData, table) {
	table.clear().rows.add(responseData.returnData).draw();
}

// 隐藏下载列
function hideDownloadColumn() {
	if (table) {
		var rows = table.rows({ search: "applied" }).nodes();
		$(rows).each(function () {
			var downloadButtonCell = $(this).find("td:eq(1)");
			if ($(downloadButtonCell).find("button").css("display") === "none") {
				table.column(1).visible(false);
				return false;
			}
		});
	}
}

// 监听修改按钮的点击事件
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});

$(document).on("click", ".read-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partRId", id);
});
//更新數據
function refreshDataList() {
	var dataTable = $("#manual-management").DataTable();
	dataTable.clear().draw();

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminManualApi'
	// 組裝菜單所需資料
	var action = "getManualList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminManualApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	$("#manual-management").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/manual`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				updatePageWithData(responseData, table);
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

//刪除
$(document).on("click", ".delete-button", function () {
	var formData = new FormData(); // 在外部定义 formData

	var deleteButton = $(this); // 保存删除按钮元素的引用
	var itemId = deleteButton.data("id");
	var itemfileName = deleteButton.data("filename");
	// console.log(itemId, itemfileName);

	var data = {
		fileName: itemfileName,
		id: itemId,
	};

	// 将对象转换为 JSON 字符串
	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".confirm-delete");

	toastr.options = {
		closeButton: true, // 显示关闭按钮
		timeOut: 0, // 不自动关闭
		extendedTimeOut: 0, // 不自动关闭
		positionClass: "toast-top-center", // 设置提示位置
	};

	toastr.warning(
		"確定要刪除所選文件嗎？<br/><br><button class='btn btn-danger confirm-delete'>删除</button>",
		"確定刪除",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".confirm-delete", function () {
		// 获取本地存储中的ID
		// 从localStorage中获取session_id和chsm
		// 解析JSON字符串为JavaScript对象
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminManualApi'
		var action = "deleteManualDetail";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminManualApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		// 设置其他formData字段
		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);

		// 发送删除请求
		$.ajax({
			type: "POST",
			url: `${apiURL}/manual`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileDeleteNotification();
					setTimeout(function () {
						refreshDataList();
					}, 1000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	});
});

//下載檔案

$(document).on("click", ".file-download", function (e) {
	e.preventDefault(); // 阻止默认链接行为
	var fileName = $(this).data("file");
	var apiName = "manual";
	if (fileName) {
		downloadPdfFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});
