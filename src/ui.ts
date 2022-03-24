import IKeyboard from "./interfaces/IKeyboard";

class Keyboard implements IKeyboard {
    up = false;
    down = false;
    left = false;
    right = false;
    number = -1;
    p = false;

    _framesDisabled = 0.0;

    tick(delta: number) {
        if (this._framesDisabled == 0.0) return;
        this._framesDisabled -= delta;
        if (this._framesDisabled < 0) this._framesDisabled = 0.0;
    }

    disable(numFrames: number) {
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.number = -1;
        this.p = false;
        this._framesDisabled = numFrames;
    }
};

export const keyboard = new Keyboard();

export function addEventListeners(gameDiv: HTMLElement) {
    /* Connect keyboard events to document */
    document.addEventListener('contextmenu', function (e: MouseEvent) {
        if (e.target != null && gameDiv.contains(e.target as Node)) {
            e.preventDefault();
        }
    }, false);
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
}

function keyDownHandler(e: KeyboardEvent) {
    if (keyboard._framesDisabled !== 0.0) return;
    if (e.keyCode == 39) {
        keyboard.right = true;
    } else if (e.keyCode == 37) {
        keyboard.left = true;
    } else if (e.keyCode == 38) {
        keyboard.up = true;
        e.preventDefault();
    } else if (e.keyCode == 40) {
        keyboard.down = true;
        e.preventDefault();
    } else if (e.keyCode == 80) {
        keyboard.p = true;
    } else if (e.keyCode > 47 && e.keyCode < 58) {
        keyboard.number = e.keyCode - 48;
    }
}

function keyUpHandler(e: KeyboardEvent) {
    if (keyboard._framesDisabled !== 0.0) return;
    if (e.keyCode == 39) {
        keyboard.right = false;
    } else if (e.keyCode == 37) {
        keyboard.left = false;
    } else if (e.keyCode == 38) {
        keyboard.up = false;
    } else if (e.keyCode == 40) {
        keyboard.down = false;
    } else if (e.keyCode == 80) {
        keyboard.p = false;
    } else if (e.keyCode > 47 && e.keyCode < 58) {
        keyboard.number = -1;
    }
    e.preventDefault()
}