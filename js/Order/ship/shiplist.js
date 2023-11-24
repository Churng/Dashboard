// 列表取得
var table;

function fetchAccountList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	// chsm = session_id+action+'HBAdminShipApi'
	// 組裝菜單所需資料
	var action = "getShipList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminShipApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	if (!$.fn.DataTable.isDataTable("#stockOut")) {
		table = $("#stockOut").DataTable({
			columns: [
				{
					// Buttons column
					render: function (data, type, row) {
						var modifyButtonHtml = `<a href="shipDetail.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-shipno="${row.shipNo}">修改</a>`;

						var readButtonHtml = `<a href="shipDetail_read.html" style="display:none; margin-bottom:5px" class="btn btn-warning text-white read-button" data-button-type="read" data-shipno="${row.shipNo}">查看詳請</a>`;

						var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml;

						return buttonsHtml;
					},
				},
				{ data: "shipNo" },
				{ data: "createTime" },
				{ data: "createOperator" },
				{ data: "orderNo" },
				{ data: "storeName" },
				{ data: "brandName" },
				{ data: "orderNote" },
				{ data: "totalPrice" },
				{ data: "totalWholesalePrice" },
				{ data: "totalLowestWholesalePrice" },
				{ data: "totalCost" },
				{ data: "amount" },
				{ data: "statusName" },
			],
			drawCallback: function () {
				handlePagePermissions(currentUser, currentUrl);
			},
			columnDefs: [{ orderable: false, targets: [0] }],
		});
	}

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/ship`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
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

// 表格填充
function updatePageWithData(responseData, table) {
	table.clear().rows.add(responseData.returnData).draw();
}

// 修改按鈕事件
$(document).on("click", ".modify-button", function () {
	var shipNo = $(this).data("shipno");
	console.log(shipNo);
	// 存储整个数据对象到 localStorage
	localStorage.setItem("shipNo", JSON.stringify(shipNo));
});

$(document).ready(function () {
	var sdateValue, edateValue, statusValue;

	$("#startDate").on("change", function () {
		sdateValue = $(this).val();
	});

	$("#endDate").on("change", function () {
		edateValue = $(this).val();
	});

	$("#status").on("change", function () {
		statusValue = $(this).val();
		console.log(statusValue);
	});

	$("#searchBtn").on("click", function () {
		var filterData = {};

		if (sdateValue) {
			filterData.stime = sdateValue;
		}

		if (edateValue) {
			filterData.etime = edateValue;
		}

		if (statusValue) {
			filterData.status = statusValue;
		}

		if (sdateValue || edateValue || statusValue) {
			sendApiRequest(filterData);
		} else if (!statusValue) {
			fetchAccountList();
			clearDateFields();
		}
	});

	function sendApiRequest(filterData) {
		showSpinner();
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		// console.log(user_session_id);
		// chsm = session_id+action+'HBAdminOrderApi'
		// 組裝菜單所需資料
		var action = "getShipList";
		var chsmtoGetManualList = user_session_id + action + "HBAdminShipApi";
		var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();
		var filterDataJSON = JSON.stringify(filterData);

		var postData = filterDataJSON;

		// $("#orderIndex").DataTable();
		// 发送API请求以获取数据
		$.ajax({
			type: "POST",
			url: `${apiURL}/ship`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
			success: function (responseData) {
				console.log(responseData);
				if (responseData.returnCode === "1") {
					if (responseData.returnData.length > 0) {
						updatePageWithData(responseData, table);

						hideSpinner();
						clearDateFields();
					} else {
						shownoDataNotification();
					}
				} else {
					handleApiResponse(responseData);
				}
			},
			error: function (error) {
				showErrorNotification();
			},
		});
	}

	function clearDateFields() {
		$("#startDate").val("");
		$("#endDate").val("");
	}
});

// 加载时调用在页面 fetchAccountList
$(document).ready(function () {
	fetchAccountList();
});
