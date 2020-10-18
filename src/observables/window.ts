import { fromEvent, empty } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export const window$ = !process.browser
  ? empty()
  : fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => [window.innerWidth, window.innerHeight] as [number, number])
    );

export const listen = (eventName: string) =>
  !process.browser ? empty() : fromEvent(window, eventName);
