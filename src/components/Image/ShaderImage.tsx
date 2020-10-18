import React from 'react';
import { TextureLoader } from 'three';
import { vec2, float, texture, vec4, bool } from '../../utils/layouts';
import Image from '../ThreeCanvas/Image';
import rgbShift from '../../shaders/rgbShift.glsl';
import { ScrollContext } from '../../hooks/useScroller';
import { useAnimationRef, useSpringRef } from '../../hooks/useAnimation';
import { Props } from './types';
import { blackRgba } from '../../style/variables';
import useValueRef from '../../hooks/useValueRef';
import { opacitySpringConfig } from '../../utils/animations';

function ShaderImage(
  {
    zIndex,
    src,
    className,
    colorRgba = blackRgba,
    opacity = 1,
    borderNoise = false,
    effectValue = 0,
    onMouseEnter,
    onMouseLeave,
    onMouseMove
  }: Props,
  ref
) {
  const onScroll = React.useContext(ScrollContext);
  const deltaRef = React.useRef(0);
  const colorRgbaRef = useValueRef(colorRgba);
  const [imageOpacity, setImageOpacity] = React.useState(0);
  const borderNoiseRef = useValueRef(borderNoise);

  const effectFactorRef = useSpringRef(effectValue, {
    stiffness: 120,
    damping: 22
  });

  React.useEffect(() => {
    return onScroll((y, deltaY) => {
      deltaRef.current = deltaY;
    });
  }, [onScroll]);

  const animatedRef = useAnimationRef(
    {
      type: 'to',
      to: { opacity }
    },
    opacitySpringConfig,
    [opacity]
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

  const noiseTexture = React.useMemo(
    () =>
      process.browser
        ? new TextureLoader().load('/static/images/noise-resized.jpg')
        : null,
    []
  );

  return (
    <Image
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onMouseMove={onMouseMove}
      ref={ref}
      onLoad={() => setImageOpacity(1)}
      zIndex={zIndex}
      src={src}
      className={className}
      fragmentShader={rgbShift}
      uniforms={() => ({
        bgColor: vec4(colorRgbaRef.current),
        opacity: float(animatedRef.current.opacity),
        imageOpacity: float(imageOpacityAnimatedRef.current.imageOpacity),
        zoom: float(1),
        chromaFactor: vec2([0, deltaRef.current + effectFactorRef.current]),
        noiseTexture: texture(noiseTexture),
        borderNoise: bool(borderNoiseRef.current)
      })}
    />
  );
}

export default React.forwardRef(ShaderImage);
