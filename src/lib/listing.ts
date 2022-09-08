import { pair } from 'ramda';
import {
  from,
  range,
  mergeMap,
  map,
  mergeAll,
  zipWith,
  toArray,
} from 'rxjs';
import { getData } from '../dataset';
import { cart } from '../stores';
import { gridSet, nodeColors } from './grid';
import { islesX, height, islesY } from './isles';

export const slots$ = getData().pipe(
  mergeAll(),
  map((p) => p.name),
  zipWith(
    from([...islesX, ...islesX.map((n) => n + 2)]).pipe(
      mergeMap((x) =>
        from(islesY).pipe(
          mergeMap((y) => range(y + 1, height - 2)),
          map(pair(x)),
        ),
      ),
    ),
  ),
);

export const drawSlots = cart.pipe(
  mergeMap((c) =>
    slots$.pipe(
      map(([name, ps]) =>
        gridSet(ps, {
          color: c.has(name)
            ? nodeColors.inCart
            : nodeColors.slot,
          isPath: c.has(name),
        }),
      ),
      toArray(),
    ),
  ),
);

console.table({ islesX, islesY, height, slots$ });
