import IActor from "./IActor";


export default interface ICollisionActor extends IActor {
    collisionWidth: number;
    collisionHeight: number;
    collides(other: ICollisionActor): boolean;
}