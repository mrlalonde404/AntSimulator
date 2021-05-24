import Pheromone from "./Pheromone.js";
export default class Ant {
    constructor (ax, ay, sp, d, s) {
        // the species of the ant
        this._species = sp;

        // the position of the ant should have an x and y component 
        this._position = {
            x: ax,
            y: ay
        };

        // the ants previous position before this one
        this._previousPosition = {
            x: this._position.x,
            y: this._position.y
        };
        
        // the fastest speed the ant should be allowed to move
        this._maxSpeed = 40;

        // this is the direction that the ant is facing
        this._dir = d;

        // the ant velocity should have an x and y component 
        this._velocity = {
            x: this._maxSpeed * Math.cos(this._dir),
            y: this._maxSpeed * Math.sin(this._dir)
        };

        // how big the ant is
        this._size = s;

        this._viewRange = 80;

        this._viewRangePosition = {
            x: this._position.x + ((this._size/2 + this._viewRange) * Math.cos(this._dir)),
            y: this._position.y + ((this._size/2 + this._viewRange) * Math.sin(this._dir))
        }

        // this should be the food item that is picked up from the food source and brought back to the colony 
        this._foodCarried = [];

        this._frame = 0;
    }

    get position() {
        return this._position;
    }

    get previousPosition() {
        return this._previousPosition;
    }

    get species() {
        return this._species;
    }

    get maxSpeed() {
        return this._maxSpeed;
    }

    get dir() {
        return this._dir;
    }

    get velocity() {  
        return this._velocity;
    }

    get size() {
        return this._size;
    }

    get viewRange() {
        return this._viewRange;
    }

    get viewRangePosition() {
        return this._viewRangePosition;
    }

    get foodCarried() {  
        return this._foodCarried;
    }

    get frame() {
        return this._frame;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set previousPosition(prev) {
        this._previousPosition.x = prev.x;
        this._previousPosition.y = prev.y;
    }

    set species(sp) {
        this._species = sp;
    }

    set maxSpeed(speed) {
        this._maxSpeed = speed;
    }

    set dir(d) {
        this._dir = d;
    }

    set velocity(vel) {
        this._velocity.x = vel.x;
        this._velocity.y = vel.y;
    }

    set size(s) {
        this._size = s;
    }

    set viewRange(vr) {
        this._viewRange = vr;
    }

    set viewRangePosition(vrp) {
        this._viewRangePosition = vrp.x;
        this._viewRangePosition = vrp.y;
    }

    set foodCarried(carried) {
        this._foodCarried = carried;
    }

    set frame(f) {
        this._frame = f;
    }

    wrapEdges(canvasSize) {
        if (this.position.x + this.size > canvasSize.width) {
            this.position.x = this.size;
        }
        if (this.position.x - this.size < 0) {
            this.position.x = canvasSize.width - this.size;
        }
        if (this.position.y + this.size > canvasSize.height) {
            this.position.y = this.size;
        }
        if (this.position.y - this.size < 0) {
            this.position.y = canvasSize.height - this.size;
        }
    }

    // reflect the x or y velocity for the ant if it runs into one of the borders after offsetting it by the size of the ants head to prevent recolliding with the wall
    reflectEdges(canvasSize) {
        if (this.position.x + this.size >= canvasSize.width) {
            this.position.x = this.previousPosition.x;
            this.velocity.x *= (Math.random() - 1.0);
        }
        if (this.position.x - this.size < 0) {
            this.position.x = this.previousPosition.x;
            this.velocity.x *= (Math.random() - 1.0);
        }
        if (this.position.y  + this.size >= canvasSize.height) {
            this.position.y = this.previousPosition.y;
            this.velocity.y *= (Math.random() - 1.0);
        }
        if (this.position.y - this.size < 0) {
            this.position.y = this.previousPosition.y;
            this.velocity.y *= (Math.random() - 1.0);
        }
        // get the new direction for the new velocities
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);
    }

    constrainDir() {
        if (this.dir > 2*Math.PI){
            this.dir -= 2*Math.PI;
        }
        if (this.dir < 0) {
            this.dir += 2*Math.PI;
        }
    }

    // when the dir is changed, use this function to get the new x and y components from that new direction
    calculateSpeed() {
        this.velocity = {
            x: this.maxSpeed * Math.cos(this.dir),
            y: this.maxSpeed * Math.sin(this.dir)
        };
    }

    // change the direction by adding pi radians to the direction to turn completely around
    flipDir() {
        this.velocity.x *= (Math.random() - 1.0);
        this.velocity.y *= (Math.random() - 1.0);
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);
    }

    update(delta) {
        // the first frame there wont be a delta so skip it
        if (!delta) return;

        // update the previosu position for the next frame with the values for the current frame
        this.previousPosition = this.position;

        // otherwise, update the ant position by the ant velocity divided by the delta time
        this.position.x += this.velocity.x / delta;
        this.position.y += this.velocity.y / delta;

        // update the direction the ant is facing
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);

        // update the speeds
        this.calculateSpeed();

        // update the view range position based on the updated
        this.viewRangePosition.x = this.position.x + ((this.size/2 + this.viewRange) * Math.cos(this.dir));
        this.viewRangePosition.y = this.position.y + ((this.size/2 + this.viewRange) * Math.sin(this.dir));

        // increment the frame
        this.frame++;
    }

    updateFoodCarriedPosition() {
        let foodLocation = {
            x: this.position.x + (this.size * Math.cos(this.dir)),
            y: this.position.y + (this.size * Math.sin(this.dir))
        }

        // set the food location to the location calculated above
        this.foodCarried[0].position = foodLocation;
    }

    dropFood(food, foodPieces) {
        // loop through the food pieces list until the piece is found and then remove it from the list
        for (let i = 0; i < foodPieces.length; i++) {
            if (foodPieces[i] == food) {
                foodPieces.splice(i, 1);
                break;
            }
        }
        // empty the list of food pieces the ant is carrying
        this.foodCarried = [];
    }

    getDistance(pos1, pos2) {
        // get the change in the x and the y between pos1 and pos2
        let dx = pos2.x - pos1.x;
        let dy = pos2.y - pos1.y;

        // use the dx and dy to find the distance using the pythagorean theorem
        return Math.sqrt(dx*dx + dy*dy);
    }

    findInRangePheromones(pheromones) {
        // follow the pheromones back to either the colony or the food
        let inRangePheromones = [];

        // get the closest pheromones that are in the view range of the ant
        for (let i = 0; i < pheromones.length; i++) {
            let vrDist = this.getDistance(this.viewRangePosition, pheromones[i].position);
            if (vrDist < this.viewRange) {
                inRangePheromones.push(pheromones[i]);
            }
        }
        // return the pheromones that are in the range
        return inRangePheromones;
    }

    findWeakestPheromone(pheromones) {
        // get the home pheromones in range
        let inRange = this.findInRangePheromones(pheromones);
        
        // if some close pheromones were found
        if (inRange.length > 0) {
            // get the pheromone in front of the ant that is the weakest, give a starting value 1 + the value that all pheromones start off with
            let weakest = pheromones[0].originalLife + 1;

            // set the original weakest to the first pheromone so that we can skip it
            let weakestPheromone = pheromones[0];
            
            // start looking from the second pheromone
            for (let i = 1; i < inRange.length; i++) {
                if (inRange[i].life < weakest) {
                    weakest = inRange[i].life;
                    weakestPheromone = inRange[i];
                } 
            }
            // return the strongest pheromone
            return weakestPheromone;
        }
        // no pheromones were found
        return undefined;
    }

    findStrongestPheromone(pheromones) {
        // get the home pheromones in range
        let inRange = this.findInRangePheromones(pheromones);
        
        // if some close pheromones were found
        if (inRange.length > 0) {
            // get the pheromone in front of the ant that is the strongest, start with -1 since all pheromones that exist have a value > 0
            let strongest = -1;

            // set the strongest to the first pheromone so that we can skip it
            let strongestPheromone = pheromones[0];

            // start looking from the second pheromone
            for (let i = 1; i < inRange.length; i++) {
                if (inRange[i].life > strongest) {
                    strongest = inRange[i].life;
                    strongestPheromone = inRange[i];
                } 
            }
            // return the strongest pheromone
            return strongestPheromone;
        }
        // no pheromones were found
        return undefined;
    }

    steerToPos(pos) {
        // if a pheromone was found then steer towards it by changing the direction and the x and y velocities
        if (pos != undefined) {
            // steer towards the pheromone by changing the direction to go towards it
            let dx = pos.x - this.position.x;
            let dy = pos.y - this.position.y;

            // the angle to the pheromone is the change in y over the change in x
            let gamma = Math.atan2(dy, dx);

            // change the direction by steering towards gamma by walk amount
            this.dir = gamma;

            // change the velocities to correspond with the direction
            this.calculateSpeed();
        }
    }

    checkFoodCollision(food) {
        // only works if collision and food hasn't been picked up
        // if the distance between the food center and the ant center is less than both of their radius added together, their circles are overlapping, they collided 
        let distanceToFood = this.getDistance(this.position, food.position);

        if (distanceToFood <= (food.size + this.size * 1.25) && !food.pickedUp) {
            if (this.foodCarried.length === 0) {
                // mark the food as picked up
                food.pickedUp = true;

                // make the ant carry the piece of food
                this.foodCarried.push(food);
                
                // the ant collided with the food
                return true;
            }
        }
        // there was not a collision
        return false;
    }

    checkColonyCollision(foodPieces, colonyPos, colonySize) {
        // get the distance from the ant's position to the colnie's position
        let distanceToColony = this.getDistance(this.position, colonyPos);

        // see if the colony circle and the ant circle overlap
        if (distanceToColony <= (this.size + colonySize)) {
            // drop the food and remove it from the food pieces
            this.dropFood(this.foodCarried[0], foodPieces)

            // the ant collided with the colony
            return true;
        }
        // the ant did not collide with the colony
        return false;
    }

    intersects(wall) {
        let collision = false;

        // the difference in the center of the ant and the center of the rectangle
        let dx = Math.abs(this.position.x - (wall.position.x + wall.width/2));
        let dy = Math.abs(this.position.y - (wall.position.y + wall.height/2));

        // if the difference from the center of the ant to the center of the rectangle is less than half the width or height plus the ants size, there is no collision
        if (dx > wall.width/2 + this.size) {
            return [false];
        }
        if (dy > wall.height/2 + this.size) {
            return [false];
        }

        // if there is a corner collision there is a collsiion on 2 sides of the wall
        let cornerDistanceSq = Math.pow(dx - wall.width/2, 2) + Math.pow(dy - wall.height/2, 2);
        if (cornerDistanceSq <= (this.size * this.size)) {
            collision = true;
        }

        // if the difference in the x or y direction is less than half of the width or height, there is a collison
        if (dx <= (wall.width/2)) { 
            collision = true; 
        } 
        if (dy <= (wall.height/2)) { 
            collision = true;
        }

        // get what side the collision happened on
        let sides = [];
        if (this.position.x < wall.position.x) { // left side = 0     
            sides.push(0); 
        }
        else if (this.position.x > wall.position.x+wall.width) { // right side = 1
            sides.push(1); 
        }

        if (this.position.y < wall.position.y) { // top side = 2
            sides.push(2); 
        }
        else if (this.position.y > wall.position.y+wall.height) { // bottom side = 3
            sides.push(3);
        }

        // return if their was a collision and what side it happened on if it was
        return [collision, sides];
    }

    handleWallCollision(walls) {
        for (let i = 0; i < walls.length; i++) {
            // if the ants head intersects with one of the walls, there is a collision
            let collision = this.intersects(walls[i]);

            // if there was a collision
            if (collision[0]) {
                // get the sides the collision happened on
                let sides = collision[1];
                for (let j = 0; j < sides.length; j++) {
                    // if a left or right collision, flip the x velocity and set the x component of the positon to the x component of the previous position
                    if (sides[j] === 0 || sides[j] === 1){
                        this.velocity.x *= (Math.random() - 1.0);
                        this.position.x = this.previousPosition.x;
                    }

                    // if a top or bottom collision, flip the y velocity and set the y component of the positon to the y component of the previous position
                    if (sides[j] === 2 || sides[j] === 3){
                        this.velocity.y *= (Math.random() - 1.0);
                        this.position.y = this.previousPosition.y;
                    }
                }

                // update the direction the ant is facing
                this.dir = Math.atan2(this.velocity.y, this.velocity.x);
                break;
            }
        }
    }

    randomWander() {
        let randomWalkAmount = 0.02;
        // if there is no closest pheromones randomly walk
        let randomWalk =  (Math.random() <= 0.5 ? randomWalkAmount : -1 * randomWalkAmount); 
        // change the angle and therefore the velocity of the ant by some added random direction
        this.dir += randomWalk;
        this.calculateSpeed();
    }

    // how the ant will wander around the screen looking for pheromones
    wander(foodPheromones, homePheromones, foodPieces, walls, colonyPos, colonySize) {
        // the amount of food dropped off at the colony
        let foodDropped = 0;

        // if the ant doesn't have food
        if (this.foodCarried.length === 0) { 
            // look for the food leaving toHome pheromones from the colony until it finds food
            if (this.frame != 0 && this.frame % 60 == 0) {
                homePheromones.push(new Pheromone(this.position.x, this.position.y, true, this.species));
            }

            // if the food is in the ant's view range
            let foodInRange = false;

            // look at all the food pieces to see if the ant is near it
            for (let i = 0; i < foodPieces.length; i++) {
                // get the distance to see if the food piece is in the view range for the ant
                let vrDist = this.getDistance(this.viewRangePosition, foodPieces[i].position);

                // make sure that the ant is only carrying 1 piece of food
                if (this.foodCarried.length > 0) {
                    break;
                } else if (vrDist < this.viewRange + foodPieces[i].size && !foodPieces[i].pickedUp) {
                    // the ant is within range of the food, and that piece of food hasn't been picked up already
                    foodInRange = true;

                    // check if the ant ran into the food after steering
                    if (this.checkFoodCollision(foodPieces[i])) {
                        // if the ant just picked up some food, turn around and start heading back to the colony
                        this.flipDir();
                        break;
                    }

                    // steer the ant near the food if the ant is within its view range
                    this.steerToPos(foodPieces[i].position);
                }
            }
            if (!foodInRange) {
                // if the ant is near some food pheromones follow them, steer the direction towards the pheromone
                let bestFood = this.findStrongestPheromone(foodPheromones);

                // if there is a best food pheromone, steer towards it
                if (bestFood != undefined) {
                    this.steerToPos(bestFood.position);
                } else {
                    // randomly wander looking for food or pheromones
                    this.randomWander();
                }
            }
        } else { // if the ant does have the food, 
            // start heading back to the colony following the pheromones that originated at the colony
            // make the new food location at the front of the ant by adding the x and y components of the ant size and direction to the ant position
            this.updateFoodCarriedPosition();

            // leave to food pheromones(toHome == false) pheromones from the ant from the food back to the colony
            if (this.frame != 0 && this.frame % 60 == 0) {
                foodPheromones.push(new Pheromone(this.position.x, this.position.y, false, this.species));
            }

            // if the ant can see the colony
            let colonyInRange = false;

            // when the ant collides with the colony, remove the food object from the foodPieces list and this ant's foodCarried list
            let vrDist = this.getDistance(this.viewRangePosition, colonyPos);

            // see if the colony is within range
            if (vrDist < this.viewRange + colonySize) {
                // the ant can see the colony
                colonyInRange = true;

                // steer the ant to the colony
                this.steerToPos(colonyPos);

                // see if the ant collided with the colony while holding the food, if it does then drop the food and remove the food from the foodPieces list
                if (this.checkColonyCollision(foodPieces, colonyPos, colonySize)) {
                    // if the ant just came from a food source and hit the colony, it should turn around and head back to the food source
                    this.flipDir();

                    // food dropped off at colony
                    foodDropped += 1;
                }
            }

            // if the ant can't see the colony look for toHome pheromones to find its way back to the colony
            if (!colonyInRange) {
                // get the best home pheromone to steer to
                let bestHome = this.findWeakestPheromone(homePheromones);

                // if there is a best home pheromone, steer towards it
                if (bestHome != undefined) {
                    this.steerToPos(bestHome.position);
                } else {
                    // randomly wander looking for food or pheromones
                    this.randomWander();
                }
            }
        }
        // check if the ant collided with any walls, if it does then handle it appropriately
        this.handleWallCollision(walls);

        // the amount of food dropped off at the colony by the ant
        return foodDropped;
    }
    
    draw(ctx, showViewRange) {
        // draw the ant abdomen
        ctx.beginPath();
        if (this.species == "fire"){
            ctx.fillStyle = "red";
        }
        else if (this.species == "sugar") {
            ctx.fillStyle = "black";
        }
        
        ctx.arc(this.position.x - (this.size * 1.75 * Math.cos(this.dir)),  this.position.y - (this.size * 1.75 * Math.sin(this.dir)), this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // draw the ant head
        ctx.beginPath();if (this.species == "fire"){
            ctx.fillStyle = "red";
        }
        else if (this.species == "sugar") {
            ctx.fillStyle = "black";
        }
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // draw the ant eyes
        ctx.beginPath();
        if (this.species == "fire"){
            ctx.fillStyle = "black";
        }
        else if (this.species == "sugar") {
            ctx.fillStyle = "white";
        }
        ctx.arc(this.position.x + (3*this.size/5 * Math.cos(this.dir)), this.position.y - (3*this.size/5 * Math.sin(this.dir)), 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        if (this.species == "fire"){
            ctx.fillStyle = "black";
        }
        else if (this.species == "sugar") {
            ctx.fillStyle = "white";
        }
        ctx.arc(this.position.x - (3*this.size/5 * Math.cos(this.dir)), this.position.y + (3*this.size/5 * Math.sin(this.dir)), 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        
        // draw the viewRange for the ant
        if (showViewRange) {
            ctx.beginPath();
            ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
            ctx.arc(this.viewRangePosition.x, this.viewRangePosition.y, this.viewRange, 0, 2 * Math.PI);
            ctx.fill();
            ctx.closePath();
        }
    }
}