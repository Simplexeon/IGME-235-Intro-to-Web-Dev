

window.onload = init;
    
let displayTerm = "";


// Processes

function init() {
    document.querySelector("#search").onclick = searchButtonClicked

}

function searchButtonClicked(){
    console.log("searchButtonClicked() called");
    
    const GIPHY_URL = "https://api.giphy.com/v1/gifs/search?";
    const GIPHY_KEY = "5PuWjWVnwpHUQPZK866vd7wQ2qeCeqg7";

    let url = GIPHY_URL + "api_key=" + GIPHY_KEY;

    let term = document.querySelector("#searchterm").value;
    displayTerm = term;

    term = term.trim();
    term = encodeURIComponent(term);

    if(term.length < 1) {
        return;
    }

    url += "&q=" + term;

    let limit = document.querySelector("#limit").value;
    url += "&limit=" + limit;

    document.querySelector("#status").innerHTML = "<b>Searching for " + displayTerm + "</b>";

    console.log(url);

    getData(url);

}

function getData(url) {
    let xhr = new XMLHttpRequest();
    xhr.onload = dataLoaded;
    xhr.onerror = dataError;

    xhr.open("GET", url);
    xhr.send();
}


function dataLoaded(e) {
    let xhr = e.target;

    console.log(xhr.responseText);
}


function dataError(e) {
    console.log("Error occurred while accessing GIPHY data.");
}