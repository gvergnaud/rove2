import React from 'react';
import { fromEvent, merge, of, empty } from 'rxjs';
import { take } from 'rxjs/operators';
import useValueRef from './useValueRef';
import { removeDomain } from '../utils/dom';

export type VideoConfig = { loop: boolean; loopTimeCode?: number; src: string };

const observeLoad = (video: HTMLVideoElement) =>
  merge(
    video.readyState >= 2 ? of(1) : empty(),
    fromEvent(video, 'loadeddata').pipe(take(1))
  );

export const useVideo = (
  config: VideoConfig,
  playing: boolean = true
): [boolean, React.RefObject<HTMLVideoElement>] => {
  const [isReady, setIsReady] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const onEnd = React.useCallback(() => {
    const { loop = false, loopTimeCode = 0 } = config;
    if (loop && playing) {
      videoRef.current.currentTime = loopTimeCode;
      if (videoRef.current.paused) videoRef.current.play();
    }
  }, [config, playing]);

  const onEndRef = useValueRef(onEnd);

  const onLoad = React.useCallback(() => {
    setIsReady(false);

    videoRef.current = document.createElement('video');

    const subs = [
      observeLoad(videoRef.current).subscribe(() => setIsReady(true)),
      fromEvent(videoRef.current, 'ended').subscribe(() => {
        onEndRef.current();
      })
    ];

    const { src } = config;

    videoRef.current.autoplay = true;
    videoRef.current.muted = true;
    videoRef.current.src = src;

    return () => subs.forEach(sub => sub.unsubscribe());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [firstPlaying, setFirstPlaying] = React.useState(playing);

  React.useEffect(() => {
    if (!firstPlaying && playing) setFirstPlaying(true);
  }, [playing]);

  React.useEffect(() => {
    if (firstPlaying) return onLoad();
  }, [firstPlaying]);

  return [isReady, videoRef];
};
