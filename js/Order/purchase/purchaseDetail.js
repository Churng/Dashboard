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
			// console.log(responseData);
			const brandList = document.getElementById("P-brandId");
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

// 取得詳細資料：purchase
$(document).ready(function () {
	var getpurchase = localStorage.getItem("purchaseId");
	const dataId = { id: getpurchase };
	const IdPost = JSON.stringify(dataId);

	// 从localStorage中获取session_id和chsm
	// 解析JSON字符串为JavaScript对象
	const jsonStringFromLocalStorage = localStorage.getItem("userData");
	const gertuserData = JSON.parse(jsonStringFromLocalStorage);
	const user_session_id = gertuserData.sessionId;

	// chsm = session_id+action+'HBAdminPurchaseApi'
	// 组装所需数据
	var action = "getPurchaseDetail";
	var chsmtoGetPurchaseDetail = user_session_id + action + "HBAdminPurchaseApi";
	var chsm = CryptoJS.MD5(chsmtoGetPurchaseDetail).toString().toLowerCase();

	// 发送POST请求;
	$.ajax({
		type: "POST",
		url: `${apiURL}/purchase`,
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			handleApiResponse(responseData);
			// console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const purchaseData = responseData.returnData[0];
				$("#purchaseId").val(purchaseData.id);
				$("#purchaseCreateTime").val(purchaseData.createTime);
				$("#purchaseCreateOperator").val(purchaseData.createOperator);
				$("#purchasestoreName").val(purchaseData.storeName);
				$("#purchasestatusName").val(purchaseData.statusName);
				$("#purchaseRemark").val(purchaseData.remark);

				$("#orderNumber").val(purchaseData.orderNo);
				$("#orderStoreName").val(purchaseData.orderStoreName);
				$("#orderNote").val(purchaseData.orderNote);

				$("#BuildTime").val(purchaseData.createTime);
				$("#EditTime").val(purchaseData.updateTime);
				$("#EditAccount").val(purchaseData.updateOperator);

				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				showErrorNotification();
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 取得詳細資料：component
$(document).ready(function () {
	var getcompoent = localStorage.getItem("componentId");
	const dataId = { id: getcompoent };

	const IdPost = JSON.stringify(dataId);

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
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const componentData = responseData.returnData[0];
				$("#componentName").val(componentData.componentName);
				$("#componentNumber").val(componentData.componentNumber);
				$("#P-brandId").val(componentData.brandId);

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

// 取消訂購：監聽
var form = document.getElementById("uploadForm");
var button = document.getElementById("onlyNotePost");

button.addEventListener("click", function (event) {
	sendFormDataToAPI(function (response) {
		if (response.success) {
			// 验证通过且API请求成功，手动提交表单
			form.submit();
			showSuccessFileNotification();
		} else {
			showErrorSubmitNotification();
		}
	});
});

// 取消零件訂購：僅有單據備註更改
function sendFormDataToAPI(event) {
	var formData = new FormData();
	var getpurchase = localStorage.getItem("purchaseId");

	const purchaseRemarkValue = document.getElementById("purchaseRemark");

	if (purchaseRemarkValue.value.trim() === "") {
		purchaseRemarkValue.classList.add("is-invalid");
		const additionalScrollPixels = 300;

		const targetScrollPosition = purchaseRemarkValue.offsetTop - additionalScrollPixels;

		window.scroll({
			top: targetScrollPosition,
			behavior: "smooth",
		});

		event.preventDefault();
		showWarningContentNotification();
	} else {
		const jsonStringFromLocalStorage = localStorage.getItem("userData");
		const gertuserData = JSON.parse(jsonStringFromLocalStorage);
		const user_session_id = gertuserData.sessionId;

		var purchaseRemark = $("#purchaseRemark").val();

		var updateData = {
			id: getpurchase,
			remark: purchaseRemark,
		};

		// 组装发送文件所需数据
		// chsm = session_id+action+'HBAdminPurchaseApi'
		var action = "updatePurchaseDetail";
		var chsmtoPostFile = user_session_id + action + "HBAdminPurchaseApi";
		var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

		formData.set("action", action);
		formData.set("session_id", user_session_id);
		formData.set("chsm", chsm);
		formData.set("data", JSON.stringify(updateData));

		$.ajax({
			type: "POST",
			url: `${apiURL}/purchase`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode === "1") {
					showSuccessFileNotification();

					setTimeout(function () {
						localStorage.removeItem("purchaseId");
						var newPageUrl = "purchaseList.html";
						window.location.href = newPageUrl;
					}, 3000);
				} else {
					handleApiResponse(response);
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	}
}

// 同意訂購：監聽
var formData = new FormData();
var button = document.getElementById("allPost");

button.addEventListener("click", function (event) {
	console.log(event);
	sendAgreeDataToAPI(function (response) {
		if (response.success) {
			form.submit();
			showSuccessFileNotification();
		} else {
			showErrorSubmitNotification();
		}
	});
});

// 同意零件訂購：單據備註更改、零件更新
function sendAgreeDataToAPI(event) {
	var formData = new FormData();
	// var getpurchase = localStorage.getItem("purchaseId");
	var getcompoent = localStorage.getItem("componentId");

	var getComponentName = $("#componentName").val();
	var getComponentNumber = $("#componentNumber").val();
	var getbrandId = $("#P-brandId").val();
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

	if (fileInput.files.length > 0) {
		var updateData = {
			id: getcompoent,
			componentNumber: getComponentNumber,
			brandId: getbrandId,
			componentName: getComponentName,
			// purchaseAmount: getpurchaseAmount,
			// depotAmount: getdepotAmount,
			depotPosition: getdepotPosition,
			price: getprice,
			cost: getcost,
			wholesalePrice: getwholesalePrice,
			lowestWholesalePrice: getlowestWholesalePrice,
			componentSupplier: getcomponentSupplier,
			workingHour: getworkingHour,
			suitableCarModel: getsuitableCarModel,
			description: getdescription,
			precautions: getprecautions,
			lowestInventory: getlowestInventory,
			fileName: fileInput.files[0].name,
			file: fileInput.files[0].name,
		};

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

		$.ajax({
			type: "POST",
			url: `${apiURL}/component`,
			data: formData,
			processData: false,
			contentType: false,
			success: function (response) {
				if (response.returnCode == "1") {
					sendFormDataToAPI(event);
					localStorage.removeItem("purchaseId");
				} else {
					handleApiResponse(response);
					return;
				}
			},
			error: function (error) {
				showErrorFileNotification();
			},
		});
	} else {
		showWarningNotification();
	}
}
