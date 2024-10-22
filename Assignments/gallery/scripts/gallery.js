"use strict";

window.onload = init;

let imageFrame;

function init() {
	imageFrame = document.querySelector("div img");
	
	let spans = document.querySelectorAll("li span");
	
	for(let span in spans) {
		spans[span].addEventListener("click", setImage);
	}
}


function setImage(e) {
	imageFrame.setAttribute("src", "images/" + e.target.dataset.image);
}