import { BehaviorSubject } from 'rxjs';
import type { Node, Product } from './lib/types';

export const bestPath$ = new BehaviorSubject<Node[]>([]);

export const cart$ = new BehaviorSubject<Map<string, Product>>(
  new Map(),
);
