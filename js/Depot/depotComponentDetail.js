// 取得列表
var componentId;
$(document).ready(function () {
	var depotId = localStorage.getItem("depotId");
	const dataId = { id: depotId };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// console.log(user_session_id);
	//chsm = session_id+action+'HBAdminStocksApi'
	// 組裝菜單所需資料
	var action = "getStocksDetail";
	var chsmtoGetStockList = user_session_id + action + "HBAdminStocksApi";
	var chsm = CryptoJS.MD5(chsmtoGetStockList).toString().toLowerCase();

	$("#depotList").DataTable();
	// 发送API请求以获取数据
	$.ajax({
		type: "POST",
		url: `${apiURL}/stocks`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log("成功响应：", responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const depotData = responseData.returnData[0];
				$("#componentId").val(depotData.id);
				$("#statusName").val(depotData.statusName);
				$("#remark").val(depotData.remark);

				$("#orderId").val(depotData.id);
				$("#storeName").val(depotData.storeName);
				$("#orderNo").val(depotData.orderNo);
				$("#orderNote").val(depotData.orderNote);

				$("#BuildTime").val(depotData.createTime);
				$("#EditTime").val(depotData.updateTime);
				$("#EditAccount").val(depotData.updateOperator);

				componentId = depotData.componentId;
				handleComponentId(depotData.componentId);

				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 监听修改按钮的点击事件
// $(document).on("click", ".modify-button", function () {
// 	var id = $(this).data("id");
// 	localStorage.setItem("depotId", id);
// });

//取得零件資料
function handleComponentId(id) {
	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminComponentApi'
	// 组装所需数据
	var action = "getComponentDetail";
	var chsmtoGetComponentDetail = user_session_id + action + "HBAdminComponentApi";
	var chsm = CryptoJS.MD5(chsmtoGetComponentDetail).toString().toLowerCase();

	var postData = {
		id: id,
	};

	// 发送POST请求
	$.ajax({
		type: "POST",
		url: `${apiURL}/component`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: JSON.stringify(postData),
		},
		success: function (responseData) {
			handleApiResponse(responseData);
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const componentData = responseData.returnData[0];
				$("#componentName").val(componentData.componentName);
				$("#componentNumber").val(componentData.componentNumber);
				$("#brandId").val(componentData.brandId);

				$("#purchaseAmount").val(componentData.purchaseAmount);
				$("#depotAmount").val(componentData.depotAmount);
				$("#depotPosition").val(componentData.depotPosition);

				$("#Price").val(componentData.price);
				$("#Cost").val(componentData.cost);
				$("#WholesalePrice").val(componentData.wholesalePrice);
				$("#lowestWholesalePrice").val(componentData.lowestWholesalePrice);
				$("#supplier").val(componentData.componentSupplier);
				$("#workingHour").val(componentData.workingHour);
				$("#suitableModel").val(componentData.suitableCarModel);
				$("#description").val(componentData.description);
				$("#precautions").val(componentData.precautions);
				$("#lowestInventory").val(componentData.lowestInventory);

				$("#BuildTime").val(componentData.createTime);
				$("#EditTime").val(componentData.updateTime);
				$("#EditAccount").val(componentData.updateOperator);

				displayFileNameInInput(componentData.file);
				const myButton = document.getElementById("downloadBtn");
				myButton.setAttribute("data-file", componentData.file);

				// 填充完毕后隐藏加载中的spinner
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

// 取得品牌資料
$(document).ready(function () {
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
			handleApiResponse(responseData);
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
});

//取消

$(document).on("click", "#cancel", function () {
	localStorage.removeItem("depotId");
	window.location.href = "depotList.html";
});

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

// 上傳POST
$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
		} else {
			// 处理表单提交
			event.preventDefault();

			//零件
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
			if (fileInput.files.length > 0 && fileInput.files[0].size > 0) {
				for (var i = 0; i < fileInput.files.length; i++) {
					if (fileInput.files[i].size > 0) {
						formData.append("component[]", fileInput.files[i]);
					}
				}
				updateData.fileName = fileInput.files[0].name;
				updateData.file = fileInput.files[0].name;
			} else {
				updateData.fileName = "";
				updateData.file = "";
			}

			updateData.id = componentId;
			updateData.componentNumber = getComponentNumber;
			updateData.brandId = getbrandId;
			updateData.componentName = getComponentName;
			// purchaseAmount: getpurchaseAmount,
			// depotAmount: getdepotAmount,
			updateData.depotPosition = getdepotPosition;

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

			updateData.componentSupplier = getcomponentSupplier;
			updateData.workingHour = getworkingHour;
			updateData.suitableCarModel = getsuitableCarModel;
			updateData.description = getdescription;
			updateData.precautions = getprecautions;
			updateData.lowestInventory = getlowestInventory;
			updateData.createTime = getcreateTime;
			updateData.updateTime = getupdateTime;
			updateData.updateOperator = getupdateOperator;

			// 从localStorage中获取session_id和chsm
			// 解析JSON字符串为JavaScript对象
			const jsonStringFromLocalStorage = localStorage.getItem("userData");
			const gertuserData = JSON.parse(jsonStringFromLocalStorage);
			const user_session_id = gertuserData.sessionId;

			// 组装发送文件所需数据
			//chsm = session_id+action+'HBAdminComponentApi'
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
					if (response.returnCode === "1") {
						getdepotUpdatePost();
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

function getdepotUpdatePost() {
	var formData = new FormData();

	var depotId = localStorage.getItem("depotId");
	var getremark = $("#remark").val();

	var updateData = {};
	updateData.id = depotId;
	updateData.remark = getremark;

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// 组装发送文件所需数据
	//chsm = session_id+action+'HBAdminStocksApi'
	var action = "updateStocksDetail";
	var chsmtoPostFile = user_session_id + action + "HBAdminStocksApi";
	var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

	// 设置其他formData字段
	formData.set("action", action);
	formData.set("session_id", user_session_id);
	formData.set("chsm", chsm);
	formData.set("data", JSON.stringify(updateData));

	$.ajax({
		type: "POST",
		url: `${apiURL}/stocks`,
		data: formData,
		processData: false,
		contentType: false,
		success: function (response) {
			if (response.returnCode === "1") {
				showSuccessFileNotification();
				setTimeout(function () {
					localStorage.removeItem("depotId");
					var newPageUrl = "depotList.html";
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
}
