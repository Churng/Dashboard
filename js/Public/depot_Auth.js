$(document).ready(function () {
	var Data = JSON.parse(localStorage.getItem("currentUser")) || [];
	var userData = Data.userretrunData;
	var userAuth = getUserAuth("零件資料");

	// var priceDiv = document.getElementById("C-PriceDiv");
	if (!userAuth.includes("price")) {
		$("#C-Price").closest(".col-sm-3").remove();
	}

	// var costDiv = document.getElementById("C-CostDiv");
	if (!userAuth.includes("cost")) {
		$("#C-Cost").closest(".col-sm-3").remove();
	}

	// var wholesalePriceDiv = document.getElementById("C-WholesalePriceDiv");
	if (!userAuth.includes("wholesalePrice")) {
		$("#C-WholesalePrice").closest(".col-sm-3").remove();
	}

	// var lowestWholesalePriceDiv = document.getElementById("C-lowestWholesalePriceDiv");
	if (!userAuth.includes("lowestWholesalePrice")) {
		$("#C-lowestWholesalePrice").closest(".col-sm-3").remove();
	}

	function getUserAuth(itemName) {
		var item = userData.find(function (data) {
			return data.name === itemName;
		});

		return item ? item.auth : [];
	}
});
