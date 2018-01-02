import { Subscription } from "rxjs/Subscription";
import Rx from "rxjs";
import * as fromModel from "./model";
import * as fromGraphics from "./graphics";
import * as fromUtils from "./utils";
import * as fromAudio from "./audio";
export class Game {
  private audio: any;
  private game: Subscription;
  // Observe interval each 17 miliseconds
  private ticker$: Rx.Observable<fromModel.Ticker> = Rx.Observable.interval(
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
  private input$ = Rx.Observable.merge(
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
  private gameStatus$: Rx.Observable<
    fromModel.GameStatus
  > = this.ticker$
    .withLatestFrom(this.input$)
    .scan(
      (acc: fromModel.GameStatus, current: fromModel.TickerDirectionTuple) => {
        let { ball, bricks, score, paddle } = acc;
        const [ticker, direction] = current;
        const movement = direction * ticker.deltaTime * fromModel.PADDLE_SPEED;
        paddle = fromUtils.updatePaddle(
          this.graphics,
          paddle,
          movement,
          fromModel.halfPaddle
        );
        ball.position = fromUtils.updateBallPosition(ball, ticker.deltaTime);
        return fromUtils.updateGameStatus(
          this.graphics.canvas,
          paddle,
          ball,
          bricks,
          score
        );
      },
      fromUtils.initGameStatus(this.graphics.canvas)
    );

  constructor(private graphics: fromGraphics.Graphics) {
    this.audio = new fromAudio.Beeper();
  }

  startGame(): Subscription {
    this.graphics.drawTitle();
    this.graphics.drawControls();
    this.game = this.gameStatus$.subscribe(
      (gameStatus: fromModel.GameStatus) => {
        if (!fromUtils.update(this.graphics, this.audio, gameStatus)) {
          this.game.unsubscribe();
        }
      }
    );
    return this.game;
  }

  endGame() {
    if (this.game) {
      this.audio.beeper(28);
      this.graphics.drawGameOver("GAME OVER");
      this.game.unsubscribe();
    }
  }
}
