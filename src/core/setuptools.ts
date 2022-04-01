/*
 * Entrypoint to the application.
 * Exports a function `createGame` which loads all assets and begins the game loop.
 * See `example.ts` for an example of HOW to call this function.
*/
import * as PIXI from "pixi.js";
import { addEventListeners, keyboard } from "./ui";
import Game from "./game";
import { MissingHTMLElementError, MissingTextureError } from "./exceptions";
import IGame from "../interfaces/IGame";
import IActor from "../interfaces/IActor";


export function connectHTMLButton(func: () => void, elem: string) {
    const pauseButton: HTMLElement | null = document.getElementById(elem);
    pauseButton && pauseButton.addEventListener('click', func, false);
}


export class GameOptions {
    assetPrefix? = "assets/";
    gameClass? = Game;
    postInit?: (game: IGame) => void = (game: IGame) => {
        connectHTMLButton(
            () => game.pause(keyboard),
            "pause_button"
        );
    }
}


export const DefaultGameOptions = new GameOptions();


export function getTexture(texture: PIXI.Texture | undefined, name: string) : PIXI.Texture {
    if (texture === undefined) {
        throw new MissingTextureError(name);
    }
    return texture;
}


export function createGame(
        textures: string[],
        afterPreload: (loader: PIXI.Loader, resources: PIXI.utils.Dict<PIXI.LoaderResource>, sprites: {[key: string]: (game: IGame) => IActor}) => void,
        options = DefaultGameOptions,
        )
    {
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
    if (!options.assetPrefix) options.assetPrefix = DefaultGameOptions.assetPrefix;
    const sprites = {};
    const loader = PIXI.Loader.shared;
    for (let texture of textures) {
        loader.add(texture, options.assetPrefix + texture + ".png");
    };
    loader
        .load((loader, resources) => afterPreload(loader, resources, sprites))
        .onComplete.add(() => {
            app.ticker.remove(textTicker);

            if (!options.gameClass) options.gameClass = DefaultGameOptions.gameClass;
            const game = new options.gameClass!(app, sprites, keyboard);
            addEventListeners(gameDiv);

            if (!options.postInit) options.postInit = DefaultGameOptions.postInit;
            options.postInit!(game);
        })
    ;
}