
// ******************************************************
// Module: Helpers
// ******************************************************

var Helpers = {};

'use strict';

// ******************************************************
// Helpers: Get app version
// ******************************************************

Helpers.getAppVersion = function(callback) {
	$.getJSON("/appVersion.json", function(data) {
		callback(data[0].appVersion);
	}).fail(function() {
		alert("Something went wrong. Error code: Helpers 1");
	});
}

// ******************************************************
// Helpers: Paging
// ******************************************************

Helpers.paging = function(goingBack) {
	var storedMannas = Storage.getHistory();

	// Lower index means further back in history
	if (goingBack && storedMannas[_displayedMannaIndex - 1]) {
		var manna = storedMannas[_displayedMannaIndex - 1];
		_displayedMannaIndex--;
		View.showManna(manna);
	} else if (!goingBack && storedMannas[_displayedMannaIndex + 1]) {
		var manna = storedMannas[_displayedMannaIndex + 1];
		_displayedMannaIndex++;
		View.showManna(manna);
	}
}

// ******************************************************
// Helpers: Report manna
// ******************************************************

Helpers.reportManna = function() {
	var storedMannas = Storage.getHistory();

	if (storedMannas.length < 1) {
		View.showPopup("No mannas detected.");
		return;
	}

	var manna = storedMannas[_displayedMannaIndex];

	if (!manna) {
		manna = storedMannas[storedMannas.length - 1];
	}

	$.ajax({
		type: "post",
		url: "/resources/php/sendMail.php",
		data: { subject: "CryptoManna: Reported manna", message: manna.title }
	}).done(function(data) {
		View.showPopup("The manna has been reported. Thank you.");
	}).fail(function() {
		alert("Something went wrong. Error code: Helpers 2");
	});
}

// ******************************************************
// Helpers: Share app
// ******************************************************

Helpers.shareApp = function() {
	var link = window.location.href.replace(/\/$/, ""); // Remove trailing slash

	if (navigator.share) {
		navigator.share({
			title: "CryptoManna",
			text: "Lets you pick random mannas from a compilation of over two thousand awesome Bible passages.",
			url: link,
		});
		return;
	}

	View.showPopup("Share this link: " + link);
}

// ******************************************************
// Helpers: Get OS
// ******************************************************

Helpers.getOS = function() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

	if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
		return "Apple";
	}

	if (/android/i.test(userAgent)) {
		return "Android";
	}

	if (/windows phone/i.test(userAgent)) {
		return "Windows";
	}

	return "Unknown"
}