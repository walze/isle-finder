import React from 'react'
import {createRoot} from 'react-dom/client'

import {Application} from 'pixi.js'
import { FC } from 'react'

const pixi = new Application({
  forceCanvas: true
})

const $root = document.getElementById('root')
if (!$root) throw 'no root'

const root = createRoot($root)

const App: FC = () => {

  return (<>
    <canvas id='canvas' />
    bruh3
  </>)
}

root.render(<App />)

