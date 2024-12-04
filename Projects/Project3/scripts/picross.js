"use strict";

// PROPERTIES

const GRID_SIZE = 5;


// Elements

let gridTiles;



// Setup

window.onload = init;

function init(e) {
	console.log("hi")
	setupGrid(GRID_SIZE, GRID_SIZE);
}



// Functions

function setupGrid(rows, columns) {
	let gridElement = document.querySelector(".game-area");
	gridElement.style.gridTemplateColumns = `repeat(1fr, ${columns});`;
	gridElement.style.gridTemplateRows = `repeat(1fr, ${rows});`;
	
	let gridElementString = "";
	let num = 1;
	for(let i = 0; i < columns; i++) {
		gridElementString += "\"";
		
		for(let j = 0; j < rows; j++) {
			gridElementString += ` ${num} `;
			num++;
		}
		
		gridElementString += "\"";
	}
	gridElement.style.gridTemplateAreas = gridElementString;
	console.log(gridElementString)
	
	
	// Clear the grid
	while (gridElement.firstChild) {
		gridElement.removeChild(gridElement.firstChild);
	}
	
	
	// Add tiles
	gridTiles = [];
	
	for(let i = 0; i < columns; i++) {
		let column = [];
		for(let j = 0; j < rows; j++) {
			let tile = document.createElement("button");
			tile.className = "tile";
			
			gridElement.appendChild(tile);
			column.push(tile);
		}
		gridTiles.push(column);
	}
	
	
}