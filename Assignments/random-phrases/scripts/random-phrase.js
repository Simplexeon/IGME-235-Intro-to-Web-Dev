"use strict";

let phrase;
let button;

let answers = ["Yes.", "No.", "Try again later.", "Outcome uncertain.", "Outlook not so good.", "Concentrate and ask again."];


window.onload = init;


function init() {
	phrase = document.querySelector("#phrase-display");
	button = document.querySelector("button");
	
	displayQuote();
	
	button.addEventListener("click", displayQuote);
}

function displayQuote() {
	phrase.textContent = answers[Math.floor(Math.random() * answers.length)];
	
}