# Muffin Game Template
My game template (sort of an engine) for an HTML5 game using [PixiJS](https://pixijs.io). Evolved from what I learned making the [canvas-game](https://github.com/tassaron/canvas-game) template. This repo has some code for an example project to act as a starting point.

## [Click to play the Example Project](https://rainey.tech/static/muffin-game/)

## How to Create a Game (using as an NPM package)
1. `npm install muffin-game`
1. `import { createGame, getTexture } from "muffin-game/core/setuptools"`
1. `createGame` has 4 positional arguments:
  1. an array of strings: filenames of all the PNGs that must be preloaded
  1. a callback function to receive resources (PNGs) and return an object of sprite factory functions: see [`examplePreload` in `setup.ts`](/src/examples/setup.ts) for an example
  1. the classname of the first Scene
  1. (optional) a string with URL prefix for assets, defaults to `assets/`

## How to Create a Game (using this git repo as template)
1. `npm install` to get the dependencies
1. All source code goes in `/src`
1. Load assets by copy-pasting and/or editing `examples/setup.ts`
1. Creates scenes by subclassing/editing things inside `/scenes`
1. Commands:
    - Development build: `npm run dev`
    - Production build: `npm run build`

### Integration on a website
- Look at `index.html` for an example of how to embed the game in a webpage
  - Basically you need `<script src="bundle.js">` and a `<div id="game">` somewhere
  - `/assets` must be accessible on the web
-  Score-sending functionality can be adapted using functions `send_score` and `hide_send_score_button`. See `compat.rainey_arcade.js` for an example of how I'm doing this with [Rainey Arcade](https://rainey.tech)

### How it works

#### Containers
-  Anything visible on-screen is a Pixi.js [Container](https://pixijs.download/dev/docs/PIXI.Container.html). A container is any drawing surface with children: the main "stage" of the game is a Container with the dimensions of the canvas.
-  The main Containers you will use in this template are [Actors](/src/actors). These are subclasses of Pixi.js [Sprites](https://pixijs.download/dev/docs/PIXI.Sprite.html) but with extra functionality to make designing games easier.

#### Scenes
-  [Scenes](/src/scenes) are the main "rooms" or "levels" of a game. Scenes receive events from the game, such as `tick`, and relay these events to their Actors. They can be used to group related Actors together so they can be handled collectively.
-  Scenes may **mount** or **unmount** a Container to add or remove their Actors from it. Scenes can only mount 1 Container at a time.

#### Game Object
-  The Game object has a current `scene` and a previous Scene `prevScene`. Use the `changeScene()` method to change the current Scene properly.
-  Game object is instantiated when pre-loading assets is complete.
-  Use `game.startTimer(func, frames)` to time a function to trigger after a certain number of frames. This method returns the index of the timer created, so you can stop the timer early by using `game.stopTimer(index)`
-  The current `tick` function which occurs on every game tick is stored in `game.state.functions.tick` so that you can customize the gameplay loop at a higher level if needed.

#### Setup
-  The "loading" text is drawn by `setup.ts` so it happens as soon as possible
-  Game starts with `LoadingScene` as the `prevScene`, asking it to unmount the stage (which removes the loading text and anything else on the stage blindly)
-  Game then mounts the `MenuScene` -- customize this scene for your game.

#### Grids
-  A Grid is any class that owns an array of arrays with helper methods for managing it
-  The `GridScene` is a type of Scene which implements the grid interface for its actors (it has an array of arrays of actors)
-  The `GridRectangle` is part of a `TileActor` used to store a grid of textures (it has an array of arrays of rectangular regions)

## Credits
See [assets/README.md](assets/README.md) for graphics attribution