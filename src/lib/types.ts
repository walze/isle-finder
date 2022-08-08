import { type Text } from 'pixi.js';
import { BehaviorSubject } from 'rxjs';

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
export type Grid$ = BehaviorSubject<Grid>;

export type NodeType = 'start' | 'end' | 'path' | 'wall';

export type CSVRecord = {
  itemDescription: string;
  Date: string;
  Member_number: string;
};

export type Product = {
  index: number;
  name: string;
  price: number;
};
