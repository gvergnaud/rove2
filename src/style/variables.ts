import memoize from 'lodash/memoize';
import { css } from 'emotion';
import { last } from '../utils/arrays';
import { between } from '../utils/numbers';

export type ColorRgba = number[];

export const rgbaToCss = (colorRgba: ColorRgba) =>
  `rgba(${colorRgba.slice(0, 3).join(', ')}, ${last(colorRgba) / 255})`;

export const mqSmallPx = 780;
export const mqMediumPx = 1440;

export const isSmall = width => width <= mqSmallPx;

export const valNumber = (
  x: number,
  minX: number = 0,
  maxX: number = Infinity,
  width = process.browser ? window.innerWidth : 1440
) => between(minX, maxX, (x / mqMediumPx) * width);

export const val = memoize(x => `${(x * 100) / mqMediumPx}vw`);

export const mobileVal = memoize(x => `${(x * 100) / 375}vw`);

export const responsive = memoize(
  (f: (val: string) => string, x: number, min?: number, max?: number) => css`
    ${f(val(x))};
    ${!min
      ? ''
      : `@media (max-width: ${(min / x) * mqMediumPx}px) {
          ${f(min + 'px')};
        }`}
    ${!max
      ? ''
      : `@media (min-width: ${(max / x) * mqMediumPx}px) {
          ${f(max + 'px')};
        }`}
  `
);

export const whiteRgba: ColorRgba = [255, 255, 255, 255];
export const blackRgba: ColorRgba = [13, 13, 13, 255];
export const blueRgba: ColorRgba = [10, 29, 112, 255];
export const pinkRgba: ColorRgba = [217, 163, 206, 255];
export const yellowRgba: ColorRgba = [249, 197, 0, 255];
export const greenRgba: ColorRgba = [175, 215, 221, 255];
export const orangeRgba: ColorRgba = [226, 88, 51, 255];
export const purpleRgba: ColorRgba = [202, 157, 195, 255];

export const black = '#0d0d0d';
export const white = '#ffffff';
export const yellow = '#efca47';
export const yellowBg = '#f2c537';
export const purple = '#ca9dc3';
export const purpleBg = '#c99dc3';
export const blue = rgbaToCss(blueRgba);
export const green = '#a2d4d9';
export const greenDark = '#4ebea5';
export const orange = '#e25833';
export const grey = '#7e7e7e';

export const autoGrow = (name: string, x: number) =>
  responsive(x => `${name}: ${x}`, x, x);

export const fontSize = (x: number) => autoGrow(`font-size`, x);

export const fsXL = responsive(x => `font-size: ${x}`, 50, 42);
export const fsLarge = fontSize(24);
export const fsMedium = fontSize(18);
export const fsSmall = fontSize(14);
export const fsXS = fontSize(12);

export const ffSerif = 'SuisseWorks, serif';
export const ffSans = 'SuisseBP, sans-serif';

export const lWindowPadding = val(50);
export const lWindowPaddingSmall = '30px';
export const lsectionSpace = '40vh';

export const mqSmall = memoize(
  style => css`
    @media (max-width: ${mqSmallPx}px) {
      ${style}
    }
  `
);

export const mqNotSmall = memoize(
  style => css`
    @media (min-width: ${mqSmallPx}px) {
      ${style}
    }
  `
);

export const mqMedium = memoize(
  style => css`
    @media (min-width: ${mqSmallPx}px) and (max-width: ${mqMediumPx}px) {
      ${style}
    }
  `
);

export const centerColumn = css`
  max-width: ${val(780)};
  ${mqSmall(css`
    max-width: 100%;
  `)}
`;

export const easeInQuad = 'cubic-bezier(.55, .085, .68, .53)';
export const easeInCubic = 'cubic-bezier(.550, .055, .675, .19)';
export const easeInQuart = 'cubic-bezier(.895, .03, .685, .22)';
export const easeInQuint = 'cubic-bezier(.755, .05, .855, .06)';
export const easeInExpo = 'cubic-bezier(.95, .05, .795, .035)';
export const easeInCirc = 'cubic-bezier(.6, .04, .98, .335)';

export const easeOutQuad = 'cubic-bezier(.25, .46, .45, .94)';
export const easeOutCubic = 'cubic-bezier(.215, .61, .355, 1)';
export const easeOutQuart = 'cubic-bezier(.165, .84, .44, 1)';
export const easeOutQuint = 'cubic-bezier(.23, 1, .32, 1)';
export const easeOutExpo = 'cubic-bezier(.19, 1, .22, 1)';
export const easeOutCirc = 'cubic-bezier(.075, .82, .165, 1)';

export const easeInOutQuad = 'cubic-bezier(.455, .03, .515, .955)';
export const easeInOutCubic = 'cubic-bezier(.645, .045, .355, 1)';
export const easeInOutQuart = 'cubic-bezier(.77, 0, .175, 1)';
export const easeInOutQuint = 'cubic-bezier(.86, 0, .07, 1)';
export const easeInOutExpo = 'cubic-bezier(1, 0, 0, 1)';
export const easeInOutCirc = 'cubic-bezier(.785, .135, .15, .86)';

export const easeInBounce = 'cubic-bezier(0.08, 0.57, 0.13, 1.5)';
