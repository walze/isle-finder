export const pair = <A, B>(a: A, b: B): [A, B] => [a, b];

export const range = (start: number, stop: number, step = 1) =>
  Array.from(
    { length: (stop - start) / step + 1 },
    (_, i) => start + i * step,
  );

type Assert = (
  value: any,
  message?: string | Error,
) => asserts value;

export const assert: Assert = (value, message) => {
  if (!value) {
    throw message instanceof Error
      ? message
      : new Error(message || 'Assertion failed');
  }
};
