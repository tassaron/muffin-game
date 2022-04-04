import IActor from "./IActor";
import IGame from "./IGame";
import IKeyboard from "./IKeyboard";


export default interface IActorAction {
    game: IGame,
    actor: IActor,
    tick(delta: number, keyboard: IKeyboard): void,
}
