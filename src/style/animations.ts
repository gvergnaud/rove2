import { css, keyframes } from 'emotion';
import { val, easeOutExpo } from './variables';

export const appear3DInit = (fromY = 250) => css`
  opacity: 0;
  transform: translate3d(0, ${val(fromY)}, -50px) rotateX(8deg);
`;

export const appear3DEnter = (fromY: number) => keyframes`
  from {
    ${appear3DInit(fromY)}
  }

  60% {
    opacity: 1;
  }

  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotateX(0);
  }
`;

export const appear3D = (fromY: number) => css`
  ${appear3DInit(fromY)}
  transform-origin: bottom center;
  animation: ${appear3DEnter(fromY)} 1.5s ${easeOutExpo} forwards;
`;

export const fadeInInit = ({ x, y, fromY }) => css`
  opacity: 0;
  transform: translate3d(${x}, calc(${y} + ${fromY}), 0);
`;

export const fadeInEnter = ({ x, y, fromY }) => keyframes`
  from {
    ${fadeInInit({ x, y, fromY })}
  }

  to {
    opacity: 1;
    transform: translate3d(${x}, ${y}, 0);
  }
`;

export const fadeIn = ({ x = '0px', y = '0px', fromY = '20px' }) => css`
  ${fadeInInit({ x, y, fromY })};
  animation: ${fadeInEnter({ x, y, fromY })} 1.2s ease 0.3s forwards;
`;
