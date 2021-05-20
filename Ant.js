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
        
        // the fastest speed the ant should be allowed to move
        this._maxSpeed = 12;

        // this is the direction that the ant is facing
        this._dir = d;

        // the ant velocity should have an x and y component 
        this._velocity = {
            x: this._maxSpeed * Math.cos(this._dir),
            y: this._maxSpeed * Math.sin(this._dir)
        };

        // how big the ant is
        this._size = s;

        this._viewRange = 50;

        this._viewRangePosition = {
            x: this._position.x + (this._viewRange * Math.cos(this._dir)),
            y: this._position.y + (this._viewRange * Math.sin(this._dir))
        }

        // this should be the food item that is picked up from the food source and brought back to the colony 
        this._foodCarried = [];

        this._frame = 0;
    }

    get position() {
        return this._position;
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

    set species(sp) {
        return this._species = sp;
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

    // when the dir is changed, use this function to get the new x and y components from that new direction
    calculateSpeed() {
        this.velocity = {
            x: this.maxSpeed * Math.cos(this.dir),
            y: this.maxSpeed * Math.sin(this.dir)
        };
    }

    // change the direction by adding pi radians to the direction to turn completely around
    flipDir() {
        this.dir += Math.PI;
        this.calculateSpeed();
    }

    update(delta) {
        // the first frame there wont be a delta so skip it
        if (!delta) return;

        // otherwise, update the ant position by the ant velocity divided by the delta time
        this.position.x += this.velocity.x / delta;
        this.position.y += this.velocity.y / delta;

        // update the direction the ant is facing
        this.dir = Math.atan2(this.velocity.y, this.velocity.x);

        // update the speeds
        this.calculateSpeed();

        // update the view range position based on the updated
        this.viewRangePosition.x = this.position.x + (this.viewRange * Math.cos(this.dir));
        this.viewRangePosition.y = this.position.y + (this.viewRange * Math.sin(this.dir));

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

    findBestPheromone(pheromones) {
        // follow the pheromones back to either the colony or the food
        let closestPheromones = [];

        // get the closest pheromones that are in the view range of the ant
        for (let i = 0; i < pheromones.length; i++) {
            let vrDist = this.getDistance(this.viewRangePosition, pheromones[i]);
            if (vrDist < this.viewRange + pheromones[i].size) {
                 closestPheromones.push(pheromones[i]);
            }
        }

        // if some close pheromones were found
        if (closestPheromones.length > 0) {
            // get the pheromone in front of the ant that is closest and the strongest
            let strongest = 0;
            let strongestPheromone = undefined;
            for (let closest of closestPheromones) {
                if (closest.life > strongest) {
                    strongest = closest.life;
                    strongestPheromone = closest;
                } 
            }
            return strongestPheromone;
        }

        // no pheromones were found
        return undefined;
    }

    steerToPos(pos, walkAmount) {
        // if a pheromone was found then steer towards it by changing the direction and the x and y velocities
        if (pos != undefined) {
            // steer towards the pheromone by changing the direction to go towards it
            let dx = pos.x - this.position.x;
            let dy = pos.y - this.position.y;

            // the angle to the pheromone is the change in y over the change in x
            let gamma = Math.atan2(dy, dx);;
            let dTheta = (gamma - this.dir) * walkAmount;

            // change the direction by steering towards gamma by walk amount
            this.dir += dTheta;

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

                // if the ant just picked up some food, turn around and start heading back to the colony
                this.flipDir();

                // display that a collision happened between an ant and a piece of food, return the ant object
                console.log("ant food collision: ", this);
            }
        }
    }

    checkColonyCollision(foodPieces, colonyPos, colonySize) {
        // get the distance from the ant's position to the colnie's position
        let distanceToColony = this.getDistance(this.position, colonyPos);

        // see if the colony circle and the ant circle overlap
        if (distanceToColony <= (this.size + colonySize)) {
            // drop the food and remove it from the food pieces
            this.dropFood(this.foodCarried[0], foodPieces)
            
            // if the ant just came from a food source and hit the colony, it should turn around and head back to the food source
            this.flipDir();
        }
    }

    randomWander() {
        let randomWalkAmount = 0.03;
        // if there is no closest pheromones randomly walk
        let randomWalk =  (Math.random() <= 0.5 ? randomWalkAmount : -1 * randomWalkAmount); 
        this.dir += randomWalk;
        this.calculateSpeed();
    }

    // how the ant will wander around the screen looking for pheromones
    wander(foodPheromones, homePheromones, foodPieces, colonyPos, colonySize) {
        // the amount that the ant should wander either to food or towards pheromones
        let walkAmount = 0.33;

        // if the ant doesn't have food
        if (this.foodCarried.length === 0) { 
            // look for the food leaving toHome pheromones from the colony until it finds food
            if (this.frame != 0 && this.frame % 60 == 0) {
                homePheromones.push(new Pheromone(this.position, true));
            }

            // if the ant is near some food pheromones follow them, steer the direction towards the pheromone
            let bestFood = this.findBestPheromone(foodPheromones);

            if (bestFood != undefined) {
                // if there is a best food pheromone, steer towards it
                this.steerToPos(bestFood.position, walkAmount);
            } else {
                // randomly wander looking for food or pheromones
                this.randomWander();
            }

            // look at all the food pieces to see if the ant is near it
            for (let i = 0; i < foodPieces.length; i++) {
                // get the distance to see if the food piece is in the view range for the ant
                let vrDist = this.getDistance(this.viewRangePosition, foodPieces[i].position);

                // make sure that the ant is only carrying 1 piece of food
                if (this.foodCarried.length > 0) {
                    break;
                } else if (vrDist < this.viewRange + foodPieces[i].size && !foodPieces[i].pickedUp) {
                    // the ant is within range of the food, and that piece of food hasn't been picked up already
                    // steer the ant near the food if the ant is within its view range
                    this.steerToPos(foodPieces[i].position, walkAmount);

                    // check if the ant ran into the food after steering
                    this.checkFoodCollision(foodPieces[i]);
                }
            }
            
        } else { // if the ant does have the food, 
            // start heading back to the colony following the pheromones that originated at the colony
            // make the new food location at the front of the ant by adding the x and y components of the ant size and direction to the ant position
            this.updateFoodCarriedPosition();

            // leave to food pheromones(toHome == false) pheromones from the ant from the food back to the colony
            if (this.frame != 0 && this.frame % 60 == 0) {
                foodPheromones.push(new Pheromone(this.position, false));
            }

            // get the best home pheromone to steer to
            
            let bestHome = this.findBestPheromone(homePheromones);

            if (bestHome != undefined) {
                // if there is a best home pheromone, steer towards it
                this.steerToPos(bestHome.position, walkAmount);
            } else {
                // randomly wander looking for food or pheromones
                this.randomWander();
            }

            // when the ant collides with the colony, remove the food object from the foodPieces list and this ant's foodCarried list
            let vrDist = this.getDistance(this.viewRangePosition, colonyPos);

            // see if the colony is within range, steer the ant to it if is
            if (vrDist < this.viewRange + colonySize) {
                // steer towards the colony's position
                this.steerToPos(colonyPos, walkAmount);

                // see if the ant collided with the colony while holding the food, if it does then drop the food and remove the food from the foodPieces list
                this.checkColonyCollision(foodPieces, colonyPos, colonySize);
            }
        }
    }
    
    draw(ctx, showViewRange) {
        // draw the ant abdomen
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.position.x - (this.size * 1.75 * Math.cos(this.dir)),  this.position.y - (this.size * 1.75 * Math.sin(this.dir)), this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // draw the ant head
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        // draw the ant eyes
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.position.x + (3*this.size/5 * Math.cos(this.dir)), this.position.y - (3*this.size/5 * Math.sin(this.dir)), 3, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "black";
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