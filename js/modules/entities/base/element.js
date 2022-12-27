import { Entity } from "./entity.js";

export class Element extends Entity {
    constructor(x, y, sprite) {
        super(x, y, 32, 32, null, 30, "sprite", sprite, true);
        this.win = null;

        const possibleDelta = [2, -2, 1, -1, 3, -3, 4, -4];

        this.dx = possibleDelta[possibleDelta.length * Math.random() | 0];
        this.dy = possibleDelta[possibleDelta.length * Math.random() | 0];
    }

    update(canvas) {
        const possibleX = this.x + this.dx;
        const possibleY = this.y + this.dy;

        if(possibleX > canvas.width - this.width || possibleX < 0) {
            this.dx = -this.dx;
        }
        
        if(possibleY > canvas.height - this.height || possibleY < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;
    }

    checkCollision(elements) {
        const collidingObject = elements.find(el => {
            return el !== this && el.isSolid &&
                this.x < (el.x + el.width) &&
                this.x + this.width > el.x &&
                this.y < (el.y + el.height) &&
                this.y + this.height > el.y;
        });

        if (collidingObject) {
            const result = this.checkWin(collidingObject);

            if (result === true) {
                const index = elements.findIndex(x => x == collidingObject);
                return {
                    index,
                    replace: this.constructor
                };
            }

            return null;
        }
    }

    checkWin(collidingObject) {
        if (collidingObject instanceof this.win) {
            return true;
        }

        return false;
    }
}