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
	
	levelData["grid"] = [];
	for(let i = 0; i < levelData["size"]; i++) {
		let column = [];
		
		for(let j = 0; j < levelData["size"]; j++) {
			column.push(0);
		}
		
		levelData["grid"].push(column);
	}
	
	
	setupGrid(levelData["size"], levelData["size"]);
	
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
	
	
	// This pre-check ensures that any empty lines
	// are automatically marked completed.
	checkCompletion();
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
			
			let tile = new Tile(i, j, tileElement, levelData);

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
	
	checkCompletion();
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


// --------------------- COMPLETION DETECTION --------------------

function checkCompletion() {
	
	// COLUMNS
	for(let column in levelData["columns"]) {
		let columnData = levelData["columns"][column];
		
		let currentNumber = 0;
		let currentLine = 0;
		let returnPoint = 0;
		let errorLine = false;
		for(let y = 0; y < levelData["size"]; y++) {
			//console.log(`Column: ${column} Number: ${currentNumber} CurrentLineLength: ${currentLine}`);
			
			// Track the length of the currently being-checked line.
			if(levelData["grid"][y][column] == 1) {
				currentLine += 1;
				
				// Check for errors after the line was solved.
				// This will trigger if the successful solution
				// doesn't take up the whole line, and then there
				// are additional pieces placed after the number of lines.
				if(currentNumber >= columnData.length) {
					// LINE ERROR
					errorLine = true;
					break;
				}
				
				// If larger than the current number, continue to the next number
				if(columnData[currentNumber].number < currentLine) {
					// CORRECT LINE
					columnData[currentNumber].setState(0);
					currentNumber++;
					
					if(currentNumber >= columnData.length) {
						// Finished, end.
						break;
					}
				}
				
				// Check if on the end
				if(y + 1 == levelData["size"]) {
					if(columnData[currentNumber].number == currentLine) {
						// CORRECT LINE
						columnData[currentNumber].setState(1);
					}
					else {
						columnData[currentNumber].setState(0);
					}
					currentNumber++;
				}
				continue;
			}
			else if(currentLine > 0) {
				
				// Check if the line was correct
				if(columnData[currentNumber].number == currentLine) {
					// CORRECT LINE
					columnData[currentNumber].setState(1);
				}
				else {
					columnData[currentNumber].setState(0);
				}
				
				// Only continue to the next number if one has already been decided;
				currentLine = 0;
				returnPoint = y;
				currentNumber += 1;
				
				// Onto the next number
				continue;
			}
			
			// Reset if not on last number
			// Ensures that the solver can skip numbers when needed.
			if(currentNumber < columnData.length && y == levelData["size"] - 1) {
				if(columnData[currentNumber].number == 0) {
					// This is only reachable if the line is empty.
					columnData[currentNumber].setState(1);
					currentNumber++;
				}
				else {
					columnData[currentNumber].setState(0);
				
					y = returnPoint;
					currentNumber++;
				}
			}
			
		}
		
		// Any numbers still not reached are unfilled
		while(currentNumber < columnData.length) {
			columnData[currentNumber].setState(0);
			currentNumber++;
		}
		
		if(errorLine) {
			for(let number of columnData) {
				number.setState(2);
			}
		}
	}
	
	// ROWS
	for(let row in levelData["rows"]) {
		let rowData = levelData["rows"][row];
		
		let currentNumber = 0;
		let currentLine = 0;
		let returnPoint = 0;
		let errorLine = false;
		for(let x = 0; x < levelData["size"]; x++) {
			
			//console.log(`Column: ${column} Number: ${currentNumber} CurrentLineLength: ${currentLine}`);
			
			// Track the length of the currently being-checked line.
			if(levelData["grid"][row][x] == 1) {
				currentLine += 1;
				
				// Check if after line solved
				if(currentNumber >= rowData.length) {
					// LINE ERROR
					errorLine = true;
					break;
				}
				
				// If larger than the current number, continue to the next number
				if(rowData[currentNumber].number < currentLine) {
					// CORRECT LINE
					rowData[currentNumber].setState(0);
					currentNumber++;
					
					if(currentNumber >= rowData.length) {
						// Finished, end.
						break;
					}
				}
				
				// Check if on the end
				if(x + 1 == levelData["size"]) {
					if(rowData[currentNumber].number == currentLine) {
						// CORRECT LINE
						rowData[currentNumber].setState(1);
					}
					else {
						rowData[currentNumber].setState(0);
					}
					currentNumber++;
				}
				continue;
			}
			else if(currentLine > 0) {
				
				// Check if the line was correct
				if(rowData[currentNumber].number == currentLine) {
					// CORRECT LINE
					rowData[currentNumber].setState(1);
				}
				else {
					rowData[currentNumber].setState(0);
				}
				
				// Only continue to the next number if one has already been decided;
				currentLine = 0;
				currentNumber += 1;
				returnPoint = x;
				
				// Onto the next number
				continue;
			}
			
			// Reset if not on last number
			if(currentNumber < rowData.length && x == levelData["size"] - 1) {
				if(rowData[currentNumber].number == 0) {
					// This is only reachable if the line is empty.
					rowData[currentNumber].setState(1);
					currentNumber++;
				}
				else {
					rowData[currentNumber].setState(0);
				
					x = returnPoint;
					currentNumber++;
				}
			}
		}
		
		// Any numbers still not reached are unfilled
		while(currentNumber < rowData.length) {
			rowData[currentNumber].setState(0);
			currentNumber++;
		}
		
		if(errorLine) {
			for(let number of rowData) {
				number.setState(2);
			}
		}
	}
	
	
	// Check if every number is in the completed state.
	
}

