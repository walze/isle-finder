import assert from "assert";
import { BehaviorSubject, identity, map, mergeMap, of, tap } from "rxjs";
import { astar, calcScores, updateNode } from "./astar";
import { pair } from "./helpers";
import { Grid, Node } from "./types";

export const nodeColors = {
  start: 0x00ff00,
  end: 0xff0000,
  path: 0xffffff,
  wall: 0,
};

export const screenW = 800;
export const screenH = 800;

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
  const r = Math.random() > 1 / 4;
  const [x, y] = coords;

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
    isPath: r,
    seen: false,
    color: r ? nodeColors.path : nodeColors.wall,
    text: null,
  };
};

export const grid = [] as unknown as Grid;
for (let x = 0; x < gridW; x++)
  for (let y = 0; y < gridH; y++) grid[x * gridW + y] = makeNode([x, y]);

document.onclick = () =>
  console.log(grid.map(({ f, g, h, coords }) => ({ g })));

export const gridSet =
  ([x, y]: [number, number], value: Node) =>
  (grid: Grid): void => {
    assert(grid[x * gridW + y], `cannot get node at ${x}, ${y}`);

    grid[x * gridW + y] = value;
  };

export const gridGet =
  (grid: Grid) =>
  ([x, y]: [number, number]): Node => {
    assert(grid[x * gridW + y], `cannot get node at ${x}, ${y}`);

    return grid[x * gridW + y] as Node;
  };

// Random start and end points
export const [startNode, endNode] = [
  gridGet(grid)([
    Math.floor(Math.random() * gridW),
    Math.floor(Math.random() * gridH),
  ]),
  gridGet(grid)([
    Math.floor(Math.random() * gridW),
    Math.floor(Math.random() * gridH),
  ]),
];

startNode.color = nodeColors.start;
startNode.g = 0;
startNode.isPath = true;
updateNode(startNode)({
  ...calcScores(startNode.g, startNode, endNode),
  parent: null,
});

endNode.color = nodeColors.end;
endNode.isPath = true;

export const bestPath = new BehaviorSubject<Node[]>([]);

export const calcPath = ([n1, n2]: [Node, Node]) =>
  of(pair(n1, n2)).pipe(
    tap(() => {
      grid.forEach((n) => {
        n.seen = false;
      });

      bestPath.getValue().forEach((node) => {
        node.color = node.isPath ? nodeColors.path : nodeColors.wall;
      });
    }),
    map((coords) => astar(grid)(coords)),
    tap((nodes) => bestPath.next(nodes)),
    mergeMap(identity),
    tap((node) => {
      if (node.color !== nodeColors.end || node.color !== nodeColors.start)
        node.color = 0x0000ff;
    })
  );

export const getNeighbors = (grid: Grid) => (n: Node) => {
  const [px, py] = n.coords;
  const neighbors: Node[] = [];
  const getNode = gridGet(grid);

  if (px < gridW - 1) neighbors.push(getNode([px + 1, py]));
  if (py < gridH - 1) neighbors.push(getNode([px, py + 1]));
  if (px > 0) neighbors.push(getNode([px - 1, py]));
  if (py > 0) neighbors.push(getNode([px, py - 1]));

  return neighbors;
};
