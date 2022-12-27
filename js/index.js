import { Game } from "./modules/game.js";

const canvas = document.querySelector("#main-game");
const ui = {
    startButton: document.querySelector("#start"),
    bet: document.querySelector("#bet"),
    speed: document.querySelector("#speed"),
    results: document.querySelector("#results"),
};



ui.startButton.addEventListener("click", () => {
    new Game(canvas, ui).start();
});