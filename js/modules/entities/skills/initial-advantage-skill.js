import { Utils } from "../../utils.js";
import { Skill } from "../_base/skill.js";

export class InitialAdvantageSkill extends Skill {
    constructor() {
        super(
            "Initial Advantage",
            "Starts the game with 10 more of the chosen element on the field."
        );
    }

    action({
        constructor,
        screenElements,
        screenWidth,
        screenHeight,
        speed,
        atGameStart
    }) {
        if (atGameStart) {
            for (let i = 0; i < 10; i++) {
                const obj = Utils.getRandomElement(constructor, screenWidth, screenHeight);
                obj.speed = speed;
                screenElements.push(obj);
            }
        }
    }
}