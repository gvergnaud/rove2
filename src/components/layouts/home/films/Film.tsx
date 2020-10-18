import React from 'react';
import { css } from 'emotion';
import {
  mqSmall,
  val,
  fsLarge,
  white,
  easeOutQuint,
  fsSmall,
  autoGrow
} from '../../../../style/variables';

import Video from '../../../Video';
import LinkWithTransition from '../../../LinkWithTransition';
import { cn } from '../../../../utils/css';
import { createLinkProps } from '../../../../routes';
import useHoverVelocity from '../../../../hooks/useHoverVelocity';

const ratio = 780 / 440;
const videoZIndex = 2;

export const Film = ({
  src,
  mobileImageSrc,
  name,
  project,
  opacity,
  colorRgba
}) => {
  const [effectValue, velocityHandlers] = useHoverVelocity(x => x * 0.1);
  const [zoom, setZoom] = React.useState(1);

  return (
    <LinkWithTransition
      onMouseEnter={e => {
        velocityHandlers.onFlicker(5);
        setZoom(1.2);
      }}
      onMouseLeave={e => {
        velocityHandlers.onFlicker(5);
        setZoom(1);
      }}
      color={project.backgroundRgba}
      {...createLinkProps('casestudy', { name })}
      data-anchor={name}
      className={cn(
        'front',
        css`
          &:hover {
            div {
              opacity: 1;
            }

            .transition {
              transition: 0.5s ${easeOutQuint} 0.1s;
              transform: translateX(${val(20)});
              opacity: 1;
            }

            .transition.--delay-1 {
              transition-delay: 0.15s;
            }
          }

          ${mqSmall(
            css`
              width: calc(100vw - 80px);
              height: calc((100vw - 80px) / ${ratio});
            `
          )}
        `
      )}
    >
      <Video
        zoom={zoom}
        effectValue={effectValue}
        mobileImageSrc={mobileImageSrc}
        zIndex={videoZIndex}
        colorRgba={colorRgba}
        opacity={opacity}
        className={css`
          top: 0;
          left: 0;
          z-index: 1;
          width: calc(${val(780)});
          height: calc((${val(780)}) / ${ratio});

          ${mqSmall(
            css`
              width: calc(100vw - 80px);
              height: calc((100vw - 80px) / ${ratio});
            `
          )}
        `}
        src={src}
      />
      <div
        className={css`
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          ${autoGrow('padding', 20)};
          display: flex;
          flex-direction: column;
          justify-content: flex-end;

          background-image: linear-gradient(
            to right,
            hsla(0, 0%, 0%, 0.5) 0%,
            hsla(0, 0%, 0%, 0.494) 4.1%,
            hsla(0, 0%, 0%, 0.476) 7.9%,
            hsla(0, 0%, 0%, 0.448) 11.7%,
            hsla(0, 0%, 0%, 0.412) 15.6%,
            hsla(0, 0%, 0%, 0.37) 19.7%,
            hsla(0, 0%, 0%, 0.324) 24.1%,
            hsla(0, 0%, 0%, 0.275) 29%,
            hsla(0, 0%, 0%, 0.225) 34.4%,
            hsla(0, 0%, 0%, 0.176) 40.6%,
            hsla(0, 0%, 0%, 0.13) 47.6%,
            hsla(0, 0%, 0%, 0.088) 55.6%,
            hsla(0, 0%, 0%, 0.052) 64.7%,
            hsla(0, 0%, 0%, 0.024) 75.1%,
            hsla(0, 0%, 0%, 0.006) 86.8%,
            hsla(0, 0%, 0%, 0) 100%
          );
          z-index: 1;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;

          ${mqSmall(
            css`
              display: none;
            `
          )}

          .title {
            color: white;
            ${fsLarge}
          }

          .transition {
            opacity: 0;
            transform: translateX(${val(-20)});
            transition: 0.8s ease;
          }
        `}
      >
        <p className="title transition">{project.title}</p>
        <p
          className={cn(
            'transition',
            '--delay-1',
            css`
              ${fsSmall};
              font-weight: normal;
              color: ${white};
            `
          )}
        >
          {project.subtitle}
        </p>
      </div>
    </LinkWithTransition>
  );
};
