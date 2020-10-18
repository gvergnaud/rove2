import { Observable, combineLatest } from 'rxjs';

export const all = (...obs) => combineLatest(...obs, (...values) => values);

export const afterDebounce = (ms, mapper) => x =>
  new Observable(observer => {
    observer.next(x);
    const timeout = setTimeout(() => observer.next(mapper(x)), ms);
    return {
      unsubscribe: () => {
        clearTimeout(timeout);
      }
    };
  });
