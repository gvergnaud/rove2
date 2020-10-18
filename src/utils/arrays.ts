export const getRandomItem = xs => xs[Math.floor(Math.random() * xs.length)];

export const last = xs => xs[xs.length - 1];
export const dropRight = (xs, n) => xs.slice(0, xs.length - n);

export const flatMap = (xs, f) => xs.reduce((acc, x) => acc.concat(f(x)), []);

export const range = (start: number, end: number, step: number) =>
  Array(Math.ceil((end - start) / step))
    .fill(0)
    .map((_, i) => start + i * step);

export const allEqual = <T>(xs: T[], ys: T[]) =>
  xs.length === ys.length && xs.every((x, i) => x === ys[i]);
