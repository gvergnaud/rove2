import React from 'react';
import { TextureLoader } from 'three';
import { float, texture } from '../utils/layouts';
import Image from './ThreeCanvas/Image';
import imageTransition from '../shaders/imageTransition.glsl';
import { useAnimationRef } from '../hooks/useAnimation';

type Props = {
  src: string;
  opacity: number;
  className?: string;
  zIndex?: number;
  hidden?: boolean;
};

function ImageTransitionLayer({
  className,
  src,
  opacity,
  zIndex,
  hidden
}: Props) {
  const animatedRef = useAnimationRef(
    {
      type: 'to',
      to: { opacity }
    },
    {
      duration: 0.5,
      ease: 'power2.inOut'
    },
    [opacity]
  );

  return (
    <Image
      hidden={hidden}
      src={src}
      zIndex={zIndex}
      fixed
      className={className}
      fragmentShader={imageTransition}
      uniforms={() => ({
        opacity: float(animatedRef.current.opacity)
      })}
    />
  );
}

export default ImageTransitionLayer;
