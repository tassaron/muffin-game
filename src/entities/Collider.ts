import IGame from "../interfaces/IGame";
import Entity from "./Entity";


export default class Collider extends Entity {
    collisionWidth: number;
    collisionHeight: number;

    constructor(game: IGame, graphic: Entity, w: number, h: number) {
        super(game);
        this.collisionWidth = w;
        this.collisionHeight = h;
        this.addChild(graphic);
        graphic.x = 0;
        graphic.y = 0;
    }

    collides(other: Collider) {
        return (
            this.x + this.collisionWidth > other.x &&
            this.x < other.x + other.collisionWidth &&
            other.y + other.collisionHeight > this.y &&
            other.y < this.y + this.collisionHeight
        );
    }

    //tick(delta: number) {}
}
