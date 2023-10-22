// 取得詳細資料
$(document).ready(function () {
	var partId = localStorage.getItem("partId");
	const dataId = { id: partId };
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
		url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
		data: {
			action: action,
			session_id: user_session_id,
			chsm: chsm,
			data: IdPost,
		},
		success: function (responseData) {
			console.log(responseData);
			if (responseData.returnCode === "1" && responseData.returnData.length > 0) {
				const componentData = responseData.returnData[0];
				$("#C-componentName").val(componentData.componentName);
				$("#C-componentNumber").val(componentData.componentNumber);
				$("#C-brandId").val(componentData.brandId);

				$("#C-purchaseAmount").val(componentData.purchaseAmount);
				$("#C-depotAmount").val(componentData.depotAmount);
				$("#C-depotPosition").val(componentData.depotPosition);

				$("#C-Price").val(componentData.price);
				$("#C-Cost").val(componentData.cost);
				$("#C-WholesalePrice").val(componentData.wholesalePrice);
				$("#C-lowestWholesalePrice").val(componentData.lowestWholesalePrice);
				$("#C-supplier").val(componentData.componentSupplier);
				$("#C-workingHour").val(componentData.workingHour);
				$("#C-suitableModel").val(componentData.suitableCarModel);
				$("#C-description").val(componentData.description);
				$("#C-precautions").val(componentData.precautions);
				$("#C-lowestInventory").val(componentData.lowestInventory);

				$("#BuildTime").val(componentData.createTime);
				$("#EditTime").val(componentData.updateTime);
				$("#EditAccount").val(componentData.getupdateOperator);

				displayFileNameInInput(componentData.file);
				// 填充完毕后隐藏加载中的spinner
				$("#spinner").hide();
			} else {
				showWarningNotification();
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
			var partId = localStorage.getItem("partId");

			//取值
			var getComponentName = $("#C-componentName").val();
			var getComponentNumber = $("#C-componentNumber").val();
			var getbrandId = $("#C-brandId").val();
			// var getpurchaseAmount = $("#C-purchaseAmount").val();
			// var getdepotAmount = $("#C-depotAmount").val();
			var getdepotPosition = $("#C-depotPosition").val();
			var getprice = $("#C-Price").val();
			var getcost = $("#C-Cost").val();
			var getwholesalePrice = $("#C-WholesalePrice").val();
			var getlowestWholesalePrice = $("#C-lowestWholesalePrice").val();
			var getcomponentSupplier = $("#C-supplier").val();
			var getworkingHour = $("#C-workingHour").val();
			var getsuitableCarModel = $("#C-suitableModel").val();
			var getdescription = $("#C-description").val();
			var getprecautions = $("#C-precautions").val();
			var getlowestInventory = $("#C-lowestInventory").val();
			var fileInput = document.getElementById("fileInput");

			var getcreateTime = $("#BuildTime").val();
			var getupdateTime = $("#EditTime").val();
			var getupdateOperator = $("#EditAccount").val();

			if (fileInput.files.length > 0) {
				var updateData = {
					id: partId,
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

				// 发送上传更新文件的请求
				$.ajax({
					type: "POST",
					url: "https://88bakery.tw/HBAdmin/index.php?/api/component",
					data: formData,
					processData: false,
					contentType: false,
					success: function (response) {
						console.log(response);
						showSuccessFileNotification();
						localStorage.removeItem("partId");
						var newPageUrl = "componentList.html";
						window.location.href = newPageUrl;
					},
					error: function (error) {
						showErrorFileNotification();
					},
				});
			} else {
				return;
			}
		}
		uploadForm.classList.add("was-validated");
	});
});
