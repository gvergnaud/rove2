import React from 'react';
import { ScrollContext } from './useScroller';
import { useIntersectionRef } from './useIntersection';

const useInViewBase = (
  getState,
  setState,
  ref,
  { track = false, rootMargin = '0px' } = {}
) => {
  const onScroll = React.useContext(ScrollContext);
  const [inView, ratio] = getState();
  const intersectionRef = useIntersectionRef(
    ref,
    React.useMemo(() => ({ threshold: [0, 0.25, 0.5, 0.75, 1], rootMargin }), [
      rootMargin
    ])
  );
  const inViewRef = React.useRef(inView);
  const ratioRef = React.useRef(ratio);

  React.useEffect(() => {
    inViewRef.current = inView;
    ratioRef.current = ratio;
  }, [inView, ratio]);

  React.useEffect(() => {
    const handleScroll = () => {
      if (!intersectionRef.current) return;

      const inView = Boolean(
        intersectionRef.current && intersectionRef.current.isIntersecting
      );

      if (inView !== inViewRef.current) {
        // if (track) {
        //   console.log(ref, intersectionRef.current);
        // }

        inViewRef.current = inView;
        setState([inView]);
      }
    };

    return onScroll(handleScroll);
  }, [track, intersectionRef, onScroll, setState, ref]);

  return getState();
};

export const useInView = (ref, options = {}) => {
  const [state, setState] = React.useState([false, 0]);
  return useInViewBase(
    React.useCallback(() => state, [state]),
    setState,
    ref,
    options
  );
};

export const useInViewRef = (
  ref,
  options = {}
): [React.RefObject<boolean>, React.RefObject<number>] => {
  const inViewRef = React.useRef(false);
  const intersectionRatioRef = React.useRef(0);
  useInViewBase(
    React.useCallback(
      () => [inViewRef.current, intersectionRatioRef.current],
      []
    ),
    React.useCallback(([inView, ratio]) => {
      inViewRef.current = inView;
      intersectionRatioRef.current = ratio;
    }, []),
    ref,
    options
  );
  return [inViewRef, intersectionRatioRef];
};

export const useFirstTimeInView = (ref, options = {}): boolean => {
  const [firstTimeInView, setFirstTimeInView] = React.useState(false);
  useInViewBase(
    React.useCallback(() => [firstTimeInView], [firstTimeInView]),
    ([inView]) => {
      if (inView) setFirstTimeInView(true);
    },
    ref,
    options
  );
  return firstTimeInView;
};
