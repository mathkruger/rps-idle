export class Skill {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.quantity = 1;
    }

    action({
        constructor,
        screenElements,
        screenWidth,
        screenHeight,
        speed,
        atGameStart
    }) {  }
}