const defaultSecondPerFrame = 0.016;

// stepper :: Number -> Number -> Number -> Number? -> Number? -> Number? -> [Number, Number]
let reusedTuple = [0, 0];
function stepper(
  value,
  velocity,
  destValue,
  stiffness = 170,
  damping = 20,
  secondPerFrame = defaultSecondPerFrame,
  precision = 0.1
) {
  // Spring stiffness, in kg / s^2

  // for animations, destValue is really spring length (spring at rest). initial
  // position is considered as the stretched/compressed position of a spring
  const Fspring = -stiffness * (value - destValue);

  // Damping, in kg / s
  const Fdamper = -damping * velocity;

  // usually we put mass here, but for animation purposes, specifying mass is a
  // bit redundant. you could simply adjust k and b accordingly
  // let a = (Fspring + Fdamper) / mass
  const a = Fspring + Fdamper;

  const newVelocity = velocity + a * secondPerFrame;
  const newValue = value + newVelocity * secondPerFrame;

  if (
    Math.abs(newVelocity) < precision &&
    Math.abs(newValue - destValue) < precision
  ) {
    reusedTuple[0] = destValue;
    reusedTuple[1] = 0;
    return reusedTuple;
  }

  reusedTuple[0] = newValue;
  reusedTuple[1] = newVelocity;
  return reusedTuple;
}

export const spring = (
  f: (value: number, velocity: number) => void,
  {
    initialValue = 0,
    stiffness = 170,
    damping = 26,
    onComplete = (value: number) => {}
  } = {}
) => {
  let value = initialValue;
  let velocity = 0;
  let destValue;
  let unsubscribeFromPrevious;

  return (x: number) => {
    destValue = x;
    if (value === undefined) value = x;
    if (unsubscribeFromPrevious) unsubscribeFromPrevious();
    let isRunning = true;

    let previous = Date.now();

    const run = () => {
      const x = window.requestAnimationFrame(() => {
        const now = Date.now();
        [value, velocity] = stepper(
          value,
          velocity,
          destValue,
          stiffness,
          damping,
          (now - previous) / 1000
        );
        f(value, velocity);
        if (velocity !== 0 && isRunning) unsubscribeFromPrevious = run();
        if (velocity === 0) onComplete(value);
        previous = now;
      });
      return () => window.cancelAnimationFrame(x);
    };

    unsubscribeFromPrevious = run();
  };
};

export const getButtonAttraction = (
  [x, y],
  [maxX, maxY],
  factor: number = 15
): [number, number] => {
  return [
    quadraticOut((x - 50) / maxX) * factor,
    -quadraticOut(Math.abs(y - maxY) / maxY) * factor
  ];
};

export const normalize = (x: number, min: number, max: number) =>
  (x - min) / (max - min);

export const denormalize = (x: number, min: number, max: number) =>
  min + x * (max - min);

export const linear = (t: number) => t;

export const quarticInOut = (t: number) => {
  return t < 0.5 ? +8.0 * t ** 4.0 : -8.0 * (t - 1.0) ** 4.0 + 1.0;
};

export const quadraticOut = (t: number) => -t * (t - 2.0);

export const quadraticInOut = (t: number) => {
  const p = 2.0 * t * t;
  return t < 0.5 ? p : -p + 4.0 * t - 1.0;
};

export const qinticInOut = (t: number) => {
  return t < 0.5 ? +16.0 * t ** 5.0 : -0.5 * (2.0 * t - 2.0) ** 5.0 + 1.0;
};

export const cubicInOut = (t: number) => {
  return t < 0.5 ? 4.0 * t * t * t : 0.5 * (2.0 * t - 2.0 ** 3.0) + 1.0;
};

export const opacitySpringConfig = {
  duration: 0.4,
  ease: 'ease'
};
