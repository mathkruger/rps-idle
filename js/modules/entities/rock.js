import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Scissors } from "./scissors.js";

export class Rock extends Element {
    constructor(x, y) {
        super(x, y, new Sprite(0, 0, 32, 32, "rock"));
        this.win = Scissors;
    }
}