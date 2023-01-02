import { Auth } from "./modules/auth/auth.js";
import { StatisticsStorage } from "./modules/data/statistics.js";
import { SkillsStorage } from "./modules/data/skills.js";
import { Game } from "./modules/game.js";
import { Utils } from "./modules/utils.js";

const auth = new Auth();
const loadingPanel = document.querySelector("#loading");
const canvas = document.querySelector("canvas#main-game");
const toggleButton = document.querySelector(".toggle-button");
const loginButton = document.querySelector("#login");
const logoutButton = document.querySelector("#logout");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const checkLogin = async () => {
    if (Utils.isUserLoggedIn()) {
        loadingPanel.classList.add("active");

        document.querySelector("#logged-content").style = "";
        document.querySelector("#login-content").style = "display: none;";

        await ui.renderUserSkills();
        await ui.renderStatistics();

        loadingPanel.classList.remove("active");
    }
    else {
        document.querySelector("#logged-content").style = "display: none;";
        document.querySelector("#login-content").style = "";
    }
};

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

    async renderResults(win) {
        let playerWon = this.bet.value == win;
        let alertClass = playerWon ? "alert-success" : "alert-danger";

        let resultHTML = `
            <div class="mt-4 alert ${alertClass}" role="alert">
                <img width="32" src="assets/${win}.png" /> ${win.toUpperCase()} won the game.
                ${playerWon ? "You won!" : "You lost :("}
            </div>
        `;

        this.results.innerHTML += resultHTML;

        if (playerWon) {
            await this.givePlayerRandomSkill();
        }

        await this.renderUserSkills();
        await this.renderStatistics();
    },

    async renderStatistics() {
        const actual = await StatisticsStorage.getStatistics();
        const user = JSON.parse(Utils.isUserLoggedIn()).displayName;
        const sum = parseInt(actual.lost) + parseInt(actual.wins);
        let winrate = 0;
        
        if (sum > 0) {
            winrate = (parseInt(actual.wins) / sum * 100).toFixed(2);
        }

        this.statistics.querySelector(".userName").innerHTML = user;
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

    gameEnd(win) {
        let updatePromise = null;

        if (this.bet.value == win) {
            updatePromise = StatisticsStorage.addWin();
        }
        else {
            updatePromise = StatisticsStorage.addLost();
        }

        loadingPanel.classList.add("active");
        updatePromise.then(() => {
            return this.renderResults(win);
        }).then(() => {
            this.startButton.removeAttribute("disabled");
            this.bet.removeAttribute("disabled");
            this.speed.removeAttribute("disabled");
            this.panel.classList.add("active");
            loadingPanel.classList.remove("active");
        });
    },

    async renderUserSkills() {
        const userSkills = await SkillsStorage.getSkills();
    
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

    async givePlayerRandomSkill() {
        const chosenSkill = Utils.availableSkills[Utils.availableSkills.length * Math.random() | 0];
        await SkillsStorage.addSkill(chosenSkill);
    
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

        selectedIds.forEach(async id => {
            const skillToActivate = Utils.availableSkills.find(x => x.id == id);
            this.activatedSkills = [...this.activatedSkills, skillToActivate];

            await SkillsStorage.consumeSkill(skillToActivate.id);
        });
    }
};

const initApp = async () => {
    await checkLogin();

    ui.startButton.addEventListener("click", async () => {
        if (!Utils.isUserLoggedIn()) {
            await auth.login();
            await checkLogin();
        }

        ui.setActivatedSkills();
        new Game(canvas, ui).start();
    });
    
    toggleButton.addEventListener("click", () => {
        ui.panel.classList.toggle("active");
    });
    
    loginButton.addEventListener("click", async () => {
        await auth.login();
        await checkLogin();
    });
    
    logoutButton.addEventListener("click", async () => {
        auth.logout();
        window.location.reload();
    });
};

initApp();
