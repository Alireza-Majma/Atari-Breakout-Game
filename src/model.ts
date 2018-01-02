import { Ticker } from './model';

export const PADDLE_WIDTH = 100;
export const PADDLE_HEIGHT = 20;
export const BALL_RADIUS = 10;
export const BRICK_ROWS = 5;
export const BRICK_COLUMNS = 7;
export const BRICK_HEIGHT = 20;
export const BRICK_GAP = 3;
export const BALL_SPEED = 60;
export const TICKER_INTERVAL = 17;
export const PADDLE_SPEED = 240;
export const PADDLE_KEYS = {
  Left: 37,
  Up: 38,
  Right: 39
};

export const halfPaddle= PADDLE_WIDTH / 2;


export interface Position {
  x: number;
  y: number;
}

export interface Ball {
  position: Position;
  direction: Position;
}
export interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameStatus {
  ball: Ball;
  bricks: Array<Brick>;
  collisions: Collisions;
  score: number;
  paddle: number
}

export interface Collisions {
  wall: boolean;
  brick: boolean;
  paddle: boolean;
  floor: boolean;
  ceiling: boolean;
}

export enum Direction {
    Others = 0,
    Left = -1,
    Right = 1
}
export interface Ticker {
  time: number;
  deltaTime: number;
}

// export interface Timer {
//   time: number;
//   deltaTime: number;
// }


export type TickerDirectionTuple = [Ticker, Direction];

export type TickerPaddleTuple = [Ticker, number];
// export type PassedTuple = [Ticker, number, ScanObject];
export type PassedTuple = [number, GameStatus];
