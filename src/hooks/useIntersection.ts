import React from 'react';

export const useIntersectionRef = (
  ref: React.RefObject<HTMLElement>,
  {
    rootMargin = '0px',
    threshold = [0, 1]
  }: Partial<{ rootMargin: string; threshold: number[] | number }> = {}
) => {
  const intersectionRef = React.useRef<IntersectionObserverEntry>();

  React.useEffect(() => {
    const el = ref.current;

    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) intersectionRef.current = entry;
      },
      {
        rootMargin,
        threshold
      }
    );
    observer.observe(el);

    return () => observer.unobserve(el);
  }, [ref, rootMargin, intersectionRef, threshold]);

  return intersectionRef;
};
