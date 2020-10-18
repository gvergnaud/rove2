import React from 'react';
import { css } from 'emotion';
import {
  lWindowPadding,
  fsSmall,
  ffSans,
  lWindowPaddingSmall,
  mqSmall,
  easeOutCubic,
  white,
  val,
  black
} from '../style/variables';
import { cn } from '../utils/css';
import useAppState from '../hooks/useAppState';
import Underlined from './Underlined';

type Link = { name: string; onClick: (e: React.MouseEvent) => void };

const Nav = ({
  className = '',
  links = [],
  mobileLinks = []
}: {
  className?: string;
  links: Link[];
  mobileLinks: Link[];
}) => {
  const [state] = useAppState();

  const listClassName = css`
    list-style-type: none;
    pointer-events: all;
    position: fixed;
    bottom: ${lWindowPadding};
    left: ${lWindowPadding};
    z-index: 5;
    pointer-events: ${state.isInterfaceHidden ? 'none' : 'all'};
    opacity: ${state.isInterfaceHidden ? '0' : '1'};
    transition: opacity 0.5s ease;

    ${mqSmall(css`
      bottom: auto;
      left: auto;
      top: ${lWindowPaddingSmall};
      right: ${lWindowPaddingSmall};
    `)}
  `;

  const itemClassName = css`
    ${fsSmall};
    text-transform: uppercase;
    font-weight: 600;
    font-family: ${ffSans};
    cursor: pointer;
    transition: color 0.5s ${easeOutCubic};

    ${state.theme === 'light'
      ? ''
      : css`
          color: ${white};
        `}
  `;

  return (
    <>
      <ul
        className={cn(
          className,
          listClassName,
          css`
            ${mqSmall(css`
              display: none;
            `)}
          `
        )}
      >
        {links.map(({ name, onClick }) => (
          <Underlined
            onClick={onClick}
            key={name}
            color={state.theme === 'light' ? black : white}
            width={val(30 + name.length * 8)}
            className={css`
              &:not(:first-child) {
                margin-top: ${val(4)};
              }
            `}
          >
            <li className={itemClassName}>{name}</li>
          </Underlined>
        ))}
      </ul>
      <ul
        className={cn(
          className,
          listClassName,
          css`
            display: none;
            ${mqSmall(css`
              display: block;
            `)}
          `
        )}
      >
        {mobileLinks.map(({ name, onClick }) => (
          <li key={name} onClick={onClick} className={itemClassName}>
            {name}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Nav;
