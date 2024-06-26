$(document).ready(function () {
	handlePageCreatePermissions(currentUser, currentUrl);
});

// 取得品牌資料
$(document).ready(function () {
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
			if (responseData.returnCode === "1") {
				const brandList = document.getElementById("C-brandId");
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
			} else {
				handleApiResponse(responseData);
			}
		},
		error: function (error) {
			showErrorNotification();
		},
	});
});

// 上傳POST

$(document).ready(function () {
	var formData = new FormData();
	var uploadForm = document.getElementById("uploadForm");

	uploadForm.addEventListener("submit", function (event) {
		if (uploadForm.checkValidity() === false) {
			event.preventDefault();
			event.stopPropagation();
			showWarningfillFormNotification();
		} else {
			event.preventDefault();
			var fileInput = $("#fileInput")[0];
			if (fileInput.files.length > 0) {
				pushcomponentFile();
			} else {
				pushcomponentnoFile();
			}

			function pushcomponentFile() {
				var fileInput = $("#fileInput")[0];
				for (var i = 0; i < fileInput.files.length; i++) {
					var file = fileInput.files[i];
					formData.append("component[]", file, file.name);
				}

				//取值
				var getComponentName = $("#C-componentName").val();
				var getComponentNumber = $("#C-componentNumber").val();
				var getbrandId = $("#C-brandId").val();
				var getdepotPosition = $("#C-depotPosition").val();
				var getprice = $("#Price").val();
				var getcost = $("#Cost").val();
				var getwholesalePrice = $("#WholesalePrice").val();
				var getlowestWholesalePrice = $("#lowestWholesalePrice").val();
				var getcomponentSupplier = $("#C-supplier").val();
				var getworkingHour = $("#C-workingHour").val();
				var getsuitableCarModel = $("#C-suitableModel").val();
				var getdescription = $("#C-description").val();
				var getprecautions = $("#C-precautions").val();
				var getlowestInventory = $("#C-lowestInventory").val();
				var getbarcode = $("#C-barcode").val();

				var getcreateTime = $("#BuildTime").val();
				var getupdateTime = $("#EditTime").val();
				var getupdateOperator = $("#EditAccount").val();

				var componentDataObject = {
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
					createTime: getcreateTime,
					updateTime: getupdateTime,
					updateOperator: getupdateOperator,
					fileName: file.name,
					file: file.name,
					barcode: getbarcode,
				};

				// 从localStorage中获取session_id和chsm
				// 解析JSON字符串为JavaScript对象
				const jsonStringFromLocalStorage = localStorage.getItem("userData");
				const gertuserData = JSON.parse(jsonStringFromLocalStorage);
				const user_session_id = gertuserData.sessionId;

				// 组装发送文件所需数据
				// chsm = session_id+action+'HBAdminComponentApi'
				var action = "insertComponentDetail";
				var chsmtoPostFile = user_session_id + action + "HBAdminComponentApi";
				var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

				formData.set("action", action);
				formData.set("session_id", user_session_id);
				formData.set("chsm", chsm);
				formData.set("data", JSON.stringify(componentDataObject));

				// 執行POST請求
				$.ajax({
					type: "POST",
					url: `${apiURL}/component`,
					data: formData,
					processData: false,
					contentType: false,
					success: function (response) {
						if (response.returnCode === "1") {
							showSuccessFileNotification();
							setTimeout(function () {
								var newPageUrl = "componentList.html";
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

			function pushcomponentnoFile() {
				//取值
				var getComponentName = $("#C-componentName").val();
				var getComponentNumber = $("#C-componentNumber").val();
				var getbrandId = $("#C-brandId").val();
				var getdepotPosition = $("#C-depotPosition").val();
				var getprice = $("#Price").val();
				var getcost = $("#Cost").val();
				var getwholesalePrice = $("#WholesalePrice").val();
				var getlowestWholesalePrice = $("#lowestWholesalePrice").val();
				var getcomponentSupplier = $("#C-supplier").val();
				var getworkingHour = $("#C-workingHour").val();
				var getsuitableCarModel = $("#C-suitableModel").val();
				var getdescription = $("#C-description").val();
				var getprecautions = $("#C-precautions").val();
				var getlowestInventory = $("#C-lowestInventory").val();
				var getbarcode = $("#C-barcode").val();

				var getcreateTime = $("#BuildTime").val();
				var getupdateTime = $("#EditTime").val();
				var getupdateOperator = $("#EditAccount").val();

				var componentDataObject = {
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
					createTime: getcreateTime,
					updateTime: getupdateTime,
					updateOperator: getupdateOperator,
					fileName: null,
					file: null,
					barcode: getbarcode,
				};

				// 从localStorage中获取session_id和chsm
				// 解析JSON字符串为JavaScript对象
				const jsonStringFromLocalStorage = localStorage.getItem("userData");
				const gertuserData = JSON.parse(jsonStringFromLocalStorage);
				const user_session_id = gertuserData.sessionId;

				// 组装发送文件所需数据
				// chsm = session_id+action+'HBAdminComponentApi'
				var action = "insertComponentDetail";
				var chsmtoPostFile = user_session_id + action + "HBAdminComponentApi";
				var chsm = CryptoJS.MD5(chsmtoPostFile).toString().toLowerCase();

				formData.set("action", action);
				formData.set("session_id", user_session_id);
				formData.set("chsm", chsm);
				formData.set("data", JSON.stringify(componentDataObject));

				// 執行POST請求
				$.ajax({
					type: "POST",
					url: `${apiURL}/component`,
					data: formData,
					processData: false,
					contentType: false,
					success: function (response) {
						if (response.returnCode === "1") {
							showSuccessFileNotification();
							setTimeout(function () {
								var newPageUrl = "componentList.html";
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
		}
		uploadForm.classList.add("was-validated");
	});
});
