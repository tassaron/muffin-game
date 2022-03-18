/*
 * Custom exceptions
 * https://stackoverflow.com/a/41429145
*/

export default class MissingHTMLElementError extends Error {
    constructor(id: string) {
        super(`Missing expected HTML Element on the webpage: "${id}"`);        
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, MissingHTMLElementError.prototype);
    }
}