import React from 'react';
import { css } from 'emotion';
import { vec2, float, texture, vec4, bool } from '../../utils/layouts';
import Video from '../ThreeCanvas/Video';
import rgbShift from '../../shaders/rgbShift.glsl';
import { useInView } from '../../hooks/useInView';
import { useAnimationRef, useSpringRef } from '../../hooks/useAnimation';
import { applyRef } from '../../utils/dom';
import { cn } from '../../utils/css';
import { useScrollYDeltaRef } from '../../hooks/useScroller';
import { Extend } from '../../utils/types';
import { Props } from '../Image/types';
import { blackRgba } from '../../style/variables';
import useValueRef from '../../hooks/useValueRef';
import { TextureLoader } from 'three';
import { opacitySpringConfig } from '../../utils/animations';

function ShaderVideo(
  {
    zIndex,
    colorRgba = blackRgba,
    track,
    src,
    className,
    maskRef,
    opacity = 1,
    effectValue = 0,
    zoom = 1,
    borderNoise = false
  }: Extend<React.HTMLAttributes<HTMLDivElement>, Props> & {
    track?: boolean;
    effectValue?: number;
    zoom?: number;
    maskRef?: React.RefObject<HTMLElement>;
  },
  ref
) {
  const elRef = React.useRef();
  const colorRgbaRef = useValueRef(colorRgba);
  const [inView] = useInView(elRef, { track });
  const deltaRef = useScrollYDeltaRef();
  const [imageOpacity, setImageOpacity] = React.useState(0);
  const borderNoiseRef = useValueRef(borderNoise);

  const effectFactorRef = useSpringRef(effectValue, {
    stiffness: 120,
    damping: 22
  });

  const opacityRef = useAnimationRef(
    {
      type: 'to',
      to: { value: opacity }
    },
    opacitySpringConfig,
    [opacity]
  );

  const zoomRef = useAnimationRef(
    {
      type: 'to',
      to: { value: zoom }
    },
    {
      duration: 1.5,
      ease: 'expo.out'
    },
    [zoom]
  );

  const noiseTexture = React.useMemo(
    () =>
      process.browser
        ? new TextureLoader().load('/static/images/noise-resized.jpg')
        : null,
    []
  );

  React.useEffect(() => {
    setImageOpacity(0);
  }, [src]);

  const imageOpacityAnimatedRef = useAnimationRef(
    {
      type: 'to',
      to: { imageOpacity }
    },
    {
      duration: 0.7,
      ease: 'power3.inOut'
    },
    [imageOpacity]
  );

  return (
    <Video
      maskRef={maskRef}
      onLoad={() => setImageOpacity(1)}
      zIndex={zIndex}
      ref={applyRef(elRef, ref)}
      track={track}
      src={{
        src,
        loop: true
      }}
      playing={inView}
      className={cn(
        className,
        css`
          display: block;
        `
      )}
      fragmentShader={rgbShift}
      uniforms={() => ({
        bgColor: vec4(colorRgbaRef.current),
        imageOpacity: float(imageOpacityAnimatedRef.current.imageOpacity),
        opacity: float(opacityRef.current.value),
        zoom: float(zoomRef.current.value),
        chromaFactor: vec2([0, deltaRef.current + effectFactorRef.current]),
        noiseFactor: float(Math.abs(deltaRef.current)),
        noiseTexture: texture(noiseTexture),
        borderNoise: bool(borderNoiseRef.current)
      })}
    />
  );
}

export default React.forwardRef(ShaderVideo);
