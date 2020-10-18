import { fromEvent, empty, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import ease from 'rx-ease';

const on = (event: string) =>
  process.browser ? fromEvent(window, event) : empty();

type MousePosition = [number, number];
const initMouse = (): MousePosition => [0, 0];

export const mouse$: Observable<MousePosition> = on('mousemove').pipe(
  map((e: MouseEvent) => [e.clientX, e.clientY] as MousePosition),
  startWith(initMouse()),
  ease([[100, 26], [100, 26]])
);
