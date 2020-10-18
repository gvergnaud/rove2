import { from, Observable, combineLatest, Subject } from 'rxjs';
import ease from 'rx-ease';
import { switchMap, startWith } from 'rxjs/operators';
import React from 'react';
import { between } from '../utils/numbers';
import { window$ } from '../observables/window';
import { spring } from '../utils/animations';

// eslint-disable-next-line no-unused-vars
export const ScrollContext = React.createContext(
  (
    _onScroll: (_scrollY: number, _deltaY: number) => void,
    _timeIndex?: number
  ) => () => {}
);

type ScrollToUpdate =
  | { type: 'delta'; y: number }
  | { type: 'percent'; percent: number };

const scrollToUpdate$ = new Subject<ScrollToUpdate>();

export const scrollTo = selector => {
  const el = document.querySelector(selector);
  if (!el) return;

  const { y } = el.getBoundingClientRect();
  scrollToUpdate$.next({ type: 'delta', y: -y });
};

export const scrollToPercent = (percent: number) => {
  scrollToUpdate$.next({ type: 'percent', percent });
};

export const useScroller = (
  initialScrollY: number,
  maxHeightRef: React.MutableRefObject<number>,
  pageId: string
) => {
  const scrollRef = React.useRef({
    scrollY: initialScrollY,
    scrollYDelta: 0
  });

  React.useEffect(() => {
    if (!process.browser) return;
    scrollRef.current.scrollYDelta = 0;
    scrollRef.current.scrollY = initialScrollY;

    const scrollY$ = combineLatest(
      from(import('../frontend-deps')).pipe(
        switchMap(
          ({ VirtualScroll }) =>
            new Observable(observer => {
              let scrollY = initialScrollY;

              const scanScrollY = (scrollY: number, deltaY: number) =>
                between(0, maxHeightRef.current, scrollY - deltaY);

              const onDeltaY = (deltaY: number) => {
                scrollY = scanScrollY(scrollY, deltaY);
                observer.next(scrollY);
              };

              const onPercent = (percent: number) => {
                scrollY = maxHeightRef.current * between(0, 1, percent);
                observer.next(scrollY);
              };

              const virtualScroll = new VirtualScroll({
                touchMultiplier: 2.5,
                mouseMultiplier: 1.5,
                firefoxMultiplier: 64,
                passive: false,
                preventTouch: true
              });
              const onScroll = (scroll: { deltaY: number }) => {
                onDeltaY(between(-150, 150, scroll.deltaY));
              };

              const sub = scrollToUpdate$.subscribe({
                next: update => {
                  if (update.type === 'delta') onDeltaY(update.y);
                  if (update.type === 'percent') onPercent(update.percent);
                }
              });
              virtualScroll.on(onScroll);
              return {
                unsubscribe: () => {
                  sub.unsubscribe();
                  virtualScroll.off(onScroll);
                }
              };
            })
        ),
        startWith(initialScrollY)
      ),
      window$,
      x => x
    );

    const sub = scrollY$.pipe(ease(100, 26)).subscribe((scrollY: number) => {
      scrollRef.current.scrollYDelta = scrollRef.current.scrollY - scrollY;
      scrollRef.current.scrollY = scrollY;
    });

    return () => sub.unsubscribe();
  }, [pageId, initialScrollY]);

  return scrollRef;
};

export const useScrollYRef = () => {
  const scrollYRef = React.useRef(0);
  const onScroll = React.useContext(ScrollContext);

  React.useEffect(() => {
    return onScroll(y => {
      scrollYRef.current = -y;
    });
  }, []);

  return scrollYRef;
};

export const useOnScroll = (
  f: (y: number, delta: number) => void,
  deps?: any[]
) => {
  const onScroll = React.useContext(ScrollContext);
  React.useEffect(() => {
    return onScroll(f);
  }, deps);
};

export function useScrollYDeltaRef() {
  const onScroll = React.useContext(ScrollContext);
  const deltaRef = React.useRef(0);

  const onScrollDelta = React.useMemo(
    () =>
      spring(
        deltaY => {
          deltaRef.current = deltaY;
        },
        { stiffness: 150, damping: 18 }
      ),
    [deltaRef]
  );

  React.useEffect(() => {
    return onScroll((y, deltaY) => onScrollDelta(deltaY));
  }, [onScroll]);
  return deltaRef;
}
