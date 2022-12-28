import { Renderer } from "./gfx/renderer.js";
import { Rock } from "./entities/rock.js";
import { Paper } from "./entities/paper.js";
import { Scissors } from "./entities/scissors.js";

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
    }

    create() {
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
        this.ui.startButton.setAttribute("disabled", "true");
        this.ui.bet.setAttribute("disabled", "true");
        this.ui.speed.setAttribute("disabled", "true");
        this.ui.panel.classList.remove("active");
        this.ui.results.innerHTML = `<ul class="list-group" id="partials"></ul>`;

        requestAnimationFrame((now) => {
            this.create();
            this.loop(now);
        });
    }

    generateElements() {
        const availableElements = [Rock, Paper, Scissors];

        availableElements.forEach(el => {
            for (let i = 0; i < 33; i++) {
                const randX = (this.width - 64) * Math.random() | 0;
                const randY = (this.height - 64) * Math.random() | 0;

                const speed = parseInt(this.ui.speed.value);

                const size = window.mobileCheck ? 16 : 32;
    
                this.elements.push(new el(randX, randY, speed, size, size));
            }
        });
    }

    updateResults() {
        const qtdRock = (this.elements.filter(x => x instanceof Rock).length / this.elements.length) * 100;
        const qtdPaper = (this.elements.filter(x => x instanceof Paper).length / this.elements.length) * 100;
        const qtdScissors = (this.elements.filter(x => x instanceof Scissors).length / this.elements.length) * 100;

        const bigger = qtdRock > qtdPaper && qtdRock > qtdScissors ? qtdRock :
        (qtdPaper > qtdRock && qtdPaper > qtdScissors ? qtdPaper : qtdScissors);

        const rangeHTML = `
        <div style="width: 100%; margin-left: 10px;" class="progress" role="progressbar">
            <div class="progress-bar progress-bar-animated bg-warning" style="width: $QTD%"></div>
        </div>
        `;

        this.ui.results.querySelector("#partials").innerHTML = `
            <li class="list-group-item d-flex align-items-center ${bigger == qtdRock ? 'active' : ''}">
                <img width="32" src="assets/rock.png" />
                ${rangeHTML.replace("$QTD", qtdRock)}
            </li>
            <li class="list-group-item d-flex align-items-center ${bigger == qtdPaper ? 'active' : ''}">
                <img width="32" src="assets/paper.png" />
                ${rangeHTML.replace("$QTD", qtdPaper)}
            </li>
            <li class="list-group-item d-flex align-items-center ${bigger == qtdScissors ? 'active' : ''}">
                <img width="32" src="assets/scissors.png" />
                ${rangeHTML.replace("$QTD", qtdScissors)}
            </li>
        `;
    }

    showFinalResults(winType) {
        this.ui.startButton.removeAttribute("disabled");
        this.ui.bet.removeAttribute("disabled");
        this.ui.speed.removeAttribute("disabled");
        this.ui.panel.classList.add("active");

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

        let resultHTML = `<div class="mt-4 alert $CLASS" role="alert">
            <img width="32" src="assets/${win}.png" /> ${win.toUpperCase()} won the game. `;
        
        let alertClass = "alert-success";
        
        if (this.ui.bet.value == win) {
            resultHTML += "You won!";
        }
        else {
            alertClass = "alert-danger";
            resultHTML += "You lost :(";
        }

        resultHTML += "</div>"

        this.ui.results.innerHTML += resultHTML.replace("$CLASS", alertClass);
    }
}