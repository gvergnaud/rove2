import React from 'react';

export function useRaf(callback) {
  const callbackRef = React.useRef((n: number) => {});
  const timeRef = React.useRef(Date.now());

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    let n: number;

    const onTick = () => {
      const now = Date.now();
      callbackRef.current(now - timeRef.current);
      timeRef.current = now;
      n = requestAnimationFrame(onTick);
    };
    n = requestAnimationFrame(onTick);
    return () => cancelAnimationFrame(n);
  }, []);
}
