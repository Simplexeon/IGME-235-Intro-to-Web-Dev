"use strict";

// PROPERTIES

const GRID_SIZE = 10;
const TILE_LIGHT_CHANGE = 18;


// Elements

let levelData;
let gridTiles;


// Variables

// Track if the mouse is down
let mouseDown;

// Track whether or not the user is placing or
// removing tiles, so they don't accidentally erase
// their work.
// 0 = Not placing
// 1 = placing tiles
// 2 = placing x's
// 3 = removing marks
let placingState;


// Setup

window.onload = init;

function init(e) {
	loadLevel("levels/level-test.json");
	mouseDown = false;
	placingState = 0;
	window.onmousedown = pressedMouse;
	window.onmouseup = mouseReleased;
}


// Functions

function loadLevel(filepath) {
	fetch(filepath).then((response) => response.json()).then(fileLoaded);
}

function fileLoaded(json) {
	levelData = json;
	
	setupGrid(json["size"], json["size"]);
	
	let columnData = [];
	let columnNumberDiv = document.querySelector(".column-area");
	for(let line of levelData["columns"]) {
		
		let numberDiv = document.createElement("div");
		numberDiv.className = "column numbers";
		
		let lineData = [];
		for(let number of line) {
			let numberElement = document.createElement("p");
			numberElement.innerHTML = number;
			
			numberDiv.appendChild(numberElement);
			lineData.push(new Number(number, numberElement));
		}
		
		columnNumberDiv.appendChild(numberDiv);
		
		columnData.push(lineData);
	}
	levelData["columns"] = columnData;
	
	
	let rowData = [];
	let rowNumberDiv = document.querySelector(".row-area");
	for(let line of levelData["rows"]) {
		
		let numberDiv = document.createElement("div");
		numberDiv.className = "row numbers";
		
		let lineData = [];
		for(let number of line) {
			let numberElement = document.createElement("p");
			numberElement.innerHTML = number;
			
			numberDiv.appendChild(numberElement);
			lineData.push(new Number(number, numberElement));
		}
		
		rowNumberDiv.appendChild(numberDiv);
		
		rowData.push(lineData);
	}
	levelData["rows"] = rowData;
}

function createNumberDiv(numbers, className) {
	
	let divString = "";
	for(let number of numbers) {
		divString += `<p>${number}</p>`;
	}
	numberDiv.innerHTML = divString;
	
	return numberDiv;
}


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
			tileElement.addEventListener("mousedown", (e) => tileClicked(e, tile));
			tileElement.addEventListener("contextmenu", (e) => xTile(e, tile));
			tileElement.addEventListener("mouseenter", (e) => mouseEnteredTile(e, tile));

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
	
	
	// Create CENTERLINES
	
	let gameElement = document.querySelector("#game");
	let columnArea = document.querySelector(".column-area");
	let rowArea = document.querySelector(".row-area");
	
	let rowBaseYPos = columnArea.offsetHeight + columnArea.offsetTop;
	for(let i = 5; i < rows; i += 5) {
		let centerline = document.createElement("span");
		centerline.className = "centerline";
		
		centerline.style.width = `${gridElement.offsetWidth - 4}px`;
		centerline.style.height = 0;
		centerline.style.top = `${rowBaseYPos + ((i / rows) * gridElement.offsetHeight)}px`;
		centerline.style.left = `${((gameElement.offsetWidth - rowArea.offsetWidth) / 2) + rowArea.offsetWidth}px`;
		
		gameElement.appendChild(centerline);
	}
	
	let columnBaseXPos = rowArea.offsetWidth + rowArea.offsetLeft;
	for(let i = 5; i < columns; i += 5) {
		let centerline = document.createElement("span");
		centerline.className = "centerline";
		
		centerline.style.height = `${gridElement.offsetHeight - 4}px`;
		centerline.style.width = 0;
		centerline.style.left = `${columnBaseXPos + ((i / columns) * gridElement.offsetHeight)}px`;
		centerline.style.top = `${((gameElement.offsetHeight - columnArea.offsetHeight) / 2) + columnArea.offsetHeight}px`;
		
		gameElement.appendChild(centerline);
	}
}


// --------- TILE INTERACTION -----------------

function tileClicked(e, tile) {
	// Only on left click
	if(mouseDown == 1 || e.button == 0) {
		if(tile.state == 0) {
			// Don't place if erasing
			if(placingState == 0 || placingState == 1) {
				tile.changeTileState(1);
				placingState = 1;
			}
		}
		else {
			// Don't erase if placing tiles
			if(placingState == 0 || placingState == 3) {
				tile.changeTileState(0);
				placingState = 3;
			}
		}
	}
	if(mouseDown == 3 || e.button == 2) {
		if(tile.state == 0) {
			if(placingState == 0 || placingState == 2) {
				tile.changeTileState(2);
				placingState = 2;
			}
		}
		else {
			// Right Click
			if(placingState == 0 || placingState == 3) {
				tile.changeTileState(0);
				placingState = 3;
			}
		}
	}
}

function xTile(e, tile) {
	e.preventDefault();
}


// -------- Tracking Mouse State for DRAGGING ----------

function pressedMouse(e) {
	// Add one so that 0 can be no button pressed
	mouseDown = e.button + 1;
}

function mouseReleased(e) {
	mouseDown = 0;
	placingState = 0;
}

function mouseEnteredTile(e, tile) {
	if(mouseDown != 0) {
		tileClicked(e, tile);
	}
}