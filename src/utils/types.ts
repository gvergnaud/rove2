export type Extend<A, B> = Pick<A, Exclude<keyof A, keyof B>> & B;

export type ObjectOf<T> = { [k: string]: T };
