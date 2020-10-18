/* eslint-disable no-use-before-define, no-unused-vars, @typescript-eslint/no-unused-vars */

/**
 * Option type
 * @description This type represent values that may or may not exist
 */

type OptionInterface<A> = {
  map<B>(mapper: (value: A) => B): Option<B>;
  caseOf<B>(handlers: { None: () => B; Some: (value: A) => B }): B;
  reduce<B>(reducer: (acc: B, value: A) => B, init: B): B;
  chain<B>(mapper: (value: A) => Option<B>): Option<B>;
  withDefault(defaultValue: A): A;
};

class None<A> implements OptionInterface<A> {
  readonly tag = 'None';
  map<B>(mapper: (value: A) => B): Option<B> {
    return none;
  }
  caseOf<B>(handlers: { None: () => B; Some: (value: A) => B }): B {
    return handlers.None();
  }
  reduce<B>(reducer: (acc: B, value: A) => B, init: B): B {
    return init;
  }
  chain<B>(mapper: (value: A) => Option<B>): Option<B> {
    return none;
  }
  withDefault(defaultValue: A): A {
    return defaultValue;
  }
}

class Some<A> {
  readonly tag = 'Some';
  constructor(readonly value: A) {}
  map<B>(mapper: (value: A) => B): Option<B> {
    return some(mapper(this.value));
  }
  caseOf<B>(handlers: { None: () => B; Some: (value: A) => B }): B {
    return handlers.Some(this.value);
  }
  reduce<B>(reducer: (acc: B, value: A) => B, init: B): B {
    return reducer(init, this.value);
  }
  chain<B>(mapper: (value: A) => Option<B>): Option<B> {
    return mapper(this.value);
  }
  withDefault(_defaultValue: A): A {
    return this.value;
  }
}

export type Option<A> = None<A> | Some<A>;

export const none: Option<never> = new None();

export const some = <A>(value: A): Option<A> => new Some(value);
