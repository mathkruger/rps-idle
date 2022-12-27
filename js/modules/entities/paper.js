import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Rock } from "./rock.js";

export class Paper extends Element {
    constructor(x, y) {
        super(x, y, new Sprite(0, 0, 32, 32, "paper"));
        this.win = Rock;
    }
}