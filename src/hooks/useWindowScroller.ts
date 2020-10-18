import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { rafThrottle } from '../utils/functions';
import React from 'react';

export const useWindowScroller = () => {
  const listenersRef = React.useRef([]);
  const previousScrollYRef = React.useRef(0);

  React.useEffect(() => {
    const sub = fromEvent(window, 'scroll')
      .pipe(map(() => window.scrollY))
      .subscribe(
        rafThrottle(scrollY => {
          listenersRef.current.forEach(listener =>
            listener(scrollY, scrollY - previousScrollYRef.current)
          );
          previousScrollYRef.current = scrollY;
        })
      );
    return () => sub.unsubscribe();
  }, []);

  return listener => {
    listenersRef.current.push(listener);
    return () => {
      listenersRef.current = listenersRef.current.filter(l => l !== listener);
    };
  };
};
