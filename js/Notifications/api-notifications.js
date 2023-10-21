function handleApiResponse(apiResponse) {
	const codeHandlers = {
		1: () => {
			console.log();
		},
		"003": () => {
			showErrorReLoginNotification();
			setTimeout(function () {
				window.location.href = "0-signin.html";
			}, 1000);
		},
		"001": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"005": () => {
			toastr.warning(apiResponse.returnMessage);
		},
		"006": () => {
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
