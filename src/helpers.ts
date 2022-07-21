export const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

export const range = (start: number, stop: number, step = 1) =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);
