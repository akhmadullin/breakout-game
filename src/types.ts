import { BrickOptions } from './elements/brick';

export type Point = {
    x: number;
    y: number;
};

export type Color = string;

export type Size = {
    width: number;
    height: number;
};

export type Level = {
    ballSpeed: number;
    paddleSpeed: number;
    paddleSize: Size;
    bricks: BrickOptions[];
};
