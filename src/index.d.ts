export type NonEmptyArray<T> = [T, ...T[]];

export type Grid = NonEmptyArray<NonEmptyArray<Node>>

export type Node = {
  f: number
  g: number
  h: number
  x: number
  y: number
  path: boolean
  parent: Node | null
}
