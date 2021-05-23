export default class Wall {
    constructor (wx, wy, w, h) {
        // the position of the wall should have an x and y component 
        this._position = {
           x: wx,
           y: wy
        };
        
        // how big the wall rect should be
        this._width = w;
        this._height = h;
    }
    get position() {
        return this._position;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    set position(pos) {
        this._position.x = pos.x;
        this._position.y = pos.y;
    }

    set width(w) {
        this._width = w;
    }

    set height(h) {
        this._height = h;
    }

    draw(ctx){
        ctx.beginPath();
        ctx.fillStyle = "gray";
        ctx.rect(this.position.x, this.position.y, this.width, this.height);
        ctx.fill();
        ctx.closePath();
    }
}