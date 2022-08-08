import { tap } from 'rxjs';
import type { NonEmptyArray } from './types';

export const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

export const range = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );

type Assert = <T>(
  value: T,
  message?: string | Error,
) => asserts value;

export const assert: Assert = (value, message) => {
  if (!value) {
    throw message instanceof Error
      ? message
      : new Error(message || 'Assertion failed');
  }
};

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

// eslint-disable-next-line no-console
export const taplog = tap(console.log);
