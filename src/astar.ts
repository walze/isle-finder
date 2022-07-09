import { getNeighbors } from "./grid";
import { Node, Grid } from "./types";

export const pythagoras = (a: number, b: number) => Math.sqrt(a ** 2 + b ** 2);

export const manhattan = (a: number, b: number) => Math.abs(a) + Math.abs(b);

export const updateNode = (node: Node) => (update: Partial<Node>) => {
  Object.assign(node, update);

  return node;
};

export const calcScores = (og: number, n1: Node, n2: Node) => {
  const g = og + pythagoras(n1.px - n2.px, n1.py - n2.py);
  const h = pythagoras(n1.px - n2.px, n1.py - n2.py);
  const f = g + h;

  return { f, g, h };
};

const reconstructPath = (node: Node, path = [] as Node[]): Node[] =>
  !node.parent ? path : reconstructPath(node.parent, [...path, node]);

export const astar =
  (grid: Grid) =>
  ([start, goal]: [Node, Node], _openSet: Grid = [start]): Node[] => {
    const [node, ...openSet] = _openSet.sort((a, b) => a.f - b.f);
    node.seen = true;
    if (node === goal) return reconstructPath(node);

    const neighbors = getNeighbors(grid)(node)
      .filter(({ seen, isPath }) => !seen && isPath)
      .filter((n) => {
        const scores = calcScores(node.g, n, goal);
        if (scores.g >= n.g) return false;

        updateNode(n)({ ...scores, parent: node });

        return !openSet.includes(n);
      });

    return astar(grid)([start, goal], [...openSet, ...neighbors] as Grid);
  };
