import { pair } from 'ramda';
import {
  from,
  range,
  mergeMap,
  map,
  identity,
  tap,
  toArray,
  filter,
} from 'rxjs';
import { getData } from '../dataset';
import { cart } from '../stores';
import { grid, gridGet, nodeColors } from './grid';
import { islesX, height, islesY } from './isles';

const getNode = gridGet(grid.getValue());

export const slots$ = from([
  ...islesX,
  ...islesX.map((n) => n + 2),
]).pipe(
  mergeMap((x) =>
    from(islesY).pipe(
      mergeMap((y) => range(y + 1, height - 2)),
      map(pair(x)),
      map(getNode),
    ),
  ),
  mergeMap((node, i) =>
    getData().pipe(
      mergeMap(identity),
      filter((_, i2) => i === i2),
      map(pair(node)),
    ),
  ),
);

cart
  .pipe(
    mergeMap((c) =>
      slots$.pipe(
        tap(([node, product]) => {
          if (c.has(product.name)) {
            node.color = nodeColors.inCart;
          } else {
            node.color = nodeColors.slot;
          }
        }),
        toArray(),
      ),
    ),
  )
  .subscribe();

console.table({ islesX, islesY, height, slots$ });
