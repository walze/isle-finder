import {Graphics, Ticker} from 'pixi.js'
import {concatMap, delay, from, fromEvent, identity, map, mergeMap, Observable, of, tap} from 'rxjs'
import {screenW, screenH, grid, cellW, cellH, gridGet, nodeColors, calcPath, startNode, endNode, bestPath} from './grid'
import {pair} from './helpers'
import {Node} from './types'

const ticker$ = new Observable<number>(subscriber => {
  const ticker = Ticker.shared
  ticker.maxFPS = 10

  ticker.add(delta => subscriber.next(delta))
})

export const startPixi = (view: HTMLCanvasElement) => import('pixi.js')
  .then(({Application, Graphics}) => {
    const gfx = new Graphics()
    const app = new Application({
      view,
      width: screenW,
      height: screenH,
      backgroundColor: 0xeeeeee,
    })

    app.stage.addChild(gfx)

    fromEvent<MouseEvent>(view, 'click')
      .pipe(
        map(({offsetX, offsetY}) => [
          Math.floor(offsetX / cellW),
          Math.floor(offsetY / cellH),
        ] as [number, number]),
        map(gridGet(grid)),
      ).subscribe(n => {
        n.color = nodeColors.wall
        n.path = false

        calcPath(pair(startNode, endNode))
          .pipe(
            mergeMap(identity),
            concatMap(n => of(n).pipe(delay(1000 / 50))),
            tap(node => {
              if (node.color !== nodeColors.end && node.color !== nodeColors.start)
                node.color = 0x0000ff
            }),
          )
          .subscribe()
      })

    ticker$.subscribe(d => {
      console.log(d, Ticker.shared.FPS)

      from(grid)
        .pipe(
          mergeMap(identity),
        )
        .subscribe(
          drawNode(gfx),
        )
    })
  })

const drawNode = (gfx: Graphics) => ({x, y, color}: Node) => {
  gfx.beginFill(color)
  const padding = 0.5
  gfx.drawRect(x + padding, y + padding, cellW - (padding * 2), cellH - (padding * 2))
  gfx.endFill()
}

