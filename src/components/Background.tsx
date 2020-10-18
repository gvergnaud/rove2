import React from 'react';
import { TextureLoader } from 'three';
import { BehaviorSubject } from 'rxjs';
import isEqual from 'lodash/isEqual';
import { float, vec4, texture, bool } from '../utils/layouts';
import ShaderToy from './ThreeCanvas/ShaderToy';
// @ts-ignore
import transition from '../shaders/transition.glsl';
import { blackRgba, ColorRgba } from '../style/variables';
import { distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { useObservable } from '../hooks/useObservable';
import { useScrollYRef } from '../hooks/useScroller';
import { useAnimationRef } from '../hooks/useAnimation';
import useValueRef from '../hooks/useValueRef';

type Props = {
  className?: string;
  animation?: {
    type: Animation;
    color: ColorRgba;
    duration?: number;
    ease?: string;
  };
};

type State =
  | {
      type: 'idle';
      color: ColorRgba;
    }
  | {
      type: 'animating';
    };

function useTwoLastValues<T>(value: T) {
  const previousValueRef = React.useRef(value);
  const currentValueRef = React.useRef(value);

  React.useEffect(() => {
    previousValueRef.current = currentValueRef.current;
    currentValueRef.current = value;
  }, [value]);

  return [previousValueRef, currentValueRef];
}

function usePrevious<T>(value: T) {
  const previousValueRef = React.useRef(value);

  React.useEffect(() => {
    previousValueRef.current = value;
  }, [value]);

  return previousValueRef.current;
}

export enum Animation {
  Forward = 'forward',
  Backward = 'backward',
  SlightForward = 'SlightForward',
  SlightBackward = 'SlightBackward'
}

export const currentColorRef = {
  current: undefined
};

const update$ = new BehaviorSubject({ animation: undefined });

export const update = (updates: Partial<Props>) =>
  update$.next({ ...update$.value, ...updates });

const props$ = update$.pipe(
  filter(x => !!x),
  distinctUntilChanged(
    (a, b) =>
      a.animation &&
      b.animation &&
      isEqual(a.animation.color, b.animation.color) &&
      isEqual(a.animation.type, b.animation.type)
  ),
  tap(({ animation }) => {
    currentColorRef.current = animation?.color;
  })
);

const withObservable = obs => Component => props => {
  const additionalProps = useObservable(obs, {});

  React.useEffect(() => {
    update(props);
  }, [props]);
  return <Component {...additionalProps} />;
};

let animatedRef;

const defaultDuration = 1.4;
const defaultEase = 'power2.out';

function Background({
  className,
  animation = {
    type: Animation.Forward,
    color: blackRgba,
    duration: defaultDuration,
    ease: defaultEase
  }
}: Props) {
  const [state, setState] = React.useState<State>({
    type: 'idle',
    color: animation.color
  });

  const stateRef = useValueRef(state);

  const [previousColorRef, currentColorRef] = useTwoLastValues(animation.color);
  const previousType = usePrevious(animation.type);

  const scrollYRef = useScrollYRef();

  animatedRef = useAnimationRef(
    {
      type:
        (!isEqual(previousColorRef.current, currentColorRef.current) &&
          animatedRef &&
          animatedRef.current.progress > 0.05 &&
          animatedRef.current.progress < 0.95) ||
        animation.type === Animation.SlightBackward
          ? 'to'
          : 'fromTo',
      from: {
        progress: [Animation.Forward, Animation.SlightForward].includes(
          animation.type
        )
          ? 0
          : 1
      },
      to: {
        progress:
          animation.type === Animation.SlightForward
            ? 0.27
            : animation.type === Animation.Forward
            ? 1
            : 0
      }
    },
    {
      duration: animation.duration ?? defaultDuration,
      ease: animation.ease ?? defaultEase,
      onUpdate: () => {
        const threshold = 0.1;
        const isFinished =
          (animation.type === Animation.Forward &&
            animatedRef.current.progress > 1 - threshold) ||
          (animation.type === Animation.Backward &&
            animatedRef.current.progress < threshold);

        if (isFinished && stateRef.current.type !== 'idle')
          setState({ type: 'idle', color: animation.color });
      }
    },
    [animation.color, animation.type]
  );

  React.useEffect(() => {
    setState({ type: 'animating' });
  }, [animation.color, animation.type]);

  const noiseTexture = React.useMemo(
    () =>
      process.browser
        ? new TextureLoader().load('/static/images/noise-resized.jpg')
        : null,
    []
  );

  const [grainOpacity, setGrainOpacity] = React.useState(0);

  const grainOpacityRef = useAnimationRef(
    {
      type: 'to',
      to: { value: grainOpacity }
    },
    { duration: 1, ease: 'ease' },
    [grainOpacity]
  );

  const grainTexture = React.useMemo(
    () =>
      process.browser
        ? new TextureLoader().load('/static/images/tile-white.png', () =>
            setGrainOpacity(1)
          )
        : null,
    []
  );

  return (
    <ShaderToy
      zIndex={-1}
      fixed
      className={className}
      fragmentShader={transition}
      uniforms={() => ({
        noTransition: bool(stateRef.current.type === 'idle'),
        color: vec4(currentColorRef.current),
        noiseTexture: texture(noiseTexture),
        grainTexture: texture(grainTexture),
        scrollY: float(scrollYRef.current),
        progress: float(animatedRef.current.progress),
        grainOpacity: float(grainOpacityRef.current.value),
        startColor: vec4(
          [Animation.Forward, Animation.SlightForward].includes(animation.type)
            ? previousColorRef.current
            : currentColorRef.current
        ),
        endColor: vec4(
          [Animation.Forward, Animation.SlightForward].includes(animation.type)
            ? currentColorRef.current
            : previousColorRef.current
        )
      })}
    />
  );
}

export default withObservable(props$)(Background);
