

// Pexels API paEVAyCYoDaeRIfffGm61640fmNct6Mz9owiPixlpC1OROYiRufPY5OP
const DND_QUERY = "https://api.open5e.com/v1/monsters/?search=tarrasque";
const RNG_QUERY = "http://www.randomnumberapi.com/api/v1.0/random?min=1&max=20&count=10";

window.onload = init;

function init() {

    document.querySelector("#open5e-button").onclick = dndPressed;

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