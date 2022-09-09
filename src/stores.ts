import { BehaviorSubject } from 'rxjs';

export const cart = new BehaviorSubject(new Set<string>([]));
