import { Particle } from "./particle.js";

export class ParticleSystem {
    constructor(
        initialParticlesCount,
        minAngle,
        maxAngle,
        color = "random",
        minParticleLife = 3,
        maxParticleLife = 10,
        speedMultiplier = 1
    ) {
        this.initialParticlesCount = initialParticlesCount;
        this.minAngle = minAngle;
        this.maxAngle = maxAngle;
        this.color = color;
        this.minParticleLife = minParticleLife;
        this.maxParticleLife = maxParticleLife;
        this.speedMultiplier = speedMultiplier;

        this.particles = [];
    }

    generateParticles(position) {
        this.orgPos = position;

        for (let i = 0; i < this.initialParticlesCount; i++) {
            this.spawnParticle();
        }
    }

    render(cc) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            let particle = this.particles[i];
            particle.render(cc);

            if (particle.life < 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    spawnParticle() {
        const particleLife = this.getRandomNumber(this.minParticleLife, this.maxParticleLife);

        const particlePos = {
            x: this.orgPos.x,
            y: this.orgPos.y
        };

        const particleAngle = this.getRandomNumber(this.minAngle, this.maxAngle);
        const particleColor = Array.isArray(this.color) ?
            this.color[this.getRandomNumber(0, this.color.length)] :
            this.color;
        const particleSize = this.getRandomNumber(1, 3);
        const particleSpeed = this.getRandomNumber(1, 3) * this.speedMultiplier;
        const particle = new Particle(particleLife, particlePos, particleAngle, particleColor, particleSize, particleSpeed);
        
        this.particles.push(particle);
    }

    getRandomNumber(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
}