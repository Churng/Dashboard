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

				$("#inventoryId").val(inventoryData.id);
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
				var downloadExelBtn = document.getElementById("downloadExelBtn");
				if (downloadExelBtn) {
					if (Boolean(inventoryData.if_downloadInventoryExcel) === true) {
						downloadExelBtn.disabled = false;
					} else {
						downloadExelBtn.disabled = true;
					}
				}

				//匯入excel按鈕
				var downloadInput = document.getElementById("fileInput");
				if (downloadExelBtn) {
					if (Boolean(inventoryData.if_importExcel) === true) {
						downloadInput.disabled = false;
					} else {
						downloadInput.disabled = true;
					}
				}

				// 查找儲位
				var searchdepotPosition = document.getElementById("searchdepotPosition");
				if (downloadExelBtn) {
					if (Boolean(inventoryData.if_searchDepotPosition) === true) {
						searchdepotPosition.disabled = false;
					} else {
						searchdepotPosition.disabled = true;
					}
				}

				// 暫存
				var updateInventoryDetailBtn = document.getElementById("updateInventoryDetailBtn");
				if (downloadExelBtn) {
					if (Boolean(inventoryData.if_tempSave) === true) {
						updateInventoryDetailBtn.disabled = false;
					} else {
						updateInventoryDetailBtn.disabled = true;
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
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var ifInventoryLoss = row.if_inventory_loss;
					var ifInventoryStockIn = row.if_inventory_stock_in;
					//盤點入庫
					var inventoryLossButtonHtml = "";
					if (Boolean(ifInventoryLoss) === true) {
						inventoryLossButtonHtml += `<button class="btn btn-warning InventoryLoss-button" data-id="${row.id}">列入盤點損失</button>`;
					}

					// 盤點損失
					var inventoryStockInButtonHtml = "";
					if (Boolean(ifInventoryStockIn) === true) {
						inventoryStockInButtonHtml += `<button class="btn btn-primary  InventoryStockIn-button" data-id="${row.id}">盤點入庫</button>`;
					}

					var buttonsHtml = inventoryLossButtonHtml + "&nbsp;" + inventoryStockInButtonHtml;

					return buttonsHtml;
				},
			},
			{ data: "id" },
			{ data: "componentNumber" },
			{ data: "componentName" },
			{ data: "suitableCarModel" },
			{ data: "orderNo" },
			{ data: "storeName" },
			{ data: "orderNote" },
			{ data: "cost" },
			{ data: "depotAmount" },
			{ data: "inventoryAmount" },
			{ data: "statusName" },
			{
				data: "remark",

				render: function (data, type, row) {
					const value = data !== null ? data : "";
					return `<span contenteditable="true" class="editable-cell" data-id="${row.id}">${data}</span>`;
				},
			},
		],
		drawCallback: function () {
			// handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});
	table.rows.add(data).draw();
}

// Remark取值
var changedCells;
$(document).ready(function () {
	changedCells = [];
	$("#insertContent tbody").on("blur", ".editable-cell", function () {
		const currentValue = $(this).text();
		const originalValue = $(this).data("original-value");
		const rowIndex = table.row($(this).closest("tr")).index();

		if (currentValue !== originalValue) {
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
		"確定要盤點入庫嗎？<br/><br><button class='btn btn-danger InventoryStockIn'>確定</button>",
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
					console.log(response);
					// setTimeout(function () {
					// 	var newPageUrl = "unsubscribeDetail.html";
					// 	window.location.href = newPageUrl;
					// }, 3000);
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
	console.log(InventoryLossButton);
	var itemId = InventoryLossButton.data("id");
	console.log(itemId);

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
					console.log(response);
					// setTimeout(function () {
					// 	var newPageUrl = "unsubscribeDetail.html";
					// 	window.location.href = newPageUrl;
					// }, 3000);
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
		$.ajax({
			type: "POST",
			url: `${apiURL}/inventory`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				showSuccessucompleteInventoryNotification();
				if (response.returnCode === "1") {
					console.log(response);
					// setTimeout(function () {
					// 	var newPageUrl = "unsubscribeDetail.html";
					// 	window.location.href = newPageUrl;
					// }, 3000);
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

//暫存修改
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
		var fileInput = $("#fileInput")[0];

		var updateObj = {};

		if (fileInput.files.length > 0) {
			for (var i = 0; i < fileInput.files.length; i++) {
				var file = fileInput.files[i];
				formData.append("inventory[]", file, file.name);

				updateObj.inventoryNo = getinventoryNo;
				updateObj.fileName = file.name;
				updateObj.file = file.name;
			}
		} else {
			updateObj.inventoryNo = getinventoryNo;
			updateObj.fileName = "";
			updateObj.file = "";
		}

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

		console.log(JSON.stringify(mergedObj));

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

// 下載excel資料
document.getElementById("downloadExelBtn").addEventListener("click", function () {
	var table = $("#insertContent").DataTable();
	var data = table.rows().data();
	var csvContent = "data:text/csv;charset=utf-8,";

	// 取得表頭
	var headers = table
		.columns()
		.header()
		.toArray()
		.map(function (header) {
			return $(header).text();
		});
	headers.shift();
	csvContent += headers.join(",") + "\n";

	var excludedProperties = ["componentId", "if_inventory_stock_in", "if_inventory_loss", "status"];

	// 將資料轉換為二維陣列
	var dataArray = [];
	for (var i = 0; i < data.length; i++) {
		var rowData = data[i];
		var row = [];

		for (var key in rowData) {
			if (rowData.hasOwnProperty(key) && !excludedProperties.includes(key)) {
				row.push(rowData[key]);
			}
		}

		dataArray.push(row);
	}

	for (var j = 0; j < dataArray.length; j++) {
		var lastColumnIndex = dataArray[j].length - 1;
		var secondLastColumnIndex = dataArray[j].length - 2;
		if (lastColumnIndex >= 0 && secondLastColumnIndex >= 0) {
			var tempData = dataArray[j][lastColumnIndex];
			dataArray[j][lastColumnIndex] = dataArray[j][secondLastColumnIndex];
			dataArray[j][secondLastColumnIndex] = tempData;
		}
	}

	for (var k = 0; k < dataArray.length; k++) {
		var row = dataArray[k];
		csvContent += row.join(",") + "\n";
	}

	// 建立下載連結
	var encodedUri = encodeURI(csvContent);
	var link = document.createElement("a");
	link.setAttribute("href", encodedUri);
	link.setAttribute("download", "datatable.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
});