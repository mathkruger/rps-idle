import { Storage } from "./modules/data/storage.js";
import { Game } from "./modules/game.js";
import { InitialAdvantageSkill } from "./modules/entities/skills/initial-advantage-skill.js";
import { ShrinkSkill } from "./modules/entities/skills/shrink-skill.js";
import { SecondChange } from "./modules/entities/skills/second-chance-skill.js";

const canvas = document.querySelector("canvas#main-game");
const toggleButton = document.querySelector(".toggle-button");

const ui = {
    panel: document.querySelector("#ui"),
    startButton: document.querySelector("#start"),
    bet: document.querySelector("#bet"),
    speed: document.querySelector("#speed"),
    results: document.querySelector("#final-results"),
    partials: document.querySelector("#partials"),
    statistics: document.querySelector("#statistics"),
    activatedSkills: [
        // new InitialAdvantageSkill(),
        // new ShrinkSkill(),
        // new SecondChange()
    ],

    renderPartials({ qtdRock, qtdPaper, qtdScissors, bigger }) {
        const rangeHTML = `
        <div style="width: 100%; margin-left: 10px;" class="progress" role="progressbar">
            <div class="progress-bar progress-bar-animated bg-warning" style="width: $QTD%"></div>
        </div>
        `;

        this.partials.querySelector("ul").innerHTML = `
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
    },

    renderResults(win) {
        let resultHTML = `<div class="mt-4 alert $CLASS" role="alert">
            <img width="32" src="assets/${win}.png" /> ${win.toUpperCase()} won the game. `;
        
        let alertClass = "alert-success";
        
        if (this.bet.value == win) {
            resultHTML += "You won!";
        }
        else {
            alertClass = "alert-danger";
            resultHTML += "You lost :(";
        }

        resultHTML += "</div>"

        this.renderStatistics();
        this.results.innerHTML += resultHTML.replace("$CLASS", alertClass);
    },

    renderStatistics() {
        const actual = Storage.getStatistics();
        const sum = parseInt(actual.lost) + parseInt(actual.wins);
        let winrate = 0;
        
        if (sum > 0) {
            winrate = (parseInt(actual.wins) / sum * 100).toFixed(2);
        }

        this.statistics.querySelector(".wins").innerHTML = actual.wins;
        this.statistics.querySelector(".lost").innerHTML = actual.lost;
        this.statistics.querySelector(".total").innerHTML = `${sum} (Win rate: ${winrate}%)`;
    },

    gameStart() {
        this.startButton.setAttribute("disabled", "true");
        this.bet.setAttribute("disabled", "true");
        this.speed.setAttribute("disabled", "true");
        this.panel.classList.remove("active");
        this.results.innerHTML = "";
        this.partials.innerHTML = `<ul class="list-group"></ul>`;
    },

    gameEnd() {
        this.startButton.removeAttribute("disabled");
        this.bet.removeAttribute("disabled");
        this.speed.removeAttribute("disabled");
        this.panel.classList.add("active");
    }
};

ui.renderStatistics();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ui.startButton.addEventListener("click", () => {
    new Game(canvas, ui).start();
});

toggleButton.addEventListener("click", () => {
    ui.panel.classList.toggle("active");
});
