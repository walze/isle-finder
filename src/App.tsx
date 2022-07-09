import React, {FC, useRef, useEffect} from 'react'
import {startPixi} from './pixi'

export const App: FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (ref.current)
      startPixi(ref.current)
  }, [ref.current])

  return <canvas id='canvas' ref={ref} />
}
