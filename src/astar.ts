
import {Node, Grid} from './types'

const heuristic = (a: number, b: number) =>
  Math.sqrt((a ** 2) + (b ** 2))

export const getNeighbors = (g: Grid) => (n: Node) => {
  const {px, py} = n
  const neighbors: Node[] = []

  if (px > 0) neighbors.push(g[py]![px - 1]!)
  if (px < g[py]!.length - 1) neighbors.push(g[py]![px + 1]!)
  if (py > 0) neighbors.push(g[py - 1]![px]!)
  if (py < g[py]!.length - 1) neighbors.push(g[py + 1]![px]!)

  return neighbors
}

// Astar using Sets
export const astar = (grid: Grid) => ([start, end]: [Node, Node]): Node[] => {
  const openSet = new Set<Node>([start])
  const closedSet = new Set<Node>()

  while (openSet.size) {
    const current = [...openSet].reduce((a, b) => a.f < b.f ? a : b)
    if (current === end) return reconstructPath(current)

    openSet.delete(current)
    closedSet.add(current)

    getNeighbors(grid)(grid[current.py]![current.px]!)
      .forEach(neighbor => {
        if (closedSet.has(neighbor) || !neighbor.path) return

        const scores = newScores(current.g, neighbor, end)

        if (!openSet.has(neighbor) || scores.f < neighbor.f) {
          updateNode(neighbor)({...scores, current})

          openSet.add(neighbor)
        }
      })
  }

  return []
}

export const updateNode
= (node: Node) =>
  (
    update: {
    f: number,
    g: number,
    h: number,
    current: Node
  },
  ) => {
    const {current, f, g, h} = update

    node.f = f
    node.g = g
    node.h = h
    node.parent = current

    return node
  }

function newScores(oldG: number, neighbor: Node, end: Node) {
  const g = oldG + 1
  const h = heuristic(neighbor.x - end.x, neighbor.y - end.y)
  const f = g + h

  return {f, g, h}
}

function reconstructPath(current: Node): Node[] {
  const path: Node[] = []
  let node = current

  while (node.parent) {
    path.push(node)
    node = node.parent!
  }

  return path
}

