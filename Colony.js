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
        this._pheromones = [];

        // how big the colony will be drawn
        this._size = 40;
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

    get pheromones() {
        return this._pheromones;
    }

    get size() {
        return this._size;
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

    set size(s) {
        this._size = s;
    }

    makeColonyAnts() {
        // find the radian increment for the entire circle split up by the number of ants
        let dir_incr = (Math.PI * 2) / this._numAnts;

        // size for the ants
        let antSize = 8;
    
        // make all the ants with a direction to where they should all make a cicel going outwards
        for (let i = 0; i < this._numAnts; i++){
            let dir = (i+1) * dir_incr;
            let ax = this._position.x + (this._size * Math.cos(dir));
            let ay = this._position.y + (this._size * Math.sin(dir));
            this._ants.push(new Ant(ax, ay, this._species, dir, antSize));
        }
    }

    update(delta, canvas_size, ctx, foodPieces) {
        // update the ants and then draw them
        for (let i = 0; i < this._ants.length; i++){
            let arr = this._ants[i].wander(this._pheromones, this._position, this._size, foodPieces);
            this._pheromones = arr[0];
            foodPieces = arr[1];
            this._ants[i].update(delta);
            this._ants[i].wrapEdges(canvas_size);
            this._ants[i].draw(ctx);
        }

        // update the pheromones and then draw them
        for (let i = 0; i < this._pheromones.length; i++){
            this._pheromones[i].update(delta);
            this._pheromones[i].draw(ctx);
            if (this._pheromones[i].life < 0) {
                this._pheromones.splice(i, 1);
                i--;
            }
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "blue";
        ctx.arc(this._position.x, this._position.y, this._size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}