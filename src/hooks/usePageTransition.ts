import React from 'react';
import Router from 'next/router';
import useAppState from './useAppState';
import { delay } from '../utils/promises';
import { update, Animation } from '../components/Background';
import { ColorRgba } from '../style/variables';
import { Theme } from '../state';

export const pageTransitionDefaultDuration = 1.4;

export default function usePageTransition() {
  const [, actions] = useAppState();

  return React.useCallback(
    async ({
      color,
      href,
      fromColor,
      as,
      theme = 'dark',
      type = Animation.Forward,
      ease,
      duration = pageTransitionDefaultDuration
    }: {
      color: ColorRgba;
      href: string;
      fromColor?: ColorRgba;
      as?: string;
      theme?: Theme;
      type?: Animation;
      ease?: string;
      duration?: number;
    }) => {
      if (window.location.pathname === (as ?? href)) {
        return;
      }

      if (fromColor) {
        update({ animation: { type, color: fromColor, duration: 0 } });
        await delay(16);
      }
      actions.hideInterface();
      await delay(400);
      update({ animation: { type, color, ease, duration } });
      await delay(650);
      actions.setTheme(theme);
      await delay(400);
      Router.push(href, as);

      await new Promise<void>((resolve, reject) => {
        Router.events.on('routeChangeComplete', () => resolve());
        Router.events.on('routeChangeError', e => reject(e));
      });

      actions.showInterface();
    },
    [actions]
  );
}
