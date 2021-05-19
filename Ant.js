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
        this._maxSpeed = 10;

        // this is the direction that the ant is facing
        this._dir = d;

        // the ant velocity should have an x and y component 
        this._velocity = {
            x: this._maxSpeed * Math.cos(this._dir),
            y: this._maxSpeed * Math.sin(this._dir)
        };

        // how big the ant is
        this._size = s;

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

    get foodCarried() {  
        return this._foodCarried;
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

    set foodCarried(carried) {
        this._foodCarried = carried;
    }

    wrapEdges(canvasSize) {
        if (this._position.x + this._size > canvasSize.width){
            this._position.x = this._size;
        }
        if (this._position.x - this._size < 0){
            this._position.x = canvasSize.width - this._size;
        }
        if (this._position.y + this._size > canvasSize.height){
            this._position.y = this._size;
        }
        if (this._position.y - this._size > canvasSize.height){
            this._position.x = canvasSize.height - this._size;
        }
    }

    update(delta) {
        // the first frame there wont be a delta so skip it
        if (!delta) return;

        // otherwise, update the ant position by the ant velocity divided by the delta time
        this._position.x += this._velocity.x / delta;
        this._position.y += this._velocity.y / delta;

        // update the direction the ant is facing
        this.dir = Math.atan2(this._velocity.y, this._velocity.x);

        // increment the frame
        this._frame++;
    }

    // how the ant will wander around the screen looking for pheromones
    wander(pheromones, foodPieces, colony,Pos, colonySize) {
        if (this.foodCarried.length == 0) {
            // if the ant doesn't have food, look for it leaving toHome pheromones from the colony until it finds food
            if (this._frame != 0 && this._frame % 60 == 0) {
                pheromones.push(new Pheromone(this._position, true));
            }

            // if the ant is near some pheromones follow them, steer the direction towards the pheromone

            // if the ant collides with the food, pick it up
            
        } else {
            // if the ant does have the food, start heading back to the colony following the pheromones that originated at the colony
            // update the food location that the ant is carrying
            if (this.foodCarried.length > 0) {
                for (let i = 0; i < this.foodCarried.length; i++) {
                    // make the new food location at the front of the ant by adding the x and y components of the ant size and direction to the ant position
                    let foodLocation = {
                        x: this._position.x + (this._size * Math.cos(this._dir)),
                        y: this._position.y + (this._size * Math.sin(this._dir))
                    }
                    // set the food location to the location calculated above
                    this.foodCarried[i].position = foodLocation;
                }
            }
            // leave to food pheromones(toHome == false) pheromones from the ant from the food back to the colony
            if (this._frame != 0 && this._frame % 60 == 0) {
                pheromones.push(new Pheromone(this._position, false));
            }
            // follow the toHome pheromones back to the colony

            // when the ant collides with the colony, remove the food object from the foodPieces list and this ant's foodCarried list
        }
        return [pheromones, foodPieces];
    }
    
    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(this._position.x, this._position.y, this._size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}