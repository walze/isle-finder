import React, { useEffect, useRef } from 'react'
import {createRoot} from 'react-dom/client'

import {Application} from 'pixi.js'
import { FC } from 'react'



const $root = document.getElementById('root')
if (!$root) throw 'no root'

const root = createRoot($root)

const App: FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if(!ref.current) return

    const pixi = new Application({
      view: ref.current,
    })

    console.log(1,pixi, ref.current)
  }, [])


  return (<>
    <canvas id='canvas' ref={ref} />
  </>)
}

root.render(<App />)

