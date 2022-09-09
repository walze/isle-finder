import type { AnyFunction } from 'ramda';
import {
  map,
  mergeMap,
  Observable,
  tap,
  type OperatorFunction,
} from 'rxjs';
import type { Grid, NonEmptyArray } from './types';

export const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

export const range = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );

class AssertionError extends Error {
  constructor(value: unknown, message?: string) {
    super(message, {
      cause: value,
    });

    this.name = 'AssertionError';

    console.error(message || 'Uncaught assertion', '=>', value);
  }
}

type Assert = <T>(value: T, message?: string) => asserts value;

export const assert: Assert = (value, text) => {
  if (!value) throw new AssertionError(value, text);
};

export const assert$ =
  <T>(
    message?: string | Error,
  ): OperatorFunction<T, NonNullable<T>> =>
  (o) =>
    // @ts-ignore
    o.pipe(tap((t) => assert(t, message)));

export const parse = <T extends Record<string, unknown>>(
  csv: string,
) => {
  const lines = csv.split('\n') as NonEmptyArray<string>;
  const headers = lines[0].split(',');

  const data = lines.slice(1).map((line) => {
    const values = line.split(',');

    return headers.reduce(
      (obj, header, i) =>
        Object.assign(obj, {
          [header.trim()]: values[i]?.trim(),
        }),
      {} as T,
    );
  });

  return data;
};

export const mergeCombine =
  <A>(a: Observable<A>) =>
  <B>(b: Observable<B>) =>
    a.pipe(mergeMap((x) => b.pipe(map((y) => pair(x, y)))));

export const tapLog = <T>(m: keyof Console = 'log') =>
  // eslint-disable-next-line no-console
  tap<T>(console[m] as AnyFunction);

export const foldGrid = (o: Observable<((g: Grid) => Grid)[]>) =>
  o.pipe(
    map((fs) => (g: Grid) => fs.reduce((gg, f) => f(gg), g)),
  );
