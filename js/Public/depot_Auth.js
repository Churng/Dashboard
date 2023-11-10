$(document).ready(function () {
	var Data = JSON.parse(localStorage.getItem("currentUser")) || [];
	var userData = Data.userretrunData;
	var userAuth = getUserAuth("零件資料");

	var priceDiv = document.getElementById("C-PriceDiv");
	if (!userAuth.includes("price")) {
		priceDiv.style.display = "none";
	}

	var costDiv = document.getElementById("C-CostDiv");
	if (!userAuth.includes("cost")) {
		costDiv.style.display = "none";
	}

	var wholesalePriceDiv = document.getElementById("C-WholesalePriceDiv");
	if (!userAuth.includes("wholesalePrice")) {
		wholesalePriceDiv.style.display = "none";
	}

	var lowestWholesalePriceDiv = document.getElementById("C-lowestWholesalePriceDiv");
	if (!userAuth.includes("lowestWholesalePrice")) {
		lowestWholesalePriceDiv.style.display = "none";
	}

	function getUserAuth(itemName) {
		var item = userData.find(function (data) {
			return data.name === itemName;
		});

		return item ? item.auth : [];
	}
});
