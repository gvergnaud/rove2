import React from 'react';
import { usePromise } from './usePromise';
import { useIntersectionRef } from './useIntersection';
import { ScrollContext } from './useScroller';
import { Deffered } from '../utils/promises';

const useDeffered = <T>() => {
  const ref = React.useRef<Deffered<T>>();
  React.useEffect(() => {
    ref.current = new Deffered<T>();
  }, []);
  return ref;
};

export const useEnterAnimation = (
  ref: React.RefObject<HTMLElement>,
  {
    onInit,
    onEnter,
    onUnmount
  }: Partial<{
    onInit: (gsap: GSAP, el: HTMLElement) => void;
    onEnter: (gsap: GSAP, el: HTMLElement) => void;
    onUnmount: (gsap: GSAP, el: HTMLElement) => void;
  }>,
  threshold = 0.2,
  deps = []
) => {
  const hasEnteredRef = React.useRef(false);

  const onScroll = React.useContext(ScrollContext);

  const { gsap } = usePromise(() => import('../frontend-deps'), {}, []);

  const intersectionRef = useIntersectionRef(
    ref,
    React.useMemo(() => ({ threshold }), [threshold])
  );

  const deferredRef = useDeffered();

  React.useEffect(() => {
    if (!gsap) return;
    hasEnteredRef.current = false;

    onInit(gsap, ref.current);

    const cancelOnScroll = onScroll(() => {
      if (
        gsap &&
        intersectionRef.current &&
        intersectionRef.current.isIntersecting &&
        !hasEnteredRef.current
      ) {
        hasEnteredRef.current = true;
        deferredRef.current.resolve(onEnter(gsap, ref.current));
      }
    });

    return () => {
      cancelOnScroll();
      if (onUnmount) onUnmount(gsap, ref.current);
    };
  }, [gsap, intersectionRef, onScroll, ref, ...deps]);

  return deferredRef;
};
