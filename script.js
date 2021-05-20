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
const colony1 = new Colony(canvas.width/2, canvas.height/2, "sugar", 30);

// objects lists for the walls, and food in the world
const walls = [];
const foodPieces = [];

// the last time stamp for the last frame; used so that delta time can be found
let lastTime = 0.0;

// the fps to be printed to the console
let fps = 0.0;

const numFoodWhenClicked = 10;

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
            x: mouse.x + Math.floor(Math.random() * 11 - 5), 
            y: mouse.y + Math.floor(Math.random() * 11 - 5)
        };
        foodPieces.push(new Food(pos));
    }
    console.log("number of food pieces: ", foodPieces.length);
    console.log("mouse: ", mouse.x, mouse.y);
});

// -- End of event listeners

function setup() {
    colony1.makeColonyAnts();
    gameLoop();
}

function handleWalls() {
    for (let i = 0; i < walls.length; i++){
        walls[i].draw(ctx);
    }
}

function handleFood() {
    for (let i = 0; i < foodPieces.length; i++){
        foodPieces[i].draw(ctx);
    }
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
    colony1.update(delta, canvasSize, ctx, foodPieces);
    colony1.draw(ctx);

    // draw all the food after the colony so that the food will be drawn over the ants that are holding the food pieces
    handleFood();

    //fps = Math.floor(1000/delta);
    //console.log(fps);
    
    // get a new frame for the game loop
    requestAnimationFrame(gameLoop);
}

// call setup to make the ants and start animation
setup();

