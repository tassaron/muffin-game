import IActorAction from "../../interfaces/IActorAction";
import IActor from "../../interfaces/IActor";
import IKeyboard from "../../interfaces/IKeyboard";


export default class WiggleAction implements IActorAction {
    actor: IActor;
    _wiggle = 0;
    direction = 0;
    targetAngle = 3;

    constructor(actor: IActor, targetAngle = 3) {
        this.actor = actor;
        this.targetAngle = targetAngle;
    }

    tick(delta: number, keyboard: IKeyboard) {
        if (this.wiggle == 0 && this.direction == 2) return;
        switch (this.direction) {
            case 0:
                // halfway right
                this.wiggle = Math.min(this.wiggle + delta, this.targetAngle);
                if (this.wiggle == this.targetAngle) this.direction++;
                break;
            case 1:
                // left
                this.wiggle = Math.max(this.wiggle - delta, this.targetAngle * -1);
                if (this.wiggle == this.targetAngle * -1) this.direction++;
                break;
            case 2:
                // halfway right again
                this.wiggle = Math.min(this.wiggle + delta, 0);
        }
    }

    get wiggle() {
        return this._wiggle;
    }

    set wiggle(value) {
        this._wiggle = value;
        this.actor.angle = value < 0 ? (360 + value) : value;
    }
}
