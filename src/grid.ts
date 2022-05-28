import assert from 'assert'
import {Grid, Node} from './types'

export const nodeColors = {
  start: 0x00ff00,
  end: 0xff0000,
  path: 0xFFFFFF,
  wall: 0,
}

export const screenW = 800
export const screenH = 800

export const [gridW, gridH] = [5, 5]
export const [cellW, cellH] = [screenW / gridW, screenH / gridH]

export const makeNode = (x: number, y: number) => ({
  px: x,
  py: y,
  x: x * cellW,
  y: y * cellH,
  f: Number.MAX_SAFE_INTEGER,
  g: Number.MAX_SAFE_INTEGER,
  h: Number.MAX_SAFE_INTEGER,
  parent: null,
  type: 'path',
})

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
  = ([x, y]: [number, number]) =>
    (grid: Grid): Node => {
      const gx = grid[x]
      assert(gx, 'cannot get grid x ' + x)
      const node = gx[y]
      assert(node, 'cannot get grid y ' + y)

      return node
    }

// Random start and end points
const [start, end] = [
  gridGet([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
  gridGet([Math.floor(Math.random() * gridW), Math.floor(Math.random() * gridH)]),
]

export const startNode = start(grid)
export const endNode = end(grid)

startNode.type = 'start'
endNode.type = 'end'
