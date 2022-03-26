import * as PIXI from "pixi.js";
import IGame from "./interfaces/IGame";
import Entity from "./entities/Entity";
import AnimatedSprite from './entities/AnimatedSprite';
import TextureGrid from "./layouts/TextureGrid";
import TileSprite from "./entities/TileSprite";
import { MissingTextureError } from "./exceptions";

export const textures = [
    "explosion",
    "fuel",
    "pipes",
];

function getTexture(texture: PIXI.Texture | undefined, name: string) : PIXI.Texture {
    if (texture === undefined) {
        throw new MissingTextureError(name);
    }
    return texture;
}

export function after_preload(loader: PIXI.Loader, resources: PIXI.utils.Dict<PIXI.LoaderResource>, sprites: any) {
    // sprite
    sprites.fuel = (game: IGame) => new Entity(game, getTexture(resources.fuel.texture, "fuel"));

    // animated sprite
    sprites.explosion = (game: IGame) => new AnimatedSprite(game, getTexture(resources.explosion.texture, "explosion"), 32, 32, 5, 4);

    // tilemap
    sprites.pipe = (game: IGame) => new TileSprite(game, getTexture(resources.pipes.texture, "pipes"), new TextureGrid(4, 4, 72));
};