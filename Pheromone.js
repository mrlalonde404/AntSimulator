export default class Pheromone {
    constructor(pos, th){
        // the position of the pheromone should have an x and y component 
        this._position = {
            x: pos.x,
            y: pos.y
        };
        this._size = 3;

        this._toHome = th;

        // how long the pheromone lasts
        this._life = 210.0;
    }

    get toHome()  {
        return this._toHome;
    }

    get life() {
        return this._life;
    }

    set toHome(th) {
        this._toHome = th;
    }

    set life(l) {
        this._life = l;
    }

    // keep removing a fraction of the life as the delta continues
    update(delta) {
        this._life -= (1/delta);
    }
    
    draw(ctx) {
        ctx.beginPath();
        if (this._toHome){
            ctx.fillStyle = "blue";
        } else {
            ctx.fillStyle = "purple";
        }
        ctx.arc(this._position.x, this._position.y, this._size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}