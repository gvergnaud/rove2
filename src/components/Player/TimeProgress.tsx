import React from 'react';
import { css } from 'emotion';
import { useRaf } from '../../hooks/useRaf';
import { val, responsive, autoGrow, mqSmall } from '../../style/variables';
import { listen } from '../../observables/window';
import { getEventPosition } from '../../utils/dom';
import { merge, Observable } from 'rxjs';

const mouseUp$ = listen('mouseup');
const touchEnd$ = listen('touchend');
const up$ = merge(mouseUp$, touchEnd$);

const mouseMove$ = listen('mousemove') as Observable<MouseEvent>;
const touchMove$ = listen('touchmove') as Observable<TouchEvent>;
const move$ = merge(mouseMove$, touchMove$);

type Props = {
  videoRef: React.RefObject<HTMLVideoElement>;
  isSeekingRef: React.MutableRefObject<boolean>;
  onSeekTo: (progress: number) => void;
};

function useSubscription<T>(
  obs: Observable<T>,
  f: (value: T) => void,
  deps?: any[]
) {
  React.useEffect(() => {
    const sub = obs.subscribe(f);
    return () => sub.unsubscribe();
  }, deps);
}

export default function TimeProgress({
  videoRef,
  isSeekingRef,
  onSeekTo
}: Props) {
  const containerRef = React.useRef<HTMLDivElement>();
  const timelineRef = React.useRef<HTMLDivElement>();

  const onSeek = React.useCallback(
    (x: number) => {
      const container = containerRef.current;
      if (!container || !isSeekingRef.current) return;
      const { left, width } = container.getBoundingClientRect();

      const progress = (x - left) / width;

      onSeekTo(progress);
    },
    [onSeekTo]
  );

  const onStopSeeking = React.useCallback(
    e => {
      onSeek(getEventPosition(e.nativeEvent).x);
    },
    [onSeek]
  );

  useRaf(() => {
    if (!videoRef.current || !timelineRef.current) return;
    const percent = videoRef.current.currentTime / videoRef.current.duration;
    timelineRef.current.style.transform = `scaleX(${percent})`;
  });

  useSubscription(
    up$,
    () => {
      isSeekingRef.current = false;
    },
    []
  );

  useSubscription(
    move$,
    e => {
      const { x } = getEventPosition(e);
      onSeek(x);
    },
    []
  );

  return (
    <div
      ref={containerRef}
      className={css`
        position: absolute;

        ${responsive(
          x => `
            bottom: ${x};
            right: ${x};
          `,
          60,
          60
        )};

        width: calc(100% - ${val(380)});

        ${mqSmall(css`
          left: 20px;
          width: calc(100% - 40px);
        `)}

        ${responsive(
          x => `
          height: ${x};
          padding: ${x} 0;
          `,
          15,
          15
        )};

        ${autoGrow('border-radius', 15)};
        overflow: hidden;
        transition: transform 0.2s ease;
        cursor: pointer;
        &:hover {
          transform: scaleY(1.5);
        }
      `}
      onClick={e => e.stopPropagation()}
      onMouseDown={() => {
        isSeekingRef.current = true;
      }}
      onTouchStart={() => {
        isSeekingRef.current = true;
      }}
      onMouseUp={onStopSeeking}
      onTouchEnd={onStopSeeking}
    >
      <div
        ref={timelineRef}
        className={css`
          position: absolute;
          background-color: white;
          ${autoGrow('height', 3)};
          ${autoGrow('border-radius', 3)};
          width: 100%;
          ${autoGrow('margin-top', -1)};
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
          transform-origin: left;
          will-change: transform;
        `}
      />
      <div
        className={css`
          background-color: rgba(255, 255, 255, 0.35);
          ${autoGrow('height', 1)};
          width: 100%;
        `}
      />
    </div>
  );
}
