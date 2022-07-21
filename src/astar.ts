import { getNeighbors } from "./grid";
import { Node, Grid } from "./types";

export const pythagoras = (a: number, b: number) => Math.sqrt(a ** 2 + b ** 2);

export const manhattan = (a: number, b: number) => Math.abs(a) + Math.abs(b);

export const calcScores = (og: number, n1: Node, n2: Node) => {
  const g = og + pythagoras(n1.px - n2.px, n1.py - n2.py);
  const h = pythagoras(n1.px - n2.px, n1.py - n2.py);
  const f = g + h;

  return { f, g, h };
};

const reconstructPath = (node: Node, path = [] as Node[]): Node[] =>
  !node.parent ? path : reconstructPath(node.parent, [...path, node]);

type Astar = (
  grid: Grid
) => (path: [Node, Node], queue?: Grid, seen?: Node[]) => Node[];

export const astar: Astar =
  (grid) =>
  ([start, goal], q = [start], s = []) => {
    const [node, ...queue] = q.sort((a, b) => a.f - b.f);
    const seen = [...s, node];

    if (node === goal) return reconstructPath(node);

    const neighbors = getNeighbors(grid)(node)
      .filter((neighbor) => !seen.includes(neighbor) && neighbor.isPath)
      .filter((neighbor) => {
        const scores = calcScores(node.g, neighbor, goal);
        if (scores.g >= neighbor.g) return false;

        Object.assign(neighbor, { ...scores, parent: node });

        return !queue.includes(neighbor);
      });

    return astar(grid)([start, goal], [...queue, ...neighbors] as Grid, seen);
  };
