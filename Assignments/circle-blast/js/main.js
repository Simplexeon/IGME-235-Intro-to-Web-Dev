"use strict";
const app = new PIXI.Application();

let sceneWidth, sceneHeight;

// aliases
let stage;
let assets;

// game variables
let startScene;
let gameScene, ship, scoreLabel, lifeLabel, shootSound, hitSound, fireballSound;
let gameOverScene;

let circles = [];
let bullets = [];
let aliens = [];
let explosions = [];
let explosionTextures;
let score = 0;
let life = 100;
let levelNum = 1;
let paused = true;

// Load all assets
loadImages();

async function loadImages() {
    // https://pixijs.com/8.x/guides/components/assets#loading-multiple-assets
    PIXI.Assets.addBundle("sprites", {
        spaceship: "media/images/spaceship.png",
        explosions: "media/images/explosions.png",
        move: "media/images/move.png",
    });
    
    // The second argument is a callback function that is called whenever the loader makes progress.
    assets = await PIXI.Assets.loadBundle("sprites", (progress) => {
        console.log(`progress=${(progress * 100).toFixed(2)}%`); // 0.4288 => 42.88%
    });
    
    setup();
}

async function setup() {
    await app.init({ width: 600, height: 600 });
    
    document.body.appendChild(app.canvas);
    
    stage = app.stage;
    sceneWidth = app.renderer.width;
    sceneHeight = app.renderer.height;
    
    // #1 - Create the `start` scene
    
    startScene = new PIXI.Container();
    stage.addChild(startScene);
    
    // #2 - Create the main `game` scene and make it invisible
    
    gameScene = new PIXI.Container();
    gameScene.visible = false;
    stage.addChild(gameScene);
    
    // #3 - Create the `gameOver` scene and make it invisible
    
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);
    
    // #4 - Create labels for all 3 scenes
    
    createLabelsAndButtons();
    
    // #5 - Create ship
    
    ship = new Ship(assets.spaceship);
    gameScene.addChild(ship);
    
    // #6 - Load Sounds
    
    shootSound = new Howl({
        src: ["media/sounds/shoot.wav"],
    });
    
    hitSound = new Howl({
        src: ["media/sounds/hit.mp3"],
    });
    
    fireballSound = new Howl({
        src: ["media/sounds/fireball.mp3"],
    });
    
    // #7 - Load sprite sheet
    
    // #8 - Start update loop
    
    // #9 - Start listening for click events on the canvas
    
    // Now our `startScene` is visible
    // Clicking the button calls startGame()
}

function createLabelsAndButtons() {
    let buttonStyle = {
        fill: 0xffffff,
        fontSize: 48,
        fontFamily: "Consolas",
    };
    
    let startLabel1 = new PIXI.Text("Circle Blast!", {
        fill: 0xffffff,
        fontSize: 72,
        fontFamily: "Consolas",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    startLabel1.x = sceneWidth / 2 - startLabel1.width / 2;
    startLabel1.y = 230;
    startScene.addChild(startLabel1);
    
    let startLabel2 = new PIXI.Text("circles begone", {
        fill: 0xffffff,
        fontSize: 32,
        fontFamily: "Consolas",
        fontStyle: "italic",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    startLabel2.x = sceneWidth / 2 - startLabel2.width / 2;
    startLabel2.y = 300;
    startScene.addChild(startLabel2);
    
    let startButton = new PIXI.Text("Start the Game", buttonStyle);
    startButton.x = sceneWidth / 2 - startButton.width / 2;
    startButton.y = sceneHeight - 100;
    startButton.interactive = true;
    startButton.buttonMode = true;
    startButton.on("pointerup", startGame);
    startButton.on("pointerover", (e) => (e.target.alpha = 0.7));
    startButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0));
    startScene.addChild(startButton);
    
    
    // Game Scene --------------------------------------------
    
    let textStyle = {
        fill: 0xffffff,
        fontSize: 18,
        fontFamily: "Consolas",
        stroke: 0xff0000,
        strokeThickness: 4,
    }
    
    scoreLabel = new PIXI.Text("", textStyle);
    scoreLabel.x = 5;
    scoreLabel.y = 5;
    gameScene.addChild(scoreLabel);
    increaseScoreBy(0);
    
    lifeLabel = new PIXI.Text("", textStyle);
    lifeLabel.x = 5;
    lifeLabel.y = 26;
    gameScene.addChild(lifeLabel);
    decreaseLifeBy(0);
    
    
    // 3 - set up `gameOverScene`
    // 3A - make game over text
    let gameOverText = new PIXI.Text("Game Over!\n        :-O", {
        fill: 0xffffff,
        fontSize: 64,
        fontFamily: "Futura",
        stroke: 0xff0000,
        strokeThickness: 6,
    });
    gameOverText.x = sceneWidth / 2 - gameOverText.width / 2;
    gameOverText.y = sceneHeight / 2 - 160;
    gameOverScene.addChild(gameOverText);
    
    // 3B - make "play again?" button
    let playAgainButton = new PIXI.Text("Play Again?", buttonStyle);
    playAgainButton.x = sceneWidth / 2 - playAgainButton.width / 2;
    playAgainButton.y = sceneHeight - 100;
    playAgainButton.interactive = true;
    playAgainButton.buttonMode = true;
    playAgainButton.on("pointerup", startGame); // startGame is a function reference
    playAgainButton.on("pointerover", (e) => (e.target.alpha = 0.7)); // concise arrow function with no brackets
    playAgainButton.on("pointerout", (e) => (e.currentTarget.alpha = 1.0)); // ditto
    gameOverScene.addChild(playAgainButton);
}


function startGame() {
    startScene.visible = false;
    gameOverScene.visible = false;
    gameScene.visible = true;
}

function increaseScoreBy(amount) {
    score += amount;
    scoreLabel.text = `Score:  ${score}`;
}

function decreaseLifeBy(amount) {
    life -= amount;
    life = parseInt(life);
    lifeLabel.text = `Life:  ${life}%`;
}