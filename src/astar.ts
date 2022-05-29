
import {Node, Grid} from './types'

const heuristic = (a: Node, b: Node) => Math.sqrt(((a.x - b.x) ** 2) + ((a.y - b.y) ** 2))

export const getNeighbors = (n: Node) => (g: Grid) => {
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

    const neighbors = getNeighbors(grid[current.py]![current.px]!)

    for (const neighbor of neighbors(grid)) {
      if (closedSet.has(neighbor) || !neighbor.path)
        continue

      const gScore = current.g + 1

      if (gScore < neighbor.g || !openSet.has(neighbor)) {
        // Camefrom
        neighbor.parent = current
        neighbor.g = gScore
        neighbor.h = heuristic(neighbor, end)
        neighbor.f = neighbor.g + neighbor.h

        if (!openSet.has(neighbor))
          openSet.add(neighbor)
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

