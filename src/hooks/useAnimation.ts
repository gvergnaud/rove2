import React from 'react';
import { usePromise } from './usePromise';
import { spring } from '../utils/animations';

const useAnimationBase = (getState, setState, config, vars, deps) => {
  const gsapTargetRef = React.useRef(
    React.useMemo(() => config.from ?? config.to, [])
  );

  const gsap = usePromise(
    () => import('../frontend-deps').then(x => x.gsap),
    null,
    []
  );

  React.useEffect(
    () => {
      if (!gsap) return;

      const options = {
        ...vars,
        onUpdate: () => {
          setState(gsapTargetRef.current);
          if (vars.onUpdate) vars.onUpdate();
        }
      };

      gsap.killTweensOf(gsapTargetRef.current);

      switch (config.type) {
        case 'to':
          gsapTargetRef.current = gsapTargetRef.current;
          gsap.to(gsapTargetRef.current, {
            ...config.to,
            ...options
          });
          break;

        case 'fromTo':
          gsapTargetRef.current = config.from;
          gsap.fromTo(gsapTargetRef.current, config.from, {
            ...config.to,
            ...options
          });
          break;

        default:
          console.error(`unsupported type ${config.type}`);
          break;
      }
    },
    deps ? [gsap, ...deps] : [gsap]
  );

  return getState();
};

export const useAnimation = (config, vars, deps) => {
  const [animated, setAnimated] = React.useState(config.from ?? config.to);
  return useAnimationBase(() => animated, setAnimated, config, vars, deps);
};

export const useAnimationRef = (config, vars, deps) => {
  const animatedRef = React.useRef(config.from ?? config.to);
  useAnimationBase(
    () => animatedRef.current,
    x => {
      animatedRef.current = x;
    },
    config,
    vars,
    deps
  );
  return animatedRef;
};

export const useSpringRef = (
  value: number,
  config: { stiffness: number; damping: number } = {
    stiffness: 150,
    damping: 18
  }
) => {
  const ref = React.useRef(value);

  const onChange = React.useMemo(
    () =>
      spring(deltaY => {
        ref.current = deltaY;
      }, config),
    []
  );

  React.useEffect(() => {
    onChange(value);
  }, [value]);

  return ref;
};
