import assert from 'assert'
import {BehaviorSubject, identity, mergeMap, of, tap} from 'rxjs'
import {astarr} from './astar'
import {pair} from './helpers'
import {Grid, Node} from './types'

export const nodeColors = {
  start: 0x00ff00,
  end: 0xff0000,
  path: 0xFFFFFF,
  wall: 0,
}

export const screenW = 800
export const screenH = 800

export const [gridW, gridH] = [75, 75]
export const [cellW, cellH] = [screenW / gridW, screenH / gridH]

export const makeNode = (coords: [number, number]): Node => {
  const r = Math.random() > 1 / 4
  const [x, y] = coords

  return {
    px: x,
    py: y,
    x: x * cellW,
    y: y * cellH,
    coords,
    f: 0,
    g: 0,
    h: 0,
    parent: null,
    isPath: r,
    seen: false,
    color: r ? nodeColors.path : nodeColors.wall,
  }
}

export const grid = [] as unknown as Grid

for (let x = 0; x < gridW; x++)
  for (let y = 0; y < gridH; y++)
    grid[(x * gridW) + y] = makeNode([x, y])

export const gridSet
  = ([x, y]: [number, number], value: Node) =>
    (grid: Grid): void => {
      assert(grid[(x * gridW) + y], `cannot get node at ${x}, ${y}`)

      grid[(x * gridW) + y] = value
    }

export const gridGet
  = (grid: Grid) =>
    ([x, y]: [number, number]): Node => {
      assert(grid[(x * gridW) + y], `cannot get node at ${x}, ${y}`)

      return grid[(x * gridW) + y] as Node
    }

// Random start and end points
export const [startNode, endNode] = [
  gridGet(grid)([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
  gridGet(grid)([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
]

startNode.color = nodeColors.start
endNode.color = nodeColors.end
startNode.isPath = true
endNode.isPath = true

export const bestPath = new BehaviorSubject<Node[]>([])

export const calcPath = ([n1, n2]: [Node, Node]) => of(pair(n1, n2))
  .pipe(
    tap(() => {
      grid.forEach(n => {
        n.seen = false
      })

      bestPath.getValue().forEach(node => {
        node.color = node.isPath ? nodeColors.path : nodeColors.wall
      })
    }),
    mergeMap(coords => astarr(grid)(coords)),
    tap(nodes => bestPath.next(nodes)),
    mergeMap(identity),
    tap(node => {
      if (node.color !== nodeColors.end && node.color !== nodeColors.start)
        node.color = 0x0000ff
    }),
  )
