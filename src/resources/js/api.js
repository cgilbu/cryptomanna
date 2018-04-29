
// ******************************************************
// Module: API
// ******************************************************

var API = {
	Helpers: {}
};

'use strict';

// ******************************************************
// API: Call DBT
// ******************************************************

API.callDBT = function(url, parameters, callback) {
	$.ajax({
		type: "post",
		url: "/resources/php/callDBT.php",
		data: { url: url, parameters: parameters }
	}).done(function(data) {
		callback(data);
	}).fail(function() {
		console.log("Something went wrong. Error code: API 1");
	});
}

// ******************************************************
// API: Request languages
// ******************************************************

API.requestLanguages = function(callback) {
	var parameters = {
		"v": "2",
		"media": "text"
	};

	API.callDBT("https://dbt.io/library/volumelanguagefamily", parameters, callback);
}

// ******************************************************
// API: Request Bibles
// ******************************************************

API.requestBibles = function(languageID, callback) {
	var parameters = {
		"v": "2",
		"media": "text",
		"language_family_code": languageID
	};

	API.callDBT("https://dbt.io/library/volume", parameters, callback);
}

// ******************************************************
// API: Request books
// ******************************************************

API.requestBooks = function(bibleID, callback) {
	var parameters = {
		"v": "2",
		"dam_id": bibleID
	};

	API.callDBT("https://dbt.io/library/book", parameters, callback);
}

// ******************************************************
// API: Request passage object
// ******************************************************

API.attempts = 0;

API.requestPassageObject = function(location, callback) {
	var bookNumber = API.Helpers.getBookNumber(location);
	var chapterNumber = API.Helpers.getChapterNumber(location);
	var verseNumbers = API.Helpers.getVerseNumbers(location);

	// Some Bible versions does not contain all the 66 books of the Bible, so we need to check if the book exists
	var bookObject = API.Helpers.searchForBook(bookNumber);

	if (bookObject) {
		var bibleID = bookObject.dam_id + "2ET"; // "2" is the current API version, and "ET" stands for "text"
		var bookID = bookObject.book_id;

		var parameters = {
			"v": "2",
			"dam_id": bibleID,
			"book_id": bookID,
			"chapter_id": chapterNumber,
			"verse_start": verseNumbers[0],
			"verse_end": verseNumbers[1]
		};

		API.callDBT("https://dbt.io/text/verse", parameters, callback);
		return;
	}

	// Try to pick another manna if the book didn't exist
	if (API.attempts < 20) {
		Core.getMannas(Core.loadRandomManna);
		API.attempts++;
		return;
	}

	alert("Something went wrong. Please try a different Bible version. Error code: API 2");
}

// ******************************************************
// API > Helpers: Get book number
// ******************************************************

API.Helpers.getBookNumber = function(location) {
	var bookNumber = parseInt(location.split(':')[0]);

	// The API is based on the Ethiopian Orthodox Tewahedo Church canon, so Matthew is book number 55 instead of 40
	if (bookNumber >= 40) {
		bookNumber = bookNumber + 15;
	}

	return bookNumber;
}

// ******************************************************
// API > Helpers: Get chapter number
// ******************************************************

API.Helpers.getChapterNumber = function(location) {
	return parseInt(location.split(':')[1]);
}

// ******************************************************
// API > Helpers: Get verse numbers
// ******************************************************

API.Helpers.getVerseNumbers = function(location) {
	var verses = location.split(':')[2];

	// Check for multiple verses
	if (verses.indexOf('-') != -1) {
		return verses.split('-');
	}

	return [verses, verses];
}

// ******************************************************
// API > Helpers: Search for book
// ******************************************************

API.Helpers.searchForBook = function(bookNumber) {
	var books = JSON.parse(localStorage.getItem("books"));

	if (books.length < 1) {
		alert("Something went wrong. Please try to re-select your Bible version. Error code: API 3");
	}

	var result = [];
	$.each(books, function(index, bookObject) {
		if (parseInt(bookObject.book_order) == bookNumber) {
			result = bookObject;
			return;
		}
	});

	return result;
}

// ******************************************************
// API > Helpers: Create manna object
// ******************************************************

API.Helpers.createMannaObject = function(passageObject) {
	if (passageObject.length < 1) {
		alert("Something went wrong. Error code: API 4");
	}

	var book = passageObject[0].book_name;
	var chapter = passageObject[0].chapter_id;
	var verses = passageObject[0].verse_id;
	var text = [];

	$.each(passageObject, function(index, verseObject) {
		text.push(verseObject.verse_text.trim());
	});

	text = text.join(" ");
	text = text.replace(/,$|;$/, "."); // Replace trailing comma and semi-colon with period

	// Check for multiple verses
	if (passageObject.length > 1) {
		verses = verses + "-" + passageObject[passageObject.length - 1].verse_id;
	}

	var title = book + " " + chapter + ":" + verses;
	var mannaObject = { "title": title, "text": text };
	return mannaObject;
}