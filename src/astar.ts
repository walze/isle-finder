
import {gridGet, gridH, gridW} from './grid'
import {Node, Grid} from './types'

export const pythagoras = (a: number, b: number) =>
  Math.sqrt((a ** 2) + (b ** 2))

export const manhathan = (a: number, b: number) =>
  Math.abs(a) + Math.abs(b)

export const getNeighbors = (grid: Grid) => (n: Node) => {
  const [px, py] = n.coords
  const neighbors: Node[] = []
  const getNode = gridGet(grid)

  // Get neighboors including diagonal
  if (px > 0)
    neighbors.push(getNode([px - 1, py]))
  if (px < gridW - 1)
    neighbors.push(getNode([px + 1, py]))
  if (py > 0)
    neighbors.push(getNode([px, py - 1]))
  if (py < gridH - 1)
    neighbors.push(getNode([px, py + 1]))

  return neighbors
}

export const astar
  = (grid: Grid) =>
    (
      [start, end]: [Node, Node],
      queue = new Set<Node>([start]),
    ): Node[] => {
      const current = [...queue].reduce((a, b) => a.f < b.f ? a : b)
      if (current === end) return reconstructPath(current)

      queue.delete(current)
      current.seen = true

      getNeighbors(grid)(current)
        .filter(({seen, path}) => !seen && path)
        .forEach(neighbor => {
          const newScore = calcScores(current.g, neighbor, end)

          if (!queue.has(neighbor) || newScore.f < neighbor.f) {
            updateNode(neighbor)({...newScore, current})

            queue.add(neighbor)
          }
        })

      return astar(grid)([start, end], queue)
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

function calcScores(oldG: number, n1: Node, n2: Node) {
  const g = oldG + 1
  const h = pythagoras(n1.x - n2.x, n1.y - n2.y)
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

