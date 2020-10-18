import React from 'react';
import { css } from 'emotion';
import {
  centerColumn,
  mqSmall,
  val,
  lsectionSpace,
  blackRgba
} from '../../../../style/variables';

import BackgroundTrigger from '../../../BackgroundTrigger';
import Video from '../../../Video';
import copy from '../../../../copy';
import useAppState from '../../../../hooks/useAppState';
import { cn } from '../../../../utils/css';
import ParallaxCode from '../../../ParallaxCode';
import { PresentationTexts } from './PresentationTexts';
import { Film } from './Film';
import { MobileTitle } from './MobileTitle';

const project = cn(
  centerColumn,
  css`
    margin-bottom: ${val(320)};
    ${mqSmall(
      css`
        margin-bottom: ${val(500)};
      `
    )}

    &:nth-of-type(odd) .back {
      bottom: 0;
    }

    &:nth-of-type(even) .back {
      top: 0;
    }

    &:nth-of-type(even) .front {
      display: block;
      ${mqSmall(
        css`
          margin-left: 80px;
        `
      )}
    }
  `
);

const videoContainer = css``;

const backImg = css`
  position: absolute;
  z-index: 0;
`;

const videoZIndex = 2;

const Films = () => {
  const [state] = useAppState();

  const opacity = state.isInterfaceHidden ? 0 : 1;

  return (
    <BackgroundTrigger theme="dark" color={blackRgba}>
      <div
        id="films"
        className={css`
          min-width: 100vw;
          min-height: 100vh;
          padding-bottom: calc(${lsectionSpace} * 0.25);
          ${mqSmall(
            css`
              min-height: unset;
            `
          )}
        `}
      >
        <PresentationTexts opacity={opacity} />
        <div
          className={css`
            ${centerColumn}
            margin: 0 auto;
          `}
        >
          <div
            className={cn(
              project,
              css`
                margin-top: ${val(160)};
                ${mqSmall(
                  css`
                    margin-top: 0;
                  `
                )}
              `
            )}
          >
            <div className={videoContainer}>
              <Video
                zIndex={videoZIndex}
                src={copy.home.films.projects.project1.backVideo}
                mobileImageSrc={copy.home.films.projects.project1.backImg}
                opacity={opacity}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project1.name]
                    .highlightRgba
                }
                className={cn(
                  'back',
                  backImg,
                  css`
                    right: ${val(-220)};
                    height: ${val(280)};
                    width: ${val(220)};

                    ${mqSmall(
                      css`
                        right: 0;
                        height: 100px;
                        width: 80px;
                      `
                    )};
                  `
                )}
              />
              <Film
                project={copy.caseStudy[copy.home.films.projects.project1.name]}
                name={copy.home.films.projects.project1.name}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project1.name]
                    .backgroundRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project1.frontImg}
                src={copy.home.films.projects.project1.frontVideo}
              />
            </div>

            <ParallaxCode
              opacity={opacity}
              icon={'round'}
              width={50}
              height={50}
              className={css`
                left: -16%;
                bottom: -30%;
              `}
            />
            <MobileTitle
              project={copy.caseStudy[copy.home.films.projects.project1.name]}
            />
          </div>

          <div className={project}>
            <div className={videoContainer}>
              <Video
                zIndex={videoZIndex}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project2.name]
                    .highlightRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project2.backImg}
                src={copy.home.films.projects.project2.backVideo}
                className={cn(
                  'back',
                  backImg,
                  css`
                    left: ${val(-100)};
                    height: ${val(550)};
                    width: ${val(445)};

                    ${mqSmall(
                      css`
                        left: 0;
                        height: 220px;
                        width: 180px;
                        bottom: 0;
                        top: auto !important;
                      `
                    )}
                  `
                )}
              />
              <Film
                project={copy.caseStudy[copy.home.films.projects.project2.name]}
                name={copy.home.films.projects.project2.name}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project2.name]
                    .backgroundRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project2.frontImg}
                src={copy.home.films.projects.project2.frontVideo}
              />
            </div>
            <ParallaxCode
              opacity={opacity}
              icon={'arrow'}
              width={40}
              height={80}
              className={css`
                left: 15%;
                bottom: -130%;
              `}
            />
            <ParallaxCode
              opacity={opacity}
              width={50}
              height={50}
              icon={'cross'}
              className={css`
                right: -40%;
                top: 100%;
              `}
            />
            <MobileTitle
              project={copy.caseStudy[copy.home.films.projects.project2.name]}
            />
          </div>

          <div
            className={cn(
              project,
              css`
                margin-top: ${val(475)};
                ${mqSmall(
                  css`
                    margin-top: 150px;
                  `
                )}
              `
            )}
          >
            <div className={videoContainer}>
              <Video
                zIndex={videoZIndex}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project3.name]
                    .highlightRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project3.backImg}
                src={copy.home.films.projects.project3.backVideo}
                className={cn(
                  'back',
                  backImg,
                  css`
                    right: ${val(-220)};
                    height: ${val(575)};
                    width: ${val(340)};

                    ${mqSmall(
                      css`
                        right: 0;
                        height: 220px;
                        width: 130px;
                      `
                    )}
                  `
                )}
              />

              <Film
                project={copy.caseStudy[copy.home.films.projects.project3.name]}
                name={copy.home.films.projects.project3.name}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project3.name]
                    .backgroundRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project3.frontImg}
                src={copy.home.films.projects.project3.frontVideo}
              />
            </div>

            <ParallaxCode
              opacity={opacity}
              icon={'camera'}
              width={60}
              height={50}
              className={css`
                right: 10%;
                bottom: -110%;
              `}
            />
            <MobileTitle
              project={copy.caseStudy[copy.home.films.projects.project3.name]}
            />
          </div>

          <div className={project}>
            <div className={videoContainer}>
              <Video
                zIndex={videoZIndex}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project4.name]
                    .highlightRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project4.backImg}
                src={copy.home.films.projects.project4.backVideo}
                className={cn(
                  'back',
                  backImg,
                  css`
                    left: ${val(-220)};
                    height: ${val(280)};
                    width: ${val(280)};

                    ${mqSmall(
                      css`
                        left: 0;
                        height: 100px;
                        width: 100px;
                      `
                    )}
                  `
                )}
              />

              <Film
                project={copy.caseStudy[copy.home.films.projects.project4.name]}
                name={copy.home.films.projects.project4.name}
                colorRgba={
                  copy.caseStudy[copy.home.films.projects.project4.name]
                    .backgroundRgba
                }
                opacity={opacity}
                mobileImageSrc={copy.home.films.projects.project4.frontImg}
                src={copy.home.films.projects.project4.frontVideo}
              />
            </div>
            <MobileTitle
              project={copy.caseStudy[copy.home.films.projects.project4.name]}
            />
          </div>
        </div>
      </div>
    </BackgroundTrigger>
  );
};

export default Films;
