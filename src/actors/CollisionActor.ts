import IActor from "../interfaces/IActor";
import IGame from "../interfaces/IGame";
import Actor from "./Actor";
import ICollisionActor from "../interfaces/ICollisionActor";


export default class CollisionActor extends Actor implements ICollisionActor {
    collisionWidth: number;
    collisionHeight: number;
    graphic: IActor;

    constructor(game: IGame, graphic: IActor, w: number, h: number) {
        super(game);
        this.collisionWidth = w;
        this.collisionHeight = h;
        this.graphic = graphic;
        this.addChild(graphic);
        graphic.x = 0;
        graphic.y = 0;
    }

    collides(other: ICollisionActor) {
        return (
            this.x + this.collisionWidth > other.x &&
            this.x < other.x + other.collisionWidth &&
            other.y + other.collisionHeight > this.y &&
            other.y < this.y + this.collisionHeight
        );
    }

    //tick(delta: number) {}
}
