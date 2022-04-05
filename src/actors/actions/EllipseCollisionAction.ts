import IActorAction from "../../interfaces/IActorAction";
import IActor from "../../interfaces/IActor";


export default class EllipseCollisionAction implements IActorAction {
    actor: IActor;
    squareRadius: number;
    overlap = 0;

    constructor(actor: IActor) {
        this.actor = actor;
        this.squareRadius = Math.pow((actor.width / 3) * 2, 2);
    }

    collides(other: EllipseCollisionAction) {
        this.overlap = (Math.pow(other.actor.x - this.actor.x, 2) + Math.pow(other.actor.y - this.actor.y, 2)) - this.squareRadius
        return (
            this.overlap < 0
        );
    }
}
