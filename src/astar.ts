
import {catchError, filter, from, map, mergeMap, Observable, of, tap, toArray} from 'rxjs'
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

export const astarr
  = (grid: Grid) =>
    ([start, end]: [Node, Node], queue: Grid = [start]): Observable<Node[]> =>
      of(queue.sort((a, b) => a.f - b.f))
        .pipe(
          tap(([current]) => {
            current.seen = true
            if (current === end)
              throw current
          }),
          mergeMap(([current, ...q]) =>
            from(getNeighbors(grid)(current))
              .pipe(
                filter(({seen, isPath}: Node) => !seen && isPath),
                filter(n => {
                  const newScore = calcScores(current.g, n, end)
                  updateNode(n)({...newScore, parent: current})

                  return !q.includes(n) || newScore.f < n.f
                }),
                toArray(),
                map(nodes => [...nodes, ...q]),
              ),
          ),
          mergeMap(q => astarr(grid)([start, end], q as Grid)),
          catchError(c => of(reconstructPath(c))),
        )

export const astar
  = (grid: Grid) =>
    ([start, end]: [Node, Node], queue: Grid = [start]): Node[] => {
      const [current, ...newQueue] = queue.sort((a, b) => a.f - b.f)
      current.seen = true
      if (current === end) return reconstructPath(current)

      const candidates = getNeighbors(grid)(current)
        .filter(({seen, isPath}) => !seen && isPath)
        .filter(n => {
          const newScore = calcScores(current.g, n, end)
          updateNode(n)({...newScore, parent: current})

          return !newQueue.includes(n) || newScore.f < n.f
        })

      return astar(grid)([start, end], [...newQueue, ...candidates] as Grid)
    }

export const updateNode
= (node: Node) =>
  (
    update: {
    f: number,
    g: number,
    h: number,
    parent: Node
  },
  ) => {
    const {parent, f, g, h} = update

    node.f = f
    node.g = g
    node.h = h
    node.parent = parent

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

