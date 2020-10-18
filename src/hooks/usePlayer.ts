import React from 'react';
import useIsMobile from './useIsMobile';
import usePageTransition from './usePageTransition';
import copy, { PlayerVideoName } from '../copy';
import { blackRgba, whiteRgba } from '../style/variables';
import { createLinkProps } from '../routes';
import { Animation } from '../components/Background';
import { delay } from '../utils/promises';

export default function usePlayer() {
  const isMobile = useIsMobile();
  const onPageTransition = usePageTransition();

  const onPlay = React.useCallback(
    async (
      videoName: PlayerVideoName,
      params?: Partial<Parameters<typeof onPageTransition>[0]>
    ) => {
      const { backgroundRgba = blackRgba } = copy.player[videoName];

      const { href, as } = createLinkProps('player', { videoName });
      await onPageTransition({
        color: backgroundRgba,
        href,
        as,
        theme: 'dark',
        ...params
      });
    },
    []
  );

  const onClose = React.useCallback(async (videoName: PlayerVideoName) => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      await delay(300);
    }

    const route = copy.player[videoName].backRoute;

    const { href, as } = createLinkProps(route.name, route.params);
    await onPageTransition({
      color:
        route.name === 'home'
          ? whiteRgba
          : route.name === 'casestudy'
          ? copy.caseStudy[route.params.name].backgroundRgba
          : blackRgba,
      href,
      as,
      theme: 'dark',
      type: Animation.Backward
    });
  }, []);

  return {
    onPlay,
    onClose
  };
}
