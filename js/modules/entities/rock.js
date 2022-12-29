import { Element } from "./_base/element.js";
import { Sprite } from "./_base/sprite.js";
import { Scissors } from "./scissors.js";

export class Rock extends Element {
    constructor(x, y, speed, width = 32, height = 32) {
        super(x, y, new Sprite(0, 0, width, height, "rock"), speed);
        this.win = Scissors;
    }
}