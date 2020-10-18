import React from 'react';
import { useOffset } from './useOffset';
import { useScrollYRef } from './useScroller';

type State = { mouse: [number, number]; isHover: boolean };

export const useMouseTracker = (
  elRef: React.RefObject<HTMLElement>,
  initialMouse: [number, number] = [0, 0]
): [
  React.RefObject<State>,
  Pick<
    React.HTMLAttributes<HTMLElement>,
    'onMouseEnter' | 'onMouseLeave' | 'onMouseMove'
  >
] => {
  const stateRef = React.useRef<State>({ mouse: initialMouse, isHover: false });

  const offset = useOffset(elRef);

  const onMouseEnter = React.useCallback(() => {
    stateRef.current.isHover = true;
  }, []);

  const onMouseLeave = React.useCallback(() => {
    stateRef.current.isHover = false;
  }, []);

  const scrollYRef = useScrollYRef();

  const onMouseMove = React.useCallback(
    (e: any) => {
      const { left, top } = offset;

      const clientX = e.changedTouches
        ? e.changedTouches[0].clientX
        : e.clientX;
      const clientY = e.changedTouches
        ? e.changedTouches[0].clientY
        : e.clientY;

      let mouseX = clientX - left;
      let mouseY = clientY - top - scrollYRef.current;
      stateRef.current.mouse = [mouseX, mouseY];
    },
    [offset]
  );

  return [stateRef, { onMouseMove, onMouseEnter, onMouseLeave }];
};
