import {Graphics} from 'pixi.js'
import {from, fromEvent, identity, map, mergeMap} from 'rxjs'
import {screenW, screenH, grid, cellW, cellH, gridGet, nodeColors, calcPath} from './grid'
import {Node} from './types'

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

        calcPath()
      })

    app.ticker.speed = 5
    app.ticker.add(_ => {
      from(grid)
        .pipe(
          mergeMap(identity),
        )
        .subscribe(node => {
          drawNode(gfx, node)
        })
    })
  })

const drawNode = (gfx: Graphics, {x, y, color}: Node) => {
  gfx.beginFill(color)
  const padding = 0.5
  gfx.drawRect(x + padding, y + padding, cellW - (padding * 2), cellH - (padding * 2))
  gfx.endFill()
}

