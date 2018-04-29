
// ******************************************************
// Module: App
// ******************************************************

var Init = {};

'use strict';

// ******************************************************
// Global variables
// ******************************************************

var _loading = false;
var _displayedMannaIndex;

// ******************************************************
// Service worker
// ******************************************************

if ("serviceWorker" in navigator) {
	navigator.serviceWorker.register("/service-worker.js");
}

// ******************************************************
// Init: Start app
// ******************************************************

$(document).ready(function() {
	Init.startApp();
});

Init.startApp = function() {
	Helpers.getAppVersion(Init.checkAppVersion);

	View.cacheDom();
	Events.bindEvents();

	_displayedMannaIndex = Storage.getHistory().length;

	View.DOM.listLoader.show();
	API.requestLanguages(View.loadLanguages);

	if (localStorage.getItem("returning") != "1") {
		Storage.setDefaultOptions();
		View.showWelcome();
	} else {
		View.DOM.goBackButtons.show();
	}

	$("#" + Helpers.getOS()).show(); // Show info about adding app to home screen

	View.displaySelectedBible();
	View.updatePaging();
}

// ******************************************************
// Init: Check app version
// ******************************************************

Init.checkAppVersion = function(appVersion) {
	var storedAppVersion = parseInt(localStorage.getItem("app_version"));

	if (!storedAppVersion) {
		localStorage.setItem("app_version", appVersion);
		return;
	}

	if (appVersion > storedAppVersion && window.navigator.standalone && Helpers.getOS() == "Apple") {
		var link = window.location.href.replace(/\/$/, ""); // Remove trailing slash
		View.showPopup("There's a new version available for this app. Please delete the app and re-add it to your home screen via this link: " + link);
		return;
	}

	localStorage.setItem("app_version", appVersion);
}