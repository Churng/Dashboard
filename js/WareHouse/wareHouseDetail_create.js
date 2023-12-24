// 取得品牌資料
function getbrandList() {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminBrandApi'
	// 組裝菜單所需資料
	var action = "getBrandList";
	var chsmtoGetManualList = user_session_id + action + "HBAdminBrandApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualList).toString().toLowerCase();

	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/brand`,
		data: { session_id: user_session_id, action: action, chsm: chsm },
		success: function (responseData) {
			const brandList = document.getElementById("brandId");
			const defaultOption = document.createElement("option");
			defaultOption.text = "請選擇品牌";
			brandList.appendChild(defaultOption);

			for (let i = 0; i < responseData.returnData.length; i++) {
				const brand = responseData.returnData[i];
				const brandName = brand.brandName;
				const brandId = brand.id;

				const option = document.createElement("option");
				option.text = brandName;
				option.value = brandId;

				brandList.appendChild(option);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
}

// 取得詳細資料
var postId;
$(document).ready(function () {
	var componentValue = localStorage.getItem("componentValue");
	var IdPost = JSON.stringify({ componentNumber: componentValue });

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminComponentApi'
	// 组装所需数据
	var action = "getComponentDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				getbrandList();
				setTimeout(function () {
					const wareHouseData = responseData.returnData[0];

					$("#componentName").val(wareHouseData.componentName);
					$("#componentNumber").val(wareHouseData.componentNumber);
					$("#brandId").val(wareHouseData.brandId);

					$("#purchaseAmount").val(wareHouseData.purchaseAmount);
					$("#depotAmount").val(wareHouseData.depotAmount);
					$("#depotPosition").val(wareHouseData.depotPosition);

					$("#Price").val(wareHouseData.price);
					$("#Cost").val(wareHouseData.cost);
					$("#WholesalePrice").val(wareHouseData.wholesalePrice);
					$("#lowestWholesalePrice").val(wareHouseData.lowestWholesalePrice);
					$("#supplier").val(wareHouseData.componentSupplier);
					$("#workingHour").val(wareHouseData.workingHour);
					$("#suitableModel").val(wareHouseData.suitableCarModel);
					$("#description").val(wareHouseData.description);
					$("#precautions").val(wareHouseData.precautions);
					$("#lowestInventory").val(wareHouseData.lowestInventory);

					$("#BuildTime").val(wareHouseData.createTime);
					$("#EditTime").val(wareHouseData.updateTime);
					$("#EditAccount").val(wareHouseData.updateOperator);

					displayFileNameInInput(wareHouseData.file);
					const myButton = document.getElementById("downloadBtn");
					myButton.setAttribute("data-file", wareHouseData.file);

					postId = wareHouseData.id;

					// 填充完毕后隐藏加载中的spinner;
					$("#spinner").hide();
				}, 1000);
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

//下載檔案
$(document).on("click", ".file-download", function () {
	event.preventDefault();
	var fileName = $(this).data("file");
	var apiName = "component";
	if (fileName) {
		downloadFile(apiName, fileName);
	} else {
		showErrorFileNotification();
	}
});

//modal取消：回到列表頁
$(document).on("click", "#BackList", function () {
	localStorage.removeItem("componentValue");
	localStorage.removeItem("partId");
	localStorage.removeItem("notificationId");
	window.location.href = "wareHouseList.html";
});

$(document).on("click", "#cancel", function () {
	localStorage.removeItem("componentValue");
	localStorage.removeItem("partId");
	localStorage.removeItem("notificationId");
	window.location.href = "wareHouseList.html";
});

$(document).on("click", "#whList", function () {
	localStorage.removeItem("componentValue");
	localStorage.removeItem("partId");
	localStorage.removeItem("notificationId");
	window.location.href = "wareHouseList.html";
});

// 上傳POST
$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			console.log("Form validation failed");
		} else {
			event.preventDefault();
			//取值
			var getComponentName = $("#componentName").val();
			var getComponentNumber = $("#componentNumber").val();
			var getbrandId = $("#brandId").val();
			// var getpurchaseAmount = $("#purchaseAmount").val();
			// var getdepotAmount = $("#depotAmount").val();
			var getdepotPosition = $("#depotPosition").val();
			var getprice = $("#Price").val();
			var getcost = $("#Cost").val();
			var getwholesalePrice = $("#WholesalePrice").val();
			var getlowestWholesalePrice = $("#lowestWholesalePrice").val();
			var getcomponentSupplier = $("#supplier").val();
			var getworkingHour = $("#workingHour").val();
			var getsuitableCarModel = $("#suitableModel").val();
			var getdescription = $("#description").val();
			var getprecautions = $("#precautions").val();
			var getlowestInventory = $("#lowestInventory").val();
			var fileInput = document.getElementById("fileInput");

			var getcreateTime = $("#BuildTime").val();
			var getupdateTime = $("#EditTime").val();
			var getupdateOperator = $("#EditAccount").val();

			var updateData = {};
			if (fileInput.files.length > 0) {
				for (var i = 0; i < fileInput.files.length; i++) {
					formData.append("component[]", fileInput.files[i]);
				}
				updateData.fileName = fileInput.files[0].name;
				updateData.file = fileInput.files[0].name;
			} else {
				updateData.fileName = "";
				updateData.file = "";
			}

			updateData.id = postId;
			updateData.brandId = getbrandId;
			updateData.componentName = getComponentName;
			updateData.componentNumber = getComponentNumber;
			updateData.componentSupplier = getcomponentSupplier;
			// updateData.depotAmount = getdepotAmount;
			// updateData.purchaseAmount = getpurchaseAmount;

			if (typeof getprice !== "undefined") {
				updateData.price = getprice;
			}

			if (typeof getcost !== "undefined") {
				updateData.cost = getcost;
			}

			if (typeof getwholesalePrice !== "undefined") {
				updateData.wholesalePrice = getwholesalePrice;
			}

			if (typeof getlowestWholesalePrice !== "undefined") {
				updateData.lowestWholesalePrice = getlowestWholesalePrice;
			}

			updateData.depotPosition = getdepotPosition;
			updateData.description = getdescription;
			updateData.lowestInventory = getlowestInventory;
			updateData.precautions = getprecautions;
			updateData.suitableCarModel = getsuitableCarModel;
			updateData.workingHour = getworkingHour;
			updateData.createTime = getcreateTime;
			updateData.updateTime = getupdateTime;
			updateData.updateOperator = getupdateOperator;

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			// chsm = session_id+action+'HBAdminComponentApi'
			var action = "updateComponentDetail";
			var chsmtoPostFile = user_session_id + action + "HBAdminComponentApi";
			var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

			// 设置其他formData字段
			formData.set("action", action);
			formData.set("session_id", user_session_id);
			formData.set("chsm", chsm);
			formData.set("data", JSON.stringify(updateData));

			// 发送上传更新文件的请求
			$.ajax({
				type: "POST",
				url: `${apiURL}/component`,
				data: formData,
				processData: false,
				contentType: false,
				success: function (response) {
					console.log(response);
					if (response.returnCode === "1") {
						sendSecondCreate();
					} else {
						handleApiResponse(response);
					}
				},
				error: function (error) {
					showErrorFileNotification();
				},
			});
		}
		uploadForm.classList.add("was-validated");
	});
});

function sendSecondCreate() {
	var formData = new FormData();

	var amount = $("#amount").val();
	var remark = $("#remark").val();
	var notificationId = localStorage.getItem("notificationId");

	var updateData = {
		componentId: postId,
		amount: amount,
		remark: remark,
		notificationId: notificationId,
	};

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// 组装发送文件所需数据
	// chsm = session_id+action+'HBAdminStockInApi'
	var action = "insertStockInDetail";
	var chsmtoPostFile = user_session_id + action + "HBAdminStockInApi";
	var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

	// 设置其他formData字段
	formData.set("action", action);
	formData.set("session_id", user_session_id);
	formData.set("chsm", chsm);
	formData.set("data", JSON.stringify(updateData));

	$.ajax({
		type: "POST",
		url: `${apiURL}/stockIn`,
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
			if (response.returnCode === "1") {
				getStockIdModal(response.stockInId);
				localStorage.removeItem("notificationId");
				console.log(response);
			}
		},
		error: function (error) {
			showErrorFileNotification();
		},
	});
}

function getStockIdModal(stockInId) {
	var IdPost = JSON.stringify({ id: stockInId });

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminStockInApi'
	// 组装所需数据
	var action = "getStockInDetail";
	var chsmtoGetManualDetail = user_session_id + action + "HBAdminStockInApi";
	var chsm = CryptoJS.MD5(chsmtoGetManualDetail).toString().toLowerCase();

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/stockIn`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				updatePageWithData(responseData);

				setTimeout(() => {
					// 获取按钮元素
					const button = document.querySelector(".whModal");
					button.removeAttribute("disabled");
					$("#wareHouseModal").modal("show");
				}, 1000);

				$("#spinner").hide();
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
function updatePageWithData(responseData) {
	// 清空表格数据
	var dataTable = $("#stockInPage").DataTable();
	dataTable.clear().draw();

	for (var i = 0; i < responseData.orderMatchData.length; i++) {
		var data = responseData.orderMatchData[i];

		dataTable.row
			.add([data.id, data.componentId, data.componentName, data.orderNo, data.storeName, data.orderNote])
			.draw(false);
	}
}
