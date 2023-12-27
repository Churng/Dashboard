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

// 查詢儲位
var getdepotPosition;
$(document).on("click", "#searchdepotPosition", function () {
	var formData = new FormData();
	const selectElement = document.getElementById("selectdepotPosition");
	currentValue = selectElement.value;
	getdepotPosition = currentValue;

	var postData = {
		depotPosition: currentValue,
	};

	// console.log("当前选中的值:", currentValue);
	console.log(postData);

	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	//chsm = session_id+action+'HBAdminDepotApi'
	// 組裝菜單所需資料
	var action = "getDepotListByDepotPosition";
	var chsmtoGetManualList = user_session_id + action + "HBAdminDepotApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	formData.set("action", action);
	formData.set("session_id", user_session_id);
	formData.set("chsm", chsm);
	formData.set("data", JSON.stringify(postData));

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/depot`,
		data: formData,
		processData: false,
		contentType: false,
		success: function (responseData) {
			console.log(responseData);

			if (responseData.returnCode === "1") {
				const showPosition = document.getElementById("getPositon");
				showPosition.value = getdepotPosition;
				updatePageWithData(responseData);
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

//上傳
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
				depotPosition: getdepotPosition,
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
			var action = "insertInventoryDetail";
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
						showSuccessuInsertNotification();
						var getinventoryNo = response.inventoryNo;
						console.log(response);
						localStorage.setItem("inventoryNo", getinventoryNo);
						setTimeout(function () {
							var newPageUrl = "inventoryDetail_update.html";
							window.location.href = newPageUrl;
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

var table;
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#insertContent").DataTable();
	dataTable.clear().destroy();
	var data = responseData.returnData;

	table = $("#insertContent").DataTable({
		autoWidth: false,
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
			{ data: "cost", defaultContent: "" },
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
}
