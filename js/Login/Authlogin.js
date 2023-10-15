var userData = localStorage.getItem("userData");
var currentUser = localStorage.getItem("currentUser");

if (!userData || !currentUser) {
	window.location.href = "0-signin.html";
}
