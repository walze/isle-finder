import { equals } from 'ramda';
import { getNeighbors, gridGet, gridSet } from './grid';
import type { Node, Grid, Coords } from './types';

export const pythagoras = (a: number, b: number) =>
  Math.sqrt(a ** 2 + b ** 2);

export const manhattan = (a: number, b: number) =>
  Math.abs(a) + Math.abs(b);

const isDiagonal = ([ax, ay]: Coords, [bx, by]: Coords) =>
  ax !== bx && ay !== by;

export const calcScores = (
  current: Node,
  neighbor: Node,
  goal: Node,
) => {
  const d = isDiagonal(current.coords, neighbor.coords)
    ? manhattan(neighbor.px - goal.px, neighbor.py - goal.py) *
      (4 / 3)
    : manhattan(neighbor.px - goal.px, neighbor.py - goal.py);

  const g = current.g + d;
  const h = manhattan(
    neighbor.px - goal.px,
    neighbor.py - goal.py,
  );
  const f = g + h;

  return { f, g, h };
};

const reconstructPath = (
  node: Node,
  path = [] as Node[],
): Node[] =>
  !node.parent
    ? path
    : reconstructPath(node.parent, [...path, node]);

type Astar = (
  path: [Coords, Coords],
  queue?: Grid,
  seen?: Node[],
) => (grid: Grid) => Node[];

export const astar: Astar =
  ([a, b], _q, s = []) =>
  (grid) => {
    const start = gridGet(a)(grid);
    const goal = gridGet(b)(grid);
    const q = _q || [start];
    start.g = 0;

    const [node, ...queue] = q.sort((n1, n2) => n1.f - n2.f);
    const seen = [...s, node];

    if (!node) {
      // eslint-disable-next-line no-console
      console.warn('no path found', node, q, s);
      return [];
    }

    if (equals(node.coords, goal.coords))
      return reconstructPath(node);

    const neighbors = getNeighbors(node.coords)
      .filter((getN) => {
        const neighbor = getN(grid);

        if (!neighbor.isPath) return false;

        const scores = calcScores(node, neighbor, goal);
        if (scores.g >= neighbor.g) return false;

        gridSet(neighbor.coords, { ...scores, parent: node })(
          grid,
        );

        return !queue.includes(neighbor);
      })
      .map((getN) => ({ ...getN(grid) }));

    return astar(
      [a, b],
      [...queue, ...neighbors] as Grid,
      seen,
    )(grid);
  };
