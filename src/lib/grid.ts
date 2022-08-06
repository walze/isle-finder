import { identity, map, mergeMap, of, tap } from 'rxjs';
import { bestPath$ } from '../stores';
import { astar, calcScores } from './astar';
import { assert, pair } from './helpers';
import type { Grid, Node } from './types';

export const nodeColors = {
  start: 0x00ff00,
  end: 0xff0000,
  path: 0xffffff,
  wall: 0,
  slot: 0xcccccc,
  inCart: 0xffff00,
};

export const screenW = 1080;
export const screenH = 1080;

const size = 20;

export const [gridW, gridH] = [size, size];
export const [cellW, cellH] = [screenW / gridW, screenH / gridH];

console.table({
  size,
  gridW,
  gridH,
  cellW,
  cellH,
});

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

export const grid = [] as unknown as Grid;
for (let x = 0; x < gridW; x++)
  for (let y = 0; y < gridH; y++)
    grid[x * gridW + y] = makeNode([x, y]);

export const gridSet =
  ([x, y]: [number, number], value: Node) =>
  (g: Grid): void => {
    assert(g[x * gridW + y], `cannot get node at ${x}, ${y}`);

    g[x * gridW + y] = value;
  };

export const gridGet =
  (g: Grid) =>
  ([x, y]: [number, number]): Node => {
    assert(g[x * gridW + y], `cannot get node at ${x}, ${y}`);

    return g[x * gridW + y] as Node;
  };

// Random start and end points
export const startNode = gridGet(grid)([0, 0]);

startNode.color = nodeColors.start;
startNode.g = 0;
startNode.isPath = true;

export const calcPath = ([n1, n2]: [Node, Node]) =>
  of(pair(n1, n2)).pipe(
    tap(() => {
      bestPath$.getValue().forEach((node) => {
        node.color = node.isPath
          ? nodeColors.path
          : nodeColors.wall;
      });
    }),
    map((coords) => astar(grid)(coords)),
    tap((nodes) => bestPath$.next(nodes)),
    mergeMap(identity),
    tap((node) => {
      if (
        node.color !== nodeColors.end &&
        node.color !== nodeColors.start
      )
        node.color = 0x0000ff;
    }),
  );

export const getNeighbors = (g: Grid) => (n: Node) => {
  const [px, py] = n.coords;
  const neighbors: Node[] = [];
  const getNode = gridGet(g);

  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const [x, y] = [px + i, py + j];
      if (x < 0 || x >= gridW || y < 0 || y >= gridH) continue;
      if (i === 0 && j === 0) continue;

      neighbors.push(getNode([x, y]));
    }
  }

  return neighbors;
};
