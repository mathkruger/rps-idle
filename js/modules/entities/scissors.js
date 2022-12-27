import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Paper } from "./paper.js";

export class Scissors extends Element {
    constructor(x, y) {
        super(x, y, new Sprite(0, 0, 32, 32, "scissors"));
        this.win = Paper;
    }
}