import { getNeighbors } from "./grid";
import { Node, Grid } from "./types";

export const pythagoras = (a: number, b: number) => Math.sqrt(a ** 2 + b ** 2);

export const manhattan = (a: number, b: number) => Math.abs(a) + Math.abs(b);

export const updateNode = (node: Node) => (update: Partial<Node>) => {
  Object.assign(node, update);

  return node;
};

export const calcScores = (oldG: number, n1: Node, n2: Node) => {
  const g = oldG + pythagoras(n1.x - n2.x, n1.y - n2.y);
  // if (g >= n1.g) return { g };
  const h = manhattan(n1.x - n2.x, n1.y - n2.y);
  const f = g + h;

  return { f, g, h };
};

const reconstructPath = (current: Node): Node[] => {
  const path: Node[] = [];
  let node = current;

  while (node.parent) {
    path.push(node);
    node = node.parent;
  }

  return path;
};

export const astar =
  (grid: Grid) =>
  ([start, end]: [Node, Node], _openSet: Grid = [start]): Node[] => {
    const [current, ...openSet] = _openSet.sort((a, b) => a.f - b.f);
    current.seen = true;
    if (current === end) return reconstructPath(current);

    const candidates = getNeighbors(grid)(current)
      .filter(({ seen, isPath }) => !seen && isPath)
      .filter((n) => {
        const scores = calcScores(current.g, n, end);
        if (scores.g >= n.g) return false;

        updateNode(n)({ ...scores, parent: current });

        return !openSet.includes(n);
      });

    return astar(grid)([start, end], [...openSet, ...candidates] as Grid);
  };
