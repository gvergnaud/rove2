/* eslint-disable react/display-name */
import React from 'react';
import { css } from 'emotion';
import {
  ffSans,
  ffSerif,
  mqSmall,
  white,
  lWindowPadding,
  lWindowPaddingSmall,
  val,
  responsive,
  fsXL,
  autoGrow
} from '../style/variables';
import { cn } from '../utils/css';
import { Extend } from '../utils/types';

export const Container = React.forwardRef(
  (
    {
      className,
      color = white,
      ...props
    }: Extend<
      React.HTMLAttributes<HTMLDivElement>,
      {
        color?: string;
      }
    >,
    ref: React.RefObject<HTMLDivElement>
  ) => (
    <div
      {...props}
      ref={ref}
      className={cn(
        className,
        css`
          color: ${color};
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: ${val(325)} ${lWindowPadding};
          ${mqSmall(
            css`
              align-items: flex-start;
              padding: ${val(325)} ${lWindowPaddingSmall};
            `
          )}
        `
      )}
    />
  )
);

export const Big = React.forwardRef(
  (
    { className = '', ...props }: React.HTMLAttributes<HTMLParagraphElement>,
    ref: React.RefObject<HTMLParagraphElement>
  ) => {
    return (
      <p
        {...props}
        ref={ref}
        className={cn(
          className,
          css`
            font-family: ${ffSans};
            font-size: ${val(90)};
            ${mqSmall(css`
              font-size: 42px;
            `)}
          `
        )}
      />
    );
  }
);

export const Italic = React.forwardRef(
  (
    { className = '', ...props }: React.HTMLAttributes<HTMLSpanElement>,
    ref: React.RefObject<HTMLSpanElement>
  ) => {
    return (
      <span
        {...props}
        ref={ref}
        className={cn(
          className,
          css`
            font-family: ${ffSerif};
            font-style: italic;
          `
        )}
      />
    );
  }
);

export const Upper = React.forwardRef(
  (
    { className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>,
    ref: React.RefObject<HTMLHeadingElement>
  ) => (
    <h2
      {...props}
      ref={ref}
      className={cn(
        className,
        css`
          font-family: ${ffSans};
          ${responsive(x => `font-size: ${x}`, 20, 20, 200)};
          ${autoGrow('letter-spacing', 1)}
          text-transform: uppercase;
          line-height: 1;
        `
      )}
    />
  )
);

export const UpperTitle = React.forwardRef(
  (
    { className = '', ...props }: React.HTMLAttributes<HTMLHeadingElement>,
    ref: React.RefObject<HTMLHeadingElement>
  ) => (
    <h2
      {...props}
      ref={ref}
      className={cn(
        className,
        css`
          font-family: ${ffSans};
          line-height: 1;
          ${fsXL};
          text-transform: uppercase;
          ${autoGrow('letter-spacing', 1)}
          ${mqSmall(
            css`
              font-size: 42px;
            `
          )}
        `
      )}
    />
  )
);
