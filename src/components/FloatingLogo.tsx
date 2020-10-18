import React from 'react';

import { css } from 'emotion';
import Logo from '../components/ui/Logo';
import {
  lWindowPadding,
  mqSmall,
  black,
  whiteRgba,
  responsive,
  autoGrow
} from '../style/variables';
import LinkWithTransition from './LinkWithTransition';
import useAppState from '../hooks/useAppState';
import usePlayer from '../hooks/usePlayer';
import { useOnScroll, scrollToPercent } from '../hooks/useScroller';
import useValueRef from '../hooks/useValueRef';
import { createLinkProps } from '../routes';

const useHasScrolled = (threshold: number) => {
  const [hasScrolled, setHasScrolled] = React.useState(false);

  const hasScrolledRef = useValueRef(hasScrolled);

  useOnScroll(y => {
    const set = (x: boolean) => {
      if (x !== hasScrolledRef.current) setHasScrolled(x);
    };
    if (y >= threshold) set(true);
    else set(false);
  }, []);

  return hasScrolled;
};

export default function FloatingLogo({ className }: { className?: string }) {
  const [state] = useAppState();
  const { onClose } = usePlayer();
  const hasScrolled = useHasScrolled(400);

  const isHidden =
    state.route.name !== 'player' &&
    state.route.name === 'casestudy' &&
    !hasScrolled;

  return (
    <LinkWithTransition
      className={className}
      color={whiteRgba}
      theme={'light'}
      {...createLinkProps('home')}
      onClick={go => {
        if (state.route.name === 'home') scrollToPercent(0);
        else if (state.route.name === 'player') {
          onClose(state.route.params.videoName);
        } else go();
      }}
    >
      <a>
        <Logo
          color={state.theme === 'light' ? black : 'white'}
          className={css`
            ${autoGrow('width', 100)};
            position: fixed;
            top 0;
            left: 0;
            z-index: 5;
            margin: ${lWindowPadding};
            
            transition: opacity 0.5s ease;
            opacity: ${isHidden ? '0' : '1'};

            ${mqSmall(css`
              position: absolute;
              margin: 20px;
              opacity: 1;
            `)}
          `}
        />
      </a>
    </LinkWithTransition>
  );
}
