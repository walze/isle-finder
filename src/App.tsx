import React, {FC, useRef, useEffect} from 'react'

export const App: FC = () => {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const current = ref.current
    if (!current) return

      import('./pixi').then(({startPixi}) =>
        startPixi(current)
      )
  }, [ref.current])

  return <canvas id='canvas' ref={ref} onLoad={() => console.warn(123)} />
}
