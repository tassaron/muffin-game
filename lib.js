export const newContainer = (parent) => {
    const container = new PIXI.Container();
    parent.addChild(container);
    return container;
};