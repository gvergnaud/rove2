import { css } from 'emotion';
import React from 'react';
import { blackRgba, rgbaToCss } from '../../style/variables';
import { useInView } from '../../hooks/useInView';
import { applyRef } from '../../utils/dom';
import { Props } from '../Image/types';
import { Extend } from '../../utils/types';
import { useWindowSize } from '../../hooks/useWindowSize';

function Video(
  {
    zIndex,
    src,
    className,
    colorRgba = blackRgba,
    opacity: _opacity,
    onAnimationEnd,
    lazy = true,
    videoRef: externalVideoRef,
    ...props
  }: Extend<
    React.MediaHTMLAttributes<HTMLVideoElement>,
    Extend<
      Props,
      {
        src: string | { 1080: string; 720: string };
        videoRef?: React.RefObject<HTMLVideoElement>;
        lazy?: boolean;
        onAnimationEnd?: () => void;
      }
    >
  >,
  ref
) {
  const [width] = useWindowSize();
  const elRef = React.useRef<HTMLDivElement>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [inView] = useInView(elRef);
  const [shouldDisplay, setShouldDisplay] = React.useState(lazy ? false : true);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (inView) setShouldDisplay(true);
  }, [inView]);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    if (inView && el.paused) {
      el.play();
    } else if (!inView && !el.paused) {
      el.pause();
    }
  }, [inView, videoRef]);

  React.useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const handler = () => setIsLoaded(true);
    if (el.readyState >= 2) handler();
    el.addEventListener('loadeddata', handler);
    return () => el.removeEventListener('loadeddata', handler);
  }, [shouldDisplay, videoRef]);

  return (
    <div
      ref={applyRef(ref, elRef)}
      style={{
        backgroundColor: rgbaToCss(colorRgba)
      }}
      className={className}
      onAnimationEnd={onAnimationEnd}
    >
      {shouldDisplay ? (
        <video
          autoPlay
          loop
          muted
          {...props}
          ref={applyRef(videoRef, externalVideoRef)}
          className={css`
            object-fit: cover;
            display: block;
            position: absolute;
            top: 0;
            height: 100%;
            width: 100%;
            opacity: 0;
            transition: opacity 0.5s ease;
            background-color: #000;
            ${zIndex !== undefined
              ? css`
                  z-index: ${zIndex};
                `
              : ''}
            ${isLoaded
              ? css`
                  opacity: 1;
                `
              : null}
          `}
        >
          {!process.browser ? null : typeof src === 'string' ? (
            <source type="video/mp4" src={src} />
          ) : width < 1400 ? (
            <source type="video/mp4" src={src[720]} />
          ) : (
            <source type="video/mp4" src={src[1080]} />
          )}
        </video>
      ) : null}
    </div>
  );
}

export default React.forwardRef(Video);
