"use strict";

// PROPERTIES

const GRID_SIZE = 10;
const TILE_LIGHT_CHANGE = 18;


// Elements

let gridTiles;



// Setup

window.onload = init;

function init(e) {
	setupGrid(GRID_SIZE, GRID_SIZE);
}



// Functions

function setupGrid(rows, columns) {
	let gridElement = document.querySelector(".game-area");
	gridElement.style.gridTemplateColumns = `repeat(1fr, ${columns});`;
	gridElement.style.gridTemplateRows = `repeat(1fr, ${rows});`;
	
	gridElement.addEventListener("contextmenu", (e) => e.preventDefault());
	
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
	
	
	// Clear the grid
	while (gridElement.firstChild) {
		gridElement.removeChild(gridElement.firstChild);
	}
	
	
	// Add tiles
	gridTiles = [];
	
	let rowLightness = 255 - TILE_LIGHT_CHANGE;
	for(let i = 0; i < columns; i++) {

		let lightness = rowLightness;

		let column = [];
		for(let j = 0; j < rows; j++) {
			let tileElement = document.createElement("button");
			tileElement.className = "tile";
			tileElement.style.backgroundColor = `color(srgb ${lightness / 255} ${lightness / 255} ${lightness / 255})`;
			
			let tile = new Tile(tileElement);

			// Left and right click
			tileElement.addEventListener("click", (e) => tileClicked(e, tile));
			tileElement.addEventListener("contextmenu", (e) => tileXed(e, tile));

			gridElement.appendChild(tileElement);
			column.push(tile);

			// Change lightness before to prevent trailing color changes
			if(j % 2 == 0) {
				lightness -= TILE_LIGHT_CHANGE;
			}
			else {
				lightness += TILE_LIGHT_CHANGE;
			}
		}

		gridTiles.push(column);

		// Change lightness 
		if(i % 2 == 0) {
			rowLightness -= TILE_LIGHT_CHANGE;
		}
		else {
			rowLightness += TILE_LIGHT_CHANGE;
		}
	}
	
	
}

function tileClicked(e, tile) {
	// Left Click
	if(tile.state == 0) {
		tile.changeTileState(1);
	}
	else {
		tile.changeTileState(0);
	}
}

function tileXed(e, tile) {
	e.preventDefault();

	if(tile.state == 0) {
		tile.changeTileState(2);
	}
	else {
		// Right Click
		tile.changeTileState(0);
	}
}