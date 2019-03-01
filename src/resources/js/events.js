
// ******************************************************
// Module: Events
// ******************************************************

var Events = {
	DOM: {}
};

'use strict';

Events.bindEvents = function() {

// ******************************************************
// Events: Click events
// ******************************************************

View.DOM.mannaButton.click(function() {
	if (!View.DOM.mannaButton.hasClass("disabled")) {
		View.DOM.mannaTitle.html("");
		View.DOM.mannaText.html("");
		View.Helpers.adjustLongMannas();

		View.DOM.clickInfo.hide();
		View.fakeLoading();
		Core.getMannas(Core.loadRandomManna);
	}
});

View.DOM.welcomeButton.click(function() {
	View.DOM.welcomeSection.hide();
	View.DOM.welcomeButton.hide();
	View.DOM.languageSection.show();
	View.DOM.languageButton.show();
	localStorage.setItem("returning", "1");
});

View.DOM.languageButton.click(function() {
	if (!View.DOM.languageButton.hasClass("disabled")) {
		View.DOM.languageSection.hide();
		View.DOM.languageButton.hide();

		if (Helpers.getOS() != "Unknown" && !window.navigator.standalone) {
			View.DOM.addSection.show();
			View.DOM.addButton.show();
		} else {
			View.DOM.goBackButtons.show();
			View.DOM.footer.show();
		}
	}
});

View.DOM.addButton.click(function() {
	View.DOM.addSection.hide();
	View.DOM.addButton.hide();
	View.DOM.goBackButtons.show();
	View.DOM.footer.show();
});

View.DOM.goBackButtons.click(function() {
	View.DOM.sections.hide();
	View.DOM.footer.show();
});

View.DOM.menuButton.click(function() {
	View.triggerMenu();
});

View.DOM.menuShare.click(function() {
	Helpers.shareApp();
});

View.DOM.menuClear.click(function() {
	Storage.clearHistory();
	View.showPopup("Your history has been cleared.");
});

View.DOM.reportButton.click(function() {
	Helpers.reportManna();
});

View.DOM.prevButton.click(function() {
	if (!View.DOM.prevButton.hasClass("disabled")) {
		Helpers.paging(true);
	}
});

View.DOM.nextButton.click(function() {
	if (!View.DOM.nextButton.hasClass("disabled")) {
		Helpers.paging(false);
	}
});

View.DOM.menuItems.click(function() {
	var menuItem = $(this);
	var targetSection = menuItem.attr("id");

	View.DOM.sections.hide();
	$(".section." + targetSection).show();

	View.DOM.footer.hide();
	View.triggerMenu();
});

// ******************************************************
// Events: Dropdown events
// ******************************************************

View.DOM.languageDropdown.change(function() {
	var languageID = $(this).children(":selected").val();
	View.DOM.selectBible.hide();
	View.DOM.listLoader.show();
	View.DOM.languageButton.addClass("disabled");
	API.requestBibles(languageID, View.loadBibles);
});

View.DOM.bibleDropdown.change(function() {
	var languageID = View.DOM.languageDropdown.children(":selected").val();
	var languageName = View.DOM.languageDropdown.children(":selected").text();

	var language = { "languageID": languageID, "languageName": languageName };
	localStorage.setItem("language", JSON.stringify(language));

	var bibleID = View.DOM.bibleDropdown.children(":selected").val().substring(0,6); // The six first letters is the Bible ID
	var bibleName = View.DOM.bibleDropdown.children(":selected").text();

	var bible = { "bibleID": bibleID, "bibleName": bibleName };
	localStorage.setItem("bible", JSON.stringify(bible));

	View.DOM.bookWarning.hide();
	View.displaySelectedBible();

	View.DOM.mannaButton.addClass("disabled");
	API.requestBooks(bibleID, View.loadBooks);
});

}
