import { css } from 'emotion';
import UnderLineSVG from '../components/UnderLineSVG';
import { easeInOutCubic, val } from '../style/variables';
import { cn } from '../utils/css';
import { Extend } from '../utils/types';

type Props = Extend<
  React.HTMLAttributes<HTMLSpanElement>,
  {
    children: React.ReactNode;
    width?: string;
    color?: string;
  }
>;

const Underlined = ({
  children,
  width = '100px',
  color = '#fff',
  className,
  ...props
}: Props) => {
  const lineWidth = val(120);
  return (
    <span
      {...props}
      className={cn(
        className,
        css`
          display: block;
          width: ${width};
          cursor: pointer;
          .title-line {
            width: 0%;
          }

          &:hover {
            .title-line {
              width: 115%;
            }
          }
        `
      )}
    >
      <span>{children}</span>
      <span
        className={cn(
          'title-line',
          css`
            position: absolute;
            top: calc(100% - 15px);
            left: 0;
            will-change: width;
            width: 0%;
            height: 50px;
            overflow: hidden;
            transition: width 0.3s ${easeInOutCubic};
          `
        )}
      >
        <span
          className={css`
            display: block;
            width: ${lineWidth};
            height: calc(${lineWidth} * 5.1 / 156.8);
            position: absolute;
            left: calc(${width} - ${lineWidth});
          `}
        >
          <UnderLineSVG color={color} />
        </span>
      </span>
    </span>
  );
};

export default Underlined;
