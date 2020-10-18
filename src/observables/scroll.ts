import { fromEvent, from, Observable, empty } from 'rxjs';
import { map, flatMap, switchMap, delay } from 'rxjs/operators';
import { afterDebounce } from '../utils/observables';
import ease from 'rx-ease';
import { between } from '../utils/numbers';

export const scroll$ = (process.browser
  ? from(import('../frontend-deps'))
  : empty()
).pipe(
  flatMap(
    ({ VirtualScroll }) =>
      new Observable(observer => {
        const virtualScroll = new VirtualScroll({
          touchMultiplier: 4,
          mouseMultiplier: 0.65,
          firefoxMultiplier: 56,
          passive: true
        });
        const onScroll = scroll => observer.next(scroll);
        virtualScroll.on(onScroll);
        return {
          unsubscribe: () => virtualScroll.off(onScroll)
        };
      })
  )
);

export const wheelDelta$ = process.browser
  ? fromEvent<MouseWheelEvent>(window, 'wheel', { passive: true }).pipe(
      map(e => ({
        deltaX: between(-100, 100, e.deltaX),
        deltaY: between(-100, 100, e.deltaY)
      })),
      delay(64),
      switchMap(
        afterDebounce(32, () => ({
          deltaX: 0,
          deltaY: 0
        }))
      ),
      ease({
        deltaX: [120, 50],
        deltaY: [120, 50]
      })
    )
  : empty();
