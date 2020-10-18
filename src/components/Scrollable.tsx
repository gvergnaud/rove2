import React from 'react';
import { useWindowSize } from '../hooks/useWindowSize';
import {
  useScroller,
  ScrollContext,
  scrollTo,
  scrollToPercent
} from '../hooks/useScroller';
import { useRaf } from '../hooks/useRaf';
import useAppState from '../hooks/useAppState';
import { css } from 'emotion';
import { cn } from '../utils/css';
import { dragEvents, getEventPosition } from '../utils/dom';
import { mqSmall } from '../style/variables';

const min = (a: number, b: number) => (a > b ? b : a);

const scrollbarHeightPercent = 0.15;

const Scrollable = ({ children, pageId, initialScrollY }) => {
  const [state] = useAppState();
  const [width, height] = useWindowSize();
  const scrollbarRef = React.useRef<HTMLDivElement>(null);
  const elRef = React.useRef(null);
  const maxHeightRef = React.useRef(0);
  const listenersRef = React.useRef([]);

  const scrollRef = useScroller(initialScrollY, maxHeightRef, pageId);

  React.useEffect(() => {
    maxHeightRef.current = elRef.current.offsetHeight - height;
  }, [width, height, pageId, state.isReady]);

  // the time index is when you want the listener to be called.
  // we use it in the renderer to ensure the painting is done after
  // the position of elements are updated
  const onScroll = React.useCallback((listener, timeIndex = 0) => {
    listenersRef.current.push([listener, timeIndex]);
    listenersRef.current.sort((a, b) => a[1] - b[1]);
    return () => {
      listenersRef.current = listenersRef.current.filter(
        ([l]) => l !== listener
      );
    };
  }, []);

  useRaf(() => {
    const { scrollY, scrollYDelta } = scrollRef.current;

    if (elRef.current)
      elRef.current.style.transform = `translate3d(0, ${-min(
        maxHeightRef.current,
        scrollY
      )}px, 0)`;

    if (scrollbarRef.current) {
      scrollbarRef.current.classList.toggle(
        'hidden',
        maxHeightRef.current <= window.innerHeight ||
          Math.abs(scrollYDelta) <= 1
      );
      scrollbarRef.current.style.transform = `translate3d(0, ${
        (scrollY / maxHeightRef.current) *
          (window.innerHeight * (1 - scrollbarHeightPercent) -
            4) /* top + bottom scrollbar margin */
      }px, 0)`;
    }

    for (const [listener] of listenersRef.current)
      listener(scrollY, scrollYDelta);
  });

  return (
    <ScrollContext.Provider value={onScroll}>
      <div
        {...dragEvents({
          onDrag: e => {
            const { y } = getEventPosition(e);
            scrollToPercent(y / window.innerHeight);
          }
        })}
        className={css`
          position: absolute;
          top: 0;
          right: 0;
          width: 7px;
          height: 100vh;
          z-index: 1;

          transition: transform 0.25s ease;

          ${mqSmall(css`
            width: 6px;
          `)}

          &:hover .scrollbar.hidden {
            transition-delay: 0s;
            opacity: 1;
          }
        `}
      >
        <div
          ref={scrollbarRef}
          className={cn(
            'scrollbar',
            'hidden',
            css`
              position: absolute;
              top: 2px;
              right: 2px;
              height: ${scrollbarHeightPercent * 100}vh;
              width: 100%;
              border-radius: 4px;
              background-color: rgba(64, 64, 64, 0.5);
              opacity: 1;
              transition: opacity 0.3s ease;

              &.hidden:not(:hover) {
                transition-delay: 0.5s;
                opacity: 0;
              }
            `
          )}
        />
      </div>
      {children(elRef)}
    </ScrollContext.Provider>
  );
};

export default Scrollable;
