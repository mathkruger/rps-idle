import { Element } from "./base/element.js";
import { Sprite } from "../gfx/sprite.js";

export class Paper extends Element {
    constructor(x, y) {
        super(x, y, new Sprite(0, 0, 64, 64, "paper"));
        this.win = "rock";
    }
}