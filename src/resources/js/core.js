
// ******************************************************
// Module: Core
// ******************************************************

var Core = {};

'use strict';

// ******************************************************
// Core: Get mannas
// ******************************************************

Core.getMannas = function(callback) {
	$.getJSON("/resources/data/mannas.json", function(data) {
		callback(data);
	}).fail(function() {
		alert("Something went wrong. Error code: Core 1");
	});
}

// ******************************************************
// Core: Load random manna
// ******************************************************

Core.loadRandomManna = function(mannas) {
	var randomManna = Core.getRandomManna(mannas);
	API.requestPassageObject(randomManna.Location, View.loadManna);
}

// ******************************************************
// Core: Get random manna
// ******************************************************

Core.getRandomManna = function(mannas) {
	var shuffledMannas = Core.getShuffledMannas(mannas);
	var randomNumber = Core.getRandomNumber();

	shuffledMannas.map(function(manna) {
		manna.Diff = Math.abs(manna.ID - randomNumber);
		return manna;
	});

	shuffledMannas.sort(function(a, b) {
		return a.Diff - b.Diff;
	});

	return shuffledMannas[0];
}

// ******************************************************
// Core: Get shuffled mannas
// ******************************************************

Core.getShuffledMannas = function(mannas) {
	var randomIDs = new Uint32Array(mannas.length);
	window.crypto.getRandomValues(randomIDs);

	var shuffledMannas = mannas.map(function(manna, index) {
		manna.ID = randomIDs[index];
		return manna;
	});

	return shuffledMannas;
}

// ******************************************************
// Core: Get random number
// ******************************************************

Core.getRandomNumber = function() {
	var randomID = new Uint32Array(1);
	window.crypto.getRandomValues(randomID);
	return parseInt(randomID);
}