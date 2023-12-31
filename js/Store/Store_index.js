// 列表取得
var table;
function fetchStoreList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStoreApi'
	// 組裝菜單所需資料
	var action = "getStoreList";
	var chsmtoGetStoreList = user_session_id + action + "HBAdminStoreApi";
	var chsm = CryptoJS.MD5(chsmtoGetStoreList).toString().toLowerCase();

	table = $("#storeInformation").DataTable({
		columns: [
			{
				// Buttons column
				render: function (data, type, row) {
					var modifyButtonHtml = `<a href="storeDetail_update.html" style="display:none" class="btn btn-primary text-white modify-button" data-button-type="update" data-id="${row.id}">修改</a>`;
					var readButtonHtml = `<a href="storeDetail_read.html" style="display:none" class="btn btn-warning text-white read-button" data-button-type="read" data-id="${row.id}">查看詳請</a>`;
					var buttonsHtml = readButtonHtml + "&nbsp;" + modifyButtonHtml;
					return buttonsHtml;
				},
			},
			{ data: "storeName" },
			{ data: "storeTypeName" },
			{ data: "storeManager" },
			{ data: "phoneNumber" },
			{ data: "address" },
			{ data: "storeOrder" },
			{ data: "statusName" },
		],
		drawCallback: function () {
			handlePagePermissions(currentUser, currentUrl);
		},
		columnDefs: [{ orderable: false, targets: [0] }],
		order: [],
	});

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/store`,
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
}

// 表格填充
function updatePageWithData(responseData, table) {
	table.clear().rows.add(responseData.returnData).draw();
}

// 監聽拿修改ID
$(document).on("click", ".modify-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("partId", id);
});
// 查看清單ID
$(document).on("click", ".read-button", function () {
	var id = $(this).data("id");
	localStorage.setItem("readStoreId", id);
});

// 門市選擇->清單變化
$(document).ready(function () {
	var selectedShopId;

	$("#searchStoreType").on("change", function () {
		selectedShopId = $("#searchStoreType").val();
	});

	$("#searchBtn").on("click", function () {
		var filterData = {};

		if (!selectedShopId) {
			sendApiRequest();
		} else {
			var filterData = {};
			filterData.storeType = selectedShopId;
			sendApiRequest(filterData);
		}
	});

	function sendApiRequest(filterData) {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var action = "getStoreList";
		var chsmtoGetStoreList = user_session_id + action + "HBAdminStoreApi";
		var chsm = CryptoJS.MD5(chsmtoGetStoreList).toString().toLowerCase();

		var filterDataJSON = JSON.stringify(filterData);
		var postData = filterDataJSON;

		$("#storeInformation").DataTable();

		$.ajax({
			type: "POST",
			url: `${apiURL}/store`,
			data: { session_id: user_session_id, action: action, chsm: chsm, data: postData },
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
});

// 加載時拿fetchAccountList
$(document).ready(function () {
	fetchStoreList();
});

// 點擊按鈕時使用 fetchAccountList
// $("#allBtn").on("click", function () {
// 	fetchAccountList();
// });
