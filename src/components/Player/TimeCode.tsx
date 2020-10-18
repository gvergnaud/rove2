import { Observable } from 'rxjs';
import React from 'react';
import { css } from 'emotion';

import { useRaf } from '../../hooks/useRaf';
import PlayIcon from '../ui/PlayIcon';
import { useObservable } from '../../hooks/useObservable';
import PauseIcon from '../ui/PauseIcon';
import { autoGrow, fsLarge, mqSmall, val } from '../../style/variables';

const getTimeDetail = (secs: number): [number, number, number, number] => {
  const hours = Math.floor(secs / (60 * 60));
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs) % 60;
  const frames = Math.floor(secs * 25) % 25;
  return [hours, minutes, seconds, frames];
};

const icon = css`
  ${autoGrow('width', 22)};
  ${autoGrow('height', 22)};
  ${autoGrow('margin-right', 16)};
`;

const formatTime = (time: number) => time.toString().padStart(2, '0');

function TimeCode({
  videoRef,
  mouse$
}: {
  videoRef: React.RefObject<HTMLVideoElement>;
  mouse$: Observable<[number, number]>;
}) {
  const [[hours, minutes, seconds, frames], setTime] = React.useState([
    0,
    0,
    0,
    0
  ]);
  const [isPlaying, setIsPlaying] = React.useState(false);

  useRaf(() => {
    if (!videoRef.current) return;
    setTime(getTimeDetail(videoRef.current.currentTime));
    const newIsPlaying = !videoRef.current.paused;
    if (isPlaying !== newIsPlaying) setIsPlaying(newIsPlaying);
  });

  const [x, y] = useObservable(mouse$, [0, 0]);

  return (
    <div
      draggable={false}
      className={css`
          position absolute;
          top: 0;
          left: 0;
          
          display: flex;
          align-items: center;

          ${fsLarge}
          color: white;
          text-shadow: 0 2px 5px rgba(0, 0, 0, .15);
          user-select: none;
          pointer-events: none;

          ${mqSmall(css`
            transform: translate(20px, calc(100vh - 100% - 90px)) !important;
          `)}
        `}
      style={{
        transform: `translate(${x - 10}px, calc(${y}px - 50%))`
      }}
    >
      {isPlaying ? (
        <PauseIcon className={icon} />
      ) : (
        <PlayIcon className={icon} />
      )}
      <p
        draggable={false}
        className={css`
          user-select: none;
          margin: 0;
          ${autoGrow('margin-top', 2)};
          ${autoGrow('width', 200)};
        `}
      >{`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(
        seconds
      )}:${formatTime(frames)}`}</p>
    </div>
  );
}

export default TimeCode;
