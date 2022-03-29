/*
 * Entrypoint to the application. Creates canvas and loads all assets before beginning the game loop
*/
import * as PIXI from "pixi.js";
import { addEventListeners, keyboard } from "./ui";
import { textures, after_preload } from "./setup";
import { Game } from "./game";
import { MissingHTMLElementError } from "./exceptions";


const PREFIX = "assets/";


/*
*  Create the canvas
*/
const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: 0xbcbcf2, useContextAlpha: false, resolution: 1,
});
function loadingText(app: PIXI.Application): (delta: number) => void {
    const skewStyle = new PIXI.TextStyle({
        fontFamily: 'var(--arcade-font)',
        dropShadow: true,
        dropShadowAlpha: 0.8,
        dropShadowAngle: 2.1,
        dropShadowBlur: 4,
        dropShadowColor: '0x111111',
        dropShadowDistance: 10,
        fill: ['#ffffff'],
        stroke: '#004620',
        fontSize: 72,
        fontWeight: 'lighter',
        lineJoin: 'round',
        strokeThickness: 12,
    });
    const skewText = new PIXI.Text('LOADING', skewStyle);
    skewText.skew.set(0.5, 0.0);
    skewText.anchor.set(0.5, 0.5);
    skewText.x = 400;
    skewText.y = 300;

    const tickText = (delta: number) => {
        if (skewText.rotation > 0) {
            skewText.rotation -= delta / 30;
            skewText.skew.x -= Math.log(delta) /30;
        } else {
            skewText.rotation += Math.log(delta) / 30;
            skewText.skew.x += delta / 30;
        }
    };
    app.stage.addChild(skewText);
    return tickText;
}
const textTicker = loadingText(app);
app.ticker.add(textTicker);


const gameDiv: HTMLElement | null = document.getElementById("game");
if (gameDiv === null) {
    throw new MissingHTMLElementError("game");
}
gameDiv.appendChild(app.view);


/*
*  Preload assets
*/
const sprites = {};
const loader = PIXI.Loader.shared;
for (let texture of textures) {
    loader.add(texture, PREFIX + texture + ".png");
};
loader
    .load((loader, resources) => after_preload(loader, resources, sprites))
    .onComplete.add(() => {
        app.ticker.remove(textTicker);
        const game = new Game(app, sprites, keyboard);
        const pauseButton: HTMLElement | null = document.getElementById("pause_button");
        pauseButton && pauseButton.addEventListener('click', () => game.pause(keyboard), false);
        addEventListeners(gameDiv);
    })
;