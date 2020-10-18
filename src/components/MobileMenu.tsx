import { css } from 'emotion';
import {
  fsSmall,
  black,
  mqSmall,
  purpleBg,
  green,
  ffSerif,
  mobileVal
} from '../style/variables';
import Grain from './Grain';
import Nav from './Nav';
import { Upper } from './DesignSystem';
import copy from '../copy';
import LogoVimeo from './ui/LogoVimeo';
import LogoInstagram from './ui/LogoInstagram';
import { appear3D, fadeIn } from '../style/animations';

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  homeRoutes: Parameters<typeof Nav>[0]['links'];
};

export default function MobileMenu({ isOpen, onToggle, homeRoutes }: Props) {
  return !isOpen ? null : (
    <div
      className={css`
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        display: none;
        z-index: 6;

        animation: fadein 0.25s ease;

        ${mqSmall(
          css`
            display: flex;
            flex-direction: column;
          `
        )}
      `}
    >
      <div
        className={css`
          height: ${mobileVal(85)};
          padding: ${mobileVal(30)};
          background-color: white;

          display: flex;
          align-items: center;
          justify-content: flex-end;
        `}
      >
        <p
          className={css`
            color: ${black};
            text-transform: uppercase;
            ${fsSmall};
            line-height: 1;
          `}
          onClick={onToggle}
        >
          close
        </p>
      </div>

      <div
        className={css`
          flex: 1;
          display: flex;
          flex-direction: column;
        `}
      >
        <Grain
          color={purpleBg}
          className={css`
            padding: ${mobileVal(45)} ${mobileVal(30)};
          `}
        >
          <ul>
            {homeRoutes.map((route, index) => (
              <li
                key={route.name}
                onClick={e => {
                  route.onClick(e);
                  onToggle();
                }}
                className={css`
                  margin: 0;
                  &:not(:first-child) {
                    margin-top: ${mobileVal(30)};
                  }
                `}
              >
                <Upper
                  className={css`
                    color: white;
                    font-size: ${mobileVal(22)};
                    ${appear3D(-100)};
                    animation-delay: ${0.2 + index * 0.075}s;
                  `}
                >
                  {route.name}
                </Upper>
              </li>
            ))}
          </ul>
        </Grain>
        <Grain
          color={green}
          className={css`
            flex: 1;
            padding: ${mobileVal(30)};
            font-family: ${ffSerif};
            ${fsSmall};
            color: white;
            font-weight: 600;
          `}
        >
          <div
            className={css`
              ${appear3D(-50)}
              animation-delay: .85s;
            `}
          >
            <p>{copy.home.contact.email}</p>
            <p>{copy.home.contact.phone}</p>
            <br />
            <p>{copy.home.contact.addressLine1}</p>
            <p>{copy.home.contact.addressLine2}</p>

            <div
              className={css`
                display: flex;
                margin-top: ${mobileVal(30)};

                > * {
                  height: ${mobileVal(25)};
                  width: ${mobileVal(25)};

                  &:not(:first-child) {
                    margin-left: ${mobileVal(30)};
                  }
                }
              `}
            >
              <a
                target="_blank"
                rel="noopener nofollower"
                href={copy.home.contact.instagram}
              >
                <LogoInstagram />
              </a>
              <a
                target="_blank"
                rel="noopener nofollower"
                href={copy.home.contact.vimeo}
              >
                <LogoVimeo />
              </a>
            </div>
          </div>
        </Grain>
      </div>
    </div>
  );
}
