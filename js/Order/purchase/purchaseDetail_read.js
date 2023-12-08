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
function fetchAccountList() {
	var getpurchase = localStorage.getItem("purchseRId");
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

				//同意採購
				var ApproveInput = $("#allPost");
				if (Boolean(purchaseData.if_purchase_execute_approve) === true) {
					ApproveInput.prop("disabled", false);
				} else {
					ApproveInput.val("");
					ApproveInput.prop("disabled", true);
				}

				//取消採購
				var CancelInput = $("#onlyNotePost");
				if (Boolean(purchaseData.if_purchase_execute_cancel) === true) {
					CancelInput.prop("disabled", false);
				} else {
					CancelInput.val("");
					CancelInput.prop("disabled", true);
				}

				//取得purchase之後打component
				getComponentApi(purchaseData.componentId);
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

// 取得詳細資料：component
function getComponentApi(id) {
	const dataId = { id: id };

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

$(document).ready(function () {
	fetchAccountList();
});
