import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Rock } from "./rock.js";

export class Paper extends Element {
    constructor(x, y, speed) {
        super(x, y, new Sprite(0, 0, 32, 32, "paper"), speed);
        this.win = Rock;
    }
}