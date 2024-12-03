

// Pexels API paEVAyCYoDaeRIfffGm61640fmNct6Mz9owiPixlpC1OROYiRufPY5OP
const DND_MONSTER_QUERY = "https://api.open5e.com/v1/monsters/?limit=10&ordering=hit_points&search=";
const RNG_QUERY = "http://www.randomnumberapi.com/api/v1.0/random?min=1&max=20&count=10";


window.onload = init;

// Data

let combatOrder;
const monsters = [];
const monsterData = {};

let searchTerm;
let lastResults = [];


function init() {
	// Search when the user types
	let searchBar = document.querySelector("#enemy-search");
	
	// Grab saved search
	if(localStorage.getItem('search-term') != null) {
		searchBar.value = localStorage.getItem('search-term');
	}
	
	searchBar.addEventListener("change", monsterSearch);
}


function updateCombatOrderDisplay() {
	// Remove all of the existing elements
    let co = document.querySelector("#co");
	while (co.firstChild) {
		co.removeChild(co.firstChild);
	}
	
	// Sort monsters
	combatOrder = monsters.toSorted((a, b) => b["initiative"] - a["initiative"]);
	
	for(let monster of combatOrder) {
		co.appendChild(createMiniDisplay(monster));
	}
	
}

// Search for a monster
function monsterSearch(e) {
	if(e.target != document.querySelector("#enemy-search")) {
		return;
	}
	searchTerm = e.target.value;
	
	// Store the term
	localStorage.setItem('search-term', searchTerm);
	
	
	xmlQuery(DND_MONSTER_QUERY + searchTerm).onload = searchResults;
}

function searchResults(e) {
	// Clear the existing results
	let searchResults = document.querySelector("#search-results");
	while (searchResults.firstChild) {
		searchResults.removeChild(searchResults.firstChild);
	}
	
	// Parse results
	let response = JSON.parse(e.target.response);
	let results = response["results"];
	
	// Add the buttons
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

// Add a monster to being tracked.
function addMonster(monster) {
	// Track the info and the quantity of monsters
	let monsterKey = monster["name"] + monster["document__slug"];
	if(monsterData[monsterKey] == null) {
		monsterData[monsterKey] = monster;
		monsterData[monsterKey]["count"] = 1;
	}
	else {
		monsterData[monsterKey]["count"] += 1;
	}
	
	let newMonster = {
		"name": monster["name"] + " " + monsterData[monsterKey]["count"],
		"data": monster["name"] + monster["document__slug"],
		"hp": monster["hit_points"],
		"initiative": 0,
	}
	
	monsters.push(newMonster);
	updateMonsterDisplay();
	updateCombatOrderDisplay();
}

// Update the list of all monsters and stat blocks
function updateMonsterDisplay() {
	let monsterDisplay = document.querySelector("#enemies")
	while (monsterDisplay.firstChild) {
		monsterDisplay.removeChild(monsterDisplay.firstChild);
	}
	
	let monsterDisplays = {};
	
	for(monsterNote of monsters) {
		
		// Create a display if there isn't already one for this monster.
		if(monsterDisplays[monsterNote["data"]] == null) {
			monster = monsterData[monsterNote["data"]];
			
			let totalDiv = document.createElement("div");
			totalDiv.className = "full-monster-display";
			
			let monsterDiv = document.createElement("div");
			monsterDiv.className = "combat-unit";
			
			let monsterName = document.createElement("h1");
			monsterName.innerHTML = monster["name"];
			
			monsterDiv.appendChild(monsterName);
			
			let monsterSRD = document.createElement("em");
			monsterSRD.innerHTML = monster["document__title"];
			monsterDiv.appendChild(monsterSRD);
			
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
			
			let healthStatsString = "<div><p>HP</p><h3>" + monster["hit_points"] + "</h3></div>";
			healthStatsString += "<div><p>AC</p><h3>" + monster["armor_class"] + "</h3></div>";
			healthDiv.innerHTML = healthStatsString;
			
			monsterDiv.appendChild(healthDiv);
			monsterDiv.appendChild(document.createElement("hr"));
			
			let generalDiv = document.createElement("div");
			generalDiv.className = "general-info";
			
			let generalString = "<p><em>Speed</em>:";
			for(let speed in monster["speed"]) {
				generalString += " " + speed + " " + monster["speed"][speed] + "ft,";
			}
			generalString = generalString.slice(0, generalString.length - 1);
			generalString += "</p>";
			
			generalString += "<h3>Resistances</h3>";
			if(monster["damage_resistances"] != "") {
				generalString += `<p>${monster["damage_resistances"]}</p>`;
			}
			else {
				generalString += "<p>None.</p>";
			}
			generalString += "<h3>Vulnerabilities</h3>";
			if(monster["damage_vulnerabilities"] != "") {
				generalString += `<p>${monster["damage_vulnerabilities"]}</p>`;
			}
			else {
				generalString += "<p>None.</p>";
			}
			
			if(monster["special_abilities"] != null) {
				if(monster["special_abilities"].length > 0) {
					generalString += "<h3>Special Abilities</h3><hr>";
					
					for(let ability of monster["special_abilities"]) {
						generalString += `<p><em>${ability["name"]}</em> ${ability["desc"]}</p>`;
					}
				}
			}
			
			if(monster["actions"] != null) {
				if(monster["actions"].length > 0) {
					generalString += "<h3>Actions</h3><hr>";
					
					for(let ability of monster["actions"]) {
						generalString += `<p><em>${ability["name"]}</em> ${ability["desc"]}</p>`;
					}
				}
			}
			
			if(monster["desc"] != null) {
				if(monster["desc"] != "") {
					generalString += `<h3>Description</h3><hr><p>${monster["desc"]}</p>`;
				}
			}
			
			generalDiv.innerHTML = generalString;
			
			monsterDiv.appendChild(generalDiv);
		
			
			totalDiv.appendChild(monsterDiv);
			
			let individualDisplays = document.createElement("div");
			individualDisplays.className = "mini";
			totalDiv.appendChild(individualDisplays);
			
			monsterDisplays[monsterNote["data"]] = individualDisplays;
			
			monsterDisplay.appendChild(totalDiv);
		}
		
		// Insert this unit's display info.
		monsterDisplays[monsterNote["data"]].appendChild(createMiniDisplay(monsterNote));
	}
	
}

// Create a miniature version of the monster display
function createMiniDisplay(monster) {
	let display = document.createElement("div");
	display.className = "combat-unit";
	
	let name = document.createElement("h2");
	name.innerHTML = monster["name"];
	display.appendChild(name);
	
	let monsterSRD = document.createElement("em");
	monsterSRD.innerHTML = monsterData[monster["data"]]["document__title"];
	display.appendChild(monsterSRD);
	
	display.appendChild(document.createElement("hr"));
	
	let combatStats = document.createElement("div");
	combatStats.className = "combat-stats";
	
	let hpDiv = document.createElement("div");
	hpDiv.className = "hp-div";
	
	let hpLabel = document.createElement("h3");
	hpLabel.innerHTML = "HP";
	hpDiv.appendChild(hpLabel);
	
	let healthInput = document.createElement("input");
	healthInput.type = "text";
	healthInput.size = 4;
	healthInput.maxLength = 4;
	healthInput.value = monster["hp"];
	healthInput.pattern = /[0-9]+/i;
	healthInput.addEventListener("change", (e) => setHealth(monster, e.target.value));
	
	hpDiv.appendChild(healthInput);
	combatStats.appendChild(hpDiv);
	
	
	let initDiv = document.createElement("div");
	initDiv.className = "init-div";
	
	let initLabel = document.createElement("h3");
	initLabel.innerHTML = "Init";
	initDiv.appendChild(initLabel);
	
	let initInput = document.createElement("input");
	initInput.type = "text";
	initInput.size = 2;
	initInput.maxLength = 2;
	initInput.value = monster["initiative"];
	initInput.pattern = /[0-9]+/i;
	initInput.addEventListener("change", (e) => setInitiative(monster, e.target.value));
	
	initDiv.appendChild(initInput);
	
	combatStats.appendChild(initDiv);
	
	let removalButton = document.createElement("button");
	removalButton.innerHTML = "Remove";
	removalButton.addEventListener("click", (e) => removeMonster(monster));
	
	combatStats.appendChild(removalButton);
	
	display.appendChild(combatStats);
	
	return display;
}

// Update the health value of a monster
function setHealth(monster, value) {
	monster["hp"] = value;
	updateMonsterDisplay();
	updateCombatOrderDisplay();
}

// Update the initiative of a monster
function setInitiative(monster, value) {
	monster["initiative"] = value;
	updateMonsterDisplay();
	updateCombatOrderDisplay();
}


// Remove a monster and update the according areas.
function removeMonster(monster) {
	
	for(let monsterUnit in monsters) {
		// Check that they're the same
		if(monsters[monsterUnit]["data"] != monster["data"] || monsters[monsterUnit]["name"] != monster["name"]) {
			continue;
		}
		
		monsters.splice(monsterUnit, 1);
		break;
	}
	
	
	updateMonsterDisplay();
	updateCombatOrderDisplay();
}





function xmlQuery(url) {
    let xhr = new XMLHttpRequest();
    xhr.onerror = queryError;

    xhr.open("GET", url);
    xhr.send();
    return xhr;
}

function queryError(e) {
    console.log("XML Query error has occurred.");
}