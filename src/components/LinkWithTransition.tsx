import Router from 'next/router';
import React from 'react';
import usePageTransition from '../hooks/usePageTransition';
import { css } from 'emotion';
import { cn } from '../utils/css';

type Props = Parameters<ReturnType<typeof usePageTransition>>[0] & {
  children: React.ReactNode;
  onClick?: (done: () => void) => void;
  onMouseEnter?: React.HTMLAttributes<HTMLDivElement>['onMouseEnter'];
  onMouseMove?: React.HTMLAttributes<HTMLDivElement>['onMouseMove'];
  onMouseLeave?: React.HTMLAttributes<HTMLDivElement>['onMouseLeave'];
  className?: string;
  options?: { [k: string]: unknown };
  'data-anchor'?: string;
};

function LinkWithTransition(
  {
    children,
    color,
    theme,
    href,
    as,
    fromColor,
    type,
    ease,
    duration,
    className,
    'data-anchor': anchor,
    onClick,
    onMouseEnter,
    onMouseMove,
    onMouseLeave
  }: Props,
  ref
) {
  const onPageTransition = usePageTransition();
  React.useEffect(() => {
    Router.prefetch(href);
  }, [href]);

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      data-anchor={anchor}
      className={cn(
        className,
        css`
          cursor: pointer;
        `
      )}
      onClick={e => {
        e.preventDefault();
        if (onClick) {
          onClick(() =>
            onPageTransition({
              color,
              href,
              as,
              theme,
              fromColor,
              type,
              ease,
              duration
            })
          );
        } else {
          onPageTransition({
            color,
            href,
            as,
            theme,
            fromColor,
            type,
            ease,
            duration
          });
        }
      }}
    >
      {children}
    </div>
  );
}

export default React.forwardRef(LinkWithTransition);
