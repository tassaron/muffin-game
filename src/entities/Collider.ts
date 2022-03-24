import IGame from "../interfaces/IGame";
import BaseEntity from "./BaseEntity";


export default class Collider extends BaseEntity {
    collisionWidth: number;
    collisionHeight: number;

    constructor(game: IGame, graphic: BaseEntity, w: number, h: number) {
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
