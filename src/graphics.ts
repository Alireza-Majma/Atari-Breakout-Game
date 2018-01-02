import * as fromModel from "./model";

export class Graphics {
  public context: CanvasRenderingContext2D;

  constructor(public canvas: HTMLCanvasElement) {
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "lightblue";
  }

  public drawTitle() {
    this.context.textAlign = "center";
    this.context.font = "24px Courier New";
    this.context.fillText(
      "rxjs breakout",
      this.canvas.width / 2,
      this.canvas.height / 2 - 24
    );
  }

  drawControls() {
    this.context.textAlign = "center";
    this.context.font = "16px Courier New";
    this.context.fillText(
      "press [<] and [>] to play",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  drawGameOver(text: string) {
    this.context.clearRect(
      this.canvas.width / 4,
      this.canvas.height / 3,
      this.canvas.width / 2,
      this.canvas.height / 3
    );
    this.context.textAlign = "center";
    this.context.font = "24px Courier New";
    this.context.fillText(text, this.canvas.width / 2, this.canvas.height / 2);
  }

  drawScore(score: number) {
    this.context.textAlign = "left";
    this.context.font = "16px Courier New";
    this.context.fillText(score.toString(), fromModel.BRICK_GAP, 16);
  }

  drawPaddle(position: number) {
    this.context.beginPath();
    this.context.rect(
      position - fromModel.PADDLE_WIDTH / 2,
      this.context.canvas.height - fromModel.PADDLE_HEIGHT,
      fromModel.PADDLE_WIDTH,
      fromModel.PADDLE_HEIGHT
    );
    this.context.fill();
    this.context.closePath();
  }

  drawBall(ball: fromModel.Ball) {
    this.context.beginPath();
    this.context.arc(
      ball.position.x,
      ball.position.y,
      fromModel.BALL_RADIUS,
      0,
      Math.PI * 2
    );
    this.context.fill();
    this.context.closePath();
  }

  drawBrick(brick: fromModel.Brick) {
    this.context.beginPath();
    this.context.rect(
      brick.x - brick.width / 2,
      brick.y - brick.height / 2,
      brick.width,
      brick.height
    );
    this.context.fill();
    this.context.closePath();
  }

  drawBricks(bricks: Array<fromModel.Brick>) {
    bricks.forEach((brick: any) => this.drawBrick(brick));
  }
}
