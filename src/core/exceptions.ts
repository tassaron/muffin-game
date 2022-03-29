/*
 * Custom exceptions
 * https://stackoverflow.com/a/41429145
*/

export class MissingHTMLElementError extends Error {
    constructor(id: string) {
        super(`Missing expected HTML Element on the webpage: "${id}"`);        
        Object.setPrototypeOf(this, MissingHTMLElementError.prototype);
    }
}

export class MissingTextureError extends Error {
    constructor(name: string) {
        super(`Missing texture for "${name}" even though the file supposedly loaded`);
        Object.setPrototypeOf(this, MissingTextureError.prototype);
    }
}