

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
	while (monsterDisplay.firstChild) {
		monsterDisplay.removeChild(monsterDisplay.firstChild);
	}
	
	for(monster of monsters) {
		let monsterDiv = document.createElement("div");
		monsterDiv.className = "combat-unit";
		monsterDiv.appendChild(document.createTextNode(monster["name"]));
		monsterDiv.appendChild(document.createElement("hr"));
		
		let stats = document.createElement("ul");
		stats.className = "stats";

		let statString = "<li><p>Str</p><h3>" + monster["strength"] + "</h3></li>";
		statString += "<li><p>Dex</p><h3>" + monster["dexterity"] + "</h3></li>";
		statString += "<li><p>Con</p><h3>" + monster["constitution"] + "</h3></li>";
		statString += "<li><p>Int</p><h3>" + monster["intelligence"] + "</h3></li>";
		statString += "<li><p>Wis</p><h3>" + monster["wisdom"] + "</h3></li>";
		statString += "<li><p>Cha</p><h3>" + monster["charisma"] + "</h3></li>";

		stats.innerHTML = statString;
		monsterDiv.appendChild(stats);

		let healthDiv = document.createElement("div");
		healthDiv.className = "tank-div";

		monsterDiv.appendChild(healthDiv);
		
		longString += "<div class=\"tankyness\"><div><h4>HP</h4><p>" + monster["hit_points"] + "</p></div>";
		longString += "<div><h4>AC</h4><p>" + monster["armor_class"] + "</p></div></div>";
		
		longString += "</div>";

		monsterDisplay.appendChild(monsterDiv);
	}
	
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