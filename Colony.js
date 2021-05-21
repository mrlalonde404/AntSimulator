import Ant from './Ant.js';
export default class Colony {
    constructor(cx, cy, species, numAnts) {
        // the center x,y for where the colony should be drawn
        this._position = {
            x: cx,
            y: cy            
        };

        // this colony's species
        this._species = species;

        // the number of ants for this colony
        this._numAnts = numAnts;

        // the ants in this colony
        this._ants = [];

        // the pheromones for this colony
        this._toHomePheromones = [];
        this._toFoodPheromones = [];

        // how big the colony will be drawn
        this._size = 100;

        // how much food has been brought back to the colony
        this._foodCollected = 0;
    }

    get position() {
        return this._position;
    }

    get species() {
        return this._species;
    }

    get numAnts() {
        return this._numAnts;
    }

    get ants() {
        return this._ants;
    }

    get toHomePheromones() {
        return this._toHomePheromones;
    }

    get toFoodPheromones() {
        return this._toFoodPheromones;
    }

    get size() {
        return this._size;
    }

    get foodCollected() {
        return this._foodCollected;
    }

    set species(sp) {
        this._species = sp;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set numAnts(n) {
        this._numAnts = n;
    }

    set ants(a) {
        this._ants = a;
    }

    set pheromones(ps) {
        this._pheromones = ps;
    }

    set toHomePheromones(thp) {
        this._toHomePheromones = thp;
    }

    set toFoodPheromones(tfp) {
        this._toFoodPheromones = tfp;
    }

    set size(s) {
        this._size = s;
    }

    set foodCollected(fc) {
        this._foodCollected = fc;
    }

    makeColonyAnts(antSize) {
        // find the radian increment for the entire circle split up by the number of ants
        let dirIncr = (Math.PI * 2) / this.numAnts;
    
        // make all the ants with a direction to where they should all make a circle going outwards
        for (let i = 0; i < this.numAnts; i++){
            let dir = (i+1) * dirIncr;
            let ax = this.position.x + (this.size * Math.cos(dir));
            let ay = this.position.y + (this.size * Math.sin(dir));
            this.ants.push(new Ant(ax, ay, this.species, dir, antSize));
        }
    }

    update(delta, canvasSize, ctx, foodPieces, wrap) {
         // update the pheromones and then draw them
         for (let i = 0; i < this.toFoodPheromones.length; i++){
            this.toFoodPheromones[i].update(delta);
            this.toFoodPheromones[i].draw(ctx);
            if (this.toFoodPheromones[i].life < 0) {
                this.toFoodPheromones.splice(i, 1);
                i--;
            }
        }
        for (let i = 0; i < this.toHomePheromones.length; i++){
            this.toHomePheromones[i].update(delta);
            this.toHomePheromones[i].draw(ctx);
            if (this.toHomePheromones[i].life < 0) {
                this.toHomePheromones.splice(i, 1);
                i--;
            }
        }

        // update the ants and then draw them
        for (let i = 0; i < this.ants.length; i++){
            // make every ant wander, this updates the food pheromones, home pheromones, and the food pieces, no need to return since wander gets a copy of the objects refererences
            // increment the colony's food counter by the amount of food dropped off at the colony from the wandering ant
            this.foodCollected += this.ants[i].wander(this.toFoodPheromones, this.toHomePheromones, foodPieces, this.position, this.size);
            //console.log(this.toFoodPheromones.length, this.toHomePheromones.length, foodPieces.length);

            // update the ants, let them wrap around the borders, and draw them
            this.ants[i].update(delta);

            // decide whetehr to wrap the edges or 
            if (wrap) {
                this.ants[i].wrapEdges(canvasSize);
            } else {
                this.ants[i].reflectEdges(canvasSize);
            }
            this.ants[i].draw(ctx, true);
        }       
    }

    draw(ctx, numFoodPieces) {
        // draw the colony
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();

        ctx.font = "20px Georgia"; 
        ctx.fillStyle = "black"; 

        // draw the text for the amount of food in the world
        ctx.fillText("Food in world:", this.position.x - this.size + 30, this.position.y - 40);
        ctx.fillText(`${numFoodPieces}`, this.position.x - this.size + 30, this.position.y - 20);

        // draw the amount of food dropped off at the colony
        ctx.fillText("Food Collected:", this.position.x - this.size + 30, this.position.y + 10);
        ctx.fillText(`${this.foodCollected}`, this.position.x - this.size + 30, this.position.y + 30);
    }
}