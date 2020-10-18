import React from 'react';
import { useOnScroll } from './useScroller';
import { linear, normalize, denormalize } from '../utils/animations';
import { useDistanceFromTopRef } from './useRelativeScrollYCssVar';

const useRelativeScrollYCssVar = (
  ref: React.RefObject<HTMLElement>,
  heightRatio = 1,
  mapper = linear
) => {
  const distanceFromTopRef = useDistanceFromTopRef(ref);

  useOnScroll(scrollY => {
    const threshold = window.innerHeight * heightRatio;
    if (
      ref.current &&
      Math.abs(scrollY - distanceFromTopRef.current) < threshold
    ) {
      const value = normalize(scrollY, -threshold, threshold);

      ref.current.style.setProperty(
        '--relative-scroll-y',
        mapper(denormalize(value, -threshold, threshold)) + 'px'
      );
    }
  }, []);
};

export default useRelativeScrollYCssVar;
