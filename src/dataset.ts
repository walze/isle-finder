import { from, map, of } from 'rxjs';
import { parse } from './lib/helpers';
import type { CSVRecord, Product } from './lib/types';

export const getData = () => {
  const cache = localStorage.getItem('data');
  if (cache) return of(JSON.parse(cache) as Product[]);

  // eslint-disable-next-line import/no-unresolved
  return from(import('../dataset.csv?raw')).pipe(
    map((m) => m.default),
    map((data) =>
      parse<CSVRecord>(data).map((r, index) => ({
        price: +(+r.Member_number / 1000).toFixed(2),
        name: r.itemDescription,
        index,
      })),
    ),
    map((d) =>
      [...new Set(d.map((r) => r.name))].map(
        (name, i) =>
          ({
            name,
            index: i,
            price: d[i]?.price || NaN,
          } as Product),
      ),
    ),
    map((d) => {
      localStorage.setItem('data', JSON.stringify(d));
      return d;
    }),
  );
};
