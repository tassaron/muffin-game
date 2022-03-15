/*
*  Entrypoint to the application. Creates canvas and loads all assets before beginning the game loop
*/
import { Game } from "./game.js";


const PREFIX = "assets/";


/*
*  Create the canvas
*/
const app = new PIXI.Application({
    width: 800, height: 600, backgroundColor: "#bcbcf2", useContextAlpha: false, resolution: window.devicePixelRatio || 1,
});
function loadingText(app) {
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
    app.ticker.add((delta) => {
        if (skewText.rotation > 0) {
            skewText.rotation -= delta / 30;
            skewText.skew.x -= Math.log(delta) /30;
        } else {
            skewText.rotation += Math.log(delta) / 30;
            skewText.skew.x += delta / 30;
        }
    })
    return skewText;
}
app.stage.addChild(loadingText(app));
document.getElementById("game").appendChild(app.view);


/*
*  Preload assets
*/
const sprites = {};
const loader = PIXI.Loader.shared;
loader.add('explosion', PREFIX + "explosion.png")


loader.load((loader, resources) => {
    sprites.explosion = new PIXI.Sprite(resources.explosion.texture);
});


loader.onComplete.add(() => {
    const game = new Game(app, sprites);
    document.getElementById("pause_button").addEventListener('click', game.pauseGame, false);
});