import { Renderer } from "./gfx/renderer.js";
import { Rock } from "./entities/rock.js";
import { Paper } from "./entities/paper.js";
import { Scissors } from "./entities/scissors.js";
import { Utils } from "./utils.js";
import { Storage } from "./data/storage.js";

export class Game {
    constructor(canvas, ui) {
        this.fps = 60;
        this.width = canvas.width;
        this.height = canvas.height;
        this.lastTime = null;
        this.requiredElapsed = 1000 / this.fps;
        this.canvas = canvas;
        this.ui = ui;
        this.elements = [];
        this.renderer = new Renderer(this.canvas, this.elements);
        this.gameFinished = false;

        this.availableElements = [
            {
                name: "rock",
                constructor: Rock
            },
            {
                name: "paper",
                constructor: Paper
            },
            {
                name: "scissors",
                constructor: Scissors
            }
        ];
    }

    create() {
        this.generateElements();
    }

    loop(now) {
        this.applySkillsEffect(false);

        requestAnimationFrame((now) => {
            this.loop(now);
        });
        
        if(!this.lastTime){
            this.lastTime = now;
        }

        const elapsed = this.lastTime + now;
        if(elapsed > this.requiredElapsed){
            this.update();
            this.lastTime = now;
        }
    }

    update() {
        if (this.gameFinished == false) {
            const indexesToRemove = [];
    
            this.elements.forEach(el => {
                el.update(this.canvas);
                indexesToRemove.push(el.checkCollision(this.elements));
            });
    
            indexesToRemove.forEach(i => {
                if (i != null) {
                    const element = this.elements[i.index];
                    const sub = new i.replace(element.x, element.y, element.speed);
                    this.elements[i.index] = sub;
                }
            });

            this.updateResults();

            if (this.elements.every(x => x.win == this.elements[0].win)) {
                this.gameFinished = true;

                const bigSymbol = new this.elements[0].constructor(0, 0, 0);
                bigSymbol.width = 264;
                bigSymbol.height = 264;

                bigSymbol.x = (this.width / 2) - (bigSymbol.width / 2);
                bigSymbol.y = (this.height / 2) - (bigSymbol.height / 2);

                this.elements.push(bigSymbol);
                this.showFinalResults(this.elements[0].constructor);
            }

            this.renderer.clearScreen();
            this.renderer.createRect({
                x: 0,
                y: 0,
                width: this.width,
                height: this.height,
                color: "#058ED9"
            });
            this.renderer.render();
        }

    }

    start() {
        this.ui.gameStart();

        requestAnimationFrame((now) => {
            this.create();
            this.loop(now);
        });
    }

    generateElements() {
        const speed = parseInt(this.ui.speed.value);

        this.availableElements.forEach(el => {
            for (let i = 0; i < 33; i++) {
                const obj = Utils.getRandomElement(el.constructor, this.width, this.height);
                obj.speed = speed;
                this.elements.push(obj);
            }
        });

        this.applySkillsEffect();
    }

    updateResults() {
        const qtdRock = (this.elements.filter(x => x instanceof Rock).length / this.elements.length) * 100;
        const qtdPaper = (this.elements.filter(x => x instanceof Paper).length / this.elements.length) * 100;
        const qtdScissors = (this.elements.filter(x => x instanceof Scissors).length / this.elements.length) * 100;

        const bigger = qtdRock > qtdPaper && qtdRock > qtdScissors ? qtdRock :
        (qtdPaper > qtdRock && qtdPaper > qtdScissors ? qtdPaper : qtdScissors);

        this.ui.renderPartials({ qtdRock, qtdPaper, qtdScissors, bigger });
    }

    showFinalResults(winType) {
        const winObject = new winType(0, 0);

        let win = "";

        if (winObject instanceof Rock) {
            win = "rock";
        }

        if (winObject instanceof Paper) {
            win = "paper";
        }

        if (winObject instanceof Scissors) {
            win = "scissors";
        }

        if (this.ui.bet.value == win) {
            Storage.addWin();
        }
        else {
            Storage.addLost();
        }

        this.ui.gameEnd();
        this.ui.renderResults(win);
    }

    applySkillsEffect(atGameStart = true) {
        this.ui.activatedSkills.forEach((skill) => {
            skill.action({
                constructor: this.availableElements.find(x => x.name == this.ui.bet.value).constructor,
                screenElements: this.elements,
                screenWidth: this.width,
                screenHeight: this.height,
                speed: parseInt(this.ui.speed.value),
                atGameStart
            });
        });
    }
}

