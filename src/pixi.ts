import {Application, Graphics} from 'pixi.js'
import {fromEvent, map, Observable, pipe, switchMap} from 'rxjs'
import {screenW, screenH, grid, cellW, cellH, gridGet, nodeColors, calcPath, startNode, endNode} from './grid'
import {pair} from './helpers'
import {Node} from './types'

const ticker$ = (app: Application) => new Observable<number>(subscriber => {
  const {ticker} = app

  ticker.deltaMS = 1000 / 60
  ticker.maxFPS = 60
  ticker.minFPS = 24

  ticker.add(delta => subscriber.next(delta))
})

const nodeFromClick = pipe(
  map(({offsetX, offsetY}: MouseEvent) => pair(
    Math.floor(offsetX / cellW),
    Math.floor(offsetY / cellH),
  )),
  map(gridGet(grid)),
)

const calcPath$ = calcPath(pair(startNode, endNode))

export const startPixi = (view: HTMLCanvasElement) =>
  import('pixi.js')
    .then(({Application, Graphics}) => {
      const gfx = new Graphics()
      const click$ = fromEvent<MouseEvent>(view, 'click')
      const app = new Application({
        view,
        width: screenW,
        height: screenH,
        backgroundColor: 0xeeeeee,
      })

      app.stage.addChild(gfx)

      click$
        .pipe(nodeFromClick)
        .subscribe(n => {
          n.color = nodeColors.wall
          n.isPath = false
        })

      click$
        .pipe(
          switchMap(() => calcPath$),
        )
        .subscribe()

      ticker$(app).subscribe(_ => {
        grid.map(drawNode(gfx))
      })
    })

const drawNode = (gfx: Graphics) => ({x, y, color}: Node) => {
  gfx.beginFill(color)
  const padding = 0.5
  gfx.drawRect(x + padding, y + padding, cellW - (padding * 2), cellH - (padding * 2))
  gfx.endFill()
}

