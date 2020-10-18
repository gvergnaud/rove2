import React from 'react';
import { css } from 'emotion';
import {
  yellow,
  lWindowPaddingSmall,
  purple,
  mqSmall,
  val,
  blackRgba,
  blueRgba,
  responsive,
  autoGrow,
  whiteRgba,
  valNumber
} from '../../../style/variables';
import { Upper } from '../../DesignSystem';
import PlayIcon from '../../ui/PlayIcon';
import NormalVideo from '../../Video/NormalVideo';
import Grain from '../../Grain';
import copy from '../../../copy';
import BackgroundTrigger from '../../BackgroundTrigger';
import Square from '../../ThreeCanvas/Square';
import usePlayer from '../../../hooks/usePlayer';
import useRelativeScrollYCssVar from '../../../hooks/useRelativeScrollYCssVar';
import useScrollYCssVar from '../../../hooks/useScrollYCssVar';
import useAppState from '../../../hooks/useAppState';
import useMouseCssVars from '../../../hooks/useMouseCssVars';
import { getButtonAttraction } from '../../../utils/animations';
import { appear3D, fadeIn } from '../../../style/animations';
import ParallaxCode from '../../ParallaxCode';
import useIsMobile from '../../../hooks/useIsMobile';
import { scrollToPercent, useScrollYRef } from '../../../hooks/useScroller';
import { delay } from '../../../utils/promises';
import NormalImage from '../../Image/NormalImage';

const showreelPaddingValue = 300;
const showreelPadding = val(showreelPaddingValue);

const Showreel = () => {
  const [showIcon, setShowIcon] = React.useState(false);
  const { onPlay } = usePlayer();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [state] = useAppState();
  const isMobile = useIsMobile();
  const opacity = state.isInterfaceHidden ? 0 : 1;

  useRelativeScrollYCssVar(containerRef);
  const scrollYRef = useScrollYRef();

  const videoContainerRef = React.useRef<HTMLDivElement>();

  const bind = useMouseCssVars(videoContainerRef, ([x, y], isHover) =>
    isHover
      ? getButtonAttraction(
          [x, y],
          [window.innerWidth * 0.72, window.innerHeight - 80]
        )
      : [0, 0]
  );

  const textContainerRef = React.useRef();
  useScrollYCssVar(textContainerRef, 2.5, value =>
    Math.min(valNumber(showreelPaddingValue), value)
  );

  return (
    <BackgroundTrigger theme="light" color={blackRgba}>
      <div
        ref={containerRef}
        id="showreel"
        className={css`
          display: flex;
          flex-direction: column;
          align-items: flex-end;

          perspective: 800px;
          perspective-origin: center;
        `}
      >
        <Square
          opacity={opacity}
          zIndex={1}
          colorRgba={[255, 255, 255, 255]}
          className={css`
            position: absolute;
            width: 100vw;
            height: 100vh;
            top: 0;
            left: 0;
            pointer-events: none;
          `}
        />
        {isMobile.any ? null : (
          <ParallaxCode
            playing={showIcon}
            opacity={opacity}
            zIndex={1}
            icon={'cross'}
            colorRgba={[162, 212, 217, 255]}
            width={50}
            height={50}
            className={css`
              position: absolute;
              left: 20%;
              top: 35%;

              ${mqSmall(css`
                left: 15%;
                top: 10%;
              `)}
            `}
          />
        )}

        <Grain
          color={yellow}
          className={css`
            width: ${val(325)};
            height: ${showreelPadding};
            max-width: 50vw;

            ${fadeIn({ fromY: '30px' })}

            animation-delay: .3s;

            z-index: -1;

            ${mqSmall(css`
              width: 50vw;
              height: 150px;
              animation-delay: 0.6s;
            `)}
          `}
        >
          <img
            src="static/images/home/films.png"
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: ${val(125)};
              transform: translate(${val(-10)}, ${val(50)});
              ${mqSmall(css`
                width: 90px;
                transform: translate(-10px, 80px);
              `)}
            `}
          />
          <img
            src="static/images/home/production.png"
            className={css`
              position: absolute;
              top: 0;
              left: 0;
              width: ${val(175)};
              transform: translate(${val(20)}, ${val(100)});
              ${mqSmall(css`
                width: 120px;
                transform: translate(12px, 110px);
              `)}
            `}
          />
        </Grain>

        <Grain
          color={purple}
          className={css`
            position: absolute;
            bottom: 0;
            left: 0;
            height: ${val(300)};
            width: 28vw;
            z-index: 0;

            ${appear3D(200)}

            ${mqSmall(css`
              position: relative;
              height: 150px;
              width: 100vw;
              animation-delay: 0.3s;
            `)}
          `}
        />

        <div
          {...bind}
          ref={videoContainerRef}
          onClick={async () => {
            if (Math.abs(scrollYRef.current) > 0) {
              scrollToPercent(0);
              await delay(500);
            }
            onPlay(copy.home.showreel.player, { fromColor: whiteRgba });
          }}
          className={css`
            cursor: pointer;
          `}
        >
          {(() => {
            const props = {
              colorRgba: blueRgba,
              onAnimationEnd: () => setShowIcon(true),
              className: css`
                height: 100vh;
                width: 72vw;
                overflow: hidden;

                ${appear3D(300)}

                video {
                  transform: translate(
                      0,
                      calc(-30% + var(--relative-scroll-y) * 0.6)
                    )
                    scale(1.3);
                }

                ${mqSmall(css`
                  height: 85vh;
                  width: 100vw;
                `)}
              `
            };

            return isMobile.any ? (
              <NormalImage
                src={copy.home.showreel.videoLoopMobile}
                {...props}
              />
            ) : (
              <NormalVideo
                lazy={false}
                zIndex={2}
                src={copy.home.showreel.videoLoopUrl}
                {...props}
              />
            );
          })()}

          <div
            className={css`
              position: absolute;
              ${responsive(
                x => `
                bottom: ${x};
                left: calc(${val(10)} + ${x});
                `,
                40,
                40
              )}
              z-index: 2;

              ${appear3D(600)}
              transition-delay: .4s;

              ${mqSmall(css`
                left: 30px;
                bottom: ${lWindowPaddingSmall};
              `)}
            `}
          >
            <div
              ref={textContainerRef}
              className={css`
                transform: translate(
                  0,
                  calc(-${showreelPadding} + var(--relative-scroll-y))
                );
              `}
            >
              <Upper
                className={css`
                  color: white;

                  cursor: pointer;
                  transform: translate(var(--mouse-x), var(--mouse-y));
                  text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                `}
              >
                <PlayIcon
                  className={css`
                    ${autoGrow('height', 15)};
                    width: 20px;
                    margin-right: 20px;
                  `}
                />
                {copy.home.showreel.play}
              </Upper>
            </div>
          </div>
        </div>
      </div>
    </BackgroundTrigger>
  );
};

export default Showreel;
