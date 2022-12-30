import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Rock } from "./rock.js";

export class Paper extends Element {
    constructor(x, y, speed, width = 32, height = 32) {
        super(x, y, new Sprite(0, 0, width, height, "paper"), speed);
        this.win = Rock;
    }
}