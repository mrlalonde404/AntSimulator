export default class Pheromone {
    constructor(px, py, th, sp){
        // the position of the pheromone should have an x and y component 
        this._position = {
            x: px,
            y: py
        };

        // how big the pheromone ball is
        this._size = 5;

        // if the pheromone is for going towards the home, the colony, true means yes it is, 
        // false means it is leaving toFood markers from the food back towards the colony
        this._toHome = th;

        // what species the pheromone came from
        this._species = sp;

        // how long the pheromone lasts
        this._life = 60.0;
        this._originalLife = this._life;
    }

    get position() {
        return this._position;
    }

    get size() {
        return this._size;
    }

    get toHome()  {
        return this._toHome;
    }

    get species() {
        return this._species;
    }

    get life() {
        return this._life;
    }

    get originalLife() {
        return this._originalLife;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set size(s) {
        this._size = s;
    }

    set toHome(h) {
        this._toHome = h;
    }

    set species(sp) {
        this._species = sp;
    }

    set life(l) {
        this._life = l;
    }

    set originalLife(ol) {
        this._originalLife = ol;
    }

    // keep removing a fraction of the life as the delta continues
    update(delta) {
        this.life -= (1/delta);
    }
    
    draw(ctx) {
        ctx.beginPath();
        // alpha effect shows the intensity of the life left in each pheromone, the lighter they are the weaker the intensity
        if (this.species == "sugar") {
            if (this.toHome){
                // yellow toHome pheromones for sugar ants
                ctx.fillStyle = `rgba(255, 255, 0, ${this.life  / this.originalLife})`;
            } else {
                // black toFood pheromones for sugar ants
                ctx.fillStyle = `rgba(0, 0, 0, ${this.life / this.originalLife})`;
            }  
        } else if (this.species == "fire") {
            if (this.toHome){
                // blue toHome pheromones for fire ants
                ctx.fillStyle = `rgba(0, 0, 255, ${this.life / this.originalLife})`;
            } else {
                // red toFood pheromones for fire ants
                ctx.fillStyle = `rgba(255, 0, 0, ${this.life  / this.originalLife})`;
            }
        }
        
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}