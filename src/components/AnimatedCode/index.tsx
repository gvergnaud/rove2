import React from 'react';
import { css } from 'emotion';
import { vec4, float } from '../../utils/layouts';
import Video from '../ThreeCanvas/Video';
import shader from './shader.glsl';
import { useInView } from '../../hooks/useInView';
import { ColorRgba } from '../../style/variables';
import { applyRef } from '../../utils/dom';
import { useAnimationRef } from '../../hooks/useAnimation';
import useValueRef from '../../hooks/useValueRef';

const timeCodes = {
  arrow: 1 + 6 / 25,
  camera: 1 + 17 / 25,
  contact: 1 + 6 / 25,
  creative: 1 + 7 / 25,
  cross: 1 + 1 / 25,
  digital: 1 + 14 / 25,
  hat: 1 + 14 / 25,
  mountains: 1 + 16 / 25,
  prod: 1 + 19 / 25,
  round: 1 + 14 / 25,
  star: 2 + 1 / 25,
  strategy: 1 + 16 / 25
};

export type Props = {
  colorRgba: ColorRgba;
  icon: string;
  width: number;
  height: number;
  zIndex?: number;
  className?: string;
  playing?: boolean;
  opacity?: number;
};

function AnimatedCode(
  {
    zIndex,
    colorRgba,
    icon,
    width,
    height,
    className,
    playing,
    opacity = 1
  }: Props,
  ref
) {
  const elRef = React.useRef();
  const isFirst = React.useRef(true);
  const shouldAnimateIn = React.useRef(true);
  const [inView] = useInView(elRef);
  const [paddedInView] = useInView(elRef, { rootMargin: '300px' });

  const colorRgbaRef = useValueRef(colorRgba);

  const animatedRef = useAnimationRef(
    {
      type: 'to',
      to: {
        opacity
      }
    },
    {
      duration: 1.2,
      ease: 'ease.inOut'
    },
    [opacity]
  );

  React.useEffect(() => {
    if (!isFirst.current && !paddedInView) {
      shouldAnimateIn.current = false;
    }
    isFirst.current = false;
  }, [paddedInView]);

  return (
    <div
      ref={applyRef(elRef, ref)}
      className={className}
      style={{ width, height }}
    >
      <Video
        zIndex={zIndex}
        playing={playing !== undefined ? playing : inView}
        src={{
          src: `/static/images/hobocode/animated-code/${icon}_full.mp4`,
          loop: true,
          loopTimeCode: timeCodes[icon]
        }}
        className={css`
          display: block;
          height: ${height}px;
          width: ${width}px;
        `}
        fragmentShader={shader}
        uniforms={() => ({
          colorRgba: vec4(colorRgbaRef.current),
          opacity: float(animatedRef.current.opacity)
        })}
      />
    </div>
  );
}

export default React.forwardRef(AnimatedCode);
