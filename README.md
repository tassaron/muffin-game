# Muffin Game Template
My game template (sort of an engine) for an HTML5 game using [PixiJS](https://pixijs.io). Evolved from what I learned making the [canvas-game](https://github.com/tassaron/canvas-game) template. This repo has some code for an example project to act as a starting point.

## [Click to play the Example Project](https://rainey.tech/static/muffin-game/)

## How to Create a Game
1. `npm install` to get the dependencies
1. All source code goes in `/src`
1. Load assets by editing `setup.ts`
1. Creates scenes inside `/scenes`

### How it works 
-  The "loading" text is drawn by `setup.ts` so it happens as soon as possible
-  Game  object is instantiated when pre-loading assets is complete.
-  Game starts by unmounting the `LoadingScene` (which removes everything from the stage blindly)
-  Game then mounts the `MenuScene` -- customize this scene for your game.

### Scenes
-  A game is broken up into [Scenes](/src/scenes).
-  Scenes may create [Actors](/src/actors) when instantiated and store them in the scene's `actors` property.
-  Scenes 'mount' (add their actors to the stage) when changed to using `game.changeScene()`
    -  unless the scene is already mounted! (the `mounted` property is not null)
-  Scenes may be 'unmounted' any time to remove all their actors from the stage.
-  The stage is a Pixi.JS Container which may contain actors or other containers.

### General tips
-  Use `game.startTimer(func, frames)` to time a function to trigger after a certain number of frames. This method returns the index of the timer created, so you can stop the timer early by using `game.stopTimer(index)`
-  The current `tick` function which occurs on every game tick is stored in `game.state.functions.tick` so that you can customize the gameplay loop at a higher level if needed.
- Score-sending functionality can be adapted using functions `send_score` and `hide_send_score_button`. See `compat.rainey_arcade.js` for an example of how I'm doing this with [Rainey Arcade](https://rainey.tech)

### Grids
-  A Grid is any class that owns an array of arrays with helper methods for managing it
-  The `GridScene` is a type of Scene which implements the grid interface for its actors (it has an array of arrays of actors)
-  The `GridRectangle` is part of a `TileActor` used to store a grid of textures (it has an array of arrays of rectangular regions)

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