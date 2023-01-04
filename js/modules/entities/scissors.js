import { Element } from "./base/element.js";
import { Sprite } from "./base/sprite.js";
import { Paper } from "./paper.js";

export class Scissors extends Element {
    constructor(x, y, speed, width = 32, height = 32) {
        super(x, y, new Sprite(0, 0, width, height, "scissors"), speed, ["#3C6255", "#3C6255", "#A6BB8D"]);
        this.win = Paper;
    }
}