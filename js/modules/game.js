import { Renderer } from "./gfx/renderer.js";
import { Rock } from "./entities/rock.js";
import { Paper } from "./entities/paper.js";
import { Scissors } from "./entities/scissors.js";

export class Game {
    constructor(canvas, ui) {
        this.fps = 60;
        this.width = 800;
        this.height = 600;
        this.lastTime = null;
        this.requiredElapsed = null;
    
        this.canvas = canvas;
        this.ui = ui;
        this.elements = [];
        this.renderer = null;
    
        this.gameFinished = false;
    }

    create() {
        this.requiredElapsed = 1000 / this.fps;
        this.renderer = new Renderer(this.canvas, this.elements);

        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.generateElements();
    }

    loop(now) {
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
                    const sub = new i.replace(element.x, element.y);
                    this.elements[i.index] = sub;
                }
            });

            this.updateResults();

            if (this.elements.every(x => x.win == this.elements[0].win)) {
                this.gameFinished = true;
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
        this.ui.startButton.setAttribute("disabled", "true");
        this.ui.bet.setAttribute("disabled", "true");
        this.ui.results.innerHTML = `<ul id="partials"></ul>`;

        requestAnimationFrame((now) => {
            this.create();
            this.loop(now);
        });
    }

    generateElements() {
        const availableElements = [Rock, Paper, Scissors];

        availableElements.forEach(el => {
            for (let i = 0; i < 20; i++) {
                const randX = (this.width - 64) * Math.random() | 0;
                const randY = (this.height - 64) * Math.random() | 0;
    
                this.elements.push(new el(randX, randY));
            }
        });
    }

    updateResults() {
        const qtdRock = this.elements.filter(x => x instanceof Rock).length;
        const qtdPaper = this.elements.filter(x => x instanceof Paper).length;
        const qtdScissors = this.elements.filter(x => x instanceof Scissors).length;

        const rangeHTML = `<input style="pointer-events: none" type="range" min="0" max="${this.elements.length}" step="1" value="$QTD" />`;

        this.ui.results.querySelector("#partials").innerHTML = `
            <li>Rock Quantity: ${rangeHTML.replace("$QTD", qtdRock)}</li>
            <li>Paper Quantity: ${rangeHTML.replace("$QTD", qtdPaper)}</li>
            <li>Scissors Quantity: ${rangeHTML.replace("$QTD", qtdScissors)}</li>
        `;
    }

    showFinalResults(winType) {
        this.ui.startButton.removeAttribute("disabled");
        this.ui.bet.removeAttribute("disabled");

        const winObject = new winType(0, 0);

        console.log(winObject);

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

        this.ui.results.innerHTML += `<p>${win.toUpperCase()} won the game</p>`;

        console.log(this.ui.bet.value, win);

        if (this.ui.bet.value == win) {
            this.ui.results.innerHTML += "<p>You won!</p>";
        } else {
            this.ui.results.innerHTML += "<p>You loose :(</p>";
        }
    }
}