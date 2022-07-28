import { pair } from 'ramda';
import { from, range, mergeMap, map, identity, tap } from 'rxjs';
import { getData } from '../dataset';
import { grid, gridGet, nodeColors } from './grid';
import { islesX, height, islesY } from './isles';

const getNode = gridGet(grid);

const slots$ = from([...islesX, ...islesX.map((n) => n + 2)])
  .pipe(
    mergeMap((x) =>
      from(islesY).pipe(
        mergeMap((y) => range(y + 1, height - 2)),
        map(pair(x)),
        map(getNode),
      ),
    ),
    mergeMap((node) =>
      getData().pipe(mergeMap(identity), map(pair(node))),
    ),
    tap(([node]) => {
      node.color = nodeColors.slot;
    }),
  )
  .subscribe();

console.table({ islesX, islesY, height, slots$ });
