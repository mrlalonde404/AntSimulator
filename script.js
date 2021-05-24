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
    y: null,
};

// the first colony
const colony1 = new Colony(canvas.width/4, canvas.height/4, "sugar", 4);

// the second colony
const colony2 = new Colony(3*canvas.width/4, 3*canvas.height/4, "fire", 4);

// if the ants in a colony should wrap around the edges or be reflected off of them, used in the colony update
const wrap = false;

// width and height of walls
const wallSize = 30;

// objects lists for the walls, and food in the world
const walls = [];
const foodPieces = [];
let foodInWorld = 0;

// the last time stamp for the last frame; used so that delta time can be found
let lastTime = 0.0;

// the fps to be printed to the console
let fps = 0.0;

// how many pieces of food and over what range the food should be spread
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
 
// make food and remove walls using mouse and shift key
window.addEventListener('click', function(event){
    // update the mouse object
    mouse.x = event.x;
    mouse.y = event.y;

    if (event.shiftKey){ // shift + click near center of wall to remove it
        // see if a wall exists at the mouse position
        let wall = wallExistsAtPos(mouse);

        // if the wall does exist, remove the wall here
        if (wall !== undefined) {
            walls.splice(wall, 1);
        } 
    } else { // if this was just a left click, drop food
        // make the food objects at the mouse position
        spreadFoodAtLocation(mouse);   
    }
});

window.addEventListener('keydown', function(event) {
    if (event.key == "p") {
        alert("Simulator paused");
    }
});
// -- End of event listeners

function setup() {
    // make 2 walls down the middle vertically
    walls.push(new Wall(window.innerWidth/2, 0, wallSize, window.innerHeight/2 - 200));
    walls.push(new Wall(window.innerWidth/2, window.innerHeight/2 + 200, wallSize, window.innerHeight/2 - 200));

    // make 2 walls down the middle horizontally
    walls.push(new Wall(0, window.innerHeight/2, window.innerWidth/2 - 200 + wallSize/2, wallSize));
    walls.push(new Wall(window.innerWidth/2 + 200 + wallSize/2, window.innerHeight/2, window.innerWidth/2 - 200 + wallSize/2, wallSize));

    // make the first colony's ants with a size of 10
    colony1.makeColonyAnts(10);
    // make the second colon'y ants with a size of 12
    colony2.makeColonyAnts(12);

    gameLoop();
}

function wallExistsAtPos(pos){
    // see if a wall already exists in this location
    if (walls.length > 0) {
        for(let i = 0; i < walls.length; i++) {
            // the distance between the updated mouse position and the wall in question
            let dx = pos.x - walls[i].position.x - walls[i].width/2;
            let dy = pos.y - walls[i].position.y - walls[i].height/2;
            let dist = Math.sqrt(dx*dx + dy*dy);

            // get the smaller side of the walls width or height
            let side = (walls[i].width < walls[i].height) ? walls[i].width : walls[i].height;
            console.log(dist, side);

            // if the distance is less than the size of a wall
            if (dist < side) {
                // there is a wall at this location, return its index
                return i;
            }
        }
    }
    // wall not at this location
    return undefined;
}

function spreadFoodAtLocation(location) {
    // make a food object at the mouse click position
    for (let i = 0; i < numFoodWhenClicked; i++){
        let fx = location.x + (Math.floor(Math.random() * (foodSpawnRange * 2 + 1)) - foodSpawnRange);
        let fy = location.y + (Math.floor(Math.random() * (foodSpawnRange * 2 + 1)) - foodSpawnRange);
        foodPieces.push(new Food(fx, fy));
    }
    // increment the number of food in the world by the amount just added when clicked
    foodInWorld += numFoodWhenClicked;
}

function drawWalls() {
    for (let i = 0; i < walls.length; i++){
        walls[i].draw(ctx);
    }
}

function autoFeed(timesToFeed) {
    if (foodPieces.length < numFoodWhenClicked) {
        for (let i = 0; i < timesToFeed; i++){
            let pos = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight
            };
            spreadFoodAtLocation(pos);
        }
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

    // update the colonies
    colony1.update(delta, canvasSize, ctx, foodPieces, walls, wrap);
    colony2.update(delta, canvasSize, ctx, foodPieces, walls, wrap);

    // draw all the food after the colonies so that the food will be drawn over the ants that are holding the food pieces
    drawFoodPieces();

    // draw the colonies
    colony1.draw(ctx, foodInWorld);
    colony2.draw(ctx, foodInWorld);

    // draw all the walls and handle their collisions with ants
    drawWalls();

    // update the fps and draw it
    fps = Math.floor(1000/delta);
    drawFPS();
    
    // get a new frame for the game loop
    requestAnimationFrame(gameLoop);
}

// call setup to make the ants and start animation
setup();

