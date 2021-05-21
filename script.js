import Colony from './Colony.js';
import Wall from './Wall.js';
import Food from './Food.js';

// get the canvas object, the context from the canvas, and set the size of the canvas according to the inside width of the browser window
let canvas = document.getElementById("canvas1");
let ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// make an object called canvasSize to hold the size of the canvas
let canvasSize = {
    width: window.innerWidth,
    height: window.innerHeight
};


// make a mouse object
const mouse = {
    x: null,
    y: null
};

// the first colony
const colony1 = new Colony(canvas.width/2, canvas.height/2, "sugar", 20);

// if the ants in a colony should wrap around the edges or be reflected off of them, used in the colony update
const wrap = false;

// objects lists for the walls, and food in the world
const walls = [];
const foodPieces = [];
let foodInWorld = 0;

// the last time stamp for the last frame; used so that delta time can be found
let lastTime = 0.0;

// the fps to be printed to the console
let fps = 0.0;

const numFoodWhenClicked = 40;
const foodSpawnRange = 30;

// -- Event listeners
// if the window is resized change the width and height variables appropriately
window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // update the canvasSize object
    canvasSize = {
        width: window.innerWidth,
        height: window.innerHeight
    };
});

// make food at the mouse location when the mouse is clicked
window.addEventListener('click', function(event){
    // update the mouse object
    mouse.x = event.x;
    mouse.y = event.y;

    // make a food object at the mouse click position
    for (let i = 0; i < numFoodWhenClicked; i++){
        let pos = {
            x: mouse.x + (Math.floor(Math.random() * (foodSpawnRange * 2 + 1)) - foodSpawnRange), 
            y: mouse.y + (Math.floor(Math.random() * (foodSpawnRange * 2 + 1)) - foodSpawnRange)
        };
        foodPieces.push(new Food(pos));
    }
    // increment the number of food in the world by the amount just added when clicked
    foodInWorld += numFoodWhenClicked;
});
// -- End of event listeners

function setup() {
    // make the first colony's ants with a size of 10
    colony1.makeColonyAnts(10);
    gameLoop();
}

function handleWalls() {
    for (let i = 0; i < walls.length; i++){
        walls[i].draw(ctx);
    }
}

function drawFoodPieces() {
    for (let i = 0; i < foodPieces.length; i++){
        foodPieces[i].draw(ctx);
    }
}

function drawFPS() {
    ctx.font = "20px Georgia"; 
    ctx.fillStyle = "white"; 
    ctx.fillText(`${fps}`, 15, 15);
} 

function gameLoop(timeStamp) {
    // get the delta time in between the frames
    let delta = timeStamp - lastTime;

    // set the new last time for the next frame to the current time stamp for this frame
    lastTime = timeStamp;

    // refresh the screen by putting a clear rectangle on across the entire screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw all the walls and handle their collisions with ants
    //handleWalls();

    // update and draw the first colony
    colony1.update(delta, canvasSize, ctx, foodPieces, wrap);
    colony1.draw(ctx, foodInWorld);

    // draw all the food after the colony so that the food will be drawn over the ants that are holding the food pieces
    drawFoodPieces();

    fps = Math.floor(1000/delta);
    drawFPS();
    
    // get a new frame for the game loop
    requestAnimationFrame(gameLoop);
}

// call setup to make the ants and start animation
setup();

