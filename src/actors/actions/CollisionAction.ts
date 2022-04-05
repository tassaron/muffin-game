import IActorAction from "../../interfaces/IActorAction";
import IActor from "../../interfaces/IActor";


export default class CollisionAction implements IActorAction {
    actor: IActor;

    constructor(actor: IActor) {
        this.actor = actor;
    }

    collides(other: CollisionAction) {
        return (
            this.actor.x + this.actor.width > other.actor.x &&
            this.actor.x < other.actor.x + other.actor.width &&
            other.actor.y + other.actor.height > this.actor.y &&
            other.actor.y < this.actor.y + this.actor.height
        );
    }
}
