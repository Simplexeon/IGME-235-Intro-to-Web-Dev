

// Pexels API paEVAyCYoDaeRIfffGm61640fmNct6Mz9owiPixlpC1OROYiRufPY5OP
const DND_MONSTER_QUERY = "https://api.open5e.com/v1/monsters/?limit=10&search=";
const RNG_QUERY = "http://www.randomnumberapi.com/api/v1.0/random?min=1&max=20&count=10";


window.onload = init;

// Data

const combatOrder = [];
const monsters = [];

let searchTerm;
let lastResults = [];



function init() {
    document.querySelector("#open5e-button").onclick = dndPressed;
	addEventListener("keydown", monsterSearch)
}

function updateCombatOrderDisplay() {
    let co = document.querySelector("#co");

    let orderString = "";

    for(let combatUnit in combatOrder) {
		orderString += "<div class=\"combat-unit\"><h3>" + combatOrder[combatUnit]["name"] + "</h3><hr>";
		orderString += "<div class=\"stats\"><h4>Initiative: " + combatOrder[combatUnit]["initiative"] + "</h4><h4>Health: ";
		orderString += combatOrder[combatUnit]["hp"] + "</h4></div>";
    }

	co.innerHTML = orderString;
}

function monsterSearch(e) {
	if(e.target != document.querySelector("#enemy-search")) {
		return;
	}
	searchTerm = e.target.value;
	
	xmlQuery(DND_MONSTER_QUERY + searchTerm).onload = searchResults;
}

function searchResults(e) {
	let searchResults = document.querySelector("#search-results");
	while (searchResults.firstChild) {
		searchResults.removeChild(searchResults.firstChild);
	}
	
	let response = JSON.parse(e.target.response);
	let results = response["results"];
	
	for(let monster in results) {
		let button = document.createElement("button");
		button.className = "result";
		button.dataset.monster = results[monster];
		
		button.innerHTML = "<p>" + results[monster]["name"] + "</p><em>" + results[monster]["document__title"] + "</em></button>";
		
		searchResults.appendChild(button);
		button.addEventListener("click", (e) => addMonster(results[monster]));
	}
	
	lastResults = results;
}

function addMonster(monster) {
	monsters.push(monster);
	console.log(monster);
	updateMonsterDisplay();
}

function updateMonsterDisplay() {
	let monsterDisplay = document.querySelector("#enemies")
	
	let longString = "";
	
	for(monster of monsters) {
		longString += "<div class=\"combat-unit\"><h3>" + monster["name"] + "</h3><hr>";
		longString += "<ul class=\"stats\"><li><h4>Str</h4><p>" + monster["strength"] + "</p></li>";
		longString += "<li><h4>Dex</h4><p>" + monster["dexterity"] + "</p></li>";
		longString += "<li><h4>Con</h4><p>" + monster["constitution"] + "</p></li>";
		longString += "<li><h4>Int</h4><p>" + monster["intelligence"] + "</p></li>";
		longString += "<li><h4>Wis</h4><p>" + monster["wisdom"] + "</p></li>";
		longString += "<li><h4>Cha</h4><p>" + monster["charisma"] + "</p></li></ul>";
		longString += "<div class=\"tankyness\"><div><h4>HP</h4><p>" + monster["hit_points"] + "</p></div>";
		longString += "<div><h4>AC</h4><p>" + monster["armor_class"] + "</p></div></div>";
		
		longString += "</div>";
	}
	
	monsterDisplay.innerHTML = longString;
}


function dndPressed(e) {
    xmlQuery(DND_QUERY).onload = dndResult;
}

function rngPressed(e) {
    xmlQuery(RNG_QUERY).onload = rngResult;
}


function xmlQuery(url) {
    let xhr = new XMLHttpRequest();
    xhr.onerror = queryError;

    xhr.open("GET", url);
    xhr.send();
    return xhr;
}


function dndResult(e) {
    let xhr = e.target;

    let obj = JSON.parse(xhr.responseText);

    let dndTextBox = document.querySelector("#open5e");
    dndTextBox.innerHTML = xhr.responseText;
}

function rngResult(e) {
    let xhr = e.target;

    let rngTextBox = document.querySelector("#rngapi");
    rngTextBox.innerHTML = xhr.responseText;
}

function queryError(e) {
    console.log("XML Query error has occurred.");
}