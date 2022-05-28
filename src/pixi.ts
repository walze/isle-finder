import {Graphics} from 'pixi.js'
import {from, identity, mergeMap} from 'rxjs'
import {screenW, screenH, grid, cellW, cellH, nodeColors} from './grid'
import {NodeType} from './types'

export const startPixi = (view: HTMLCanvasElement) => import('pixi.js')
  .then(({Application, Graphics}) => {
    const gfx = new Graphics()
    const app = new Application({
      view,
      width: screenW,
      height: screenH,
    })

    from(grid)
      .pipe(
        mergeMap(identity),
      )
      .subscribe(({x, y, type}) => {
        drawNode(gfx, type, x, y)
      })

    app.stage.addChild(gfx)

    app.ticker.add(() => (1))
  })

const drawNode = (gfx: Graphics, type: NodeType, x: number, y: number) => {
  gfx.beginFill(nodeColors[type])
  gfx.drawRect(x + 1, y + 1, cellW - 2, cellH - 2)
  gfx.endFill()
}

