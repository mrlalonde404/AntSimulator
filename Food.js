export default class Food {
    constructor(fx, fy) {
        // the position of the food should have an x and y component 
        this._position = {
            x: fx,
            y: fy
        };

        //size of the piece of food
        this._size = 5;

        // if this piece of food has been picked up already, then another ant can't pick up the food that is already being carried
        this._pickedUp = false;
    }

    get position() {
        return this._position;
    }

    get size() {
        return this._size;
    }

    get pickedUp() {
        return this._pickedUp;
    }

    // used by the ant to change the position of the food while it is being carried
    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set size(s) {
        this._size = s;
    }

    set pickedUp(pu) {
        this._pickedUp = pu;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = "green";
        ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }
}