import { Skill } from "../_base/skill.js";

export class SecondChange extends Skill {
    constructor() {
        super(
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