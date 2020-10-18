import { forwardRef, useRef } from 'react';
import { css } from 'emotion';
import { applyRef } from '../utils/dom';
import { cn } from '../utils/css';
import { Extend } from '../utils/types';
import useRelativeScrollYCssVar from '../hooks/useRelativeScrollYCssVar';

type Props = Extend<
  React.HTMLAttributes<HTMLDivElement>,
  {
    color?: string;
  }
>;

const Grain = forwardRef(
  (
    { color = 'transparent', className, children, ...props }: Props,
    forwardedRef
  ) => {
    const grainRef = useRef(null);
    const elRef = useRef(null);

    useRelativeScrollYCssVar(elRef);

    return (
      <div
        {...props}
        ref={applyRef(forwardedRef, elRef)}
        className={cn(
          className,
          css`
            background-color: ${color};
            overflow: hidden;
          `
        )}
      >
        <div
          ref={grainRef}
          className={css`
            position: absolute;
            width: 100%;
            height: 300%;
            top: -50%;
            left: 0;
            background-image: url('/static/images/tile-white.png');
            background-position-y: 0px;
            background-size: 250px 250px;
            background-repeat: repeat;
            transform: translateY(calc(var(--relative-scroll-y) * 0.25));
            will-change: transform;
          `}
        />
        {children}
      </div>
    );
  }
);

export default Grain;
