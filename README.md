# Muffin Game Engine
My simple game engine/template for an HTML5 game using [PixiJS](https://pixijs.io). Evolved from what I learned making the [canvas-game](https://github.com/tassaron/canvas-game) template.

## How to Create a Game
1. `npm install` to get the dependencies
1. All source code goes in `/src`
1. Load assets by editing `setup.ts`
1. Creates scenes inside `/scenes`
1. All games require a `MenuScene` such as `scenes/MenuScene.ts`

### Options
- Most games have a `PauseScene` and `GameOverScene`. If you don't want one or both, then edit `game.ts` to remove them from the game loop.
- Game expects an HTML element with id of `pause_button` on the page for triggering the `PauseScene` scene
- Score-sending functionality can be adapted using functions `send_score` and `hide_send_score_button`. See `compat.rainey_arcade.js` for an example of how I'm doing this with [Rainey Arcade](https://rainey.tech)

## Building
### Development
- `npm run dev`

### Production
- `npm run build`
- Look at `index.html` for an example of how to embed the game in a webpage
  - Basically you need `<script src="bundle.js">` and a `<div id="game">` somewhere
  - `/assets` must be accessible on the web

## Credits
See [assets/README.md](assets/README.md) for graphics attribution