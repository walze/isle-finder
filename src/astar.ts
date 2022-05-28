
import {Node, Grid} from './index.d'

const heuristic = (a: Node, b: Node) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y)

export const getNeighbors = (g: Grid) => (n: Node) => {
  const {x, y} = n
  const neighbors: Node[] = []

  if (x > 0) neighbors.push(g[y]![x - 1]!)
  if (x < g[y]!.length - 1) neighbors.push(g[y]![x + 1]!)
  if (y > 0) neighbors.push(g[y - 1]![x]!)
  if (y < g[y]!.length - 1) neighbors.push(g[y + 1]![x]!)

  return neighbors
}

// Astar using Sets
export const astar = (g: Grid) => ([start, end]: [Node, Node]): Node[] => {
  const openSet = new Set<Node>([start])
  const closedSet = new Set<Node>()

  while (openSet.size) {
    const current = [...openSet].reduce((a, b) => a.f < b.f ? a : b)
    if (current === end) return reconstructPath(current)
    openSet.delete(current)
    closedSet.add(current)

    for (const neighbor of getNeighbors(g)(g[current.x]![current.y]!)) {
      if (closedSet.has(neighbor) || !neighbor.path) continue

      const gScore = current.g + 1

      if (!openSet.has(neighbor) || gScore < neighbor.g) {
        neighbor.parent = current
        neighbor.g = gScore
        neighbor.h = heuristic(neighbor, end)
        neighbor.f = neighbor.g + neighbor.h
        if (!openSet.has(neighbor)) openSet.add(neighbor)
      }
    }
  }

  return []
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

