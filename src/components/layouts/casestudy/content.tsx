import React from 'react';
import { css } from 'emotion';
import copy, { Project } from '../../../copy';
import {
  ffSans,
  val,
  fsSmall,
  ffSerif,
  orangeRgba,
  mqSmall,
  blueRgba,
  yellowRgba,
  mqNotSmall,
  valNumber,
  white,
  responsive,
  fontSize,
  autoGrow,
  purpleRgba,
  greenRgba,
  pinkRgba,
  fsMedium,
  fsLarge
} from '../../../style/variables';
import { appear3D, fadeIn } from '../../../style/animations';

import { Container, Upper } from '../../DesignSystem';
import PlayIcon from '../../ui/PlayIcon';
import Image from '../../Image';
import AnimatedCode from '../../AnimatedCode';
import { dropRight, last, allEqual } from '../../../utils/arrays';
import Video from '../../Video';
import BackgroundTrigger from '../../BackgroundTrigger';
import LinkWithTransition from '../../LinkWithTransition';
import useAppState from '../../../hooks/useAppState';
import NormalVideo from '../../Video/NormalVideo';
import usePlayer from '../../../hooks/usePlayer';
import { Props as ImageProps } from '../../Image/types';
import useIsMobile from '../../../hooks/useIsMobile';
import { getButtonAttraction } from '../../../utils/animations';
import useMouseCssVars from '../../../hooks/useMouseCssVars';
import { cn } from '../../../utils/css';
import { createLinkProps } from '../../../routes';
import useRelativeScrollYCssVar from '../../../hooks/useRelativeScrollYCssVar';
import NormalImage from '../../Image/NormalImage';
import { update, Animation } from '../../Background';

type Props = {
  nextProjectName: string;
  project: Project;
  nextProject: Project;
};

const chunkProjects = xs =>
  xs.reduce((acc, x, index) => {
    const pageIndex = index % 6;
    switch (pageIndex) {
      case 0:
        return acc.concat([
          {
            type: 'leftUpper',
            medias: [x]
          }
        ]);

      case 1:
        return dropRight(acc, 1).concat([
          {
            type: 'leftUpper',
            medias: last(acc).medias.concat([x])
          }
        ]);

      case 2:
      case 6:
        return acc.concat([{ type: 'featured', medias: [x] }]);

      case 3:
        return acc.concat([
          {
            type: 'rightUpper',
            medias: [x]
          }
        ]);

      case 4:
        return dropRight(acc, 1).concat([
          {
            type: 'rightUpper',
            medias: last(acc).medias.concat([x])
          }
        ]);
    }
  }, []);

const ShaderMedia = (props: { type: 'image' | 'video' } & ImageProps) =>
  props.type === 'image' ? (
    <Image {...props} />
  ) : props.type === 'video' ? (
    <Video {...props} mobileImageSrc={''} />
  ) : null;

export default function Content({
  project,
  nextProjectName,
  nextProject
}: Props) {
  const { onPlay } = usePlayer();
  const [state] = useAppState();
  const isMobile = useIsMobile();

  const opacity = state.isInterfaceHidden ? 0 : 1;

  const titleRef = React.useRef<HTMLHeadingElement>();

  useRelativeScrollYCssVar(titleRef);

  const videoContainerRef = React.useRef<HTMLDivElement>();

  const bind = useMouseCssVars(videoContainerRef, ([x, y], isHover) =>
    isHover
      ? getButtonAttraction(
          [x, y / 3],
          [valNumber(880) - 100, valNumber(495) / 3 - 50]
        )
      : [0, 0]
  );

  return (
    <BackgroundTrigger theme={project.theme} color={project.backgroundRgba}>
      <Container
        className={css`
          ${mqSmall(
            css`
              padding-top: 80px !important;
            `
          )}
          ${mqNotSmall(
            css`
              padding-top: ${val(150)}!important;
            `
          )}
        `}
      >
        <div
          className={css`
            perspective: 800px;
            perspective-origin: center;
          `}
        >
          <div
            {...bind}
            ref={videoContainerRef}
            onClick={() => onPlay(project.player)}
            className={cn(
              css`
                ${appear3D(250)}
                cursor: pointer;
              `
            )}
          >
            {(() => {
              const props = {
                colorRgba: project.highlightRgba,
                className: css`
                  width: ${val(880)};
                  height: ${val(495)};
                  ${mqSmall(
                    css`
                      width: calc(100vw - 60px);
                      height: calc((100vw - 60px) * 0.5625);
                    `
                  )}
                `
              };

              return isMobile.any ? (
                <NormalImage src={project.videoLoopMobile} {...props} />
              ) : (
                <NormalVideo {...props} src={project.videoLoopUrl} />
              );
            })()}

            <Upper
              className={css`
                color: white;
                position: absolute;
                ${responsive(
                  x => `
                bottom: ${x};
                left: ${x};
                `,
                  50,
                  50
                )}
                cursor: pointer;
                transform: translate(var(--mouse-x), var(--mouse-y));
                text-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

                ${mqSmall(css`
                  left: 50%;
                  bottom: 50%;
                  transform: translate(-50%, 50%);
                `)}
              `}
            >
              <PlayIcon
                className={css`
                  ${autoGrow('height', 15)};
                  width: 20px;
                  margin-right: 20px;
                  ${mqSmall(css`
                    margin-right: 10px;
                  `)}
                `}
              />
              play
            </Upper>
          </div>
        </div>

        <h1
          ref={titleRef}
          className={cn(
            css`
              position: absolute;
              top: 0;
              left: 0;

              color: white;
              font-family: ${ffSans};
              font-weight: 600;
              font-size: ${val(210)};
              line-height: 1;
              z-index: -1;

              ${mqNotSmall(css`
                transform: translateY(calc(var(--relative-scroll-y) * 0.45));
              `)}

              ${mqSmall(
                css`
                  position: relative;
                  font-size: ${val(365)};
                  z-index: auto;
                `
              )};
            `
          )}
        >
          <span
            className={css`
              display: block;

              ${fadeIn({
                x: val(60),
                y: val(-30),
                fromY: '20px'
              })}

              ${mqSmall(
                css`
                  ${fadeIn({ x: '-35px', y: val(-70), fromY: '20px' })}
                `
              )};
            `}
          >
            {project.title}
          </span>
        </h1>

        <div
          className={css`
            width: 100%;
          `}
        >
          <div
            className={css`
              margin-top: ${val(225)};
              margin-left: calc(50% + ${val(30)});
              max-width: ${val(420)};

              ${mqSmall(
                css`
                  max-width: 100vw;
                  margin: 75px 0;
                `
              )}
            `}
          >
            <p
              className={css`
                ${fontSize(22)};
                font-weight: 600;
              `}
            >
              {project.description}
            </p>

            <p
              className={css`
                margin-top: 35px;
                ${fsSmall};
                font-family: ${fsSmall};
              `}
            >
              {project.credits.split('\n').map((credit, index) => (
                <React.Fragment key={index}>
                  {credit}
                  <br />
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>

        <div
          className={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            margin: 185px 0;

            ${mqSmall(
              css`
                margin: 75px 0;
              `
            )}
          `}
        >
          {isMobile.apple.device ? null : (
            <AnimatedCode
              opacity={opacity}
              icon={'strategy'}
              colorRgba={project.highlightRgba}
              width={valNumber(50, 50)}
              height={valNumber(50, 50)}
              className={css`
                position: absolute;
                top: 0%;
                right: 30%;
                transform: translateY(35px);

                ${mqSmall(
                  css`
                    top: 25%;
                    right: 75%;
                  `
                )}
              `}
            />
          )}
          {chunkProjects(project.medias).map((mediaChunk, index) => {
            return mediaChunk.type === 'featured' ? (
              <ShaderMedia
                borderNoise
                opacity={opacity}
                colorRgba={project.highlightRgba}
                key={index}
                type={mediaChunk.medias[0].type}
                src={mediaChunk.medias[0].src}
                className={css`
                  margin: ${val(200)} auto;
                  height: ${val(440)};
                  width: ${val(772)};

                  ${mqSmall(
                    css`
                      margin: ${val(200)} auto;
                      width: calc(100vw - 60px);
                      height: calc((100vw - 60px) * 0.5625);
                    `
                  )}
                `}
              />
            ) : mediaChunk.type === 'leftUpper' ||
              mediaChunk.type === 'rightUpper' ? (
              <div
                key={index}
                className={css`
                  display: flex;
                  justify-content: center;
                  padding-top: ${val(282 / 4)};

                  > *:not(:first-child) {
                    margin-left: ${val(60)};
                  }

                  ${mqSmall(
                    css`
                      padding-top: 0;
                      flex-direction: column;
                    `
                  )}
                `}
              >
                {mediaChunk.medias.map((media, mediaIndex) => (
                  <ShaderMedia
                    borderNoise
                    opacity={opacity}
                    colorRgba={
                      [
                        orangeRgba,
                        blueRgba,
                        yellowRgba,
                        allEqual(project.backgroundRgba, greenRgba)
                          ? pinkRgba
                          : greenRgba
                      ][(index + mediaIndex) % 4]
                    }
                    key={mediaIndex}
                    type={media.type}
                    src={media.src}
                    className={css`
                      height: ${val(282)};
                      width: ${val(495)};

                      ${mqSmall(
                        css`
                          width: ${val(800)};
                          height: calc(${val(800)} * 0.5625);
                          flex-direction: column;

                          margin-top: 0;

                          &:not(:first-child) {
                            margin-top: 30px;
                          }

                          &:nth-child(${mediaChunk.type === 'leftUpper'
                                ? 2
                                : 1}) {
                            align-self: flex-end;
                          }
                        `
                      )}

                      ${(mediaChunk.type === 'leftUpper' && !mediaIndex) ||
                      (mediaChunk.type === 'rightUpper' && mediaIndex)
                        ? css`
                            margin-top: ${val(-282 / 4)};
                          `
                        : css`
                            margin-top: ${val(282 / 4)};
                          `}
                    `}
                  />
                ))}
              </div>
            ) : null;
          })}
        </div>

        <div
          className={css`
            display: flex;
            flex-direction: column;
            justify-content: center;
            text-align: center;
            width: 100%;
          `}
        >
          {isMobile.apple.device ? null : (
            <AnimatedCode
              opacity={opacity}
              zIndex={10}
              icon={'digital'}
              colorRgba={project.highlightRgba}
              width={valNumber(50, 50)}
              height={valNumber(50, 50)}
              className={css`
                position: absolute;
                top: 18%;
                right: 20%;
              `}
            />
          )}
          <p
            className={css`
              font-family: ${ffSerif};
              text-transform: uppercase;
              ${fsSmall};
            `}
          >
            {copy.caseStudy.nextFilm}
          </p>
          <NextProjectLink
            nextProject={nextProject}
            nextProjectName={nextProjectName}
            project={project}
          />
        </div>
      </Container>
    </BackgroundTrigger>
  );
}

const NextProjectLink = ({ nextProject, nextProjectName, project }) => {
  const hasEnteredRef = React.useRef(false);
  const hasClickedRef = React.useRef(false);

  return (
    <LinkWithTransition
      ease={'power2.inOut'}
      type={Animation.Forward}
      onMouseEnter={() => {
        if (hasClickedRef.current) return;
        hasEnteredRef.current = true;
        update({
          animation: {
            ease: 'power2.out',
            type: Animation.SlightForward,
            color: nextProject.backgroundRgba,
            duration: 1.4
          }
        });
      }}
      onClick={go => {
        hasClickedRef.current = true;
        go();
      }}
      onMouseLeave={() => {
        if (hasClickedRef.current) return;
        if (!hasEnteredRef.current) return;
        update({
          animation: {
            type: Animation.SlightBackward,
            color: project.backgroundRgba,
            duration: 0.6,
            ease: 'power2.inOut'
          }
        });
      }}
      theme={nextProject.theme}
      color={nextProject.backgroundRgba}
      {...createLinkProps('casestudy', { name: nextProjectName })}
    >
      <h2
        className={css`
          margin-top: ${val(10)};
          color: white;
          font-size: ${val(90)};
          cursor: pointer;

          transition: color 0.2s ease;

          &:hover {
            color: rgba(255, 255, 255, 0.7);
          }
        `}
      >
        {nextProject.title}
      </h2>
    </LinkWithTransition>
  );
};
