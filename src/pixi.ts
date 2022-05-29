import {Graphics} from 'pixi.js'
import {from, identity, mergeMap} from 'rxjs'
import {screenW, screenH, grid, cellW, cellH, nodeColors, gridGet} from './grid'
import {Node, NodeType} from './types'

export const startPixi = (view: HTMLCanvasElement) => import('pixi.js')
  .then(({Application, Graphics}) => {
    const gfx = new Graphics()
    const app = new Application({
      view,
      width: screenW,
      height: screenH,
    })

    app.stage.addChild(gfx)

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
  gfx.drawRect(x + 0.5, y + 0.5, cellW - 1, cellH - 1)
  gfx.endFill()
}

