import {
  BehaviorSubject,
  mergeMap,
  pipe,
  tap,
  toArray,
} from 'rxjs';
import { hex, hsl } from 'color-convert';
import { astar, manhattan } from './astar';
import { assert, tapLog } from './helpers';
import type { Coords, Grid, Node } from './types';

export const nodeColors = {
  start: 0x00ff00,
  end: 0xff0000,
  path: 0xffffff,
  wall: 0,
  slot: 0xaaaaaa,
  inCart: 0xffff00,
};

export const screenW = Math.min(window.innerWidth, 1280);
export const screenH = Math.min(window.innerWidth, 1280);

const size = 20;

export const [gridW, gridH] = [size, size];
export const [cellW, cellH] = [screenW / gridW, screenH / gridH];

export const startNodeCoords = [0, 0] as Coords;

export const makeNode = (coords: [number, number]): Node => {
  const [x, y] = coords;

  const isPath = true;

  return {
    px: x,
    py: y,
    x: x * cellW,
    y: y * cellH,
    coords,
    f: Number.MAX_SAFE_INTEGER,
    g: Number.MAX_SAFE_INTEGER,
    h: Number.MAX_SAFE_INTEGER,
    parent: null,
    isPath,
    color: isPath ? nodeColors.path : nodeColors.wall,
  };
};

const makeGrid = (): Grid => {
  const g = [] as unknown as Grid;
  for (let x = 0; x < gridW; x++)
    for (let y = 0; y < gridH; y++)
      g[x * gridW + y] = makeNode([x, y]);

  return g;
};

export const grid = new BehaviorSubject<Grid>(makeGrid());

export const gridSet =
  ([x, y]: [number, number], value: Partial<Node>) =>
  (g: Grid): Grid => {
    assert(g[x * gridW + y], `cannot get node at ${x}, ${y}`);

    g[x * gridW + y] = { ...g[x * gridW + y], ...value } as Node;

    return g;
  };

export const gridGet =
  ([x, y]: [number, number]) =>
  (g: Grid): Node => {
    assert(g[x * gridW + y], `cannot get node at ${x}, ${y}`);

    return { ...g[x * gridW + y] } as Node;
  };

export const startNode = gridGet(startNodeCoords)(grid.value);

export const batchSetGrid =
  (value: Partial<Node>) => (nodes: Node[]) =>
    grid.next(
      nodes.reduce(
        (g, n) => gridSet(n.coords, value)(g),
        [...grid.value],
      ),
    );

export const modColor = (mod: number) => {
  const h = Math.floor(mod / 2);

  return parseInt(hsl.hex([h, 75, 50]), 16);
};

export const paintPath = tap((nodes: Node[]) =>
  grid.next(
    nodes
      .sort(
        ({ coords: [ax, ay] }, { coords: [bx, by] }) =>
          manhattan(startNode.px - ax, startNode.py - ay) -
          manhattan(startNode.px - bx, startNode.py - by),
      )
      .reduce(
        (g, n, i) =>
          gridSet(n.coords, {
            color: modColor((i / nodes.length / 2) * 360),
          })(g),
        [...grid.value],
      ),
  ),
);

export const calcPath = pipe(
  mergeMap((ns: [Coords, Coords]) => astar(ns)([...grid.value])),
  toArray(),
  paintPath,
);

export const getNeighbors = ([px, py]: Coords) => {
  const getters: ((g: Grid) => Node)[] = [];

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const [x, y] = [px + i, py + j];
      if (x < 0 || x >= gridW || y < 0 || y >= gridH) continue;
      if (i === 0 && j === 0) continue;

      const g = gridGet([x, y]);

      getters.push(g);
    }
  }

  return getters;
};
