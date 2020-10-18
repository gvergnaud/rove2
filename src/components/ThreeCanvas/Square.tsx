import React from 'react';
import ShaderToy from './ShaderToy';
import { vec4, float } from '../../utils/layouts';
import { ColorRgba } from '../../style/variables';
import { Extend } from '../../utils/types';
import { useAnimationRef } from '../../hooks/useAnimation';
import { opacitySpringConfig } from '../../utils/animations';
import useValueRef from '../../hooks/useValueRef';

const fragmentShader = `
uniform vec4 color;
uniform float opacity;

void main() {
    gl_FragColor = mix(vec4(0.), color / vec4(255.0), opacity);
}
`;

type Props = Extend<
  React.HTMLAttributes<HTMLDivElement>,
  {
    colorRgba: ColorRgba;
    opacity?: number;
    zIndex?: number;
  }
>;

export default function Square({
  zIndex,
  colorRgba,
  opacity = 1,
  ...props
}: Props) {
  const opacityRef = useValueRef(opacity);

  return (
    <ShaderToy
      zIndex={zIndex}
      {...props}
      uniforms={() => ({
        color: vec4(colorRgba),
        opacity: float(opacityRef.current)
      })}
      fragmentShader={fragmentShader}
    />
  );
}
