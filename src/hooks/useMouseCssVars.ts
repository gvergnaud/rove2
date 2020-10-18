import React from 'react';
import { useMouseTracker } from './useMouseTracker';
import { spring } from '../utils/animations';
import { useOnScroll } from './useScroller';

const useMouseCssVars = (
  ref: React.RefObject<HTMLElement>,
  mapper: (x: [number, number], isHover: boolean) => [number, number] = x => x,
  {
    stiffness = 150,
    damping = 17,
    initialMouse: [initialX, initialY] = [0, 0]
  }: Partial<{
    stiffness: number;
    damping: number;
    initialMouse: [number, number];
  }> = {}
) => {
  const [mouseTrackerRef, bind] = useMouseTracker(ref);

  const setMouseX = React.useMemo(
    () =>
      spring(
        x => {
          if (ref.current) ref.current.style.setProperty('--mouse-x', `${x}px`);
        },
        { stiffness, damping, initialValue: initialX }
      ),
    [ref]
  );

  const setMouseY = React.useMemo(
    () =>
      spring(
        y => {
          if (ref.current) ref.current.style.setProperty('--mouse-y', `${y}px`);
        },
        { stiffness, damping, initialValue: initialY }
      ),
    [ref]
  );

  useOnScroll(() => {
    const [x, y] = mapper(
      mouseTrackerRef.current.mouse,
      mouseTrackerRef.current.isHover
    );
    setMouseX(x);
    setMouseY(y);
  }, []);

  return bind;
};

export default useMouseCssVars;
