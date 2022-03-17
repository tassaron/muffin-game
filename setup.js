import { newSprite, newAnimatedSprite } from "./lib.js";

export const textures = [
    "explosion",
    "fuel",
    "grass",
];

export function after_preload(loader, resources, sprites) {
    // sprite
    sprites.fuel = newSprite(resources.fuel.texture);

    // animated sprite
    sprites.explosion = newAnimatedSprite(resources.explosion.texture, 32, 32, 6, 10);

    // tileset
    sprites.grass = newSprite(resources.grass.texture);
};