import React from 'react';
import { css } from 'emotion';
import {
  mqSmallPx,
  ffSerif,
  fsSmall,
  mqSmall,
  yellowRgba,
  lWindowPadding,
  lWindowPaddingSmall,
  purpleRgba,
  valNumber,
  autoGrow,
  val,
  ffSans,
  fsMedium,
  green,
  fsLarge,
  fsXL,
  greenDark,
  lsectionSpace,
  mobileVal
} from '../../../style/variables';
import Image from '../../Image';
import { Upper, UpperTitle, Container, Italic } from '../../DesignSystem';
import LogoInstagram from '../../ui/LogoInstagram';
import LogoVimeo from '../../ui/LogoVimeo';
import copy from '../../../copy';
import AnimatedCode from '../../AnimatedCode';
import BackgroundTrigger from '../../BackgroundTrigger';
import { useWindowSize } from '../../../hooks/useWindowSize';
import { FloatingTitle, RightSideContent, JumpUp } from './services';
import { useFirstTimeInView } from '../../../hooks/useInView';
import useHoverVelocity from '../../../hooks/useHoverVelocity';

const social = css`
  display: flex;
  align-items: center;
  color: inherit;
  text-decoration: none;

  &:not(:first-of-type) {
    ${autoGrow('margin-top', 18)}
  }
`;

const socialIcon = css`
  flex-shrink: 0;
  margin-right: 25px;
  ${autoGrow('height', 16)};
  ${autoGrow('width', 16)};
`;

const socialText = css`
  ${fsSmall};
  margin-top: ${val(3)};
  line-height: 1.25;
`;

const EffectImage = ({ width, height }) => {
  const [effectValue, velocityHandlers] = useHoverVelocity(x => x * 0.1);

  return (
    <Image
      onMouseEnter={() => {
        velocityHandlers.onFlicker(5);
      }}
      onMouseMove={velocityHandlers.onMouseMove}
      onMouseLeave={() => {
        velocityHandlers.onFlicker(5);
      }}
      effectValue={effectValue}
      colorRgba={purpleRgba}
      src="static/images/home/contact.png"
      className={css`
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: ${width}px;
        height: ${height}px;

        ${mqSmall(css`
          position: relative;
          left: auto;
          top: auto;
          transform: translate(0, 0);
        `)}
      `}
    />
  );
};

const Contact = () => {
  const [width, height] = useWindowSize();
  const imgHeight = React.useMemo(
    () => (width < mqSmallPx ? 420 : height * 0.7),
    [width]
  );
  const imgWidth = width < 568 ? width - 165 : (imgHeight * 330) / 600;

  const enterRef = React.useRef();
  const hasEntered = useFirstTimeInView(enterRef);

  return (
    <BackgroundTrigger theme="light" color={yellowRgba}>
      <div
        ref={enterRef}
        className={css`
          padding-top: calc(${lsectionSpace} * 3);

          ${mqSmall(css`
            padding-top: calc(${lsectionSpace} * 1.2);
          `)}
        `}
      >
        <Container
          className={css`
            align-items: flex-end;
          `}
        >
          <FloatingTitle
            heightRatio={2}
            transformStyle={css`
              top: 30vh;
              transform: translateX(-50%)
                translateY(calc(50vh + var(--relative-scroll-y) * 0.5));
            `}
          >
            <JumpUp hasEntered={hasEntered}>
              {copy.home.clients.weWorkWith}
            </JumpUp>
          </FloatingTitle>
          <RightSideContent>
            <ul>
              {copy.home.clients.clients.map(client => (
                <li
                  key={client}
                  className={css`
                    &:not(:first-child) {
                      ${autoGrow('margin-top', 30)}
                    }
                  `}
                >
                  <Italic
                    className={css`
                      ${fsXL};
                      color: ${greenDark};

                      ${mqSmall(css`
                        font-size: ${mobileVal(26)};
                      `)}
                    `}
                  >
                    {client}
                  </Italic>
                </li>
              ))}
            </ul>
          </RightSideContent>
        </Container>
      </div>
      <div
        id="contact"
        className={css`
          display: flex;
          justify-content: flex-end;
          align-items: center;
          width: 100vw;
          height: 100vh;
          padding: ${lWindowPadding};

          ${mqSmall(css`
            flex-direction: column;
            height: auto;
            padding: ${lWindowPaddingSmall};
            padding-bottom: 0;
            padding-top: 100px;
          `)}
        `}
      >
        <AnimatedCode
          icon={'contact'}
          width={valNumber(70, 70)}
          height={valNumber(35, 35)}
          colorRgba={[100, 188, 166, 255]}
          className={css`
            position: absolute;
            left: 30%;
            top: 45%;
          `}
        />

        <EffectImage width={imgWidth} height={imgHeight} />

        <div
          className={css`
            width: 50%;
            padding-left: 5%;

            ${mqSmall(css`
              width: 100%;
              padding-left: 0;
            `)}
          `}
        >
          <UpperTitle
            className={css`
              color: white;
              ${mqSmall(css`
                position: absolute;
                top: -210px;
                transform: translate(0, -50%);
                width: 100%;
                text-align: center;
              `)}
            `}
          >
            {copy.home.contact.getInTouch}
          </UpperTitle>
          <div
            className={css`
              margin: 45px 0;
              margin-left: ${imgWidth / 2}px;
              ${autoGrow('font-size', 16)};
              ${autoGrow('max-width', 160)};

              font-family: ${ffSans};
              ${fsSmall};
              color: white;
              font-weight: 300;

              ${mqSmall(css`
                font-size: 22px;
                margin-left: 0;
                max-width: unset;
                margin-bottom: 0;
              `)}
            `}
          >
            <div
              className={css`
                padding: 25px 0;
              `}
            >
              <p>{copy.home.contact.email}</p>
              <p>{copy.home.contact.phone}</p>
              <br />
              <p>{copy.home.contact.addressLine1}</p>
              <p>{copy.home.contact.addressLine2}</p>
            </div>

            <div
              className={css`
                padding: 0;
                ${autoGrow('padding-top', 25)}
                ${autoGrow('padding-bottom', 25)}

                font-family: ${ffSerif};
                ${fsSmall};
                color: white;
                font-weight: 600;

                &:before,
                &:after {
                  content: '';
                  position: absolute;
                  left: 0;
                  height: 1px;
                  width: 100%;
                  background-color: white;
                }

                &:before {
                  top: 0;
                }

                &:after {
                  bottom: 0;
                  ${mqSmall(css`
                    display: none;
                  `)}
                }
              `}
            >
              <a
                className={social}
                target="_blank"
                rel="noopener nofollower"
                href={copy.home.contact.instagram}
              >
                <LogoInstagram className={socialIcon} />
                <Upper className={socialText}>Instagram</Upper>
              </a>
              <a
                className={social}
                target="_blank"
                rel="noopener nofollower"
                href={copy.home.contact.vimeo}
              >
                <LogoVimeo className={socialIcon} />
                <Upper className={socialText}>vimeo</Upper>
              </a>
            </div>
          </div>
        </div>
      </div>
    </BackgroundTrigger>
  );
};

export default Contact;
