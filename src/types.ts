export type NonEmptyArray<T> = [T, ...T[]];

export type Grid = NonEmptyArray<Node>

export type NodeType = 'start' | 'end' | 'path' | 'wall'

export type Node = {
  f: number
  g: number
  h: number
  x: number
  y: number
  px: number
  py: number
  coords: [number, number]
  seen: boolean
  isPath: boolean
  color: number
  parent: Node | null
}
