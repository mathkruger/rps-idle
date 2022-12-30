import { Skill } from "../base/skill.js";

export class ShrinkSkill extends Skill {
    constructor() {
        super(
            "shrink",
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