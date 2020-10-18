import * as React from 'react';
import { css } from 'emotion';
import BackgroundTrigger from '../../BackgroundTrigger';
import { Container, Italic, Upper, UpperTitle } from '../../DesignSystem';
import {
  blue,
  pinkRgba,
  white,
  ffSerif,
  mqSmall,
  responsive,
  lsectionSpace,
  blueRgba,
  val,
  mqNotSmall,
  valNumber,
  fontSize,
  autoGrow
} from '../../../style/variables';
import copy from '../../../copy';
import AnimatedCode from '../../AnimatedCode';
import Square from '../../ThreeCanvas/Square';
import useIsMobile from '../../../hooks/useIsMobile';
import useRelativeScrollYCssVar from '../../../hooks/useRelativeScrollYCssVar';
import { quadraticInOut } from '../../../utils/animations';
import { useFirstTimeInView } from '../../../hooks/useInView';
import { appear3D, appear3DInit } from '../../../style/animations';
import { cn } from '../../../utils/css';
import { applyRef } from '../../../utils/dom';

const Code = ({ icon }) => {
  const isMobile = useIsMobile();

  const className = css`
    align-self: flex-end;
    width: ${val(60)};
    height: ${val(60)};
    margin: ${val(50)};
    margin-bottom: ${val(150)};
    object-fit: contain;

    ${mqSmall(css`
      width: 42px;
      height: 42px;
      margin: 0;
      margin-bottom: 100px;
    `)}
  `;

  return isMobile.apple.device ? (
    <img
      width={valNumber(60, 60)}
      height={valNumber(60, 60)}
      className={className}
      src={`/static/images/hobocode/${icon}.png`}
    />
  ) : (
    <AnimatedCode
      zIndex={1}
      icon={icon}
      colorRgba={pinkRgba}
      width={valNumber(60, 60)}
      height={valNumber(60, 60)}
      className={className}
    />
  );
};

export const FloatingTitle = React.forwardRef<
  HTMLSpanElement,
  { children: React.ReactNode; heightRatio: number; transformStyle: string }
>(({ children, heightRatio, transformStyle }, ref) => {
  const titleRef = React.useRef();
  useRelativeScrollYCssVar(titleRef, heightRatio, quadraticInOut);

  return (
    <UpperTitle
      ref={applyRef(titleRef, ref)}
      className={css`
            color: ${white};
            ${autoGrow('max-width', 370)};
            position: absolute;
            left: calc((100vw - ${val(715)}) / 2);
            z-index: 0;
            
            ${transformStyle};

            @media (max-width: 1100px) {
              transform: translateY(0);
              position: relative;
              top: 0;
              left: 0;
              max-width: 370px;
              min-width: 320px;
              align-self: center;
              margin-bottom 80px;
            }
          `}
    >
      {children}
    </UpperTitle>
  );
});

export const JumpUp = ({ hasEntered, children }) => {
  return (
    <span
      className={cn(
        css`
          display: block;

          ${mqNotSmall(
            hasEntered
              ? css`
                  ${appear3D(300)};
                  animation-delay: 0.3s;
                  animation-duration: 2s;
                `
              : css`
                  ${appear3DInit(300)};
                `
          )}
        `
      )}
    >
      {children}
    </span>
  );
};

export const RightSideContent: React.FunctionComponent = ({ children }) => {
  const maxWidth = 715;
  return (
    <div
      className={css`
        ${responsive(x => `width: ${x}`, maxWidth, maxWidth, Infinity)}
        max-width: 100%;
      `}
    >
      {children}
    </div>
  );
};

const Services = () => {
  const titleRef = React.useRef();
  const hasEntered = useFirstTimeInView(titleRef);

  return (
    <BackgroundTrigger theme="dark" color={pinkRgba}>
      <div
        className={css`
          padding-top: calc(${lsectionSpace} * 1.5);
          ${mqSmall(css`
            padding-top: calc(${lsectionSpace} * 1);
          `)}
        `}
      >
        <Container
          id="services"
          className={css`
            align-items: flex-end;
            padding-top: calc(${lsectionSpace} * 3.5);
            padding-bottom: calc(${lsectionSpace} * 0.75);
            ${mqSmall(css`
              padding-top: ${val(325)};
              padding-bottom: 0;
            `)}
          `}
        >
          <FloatingTitle
            heightRatio={7}
            ref={titleRef}
            transformStyle={css`
              top: 200vh;
              transform: translateX(-50%)
                translateY(calc(45vh + var(--relative-scroll-y) * 0.5));
            `}
          >
            <JumpUp hasEntered={hasEntered}>
              {copy.home.services.weTakeCare}
              <br />
              {copy.home.services.ofEverything}
            </JumpUp>
          </FloatingTitle>
          <RightSideContent>
            <div
              className={css`
                padding-bottom: ${val(220)};
                ${mqSmall(css`
                  padding-bottom: 20px;
                `)}
              `}
            >
              <div
                className={css`
                  width: 100%;
                  display: flex;
                  flex-wrap: wrap;
                  z-index: 1;
                `}
              >
                {copy.home.services.services.map(({ title, icon }, index) => (
                  <Square
                    colorRgba={blueRgba}
                    key={title}
                    className={css`
                      display: flex;
                      flex-direction: column;
                      justify-content: space-between;

                      width: calc(50% - 25px);

                      padding: 50px;
                      margin-bottom: 50px;

                      ${mqSmall(css`
                        width: calc(100% - 100px);
                        margin-bottom: 30px;
                      `)}

                      &:nth-of-type(odd) {
                        margin-right: 50px;
                        ${mqSmall(css`
                          margin-right: 0;
                        `)}
                      }

                      &:nth-of-type(even) {
                        transform: translateY(50%);
                        ${mqSmall(css`
                          transform: translateX(100px);
                        `)}
                      }
                    `}
                  >
                    <Code icon={icon} />

                    <div>
                      <p
                        className={css`
                          font-family: ${ffSerif};
                          font-size: ${val(12)};
                          color: ${white};
                          margin-bottom: ${val(10)};
                        `}
                      >
                        {index + 1}.
                      </p>

                      <Upper
                        className={css`
                          color: ${white};
                          max-width: 50%;

                          ${mqSmall(css`
                            max-width: unset;
                            word-break: break-word;
                          `)}
                        `}
                      >
                        {title.slice(0, title.length - 6)}
                        <span
                          className={
                            index === 3
                              ? css`
                                  ${mqSmall(css`
                                    display: block;
                                  `)}
                                `
                              : ''
                          }
                        >
                          {title.slice(title.length - 6)}
                        </span>
                      </Upper>
                    </div>
                  </Square>
                ))}
              </div>
            </div>

            <div
              className={css`
                width: 100%;
                flex: 1;
                background-color: ${blue};
                ${autoGrow('padding', 150)};

                ${mqSmall(css`
                  padding: 40px;
                `)}
              `}
            >
              {copy.home.services.skills.map(skill => (
                <Italic
                  key={skill}
                  className={css`
                    display: block;

                    ${fontSize(30)}
                    line-height: 1;
                    color: ${white};
                    opacity: 0.3;

                    &:not(:first-of-type) {
                      ${autoGrow('margin-top', 50)};
                    }

                    ${mqSmall(css`
                      font-size: 22px;
                    `)}
                  `}
                >
                  {skill}
                </Italic>
              ))}
            </div>
          </RightSideContent>
        </Container>
      </div>
    </BackgroundTrigger>
  );
};

export default Services;
