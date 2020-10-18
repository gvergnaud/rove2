import React from 'react';
import useDebounce from './useDebounce';
import compose, { scan } from '../utils/functions';
import throttle from 'lodash/throttle';

export default function useHoverVelocity(
  mapper = (d: number) => d / 4
): [
  number,
  Pick<React.HTMLAttributes<HTMLElement>, 'onMouseMove' | 'onMouseLeave'> & {
    onFlicker: (v: number) => void;
  }
] {
  const [effectValue, setEffectValue] = React.useState(0);

  const debouncedReset = useDebounce(() => setEffectValue(0), 300, []);

  const onMouseMove = React.useMemo(
    () =>
      compose(
        throttle(
          compose(
            scan<[number, number], number, void>(
              ([, x], y) => [mapper(Math.abs(x - y)), y],
              [0, 0],
              ([delta]) => {
                setEffectValue(delta);
                debouncedReset();
              }
            ),
            e => (Math.abs(e.clientX) + Math.abs(e.clientY)) / 2
          ),
          16
        ),
        (e: React.MouseEvent) => e.nativeEvent
      ),
    []
  );

  const onMouseLeave = React.useCallback(() => setEffectValue(0), []);

  return [
    effectValue,
    {
      onMouseMove,
      onMouseLeave,
      onFlicker: (x: number) => {
        setEffectValue(x);
        debouncedReset();
      }
    }
  ];
}
