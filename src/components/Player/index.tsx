import { fromEvent, empty, Observable, merge } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import ease from 'rx-ease';
import React from 'react';
import { css } from 'emotion';
import usePlayer from '../../hooks/usePlayer';
import TimeCode from './TimeCode';
import { fsSmall, white, mqSmall, autoGrow } from '../../style/variables';
import { valNumber } from '../../style/variables';
import useValueRef from '../../hooks/useValueRef';
import TimeProgress from './TimeProgress';
import useDebounce from '../../hooks/useDebounce';
import copy, { PlayerVideoName } from '../../copy';
import BackgroundTrigger from '../BackgroundTrigger';
import { appear3D } from '../../style/animations';
import NormalVideo from '../Video/NormalVideo';
import Underlined from '../Underlined';

const useWindowEvent = (
  eventName: string,
  handler: (e: any) => void,
  deps: unknown[]
) => {
  React.useEffect(() => {
    window.addEventListener(eventName, handler);
    return () => window.removeEventListener(eventName, handler);
  }, [eventName, ...deps]);
};

type Props = {
  videoName: PlayerVideoName;
};

const on = (event: string, el?: HTMLElement) =>
  process.browser ? fromEvent(el || window, event) : empty();

type MousePosition = [number, number];
const initMouse = (): MousePosition => [
  valNumber(380 - 50),
  (process.browser ? window.innerHeight : 800) - valNumber(120, 120)
];

const useMouse$ = elRef => {
  const [mouse$, setMouse$] = React.useState<Observable<MousePosition>>(
    empty()
  );
  React.useEffect(() => {
    setMouse$(
      merge(
        on('mousemove', elRef.current).pipe(
          map((e: MouseEvent) => [e.clientX, e.clientY] as MousePosition)
        ),
        on('mouseleave', elRef.current).pipe(map(() => initMouse()))
      ).pipe(
        startWith(initMouse()),
        ease([
          [120, 20],
          [120, 20]
        ])
      )
    );
  }, [elRef]);
  return mouse$;
};

export const Player = ({ videoName }: Props) => {
  const player = copy.player[videoName];

  const { onClose } = usePlayer();

  const containerRef = React.useRef<HTMLDivElement>();
  const videoRef = React.useRef<HTMLVideoElement>();
  const followMouseElRef = React.useRef<HTMLDivElement>();
  const isSeekingRef = React.useRef(false);

  const mouse$ = useMouse$(followMouseElRef);

  const [showInterface, setShowInterface] = React.useState(true);
  const showInterfaceRef = useValueRef(showInterface);

  const debouncedHideInterface = useDebounce(
    () => setShowInterface(false),
    2000,
    []
  );

  const onShowInterface = () => {
    setShowInterface(true);
    debouncedHideInterface();
  };

  React.useEffect(() => {
    debouncedHideInterface();
  }, []);

  useWindowEvent(
    'keydown',
    e => {
      // onClose will update the state and making the isClosed boolean true
      // ESCAPE
      if (e.which === 27) onClose(videoName);
      // SPACE
      if (e.which === 32) onTogglePlay();
      // F
      if (e.which === 70) onToggleFullScreen();
    },
    [onClose]
  );

  useWindowEvent(
    'mousemove',
    React.useCallback(() => {
      if (!showInterfaceRef.current) onShowInterface();
    }, []),
    []
  );

  const isPlayerFullScreen = React.useCallback(() => {
    return document.fullscreenElement === containerRef.current;
  }, []);

  const onToggleFullScreen = React.useCallback(() => {
    if (!document.fullscreenEnabled) return;
    try {
      if (isPlayerFullScreen()) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    } catch (e) {}
  }, []);

  const onTogglePlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || isSeekingRef.current) return;
    if (video.paused) video.play();
    else video.pause();
  }, []);

  const onPlay = React.useCallback(() => {
    const video = videoRef.current;
    if (!video || isSeekingRef.current) return;
    if (video.paused) video.play();
  }, []);

  const debouncedPlay = useDebounce(onPlay, 100, [onPlay]);

  const onSeekTo = React.useCallback((progress: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = progress * video.duration;
    debouncedPlay();
  }, []);

  return (
    <BackgroundTrigger color={player.backgroundRgba} theme={'dark'}>
      <div
        ref={containerRef}
        onClick={() => onTogglePlay()}
        onDoubleClick={onToggleFullScreen}
        className={css`
          width: 100vw;
          height: 100vh;

          perspective: 800px;
          perspective-origin: center;

          cursor: ${showInterface ? 'default' : 'none'};
        `}
      >
        <Underlined
          className={css`
            position: absolute;
            ${autoGrow('bottom', 60)};
            ${autoGrow('left', 60)};
            z-index: 6;

            ${mqSmall(css`
              top: 25px;
              right: 30px;
              bottom: auto;
              left: auto;
            `)}
          `}
          onClick={e => {
            e.stopPropagation();
            onClose(videoName);
          }}
          width={valNumber(70, 70) + 'px'}
        >
          <p
            className={css`
              color: ${white};
              text-transform: uppercase;
              ${fsSmall};
              cursor: pointer;
            `}
          >
            close
          </p>
        </Underlined>
        <NormalVideo
          muted={false}
          colorRgba={player.highlightRgba}
          videoRef={videoRef}
          lazy={false}
          src={player.videoUrls}
          className={css`
            position: absolute;
            object-fit: cover;
            width: 100vw;
            height: 100vh;

            ${appear3D(100)}

            ${mqSmall(css`
              video {
                object-fit: contain;
                background-color: black;
              }
            `)}

            @media (max-aspect-ratio: 16/9) {
              video {
                object-fit: contain;
                background-color: black;
              }
            }
          `}
        />
        <div
          ref={followMouseElRef}
          className={css`
            position: absolute;
            right: 0;
            width: 80vw;
            height: 80vh;
            z-index: 5;
          `}
        />
        <div
          style={{ opacity: showInterface ? 1 : 0 }}
          className={css`
            position: static;
            transition: opacity 0.5s ease;
          `}
        >
          <TimeCode mouse$={mouse$} videoRef={videoRef} />
          <TimeProgress
            isSeekingRef={isSeekingRef}
            videoRef={videoRef}
            onSeekTo={onSeekTo}
          />
        </div>
      </div>
    </BackgroundTrigger>
  );
};

export default Player;
