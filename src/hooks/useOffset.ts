import React from 'react';
import { ScrollContext } from './useScroller';
import { useWindowSize } from './useWindowSize';
import { PageIdContext } from '../components/Page';
import { useIntersectionRef } from './useIntersection';

const useOffsetBase = (getState, setState, ref) => {
  const pageId = React.useContext(PageIdContext);
  const onScroll = React.useContext(ScrollContext);
  const [width, height] = useWindowSize();
  const scrollYRef = React.useRef(0);
  const intersectionRef = useIntersectionRef(ref);
  const offset = getState();

  React.useEffect(() => {
    return onScroll(y => {
      scrollYRef.current = y;
    });
  }, [width, height, onScroll]);

  React.useEffect(() => {
    let interval;
    const start = () => {
      if (!ref.current || !intersectionRef.current) return null;
      const rect = intersectionRef.current.boundingClientRect;
      setState({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top + scrollYRef.current,
        bottom: rect.bottom + scrollYRef.current
      });
      clearInterval(interval);
    };

    start();
    interval = setInterval(start, 100);

    // excluding the ref on purpose
  }, [width, height, pageId]);

  return offset;
};

export const useOffset = ref => {
  const [offset, setOffset] = React.useState({
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  return useOffsetBase(() => offset, setOffset, ref);
};

export const useOffsetRef = ref => {
  const offsetRef = React.useRef({
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  });

  useOffsetBase(
    () => offsetRef.current,
    value => {
      offsetRef.current = value;
    },
    ref
  );

  return offsetRef;
};
