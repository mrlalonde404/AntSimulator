export default class Food {
    constructor(pos) {
        // the position of the food should have an x and y component 
        this._position = {
            x: pos.x,
            y: pos.y
        };
        this._size = 5;
    }

    get position() {
        return this._position;
    }

    get size() {
        return this._size;
    }

    // used by the ant to change the position of the food while it is being carried
    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set size(s) {
        this._size = s;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}