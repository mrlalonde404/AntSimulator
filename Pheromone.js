export default class Pheromone {
    constructor(pos, th){
        // the position of the pheromone should have an x and y component 
        this._position = {
            x: pos.x,
            y: pos.y
        };

        // how big the pheromone ball is
        this._size = 5;

        // if the pheromone is for going towards the home, the colony, true means yes it is, 
        // false means it is leaving toFood markers from the food back towards the colony
        this._toHome = th;

        // how long the pheromone lasts
        this._life = 50.0;
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
        if (this.toHome){
            ctx.fillStyle = `rgba(0, 0, 255, ${this.life / this.originalLife})`;
        } else {
            ctx.fillStyle = `rgba(255, 0, 255, ${this.life  / this.originalLife})`;
        }
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}