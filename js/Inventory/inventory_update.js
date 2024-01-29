// 倉庫儲位帶入資料
$(document).ready(function () {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminComponentApi'
	// 組裝菜單所需資料
	var action = "getComponentDepotPosition";
	var chsmtoGetManualList = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			if (responseData.returnCode === "1") {
				const depotPositionList = document.getElementById("selectdepotPosition");

				const defaultOption = document.createElement("option");
				defaultOption.text = "請選擇儲位";
				defaultOption.value = "";
				depotPositionList.appendChild(defaultOption);

				for (let i = 0; i < responseData.returnData.length; i++) {
					const positoin = responseData.returnData[i];
					const positiondName = positoin.depotPosition;

					const option = document.createElement("option");
					option.text = positiondName;
					option.value = positiondName;

					depotPositionList.appendChild(option);
				}
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

//點擊下載範例
$(document).on("click", "#downloadLink", function () {
	downloadCsvFile();
});

// 取得詳細資料
$(document).ready(function () {
	var partId = localStorage.getItem("inventoryNo");
	const dataId = { inventoryNo: partId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminInventoryApi'
	// 组装所需数据
	var action = "getInventoryDetail";
	var chsmtoGetInventoryDetail = user_session_id + action + "HBAdminInventoryApi";
	var chsm = CryptoJS.MD5(chsmtoGetInventoryDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/inventory`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const inventoryData = responseData.inventoryData;

				console.log(responseData);

				$("#inventoryId").val(inventoryData.inventoryNo);
				$("#getPositon").val(inventoryData.depotPosition);
				$("#EditAccount").val(inventoryData.createOperator);
				$("#BuildTime").val(inventoryData.createTime);
				$("#EditTime").val(inventoryData.updateTime);

				updatePageWithData(responseData);
				uploadCsvData(responseData);

				//按鈕控制

				//結束盤點
				var completeInventoryBtn = document.getElementById("completeInventoryBtn");
				if (completeInventoryBtn) {
					if (Boolean(inventoryData.if_completeInventory) === true) {
						completeInventoryBtn.disabled = false;
					} else {
						completeInventoryBtn.disabled = true;
					}
				}

				//下載excel
				// buttons-csv
				var downloadExcelBtn = document.getElementsByClassName("buttons-csv")[0];
				if (downloadExcelBtn) {
					if (Boolean(inventoryData.if_downloadInventoryExcel) === true) {
						downloadExcelBtn.disabled = false;
					} else {
						downloadExcelBtn.disabled = true;
					}
				}

				//匯入excel按鈕
				var downloadInput = document.getElementById("fileInput");
				if (downloadExcelBtn) {
					if (Boolean(inventoryData.if_importExcel) === true) {
						downloadInput.disabled = false;
					} else {
						downloadInput.disabled = true;
					}
				}

				// 查找儲位
				var searchdepotPosition = document.getElementById("searchdepotPosition");
				if (downloadExcelBtn) {
					if (Boolean(inventoryData.if_searchDepotPosition) === true) {
						searchdepotPosition.disabled = false;
					} else {
						searchdepotPosition.disabled = true;
					}
				}

				// 暫存
				var updateInventoryDetailBtn = document.getElementById("updateInventoryDetailBtn");
				if (downloadExcelBtn) {
					if (Boolean(inventoryData.if_tempSave) === true) {
						updateInventoryDetailBtn.disabled = true;
					} else {
						updateInventoryDetailBtn.disabled = false;
					}
				}
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 顯示已上傳檔案
function displayFileNameInInput(fileName) {
	const fileInput = document.getElementById("fileInput");

	if (fileName) {
		const dataTransfer = new DataTransfer();

		const blob = new Blob([""], { type: "application/octet-stream" });
		const file = new File([blob], fileName);

		dataTransfer.items.add(file);

		const fileList = dataTransfer.files;

		fileInput.files = fileList;
	}
}

// 上傳excel
var tableCsv;
var getinventoryNo;
function uploadCsvData(responseData) {
	// 清空表格数据
	var dataTable = $("#updateExcel").DataTable();
	dataTable.clear().destroy();
	var data = responseData.uploadFileLog;
	getinventoryNo = data[0].inventoryNo;

	tableCsv = $("#updateExcel").DataTable({
		columns: [
			{
				// Download button column
				render: function (data, type, row) {
					var downloadButtonHtml = "";
					if (row.file) {
						downloadButtonHtml = `<button download style="display:inline-block" class="btn btn-primary file-download" id="download-button" data-button-type="download" data-file="${row.file}" data-fileName="${row.fileName}">下載</button>`;
					} else {
						downloadButtonHtml = `<button style="display:" class="btn btn-primary" data-button-type="download" disabled>無法下載</button>`;
					}
					return downloadButtonHtml;
				},
			},
			{ data: "fileName" },
			{ data: "createTime" },
			{ data: "createOperator" },
		],
		drawCallback: function () {
			// handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	tableCsv.rows.add(data).draw();
}

// 盤點資料
var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#insertContent").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#insertContent").DataTable({
		autoWidth: false,
		stateSave: true,
		dom: "Bfrtip",
		buttons: [
			"CSV",
			{
				extend: "csv",
				text: "下載EXCEL",
				bom: true,
				filename: "盤點結果",
				exportOptions: {
					columns: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
					format: {
						body: function (data, row, column, node) {
							if (column === 12) {
								const inputElement = $(node).find("input.editable-cell");
								return inputElement.val();
							} else {
								return data;
							}
						},
					},
				},
			},
			"excel",
		],
		responsive: true,
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var ifInventoryLoss = row.if_inventory_loss;
					var ifInventoryStockIn = row.if_inventory_stock_in;
					var ifStockInDetail = row.if_stockInDetail;

					// 盤點損失
					var inventoryLossButtonHtml = "";
					if (Boolean(ifInventoryLoss) === true) {
						inventoryLossButtonHtml += `<button class="btn btn-warning InventoryLoss-button" data-id="${row.id}">列入盤點損失</button>`;
					}

					//盤點入庫
					var inventoryStockInButtonHtml = "";
					if (Boolean(ifInventoryStockIn) === true) {
						inventoryStockInButtonHtml += `<button class="btn btn-primary  InventoryStockIn-button" data-id="${row.id}">盤盈入庫</button>`;
					}

					// 查看入庫單 if_stockInDetail
					var stockInDetailButtonHtml = "";
					if (Boolean(ifStockInDetail) === true) {
						stockInDetailButtonHtml += `<button class="btn btn-primary StockInDetail-button" data-stockinid="${row.stockInId}">查看入庫單</button>`;
					}

					var buttonsHtml =
						inventoryLossButtonHtml + "&nbsp;" + inventoryStockInButtonHtml + "&nbsp;" + stockInDetailButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "id" },
			{ data: "depotId" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "orderNo" },
			{ data: "storeName" },
			{ data: "orderNote" },
			{ data: "cost", defaultContent: "" },
			{ data: "depotAmount" },
			{ data: "depotPosition" },
			{ data: "inventoryAmount" },
			{ data: "statusName" },
			{
				data: "remark",
				type: "input",
				render: function (data, type, row) {
					const value = data !== null ? data : "";
					return `<input type="text" class="form-control editable-cell" data-id="${row.id}" data-value="${row.remark}" value="${row.remark}" />`;
				},
			},
		],
		drawCallback: function () {
			var api = this.api();
			// 檢查每個數據對象
			for (var i = 0; i < data.length; i++) {
				var obj = data[i];

				// 如果對象的特定鍵的值為空，則隱藏列
				if (obj.cost === "" || obj.cost === undefined) {
					api.column(8).visible(false);
				} else {
					// 否則，顯示列
					api.column(8).visible(true);
				}
			}
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();

	//資料篩選

	$("#inventoryStatus").on("change", function () {
		var selectedStatus = $(this).val();

		table.column(11).search(selectedStatus).draw();
	});
}

// 查看入庫單
$(document).on("click", ".StockInDetail-button", function () {
	var wareHouseId = $(this).data("stockinid");
	if (wareHouseId == null) {
		showErrorWHNotification();
		return;
	} else {
		localStorage.setItem("wareHouseId", wareHouseId);
		var newPageUrl = "wareHouseDetail_update.html";
		window.location.href = newPageUrl;
	}
});

// Remark取值
var changedCells;
$(document).ready(function () {
	changedCells = [];

	$("#insertContent tbody").on("blur", ".editable-cell", function () {
		const currentValue = $(this).val();
		const originalValue = $(this).data("value");
		const rowIndex = table.row($(this).closest("tr")).index();

		if (currentValue !== originalValue && currentValue.trim() !== "") {
			const rowData = table.row(rowIndex).data();
			const rowId = rowData.id;

			changedCells.push({
				id: rowId,
				remark: currentValue,
			});

			getChangedCellValues();
		}
	});

	function getChangedCellValues() {
		console.log("所有被更改的单元格值：", changedCells);
	}
});

//盤點入庫 InventoryStockIn-button
$(document).on("click", ".InventoryStockIn-button", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var InventoryStockInButton = $(this);
	var itemId = InventoryStockInButton.data("id");

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".InventoryStockIn");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要盤盈入庫嗎？<br/><br><button class='btn btn-danger InventoryStockIn'>確定</button>",
		"確定入庫",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".InventoryStockIn", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminInventoryApi'
		var action = "setInventoryStockIn";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminInventoryApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);
		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log(response);
				showSuccessuInventoryStockInNotification();
				if (response.returnCode === "1") {
					localStorage.setItem("reloadNeeded", "true");
					window.location.reload();
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

//列入盤點損失 InventoryLoss-button
$(document).on("click", ".InventoryLoss-button", function (e) {
	e.stopPropagation();
	var formData = new FormData();
	var InventoryLossButton = $(this);
	var itemId = InventoryLossButton.data("id");

	var data = {
		id: itemId,
	};

	var jsonData = JSON.stringify(data);

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".InventoryLoss");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要列入盤點損失嗎？<br/><br><button class='btn btn-danger InventoryLoss'>確定</button>",
		"確定列入",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".InventoryLoss", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminInventoryApi'
		var action = "setInventoryLoss";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminInventoryApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);
		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				showSuccessuInventoryLossNotification();
				if (response.returnCode === "1") {
					localStorage.setItem("reloadNeeded", "true");
					window.location.reload();
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

//結束盤點
$(document).on("click", "#completeInventoryBtn", function (e) {
	e.stopPropagation();
	var formData = new FormData();

	var data = {
		inventoryNo: getinventoryNo,
	};

	console.log(data);

	var jsonData = JSON.stringify(data);

	var remarkObj = [];

	if (changedCells && changedCells.length > 0) {
		for (var i = 0; i < changedCells.length; i++) {
			var cellData = changedCells[i];
			// var id = cellData.id;
			var remark = cellData.remark;
			var remarkData = {
				[cellData.id]: remark,
			};
			remarkObj.push(remarkData);
			console.log(remarkObj);
		}
	}
	var mergedObj = {};
	remarkObj.forEach((obj) => {
		Object.assign(mergedObj, obj);
	});

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".completeInventory");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要結束盤點嗎？<br/><br><button class='btn btn-danger completeInventory'>確定</button>",
		"確定結束盤點",
		{
			allowHtml: true,
		}
	);

	// 绑定新的点击事件处理程序
	$(document).on("click", ".completeInventory", function () {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// chsm = session_id+action+'HBAdminInventoryApi'
		var action = "completeInventory";
		var chsmtoDeleteFile = user_session_id + action + "HBAdminInventoryApi";
		var chsm = CryptoJS.MD5(chsmtoDeleteFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", jsonData);
		formData.set("inventoryRemarkList", JSON.stringify(mergedObj));

		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				showSuccessucompleteInventoryNotification();
				if (response.returnCode === "1") {
					setTimeout(function () {
						var newPageUrl = "inventoryList.html";
						window.location.href = newPageUrl;
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

//暫存修改:僅備註
$(document).on("click", "#updateInventoryDetailBtn", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".upload-content");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要暫存內容嗎？<br/><br><button class='btn btn-danger upload-content'>確定</button>",
		"確定完成暫存",
		{
			allowHtml: true,
		}
	);

	$(document).on("click", ".upload-content", function () {
		event.preventDefault();

		var updateObj = {};
		var updateObj = {
			inventoryNo: getinventoryNo,
		};

		//取值:remark
		var remarkObj = [];

		if (changedCells && changedCells.length > 0) {
			for (var i = 0; i < changedCells.length; i++) {
				var cellData = changedCells[i];
				// var id = cellData.id;
				var remark = cellData.remark;
				var remarkData = {
					[cellData.id]: remark,
				};
				remarkObj.push(remarkData);
				console.log(remarkObj);
			}
		}
		var mergedObj = {};
		remarkObj.forEach((obj) => {
			Object.assign(mergedObj, obj);
		});

		// console.log(JSON.stringify(mergedObj));

		// 从localStorage中获取session_id和chsm
		// 解析JSON字符串为JavaScript对象
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminInventoryApi'
		var action = "updateInventoryDetail";
		var chsmtoPostFile = user_session_id + action + "HBAdminInventoryApi";
		var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateObj));
		formData.set("inventoryRemarkList", JSON.stringify(mergedObj));

		console.log(formData);

		// 執行POST請求
		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				console.log(response);

				if (response.returnCode === "1") {
					showSuccesupdateInventoryDetailNotification();

					setTimeout(function () {
						window.location.reload();
					}, 1000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	});
});

//上傳檔案
$(document).on("click", "#uploadExcel", function (e) {
	e.stopPropagation();
	var formData = new FormData(); // 在外部定义 formData

	// 解绑之前的点击事件处理程序
	$(document).off("click", ".upload-excel");

	toastr.options = {
		closeButton: true,
		timeOut: 0,
		extendedTimeOut: 0,
		positionClass: "toast-top-center",
	};

	toastr.warning(
		"確定要上傳檔案嗎？<br/><br><button class='btn btn-danger upload-excel'>確定</button>",
		"確定完成上傳",
		{
			allowHtml: true,
		}
	);

	$(document).on("click", ".upload-excel", function () {
		event.preventDefault();
		var fileInput = $("#fileInput")[0];

		if (fileInput.files.length > 0) {
			for (var i = 0; i < fileInput.files.length; i++) {
				var file = fileInput.files[i];
				formData.append("inventory[]", file, file.name);
			}

			//取值
			var updateObj = {
				inventoryNo: getinventoryNo,
				fileName: file.name,
				file: file.name,
			};

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminInventoryApi'
			var action = "updateInventoryDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminInventoryApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(updateObj));

			// 執行POST請求
			$.ajax({
				type: "POST",
				url: `${apiURL}/inventory`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					if (response.returnCode === "1") {
						showSuccessuInsertCsvNotification();

						setTimeout(function () {
							window.location.reload();
						}, 1000);
					} else {
						handleApiResponse(response);
					}
				},
				error: function (error) {
					showErrorFileNotification();
				},
			});
		} else {
			showWarningNotification();
		}
	});
});

//下載檔案

$(document).on("click", ".file-download", function (e) {
	e.preventDefault(); // 阻止默认链接行为
	var fileName = $(this).data("file");
	var apiName = "inventory";
	if (fileName) {
		downloadCsvresulteFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});

//存TabId
$(".nav-link").click(function () {
	const tabId = $(this).attr("id");
	localStorage.setItem("activeTabId", tabId);
});

//存頁碼
$(document).on("page.dt", function () {
	var page = $("#insertContent").DataTable().page();
	localStorage.setItem("currentPage", page);
});

//Tab停留
function handleTabs() {
	// 檢查 localStorage 中是否有保存的 activeTabId 和 activePaginationIdx
	const activeTabId = localStorage.getItem("activeTabId");

	if (activeTabId) {
		// 移除所有元素的 active class
		$(".nav-link").removeClass("active");
		$(".tab-pane").removeClass("active show");

		// 添加 active class 到相應的標籤
		document.querySelector("#" + activeTabId).classList.add("active");

		// 顯示與 active 標籤相關聯的內容
		const tabContentId = document
			.querySelector("#" + activeTabId)
			.getAttribute("href")
			.substring(1);
		document.querySelector("#" + tabContentId).classList.add("active", "show");
	}
}

//頁數停留
function handlePages() {
	setTimeout(function () {
		var page = localStorage.getItem("currentPage");
		if (page) {
			table.page(parseInt(page)).draw(false);
		}
	}, 1000);
}

//重新整理停留畫面
$(document).ready(function () {
	const reloadNeeded = localStorage.getItem("reloadNeeded");
	if (reloadNeeded === "true") {
		handleTabs();
		handlePages();
		localStorage.removeItem("reloadNeeded");
	}
});
