import { getNeighbors } from './grid';
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
      1.4
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

export const astar: Astar =
  (grid) =>
  ([start, goal], q = [start], s = []) => {
    const [node, ...queue] = q.sort((a, b) => a.f - b.f);
    const seen = [...s, node];

    if (node === goal) return reconstructPath(node);

    const neighbors = getNeighbors(grid)(node)
      .filter(
        (neighbor) =>
          !seen.includes(neighbor) && neighbor.isPath,
      )
      .filter((neighbor) => {
        const scores = calcScores(node, neighbor, goal);
        if (scores.g >= neighbor.g) return false;

        Object.assign(neighbor, { ...scores, parent: node });

        return !queue.includes(neighbor);
      });

    return astar(grid)(
      [start, goal],
      [...queue, ...neighbors] as Grid,
      seen,
    );
  };
