export const rafThrottle = f => {
  let isFirst = true;
  let shouldExecute = true;
  let args = [];
  return (..._args) => {
    if (!shouldExecute) return;

    if (isFirst) {
      isFirst = false;
      f(..._args);
      return;
    }

    args = _args;
    shouldExecute = false;
    window.requestAnimationFrame(() => {
      shouldExecute = true;
      f(...args);
    });
  };
};

export const scan = <A, B, C>(
  reducer: (acc: A, value: B) => A,
  initialValue: A,
  f: (value: A) => C
) => {
  let acc = initialValue;
  return (x: B): C => {
    acc = reducer(acc, x);
    return f(acc);
  };
};

type Func<T extends any[], R> = (...a: T) => R;

/**
 * Composes single-argument functions from right to left. The rightmost
 * function can take multiple arguments as it provides the signature for the
 * resulting composite function.
 *
 * @param funcs The functions to compose.
 * @returns A function obtained by composing the argument functions from right
 *   to left. For example, `compose(f, g, h)` is identical to doing
 *   `(...args) => f(g(h(...args)))`.
 */
export default function compose(): <R>(a: R) => R;

export default function compose<F extends Function>(f: F): F;

/* two functions */
export default function compose<A, T extends any[], R>(
  f1: (a: A) => R,
  f2: Func<T, A>
): Func<T, R>;

/* three functions */
export default function compose<A, B, T extends any[], R>(
  f1: (b: B) => R,
  f2: (a: A) => B,
  f3: Func<T, A>
): Func<T, R>;

/* four functions */
export default function compose<A, B, C, T extends any[], R>(
  f1: (c: C) => R,
  f2: (b: B) => C,
  f3: (a: A) => B,
  f4: Func<T, A>
): Func<T, R>;

/* rest */
export default function compose<R>(
  f1: (a: any) => R,
  ...funcs: Function[]
): (...args: any[]) => R;

export default function compose<R>(...funcs: Function[]): (...args: any[]) => R;

export default function compose(...funcs: Function[]) {
  if (funcs.length === 0) {
    // infer the argument type so it is usable in inference down the line
    return <T>(arg: T) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((a, b) => (...args: any) => a(b(...args)));
}

export function applyBoth<T, A, B>(f1: (x: T) => A, f2: (x: T) => B) {
  return (x: T): [A, B] => {
    return [f1(x), f2(x)];
  };
}
