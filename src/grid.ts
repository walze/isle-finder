import assert from 'assert'
import {BehaviorSubject, map, of, tap} from 'rxjs'
import {astar} from './astar'
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

export const [gridW, gridH] = [50, 50]
export const [cellW, cellH] = [screenW / gridW, screenH / gridH]

export const makeNode = (x: number, y: number): Node => {
  const r = Math.random() > 1 / 4

  return {
    px: x,
    py: y,
    x: x * cellW,
    y: y * cellH,
    f: Number.MAX_SAFE_INTEGER,
    g: Number.MAX_SAFE_INTEGER,
    h: Number.MAX_SAFE_INTEGER,
    parent: null,
    path: r,
    color: r ? nodeColors.path : nodeColors.wall,
  }
}

export const grid
  = Array.from({length: gridH}, (_, y) =>
    Array.from({length: gridW}, (_, x) => makeNode(
      x,
      y,
    )),
  ) as Grid

export const gridSet
  = ([x, y]: [number, number], value: Node) =>
    (grid: Node[][]): void => {
      const gx = grid[x]
      assert(gx, 'cannot get grid x ' + x)
      assert(gx[y], 'cannot get grid y ' + y)

      gx[y] = value
    }

export const gridGet
  = (grid: Grid) =>
    ([y, x]: [number, number]): Node => {
      const gx = grid[x]
      assert(gx, 'cannot get grid x ' + x)
      const node = gx[y]
      assert(node, 'cannot get grid y ' + y)

      return node
    }

// Random start and end points
export const [startNode, endNode] = [
  gridGet(grid)([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
  gridGet(grid)([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
]

startNode.color = nodeColors.start
endNode.color = nodeColors.end
startNode.path = true
endNode.path = true

export const bestPath = new BehaviorSubject<Node[]>([])

export const calcPath = ([n1, n2]: [Node, Node]) => {
  bestPath.getValue().forEach(node => {
    node.color = node.path ? nodeColors.path : nodeColors.wall
  })

  return of(pair(n1, n2))
    .pipe(
      map(astar(grid)),
      tap(nodes => bestPath.next(nodes)),
    )
}
