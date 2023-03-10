import { Skill } from "../base/skill.js";

export class SecondChanceSkill extends Skill {
    constructor() {
        super(
            "second-chance",
            "Second Chance",
            "The element you select have 2 lives."
        );
    }

    action({ constructor, screenElements }) {
        screenElements.forEach(element => {
            if (element instanceof constructor) {
                if (element.gotHit == false) {
                    element.life = 2;
                }
            }
        });
    }
}