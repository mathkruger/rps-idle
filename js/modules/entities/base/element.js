import { Entity } from "./entity.js";
import { ParticleSystem } from "../../gfx/particles/particle-system.js";

export class Element extends Entity {
    constructor(x, y, sprite, speed = 1, color = "random") {
        super(x, y, 32, 32, null, speed, "sprite", sprite, true);

        const possibleDelta = [2, -2, 3, -3, 4, -4];
        this.dx = possibleDelta[possibleDelta.length * Math.random() | 0] * this.speed;
        this.dy = possibleDelta[possibleDelta.length * Math.random() | 0] * this.speed;
        
        this.win = null;
        this.life = 1;
        this.gotHit = false;
        this.color = color;

        this.particleSystem = new ParticleSystem(1, 0, 45, this.color, 1, 4, this.speed);
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

        this.particleSystem.generateParticles({
            x: this.x + (this.width / 2),
            y: this.y + (this.height / 2)
        });
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
            collidingObject.life -= 1;
            collidingObject.gotHit = true;

            if (collidingObject.life <= 0) {
                return true;
            }

            return false;
        }

        return false;
    }
}