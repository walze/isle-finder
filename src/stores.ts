import { BehaviorSubject } from 'rxjs';
import type { Node } from './lib/types';

export const bestPath$ = new BehaviorSubject<Node[]>([]);

export const cart = new BehaviorSubject(new Set<string>([]));
