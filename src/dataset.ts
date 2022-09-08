import { from, map, of } from 'rxjs';
import { parse } from './lib/helpers';
import type { CSVRecord, Product } from './lib/types';

let imp: Promise<string>;

export const getData = () => {
  const cache = localStorage.getItem('data');
  if (cache) return of(JSON.parse(cache) as Product[]);

  imp = imp || fetch('/dataset.csv').then((r) => r.text());

  return from(imp).pipe(
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
