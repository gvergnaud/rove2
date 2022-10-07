import React from 'react';
import { updateAnimation, Animation, currentColorRef } from './Background';
import { ScrollContext } from '../hooks/useScroller';
import { useWindowSize } from '../hooks/useWindowSize';
import useAppState from '../hooks/useAppState';
import { ColorRgba } from '../style/variables';
import { State } from '../state';
import { useIntersectionRef } from '../hooks/useIntersection';
import { applyRef } from '../utils/dom';
import isEqual from 'lodash/isEqual';

const threshold = [
  0,
  0.05,
  0.1,
  0.15,
  0.2,
  0.25,
  0.3,
  0.35,
  0.4,
  0.45,
  0.5,
  0.55,
  0.6,
  0.65,
  0.7,
  0.75,
  0.8,
  0.85,
  0.9,
  0.95,
  1
];

type Props = {
  color: ColorRgba;
  children: React.ReactNode;
  theme: State['theme'];
  ratio?: number;
  track?: boolean;
};

const BackgroundTrigger: React.FC<Props> = (
  { color, children, theme, track, ratio = 0.5 },
  ref
) => {
  const [state, actions] = useAppState();
  const onScroll = React.useContext(ScrollContext);
  const elRef = React.useRef();
  const [width, height] = useWindowSize();
  const intersectionRef = useIntersectionRef(
    elRef,
    React.useMemo(() => ({ threshold }), [])
  );

  const wasMainRef = React.useRef(false);

  React.useEffect(() => {
    if (!state.isReady) return;

    return onScroll((y, delta) => {
      if (!intersectionRef.current) return;
      const rect = intersectionRef.current.boundingClientRect;

      const isForward = delta < 0;
      const isTopAboveHalf = rect.top < height * ratio;
      const isBottomUnderHalf = rect.bottom > height * ratio;
      const isMain = isTopAboveHalf && isBottomUnderHalf;

      if (isMain && !wasMainRef.current) {
        actions.setTheme(theme);

        if (!isEqual(color, currentColorRef.current)) {
          updateAnimation({
            type: isForward ? Animation.Forward : Animation.Backward,
            color
          });
        }
      }
      wasMainRef.current = isMain;
    });
  }, [onScroll, color, ratio, state]);

  return <div ref={applyRef(ref, elRef)}>{children}</div>;
};

export default React.forwardRef(BackgroundTrigger);
