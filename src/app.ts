import "bootstrap/dist/css/bootstrap.css";

import * as fromGraphics from "./graphics";
import * as fromGame from "./game";

const graphics = new fromGraphics.Graphics(
  <HTMLCanvasElement>document.getElementById("stage")
);
let game: fromGame.Game;

document.getElementById("start-game").addEventListener("click", function() {
  game = new fromGame.Game(graphics);
  graphics.fill();
  game.startGame();
});

document.getElementById("stop-game").addEventListener("click", function() {
  game.endGame();
});
