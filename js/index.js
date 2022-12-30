import { Storage } from "./modules/data/storage.js";
import { Game } from "./modules/game.js";
import { Utils } from "./modules/utils.js";

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
    skillsList: document.querySelector("#user-skills"),
    activatedSkills: [],

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
        let playerWon = this.bet.value == win;
        let alertClass = playerWon ? "alert-success" : "alert-danger";

        let resultHTML = `
            <div class="mt-4 alert ${alertClass}" role="alert">
                <img width="32" src="assets/${win}.png" /> ${win.toUpperCase()} won the game.
                ${playerWon ? "You won!" : "You lost :("}
            </div>
        `;

        this.results.innerHTML += resultHTML;
        this.renderStatistics();

        if (playerWon) {
            this.givePlayerRandomSkill();
        }

        this.renderUserSkills();
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
    },

    renderUserSkills() {
        const userSkills = Storage.getSkills();
    
        if (userSkills.length == 0) {
            this.skillsList.innerHTML = `<li class="list-group-item">
                You don't have any skills. Win some games to obtain skills.
            </li>`;
            return;
        }
    
        this.skillsList.innerHTML = "";
        userSkills.forEach((element, i) => {
            this.skillsList.innerHTML += `
                <li class="list-group-item">
                    <input class="form-check-input me-1 skill" type="checkbox" value="" id="${element.id}">
                    <label class="form-check-label stretched-link" for="${element.id}">
                        ${element.name} x${element.quantity}
                    </label>
                </li>
            `;
        });
    },

    givePlayerRandomSkill() {
        const chosenSkill = Utils.availableSkills[Utils.availableSkills.length * Math.random() | 0];
        Storage.addSkill(chosenSkill);
    
        let newSkillHTML = `
            <div class="mt-4 alert alert-success mt-2" role="alert">
                You received the "${chosenSkill.name}" skill! You can activate it in your next game.
            </div>
        `;
    
        this.results.innerHTML += newSkillHTML;
    },

    setActivatedSkills() {
        const selectedIds = Array.from(document.querySelectorAll(".skill"))
        .filter(x => x.checked)
        .map(x => x.id);

        this.activatedSkills = [];

        selectedIds.forEach(id => {
            const skillToActivate = Utils.availableSkills.find(x => x.id == id);
            this.activatedSkills = [...this.activatedSkills, skillToActivate];
            Storage.removeSkill(skillToActivate.id);
        });
    }
};

ui.renderUserSkills();
ui.renderStatistics();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ui.startButton.addEventListener("click", () => {
    ui.setActivatedSkills();
    new Game(canvas, ui).start();
});

toggleButton.addEventListener("click", () => {
    ui.panel.classList.toggle("active");
});
