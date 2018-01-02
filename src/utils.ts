import * as fromGraphics from "./graphics";
import * as fromModel from "./model";
import * as fromAudio from "./audio";

export function updateGameStatus(
  canvas: HTMLCanvasElement,
  paddle: number,
  ball: fromModel.Ball,
  bricks: Array<fromModel.Brick>,
  score: number
): fromModel.GameStatus {
  let collisions = initGameStatus(canvas).collisions;
  let survivors: Array<fromModel.Brick> = [];
  bricks.forEach(brick => {
    if (!collision(brick, ball)) {
      survivors.push(brick);
    } else {
      collisions.brick = true;
      score = score + 10;
    }
  });

  collisions.paddle = hit(canvas, paddle, ball);

  if (
    ball.position.x < fromModel.BALL_RADIUS ||
    ball.position.x > canvas.width - fromModel.BALL_RADIUS
  ) {
    ball.direction.x = -ball.direction.x;
    collisions.wall = true;
  }

  collisions.ceiling = ball.position.y < fromModel.BALL_RADIUS;

  if (collisions.brick || collisions.paddle || collisions.ceiling) {
    ball.direction.y = -ball.direction.y;
  }

  return { ball, bricks: survivors, collisions, score, paddle };
}

export function brickFactory(canvas: HTMLCanvasElement) {
  let width =
    (canvas.width -
      fromModel.BRICK_GAP -
      fromModel.BRICK_GAP * fromModel.BRICK_COLUMNS) /
    fromModel.BRICK_COLUMNS;
  let bricks = [];

  for (let i = 0; i < fromModel.BRICK_ROWS; i++) {
    for (let j = 0; j < fromModel.BRICK_COLUMNS; j++) {
      bricks.push({
        x: j * (width + fromModel.BRICK_GAP) + width / 2 + fromModel.BRICK_GAP,
        y:
          i * (fromModel.BRICK_HEIGHT + fromModel.BRICK_GAP) +
          fromModel.BRICK_HEIGHT / 2 +
          fromModel.BRICK_GAP +
          20,
        width: width,
        height: fromModel.BRICK_HEIGHT
      });
    }
  }
  return bricks;
}

export function initGameStatus(
  canvas: HTMLCanvasElement
): fromModel.GameStatus {
  return {
    ball: {
      position: {
        x: canvas.width / 2,
        y: canvas.height / 2
      },
      direction: {
        x: 2,
        y: 2
      }
    },
    bricks: brickFactory(canvas),
    collisions: {
      paddle: false,
      floor: false,
      wall: false,
      ceiling: false,
      brick: false
    },
    score: 0,
    paddle: canvas.width / 2
  };
}

export function hit(
  canvas: HTMLCanvasElement,
  paddle: number,
  ball: fromModel.Ball
) {
  const topHeight =
    canvas.height - fromModel.PADDLE_HEIGHT - fromModel.BALL_RADIUS / 2;
  return (
    ball.position.x > paddle - fromModel.PADDLE_WIDTH / 2 &&
    ball.position.x < paddle + fromModel.PADDLE_WIDTH / 2 &&
    ball.position.y > topHeight
  );
}

export function collision(brick: fromModel.Brick, ball: fromModel.Ball) {
  return (
    ball.position.x + ball.direction.x > brick.x - brick.width / 2 &&
    ball.position.x + ball.direction.x < brick.x + brick.width / 2 &&
    ball.position.y + ball.direction.y > brick.y - brick.height / 2 &&
    ball.position.y + ball.direction.y < brick.y + brick.height / 2
  );
}

export function update(
  graphics: fromGraphics.Graphics,
  audio: fromAudio.Beeper,
  status: fromModel.GameStatus
): boolean {
  let rslt = true;

  graphics.context.clearRect(
    0,
    0,
    graphics.canvas.width,
    graphics.canvas.height
  );

  graphics.drawPaddle(status.paddle);
  graphics.drawBall(status.ball);
  graphics.drawBricks(status.bricks);
  graphics.drawScore(status.score);

  if (status.ball.position.y > graphics.canvas.height - fromModel.BALL_RADIUS) {
    audio.beeper(28);
    graphics.drawGameOver("GAME OVER");
    rslt = false;
  }

  if (!status.bricks.length) {
    audio.beeper(52);
    graphics.drawGameOver("CONGRATULATIONS");
    rslt = false;
  }

  if (status.collisions.paddle) audio.beeper(40);
  if (status.collisions.wall || status.collisions.ceiling) audio.beeper(45);
  if (status.collisions.brick)
    audio.beeper(47 + Math.floor(status.ball.position.y % 12));
  return rslt;
}

export function updatePaddle(
  graphics: fromGraphics.Graphics,
  paddle: number,
  movement: number,
  halfPaddle: number
): number {
  let paddlePosition = paddle + movement;
  if (paddlePosition > graphics.canvas.width - halfPaddle) {
    paddlePosition = graphics.canvas.width - halfPaddle;
  }
  if (paddlePosition < halfPaddle) {
    paddlePosition = halfPaddle;
  }
  return paddlePosition;
}

export function updateBallPosition(
  ball: fromModel.Ball,
  deltaTime: number
): fromModel.Position {
  ball.position.x =
    ball.position.x + ball.direction.x * deltaTime * fromModel.BALL_SPEED;
  ball.position.y =
    ball.position.y + ball.direction.y * deltaTime * fromModel.BALL_SPEED;
  return ball.position;
}
