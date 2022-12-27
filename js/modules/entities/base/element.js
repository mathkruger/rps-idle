import { Entity } from "./entity.js";

export class Element extends Entity {
    constructor(x, y, sprite) {
        super(x, y, 64, 64, null, 30, "sprite", sprite, true);
        this.win = null;
    }
}