
// ******************************************************
// Module: View
// ******************************************************

var View = {
	DOM: {},
	Helpers: {}
};

'use strict';

// ******************************************************
// View: Cache DOM
// ******************************************************

View.cacheDom = function() {
	View.DOM.addButton = $("#addButton");
	View.DOM.addSection = $(".section.add");
	View.DOM.bibleDropdown = $("#bibles");
	View.DOM.body = $("body");
	View.DOM.bookWarning = $(".bookWarning");
	View.DOM.clickInfo = $(".clickInfo");
	View.DOM.footer = $(".footer");
	View.DOM.goBackButtons = $(".linkButton.goBack");
	View.DOM.languageButton = $("#languageButton");
	View.DOM.languageDropdown = $("#languages");
	View.DOM.languageSection = $(".section.language");
	View.DOM.listLoader = $(".listLoader");
	View.DOM.loading = $(".loading");
	View.DOM.loadingText = $(".loading span");
	View.DOM.manna = $(".manna");
	View.DOM.mannaButton = $("#getCryptoManna");
	View.DOM.mannaText = $(".mannaText");
	View.DOM.mannaTitle = $(".mannaTitle");
	View.DOM.menu = $(".menu");
	View.DOM.menuButton = $("#menuTrigger");
	View.DOM.menuClear = $(".menu #clear");
	View.DOM.menuItems = $(".menu ul li");
	View.DOM.menuShare = $(".menu #share");
	View.DOM.nextButton = $("#next");
	View.DOM.overlay = $(".overlay");
	View.DOM.pagingButtons = $(".paging");
	View.DOM.popup = $(".popup");
	View.DOM.prevButton = $("#prev");
	View.DOM.reportButton = $("#reportButton");
	View.DOM.reportSection = $(".section.report");
	View.DOM.sections = $(".section");
	View.DOM.selectBible = $(".selectBible");
	View.DOM.selectLanguage = $(".selectLanguage");
	View.DOM.selectedBible = $(".selectedBible");
	View.DOM.welcomeButton = $("#welcomeButton");
	View.DOM.welcomeSection = $(".section.welcome");
}

// ******************************************************
// View: Show welcome
// ******************************************************

View.showWelcome = function() {
	View.DOM.welcomeSection.show();
	View.DOM.welcomeButton.show();
	View.DOM.footer.hide();
}

// ******************************************************
// View: Display selected Bible
// ******************************************************

View.displaySelectedBible = function() {
	var language = JSON.parse(localStorage.getItem("language"));
	var bible = JSON.parse(localStorage.getItem("bible"));
	View.DOM.selectedBible.html(bible.bibleName + ' (' + language.languageName + ')');
}

// ******************************************************
// View: Load languages
// ******************************************************

View.loadLanguages = function(languages) {
	$.each(languages, function(index, languageObject) {
		var languageID = languageObject.language_family_code;
		var languageName = languageObject.language_family_name;

		View.DOM.languageDropdown.append('<option value="' + languageID + '">' + languageName + '</option>');
	});

	View.DOM.languageDropdown.select2({
		placeholder: "Choose your language"
	});

	View.DOM.selectLanguage.show();
	View.DOM.listLoader.hide();
}

// ******************************************************
// View: Load Bibles
// ******************************************************

View.loadBibles = function(bibles) {
	View.DOM.bibleDropdown.html("<option></option>");

	// The API returns two Bibles for each version, one containing the OT, and one the NT. They both have the same name,
	// and we only need one of them to get the Bible ID for later use. So we filter out duplicates using the Bible name,
	// which is the only way to separate them in the API, and we don't know whether the version will have either OT or NT.

	var prevBibleName;

	$.each(bibles, function(index, bibleObject) {
		var bibleID = bibleObject.dam_id;
		var bibleName = bibleObject.volume_name;

		if (bibleName != prevBibleName) {
			View.DOM.bibleDropdown.append('<option value="' + bibleID + '">' + bibleName + '</option>');
			prevBibleName = bibleName;
		}
	});

	View.DOM.bibleDropdown.select2({
		placeholder: "Choose your Bible"
	});

	View.DOM.selectBible.show();
	View.DOM.listLoader.hide();
}

// ******************************************************
// View: Load books
// ******************************************************

View.loadBooks = function(books) {
	if (books.length < 66) {
		View.DOM.bookWarning.show();
	}

	localStorage.setItem("books", JSON.stringify(books));
	View.DOM.mannaButton.removeClass("disabled");
}

// ******************************************************
// View: Load manna
// ******************************************************

View.loadManna = function(passageObject) {
	var mannaObject = API.Helpers.createMannaObject(passageObject);

	Storage.addToHistory(mannaObject);

	View.DOM.loading.hide();
	View.DOM.loading.find(".progress div").hide();

	View.DOM.mannaButton.removeClass("disabled");
	View.DOM.pagingButtons.removeClass("disabled");

	View.showManna(mannaObject);
}

// ******************************************************
// View: Show manna
// ******************************************************

View.showManna = function(mannaObject) {
	View.DOM.mannaTitle.html(mannaObject.title);
	View.DOM.mannaText.html(mannaObject.text);

	View.DOM.clickInfo.hide();
	View.DOM.mannaTitle.show();
	View.DOM.mannaText.show();

	View.Helpers.preventLineBreak(View.DOM.mannaTitle, 40);
	View.Helpers.adjustLongMannas();

	View.updatePaging();
}

// ******************************************************
// View: Hide manna
// ******************************************************

View.hideManna = function() {
	View.DOM.mannaTitle.hide();
	View.DOM.mannaTitle.html("");
	View.DOM.mannaText.hide();
	View.DOM.mannaText.html("");

	_displayedMannaIndex = Storage.getHistory().length;
}

// ******************************************************
// View: Trigger menu
// ******************************************************

View.triggerMenu = function() {
	var isOpen = View.DOM.menuButton.hasClass("goBack");
	View.DOM.body.css("overflow", "hidden"); // Hide scrollbar during animation

	if (isOpen) {
		View.DOM.menuButton.removeClass("goBack");
		View.DOM.menuButton.html("Menu");
		View.DOM.menu.animate({ top: "100%" }, 200, function() {
			View.DOM.pagingButtons.removeClass("disabled");
			View.DOM.menu.hide();
			View.DOM.body.css("overflow", "visible");
		});
	} else {
		View.DOM.menuButton.addClass("goBack");
		View.DOM.menuButton.html("Close");
		View.DOM.pagingButtons.addClass("disabled");
		View.DOM.menu.show();
		View.DOM.menu.animate({ top: 0 }, 200, function() {
			View.DOM.body.css("overflow", "visible");
		});
	}
}

// ******************************************************
// View: Fake loading (disappears when manna is loaded)
// ******************************************************

View.fakeLoading = function() {
	View.hideManna();

	View.DOM.mannaButton.addClass("disabled");
	View.DOM.pagingButtons.addClass("disabled");
	View.DOM.loading.show();

	View.DOM.loading.find(".a").show();
	View.DOM.loadingText.html("Shaking the box");

	setTimeout(function() {
		View.DOM.loading.find(".b").show();
		View.DOM.loadingText.html("Applying cryptographics");
	}, 200);

	setTimeout(function() {
		View.DOM.loading.find(".c").show();
		View.DOM.loadingText.html("Picking a manna");
	}, 400);

	setTimeout(function() {
		View.DOM.loading.find(".d").show();
		View.DOM.loadingText.html("Finalizing");
	}, 1000);
}

// ******************************************************
// View: Show popup
// ******************************************************

View.showPopup = function(text) {
	View.DOM.overlay.show();
	View.DOM.popup.find("p").html(text);
	View.DOM.popup.show();

	View.DOM.popup.find(".goBack").click(function() {
		View.DOM.overlay.hide();
		View.DOM.popup.find("p").html("");
		View.DOM.popup.hide();
	});
}

// ******************************************************
// View: Update paging
// ******************************************************

View.updatePaging = function() {
	var storedMannas = Storage.getHistory();

	// Show back-button if any stored mannas exist, but hide it if the current manna displayed is the oldest one in history
	if (storedMannas.length > 0 && _displayedMannaIndex > 0) {
		View.DOM.prevButton.addClass("active");
	} else {
		View.DOM.prevButton.removeClass("active");
	}

	// Show next-button if the current manna displayed is not the newest one in history
	if (_displayedMannaIndex < (storedMannas.length - 1)) {
		View.DOM.nextButton.addClass("active");
	} else {
		View.DOM.nextButton.removeClass("active");
	}
}

// ******************************************************
// View > Helpers: Prevent line break
// ******************************************************

View.Helpers.preventLineBreak = function(containerObject, heightLimit) {
	var fontSize = parseInt(containerObject.css("font-size"));

	while (containerObject.height() > heightLimit) {
		fontSize--;
		containerObject.css("font-size", fontSize + "px");
	}
}

// ******************************************************
// View > Helpers: Adjust long mannas
// ******************************************************

View.Helpers.adjustLongMannas = function() {
	View.DOM.manna.removeClass("long");

	if (View.DOM.manna.offset().top < 80) {
		View.DOM.manna.addClass("long");
	}
}