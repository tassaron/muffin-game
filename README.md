# Muffin Game Engine
A game engine for web-playable video games using [PixiJS](https://pixijs.io).

This is alpha software I'm making for [my online arcade](https://rainey.tech/arcade). The end-goal is to make something useable for other people too, but the design isn't finalized yet.

## Features
- A simple game loop - scenes get mounted, actors get ticked
- Scenes contain Actors or other Scenes inside of them
- Actors are [PixiJS Sprites](https://pixijs.download/release/docs/PIXI.Sprite.html) that can be moved, tinted, scaled, rotated, etc.
- Create Actors by extending base classes, using builder functions, and/or nesting them
- Control Actors with timers or temporary functions attached to the game loop (i.e., beforeTick)
- PixiJS has event-based mouse/touchscreen support with accessibility options like tabbing between elements

## Getting Started
- Fork the [muffin-game-js](https://github.com/tassaron/muffin-game-js) repo for a minimal JavaScript project using NPM.
- Check out [Pipe Puzzle](https://github.com/tassaron/pipe-puzzle) for a full working example project (it's a clone of Pipe Dream!)

## How to Create a Game 
### JavaScript, using as an NPM package
1. `npm install muffin-game`
1. `import { createGame, getTexture } from "muffin-game/core/setuptools"`
1. `createGame` has 3 positional arguments:
    1. an array of strings: filenames of all the PNGs that must be preloaded
    1. a callback function to receive resources (PNGs) and return an object of sprite factory functions
    1. a GameOptions object which uses default values for missing keys:
        1. `assetPrefix`: string with URL prefix for assets
            - _default_: `assets/`
        1. `gameClass`: the game class which gets instantiated
            - _default_: [Game](/src/core/game.ts)
        1. `postInit`: a function that takes the Game instance as an argument
            - _default_: connects HTML element with id=pause_button
1. The Game object has static properties:
    - `loadingScene`: This is the prevScene (previous scene) when the game starts or resets (after a game over, for example). It is never mounted, only unmounted.
    - `entryScene`: This is typically the MenuScene
    - `gameOverScene`: The default GameOverScene sets `game.state.functions.tick` to an empty function, uses a Pauser to stop Pixi.js's interactivity, and resets the game when clicked.
    - `pauseScene`: The default PauseScene is similar, but its tick function checks if the letter "P" is pressed, and it goes back to the prevScene when `game.state.flags.paused` is false.
1. To create a custom menu scene, try "`Game.entryScene = MyCustomMenuScene`" before calling createGame()
1. See [setup.js](https://github.com/tassaron/pipe-puzzle/blob/main/src/setup.js) from "Pipe Puzzle" for an example

### TypeScript, developing the engine itself
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

### How it works, slightly more in depth

#### Containers
-  Anything visible on-screen is a Pixi.js [Container](https://pixijs.download/dev/docs/PIXI.Container.html). A container is any drawing surface with children: the main "stage" of the game is a Container with the dimensions of the canvas.
-  The main Containers you will use are [Actors](/src/actors). These are subclasses of Pixi.js [Sprites](https://pixijs.download/dev/docs/PIXI.Sprite.html) but with extra functionality to make designing games easier.

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