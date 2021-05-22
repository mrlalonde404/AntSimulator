export default class Wall {
    constructor (wx, wy, s) {
        // the position of the wall should have an x and y component 
        this._position = {
           x: wx,
           y: wy
        };
        
        // how big the wall rect should be
        this._size = s;
    }
    get position() {
        return this._position;
    }

    get size() {
        return this._size;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set size(s) {
        this._size = s;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.rect(this.position.x, this.position.y, this.size, this.size);
        ctx.fill();
        ctx.closePath();
    }
}