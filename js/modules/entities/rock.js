import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Scissors } from "./scissors.js";

export class Rock extends Element {
    constructor(x, y, speed, width = 32, height = 32) {
        super(x, y, new Sprite(0, 0, width, height, "rock"), speed, ["#65647C", "#8B7E74", "#C7BCA1"]);
        this.win = Scissors;
    }
}