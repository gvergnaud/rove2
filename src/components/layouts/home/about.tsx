import * as React from 'react';
import { css } from 'emotion';
import {
  centerColumn,
  mqSmall,
  blueRgba,
  val,
  lsectionSpace,
  valNumber,
  isSmall,
  pinkRgba
} from '../../../style/variables';
import BackgroundTrigger from '../../BackgroundTrigger';
import { Container, Big, Italic } from '../../DesignSystem';
import copy from '../../../copy';
import { useEnterAnimation } from '../../../hooks/useEnterAnimation';
import ParallaxCode from '../../ParallaxCode';
import { delay } from '../../../utils/promises';

const textBlock = css`
  &:not(:first-child) {
    margin-top: ${val(160)};
  }
`;

const useTextAnimation = (
  ref: React.RefObject<HTMLElement>,
  getPromise: () => Promise<unknown>
) => {
  return useEnterAnimation(
    ref,
    {
      onInit: (gsap, el) => {
        if (isSmall(window.innerWidth)) return;

        const texts = [...el.querySelectorAll('[data-enter]')];
        gsap.set(texts, {
          y: valNumber(150),
          rotation: -5,
          opacity: 0
        });
      },
      onEnter: async (gsap, el) => {
        if (isSmall(window.innerWidth)) return;
        if (!el) return;

        await getPromise();

        const texts = [...el.querySelectorAll('[data-enter]')];
        const lines = [...el.querySelectorAll('[data-line]')];

        const duration = 1.4;

        const addLineAnimation = (tl: gsap.core.Timeline) =>
          lines.length
            ? tl.fromTo(
                lines,
                {
                  width: '0%'
                },
                {
                  width: '100%',
                  duration: 0.6,
                  ease: 'power3.in'
                },
                '-=1'
              )
            : tl;

        const tl = gsap.timeline();

        addLineAnimation(
          tl.fromTo(
            texts,
            {
              y: valNumber(150),
              rotation: -5,
              opacity: 0
            },
            {
              stagger: 0.2,
              duration,
              y: 0,
              rotation: 0,
              opacity: 1,
              ease: 'power3.out'
            }
          )
        );

        return delay((tl.duration() - 0.2) * 1000);
      }
    },
    0.6
  );
};

const About = () => {
  const texts1Ref = React.useRef();
  const deferred1Ref = useTextAnimation(texts1Ref, () => delay(350));

  const texts2Ref = React.useRef();
  const deferred2Ref = useTextAnimation(
    texts2Ref,
    () => deferred1Ref.current.promise
  );

  const texts3Ref = React.useRef();
  useTextAnimation(texts3Ref, () => deferred2Ref.current.promise);

  return (
    <BackgroundTrigger theme="dark" color={blueRgba}>
      <div
        className={css`
          min-width: 100vw;
          min-height: 100vh;
          padding-top: calc(${lsectionSpace} * 0.3);
          padding-bottom: calc(${lsectionSpace} * 0.5);
        `}
      >
        <Container
          className={css`
            padding-top: ${val(50)};
            padding-bottom: 0;
          `}
        >
          <div
            id="about"
            className={css`
              ${centerColumn}
              line-height: 1.25;
            `}
          >
            <div
              className={css`
                width: 100%;
              `}
            >
              <ParallaxCode
                height={60}
                width={60}
                colorRgba={pinkRgba}
                icon={'star'}
                className={css`
                  right: -10%;
                  top: 40vh;
                `}
              />
            </div>
            <div ref={texts1Ref} className={textBlock}>
              <Big data-enter className={css``}>
                {copy.home.about.weRoveThrough}
              </Big>
              <Big
                data-enter
                className={css`
                  margin-left: ${val(-150)};
                  ${mqSmall(css`
                    display: inline-block;
                    margin-left: 0;
                    max-width: 180px;
                  `)}
                `}
              >
                {copy.home.about.ideasAndConcepts},
              </Big>
              <Big
                data-enter
                className={css`
                  ${mqSmall(
                    css`
                      display: inline;
                    `
                  )}
                `}
              >
                {' '}
                {copy.home.about.guidedBy}
              </Big>
              <Big
                data-enter
                className={css`
                  margin-left: ${val(420)};
                  white-space: nowrap;
                  ${mqSmall(css`
                    display: inline;
                    margin-left: 0;
                  `)}
                `}
              >
                {' '}
                {copy.home.about.artDirection}
              </Big>
            </div>

            <div ref={texts2Ref} className={textBlock}>
              <Big
                data-enter
                className={css`
                  ${mqSmall(css`
                    margin-left: 50px;
                    width: calc(100% - 50px);
                  `)}
                `}
              >
                {copy.home.about.andTheWillTo}
              </Big>
              <Big
                data-enter
                className={css`
                  width: calc(100% + ${val(250)});
                  margin-left: ${val(-150)};
                  ${mqSmall(css`
                    display: inline;
                    margin-left: 0;
                    width: calc(100%);
                  `)}
                `}
              >
                <Italic>{copy.home.about.experiment}</Italic>{' '}
                {copy.home.about.newNarrative}
              </Big>
              <Big
                data-enter
                className={css`
                  margin-left: ${val(450)};

                  ${mqSmall(css`
                    display: inline;
                    margin-left: 0;
                  `)}
                `}
              >
                {' '}
                {copy.home.about.paths}
                <span
                  className={css`
                    display: block;
                    width: ${val(440)};
                    height: ${val(15)};
                    transform: translate(${val(-410)}, ${val(-60)});
                    z-index: -1;

                    ${mqSmall(css`
                      display: none;
                    `)}
                  `}
                >
                  <span
                    data-line
                    className={css`
                      display: block;
                      width: 0%;
                      height: ${val(15)};
                      overflow: hidden;
                    `}
                  >
                    <span
                      className={css`
                        display: block;
                        width: ${val(440)};
                        height: ${val(15)};

                        background-image: url(/static/images/home/line-path.png);
                        background-repeat: no-repeat;
                        background-size: contain;
                      `}
                    />
                  </span>
                </span>
              </Big>
            </div>

            <div ref={texts3Ref} className={textBlock}>
              <Big
                data-enter
                className={css`
                  width: calc(100% + 250px);
                  ${mqSmall(css`
                    display: inline;
                    width: calc(100% - 50px);
                  `)}
                `}
              >
                <span
                  className={css`
                    ${mqSmall(css`
                      display: inline-block;
                      margin-left: 50px;
                      width: calc(100% - 50px);
                    `)}
                  `}
                >
                  {copy.home.about.alongWithThe}
                </span>{' '}
                {copy.home.about.ambition}
              </Big>
              <Big
                data-enter
                className={css`
                  margin-left: -150px;
                  ${mqSmall(css`
                    display: inline;
                    margin-left: 0;
                  `)}
                `}
              >
                {' '}
                {copy.home.about.toChallenge}
              </Big>
              <Big data-enter>{copy.home.about.technicalSkills}</Big>
            </div>
          </div>
          <div
            className={css`
              width: 100%;
            `}
          >
            <ParallaxCode
              height={50}
              width={50}
              ratio={0.1}
              colorRgba={pinkRgba}
              icon={'digital'}
              className={css`
                right: 20%;
                top: 45vh;
              `}
            />
          </div>
        </Container>
      </div>
    </BackgroundTrigger>
  );
};

export default About;
