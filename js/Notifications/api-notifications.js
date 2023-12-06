function handleApiResponse(apiResponse) {
	const codeHandlers = {
		1: () => {
			console.log();
		},
		// 參數錯誤
		"001": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"002": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"003": () => {
			toastr.warning(apiResponse.returnMessage);
			setTimeout(function () {
				window.location.href = "signin.html";
			}, 1000);
		},
		"004": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"005": () => {
			toastr.warning(apiResponse.returnMessage);
			setTimeout(function () {
				window.history.back();
			}, 1000);
		},
		"006": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"007": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"008": () => {
			toastr.warning(apiResponse.returnMessage);
			setTimeout(function () {
				window.history.back();
			}, 1000);
		},
		"009": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"010": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"011": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"012": () => {
			toastr.warning(apiResponse.returnMessage);
			setTimeout(function () {
				window.location.reload();
			}, 1000);
		},
		"013": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"014": () => {
			toastr.warning(apiResponse.returnMessage);
		},
	};

	if (apiResponse.returnCode in codeHandlers) {
		codeHandlers[apiResponse.returnCode]();
	} else {
		console.error("Unrecognized returnCode:", apiResponse.returnCode);
	}
}

// handleApiResponse(apiResponse1)
