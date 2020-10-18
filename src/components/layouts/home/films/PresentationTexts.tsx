import React from 'react';
import { css } from 'emotion';
import {
  centerColumn,
  mqSmall,
  val,
  valNumber
} from '../../../../style/variables';
import copy from '../../../../copy';
import ParallaxCode from '../../../ParallaxCode';
import { Container, Big, Italic } from '../../../DesignSystem';
import { useEnterAnimation } from '../../../../hooks/useEnterAnimation';
import useIsMobile from '../../../../hooks/useIsMobile';

export const PresentationTexts = ({ opacity }) => {
  const ref = React.useRef();
  const [isIconPlaying, setIsIconPlaying] = React.useState(false);
  const isMobile = useIsMobile();

  useEnterAnimation(ref, {
    onInit: (gsap, el) => {
      const titles = [...el.querySelectorAll('[data-enter]')];
      gsap.set(titles, {
        y: isMobile.any ? valNumber(150) : valNumber(250),
        rotation: -7,
        opacity: 0
      });
    },
    onEnter: (gsap, el) => {
      const titles = [...el.querySelectorAll('[data-enter]')];

      const tl = gsap.timeline();

      tl.fromTo(
        titles,
        {
          y: isMobile.any ? valNumber(150) : valNumber(250),
          rotation: -7,
          opacity: 0
        },
        {
          delay: 0.5,
          stagger: 0.3,
          duration: 1.3,
          y: 0,
          rotation: 0,
          opacity: 1,
          ease: 'power3.out'
        },
        'stagger'
      )
        .to(
          document.getElementById('title-line'),
          {
            duration: 1,
            width: '115%',
            ease: 'expo.inOut'
          },
          '-=.7'
        )
        .then(() => setIsIconPlaying(true));
    }
  });

  return (
    <Container
      className={css`
        padding-top: 60vh;
      `}
    >
      <ParallaxCode
        opacity={opacity}
        playing={isIconPlaying}
        icon={'mountains'}
        width={65}
        height={40}
        className={css`
          right: 19%;
          bottom: -10%;
        `}
      />
      <div
        ref={ref}
        className={css`
          ${centerColumn}
          line-height: 1.25;
        `}
      >
        <Big data-enter className={css``}>
          {copy.home.films.weAre}
          <Italic>{copy.home.films.rove}</Italic>
        </Big>
        <Big
          data-enter
          className={css`
            margin-left: ${val(150)};
            ${mqSmall(
              css`
                margin-left: 0;
              `
            )}
          `}
        >
          {copy.home.films.aStudioMaking}
        </Big>
        <Big
          data-enter
          className={css`
            margin-left: ${val(50)};
            ${mqSmall(
              css`
                margin-left: 0;
              `
            )}
          `}
        >
          <span>
            {copy.home.films.adjective}
            <span
              id="title-line"
              className={css`
                position: absolute;
                bottom: 0;
                left: 0;
                height: ${val(10)};
                will-change: width;
                width: 0%;
                overflow: hidden;
              `}
            >
              <span
                className={css`
                  position: absolute;
                  bottom: 0;
                  left: 0;
                  background: url('/static/images/home/line-beautiful.png')
                    no-repeat;
                  background-size: 100%;
                  height: ${val(10)};
                  width: ${val(350)};

                  ${mqSmall(
                    css`
                      width: 200px;
                    `
                  )}
                `}
              />
            </span>
          </span>{' '}
          {copy.home.films.films}
        </Big>
      </div>
    </Container>
  );
};
