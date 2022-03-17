//import { WorldScene } from "./world.js";

export class MenuScene {
    constructor(game) {
        this.explosion = game.sprites.explosion;
        this.game = game;
        game.containers.root.addChild(this.explosion);
    }

    update(delta, keyboard, mouse) {
    }
}
