import { css } from 'emotion';
import React from 'react';
import { blackRgba, rgbaToCss } from '../../style/variables';
import { useInView } from '../../hooks/useInView';
import { Props } from './types';
import { applyRef } from '../../utils/dom';
import { Extend } from '../../utils/types';

function NormalImage(
  {
    src,
    className,
    colorRgba = blackRgba,
    zIndex: _zIndex,
    ...props
  }: Extend<React.HTMLAttributes<HTMLImageElement>, Props>,
  ref
) {
  const elRef = React.useRef();
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [inView] = useInView(elRef);
  const [shouldDisplay, setShouldDisplay] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (inView) setShouldDisplay(true);
  }, [inView]);

  React.useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    const handler = () => setIsLoaded(true);
    el.addEventListener('load', handler);
    return () => el.removeEventListener('load', handler);
  }, [shouldDisplay, imgRef]);

  return (
    <div
      ref={applyRef(elRef, ref)}
      style={{
        backgroundColor: rgbaToCss(colorRgba)
      }}
      className={className}
    >
      {shouldDisplay ? (
        <img
          {...props}
          ref={imgRef}
          src={src}
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
            ${isLoaded
              ? css`
                  opacity: 1;
                `
              : null}
          `}
        />
      ) : null}
    </div>
  );
}

export default React.forwardRef(NormalImage);
