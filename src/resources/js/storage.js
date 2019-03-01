
// ******************************************************
// Module: Storage
// ******************************************************

var Storage = {};

'use strict';

// ******************************************************
// Storage: Set default options
// ******************************************************

Storage.setDefaultOptions = function() {
	var language = { "languageID": "ENG", "languageName": "English" };
	localStorage.setItem("language", JSON.stringify(language));

	var bible = { "bibleID": "ENGKJV", "bibleName": "King James" };
	localStorage.setItem("bible", JSON.stringify(bible));

	View.DOM.mannaButton.addClass("disabled");
	API.requestBooks("ENGKJV", View.loadBooks);
}

// ******************************************************
// Storage: Get history
// ******************************************************

Storage.getHistory = function() {
	if (localStorage.getItem("history"))
		return JSON.parse(localStorage.getItem("history"));

	return [];
}

// ******************************************************
// Storage: Add to history
// ******************************************************

Storage.addToHistory = function(mannaObject) {
	var storedMannas = Storage.getHistory();

	// Make sure only ten mannas are kept in history
	if (storedMannas.length > 9)
		storedMannas = storedMannas.slice(1); // Lower index means further back in history

	storedMannas.push(mannaObject);
	localStorage.setItem("history", JSON.stringify(storedMannas));
	_displayedMannaIndex = Storage.getHistory().length - 1;
}

// ******************************************************
// Storage: Clear history
// ******************************************************

Storage.clearHistory = function() {
	localStorage.removeItem("history");

	View.updatePaging();
	View.hideManna();
	View.Helpers.adjustLongMannas();
	View.DOM.clickInfo.show();
}
