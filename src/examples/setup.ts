
import * as PIXI from "pixi.js";
import IGame from "../interfaces/IGame";
import Actor from "../actors/Actor";
import AnimatedActor from '../actors/AnimatedActor';
import TileActor from "../actors/TileActor";
import { createGame, getTexture } from "../core/setuptools";
import MenuScene, { ExampleSceneList } from "../scenes/MenuScene";


const textures = [
    "explosion",
    "fuel",
    "pipes",
];


function afterPreload(loader: PIXI.Loader, resources: PIXI.utils.Dict<PIXI.LoaderResource>, sprites: any) {
    // sprite
    sprites.fuel = (game: IGame) => new Actor(game, getTexture(resources.fuel.texture, "fuel"));

    // animated sprite
    sprites.explosion = (game: IGame) => new AnimatedActor(game, getTexture(resources.explosion.texture, "explosion"), 32, 32, 5, 4);

    // tilemap
    sprites.pipe = (game: IGame) => new TileActor(game, getTexture(resources.pipes.texture, "pipes"), 4, 4, 73);
};

createGame(textures, afterPreload, MenuScene, ExampleSceneList);