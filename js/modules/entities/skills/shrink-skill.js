import { Skill } from "../_base/skill.js";

export class ShrinkSkill extends Skill {
    constructor() {
        super(
            "Shrink",
            "The element you select is smaller."
        );
    }

    action({ constructor, screenElements }) {
        screenElements.forEach(element => {
            if (element instanceof constructor) {
                element.width = 10;
                element.height = 10;
            }
        });
    }
}