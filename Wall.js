export default class Wall {
    constructor (wx, wy) {
        // the position of the wall should have an x and y component 
        this._position = {
           x: wx,
           y: wy
        };
        
        // how big the wall rect should be
        this._width = 10;
        this._length = 10;
    }
    get position() {
        return this._position;
    }

    get width() {
        return this._wdith;
    }

    get length() {
        return this._length;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set width(w) {
        this._width = w;
    }

    set length(l) {
        this._length = l;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.rect(this.position.x, this.position.y, this.size, this.size);
        ctx.fill();
        ctx.closePath();
    }
}