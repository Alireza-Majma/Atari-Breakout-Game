import Rx from "rxjs";
import "bootstrap/dist/css/bootstrap.css";
import * as fromModel from "./model";
import * as fromGraphics from "./graphics";
import * as fromUtils from "./utils";
import * as fromAudio from "./audio";
import { Subscription } from "rxjs/Subscription";

// create graphics and audio
const audio = new fromAudio.Beeper();
const graphics = new fromGraphics.Graphics(
  <HTMLCanvasElement>document.getElementById("stage")
);

graphics.drawTitle();
graphics.drawControls();

// Observe interval each 17 miliseconds
const ticker$: Rx.Observable<fromModel.Ticker> = Rx.Observable.interval(
  fromModel.TICKER_INTERVAL // ,  Rx.Scheduler.animationFrame
)
  .map(() => ({
    time: Date.now(),
    deltaTime: 0
  }))
  .scan((acc, current) => ({
    time: current.time,
    deltaTime: (current.time - acc.time) / 1000
  }));

// Observe inpute keys
const input$ = Rx.Observable.merge(
  Rx.Observable.fromEvent(document, "keydown")
    .filter(
      (event: KeyboardEvent) =>
        event.keyCode >= fromModel.PADDLE_KEYS.Left &&
        event.keyCode <= fromModel.PADDLE_KEYS.Right
    )
    .map((event: any) => event.keyCode - fromModel.PADDLE_KEYS.Up),
  Rx.Observable.fromEvent(document, "keyup", () => fromModel.Direction.Others)
).distinctUntilChanged();

// Observe game status
const gameStatus$: Rx.Observable<fromModel.GameStatus> = ticker$
  .withLatestFrom(input$)
  .scan(
    (acc: fromModel.GameStatus, current: fromModel.TickerDirectionTuple) => {
      let { ball, bricks, score, paddle } = acc;
      const [ticker, direction] = current;
      const movement = direction * ticker.deltaTime * fromModel.PADDLE_SPEED;
      paddle = fromUtils.updatePaddle(
        graphics,
        paddle,
        movement,
        fromModel.halfPaddle
      );
      ball.position = fromUtils.updateBallPosition(ball, ticker.deltaTime);
      return fromUtils.updateGameStatus(
        graphics.canvas,
        paddle,
        ball,
        bricks,
        score
      );
    },
    fromUtils.initGameStatus(graphics.canvas)
  );

// Game Subscribtion
const game: Subscription = gameStatus$.subscribe(
  (gameStatus: fromModel.GameStatus) => {
    if (!fromUtils.update(graphics, audio, gameStatus)) {
      game.unsubscribe();
    }
  }
);
