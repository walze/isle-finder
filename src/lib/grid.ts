import {
  BehaviorSubject,
  map,
  mergeAll,
  pipe,
  tap,
  toArray,
} from 'rxjs';
import { astar } from './astar';
import { assert } from './helpers';
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
    text: null,
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

gridSet([0, 0], {
  color: nodeColors.start,
  g: 0,
  isPath: true,
})(grid.value);
export const startNode = gridGet([0, 0])(grid.value);

export const calcPath = (g: Grid) =>
  pipe(
    map((ns: [Node, Node]) => astar(ns)(g)),
    mergeAll(),
    tap((node) => {
      if (
        node.color !== nodeColors.end &&
        node.color !== nodeColors.start &&
        node.color !== nodeColors.slot
      )
        grid.next(
          gridSet(node.coords, { color: 0x0000ff })(grid.value),
        );
    }),
    toArray(),
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
