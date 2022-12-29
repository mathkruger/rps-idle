import { Storage } from "./modules/data/storage.js";
import { Game } from "./modules/game.js";

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

    updateStatistics() {
        const actual = Storage.getStatistics();
        const sum = parseInt(actual.lost) + parseInt(actual.wins);
        let winrate = 0;
        
        if (sum > 0) {
            winrate = (parseInt(actual.wins) / sum * 100).toFixed(2);
        }


        this.statistics.querySelector(".wins").innerHTML = actual.wins;
        this.statistics.querySelector(".lost").innerHTML = actual.lost;
        this.statistics.querySelector(".total").innerHTML = `${sum} (Win rate: ${winrate}%)`;
    }
};

ui.updateStatistics();

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ui.startButton.addEventListener("click", () => {
    new Game(canvas, ui).start();
});

toggleButton.addEventListener("click", () => {
    ui.panel.classList.toggle("active");
});
