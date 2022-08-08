import { pair } from 'ramda';
import { from, map, mergeMap } from 'rxjs';
import { gridH, gridW, nodeColors, gridSet } from './grid';
import { range } from './helpers';
import type { Node } from './types';

const nIslesX = Math.min(4, Math.floor(gridW / 3));
const nIslesY = 2;

const padding = 0.1;

export const width = 3;
export const height = gridH * (1 / nIslesY) - gridH * padding;

const freeSpaceX = gridW - width * nIslesX;
const freeSpaceY = gridH - height * nIslesY;

const marginPerIsleX = Math.floor(freeSpaceX / nIslesX);
const marginPerIsleY = Math.floor(freeSpaceY / nIslesY);

const fullIsleX = width + marginPerIsleX;
const fullIsleY = height + marginPerIsleY;

const wall: Partial<Node> = {
  isPath: false,
  color: nodeColors.wall,
};

export const islesX = range(0, nIslesX - 1).map(
  (i) =>
    i * fullIsleX +
    (i === 0
      ? Math.ceil(marginPerIsleX / 2)
      : Math.floor(marginPerIsleX / 2)),
);

export const islesY = range(0, nIslesY - 1).map(
  (i) =>
    i * fullIsleY +
    (i === 0
      ? Math.ceil(marginPerIsleY / 2)
      : Math.floor(marginPerIsleY / 2)),
);

export const drawIsles = from(islesX).pipe(
  mergeMap((px) => from(islesY).pipe(map((py) => pair(px, py)))),
  mergeMap(([px, py]) => [
    ...range(px, px + width - 1).map((x) => pair(x, py)),
    ...range(px, px + width - 1).map((x) =>
      pair(x, py + height - 1),
    ),
    ...range(py, py + height - 1).map((y) => pair(px + 1, y)),
  ]),
  map(([x, y]) => gridSet([x, y], wall)),
);
