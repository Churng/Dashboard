(function ($) {
	"use strict";

	// Spinner
	var spinner = function () {
		setTimeout(function () {
			if ($("#spinner").length > 0) {
				$("#spinner").removeClass("show");
			}
		}, 1);
	};
	spinner();

	// Back to top button
	$(window).scroll(function () {
		if ($(this).scrollTop() > 300) {
			$(".back-to-top").fadeIn("slow");
		} else {
			$(".back-to-top").fadeOut("slow");
		}
	});
	$(".back-to-top").click(function () {
		$("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
		return false;
	});

	// Sidebar Toggler
	$(".sidebar-toggler").click(function () {
		$(".sidebar, .content").toggleClass("open");
		return false;
	});

	// log-out
	$(function () {
		// 登出按鈕的点击事件处理
		$("#logout").on("click", function () {
			// 移除 localStorage 中的用户数据
			localStorage.removeItem("userData");
			localStorage.removeItem("currentUser");
			window.history.replaceState({}, document.title, "0-signin.html");

			window.location.href = "0-signin.html";
		});
	});
})(jQuery);
