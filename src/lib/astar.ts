import { equals } from 'ramda';
import { filter, map, pipe } from 'rxjs';
import { getNeighbors, gridSet, nodeColors } from './grid';
import type { Node, Grid } from './types';

export const pythagoras = (a: number, b: number) =>
  Math.sqrt(a ** 2 + b ** 2);

export const manhattan = (a: number, b: number) =>
  Math.abs(a) + Math.abs(b);

const isDiagonal = (a: Node, b: Node) =>
  a.x !== b.x && a.y !== b.y;

export const calcScores = (
  current: Node,
  neighbor: Node,
  goal: Node,
) => {
  const d = isDiagonal(current, neighbor)
    ? pythagoras(neighbor.px - goal.px, neighbor.py - goal.py) *
      (4 / 3)
    : pythagoras(neighbor.px - goal.px, neighbor.py - goal.py);

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
  grid: Grid,
) => (path: [Node, Node], queue?: Grid, seen?: Node[]) => Node[];

type Astar2 = (
  path: [Node, Node],
  queue?: Grid,
  seen?: Node[],
) => Node[];

export const astar: Astar =
  (grid) =>
  ([start, goal], q = [start], s = []) => {
    start.g = 0;
    const [node, ...queue] = q.sort((a, b) => a.f - b.f);
    const seen = [...s, node];

    if (!node) {
      // eslint-disable-next-line no-console
      console.warn('no path found', node, q, s);
      return [];
    }

    if (equals(node.coords, goal.coords))
      return reconstructPath(node);

    const neighbors = getNeighbors(node)
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

    return astar(grid)(
      [start, goal],
      [...queue, ...neighbors] as Grid,
      seen,
    );
  };

export const aastar: Astar =
  (grid) =>
  ([start, goal], q = [start], s = []) => {
    const [node, ...queue] = q.sort((a, b) => a.f - b.f);
    const seen = [...s, node];
    if (node === goal) return reconstructPath(node);

    const asd = pipe(
      filter(
        (neighbor: Node) =>
          !seen.includes(neighbor) && neighbor.isPath,
      ),
      filter((neighbor) => {
        const scores = calcScores(node, neighbor, goal);
        if (scores.g >= neighbor.g) return false;

        Object.assign(neighbor, { ...scores, parent: node });
        return !queue.includes(neighbor);
      }),
      map((n) => gridSet(n.coords, n)),
    );

    const neighbors = getNeighbors(node);

    return astar(
      [start, goal],
      [...queue, ...neighbors] as Grid,
      seen,
    );
  };
