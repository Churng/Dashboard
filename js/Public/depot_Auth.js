$(document).ready(function () {
	var Data = JSON.parse(localStorage.getItem("currentUser")) || [];
	var userData = Data.userretrunData;
	var userAuth = getUserAuth("零件定義資料");

	console.log(Data);
	console.log(userData);
	console.log(userAuth);

	if (!userAuth.includes("price")) {
		$("#Price").closest(".col-sm-3").remove();
	}

	if (!userAuth.includes("cost")) {
		$("#Cost").closest(".col-sm-3").remove();
	}

	if (!userAuth.includes("wholesalePrice")) {
		$("#WholesalePrice").closest(".col-sm-3").remove();
	}

	if (!userAuth.includes("lowestWholesalePrice")) {
		$("#lowestWholesalePrice").closest(".col-sm-3").remove();
	}

	function getUserAuth(itemName) {
		var item = userData.find(function (data) {
			return data.name === itemName;
		});

		return item ? item.auth : [];
	}
});
