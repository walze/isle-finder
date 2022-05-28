import React, {useEffect, useRef} from 'react'
import {createRoot} from 'react-dom/client'

import {Application, Graphics} from 'pixi.js'
import {FC} from 'react'

const $root = document.getElementById('root')
if (!$root) throw new Error('Root element not found')

const App: FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!ref.current)
      return

    const pixi = new Application({
      view: ref.current,
      width: 800,
      height: 800,
    })

    const gfx = new Graphics()

    console.log(3, pixi, gfx, ref.current)
  }, [])

  return (<>
    <canvas id='canvas' ref={ref} />
  </>)
}

const root = createRoot($root)
root.render(<App />)
