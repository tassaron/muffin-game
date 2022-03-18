import * as PIXI from "pixi.js";
import { newSprite, newAnimatedSprite } from "./lib";
import { MissingTextureError } from "./exceptions";

export const textures = [
    "explosion",
    "fuel",
    "grass",
];

function getTexture(texture: PIXI.Texture | undefined, name: string) : PIXI.Texture {
    if (texture === undefined) {
        throw new MissingTextureError(name);
    }
    return texture;
}

export function after_preload(loader: PIXI.Loader, resources: PIXI.utils.Dict<PIXI.LoaderResource>, sprites: any) {
    // sprite
    sprites.fuel = newSprite(getTexture(resources.fuel.texture, "fuel"));

    // animated sprite
    sprites.explosion = newAnimatedSprite(getTexture(resources.explosion.texture, "explosion"), 32, 32, 5, 10);

    // tileset [WIP]
    //sprites.grass = newTileset(resources.grass.texture);
};