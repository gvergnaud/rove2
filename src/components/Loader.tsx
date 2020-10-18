import React from 'react';
import Logo from './ui/Logo';
import useAppState from '../hooks/useAppState';
import { css, keyframes } from 'emotion';
import {
  black,
  white,
  val,
  easeInOutQuint,
  whiteRgba,
  mqSmall,
  responsive,
  blackRgba
} from '../style/variables';
import { delay } from '../utils/promises';
import { update, Animation } from './Background';
import useValueRef from '../hooks/useValueRef';
import copy from '../copy';
import LogoIndependantLetters from './ui/LogoIndependantLetters';
import { loadImage, loadVideo } from '../utils/dom';
import { isSlowNetwork } from '../utils/connection';
import useIsMobile from '../hooks/useIsMobile';

const ratio = 2.4;
const height = 70;
const heightMobile = 50;
const width = height * ratio;

const appear = (y: string) => keyframes`
  from {
    transform: translateY(${y});
  }

  to {
    transform: translateY(0);
  }
`;

const disappear = (y: string) => keyframes`
  from {
    transform: translateY(0);
  }

  to {
    transform: translateY(-${y});
  }
`;

const logoAnimationStyle = (logoHidden: boolean, y: string, delay = 0) =>
  logoHidden
    ? css`
        transform: translateY(0);
        animation: ${disappear(y)} 0.8s ${easeInOutQuint} ${delay}s forwards;
      `
    : css`
        transform: translateY(${y});
        animation: ${appear(y)} 1.2s ${easeInOutQuint} ${0.5 - delay}s forwards;
      `;

export default function Loader() {
  const [logoHidden, setLogoHidden] = React.useState(false);

  const [state, actions] = useAppState();

  const stateRef = useValueRef(state);

  const isMobile = useIsMobile();

  React.useEffect(() => {
    const enter = delay(2000);

    const removeLoader = async () => {
      await enter;

      setLogoHidden(true);

      await delay(700);

      update({
        animation: {
          type: Animation.Forward,
          color:
            stateRef.current.route.name === 'casestudy'
              ? copy.caseStudy[stateRef.current.route.params.name]
                  .backgroundRgba
              : stateRef.current.route.name === 'home'
              ? whiteRgba
              : blackRgba
        }
      });

      await delay(1400);

      actions.showInterface();
      actions.setReady();
    };

    const documentReady = new Promise(resolve => {
      if (window.document.readyState) resolve();

      window.addEventListener('load', resolve);
      return () => window.removeEventListener('load', resolve);
    });

    type Media = { type: 'image' | 'video'; src: string };

    const slowNetwork = isSlowNetwork();

    // const preloadList: Media[] = [
    //   { type: 'image', src: '/static/images/tile-white.png' },
    //   { type: 'image', src: '/static/images/noise-resized.jpg' },
    //   ...(state.route.name === 'home'
    //     ? slowNetwork || isMobile.any
    //       ? []
    //       : [
    //           {
    //             type: 'video' as const,
    //             src: copy.home.showreel.videoLoopUrl
    //           },
    //           {
    //             type: 'video' as const,
    //             src: copy.home.films.projects.project1.frontVideo
    //           },
    //           {
    //             type: 'video' as const,
    //             src: copy.home.films.projects.project2.frontVideo
    //           },
    //           {
    //             type: 'video' as const,
    //             src: copy.home.films.projects.project3.frontVideo
    //           },
    //           {
    //             type: 'video' as const,
    //             src: copy.home.films.projects.project4.frontVideo
    //           }
    //         ]
    //     : [])
    // ];

    // const assetsLoaded = Promise.all([
    //   preloadList.map(({ type, src }) =>
    //     type === 'image' ? loadImage(src) : loadVideo(src)
    //   )
    // ]);

    // wait for loader enter transition to be finished
    delay(1000)
      .then(() => Promise.all([documentReady]))
      .then(() => removeLoader());
  }, []);

  return (
    <div
      className={css`
        position: absolute;
        left: 0;
        top: 0;
        height: 100vh;
        width: 100vw;
        z-index: 10;

        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        className={css`
          ${responsive(height => `height: ${height}`, height, heightMobile)};
          ${responsive(
            width => `width: ${width}`,
            width,
            heightMobile * ratio
          )};
          overflow: hidden;
        `}
      >
        <LogoIndependantLetters
          className={css`
            opacity: 0.2;

            .R {
              ${logoAnimationStyle(logoHidden, '115%')}
            }
            .O {
              ${logoAnimationStyle(logoHidden, '115%', 0.1)}
            }
            .V {
              ${logoAnimationStyle(logoHidden, '115%', 0.2)}
            }
            .E {
              ${logoAnimationStyle(logoHidden, '115%', 0.3)}
            }
          `}
          color={white}
        />
      </div>
    </div>
  );
}
