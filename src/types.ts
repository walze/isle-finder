import { type Text } from "pixi.js";

export type Node = {
  f: number;
  g: number;
  h: number;
  x: number;
  y: number;
  px: number;
  py: number;
  coords: [number, number];
  isPath: boolean;
  color: number;
  parent: Node | null;
  text: Text | null;
};

export type NonEmptyArray<T> = [T, ...T[]];

export type Grid = NonEmptyArray<Node>;

export type NodeType = "start" | "end" | "path" | "wall";
