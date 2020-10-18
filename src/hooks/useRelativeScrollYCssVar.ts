import React from 'react';
import { useOnScroll } from './useScroller';
import { useInViewRef } from './useInView';
import { linear, normalize, denormalize } from '../utils/animations';

export const useDistanceFromTopRef = (ref: React.RefObject<HTMLElement>) => {
  const distanceFromTopRef = React.useRef(0);
  const isFirstRef = React.useRef(true);

  React.useEffect(() => {
    const handler = () => (isFirstRef.current = true);
    window.addEventListener('resize', handler);
    return () => window.addEventListener('resize', handler);
  }, []);

  useOnScroll(y => {
    if (!isFirstRef.current) return;
    isFirstRef.current = false;
    if (ref.current)
      distanceFromTopRef.current = ref.current.getBoundingClientRect().top + y;
    else console.error('distanceFromTop error: no element on el ref.');
  }, []);

  return distanceFromTopRef;
};

const useRelativeScrollYCssVar = (
  ref: React.RefObject<HTMLElement>,
  heightRatio = 1,
  easing = linear
) => {
  const distanceFromTopRef = useDistanceFromTopRef(ref);

  useOnScroll(scrollY => {
    const threshold = window.innerHeight * heightRatio;
    if (
      ref.current &&
      Math.abs(scrollY - distanceFromTopRef.current) < threshold
    ) {
      const value = easing(
        normalize(scrollY - distanceFromTopRef.current, -threshold, threshold)
      );

      ref.current.style.setProperty(
        '--relative-scroll-y',
        denormalize(value, -threshold, threshold) + 'px'
      );
    }
  }, []);
};

export default useRelativeScrollYCssVar;
