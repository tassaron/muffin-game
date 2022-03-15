//import { WorldScene } from "./world.js";

export class MenuScene {
    constructor(game) {
        this.explosion = game.sprites.explosion;
        this.game = game;
        game.app.stage.addChild(this.explosion);
    }

    update(delta, keyboard, mouse) {
    }
}
