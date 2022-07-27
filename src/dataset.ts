import { parse } from './lib/helpers';
import type { CSVRecord, Product } from './lib/types';

export const getData = () => {
  const cache = localStorage.getItem('data');
  if (cache) return JSON.parse(cache) as Product[];

  const path = '../dataset.csv?raw';
  return import(path)
    .then((m) => m.default)
    .then((data) =>
      parse<CSVRecord>(data).map((r, index) => ({
        price: +(+r.Member_number / 1000).toFixed(2),
        name: r.itemDescription,
        index,
      })),
    )
    .then((d) =>
      [...new Set(d.map((r) => r.name))].map((name, i) => ({
        name,
        index: i,
        price: d[i]?.price || NaN,
      })),
    )
    .then((d) => {
      localStorage.setItem('data', JSON.stringify(d));
      return d;
    });
};
